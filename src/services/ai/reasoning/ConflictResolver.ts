/**
 * Iraq Digital Gateway (IDG)
 * Enterprise Advanced Reasoning - Conflict Resolution Engine
 * 
 * Audits overlapping policy dictates across various ministry guidelines, 
 * resolving trade, tariff, and biometric discrepancies objectively via a 4-tier governance hierarchy.
 */

import { EvidenceRecord, ConflictReport, ReasoningConflict } from './types';
import { KnowledgeRegistry } from '../knowledge/KnowledgeRegistry';

export class ConflictResolver {
  private static instance: ConflictResolver;
  private registry = KnowledgeRegistry.getInstance();

  private constructor() {}

  public static getInstance(): ConflictResolver {
    if (!this.instance) {
      this.instance = new ConflictResolver();
    }
    return this.instance;
  }

  /**
   * Executes deep compliance checks on aggregated evidence lists to find contradictions.
   */
  public analyzeConflicts(records: EvidenceRecord[]): ConflictReport {
    const conflicts: ReasoningConflict[] = [];
    const resolvedConflicts: Array<{
      conflictId: string;
      resolvedBy: string;
      winningDocId: string;
      losingDocId: string;
      explanation: string;
    }> = [];

    // Pairwise regulatory code audit
    for (let i = 0; i < records.length; i++) {
      for (let j = i + 1; j < records.length; j++) {
        const evA = records[i];
        const evB = records[j];

        if (evA.documentId === evB.documentId) continue;

        const textA = evA.text.toLowerCase();
        const textB = evB.text.toLowerCase();

        // High overlap subjects
        const overlappingKeywords = ['fee', 'tariff', 'exempt', 'escrow', 'clearance', 'moss', 'compliance', 'gate'];
        const matchesKeyword = overlappingKeywords.some(kw => textA.includes(kw) && textB.includes(kw));

        if (matchesKeyword) {
          // Detect instruction contradictions
          const hasClash =
            (textA.includes('exemption applies') && textB.includes('no exemptions')) ||
            (textA.includes('automatic compliance locks') && textB.includes('manual check bypass')) ||
            (textA.includes('ad-valorem') && textB.includes('flat rate')) ||
            (textA.includes('priority') && textB.includes('standard queue')) ||
            (textA.includes('lock') && textB.includes('bypass'));

          if (hasClash) {
            const conflictId = `CONF-${evA.documentId.substring(4, 12).replace(/[^a-zA-Z0-9-]/g, '')}-${evB.documentId.substring(4, 12).replace(/[^a-zA-Z0-9-]/g, '')}`;
            
            const metaA = this.registry.getDocumentMetadata(evA.documentId);
            const metaB = this.registry.getDocumentMetadata(evB.documentId);

            let winningDocId = evA.documentId;
            let losingDocId = evB.documentId;
            let resolvedBy = '';
            let explanation = '';

            // TIER 4: Explicit Override checks
            const evAIsOverride = textA.includes('override') || textA.includes('supersedes') || textA.includes('priority over');
            const evBIsOverride = textB.includes('override') || textB.includes('supersedes') || textB.includes('priority over');

            if (evAIsOverride && !evBIsOverride) {
              winningDocId = evA.documentId;
              losingDocId = evB.documentId;
              resolvedBy = 'EXPLICIT_OVERRIDE_DOCUMENTS';
              explanation = `Resolved via Explicit Override clause in active document: "${metaA?.title || evA.citation}".`;
            } else if (evBIsOverride && !evAIsOverride) {
              winningDocId = evB.documentId;
              losingDocId = evA.documentId;
              resolvedBy = 'EXPLICIT_OVERRIDE_DOCUMENTS';
              explanation = `Resolved via Explicit Override clause in active document: "${metaB?.title || evB.citation}".`;
            } else {
              // TIER 3: Higher Authority Ministry checks (MoF or CBI > others)
              const minA = metaA?.ministry?.toLowerCase() || '';
              const minB = metaB?.ministry?.toLowerCase() || '';

              const isGovPowerA = minA.includes('finance') || minA.includes('central bank') || minA.includes('cbi');
              const isGovPowerB = minB.includes('finance') || minB.includes('central bank') || minB.includes('cbi');

              if (isGovPowerA && !isGovPowerB) {
                winningDocId = evA.documentId;
                losingDocId = evB.documentId;
                resolvedBy = 'HIGHER_AUTHORITY_MINISTRY';
                explanation = `Resolved via Ministry Authority precedence. "${metaA?.ministry || 'Ministry of Finance'}" dictates override local port Commission guidelines.`;
              } else if (isGovPowerB && !isGovPowerA) {
                winningDocId = evB.documentId;
                losingDocId = evA.documentId;
                resolvedBy = 'HIGHER_AUTHORITY_MINISTRY';
                explanation = `Resolved via Ministry Authority precedence. "${metaB?.ministry || 'Ministry of Finance'}" dictates override local port Commission guidelines.`;
              } else {
                // TIER 2: Higher Trust Score checks
                const trustScoreA = metaA?.trustScore || evA.trustScore;
                const trustScoreB = metaB?.trustScore || evB.trustScore;

                if (trustScoreA > trustScoreB) {
                  winningDocId = evA.documentId;
                  losingDocId = evB.documentId;
                  resolvedBy = 'HIGHER_TRUST_SCORE';
                  explanation = `Resolved via Source Registry Trust value alignment: checkpoint "${metaA?.title}" scores ${trustScoreA}, dominating "${metaB?.title}" with ${trustScoreB}.`;
                } else if (trustScoreB > trustScoreA) {
                  winningDocId = evB.documentId;
                  losingDocId = evA.documentId;
                  resolvedBy = 'HIGHER_TRUST_SCORE';
                  explanation = `Resolved via Source Registry Trust value alignment: checkpoint "${metaB?.title}" scores ${trustScoreB}, dominating "${metaA?.title}" with ${trustScoreA}.`;
                } else {
                  // TIER 1: Newer Publication Date Wins checks
                  const dateA = metaA?.publicationDate ? new Date(metaA.publicationDate).getTime() : 0;
                  const dateB = metaB?.publicationDate ? new Date(metaB.publicationDate).getTime() : 0;

                  if (dateA > dateB) {
                    winningDocId = evA.documentId;
                    losingDocId = evB.documentId;
                    resolvedBy = 'NEWER_PUBLICATION_DATE_WINS';
                    explanation = `Resolved via Publication Currency rules: more recent policy directive issued on ${metaA?.publicationDate} overrides legacy circular on ${metaB?.publicationDate}.`;
                  } else if (dateB > dateA) {
                    winningDocId = evB.documentId;
                    losingDocId = evA.documentId;
                    resolvedBy = 'NEWER_PUBLICATION_DATE_WINS';
                    explanation = `Resolved via Publication Currency rules: more recent policy directive issued on ${metaB?.publicationDate} overrides legacy circular on ${metaA?.publicationDate}.`;
                  } else {
                    // Explicitly unresolved conflict
                    const clash: ReasoningConflict = {
                      id: conflictId,
                      governingDocId: evA.documentId,
                      contradictingDocId: evB.documentId,
                      conflictType: 'DIRECT_RULE_CLASH',
                      description: `Un-reconciled contradictory mandates matching both "${evA.citation}" and "${evB.citation}". Escalation is required.`,
                      resolutionStrategy: 'HIGHER_AUTHORITY',
                      resolvedScore: 0.0
                    };
                    conflicts.push(clash);
                    continue;
                  }
                }
              }
            }

            resolvedConflicts.push({
              conflictId,
              resolvedBy,
              winningDocId,
              losingDocId,
              explanation
            });
          }
        }
      }
    }

    return {
      id: `CR-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      conflicts,
      resolvedConflicts,
      unresolvedConflicts: conflicts,
      auditTimestamp: new Date().toISOString()
    };
  }
}
