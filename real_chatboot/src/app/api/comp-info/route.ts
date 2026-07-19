import { createVectorStore } from "@/lib/vectorStore";
import Groq from "groq-sdk";
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request: Request) {

  const { question } = await request.json();
  const vectorStore = await createVectorStore();

  const relevantChunks = await vectorStore.similaritySearch(question, 3)

  const relevantChunksString = relevantChunks.map((relevantChunk) => {
    return relevantChunk.pageContent
  }).join("\n\n");

  const USER_QUERY = `Question: ${question}
     Relevant Context: ${relevantChunksString}
     Answer:
     `

  const SYSTEM_QUERY = `
You are an AI assistant for WeLiveSoft Company.

You answer questions only using the provided company knowledge.

Rules:
- Use the provided context as your primary source of truth.
- Answer in plain text only.
- Do NOT use Markdown.
- Do NOT use **bold**, *italic*, headings, tables, or code blocks.
- Do NOT use bullet symbols like *, -, or • unless the user explicitly asks for a list.
- Write in simple, natural sentences.
- If the answer contains multiple points, number them using 1., 2., 3.
- Do not mention phrases like "according to the context" or "the provided document."
- If the context does not contain enough information, reply:
  "I couldn't find that information in the company knowledge base."
- Do not make up or guess company policies, benefits, salaries, rules, or procedures.
- Keep answers concise and professional.
- If the user greets you, respond politely.
- If the user asks a question unrelated to WeLiveSoft, politely explain that you can only answer questions about the company.
`;
  const completion = await groq.chat.completions.create({
    model: "openai/gpt-oss-20b",
    messages: [
      {
        role: "system",
        content: SYSTEM_QUERY
      },
      {
        role: "user",
        content: USER_QUERY,
      },
    ],
    stream: true,
  });

  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content || "";
          if (content) {
            controller.enqueue(new TextEncoder().encode(content));
          }
        }
      } catch (err) {
        console.error("Streaming error:", err);
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}