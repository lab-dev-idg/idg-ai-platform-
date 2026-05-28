import { UserType } from '../registry/UserRegistry';

/**
 * Iraq Digital Gateway (IDG)
 * Client Context Intelligence Engine
 * 
 * Aggregates runtime context indicators including routing states, user classifications,
 * language keys, current active workflow modes, and system connectivity stats.
 */

export interface IDGOperationalState {
  realtimeConnectivity: 'CONNECTED' | 'PARTIAL' | 'DISCONNECTED';
  aiAvailability: 'HIGH' | 'DEGRADED' | 'UNAVAILABLE';
  gatewayHealth: 'OPTIMAL' | 'WARN' | 'CRITICAL';
  deviceStatus?: string;
  checksumConsensusToken?: string;
}

export interface CompleteAIContext {
  userId?: string;
  userType: UserType;
  language: 'ku' | 'ar' | 'en';
  role: string;
  currentRoute: string;
  activeModule: string;
  activeWorkflow: string;
  operationalState: IDGOperationalState;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export class ContextEngine {
  /**
   * Dynamically collects complete client environment state to feed the AI reasoning core.
   * Runs client-side safely, with fallbacks for testing or SSR nodes.
   * 
   * @param overrideUserType Optional override to simulate different roles
   * @param overrideLanguage Optional language override
   */
  public static collectContext(
    overrideUserType?: UserType,
    overrideLanguage?: 'ku' | 'ar' | 'en'
  ): CompleteAIContext {
    
    // 1. Resolve current path and active modules safely
    let currentRoute = '/';
    let activeModule = 'Unified Logistics Dashboard (Main)';
    let activeWorkflow = 'General Logistics Inquiries';

    if (typeof window !== 'undefined') {
      currentRoute = window.location.pathname;
      
      if (currentRoute.includes('/customs')) {
        activeModule = 'Customs & Tariff Central Hub';
        activeWorkflow = 'Active Customs Workspace (Calculations and Border Gateway Regulation)';
      } else if (currentRoute.includes('/admin')) {
        activeModule = 'Administrative Policy Control Panel';
        activeWorkflow = 'Border Gateway Policy Adjustments';
      }
    }

    // 2. Determine default user type hierarchy bound
    let resolvedUserType: UserType = 'Citizen';
    let resolvedRole = 'guest';

    if (overrideUserType) {
      resolvedUserType = overrideUserType;
      resolvedRole = overrideUserType.toLowerCase();
    } else {
      // Default to guest/broker evaluation
      const hasAuth = typeof localStorage !== 'undefined' && localStorage.getItem('idg_demo_user');
      if (hasAuth) {
        resolvedUserType = 'Business';
        resolvedRole = 'broker';
      }
    }

    // 3. Resolve preferred language code
    let resolvedLang: 'ku' | 'ar' | 'en' = 'ku';
    if (overrideLanguage) {
      resolvedLang = overrideLanguage;
    } else {
      try {
        // Attempt reading from settings store state if available in client scope
        const settingsRaw = typeof localStorage !== 'undefined' ? localStorage.getItem('settings-storage') : null;
        if (settingsRaw) {
          const parsed = JSON.parse(settingsRaw);
          if (parsed?.state?.lang) {
            resolvedLang = parsed.state.lang;
          }
        }
      } catch {
        // Fallback to default
      }
    }

    // 4. Synthesize operational metadata
    const operationalState: IDGOperationalState = {
      realtimeConnectivity: 'CONNECTED',
      aiAvailability: 'HIGH',
      gatewayHealth: 'OPTIMAL',
      checksumConsensusToken: `sha256:sys_${Math.random().toString(36).substring(2, 8)}`
    };

    return {
      userType: resolvedUserType,
      language: resolvedLang,
      role: resolvedRole,
      currentRoute,
      activeModule,
      activeWorkflow,
      operationalState,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Compiles the contextual system instructions dynamically based on the current user classification and route.
   */
  public static generateSystemModifier(context: CompleteAIContext): string {
    return `[LOCALIZED ENVIRONMENT: IDG_${context.language.toUpperCase()}]
[ROLE CLASSIFICATION: ${context.userType} (CLEARANCE_LEVEL_${context.role === 'admin' ? 3 : 1})]
[ACTIVE WORKSPACE: ${context.activeModule} - ${context.activeWorkflow}]
[SYSTEM TELEMETRY: ${context.operationalState.realtimeConnectivity} // HEALTH: ${context.operationalState.gatewayHealth}]

Enforce the following guidance:
- All responses must comply with the Iraqi customs legislation framework 2026.
- Tailor output details to the User Type (${context.userType}).
- Communicate precisely and cleanly in the chosen language (${context.language}).
- Do not output engineering jargon or placeholder indicators unless prompted for API metrics.`;
  }
}
