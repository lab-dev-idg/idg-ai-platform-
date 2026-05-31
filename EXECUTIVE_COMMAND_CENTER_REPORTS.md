# Iraq Digital Gateway (IDG)
## National Operations Center: Executive Command Center Reports
**Document Classification:** RESTRICTED // SOVEREIGN GOVERNANCE GATEWAY
** clearance Level:** Level 4 (State Administrator, MSc. Diplomatic Arbitrator)

---

### I. Executive Dashboard Architecture Summary
The National Operations Center (NOC) dashboard inside the Iraq Digital Gateway has been engineered on top of a highly responsive, high-contrast full-stack architecture using **React 18**, **Vite**, and **Tailwind CSS**.

1. **Grid Layout**: A balanced layout dividing the primary screen space into:
   - **Sovereign Navigation Sidebar (Left Column)**: Provides immediate access to administrative, financial, logistical, compliance, and custom-intelligence views.
   - **National Status Bar (Top Area)**: Houses high-impact KPI cards that are instantly scannable by ministers, customs directors, and central bank governors within 10 seconds of login.
   - **Executive Intelligence Workspace (Center Area)**: A structural bento-grid panel grouping critical functional summaries (Trade, Customs, Sourcing, Risk Heatmaps, and AI Intelligence) equipped with interactive deep-linked routes.
   - **National Alerts & AI Insights Panel (Right Column)**: Provides continuous, real-time alerting with multi-severity categorization (Critical, Warning, Info) and state-directed actionable instructions.
2. **Tabbed Split Core**: Facilitates rapid toggling between the **National Operations Center View** and the **National AI Assistant Chat System** with zero screen flicker and seamless active-tab tracking.
3. **State and Localization Engine**: Fully integrated with the decentralized `settingsStore` to offer deep localization in **Kurdish Sorani (ckb)** and **Arabic (ar)**, completely filtering out English metadata and text from system outputs.

---

### II. Information Hierarchy Report
The visual hierarchy has been hardened to fit high-level ministries and central command officers:
- **Primary Tier (First 3 Seconds)**: The **National Status Bar** containing the six high-level KPI cards (Active Transactions, Customs Clearances Today, National Risk Index, Compliance Rate, AI Confidence Score, and System Health). These cards use extra-large heavy typography (e.g., `font-black text-xl md:text-2xl`) and visual color coding.
- **Secondary Tier (First 5 Seconds)**: The **Sovereign Alerts Panel** showing active warnings. High-severity alerts feature high-contrast indicator badges (using `bg-rose-100 text-rose-700` and `bg-amber-100/bg-amber-500`) to grab attention immediately.
- **Tertiary Tier (First 10 Seconds)**: The **Bento Grid Panels** providing detailed operational insights (Trade volumes, clearance wait times, and border checkpoint status). Action thresholds utilize clean micro-progress status bars for quick cognitive parsing.

---

### III. KPI Mapping Report

| KPI Name (Arabic / Kurdish) | Metric Code | Target Level | Trend Indicator | Status Badge & Real-time Update Source |
| :--- | :--- | :--- | :--- | :--- |
| **المعاملات النشطة اليوم** / **کارامەییە چالاکەکان** | `TXN-ACT-01` | **٤،٢٨٠** | `+12.4%` (ArrowUpRight) | **لە کاتی ڕاستەقینە** / **تحديث مباشر** (Live pulse index) |
| **المخلصات الجمركية اليوم** / **ڕێکارە گومرگییەکانی ئەمڕۆ** | `CST-CLR-02` | **٢،١٥٠** | `+8.2%` (ArrowUpRight) | **سەکۆی فیدراڵی** / **المنصة الفيدرالية** (Primary registry) |
| **مؤشر المخاطر الوطني** / **شاخصی مەترسی نیشتمانی** | `RSK-NDX-03` | **%١٤** | `-3.5%` (ArrowDownRight) | **ئارام و سەقامگیر** / **مستقر ومؤمن** (Risk mitigation database) |
| **نسبة الامتثال الكلية** / **ڕێژەی پابەندبوونی گشتی** | `CMP-RAT-04` | **%٩٧.٤** | `+1.1%` (ArrowUpRight) | **ئاستی جێبەجێکردن** / **معايير الحوكمة** (Audit compliance pipeline) |
| **ثقة الذكاء الاصطناعي** / **ڕادەی متمانەی هۆشمەندی** | `AI-CONF-05` | **%٩٨.٢** | Stable (✓ Clear) | **شیکاری هۆشەمەند فەعلە** / **توجيه ذكي فعال** (Sovereign LLM confidence score) |
| **سلامة وجودة النظام** / **تەندروستی گشتی سیستەم** | `SYS-HLT-06` | **%١٠٠** | Stable (✓ Ideal) | **بەردەست بە تەواوی** / **فعال بالكامل** (Gateway kernel status) |

---

### IV. Alerting Structure Report
Alert routing maps potential threats and administrative decisions into categorized streams:
- **Severity Levels**:
  - **CRITICAL (خطير / مەترسیدار)**: Demands immediate, day-of tactical attention. Displays red indicators. Highly visible on the Sovereign Alerts Panel.
  - **WARNING (تحذير / ئاگاداری)**: Informs of administrative backlog or latencies at checkpoint junctions. Displays orange indicators.
  - **INFO (معلومات / زانیاری)**: System updates and model sync activities. Displays blue indicators.
- **State Recommendations**:
  Each alert contains a rigorous, localized policy action (e.g., dispatching enforcement patrols, suspending trading licenses, or rerouting shipments to alternate Green Lanes).

---

### V. Presentation Readiness Assessment
- **Sovereign Localization**: **100% Complete**. Fully purged of English text labels, buttons, headers, or chart indexes. Double-localized dynamically in both Sorani and Arabic languages.
- **Luxury Look & Feel**: High-quality layout utilising rich slate background colors (`#0f172a`, `#1e293b`), custom animations with motion parameters (`framer-motion`), soft negative boundaries, and glowing pulse indicators.
- **Bento Workspace Integration**: Interactive navigations link the NOC modules flawlessly to corresponding sub-workspaces (`/customs`, `/logistics`, `/banking`, `/compliance`, `/knowledge`, `/analytics`, `/command`).
- **Administrative Clearance Alignment**: Fully loaded with realistic state metrics reflecting genuine institutional requirements for ministerial presentations. Output is verified and compiles successfully.
