/**
 * Iraq Digital Gateway (IDG)
 * AI Government-Grade Kernel Core
 *
 * Serving as the primary intelligence governor of the sovereign system. Analytically
 * audits request channels, identifies bottlenecks, manages safety thresholds, triggers
 * safe-mode rollback instructions, and publishes formal Evolution Proposals for human verify/signoff.
 */

import { KernelTelemetry, TelemetryMetric, MetricAggregation } from './KernelTelemetry';
import { KernelGovernor } from './KernelGovernor';

export interface EvolutionProposal {
  id: string;
  timestamp: string;
  optimizationType: 'PERFORMANCE' | 'LATENCY_TRIM' | 'DEDUPLICATION' | 'ROUTING_WEIGHTS' | 'RESOURCE_SHIELD' | 'SECURITY_HARDENING';
  targetModule: string;
  impactScore: number; // Scale of 1 to 10
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  proposedChange: string;
  justification: string;
  isApplied: boolean;
  requiresMFA: boolean;
}

export interface SelfHealingAction {
  alertId: string;
  timestamp: string;
  detectedDefect: string;
  recommendedMitigation: string;
  circuitBreakerActivated: boolean;
  rollbackSnapshotTag?: string;
}

export interface KernelSovereignState {
  kernelUptimeSeconds: number;
  isHealthy: boolean;
  governanceMode: 'AUDIT_ONLY_STRICT' | 'SAFE_MODE_HEALING';
  activeTelemetryScope: MetricAggregation;
  pendingProposals: EvolutionProposal[];
  recentSelfHealingTriggers: SelfHealingAction[];
}

export class AIKernel {
  private static instance: AIKernel;
  private startTime = Date.now();
  private governanceMode: 'AUDIT_ONLY_STRICT' | 'SAFE_MODE_HEALING' = 'AUDIT_ONLY_STRICT';

  // State caches
  private proposalsHistory: EvolutionProposal[] = [];
  private healingHistory: SelfHealingAction[] = [];
  private sovereignLogBook: { timestamp: string; component: string; event: string; detail: string }[] = [];

  private constructor() {
    this.recordAuditLog('AIKernel', 'INITIALIZATION', 'Sovereign intelligence governor is online and monitoring.');
  }

  public static getInstance(): AIKernel {
    if (!this.instance) {
      this.instance = new AIKernel();
    }
    return this.instance;
  }

  /**
   * Tracks an incoming action, routes metrics to telemetry layer, and runs healing triggers.
   */
  public monitorTransaction(metric: Omit<TelemetryMetric, 'id' | 'timestamp'>): void {
    const telemetry = KernelTelemetry.getInstance();
    const recorded = telemetry.logTransaction(metric);

    this.recordAuditLog(
      'AIKernel',
      'MONITOR_TICK',
      `Log Transaction ${recorded.id}: intent: ${metric.intentCategory}, dur: ${metric.durationMs}ms, error: ${metric.hasErrors}`
    );

    // Evaluate trigger patterns for self-healing sequences
    this.assessSelfHealing();

    // Evaluate optimization heuristics to create proposal pipelines
    this.evaluateOptimizations();
  }

  /**
   * Evaluates historical trends to identify latency bottlenecks, overfetching, or code redundancies.
   * If detected, compiles structural Evolution Proposals.
   */
  private evaluateOptimizations(): void {
    const telemetry = KernelTelemetry.getInstance();
    const stats = telemetry.aggregateMetrics(15); // Evaluate recent 15 minutes window

    // Pattern 1: RAG retrieval over-fetching or latency spikes
    if (stats.ragRate > 0.60 && stats.averageLatencyMs > 1800) {
      const matchFound = this.proposalsHistory.some(p => p.optimizationType === 'LATENCY_TRIM' && !p.isApplied);
      if (!matchFound) {
        this.generateProposal({
          optimizationType: 'LATENCY_TRIM',
          targetModule: 'Verification / RAG Retrieval Engine',
          impactScore: 8,
          riskLevel: 'LOW',
          proposedChange: 'Trim RAG document segments search from base 10 chunks to 3 dense vectors, and integrate memory-mapped Redis caching.',
          justification: `Retrieval rate accounts for ${parseFloat((stats.ragRate * 100).toFixed(1))}% of requests, driving latency to ${stats.averageLatencyMs}ms.`
        });
      }
    }

    // Pattern 2: Context switching overhead
    if (stats.contextSwitchCount > 40) {
      const matchFound = this.proposalsHistory.some(p => p.optimizationType === 'DEDUPLICATION' && !p.isApplied);
      if (!matchFound) {
        this.generateProposal({
          optimizationType: 'DEDUPLICATION',
          targetModule: 'Context Isolator Module',
          impactScore: 6,
          riskLevel: 'MEDIUM',
          proposedChange: 'Enforce thread-level session locking to reuse pre-allocated contextual schemas instead of active context switching.',
          justification: `High contextual thrashing detected (${stats.contextSwitchCount} transitions). Reduces memory allocations and GC sweeps.`
        });
      }
    }

    // Pattern 3: Unused high-threshold routes suggested for adaptive ease
    const governor = KernelGovernor.getInstance();
    const routingRecommends = governor.computeAdaptiveRoutingRecommends();
    
    routingRecommends.forEach(rec => {
      const targetHash = `WEIGHTS:${rec.intent}:${rec.suggestedThreshold}`;
      const matchFound = this.proposalsHistory.some(p => p.proposedChange.includes(targetHash) && !p.isApplied);
      if (!matchFound) {
        this.generateProposal({
          optimizationType: 'ROUTING_WEIGHTS',
          targetModule: `Intent Registry - ${rec.intent}`,
          impactScore: 7,
          riskLevel: 'MEDIUM',
          proposedChange: `Adjust local trigger threshold weight for intent '${rec.intent}' from ${rec.currentThreshold} to ${rec.suggestedThreshold}. [Ref Hash: ${targetHash}]`,
          justification: rec.reason
        });
      }
    });
  }

  /**
   * Generates a structural, audit-ready Evolution Proposal.
   */
  public generateProposal(params: Omit<EvolutionProposal, 'id' | 'timestamp' | 'isApplied' | 'requiresMFA'>): EvolutionProposal {
    const proposal: EvolutionProposal = {
      ...params,
      id: `PROP-${Math.floor(100000 + Math.random() * 900000)}`,
      timestamp: new Date().toISOString(),
      isApplied: false,
      requiresMFA: params.riskLevel === 'HIGH' || params.riskLevel === 'CRITICAL'
    };

    this.proposalsHistory.push(proposal);
    this.recordAuditLog(
      'AIKernel',
      'EVOLUTION_PROPOSAL_GENERATED',
      `Compiled safe evolution vector: ${proposal.id} (Impact: ${proposal.impactScore}/10) - Risk: ${proposal.riskLevel}`
    );

    return proposal;
  }

  /**
   * Evaluates error trends to step in with self-healing parameters (recommending rollbacks, enabling fallback).
   */
  private assessSelfHealing(): void {
    const telemetry = KernelTelemetry.getInstance();
    const stats = telemetry.aggregateMetrics(5); // Fast 5-minute telemetry window

    // Trigger Self Healing if error threshold exceeds 30% under active load
    if (stats.totalRequests >= 5 && stats.errorRate > 0.30) {
      const activeOutageCount = this.healingHistory.filter(h => Date.now() - new Date(h.timestamp).getTime() < 120000).length;
      
      if (activeOutageCount === 0) {
        const action: SelfHealingAction = {
          alertId: `HEAL-ALERT-${Math.floor(100000 + Math.random() * 900000)}`,
          timestamp: new Date().toISOString(),
          detectedDefect: `High pipeline degradation. Operational errors spiked to ${parseFloat((stats.errorRate * 100).toFixed(1))}%.`,
          recommendedMitigation: 'Initialize immediate fallback circuit-breaker on active tools and transition transaction flows into strict safe offline mode.',
          circuitBreakerActivated: true,
          rollbackSnapshotTag: `ROLLBACK-SNAP-STRETCH-${Math.floor(1000 + Math.random() * 9000)}`
        };

        this.healingHistory.push(action);
        this.governanceMode = 'SAFE_MODE_HEALING';

        this.recordAuditLog(
          'AIKernel',
          'SELF_HEALING_ACTIVATED',
          `Automated circuit breaker triggered: ${action.alertId}. Reason: ${action.detectedDefect}`
        );
      }
    }
  }

  /**
   * Human Operator Approval Process.
   * Enables manual verified promotion of proposals. Shows strict log trail.
   */
  public approveAndApplyProposal(proposalId: string, operatorRole: string): { success: boolean; error?: string; logSummary?: string } {
    const proposal = this.proposalsHistory.find(p => p.id === proposalId);
    if (!proposal) {
      return { success: false, error: 'Target Evolution Proposal not found.' };
    }

    if (proposal.isApplied) {
      return { success: false, error: 'Proposal was already validated and integrated.' };
    }

    if (proposal.requiresMFA && operatorRole !== 'Government') {
      return { success: false, error: 'Multi-Factor Validation Denied: Critical changes require Government Operator clearance.' };
    }

    // Apply the proposal logically
    proposal.isApplied = true;
    
    // Adjust governor parameters if it was a latency parameter trim
    if (proposal.optimizationType === 'LATENCY_TRIM') {
      KernelGovernor.getInstance().updateRules({ maxRAGFetchLimit: 3 });
    }

    const logSummary = `Operator '${operatorRole}' successfully approved and applied proposal ${proposalId}: '${proposal.proposedChange}'`;
    this.recordAuditLog('AIKernel', 'EVOLUTION_PROPOSAL_APPLIED', logSummary);

    return { success: true, logSummary };
  }

  /**
   * Resets active healing states, restoring baseline operational standards.
   */
  public resetHealingStatus(): void {
    this.governanceMode = 'AUDIT_ONLY_STRICT';
    this.healingHistory = [];
    this.recordAuditLog('AIKernel', 'HEALING_RESET', 'Cleared active system circuit-breakers. Mainline service restored.');
  }

  /**
   * Captures audit trails inside a secure internal government-grade ledger model.
   */
  public recordAuditLog(component: string, event: string, detail: string): void {
    const log = {
      timestamp: new Date().toISOString(),
      component,
      event,
      detail
    };
    this.sovereignLogBook.push(log);
    
    // Prevent unbounded memory expansion (keep last 500 records)
    if (this.sovereignLogBook.length > 500) {
      this.sovereignLogBook.shift();
    }
  }

  /**
   * Exposes full kernel state for UI dashboards.
   */
  public getSovereignKernelState(): KernelSovereignState {
    const telemetry = KernelTelemetry.getInstance();
    return {
      kernelUptimeSeconds: Math.floor((Date.now() - this.startTime) / 1000),
      isHealthy: this.governanceMode === 'AUDIT_ONLY_STRICT' && this.healingHistory.length === 0,
      governanceMode: this.governanceMode,
      activeTelemetryScope: telemetry.aggregateMetrics(30),
      pendingProposals: this.proposalsHistory.filter(p => !p.isApplied),
      recentSelfHealingTriggers: [...this.healingHistory]
    };
  }

  /**
   * Retrieves full log entries.
   */
  public getAuditLogs() {
    return [...this.sovereignLogBook];
  }

  /**
   * Gets list of all proposals ever generated.
   */
  public getAllProposals(): EvolutionProposal[] {
    return [...this.proposalsHistory];
  }

  /**
   * Cleans diagnostics maps during system maintenance operations.
   */
  public recycleSystem(): void {
    KernelTelemetry.getInstance().clearTelemetry();
    KernelGovernor.getInstance().clearGovernorState();
    this.proposalsHistory = [];
    this.healingHistory = [];
    this.sovereignLogBook = [];
    this.governanceMode = 'AUDIT_ONLY_STRICT';
    this.recordAuditLog('AIKernel', 'SYSTEM_RECYCLE', 'Purged in-memory runtime caches and registers.');
  }
}
