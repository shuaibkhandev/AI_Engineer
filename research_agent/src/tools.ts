import { HumanMessage, type AIMessage } from "@langchain/core/messages";
import type { GraphState, QuestionAnswer } from "./state";
import { TavilySearch } from "@langchain/tavily";

const tavilySearch = new TavilySearch({
  maxResults: 2,
  topic: "general",
});

export  async function searchExecuter(state: typeof GraphState.State) {
  const lastMessage = state.messages[state.messages.length - 1] as AIMessage;
  const parsed = JSON.parse(lastMessage.content as string) as QuestionAnswer;

 const searchResult =  await tavilySearch.batch(
    parsed.searchQueries.map((query) => ({ query })),
  );

  const cleanedResults = [];

  for(let i = 0; i<parsed.searchQueries.length; i++){
    const query = parsed.searchQueries[i];
    const searchOutput = searchResult[i];

    const results = searchOutput?.results || [];

    for (const result of  results){
        cleanedResults.push({
            query:query,
          title: result.title || "",
            content: result.content  || "",
            url: result.url || ""
        })
    }
  }

  console.log(cleanedResults)

  return {
    messages: [new HumanMessage(JSON.stringify({searchResult:cleanedResults}))]
  };
}
