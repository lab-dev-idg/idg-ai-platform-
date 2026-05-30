/**
 * Iraq Digital Gateway (IDG)
 * Phase 13-G: National AI Command Center - Security Operations Center (SOC)
 */

import { SecurityEvent, AlertSeverity, AlertCategory } from './types';
import { AlertingEngine } from './AlertingEngine';
import { CommandAuditTrail } from './CommandAuditTrail';

export class SecurityOperationsCenter {
  private static instance: SecurityOperationsCenter;
  private localEvents: SecurityEvent[] = [];
  private alertingEngine = AlertingEngine.getInstance();
  private audit = CommandAuditTrail.getInstance();

  private constructor() {}

  public static getInstance(): SecurityOperationsCenter {
    if (!this.instance) {
      this.instance = new SecurityOperationsCenter();
    }
    return this.instance;
  }

  /**
   * Evaluates incoming transactions for security exceptions.
   */
  public async logSecurityEvent(event: Omit<SecurityEvent, 'id' | 'timestamp'>): Promise<string> {
    const id = `SOC-EV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const timestamp = new Date().toISOString();

    const fullEvent: SecurityEvent = {
      id,
      timestamp,
      ...event
    };

    this.localEvents.push(fullEvent);
    if (this.localEvents.length > 200) {
      this.localEvents.shift();
    }

    console.warn(`[SOC-ALERT] [${event.eventType}] [User: ${event.userId}]: ${event.description}`);

    // Standard policy mapping to raise corresponding alerts
    let severity = AlertSeverity.WARNING;
    if (event.eventType === 'CLEARANCE_VIOLATION' || event.eventType === 'ABNORMAL_TOOL_EXECUTION') {
      severity = AlertSeverity.CRITICAL;
    }

    // Trigger global operational alerts
    await this.alertingEngine.raiseAlert(
      severity,
      AlertCategory.SECURITY,
      `SOC Alert: [${event.eventType}] on target "${event.targetResource}" by context user type "${event.userType}": ${event.description}`,
      'SecurityOperationsCenter',
      { secEventId: id, userType: event.userType, clearanceLevel: event.clearanceLevel }
    );

    // Write audit trail block
    await this.audit.logCommandAction(
      'SOC_MONITOR',
      'SECURITY_EVENT_AUDIT',
      `Registered security alert node: ${event.eventType}. Clear details: ${event.description}`,
      undefined,
      { eventId: id, details: event }
    );

    return id;
  }

  /**
   * Scans a prompt string or query context for suspicious SQL, cross-border traversal, or injection attempts.
   */
  public verifyRetrievalVulnerabilities(userId: string, query: string): boolean {
    const queryLower = query.toLowerCase().trim();

    // System hacking attempts standard detection rules
    const hasInjectionKeywords = queryLower.includes('drop table') || 
                                 queryLower.includes('select * from user') || 
                                 queryLower.includes('--') || 
                                 queryLower.includes('union select');

    if (hasInjectionKeywords) {
      this.logSecurityEvent({
        eventType: 'SUSPICIOUS_RETRIEVAL',
        userId,
        userType: 'LOGISTICS_OPERATOR',
        clearanceLevel: 1,
        targetResource: 'DATABASE_SCHEMAS',
        description: `User query contains potential structured injection markers. Input: "${query.substring(0, 80)}"`,
        severity: AlertSeverity.CRITICAL
      });
      return false; // Failed validation check
    }

    return true; // Safe
  }

  public getEventsCount(): number {
    return this.localEvents.length;
  }

  public getEvents(): SecurityEvent[] {
    return [...this.localEvents];
  }
}
