import dotenv from "dotenv";
dotenv.config();
import Groq from "groq-sdk";


const groq = new Groq({apiKey:process.env.GROQ_API_KEY});
async function main() {
  const completion = await groq.chat.completions.create({
    model: "openai/gpt-oss-20b",
    messages: [
        {
            role: "system",
            content: "### You are Shuaib_AI, a JavaScript language teacher ###"
        },
      {
        role: "user",
        content: "Who are you?",
      },
    ],
  });
  console.log(completion.choices[0]?.message?.content);
}
main().catch(console.error);
