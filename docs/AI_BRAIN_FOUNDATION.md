# Iraq Digital Gateway: AI Brain Foundation Standards (Phase 12-A)
**Specification Version**: 1.0.0-PROTOTYPE  
**Environment Scope**: Sovereign Customs Desk / Digital Border Controls  
**Authorization Profile**: Operation-Native & Verification-Ready  

This document serves as the official technical specification for the Phase 12-A AI Brain Foundation of the Iraq Digital Gateway (IDG).

---

## 1. Intent Architecture

The IDG AI Gateway classifies every incoming broker, operator, citizen, or government official inquiry into an explicitly registered semantic *Intent*. This intent acts as the query’s functional routing parameter, specifying access locks, minimum confidence levels, and automated system escalations.

### A. Intent Directory
The intent registry maps functional system categories to triggering keywords, required clearances, and failback paths:

*   **GENERAL**: General informational greetings, system capability overways, or sandbox introductory dialogs. Available to all user roles. Safely escalates to standard online helpdesk queues.
*   **CUSTOMS**: Trade tariff rules, CIF duty valuations, HS Code lookup, and border taxes matching the 2026 Customs Law. Accessible strictly to Citizen, Business, and Government roles.
*   **SHIPMENT**: Manifest validation triggers, freight delays, port waiting calculations, and vehicle routing. Mapped to logistics tracking databases.
*   **COMPLIANCE**: Anti-money laundering checkups, trade restriction audits, blacklisted entities, and dual-use component detection protocols.
*   **GOVERNMENT**: Inter-ministry coordination commands, direct administrative clearings, and centralized Gazette policy directives.
*   **SUPPORT**: Technical troubleshooting logs, UI state disputes, broker profile assistance, and webhook feedback flows.
*   **INCIDENT**: System outage alerts, server lag flags, security blockages, and high-priority checkpoint network failure cascades.
*   **PARTNERSHIP**: Private/public venture logs, digital trade lanes expansion, international trade contracts.
*   **INVESTOR**: Free Zone tax guidelines, foreign investment permits, capital injection protocols.
*   **DEVELOPER**: System API keys, webhook test blocks, local sandbox validation files, and developer console structures.
*   **TELECOM**: Iraqi CMC specifications, fiber deployment logs, and microwave checkpoint telemetry networks.
*   **BANKING**: Central bank letter of credit clearance logs, import escrow payments, and customs fee validations.

### B. Execution Sequence
```
   [ User Prompt Input ]
             │
             ▼
   [ Intent Identification ]
   - Local Regex Token Lookup (First Pass fallback)
   - LLM Semantic Analysis (Second Pass core)
             │
             ├──> Below score check (e.g. < 0.75 for CUSTOMS)?
             │    └──> Escalation fallback to standard support
             ▼
   [ Authorize User Type Check ]
   - Verify caller's role is listed as allowed in the intent registry
             │
             ▼
   [ Execute Target Pipeline ]
```

---

## 2. User Classification Model

The gateway enforces clear semantic segregation of users across 10 official profile classifications. This model replaces arbitrary security gates, routing clearances dynamically by verifying identity levels (0 to 4):

```
       Clearance Levels Hierarchy
┌───────────────────────────────────────┐
│ Level 4: Secret / Sovereign           │ -> Government Core officials
├───────────────────────────────────────┤
│ Level 3: Confident / High Audit       │ -> Bank, CBI & CMC Staff
├───────────────────────────────────────┤
│ Level 2: Trusted / Regional Operators  │ -> Employee Clerks & Tech Operators
├───────────────────────────────────────┤
│ Level 1: Registered Trade Brokers     │ -> Business Manifest filers
├───────────────────────────────────────┤
│ Level 0: Standard Public               │ -> Common Citizens & Journalists
└───────────────────────────────────────┘
```

### A. Core Profile Specifications

1.  **Citizen** (Level-0, Public, Unprivileged)
    *   *Purpose*: Individuals researching trade procedures, passport clearances, and standard tourist tariff quotas.
2.  **Journalist** (Level-0, Public, Unprivileged)
    *   *Purpose*: Press corps researching port schedules, traffic logs, and central trade statistics.
3.  **Business** (Level-1, Registered, Unprivileged)
    *   *Purpose*: Customs brokers, vessel agents, freight forwarders, and logistics firm delegates managing active shipments.
4.  **Developer** (Level-1, Registered, Unprivileged)
    *   *Purpose*: Third-party technology contractors implementing the IDG API schemas in merchant billing systems.
5.  **Investor** (Level-1, Registered, Unprivileged)
    *   *Purpose*: Corporate foreign investors evaluating development initiatives inside Iraqi Special Free Trade Zones (e.g., Basra).
6.  **Fintech** (Level-2, Trusted, Unprivileged)
    *   *Purpose*: Electronic payment companies running customs duty collection gateways.
7.  **Employee** (Level-2, Trusted, Unprivileged)
    *   *Purpose*: Border Commission gatekeepers, customs checkpoint clerks, or port terminal handlers checking barcode passes.
8.  **Telecom** (Level-2, Privileged, Trusted)
    *   *Purpose*: Network engineers maintaining physical CMC fiber links, checkpoint satellite dishes, and backup links.
9.  **Bank** (Level-3, Privileged, Confidential)
    *   *Purpose*: CBI compliance auditing desks verifying letters of credit and cargo valuations.
10. **Government** (Level-3, Privileged, High Audit / Executive)
    *   *Purpose*: General Customs Commission supervisors, Border Commission administrators, and Ministry of Finance delegates.

---

## 3. Client Context Compilation Architecture

To generate accurate outputs without hallucinations, user sessions bundle multi-source parameters using the unified client context engine:

```
┌─────────────────────────────────────────────────────────────┐
│                       CONTEXT PIPELINE                      │
├─────────────────────────────────────────────────────────────┤
│ Route Path:       window.location.pathname                  │
│ Active Module:   Derived Workspace Core (Customs, Admin)    │
│ Active Workflow:  Dynamic Task Context Indicators           │
│ Language Preference: settingsStore language state           │
│ User Role Type:   Active authentication claims              │
│ Network Node:     Real-time connectivity and status telemetry│
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
        Unified JSON Session State passed to AI Gateway API
```

### A. Dynamic Prompts Generation
On compilation inside the LLM middleware layer, the system instruction block is augmented using the compiled context fields:
```
[LOCALIZED ENVIRONMENT: IDG_KU]
[ROLE CLASSIFICATION: Business (CLEARANCE_LEVEL_1)]
[ACTIVE WORKSPACE: Customs & Tariff Central Hub - Active Customs Workspace]
[SYSTEM TELEMETRY: CONNECTED // HEALTH: OPTIMAL]
```

This enforces strict boundary constraints, instructing the LLM to skip system debug statements when communicating with lower-clearance profiles, and to adjust legal language dynamically between Kurdish, Arabic, and English formats.

---

## 4. Structured AI Action Framework

To guarantee programmatic rendering safety on critical trade consoles, all AI Gateway return strings inside client-facing controls MUST map to structured event formats:

```json
{
  "action": "AIActionType",
  "payload": {
    "text": "Human readable response strings",
    "data": {},
    "toolName": "optional_execute_target",
    "toolInput": {},
    "requiredFields": []
  },
  "confidence": 0.95,
  "metadata": {
    "systemTraceId": "IDG-TR-YYYYY-2026",
    "processingDurationMs": 42,
    "intentCategory": "CUSTOMS",
    "userRoleCleared": "broker",
    "isAuthorized": true,
    "timestamp": "2026-05-28T03:11:00Z",
    "engineVersion": "2.6.0-Foundation"
  },
  "citations": [
    "Iraqi Tariff Decree No. 4 of 2026, Article 12, Clause C"
  ]
}
```

### Action Dispatch Rules:
1.  **DISPLAY_MESSAGE**: Normal interactive feedback.
2.  **EXECUTE_TOOL**: Triggers specific client operations or backend endpoints (e.g. HS customs calculators).
3.  **REQUIRE_INPUT**: Blocks the active loop until the broker supplies missing manifest parameters or PDFs.
4.  **ESCALATE_WORKFLOW**: Re-routes current queries to specialized human operators in case of persistent low confidence metrics.
5.  **ALERT_DISPATCH**: Broadcasts priority alert banners across active customs ports.
6.  **SECURITY_LOCK**: Suspends authentication session when fraudulent actions or unauthorized clearance queries are detected.

---

## 5. RAG Integration Roadmap (Phases 12-B / 12-C Prep)

The components established in Phase 12-A map directly to future production RAG setups:

1.  **Pre-Filtered Vector Indexing**:
    All future database chunks will carry metadata tags representing their maximum required clearance levels:
    - *Metadata filter query*: `(clearanceLevelRequired <= currentUserClearanceLevel)`
2.  **Multilingual Semantic Chunking**:
    Ensures that regulations indexed in Arabic and Kurdish maintain parent-child links to matching English translations using cross-lingual embeddings (e.g. multilingual-e5).
3.  **Governed Citation Anchoring**:
    RAG engines must output legal references that align strictly with the compiled `citations` schema. Any recommendation lacking formal Gazette or Decree references is omitted from critical business flows.

---

## 6. Phase 12-B Expansion: Context Fusion & Intelligence Routing

Phase 12-B introduces unified decision pipelines and validation gates, enabling the gateway to securely analyze and compile prompt context packages before server execution begins.

### A. Context Fusion Engine
The `ContextFusion` layer combines user classifications, local intents, and runtime telemetry variables into an immutable `AIContextSnapshot`. This provides a stable, unified operational envelope that prevents the chat system from relying on raw client inputs or unvalidated parameters during transaction processing.

```
┌───────────────────────────┐      ┌──────────────────────────┐
│        Local Intent       │      │  Runtime Client Context  │
└─────────────┬─────────────┘      └────────────┬─────────────┘
              │                                 │
              └────────────────┬────────────────┘
                               ▼
                    [ Context Fusion Engine ]
                               │
                               ▼
               [ Immutable AIContextSnapshot ]
```

### B. Decision Engine & Intelligent Router
The `DecisionEngine` evaluates the snapshot to execute routing plans, RAG query flags, and programmatic tool allocations.

```json
{
  "route": "/customs",
  "requiresRAG": true,
  "requiresTool": true,
  "riskLevel": "MEDIUM",
  "confidence": 0.85,
  "fallbackStrategy": "SAFE_MODE"
}
```

### C. Policy Gate Security Controls
The `PolicyGate` acts as a firewall preceding AI execution. By auditing clearance requirements dynamically, it intercepts potential privilege escalation, enforcing four standard actions:
*   **ALLOW**: Clearances verified; full access and tool triggers unlocked.
*   **DOWNGRADE**: Fall back to informational public contexts; sanitize and withhold corporate indices.
*   **ESCALATE**: Re-route processing to human operators in priority helpdesk queues.
*   **BLOCK**: Terminate transactions immediately with professional, secure refusals.

### D. Dynamic Prompt Compiler v1
The `PromptCompiler` synthesizes the `AIContextSnapshot`, `DecisionOutput`, and `SecurityStatus` into structured system instructions. It automatically configures localized language mappings (Sorani Kurdish, Standard Arabic, or English), enforces active user clearances, applies security fallback modifiers, and anchors outputs to strict markdown and structured action constraints.

---

## 7. Phase 12-C Expansion: Knowledge Brain & RAG Foundation

Phase 12-C implements standard interfaces, ingestion pipelines, metadata schemas, and retrieval checks mapping domain security barriers to real-time AI context loops.

### A. Knowledge Domains and Policies
Sovereign facts are structured across 5 distinct domains matching strict authentication levels:
*   **Strategic**: Strategic national developments (e.g., Al-Faw Port Shipping corridor coordinates). Available from Level-1 upward.
*   **Operational**: Real-time terminal checkpoint processes and backup logs. Available from Level-1 upward.
*   **Customs**: Ad-valorem tariffs, custom tax exemptions, and HS schedules under the 2026 Customs Law. Available publicly (Level-0+).
*   **Compliance**: Anti-money laundering checkups and CBI digital escrow regulations. Restricts access to Level-2+.
*   **Identity**: Core cryptographic biometrics (MOSS-ID). Restricted to Level-3+ governmental or banking delegates with dual checks enabled.

### B. Ingestion Pipeline & Script Standardizations
The text normalization pipeline standardizes complex multilingual strings to align Arabic and Kurdish orthographies. For example:
*   **Arabic**: Strips harakat, normalizes variants of Alif (`أ|إ|آ` to `ا`), standardized Taa Marbuta (`ة` to `ه`), and maps Alif Maqsurah (`ى` to `ي`).
*   **Kurdish (Sorani)**: Replaces complex typographic letters to match standard keys (`ھ` to `ه`, `ى` to `y`, `ك` to `ک`).

Ingested documents are split into discrete search chunks under configurable strategies (`LOGICAL_SECTION` splitting by articles, or `FIXED_TOKEN` character boundaries with overlapping margins).

### C. Active Retrieval & Citations Verification
The RAG retrieval pipeline applies dynamic authorization barriers:
1.  **Authorize Domain Check**: Prior to matching, any document belonging to a domain that requires a clearance level higher than the active session's clearance is omitted.
2.  **Hybrid Token Matches**: Performs keyword-based frequency matches combined with tag correlations to calculate relevance.
3.  **Auditable Citations**: Automatically yields highly trace-checked metadata references containing the source database, specific law clauses, confidence scoring, and document classification levels.

---

## 8. Phase 12-D Expansion: Secure Tool Execution & Governance Layer

Phase 12-D establishes the programmatic execution boundaries enabling the IDG AI engine to interface with back-office and border systems safely.

### A. Central Tool Registry
Tools are registered under strict structural constraints, each mapping to explicit user matrices, required clearance floors, inputs validation schemas, and expected returns:
*   **`customs.calculateDuty`**: Computes standard cargo duties, sales tax, processing levies for cars and generic shipments under 2026 tariff formulas. (Required Level: 0+)
*   **`customs.classifyHS`**: Generates closest matching HS digits using natural text descriptions. (Required Level: 0+)
*   **`logistics.trackShipment`**: Locates active shipment manifests, reporting port terminal checkpoints. (Required Level: 1+)
*   **`compliance.checkSanctions`**: Screens companies or vessels against the CBI regulatory hold directories. (Required Level: 2+)
*   **`notifications.dispatch`**: Transmits instant alerts or status banners directly to local port terminals. (Required Level: 2+)
*   **`audit.logEvent`**: Records crucial system transactions onto decentralized indexing ledgers. (Required Level: 2+)

### B. Safety Guard Boundary Engine
Before any action commences, the `SafetyGuardSystem` audits the payload:
1.  **Clearance Verification**: Checks whether the caller's clearance level equals or exceeds the tool's required level.
2.  **Role Authorization**: Confirms the caller's specific `UserType` is explicitly authorized in the tool registry.
3.  **Threat Analysis**: Intersects with the dynamic threat levels generated by the `DecisionEngine`. If risk is flagged as `'CRITICAL'`, high-sensitivity tools are frozen immediately in favor of automated operator escalation.
4.  **Event Mitigation**: If any breach or unauthenticated action is intercepted, the system drops the operation and dispatches a `'security.violation.detected'` operational alert.

### C. Execution Engine & Structured Returns
The `ToolExecutionEngine` handles safe functional simulations. On successful validation, it computes real duties, runs status mockups, matches test sanctions, and issues operational event broadcasts using the `ToolEventEmitter`. Every completed operation registers an immutable block-audit signature returning:

```json
{
  "action": "EXECUTE_TOOL_SUCCESS",
  "payload": {
    "toolId": "customs.calculateDuty",
    "success": true,
    "data": {
      "totalDutiesUSD": 1500,
      "salesTaxUSD": 575,
      "regulatoryFeesUSD": 450,
      "totalChargesUSD": 2525
    }
  },
  "status": "SUCCESS",
  "confidence": 0.95,
  "auditTrail": {
    "traceId": "IDG-EXEC-125042-2026",
    "systemTraceId": "IDG-TR-88204-2026",
    "userType": "Business",
    "clearanceLevel": 1,
    "toolId": "customs.calculateDuty",
    "actionCode": "ALLOW",
    "timestamp": "2026-05-28T03:30:00Z",
    "classificationLabel": "Authorized Operational (Level-1)",
    "checksumConsensusToken": "sha256:sys_f98ds"
  },
  "timestamps": {
    "receivedAt": "2026-05-28T03:30:00Z",
    "completedAt": "2026-05-28T03:30:00.042Z",
    "durationMs": 42
  }
}
```

### D. Operational Event System
Decoupled back-office operations communicate using an event bus (`ToolEventEmitter`). External listeners easily subscribe to capture critical system outputs:
*   `shipment.updated`
*   `customs.review.started`
*   `customs.review.completed`
*   `compliance.alert`
*   `ai.action.executed`
*   `security.violation.detected`

