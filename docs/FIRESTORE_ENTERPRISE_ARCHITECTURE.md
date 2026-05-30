# Iraq Digital Gateway (IDG)
## Enterprise Firestore Multi-Tenant Architecture & Migration Blueprint

This document details the production-ready Firestore model, database indices, and data transition plans designed by the Senior Firebase Architect.

---

## A. Firestore Collection Tree & Hierarchy

To support large-scale enterprise performance, the database combines flat, highly indexable **root-level collections partitioned by `organizationId`** with **nested subcollections** where a child document's lifecycle is strictly bound to its parent (e.g. tracking events under shipments, or individual messages inside AI conversation sessions).

```
/ (Database Root)
├── organizations (Collection)
│   └── {organizationId} (Document)
│
├── users (Collection)
│   └── {userId} (Document) [Has keys: organizationId, roleId, email, displayName]
│
├── roles (Collection) [RBAC Catalog]
│   └── {roleId} (Document) [Permissions matrix]
│
├── permissions (Collection) [Static listing]
│   └── {permissionId} (Document)
│
├── audit_logs (Collection) [Immutable ledger]
│   └── {logId} (Document) [Details of updates]
│
├── notifications (Collection) [Recipient specific]
│   └── {notificationId} (Document)
│
├── workflows (Collection)
│   └── {workflowId} (Document)
│       └── tasks (Sub-collection)
│           └── {taskId} (Document)
│
├── tickets (Collection)
│   └── {ticketId} (Document)
│
├── shipments (Collection)
│   └── {shipmentId} (Document)
│       └── tracking_events (Sub-collection)
│           └── {eventId} (Document)
│
├── carriers (Collection)
│   └── {carrierId} (Document)
│
├── warehouses (Collection)
│   └── {warehouseId} (Document)
│
├── routes (Collection)
│   └── {routeId} (Document)
│
├── customs_declarations (Collection)
│   └── {declarationId} (Document)
│
├── customs_rates (Collection)
│   └── {rateId} (Document)
│
├── hs_codes (Collection)
│   └── {codeId} (Document)
│
├── customs_documents (Collection)
│   └── {documentId} (Document)
│
├── companies (Collection)
│   └── {companyId} (Document)
│
├── partners (Collection)
│   └── {partnerId} (Document)
│
├── vendors (Collection)
│   └── {vendorId} (Document)
│
├── customers (Collection)
│   └── {customerId} (Document)
│
├── government_agencies (Collection)
│   └── {agencyId} (Document)
│
├── government_services (Collection)
│   └── {serviceId} (Document)
│
├── ai_agents (Collection)
│   └── {agentId} (Document)
│
├── ai_conversations (Collection)
│   └── {conversationId} (Document)
│       └── ai_messages (Sub-collection)
│           └── {messageId} (Document)
│
├── ai_memory (Collection)
│   └── {memoryId} (Document)
│
├── ai_embeddings (Collection)
│   └── {embeddingId} (Document) [High dimensional search map]
│
├── documents (Collection)
│   └── {documentId} (Document) [Internal / Secret classifications]
│       └── files (Sub-collection)
│           └── {fileId} (Document)
│
├── analytics (Collection)
│   └── {analyticsId} (Document)
│       └── metrics (Sub-collection)
│           └── {metricId} (Document)
│
├── system_config (Collection)
│   └── {configId} (Document)
│
└── feature_flags (Collection)
    └── {flagId} (Document)
```

---

## B. TypeScript Interfaces

The full TypeScript interfaces are located at `/src/types/firestore.ts` and globally exported through `/src/types/index.ts`. Key data entities are built supporting:
1. Multi-tendency association (`organizationId`) matching tenant bounds.
2. Rigid date strings mapping.
3. Explicit typing to prevent loose types parsing.

---

## C. Security Rules & Gating

Rules are fully drafted, verified, and deployed at `/firestore.rules`. Defensive layers include:
- Strict authorization checks verifying email status (`request.auth.token.email_verified == true`).
- Input validations cap-checking sizes for each field.
- Immutability enforcements preventing update/delete operations on `/audit_logs/`.
- Deep RBAC lookup policies fetching user context configurations online using `get()`.

---

## D. Recommended Database Indexes

Firestore automatically creates single-field indexes, but multi-tenant filters require **Compound Indexes** to guarantee sub-millisecond retrieval speeds. Configure the following composite indexes inside the Firebase Console or `firestore.indexes.json`:

### 1. Shipment Tracking Complex Queries
*   **Collection**: `shipments`
*   **Fields**:
    - `organizationId` (Ascending)
    - `userId` (Ascending)
    - `status` (Ascending)

### 2. Immutable Auditing Tracking
*   **Collection**: `audit_logs`
*   **Fields**:
    - `organizationId` (Ascending)
    - `timestamp` (Descending)

### 3. Chronological Conversation Messages
*   **Collection Group**: `ai_messages`
*   **Fields**:
    - `convoId` (Ascending)
    - `timestamp` (Ascending)

### 4. Active Customs Declarations Processing
*   **Collection**: `customs_declarations`
*   **Fields**:
    - `organizationId` (Ascending)
    - `status` (Ascending)

### 5. Document Clearance Management
*   **Collection**: `documents`
*   **Fields**:
    - `classification` (Ascending)
    - `organizationId` (Ascending)

---

## E. Migration Plan (Legacy to Multi-Tenant)

### The Staged Pipeline Diagram:
```
[ Legacy Data Source ] ──► [ Schema Translation Worker ] ──► [ Enterprise Database Target ]
- users/{userId}           - Inject default Organization ID  - /users/{userId} (upgraded)
- shipments subcollection  - Flatten to root shipment collection - /shipments/{shipmentId}
```

### Transition Steps:

#### Step 1: Bootstrap Default Tenant Organizations
Prior to migration, provision baseline tenant containers inside `/organizations` to hold converted accounts:
- Organization ID: `org_national_gateway_cbi` (Central Port Authority)

#### Step 2: Migrate Core User Accounts
Map existing client profile records:
- **Source**: `/users/{userId}`
- **Evaluation**: Read each document, append default tenancy (`organizationId: "org_national_gateway_cbi"`) and assigned role (`roleId: "operator"` or `"broker"`), and overwrite back to `/users/{userId}`.

#### Step 3: Extract and Flatten Shipment Records
Evolve user subcollection shipments to root-level secure documents:
- **Source**: `/users/{userId}/shipments/{shipmentId}`
- **Destination**: `/shipments/{shipmentId}`
- **Translation Schema**:
  ```typescript
  const oldShipment = snapshot.val();
  const migratedShipment = {
    id: shipmentId,
    organizationId: "org_national_gateway_cbi", 
    trackingNumber: oldShipment.trackingNumber,
    status: oldShipment.status,
    userId: userId, // Keep parent relation
    estimatedDelivery: oldShipment.estimatedDelivery || "Pending Verification",
    createdAt: oldShipment.updatedAt || new Date().toISOString()
  };
  ```

#### Step 4: Validate Integrity and Purge Legacy Nodes
Perform full database verification audits to confirm matches. Once verified, execute a secure batch script to purge the legacy subcollections `/users/{userId}/shipments/*` to save storage costs and prevent double-billing on storage operations.
