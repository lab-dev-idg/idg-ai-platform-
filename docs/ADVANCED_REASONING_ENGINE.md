# REPUBLICATION OF IRAQ DIGITAL GATEWAYS (IDG)
## Phase 13-E: Advanced Reasoning & Citation Engine Blueprint
### Sovereign Trust Core & Regulatory Alignment Document

This documentation catalogs the architectural mechanics, pipeline integrations, trust factors, and security policies of the Phase 13-E Advanced Reasoning & Citation Engine within the Iraq Digital Gateway (IDG).

---

## 1. Architectural Overview

The **Advanced Reasoning & Citation Engine (Phase 13-E)** shifts the National Knowledge Brain from a simple retrieval-based context repository to a zero-fabrication, trust-proven automated reasoning microkernel. It conducts formal verification, evidence correlation, multi-tier regulatory contradiction auditing, and precise citation tracing as part of standard sovereign-grade intelligence operations.

```
+-----------------------------------------------------------------------------------+
|                                  USER QUERY INPUT                                 |
+-----------------------------------------------------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                          STAGE 1: GATED RETRIEVAL & VECTOR SEARCH                |
+-----------------------------------------------------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                        STAGE 2: EVIDENCE COLLECTION ENGINE                         |
|   - Aggregates registry/semantic chunks matching user clearance                   |
|   - Normalizes, deduplicates, and traces source lineage                           |
+-----------------------------------------------------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                       STAGE 3: REGULATORY CONFLICT RESOLVER                       |
|   - Executes pairwise inspection of mandates to find instruction overlap          |
|   - Applies 4-Tier Governance Hierarchy of Legal/Ministry precedence              |
+-----------------------------------------------------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                         STAGE 4: CONFIDENCE SCORING SYSTEM                       |
|   - Blends Trust Rate (25%), Freshness (20%), Coverage (15%),                    |
|     Consistency (20%) & Ministry Authority Weight (20%)                           |
+-----------------------------------------------------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                         STAGE 5: ANSWER SYNTHESIS ENGINE                          |
|   - Generates Short/Legal/Tech citations, constructs clean markdown reports       |
|   - Enforces absolute sanitization (purges sub-paths / private info)              |
+-----------------------------------------------------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                        STAGE 6: IMMUTABLE AUDIT TRAIL LOG                         |
|   - Serializes query traces with microsecond precision directly to Firestore      |
+-----------------------------------------------------------------------------------+
```

---

## 2. Core Service Modules

### A. Evidence Collection Engine (`EvidenceCollector.ts`)
The collection subsystem queries multiple vector and statutory indices including standard local relational schemas, semantic indices, and prepared connectors for future cloud-scale vertex datasets.
- **Deduplication:** Uses high-resolution similarity and trust bounds to prune redundant chunk blocks.
- **Lineage Tracing:** Attaches document references, origin nodes, publishing authority metrics, and classification bounds directly to each isolated intelligence node.

### B. Citation Engine (`CitationEngine.ts`)
Maps verified findings to official government registers with support for five distinct modes:
- `SHORT`: Visual-first bracket references (e.g., `[Iraqi Customs Law 2026, Article 12]`, `[CBI Directive No. 8, Section B]`).
- `LEGAL`: High-precision judicial citing incorporating publishing boards, dates, and chapters.
- `TECHNICAL`: Attaches SHA-hash representations, document identifiers, chunk states, and licensing levels.
- `GOVERNMENT`: Ministry portal verification tags indicating official publication source validity.
- `STANDARD`: Title-based diagnostic referencing.

### C. Conflict Resolution Engine (`ConflictResolver.ts`)
Secures transactional integrity against overlapping regulatory circulars or conflicting border crossing mandates using a **4-tier resolution hierarchy**:
1. **Tier 4 (Explicit Overrides):** Fresh legal decrees or express statutory amendments declaring supersede priority over past codes rule.
2. **Tier 3 (Ministry Precedence):** Central Bank of Iraq (CBI) or Ministry of Finance (MoF) guidelines automatically dominate general Port or Border Transport Commission directives on trade tariff or compliance questions.
3. **Tier 2 (Trust Metric Weighting):** System matches publication metrics, validating highest authority registry indicators.
4. **Tier 1 (Temporal Currency):** Newer publication parameters win against historical policy drafts.
*Any contradiction failing automatic compromise is flagged and routed to the Expert Escalation review queue.*

### D. Confidence Scoring System (`ConfidenceScorer.ts`)
Utilizes a weighted formula evaluating five key data points:
- **Source Trust (25%):** Baseline reliability values from registry databases.
- **Evidence Freshness (20%):** Half-life exponential decay based on policy creation age.
- **Evidence Coverage (15%):** Density evaluation of retrieved materials relative to standard legal frameworks.
- **Consistency (20%):** Penalty indicators for unresolved contradictions.
- **Authority Weight (20%):** Valuation of supreme government bodies issuing terms.

Scores normalize between `0.00 to 1.00`, outputting corresponding security ratings:
- `0.90 – 1.00`: **Very High**
- `0.75 – 0.89`: **High**
- `0.60 – 0.74`: **Moderate**
- `0.40 – 0.59`: **Low**
- `0.00 – 0.39`: **Unreliable**

### E. Answer Synthesis Engine (`AnswerSynthesizer.ts`)
Converts mathematical logical deductions into human-readable guidelines. 
- Enforces strict groundings constraints: No facts may be generated out-of-bounds of verified evidence.
- Cleans system leaks: Purges underlying system file structures, private URL patterns, or container states from warnings.

### F. Audit & Traceability Framework (`ReasoningAuditTrail.ts`)
Writes transactions directly to the `/audit_logs/` Firestore collection. Logs record user telemetry, query context, accessed records, rejected elements, resolved conflicts, final scoring parameters, and microsecond timestamps. Fallback routines cache records in memory if connection parameters degrade.

---

## 3. Operational Security Alignment

- **Gated Access Limits:** All collection stages assert: `User Clearance Level >= Document Classification Level`. Lower clearance requests fail silently at source.
- **Audit Isolation:** Unauthorized access queries are audited as a Security Alert, preserving centralized borders surveillance.
