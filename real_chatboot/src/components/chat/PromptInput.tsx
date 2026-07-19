import { Send } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

type PromptInputProps = {
  handleSend: (message: string) => void;
  userMessage: string;
  setUserMessage: Dispatch<SetStateAction<string>>;
  isLoading: boolean;
};

export default function PromptInput({
  handleSend,
  userMessage,
  setUserMessage,
  isLoading,
}:PromptInputProps) {

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
  if (e.key === "Enter") {
    handleSend(userMessage);
  }
}
  return (
    <div className="border-t border-white/5 bg-zinc-950/80 p-6 backdrop-blur-md">
      <div className="mx-auto flex max-w-4xl items-center gap-3 rounded-full border border-white/10 bg-zinc-900/50 p-2 shadow-inner ring-1 ring-white/5">
        <input
          type="text"
          placeholder="Ask anything..."
          className="flex-1 bg-transparent px-4 text-zinc-100 placeholder:text-zinc-500 outline-none"
          onChange={(e) => {
            setUserMessage(e.target.value);
          }}
           value={userMessage}
           onKeyDown={handleKeyDown}
          disabled={isLoading}
        />

        <button
          className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500 text-white shadow-lg transition hover:bg-indigo-400 hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => handleSend(userMessage)}
          disabled={isLoading}
        >
          <Send size={16} className="ml-1" />
        </button>
      </div>

      <p className="mt-3 text-center text-xs text-zinc-500">
        AI can make mistakes. Verify important information.
      </p>
    </div>
  );
}
