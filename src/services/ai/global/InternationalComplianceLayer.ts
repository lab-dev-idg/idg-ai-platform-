/**
 * Iraq Digital Gateway (IDG)
 * International Compliance Layer - Phase 12-H
 *
 * Implements trade filter validations, security sanction screening, AML checks,
 * and dual-use high-technology detection. Any flags immediately trigger
 * an ESCALATION WARNING STATE requiring executive sign-off.
 */

export interface SanctionEntity {
  name: string;
  type: 'INDIVIDUAL' | 'CORPORATION' | 'PORT';
  originCountry: string;
  sanctionSource: string; // e.g. "UN Security Council", "OFAC", "EU Central Registry"
}

export interface ComplianceViolationRecord {
  violationId: string;
  timestamp: string;
  type: 'SANCT_BLOCK' | 'AML_THRESHOLD' | 'DUAL_USE_DUPLICATE_ALERT' | 'CARGO_RESTRICTION';
  entityChecked: string;
  violatingDetail: string;
  severity: 'HIGH' | 'CRITICAL';
  remedyAction: string;
}

export interface CompliancePacket {
  shipperName: string;
  consigneeName: string;
  cargoDescription: string;
  hsCode: string;
  transactionValueUSD: number;
}

export class InternationalComplianceLayer {
  private static instance: InternationalComplianceLayer;

  // Active sovereign escalation warnings indicator
  private escalationWarningState = false;
  private activeViolations: ComplianceViolationRecord[] = [];

  // Embargo/Restriction dictionaries
  private restrictedShippers: Set<string> = new Set([
    'Al-Nisr Maritime Co.',
    'Black-Star Logistics Ltd.',
    'Sovereign-Free Ports Corp.'
  ]);

  private dualUseKeywords: Set<string> = new Set([
    'centrifuge',
    'grade-5 graphite',
    'nuclear isotope',
    'military optics',
    'chemical precursor',
    'drone telemetry module'
  ]);

  private constructor() {
    this.bootstrapTriggerBaseline();
  }

  public static getInstance(): InternationalComplianceLayer {
    if (!this.instance) {
      this.instance = new InternationalComplianceLayer();
    }
    return this.instance;
  }

  private bootstrapTriggerBaseline(): void {
    // Inject a historical violation for diagnostic view state
    this.activeViolations.push({
      violationId: 'VIO-IDG-309',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      type: 'DUAL_USE_DUPLICATE_ALERT',
      entityChecked: 'Premium Carbon Gaskets',
      violatingDetail: 'Detected high-tensile material containing chemical precursor traces above 3% content limits.',
      severity: 'HIGH',
      remedyAction: 'RE-ALLOCATE_SENSITIVE_ITEMS_FOR_MINISTRY_INSPECTION_MFA'
    });
    this.escalationWarningState = true; // Start in warning state during startup due to unresolved alerts
  }

  /**
   * Evaluates compliance packets for international sanctions, money laundering risk, or dual-use items.
   */
  public performTradeScreening(packet: CompliancePacket): {
    clearedStatus: boolean;
    discoveredViolations: ComplianceViolationRecord[];
    escalatedTriggered: boolean;
  } {
    const freshViolations: ComplianceViolationRecord[] = [];
    const timestamp = new Date().toISOString();

    // 1. Check sanction lists against shippers/consignees
    if (this.restrictedShippers.has(packet.shipperName) || this.restrictedShippers.has(packet.consigneeName)) {
      const vEntity = this.restrictedShippers.has(packet.shipperName) ? packet.shipperName : packet.consigneeName;
      freshViolations.push({
        violationId: `VIO-SNC-${Math.floor(100000 + Math.random() * 900000)}`,
        timestamp,
        type: 'SANCT_BLOCK',
        entityChecked: vEntity,
        violatingDetail: `Entity matching international embargo blocklists of the UN and OFAC. Destination route suspended.`,
        severity: 'CRITICAL',
        remedyAction: 'FREEZE_SHIPMENT_INTER-AGENCY'
      });
    }

    // 2. Check dual-use descriptions
    const descLower = packet.cargoDescription.toLowerCase();
    const matchesDualUse = Array.from(this.dualUseKeywords).some(keyword => descLower.includes(keyword));
    if (matchesDualUse) {
       freshViolations.push({
         violationId: `VIO-USE-${Math.floor(100000 + Math.random() * 900000)}`,
         timestamp,
         type: 'DUAL_USE_DUPLICATE_ALERT',
         entityChecked: packet.cargoDescription,
         violatingDetail: `Cargo matches restricted dual-use components indices. Chemical forerunner or tactical mechanics checked.`,
         severity: 'CRITICAL',
         remedyAction: 'RE-ALLOCATE_SENSITIVE_ITEMS_FOR_MINISTRY_INSPECTION_MFA'
       });
    }

    // 3. Check AML thresholding
    if (packet.transactionValueUSD > 500000) {
      freshViolations.push({
        violationId: `VIO-AML-${Math.floor(100000 + Math.random() * 900000)}`,
        timestamp,
        type: 'AML_THRESHOLD',
        entityChecked: `Transaction value: $${packet.transactionValueUSD.toLocaleString()}`,
        violatingDetail: `Transaction exceeding extreme AML reporting boundaries ($500,000 threshold). Audited proof of funds cleared required.`,
        severity: 'HIGH',
        remedyAction: 'HOLD_CUSTOMS_TRANSACTION_PAYMENT_DOCS'
      });
    }

    if (freshViolations.length > 0) {
      this.escalationWarningState = true;
      freshViolations.forEach(v => this.activeViolations.push(v));
    }

    return {
      clearedStatus: freshViolations.length === 0,
      discoveredViolations: freshViolations,
      escalatedTriggered: this.escalationWarningState
    };
  }

  /**
   * Resets the active escalation warnings on the gateway. Requires operator clearance.
   */
  public overrideClearComplianceWarning(operator: string): { success: boolean; error?: string } {
    if (!operator || operator.length < 5) {
      return { success: false, error: 'Authorization Denied: Valid executive signature required.' };
    }

    this.escalationWarningState = false;
    this.activeViolations = [];
    console.log(`[COMPLIANCE-LAYER] Compliance warning state overridden by Operator: ${operator}`);
    return { success: true };
  }

  public getEscalationStatus(): boolean {
    return this.escalationWarningState;
  }

  public getViolations(): ComplianceViolationRecord[] {
    return [...this.activeViolations];
  }

  public registerCustomRestrictedShipper(name: string): void {
    this.restrictedShippers.add(name);
  }
}
