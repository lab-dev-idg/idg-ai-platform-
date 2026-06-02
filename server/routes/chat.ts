import express, { Request, Response } from 'express';
import { FirestoreRepository } from '../services/firestore';
import { ChatOrchestrator } from '../services/chat';

export const chatRouter = express.Router();

/**
 * POST /api/chat
 * Accepts: { message: string, chatId?: string, context?: any }
 * Returns: { chatId, title, response, createdAt }
 */
chatRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { message, chatId, context } = req.body;
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: "Message input string is required." });
    }

    const result = await ChatOrchestrator.processMessage(message, chatId, context);
    return res.json(result);
  } catch (error: any) {
    console.error("POST /api/chat error:", error);
    return res.status(500).json({ error: error?.message || "Failed to process chat conversation." });
  }
});

/**
 * GET /api/chats
 * Query: ?userId=xxx
 * Returns: Array of chat sessions [{ id, title, createdAt, updatedAt, userId }, ...]
 */
chatRouter.get('/', async (req: Request, res: Response) => {
  try {
    const userId = (req.query.userId as string) || 'guest_user';
    const chats = await FirestoreRepository.getChats(userId);
    return res.json(chats);
  } catch (error: any) {
    console.error("GET /api/chats error:", error);
    return res.status(500).json({ error: error?.message || "Failed to fetch chat sessions." });
  }
});

/**
 * GET /api/chat/:chatId
 * Returns: { chatId, title, messages: [{ role, text, timestamp }, ...] }
 */
chatRouter.get('/:chatId', async (req: Request, res: Response) => {
  try {
    const { chatId } = req.params;
    const session = await FirestoreRepository.getChat(chatId);
    
    if (!session) {
      return res.status(404).json({ error: `Chat session ${chatId} not found.` });
    }

    const messages = await FirestoreRepository.getMessages(chatId);
    
    return res.json({
      chatId: session.id,
      title: session.title,
      messages: messages.map(m => ({
        role: m.role,
        text: m.text,
        timestamp: m.timestamp
      }))
    });
  } catch (error: any) {
    console.error(`GET /api/chat/${req.params.chatId} error:`, error);
    return res.status(500).json({ error: error?.message || "Failed to fetch chat detailed session." });
  }
});

/**
 * DELETE /api/chat/:chatId
 * Returns: { success: true }
 */
chatRouter.delete('/:chatId', async (req: Request, res: Response) => {
  try {
    const { chatId } = req.params;
    await FirestoreRepository.deleteChat(chatId);
    return res.json({ success: true, message: `Successfully deleted chat ${chatId}.` });
  } catch (error: any) {
    console.error(`DELETE /api/chat/${req.params.chatId} error:`, error);
    return res.status(500).json({ error: error?.message || "Failed to delete chat session." });
  }
});
