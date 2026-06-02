import { Request, Response } from 'express';
import { ChatService } from './ChatService';

export const ChatController = {
  /**
   * Retrieves all chat sessions for the authenticated user ID
   */
  async getChats(req: Request, res: Response) {
    try {
      const userId = (req.query.userId as string) || 'guest_user';
      const chats = await ChatService.getChatsForUser(userId);
      return res.json(chats);
    } catch (err: any) {
      console.error("ChatController getChats response error:", err);
      return res.status(500).json({ error: err?.message || 'Failed to fetch conversations.' });
    }
  },

  /**
   * Retrieves full conversation logs under a specific session
   */
  async getChatDetail(req: Request, res: Response) {
    try {
      const { chatId } = req.params;
      const result = await ChatService.getChatDetail(chatId);
      
      if (!result) {
        return res.status(404).json({ error: 'Selected consultation session could not be located.' });
      }

      return res.json({
        chatId: result.session.id,
        title: result.session.title,
        messages: result.messages.map(m => ({
          role: m.role,
          text: m.text,
          timestamp: m.timestamp
        }))
      });
    } catch (err: any) {
      console.error("ChatController getChatDetail response error:", err);
      return res.status(500).json({ error: err?.message || 'Failed to retrieve conversation details.' });
    }
  },

  /**
   * Dispatches conversational prompts to the AI service orchestrator
   */
  async processMessage(req: Request, res: Response) {
    try {
      const { message, chatId, context } = req.body;
      
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Message payload input must be a solid string.' });
      }

      const responseResult = await ChatService.processUserMessage(message, chatId, context);
      return res.json(responseResult);
    } catch (err: any) {
      console.error("ChatController processMessage error:", err);
      return res.status(500).json({ error: err?.message || 'Failed to coordinate intelligence process.' });
    }
  },

  /**
   * Deletes and purges a chat log session securely
   */
  async deleteChat(req: Request, res: Response) {
    try {
      const { chatId } = req.params;
      await ChatService.deleteChatRecord(chatId);
      return res.json({ success: true, message: `Successfully deleted conversation thread ${chatId}.` });
    } catch (err: any) {
      console.error("ChatController deleteChat mapping error:", err);
      return res.status(500).json({ error: err?.message || 'Failed to purge session.' });
    }
  }
};
