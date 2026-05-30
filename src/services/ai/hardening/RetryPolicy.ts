/**
 * Iraq Digital Gateway (IDG)
 * Phase 14: Sovereign Production Hardening & Deployment Layer - Intelligent Retry Engine
 */

import { RetryConfig } from './types';

export class RetryPolicy {
  private static defaultConfigs: RetryConfig = {
    maxRetries: 3,
    initialDelayMs: 200,
    maxDelayMs: 3000,
    backoffFactor: 2,
    useJitter: true
  };

  /**
   * Evaluates and wraps any asynchronous process with highly robust retry parameters.
   */
  public static async executeWithRetry<T>(
    operation: () => Promise<T>,
    customConfig?: Partial<RetryConfig>,
    onRetryAttempt?: (attempt: number, error: unknown, delayMs: number) => void
  ): Promise<T> {
    const config = { ...this.defaultConfigs, ...customConfig };
    let attempt = 0;

    while (true) {
      try {
        return await operation();
      } catch (error) {
        attempt++;
        if (attempt > config.maxRetries) {
          console.error(`[RETRY-ENGINE] Maximum attempt count (${config.maxRetries}) cleared. Rejecting process.`);
          throw error;
        }

        // Exponential delay equation: delay = initialDelay * (backoffFactor ^ (attempt - 1))
        let delay = config.initialDelayMs * Math.pow(config.backoffFactor, attempt - 1);
        delay = Math.min(delay, config.maxDelayMs);

        // Add uniform random math jitter to flatten peak congestion spikes (Full Jitter model)
        if (config.useJitter) {
          delay = Math.random() * delay;
        }

        const resolvedDelay = Math.round(delay);
        console.warn(`[RETRY-ENGINE] Execution attempt ${attempt} failed. Retrying in ${resolvedDelay}ms... Error: ${error instanceof Error ? error.message : error}`);

        if (onRetryAttempt) {
          onRetryAttempt(attempt, error, resolvedDelay);
        }

        await this.sleep(resolvedDelay);
      }
    }
  }

  private static sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
