import { ContextMiddleware } from '../../../src/services/ai/context/ContextPipeline';
import { SessionMemory } from '../memory/SessionMemory';

export const sessionMemoryMiddleware: ContextMiddleware = async (context, messages) => {
  if (context.userId) {
    const sessionId = `user_session_${context.userId}`;
    const session = SessionMemory.getSession(sessionId);

    // Merge workspace state
    context.workspaceState = {
      ...(context.workspaceState as Record<string, unknown> || {}),
      ...session.workspaceContext
    };

    // Store the new user message
    const userMsg = messages[messages.length - 1];
    if (userMsg && userMsg.role === 'user') {
       SessionMemory.appendMessage(sessionId, userMsg);
    }
  }

  return { context, messages };
};

export const adminGuardMiddleware: ContextMiddleware = async (context, messages) => {
  // If user is not admin and tries to use admin tools, block it
  if (context.role !== 'admin') {
    // Basic protection example
    // We could filter out admin requests from the history here
  }
  return { context, messages };
};
