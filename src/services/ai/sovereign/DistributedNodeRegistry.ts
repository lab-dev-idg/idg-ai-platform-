/**
 * Iraq Digital Gateway (IDG)
 * Distributed Node Registry & Edge-Sync Core
 *
 * Models sovereign node topologies (Baghdad Central Core, Border Terminals, Port Hubs).
 * Implements lightweight edge queues, local eventual-consistency caches, offline fallback routing,
 * and secure checkpoint synchronization tracks.
 */

export type NodeType = 'CENTRAL_CORE' | 'BORDER_TERMINAL' | 'CUSTOMS_PORT' | 'LOGISTICS_HUB';
export type SyncStatus = 'FULLY_SYNCED' | 'OUT_OF_SYNC' | 'DEGRADED_OFFLINE' | 'SYNCHRONIZING';

export interface SovereignNode {
  nodeId: string;
  name: string;
  type: NodeType;
  location: string;
  isOnline: boolean;
  syncStatus: SyncStatus;
  lastSuccessfulSync: string;
  queuedAuditCount: number;
}

export interface OfflineActionPayload {
  actionId: string;
  timestamp: string;
  nodeId: string;
  targetService: string;
  operationCode: string;
  payload: Record<string, unknown>;
  auditedClearanceLevel: number;
}

export class DistributedNodeRegistry {
  private static instance: DistributedNodeRegistry;

  private registeredNodes: Map<string, SovereignNode> = new Map();
  
  // Offline sync queue buffer (eventual consistency)
  private localOfflineQueue: Map<string, OfflineActionPayload[]> = new Map();

  private constructor() {
    this.bootstrapSovereignNodes();
  }

  public static getInstance(): DistributedNodeRegistry {
    if (!this.instance) {
      this.instance = new DistributedNodeRegistry();
    }
    return this.instance;
  }

  private bootstrapSovereignNodes(): void {
    const nodes: SovereignNode[] = [
      {
        nodeId: 'NODE-BAGHDAD-HQ',
        name: 'Baghdad National Central Core',
        type: 'CENTRAL_CORE',
        location: 'Baghdad, Iraq',
        isOnline: true,
        syncStatus: 'FULLY_SYNCED',
        lastSuccessfulSync: new Date().toISOString(),
        queuedAuditCount: 0
      },
      {
        nodeId: 'NODE-UMM-QASR',
        name: 'Umm Qasr South Port Terminal',
        type: 'CUSTOMS_PORT',
        location: 'Basra Governorate',
        isOnline: true,
        syncStatus: 'FULLY_SYNCED',
        lastSuccessfulSync: new Date().toISOString(),
        queuedAuditCount: 0
      },
      {
        nodeId: 'NODE-IBRAHIM-KHALIL',
        name: 'Ibrahim Khalil Border Checkpoint',
        type: 'BORDER_TERMINAL',
        location: 'Duhok, Kurdistan Region',
        isOnline: true,
        syncStatus: 'FULLY_SYNCED',
        lastSuccessfulSync: new Date().toISOString(),
        queuedAuditCount: 0
      },
      {
        nodeId: 'NODE-SAFRA-HUB',
        name: 'Al-Safra Customs & Transit Hub',
        type: 'LOGISTICS_HUB',
        location: 'Diyala Prefecture',
        isOnline: false, // Simulates an actively offline boundary terminal
        syncStatus: 'DEGRADED_OFFLINE',
        lastSuccessfulSync: new Date(Date.now() - 3600000).toISOString(),
        queuedAuditCount: 3
      }
    ];

    nodes.forEach(n => {
      this.registeredNodes.set(n.nodeId, n);
      this.localOfflineQueue.set(n.nodeId, []);
    });

    // Seed dummy offline actions to Al-Safra
    const mockedOfflineActions: OfflineActionPayload[] = [
      {
        actionId: 'OFF-ACT-101',
        timestamp: new Date(Date.now() - 3000000).toISOString(),
        nodeId: 'NODE-SAFRA-HUB',
        targetService: 'customs.calculateDuty',
        operationCode: 'EXECUTE',
        payload: { hsCode: '8703.23', cifValueUSD: 24500, totalDutiesUSD: 4900 },
        auditedClearanceLevel: 1
      },
      {
        actionId: 'OFF-ACT-102',
        timestamp: new Date(Date.now() - 2000000).toISOString(),
        nodeId: 'NODE-SAFRA-HUB',
        targetService: 'logistics.trackShipment',
        operationCode: 'TRACK',
        payload: { manifestId: 'IDG-99201', locationCheckpoint: 'Safra Entry' },
        auditedClearanceLevel: 2
      }
    ];

    this.localOfflineQueue.set('NODE-SAFRA-HUB', mockedOfflineActions);
  }

  /**
   * Registers custom edge gateways, such as a new regional border check.
   */
  public registerNode(node: Omit<SovereignNode, 'queuedAuditCount' | 'syncStatus'>): SovereignNode {
    const freshNode: SovereignNode = {
      ...node,
      syncStatus: node.isOnline ? 'FULLY_SYNCED' : 'DEGRADED_OFFLINE',
      queuedAuditCount: 0
    };

    this.registeredNodes.set(node.nodeId, freshNode);
    this.localOfflineQueue.set(node.nodeId, []);
    return freshNode;
  }

  /**
   * Tracks heartbeat states from edge and changes offline indicators.
   */
  public reportHeartbeat(nodeId: string, isOnline: boolean): void {
    const node = this.registeredNodes.get(nodeId);
    if (!node) return;

    node.isOnline = isOnline;
    if (!isOnline) {
      node.syncStatus = 'DEGRADED_OFFLINE';
    } else if (node.syncStatus === 'DEGRADED_OFFLINE') {
      node.syncStatus = 'OUT_OF_SYNC';
    }
  }

  /**
   * Enqueues a transaction locally at the Edge Node when connectivity is offline.
   * Guarantees continuous gateway ops can proceed.
   */
  public queueOfflineAction(nodeId: string, action: Omit<OfflineActionPayload, 'actionId' | 'timestamp'>): OfflineActionPayload {
    const list = this.localOfflineQueue.get(nodeId) || [];
    const fullAction: OfflineActionPayload = {
      ...action,
      actionId: `OFF-ACT-${Math.floor(100000 + Math.random() * 900000)}`,
      timestamp: new Date().toISOString()
    };

    list.push(fullAction);
    this.localOfflineQueue.set(nodeId, list);

    const node = this.registeredNodes.get(nodeId);
    if (node) {
      node.queuedAuditCount = list.length;
    }

    console.log(`[DISTRIBUTED-NODE] Node ${nodeId} registered offline command ${fullAction.actionId} locally.`);
    return fullAction;
  }

  /**
   * Pushes edge transactions to Baghdad central, emptying the queue and marking synced.
   */
  public synchronizeNode(nodeId: string): { success: boolean; synchronizedRecordsCount: number; error?: string } {
    const node = this.registeredNodes.get(nodeId);
    if (!node) {
      return { success: false, synchronizedRecordsCount: 0, error: 'Sovereign node id reference missing.' };
    }

    if (!node.isOnline) {
      return { success: false, synchronizedRecordsCount: 0, error: 'Node is physically disconnected. Synchronized transmission requires telemetry uplink.' };
    }

    const actions = this.localOfflineQueue.get(nodeId) || [];
    const count = actions.length;

    node.syncStatus = 'SYNCHRONIZING';

    // Simulate transactional replication to core master logs
    actions.forEach(act => {
      console.log(`[DISTRIBUTED-SYNC] Synchronized core log transaction ${act.actionId} -> Baghdad Headquarters central ledger database.`);
    });

    // Flush offline buffer
    this.localOfflineQueue.set(nodeId, []);
    node.queuedAuditCount = 0;
    node.syncStatus = 'FULLY_SYNCED';
    node.lastSuccessfulSync = new Date().toISOString();

    console.log(`[DISTRIBUTED-SYNC] Synchronize node ${nodeId} completed. Synced records count: ${count}`);
    return { success: true, synchronizedRecordsCount: count };
  }

  public getNodes(): SovereignNode[] {
    return Array.from(this.registeredNodes.values());
  }

  public getQueue(nodeId: string): OfflineActionPayload[] {
    return this.localOfflineQueue.get(nodeId) || [];
  }
}
