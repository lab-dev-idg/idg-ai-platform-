export interface TradeMetric {
  id: string;
  name: string;
  kuName: string;
  arName: string;
  value: number;
  change: number;
  unit: string;
  history: number[];
}

export interface ScenarioParam {
  tariffRate: number;      // 0 to 100
  policyStrength: number;  // 0 to 100
  borderControl: number;   // 0 to 100
  fuelCostIndex: number;   // 0 to 100
  corridorCap: number;     // 0 to 100
}

export interface ScenarioSimulationResult {
  predictedRevenue: number;
  revenueChangePct: number;
  predictedVolume: number;
  volumeChangePct: number;
  confidenceScore: number;
  impactLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  risks: string[];
  kuRisks: string[];
  arRisks: string[];
}

export interface EarlyWarningAlert {
  id: string;
  alert_level: 'critical' | 'high' | 'medium' | 'low';
  category: 'logistics' | 'tariff' | 'finance' | 'geopolitics';
  region: string;
  kuRegion: string;
  arRegion: string;
  confidence: number;
  impact_estimate: string;
  kuImpact_estimate: string;
  arImpact_estimate: string;
  recommendations: string[];
  kuRecommendations: string[];
  arRecommendations: string[];
  title: string;
  kuTitle: string;
  arTitle: string;
  description: string;
  kuDescription: string;
  arDescription: string;
  timestamp: string;
}

export interface StrategicPolicy {
  id: string;
  title: string;
  kuTitle: string;
  arTitle: string;
  description: string;
  kuDescription: string;
  arDescription: string;
  type: 'modernization' | 'reform' | 'facilitation' | 'digitalization';
  implementationRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  expectedOutcome: string;
  kuExpectedOutcome: string;
  arExpectedOutcome: string;
}

export interface ExecutiveReport {
  executive_summary: string;
  kuExecutive_summary: string;
  arExecutive_summary: string;
  key_findings: string[];
  kuKey_findings: string[];
  arKey_findings: string[];
  risks: string[];
  kuRisks: string[];
  arRisks: string[];
  opportunities: string[];
  kuOpportunities: string[];
  arOpportunities: string[];
  recommendations: string[];
  kuRecommendations: string[];
  arRecommendations: string[];
  confidence_level: string;
}

export interface GraphNode {
  id: string;
  label: string;
  kuLabel: string;
  arLabel: string;
  type: 'port' | 'customs_office' | 'corridor' | 'commodity' | 'regulation' | 'organization';
  status: 'active' | 'bottleneck' | 'restricted' | 'offline';
  description: string;
  kuDescription: string;
  arDescription: string;
}

export interface GraphLink {
  source: string;
  target: string;
  label: string;
  kuLabel: string;
  arLabel: string;
  type: 'depends_on' | 'routes_through' | 'regulated_by' | 'managed_by';
}

export interface ForecastDataPoint {
  period: string;
  actual?: number;
  forecast: number;
  lowerConfidence: number;
  upperConfidence: number;
}
