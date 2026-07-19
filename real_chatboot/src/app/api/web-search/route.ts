import Groq from "groq-sdk";
import { tavily } from "@tavily/core";
const NodeCache = require("node-cache");

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY!,
});

const tvly = tavily({
    apiKey: process.env.TAVILY_API_KEY!,
});

const cache = new NodeCache({ ttl: 60 * 60 * 24 });

async function webSearch({ query }: { query: string }) {
    console.log("Web Searching");

    const response = await tvly.search(query);

    return response.results.map((result) => result.content).join("\n\n");
}

export async function POST(request: Request) {
    const { message, conversationId } = await request.json();
    if (!message || !conversationId) {
        return Response.json(
            { success: false, response: "All fileds are required." },
            { status: 400 },
        );
    }

    const baseMessage: any[] = [
        {
            role: "system",
            content: `You are an intelligent AI web research assistant.

Your job is to answer questions using the provided web search results.

- Current datetime: ${new Date().toUTCString()}

Rules:

- Use the web search results as your primary source of information.
- Combine information from multiple search results when appropriate.
- If the search results contain conflicting information, explain the differences instead of choosing one without explanation.
- If the search results do not contain enough information to answer confidently, say:
  "I couldn't find enough reliable information to answer that question."
- Never invent facts or make assumptions that are not supported by the search results.
- Do not claim you visited websites directly. Base your answer only on the provided search results.
- If the user asks for the latest news or recent events, prioritize the most recent search results.
- Keep answers factual, accurate, and unbiased.
- If dates, versions, prices, or statistics are mentioned, include them only when supported by the search results.
- Answer in plain text only.
- Do NOT use Markdown.
- Do NOT use **bold**, *italic*, headings, tables, or code blocks.
- Do NOT use bullet symbols such as *, -, or • unless the user explicitly requests a list.
- When multiple points are needed, use numbered points: 1., 2., 3.
- Write in clear, natural, professional English.
- Keep answers concise while including important details.
- If the user greets you, respond politely before assisting them. 
        `,
        },
    ];

    const messages: any[] = cache.get(conversationId) ?? baseMessage;

    messages.push({
        role: "user",
        content: message,
    });

    const Max_call = 10;
    let count = 0;

    while (true) {
        count++;
        if (count > Max_call) {
            return Response.json(
                {
                    success: false,
                    response: "I could not find the solution, please try again.",
                },
                { status: 500 },
            );
        }

        const completion = await groq.chat.completions.create({
            model: "llama-3.1-8b-instant",
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
            cache.set(conversationId, messages);

            const stream = new ReadableStream({
                async start(controller) {
                    const text = assistantMessage.content || "";
                    const chunkSize = 15;
                    for (let i = 0; i < text.length; i += chunkSize) {
                        controller.enqueue(new TextEncoder().encode(text.slice(i, i + chunkSize)));
                        await new Promise(r => setTimeout(r, 10));
                    }
                    controller.close();
                }
            });

            return new Response(stream, {
                headers: {
                    "Content-Type": "text/plain; charset=utf-8",
                    "Cache-Control": "no-cache",
                    "Connection": "keep-alive",
                },
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
    }
}
