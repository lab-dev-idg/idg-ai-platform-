import express from 'express';
import { ChatController } from '../services/chat/ChatController';

export const chatRouter = express.Router();

/**
 * Endpoint Registrations mapping Controller Actions.
 * These satisfy:
 * - POST /api/chat (processMessage)
 * - GET /api/chats (getChats)
 * - GET /api/chat/:chatId (getChatDetail)
 * - DELETE /api/chat/:chatId (deleteChat)
 */
chatRouter.post('/', ChatController.processMessage);
chatRouter.get('/:chatId', ChatController.getChatDetail);
chatRouter.delete('/:chatId', ChatController.deleteChat);

// Handle listings from root (used for /api/chats or /api/chat queries)
chatRouter.get('/', ChatController.getChats);
