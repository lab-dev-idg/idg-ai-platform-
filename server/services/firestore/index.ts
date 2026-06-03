import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs,
  collection, 
  query, 
  where, 
  addDoc, 
  deleteDoc
} from 'firebase/firestore';

// Read config from root firebase-applet-config.json
import fs from 'fs';
import path from 'path';

let firebaseConfig: any = {};
try {
  const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
  if (fs.existsSync(configPath)) {
    firebaseConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  }
} catch (err) {
  console.warn("Failed to load firebase-applet-config.json in backend firestore service, using local env:", err);
}

const safeConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || firebaseConfig.apiKey || '',
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || firebaseConfig.authDomain || 'dg-core-iq.firebaseapp.com',
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || firebaseConfig.projectId || 'dg-core-iq',
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || firebaseConfig.storageBucket || 'dg-core-iq.firebasestorage.app',
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseConfig.messagingSenderId || '',
  appId: process.env.VITE_FIREBASE_APP_ID || firebaseConfig.appId || '',
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID || firebaseConfig.measurementId || '',
  firestoreDatabaseId: process.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID || firebaseConfig.firestoreDatabaseId || undefined
};

// If the database ID is "(default)" or "default", pass undefined to use default
const resolvedDbId = (safeConfig.firestoreDatabaseId === '(default)' || safeConfig.firestoreDatabaseId === 'default' || !safeConfig.firestoreDatabaseId)
  ? undefined 
  : safeConfig.firestoreDatabaseId;

// Initialize Firebase App for Server usage
const app = getApps().length === 0 ? initializeApp(safeConfig) : getApp();
export const db = getFirestore(app, resolvedDbId);

export interface ChatSession {
  id?: string;
  title: string;
  createdAt: any;
  updatedAt: any;
  userId: string;
}

export interface ChatMessageData {
  id?: string;
  role: 'user' | 'model';
  text: string;
  timestamp: any;
}

export const FirestoreRepository = {
  /**
   * Creates a new chat session document.
   */
  async createChat(userId: string, title: string): Promise<string> {
    try {
      const chatColRef = collection(db, 'chats');
      const now = new Date().toISOString();
      const docRef = await addDoc(chatColRef, {
        title,
        userId,
        createdAt: now,
        updatedAt: now
      });
      return docRef.id;
    } catch (error) {
      console.error("FirestoreRepository createChat error:", error);
      throw error;
    }
  },

  /**
   * Updates an existing chat session's updatedAt time and optionally title.
   */
  async updateChat(chatId: string, updates: Partial<Pick<ChatSession, 'title'>>): Promise<void> {
    try {
      const chatDocRef = doc(db, 'chats', chatId);
      const now = new Date().toISOString();
      await setDoc(chatDocRef, {
        ...updates,
        updatedAt: now
      }, { merge: true });
    } catch (error) {
      console.error("FirestoreRepository updateChat error:", error);
      throw error;
    }
  },

  /**
   * Retrieves all chat sessions for a user, ordered by updatedAt desc.
   */
  async getChats(userId: string): Promise<ChatSession[]> {
    try {
      const chatColRef = collection(db, 'chats');
      const q = query(
        chatColRef,
        where('userId', '==', userId)
      );
      const snapshot = await getDocs(q);
      const chats: ChatSession[] = [];
      snapshot.forEach(docSnap => {
        const data = docSnap.data();
        chats.push({
          id: docSnap.id,
          title: data.title || 'Inquiry',
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          userId: data.userId
        });
      });
      
      // Clientside sort fallback in case Firestore compound indexes index-build isn't complete yet
      chats.sort((a, b) => {
        const timeA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
        const timeB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
        return timeB - timeA;
      });

      return chats;
    } catch (error) {
      console.error("FirestoreRepository getChats error:", error);
      // Return empty array/fallback rather than crashing
      return [];
    }
  },

  /**
   * Retrieves a single chat session document.
   */
  async getChat(chatId: string): Promise<ChatSession | null> {
    try {
      const chatDocRef = doc(db, 'chats', chatId);
      const snap = await getDoc(chatDocRef);
      if (!snap.exists()) return null;
      const data = snap.data();
      return {
        id: snap.id,
        title: data.title || 'Inquiry',
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        userId: data.userId
      };
    } catch (error) {
      console.error(`FirestoreRepository getChat(${chatId}) error:`, error);
      return null;
    }
  },

  /**
   * Retrieves all messages belonging to a specific chat session, ordered by timestamp asc.
   */
  async getMessages(chatId: string): Promise<ChatMessageData[]> {
    try {
      const messagesColRef = collection(db, 'chats', chatId, 'messages');
      const snapshot = await getDocs(messagesColRef);
      const messages: ChatMessageData[] = [];
      snapshot.forEach(docSnap => {
        const data = docSnap.data();
        messages.push({
          id: docSnap.id,
          role: data.role,
          text: data.text || '',
          timestamp: data.timestamp
        });
      });

      // Sort by timestamp asc
      messages.sort((a, b) => {
        const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
        const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
        return timeA - timeB;
      });

      return messages;
    } catch (error) {
      console.error(`FirestoreRepository getMessages(${chatId}) error:`, error);
      return [];
    }
  },

  /**
   * Adds an individual message subdocument in chats/{chatId}/messages
   */
  async addMessage(chatId: string, role: 'user' | 'model', text: string): Promise<void> {
    try {
      const messagesColRef = collection(db, 'chats', chatId, 'messages');
      const now = new Date().toISOString();
      await addDoc(messagesColRef, {
        role,
        text,
        timestamp: now
      });

      // Maintain relational updated status
      await this.updateChat(chatId, {});
    } catch (error) {
      console.error("FirestoreRepository addMessage error:", error);
      throw error;
    }
  },

  /**
   * Delete entire chat session document and all its submessages.
   */
  async deleteChat(chatId: string): Promise<void> {
    try {
      // 1. Delete all nested messages first
      const messagesColRef = collection(db, 'chats', chatId, 'messages');
      const snapshot = await getDocs(messagesColRef);
      for (const docSnap of snapshot.docs) {
        await deleteDoc(doc(db, 'chats', chatId, 'messages', docSnap.id));
      }
      
      // 2. Delete parent chat session doc
      await deleteDoc(doc(db, 'chats', chatId));
    } catch (error) {
      console.error(`FirestoreRepository deleteChat(${chatId}) error:`, error);
      throw error;
    }
  }
};
