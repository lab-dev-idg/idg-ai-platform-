/**
 * Iraq Digital Gateway (IDG)
 * Enterprise Advanced Reasoning - Confidence Scoring System
 * 
 * Aggregates weighted parameters including Source Trust, Evidence Coverage, Freshness, 
 * Consistency under conflict conditions, and Ministerial Authority to compute legal-grade confidence indices.
 */

import { EvidenceBundle, ConflictReport } from './types';

export class ConfidenceScorer {
  private static instance: ConfidenceScorer;

  private constructor() {}

  public static getInstance(): ConfidenceScorer {
    if (!this.instance) {
      this.instance = new ConfidenceScorer();
    }
    return this.instance;
  }

  /**
   * Computes multi-parameter confidence indexes.
   */
  public calculateConfidence(
    bundle: EvidenceBundle,
    conflictReport: ConflictReport
  ): { score: number; label: string; details: Record<string, number> } {
    if (bundle.totalCount === 0) {
      return {
        score: 0.20,
        label: 'Unreliable',
        details: { sourceTrust: 0.20, coverage: 0.00, freshness: 0.50, consistency: 1.00, authority: 0.50 }
      };
    }

    // 1. Source Trust
    const sourceTrust = bundle.averageTrustScore;

    // 2. Coverage
    const coverage = Math.min(1.00, bundle.totalCount / 5);

    // 3. Freshness decay
    let sumFreshness = 0;
    const currentYear = new Date().getFullYear();
    for (const record of bundle.records) {
      const pubDateVal = record.metadata?.publicationDate ? new Date(record.metadata.publicationDate) : new Date();
      const ageYears = Math.max(0, currentYear - pubDateVal.getFullYear());
      const ageDecay = Math.max(0.40, 1.00 - (ageYears * 0.10));
      sumFreshness += ageDecay;
    }
    const freshness = sumFreshness / bundle.totalCount;

    // 4. Consistency matching
    const unresolved = conflictReport.unresolvedConflicts.length;
    const resolved = conflictReport.resolvedConflicts.length;
    const totalC = unresolved + resolved;

    let consistency = 1.00;
    if (totalC > 0) {
      consistency = resolved / totalC;
      consistency = Math.max(0.10, consistency - (unresolved * 0.30));
    }

    // 5. Ministry Authority Level
    let sumAuthorLevel = 0;
    for (const record of bundle.records) {
      const minLower = (record.metadata?.ministry || '').toLowerCase();
      const isSupremeIssuer = minLower.includes('finance') || minLower.includes('central bank') || minLower.includes('cbi');
      sumAuthorLevel += isSupremeIssuer ? 1.00 : 0.75;
    }
    const authority = sumAuthorLevel / bundle.totalCount;

    // Mathematical Blending Weights: Trust (25%), Freshness (20%), Coverage (15%), Consistency (20%), Authority (20%)
    const rawSum = (sourceTrust * 0.25) +
                    (freshness * 0.20) +
                    (coverage * 0.15) +
                    (consistency * 0.20) +
                    (authority * 0.20);

    const score = Math.max(0.00, Math.min(1.00, parseFloat(rawSum.toFixed(4))));

    let label = 'Unreliable';
    if (score >= 0.90) {
      label = 'Very High';
    } else if (score >= 0.75) {
      label = 'High';
    } else if (score >= 0.60) {
      label = 'Moderate';
    } else if (score >= 0.40) {
      label = 'Low';
    } else {
      label = 'Unreliable';
    }

    return {
      score,
      label,
      details: {
        sourceTrust,
        coverage,
        freshness,
        consistency,
        authority
      }
    };
  }
}
