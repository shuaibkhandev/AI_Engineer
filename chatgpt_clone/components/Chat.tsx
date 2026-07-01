"use client"

import { useState } from "react"


const Chat = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([])

  const handleSend = async () => {
    if(!input.trim()) return;

    const userMessage = input;

    setMessages((prevMsgs)=>[
      ...prevMsgs,
      {
        role:"user",
        content:input
      }
    ])
 setInput("")

 const resp = await fetch("/api/agent",{
  method:"POST",
  headers:{
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    message: userMessage,
  })
 })

   const data = await resp.json();
   console.log(data, 'data');
   
setMessages((prev) => [
    ...prev,
    {
      role: "assistant",
      content: data.response,
    },
  ]);
  }


  return (
      <div className="flex h-screen bg-[#212121] text-white">
      {/* Main Chat Area */}
      <main className="flex flex-1 flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-8">
          <div className="mx-auto flex max-w-3xl flex-col gap-8">
            {messages.map((msg, index)=> msg.role === "assistant" ? (
      <div key={index} className="flex gap-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-600">
          AI
        </div>

        <div className="rounded-2xl bg-[#2f2f2f] px-5 py-4">
          {msg.content}
        </div>
      </div>
    )  : (
      <div key={index} className="flex justify-end gap-4">
        <div className="rounded-2xl bg-[#303030] px-5 py-4">
          {msg.content}
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600">
          U
        </div>
      </div>
    ))}
          </div>
        </div>

        {/* Input */}
        <div className="border-t border-neutral-700 bg-[#212121] p-4">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-center gap-3 rounded-2xl border border-neutral-700 bg-[#2f2f2f] p-3">
              <textarea
              value={input}
              onChange={(e)=>setInput(e.target.value)}
              rows={1}
              placeholder="Message ChatGPT..."
              className="flex-1 resize-none bg-transparent text-white placeholder:text-gray-400 focus:outline-none"
              />

              <button className="rounded-xl bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-gray-200" onClick={handleSend}>
                Send
              </button>
            </div>

            <p className="mt-3 text-center text-xs text-gray-500">
              ChatGPT can make mistakes. Check important information.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Chat
