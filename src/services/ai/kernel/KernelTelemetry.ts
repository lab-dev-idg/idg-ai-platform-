/**
 * Iraq Digital Gateway (IDG)
 * AI Kernel Telemetry & Monitoring Layer
 *
 * Continuously observes request patterns, execution latencies, context switching overhead,
 * tool invocation frequency, and operational error flags. Holds immutable telemetry tracks.
 */

export interface TelemetryMetric {
  id: string;
  timestamp: string;
  durationMs: number;
  intentCategory: string;
  contextType: string;
  didRAGRun: boolean;
  didToolRun: boolean;
  toolUsed?: string;
  hasErrors: boolean;
  errorMessage?: string;
  userClearance: number;
}

export interface MetricAggregation {
  totalRequests: number;
  averageLatencyMs: number;
  errorRate: number;
  contextSwitchCount: number;
  ragRate: number;
  toolUsageRates: Record<string, number>;
  activeAnomaliesCount: number;
}

export class KernelTelemetry {
  private static instance: KernelTelemetry;
  private metricsBuffer: TelemetryMetric[] = [];
  private lastActiveContextType: string | null = null;
  private contextSwitchCount = 0;

  private constructor() {}

  public static getInstance(): KernelTelemetry {
    if (!this.instance) {
      this.instance = new KernelTelemetry();
    }
    return this.instance;
  }

  /**
   * Records a complete transaction footprint into the telemetry ledger.
   */
  public logTransaction(metric: Omit<TelemetryMetric, 'id' | 'timestamp'>): TelemetryMetric {
    const fullMetric: TelemetryMetric = {
      ...metric,
      id: `METRIC-${Math.floor(100000 + Math.random() * 900000)}`,
      timestamp: new Date().toISOString()
    };

    // Track context switches
    if (this.lastActiveContextType && this.lastActiveContextType !== metric.contextType) {
      this.contextSwitchCount++;
    }
    this.lastActiveContextType = metric.contextType;

    // Direct buffer storage with max capability threshold logic (ring buffer fallback)
    if (this.metricsBuffer.length >= 1000) {
      this.metricsBuffer.shift(); // Evict oldest record
    }
    this.metricsBuffer.push(fullMetric);

    console.log(`[KERNEL-TELEMETRY] Recorded telemetry frame ${fullMetric.id} [${metric.intentCategory}] - Duration: ${metric.durationMs}ms - Error: ${metric.hasErrors}`);
    return fullMetric;
  }

  /**
   * Computes structural averages and frequencies across collected metrics.
   */
  public aggregateMetrics(durationWindowMinutes = 60): MetricAggregation {
    const cutoffTime = Date.now() - durationWindowMinutes * 60 * 1000;
    const windowMetrics = this.metricsBuffer.filter(
      m => new Date(m.timestamp).getTime() >= cutoffTime
    );

    if (windowMetrics.length === 0) {
      return {
        totalRequests: 0,
        averageLatencyMs: 0,
        errorRate: 0.00,
        contextSwitchCount: this.contextSwitchCount,
        ragRate: 0.00,
        toolUsageRates: {},
        activeAnomaliesCount: 0
      };
    }

    let sumLatency = 0;
    let sumRAG = 0;
    let sumErrors = 0;
    const toolCounts: Record<string, number> = {};

    windowMetrics.forEach(m => {
      sumLatency += m.durationMs;
      if (m.didRAGRun) sumRAG++;
      if (m.hasErrors) sumErrors++;
      if (m.didToolRun && m.toolUsed) {
        toolCounts[m.toolUsed] = (toolCounts[m.toolUsed] || 0) + 1;
      }
    });

    const activeAnomaliesCount = this.detectAnomalies(windowMetrics);

    return {
      totalRequests: windowMetrics.length,
      averageLatencyMs: parseFloat((sumLatency / windowMetrics.length).toFixed(2)),
      errorRate: parseFloat((sumErrors / windowMetrics.length).toFixed(4)),
      contextSwitchCount: this.contextSwitchCount,
      ragRate: parseFloat((sumRAG / windowMetrics.length).toFixed(4)),
      toolUsageRates: toolCounts,
      activeAnomaliesCount
    };
  }

  /**
   * Scans transaction metrics to find critical patterns or potential service degradation.
   */
  private detectAnomalies(metrics: TelemetryMetric[]): number {
    let anomalies = 0;
    
    // Rule 1: High latency bounds
    const latencySpikeCount = metrics.filter(m => m.durationMs > 2500).length;
    if (latencySpikeCount > metrics.length * 0.15) {
      anomalies++;
    }

    // Rule 2: Sudden Error cascades
    const recentErrors = metrics.slice(-10).filter(m => m.hasErrors).length;
    if (recentErrors >= 4) {
      anomalies++;
    }

    return anomalies;
  }

  /**
   * Safe access method reading captured log buffer.
   */
  public getMetricsHistory(): TelemetryMetric[] {
    return [...this.metricsBuffer];
  }

  /**
   * Disposes telemetry registers.
   */
  public clearTelemetry(): void {
    this.metricsBuffer = [];
    this.contextSwitchCount = 0;
    this.lastActiveContextType = null;
  }
}
