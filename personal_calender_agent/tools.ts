import * as z from "zod";
import { tool } from "langchain";
import { google } from "googleapis";
import tokens from "./tokens.json"

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URL,
);

oauth2Client.setCredentials(tokens);


const calendar = google.calendar({version: 'v3', auth:oauth2Client});



type Params = {
  q: string;
  timeMin: string;
  timeMax: string;
}


export  const getEventsTool = tool(
async (params:Params) => {
/**
 * timeMin
 * timeMax
 * q
 */


const {q, timeMin, timeMax} = params;
console.log(params);


    try {
      const result = await calendar.events.list({
    calendarId: 'primary',
    q,
    timeMin,
    timeMax,


  });


  const events = result.data.items?.map((event)=>{
    return {
      id: event.id,
      summery: event.summary,
      status: event.status,
      organiser: event.organizer,
      start: event.start,
      end: event.end,
      attendees: event.attendees,
      meetingLink : event.hangoutLink,
      eventType: event.eventType
    }

  })

      return JSON.stringify(events)


    } catch (error) {
      console.log("err", error);
      
    }

    return "Failed to connect to calendar"

  },
  {
    name: "get_events",
    description: "Call to get the calendar events",
    schema: z.object({
            q: z.string().describe("The query to be used to get events from the google calendar. It can be one of these values: summary, description, location, attendees dispaly name, attendees email, organiser's name, organiser email"),
            timeMin: z.string().describe("The from datetime in UTC format for the event"),
            timeMax: z.string().describe("The to datetime in UTC format for the event")

    }),
  },
);


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