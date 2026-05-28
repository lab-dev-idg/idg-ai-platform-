/**
 * Iraq Digital Gateway (IDG)
 * Global Interoperability Gateway - Phase 12-H
 *
 * Provides a controlled, audited, and policy-gated connection gateway
 * to bridge the sovereign national system with external international logistics networks,
 * customs platforms, and regional trade hubs safely.
 */

export type ConnectionStatus = 'REGISTERED' | 'ACTIVE' | 'DEGRADED' | 'REVOKED';

export interface ExternalConnection {
  id: string;
  name: string; // e.g., "GCC Customs Union", "EU Customs Alliance", "AP-Trade Hub"
  endpoint: string;
  protocolVersion: string; // e.g., "v1.2-wco"
  status: ConnectionStatus;
  registeredAt: string;
  lastActiveAt: string;
  policyScopeId: string; // References the data exchange policy mapping
  authorizedBy: string;
}

export class GlobalInteropGateway {
  private static instance: GlobalInteropGateway;
  
  private connections: Map<string, ExternalConnection> = new Map();
  private auditTrail: Array<{ timestamp: string; action: string; connectionId: string; details: string }> = [];

  private constructor() {
    this.bootstrapBaselineConnections();
  }

  public static getInstance(): GlobalInteropGateway {
    if (!this.instance) {
      this.instance = new GlobalInteropGateway();
    }
    return this.instance;
  }

  private bootstrapBaselineConnections(): void {
    const baselines: ExternalConnection[] = [
      {
        id: 'CON-GCC-CUSTOMS',
        name: 'GCC Customs Interop Network',
        endpoint: 'https://interop.gcc-customs.org/v2/soap',
        protocolVersion: 'v2.1-gcc',
        status: 'ACTIVE',
        registeredAt: '2026-05-10T10:00:00Z',
        lastActiveAt: new Date().toISOString(),
        policyScopeId: 'POL-AGGREGATE-ONLY',
        authorizedBy: 'Min_Of_Comms_Iraqi_Gov_01'
      },
      {
        id: 'CON-EU-TRADE',
        name: 'EU DG-Taxation Trade Node',
        endpoint: 'https://api.taxud.ec.europa.eu/trade/v4',
        protocolVersion: 'v4.0-wco',
        status: 'ACTIVE',
        registeredAt: '2026-05-18T14:30:00Z',
        lastActiveAt: new Date(Date.now() - 3600000).toISOString(),
        policyScopeId: 'POL-AGGREGATE-ONLY',
        authorizedBy: 'Customs_Director_HQ_Sig88'
      },
      {
        id: 'CON-AP-TRADE',
        name: 'AP-Trade Logistics Platform',
        endpoint: 'https://interop.aptrade-link.net/graphql',
        protocolVersion: 'v1.5-ap',
        status: 'REGISTERED', // Needs explicit activation
        registeredAt: '2026-05-25T08:15:00Z',
        lastActiveAt: 'N/A',
        policyScopeId: 'POL-SOVEREIGN-STRICT-LOCK',
        authorizedBy: 'TBD-Awaiting-Cabinet'
      }
    ];

    baselines.forEach(c => this.connections.set(c.id, c));
    this.logAudit('GATEWAY_BOOTSTRAP', 'SYSTEM', 'Global Interoperability Gateway baseline connections established.');
  }

  /**
   * Registers a new external connection node.
   */
  public registerConnection(
    connection: Omit<ExternalConnection, 'id' | 'registeredAt' | 'lastActiveAt' | 'status'>
  ): ExternalConnection {
    const id = `CON-${connection.name.toUpperCase().replace(/[^A-Z0-9]/g, '-')}-${Math.floor(100 + Math.random() * 900)}`;
    const newConn: ExternalConnection = {
      ...connection,
      id,
      status: 'REGISTERED',
      registeredAt: new Date().toISOString(),
      lastActiveAt: 'N/A'
    };

    this.connections.set(id, newConn);
    this.logAudit('CONNECTION_REGISTERED', id, `Partner connection for '${connection.name}' registered. Awaiting official activation signoff.`);
    return newConn;
  }

  /**
   * Promotes or revokes external connection states under authorized sovereignty control.
   */
  public updateConnectionStatus(
    id: string,
    status: ConnectionStatus,
    operator: string
  ): { success: boolean; error?: string } {
    const conn = this.connections.get(id);
    if (!conn) {
      return { success: false, error: 'Target interoperability connection context not registered.' };
    }

    if (!operator || operator.length < 5) {
      return { success: false, error: 'Refused: A valid executive credentials signature token is required.' };
    }

    conn.status = status;
    conn.lastActiveAt = new Date().toISOString();
    
    this.logAudit('CONNECTION_STATUS_CHANGE', id, `Status set to ${status} by operator: ${operator}`);
    return { success: true };
  }

  /**
   * Updates last active heartbeat marker.
   */
  public pingReceived(id: string): void {
    const conn = this.connections.get(id);
    if (conn) {
      conn.lastActiveAt = new Date().toISOString();
    }
  }

  private logAudit(action: string, connectionId: string, details: string): void {
    this.auditTrail.push({
      timestamp: new Date().toISOString(),
      action,
      connectionId,
      details
    });
  }

  public getConnections(): ExternalConnection[] {
    return Array.from(this.connections.values());
  }

  public getConnectionById(id: string): ExternalConnection | undefined {
    return this.connections.get(id);
  }

  public getAudits(): Array<{ timestamp: string; action: string; connectionId: string; details: string }> {
    return [...this.auditTrail];
  }
}
