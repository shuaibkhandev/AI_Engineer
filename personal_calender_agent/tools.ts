import * as z from "zod";
import { tool } from "langchain";

export const createEventsTool = tool(
  () => {
    return "The meeting has been created.";
  },
  {
    name: "create_events",
    description: "Call to create the calendar events",
    schema: z.object({}),
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
    schema: z.object({}),
  },
);
