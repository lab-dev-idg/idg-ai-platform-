import React, { useState, useEffect, useRef } from "react";
import { useSettingsStore } from "@/store/settingsStore";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import {
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Activity,
  Clock,
  Compass,
  Lock,
  Shield,
  Check,
  CheckCircle2,
  FileText,
  Search,
  Award,
  DollarSign,
  Building,
  MapPin,
  Download,
  Printer,
  RefreshCw
} from "lucide-react";

// Massive Localization Dictionary for 100% Kurdish Sorani and Arabic Support
const dict = {
  ku: {
    showcaseTitle: "شۆڕومی سەرکردایەتی نیشتمانی عێراق",
    showcaseSubtitle: "سەکۆی نمایشی فەرمی تاقیکاری ژیری دەستکرد بۆ سەرۆکایەتی حکومەت",
    showcaseLabel: "سەکۆی نمایشی دەوڵەت",
    welcomeTitle: "بەخێربێن بۆ سەکۆی نمایشی فەرمی عێراقی هاوچەرخ",
    welcomeDesc: "ئەم سەکۆیە تایبەت کراوە بۆ بڕیاردەدەرانی باڵا و جێبەجێکاران ڕێگا دەدات تەنها لە ٥ بۆ ١٠ خولەک کاتدا، گشت تواناکانی چاودێری گومرگی، ڕێگرتن لە سپیکردنەوەی پارە، وەڵامدانەوەی خێرای مێشکی نیشتمانی، و ژووری ئۆپەراسیۆن بە تاقیکاری کارا ببینن.",
    startDemoBtn: "دەستپێکردنی نیشاندانی نیشتمانی",
    kpiActiveTxns: "جووڵە چالاکەکان",
    kpiCustomsToday: "ڕێکارە گومرگییەکان",
    kpiCompliance: "ڕێژەی پابەندبوون",
    kpiRiskIndex: "شاخصی مەترسی گشتی",
    kpiAiConfidence: "متمانەی هۆشمەندی",
    kpiSysHealth: "تەندروستی سیستم",
    livePulse: "لە کاتی ڕاستەقینە",
    federalRegistry: "سەکۆی فیدراڵی",
    stableSystem: "سەقامگیر و پارێزراو",
    complianceLevel: "ئاستی جێبەجێکردن",
    analysisReady: "شیکاری هۆشمەند چالاکە",
    runningPerfect: "بە تەواوی کارایە",
    governanceTitle: "کۆنترۆڵکردنی دەوڵەتی مێژوویی",
    governanceDesc: "سیستەمی فەرمی حکومەتی عێراق، کە پارێزراوی تەواوی دارایی و هاوردەکردنی بازاڕەکانی نیشتمانی نیشان دەدات لە ڕوانگەی داتا فەرمییەکانەوە بێ ساختەکاری.",
    customsAssistantTitle: "پشکنینی دۆسیەی ئەمنی گومرگ",
    customsAssistantDesc: "ئۆتۆماتیککردنی مۆڵەتەکان، ناسینەوەی تاریفەی گونجاوی کۆمپیوتەر و کاڵاکان بە کەمتر لە ٣٢ خولەک بە دڵنیایی ژیری دەستکردی سیستەم.",
    antiFraudTitle: "بەرنامەی پێشپێگرتنی گزل و ساختە",
    antiFraudDesc: "داواکارییە پێناسەییە بلۆککراوەکان بە شێوازی یاسایی، پشکنین و بەراوردکردن لەگەڵ ڕێساکان بە لایەنی متمانە و پاراستنی گشتی داهاتەکان.",
    presenterControl: "کۆنترۆڵی پێشکەشکار ژیری دەوڵەت",
    activeScene: "دیمه‌نی چالاک:",
    scenarioStep: "پابەندبوونی هەنگاو:",
    prevBtn: "پێشوو",
    nextBtn: "دواتر",
    pauseBtn: "ڕاگرتن",
    resumeBtn: "خستنەکار",
    restartBtn: "سەرەتا",
    countdownText: "کات بۆ هەنگاوی داهاتوو:",
    secondsUnit: "چرکە",
    remainingEst: "تەواوبوونی گشتی نزیکەی:",
    scenariosHeader: "سیناریۆ دانراوەکانی پێشاندانی فەرمی",
    returnBtn: "گەڕانەوە بۆ چاودێری نیشتمانی",
    scenarioLabel: "سیناریۆ",
    currentSopStep: "مسێرەی جێبەجێکردنی ئۆتۆماتیک",
    problemText: "کێشە",
    aiText: "شیکاری ژیری",
    govText: "وردبینی حکومەت",
    decText: "بڕیار",
    outText: "ئەنجام",
    phaseLabel: "ئۆپەراسیۆنی پێناسەیی:",
    statusSuccess: "تەواوکراوە",
    statusSafe: "هاوتا لەگەڵ دەستور",
    complianceFlares: "ئاگادارکەرەوەکانی هاوکاتی مەترسی",
    printBtn: "چاپکردنی ڕاپۆرت",
    exportPdfBtn: "تەناردنی ڕاپۆرتی PDF",
    snapshotBtn: "تۆمارکردنی گرەنتی",
    importerName: "ناوی هاوردەکار",
    licenseNo: "پێناسی مۆڵەت",
    originTitle: "وڵاتی بنەڕەت",
    cargoValue: "بەهای گشتی بڕواکراو",
    totalQty: "ژمارەی یەکەکان",
    hsCodeLabel: "کۆدی HS گومرگی",
    confidenceTitle: "نمرەی متمانە",
    alternativeHs: "کۆدە جێگرەوەکانی تاریفە",
    legalNotes: "تێبینییە یاساییە فەرمییەکان",
    tariffSimTitle: "هاوشێوەکەری خۆکاری باج و گومرگ",
    customsDutyFee: "ڕێژەی گومرگی بنەڕەتی (%)",
    vatFee: "باجی سەر داهاتی زیادکراو (%)",
    luxuryFee: "باجی کاڵای گرانبەها (%)",
    fedFee: "ڕسومات و باجی فیدراڵی (%)",
    calculatedTotal: "کۆی باجی گومرگی و ڕسومات",
    riskRating: "هەڵسەنگاندنی ئاستی مەترسی",
    requiredDocs: "بەڵگەنامە پێویستەکان بۆ هاوردەکردن",
    shippingRoute: "ڕێڕەوی گواستنەوە و چاودێری جوگرافی",
    etaTitle: "خەمڵاندنی گەیشتن",
    executiveClearanceReport: "ڕاپۆرتی کۆتایی مۆر و پشتڕاستکردنەوە پێوانەیی",
    riskScore: "شاخصی مەترسی کاڵا",
    clearanceStatus: "بڕیاری مەودای گومرگ",
    cargoType: "جۆری کاڵا",
    amlCaseTitle: "وردبینی گرێبەست و پێشپێگرتنی سپیکردنەوەی دراو",
    invoiceVal: "بەهای فاکتۆری هاوردەکەر",
    marketVal: "بەهای ڕاستەقینی بازاڕی جیهانی",
    varianceLabel: "ڕێژەی جیاوازی و توندبوونی نرخ",
    bankingRoute: "ڕێڕەوی بانکی گواستنەوە",
    complianceReview: "پشکنینی پێشێلکاری و یاساکان",
    amlScreening: "پشکنینی گشتی AML",
    sanctionsCheck: "پشکنینی لیستەکانی سزا",
    regulatoryReview: "بەراوردکردن لەگەڵ ڕێساکان",
    timelineLabel: "هەنگاوەکانی پێشکەوتن و نیشاندانی ڕاستەقینەی لێکۆڵینەوە",
    decisionLabel: "بڕیاری کۆتایی دەوڵەتی بێ هاوتا",
    statusBlocked: "بلۆککردنی نیشتمانی",
    statusApproved: "پەسەندکردنی فەرمی",
    legalJustification: "بنەمای یاسایی و هۆکاری بڕیارەکە",
    knowledgeBrainTitle: "مێشکی نیشتمانی بۆ گەڕان و بەڵگەنامە فەرمییەکان",
    askQuestionPlaceholder: "پرسیارە یاسایی یان گومرگییەکەت لێرە بنووسە...",
    suggestedQuestions: "پرسیارە پێشنیارکراوەکانی بڕیارەدەران",
    aiReasoningArea: "میکانیزمی لێکدانەوەی ژیری دەستکردی سیستەم",
    sourcesTitle: "سەرچاوە فەرمییە دەرهێنراوەکان",
    confidenceVisualization: "ئاستی دڵنیایی سەرچاوەکان",
    memorandumReport: "ڕاپۆرت و بژاردەی باڵای سەروەری",
    commandCenterTitle: "ژووری فەرماندەیی باڵای بازرگانی و ئۆپەراسیۆنەکان",
    alertSeverity: "ئاستی ئاگادارکردنەوە",
    readinessScore: "نمرەی گشتی ئامادەکەیی دەوڵەت",
    systemReadinessBreakdown: "کۆی فلتەری سیستم و دابەشبوونی نمرەکان",
    cyberRisk: "ئاسایشی ئەلیکترۆنی",
    financialRisk: "مەترسی دارایی",
    complianceRisk: "مەترسی پابەندبوون",
    borderRisk: "ئاسایشی منافذ و سنوورەکان",
    activeAlertsTitle: "ئاگادارکەرەوە فەرمییەکانی مابەینی کارەکان",
    incidentsTitle: "ڕووداوە جیاوازەکان",
    searchDocs: "گەڕان لە گشت تۆمارەکان",
    statusLive: "ڕاستەوخۆ چالاکە",
    authorityTitle: "دەسەڵاتی دەرکەر",
    pubDate: "ڕێکەوتی بڵاوکردنەوە",
    trustScore: "ئاستی متمانەی گشتی سەرچاوە",
    toastSaved: "گرەنتی و وێنەی دۆسیەکە بە سەرکەوتوویی لە مێژووی سیستەمدا تۆمارکرا کاتی ڕاستەقینە.",
    toastPdf: "فۆرمات و ڕاپۆرتەکە وەک نووسراوێکی فەرمی ئامادەکرا و داگیرا.",
    toastPrint: "بەناردنی فەرمان بۆ چاپکەری حکومی نیشتمانی ئەنجامدرا.",
    hybridQuestion: "ئایا ئۆتۆمبێلی هایبرید لە باجی گومرگی دەبەخشرێت؟",
    medicalQuestion: "چ بەڵگەنامەیەک پێویستە بۆ هاوردەکردنی ئامێرە پزیشکییەکان؟",
    auditQuestion: "سەرپێچی دیاریکردنی نرخ چۆن لێکۆڵینەوەی تێدا دەکرێت؟",
    selectedText: "دیاریکراو",
    allAlerts: "گشت ئاگادارکەرەوەکان",
    criticalAlerts: "مەترسیدارەکان",
    warningAlerts: "ئاگادارییەکان",
    infoAlerts: "زانیارییەکان",
    routeStep1: "ئەنقەرە، تورکیا - ڕێڕەوی گشتی",
    routeStep2: "مەرزی ئیبراهیم خەلیل - پشکنینی فیزیایی",
    routeStep3: "بەغداد - کۆگای سەرەکی دابەشکردن",
    overvalAnalysis: "پشکنینی بەهای هاوردەکردنی کاناوازەکان نیشان دەدات تەماحی سپیکردنەوەی دراوی بیانی هەیە بە فاکتۆری زیاتر لە ٢٨٠٪ی نرخی ڕاستەقینە."
  },
  ar: {
    showcaseTitle: "مجمع العرض والقيادة الوطني العراقي",
    showcaseSubtitle: "حزمة العرض والتحاكي الوطني الموجهة للمجلس والمستوى الحكومي",
    showcaseLabel: "المنتدى الوطني لعرض الأنظمة",
    welcomeTitle: "مرحباً بكم في منصة العرض والتشغيل السيادي لجمهورية العراق",
    welcomeDesc: "تم تصميم هذا المعرض المبرمج خصيصاً لأصحاب القرار والوزراء لإظهار القيمة التشغيلية اللحظية خلال ٥ إلى ١٠ دقائق، بدءاً من أتمتة الجمارك، ومكافحة غسيل الأموال، والاستعلام التشريعي الذكي، وحتى شاشات المراقبة الكبرى لسلامة المنافذ.",
    startDemoBtn: "بدء العرض والتشغيل الوطني",
    kpiActiveTxns: "الصفقات النشطة اليوم",
    kpiCustomsToday: "البيانات المنجزة اليوم",
    kpiCompliance: "نسبة الامتثال الكلية",
    kpiRiskIndex: "مؤشر المخاطر للمنافذ",
    kpiAiConfidence: "ثقة النموذج الذكي الموحد",
    kpiSysHealth: "سلامة وجودة نواة النظام",
    livePulse: "بث حي ومباشر",
    federalRegistry: "بوابات الهيئة",
    stableSystem: "حدود نظامية آمنة",
    complianceLevel: "حوكمة نزيهة",
    analysisReady: "معالجة فورية سيادية",
    runningPerfect: "تشغيل آمن كامل",
    governanceTitle: "التكامل والسيطرة السيادية",
    governanceDesc: "أنظمة تدقيقية ومراقبة جغرافية ومعرفية تقدم لصانع القرار رؤية موحدة تدعم صياغة سياسات التعرفة وحفظ الائتمان العراقي الفيدرالي.",
    customsAssistantTitle: "محركات الذكاء المعزز للجمارك",
    customsAssistantDesc: "ترميز وفلترة الأوراق والتحليل التلقائي بتقدير متميز للـ HS Code والرسوم وتحديد الشحنات المتقاطعة جغرافياً في ثوان معدودة.",
    antiFraudTitle: "تأمين تدفق رأس المال الفيدرالي",
    antiFraudDesc: "منع الانحرافات والتحويلات المالية المبالغ في تقييمها والتهرب تماشياً مع بنود المفتش التشريعي وقانون البنك المركزي العراقي.",
    presenterControl: "لوحة تحكم العرض والتقديم السيادي",
    activeScene: "المشهد الحالي والمرحلة:",
    scenarioStep: "إتمام خطوات السيناريو:",
    prevBtn: "السابق",
    nextBtn: "التالي",
    pauseBtn: "إيقاف مؤقت",
    resumeBtn: "استمر",
    restartBtn: "البدء من جديد",
    countdownText: "الوقت المتبقي للخطوة:",
    secondsUnit: "ثانية",
    remainingEst: "الوقت المقدر لإنهاء العرض:",
    scenariosHeader: "قائمة سيناريوهات العرض والتحاكي المبرمجة",
    returnBtn: "الخروج والعودة للقناة الرئيسية",
    scenarioLabel: "سيناريو",
    currentSopStep: "مسير الأتمتة المبرمج (SOP)",
    problemText: "المشكلة",
    aiText: "التحليل الذكي",
    govText: "التدقيق الحكومي",
    decText: "القرار السيادي",
    outText: "النتيجة النهائية",
    phaseLabel: "المرحلة التشغيلية:",
    statusSuccess: "مطابق بالكامل",
    statusSafe: "معايير النظم",
    complianceFlares: "مؤشرات الموثوقية العامة",
    printBtn: "طباعة التقرير الحكومي",
    exportPdfBtn: "تصدير التقرير الفيدرالي PDF",
    snapshotBtn: "حفظ لقطة الضمان السيادي",
    importerName: "اسم الشركة المستوردة",
    licenseNo: "رقم الترخيص التجاري",
    originTitle: "بلد المنشأ المعتمد",
    cargoValue: "القيمة الكلية للبيان الجمركي",
    totalQty: "إجمالي عدد الوحدات",
    hsCodeLabel: "رمز التعريفة الجمركية HS Code",
    confidenceTitle: "مستوى ثقة النظام",
    alternativeHs: "رموز التعريفة البديلة المقترحة",
    legalNotes: "الأسانيد والملاحظات القانونية المرفقة",
    tariffSimTitle: "محاكي احتساب الرسوم والضرائب التفاعلي",
    customsDutyFee: "نسبة الرسوم الجمركية الأساسية (%)",
    vatFee: "نسبة ضريبة القيمة المضافة (%)",
    luxuryFee: "نسبة ضريبة السلع الثمينة والترفيهية (%)",
    fedFee: "الرسوم الفيدرالية والمصاريف الإدارية (%)",
    calculatedTotal: "إجمالي الرسوم المستحقة للتحصيل",
    riskRating: "تصنيف وتحليل المخاطر الميدانية",
    requiredDocs: "الوثائق الإلزامية المطلوبة لمعادلة الشحنة",
    shippingRoute: "خط المسار الملاحي والتتبع الميداني",
    etaTitle: "موعد الوصول التقديري للمنفذ",
    executiveClearanceReport: "وثيقة براءة الذمة الجمركية الفيدرالية المعتمدة",
    riskScore: "مؤشر خطورة البيان",
    clearanceStatus: "حالة الموافقة الرسمية",
    cargoType: "تصنيف البضائع والسلع",
    amlCaseTitle: "التدقيق على مكافحة غسيل الأموال وتحويل الأموال الكبرى",
    invoiceVal: "القيمة المصرح عنها في الفاتورة",
    marketVal: "القيمة السائدة في الأسواق العالمية",
    varianceLabel: "نسبة الانحراف وتضخم القيمة المكتشف",
    bankingRoute: "الخطوط المصرفية وحسابات التحويل المالي",
    complianceReview: "سجل التدقيق الأمني ومطابقة النظم",
    amlScreening: "فحص مؤشرات الاشتباه بغسيل الأموال AML",
    sanctionsCheck: "البحث التلقائي في قوائم العقوبات الدولية",
    regulatoryReview: "مطابقة لوائح وقوانين البنك المركزي",
    timelineLabel: "الجدول الزمني ومسار تحقيق القضية الفيدرالية",
    decisionLabel: "التوجيه النهائي المباشر لصانع القرار",
    statusBlocked: "حظر التحويل وإيقاف المعاملة",
    statusApproved: "الموافقة الرسمية والإفراج المالي",
    legalJustification: "السند التشريعي المعتمد لقرار اللائحة",
    knowledgeBrainTitle: "قاعدة المعرفة السيادية والقرارات الحكومية",
    askQuestionPlaceholder: "اكتب سؤالك التشريعي أو الجمركي هنا...",
    suggestedQuestions: "الاستفسارات والأبحاث القانونية الشائعة للمسؤولين",
    aiReasoningArea: "سلسلة تفكير واستخلاص العقل المعرفي الذكي",
    sourcesTitle: "الوثائق والأسانيد المستخلصة تلقائياً",
    confidenceVisualization: "مستوى موثوقية المستندات المرفقة",
    memorandumReport: "وثيقة القرار الإرشادي الموجهة للأمانة العامة",
    commandCenterTitle: "مركز العمليات الوطني والتحليلات الجمركية الكبرى",
    alertSeverity: "توزيع الإنذارات ومستويات الخطورة",
    readinessScore: "الجهوزية التشغيلية الإجمالية للمنافذ",
    systemReadinessBreakdown: "تقسيم معايير الكفاءة والاستقرار الهيكلي",
    cyberRisk: "الأمن السيبراني",
    financialRisk: "المخاطر المالية",
    complianceRisk: "مخاطر الامتثال",
    borderRisk: "أمن المنافذ والحدود",
    activeAlertsTitle: "جدول الإنذارات اللحظية النشطة للمنافذ الفيدرالية",
    incidentsTitle: "إجمالي الحوادث والنزاعات المسجلة",
    searchDocs: "البحث في الأرشيف والبيانات الكبرى",
    statusLive: "مسترسل ونشط الآن",
    authorityTitle: "الجهة المانحة والمصدرة",
    pubDate: "تاريخ النشر في الجريدة",
    trustScore: "معدل ثقة المرجع المكتوب",
    toastSaved: "تم حفظ الشحنة وسجل البيانات الملحقة بنجاح في نظام الضمان السيادي المؤمّن.",
    toastPdf: "تم توليد وتنزيل وثيقة التقرير الفيدرالي الشامل بصيغة المقاصة بصيغة PDF.",
    toastPrint: "تم إرسال أمر الطباعة المباشر إلى خادم المطبوعات الحكومي المعتمد.",
    hybridQuestion: "هل تعفى المركبات ذات المحرك الهجين من الرسوم الجمركية والضرائب؟",
    medicalQuestion: "ما هي الوثائق الإلزامية المطلوبة قانوناً لاستيراد الشحنات والمعدات الطبية؟",
    auditQuestion: "كيف يتم الفحص والتحقيق التلقائي في حالات التلاعب وتضخم أسعار السلع؟",
    selectedText: "محدد",
    allAlerts: "كافة التنبيهات",
    criticalAlerts: "الحرجة والخطيرة",
    warningAlerts: "التحذيرية",
    infoAlerts: "الإعلامية والنظامية",
    routeStep1: "أنقرة، تركيا - نقطة الانطلاق الأساسية",
    routeStep2: "منفذ إبراهيم الخليل - التدقيق والجمارك",
    routeStep3: "بغداد - المستودع اللوجستي ومحطة التوزيع",
    overvalAnalysis: "يكشف النموذج الذكي عن تضخم غير مبرر ومحاولات تهريب نقد أجنبي متستر بفواتير تزيد تكلفتها بنسبة ٢٨٠٪ عن حدود السوق العالمي الموثق."
  }
};

// Realistic Immutable Mock Datasets for all 4 Scenarios
const initCustomsData = {
  importer: "Al-Mansoori Tech Ltd (المستورد: المنصوري للأنظمة التقنية)",
  license: "IRQ-LIC-985A-2026",
  origin: "Turkey (المنشأ: تركيا)",
  cargo: "NextGen Tech Hydro-Laptops & Electronic Devices",
  qty: "2,500 units",
  initialValue: 750000,
  hsCode: "8471.30.00",
  confidence: "98.4%",
  aiReasoningKu: "پۆلێنکردن بەپێی بەشی (84) بۆ ئامێرە تەکنەلۆژییەکان و بڕگەی گواستنەوەی زانیاری خودکار. گونجاوە لەگەڵ ڕێسا نوێیەکانی گەشەی زانیاری دەوڵەت.",
  aiReasoningAr: "تصنيف السلعة يندرج تحت الفصل (84) الخاص بالآلات والمعدات المخصصة لمعالجة المعلومات آلياً وبطريقة محمولة، ومطابق للوائح الضريبية العامة المعاصرة.",
  alternatives: [
    { code: "8471.41.00", descKu: "ئامێرە گشتییەکان", descAr: "أنظمة المعالجة الرقمية الأخرى" },
    { code: "8517.13.00", descKu: "مۆبایل و گواستنەوە", descAr: "أجهزة الاتصال اللاسلكية والذكية" }
  ],
  legalNotesKu: "مادەی ١٣ی ڕێسای گشتی گومرگ بۆ ساڵی ٢٠٢٤. ڕێژەی تاریفەی لە سەرەتاوە %٥ پێشنیار کراوە بێ سەرپێچی.",
  legalNotesAr: "أحكام المادة ١٣ من النظام الجمركي العام لسنة ٢٠٢٤. النخبة الاستيرادية تتطلب تطبيق تعرفة حمائية موحدة بنسبة 5٪ لعدم وجود بديل صناعي محلي.",
  defaultFees: {
    customs: 5,
    vat: 10,
    luxury: 0,
    federal: 2
  },
  docs: [
    { id: "cm_inv", nameKu: "فاکتۆری بازرگانی باوەڕپێکراو", nameAr: "الفاتورة التجارية المصادق عليها", ok: true },
    { id: "cm_co", nameKu: "بڕوانامەی بنەڕەتی فەرمی", nameAr: "شهادة المنشأ الرسمية", ok: true },
    { id: "cm_bl", nameKu: "مۆڵەتی بارنامە و ڕێڕەو", nameAr: "بوليصة الشحن معتمدة", ok: true },
    { id: "cm_tele", nameKu: "پەسەندکراوی دەستەی گەیاندن CMC", nameAr: "موافقة هيئة الإعلام والاتصالات (CMC)", ok: true }
  ]
};

const complianceCaseData = {
  compImporter: "Al-Junoob Builders Co. // الجنوب للمقاولات العامة",
  invoiceVal: 1200000,
  marketVal: 420000,
  difference: 780000,
  variancePct: "185.7%",
  country: "United Arab Emirates / الإمارات العربية المتحدة",
  bankingRoute: "TBI Baghdad -> Rafidain -> Dubai Trade Bank",
  amlStatusKu: "گوماناوی توند - مەترسی دابەشکردنی پارەی ساختە وجودی هەیە لە فاکتۆرەکەدا.",
  amlStatusAr: "اشتباه مرتفع - انحراف كبير غير مبرر يحمل مؤشرات غسيل أموال وتهريب رأس مال.",
  sanctionsScoreKu: "تەواو پاکە (هیچ ناوێک لە لیستەکانی سزا نیشتیمانی و نێودەوڵەتییەکاندا نییە)",
  sanctionsScoreAr: "سليم (لا توجد أي تقاطعات مع قوائم الحظر الفيدرالية أو الأمنية الدولية)",
  legalBasisKu: "مادەی (٥٦) یاسای فەرمی بانکی ناوەندی عێراق مەودای لێکۆڵینەوە لە توندبوون و جیاوازی نرخەکان.",
  legalBasisAr: "نص المادة القانونية (٥٦) من قانون البنك المركزي للتحقق من عدالة تسعير القروض والاعتمادات الخارجية ومنع المضاربات.",
  stages: [
    { id: 1, labelKu: "پێشکەشکردنی بەیاننامە بەغداد", labelAr: "تقديم مستندات التحويل المالي" },
    { id: 2, labelKu: "شیکاری خۆکاری بەها لە بازاڕ", labelAr: "المقارنة الرياضية الذكية بالأسعار" },
    { id: 3, labelKu: "دەستنیشانکردنی پێشێلکاری توند", labelAr: "رصد وتحديد مؤشرات الاشتباه" },
    { id: 4, labelKu: "وردبینی یاسایی لیژنەی دارایی", labelAr: "التكييف القانوني من الامتثال" },
    { id: 5, labelKu: "بڕیاری کۆتایی مێردە فیدراڵەکان", labelAr: "التوجيه النهائي بإيقاف الإجراء" }
  ]
};

const knowledgeBrainQAs = [
  {
    questionKey: "hybridQuestion",
    answerKu: "بەڵێ، بەپێی بڕیاری ژمارە (١٢)ی ئەنجوومەنی وەزیران بۆ ساڵی ٢٠٢٥، ئۆتۆمبێلی هایبرید کە بەستراوە بە سیستەمی دۆستی ژینگە، بە ڕێژەی %٥٠ لە تەمامی باجی گومرگی و باجی سەر دراو دەبەخشرێت بەمەرجێک فاکتۆری فەرمی و تاقیکاری CMC هاوپێچ بکرێت.",
    answerAr: "نعم، بموجب قرار مجلس الوزراء الفيدرالي رقم ١٢ لعام ٢٠٢٥، تُعفى المركبات ذات المحرك الهجين الصديقة للبيئة بنسبة ٥٠٪ من الرسوم الجمركية والضرائب المقررة لتشجيع الطاقة المتجددة، شريطة إرفاق شهادة الفحص والمطابقة الرسمية.",
    confidence: "Very High (زۆر بەرز)",
    confidenceVal: 98,
    citations: [
      { source: "الجريدة الرسمية (الوقائع العراقية)", authority: "الأمانة العامة لمجلس الوزراء", date: "2025-01-10", trust: "100%" },
      { source: "قانون التعرفة الجمركية المحدث", authority: "الهيئة العامة للجمارك العراقية", date: "2025-02-15", trust: "98%" }
    ]
  },
  {
    questionKey: "medicalQuestion",
    answerKu: "هاوردەکردنی ئامێرە پزیشکییەکان پێویستی بە مۆڵەتی وەزارەتی تەندروستی (کیمادیا) هەیە، لەگەڵ بڕوانامەی کوالیتی ISO جیهانی لەگەڵ مانیفێستی فەرمی مۆرکراو، بەبێ ئەم بەڵگانە هیچ جۆرە هاوردەکردنێک ڕێگەی پێنادریت.",
    answerAr: "استيراد الأجهزة والمعدات الطبية يتطلب موافقة فنية مسبقة وإلزامية من وزارة الصحة (الشركة العامة لتسويق الأدوية كيماديا)، مصحوبة بشهادة مطابقة بلد المنشأ ISO وشهادة تسجيل المصنع المعتمدة.",
    confidence: "High (بەرز)",
    confidenceVal: 95,
    citations: [
      { source: "تعليمات وزارة الصحة العراقية م/٤٤", authority: "دائرة الأمور الفنية - كيماديا", date: "2024-08-20", trust: "95%" },
      { source: "دليل المستورد الوطني الموحد", authority: "وزارة التجارة العراقية", date: "2025-03-01", trust: "94%" }
    ]
  },
  {
    questionKey: "auditQuestion",
    answerKu: "پێشێلکردنی نرخ بە بەراوردکردنی تێچووی هاوردەکراو لەگەڵ پێڕستی سەرانسەری جیهانی دابین دەکرێت. ژیری دەستکردی سیستەمەکە هەڵدەسێت بە پێوانەکردنی ناوخۆیی و بازاڕەکانی دەوروبەر تا ڕێگری بکات لە بەرزکردنەوەی ناڕاستی فاکتۆرەکان.",
    answerAr: "يتم فحص التلاعب بالأسعار عبر مطابقة القيمة المصرح عنها تلقائياً مع السعر المرجعي العالمي اللحظي والبيانات التاريخية لكل المنافذ. يقوم محركنا الذكي بوضع إشارات الخطر للأوراق عند تجاوز فارق السعر المسموح به (±١٥٪).",
    confidence: "High (بەرز)",
    confidenceVal: 92,
    citations: [
      { source: "ضوابط التدقيق اللاحق وتعليمات الجمارك", authority: "الهيئة العامة للجمارك - التدقيق", date: "2024-11-12", trust: "92%" },
      { source: "پێوەری دیاریکردنی داهاتی فەدلاین", authority: "البنك المركزي العراقي", date: "2025-01-22", trust: "90%" }
    ]
  }
];

export function GovernmentShowcase() {
  const { lang } = useSettingsStore();
  const t = dict[lang] || dict.ku;

  // General Presenter & Showcase Setup
  const [activeScenarioIdx, setActiveScenarioIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [autoMode, setAutoMode] = useState<boolean>(true);
  const [countdown, setCountdown] = useState<number>(5);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Scenario 1 State
  const [s1Step, setS1Step] = useState<number>(1); // 1 to 7
  const [tariffCustoms, setTariffCustoms] = useState<number>(initCustomsData.defaultFees.customs);
  const [tariffVat, setTariffVat] = useState<number>(initCustomsData.defaultFees.vat);
  const [tariffLuxury, setTariffLuxury] = useState<number>(initCustomsData.defaultFees.luxury);
  const [tariffFed, setTariffFed] = useState<number>(initCustomsData.defaultFees.federal);

  // Calculations for Scenario 1
  const s1BaseVal = initCustomsData.initialValue;
  const calculatedCustomsDuty = (s1BaseVal * tariffCustoms) / 100;
  const calculatedVat = (s1BaseVal * tariffVat) / 100;
  const calculatedLuxury = (s1BaseVal * tariffLuxury) / 100;
  const calculatedFed = (s1BaseVal * tariffFed) / 100;
  const s1TotalTax = calculatedCustomsDuty + calculatedVat + calculatedLuxury + calculatedFed;

  // Scenario 2 State
  const [amlDecision, setAmlDecision] = useState<"BLOCKED" | "APPROVED" | null>(null);

  // Scenario 3 State
  const [activeQuestionIdx, setActiveQuestionIdx] = useState<number>(0);
  const [customQuestion, setCustomQuestion] = useState<string>("");
  const [isSearchingBrain, setIsSearchingBrain] = useState<boolean>(false);
  const [searchedAnswer, setSearchedAnswer] = useState<{ku: string; ar: string; confidence: string; citations: any[]} | null>(null);

  // Scenario 4 State
  const [threatLevelS4, setThreatLevelS4] = useState<"NORMAL" | "HIGH" | "CRITICAL">("NORMAL");
  const [activeAlertFilter, setActiveAlertFilter] = useState<"ALL" | "CRITICAL" | "WARNING" | "INFO">("ALL");

  // Notifications simulated array
  const mockAlerts = [
    { id: 1, type: "CRITICAL", textKu: "مەترسی ساختەکاری هاوردە - مەرزی پەروێزخان", textAr: "رصد مؤشر تضخم مالي خطير - منفذ پرویزخان", time: "٠١:٢٨" },
    { id: 2, type: "WARNING", textKu: "تاقیکردنەوەی باری مەلەوی دواکەوتووە - بەندەری ئوم قەسڕ", textAr: "تأخر لجان الكشف الكيميائي - ميناء أم قصر", time: "٠١:١٥" },
    { id: 3, type: "INFO", textKu: "تەواوبوونی نوێکردنەوەی لیستەکانی گومرگ ٨٤٧١", textAr: "مزامنة تلقائية ناجحة للرموز الجمركية للفصل 85", time: "٠١:٠٠" }
  ];

  // System Readiness metrics S4
  const s4SecurityScore = threatLevelS4 === "NORMAL" ? 98 : threatLevelS4 === "HIGH" ? 94 : 85;
  const s4PerformanceValue = 99.2;
  const s4CompliancePct = threatLevelS4 === "NORMAL" ? 97.4 : threatLevelS4 === "HIGH" ? 92.1 : 88.3;
  const s4ReliabilityPct = 100;
  const s4AiAccuracy = 98.4;
  const s4OverallScore = Math.round((s4SecurityScore + s4PerformanceValue + s4CompliancePct + s4ReliabilityPct + s4AiAccuracy) / 5);

  const [toasts, setToasts] = useState<string[]>([]);
  const triggerToast = (msg: string) => {
    setToasts((prev) => [...prev, msg]);
    setTimeout(() => {
      setToasts((prev) => prev.slice(1));
    }, 4500);
  };

  // Chronometer automated presentation advance
  useEffect(() => {
    if (isPlaying && hasStarted && autoMode) {
      setCountdown(5);
      timerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            handleAutoAdvance();
            return 5;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, hasStarted, autoMode, activeScenarioIdx, s1Step]);

  const handleAutoAdvance = () => {
    // If Scenario 1, we must advance the steps first before advancing first scenario
    if (activeScenarioIdx === 0) {
      if (s1Step < 7) {
        setS1Step((prev) => prev + 1);
      } else {
        // Move to scenario 2
        setActiveScenarioIdx(1);
        setS1Step(1);
      }
    } else if (activeScenarioIdx === 1) {
      // Advance to Scenario 3
      setActiveScenarioIdx(2);
    } else if (activeScenarioIdx === 2) {
      // Advance to Scenario 4
      setActiveScenarioIdx(3);
    } else {
      // Wrap around scenarios
      setActiveScenarioIdx(0);
      setS1Step(1);
    }
  };

  const handleManualNext = () => {
    if (activeScenarioIdx === 0) {
      if (s1Step < 7) {
        setS1Step((prev) => prev + 1);
      } else {
        setActiveScenarioIdx(1);
        setS1Step(1);
      }
    } else if (activeScenarioIdx === 1) {
      setActiveScenarioIdx(2);
    } else if (activeScenarioIdx === 2) {
      setActiveScenarioIdx(3);
    } else {
      setActiveScenarioIdx(0);
      setS1Step(1);
    }
    setCountdown(5);
  };

  const handleManualPrev = () => {
    if (activeScenarioIdx === 0) {
      if (s1Step > 1) {
        setS1Step((prev) => prev - 1);
      } else {
        // stay at 1
      }
    } else if (activeScenarioIdx === 1) {
      setActiveScenarioIdx(0);
      setS1Step(7);
    } else if (activeScenarioIdx === 2) {
      setActiveScenarioIdx(1);
    } else {
      setActiveScenarioIdx(2);
    }
    setCountdown(5);
  };

  const handleSearchBrain = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuestion.trim()) return;
    setIsSearchingBrain(true);
    setSearchedAnswer(null);

    setTimeout(() => {
      setIsSearchingBrain(false);
      setSearchedAnswer({
        ku: `ئەنجامی پرسیارەکە بە تیکڕایی بۆ هاوردەکردن: بەپێی یاساکانی ساڵی ٢٠٢٥، بەڵگەی پێویست پشتڕاست دەکرێت لەگەڵ وردبینی ژیری دەستکردی نیشتیمانی بۆ چەمکی: "${customQuestion}". مەرجە مۆڵەتی وەزارەت و فاکتۆری فەرمی هاوپێچ بکرێت بە سەرکەوتوویی.`,
        ar: `نتيجة الاستفسار والتحقق التشريعي حول الفاتورة لطلبكم: تماشياً مع قواعد الحوكمة لسنة ٢٠٢٥، يتم تقييم الطلب المتعلق بـ: "${customQuestion}". يجب إرفاق الوثائق الرسمية وشهادة CMC المعتمدة للتخليص الموحد.`,
        confidence: "Very High (٩٨٪)",
        citations: [
          { source: "الجريدة الرسمية (الوقائع العراقية)", authority: "الأمانة العامة لمواكبة القوانين", date: "2025-04-01", trust: "98%" }
        ]
      });
    }, 1200);
  };

  return (
    <div className="w-full h-full flex flex-col gap-6 font-sans text-slate-900 pb-20 select-text bg-[#030712] rounded-[32px] p-6 text-right" dir={lang === "ku" ? "rtl" : "rtl"}>
      
      {/* Toast Alert Simulator Notifications Display */}
      <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none">
        {toasts.map((toastMsg, tIdx) => (
          <div key={tIdx} className="bg-[#0066FF] text-white p-4 rounded-xl shadow-2xl border border-blue-400/20 text-xs font-bold leading-relaxed flex items-center gap-3 animate-slide-up pointer-events-auto">
            <Check className="w-5 h-5 bg-white/20 p-0.5 rounded-full shrink-0" />
            <span>{toastMsg}</span>
          </div>
        ))}
      </div>

      {/* 1. Sovereign Header Landing & Platform Overview */}
      {!hasStarted ? (
        <div className="bg-gradient-to-br from-[#071739] via-slate-950 to-slate-900 text-white rounded-[32px] p-6 md:p-10 border border-white/10 shadow-xl flex flex-col gap-8 relative overflow-hidden">
          
          <div className="absolute right-0 top-0 w-96 h-96 bg-[#0066FF]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute left-0 bottom-0 w-80 h-80 bg-violet-600/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10 border-b border-white/10 pb-6">
            <div className="space-y-3">
              <Badge className="bg-[#0066FF] hover:bg-[#0066FF] text-white px-3.5 py-1 text-[11px] font-bold rounded-xl tracking-wider uppercase select-none font-sans">
                🛡️ {t.showcaseLabel}
              </Badge>
              <h1 className="text-2xl md:text-4xl font-black tracking-tight leading-tight text-white">
                {t.showcaseTitle}
              </h1>
              <p className="text-sm text-slate-350 max-w-3xl leading-relaxed font-sans">
                {t.welcomeDesc}
              </p>
            </div>

            <Button
              onClick={() => {
                setHasStarted(true);
                setIsPlaying(true);
                setActiveScenarioIdx(0);
                setS1Step(1);
              }}
              className="bg-[#0066FF] hover:bg-blue-600 text-white font-black text-sm px-8 py-7 rounded-2xl flex items-center gap-2.5 shadow-lg shadow-blue-500/20 shrink-0 transition cursor-pointer self-start md:self-auto border border-blue-400/30"
            >
              <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
              <span>{t.startDemoBtn}</span>
            </Button>
          </div>

          {/* National Live KPI Dashboard Wall */}
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 relative z-10 font-sans">
            {[
              { label: t.kpiActiveTxns, val: "٤،٢٨٠", sub: t.livePulse, color: "text-blue-400" },
              { label: t.kpiCustomsToday, val: "٢،١٥٠", sub: t.federalRegistry, color: "text-emerald-400" },
              { label: t.kpiRiskIndex, val: "%١٤", sub: t.stableSystem, color: "text-green-400" },
              { label: t.kpiCompliance, val: "%٩٧.٤", sub: t.complianceLevel, color: "text-teal-400" },
              { label: t.kpiAiConfidence, val: "%٩٨.٢", sub: t.analysisReady, color: "text-violet-400" },
              { label: t.kpiSysHealth, val: "%١٠٠", sub: t.runningPerfect, color: "text-blue-500" }
            ].map((k, idx) => (
              <div key={idx} className="bg-white/5 p-5 rounded-2xl border border-white/10 hover:border-white/20 transition flex flex-col justify-between">
                <span className="text-xs text-slate-350 font-bold block">
                  {k.label}
                </span>
                <span className={`text-2xl md:text-3xl font-black ${k.color} tracking-tight mt-1.5`}>
                  {k.val}
                </span>
                <span className="text-[10px] text-slate-400 mt-2 block font-medium">
                  ✓ {k.sub}
                </span>
              </div>
            ))}
          </div>

          {/* Story Value Blocks */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 pt-4 border-t border-white/10">
            <div className="bg-white/2 p-5 rounded-2xl border border-white/5 space-y-2">
              <h4 className="text-sm font-bold text-blue-400 flex items-center gap-1.5 select-none">
                <Activity className="w-5 h-5" />
                {t.governanceTitle}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {t.governanceDesc}
              </p>
            </div>
            
            <div className="bg-white/2 p-5 rounded-2xl border border-white/5 space-y-2">
              <h4 className="text-sm font-bold text-violet-400 flex items-center gap-1.5 select-none">
                <Sparkles className="w-5 h-5" />
                {t.customsAssistantTitle}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {t.customsAssistantDesc}
              </p>
            </div>

            <div className="bg-white/2 p-5 rounded-2xl border border-white/5 space-y-2">
              <h4 className="text-sm font-bold text-teal-400 flex items-center gap-1.5 select-none">
                <Lock className="w-5 h-5" />
                {t.antiFraudTitle}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {t.antiFraudDesc}
              </p>
            </div>
          </div>
          
        </div>
      ) : (
        /* 2. Interactive Guided Presentation Arena with Scenario Wizard and Presenter Deck */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* LEFT COLUMN: Presenter Command Control Desk (4 grid cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Action Controller Dashboard (Military/Corporate Styling) */}
            <div className="bg-[#071739] text-white p-6 rounded-[24px] border border-white/10 shadow-lg flex flex-col gap-4">
              
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping shrink-0" />
                  <span className="font-sans font-black text-xs uppercase tracking-wider text-slate-200">
                    📡 {t.presenterControl}
                  </span>
                </div>
                <Badge className="bg-[#0066FF] hover:bg-[#0066FF] text-white text-[10px] font-mono px-2 py-0.5">
                  IDG_CORE_DEMO_v2.0
                </Badge>
              </div>

              {/* Progress info of Presentation */}
              <div className="space-y-2.5 bg-white/5 p-4 rounded-xl border border-white/5 font-sans">
                <div className="flex justify-between items-center text-xs text-slate-400 font-bold">
                  <span>{t.activeScene}</span>
                  <span className="text-[#0066FF] font-black">
                    {activeScenarioIdx + 1} / 4
                  </span>
                </div>
                <h4 className="text-sm font-black truncate text-slate-100">
                  {activeScenarioIdx === 0 && `١. ${lang === "ku" ? "کۆمپیوتەر و یەکە تەکنەلۆژییەکان" : "أتمتة الفرز للأجهزة التقنية"}`}
                  {activeScenarioIdx === 1 && `٢. ${lang === "ku" ? "سپیکردنەوەی پارە و دراو" : "مكافحة غسيل الأموال بالتسعير المرجعي"}`}
                  {activeScenarioIdx === 2 && `٣. ${lang === "ku" ? "یاساکان و مێشکی نیشتمانی" : "الاستعلام واستخلاص القوانين"}`}
                  {activeScenarioIdx === 3 && `٤. ${lang === "ku" ? "بنکەی گشتی سەرچاوەکان" : "مركز المراقبة والعمليات الكبرى"}`}
                </h4>

                {activeScenarioIdx === 0 && (
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold">
                      <span>{t.scenarioStep}</span>
                      <span>{s1Step} / 7</span>
                    </div>
                    {/* Horizontal Wizard Bars */}
                    <div className="flex gap-1.5 mt-1.5">
                      {[1, 2, 3, 4, 5, 6, 7].map((s_idx) => (
                        <div
                          key={s_idx}
                          className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                            s_idx === s1Step
                              ? "bg-[#0066FF] w-4"
                              : s_idx < s1Step
                              ? "bg-slate-400"
                              : "bg-white/10"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Precise play/pause next scenario presenter controls */}
              <div className="grid grid-cols-3 gap-2">
                <Button
                  onClick={handleManualPrev}
                  className="bg-white/5 hover:bg-white/10 text-white border border-white/15 text-xs py-2 rounded-xl transition cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4 shrink-0 inline" />
                  <span> {t.prevBtn}</span>
                </Button>

                {isPlaying ? (
                  <Button
                    onClick={() => setIsPlaying(false)}
                    className="bg-amber-500 hover:bg-amber-600 text-white text-xs py-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 font-bold"
                  >
                    <Pause className="w-4 h-4" />
                    <span>{t.pauseBtn}</span>
                  </Button>
                ) : (
                  <Button
                    onClick={() => setIsPlaying(true)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs py-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 font-bold border border-emerald-500/20"
                  >
                    <Play className="w-4 h-4" />
                    <span>{t.resumeBtn}</span>
                  </Button>
                )}

                <Button
                  onClick={handleManualNext}
                  className="bg-white/5 hover:bg-white/10 text-white border border-white/15 text-xs py-2 rounded-xl transition cursor-pointer"
                >
                  <span>{t.nextBtn} </span>
                  <ChevronRight className="w-4 h-4 shrink-0 inline" />
                </Button>
              </div>

              {/* Sub step controller (Prev / Next Step inside active Scenario) */}
              <div className="grid grid-cols-2 gap-2 border-t border-white/10 pt-3">
                <Button
                  onClick={() => {
                    setAutoMode(!autoMode);
                    setIsPlaying(!autoMode);
                  }}
                  className={`text-xs py-2 rounded-lg transition-all border ${
                    autoMode 
                      ? "bg-[#0066FF] text-white border-blue-400/20" 
                      : "bg-white/5 text-slate-300 border-white/10"
                  }`}
                >
                  🔄 {lang === "ku" ? "نمایشی خۆکار" : "التشغيل والتقديم الذاتي"}
                </Button>

                <Button
                  onClick={() => {
                    setActiveScenarioIdx(0);
                    setS1Step(1);
                    setCountdown(5);
                    setIsPlaying(true);
                  }}
                  className="bg-white/5 hover:bg-white/10 text-slate-200 text-xs py-2 rounded-lg transition flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{t.restartBtn}</span>
                </Button>
              </div>

              {/* Auto Presentation Countdown metrics representation */}
              {autoMode && (
                <div className="border-t border-white/10 pt-3 flex items-center justify-between text-xs text-slate-400 font-sans">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-blue-400" />
                    <span>{t.countdownText}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-100">{countdown} {t.secondsUnit}</span>
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                  </div>
                </div>
              )}

              {/* Estimated Remaining Duration and system details */}
              <div className="flex justify-between items-center text-[11px] text-slate-400 pt-1">
                <span>{t.remainingEst}</span>
                <span className="font-bold text-white bg-slate-800 px-2 py-0.5 rounded">
                  {activeScenarioIdx === 0 ? (7 - s1Step + 3) * 5 : (3 - activeScenarioIdx) * 5} {t.secondsUnit}
                </span>
              </div>

            </div>

            {/* Menu of the 4 Demos */}
            <div className="flex flex-col gap-3 font-sans">
              <span className="text-[11px] text-slate-500 uppercase font-black tracking-wider px-2 block select-none">
                {t.scenariosHeader}
              </span>

              {[
                { id: 0, icon: "📋", nameKu: "أ. گومرگ و دۆسیەی هاوردە", nameAr: "أ. الرقابة والفرز للأجهزة التقنية", descKu: "وردبینی مانیفێست بە شێوەیەکی ئۆتۆماتیک", descAr: "أتمتة الجمارك ودراسة فواتير السلعة" },
                { id: 1, icon: "💰", nameKu: "ب. قەدەغەی سپیکردنەوەی پارە", nameAr: "ب. مكافحة غسيل الأموال الفيدرالي", descKu: "فلتەرکردنی نرخ و دۆسیەی هاوردە", descAr: "تقييم عدالة أسعار السلع ومنع الاحتيال" },
                { id: 2, icon: "🧠", nameKu: "ج. مێشکی یاسایی نیشتمانی", nameAr: "ج. مجمع المعرفة والبحث التشريعي", descKu: "شیکاری مۆسیقای یاساکان و دەستوور", descAr: "توافق البيانات مع لوائح البنك المركزي" },
                { id: 3, icon: "📈", nameKu: "د. بنکەی داتای فەرماندەیی", nameAr: "د. مركز العمليات والمراقبة الكبرى", descKu: "کۆی فڵاک و شاخصەکانی وڵات هاوکات", descAr: "لوحة تحليلات الأمن الاقتصادي العراقي" }
              ].map((scen, idx) => {
                const isActiveScen = idx === activeScenarioIdx;
                return (
                  <button
                    key={scen.id}
                    onClick={() => {
                      setActiveScenarioIdx(idx);
                      setS1Step(1);
                      setCountdown(5);
                    }}
                    className={`text-right p-4 rounded-2xl border text-xs font-semibold select-none flex flex-col gap-1 transition-all cursor-pointer ${
                      isActiveScen
                        ? "bg-[#071739] border-[#0066FF] shadow-lg text-white"
                        : "bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800/80"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 w-full">
                      <span className="font-black text-[10px] text-slate-500">
                        {t.scenarioLabel} {idx + 1}
                      </span>
                      {isActiveScen && (
                        <span className="w-2 h-2 rounded-full bg-[#0066FF] animate-pulse" />
                      )}
                    </div>
                    <span className="font-extrabold text-[13px] tracking-tight mt-1 text-slate-100">
                      {scen.icon} {lang === "ku" ? scen.nameKu : scen.nameAr}
                    </span>
                    <span className="text-[10px] text-slate-400 font-sans font-medium line-clamp-1">
                      {lang === "ku" ? scen.descKu : scen.descAr}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Exit Demo button */}
            <Button
              onClick={() => {
                setHasStarted(false);
                setIsPlaying(false);
              }}
              className="bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-800 text-xs py-3.5 rounded-xl cursor-pointer transition flex items-center justify-center gap-1.5 font-bold"
            >
              ⬅️ {t.returnBtn}
            </Button>

          </div>

          {/* RIGHT COLUMN: Interactive Demo Screen (8 grid cols) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Visualizer Frame with Active Interactive Experience */}
            <div className="bg-[#0b1329] rounded-[28px] border border-slate-800 shadow-2xl p-6 md:p-8 flex flex-col justify-between flex-1 relative overflow-hidden h-full max-w-full text-slate-200 font-sans">
              
              <div className="absolute right-0 top-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute left-0 bottom-0 w-60 h-60 bg-violet-500/5 rounded-full blur-xl pointer-events-none" />

              {/* DEMO 1: AI CUSTOMS IMPORT ASSISTANT (COMPLETE VERSION) */}
              {activeScenarioIdx === 0 && (
                <div className="space-y-6">
                  
                  {/* Title Bar with Wizard steps */}
                  <div className="border-b border-slate-800 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] text-[#0066FF] font-black uppercase tracking-wider block">
                        🛡️ DEMO 1 // {lang === "ku" ? "یاریدەدەری هۆشمەندی گومرگ" : "مساعد الجمارك الرقمي بالذكاء الاصطناعي"}
                      </span>
                      <h2 className="text-lg md:text-xl font-black text-slate-100 mt-1">
                        {lang === "ku" ? "وردبینی گشتی و پۆلێنکاری مانیفێست" : "الفرز والتقدير والترميز الذكي التفاعلي"}
                      </h2>
                    </div>

                    <div className="flex flex-wrap gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800 self-start">
                      {[1, 2, 3, 4, 5, 6, 7].map((stepNum) => (
                        <button
                          key={stepNum}
                          onClick={() => setS1Step(stepNum)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                            s1Step === stepNum
                              ? "bg-[#0066FF] text-white shadow-md"
                              : "text-slate-400 hover:text-white"
                          }`}
                        >
                          {stepNum}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Step 1: Importer Information */}
                  {s1Step === 1 && (
                    <div className="space-y-4 animate-fade-in text-right">
                      <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800 space-y-4">
                        <h3 className="text-sm font-bold text-slate-300 border-b border-slate-800 pb-2 flex items-center gap-1.5">
                          <Building className="w-4.5 h-4.5 text-blue-400" />
                          {lang === "ku" ? "زانیاری گشتی هاوردەکار و کۆمپانیا" : "بيانات رخصة وتوثيق المنشأة المستوردة"}
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <span className="text-[10px] text-slate-450 block font-bold">{t.importerName}</span>
                            <input
                              type="text"
                              value={initCustomsData.importer}
                              disabled
                              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 font-sans"
                            />
                          </div>

                          <div className="space-y-1">
                            <span className="text-[10px] text-slate-450 block font-bold">{t.licenseNo}</span>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={initCustomsData.license}
                                disabled
                                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 font-mono"
                              />
                              <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold">✓ {t.statusSuccess}</Badge>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <span className="text-[10px] text-slate-450 block font-bold">{t.originTitle}</span>
                            <input
                              type="text"
                              value={initCustomsData.origin}
                              disabled
                              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 font-sans"
                            />
                          </div>

                          <div className="space-y-1 font-sans">
                            <span className="text-[10px] text-slate-450 block font-bold">{lang === "ku" ? "ئاستی بڕواپێدان کاتی" : "مستوى شهادة الموثوقية السيادية"}</span>
                            <div className="bg-blue-500/10 text-[#0066FF] border border-blue-500/20 text-xs py-2 px-3 rounded-xl font-bold">
                              Gold Status // {lang === "ku" ? "ناوبانگ نایاب" : "الدرجة الممتازة والمسار الأخضر المعتمد"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Cargo Information */}
                  {s1Step === 2 && (
                    <div className="space-y-4 animate-fade-in">
                      <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800 space-y-4">
                        <h3 className="text-sm font-bold text-slate-300 border-b border-slate-800 pb-2 flex items-center gap-1.5">
                          <FileText className="w-4.5 h-4.5 text-blue-400" />
                          {lang === "ku" ? "تایبەتمەندی و زانیاری کاڵا" : "تفصیل وإفصاح محتويات الشحنة والبيان"}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <span className="text-[10px] text-slate-450 block font-bold">{t.cargoType}</span>
                            <input
                              type="text"
                              value={initCustomsData.cargo}
                              disabled
                              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 font-sans"
                            />
                          </div>

                          <div className="space-y-1">
                            <span className="text-[10px] text-slate-450 block font-bold">{t.totalQty}</span>
                            <input
                              type="text"
                              value={initCustomsData.qty}
                              disabled
                              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 font-mono"
                            />
                          </div>

                          <div className="space-y-1">
                            <span className="text-[10px] text-slate-450 block font-bold">{t.cargoValue}</span>
                            <div className="relative">
                              <input
                                type="text"
                                value={`$${initCustomsData.initialValue.toLocaleString()}`}
                                disabled
                                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-350 font-mono font-bold"
                              />
                              <DollarSign className="w-4 h-4 text-slate-550 absolute left-3 top-2.5" />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <span className="text-[10px] text-slate-450 block font-bold">{lang === "ku" ? "مەرزی سەرەکی گەیشتن" : "المنفذ المستهدف للدخول"}</span>
                            <input
                              type="text"
                              value="ZAKHO - IBRAHIM KHALIL (مەرزی ئیبراهیم خەلیل)"
                              disabled
                              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 font-sans"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: AI HS Code Classification */}
                  {s1Step === 3 && (
                    <div className="space-y-4 animate-fade-in text-right">
                      <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800 space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                          <h3 className="text-sm font-bold text-slate-300 flex items-center gap-1.5">
                            <Compass className="w-4.5 h-4.5 text-blue-400" />
                            {lang === "ku" ? "پۆلێنکاری هۆشمەندی کۆدی HS" : "تقييم الذكاء وتعيين كود التعرفة الفيدرالي"}
                          </h3>
                          <Badge className="bg-[#0066FF] text-white text-xs font-black py-1 px-2.5 rounded-lg select-none">
                            {t.confidenceTitle}: {initCustomsData.confidence}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="md:col-span-2 space-y-3 font-sans">
                            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                              <span className="text-[10px] text-slate-450 block font-bold">{t.hsCodeLabel}</span>
                              <span className="text-xl font-black text-[#0066FF] tracking-widest block mt-1">
                                {initCustomsData.hsCode}
                              </span>
                            </div>

                            <div className="p-3.5 bg-blue-500/5 rounded-xl border border-blue-500/10">
                              <span className="text-[10px] text-[#0066FF] block font-bold">🧠 {lang === "ku" ? "لۆژیک و شیکردنەوەی ژیری دەستکرد" : "منطق واستخلاص المعالجة الذاتية"}</span>
                              <p className="text-xs text-slate-300 mt-1 lines-relaxed font-sans leading-relaxed">
                                {lang === "ku" ? initCustomsData.aiReasoningKu : initCustomsData.aiReasoningAr}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-3 font-sans">
                            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
                              <span className="text-[10px] text-slate-450 block font-bold">{t.alternativeHs}</span>
                              <div className="space-y-1.5">
                                {initCustomsData.alternatives.map((alt) => (
                                  <div key={alt.code} className="text-xs border-t border-slate-800/40 pt-1">
                                    <span className="font-mono text-slate-200 font-bold block">{alt.code}</span>
                                    <span className="text-[10px] text-slate-450 block">({lang === "ku" ? alt.descKu : alt.descAr})</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                              <span className="text-[10px] text-slate-450 block font-bold">{t.legalNotes}</span>
                              <span className="text-xs text-slate-300 block mt-1">
                                {lang === "ku" ? initCustomsData.legalNotesKu : initCustomsData.legalNotesAr}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Duty & Tax Calculation */}
                  {s1Step === 4 && (
                    <div className="space-y-4 animate-fade-in text-right">
                      <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800 space-y-4">
                        <h3 className="text-sm font-bold text-slate-300 border-b border-slate-800 pb-2">
                          ⚖️ {t.tariffSimTitle}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4 font-sans text-xs">
                            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-3">
                              <div className="flex justify-between font-bold text-slate-300">
                                <span>{t.customsDutyFee}</span>
                                <span className="text-[#0066FF]">{tariffCustoms}%</span>
                              </div>
                              <input
                                type="range"
                                min="0"
                                max="30"
                                value={tariffCustoms}
                                onChange={(e) => setTariffCustoms(Number(e.target.value))}
                                className="w-full accent-[#0066FF]"
                              />

                              <div className="flex justify-between font-bold text-slate-300">
                                <span>{t.vatFee}</span>
                                <span className="text-[#0066FF]">{tariffVat}%</span>
                              </div>
                              <input
                                type="range"
                                min="0"
                                max="20"
                                value={tariffVat}
                                onChange={(e) => setTariffVat(Number(e.target.value))}
                                className="w-full accent-[#0066FF]"
                              />

                              <div className="flex justify-between font-bold text-slate-300">
                                <span>{t.luxuryFee}</span>
                                <span className="text-[#0066FF]">{tariffLuxury}%</span>
                              </div>
                              <input
                                type="range"
                                min="0"
                                max="50"
                                value={tariffLuxury}
                                onChange={(e) => setTariffLuxury(Number(e.target.value))}
                                className="w-full accent-[#0066FF]"
                              />

                              <div className="flex justify-between font-bold text-slate-300">
                                <span>{t.fedFee}</span>
                                <span className="text-[#0066FF]">{tariffFed}%</span>
                              </div>
                              <input
                                type="range"
                                min="0"
                                max="10"
                                value={tariffFed}
                                onChange={(e) => setTariffFed(Number(e.target.value))}
                                className="w-full accent-[#0066FF]"
                              />
                            </div>
                          </div>

                          {/* Calculations Results Panel */}
                          <div className="bg-slate-950/70 p-5 rounded-xl border border-slate-800 flex flex-col justify-between font-sans">
                            <div className="space-y-2 text-xs text-slate-400">
                              <span className="text-[10px] text-slate-500 block uppercase font-bold">{lang === "ku" ? "شیکردنەوەی دارایی پێگەیشتوو" : "تفصيل الأرصدة والضرائب المحسوبة"}</span>
                              <div className="flex justify-between border-b border-slate-800 pb-1.5 pt-1">
                                <span>{lang === "ku" ? "بەهای کاڵا" : "قيمة السلعة الكلية"}</span>
                                <span className="font-mono text-slate-200">${s1BaseVal.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                                <span>{lang === "ku" ? "باجی گومرگ" : "الرسوم الجمركية"} ({tariffCustoms}%)</span>
                                <span className="font-mono text-slate-200">${calculatedCustomsDuty.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                                <span>{lang === "ku" ? "باجی VAT" : "ضريبة القيمة المضافة"} ({tariffVat}%)</span>
                                <span className="font-mono text-slate-200">${calculatedVat.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                                <span>{lang === "ku" ? "باجی کاڵای گرانبەها" : "ضريبة السلع الفاخرة"} ({tariffLuxury}%)</span>
                                <span className="font-mono text-slate-200">${calculatedLuxury.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                                <span>{lang === "ku" ? "ڕسووماتی فیدراڵی" : "الرسوم الفيدرالية والإدارية"} ({tariffFed}%)</span>
                                <span className="font-mono text-slate-200">${calculatedFed.toLocaleString()}</span>
                              </div>
                            </div>

                            <div className="pt-4 border-t border-slate-800 mt-4 flex justify-between items-baseline">
                              <span className="text-xs font-bold text-slate-300">{t.calculatedTotal}</span>
                              <span className="text-xl font-black text-emerald-400 font-mono">
                                ${s1TotalTax.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 5: Compliance Validation */}
                  {s1Step === 5 && (
                    <div className="space-y-4 animate-fade-in text-right font-sans">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800 space-y-4">
                          <h3 className="text-sm font-bold text-slate-300 border-b border-slate-800 pb-2 flex items-center gap-1.5">
                            <Shield className="w-4.5 h-4.5 text-[#0066FF]" />
                            {t.riskRating}
                          </h3>

                          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
                            <div className="flex justify-between text-xs">
                              <span>{lang === "ku" ? "شاخصی مەترسی گشتی" : "مؤشر الخطورة الإجمالي للشحنة"}</span>
                              <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 py-0.5 px-2">Low Risk // ئارام</Badge>
                            </div>

                            {/* Risk Meter Visual Bar */}
                            <div className="w-full bg-slate-850 h-2.5 rounded-full overflow-hidden flex">
                              <div className="bg-emerald-500 h-full" style={{ width: "15%" }} />
                              <div className="bg-amber-500 h-full" style={{ width: "0%" }} />
                              <div className="bg-red-500 h-full" style={{ width: "0%" }} />
                            </div>

                            <p className="text-[10px] text-slate-400 leading-normal font-sans">
                              {lang === "ku" 
                                ? "هاوردەکار لە جۆراوجۆری نایابی زێڕینە، مەنشەئی تورکیا بە تەواوی پشتڕاستکراوە، هیچ گومانێکی پاکسازی تۆمار نەکراوە."
                                : "المستورد ذو موثوقية عالية (الدرجة الذهبية)، سجل الامتثال التاريخي سليم بنسبة 100٪، مطابقة تامة في الفواتير المرجعية السيادية."}
                            </p>
                          </div>
                        </div>

                        <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800 space-y-4">
                          <h3 className="text-sm font-bold text-slate-300 border-b border-slate-800 pb-2 flex items-center gap-1.5">
                            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400" />
                            {t.requiredDocs}
                          </h3>

                          <div className="space-y-2">
                            {initCustomsData.docs.map((doc) => (
                              <div key={doc.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300">
                                <span className="font-bold">{lang === "ku" ? doc.nameKu : doc.nameAr}</span>
                                <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 py-0.5 px-2 font-mono">
                                  ✓ OK
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    </div>
                  )}

                  {/* Step 6: Logistics Forecast & Route Mapping */}
                  {s1Step === 6 && (
                    <div className="space-y-4 animate-fade-in text-right font-sans">
                      <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800 space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                          <h3 className="text-sm font-bold text-slate-300 flex items-center gap-1.5">
                            <MapPin className="w-4.5 h-4.5 text-blue-400 animate-bounce" />
                            {t.shippingRoute}
                          </h3>
                          <Badge className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs py-0.5 px-3">
                            {t.etaTitle}: 32 Min
                          </Badge>
                        </div>

                        {/* Interactive transit pipeline visualizer */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {[
                            { step: 1, loc: t.routeStep1, capKu: "هەناردەکردن لە باوانەوە", capAr: "إرسال وتصدير بلد المنشأ", statusKu: "تەواوکراوە", statusAr: "منجز", active: false, done: true },
                            { step: 2, loc: t.routeStep2, capKu: "ڕێکاری گومرگی زاخۆ", capAr: "منفذ إبراهيم الخليل الفيدرالي", statusKu: "کارایە", statusAr: "قيد التدقيق والفرز", active: true, done: false },
                            { step: 3, loc: t.routeStep3, capKu: "کۆگای کۆتایی گەیاندن", capAr: "مستودع بغداد المعتمد", statusKu: "چاوەڕوانکراو", statusAr: "مستهدف للتسليم", active: false, done: false }
                          ].map((ls) => (
                            <div key={ls.step} className={`p-4 rounded-xl border flex flex-col justify-between ${
                              ls.active 
                                ? "bg-[#0066FF]/10 border-[#0066FF] shadow-xs scale-102" 
                                : ls.done 
                                ? "bg-slate-950/80 border-slate-800 opacity-70" 
                                : "bg-slate-950/30 border-slate-900 opacity-40 text-slate-500"
                            }`}>
                              <div className="flex justify-between items-center">
                                <span className="text-[10px] font-bold text-[#0066FF]">STEP 0{ls.step}</span>
                                <Badge className={`${ls.done ? "bg-emerald-500/10 text-emerald-400" : ls.active ? "bg-blue-500/20 text-blue-300 animate-pulse" : "bg-slate-800 text-slate-400"} text-[9px] py-0 px-1.5`}>
                                  {lang === "ku" ? ls.statusKu : ls.statusAr}
                                </Badge>
                              </div>
                              <span className="text-xs font-black text-slate-100 mt-2 block">{ls.loc}</span>
                              <span className="text-[10px] text-slate-450 block mt-1">{ls.capAr}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 7: Executive Clearance Summary */}
                  {s1Step === 7 && (
                    <div className="space-y-4 animate-fade-in text-right font-sans">
                      <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-5 text-slate-200">
                        
                        <div className="text-center space-y-1.5 border-b border-dashed border-slate-800 pb-4">
                          <Award className="w-10 h-10 text-yellow-300 mx-auto animate-pulse" />
                          <h3 className="text-base font-black text-slate-100">
                            {t.executiveClearanceReport}
                          </h3>
                          <span className="text-[11px] text-slate-400 font-mono tracking-wider">
                            IDG-CLEARANCE-785A-MSc
                          </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-sans">
                          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                            <span className="text-[10px] text-slate-500 block font-bold">{lang === "ku" ? "بارودۆخ" : "قرار الإفراج"}</span>
                            <span className="font-extrabold text-emerald-400 block mt-1">✓ {lang === "ku" ? "لێخۆشبوو و ڕێگەپێدراو" : "مفرج جمركياً بالكامل"}</span>
                          </div>
                          
                          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                            <span className="text-[10px] text-slate-500 block font-bold">{lang === "ku" ? "کۆ باج و رسومات" : "مجموع الرسوم المحصلة"}</span>
                            <span className="font-mono text-xl font-bold text-slate-100 block mt-1">${s1TotalTax.toLocaleString()}</span>
                          </div>

                          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                            <span className="text-[10px] text-slate-500 block font-bold">{t.riskScore}</span>
                            <span className="font-bold text-emerald-400 block mt-1">15/100 (ئارام)</span>
                          </div>

                          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                            <span className="text-[10px] text-slate-500 block font-bold">{t.etaTitle}</span>
                            <span className="font-bold text-blue-400 block mt-1">32 {t.secondsUnit}</span>
                          </div>
                        </div>

                        {/* Export, Print Controls */}
                        <div className="flex flex-wrap gap-2.5 pt-3 border-t border-slate-800">
                          <Button
                            onClick={() => triggerToast(t.toastPrint)}
                            className="bg-slate-850 hover:bg-slate-800 text-slate-200 text-xs px-4 py-3 rounded-xl transition cursor-pointer flex items-center gap-1.5"
                          >
                            <Printer className="w-4 h-4" />
                            <span>{t.printBtn}</span>
                          </Button>

                          <Button
                            onClick={() => triggerToast(t.toastPdf)}
                            className="bg-slate-850 hover:bg-slate-800 text-slate-200 text-xs px-4 py-3 rounded-xl transition cursor-pointer flex items-center gap-1.5"
                          >
                            <Download className="w-4 h-4" />
                            <span>{t.exportPdfBtn}</span>
                          </Button>

                          <Button
                            onClick={() => triggerToast(t.toastSaved)}
                            className="bg-[#0066FF] hover:bg-blue-600 text-white text-xs px-5 py-3 rounded-xl transition cursor-pointer flex items-center gap-1.5 font-bold"
                          >
                            <span>💾 {t.snapshotBtn}</span>
                          </Button>
                        </div>

                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* DEMO 2: NATIONAL COMPLIANCE INVESTIGATION */}
              {activeScenarioIdx === 1 && (
                <div className="space-y-6">
                  
                  <div className="border-b border-slate-800 pb-4">
                    <span className="text-[10px] text-red-400 font-bold tracking-wider block">
                      🚨 DEMO 2 // {lang === "ku" ? "چاودێری پابەندبوونی نیشتمانی و خەزنە" : "مكافحة غسيل الأموال وتهريب العملة"}
                    </span>
                    <h2 className="text-lg md:text-xl font-black text-slate-100 mt-1">
                      {lang === "ku" ? "داواکاری گوماناوی و بەراوردکردنی توندی نرخەکان" : "تحليل الانحراف السعري لصفقات الاستيراد الكبرى"}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-right">
                    
                    {/* Workspace statistics details */}
                    <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800 space-y-4">
                      <h3 className="text-sm font-bold text-slate-300 border-b border-slate-800 pb-2">
                        🔖 {t.amlCaseTitle}
                      </h3>

                      <div className="space-y-3 font-sans text-xs">
                        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                          <span className="text-[10px] text-slate-500 block font-bold">{lang === "ku" ? "هاوردەکار و لایەنی داواکار" : "جهة التحويل والمستورد"}</span>
                          <span className="font-bold text-slate-200 block mt-1">{complianceCaseData.compImporter}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                            <span className="text-[10px] text-slate-500 block font-bold">{t.invoiceVal}</span>
                            <span className="font-mono text-sm font-extrabold text-red-400 block mt-1">
                              ${complianceCaseData.invoiceVal.toLocaleString()}
                            </span>
                          </div>

                          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                            <span className="text-[10px] text-slate-500 block font-bold">{t.marketVal}</span>
                            <span className="font-mono text-sm font-extrabold text-emerald-400 block mt-1">
                              ${complianceCaseData.marketVal.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                          <div>
                            <span className="text-[10px] text-slate-500 block font-bold">{t.varianceLabel}</span>
                            <span className="text-sm font-black text-red-500 mt-1 block">
                              +{complianceCaseData.variancePct} // ${complianceCaseData.difference.toLocaleString()}
                            </span>
                          </div>
                          <Badge className="bg-red-500/10 text-red-400 border border-red-500/20 text-[9px] font-black">HIGH ANOMALY</Badge>
                        </div>

                        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                          <span className="text-[10px] text-slate-500 block font-bold">{t.bankingRoute}</span>
                          <span className="font-mono text-[11px] text-slate-350 block mt-1">{complianceCaseData.bankingRoute}</span>
                        </div>
                      </div>
                    </div>

                    {/* Left Checklist and live decision tools */}
                    <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4">
                      
                      <div className="space-y-4 font-sans text-xs">
                        <h3 className="text-sm font-bold text-slate-300 border-b border-slate-800 pb-2 flex items-center gap-1.5">
                          <Shield className="w-4.5 h-4.5 text-red-500" />
                          {t.complianceReview}
                        </h3>

                        <div className="space-y-2">
                          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                            <span>{t.amlScreening}</span>
                            <Badge className="bg-red-500/20 text-red-400 border border-red-500/30 text-[9px]">🚨 Suspicious</Badge>
                          </div>
                          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                            <span>{t.sanctionsCheck}</span>
                            <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px]">✓ Clean</Badge>
                          </div>
                          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                            <span className="text-[9px] text-slate-500 block">{lang === "ku" ? "شیکردنەوەی مەترسی" : "تحليل مؤشرات المفتش الفيدرالي"}</span>
                            <p className="text-[10px] text-red-400 leading-relaxed font-sans mt-0.5">
                              {t.overvalAnalysis}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Interactive block or approve scenario actions */}
                      <div className="bg-slate-950/90 p-4 rounded-xl border border-slate-800 space-y-3">
                        <span className="text-[10px] text-slate-400 block font-bold">{t.decisionLabel}</span>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            onClick={() => {
                              setAmlDecision("BLOCKED");
                              triggerToast(lang === "ku" ? "داواکارییەکە بە سەرکەوتوویی لە خەزنە بلۆککرا." : "تم توجيه المنفذ والبنك بحظر المعاملة نهائياً.");
                            }}
                            className={`text-xs py-2.5 rounded-xl font-bold cursor-pointer transition ${
                              amlDecision === "BLOCKED" 
                                ? "bg-red-600 text-white" 
                                : "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20"
                            }`}
                          >
                            ⛔ {t.statusBlocked}
                          </Button>

                          <Button
                            onClick={() => {
                              setAmlDecision("APPROVED");
                              triggerToast(lang === "ku" ? "ڕێگەپێدانی فەرمی جێبەجێکرا." : "تم تمكين الإفراج المالي الاستثنائي.");
                            }}
                            className={`text-xs py-2.5 rounded-xl font-bold cursor-pointer transition ${
                              amlDecision === "APPROVED" 
                                ? "bg-emerald-600 text-white" 
                                : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                            }`}
                          >
                            ✓ {t.statusApproved}
                          </Button>
                        </div>

                        {amlDecision && (
                          <div className="p-3 bg-white/5 rounded-lg border border-white/5 text-[10px] space-y-1">
                            <span className="font-bold text-slate-300 block">{t.legalJustification}:</span>
                            <p className="text-slate-400 font-sans leading-normal">
                              {amlDecision === "BLOCKED" 
                                ? (lang === "ku" ? `بلۆککردن بەپێی یاسای ژمارە (٥٦)ی ساڵی ٢٠٠٤ی بانکی ناوەندی بەهۆی جیاوازی زۆری نرخ (%١٨٥.٧)` : `حظر وبلوك بموجب أحكام المادة (٥٦) لقانون البنك المركزي لوجود تضخم سعري يبلغ ١٨٥.٧٪ للتلاعب.`)
                                : (lang === "ku" ? `پەسەندکردنی کاتی بەپێی بەدواداچوونی گومرگ و دابینکردنی مۆڵەتەکان.` : `إفراج مالي جمركي مؤقت وتعهد قانوني لاحق لعدم ثبوت التقاطع الجنائي البنيوي.`)}
                            </p>
                          </div>
                        )}
                      </div>

                    </div>

                  </div>

                  {/* Operational Verification Timeline */}
                  <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800 text-right font-sans space-y-3">
                    <span className="text-[11px] text-red-400 font-bold uppercase block">{t.timelineLabel}</span>
                    
                    <div className="grid grid-cols-5 gap-2 relative">
                      {complianceCaseData.stages.map((stg) => {
                        const isCurrent = amlDecision ? stg.id === 5 : stg.id === 3;
                        const isPast = stg.id < (amlDecision ? 5 : 3);
                        return (
                          <div key={stg.id} className={`p-3 rounded-xl border text-center flex flex-col items-center justify-between gap-1.5 ${
                            isCurrent 
                              ? "bg-[#0066FF] text-white border-blue-400 scale-[1.03]" 
                              : isPast 
                              ? "bg-slate-950/80 border-slate-800 opacity-60" 
                              : "bg-slate-950/30 border-slate-900 opacity-30 text-slate-500"
                          }`}>
                            <span className="text-[10px] font-black">{stg.id}</span>
                            <span className="text-[9px] font-bold line-clamp-1">{lang === "ku" ? stg.labelKu : stg.labelAr}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              )}

              {/* DEMO 3: NATIONAL KNOWLEDGE BRAIN */}
              {activeScenarioIdx === 2 && (
                <div className="space-y-6">
                  
                  <div className="border-b border-slate-800 pb-4">
                    <span className="text-[10px] text-violet-400 font-bold tracking-wider block">
                      🧠 DEMO 3 // {lang === "ku" ? "مێشکی زانیاری و بەڵگەکان" : "قاعدة البيانات التشريعية بالذكاء المعزز"}
                    </span>
                    <h2 className="text-lg md:text-xl font-black text-slate-100 mt-1">
                      {lang === "ku" ? "هۆشمەندی لێکدانەوەی ڕێساکان بە نیشاندانی سەرچاوەی فەرمی" : "الاستعلام واستخلاص المرجعية للوائح الاقتصادية والتعرفة"}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-right">
                    
                    {/* Questions input bank */}
                    <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800 space-y-4">
                      <h3 className="text-sm font-bold text-slate-300 border-b border-slate-800 pb-2">
                        💬 {lang === "ku" ? "ناوەندی پرسیار و تاقیکردنەوە" : "بوابة الاستعلام والتدقيق المعرفي"}
                      </h3>

                      <form onSubmit={handleSearchBrain} className="space-y-2">
                        <span className="text-[10px] text-slate-400 block font-bold">{t.askQuestionPlaceholder}</span>
                        <div className="flex gap-2 font-sans">
                          <input
                            type="text"
                            value={customQuestion}
                            onChange={(e) => setCustomQuestion(e.target.value)}
                            placeholder={lang === "ku" ? "پرسیار بنووسە لێرە..." : "اكتب سؤالاً تشريعياً وجمركياً..."}
                            className="bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 w-full"
                          />
                          <Button
                            type="submit"
                            disabled={isSearchingBrain}
                            className="bg-[#0066FF] hover:bg-blue-600 font-bold text-xs rounded-xl px-4 cursor-pointer"
                          >
                            {isSearchingBrain ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                          </Button>
                        </div>
                      </form>

                      {/* Predetermined interactive Questions list */}
                      <div className="space-y-2 font-sans">
                        <span className="text-[10px] text-slate-500 block uppercase font-bold">{t.suggestedQuestions}</span>
                        {knowledgeBrainQAs.map((qa, q_idx) => (
                          <button
                            key={qa.questionKey}
                            type="button"
                            onClick={() => {
                              setActiveQuestionIdx(q_idx);
                              setSearchedAnswer(null);
                              setCustomQuestion("");
                            }}
                            className={`w-full text-right p-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
                              q_idx === activeQuestionIdx && !searchedAnswer
                                ? "bg-white/5 border-[#0066FF] text-[#0066FF]"
                                : "bg-slate-950/60 border-slate-850 text-slate-400 hover:bg-slate-900/50"
                            }`}
                          >
                            <span>{t[qa.questionKey]}</span>
                            <span className="text-[10px] text-slate-500 font-mono">03.0{q_idx + 1}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Reasoning visualization panel */}
                    <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4">
                      
                      <div className="space-y-3 font-sans text-xs">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                          <h3 className="text-sm font-bold text-slate-300">
                            🧠 {t.aiReasoningArea}
                          </h3>
                          <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 py-0.5 px-2">
                            {t.confidenceTitle}: {searchedAnswer ? searchedAnswer.confidence : knowledgeBrainQAs[activeQuestionIdx].confidence}
                          </Badge>
                        </div>

                        {/* Interactive Reasoning flow timeline */}
                        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
                          <div className="text-[11px] text-slate-300 font-sans leading-relaxed">
                            {searchedAnswer 
                              ? (lang === "ku" ? searchedAnswer.ku : searchedAnswer.ar)
                              : (lang === "ku" ? knowledgeBrainQAs[activeQuestionIdx].answerKu : knowledgeBrainQAs[activeQuestionIdx].answerAr)}
                          </div>
                        </div>

                        {/* citations details */}
                        <div className="space-y-2">
                          <span className="text-[10px] text-slate-500 uppercase font-bold block">{t.sourcesTitle}</span>
                          {(searchedAnswer ? searchedAnswer.citations : knowledgeBrainQAs[activeQuestionIdx].citations).map((cit: any, c_idx: number) => (
                            <div key={c_idx} className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-800 space-y-1 text-[10px] text-slate-300">
                              <div className="flex justify-between font-bold">
                                <span className="text-[#0066FF]">{cit.source}</span>
                                <span className="font-mono text-slate-450">{cit.trust} TRUST</span>
                              </div>
                              <div className="flex justify-between text-[9px] text-slate-450">
                                <span>{t.authorityTitle}: {cit.authority}</span>
                                <span>{t.pubDate}: {cit.date}</span>
                              </div>
                            </div>
                          ))}
                        </div>

                      </div>

                      {/* Memorandum action bar */}
                      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-800">
                        <Button
                          onClick={() => triggerToast(t.toastPrint)}
                          className="bg-slate-850 hover:bg-slate-800 text-slate-200 text-xs py-2 px-3 rounded-lg cursor-pointer transition flex items-center justify-center gap-1.5"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>{t.printBtn}</span>
                        </Button>
                        <Button
                          onClick={() => triggerToast(t.toastPdf)}
                          className="bg-[#0066FF] hover:bg-blue-600 text-white text-xs py-2 px-3 rounded-lg cursor-pointer transition flex items-center justify-center gap-1.5 font-bold"
                        >
                          <span>{t.memorandumReport} 📄</span>
                        </Button>
                      </div>

                    </div>

                  </div>

                </div>
              )}

              {/* DEMO 4: NATIONAL EXECUTIVE COMMAND CENTER */}
              {activeScenarioIdx === 3 && (
                <div className="space-y-6">
                  
                  <div className="border-b border-slate-800 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] text-emerald-400 font-bold block">
                        🛰️ DEMO 4 // {t.commandCenterTitle}
                      </span>
                      <h2 className="text-xl font-black text-slate-100 mt-1">
                        {lang === "ku" ? "ژووری فەرماندەیی نیشتمانی بۆ چاودێری منافذ و داهاتەکان" : "مركز المراقبة والعمليات والجهوزية الفيدرالية الشاملة"}
                      </h2>
                    </div>

                    <div className="flex gap-1.5 self-start">
                      <Button
                        onClick={() => setThreatLevelS4("NORMAL")}
                        className={`text-[10px] py-1 px-3 rounded-xl cursor-pointer ${
                          threatLevelS4 === "NORMAL" ? "bg-emerald-600 text-white" : "bg-white/5 text-slate-400"
                        }`}
                      >
                        ✓ NORMAL
                      </Button>
                      <Button
                        onClick={() => setThreatLevelS4("HIGH")}
                        className={`text-[10px] py-1 px-3 rounded-xl cursor-pointer ${
                          threatLevelS4 === "HIGH" ? "bg-amber-600 text-white" : "bg-white/5 text-slate-400"
                        }`}
                      >
                        ⚠️ HIGH
                      </Button>
                      <Button
                        onClick={() => setThreatLevelS4("CRITICAL")}
                        className={`text-[10px] py-1 px-3 rounded-xl cursor-pointer ${
                          threatLevelS4 === "CRITICAL" ? "bg-red-600 text-white animate-pulse" : "bg-white/5 text-slate-400"
                        }`}
                      >
                        🚨 CRITICAL
                      </Button>
                    </div>
                  </div>

                  {/* Operational Readiness Score Card and radar statistics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    
                    {/* Gauge Metric for Readiness Score */}
                    <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between items-center text-center">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">{t.readinessScore}</span>
                      
                      <div className="relative my-4 flex items-center justify-center">
                        <div className="w-24 h-24 rounded-full border-4 border-slate-800 border-t-[#0066FF] animate-spin absolute" />
                        <div className="w-20 h-20 rounded-full bg-slate-950 flex flex-col items-center justify-center relative z-10">
                          <span className="text-2xl font-black text-slate-100">{s4OverallScore}%</span>
                        </div>
                      </div>

                      <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] px-2.5 select-none">
                        ✓ {lang === "ku" ? "ئامادەکەیی بەرز" : "جهوزية فدرالية ممتازة"}
                      </Badge>
                    </div>

                    {/* Criteria list */}
                    <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800 space-y-3 font-sans text-xs md:col-span-2">
                      <span className="text-[11px] text-slate-400 font-bold block">{t.systemReadinessBreakdown}</span>
                      
                      <div className="space-y-2">
                        {[
                          { key: t.stableSystem, val: s4SecurityScore },
                          { key: t.livePulse, val: s4PerformanceValue },
                          { key: t.complianceLevel, val: s4CompliancePct },
                          { key: t.stableSystem, val: s4ReliabilityPct },
                          { key: t.analysisReady, val: s4AiAccuracy }
                        ].map((cr, idx) => (
                          <div key={idx} className="space-y-1">
                            <div className="flex justify-between text-[10px]">
                              <span>{cr.key}</span>
                              <span className="text-slate-300 font-mono font-bold">{cr.val}%</span>
                            </div>
                            <div className="w-full bg-slate-850 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-[#0066FF] h-full" style={{ width: `${cr.val}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Incidents Warning Center & Filter table */}
                  <div className="bg-slate-900/45 p-5 rounded-2xl border border-slate-800 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-3">
                      <h3 className="text-xs font-bold text-slate-350 flex items-center gap-1">
                        🔔 {t.activeAlertsTitle}
                      </h3>

                      {/* Filters */}
                      <div className="flex gap-1">
                        {[
                          { filter: "ALL", label: t.allAlerts },
                          { filter: "CRITICAL", label: t.criticalAlerts },
                          { filter: "WARNING", label: t.warningAlerts },
                          { filter: "INFO", label: t.infoAlerts }
                        ].map((fil) => (
                          <button
                            key={fil.filter}
                            onClick={() => setActiveAlertFilter(fil.filter as any)}
                            className={`px-2.5 py-1 text-[9px] rounded-lg transition-all ${
                              activeAlertFilter === fil.filter
                                ? "bg-slate-800 text-white font-bold"
                                : "text-slate-500 hover:text-white"
                            }`}
                          >
                            {fil.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      {mockAlerts
                        .filter((ala) => activeAlertFilter === "ALL" || ala.type === activeAlertFilter)
                        .map((ala) => (
                          <div key={ala.id} className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80 flex justify-between items-center text-xs">
                            <div className="flex items-center gap-2.5">
                              <span className={`w-2 h-2 rounded-full shrink-0 ${
                                ala.type === "CRITICAL" ? "bg-red-500 animate-pulse" : ala.type === "WARNING" ? "bg-amber-500" : "bg-blue-400"
                              }`} />
                              <span className="text-slate-200 font-bold">{lang === "ku" ? ala.textKu : ala.textAr}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={`text-[8px] px-1.5 ${
                                ala.type === "CRITICAL" ? "bg-red-500/10 text-red-400" : ala.type === "WARNING" ? "bg-amber-500/10 text-amber-500" : "bg-blue-500/10 text-blue-400"
                              }`}>{ala.type}</Badge>
                              <span className="text-[10px] text-slate-500 font-mono">{ala.time}</span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                </div>
              )}

              {/* Universal Action and navigation timeline Controls at the bottom card */}
              <div className="border-t border-slate-800/60 pt-5 mt-6 flex justify-between items-center sm:flex-row flex-col gap-4 text-xs font-bold text-slate-400">
                <Button
                  onClick={handleManualPrev}
                  className="bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-800 text-xs px-4 py-3 rounded-xl cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed w-full sm:w-auto text-center"
                >
                  {lang === "ku" ? "← هەنگاوی پێشوو" : "← خطوة سابقة"}
                </Button>

                <div className="text-[10.5px] text-slate-500 text-center select-none font-sans mt-1 md:mt-0 font-medium">
                  ⚖️ {lang === "ku" ? "سەکۆی گشتی لێکۆڵینەوە و ئۆپەکاسیۆنی فەنلانسی نیشتمانی" : "المنتدى الوطني لعرض وتوطيد سلامة الأنظمة الاقتصادية"}
                </div>

                <Button
                  onClick={handleManualNext}
                  className="bg-[#0066FF] hover:bg-blue-600 text-white font-bold text-xs px-5 py-3 rounded-xl cursor-pointer transition w-full sm:w-auto text-center border border-blue-400/20"
                >
                  {lang === "ku" ? "هەنگاوی دواتر →" : "خطوة تالية →"}
                </Button>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
