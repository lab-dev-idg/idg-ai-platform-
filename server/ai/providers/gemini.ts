import { GoogleGenAI } from '@google/genai';
import { AIProvider, AIContext, AIMessage, AIResponseStream } from '../../../src/services/ai/types';

export class GeminiProvider implements AIProvider {
  name = 'GeminiProvider';
  private ai: GoogleGenAI;

  constructor(apiKey: string) {
    this.ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }

  async *generateStream(messages: AIMessage[], context: AIContext, config?: unknown): AsyncGenerator<AIResponseStream, void, unknown> {
    const systemInstruction = messages.find(m => m.role === 'system')?.content;
    const history = messages
      .filter(m => m.role !== 'system')
      .map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      }));

    if (history.length === 0) return;

    // Get the latest query
    const latestMessage = history.pop();
    if (!latestMessage) return;

    const responseStream = await this.ai.models.generateContentStream({
      model: 'gemini-2.5-flash',
      contents: [...history, latestMessage],
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        ...((config as Record<string, unknown>) || {})
      }
    });

    for await (const chunk of responseStream) {
      if (chunk.text) {
        yield { text: chunk.text, done: false };
      }
    }
  }
}
