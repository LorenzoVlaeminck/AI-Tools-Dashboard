import { GoogleGenAI } from "@google/genai";
import { AI_TOOLS_DATA } from "../constants";
import { Tool } from "../types";

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

export const generateRecommendation = async (userQuery: string, currentTools: Tool[] = AI_TOOLS_DATA): Promise<string> => {
  const client = getClient();
  if (!client) {
    return "Please configure your API Key to use the AI Concierge.";
  }

  // Create a context string from the provided tools list (which might be synced from Notion)
  const toolsContext = currentTools.map(t => 
    `- ${t.name} (${t.category}): ${t.description}. Price: ${t.priceModel}. Rating: ${t.rating}/5. ${t.offer ? `**Special Offer**: ${t.offer}` : ''}`
  ).join('\n');

  const systemInstruction = `
    You are an expert AI software consultant for a content creation affiliate dashboard.
    Your goal is to recommend the best tools from the provided list based on the user's request.
    
    Here is the database of available tools (Live Data):
    ${toolsContext}

    Rules:
    1. **Prioritize Matches**: Only recommend tools from this list if they fit. If nothing fits perfectly, explain why, but suggest the closest match.
    2. **Be Persuasive**: Emphasize the key benefit relevant to their query.
    3. **Highlight Offers**: If a tool has a "Special Offer", you MUST mention it to encourage the user to click.
    4. **Formatting**: Use **bold** text for tool names and key offers (e.g. **Jasper AI**). Do not use Markdown headers (###) or bullet points, use natural language or simple lists.
    5. **No Hallucinations**: Do not hallucinate links. The user will click the cards in the UI.
    6. **Conciseness**: Keep answers under 100 words unless detailed comparison is asked.
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