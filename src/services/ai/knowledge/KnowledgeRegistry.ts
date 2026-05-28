/**
 * Iraq Digital Gateway (IDG)
 * Knowledge Registry Layer
 * 
 * Defines standard knowledge domains, document schemas, classification levels,
 * and access control authorization rules that govern RAG retrievals.
 */

import { UserType, USER_TYPE_REGISTRY } from '../registry/UserRegistry';

export type KnowledgeDomain =
  | 'Strategic'    // National economy, logistics corridors, investmentzones
  | 'Operational'  // Ports, border checkpoints, workflow operations
  | 'Customs'      // Tariffs, HS codes, 2026 Customs Law
  | 'Compliance'   // AML, sanctions, fraud prevention
  | 'Identity';    // National digital identity systems

export interface DocumentMetadata {
  id: string;
  source: string;
  classificationLevel: number; // 0 (Public) to 4 (Secret/Sovereign)
  language: 'ku' | 'ar' | 'en' | 'multilingual';
  tags: string[];
  lastUpdated: string;
  trustScore: number; // 0.0 to 1.0 (source reputation)
  author?: string;
  applicableLawArticle?: string;
}

export interface KnowledgeDocument {
  id: string;
  title: string;
  domain: KnowledgeDomain;
  content: string;
  metadata: DocumentMetadata;
}

// Access Control Policies mapping domains to clearance guidelines
export interface DomainAccessPolicy {
  domain: KnowledgeDomain;
  minimumClearanceLevel: number;
  allowedRoles: UserType[];
  requiresDualAuthorization: boolean;
}

export const DOMAIN_ACCESS_POLICIES: Record<KnowledgeDomain, DomainAccessPolicy> = {
  Strategic: {
    domain: 'Strategic',
    minimumClearanceLevel: 1, // Broker level minimum
    allowedRoles: ['Business', 'Government', 'Investor', 'Telecom', 'Bank', 'Fintech', 'Employee'],
    requiresDualAuthorization: false,
  },
  Operational: {
    domain: 'Operational',
    minimumClearanceLevel: 1,
    allowedRoles: ['Business', 'Government', 'Employee', 'Telecom', 'Bank', 'Fintech', 'Developer'],
    requiresDualAuthorization: false,
  },
  Customs: {
    domain: 'Customs',
    minimumClearanceLevel: 0, // Publicly viewable
    allowedRoles: ['Citizen', 'Business', 'Government', 'Developer', 'Telecom', 'Bank', 'Fintech', 'Investor', 'Employee', 'Journalist'],
    requiresDualAuthorization: false,
  },
  Compliance: {
    domain: 'Compliance',
    minimumClearanceLevel: 2, // Operator or official level minimum
    allowedRoles: ['Government', 'Bank', 'Telecom', 'Employee', 'Fintech'],
    requiresDualAuthorization: false,
  },
  Identity: {
    domain: 'Identity',
    minimumClearanceLevel: 3, // Sensitive sovereign / banking level
    allowedRoles: ['Government', 'Bank'],
    requiresDualAuthorization: true, // Requires high system checks
  },
};

/**
 * Validates whether a user configuration has access to retrieve documents inside a given domain.
 * 
 * @param userType The user type requesting access
 * @param domain Target knowledge domain
 * @param customClearanceOverride Optional administrative override context
 */
export function canAccessDomain(
  userType: UserType,
  domain: KnowledgeDomain,
  customClearanceOverride?: number
): boolean {
  const policy = DOMAIN_ACCESS_POLICIES[domain];
  if (!policy) return false;

  const userDef = USER_TYPE_REGISTRY[userType];
  if (!userDef) return false;

  const resolvedClearance = typeof customClearanceOverride === 'number'
    ? customClearanceOverride
    : userDef.clearanceLevel;

  // Verify clearance tier
  if (resolvedClearance < policy.minimumClearanceLevel) {
    return false;
  }

  // Verify explicit group memberships
  return policy.allowedRoles.includes(userType);
}

// Robust static database seeding standard IDG guidelines (RAG source target)
export const SEED_KNOWLEDGE_BASE: KnowledgeDocument[] = [
  {
    id: 'DOC-IRQ-CUST-2026-001',
    title: 'Iraqi Customs Law 2026: HS Code Valuations',
    domain: 'Customs',
    content: 'Article 12 establishes structured ad-valorem tariffs on commercial cargo lanes. Common consumer goods are categorized under custom HS digits with standard duties. CIF (Cost, Insurance, Freight) serves as the primary valuation reference base. Specific exemptions apply to diplomatic shipments and specialized raw manufacturing supplies entering Free Economic Zones.',
    metadata: {
      id: 'DOC-IRQ-CUST-2026-001',
      source: 'Iraqi General Gazette Decree No. 44 of 2026',
      classificationLevel: 0,
      language: 'multilingual',
      tags: ['customs', 'tariff', 'hs-code', 'cif', 'tax'],
      lastUpdated: '2026-01-15T08:00:00Z',
      trustScore: 0.99,
      author: 'Ministry of Finance Judicial Council',
      applicableLawArticle: 'Article 12'
    }
  },
  {
    id: 'DOC-IRQ-STRAT-BASRA-002',
    title: 'Basra Shipping Axis & Logistical Corridors',
    domain: 'Strategic',
    content: 'The Al-Faw Grand Port development and the Umm Qasr master log axis serve as core conduits for national development. Shipping channels connecting the Arab Gulf to regional hubs track average turnaround schedules of 36 hours. Priority customs processing lanes are maintained for deep-ocean freight containers with manifest filings loaded in the IDG Broker ledger 24 hours prior to arrival.',
    metadata: {
      id: 'DOC-IRQ-STRAT-BASRA-002',
      source: 'State Logistics Strategy 2025-2030',
      classificationLevel: 1,
      language: 'en',
      tags: ['logistics', 'basra', 'umm-qasr', 'al-faw', 'corridors'],
      lastUpdated: '2025-11-10T12:30:00Z',
      trustScore: 0.95,
      author: 'Ministry of Transportation'
    }
  },
  {
    id: 'DOC-IRQ-COMP-AML-003',
    title: 'Anti-Money Laundering Framework (Sovereign Escrow Standards)',
    domain: 'Compliance',
    content: 'Central Bank of Iraq (CBI) regulations strictly govern commercial letters of credit and currency trades. Escrow clearings through electronic trade gateways require matching manifest values with actual payment remittance transfers. Any discrepancies matching greater than +/- 5% in value trigger automatic compliance locks, pending manual escrow auditor reviews.',
    metadata: {
      id: 'DOC-IRQ-COMP-AML-003',
      source: 'CBI Directive No. 8 on Digital Escrow Clearance',
      classificationLevel: 2,
      language: 'ar',
      tags: ['bank', 'cbi', 'aml', 'escrow', 'compliance'],
      lastUpdated: '2026-02-20T10:15:00Z',
      trustScore: 0.98,
      author: 'Central Bank of Iraq Compliance Division',
      applicableLawArticle: 'Directive 8, Section B'
    }
  },
  {
    id: 'DOC-IRQ-ID-MOSS-004',
    title: 'National Digital Identity (MOSS Authentication Gateways)',
    domain: 'Identity',
    content: 'Unification of individual biometric records with trade broker licenses implements a cryptographically sealed national identity schema (MOSS-ID). Registered portal keys rely on digital signatures verified against central government identity nodes. High-privilege actions, such as administrative policy edits, require authenticated multisig handshakes linking Ministry planners to local port operators.',
    metadata: {
      id: 'DOC-IRQ-ID-MOSS-004',
      source: 'Ministry of Interior Identity Standards v2.1',
      classificationLevel: 3,
      language: 'ku',
      tags: ['identity', 'moss-id', 'biometric', 'multisig', 'admin'],
      lastUpdated: '2026-03-01T15:00:00Z',
      trustScore: 0.97,
      author: 'Ministry of Interior Technology Taskforce'
    }
  },
  {
    id: 'DOC-IRQ-OPS-CHECKPOINT-005',
    title: 'Digital Border Port Crossing Workflows',
    domain: 'Operational',
    content: 'Cargo checkpoint gates handle terminal validation routines by reading physical barcode passports printed on cargo clearances. Gate automatic barriers are unlocked on successful match with decentralized database manifest hashes. If a terminal network connection drops, fallback rules allow locally-signed checkpoint buffers to queue validation records until communication is restored.',
    metadata: {
      id: 'DOC-IRQ-OPS-CHECKPOINT-005',
      source: 'Sovereign Ports and Borders Operational Manual v4',
      classificationLevel: 1,
      language: 'multilingual',
      tags: ['checkpoint', 'workflow', 'port', 'terminal', 'barcode'],
      lastUpdated: '2025-12-05T09:45:00Z',
      trustScore: 0.92,
      author: 'Border Ports Commission Operations Center'
    }
  }
];
