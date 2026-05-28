/**
 * Iraq Digital Gateway (IDG)
 * Document Ingestion Abstract Model
 * 
 * Outlines the preprocessing pipelines, logical section grouping, multilingual
 * text normalization engines, and chunk formatting interfaces optimized for search indexes.
 */

import { KnowledgeDocument, DocumentMetadata } from './KnowledgeRegistry';

export type ChunkingStrategy =
  | 'LOGICAL_SECTION' // Splitting by Articles, Decrees, or markdown subsection headers
  | 'FIXED_TOKEN'     // Overlapping sliding token boundaries (e.g. 512-character blocks)
  | 'SENTENCE_WINDOW'; // Sentence semantic boundary markers

export interface IngestionChunk {
  id: string;
  documentId: string;
  sequenceNumber: number;
  content: string;
  characterCount: number;
  wordCount: number;
  language: 'ku' | 'ar' | 'en' | 'multilingual';
  tags: string[];
  classificationLevel: number;
  source: string;
  chunkCitations: string[];
}

export class DocumentIngester {
  /**
   * Cleanses raw text data to secure stable text matching and clean cross-lingual embeddings.
   * Standardizes characters specific to Arabic (Alif, Yaa, Taa Marbuta) and Kurdish (Keheh/Gaf/Vee).
   * 
   * @param rawText Dirty unformatted text strings
   * @param language Expected language of the document
   */
  public static normalizeText(rawText: string, language: 'ku' | 'ar' | 'en' | 'multilingual'): string {
    if (!rawText) return '';

    let text = rawText.trim();

    // 1. Resolve excessive duplicate spaces, system tab-markers, and carriage returns
    text = text.replace(/[\r\n\t]+/g, ' ');
    text = text.replace(/\s\s+/g, ' ');

    // 2. Perform specialized script-sensitive regularizations
    if (language === 'ar' || language === 'multilingual') {
      // Standardize Arabic Glyphs for normalized RAG tokenization
      text = text
        .replace(/[\u064B-\u0652]/g, '') // Strip Arabic diacritics/harakat
        .replace(/أ|إ|آ/g, 'ا')          // Normalize Alif variations
        .replace(/ة/g, 'ه')               // Standardize Taa Marbuta to Haa (for soft match)
        .replace(/ى/g, 'ي')               // Standardize Alif Maqsurah to Yaa
        .replace(/ئ|ؤ/g, 'ء');           // Standardize Hamza carriers
    }

    if (language === 'ku' || language === 'multilingual') {
      // Kurdish (Sorani/Kurmanji) Unicode standardizations
      text = text
        .replace(/ھ/g, 'ه')  // Normalize standard Kurdish Haa characters
        .replace(/ى/g, 'ی')  // Normalize Farsi/Kurdish Yea
        .replace(/ك/g, 'ک'); // Standardize Keheh types
    }

    return text.trim();
  }

  /**
   * Chunks a preprocessed document into discrete search slices following specified rules.
   */
  public static chunk(
    document: KnowledgeDocument,
    strategy: ChunkingStrategy = 'LOGICAL_SECTION'
  ): IngestionChunk[] {
    const normalizedContent = this.normalizeText(document.content, document.metadata.language);
    
    // In our abstract architectural template, we simulate chunking logic:
    const chunks: IngestionChunk[] = [];
    const baseId = document.id;

    if (strategy === 'LOGICAL_SECTION' && normalizedContent.includes('Article')) {
      // Split content into segments based on document clause sections or bullet delimiters
      const sections = normalizedContent.split(/(?=Article\s+\d+|Directive\s+\d+)/gi);
      
      sections.forEach((sect, index) => {
        const cleanedSect = sect.trim();
        if (cleanedSect.length > 10) {
          chunks.push({
            id: `${baseId}-CH-${index + 1}`,
            documentId: document.id,
            sequenceNumber: index + 1,
            content: cleanedSect,
            characterCount: cleanedSect.length,
            wordCount: cleanedSect.split(/\s+/).length,
            language: document.metadata.language,
            tags: [...document.metadata.tags, 'chunked-logical'],
            classificationLevel: document.metadata.classificationLevel,
            source: document.metadata.source,
            chunkCitations: [
              document.metadata.applicableLawArticle 
                ? `${document.title}, ${document.metadata.applicableLawArticle}`
                : document.title
            ]
          });
        }
      });
    } else {
      // Fallback Strategy: Sliding Fixed Character boundaries
      const maxChars = 250;
      const step = 200; // 50 character overlap window
      let start = 0;
      let sequence = 1;

      while (start < normalizedContent.length) {
        const end = Math.min(start + maxChars, normalizedContent.length);
        const excerpt = normalizedContent.substring(start, end).trim();

        if (excerpt.length > 5) {
          chunks.push({
            id: `${baseId}-CH-${sequence}`,
            documentId: document.id,
            sequenceNumber: sequence,
            content: excerpt,
            characterCount: excerpt.length,
            wordCount: excerpt.split(/\s+/).length,
            language: document.metadata.language,
            tags: document.metadata.tags,
            classificationLevel: document.metadata.classificationLevel,
            source: document.metadata.source,
            chunkCitations: [document.title]
          });
        }

        start += step;
        sequence++;
      }
    }

    return chunks;
  }

  /**
   * Enriches ingestion parameters, automatically scoring reliability 
   * and asserting safe classification thresholds dynamically.
   */
  public static enrichMetadata(
    baseDoc: Partial<KnowledgeDocument> & { id: string; title: string },
    classificationLevel = 0
  ): DocumentMetadata {
    return {
      id: baseDoc.id,
      source: baseDoc.metadata?.source || 'IDG Central Administrative Feed',
      classificationLevel: Math.max(0, Math.min(4, classificationLevel)),
      language: baseDoc.metadata?.language || 'multilingual',
      tags: baseDoc.metadata?.tags || ['general-operations'],
      lastUpdated: new Date().toISOString(),
      trustScore: baseDoc.metadata?.trustScore || 0.90,
      author: baseDoc.metadata?.author || 'IDG Operational Registry'
    };
  }
}
