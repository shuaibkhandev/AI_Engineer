import React, {useEffect, useRef} from "react";
import Message from "./Message";

type MessageType = {
  role: "user" | "assistant" | "error";
  content: string;
};

type MessageListProps = {
  messages: MessageType[];
  isLoading:boolean
};

export default function MessageList({ messages,  isLoading }: MessageListProps) {
    const bottomRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
  bottomRef.current?.scrollIntoView({
    behavior: "smooth",
  });
}, [messages, isLoading]);
  return (
    <div className="flex-1 overflow-y-auto px-8 py-10">
      <div className="mx-auto max-w-4xl space-y-8">
        {messages.map((message, index) => {
          return (
            <Message
              key={index}
              role={message.role}
              content={message.content}
            />
          );
        })}
         {isLoading && (
          <Message
            role="assistant"
            content="Thinking..."
          />
        )}
        
                <div ref={bottomRef} />
      </div>
    </div>
  );
}
