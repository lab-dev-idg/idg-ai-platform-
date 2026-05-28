/**
 * Iraq Digital Gateway (IDG)
 * Secure Tool Execution Layer
 * 
 * Orchestrates safety gates, audits transaction ledger metrics,
 * and validates runtime tool operations.
 */

import { AIContextSnapshot } from '../context/ContextFusion';
import { AIActionContract } from '../action/ActionFramework';
import { ToolId, TOOL_REGISTRY, validateToolInput } from './ToolRegistry';
import { ToolEventEmitter } from './ToolEventEmitter';
import { DecisionEngine } from '../decision/DecisionEngine';

export type ExecutionStatus = 'SUCCESS' | 'SAFETY_REJECTED' | 'INVALID_INPUT' | 'RUNTIME_FAILURE';

export interface AuditLogEntry {
  traceId: string;
  systemTraceId: string;
  userType: string;
  clearanceLevel: number;
  toolId: ToolId;
  actionCode: 'ALLOW' | 'BLOCK' | 'ESCALATE';
  timestamp: string;
  classificationLabel: string;
  checksumConsensusToken?: string;
}

export interface StructuredToolExecutionResult {
  action: string;
  payload: {
    toolId: ToolId;
    success: boolean;
    data: Record<string, unknown>;
    error?: string;
  };
  status: ExecutionStatus;
  confidence: number;
  auditTrail: AuditLogEntry;
  timestamps: {
    receivedAt: string;
    completedAt: string;
    durationMs: number;
  };
}

export class SafetyGuardSystem {
  /**
   * Evaluates the clearance level, user type matrix, and Decision Engine threat indicators
   * to grant or block physical tool executions.
   */
  public static checkSafety(
    toolId: ToolId,
    context: AIContextSnapshot
  ): { isSafe: boolean; warning?: string; actionCode: 'ALLOW' | 'BLOCK' | 'ESCALATE' } {
    const toolDef = TOOL_REGISTRY[toolId];
    if (!toolDef) {
      return { isSafe: false, warning: `Requested tool '${toolId}' is not found in registry.`, actionCode: 'BLOCK' };
    }

    const { userType, securityClearanceLevel } = context;

    // 1. Validate Clearance level threshold
    if (securityClearanceLevel < toolDef.requiredClearanceLevel) {
      const warning = `Sovereign Policy Violation: user type '${userType}' (Level ${securityClearanceLevel}) lacks the minimum Level-${toolDef.requiredClearanceLevel} clearances required to trigger '${toolDef.name}'.`;
      
      // Register security breach event
      ToolEventEmitter.getInstance().emit('security.violation.detected', 'SafetyGuardSystem', {
        toolId,
        userType,
        clearanceLevel: securityClearanceLevel,
        requiredLevel: toolDef.requiredClearanceLevel,
        urgency: 'HIGH'
      });

      return { isSafe: false, warning, actionCode: 'BLOCK' };
    }

    // 2. Validate Role inclusion matrix
    if (!toolDef.allowedUserTypes.includes(userType)) {
      const warning = `Safety Boundary Error: User classification '${userType}' is restricted from executing '${toolId}'.`;
      return { isSafe: false, warning, actionCode: 'BLOCK' };
    }

    // 3. Integrate dynamic risk weight flags from Decision Engine
    const decision = DecisionEngine.resolve(context);
    if (decision.riskLevel === 'CRITICAL' && toolDef.requiredClearanceLevel >= 2) {
      const warning = `System Threat Lock: Execution of high-clearance tool '${toolId}' is frozen due to active network health issues.`;
      
      ToolEventEmitter.getInstance().emit('compliance.alert', 'SafetyGuardSystem', {
        toolId,
        riskLevel: decision.riskLevel,
        reason: 'Network hazard lockdown triggered.'
      });

      return { isSafe: false, warning, actionCode: 'ESCALATE' };
    }

    return { isSafe: true, actionCode: 'ALLOW' };
  }
}

export class ToolExecutionEngine {
  /**
   * Main entry point overseeing the validation, execution simulation, and auditing of tool tasks.
   */
  public static async execute(
    actionContract: AIActionContract,
    context: AIContextSnapshot
  ): Promise<StructuredToolExecutionResult> {
    const receivedAt = new Date().toISOString();
    const startTimeStamp = Date.now();
    
    // Resolve target tool ID from parsed contract parameters
    const rawToolId = actionContract.payload.toolName || actionContract.payload.data?.toolName;
    const toolId = rawToolId as ToolId;
    const toolInput = actionContract.payload.toolInput || actionContract.payload.data?.toolInput || {};

    const executionTraceId = `IDG-EXEC-${Math.floor(100000 + Math.random() * 900000)}-${new Date().getFullYear()}`;
    const sysTrace = actionContract.metadata.systemTraceId;

    // Default empty stub for audit trail logging
    const defaultAudit = (actionCode: 'ALLOW' | 'BLOCK' | 'ESCALATE'): AuditLogEntry => {
      let classification = 'Public Release (Level-0)';
      if (context.securityClearanceLevel === 1) classification = 'Authorized Operational (Level-1)';
      else if (context.securityClearanceLevel === 2) classification = 'Restricted Transit (Level-2)';
      else if (context.securityClearanceLevel === 3) classification = 'Sovereign Audited (Level-3)';
      else if (context.securityClearanceLevel === 4) classification = 'Executive Secret (Level-4)';

      return {
        traceId: executionTraceId,
        systemTraceId: sysTrace,
        userType: context.userType,
        clearanceLevel: context.securityClearanceLevel,
        toolId: toolId || 'customs.calculateDuty',
        actionCode,
        timestamp: new Date().toISOString(),
        classificationLabel: classification,
        checksumConsensusToken: context.operationalState.checksumConsensusToken
      };
    };

    // 1. Filter corrupt or empty tool IDs immediately
    if (!toolId || !TOOL_REGISTRY[toolId]) {
      const durationMs = Date.now() - startTimeStamp;
      return {
        action: 'EXECUTE_TOOL_REJECTED',
        payload: {
          toolId: toolId || 'customs.calculateDuty',
          success: false,
          error: `Execution terminated. ToolId '${rawToolId}' represents an unregistered operation.`
        },
        status: 'RUNTIME_FAILURE',
        confidence: 0.00,
        auditTrail: defaultAudit('BLOCK'),
        timestamps: { receivedAt, completedAt: new Date().toISOString(), durationMs }
      };
    }

    // 2. Perform safety gate audits (Safety Guard boundary checking)
    const safetyResult = SafetyGuardSystem.checkSafety(toolId, context);
    if (!safetyResult.isSafe) {
      const durationMs = Date.now() - startTimeStamp;
      return {
        action: 'EXECUTE_TOOL_BLOCKED',
        payload: {
          toolId,
          success: false,
          error: safetyResult.warning || 'Operational safety boundaries rejected transaction.'
        },
        status: safetyResult.actionCode === 'ESCALATE' ? 'SAFETY_REJECTED' : 'SAFETY_REJECTED',
        confidence: actionContract.confidence,
        auditTrail: defaultAudit(safetyResult.actionCode),
        timestamps: { receivedAt, completedAt: new Date().toISOString(), durationMs }
      };
    }

    // 3. Confirm target parameters match required schemas
    const schemaValidation = validateToolInput(toolId, toolInput);
    if (!schemaValidation.isValid) {
      const durationMs = Date.now() - startTimeStamp;
      return {
        action: 'EXECUTE_TOOL_INVALID',
        payload: {
          toolId,
          success: false,
          error: schemaValidation.error || 'Input validation failed.'
        },
        status: 'INVALID_INPUT',
        confidence: actionContract.confidence,
        auditTrail: defaultAudit('ALLOW'),
        timestamps: { receivedAt, completedAt: new Date().toISOString(), durationMs }
      };
    }

    // 4. Perform stable business execution simulations representing our functional sandbox
    let outputData: Record<string, unknown> = {};
    const params = toolInput as Record<string, unknown>;

    try {
      switch (toolId) {
        case 'customs.calculateDuty': {
          const rawCif = Number(params.cifValueUSD) || 0;
          const baseRate = params.hsCode === '8703.23' ? 0.15 : 0.08; // cars vs general cargo
          
          const totalDutiesUSD = Math.round(rawCif * baseRate);
          const salesTaxUSD = Math.round((rawCif + totalDutiesUSD) * 0.05);
          const regulatoryFeesUSD = 450;
          const totalChargesUSD = totalDutiesUSD + salesTaxUSD + regulatoryFeesUSD;

          outputData = {
            totalDutiesUSD,
            salesTaxUSD,
            regulatoryFeesUSD,
            totalChargesUSD,
            regulatoryNote: 'Duty calculation structured under Iraqi Tariff Decree No. 4 of 2026.'
          };

          ToolEventEmitter.getInstance().emit('customs.review.completed', 'ToolExecutionEngine', {
            manifestId: 'AUTO-CIF-GEN',
            totalChargesUSD,
            agentCleared: context.userType
          });
          break;
        }

        case 'customs.classifyHS': {
          const desc = String(params.cargoDescription || '').toLowerCase();
          let matchedHSCode = '8517.13.00'; // smartphones default
          let baseTariffRatePercent = 10;
          let matchConfidence = 0.90;

          if (desc.includes('car') || desc.includes('vehicle')) {
            matchedHSCode = '8703.23.10';
            baseTariffRatePercent = 15;
            matchConfidence = 0.95;
          } else if (desc.includes('wheat') || desc.includes('grain') || desc.includes('food')) {
            matchedHSCode = '1001.99.00';
            baseTariffRatePercent = 0; // Essential foodstuffs exempt
            matchConfidence = 0.98;
          }

          outputData = {
            matchedHSCode,
            confidenceScore: matchConfidence,
            baseTariffRatePercent,
            classificationRoot: 'General Customs Commission Directory 2026'
          };
          break;
        }

        case 'logistics.trackShipment': {
          const mId = String(params.manifestId || '');
          outputData = {
            manifestId: mId,
            status: mId.startsWith('IDG-ERR') ? 'CONTAINER_HOLD_HOLY_HOLDS' : 'IN_TRANSIT_GATEWAY',
            lastCheckpoint: 'Umm Qasr Northern Terminal Checkpoint 3',
            vesselFlag: 'Panama (PA)',
            latLongMarker: '30.0416° N, 47.9331° E',
            estimatedArrival: new Date(Date.now() + 86400000 * 2).toISOString()
          };

          ToolEventEmitter.getInstance().emit('shipment.updated', 'ToolExecutionEngine', {
            manifestId: mId,
            status: 'IN_TRANSIT_GATEWAY',
            node: 'UMM_QASR'
          });
          break;
        }

        case 'compliance.checkSanctions': {
          const name = String(params.entityName || '').toLowerCase();
          const isBlocked = name.includes('blocked-shipper') || name.includes('restricted-logistics-corp') || name.includes('al-faw-leak-unverified-cargo');
          
          outputData = {
            isBlocked,
            matchConfidence: isBlocked ? 0.99 : 0.88,
            regulatoryReference: isBlocked ? 'CBI Directive No. 44-D on Financial Entities Compliance' : 'Passed sanction check'
          };

          if (isBlocked) {
            ToolEventEmitter.getInstance().emit('compliance.alert', 'ToolExecutionEngine', {
              challengedEntity: name,
              actionStatus: 'TRANSACTION_HOLD',
              clearanceLevel: context.securityClearanceLevel
            });
          }
          break;
        }

        case 'notifications.dispatch': {
          const port = String(params.targetPortId || '');
          const body = String(params.messageBody || '');
          outputData = {
            broadcastId: `BC-${Math.floor(1000 + Math.random() * 9000)}`,
            nodesNotifiedCount: port === 'UMM_QASR' ? 12 : 3,
            deliveryStatus: 'COMMITTED_TO_BROADCAST_RAILS'
          };
          
          ToolEventEmitter.getInstance().emit('compliance.alert', 'ToolExecutionEngine', {
            targetPortId: port,
            severity: params.severity || 'INFO',
            body
          });
          break;
        }

        case 'audit.logEvent': {
          outputData = {
            ledgerBlockIndex: Math.floor(125000 + Math.random() * 25000),
            timestamp: new Date().toISOString(),
            status: 'BLOCK_COMMITTED_ConsensusOptimal'
          };
          break;
        }

        default:
          throw new Error(`Execution routing for '${toolId}' is not configured inside runtime.`);
      }

      // Record successful trace executions
      ToolEventEmitter.getInstance().emit('ai.action.executed', 'ToolExecutionEngine', {
        toolId,
        durationMs: Date.now() - startTimeStamp,
        success: true
      });

      const durationMs = Date.now() - startTimeStamp;

      return {
        action: 'EXECUTE_TOOL_SUCCESS',
        payload: {
          toolId,
          success: true,
          data: outputData
        },
        status: 'SUCCESS',
        confidence: actionContract.confidence,
        auditTrail: defaultAudit('ALLOW'),
        timestamps: { receivedAt, completedAt: new Date().toISOString(), durationMs }
      };

    } catch (err: unknown) {
      const durationMs = Date.now() - startTimeStamp;
      const errorMsg = err instanceof Error ? err.message : 'Unknown exception raised inside executor pipeline.';
      
      console.error(`[IDG-TOOL-RUNTIME-FAILURE] '${toolId}' crashed during evaluation:`, err);

      return {
        action: 'EXECUTE_TOOL_FAILURE',
        payload: {
          toolId,
          success: false,
          error: errorMsg
        },
        status: 'RUNTIME_FAILURE',
        confidence: actionContract.confidence,
        auditTrail: defaultAudit('ALLOW'),
        timestamps: { receivedAt, completedAt: new Date().toISOString(), durationMs }
      };
    }
  }
}
