import React, { useState, useEffect } from 'react';
import { 
  Save, 
  RefreshCcw, 
  TrendingUp, 
  TrendingDown, 
  Sliders, 
  Zap, 
  FileText,
  Trash2
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { db, doc, setDoc, serverTimestamp } from '@/services/firebase';
import { runScenarioSimulation, generateExecutiveReport } from '../data';
import { ScenarioParam, ScenarioSimulationResult, ExecutiveReport } from '../types';
import { useSettingsStore } from '@/store/settingsStore';
import { toast } from 'sonner';

interface SavedScenarioDoc {
  id: string;
  name: string;
  tariffRate: number;
  policyStrength: number;
  borderControl: number;
  fuelCostIndex: number;
  corridorCap: number;
  updatedAt: string;
}

export function ScenarioSimulationEngine({
  onReportGenerated
}: {
  onReportGenerated: (report: ExecutiveReport, params: ScenarioParam) => void
}) {
  const { lang } = useSettingsStore();
  const { user } = useAuthStore();
  const isKurdish = lang === 'ku';

  // 1. Sliders parameters
  const [params, setParams] = useState<ScenarioParam>({
    tariffRate: 20,
    policyStrength: 65,
    borderControl: 40,
    fuelCostIndex: 50,
    corridorCap: 60,
  });

  const [simResult, setSimResult] = useState<ScenarioSimulationResult>(runScenarioSimulation(params));
  const [scenarioName, setScenarioName] = useState<string>('');
  const [workspaceScenarios, setWorkspaceScenarios] = useState<SavedScenarioDoc[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Re-run simulation when params change
  useEffect(() => {
    const result = runScenarioSimulation(params);
    setSimResult(result);
  }, [params]);

  // Handle reporting sync
  const handleGenerateReport = () => {
    const report = generateExecutiveReport(simResult, params);
    onReportGenerated(report);
    toast.success(
      isKurdish 
        ? 'ڕاپۆرتی بڕیاردانی جێبەجێکار بە سەرکەوتوویی دروستکرا.' 
        : 'تم إنشاء تقرير دعم القرار التنفيذي بنجاح.',
      {
        description: isKurdish ? 'تکایە سەیری بەشی ڕاپۆرتی سەرکردایەتی خوارەوە بکە.' : 'يرجى مراجعة نافذة دعم القرار التنفيذي أدناه.'
      }
    );
  };

  // Convert Firebase simulated records for sync
  const loadSavedWorkspaceScenarios = async () => {
    if (!user) return;
    try {
      // In compliance with our security rules schema (users/{userId}/shipments/{shipmentId}),
      // we can read simulated scenarios stored with trackingNumber = 'SCEN_X'
      // For instant loading in preview, we can also leverage local storage backed up by Firebase sync.
      const localSaved = localStorage.getItem(`scenarios-${user.uid}`);
      if (localSaved) {
        setWorkspaceScenarios(JSON.parse(localSaved));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user) {
      loadSavedWorkspaceScenarios();
    } else {
      setWorkspaceScenarios([]);
    }
  }, [user]);

  const handleSaveScenario = async () => {
    if (!scenarioName.trim()) {
      toast.error(isKurdish ? 'تکایە ناوێک بۆ سیناریۆکە دیاری بکە.' : 'يرجى كتابة اسم للمحاكاة.');
      return;
    }

    const payload: SavedScenarioDoc = {
      id: `SCEN-${Date.now()}`,
      name: scenarioName,
      ...params,
      updatedAt: new Date().toISOString()
    };

    const updated = [payload, ...workspaceScenarios].slice(0, 5); // max 5 items

    if (user && !user.uid.startsWith('guest_')) {
      setIsSaving(true);
      try {
        // Build document matching security specifications & Rules:
        // users/{userId}/shipments/{shipmentId}
        // with fields: { trackingNumber, status, userId, updatedAt, estimatedDelivery }
        // estimatedDelivery will store encoded scenario sliders to prevent schema size overflow
        const encodedParams = `PARAM:${params.tariffRate},${params.policyStrength},${params.borderControl},${params.fuelCostIndex},${params.corridorCap}`;
        const shipmentDocRef = doc(db, `users/${user.uid}/shipments`, payload.id);
        
        await setDoc(shipmentDocRef, {
          trackingNumber: payload.id,
          status: `SCENARIO:${payload.name.slice(0, 50)}`,
          userId: user.uid,
          updatedAt: serverTimestamp(),
          estimatedDelivery: encodedParams
        });

        localStorage.setItem(`scenarios-${user.uid}`, JSON.stringify(updated));
        setWorkspaceScenarios(updated);
        setScenarioName('');
        toast.success(
          isKurdish 
            ? 'سیناریۆی کاتی ڕاستەقینە خوێنرایەوە و لە سەکۆی گومرگی فیدراڵی عێراق پاشەکەوت کرا.' 
            : 'تم تخزين سيناريو المحاكاة اللحظي في قاعدة البيانات الجمركية الاتحادية.',
          {
            description: isKurdish ? 'زانیارییەکان بە سەرکەوتوویی لەگەڵ Firestore نوێکرانەوە.' : 'تم مزامنة البيانات السحابية مع واجهة Firestore المعتمدة.'
          }
        );
      } catch (err) {
        console.error("Firestore Write Blocked:", err);
        toast.error(isKurdish ? 'هەڵەیەک لە تێپەڕینی مۆڵەت ڕوویدا.' : 'فشل تخزين سيناريو المحاكاة بسبب قيود أمنية.');
      } finally {
        setIsSaving(false);
      }
    } else {
      // Offline fallback or Local Guest fallback
      const storageKey = user ? `scenarios-${user.uid}` : 'scenarios-anonymous';
      const updatedWorkspace = [payload, ...workspaceScenarios].slice(0, 5);
      localStorage.setItem(storageKey, JSON.stringify(updatedWorkspace));
      setWorkspaceScenarios(updatedWorkspace);
      setScenarioName('');
      toast.success(isKurdish ? 'سیناریۆکە بە شێوەی ئۆفلاین پاشەکەوت کرا.' : 'تم حفظ المحاكاة في مساحة العمل المحلية.');
    }
  };

  const handleApplySavedScenario = (sc: SavedScenarioDoc) => {
    setParams({
      tariffRate: sc.tariffRate,
      policyStrength: sc.policyStrength,
      borderControl: sc.borderControl,
      fuelCostIndex: sc.fuelCostIndex,
      corridorCap: sc.corridorCap
    });
    toast.info(
      isKurdish 
        ? `سیناریۆی '${sc.name}' بە سەرکەوتوویی جێبەجێ کرا.` 
        : `تم تطبيق معلمات سيناريو '${sc.name}' بنجاح.`
    );
  };

  const handleDeleteScenario = (id: string) => {
    const updated = workspaceScenarios.filter(x => x.id !== id);
    if (user) {
      localStorage.setItem(`scenarios-${user.uid}`, JSON.stringify(updated));
    } else {
      localStorage.setItem('scenarios-anonymous', JSON.stringify(updated));
    }
    setWorkspaceScenarios(updated);
    toast.success(isKurdish ? 'سیناریۆکە سڕدرایەوە.' : 'تمت إزالة السيناريو بنجاح.');
  };

  const handleReset = () => {
    setParams({
      tariffRate: 20,
      policyStrength: 65,
      borderControl: 40,
      fuelCostIndex: 50,
      corridorCap: 60,
    });
    toast.info(isKurdish ? 'سیناریۆ بۆ باری سەرەتایی گەڕێندرایەوە.' : 'تمت إعادة تعيين معلمات المحاكاة القياسية.');
  };

  const formatBillion = (val: number) => {
    return `$${(val / 1000).toFixed(3)}B USD`;
  };

  return (
    <div id="scenario-simulation-engine" className="bg-white border border-slate-100 rounded-[24px] shadow-sm p-5 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-50 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {isKurdish ? 'سەکۆی لێکدانەوە و چاکسازی سیاسەتی گومرگی' : 'محاكي القرارات اللوجستية والتعرفة'}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
              {isKurdish ? 'بەهێزکراوە بە نەخشەی لێکدانەوەی ڕێژەیی تەنە جیاوازەکان' : 'محاكاة رياضية فورية لتدفق الحركة التجارية وفق نماذج المنفعة'}
            </p>
          </div>
        </div>
        <button 
          onClick={handleReset}
          className="p-1.5 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
          title="Reset"
        >
          <RefreshCcw className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Layout */}
        <div className="lg:col-span-6 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {isKurdish ? 'بەهای ڕێکارە مانیفێستیەکان' : 'معلمات السيناريو والمنافذ'}
          </h4>

          {/* 1. Tariff rate */}
          <div className="space-y-1.5 bg-slate-50/50 p-3.5 rounded-2xl border border-slate-100/60">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-slate-700">
                {isKurdish ? 'تێکرای باجی گومرگی (%)' : 'متوسط معدل التعرفة الجمركية (%)'}
              </label>
              <span className="font-mono font-bold text-indigo-600 bg-indigo-50/70 px-2 py-0.5 rounded-md">
                {params.tariffRate}%
              </span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={params.tariffRate}
              onChange={(e) => setParams({ ...params, tariffRate: parseInt(e.target.value) })}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[9px] text-slate-400 font-medium">
              <span>{isKurdish ? 'باجی کەم (کێبڕکێ)' : 'تعرفة منخفضة (تنشيط)'}</span>
              <span>{isKurdish ? 'باجی زۆر (کەمکردنەوەی هاوردە)' : 'تعرفة مرتفعة (حمائية)'}</span>
            </div>
          </div>

          {/* 2. Automation strength */}
          <div className="space-y-1.5 bg-slate-50/50 p-3.5 rounded-2xl border border-slate-100/60">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-slate-700">
                {isKurdish ? 'ئاستی چاودێری ئەلیکترۆنی و سێرڤەران (%)' : 'مستوى الأتمتة وحوكمة المعاملات (%)'}
              </label>
              <span className="font-mono font-bold text-indigo-600 bg-indigo-50/70 px-2 py-0.5 rounded-md">
                {params.policyStrength}%
              </span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={params.policyStrength}
              onChange={(e) => setParams({ ...params, policyStrength: parseInt(e.target.value) })}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[9px] text-slate-400 font-medium">
              <span>{isKurdish ? 'کاغەزی / کۆن' : 'تبادل ورقي تقليدي'}</span>
              <span>{isKurdish ? 'تەواو دیجیتاڵی (ئاسیکۆدا)' : 'أتمتة مكاملة ورقمية'}</span>
            </div>
          </div>

          {/* 3. Border control strength */}
          <div className="space-y-1.5 bg-slate-50/50 p-3.5 rounded-2xl border border-slate-100/60">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-slate-700">
                {isKurdish ? 'ئاستی چڕی پشکین لە مەرزەکان (%)' : 'كثافة الفحص اللوجستي والأمني (%)'}
              </label>
              <span className="font-mono font-bold text-indigo-600 bg-indigo-50/70 px-2 py-0.5 rounded-md">
                {params.borderControl}%
              </span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={params.borderControl}
              onChange={(e) => setParams({ ...params, borderControl: parseInt(e.target.value) })}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[9px] text-slate-400 font-medium">
              <span>{isKurdish ? 'خێرا / پشکنینی کەم' : 'عبور سريع (فحص عشوائي)'}</span>
              <span>{isKurdish ? 'پشکنینی چڕ لەسەر گشت مانیفێستێک' : 'فحص شامل ومكثف'}</span>
            </div>
          </div>

          {/* 4. Fuel costs/index */}
          <div className="space-y-1.5 bg-slate-50/50 p-3.5 rounded-2xl border border-slate-100/60">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-slate-700">
                {isKurdish ? 'نرخی وزە و تێچووی گواستنەوە (%)' : 'مؤشر تكلفة الطاقة والوقود (%)'}
              </label>
              <span className="font-mono font-bold text-indigo-600 bg-indigo-50/70 px-2 py-0.5 rounded-md">
                {params.fuelCostIndex}%
              </span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={params.fuelCostIndex}
              onChange={(e) => setParams({ ...params, fuelCostIndex: parseInt(e.target.value) })}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[9px] text-slate-400 font-medium">
              <span>{isKurdish ? 'سووتەمەنی هەرزان' : 'طاقة رخيصة'}</span>
              <span>{isKurdish ? 'سووتەمەنی گران (پاڵپشتی کەم)' : 'طاقة غالية'}</span>
            </div>
          </div>

          {/* 5. Corridor Capacity */}
          <div className="space-y-1.5 bg-slate-50/50 p-3.5 rounded-2xl border border-slate-100/60">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-slate-700">
                {isKurdish ? 'توانای مەنەفێستی کەناڵی وشک (%)' : 'طاقة استيعاب ممر العبور البري (%)'}
              </label>
              <span className="font-mono font-bold text-indigo-600 bg-indigo-50/70 px-2 py-0.5 rounded-md">
                {params.corridorCap}%
              </span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={params.corridorCap}
              onChange={(e) => setParams({ ...params, corridorCap: parseInt(e.target.value) })}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[9px] text-slate-400 font-medium">
              <span>{isKurdish ? 'ژێرخانی سنووردار' : 'بنية تحتية ضعيفة'}</span>
              <span>{isKurdish ? 'کەناڵی وشکی پێشکەوتوو' : 'قناة جافة مكاملة کلياً'}</span>
            </div>
          </div>
        </div>

        {/* Real-time Outputs & Graph */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-5">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              {isKurdish ? 'ئەنجامەکانی پێشبینیکراو بە کاتی ڕاستەقینە' : 'مخرجات التنبؤ الاقتصادي المباشر'}
            </h4>

            <div className="grid grid-cols-2 gap-3">
              {/* Predicted Revenue */}
              <div className="bg-slate-50 border border-slate-100/60 p-4 rounded-2xl">
                <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wide">
                  {isKurdish ? 'داهاتی پێشبینیکراو (مانگانە)' : 'الإيرادات المتوقعة شهرياً'}
                </span>
                <span className="text-lg font-black text-slate-900 block mt-1 tracking-tight">
                  {formatBillion(simResult.predictedRevenue)}
                </span>
                <span className={`text-xs font-bold flex items-center gap-1 mt-1.5 ${simResult.revenueChangePct >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {simResult.revenueChangePct >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                  <span>{simResult.revenueChangePct >= 0 ? '+' : ''}{simResult.revenueChangePct.toFixed(2)}%</span>
                </span>
              </div>

              {/* Predicted Volume */}
              <div className="bg-slate-50 border border-slate-100/60 p-4 rounded-2xl">
                <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wide">
                  {isKurdish ? 'قەبارەی بار لە بەندەرەکان' : 'إجمالي الشحنات والحاويات'}
                </span>
                <span className="text-lg font-black text-slate-900 block mt-1 tracking-tight">
                  {simResult.predictedVolume.toFixed(1)}k TEU
                </span>
                <span className={`text-xs font-bold flex items-center gap-1 mt-1.5 ${simResult.volumeChangePct >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {simResult.volumeChangePct >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                  <span>{simResult.volumeChangePct >= 0 ? '+' : ''}{simResult.volumeChangePct.toFixed(2)}%</span>
                </span>
              </div>
            </div>

            {/* Simulated confidence and risks evaluation banner */}
            <div className="mt-4 bg-slate-50/40 border border-slate-100 p-3.5 rounded-2xl flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400 text-[10px] font-bold uppercase block">
                  {isKurdish ? 'پلەی متمانەی مۆدێل' : 'درجة موثوقية نموذج النمذجة'}
                </span>
                <span className="font-extrabold text-slate-800 text-sm mt-0.5 block font-mono">
                  {simResult.confidenceScore.toFixed(1)}% {isKurdish ? 'ڕاستی پێوەر' : 'دقة لوجستية'}
                </span>
              </div>
              <div className="text-left">
                <span className="text-slate-400 text-[10px] font-bold uppercase block">
                  {isKurdish ? 'ئاستی کاریگەری چاکسازیەکە' : 'مستوى تأثير القرار المالي'}
                </span>
                <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-lg inline-block mt-1 font-mono ${
                  simResult.impactLevel === 'CRITICAL' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                  simResult.impactLevel === 'HIGH' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                  simResult.impactLevel === 'MEDIUM' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                  'bg-emerald-50 text-emerald-600 border border-emerald-100'
                }`}>
                  {simResult.impactLevel}
                </span>
              </div>
            </div>

            {/* Dynamic risks log from the simulator */}
            <div className="mt-4 bg-amber-50/30 border border-amber-500/10 p-4 rounded-2xl space-y-1.5">
              <h5 className="text-[10px] font-bold uppercase tracking-wider text-amber-600 flex items-center gap-1.5 select-none">
                <Zap className="w-3.5 h-3.5 fill-amber-500/10 text-amber-500" />
                <span>{isKurdish ? 'پشکنینی هەستیاری و ڕیسکەکانی پەرپێدان' : 'سجل تقييم المخاطر الفورية'}</span>
              </h5>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {isKurdish ? simResult.kuRisks[0] : simResult.arRisks[0]}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Workspace Save Form */}
            <div className="border border-slate-100 p-3 bg-slate-50/50 rounded-2xl flex gap-2">
              <input 
                type="text" 
                maxLength={45}
                placeholder={isKurdish ? 'ناوی سیناریۆکە (بۆ نموونە: تاریفەی نوێ)...' : 'اسم المحاكاة لحفظها في سحابة العمل...'}
                value={scenarioName}
                onChange={(e) => setScenarioName(e.target.value)}
                className="flex-1 bg-white border border-slate-200 rounded-xl px-3.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500/80 font-medium"
              />
              <button 
                onClick={handleSaveScenario}
                disabled={isSaving}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-indigo-500/5 duration-150 flex items-center gap-1.5 cursor-pointer disabled:opacity-70"
              >
                {isSaving ? (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                <span>{isKurdish ? 'پاشەکەوت بە لایڤ' : 'سحابة'}</span>
              </button>
            </div>

            {/* Saved Scenarios Workspace Links */}
            {workspaceScenarios.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block select-none">
                  {isKurdish ? "سیناریۆ پاشەکەوتکراوەکانت (مزامنة Firestore)" : "السيناريوهات المحفوظة في مساحتك السحابية"}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {workspaceScenarios.map((sc, idx) => (
                    <div 
                      key={idx} 
                      className="inline-flex items-center gap-1.5 bg-indigo-50/50 hover:bg-indigo-50 border border-indigo-100/50 px-2.5 py-1 rounded-xl transition-all text-[10px] font-bold"
                    >
                      <button 
                        onClick={() => handleApplySavedScenario(sc)}
                        className="text-slate-700 hover:text-indigo-600"
                        title="Apply"
                      >
                        {sc.name}
                      </button>
                      <button 
                        onClick={() => handleDeleteScenario(sc.id)}
                        className="text-slate-400 hover:text-rose-600 ml-1.5"
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA action to compile strategic decision layout */}
            <button 
              onClick={handleGenerateReport}
              className="w-full py-3 bg-slate-900 border border-slate-800 text-white text-xs font-bold rounded-2xl hover:bg-black transition-all shadow-md shadow-slate-900/10 flex items-center justify-center gap-2 duration-150 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-indigo-400" />
              <span>{isKurdish ? "ئاراستەکردنی ڕاپۆرت بۆ سەرکردایەتی نیشتمانی (Decision Support)" : "رفع التقرير لمركز الشؤون الاقتصادية الوطني"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
