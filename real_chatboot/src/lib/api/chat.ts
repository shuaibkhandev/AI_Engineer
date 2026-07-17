export async function sendMessage(messages: []) {
  const response = await fetch("/api/general-chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ messages }),
  });

  if (!response.ok) {
    throw new Error("Failed to send message");
  }

  return response.json();
}


export async function sendMessage2(message:string, conversationId:string){  
    const response = await fetch("/api/web-search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message, conversationId }),
  });

  if (!response.ok) {
    throw new Error("Failed to send message");
  }

  return response.json();
}