/**
 * Iraq Digital Gateway (IDG)
 * National Knowledge Brain - Reasoning & Decision Pipeline Types
 * 
 * Defines the enterprise ontology, relationship schemas, reasoning contracts,
 * multi-stage pipeline containers, contradiction scores, and Human-in-the-Loop review queues.
 */

import { UserType } from '../registry/UserRegistry';
import { KnowledgeClassification, KnowledgeDomain } from '../knowledge/types';

/**
 * Knowledge Graph Relationship Types (Ontology Domain Model)
 */
export enum KnowledgeRelationType {
  AMENDS = 'AMENDS',             // Modifies parts of another regulation
  SUPERSEDES = 'SUPERSEDES',     // Completely replaces another regulation
  REFERS_TO = 'REFERS_TO',       // Cites or links to another piece of knowledge
  CONTRADICTS = 'CONTRADICTS',   // Direct conflict detected
  IMPLEMENTS = 'IMPLEMENTS',     // Operationalizes a law or decree
  EXEMPTS = 'EXEMPTS',           // Specifies exceptions to a general rule
  GOVERNS = 'GOVERNS'            // Exerts authority over an area or domain
}

/**
 * Knowledge Node Type in our Domain Ontology
 */
export enum KnowledgeNodeType {
  LAW = 'LAW',
  DECREE = 'DECREE',
  TREATY = 'TREATY',
  REGULATION = 'REGULATION',
  CIRCULAR = 'CIRCULAR',
  OPERATIONAL_PROCEDURE = 'OPERATIONAL_PROCEDURE',
  TARIFF_SCHEDULE = 'TARIFF_SCHEDULE',
  COMPLIANCE_RULE = 'COMPLIANCE_RULE'
}

/**
 * Entity/Concept Node in the National Knowledge Graph
 */
export interface KnowledgeNode {
  id: string;
  type: KnowledgeNodeType;
  title: string;
  domain: KnowledgeDomain;
  classification: KnowledgeClassification;
  authority: string;
  metadata: Record<string, any>;
}

/**
 * Edge connecting nodes in the National Knowledge Graph
 */
export interface KnowledgeRelationship {
  sourceId: string;
  targetId: string;
  type: KnowledgeRelationType;
  establishedBy: string; // Document ID or context asserting this relationship
  active: boolean;
  notes?: string;
}

/**
 * Pluggable Reasoning Tasks
 */
export enum ReasoningType {
  CUSTOMS = 'CUSTOMS',
  REGULATORY = 'REGULATORY',
  TARIFF = 'TARIFF',
  HS_CLASSIFICATION = 'HS_CLASSIFICATION',
  COMPLIANCE = 'COMPLIANCE',
  TRADE_INTELLIGENCE = 'TRADE_INTELLIGENCE'
}

/**
 * Evaluation context for the Reasoning Engine
 */
export interface ReasoningContext {
  query: string;
  userType: UserType;
  clearanceLevel: number;
  userId: string;
  sessionToken?: string;
  dynamicDirectives?: string[]; // Optional user/operator parameters
}

/**
 * Individual Evidence item scrutinized from retrieval blocks
 */
export interface VerifiedEvidence {
  chunkId: string;
  documentId: string;
  citation: string;
  text: string;
  classification: KnowledgeClassification;
  domain: KnowledgeDomain;
  reliability: number; // 0.0 to 1.0 based on authority trust
  relevance: number;   // 0.0 to 1.0 similarity/weight matching
  veracityScore: number; // 0.0 to 1.0 validated against core gazettes
}

/**
 * Discrepancy analysis or logical paradox detected across retrieval blocks
 */
export interface ReasoningConflict {
  id: string;
  governingDocId: string;
  contradictingDocId: string;
  conflictType: 'DIRECT_RULE_CLASH' | 'AMENDMENT_LAG' | 'EXEMPTION_CONFUSION' | 'AUTHORITY_OVERLAP';
  description: string;
  resolutionStrategy: 'LATEST_DATE_PREVAILS' | 'HIGHER_AUTHORITY' | 'EXEMPTION_APPLIED' | 'ESCALATE_TO_EXPERT';
  resolvedScore: number; // 0.0 to 1.0 confidence in the automatic resolution
}

/**
 * Structured reasoning response containing logical evaluation and citation trails
 */
export interface ReasoningEvaluation {
  type: ReasoningType;
  logicalSteps: string[];
  verdict: string;
  suggestedAction?: string;
  confidenceScore: number; // 0.00 to 1.00 index
  citations: string[];
  conflictsDetected: ReasoningConflict[];
  missingEvidenceCount: number;
  missingEvidenceDetails: string[];
}

/**
 * Multi-Stage Pipeline Tracking Structure containing step-by-step diagnostic information
 */
export interface CompleteDecisionOutput {
  decisionId: string;
  timestamp: string;
  query: string;
  userContext: {
    userId: string;
    userType: UserType;
    clearanceLevel: number;
  };
  detectedIntents: string[];
  retrievedCandidateCount: number;
  evidenceValidationCount: number;
  conflictCount: number;
  reasoningResult: {
    verdict: string;
    evaluationDetails: ReasoningEvaluation;
  };
  finalConfidenceScore: number; // Final weighted pipeline score
  needsHumanInTheLoopReview: boolean; // Triggers escape gate
  reviewId?: string;

  // Phase 13-D Sovereign Security & High-Trust Metadata Metrics
  sovereignIntelReport?: {
    sourceValidation: Array<{
      sourceId: string;
      authority: string;
      trustScore: number;
      isAuthorityVerified: boolean;
    }>;
    evidenceValidation: Array<{
      chunkId: string;
      citation: string;
      relevanceScore: number;
      freshnessScore: number;
      compositeTrustScore: number;
    }>;
    citationValidation: Array<{
      citation: string;
      validatedSecureLineage: boolean;
      clearanceLevelRequired: string;
    }>;
    permissionVerification: {
      isSessionAuthorized: boolean;
      userTypeChecked: UserType;
      sessionClearance: number;
      maximumDocClassificationAssessed: string;
    };
    governanceVerification: {
      signoffFlowEnforced: boolean;
      requiresExpertLock: boolean;
      complianceAuditedId: string;
    };
  };
}

/**
 * Human-in-the-Loop review schema for legal/customs reviews and escalations
 */
export interface HumanReviewTask {
  id: string;
  decisionId: string;
  currentState: 'PENDING_REVIEW' | 'EXPERT_ASSIGNED' | 'APPROVED' | 'REJECTED' | 'MODIFIED';
  assignedExpert?: string;
  rejectionReason?: string;
  reviewerNotes?: string;
  escalatedToMinistry?: string;
  resolvedVerdict?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Phase 13-E Advanced Citation & Reasoning Interfaces
 */

export enum CitationFormat {
  SHORT = 'SHORT',
  STANDARD = 'STANDARD',
  LEGAL = 'LEGAL',
  TECHNICAL = 'TECHNICAL',
  GOVERNMENT = 'GOVERNMENT'
}

export interface Citation {
  id: string;
  text: string;
  documentId: string;
  chunkId?: string;
  format: CitationFormat;
  readableReference: string;
  lineage: string[];
}

export interface EvidenceSourceChain {
  originType: 'KNOWLEDGE_REGISTRY' | 'SEMANTIC_VECTOR' | 'IN_MEMORY_STORE' | 'VERTEX_AI' | 'VECTOR_DB';
  documentId: string;
  chunkId?: string;
  classification: KnowledgeClassification;
  authority: string;
  rawSource: string;
  trustScore: number;
}

export interface EvidenceRecord {
  id: string;
  chunkId: string;
  documentId: string;
  text: string;
  citation: string;
  classification: KnowledgeClassification;
  domain: KnowledgeDomain;
  trustScore: number;
  relevance: number;
  sourceChain: EvidenceSourceChain;
  metadata?: Record<string, any>;
}

export interface EvidenceBundle {
  id: string;
  query: string;
  records: EvidenceRecord[];
  aggregatedAt: string;
  totalCount: number;
  maxClassification: KnowledgeClassification;
  averageTrustScore: number;
}

export interface ReasoningResult {
  summary: string;
  findings: string[];
  confidenceScore: number;
  citations: Citation[];
  evidenceUsed: EvidenceRecord[];
  warnings: string[];
  unresolvedConflicts: ReasoningConflict[];
}

export interface TrustedAnswer {
  answer: string;
  confidenceScore: number;
  confidenceLabel: string;
  citations: Citation[];
  warnings: string[];
  evidenceCount: number;
  generatedAt: string;
}

export interface ConflictReport {
  id: string;
  conflicts: ReasoningConflict[];
  resolvedConflicts: Array<{
    conflictId: string;
    resolvedBy: string; // Strategy name
    winningDocId: string;
    losingDocId: string;
    explanation: string;
  }>;
  unresolvedConflicts: ReasoningConflict[];
  auditTimestamp: string;
}

