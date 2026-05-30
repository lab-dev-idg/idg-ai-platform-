/**
 * Iraq Digital Gateway (IDG)
 * Phase 13-F: Adaptive Learning & Feedback Intelligence - Feedback Collection Engine
 */

import { db, collection, addDoc, serverTimestamp } from '../../firebase';
import { FeedbackRecord, RetrievalStrategy, PromptStrategy } from './types';
import { KnowledgeDomain } from '../knowledge/types';
import { LearningProfile } from './LearningProfile';
import { RetrievalOptimizer } from './RetrievalOptimizer';
import { PromptOptimizer } from './PromptOptimizer';
import { LearningMemory } from './LearningMemory';
import { LearningAudit } from './LearningAudit';

export class FeedbackEngine {
  private static instance: FeedbackEngine;
  private localFeedbackLogs: FeedbackRecord[] = [];

  private profileEngine = LearningProfile.getInstance();
  private retrievalOptimizer = RetrievalOptimizer.getInstance();
  private promptOptimizer = PromptOptimizer.getInstance();
  private memoryEngine = LearningMemory.getInstance();
  private audit = LearningAudit.getInstance();

  private constructor() {}

  public static getInstance(): FeedbackEngine {
    if (!this.instance) {
      this.instance = new FeedbackEngine();
    }
    return this.instance;
  }

  /**
   * Registers, normalizes, and propagates multi-channel feedback across the adaptive pipeline.
   */
  public async submitFeedback(
    feedback: Omit<FeedbackRecord, 'id' | 'timestamp'>,
    context?: {
      retrievalStrategy?: RetrievalStrategy;
      promptStrategy?: PromptStrategy;
      domain?: KnowledgeDomain;
      answerText?: string;
      confidenceScore?: number;
      decisions?: string[];
    }
  ): Promise<string> {
    const id = `FDB-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const timestamp = new Date().toISOString();

    const record: FeedbackRecord = {
      id,
      timestamp,
      ...feedback
    };

    this.localFeedbackLogs.push(record);
    if (this.localFeedbackLogs.length > 200) {
      this.localFeedbackLogs.shift();
    }

    // 1. Log Feedback to Audit Trail
    await this.audit.logEvent(
      'OPTIMIZATION_EVENT',
      'FeedbackEngine',
      `Collected feedback channel event: id ${id}. Vote: ${record.vote || 'N/A'}, Rating: ${record.rating || 'N/A'}`,
      { feedbackId: id, userId: record.userId }
    );

    // 2. Propagate to User Learning Profile
    try {
      await this.profileEngine.recordInteraction(record.userId, {
        domain: context?.domain,
        workflowId: record.workflowId,
        workflowSuccess: record.workflowStatus === 'COMPLETED',
        approvedCitationDocId: record.approvedCitations?.find(c => c.approved)?.citationId
      });
    } catch (err) {
      console.warn('[FEEDBACK-ENGINE] Failed updating learning profile:', err);
    }

    // 3. Propagate to Retrieval Strategy Optimizer
    if (context?.retrievalStrategy) {
      try {
        await this.retrievalOptimizer.recordFeedback(context.retrievalStrategy, {
          vote: record.vote,
          rating: record.rating
        });
      } catch (err) {
        console.warn('[FEEDBACK-ENGINE] Failed updating retrieval optimizer:', err);
      }
    }

    // 4. Propagate to Prompt Quality Optimizer
    if (context?.promptStrategy) {
      try {
        await this.promptOptimizer.recordFeedback(context.promptStrategy, {
          vote: record.vote,
          rating: record.rating,
          generatedConfidence: context.confidenceScore
        });
      } catch (err) {
        console.warn('[FEEDBACK-ENGINE] Failed updating prompt optimizer:', err);
      }
    }

    // 5. Commit Highly-Approved Solutions into Long-Term Memory
    const isHighlyApproved = record.vote === 'up' || (record.rating !== undefined && record.rating >= 4);
    if (isHighlyApproved && context?.answerText && context?.confidenceScore !== undefined) {
      try {
        const validatedCitationsList = record.approvedCitations 
          ? record.approvedCitations.filter(c => c.approved).map(c => c.citationId)
          : [];

        await this.memoryEngine.commitMemory({
          query: record.queryText,
          answerText: context.answerText,
          confidenceScore: context.confidenceScore,
          domain: context.domain || KnowledgeDomain.GENERAL,
          successfulDecisions: context.decisions || [],
          workflowOutcome: record.workflowStatus,
          validatedCitations: validatedCitationsList,
          thumbsUpCount: record.vote === 'up' ? 1 : 0,
          thumbsDownCount: record.vote === 'down' ? 1 : 0
        });
      } catch (err) {
        console.warn('[FEEDBACK-ENGINE] Failed committing high score answers to memory:', err);
      }
    }

    // 6. Write Normalized Feedback Record to Firestore
    try {
      await addDoc(collection(db, 'feedback_logs'), {
        ...record,
        retrievalStrategy: context?.retrievalStrategy || null,
        promptStrategy: context?.promptStrategy || null,
        domain: context?.domain || null,
        createdServerTimestamp: serverTimestamp()
      });
    } catch (err) {
      console.warn(`[FEEDBACK-ENGINE] Cloud registry save failed. Preserved local entry: ${id}`, err);
    }

    return id;
  }

  /**
   * Evaluates active feedback records locally.
   */
  public getLogs(): FeedbackRecord[] {
    return [...this.localFeedbackLogs];
  }
}
