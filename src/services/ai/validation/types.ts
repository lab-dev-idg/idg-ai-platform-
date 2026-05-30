/**
 * Iraq Digital Gateway (IDG)
 * Phase 13-H: AI Brain Validation & Simulation Framework - Type System
 */

export enum SimulationSubject {
  CUSTOMS = 'CUSTOMS',
  LOGISTICS = 'LOGISTICS',
  BANKING = 'BANKING',
  COMPLIANCE = 'COMPLIANCE',
  TELECOM = 'TELECOM',
  GOVERNMENT = 'GOVERNMENT',
  IDENTITY = 'IDENTITY',
  TRADE = 'TRADE'
}

export enum SimulationCategory {
  DETERMINISTIC = 'DETERMINISTIC',
  RANDOMIZED = 'RANDOMIZED',
  STRESS_TEST = 'STRESS_TEST',
  ADVERSARIAL = 'ADVERSARIAL'
}

export enum SecurityTestResult {
  PASS = 'PASS',
  WARNING = 'WARNING',
  FAIL = 'FAIL'
}

export enum CertificationLevel {
  NOT_READY = 'NOT_READY',
  LIMITED_PILOT_READY = 'LIMITED_PILOT_READY',
  PRODUCTION_READY = 'PRODUCTION_READY',
  NATIONAL_DEPLOYMENT_READY = 'NATIONAL_DEPLOYMENT_READY'
}

export interface SimulationScenario {
  id: string;
  subject: SimulationSubject;
  category: SimulationCategory;
  queryText: string;
  expectedIntent: string;
  expectedTool?: string;
  classificationClassificationRequired: number; // clearance limit
  isHostile: boolean;
  metadata?: Record<string, any>;
}

export interface AccuracyScores {
  retrievalAccuracy: number;       // 0 - 100
  citationAccuracy: number;        // 0 - 100
  reasoningAccuracy: number;       // 0 - 100
  intentClassificationAccuracy: number; // 0 - 100
  toolSelectionAccuracy: number;   // 0 - 100
  workflowCompletionAccuracy: number; // 0 - 100
}

export interface SecurityValidationScorecard {
  overallResult: SecurityTestResult;
  promptInjectionStatus: SecurityTestResult;
  contextPoisoningStatus: SecurityTestResult;
  clearanceEscalationStatus: SecurityTestResult;
  unauthorizedRetrievalStatus: SecurityTestResult;
  dataLeakageStatus: SecurityTestResult;
  citationManipulationStatus: SecurityTestResult;
  toolAbuseStatus: SecurityTestResult;
  multiTenantIsolationStatus: SecurityTestResult;
  totalVulnerabilitiesExecuted: number;
}

export interface GovernanceComplianceScore {
  classificationEnforcedScore: number;    // 0 - 100
  clearanceRestrictionScore: number;       // 0 - 100
  auditLoggingComplianceScore: number;     // 0 - 100
  sovereignPolicyComplianceScore: number;  // 0 - 100
  regulatoryCitationRequiredScore: number; // 0 - 100
  overallGovernanceOk: boolean;
  violationsFlagged: Array<{ policyId: string; description: string; severity: 'HIGH' | 'CRITICAL' }>;
}

export interface LatencyDistribution {
  p50: number; // ms
  p95: number; // ms
  p99: number; // ms
}

export interface PerformanceMetricsReport {
  retrievalLatency: LatencyDistribution;
  semanticSearchLatency: LatencyDistribution;
  vectorSearchLatency: LatencyDistribution;
  reasoningLatency: LatencyDistribution;
  toolExecutionLatency: LatencyDistribution;
  orchestrationLatency: LatencyDistribution;
}

export interface StressTestScoring {
  concurrentUsersSimulated: number;
  totalQueriesProcessed: number;
  cpuLoadSimulationPercent: number;
  memoryConsumptionSimulationMB: number;
  failureRatePercent: number;
  requestsPerSecond: number;
  status: 'STABLE' | 'DEGRADED' | 'FAILED_LIMIT';
}

export interface ReadinessCertificationReport {
  id: string;
  readinessScore: number; // 0 - 100
  securityScore: number; // Weight 30%
  accuracyScore: number; // Weight 25%
  performanceScore: number; // Weight 15%
  governanceScore: number; // Weight 15%
  reliabilityScore: number; // Weight 15%
  certificationLevel: CertificationLevel;
  approvedBy: string;
  timestamp: string;
}

export interface ValidationOverviewReport {
  readiness: ReadinessCertificationReport;
  scenariosRunCount: number;
  accuracy: AccuracyScores;
  security: SecurityValidationScorecard;
  governance: GovernanceComplianceScore;
  performance: PerformanceMetricsReport;
  stress: StressTestScoring;
  timestamp: string;
}

export interface ValidationAuditRecord {
  id: string;
  eventType: 'BENCHMARK_RUN' | 'SIMULATION_SESSION' | 'CERTIFICATION_REPORT' | 'SECURITY_TEST_RUN';
  description: string;
  details: Record<string, any>;
  timestamp: string;
}
