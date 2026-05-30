import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cpu, 
  Layers, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
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
  
  // Interactive custom controls: Users can tweak values to see live outcomes
  const [overrideDutyPercent, setOverrideDutyPercent] = useState<number | null>(null);
  const [overrideTaxPercent, setOverrideTaxPercent] = useState<number | null>(null);
  
  // Toggles: allow users to approve/upload/reject mock cargo docs
  const [activeDocuments, setActiveDocuments] = useState<RequiredDocument[]>(scenarioState.documents);
  const [selectedDocId, setSelectedDocId] = useState<string>('doc_1');

  // Compliance audit animation simulation
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

  // Run initial log filling on step entrance (Step 4 is activeStep === 3)
  useEffect(() => {
    if (activeStep === 3 && complianceLogs.length === 0) {
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

  // Document Status helper mappings for UI specification
  const getDocumentStatusLabel = (status: 'PENDING' | 'UPLOADED' | 'APPROVED' | 'REJECTED') => {
    if (lang === 'ku') {
      switch (status) {
        case 'PENDING': return 'کەمبوو // Missing';
        case 'UPLOADED': return 'بارکراو // Uploaded';
        case 'REJECTED': return 'لە ژێر پێداچوونەوە // Under Review';
        case 'APPROVED': return 'پەسەندکراو // Approved';
      }
    } else {
      switch (status) {
        case 'PENDING': return 'مفقود // Missing';
        case 'UPLOADED': return 'تم الرفع // Uploaded';
        case 'REJECTED': return 'قيد المراجعة // Under Review';
        case 'APPROVED': return 'تمت الموافقة // Approved';
      }
    }
  };

  const getDocumentStatusBadgeClass = (status: 'PENDING' | 'UPLOADED' | 'APPROVED' | 'REJECTED') => {
    switch (status) {
      case 'PENDING': return 'bg-amber-500/10 text-amber-600 border border-amber-500/20';
      case 'UPLOADED': return 'bg-blue-500/10 text-blue-600 border border-blue-500/20';
      case 'REJECTED': return 'bg-purple-500/10 text-purple-600 border border-purple-500/20';
      case 'APPROVED': return 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20';
    }
  };

  // Guidelines 6 Steps Mapping
  const STEPS = [
    { 
      label: lang === 'ku' ? "١. زانیاری کاڵا" : "١. معلومات المنتج", 
      desc: lang === 'ku' ? "دیاریکردنی زانیاری بنەڕەتی" : "تحديد البيانات الأساسية" 
    },
    { 
      label: lang === 'ku' ? "٢. ناسینەوەی HS" : "٢. تصنيف المنسق HS", 
      desc: lang === 'ku' ? "شیکردنەوەی پێشنیاری کۆد" : "تحليل وتصنيف الرمز الذكي" 
    },
    { 
      label: lang === 'ku' ? "٣. باج و ڕسوم" : "٣. تقدير الرسوم والضرائب", 
      desc: lang === 'ku' ? "خەمڵاندنی تێچووی گشتی" : "حساب الكلفة والضرائب" 
    },
    { 
      label: lang === 'ku' ? "٤. دڵنیابوونەوە لە پابەندبوون" : "٤. التحقق من الامتثال", 
      desc: lang === 'ku' ? "پشکنینی ئاسایش و ڕێکار" : "التدقيق الأمني الفيدرالي" 
    },
    { 
      label: lang === 'ku' ? "٥. بەڵگەنامە پێویستەکان" : "٥. المستندات المطلوبة", 
      desc: lang === 'ku' ? "دۆخی ئەرشیفی داواکراو" : "خزانة الملفات والمستندات" 
    },
    { 
      label: lang === 'ku' ? "٦. کورتەی ڕەزامەندی" : "٦. ملخص الموافقة النهائية", 
      desc: lang === 'ku' ? "کابینەی قەراری وەزاری" : "المقصورة التنفيذية للقرار" 
    }
  ];

  // Progress Indicators values
  const getStepStatusAndName = () => {
    switch (activeStep) {
      case 0:
        return lang === 'ku' 
          ? "ئامادەکردنی زانیاری بنەڕەتی کاڵا" 
          : "إعداد مسودة البيانات الأساسية للمنتج (Drafting Product Info)";
      case 1:
        return lang === 'ku' 
          ? "شیکردنەوەی کۆدی گومرگی بە زیرەکی دەستکرد" 
          : "تحليل وتصنيف الرمز الجمركي بالذكاء الاصطناعي (AI Hs Classification)";
      case 2:
        return lang === 'ku' 
          ? "خەمڵاندن و پێداچوونەوەی باج و ڕسومی دارایی" 
          : "احتساب الرسوم الجمركية والضرائب الاتحادية (Duties Estimation)";
      case 3:
        return lang === 'ku' 
          ? "هەڵسەنگاندنی ئاسایشی و پشکنینی نێودەوڵەتی" 
          : "التدقيق الأمني وتحليل مخاطر الامتثال (Compliance Audit)";
      case 4:
        return lang === 'ku' 
          ? "پشکنین و هەڵسەنگاندنی بەڵگەنامە ڕێکخراوەییەکان" 
          : "مراجعة وتدقيق المستندات والوثائق المطلوبة (Document Vault)";
      case 5:
        return lang === 'ku' 
          ? "کابینەی فەرمی بۆ قەراری کۆتایی و ڕەزامەندی" 
          : "المعلومات التنفيذية للموافقة والقرار النهائي (Executive Release)";
      default:
        return "";
    }
  };

  const completionPercentage = Math.round(((activeStep + 1) / 6) * 100);

  return (
    <div className="flex flex-col gap-6" id="ai-customs-assistant-root">
      
      {/* Sovereign National Brand Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 border-2 border-[#1E293B] text-white p-5 rounded-3xl animate-fade-in" id="assistant-masthead">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-2xl border border-amber-500/20">
            <Scale className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] bg-amber-500 text-slate-950 font-black px-2 py-0.5 rounded-md tracking-wider uppercase">
                {t.demoBadge}
              </span>
              <span className="text-[9px] text-slate-400 font-mono font-bold">VER. 2026.01</span>
            </div>
            <h1 className="text-sm sm:text-base font-black tracking-tight mt-0.5">{t.title}</h1>
            <p className="text-[10px] text-slate-400 font-medium leading-normal">{t.platformSubtitle}</p>
          </div>
        </div>

        {/* Central i18n Switcher */}
        <div className="shrink-0 flex items-center gap-2">
          <LanguageSwitcher />
        </div>
      </div>

      {/* Progress Indicator Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-3xs flex flex-col md:flex-row md:items-center justify-between gap-4 select-none" id="progress-indicator-panel">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs border border-blue-150 dark:border-blue-900">
            #{activeStep + 1}
          </div>
          <div className="text-right">
            <div className="text-[9px] uppercase font-bold text-slate-400">
              {lang === 'ku' ? "موقعیەتی رەوتی هەنگاوەکان" : "مؤشر تقدم المعاملة الاتحادية"}
            </div>
            <div className="text-xs font-black text-slate-700 dark:text-slate-200">
              {getStepStatusAndName()}
            </div>
          </div>
        </div>
        <div className="flex-1 max-w-sm flex flex-col gap-1.5 md:items-end">
          <div className="flex justify-between w-full text-[10px] font-mono font-bold text-slate-500">
            <span>{lang === 'ku' ? `هەنگاوی ${activeStep + 1} لە ٦` : `الخطوة ${activeStep + 1} من ٦`}</span>
            <span>{lang === 'ku' ? `${completionPercentage}% تەواوبووە` : `${completionPercentage}% مكتمل`}</span>
          </div>
          <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div 
              style={{ width: `${completionPercentage}%` }}
              className="h-full bg-gradient-to-r from-blue-600 to-[#0066FF] rounded-full transition-all duration-300"
            />
          </div>
        </div>
      </div>

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
                  className="flex items-center gap-2 text-right focus:outline-none cursor-pointer group shrink-0"
                  id={`btn-step-rail-${idx}`}
                >
                  <div className={cn(
                    "w-7 h-7 rounded-lg flex items-center justify-center font-bold text-[11px] border transition-all",
                    isCompleted && "bg-blue-600 text-white border-blue-600 shadow-sm",
                    isActive && "bg-slate-900 text-white border-slate-900 dark:bg-blue-600 dark:border-blue-600 ring-2 ring-blue-500/15",
                    !isActive && !isCompleted && "bg-white border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-500"
                  )}>
                    {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5 text-white" /> : idx + 1}
                  </div>
                  <div className="text-right">
                    <h3 className={cn(
                      "text-[9px] font-black tracking-tight uppercase whitespace-nowrap",
                      isActive ? "text-slate-900 dark:text-white" : "text-slate-400 dark:text-slate-500"
                    )}>
                      {step.label}
                    </h3>
                    <p className="text-[8px] text-slate-400 dark:text-slate-500 leading-none mt-0.5 whitespace-nowrap">{step.desc}</p>
                  </div>
                </button>
                {idx < STEPS.length - 1 && (
                  <div className={cn(
                    "flex-1 h-[1.5px] mx-1 max-w-[24px] rounded-full",
                    idx < activeStep ? "bg-blue-500" : "bg-slate-200 dark:bg-slate-800"
                  )} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Main Workspace Render Space */}
      <div className="min-h-[480px]" id="step-render-view">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="grid grid-cols-1 gap-6"
          >
            
            {/* ==================== STEP 1: PRODUCT INFORMATION ==================== */}
            {activeStep === 0 && (
              <div className="grid grid-cols-1 gap-6 items-start" id="view-step-0">
                
                {/* Scenario quick picker */}
                <GlassCard className="p-5 border border-slate-200 dark:border-slate-800 bg-white/75 dark:bg-slate-900/40 shadow-3xs flex flex-col gap-3">
                  <div className="flex flex-col sm:flex-row items-baseline sm:items-center justify-between gap-1 border-b border-slate-100 dark:border-slate-800 pb-2">
                    <div>
                      <h2 className="text-xs font-black text-[#071739] dark:text-white uppercase tracking-tight flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        {t.scenarioLabel}
                      </h2>
                      <p className="text-[9px] text-slate-500 font-semibold">{t.scenarioHelp}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2 w-full">
                    {(Object.keys(MOCK_SCENARIOS) as Array<keyof typeof MOCK_SCENARIOS>).map((key) => {
                      const scText = t.scenarios[key];
                      const isSelected = selectedTemplate === key;

                      return (
                        <button
                          key={key}
                          onClick={() => handleTemplateSelection(key)}
                          className={cn(
                            "px-3 py-2.5 text-right text-xs rounded-xl border transition-all cursor-pointer flex flex-col items-start gap-1 justify-between",
                            isSelected
                              ? "bg-slate-900 text-white border-slate-900 dark:bg-slate-800 dark:border-slate-750 shadow-xs ring-2 ring-blue-500/10"
                              : "bg-white border-slate-200/80 text-slate-700 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-805 dark:text-slate-300 shadow-3xs"
                          )}
                          id={`btn-scenario-${key}`}
                        >
                          <span className="font-mono text-[8px] font-bold text-slate-400 dark:text-slate-500 tracking-wider">
                            {scText.route}
                          </span>
                          <span className="font-extrabold line-clamp-1 text-right w-full text-[10px] mt-0.5">
                            {scText.title}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </GlassCard>

                {/* Left Form: Product Info entry */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-3xs flex flex-col gap-4 max-w-4xl mx-auto w-full">
                  <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2.5 select-none">
                    <span className="w-1.5 h-3 rounded bg-[#0066FF]" />
                    {t.formTitle}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-right">
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">{t.formProdName}</label>
                      <input
                        type="text"
                        value={inputState.productName}
                        onChange={(e) => setInputState(prev => ({ ...prev, productName: e.target.value }))}
                        className="w-full text-xs font-bold border border-slate-200 dark:border-slate-800 focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] px-3 py-2 rounded-lg outline-none bg-transparent"
                        required
                        id="input-product-name"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">{t.formProdDesc}</label>
                      <textarea
                        value={inputState.productDescription}
                        onChange={(e) => setInputState(prev => ({ ...prev, productDescription: e.target.value }))}
                        rows={3}
                        className="w-full text-xs font-bold border border-slate-200 dark:border-slate-800 focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] p-3 rounded-lg outline-none leading-relaxed bg-transparent"
                        required
                        id="input-product-desc"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">{t.formQuantity}</label>
                      <input
                        type="number"
                        value={inputState.quantity}
                        onChange={(e) => setInputState(prev => ({ ...prev, quantity: Math.max(1, parseInt(e.target.value) || 0) }))}
                        className="w-full text-xs font-black border border-slate-200 dark:border-slate-800 focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] p-2 rounded-lg outline-none bg-transparent"
                        id="input-product-qty"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">{t.formValUSD}</label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-xs text-slate-400 font-mono font-bold">$</span>
                        <input
                          type="number"
                          value={inputState.invoiceValue}
                          onChange={(e) => setInputState(prev => ({ ...prev, invoiceValue: Math.max(1, parseInt(e.target.value) || 0) }))}
                          className="w-full text-xs font-black border border-slate-200 dark:border-slate-800 focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] pl-7 pr-3 py-2 rounded-lg outline-none text-right font-mono bg-transparent"
                          id="input-product-val"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">{t.formOrigin}</label>
                      <select
                        value={inputState.originCountry}
                        onChange={(e) => setInputState(prev => ({ ...prev, originCountry: e.target.value }))}
                        className="w-full text-xs font-bold border border-slate-200 dark:border-slate-800 focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] py-2 px-3 rounded-lg outline-none bg-white dark:bg-slate-900"
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
                      <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">{t.formTransport}</label>
                      <select
                        value={inputState.transportMethod}
                        onChange={(e) => setInputState(prev => ({ ...prev, transportMethod: e.target.value as any }))}
                        className="w-full text-xs font-bold border border-slate-200 dark:border-slate-800 focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] py-2 px-3 rounded-lg outline-none bg-white dark:bg-slate-900"
                        id="input-product-transport"
                      >
                        <option value="Sea Freight">🚢 Sea Freight Terminal</option>
                        <option value="Air Freight">✈️ Air Freight Terminal</option>
                        <option value="Land Freight">🚛 Land Freight Terminal</option>
                      </select>
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-950 rounded-xl p-3 border border-slate-150 dark:border-slate-800 flex items-center justify-between text-[9px] text-slate-400 dark:text-slate-500 font-mono mt-2">
                    <span className="flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5 text-blue-500" />
                      {t.secureEncryption}
                    </span>
                    <span>{t.secure128}</span>
                  </div>
                </div>

              </div>
            )}

            {/* ==================== STEP 2: HS CLASSIFICATION ==================== */}
            {activeStep === 1 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start" id="view-step-1">
                
                {/* AI Classification Main Result */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="bg-gradient-to-br from-[#071739] to-[#0A2540] text-white rounded-3xl p-6 shadow-md border border-slate-800 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-36 h-36 bg-[#0066FF]/10 rounded-full blur-2xl pointer-events-none" />

                    <div className="flex justify-between items-start mb-4 relative z-10">
                      <div className="p-2 bg-[#0066FF]/10 text-[#0066FF] rounded-lg border border-[#0066FF]/25 shrink-0">
                        <Cpu className="w-4 h-4 text-blue-400 animate-pulse" />
                      </div>
                      <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[9px] font-mono tracking-widest font-black py-0.5 px-2">
                        {scenarioState.analysis.confidenceScore}{t.confidenceFull}
                      </Badge>
                    </div>

                    <h4 className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1 select-none">
                      {t.decisionTitle}
                    </h4>

                    <div className="flex items-baseline gap-2 mb-4 text-right">
                      <span className="text-3xl sm:text-4xl font-black tracking-tight text-white font-mono">
                        {scenarioState.analysis.hsSuggestedCode}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold font-mono">/ (Category IV)</span>
                    </div>

                    <div className="space-y-3 font-semibold text-xs border-t border-slate-800 pt-4 relative z-10">
                      <div className="flex justify-between items-center bg-slate-950/40 p-2 rounded-lg">
                        <span className="text-slate-400 uppercase text-[8px] font-black">{t.category}</span>
                        <span className="text-slate-100 font-bold max-w-[240px] truncate">{scenarioState.analysis.productCategory}</span>
                      </div>

                      <div className="flex justify-between items-center bg-slate-950/40 p-2 rounded-lg">
                        <span className="text-slate-400 uppercase text-[8px] font-black">{t.classification}</span>
                        <span className="text-amber-500 font-bold">{scenarioState.analysis.customsClassification}</span>
                      </div>

                      <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-3.5 mt-2">
                        <div className="flex items-center gap-1.5 text-xs text-amber-500 font-black uppercase mb-1">
                          <Info className="w-4 h-4 text-amber-500" />
                          {lang === 'ku' ? "کورتەی لێکدانەوەی زیرەکی دەستکرد" : "ملخص تبرير وبراهين التصنيف (Reasoning Summary)"}
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed font-semibold">
                          {scenarioState.analysis.regulatoryNotes}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Alternative items and options list */}
                <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-3xs">
                  <h3 className="text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2 mb-3 select-none">
                    <Layers className="w-4 h-4 text-slate-400" />
                    {t.altCodes}
                  </h3>

                  <div className="space-y-2">
                    {scenarioState.analysis.alternativeCodes.map((alt) => (
                      <div
                        key={alt.code}
                        className="w-full text-right p-3 border rounded-xl border-slate-150 dark:border-slate-850 flex items-center justify-between"
                      >
                        <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono font-bold px-1.5 rounded">
                          {alt.confidence}% match
                        </span>
                        <div className="text-right">
                          <span className="font-mono text-xs font-black text-slate-800 dark:text-slate-100">{alt.code}</span>
                          <p className="text-[9px] text-slate-400 font-medium max-w-[200px] truncate">{alt.label}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* ==================== STEP 3: DUTIES & TAX ESTIMATION ==================== */}
            {activeStep === 2 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start" id="view-step-2">
                
                {/* Ledger calculations sheet */}
                <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-3xs space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 select-none">
                    <h3 className="text-xs font-black text-[#071739] dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Scale className="w-4 h-4 text-blue-500" />
                      {t.taxBreakdown}
                    </h3>
                    <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 font-mono text-[9px] font-black">
                      CIF MULTIPLIER: {scenarioState.tax.cifMultiplier}x
                    </Badge>
                  </div>

                  {/* Pricing metrics tiles */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-right">
                    <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-850">
                      <span className="text-[9px] text-slate-505 font-black uppercase tracking-wider block mb-1">{t.declaredCIF}</span>
                      <span className="text-base font-black text-[#071739] dark:text-white font-mono">
                        ${Math.round(inputState.invoiceValue * scenarioState.tax.cifMultiplier).toLocaleString()}
                      </span>
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-850">
                      <span className="text-[9px] text-slate-505 font-black uppercase tracking-wider block mb-1">{t.customsDuty} ({activeDutyRate}%)</span>
                      <span className="text-base font-black text-amber-600 font-mono">${calculatedDutyAmt.toLocaleString()}</span>
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-850">
                      <span className="text-[9px] text-slate-505 font-black uppercase tracking-wider block mb-1">{t.importTax} ({activeTaxRate}%)</span>
                      <span className="text-base font-black text-[#0066FF] font-mono">${calculatedTaxAmt.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Calculations list detail */}
                  <div className="space-y-3 bg-slate-50/50 dark:bg-slate-950/20 p-4 rounded-xl border border-slate-105 dark:border-slate-850">
                    <div className="flex justify-between items-center text-xs font-black">
                      <span className="text-slate-400 uppercase text-[8px] tracking-wide">{t.fobValue}</span>
                      <span className="font-mono text-slate-700 dark:text-slate-300">${inputState.invoiceValue.toLocaleString()} USD</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-black">
                      <span className="text-slate-400 uppercase text-[8px] tracking-wide">{t.processingFee}</span>
                      <span className="font-mono text-slate-700 dark:text-slate-300">${scenarioState.tax.processingFee} USD</span>
                    </div>
                    <hr className="border-slate-150 dark:border-slate-850" />
                    <div className="flex justify-between items-center text-xs font-black text-slate-900 dark:text-white">
                      <span>{t.totalEscrow}</span>
                      <span className="font-mono text-amber-600 text-sm">${calculatedTotal.toLocaleString()} USD</span>
                    </div>
                  </div>

                  {/* Pure Tailwind Stack Bar Chart */}
                  <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-150 dark:border-slate-850">
                    <h4 className="text-[9px] font-black text-slate-500 uppercase mb-2 text-right">{t.chartTitle}</h4>
                    
                    <div className="h-5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex">
                      <div 
                        style={{ width: `${Math.round((calculatedDutyAmt / (calculatedTotal || 1)) * 100)}%` }}
                        className="bg-amber-500 h-full hover:opacity-90 transition-opacity"
                        title="Customs Duty Portion"
                      />
                      <div 
                        style={{ width: `${Math.round((calculatedTaxAmt / (calculatedTotal || 1)) * 100)}%` }}
                        className="bg-blue-600 h-full hover:opacity-90 transition-opacity"
                        title="Import Tax Portion"
                      />
                      <div 
                        style={{ width: `${Math.round((scenarioState.tax.processingFee / (calculatedTotal || 1)) * 100)}%` }}
                        className="bg-slate-400 h-full hover:opacity-90 transition-opacity"
                        title="Processing Fees Portion"
                      />
                    </div>

                    <div className="flex flex-wrap gap-3 mt-2 text-[9px] justify-end">
                      <div className="flex items-center gap-1 font-bold">
                        <span>{t.customsDuty}</span>
                        <div className="w-2 h-2 rounded-full bg-amber-500" />
                      </div>
                      <div className="flex items-center gap-1 font-bold">
                        <span>{t.importTax}</span>
                        <div className="w-2 h-2 rounded-full bg-blue-600" />
                      </div>
                      <div className="flex items-center gap-1 font-bold">
                        <span>{t.feeLabel}</span>
                        <div className="w-2 h-2 rounded-full bg-slate-400" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Overrides sliders side-card */}
                <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-3xs space-y-4 text-right">
                  <h4 className="text-xs font-black text-[#071739] dark:text-white uppercase tracking-wider flex items-center justify-end gap-1.5 border-b pb-2 select-none">
                    {t.recalcValues}
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                  </h4>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 mb-1">
                        <span className="font-mono text-[#0066FF] font-black">{activeDutyRate}%</span>
                        <span>{t.dutyLabel}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="40"
                        value={activeDutyRate}
                        onChange={(e) => setOverrideDutyPercent(parseInt(e.target.value))}
                        className="w-full accent-amber-500 cursor-pointer text-slate-300"
                        id="slider-duty"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 mb-1">
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
                      className="w-full py-2 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 hover:bg-slate-250 dark:bg-slate-800 dark:hover:bg-slate-750 rounded-lg transition-all cursor-pointer"
                      id="btn-reset-sliders"
                    >
                      {lang === 'ku' ? "گەڕانەوە بۆ ڕێژە فەرمییەکان" : "إعادة التعيين للنسب الرسمية الاتحادية"}
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* ==================== STEP 4: COMPLIANCE VALIDATION ==================== */}
            {activeStep === 3 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start" id="view-step-3">
                
                {/* Sanctions & checks checklist */}
                <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-3xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5 select-none">
                    <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-red-500" />
                      {t.complianceSummary}
                    </h3>
                    <Badge className="bg-emerald-500/15 text-emerald-600 text-xs font-black">
                      {scenarioState.compliance.riskLevel === 'LOW' ? t.riskLevelLow : scenarioState.compliance.riskLevel === 'MEDIUM' ? t.riskLevelMedium : t.riskLevelHigh}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-right">
                    <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-850 flex justify-between items-center">
                      <span className="text-[9px] text-emerald-600 font-black">{t.checkedPass}</span>
                      <div className="text-right">
                        <span className="block text-xs font-black text-slate-800 dark:text-slate-200">{t.sanctionsNotDetected}</span>
                        <span className="text-[9px] text-slate-400 font-mono">No restricted trade logs</span>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-850 flex justify-between items-center">
                      <span className="text-[9px] text-emerald-600 font-black">{t.allChecked}</span>
                      <div className="text-right">
                        <span className="block text-xs font-black text-slate-800 dark:text-slate-200">{t.documentCompleted}</span>
                        <span className="text-[9px] text-slate-400 font-mono">All crucial permits validated</span>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-850 flex justify-between items-center">
                      <span className="text-[9px] text-emerald-600 font-black">{t.checkedPass}</span>
                      <div className="text-right">
                        <span className="block text-xs font-black text-slate-800 dark:text-slate-200">{t.classificationValid}</span>
                        <span className="text-[9px] text-slate-400 font-mono">HS accuracy matching 96%</span>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-850 flex justify-between items-center">
                      <span className="text-[9px] text-emerald-600 font-black">{t.allowedStatus}</span>
                      <div className="text-right">
                        <span className="block text-xs font-black text-slate-800 dark:text-slate-200">{t.importAllowed}</span>
                        <span className="text-[9px] text-slate-400 font-mono">Permitted import queue</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-850 pt-3 mt-3 space-y-1 text-right">
                    <span className="block text-[9px] text-slate-400 font-bold uppercase">{t.sovereignLocks}</span>
                    <ul className="list-disc pr-4 text-slate-550 text-xs space-y-1 font-sans">
                      {scenarioState.compliance.securityNotes.map((note, idx) => (
                        <li key={idx} className="font-semibold text-slate-600 dark:text-slate-400 text-[11px]">{note}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Audit Terminal Real-Time logs console */}
                <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-md flex flex-col gap-4 text-right">
                  <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                    <button
                      onClick={runSimulatedComplianceAudit}
                      className="px-2 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border border-amber-500/20"
                    >
                      <Terminal className="w-3.0 h-3.0" />
                      <span>{t.reScan}</span>
                    </button>
                    <span className="text-xs text-slate-400 font-bold flex items-center gap-1.5">
                      {t.logsTitle}
                      <Lock className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
                    </span>
                  </div>

                  {/* Text stream */}
                  <div className="h-40 bg-slate-950 p-4 rounded-xl border border-slate-850 font-mono text-[9px] text-slate-300 overflow-y-auto flex flex-col gap-1 text-left select-text custom-scrollbar">
                    {complianceAuditing && (
                      <div className="text-blue-400 text-right font-black mb-1 animate-pulse">
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

            {/* ==================== STEP 5: REQUIRED DOCUMENTS ==================== */}
            {activeStep === 4 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start" id="view-step-4">
                
                {/* Left Listing Card */}
                <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-3xs space-y-4">
                  <div className="flex flex-col sm:flex-row items-baseline sm:items-center justify-between gap-1 border-b border-slate-100 dark:border-slate-800 pb-2.5">
                    <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4 text-blue-500" />
                      {t.documentsTitle}
                    </h3>
                    <span className="text-[10px] font-mono font-bold text-slate-500">
                      {t.uploadedCount}: {uploadProgressCount}/{activeDocuments.length} ({documentPercent}%)
                    </span>
                  </div>

                  {/* Active Document selection queue */}
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
                              : "bg-white border-slate-100 hover:bg-slate-50/50 dark:bg-slate-900 dark:border-slate-850"
                          )}
                          id={`btn-document-${doc.id}`}
                        >
                          <span className={cn(
                            "px-2 py-0.5 text-[9px] font-mono font-bold rounded-md uppercase tracking-wider",
                            getDocumentStatusBadgeClass(doc.status)
                          )}>
                            {getDocumentStatusLabel(doc.status)}
                          </span>
                          <div className="text-right">
                            <span className="text-xs font-extrabold text-slate-900 dark:text-white block">{doc.name}</span>
                            <span className="text-[9px] text-slate-400 font-mono block mt-0.5">{doc.id.toUpperCase()}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Right Verification Controls */}
                <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-3xs space-y-4 text-right">
                  {(() => {
                    const doc = activeDocuments.find(d => d.id === selectedDocId);
                    if (!doc) return <p className="text-slate-400 text-xs">No doc selected</p>;

                    return (
                      <div className="space-y-4 animate-fade-in" id="document-detail-panel">
                        <div>
                          <span className="text-[10px] text-slate-400 font-extrabold uppercase block mb-1">
                            {lang === 'ku' ? "ناسنامەی بەڵگەنامەی هەڵبژێردراو" : "هوية المستند الفيدرالي للافراج"}
                          </span>
                          <h4 className="text-xs font-black text-slate-900 dark:text-white capitalize">{doc.name}</h4>
                          <p className="text-[11px] text-slate-500 leading-relaxed font-semibold mt-1.5 bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-105 dark:border-slate-850">
                            {doc.description}
                          </p>
                        </div>

                        <hr className="border-slate-150 dark:border-slate-850" />

                        <div>
                          <span className="block text-[9px] text-slate-500 font-black uppercase mb-3">{t.docHelp}</span>
                          
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() => handleToggleDocStatus(doc.id, 'APPROVED')}
                              className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer truncate"
                              id={`btn-doc-approve-${doc.id}`}
                            >
                              ✓ {lang === 'ku' ? "پەسەندکردن" : "موافقة"} 
                            </button>

                            <button
                              onClick={() => handleToggleDocStatus(doc.id, 'REJECTED')}
                              className="px-3 py-2 bg-purple-600 hover:bg-purple-750 text-white rounded-xl text-xs font-bold transition-all cursor-pointer truncate"
                              id={`btn-doc-reject-${doc.id}`}
                            >
                              ⚡ {lang === 'ku' ? "لەژێر پێداچوونەوە" : "قيد المراجعة"}
                            </button>

                            <button
                              onClick={() => handleToggleDocStatus(doc.id, 'UPLOADED')}
                              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer truncate"
                              id={`btn-doc-upload-${doc.id}`}
                            >
                              ⬆ {lang === 'ku' ? "بارکرد" : "تم الرفع"}
                            </button>

                            <button
                              onClick={() => handleToggleDocStatus(doc.id, 'PENDING')}
                              className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all cursor-pointer truncate"
                              id={`btn-doc-pending-${doc.id}`}
                            >
                              ? {lang === 'ku' ? "ونبوو / مفقود" : "مفقود"}
                            </button>
                          </div>
                        </div>

                        <div className="border-t border-slate-100 dark:border-slate-850 pt-3">
                          <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
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

            {/* ==================== STEP 6: FINAL APPROVAL SUMMARY ==================== */}
            {activeStep === 5 && (
              <div className="grid grid-cols-1 gap-6" id="view-step-5">
                
                {/* At completion display only: Cost, Risk, ETA, Required Documents, Compliance Score, Approval Status */}
                <div className="bg-slate-50/50 dark:bg-slate-950/20 rounded-3xl border p-6 shadow-sm border-slate-150 dark:border-slate-800">
                  <div className="text-right mb-4">
                    <span className="text-[10px] text-blue-600 font-black uppercase tracking-widest">{t.decisionSupport}</span>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white">{lang === 'ku' ? "کورتەی پەسەندکردنی کاڵاکان" : "تقرير الإفراج والموافقة الجمركية (Executive Cabinet Release)"}</h3>
                  </div>

                  {/* 6 Grid items displaying ONLY the requested values */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4" id="executive-bento-grid">
                    
                    {/* 1. Cost */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex flex-col gap-1 text-right justify-between shadow-3xs">
                      <div className="flex justify-between items-center border-b pb-1">
                        <Coins className="w-4 h-4 text-amber-500" />
                        <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider">{lang === 'ku' ? "تێچوو // Cost" : "الكلفة الإجمالية // Cost"}</span>
                      </div>
                      <span className="text-xl font-bold font-mono text-slate-905 mt-2 dark:text-white">
                        ${calculatedTotal.toLocaleString()}
                      </span>
                      <p className="text-[8px] text-slate-405 leading-none">Customs Duty, VAT & Fees</p>
                    </div>

                    {/* 2. Risk */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex flex-col gap-1 text-right justify-between shadow-3xs">
                      <div className="flex justify-between items-center border-b pb-1">
                        <ShieldAlert className="w-4 h-4 text-emerald-500" />
                        <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider">{lang === 'ku' ? "مەترسی // Risk" : "تقييم المخاطر // Risk"}</span>
                      </div>
                      <span className="text-xl font-bold font-mono text-emerald-600 mt-2">
                        {scenarioState.compliance.riskLevel}
                      </span>
                      <p className="text-[8px] text-emerald-605 leading-none">Security Sanctions Screened</p>
                    </div>

                    {/* 3. ETA */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex flex-col gap-1 text-right justify-between shadow-3xs">
                      <div className="flex justify-between items-center border-b pb-1">
                        <Clock className="w-4 h-4 text-blue-500" />
                        <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider">{lang === 'ku' ? "کات // ETA" : "الوقت المتوقع // ETA"}</span>
                      </div>
                      <span className="text-xl font-bold font-mono text-[#0066FF] mt-2">
                        {scenarioState.logistics.etaDays} {t.etaDays}
                      </span>
                      <p className="text-[8px] text-slate-405 leading-none">GPS Transit Threshold</p>
                    </div>

                    {/* 4. Required Documents */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex flex-col gap-1 text-right justify-between shadow-3xs">
                      <div className="flex justify-between items-center border-b pb-1">
                        <Briefcase className="w-4 h-4 text-purple-500" />
                        <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider">{lang === 'ku' ? "بەڵگەنامەکان // Required Docs" : "الوثائق المطلوبة // Required Docs"}</span>
                      </div>
                      <span className="text-xl font-bold font-mono mt-2 text-slate-800 dark:text-slate-100">
                        {uploadProgressCount} / {activeDocuments.length} Verified
                      </span>
                      <p className="text-[8px] text-slate-405 leading-none">{documentPercent}% Digital Verification</p>
                    </div>

                    {/* 5. Compliance Score */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex flex-col gap-1 text-right justify-between shadow-3xs">
                      <div className="flex justify-between items-center border-b pb-1">
                        <Lock className="w-4 h-4 text-slate-400" />
                        <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider">{lang === 'ku' ? "نمرەی پابەندبوون // Comp Score" : "نقاط الامتثال // Comp Score"}</span>
                      </div>
                      <span className="text-xl font-bold font-mono text-amber-600 mt-2">
                        {scenarioState.compliance.riskScore} / 100
                      </span>
                      <p className="text-[8px] text-slate-405 leading-none">Integrity Audit Passed</p>
                    </div>

                    {/* 6. Approval Status */}
                    <div className="bg-white dark:bg-slate-900 border-2 border-emerald-500/30 p-4 rounded-2xl flex flex-col gap-1 text-right justify-between shadow-3xs">
                      <div className="flex justify-between items-center border-b pb-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider">{lang === 'ku' ? "دۆخی رەزامەندی // Approval Status" : "قرار الموافقة // Approval"}</span>
                      </div>
                      <span className="text-xs font-black text-emerald-600 py-1 uppercase tracking-widest mt-2">
                        {scenarioState.compliance.riskScore < 25 ? 'GREEN LANE APPROVED // فەرمی پەسەندکراو' : 'VIP MANIFEST ALLOWED // مسموح مسبق'}
                      </span>
                      <p className="text-[8px] text-slate-405 leading-none">RELEASE ADVISORY FORTHCOMING</p>
                    </div>

                  </div>
                </div>

                {/* Narrative briefcase & Interactive Action triggers */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Left ministerial text brief summary card */}
                  <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-3xs text-right space-y-4">
                    <h3 className="text-xs font-black text-slate-900 dark:text-white border-b pb-2">{t.executiveSummary}</h3>
                    <p className="text-[11px] text-slate-600 dark:text-slate-350 leading-relaxed font-semibold bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-105 dark:border-slate-850">
                      {lang === 'ku'
                        ? `ڕاپۆرتی پێداچوونەوەی وەزاری گومرگ پیشان دەدات کە هاوردەکردن لەگەڵ مەرجە فیدراڵییەکان گونجاوە. بڕی پێویست بە CIF خەمڵێنراوە و کۆدی تاریفی فەرمی (${scenarioState.analysis.hsSuggestedCode}) لێ دەکەوێتەوە. پشکنینی گشتی مەترسی نوێی نیشان نەداوە و تیمی گومرگی بەغدا ڕێگەپێدانی تەواوی بۆ بارەکە دووپاتکردووەتەوە.`
                        : `يظهر تقييم المخالفات والأنظمة الفيدرالية أن هذه الشحنة المصدرة متطابقة تماماً مع أحكام وشروط وزارة المالية العراقية. تم تقييم الشحنة جمركياً بالكامل واستيفاء رسومها المطلوبة وفق الرمز الجمركي الفيدرالي المعتمد (${scenarioState.analysis.hsSuggestedCode}). المعاملة مستوفية لكافة الشروط والمستندات الرقابية للأمن القومي ولا يوجد أي مانع حكومي للافراج جمركياً.`
                      }
                    </p>
                    <div className="p-3.5 bg-emerald-500/5 border border-emerald-500/10 rounded-xl flex gap-1.5 items-center justify-end">
                      <span className="text-[10px] text-slate-500 font-semibold">{scenarioState.compliance.riskScore < 25 ? t.greenLaneRecommend : t.heavyWarningRecommend}</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    </div>
                  </div>

                  {/* Right segment executive options buttons */}
                  <div className="lg:col-span-4 bg-slate-900 text-white rounded-3xl p-6 shadow-md border border-slate-800 space-y-3.5 text-right">
                    <h3 className="text-xs font-black text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center justify-end gap-1.5">
                      {t.actionsTitle}
                      <Lock className="w-3.5 h-3.5 text-blue-500" />
                    </h3>

                    <div className="flex flex-col gap-2 pt-1">
                      {/* ASSESSMENT SIMULATOR */}
                      <button
                        onClick={() => setIsSimulatorOpen(true)}
                        className="w-full py-3 px-4 bg-[#0066FF] hover:bg-blue-700 text-white rounded-xl text-xs font-black transition-all cursor-pointer shadow-md tracking-wider flex items-center justify-center gap-1.5"
                        id="btn-trigger-simulator"
                      >
                        <Cpu className="w-3.5 h-3.5 text-white animate-pulse" />
                        <span>{t.executiveAssessmentBtn}</span>
                      </button>

                      {/* REPORT COMPILER */}
                      <button
                        onClick={() => setIsReportOpen(true)}
                        className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-black transition-all cursor-pointer shadow-md tracking-wider flex items-center justify-center gap-1.5 border border-amber-500/10"
                        id="btn-trigger-report"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>{t.reportGeneratorBtn}</span>
                      </button>

                      <button
                        onClick={() => setActiveStep(0)}
                        className="w-full py-2.5 px-4 bg-transparent hover:bg-white/5 text-slate-400 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer border border-slate-800 text-center"
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
            <div className="flex justify-between items-center border-t border-slate-150 dark:border-slate-800 pt-5 select-none" id="assistant-footer-navigation">
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
                <ArrowLeft className="w-3.5 h-3.5" />
                {lang === 'ku' ? "گەڕانەوە (السابق)" : "السابق (Back)"}
              </button>

              <button
                disabled={activeStep === STEPS.length - 1}
                onClick={() => setActiveStep(prev => Math.min(STEPS.length - 1, prev + 1))}
                className={cn(
                  "px-4 py-2 text-xs font-black cursor-pointer rounded-xl transition-all border outline-none flex items-center gap-1.5",
                  activeStep === STEPS.length - 1
                    ? "opacity-60 border-slate-200 text-slate-300 dark:border-slate-800 dark:text-slate-700 cursor-not-allowed bg-slate-50"
                    : "bg-blue-600 hover:bg-blue-700 text-white border-blue-600 shadow-sm"
                )}
                id="btn-step-next"
              >
                {lang === 'ku' ? "هەنگاوی داهاتوو (التالي)" : "التالي (Next)"}
                <ArrowRight className="w-3.5 h-3.5" />
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
