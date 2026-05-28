import React, { useState } from 'react';
import { Button, Badge, GlassCard, cn } from '@idg/ui';
import { CustomsRecord } from '@idg/domain';
import { 
  Shield, 
  Settings, 
  Users, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Globe, 
  Sliders, 
  Search, 
  Save, 
  RefreshCw, 
  UserCheck, 
  MapPin, 
  FileCheck2, 
  Database 
} from 'lucide-react';
import { useSettingsStore } from '@/store/settingsStore';

interface BorderGatewayConfig {
  gatewayId: string;
  portName: string;
  defaultMultiplier: number;
  strictComplianceMode: boolean;
  fastTrackEnabled: boolean;
  activeBrokers: number;
}

interface Broker {
  id: string;
  name: string;
  licenseNumber: string;
  assignedPort: string;
  clearanceRate: string;
  status: 'ACTIVE' | 'SUSPENDED';
}

export function AdminPanel() {
  const { lang } = useSettingsStore();
  const [activeTab, setActiveTab] = useState<'audit' | 'brokers' | 'settings'>('audit');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Initial list of borders configuration
  const [gateways, setGateways] = useState<BorderGatewayConfig[]>([
    { gatewayId: 'AX-4001', portName: 'Umm Qasr Port (Basra)', defaultMultiplier: 1.10, strictComplianceMode: true, fastTrackEnabled: true, activeBrokers: 12 },
    { gatewayId: 'AX-4002', portName: 'Ibrahim Al-Khalil (Duhok)', defaultMultiplier: 1.05, strictComplianceMode: true, fastTrackEnabled: false, activeBrokers: 8 },
    { gatewayId: 'AX-4003', portName: 'Baghdad Airport Cargo', defaultMultiplier: 1.15, strictComplianceMode: false, fastTrackEnabled: true, activeBrokers: 15 },
    { gatewayId: 'AX-4004', portName: 'Safwan Border (Kuwait)', defaultMultiplier: 1.10, strictComplianceMode: false, fastTrackEnabled: false, activeBrokers: 6 }
  ]);

  // Initial list of Customs Clearers / Brokers
  const [brokers] = useState<Broker[]>([
    { id: 'BR-101', name: 'Al-Khafaji Logistics Co.', licenseNumber: 'IQ-BROKER-8924', assignedPort: 'Umm Qasr Port (Basra)', clearanceRate: '98.4%', status: 'ACTIVE' },
    { id: 'BR-102', name: 'Mesopotamia Border Services', licenseNumber: 'IQ-BROKER-4512', assignedPort: 'Ibrahim Al-Khalil (Duhok)', clearanceRate: '96.2%', status: 'ACTIVE' },
    { id: 'BR-103', name: 'Babylon Rapid Customs Ltd.', licenseNumber: 'IQ-BROKER-3091', assignedPort: 'Baghdad Airport Cargo', clearanceRate: '99.1%', status: 'ACTIVE' },
    { id: 'BR-104', name: 'Shatt Al-Arab Freight agency', licenseNumber: 'IQ-BROKER-1104', assignedPort: 'Safwan Border (Kuwait)', clearanceRate: '85.7%', status: 'SUSPENDED' }
  ]);

  // Active customs records for administrative control
  const [records, setRecords] = useState<CustomsRecord[]>([
    { id: 'CR-101', shipmentId: 'SH-8942', hsCode: '8517.13.00', declaredValue: 15400, assessedValue: 16940, tariffRate: 8, totalDuty: 1355.20, status: 'APPROVED' },
    { id: 'CR-102', shipmentId: 'SH-4412', hsCode: '8703.23.00', declaredValue: 32000, assessedValue: 35200, tariffRate: 15, totalDuty: 5280.00, status: 'UNDER_REVIEW' },
    { id: 'CR-103', shipmentId: 'SH-3091', hsCode: '8471.30.00', declaredValue: 8900, assessedValue: 9790, tariffRate: 5, totalDuty: 489.50, status: 'PENDING' },
    { id: 'CR-104', shipmentId: 'SH-1102', hsCode: '3004.90.00', declaredValue: 24500, assessedValue: 24500, tariffRate: 0, totalDuty: 0, status: 'APPROVED' },
    { id: 'CR-105', shipmentId: 'SH-7756', hsCode: '1006.30.00', declaredValue: 45000, assessedValue: 49500, tariffRate: 2, totalDuty: 990.00, status: 'REJECTED' }
  ]);

  const [savingSettings, setSavingSettings] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Status adjustment action
  const handleUpdateStatus = (id: string, newStatus: CustomsRecord['status']) => {
    setRecords(prev => prev.map(rec => rec.id === id ? { ...rec, status: newStatus } : rec));
  };

  // Border config toggles
  const handleToggleStrict = (id: string) => {
    setGateways(prev => prev.map(g => g.gatewayId === id ? { ...g, strictComplianceMode: !g.strictComplianceMode } : g));
  };

  const handleToggleFastTrack = (id: string) => {
    setGateways(prev => prev.map(g => g.gatewayId === id ? { ...g, fastTrackEnabled: !g.fastTrackEnabled } : g));
  };

  const handleSaveAllSettings = () => {
    setSavingSettings(true);
    setTimeout(() => {
      setSavingSettings(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 800);
  };

  const filteredRecords = records.filter(rec => {
    const matchesSearch = rec.shipmentId.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          rec.hsCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = statusFilter === 'ALL' || rec.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const tAdmin = {
    ku: {
      title: "بەڕێوبەرایەتی گشتی گومرک و تاریفەی ناوەندی",
      desc: "بەڕێوەبردنی یاساکان، چاودێری کاڵا، مۆڵەتنامەی بریکارەکان و بەستەرەکانی دەروازەی جیاواز.",
      tabAudit: "پێداچوونەوەی پابەندبوون",
      tabBrokers: "نۆوسینگەی بریکارەکان",
      tabSettings: "ڕێکخستنی دەروازەکان",
      searchPlaceholder: "گەڕان بەپێی کۆدی مانیفێست یان HS...",
      recordsCount: "تۆمار جیاواز دۆزرایەوە",
      panelPendingTitle: "مانیفێست و دەروازە چالاکەکانی تێپەڕین",
      colRecord: "ناسێنەری تۆمار",
      colShipment: "کۆدی بار",
      colHS: "پۆلێنی کاڵا (HS)",
      colDeclared: "ڕاگەیەندراو (USD)",
      colAssessed: "هاوتای فەرمی (USD)",
      colRate: "ڕێژە",
      colDuty: "باجی پێویست",
      colStatus: "دۆخی سەلامەتی",
      colOverride: "دەسەڵاتی ناوبژیوانی",
      noRecords: "هیچ گۆڕانکارییەک نەدۆزرایەوە بۆ پاڵفتەکانی ئێستا.",
      activeBrokerTitle: "تۆماری فەرمی بریکارە مۆڵەتپێدراوەکان",
      governedLicenses: "مۆڵەتی بەڕێوەبەرایەتی",
      thBroker: "ناوی بریکار",
      thLicense: "ژمارەی مۆڵەتبار",
      thBorder: "دەروازەی دیاریکراو",
      thRate: "نمرەی خزمەتگوزاری",
      thStatus: "دۆخی کار",
      regulatoryTitle: "چاودێری یاسایی بریکار",
      regulatoryDesc: "بریکار و نووسینگەکانی مۆڵەتکراو لەم پەڕەیەدا دەبێت چاودێری مۆدێلە فەرمییەکان بکەن بۆ بەدەستهێنانی مۆڵەتی چالاک. ڕاگرتن یان سڕکردنی مۆڵەت ڕێگری دەکات لە پرۆسەی بەئەلکترۆنیکردنی بارەکان.",
      jointControlsTitle: "کۆنتڕۆڵ و ڕێکخستنی سنوورە فەرمییەکان",
      globalParams: "بەها جیهانییەکان",
      saveBtn: "پاشەکەوتکردنی ڕێکخستنەکان",
      saveBtnUpdating: "چاوەڕێ دەکات...",
      successMsg: "هاوکۆلکە و بارەکانی دەروازە گشتییەکان بە سەرکەوتوویی لەگەڵ سیستەمی ناوەندی جێبەجێ کرا!",
      enforceRulesTitle: "یاساکانی چاودێری",
      enforceRulesDesc: "ڕێڕەوی خێرا سیستمەکە فەرز دەکات بۆ کاڵا زیاتر ناسراو یان کەم مەترسییەکان. دۆخی توندگیری پێداچوونەوەی ١٠٠٪ـی مانیفێست فەرز دەکات کە دەبێت لە ڕێگەی بریکارەکان و بە ڕێکارە دستییەکاندا بڕوات."
    },
    ar: {
      title: "المديرية العامة للمراقبة والسياسات الجمركية",
      desc: "إدارة تفويضات الامتثال، معايير فحص الشحنات، سجل المخلصين المعتمدين والمنافذ الإقليمية.",
      tabAudit: "تدقيق الامتثال الجمركي",
      tabBrokers: "سجل المخلصين المرخصين",
      tabSettings: "إعدادات البوابات والمنافذ",
      searchPlaceholder: "البحث عن شحنة أو رمز تعريفة...",
      recordsCount: "القيود المسترجعة",
      panelPendingTitle: "البيانات والقيود الجمركية قيد المراجعة والمطابقة",
      colRecord: "رقم القيد",
      colShipment: "معرف الشحنة",
      colHS: "رمز النظام المنسق (HS)",
      colDeclared: "المعلن عنه (USD)",
      colAssessed: "المقيّم بالدولار (USD)",
      colRate: "النسبة",
      colDuty: "الرسوم المقدرة",
      colStatus: "الحالة الأمنية",
      colOverride: "إجراء التجاوز والتعديل",
      noRecords: "لا توجد بيانات جمركية مطابقة للخيارات الحالية.",
      activeBrokerTitle: "السجل الرقمي للمخلصين الجمركيين المعتمدين",
      governedLicenses: "التراخيص الحكومية",
      thBroker: "اسم مكتب التخليص",
      thLicense: "رقم رخصة العمل",
      thBorder: "المنفذ الحدودي المعين",
      thRate: "مستوى الأداء والسرعة",
      thStatus: "الحالة التشغيلية",
      regulatoryTitle: "التدقيق والمتابعة القانونية",
      regulatoryDesc: "يجب على جميع مكاتب ووكالات التخليص المدرجة الحفاظ على ترخيص أمني جاري من سلطة الجمارك المركزية لتتمكن من تقديم البيانات إلكترونياً وتنسيق عمليات العبور الجمركي.",
      jointControlsTitle: "التحكم في معايير البوابات الجمركية الإقليمية",
      globalParams: "المعايير العامة",
      saveBtn: "حفظ وتطبيق الخيارات",
      saveBtnUpdating: "جاري الإرسال...",
      successMsg: "تم تعميم وتطبيق عتبات سياسة الامتثال على المحطات الطرفية والحدودية بنجاح!",
      enforceRulesTitle: "قواعد التنظيم اللوجستي",
      enforceRulesDesc: "تتيح بوابات المرور السريع المعالجة الفورية المباشرة للشحنات ذات مؤشرات الخطورة المنخفضة. يؤدي تفعيل الوضع الصارم إلى إلزام المحطة بإجراء مراجعة يدوية بنسبة ١٠٠٪ لكافة الطرود التابعة."
    }
  };

  const ui = tAdmin[lang === 'ku' ? 'ku' : 'ar'];

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

  return (
    <div className="space-y-6" id="customs-admin-features">
      {/* Segment Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <h2 className="text-base font-bold text-foreground tracking-tight">{ui.title}</h2>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {ui.desc}
          </p>
        </div>
        
        {/* Navigation Selector */}
        <div className="flex border rounded-xl p-1 bg-background shadow-xs shrink-0 self-start md:self-auto" id="admin-tabs">
          <button
            onClick={() => setActiveTab('audit')}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer",
              activeTab === 'audit' ? "bg-primary text-primary-foreground font-bold shadow-xs" : "hover:bg-muted text-muted-foreground"
            )}
          >
            <FileCheck2 className="w-3.5 h-3.5" /> {ui.tabAudit}
          </button>
          <button
            onClick={() => setActiveTab('brokers')}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer",
              activeTab === 'brokers' ? "bg-primary text-primary-foreground font-bold shadow-xs" : "hover:bg-muted text-muted-foreground"
            )}
          >
            <Users className="w-3.5 h-3.5" /> {ui.tabBrokers}
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer",
              activeTab === 'settings' ? "bg-primary text-primary-foreground font-bold shadow-xs" : "hover:bg-muted text-muted-foreground"
            )}
          >
            <Settings className="w-3.5 h-3.5" /> {ui.tabSettings}
          </button>
        </div>
      </div>

      {/* Audit Panel View */}
      {activeTab === 'audit' && (
        <div className="space-y-4" id="compliance-audit-panel">
          <GlassCard className="p-4 flex flex-col md:flex-row gap-3 items-center justify-between shadow-xs">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder={ui.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                dir="ltr"
                className="w-full h-9 pl-9 pr-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-background text-xs focus:outline-none focus:ring-1 focus:ring-primary font-mono text-left"
              />
            </div>
            
            <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto self-stretch md:self-auto custom-scrollbar">
              {(['ALL', 'PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setStatusFilter(filter)}
                  className={cn(
                    "px-3 py-1 rounded-lg text-[10px] font-mono border transition-all h-8 break-keep shrink-0 cursor-pointer",
                    statusFilter === filter 
                      ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 border-slate-900 dark:border-slate-100 font-bold" 
                      : "bg-background text-slate-500 border-slate-200 dark:border-slate-800 hover:bg-slate-50"
                  )}
                >
                  {filter}
                </button>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-[#0066FF]" />
                <h3 className="text-sm font-bold text-foreground">{ui.panelPendingTitle}</h3>
              </div>
              <Badge variant="outline" className="text-[10px] font-mono font-medium">
                {filteredRecords.length} {ui.recordsCount}
              </Badge>
            </div>

            <div className="overflow-x-auto border rounded-2xl bg-background/50">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold text-[10px] uppercase tracking-wider">
                    <th className="p-3 pl-4 text-left">{ui.colRecord}</th>
                    <th className="p-3 text-left">{ui.colShipment}</th>
                    <th className="p-3 text-left">{ui.colHS}</th>
                    <th className="p-3 text-right">{ui.colDeclared}</th>
                    <th className="p-3 text-right">{ui.colAssessed}</th>
                    <th className="p-3 text-right">{ui.colRate}</th>
                    <th className="p-3 text-right">{ui.colDuty}</th>
                    <th className="p-3 text-center">{ui.colStatus}</th>
                    <th className="p-3 text-center pr-4">{ui.colOverride}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredRecords.map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors font-semibold">
                      <td className="p-3 font-mono text-slate-500 text-left" dir="ltr">{rec.id}</td>
                      <td className="p-3 font-mono font-bold text-foreground text-left" dir="ltr">{rec.shipmentId}</td>
                      <td className="p-3 text-left" dir="ltr">
                        <span className="font-mono bg-slate-100 dark:bg-slate-800 rounded px-2 py-0.5 text-[10px] text-slate-600 dark:text-slate-300">
                          {rec.hsCode}
                        </span>
                      </td>
                      <td className="p-3 text-right font-mono" dir="ltr">${rec.declaredValue.toLocaleString()}</td>
                      <td className="p-3 text-right font-mono text-slate-900 dark:text-slate-100 font-bold" dir="ltr">${rec.assessedValue.toLocaleString()}</td>
                      <td className="p-3 text-right font-mono text-slate-500" dir="ltr">{rec.tariffRate}%</td>
                      <td className="p-3 text-right font-mono text-primary font-black" dir="ltr">${rec.totalDuty.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td className="p-3 text-center">
                        {getStatusBadge(rec.status)}
                      </td>
                      <td className="p-3 pr-4">
                        <div className="flex items-center justify-center gap-1.5">
                          {rec.status !== 'APPROVED' && (
                            <Button
                              onClick={() => handleUpdateStatus(rec.id, 'APPROVED')}
                              className="h-7 w-7 p-0 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30 rounded-lg cursor-pointer"
                              id={`approve-${rec.id}`}
                              title="Approve Cargo"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </Button>
                          )}
                          {rec.status !== 'UNDER_REVIEW' && rec.status !== 'APPROVED' && (
                            <Button
                              onClick={() => handleUpdateStatus(rec.id, 'UNDER_REVIEW')}
                              className="h-7 w-7 p-0 bg-amber-50 hover:bg-amber-100 text-amber-600 border border-amber-200 dark:bg-amber-500/10 dark:hover:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500/30 rounded-lg cursor-pointer"
                              id={`review-${rec.id}`}
                              title="Under Review"
                            >
                              <AlertTriangle className="w-3.5 h-3.5" />
                            </Button>
                          )}
                          {rec.status !== 'REJECTED' && (
                            <Button
                              onClick={() => handleUpdateStatus(rec.id, 'REJECTED')}
                              className="h-7 w-7 p-0 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 dark:text-rose-400 dark:border-rose-500/30 rounded-lg cursor-pointer"
                              id={`reject-${rec.id}`}
                              title="Reject"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredRecords.length === 0 && (
                    <tr>
                      <td colSpan={9} className="p-8 text-center text-xs text-slate-400 italic">
                        {ui.noRecords}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Authorized Customs Clearers Tab */}
      {activeTab === 'brokers' && (
        <div className="space-y-6" id="customs-brokers-panel">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <GlassCard className="p-6 h-full space-y-4">
                <div className="flex items-center justify-between pb-3 border-b">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-primary" /> {ui.activeBrokerTitle}
                  </h3>
                  <Badge variant="outline" className="text-[10px] font-mono font-medium">{ui.governedLicenses}</Badge>
                </div>

                <div className="overflow-x-auto border rounded-2xl bg-background/50">
                  <table className="w-full border-collapse text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold text-[10px] uppercase tracking-wider">
                        <th className="p-3 pl-4">{ui.thBroker}</th>
                        <th className="p-3 text-left">{ui.thLicense}</th>
                        <th className="p-3">{ui.thBorder}</th>
                        <th className="p-3 text-right">{ui.thRate}</th>
                        <th className="p-3 text-center">{ui.thStatus}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {brokers.map(br => (
                        <tr key={br.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors font-semibold">
                          <td className="p-3 pl-4 text-foreground font-bold">{br.name}</td>
                          <td className="p-3 font-mono text-slate-500 text-left" dir="ltr">{br.licenseNumber}</td>
                          <td className="p-3 text-left">
                            <span className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-300">
                              <MapPin className="w-3 h-3 text-red-500 shrink-0" /> {br.assignedPort}
                            </span>
                          </td>
                          <td className="p-3 text-right font-mono font-bold text-emerald-500" dir="ltr">{br.clearanceRate}</td>
                          <td className="p-3 text-center">
                            {br.status === 'ACTIVE' ? (
                              <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30 text-[9px] font-bold">
                                {lang === 'ku' ? 'چالاک' : 'ACTIVE'}
                              </Badge>
                            ) : (
                              <Badge className="bg-rose-500/10 text-rose-500 border-rose-500/30 text-[9px] font-bold">
                                {lang === 'ku' ? 'ڕاگیراو' : 'SUSPENDED'}
                              </Badge>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </GlassCard>
            </div>

            {/* Verification Notice on right column */}
            <div className="space-y-4">
              <GlassCard className="p-6 border-amber-500/20 bg-amber-500/[0.01]/2 flex flex-col justify-between h-full">
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 tracking-wider uppercase flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 animate-pulse" /> {ui.regulatoryTitle}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
                    {ui.regulatoryDesc}
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 font-mono">
                  Framework: IQ-GW-COMP-v2.1
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      )}

      {/* Portal Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6" id="customs-settings-panel">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-4">
              <GlassCard className="p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-primary" /> {ui.jointControlsTitle}
                  </h3>
                  <Badge variant="outline" className="text-[10px] font-mono font-medium">{ui.globalParams}</Badge>
                </div>

                <div className="space-y-4">
                  {gateways.map(g => (
                    <div key={g.gatewayId} className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-2xl bg-background/40 gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold font-mono px-1.5 py-0.5 border bg-muted text-foreground rounded text-left" dir="ltr">{g.gatewayId}</span>
                          <span className="text-xs font-bold text-foreground">{g.portName}</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1.5 pt-0.5">
                          <span>Active agents: <strong className="font-mono">{g.activeBrokers}</strong></span>
                          <span>|</span>
                          <span>Valuation factor: <strong className="font-mono">{g.defaultMultiplier}x CIF</strong></span>
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest cursor-pointer select-none" onClick={() => handleToggleStrict(g.gatewayId)}>Strict Mode</label>
                          <button
                            onClick={() => handleToggleStrict(g.gatewayId)}
                            className={cn(
                              "w-9 h-5 rounded-full p-0.5 transition-colors focus:outline-none cursor-pointer",
                              g.strictComplianceMode ? "bg-[#0066FF]" : "bg-slate-200 dark:bg-slate-800"
                            )}
                          >
                            <div className={cn("bg-background w-4 h-4 rounded-full shadow-sm transition-transform", g.strictComplianceMode ? "translate-x-4" : "translate-x-0")} />
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest cursor-pointer select-none" onClick={() => handleToggleFastTrack(g.gatewayId)}>Fast Pass</label>
                          <button
                            onClick={() => handleToggleFastTrack(g.gatewayId)}
                            className={cn(
                              "w-9 h-5 rounded-full p-0.5 transition-colors focus:outline-none cursor-pointer",
                              g.fastTrackEnabled ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-800"
                            )}
                          >
                            <div className={cn("bg-background w-4 h-4 rounded-full shadow-sm transition-transform", g.fastTrackEnabled ? "translate-x-4" : "translate-x-0")} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <Button 
                    onClick={handleSaveAllSettings}
                    disabled={savingSettings}
                    className="text-xs h-9 min-w-[124px] gap-1.5 cursor-pointer bg-[#0066FF] hover:bg-blue-600"
                  >
                    {savingSettings ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                    {savingSettings ? ui.saveBtnUpdating : ui.saveBtn}
                  </Button>
                </div>

                {saveSuccess && (
                  <div className="p-3 text-center text-[10px] font-bold text-emerald-500 bg-emerald-500/10 rounded-xl animate-pulse">
                    {ui.successMsg}
                  </div>
                )}
              </GlassCard>
            </div>

            {/* Quick stats on the right of settings */}
            <div className="lg:col-span-4 space-y-4">
              <GlassCard className="p-6 space-y-3 bg-[#0066FF]/5 border-blue-500/20">
                <blockquote className="text-[10px] uppercase font-bold text-[#0066FF] tracking-widest flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5" /> {ui.enforceRulesTitle}
                </blockquote>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
                  {ui.enforceRulesDesc}
                </p>
              </GlassCard>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
