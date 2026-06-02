import { Request, Response } from 'express';
import { ChatService } from './ChatService';

export const ChatController = {
  /**
   * Retrieves all chat sessions under current authenticated UID and tenant isolation.
   */
  async getChats(req: Request, res: Response) {
    try {
      const userId = req.user?.uid;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthenticated Request.' });
      }

      // Tenant isolated identifier (can be extended to check organizations/header defaults)
      const tenantId = 'default-tenant';

      const limitVal = req.query.limit ? parseInt(req.query.limit as string, 10) : 100;
      const cursor = req.query.cursor as string | undefined;
      const search = req.query.search as string | undefined;

      const result = await ChatService.getChatsForUser(userId, tenantId, limitVal, cursor, search);
      return res.json(result);
    } catch (err: any) {
      console.error("ChatController getChats error:", err);
      return res.status(500).json({ error: err?.message || 'Failed to fetch conversations.' });
    }
  },

  /**
   * Retrieves full conversation logs under specific session validating ownership.
   */
  async getChatDetail(req: Request, res: Response) {
    try {
      const userId = req.user?.uid;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthenticated Request.' });
      }

      const { chatId } = req.params;
      const tenantId = 'default-tenant';

      const result = await ChatService.getChatDetail(chatId, userId, tenantId);
      if (!result) {
        return res.status(404).json({ error: 'Selected consultation session could not be located or access is forbidden.' });
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
      console.error("ChatController getChatDetail error:", err);
      return res.status(500).json({ error: err?.message || 'Failed to retrieve conversation details.' });
    }
  },

  /**
   * Dispatches conversational prompts to the AI service orchestrator securely.
   */
  async processMessage(req: Request, res: Response) {
    try {
      const userId = req.user?.uid;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthenticated Request.' });
      }

      const { message, chatId, context } = req.body;
      const tenantId = 'default-tenant';

      // Attach context parameter to forward safely
      const enrichedContext = {
        ...(context || {}),
        userId,
        tenantId,
        userEmail: req.user?.email
      };

      const responseResult = await ChatService.processUserMessage(
        message, 
        chatId, 
        userId, 
        tenantId, 
        enrichedContext
      );

      return res.json(responseResult);
    } catch (err: any) {
      console.error("ChatController processMessage error:", err);
      return res.status(500).json({ error: err?.message || 'Failed to coordinate intelligence process.' });
    }
  },

  /**
   * Purges a single conversation thread cleanly under security ownership.
   */
  async deleteChat(req: Request, res: Response) {
    try {
      const userId = req.user?.uid;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthenticated Request.' });
      }

      const { chatId } = req.params;
      const tenantId = 'default-tenant';

      await ChatService.deleteChatRecord(chatId, userId, tenantId);
      return res.json({ success: true, message: `Successfully deleted conversation thread ${chatId}.` });
    } catch (err: any) {
      console.error("ChatController deleteChat error:", err);
      return res.status(500).json({ error: err?.message || 'Failed to purge session.' });
    }
  }
};
