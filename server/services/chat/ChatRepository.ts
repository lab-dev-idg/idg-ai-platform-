import { db } from '../firestore';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  startAfter, 
  limit,
  runTransaction
} from 'firebase/firestore';

export interface BackendChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  tenantId: string;
  deletedAt?: string | null;
  deletedBy?: string | null;
}

export interface BackendChatMessage {
  id?: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export interface SystemAuditLog {
  action: 'chat_created' | 'chat_deleted' | 'message_sent' | 'message_received';
  userId: string;
  tenantId: string;
  chatId: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

async function writeAuditLog(
  action: SystemAuditLog['action'],
  userId: string,
  tenantId: string,
  chatId: string,
  metadata?: Record<string, any>
): Promise<void> {
  try {
    const now = new Date().toISOString();
    const auditCol = collection(db, 'audit_logs');
    await addDoc(auditCol, {
      action,
      userId,
      tenantId,
      chatId,
      timestamp: now,
      metadata: metadata || {}
    });
  } catch (err) {
    console.error("Failed to write to audit_logs collection:", err);
  }
}

export const ChatRepository = {
  /**
   * Creates a new chat session document.
   */
  async createChat(userId: string, tenantId: string, title: string): Promise<string> {
    const id = 'chat_' + Math.random().toString(36).substring(2, 11);
    const now = new Date().toISOString();
    const chatDoc: BackendChatSession = {
      id,
      title,
      userId,
      tenantId,
      createdAt: now,
      updatedAt: now
    };

    const chatDocRef = doc(db, 'chats', id);
    await setDoc(chatDocRef, chatDoc);
    await writeAuditLog('chat_created', userId, tenantId, id, { title });
    return id;
  },

  /**
   * Updates an existing chat session's title under strict tenant check.
   */
  async updateChatTitle(chatId: string, userId: string, tenantId: string, title: string): Promise<void> {
    const now = new Date().toISOString();
    const chatRef = doc(db, 'chats', chatId);
    
    await runTransaction(db, async (transaction) => {
      const docSnap = await transaction.get(chatRef);
      if (!docSnap.exists()) {
        throw new Error('Chat session not found');
      }
      const data = docSnap.data() as BackendChatSession;
      if (data?.userId !== userId || data?.tenantId !== tenantId) {
        throw new Error('Unauthorized chat ownership');
      }
      transaction.update(chatRef, { title, updatedAt: now });
    });
  },

  /**
   * Retrieves all chat sessions for a user within a tenant, ordered by updatedAt desc, limit 100 with optional pagination and search filters.
   */
  async getChats(
    userId: string,
    tenantId: string,
    limitVal: number = 100,
    startAfterId?: string,
    searchTerm?: string
  ): Promise<{ chats: BackendChatSession[]; hasMore: boolean }> {
    try {
      let startDoc: any = null;
      if (startAfterId) {
        startDoc = await getDoc(doc(db, 'chats', startAfterId));
      }

      const chatsCol = collection(db, 'chats');
      const constraints: any[] = [
        where('userId', '==', userId),
        where('tenantId', '==', tenantId),
        orderBy('updatedAt', 'desc')
      ];

      if (startDoc && startDoc.exists()) {
        constraints.push(startAfter(startDoc));
      }

      constraints.push(limit(limitVal * 2 + 1));

      const q = query(chatsCol, ...constraints);
      const snapshot = await getDocs(q);
      const chatsList: BackendChatSession[] = [];

      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.deletedAt) {
          return;
        }

        const title = data.title || 'Inquiry';
        if (searchTerm && !title.toLowerCase().includes(searchTerm.toLowerCase())) {
          return;
        }

        chatsList.push({
          id: docSnap.id,
          title,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          userId: data.userId,
          tenantId: data.tenantId,
          deletedAt: data.deletedAt || null,
          deletedBy: data.deletedBy || null
        });
      });

      const slicedChats = chatsList.slice(0, limitVal);
      const hasMore = chatsList.length > limitVal;

      return { chats: slicedChats, hasMore };
    } catch (err) {
      console.error("Failed to query chats from Firestore with paginated search:", err);
      return { chats: [], hasMore: false };
    }
  },

  /**
   * Retrieves a single chat session document after validating tenant & user ownership.
   */
  async getChat(chatId: string, userId: string, tenantId: string): Promise<BackendChatSession | null> {
    try {
      const docSnap = await getDoc(doc(db, 'chats', chatId));
      if (!docSnap.exists()) return null;
      const data = docSnap.data();
      if (data?.userId !== userId || data?.tenantId !== tenantId) {
        return null;
      }
      if (data?.deletedAt) {
        return null;
      }
      return {
        id: docSnap.id,
        title: data.title || 'Inquiry',
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        userId: data.userId,
        tenantId: data.tenantId,
        deletedAt: data.deletedAt || null,
        deletedBy: data.deletedBy || null
      };
    } catch (err) {
      console.error(`Failed to get chat doc: ${chatId}`, err);
      return null;
    }
  },

  /**
   * Appends an individual message as a subdocument and records an audit log.
   */
  async addMessage(
    chatId: string,
    userId: string,
    tenantId: string,
    role: 'user' | 'model',
    text: string
  ): Promise<void> {
    const chatRef = doc(db, 'chats', chatId);
    const now = new Date().toISOString();
    
    // Validate ownership before insertion
    const docSnap = await getDoc(chatRef);
    if (!docSnap.exists()) {
      throw new Error(`Chat session ${chatId} does not exist.`);
    }
    const data = docSnap.data();
    if (data?.userId !== userId || data?.tenantId !== tenantId) {
      throw new Error('Unauthorized message attachment.');
    }

    const messageDoc: BackendChatMessage = {
      role,
      text,
      timestamp: now
    };

    const messagesCol = collection(db, 'chats', chatId, 'messages');
    await addDoc(messagesCol, messageDoc);
    await updateDoc(chatRef, { updatedAt: now });

    // Audit logs entry
    const auditAction = role === 'user' ? 'message_sent' : 'message_received';
    await writeAuditLog(auditAction, userId, tenantId, chatId, { textLen: text.length });
  },

  /**
   * Gets all messages belonging to a specified chat session.
   */
  async getMessages(chatId: string, userId: string, tenantId: string): Promise<BackendChatMessage[]> {
    // Confirm ownership
    const chatRef = doc(db, 'chats', chatId);
    const docSnap = await getDoc(chatRef);
    if (!docSnap.exists()) {
      throw new Error('Chat session not found');
    }
    const data = docSnap.data();
    if (data?.userId !== userId || data?.tenantId !== tenantId) {
      throw new Error('Unauthorized message read');
    }

    const messages: BackendChatMessage[] = [];
    const messagesCol = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesCol, orderBy('timestamp', 'asc'));
    const snapshot = await getDocs(q);
    
    snapshot.forEach((docSnap) => {
      const msgData = docSnap.data();
      messages.push({
        id: docSnap.id,
        role: msgData.role,
        text: msgData.text || '',
        timestamp: msgData.timestamp
      });
    });

    return messages;
  },

  /**
   * Performs soft-delete on the chat session document.
   */
  async deleteChat(chatId: string, userId: string, tenantId: string): Promise<void> {
    const chatRef = doc(db, 'chats', chatId);
    const docSnap = await getDoc(chatRef);
    if (!docSnap.exists()) return;
    const data = docSnap.data();
    if (data?.userId !== userId || data?.tenantId !== tenantId) {
      throw new Error('Unauthorized chat purging request');
    }

    const now = new Date().toISOString();
    await updateDoc(chatRef, {
      deletedAt: now,
      deletedBy: userId
    });

    await writeAuditLog('chat_deleted', userId, tenantId, chatId, { softDelete: true });
  }
};
