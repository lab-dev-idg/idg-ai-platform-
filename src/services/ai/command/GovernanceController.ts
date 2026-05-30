/**
 * Iraq Digital Gateway (IDG)
 * Phase 13-G: National AI Command Center - Governance Controller
 */

import { SovereignPolicy, AlertSeverity } from './types';
import { SecurityOperationsCenter } from './SecurityOperationsCenter';
import { CommandAuditTrail } from './CommandAuditTrail';

export class GovernanceController {
  private static instance: GovernanceController;
  private policies: Map<string, SovereignPolicy> = new Map();
  private audit = CommandAuditTrail.getInstance();
  private soc = SecurityOperationsCenter.getInstance();

  private constructor() {
    this.loadBaselinePolicies();
  }

  public static getInstance(): GovernanceController {
    if (!this.instance) {
      this.instance = new GovernanceController();
    }
    return this.instance;
  }

  private loadBaselinePolicies() {
    this.policies.set('POL-01', {
      id: 'POL-01',
      policyName: 'Central Bank Clearance Verification',
      description: 'Requires all trade transactions to verify against CBI regulatory codes.',
      enforceClassificationCap: 4, // Max clearance level gate (Sovereign Level)
      auditRequired: true,
      strictSovereigntyVerification: true,
      enabled: true
    });

    this.policies.set('POL-02', {
      id: 'POL-02',
      policyName: 'Borders Customs Classification Ceiling',
      description: 'Restricts restricted customs tariffs from normal clearance ranks.',
      enforceClassificationCap: 2, // Standard Customs Officer limit
      auditRequired: true,
      strictSovereigntyVerification: false,
      enabled: true
    });
  }

  /**
   * Enforces security policy limits on context processing flows.
   */
  public verifyAccessClearance(params: {
    userId: string;
    userType: string;
    clearanceLevel: number;
    resourceClassification: number;
    resourceId?: string;
  }): boolean {
    // 1. Structural level check first
    if (params.clearanceLevel < params.resourceClassification) {
      // Security Exception raised
      this.soc.logSecurityEvent({
        eventType: 'CLEARANCE_VIOLATION',
        userId: params.userId,
        userType: params.userType,
        clearanceLevel: params.clearanceLevel,
        targetResource: params.resourceId || 'RESTRICTED_DATA_CELL',
        description: `Insufficient role clearance. User level ${params.clearanceLevel} tried to view classification level ${params.resourceClassification}.`,
        severity: AlertSeverity.CRITICAL
      });
      return false; // Access Blocked
    }

    // 2. Active Policy evaluations
    const passed = true;
    this.policies.forEach((policy) => {
      if (policy.enabled && policy.strictSovereigntyVerification) {
        // Strict boundary gates
        if (params.clearanceLevel > policy.enforceClassificationCap) {
          // Exceeds policy bounds or triggers forced compliance check override
          if (policy.auditRequired) {
            this.audit.logCommandAction(
              'GOVERNANCE_SYSTEM',
              'GOVERNANCE_ENFORCEMENT',
              `User "${params.userId}" matched policy limits ${policy.id}. Access logged for tracing.`
            );
          }
        }
      }
    });

    return passed;
  }

  /**
   * Adjusts sovereign policy configurations and logs state overrides.
   */
  public async adjustPolicy(policyId: string, enabled: boolean, actorId: string = 'COMMANDER'): Promise<boolean> {
    const policy = this.policies.get(policyId);
    if (!policy) return false;

    const previousState = { ...policy };
    policy.enabled = enabled;
    this.policies.set(policyId, policy);

    await this.audit.logCommandAction(
      actorId,
      'OPERATIONAL_CHANGE',
      `Sovereign policy '${policy.policyName}' updated state. Active status: ${enabled}`,
      previousState,
      { ...policy }
    );

    return true;
  }

  public getPolicies(): SovereignPolicy[] {
    return Array.from(this.policies.values());
  }

  /**
   * Evaluates the policy enforcement score percentage (100% means all systems secured).
   */
  public getComplianceRate(): number {
    let total = 0;
    let enabledCount = 0;
    this.policies.forEach((p) => {
      total++;
      if (p.enabled) enabledCount++;
    });

    return total > 0 ? parseFloat(((enabledCount / total) * 100).toFixed(2)) : 100.00;
  }
}
