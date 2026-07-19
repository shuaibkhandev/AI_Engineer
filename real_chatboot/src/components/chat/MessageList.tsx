"use client";

import React, { useEffect, useRef } from "react";
import Message from "./Message";
import { Globe, Database, MessageCircle, Sparkles, Zap, BookOpen, Search, Building2 } from "lucide-react";

type MessageType = {
  role: "user" | "assistant" | "error";
  content: string;
};

type MessageListProps = {
  messages: MessageType[];
  isLoading: boolean;
  mode: "general" | "web" | "rag";
  onSuggestionClick: (text: string) => void;
};

const suggestions: Record<"general" | "web" | "rag", { icon: React.ReactNode; text: string }[]> = {
  general: [
    { icon: <Sparkles size={16} />, text: "Explain how large language models work" },
    { icon: <Zap size={16} />, text: "Write a professional email to a client" },
    { icon: <BookOpen size={16} />, text: "Give me 5 tips to improve productivity" },
    { icon: <MessageCircle size={16} />, text: "What is the difference between AI and ML?" },
  ],
  web: [
    { icon: <Search size={16} />, text: "What are the latest AI news today?" },
    { icon: <Globe size={16} />, text: "Current Bitcoin price and market trend" },
    { icon: <Zap size={16} />, text: "Best JavaScript frameworks in 2025" },
    { icon: <Sparkles size={16} />, text: "Top tech companies hiring right now" },
  ],
  rag: [
    { icon: <Building2 size={16} />, text: "What does this company do?" },
    { icon: <BookOpen size={16} />, text: "What are the company's core values?" },
    { icon: <MessageCircle size={16} />, text: "What services does the company offer?" },
    { icon: <Zap size={16} />, text: "How can I contact the company?" },
  ],
};

const modeConfig = {
  general: {
    icon: <MessageCircle size={22} />,
    label: "General Chat",
    color: "text-indigo-400",
    bg: "bg-indigo-500/10 border-indigo-500/20",
    subtitle: "Ask me anything — I'm here to help.",
  },
  web: {
    icon: <Globe size={22} />,
    label: "Web Search",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
    subtitle: "I'll search the internet for real-time answers.",
  },
  rag: {
    icon: <Database size={22} />,
    label: "Company Knowledge",
    color: "text-violet-400",
    bg: "bg-violet-500/10 border-violet-500/20",
    subtitle: "Ask me anything about the company.",
  },
};

function EmptyState({ mode, onSuggestionClick }: { mode: "general" | "web" | "rag"; onSuggestionClick: (text: string) => void }) {
  const config = modeConfig[mode];
  const tips = suggestions[mode];

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center select-none">
      {/* Glow orb */}
      <div className="relative mb-8">
        <div className="absolute inset-0 rounded-full blur-2xl opacity-30 bg-indigo-500 scale-150" />
        <div className={`relative flex h-20 w-20 items-center justify-center rounded-2xl border ${config.bg} ${config.color} shadow-xl`}>
          {config.icon}
        </div>
      </div>

      {/* Heading */}
      <h2 className="mb-2 text-3xl font-bold text-zinc-100 tracking-tight">
        How can I help you?
      </h2>

      {/* Active mode badge */}
      <div className={`mb-2 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium ${config.bg} ${config.color}`}>
        {config.icon}
        {config.label}
      </div>

      <p className="mb-10 text-sm text-zinc-500 max-w-sm">
        {config.subtitle}
      </p>

      {/* Suggestion cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 w-full max-w-2xl">
        {tips.map((tip, i) => (
          <button
            key={i}
            onClick={() => onSuggestionClick(tip.text)}
            className="group flex items-start gap-3 rounded-2xl border border-white/8 bg-zinc-900/60 p-4 text-left transition-all duration-200 hover:border-white/20 hover:bg-zinc-800/70 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98]"
          >
            <span className={`mt-0.5 shrink-0 ${config.color} opacity-70 group-hover:opacity-100 transition-opacity`}>
              {tip.icon}
            </span>
            <span className="text-sm text-zinc-400 group-hover:text-zinc-200 transition-colors leading-relaxed">
              {tip.text}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function MessageList({ messages, isLoading, mode, onSuggestionClick }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const isEmpty = messages.length === 0 && !isLoading;

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      {isEmpty ? (
        <EmptyState mode={mode} onSuggestionClick={onSuggestionClick} />
      ) : (
        <div className="px-8 py-10">
          <div className="mx-auto max-w-4xl space-y-8">
            {messages.map((message, index) => (
              <Message key={index} role={message.role} content={message.content} />
            ))}

            {isLoading && <Message role="assistant" content="Thinking..." />}

            <div ref={bottomRef} />
          </div>
        </div>
      )}
    </div>
  );
}
