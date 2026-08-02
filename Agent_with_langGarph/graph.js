import dotenv from "dotenv";
dotenv.config();
import { ChatGroq } from "@langchain/groq";
import { tool } from "langchain";
import { TavilySearch } from "@langchain/tavily";
import * as z from "zod";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { END, MemorySaver, MessagesValue, START, StateGraph, StateSchema } from "@langchain/langgraph";
import { writeFile } from "node:fs/promises";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";


/**
 * Memory
 */

  const checkpointer = new MemorySaver();


/**
* Tools
*/
  const search = new TavilySearch({
    maxResults: 5,
    topic: "general",
  });

  const calendarEvents = tool(
    ({ query, limit }) => {
      return JSON.stringify([
        { title: "Meeting with John", time: "2 PM", location: "London" },
        { title: "Meeting with Akshy", time: "5 PM", location: "India" },
      ]);
    },
    {
      name: "get_calendar_events",
      description: "Call to get the calendar events",
      schema: z.object({
        query: z
          .string()
          .describe("The query to use in calendar event search."),
        limit: z.number().describe("Maximum number of results to return"),
      }),
    },
  );

  const tools = [search, calendarEvents];
const toolsNode = new ToolNode(tools)
  /**
 * Intilise the LLM (Model)
 */
  const model = new ChatGroq({
    model: "openai/gpt-oss-20b",
    temperature: 0,
  }).bindTools(tools)




async function callModel(state){
    console.log("calling the llm...");
    const response = await model.invoke(state.messages);
    // console.log("Response in callModel:", response)
    return {messages: [response]};
}



/**
* Build the graph 
*/

const MessagesState = new StateSchema({
  messages: MessagesValue,
//   llmCalls: new ReducedValue(
//     z.number().default(0),
//     { reducer: (x, y) => x + y }
//   ),
});


/**
 * Conditional Edge
 */

function shouldContinue(state){
/**
 * Check the previos message if tool call, return tools.
 * else return END
 */
// console.log("messages", state.messages);

const lastMessage = state.messages[state.messages.length-1];

if(lastMessage.tool_calls?.length){
    return "tools"
}

return END
}


const graph = new StateGraph(MessagesState)
.addNode("model", callModel)
.addNode("tools", toolsNode)
.addEdge(START, "model")
.addEdge("tools", "model")
.addConditionalEdges("model", shouldContinue, [END, "tools"])

const agent = graph.compile({checkpointer});

// const image = await agent.getGraph().drawMermaidPng();
// await writeFile("manualGraph.png", Buffer.from(await image.arrayBuffer()));

  const rl = readline.createInterface({
    input,
    output,
  });

  while(true){

        const prompt = await rl.question("You: ");

    if (prompt.toLowerCase() === "exit") {
      console.log("Goodbye 👋");
      break;
    }


const result = await agent.invoke({
  messages: [{role:"user", content:prompt}],
},{ configurable: { thread_id: "1" }});


const messages = result.messages;

const finalResponse = messages[messages.length-1];
console.log(finalResponse.content);
}
rl.close()

