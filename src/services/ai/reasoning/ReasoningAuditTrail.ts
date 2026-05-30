/**
 * Iraq Digital Gateway (IDG)
 * Enterprise Advanced Reasoning - Audit Trail
 * 
 * Implements write-once, immutable tracking of transaction compliance, evidence matching, 
 * security rejections, and confidence calculations with transparent Firestore persistence.
 */

import { db, collection, addDoc, serverTimestamp } from '../../firebase';
import { ReasoningConflict } from './types';

export interface AuditRecord {
  id: string;
  userId: string;
  userType: string;
  clearanceLevel: number;
  query: string;
  evidenceAccessed: Array<{ documentId: string; chunkId: string; classification: string }>;
  evidenceRejected: Array<{ documentId: string; classification: string; reason: string }>;
  conflictsDetected: ReasoningConflict[];
  confidenceScore: number;
  citations: string[];
  timestamp: string;
}

export class ReasoningAuditTrail {
  private static instance: ReasoningAuditTrail;
  private localHistory: AuditRecord[] = [];

  private constructor() {}

  public static getInstance(): ReasoningAuditTrail {
    if (!this.instance) {
      this.instance = new ReasoningAuditTrail();
    }
    return this.instance;
  }

  /**
   * Serializes a reasoning operation trace securely to Firestore with memory fallback.
   */
  public async logReasoningTransaction(record: Omit<AuditRecord, 'id' | 'timestamp'>): Promise<string> {
    const id = `AUD-REAS-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const timestamp = new Date().toISOString();

    const fullRecord: AuditRecord = {
      id,
      timestamp,
      ...record
    };

    this.localHistory.push(fullRecord);

    try {
      await addDoc(collection(db, 'audit_logs'), {
        ...fullRecord,
        createdServerTimestamp: serverTimestamp()
      });
      console.log(`[REASONING-AUDIT-TRAIL] Committed immutable audit trace: ${id} directly to Firestore.`);
    } catch (err) {
      console.warn(`[REASONING-AUDIT-TRAIL] Firestore write offline. Preserved local trace: ${id}`, err);
    }

    return id;
  }

  /**
   * Fetches read-only session trace reports.
   */
  public getLogs(): AuditRecord[] {
    return [...this.localHistory];
  }
}
