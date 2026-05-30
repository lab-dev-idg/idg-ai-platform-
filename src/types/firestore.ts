/**
 * Iraq Digital Gateway (IDG)
 * Enterprise Logistics & Customs Firestore Type Definitions
 * 
 * Comprehensive TypeScript schemas for the 35 required collection structures
 * to support multi-tenancy, Role-Based Access Control, audit trailing, customs clearance,
 * and advanced cognitive AI memory systems.
 */

// --- ROOT UTILITY ENUMS & SCHEMAS ---

export type ResourceStatus = 'ACTIVE' | 'SUSPENDED' | 'PENDING';
export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'CLOSED';
export type UserRole = 'Government' | 'Employee' | 'Bank' | 'Telecom' | 'Citizen' | 'SystemAdmin';
export type DocumentClassification = 'PUBLIC' | 'INTERNAL' | 'RESTRICTED' | 'CONFIDENTIAL' | 'SECRET';

// 1. ORGANIZATIONS
export interface Organization {
  id: string;                         // UUID / Document ID
  name: string;                       // Organization title
  status: ResourceStatus;             // Active state
  createdAt: string;                  // ISO 8601 creation string
}

// 2. USERS
export interface FirestoreUser {
  uid: string;                        // Match Authenticating UID
  email: string;                      // Email of the registration
  displayName?: string;               // Nickname
  organizationId: string;             // Root partition tenant reference
  roleId: string;                     // Assigned RBAC designation (admin, manager, broker, etc.)
  createdAt: string;                  // ISO string registration
}

// 3. ROLES (RBAC)
export interface Role {
  id: string;                         // Unique designation string, e.g., "broker"
  name: string;                       // Human description, e.g., "Customs Border Broker"
  organizationId: string;             // Owning organization context
  permissions: string[];              // List of active capability permissions
}

// 4. PERMISSIONS (RBAC Capabilities catalog)
export interface Permission {
  id: string;                         // e.g. "read:shipments", "customs:approve"
  description: string;                // Technical action capability definition
}

// 5. AUDIT LOGS (Immutable logs)
export interface AuditLog {
  id: string;                         // Audit UUID
  timestamp: string;                  // ISO time details
  userId: string;                     // Actor UID
  organizationId: string;             // Organization context
  action: string;                     // e.g., "CREATE_CUSTOMS_DECLARATION"
  details: string;                    // Detail diff or serial string description
}

// 6. NOTIFICATIONS
export interface Notification {
  id: string;                         // Alert target reference ID
  userId: string;                     // Target user UID
  organizationId: string;             // Organization context
  title: string;                      // Notice title
  body: string;                       // Full content description text
  isRead: boolean;                    // Notification status
  createdAt: string;                  // Alert creation timestamp
}

// 7. WORKFLOWS
export interface Workflow {
  id: string;                         // Workflow schema ID
  name: string;                       // Workflow description label
  organizationId: string;             // Organization identifier
  active: boolean;                    // Active toggle
  steps: string[];                    // Ordered array of workflow task stages
}

// 8. TASKS (Workflow Steps)
export interface Task {
  id: string;                         // Task ID
  workflowId: string;                 // Linked Workflow ID
  organizationId: string;             // Organization identifier
  assignedTo?: string;                // User UID mapping
  status: string;                     // Progress description label
  title: string;                      // Step title label
}

// 9. TICKETS (Escalations)
export interface Ticket {
  id: string;                         // Legal issue card ticket ID
  organizationId: string;             // Multi-tenant partition
  userId: string;                     // Citizen or clerk UID
  title: string;                      // Ticket summary
  status: TicketStatus;               // Resolution level status
  createdAt: string;                  // Notice timestamp
}

// 10. SHIPMENTS (LOMBENAX Core Cargo)
export interface Shipment {
  id: string;                         // Document shipment reference ID
  organizationId: string;             // Organization tenant scope
  trackingNumber: string;             // Shipment unique trade tag code
  status: string;                     // Current positional status state
  estimatedDelivery?: string;         // Projected arrival date
  carrierId?: string;                 // Linked carrier partner
  routeId?: string;                   // Path reference
  userId: string;                     // Responsible operator or manifest clerk
}

// 11. TRACKING_EVENTS
export interface TrackingEvent {
  id: string;                         // Temporal event sequential ID
  shipmentId: string;                 // Tracked cargo ID link
  location: string;                   // Gateway checkpoint code label (e.g. Ibrahim Khalil)
  status: string;                     // Transitional status label
  timestamp: string;                  // Point checking audit date-time
}

// 12. CARRIERS
export interface Carrier {
  id: string;                         // Authorized carrier code
  name: string;                       // Company registry label
  licenseNumber: string;              // Regional border customs certificate code
}

// 13. WAREHOUSES
export interface Warehouse {
  id: string;                         // Depot storage center ID
  name: string;                       // Storage terminal title
  capacityLimit: number;              // Licensed weight tons max threshold
  address?: string;                   // Geographic terminal location
}

// 14. ROUTES
export interface Route {
  id: string;                         // Path corridor identifier
  origin: string;                     // Origin cargo loading port description
  destination: string;                // Cleared cargo inland terminal description
  distanceKm?: number;                // Pathway length distance kilometers
}

// 15. CUSTOMS_DECLARATIONS
export interface CustomsDeclaration {
  id: string;                         // Customs Declaration file filing ID
  organizationId: string;             // Filing entity organizational scope
  shipmentId: string;                 // Cargo shipment track link identifier
  hsCode: string;                     // Declared item Harmonized Code
  computedTariff: number;             // Evaluated customs duty tariff liability USD
  status: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED'; // Border compliance status
}

// 16. CUSTOMS_RATES
export interface CustomsRate {
  id: string;                         // Customs Tariff identifier
  hsChapter: string;                  // First 2 or 4 digits chapter index mapping
  adValoremPercent: number;           // Standard tax levy percentage
}

// 17. HS_CODES
export interface HsCode {
  code: string;                       // Digit mapping index key string (e.g. "84713000")
  description: string;                // Trade tariff official system content description
}

// 18. CUSTOMS_DOCUMENTS (Required declaration paper works, e.g. Bill of Lading)
export interface CustomsDocument {
  id: string;                         // Security ID filing
  shipmentId: string;                 // Shipment attachment reference
  documentType: string;               // Cargo certificate label title
  fileURL: string;                    // Secure download endpoint URL location
}

// 19. COMPANIES
export interface Company {
  id: string;                         // Standard Registration index
  name: string;                       // Registered firm legal title
  taxNumber?: string;                 // Tax verification registration string
}

// 20. PARTNERS
export interface Partner {
  id: string;                         // Allied transit agency ID
  name: string;                       // Organization corporate name
  country: string;                    // Cross-border regional state name
}

// 21. VENDORS
export interface Vendor {
  id: string;                         // Vendor identification reference ID
  name: string;                       // Corporate identity name
  serviceType: string;                // Category of logistics services provided
}

// 22. CUSTOMERS
export interface Customer {
  id: string;                         // Customer UID
  name: string;                       // Citizen standard identity name
  phone?: string;                     // Registered contact verification info
}

// 23. GOVERNMENT_AGENCIES
export interface GovernmentAgency {
  id: string;                         // Cabinet code identification name (CBI, MoST, General Custom)
  name: string;                       // Complete directory formal name
  clearanceAuthorityLevel: number;    // Absolute ceiling clearances index mapping
}

// 24. GOVERNMENT_SERVICES
export interface GovernmentService {
  id: string;                         // Web portal API integration endpoint GUID
  name: string;                       // Integrated border service label
  endpoint: string;                   // Sovereign remote service endpoint URL location
}

// 25. AI_AGENTS
export interface AiAgent {
  id: string;                         // Active AI core capability ID
  name: string;                       // Core label identifier name
  modelAlias: string;                 // Host base network identifier (e.g. Gemini Pro, Flash)
}

// 26. AI_CONVERSATIONS
export interface AiConversation {
  id: string;                         // Transactional conversation track thread ID
  userId: string;                     // Interlocutor user account UID
  organizationId: string;             // Owning organization context partitions
  createdAt: string;                  // Conversation initiation timestamp
}

// 27. AI_MESSAGES
export interface AiMessage {
  id: string;                         // Message sequence timestamp key
  convoId: string;                    // parent thread index ID
  role: 'user' | 'model';             // Chat participant role
  text: string;                       // Input text description
  timestamp: string;                  // Exact dispatch timestamp
}

// 28. AI_MEMORY
export interface AiMemory {
  id: string;                         // Memory document tracking ID
  userId: string;                     // Interlocutor context
  summary: string;                    // Distilled semantic traits context logs
  updatedAt: string;                  // Updated timestamp
}

// 29. AI_EMBEDDINGS
export interface AiEmbedding {
  id: string;                         // Token identifier sequence
  chunkId: string;                    // Link reference to content segment block ID
  vector: number[];                   // Encoded semantic coordinates vector representation
}

// 30. DOCUMENTS
export interface SystemDocument {
  id: string;                         // Document register index
  organizationId: string;             // Enterprise owner reference
  title: string;                      // Document clear label
  classification: DocumentClassification; // Security gating code
}

// 31. FILES
export interface SystemFile {
  id: string;                         // File ID
  documentId: string;                 // Parent Document ID
  fileName: string;                   // True file location title
  url: string;                        // Secure download URL download endpoint link
}

// 32. ANALYTICS
export interface AnalyticsSnapshot {
  id: string;                         // Log snapshot unique date UID
  organizationId: string;             // Multi-tenant boundaries index identifier
  transitCargoVolume: number;         // Computed cargo kilograms processed by boundary
}

// 33. METRICS
export interface MetricLog {
  id: string;                         // Measurement UUID
  metricKey: string;                  // Key name mapping (e.g. border_wait_hours_avg)
  value: number;                      // Evaluated computational double
}

// 34. SYSTEM_CONFIG
export interface SystemConfig {
  id: string;                         // Configuration setting unique key string
  value: string;                      // Setting parameter variable content
  description?: string;               // Scope parameters context information
}

// 35. FEATURE_FLAGS
export interface FeatureFlag {
  id: string;                         // Flag toggle programmatic key string
  isEnabled: boolean;                 // Absolute toggle configuration status
}
