import * as z from "zod";
import { tool } from "langchain";
import { google } from "googleapis";
import tokens from "./tokens.json";
import { start } from "node:repl";

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URL,
);

oauth2Client.setCredentials(tokens);

const calendar = google.calendar({ version: "v3", auth: oauth2Client });


const getEventSchema =  z.object({
      q: z
        .string()
        .describe(
          "The query to be used to get events from the google calendar. It can be one of these values: summary, description, location, attendees dispaly name, attendees email, organiser's name, organiser email",
        ),
      timeMin: z
        .string()
        .describe("IANA timezone, for example Asia/Karachi."),
      timeMax: z
        .string()
        .describe("IANA timezone, for example Asia/Karachi."),
    });


    type Params = z.infer<typeof getEventSchema>


export const getEventsTool = tool(
  async (params: Params) => {
    /**
     * timeMin
     * timeMax
     * q
     */

    const { q, timeMin, timeMax } = params;
    console.log(params);

    try {
      const result = await calendar.events.list({
        calendarId: "primary",
        q,
        timeMin,
        timeMax,
      });

      const events = result.data.items?.map((event) => {
        return {
          id: event.id,
          summery: event.summary,
          status: event.status,
          organiser: event.organizer,
          start: event.start,
          end: event.end,
          attendees: event.attendees,
          meetingLink: event.hangoutLink,
          eventType: event.eventType,
        };
      });

      return JSON.stringify(events);
    } catch (error) {
      console.log("err", error);
    }

    return "Failed to connect to calendar";
  },
  {
    name: "get_events",
    description: "Call to get the calendar events",
    schema: getEventSchema,
  },
);

const createEventSchema =  z.object({
      summary: z
        .string()
        .describe("The title of the event."),

      start: z.object({
        dateTime: z
          .string()
          .describe("Start date and time in RFC3339 format."),

        timezone: z
          .string()
          .describe("IANA timezone, for example Asia/Karachi."),
      }),

      end: z.object({
        dateTime: z
          .string()
          .describe("End date and time in RFC3339 format."),

        timezone: z
          .string()
          .describe("IANA timezone, for example Asia/Karachi."),
      }),

      attendees: z.array(
        z.object({
          email: z
            .string()
            .describe("Email address of the attendee."),

          name: z
            .string()
            .describe("Name of the attendee."),
        })
      ),
    })

    type EventData = z.infer<typeof createEventSchema>


export const createEventsTool = tool(
  async (eventData) => {
    const { summary, start, end, attendees } = eventData as EventData;

    console.log("Event data:", eventData);

    const response = await calendar.events.insert({
      calendarId: "primary",
      sendUpdates: "all",
      conferenceDataVersion: 1,

      requestBody: {
        summary,

        start: {
          dateTime: start.dateTime,
          timeZone: start.timezone,
        },

        end: {
          dateTime: end.dateTime,
          timeZone: end.timezone,
        },

        attendees,

        conferenceData: {
          createRequest: {
            requestId: crypto.randomUUID(),

            conferenceSolutionKey: {
              type: "hangoutsMeet",
            },
          },
        },
      },
    });

    console.log("Calendar response:", response.data);

    const conferenceStatus =
      response.data.conferenceData?.createRequest?.status?.statusCode;

    console.log("Conference status:", conferenceStatus);

    const videoEntryPoint =
      response.data.conferenceData?.entryPoints?.find(
        (entry) => entry.entryPointType === "video"
      );

    const meetingUrl = videoEntryPoint?.uri;

    console.log("Google Meet URL:", meetingUrl);

    return JSON.stringify({
      message: "The meeting has been created.",
      meetingUrl,
      eventUrl: response.data.htmlLink,
      conferenceStatus,
    });
  },

  {
    name: "create_events",

    description:
      "Create a Google Calendar event with a Google Meet video conference. Call this tool when the user wants to schedule a meeting.",

    schema: createEventSchema,
  }
);