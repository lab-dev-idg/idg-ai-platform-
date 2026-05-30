/**
 * Iraq Digital Gateway (IDG)
 * Phase 13-H: AI Brain Validation & Simulation Framework - Validation Audit Trail
 */

import { db, collection, addDoc, serverTimestamp } from '../../firebase';
import { ValidationAuditRecord } from './types';

export class ValidationAuditTrail {
  private static instance: ValidationAuditTrail;
  private localHistory: ValidationAuditRecord[] = [];

  private constructor() {}

  public static getInstance(): ValidationAuditTrail {
    if (!this.instance) {
      this.instance = new ValidationAuditTrail();
    }
    return this.instance;
  }

  /**
   * Commits validation benchmark, session updates, or certification reports to Firestore asynchronously.
   */
  public async logEvent(
    eventType: ValidationAuditRecord['eventType'],
    description: string,
    details: Record<string, any>
  ): Promise<string> {
    const id = `VAL-AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const timestamp = new Date().toISOString();

    const record: ValidationAuditRecord = {
      id,
      eventType,
      description,
      details,
      timestamp
    };

    this.localHistory.push(record);
    if (this.localHistory.length > 500) {
      this.localHistory.shift();
    }

    console.log(`[VAL-AUDIT] [${eventType}] ${description}`);

    try {
      await addDoc(collection(db, 'validation_audits'), {
        ...record,
        createdServerTimestamp: serverTimestamp()
      });
    } catch (err) {
      console.warn(`[VAL-AUDIT] Firebase Sync Offline. Session trace logged locally in memory: ${id}`, err);
    }

    return id;
  }

  public getHistory(): ValidationAuditRecord[] {
    return [...this.localHistory];
  }
}
