import { ChatGroq } from "@langchain/groq"
import { createEventsTool, getEventsTool } from "./tools";



const tools = [createEventsTool, getEventsTool];

const llm = new ChatGroq({
    model: "openai/gpt-oss-120b",
    temperature: 0,
}).bindTools(tools);


const aiMsg = await llm.invoke([
    {
      role: "system",
      content: "You are a assistant.",
    },
    { role: "user", content: "I love programming." },
])

console.log(aiMsg.content)