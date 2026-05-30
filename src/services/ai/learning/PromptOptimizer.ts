/**
 * Iraq Digital Gateway (IDG)
 * Phase 13-F: Adaptive Learning & Feedback Intelligence - Prompt Optimizer
 */

import { db, doc, getDoc, setDoc } from '../../firebase';
import { PromptStrategy, PromptMetrics } from './types';
import { LearningAudit } from './LearningAudit';

export class PromptOptimizer {
  private static instance: PromptOptimizer;
  private promptMetricsMap = new Map<PromptStrategy, PromptMetrics>();
  private audit = LearningAudit.getInstance();

  private constructor() {
    this.initializeBaselineMetrics();
  }

  public static getInstance(): PromptOptimizer {
    if (!this.instance) {
      this.instance = new PromptOptimizer();
    }
    return this.instance;
  }

  private initializeBaselineMetrics() {
    // Platform standard baseline weights
    this.promptMetricsMap.set(PromptStrategy.PRECISE_LEGAL, {
      strategy: PromptStrategy.PRECISE_LEGAL,
      usageCount: 15,
      positiveFeedbackCount: 13,
      negativeFeedbackCount: 2,
      sumRatings: 68,
      ratingsCount: 15,
      confidenceAccuracySum: 1.20,
      avgAnswerQuality: 0.88
    });

    this.promptMetricsMap.set(PromptStrategy.CONCISE_DIRECT, {
      strategy: PromptStrategy.CONCISE_DIRECT,
      usageCount: 10,
      positiveFeedbackCount: 7,
      negativeFeedbackCount: 3,
      sumRatings: 40,
      ratingsCount: 10,
      confidenceAccuracySum: 1.80,
      avgAnswerQuality: 0.72
    });

    this.promptMetricsMap.set(PromptStrategy.DETAILED_EXPLANATORY, {
      strategy: PromptStrategy.DETAILED_EXPLANATORY,
      usageCount: 12,
      positiveFeedbackCount: 10,
      negativeFeedbackCount: 2,
      sumRatings: 52,
      ratingsCount: 12,
      confidenceAccuracySum: 1.40,
      avgAnswerQuality: 0.82
    });
  }

  /**
   * Syncs custom metrics to/from Firestore.
   */
  public async syncWithDatabase(): Promise<void> {
    try {
      for (const [strategy, metrics] of this.promptMetricsMap.entries()) {
        const docRef = doc(db, 'prompt_optimizer_metrics', strategy);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          const remoteMetrics = snapshot.data() as PromptMetrics;
          this.promptMetricsMap.set(strategy, remoteMetrics);
        } else {
          await setDoc(docRef, metrics);
        }
      }
    } catch (err) {
      console.warn(`[PROMPT-OPTIMIZER] Cloud metrics registry offline. Using local optimization map.`, err);
    }
  }

  /**
   * Records a prompt usage event.
   */
  public async recordPromptUsage(strategy: PromptStrategy): Promise<void> {
    const metrics = this.promptMetricsMap.get(strategy) || {
      strategy,
      usageCount: 0,
      positiveFeedbackCount: 0,
      negativeFeedbackCount: 0,
      sumRatings: 0,
      ratingsCount: 0,
      confidenceAccuracySum: 0,
      avgAnswerQuality: 0.75
    };

    metrics.usageCount += 1;
    this.promptMetricsMap.set(strategy, metrics);

    try {
      const docRef = doc(db, 'prompt_optimizer_metrics', strategy);
      await setDoc(docRef, metrics, { merge: true });
    } catch {
      // Offline mode
    }
  }

  /**
   * Analyzes feedback elements to refine prompt optimization weights.
   */
  public async recordFeedback(
    strategy: PromptStrategy,
    feedback: { vote?: 'up' | 'down'; rating?: number; generatedConfidence?: number }
  ): Promise<void> {
    const metrics = this.promptMetricsMap.get(strategy);
    if (!metrics) return;

    if (feedback.vote) {
      if (feedback.vote === 'up') metrics.positiveFeedbackCount += 1;
      else metrics.negativeFeedbackCount += 1;
    }

    if (feedback.rating) {
      metrics.sumRatings += feedback.rating;
      metrics.ratingsCount += 1;

      // Calculate confidence accuracy delta
      if (feedback.generatedConfidence !== undefined) {
        const normalizedRatingScore = feedback.rating / 5.0; // scale 0.2 to 1.0
        const accuracyDelta = Math.abs(feedback.generatedConfidence - normalizedRatingScore);
        metrics.confidenceAccuracySum = parseFloat((metrics.confidenceAccuracySum + accuracyDelta).toFixed(4));
      }
    }

    const prevQuality = metrics.avgAnswerQuality;
    this.recalculateQuality(metrics);
    this.promptMetricsMap.set(strategy, metrics);

    await this.audit.logEvent(
      'RANKING_CHANGE',
      'PromptOptimizer',
      `Prompt style "${strategy}" accuracy index adjusted from ${prevQuality} to ${metrics.avgAnswerQuality}.`,
      { strategy, oldQuality: prevQuality, newQuality: metrics.avgAnswerQuality }
    );

    try {
      const docRef = doc(db, 'prompt_optimizer_metrics', strategy);
      await setDoc(docRef, metrics, { merge: true });
    } catch {
      // Offline mode
    }
  }

  private recalculateQuality(metrics: PromptMetrics) {
    const totalVotes = metrics.positiveFeedbackCount + metrics.negativeFeedbackCount;
    const voteRatio = totalVotes > 0 ? (metrics.positiveFeedbackCount / totalVotes) : 0.8;
    const ratingRatio = metrics.ratingsCount > 0 ? ((metrics.sumRatings / metrics.ratingsCount) / 5.0) : 0.8;
    
    // Confidence accuracy index: average accuracy error
    const avgError = metrics.ratingsCount > 0 ? (metrics.confidenceAccuracySum / metrics.ratingsCount) : 0.15;
    const accuracyFactor = Math.max(0.40, 1.00 - avgError); // Penalize templates causing huge confidence-reality gaps

    // Quality blending: Vote ratio (35%), Rating ratio (35%), Accuracy Alignment (30%)
    const score = (voteRatio * 0.35) + (ratingRatio * 0.35) + (accuracyFactor * 0.30);
    metrics.avgAnswerQuality = parseFloat(Math.min(1.00, Math.max(0.00, score)).toFixed(4));
  }

  /**
   * Recommends the prompt style with the highest recorded usability metric.
   */
  public recommendStrategy(queryText: string): PromptStrategy {
    const textLower = queryText.toLowerCase().trim();

    // Contextual rules that guarantee precise templates
    if (textLower.includes('tariff') || textLower.includes('customs law') || textLower.includes('article')) {
      return PromptStrategy.PRECISE_LEGAL;
    }
    
    if (textLower.includes('status') || textLower.includes('quick check') || textLower.includes('is open')) {
      return PromptStrategy.CONCISE_DIRECT;
    }

    let recommended = PromptStrategy.PRECISE_LEGAL;
    let highestQuality = -1;

    this.promptMetricsMap.forEach((metrics, strategy) => {
      if (metrics.avgAnswerQuality > highestQuality) {
        highestQuality = metrics.avgAnswerQuality;
        recommended = strategy;
      }
    });

    return recommended;
  }

  public getMetrics(): PromptMetrics[] {
    return Array.from(this.promptMetricsMap.values());
  }
}
