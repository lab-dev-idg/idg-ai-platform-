/**
 * Iraq Digital Gateway (IDG)
 * National Knowledge Brain - Vector Store Abstraction
 * 
 * Defines the storage-agnostic Vector Store interface and implements a 
 * robust, in-memory local vector database supporting high-performance
 * cosine-similarity projections, batch operations, and security-aware filters.
 */

export interface VectorEntity<P = any> {
  id: string;
  vector: number[];
  payload: P;
  timestamp: string;
}

export interface VectorQueryResult<P = any> {
  id: string;
  score: number; // Cosine similarity: 0.00 to 1.00
  entity: VectorEntity<P>;
}

export interface VectorQueryOptions {
  limit?: number;
  minimumSimilarity?: number;
  filterAttributes?: Record<string, any>;
}

/**
 * Standard Storage Abstraction - Zero Vendor Lock-in (Step 3)
 */
export interface IVectorStore {
  upsertVector(id: string, vector: number[], payload: any): Promise<boolean>;
  deleteVector(id: string): Promise<boolean>;
  querySimilar(vector: number[], options?: VectorQueryOptions): Promise<VectorQueryResult[]>;
  batchInsert(items: { id: string; vector: number[]; payload: any }[]): Promise<number>;
}

export class InMemoryVectorStore implements IVectorStore {
  private store: Map<string, VectorEntity> = new Map();

  /**
   * Helper to perform high-resolution cosine similarity equation between two normalized tensors:
   * A • B / (||A|| * ||B||)
   */
  public static calculateCosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) return 0.0;
    
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    const divisor = Math.sqrt(normA) * Math.sqrt(normB);
    if (divisor === 0) return 0.0;

    return parseFloat((dotProduct / divisor).toFixed(4));
  }

  public async upsertVector(id: string, vector: number[], payload: any): Promise<boolean> {
    this.store.set(id, {
      id,
      vector,
      payload,
      timestamp: new Date().toISOString()
    });
    return true;
  }

  public async deleteVector(id: string): Promise<boolean> {
    return this.store.delete(id);
  }

  public async querySimilar(
    vector: number[],
    options?: VectorQueryOptions
  ): Promise<VectorQueryResult[]> {
    const { limit = 5, minimumSimilarity = 0.1, filterAttributes } = options || {};
    const results: VectorQueryResult[] = [];

    for (const [id, entity] of this.store.entries()) {
      // Calculate semantic similarity space Match
      const similarity = InMemoryVectorStore.calculateCosineSimilarity(vector, entity.vector);

      if (similarity < minimumSimilarity) continue;

      // Filter matches by attributes if filters are passed
      if (filterAttributes) {
        let isMatch = true;
        for (const [key, val] of Object.entries(filterAttributes)) {
          if (entity.payload && entity.payload[key] !== val) {
            isMatch = false;
            break;
          }
        }
        if (!isMatch) continue;
      }

      results.push({
        id,
        score: similarity,
        entity
      });
    }

    // Sort descending by similarity match
    return results.sort((a, b) => b.score - a.score).slice(0, limit);
  }

  public async batchInsert(items: { id: string; vector: number[]; payload: any }[]): Promise<number> {
    let count = 0;
    for (const item of items) {
      await this.upsertVector(item.id, item.vector, item.payload);
      count++;
    }
    return count;
  }

  /**
   * Diagnostic util to query total record count
   */
  public size(): number {
    return this.store.size;
  }

  /**
   * Clean index storage states
   */
  public clear(): void {
    this.store.clear();
  }
}

/**
 * Global instance for the active Gateway Vector Memory Core
 */
export class VectorStore {
  private static instance: InMemoryVectorStore;

  public static getInstance(): InMemoryVectorStore {
    if (!this.instance) {
      this.instance = new InMemoryVectorStore();
    }
    return this.instance;
  }
}
