import * as z from "zod";
import { tool } from "langchain";

export const createEventsTool = tool(
  () => {
    return "The meeting has been created.";
  },
  {
    name: "create_events",
    description:
"Always call this tool whenever the user wants to create a calendar event, even if details are missing. Pass the entire user request in the query parameter.",
    schema: z.object({
            query: z.string(),

    }),
  },
);

export const getEventsTool = tool(
  () => {
    return JSON.stringify([
      { title: "Meeting with John", time: "2 PM", location: "London" },
      { title: "Meeting with Akshy", time: "5 PM", location: "India" },
    ]);
  },
  {
    name: "get_events",
    description: "Call to get the calendar events",
    schema: z.object({
            query: z.string().describe("The user's request for retrieving calendar events"),

    }),
  },
);
