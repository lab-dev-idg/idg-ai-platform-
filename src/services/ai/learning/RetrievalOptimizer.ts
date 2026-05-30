/**
 * Iraq Digital Gateway (IDG)
 * Phase 13-F: Adaptive Learning & Feedback Intelligence - Retrieval Optimizer
 */

import { db, doc, getDoc, setDoc } from '../../firebase';
import { RetrievalStrategy, RetrievalMetrics } from './types';
import { KnowledgeDomain } from '../knowledge/types';
import { LearningAudit } from './LearningAudit';

export class RetrievalOptimizer {
  private static instance: RetrievalOptimizer;
  private metricsMap = new Map<RetrievalStrategy, RetrievalMetrics>();
  private audit = LearningAudit.getInstance();

  private constructor() {
    this.initializeBaselineMetrics();
  }

  public static getInstance(): RetrievalOptimizer {
    if (!this.instance) {
      this.instance = new RetrievalOptimizer();
    }
    return this.instance;
  }

  private initializeBaselineMetrics() {
    // Standard baseline weights reflecting mature platform operation
    this.metricsMap.set(RetrievalStrategy.SEMANTIC, {
      strategy: RetrievalStrategy.SEMANTIC,
      callsCount: 10,
      avgRelevanceScore: 0.82,
      userPositiveVotes: 8,
      userNegativeVotes: 2,
      totalRatingsSum: 40,
      ratingsCount: 10,
      retrievalSuccessScore: 0.82
    });

    this.metricsMap.set(RetrievalStrategy.KEYWORD, {
      strategy: RetrievalStrategy.KEYWORD,
      callsCount: 10,
      avgRelevanceScore: 0.70,
      userPositiveVotes: 6,
      userNegativeVotes: 4,
      totalRatingsSum: 32,
      ratingsCount: 10,
      retrievalSuccessScore: 0.64
    });

    this.metricsMap.set(RetrievalStrategy.HYBRID, {
      strategy: RetrievalStrategy.HYBRID,
      callsCount: 10,
      avgRelevanceScore: 0.88,
      userPositiveVotes: 9,
      userNegativeVotes: 1,
      totalRatingsSum: 45,
      ratingsCount: 10,
      retrievalSuccessScore: 0.90
    });
  }

  /**
   * Syncs metrics to and from the Firestore collection for persistency.
   */
  public async syncWithDatabase(): Promise<void> {
    try {
      for (const [strategy, metrics] of this.metricsMap.entries()) {
        const docRef = doc(db, 'retrieval_optimizer_metrics', strategy);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          const remoteMetrics = snapshot.data() as RetrievalMetrics;
          this.metricsMap.set(strategy, remoteMetrics);
        } else {
          await setDoc(docRef, metrics);
        }
      }
    } catch (err) {
      console.warn(`[RETRIEVAL-OPTIMIZER] DB synchronization offline. Using local optimization map.`, err);
    }
  }

  /**
   * Records a retrieval run metric in the in-memory or persisted tables.
   */
  public async recordRetrievalRun(
    strategy: RetrievalStrategy,
    relevanceScore: number
  ): Promise<void> {
    const metrics = this.metricsMap.get(strategy) || {
      strategy,
      callsCount: 0,
      avgRelevanceScore: 0.70,
      userPositiveVotes: 0,
      userNegativeVotes: 0,
      totalRatingsSum: 0,
      ratingsCount: 0,
      retrievalSuccessScore: 0.70
    };

    const count = metrics.callsCount;
    metrics.callsCount = count + 1;
    metrics.avgRelevanceScore = parseFloat(((metrics.avgRelevanceScore * count + relevanceScore) / metrics.callsCount).toFixed(4));
    
    this.recalculateSuccess(metrics);
    this.metricsMap.set(strategy, metrics);

    try {
      const docRef = doc(db, 'retrieval_optimizer_metrics', strategy);
      await setDoc(docRef, metrics, { merge: true });
    } catch {
      // Quiet local fallback
    }
  }

  /**
   * Updates success scores based on active user feedback metrics.
   */
  public async recordFeedback(
    strategy: RetrievalStrategy,
    feedback: { vote?: 'up' | 'down'; rating?: number }
  ): Promise<void> {
    const metrics = this.metricsMap.get(strategy);
    if (!metrics) return;

    if (feedback.vote) {
      if (feedback.vote === 'up') metrics.userPositiveVotes += 1;
      else metrics.userNegativeVotes += 1;
    }

    if (feedback.rating) {
      metrics.totalRatingsSum += feedback.rating;
      metrics.ratingsCount += 1;
    }

    const prevScore = metrics.retrievalSuccessScore;
    this.recalculateSuccess(metrics);
    this.metricsMap.set(strategy, metrics);

    await this.audit.logEvent(
      'RANKING_CHANGE',
      'RetrievalOptimizer',
      `Recalculated retrieval strategy performance index for '${strategy}' from ${prevScore} to ${metrics.retrievalSuccessScore}.`,
      { strategy, oldScore: prevScore, newScore: metrics.retrievalSuccessScore }
    );

    try {
      const docRef = doc(db, 'retrieval_optimizer_metrics', strategy);
      await setDoc(docRef, metrics, { merge: true });
    } catch {
      // Quiet local fallback
    }
  }

  /**
   * Strategy success calculations combining analytical coverage and explicit endorsement votes.
   */
  private recalculateSuccess(metrics: RetrievalMetrics) {
    const totalVotes = metrics.userPositiveVotes + metrics.userNegativeVotes;
    const voteRatio = totalVotes > 0 ? (metrics.userPositiveVotes / totalVotes) : 0.8;
    const ratingRatio = metrics.ratingsCount > 0 ? ((metrics.totalRatingsSum / metrics.ratingsCount) / 5.0) : 0.8;

    // Blended weighted calculation: Vote feedback (40%), Rating (40%), Content relevance matches (20%)
    const score = (voteRatio * 0.40) + (ratingRatio * 0.40) + (metrics.avgRelevanceScore * 0.20);
    metrics.retrievalSuccessScore = parseFloat(Math.min(1.00, Math.max(0.00, score)).toFixed(4));
  }

  /**
   * Recommends the optimal retrieval strategy depending on historical performance, keyword analysis, and context.
   */
  public recommendStrategy(queryText: string, domain?: KnowledgeDomain): RetrievalStrategy {
    const textLower = queryText.toLowerCase().trim();
    
    // Explicit keywords indicating certain strategy biases
    const hasSpecLaws = textLower.includes('article') || textLower.includes('decree') || textLower.includes('circular') || textLower.includes('law no.');
    const hasCodeIdentifiers = /\b\d{4}\/\d{2}\b/.test(textLower) || /\b(cbi|mof|ipa)\b/.test(textLower);

    if (hasSpecLaws || hasCodeIdentifiers) {
      // Rules, legislation numbers, and serial codes are highly served by hybrid or precise keyword retrievals
      return RetrievalStrategy.HYBRID;
    }

    // Default to the historical top performer
    let bestStrategy = RetrievalStrategy.HYBRID;
    let highestScore = -1;

    this.metricsMap.forEach((metrics, strategy) => {
      // Introduce subtle contextual optimization adjustments based on domains if relevant
      let domainModifier = 0.0;
      if (domain === KnowledgeDomain.GOVERNMENT && strategy === RetrievalStrategy.SEMANTIC) {
        domainModifier = 0.05; // Semantic aligns beautifully with complex ministerial prose
      }

      const score = metrics.retrievalSuccessScore + domainModifier;
      if (score > highestScore) {
        highestScore = score;
        bestStrategy = strategy;
      }
    });

    return bestStrategy;
  }

  /**
   * Retrieves full dataset of strategy score alignments.
   */
  public getMetrics(): RetrievalMetrics[] {
    return Array.from(this.metricsMap.values());
  }
}
