
import { GoogleGenAI, GenerateContentResponse, GroundingChunk as GenAIGroundingChunk } from "@google/genai";
import { AIResponse, GroundingChunk } from '../types';
import { GEMINI_MODEL_TEXT } from '../constants';

// Ensure API_KEY is available in the environment.
// The build system/environment should handle setting this.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("API_KEY for Gemini is not set. Please ensure the environment variable API_KEY is configured.");
  // In a real app, you might want to display this error more prominently or disable API-dependent features.
}

const ai = new GoogleGenAI({ apiKey: API_KEY || "MISSING_API_KEY" }); // Fallback to prevent crash if key is missing, but calls will fail

const mapGroundingChunks = (apiChunks: GenAIGroundingChunk[] | undefined): GroundingChunk[] => {
  if (!apiChunks) return [];
  return apiChunks
    .map(chunk => chunk.web ? ({ web: { uri: chunk.web.uri, title: chunk.web.title } }) : null)
    .filter(chunk => chunk !== null) as GroundingChunk[];
};

export const askFinancialQuestion = async (query: string): Promise<AIResponse> => {
  if (!API_KEY) throw new Error("API_KEY not configured.");
  try {
    const prompt = `You are an AI assistant dedicated to empowering women in India with financial literacy. Your user has asked the following question: "${query}". 
    
    Please provide a clear, comprehensive, and accurate answer. 
    Use your knowledge base and information from a web search to ensure the information is up-to-date.
    If relevant to the query, search for and include links to helpful videos (e.g., from YouTube or other reputable sources) that can further explain the concepts. Make sure the links are fully qualified URLs.
    Structure your response for easy readability. At the end of your response, list any web sources used for your answer.`;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_TEXT,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text;
    const sources = mapGroundingChunks(response.candidates?.[0]?.groundingMetadata?.groundingChunks);
    
    return { text, sources };

  } catch (error) {
    console.error("Error calling Gemini API for Q&A:", error);
    throw new Error("Failed to get an answer from the AI. Please try again.");
  }
};

export const findSchemes = async (details: string): Promise<AIResponse> => {
  if (!API_KEY) throw new Error("API_KEY not configured.");
  try {
    const prompt = `You are an AI assistant helping women in India find relevant government and other beneficial schemes.
    A user has provided the following information about their needs, business, or situation: "${details}".

    Based on this information, please:
    1. Identify and list suitable schemes (government or other reputable organizations).
    2. For each scheme, provide a brief description.
    3. Explain how each scheme might be relevant to the user's provided details.
    4. If available, provide direct links to the official scheme pages or information sources.
    
    Use web search to find the most current and relevant information.
    Structure your response clearly. At the end of your response, list any web sources used for finding this information.`;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_TEXT,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text;
    const sources = mapGroundingChunks(response.candidates?.[0]?.groundingMetadata?.groundingChunks);

    return { text, sources };
  } catch (error) {
    console.error("Error calling Gemini API for Scheme Finder:", error);
    throw new Error("Failed to find schemes from the AI. Please try again.");
  }
};
