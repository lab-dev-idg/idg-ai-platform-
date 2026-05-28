/**
 * Iraq Digital Gateway (IDG)
 * Response Validation Engine
 *
 * Verifies structural compliance of AI Decision outputs, cleanses risky sequences,
 * and asserts strict JSON specifications. Handles graceful degradations when issues occur.
 */

import { AIActionContract, AIActionType } from '../action/ActionFramework';

export class ResponseValidationEngine {
  private static DANGEROUS_PATTERNS = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, // XSS tags
    /javascript:/gi,                                        // Protocol injection
    /eval\(.*\)/gi,                                         // Remote code evaluation execution
    /\brm\s+-rf\b/gi,                                       // Critical terminal command injection
    /\bsudo\s+/gi,                                          // Escalated command parameters
    /;\s*bash\b/gi,                                         // Terminal spawning bypasses
  ];

  /**
   * Validates a candidate AI Action Contract.
   * If structurally or security-wise malformed, safely defaults to a flat DISPLAY_MESSAGE format.
   */
  public static validateAndSanitize(
    candidate: unknown,
    fallbackText?: string
  ): AIActionContract {
    console.log('[VALIDATION-ENGINE] Running response validation sweeps.');

    const defaultFallback = fallbackText || 'Gateway response verification completed with fallback warning.';

    if (!candidate || typeof candidate !== 'object') {
      return this.generateSafeFallback('Unified validation sweeps intercepted a non-object candidate structure.', defaultFallback);
    }

    try {
      const contract = candidate as AIActionContract;

      // 1. Structural Checks: Enforce actions match correct types
      if (!contract.action || typeof contract.action !== 'string') {
        return this.generateSafeFallback('Structural Validation: Missing action property identifier.', defaultFallback);
      }

      const validActions: AIActionType[] = [
        'DISPLAY_MESSAGE',
        'EXECUTE_TOOL',
        'REQUIRE_INPUT',
        'ESCALATE_WORKFLOW',
        'ALERT_DISPATCH',
        'SECURITY_LOCK'
      ];

      if (!validActions.includes(contract.action)) {
        return this.generateSafeFallback(`Structural Validation: Action '${contract.action}' does not match official specs.`, defaultFallback);
      }

      // 2. Payload Validation
      if (!contract.payload || typeof contract.payload !== 'object') {
        return this.generateSafeFallback('Structural Validation: missing text or data payload.', defaultFallback);
      }

      // Check primary text matches string values
      let cleanText = typeof contract.payload.text === 'string' ? contract.payload.text : '';
      if (!cleanText && contract.action === 'DISPLAY_MESSAGE') {
        return this.generateSafeFallback('Payload Validation: Display messages require descriptive text labels.', defaultFallback);
      }

      // 3. Security Sanitization: Remove dangerous sequences
      cleanText = this.sanitizeText(cleanText);

      // Sanitize deep data properties inside payload if present
      const cleanPayload = { ...contract.payload, text: cleanText };
      if (contract.payload.data) {
        cleanPayload.data = this.sanitizeDeepData(contract.payload.data);
      }
      if (contract.payload.toolInput && typeof contract.payload.toolInput === 'object') {
        cleanPayload.toolInput = this.sanitizeDeepData(contract.payload.toolInput as Record<string, unknown>);
      }

      // Check tool names for EXECUTE_TOOL configurations
      if (contract.action === 'EXECUTE_TOOL') {
        if (!contract.payload.toolName || typeof contract.payload.toolName !== 'string') {
          return this.generateSafeFallback('Validation Alert: Executions require structured tool identifiers.', defaultFallback);
        }
        // Sanitize toolName text
        cleanPayload.toolName = this.sanitizeText(contract.payload.toolName);
      }

      // Check metadata elements validity
      const rawMetadata = contract.metadata || {};
      const activeMetadata = {
        systemTraceId: rawMetadata.systemTraceId ? this.sanitizeText(rawMetadata.systemTraceId) : `IDG-TR-GEN-${Math.floor(1000 + Math.random() * 9000)}`,
        processingDurationMs: Number(rawMetadata.processingDurationMs) || 10,
        intentCategory: rawMetadata.intentCategory ? this.sanitizeText(rawMetadata.intentCategory) : 'GENERAL',
        userRoleCleared: rawMetadata.userRoleCleared ? this.sanitizeText(rawMetadata.userRoleCleared) : 'guest',
        isAuthorized: rawMetadata.isAuthorized !== undefined ? !!rawMetadata.isAuthorized : false,
        timestamp: rawMetadata.timestamp ? this.sanitizeText(rawMetadata.timestamp) : new Date().toISOString(),
        engineVersion: '2.6.0-Validated'
      };

      const citations = Array.isArray(contract.citations)
        ? contract.citations.map(c => this.sanitizeText(String(c)))
        : [];

      return {
        action: contract.action,
        payload: cleanPayload,
        confidence: typeof contract.confidence === 'number' ? Math.max(0, Math.min(1.0, contract.confidence)) : 0.90,
        metadata: activeMetadata,
        citations
      };

    } catch (err: unknown) {
      console.warn('[VALIDATION-ENGINE] Validation crash occurred, routing into safe-mode fallback.', err);
      return this.generateSafeFallback('Internal validation pipeline exception.', defaultFallback);
    }
  }

  /**
   * Cleanses raw visual labels and command inputs of hazardous injection strings.
   */
  private static sanitizeText(text: string): string {
    if (!text) return '';
    let sanitized = text;
    for (const pattern of this.DANGEROUS_PATTERNS) {
      sanitized = sanitized.replace(pattern, '[REDACTED_SECURITY_THREAT]');
    }
    return sanitized;
  }

  /**
   * Sanitizes structured objects recursively.
   */
  private static sanitizeDeepData(data: Record<string, unknown>): Record<string, unknown> {
    const cleaned: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(data)) {
      if (typeof val === 'string') {
        cleaned[key] = this.sanitizeText(val);
      } else if (val && typeof val === 'object' && !Array.isArray(val)) {
        cleaned[key] = this.sanitizeDeepData(val as Record<string, unknown>);
      } else {
        cleaned[key] = val;
      }
    }
    return cleaned;
  }

  /**
   * Creates a guaranteed valid, secure flat display message structure.
   */
  private static generateSafeFallback(reason: string, textPayload: string): AIActionContract {
    console.warn(`[VALIDATION-FALLBACK] Reason: ${reason}`);
    
    return {
      action: 'DISPLAY_MESSAGE',
      payload: {
        text: textPayload,
        data: {
          safeguardIntervention: true,
          rejectionReason: reason
        }
      },
      confidence: 1.00,
      metadata: {
        systemTraceId: `IDG-TR-FALLBACK-${Math.floor(100000 + Math.random() * 900000)}`,
        processingDurationMs: 1,
        intentCategory: 'GENERAL',
        userRoleCleared: 'guest',
        isAuthorized: true,
        timestamp: new Date().toISOString(),
        engineVersion: '2.6.0-SafeFallback'
      },
      citations: ['IDG Security Assurance Guidelines v1']
    };
  }
}
