/**
 * Iraq Digital Gateway (IDG)
 * Phase 14: Sovereign Production Hardening & Deployment Layer - Deployment Control Plane
 */

import { DeploymentNode, DeploymentConfig, ReleaseVersion, DeploymentStrategyType } from './types';
import { db, collection, addDoc } from '../../firebase';

export class DeploymentController {
  private static instance: DeploymentController;

  private activeNodes: DeploymentNode[] = [
    { nodeId: 'NODE-BAS-01', region: 'iraq-central-basra', status: 'ACTIVE', loadPercentage: 35, isPrimary: true, latencyMs: 25 },
    { nodeId: 'NODE-BAS-02', region: 'iraq-central-basra', status: 'ACTIVE', loadPercentage: 40, isPrimary: true, latencyMs: 29 },
    { nodeId: 'NODE-BAG-01', region: 'iraq-edge-baghdad', status: 'ACTIVE', loadPercentage: 15, isPrimary: false, latencyMs: 14 },
    { nodeId: 'NODE-ERB-01', region: 'iraq-failover-erbil', status: 'STANDBY', loadPercentage: 0, isPrimary: false, latencyMs: 38 }
  ];

  private deploymentConfig: DeploymentConfig = {
    version: ReleaseVersion.V14_0_0,
    strategy: DeploymentStrategyType.CANARY,
    canaryPercent: 10,
    activeColor: 'BLUE',
    rollbackThresholdErrorPercent: 5.0
  };

  private lastFailoverTriggered: string | null = null;

  private constructor() {}

  public static getInstance(): DeploymentController {
    if (!this.instance) {
      this.instance = new DeploymentController();
    }
    return this.instance;
  }

  public getNodes(): DeploymentNode[] {
    return [...this.activeNodes];
  }

  public getDeploymentConfig(): DeploymentConfig {
    return { ...this.deploymentConfig };
  }

  /**
   * Safe load-balancing node selector based on operational status and minimal latency footprint.
   */
  public getOptimalExecutionNode(userRegionPreference?: string): DeploymentNode {
    const onlineNodes = this.activeNodes.filter((node) => node.status === 'ACTIVE');
    if (onlineNodes.length === 0) {
      // Emergency: activate failover standby node immediately
      const standby = this.activeNodes.find((node) => node.region === 'iraq-failover-erbil');
      if (standby) {
        standby.status = 'ACTIVE';
        standby.loadPercentage = 10;
        console.warn('[DEPLOYMENT-CONTROL-PLANE] CRITICAL outage. No Basra or Baghdad nodes online! ERBIL emergency failover ACTIVATED.');
        return standby;
      }
      throw new Error('[DEPLOYMENT] Disaster Recovery: No sovereign online nodes reachable.');
    }

    // Sort by latency relative to preferences, then load matching
    return onlineNodes.sort((a, b) => {
      if (userRegionPreference) {
        if (a.region === userRegionPreference && b.region !== userRegionPreference) return -1;
        if (b.region === userRegionPreference && a.region !== userRegionPreference) return 1;
      }
      return a.latencyMs - b.latencyMs;
    })[0];
  }

  /**
   * Health Check Scheduler - actively scans latent responses on edge systems.
   * If any node times out, failover operations isolate the client thread to basra nodes.
   */
  public executeGlobalHealthScan(): void {
    console.log('[DEPLOYMENT-HEALTH-SCAN] Scanning active infrastructure node states...');
    this.activeNodes.forEach((node) => {
      if (node.status === 'ACTIVE') {
        const jitter = Math.random();
        // Simulate high traffic node breakdown
        if (jitter > 0.96 && node.nodeId !== 'NODE-BAS-01') {
          node.status = 'FAILED';
          node.loadPercentage = 0;
          console.error(`[DEPLOYMENT-HEALTH-SCAN] WARNING: Detected systemic dropout on Node [${node.nodeId}]. Marking standard status as FAILED.`);
          this.triggerAutonomousFailover(node.nodeId);
        } else {
          // Adjust random load percentages realistically
          node.loadPercentage = Math.round(20 + Math.random() * 50);
          node.latencyMs = Math.round(15 + Math.random() * 25);
        }
      }
    });
  }

  private triggerAutonomousFailover(failedNodeId: string): void {
    this.lastFailoverTriggered = new Date().toISOString();
    console.warn(`[FAILOVER-CONTROLLER] Isolating node [${failedNodeId}]. Re-routing regional traffic streams to primary Um-Qasr central clusters.`);
    this.activeNodes.forEach((node) => {
      if (node.region === 'iraq-failover-erbil' && node.status === 'STANDBY') {
        node.status = 'ACTIVE';
        node.loadPercentage = 25;
        console.log('[FAILOVER-CONTROLLER] Standby Erbil Cluster Node elevated to ACTIVE state.');
      }
    });
    this.commitDeploymentEvent('NODE_FAILOVER', `Node failure detected on ${failedNodeId}. Isolated immediately with traffic split to Erbil.`);
  }

  /**
   * Upgrades canary rollout phase percentages (1% -> 10% -> 50% -> 100%).
   */
  public adjustCanaryScale(percent: number): void {
    const verifiedPercent = Math.max(1, Math.min(100, percent));
    this.deploymentConfig.canaryPercent = verifiedPercent;
    console.log(`[DEPLOYMENT-CONTROL-PLANE] Production upgrade canary split resized to ${verifiedPercent}% of national infrastructure.`);
    this.commitDeploymentEvent('CANARY_RESIZE', `Canary volume split updated to ${verifiedPercent}%`);
  }

  /**
   * Toggles Blue/Green Active Environments.
   */
  public triggerBlueGreenSwap(): string {
    const current = this.deploymentConfig.activeColor;
    const target = current === 'BLUE' ? 'GREEN' : 'BLUE';
    this.deploymentConfig.activeColor = target;
    console.log(`[DEPLOYMENT-CONTROL-PLANE] Blue/Green production route swapped. Target Active: [${target}]`);
    this.commitDeploymentEvent('BLUE_GREEN_SWAP', `Traffic split transitioned from ${current} color to ${target}`);
    return target;
  }

  /**
   * Auto-Rollbacks system updates on failure threshold exceptions.
   */
  public evaluateStatusClearanceForRollback(currentFailureRate: number): boolean {
    if (currentFailureRate >= this.deploymentConfig.rollbackThresholdErrorPercent) {
      console.error(`[ROLLBACK-MANAGER] CRITICAL! Current failure quota rate (${currentFailureRate}%) matches threshold limits (${this.deploymentConfig.rollbackThresholdErrorPercent}%). REVERTING DISPATCH IMMUTABLY.`);
      this.deploymentConfig.canaryPercent = 1;
      this.deploymentConfig.activeColor = 'BLUE';
      this.commitDeploymentEvent('ROLLBACK_TRIGGERED', `Automated Rollback initiated. Reverting schema to safe v13 codebase baseline.`);
      return true;
    }
    return false;
  }

  private async commitDeploymentEvent(actionType: string, description: string): Promise<void> {
    const deploymentId = `DEP-${Date.now()}`;
    const logData = {
      id: deploymentId,
      actionType,
      description,
      timestamp: new Date().toISOString(),
      currentConfigState: this.deploymentConfig
    };

    try {
      await addDoc(collection(db, 'deployment_log_events'), logData);
      console.log(`[DEPLOYMENT] Log committed: ${deploymentId}`);
    } catch (err) {
      console.warn('[DEPLOYMENT] Log entry offline:', err);
    }
  }
}
