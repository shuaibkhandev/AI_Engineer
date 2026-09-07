import { START, StateGraph } from "@langchain/langgraph";
import { stateAnnotaion } from "./state";
import { model } from "./model";

async function frontDeskSupport(state: typeof stateAnnotaion.spec) {

  const SYSTEM_PROMPT = `You are front line Support staff for Coder’s Gyan,an WE LIVE SOFT company that helps software developers excel in their careers through practical web development and Generative AI courses.

  Be concise in your responses.

  You can chat with students and help them with basic questions, but if the student is having a marketing or learning support query, do not try to answer the question directly or gather information. Instead, immediately transfer them to the marketing team (promo codes, discounts, offers, and special campaigns) or learning support team (courses, syllabus coverage, learning paths, and study strategies) by asking the user to hold for a moment. Otherwise, just respond conversationally.`;

 const frontDeskResponse = await model.invoke([
    {
      role: "system",
      content: SYSTEM_PROMPT,
    },
    ...state.messages,
    
  ]);


  const CATEGORIZATION_SYSTEM_PROMPT = `
  You are an expert customer support routing system.
  Your job is to detect whether a customer support representative is routing a user to a marketing team or learning support team, or if they are just responding conversationally.
`;


  const CATEGORIZATION_HUMAN_PROMPT = `The previous conversation is an interaction between a customer support representative and a user.
  Extract whether the representative is routing the user to a marketing team or learning support team, or whether they are just responding conversationally.
  Respond with a JSON object containing a single key called "nextRepresentative" with one of the following values:

  If they want to route the user to the marketing team, respond with "MARKETING".
  If they want to route the user to the learning support team, respond with "LEARNING".
  Otherwise, respond only with the word "RESPOND".`;

  const categorizationResponse = await model.invoke([
    {
      role: "system",
      content: CATEGORIZATION_SYSTEM_PROMPT,
    },
    ...state.messages,
    {
      role: "user",
      content: CATEGORIZATION_HUMAN_PROMPT,
    },
  ],{
    response_format: {
      type: "json_object"
    }
  }
);

const categorizationOutput = JSON.parse(categorizationResponse.content as string);

  return {
    messages: [frontDeskResponse],
    nextRepresentative: categorizationOutput.nextRepresentative,
  };
}

function marketingSupport(state: typeof stateAnnotaion.spec) {
  return state;
}

function learningSupport(state: typeof stateAnnotaion.spec) {
  return state;
}

const graph = new StateGraph(stateAnnotaion)
  .addNode("frontDeskSupport", frontDeskSupport)
  .addNode("marketingSupport", marketingSupport)
  .addNode("learningSupport", learningSupport)
  .addEdge(START, "frontDeskSupport");
