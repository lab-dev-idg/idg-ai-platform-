import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

export interface BackendChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface BackendChatMessage {
  id?: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

let firebaseConfig: any = {};
try {
  const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
  if (fs.existsSync(configPath)) {
    firebaseConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  }
} catch (err) {
  console.warn("Failed to load firebase-applet-config.json in ChatRepository:", err);
}

const projectId = process.env.VITE_FIREBASE_PROJECT_ID || firebaseConfig.projectId || '';

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      projectId: projectId || undefined
    });
  } catch (err) {
    console.warn("Firebase Admin SDK init error, using empty config:", err);
    admin.initializeApp();
  }
}

let db: any;
try {
  const dbId = process.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID || firebaseConfig.firestoreDatabaseId;
  if (dbId && dbId !== 'default') {
    db = admin.firestore(dbId);
  } else {
    db = admin.firestore();
  }
} catch (e) {
  console.warn("Failed to get named firestore database, falling back to default:", e);
  db = admin.firestore();
}

// Memory fallback to ensure UI never crashes when Firestore is restricted/offline
const inMemoryChats: Map<string, BackendChatSession> = new Map();
const inMemoryMessages: Map<string, BackendChatMessage[]> = new Map();

export const ChatRepository = {
  async createChat(userId: string, title: string): Promise<string> {
    try {
      const id = 'chat_' + Math.random().toString(36).substring(2, 11);
      const now = new Date().toISOString();
      const chatDoc: BackendChatSession = {
        id,
        title,
        userId,
        createdAt: now,
        updatedAt: now
      };

      try {
        await db.collection('chats').doc(id).set(chatDoc);
      } catch (dbErr) {
        console.error("FirestoreAdmin failure on createChat, using safe in-memory fallback:", dbErr);
        inMemoryChats.set(id, chatDoc);
      }

      return id;
    } catch (err) {
      console.error("ChatRepository createChat critical error:", err);
      const fallbackId = 'fallback_chat_' + Date.now();
      return fallbackId;
    }
  },

  async updateChatTitle(chatId: string, title: string): Promise<void> {
    try {
      const now = new Date().toISOString();
      try {
        await db.collection('chats').doc(chatId).update({
          title,
          updatedAt: now
        });
      } catch (dbErr) {
        console.error(`FirestoreAdmin updateChatTitle failed for ${chatId}, attempting in-memory:`, dbErr);
        const memChat = inMemoryChats.get(chatId);
        if (memChat) {
          memChat.title = title;
          memChat.updatedAt = now;
        }
      }
    } catch (err) {
      console.error("ChatRepository updateChatTitle catch-all:", err);
    }
  },

  async getChats(userId: string): Promise<BackendChatSession[]> {
    try {
      const chats: BackendChatSession[] = [];
      try {
        const snapshot = await db.collection('chats').where('userId', '==', userId).get();
        snapshot.forEach((doc: any) => {
          const data = doc.data();
          chats.push({
            id: doc.id,
            title: data.title || 'Inquiry',
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            userId: data.userId
          });
        });
      } catch (dbErr) {
        console.error("FirestoreAdmin getChats failed, using in-memory collection:", dbErr);
        inMemoryChats.forEach((chat) => {
          if (chat.userId === userId) {
            chats.push({ ...chat });
          }
        });
      }

      chats.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      return chats;
    } catch (err) {
      console.error("ChatRepository getChats catch-all:", err);
      return [];
    }
  },

  async getChat(chatId: string): Promise<BackendChatSession | null> {
    try {
      try {
        const docSnap = await db.collection('chats').doc(chatId).get();
        if (docSnap.exists) {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            title: data.title || 'Inquiry',
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            userId: data.userId
          };
        }
      } catch (dbErr) {
        console.error(`FirestoreAdmin getChat(${chatId}) failed, attempting memory lookup:`, dbErr);
        const memChat = inMemoryChats.get(chatId);
        if (memChat) return { ...memChat };
      }
      return null;
    } catch (err) {
      console.error(`ChatRepository getChat(${chatId}) error:`, err);
      return null;
    }
  },

  async addMessage(chatId: string, role: 'user' | 'model', text: string): Promise<void> {
    try {
      const now = new Date().toISOString();
      const messageDoc: BackendChatMessage = {
        role,
        text,
        timestamp: now
      };

      try {
        await db.collection('chats').doc(chatId).collection('messages').add(messageDoc);
        await db.collection('chats').doc(chatId).update({ updatedAt: now });
      } catch (dbErr) {
        console.error(`FirestoreAdmin addMessage for chat ${chatId} failed, caching to memory:`, dbErr);
        
        let memMsgs = inMemoryMessages.get(chatId);
        if (!memMsgs) {
          memMsgs = [];
          inMemoryMessages.set(chatId, memMsgs);
        }
        memMsgs.push(messageDoc);

        const memChat = inMemoryChats.get(chatId);
        if (memChat) {
          memChat.updatedAt = now;
        }
      }
    } catch (err) {
      console.error("ChatRepository addMessage critical error:", err);
    }
  },

  async getMessages(chatId: string): Promise<BackendChatMessage[]> {
    try {
      const messages: BackendChatMessage[] = [];
      try {
        const snapshot = await db.collection('chats').doc(chatId).collection('messages').get();
        snapshot.forEach((docSnap: any) => {
          const data = docSnap.data();
          messages.push({
            id: docSnap.id,
            role: data.role,
            text: data.text || '',
            timestamp: data.timestamp
          });
        });
      } catch (dbErr) {
        console.error(`FirestoreAdmin getMessages(${chatId}) failed, using in-memory list:`, dbErr);
        const memMsgs = inMemoryMessages.get(chatId) || [];
        messages.push(...memMsgs.map(m => ({ ...m })));
      }

      messages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      return messages;
    } catch (err) {
      console.error(`ChatRepository getMessages(${chatId}) error:`, err);
      return [];
    }
  },

  async deleteChat(chatId: string): Promise<void> {
    try {
      try {
        const snapshot = await db.collection('chats').doc(chatId).collection('messages').get();
        const batch = db.batch();
        snapshot.forEach((docSnap: any) => {
          batch.delete(docSnap.ref);
        });
        batch.delete(db.collection('chats').doc(chatId));
        await batch.commit();
      } catch (dbErr) {
        console.error(`FirestoreAdmin deleteChat(${chatId}) failed, applying database memory purge:`, dbErr);
        inMemoryChats.delete(chatId);
        inMemoryMessages.delete(chatId);
      }
    } catch (err) {
      console.error(`ChatRepository deleteChat(${chatId}) critical error:`, err);
    }
  }
};
