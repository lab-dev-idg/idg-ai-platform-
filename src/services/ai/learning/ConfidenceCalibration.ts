/**
 * Iraq Digital Gateway (IDG)
 * Phase 13-F: Adaptive Learning & Feedback Intelligence - Confidence Calibration
 */

import { RetrievalOptimizer } from './RetrievalOptimizer';
import { PromptOptimizer } from './PromptOptimizer';
import { LearningAudit } from './LearningAudit';

export class ConfidenceCalibration {
  private static instance: ConfidenceCalibration;
  private audit = LearningAudit.getInstance();

  private constructor() {}

  public static getInstance(): ConfidenceCalibration {
    if (!this.instance) {
      this.instance = new ConfidenceCalibration();
    }
    return this.instance;
  }

  /**
   * Calculates a granular, adaptive confidence score by blending four parameters:
   * confidence = historicalAccuracy + feedbackScore + evidenceQuality + reasoningConsistency
   */
  public calibrateConfidence(params: {
    evidenceQuality: number;       // Range: 0.0 to 1.0
    reasoningConsistency: number; // Range: 0.0 to 1.0
    customHistoricalAccuracy?: number;
    customFeedbackScore?: number;
  }): { score: number; label: string; components: Record<string, number> } {
    
    // 1. Historical Accuracy (25% Weight)
    // Pulls rolling strategy correctness from prompt & retrieval optimization metrics
    let historicalAccuracy = params.customHistoricalAccuracy;
    if (historicalAccuracy === undefined) {
      const retrievalMetrics = RetrievalOptimizer.getInstance().getMetrics();
      const promptMetrics = PromptOptimizer.getInstance().getMetrics();

      const sumRetrieval = retrievalMetrics.reduce((sum, m) => sum + m.retrievalSuccessScore, 0);
      const avgRetrieval = retrievalMetrics.length > 0 ? (sumRetrieval / retrievalMetrics.length) : 0.80;

      const sumPrompt = promptMetrics.reduce((sum, m) => sum + m.avgAnswerQuality, 0);
      const avgPrompt = promptMetrics.length > 0 ? (sumPrompt / promptMetrics.length) : 0.80;

      historicalAccuracy = (avgRetrieval + avgPrompt) / 2.0;
    }

    // 2. Feedback Score (25% Weight)
    // Derived from active system endorsements
    let feedbackScore = params.customFeedbackScore;
    if (feedbackScore === undefined) {
      const retrievalMetrics = RetrievalOptimizer.getInstance().getMetrics();
      let totalUp = 0;
      let totalCount = 0;

      retrievalMetrics.forEach((m) => {
        totalUp += m.userPositiveVotes;
        totalCount += (m.userPositiveVotes + m.userNegativeVotes);
      });

      feedbackScore = totalCount > 0 ? (totalUp / totalCount) : 0.85;
    }

    // 3. Evidence Quality (25% Weight)
    const evidenceQuality = Math.min(1.00, Math.max(0.00, params.evidenceQuality));

    // 4. Reasoning Consistency (25% Weight)
    const reasoningConsistency = Math.min(1.00, Math.max(0.00, params.reasoningConsistency));

    // Blended Calibration: equal distribution (25% each)
    const score = (historicalAccuracy * 0.25) +
                  (feedbackScore * 0.25) +
                  (evidenceQuality * 0.25) +
                  (reasoningConsistency * 0.25);

    const calibratedScore = parseFloat(Math.min(1.00, Math.max(0.00, score)).toFixed(4));

    let label = 'Unreliable';
    if (calibratedScore >= 0.90) {
      label = 'Very High';
    } else if (calibratedScore >= 0.75) {
      label = 'High';
    } else if (calibratedScore >= 0.60) {
      label = 'Moderate';
    } else if (calibratedScore >= 0.40) {
      label = 'Low';
    }

    // Log tracking for micro-adjustments if changes are significant
    if (calibratedScore < 0.60) {
      this.audit.logEvent(
        'CONFIDENCE_ADJUSTMENT',
        'ConfidenceCalibration',
        `Confidence calibrated to low range: ${calibratedScore}. Internal parameters: Evidence Quality = ${evidenceQuality.toFixed(2)}, Reasoning Consistency = ${reasoningConsistency.toFixed(2)}`,
        { calibratedScore, evidenceQuality, reasoningConsistency }
      );
    }

    return {
      score: calibratedScore,
      label,
      components: {
        historicalAccuracy,
        feedbackScore,
        evidenceQuality,
        reasoningConsistency
      }
    };
  }
}
