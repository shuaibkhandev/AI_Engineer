import Groq from "groq-sdk";
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request: Request) {
  const body = await request.json();
  const { messages } = body;
  const completion = await groq.chat.completions.create({
    model: "openai/gpt-oss-120b",
    messages,
  });

  return new Response(
    JSON.stringify({ content: completion.choices[0]?.message?.content }),
  );
}
