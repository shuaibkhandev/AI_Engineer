import { Database, Globe, MessageCircle, MessageSquarePlus, Settings } from "lucide-react"


export default function Sidebar() {
  return (
      <aside className="flex w-72 flex-col border-r border-zinc-200 bg-white">
        {/* Logo */}
        <div className="border-b p-6">
          <h1 className="text-2xl font-bold">AI Assistant</h1>
          <p className="text-sm text-zinc-500">
            Next.js AI Chatbot
          </p>
        </div>

        {/* New Chat */}
        <div className="p-4">
          <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-black px-4 py-3 text-white transition hover:bg-zinc-800">
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
            <button className="flex w-full items-center gap-3 rounded-lg bg-zinc-100 px-4 py-3">
              <MessageCircle size={18} />
              General Chat
            </button>

            <button className="flex w-full items-center gap-3 rounded-lg px-4 py-3 hover:bg-zinc-100">
              <Globe size={18} />
              Web Search
            </button>

            <button className="flex w-full items-center gap-3 rounded-lg px-4 py-3 hover:bg-zinc-100">
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
            {[
              "React Interview",
              "AI Roadmap",
              "Next.js Project",
              "Company Policy",
              "Weather",
            ].map((chat) => (
              <button
                key={chat}
                className="w-full rounded-lg px-4 py-2 text-left hover:bg-zinc-100"
              >
                {chat}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-4">
          <button className="flex w-full items-center gap-3 rounded-lg px-4 py-3 hover:bg-zinc-100">
            <Settings size={18} />
            Settings
          </button>
        </div>
      </aside>  )
}
