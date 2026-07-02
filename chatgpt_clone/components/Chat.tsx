"use client";

import { useEffect, useState, useRef} from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type AgentResponse = {
  success: boolean;
  response: string;
};

const Chat = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
  bottomRef.current?.scrollIntoView({
    behavior: "smooth",

  });
}, [messages, loading]);

  useEffect(()=>{
    const newId = crypto.randomUUID();
   setConversationId(newId)
  },[])
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSend = async (): Promise<void> => {
    if (!input.trim()) return;

    const userMessage = input;

    setMessages((prevMsgs) => [
      ...prevMsgs,
      {
        role: "user",
        content: input,
      },
    ]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          conversationId:conversationId
        }),
      });

      const data: AgentResponse = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.response,
        },
      ]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!loading) {
        handleSend();
      }
    }
  };

  return (
    <div className="chat-scroll  flex h-screen bg-[#212121] text-white">
      <main className="flex flex-1 flex-col">
        <div className="flex-1 overflow-y-auto px-4 py-8">
  
          <div className="mx-auto flex max-w-3xl flex-col gap-8">
  {messages.length === 0 && (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 text-3xl font-bold shadow-xl">
      AI
    </div>

    <h1 className="text-5xl font-bold tracking-tight text-white">
      How can I help you today?
    </h1>

    <p className="mt-4 max-w-2xl text-lg leading-8 text-gray-400">
      Ask questions, search the web for the latest information, explain
      concepts, summarize content, brainstorm ideas, or get help with coding.
    </p>

    <div className="mt-10 flex flex-wrap justify-center gap-3">
      {[
        "🌐 Latest AI news",
        "💻 Explain React hooks",
        "📄 Summarize this article",
        "🚀 Help me build an AI Agent",
        "🔍 Search the web",
        "💡 Brainstorm startup ideas",
      ].map((item) => (
        <button
          key={item}
          onClick={() => setInput(item.replace(/^[^\s]+\s/, ""))}
          className="rounded-full border border-neutral-700 bg-[#2f2f2f] px-4 py-2 text-sm text-gray-300 transition-all duration-200 hover:border-emerald-500 hover:bg-[#3a3a3a] hover:text-white"
        >
          {item}
        </button>
      ))}
    </div>
  </div>
)}
            {messages.map((msg, index) =>
              msg.role === "assistant" ? (
                <div key={index} className="flex gap-4">
                  <div className="flex min-h-9 min-w-9 w-9 h-9 items-center justify-center rounded-full bg-green-600">
                    AI
                  </div>

                  <div className="rounded-2xl bg-[#2f2f2f] px-5 py-4">
                    {msg.content}
                  </div>
                </div>
              ) : (
                <div key={index} className="flex justify-end gap-4">
                  <div className="rounded-2xl bg-[#303030] px-5 py-4">
                    {msg.content}
                  </div>

                  <div className="flex min-h-9 min-w-9 w-9 h-9 items-center justify-center rounded-full bg-blue-600">
                    U
                  </div>
                </div>
              ),
            )}
            {loading && (
              <div className="flex gap-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-600">
                  AI
                </div>

                <div className="rounded-2xl bg-[#2f2f2f] px-5 py-4">
                  Thinking...
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </div>

        <div className="border-t border-neutral-700 bg-[#212121] p-4">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-center gap-3 rounded-2xl border border-neutral-700 bg-[#2f2f2f] p-3">
              <textarea
                value={input}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder="Message ChatGPT..."
                className="flex-1 resize-none bg-transparent text-white placeholder:text-gray-400 focus:outline-none"
              />

              <button
                className="rounded-xl bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-gray-200 h-10 w-18 flex items-center justify-center"
                onClick={handleSend}
                disabled={loading}
              >
                {loading ? <span className="relative flex size-3 ">
  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#383838] opacity-75"></span>
  <span className="relative inline-flex size-3 rounded-full bg-[#383838]"></span>
</span>
 :  "Send"}
                
              </button>
            </div>

            <p className="mt-3 text-center text-xs text-gray-500">
              ChatGPT can make mistakes. Check important information.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Chat;
