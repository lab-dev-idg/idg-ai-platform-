/**
 * Iraq Digital Gateway (IDG)
 * Phase 13-F: Adaptive Learning & Feedback Intelligence - Memory Integration Layer
 */

import { db, collection, addDoc, serverTimestamp } from '../../firebase';
import { LearningMemoryRecord } from './types';
import { KnowledgeDomain } from '../knowledge/types';
import { LearningAudit } from './LearningAudit';

export class LearningMemory {
  private static instance: LearningMemory;
  private localMemories: LearningMemoryRecord[] = [];
  private audit = LearningAudit.getInstance();

  private constructor() {}

  public static getInstance(): LearningMemory {
    if (!this.instance) {
      this.instance = new LearningMemory();
    }
    return this.instance;
  }

  /**
   * Commits a successful operational brain trace into the sovereign brain memory index.
   */
  public async commitMemory(
    record: Omit<LearningMemoryRecord, 'id' | 'savedAt'>
  ): Promise<string> {
    const id = `MEM-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const savedAt = new Date().toISOString();

    const fullRecord: LearningMemoryRecord = {
      id,
      savedAt,
      ...record
    };

    this.localMemories.push(fullRecord);
    if (this.localMemories.length > 200) {
      this.localMemories.shift();
    }

    await this.audit.logEvent(
      'MEMORY_UPDATE',
      'LearningMemory',
      `Committed compliance brain segment for query topic: "${record.query.substring(0, 50)}..."`,
      { memoryId: id, domains: record.domain, citationCount: record.validatedCitations.length }
    );

    try {
      await addDoc(collection(db, 'learning_memories'), {
        ...fullRecord,
        createdServerTimestamp: serverTimestamp()
      });
    } catch (err) {
      console.warn(`[LEARNING-MEMORY] Failed to persist memory footprint in cloud registry. Cached locally.`, err);
    }

    return id;
  }

  /**
   * Scans existing approved memories to retrieve matches for the incoming inquiry.
   */
  public findMatch(queryText: string, domain?: KnowledgeDomain): LearningMemoryRecord | null {
    const textLower = queryText.toLowerCase().trim();
    
    // Simple robust keyword match as local RAG fallback
    const matches = this.localMemories.filter((mem) => {
      if (domain && mem.domain !== domain) return false;
      const memQuery = mem.query.toLowerCase();
      
      // Compute direct term similarity
      const queryTerms = textLower.split(/\s+/).filter(t => t.length > 3);
      if (queryTerms.length === 0) return memQuery.includes(textLower);
      
      const overlap = queryTerms.filter(term => memQuery.includes(term));
      const overlapRatio = overlap.length / queryTerms.length;
      return overlapRatio >= 0.75; // 75% term similarity threshold
    });

    if (matches.length === 0) return null;

    // Return memory record with the highest confidence value + satisfaction rating
    return matches.sort((a, b) => {
      const scoreA = a.confidenceScore + (a.thumbsUpCount * 0.1) - (a.thumbsDownCount * 0.15);
      const scoreB = b.confidenceScore + (b.thumbsUpCount * 0.1) - (b.thumbsDownCount * 0.15);
      return scoreB - scoreA;
    })[0];
  }

  /**
   * Tallies the validated history count of a specific document citation.
   */
  public getCitationValidationHistory(documentId: string): { approved: number; total: number } {
    let approved = 0;
    let total = 0;

    this.localMemories.forEach((mem) => {
      if (mem.validatedCitations.includes(documentId)) {
        total++;
        if (mem.thumbsUpCount > mem.thumbsDownCount) {
          approved++;
        }
      }
    });

    return { approved, total };
  }

  /**
   * Fetches full in-memory cache of saved memories.
   */
  public getMemories(): LearningMemoryRecord[] {
    return [...this.localMemories];
  }
}
