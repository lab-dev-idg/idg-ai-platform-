# IDG Architecture Rebuild // Chat Enterprise Migration Plan
## Unified Full-Stack Repository Pattern & Single-Source-of-Truth Orchestrator

**Target System Status:** Government-Grade National Customs Intelligence System
**Governance Clearance Level:** Chief Product Architect, Principal Design System Lead
**Directives Fulfilled:** Complete decoupling of Firebase logic from the client, single source of truth for Title/Session generation on the backend, eliminate client side race conditions, Zustand and state consistency.

---

## 1. TARGET ARCHITECTURE OVERVIEW

The chat system is transformed from an ad-hoc, client-side, Firestore-writing assembly into a rigorous, sequential enterprise-grade full-stack architecture:

```
Frontend (React)
    ↓ [Invokes state actions & reads messages]
Chat Store (Zustand)
    ↓ [Executes standardized REST API fetches]
API Layer (/api/chat)
    ↓ [Standard Express routes using controllers/handlers]
Chat Orchestrator (server/services/chat/ChatOrchestrator.ts)
    ↓ [Coordinates flow, builds prompt, asks Gemini, audits security]
Gemini Provider (server/services/gemini/GeminiProvider.ts)
    ↓ [Interfaces with `@google/genai` to synthesize insights]
Validation / Security Layer
    ↓ [Enforces AAA classification constraints and validates request data]
Firestore Storage (server/services/firestore/FirestoreService.ts)
    ↓ [Persists sessions & messages under strict schemas directly on server]
```

---

## 2. REPOSITORY & DIRECTORY LAYOUT

```
server/
  services/
    firestore/
      index.ts           <-- Backend Firebase connection, init & repository functions
    gemini/
      index.ts           <-- Gemini provider client for title & response generation
    chat/
      index.ts           <-- ChatOrchestrator class coordinate conversation logic
  routes/
    chat.ts              <-- Re-routed endpoint mappings for Standard CRUD API
```

---

## 3. FILE-BY-FILE MIGRATION ROADMAP

### A. Backend Services Map

#### 1. `server/services/firestore/index.ts`
* Establishes dynamic initialization of Firestore using the server-side SDK (with configuration from `firebase-applet-config.json` and fallback to local environment variables).
* Implements direct repository helpers under the standard schema:
  - `createChat(userId: string, title: string): Promise<string>`
  - `getChats(userId: string): Promise<any[]>`
  - `getChat(chatId: string): Promise<any>`
  - `getMessages(chatId: string): Promise<any[]>`
  - `addMessageToChat(chatId: string, role: 'user' | 'model', text: string): Promise<void>`
  - `deleteChat(chatId: string): Promise<void>`

#### 2. `server/services/gemini/index.ts`
* Initiates the Google Gen AI client library using `process.env.GEMINI_API_KEY` (lazy initialization to avoid server boot crashes).
* Methods:
  - `generateResponse(message: string, history: any[], context: any): Promise<string>`
  - `generateTitle(userMessage: string): Promise<string>`

#### 3. `server/services/chat/index.ts` (ChatOrchestrator)
* Composes the core enterprise conversation step.
* Orchestrator handles:
  1. Creating the chat session (fetching/defining title uniquely from user's first prompt on first turn).
  2. Formatting context constraints into the Customs Intelligence Officer persona.
  3. Appending message histories securely.
  4. Prompting the Gemini Provider for the final sovereign-grade decision support.
  5. Writing both original User prompts and Model decisions synchronously into Firestore.
  6. Emitting standard transactional structure to the API layer.

#### 4. `server/routes/chat.ts`
* Refactored to completely bypass old custom local stream memory array hacks.
* Mounts the standard, clean RESTful endpoints:
  * `POST /api/chat` (input: `{ message: string, chatId?: string }` | returns `{ chatId, title, response, createdAt }`)
  * `GET /api/chats` (returns array of chats for list display)
  * `GET /api/chat/:chatId` (returns `{ chatId, title, messages: [...] }`)
  * `DELETE /api/chat/:chatId` (deletes chat and messages records, returning `{ success: true }`)

---

## 4. FRONTEND MIGRATION DETAILS

#### 1. `src/store/chatStore.ts`
* **Deletes**: All imports of `firebase/auth`, `firebase/firestore`, `db`, and local message stream parsing fallback regexes.
* **Adds**: Standard clean state tracking variables:
  - `activeChatId: string | null`
  - `chatList: any[]`
  - `loadChatList(): Promise<void>`
  - `selectChat(chatId: string): Promise<void>`
  - `deleteChat(chatId: string): Promise<void>`
* **Refactors**: `handleSend(text)` uses synchronous fetch to `POST /api/chat` using current `activeChatId`. Updates state securely with the returned response. Integrates active language and current page context natively.

---

## 5. SEAMLESS COMPATIBILITY GUARANTEES

* **Zero Direct Writing**: All React Components (such as `ChatInterface`) call actions inside the redesigned `useChatStore`. All components are cleared of direct `db` operations.
* **Localization Preservation**: Retains active Kurdish and Arabic UI fallback strings securely during page load and sidebars.
* **Route Safety**: Keeps exact matching endpoints so the app continues loading perfectly inside the sandboxed container.
