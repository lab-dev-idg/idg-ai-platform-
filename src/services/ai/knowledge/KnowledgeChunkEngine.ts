/**
 * Iraq Digital Gateway (IDG)
 * National Knowledge Brain - Chunking Engine
 * 
 * Implements section-based logical slicing and sliding window algorithms, 
 * maintaining pristine parent-child provenance, hierarchy, and citations.
 */

import { KnowledgeDocument, KnowledgeChunk } from './types';
import { DocumentIngester } from './DocumentIngester';

export class KnowledgeChunkEngine {
  /**
   * Splits a primary KnowledgeDocument into traceable KnowledgeChunks.
   * Preserves structural context hierarchy, parent-child lineage, and citation tags.
   */
  public static chunkDocument(
    document: KnowledgeDocument,
    strategy: 'LOGICAL_SECTION' | 'FIXED_OVERLAP' = 'LOGICAL_SECTION'
  ): KnowledgeChunk[] {
    const rawContent = document.content;
    const documentId = document.id;
    const lang = document.metadata.language;
    const classification = document.metadata.classification;
    const domain = document.metadata.domain;
    const source = document.metadata.source;

    // Use standard IDG normalizer to ensure Arabic/Kurdish Unicode compatibility
    const normalizedText = DocumentIngester.normalizeText(rawContent, lang);

    const chunks: KnowledgeChunk[] = [];

    if (strategy === 'LOGICAL_SECTION' && (
      normalizedText.includes('Article') || 
      normalizedText.includes('Directive') || 
      normalizedText.includes('Section') || 
      normalizedText.includes('Clause')
    )) {
      // Split on section-based anchor sequences
      const sections = normalizedText.split(/(?=(?:Article|Directive|Section|Clause)\s+\d+)/gi);
      let sequence = 1;

      sections.forEach((sect) => {
        const cleaned = sect.trim();
        if (cleaned.length < 15) return;

        // Trace hierarchy depth if matches are found
        const anchorMatch = cleaned.match(/^((?:Article|Directive|Section|Clause)\s+\d+)/i);
        const hierarchyHeader = anchorMatch ? anchorMatch[1] : `Section ${sequence}`;
        const sectionHierarchy = [document.title, hierarchyHeader];

        // Format citations lineage
        const citation = document.metadata.applicableLawArticle 
          ? `${document.title}, ${document.metadata.applicableLawArticle}`
          : `${document.title} - ${hierarchyHeader}`;

        chunks.push({
          id: `${documentId}-CH-${sequence}`,
          documentId,
          parentDocumentId: documentId,
          sequenceNumber: sequence,
          content: cleaned,
          characterCount: cleaned.length,
          wordCount: cleaned.split(/\s+/).filter(Boolean).length,
          sectionHierarchy,
          classification,
          domain,
          source,
          citations: [citation, source],
          language: lang,
          tags: [...document.metadata.tags, 'logical-chunk', hierarchyHeader.toLowerCase().replace(/\s+/g, '-')]
        });

        sequence++;
      });
    } else {
      // FIXED SENTENCE WINDOW sliding overlap algorithm
      const sentences = normalizedText.split(/(?<=[.?!])\s+/);
      let currentBuffer = '';
      let sequence = 1;
      const targetChunkSize = 350; // soft ceiling
      const sentenceHistory: string[] = [];

      for (let i = 0; i < sentences.length; i++) {
        const s = sentences[i].trim();
        if (!s) continue;

        if (currentBuffer.length + s.length > targetChunkSize && currentBuffer.length > 0) {
          const hierarchyHeader = `Paragraph Segment ${sequence}`;
          const citation = `${document.title} (${hierarchyHeader})`;

          chunks.push({
            id: `${documentId}-CH-${sequence}`,
            documentId,
            parentDocumentId: documentId,
            sequenceNumber: sequence,
            content: currentBuffer.trim(),
            characterCount: currentBuffer.length,
            wordCount: currentBuffer.split(/\s+/).filter(Boolean).length,
            sectionHierarchy: [document.title, hierarchyHeader],
            classification,
            domain,
            source,
            citations: [citation, source],
            language: lang,
            tags: [...document.metadata.tags, 'text-segment']
          });

          sequence++;
          // Establish slide balance: overlap with preceding sentence if possible
          const previousSect = sentenceHistory[sentenceHistory.length - 1] || '';
          currentBuffer = previousSect ? `${previousSect} ${s}` : s;
          sentenceHistory.length = 0;
        } else {
          currentBuffer = currentBuffer ? `${currentBuffer} ${s}` : s;
        }
        sentenceHistory.push(s);
      }

      // Collect leftover balances
      if (currentBuffer.trim().length > 5) {
        const hierarchyHeader = `Paragraph Segment ${sequence}`;
        const citation = `${document.title} (${hierarchyHeader})`;
        
        chunks.push({
          id: `${documentId}-CH-${sequence}`,
          documentId,
          parentDocumentId: documentId,
          sequenceNumber: sequence,
          content: currentBuffer.trim(),
          characterCount: currentBuffer.length,
          wordCount: currentBuffer.split(/\s+/).filter(Boolean).length,
          sectionHierarchy: [document.title, hierarchyHeader],
          classification,
          domain,
          source,
          citations: [citation, source],
          language: lang,
          tags: [...document.metadata.tags, 'text-segment']
        });
      }
    }

    console.log(`[KNOWLEDGE-CHUNK-ENGINE] Generated ${chunks.length} chunks for ${documentId}`);
    return chunks;
  }
}
