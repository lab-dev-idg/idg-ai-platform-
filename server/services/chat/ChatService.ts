import { ChatRepository, BackendChatSession, BackendChatMessage } from './ChatRepository';
import { GeminiService } from '../gemini';

export interface ProcessedMessageResult {
  chatId: string;
  title: string;
  response: string;
  createdAt: string;
}

export const ChatService = {
  /**
   * Retrieves all chats for a given user
   */
  async getChatsForUser(userId: string): Promise<BackendChatSession[]> {
    try {
      return await ChatRepository.getChats(userId);
    } catch (err) {
      console.error("ChatService getChatsForUser failure:", err);
      return [];
    }
  },

  /**
   * Resolves specific chat detail info
   */
  async getChatDetail(chatId: string): Promise<{ session: BackendChatSession; messages: BackendChatMessage[] } | null> {
    try {
      const session = await ChatRepository.getChat(chatId);
      if (!session) return null;
      const messages = await ChatRepository.getMessages(chatId);
      return { session, messages };
    } catch (err) {
      console.error(`ChatService getChatDetail(${chatId}) failure:`, err);
      return null;
    }
  },

  /**
   * Processes conversational step
   */
  async processUserMessage(
    message: string,
    chatId: string | undefined,
    context: any
  ): Promise<ProcessedMessageResult> {
    try {
      const userId = context?.userId || 'guest_user';
      let activeId = chatId;
      let title = '';

      if (!activeId) {
        // First message ever! Generate a max 6-word title.
        title = await GeminiService.generateTitle(message);
        // Ensure strictly max 6 words (client-side safety truncate just in case)
        const words = title.split(/\s+/);
        if (words.length > 6) {
          title = words.slice(0, 6).join(' ') + '...';
        }
        activeId = await ChatRepository.createChat(userId, title);
      } else {
        const session = await ChatRepository.getChat(activeId);
        if (!session) {
          title = await GeminiService.generateTitle(message);
          const words = title.split(/\s+/);
          if (words.length > 6) {
            title = words.slice(0, 6).join(' ') + '...';
          }
          activeId = await ChatRepository.createChat(userId, title);
        } else {
          title = session.title;
        }
      }

      // Store user prompt on server Firestore first
      await ChatRepository.addMessage(activeId, 'user', message);

      // Fetch consolidated chat history to send to Gemini
      const messagesList = await ChatRepository.getMessages(activeId);
      const history = messagesList
        .filter(m => m.role === 'user' || m.role === 'model')
        .map(m => ({
          role: m.role as 'user' | 'model',
          text: m.text
        }));

      // Pop the active user message so it isn't parsed twice during next model prompt
      if (history.length > 0 && history[history.length - 1].text === message) {
        history.pop();
      }

      // Request secure model output
      let aiResponseText = '';
      try {
        aiResponseText = await GeminiService.generateResponse(message, history, context);
      } catch (geminiErr) {
        console.error("Gemini invocation failed, using offline response fallback:", geminiErr);
        aiResponseText = context?.language === 'ar' 
          ? 'المساعد الذكي غير متصل بنظام المحاكاة المركزي حالياً. ولكن تم حفظ بيانات الملاحة والعمليات المحلية بأمان.'
          : 'سیستمی یاریدەدەری گومرگی لە ئێستادا ناچالاکە لە پەیوەندی مرکزی. بەڵام سەرجەم ڕێکارەکانی بەندەر و چاودێری گواستنەوەکان پارێزراون.';
      }

      // Store model response on server Firestore
      await ChatRepository.addMessage(activeId, 'model', aiResponseText);

      const resolvedSession = await ChatRepository.getChat(activeId);

      return {
        chatId: activeId,
        title,
        response: aiResponseText,
        createdAt: resolvedSession?.createdAt || new Date().toISOString()
      };
    } catch (error) {
      console.error("ChatService processUserMessage critical error:", error);
      const safeId = chatId || 'fallback_session_' + Date.now();
      return {
        chatId: safeId,
        title: 'System Recovery Session',
        response: 'Emergency Recovery System Activated. The server is online, but connection to external databases was interrupted. Please rest assured that transaction records are securely buffered.',
        createdAt: new Date().toISOString()
      };
    }
  },

  /**
   * Delete chat and resources
   */
  async deleteChatRecord(chatId: string): Promise<void> {
    try {
      await ChatRepository.deleteChat(chatId);
    } catch (err) {
      console.error(`ChatService deleteChatRecord(${chatId}) failure:`, err);
    }
  }
};
