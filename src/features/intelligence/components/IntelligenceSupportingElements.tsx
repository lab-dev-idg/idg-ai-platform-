import React, { useState } from 'react';
import { 
  EARLY_WARNING_ALERTS
} from '../data';
import { 
  EarlyWarningAlert, 
  ExecutiveReport
} from '../types';
import { 
  CheckCircle2, 
  Fingerprint, 
  FileCheck, 
  AlertTriangle, 
  BookOpen, 
  Siren, 
  Lock, 
  ChevronRight
} from 'lucide-react';
import { useSettingsStore } from '@/store/settingsStore';
import { toast } from 'sonner';

// ==========================================
// 4. ECONOMIC EARLY WARNING SYSTEM (EEWS)
// ==========================================
export function EarlyWarningSystem({
  onSelectAlert
}: {
  onSelectAlert?: (alert: EarlyWarningAlert) => void
}) {
  const { lang } = useSettingsStore();
  const isKurdish = lang === 'ku';

  const [activeAlert, setActiveAlert] = useState<EarlyWarningAlert | null>(EARLY_WARNING_ALERTS[0]);

  const alertBadge = (lvl: string) => {
    switch(lvl) {
      case 'critical': return 'bg-rose-50 text-rose-600 border border-rose-100';
      case 'high': return 'bg-amber-50 text-amber-600 border border-amber-100';
      default: return 'bg-blue-50 text-blue-600 border border-blue-100';
    }
  };

  return (
    <div id="early-warning-system" className="bg-white border border-slate-100 rounded-[24px] shadow-sm p-5 space-y-4">
      <div className="flex items-center gap-2.5 border-b border-slate-50 pb-3">
        <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
          <Siren className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            {isKurdish ? 'سیستەمی هۆشداری پێشوەختە (Economic Early Warning System)' : 'نظام الإنذار المبكر والتشخيص الجمركي الرقمي'}
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {isKurdish ? 'چاودێری کاتی ڕاستەقینە بۆ نائارامی مەرز و فێڵە تاریفەییەکان' : 'رصد لحظي لاختناقات العبور والتلاعب بالرموز الجمركية'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Alerts List */}
        <div className="md:col-span-5 space-y-2">
          {EARLY_WARNING_ALERTS.map((alert, idx) => {
            const isSelected = activeAlert?.id === alert.id;
            return (
              <button
                key={idx}
                onClick={() => {
                  setActiveAlert(alert);
                  if (onSelectAlert) onSelectAlert(alert);
                }}
                className={`w-full text-right p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                  isSelected 
                    ? 'bg-rose-50/20 border-rose-200/50 shadow-xs' 
                    : 'bg-slate-50/20 border-slate-100/70 hover:bg-slate-50/60'
                }`}
              >
                <div className="flex justify-between items-center text-[10px] font-bold">
                  <span className={`px-2 py-0.5 rounded-lg font-mono uppercase ${alertBadge(alert.alert_level)}`}>
                    {alert.alert_level}
                  </span>
                  <span className="text-slate-400 font-mono">
                    {alert.confidence.toFixed(1)}% {isKurdish ? 'ڕاستی' : 'ثقة'}
                  </span>
                </div>
                
                <h4 className="text-[11.5px] font-extrabold text-slate-800 mt-2 truncate">
                  {isKurdish ? alert.kuTitle : alert.arTitle}
                </h4>

                <div className="flex justify-between items-center mt-2 text-[9.5px] text-slate-400">
                  <span className="font-semibold text-[#0066FF]">{isKurdish ? alert.kuRegion : alert.arRegion}</span>
                  <span className="font-medium">{alert.timestamp.split('T')[0]}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Alert Action Details */}
        <div className="md:col-span-7 bg-slate-50/40 border border-slate-100 p-4 rounded-2xl flex flex-col justify-between">
          {activeAlert ? (
            <div className="space-y-3">
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase font-mono bg-white px-2 py-1 rounded-md border border-slate-100">
                  {isKurdish ? 'وردەکاری باری گشتی' : 'تفاصيل التشخيص اللوجستي'}
                </span>
                <h4 className="text-xs font-black text-slate-900 mt-2">
                  {isKurdish ? activeAlert.kuTitle : activeAlert.arTitle}
                </h4>
                <p className="text-[11.5px] text-slate-500 leading-relaxed font-medium mt-1">
                  {isKurdish ? activeAlert.kuDescription : activeAlert.arDescription}
                </p>
              </div>

              {/* Attrition estimate */}
              <div className="bg-rose-50/40 border border-rose-500/10 p-3 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[9.5px] font-medium text-rose-500 uppercase block select-none">
                    {isKurdish ? 'زیانی دارایی دیاریکراو' : 'الضرر المالي اليومي المقدر'}
                  </span>
                  <span className="text-xs font-bold text-rose-700 font-mono">
                    {isKurdish ? activeAlert.kuImpact_estimate : activeAlert.arImpact_estimate}
                  </span>
                </div>
                <AlertTriangle className="w-5 h-5 text-rose-500" />
              </div>

              {/* Action recommendation */}
              <div className="space-y-1.5">
                <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block">
                  {isKurdish ? 'چارەسەرە فریاگوزارییە پێشنیارکراوەکان' : 'التوصيات السيادية المباشرة للتعامل مع الخطر'}
                </span>
                <ul className="space-y-1">
                  {(isKurdish ? activeAlert.kuRecommendations : activeAlert.arRecommendations).map((rec, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-[10.5px] text-slate-700 font-medium">
                      <ChevronRight className="w-3.5 h-3.5 text-rose-400 flex-shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-slate-400">
              {isKurdish ? 'تکایە هۆشدارییەک هەڵبژێرە.' : 'يرجى اختيار أحد التهديدات لتتبع الإجراءات.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


// ==========================================
// 6. EXECUTIVE DECISION SUPPORT LAYER
// ==========================================
export function ExecutiveDecisionSupport({
  report
}: {
  report: ExecutiveReport | null
}) {
  const { lang } = useSettingsStore();
  const isKurdish = lang === 'ku';

  const [hasSovereignConsent, setHasSovereignConsent] = useState(false);
  const [isSignLoading, setIsSignLoading] = useState(false);
  const [completedSignature, setCompletedSignature] = useState(false);

  const handleSovereignSign = () => {
    if (!hasSovereignConsent) {
      toast.error(
        isKurdish 
          ? 'تکایە مەرجی ڕەزامەندی فەرمی دەسەڵاتدار پشتڕاست بکەرەوە پێش ئیمزاکردن.' 
          : 'يرجى المصادقة على شرط التدخل البشري والامتثال الحكومي أولاً.'
      );
      return;
    }

    setIsSignLoading(true);
    setTimeout(() => {
      setIsSignLoading(false);
      setCompletedSignature(true);
      toast.success(
        isKurdish 
          ? 'بڕیارەکە لەگەڵ دەقەکە بە فەرمی ڕەوانەی دیوانی سەرۆکایەتی وەزیران کرا.' 
          : 'تم رفع المرسوم والمصادقة التنفيذية إلى الأمانة العامة لمجلس الوزراء بنجاح.',
        {
          description: isKurdish ? 'کۆدی پاشکۆی فۆرم کۆدرا بە سەرکەوتوویی.' : 'تم إصدار التوقيع والمصادقة برقم سري معتمد.'
        }
      );
    }, 1500);
  };

  return (
    <div id="executive-decision-support" className="bg-white border border-slate-100 rounded-[24px] shadow-sm p-5 space-y-4">
      <div className="flex items-center gap-2.5 border-b border-slate-50 pb-3">
        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
          <FileCheck className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            {isKurdish ? 'داشبۆرتی پشتگیری بڕیاردانی جێبەجێکار (Executive Decision Support)' : 'لوحة دعم اتخاذ القرار واستراتجيات الاصلاح المالي'}
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {isKurdish ? 'داڕشتنی فەرمی ئامار و پێشنیارە گونجاوەکان بۆ سەرکردایەتی' : 'وثيقة دعم القرار المصممة للوزراء والمشرّعين وواضعي السياسات السيادية'}
          </p>
        </div>
      </div>

      {report ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Executive Summary */}
          <div className="lg:col-span-7 bg-slate-50/30 p-4 rounded-2xl border border-slate-100 space-y-3">
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                {isKurdish ? 'پوختەی سەرکردایەتی نیشتمانی (Executive Summary)' : 'الخلاصة التنفيذية للقرار المعتمد'}
              </span>
              <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                {isKurdish ? report.kuExecutive_summary : report.arExecutive_summary}
              </p>
            </div>

            {/* Key Findings */}
            <div className="space-y-1.5">
              <span className="text-[9.5px] font-bold text-[#0066FF] uppercase tracking-wider block">
                {isKurdish ? 'دەرئەنجامە زانستیەکان (Key Findings)' : 'أهم النتائج والدلالات التوقعية'}
              </span>
              <div className="space-y-1">
                {(isKurdish ? report.kuKey_findings : report.arKey_findings).map((f, i) => (
                  <div key={i} className="flex gap-2 items-center text-[10.5px] text-slate-600 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Opportunities */}
            <div className="space-y-1.5">
              <span className="text-[9.5px] font-bold text-indigo-600 uppercase tracking-wider block">
                {isKurdish ? 'دەرفەتە ئەرێنییەکان (Opportunities)' : 'الفرص والمكاسب التجارية المتاحة'}
              </span>
              <div className="space-y-1">
                {(isKurdish ? report.kuOpportunities : report.arOpportunities).map((opp, i) => (
                  <div key={i} className="text-[10.5px] text-slate-600 font-medium">
                    📍 {opp}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action and Human Sovereign Approval Directive */}
          <div className="lg:col-span-5 bg-slate-900 text-white p-4 rounded-2xl flex flex-col justify-between">
            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-[9px] font-mono tracking-wider font-extrabold uppercase">
                <span className="text-blue-400">National Directive Desk</span>
                <span className="bg-blue-600/20 text-blue-300 font-bold px-2 py-0.5 rounded-md">
                  {report.confidence_level} CONF
                </span>
              </div>

              <div className="space-y-1.5">
                <span className="text-[9.5px] font-bold text-slate-400 uppercase block select-none">
                  {isKurdish ? 'پێشنیارە گونجاوەکان بۆ بڕیار (Recommendations)' : 'توصيات الهيئة الاستشارية'}
                </span>
                <div className="space-y-1.5 max-h-[120px] overflow-y-auto pr-1">
                  {(isKurdish ? report.kuRecommendations : report.arRecommendations).map((rec, i) => (
                    <div key={i} className="text-[10px] text-slate-300 leading-relaxed font-serif">
                      • {rec}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Signature & Strict Oversight Controls */}
            <div className="mt-4 pt-3 border-t border-white/5 space-y-3">
              <div className="flex items-start gap-2 text-[10px] text-slate-400 font-medium">
                <input 
                  type="checkbox" 
                  id="consent"
                  className="mt-0.5 rounded cursor-pointer accent-blue-600"
                  checked={hasSovereignConsent}
                  onChange={(e) => setHasSovereignConsent(e.target.checked)}
                />
                <label htmlFor="consent" className="cursor-pointer">
                  {isKurdish 
                    ? 'پشتڕاستی دەکەمەوە کە ئەم ڕاپۆرتە خۆکار نییە و پێویستی بە مۆڵەتی وەزارەتی دارایی عێراق هەیە.' 
                    : 'أقر بأن هذا القرار تنظيمي بحت ويخضع حصراً لموافقة مجلس الوزراء العراقي.'}
                </label>
              </div>

              <button
                onClick={handleSovereignSign}
                disabled={isSignLoading || completedSignature}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer ${
                  completedSignature 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-[#0066FF] hover:bg-[#0066FF]/95 text-white shadow-xl shadow-blue-500/10'
                }`}
              >
                {isSignLoading ? (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : completedSignature ? (
                  <FileCheck className="w-3.5 h-3.5" />
                ) : (
                  <Fingerprint className="w-3.5 h-3.5" />
                )}
                <span>
                  {completedSignature 
                    ? (isKurdish ? 'ئاراستەکرا و ئیمزا کرا' : 'تمت المصادقة والإرسال') 
                    : (isKurdish ? 'ئیمزاکردنی بڕیار لەلایەن جێبەجێکارەوە' : 'التوقيع التنفيذي السيادي والمصادقة')}
                </span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-slate-50/40 rounded-2xl border border-slate-100 flex flex-col items-center gap-2">
          <BookOpen className="w-8 h-8 text-slate-300" />
          <p className="text-xs text-slate-400 font-medium">
            {isKurdish
              ? 'تکایە سەرەتا فۆرمێک لە سەکۆی مۆدێلەکە دروست بکە و بنێرە بۆ ئەم کورتەیە.'
              : 'يرجى تفعيل معلمات القرار أو محاكاة سيناريو لتوليد التقرير التنفيذي.'}
          </p>
        </div>
      )}
    </div>
  );
}


// ==========================================
// 9. GOVERNANCE & AUDITABLE RISK PANEL
// ==========================================
export function SecurityGovernancePane() {
  const { lang } = useSettingsStore();
  const isKurdish = lang === 'ku';

  return (
    <div id="security-governance-pane" className="bg-[#071739] text-white border border-white/5 rounded-[24px] shadow-sm p-5 space-y-4">
      <div className="flex items-center gap-2 border-b border-white/5 pb-3 justify-between">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-rose-500" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            {isKurdish ? 'هاوسەنگی، ڕیسک و ڕێکارەکانی پێداچوونەوەی دەسەڵاتدار' : 'حوكمة الأنظمة والمعالجة السيادية'}
          </h4>
        </div>
        <span className="text-[9px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/10 select-none">
          LEVEL 3 CLEARANCE
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="bg-white/5 p-3.5 rounded-xl border border-white/10 space-y-1.5">
          <span className="text-[10px] text-blue-400 font-bold block">
            {isKurdish ? 'provenance' : 'مبدأ الرقابة البشرية المباشرة'}
          </span>
          <p className="text-[11px] text-slate-300 leading-relaxed font-serif">
            {isKurdish 
              ? 'ئەم مۆدێلانە ڕێگە نادەن بە دەستوەردانی سەرپەرشتی خۆکار لە بڕیارەکانی بازرگانی عێراقی.' 
              : 'النظام لا يمتلك أي صلاحيات للتنفيذ التلقائي أو التحكم بمنافذ الاستيراد خارج تفويض اللجنة العليا بمصادقة خطية.'}
          </p>
        </div>

        <div className="bg-white/5 p-3.5 rounded-xl border border-white/10 space-y-1.5">
          <span className="text-[10px] text-blue-400 font-bold block">
            {isKurdish ? 'auditable' : 'سجل مطابقة التدقيق والشفافية'}
          </span>
          <p className="text-[11px] text-slate-300 leading-relaxed font-serif">
            {isKurdish 
              ? 'پاڵپشتی پڕۆسەی نوژەنکردنەوە لە جۆری گشتی فۆرم دروستکراوە فەرمییەکان هاوچەرخ پاشەکەوت دەگرێت.' 
              : 'جميع عمليات المحاكاة والتوليف الجمركي تقيد بأرقام وحزم تشفير وتدرج في سجل المتابعة الفيدرالي لوزارات الدولة.'}
          </p>
        </div>

        <div className="bg-white/5 p-3.5 rounded-xl border border-white/10 space-y-1.5">
          <span className="text-[10px] text-blue-400 font-bold block">
            {isKurdish ? 'clearance' : 'محددات السرية والأمن القومي'}
          </span>
          <p className="text-[11px] text-slate-300 leading-relaxed font-serif">
            {isKurdish 
              ? 'ئاستی ڕیپێدان بە مۆڵەتی ئەمنیی فەرمی پێویستە بۆ پێداچوونەوە لە هۆبەی زانیاری ئابووری.' 
              : 'تخضع حركية البيانات لقوانين الأمن القومي العراقي المنظمة للأسرار الصناعية والمنافسة الإقليمية للترانزيت.'}
          </p>
        </div>
      </div>
    </div>
  );
}
