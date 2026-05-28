/**
 * Iraq Digital Gateway (IDG)
 * Global Logistics Corridor Optimizer - Phase 12-H
 *
 * Advisor module analyzing shipping channels, predicting delays, estimating
 * cost metrics, and proposing risk-aware routing alternatives across borders.
 * Strictly advisory to guarantee sovereign human gating.
 */

export interface TradeCorridor {
  corridorId: string;
  name: string; // e.g. "Arabian Gulf Maritime Corridor"
  primaryPath: string[]; // e.g. ["Umm Qasr South Port", "Strait of Hormuz", "Red Sea", "Suez Canal"]
  baseTransitTimeDays: number;
  baseCostUSD: number;
  currentRiskIndex: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  congestionMultiplier: number;
}

export interface RouteOptimizationRecommendation {
  originalCorridor: string;
  suggestedRoute: string[];
  estimatedTimeSavedDays: number;
  costImpactUSD: number;
  riskMitigationDetails: string;
  isAdvisoryOnly: boolean; // Must always be true
}

export interface CorridorAdvisoryReport {
  timestamp: string;
  evaluatedCorridors: Array<{
    id: string;
    name: string;
    calculatedTransitTimeDays: number;
    totalEstCostUSD: number;
    delayWarningTriggered: boolean;
    congestionPct: number;
  }>;
  optimizationAdvice: RouteOptimizationRecommendation[];
  systemVerificationLabel: string;
}

export class GlobalLogisticsOptimizer {
  private static instance: GlobalLogisticsOptimizer;

  private activeCorridors: Map<string, TradeCorridor> = new Map();

  private constructor() {
    this.bootstrapCorridors();
  }

  public static getInstance(): GlobalLogisticsOptimizer {
    if (!this.instance) {
      this.instance = new GlobalLogisticsOptimizer();
    }
    return this.instance;
  }

  private bootstrapCorridors(): void {
    const baselineCorridors: TradeCorridor[] = [
      {
        corridorId: 'CORR-MARITIME-GULF',
        name: 'Arabian Gulf Maritime Route',
        primaryPath: ['Umm Qasr South Port, Iraq', 'Strait of Hormuz', 'Bab-el-Mandeb Strait', 'Suez Canal', 'Rotterdam Port'],
        baseTransitTimeDays: 22,
        baseCostUSD: 4200,
        currentRiskIndex: 'HIGH', // High risk at Strait checkpoints
        congestionMultiplier: 1.25 // 25% extra delays
      },
      {
        corridorId: 'CORR-OVERLAND-NORTH',
        name: 'Ibrahim Khalil Overland Corridor',
        primaryPath: ['Baghdad Central Hub', 'Duhok Checkpoint', 'Silopi Terminal, Turkey', 'Balkan Highway', 'Hamburg Germany'],
        baseTransitTimeDays: 12,
        baseCostUSD: 6800,
        currentRiskIndex: 'MEDIUM',
        congestionMultiplier: 1.05
      },
      {
        corridorId: 'CORR-DESERT-WEST',
        name: 'Western Levant Highway',
        primaryPath: ['Ar-Rutbah Customs Link', 'Mafraq Gateway Jordan', 'Aqaba Terminal Port'],
        baseTransitTimeDays: 5,
        baseCostUSD: 2400,
        currentRiskIndex: 'HIGH',
        congestionMultiplier: 1.40
      }
    ];

    baselineCorridors.forEach(c => this.activeCorridors.set(c.corridorId, c));
  }

  /**
   * Compiles detailed transit and risk advisory logs.
   */
  public generateCorridorAdvisorReport(): CorridorAdvisoryReport {
    const evaluated: CorridorAdvisoryReport['evaluatedCorridors'] = [];
    const optimizationAdvice: RouteOptimizationRecommendation[] = [];

    this.activeCorridors.forEach(c => {
      const actualDays = parseFloat((c.baseTransitTimeDays * c.congestionMultiplier).toFixed(1));
      const finalCost = parseFloat((c.baseCostUSD * (1 + (c.congestionMultiplier - 1) * 0.5)).toFixed(0));

      evaluated.push({
        id: c.corridorId,
        name: c.name,
        calculatedTransitTimeDays: actualDays,
        totalEstCostUSD: finalCost,
        delayWarningTriggered: c.congestionMultiplier > 1.15,
        congestionPct: Math.round((c.congestionMultiplier - 1) * 100)
      });

      // Suggest optimization alternates
      if (c.corridorId === 'CORR-MARITIME-GULF' && c.currentRiskIndex === 'HIGH') {
        optimizationAdvice.push({
          originalCorridor: c.name,
          suggestedRoute: ['Umm Qasr South Port, Iraq', 'Aqaba Port Jordan via Desert Transit', 'Suez Canal Bypass'],
          estimatedTimeSavedDays: 4.5,
          costImpactUSD: 1400, // $1400 premiums adjustment
          riskMitigationDetails: 'Bypasses Hormuz choke points to avoid high-risk corridor fees. Advised for containerized essential goods shipments.',
          isAdvisoryOnly: true
        });
      }

      if (c.corridorId === 'CORR-DESERT-WEST' && c.congestionMultiplier > 1.30) {
        optimizationAdvice.push({
          originalCorridor: c.name,
          suggestedRoute: ['Baghdad-Basra Rail', 'Overland Ibrahim Khalil (Turkey) Gateway Link'],
          estimatedTimeSavedDays: 1.2,
          costImpactUSD: -300,
          riskMitigationDetails: 'Bypasses heavily congested desert roadway junctions by shifting freight to Northern Intermodal rail.',
          isAdvisoryOnly: true
        });
      }
    });

    return {
      timestamp: new Date().toISOString(),
      evaluatedCorridors: evaluated,
      optimizationAdvice,
      systemVerificationLabel: 'ADVISORY_ONLY_DECISION_RESTRICTED_REPLICATION'
    };
  }

  /**
   * Safe route optimization query under border security constraints.
   */
  public simulateBorderCongestionAdjustment(corridorId: string, congestionPct: number): { success: boolean; prevMultiplier: number; newMultiplier: number } {
    const corridor = this.activeCorridors.get(corridorId);
    if (!corridor) {
      return { success: false, prevMultiplier: 0, newMultiplier: 0 };
    }

    const prev = corridor.congestionMultiplier;
    corridor.congestionMultiplier = parseFloat((1 + congestionPct / 100).toFixed(2));
    
    console.log(`[GLOBAL-LOGISTIC-OPT] Tuned corridor congestion mapping for ${corridorId}: ${congestionPct}%`);
    return { success: true, prevMultiplier: prev, newMultiplier: corridor.congestionMultiplier };
  }

  public getCorridorList(): TradeCorridor[] {
    return Array.from(this.activeCorridors.values());
  }
}
