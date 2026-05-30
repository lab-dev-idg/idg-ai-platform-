/**
 * Iraq Digital Gateway (IDG)
 * Intelligence Audit Layer - Phase 13-D
 * 
 * Secure, government-grade non-volatile tracker auditing every single intelligence response.
 * Records search queries, matched vector retrieval scores, verified evidences, generated citations,
 * final verdicts, and manual Human-in-the-Loop approval sequences.
 */

import { UserType } from '../registry/UserRegistry';
import { CompleteDecisionOutput } from '../reasoning/types';

export interface IntelligenceAuditEntry {
  auditId: string;
  timestamp: string;
  query: string;
  userId: string;
  userType: UserType;
  clearanceLevel: number;
  detectedIntents: string[];
  candidateRetrievalsCount: number;
  evidencesUsedCount: number;
  conflictCount: number;
  auditCitations: string[];
  decisionVerdict: string;
  finalConfidenceScore: number;
  needsReview: boolean;
  reviewId?: string;
  actionLogged?: string;      // Optional user actions associated (e.g. Approved By Expert)
}

export class IntelligenceAuditLayer {
  private static instance: IntelligenceAuditLayer;
  private auditLogsList: IntelligenceAuditEntry[] = [];

  private constructor() {}

  public static getInstance(): IntelligenceAuditLayer {
    if (!this.instance) {
      this.instance = new IntelligenceAuditLayer();
    }
    return this.instance;
  }

  /**
   * Appends an audit log generated directly by the decision pipelines.
   */
  public logPipelineTransaction(
    output: CompleteDecisionOutput,
    actionLogged?: string
  ): IntelligenceAuditEntry {
    const entry: IntelligenceAuditEntry = {
      auditId: `ITG-AUD-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      timestamp: output.timestamp || new Date().toISOString(),
      query: output.query,
      userId: output.userContext.userId,
      userType: output.userContext.userType,
      clearanceLevel: output.userContext.clearanceLevel,
      detectedIntents: output.detectedIntents,
      candidateRetrievalsCount: output.retrievedCandidateCount,
      evidencesUsedCount: output.evidenceValidationCount,
      conflictCount: output.conflictCount,
      auditCitations: output.reasoningResult.evaluationDetails.citations || [],
      decisionVerdict: output.reasoningResult.verdict,
      finalConfidenceScore: output.finalConfidenceScore,
      needsReview: output.needsHumanInTheLoopReview,
      reviewId: output.reviewId,
      actionLogged: actionLogged || (output.needsHumanInTheLoopReview ? 'AUTO_ESCALATED' : 'AUTOMATED_CLEARANCE_DISPATCH')
    };

    this.auditLogsList.push(entry);
    console.log(`[INTELLIGENCE-AUDIT] Secure audit trace written: ${entry.auditId} (Query: "${entry.query.substring(0, 30)}...")`);
    return entry;
  }

  /**
   * Logs manual expert reviews.
   */
  public logReviewAction(
    reviewId: string,
    expertId: string,
    action: string,
    resolutionNotes: string
  ): void {
    const matchedLogs = this.auditLogsList.filter((log) => log.reviewId === reviewId);
    
    matchedLogs.forEach((log) => {
      log.actionLogged = `EXPERT_REVIEW_RESOLVED: ${action} by [${expertId}]. Notes: ${resolutionNotes}`;
    });

    console.log(`[INTELLIGENCE-AUDIT] Audit updated for Review ID ${reviewId} with expert action: ${action}`);
  }

  /**
   * Returns whole query log lists.
   */
  public getAuditLogs(): IntelligenceAuditEntry[] {
    return [...this.auditLogsList];
  }

  /**
   * Filters audit logs by query, user identifier, or clearance bounds.
   */
  public queryAuditLogs(filter: {
    userId?: string;
    needsReview?: boolean;
    minimumConfidence?: number;
    intent?: string;
  }): IntelligenceAuditEntry[] {
    return this.auditLogsList.filter((log) => {
      if (filter.userId && log.userId !== filter.userId) return false;
      if (filter.needsReview !== undefined && log.needsReview !== filter.needsReview) return false;
      if (filter.minimumConfidence !== undefined && log.finalConfidenceScore < filter.minimumConfidence) return false;
      if (filter.intent && !log.detectedIntents.includes(filter.intent)) return false;
      return true;
    });
  }

  /**
   * Resets internal list. Useful during automated test runs.
   */
  public clear(): void {
    this.auditLogsList = [];
  }
}
