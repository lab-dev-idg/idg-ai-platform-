import { AIMessage } from '../../../src/services/ai/types';

export interface SessionData {
  sessionId: string;
  messages: AIMessage[];
  workspaceContext: Record<string, unknown>;
  updatedAt: number;
}

// In-memory cache for fast retrieval (Spark-plan optimization)
const sessionCache = new Map<string, SessionData>();

export class SessionMemory {
  static getSession(sessionId: string): SessionData {
    if (sessionCache.has(sessionId)) {
      return sessionCache.get(sessionId)!;
    }
    
    // Simulate fetching from Firestore if not in cache
    const newSession = {
      sessionId,
      messages: [],
      workspaceContext: {},
      updatedAt: Date.now()
    };
    sessionCache.set(sessionId, newSession);
    return newSession;
  }

  static appendMessage(sessionId: string, message: AIMessage) {
    const session = this.getSession(sessionId);
    session.messages.push(message);
    session.updatedAt = Date.now();
    
    // Batched update to Firestore would go here (e.g. debounced 2 seconds)
    // to strictly preserve Spark-plan write quotas.
  }

  static setWorkspaceContext(sessionId: string, context: Record<string, unknown>) {
    const session = this.getSession(sessionId);
    session.workspaceContext = { ...session.workspaceContext, ...context };
    session.updatedAt = Date.now();
  }

  static summarizeMemory(sessionId: string): string {
    const session = this.getSession(sessionId);
    const mCount = session.messages.length;
    if (mCount <= 10) return "Recent session";
    
    // Placeholder for actual summarization logic
    return `Session with ${mCount} interactions.`;
  }
}
