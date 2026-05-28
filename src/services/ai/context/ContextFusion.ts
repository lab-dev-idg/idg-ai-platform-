import { UserType, USER_TYPE_REGISTRY } from '../registry/UserRegistry';
import { IntentCategory, classifyIntentLocally } from '../registry/IntentRegistry';
import { IDGOperationalState, ContextEngine, CompleteAIContext } from './ContextEngine';

/**
 * Iraq Digital Gateway (IDG)
 * AI Context Snapshot model.
 * 
 * Unifies all operational context parameters into a secure single-token snapshot.
 */
export interface AIContextSnapshot {
  intent: IntentCategory;
  userType: UserType;
  currentRoute: string;
  activeModule: string;
  language: 'ku' | 'ar' | 'en';
  operationalState: IDGOperationalState;
  securityClearanceLevel: number; // derived 0 (public) to 4 (secret)
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export class ContextFusion {
  /**
   * Fuses metadata, client context, and identified intent into a unified context snapshot.
   * Ensures clearance and module state attributes match the register parameters exactly.
   */
  public static fuse(
    intent: IntentCategory,
    clientContext: CompleteAIContext
  ): AIContextSnapshot {
    // Retrieve clearance level from Registry definition
    const userDef = USER_TYPE_REGISTRY[clientContext.userType];
    const clearanceLevel = userDef ? userDef.clearanceLevel : 0;

    return {
      intent,
      userType: clientContext.userType,
      currentRoute: clientContext.currentRoute,
      activeModule: clientContext.activeModule,
      language: clientContext.language,
      operationalState: clientContext.operationalState,
      securityClearanceLevel: clearanceLevel,
      timestamp: new Date().toISOString(),
      metadata: {
        ...clientContext.metadata,
        isPrivilegedUser: userDef ? userDef.isPrivileged : false,
        allowedScopes: userDef ? userDef.allowedScopes : []
      }
    };
  }

  /**
   * Quick utility to auto-collect environment parameters and fuse with a given user message intent.
   */
  public static createSnapshotFromQuery(
    queryText: string,
    overrideUserType?: UserType,
    overrideLanguage?: 'ku' | 'ar' | 'en'
  ): AIContextSnapshot {
    const rawContext = ContextEngine.collectContext(overrideUserType, overrideLanguage);
    const intent = classifyIntentLocally(queryText);

    return this.fuse(intent, rawContext);
  }
}
