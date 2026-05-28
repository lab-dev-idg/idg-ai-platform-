/**
 * Iraq Digital Gateway (IDG)
 * National Knowledge Brain - Semantic Embedding Core Types
 * 
 * Strict typing for embedding ingestion pipelines, dimension definitions,
 * and multi-vendor provider wrappers supporting zero vendor lock-in.
 */

export enum EmbeddingProvider {
  GEMINI = 'GEMINI',
  VERTEX = 'VERTEX',
  OPENAI = 'OPENAI',
  LOCAL = 'LOCAL'
}

export interface EmbeddingVector {
  values: number[];
  dimension: number;
}

export interface EmbeddingRequest {
  provider: EmbeddingProvider;
  contents: string[];
  model?: string;
  dimensions?: number; // Optional target dimensions (e.g. for Matryoshka models)
  language?: 'ku' | 'ar' | 'en' | 'multilingual';
}

export interface EmbeddingResponse {
  provider: EmbeddingProvider;
  model: string;
  embeddings: EmbeddingVector[];
  dimension: number;
  tokenCount?: number;
  computeMs?: number;
}

export interface EmbeddingProviderConfig {
  apiKey?: string;
  endpointUrl?: string;
  modelVersion: string;
  timeoutMs: number;
}
