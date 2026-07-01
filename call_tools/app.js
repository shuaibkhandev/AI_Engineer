import dotenv from "dotenv";
dotenv.config();
import Groq from "groq-sdk";
import { tavily } from "@tavily/core";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });

const rl = readline.createInterface({ input, output });

async function main() {
  const messages = [
    {
      role: "system",
      content: `You are a smart personal assistant who answers the asked questions. only answer to the point.
        You have access to following the tools:
        1: searchWeb({query}) // Search the latest information and realtime data on the internet.
        current datetime: ${new Date().toUTCString()}
        `,
    }
  ];

  while(true){
    const userInput = await rl.question("\nYou: ");

      if (userInput.toLowerCase() === "exit") {
    break;
  }

  messages.push({
    role: "user",
    content: userInput,
  });

      while (true) {
    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      temperature: 0,
      tools: [
        {
          type: "function",
          function: {
            name: "webSearch",
            description:
              "Search the latest information and realtime data on the internet.",
            parameters: {
              type: "object",
              properties: {
                query: {
                  type: "string",
                  description: "The search query to look up on the internet.",
                },
              },
              required: ["query"],
            },
          },
        },
      ],
      tool_choice: "auto",
      messages: messages,
    });

    messages.push(completion.choices[0]?.message);

    const toolCalls = completion.choices[0]?.message?.tool_calls;

    if (!toolCalls) {
      console.log(`Assistant: ${completion.choices[0]?.message?.content}`);
      break;
    }

    for (let toolCall of toolCalls) {
      const args = JSON.parse(toolCall.function.arguments);
      const funcName = toolCall.function.name;

      if (funcName === "webSearch") {
        const result = await webSearch(args);
        messages.push({
          tool_call_id: toolCall.id,
          role: "tool",
          name: funcName,
          content: result,
        });
      }

    }
  
  }
  }
    rl.close();
}

main().catch(console.error);

async function webSearch({ query }) {
  console.log("Calling web search...")
  const response = await tvly.search(query);
  const finalResult = response.results
    .map((result) => result.content)
    .join("\n\n");
  return finalResult;
}

export async function POST(request: Request) {
  
}