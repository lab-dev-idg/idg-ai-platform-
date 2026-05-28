import { AIContextSnapshot } from '../context/ContextFusion';
import { INTENT_REGISTRY } from '../registry/IntentRegistry';
import { USER_TYPE_REGISTRY } from '../registry/UserRegistry';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type FallbackStrategy =
  | 'LOCAL_KNOWLEDGE'
  | 'HUMAN_SUPPORT'
  | 'BLOCKED'
  | 'SAFE_MODE'
  | 'DOWNGRADE';

export interface DecisionOutput {
  route: string;
  requiresRAG: boolean;
  requiresTool: boolean;
  riskLevel: RiskLevel;
  confidence: number;
  fallbackStrategy: FallbackStrategy;
}

export interface SecurityStatus {
  isGranted: boolean;
  riskScore: number; // 0 to 100
  reason?: string;
  policyAction: 'ALLOW' | 'DOWNGRADE' | 'BLOCK' | 'ESCALATE';
}

export class PolicyGate {
  /**
   * Evaluates the safety parameters of an AI transaction snapshot.
   * Compares caller clearances against intent sensitivity ratings.
   */
  public static validate(snapshot: AIContextSnapshot): SecurityStatus {
    const userRole = snapshot.userType;
    const userDef = USER_TYPE_REGISTRY[userRole];
    const userClearance = userDef ? userDef.clearanceLevel : 0;
    
    const intentCategory = snapshot.intent;
    const intentDef = INTENT_REGISTRY[intentCategory];
    
    // 1. Determine Access Control compliance (role validation)
    if (intentDef && !intentDef.allowedUserTypes.includes(userRole)) {
      return {
        isGranted: false,
        riskScore: 85,
        reason: `User type '${userRole}' lacks clearance to trigger '${intentCategory}' intent. Minimum requirements not met.`,
        policyAction: 'BLOCK'
      };
    }

    // 2. Evaluate intent-specific clearance boundaries
    // Critical Sovereign commands (GOVERNMENT) strictly require Level 3+ Security clearance
    if (intentCategory === 'GOVERNMENT' && userClearance < 3) {
      return {
        isGranted: false,
        riskScore: 95,
        reason: 'Sovereign administrative controls strictly require Level-3 ministerial clearances.',
        policyAction: 'BLOCK'
      };
    }

    // High sensitivity trade audits (BANKING) strictly require Level 3+ clearance
    if (intentCategory === 'BANKING' && userClearance < 3) {
      return {
        isGranted: false,
        riskScore: 90,
        reason: 'Financial ledger assertions require verified Level-3 bank representative permissions.',
        policyAction: 'DOWNGRADE'
      };
    }

    // Strict compliance screening (COMPLIANCE) requires registered broker authorization (Level 1+)
    if (intentCategory === 'COMPLIANCE' && userClearance < 1) {
      return {
        isGranted: false,
        riskScore: 70,
        reason: 'AML regulatory screening queries require standard broker authorization profiles.',
        policyAction: 'DOWNGRADE'
      };
    }

    // Critical incidents or telemetry modifications (INCIDENT, TELECOM) require operator clearances (Level 2+)
    if ((intentCategory === 'INCIDENT' || intentCategory === 'TELECOM') && userClearance < 2) {
      return {
        isGranted: false,
        riskScore: 75,
        reason: 'Network topology analytics and outage logs require Level-2 technical clearances.',
        policyAction: 'ESCALATE'
      };
    }

    // 3. Evaluate operational health indicators
    // If telecom networks or API gateways are warning/critical, risk escalates
    const isDegraded = snapshot.operationalState.gatewayHealth !== 'OPTIMAL' || 
                       snapshot.operationalState.realtimeConnectivity !== 'CONNECTED';
    if (isDegraded && (intentCategory === 'SHIPMENT' || intentCategory === 'CUSTOMS')) {
      return {
        isGranted: true,
        riskScore: 45,
        reason: 'Real-time telemetry channels degraded. Proceeding with high-latency offline buffers.',
        policyAction: 'DOWNGRADE'
      };
    }

    // Default safe state: All verification passes validated
    return {
      isGranted: true,
      riskScore: 10,
      policyAction: 'ALLOW'
    };
  }
}

export class DecisionEngine {
  /**
   * Resolves the primary routing route, tool triggers, and RAG dependencies of a given snapshot.
   */
  public static resolve(snapshot: AIContextSnapshot): DecisionOutput {
    const policyResult = PolicyGate.validate(snapshot);
    const intentCategory = snapshot.intent;
    const intentDef = INTENT_REGISTRY[intentCategory];

    // 1. Resolve risk index based on security rating
    let riskLevel: RiskLevel = 'LOW';
    if (policyResult.riskScore >= 90) riskLevel = 'CRITICAL';
    else if (policyResult.riskScore >= 70) riskLevel = 'HIGH';
    else if (policyResult.riskScore >= 40) riskLevel = 'MEDIUM';

    // 2. Determine target framework route
    let route = '/';
    if (intentCategory === 'CUSTOMS') {
      route = '/customs';
    } else if (intentCategory === 'GOVERNMENT' || intentCategory === 'TELECOM') {
      route = '/admin';
    }

    // 3. Resolve Tool & RAG activation rules
    // Customs laws, regulations, or banking policies require full RAG semantic search triggers
    const requiresRAG = ['CUSTOMS', 'COMPLIANCE', 'BANKING', 'GOVERNMENT', 'INVESTOR', 'TELECOM'].includes(intentCategory);
    
    // Tools can be automatically activated on execution-prone intents
    const requiresTool = ['CUSTOMS', 'SHIPMENT', 'DEVELOPER', 'SUPPORT', 'INCIDENT', 'TELECOM'].includes(intentCategory);

    // 4. Resolve fallback strategies matching policy interventions
    let fallbackStrategy: FallbackStrategy = 'LOCAL_KNOWLEDGE';
    
    if (policyResult.policyAction === 'BLOCK') {
      fallbackStrategy = 'BLOCKED';
    } else if (policyResult.policyAction === 'DOWNGRADE') {
      fallbackStrategy = 'SAFE_MODE';
    } else if (policyResult.policyAction === 'ESCALATE') {
      fallbackStrategy = 'HUMAN_SUPPORT';
    } else if (snapshot.operationalState.realtimeConnectivity === 'DISCONNECTED') {
      fallbackStrategy = 'LOCAL_KNOWLEDGE';
    }

    // 5. Calculate operation confidence
    const baseConfidence = intentDef ? intentDef.confidenceThreshold : 0.85;
    // Degrade confidence slightly if risk is elevated or network is degraded
    const adjustedConfidence = Math.max(0.1, baseConfidence - (policyResult.riskScore / 200));

    return {
      route,
      requiresRAG,
      requiresTool,
      riskLevel,
      confidence: parseFloat(adjustedConfidence.toFixed(2)),
      fallbackStrategy
    };
  }
}
