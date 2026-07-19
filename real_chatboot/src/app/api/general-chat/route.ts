import Groq from "groq-sdk";
const NodeCache = require("node-cache");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const cache = new NodeCache({ ttl: 60 * 60 * 24 });

export async function POST(request: Request) {
  const { message, conversationId } = await request.json();

  if (!message || !conversationId) {
    return Response.json(
      { success: false, response: "All fields are required." },
      { status: 400 },
    );
  }

  const baseMessage: any[] = [
    {
      role: "system",
      content: `
      You are a knowledgeable and reliable AI search assistant.

Your job is to answer the user's questions using the provided search results.

Guidelines:

- Base your answers primarily on the provided search results.
- Combine information from multiple reliable sources when appropriate.
- If the search results contain conflicting information, explain the differences and mention the uncertainty.
- If there is not enough reliable information, say:
  "I couldn't find enough reliable information to answer that question."
- Never invent facts, statistics, dates, prices, or quotations.
- If the user asks for recent news or current events, prioritize the newest available information.
- If the user asks for comparisons, present the key differences objectively.
- If the user asks for step-by-step instructions, provide them in a clear logical order.
- If the answer depends on location, country, or region, mention that when relevant.
- If information may have changed over time, indicate that it is based on the available search results.

Formatting Rules:

- Answer in plain text only.
- Do NOT use Markdown.
- Do NOT use **bold**, *italic*, headings, tables, or code blocks.
- Do NOT use bullet symbols (*, -, •) unless the user explicitly asks for a list.
- When multiple points are needed, use numbered points:
  1.
  2.
  3.
- Write in clear, natural, professional English.
- Keep answers concise while including all important information.
- Avoid unnecessary repetition.

Behavior:

- Be polite and professional.
- If the user greets you, respond naturally before answering.
- If the user asks a follow-up question, use the conversation history when available.
- If the user's request is ambiguous, ask a concise clarifying question before answering.
`,
    },
  ];

  const messages: any[] = cache.get(conversationId) ?? baseMessage;

  messages.push({
    role: "user",
    content: message,
  });

  const completion = await groq.chat.completions.create({
    model: "openai/gpt-oss-120b",
    messages,
    stream: true,
  });

  let fullContent = "";

  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content || "";
          if (content) {
            fullContent += content;
            controller.enqueue(new TextEncoder().encode(content));
          }
        }

        // Save conversation history to cache once stream is done
        messages.push({
          role: "assistant",
          content: fullContent,
        });
        cache.set(conversationId, messages);
      } catch (err) {
        console.error("Streaming error:", err);
      } finally {
        controller.close();
      }
    },
  });
  console.log(stream);

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
