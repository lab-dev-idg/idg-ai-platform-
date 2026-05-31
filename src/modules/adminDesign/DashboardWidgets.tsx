import React from "react";
import { ArrowUpRight, ArrowDownRight, Clock, CheckCircle2, ExternalLink, ShieldAlert, Compass, Sparkles } from "lucide-react";
import { Badge } from "@/shared/ui/badge";

interface WidgetProps {
  lang: "ku" | "ar";
  navigate: (path: string) => void;
  setActiveCenterTab?: (tab: "command" | "assistant") => void;
}

// 1. KPI Cards Component
export function KPICards({ lang }: { lang: "ku" | "ar" }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
      {/* Card 1: Active Transactions */}
      <div className="bg-white dark:bg-[#0f172a] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-blue-500/30 transition flex flex-col justify-between relative overflow-hidden group">
        <span className="text-[10px] text-slate-400 font-bold select-none truncate">
          {lang === "ku" ? "کارامەییە چالاکەکان" : "المعاملات النشطة اليوم"}
        </span>
        <div className="mt-2 flex items-baseline justify-between select-text">
          <span className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">٤،٢٨٠</span>
          <span className="text-[10px] text-green-500 font-bold flex items-center gap-0.5">
            <ArrowUpRight className="w-3 h-3" /> +12.4%
          </span>
        </div>
        <div className="mt-3 text-[9px] text-slate-500 font-medium flex items-center gap-1 select-none">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span>{lang === "ku" ? "لە کاتی ڕاستەقینە" : "تحديث مباشر"}</span>
        </div>
      </div>

      {/* Card 2: Customs Clearances Today */}
      <div className="bg-white dark:bg-[#0f172a] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-blue-500/30 transition flex flex-col justify-between relative overflow-hidden group">
        <span className="text-[10px] text-slate-400 font-bold select-none truncate">
          {lang === "ku" ? "ڕێکارە گومرگییەکانی ئەمڕۆ" : "المخلصات الجمركية اليوم"}
        </span>
        <div className="mt-2 flex items-baseline justify-between select-text">
          <span className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">٢،١٥٠</span>
          <span className="text-[10px] text-green-500 font-bold flex items-center gap-0.5">
            <ArrowUpRight className="w-3 h-3" /> +8.2%
          </span>
        </div>
        <div className="mt-3 text-[9px] text-slate-500 font-medium flex items-center gap-1 select-none">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          <span>{lang === "ku" ? "سەکۆی فیدراڵی" : "المنصة الفيدرالية"}</span>
        </div>
      </div>

      {/* Card 3: National Risk Index */}
      <div className="bg-white dark:bg-[#0f172a] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-rose-500/30 transition flex flex-col justify-between relative overflow-hidden group">
        <span className="text-[10px] text-slate-400 font-bold select-none truncate">
          {lang === "ku" ? "شاخصی مەترسی نیشتمانی" : "مؤشر المخاطر الوطني"}
        </span>
        <div className="mt-2 flex items-baseline justify-between select-text">
          <span className="text-xl md:text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">%١٤</span>
          <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-0.5">
            <ArrowDownRight className="w-3 h-3" /> -3.5%
          </span>
        </div>
        <div className="mt-3 text-[9px] text-emerald-600 font-medium flex items-center gap-1 select-none">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>{lang === "ku" ? "ئارام و سەقامگیر" : "مستقر ومؤمن"}</span>
        </div>
      </div>

      {/* Card 4: Compliance Rate */}
      <div className="bg-white dark:bg-[#0f172a] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-blue-500/30 transition flex flex-col justify-between relative overflow-hidden group">
        <span className="text-[10px] text-slate-400 font-bold select-none truncate">
          {lang === "ku" ? "ڕێژەی پابەندبوونی گشتی" : "نسبة الامتثال الكلية"}
        </span>
        <div className="mt-2 flex items-baseline justify-between select-text">
          <span className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">%٩٧.٤</span>
          <span className="text-[10px] text-green-500 font-bold flex items-center gap-0.5">
            <ArrowUpRight className="w-3 h-3" /> +1.1%
          </span>
        </div>
        <div className="mt-3 text-[9px] text-slate-500 font-medium flex items-center gap-1 select-none">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0066FF]" />
          <span>{lang === "ku" ? "ئاستی جێبەجێکردن" : "معايير الحوكمة"}</span>
        </div>
      </div>

      {/* Card 5: AI Confidence Score */}
      <div className="bg-white dark:bg-[#0f172a] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-violet-500/30 transition flex flex-col justify-between relative overflow-hidden group">
        <span className="text-[10px] text-slate-400 font-bold select-none truncate">
          {lang === "ku" ? "ڕادەی متمانەی هۆشمەندی" : "ثقة الذكاء الاصطناعي"}
        </span>
        <div className="mt-2 flex items-baseline justify-between select-text">
          <span className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">%٩٨.٢</span>
          <span className="text-[10px] text-slate-400 font-bold flex items-center gap-0.5">
            ✓ {lang === "ku" ? "جێگیر" : "مستقر"}
          </span>
        </div>
        <div className="mt-3 text-[9px] text-violet-600 font-medium flex items-center gap-1 select-none">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
          <span>{lang === "ku" ? "شیکاری هۆشەمەند فەعلە" : "توجيه ذكي فعال"}</span>
        </div>
      </div>

      {/* Card 6: System Health Score */}
      <div className="bg-white dark:bg-[#0f172a] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-emerald-500/30 transition flex flex-col justify-between relative overflow-hidden group">
        <span className="text-[10px] text-slate-400 font-bold select-none truncate">
          {lang === "ku" ? "تەندروستی گشتی سیستەم" : "سلامة وجودة النظام"}
        </span>
        <div className="mt-2 flex items-baseline justify-between select-text">
          <span className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">%١٠٠</span>
          <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-0.5">
            ✓ {lang === "ku" ? "بێ کێشە" : "سليم"}
          </span>
        </div>
        <div className="mt-3 text-[9px] text-emerald-600 font-medium flex items-center gap-1 select-none">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>{lang === "ku" ? "بەردەست بە تەواوی" : "فعال بالكامل"}</span>
        </div>
      </div>
    </div>
  );
}

// 2. National Trade Overview widget
export function NationalTradeOverviewWidget({ lang, navigate }: WidgetProps) {
  return (
    <div className="bg-white dark:bg-[#0f172a] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <span className="w-1.5 h-3 rounded bg-blue-500" />
            {lang === "ku" ? "پوختەی بازرگانی نیشتمانی" : "موجز التجارة الخارجية الوطنية"}
          </h4>
          <Badge variant="outline" className="bg-blue-500/5 text-[#0066FF] border-[#0066FF]/20 text-[9px] py-0">{lang === "ku" ? "ساڵانە" : "سنوي"}</Badge>
        </div>
        <p className="text-xs text-slate-500 mt-3 leading-relaxed">
          {lang === "ku" 
            ? "قەبارەی گشتی هاوردەی مانگانە گەیشتووەتە ملیارێک و ٤٥٠ ملیۆن دۆلار. هاوبەشە سەرەکییەکان: چین، تورکیا، دەوڵەتی ئیمارات."
            : "إجمالي حجم التجارة الخارجية الشهري المستورد بلغ ١.٤٥ مليار دولار. الشركاء الرئيسيون: الصين، تركيا، الإمارات العربية."}
        </p>
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">{lang === "ku" ? "چین" : "الصين / شحن بحري"}</span>
            <span className="font-bold text-slate-700 dark:text-slate-300">%٤٢</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-850 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: "42%" }} />
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">{lang === "ku" ? "تورکیا" : "تركيا / شحن بري"}</span>
            <span className="font-bold text-slate-700 dark:text-slate-300">%٢٨</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-850 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full" style={{ width: "28%" }} />
          </div>
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <span className="text-[10px] text-slate-400">{lang === "ku" ? "دواین نوێکردنەوە" : "آخر تدقيق تجاري"}</span>
        <span className="text-[10px] text-[#0066FF] font-bold flex items-center gap-1 cursor-pointer hover:underline" onClick={() => navigate("/analytics")}>
          {lang === "ku" ? "بینینی شیکاری گەشتی" : "تحليل المؤشرات"} <Clock className="w-3 h-3" />
        </span>
      </div>
    </div>
  );
}

// 3. Customs Activity Summary widget
export function CustomsActivitySummaryWidget({ lang, navigate }: WidgetProps) {
  return (
    <div className="bg-white dark:bg-[#0f172a] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <span className="w-1.5 h-3 rounded bg-emerald-500" />
            {lang === "ku" ? "پوختەی کاروڵە گومرگییەکان" : "ملخص العمليات الجمركية"}
          </h4>
          <Badge variant="outline" className="bg-emerald-500/5 text-emerald-500 border-emerald-500/20 text-[9px] py-0">{lang === "ku" ? "خێرا" : "سريع"}</Badge>
        </div>
        <p className="text-xs text-slate-500 mt-3 leading-relaxed">
          {lang === "ku" 
            ? "تێکڕای کاتی پێداچوونەوە و مۆڵەت تەنها ٣٢ خولەکە. ڕێژەی پۆلێنکردنی دروست %٩٩."
            : "متوسط وقت تدقيق البيان والإفراج الجمركي بلغ ٣٢ دقيقة فقط. دقة الترميز بالتعرفة الذكية الـ HS بلغت ٩٩٪."}
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2 text-center">
          <div className="bg-slate-50 dark:bg-slate-850 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/80">
            <span className="text-[9px] text-slate-400 block">{lang === "ku" ? "کاتی مۆڵەت" : "وقت الإفراج"}</span>
            <span className="text-xs font-black text-slate-800 dark:text-white">٣٢ خولەک</span>
          </div>
          <div className="bg-slate-50 dark:bg-slate-850 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/80">
            <span className="text-[9px] text-slate-400 block">{lang === "ku" ? "خۆکاربوون" : "أتمتة الفرز"}</span>
            <span className="text-xs font-black text-emerald-600">%٩٥</span>
          </div>
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <span className="text-[10px] text-slate-400">{lang === "ku" ? "دۆخی رەوتی گشتی" : "المعدل التشغيلي"}</span>
        <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 cursor-pointer hover:underline" onClick={() => navigate("/customs")}>
          {lang === "ku" ? "دەروازەی گومرگ" : "سجل العمليات"} <CheckCircle2 className="w-3 h-3" />
        </span>
      </div>
    </div>
  );
}

// 4. Import/Export Monitoring widget
export function ImportExportMonitoringWidget({ lang, navigate }: WidgetProps) {
  return (
    <div className="bg-white dark:bg-[#0f172a] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <span className="w-1.5 h-3 rounded bg-[#0066FF]" />
            {lang === "ku" ? "چاودێری هاوردە و هەناردە" : "مراقبة الاستيراد والتصدير"}
          </h4>
          <Badge variant="outline" className="bg-[#0066FF]/5 text-[#0066FF] border-[#0066FF]/20 text-[9px] py-0">{lang === "ku" ? "فەرمی" : "سيادي"}</Badge>
        </div>
        <p className="text-xs text-slate-500 mt-3 leading-relaxed">
          {lang === "ku" 
            ? "دابەشبوونی هاوردە بەپێی جۆری کاڵاکان: ماددە خاوەکان، ئامێرە تەکنەلۆژییەکان، کاڵای خۆراکی، ماتۆڕسات."
            : "تصنيف الموارد الواردة حالياً حسب القطاع العراقي: كابلات ومواد أولية، تكنولوجيا الشبكات، الأغذية."}
        </p>
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">{lang === "ku" ? "کەرەستەی خاو" : "المواد الإنشائية والخام"}</span>
            <span className="font-bold text-slate-700 dark:text-slate-300">%٤٨</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-850 rounded-full overflow-hidden">
            <div className="h-full bg-[#0066FF] rounded-full" style={{ width: "48%" }} />
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">{lang === "ku" ? "تەکنەلۆژیا و پەیوەندی" : "الإلكترونيات والاتصالات"}</span>
            <span className="font-bold text-slate-700 dark:text-slate-300">%٣٢</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-850 rounded-full overflow-hidden">
            <div className="h-full bg-purple-500 rounded-full" style={{ width: "32%" }} />
          </div>
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <span className="text-[10px] text-slate-400">{lang === "ku" ? "موربەکردن" : "جدول التصنيفات"}</span>
        <span className="text-[10px] text-purple-600 font-bold flex items-center gap-1 cursor-pointer hover:underline" onClick={() => navigate("/analytics")}>
          {lang === "ku" ? "پشکنینی گشتی" : "السلع والتعرفة"} <ExternalLink className="w-3 h-3" />
        </span>
      </div>
    </div>
  );
}

// 5. Strategic Risk Heatmap widget
export function StrategicRiskHeatmapWidget({ lang, navigate }: WidgetProps) {
  return (
    <div className="bg-white dark:bg-[#0f172a] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <span className="w-1.5 h-3 rounded bg-rose-500" />
            {lang === "ku" ? "نەخشەی گەرمی مەترسی ستراتیژی" : "خارطة المخاطر الجمركية"}
          </h4>
          <Badge variant="outline" className="bg-rose-500/5 text-rose-500 border-rose-500/20 text-[9px] py-0">{lang === "ku" ? "ئاسایشی" : "رصد سيادي"}</Badge>
        </div>
        <p className="text-xs text-slate-500 mt-3 leading-relaxed">
          {lang === "ku" 
            ? "پێوانی مەترسی لە مەرزی زاخۆ (%١٢ - نزم)، مەرزی ئوم قەسر (%١٨ - مامناوەند)، فڕۆکەخانەی بەغداد (%٨ - زۆر نزم)."
            : "مؤشر الرصد: منفذ زاخو الجمركي (١٢٪ - منخفض)، ميناء أم قصر (١٨٪ - متوسط)، مطار بغداد الفيدرالي (٨٪ - ضئيل)."}
        </p>
        <div className="mt-4 space-y-2 text-[11px] font-sans">
          <div className="flex justify-between items-center py-1 border-b border-dashed border-slate-100 dark:border-slate-800">
            <span className="text-slate-400">{lang === "ku" ? "مەرزی زاخۆ / سەرەکی" : "منفذ زاخو الحدودي"}</span>
            <span className="text-green-500 font-bold">%١٢ ({lang === "ku" ? "پارێزراو" : "آمن"})</span>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-dashed border-slate-100 dark:border-slate-800">
            <span className="text-slate-400">{lang === "ku" ? "بەندەری ئوم قەسر" : "ميناء أم قصر الجنوبي"}</span>
            <span className="text-amber-500 font-bold">%١٨ ({lang === "ku" ? "مامناوەند" : "مستقر"})</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-slate-400">{lang === "ku" ? "فڕۆکەخانەی نێودەوڵەتی" : "مطار بغداد التجاري"}</span>
            <span className="text-green-500 font-bold">%٨ ({lang === "ku" ? "زۆر پارێزراو" : "ضئيل جداً"})</span>
          </div>
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <span className="text-[10px] text-slate-400">{lang === "ku" ? "بەرێوەبردن" : "نظام الترخيص"}</span>
        <span className="text-[10px] text-rose-600 font-bold flex items-center gap-1 cursor-pointer hover:underline" onClick={() => navigate("/compliance")}>
          {lang === "ku" ? "پشکنینی دۆسێکان" : "تدقيق المخاطر"} <ShieldAlert className="w-3 h-3" />
        </span>
      </div>
    </div>
  );
}

// 6. AI Intelligence Findings widget
export function AIIntelligenceFindingsWidget({ lang, setActiveCenterTab }: WidgetProps) {
  return (
    <div className="bg-white dark:bg-[#0f172a] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <span className="w-1.5 h-3 rounded bg-violet-500 animate-pulse" />
            {lang === "ku" ? "دۆزینەوەکانی هۆشمەندی دەستکرد" : "نتائج الاستخبارات الاصطناعية"}
          </h4>
          <Badge variant="outline" className="bg-violet-500/5 text-violet-500 border-violet-500/20 text-[9px] py-0">{lang === "ku" ? "هۆشمەند" : "فوري"}</Badge>
        </div>
        <p className="text-xs text-slate-500 mt-3 leading-relaxed">
          {lang === "ku" 
            ? "سیستەمی هۆشمەندی نیشتمانی توانیویەتی ٣٢ هەوڵی تاریفەی جۆراوجۆر یان نادروست بەبێ فلتەری مرۆیی دەستنیشان بکات."
            : "تمكن النظام الذكي الوطني كشف ٣٢ محاولة لتصنيف جمركي غير دقيق بنجاح ودون تدخل بشري."}
        </p>
        <div className="mt-4 bg-violet-500/5 dark:bg-violet-500/10 rounded-xl border border-violet-500/25 p-3 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-violet-500 animate-ping" />
            <span className="text-[10px] text-violet-700 dark:text-violet-400 font-bold">{lang === "ku" ? "یاریدەدەر ئامادەیە بۆ گفتوگۆ" : "المساعد جاهز للاستشارة"}</span>
          </div>
          <button 
            type="button"
            onClick={() => setActiveCenterTab && setActiveCenterTab("assistant")}
            className="text-right text-[11px] text-violet-600 dark:text-violet-400 font-bold hover:underline self-start cursor-pointer transition bg-transparent border-0 p-0"
          >
            ✉ {lang === "ku" ? "ئێستا ڕاوێژ لەگەڵ ژیری بەدەست بێنە" : "افتح استشارة ذكية سيادية"}
          </button>
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <span className="text-[10px] text-slate-400">{lang === "ku" ? "متمانە" : "صلاحية البيانات"}</span>
        <span className="text-[10px] text-violet-600 font-bold flex items-center gap-1 cursor-pointer hover:underline" onClick={() => setActiveCenterTab && setActiveCenterTab("assistant")}>
          {lang === "ku" ? "بینینی پێشنیارەکان" : "موجز القرارات"} <Sparkles className="w-3" />
        </span>
      </div>
    </div>
  );
}

// 7. Logistics Performance Summary widget
export function LogisticsPerformanceWidget({ lang, navigate }: WidgetProps) {
  return (
    <div className="bg-white dark:bg-[#0f172a] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <span className="w-1.5 h-3 rounded bg-purple-500" />
            {lang === "ku" ? "پوختەی ئەدای لۆجیستیک" : "قياس الأداء اللوجستي"}
          </h4>
          <Badge variant="outline" className="bg-purple-500/5 text-purple-500 border-purple-500/20 text-[9px] py-0">{lang === "ku" ? "کرداری" : "مؤمن"}</Badge>
        </div>
        <p className="text-xs text-slate-500 mt-3 leading-relaxed">
          {lang === "ku" 
            ? "تێکڕای کاتی چاوەڕوانی تانکەرەکان لە مەرزەکان دەگاتە ٢٠ خولەک. گەیشتنی پارێزراوی بارهەڵگرەکان لە %٩٩.٨ دەکات."
            : "متوسط انتظار الشاحنات اللوجستية بلغ ٢٠ دقيقة. مؤشر الوصول الآمن والناجح للبضائع سجل ٩٩.٨٪ كفاءة."}
        </p>
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">{lang === "ku" ? "ڕووپۆشەکان" : "شهادات المطابقة"}</span>
            <span className="font-bold text-slate-700 dark:text-slate-300">%١٠٠</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-850 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: "100%" }} />
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">{lang === "ku" ? "چاوەڕوانی کانکان" : "تراكمات المنافذ"}</span>
            <span className="font-bold text-slate-700 dark:text-slate-300">%٢</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-850 rounded-full overflow-hidden">
            <div className="h-full bg-violet-500 rounded-full" style={{ width: "2%" }} />
          </div>
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <span className="text-[10px] text-slate-400">{lang === "ku" ? "کۆنترۆڵە ئەمنییەکان" : "التأمين اللوجستي"}</span>
        <span className="text-[10px] text-purple-600 font-bold flex items-center gap-1 cursor-pointer hover:underline" onClick={() => navigate("/logistics")}>
          {lang === "ku" ? "ڕاپۆرتی لۆجیستیک" : "جدول تتبع المنافذ"} <Compass className="w-3 h-3" />
        </span>
      </div>
    </div>
  );
}
