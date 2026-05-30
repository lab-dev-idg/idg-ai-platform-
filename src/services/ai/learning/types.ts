/**
 * Iraq Digital Gateway (IDG)
 * Phase 13-F: Adaptive Learning & Feedback Intelligence - Type System
 */

import { KnowledgeDomain } from '../knowledge/types';

export enum RetrievalStrategy {
  SEMANTIC = 'SEMANTIC',
  KEYWORD = 'KEYWORD',
  HYBRID = 'HYBRID'
}

export enum PromptStrategy {
  PRECISE_LEGAL = 'PRECISE_LEGAL',
  CONCISE_DIRECT = 'CONCISE_DIRECT',
  DETAILED_EXPLANATORY = 'DETAILED_EXPLANATORY'
}

export interface FeedbackRecord {
  id: string;
  userId: string;
  queryText: string;
  answerId?: string;
  timestamp: string;
  
  // Feedback Parameters
  vote?: 'up' | 'down';
  rating?: number; // 1 to 5
  workflowId?: string;
  workflowStatus?: 'COMPLETED' | 'ABANDONED' | 'FAILED';
  approvedCitations?: Array<{ citationId: string; approved: boolean }>;
  toolsExecuted?: Array<{ toolName: string; success: boolean }>;
}

export interface UserLearningProfile {
  userId: string;
  preferredLanguage: 'ku' | 'ar' | 'en';
  domainWeights: Record<KnowledgeDomain, number>;
  commonIntents: Record<string, number>;
  successfulWorkflows: string[];
  frequentlyApprovedCitations: Record<string, number>; // DocId -> times approved
  lastActive: string;
}

export interface RetrievalMetrics {
  strategy: RetrievalStrategy;
  callsCount: number;
  avgRelevanceScore: number;
  userPositiveVotes: number;
  userNegativeVotes: number;
  totalRatingsSum: number;
  ratingsCount: number;
  retrievalSuccessScore: number; // 0.0 to 1.0
}

export interface PromptMetrics {
  strategy: PromptStrategy;
  usageCount: number;
  positiveFeedbackCount: number;
  negativeFeedbackCount: number;
  sumRatings: number;
  ratingsCount: number;
  confidenceAccuracySum: number; // Sum of abs(generatedConfidence - feedbackRatingNormalized)
  avgAnswerQuality: number; // 0.0 to 1.0
}

export interface LearningMemoryRecord {
  id: string;
  query: string;
  answerText: string;
  confidenceScore: number;
  domain: KnowledgeDomain;
  successfulDecisions: string[];
  workflowOutcome?: 'COMPLETED' | 'ABANDONED' | 'FAILED';
  validatedCitations: string[];
  thumbsUpCount: number;
  thumbsDownCount: number;
  savedAt: string;
}

export interface LearningAuditRecord {
  id: string;
  eventType: 'OPTIMIZATION_EVENT' | 'RANKING_CHANGE' | 'CONFIDENCE_ADJUSTMENT' | 'MEMORY_UPDATE';
  module: string;
  description: string;
  details: Record<string, any>;
  timestamp: string;
}
