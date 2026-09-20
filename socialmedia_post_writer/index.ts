import { HumanMessage } from "@langchain/core/messages";
import { graph } from "./src/graph";

const app = graph.compile();

const result = await app.invoke({
  messages: [new HumanMessage("Write a LinkedIn post about learning React.")],
});

// console.log(result.messages[result.messages.length-1]?.content);
console.log(result);
