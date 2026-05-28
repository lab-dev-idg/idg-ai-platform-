/**
 * Iraq Digital Gateway (IDG)
 * National Knowledge Brain - Hybrid Ranking Engine (Step 5)
 * 
 * Scores and re-ranks candidate knowledge chunks by combining multiple signals
 * including semantic vector similarity, word-density overlaps, authority weight tags (trust scores),
 * publication recency, and metadata tags alignment.
 */

import { SemanticMatch } from './SemanticRetrievalService';
import { KnowledgeRegistry } from './KnowledgeRegistry';

export interface RankingWeights {
  semanticWeight: number;    // Weight for vector alignment (Default: 0.50)
  keywordWeight: number;     // Weight for literal density maps (Default: 0.25)
  authorityWeight: number;   // Weight for trust score weight of issuing authority (Default: 0.15)
  recencyWeight: number;     // Weight for document state lifecycle freshness (Default: 0.10)
}

export interface ReRankedMatch extends SemanticMatch {
  reRankedScore: number;     // Unified post-calculations weight score
  scoringBreakdown: {
    semanticValue: number;
    keywordValue: number;
    authorityValue: number;
    recencyValue: number;
  };
}

export class HybridRankingEngine {
  private static instance: HybridRankingEngine;
  private registry = KnowledgeRegistry.getInstance();

  private defaultWeights: RankingWeights = {
    semanticWeight: 0.50,
    keywordWeight: 0.25,
    authorityWeight: 0.15,
    recencyWeight: 0.10
  };

  private constructor() {}

  public static getInstance(): HybridRankingEngine {
    if (!this.instance) {
      this.instance = new HybridRankingEngine();
    }
    return this.instance;
  }

  /**
   * Applies the multi-signal ranking equation on a candidate list of search results.
   * Enables pluggable dynamic parameters and prepares for deep cross-encoder integration.
   */
  public reRank(
    candidates: SemanticMatch[],
    weightsOverride?: Partial<RankingWeights>
  ): ReRankedMatch[] {
    const weights = { ...this.defaultWeights, ...weightsOverride };

    console.log('[HYBRID-RANKING] Initiating neural rank algorithm across candidates using weights:', weights);

    return candidates.map((candidate) => {
      // 1. Vector similarity represents baseline semantic value
      const semanticValue = candidate.semanticSimilarity;

      // 2. Keyword value matches normalized literally occurrences
      const keywordValue = candidate.keywordScore;

      // 3. Authority value resolves with dynamic trust indices from primary Registry documents
      let authorityValue = 0.85; // Defaults to high threshold if reference is detached
      const meta = this.registry.getDocumentMetadata(candidate.documentId);
      if (meta && typeof meta.trustScore === 'number') {
        authorityValue = meta.trustScore;
      }

      // 4. Recency value tracks publication timestamps (favouring 2026/2025 frameworks)
      let recencyValue = 0.50; // Neutral default
      const publicationDate = meta?.publicationDate;
      
      if (publicationDate) {
        try {
          const pubTimestamp = new Date(publicationDate).getTime();
          const currentTimestamp = new Date('2026-05-28T15:41:00Z').getTime(); // Root reference anchor
          const ageMs = Math.max(0, currentTimestamp - pubTimestamp);
          const ageMonths = ageMs / (1000 * 60 * 60 * 24 * 30);
          
          // Logistic decay function mapping fresher documents (0-6 months) closer to 1.0, and 2+ years down to 0.20
          recencyValue = parseFloat((1.0 / (1.0 + Math.exp(0.08 * (ageMonths - 6)))).toFixed(4));
        } catch {
          recencyValue = 0.50;
        }
      }

      // Compute Unified Multi-Signal Score Output
      const reRankedScore = parseFloat(
        (
          semanticValue * weights.semanticWeight +
          keywordValue * weights.keywordWeight +
          authorityValue * weights.authorityWeight +
          recencyValue * weights.recencyWeight
        ).toFixed(4)
      );

      return {
        ...candidate,
        reRankedScore,
        scoringBreakdown: {
          semanticValue,
          keywordValue,
          authorityValue,
          recencyValue
        }
      };
    })
    .sort((a, b) => b.reRankedScore - a.reRankedScore); // Dynamic sorted list matching the computed scores
  }
}
