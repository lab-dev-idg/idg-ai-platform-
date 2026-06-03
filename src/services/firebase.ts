import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, updateDoc, collection, query, where, onSnapshot, addDoc, serverTimestamp, orderBy, limit, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const env = (import.meta as any).env || {};

const safeConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || firebaseConfig.apiKey || '',
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || firebaseConfig.authDomain || 'idg-core-iq.firebaseapp.com',
  projectId: env.VITE_FIREBASE_PROJECT_ID || firebaseConfig.projectId || 'idg-core-iq',
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || firebaseConfig.storageBucket || 'idg-core-iq.firebasestorage.app',
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseConfig.messagingSenderId || '',
  appId: env.VITE_FIREBASE_APP_ID || firebaseConfig.appId || '',
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID || firebaseConfig.measurementId || '',
  firestoreDatabaseId: env.VITE_FIREBASE_FIRESTORE_DATABASE_ID || firebaseConfig.firestoreDatabaseId || undefined
};

// If the database ID is "(default)" or "default", pass undefined to use default
const resolvedDbId = (safeConfig.firestoreDatabaseId === '(default)' || safeConfig.firestoreDatabaseId === 'default' || !safeConfig.firestoreDatabaseId)
  ? undefined 
  : safeConfig.firestoreDatabaseId;

const app = getApps().length === 0 ? initializeApp(safeConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app, resolvedDbId);
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/drive');

// Service diagnostic status helper
export function getFirebaseServiceStatus(): 'Connected' | 'Missing' | 'Invalid' {
  if (!safeConfig.apiKey || !safeConfig.projectId) {
    return 'Missing';
  }
  if (safeConfig.apiKey.includes('YOUR_') || safeConfig.apiKey.length < 10) {
    return 'Invalid';
  }
  return 'Connected';
}

// Validate Connection to Firestore
async function testConnection() {
  try {
    if (safeConfig.apiKey && !safeConfig.apiKey.includes('YOUR_')) {
      await getDocFromServer(doc(db, 'test', 'connection'));
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Firebase client is offline. This is expected in server sandboxes or environments without active external route connection. Please check your Firebase configuration if you are running in a fully connected client browser.");
    }
  }
}
testConnection();

// Operation Types for Error Reporting
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  serverTimestamp,
  orderBy,
  limit
};
export type { User };

