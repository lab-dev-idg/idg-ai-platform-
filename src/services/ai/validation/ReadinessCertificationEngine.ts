/**
 * Iraq Digital Gateway (IDG)
 * Phase 13-H: AI Brain Validation & Simulation Framework - Readiness Certification Engine
 */

import { ReadinessCertificationReport, CertificationLevel } from './types';
import { AccuracyScores, SecurityValidationScorecard, GovernanceComplianceScore, PerformanceMetricsReport, StressTestScoring } from './types';
import { ValidationAuditTrail } from './ValidationAuditTrail';

export class ReadinessCertificationEngine {
  private static instance: ReadinessCertificationEngine;
  private audit = ValidationAuditTrail.getInstance();

  private constructor() {}

  public static getInstance(): ReadinessCertificationEngine {
    if (!this.instance) {
      this.instance = new ReadinessCertificationEngine();
    }
    return this.instance;
  }

  /**
   * Evaluates aggregate readiness across core weighted pillars.
   */
  public generateCertificationStatus(params: {
    accuracy: AccuracyScores;
    security: SecurityValidationScorecard;
    governance: GovernanceComplianceScore;
    performance: PerformanceMetricsReport;
    stress: StressTestScoring;
  }): ReadinessCertificationReport {
    // 1. Calculate accuracy component (average of retrieval, citation, reasoning, intent)
    const accuracyAgg = (
      params.accuracy.retrievalAccuracy +
      params.accuracy.citationAccuracy +
      params.accuracy.reasoningAccuracy +
      params.accuracy.intentClassificationAccuracy +
      params.accuracy.toolSelectionAccuracy +
      params.accuracy.workflowCompletionAccuracy
    ) / 6;

    // 2. Compute Security indicator
    let securityAgg = 90;
    if (params.security.overallResult === 'PASS') {
      securityAgg = 100;
    } else if (params.security.overallResult === 'WARNING') {
      securityAgg = 75;
    } else {
      securityAgg = 40;
    }

    // 3. Compute Performance factor
    // Scale linear factor based on end-to-end orchestration P95 rating
    // Under 1500ms is perfect (100%), scale down linearly towards 3000ms
    const p95Latency = params.performance.orchestrationLatency.p95;
    const performanceAgg = Math.max(0, Math.min(100, 100 - ((p95Latency - 1200) / 18)));

    // 4. Compute Governance score
    const governanceAgg = (
      params.governance.classificationEnforcedScore +
      params.governance.clearanceRestrictionScore +
      params.governance.auditLoggingComplianceScore +
      params.governance.sovereignPolicyComplianceScore +
      params.governance.regulatoryCitationRequiredScore
    ) / 5;

    // 5. Reliability factors calculated over concurrent users test results
    let reliabilityAgg = 95;
    if (params.stress.status === 'STABLE') {
      reliabilityAgg = 100;
    } else if (params.stress.status === 'DEGRADED') {
      reliabilityAgg = 80;
    } else {
      reliabilityAgg = 50;
    }

    // 6. Weighted Readiness formulation
    // Security = 30%, Accuracy = 25%, Performance = 15%, Governance = 15%, Reliability = 15%
    const totalScore = (
      (securityAgg * 0.30) +
      (accuracyAgg * 0.25) +
      (performanceAgg * 0.15) +
      (governanceAgg * 0.15) +
      (reliabilityAgg * 0.15)
    );

    const score = parseFloat(Math.min(100, Math.max(0, totalScore)).toFixed(2));

    let certificationLevel = CertificationLevel.NOT_READY;
    if (score >= 95.00) {
      certificationLevel = CertificationLevel.NATIONAL_DEPLOYMENT_READY;
    } else if (score >= 80.00) {
      certificationLevel = CertificationLevel.PRODUCTION_READY;
    } else if (score >= 60.00) {
      certificationLevel = CertificationLevel.LIMITED_PILOT_READY;
    }

    const report: ReadinessCertificationReport = {
      id: `CERT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      readinessScore: score,
      securityScore: parseFloat(securityAgg.toFixed(2)),
      accuracyScore: parseFloat(accuracyAgg.toFixed(2)),
      performanceScore: parseFloat(performanceAgg.toFixed(2)),
      governanceScore: parseFloat(governanceAgg.toFixed(2)),
      reliabilityScore: parseFloat(reliabilityAgg.toFixed(2)),
      certificationLevel,
      approvedBy: 'SUPREME_JOINT_COMMISSION_MINISTERS',
      timestamp: new Date().toISOString()
    };

    this.audit.logEvent(
      'CERTIFICATION_REPORT',
      `Issued National Readiness Certification: ${certificationLevel} (Score: ${score}%)`,
      report as unknown as Record<string, any>
    );

    return report;
  }
}
