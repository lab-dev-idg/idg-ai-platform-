/**
 * Iraq Digital Gateway (IDG)
 * Knowledge Registry Layer - Phase 13-A
 * 
 * Implements a storage-agnostic, dual-mode registry supporting dynamic
 * registration, metadata queries, domain policies, and backward-compatible mappers.
 */

import { UserType, USER_TYPE_REGISTRY } from '../registry/UserRegistry';
import {
  KnowledgeClassification,
  KnowledgeDomain,
  KnowledgeSource,
  KnowledgeMetadata,
  KnowledgeDocument
} from './types';

// Re-export core types for backward compatibility
export {
  KnowledgeClassification,
  KnowledgeDomain,
  KnowledgeSource,
  KnowledgeMetadata,
  KnowledgeDocument
};

// Access Control Policies mapping domains to clearance guidelines
export interface DomainAccessPolicy {
  domain: KnowledgeDomain;
  minimumClearanceLevel: number;
  allowedRoles: UserType[];
  requiresDualAuthorization: boolean;
}

export const DOMAIN_ACCESS_POLICIES: Record<KnowledgeDomain, DomainAccessPolicy> = {
  [KnowledgeDomain.CUSTOMS]: {
    domain: KnowledgeDomain.CUSTOMS,
    minimumClearanceLevel: 0, // Publicly viewable
    allowedRoles: ['Citizen', 'Business', 'Government', 'Developer', 'Telecom', 'Bank', 'Fintech', 'Investor', 'Employee', 'Journalist'],
    requiresDualAuthorization: false,
  },
  [KnowledgeDomain.LOGISTICS]: {
    domain: KnowledgeDomain.LOGISTICS,
    minimumClearanceLevel: 1, // At least Broker/Operator
    allowedRoles: ['Business', 'Government', 'Employee', 'Telecom', 'Bank', 'Fintech', 'Developer', 'Investor'],
    requiresDualAuthorization: false,
  },
  [KnowledgeDomain.TRADE]: {
    domain: KnowledgeDomain.TRADE,
    minimumClearanceLevel: 1,
    allowedRoles: ['Business', 'Government', 'Investor', 'Telecom', 'Bank', 'Fintech', 'Employee'],
    requiresDualAuthorization: false,
  },
  [KnowledgeDomain.GOVERNMENT]: {
    domain: KnowledgeDomain.GOVERNMENT,
    minimumClearanceLevel: 3, // Sensitive government/ministry level
    allowedRoles: ['Government'],
    requiresDualAuthorization: true,
  },
  [KnowledgeDomain.COMPLIANCE]: {
    domain: KnowledgeDomain.COMPLIANCE,
    minimumClearanceLevel: 2, // Compliance and operator minimum
    allowedRoles: ['Government', 'Bank', 'Telecom', 'Employee', 'Fintech'],
    requiresDualAuthorization: false,
  },
  [KnowledgeDomain.TELECOM]: {
    domain: KnowledgeDomain.TELECOM,
    minimumClearanceLevel: 2,
    allowedRoles: ['Government', 'Telecom', 'Employee', 'Developer'],
    requiresDualAuthorization: false,
  },
  [KnowledgeDomain.BANKING]: {
    domain: KnowledgeDomain.BANKING,
    minimumClearanceLevel: 3, // Safe financial escrow
    allowedRoles: ['Government', 'Bank', 'Fintech'],
    requiresDualAuthorization: true,
  },
  [KnowledgeDomain.IDENTITY]: {
    domain: KnowledgeDomain.IDENTITY,
    minimumClearanceLevel: 3, // High privilege biometric standards
    allowedRoles: ['Government', 'Bank'],
    requiresDualAuthorization: true,
  },
  [KnowledgeDomain.GENERAL]: {
    domain: KnowledgeDomain.GENERAL,
    minimumClearanceLevel: 0,
    allowedRoles: ['Citizen', 'Business', 'Government', 'Developer', 'Telecom', 'Bank', 'Fintech', 'Investor', 'Employee', 'Journalist'],
    requiresDualAuthorization: false,
  }
};

/**
 * Maps legacy string-based domains to upgraded KnowledgeDomain enums.
 */
export function mapOldDomainToNew(domain: string): KnowledgeDomain {
  const normalized = domain.toUpperCase();
  if (normalized === 'STRATEGIC' || normalized === 'OPERATIONAL') {
    return KnowledgeDomain.LOGISTICS;
  }
  if (Object.values(KnowledgeDomain).includes(normalized as unknown as KnowledgeDomain)) {
    return normalized as KnowledgeDomain;
  }
  return KnowledgeDomain.GENERAL;
}

/**
 * Maps legacy numeric classifications to KnowledgeClassification enums.
 */
export function mapLevelToClassification(level: number): KnowledgeClassification {
  if (level <= 0) return KnowledgeClassification.PUBLIC;
  if (level === 1) return KnowledgeClassification.INTERNAL;
  if (level === 2) return KnowledgeClassification.RESTRICTED;
  if (level === 3) return KnowledgeClassification.CONFIDENTIAL;
  return KnowledgeClassification.SECRET;
}

/**
 * Validates whether a user type has access to retrieve documents inside a given domain.
 */
export function canAccessDomain(
  userType: UserType,
  domain: KnowledgeDomain | string,
  customClearanceOverride?: number
): boolean {
  const mappedDomain = typeof domain === 'string' ? mapOldDomainToNew(domain) : domain;
  const policy = DOMAIN_ACCESS_POLICIES[mappedDomain];
  if (!policy) return false;

  const userDef = USER_TYPE_REGISTRY[userType];
  if (!userDef) return false;

  const resolvedClearance = typeof customClearanceOverride === 'number'
    ? customClearanceOverride
    : userDef.clearanceLevel;

  // Verify clearance tier matches minimum clearance limit
  if (resolvedClearance < policy.minimumClearanceLevel) {
    return false;
  }

  // Verify explicit role memberships
  return policy.allowedRoles.includes(userType);
}

// Seed documents standard IDG guidelines, upgraded in Phase 13-A
export const SEED_KNOWLEDGE_BASE: KnowledgeDocument[] = [
  {
    id: 'DOC-IRQ-CUST-2026-001',
    title: 'Iraqi Customs Law 2026: HS Code Valuations',
    domain: KnowledgeDomain.CUSTOMS,
    content: 'Article 12 establishes structured ad-valorem tariffs on commercial cargo lanes. Common consumer goods are categorized under custom HS digits with standard duties. CIF (Cost, Insurance, Freight) serves as the primary valuation reference base. Specific exemptions apply to diplomatic shipments and specialized raw manufacturing supplies entering Free Economic Zones.',
    metadata: {
      id: 'DOC-IRQ-CUST-2026-001',
      title: 'Iraqi Customs Law 2026: HS Code Valuations',
      source: 'Iraqi General Gazette Decree No. 44 of 2026',
      issuingAuthority: 'Ministry of Finance Judicial Council',
      ministry: 'Ministry of Finance',
      publicationDate: '2026-01-15T08:00:00Z',
      domain: KnowledgeDomain.CUSTOMS,
      classification: KnowledgeClassification.PUBLIC,
      language: 'multilingual',
      tags: ['customs', 'tariff', 'hs-code', 'cif', 'tax'],
      lastUpdated: '2026-01-15T08:00:00Z',
      trustScore: 0.99,
      documentVersion: '1.0.0',
      author: 'Ministry of Finance Judicial Council',
      applicableLawArticle: 'Article 12'
    }
  },
  {
    id: 'DOC-IRQ-STRAT-BASRA-002',
    title: 'Basra Shipping Axis & Logistical Corridors',
    domain: KnowledgeDomain.LOGISTICS,
    content: 'The Al-Faw Grand Port development and the Umm Qasr master log axis serve as core conduits for national development. Shipping channels connecting the Arab Gulf to regional hubs track average turnaround schedules of 36 hours. Priority customs processing lanes are maintained for deep-ocean freight containers with manifest filings loaded in the IDG Broker ledger 24 hours prior to arrival.',
    metadata: {
      id: 'DOC-IRQ-STRAT-BASRA-002',
      title: 'Basra Shipping Axis & Logistical Corridors',
      source: 'State Logistics Strategy 2025-2030',
      issuingAuthority: 'Ministry of Transportation Executive Board',
      ministry: 'Ministry of Transportation',
      publicationDate: '2025-11-10T12:30:00Z',
      domain: KnowledgeDomain.LOGISTICS,
      classification: KnowledgeClassification.INTERNAL,
      language: 'en',
      tags: ['logistics', 'basra', 'umm-qasr', 'al-faw', 'corridors'],
      lastUpdated: '2025-11-10T12:30:00Z',
      trustScore: 0.95,
      documentVersion: '2.1.0',
      author: 'Ministry of Transportation'
    }
  },
  {
    id: 'DOC-IRQ-COMP-AML-003',
    title: 'Anti-Money Laundering Framework (Sovereign Escrow Standards)',
    domain: KnowledgeDomain.COMPLIANCE,
    content: 'Central Bank of Iraq (CBI) regulations strictly govern commercial letters of credit and currency trades. Escrow clearings through electronic trade gateways require matching manifest values with actual payment remittance transfers. Any discrepancies matching greater than +/- 5% in value trigger automatic compliance locks, pending manual escrow auditor reviews.',
    metadata: {
      id: 'DOC-IRQ-COMP-AML-003',
      title: 'Anti-Money Laundering Framework (Sovereign Escrow Standards)',
      source: 'CBI Directive No. 8 on Digital Escrow Clearance',
      issuingAuthority: 'CBI Compliance Council',
      ministry: 'Central Bank of Iraq',
      publicationDate: '2026-02-20T10:15:00Z',
      domain: KnowledgeDomain.COMPLIANCE,
      classification: KnowledgeClassification.RESTRICTED,
      language: 'ar',
      tags: ['bank', 'cbi', 'aml', 'escrow', 'compliance'],
      lastUpdated: '2026-02-20T10:15:00Z',
      trustScore: 0.98,
      documentVersion: '1.2.0',
      author: 'Central Bank of Iraq Compliance Division',
      applicableLawArticle: 'Directive 8, Section B'
    }
  },
  {
    id: 'DOC-IRQ-ID-MOSS-004',
    title: 'National Digital Identity (MOSS Authentication Gateways)',
    domain: KnowledgeDomain.IDENTITY,
    content: 'Unification of individual biometric records with trade broker licenses implements a cryptographically sealed national identity schema (MOSS-ID). Registered portal keys rely on digital signatures verified against central government identity nodes. High-privilege actions, such as administrative policy edits, require authenticated multisig handshakes linking Ministry planners to local port operators.',
    metadata: {
      id: 'DOC-IRQ-ID-MOSS-004',
      title: 'National Digital Identity (MOSS Authentication Gateways)',
      source: 'Ministry of Interior Identity Standards v2.1',
      issuingAuthority: 'Ministry of Interior Technology Taskforce',
      ministry: 'Ministry of Interior',
      publicationDate: '2026-03-01T15:00:00Z',
      domain: KnowledgeDomain.IDENTITY,
      classification: KnowledgeClassification.CONFIDENTIAL,
      language: 'ku',
      tags: ['identity', 'moss-id', 'biometric', 'multisig', 'admin'],
      lastUpdated: '2026-03-01T15:00:00Z',
      trustScore: 0.97,
      documentVersion: '2.1.0',
      author: 'Ministry of Interior Technology Taskforce'
    }
  },
  {
    id: 'DOC-IRQ-OPS-CHECKPOINT-005',
    title: 'Digital Border Port Crossing Workflows',
    domain: KnowledgeDomain.LOGISTICS,
    content: 'Cargo checkpoint gates handle terminal validation routines by reading physical barcode passports printed on cargo clearances. Gate automatic barriers are unlocked on successful match with decentralized database manifest hashes. If a terminal network connection drops, fallback rules allow locally-signed checkpoint buffers to queue validation records until communication is restored.',
    metadata: {
      id: 'DOC-IRQ-OPS-CHECKPOINT-005',
      title: 'Digital Border Port Crossing Workflows',
      source: 'Sovereign Ports and Borders Operational Manual v4',
      issuingAuthority: 'Border Ports Commission Operations Center',
      ministry: 'Ministry of Transportation',
      publicationDate: '2025-12-05T09:45:00Z',
      domain: KnowledgeDomain.LOGISTICS,
      classification: KnowledgeClassification.INTERNAL,
      language: 'multilingual',
      tags: ['checkpoint', 'workflow', 'port', 'terminal', 'barcode'],
      lastUpdated: '2025-12-05T09:45:00Z',
      trustScore: 0.92,
      documentVersion: '4.0.0',
      author: 'Border Ports Commission Operations Center'
    }
  }
];

/**
 * Storage-agnostic KnowledgeRegistry implementing Step 3 goals of Phase 13-A.
 */
export class KnowledgeRegistry {
  private static instance: KnowledgeRegistry;

  private documents: Map<string, KnowledgeDocument> = new Map();
  private sources: Map<string, KnowledgeSource> = new Map();
  private registeredDomains: Map<KnowledgeDomain, DomainAccessPolicy> = new Map();
  private registeredClassifications: Set<KnowledgeClassification> = new Set();

  private constructor() {
    // Automatically register seed assets
    for (const doc of SEED_KNOWLEDGE_BASE) {
      this.documents.set(doc.id, doc);
    }
    
    // Auto populate domains
    Object.keys(DOMAIN_ACCESS_POLICIES).forEach((domainKey) => {
      const d = domainKey as KnowledgeDomain;
      this.registeredDomains.set(d, DOMAIN_ACCESS_POLICIES[d]);
    });

    // Auto populate classifications
    this.registeredClassifications.add(KnowledgeClassification.PUBLIC);
    this.registeredClassifications.add(KnowledgeClassification.INTERNAL);
    this.registeredClassifications.add(KnowledgeClassification.RESTRICTED);
    this.registeredClassifications.add(KnowledgeClassification.CONFIDENTIAL);
    this.registeredClassifications.add(KnowledgeClassification.SECRET);
  }

  public static getInstance(): KnowledgeRegistry {
    if (!this.instance) {
      this.instance = new KnowledgeRegistry();
    }
    return this.instance;
  }

  /**
   * Registers a brand-new primary knowledge document.
   */
  public registerDocument(doc: KnowledgeDocument): void {
    this.documents.set(doc.id, doc);
    console.log(`[KNOWLEDGE-REGISTRY] Successfully registered document: ${doc.id} ("${doc.title}") in domain: ${doc.domain}`);
  }

  /**
   * Registers a trusted knowledge citation source.
   */
  public registerSource(source: KnowledgeSource): void {
    this.sources.set(source.id, source);
    console.log(`[KNOWLEDGE-REGISTRY] Registered trusted sovereign source reference: ${source.id} (${source.name})`);
  }

  /**
   * Establishes a domain configuration and access safety policy programmatically.
   */
  public registerDomain(domain: KnowledgeDomain, policy: DomainAccessPolicy): void {
    this.registeredDomains.set(domain, policy);
    console.log(`[KNOWLEDGE-REGISTRY] Programmatic Domain Policy mapped for: ${domain}`);
  }

  /**
   * Registers a categorization level.
   */
  public registerClassification(classification: KnowledgeClassification): void {
    this.registeredClassifications.add(classification);
    console.log(`[KNOWLEDGE-REGISTRY] Classification clearance tier online: ${classification}`);
  }

  /**
   * Retrieves structural metadata for a document securely.
   */
  public getDocumentMetadata(docId: string): KnowledgeMetadata | null {
    const doc = this.documents.get(docId);
    return doc ? doc.metadata : null;
  }

  /**
   * Fetches the complete set of primary active documents.
   */
  public listRegisteredDocuments(): KnowledgeDocument[] {
    return Array.from(this.documents.values());
  }

  /**
   * Fetches the complete set of valid source references.
   */
  public listRegisteredSources(): KnowledgeSource[] {
    return Array.from(this.sources.values());
  }

  /**
   * De-registers a document, keeping storage-clean hygiene.
   */
  public removeDocument(docId: string): boolean {
    return this.documents.delete(docId);
  }
}
