import { FirestoreRepository, ChatSession } from '../firestore';
import { GeminiService } from '../gemini';

export interface ChatOrchestrationResult {
  chatId: string;
  title: string;
  response: string;
  createdAt: string;
}

export const ChatOrchestrator = {
  /**
   * Processes a conversation turn:
   * - Creates a new chat if no chatId is provided (generating title automatically via Gemini).
   * - Appends User's message to Firestore.
   * - Resolves Chat history from Firestore (to prevent client-side desync/manipulation).
   * - Generates secure response from Gemini.
   * - Appends Model's response to Firestore.
   * - Returns unified result.
   */
  async processMessage(
    message: string,
    chatId: string | undefined,
    context: any
  ): Promise<ChatOrchestrationResult> {
    try {
      // Step 1: Resolve user ID (and assign generic guest fallback if unauthorized or empty)
      const userId = context?.userId || 'guest_user';
      
      let finalChatId = chatId;
      let title = '';
      let chatSession: ChatSession | null = null;

      // Create new session if no chatId was passed or if we need to bootstrap first
      if (!finalChatId) {
        // Generate title dynamically based purely on first query on the backend
        title = await GeminiService.generateTitle(message);
        finalChatId = await FirestoreRepository.createChat(userId, title);
      } else {
        // Retrieve existing session info
        chatSession = await FirestoreRepository.getChat(finalChatId);
        if (!chatSession) {
          // If a chatId was provided but didn't exist in Firestore, recreate
          title = await GeminiService.generateTitle(message);
          finalChatId = await FirestoreRepository.createChat(userId, title);
        } else {
          title = chatSession.title;
        }
      }

      // Step 2: Persist the new User query to server-side Firestore
      await FirestoreRepository.addMessage(finalChatId, 'user', message);

      // Step 3: Fetch current consolidated chat history from server-side database
      // This guarantees absolute single source of truth, bypassing any frontend manipulations or race-conditions!
      const rawMessages = await FirestoreRepository.getMessages(finalChatId);
      
      // Keep only first-class text messages from history, filtered as user/model tuples
      const history = rawMessages
        .filter(m => m.id && m.text && (m.role === 'user' || m.role === 'model'))
        .map(m => ({
          role: m.role,
          text: m.text
        }));

      // Pop the last added msg (which is our active prompt) from the history array so we do not send it twice
      if (history.length > 0 && history[history.length - 1].text === message) {
        history.pop();
      }

      // Step 4: Invoke Gemini Provider with full history context
      const aiResponseText = await GeminiService.generateResponse(message, history, context);

      // Step 5: Persist Model response under the active chat session in Firestore
      await FirestoreRepository.addMessage(finalChatId, 'model', aiResponseText);

      // Step 6: Query session structure to return exact creation dates
      const finalizedSession = await FirestoreRepository.getChat(finalChatId);

      return {
        chatId: finalChatId,
        title,
        response: aiResponseText,
        createdAt: finalizedSession?.createdAt || new Date().toISOString()
      };
    } catch (err) {
      console.error("ChatOrchestrator processMessage error:", err);
      throw err;
    }
  }
};
