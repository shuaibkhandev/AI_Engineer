import { ChatGroq } from "@langchain/groq";
// import { HumanMessage } from "@langchain/core/messages";

export const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "openai/gpt-oss-20b",
  temperature: 0,
});

// const message = new HumanMessage("What color is the sky?");

// const res = await model.invoke([message]);

// console.log(res);