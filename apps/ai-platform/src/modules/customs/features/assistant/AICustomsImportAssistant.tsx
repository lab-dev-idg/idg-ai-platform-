import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cpu, 
  Layers, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Compass, 
  Scale, 
  ShieldAlert, 
  Clock, 
  Lock, 
  Coins, 
  Briefcase, 
  Terminal, 
  Printer,
  Sparkles,
  Info
} from 'lucide-react';
import { GlassCard, Badge, cn } from '@idg/ui';
import { useTranslation } from './hooks/useTranslation';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { IntelligenceAssessmentSimulator } from './components/IntelligenceAssessmentSimulator';
import { ReportGeneratorModal } from './components/ReportGeneratorModal';
import { calculateScenario, MOCK_SCENARIOS } from './mockData';
import { ImporterProductInput, CustomsScenario, RequiredDocument } from './types';

export function AICustomsImportAssistant() {
  const { t, lang } = useTranslation();
  const [activeStep, setActiveStep] = useState<number>(0);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('laptops');
  
  // Initialize state with default Laptops Import
  const [inputState, setInputState] = useState<ImporterProductInput>(MOCK_SCENARIOS.laptops);
  const [scenarioState, setScenarioState] = useState<CustomsScenario>(calculateScenario(MOCK_SCENARIOS.laptops));
  
  // Step 2 Interactive custom controls: Users can tweak values to see live outcomes
  const [overrideDutyPercent, setOverrideDutyPercent] = useState<number | null>(null);
  const [overrideTaxPercent, setOverrideTaxPercent] = useState<number | null>(null);
  
  // Step 4 toggles: allow users to approve/upload/reject mock cargo docs
  const [activeDocuments, setActiveDocuments] = useState<RequiredDocument[]>(scenarioState.documents);
  const [selectedDocId, setSelectedDocId] = useState<string>('doc_1');

  // Step 3 compliance audit animation simulation
  const [complianceAuditing, setComplianceAuditing] = useState<boolean>(false);
  const [complianceLogs, setComplianceLogs] = useState<string[]>([]);
  const [auditProgress, setAuditProgress] = useState<number>(100);

  // Overlay Modals Trigger State
  const [isSimulatorOpen, setIsSimulatorOpen] = useState<boolean>(false);
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);

  // Recalculate scenario when standard form inputs or selectedTemplate changes
  useEffect(() => {
    const updated = calculateScenario(inputState);
    setScenarioState(updated);
    setActiveDocuments(updated.documents);
    // Reset overrides when changing inputs so they align with the AI defaults
    setOverrideDutyPercent(null);
    setOverrideTaxPercent(null);
  }, [inputState]);

  // Handle template selection
  const handleTemplateSelection = (key: string) => {
    setSelectedTemplate(key);
    setInputState(MOCK_SCENARIOS[key]);
  };

  // Run simulation sequence for compliance
  const runSimulatedComplianceAudit = () => {
    setComplianceAuditing(true);
    setAuditProgress(0);
    setComplianceLogs([]);
    
    // Localized-like technical logs suitable for government officials
    const logs = [
      `[SEC-SCAN] Initialized secure tunnel connection to Central Bank of Iraq Whitelist registries...`,
      `[SEC-SCAN] Accessing federal cargo databases for verified importer tags... FOUND`,
      `[SEC-SCAN] Validating HS Code ${scenarioState.analysis.hsSuggestedCode} against the 2026 Iraq Duty Schedule... VERIFIED`,
      `[SEC-SCAN] Checking international sanctions watchlists for origin node: '${inputState.originCountry}'... PASS`,
      `[SEC-SCAN] Generating 256-bit SHA regulatory metadata signature... COMPLETED`,
      `[SEC-SCAN] Sovereign audit integrity score: ${scenarioState.compliance.riskScore}/100. Verification complete.`
    ];

    let currentLogIndex = 0;
    const interval = setInterval(() => {
      if (currentLogIndex < logs.length) {
        setComplianceLogs(prev => [...prev, logs[currentLogIndex]]);
        setAuditProgress(Math.min(100, Math.round(((currentLogIndex + 1) / logs.length) * 100)));
        currentLogIndex++;
      } else {
        clearInterval(interval);
        setComplianceAuditing(false);
      }
    }, 400);
  };

  // Run initial log filling on step entrance
  useEffect(() => {
    if (activeStep === 2 && complianceLogs.length === 0) {
      runSimulatedComplianceAudit();
    }
  }, [activeStep]);

  // Update dynamic values if overridden
  const activeDutyRate = overrideDutyPercent !== null ? overrideDutyPercent : scenarioState.tax.customsDutyPercent;
  const activeTaxRate = overrideTaxPercent !== null ? overrideTaxPercent : scenarioState.tax.importTaxPercent;
  const calculatedDutyAmt = Math.round(inputState.invoiceValue * (activeDutyRate / 100));
  const calculatedTaxAmt = Math.round(inputState.invoiceValue * (activeTaxRate / 100));
  const calculatedTotal = calculatedDutyAmt + calculatedTaxAmt + scenarioState.tax.processingFee;

  // Toggle document status inside our secure locker
  const handleToggleDocStatus = (docId: string, status: 'PENDING' | 'UPLOADED' | 'APPROVED' | 'REJECTED') => {
    setActiveDocuments(prev => prev.map(doc => {
      if (doc.id === docId) {
        return {
          ...doc,
          status,
          updatedAt: status !== 'PENDING' ? new Date().toLocaleTimeString() : undefined
        };
      }
      return doc;
    }));
  };

  const uploadProgressCount = activeDocuments.filter(d => d.status === 'APPROVED' || d.status === 'UPLOADED').length;
  const documentPercent = Math.round((uploadProgressCount / activeDocuments.length) * 100);

  // Dynamic localization mapping for STEPS list
  const STEPS = [
    { label: t.stepper.hs, desc: t.stepper.hsDesc },
    { label: t.stepper.tax, desc: t.stepper.taxDesc },
    { label: t.stepper.audit, desc: t.stepper.auditDesc },
    { label: t.stepper.doc, desc: t.stepper.docDesc },
    { label: t.stepper.logistics, desc: t.stepper.logisticsDesc },
    { label: t.stepper.dashboard, desc: t.stepper.dashboardDesc }
  ];

  return (
    <div className="flex flex-col gap-6" id="ai-customs-assistant-root">
      
      {/* Sovereign National Brand Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 border-2 border-[#1E293B] text-white p-5 rounded-3xl" id="assistant-masthead">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-2xl border border-amber-500/20">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-amber-500 text-slate-950 font-black px-2 py-0.5 rounded-md tracking-wider uppercase">
                {t.demoBadge}
              </span>
              <span className="text-[9px] text-slate-400 font-mono font-bold">VER. 2026.01</span>
            </div>
            <h1 className="text-base sm:text-lg font-black tracking-tight mt-0.5">{t.title}</h1>
            <p className="text-[11px] text-slate-400 font-medium leading-normal">{t.platformSubtitle}</p>
          </div>
        </div>

        {/* Central i18n Switcher */}
        <div className="shrink-0">
          <LanguageSwitcher />
        </div>
      </div>

      {/* Dynamic Scenario Swapping Panel (5 Custom Scenarios) */}
      <GlassCard className="p-5 border border-slate-205 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 shadow-xs flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row items-baseline sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h2 className="text-xs font-black text-[#071739] dark:text-white uppercase tracking-tight flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
              {t.scenarioLabel}
            </h2>
            <p className="text-[10px] text-slate-500 font-medium">{t.scenarioHelp}</p>
          </div>
        </div>

        {/* The 5 Sovereign Scenarios Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5 w-full">
          {(Object.keys(MOCK_SCENARIOS) as Array<keyof typeof MOCK_SCENARIOS>).map((key) => {
            const scText = t.scenarios[key];
            const isSelected = selectedTemplate === key;

            return (
              <button
                key={key}
                onClick={() => handleTemplateSelection(key)}
                className={cn(
                  "px-3 py-3 text-right text-xs rounded-2xl border transition-all cursor-pointer flex flex-col items-start gap-1 justify-between",
                  isSelected
                    ? "bg-[#071739] text-white border-[#071739] dark:bg-slate-800 dark:border-slate-750 shadow-md ring-2 ring-amber-500/10"
                    : "bg-white border-slate-200/80 text-slate-700 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 shadow-3xs"
                )}
                id={`btn-scenario-${key}`}
              >
                <span className="font-mono text-[9px] font-bold text-slate-400 dark:text-slate-500 tracking-wider">
                  {scText.route}
                </span>
                <span className="font-extrabold line-clamp-1 text-right w-full mt-1">
                  {scText.title}
                </span>
              </button>
            );
          })}
        </div>
      </GlassCard>

      {/* Stepper Wizard Indicator Rail */}
      <div className="flex overflow-x-auto pb-2 border-b border-slate-100 dark:border-slate-800 select-none custom-scrollbar" id="assistant-stepper">
        <div className="flex w-full justify-between items-center min-w-[760px] px-2 gap-2">
          {STEPS.map((step, idx) => {
            const isCompleted = idx < activeStep;
            const isActive = idx === activeStep;
            
            return (
              <React.Fragment key={idx}>
                <button
                  onClick={() => setActiveStep(idx)}
                  className="flex items-center gap-2.5 text-right focus:outline-none cursor-pointer group shrink-0"
                  id={`btn-step-rail-${idx}`}
                >
                  <div className={cn(
                    "w-7.5 h-7.5 rounded-xl flex items-center justify-center font-bold text-xs border transition-all",
                    isCompleted && "bg-amber-600 text-white border-amber-600 shadow-sm",
                    isActive && "bg-slate-900 text-white border-slate-900 dark:bg-amber-600 dark:border-amber-600 ring-4 ring-amber-500/10",
                    !isActive && !isCompleted && "bg-white border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-500"
                  )}>
                    {isCompleted ? <CheckCircle2 className="w-4 h-4 text-white" /> : idx + 1}
                  </div>
                  <div className="text-right">
                    <h3 className={cn(
                      "text-[10px] font-black tracking-tight uppercase whitespace-nowrap",
                      isActive ? "text-slate-900 dark:text-white" : "text-slate-400 dark:text-slate-500"
                    )}>
                      {step.label}
                    </h3>
                    <p className="text-[9px] text-slate-400 dark:text-slate-500 leading-none mt-0.5 whitespace-nowrap">{step.desc}</p>
                  </div>
                </button>
                {idx < STEPS.length - 1 && (
                  <div className={cn(
                    "flex-1 h-[2px] mx-1 max-w-[30px] rounded-full",
                    idx < activeStep ? "bg-amber-500" : "bg-slate-200 dark:bg-slate-800"
                  )} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Main Form/Preview/Report Render Space */}
      <div className="min-h-[500px]" id="step-render-view">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 gap-6"
          >
            
            {/* ==================== STEP 1: HS CLASSIFICATION ==================== */}
            {activeStep === 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start" id="view-step-0">
                {/* Product Entry Form Card */}
                <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-3xs flex flex-col gap-4">
                  <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2 select-none">
                    <span className="w-1.5 h-3 rounded bg-[#0066FF]" />
                    {t.formTitle}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-right">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1>{">{t.formProdName}</label>
                      <input
                        type="text"
                        value={inputState.productName}
                        onChange={(e) => setInputState(prev => ({ ...prev, productName: e.target.value }))}
                        className="w-full text-xs font-bold border border-slate-200 dark:border-slate-800 focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] px-3 py-2.5 rounded-xl outline-none bg-transparent"
                        required
                        id="input-product-name"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">{t.formProdDesc}</label>
                      <textarea
                        value={inputState.productDescription}
                        onChange={(e) => setInputState(prev => ({ ...prev, productDescription: e.target.value }))}
                        rows={3}
                        className="w-full text-xs font-bold border border-slate-200 dark:border-slate-800 focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] p-3 rounded-xl outline-none leading-relaxed bg-transparent"
                        required
                        id="input-product-desc"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">{t.formQuantity}</label>
                      <input
                        type="number"
                        value={inputState.quantity}
                        onChange={(e) => setInputState(prev => ({ ...prev, quantity: Math.max(1, parseInt(e.target.value) || 0) }))}
                        className="w-full text-xs font-black border border-slate-200 dark:border-slate-800 focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] p-2.5 rounded-xl outline-none bg-transparent"
                        id="input-product-qty"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">{t.formValUSD}</label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-mono font-bold">$</span>
                        <input
                          type="number"
                          value={inputState.invoiceValue}
                          onChange={(e) => setInputState(prev => ({ ...prev, invoiceValue: Math.max(1, parseInt(e.target.value) || 0) }))}
                          className="w-full text-xs font-black border border-slate-200 dark:border-slate-800 focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] pl-7 pr-3 py-2.5 rounded-xl outline-none text-right font-mono bg-transparent"
                          id="input-product-val"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">{t.formOrigin}</label>
                      <select
                        value={inputState.originCountry}
                        onChange={(e) => setInputState(prev => ({ ...prev, originCountry: e.target.value }))}
                        className="w-full text-xs font-black border border-slate-200 dark:border-slate-800 focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] py-2.5 px-3 rounded-xl outline-none bg-white dark:bg-slate-900"
                        id="input-product-origin"
                      >
                        <option value="China">China Node</option>
                        <option value="Germany">Germany Node</option>
                        <option value="Turkey">Turkey Node</option>
                        <option value="Jordan">Jordan Node</option>
                        <option value="South Korea">South Korea Node</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">{t.formTransport}</label>
                      <select
                        value={inputState.transportMethod}
                        onChange={(e) => setInputState(prev => ({ ...prev, transportMethod: e.target.value as any }))}
                        className="w-full text-xs font-black border border-slate-200 dark:border-slate-800 focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] py-2.5 px-3 rounded-xl outline-none bg-white dark:bg-slate-900"
                        id="input-product-transport"
                      >
                        <option value="Sea Freight">🚢 Sea Freight Terminal</option>
                        <option value="Air Freight">✈️ Air Freight Terminal</option>
                        <option value="Land Freight">🚛 Land Freight Terminal</option>
                      </select>
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-950 rounded-xl p-3 border border-slate-150 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-650 font-mono mt-2">
                    <span className="flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5 text-blue-500" />
                      {t.secureEncryption}
                    </span>
                    <span>{t.secure128}</span>
                  </div>
                </div>

                {/* AI suggested result panel */}
                <div className="lg:col-span-6 space-y-4">
                  <div className="bg-gradient-to-br from-[#071739] to-[#0A2540] text-white rounded-3xl p-6 shadow-md border border-slate-800 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-36 h-36 bg-[#0066FF]/10 rounded-full blur-2xl pointer-events-none" />

                    <div className="flex justify-between items-start mb-4 relative z-10">
                      <div className="p-2 bg-[#0066FF]/10 text-[#0066FF] rounded-lg border border-[#0066FF]/20 shrink-0">
                        <Cpu className="w-5 h-5 animate-pulse" />
                      </div>
                      <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[10px] font-mono tracking-widest font-black py-0.5 px-2">
                        {scenarioState.analysis.confidenceScore}{t.confidenceFull}
                      </Badge>
                    </div>

                    <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1 select-none">
                      {t.decisionTitle}
                    </h4>

                    <div className="flex items-baseline gap-2 mb-4 text-right">
                      <span className="text-3xl sm:text-4xl font-black tracking-tight text-white font-mono">
                        {scenarioState.analysis.hsSuggestedCode}
                      </span>
                      <span className="text-xs text-slate-400 font-bold font-mono">/ (Category IV)</span>
                    </div>

                    <div className="space-y-3 font-semibold text-xs border-t border-slate-800 pt-4 relative z-10">
                      <div className="flex justify-between items-center bg-slate-950/40 p-2 rounded-lg">
                        <span className="text-slate-400 uppercase text-[9px] font-black">{t.category}</span>
                        <span className="text-slate-100 font-bold max-w-[240px] truncate">{scenarioState.analysis.productCategory}</span>
                      </div>

                      <div className="flex justify-between items-center bg-slate-950/40 p-2 rounded-lg">
                        <span className="text-slate-400 uppercase text-[9px] font-black">{t.classification}</span>
                        <span className="text-amber-500 font-bold">{scenarioState.analysis.customsClassification}</span>
                      </div>

                      <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-3.5 mt-2">
                        <div className="flex items-center gap-1.5 text-xs text-amber-500 font-black uppercase mb-1">
                          <Info className="w-4 h-4" />
                          {t.regNotes}
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed font-semibold">
                          {scenarioState.analysis.regulatoryNotes}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Alternative codes list */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-201 dark:border-slate-800 rounded-3xl p-5 shadow-3xs">
                    <h3 className="text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2 mb-3 select-none">
                      <Layers className="w-4 h-4 text-slate-400 animate-pulse" />
                      {t.altCodes}
                    </h3>

                    <div className="space-y-2">
                      {scenarioState.analysis.alternativeCodes.map((alt) => (
                        <div
                          key={alt.code}
                          className="w-full text-right p-3 border rounded-xl border-slate-100 dark:border-slate-850 flex items-center justify-between"
                        >
                          <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono font-bold px-1.5 rounded">
                            {alt.confidence}% match
                          </span>
                          <div className="text-right">
                            <span className="font-mono text-xs font-black text-slate-800 dark:text-slate-100">{alt.code}</span>
                            <p className="text-[10px] text-slate-400 font-medium max-w-[280px] truncate">{alt.label}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ==================== STEP 2: TAX SIMULATOR & OVERRIDES ==================== */}
            {activeStep === 1 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start" id="view-step-1">
                {/* Ledger Calculations Sheet */}
                <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-3xs space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 select-none">
                    <h3 className="text-xs font-black text-[#071739] dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Scale className="w-4 h-4 text-blue-500 animate-pulse" />
                      {t.taxBreakdown}
                    </h3>
                    <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 font-mono text-[9px] font-black">
                      CIF MULTIPLIER: {scenarioState.tax.cifMultiplier}x
                    </Badge>
                  </div>

                  {/* Calculations breakdown key grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-right">
                    <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-850">
                      <span className="text-[10px] text-slate-500 font-black uppercase tracking-wider block mb-1">{t.declaredCIF}</span>
                      <span className="text-lg font-black text-[#071739] dark:text-white font-mono">
                        ${Math.round(inputState.invoiceValue * scenarioState.tax.cifMultiplier).toLocaleString()}
                      </span>
                    </div>

                    <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-850">
                      <span className="text-[10px] text-slate-500 font-black uppercase tracking-wider block mb-1">{t.customsDuty} ({activeDutyRate}%)</span>
                      <span className="text-lg font-black text-amber-600 font-mono">${calculatedDutyAmt.toLocaleString()}</span>
                    </div>

                    <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-850">
                      <span className="text-[10px] text-slate-500 font-black uppercase tracking-wider block mb-1">{t.importTax} ({activeTaxRate}%)</span>
                      <span className="text-lg font-black text-[#0066FF] font-mono">${calculatedTaxAmt.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Pricing detail list */}
                  <div className="space-y-3 bg-slate-50/50 dark:bg-slate-950/20 p-4 rounded-xl border border-slate-100 dark:border-slate-850">
                    <div className="flex justify-between items-center text-xs font-black">
                      <span className="text-slate-400 uppercase text-[9px] tracking-wide">{t.fobValue}</span>
                      <span className="font-mono text-slate-700 dark:text-slate-300">${inputState.invoiceValue.toLocaleString()} USD</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-black">
                      <span className="text-slate-400 uppercase text-[9px] tracking-wide">{t.processingFee}</span>
                      <span className="font-mono text-slate-700 dark:text-slate-300">${scenarioState.tax.processingFee} USD</span>
                    </div>
                    <hr className="border-slate-250 dark:border-slate-850" />
                    <div className="flex justify-between items-center text-sm font-black text-slate-900 dark:text-white">
                      <span>{t.totalEscrow}</span>
                      <span className="font-mono text-amber-600 text-lg">${calculatedTotal.toLocaleString()} USD</span>
                    </div>
                  </div>

                  {/* Pristine Pure Tailwind Bar Chart Representing Duties and Taxes Breakdown */}
                  <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-3xl border border-slate-150 dark:border-slate-850">
                    <h4 className="text-[10px] font-black text-slate-500 uppercase mb-3 text-right">{t.chartTitle}</h4>
                    
                    {/* Visual Bar Stack */}
                    <div className="h-6 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex">
                      <div 
                        style={{ width: `${Math.round((calculatedDutyAmt / calculatedTotal) * 100)}%` }}
                        className="bg-amber-500 h-full hover:opacity-90 transition-opacity"
                        title="Customs Duty Portion"
                      />
                      <div 
                        style={{ width: `${Math.round((calculatedTaxAmt / calculatedTotal) * 100)}%` }}
                        className="bg-blue-600 h-full hover:opacity-90 transition-opacity"
                        title="Import Tax Portion"
                      />
                      <div 
                        style={{ width: `${Math.round((scenarioState.tax.processingFee / calculatedTotal) * 100)}%` }}
                        className="bg-slate-400 h-full hover:opacity-90 transition-opacity"
                        title="Processing Fees Portion"
                      />
                    </div>

                    {/* Chart Legend Labels */}
                    <div className="flex flex-wrap gap-4 mt-3 text-xs justify-end">
                      <div className="flex items-center gap-1.5 font-bold">
                        <span>{t.customsDuty}</span>
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      </div>
                      <div className="flex items-center gap-1.5 font-bold">
                        <span>{t.importTax}</span>
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                      </div>
                      <div className="flex items-center gap-1.5 font-bold">
                        <span>{t.feeLabel}</span>
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Overrides Tweaker Sliders Pane */}
                <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-3xs space-y-5 text-right">
                  <h4 className="text-xs font-black text-[#071739] dark:text-white uppercase tracking-wider flex items-center justify-end gap-1.5 border-b pb-2 select-none">
                    {t.recalcValues}
                    <Lock className="w-4 h-4 text-slate-400" />
                  </h4>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center text-xs font-bold text-slate-500 mb-1.5">
                        <span className="font-mono text-[#0066FF] font-black">{activeDutyRate}%</span>
                        <span>{t.dutyLabel}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="40"
                        value={activeDutyRate}
                        onChange={(e) => setOverrideDutyPercent(parseInt(e.target.value))}
                        className="w-full accent-amber-500 cursor-pointer"
                        id="slider-duty"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center text-xs font-bold text-slate-500 mb-1.5">
                        <span className="font-mono text-[#0066FF] font-black">{activeTaxRate}%</span>
                        <span>{t.taxLabel}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="30"
                        value={activeTaxRate}
                        onChange={(e) => setOverrideTaxPercent(parseInt(e.target.value))}
                        className="w-full accent-blue-600 cursor-pointer"
                        id="slider-tax"
                      />
                    </div>

                    <button
                      onClick={() => {
                        setOverrideDutyPercent(null);
                        setOverrideTaxPercent(null);
                      }}
                      className="w-full py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 rounded-xl transition-all cursor-pointer"
                      id="btn-reset-sliders"
                    >
                      {lang === 'ku' ? "گەڕانەوە بۆ ڕێژە فەرمییەکان" : "إعادة التعيين للنسب الرسمية الاتحادية"}
                    </button>
                  </div>

                  <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex gap-3 text-right">
                    <div className="flex-1">
                      <span className="block text-[10px] text-emerald-600 font-extrabold uppercase mb-1">{t.dutiesBurden}</span>
                      <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                        {t.fiscalValidation}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ==================== STEP 3: SECURITY & COMPLIANCE TIMELINE ==================== */}
            {activeStep === 2 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start" id="view-step-2">
                {/* Audit Checklist Card */}
                <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-3xs spacing-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 select-none">
                    <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-red-500 animate-pulse" />
                      {t.complianceSummary}
                    </h3>
                    <Badge className="bg-emerald-500/15 text-emerald-600 text-xs font-black">
                      {scenarioState.compliance.riskLevel === 'LOW' ? t.riskLevelLow : scenarioState.compliance.riskLevel === 'MEDIUM' ? t.riskLevelMedium : t.riskLevelHigh}
                    </Badge>
                  </div>

                  {/* Verification Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 text-right">
                    <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-850 flex justify-between items-center">
                      <span className="text-[10px] text-emerald-600 font-black">{t.checkedPass}</span>
                      <div className="text-right">
                        <span className="block text-xs font-black text-slate-800 dark:text-slate-200">{t.sanctionsNotDetected}</span>
                        <span className="text-[10px] text-slate-400 font-mono">No restricted trade logs</span>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-850 flex justify-between items-center">
                      <span className="text-[10px] text-emerald-600 font-black">{t.allChecked}</span>
                      <div className="text-right">
                        <span className="block text-xs font-black text-slate-800 dark:text-slate-200">{t.documentCompleted}</span>
                        <span className="text-[10px] text-slate-400 font-mono">All crucial permits validated</span>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-850 flex justify-between items-center">
                      <span className="text-[10px] text-emerald-600 font-black">{t.checkedPass}</span>
                      <div className="text-right">
                        <span className="block text-xs font-black text-slate-800 dark:text-slate-200">{t.classificationValid}</span>
                        <span className="text-[10px] text-slate-400 font-mono">HS accuracy matching 96%</span>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-850 flex justify-between items-center">
                      <span className="text-[10px] text-emerald-600 font-black">{t.allowedStatus}</span>
                      <div className="text-right">
                        <span className="block text-xs font-black text-slate-800 dark:text-slate-200">{t.importAllowed}</span>
                        <span className="text-[10px] text-slate-400 font-mono">Permitted import queue</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-850 pt-4 mt-4 space-y-1 text-right">
                    <span className="block text-[10px] text-slate-400 font-bold uppercase">{t.sovereignLocks}</span>
                    <ul className="list-disc pr-5 text-slate-500 text-xs space-y-1 font-serif">
                      {scenarioState.compliance.securityNotes.map((note, idx) => (
                        <li key={idx} className="font-semibold">{note}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Audit Terminal Real-Time Simulator */}
                <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-md flex flex-col gap-4 text-right">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <button
                      onClick={runSimulatedComplianceAudit}
                      className="px-2 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Terminal className="w-3.5 h-3.5" />
                      <span>{t.reScan}</span>
                    </button>
                    <span className="text-xs text-slate-400 font-bold flex items-center gap-1.5">
                      {t.logsTitle}
                      <Lock className="w-3.5 h-3.5 text-blue-500" />
                    </span>
                  </div>

                  {/* Visual Log Output Console */}
                  <div className="h-44 bg-slate-950 p-4 rounded-xl border border-slate-850 font-mono text-[10px] text-slate-300 overflow-y-auto flex flex-col gap-1 text-left select-text custom-scrollbar">
                    {complianceAuditing && (
                      <div className="text-blue-400 text-right font-black mb-1.5 animate-pulse">
                        ⌛ {t.scanningLogs}
                      </div>
                    )}
                    {complianceLogs.map((log, i) => (
                      <div key={i} className="leading-4 border-l-2 border-slate-800 pl-2">
                        {log}
                      </div>
                    ))}
                    {!complianceAuditing && complianceLogs.length !== 0 && (
                      <div className="text-emerald-500 text-right font-black mt-2">
                        [SECURE] ✓ {t.secureStatus}
                      </div>
                    )}
                  </div>

                  {/* Progress Line */}
                  <div className="relative">
                    <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                      <div 
                        style={{ width: `${auditProgress}%` }}
                        className="h-full bg-gradient-to-r from-blue-500 to-amber-500 rounded-full transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ==================== STEP 4: HARD DOCUMENTATION LOCKER ==================== */}
            {activeStep === 3 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start" id="view-step-3">
                {/* List of files in the cargo envelope */}
                <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-3xs space-y-4">
                  <div className="flex flex-col sm:flex-row items-baseline sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4 text-blue-500" />
                      {t.documentsTitle}
                    </h3>
                    <span className="text-[10px] font-bold text-slate-400">
                      {t.uploadedCount}: {uploadProgressCount}/{activeDocuments.length} ({documentPercent}%)
                    </span>
                  </div>

                  <div className="space-y-2">
                    {activeDocuments.map((doc) => {
                      const isSelected = selectedDocId === doc.id;
                      
                      return (
                        <button
                          key={doc.id}
                          onClick={() => setSelectedDocId(doc.id)}
                          className={cn(
                            "w-full text-right p-4 border rounded-2xl transition-all flex justify-between items-center cursor-pointer",
                            isSelected 
                              ? "bg-slate-50 border-blue-600 dark:bg-slate-950 dark:border-[#0066FF]" 
                              : "bg-white border-slate-100 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-850"
                          )}
                          id={`btn-document-${doc.id}`}
                        >
                          <span className={cn(
                            "px-2.5 py-1 text-[10px] font-black rounded-lg uppercase tracking-wider",
                            doc.status === 'APPROVED' && "bg-emerald-500/10 text-emerald-600",
                            doc.status === 'PENDING' && "bg-amber-500/10 text-amber-600",
                            doc.status === 'REJECTED' && "bg-red-500/10 text-red-600",
                            doc.status === 'UPLOADED' && "bg-blue-500/10 text-blue-600"
                          )}>
                            {doc.status === 'APPROVED' ? t.docApproved : doc.status === 'PENDING' ? t.docPending : t.docUploaded}
                          </span>
                          <div className="text-right">
                            <span className="text-xs font-extrabold text-slate-900 dark:text-white block">{doc.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono block mt-0.5">{doc.id.toUpperCase()}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Inline control status toggle for officials */}
                <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-3xs space-y-4 text-right">
                  {(() => {
                    const doc = activeDocuments.find(d => d.id === selectedDocId);
                    if (!doc) return <p className="text-slate-400 text-xs">No doc selected</p>;

                    return (
                      <div className="space-y-4" id="document-detail-panel">
                        <div>
                          <span className="text-[10px] text-slate-400 font-extrabold uppercase block mb-1">
                            {lang === 'ku' ? "ناسنامەی بەڵگەنامەی دیاریکراو" : "هوية وثيقة الاستيراد المحددة"}
                          </span>
                          <h4 className="text-sm font-black text-slate-900 dark:text-white capitalize">{doc.name}</h4>
                          <p className="text-xs text-slate-500 leading-relaxed font-semibold mt-1 bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-850">
                            {doc.description}
                          </p>
                        </div>

                        <hr className="border-slate-150 dark:border-slate-850" />

                        <div>
                          <span className="block text-[10px] text-slate-500 font-black uppercase mb-3">{t.docHelp}</span>
                          
                          <div className="flex flex-col gap-2">
                            <button
                              onClick={() => handleToggleDocStatus(doc.id, 'APPROVED')}
                              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer truncate"
                              id={`btn-doc-approve-${doc.id}`}
                            >
                              ✓ {t.approveDoc}
                            </button>

                            <button
                              onClick={() => handleToggleDocStatus(doc.id, 'REJECTED')}
                              className="px-4 py-2.5 bg-red-600 hover:bg-red-750 text-white rounded-xl text-xs font-bold transition-all cursor-pointer truncate"
                              id={`btn-doc-reject-${doc.id}`}
                            >
                              ✗ {t.rejectDoc || "Reject Integrity"}
                            </button>

                            <button
                              onClick={() => handleToggleDocStatus(doc.id, 'PENDING')}
                              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-750 dark:text-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer truncate"
                              id={`btn-doc-pending-${doc.id}`}
                            >
                              {lang === 'ku' ? "گەڕانەوە بۆ چاوەڕوانی" : "إرجاع لحالة الانتظار"}
                            </button>
                          </div>
                        </div>

                        {/* Progress Meter Gauge */}
                        <div className="border-t border-slate-100 dark:border-slate-850 pt-4">
                          <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1.5">
                            <span>{uploadProgressCount}/{activeDocuments.length} Verified</span>
                            <span>{t.progressVerification}</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div 
                              style={{ width: `${documentPercent}%` }}
                              className="h-full bg-emerald-500 rounded-full transition-all"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* ==================== STEP 5: GEOGRAPHIC LOGISTICS ROUTING ==================== */}
            {activeStep === 4 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start" id="view-step-4">
                {/* Visual Route Timeline Map */}
                <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-3xs space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 select-none">
                    <h3 className="text-xs font-black text-[#071739] dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Compass className="w-4 h-4 text-blue-500 animate-spin" />
                      {t.logisticsTitle}
                    </h3>
                    <Badge className="bg-[#0066FF]/10 text-[#0066FF] text-[10px] font-mono font-black">
                      GPS ACCREDITED
                    </Badge>
                  </div>

                  {/* Vertical interactive timeline */}
                  <div className="relative border-r-2 border-slate-100 dark:border-slate-800 pr-6 space-y-6 flex flex-col items-stretch text-right font-semibold" id="logistics-timeline-rail">
                    {scenarioState.logistics.timeline.map((node) => {
                      const isComplete = node.status === 'COMPLETED';
                      const isCurrent = node.status === 'IN_TRANSIT';

                      return (
                        <div key={node.id} className="relative">
                          {/* Circle dot stamp */}
                          <div className={cn(
                            "absolute -right-[31px] top-0.5 w-4 h-4 rounded-full border-2 transition-all flex items-center justify-center bg-white dark:bg-slate-900",
                            isComplete && "bg-emerald-500 border-emerald-500",
                            isCurrent && "border-[#0066FF] animate-pulse scale-110",
                            !isComplete && !isCurrent && "border-slate-300"
                          )}>
                            {isCurrent && <div className="w-1.5 h-1.5 rounded-full bg-[#0066FF]" />}
                          </div>

                          <div>
                            <div className="flex flex-wrap items-baseline justify-end gap-2">
                              <span className="text-[10px] text-slate-400 font-mono">+{node.daysOffset} Day(s)</span>
                              <span className="text-xs text-slate-500 font-serif">{node.location}</span>
                              <h4 className={cn(
                                "text-xs font-black",
                                isComplete && "text-slate-900 dark:text-white",
                                isCurrent && "text-[#0066FF] font-black",
                                !isComplete && !isCurrent && "text-slate-400"
                              )}>
                                {node.stageName}
                              </h4>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-1 max-w-xl self-end leading-relaxed">
                              {node.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Logistics metadata indicators card */}
                <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-3xs space-y-4 text-right">
                  <h4 className="text-xs font-black text-[#071739] dark:text-white uppercase tracking-wider border-b pb-2 select-none">
                    {lang === 'ku' ? "تێبینییەکانی گەیاندن" : "محددات تتبع النقل"}
                  </h4>

                  <div className="space-y-3.5 text-xs text-slate-600 dark:text-slate-400">
                    <div>
                      <span className="block text-[10px] text-slate-500 font-bold mb-0.5">{t.overallRoute}</span>
                      <span className="font-bold text-slate-950 dark:text-slate-100">{scenarioState.logistics.origin} ➔ {scenarioState.logistics.destination}</span>
                    </div>

                    <div>
                      <span className="block text-[10px] text-slate-550 font-bold mb-0.5">{t.estimatedETA}</span>
                      <span className="font-mono text-amber-600 font-black text-sm">{scenarioState.logistics.etaDays} {t.etaDays}</span>
                    </div>

                    <div>
                      <span className="block text-[10px] text-slate-500 font-bold mb-0.5">{t.routeConfidence}</span>
                      <span className="font-mono font-bold text-emerald-600">{scenarioState.logistics.routeConfidence}% System assurance</span>
                    </div>

                    <div>
                      <span className="block text-[10px] text-slate-500 font-bold mb-0.5">{t.shippingCarrier}</span>
                      <span className="font-bold text-slate-700 dark:text-slate-300">{scenarioState.logistics.shippingLine}</span>
                    </div>

                    <div>
                      <span className="block text-[10px] text-slate-500 font-bold mb-0.5">{t.containerType}</span>
                      <span className="font-mono font-bold">{scenarioState.logistics.containerType}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ==================== STEP 6: CHANCELLOR CABINET BOARD ==================== */}
            {activeStep === 5 && (
              <div className="grid grid-cols-1 gap-6" id="view-step-5">
                {/* 3 Large Metric Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-3xs text-right flex flex-col gap-1 justify-between">
                    <div className="flex justify-between items-center">
                      <Coins className="w-5 h-5 text-amber-500" />
                      <span className="text-[10px] text-slate-500 font-black uppercase tracking-wider">{t.totalEscrow}</span>
                    </div>
                    <span className="text-3xl font-extrabold text-[#071739] dark:text-white font-mono mt-3">
                      ${calculatedTotal.toLocaleString()}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-1">Calculated revenue yield for treasury</p>
                  </div>

                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-3xs text-right flex flex-col gap-1 justify-between">
                    <div className="flex justify-between items-center">
                      <Clock className="w-5 h-5 text-[#0066FF]" />
                      <span className="text-[10px] text-slate-500 font-black uppercase tracking-wider">{t.estimatedETA}</span>
                    </div>
                    <span className="text-3xl font-extrabold text-[#071739] dark:text-white font-mono mt-3">
                      {scenarioState.logistics.etaDays} {t.etaDays}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-1">Sovereign transit threshold</p>
                  </div>

                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-3xs text-right flex flex-col gap-1 justify-between">
                    <div className="flex justify-between items-center">
                      <ShieldAlert className="w-5 h-5 text-emerald-500" />
                      <span className="text-[10px] text-slate-500 font-black uppercase tracking-wider">{t.riskRating}</span>
                    </div>
                    <span className="text-3xl font-extrabold text-[#071739] dark:text-white font-mono mt-3">
                      {scenarioState.compliance.riskScore}/100
                    </span>
                    <p className="text-[10px] text-emerald-600 font-bold mt-1 uppercase tracking-wider">{scenarioState.compliance.riskLevel} IMPORTS PROFILE</p>
                  </div>
                </div>

                {/* Executive summary block and key interactive commands */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Left segment - minister report summary */}
                  <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-3xs text-right space-y-4">
                    <div className="border-b border-slate-100 dark:border-slate-850 pb-3">
                      <span className="text-[10px] text-[#0066FF] font-black uppercase tracking-widest block">{t.decisionSupport}</span>
                      <h3 className="text-sm font-black text-slate-900 dark:text-white mt-0.5">{t.executiveSummary}</h3>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-semibold bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-850">
                      {lang === 'ku'
                        ? `ڕاپۆرتی پێداچوونەوە پیشان دەدات کە ئەم هاوردەکردنە لە وڵاتی (${inputState.originCountry})یەک دەکەوێتەوە لەگەڵ مەرجە گشتییەکانی گومرگی فیدراڵی بۆ پاراستنی هاووڵاتیان. بڕی فاکتۆر بە CIF خەمڵێنراوە و گومرگی لێ وەردەگیرێت بەپێی کەتەگۆری پێشنیارکراو بە کۆدی (${scenarioState.analysis.hsSuggestedCode}). بارەکە هیی هیچ جۆرە گواستنەوەیەکی قەدەغەکراو یان گوماناوی تێدا نییە.`
                        : `يظهر تقييم المخالفات والأنظمة الفيدرالية أن هذه الشحنة المصدرة من (${inputState.originCountry}) متطابقة تماماً مع أحكام وشروط وزارة المالية العراقية. تم تقييم الشحنة جمركياً بالكامل واستيفاء رسومها المطلوبة وفق الرمز الجمركي الفيدرالي المعتمد (${scenarioState.analysis.hsSuggestedCode}). المعاملة مستوفية لكافة الشروط والمستندات الرقابية للأمن القومي ولا يوجد أي مانع حكومي للافراج.`
                      }
                    </p>

                    <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                      <div className="flex items-center justify-end gap-1.5 text-xs text-emerald-600 font-black mb-1">
                        {t.systemRecommendation}
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      </div>
                      <p className="text-[11px] text-slate-500 leading-normal font-semibold">
                        {scenarioState.compliance.riskScore < 25 ? t.greenLaneRecommend : t.heavyWarningRecommend}
                      </p>
                    </div>
                  </div>

                  {/* Right segment - action console suitable for ministries */}
                  <div className="lg:col-span-4 bg-slate-900 text-white rounded-3xl p-6 shadow-md border border-slate-800 space-y-4 text-right">
                    <h3 className="text-xs font-black text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center justify-end gap-1.5">
                      {t.actionsTitle}
                      <Lock className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
                    </h3>

                    <div className="flex flex-col gap-2.5 pt-2">
                      {/* ASSESSMENT SIMULATOR BUTTON */}
                      <button
                        onClick={() => setIsSimulatorOpen(true)}
                        className="w-full py-3.5 px-4 bg-[#0066FF] hover:bg-blue-700 text-white rounded-xl text-xs font-black transition-all cursor-pointer shadow-md tracking-wider flex items-center justify-center gap-2"
                        id="btn-trigger-simulator"
                      >
                        <Cpu className="w-4 h-4 text-white animate-spin" />
                        <span>{t.executiveAssessmentBtn}</span>
                      </button>

                      {/* REPORT GENERATOR BUTTON */}
                      <button
                        onClick={() => setIsReportOpen(true)}
                        className="w-full py-3.5 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-black transition-all cursor-pointer shadow-md tracking-wider flex items-center justify-center gap-2 border border-amber-500/20"
                        id="btn-trigger-report"
                      >
                        <Printer className="w-4 h-4" />
                        <span>{t.reportGeneratorBtn}</span>
                      </button>

                      <button
                        onClick={() => setActiveStep(0)}
                        className="w-full py-3 px-4 bg-transparent hover:bg-white/5 text-slate-400 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer border border-slate-800 text-center"
                        id="btn-reclassify-step"
                      >
                        {t.reclassify}
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* Stepper Wizard Navigation Controls Footer */}
            <div className="flex justify-between items-center border-t border-slate-100 dark:border-slate-850 pt-5 select-none" id="assistant-footer-navigation">
              <button
                disabled={activeStep === 0}
                onClick={() => setActiveStep(prev => Math.max(0, prev - 1))}
                className={cn(
                  "px-4 py-2 text-xs font-black cursor-pointer rounded-xl transition-all border outline-none flex items-center gap-1.5",
                  activeStep === 0 
                    ? "opacity-40 border-slate-200 text-slate-300 dark:border-slate-800 dark:text-slate-700 cursor-not-allowed" 
                    : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300"
                )}
                id="btn-step-prev"
              >
                <ArrowLeft className="w-4 h-4" />
                {lang === 'ku' ? "گەڕانەوە" : "السابق"}
              </button>

              <button
                disabled={activeStep === STEPS.length - 1}
                onClick={() => setActiveStep(prev => Math.min(STEPS.length - 1, prev + 1))}
                className={cn(
                  "px-4 py-2 text-xs font-black cursor-pointer rounded-xl transition-all border outline-none flex items-center gap-1.5",
                  activeStep === STEPS.length - 1
                    ? "opacity-40 border-slate-200 text-slate-300 dark:border-slate-800 dark:text-slate-700 cursor-not-allowed"
                    : "bg-amber-600 hover:bg-amber-700 text-white border-amber-600"
                )}
                id="btn-step-next"
              >
                {lang === 'ku' ? "هەنگاوی دواتر" : "التالي"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </motion.div>
        </AnimatePresence>
      </div>

      {/* ONE-CLICK ASSESSMENT SIMULATION MODAL OVERLAY */}
      <IntelligenceAssessmentSimulator 
        isOpen={isSimulatorOpen} 
        onClose={() => setIsSimulatorOpen(false)}
        scenarioState={scenarioState}
      />

      {/* SOVEREIGN REPORT COMPILER DIALOG OVERLAY */}
      <ReportGeneratorModal 
        isOpen={isReportOpen} 
        onClose={() => setIsReportOpen(false)} 
        scenarioState={scenarioState}
        activeDocuments={activeDocuments}
        activeDutyRate={activeDutyRate}
        activeTaxRate={activeTaxRate}
        calculatedDutyAmt={calculatedDutyAmt}
        calculatedTaxAmt={calculatedTaxAmt}
        calculatedTotal={calculatedTotal}
      />

    </div>
  );
}
