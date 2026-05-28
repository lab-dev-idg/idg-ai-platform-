/**
 * Iraq Digital Gateway (IDG)
 * Government-Grade Sovereign Audit Exporter
 *
 * Compiles unified audited compliance records of deployments, region sync histories,
 * tool execution events, data classification leaks, and security violations.
 * Formulates structured reports readable by legal and ministry auditor frameworks.
 */

import { DeploymentControlPlane } from './DeploymentControlPlane';
import { DistributedNodeRegistry } from './DistributedNodeRegistry';
import { SovereignDataGovernor } from './SovereignDataGovernor';
import { DisasterRecoveryEngine } from './DisasterRecoveryEngine';
import { AIKernel } from '../kernel/AIKernel';
import { ToolExecutionQueue } from '../orchestrator/ToolExecutionQueue';

export interface ComprehensiveAuditReport {
  reportId: string;
  compiledAt: string;
  signoffRequirementsMet: boolean;
  classificationAuthority: string;
  systemMetrics: {
    activeVersion: string;
    environment: string;
    registeredNodesCount: number;
    unresolvedIncidentsCount: number;
    exportApprovalsCount: number;
  };
  deploymentLogHistory: Array<{
    releaseId: string;
    version: string;
    timestamp: string;
    status: string;
    signatures: string[];
  }>;
  securityEventIntegrityLog: Array<{
    timestamp: string;
    component: string;
    event: string;
    detail: string;
  }>;
  criticalExecutionAuditTrail: Array<{
    traceId: string;
    systemTrace: string;
    userType: string;
    toolId: string;
    status: string;
    timestamp: string;
  }>;
}

export class SovereignAuditExporter {
  private static instance: SovereignAuditExporter;

  private constructor() {}

  public static getInstance(): SovereignAuditExporter {
    if (!this.instance) {
      this.instance = new SovereignAuditExporter();
    }
    return this.instance;
  }

  /**
   * Evaluates current systems structures and exports detailed government trace ledgers.
   */
  public generateMinistryComplianceReport(): ComprehensiveAuditReport {
    const controlPlane = DeploymentControlPlane.getInstance();
    const nodeRegistry = DistributedNodeRegistry.getInstance();
    const dataGovernor = SovereignDataGovernor.getInstance();
    const recoveryEngine = DisasterRecoveryEngine.getInstance();
    const kernelInstance = AIKernel.getInstance();
    const queueInstance = ToolExecutionQueue.getInstance();

    const nodes = nodeRegistry.getNodes();
    const incidents = recoveryEngine.getIncidents().filter(i => i.isIsolated);
    const exportApprovals = dataGovernor.getExportLedger();

    // Mapping security event logging tracks from internal sovereign log books
    const securityAuditEvents = kernelInstance.getAuditLogs().filter(
      l => l.event && (l.event.includes('POLICY') || l.event.includes('HEALING') || l.event.includes('FAIL') || l.event.includes('INITIALIZATION') || l.event.includes('GENERATED') || l.event.includes('APPLIED'))
    );

    const deploymentLogsCompact = controlPlane.getReleaseHistory().map(r => ({
      releaseId: r.releaseId,
      version: r.version,
      timestamp: r.timestamp,
      status: r.status,
      signatures: r.approvalSignatures
    }));

    const rawQueueAudit = queueInstance.getAuditHistory().map(a => ({
      traceId: a.auditTrail.traceId,
      systemTrace: a.auditTrail.systemTraceId,
      userType: a.auditTrail.userType,
      toolId: a.auditTrail.toolId,
      status: a.status,
      timestamp: a.timestamps.receivedAt
    }));

    return {
      reportId: `IDG-COMPLIANCE-REP-${Math.floor(100000 + Math.random() * 900000)}-2026`,
      compiledAt: new Date().toISOString(),
      signoffRequirementsMet: deploymentLogsCompact.every(d => d.status !== 'ACTIVE' || d.signatures.length >= 2),
      classificationAuthority: 'Sovereign Auditing Council of Iraq (Level-3)',
      systemMetrics: {
        activeVersion: controlPlane.getActiveVersion(),
        environment: controlPlane.getActiveEnvironment(),
        registeredNodesCount: nodes.length,
        unresolvedIncidentsCount: incidents.length,
        exportApprovalsCount: exportApprovals.length
      },
      deploymentLogHistory: deploymentLogsCompact,
      securityEventIntegrityLog: securityAuditEvents,
      criticalExecutionAuditTrail: rawQueueAudit
    };
  }

  /**
   * Generates a stringified CSV report of tools and execution ledgers.
   */
  public exportCSVLogs(): string {
    const queueHistory = ToolExecutionQueue.getInstance().getAuditHistory();
    let csv = 'Timestamp,TraceID,UserType,ToolId,Status,ExecutionDurationMs\n';

    queueHistory.forEach(q => {
      csv += `"${q.timestamps.receivedAt}","${q.auditTrail.traceId}","${q.auditTrail.userType}","${q.auditTrail.toolId}","${q.status}",${q.timestamps.durationMs}\n`;
    });

    return csv;
  }
}
