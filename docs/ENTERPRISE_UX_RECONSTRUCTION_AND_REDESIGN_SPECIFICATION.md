# Iraq Digital Gateway (IDG) // Enterprise UX Reconstruction & Redesign Specification
## Comprehensive Sovereign Technology Strategy, Token System, and Visual Foundations
**Document Version:** 1.0.0 (Executive Cabinet Stage)  
**Classification:** SECURE // RECONSTRUCTION & UX BLUEPRINT SPECIFICATION  
**Audience:** Chief UX Architects, Principal Frontend Engineers, Cabinet Presentation Teams, Security Auditors  
**RTL-Ready:** Fully Integrated (Arabic // Kurdish // English)

---

## SECTION 1: MASTER DESIGN ALIGNMENT & CRITERIA DECK

This specification defines the pixel-perfect visual overhaul, structural layout rules, and architectural tokenization required to rebuild the Iraq Digital Gateway (IDG) into an institutional-grade, high-contrast, WCAG AAA-compliant platform. We merge six of the world’s most elite design frameworks into a singular, cohesive design language.

### A. Apple Human Interface Guidelines Accuracy (Spatial Depth & Tactile Feedback)
*   **Spatial Layering**: Enforce clear z-index elevations using physical translucent backgrounds (`backdrop-blur-md`) mimicking hardware glass.
*   **Haptic Physics**: Motion must utilize non-linear spring physics (`damping: 26`, `stiffness: 170`) that mimic real kinetic mass.
*   **Responsive Proportions**: Elements adjust to screen real estate using fluid percentages and strict aspect caps, avoiding rigid pixel traps.

### B. Google Material 3 Quality (Dynamic Token State Layers)
*   **Interactive Overlays**: Buttons and cards use structural state layers (`hover:before:bg-current hover:before:opacity-[0.08]`) that map clean hover states instead of arbitrary bright offsets.
*   **Consistent Focus Systems**: Enforce standard focus rings (`focus-visible:ring-offset-2 focus-visible:ring-2`) across every interactive coordinate.
*   **Semantic Accents**: Base interactive colors directly scale on CSS custom properties, adapting systematically to user settings.

### C. Stripe Dashboard Quality (Hyper-Dense Operational Data Grid)
*   **Data Density**: Maximize spatial efficiency. Numeric arrays, operational tables, and border wait-times use condensed grids with `py-1.5` and `px-3` paddings.
*   **Micro-Typography**: Maintain structural hierarchy with small, high-contrast labels (`font-mono text-[10px] tracking-wider uppercase font-bold text-slate-500`).
*   **Logical Empty States**: Data-deficient interfaces must display descriptive, non-intrusive empty states equipped with targeted action triggers, preventing visual collapse.

### D. Linear Quality (Premium Dark Engineering, Borders, and Low Latency)
*   **1px Border Insets**: Panels utilize internal inset gradients and dual borders to create elegant bezel definitions (`shadow-[0_0_0_1px_rgba(255,255,255,0.05)_inset,0_1px_0_0_rgba(0,0,0,0.2)]`).
*   **Micro-Gradients**: Backgrounds utilize precise radial meshes (`bg-gradient-to-b from-slate-900 via-slate-950 to-[#030712]`).
*   **Keyboard Navigatability**: Every view must support seamless keyboard tab-indexing, focusing layouts instantly with low-latency responsiveness.

### E. Notion Quality (Structural Adaptability & Modular Context)
*   **Modularity**: Elements are structured as self-contained blocks that can scale and re-anchor according to container width changes.
*   **Typographic Balance**: Display titles are balanced gracefully against clean text runs using variable leading rules, ensuring excellent readability.
*   **Clean Sidebar Architecture**: Sidebars feature structured, collapsible headers, metadata toggles, and direct folder hierarchies.

### F. OpenAI Quality (Clean Conversational Intelligence & Stable Output Containers)
*   **Streaming Content Boxes**: Message blocks and AI responses use fixed width-caps and overflow bounds to prevent screen flickering or layout shifts during live token output.
*   **Stable Skeleton States**: When waiting for large intelligence queries, skeleton elements occupy the exact coordinates of the incoming response.
*   **Micro-actions**: Floating copy buttons, share cards, and feedback loops appear contextually on message hover states.

---

## SECTION 2: DETAILED UX AUDIT OF THE CURRENT IDG SYSTEM

The current platform implements complex operational screens. To bridge the gap from prototype to supreme production deck, we audit the following 11 views:

### 1. Chat Container (AI Assistant Workspace)
*   **Current Deficiency**: The conversational bubble lists have uneven vertical paddings and suffer from minor layout jumps during token output. In RTL mode, chat input placement can result in horizontal scrolls.
*   **Redesign Requirement**: Transform into a single, highly stable split-pane cockpit. The left panel houses conversational threads anchored to the bottom. The right panel houses contextual citation inspects, JSON telemetry dumps, and live code evaluations.

### 2. Operational Main Dashboard (Government Showcase)
*   **Current Deficiency**: Metric blocks and compliance timelines are structured with uneven gaps. Responsive columns drop unpredictably on medium viewports (`md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6`).
*   **Redesign Requirement**: Re-architect with an elegant bento-grid structure. Use strict responsive break anchors: 1 column on mobile, 3 columns on tablet, 4 columns on small desktop, and 6 columns on massive presentation screens. Ensure all KPI metric boxes share a uniform height to present a cohesive executive deck.

### 3. Application Settings Panel
*   **Current Deficiency**: Inputs, language options (Arabic/Kurdish/English), and theme switches are grouped inside raw cards without clean categoric drawers or keyboard handles.
*   **Redesign Requirement**: Separate options into clear tab channels (Authentication, Localization, System Permissions, Theme Settings). Anchor language changes to instantaneous document-level transformations, rebuilding layouts instantly without forcing page reloads.

### 4. Interactive Geographic Maps (Border Checkpoint Logistics)
*   **Current Deficiency**: Leaflet elements and coordinate circles lack dark mode synchronization, overlaying glowing labels on top of mismatched white canvas backgrounds.
*   **Redesign Requirement**: Implement responsive SVG map views with dynamic Vector Tile styling that aligns perfectly with system theme coordinates (dark/light tile sets). Ensure hover tooltips are framed by strict dark borders.

### 5. Customs Import Assistant Module
*   **Current Deficiency**: Step wizards feature long text blocks without systematic step counters, which reduces administrative throughput during rapid processing.
*   **Redesign Requirement**: Integrate a vertical step indicator deck matching a linear progress indicator. Highlight active steps using border highlights and solid status nodes.

### 6. Customs Finance Operations Deck
*   **Current Deficiency**: Dynamic customs fee tallies, revenue conversions, and tariff rates are shown without currency selectors, creating potential layout shifts on smaller screens.
*   **Redesign Requirement**: Build structured fee tables with standard row heights, utilizing monospace fonts for numeric values to ensure precise vertical alignments.

### 7. Global Logistics Dashboard
*   **Current Deficiency**: Container throughput metrics are split across unrelated components, making it difficult to analyze port performance on single-screen views.
*   **Redesign Requirement**: Consolidate trade lane metrics into an interactive split layout, presenting real-time throughput data alongside a trade lane volume timeline.

### 8. Live Cargo Tracking Monitor
*   **Current Deficiency**: Package delivery timelines are rendered inside standard text logs without visual progress lines.
*   **Redesign Requirement**: Standardize cargo progress into a modern vertical timeline tree. Use dashed lines for upcoming transit checkpoints and solid green lines for verified segments.

### 9. System Administration and User Management Panel
*   **Current Deficiency**: User access lists, license activations, and system logs are displayed inside basic lists with unformatted timestamps and missing search controls.
*   **Redesign Requirement**: Implement a structured administrative grid with unified filtering, real-time query inputs, and rapid role-toggle commands.

### 10. Sovereign Authentication Interface
*   **Current Deficiency**: Google login buttons and demo sign-in options are styled arbitrarily with inconsistent focus behaviors.
*   **Redesign Requirement**: Build high-contrast, centered login screens displaying official state emblems. Incorporate accessible error messaging and clear field labels.

### 11. AI Workspace Engine
*   **Current Deficiency**: Dynamic sandbox engines and performance audits are displayed inside raw pre-formatted blocks without structured metric layouts.
*   **Redesign Requirement**: Build a responsive dashboard consisting of a three-column layout (Hardening Engine, Reasoning Engine, Benchmark Engine), utilizing monospace typography to present system logs and execution metadata cleanly.

---

## SECTION 3: THE TOKEN SYSTEM ARCHITECTURE

Our token system guarantees color fidelity, contrast compliance, and semantic consistency across all screens.

### A. Core Custom Color Palette
```css
:root {
  /* Dynamic Background System */
  --idg-background-light: #F8FAFC;
  --idg-background-dark: #080D1A;
  
  /* Primary Interactive Surfaces */
  --idg-surface-light: #FFFFFF;
  --idg-surface-dark: #0F172A;
  --idg-surface-secondary-light: #F1F5F9;
  --idg-surface-secondary-dark: #1E293B;

  /* Sovereign Accent Systems */
  --idg-accent-sovereign-gold: #D4AF37;
  --idg-accent-sovereign-gold-hover: #C5A028;
  --idg-accent-iraq-green: #007A3D;
  --idg-accent-iraq-green-hover: #006633;

  /* Structural Border Coordinates */
  --idg-border-light: #E2E8F0;
  --idg-border-dark: #1E293B;
  --idg-border-focus-light: #3B82F6;
  --idg-border-focus-dark: #60A5FA;

  /* Interactive State Overlays */
  --idg-state-hover-light: rgba(15, 23, 42, 0.04);
  --idg-state-hover-dark: rgba(248, 250, 252, 0.06);
  --idg-state-active-light: rgba(15, 23, 42, 0.08);
  --idg-state-active-dark: rgba(248, 250, 252, 0.12);

  /* Contrast-Compliant Core Typography */
  --idg-text-primary-light: #0F172A;
  --idg-text-primary-dark: #F8FAFC;
  --idg-text-secondary-light: #475569;
  --idg-text-secondary-dark: #94A3B8;
  --idg-text-tertiary-light: #64748B;
  --idg-text-tertiary-dark: #64748B;

  /* Pure Functional Systems */
  --idg-success-light: #10B981;
  --idg-success-dark: #34D399;
  --idg-warning-light: #F59E0B;
  --idg-warning-dark: #FBBF24;
  --idg-danger-light: #EF4444;
  --idg-danger-dark: #F87171;
  --idg-info-light: #3B82F6;
  --idg-info-dark: #60A5FA;
}
```

---

## SECTION 4: THE SPACING SYSTEM

IDG layouts use a strict linear spacing scale modeled on an integer multiple of 4px. No odd, fractional, or non-scale values may be utilized in layout paddings, margins, or relative gap definitions.

### Spacing Scale Definition
| Step | Value (Pixels) | Value (rem) | Usage Guideline |
| :--- | :--- | :--- | :--- |
| **space-1** | 4px | 0.25rem | Micro-paddings, badge insets, small indicator spacing |
| **space-2** | 8px | 0.5rem | Small buttons, chip horizontal paddings, layout gap minimums |
| **space-3** | 12px | 0.75rem | General item list spacing, table cell paddings |
| **space-4** | 16px | 1.0rem | Standard card inner paddings, input field offsets, normal gutters |
| **space-6** | 24px | 1.5rem | Outer layout gaps, bento grid spacings, large element gaps |
| **space-8** | 32px | 2.0rem | Page title headers, empty state margins, modal outsets |
| **space-12** | 48px | 3.0rem | Severe sectional divisions, presentation margins |
| **space-16** | 64px | 4.0rem | Primary hero sections, system empty illustration coordinates |

---

## SECTION 5: THE TYPOGRAPHY SYSTEM

Typography must be beautifully styled, ensuring legibility for Arabic and Kurdish character shapes while retaining high monospace clarity for digital assets and trade metadata.

### Typography Scale & Style Mappings
```css
@theme {
  --font-sans: "IBM Plex Sans Arabic", "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-display: "Noto Sans Arabic", "Outfit", "Space Grotesk", sans-serif;
  --font-mono: "JetBrains Mono", "SFMono-Regular", monospace;
}
```

### Typographic Token Specifications

1.  **Display H1 (Cabinet Report Header)**
    *   **Font-family**: `var(--font-display)`
    *   **Size**: `32px` (`2.0rem`)
    *   **Weight**: `700` (Bold)
    *   **Line-height**: `38px`
    *   **Tracking**: `tracking-tight` (`-0.025em`)
    *   **Dynamic RTL**: Contextually adjusts Arabic letter width.

2.  **Dashboard H2 (Operational Title)**
    *   **Font-family**: `var(--font-display)`
    *   **Size**: `24px` (`1.5rem`)
    *   **Weight**: `600` (Semi-Bold)
    *   **Line-height**: `30px`
    *   **Tracking**: `tracking-tight`

3.  **Module H3 (Component Cards Group)**
    *   **Font-family**: `var(--font-sans)`
    *   **Size**: `18px` (`1.125rem`)
    *   **Weight**: `600` (Semi-Bold)
    *   **Line-height**: `24px`

4.  **Body Base (Standard Text, Information Runs)**
    *   **Font-family**: `var(--font-sans)`
    *   **Size**: `14px` (`0.875rem`)
    *   **Weight**: `400` (Normal)
    *   **Line-height**: `22px`
    *   **Contrast**: High-definition `#0F172A` (Light) / `#F8FAFC` (Dark).

5.  **Micro Captions (Status Metadata, Table Headers)**
    *   **Font-family**: `var(--font-sans)`
    *   **Size**: `11px` (`0.6875rem`)
    *   **Weight**: `600` (Semi-Bold)
    *   **Line-height**: `16px`
    *   **Letter-spacing**: `0.05em` (uppercase fallback)

6.  **Code/Numeric Arrays (Database Logs, Throughput Metrics)**
    *   **Font-family**: `var(--font-mono)`
    *   **Size**: `12px` (`0.75rem`)
    *   **Weight**: `500` (Medium)
    *   **Line-height**: `16px`

---

## SECTION 6: THE ICONOGRAPHY SYSTEM

To maintain Stripe-level elegance, avoid custom SVG designs or colored illustrations. Use Lucide icons exclusively, enforcing strict rules for sizing and stroke weights to maintain cohesive layouts.

### Icon Rule Standards
1.  **Functional Controls (Sidebar Link Icons, Input Triggers)**: Size: `18px` | Stroke Weight: `1.75px` | Color: `text-slate-400 dark:text-slate-500`.
2.  **Primary Status Nodes (Table Checkbox, Success Markers)**: Size: `16px` | Stroke Weight: `2.0px`.
3.  **Hero Informational Graphics (Empty State Headers)**: Size: `32px` | Stroke Weight: `1.5px` | Color: `text-slate-300 dark:text-slate-600`.
4.  **Action Buttons**: Size: `14px` | Stroke Weight: `2.0px` (Solid center alignments).

---

## SECTION 7: THE MOTION SYSTEM & SPRING PHYSICS

Framer-motion is used for all layouts. Ensure micro-transitions are responsive and do not create layout clutter.

### Spring Physics Specifications
*   **Spring Normal (Tactile Card Transitions, Popups, Modals)**:
    *   `type: "spring"`
    *   `stiffness: 180`
    *   `damping: 24`
    *   `mass: 1.0`
*   **Spring Fast (Dropdown Items, Immediate Tooltips, Hover Scales)**:
    *   `type: "spring"`
    *   `stiffness: 300`
    *   `damping: 28`
*   **Ease-Decel (Long Timelines, Content Streaming Fade-ins)**:
    *   `type: "tween"`
    *   `ease: [0.16, 1, 0.3, 1]` (Custom Quintic Ease-Out)
    *   `duration: 0.35` (350ms)

---

## SECTION 8: ACCESSIBILITY SYSTEM (WCAG AAA STANDARDS)

IDG is a sovereign public platform. It must meet rigid accessibility certifications.

### Core Accessibility Implementations
1.  **Contrast Minimum Ratio**: 7:1 for text-to-background elements (meeting WCAG AAA recommendations).
2.  **Focus Visibility**: Use high-contrast blue outline borders with clean offsets:
    ```css
    .idg-accessible-focus:focus-visible {
      outline: 2px solid var(--idg-border-focus-light);
      outline-offset: 2px;
    }
    ```
3.  **Strict Keyboard Anchors**: Ensure users can navigate every button, modal, toggle, and dropdown using only the Tab and Enter keys.
4.  **Assistive Screen Reader Support**: Explicitly map `aria-label`, `aria-expanded`, and `aria-live` tags to ensure screen readers can navigate and interpret pages correctly.

---

## SECTION 9: THE RTL SYSTEM CORE SPECIFICATIONS

The Iraq Digital Gateway is fully bilaterally structured. The platform supports seamless Arabic and Kurdish Right-to-Left (RTL) transformations across all views.

```typescript
// Locale Detection Context
export interface RTLLayoutConfig {
  dir: "rtl" | "ltr";
  lang: "ar" | "ku" | "en";
  isRtl: boolean;
}
```

### Key RTL Visual Translation Metrics
1.  **Symmetry**: Swap all margin, padding, absolute placement, and border alignments when switching from LTR to RTL mode.
    *   *LTR*: `pl-4 pr-2 border-r-0 border-l-2 text-left`  
    *   *RTL*: `pr-4 pl-2 border-l-0 border-r-2 text-right`
2.  **Mirror Exclusions**: Numerical text, time stamps, physical serial codes, and mathematical percentage signs are formatted with LTR directionality (`dir="ltr"`) even within RTL screens to ensure accurate reads.

---

## SECTION 10: COMPLETE REDESIGN PLANS FOR INDIVIDUAL SCREENS

### SCREEN 1: Conversational Chat Interface (AI Workspace Deck)

Transforming the main conversational engine into an elite administrative workspace.

#### A. Visual Layout Strategy
A split layout interface. The left component displays conversational threads, styled with crisp borders and a secure scroll region. The right drawer shows live data citations and vector search telemetry.

```
+-----------------------------------------------------------------------------+
| [O IDG AI LOGISTICS COCKPIT]                                 (AR | EN) (o)   |
+------------------------------------+----------------------------------------+
|                                    | CITATION TELEMETRY ENGINE              |
| [SYS: ACTIVE INGEST]               |                                        |
|                                    | > [VECTOR MATCH: 98.4%]                |
| Custom Agent: "Verified cargo.     |   Source: Baghdad Customs Regulation   |
| Entry clearance verified under     |   Section 4.14, Sub-clause B.          |
| Tariff Code Chapter 84."           |                                        |
|                                    | > [SANITY CHECK: PASSED]               |
|                                    |   Consensus Index: 0.99                |
|                                    |   Hardening Shield: Armed              |
| [Type message to assistant...] [^] |                                        |
+------------------------------------+----------------------------------------+
| [=] Hardening (OK)  [v] Sandbox (Active)  [o] System Latency: 42ms          |
+-----------------------------------------------------------------------------+
```

#### B. Redesign Blueprint Code
```tsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, Shield, Zap, RefreshCw, FileText, ArrowRight } from "lucide-react";

export function ElegantChatInterface() {
  const [messages, setMessages] = useState([
    { id: 1, role: "user", text: "Are there tariff exceptions for medical logistics?" },
    { id: 2, role: "assistant", text: "Verified medical logistics fall under sovereign category 1-B. Duties are fully exempted, provided custom verification documents are submitted within 48 hours.", citation: "Customs Tariff Code Code-42a" }
  ]);
  const [inputText, setInputText] = useState("");
  const [selectedCitation, setSelectedCitation] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px] font-sans antialiased bg-slate-950 text-white rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
      {/* Messages Column */}
      <div className="lg:col-span-8 flex flex-col h-full min-h-[550px] border-r border-slate-800">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/40 select-none">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-xs text-slate-400">SESSION // AI_COCKPIT_ACTIVE</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] text-slate-500">LATENCY: 42ms</span>
            <Shield className="w-4 h-4 text-emerald-500" />
          </div>
        </div>
        
        {/* Scroll Container */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex flex-col max-w-[85%] ${msg.role === "user" ? "ml-auto text-right" : "mr-auto text-left"}`}
            >
              <div className={`p-4 rounded-2xl ${msg.role === "user" ? "bg-blue-600 text-white rounded-tr-none" : "bg-slate-900 border border-slate-800 rounded-tl-none text-slate-100"}`}>
                <p className="text-sm leading-relaxed">{msg.text}</p>
                {msg.citation && (
                  <button 
                    onClick={() => setSelectedCitation(msg.citation || null)}
                    className="mt-3 flex items-center gap-1 text-[11px] font-mono text-emerald-400 hover:underline cursor-pointer"
                  >
                    <FileText className="w-3 h-3" />
                    <span>View Citation Info</span>
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/20">
          <div className="relative flex items-center bg-slate-900 border border-slate-800 rounded-xl focus-within:ring-2 focus-within:ring-emerald-500/50">
            <input 
              type="text" 
              placeholder="Query custom logistics agent..."
              className="w-full px-4 py-3 bg-transparent text-sm focus:outline-none"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button className="p-2 mr-2 ml-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-white transition-all">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Citations Inspections sidebar */}
      <div className="lg:col-span-4 flex flex-col p-6 space-y-6 bg-slate-900/40">
        <span className="font-mono text-xs text-slate-400 tracking-wider">CITATION INSPECTION ENGINE</span>
        {selectedCitation ? (
          <div className="space-y-4">
            <div className="p-4 bg-slate-900 rounded-xl border border-emerald-500/30">
              <span className="font-bold text-emerald-400 text-xs">SOURCE DEFINED</span>
              <p className="text-xs text-slate-400 mt-2 font-mono">{selectedCitation}</p>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Based on Section 4.14 of Baghdad Customs Regulation (Duties Assessment), importations that classified as National Relief Logistics (Category 1) qualify for a complete exemption.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 text-center py-10">
            <Shield className="w-8 h-8 text-slate-700 mb-2 animate-pulse" />
            <p className="text-xs">No active citations selected. Click citation reference in chat to populate data.</p>
          </div>
        )}
      </div>
    </div>
  );
}
```

---

### SCREEN 2: BORDER CONTROL COMMAND CENTER (Government Showcase Bento Deck)

#### A. Visual Layout Strategy
A 6-column bento-grid executive command layout. Built on a rich titanium-slate surface, highlighting real-time ministerial metrics. Use precise color indicators for checkpoint states and wait times.

#### B. Redesign Blueprint Code
```tsx
import React from "react";
import { motion } from "motion/react";
import { Globe, Truck, Clock, ShieldCheck, AlertCircle, TrendingUp } from "lucide-react";

export function GovernmentBentoShowcase() {
  const metrics = [
    { id: 1, title: "Total Daily Entries", value: "84,912", trend: "+12.4%", status: "success", icon: Truck },
    { id: 2, title: "Avg Wait Time", value: "24 min", trend: "-8.1%", status: "success", icon: Clock },
    { id: 3, title: "System Active Checkpoints", value: "24 / 24", trend: "Stable", status: "info", icon: Globe },
    { id: 4, title: "Risk Cleared Index", value: "99.9%", trend: "Optimal", status: "success", icon: ShieldCheck }
  ];

  return (
    <div className="space-y-6 bg-[#040811] text-slate-100 p-8 rounded-3xl border border-slate-900 font-sans tracking-tight">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-900 pb-6 select-none">
        <div>
          <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block">Sovereign Performance Monitor</span>
          <h2 className="text-2xl font-bold font-display text-white mt-1">Iraq Federal Border Control Cabinet</h2>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/60 border border-slate-800 rounded-lg text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>REAL-TIME PIPELINES ACTIVE</span>
        </div>
      </div>

      {/* Dynamic Metrics Deck */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((card, idx) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="p-6 bg-slate-900/40 border border-slate-900 rounded-2xl hover:border-slate-800 transition-all shadow-lg text-right relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-4">
              <card.icon className="w-5 h-5 text-slate-400" />
              <span className={`text-xs px-2 py-0.5 rounded-full font-mono font-bold ${
                card.status === "success" ? "bg-emerald-500/10 text-emerald-400" : "bg-blue-500/10 text-blue-400"
              }`}>
                {card.trend}
              </span>
            </div>
            <span className="text-xs text-slate-400 font-medium block">{card.title}</span>
            <span className="text-2xl font-bold font-display text-white mt-2 block">{card.value}</span>
            <div className="absolute right-0 bottom-0 w-24 h-24 bg-blue-500/5 blur-2xl rounded-full" />
          </motion.div>
        ))}
      </div>

      {/* Main Border Throughput List */}
      <div className="p-6 bg-slate-900/20 border border-slate-900 rounded-2xl space-y-4">
        <h3 className="text-sm font-semibold tracking-wide text-slate-300">Checkpoint Performance Registers</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-slate-900 text-slate-400 font-semibold select-none">
                <th className="pb-3 text-right">Checkpoint Directory</th>
                <th className="pb-3">Status Index</th>
                <th className="pb-3">Wait times</th>
                <th className="pb-3">Hourly throughput</th>
                <th className="pb-3 text-left">Telemetry Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "Ibrahim Al-Khalil Cross Border (Turkey)", state: "GREEN", time: "12 min", vol: "240 trucks/h" },
                { name: "Zurbatiyah Port of Entry (Iran)", state: "GREEN", time: "18 min", vol: "180 trucks/h" },
                { name: "Al-Qa'im Border Crossing (Syria)", state: "AMBER", time: "42 min", vol: "45 trucks/h" }
              ].map((row, idx) => (
                <tr key={idx} className="border-b border-slate-900/40 hover:bg-slate-900/10 transition-colors">
                  <td className="py-4 font-bold text-white text-right">{row.name}</td>
                  <td className="py-4 font-mono">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      row.state === "GREEN" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                    }`}>
                      {row.state}
                    </span>
                  </td>
                  <td className="py-4 font-mono text-slate-300">{row.time}</td>
                  <td className="py-4 font-mono text-slate-300">{row.vol}</td>
                  <td className="py-4 text-left">
                    <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      SECURE SYNCED
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
```

---

### SCREEN 3: SOVEREIGN SYSTEM SETTINGS (The Policy Override Desk)

#### A. Visual Layout Strategy
A side-by-side split layout panel. The left navigation handles category changes (Localization, Database Engines, API Security Toggles), and the right view contains action sliders and dynamic toggles.

#### B. Redesign Blueprint Code
```tsx
import React, { useState } from "react";
import { Globe, Shield, Database, Bell, Save } from "lucide-react";

export function PolicyOverrideSettings() {
  const [activeTab, setActiveTab] = useState("localization");
  const [autoSync, setAutoSync] = useState(true);
  const [secLevel, setSecLevel] = useState("high");

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 bg-slate-950 text-white rounded-3xl p-6 border border-slate-900 font-sans shadow-2xl">
      {/* Settings Navigation */}
      <div className="md:col-span-4 flex flex-col space-y-2 border-r border-slate-900 pr-6">
        <span className="text-[10px] font-mono tracking-wider text-slate-500 uppercase px-3 select-none">System Categories</span>
        {[
          { id: "localization", label: "Languages & Regional", icon: Globe },
          { id: "security", label: "Encryption & Hardening", icon: Shield },
          { id: "storage", label: "Active Database Sync", icon: Database }
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center justify-between px-3 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all ${
              activeTab === item.id ? "bg-emerald-600/10 text-emerald-400 border border-emerald-500/30 font-bold" : "text-slate-400 hover:bg-slate-900"
            }`}
          >
            <div className="flex items-center gap-2">
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Settings Action Content */}
      <div className="md:col-span-8 space-y-6">
        {activeTab === "localization" ? (
          <div className="space-y-4">
            <h3 className="font-display font-medium text-lg border-b border-slate-900 pb-3">Language System Override</h3>
            <div className="flex flex-col gap-2">
              <span className="text-xs text-slate-400">Current Gateway Language</span>
              <div className="grid grid-cols-3 gap-3">
                {["ar", "ku", "en"].map((lang) => (
                  <button key={lang} className="p-3 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-700 font-mono text-xs text-center uppercase cursor-pointer">
                    {lang === "ar" ? "العربية (ar)" : lang === "ku" ? "کوردی (ku)" : "English (en)"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : activeTab === "security" ? (
          <div className="space-y-4">
            <h3 className="font-display font-medium text-lg border-b border-slate-900 pb-3">Hardening & Gate Protection</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-slate-900/40 rounded-xl border border-slate-900">
                <div>
                  <span className="text-xs font-bold block">Enforce Strict AES-256 Transport</span>
                  <span className="text-[11px] text-slate-500">Enable automatic encryption across all logistics terminals.</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={autoSync}
                  onChange={(e) => setAutoSync(e.target.checked)}
                  className="w-4 h-4 accent-emerald-500" 
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-900/40 rounded-xl border border-slate-900">
                <div>
                  <span className="text-xs font-bold block">Access Security Clearance</span>
                  <span className="text-[11px] text-slate-500">Determine access security verification settings.</span>
                </div>
                <select 
                  value={secLevel} 
                  onChange={(e) => setSecLevel(e.target.value)} 
                  className="bg-slate-900 border border-slate-800 text-xs px-2 py-1 rounded"
                >
                  <option value="high">Cabinet High Level (M-5)</option>
                  <option value="medium">Administrative Officer</option>
                  <option value="low">Standard Logistics Terminal</option>
                </select>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-slate-500 text-xs py-10 text-center">
            Database synchronization running optimally. Real-time Firestore replication verified.
          </div>
        )}

        {/* Save Bar */}
        <div className="flex justify-end pt-4 border-t border-slate-900">
          <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl px-4 py-2 text-xs font-bold font-mono shadow-md cursor-pointer">
            <Save className="w-4 h-4" />
            <span>APPLY CHANGER POLICIES</span>
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

### SCREEN 4: INTERACTIVE GEOGRAPHIC MAPS (Border Logistics Map Grid)

#### A. Visual Layout Strategy
A fully customizable geographic map coordinate widget overlay. A floating control bar enables administrative focus on active border crossings, using customizable colors to identify trade throughput rates.

#### B. Redesign Blueprint Code
```tsx
import React, { useState } from "react";
import { Compass, ZoomIn, ZoomOut, AlertCircle, RefreshCw } from "lucide-react";

export function SovereignGeographicMap() {
  const [selectedPin, setSelectedPin] = useState<{ id: number; name: string; throughput: string } | null>(null);

  const pins = [
    { id: 1, name: "Ibrahim Al-Khalil (Turkey)", x: "32%", y: "24%", throughput: "Heavy" },
    { id: 2, name: "Port of Umm Qasr (Gulf)", x: "88%", y: "84%", throughput: "Maximum" },
    { id: 3, name: "Al-Sheeb Crossing (Iran)", x: "55%", y: "48%", throughput: "Normal" }
  ];

  return (
    <div className="relative h-[550px] bg-slate-950 border border-slate-900 text-white rounded-3xl overflow-hidden font-sans shadow-2xl">
      {/* Background Grid Canvas */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(15,23,42,0.8),rgba(8,13,26,1))] bg-grid-[#1e293b]/20" />

      {/* Floating Header */}
      <div className="absolute top-6 left-6 right-6 z-10 flex items-center justify-between select-none">
        <div className="px-4 py-2 bg-slate-900/90 border border-slate-800 rounded-2xl flex items-center gap-3">
          <Compass className="w-5 h-5 text-emerald-400" />
          <div>
            <span className="text-[10px] font-mono text-slate-500 block">Sovereign Boundary Gps</span>
            <span className="text-xs font-bold text-slate-200">Iraq Territorial Checkpoint Map</span>
          </div>
        </div>

        <div className="flex gap-2 bg-slate-900/90 border border-slate-800 rounded-xl p-1">
          <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer">
            <ZoomIn className="w-4 h-4" />
          </button>
          <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer">
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Target Map Pins */}
      {pins.map((pin) => (
        <button
          key={pin.id}
          onClick={() => setSelectedPin(pin)}
          className="absolute z-10 cursor-pointer group"
          style={{ top: pin.y, left: pin.x }}
        >
          <div className="relative flex items-center justify-center">
            <span className="absolute inline-flex h-6 w-6 rounded-full bg-emerald-400/30 animate-ping" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border border-white" />
            
            {/* Hover Tooltip Card */}
            <div className="absolute bottom-8 scale-0 group-hover:scale-100 transition-all bg-slate-900 border border-slate-800 text-xs text-white p-3 rounded-xl shadow-xl w-48 text-right select-none pointer-events-none">
              <span className="font-bold block">{pin.name}</span>
              <span className="text-[10px] text-slate-400 font-mono mt-1 block">Volume: {pin.throughput}</span>
            </div>
          </div>
        </button>
      ))}

      {/* Bottom Information Desk overlay */}
      {selectedPin && (
        <div className="absolute bottom-6 left-6 right-6 z-10 p-4 bg-slate-900/95 border border-emerald-500/30 rounded-2xl shadow-xl text-right md:flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block">ACTIVE TERMINAL TELEMETRY</span>
            <h4 className="text-sm font-bold text-white">{selectedPin.name}</h4>
          </div>
          <div className="flex items-center gap-3 mt-4 md:mt-0 font-mono text-xs">
            <span className="text-slate-400">Throughput Assessment Rate: <strong className="text-white">{selectedPin.throughput}</strong></span>
            <button 
              onClick={() => setSelectedPin(null)}
              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-[10px] text-slate-300 font-bold cursor-pointer"
            >
              DISMISS
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
```

---

### SCREEN 5: CUSTOMS IMPORT COMPLIANCE MODULE (The Verification Pipeline)

#### A. Visual Layout Strategy
A structured, top-to-bottom vertical progression layout. The active process state is represented by an elegant stepper mechanism. User forms feature labeled input fields for consistent data entry.

#### B. Redesign Blueprint Code
```tsx
import React, { useState } from "react";
import { Check, ShieldAlert, ArrowRight, UploadCloud } from "lucide-react";

export function CustomsComplianceWizard() {
  const [currentStep, setCurrentStep] = useState(2);

  const stepList = [
    { title: "Manifest Declaration", desc: "Submit raw bills of lading", id: 1 },
    { title: "Tariff Harmonization", desc: "Validate import code matching", id: 2 },
    { title: "Sovereign Audit Clearance", desc: "Verification check", id: 3 }
  ];

  return (
    <div className="bg-slate-950 text-white rounded-3xl p-8 border border-slate-900 font-sans shadow-2xl space-y-8">
      {/* Horizontal Stepper */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-900 pb-8 select-none">
        {stepList.map((step) => (
          <div key={step.id} className="flex items-center gap-4 text-right">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-mono font-bold text-xs ${
              currentStep > step.id 
                ? "bg-emerald-500 text-slate-950 shadow-emerald-500/20" 
                : currentStep === step.id 
                  ? "bg-blue-600 border border-blue-500 shadow-blue-500/25" 
                  : "bg-slate-900 border border-slate-800 text-slate-500"
            }`}>
              {currentStep > step.id ? <Check className="w-5 h-5 mx-auto" /> : step.id}
            </div>
            <div>
              <span className={`text-xs font-bold block ${currentStep === step.id ? "text-white" : "text-slate-400"}`}>
                {step.title}
              </span>
              <span className="text-[11px] text-slate-500 block">{step.desc}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Step Core Action Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-8 space-y-6">
          <div className="space-y-2 text-right">
            <h4 className="text-md font-bold text-slate-200">Step 2 / Operational Tariff Harmonization</h4>
            <p className="text-xs text-slate-400">Validate Chapter 84 electrical machinery declarations against active Iraq customs tariffs.</p>
          </div>

          <div className="p-6 bg-slate-900/30 border border-slate-900 rounded-2xl hover:border-slate-800 transition-all space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs text-slate-400 text-right font-medium">HS Tariff Identification Code</label>
              <input 
                type="text" 
                placeholder="Ex: 8471.30.00" 
                className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl font-mono text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Document upload box */}
            <div className="border border-dashed border-slate-800 p-8 rounded-xl flex flex-col items-center justify-center text-center space-y-2 hover:border-slate-700 transition-all cursor-pointer">
              <UploadCloud className="w-8 h-8 text-slate-500" />
              <span className="text-xs font-bold">Upload Manifest Invalidation Records</span>
              <span className="text-[10px] text-slate-500">PDF, XML payload directories (Max 12MB limit)</span>
            </div>
          </div>
        </div>

        {/* Side Panel Alert Area */}
        <div className="lg:col-span-4 p-6 bg-slate-900/20 border border-slate-900 rounded-2xl flex flex-col justify-between">
          <div className="space-y-4 text-right">
            <div className="flex items-center gap-2 text-amber-400">
              <ShieldAlert className="w-5 h-5 ml-1" />
              <span className="text-xs font-bold uppercase font-mono">Sovereign Compliance Risk</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Discrepancies in Tariff Category Chapter 84 may prompt system audits, resulting in a mandatory 24-hour verification hold.
            </p>
          </div>

          <button className="w-full mt-6 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl py-3 text-xs font-bold cursor-pointer">
            <span>PROCEED SYSTEM STAGE</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

### SCREEN 6: CUSTOMS FINANCE OPERATIONS DECK (The Sovereign Fee Ledger)

#### A. Visual Layout Strategy
A high-contrast finance workspace with structured fee lists. Tariff metrics and revenue tallies utilize clean monospace numbers for maximum visual clarity on complex budget grids.

#### B. Redesign Blueprint Code
```tsx
import React from "react";
import { DollarSign, Landmark, CreditCard, ShieldCheck } from "lucide-react";

export function SovereignFinanceOperations() {
  const rates = [
    { name: "Port Import Tariff Base Rate", fee: "IQD 1,450,000", convert: "$1,107.00", rule: "Rule Category-A" },
    { name: "Sanitary Inspection Clearance Surcharge", fee: "IQD 120,000", convert: "$91.60", rule: "Health Directives" },
    { name: "Sovereign Portal Administrative Fee", fee: "IQD 50,000", convert: "$38.10", rule: "Access Base Code" }
  ];

  return (
    <div className="bg-slate-950 text-white rounded-3xl p-8 border border-slate-900 font-sans shadow-2xl space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-900 select-none">
        <div>
          <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block">FINANCIAL TRANSACTION JOURNAL</span>
          <h2 className="text-xl font-bold font-display text-white mt-1">Sovereign Duty Fees & Tariffs Ledger</h2>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 font-mono">CURRENCY: <strong className="text-white">IQD // USD Override</strong></span>
          <Landmark className="w-4 h-4 text-slate-400" />
        </div>
      </div>

      {/* Finance Table */}
      <div className="overflow-hidden border border-slate-900 rounded-2xl">
        <table className="w-full text-right text-xs">
          <thead>
            <tr className="bg-slate-900/60 border-b border-slate-900 text-slate-400 font-semibold select-none">
              <th className="p-4 text-right">Fee Classification Directive</th>
              <th className="p-4">Assigned Rule Code</th>
              <th className="p-4">Amount Rate (IQD)</th>
              <th className="p-4 text-left">Equivalent Base (USD)</th>
            </tr>
          </thead>
          <tbody>
            {rates.map((item, idx) => (
              <tr key={idx} className="border-b border-slate-900 hover:bg-slate-900/40 transition-colors">
                <td className="p-4 font-bold text-white text-right">{item.name}</td>
                <td className="p-4 font-mono text-slate-400">{item.rule}</td>
                <td className="p-4 font-mono text-emerald-400 font-bold">{item.fee}</td>
                <td className="p-4 font-mono text-slate-300 text-left">{item.convert}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sovereign Payment Processing Platform Portal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <div className="p-6 bg-slate-900/30 border border-slate-900 rounded-2xl flex flex-col justify-between">
          <div className="space-y-4 text-right">
            <span className="text-[11px] font-mono text-emerald-400 block">GOVERNMENT TREASURY INTEGRITY</span>
            <p className="text-xs text-slate-400 leading-relaxed">
              Payments are routed through CBI Central Bank of Iraq. Secured clearances are authorized instantly through cryptographic validation.
            </p>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-emerald-500 font-mono mt-4">
            <ShieldCheck className="w-4 h-4" />
            <span>Sovereign Bank System online</span>
          </div>
        </div>

        <div className="p-6 bg-slate-900/10 border border-slate-900 rounded-2xl space-y-4">
          <span className="text-xs font-bold block text-right">Authorize Duty Liquidation Transaction</span>
          <button className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl py-3 text-xs font-mono font-bold transition-all shadow-md cursor-pointer">
            <CreditCard className="w-4 h-4" />
            <span>EXECUTE SECURE PORTAL PAYMENT</span>
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

### SCREEN 7: GLOBAL LOGISTICS TIMELINE MONITOR (Trade Lanes Throughput)

#### A. Visual Layout Strategy
A structured split-pane workspace. The left view displays container throughput data, while the right displays the active tracking timeline of a trade lane.

#### B. Redesign Blueprint Code
```tsx
import React from "react";
import { Ship, Anchor, MapPin, CheckCircle, RefreshCw } from "lucide-react";

export function SovereignLogisticsTimeline() {
  const checkPoints = [
    { id: 1, action: "Basrah Marine Terminal Discharge", time: "2026-06-03 14:00", complete: true },
    { id: 2, action: "Container Integrity Scanning Hold", time: "2026-06-04 09:30", complete: true },
    { id: 3, action: "Sovereign Customs Fee Ledger Settlement", time: "2026-06-05 11:20", complete: false },
    { id: 4, action: "National Dispatch Transit Release", time: "Pending Sync", complete: false }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-slate-950 text-white rounded-3xl p-8 border border-slate-900 font-sans shadow-2xl">
      {/* Metrics Column */}
      <div className="lg:col-span-4 space-y-6">
        <h3 className="font-display font-medium text-lg border-b border-slate-900 pb-3">Basrah Port Operational Terminal</h3>
        <div className="space-y-4">
          <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-900 text-right">
            <span className="text-[11px] font-mono text-slate-500">CARGO CLASSIFICATION</span>
            <span className="text-sm font-bold block mt-1">Sovereign Petroleum Tanker B-42</span>
          </div>
          <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-900 text-right">
            <span className="text-[11px] font-mono text-slate-500">DISCHARGE VOLUME CAP</span>
            <span className="text-sm font-bold block mt-1 text-emerald-400">84,000 Barrels</span>
          </div>
        </div>
      </div>

      {/* Timeline Progression Index */}
      <div className="lg:col-span-8 space-y-6">
        <div className="flex justify-between items-center bg-slate-900/40 p-4 border border-slate-900 rounded-2xl select-none">
          <span className="text-xs font-bold">Operational Path Audit Trail</span>
          <RefreshCw className="w-4 h-4 text-emerald-400 animate-spin" />
        </div>

        <div className="relative pl-6 space-y-6">
          <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-slate-800" />
          
          {checkPoints.map((row) => (
            <div key={row.id} className="relative flex items-start gap-4">
              <div className={`absolute -left-6 w-6 h-6 rounded-full flex items-center justify-center border-4 border-slate-950 ${
                row.complete ? "bg-emerald-500" : "bg-slate-800"
              }`}>
                {row.complete && <CheckCircle className="w-3 h-3 text-slate-950" />}
              </div>
              <div className="p-4 bg-slate-900/20 border border-slate-900 rounded-xl flex-1 text-right">
                <span className={`text-xs font-bold block ${row.complete ? "text-white" : "text-slate-500"}`}>{row.action}</span>
                <span className="text-[10px] font-mono text-slate-500 mt-1 block">{row.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

---

### SCREEN 8: CARGO MONITOR MODULE (Trade Waypoint Dispatcher)

#### A. Visual Layout Strategy
A cargo and container tracking monitor. A progress bar represents transit status, and waypoint items display precise GPS locations.

#### B. Redesign Blueprint Code
```tsx
import React from "react";
import { MapPin, Navigation, Tag, Clock } from "lucide-react";

export function WaypointDispatcher() {
  const points = [
    { label: "Baghdad Inland Hub", location: "33.3152° N, 44.3661° E", state: "Completed" },
    { label: "Fallujah Transit Node", location: "33.3496° N, 43.7844° E", state: "In Transit" },
    { label: "Al-Rutbah Border Hub", location: "33.0378° N, 40.2917° E", state: "Pending" }
  ];

  return (
    <div className="bg-slate-950 text-slate-100 rounded-3xl p-8 border border-slate-900 font-sans shadow-2xl space-y-6">
      <div className="flex justify-between items-center border-b border-slate-900 pb-4">
        <div>
          <span className="text-[11px] font-mono text-blue-400 uppercase tracking-wider block">WAYPOINT PROGRESS FEED</span>
          <h3 className="text-md font-bold text-white mt-1">Trade Lane Waypoint Monitor</h3>
        </div>
        <Navigation className="w-5 h-5 text-blue-400" />
      </div>

      <div className="space-y-4">
        {points.map((pt, idx) => (
          <div key={idx} className="flex justify-between items-center p-4 bg-slate-900/40 border border-slate-900 rounded-2xl hover:border-slate-800 transition-all text-right">
            <div className="flex items-center gap-3">
              <span className={`px-2.5 py-1 rounded text-[10px] font-bold font-mono ${
                pt.state === "Completed" ? "bg-emerald-500/10 text-emerald-400" : pt.state === "In Transit" ? "bg-blue-500/10 text-blue-400" : "bg-slate-800 text-slate-500"
              }`}>
                {pt.state}
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold block text-white">{pt.label}</span>
              <span className="text-[10px] font-mono text-slate-500 block">{pt.location}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

### SCREEN 9: ADMINISTRATIVE COMPLIANCE CONTROL PANEL (User Identity Console)

#### A. Visual Layout Strategy
An administrative user control panel. Lists users with details on access clearance and system logs, utilizing standard grid tables with action buttons.

#### B. Redesign Blueprint Code
```tsx
import React from "react";
import { User, ShieldAlert, Key, Edit, Power } from "lucide-react";

export function SystemAdminPanel() {
  const users = [
    { name: "Ministrial Director Basrah", role: "M-5 Administrator", email: "director.basrah@idg.gov.iq", spec: "Full Keys Override" },
    { name: "Sovereign Customs Inspector 14", role: "Field Officer", email: "inspector14@idg.gov.iq", spec: "Restricted Audits Only" },
    { name: "Cabinet Presentation Handler", role: "Viewer Status", email: "presenter-eval@idg.gov.iq", spec: "Report Analytics Access" }
  ];

  return (
    <div className="bg-slate-950 text-white rounded-3xl p-8 border border-slate-900 font-sans shadow-2xl space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-900">
        <div>
          <span className="text-[11px] font-mono text-red-400 tracking-wider uppercase block">GATE ACCESS CONTROL</span>
          <h2 className="text-xl font-bold font-display mt-1">Administrative Control System</h2>
        </div>
        <ShieldAlert className="w-6 h-6 text-red-500" />
      </div>

      <div className="space-y-4">
        {users.map((item, idx) => (
          <div key={idx} className="p-4 bg-slate-900/60 border border-slate-900 rounded-2xl hover:border-slate-800 transition-all flex flex-col sm:flex-row items-center justify-between text-right gap-4">
            <div className="flex gap-2">
              <button className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl cursor-pointer">
                <Edit className="w-4 h-4 text-slate-400" />
              </button>
              <button className="p-2 bg-red-950/40 hover:bg-red-900/35 rounded-xl cursor-pointer">
                <Power className="w-4 h-4 text-red-400" />
              </button>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold block text-white">{item.name}</span>
              <span className="text-[11px] text-slate-500 block">{item.email}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

### SCREEN 10: SECURE AUTHENTICATION SCREEN (The Sovereignty Portal)

#### A. Visual Layout Strategy
A visually optimized authentication interface. Displays official state emblem imagery alongside secure credential sign-in inputs.

#### B. Redesign Blueprint Code
```tsx
import React from "react";
import { ShieldCheck, Lock, Mail, ChevronRight } from "lucide-react";

export function SovereignGatewayAuth() {
  return (
    <div className="max-w-md w-full mx-auto bg-slate-950 border border-slate-900 text-white rounded-3xl p-8 font-sans shadow-2xl space-y-6 text-right select-none">
      <div className="text-center space-y-2">
        <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto" />
        <h2 className="text-xl font-bold font-display">Iraq National Gateway System</h2>
        <p className="text-xs text-slate-500">Government Portal Access Clearance Portal</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs text-slate-400 block font-medium">Cabinet Identity Email</label>
          <div className="relative flex items-center bg-slate-900 border border-slate-800 rounded-xl focus-within:ring-1 focus-within:ring-emerald-500">
            <input 
              type="text" 
              placeholder="Ex: officer@cabinet.gov.iq" 
              className="w-full px-4 py-3 bg-transparent text-sm focus:outline-none text-left" 
            />
            <Mail className="w-4 h-4 text-slate-500 mr-3 ml-3" />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs text-slate-400 block font-medium">Clearance Pass Key</label>
          <div className="relative flex items-center bg-slate-900 border border-slate-800 rounded-xl focus-within:ring-1 focus-within:ring-emerald-500">
            <input 
              type="password" 
              placeholder="••••••••••••" 
              className="w-full px-4 py-3 bg-transparent text-sm focus:outline-none text-left" 
            />
            <Lock className="w-4 h-4 text-slate-500 mr-3 ml-3" />
          </div>
        </div>

        <button className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl py-3.5 text-xs font-bold tracking-wider hover:shadow-lg transition-all cursor-pointer">
          <span>SECURE SYSTEM AUTHORIZE</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
```

---

### SCREEN 11: INTEL DESIGN DECK (AI Workspace Command Center)

#### A. Visual Layout Strategy
A multi-column AI sandbox workspace with separate metrics columns, formatted database logs, and live code evaluations.

#### B. Redesign Blueprint Code
```tsx
import React from "react";
import { Cpu, Terminal, Key, Play, ShieldAlert } from "lucide-react";

export function ElegantWorkspaceCommand() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-950 text-white rounded-3xl p-8 border border-slate-900 font-sans shadow-2xl">
      {/* Sandbox Left Area */}
      <div className="lg:col-span-8 space-y-6">
        <div className="flex justify-between items-center border-b border-slate-900 pb-4">
          <div>
            <span className="text-[11px] font-mono text-emerald-400 block">DENSE WORKSPACE COCKPIT</span>
            <h3 className="text-md font-bold mt-1">Sovereign Intel Model Workspace</h3>
          </div>
          <Cpu className="w-5 h-5 text-emerald-400" />
        </div>

        <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-2xl space-y-3">
          <span className="text-xs font-bold block text-right">System Sandbox Controller</span>
          <p className="text-xs text-slate-400 leading-relaxed text-right">
            Integrate live testing scripts with localized vector matching. Verify execution telemetry logs of customs tariff harmonizations instantly.
          </p>
          <div className="flex gap-2 justify-end">
            <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-white px-3 py-1.5 text-xs font-mono font-bold cursor-pointer">
              <Play className="w-3.5 h-3.5" />
              <span>LAUNCH INTEL SANDBOX</span>
            </button>
          </div>
        </div>
      </div>

      {/* Audit Log Right Sidebar */}
      <div className="lg:col-span-4 p-6 bg-slate-900/20 border border-slate-900 rounded-2xl flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-slate-400 border-b border-slate-900 pb-3">
            <Terminal className="w-4 h-4" />
            <span className="text-xs font-bold font-mono tracking-wider">LIVE TELEMETRY FEED</span>
          </div>

          <div className="space-y-3 font-mono text-[10px] text-slate-400 select-none">
            <div className="flex justify-between bg-slate-950 p-2 rounded border border-slate-900">
              <span className="text-emerald-400">PASSED</span>
              <span>Vector Sync Clear</span>
            </div>
            <div className="flex justify-between bg-slate-950 p-2 rounded border border-slate-900">
              <span className="text-emerald-400">98.4%</span>
              <span>Sanity Match Score</span>
            </div>
            <div className="flex justify-between bg-slate-950 p-2 rounded border border-slate-900">
              <span className="text-blue-400">ACTIVE</span>
              <span>Sandbox Loop online</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[9px] text-slate-500 font-mono mt-6 border-t border-slate-900 pt-3">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Cabinet level auditing armed</span>
        </div>
      </div>
    </div>
  );
}
```

---

## SECTION 11: IMPLEMENTATION ROADMAP & DEVELOPMENT CYCLES

Reconstructing the Iraq Digital Gateway platform from existing legacy modules is orchestrated across four sequential architectural phases:

```
+-----------------------------------------------------------------------------------+
| PHASE 1: TOKENIZATION -> PHASE 2: ATOMIC BASE -> PHASE 3: GRID -> PHASE 4: AUDIT  |
+-----------------------------------------------------------------------------------+
| Color / Space Tokens  | IDG Components        | Bento structures | WCAG Contrast  |
| Typography Hierarchy  | CSS state overlays    | Split-panes      | RTL Validation |
| Spring Timing Scales  | Focus Ring standards  | Stable Timelines | Secure Mapping |
+-----------------------------------------------------------------------------------+
```

### Phase 1: Foundation Setup & Global Custom Properties (Week 1)
*   **Target Objective**: Map all visual, structural, and timing configurations directly to CSS Custom Properties inside `tailwind.config.js` and `/src/styles/globals.css`.
*   **Verification Gate**: Run compiler checks to verify that layout structures scale fluidly across standard viewport sizes.

### Phase 2: Atomic Element Development (Week 2-3)
*   **Target Objective**: Develop unified elements (`IDGButton`, `IDGCard`, `IDGKpiCard`, `IDGBorderCard`) to replace legacy markup styles.
*   **Verification Gate**: Verify element focus rings, transitions, and accessibility options in isolation.

### Phase 3: Screen Grid Re-Architecting (Week 4-5)
*   **Target Objective**: Integrate components into unified, responsive bento grids and layouts, ensuring structural sizes (such as card heights) remain consistent.
*   **Verification Gate**: Test adaptive grids on extreme display aspect-ratios (320px mobile to 3440px ultrawide).

### Phase 4: Symmetrical Accessibility & Localization Audits (Week 6)
*   **Target Objective**: Implement bidirectional layout transformations (RTL/LTR), WCAG compliance checkers, and secure mapping frameworks.
*   **Verification Gate**: Run extensive keyboard-only and screen-reader test passes across all platform views.
