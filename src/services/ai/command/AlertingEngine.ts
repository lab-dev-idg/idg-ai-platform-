/**
 * Iraq Digital Gateway (IDG)
 * Phase 13-G: National AI Command Center - Alerting Engine
 */

import { db, collection, addDoc, serverTimestamp } from '../../firebase';
import { AlertSeverity, AlertCategory, SystemAlert } from './types';
import { CommandAuditTrail } from './CommandAuditTrail';

export class AlertingEngine {
  private static instance: AlertingEngine;
  private activeAlerts: Map<string, SystemAlert> = new Map();
  private audit = CommandAuditTrail.getInstance();

  private constructor() {}

  public static getInstance(): AlertingEngine {
    if (!this.instance) {
      this.instance = new AlertingEngine();
    }
    return this.instance;
  }

  /**
   * Generates and logs a system notification event across severity categories.
   */
  public async raiseAlert(
    severity: AlertSeverity,
    category: AlertCategory,
    message: string,
    sourceModule: string,
    details?: Record<string, any>
  ): Promise<SystemAlert> {
    const id = `ALT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const timestamp = new Date().toISOString();

    const alert: SystemAlert = {
      id,
      severity,
      category,
      message,
      sourceModule,
      timestamp,
      acknowledged: false,
      details
    };

    this.activeAlerts.set(id, alert);

    if (severity === AlertSeverity.CRITICAL) {
      console.error(`🚨 [CRITICAL ALERT] [${category}] [${sourceModule}]: ${message}`, details);
    } else if (severity === AlertSeverity.WARNING) {
      console.warn(`⚠️ [WARNING ALERT] [${category}] [${sourceModule}]: ${message}`, details);
    } else {
      console.log(`ℹ️ [INFO ALERT] [${category}] [${sourceModule}]: ${message}`);
    }

    // Persist critical or warning alerts as governance actions
    if (severity !== AlertSeverity.INFO) {
      await this.audit.logCommandAction(
        'SYSTEM_ALERT_ENGINE',
        'SECURITY_EVENT_AUDIT',
        `Raised ${severity} alert in ${category}: "${message}"`,
        undefined,
        { alertId: id, severity, category, source: sourceModule }
      );
    }

    try {
      await addDoc(collection(db, 'system_alerts'), {
        ...alert,
        createdServerTimestamp: serverTimestamp()
      });
    } catch (err) {
      console.warn(`[ALERTING-ENGINE] Firestore write failed. Warning cached locally in alert register: ${id}`, err);
    }

    return alert;
  }

  /**
   * Acknowledges an active alert.
   */
  public async acknowledgeAlert(id: string, actorId: string = 'COMMANDER'): Promise<boolean> {
    const alert = this.activeAlerts.get(id);
    if (!alert) return false;

    alert.acknowledged = true;
    this.activeAlerts.set(id, alert);

    await this.audit.logCommandAction(
      actorId,
      'COMMAND_DECISION',
      `Acknowledged active alert: ${id} ("${alert.message}")`
    );

    try {
      // Typically alert acknowledges would edit or merge; here we record an update event
      await addDoc(collection(db, 'alert_actions'), {
        alertId: id,
        action: 'ACKNOWLEDGED',
        actorId,
        timestamp: new Date().toISOString(),
        createdServerTimestamp: serverTimestamp()
      });
    } catch {
      // Offline fallback
    }

    return true;
  }

  public getActiveAlerts(): SystemAlert[] {
    return Array.from(this.activeAlerts.values());
  }

  public clearAllLocalAlerts(): void {
    this.activeAlerts.clear();
  }
}
