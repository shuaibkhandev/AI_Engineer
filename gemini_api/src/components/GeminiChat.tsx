"use client";
import { askGemini } from "@/actions/gemini";
import React, { useState } from "react";

const GeminiChat = () => {
    const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e:React.FormEvent) => {
  e.preventDefault();
    if (!input.trim()) return;

     setLoading(true);
    setResponse("");

    const result = await askGemini(input);
    
     if (result.success && result.text) {
      setResponse(result.text);
    } else {
      setResponse(result.error || "Something went wrong.");
    }
    
    setInput("");
    setLoading(false);
  }

  return (
     <div className="max-w-md mx-auto p-4 border rounded-lg shadow-sm">
         <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Ask Gemini something..."
           value={input}
          onChange={(e) => setInput(e.target.value)}
          className="p-2 border rounded text-black"
         disabled={loading}
        />
        <button 
          type="submit" 
          disabled={loading}         
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-blue-400 transition"
        >
         {loading ? "Thinking..." : "Ask"}
        </button>
      </form>
       {response && (
        <div className="mt-4 p-3 bg-gray-100 rounded text-black">
          <p className="whitespace-pre-wrap">{response}</p>
        </div>
      )}
    </div>
  )
}

export default GeminiChat
