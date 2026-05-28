/**
 * Iraq Digital Gateway (IDG)
 * Policy-Aware Data Exchange Layer - Phase 12-H
 *
 * Intercepts all inbound and outbound international exchange payloads. Enforces robust
 * classification-based sanitization and export authorization checks before transmission,
 * ensuring strict legal compliance at external boundaries.
 */

import { SovereignDataGovernor } from '../sovereign/SovereignDataGovernor';

export type GlobalClassification = 
  | 'PUBLIC_EXPORT_ALLOWED' 
  | 'AGGREGATED_ONLY' 
  | 'NO_EXPORT_INTERNAL' 
  | 'STRICT_SOVEREIGN_LOCK';

export interface ExchangePacket {
  packetId: string;
  sourceSystem: string;
  targetSystem: string;
  intent: string;
  payload: Record<string, unknown>;
  classification: GlobalClassification;
  consentId?: string;
}

export interface ExchangeAuditLog {
  auditId: string;
  timestamp: string;
  packetId: string;
  sourceSystem: string;
  targetSystem: string;
  classification: GlobalClassification;
  passed: boolean;
  actionTaken: 'TRANSMITTED' | 'SANITIZED_AND_SHARED' | 'BLOCKED_VIOLATION';
  details: string;
}

export class PolicyDataExchange {
  private static instance: PolicyDataExchange;

  private auditLogs: ExchangeAuditLog[] = [];

  private constructor() {}

  public static getInstance(): PolicyDataExchange {
    if (!this.instance) {
      this.instance = new PolicyDataExchange();
    }
    return this.instance;
  }

  /**
   * Filters, sanitizes, and validates cross-border communication payloads based on classification scope.
   */
  public evaluateAndProcessOutbound(packet: ExchangePacket): {
    passed: boolean;
    sanitizedPayload?: Record<string, unknown>;
    actionTaken: 'TRANSMITTED' | 'SANITIZED_AND_SHARED' | 'BLOCKED_VIOLATION';
    reason?: string;
    auditId: string;
  } {
    const auditId = `AUD-EXP-${Math.floor(100000 + Math.random() * 900000)}`;
    const timestamp = new Date().toISOString();

    // 1. Check strict sovereign lock
    if (packet.classification === 'STRICT_SOVEREIGN_LOCK') {
      const logEntry: ExchangeAuditLog = {
        auditId,
        timestamp,
        packetId: packet.packetId,
        sourceSystem: packet.sourceSystem,
        targetSystem: packet.targetSystem,
        classification: packet.classification,
        passed: false,
        actionTaken: 'BLOCKED_VIOLATION',
        details: 'Breach Attempt Blocked: STRICT_SOVEREIGN_LOCK data cannot be exported outside central government nodes under any circumstance.'
      };
      this.auditLogs.push(logEntry);
      return { passed: false, actionTaken: 'BLOCKED_VIOLATION', reason: logEntry.details, auditId };
    }

    // 2. Check internal only (maps to INTERNAL/RESTRICTED in Sovereign Governor)
    if (packet.classification === 'NO_EXPORT_INTERNAL') {
      const logEntry: ExchangeAuditLog = {
        auditId,
        timestamp,
        packetId: packet.packetId,
        sourceSystem: packet.sourceSystem,
        targetSystem: packet.targetSystem,
        classification: packet.classification,
        passed: false,
        actionTaken: 'BLOCKED_VIOLATION',
        details: 'Outbound Blocked: NO_EXPORT_INTERNAL is strictly for national domain nodes.'
      };
      this.auditLogs.push(logEntry);
      return { passed: false, actionTaken: 'BLOCKED_VIOLATION', reason: logEntry.details, auditId };
    }

    // 3. Process AGGREGATED_ONLY data (requires sanitization)
    if (packet.classification === 'AGGREGATED_ONLY') {
      // Validate that we have consent/authorizations
      const governor = SovereignDataGovernor.getInstance();
      const consentCheck = governor.assertOutboundTransmissionAllowed('INTERNAL', packet.consentId);

      if (!consentCheck.allowed) {
        const logEntry: ExchangeAuditLog = {
          auditId,
          timestamp,
          packetId: packet.packetId,
          sourceSystem: packet.sourceSystem,
          targetSystem: packet.targetSystem,
          classification: packet.classification,
          passed: false,
          actionTaken: 'BLOCKED_VIOLATION',
          details: `Outbound Blocked: Aggregate-level export failed security clearing. Detail: ${consentCheck.error}`
        };
        this.auditLogs.push(logEntry);
        return { passed: false, actionTaken: 'BLOCKED_VIOLATION', reason: logEntry.details, auditId };
      }

      // Sanitize: Strip any specific shipper, consignee, or identification codes
      const rawPayload = packet.payload;
      const sanitizedPayload: Record<string, unknown> = {
        aggregatedStatus: true,
        summaryClassification: 'AGGREGATED_TRADE_TELEMETRY',
        timestamp: new Date().toISOString(),
        totalMetricTons: rawPayload.totalWeightMs || rawPayload.weight || 0,
        harmonizedChaptersCount: Array.isArray(rawPayload.hsCodes) ? rawPayload.hsCodes.length : 1,
        sourceRegion: 'IRAQ_REGION_SOUTH',
        // Purging sensitive credentials, tracking values, and pricing metrics
        pricingStampsPurged: true,
        consigneesStripped: true
      };

      const logEntry: ExchangeAuditLog = {
        auditId,
        timestamp,
        packetId: packet.packetId,
        sourceSystem: packet.sourceSystem,
        targetSystem: packet.targetSystem,
        classification: packet.classification,
        passed: true,
        actionTaken: 'SANITIZED_AND_SHARED',
        details: 'Outbound Allowed with Aggregation: Sanitized raw transactional details, exported high-level stats.'
      };
      this.auditLogs.push(logEntry);
      return { passed: true, sanitizedPayload, actionTaken: 'SANITIZED_AND_SHARED', auditId };
    }

    // 4. PUBLIC_EXPORT_ALLOWED data (simple check)
    const logEntry: ExchangeAuditLog = {
      auditId,
      timestamp,
      packetId: packet.packetId,
      sourceSystem: packet.sourceSystem,
      targetSystem: packet.targetSystem,
      classification: packet.classification,
      passed: true,
      actionTaken: 'TRANSMITTED',
      details: 'Outbound Allowed: Public record datasets transmitted with standard network integrity.'
    };
    this.auditLogs.push(logEntry);
    return { passed: true, sanitizedPayload: packet.payload, actionTaken: 'TRANSMITTED', auditId };
  }

  public getHistory(): ExchangeAuditLog[] {
    return [...this.auditLogs];
  }
}
