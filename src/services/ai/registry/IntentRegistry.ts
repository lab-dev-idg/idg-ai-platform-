import { UserType } from './UserRegistry';

/**
 * Iraq Digital Gateway (IDG)
 * Centralized AI Intent Registry
 * 
 * Defines standard intent classifications, routing targets, confidence thresholds,
 * and access control configurations within the IDG AI Brain.
 */

export type IntentCategory =
  | 'GENERAL'
  | 'CUSTOMS'
  | 'SHIPMENT'
  | 'COMPLIANCE'
  | 'GOVERNMENT'
  | 'SUPPORT'
  | 'INCIDENT'
  | 'PARTNERSHIP'
  | 'INVESTOR'
  | 'DEVELOPER'
  | 'TELECOM'
  | 'BANKING';

export interface IntentDefinition {
  category: IntentCategory;
  description: string;
  confidenceThreshold: number; // 0.0 to 1.0
  escclationRoute: string;
  allowedUserTypes: UserType[];
  triggerKeywords: string[];
}

export const INTENT_REGISTRY: Record<IntentCategory, IntentDefinition> = {
  GENERAL: {
    category: 'GENERAL',
    description: 'General informational greetings, systemic overviews, and non-logistical inquiries.',
    confidenceThreshold: 0.50,
    escclationRoute: 'system:general_support',
    allowedUserTypes: ['Citizen', 'Business', 'Government', 'Developer', 'Telecom', 'Bank', 'Fintech', 'Investor', 'Employee', 'Journalist'],
    triggerKeywords: ['سڵاو', 'مرحبا', 'hello', 'hi', 'gateway', 'idg', 'چییە']
  },
  CUSTOMS: {
    category: 'CUSTOMS',
    description: 'Customs valuations, tariff rules, HS code classifications, and import duty computations under Iraqi Customs Law 2026.',
    confidenceThreshold: 0.75,
    escclationRoute: 'customs:duty_auditor',
    allowedUserTypes: ['Citizen', 'Business', 'Government', 'Employee'],
    triggerKeywords: ['گومرگ', 'جمارك', 'تاریفە', 'تعرفة', 'hs', 'customs', 'cif', 'tax', 'باج']
  },
  SHIPMENT: {
    category: 'SHIPMENT',
    description: 'Freight movements, container tracking, route durations, checkpoint checkouts, and port waiting timelines.',
    confidenceThreshold: 0.70,
    escclationRoute: 'logistics:transit_officer',
    allowedUserTypes: ['Business', 'Government', 'Employee'],
    triggerKeywords: ['بار', 'شحنة', 'کۆنتێنەر', 'حاوية', 'ئوم قەسر', 'ام قصر', 'shipment', 'tracking']
  },
  COMPLIANCE: {
    category: 'COMPLIANCE',
    description: 'Regulatory trade restrictions, sanitization, dual-use technology blocks, and legal trade declarations.',
    confidenceThreshold: 0.85,
    escclationRoute: 'compliance:legal_adviser',
    allowedUserTypes: ['Business', 'Government', 'Bank', 'Telecom'],
    triggerKeywords: ['پابەندبوون', 'امتثال', 'حەواڵە', 'حوالة', 'sanction', 'compliance', 'dual-use', 'یاسایی']
  },
  GOVERNMENT: {
    category: 'GOVERNMENT',
    description: 'Inter-agency cross-border clearings, executive commands, state Gazette publications, and ministerial decrees.',
    confidenceThreshold: 0.85,
    escclationRoute: 'sovereign:executive_desk',
    allowedUserTypes: ['Government'],
    triggerKeywords: ['وەزارەت', 'وزارة', 'مەرسوم', 'مرسوم', 'بڕیار', 'قرار', 'government', 'decree', 'commission']
  },
  SUPPORT: {
    category: 'SUPPORT',
    description: 'Technical troubleshooting, transaction disputes, broker license renewals, or customer portal issues.',
    confidenceThreshold: 0.60,
    escclationRoute: 'support:helpdesk_tier1',
    allowedUserTypes: ['Citizen', 'Business', 'Developer', 'Telecom', 'Bank', 'Fintech', 'Investor', 'Employee', 'Journalist'],
    triggerKeywords: ['نوێکردنەوە', 'المساعدة', 'پشتیوانی', 'کێشە', 'مشكلة', 'help', 'support', 'dispute']
  },
  INCIDENT: {
    category: 'INCIDENT',
    description: 'Critical operational disruptions, terminal outages, network offline incidents, or active cargo blockages.',
    confidenceThreshold: 0.90,
    escclationRoute: 'incident:technical_ops_center',
    allowedUserTypes: ['Business', 'Government', 'Telecom', 'Employee'],
    triggerKeywords: ['وەستان', 'متوقف', 'سیستەم', 'نظام', 'ناکارامە', 'Incident', 'critical', 'offline', 'outage']
  },
  PARTNERSHIP: {
    category: 'PARTNERSHIP',
    description: 'Private-public cooperation initiatives, economic corridors development, and bulk logistical integrations.',
    confidenceThreshold: 0.75,
    escclationRoute: 'partnership:relations_board',
    allowedUserTypes: ['Business', 'Investor', 'Government'],
    triggerKeywords: ['هاوبەشی', 'شراكة', 'partnership', 'cooperation', 'mou']
  },
  INVESTOR: {
    category: 'INVESTOR',
    description: 'Foreign direct investment licenses, duty-free special zones exemptions, and capital routing benefits.',
    confidenceThreshold: 0.70,
    escclationRoute: 'investor:promotion_bureau',
    allowedUserTypes: ['Investor', 'Government'],
    triggerKeywords: ['وەبەرهێنان', 'استثمار', 'مۆڵەت', 'رخصة', 'investor', 'capital', 'exemption']
  },
  DEVELOPER: {
    category: 'DEVELOPER',
    description: 'API structures, JSON message testing, sandbox validation procedures, and webhook connection configurations.',
    confidenceThreshold: 0.70,
    escclationRoute: 'dev:engineer_liaison',
    allowedUserTypes: ['Developer'],
    triggerKeywords: ['api', 'webhook', 'sandbox', 'json', 'ڤێرژن', 'كود', 'code', 'token']
  },
  TELECOM: {
    category: 'TELECOM',
    description: 'Iraqi CMC specifications, spectrum allocations, border telecom hub monitoring, and fiber integrity telemetry.',
    confidenceThreshold: 0.80,
    escclationRoute: 'cmc:telecom_cell',
    allowedUserTypes: ['Telecom', 'Government'],
    triggerKeywords: ['فایبەر', 'ألياف', 'مایکرۆویڤ', 'موجات', 'سی ئێم سی', 'cmc', 'telecom', 'fiber', 'spectrum']
  },
  BANKING: {
    category: 'BANKING',
    description: 'Central Bank compliance checks, document escrow verifications, commercial letters of credit, and payment tracking.',
    confidenceThreshold: 0.80,
    escclationRoute: 'cbi:escrow_officer',
    allowedUserTypes: ['Bank', 'Fintech', 'Government'],
    triggerKeywords: ['بانک', 'بنك', 'پارەدان', 'دفع', 'credit', 'escrow', 'cbi', 'المركزي', 'banking']
  }
};

/**
 * Predicts the most likely intent from the user query text using simple keyword weights
 * as a robust local matching engine preceding full model assessment.
 * @param query The user's input prompt
 */
export function classifyIntentLocally(query: string): IntentCategory {
  const normalized = query.toLowerCase();
  
  let bestIntent: IntentCategory = 'GENERAL';
  let bestScore = 0;

  for (const [key, def] of Object.entries(INTENT_REGISTRY)) {
    const intentKey = key as IntentCategory;
    let score = 0;
    for (const keyword of def.triggerKeywords) {
      if (normalized.includes(keyword.toLowerCase())) {
        score += 1;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestIntent = intentKey;
    }
  }

  return bestIntent;
}
