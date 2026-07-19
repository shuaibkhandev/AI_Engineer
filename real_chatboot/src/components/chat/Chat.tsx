"use client";

import Sidebar from "./Sidebar";
import Header from "./Header";
import MessageList from "./MessageList";
import PromptInput from "./PromptInput";
import { sendGeneralMessage, sendWebSearchMessage, sendRagMessage } from "@/lib/api/chat";
import { useEffect, useState } from "react";

type Message = {
  role: "user" | "assistant" | "error";
  content: string;
};

type ChatSession = {
  id: string;
  title: string;
  messages: Message[];
};

export default function Chat() {
  const [userMessage, setUserMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cId, setCId] = useState<string>("");
  const [mode, setMode] = useState<"general" | "web" | "rag">("general");
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);

  useEffect(() => {
    setCId(Math.random().toString(36).substring(2))
  }, [])

  useEffect(() => {
    if (messages.length > 0) {
      setChatHistory(prev => {
        const existing = prev.find(c => c.id === cId);
        if (existing) {
          return prev.map(c => c.id === cId ? { ...c, messages } : c);
        } else {
          return [{ id: cId, title: messages[0].content.substring(0, 30) + (messages[0].content.length > 30 ? "..." : ""), messages }, ...prev];
        }
      });
    }
  }, [messages, cId]);

  function handleNewChat() {
    setMessages([]);
    setUserMessage("");
    setCId(Math.random().toString(36).substring(2));
  }

  function handleSelectChat(id: string) {
    const chat = chatHistory.find(c => c.id === id);
    if (chat) {
      setCId(chat.id);
      setMessages(chat.messages);
    }
  }

  async function handleSend(message: string) {
    if (!message.trim() || isLoading) return;

    const updatedMessages: Message[] = [
      ...messages,
      {
        role: "user",
        content: message,
      },
    ];

    setMessages(updatedMessages);
    setUserMessage("");
    setIsLoading(true);
    try {
      if (mode === "web") {
        const data = await sendWebSearchMessage(message, cId);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.response || "No response",
          },
        ]);
      } else if (mode === "rag") {
        const data = await sendRagMessage(message, cId);
        console.log(data, 'sdfsdf');

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.response || "No response",
          },
        ]);
      } else {
        const data = await sendGeneralMessage(message, cId);

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.response || "No response",
          },
        ]);
      }
    } catch (error) {
      console.log(error);
      setMessages((prev) => [
        ...prev,
        {
          role: "error",
          content: "⚠️ Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }





  return (
    <main className="flex h-screen bg-zinc-950 text-zinc-100">
      {/* Sidebar */}
      <Sidebar
        mode={mode}
        onModeChange={setMode}
        onNewChat={handleNewChat}
        chatHistory={chatHistory}
        onSelectChat={handleSelectChat}
      />
      {/* Chat Area */}
      <section className="flex flex-1 flex-col bg-zinc-950">
        {/* Header */}
        <Header />

        {/* Messages */}
        <MessageList messages={messages} isLoading={isLoading} />

        {/* Input */}
        <PromptInput
          handleSend={handleSend}
          userMessage={userMessage}
          setUserMessage={setUserMessage}
          isLoading={isLoading}
        />
      </section>
    </main>
  );
}
