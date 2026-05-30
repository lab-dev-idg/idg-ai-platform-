# Iraq Digital Gateway (IDG) — National Knowledge Brain Reasoning Architecture

This document establishes the strategic design and technical blueprint for **Phase 13-C: National Knowledge Brain Reasoning Architecture**. This architecture transitions the Iraq Digital Gateway from a metadata retrieval node into a sovereign, reasoning-driven cognitive infrastructure capable of executing multi-stage logical evaluations under strict clearances.

---

## 1. System Topology & Logical Architecture Diagram

The Reasoning-Driven National Knowledge Brain layers atop the semantic indices created in Phase 13-B, introducing analytical and deductive logic before outputting verdicts.

```
                  ┌─────────────────────────────────────┐
                  │          Client User Query          │
                  └──────────────────┬──────────────────┘
                                     │
                                     ▼
                  ┌─────────────────────────────────────┐
                  │       Stage 1: Intent Detection     │ (Identify Domain, e.g., TARIFF, COMPLIANCE)
                  └──────────────────┬──────────────────┘
                                     │
                                     ▼
                  ┌─────────────────────────────────────┐
                  │       Stage 2: Gated Retrieval      │ (Enforce clearance audits)
                  └──────────────────┬──────────────────┘
                                     │
                                     ▼
     ┌─────────────────────────────────────────────────────────────┐
     │            Stage 3: Evidence Validator Core                 │
     │                                                             │
     │  ┌───────────────────────┐       ┌───────────────────────┐  │
     │  │  Evidence Veracity    │       │ Contradiction Search  │  │
     │  └──────────┬────────────┘       └──────────┬────────────┘  │
     │             │                               │               │
     │             ▼ (Source Trust Scores)         ▼ (Conflicts)   │
     │  ┌───────────────────────┐       ┌───────────────────────┐  │
     │  │   Reliability Metrics │       │ Conflict Resolver     │  │
     │  └───────────────────────┘       └───────────────────────┘  │
     └───────────────────────────────┬─────────────────────────────┘
                                     │
                                     ▼
                  ┌─────────────────────────────────────┐
                  │    Stage 4: Missing Evidence Scan   │ (Check missing laws/CBI directives)
                  └──────────────────┬──────────────────┘
                                     │
                                     ▼
                  ┌─────────────────────────────────────┐
                  │      Stage 5: Reasoning Engine       │ (Domain-specific legal evaluation)
                  └──────────────────┬──────────────────┘
                                     │
                                     ▼
                  ┌─────────────────────────────────────┐
                  │     Stage 6: Confidence Compiler     │ (Scores results or escalates to expert)
                  └──────────────────┬──────────────────┘
                                     │
                  ┌──────────────────┴──────────────────┐
                  │  Does results pass trust thresholds? │
                  └────────┬──────────────────────┬─────┘
                           │ (YES)                │ (NO / Rule Clash)
                           ▼                      ▼
              ┌────────────────────────┐  ┌────────────────────────┐
              │ Output Gated Verdict   │  │ Escalate to Human review│
              │  with Active Citations │  │      Expert Gateway     │
              └────────────────────────┘  └────────────────────────┘
```

---

## 2. Multi-Stage AI Decision Pipeline

Every incoming query is executed via an isolated lifecycle across the **8-Stage AI Decision Pipeline**:

1. **Query Ingestion**: Capture user question, clearance parameters, and active role type.
2. **Intent Detection**: The Pipeline parses nouns and keywords (e.g. "exemption", "HS code") to map the question to a specific domain index (e.g. `ReasoningType.TARIFF`, `ReasoningType.COMPLIANCE`).
3. **Sovereign Gated Retrieval**: Calls `SemanticRetrievalService` to search vectors. Chunks are automatically blocked if `UserClearance < DocumentClassification`.
4. **Evidence Validation**: Matches retrieved items against the verified knowledge registry to assert source reputation (`trustScore`), metadata integrity, and content veracity.
5. **Conflict Resolution**: Scans pair-wise evidence to identify direct rule conflicts, and applies automated resolution strategies such as **Higher Authority Prevails** or **Latest Publication Date Prevails**.
6. **Missing Evidence Identification**: Checks if key articles of law necessary for executing calculations are missing from the retrieved context.
7. **Deductive Reasoning**: Invokes the dedicated reasoning subclass (e.g. Customs compliance or Tariff math) to construct a structured analytical verdict.
8. **Confidence Scoring & Flow Routing**: Updates the final confidence index. If the confidence falls below `0.60` or unresolvable legal conflicts remain, the pipeline routes the transaction into the **Human-In-The-Loop Expert Review Sandbox** and holds automated gateway steps vectoring.

---

## 3. National Knowledge Domain Ontology

The National Knowledge Brain structures information into a formal ontology rather than independent text vectors:

```
                         ┌───────────────┐
                         │   MINISTRY    │
                         └───────┬───────┘
                                 │ APPOINTS
                                 ▼
                         ┌───────────────┐
                         │   AUTHORITY   │
                         └───────┬───────┘
                                 │ ENFORCES
                                 ▼
                         ┌───────────────┐
                         │ LAW / DECREE  │
                         └───────┬───────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         │ AMENDS                │ SUPERSEDES            │ GOVERNS
         ▼                       ▼                       ▼
 ┌───────────────┐       ┌───────────────┐       ┌───────────────┐
 │ LAW / DECREE  │       │ LAW / DECREE  │       │CARGO / DOMAIN │
 └───────────────┘       └───────────────┘       └───────────────┘
```

### Knowledge Objects (Entities)
- **Law Node**: Primary legislative codes enacted by parliament (highest trust).
- **Decree/Circular Node**: Implementation guidelines published by executive ministries to clarify laws (subject to expiration or supersede rules).
- **Rule Node**: Exact mathematical tariff rates or compliance constraints.
- **Actor Node**: Operators, brokers, customs controllers, and executive planners.

### Knowledge Relationships (Edges)
- **AMENDS**: Modifies another document.
- **SUPERSEDES**: Completely de-lists previous instructions.
- **REFERS_TO**: Cites or maps contexts together.
- **CONTRADICTS**: Direct logical clash between rules.
- **IMPLEMENTS**: Translates legal instructions into software triggers.
- **EXEMPTS**: Describes a carve-out or loophole condition to general rules.
- **GOVERNS**: Connects authority nodes to specific operational areas.

---

## 4. Key Contracts & API Specifications

To guarantee zero vendor lock-in and pristine interoperability, all schemas adhere to strict, typed contract specifications:

### A. Brain API Interface Contract
```typescript
interface IBrainInterface {
  executeDecisionPipeline(
    queryText: string,
    user: { userId: string; userType: UserType; clearanceLevel: number }
  ): Promise<CompleteDecisionOutput>;
}
```

### B. Retrieval Contract
```typescript
export interface RetrievalMatch {
  chunkId: string;
  documentId: string;
  content: string;
  score: number; // Combined hybrid weight
  classification: KnowledgeClassification;
  domain: KnowledgeDomain;
  source: string;
}
```

### C. Reasoning & Evaluation Contract
```typescript
export interface ReasoningEvaluation {
  type: ReasoningType;
  logicalSteps: string[];
  verdict: string;
  suggestedAction?: string;
  confidenceScore: number; // Normalized 0.00 to 1.00 index
  citations: string[];
  conflictsDetected: ReasoningConflict[];
  missingEvidenceCount: number;
  missingEvidenceDetails: string[];
}
```

### D. Citation Traceability Contract
```typescript
export interface EvidenceCitation {
  documentId: string;
  citationTitle: string;
  originAuthority: string;
  publicationDate: string;
  applicableSection: string;
  trustScore: number;
}
```

---

## 5. Security, Governance, & Service boundaries

To secure Iraqi national trade and regulatory sovereignty, the system separates concerns into strict architectural boundaries:

```
 ┌─────────────────────────────────────────────────────────────────────────┐
 │                   PUBLIC/CONSUMER ACCESS LAYER INDEX                    │
 └────────────────────────────────────┬────────────────────────────────────┘
                                      │ Public API requests
                                      ▼
 ┌─────────────────────────────────────────────────────────────────────────┐
 │                   SOVEREIGN SECURITY BOUNDARY HUB                       │
 │                                                                         │
 │  - Enforces: Clearance Level >= Document Classification                 │
 │  - Zero leakage of RESTRICTED, CONFIDENTIAL, or SECRET assets           │
 └────────────────────────────────────┬────────────────────────────────────┘
                                      │ Filtered requests
                                      ▼
 ┌─────────────────────────────────────────────────────────────────────────┐
 │                     REASONING & INGESTION ENGINES                       │
 │                                                                         │
 │  - EmbeddingEngine (API free vector simulation)                        │
 │  - ReasoningEngine (Sovereign customs rules logic)                      │
 │  - EvidenceValidator (Conflict & omission identification)              │
 └─────────────────────────────────────────────────────────────────────────┘
```

* **Core Security Rules**: No chunk, text snippet, or metadata is processed in memory unless the session context passes the security clearing gate. All access attempts—whether successful or blocked—are recorded in a non-volatile Audit Log that remains isolated from the public network space.
* **Service Boundaries**: The reasoning services are decoupled from the consumer interface. This architecture is built to run on sovereign containers (e.g., dedicated Cloud Run, isolated private Kubernetes networks, or hybrid on-premises systems) to prevent unauthorized exfiltration of customs telemetry data.

---

## 6. Recommendations & Technical Rationale

### Recommendation 1: Dynamic Decision Gating
- **What**: Automated Expert Human-in-the-Loop review routing when pipeline confidence drops below `0.60` or unresolved conflicts exist.
- **Why**: Protects national trade lanes from automated calculation mistakes while ensuring that legal amendments are reviewed by real experts before automated clearance actions are taken.
- **Capabilities**: Translates raw compliance disputes into structured reviewer tasks, allowing expert and legal teams to override systems or record permanent exceptions.

### Recommendation 2: Date-Sensitive Supersede Resolution
- **What**: Enforcing `LATEST_DATE_PREVAILS` resolution logic across database documents.
- **Why**: Solves the "Amendment Lag" problem where old circulars contradict newly published Gazette laws.
- **Capabilities**: Automatically detects publication timestamps and de-ranks obsolete items, raising system precision.

### Recommendation 3: Hybrid Blend Scoring
- **What**: Combining dense vector proximity (`60%` weight) with literal token overlapping density (`40%` weight).
- **Why**: Solves the semantic drift problem where legal numbers (HS Codes, Article numbers) look similar in vector space but must match exactly.
- **Capabilities**: Ensures the system is both context-aware and highly accurate when reading technical regulatory documents.

---

## 7. National Knowledge Brain Maturity Model

The digital gateway measures its cognitive intelligence and security robust capabilities across five levels of maturity:

1. **Level 1 — Structured Repository (Ingest and Categorize)**: Single text storage with simple keyword filters. No clearance evaluation or vectors.
2. **Level 2 — Semantic Retrieval (Index and Search)**: Dynamic vectors generation, hybrid ranking, and secure clearances gates (implemented in Phase 13-A/B).
3. **Level 3 — Reasoning-Driven Advisor (Logical Verdicts)**: Multi-Stage decision pipeline, evidence validation, conflict evaluation, and automated resolution (implemented in Phase 13-C).
4. **Level 4 — Cognitive Automation (Integrated Actions)**: Automated tariff calculations, secure escrow releases, biometrics sync, and validation across border checkers.
5. **Level 5 — Sovereign Autonomous Brain (Self-Correcting)**: Real-time conflict modeling across live ministerial gazette updates. Automated draft alerts created for administrative planners when legislative contradictions are spotted.
