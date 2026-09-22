import {graph} from "./src/graph.ts";
import { HumanMessage } from "@langchain/core/messages";


const app = graph.compile();

const result = await app.invoke({
    messages: [new HumanMessage("Write a LinkedIn post about learning React.")]
})

console.log(result)