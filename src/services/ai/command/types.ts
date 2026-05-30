/**
 * Iraq Digital Gateway (IDG)
 * Phase 13-G: National AI Command Center - Type System
 */

export enum AlertSeverity {
  INFO = 'INFO',
  WARNING = 'WARNING',
  CRITICAL = 'CRITICAL'
}

export enum AlertCategory {
  OPERATIONAL = 'OPERATIONAL',
  SECURITY = 'SECURITY',
  DEGRADATION = 'DEGRADATION',
  GOVERNANCE = 'GOVERNANCE'
}

export interface SystemAlert {
  id: string;
  severity: AlertSeverity;
  category: AlertCategory;
  message: string;
  sourceModule: string;
  timestamp: string;
  acknowledged: boolean;
  details?: Record<string, any>;
}

export interface MetricPoint {
  timestamp: string;
  value: number;
}

export interface ServiceLatencyMetrics {
  retrievalLatency: number;  // ms
  reasoningLatency: number;  // ms
  orchestrationLatency: number; // ms
  vectorSearchLatency: number; // ms
  toolExecutionLatency: number; // ms
}

export interface HealthReport {
  overallHealthScore: number; // 0.00 to 1.00
  serviceUptime: number; // percentage (e.g. 99.95)
  averageLatency: number; // ms
  status: 'OPTIMAL' | 'DEGRADED' | 'CRITICAL';
  serviceStatuses: {
    retrieval: 'ONLINE' | 'DEGRADED' | 'OFFLINE';
    reasoning: 'ONLINE' | 'DEGRADED' | 'OFFLINE';
    orchestration: 'ONLINE' | 'DEGRADED' | 'OFFLINE';
    vectorStore: 'ONLINE' | 'DEGRADED' | 'OFFLINE';
    toolQueue: 'ONLINE' | 'DEGRADED' | 'OFFLINE';
  };
  timestamp: string;
}

export interface OperationTelemetry {
  queryVolume: number;
  successfulRetrievalRate: number; // percentage
  citationUsageCount: number;
  confidenceDistribution: {
    veryHigh: number;
    high: number;
    moderate: number;
    low: number;
    unreliable: number;
  };
  workflowCompletionRate: number; // percentage
}

export interface SecurityEvent {
  id: string;
  eventType: 'DENIED_ACCESS' | 'CLEARANCE_VIOLATION' | 'SUSPICIOUS_RETRIEVAL' | 'ABNORMAL_TOOL_EXECUTION';
  userId: string;
  userType: string;
  clearanceLevel: number;
  targetResource: string;
  description: string;
  severity: AlertSeverity;
  timestamp: string;
}

export interface SovereignPolicy {
  id: string;
  policyName: string;
  description: string;
  enforceClassificationCap: number; // max clearance allowed
  auditRequired: boolean;
  strictSovereigntyVerification: boolean;
  enabled: boolean;
}

export interface CommandAuditRecord {
  id: string;
  actorId: string;
  actionType: 'GOVERNANCE_ENFORCEMENT' | 'SECURITY_EVENT_AUDIT' | 'COMMAND_DECISION' | 'OPERATIONAL_CHANGE';
  description: string;
  previousState?: Record<string, any>;
  newState?: Record<string, any>;
  timestamp: string;
}

export interface UnifiedCommandDashboard {
  health: HealthReport;
  analytics: OperationTelemetry;
  security: {
    activeAlerts: SystemAlert[];
    securityEventsCount: number;
    status: 'SECURE' | 'THREAT_DETECTED' | 'LOCKDOWN';
  };
  governance: {
    activePolicies: SovereignPolicy[];
    complianceRate: number; // percentage
  };
  learning: {
    activeMemoriesCount: number;
    averageConfidenceScore: number;
    successRate: number;
  };
  timestamp: string;
}
