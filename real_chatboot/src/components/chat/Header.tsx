import { Globe, Database, MessageCircle } from "lucide-react";

type HeaderProps = {
  mode: "general" | "web" | "rag";
};

const modeConfig = {
  general: {
    icon: <MessageCircle size={18} />,
    title: "General Chat",
    subtitle: "Ask me anything",
    badge: "Llama 3.3 70B",
    color: "text-indigo-400",
    badgeBg: "border-indigo-500/30 bg-indigo-500/10 text-indigo-300",
  },
  web: {
    icon: <Globe size={18} />,
    title: "Web Search",
    subtitle: "Real-time answers from the internet",
    badge: "Tavily + Llama 3.3",
    color: "text-emerald-400",
    badgeBg: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  },
  rag: {
    icon: <Database size={18} />,
    title: "Company Knowledge",
    subtitle: "Answers from your company data",
    badge: "RAG + Llama 3.3",
    color: "text-violet-400",
    badgeBg: "border-violet-500/30 bg-violet-500/10 text-violet-300",
  },
};

export default function Header({ mode }: HeaderProps) {
  const config = modeConfig[mode];

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-white/5 bg-zinc-950/80 px-8 py-5 text-zinc-100 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <span className={`${config.color}`}>{config.icon}</span>
        <div>
          <h2 className="text-xl font-semibold">{config.title}</h2>
          <p className="text-sm text-zinc-500">{config.subtitle}</p>
        </div>
      </div>

      <div className={`rounded-full border px-4 py-1.5 text-xs font-medium tracking-wide backdrop-blur-md ${config.badgeBg}`}>
        {config.badge}
      </div>
    </header>
  );
}
