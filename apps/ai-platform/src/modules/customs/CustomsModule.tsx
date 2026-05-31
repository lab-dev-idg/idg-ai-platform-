import React, { useState } from 'react';
import { CustomsCalculator, AdminPanel, GoogleDrivePanel, AICustomsImportAssistant } from './features';
import { cn } from '@idg/ui';
import { Calculator, ShieldAlert, Cpu, Layers, BadgeAlert, Sparkles, Lock, Cloud } from 'lucide-react';
import { useSettingsStore } from '@/store/settingsStore';

interface WorkflowItem {
  id: string;
  declarationId: string;
  hsCode: string;
  status: 'APPROVED' | 'UNDER_REVIEW' | 'PENDING' | 'ESCALATED';
  broker: string;
  date: string;
  itemsCount: number;
}

interface OperationalEvent {
  id: string;
  timestamp: string;
  type: 'SHIPMENT' | 'CUSTOMS' | 'AI_NOTICE' | 'AUDIT';
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  messageKu: string;
  messageAr: string;
  hash?: string;
}

const LIVE_WORKFLOWS: WorkflowItem[] = [
  { id: '1', declarationId: 'IQ-DEC-2026-0041', hsCode: '8517.18.00', status: 'APPROVED', broker: 'Al-Mansour Freight Ltd', date: '25-28 08:30', itemsCount: 412 },
  { id: '2', declarationId: 'IQ-DEC-2026-0042', hsCode: '8471.30.10', status: 'UNDER_REVIEW', broker: 'Mesopotamia Brokerage', date: '25-28 09:12', itemsCount: 88 },
  { id: '3', declarationId: 'IQ-DEC-2026-0043', hsCode: '3004.90.00', status: 'PENDING', broker: 'Erbil Trade Logistics', date: '25-28 10:05', itemsCount: 1540 },
  { id: '4', declarationId: 'IQ-DEC-2026-0044', hsCode: '8703.23.19', status: 'ESCALATED', broker: 'Basra Shipping Union', date: '25-28 10:48', itemsCount: 14 }
];

const OPERATIONAL_EVENTS: OperationalEvent[] = [
  { id: 'evt_1', timestamp: '10:48:15', type: 'AUDIT', severity: 'CRITICAL', messageKu: 'جیاوازی تاریفەی کۆدی گومرگی دەستنیشانکرا لەلایەن سیستەمی خۆکار بۆ باری ٨٧٠٣.', messageAr: 'تم رصد اختلاف في رمز التعرفة الجمركية عبر التقييم الآلي للشحنة رقم 8703.', hash: 'sha256:0d6c...f4a1' },
  { id: 'evt_2', timestamp: '10:15:30', type: 'AI_NOTICE', severity: 'INFO', messageKu: 'پێشنیارەکانی پۆلێنکردنی کۆدی HS خۆکار بەرزکرانەوە بۆ ئامێرەکانی پەیوەندی.', messageAr: 'تم تحسين تصنيفات التعرفة الجمركية الذكية آلياً لأجهزة شبكات الاتصال.' },
  { id: 'evt_3', timestamp: '09:40:12', type: 'CUSTOMS', severity: 'WARNING', messageKu: 'بەندەری باشووری ئوم قەسر ڕاپۆرتی لەسەر قەرەباڵغی بەرزی کاری گومرگی دا.', messageAr: 'ميناء أم قصر الجنوبي يسجل حجم تدفق جمركي مرتفع حالياً.' }
];

export function CustomsModule() {
  const [activeTab, setActiveTab] = useState<'calculator' | 'admin' | 'drive' | 'assistant'>('assistant');
  const { lang } = useSettingsStore();

  const customsTranslations = {
    ku: {
      title: "کابینەی کارپێکردنی گومرگی هۆشمەند (Customs Cockpit)",
      subtitle: "سیستەمی ناوەندی بۆ چاودێری، خەمڵاندنی تاریفە و پێداچوونەوەی مەرجەکانی بازاتی هاوردە و هەناردەی عێراق ٢٠٢٦.",
      calculatorTab: "یاساکاری و حیسابکەر",
      adminTab: "یاسا و کارگێڕی مەرز",
      driveTab: "هەوری گوگڵ درایڤ",
      assistantTab: "ڕاوێژکاری گومرگی هۆشمەند (AI Assistant)",
      domain: "کەرتی کارکردن: دەسەڵاتی دەروازە گشتییەکان",
      compliance: "پابەندبوون: پارێزراو",
      version: "وەشان: v2.6.0",
      gateway: "ناسێنەر: AX-4001"
    },
    ar: {
      title: "مقصورة الإجراءات الجمركية الذكية (Customs Cockpit)",
      subtitle: "النظام المركزي للمراقبة، تقدير التعرفة والتدقيق في شروط شحنات الاستيراد والتصدير العراقية ٢٠٢٦.",
      calculatorTab: "الحاسبة وتقدير الرسوم",
      adminTab: "السياسات الإدارية والتعريفية",
      driveTab: "سحابة Google Drive",
      assistantTab: "مساعد الاستيراد الذكي (AI Customs)",
      domain: "نطاق العمل: سلطة الجمارك العراقية",
      compliance: "الامتثال: مؤمن بالكامل",
      version: "الإصدار: v2.6.0",
      gateway: "بوابة: AX-4001"
    }
  };

  const localText = customsTranslations[lang === 'ku' ? 'ku' : 'ar'];

  return (
    <div className="space-y-6" id="customs-module">
      {/* 2. Professional Customs Header */}
      <div className="p-6 bg-gradient-to-r from-[#071739] via-[#092257] to-[#071739] text-white rounded-[24px] shadow-xl border border-white/10 relative overflow-hidden flex flex-col gap-4">
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 z-10">
          <div className="flex items-start gap-3">
            <div className="mt-1 p-2 bg-blue-500/20 text-blue-400 rounded-xl border border-blue-500/35 shrink-0">
              <Cpu className="w-5 h-5 text-[#0066FF] animate-pulse" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg md:text-xl font-bold tracking-tight text-white">{localText.title}</h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-sans font-bold tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  {lang === 'ku' ? "دەروازەکە چالاکە" : "البوابة نشطة"}
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[9px] font-sans font-bold tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/35">
                  {lang === 'ku' ? "پابەندبوونی گومرگی: چالاک" : "الامتثال الجمركي: مفعل"}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium mt-1 leading-relaxed max-w-3xl">
                {localText.subtitle}
              </p>
            </div>
          </div>

          {/* Swithers inside operations header header area */}
          <div className="flex p-1 bg-[#0b245c] rounded-xl border border-white/10 self-start md:self-auto shrink-0 animate-fade-in gap-1" id="customs-module-tabs">
            <button
              onClick={() => setActiveTab('assistant')}
              className={cn(
                "px-3 py-1.5 text-xs font-semibold whitespace-nowrap rounded-lg transition-all flex items-center gap-1.5 cursor-pointer",
                activeTab === 'assistant' 
                  ? "bg-[#0066FF] text-white font-bold shadow-md shadow-blue-500/20" 
                  : "text-slate-200 hover:bg-white/5 hover:text-white"
              )}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" /> {localText.assistantTab}
            </button>
            <button
              onClick={() => setActiveTab('calculator')}
              className={cn(
                "px-3 py-1.5 text-xs font-semibold whitespace-nowrap rounded-lg transition-all flex items-center gap-1.5 cursor-pointer",
                activeTab === 'calculator' 
                  ? "bg-[#0066FF] text-white font-bold shadow-md shadow-blue-500/20" 
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              )}
            >
              <Calculator className="w-3.5 h-3.5" /> {localText.calculatorTab}
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={cn(
                "px-3 py-1.5 text-xs font-semibold whitespace-nowrap rounded-lg transition-all flex items-center gap-1.5 cursor-pointer",
                activeTab === 'admin' 
                  ? "bg-[#0066FF] text-white font-bold shadow-md shadow-blue-500/20" 
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              )}
            >
              <ShieldAlert className="w-3.5 h-3.5" /> {localText.adminTab}
            </button>
            <button
              onClick={() => setActiveTab('drive')}
              className={cn(
                "px-3 py-1.5 text-xs font-semibold whitespace-nowrap rounded-lg transition-all flex items-center gap-1.5 cursor-pointer",
                activeTab === 'drive' 
                  ? "bg-[#0066FF] text-white font-bold shadow-md shadow-blue-500/20" 
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              )}
            >
              <Cloud className="w-3.5 h-3.5" /> {localText.driveTab}
            </button>
          </div>
        </div>

        {/* Small metadata row */}
        <div className="flex flex-wrap items-center justify-between text-[10px] font-mono text-slate-400 border-t border-white/5 pt-3 mt-1 gap-2 z-10">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="flex items-center gap-1"><Layers className="w-3 h-3 text-[#0066FF]" /> {localText.domain}</span>
            <span className="hidden sm:inline text-white/10">|</span>
            <span className="flex items-center gap-1"><BadgeAlert className="w-3 h-3 text-emerald-500" /> {localText.compliance}</span>
          </div>
          <div className="flex items-center gap-4">
            <span>{localText.version}</span>
            <span>{localText.gateway}</span>
          </div>
        </div>
      </div>

      {activeTab === 'assistant' ? (
        <AICustomsImportAssistant />
      ) : activeTab === 'calculator' ? (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          {/* Main Calculator */}
          <div className="xl:col-span-8 bg-white border rounded-[24px] p-6 shadow-xs border-slate-100/80 dark:border-slate-800">
            <CustomsCalculator />
          </div>

          {/* Right Operational Cockpit Panel */}
          <div className="xl:col-span-4 space-y-4">
            {/* Live Customs Workflows */}
            <div className="bg-white border rounded-[24px] p-5 shadow-xs border-slate-100/80 dark:border-slate-800">
              <h3 className="text-xs font-black text-[#071739] dark:text-white uppercase tracking-wider flex items-center justify-between mb-3.5 pb-2 border-b border-slate-100 select-none">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-3 rounded bg-[#0066FF]" />
                  {lang === 'ku' ? "دۆخی رەوتی گومرگ" : "سلسلة الإجراءات الجمركية"}
                </span>
                <span className="text-[9px] bg-blue-50 text-[#0066FF] px-1.5 rounded font-sans font-bold select-none">{lang === 'ku' ? "٤ چالاک" : "٤ نشط"}</span>
              </h3>

              <div className="space-y-3">
                {LIVE_WORKFLOWS.map((item) => {
                  let badgeStyle = "bg-slate-50 text-slate-600 border-slate-200/60";
                  if (item.status === 'APPROVED') badgeStyle = "bg-emerald-50 text-emerald-700 border-emerald-200/60";
                  if (item.status === 'UNDER_REVIEW') badgeStyle = "bg-blue-50 text-[#0066FF]/90 border-blue-200/60";
                  if (item.status === 'ESCALATED') badgeStyle = "bg-rose-50 text-rose-700 border-rose-200/60";

                  const localizedStatus = {
                    APPROVED: lang === 'ku' ? "پەسەندکراو" : "موافق عليه",
                    UNDER_REVIEW: lang === 'ku' ? "لە ژێر وردبینی" : "قيد المراجعة",
                    PENDING: lang === 'ku' ? "چاوەڕوانە" : "قيد الانتظار",
                    ESCALATED: lang === 'ku' ? "سەربارەکراوە" : "تم التصعيد"
                  }[item.status];

                  return (
                    <div key={item.id} className="p-3 border rounded-xl hover:bg-slate-50/50 transition-all border-slate-100/80 flex flex-col gap-2 relative">
                      <div className="flex items-center justify-between text-[11px] font-mono font-bold">
                        <span className="text-slate-700">{item.declarationId}</span>
                        <span className={`px-2 py-0.5 rounded text-[8px] border font-sans font-black tracking-wide ${badgeStyle}`}>
                          {localizedStatus}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-slate-500 font-semibold">
                        <span>{lang === 'ku' ? "بریکار:" : "المخلص:"} {item.broker}</span>
                        <span>{item.date}</span>
                      </div>
                      <div className="flex items-center justify-between text-[9px] font-sans text-slate-400 bg-slate-50/50 p-1.5 rounded-lg border border-slate-100 mt-1">
                        <span>{lang === 'ku' ? "کۆدی گومرگی:" : "الرمز الجمركي:"} {item.hsCode}</span>
                        <span>{lang === 'ku' ? `بڕ: ${item.itemsCount} دانە` : `الكمية: ${item.itemsCount} وحدة`}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sovereign Operations Audit Stream */}
            <div className="bg-white border rounded-[24px] p-5 shadow-xs border-slate-100/80 dark:border-slate-800">
              <h3 className="text-xs font-black text-[#071739] dark:text-white uppercase tracking-wider flex items-center gap-1.5 mb-3.5 pb-2 border-b border-slate-100 select-none">
                <span className="w-1.5 h-3 rounded bg-amber-500" />
                {lang === 'ku' ? "رووداوەکانی وەزارەتی گومرگ" : "أحداث التدقيق السيادي"}
              </h3>

              <div className="space-y-3">
                {OPERATIONAL_EVENTS.map((evt) => (
                  <div key={evt.id} className="flex gap-2.5 items-start text-[10px] leading-relaxed">
                    <span className="text-[9px] text-slate-400 font-mono pt-0.5">{evt.timestamp}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          evt.severity === 'CRITICAL' ? 'bg-rose-500 animate-pulse' : 
                          evt.severity === 'WARNING' ? 'bg-amber-500' : 'bg-blue-500'
                        }`} />
                        <span className="font-bold text-slate-700">
                          {lang === 'ku' ? evt.messageKu : evt.messageAr}
                        </span>
                      </div>
                      {evt.hash && (
                        <div className="mt-1 text-[8px] font-mono text-slate-400 select-all border border-dashed border-slate-100 p-1 bg-slate-50/50 rounded flex items-center justify-between">
                          <span>{evt.hash}</span>
                          <span className="text-[7px] text-[#0066FF] flex items-center gap-0.5">
                            <Lock className="w-2.5 h-2.5" /> 
                            {lang === 'ku' ? "سیادی پارێزراو" : "سيادي مؤمن"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : activeTab === 'admin' ? (
        <div className="bg-white border rounded-[24px] p-6 shadow-xs border-slate-100/80 dark:border-slate-800">
          <AdminPanel />
        </div>
      ) : (
        <div className="bg-white border rounded-[24px] p-6 shadow-xs border-slate-100/80 dark:border-slate-800">
          <GoogleDrivePanel />
        </div>
      )}

      {/* 7. Contextual AI Operations Co-Pilot Triggers */}
      <div className="p-5 bg-[#0066FF]/5 border border-[#0066FF]/10 rounded-[24px] shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#0066FF]/15 text-[#0066FF] rounded-xl border border-blue-500/20 shrink-0 select-none">
            <Sparkles className="w-5 h-5 text-[#0066FF] animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#071739] dark:text-white uppercase tracking-wider flex items-center gap-2">
              <span>{lang === 'ku' ? "سیستەمی هۆشمەندی نیشتمانی" : "النظام الذكي الوطني"}</span>
              <span className="text-[9px] bg-[#0066FF]/15 text-[#0066FF] px-1.5 py-0.5 rounded font-sans font-black select-none tracking-widest leading-none">
                {lang === 'ku' ? "ئامادەیە" : "جاهز"}
              </span>
            </h4>
            <p className="text-[11px] text-slate-500 font-semibold mt-1 leading-normal">
              {lang === 'ku' 
                ? "پرسیار یان لێکدانەوەی خێرا سەبارەت بە مانیفێست بەکاربهێنە بە یارمەتی زیرەکی دەستکرد لێرەوە." 
                : "اطرح استفسارات فورية وتحليلات سريعة للبيانات الجمركية بالتنسيق مع مساعد الذكاء الاصطناعي."}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 justify-end shrink-0">
          <button 
            onClick={() => {
              window.location.href = `/?prompt=${encodeURIComponent('Check HS tariff classification for electronics and communication devices')}`;
            }}
            className="px-3 py-2 bg-white border border-slate-200 text-[#071739] hover:bg-slate-50 rounded-xl text-[10px] font-bold shadow-2xs cursor-pointer hover:border-[#0066FF]/25 hover:text-[#0066FF] transition-all whitespace-nowrap"
          >
            🔍 {lang === 'ku' ? "پۆلێنکردنی کۆدی HS بۆ ئەلیکترۆنی" : "فحص تصنيف HS للالكترونيات"}
          </button>
          
          <button 
            onClick={() => {
              window.location.href = `/?prompt=${encodeURIComponent('Calculate estimated import duty and CIF multiplier values for commercial shipments')}`;
            }}
            className="px-3 py-2 bg-white border border-slate-200 text-[#071739] hover:bg-slate-50 rounded-xl text-[10px] font-bold shadow-2xs cursor-pointer hover:border-[#0066FF]/25 hover:text-[#0066FF] transition-all whitespace-nowrap"
          >
            📊 {lang === 'ku' ? "حیسابکردنی باجی باری بازرگانی" : "حساب رسوم الشحنات التجارية"}
          </button>
          
          <button 
            onClick={() => {
              window.location.href = `/?prompt=${encodeURIComponent('Audit recent compliance exceptions, security flags, and brokerage lists')}`;
            }}
            className="px-3 py-2 bg-white border border-slate-200 text-[#071739] hover:bg-slate-50 rounded-xl text-[10px] font-bold shadow-2xs cursor-pointer hover:border-[#0066FF]/25 hover:text-[#0066FF] transition-all whitespace-nowrap"
          >
            🛡️ {lang === 'ku' ? "پێداچوونەوەی پابەندبوونەکانی دوایی" : "تدقيق استثناءات الامتثال"}
          </button>
        </div>
      </div>

      <div className="text-[10px] text-slate-400 font-sans flex justify-between items-center bg-white border px-4 py-2.5 rounded-2xl shadow-2xs" id="customs-status-footer">
        <span className="font-semibold">{lang === 'ku' ? "دۆخی گومرگ: مۆڵەتپێدراو" : "الحالة الأمنية: جاهز"}</span>
        <span className="font-semibold">
          {lang === 'ku' ? "بەرێوەبەرایەتی گشتی دەروازە گومرگییەکان" : "المديرية العامة للمنافذ الجمركية"}
        </span>
      </div>
    </div>
  );
}

