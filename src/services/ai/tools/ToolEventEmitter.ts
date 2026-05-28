/**
 * Iraq Digital Gateway (IDG)
 * Operational Event Emitter
 * 
 * Facilitates safe decoupling of synchronous AI transactions and asynchronous 
 * back-office handlers (real-time notification triggers, custom indicators, and ledger writes).
 */

export type IDGEventType =
  | 'shipment.updated'
  | 'customs.review.started'
  | 'customs.review.completed'
  | 'compliance.alert'
  | 'ai.action.executed'
  | 'security.violation.detected';

export interface IDGEventPayload {
  eventId: string;
  type: IDGEventType;
  timestamp: string;
  source: string; // origin module identifier
  data: Record<string, unknown>;
  traceId?: string;
  clearanceLevelRequired?: number;
}

export type IDGEventListener = (event: IDGEventPayload) => void | Promise<void>;

export class ToolEventEmitter {
  private static instance: ToolEventEmitter;
  private listeners: Map<IDGEventType, Set<IDGEventListener>> = new Map();

  private constructor() {}

  public static getInstance(): ToolEventEmitter {
    if (!this.instance) {
      this.instance = new ToolEventEmitter();
    }
    return this.instance;
  }

  /**
   * Subscribes a callback to receive specific operational events.
   * Returns a function to easily unsubscribe.
   */
  public subscribe(type: IDGEventType, listener: IDGEventListener): () => void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    
    this.listeners.get(type)!.add(listener);

    return () => {
      const set = this.listeners.get(type);
      if (set) {
        set.delete(listener);
      }
    };
  }

  /**
   * Broadcasts an event to all active listeners asynchronously, preventing
   * hanging operations if individual logs fail.
   */
  public emit(type: IDGEventType, source: string, data: Record<string, unknown>, traceId?: string): void {
    const event: IDGEventPayload = {
      eventId: `EV-${Math.floor(100000 + Math.random() * 900000)}`,
      type,
      timestamp: new Date().toISOString(),
      source,
      data,
      traceId
    };

    console.log(`[IDG-EVENT] Emitted: [${type}] from [${source}] (Trace: ${traceId || 'N/A'})`);

    const set = this.listeners.get(type);
    if (set) {
      set.forEach(listener => {
        try {
          const res = listener(event);
          if (res instanceof Promise) {
            res.catch(err => {
              console.error(`[IDG-EVENT-ERROR] Failed executing async event handler for type '${type}':`, err);
            });
          }
        } catch (err) {
          console.error(`[IDG-EVENT-ERROR] Failed executing sync event handler for type '${type}':`, err);
        }
      });
    }
  }

  /**
   * Disposes all subscribers for sandbox testing or hot resets.
   */
  public clearAll(): void {
    this.listeners.clear();
  }
}
