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
  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-semibold text-white ${
    isUser
      ? "bg-blue-600"
      : isError
      ? "bg-red-600"
      : "bg-black"
  }`}
>
  {isUser ? "U" : isError ? "!" : "AI"}
</div>

        {/* Message Bubble */}
<div
  className={`rounded-2xl px-4 py-3 ${
    isUser
      ? "bg-blue-600 text-white"
      : isError
      ? "bg-red-100 text-red-700 border border-red-300"
      : "bg-zinc-100 text-zinc-900"
  }`}
>
  {content}
</div>


      </div>
    </div>
  );
}