import { ChatGroq } from "@langchain/groq"
import { createEventsTool, getEventsTool } from "./tools";
import { StateSchema, GraphNode, MessagesValue, StateGraph, START, END, type ConditionalEdgeRouter, MemorySaver } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { HumanMessage, AIMessage, SystemMessage } from "@langchain/core/messages";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const checkpointer = new MemorySaver();
const tools = [createEventsTool, getEventsTool];




const llm = new ChatGroq({
    model: "openai/gpt-oss-120b",
    temperature: 0,
}).bindTools(tools);


const MessagesState = new StateSchema({
  messages: MessagesValue
});

/**
 * Model Node 
 */

const llmCall: GraphNode<typeof MessagesState> = async (state) => {
  const response = await llm.invoke(state.messages);
  return {
    messages: [response]
  };
};

/**
 * Tool Node
 */

const toolNode = new ToolNode(tools);


/**
 * Conditional Edge Function
 */

const shouldContinue: ConditionalEdgeRouter<typeof MessagesState, "toolNode"> = (state) => {
  const lastMessage = state.messages.at(-1) as AIMessage;

  // Check if it's an AIMessage before accessing tool_calls
  if (!lastMessage || !AIMessage.isInstance(lastMessage)) {
    return END;
  }

  // If the LLM makes a tool call, then perform an action
  if (lastMessage.tool_calls?.length) {
    return "toolNode";
  }

  // Otherwise, we stop (reply to the user)
  return END;
};


/**
 * Build the Graph
 */

const graph = new StateGraph(MessagesState)
  .addNode("llmCall", llmCall)
  .addNode("toolNode", toolNode)
  .addEdge(START, "llmCall")
  .addConditionalEdges("llmCall", shouldContinue, ["toolNode", END])
  .addEdge("toolNode", "llmCall")

  const agent = graph.compile({checkpointer});


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

    const currentDateTime = new Date().toLocaleString("sv-SE").replace(" ", "T");
    const timeZoneString = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Invoke
const result = await agent.invoke({
  messages: [  new SystemMessage(
      `You are a Smart AI Assistant. You work is get and create calendar events.
       Current dataTime: ${currentDateTime}
       Current timezone String: ${timeZoneString}
      `
    ), new HumanMessage(prompt)],
},{ configurable: { thread_id: "1" }});

for (const message of result.messages) {
  console.log(`[${message.type}]: ${message.text}`);
  
}

}
rl.close()

