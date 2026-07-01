import Groq from "groq-sdk";
import { tavily } from "@tavily/core";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

const tvly = tavily({
  apiKey: process.env.TAVILY_API_KEY!,
});

async function webSearch({ query }: { query: string }) {
  console.log("Web Searching");

  const response = await tvly.search(query);

  return response.results.map((result) => result.content).join("\n\n");
}

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    const messages: any[] = [
      {
        role: "system",
        content: `You are a smart personal assistant who answers the asked questions. only answer to the point.
        You have access to following the tools:
        1: searchWeb({query}) // Search the latest information and realtime data on the internet.
        current datetime: ${new Date().toUTCString()}
        `,
      },
      {
        role: "user",
        content: message,
      },
    ];

    while (true) {
      console.log("🤖 Calling Groq...");

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

      const assistantMessage = completion.choices[0].message;

      messages.push(assistantMessage);

      if (!assistantMessage.tool_calls) {
        return Response.json({
          success: true,
          response: assistantMessage.content,
        });
      }

      for (const toolCall of assistantMessage.tool_calls) {
        const functionName = toolCall.function.name;
        const args = JSON.parse(toolCall.function.arguments);

        let result = "";

        switch (functionName) {
          case "webSearch":
            result = await webSearch(args);
            break;

          default:
            result = "Unknown tool.";
        }

        messages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          name: functionName,
          content: result,
        });
      }

      console.log("✅ Tool executed. Calling model again...");
    }
  } catch (err) {
    console.error(err);

    return Response.json(
      {
        success: false,
        error: "Something went wrong",
      },
      {
        status: 500,
      },
    );
  }
}
