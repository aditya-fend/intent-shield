import { GoogleGenAI } from "@google/genai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY environment variable");
}

export const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Ganti model ke gemini-1.5-flash yang aktif dan stabil
export const GEMINI_MODEL = "gemini-3.1-flash-lite";