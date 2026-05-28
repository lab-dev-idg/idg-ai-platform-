/**
 * Iraq Digital Gateway (IDG)
 * Centralized User Type Registry
 * 
 * Defines standard user classifications, clearance/access levels,
 * and privilege matrices utilized by the AI Brain routing and validation rules.
 */

export type UserType =
  | 'Citizen'
  | 'Business'
  | 'Government'
  | 'Developer'
  | 'Telecom'
  | 'Bank'
  | 'Fintech'
  | 'Investor'
  | 'Employee'
  | 'Journalist';

export interface UserClassDefinition {
  type: UserType;
  clearanceLevel: number; // 0 (lowest/public) to 4 (highest/secret)
  description: string;
  isPrivileged: boolean;
  allowedScopes: string[];
}

export const USER_TYPE_REGISTRY: Record<UserType, UserClassDefinition> = {
  Citizen: {
    type: 'Citizen',
    clearanceLevel: 0,
    description: 'General public citizen querying for personal tariff calculations, customs instructions, or basic logistics guidelines.',
    isPrivileged: false,
    allowedScopes: ['public:read', 'helpdesk:create']
  },
  Business: {
    type: 'Business',
    clearanceLevel: 1,
    description: 'Verified trade brokers, logistics operators, freight carriers, or merchant cargo owners processing official manifests.',
    isPrivileged: false,
    allowedScopes: ['public:read', 'manifest:write', 'calculator:execute', 'backup:execute']
  },
  Developer: {
    type: 'Developer',
    clearanceLevel: 1,
    description: 'System software developers, API integrators, or technological partners building on IDG Gateway standards.',
    isPrivileged: false,
    allowedScopes: ['public:read', 'sandbox:execute', 'api:test']
  },
  Investor: {
    type: 'Investor',
    clearanceLevel: 1,
    description: 'National or foreign direct investors researching economic zones, customs benefits, or investment project requirements.',
    isPrivileged: false,
    allowedScopes: ['public:read', 'investment:view']
  },
  Journalist: {
    type: 'Journalist',
    clearanceLevel: 0,
    description: 'Press or public communications entities searching public records, port schedules, or economic policy updates.',
    isPrivileged: false,
    allowedScopes: ['public:read']
  },
  Telecom: {
    type: 'Telecom',
    clearanceLevel: 2,
    description: 'Telecommunications provider engineers overseeing fiber deployments, regional connectivity, and checkpoint CMC routing.',
    isPrivileged: true,
    allowedScopes: ['public:read', 'telecom:write', 'diagnostics:execute']
  },
  Bank: {
    type: 'Bank',
    clearanceLevel: 3,
    description: 'Commercial bank operators authorized to match customs values against official letters of credit or trade assurances.',
    isPrivileged: true,
    allowedScopes: ['public:read', 'trade:audit', 'financial:write']
  },
  Fintech: {
    type: 'Fintech',
    clearanceLevel: 2,
    description: 'Licensed financial institutions connecting payment APIs and customs escrow systems.',
    isPrivileged: false,
    allowedScopes: ['public:read', 'escrow:execute', 'api:test']
  },
  Government: {
    type: 'Government',
    clearanceLevel: 3,
    description: 'Ministry of Finance, Planning, or Transportation officials overseeing border clearances or customs compliance.',
    isPrivileged: true,
    allowedScopes: ['public:read', 'audit:execute', 'compliance:write', 'decree:create']
  },
  Employee: {
    type: 'Employee',
    clearanceLevel: 2,
    description: 'Border Port Commission staff, cargo handlers, security guards, or operational terminal clerks checking credentials.',
    isPrivileged: false,
    allowedScopes: ['public:read', 'manifest:verify', 'alert:dispatch']
  }
};

/**
 * Validates whether a given user classification has sufficient clearance
 * @param userType The level of the querying user
 * @param requiredLevel The minimum security level required
 */
export function hasClearance(userType: UserType, requiredLevel: number): boolean {
  const definition = USER_TYPE_REGISTRY[userType];
  if (!definition) return false;
  return definition.clearanceLevel >= requiredLevel;
}
