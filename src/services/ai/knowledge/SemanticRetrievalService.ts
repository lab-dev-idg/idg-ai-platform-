/**
 * Iraq Digital Gateway (IDG)
 * National Knowledge Brain - Semantic Retrieval Service (Step 4 & 6)
 * 
 * Secure, sovereign search engine integrating multithreaded Vector indices,
 * natural language embedding transformations, security constraints, and structured audit logs.
 */

import { UserType } from '../registry/UserRegistry';
import { KnowledgeClassification, KnowledgeDomain, SEED_KNOWLEDGE_BASE } from './types';
import { EmbeddingEngine } from './embeddings/EmbeddingEngine';
import { EmbeddingProvider } from './embeddings/types';
import { VectorStore } from './VectorStore';
import { DocumentIngester } from './DocumentIngester';

export interface SemanticMatch {
  chunkId: string;
  documentId: string;
  content: string;
  score: number; // Hybrid Match: 0.00 to 1.00
  semanticSimilarity: number;
  keywordScore: number;
  domain: KnowledgeDomain;
  classification: KnowledgeClassification;
  source: string;
  language: 'ku' | 'ar' | 'en' | 'multilingual';
  citation: string;
}

export interface SecuritySessionContext {
  userId: string;
  userType: UserType;
  clearanceLevel: number;
}

export interface SemanticAuditLog {
  auditId: string;
  timestamp: string;
  userId: string;
  userType: UserType;
  queryText: string;
  matchedChunksCount: number;
  clearanceVerified: boolean;
  deniedAccessDocIds: string[];
}

export class SemanticRetrievalService {
  private static instance: SemanticRetrievalService;
  
  private embeddingEngine = EmbeddingEngine.getInstance();
  private vectorStore = VectorStore.getInstance();
  private auditHistory: SemanticAuditLog[] = [];

  private constructor() {
    // Standard initialization: Seed initial documents into vector indices automatically
    this.initialSeedIndex().catch(err => {
      console.error('[SEMANTIC-RETRIEVAL] Seed index failed:', err);
    });
  }

  public static getInstance(): SemanticRetrievalService {
    if (!this.instance) {
      this.instance = new SemanticRetrievalService();
    }
    return this.instance;
  }

  /**
   * Translates SEED collection into semantic structures on startup
   */
  private async initialSeedIndex(): Promise<void> {
    if (this.vectorStore.size() > 0) return;

    console.log('[SEMANTIC-RETRIEVAL] Cold-booting vector space index mapping with seed laws.');

    for (const doc of SEED_KNOWLEDGE_BASE) {
      const chunks = DocumentIngester.chunk(doc, 'LOGICAL_SECTION');
      
      for (const chunk of chunks) {
        // Embed the individual text fragments
        const embeddingRes = await this.embeddingEngine.generateEmbeddings({
          provider: EmbeddingProvider.GEMINI,
          contents: [chunk.content],
          model: 'gemini-embedding-2-preview'
        });

        const embeddingVector = embeddingRes.embeddings[0].values;

        // Upsert standard structural schema into vector registry index
        await this.vectorStore.upsertVector(chunk.id, embeddingVector, {
          chunkId: chunk.id,
          documentId: chunk.documentId,
          content: chunk.content,
          domain: doc.domain,
          classification: doc.metadata.classification,
          source: chunk.source,
          language: chunk.language,
          citation: chunk.chunkCitations[0] || doc.title
        });
      }
    }
    console.log(`[SEMANTIC-RETRIEVAL] Indexed ${this.vectorStore.size()} high-density vectors successfully.`);
  }

  /**
   * Hybrid semantic/keyword retrieve layer validating clearance levels before retrieval.
   * Asserts: Clearance Level (User) >= Classification Level (Document).
   */
  public async hybridRetrieve(
    queryText: string,
    context: SecuritySessionContext,
    options?: { limit?: number; domain?: KnowledgeDomain; language?: string }
  ): Promise<{ matches: SemanticMatch[]; audit: SemanticAuditLog }> {
    const { limit = 5, domain, language } = options || {};
    const auditId = `AUDIT-SR-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // Normalize language strings and extract lookup indicators
    const normalizedQuery = DocumentIngester.normalizeText(queryText, 'multilingual').toLowerCase();
    const queryParts = normalizedQuery.split(/\s+/).filter(word => word.length > 2);

    // Turn search terms into embeddings
    const embeddingRes = await this.embeddingEngine.generateEmbeddings({
      provider: EmbeddingProvider.GEMINI,
      contents: [queryText],
      model: 'gemini-embedding-2-preview'
    });
    const queryVector = embeddingRes.embeddings[0].values;

    // Fetch matching semantic projections from index databases
    const rawResults = await this.vectorStore.querySimilar(queryVector, {
      limit: 50 // Pull slightly wider candidate lists to allow filtering
    });

    const matches: SemanticMatch[] = [];
    const deniedDocIds: string[] = [];

    for (const res of rawResults) {
      const payload = res.entity.payload;
      const docClassification: KnowledgeClassification = payload.classification;

      // Map classifications to numeric clearance scores
      const classificationValue = this.getClassificationValue(docClassification);

      // Rule Evaluation: Check user clearance versus document clearance
      if (context.clearanceLevel < classificationValue) {
        deniedDocIds.push(payload.documentId);
        continue;
      }

      // Metadata Domain Filtering
      if (domain && payload.domain !== domain) {
        continue;
      }

      // Metadata Language Filtering
      if (language && payload.language !== language) {
        continue;
      }

      // Calculate Keyword density falls
      let keywordScore = 0;
      const chunkContent = payload.content.toLowerCase();
      
      for (const term of queryParts) {
        if (chunkContent.includes(term)) {
          keywordScore += 0.25;
        }
      }
      keywordScore = Math.min(1.0, keywordScore);

      // Perform unified score combination
      const semanticSimilarity = res.score; // Cosine similarity
      
      // Dynamic Hybrid Blend: 60% Semantic Vectors, 40% Keyword Hits
      const combinedScore = parseFloat((semanticSimilarity * 0.60 + keywordScore * 0.40).toFixed(4));

      matches.push({
        chunkId: payload.chunkId,
        documentId: payload.documentId,
        content: payload.content,
        score: combinedScore,
        semanticSimilarity,
        keywordScore,
        domain: payload.domain,
        classification: docClassification,
        source: payload.source,
        language: payload.language,
        citation: payload.citation
      });
    }

    // Sort ranked lists back to priority descending
    const rankedMatches = matches
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    // Save Security Audit trace indexes
    const auditRecord: SemanticAuditLog = {
      auditId,
      timestamp: new Date().toISOString(),
      userId: context.userId,
      userType: context.userType,
      queryText,
      matchedChunksCount: rankedMatches.length,
      clearanceVerified: true,
      deniedAccessDocIds: Array.from(new Set(deniedDocIds))
    };

    if (deniedDocIds.length > 0) {
      console.warn(`[SECURITY-WARN] Audit ${auditId}: Denied ${context.userType} (${context.userId}) retrieval to ${deniedDocIds.length} restricted files.`);
    }

    this.auditHistory.push(auditRecord);

    return {
      matches: rankedMatches,
      audit: auditRecord
    };
  }

  /**
   * Helper mapping enum tags to numeric indices to enforce clearance boundaries
   */
  private getClassificationValue(classification: KnowledgeClassification): number {
    switch (classification) {
      case KnowledgeClassification.PUBLIC: return 0;
      case KnowledgeClassification.INTERNAL: return 1;
      case KnowledgeClassification.RESTRICTED: return 2;
      case KnowledgeClassification.CONFIDENTIAL: return 3;
      case KnowledgeClassification.SECRET: return 4;
      default: return 0;
    }
  }

  /**
   * Retrieves audit records
   */
  public getAuditHistory(): SemanticAuditLog[] {
    return [...this.auditHistory];
  }
}
