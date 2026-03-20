import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenAI({ apiKey });

export async function callGemini(userMessage: string, systemInstruction: string, history: any[] = []) {
  const response = await genAI.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: [
      ...history.map((h: any) => ({
        role: h.role,
        parts: [{ text: h.parts[0].text }]
      })),
      { role: "user", parts: [{ text: userMessage }] }
    ],
    config: {
      systemInstruction,
    },
  });

  return response.text || "";
}

export function cleanJson(raw: string) {
  return raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
}

export function extractObj(raw: string) {
  const c = cleanJson(raw);
  const s = c.indexOf('{');
  const e = c.lastIndexOf('}');
  if (s === -1 || e === -1) return null;
  try {
    return JSON.parse(c.slice(s, e + 1));
  } catch (err) {
    console.error("Failed to parse JSON object:", err);
    return null;
  }
}

export function extractArr(raw: string) {
  const c = cleanJson(raw);
  const s = c.indexOf('[');
  const e = c.lastIndexOf(']');
  if (s === -1 || e === -1) return null;
  try {
    return JSON.parse(c.slice(s, e + 1));
  } catch (err) {
    console.error("Failed to parse JSON array:", err);
    return null;
  }
}
