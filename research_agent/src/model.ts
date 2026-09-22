import { HumanMessage } from "@langchain/core/messages";
import { ChatOpenAI } from "@langchain/openai";

export const model = new ChatOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  model: "gpt-3.5-turbo-0125",
  temperature: 0
});
