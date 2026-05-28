/**
 * Iraq Digital Gateway (IDG)
 * Kernel Performance Governor & Adaptive Routing Layer
 *
 * Implements deterministic low-latency caches and deduplication matrices to prevent
 * redundant AI computations, over-fetching on search indexes, and concurrent duplicate tool runs.
 * Also monitors and proposes optimized weights for the adaptive routing layer.
 */

import { IntentCategory, INTENT_REGISTRY } from '../registry/IntentRegistry';

export interface GovernorRules {
  maxRAGFetchLimit: number;
  enableIntentCache: boolean;
  intentCacheExpiryMs: number;
  preventDuplicateToolsWindowMs: number;
}

export class KernelGovernor {
  private static instance: KernelGovernor;

  // Configuration thresholds
  private currentRules: GovernorRules = {
    maxRAGFetchLimit: 5, // Trims extreme query retrievals to save system tokens
    enableIntentCache: true,
    intentCacheExpiryMs: 30000, // 30 seconds cache for exact queries
    preventDuplicateToolsWindowMs: 5000, // Debounce tools being triggered concurrently
  };

  // Cache stores
  private intentCache = new Map<string, { intent: IntentCategory; timestamp: number }>();
  private activeToolExecutionLocks = new Map<string, number>();

  // Metrics for Adaptive Routing recommendations
  private routingWeightsFeedback: Record<IntentCategory, { queriesEvaluated: number; successfulResolutions: number }> = 
    Object.keys(INTENT_REGISTRY).reduce((acc, key) => {
      acc[key as IntentCategory] = { queriesEvaluated: 0, successfulResolutions: 0 };
      return acc;
    }, {} as Record<IntentCategory, { queriesEvaluated: number; successfulResolutions: number }>);

  private constructor() {}

  public static getInstance(): KernelGovernor {
    if (!this.instance) {
      this.instance = new KernelGovernor();
    }
    return this.instance;
  }

  /**
   * Evaluates if a given query has a cached classification intent.
   * Eliminates redundant AI analysis cycles of identical repeated inputs.
   */
  public getCachedIntent(query: string): IntentCategory | null {
    if (!this.currentRules.enableIntentCache) return null;

    const normalized = query.trim().toLowerCase();
    const entry = this.intentCache.get(normalized);

    if (entry) {
      const isExpired = Date.now() - entry.timestamp > this.currentRules.intentCacheExpiryMs;
      if (!isExpired) {
        console.log(`[KERNEL-GOVERNOR] Intent Cache Hit: '${query}' -> ${entry.intent}`);
        return entry.intent;
      } else {
        this.intentCache.delete(normalized);
      }
    }
    return null;
  }

  /**
   * Caches a computed intent destination for the target user query string.
   */
  public cacheIntent(query: string, intent: IntentCategory): void {
    if (!this.currentRules.enableIntentCache) return;

    const normalized = query.trim().toLowerCase();
    this.intentCache.set(normalized, {
      intent,
      timestamp: Date.now()
    });

    // Handle feedback registers for adaptive weighting
    const stats = this.routingWeightsFeedback[intent];
    if (stats) {
      stats.queriesEvaluated++;
    }
  }

  /**
   * Blocks and deduplicates identical tool invocations requested within small windows.
   */
  public acquireToolLock(toolId: string, payloadSignature: string): boolean {
    const lockKey = `${toolId}:${payloadSignature}`;
    const lastTrigger = this.activeToolExecutionLocks.get(lockKey);
    const now = Date.now();

    if (lastTrigger && (now - lastTrigger < this.currentRules.preventDuplicateToolsWindowMs)) {
      console.warn(`[KERNEL-GOVERNOR] Duplicate Tool Bypass: Blocked redundant call to '${toolId}' in throttle window.`);
      return false;
    }

    this.activeToolExecutionLocks.set(lockKey, now);
    return true;
  }

  /**
   * Suggests modifications to matching weights or triggers based on intent frequencies.
   */
  public computeAdaptiveRoutingRecommends(): { intent: IntentCategory; currentThreshold: number; suggestedThreshold: number; reason: string }[] {
    const proposals: { intent: IntentCategory; currentThreshold: number; suggestedThreshold: number; reason: string }[] = [];

    Object.entries(this.routingWeightsFeedback).forEach(([category, stats]) => {
      const intentKey = category as IntentCategory;
      const originalThreshold = INTENT_REGISTRY[intentKey]?.confidenceThreshold || 0.70;

      // Suggest optimizing thresholds higher when intent has heavy execution to enforce stricter safety gates
      if (stats.queriesEvaluated > 50) {
        const revisedThreshold = Math.min(0.95, originalThreshold + 0.05);
        proposals.push({
          intent: intentKey,
          currentThreshold: originalThreshold,
          suggestedThreshold: parseFloat(revisedThreshold.toFixed(2)),
          reason: `High frequency query profile (${stats.queriesEvaluated} invocations). Tighten threshold security bound.`
        });
      }

      // Suggest easing thresholds when intent is barely queried but highly safe
      if (stats.queriesEvaluated === 0 && originalThreshold > 0.80 && ['GENERAL', 'SUPPORT'].includes(intentKey)) {
        const revisedThreshold = Math.max(0.60, originalThreshold - 0.10);
        proposals.push({
          intent: intentKey,
          currentThreshold: originalThreshold,
          suggestedThreshold: parseFloat(revisedThreshold.toFixed(2)),
          reason: `Low utility public intent channel. Relieve operational verification overhead by lowering threshold.`
        });
      }
    });

    return proposals;
  }

  /**
   * Enforces strict maximum item bounds for RAG results.
   */
  public limitRAGFetches<T>(items: T[]): T[] {
    if (items.length > this.currentRules.maxRAGFetchLimit) {
      console.log(`[KERNEL-GOVERNOR] RAG Limit Applied: Trimmed ${items.length} materials down to safe threshold of ${this.currentRules.maxRAGFetchLimit}`);
      return items.slice(0, this.currentRules.maxRAGFetchLimit);
    }
    return items;
  }

  /**
   * Logs success metrics to confirm resolving performance constraints.
   */
  public recordResolutionSuccess(intent: IntentCategory): void {
    const stats = this.routingWeightsFeedback[intent];
    if (stats) {
      stats.successfulResolutions++;
    }
  }

  /**
   * Adjusts telemetry thresholds at runtime.
   */
  public updateRules(rules: Partial<GovernorRules>): void {
    this.currentRules = {
      ...this.currentRules,
      ...rules
    };
    console.log(`[KERNEL-GOVERNOR] Rules updated successfully:`, this.currentRules);
  }

  /**
   * Reads target configurations.
   */
  public getGovernorRules(): GovernorRules {
    return { ...this.currentRules };
  }

  /**
   * Purges temporal validation registers.
   */
  public clearGovernorState(): void {
    this.intentCache.clear();
    this.activeToolExecutionLocks.clear();
    Object.keys(this.routingWeightsFeedback).forEach(key => {
      this.routingWeightsFeedback[key as IntentCategory] = { queriesEvaluated: 0, successfulResolutions: 0 };
    });
  }
}
