# REPUBLIC OF IRAQ DIGITAL GATEWAYS (IDG)
## Phase 14: Sovereign Production Hardening & Deployment Layer
### National Operations, Cyber Isolation, Active-Active Routing & Fault-Tolerance Playbook

This document details the software design, defensive signatures, region isolation models, sandboxing matrices, and failover topologies that establish the robust production reliability of the National AI Brain servicing the Central Gateway.

---

## 1. Hardened System Architecture Blueprint

The production layer establishes five continuous layers of protection surrounding the RAG Pipelines and Tool Execution flows. Any transaction must successfully complete every safeguard parameter before execution is permitted on any edge node:

```
                          [USER COGNITIVE INGRESS]
                                     |
                                     v
                       +---------------------------+
                       |  SOVEREIGN SECURITY LOCK  |  <--- Gating & Sandbox Isolation
                       |  - Data Residency check   |  <--- Intrusion Signature Matches
                       +---------------------------+
                                     |
                                     v
                       +---------------------------+
                       |      RUNTIME SANDBOX      |  <--- CPU Time Slicing & Memory Caps
                       |  - Regulated execution    |  <--- Forbidden Keyword Scans
                       +---------------------------+
                                     |
                                     v
                       +---------------------------+
                       |      TIMEOUT MANAGER      |  <--- Thread protection gates
                       |  - Max duration cap      |  <--- Graceful fallbacks
                       +---------------------------+
                                     |
                                     v
                       +---------------------------+
                       |     CIRCUIT BREAKER       |  <--- Self-healing loop (CLOSED/OPEN)
                       |  - Fallback Degradation   |  <--- Jitter Exponential Backoff
                       +---------------------------+
                                     |
                                     v
                       +---------------------------+
                       |  MULTI-REGION CONTROL     |  <--- Basra Primary active-active
                       |  - Latency balancing      |  <--- Erbil Disaster failsafe
                       +---------------------------+
                                     |
                                     v
                            [SECURE EXECUTION]
```

---

## 2. Dynamic Circuit Breaker & Retry Equations

### Exponential Backoff with Jitter
To prevent network feedback loops and traffic pile-ups during intermittent gateway offline spikes, the **RetryPolicy.ts** implements a robust backoff delay algorithm coupled with randomized noise (Full Jitter model):

$$\text{Delay}_{\text{calculated}} = \min\left(\text{Delay}_{\text{max}}, \text{Delay}_{\text{initial}} \times \text{Factor}^{\text{Attempt} - 1}\right)$$

$$\text{Delay}_{\text{with\_jitter}} = \text{Random}(0, 1) \times \text{Delay}_{\text{calculated}}$$

### Circuit Breaker States:
1. **CLOSED (Default Health):** Transactions stream transparently. Systemic warning indicators monitor fail ratios.
2. **OPEN (Fail Fast Guard):** If consecutive exceptions bypass `failureThreshold` boundaries, the breaker trips to `OPEN`. All incoming calls immediately fail fast to prevent resource exhaustion, serving robust pre-configured fallbacks.
3. **HALF_OPEN (Automated Recovery):** After a cooldown timeout, the system allows a single-line test probe. If the test succeeds, normal operations resume; otherwise, it is immediately tripped back to `OPEN`.

---

## 3. High-Security Runtime Sandbox Isolation Matrix

All operations enqueued on the **ToolExecutionQueue** must run inside a memory-limited virtual container of **RuntimeSandbox.ts** under deep traffic instrumentation parameters:

| Container Attribute | Threshold Constraint | Action On Violation | Threat Vector Prevented |
| :--- | :--- | :--- | :--- |
| **Max Heap Memory** | 128 MB maximum size | Immediate task termination | Out-of-memory crashes / memory leak exploits |
| **CPU Time Slice** | 1,500ms maximum duration | Thread termination & fail-over | Infinite-loop commands / Denial of Service attempts |
| **Keyword Restriction** | Blocks terms like `process.exit`, `child_process`, `exec` | Throw `SandboxSecurityViolationError` | Local administrative privilege escalation |
| **Safe Tool Registry** | Confined specifically to approved whitelist | Block execution | Spoofing attempts & arbitrary code execution |

---

## 4. Multi-Region Active-Active Deployment Topology

```
                  +------------------------------------+
                  |    ACTIVE-ACTIVE LOAD BALANCER     |
                  +------------------------------------+
                   /                 |                \
                  /                  |                 \
                 v                   v                  v
     +-------------------+   +------------------+   +-------------------+
     |   iraq-central    |   |    iraq-edge     |   |   iraq-failover   |
     |      (Basra)      |   |    (Baghdad)     |   |      (Erbil)      |
     | STATUS: ACTIVE    |   | STATUS: ACTIVE   |   | STATUS: STANDBY   |
     | Primary DB Synced |   | Cache Edge sync  |   | Replica DB mirror |
     +-------------------+   +------------------+   +-------------------+
```

- **Stateless Orchestration:** The AI gateway layer is strictly stateless. Active user context state and histories sync down to secure regional Firestore collections.
- **Failover Routing:** The **DeploymentController.ts** actively maintains peer heartbeats. If Basra latency averages rise above limits, traffic splits automatically to Baghdad edge terminals or shifts standby routing resources to Erbil.

---

## 5. Deployment Control Plane & Canary Scale

To guarantee safe and orderly model rollouts, the **DeploymentController** supports version `v14.0.0` schemas under standard canary percentage splits:

$$\text{Rollout Stages: } 1\% \longrightarrow 10\% \longrightarrow 50\% \longrightarrow 100\%$$

- **Automatic Rollback Guardrails:** If the **ObservabilityEngine** detects a systemic service breakdown spike (average query failures $> 5.0\%$), the control plane triggers an instantaneous rollback to the verified static `v13` codebase.
