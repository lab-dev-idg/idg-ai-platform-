# Security Specifications & Rules TDD

This specification defines the strict security postures and data invariants enforced at the database level for the "Gateway AI" logistics app.

## 1. Data Invariants

- **Identity Sync**: A user document under `/users/{userId}` can only be created, read, or written by the authenticated user whose `request.auth.uid` matches the document ID `{userId}`.
- **Relational Integrity**: A shipment document under `/users/{userId}/shipments/{shipmentId}` must have a `userId` attribute that matches the authenticated user's ID (`request.auth.uid`) and the parent `{userId}` path parameter.
- **Immutability Rules**:
  - `createdAt` on the `User` entity is immutable after creation.
  - `userId` on the `Shipment` entity is immutable after creation.
- **Temporal Validity**:
  - `createdAt` must match `request.time` exactly upon creation.
  - `updatedAt` must match `request.time` exactly during updates.
- **Boundary Validation**:
  - ID strings must conform to alphanumeric characters and dashes (`^[a-zA-Z0-9_\-]+$`) and must not exceed 128 characters.
  - Required fields must be fully populated. No "Shadow Fields" or "Ghost Fields" are allowed (enforced via key size checks).

---

## 2. The "Dirty Dozen" Attacker Payloads (Must Be Rejected)

### Attacker Payload 1: Identity Spoofing (User document path mismatch)
- **Path**: `/users/legit-user-id`
- **Actor UID**: `attacker-user-id`
- **Data**: `{"uid": "attacker-user-id", "email": "attacker@example.com", "createdAt": "request.time"}`
- **Reason**: Writing to a user profile matching a different UID must be rejected.

### Attacker Payload 2: Unauthorized Profile Reading (Breach of Privacy)
- **Path**: `/users/victim-user-id`
- **Actor UID**: `attacker-user-id`
- **Operation**: `get`
- **Reason**: Reading another user's profile must be blocked.

### Attacker Payload 3: Mutating Immutable Timeline (`createdAt`)
- **Path**: `/users/user-123`
- **Actor UID**: `user-123`
- **Existing**: `{"uid": "user-123", "email": "user@example.com", "createdAt": timestamp("2026-05-28T00:00:00Z")}`
- **Incoming**: `{"uid": "user-123", "email": "user@example.com", "createdAt": timestamp("2026-05-29T11:00:00Z")}` (changed)
- **Reason**: Modifying `createdAt` must fail.

### Attacker Payload 4: Invalid Domain Schema injecting Ghost Fields
- **Path**: `/users/user-123`
- **Actor UID**: `user-123`
- **Incoming**: `{"uid": "user-123", "email": "user@example.com", "createdAt": "request.time", "isVerified": true}` (unauthorized attribute injection)
- **Reason**: Injection of arbitrary keys violates schema strict size constraints.

### Attacker Payload 5: Resource Poisoning via Document ID Insertion
- **Path**: `/users/super_long_junk_ID_poisoning_payload_containing_banned_unicode_chars_!!!!!!`
- **Actor UID**: `super_long_junk_ID_poisoning_payload_containing_banned_unicode_chars_!!!!!!`
- **Reason**: Must fail `isValidId()` pattern and size limits.

### Attacker Payload 6: Anonymous Access Excursion (No Auth)
- **Path**: `/users/user-123`
- **Actor UID**: Unauthenticated
- **Operation**: `create`
- **Reason**: Full operational ban for all anonymous (unauthenticated) traffic.

### Attacker Payload 7: Cross-Tenant Shipment Access Model
- **Path**: `/users/victim-user-id/shipments/LX123456789`
- **Actor UID**: `attacker-user-id`
- **Operation**: `create`
- **Data**: `{"trackingNumber": "LX123456789", "status": "In Transit", "userId": "attacker-user-id", "updatedAt": "request.time"}`
- **Reason**: Writing subcollections under other user paths is prohibited.

### Attacker Payload 8: Relational Spoofing (Owning a shipment in a tenant without owning the userId)
- **Path**: `/users/attacker-user-id/shipments/LX123456789`
- **Actor UID**: `attacker-user-id`
- **Data**: `{"trackingNumber": "LX123456789", "status": "In Transit", "userId": "victim-user-id", "updatedAt": "request.time"}`
- **Reason**: Sibling shipment owner UID inside the JSON payload must match the authenticating UID.

### Attacker Payload 9: Theft of Transit History (Unauthorized read)
- **Path**: `/users/victim-user-id/shipments/LX123456789`
- **Actor UID**: `attacker-user-id`
- **Operation**: `get`
- **Reason**: Blocked access to other people's shipments.

### Attacker Payload 10: State Bypass (Omitting tracked fields)
- **Path**: `/users/user-123/shipments/LX123456789`
- **Actor UID**: `user-123`
- **Data**: `{"trackingNumber": "LX123456789", "status": "In Transit"}` (missing `userId` and `updatedAt`)
- **Reason**: Schema rules mandate mandatory keys.

### Attacker Payload 11: Owner Overwriting (Bypassing owner reference)
- **Path**: `/users/user-123/shipments/LX123456789`
- **Actor UID**: `user-123`
- **Existing**: `{"trackingNumber": "LX123456789", "status": "In Transit", "userId": "user-123", "updatedAt": timestamp("2026-05-28T00:00:00Z")}`
- **Incoming**: `{"trackingNumber": "LX123456789", "status": "Delivered", "userId": "different-user-456", "updatedAt": "request.time"}` (hijack attempt)
- **Reason**: Modifying parent `userId` must fail.

### Attacker Payload 12: Broad Collection Scraping (List request mapping)
- **Path**: `/users/victim-user-id/shipments`
- **Actor UID**: `attacker-user-id`
- **Operation**: `list`
- **Reason**: Query rules must enforce owner conditions directly matching the query to the authenticated session context.
