import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";
import { Document } from "@langchain/core/documents";

const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-small",
  dimensions: 1024,
});

const pinecone = new PineconeClient();
const pineconeIndex = pinecone.Index("company-information-index");

export const vectorStore = await PineconeStore.fromExistingIndex(
  embeddings,
  {
    pineconeIndex,
    maxConcurrency: 5,
  }
);

export async function indexTheDocument(filePath) {
  const loader = new PDFLoader(filePath, { splitPages: false });
  const doc = await loader.load();

  if (!doc || doc.length === 0) {
    console.warn("No pages loaded from PDF.");
    return;
  }

  const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 500, chunkOverlap: 100 });
  const texts = await splitter.splitText(doc[0].pageContent);

  const documents = texts.map((chunk) => {
    return new Document({
      pageContent: chunk,
      metadata: doc[0].metadata,
    });
  });

  // await vectorStore.addDocuments(documents);
  // console.log(`Successfully indexed ${documents.length} chunks to Pinecone.`);
}
