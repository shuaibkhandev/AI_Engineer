import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export async function splitText(text: string) {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 100,
  });

  return await splitter.createDocuments([text]);
}