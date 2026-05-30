/**
 * Iraq Digital Gateway (IDG)
 * Phase 14: Sovereign Production Hardening & Deployment Layer - Type System
 */

export enum CircuitState {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
  HALF_OPEN = 'HALF_OPEN'
}

export enum HardenedService {
  RAG = 'RAG',
  TOOLS = 'TOOLS',
  EMBEDDINGS = 'EMBEDDINGS',
  ORCHESTRATOR = 'ORCHESTRATOR'
}

export interface CircuitBreakerConfig {
  failureThreshold: number; // consecutive failures or rate before trip
  recoveryTimeoutMs: number; // time to wait before trying half-open
  cooldownPeriodMs: number; // time after successful request to clear failure count
}

export interface RetryConfig {
  maxRetries: number;
  initialDelayMs: number;
  maxDelayMs: number;
  backoffFactor: number; // exponential multiplier
  useJitter: boolean;
}

export interface TimeoutConfig {
  timeoutMs: number;
}

export interface SovereignGuardPolicy {
  policyId: string;
  name: string;
  enforceDataResidency: boolean;
  allowedRegions: string[];
  strictlyEncryptAtRest: boolean;
  strictlyEncryptInTransit: boolean;
  intrusionSignatures: string[];
}

export interface SandboxExecutionMetrics {
  maxMemoryMB: number;
  cpuTimeSliceMs: number;
  forbiddenKeywords: string[];
  isolatedSandboxId: string;
}

export enum ReleaseVersion {
  V14_0_0 = 'v14.0.0'
}

export enum DeploymentStrategyType {
  BLUE_GREEN = 'BLUE_GREEN',
  CANARY = 'CANARY'
}

export interface DeploymentNode {
  nodeId: string;
  region: 'iraq-central-basra' | 'iraq-edge-baghdad' | 'iraq-failover-erbil';
  status: 'ACTIVE' | 'STANDBY' | 'FAILED' | 'DRAINING';
  loadPercentage: number;
  isPrimary: boolean;
  latencyMs: number;
}

export interface DeploymentConfig {
  version: ReleaseVersion;
  strategy: DeploymentStrategyType;
  canaryPercent: number; // e.g. 1%, 10%, 50%, 100%
  activeColor: 'BLUE' | 'GREEN';
  rollbackThresholdErrorPercent: number;
}

export interface HardenedTelemetryRecord {
  requestId: string;
  timestamp: string;
  service: HardenedService;
  durationMs: number;
  hasSucceeded: boolean;
  statusCode: number;
  errorMessage?: string;
  tokenUsage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  simulatedCostUSD: number;
  traceStages: Array<{ stageName: string; durationMs: number; timestamp: string }>;
}

export interface ChaosFailureScenario {
  scenarioId: string;
  title: string;
  targetService: HardenedService;
  failureType: 'LATENCY_SPIKE' | 'NODE_CRASH' | 'RAG_POISON' | 'ADVERSARIAL_FLOOD';
  intensityRating: 'MODERATE' | 'CRITICAL' | 'CATASTROPHIC';
}
