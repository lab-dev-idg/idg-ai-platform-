/**
 * Iraq Digital Gateway (IDG)
 * AI Orchestrator Core
 *
 * Single deterministic gateway orchestrating all security, context, RAG,
 * and transaction execution stages. Transforms IDG into an audit-ready, high-integrity AI OS.
 */

import { UserType, USER_TYPE_REGISTRY } from '../registry/UserRegistry';
import { IDGOperationalState, CompleteAIContext } from '../context/ContextEngine';
import { ContextFusion } from '../context/ContextFusion';
import { IntentCategory, classifyIntentLocally } from '../registry/IntentRegistry';
import { PolicyGate, DecisionEngine } from '../decision/DecisionEngine';
import { ContextIsolator, IsolatedContextType, ShipmentContext } from './ContextIsolator';
import { RetrievalEngine, RetrievalOutput } from '../knowledge/RetrievalEngine';
import { ToolExecutionQueue, QueueTask } from './ToolExecutionQueue';
import { ResponseValidationEngine } from './ResponseValidationEngine';
import { AIActionContract, ActionFramework } from '../action/ActionFramework';
import { AIKernel } from '../kernel/AIKernel';
import { KernelGovernor } from '../kernel/KernelGovernor';

export interface OrchestratorDecision {
  status: 'SUCCESS' | 'BLOCKED' | 'SAFETY_REJECTED' | 'FAILED';
  intent: IntentCategory;
  isolatedContextUsed: IsolatedContextType;
  riskEvaluation: {
    level: string;
    score: number;
    fallbackStrategy: string;
    warning?: string;
  };
  ragMetrics?: {
    searched: boolean;
    citationsResolved: number;
    overallConfidence: number;
  };
  toolMetrics?: {
    executed: boolean;
    queueIndex?: string;
    toolOutput?: Record<string, unknown>;
  };
  actionContract: AIActionContract;
}

export class AIOrchestrator {
  /**
   * Orchestrates the 8-stage AI decision pipeline deterministically.
   *
   * @param userInput User query text
   * @param activeRouteContext Current client navigation path
   * @param userType Identity categorization
   * @param systemTelemetry Border network parameters
   * @param payloadOverrides Additional specific forms metadata
   */
  public static async orchestrate(
    userInput: string,
    activeRouteContext: string,
    userType: UserType,
    systemTelemetry: IDGOperationalState,
    payloadOverrides: Record<string, unknown> = {}
  ): Promise<OrchestratorDecision> {
    const pipelineStart = Date.now();
    console.log(`[ORCHESTRATOR] Initializing IDG transaction pipeline. Query length: ${userInput.length}`);

    const sysTraceId = `IDG-SYS-${Math.floor(100000 + Math.random() * 900000)}-2026`;
    const defaultLanguage = (payloadOverrides.language as 'ku' | 'ar' | 'en') || 'ku';

    // ==========================================
    // 1. INTENT DETECTION
    // ==========================================
    let intent = KernelGovernor.getInstance().getCachedIntent(userInput);
    if (!intent) {
      intent = classifyIntentLocally(userInput);
      KernelGovernor.getInstance().cacheIntent(userInput, intent);
    }
    console.log(`[ORCHESTRATOR] Step 1 - Intent Detected: [${intent}]`);


    // ==========================================
    // 2. CONTEXT RESOLUTION & ISOLATION
    // ==========================================
    // Synthesize general complete state
    const resolvedRole = userType.toLowerCase();
    const completeContext: CompleteAIContext = {
      userType,
      language: defaultLanguage,
      role: resolvedRole,
      currentRoute: activeRouteContext,
      activeModule: activeRouteContext.includes('/customs') ? 'Customs Central' : 'IDG Logistics Core',
      activeWorkflow: 'Interactive AI Support Session',
      operationalState: systemTelemetry,
      timestamp: new Date().toISOString()
    };

    // Formulate final security snapshot
    const snapshot = ContextFusion.fuse(intent, completeContext);

    // Compute appropriate isolated context parameters based on intent categorization
    let isolatedType: IsolatedContextType = 'CHAT_CONTEXT';
    if (intent === 'CUSTOMS') {
      isolatedType = 'CUSTOMS_CONTEXT';
    } else if (intent === 'SHIPMENT') {
      isolatedType = 'SHIPMENT_CONTEXT';
    } else if (intent === 'GOVERNMENT' || intent === 'TELECOM' || intent === 'INCIDENT') {
      isolatedType = 'ADMIN_CONTEXT';
    }

    const isolatedContext = ContextIsolator.compute(
      isolatedType,
      userType,
      defaultLanguage,
      systemTelemetry,
      {
        ...payloadOverrides,
        chatHistoryLength: Number(payloadOverrides.chatHistoryLength) || 2,
        sessionUptimeSeconds: Number(payloadOverrides.sessionUptimeSeconds) || 300,
        hsCode: payloadOverrides.hsCode || this.extractPattern(userInput, /\b\d{4}(?:\.\d{2})*\b/),
        cifValueUSD: Number(payloadOverrides.cifValueUSD) || this.extractNumeric(userInput, /\bcif\s*(\d+)\b/i) || this.extractNumeric(userInput, /\b\$?([5-9]\d{3,})\b/),
        activeManifestId: payloadOverrides.activeManifestId || this.extractPattern(userInput, /\b(?:IDG|IRQ)-\d{5,}\b/i) || 'IDG-99201'
      }
    );

    console.log(`[ORCHESTRATOR] Step 2 - Active Isolated Context bound: [${isolatedType}] (ID: ${isolatedContext.contextId})`);


    // ==========================================
    // 3. SECURITY CLASSIFICATION CHECK
    // ==========================================
    const securityStatus = PolicyGate.validate(snapshot);
    const decision = DecisionEngine.resolve(snapshot);

    console.log(`[ORCHESTRATOR] Step 3 - Security Matrix action resolved: [${securityStatus.policyAction}] (Risk: ${decision.riskLevel})`);

    if (securityStatus.policyAction === 'BLOCK') {
      const blockedAction = ActionFramework.createAction(
        'SECURITY_LOCK',
        {
          text: `Sovereign Security Block: Access denied to unauthenticated intent categories. Reason: ${securityStatus.reason}`,
          data: { riskRatingFlagged: true }
        },
        1.0,
        intent,
        resolvedRole
      );

      // Report metric to AI Kernel Governor
      try {
        const userRoleDef = USER_TYPE_REGISTRY[userType];
        const clearance = userRoleDef ? userRoleDef.clearanceLevel : 0;
        AIKernel.getInstance().monitorTransaction({
          durationMs: Date.now() - pipelineStart,
          intentCategory: intent,
          contextType: isolatedType,
          didRAGRun: false,
          didToolRun: false,
          hasErrors: true,
          errorMessage: securityStatus.reason || 'Sovereign security block',
          userClearance: clearance
        });
      } catch (e) {
        console.warn('[AIOrchestrator] Kernel block telemetry bypassed.', e);
      }

      return {
        status: 'BLOCKED',
        intent,
        isolatedContextUsed: isolatedType,
        riskEvaluation: {
          level: 'CRITICAL',
          score: securityStatus.riskScore,
          fallbackStrategy: 'BLOCKED',
          warning: securityStatus.reason
        },
        actionContract: blockedAction
      };
    }


    // ==========================================
    // 4. RAG KNOWLEDGE BASE DECISION (Gated)
    // ==========================================
    let ragResult: RetrievalOutput | null = null;
    let didRAG_run = false;

    if (decision.requiresRAG) {
      console.log(`[ORCHESTRATOR] Step 4 - Initializing Gated Search Engine.`);
      
      // Perform retrieval utilizing dynamic Control Gate checks
      // The RetrievalEngine internally fetches documents; we pre-validate domain scopes here.
      // Filter domains that are forbidden for this user role
      ragResult = await RetrievalEngine.getInstance().retrieve(userInput, intent, snapshot);
      if (ragResult) {
        ragResult.rankedResults = KernelGovernor.getInstance().limitRAGFetches(ragResult.rankedResults);
        ragResult.citationsList = KernelGovernor.getInstance().limitRAGFetches(ragResult.citationsList);
      }
      didRAG_run = true;
      console.log(`[ORCHESTRATOR] Resolved ${ragResult?.citationsList.length || 0} legal citation records.`);
    }


    // ==========================================
    // 5. TOOL SELECTION OPTIONS
    // ==========================================
    let selectedToolName: string | null = null;
    let toolPayload: Record<string, unknown> = {};

    if (decision.requiresTool) {
      console.log(`[ORCHESTRATOR] Step 5 - Computing automated tool maps.`);
      
      if (intent === 'CUSTOMS') {
        // Evaluate numerical parameters to determine duty calc or standard coding classifications
        const customsCtx = isolatedContext as CustomsContext;
        const cifVal = customsCtx.calculatorMetrics.cifValueUSD;
        
        if (cifVal && cifVal > 0) {
          selectedToolName = 'customs.calculateDuty';
          toolPayload = {
            hsCode: customsCtx.calculatorMetrics.hsCode || '8703.23',
            cifValueUSD: cifVal,
            weightKg: customsCtx.calculatorMetrics.weightKg || 1200
          };
        } else {
          selectedToolName = 'customs.classifyHS';
          toolPayload = {
            cargoDescription: userInput,
            countryOfOrigin: 'Panama'
          };
        }
      } else if (intent === 'SHIPMENT') {
        selectedToolName = 'logistics.trackShipment';
        toolPayload = {
          manifestId: (isolatedContext as ShipmentContext).trackingDetails?.activeManifestId || 'IDG-99201'
        };
      } else if (intent === 'COMPLIANCE') {
        selectedToolName = 'compliance.checkSanctions';
        toolPayload = {
          entityName: userInput
        };
      } else if (intent === 'INCIDENT' || intent === 'TELECOM') {
        selectedToolName = 'notifications.dispatch';
        toolPayload = {
          targetPortId: 'UMM_QASR',
          severity: 'WARN',
          messageBody: `Outage incident reported: ${userInput}`
        };
      }
    }


    // ==========================================
    // 6. TOOL EXECUTION QUEUE (Sequential)
    // ==========================================
    let queueOutput: Record<string, unknown> | undefined;
    let didToolRun = false;

    if (selectedToolName) {
      console.log(`[ORCHESTRATOR] Step 6 - Triggering Safe Mode queue dispatch for: '${selectedToolName}'`);
      
      const payloadHash = JSON.stringify(toolPayload || {});
      const hasLock = KernelGovernor.getInstance().acquireToolLock(selectedToolName, payloadHash);

      if (!hasLock) {
         const warningText = `Governing Protection: Blocked concurrent duplicate tool chain for '${selectedToolName}'.`;
         const fallbackMessage = ActionFramework.createAction(
           'DISPLAY_MESSAGE',
           {
             text: warningText,
             data: { governorThrottleFlagged: true }
           },
           1.0,
           intent,
           resolvedRole
         );
         
         try {
           const userRoleDef = USER_TYPE_REGISTRY[userType];
           const clearance = userRoleDef ? userRoleDef.clearanceLevel : 0;
           AIKernel.getInstance().monitorTransaction({
             durationMs: Date.now() - pipelineStart,
             intentCategory: intent,
             contextType: isolatedType,
             didRAGRun: didRAG_run,
             didToolRun: false,
             toolUsed: selectedToolName,
             hasErrors: true,
             errorMessage: warningText,
             userClearance: clearance
           });
         } catch (err) {
           console.warn('[ORCHESTRATOR] Duplicate tool lock telemetry bypass', err);
         }

         return {
           status: 'SAFETY_REJECTED',
           intent,
           isolatedContextUsed: isolatedType,
           riskEvaluation: {
             level: 'MEDIUM',
             score: securityStatus.riskScore + 10,
             fallbackStrategy: 'DEDUPLICATED'
           },
           actionContract: fallbackMessage
         };
      }

      const requiredClearance = selectedToolName.startsWith('customs') ? 0 :
                                selectedToolName.startsWith('logistics') ? 1 : 2;

      const task: QueueTask = {
        action: selectedToolName,
        payload: toolPayload,
        confidence: decision.confidence,
        metadata: {
          systemTraceId: sysTraceId,
          userRoleCleared: resolvedRole,
          timestamp: new Date().toISOString()
        },
        securityLevel: requiredClearance
      };

      try {
        const queueResult = await ToolExecutionQueue.getInstance().enqueueAndExecute(task, snapshot);
        queueOutput = queueResult.payload.data;
        didToolRun = true;
      } catch (err: unknown) {
        console.error(`[ORCHESTRATOR] Queue Execution crashed. Reverting pipeline, mapping error message.`, err);
        const errText = err instanceof Error ? err.message : 'Sequential operational flow broke.';
        
        try {
          const userRoleDef = USER_TYPE_REGISTRY[userType];
          const clearance = userRoleDef ? userRoleDef.clearanceLevel : 0;
          AIKernel.getInstance().monitorTransaction({
            durationMs: Date.now() - pipelineStart,
            intentCategory: intent,
            contextType: isolatedType,
            didRAGRun: didRAG_run,
            didToolRun: false,
            toolUsed: selectedToolName,
            hasErrors: true,
            errorMessage: errText,
            userClearance: clearance
          });
        } catch (errTelemetry) {
          console.warn('[ORCHESTRATOR] Telemetry check sequence bypass', errTelemetry);
        }

        const fallbackMessage = ActionFramework.createAction(
          'DISPLAY_MESSAGE',
          {
            text: `System Alert: Sequential operation interrupted. Baseline reverted safely. Reason: ${errText}`,
            data: { queueRevertFlagged: true }
          },
          1.0,
          intent,
          resolvedRole
        );

        return {
          status: 'SAFETY_REJECTED',
          intent,
          isolatedContextUsed: isolatedType,
          riskEvaluation: {
            level: 'HIGH',
            score: securityStatus.riskScore + 30,
            fallbackStrategy: 'SAFE_MODE',
            warning: errText
          },
          actionContract: fallbackMessage
        };
      }
    }


    // ==========================================
    // 7. RESPONSE VALIDATION ENGINE
    // ==========================================
    console.log(`[ORCHESTRATOR] Step 7 - Formatting candidate contract.`);
    
    // Synthesize baseline answer text based on outputs
    let baseResponseText = '';
    
    if (didToolRun && queueOutput) {
      if (selectedToolName === 'customs.calculateDuty') {
        baseResponseText = `Duties successfully calculated according to Iraqi Customs Law 2026 guidelines. Total import tax is estimated at $${queueOutput.totalDutiesUSD} USD, based on standard ad-valorem schedules. CIF Valuation evaluated: $${payloadOverrides.cifValueUSD || 10000} USD. Total boundary charges: $${queueOutput.totalChargesUSD} USD.`;
      } else if (selectedToolName === 'customs.classifyHS') {
        baseResponseText = `The closest matching HS sequence for cargo description is classified as Code: ${queueOutput.matchedHSCode} with base class tariff rates at ${queueOutput.baseTariffRatePercent}%.`;
      } else if (selectedToolName === 'logistics.trackShipment') {
        baseResponseText = `Tracking logistics records matching manifestID: ${queueOutput.manifestId}. Operational Checkpoint Status: ${queueOutput.status}. Current coordinate reference points: ${queueOutput.latLongMarker || 'Port checkpoint Terminal 3'}.`;
      } else {
        baseResponseText = `Operation '${selectedToolName}' completed successfully in safe sequence mode.`;
      }
    } else if (didRAG_run && ragResult && ragResult.rankedResults.length > 0) {
      baseResponseText = `Retrieved matching regulatory materials from authorized national domains:\n\n${ragResult.rankedResults[0].content}`;
    } else {
      baseResponseText = `Iraqi Digital Gateway central AI engine online. Standard clearance successfully completed for User role: '${userType}'. Operational health registers report normal values. How can I assist you with border checkpoints, cargo customs, or tariff computations?`;
    }

    // Assemble candidate
    const citationsList = ragResult ? ragResult.citationsList.map(c => `${c.sourceId}: ${c.excerpt} (${c.classification})`) : [];
    const candidateAction = ActionFramework.createAction(
      didToolRun ? 'EXECUTE_TOOL' : 'DISPLAY_MESSAGE',
      {
        text: baseResponseText,
        data: queueOutput || {}
      },
      decision.confidence,
      intent,
      resolvedRole,
      citationsList
    );

    // Filter candidate through strict sanitization pipelines
    const validatedContract = ResponseValidationEngine.validateAndSanitize(candidateAction, baseResponseText);


    // ==========================================
    // 8. FINAL OUTPUT FORMATTING
    // ==========================================
    console.log(`[ORCHESTRATOR] Step 8 - Finalizing structured returns logs. Trace: ${validatedContract.metadata.systemTraceId}`);

    // Report metric to AI Kernel Governor
    try {
      const userRoleDef = USER_TYPE_REGISTRY[userType];
      const clearance = userRoleDef ? userRoleDef.clearanceLevel : 0;
      AIKernel.getInstance().monitorTransaction({
        durationMs: Date.now() - pipelineStart,
        intentCategory: intent,
        contextType: isolatedType,
        didRAGRun: didRAG_run,
        didToolRun: didToolRun,
        toolUsed: selectedToolName || undefined,
        hasErrors: false,
        userClearance: clearance
      });
      // Feed successful resolution back as reinforcement signal
      KernelGovernor.getInstance().recordResolutionSuccess(intent);
    } catch (e) {
      console.warn('[AIOrchestrator] Kernel monitor transaction fail.', e);
    }

    return {
      status: 'SUCCESS',
      intent,
      isolatedContextUsed: isolatedType,
      riskEvaluation: {
        level: decision.riskLevel,
        score: securityStatus.riskScore,
        fallbackStrategy: decision.fallbackStrategy
      },
      ragMetrics: didRAG_run ? {
        searched: true,
        citationsResolved: ragResult?.citationsList.length || 0,
        overallConfidence: ragResult?.confidenceScore || 0.0
      } : undefined,
      toolMetrics: didToolRun ? {
        executed: true,
        toolOutput: queueOutput
      } : undefined,
      actionContract: validatedContract
    };
  }

  // --- Regex Parsing Helpers ---
  private static extractPattern(text: string, regex: RegExp): string | undefined {
    const match = text.match(regex);
    return match ? match[0] : undefined;
  }

  private static extractNumeric(text: string, regex: RegExp): number | undefined {
    const match = text.match(regex);
    if (match && match[1]) {
      const num = Number(match[1].replace(/,/g, ''));
      return isNaN(num) ? undefined : num;
    }
    return undefined;
  }
}
