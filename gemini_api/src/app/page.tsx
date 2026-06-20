import GeminiChat from "@/components/GeminiChat";
import Image from "next/image";

export default function Home() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Gemini Integration Demo</h1>
      <GeminiChat />
    </main>
  );
}
