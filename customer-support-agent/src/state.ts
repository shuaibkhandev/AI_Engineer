import { Annotation, MessagesAnnotation } from "@langchain/langgraph";

export const stateAnnotaion = Annotation.Root({
  ...MessagesAnnotation.spec,
  nextRepresentative: Annotation<string>,
});