import { AIMessage } from "@langchain/core/messages";
import { model } from "./model";
import { GraphState, questionAnswerSchema } from "./state";
import { END, START, StateGraph } from "@langchain/langgraph";
import { searchExecuter } from "./tools";


async function responder(state: typeof GraphState.State) {
  const currentDateTime = new Date().toLocaleString("sv-SE");

  const SYSTEM_PROMPT = `
    You'r an expert reseacher.

    Current Time: ${currentDateTime}
    
    1. Provide a detailed ~250 word answer.
    2. Reflect and Critique your answer. Be severe to maximize improvement.
    3. Recommend max 3 search queries to research information and improve your answer.
     4. Return searchQueries as a top-level field alongside answer and reflection.
       The reflection object must contain only missing and superfluous.
       Use this exact shape: { answer: string, reflection: { missing: string,
      superfluous: string }, searchQueries: string[], citations: { title: string, url: string }[] }.
    `;

  const llmWithStructure = model.withStructuredOutput(questionAnswerSchema);

  const response = await llmWithStructure.invoke([
    {
      role: "system",
      content: SYSTEM_PROMPT,
    },
    ...state.messages,
    {
      role: "system",
      content: `Reflect on the user's original question and the actions taken thus far. Respond using structured output.`,
    },
  ]);

  console.log(response)

  return {
    messages: [new AIMessage(JSON.stringify(response))],
  };
}

async function revisor(state: typeof GraphState.State){
  const currentDateTime = new Date().toLocaleString("sv-SE");

  const SYSTEM_PROMPT = `
    You are an expert editor and fact-checker.

    Current Time: ${currentDateTime}

    Review the draft answer and the research results in the conversation history.
    The user's original request is the source of truth for their intent.

    1. Preserve the draft's useful ideas and answer the user's original request directly.
    2. Use the research results to add accurate, relevant details where they improve the answer.
    3. Remove unsupported claims, repetition, vague statements, and information unrelated to the request.
    4. Do not invent facts, citations, URLs, or search results. If the research is insufficient, say only what can be supported.
    5. Match the appropriate tone, format, and length to the user's request.
    6. Return structured data with answer, reflection, searchQueries, and citations.
    7. citations must contain only sources actually used from the Tavily results, with their exact title and URL.
    8. Return an empty searchQueries array when no further research is needed.
  `;

  const llmWithStructure = model.withStructuredOutput(questionAnswerSchema);
  const response = await llmWithStructure.invoke([
    { role: "system", content: SYSTEM_PROMPT },
    ...state.messages,
  ]);

  return {
    messages: [new AIMessage(JSON.stringify(response))],
    revisionCount: state.revisionCount + 1,
  };
}

export const graph = new StateGraph(GraphState)
  .addNode("responder", responder)
  .addNode("searchExecuter", searchExecuter)
  .addNode("revisor", revisor)
  .addEdge(START, "responder")
  .addEdge("responder", "searchExecuter")
  .addEdge("searchExecuter", "revisor")
  .addConditionalEdges("revisor", (state) => {
    const lastMessage = state.messages.at(-1);
    if (!lastMessage) return END;

    const parsedResponse = JSON.parse(lastMessage.content as string);

    return state.revisionCount < 1 && parsedResponse.searchQueries.length > 0
      ? "searchExecuter"
      : END;
  });
