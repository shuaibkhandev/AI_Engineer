import { Database, Globe, MessageCircle, MessageSquarePlus, Settings } from "lucide-react"

type SidebarProps = {
  mode: "general" | "web" | "rag";
  onModeChange: (mode: "general" | "web" | "rag") => void;
  onNewChat: () => void;
  chatHistory: { id: string; title: string }[];
  onSelectChat: (id: string) => void;
};

export default function Sidebar({ mode, onModeChange, onNewChat, chatHistory, onSelectChat }: SidebarProps) {
  return (
    <aside className="flex w-72 flex-col border-r border-white/5 bg-zinc-950/50 backdrop-blur-xl">
      {/* Logo */}
      <div className="border-b border-white/5 p-6">
        <h1 className="text-2xl font-bold">AI Assistant</h1>
        <p className="text-sm text-zinc-500">
          Next.js AI Chatbot
        </p>
      </div>

      {/* New Chat */}
      <div className="p-4">
        <button
          onClick={onNewChat}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-zinc-100 to-zinc-300 px-4 py-3 text-zinc-900 font-semibold shadow-lg transition hover:scale-[1.02] active:scale-[0.98]"
        >
          <MessageSquarePlus size={18} />
          New Chat
        </button>
      </div>

      {/* Chat Modes */}
      <div className="px-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
          Chat Modes
        </p>

        <div className="space-y-2">
          <button
            onClick={() => onModeChange("general")}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 transition ${mode === "general" ? "bg-white/10 text-zinc-100 shadow-sm ring-1 ring-white/10" : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"}`}
          >
            <MessageCircle size={18} />
            General Chat
          </button>

          <button
            onClick={() => onModeChange("web")}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 transition ${mode === "web" ? "bg-white/10 text-zinc-100 shadow-sm ring-1 ring-white/10" : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"}`}
          >
            <Globe size={18} />
            Web Search
          </button>

          <button
            onClick={() => onModeChange("rag")}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 transition ${mode === "rag" ? "bg-white/10 text-zinc-100 shadow-sm ring-1 ring-white/10" : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"}`}
          >
            <Database size={18} />
            Company RAG
          </button>
        </div>
      </div>

      {/* History */}
      <div className="mt-8 flex-1 overflow-y-auto px-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
          Recent Chats
        </p>

        <div className="space-y-2">
          {chatHistory.map((chat) => (
            <button
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className="w-full truncate rounded-lg px-4 py-2 text-left text-zinc-400 transition hover:bg-white/5 hover:text-zinc-200"
            >
              {chat.title}
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/5 p-4">
        <button className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-zinc-400 transition hover:bg-white/5 hover:text-zinc-200">
          <Settings size={18} />
          Settings
        </button>
      </div>
    </aside>)
}
