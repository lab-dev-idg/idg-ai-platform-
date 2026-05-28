# Iraq Digital Gateway (IDG) — Semantic Retrieval Architecture

Welcome to the standard blueprint for national regulatory retrieval, secure AI vector embeddings processing, and sovereignty-isolated hybrid ranking in the Republic of Iraq.

---

## 1. System Topology Overview

This architecture integrates dense vector representations, hybrid scoring pipelines, and strict, multi-level clearance gateways to elevate the National Knowledge Brain into a trusted semantic oracle.

```
       [Raw PDF/Decree Document]
                   │
                   ▼ (Multilingual Text Sanitization)
       ┌───────────────────────────┐
       │   DocumentIngester Layer  │ ◄── (Normalizes Kurdish/Arabic Glyphs)
       └─────────────┬─────────────┘
                     │
                     ▼ (Clean Text Blocks)
       ┌───────────────────────────┐
       │   KnowledgeChunkEngine    │ ◄── (Splits into Logical Lines or Windows)
       └─────────────┬─────────────┘
                     ├─────────────────────────────────────────┐
                     ▼ (Text Segments)                         ▼ (Entity Mapping)
       ┌───────────────────────────┐             ┌───────────────────────────┐
       │     EmbeddingEngine       │             │     KnowledgeRegistry     │
       │  (Gemini Embedding-2 / API)             │  (Metadata / Provenance)  │
       └─────────────┬─────────────┘             └─────────────┬─────────────┘
                     │                                         │
                     ▼ (Float Vectors)                         ▼
       ┌───────────────────────────┐                           │
       │    InMemoryVectorStore    │ ◄─────────────────────────┘
       │  (Indexed payload values)  │
       └─────────────┬─────────────┘
                     │
      ───────────────────────────────────────────────────────────────
      Query/Retrieval Space (Security Gated Workflow)
                     │
                     ▼ (Client Search Term / Natural Language)
       ┌───────────────────────────┐
       │   Embedding Transformation│ ◄── (Convert Query into Float Tensor)
       └─────────────┬─────────────┘
                     │
                     ▼ (Cosine Similarity Matrix Calculation)
       ┌───────────────────────────┐
       │  SemanticRetrievalService │ ◄── [User Clearance Gating Validation]
       └─────────────┬─────────────┘      (ClearanceLevel >= DocClassification?)
                     │
                     ├────────────────────[DENIED] ──► Log Security Warning Audit
                     │
                     ▼ (APPROVED Candidate Set)
       ┌───────────────────────────┐
       │    HybridRankingEngine    │ ◄── (Integrates: Semantic + Keyword Density + 
       │                           │      Authority Weight + Freshness Recency)
       └─────────────┬─────────────┘
                     │
                     ▼ (Highest Priority Citing Indexes)
       [Ranked Context Node Citations List]
```

---

## 2. Ingestion & Embedding Lifecycle

For any legal gazette framework, the processing timeline strictly follows this linear flow:

1. **Ingestion & Cleansing (`DocumentIngester`)**: 
   - Eliminates layout spacing, tab-markers, and trailing breaks.
   - Executes script-specific glyptic normalizations (e.g., standardizing Arabic Hamza carries or Kurdish Keheh types) to ensure consistent token boundaries.
2. **Chunk Lineage Tracking (`KnowledgeChunkEngine`)**:
   - Divides documents into logical slices based on legal structures (e.g., `Article 12`).
   - Pairs chunk metadata with the parent document version, language tag, and base domain.
3. **Float Vector Generation (`EmbeddingEngine`)**:
   - Converts parsed text segments into dense float arrays (768 or 1536 dimensions) using Google's `gemini-embedding-2-preview` model.
   - Embeddings are computed with L2 normalization ($\|V\| = 1.0$) to guarantee fast, highly accurate mathematical proximity matching.
4. **Vector Memory Registration (`VectorStore`)**:
   - Maps unique chunk IDs, float arrays, and operational payloads (text, domain metadata, classification labels) inside scalable database indexes.

---

## 3. Secured Retrieval Workflow

When a broker or government planner prompts the AI Brain, the gateway evaluates their request through a unified security pipeline:

```
 User query ──► Transform to vector ──► Fetch similarity matches ──► Check Clearance Gate ──► Build Hybrid Rankings
```

### A. Semantic Parsing
- The user's query is transformed into a query embedding vector via the active `EmbeddingProvider` (Gemini model).
- The vector index is queried, extracting the top 50 closest semantic matches.

### B. Access Clearance Verification Gate
For each matching vector candidate, the system retrieves its payload classification rating and compares it with the user's active clearance level:

$$\text{User Security Clearance} \geq \text{Document Classification Level}$$

The system implements five mandatory clearance levels:

| Document Classification | Value | Authorized User Roles | Description |
| :--- | :---: | :--- | :--- |
| **PUBLIC** | `0` | Citizen, Broker, Journalist, Investor | Standard imports, HS code tariff schedules. |
| **INTERNAL** | `1` | Business Courier, Developer, Operator | Turnaround plans, logistics ledger rules. |
| **RESTRICTED** | `2` | Telecom Admin, Fintech Analyst | Point-of-entry terminal systems. |
| **CONFIDENTIAL** | `3` | Bank Controller, Government Controller | Letters of Credit, escrow triggers, identity signatures. |
| **SECRET** | `4` | High Ministry Administrator | Special decisions, national trade bypass protocols. |

*If the user's clearance rating is below the document classification level, access is denied instantly. The document identification is appended to `deniedAccessDocIds` within the search audit trail, and details are logged for administrative review without leaking the content.*

---

## 4. Multi-Signal Hybrid Ranking Model

The final ranking of authorized chunks is processed by the `HybridRankingEngine`, which evaluates candidate relevance across four key signals:

$$\text{Score} = w_s S_s + w_k S_k + w_a S_a + w_r S_r$$

Where:
* **$S_s$ (Semantic Match - Weight: $50\%$):** Cosine proximity between the query embedding and chunk payload vectors.
* **$S_k$ (Literal Density - Weight: $25\%$):** Structural keyword matching. Matches the exact frequency of key terms.
* **$S_a$ (Authority Weight - Weight: $15\%$):** Trust score derived from the source reputational rating of the issuing body (e.g., State Gazette = $0.99$, circulars = $0.90$).
* **$S_r$ (Freshness Recency - Weight: $10\%$):** Freshness index evaluated using logistic decay:
  $$S_r = \frac{1}{1 + e^{0.08(m - 6)}}$$
  Where $m$ is the age of the document in months relative to May 2026. This assigns high scores ($0.90 \to 1.00$) to recent regulations ($0 \to 6$ months old) and decays gently for older frameworks.

---

## 5. Governance and Compliance Controls

To maintain sovereignty and total traceability, the National Knowledge Brain enforces strict governance guidelines:

* **Comprehensive Session Auditing:**
  Every semantic match request generates an immutable audit record containing:
  - System trace identifiers (`auditId`)
  - Target query text and user identifier
  - Count of returned chunks vs. blocked access events
  - Detailed security clearances and timestamps
* **Extensible Storage Layer:**
  The `IVectorStore` abstract interface separates storage logic from operational models. This decouples the application from any vendor lock-in, enabling seamless future integrations with cloud-native engines like Google Cloud's Vertex AI Vector Search, pgvector, or standalone Pinecone.
* **Kurdish-Arabic Spell Tolerant Semantic Matching:**
  The ingestion layer pre-processes text to sanitize character variations (e.g., normalizing different forms of Hamza or Yaa character inputs). This ensures semantic retrieval works reliably across varying spellings and multilingual inputs.
