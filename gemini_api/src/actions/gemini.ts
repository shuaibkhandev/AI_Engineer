"use server";


import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function askGemini(userInput: string) {
  try {
    const interaction = await ai.interactions.create({
      model: "gemini-3.5-flash",
      input: userInput,
    });
    return { success: true, text: interaction.output_text };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      success: false,
      error: "Failed to fetch Response from Gemini.",
    };
  }
}
