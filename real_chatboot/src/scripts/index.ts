import "dotenv/config";
import { loadPdf } from "@/lib/loadpdf";
import { splitText } from "@/lib/splitter";
import { createVectorStore } from "@/lib/vectorStore";

async function main() {
  const text = await loadPdf("WE_LIVE_SOFT_All_Policies.pdf");

  const documents = await splitText(text);

  const vectorStore = await createVectorStore();

  await vectorStore.addDocuments(documents);

  console.log("Documents indexed successfully!");
}

main();