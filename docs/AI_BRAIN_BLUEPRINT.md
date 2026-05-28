# Iraq Digital Gateway: AI Brain & Operational Intelligence Blueprint
**System Version**: 2.6.0-Enterprise  
**Updated**: May 2026  
**Classification**: Government Confidential / Operation-Native  

---

## 1. Knowledge Taxonomy

This taxonomy lays out the official classification and governance strategy for text corpus, regulatory materials, trade laws, and telemetry metrics within the Iraq Digital Gateway (IDG) AI-native ecosystem.

| Domain | Purpose | Primary Ownership | Classification | Access Constraints | Future Retrieval Requirements |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Strategic Knowledge** | Sovereign digital trade policies, national economic corridors, and logistics infrastructure targets (2025–2035). | Council of Ministers / Ministry of Planning | Restricted | Government Officials (Level-2 Security clearance) | High-level synthesis, semantic trend maps, and master initiative alignment. |
| **Operational Knowledge** | Real-time port flows, checkpoint schedules, average waiting times, and active terminal handling rates. | State Company for Iraqi Ports / Border Ports Commission | Internal | Registered Customs Brokers & System Monitors | Sub-5-minute fresh cache updates, geo-fenced query routing. |
| **Customs Knowledge** | Iraqi Customs Law (Law No. 23 of 1984, updated 2026), tariff lists, and border classification decrees. | General Customs Commission / Secretariat | Confidential | Sovereign Auditors & Customs Officers (Level-1) | Precise multi-clause matching, legacy decree correlation, and legal rule-of-law checks. |
| **Logistics Knowledge** | Transit corridors, manifest template models, container dimensions, and multi-modal freight routes (Umm Qasr to Baghdad). | Ministry of Transportation | Public | Public Access / Guest Accounts | Fast keyword and synonym lookup, standard schema mappings. |
| **Government Knowledge** | Inter-agency cooperation protocols, ministry approvals, security clearings, and centralized licensing. | General Secretariat of Ministers | Restricted | Verified Entities (Gov-to-Gov APIs) | Active role validation, digital signature mappings, and secure chain-of-custody. |
| **Telecom Knowledge** | Border fiber link statuses, microwave carrier backup configurations, and gateway encryption standards. | Iraqi CMC (Communications & Media Commission) | Restricted | Network Operations Center (NOC) Core Operators | High-performance graph-based network query tools with real-time SNMP metrics. |
| **Compliance Knowledge** | Anti-Money Laundering (AML) standards, dual-use technology blocks, and sanctioned entity lists. | Central Bank of Iraq (CBI) / Office of Financial Intelligence | Confidential | Compliance Auditors (Level-0 Admin) | Zero-false-negative fuzzy matching, absolute vector search match indices, external database hooks. |
| **Security Knowledge** | API gateway security keys, server firewalls, access logs, and SHA-256 transaction consensus rules. | CMC Security Cell / IDG Cyber Commission | Secret | System Administrators Only | Isolated query-free offline encryption patterns with hardware token keys. |
| **Identity Knowledge** | National ID verification schemas, biographical data, business registrations, and authority bindings. | Ministry of Interior / Joint Border Security Commission | Confidential | Sovereign Identity Handlers | OAuth 2.0 / Firebase Auth token validation, secure ephemeral sessions. |
| **Business Knowledge** | Registered cargo weights, commercial invoices, transit logs, and consignee history records. | Iraqi Chamber of Commerce | Internal | Paid Brokers / Cargo Owners | Dynamic field level filtering, encryption at rest per tenant, audit log traces. |
| **Investment Knowledge** | Foreign direct investment rules, free zone benefits, tax exemptions, and investment commission guides. | National Investment Commission | Public | Public / Foreign Investors | Universal translation support, interactive conversational guides. |
| **Developer Knowledge** | API specs, Webhook definitions, mock sandbox schemas, and SDK usage documentations. | IDG Developer Platform Team | Public | Authorized Software Vendors | High-fidelity code-block retrieval, Swagger integration, version logs. |

---

## 2. Knowledge Classification Model

To secure national intelligence boundaries while ensuring frictionless commerce, the IDG AI Core enforces a quadrant-based security rating on all document chunks and dynamic contexts:

```
                  ┌──────────────────────────────┐
                  │          SECRET              │
                  │   Direct System-Level Only   │
                  └──────────────┬───────────────┘
                                 │
                  ┌──────────────┴───────────────┐
                  │       CONFIDENTIAL           │
                  │  Sovereign Broker & Auditor  │
                  └──────────────┬───────────────┘
                                 │
                  ┌──────────────┴───────────────┐
                  │         RESTRICTED           │
                  │ Verified Business & Telecom  │
                  └──────────────┬───────────────┘
                                 │
                  ┌──────────────┴───────────────┐
                  │          PUBLIC              │
                  │   Global Standard Queries    │
                  └──────────────────────────────┘
```

### A. Public Classification (Level-3)
*   **Visibility**: Accessible globally without authentication.
*   **Retrieval Permissions**: Open vector search indexes on non-sensitive materials (e.g., standard customs calculators, basic port timetables).
*   **Citation Requirements**: Standard digital documentation links.
*   **Governance Requirements**: Monitored for data poisoning; updated quarterly under General Commission review.

### B. Internal Classification (Level-2)
*   **Visibility**: Accessible to all verified registered brokers, freight companies, and system operators.
*   **Retrieval Permissions**: Query access restricted to active transaction datasets, manifest records, and direct port telemetry.
*   **Citation Requirements**: Cryptographically signed reference codes matching active Firestore database entries.
*   **Governance Requirements**: Full session logging, monthly policy validation, and automated trace audits.

### C. Restricted Classification (Level-1)
*   **Visibility**: Accessible only to sovereign officials and verified Ministry staff.
*   **Retrieval Permissions**: Cross-agency search authorization. Retrieval of tariff codes matching dual-use lists, checkpoint guard details, and priority routes.
*   **Citation Requirements**: Level-1 credential validation; citations mapped directly to state Gazette publication references.
*   **Governance Requirements**: Dynamic temporary token access; automated warning flags raised on query boundary leakage.

### D. Confidential/Secret Classification (Level-0)
*   **Visibility**: Accessible only to system-admin services and verified executive clearing agents.
*   **Retrieval Permissions**: Direct manual approvals. Zero vector-index retention; queries are executed within isolated, non-persistent processes.
*   **Citation Requirements**: Strictly isolated references. Direct validation hashes only, avoiding physical text display.
*   **Governance Requirements**: Daily manual audit of compliance; instant session lock upon unauthorized query pattern detection.

---

## 3. Intent Taxonomy & Routing

Each user prompt processed by the IDG Gateway AI terminal is routed through a standard classifier. The intent groups determine the execution pipelines, system system parameters, and response templates:

```
[ User Prompt ] ──> [ Intent Classifier ]
                          │
         ┌────────────────┼────────────────┐
         ▼                ▼                ▼
     [Citizen]        [Business]     [Government]
   (Public Info)    (Direct Trade)   (Sovereign Audit)
```

### A. Citizen (Standard Public Inquiry)
*   **Purpose**: Guidance on imports/exports, tariff estimates, and border crossing prerequisites as single citizens.
*   **Routing**: Standard pipeline utilizing Gemini 1.5 Flash. Low latency constraint.
*   **Escalation**: Standard Helpdesk Ticketing if satisfaction index is low.
*   **Workflow Requirements**: High-level translation to Kurdish/Arabic/English.

### B. Business / Customs Broker
*   **Purpose**: Direct trade manifest preparation, HS Tariff Calculations, CIF valuation review, and custom duty estimations.
*   **Routing**: Verified pipeline using context-aware trade catalogs and Google Drive backup hooks.
*   **Escalation**: Fast-pass to licensed customs broker supervisors.
*   **Workflow Requirements**: Integration of active calculator tools with full system telemetry metadata.

### C. Government Officials
*   **Purpose**: Cross-border audit checks, dual-use technology clearance checks, and security monitoring.
*   **Routing**: Level-1 secure Gemini Pro pipeline running strictly inside the Gov-Virtual Private Network bounds.
*   **Escalation**: Immediate escalation to National Control Cockpit.
*   **Workflow Requirements**: Real-time multi-level audits with cryptographic verification hashes.

### D. Telecom Carriers
*   **Purpose**: Fiber link coordination, network routing policies, and border station network outages.
*   **Routing**: Network operations diagnostic tools.
*   **Escalation**: CMC Core engineering callouts.
*   **Workflow Requirements**: Diagnostic runbook lookup and SNMP telemetry matching.

### E. Developer / Integrators
*   **Purpose**: API integration support, OAuth Google Drive configurations, Webhook troubleshooting.
*   **Routing**: System architecture reference manuals.
*   **Escalation**: System Architect support queue.
*   **Workflow Requirements**: High-fidelity JSON sandbox validations and schema checks.

---

## 4. Context Model & Propagation

The IDG Context Engine integrates diverse inputs to generate a highly targeted System Instruction set before querying the core LLM:

```
                 Context Sources
┌──────────────────────────────────────────────┐
│  Route State  | Language Code | User Profile │
│  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─  │
│  Workflow ID  | Module State  | GPS Telemetry│
└──────────────────────┬───────────────────────┘
                       ▼
            [IDG CONTEXT COMPOSER]
                       ▼
       [Unified System Prompt Matrix]
```

### A. Context Priorities (Hierarchy)
1.  **Security Profile / User Role** (Confidential vs. Public bounds)
2.  **Current Module State** (Customs & Tariff Central Hub vs. Dashboard)
3.  **Active Workflow State** (Manual Calculation vs. Verified File Backup)
4.  **Display Language** (Preference of Arabic, Kurdish, or English)

### B. Conflict Resolution
*   *Language Mismatch*: If user queries in Kurdish while location telemetry points to Basra, the system defaults output and tool descriptions to the preferred Kurdish user language while maintaining Arabic regulatory citation codes.
*   *Role Conflict*: If a standard Broker attempts to access operational checkpoint security parameters on an active shipment, the context engine automatically drops the "Security Knowledge" block from the pipeline, responding using standard public parameters.

### C. Propagation Model
Context states are carried through the request headers in client-session requests (such as our custom `/api/chat/stream` payload):
```json
{
  "message": "Verify this HS code for digital servers",
  "context": {
    "language": "ku",
    "currentModule": "Customs & Tariff Central Hub",
    "customsWorkflowState": "Active Customs Workspace",
    "operationalState": {
      "realtimeConnectivity": "CONNECTED"
    }
  }
}
```
This payload is translated to dynamic backend operations which enforce context adjustments during active chat generation sequences.

---

## 5. Workflow Registry

These official system-driven workflows coordinate multiphase tasks across the platform:

```
[Trigger Event] ──> [Workflow Controller] ──> [Tool & DB Orchestrator] ──> [Status Updates]
```

### A. Customs & HS Classification Workflow
*   **Trigger**: Entry of shipment detail in the Customs Calculator.
*   **Inputs**: Item Description, Declared CIF Value, Origin Country.
*   **Outputs**: Recommended HS Code, Calculated Custom Duty, Surcharge breakdown.
*   **Escalation**: If tariff variance is >25% of baseline index, flag for Audit Panel review.
*   **Future Tools**: `automutedTariffVerifier`, `sovereignDiscrepancyLogger`.

### B. Document Verification & Cloud Archive Workflow
*   **Trigger**: User triggers "Backup to Google Drive" on active calculations.
*   **Inputs**: Text payload of the active assessment, Auth Token.
*   **Outputs**: Exported text manifest with secure checksum tags, transaction logs.
*   **Escalation**: Token expiration Escalation prompts for re-auth.
*   **Future Tools**: `gdriveFileUploader`, `checksumGenerator`.

---

## 6. Tool Registry

The master tool definition list for IDG Gateway AI operations:

```
      IDG Master Tool Registry
┌─────────────────────────────────┐
│     ACTIVE PRODUCTION TOOLS     │
├─────────────────────────────────┤
│ • Customs Duty Calculator      │
│ • Tariff Code Lookup Engine     │
│ • Shipment Duration Estimator   │
│ • Notification Dispatcher       │
└────────────────┬────────────────┘
                 ▼
┌─────────────────────────────────┐
│      FUTURE EXTENSION TOOLS     │
├─────────────────────────────────┤
│ • Google Drive Cloud Sync Tool  │
│ • Checksum Audit Verifier       │
│ • Legal Decree Vector Searcher  │
└─────────────────────────────────┘
```

### A. Active Production Tools
1.  **Customs Duty Calculator**: Parses commercial cargo classifications to output total tax multipliers.
2.  **Tariff Lookup Engine**: Resolves products to the official Iraqi Harmonized Tariff schedule (HS Codes).
3.  **Shipment Duration Estimator**: Evaluates logistics corridor checkpoints to flag delays or transit times.
4.  **Notification Dispatcher**: Dispatches alert cards and emails through modern secure SMTP connections.

### B. Future Domain-Specific Tool Categories
*   **Knowledge Tools**: `queryOfficialGazette(decreeId)`, `searchCustomsManual(query)`.
*   **Workflow Tools**: `lockDeclaration(docId)`, `signManifest(checksum, key)`.
*   **Compliance Tools**: `checkSanctionsList(name)`, `verifyRegulatoryLicense(brokerId)`.
*   **Identity Tools**: `validateSovereignID(nationalId)`, `generateOAuthToken(service)`.

---

## 7. AI Decision Engine Architecture

The core processing cycle of the IDG AI Gateway:

```
[ User Input ]
      │
      ▼
┌──────────────────────────────────────────────┐
│  Phase 1: Intent Classification              │
│  Classify input into a standard IDG intent.   │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│  Phase 2: Context Resolution                 │
│  Load active route, language, and user metadata.│
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│  Phase 3: Knowledge Retrieval (RAG)           │
│  Pull matching vector chunks based on security.│
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│  Phase 4: Workflow & Tool Orchestration      │
│  Decide if specialized tools must run.       │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│  Phase 5: Output Synthesis & Guardrails      │
│  Format structured JSON with citations.      │
└──────────────────────────────────────────────┘
```

1.  **Intent Classification**: Inspects input using semantic tokens. Filters out unrelated inquiries.
2.  **Context Resolution**: Blends client metadata. Resolves conflict boundaries.
3.  **Knowledge Retrieval (RAG)**: Initiates semantic vector search. Applies access control filter to return valid chunks.
4.  **Workflow & Tool Selection**: Triggers tools or updates process state parameters.
5.  **Output Synthesis**: Restructures raw model responses into beautiful markdown formats inside the standardized JSON payload blocks.

---

## 8. Structured Action Framework

To avoid uncontrolled LLM text slop, all IDG AI gateway responses must adhere to this unified JSON structure which guarantees front-end rendering integrity:

```json
{
  "action": "DISPLAY_MESSAGE",
  "payload": {
    "text": "Your custom duty calculation has been processed.",
    "data": {
      "baseValue": 184200,
      "tariffRate": 0.15,
      "finalSurcharges": 27630
    }
  },
  "confidence": 0.98,
  "metadata": {
    "systemTraceId": "IDG-TR-88192-2026",
    "securityRole": "Customs Broker"
  },
  "citations": [
    "Iraqi Tariff Decree No. 4 of 2026, Article 12, Clause C"
  ]
}
```

### Action Catalog
*   `DISPLAY_MESSAGE`: Traditional chat-to-user response cards.
*   `EXECUTE_TOOL`: Invokes integrated front-end widgets or backend connectors.
*   `REQUIRE_INPUT`: Suspends process to prompt users for specific missing document files.

---

## 9. Governance & Quality Control

### A. Integrity Framework
*   **No Multi-Tenant Pollution**: Session buffers must be purged the moment a WebSocket disconnect event occurs.
*   **Continuous Prompt Protection**: System prompt overrides must be reviewed by the General Customs Commission technical panel.

### B. Audit Lifecycle Diagram
```
[Update of Regulation] ──────> [Expert Panel Audit] ──────> [Push to Vector Database]
                                                                    │
                                                                    ▼
[Trace Audit Log] <────── [Agent Logs Transaction] <────── [User Custom Query]
```

---

## 10. Future RAG Ingestion & Delivery Layout

The blueprint for implementing a highly secure, multilingual retrieval system:

```
            Ingestion Pipeline
┌──────────────────────────────────────────────┐
│  Raw State Decrees (Kurdish/Arabic/English)  │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│  Metadata Tagging (Access Level, Law ID)     │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│  Chunking Engine (Sentence Window + Overlap)    │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│  Vector Embeddings (Multilingual Model)     │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│  Access-Aware Retrieval Query Engine         │
└──────────────────────────────────────────────┘
```

1.  **Ingestion & Structuring**: Standardizing regulatory PDF files into raw text matched with official publication dates.
2.  **Multilingual Semantic Chunking**: Overlapping blocks (max 256 tokens) with high-density parent-child pointers.
3.  **Access-Aware Filters**: Vector queries append user authorization levels directly to search indices: `(AccessLevel <= UserRoleLevel)`.
4.  **Dynamic Citation Mapping**: The Generator MUST list the specific decree file, page, and paragraph for any compliance recommendations.

---

## 11. Gap Analysis

| Asset / System Area | Current State | Target State | Architectural Gap | Risk Level |
| :--- | :--- | :--- | :--- | :--- |
| **Data Vectorization** | Hardcoded JSON context references. | Full context vector storage in Google Cloud Vertex AI Vector Search. | No live scalable semantic vector lookup. | **Medium** |
| **Authentication Binding** | Guest session with manual demo mode options. | Production SSO using Iraqi General ID / Google integration. | Lack of physical ID tracking. | **High** |
| **Bilingual Mappings** | Translation dictionary files loaded hard on client. | LLM-native translation matrix combined with official Gazettes. | Discrepancy risks between legal dialects. | **Medium** |
| **Tool Execution** | Mock responses on some custom tools. | Direct state updates linked to the secure Firestore ledger database. | Isolated front-end states. | **Low** |

---

## 12. recommended phase 12 implementation plan

```
               Phase 12 Implementation Timeline
 ╔══════════════════╦══════════════════╦══════════════════╗
 ║      Week 1      ║      Week 2      ║      Week 3      ║
 ╠══════════════════╬══════════════════╬══════════════════╣
 ║  • RAG Index     ║  • Trust Core    ║  • Pilot Test    ║
 ║    Ingestion     ║    Integration   ║    with Brokers  ║
 ║  • Vector Store  ║  • Live Auth     ║  • Final Safety  ║
 ║    Deployment    ║    Hookups       ║    Signoff       ║
 ╚══════════════════╩══════════════════╩══════════════════╝
```

*   **Week 1: RAG Index Ingestion**: Load the 2026 Customs Gazette into Pinecone/Firestore vectors; configure chunk-level security parameters.
*   **Week 2: Trust Core Integration**: Link Google Drive OAuth integrations to general customs manifest pipelines; enforce dynamic state tracking.
*   **Week 3: Final Pilot Test**: Perform live end-to-end audit procedures under supervised customs brokers.
