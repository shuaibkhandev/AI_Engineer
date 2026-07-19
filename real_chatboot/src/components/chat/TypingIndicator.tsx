import React from "react";

const TypingIndicator = () => {
  return (
    <div className="flex items-center gap-1.5 px-1 py-0.5">
      <span
        className="h-2 w-2 rounded-full bg-indigo-400 animate-bounce"
        style={{ animationDelay: "0ms", animationDuration: "900ms" }}
      />
      <span
        className="h-2 w-2 rounded-full bg-indigo-400 animate-bounce"
        style={{ animationDelay: "180ms", animationDuration: "900ms" }}
      />
      <span
        className="h-2 w-2 rounded-full bg-indigo-400 animate-bounce"
        style={{ animationDelay: "360ms", animationDuration: "900ms" }}
      />
    </div>
  );
};

export default TypingIndicator;
