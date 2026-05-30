import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cpu, 
  Layers, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  FileCheck, 
  ChevronRight, 
  TrendingUp, 
  Compass, 
  Scale, 
  ShieldAlert, 
  Clock, 
  Lock, 
  Download, 
  Coins, 
  Briefcase, 
  Terminal, 
  Printer 
} from 'lucide-react';
import { GlassCard, Badge, cn } from '@idg/ui';
import { useSettingsStore } from '@/store/settingsStore';
import { calculateScenario, MOCK_SCENARIOS } from './mockData';
import { ImporterProductInput, CustomsScenario, RequiredDocument } from './types';

export function AICustomsImportAssistant() {
  const { lang } = useSettingsStore();
  const [activeStep, setActiveStep] = useState<number>(0);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('laptops');
  
  // Initialize state with default Erbil Laptops Import
  const [inputState, setInputState] = useState<ImporterProductInput>(MOCK_SCENARIOS.laptops);
  const [scenarioState, setScenarioState] = useState<CustomsScenario>(calculateScenario(MOCK_SCENARIOS.laptops));
  
  // Step 2 Interactive custom controls: Users can tweak values to see live outcomes
  const [overrideDutyPercent, setOverrideDutyPercent] = useState<number | null>(null);
  const [overrideTaxPercent, setOverrideTaxPercent] = useState<number | null>(null);
  
  // Step 4 toggles: allow users to approve/upload mock cargo docs
  const [activeDocuments, setActiveDocuments] = useState<RequiredDocument[]>(scenarioState.documents);
  const [selectedDocId, setSelectedDocId] = useState<string>('doc_1');

  // Step 3 compliance audit animation simulation
  const [complianceAuditing, setComplianceAuditing] = useState<boolean>(false);
  const [complianceLogs, setComplianceLogs] = useState<string[]>([]);
  const [auditProgress, setAuditProgress] = useState<number>(100);

  // Recalculate scenario when standard form inputs change
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
    
    const logs = [
      `[CRIT-SCAN] Connecting peer nodes to sovereign BASRA database cluster... OK`,
      `[CRIT-SCAN] Querying Central Bank of Iraq Whitelist protocols for '${inputState.originCountry}' transactions... SECURED`,
      `[CRIT-SCAN] Checking trade compliance for HS Code ${scenarioState.analysis.hsSuggestedCode}... VALID`,
      `[CRIT-SCAN] Verifying corporate entity registration with Federal Trade Department... FOUND`,
      `[CRIT-SCAN] Audits 256-bit secure SHA keys for attached electronic signatures... COMPLETE`,
      `[CRIT-SCAN] Risk valuation score processed: ${scenarioState.compliance.riskScore}/100 [LOW RISK CLEARANCE]`
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
    }, 450);
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
  const handleToggleDocStatus = (docId: string, status: 'PENDING' | 'UPLOADED' | 'APPROVED') => {
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

  // Stepper Navigation
  const STEPS = [
    { label: lang === 'ku' ? "١. دۆزینەوەی کۆد" : "1. التصنيف الجمركي", desc: lang === 'ku' ? "پۆلێنکردنی دەروازەی HS" : "تحليلات HS Code" },
    { label: lang === 'ku' ? "٢. خەمڵاندنی باج" : "2. تقدير التعرفة", desc: lang === 'ku' ? "تاریفە و باجەکان" : "الرسوم والضرائب" },
    { label: lang === 'ku' ? "٣. پشکنینی ڕێساکان" : "3. التدقيق الأمني", desc: lang === 'ku' ? "مەرج و پابەندبوون" : "الامتثال والخطورة" },
    { label: lang === 'ku' ? "٤. ناسنامەی دۆکیومێنت" : "4. لۆکەری بەڵگەنامەکان", desc: lang === 'ku' ? "پێداچوونەوەی مانیفێست" : "الوثائق المطلوبة" },
    { label: lang === 'ku' ? "٥. کاتی هێڵەکان" : "5. مسار الشحن", desc: lang === 'ku' ? "دەستنیشانکردنی ماوە" : "مسار اللوجستيات" },
    { label: lang === 'ku' ? "٦. کابینەی کارپێکردن" : "6. لوحة القيادة", desc: lang === 'ku' ? "ڕاپۆرتی گشتی" : "المقصورة التنفيذية" },
  ];

  const languages = {
    ku: {
      templateTitle: "نموونەی هاوردەکردنی مەرز (دیاریکردنی خێرا):",
      formTitle: "داواکاری مانیفێستی کاڵا لێرە بنووسە",
      prodLabel: "ناوی بەرهەم",
      descLabel: "شیکردنەوەی کاڵا",
      qtyLabel: "بڕی کاڵا (دانە)",
      origLabel: "وڵاتی بنەڕەت",
      valLabel: "نرخی فاکتۆر (FOB USD)",
      destLabel: "شار یان مەرزی کۆتایی",
      routeLabel: "ڕێگای گواستنەوە",
      decisionTitle: "بڕیاری فیدراڵی بۆ پۆلێنکردنی کاڵاکان",
      hsSuggested: "کۆدی HS ی پێشنیارکراو بە زیرەکی دەستکرد",
      confidence: "متمانەی سیستەم",
      category: "هاوپۆلی تاریفە",
      classification: "پۆلێنی گرنگی کاڵا",
      regNotes: "تێبینییە یاساییەکان",
      altCodes: "کۆدە هاوشێوەکانی دیکە",
      reanalyze: "دووبارە پۆڵێنکردنەوە",
      prev: "گەڕانەوە",
      next: "هەنگاوی دواتر",
      totalTaxes: "کۆی خەمڵێنراوی باج و تاریفە",
      recalcValues: "دەستکاریکردنی تاریفە و باج (بۆ گۆڕینی لایەنەکان):",
      dutyLabel: "ڕێژەی گومرگ (Duty)",
      taxLabel: "ڕێژەی باجی هاوردە (Sales Tax)",
      feeLabel: "سەربارەی مامەڵەکردن",
      totalEscrow: "کۆی گشتی باج",
    },
    ar: {
      templateTitle: "نموذج شحنات الاستيراد (تحديد سريع لعرض العقد):",
      formTitle: "إدخال بيانات مانيفر الشحنة",
      prodLabel: "اسم المنتج",
      descLabel: "وصف البضاعة بالتفصيل",
      qtyLabel: "الكمية المطلوبة (وحدة)",
      origLabel: "بلد المنشأ",
      valLabel: "القيمة الإجمالية للفاتورة (FOB USD)",
      destLabel: "المدينة المستهدفة / المستودع",
      routeLabel: "طريقة الشحن والمسار",
      decisionTitle: "تحليل جمركي آلي ونظام التصنيف الفيدرالي",
      hsSuggested: "رمز تصنيف التعرفة المحتمل (HS Code)",
      confidence: "نسبة مطابقة المعايير",
      category: "فئة التعريفة الجمركية",
      classification: "تصنيف الأهمية السيادية",
      regNotes: "المحددات التنظيمية والقوانين الجمركية",
      altCodes: "الرموز البديلة المقترحة",
      reanalyze: "إعادة التحليل والتدقيق والتقدير",
      prev: "السابق",
      next: "التالي",
      totalTaxes: "إجمالي الرسوم التقديرية السيادية",
      recalcValues: "لوحة محاكاة وتعديل نسب التعرفة:",
      dutyLabel: "نسبة ضريبة الوارد (الجمارك)",
      taxLabel: "ضريبة المبيعات على الاستيراد (VAT)",
      feeLabel: "أجور الإجراءات والخدمات الفيدرالية",
      totalEscrow: "إجمالي الرسوم المترتبة لشRelease",
    }
  };

  const text = languages[lang === 'ku' ? 'ku' : 'ar'];

  return (
    <div className="flex flex-col gap-6" id="ai-customs-assistant-root">
      
      {/* Dynamic Demo Quick Selector Row */}
      <GlassCard className="p-4 border border-blue-500/10 bg-slate-50/50 dark:bg-slate-900/40 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="p-1 px-2.5 bg-amber-500/10 text-amber-600 rounded-lg text-xs font-black tracking-widest uppercase border border-amber-500/20 animate-pulse">
            DEMO LEVEL 1
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#071739] dark:text-white uppercase tracking-tight">
              {text.templateTitle}
            </h2>
            <p className="text-[11px] text-slate-500 font-medium">To test other imports in Erbil, click any template card</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 justify-end w-full md:w-auto">
          <button
            onClick={() => handleTemplateSelection('laptops')}
            className={cn(
              "px-3 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer flex items-center gap-1.5",
              selectedTemplate === 'laptops' 
                ? "bg-[#071739] text-white border-[#071739]" 
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 shadow-2xs"
            )}
          >
            💻 Laptop Hardware (500x)
          </button>
          
          <button
            onClick={() => handleTemplateSelection('pharmaceuticals')}
            className={cn(
              "px-3 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer flex items-center gap-1.5",
              selectedTemplate === 'pharmaceuticals' 
                ? "bg-[#071739] text-white border-[#071739]" 
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 shadow-2xs"
            )}
          >
            💉 Vital Vaccines (1200x)
          </button>
          
          <button
            onClick={() => handleTemplateSelection('construction')}
            className={cn(
              "px-3 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer flex items-center gap-1.5",
              selectedTemplate === 'construction' 
                ? "bg-[#071739] text-white border-[#071739]" 
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 shadow-2xs"
            )}
          >
            🏗️ Steel Rebars (180t)
          </button>
        </div>
      </GlassCard>

      {/* Stepper Navigation bar for government-level stakeholders */}
      <div className="flex overflow-x-auto pb-2 border-b border-slate-100 select-none custom-scrollbar" id="assistant-stepper">
        <div className="flex w-full justify-between items-center min-w-[760px] px-2">
          {STEPS.map((step, idx) => {
            const isCompleted = idx < activeStep;
            const isActive = idx === activeStep;
            
            return (
              <React.Fragment key={idx}>
                <button
                  onClick={() => setActiveStep(idx)}
                  className="flex items-center gap-2 text-left focus:outline-none cursor-pointer group shrink-0"
                >
                  <div className={cn(
                    "w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs border transition-all",
                    isCompleted && "bg-blue-600 text-white border-blue-600 shadow-sm",
                    isActive && "bg-[#071739] text-white border-[#071739] ring-2 ring-blue-500/10",
                    !isActive && !isCompleted && "bg-white border-slate-200 text-slate-400 group-hover:border-slate-300 group-hover:text-slate-600"
                  )}>
                    {isCompleted ? <CheckCircle2 className="w-4 h-4 text-white" /> : idx + 1}
                  </div>
                  <div>
                    <h3 className={cn(
                      "text-[11px] font-bold tracking-tight uppercase transition-colors whitespace-nowrap",
                      isActive ? "text-[#071739] font-black" : isCompleted ? "text-slate-700" : "text-slate-400"
                    )}>
                      {step.label}
                    </h3>
                    <p className="text-[9px] text-slate-400 leading-none mt-0.5 whitespace-nowrap">{step.desc}</p>
                  </div>
                </button>
                {idx < STEPS.length - 1 && (
                  <div className={cn(
                    "flex-1 h-[2px] mx-3 max-w-[40px] rounded-full",
                    idx < activeStep ? "bg-blue-300" : "bg-slate-150"
                  )} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Primary Wizard Step Render Area */}
      <div className="min-h-[500px]" id="step-render-view">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22 }}
            className="grid grid-cols-1 gap-6"
          >
            
            {/* =========================================================================
                STEP 1: AI PRODUCT SPECIFICATION AND HS CODE MATCHING
               ========================================================================= */}
            {activeStep === 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Form parameters inputs */}
                <div className="lg:col-span-6 bg-white border border-slate-150 rounded-[24px] p-6 shadow-2xs flex flex-col gap-4">
                  <h3 className="text-xs font-black text-[#071739] uppercase tracking-wider flex items-center gap-1.5 border-b pb-2 select-none">
                    <span className="w-1.5 h-3 rounded bg-blue-500" />
                    {text.formTitle}
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">{text.prodLabel}</label>
                      <input
                        type="text"
                        value={inputState.productName}
                        onChange={(e) => setInputState(prev => ({ ...prev, productName: e.target.value }))}
                        className="w-full text-xs font-medium border border-slate-200 focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] px-3.5 py-2.5 rounded-xl outline-none"
                        required
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">{text.descLabel}</label>
                      <textarea
                        value={inputState.productDescription}
                        onChange={(e) => setInputState(prev => ({ ...prev, productDescription: e.target.value }))}
                        rows={3}
                        className="w-full text-xs font-medium border border-slate-200 focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] p-3.5 rounded-xl outline-none leading-relaxed"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">{text.qtyLabel}</label>
                      <input
                        type="number"
                        value={inputState.quantity}
                        onChange={(e) => setInputState(prev => ({ ...prev, quantity: Math.max(1, parseInt(e.target.value) || 0) }))}
                        className="w-full text-xs font-bold border border-slate-200 focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] p-2.5 rounded-xl outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">{text.valLabel}</label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-mono font-bold">$</span>
                        <input
                          type="number"
                          value={inputState.invoiceValue}
                          onChange={(e) => setInputState(prev => ({ ...prev, invoiceValue: Math.max(1, parseInt(e.target.value) || 0) }))}
                          className="w-full text-xs font-bold border border-slate-200 focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] pl-7 pr-3 py-2.5 rounded-xl outline-none text-right font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">{text.origLabel}</label>
                      <select
                        value={inputState.originCountry}
                        onChange={(e) => setInputState(prev => ({ ...prev, originCountry: e.target.value }))}
                        className="w-full text-xs font-bold border border-slate-200 focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] py-2.5 px-3 rounded-xl outline-none bg-white font-medium"
                      >
                        <option value="China">China Representative Node</option>
                        <option value="Germany">Germany Representative Node</option>
                        <option value="Turkey">Turkey Border Depot</option>
                        <option value="United States">United States (FOB Port)</option>
                        <option value="Japan">Japan Tokyo Port Office</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">{text.routeLabel}</label>
                      <select
                        value={inputState.transportMethod}
                        onChange={(e) => setInputState(prev => ({ ...prev, transportMethod: e.target.value as 'Sea Freight' | 'Air Freight' | 'Land Freight' }))}
                        className="w-full text-xs font-bold border border-slate-200 focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] py-2.5 px-3 rounded-xl outline-none bg-white font-medium"
                      >
                        <option value="Sea Freight">🚢 Umm Qasr Sea Freight</option>
                        <option value="Air Freight">✈️ Erbil/Baghdad Airport Cargo</option>
                        <option value="Land Freight">🚛 Ibrahim Khalil Land Border</option>
                      </select>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono mt-2">
                    <span className="flex items-center gap-1"><Lock className="w-3.5 h-3.5 text-blue-500" /> SECURE CONGESTION BLOCKER</span>
                    <span>128-BIT CLIENT ENCRYPT</span>
                  </div>
                </div>

                {/* AI brain analysis suggested classifier result */}
                <div className="lg:col-span-6 space-y-4">
                  <div className="bg-gradient-to-br from-[#071739] to-[#0d2252] text-white rounded-[24px] p-6 shadow-md border border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-36 h-36 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
                    
                    <div className="flex justify-between items-start mb-4 relative z-10">
                      <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20 shrink-0">
                        <Cpu className="w-5 h-5 text-[#0066FF] animate-pulse" />
                      </div>
                      <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[10px] font-mono tracking-widest font-black py-0.5 px-2">
                        {scenarioState.analysis.confidenceScore}% {text.confidence}
                      </Badge>
                    </div>

                    <h4 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1 select-none">
                      {text.hsSuggested}
                    </h4>
                    
                    {/* Big Bold HS Suggested code */}
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-4xl font-extrabold tracking-tight text-white font-mono">
                        {scenarioState.analysis.hsSuggestedCode}
                      </span>
                      <span className="text-xs text-slate-400 font-medium font-mono">/ (Category IV Tariffs)</span>
                    </div>

                    <div className="space-y-3.5 text-xs border-t border-white/5 pt-4 relative z-10">
                      <div className="grid grid-cols-3 gap-1">
                        <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">{lang === 'ku' ? "کەتەگۆری بەرهەم:" : "فئة المنتج:"}</span>
                        <span className="col-span-2 text-slate-100 font-semibold">{scenarioState.analysis.productCategory}</span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-1">
                        <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">{lang === 'ku' ? "پۆلێنی گومرگ:" : "التصنيف والمنطقة:"}</span>
                        <span className="col-span-2 text-slate-100 font-bold text-blue-300">{scenarioState.analysis.customsClassification}</span>
                      </div>
                      
                      <div className="bg-blue-900/15 border border-[#0066FF]/20 rounded-xl p-3.5 mt-2">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-blue-200 uppercase tracking-wide mb-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                          {lang === 'ku' ? "ڕێساکانی دەسەڵاتی فیدراڵی" : "الأنظمة الجمركية لعام ٢٠٢٦"}
                        </div>
                        <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
                          {scenarioState.analysis.regulatoryNotes}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Alternative Suggested HS Codes list with clickable option */}
                  <div className="bg-white border border-slate-150 rounded-[24px] p-5 shadow-2xs">
                    <h3 className="text-xs font-black text-slate-600 uppercase tracking-wider flex items-center gap-1.5 border-b pb-2 mb-3 select-none">
                      <Layers className="w-4 h-4 text-slate-400" />
                      {text.altCodes}
                    </h3>
                    
                    <div className="space-y-2">
                      {scenarioState.analysis.alternativeCodes.map((alt) => (
                        <button
                          key={alt.code}
                          onClick={() => setInputState(prev => ({
                            ...prev,
                            productDescription: `${prev.productDescription} (Note: System suggested alt: hs_${alt.code})`
                          }))}
                          className="w-full text-left p-3 border rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all border-slate-100 flex items-center justify-between cursor-pointer group"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-extrabold text-[#071739]">{alt.code}</span>
                              <span className="text-[10px] bg-slate-100 text-slate-500 font-mono font-bold px-1.5 rounded">{alt.confidence}% confidence</span>
                            </div>
                            <p className="text-[10px] text-slate-400 font-medium mt-1 truncate max-w-[280px] sm:max-w-[420px]">{alt.label}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1.5 transition-transform" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* =========================================================================
                STEP 2: TARIFFS & TAX TWEAKER ESTIMATION
               ========================================================================= */}
            {activeStep === 1 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Math breakdown KPI list */}
                <div className="lg:col-span-7 bg-white border border-slate-150 rounded-[24px] p-6 shadow-2xs space-y-6">
                  
                  <div className="flex items-center justify-between border-b pb-3 select-none">
                    <h3 className="text-xs font-black text-[#071739] uppercase tracking-wider flex items-center gap-1.5">
                      <Scale className="w-4 h-4 text-blue-500" />
                      {lang === 'ku' ? "ژمێرەی فیدراڵی باجەکان" : "جدول احتساب الرسوم الفيدرالية"}
                    </h3>
                    <Badge className="bg-blue-50 text-[#0066FF] border-blue-200 font-mono text-[9px] font-black">CIF MULTIPLIER: {scenarioState.tax.cifMultiplier}x</Badge>
                  </div>

                  {/* KPI Cards Breakdown Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">FOB Invoice Value</span>
                      <span className="text-lg font-extrabold text-[#071739] font-mono">${inputState.invoiceValue.toLocaleString()}</span>
                      <p className="text-[9px] text-slate-400 mt-1">Declared base rate</p>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Customs Duty ({activeDutyRate}%)</span>
                      <span className="text-lg font-extrabold text-blue-600 font-mono">${calculatedDutyAmt.toLocaleString()}</span>
                      <p className="text-[9px] text-slate-400 mt-1">Sovereign protective tariff</p>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Import Tax / VAT ({activeTaxRate}%)</span>
                      <span className="text-lg font-extrabold text-[#0066FF] font-mono">${calculatedTaxAmt.toLocaleString()}</span>
                      <p className="text-[9px] text-slate-400 mt-1">Standard Federal Trade Tax</p>
                    </div>
                  </div>

                  {/* Calculations math breakdown visual list */}
                  <div className="space-y-3 bg-slate-50/50 p-4 rounded-2xl border border-slate-100/60">
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span className="text-slate-500">CIF Assessed Base (FOB x 1.1)</span>
                      <span className="font-mono text-slate-700">${Math.round(inputState.invoiceValue * 1.1).toLocaleString()} USD</span>
                    </div>
                    
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span className="text-slate-500">Iraqi Customs Processing Fee</span>
                      <span className="font-mono text-slate-700">${scenarioState.tax.processingFee.toLocaleString()} USD</span>
                    </div>

                    <div className="border-t border-slate-200/80 my-2 pt-2 flex justify-between items-center text-sm font-bold text-[#071739]">
                      <span className="flex items-center gap-1">
                        <Coins className="w-4 h-4 text-emerald-500" />
                        {text.totalEscrow}
                      </span>
                      <span className="font-mono text-emerald-600 text-lg">${calculatedTotal.toLocaleString()} USD</span>
                    </div>
                  </div>

                  {/* Dynamic interactive Sliders to "tweak" parameters */}
                  <div className="border-t border-slate-100 pt-5 space-y-4">
                    <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-wider select-none">
                      {text.recalcValues}
                    </h4>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center text-xs font-bold text-slate-600 mb-1">
                          <span>{text.dutyLabel}</span>
                          <span className="font-mono text-blue-600 font-black">{activeDutyRate}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="30"
                          step="1"
                          value={activeDutyRate}
                          onChange={(e) => setOverrideDutyPercent(parseInt(e.target.value))}
                          className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#0066FF]"
                        />
                        <div className="flex justify-between text-[9px] text-slate-400 font-mono font-bold mt-1">
                          <span>0% (Exempt)</span>
                          <span>15% (Standard Max)</span>
                          <span>30% (Sovereign Cap)</span>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center text-xs font-bold text-slate-600 mb-1">
                          <span>{text.taxLabel}</span>
                          <span className="font-mono text-[#0066FF] font-black">{activeTaxRate}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="20"
                          step="1"
                          value={activeTaxRate}
                          onChange={(e) => setOverrideTaxPercent(parseInt(e.target.value))}
                          className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                        <div className="flex justify-between text-[9px] text-slate-400 font-mono font-bold mt-1">
                          <span>0%</span>
                          <span>10% (Federal standard)</span>
                          <span>20% (Luxury Goods)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Left side: Customs visual chart representation */}
                <div className="lg:col-span-5 bg-white border border-slate-150 rounded-[24px] p-6 shadow-2xs space-y-6">
                  <h3 className="text-xs font-black text-slate-600 uppercase tracking-wider flex items-center gap-1.5 border-b pb-2 select-none">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                    {lang === 'ku' ? "دابەشبوونی تێچوو بە هێڵکاری" : "نمذجة ميزانية الشحنة المترتبة"}
                  </h3>

                  {/* Custody chart using custom highly stylized HTML and CSS */}
                  <div className="flex flex-col items-center justify-center py-6">
                    <div className="relative w-44 h-44 flex items-center justify-center">
                      
                      {/* Interactive beautiful SVG donut showing taxes vs base ratio */}
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="#e2e8f0"
                          strokeWidth="10"
                          fill="transparent"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="#0066FF"
                          strokeWidth="10"
                          fill="transparent"
                          strokeDasharray={`${(calculatedTotal / inputState.invoiceValue) * 251} 251`}
                          className="transition-all duration-300 pointer-events-none"
                        />
                      </svg>
                      
                      {/* Percent text center */}
                      <div className="absolute text-center select-none">
                        <span className="text-2xl font-black text-[#071739] block leading-none font-mono">
                          {((calculatedTotal / inputState.invoiceValue) * 100).toFixed(1)}%
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Duties Burden</span>
                      </div>
                    </div>

                    <div className="w-full space-y-2 mt-6">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 bg-slate-200 rounded-full shrink-0" />
                          <span className="text-slate-500 font-semibold">Declared CIF Base</span>
                        </div>
                        <span className="font-mono font-bold text-slate-700">${inputState.invoiceValue.toLocaleString()}</span>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 bg-[#0066FF] rounded-full shrink-0 animate-pulse" />
                          <span className="text-slate-500 font-semibold">Sovereign Levies Portion</span>
                        </div>
                        <span className="font-mono font-bold text-emerald-600">${calculatedTotal.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/15 rounded-xl text-[11px] text-slate-600 leading-normal font-medium">
                    🔍 <strong>Sovereign Fiscal Clearance Conformance:</strong> Escrow guarantees will hold on bank ledgers and release automatically to the Iraqi Customs Vault upon boundary border terminal validation.
                  </div>
                </div>
              </div>
            )}

            {/* =========================================================================
                STEP 3: COMPLIANCE ASSESSMENT & RISK ANALYTICS
               ========================================================================= */}
            {activeStep === 2 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Risk dial and core indicators */}
                <div className="lg:col-span-6 bg-white border border-slate-150 rounded-[24px] p-6 shadow-2xs space-y-6">
                  <div className="border-b pb-3 select-none flex justify-between items-center">
                    <h3 className="text-xs font-black text-[#071739] uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-blue-500" />
                      {lang === 'ku' ? "دەرئەنجامی ڕێساکانی پابەندبوون" : "التقييم الفيدرالي لمخاطر الامتثال"}
                    </h3>
                    <Badge className={cn(
                      "font-mono text-[9px] font-black px-2 py-0.5 border",
                      scenarioState.compliance.riskLevel === 'LOW' ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-amber-50 text-amber-600 border-amber-200"
                    )}>
                      {scenarioState.compliance.riskLevel} RISK
                    </Badge>
                  </div>

                  {/* Progress Dial display */}
                  <div className="flex flex-col items-center justify-center bg-slate-50/50 rounded-2xl p-6 border border-slate-100">
                    <div className="text-center mb-4">
                      <span className="block text-3xl font-extrabold text-[#071739] font-mono">
                        {scenarioState.compliance.riskScore} <span className="text-slate-400 text-sm font-semibold">/ 100</span>
                      </span>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Composite Cognitive Hazard Rating</p>
                    </div>

                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          scenarioState.compliance.riskLevel === 'LOW' ? "bg-emerald-500" : "bg-amber-500"
                        )}
                        style={{ width: `${scenarioState.compliance.riskScore}%` }}
                      />
                    </div>
                  </div>

                  {/* Checklist matching user values */}
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between p-3 border rounded-xl border-emerald-100 bg-emerald-50/20">
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span className="text-xs font-bold text-slate-700">✓ Import Allowed</span>
                      </div>
                      <span className="text-[9px] font-mono text-emerald-600 font-bold uppercase">Authorized</span>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-xl border-emerald-100 bg-emerald-50/20">
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span className="text-xs font-bold text-slate-700">✓ No Restricted Goods Detected</span>
                      </div>
                      <span className="text-[9px] font-mono text-emerald-600 font-bold uppercase">Pass</span>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-xl border-emerald-100 bg-emerald-50/20">
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span className="text-xs font-bold text-slate-700">✓ Customs Classification Valid</span>
                      </div>
                      <span className="text-[9px] font-mono text-emerald-600 font-bold uppercase">Conforms</span>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-xl border-emerald-100 bg-emerald-50/20">
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span className="text-xs font-bold text-slate-700">✓ Documentation Requirements Passed</span>
                      </div>
                      <span className="text-[9px] font-mono text-emerald-600 font-bold uppercase">Verified (5/5)</span>
                    </div>
                  </div>
                </div>

                {/* Audit secure console log */}
                <div className="lg:col-span-6 bg-[#071739] text-white rounded-[24px] p-6 shadow-md border border-white/5 space-y-4">
                  <div className="flex justify-between items-center border-b border-white/5 pb-3">
                    <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2 select-none">
                      <Terminal className="w-4 h-4 text-blue-400" />
                      {lang === 'ku' ? "کۆنسۆڵ دۆخ سکانکردنی فیدراڵ" : "سجل الفحص الأمني المركزي"}
                    </h3>
                    <button 
                      onClick={runSimulatedComplianceAudit}
                      disabled={complianceAuditing}
                      className="px-3 py-1 bg-blue-500/10 text-blue-300 font-semibold text-[10px] border border-blue-500/25 rounded-lg hover:bg-blue-500/20 transition-all cursor-pointer"
                    >
                      {complianceAuditing ? "Auditing..." : "Re-Scan Logs"}
                    </button>
                  </div>

                  <div className="bg-slate-950 rounded-xl p-4 font-mono text-[10px] text-slate-300 h-56 overflow-y-auto space-y-2.5 custom-scrollbar">
                    {complianceAuditing && (
                      <div className="flex items-center gap-2 text-blue-400 select-none pb-2 border-b border-white/5">
                        <span className="animate-spin h-3.5 w-3.5 rounded-full border-2 border-primary border-t-transparent inline-block" />
                        <span>INTELLIGENCE COGNITIVE ENGINE SCREENING MANIFEST IN PROGRESS... [{auditProgress}%]</span>
                      </div>
                    )}
                    
                    {complianceLogs.map((log, idx) => (
                      <div key={idx} className="leading-relaxed border-l-2 border-[#0066FF] pl-2">
                        {log}
                      </div>
                    ))}

                    {!complianceAuditing && complianceLogs.length === 0 && (
                      <div className="text-slate-500 text-center py-10">No active scan logs. Click 'Re-Scan Logs' to re-evaluate thread security parameters.</div>
                    )}

                    {!complianceAuditing && complianceLogs.length > 0 && (
                      <div className="text-emerald-400 font-black text-[9px] select-none text-right border-t border-white/5 pt-2 tracking-widest mt-4">
                        SECURE IMMUTABLE STATE CERTIFIED // STATUS APPROVED
                      </div>
                    )}
                  </div>

                  <div className="rounded-xl border border-white/5 bg-white/5 p-4 space-y-2">
                    <h4 className="text-[10px] font-black tracking-wider text-slate-300 uppercase select-none">Sovereign Security Locks:</h4>
                    <ul className="text-[11px] text-slate-300 space-y-1.5 leading-relaxed font-semibold">
                      {scenarioState.compliance.securityNotes.map((note, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-[#0066FF] font-bold shrink-0">•</span>
                          <span>{note}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* =========================================================================
                STEP 4: DOCUMENTS INVENTORY LOCKER
               ========================================================================= */}
            {activeStep === 3 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Documents List & status panel */}
                <div className="lg:col-span-7 bg-white border border-slate-150 rounded-[24px] p-6 shadow-2xs space-y-5">
                  <div className="border-b pb-3 flex justify-between items-center select-none">
                    <h3 className="text-xs font-black text-[#071739] uppercase tracking-wider flex items-center gap-1.5">
                      <FileCheck className="w-4 h-4 text-blue-500" />
                      {lang === 'ku' ? "لیستی دۆکیومێنت فەرمی هاوردەکردن" : "بوابة الوثائق الجمركية المؤمنة"}
                    </h3>
                    <Badge className="bg-emerald-50 text-emerald-600 border-emerald-200 font-mono text-[9px] font-black">{documentPercent}% COMPLETE</Badge>
                  </div>

                  {/* Animated overall progress bar */}
                  <div className="space-y-1 mt-2">
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      <span>Verification Progress</span>
                      <span className="font-mono text-slate-600">{uploadProgressCount} of {activeDocuments.length} Verified</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-100 p-[1px]">
                      <div 
                        className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                        style={{ width: `${documentPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2.5 mt-4">
                    {activeDocuments.map((doc) => {
                      const isSelected = doc.id === selectedDocId;
                      let badgeStyle = "bg-slate-55 border-slate-200 text-slate-500";
                      if (doc.status === 'APPROVED') badgeStyle = "bg-emerald-50 border-emerald-200 text-emerald-600 font-semibold";
                      if (doc.status === 'UPLOADED') badgeStyle = "bg-blue-50 border-blue-200 text-[#0066FF] font-semibold animate-pulse";
                      if (doc.status === 'REJECTED') badgeStyle = "bg-rose-50 border-rose-200 text-rose-600";

                      return (
                        <div 
                          key={doc.id}
                          className={cn(
                            "p-3.5 border rounded-xl transition-all cursor-pointer flex items-center justify-between group",
                            isSelected ? "border-[#0066FF] bg-blue-50/15" : "border-slate-100 hover:bg-slate-50/50"
                          )}
                          onClick={() => setSelectedDocId(doc.id)}
                        >
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border transition-all",
                              isSelected ? "bg-[#0000FF]/10 text-blue-500 border-blue-150" : "bg-slate-50 border-slate-150 text-slate-400"
                            )}>
                              <Briefcase className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="text-xs font-extrabold text-[#071739] font-sans block">{doc.name}</span>
                              <span className="text-[10px] text-slate-400 font-semibold leading-none">Required documentation check</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className={cn("px-2 py-0.5 rounded text-[8px] border uppercase leading-relaxed font-black tracking-wider", badgeStyle)}>
                              {doc.status}
                            </span>
                            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Selected document detail card locker */}
                <div className="lg:col-span-5 bg-white border border-slate-150 rounded-[24px] p-6 shadow-2xs space-y-5">
                  {(() => {
                    const doc = activeDocuments.find(d => d.id === selectedDocId);
                    if (!doc) return <div className="text-slate-400 text-center text-xs">Select a document key to view specific details here</div>;

                    return (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 bg-blue-50 text-[#0066FF] border border-blue-100 rounded-xl shrink-0 text-xs">
                            <Lock className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-xs font-black text-[#071739] uppercase tracking-wide leading-tight">{doc.name}</h4>
                            <span className="text-[9px] text-[#0066FF] font-mono leading-none tracking-widest uppercase">IDG SECURE DIGITAL LEDGER LOCK</span>
                          </div>
                        </div>

                        <p className="text-[11px] text-slate-500 leading-relaxed font-medium bg-slate-50 p-3.5 rounded-xl border">
                          {doc.description}
                        </p>

                        <div className="space-y-4 pt-3 border-t">
                          <span className="block text-[10px] text-slate-400 font-mono uppercase font-black">Audit Hash Proof (Immutable ledger SHA-256):</span>
                          <div className="p-2 border border-dashed rounded bg-slate-50/50 font-mono text-[8.5px] text-slate-400 select-all flex justify-between items-center">
                            <span className="truncate pr-1">sha256:d8a2bc41{selectedDocId}b0945e8d3df4a1a3ecbf2af9e2a8742fc26ca0a9e8b3e83fecf0</span>
                            <span className="text-[7px] text-emerald-600 font-semibold uppercase font-bold shrink-0 bg-emerald-50 px-1 rounded border border-emerald-100">MATCHED</span>
                          </div>

                          <div className="flex flex-col gap-2 pt-2">
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">State Manipulation (Simulation):</span>
                            
                            <div className="grid grid-cols-3 gap-2">
                              <button
                                onClick={() => handleToggleDocStatus(doc.id, 'PENDING')}
                                className={cn(
                                  "py-2 rounded-xl text-[9px] font-bold border transition-all cursor-pointer",
                                  doc.status === 'PENDING' ? "bg-slate-800 text-white border-slate-800" : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                                )}
                              >
                                Clear File
                              </button>
                              
                              <button
                                onClick={() => handleToggleDocStatus(doc.id, 'UPLOADED')}
                                className={cn(
                                  "py-2 rounded-xl text-[9px] font-bold border transition-all cursor-pointer",
                                  doc.status === 'UPLOADED' ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                                )}
                              >
                                Upload Mock
                              </button>

                              <button
                                onClick={() => handleToggleDocStatus(doc.id, 'APPROVED')}
                                className={cn(
                                  "py-2 rounded-xl text-[9px] font-bold border transition-all cursor-pointer",
                                  doc.status === 'APPROVED' ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                                )}
                              >
                                Approve File
                              </button>
                            </div>
                          </div>

                          <div className="bg-[#0066FF]/5 pointer-events-none rounded-xl p-3 border border-[#0066FF]/10 text-[10px] text-slate-500 leading-normal font-semibold">
                            💡 Custom manifests submitted on the Iraq Digital Gateway undergo optical character recognition (OCR) parsing, instantly cross-indexing variables with CBI exchange ledgers.
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* =========================================================================
                STEP 5: LOGISTICS PATH ESTIMATOR & ROUTE WAVE
               ========================================================================= */}
            {activeStep === 4 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Visual map route map indicators */}
                <div className="lg:col-span-8 bg-[#071739] text-white rounded-[24px] p-6 shadow-md border border-white/5 space-y-6">
                  <div className="border-b border-white/5 pb-3 flex justify-between items-center select-none">
                    <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Compass className="w-4 h-4 text-blue-400" />
                      {lang === 'ku' ? "دروستکردنی هێڵکاری گواستنەوە هاوشان" : "التوقعات والمراقبة الفيدرالية للشحن والمسار"}
                    </h3>
                    <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono text-[9px] font-black uppercase tracking-widest">{scenarioState.logistics.routeConfidence}% Route Conf</Badge>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-950/60 p-4 rounded-xl border border-white/5 font-semibold text-xs text-white">
                    <div className="p-2 border-r border-white/5">
                      <span className="text-[9px] text-slate-400 uppercase tracking-wider block">Port Departure</span>
                      <p className="font-mono mt-1 text-slate-200">{scenarioState.logistics.origin.split(',')[0]}</p>
                    </div>

                    <div className="p-2 border-r border-white/5">
                      <span className="text-[9px] text-slate-400 uppercase tracking-wider block">Border Entry Node</span>
                      <p className="font-mono mt-1 text-[#0066FF]">{scenarioState.logistics.port.split(',')[0]}</p>
                    </div>

                    <div className="p-2 border-r border-white/5">
                      <span className="text-[9px] text-slate-400 uppercase tracking-wider block">Cargo Carrier Partner</span>
                      <p className="font-mono mt-1 text-slate-200 truncate">{scenarioState.logistics.shippingLine.split(' ')[0]}</p>
                    </div>

                    <div className="p-2">
                      <span className="text-[9px] text-slate-400 uppercase tracking-wider block">Sovereign ETA</span>
                      <p className="font-mono mt-1 text-emerald-400 font-extrabold">{scenarioState.logistics.etaDays} Standard Days</p>
                    </div>
                  </div>

                  {/* Route progress path visual chart map timeline horizontal links */}
                  <div className="py-6 overflow-x-auto custom-scrollbar select-none">
                    <div className="flex w-full justify-between items-center min-w-[620px] relative px-2">
                      
                      {/* Underlying connector line */}
                      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-700/80 -translate-y-1/2 -z-0" />
                      
                      {scenarioState.logistics.timeline.map((node, idx) => {
                        const isDone = node.status === 'COMPLETED';
                        const isActive = node.status === 'IN_TRANSIT';
                        
                        return (
                          <div key={node.id} className="flex flex-col items-center text-center relative z-10 shrink-0 max-w-[100px] gap-2.5">
                            <div className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center border font-mono text-[10px] font-extrabold transition-all",
                              isDone && "bg-emerald-500 border-emerald-500 text-white shadow-sm",
                              isActive && "bg-blue-600 border-blue-600 text-white animate-pulse ring-4 ring-blue-500/10",
                              !isDone && !isActive && "bg-[#0b1f48] border-slate-600 text-slate-400"
                            )}>
                              {idx + 1}
                            </div>
                            <div>
                              <span className={cn(
                                "text-[10px] font-bold block truncate max-w-[90px]",
                                isActive ? "text-blue-400" : isDone ? "text-slate-200" : "text-slate-400 font-medium"
                              )}>
                                {node.stageName}
                              </span>
                              <span className="text-[8px] text-slate-400 font-mono leading-none block mt-0.5">{node.location.split(',')[0]}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Sub timeline details details block */}
                <div className="lg:col-span-4 bg-white border border-slate-150 rounded-[24px] p-6 shadow-2xs space-y-4">
                  <h3 className="text-xs font-black text-slate-600 uppercase tracking-wider flex items-center gap-1.5 border-b pb-2 select-none">
                    <Clock className="w-4 h-4 text-slate-400" />
                    {lang === 'ku' ? "هەنگاوەکانی تێپەڕین" : "المكعبات اللوجستية للمسار"}
                  </h3>

                  <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1 custom-scrollbar">
                    {scenarioState.logistics.timeline.map((node) => (
                      <div key={node.id} className="relative border-l-2 border-slate-100 pl-4 pb-2 last:pb-0">
                        {/* Bullet tracker */}
                        <div className={cn(
                          "absolute -left-[5px] top-1 w-2 h-2 rounded-full",
                          node.status === 'COMPLETED' ? "bg-emerald-500" : 
                          node.status === 'IN_TRANSIT' ? "bg-blue-500 animate-ping" : "bg-slate-200"
                        )} />

                        {/* Extra wrapper bullet when active */}
                        {node.status === 'IN_TRANSIT' && (
                          <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-blue-500" />
                        )}

                        <div className="flex justify-between items-start">
                          <span className="text-[11px] font-bold text-[#071739] block">{node.stageName}</span>
                          <span className="text-[8.5px] font-mono text-slate-400">Day +{node.daysOffset}</span>
                        </div>
                        <span className="text-[9px] text-[#0066FF] font-bold uppercase tracking-wider block mt-0.5">{node.location}</span>
                        <p className="text-[10px] text-slate-400 font-medium leading-relaxed mt-1">{node.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* =========================================================================
                STEP 6: EXECUTIVE PLATFORM DASHBOARD SUMMARY
               ========================================================================= */}
            {activeStep === 5 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Government Official Manifest summary */}
                <div className="lg:col-span-8 bg-white border border-slate-200 rounded-[24px] p-6 shadow-sm space-y-6 relative overflow-hidden" id="executive-manifest-summary">
                  
                  {/* Subtle seal background element */}
                  <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-blue-500/3 rounded-full border border-dashed border-blue-500/10 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center">
                    <span className="text-[10px] font-mono text-blue-500/10 font-bold tracking-widest text-center select-none uppercase">REPUBLIC OF IRAQ<br />DIGITAL SECURITY APPROVED</span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-4 select-none relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold text-lg select-none">
                        🇮🇶
                      </div>
                      <div>
                        <h2 className="text-xs font-black text-[#071739] uppercase tracking-wider">REPUBLIC OF IRAQ // MINISTRY OF FINANCE</h2>
                        <span className="text-[9px] text-slate-400 tracking-widest font-mono font-bold">GOVERNMENT INTEL COGNITIVE PRE-CLEARANCE</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="block text-[9.5px] text-slate-400 font-mono uppercase font-bold">Certificate Identifier</span>
                      <span className="font-mono text-xs text-[#071739] font-black select-all tracking-wider">IDG-PRE-CERT-{scenarioState.id}</span>
                    </div>
                  </div>

                  {/* Summary grid list of items */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-b pb-6 relative z-10">
                    <div className="p-3 bg-slate-50 border rounded-xl">
                      <span className="text-[9.5px] text-slate-400 font-bold uppercase tracking-wider block">FOB Cargo Value</span>
                      <span className="text-sm font-extrabold text-[#071739] font-mono">${inputState.invoiceValue.toLocaleString()}</span>
                      <span className="text-[8px] text-slate-400 block mt-0.5">Customs valuation base</span>
                    </div>

                    <div className="p-3 bg-slate-53 border rounded-xl">
                      <span className="text-[9.5px] text-slate-400 font-bold uppercase tracking-wider block">Total Customs Duty</span>
                      <span className="text-sm font-extrabold text-[#0066FF] font-mono">${calculatedDutyAmt.toLocaleString()} ({activeDutyRate}%)</span>
                      <span className="text-[8px] text-slate-400 block mt-0.5">Sovereign port levies</span>
                    </div>

                    <div className="p-3 bg-slate-50 border rounded-xl">
                      <span className="text-[9.5px] text-slate-400 font-bold uppercase tracking-wider block">Total Sales Tax</span>
                      <span className="text-sm font-extrabold text-blue-600 font-mono">${calculatedTaxAmt.toLocaleString()} ({activeTaxRate}%)</span>
                      <span className="text-[8px] text-slate-400 block mt-0.5">Standard trade VAT portion</span>
                    </div>

                    <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                      <span className="text-[9.5px] text-emerald-700 font-bold uppercase tracking-wider block">Total Estimated Fees</span>
                      <span className="text-sm font-extrabold text-emerald-600 font-mono">${calculatedTotal.toLocaleString()}</span>
                      <span className="text-[8px] text-emerald-600 font-mono block mt-0.5">Full Escrow clearance</span>
                    </div>
                  </div>

                  {/* Operational Summary paragraphs inside government frame */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 relative z-10">
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-wider select-none leading-none">Security Compliance Evaluation:</h4>
                      
                      <div className="space-y-3">
                        <div className="flex gap-2 items-start text-xs font-semibold text-slate-600">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <div>
                            <span className="text-slate-800 font-bold block text-[11px] uppercase">Automated CBI screening pass</span>
                            The selected corporate exporter lists under compliant wholesalers list in CBI registries. No foreign currency blockgrades.
                          </div>
                        </div>

                        <div className="flex gap-2 items-start text-xs font-semibold text-slate-600">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <div>
                            <span className="text-slate-800 font-bold block text-[11px] uppercase">Data Residency Conformance</span>
                            Execution matches the Federal Database residency directives. Sovereign logs committed in Baghdad/Basra active nodes.
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-wider select-none leading-none">Logistics Transit Timeline summary:</h4>
                      
                      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col gap-3">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-400 font-semibold uppercase text-[9px] tracking-wider">Transportation Route:</span>
                          <span className="font-bold text-[#071739]">{inputState.transportMethod} channel</span>
                        </div>

                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-400 font-semibold uppercase text-[9px] tracking-wider">Active Transit Port:</span>
                          <span className="font-bold text-[#071739]">{scenarioState.logistics.port.split(',')[0]}</span>
                        </div>

                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-400 font-semibold uppercase text-[9px] tracking-wider">Final Delivery Gate:</span>
                          <span className="font-bold text-[#0066FF]">{inputState.destinationCity} Dry Terminal yard</span>
                        </div>

                        <div className="flex justify-between items-center text-xs border-t pt-2 mt-1">
                          <span className="text-slate-500 font-black uppercase text-[10px] tracking-wider">Estimated Delivery Time:</span>
                          <span className="font-mono text-emerald-600 font-extrabold text-sm">{scenarioState.logistics.etaDays} Cargo Days</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Blockchain hashes immutable audit blocks */}
                  <div className="mt-4 p-4 border rounded-2xl bg-slate-50/50 space-y-2 relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="space-y-1 w-full">
                      <span className="text-[9.5px] text-slate-400 font-mono uppercase font-black">Secure Sovereign Ledger Block Proof:</span>
                      <div className="font-mono text-[8px] text-slate-400 truncate max-w-xs sm:max-w-md">
                        SYS::HASH[SHA-256]::0x412b0945e8d3df4a1a3ecbf2af9e2a8742fc26ca0a9e8b3e83fecf0aa89713b102efb09418
                      </div>
                    </div>
                    <div className="shrink-0 flex items-center bg-blue-50 text-[#0066FF] border border-blue-100 px-3 py-1 rounded-xl text-[9px] font-mono font-black tracking-widest gap-1">
                      <Lock className="w-3.5 h-3.5 text-[#0066FF]" /> SECURE CORE
                    </div>
                  </div>
                </div>

                {/* Left side executive QR certificate locker */}
                <div className="lg:col-span-4 bg-gradient-to-br from-[#071739] to-[#0c204d] text-white rounded-[24px] p-6 shadow-md border border-white/5 space-y-6 text-center flex flex-col items-center justify-center">
                  
                  <div className="p-3 bg-blue-500/10 text-blue-400 border border-blue-500/25 rounded-2xl animate-pulse">
                    <FileCheck className="w-8 h-8 text-[#0066FF]" />
                  </div>

                  <div>
                    <h3 className="text-sm font-extrabold tracking-tight text-white uppercase uppercase">GOVERNMENT CORE AUTHORIZED</h3>
                    <p className="text-[11px] text-slate-300 mt-1 leading-normal">
                      The cognitive assessment verifies this manifest declaration conforming fully to Article 31-B of Federal Customs Law.
                    </p>
                  </div>

                  {/* Draw a gorgeous Government authentication QR design symbol */}
                  <div className="w-36 h-36 bg-white rounded-2xl p-3 shadow-md flex items-center justify-center relative group">
                    <div className="absolute inset-0 border-4 border-blue-500/20 rounded-2xl group-hover:scale-105 transition-transform" />
                    <div className="w-full h-full border-2 border-slate-900 p-1 flex flex-col justify-between">
                      <div className="flex justify-between">
                        <span className="w-6 h-6 bg-slate-900 border border-white inline-block" />
                        <span className="text-[7px] font-mono text-slate-900 font-extrabold leading-none tracking-tighter mt-1">IDG CODE</span>
                        <span className="w-6 h-6 bg-slate-900 border border-white inline-block" />
                      </div>
                      <div className="text-[8px] font-mono text-slate-900 font-bold uppercase select-none text-center">
                        APPROVED VERIFIED
                      </div>
                      <div className="flex justify-between items-end">
                        <span className="w-6 h-6 bg-slate-900 border border-white inline-block" />
                        <span className="text-[6px] font-mono text-slate-500 text-right leading-none pb-1">SHAKEY v14</span>
                        <span className="w-6 h-6 border-2 border-slate-900">
                          <span className="w-3 h-3 bg-slate-900 inline-block m-0.5" />
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Print and Export Buttons */}
                  <div className="w-full space-y-2 pt-4">
                    <button
                      onClick={() => {
                        window.print();
                      }}
                      className="w-full py-2.5 bg-[#0066FF] hover:bg-[#0055DD] text-white text-xs font-bold rounded-xl transition-all shadow-sm shadow-blue-500/10 cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Printer className="w-4 h-4" /> Print Customs Certificate
                    </button>

                    <button
                      onClick={() => {
                        const jsonStr = JSON.stringify(scenarioState, null, 2);
                        const blob = new Blob([jsonStr], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `Sovereign_Customs_Declaration_${scenarioState.id}.json`;
                        a.click();
                      }}
                      className="w-full py-2.5 bg-white/10 hover:bg-white/15 text-white text-xs font-bold rounded-xl border border-white/10 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Download className="w-4 h-4" /> Export Electronic Manifest (.json)
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Stepper Wizard Control buttons footer */}
            <div className="flex justify-between items-center border-t pt-5 mt-6 border-slate-100 select-none">
              <button
                disabled={activeStep === 0}
                onClick={() => setActiveStep(prev => prev - 1)}
                className={cn(
                  "px-4 py-2.5 rounded-xl text-xs font-bold font-sans transition-all flex items-center gap-1.5 cursor-pointer border",
                  activeStep === 0 
                    ? "bg-slate-50 border-slate-200 text-slate-350 cursor-not-allowed opacity-50" 
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                )}
              >
                <ArrowLeft className="w-4 h-4" /> {text.prev}
              </button>

              <div className="text-[10px] text-slate-400 font-mono tracking-wider">
                STEP {activeStep + 1} OF {STEPS.length} // STAKEHOLDER CONDUIT
              </div>

              {activeStep < STEPS.length - 1 ? (
                <button
                  onClick={() => setActiveStep(prev => prev + 1)}
                  className="px-5 py-2.5 bg-[#071739] hover:bg-[#0c2252] text-white text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-slate-900/10 hover:translate-x-0.5"
                >
                  {text.next} <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    setActiveStep(0);
                    setInputState(MOCK_SCENARIOS.laptops);
                    // Show a quick restart notification or feedback to stakeholder
                    alert("Demo restarted. Re-routing cargo pathways.");
                  }}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-emerald-500/10"
                >
                  🔄 Restart Assistant Demo
                </button>
              )}
            </div>

          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
}
