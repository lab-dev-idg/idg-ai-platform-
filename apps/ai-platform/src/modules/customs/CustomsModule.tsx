import React, { useState } from 'react';
import { CustomsCalculator, AdminPanel } from './features';
import { cn } from '@idg/ui';
import { Calculator, ShieldAlert, Cpu, Layers, BadgeAlert, Sparkles } from 'lucide-react';
import { useSettingsStore } from '@/store/settingsStore';

export function CustomsModule() {
  const [activeTab, setActiveTab] = useState<'calculator' | 'admin'>('calculator');
  const { lang } = useSettingsStore();

  const customsTranslations = {
    ku: {
      title: "کابینەی کارپێکردنی گومرگی هۆشمەند (Customs Cockpit)",
      subtitle: "سیستەمی ناوەندی بۆ چاودێری، خەمڵاندنی تاریفە و پێداچوونەوەی مەرجەکانی بازاتی هاوردە و هەناردەی عێراق ٢٠٢٦.",
      calculatorTab: "یاساکاری و حیسابکەر",
      adminTab: "یاسا و کارگێڕی مەرز",
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
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-mono font-bold tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  GATEWAY ACTIVE // CORE_NET_OK
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[9px] font-mono font-bold tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/35">
                  SYSTEM COMPLIANCE: ENFORCED
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium mt-1 leading-relaxed max-w-3xl">
                {localText.subtitle}
              </p>
            </div>
          </div>

          {/* Swithers inside operations header header area */}
          <div className="flex p-1 bg-[#0b245c] rounded-xl border border-white/10 self-start md:self-auto shrink-0" id="customs-module-tabs">
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

      {activeTab === 'calculator' ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg bg-white/70 backdrop-blur-md shadow-2xs hover:bg-white transition-all border-slate-100" id="customs-compliance-card">
              <h3 className="text-sm font-bold text-[#071739] flex items-center gap-2">
                <span className="w-1 h-3 rounded bg-blue-500" />
                {lang === 'ku' ? "دەرپەڕاندن و ترانزێت" : "الترخيص والعبور اللوجستي"}
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed font-semibold">
                {lang === 'ku' 
                  ? "کاری ڕێکخستنی مانیفێست بەپێی ستانداردە جیهانییەکان و مۆڵەتنامەکانی هاوردەی نوێ."
                  : "تنظيم المنفست الجمركي ومطابقة شحنات العبور مع معايير ترخيص هيئة المنافذ."}
              </p>
            </div>

            <div className="p-4 border rounded-lg bg-white/70 backdrop-blur-md shadow-2xs hover:bg-white transition-all border-slate-100" id="customs-tariffs-card">
              <h3 className="text-sm font-bold text-[#071739] flex items-center gap-2">
                <span className="w-1 h-3 rounded bg-blue-500" />
                {lang === 'ku' ? "پۆلێنکردنی تاریفە و کۆدی HS" : "تصنيف التعرفة ورموز النظام المنسق"}
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed font-semibold">
                {lang === 'ku'
                  ? "پۆلێنکردنی کاڵا بازرگانییەکان، جێبەجێکردنی باجی گومرگی دروست، و کۆنتڕۆڵی ڕێگرییەکان."
                  : "توجيه تصنيف وترميز البضائع، فرض الرسوم الدقيقة، وتشديد معايير المراقبة الجمركية."}
              </p>
            </div>
          </div>

          <div className="bg-white border rounded-[24px] p-6 shadow-xs border-slate-100/80 dark:border-slate-800">
            <CustomsCalculator />
          </div>
        </div>
      ) : (
        <div className="bg-white border rounded-[24px] p-6 shadow-xs border-slate-100/80 dark:border-slate-800">
          <AdminPanel />
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
              <span>AI Operations Co-Pilot</span>
              <span className="text-[9px] bg-[#0066FF]/15 text-[#0066FF] px-1.5 py-0.5 rounded font-mono font-black select-none tracking-widest leading-none">READY</span>
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

      <div className="text-[10px] text-slate-400 font-mono flex justify-between items-center bg-white border px-4 py-2.5 rounded-2xl shadow-2xs" id="customs-status-footer">
        <span className="font-semibold">{lang === 'ku' ? "دۆخی گومرگ: مۆڵەتپێدراو" : "الحالة الأمنية: جاهز"}</span>
        <span className="font-semibold">IDG TERMINAL SEC_v2.6</span>
      </div>
    </div>
  );
}

