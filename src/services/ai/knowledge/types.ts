/**
 * Iraq Digital Gateway (IDG)
 * National Knowledge Brain - Domain Models & Types
 * 
 * Strict typed structures for document processing, multi-level classification,
 * structural metadata representation, and chunk lineage mapping.
 */

export enum KnowledgeClassification {
  PUBLIC = 'PUBLIC',             // Level 0 - Open retrieval
  INTERNAL = 'INTERNAL',         // Level 1 - Registered partners and developers 
  RESTRICTED = 'RESTRICTED',     // Level 2 - Role-based operations and compliance
  CONFIDENTIAL = 'CONFIDENTIAL', // Level 3 - Sovereign clearance with multi-sig auditing
  SECRET = 'SECRET'              // Level 4 - Highly guarded sovereign national assets
}

export enum KnowledgeDomain {
  CUSTOMS = 'CUSTOMS',
  LOGISTICS = 'LOGISTICS',
  TRADE = 'TRADE',
  GOVERNMENT = 'GOVERNMENT',
  COMPLIANCE = 'COMPLIANCE',
  TELECOM = 'TELECOM',
  BANKING = 'BANKING',
  IDENTITY = 'IDENTITY',
  GENERAL = 'GENERAL'
}

/**
 * Standard classification mappings to user clearance levels.
 */
export const CLASSIFICATION_CLEARANCE_MAP: Record<KnowledgeClassification, number> = {
  [KnowledgeClassification.PUBLIC]: 0,
  [KnowledgeClassification.INTERNAL]: 1,
  [KnowledgeClassification.RESTRICTED]: 2,
  [KnowledgeClassification.CONFIDENTIAL]: 3,
  [KnowledgeClassification.SECRET]: 4,
};

export interface KnowledgeSource {
  id: string;
  name: string;
  type: 'GAZETTE' | 'CIRCULAR' | 'MINISTERIAL_DECREE' | 'CONSTITUTIONAL_LAW' | 'OPERATIONAL_MANUAL' | 'REGULATORY_FRAMEWORK' | 'EXTERNAL_API';
  issuingAuthority: string;
  ministry?: string;
  url?: string;
  reliabilityScore: number; // 0.0 to 1.0 trust rating
}

export interface KnowledgeMetadata {
  id: string;
  title: string;
  source: string;
  ministry?: string;
  issuingAuthority?: string;
  publicationDate?: string;
  revisionDate?: string;
  domain: KnowledgeDomain;
  classification: KnowledgeClassification;
  language: 'ku' | 'ar' | 'en' | 'multilingual';
  tags: string[];
  documentVersion: string;
  trustScore: number; // 0.0 to 1.0 (source reputation)
  applicableLawArticle?: string;
  author?: string;
}

export interface KnowledgeDocument {
  id: string;
  title: string;
  domain: KnowledgeDomain;
  content: string;
  metadata: KnowledgeMetadata;
}

export interface KnowledgeChunk {
  id: string;
  documentId: string;
  parentDocumentId: string;   // Lineage & parent-child alignment
  sequenceNumber: number;
  content: string;
  characterCount: number;
  wordCount: number;
  sectionHierarchy: string[]; // Traceable hierarchy structure ["Article 12", "Clause B"]
  classification: KnowledgeClassification;
  domain: KnowledgeDomain;
  source: string;
  citations: string[];        // Legal and administrative source references
  language: 'ku' | 'ar' | 'en' | 'multilingual';
  tags: string[];
}
