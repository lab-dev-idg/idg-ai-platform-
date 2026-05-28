/**
 * Iraq Digital Gateway (IDG)
 * Central Tool Registry and Spec Schema
 * 
 * Defines allowed programmatic actions, input/output structures,
 * and security parameters for safe AI operations.
 */

import { UserType } from '../registry/UserRegistry';

export type ToolId =
  | 'customs.calculateDuty'
  | 'customs.classifyHS'
  | 'logistics.trackShipment'
  | 'compliance.checkSanctions'
  | 'notifications.dispatch'
  | 'audit.logEvent';

export interface SchemaField {
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  description: string;
  required: boolean;
}

export interface ToolDefinition {
  toolId: ToolId;
  name: string;
  description: string;
  requiredClearanceLevel: number; // 0 to 4 clearance level
  allowedUserTypes: UserType[];
  inputSchema: Record<string, SchemaField>;
  outputSchema: Record<string, SchemaField>;
}

export const TOOL_REGISTRY: Record<ToolId, ToolDefinition> = {
  'customs.calculateDuty': {
    toolId: 'customs.calculateDuty',
    name: 'Calculate Duty',
    description: 'Computes customs duties, sales tax, and regulatory fees using HS codes, CIF values, and weight metrics under Iraqi Customs Law 2026.',
    requiredClearanceLevel: 0, // General Citizens and above
    allowedUserTypes: ['Citizen', 'Business', 'Government', 'Employee'],
    inputSchema: {
      hsCode: { type: 'string', description: 'Unified HS code of freight (e.g., "8703.23")', required: true },
      cifValueUSD: { type: 'number', description: 'Declarable Cost, Insurance, and Freight value in USD', required: true },
      weightKg: { type: 'number', description: 'Net weight of the cargo in kilograms', required: false }
    },
    outputSchema: {
      totalDutiesUSD: { type: 'number', description: 'Primary calculated import tax duty', required: true },
      salesTaxUSD: { type: 'number', description: 'Sales tax component bound under legal margins', required: true },
      regulatoryFeesUSD: { type: 'number', description: 'Border commission administrative processing levy', required: true },
      totalChargesUSD: { type: 'number', description: 'Sum total of all border duties and taxes', required: true }
    }
  },
  'customs.classifyHS': {
    toolId: 'customs.classifyHS',
    name: 'Classify HS Code',
    description: 'Matches raw cargo text descriptions against standard HS classifications and trade tariff sections.',
    requiredClearanceLevel: 0,
    allowedUserTypes: ['Citizen', 'Business', 'Government', 'Developer', 'Investor', 'Employee', 'Journalist'],
    inputSchema: {
      cargoDescription: { type: 'string', description: 'Verbose description of the logistics goods', required: true },
      countryOfOrigin: { type: 'string', description: 'Origin nation for preferential trade correlation', required: false }
    },
    outputSchema: {
      matchedHSCode: { type: 'string', description: 'Closest matching standard HS digit sequence', required: true },
      confidenceScore: { type: 'number', description: 'Algorithmic matching confidence', required: true },
      baseTariffRatePercent: { type: 'number', description: 'Standard ad-valorem tax rate percentage', required: true }
    }
  },
  'logistics.trackShipment': {
    toolId: 'logistics.trackShipment',
    name: 'Track Shipment Manifest',
    description: 'Fetches real-time status, active coordinate markers, operational checkpoint clearance trails, and route deviations.',
    requiredClearanceLevel: 1, // Requires broker registered access
    allowedUserTypes: ['Business', 'Government', 'Employee', 'Telecom', 'Bank', 'Fintech', 'Investor'],
    inputSchema: {
      manifestId: { type: 'string', description: 'IDG cargo manifest tracking token', required: true }
    },
    outputSchema: {
      manifestId: { type: 'string', description: 'Sovereign tracking ID', required: true },
      status: { type: 'string', description: 'Operational checkpoint status (e.g., "ARRIVED_AT_PORT")', required: true },
      lastCheckpoint: { type: 'string', description: 'Name of the last successfully cleared gateway node', required: true },
      vesselFlag: { type: 'string', description: 'Registration flag of transporting vessel', required: false }
    }
  },
  'compliance.checkSanctions': {
    toolId: 'compliance.checkSanctions',
    name: 'Sanctions Screener',
    description: 'Checks companies, vessels, or brokers against CBI and global dual-use sanction lists.',
    requiredClearanceLevel: 2, // Trusted Operators
    allowedUserTypes: ['Government', 'Bank', 'Telecom', 'Employee', 'Fintech'],
    inputSchema: {
      entityName: { type: 'string', description: 'Full legal name of the carrier company, vessel, or trader', required: true },
      taxId: { type: 'string', description: 'Iraqi system tax registration identifier', required: false }
    },
    outputSchema: {
      isBlocked: { type: 'boolean', description: 'Whether the target matches restricted sanctions catalogs', required: true },
      matchConfidence: { type: 'number', description: 'Fuzzy comparison database confidence score', required: true },
      regulatoryReference: { type: 'string', description: 'CBI Decree or Gazette directive blocking the entity', required: false }
    }
  },
  'notifications.dispatch': {
    toolId: 'notifications.dispatch',
    name: 'Dispatch Border Alert',
    description: 'Transmits urgent operational messages or system flags to local border ports.',
    requiredClearanceLevel: 2,
    allowedUserTypes: ['Government', 'Telecom', 'Employee'],
    inputSchema: {
      targetPortId: { type: 'string', description: 'Target identifier for port commission display rails (e.g., "UMM_QASR")', required: true },
      severity: { type: 'string', description: 'Urgency flag (e.g. "INFO", "WARN", "CRITICAL")', required: true },
      messageBody: { type: 'string', description: 'Detailed notice body to dispatch', required: true }
    },
    outputSchema: {
      broadcastId: { type: 'string', description: 'Unique identification code for trace auditing', required: true },
      nodesNotifiedCount: { type: 'number', description: 'Number of terminal displays responding', required: true }
    }
  },
  'audit.logEvent': {
    toolId: 'audit.logEvent',
    name: 'Log Sovereign Audit Event',
    description: 'Logs highly auditable events such as system changes or administrative changes to immutable ledger streams.',
    requiredClearanceLevel: 2,
    allowedUserTypes: ['Government', 'Telecom', 'Employee', 'Bank'],
    inputSchema: {
      eventType: { type: 'string', description: 'Category identifier of the logged activity', required: true },
      summary: { type: 'string', description: 'Human-readable diagnostic summary message', required: true },
      payloadDigest: { type: 'string', description: 'Security checksum mapping metadata parameters', required: true }
    },
    outputSchema: {
      ledgerBlockIndex: { type: 'number', description: 'Deterministic indexing parameter matching transaction', required: true },
      timestamp: { type: 'string', description: 'ISO transaction log date', required: true }
    }
  }
};

/**
 * Validates whether an input object perfectly conforms to the required fields and types designated by the registry tool schema.
 * 
 * @param toolId The target tool identifier
 * @param input Raw incoming input variables
 */
export function validateToolInput(toolId: ToolId, input: unknown): { isValid: boolean; error?: string } {
  const tool = TOOL_REGISTRY[toolId];
  if (!tool) {
    return { isValid: false, error: `Tool with identifier '${toolId}' is not registered.` };
  }

  if (typeof input !== 'object' || input === null) {
    return { isValid: false, error: 'Input variables must be packaged inside a structured JSON object.' };
  }

  const typedInput = input as Record<string, unknown>;

  for (const [fieldName, spec] of Object.entries(tool.inputSchema)) {
    const value = typedInput[fieldName];

    if (spec.required && (value === undefined || value === null)) {
      return { isValid: false, error: `Required input parameter '${fieldName}' was not supplied.` };
    }

    if (value !== undefined && value !== null) {
      const typeMatches = spec.type === 'array' ? Array.isArray(value) : typeof value === spec.type;
      if (!typeMatches) {
        return { isValid: false, error: `Field '${fieldName}' carries invalid product type. Expected type: '${spec.type}', received: '${typeof value}'.` };
      }
    }
  }

  return { isValid: true };
}
