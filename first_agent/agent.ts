import OpenAI from "openai";
import readline from "node:readline";
import {
  addExpenseToDB,
  getTotalFromDB,
} from "./db";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

// ===================== CLI =====================
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(q: string): Promise<string> {
  return new Promise((resolve) => rl.question(q, resolve));
}

// ===================== TOOLS =====================
function addExpense({ name, amount }: any) {
  console.log(`➕ Added: ${name} = ${amount}`);

  return addExpenseToDB({
    name,
    amount: Number(amount),
  });
}

function getTotalExpense() {
  return getTotalFromDB();
}

// ===================== TOOL SCHEMA =====================
const tools = [
  {
    type: "function",
    name: "addExpense",
    description: "Add expense",
    parameters: {
      type: "object",
      properties: {
        name: { type: "string" },
        amount: { type: "string" },
      },
      required: ["name", "amount"],
    },
  },
  {
    type: "function",
    name: "getTotalExpense",
    description: "Get total expense",
    parameters: {
      type: "object",
      properties: {},
      required: [],
    },
  },
];

// ===================== MAIN =====================
async function main() {
  const messages: any[] = [
    {
      role: "system",
      content: `
You are a STRICT finance agent.

RULES:
- ONLY use tools for calculations
- NEVER guess values
- ONLY call addExpense when user explicitly adds expense
- ONLY call getTotalExpense when user asks total
- NEVER invent expenses
- Tool arguments MUST be valid JSON
`,
    },
  ];

  while (true) {
    const userInput = await ask("\n💬 You: ");

    if (userInput.toLowerCase() === "exit") {
      console.log("👋 Bye!");
      rl.close();
      break;
    }

    messages.push({
      role: "user",
      content: userInput,
    });

    let response = await client.responses.create({
      model: "openai/gpt-oss-20b",
      input: messages,
      tools,
    });

    // ================= TOOL LOOP =================
    while (true) {
      const toolCalls = response.output.filter(
        (o: any) => o.type === "function_call"
      );

      if (toolCalls.length === 0) {
        const finalText = response.output_text;

        console.log("\n🤖 AI:", finalText);

        messages.push({
          role: "assistant",
          content: finalText,
        });

        break;
      }

      const toolOutputs = [];

      for (const toolCall of toolCalls) {
        let args: any = {};

        // ✅ SAFE PARSE (FIX CRASH)
        try {
          args = JSON.parse(toolCall.arguments || "{}");
        } catch (err) {
          console.log("⚠️ Bad tool JSON skipped:", toolCall.arguments);
          continue;
        }

        let result;

        if (toolCall.name === "addExpense") {
          result = addExpense(args);
        }

        if (toolCall.name === "getTotalExpense") {
          result = getTotalExpense();
        }

        toolOutputs.push({
          type: "function_call_output",
          call_id: toolCall.call_id,
          output: JSON.stringify(result),
        });
      }

      response = await client.responses.create({
        model: "openai/gpt-oss-20b",
        input: [...response.output, ...toolOutputs],
        tools,
      });
    }
  }
}

main();