import { GoogleGenAI } from "@google/genai";
import { AI_TOOLS_DATA } from "../constants";

let aiClient: GoogleGenAI | null = null;

const getClient = () => {
  if (!aiClient) {
    const apiKey = process.env.API_KEY;
    if (apiKey) {
      aiClient = new GoogleGenAI({ apiKey });
    }
  }
  return aiClient;
};

export const generateRecommendation = async (userQuery: string): Promise<string> => {
  const client = getClient();
  if (!client) {
    return "Please configure your API Key to use the AI Concierge.";
  }

  // Create a context string from our tools database
  const toolsContext = AI_TOOLS_DATA.map(t => 
    `- ${t.name} (${t.category}): ${t.description}. Price: ${t.priceModel}. Rating: ${t.rating}/5`
  ).join('\n');

  const systemInstruction = `
    You are an expert AI software consultant for an affiliate dashboard.
    Your goal is to recommend the best tools from the provided list based on the user's request.
    
    Here is the database of available tools:
    ${toolsContext}

    Rules:
    1. Only recommend tools from this list if they fit. If nothing fits perfectly, explain why, but suggest the closest match.
    2. Be concise and persuasive.
    3. Emphasize the key benefit relevant to their query.
    4. If the user asks general questions about content creation, answer them but try to mention a tool from the list.
    5. Do not hallucinate links.
  `;

  try {
    const response = await client.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userQuery,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return response.text || "I couldn't generate a recommendation at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I encountered an error while processing your request.";
  }
};