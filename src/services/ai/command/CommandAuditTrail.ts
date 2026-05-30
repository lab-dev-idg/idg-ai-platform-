/**
 * Iraq Digital Gateway (IDG)
 * Phase 13-G: National AI Command Center - Command Audit Trail
 */

import { db, collection, addDoc, serverTimestamp } from '../../firebase';
import { CommandAuditRecord } from './types';

export class CommandAuditTrail {
  private static instance: CommandAuditTrail;
  private localLogs: CommandAuditRecord[] = [];

  private constructor() {}

  public static getInstance(): CommandAuditTrail {
    if (!this.instance) {
      this.instance = new CommandAuditTrail();
    }
    return this.instance;
  }

  /**
   * Persists an immutable state audit trace directly to Firestore.
   */
  public async logCommandAction(
    actorId: string,
    actionType: CommandAuditRecord['actionType'],
    description: string,
    previousState?: Record<string, any>,
    newState?: Record<string, any>
  ): Promise<string> {
    const id = `CMD-AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const timestamp = new Date().toISOString();

    const record: CommandAuditRecord = {
      id,
      actorId,
      actionType,
      description,
      previousState,
      newState,
      timestamp
    };

    this.localLogs.push(record);
    if (this.localLogs.length > 200) {
      this.localLogs.shift();
    }

    console.log(`[CMD-AUDIT] [${actionType}] [By: ${actorId}] ${description}`);

    try {
      await addDoc(collection(db, 'command_audits'), {
        ...record,
        createdServerTimestamp: serverTimestamp()
      });
    } catch (err) {
      console.warn(`[CMD-AUDIT] Cloud synchronization offline. Trace preserved in offline cache: ${id}`, err);
    }

    return id;
  }

  public getLogs(): CommandAuditRecord[] {
    return [...this.localLogs];
  }
}
