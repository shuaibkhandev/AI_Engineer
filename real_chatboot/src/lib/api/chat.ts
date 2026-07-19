export async function sendGeneralMessage(message: string, conversationId: string) {
  const response = await fetch("/api/general-chat", {
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


export async function sendWebSearchMessage(message: string, conversationId: string) {
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

export async function sendRagMessage(question: string, conversationId: string) {
  const response = await fetch("/api/comp-info", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question, conversationId }),
  });

  if (!response.ok) {
    throw new Error("Failed to send message");
  }

  return response.json();
}