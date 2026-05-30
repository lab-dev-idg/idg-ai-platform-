/**
 * Iraq Digital Gateway (IDG)
 * Phase 14: Sovereign Production Hardening & Deployment Layer - Circuit Breaker Architecture
 */

import { CircuitState, HardenedService, CircuitBreakerConfig } from './types';

export class CircuitBreakerOpenError extends Error {
  constructor(public service: HardenedService) {
    super(`Circuit breaker is OPEN for service: ${service}. Fail-fast protection activated.`);
    this.name = 'CircuitBreakerOpenError';
  }
}

export class CircuitBreaker {
  private static instance: CircuitBreaker;

  private states: Record<HardenedService, CircuitState> = {
    [HardenedService.RAG]: CircuitState.CLOSED,
    [HardenedService.TOOLS]: CircuitState.CLOSED,
    [HardenedService.EMBEDDINGS]: CircuitState.CLOSED,
    [HardenedService.ORCHESTRATOR]: CircuitState.CLOSED
  };

  private failures: Record<HardenedService, number> = {
    [HardenedService.RAG]: 0,
    [HardenedService.TOOLS]: 0,
    [HardenedService.EMBEDDINGS]: 0,
    [HardenedService.ORCHESTRATOR]: 0
  };

  private lastStateChange: Record<HardenedService, number> = {
    [HardenedService.RAG]: 0,
    [HardenedService.TOOLS]: 0,
    [HardenedService.EMBEDDINGS]: 0,
    [HardenedService.ORCHESTRATOR]: 0
  };

  private configs: Record<HardenedService, CircuitBreakerConfig> = {
    [HardenedService.RAG]: { failureThreshold: 3, recoveryTimeoutMs: 15000, cooldownPeriodMs: 60000 },
    [HardenedService.TOOLS]: { failureThreshold: 3, recoveryTimeoutMs: 20000, cooldownPeriodMs: 60000 },
    [HardenedService.EMBEDDINGS]: { failureThreshold: 5, recoveryTimeoutMs: 10000, cooldownPeriodMs: 60000 },
    [HardenedService.ORCHESTRATOR]: { failureThreshold: 2, recoveryTimeoutMs: 30000, cooldownPeriodMs: 90000 }
  };

  private constructor() {}

  public static getInstance(): CircuitBreaker {
    if (!this.instance) {
      this.instance = new CircuitBreaker();
    }
    return this.instance;
  }

  public getCircuitState(service: HardenedService): CircuitState {
    const state = this.states[service];
    const config = this.configs[service];
    const lastChange = this.lastStateChange[service];

    // If state is OPEN, check if recovery duration timeout has elapsed to allow HALF_OPEN
    if (state === CircuitState.OPEN && Date.now() - lastChange > config.recoveryTimeoutMs) {
      console.log(`[CIRCUIT-BREAKER] Service [${service}] recovery timeout elapsed. Transitioning from OPEN to HALF_OPEN.`);
      this.transitionState(service, CircuitState.HALF_OPEN);
      return CircuitState.HALF_OPEN;
    }

    return state;
  }

  private transitionState(service: HardenedService, newState: CircuitState): void {
    const oldState = this.states[service];
    if (oldState !== newState) {
      this.states[service] = newState;
      this.lastStateChange[service] = Date.now();
      console.log(`[CIRCUIT-BREAKER] Service [${service}] changed state from ${oldState} to ${newState}`);
    }
  }

  /**
   * Tracks successful execution to auto-clear consecutive failure history.
   */
  public recordSuccess(service: HardenedService): void {
    this.failures[service] = 0;
    const currentState = this.states[service];

    if (currentState === CircuitState.HALF_OPEN) {
      console.log(`[CIRCUIT-BREAKER] Service [${service}] executed successfully in HALF_OPEN. Resetting circuit to CLOSED.`);
      this.transitionState(service, CircuitState.CLOSED);
    }
  }

  /**
   * Records failure to potentially trigger circuit open gates.
   */
  public recordFailure(service: HardenedService): void {
    this.failures[service]++;
    const failureCount = this.failures[service];
    const currentState = this.states[service];
    const config = this.configs[service];

    console.log(`[CIRCUIT-BREAKER] Service [${service}] recorded failure count: ${failureCount} (Threshold: ${config.failureThreshold})`);

    if (currentState === CircuitState.CLOSED && failureCount >= config.failureThreshold) {
      console.warn(`[CIRCUIT-BREAKER] Threshold reached! TRIPPING CIRCUIT OPEN for service [${service}]`);
      this.transitionState(service, CircuitState.OPEN);
    } else if (currentState === CircuitState.HALF_OPEN) {
      console.warn(`[CIRCUIT-BREAKER] Service [${service}] failed during HALF_OPEN probe. Re-tripping circuit to OPEN.`);
      this.transitionState(service, CircuitState.OPEN);
    }
  }

  /**
   * Wraps an execution task with Circuit Breaker tracking.
   * Leverages custom fallback strategies for graceful degradation on failure.
   */
  public async runHardenedTask<T>(
    service: HardenedService,
    task: () => Promise<T>,
    fallback: T | (() => T)
  ): Promise<T> {
    const currentState = this.getCircuitState(service);

    if (currentState === CircuitState.OPEN) {
      console.warn(`[CIRCUIT-BREAKER] Blocked calls for [${service}]. Executing graceful degradation fallback.`);
      return typeof fallback === 'function' ? (fallback as () => T)() : fallback;
    }

    try {
      const result = await task();
      this.recordSuccess(service);
      return result;
    } catch (error) {
      this.recordFailure(service);
      console.error(`[CIRCUIT-BREAKER] Encounters failure on [${service}]:`, error);
      return typeof fallback === 'function' ? (fallback as () => T)() : fallback;
    }
  }

  public forceReset(): void {
    for (const service of Object.values(HardenedService)) {
      this.states[service] = CircuitState.CLOSED;
      this.failures[service] = 0;
      this.lastStateChange[service] = Date.now();
    }
  }

  public getFullDiagnostics(): Record<HardenedService, { state: CircuitState; failureCount: number }> {
    const report: any = {};
    for (const service of Object.values(HardenedService)) {
      report[service] = {
        state: this.states[service],
        failureCount: this.failures[service]
      };
    }
    return report;
  }
}
