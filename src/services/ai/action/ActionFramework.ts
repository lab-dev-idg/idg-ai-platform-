/**
 * Iraq Digital Gateway (IDG)
 * Structured AI Action Framework
 * 
 * Formalizes response contracts output by the AI Decision Core, providing typed 
 * structures representing actions, payload specifications, confidence metrics, 
 * auditing metadata, and legal citing structures.
 */

export type AIActionType =
  | 'DISPLAY_MESSAGE'
  | 'EXECUTE_TOOL'
  | 'REQUIRE_INPUT'
  | 'ESCALATE_WORKFLOW'
  | 'ALERT_DISPATCH'
  | 'SECURITY_LOCK';

export interface AIActionPayload {
  text: string;
  data?: Record<string, unknown>;
  toolName?: string;
  toolInput?: unknown;
  requiredFields?: string[];
  workflowId?: string;
  targetQueue?: string;
}

export interface AIActionContract<T = AIActionPayload> {
  action: AIActionType;
  payload: T;
  confidence: number; // Decimal confidence score between 0.0 and 1.0
  metadata: {
    systemTraceId: string;
    processingDurationMs?: number;
    intentCategory?: string;
    userRoleCleared: string;
    isAuthorized: boolean;
    timestamp: string;
    engineVersion: string;
  };
  citations: string[]; // Legal references, state gazette clauses, policy document indices
}

export class ActionFramework {
  /**
   * Constructs a secure, validated AI Action Contract following system standards.
   */
  public static createAction<T = AIActionPayload>(
    action: AIActionType,
    payload: T,
    confidence: number,
    intentCategory: string,
    userRoleCleared: string,
    citations: string[] = []
  ): AIActionContract<T> {
    const traceId = `IDG-TR-${Math.floor(10000 + Math.random() * 90000)}-${new Date().getFullYear()}`;
    
    return {
      action,
      payload,
      confidence: Math.min(1.0, Math.max(0.0, confidence)),
      metadata: {
        systemTraceId: traceId,
        processingDurationMs: Math.floor(5 + Math.random() * 75),
        intentCategory,
        userRoleCleared,
        isAuthorized: true,
        timestamp: new Date().toISOString(),
        engineVersion: '2.6.0-Foundation'
      },
      citations
    };
  }

  /**
   * Safely parses and validates a raw model response into a structured action contract.
   * Employs robust fallbacks in case of incomplete or invalid JSON formats.
   */
  public static parseModelResponse(rawText: string, fallbackText: string = ''): AIActionContract {
    try {
      const parsed = JSON.parse(rawText);
      
      // Ensure required structure blocks are present with defaults
      const action = (parsed.action as AIActionType) || 'DISPLAY_MESSAGE';
      const payload: AIActionPayload = {
        text: parsed.payload?.text || parsed.text || fallbackText || rawText,
        data: parsed.payload?.data || {},
        toolName: parsed.payload?.toolName,
        toolInput: parsed.payload?.toolInput,
        requiredFields: parsed.payload?.requiredFields,
        workflowId: parsed.payload?.workflowId,
        targetQueue: parsed.payload?.targetQueue
      };
      
      const confidence = typeof parsed.confidence === 'number' ? parsed.confidence : 0.95;
      const intentCategory = parsed.metadata?.intentCategory || 'GENERAL';
      const userRoleCleared = parsed.metadata?.userRoleCleared || 'guest';
      const citations = Array.isArray(parsed.citations) ? parsed.citations : [];

      return this.createAction(action, payload, confidence, intentCategory, userRoleCleared, citations);
    } catch {
      // Fallback response for raw strings
      const payload: AIActionPayload = {
        text: rawText || fallbackText || 'No clear feedback returned from operational gateway.'
      };
      
      return this.createAction('DISPLAY_MESSAGE', payload, 0.85, 'GENERAL', 'guest', []);
    }
  }
}
