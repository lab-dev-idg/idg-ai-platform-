import { GoogleGenAI } from "@google/genai";

let aiInstance: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY || process.env.YOUR_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY or YOUR_API_KEY environment variable is not defined on the server side.");
    }
    aiInstance = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}

export const GeminiService = {
  /**
   * Generates a conversational response using gemini-3.5-flash
   */
  async generateResponse(message: string, history: Array<{ role: 'user' | 'model'; text: string }>, context: any): Promise<string> {
    try {
      const client = getAiClient();
      
      // Build a rich Iraq General/Customs Intelligence officer persona system instruction
      const systemInstruction = `
        You are the Iraq Digital Gateway (IDG) Gov AI Co-pilot, a highly secure, national border operations and customs intelligence officer.
        Your tone is professional, authoritative, helpful, and highly compliant with the 2026 Customs Law of Iraq.
        
        System Context:
        - Active Language Preference: ${context?.language || 'ku'}
        - Active Module Context: ${context?.currentModule || 'Unified Logistics Dashboard'}
        - Active Customs Workflow State: ${context?.customsWorkflowState || 'N/A'}
        
        Operation Rules:
        - Respond strictly in the designated language preferred by the user (${context?.language === 'ar' ? 'Arabic' : 'Kurdish'} as default, unless they write in English).
        - Ground your calculations in official Iraqi Customs Tariff multiplier rules (CIF model) where applicable.
        - Provide structured, bulleted lists with exact headings. Include actionable summaries reflecting border crossings (e.g., Umm Qasr, Ibrahim Khalil, Safwan, Trebil, Erbil/Sulaymaniyah airports).
        - Do not larp technical details (like server ports, container configurations, or API statuses) unless specifically asked. Focus purely on trade, border operations, and logistics intelligence.
      `.trim();

      // Format history according to @google/genai format
      // Note: we want to map history correctly
      const contents = history.map(item => ({
        role: item.role,
        parts: [{ text: item.text }]
      }));
      
      // Append the latest user message
      contents.push({
        role: 'user',
        parts: [{ text: message }]
      });

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      return response.text || "ببوورە کێشەیەک ڕوویدا لە وەڵامدانەوە.";
    } catch (err) {
      console.error("GeminiService generateResponse error:", err);
      throw err;
    }
  },

  /**
   * Generates a 2-4 word Title for a chat session based on the original user message
   */
  async generateTitle(userMessage: string): Promise<string> {
    try {
      const client = getAiClient();
      
      const systemInstruction = `
        You are a title generator. Given a user's first prompt to a customs/logistics co-pilot, generate a short, professional Title in the same language.
        Rules:
        - Max 2 to 4 words.
        - NO quotes, NO punctuation, NO filler words.
        - Just output the title string itself.
      `.trim();

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Generate a title for the following message: "${userMessage}"`,
        config: {
          systemInstruction,
          temperature: 0.2,
        }
      });

      return response.text?.trim() || "Inquiry";
    } catch (err) {
      console.error("GeminiService generateTitle error:", err);
      return "Inquiry"; // Fallback title
    }
  }
};
