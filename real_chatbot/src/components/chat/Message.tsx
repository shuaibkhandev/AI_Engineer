import React from "react";

type MessageProps = {
  role: "user" | "assistant" | "error";
  content: string;
};

export default function Message({ role, content }: MessageProps) {
  const isUser = role === "user";
  const isError = role === "error";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`flex max-w-3xl items-start gap-3 ${
          isUser ? "flex-row-reverse" : ""
        }`}
      >
        {/* Avatar */}
    <div
  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-semibold text-white shadow-lg ${
    isUser
      ? "bg-gradient-to-br from-indigo-500 to-purple-600"
      : isError
      ? "bg-gradient-to-br from-red-500 to-red-600"
      : "bg-gradient-to-br from-zinc-700 to-zinc-800 border border-white/10"
  }`}
>
  {isUser ? "U" : isError ? "!" : "AI"}
</div>

        {/* Message Bubble */}
<div
  className={`rounded-2xl px-5 py-3.5 shadow-sm leading-relaxed ${
    isUser
      ? "bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-br-sm"
      : isError
      ? "bg-red-900/30 text-red-400 border border-red-900/50 rounded-bl-sm"
      : "bg-zinc-900/80 border border-white/5 text-zinc-100 rounded-bl-sm backdrop-blur-sm"
  }`}
>
  {content}
</div>


      </div>
    </div>
  );
}