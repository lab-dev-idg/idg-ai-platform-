# REPUBLIC OF IRAQ DIGITAL GATEWAYS (IDG)
## Phase 13-F: Adaptive Learning & Feedback Intelligence Pipeline
### Core Intelligence Systems & Optimization Strategy Document

This document records the design patterns, adaptive metrics, mathematically-grounded optimization algorithms, learning loop cycles, and security governance frameworks of the adaptive intelligence systems servicing the National Knowledge Brain.

---

## 1. Architectural Blueprint & Data Flow

The **Adaptive Learning & Feedback Intelligence Module (Phase 13-F)** transitions the Iraq Digital Gateway (IDG) from a deterministic context-querying platform to a continuously improving, self-calibrating intelligence infrastructure. It acts as a closed-loop feedback engine, capturing operational results, user evaluations, citation confirmations, and transaction outcomes to refine our prompt templates, query search models, and confidence estimation rates.

```
       +--------------------------------------------------------+
       |                     USER QUERY RUN                     |
       +--------------------------------------------------------+
                                   |
                                   v
       +--------------------------------------------------------+
       |               STRATEGY RECOMMENDATION                  |
       |  - RetrievalOptimizer maps optimal strategy (Hybrid)   |
       |  - PromptOptimizer adjusts context template layouts   |
       +--------------------------------------------------------+
                                   |
                                   v
       +--------------------------------------------------------+
       |             BRAIN LOGICAL REASONING CORE               |
       |  - Gathers clearance-gated law & registry details      |
       |  - Computes adaptive calibration confidence score      |
       +--------------------------------------------------------+
                                   |
                                   v
       +--------------------------------------------------------+
       |               USER INTERACTION FEEDBACK                |
       |  - Casts thumbs up / down, rating scores,              |
       |    and citation approvals                              |
       +--------------------------------------------------------+
                                   |
                                   v
       +--------------------------------------------------------+
       |               ADAPTIVE REINFORCEMENT LOOP              |
       |  - FeedbackEngine normalizes feedback records           |
       |  - Updates personalized UserLearningProfile weights    |
       |  - Commits high-satisfaction responses to Memory       |
       |  - Recalculates retrieval & prompt success scores      |
       +--------------------------------------------------------+
                                   |
                                   v
       +--------------------------------------------------------+
       |                IMMUTABLE AUDIT LOGGING                 |
       |  - LearningAudit logs adjustments directly to cloud    |
       +--------------------------------------------------------+
```

---

## 2. Comprehensive Module Breakdowns

### A. Feedback Collection Engine (`FeedbackEngine.ts`)
The central transaction supervisor of the adaptive workflow. When feedback is registered, it routes indices synchronously to appropriate learning targets and saves the telemetry trace as a normalized log:
- **Multichannel Collectors:** Parses thumbs up/down, user ratings (1 to 5), workflow fulfillment, citation endorsements, and tool success logs.
- **Transactional Synchronization:** Translates positive actions directly into high-reputation memory commits while using negative votes to optimize model selection.

### B. User Learning Profile Engine (`LearningProfile.ts`)
Creates a localized, continuous interaction vector for port and border operators:
```typescript
export interface UserLearningProfile {
  userId: string;
  preferredLanguage: 'ku' | 'ar' | 'en';
  domainWeights: Record<KnowledgeDomain, number>;
  commonIntents: Record<string, number>;
  successfulWorkflows: string[];
  frequentlyApprovedCitations: Record<string, number>;
  lastActive: string;
}
```
- **Language Alignment:** Persists language choices across translation systems (Kurdish, Arabic, English).
- **Domain Affinity:** Dynamically weights domain affinities (e.g., CUSTOMS, TRADE, LOGISTICS, COMPLIANCE) based on query history, enabling customized search focus.

### C. Search Retrieval Optimizer (`RetrievalOptimizer.ts`)
Addresses retrieval quality disparities across diverse query types:
- **Success Recalculation Formula:**
  $$\text{SuccessScore} = (W_{\text{vote}} \times R_{\text{vote}}) + (W_{\text{rating}} \times R_{\text{rating}}) + (W_{\text{relevance}} \times S_{\text{relevance}})$$
  - $R_{\text{vote}}$: Ratio of positive thumbs-up evaluations (Weight: 40%).
  - $R_{\text{rating}}$: Average star-rating normalized to 1.0 (Weight: 40%).
  - $S_{\text{relevance}}$: Average vector distance match metric (Weight: 20%).
- **Automated Recommender:** Automatically shifts between `SEMANTIC` search (ideal for general policy questions), `KEYWORD` index matching (ideal for specific legal serial codes), or `HYBRID` retrieval (ideal for detailed customs laws).

### D. Prompt Template Optimizer (`PromptOptimizer.ts`)
Refines model response formatting to minimize hallucination risks:
- **Layout Choices:** Switches between `PRECISE_LEGAL` (enforces strict statutory referencing), `CONCISE_DIRECT` (optimized for fast border inspections), and `DETAILED_EXPLANATORY` (ideal for complex trade audits).
- **Error Calibration:** Calculates confidence accuracy by tracking the absolute variance between calibrated system confidence and subsequent user satisfaction rates.

### E. Confidence Calibration Engine (`ConfidenceCalibration.ts`)
Replaces previous static confidence estimators with an adaptive, four-tiered formula:
$$\text{CalibratedConfidence} = 0.25 \times \text{HistoricalAccuracy} + 0.25 \times \text{FeedbackScore} + 0.25 \times \text{EvidenceQuality} + 0.25 \times \text{ReasoningConsistency}$$
- **Historical Accuracy (25%):** System execution index average across prompt and search histories.
- **Feedback Rating (25%):** Endorsement metrics based on active thumbs up/down logs.
- **Evidence Quality (25%):** Average trust ratings of matched regulatory sources.
- **Reasoning Consistency (25%):** Evaluation of policy conflicts resolved during processing.

### F. Learning Memory System (`LearningMemory.ts`)
Ensures structural preservation of high-value operational findings:
- **Decentralized Verification Cache:** Stores approved answers, successfully traversed workflow decisions, and validated citation maps.
- **Match Mechanism:** Executes precise keyword matching over historical queries to retrieve successful solutions directly, minimizing the need for redundant processing.

### G. Immutable Audit Log (`LearningAudit.ts`)
In alignment with Iraqi governance standards, all configuration shifts, ranking modifications, parameter tunings, and memory commits log directly to Firestore's `/learning_audits/` collection with microsecond resolution, securing full transparency.

---

## 3. Sovereign Governance & Security Controls

1. **Strict Content Isolation:** Learning profile affinities never bypass user clearance restrictions. Document classification guidelines (`SECRET` or `CONFIDENTIAL`) are validated prior to RAG execution or memory match, preventing privilege escalation.
2. **Deterministic Bias Prevention:** Standard learning weights operate within strict limits (e.g., $0.00$ to $1.00$). Reinforcement increments are restricted to small step sizes (e.g., $+0.1$), preventing single-event manipulation of the system.
3. **Escalation Path:** If confidence falls below $0.40$ (Unreliable), the optimization loop initiates a system audit and routes the inquiry directly to the Border Management Commission's human expert queue.
