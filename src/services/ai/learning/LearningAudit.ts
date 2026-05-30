/**
 * Iraq Digital Gateway (IDG)
 * Phase 13-F: Adaptive Learning & Feedback Intelligence - Learning Audit Engine
 */

import { db, collection, addDoc, serverTimestamp } from '../../firebase';
import { LearningAuditRecord } from './types';

export class LearningAudit {
  private static instance: LearningAudit;
  private localAuditLogs: LearningAuditRecord[] = [];

  private constructor() {}

  public static getInstance(): LearningAudit {
    if (!this.instance) {
      this.instance = new LearningAudit();
    }
    return this.instance;
  }

  /**
   * Commits a state transition, ranking, or strategy change systematically to Firestore.
   */
  public async logEvent(
    eventType: LearningAuditRecord['eventType'],
    moduleName: string,
    description: string,
    details: Record<string, any> = {}
  ): Promise<string> {
    const id = `LRN-AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const timestamp = new Date().toISOString();

    const record: LearningAuditRecord = {
      id,
      eventType,
      module: moduleName,
      description,
      details,
      timestamp
    };

    // Store locally as fallback/in-memory cache
    this.localAuditLogs.push(record);
    if (this.localAuditLogs.length > 100) {
      this.localAuditLogs.shift(); // Keep latest 100 entries in memory
    }

    console.log(`[LEARNING-AUDIT] [${eventType}] [${moduleName}] ${description}`);

    try {
      await addDoc(collection(db, 'learning_audits'), {
        ...record,
        createdServerTimestamp: serverTimestamp()
      });
    } catch (err) {
      console.warn(`[LEARNING-AUDIT] Could not sync audit log to Firestore. Cached locally.`, err);
    }

    return id;
  }

  /**
   * Retrieves active audit logs compiled this session.
   */
  public getLogs(): LearningAuditRecord[] {
    return [...this.localAuditLogs];
  }
}
