/**
 * Iraq Digital Gateway (IDG)
 * RAG Control Gate System
 *
 * Checks user clearance levels and matches them against domain classification levels
 * to restrict vector retrieval to authorized spaces. Applies government-grade containment.
 */

import { UserType, USER_TYPE_REGISTRY } from '../registry/UserRegistry';
import { KnowledgeDomain } from '../knowledge/KnowledgeRegistry';
import { ToolEventEmitter } from '../tools/ToolEventEmitter';

export type KnowledgeClassification = 'Public' | 'Internal' | 'Restricted' | 'Confidential';

export class RAGControlGate {
  /**
   * Resolves classification labels for standard IDG Domains.
   */
  public static resolveDomainClassification(domain: KnowledgeDomain): KnowledgeClassification {
    switch (domain) {
      case 'Customs':
        return 'Public';
      case 'Strategic':
      case 'Operational':
        return 'Internal';
      case 'Compliance':
        return 'Restricted';
      case 'Identity':
        return 'Confidential';
      default:
        return 'Confidential'; // Strict conservative fallback
    }
  }

  /**
   * Evaluates permissions before permitting document search retrievals.
   * Matches parameters with strict criteria:
   * - Public: Open retrieval (requires clearance Level 0+)
   * - Internal: Authenticated only (requires clearance Level 1+ e.g., Business/Developer/Investor)
   * - Restricted: Role-based access (requires clearance Level 2+ e.g., Employee/Telecom/Fintech)
   * - Confidential: Highly privileged agent (requires clearance Level 3+ e.g., Government/Bank)
   */
  public static verifyRAGAccess(
    userType: UserType,
    domain: KnowledgeDomain,
    sessionTraceId?: string
  ): { isAllowed: boolean; classification: KnowledgeClassification; reason?: string } {
    const classification = this.resolveDomainClassification(domain);
    const userRoleDef = USER_TYPE_REGISTRY[userType];
    const clearanceLevel = userRoleDef ? userRoleDef.clearanceLevel : 0;

    let isAllowed = false;
    let reason = '';

    switch (classification) {
      case 'Public':
        // Open retrieval allowed for all citizens
        isAllowed = true;
        break;

      case 'Internal':
        // Authenticated users with clearance Level 1 or greater
        if (clearanceLevel >= 1) {
          isAllowed = true;
        } else {
          reason = `Authentication barrier. Access to '${domain}' (Internal) is restricted to registered partners and trades.`;
        }
        break;

      case 'Restricted':
        // Role-based access requiring clearance Level 2 or greater
        if (clearanceLevel >= 2) {
          isAllowed = true;
        } else {
          reason = `Clearance Failure. Querying domain '${domain}' (Restricted) requires Level-2 operator permissions.`;
        }
        break;

      case 'Confidential':
        // Sovereign clearance only (Level 3+)
        if (clearanceLevel >= 3) {
          isAllowed = true;
        } else {
          reason = `Restricted Territory: Sovereign and executive privileges strictly required for domain '${domain}' (Confidential).`;
        }
        break;
    }

    if (!isAllowed) {
      console.warn(`[RAG-GATE-REJECTION] User of type '${userType}' (Clearance Level: ${clearanceLevel}) blocked from domain: '${domain}' (${classification}). Reason: ${reason}`);
      
      // Notify secure handlers of security clearance warning
      ToolEventEmitter.getInstance().emit('security.violation.detected', 'RAGControlGate', {
        userType,
        clearanceLevel,
        attemptedDomain: domain,
        classification,
        reason
      }, sessionTraceId);
    }

    return { isAllowed, classification, reason: isAllowed ? undefined : reason };
  }
}
