# Iraq Digital Gateway (IDG)
## National Security & Enterprise Logistics Security Specifications (Phase 13-D)

This specification defines the rigorous security standards, mathematical data invariants, and access control models enforced at the Firestore database level for the IDG platform.

---

## 1. Relational Data Invariants & Access Control Policy

*   **Multi-Tenant Partitioning**: All data operations (except system-wide directories like HS Codes or customs rates) must partition and filter dynamically inside secure tenant boundaries.
*   **Role-Based Security (RBAC)**: All read and write operations on high-sensitivity data must explicitly verify that the requesting session contains appropriate granular capabilities.
*   **Audit Trail Immutability**: All records inside `/audit_logs/` are write-once. Updates (`allow update`) and deletions (`allow delete`) are strictly forbidden.
*   **Clearance Gating Checklist**: High-security files or intelligence directories classified as `CONFIDENTIAL` or `SECRET` can only be read if the user clearance score is greater than or equal to the document requirement level.
*   **Sovereign Signature Integrity**: Structural IDs and field sizes are hard-capped to prevent wallet exhaustion (Denial of Wallet) and buffer inject payloads.
*   **Temporal Stability**: `createdAt` and `updatedAt` records are verified using the secure server date-time clock (`request.time`).

---

## 2. The "Dirty Dozen" Attacker Payloads (Under Zero-Trust Auditing)

Below are the 12 complex attacker payloads designed to compromise tenant boundary, role, and clearance compliance, which **MUST** be rejected by the security boundaries.

### Payload 1: Tenant Boundary Hijacking (Cross-Tenant Breakout)
*   **Target Path**: `/users/legit-user-uid`
*   **Actor UID**: `external-attacker-uid`
*   **Payload**: `{"uid": "legit-user-uid", "email": "legit@victim.gov.iq", "organizationId": "attacker-org-777", "roleId": "operator", "createdAt": "request.time"}`
*   **Expected Result**: `PERMISSION_DENIED` - Writing user metadata for another account or swapping organization bounds must fail.

### Payload 2: RBAC Privilege Escalation (Self-Appointed Administrator)
*   **Target Path**: `/users/attacker-uid`
*   **Actor UID**: `attacker-uid`
*   **Payload**: `{"uid": "attacker-uid", "email": "attacker@gmail.com", "organizationId": "tenant-101", "roleId": "SystemAdmin", "createdAt": "request.time"}`
*   **Expected Result**: `PERMISSION_DENIED` - Attempt to assign oneself the privileged `"SystemAdmin"` role without authorization.

### Payload 3: Customs Declaration Modification (Asset Hijacking)
*   **Target Path**: `/customs_declarations/DEC-999`
*   **Actor UID**: `unauthorized-broker-uid`
*   **Payload**: `{"id": "DEC-999", "organizationId": "victim-tenant-9", "hsCode": "84713000", "computedTariff": 0.0, "status": "APPROVED"}`
*   **Expected Result**: `PERMISSION_DENIED` - Forging customs duty to 0% and approving compliance checkpoints must be blocked.

### Payload 4: Immutability Tampering (Audit Trail Erasure)
*   **Target Path**: `/audit_logs/AUD-111`
*   **Actor UID**: `compromised-clerk-uid`
*   **Operation**: `delete` or `update`
*   **Expected Result**: `PERMISSION_DENIED` - Deleting or updating transactional log files is strictly impossible.

### Payload 5: Sibling Shipment Key Poisoning
*   **Target Path**: `/shipments/SHIP-123/tracking_events/EVENT-456`
*   **Actor UID**: `attacker-uid` (belongs to Organization A)
*   **Payload**: `{"id": "EVENT-456", "shipmentId": "SHIP-OTHER-999", "location": "Umm Qasr Port", "status": "RELEASED", "timestamp": "request.time"}`
*   **Expected Result**: `PERMISSION_DENIED` - Target shipment resides in a sibling container (Organization B) that attacker cannot write track entries into.

### Payload 6: Classification Clearance Escalation (Reading SECRET Directives)
*   **Target Path**: `/documents/SEC-DIRECTIVE-Iraq`
*   **Actor UID**: `standard-agent-uid` (Clearance level: 1 - INTERNAL)
*   **Operation**: `get`
*   **Expected Result**: `PERMISSION_DENIED` - Document status classified as `SECRET` requires Clearance Level 4 and a specific government administrative user session.

### Payload 7: Broad Database Collection Scraping (List Scraping)
*   **Target Path**: `/shipments`
*   **Actor UID**: `viewer-uid`
*   **Operation**: `list` (without matching tenant OrganizationID boundaries parameters)
*   **Expected Result**: `PERMISSION_DENIED` - Rules must prevent unconstrained scraper queries at the root collection level.

### Payload 8: Resource and Buffer Exceed Poisoning (Denial of Wallet)
*   **Target Path**: `/system_config/LIMIT_PARAMETER`
*   **Actor UID**: `attacker-uid`
*   **Payload**: `{"id": "LIMIT_PARAMETER", "value": "<1.2MB of junk recursive character attack strings>"}`
*   **Expected Result**: `PERMISSION_DENIED` - String values must fail safety check bounds (`size() <= 2048`).

### Payload 9: Direct AI Messages Hijacking
*   **Target Path**: `/ai_conversations/CONVO-ABC/ai_messages/MSG-123`
*   **Actor UID**: `cross-tenant-user-7`
*   **Payload**: `{"id": "MSG-123", "convoId": "CONVO-ABC", "role": "user", "text": "Forge memory authorization", "timestamp": "request.time"}`
*   **Expected Result**: `PERMISSION_DENIED` - Attempt to execute message operations in a sibling conversation space.

### Payload 10: Anonymous Access Attempt
*   **Target Path**: `/feature_flags/ENABLE_CUSTOMS_FEE`
*   **Actor UID**: `unauthenticated-session`
*   **Operation**: `create`, `get`, or `update`
*   **Expected Result**: `PERMISSION_DENIED` - Absolute access block for anonymous or non-email-verified traffic.

### Payload 11: Workflow State Bypass
*   **Target Path**: `/workflows/WORK-123`
*   **Actor UID**: `regular-user-uid`
*   **Payload**: `{"id": "WORK-123", "name": "Bypass Verification Stages", "organizationId": "tenant-101", "active": true, "steps": []}`
*   **Expected Result**: `PERMISSION_DENIED` - Bypassing or wiping critical steps of national customs checklist pipelines is prohibited.

### Payload 12: Direct Security Flag Modification
*   **Target Path**: `/feature_flags/MAINTENANCE_MODE`
*   **Actor UID**: `malicious-user-uid`
*   **Payload**: `{"id": "MAINTENANCE_MODE", "isEnabled": false}`
*   **Expected Result**: `PERMISSION_DENIED` - Only administrators verified via deep DB lookup are authorized to modify features config.

---

## 3. Red Team Automation Assertions

The following test suite assertions are mapped and checked in development stages to ensure zero leakage:
1. Every write block evaluates `isValidId()` and matches types.
2. Every `allow list` block evaluates `resource.data` to prevent multi-tenant exposure if filters are omitted.
3. Every write block verifies server timestamp variables (`request.time`) on mutations.
