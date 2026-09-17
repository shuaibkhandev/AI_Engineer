import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";

const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-large",
  dimensions: 1024,
});

const pinecone = new PineconeClient();

const pineconeIndex = pinecone.Index("support-agent-index");

export const vectorStore = await PineconeStore.fromExistingIndex(
  embeddings,
  {
    pineconeIndex,
    maxConcurrency: 5,
  }
);

export async function indexTheDocument(filePath: string) {
  // 1. Load PDF
  const loader = new PDFLoader(filePath, {
    splitPages: false,
  });

  const docs = await loader.load();

  console.log(`PDF loaded: ${docs.length} document(s)`);

  if (docs.length === 0) {
    console.warn("No content found in PDF.");
    return;
  }

  // 2. Split PDF text into chunks
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 100,
  });

  const documents = await splitter.splitDocuments(docs);

  console.log(`Created ${documents.length} chunks`);

  if (documents.length === 0) {
    console.warn("No chunks created from PDF.");
    return;
  } 
  

  // 3. Generate embeddings and store in Pinecone
  await vectorStore.addDocuments(documents);

  console.log(
    `Successfully indexed ${documents.length} chunks to Pinecone.`
  );
}

// 4. Start indexing
// await indexTheDocument("./learning_support_guide.pdf");