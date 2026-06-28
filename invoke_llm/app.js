import dotenv from "dotenv";
dotenv.config();
import Groq from "groq-sdk";


const groq = new Groq({apiKey:process.env.GROQ_API_KEY});
async function main() {
  const completion = await groq.chat.completions.create({
    temperature:1,
    // top_p:0.2, alternative of temperature
    max_completion_tokens:100,
    // stop:"",
    // frequency_penalty:1,
    response_format:{"type":"json_object"},
    model: "openai/gpt-oss-20b",
    messages: [
        {
            role: "system",
            content: `You are Shuaib_AI, a smart review grader. Your task is to analyse given review and return the sentiment. Classify the review is Positive, Negative or Neutral. ### You must return the result in valid JSON structure. ###
            example: {"sentiment": "Negative"}
            `,
        },
      {
        role: "user",
        content: `Review: These headphones arrived quickly and look great, but the left earcup stopped working after a week.
        Sentiment
        `,
      },
    ],
  });
  console.log(completion.choices[0]?.message?.content);
}
main().catch(console.error);
