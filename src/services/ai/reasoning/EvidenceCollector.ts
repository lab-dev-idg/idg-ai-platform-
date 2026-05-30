/**
 * Iraq Digital Gateway (IDG)
 * Enterprise Advanced Reasoning - Evidence Collection Engine
 * 
 * Aggregates, normalizes, and deduplicates retrieved evidence chunks from standard 
 * databases, semantic search services, and native memory indexes under strict clearance constraints.
 */

import { KnowledgeRetrievalService } from '../knowledge/KnowledgeRetrievalService';
import { SemanticRetrievalService, SecuritySessionContext } from '../knowledge/SemanticRetrievalService';
import { VectorStore } from '../knowledge/VectorStore';
import { KnowledgeRegistry } from '../knowledge/KnowledgeRegistry';
import { UserType } from '../registry/UserRegistry';
import { KnowledgeClassification, KnowledgeDomain } from '../knowledge/types';
import {
  EvidenceRecord,
  EvidenceBundle,
  EvidenceSourceChain
} from './types';

export class EvidenceCollector {
  private static instance: EvidenceCollector;

  private knowledgeRegistry = KnowledgeRegistry.getInstance();
  private knowledgeRetrieval = KnowledgeRetrievalService.getInstance();
  private semanticRetrieval = SemanticRetrievalService.getInstance();
  private vectorStore = VectorStore.getInstance();

  private constructor() {}

  public static getInstance(): EvidenceCollector {
    if (!this.instance) {
      this.instance = new EvidenceCollector();
    }
    return this.instance;
  }

  /**
   * Aggregates intelligence chunks from multiple query vectors and indexes.
   */
  public async collectEvidence(
    queryText: string,
    session: { userId: string; userType: UserType; clearanceLevel: number },
    options?: { domain?: KnowledgeDomain; limit?: number; language?: string }
  ): Promise<EvidenceBundle> {
    const limit = options?.limit || 5;
    const domain = options?.domain;

    const securityCtx: SecuritySessionContext = {
      userId: session.userId,
      userType: session.userType,
      clearanceLevel: session.clearanceLevel
    };

    let semanticMatches: any[] = [];
    try {
      const semanticRes = await this.semanticRetrieval.hybridRetrieve(queryText, securityCtx, {
        limit: limit * 2,
        domain,
        language: options?.language
      });
      semanticMatches = semanticRes.matches;
    } catch (err) {
      console.warn('[EVIDENCE-COLLECTOR] Semantic search error:', err);
    }

    let registryMatches: any[] = [];
    try {
      registryMatches = await this.knowledgeRetrieval.retrieveActiveKnowledge(
        queryText,
        session.userType,
        {
          domain,
          language: options?.language as any
        },
        session.clearanceLevel
      );
    } catch (err) {
      console.warn('[EVIDENCE-COLLECTOR] Registry search error:', err);
    }

    const records: EvidenceRecord[] = [];

    // Normalize Semantic Matches
    for (const match of semanticMatches) {
      const meta = this.knowledgeRegistry.getDocumentMetadata(match.documentId);
      const trustScore = meta?.trustScore || match.score || 0.8;
      const authority = meta?.issuingAuthority || 'Iraqi Port Authority';

      const sourceChain: EvidenceSourceChain = {
        originType: 'SEMANTIC_VECTOR',
        documentId: match.documentId,
        chunkId: match.chunkId,
        classification: match.classification,
        authority,
        rawSource: match.source || meta?.source || 'Semantic Vector Index',
        trustScore
      };

      records.push({
        id: `EV-SEM-${match.chunkId || Math.random().toString(36).substr(2, 9)}`,
        chunkId: match.chunkId,
        documentId: match.documentId,
        text: match.content,
        citation: match.citation || meta?.title || 'National Knowledge Base',
        classification: match.classification,
        domain: match.domain,
        trustScore,
        relevance: match.score,
        sourceChain,
        metadata: meta || undefined
      });
    }

    // Normalize Registry Matches
    for (const match of registryMatches) {
      const chunk = match.chunk;
      const meta = this.knowledgeRegistry.getDocumentMetadata(chunk.documentId);
      const trustScore = meta?.trustScore || 0.85;
      const authority = meta?.issuingAuthority || 'Iraqi Regulatory Body';

      const sourceChain: EvidenceSourceChain = {
        originType: 'KNOWLEDGE_REGISTRY',
        documentId: chunk.documentId,
        chunkId: chunk.id,
        classification: chunk.classification || meta?.classification || KnowledgeClassification.PUBLIC,
        authority,
        rawSource: meta?.source || 'National Knowledge Registry',
        trustScore
      };

      records.push({
        id: `EV-REG-${chunk.id}`,
        chunkId: chunk.id,
        documentId: chunk.documentId,
        text: chunk.content,
        citation: chunk.chunkCitations[0] || meta?.title || 'Statutory Gazette Reference',
        classification: chunk.classification || meta?.classification || KnowledgeClassification.PUBLIC,
        domain: chunk.domain || meta?.domain || KnowledgeDomain.GENERAL,
        trustScore,
        relevance: match.score,
        sourceChain,
        metadata: meta || undefined
      });
    }

    // Deduplicate on chunkId, keeping highest relevance * trustScore
    const cleanMap = new Map<string, EvidenceRecord>();
    for (const record of records) {
      const key = record.chunkId;
      const existing = cleanMap.get(key);
      const score = record.trustScore * record.relevance;
      const existingScore = existing ? (existing.trustScore * existing.relevance) : 0;

      if (!existing || score > existingScore) {
        cleanMap.set(key, record);
      }
    }

    const uniqueRecords = Array.from(cleanMap.values())
      .sort((a, b) => (b.trustScore * b.relevance) - (a.trustScore * a.relevance))
      .slice(0, limit);

    // Metadata analysis
    let sumTrust = 0;
    let maxClassification = KnowledgeClassification.PUBLIC;
    for (const item of uniqueRecords) {
      sumTrust += item.trustScore;
      if (this.getClassificationTier(item.classification) > this.getClassificationTier(maxClassification)) {
        maxClassification = item.classification;
      }
    }

    const averageTrustScore = uniqueRecords.length > 0 ? parseFloat((sumTrust / uniqueRecords.length).toFixed(4)) : 0.0;

    return {
      id: `BUNDLE-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      query: queryText,
      records: uniqueRecords,
      aggregatedAt: new Date().toISOString(),
      totalCount: uniqueRecords.length,
      maxClassification,
      averageTrustScore
    };
  }

  private getClassificationTier(classification: KnowledgeClassification): number {
    switch (classification) {
      case KnowledgeClassification.PUBLIC: return 0;
      case KnowledgeClassification.INTERNAL: return 1;
      case KnowledgeClassification.RESTRICTED: return 2;
      case KnowledgeClassification.CONFIDENTIAL: return 3;
      case KnowledgeClassification.SECRET: return 4;
      default: return 0;
    }
  }
}
