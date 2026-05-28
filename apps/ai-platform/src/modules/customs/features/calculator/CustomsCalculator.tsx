import React, { useState, useEffect } from 'react';
import { Button, Badge, GlassCard, Skeleton, cn } from '@idg/ui';
import { CustomsRecord } from '@idg/domain';
import { 
  Calculator, 
  Layers, 
  Receipt, 
  Clock, 
  Plus, 
  Trash2, 
  Sparkles, 
  FileText, 
  TrendingUp, 
  Scale
} from 'lucide-react';
import { useSettingsStore } from '@/store/settingsStore';

export function CustomsCalculator() {
  const { lang } = useSettingsStore();
  const [shipmentId, setShipmentId] = useState('SH-' + Math.floor(1000 + Math.random() * 9000));
  const [hsCode, setHsCode] = useState('8517.13.00');
  const [declaredValue, setDeclaredValue] = useState<number>(12500);
  const [assessedMultiplier, setAssessedMultiplier] = useState<number>(1.1); // CIF Value multiplier
  const [tariffRate, setTariffRate] = useState<number>(8);
  const [customsStatus, setCustomsStatus] = useState<CustomsRecord['status']>('PENDING');

  const [records, setRecords] = useState<CustomsRecord[]>([
    {
      id: 'CR-101',
      shipmentId: 'SH-8942',
      hsCode: '8517.13.00',
      declaredValue: 15400,
      assessedValue: 16940,
      tariffRate: 8,
      totalDuty: 1355.20,
      status: 'APPROVED',
    },
    {
      id: 'CR-102',
      shipmentId: 'SH-4412',
      hsCode: '8703.23.00',
      declaredValue: 32000,
      assessedValue: 35200,
      tariffRate: 15,
      totalDuty: 5280.00,
      status: 'UNDER_REVIEW',
    }
  ]);

  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingStats(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const assessedValue = Math.round(declaredValue * assessedMultiplier * 100) / 100;
  const totalDuty = Math.round(assessedValue * (tariffRate / 100) * 100) / 100;

  const handleAddRecord = () => {
    if (!shipmentId || !hsCode || declaredValue <= 0) return;

    const newRecord: CustomsRecord = {
      id: 'CR-' + Math.floor(100 + Math.random() * 900),
      shipmentId,
      hsCode,
      declaredValue,
      assessedValue,
      tariffRate,
      totalDuty,
      status: customsStatus,
    };

    setRecords([newRecord, ...records]);
    setShipmentId('SH-' + Math.floor(1000 + Math.random() * 9000));
  };

  const handleDeleteRecord = (id: string) => {
    setRecords(records.filter(r => r.id !== id));
  };

  const getStatusBadge = (status: CustomsRecord['status']) => {
    switch (status) {
      case 'APPROVED':
        return (
          <Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-[10px] px-2 py-0.5 whitespace-nowrap">
            {lang === 'ku' ? 'پەسەندکراو' : lang === 'ar' ? 'تمت الموافقة' : 'APPROVED'}
          </Badge>
        );
      case 'UNDER_REVIEW':
        return (
          <Badge variant="secondary" className="bg-amber-500 hover:bg-amber-600 text-white font-semibold text-[10px] px-2 py-0.5 whitespace-nowrap">
            {lang === 'ku' ? 'لە ژێر پشکنین' : lang === 'ar' ? 'تحت التدقيق' : 'UNDER REVIEW'}
          </Badge>
        );
      case 'REJECTED':
        return (
          <Badge variant="destructive" className="bg-rose-500 hover:bg-rose-600 text-white font-semibold text-[10px] px-2 py-0.5 whitespace-nowrap">
            {lang === 'ku' ? 'ڕەتکراوە' : lang === 'ar' ? 'مرفوض' : 'REJECTED'}
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="border-slate-400 dark:border-slate-600 text-slate-500 font-semibold text-[10px] px-2 py-0.5 whitespace-nowrap">
            {lang === 'ku' ? 'چاوەڕێ' : lang === 'ar' ? 'قيد الانتظار' : 'PENDING'}
          </Badge>
        );
    }
  };

  const totalCalculatedDuty = records.reduce((sum, r) => sum + r.totalDuty, 0);
  const totalAssessedValue = records.reduce((sum, r) => sum + r.assessedValue, 0);

  const tCalc = {
    ku: {
      headerTitle: "حیسابکەری تاریفە و گومرگی عێراق",
      headerDesc: "هاوتەریب لەگەڵ کۆدەکانی HS و ڕێنمایییەکانی ساڵی ٢٠٢٦ بۆ باج و گومرگی هاوردەکردن لە هەموو مەرزەکان.",
      activeVolume: "قەبارەی تێپەڕیو: ",
      assessmentModel: "مۆدێلی خەمڵاندنی مانیفێست",
      shipmentId: "کۆدی شحنەکە (Shipment ID)",
      hsCode: "کۆدی HS (پۆلێنکردنی تاریفە)",
      declaredValue: "بڕی کاڵا بە دۆلار (Declared Value USD)",
      cifMultiplier: "هاوکۆلکەی CIF (بیمە و شحن)",
      tariffRate: "ڕێژەی باج یان تاریفە (%)",
      customsStatus: "دۆخی پێشنیارکراو بۆ سەلامەتی بار",
      saveBtn: "پاشەکەوتکردنی مانیفێستەکە",
      liveAssessment: "خەمڵاندنی ڕاستەوخۆ (Live)",
      dutyEstimator: "ئامێری خەمڵاندنی بابەت",
      cifValue: "بەهای گشتی بە CIF",
      adValoremDuty: "باجی دەستنیشانکراو",
      serviceFee: "کرێی خزمەتگوزاری ترانزێت",
      waived: "خۆڕایی / بەخشراو",
      dutyEstimatePayable: "کۆی گشتی باجی پێشبینیکراو",
      expectedTime: "کاتی چاوەڕوانی بۆ راییکردن:",
      expectedTimeValue: "٢٤ بۆ ٤٨ کاتژمێر لە ڕێگەی دەروازە سەرەکییەکانەوە. بەپێی پشکنینی بریکار.",
      savedEntries: "داواکارییە لێکدراوەکان",
      accumulatedDuty: "کۆی گشتی باجەکان",
      avgTariffRate: "تێکڕای ڕێژەی تاریفە",
      declarationsTableTitle: "پێڕستی مانیفێست و لێکدانەوە گومرگییەکان",
      tableCount: "بەردەوام لەسەر مۆدێلەکە:",
      colRecord: "ناسێنەری تۆمار",
      colShipment: "کۆدی تاقیکاری",
      colHS: "کۆدی HS",
      colDeclared: "ڕاگەیەندراو (USD)",
      colAssessed: "هاوتا بە (USD)",
      colTariff: "ڕێژەی باج",
      colDuty: "باجی پێویست",
      colStatus: "دۆخی بار",
      colAction: "کردار",
      noRecords: "هیچ گۆڕانکارییەک تۆمار نەکراوە. دەتوانیت لەسەرەوە مۆدێلەکە بەکاربهێنیت."
    },
    ar: {
      headerTitle: "حاسبة الرسوم والتعرفة الجمركية للعراق",
      headerDesc: "متوافقة بالكامل مع رموز النظام المنسق اللوائح ٢٠٢٦ لتحديد قيمة الرسوم والضرائب المستحقة للسلع.",
      activeVolume: "إجمالي القيمة المخلصة: ",
      assessmentModel: "نموذج تقييم مصلحة الجمارك",
      shipmentId: "معرف الشحنة (Shipment ID)",
      hsCode: "رمز النظام المنسق (رمز HS Code)",
      declaredValue: "القيمة المعرّف عنها بالدولار (Value USD)",
      cifMultiplier: "معامل تأمين الشحن (CIF)",
      tariffRate: "نسبة الرسوم والضرائب (%)",
      customsStatus: "الحالة الأمنية المحددة للبيانات",
      saveBtn: "حفظ حسابات البيان الجمركي",
      liveAssessment: "التقييم الفوري المباشر",
      dutyEstimator: "مقدّر الرسوم",
      cifValue: "قيمة CIF الخاضعة للرسوم",
      adValoremDuty: "الرسم القيمي النسبي",
      serviceFee: "رسوم الخدمة ومناولة الطرفية",
      waived: "معفى حالياً / خدمة موحدة",
      dutyEstimatePayable: "إجمالي الرسوم الجمركية المقدرة",
      expectedTime: "الوقت المتوقع للتخليص:",
      expectedTimeValue: "٢٤ إلى ٤٨ ساعة عبر المنافذ الحدودية الكبرى، خاضع للتدقيق والمطابقة.",
      savedEntries: "البيانات المسجلة",
      accumulatedDuty: "إجمالي الرسوم التراكمية",
      avgTariffRate: "متوسط نسبة التعرفة",
      declarationsTableTitle: "سجل البيانات والقيود الجمركية النشطة",
      tableCount: "إجمالي البيانات المسجلة:",
      colRecord: "رقم القيد",
      colShipment: "معرف الشحنة",
      colHS: "رمز التعريفة",
      colDeclared: "المعلن عنه (USD)",
      colAssessed: "المقيّم بـ (USD)",
      colTariff: "نسبة التعرفة",
      colDuty: "الرسوم المفروضة",
      colStatus: "حالة السند",
      colAction: "الإجراء",
      noRecords: "لا توجد حسابات مسجلة حالياً. استخدم النموذج في الأعلى لحساب والاحتفاظ بالبيانات."
    }
  };

  const ui = tCalc[lang === 'ku' ? 'ku' : 'ar'];

  return (
    <div className="space-y-6" id="customs-calculator-feature">
      {/* Feature Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-primary" />
            <h2 className="text-base font-bold text-foreground tracking-tight">{ui.headerTitle}</h2>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {ui.headerDesc}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {loadingStats ? (
            <Skeleton className="h-6 w-32" />
          ) : (
            <Badge variant="outline" className="text-xs font-mono px-2.5 py-1 border-primary/20 bg-primary/5 text-primary flex items-center gap-1">
              <span>{ui.activeVolume}</span>
              <span dir="ltr">${totalAssessedValue.toLocaleString()}</span>
            </Badge>
          )}
        </div>
      </div>

      {/* Main Layout containing Input Form and Live Summary Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Input Panel */}
        <div className="lg:col-span-7 space-y-4">
          <GlassCard className="p-6 space-y-4">
            <h3 className="text-sm font-bold flex items-center gap-1.5 text-foreground leading-none">
              <Layers className="w-4 h-4 text-primary" />
              {ui.assessmentModel}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5 text-right">
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">{ui.shipmentId}</label>
                <input
                  type="text"
                  value={shipmentId}
                  onChange={(e) => setShipmentId(e.target.value)}
                  dir="ltr"
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-background text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary text-left"
                />
              </div>

              <div className="space-y-1.5 text-right">
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">{ui.hsCode}</label>
                <input
                  type="text"
                  value={hsCode}
                  onChange={(e) => setHsCode(e.target.value)}
                  dir="ltr"
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-background text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary text-left"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5 text-right">
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">{ui.declaredValue}</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-mono font-bold">$</span>
                  <input
                    type="number"
                    value={declaredValue}
                    onChange={(e) => setDeclaredValue(Number(e.target.value))}
                    dir="ltr"
                    className="w-full h-10 pl-7 pr-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-background text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary text-left"
                  />
                </div>
              </div>

              <div className="space-y-1.5 text-right">
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">{ui.cifMultiplier}</label>
                <select
                  value={assessedMultiplier}
                  onChange={(e) => setAssessedMultiplier(Number(e.target.value))}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer font-semibold"
                >
                  <option value={1.0}>1.0x (FOB Only)</option>
                  <option value={1.05}>1.05x (Standard Freight)</option>
                  <option value={1.1}>1.10x (Standard CIF)</option>
                  <option value={1.15}>1.15x (High Insurance CIF)</option>
                </select>
              </div>

              <div className="space-y-1.5 text-right">
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">{ui.tariffRate}</label>
                <div className="relative">
                  <input
                    type="number"
                    value={tariffRate}
                    onChange={(e) => setTariffRate(Number(e.target.value))}
                    dir="ltr"
                    className="w-full h-10 pl-3 pr-7 rounded-lg border border-slate-200 dark:border-slate-800 bg-background text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary text-left"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-mono font-bold">%</span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5 text-right">
              <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">{ui.customsStatus}</label>
              <div className="flex flex-wrap gap-2 pt-1 justify-start">
                {(['PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'] as CustomsRecord['status'][]).map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setCustomsStatus(status)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer",
                      customsStatus === status 
                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                        : "bg-background text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900"
                    )}
                  >
                    {status === 'APPROVED' && (lang === 'ku' ? 'پەسەندکراو' : lang === 'ar' ? 'تمت الموافقة' : 'APPROVED')}
                    {status === 'UNDER_REVIEW' && (lang === 'ku' ? 'لە ژێر پشکنین' : lang === 'ar' ? 'تحت التدقيق' : 'UNDER REVIEW')}
                    {status === 'REJECTED' && (lang === 'ku' ? 'ڕەتکراوە' : lang === 'ar' ? 'مرفوض' : 'REJECTED')}
                    {status === 'PENDING' && (lang === 'ku' ? 'چاوەڕێ' : lang === 'ar' ? 'قيد الانتظار' : 'PENDING')}
                  </button>
                ))}
              </div>
            </div>

            <Button 
              onClick={handleAddRecord}
              className="w-full h-10 text-xs font-bold gap-1.5 cursor-pointer bg-[#0066FF] hover:bg-blue-600"
            >
              <Plus className="w-4 h-4" /> {ui.saveBtn}
            </Button>
          </GlassCard>
        </div>

        {/* Dynamic Display / Live Estimation */}
        <div className="lg:col-span-5 space-y-4">
          <GlassCard className="p-6 border-blue-500/20 bg-blue-500/[0.01] dark:bg-blue-500/[0.02]/2 shadow-md relative overflow-hidden flex flex-col justify-between min-h-[310px]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none" />
            
            <div className="space-y-4 relative">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
                  {ui.liveAssessment}
                </span>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full font-bold">{ui.dutyEstimator}</span>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-semibold">{ui.cifValue}</span>
                  <span className="font-mono font-bold text-foreground" dir="ltr">${assessedValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-semibold">{ui.adValoremDuty} ({tariffRate}%)</span>
                  <span className="font-mono font-bold text-foreground" dir="ltr">${(assessedValue * (tariffRate / 100)).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-semibold">{ui.serviceFee}</span>
                  <span className="font-semibold text-slate-400">{ui.waived}</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-150 dark:border-slate-800 space-y-4 relative">
              <div className="text-center">
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">{ui.dutyEstimatePayable}</p>
                <div className="text-3xl font-black text-[#0066FF] font-mono tracking-tight" dir="ltr">
                  ${totalDuty.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border flex items-start gap-2.5 text-[10px] text-slate-500 leading-relaxed font-semibold">
                <Clock className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>
                  <strong>{ui.expectedTime} </strong> {ui.expectedTimeValue}
                </span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard className="p-4 flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-xl text-primary">
            <Scale className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-slate-500 uppercase font-bold">{ui.savedEntries}</p>
            {loadingStats ? (
              <Skeleton className="h-5 w-16 mt-1" />
            ) : (
              <p className="text-base font-bold font-mono mt-0.5 text-foreground" dir="ltr">{records.length}</p>
            )}
          </div>
        </GlassCard>

        <GlassCard className="p-4 flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
            <Receipt className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-slate-500 uppercase font-bold">{ui.accumulatedDuty}</p>
            {loadingStats ? (
              <Skeleton className="h-5 w-24 mt-1" />
            ) : (
              <p className="text-base font-bold font-mono mt-0.5 text-foreground animate-fade-in" dir="ltr">
                ${totalCalculatedDuty.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            )}
          </div>
        </GlassCard>

        <GlassCard className="p-4 flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-slate-500 uppercase font-bold">{ui.avgTariffRate}</p>
            {loadingStats ? (
              <Skeleton className="h-5 w-12 mt-1" />
            ) : (
              <p className="text-base font-bold font-mono mt-0.5 text-foreground" dir="ltr">
                {(records.reduce((sum, r) => sum + r.tariffRate, 0) / (records.length || 1)).toFixed(1)}%
              </p>
            )}
          </div>
        </GlassCard>
      </div>

      {/* Declarations Saved List */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold flex items-center gap-1.5 text-foreground leading-none">
            <FileText className="w-4 h-4 text-[#0066FF]" />
            {ui.declarationsTableTitle}
          </h3>
          <span className="text-[10px] font-mono text-slate-400">{ui.tableCount} {records.length}</span>
        </div>

        <div className="overflow-x-auto border rounded-[16px] bg-background/50">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b bg-muted/50 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="p-3 pl-4 text-right sm:text-left">{ui.colRecord}</th>
                <th className="p-3 text-right sm:text-left">{ui.colShipment}</th>
                <th className="p-3 text-right sm:text-left">{ui.colHS}</th>
                <th className="p-3 text-right">{ui.colDeclared}</th>
                <th className="p-3 text-right">{ui.colAssessed}</th>
                <th className="p-3 text-center">{ui.colTariff}</th>
                <th className="p-3 text-right">{ui.colDuty}</th>
                <th className="p-3 text-center">{ui.colStatus}</th>
                <th className="p-3 text-center pr-4">{ui.colAction}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {records.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-xs text-slate-400 font-semibold italic">
                    {ui.noRecords}
                  </td>
                </tr>
              ) : (
                records.map((record) => (
                  <tr key={record.id} className="hover:bg-muted/20 transition-all">
                    <td className="p-3 pl-4 font-mono font-bold text-slate-500 text-[11px] text-left" dir="ltr">{record.id}</td>
                    <td className="p-3 font-mono font-bold text-foreground text-[11px] text-left" dir="ltr">{record.shipmentId}</td>
                    <td className="p-3 font-mono text-[11px] text-left" dir="ltr">{record.hsCode}</td>
                    <td className="p-3 text-right font-mono text-[11px]" dir="ltr">${record.declaredValue.toLocaleString()}</td>
                    <td className="p-3 text-right font-mono text-[11px] font-semibold" dir="ltr">${record.assessedValue.toLocaleString()}</td>
                    <td className="p-3 text-center font-mono text-[11px]" dir="ltr">{record.tariffRate}%</td>
                    <td className="p-3 text-right font-mono text-[11px] font-black text-primary" dir="ltr">${record.totalDuty.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td className="p-3 text-center">{getStatusBadge(record.status)}</td>
                    <td className="p-3 text-center pr-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-md cursor-pointer"
                        onClick={() => handleDeleteRecord(record.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
export default CustomsCalculator;
