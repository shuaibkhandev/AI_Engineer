import dotenv from "dotenv";
dotenv.config();
import { ChatGroq } from "@langchain/groq";
import { createAgent } from "langchain";
import { TavilySearch } from "@langchain/tavily";


async function main() {
  const model = new ChatGroq({
    model: "openai/gpt-oss-20b",
    temperature: 0,
  });

  const search = new TavilySearch({
  maxResults: 5,
  topic: "general",
});

  const agent = createAgent({
    model,
    tools: [search],
    systemPrompt: "You are a helpful assistant.",
  }); 

  const aiMsg = await agent.invoke({
     messages : [
  { role: "user",  content: "What is the current weather in kpk swat barikot Paksitan?" },
]})

console.log("Assistant:",aiMsg.messages[aiMsg.messages.length-1].content);

}

main()

console.log("SSSSSSSSSSSSSSSS")