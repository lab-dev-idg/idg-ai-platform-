import React, { useState } from "react";
import { ShieldAlert } from "lucide-react";

interface IntelligenceDashboardProps {
  lang: "ku" | "ar";
}

export function IntelligenceDashboard({ lang }: IntelligenceDashboardProps) {
  const [filterAlertSeverity, setFilterAlertSeverity] = useState<"ALL" | "CRITICAL" | "WARNING" | "INFO">("ALL");

  const alerts = [
    {
      id: "alt_1",
      severity: "CRITICAL",
      titleKu: "جمرکى زاخۆ: تباینی بەڵگەنامەیی",
      descKu: "ئاستی مەترسی بەهۆی تێکچوونی بەڵگەنامە فەرمییەکانی مەرزی زاخۆ بەرز بووەتەوە.",
      titleAr: "جمرك زاخو: تباين مستندي هام",
      descAr: "ارتفاع مؤشر المخاطر الجمركية في منفذ زاخو بسبب عدم تطابق وثائق الشحن.",
      time: "10:42 BGW",
      recKu: "ڕاسپاردەی فەرمی: ناردنی لێژنەی چاودێری بۆ مەرزی زاخۆ بۆ بەدواداچوونی مانیفێستەکان.",
      recAr: "التوصية السيادية: توجيه مفرزة أمنية جمركية للتحقق من المانيفست في المنفذ."
    },
    {
      id: "alt_2",
      severity: "CRITICAL",
      titleKu: "تاریفەی نادروستی تەکنەلۆژیا",
      descKu: "هەڵاوسانی نائاسایی لە بەهای تاریفەی گومرگی ئامێرە تەکنەلۆژییەکان.",
      titleAr: "تصنيف خاطئ: سلع تقنية",
      descAr: "رصد انحراف جمركي حاد في تصنيف تعرفة الأجهزة التقنية المستوردة.",
      time: "09:15 BGW",
      recKu: "ڕاسپاردەی فەرمی: جێبەجێکردنی کاتیی لێکۆڵینەوەی تاریفەی جۆراوجۆر لە پۆلێنی کاڵاکاندا.",
      recAr: "التوصية السيادية: تطبيق مرحلة التدقيق التلقائي المؤقت لرموز الـ HS."
    },
    {
      id: "alt_3",
      severity: "WARNING",
      titleKu: "قەرەباڵغی بەندەری ئوم قەسر",
      descKu: "قەرەباڵغی بەرز لە بەندەری ئوم قەسر تۆمار کراوە کە دەبێتە هۆی دواکەوتنی بارهەڵگرەکان.",
      titleAr: "ميناء أم قصر: شحن بحري",
      descAr: "ازدحام شديد وتسجيل تأخير في محطة حاويات ميناء أم قصر الجنوبي.",
      time: "08:30 BGW",
      recKu: "ڕاسپاردەی فەرمی: بەهێزکردنی خشتەی بڵاوکردنەوەی کارمەندانی گومرگ لە هۆڵی پشکنین.",
      recAr: "التوصية السيادية: تدوير نوبات المخلصين وتحديث مسارات الشحن الخضراء."
    },
    {
      id: "alt_4",
      severity: "WARNING",
      titleKu: "متمانەی نووسراوی بازرگانی گەنم",
      descKu: "کەمی متمانەی بەڵگەنامەی دڵنیایی بازرگانی لە گرێبەستێکی گەورەی هاوردەی گەنم.",
      titleAr: "اعتماد تجاري: شحنة قمح",
      descAr: "انخفاض مؤشر الموثوقية في مستندات الاعتماد التجاري لشحنة قمح كبرى.",
      time: "07:50 BGW",
      recKu: "ڕاسپاردەی فەرمی: هەڵپەساردنی هەمیشەیی تا هەڵسەنگاندنی نوێی KYC.",
      recAr: "التوصية السيادية: تعليق براءة الذمة المالية لشركة الاستيراد مؤقتاً."
    },
    {
      id: "alt_5",
      severity: "INFO",
      titleKu: "سیستەمی هۆشمەندی گومرگی چالاک بوو",
      descKu: "سیستەمی هۆشمەندی نیشتمانی نوێترین رێسا و مەرجەکانی هاوردەی نوێکردەوە.",
      titleAr: "تحديث النظام: قواعد التعرفة المحدثة",
      descAr: "تم تفعيل القواعد الجمركية المستحدثة لسنة ٢٠٢٦ بنجاح عبر النظام الذكي.",
      time: "06:00 BGW",
      recKu: "ڕاسپاردەی فەرمی: پێداچوونەوە بە شاخصی کارایی بۆ خولەکانی گشتی داهاتوو.",
      recAr: "التوصية السيادية: مراجعة لوحة البيانات لاتخاذ قرارات التخصيص المالية."
    }
  ];

  const filteredAlerts = alerts.filter(
    (item) => filterAlertSeverity === "ALL" || item.severity === filterAlertSeverity
  );

  return (
    <div className="bg-white dark:bg-[#0f172a] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col h-full bg-gradient-to-b from-white to-slate-50/50 dark:from-[#0f172a] dark:to-slate-900/60">
      <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2 select-none">
          <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0" />
          {lang === "ku" ? "بنکەی زانیاری و هاوئاگادارییەکان" : "مركز الإنذار والتحليلات السيادية"}
        </h3>
        <p className="text-[10px] text-slate-400 mt-1 select-none">
          {lang === "ku" ? "وردبینیکردنی بەردەوام لەلایەن دۆسیەی ئەمنی گومرگ" : "مراقبة مستمرة تحت إشراف هيئة المنافذ الجمركية"}
        </p>
      </div>

      {/* Alert level filters */}
      <div className="mt-4 flex flex-wrap gap-1.5 bg-slate-100 dark:bg-slate-850 p-1 rounded-lg select-none">
        <button
          type="button"
          onClick={() => setFilterAlertSeverity("ALL")}
          className={`px-2 py-1 rounded text-[9px] font-bold cursor-pointer transition ${
            filterAlertSeverity === "ALL" 
              ? "bg-white dark:bg-slate-800 text-slate-800 dark:text-white shadow-xs" 
              : "text-slate-500 hover:text-slate-750"
          }`}
        >
          {lang === "ku" ? "هەموو" : "الكل"}
        </button>
        <button
          type="button"
          onClick={() => setFilterAlertSeverity("CRITICAL")}
          className={`px-2 py-1 rounded text-[9px] font-bold cursor-pointer transition ${
            filterAlertSeverity === "CRITICAL" 
              ? "bg-rose-500 text-white shadow-xs" 
              : "text-slate-500 hover:text-slate-750"
          }`}
        >
          {lang === "ku" ? "مەترسیدار" : "خطير"}
        </button>
        <button
          type="button"
          onClick={() => setFilterAlertSeverity("WARNING")}
          className={`px-2 py-1 rounded text-[9px] font-bold cursor-pointer transition ${
            filterAlertSeverity === "WARNING" 
              ? "bg-amber-500 text-white shadow-xs" 
              : "text-slate-500 hover:text-slate-750"
          }`}
        >
          {lang === "ku" ? "ئاگاداری" : "تحذير"}
        </button>
      </div>

      {/* Dynamic Alerts List */}
      <div className="mt-4 flex-1 overflow-y-auto space-y-3.5 pr-1 scrollbar-thin select-text">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((item) => {
            let itemColor = "border-blue-500/10 bg-blue-500/5";
            let badgeColor = "bg-blue-100 text-blue-800";
            if (item.severity === "CRITICAL") {
              itemColor = "border-rose-500/20 bg-rose-500/5";
              badgeColor = "bg-rose-100 text-rose-700";
            } else if (item.severity === "WARNING") {
              itemColor = "border-amber-500/20 bg-amber-500/5";
              badgeColor = "bg-amber-100 text-amber-700";
            }

            return (
              <div key={item.id} className={`p-3 border rounded-xl flex flex-col gap-2 relative ${itemColor} transition`}>
                <div className="flex items-center justify-between font-sans">
                  <span className="text-[10px] font-black tracking-tight text-slate-800 dark:text-white">
                    {lang === "ku" ? item.titleKu : item.titleAr}
                  </span>
                  <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${badgeColor}`}>
                    {item.severity === "CRITICAL" 
                      ? (lang === "ku" ? "مەترسیدار" : "خطير") 
                      : item.severity === "WARNING" 
                        ? (lang === "ku" ? "ئاگاداری" : "تحذير") 
                        : (lang === "ku" ? "زانیاری" : "معلومات")}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed font-sans font-medium">
                  {lang === "ku" ? item.descKu : item.descAr}
                </p>
                <div className="bg-slate-100 dark:bg-slate-850 p-2 rounded-lg text-[9px] border dark:border-slate-800 text-slate-600 dark:text-slate-300 font-sans font-semibold">
                  {lang === "ku" ? item.recKu : item.recAr}
                </div>
                <span className="text-[8px] text-slate-400 block text-end font-mono mt-0.5">{item.time}</span>
              </div>
            );
          })
        ) : (
          <p className="text-center text-slate-400 py-6 text-[11px] select-none">
            {lang === "ku" ? "هیچ هاوئاگادارییەک نییە" : "لا توجد تنبيهات نشطة"}
          </p>
        )}
      </div>
    </div>
  );
}
