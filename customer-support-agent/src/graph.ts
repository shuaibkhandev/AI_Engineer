import { END, MemorySaver, START, StateGraph } from "@langchain/langgraph";
import { stateAnnotaion } from "./state";
import { model } from "./model";
import { getOffersTool } from "./tools";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { retrieverTool } from "./tools";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const rl = readline.createInterface({ input, output });


const marketingToolsByName = {
  [getOffersTool.name]: getOffersTool,
};

const marketingTools = Object.values(marketingToolsByName);
const marketingToolNode = new ToolNode(marketingTools);

const learningTools = [retrieverTool];
const learningToolNode = new ToolNode(learningTools);

async function frontDeskSupport(state: typeof stateAnnotaion.State) {
  const SYSTEM_PROMPT = `You are front line Support staff for Coder’s Gyan,an WE LIVE SOFT company that helps software developers excel in their careers through practical web development and Generative AI courses.

  Be concise in your responses.

  You can chat with students and help them with basic questions, but if the student is having a marketing or learning support query, do not try to answer the question directly or gather information. Instead, immediately transfer them to the marketing team (promo codes, discounts, offers, and special campaigns) or learning support team (courses, syllabus coverage, learning paths, and study strategies) by asking the user to hold for a moment. Otherwise, just respond conversationally.`;

  const frontDeskResponse = await model.invoke([
    {
      role: "system",
      content: SYSTEM_PROMPT,
    },
    ...state.messages,
  ]);

  const CATEGORIZATION_SYSTEM_PROMPT = `
  You are an expert customer support routing system.
  Your job is to detect whether a customer support representative is routing a user to a marketing team or learning support team, or if they are just responding conversationally.
`;

  const CATEGORIZATION_HUMAN_PROMPT = `The previous conversation is an interaction between a customer support representative and a user.
  Extract whether the representative is routing the user to a marketing team or learning support team, or whether they are just responding conversationally.
  Respond with a JSON object containing a single key called "nextRepresentative" with one of the following values:

  If they want to route the user to the marketing team, respond with "MARKETING".
  If they want to route the user to the learning support team, respond with "LEARNING".
  Otherwise, respond only with the word "RESPOND".`;

  const categorizationResponse = await model.invoke(
    [
      {
        role: "system",
        content: CATEGORIZATION_SYSTEM_PROMPT,
      },
      ...state.messages,
      frontDeskResponse,
      {
        role: "user",
        content: CATEGORIZATION_HUMAN_PROMPT,
      },
    ],
    {
      response_format: {
        type: "json_object",
      },
    },
  );

  const categorizationOutput = JSON.parse(
    categorizationResponse.content as string,
  );

  return {
    messages: [frontDeskResponse],
    nextRepresentative: categorizationOutput.nextRepresentative,
  };
}

async function marketingSupport(state: typeof stateAnnotaion.State) {
  console.log("handling by marketing team..");
  const modelWithTools = model.bindTools(marketingTools);
  const SYSTEM_PROMPT = `You are part of the Marketing Team at Coder's Gyan, an ed-tech company
software developers excel in their careers through practical web development and Generative AI courses.
You specialize in handling questions about promo codes, discounts, offers, and special campaigns.
Answer clearly, concisely, and in a friendly manner. For queries outside promotions (course content, learning),
politely redirect the student to the correct team.
Important: Answer only using given context, else say I don't have enough information about it.`;

  let trimmedHistory = state.messages;
  if (trimmedHistory.at(-1)?.getType() === "ai") {
    trimmedHistory = trimmedHistory.slice(0, -1);
  }

  const marketingResp = await modelWithTools.invoke([
    {
      role: "system",
      content: SYSTEM_PROMPT,
    },
    ...trimmedHistory,
  ]);
  return {
    messages: [marketingResp],
  };
}

async function learningSupport(state: typeof stateAnnotaion.State) {
  console.log("handling by learning team..");

  const SYSTEM_PROMPT = `You are part of the Learning Support Team at Coder's Gyan, an ed-tech company that helps software developers excel in their careers through practical web development and Generative AI courses.
  You assist students with questions about available courses, syllabus coverage, learning paths, and study strategies. Keep your answers concise, clear, and supportive. Strictly use information from retrieved context for answering queries. If the query is about learning issues, politely redirect the student to the respective team.
  Important: Call retrieve_learning_knowledge_base max 3 times if the tool result is not relevant to original query.`;

  const modelWithTools = model.bindTools(learningTools);
 
  let trimmedHistory = state.messages;
  if (trimmedHistory.at(-1)?.getType() === "ai") {
    trimmedHistory = trimmedHistory.slice(0, -1);
  }

    const learningResp = await modelWithTools.invoke([
    {
      role: "system",
      content: SYSTEM_PROMPT,
    },
    ...trimmedHistory,
  ]);
  return {
    messages: [learningResp],
  };

  return state;
}

function WhoNext(state: typeof stateAnnotaion.State) {
  if (state.nextRepresentative.includes("MARKETING")) {
    return "marketingSupport";
  } else if (state.nextRepresentative.includes("LEARNING")) {
    return "learningSupport";
  } else if (state.nextRepresentative.includes("RESPOND")) {
    return "__end__";
  } else {
    return "__end__";
  }
}

function shouldUseMarketingTool(state: typeof stateAnnotaion.State) {
  const lastMessage = state.messages.at(-1);

  if (lastMessage?.getType() === "ai") {
    const toolCalls = (lastMessage as any).tool_calls;

    if (toolCalls?.length > 0) {
      return "marketingToolNode";
    }
  }

  return "__end__";
}

function shouldUseLearningTool(state: typeof stateAnnotaion.State) {
  const lastMessage = state.messages.at(-1);

  if (lastMessage?.getType() === "ai") {
    const toolCalls = (lastMessage as any).tool_calls;

    if (toolCalls?.length > 0) {
      return "learningToolNode";
    }
  }

  return "__end__";
}

const graph = new StateGraph(stateAnnotaion)
  .addNode("frontDeskSupport", frontDeskSupport)
  .addNode("marketingSupport", marketingSupport)
  .addNode("learningSupport", learningSupport)
  .addNode("marketingToolNode", marketingToolNode)
  .addNode("learningToolNode", learningToolNode)
  .addEdge(START, "frontDeskSupport")
  .addEdge("marketingToolNode", "marketingSupport")
  .addEdge("learningToolNode","learningSupport")
  .addConditionalEdges("frontDeskSupport", WhoNext, {
    learningSupport: "learningSupport",
    marketingSupport: "marketingSupport",
    __end__: END,
  })
  .addConditionalEdges("marketingSupport", shouldUseMarketingTool, {
    marketingToolNode: "marketingToolNode",
    __end__: END,
  })
  .addConditionalEdges("learningSupport", shouldUseLearningTool, {
    learningToolNode: "learningToolNode",
    __end__: END,
  })

const app = graph.compile({checkpointer: new MemorySaver()});

while (true) {
  const userInput = await rl.question("\nYou: ");

  if (userInput.trim().toLowerCase() === "exit") {
    break;
  }

  const result = await app.invoke(
    {
      messages: [
        {
          role: "user",
          content: userInput,
        },
      ],
    },
    { configurable: { thread_id: "1" } },
  );

  console.log(
    "Assistant:",
    result.messages[result.messages.length - 1]?.content,
  );
}

rl.close();