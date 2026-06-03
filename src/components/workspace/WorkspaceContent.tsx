import React, { useState, useEffect, lazy, Suspense } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { Compass, Briefcase, Database, TrendingUp, Terminal, ShieldAlert } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";

// Direct Feature Modules
import { AdminDesign } from "@/modules/adminDesign/AdminDesign";
import { CustomsModule } from "@modules/customs";
import { CurrencyConverter } from "@/features/currency";
import { ShippingCalculator } from "@/features/sidebar/components/ShippingCalculator";
import { KYCForm } from "@/features/sidebar/components/KYCForm";
import { ProcurementSourcing } from "@/features/sidebar/components/ProcurementSourcing";
import { ShipmentTracker } from "@/features/sidebar/components/ShipmentTracker";
import { LogisticsMap } from "@/features/sidebar/components/LogisticsMap";
import { EarlyWarningSystem, SecurityGovernancePane } from "@/features/intelligence/components/IntelligenceSupportingElements";

// Lazy-Loaded Feature Modules
const StatsSection = lazy(() => import("@/features/dashboard").then(m => ({ default: m.StatsSection })));
const GovernmentShowcase = lazy(() => import("@/features/dashboard/components/GovernmentShowcase").then(m => ({ default: m.GovernmentShowcase })));
const NationalTradeObservatory = lazy(() => import("@/features/intelligence/components/NationalTradeObservatory").then(m => ({ default: m.NationalTradeObservatory })));
const EconomicKnowledgeGraph = lazy(() => import("@/features/intelligence/components/EconomicKnowledgeGraph").then(m => ({ default: m.EconomicKnowledgeGraph })));
const ScenarioSimulationEngine = lazy(() => import("@/features/intelligence/components/ScenarioSimulationEngine").then(m => ({ default: m.ScenarioSimulationEngine })));

interface WorkspaceContentProps {
  lang: "ku" | "ar";
  setLang: (lang: "ku" | "ar") => void;
}

// Custom corporate loader element
function SuspenseFallBack({ title }: { title: string }) {
  return (
    <div className="w-full h-80 flex flex-col items-center justify-center p-6 bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800">
      <div className="flex flex-col items-center gap-3">
        <div className="w-7 h-7 rounded-full border-4 border-[#0066FF] border-t-transparent animate-spin" />
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono select-none">{title}</span>
      </div>
    </div>
  );
}

export function WorkspaceContent({ lang, setLang }: WorkspaceContentProps) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // Sovereign Services Status Diagnostic Hook 
  const [diagnostics, setDiagnostics] = useState<{ gemini: string; maps: string; firebase: string }>({
    gemini: "Connected",
    maps: "Connected",
    firebase: "Connected"
  });

  useEffect(() => {
    fetch("/api/diagnostics")
      .then(res => res.json())
      .then(data => {
        if (data && data.gemini) {
          setDiagnostics(data);
        }
      })
      .catch(err => {
        console.error("Failed to fetch diagnostics:", err);
      });
  }, []);

  return (
    <main className="flex-1 min-h-0 overflow-y-auto px-3 sm:px-6 py-4 sm:py-6 scrollbar-thin dark:scrollbar-slate-800">
      <div className="max-w-7xl mx-auto w-full h-full flex flex-col gap-6">

        {/* DYNAMIC CONTENT SWITCHER */}
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="h-full flex flex-col"
          >
            
            {/* WORKSPACE 1: AI ASSISTANT & COMMAND CENTER */}
            {(pathname === "/" || pathname === "/assistant") && (
              <AdminDesign lang={lang} navigate={navigate} />
            )}

            {/* WORKSPACE 2: CUSTOMS */}
            {pathname === "/customs" && (
              <div className="w-full flex flex-col gap-6">
                <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-6 overflow-hidden">
                  <CustomsModule />
                </div>
              </div>
            )}

            {/* WORKSPACE 3: LOGISTICS */}
            {pathname === "/logistics" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 flex flex-col gap-6">
                  <div className="bg-white dark:bg-[#0f172a] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col gap-4">
                    <div className="border-b pb-3 border-slate-100 dark:border-slate-800">
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2 select-none">
                        <Compass className="w-5 h-5 text-blue-500" />
                        {lang === "ku" ? "چاودێری نەخشەی ڕاستەوخۆی ڕێچکەی بارەکان" : "تتبع الشحنات الملاحية الحية"}
                      </h3>
                    </div>
                    <div className="h-[350px] rounded-xl overflow-hidden bg-slate-100 border dark:border-slate-800">
                      <LogisticsMap />
                    </div>
                  </div>

                  <div className="bg-white dark:bg-[#0f172a] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col gap-3">
                    <div className="border-b pb-3 border-slate-100 dark:border-slate-800">
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white select-none">
                        {lang === "ku" ? "بەدواداچوونی گۆڕانکاری دۆخی بار" : "نظام تدقيق المانيفست والشحنات"}
                      </h3>
                    </div>
                    <ShipmentTracker />
                  </div>
                </div>

                <div className="lg:col-span-4 flex flex-col gap-6">
                  <div className="bg-white dark:bg-[#0f172a] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                    <ShippingCalculator />
                  </div>
                  <div className="bg-white dark:bg-[#0f172a] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                    <ProcurementSourcing />
                  </div>
                </div>
              </div>
            )}

            {/* WORKSPACE 4: BANKING */}
            {pathname === "/banking" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-5">
                  <div className="bg-white dark:bg-[#0f172a] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs h-full">
                    <CurrencyConverter />
                  </div>
                </div>
                
                <div className="lg:col-span-7 flex flex-col gap-6">
                  <div className="bg-white dark:bg-[#0f172a] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col gap-4">
                    <div className="border-b pb-3 border-slate-100 dark:border-slate-800">
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white select-none">
                        {lang === "ku" ? "نرخی ئاڵوگۆڕی هاوتەریب و ڕەسمی بانکی ناوەندی عێراق (IQD/USD)" : "منصة تداول الدينار العراقي (منظومة العقوبات)"}
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-green-500/5 rounded-xl border border-green-500/10">
                        <span className="text-xs text-slate-400">{lang === "ku" ? "نرخی فەرمی دەوڵەت" : "سعر الصرف الرسمي"}</span>
                        <div className="text-xl md:text-2xl font-black text-green-600 mt-1">1,310 BGW</div>
                        <span className="text-[10px] text-green-500 font-semibold">✓ {lang === "ku" ? "هاوسەنگکرا لەگەڵ بانکی ناوەندی" : "معتمد لدى البنك المركزي"}</span>
                      </div>
                      <div className="p-4 bg-amber-500/5 rounded-xl border border-amber-500/10">
                        <span className="text-xs text-slate-400">{lang === "ku" ? "نرخی هاوتەریبی بازاڕ" : "سعر السوق الموازي"}</span>
                        <div className="text-xl md:text-2xl font-black text-amber-600 mt-1">1,480 BGW</div>
                        <span className="text-[10px] text-amber-500 font-semibold">{lang === "ku" ? "گۆڕانکاری بەردەوام هەیە" : "تخضع للتحديث المتوازي"}</span>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-3 border border-slate-100 dark:border-slate-800">
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
                        {lang === "ku" ? "ڕامبەرى و بڕیار لەسەر حەواڵەکان" : "ضوابط التحاويل المالية وسیاسة الامتثال"}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal font-sans">
                        {lang === "ku"
                          ? "بەپێی ڕێنمایی نوێی وەزارەتی دارایی، سەرجەم حەواڵەی بازرگانان بۆ هەناردەکردنی کاڵاکان پێویستە لەڕێگەی سەکۆی ئەلیکترۆنی بانکی ناوەندی عێراقەوە تۆماربکرێت و هاوپێچی بڕوانامەی هاوردەکردن بێت."
                          : "بموجب تعليمات نافذة تمويل التجارة الخارجية، يجب تقديم المستندات الجمركية المرفقة ببيان الـ CIF للتأكد من مشروعية مصادر النقد الصعبة."}
                      </p>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-[#0f172a] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col gap-3">
                    <h4 className="font-bold text-xs uppercase text-[#0066FF] tracking-wider select-none">
                      {lang === "ku" ? "دڵنیایی و پێناسی فەرمی" : "المصارف المعتمدة"}
                    </h4>
                    <span className="text-xs font-semibold leading-relaxed text-slate-500 dark:text-slate-400">
                      {lang === "ku"
                        ? "بانکی ڕافیدەین و ڕەشید پڕۆسەی هاوردەکردنیان خێرا کردووە فەرموو مەکینەی حسابی تێچوون بخوێنەرەوە."
                        : "تم ربط كود الحوالات للجمارك مع مصارف الرافدين والرشيد والمصرف العراقي للتجارة (TBI)."}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* WORKSPACE 5: COMPLIANCE */}
            {pathname === "/compliance" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-4 bg-white dark:bg-[#0f172a] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                  <KYCForm />
                </div>
                <div className="lg:col-span-8 flex flex-col gap-6">
                  <div className="bg-white dark:bg-[#0f172a] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col gap-4">
                    <div className="border-b pb-3 border-slate-100 dark:border-slate-800">
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5 select-none">
                        <Briefcase className="w-4 h-4 text-blue-500 shrink-0" />
                        {lang === "ku" ? "یاساکانی هاوردەکردن و ڕوانگەی گومرگی دەوڵەت" : "حالة الامتثال والتراخيص الحكومية"}
                      </h3>
                    </div>
                    <div className="space-y-3.5 text-xs text-slate-600 dark:text-slate-300">
                      <div className="flex justify-between items-center py-2 border-b dark:border-slate-800">
                        <span className="font-medium">{lang === "ku" ? "پشکنینی بە فیشەکە ئەمنییەکان" : "التدقيق الأمني الفيدرالي"}</span>
                        <Badge className="bg-green-500 hover:bg-green-500/90 text-white font-bold">{lang === "ku" ? "تێپەڕیوە" : "مكتمل التدقيق"}</Badge>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b dark:border-slate-800">
                        <span className="font-medium">{lang === "ku" ? "بڕوانامەی گونجاوی بازرگانی" : "شهادة المنشأ والمطابقة النوعية"}</span>
                        <Badge className="bg-green-500 hover:bg-green-500/90 text-white font-bold">{lang === "ku" ? "تەواوکراوە" : "مؤهلة للتعرفة"}</Badge>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b dark:border-slate-800">
                        <span className="font-medium">{lang === "ku" ? "ڕادەی فاکتۆری متمانەکراو" : "تدقيق معايير السعر العادل (COGS)"}</span>
                        <Badge className="bg-[#0066FF] hover:bg-[#0066FF]/90 text-white font-bold">{lang === "ku" ? "لە پێداچوونەوەدایە" : "قيد التدقيق والتقييم"}</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-[#0f172a] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col gap-3">
                    <h4 className="font-bold text-xs uppercase text-[#F59E0B] select-none">
                      ⚠️ {lang === "ku" ? "لیستی ئاگادارکەرەوە فەرمییەکان" : "تنبيهات مكافحة التهرب والامتثال"}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
                      {lang === "ku" 
                        ? "ئەکاونتی ئەو كۆمپانیایانەی بە هاوردەكردنی ناڕوون تێوەگلاون ڕادەگیرێت و ڕووبەڕووی لێپرسینەوە دەبنەوە بەتایبەت لە مەرزە لۆجیستیکییەکان."
                        : "يرجى مراعاة أن أي تباين في القيمة المصرحة بها بنسبة تزيد عن 10% يعرض الشحنة لغرامة المادة 198 قانون الجمارك العراقي."}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* WORKSPACE 6: KNOWLEDGE BRAIN */}
            {pathname === "/knowledge" && (
              <div className="w-full h-full min-h-0 flex flex-col bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
                <div className="border-b pb-4 mb-4 border-slate-100 dark:border-slate-800">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5 select-none">
                    <Database className="w-4 h-4 text-blue-500 shrink-0" />
                    {lang === "ku" ? "تۆڕی زانیاری بەستراوی هەواڵگری بازرگانی" : "خارطة العلاقات الاقتصادية والترابط التجاري"}
                  </h3>
                </div>
                <div className="flex-1 min-h-[480px]">
                  <Suspense fallback={<SuspenseFallBack title="Syncing Economic Knowledge Map..." />}>
                    <EconomicKnowledgeGraph />
                  </Suspense>
                </div>
              </div>
            )}

            {/* WORKSPACE 7: ANALYTICS */}
            {pathname === "/analytics" && (
              <div className="flex flex-col gap-6">
                <Suspense fallback={<SuspenseFallBack title="Calculating National Statistics..." />}>
                  <StatsSection />
                </Suspense>
                <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
                  <div className="border-b pb-4 mb-4 border-slate-100 dark:border-slate-800">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5 select-none">
                      <TrendingUp className="w-4 h-4 text-indigo-500 shrink-0" />
                      {lang === "ku" ? "داشبۆردی شیکاری جووڵەی گشتی بازاڕ و بارەکان" : "المرصد الوطني وجداول التدفقات الاقتصادية"}
                    </h3>
                  </div>
                  <Suspense fallback={<SuspenseFallBack title="Loading Trade Observatory Indicators..." />}>
                    <NationalTradeObservatory />
                  </Suspense>
                </div>
              </div>
            )}

            {/* WORKSPACE 8: COMMAND CENTER */}
            {pathname === "/command" && (
              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-8 bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
                    <div className="border-b pb-4 mb-4 border-slate-100 dark:border-slate-800">
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5 select-none">
                        <Terminal className="w-4 h-4 text-indigo-500 shrink-0" />
                        {lang === "ku" ? "سەکۆی لێکدانەوە گومرگیەکان و هاوشێوەسازی بڕیارەکان" : "غرفة المحاكاة والتحليل السياسي للمخاطر"}
                      </h3>
                    </div>
                    <Suspense fallback={<SuspenseFallBack title="Warming Scenario Simulation Engine..." />}>
                      <ScenarioSimulationEngine onReportGenerated={() => {}} />
                    </Suspense>
                  </div>
                  
                  <div className="lg:col-span-4 flex flex-col gap-6">
                    <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex-1">
                      <EarlyWarningSystem />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
                    <SecurityGovernancePane />
                  </div>
                </div>
              </div>
            )}

            {/* WORKSPACE: GOVERNMENT SHOWCASE */}
            {pathname === "/showcase" && (
              <div className="w-full">
                <Suspense fallback={<SuspenseFallBack title="Assembling Cabinet Digital Cockpit..." />}>
                  <GovernmentShowcase />
                </Suspense>
              </div>
            )}

            {/* WORKSPACE 9: ADMINISTRATION */}
            {pathname === "/admin" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 flex flex-col gap-6">
                  <div className="bg-slate-900 text-slate-100 p-6 rounded-2xl border border-slate-800 font-mono text-xs shadow-xl flex flex-col gap-4 select-text">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3 select-none">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-ping shrink-0" />
                        <span className="font-bold text-slate-300">CORE_SYSTEM_SYSLOG // SECURE TERMINAL</span>
                      </div>
                      <span className="text-[10px] text-slate-500">CLEARANCE_LEVEL_4 // ENCRYPTED</span>
                    </div>
                    
                    <div className="space-y-2 max-h-[350px] overflow-y-auto custom-scrollbar leading-relaxed">
                      <p className="text-slate-400">[2026-05-30 23:44:02 BGW] <span className="text-green-500">INFO</span> Initializing state-authorized kernel routing interface...</p>
                      <p className="text-slate-400">[2026-05-30 23:44:03 BGW] <span className="text-green-500">INFO</span> Connected to Iraq National Customs Authority network database (ASYCUDA API).</p>
                      <p className="text-slate-400">[2026-05-30 23:44:05 BGW] <span className="text-green-500">INFO</span> Synced currency exchange market index with Central Bank.</p>
                      <p className="text-slate-400">[2026-05-30 23:44:11 BGW] <span className="text-green-500">INFO</span> Secure tunnel established over port 3000 to primary server.</p>
                      <p className="text-slate-400">[2026-05-30 23:44:20 BGW] <span className="text-blue-400">AUDIT</span> User MSc. Diplomatic Arbitrator accessed active KYC registry database.</p>
                      <p className="text-slate-400">[2026-05-30 23:44:22 BGW] <span className="text-green-500">INFO</span> Running routine border latency check for zaxho, shalamcheh, um-qasr.</p>
                      <p className="text-slate-400">[2026-05-30 23:44:25 BGW] <span className="text-amber-500">WARN</span> Latency variance detected on Mandali border checkpoint; retrying connection...</p>
                      <p className="text-slate-400">[2026-05-30 23:44:28 BGW] <span className="text-green-500">INFO</span> Mandali checkpoint interface recovered. Operation status: IDEAL.</p>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-4 flex flex-col gap-6 font-sans select-none">
                  <div className="bg-white dark:bg-[#0f172a] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col gap-3">
                    <h4 className="font-bold text-xs uppercase text-slate-500 tracking-wider">
                      {lang === "ku" ? "بەهێزکەرى ئاسایش" : "الحماية الفيدرالية"}
                    </h4>
                    <span className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {lang === "ku"
                        ? "دەتوانیت لۆگە نوێیەکان تاقیک بکەیتەوە لەگەڵ هاوتاکانی دەوڵەت، سیستەمی یەکپارچە پارێزراوە."
                        : "سجل الأمان التشغيلي مراقب بالكامل من وزارة الاتصالات وجهاز الأمن الوطني العراقي."}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* WORKSPACE 10: SETTINGS */}
            {pathname === "/settings" && (
              <div className="max-w-2xl bg-white dark:bg-[#0f172a] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col gap-6 font-sans">
                <div className="border-b pb-4 border-slate-100 dark:border-slate-800">
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base select-none">
                    {lang === "ku" ? "ڕێکخستنە سەرەکییەکان" : "إعدادات وتفضيلات النظام"}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 select-none">
                    {lang === "ku" ? "ڕێکخستن... گۆڕینی زمان و بڕوانامەی سیستەمەکە لێرەیە." : "تعديل لغة النظام ومطابقة خوادم البيانات والمفاتيح السرية"}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 select-none">
                      {lang === "ku" ? "زمانی بەکاربردن" : "لغة واجهة المستخدم"}
                    </label>
                    <div className="flex gap-2.5 select-none">
                      <Button 
                        type="button"
                        onClick={() => setLang("ku")}
                        className={`rounded-xl px-4 py-2.5 text-xs font-bold leading-none ${lang === "ku" ? "bg-[#0066FF] text-white hover:bg-[#0066FF]/90 font-semibold" : "bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium"}`}
                      >
                        Kurdî (سۆرانی)
                      </Button>
                      <Button 
                        type="button"
                        onClick={() => setLang("ar")}
                        className={`rounded-xl px-4 py-2.5 text-xs font-bold leading-none ${lang === "ar" ? "bg-[#0066FF] text-white hover:bg-[#0066FF]/90 font-semibold" : "bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium"}`}
                      >
                        العربية (عربي)
                      </Button>
                    </div>
                  </div>

                  {/* Sovereign Services Status Dashboard */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                    <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 select-none">
                      {lang === "ku" ? "بارودۆخی خزمەتگوزارییە حکومییەکان" : "حالة الخدمات السحابية والسيادية"}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-slate-500">Gemini AI API</span>
                        <Badge className={`text-[9px] font-bold ${diagnostics.gemini === 'Connected' ? 'bg-green-500 text-white' : diagnostics.gemini === 'Missing' ? 'bg-amber-500 text-white' : 'bg-rose-500 text-white'}`}>
                          {diagnostics.gemini === 'Connected' ? (lang === 'ku' ? 'بەستراوە' : 'متصل') : diagnostics.gemini === 'Missing' ? (lang === 'ku' ? 'بونی نییە' : 'مفقود') : (lang === 'ku' ? 'ناتەواو' : 'غير صالح')}
                        </Badge>
                      </div>
                      <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-slate-500">Google Maps Platform</span>
                        <Badge className={`text-[9px] font-bold ${diagnostics.maps === 'Connected' ? 'bg-green-500 text-white' : diagnostics.maps === 'Missing' ? 'bg-amber-500 text-white' : 'bg-rose-500 text-white'}`}>
                          {diagnostics.maps === 'Connected' ? (lang === 'ku' ? 'بەستراوە' : 'متصل') : diagnostics.maps === 'Missing' ? (lang === 'ku' ? 'بونی نییە' : 'مفقود') : (lang === 'ku' ? 'ناتەواو' : 'غير صالح')}
                        </Badge>
                      </div>
                      <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-slate-500">Firebase Database</span>
                        <Badge className={`text-[9px] font-bold ${diagnostics.firebase === 'Connected' ? 'bg-green-500 text-white' : diagnostics.firebase === 'Missing' ? 'bg-amber-500 text-white' : 'bg-rose-500 text-white'}`}>
                          {diagnostics.firebase === 'Connected' ? (lang === 'ku' ? 'بەستراوە' : 'متصل') : diagnostics.firebase === 'Missing' ? (lang === 'ku' ? 'بونی نییە' : 'مفقود') : (lang === 'ku' ? 'ناتەواو' : 'غير صالح')}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs select-none">
                    <div>
                      <span className="font-bold text-slate-700 dark:text-slate-300">{lang === "ku" ? "دەرچوون لە ئەکاونت" : "تسجيل الخروج الأمن"}</span>
                      <p className="text-[10px] text-slate-400 mt-0.5">{lang === "ku" ? "سێشنی چالاک پساوە دەکاتەوە" : "إنهاء الجلسة الحالية وتجميد الكود"}</p>
                    </div>
                    <Button type="button" variant="destructive" size="sm" className="rounded-xl px-4 text-xs font-bold font-semibold">
                      {lang === "ku" ? "دەرچوون" : "الخروج"}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* WORKSPACE 11: PROFILE */}
            {pathname === "/profile" && (
              <div className="max-w-2xl bg-white dark:bg-[#0f172a] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col gap-6 font-sans">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-[#071739] border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-100 font-black text-2xl shadow-md select-none">
                    MA
                  </div>
                  <div>
                    <div className="flex items-center gap-2 select-text">
                      <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                        MSc. Diplomatic Arbitrator
                      </h3>
                      <Badge className="bg-[#0066FF] hover:bg-[#0066FF]/90 text-white font-bold leading-none text-[9px] uppercase tracking-wider py-0.5 px-1.5 rounded-lg select-none">State Admin</Badge>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 select-text">diplomaticarbitrator@gmail.com</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4 text-xs text-slate-600 dark:text-slate-300 select-text">
                  <div className="flex justify-between py-2 border-b dark:border-slate-800">
                    <span className="font-semibold text-slate-400 select-none">{lang === "ku" ? "ناسنامەی دیجیتاڵی" : "الرقم التعريفي المميز"}</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-100">IDG-9CB05948-2026</span>
                  </div>
                  <div className="flex justify-between py-2 border-b dark:border-slate-800">
                    <span className="font-semibold text-slate-400 select-none">{lang === "ku" ? "ئاستی مەکینە" : "صلاحية المرور والاعتماد"}</span>
                    <span className="font-bold text-green-600 dark:text-green-400">LEVEL_4_FULL_TRUST</span>
                  </div>
                  <div className="flex justify-between py-2 border-b dark:border-slate-800">
                    <span className="font-semibold text-slate-400 select-none">{lang === "ku" ? "بەکاربەری دەوڵەت" : "الوزارة التابع لها"}</span>
                    <span className="font-bold text-slate-800 dark:text-slate-100">{lang === "ku" ? "دیوانی وەزیران / چاودێری بازرگانی عێراق" : "ديوان مجلس الوزراء وجهاز الأمن الوطني الفيدرالي"}</span>
                  </div>
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>

      </div>
    </main>
  );
}
export default WorkspaceContent;
