import { readFile } from "node:fs/promises";
import path from "node:path";
import { PDFParse } from "pdf-parse";

export async function loadPdf(fileName: string) {
  const filePath = path.join(process.cwd(), "data", fileName);
  

  const buffer = await readFile(filePath);

  const parser = new PDFParse({
    data: buffer,
  });

  try {
    const result = await parser.getText();
    return result.text
    .replace(/WE LIVE SOFT - Internal Document Page \d+/g, "")
    .replace(/--\s*\d+\s+of\s+\d+\s*--/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  } finally {
    await parser.destroy();
  }
}