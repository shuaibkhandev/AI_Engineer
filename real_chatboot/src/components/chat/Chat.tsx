"use client";

import Sidebar from "./Sidebar";
import Header from "./Header";
import MessageList from "./MessageList";
import PromptInput from "./PromptInput";
import { sendMessage, sendMessage2 } from "@/lib/api/chat";
import { useEffect, useState } from "react";

type Message = {
  role: "user" | "assistant" | "error";
  content: string;
};

export default function Chat() {
  const [userMessage, setUserMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cId, setCId] = useState<string>("");

  useEffect(()=>{
    setCId(Math.random().toString(36).substring(2))
  },[])

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
      const data = await sendMessage(updatedMessages);      

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.content,
        },
      ]);
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

  

  async function handleSend2(message:string){
         const data = await sendMessage2(message, cId);   
         console.log(data);
          
  }

  return (
    <main className="flex h-screen bg-zinc-100">
      {/* Sidebar */}
      <Sidebar />
      {/* Chat Area */}
      <section className="flex flex-1 flex-col bg-white">
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
