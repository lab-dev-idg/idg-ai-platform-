/**
 * Iraq Digital Gateway (IDG)
 * National Knowledge Brain - Evidence Validator
 * 
 * Conducts automated, strict evaluation of citation sources, detects regulatory
 * contradictions, resolves legal logical conflicts, and spots gaps in evidence.
 */

import { SemanticMatch } from '../knowledge/SemanticRetrievalService';
import { KnowledgeRegistry } from '../knowledge/KnowledgeRegistry';
import {
  VerifiedEvidence,
  ReasoningConflict
} from './types';

export class EvidenceValidator {
  private static instance: EvidenceValidator;
  private registry = KnowledgeRegistry.getInstance();

  private constructor() {}

  public static getInstance(): EvidenceValidator {
    if (!this.instance) {
      this.instance = new EvidenceValidator();
    }
    return this.instance;
  }

  /**
   * Transforms raw matches into verified, graded evidence items.
   */
  public validateMatches(
    matches: SemanticMatch[]
  ): VerifiedEvidence[] {
    return matches.map((match) => {
      // Fetch metadata to look up reliability ratings
      const meta = this.registry.getDocumentMetadata(match.documentId);
      
      const reliability = meta ? meta.trustScore : 0.85;
      const relevance = match.score;

      // Assert veracity by looking up if the document exists inside the audited registry
      const veracityScore = meta ? 1.0 : 0.60;

      return {
        chunkId: match.chunkId,
        documentId: match.documentId,
        citation: match.citation || match.source,
        text: match.content,
        classification: match.classification,
        domain: match.domain,
        reliability,
        relevance,
        veracityScore
      };
    });
  }

  /**
   * Detects logical conflicts and rule overlaps between different evidence nodes.
   */
  public detectContradictions(
    evidences: VerifiedEvidence[]
  ): ReasoningConflict[] {
    const conflicts: ReasoningConflict[] = [];

    // Analyze pair-wise documents for contradictions
    for (let i = 0; i < evidences.length; i++) {
      for (let j = i + 1; j < evidences.length; j++) {
        const evA = evidences[i];
        const evB = evidences[j];

        if (evA.documentId === evB.documentId) continue;

        // Pattern 1: Check if one is a dynamic circular and the other is a statutory Gazette law with conflicting text rules
        const textA = evA.text.toLowerCase();
        const textB = evB.text.toLowerCase();

        // High overlap in content yet disparate instructions
        const hasMutualTerms = 
          (textA.includes('fee') || textA.includes('tariff') || textA.includes('exempt') || textA.includes('escrow')) &&
          (textB.includes('fee') || textB.includes('tariff') || textB.includes('exempt') || textB.includes('escrow'));

        if (hasMutualTerms) {
          // Check for logical direct opposites
          const hasClash =
            (textA.includes('exemption applies') && textB.includes('no exemptions')) ||
            (textA.includes('automatic compliance locks') && textB.includes('manual check bypass')) ||
            (textA.includes('ad-valorem') && textB.includes('flat rate'));

          if (hasClash) {
            const conflictId = `CONF-${evA.documentId.substring(4, 12)}-${evB.documentId.substring(4, 12)}`;
            
            // Resolve governing priority based on standard legal hierarchy (Gazette > Manuals/Circulars)
            const isAGov = evA.citation.toLowerCase().includes('gazette') || evA.citation.toLowerCase().includes('directive');
            const governs = isAGov ? evA.documentId : evB.documentId;
            const contradicts = isAGov ? evB.documentId : evA.documentId;

            conflicts.push({
              id: conflictId,
              governingDocId: governs,
              contradictingDocId: contradicts,
              conflictType: 'DIRECT_RULE_CLASH',
              description: `Critical direct instructions mismatch between "${evA.citation}" and "${evB.citation}" over tariff or compliance exemption bindings.`,
              resolutionStrategy: isAGov ? 'HIGHER_AUTHORITY' : 'LATEST_DATE_PREVAILS',
              resolvedScore: 0.90
            });
          }
        }
      }
    }

    return conflicts;
  }

  /**
   * Executes conflict resolution strategies to decide which rules take precedence.
   */
  public resolveConflicts(
    conflicts: ReasoningConflict[]
  ): { resolvedCount: number; unresolvedCount: number; statusLog: string[] } {
    const statusLog: string[] = [];
    let resolvedCount = 0;
    let unresolvedCount = 0;

    for (const conflict of conflicts) {
      if (conflict.resolutionStrategy === 'HIGHER_AUTHORITY') {
        const primaryMeta = this.registry.getDocumentMetadata(conflict.governingDocId);
        const secondaryMeta = this.registry.getDocumentMetadata(conflict.contradictingDocId);
        
        const primaryRank = primaryMeta ? primaryMeta.trustScore : 0.80;
        const secondaryRank = secondaryMeta ? secondaryMeta.trustScore : 0.70;

        if (primaryRank > secondaryRank) {
          statusLog.push(`Resolved [HIGHER_AUTHORITY] for ${conflict.id}: "${primaryMeta?.title}" dominates over "${secondaryMeta?.title}" based on trust metrics (${primaryRank} vs ${secondaryRank}).`);
          resolvedCount++;
        } else {
          statusLog.push(`Inconclusive [HIGHER_AUTHORITY] resolution for ${conflict.id}: Trust scores represent equal weights.`);
          unresolvedCount++;
        }
      } else if (conflict.resolutionStrategy === 'LATEST_DATE_PREVAILS') {
        const primaryMeta = this.registry.getDocumentMetadata(conflict.governingDocId);
        const secondaryMeta = this.registry.getDocumentMetadata(conflict.contradictingDocId);

        const dateA = primaryMeta?.publicationDate ? new Date(primaryMeta.publicationDate).getTime() : 0;
        const dateB = secondaryMeta?.publicationDate ? new Date(secondaryMeta.publicationDate).getTime() : 0;

        if (dateA > dateB) {
          statusLog.push(`Resolved [LATEST_DATE_PREVAILS] for ${conflict.id}: "${primaryMeta?.title}" (${primaryMeta?.publicationDate}) supersedes older decree "${secondaryMeta?.title}" (${secondaryMeta?.publicationDate}).`);
          resolvedCount++;
        } else if (dateB > dateA) {
          statusLog.push(`Resolved [LATEST_DATE_PREVAILS] for ${conflict.id}: "${secondaryMeta?.title}" (${secondaryMeta?.publicationDate}) supersedes older decree "${primaryMeta?.title}" (${primaryMeta?.publicationDate}).`);
          resolvedCount++;
        } else {
          statusLog.push(`Escalating ${conflict.id}: Equal publication parameters require Human Review ESCALATION.`);
          unresolvedCount++;
        }
      } else {
        statusLog.push(`Strategy "${conflict.resolutionStrategy}" for ${conflict.id} requires manual expert adjudication.`);
        unresolvedCount++;
      }
    }

    return {
      resolvedCount,
      unresolvedCount,
      statusLog
    };
  }

  /**
   * Scans retrieved references to spot gap indices / missing articles of law.
   */
  public detectMissingEvidence(
    query: string,
    evidences: VerifiedEvidence[]
  ): { missingCount: number; missingDetails: string[] } {
    const missingDetails: string[] = [];
    const normalizedQuery = query.toLowerCase();

    // Mapping key core requirements terms to expectations in retrieved texts
    const expectations = [
      {
        keyword: 'exemption',
        terms: ['exempt', 'free zone', 'diplomatic'],
        remedy: 'Missing explicit exemptions provisions files (Gazette Article 12 clauses).'
      },
      {
        keyword: 'hs code',
        terms: ['hs code', 'digits', 'tariff code'],
        remedy: 'Missing customs tariff classification mappings database (e.g. HS Chapter 87 vehicles or Chapter 84 machinery).'
      },
      {
        keyword: 'compliance',
        terms: ['compliance', 'aml', 'anti-money laundering', 'escrow'],
        remedy: 'Missing Central Bank currency or escrow clearing rulebooks (CBI Directive No. 8).'
      },
      {
        keyword: 'identity',
        terms: ['identity', 'biometric', 'moss-id', 'sign-off'],
        remedy: 'Missing Interior biometric sync parameters rules (MOSS Gateway v2).'
      }
    ];

    for (const exp of expectations) {
      if (normalizedQuery.includes(exp.keyword)) {
        // Assert if any chunk matched the required terms
        const matched = evidences.some((ev) => 
          exp.terms.some((term) => ev.text.toLowerCase().includes(term))
        );

        if (!matched) {
          missingDetails.push(exp.remedy);
        }
      }
    }

    return {
      missingCount: missingDetails.length,
      missingDetails
    };
  }
}
