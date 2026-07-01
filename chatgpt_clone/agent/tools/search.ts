import { tvly } from "@/lib/tavily";

export async function searchWeb(query: string) {
  return tvly.search(query);
}