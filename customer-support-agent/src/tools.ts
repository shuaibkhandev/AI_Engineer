import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { createRetrieverTool } from "@langchain/classic/tools/retriever";
import { vectorStore } from "./indexDocs";

export const getOffersTool = tool(
  async () => {
    return JSON.stringify([
        {
            code : "LAUNCH",
            discount_percent:30
        },
        {
            code : "FIRST20",
            discount_percent:20 
        }
    ])
  },
  { name: "get_offers_tool", description:"Call this tool to get the available discounts and offers" , schema: z.object({ location: z.string() }) }
);

const retriever = vectorStore.asRetriever();

export const retrieverTool = createRetrieverTool(retriever, {
  name: "retrieve_learning_knowledge_base",
  description:
    "Search and return relevant information from the Coder's Gyan learning knowledge base about courses, syllabus, learning paths, study strategies, and other learning-related topics.",
});
