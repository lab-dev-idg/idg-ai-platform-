import express, { Request, Response } from 'express';
import { GeminiProvider } from '../ai/providers/gemini';
import { ChatOrchestrator } from '../ai/orchestration/ChatOrchestrator';
import { sessionMemoryMiddleware, adminGuardMiddleware } from '../ai/middleware/sessionMiddleware';
import { AIContext, AIMessage } from '../../src/services/ai/types';

export const chatRouter = express.Router();

let orchestrator: ChatOrchestrator | null = null;

function getOrchestrator() {
  if (!orchestrator) {
    const apiKey = process.env.GEMINI_API_KEY || "";
    const provider = new GeminiProvider(apiKey);
    orchestrator = new ChatOrchestrator(provider);
    
    // Wire up enterprise middlewares
    orchestrator.useMiddleware(sessionMemoryMiddleware);
    orchestrator.useMiddleware(adminGuardMiddleware);
  }
  return orchestrator;
}

chatRouter.post('/stream', async (req: Request, res: Response) => {
  try {
    const { message, history, context } = req.body;
    const orch = getOrchestrator();

    interface RequestHistoryMessage {
      role: string;
      parts?: { text?: string }[];
    }

    const _history: AIMessage[] = (history || []).map((m: RequestHistoryMessage) => ({
      role: m.role === 'model' ? 'model' : 'user',
      content: m.parts?.[0]?.text || ''
    }));

    // Append latest interaction
    const messages: AIMessage[] = [..._history, { role: 'user', content: message }];

    const defaultContext: AIContext = {
      language: context?.language || 'ku',
      userId: context?.userId,
      role: context?.role,
      currentModule: context?.currentModule,
      customsWorkflowState: context?.customsWorkflowState,
      shipmentId: context?.shipmentId,
      operationalState: context?.operationalState,
    };

    const stream = orch.streamResponse(messages, defaultContext);

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');

    for await (const chunk of stream) {
      if (chunk.text) {
        res.write(chunk.text);
      }
    }
    res.end();
  } catch (error) {
    const err = error as Error;
    console.error("Chat Server Error:", err.message || err);
    if (!res.headersSent) {
      res.status(500).json({ error: err.message || "Failed to generate response" });
    } else {
      res.end();
    }
  }
});
