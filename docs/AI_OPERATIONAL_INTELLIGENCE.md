# Iraq Digital Gateway: AI Operational Intelligence Layer

This document describes the design, operational telemetry, and intelligent system flows integrated within Iraq Digital Gateway (v2.6.0).

---

## 1. Operational Architecture Notes

The IDG AI Operational Intelligence Layer links client-session states with backend LLM context. 

```
[Browser Client Route] ──(Dynamic Context)──> [Express /api/chat/stream]
                                                          │
                                                (Pipeline Orchestration)
                                                          │
                                               [Enriched System Prompt]
                                                          │
                                                [Google Gemini Pro/Flash]
```

### Key Integrations
1. **Dynamic Client Sensing**: The client detects the active pathname (e.g., `/customs`), language selection, and status layers, composing a structured JSON `context` block automatically on each event trigger.
2. **Context Reflector**: The context object is forwarded during the chat stream stream payload, allowing the orchestrator to automatically tailor system prompts without changing existing terminal components.
3. **Structured Formatter**: Responses are compiled into strict JSON matches:
   ```json
   {
     "action": "DISPLAY_MESSAGE" | "EXECUTE_TOOL" | "REQUIRE_INPUT",
     "payload": { "text": "..." },
     "confidence": 0.95,
     "metadata": { ... },
     "citations": []
   }
   ```

---

## 2. AI Workflow Notes

When users move between pages, the interface automatically loads contextual co-pilot triggers:

- **Unified Dashboard**: Displays generic global trade logistics suggestions (container costing, cargo rules, kyc guidelines).
- **Customs & Tariff Workspace**: Swaps suggestions to focus on the 2026 customs law (HS code lookup, CIF valuation multipliers, sovereign compliance reviews).

The client processes structured streaming payloads dynamically, providing falling-back guarantees for unmatched models to maintain robust performance.

---

## 3. Customs Intelligence Notes

The platform implements simulated, high-density, secure enterprise-level telemetry for customs workflows and audit tracking.

### Workflow States
- **IDG-DECL-2026-0041**: Status `APPROVED` (Automated SHA-256 certificate pushed).
- **IDG-DECL-2026-0042**: Status `UNDER_REVIEW` (Auditor assigned to evaluate HS classifications).
- **IDG-DECL-2026-0044**: Status `ESCALATED` (Sovereign alert logged).

### Extensible Event Schema
Customs events and audit flags are recorded using a structured format:
```typescript
interface OperationalEvent {
  id: string;
  timestamp: string;
  type: 'SHIPMENT' | 'CUSTOMS' | 'AI_NOTICE' | 'AUDIT';
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  message: string;
  hash?: string;
}
```
Each transaction is marked with a symbolic SHA-256 audit tag ensuring cryptographically traceable governance matching the 2026 secure telecom standards.

---

## 4. Production Hardening & Code Splitting

- **React.lazy + Suspense Integration**: Pages are dynamic chunks ensuring the core dashboard bundles remain under 120KB.
- **RTL Adaptive Layouts**: Standardized RTL direction maps safely to our bilingual KRD/ARB options.
- **Performance**: Strict render containment in state stores prevents infinite loop loops on dynamic streams.
