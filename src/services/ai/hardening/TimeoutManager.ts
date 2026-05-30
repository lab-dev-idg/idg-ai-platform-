/**
 * Iraq Digital Gateway (IDG)
 * Phase 14: Sovereign Production Hardening & Deployment Layer - Global Timeout Manager
 */

export class OperationTimeoutError extends Error {
  constructor(public durationLimitMs: number, operationName?: string) {
    super(`Operation${operationName ? ` '${operationName}'` : ''} exceeded maximum permissible execution time limit of ${durationLimitMs}ms.`);
    this.name = 'OperationTimeoutError';
  }
}

export class TimeoutManager {
  /**
   * Enforces strict duration limits on an asynchronous action promise block.
   */
  public static async executeWithTimeout<T>(
    operation: () => Promise<T>,
    timeoutMs: number,
    operationName?: string
  ): Promise<T> {
    let timeoutId: NodeJS.Timeout | undefined;

    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(() => {
        reject(new OperationTimeoutError(timeoutMs, operationName));
      }, timeoutMs);
    });

    try {
      const result = await Promise.race([
        operation(),
        timeoutPromise
      ]);
      return result as T;
    } finally {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    }
  }
}
