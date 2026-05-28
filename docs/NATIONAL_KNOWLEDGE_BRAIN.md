# Iraq Digital Gateway (IDG) — National Knowledge Brain

Establishing the standard, secure, and sovereign blueprint for national law ingestion, automated categorization, and context retrieval in the Republic of Iraq.

---

## 1. System Architecture Map

The National Knowledge Brain serves as the sovereign hub for digesting, securing, organizing, and retrieving core regulatory frameworks, customs laws, border crossing work manuals, and bilateral agreements. Excellent compartmentalization separates public citizens, verified private brokers, and executive ministry planners.

```
       [Raw Ingestion Source Flow]
  (e.g., Gazette Laws, Checkpoint Manuals)
                     │
                     ▼
       ┌───────────────────────────┐
       │   DocumentIngester Layer  │  ◄── (Normalize Kurdish & Arabic Glyphs)
       └─────────────┬─────────────┘
                     │
                     ▼
       ┌───────────────────────────┐
       │   KnowledgeChunkEngine    │  ◄── (Logical Section & Overlap Sliding Windows)
       └─────────────┬─────────────┘
                     │
                     ▼
       ┌───────────────────────────┐
       │     KnowledgeRegistry     │  ◄── (Storage-Agnostic Assets Index / Memory Cache)
       └─────────────┬─────────────┘
                     │
                     ▼
       ┌───────────────────────────┐
       │ KnowledgeRetrievalService │  ◄── (Dynamic Metadata Filtering / Keyword Index)
       └─────────────▲─────────────┘
                     │
        [Clearance Evaluation Gate]
                     │
   (Can userClearance >= docClassification?)
                     │
                     ├───────────────────[DENIED] ──► Write Security Audit Violation Alert Log
                     │
                     └───[APPROVED] ─────► Retrieve Structured Context Citations
```

### Retrieval & Ingest Architecture Layers

1. **Source Normalization Core (`DocumentIngester`)**: Handles text standardization, carriage return resolutions, and specialized script-sensitive regularizations (Arabic and Kurdish Unicode sanitization).
2. **Chunk Lineage Engine (`KnowledgeChunkEngine`)**: Splits large text streams, creates child chunks linked back to primary source document parent IDs, and keeps a traceable section hierarchy list (e.g., `["Iraqi Customs Law 2026", "Article 12"]`).
3. **Storage-Agnostic Registry (`KnowledgeRegistry`)**: Registers primary documents, trusted authorities (sources), and domains. Operates entirely dynamic and independent of storage adapters (highly extensible).
4. **Secured Retrieval Coordinator (`KnowledgeRetrievalService`)**: Evaluates query density against chunks, processes multi-attribute filter arrays, validates clearance gates, and logs auditable requests.

---

## 2. Ingestion & Preprocessing Normalization Flow

Before chunking, text from official decrees undergoes script-specific glyptic normalizations. This prevents spelling-induced RAG misses under Arabic and Sorani/Kurmanji phonetic variations:

* **Arabic Glide Correction**: Strips short vowels/harakat, standardizes variations of Hamza Carriers (`أ`, `إ`, `آ` ➔ `ا`), and replaces soft-matches like Taa Marbuta (`ة` ➔ `ه`).
* **Kurdish Unicode Standards**: Formats standard Kurdish Haa (`ھ` ➔ `ه`), unified Farsi/Kurdish Yea (`ى` ➔ `ی`), and resolves duplicate white spaces/indentations.

---

## 3. Advanced Ingestion Chunking Blueprint

Our `KnowledgeChunkEngine` implements two specialized chunk generation modes:

### A. Logical Section Splitting (Default)
Ideal for structured legal codes (e.g., the Customs Tariff Book). It scans text for logical delimiters like `Article` or `Directive` and produces separate chunks for each subsection.
* **Lineage Tracker**: Allocates unique sequence numbers. Sets `parentDocumentId` tracking.
* **Hierarchical Metadata**: Inherits title and active section indexes.

### B. Fixed Overlapping Sentence Sliding Window (Fallback)
Used for unstructured prose reports. Splits the input text based on grammatical punctuation (`.`, `!`, `?`), grouping sentences until reaching a character soft ceiling (e.g., 350 chars), then slides forward while retaining the preceding sentence as a context bridge.

---

## 4. Metadata Model Specification

A rigorous JSON schema is maintained for all ingested knowledge documents:

```typescript
export interface KnowledgeMetadata {
  id: string;               // Unique primary tracking UUID
  title: string;            // Standard human-readable law title
  source: string;           // Legal authority or issuing document name (Gazette, CBI)
  ministry?: string;        // Sovereign ministry owner (e.g., Ministry of Finance)
  issuingAuthority?: string;// Approving Board (e.g., CBI Compliance Council)
  publicationDate?: string; // Time of state gazette publishing
  revisionDate?: string;    // Latest revision time stamp
  domain: KnowledgeDomain;  // (CUSTOMS | LOGISTICS | TRADE | etc.)
  classification: KnowledgeClassification; // Clearance ceiling
  language: 'ku' | 'ar' | 'en' | 'multilingual';
  tags: string[];           // Extracted tags for rapid indexing
  documentVersion: string;  // Active document schema version
  trustScore: number;       // Reputational weight multiplier (0.00 - 1.00)
}
```

---

## 5. Security & Governance Matrix

Access is strictly governed by comparing the user type's security clearance level with the document's classification tier. Access is permitted strictly when:

$$\text{Clearance Level (User)} \geq \text{Classification Required (Document)}$$

The digital gateway maps clearances using the following secure boundaries:

| Classification | Numeric Level | Minimum Authorized User Roles | Target Information Type |
| :--- | :---: | :--- | :--- |
| **PUBLIC** | `0` | Citizen, Journalist, Investor, etc. | General cargo rules, standard import tariff percentages. |
| **INTERNAL** | `1` | Business Courier, Developer, Operator | Turnaround schedules, customs manifest guidelines. |
| **RESTRICTED** | `2` | Employee, Telecom, Fintech | Border crossing terminal checkpoints, telecom routes. |
| **CONFIDENTIAL**| `3` | Government Planners, Bank Controllers | Letter-of-credit matches, escrow locks, multisig ID protocols. |
| **SECRET** | `4` | High Sovereign Administrator | High-tier ministerial decision bypasses. |

### Robust Auditing Logs
All retrieval tasks, whether approved or blocked, append diagnostic indicators in `RetrievalAuditLog` (retaining trace query strings, user clearance, and access outcome records) to guarantee zero sensitive data leakage and support automated compliance audits.

---

## 6. Vector Database & Emerging AI Readiness

To scale the National Knowledge Brain toward high-density dense vector storage, interfaces and connectors are designed in `KnowledgeRetrievalService` compatibility mode:

* **Dense Float Embeddings**: Standby contracts support feeding normalized chunks through model embedding pipelines (e.g., `text-embedding-004`) to generate 768-dimension vectors.
* **Vertex AI Integration**: Connectors are ready to route query representations straight to Google Cloud's Vertex AI Vector Search Endpoint, performing high-speed cosine similarity matching under authorization parameters.
* **Hybrid Re-Ranking**: Stubs are aligned to support cross-encoder neural models that score semantic proximity on the top 10 returned candidate nodes.
