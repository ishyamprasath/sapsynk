import { GoogleGenAI } from '@google/genai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

let ai: GoogleGenAI | null = null;

function getAI(): GoogleGenAI {
  if (!AI_KEY_AVAILABLE) {
    throw new Error('No Gemini API key configured');
  }
  if (!ai) {
    ai = new GoogleGenAI({ apiKey: API_KEY });
  }
  return ai;
}

export const AI_KEY_AVAILABLE = Boolean(API_KEY);

export const SYNK_SYSTEM_PROMPT = `You are Synk, SapSynk's AI assistant. Your job is to qualify leads 
for the SapSynk team by asking exactly 3 questions:
1. What's your biggest operational bottleneck right now?
2. How many hours per week does your team spend on repetitive tasks?  
3. What's your timeline for implementing automation?

After 3 answers, respond with: "Perfect. I'm connecting you with the SapSynk team. [Provide a 1-sentence summary of their situation]. They'll reach out within 24 hours."

Keep responses under 2 sentences. Be direct and friendly. Ask one question at a time.`;

export async function sendMessageToSynk(
  conversationHistory: Array<{ role: 'user' | 'model'; text: string }>,
  userMessage: string
): Promise<string> {
  const client = getAI();

  const contents = [
    ...conversationHistory.map((msg) => ({
      role: msg.role,
      parts: [{ text: msg.text }],
    })),
    { role: 'user' as const, parts: [{ text: userMessage }] },
  ];

  const response = await client.models.generateContent({
    model: 'gemini-2.0-flash',
    contents,
    config: {
      systemInstruction: SYNK_SYSTEM_PROMPT,
      maxOutputTokens: 150,
    },
  });

  return response.text ?? '';
}
