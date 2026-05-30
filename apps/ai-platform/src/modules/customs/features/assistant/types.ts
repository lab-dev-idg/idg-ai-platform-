export interface ImporterProductInput {
  productName: string;
  productDescription: string;
  quantity: number;
  originCountry: string;
  invoiceValue: number;
  destinationCity: string;
  transportMethod: 'Sea Freight' | 'Air Freight' | 'Land Freight';
}

export interface HSCodeSuggestion {
  code: string;
  confidence: number;
  label: string;
}

export interface AIAnalysisResult {
  hsSuggestedCode: string;
  confidenceScore: number;
  alternativeCodes: HSCodeSuggestion[];
  productCategory: string;
  customsClassification: string;
  regulatoryNotes: string;
  greenLaneEligible: boolean;
  typeApprovalRequired: boolean;
}

export interface TaxEstimationResult {
  customsDutyPercent: number;
  customsDutyAmount: number;
  importTaxPercent: number;
  importTaxAmount: number;
  processingFee: number;
  totalEstimatedCost: number;
  cifMultiplier: number;
}

export interface ComplianceCheckResult {
  importAllowed: boolean;
  noRestrictedGoodsDetected: boolean;
  customsClassificationValid: boolean;
  documentationRequirementsPassed: boolean;
  riskScore: number; // 0 - 100
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  sanctionsPassed: boolean;
  cbiVerified: boolean;
  securityNotes: string[];
}

export interface RequiredDocument {
  id: string;
  name: string;
  description: string;
  status: 'PENDING' | 'UPLOADED' | 'APPROVED' | 'REJECTED';
  isRequired: boolean;
  updatedAt?: string;
}

export interface RouteTimelineNode {
  id: string;
  stageName: string;
  location: string;
  daysOffset: number;
  status: 'COMPLETED' | 'IN_TRANSIT' | 'PENDING';
  description: string;
}

export interface LogisticsForecast {
  origin: string;
  port: string;
  destination: string;
  etaDays: number;
  routeConfidence: number;
  shippingLine: string;
  containerType: string;
  timeline: RouteTimelineNode[];
}

export interface CustomsScenario {
  id: string;
  title: string;
  description: string;
  input: ImporterProductInput;
  analysis: AIAnalysisResult;
  tax: TaxEstimationResult;
  compliance: ComplianceCheckResult;
  documents: RequiredDocument[];
  logistics: LogisticsForecast;
}
