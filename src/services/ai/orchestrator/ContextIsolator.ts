/**
 * Iraq Digital Gateway (IDG)
 * Context Isolation Layer
 *
 * Implements architectural boundaries that compile, validate, and cache isolated context scopes
 * for CHAT_CONTEXT, CUSTOMS_CONTEXT, SHIPMENT_CONTEXT, and ADMIN_CONTEXT.
 * Enforces zero shared mutable states and prevents cross-compartment data exposure.
 */

import { UserType, USER_TYPE_REGISTRY } from '../registry/UserRegistry';
import { IDGOperationalState } from '../context/ContextEngine';

export type IsolatedContextType =
  | 'CHAT_CONTEXT'
  | 'CUSTOMS_CONTEXT'
  | 'SHIPMENT_CONTEXT'
  | 'ADMIN_CONTEXT';

export interface BaseIsolatedContext {
  contextId: string;
  type: IsolatedContextType;
  userType: UserType;
  language: 'ku' | 'ar' | 'en';
  timestamp: string;
  operationalState: IDGOperationalState;
}

export interface ChatContext extends BaseIsolatedContext {
  type: 'CHAT_CONTEXT';
  chatHistoryLength: number;
  sessionUptimeSeconds: number;
  activeTopic?: string;
}

export interface CustomsContext extends BaseIsolatedContext {
  type: 'CUSTOMS_CONTEXT';
  calculatorMetrics: {
    hsCode?: string;
    cifValueUSD?: number;
    weightKg?: number;
    isTaxHolidayApplied: boolean;
  };
  validatedFormulaTag: string;
}

export interface ShipmentContext extends BaseIsolatedContext {
  type: 'SHIPMENT_CONTEXT';
  trackingDetails: {
    activeManifestId?: string;
    monitoredPortId?: string;
    lastTerminalLog?: string;
  };
}

export interface AdminContext extends BaseIsolatedContext {
  type: 'ADMIN_CONTEXT';
  policyOverrides: {
    activeEmergencyLock: boolean;
    authorizedNodesCount: number;
    multisigApproved: boolean;
  };
}

export type AnyIsolatedContext = ChatContext | CustomsContext | ShipmentContext | AdminContext;

export class ContextIsolator {
  // Compartmentalized Silo Cache for context types to enforce lazy and cached reuse
  private static caches: Record<IsolatedContextType, Map<string, AnyIsolatedContext>> = {
    CHAT_CONTEXT: new Map(),
    CUSTOMS_CONTEXT: new Map(),
    SHIPMENT_CONTEXT: new Map(),
    ADMIN_CONTEXT: new Map(),
  };

  /**
   * Generates a unique cache lookup key for a user type and session combination.
   */
  private static generateKey(userType: UserType, language: string, contextId?: string): string {
    const cid = contextId || 'GLOBAL-DEFAULT-SESSION';
    return `${userType}:${language}:${cid}`;
  }

  /**
   * Independently computes context data for a target isolation compartment.
   */
  public static compute(
    type: IsolatedContextType,
    userType: UserType,
    language: 'ku' | 'ar' | 'en',
    operationalState: IDGOperationalState,
    payload: Record<string, unknown> = {},
    contextId?: string
  ): AnyIsolatedContext {
    const key = this.generateKey(userType, language, contextId);
    const cached = this.caches[type].get(key);

    if (cached) {
      // Return highly performant cached instance if state hasn't been purposely invalidated
      return cached;
    }

    const base: BaseIsolatedContext = {
      contextId: contextId || `CTX-${Math.floor(100000 + Math.random() * 900000)}`,
      type,
      userType,
      language,
      timestamp: new Date().toISOString(),
      operationalState: { ...operationalState },
    };

    let computed: AnyIsolatedContext;

    switch (type) {
      case 'CHAT_CONTEXT':
        computed = {
          ...base,
          type: 'CHAT_CONTEXT',
          chatHistoryLength: Number(payload.chatHistoryLength) || 0,
          sessionUptimeSeconds: Number(payload.sessionUptimeSeconds) || 120,
          activeTopic: payload.activeTopic ? String(payload.activeTopic) : 'general_help',
        } as ChatContext;
        break;

      case 'CUSTOMS_CONTEXT':
        computed = {
          ...base,
          type: 'CUSTOMS_CONTEXT',
          calculatorMetrics: {
            hsCode: payload.hsCode ? String(payload.hsCode) : undefined,
            cifValueUSD: payload.cifValueUSD !== undefined ? Number(payload.cifValueUSD) : undefined,
            weightKg: payload.weightKg !== undefined ? Number(payload.weightKg) : undefined,
            isTaxHolidayApplied: !!payload.isTaxHolidayApplied,
          },
          validatedFormulaTag: payload.validatedFormulaTag
            ? String(payload.validatedFormulaTag)
            : 'TARIFF_ACT_2026_DEFAULT',
        } as CustomsContext;
        break;

      case 'SHIPMENT_CONTEXT':
        computed = {
          ...base,
          type: 'SHIPMENT_CONTEXT',
          trackingDetails: {
            activeManifestId: payload.activeManifestId ? String(payload.activeManifestId) : undefined,
            monitoredPortId: payload.monitoredPortId ? String(payload.monitoredPortId) : undefined,
            lastTerminalLog: payload.lastTerminalLog ? String(payload.lastTerminalLog) : undefined,
          },
        } as ShipmentContext;
        break;

      case 'ADMIN_CONTEXT':
        computed = {
          ...base,
          type: 'ADMIN_CONTEXT',
          policyOverrides: {
            activeEmergencyLock: !!payload.activeEmergencyLock,
            authorizedNodesCount: Number(payload.authorizedNodesCount) || 5,
            multisigApproved: !!payload.multisigApproved,
          },
        } as AdminContext;
        break;

      default:
        throw new Error(`Unknown isolation unit context type '${type}' configured.`);
    }

    // Secure validation before write
    const validation = this.validate(computed);
    if (!validation.isValid) {
      throw new Error(`Validation Violation during context computation: ${validation.error}`);
    }

    // Cache computed state under strict isolated boundaries
    this.caches[type].set(key, computed);
    return computed;
  }

  /**
   * Independently validates each isolated context structure.
   * Enforces zero leakage of customs or administrative structures into unverified areas.
   */
  public static validate(context: AnyIsolatedContext): { isValid: boolean; error?: string } {
    const userRoleDef = USER_TYPE_REGISTRY[context.userType];
    const userClearance = userRoleDef ? userRoleDef.clearanceLevel : 0;

    // Boundary 1: Common parameters validation
    if (!context.contextId || !context.type || !context.userType || !context.language) {
      return { isValid: false, error: 'Context structure misses required system parameters.' };
    }

    // Boundary 2: Verify clearance level and accessibility policies per context compartment
    switch (context.type) {
      case 'CHAT_CONTEXT':
        // General support chat has public boundaries (allow all levels)
        if (context.userType === 'Journalist' && context.language !== 'en' && context.language !== 'ar') {
          return { isValid: false, error: 'Language preference for press briefings must reside in EN/AR.' };
        }
        break;

      case 'CUSTOMS_CONTEXT': {
        // Customs metrics contain standard calculations -> Clearance level 0+ allowed, but must prevent leaks
        const calc = context.calculatorMetrics;
        if (calc.cifValueUSD !== undefined && calc.cifValueUSD < 0) {
          return { isValid: false, error: 'Security leak blocker: Negative financial valuations represent overflow threats.' };
        }
        if (calc.hsCode && !/^\d{4}(\.\d{2})*$/.test(calc.hsCode)) {
          return { isValid: false, error: 'Invalid HS code format signature (numeric block sequences required).' };
        }
        break;
      }

      case 'SHIPMENT_CONTEXT':
        // Shipment status queries strictly require clearance floor 1
        if (userClearance < 1) {
          return { isValid: false, error: 'Data Contamination Deflector: Unprivileged viewers cannot initiate shipment context tracks.' };
        }
        break;

      case 'ADMIN_CONTEXT':
        // Administration context maps executive states, strictly blocks user clearance levels below 3
        if (userClearance < 3) {
          return { isValid: false, error: 'Isolation Breach: Elevated admin context states strictly block access below Level-3.' };
        }
        break;
    }

    return { isValid: true };
  }

  /**
   * Invalidates custom compartment caches when users re-authenticate or clear states.
   */
  public static invalidateWorkspace(type?: IsolatedContextType): void {
    if (type) {
      this.caches[type].clear();
    } else {
      Object.keys(this.caches).forEach(key => {
        this.caches[key as IsolatedContextType].clear();
      });
    }
    console.log(`[CONTEXT-ISOLATION] Flushed in-memory isolated context cache.`);
  }
}
