import { initializeApp, getApps, getApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import fs from 'fs';
import path from 'path';

let firebaseConfig: Record<string, string> = {};
try {
  const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
  if (fs.existsSync(configPath)) {
    firebaseConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  }
} catch (err) {
  console.warn("Failed to load firebase-applet-config.json in bootstrap:", err);
}

// Prefer explicit Firebase/Firestore Project ID configured for this applet
const getSafeProjectId = (): string => {
  const configId = firebaseConfig.projectId;
  if (configId && configId !== 'dg-core-iq' && configId !== 'gen-lang-client-0647247129') return configId;
  
  const envId = process.env.VITE_FIREBASE_PROJECT_ID;
  if (envId && envId !== 'dg-core-iq' && envId !== 'gen-lang-client-0647247129') return envId;

  const gcpProj = process.env.GOOGLE_CLOUD_PROJECT;
  if (gcpProj && gcpProj !== 'dg-core-iq' && gcpProj !== 'gen-lang-client-0647247129') return gcpProj;

  const gcloudProj = process.env.GCLOUD_PROJECT;
  if (gcloudProj && gcloudProj !== 'dg-core-iq' && gcloudProj !== 'gen-lang-client-0647247129') return gcloudProj;

  return 'idg-core-iq-443a9';
};

const projectId = getSafeProjectId();

const appInstance = getApps().length === 0 
  ? initializeApp({ projectId: projectId || undefined })
  : getApp();

const dbId = process.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID || firebaseConfig.firestoreDatabaseId;

let dbInstance: FirebaseFirestore.Firestore;
try {
  if (dbId && dbId !== 'default') {
    dbInstance = getFirestore(appInstance, dbId);
  } else {
    dbInstance = getFirestore(appInstance);
  }
} catch (e) {
  console.warn("Failed to get named firestore database, falling back to default:", e);
  dbInstance = getFirestore(appInstance);
}

export { appInstance as app, dbInstance as db };
