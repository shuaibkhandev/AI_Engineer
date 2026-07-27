import { PineconeStore } from "@langchain/pinecone";
import { embeddings } from "./embeddings";
import { pineconeIndex } from "./pinecone";

export async function createVectorStore() {
  return await PineconeStore.fromExistingIndex(
    embeddings,
    {
      pineconeIndex: pineconeIndex,
    }
  );
}