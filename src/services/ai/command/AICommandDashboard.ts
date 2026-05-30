/**
 * Iraq Digital Gateway (IDG)
 * Phase 13-G: National AI Command Center - AI Command Dashboard
 */

import { UnifiedCommandDashboard } from './types';
import { AIHealthMonitor } from './AIHealthMonitor';
import { PerformanceAnalytics } from './PerformanceAnalytics';
import { AlertingEngine } from './AlertingEngine';
import { SecurityOperationsCenter } from './SecurityOperationsCenter';
import { GovernanceController } from './GovernanceController';
import { LearningMemory } from '../learning/LearningMemory';

export class AICommandDashboard {
  private static instance: AICommandDashboard;

  private constructor() {}

  public static getInstance(): AICommandDashboard {
    if (!this.instance) {
      this.instance = new AICommandDashboard();
    }
    return this.instance;
  }

  /**
   * Compiles the single unified operational command dashboard data state.
   */
  public generateDashboardReport(): UnifiedCommandDashboard {
    const healthMonitor = AIHealthMonitor.getInstance();
    const analyticsMonitor = PerformanceAnalytics.getInstance();
    const alertEngine = AlertingEngine.getInstance();
    const soc = SecurityOperationsCenter.getInstance();
    const governance = GovernanceController.getInstance();
    const memory = LearningMemory.getInstance();

    const health = healthMonitor.generateHealthReport();
    const analytics = analyticsMonitor.generateTelemetry();
    const activeAlerts = alertEngine.getActiveAlerts().filter(a => !a.acknowledged);
    const securityEventsCount = soc.getEventsCount();

    // Determine security status state
    let securityStatus: UnifiedCommandDashboard['security']['status'] = 'SECURE';
    const criticalThreatExists = activeAlerts.some(
      a => a.category === 'SECURITY' && a.severity === 'CRITICAL'
    );
    if (criticalThreatExists) {
      securityStatus = 'LOCKDOWN';
    } else if (securityEventsCount > 0) {
      securityStatus = 'THREAT_DETECTED';
    }

    // Capture memory counts and success scoring metrics maps
    const memories = memory.getMemories();
    let scoreSum = 0;
    memories.forEach(m => scoreSum += m.confidenceScore);
    const avgConfidenceSum = memories.length > 0 ? (scoreSum / memories.length) : 0.85;

    let successfulCompleted = 0;
    memories.forEach(m => {
      if (m.workflowOutcome === 'COMPLETED' || m.thumbsUpCount > m.thumbsDownCount) {
        successfulCompleted += 1;
      }
    });
    const learnSuccessRate = memories.length > 0 ? (successfulCompleted / memories.length) : 0.90;

    return {
      health,
      analytics,
      security: {
        activeAlerts,
        securityEventsCount,
        status: securityStatus
      },
      governance: {
        activePolicies: governance.getPolicies(),
        complianceRate: governance.getComplianceRate()
      },
      learning: {
        activeMemoriesCount: memories.length,
        averageConfidenceScore: parseFloat(avgConfidenceSum.toFixed(4)),
        successRate: parseFloat(learnSuccessRate.toFixed(4))
      },
      timestamp: new Date().toISOString()
    };
  }
}
