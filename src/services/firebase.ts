import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, updateDoc, collection, query, where, onSnapshot, addDoc, serverTimestamp, orderBy, limit, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const env = (import.meta as any).env || {};

const safeConfig = {
  apiKey: firebaseConfig.apiKey || env.VITE_FIREBASE_API_KEY || '',
  authDomain: firebaseConfig.authDomain || env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: (firebaseConfig.projectId && firebaseConfig.projectId !== 'dg-core-iq')
    ? firebaseConfig.projectId
    : (env.VITE_FIREBASE_PROJECT_ID && env.VITE_FIREBASE_PROJECT_ID !== 'dg-core-iq' ? env.VITE_FIREBASE_PROJECT_ID : ''),
  storageBucket: firebaseConfig.storageBucket || env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: firebaseConfig.messagingSenderId || env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: firebaseConfig.appId || env.VITE_FIREBASE_APP_ID || '',
  measurementId: firebaseConfig.measurementId || env.VITE_FIREBASE_MEASUREMENT_ID || '',
  firestoreDatabaseId: firebaseConfig.firestoreDatabaseId || env.VITE_FIREBASE_FIRESTORE_DATABASE_ID || 'default'
};

const app = getApps().length === 0 ? initializeApp(safeConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app, safeConfig.firestoreDatabaseId || undefined);
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

