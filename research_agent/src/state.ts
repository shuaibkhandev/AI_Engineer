import { Annotation, MessagesAnnotation } from "@langchain/langgraph";
import {z} from "zod"


const reflectionSchema = z.object({
    missing: z.string().describe("Critique of what is missing."),
    superfluous: z.string().describe("Critique of what is superfluous")
})

const citationSchema = z.object({
    title: z.string().describe("Title of the cited source."),
    url: z.string().url().describe("URL of the cited source."),
})

export const questionAnswerSchema =  z.object({
    answer: z.string().describe("~250 words detailed answer to the question"),
    reflection : reflectionSchema,
    searchQueries: z.array(z.string()).max(3).describe("Up to 3 search queries for researching improvements to address the critique of your current answer"),
    citations: z.array(citationSchema).describe("Sources used to support the answer. Use only URLs returned by Tavily."),
})

export type QuestionAnswer = z.infer<typeof questionAnswerSchema>

export const GraphState = Annotation.Root({
    ...MessagesAnnotation.spec,
    revisionCount: Annotation<number>({
        reducer: (_, next) => next,
        default: () => 0,
    }),
})