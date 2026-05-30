/**
 * Iraq Digital Gateway (IDG)
 * Phase 13-G: National AI Command Center - AI Health Monitor
 */

import { HealthReport, ServiceLatencyMetrics } from './types';
import { AlertingEngine } from './AlertingEngine';
import { AlertSeverity, AlertCategory } from './types';

export class AIHealthMonitor {
  private static instance: AIHealthMonitor;
  private currentUptime = 99.98; // Base target
  private latencyHistory: ServiceLatencyMetrics[] = [];
  private alertingEngine = AlertingEngine.getInstance();
  
  private serviceStats = {
    retrieval: 'ONLINE' as const,
    reasoning: 'ONLINE' as const,
    orchestration: 'ONLINE' as const,
    vectorStore: 'ONLINE' as const,
    toolQueue: 'ONLINE' as const
  };

  private constructor() {
    this.addBaselineLatency();
  }

  public static getInstance(): AIHealthMonitor {
    if (!this.instance) {
      this.instance = new AIHealthMonitor();
    }
    return this.instance;
  }

  private addBaselineLatency() {
    // Initial standard telemetry latency metrics
    this.latencyHistory.push({
      retrievalLatency: 120,
      reasoningLatency: 850,
      orchestrationLatency: 1200,
      vectorSearchLatency: 45,
      toolExecutionLatency: 350
    });
  }

  /**
   * Tracks real-time operation speed across service modules.
   */
  public recordLatency(metrics: Partial<ServiceLatencyMetrics>): void {
    const defaultVal: ServiceLatencyMetrics = {
      retrievalLatency: 125,
      reasoningLatency: 800,
      orchestrationLatency: 1100,
      vectorSearchLatency: 40,
      toolExecutionLatency: 300
    };

    const newMetrics = { ...defaultVal, ...metrics };
    this.latencyHistory.push(newMetrics);
    
    // Maintain rolling buffer of 100 historical readings
    if (this.latencyHistory.length > 100) {
      this.latencyHistory.shift();
    }

    // Verify if latencies are abnormally elevated
    this.evaluateDegradationThresholds(newMetrics);
  }

  /**
   * Adjusts service online states and triggers alerts if bottlenecks occur.
   */
  private evaluateDegradationThresholds(metrics: ServiceLatencyMetrics) {
    if (metrics.orchestrationLatency > 3000) {
      this.serviceStats.orchestration = 'DEGRADED';
      this.alertingEngine.raiseAlert(
        AlertSeverity.WARNING,
        AlertCategory.DEGRADATION,
        `AI Orchestration layer experiencing response degradation. Current: ${metrics.orchestrationLatency}ms`,
        'AIHealthMonitor'
      );
    } else {
      this.serviceStats.orchestration = 'ONLINE';
    }

    if (metrics.reasoningLatency > 2000) {
      this.serviceStats.reasoning = 'DEGRADED';
      this.alertingEngine.raiseAlert(
        AlertSeverity.WARNING,
        AlertCategory.DEGRADATION,
        `Reasoning pipeline execution speed degraded. Current: ${metrics.reasoningLatency}ms`,
        'AIHealthMonitor'
      );
    } else {
      this.serviceStats.reasoning = 'ONLINE';
    }
  }

  /**
   * Adjusts uptime simulation slightly and evaluates composite health score.
   */
  public simulateUptimePerturbation() {
    // Standard random range: 99.90 to 100.00
    const variance = (Math.random() * 0.1) - 0.05;
    this.currentUptime = Math.min(100.0, Math.max(99.0, this.currentUptime + variance));
  }

  /**
   * Generates a unified real-time health score.
   */
  public generateHealthReport(): HealthReport {
    this.simulateUptimePerturbation();

    // Compute rolling average latency across entire history
    let sumTotal = 0;
    this.latencyHistory.forEach((item) => {
      sumTotal += item.orchestrationLatency;
    });
    const avgLatency = this.latencyHistory.length > 0 ? (sumTotal / this.latencyHistory.length) : 1100;

    // Calculate score combining uptime percentage and response timelines
    // Base 0.50 + Uptime impact (30%) + Latency impact (20%)
    const latencyFactor = Math.max(0.00, 1.00 - (avgLatency / 3000)); // normalized up to 3 seconds limit
    const uptimeFactor = (this.currentUptime - 99.0) / 1.0; // scale 99%-100% to 0-1
    const rawScore = 0.50 + (uptimeFactor * 0.30) + (latencyFactor * 0.20);
    const score = parseFloat(Math.min(1.00, Math.max(0.00, rawScore)).toFixed(4));

    let status: HealthReport['status'] = 'OPTIMAL';
    if (score < 0.60) {
      status = 'CRITICAL';
    } else if (score < 0.85) {
      status = 'DEGRADED';
    }

    return {
      overallHealthScore: score,
      serviceUptime: parseFloat(this.currentUptime.toFixed(4)),
      averageLatency: parseFloat(avgLatency.toFixed(2)),
      status,
      serviceStatuses: { ...this.serviceStats },
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Sets manual service state over-rides during security incidents or maintenance.
   */
  public setServiceStatus(
    service: keyof HealthReport['serviceStatuses'],
    newStatus: 'ONLINE' | 'DEGRADED' | 'OFFLINE'
  ) {
    this.serviceStats[service] = newStatus;
    
    this.alertingEngine.raiseAlert(
      newStatus === 'OFFLINE' ? AlertSeverity.CRITICAL : AlertSeverity.INFO,
      AlertCategory.OPERATIONAL,
      `Service channel override: '${service}' shifted state to ${newStatus}.`,
      'AIHealthMonitor'
    );
  }
}
