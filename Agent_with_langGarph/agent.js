import dotenv from "dotenv";
dotenv.config();
import { ChatGroq } from "@langchain/groq";
import { createAgent } from "langchain";
import { TavilySearch } from "@langchain/tavily";
import * as z from "zod";
import { tool } from "langchain";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { MemorySaver } from "@langchain/langgraph";

async function main() {
  const model = new ChatGroq({
    model: "openai/gpt-oss-20b",
    temperature: 0,
  });

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
  const checkpointer = new MemorySaver();

  const agent = createAgent({
    model,
    tools: [search, calendarEvents],
    systemPrompt: "You are a helpful assistant.",
    checkpointer
  });



  const rl = readline.createInterface({
    input,
    output,
  });

  console.log("🤖 AI Agent Started (type 'exit' to quit)\n");
  while (true) {
    const prompt = await rl.question("You: ");

    if (prompt.toLowerCase() === "exit") {
      console.log("Goodbye 👋");
      break;
    }

    const response = await agent.invoke({
      messages: [{ role: "user", content: prompt }],
    }, { configurable: { thread_id: "1" }});

    const lastMessage = response.messages[response.messages.length - 1];

    console.log("\nAssistant:", lastMessage.content);
    console.log();
  }

  rl.close();
}

main();
