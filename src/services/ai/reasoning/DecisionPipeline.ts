/**
 * Iraq Digital Gateway (IDG)
 * National Knowledge Brain - Decision Pipeline Core
 * 
 * Coordinates the multi-stage AI reasoning flow: Intent Detection -> Gated Retrieval -> 
 * Evidence Validation -> Reasoning -> Confidence Scoring -> Human-in-the-Loop Routing.
 */

import { UserType } from '../registry/UserRegistry';
import { KnowledgeDomain, KnowledgeClassification } from '../knowledge/types';
import { SemanticRetrievalService, SecuritySessionContext } from '../knowledge/SemanticRetrievalService';
import { EvidenceValidator } from './EvidenceValidator';
import { ReasoningEngine } from './ReasoningEngine';
import { SovereignTrustEngine } from '../sovereign/SovereignTrustEngine';
import { IntelligenceAuditLayer } from '../sovereign/IntelligenceAuditLayer';
import {
  ReasoningType,
  ReasoningContext,
  CompleteDecisionOutput,
  HumanReviewTask
} from './types';

export class DecisionPipeline {
  private static instance: DecisionPipeline;

  private retrievalService = SemanticRetrievalService.getInstance();
  private validator = EvidenceValidator.getInstance();
  private reasoningEngine = ReasoningEngine.getInstance();

  private activeTasks: Map<string, HumanReviewTask> = new Map();

  private constructor() {}

  public static getInstance(): DecisionPipeline {
    if (!this.instance) {
      this.instance = new DecisionPipeline();
    }
    return this.instance;
  }

  /**
   * Executes the full pipeline process for an incoming advisory query.
   */
  public async execute(
    queryText: string,
    session: { userId: string; userType: UserType; clearanceLevel: number }
  ): Promise<CompleteDecisionOutput> {
    const decisionId = `DEC-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const timestamp = new Date().toISOString();

    console.log(`[DECISION-PIPELINE] Booting decision ID: ${decisionId} for query: "${queryText}"`);

    // --- STEP 1: Intent Detection (Ontology Domain Matching) ---
    const detectedIntents: string[] = [];
    const normalizedQuery = queryText.toLowerCase();

    if (normalizedQuery.includes('exempt') || normalizedQuery.includes('duty') || normalizedQuery.includes('custom')) {
      detectedIntents.push('CUSTOMS_REGULATORY');
    }
    if (normalizedQuery.includes('tariff') || normalizedQuery.includes('fee') || normalizedQuery.includes('escrow')) {
      detectedIntents.push('TARIFF_COMPUTATION');
    }
    if (normalizedQuery.includes('hs code') || normalizedQuery.includes('digit') || normalizedQuery.includes('classification')) {
      detectedIntents.push('HS_CLASSIFICATION');
    }
    if (normalizedQuery.includes('compliance') || normalizedQuery.includes('aml') || normalizedQuery.includes('sanction') || normalizedQuery.includes('cbi')) {
      detectedIntents.push('CBI_COMPLIANCE');
    }
    if (normalizedQuery.includes('identity') || normalizedQuery.includes('moss') || normalizedQuery.includes('biometric')) {
      detectedIntents.push('IDENTITY_REGULATORY');
    }
    if (normalizedQuery.includes('basra') || normalizedQuery.includes('port') || normalizedQuery.includes('direction') || normalizedQuery.includes('logistics')) {
      detectedIntents.push('TRADE_INTELLIGENCE');
    }

    if (detectedIntents.length === 0) {
      detectedIntents.push('GENERAL_ADVISORY');
    }

    // Determine the primary ReasoningType to invoke
    let primaryType = ReasoningType.CUSTOMS;
    if (detectedIntents.includes('TARIFF_COMPUTATION')) primaryType = ReasoningType.TARIFF;
    else if (detectedIntents.includes('HS_CLASSIFICATION')) primaryType = ReasoningType.HS_CLASSIFICATION;
    else if (detectedIntents.includes('CBI_COMPLIANCE')) primaryType = ReasoningType.COMPLIANCE;
    else if (detectedIntents.includes('IDENTITY_REGULATORY')) primaryType = ReasoningType.REGULATORY;
    else if (detectedIntents.includes('TRADE_INTELLIGENCE')) primaryType = ReasoningType.TRADE_INTELLIGENCE;

    // Map Domain for Retrieval constraints
    let preferredDomain: KnowledgeDomain | undefined;
    if (primaryType === ReasoningType.CUSTOMS) preferredDomain = KnowledgeDomain.CUSTOMS;
    if (primaryType === ReasoningType.COMPLIANCE) preferredDomain = KnowledgeDomain.COMPLIANCE;
    if (primaryType === ReasoningType.TRADE_INTELLIGENCE) preferredDomain = KnowledgeDomain.TRADE;

    // --- STEP 2: Gated Retrieval ---
    const retrievalCtx: SecuritySessionContext = {
      userId: session.userId,
      userType: session.userType,
      clearanceLevel: session.clearanceLevel
    };

    const searchRes = await this.retrievalService.hybridRetrieve(queryText, retrievalCtx, {
      limit: 6,
      domain: preferredDomain
    });

    // --- STEP 3: Evidence Validation ---
    const verifiedEvidences = this.validator.validateMatches(searchRes.matches);

    // --- STEP 4: Contradiction Detection ---
    const conflicts = this.validator.detectContradictions(verifiedEvidences);

    // --- STEP 5: Knowledge Conflict Resolution ---
    const resolutionRes = this.validator.resolveConflicts(conflicts);
    if (resolutionRes.resolvedCount > 0) {
      console.log(`[DECISION-PIPELINE] Automatically resolved ${resolutionRes.resolvedCount} rules contradictions.`);
    }

    // --- STEP 6: Missing Evidence Detection ---
    const missingEvidence = this.validator.detectMissingEvidence(queryText, verifiedEvidences);

    // --- STEP 7: Reasoning Engine Execution ---
    const reasonCtx: ReasoningContext = {
      query: queryText,
      userType: session.userType,
      clearanceLevel: session.clearanceLevel,
      userId: session.userId
    };

    const evaluation = this.reasoningEngine.evaluate(
      primaryType,
      reasonCtx,
      verifiedEvidences,
      conflicts,
      missingEvidence
    );

    // --- STEP 8: Confidence Threshold and Human-in-the-Loop Check ---
    // If confidence score drops below 0.60 or there are unresolved contradictions, trigger Expert Escalation
    const needsReview = evaluation.confidenceScore < 0.60 || resolutionRes.unresolvedCount > 0;
    let reviewId: string | undefined;

    if (needsReview) {
      reviewId = `REV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const reviewTask: HumanReviewTask = {
        id: reviewId,
        decisionId,
        currentState: 'PENDING_REVIEW',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        reviewerNotes: `Triggered automatically: Confidence level is ${evaluation.confidenceScore}. Unresolved conflicts count: ${resolutionRes.unresolvedCount}.`
      };
      
      this.activeTasks.set(reviewId, reviewTask);
      console.log(`[SECURITY-GATING] Decision ${decisionId} routed to Expert Review Queue under state PENDING_REVIEW.`);
    }

    // --- STEP 8-D: Compute Sovereign Trust Layer Data (Phase 13-D) ---
    const trustEngine = SovereignTrustEngine.getInstance();
    const auditLayer = IntelligenceAuditLayer.getInstance();

    const sourceValidation: Array<{ sourceId: string; authority: string; trustScore: number; isAuthorityVerified: boolean }> = [];
    const evidenceValidationReport: Array<{ chunkId: string; citation: string; relevanceScore: number; freshnessScore: number; compositeTrustScore: number }> = [];
    const citationValidationReport: Array<{ citation: string; validatedSecureLineage: boolean; clearanceLevelRequired: string }> = [];

    let maxClassification = KnowledgeClassification.PUBLIC;

    for (const ev of verifiedEvidences) {
      // Analyze Trust
      const metrics = trustEngine.analyzeEvidenceTrust(ev, preferredDomain || KnowledgeDomain.GENERAL);
      
      // Look up metadata for issuing details
      const meta = trustEngine['registry'].getDocumentMetadata(ev.documentId);
      const authority = meta?.issuingAuthority || 'Unknown Administrative Authority';
      
      sourceValidation.push({
        sourceId: ev.documentId,
        authority,
        trustScore: metrics.sourceTrustScore,
        isAuthorityVerified: metrics.authorityVerified
      });

      evidenceValidationReport.push({
        chunkId: ev.chunkId,
        citation: ev.citation,
        relevanceScore: metrics.evidenceTrustScore,
        freshnessScore: metrics.freshnessScore,
        compositeTrustScore: metrics.compositeTrustScore
      });

      citationValidationReport.push({
        citation: ev.citation,
        validatedSecureLineage: metrics.compositeTrustScore > 0.70,
        clearanceLevelRequired: ev.classification
      });

      // Keep track of maximum classification accessed to enforce session compliance scoring
      const currLevel = trustEngine.getClassificationLevel(ev.classification);
      const maxLevel = trustEngine.getClassificationLevel(maxClassification);
      if (currLevel > maxLevel) {
        maxClassification = ev.classification;
      }
    }

    // Evaluate core permissions gate checks of the session against the highest document classification analyzed
    const permissionReport = trustEngine.evaluateAccess(
      maxClassification,
      session.userType,
      session.clearanceLevel
    );

    const sovereignIntelReport = {
      sourceValidation,
      evidenceValidation: evidenceValidationReport,
      citationValidation: citationValidationReport,
      permissionVerification: {
        isSessionAuthorized: permissionReport.permitted,
        userTypeChecked: permissionReport.userType,
        sessionClearance: permissionReport.clearanceLevel,
        maximumDocClassificationAssessed: maxClassification
      },
      governanceVerification: {
        signoffFlowEnforced: needsReview || maxClassification === KnowledgeClassification.CONFIDENTIAL || maxClassification === KnowledgeClassification.SECRET,
        requiresExpertLock: needsReview,
        complianceAuditedId: `COMP-AUD-${decisionId.split('-')[1]}`
      }
    };

    const finalOutput: CompleteDecisionOutput = {
      decisionId,
      timestamp,
      query: queryText,
      userContext: {
        userId: session.userId,
        userType: session.userType,
        clearanceLevel: session.clearanceLevel
      },
      detectedIntents,
      retrievedCandidateCount: searchRes.matches.length,
      evidenceValidationCount: verifiedEvidences.length,
      conflictCount: conflicts.length,
      reasoningResult: {
        verdict: evaluation.verdict,
        evaluationDetails: evaluation
      },
      finalConfidenceScore: evaluation.confidenceScore,
      needsHumanInTheLoopReview: needsReview,
      reviewId,
      sovereignIntelReport
    };

    // Commit to the Immutable Security Audit Trail Log
    auditLayer.logPipelineTransaction(finalOutput);

    return finalOutput;
  }

  /**
   * Retrieves active Human Review Tasks
   */
  public getReviewTask(reviewId: string): HumanReviewTask | undefined {
    return this.activeTasks.get(reviewId);
  }

  /**
   * Updates review action state (Expert Approvale Gate)
   */
  public processReview(
    reviewId: string,
    action: 'APPROVED' | 'REJECTED' | 'MODIFIED',
    expertId: string,
    notes?: string,
    overrideVerdict?: string
  ): boolean {
    const task = this.activeTasks.get(reviewId);
    if (!task) return false;

    task.currentState = action;
    task.assignedExpert = expertId;
    task.reviewerNotes = notes || task.reviewerNotes;
    task.resolvedVerdict = overrideVerdict;
    task.updatedAt = new Date().toISOString();

    // Commit review outcome change and sync intelligence logs
    IntelligenceAuditLayer.getInstance().logReviewAction(reviewId, expertId, action, notes || '');

    console.log(`[HUMAN-IN-THE-LOOP] Task ${reviewId} successfully processed: ${action} by expert ${expertId}.`);
    return true;
  }

  /**
   * Returns list of all review queues
   */
  public listReviewTasks(): HumanReviewTask[] {
    return Array.from(this.activeTasks.values());
  }
}
