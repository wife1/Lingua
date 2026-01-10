
import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const startAIChat = async (targetLanguage: string) => {
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `You are a friendly language tutor for ${targetLanguage}. 
      The user wants to practice conversational ${targetLanguage}. 
      Keep your responses relatively simple.
      If the user makes a mistake, gently correct them in English but primarily speak in ${targetLanguage}.
      Encourage them to speak more!`,
    }
  });
};

export const generateLessonFeedback = async (score: number, total: number, language: string) => {
  const prompt = `The user just finished a ${language} lesson. They scored ${score} out of ${total}. 
  Write a short, encouraging motivational message in ${language} (with English translation).`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt
  });
  
  return response.text;
};
