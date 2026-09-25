import { McpServer } from "@modelcontextprotocol/server";
import { StdioServerTransport } from "@modelcontextprotocol/server/stdio";
import { z } from "zod";
import {students} from "./data.js"


const server = new McpServer({
  name: "welivesoft",
  version: "1.0.0",
});


server.registerTool(
  "get_students",
  {
    description: "Get list of students",
    inputSchema: z.object({
      limit: z
        .number()
        .optional()
        .describe("Number of students return."),
    }),
  },
  async ({ limit }) => {
    
    return {
      content: [
        {
          type : "text",
          text: JSON.stringify(students.slice(0, limit ?? students.length))
        }
      ]
    }
  },
);



async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Welivesoft MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});