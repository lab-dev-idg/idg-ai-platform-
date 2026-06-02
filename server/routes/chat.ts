import express from 'express';
import { ChatController } from '../services/chat/ChatController';
import { authMiddleware } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { z } from 'zod';

export const chatRouter = express.Router();

// Define validation schemas for chats
const postChatSchema = z.object({
  body: z.object({
    message: z.string().min(1, 'Inquiry prompt message is required.'),
    chatId: z.string().optional(),
    context: z.any().optional(),
  }),
});

const chatIdSchema = z.object({
  params: z.object({
    chatId: z.string().min(1, 'Chat ID parameter is required.'),
  }),
});

/**
 * Endpoint Registrations mapping Controller Actions.
 * Guarded by Auth verification & Request structure check.
 */
chatRouter.use(authMiddleware);

chatRouter.post('/', validateRequest(postChatSchema), ChatController.processMessage);
chatRouter.get('/:chatId', validateRequest(chatIdSchema), ChatController.getChatDetail);
chatRouter.delete('/:chatId', validateRequest(chatIdSchema), ChatController.deleteChat);
chatRouter.get('/', ChatController.getChats);
