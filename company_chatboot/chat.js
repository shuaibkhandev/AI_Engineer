import Groq from "groq-sdk";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { vectorStore } from "./prepare.js";
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function chat() {
const rl = readline.createInterface({ input, output });



  while (true) {
const question = await rl.question("\nYou: ");

      if (question.toLowerCase() === "exit") {
    break;
  }

//   Retrieval
const relevantChunks = await vectorStore.similaritySearch(question, 3);
const context = relevantChunks.map((chunk)=>{
    return chunk.pageContent;
    
}).join("\n\n");

const SYSTEM_PROMPT = `
You are an AI assistant for CodersGyan.

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
- If the user asks a question unrelated to CodersGyan, politely explain that you can only answer questions about the company.
`;

    const USER_PROMPT = `
Question:
${question}

Relevant Context:
${context}

Instructions:
- Respond in plain text only.
- No Markdown.
- No bold (**).
- No italics.
- No bullet points unless necessary.
- Use short, natural sentences.

Answer:
`;


   const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        {
            role:"system",
            content:SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: USER_PROMPT,
        },
      ],
    });
    console.log(`Assistant: ${completion.choices[0]?.message?.content}`);

}


  rl.close();
}

chat().catch(console.error);
