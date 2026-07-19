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
      content: `You are a smart personal assistant who answers the asked questions. Only answer to the point.`,
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
  });

  const assistantMessage = completion.choices[0]?.message;

  if (assistantMessage) {
    messages.push(assistantMessage);
    cache.set(conversationId, messages);

    return Response.json({
      success: true,
      response: assistantMessage.content,
    });
  }

  return Response.json({ success: false, response: "No response from AI." }, { status: 500 });
}
