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
    <div className="border-t bg-white p-6">
      <div className="mx-auto flex max-w-4xl items-center gap-3 rounded-2xl border bg-white p-3 shadow-sm">
        <input
          type="text"
          placeholder="Ask anything..."
          className="flex-1 bg-transparent outline-none"
          onChange={(e) => {
            setUserMessage(e.target.value);
          }}
           value={userMessage}
           onKeyDown={handleKeyDown}
          disabled={isLoading}
        />

        <button
          className="rounded-xl bg-black p-3 text-white disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => handleSend(userMessage)}
          disabled={isLoading}
        >
          <Send size={18} />
        </button>
      </div>

      <p className="mt-3 text-center text-xs text-zinc-400">
        AI can make mistakes. Verify important information.
      </p>
    </div>
  );
}
