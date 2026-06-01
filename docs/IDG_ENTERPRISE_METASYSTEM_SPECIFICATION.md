# Iraq Digital Gateway (IDG) // Unified Systems Architecture
## Authoritative Enterprise Design System, Component Library, & Government-Grade Command Center
**Document Version:** 1.0.0 (Cabinet Audit Stage)
**Classification:** RESTRICTED // SOVEREIGN ARCHITECTURAL BINDING SPECIFICATION
**Target Audience:** Engineering Leads, UI/UX Developers, Security Auditors, ministerial Presentation Teams
**Clearance Level:** Level 5 (Chief Product Architect, Principal Design System Lead, cabinet Evaluators)

---

## 1. EXECUTIVE RETROSPECTIVE & ARCHITECTURAL SUMMARY
This specification serves as the absolute blueprint for rebuilding the IDG Gateway interface into a unified, high-contrast, WCAG AA/AAA-compliant operational command deck. By enforcing rigorous structural tokens, strict component boundaries, and professional government-grade information density, this framework eliminates ad-hoc styling, eliminates programmer-centric artifacts (gaming glows, neon indicators, mock container terminal strings), and delivers an institutional-grade, multi-lingual (Arabic/Kurdish-focused) dashboard.

---

## 2. THE DESIGN ENVIRONMENT AUDIT & VIOLATIONS REPORT
A comprehensive assessment of the existing codebase (`/src/modules/adminDesign/*`, `/src/design-system/*`, `/src/features/dashboard/*`) reveals structural inconsistencies between early-stage prototypes and high-security ministerial presentation standards:

### A. Design Token Violations
1. **Color Violations**:
   - Ad-hoc grey selections (`bg-slate-100`, `bg-slate-850`, `border-slate-250`, `from-slate-900/60`, `dark:bg-[#071739]`) bypassing standard variables.
   - Use of arbitrary color values like `text-violet-700`, `bg-violet-500/5` inside AI cockpit cards without formal semantic mapping.
2. **Typography Violations**:
   - Arbitrary pixel values like `text-[10px]`, `text-[11px]`, and `text-xs` using default system font declarations rather than designated Arabic fonts.
   - Lack of systematic RTL alignment for the fallback `Segoe UI` stack when Arabic texts are mixed with numerals.
3. **Spacing Violations**:
   - Layout files feature random paddings and margins (e.g., `p-5`, `p-1`, `pt-3`, `gap-1.5`, `pb-3`) that violate the closed Spacing Scale of index multiples of 4.
4. **Shadow and Motion Violations**:
   - Usage of `shadow-2xs` and `shadow-xs` which do not conform to Levels 1, 2, or 3.
   - Animations using default Framer Motion curves, exceeding the designated limits of 150ms, 250ms, or 350ms.

### B. Component System Duplication & Redundancy
1. **Widgets vs. Dashboards**:
   - Redundancy between metrics in `DashboardWidgets.tsx`, `GovernmentDashboard.tsx`, and `ExecutiveCommandCenter.tsx`.
   - Fragmented implementation of KPI structures, resulting in duplicate layout rules and conflicting styling patterns across different screens.
2. **Lack of Screen-Reader Markers**:
   - Form fields and buttons lack explicit screen-reader helper labels (`aria-label`, `aria-describedby`) or keyboard-trappable containers.

---

## 3. UNIFIED DESIGN TOKEN ARCHITECTURE

The definitive IDG design system uses a closed set of variables mapping directly to Tailwind rules. Explicit override declarations in `tailwind.config.js` and `src/styles/globals.css` prevent arbitrary overrides.

### Grid System Constraints
- **Desktop (1440px max width)**: 12 Columns | Gutter: `24px` (`gap-6`) | Outset Margins: `32px` (`px-8`)
- **Tablet**: 8 Columns | Gutter: `16px` (`gap-4`) | Outset Margins: `24px` (`px-6`)
- **Mobile**: 4 Columns | Gutter: `16px` (`gap-4`) | Outset Margins: `16px` (`px-4`)

```css
/* Centered Container Wrapper */
.idg-grid-container {
  width: 100%;
  max-width: 1440px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 2rem;  /* 32px (Desktop Margin) */
  padding-right: 2rem;
}
@media (max-width: 1024px) {
  .idg-grid-container {
    padding-left: 1.5rem; /* 24px (Tablet Margin) */
    padding-right: 1.5rem;
  }
}
@media (max-width: 640px) {
  .idg-grid-container {
    padding-left: 1rem;  /* 16px (Mobile Margin) */
    padding-right: 1rem;
  }
}
```

### Color Token Mapping
| Semantic Variable | Light Value | Dark Value | CSS Custom Property |
| :--- | :--- | :--- | :--- |
| **Background / البنية التحتية** | `#F8FAFC` | `#081120` | `--idg-background` |
| **Surface / الواجهة الأساسية** | `#FFFFFF` | `#0F172A` | `--idg-surface` |
| **Surface Secondary / الواجهة الرديفة** | `#F1F5F9` | `#111C33` | `--idg-surface-secondary` |
| **Border / الحدود الثنائية** | `#E2E8F0` | `#22304A` | `--idg-border` |
| **Text Primary / النص الرئيسي** | `#0F172A` | `#F8FAFC` | `--idg-text-primary` |
| **Text Secondary / النص الثانوي** | `#475569` | `#94A3B8` | `--idg-text-secondary` |
| **Success Class / النجاح التنظيمي** | `#10B981` | `#10B981` | `--idg-success` |
| **Warning Class / رصد الانتباه** | `#F59E0B` | `#F59E0B` | `--idg-warning` |
| **Danger Class / التدخل الحاسم** | `#EF4444` | `#EF4444` | `--idg-danger` |
| **Info Class / الإشارات الرقمية** | `#2563EB` | `#2563EB` | `--idg-info` |
| **Neutral Class / المنطقة المحايدة** | `#64748B` | `#64748B` | `--idg-neutral` |

### Typography Scale
- **Primary Typeface**: `IBM Plex Sans Arabic`, `Segoe UI`, `sans-serif`
- **Secondary Typeface**: `Noto Sans Arabic`, `sans-serif`
- **Absolute Size System**:
  - `12px` (rem: `0.75rem`) — Code: `text-idg-12`
  - `14px` (rem: `0.875rem`) — Code: `text-idg-14`
  - `16px` (rem: `1.0rem`) — Code: `text-idg-16`
  - `18px` (rem: `1.125rem`) — Code: `text-idg-18`
  - `20px` (rem: `1.25rem`) — Code: `text-idg-20`
  - `24px` (rem: `1.5rem`) — Code: `text-idg-24`
  - `32px` (rem: `2.0rem`) — Code: `text-idg-32`
  - `40px` (rem: `2.5rem`) — Code: `text-idg-40`

*Absolutely no custom, fluid, or unmapped font-sizes are permitted anywhere.*

### Border Radius Limits
- `12px` (`0.75rem`) — UI Buttons, Status Badges
- `16px` (`1.0rem`) — Secondary Panels, Popup Drawers, Small Form Cards
- `24px` (`1.5rem`) — Interactive Bento Panels, Primary Control Cards
- `32px` (`2.0rem`) — Main Command Deck Borders, Dashboard Foundations

### Spacing Scale System
All offsets must adhere strictly to these steps:
- `4px` (`0.25rem`) | `8px` (`0.5rem`) | `12px` (`0.75rem`) | `16px` (`1rem`) | `24px` (`1.5rem`) | `32px` (`2rem`) | `48px` (`3rem`) | `64px` (`4rem`)

### Shadow Definitions
- **Level 1 (Surface Elev.)**: `0 2px 4px rgba(0,0,0,0.04)`
- **Level 2 (In-Page Drop)**: `0 8px 16px rgba(0,0,0,0.06), 0 2px 4px rgba(0,0,0,0.02)`
- **Level 3 (Modal Overlay)**: `0 20px 40px rgba(0,0,0,0.1), 0 4px 12px rgba(0,0,0,0.03)`

*Forbidden*: No "glowing blue", "cyberpunk neon outlines", or "3D matrix bevel overlays".

### Motion Timing
- **Micro-transitions (Icon hover state changes)**: `150ms` (cubic-bezier(0.4, 0, 0.2, 1))
- **Primary Panel Toggle & Dropdowns**: `250ms` (cubic-bezier(0.4, 0, 0.2, 1))
- **Main Drawer/Modal Transitions**: `350ms` (cubic-bezier(0.4, 0, 0.2, 1))

---

## 4. THE ATOMIC COMPONENT SYSTEM ARCHITECTURE
A modular, high-security reusable component layer must replace raw HTML arrays. To maximize WCAG accessibility, every element features keyboard focus outlines (`focus-visible:ring-2`) and right-to-left layout compliance.

### A. Core Foundation Components
1. **Button (`IDGButton`)**:
   - Outlined, solid, or text-ghost styles.
   - Fixed focus rings (`focus-visible:ring-2 focus-visible:ring-blue-600 outline-none`).
   - Standard padding constraints mapped according to typography size.
2. **Card (`IDGCard`)**:
   - Rigid layout container conforming to Radius `24px` or `32px`.
   - Seamless surface-to-border transitions based on dark-mode toggle coordinates.
3. **Alert Banner (`IDGAlertBanner`)**:
   - Severity states: Success, Warning, Danger, Info.
   - Fully dismissible with key-trapped accessibility handles.

### B. Analytical Presentation Components
1. **KPI Card (`IDGKpiCard`)**:
   - **Required parameters**: Title, Value, Trend (e.g. `+12.4%`), Period (e.g. "اليوم الحالي"), Severity/Indicator state.
   - **Constraint**: *Strict limit of 120px heights to enforce executive scannability.*
2. **Border Operations Card (`IDGBorderCard`)**:
   - Displays name, trade lane throughput, and checkpoint metrics.
   - **Required parameters**: Border Key Name, Operational Status (Green, Amber, Red, Blue), Wait Time (Hours), Traffic throughput volume, Risk Score (numeric), Last Sync timestamp.
3. **Data Table (`IDGDataTable`)**:
   - Up to 8 visible columns.
   - Fixed freeze-pane sticky header.
   - Equipped with instant search filters, CSV/PDF download macros, and paginated footers.
4. **Risk Indicator (`IDGRiskIndicator`)**:
   - Score system `0 - 100` categorized into Low (0-30), Medium (31-60), High (61-80), or Critical (81-100).
   - *Design Mandate*: Must never use color alone to express danger. Displays warning icons (e.g. ShieldAlert, AlertTriangle) paired with clear metadata labels and numerical scores.
5. **AI Insight Card (`IDGAiInsight`)**:
   - Strict Customs Intelligence theme. Purges conversational chatbot "friendly chatter".
   - Staggered layout presenting insights across five sections: **Explain**, **Predict**, **Recommend**, **Investigate**, **Alert**.

---

## 5. NEW COMPONENT PROPERTY INTERFACES & PATTERNS

### IDGKpiCard Props
```typescript
interface IDGKpiCardProps {
  title: string;
  value: string;
  trend: {
    value: string;
    isPositive: boolean;
  };
  period: string;
  indicator: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  id?: string;
}
```

### IDGBorderCard Props
```typescript
interface IDGBorderCardProps {
  borderName: string;
  status: 'operational' | 'attention' | 'critical' | 'info';
  waitTime: string;
  traffic: string;
  riskScore: number; // 0 - 100
  lastUpdated: string;
  id?: string;
}
```

### IDGRiskIndicator Props
```typescript
interface IDGRiskIndicatorProps {
  score: number; // 0-100
  label: string;
  id?: string;
}
```

---

## 6. GOVERNMENT-GRADE OPERATIONS DESIGN (GOVERNANCE COMMAND DECK)

To satisfy the high-ranking ministerial presenters, the primary dashboard transforms into an active operations desk centered around live strategic workflows rather than technical summaries.

```
+--------------------------------------------------------------------------------------+
|                           IDG GATEWAY HIGH-COMMAND HEADERS                           |
+--------------------------------------------------------------------------------------+
| [ KPI 1: ACT-TXNS ]  [ KPI 2: CLR-TODAY ]  [ KPI 3: RISK-IDX ]  [ KPI 4: COMP-RATE ] |
+------------------------------------------------------+-------------------------------+
|                                                      |                               |
|              CRITICAL SECURITY ALERTS                |                               |
|  [DANGER: Checkpoint Alpha Cargo Backlog]            |         AI COCKPIT:           |
|  [WARNING: Currency Outflow Anomaly Detected]        |   PORT CUSTOMS INTELLIGENCE   |
|                                                      |                               |
+------------------------------------------------------+                               |
|                                                      |  [Section 1: Explain]         |
|              BORDER CHECKPOINTS TIMELINE             |  [Section 2: Predict]         |
|  - Checkpoint 1: Wait 45m | Vol: Clear  | Low Risk   |  [Section 3: Recommend]       |
|  - Checkpoint 2: Wait 120m| Vol: Medium | High Risk  |  [Section 4: Investigate]     |
|                                                      |  [Section 5: Alert]           |
+------------------------------------------------------+                               |
|                                                      |                               |
|              TRADE FORECAST DOCK (Area)              |                               |
|  - 48-Hour Projections & Confidence Bands             |                               |
+------------------------------------------------------+-------------------------------+
```

### Core Layout Elements
1. **KPI Header Dock**: Displays the four primary strategic KPIs at 120px height, optimized for immediate presentation.
2. **Critical Safety Alerts Area**: Houses dynamic system notices with clear confirmation protocols before sensitive ministerial actions are dispatched.
3. **Border Operations Overview Grid**: Visualizes active gates using the standard `IDGBorderCard` component.
4. **Volume Projection (Trade Forecast)**: Available as a desktop Area Chart featuring trend guidelines and a confidence band, wrapping back to a swipe-enabled line layout on tablet or mobile.
5. **Port Customs Intelligence Cockpit**: The automated system AI officer drafts compliance predictions, lists regulatory references, and suggests administrative directives (Explain, Predict, Recommend, Investigate, Alert).

---

## 7. ACCESSIBILITY (WCAG AAA) & SECURITY CONTROL PROTOCOLS

### WCAG AA/AAA Remediation
- **RTL Symmetrical Ordering**: Flex containers dynamically adjust using Tailwind `rtl:flex-row-reverse` to prevent text-to-numerical translation misalignment.
- **Font Face Constraints**: Forces direct loading of `IBM Plex Sans Arabic` for official numbers and title elements to keep numbers readable under 5 seconds.
- **Refined Keyboard Focus Hierarchy**: Native dialog handlers feature trap-focus constraints using `@radix-ui/react-dialog` overlays to make all submenus keyboard navigable.
- **Aria Labeling Mapping**:
  - Tables contain summary captions.
  - Active buttons feature localized aria-labels (e.g. `aria-label="تصدير التقارير الجمركية بدقة عالية"`).

### Security UX Framework
All system data points must display their classification flags, indicating that the gateway is audited, sealed, and sanctioned:
- **Verified (موثق / سەلمێنراو)**: Bright green shield lock, confirming validation against central government databases.
- **Restricted (مقيد / سنووردار)**: Deep orange warning lock, indicating access restricted to authorized personnel.
- **Sensitive (حساس / هەستیار)**: Crimson caution badge, signifying high-security data that requires double confirmation before action.
- **Government Only (للاستخدام الحكومي فقط / تەنها بۆ حکومەت)**: Sovereign golden crest, verifying cabinet-level clearance requirements.
- **Audit Logged (خاضع للرقاب الجمركية / تۆمارکراو لە سیستەمی چاودێری)**: Blue eye lock, indicating active operational monitoring and tracking.

#### Sensitive Action Protection
```typescript
interface ConfirmActionProps {
  onConfirm: () => void;
  title: string;
  description: string;
  lang: 'ar' | 'ku';
}
```
All system overrides require double-stage biometric validation simulations (e.g. "تأكيد الإجراء الجمركي الطارئ" or "سەلماندنی بڕیاری باروودۆخی نائاسایی") rather than single-click triggers.

---

## 8. PHASED IMPLEMENTATION ROADMAP

```
+------------------------------------------------------------------------------------------+
|  PHASE I: TOKENS & SYSTEM STANDARDIZATION  ==>  PHASE II: ELEMENTAL COMPONENT MIGRATION   |
|  - Update globals.css with CSS Variables         - Deploy IDGKpiCard, IDGBorderCard       |
|  - Enforce atomic spacing variables              - Unify input, button, table systems    |
+-----------------------------------------------------------+------------------------------+
                                                            |
                                                            v
+------------------------------------------------------------------------------------------+
|  PHASE III: HIGH-COMMAND OPERATIONS INTEGRATION ==> PHASE IV: ACCESSIBILITY & SECURITY     |
|  - Deploy Trade Volume Area Layout               - Run Screen Reader audits (WCAG AAA)   |
|  - Incorporate AI Cockpit Officer                - Deploy verification crest badges      |
+------------------------------------------------------------------------------------------+
```

---

## 9. TRANSITION BLUEPRINT FOR ENGINEERING TEAMS
By replacing old ad-hoc colors and containers with the unified `design-system` references, engineering teams can guarantee perfect consistency across future dashboards. 

Every view, sidebar, and workspace is bound to this design system to provide the Cabinet with a seamless sovereign operational experience.
