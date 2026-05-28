import { 
  EarlyWarningAlert, 
  StrategicPolicy, 
  GraphNode, 
  GraphLink, 
  ForecastDataPoint,
  ScenarioParam,
  ScenarioSimulationResult
} from './types';

// Analytical Indicators & Initial Metrics
export const INITIAL_TRADE_METRICS = [
  {
    id: 'customs_rev',
    name: 'Customs Revenue Outflow/collections',
    kuName: 'داهاتی گومرگی کۆکراوە',
    arName: 'الإيرادات الجمركية المحصلة',
    value: 1245000000, // $1.245B USD
    change: 8.4,
    unit: 'USD',
    history: [980, 1020, 1080, 1120, 1150, 1200, 1245]
  },
  {
    id: 'import_val',
    name: 'Gross National Imports (Monthly)',
    kuName: 'کۆی گشتی هاوردەی مانگانە',
    arName: 'إجمالي الاستيرادات الشهرية',
    value: 3450000000, // $3.45B USD
    change: 12.1,
    unit: 'USD',
    history: [2800, 2950, 3100, 3050, 3200, 3300, 3450]
  },
  {
    id: 'export_val',
    name: 'Non-Oil Exports (Monthly)',
    kuName: 'ناردنە دەرەوەی نانەوتی',
    arName: 'الصادرات غير النفطية الشهرية',
    value: 412000000, // $412M USD
    change: -2.3,
    unit: 'USD',
    history: [450, 440, 430, 420, 415, 410, 412]
  },
  {
    id: 'logistics_vol',
    name: 'Port Gross Throughput',
    kuName: 'کۆی توانای تێپەڕبوونی بەندەرەکان',
    arName: 'إنتاجية الموانئ الإجمالية',
    value: 145000, // 145k TEU
    change: 15.6,
    unit: 'TEU',
    history: [110, 115, 120, 128, 132, 138, 145]
  },
];

// 4. Economic Early Warning Alerts List (EEWS)
export const EARLY_WARNING_ALERTS: EarlyWarningAlert[] = [
  {
    id: 'ew-1',
    alert_level: 'critical',
    category: 'logistics',
    region: 'Basra (Um Qasr Core)',
    kuRegion: 'بەسرە (ئوم قەسر)',
    arRegion: 'البصرة (ميناء أم قصر)',
    confidence: 94.8,
    impact_estimate: '$3.2M USD / Day bottleneck attrition',
    kuImpact_estimate: '٣.٢ ملیۆن دۆلار لە ڕۆژێکدا بەهۆی قەرەباڵغی',
    arImpact_estimate: '٣.٢ مليون دولار يومياً بسبب الازدحام',
    timestamp: '2026-05-28T10:30:00Z',
    title: 'Severe Berthing Congestion Alert at Terminal 4',
    kuTitle: 'هۆشداری قەرەباڵغی توند لە تێرمیناڵی ٤',
    arTitle: 'تحذير من ازدحام شديد في رصيف الحاويات ٤',
    description: 'Vessel turnaround time has surged by 45 hours due to customs processing backlogs at the port control station.',
    kuDescription: 'کاتی گەیشتنی کەشتییەکان ٤٥ کاتژمێر دواکەوتووە بەهۆی کۆبوونەوەی دۆسیە گومرگییەکان لە مەرزی چاودێری پۆرت.',
    arDescription: 'ارتفع وقت دوران السفن بمقدار ٤٥ ساعة بسبب تراكم المعاملات الجمركية في محطة مراقبة الميناء.',
    recommendations: [
      'Activate redundant ASYCUDA clearing servers to address network latency.',
      'Establish emergency bypass corridor for perishable agricultural shipments.',
      'Deploy joint customs-military validation squads to inspect cleared manifest lines.'
    ],
    kuRecommendations: [
      'چالاککردنی سێرڤەرە یەدەگەکانی ئاسیکۆدا بۆ چارەسەری خاوی نێت.',
      'دروستکردنی ڕێڕەوی فریاگوزاری بۆ بارە کشتوکاڵییە بەپەلەکان.',
      'بڵاوکردنەوەی تیمێکی چاودێری هاوبەش لە پۆلیس و گومرگ بۆ خێراکردنی کارەکان.'
    ],
    arRecommendations: [
      'تفعيل خوادم أسيكودا الاحتياطية لمعالجة بطء استجابة الشبكة.',
      'إنشاء ممر طوارئ للشحنات الزراعية سريعة التلف.',
      'نشر فرق تدقيق مشتركة من الجمارك والجيش لتفتيش خطوط الشحن المعتمدة.'
    ]
  },
  {
    id: 'ew-2',
    alert_level: 'high',
    category: 'tariff',
    region: 'Ibrahim Khalil Border',
    kuRegion: 'مەرزی ئیبراهیم خەلیل',
    arRegion: 'منفذ إبراهيم الخليل الدولي',
    confidence: 89.2,
    impact_estimate: '18.4% trade drop forecast in key sectors',
    kuImpact_estimate: 'کەمبوونی ١٨.٤٪ لە هاوردەی کەرتە سەرەکییەکان',
    arImpact_estimate: 'انخفاض متوقع بنسبة ١٨.٤٪ في خطوط الاستيراد الحيوية',
    timestamp: '2026-05-27T16:15:00Z',
    title: 'Customs Valuation Divergence & Regulatory Spill',
    kuTitle: 'جیاوازی لە نرخاندنی پێشینیی تاریفەکان',
    arTitle: 'تباين في تقييم الرسوم الجمركية والآثار التنظيمية',
    description: 'Valuation criteria mismatch regarding steel sheets imports from Turkey resulting in stranded cargo containers at northern ports.',
    kuDescription: 'ناڕێکی لە مەرجەکانی نرخاندنی گومرگی بۆ ئاسنی هاوردەکراو لە تورکیا بووەتە هۆی پەککەوتنی سەدان کۆنتێنەر لە باکوور.',
    arDescription: 'أدى عدم تطابق معايير التقييم الجمركي لحديد التسليح المستورد من تركيا إلى حجز مئات الحاويات في البوابة حديدية الشمالية.',
    recommendations: [
      'Deploy instant standardization tables aligned with national trade specifications.',
      'Provide visual digital checklist on pre-certified Turkish industrial partners.',
      'Harmonize regional-federal customs tariff schedules.'
    ],
    kuRecommendations: [
      'جێبەجێکردنی خشتەی یەکگرتوو بە تاریفەی هاوبەشی بەرووردکاری بێ جیاوازی.',
      'دابینکردنی مۆڵەتی پێشوەختە و پشتڕاستکراوە بۆ بریکارەکانی تورکیا.',
      'هاوتاکردنی ڕێژەی تاریفەی گومرگی نێوان حکومەتی فیدراڵ و هەرێم.'
    ],
    arRecommendations: [
      'نشر جداول مقارنة موحدة تتماشى مع المواصفات التجارية الوطنية.',
      'توفير تدقيق رقمي مباشر للشركاء الصناعيين الأتراك والمسجلين مسبقاً.',
      'توحيد والتقريب بين جداول التعرفة الجمركية الإقليمية والاتحادية.'
    ]
  },
  {
    id: 'ew-3',
    alert_level: 'medium',
    category: 'geopolitics',
    region: 'Dry Canal Trade Corridor',
    kuRegion: 'ڕێڕەوی وشکانی دەروازی وشک',
    arRegion: 'ممر القناة الجافة البري',
    confidence: 91.0,
    impact_estimate: 'Delay up to 12 days for inland logistics transit',
    kuImpact_estimate: 'دواکەوتنی بارەکان تا ١٢ ڕۆژ بۆ گواستنەوەی ناوخۆ',
    arImpact_estimate: 'تأخيرات تصل إلى ١٢ يوماً لحركة الشحنات البرية',
    timestamp: '2026-05-28T08:00:00Z',
    title: 'Sovereign Transit Corridor Infrastructure Degradation',
    kuTitle: 'لاوازبوونی ژێرخانی گواستنەوەی ڕێڕەوی ستراتیژی',
    arTitle: 'تراجع كفاءة البنية التحتية لممر العبور البري السيادي',
    description: 'Unplanned road diversions around structural repairs near Samawah have reduced maximum safe axle load capacities.',
    kuDescription: 'لادانی ڕێگاوبانی پێشبینینەکراو لە نزیک سەماوە بووەتە هۆی کەمبوونەوەی بارستایی بار و پەککەوتنی جادەکان.',
    arDescription: 'أدت التحويلات المرورية المفاجئة بسبب الصيانة الإنشائية قرب مدينة السماوة إلى خفض حمولات المحاور الآمنة.',
    recommendations: [
      'Re-route high-capacity dry cargo to regional double-track rail links.',
      'Issue immediate axle limits notice to military logistics controllers.',
      'Redirect non-bulk supply-chains through Euphrates auxiliary highway.'
    ],
    kuRecommendations: [
      'ئاڕاستەکردنەوەی بارە قورسەکان بۆ سەر هێڵی ئاسنی دووقۆڵیی.',
      'دەرکردنی ئاگادارکەرەوەی بارستایی گونجاو بۆ هۆبەی سەرپەرشتی کاروباری سەربازی.',
      'چالاککردنی ڕێگای فرات بۆ گواستنەوەی کاڵا بچووکە خێراکان.'
    ],
    arRecommendations: [
      'إعادة توجيه حمولات النقل الثقيل إلى خطوط السكك الحديدية المزدوجة.',
      'إصدار تعميم عاجل بحدود الأوزان والتحميل لغرفة المراقبة اللوجستية.',
      'تحويل مسار شاحنات البضائع الخفيفة إلى طريق الفرات البديل.'
    ]
  }
];

// 7. Economic Knowledge Graph Structure
export const KNOWLEDGE_GRAPH_NODES: GraphNode[] = [
  { 
    id: 'n-1', label: 'Um Qasr Port', kuLabel: 'بەندەری ئوم قەسر', arLabel: 'ميناء أم قصر',
    type: 'port', status: 'bottleneck', 
    description: 'Largest commercial port in Southern Iraq handling over 70% of maritime container trade.',
    kuDescription: 'گەورەترین بەندەری بازرگانی عێراق لە باشوور کە زیاتر لە ٧٠٪ی بازرگانی ماریتایمی تیا دەکرێت.',
    arDescription: 'أكبر ميناء تجاري في جنوب العراق ينشط فيه أكثر من ٧٠٪ من تجارة الحاويات البحرية.'
  },
  { 
    id: 'n-2', label: 'Ibrahim Khalil', kuLabel: 'ئیبراهیم خەلیل', arLabel: 'إبراهيم الخليل',
    type: 'port', status: 'active', 
    description: 'Key northern land terminal interfacing Turkey and the European Union transport corridors.',
    kuDescription: 'دەروازەیەکی زەمینی هەرە گرنگی باکوور لەگەڵ تورکیا و دەرچە بەرەو یەکێتی ئەوروپا.',
    arDescription: 'منفذ بري رئيسي يربط شمال العراق بتركيا وممرات النقل بالاتحاد الأوروبي.'
  },
  { 
    id: 'n-3', label: 'Basra Customs', kuLabel: 'گومرگی بەسرە', arLabel: 'جمارك البصرة',
    type: 'customs_office', status: 'active', 
    description: 'Federal customs assessment headquarters overseeing deepwater port manifests.',
    kuDescription: 'سەنتەری هەڵسەنگاندن و تۆمارکردنی مەنەفێستەکانی گومرگی بەندەرەکانی عێراق.',
    arDescription: 'مقر التدقيق والتقدير الجمركي الاتحادي المشرف على شحنات المياه العميقة.'
  },
  { 
    id: 'n-4', label: 'Dry Canal Express', kuLabel: 'کەناڵی وشک', arLabel: 'القناة الجافة',
    type: 'corridor', status: 'restricted',
    description: 'Multimodal strategic railway/highway link carrying container cargo from Basra inland up north.',
    kuDescription: 'هێڵی شەمەندەفەر و ڕێگای وشکانی ستراتیژی هاوبەش بۆ گواستنەوەی کانتینەر تا باکوور.',
    arDescription: 'ممر بري وسكة حديد استراتيجية لنقل الحاويات من شط العرب والبصرة إلى الحدود الشمالية.'
  },
  { 
    id: 'n-5', label: 'Steel Sheets', kuLabel: 'پەڕەی ئاسن', arLabel: 'ألواح الحديد والمقاطع',
    type: 'commodity', status: 'restricted',
    description: 'Critical structural metal imports heavily bound to tariff schedule audits.',
    kuDescription: 'بەرهەمی کانزایی پێویست بۆ ئاوەدانکردنەوە کە ڕێکار و باجی زۆری گومرگی هەیە.',
    arDescription: 'مادة معدنية أساسية تستخدم للإعمار وتخضع لضوابط الفحص اللوجستي وتصنيف التعرفة.'
  },
  { 
    id: 'n-6', label: 'ASYCUDA System', kuLabel: 'سیستەمی ئاسیکۆدا', arLabel: 'نظام أسيكودا الرقمي',
    type: 'regulation', status: 'active',
    description: 'Digital customs declaration process running automatic rule-checks and valuation models.',
    kuDescription: 'پرۆگرامی گومرگی ئەلیکترۆنی جیهانی بۆ خەمڵاندنی ڕێژەی تاریفە و پشکنین.',
    arDescription: 'النظام المحوسب المتكامل لإدارات الجمارك ومعالجة البيانات والتدقيق التلقائي.'
  },
  { 
    id: 'n-7', label: 'Ministry of Trade', kuLabel: 'وەزارەتی بازرگانی', arLabel: 'وزارة التجارة والمالية',
    type: 'organization', status: 'active',
    description: 'Sovereign governmental body managing trade licenses, quotas, and tariff policy declarations.',
    kuDescription: 'قەوارەی دەسەڵاتداری فەرمی و حاکم کە مۆڵەت و سنووری بازرگانی دیاری دەکات.',
    arDescription: 'الجهة السيادية المسؤولة عن تنظيم رخص الاستيراد وحصص السلع ووضع الهيكلية الضريبية.'
  }
];

export const KNOWLEDGE_GRAPH_LINKS: GraphLink[] = [
  { source: 'n-1', target: 'n-3', label: 'Inspected by', kuLabel: 'پشکنینی بۆ دەکرێت لەلایەن', arLabel: 'يتم التدقيق بواسطة' , type: 'regulated_by'},
  { source: 'n-1', target: 'n-4', label: 'Feeds major logs', kuLabel: 'بار دەگوازێتەوە بۆ', arLabel: 'يغذي حركة المرور في', type: 'routes_through' },
  { source: 'n-4', target: 'n-2', label: 'Links directly into', kuLabel: 'بەستراوەتەوە بە', arLabel: 'يربط مباشرة بـ', type: 'routes_through' },
  { source: 'n-5', target: 'n-1', label: 'Discharges at', kuLabel: 'دادەگیرێت لە', arLabel: 'يفرغ حمولاته في', type: 'routes_through' },
  { source: 'n-3', target: 'n-6', label: 'Enforces regulation via', kuLabel: 'کارەکانی دەکات بە', arLabel: 'يطبق الأنظمة باستعمال', type: 'regulated_by' },
  { source: 'n-5', target: 'n-6', label: 'Tariff calculated in', kuLabel: 'تاریفەی دیاریدەکرێت لە', arLabel: 'تحسب رسومه في', type: 'regulated_by' },
  { source: 'n-3', target: 'n-7', label: 'Subordinate agency of', kuLabel: 'سەربە لایەنی فەرمی', arLabel: 'تتبع تنظيمياً إلى', type: 'managed_by' },
  { source: 'n-6', target: 'n-7', label: 'Sovereign governed by', kuLabel: 'بەڕێوەدەبرێت لەلایەن', arLabel: 'تدار سيادياً من قبل', type: 'managed_by' }
];

// 5. Strategic Policies & Policy Impact Analysis List
export const STRATEGIC_POLICIES: StrategicPolicy[] = [
  {
    id: 'p-1',
    title: 'Customs Modernization Initiative (ASYCUDA Rollout)',
    kuTitle: 'دەستپێشخەری هاوچەرخکردنی گومرگ (ASYCUDA)',
    arTitle: 'مبادرة تحديث الجمارك الشاملة (برنامج أسيكودا)',
    description: 'Migrating legacy manual processing papers to centralized, automated risk-screening pipelines.',
    kuDescription: 'گواستنەوەی ڕێکارە کۆنە سەربەرگی کاغەزییەکان بۆ سیستەمی کۆنترۆڵ و سەرپەرشتی ئەلیکترۆنی پێشکەوتوو.',
    arDescription: 'تحويل الملفات الجمركية الورقية التقليدية إلى خوارزميات التدقيق المؤتمتة وفرز المخاطر.',
    type: 'digitalization',
    implementationRisk: 'MEDIUM',
    expectedOutcome: 'Reduces typical bulk container clearance times from 5 days to 4.5 hours while cutting document corruption factors.',
    kuExpectedOutcome: 'کەمکردنەوەی کاتی تێپەڕینی باری کۆنتێنەرە کەمتر لە ٥ ڕۆژەوە بۆ ٤.٥ کاتژمێر و کەمکردنەوەی گەندەڵی بەڵگەنامەیی.',
    arExpectedOutcome: 'خفض مدة خروج شاحنات البضائع من ٥ أيام إلى ٤.٥ ساعة فقط مع القضاء على عقبات البيروقراطية.'
  },
  {
    id: 'p-2',
    title: 'Dry Canal Logistics Corridor Reforms',
    kuTitle: 'چاکسازیی ڕێڕەوی لۆجیستیکی کەناڵی وشک',
    arTitle: 'إصلاحات ممر القناة الجافة اللوجستية',
    description: 'Upgrading primary cargo rail infrastructure and standardized cross-regional weigh station controls.',
    kuDescription: 'بەرزکردنەوەی توانای ژێرخانی شەمەندەفەری بازرگانی و هێڵی قورس و یەکخستنی بنکەکانی کێشان.',
    arDescription: 'ترقية بنية السكك الحديدية للبضائع وتوحيد محطات الفحص والوزن بين المحافظات.',
    type: 'reform',
    implementationRisk: 'HIGH',
    expectedOutcome: 'Boosts maximum daily freight throughput capacity from 12k to 35k tons, lowering diesel premiums by 22%.',
    kuExpectedOutcome: 'زیادکردنی بارستایی بار لە ١٢ هەزار تەنەوە بۆ ٣٥ هەزار تەن لە ڕۆژێکدا و کەمکردنەوەی تێچووی وزە بە ٢٢٪.',
    arExpectedOutcome: 'رفع القدرة الاستيعابية اليومية من ١٢ ألف طن إلى ٣٥ ألف طن وتخفيض تكاليف شحن الديزل بنسبة ٢٢٪.'
  },
  {
    id: 'p-3',
    title: 'Single-Window Trade Facilitation',
    kuTitle: 'ئاسانکاری فرە-دەروازە بۆ مۆڵەتی بازرگانی',
    arTitle: 'بوابة النافذة الواحدة لتسهيل الاستيراد والتصدير',
    description: 'Consolidating agricultural, health, security, and financial approvals into a unified electronic portal.',
    kuDescription: 'کۆکردنەوەی سەرجەم ڕەزامەندییە تەندروستی، کشتوکاڵی، دەرامەتی و سەربازییەکان لە ناو یەک دەروازەدا.',
    arDescription: 'دمج موافقات الصحة والزراعة والأمن الوطني والتبادل المالي في مركز معالجة رقمي واحد.',
    type: 'facilitation',
    implementationRisk: 'LOW',
    expectedOutcome: 'Cuts compliance certificate costs by $450 per declaration, prompting active trade volumes to climb by 7%.',
    kuExpectedOutcome: 'کەمکردنەوەی تێچووی نوسینگەی پشکنین بە ٤٥٠ دۆلار بۆ هەر بەڵگەنامەیەک، زیادکردنی بازرگانی بە ٧٪.',
    arExpectedOutcome: 'تقليل رسوم المعاينات بحدود ٤٥٠ دولاراً لكل بضائع معتمدة، وتنشيط حجم التجارة الوطنية بنسبة ٧٪.'
  }
];

// 8. Forecasting Framework & Confidences Output
export const FORECAST_PREDICTIONS: Record<string, ForecastDataPoint[]> = {
  customs_rev: [
    { period: 'Jan 26', actual: 950, forecast: 950, lowerConfidence: 940, upperConfidence: 960 },
    { period: 'Feb 26', actual: 1020, forecast: 1020, lowerConfidence: 1000, upperConfidence: 1040 },
    { period: 'Mar 26', actual: 1080, forecast: 1080, lowerConfidence: 1050, upperConfidence: 1110 },
    { period: 'Apr 26', actual: 1150, forecast: 1150, lowerConfidence: 1120, upperConfidence: 1180 },
    { period: 'May 26', actual: 1245, forecast: 1245, lowerConfidence: 1200, upperConfidence: 1280 },
    { period: 'Jun 26 (Short)', forecast: 1280, lowerConfidence: 1240, upperConfidence: 1320 },
    { period: 'Jul 26 (Short)', forecast: 1310, lowerConfidence: 1260, upperConfidence: 1365 },
    { period: 'Aug 26 (Med)', forecast: 1350, lowerConfidence: 1290, upperConfidence: 1410 },
    { period: 'Sep 26 (Med)', forecast: 1390, lowerConfidence: 1310, upperConfidence: 1470 },
    { period: 'Oct 26 (Long)', forecast: 1440, lowerConfidence: 1340, upperConfidence: 1540 },
    { period: 'Nov 26 (Long)', forecast: 1490, lowerConfidence: 1370, upperConfidence: 1610 },
  ],
  logistics_vol: [
    { period: 'Jan 26', actual: 105, forecast: 105, lowerConfidence: 102, upperConfidence: 108 },
    { period: 'Feb 26', actual: 112, forecast: 112, lowerConfidence: 108, upperConfidence: 116 },
    { period: 'Mar 26', actual: 120, forecast: 120, lowerConfidence: 115, upperConfidence: 125 },
    { period: 'Apr 26', actual: 128, forecast: 128, lowerConfidence: 122, upperConfidence: 134 },
    { period: 'May 26', actual: 145, forecast: 145, lowerConfidence: 138, upperConfidence: 152 },
    { period: 'Jun 26 (Short)', forecast: 152, lowerConfidence: 142, upperConfidence: 162 },
    { period: 'Jul 26 (Short)', forecast: 158, lowerConfidence: 146, upperConfidence: 170 },
    { period: 'Aug 26 (Med)', forecast: 165, lowerConfidence: 150, upperConfidence: 180 },
    { period: 'Sep 26 (Med)', forecast: 172, lowerConfidence: 154, upperConfidence: 190 },
    { period: 'Oct 26 (Long)', forecast: 181, lowerConfidence: 158, upperConfidence: 204 },
    { period: 'Nov 26 (Long)', forecast: 190, lowerConfidence: 162, upperConfidence: 218 },
  ]
};

// 2. Scenario Simulation Engine Logic (Arithmetic model)
export function runScenarioSimulation(p: ScenarioParam): ScenarioSimulationResult {
  // Base values: Revenue: 1.245B USD, Volume: 145k TEU
  const baseRevenue = 1245; // Million USD
  const baseVolume = 145;   // Thousand TEU
  
  // Calculate impacts
  // Tariff rate increase increases revenue per TEU but severely drops volume if too high
  // Laffer Curve Peak at around 25% tariff rate.
  const tariffFactor = p.tariffRate / 20; // let 20% be reference rate
  
  // High tariffs drop container volume. (at 40%+ tariffs volume falls by 40%)
  const volumeDropFromTariff = Math.pow(p.tariffRate / 100, 1.5) * -45;
  
  // Policy Strength (ASYCUDA Automation) increases revenue recovery and increases volume efficiency
  const volumeBoostFromAutomation = (p.policyStrength - 50) * 0.3; // up to +15%
  
  // Border control: high restrictions reduce volumes but boost compliance/tariffs per unit slightly
  const borderVolumePenalty = (p.borderControl - 30) * -0.25; // restrictions shrink trade
  const borderCompliancePremium = (p.borderControl - 30) * 0.15; // less smuggling
  
  // Fuel cost: increases logistical costs and drops trade volumes
  const fuelCostPenalty = (p.fuelCostIndex - 50) * -0.2;
  
  // Corridor Capacity: boosts volumes
  const corridorVolumeBoost = (p.corridorCap - 50) * 0.4;
  
  // Calculated Changes
  const totalVolumeChangePct = volumeDropFromTariff + volumeBoostFromAutomation + borderVolumePenalty + fuelCostPenalty + corridorVolumeBoost;
  const finalVolume = Math.max(10, baseVolume * (1 + totalVolumeChangePct / 100));
  
  const revenuePerUnitFactor = tariffFactor * (1 + borderCompliancePremium / 100) * (1 + (p.policyStrength - 50) * 0.005);
  const finalRevenue = Math.max(50, baseRevenue * (finalVolume / baseVolume) * revenuePerUnitFactor);
  
  const totalRevenueChangePct = ((finalRevenue - baseRevenue) / baseRevenue) * 100;
  
  // Confidence score: based on how extreme parameters are (extreme params cause wide volatility)
  const extremeFactor = Math.abs(p.tariffRate - 20)/80 + Math.abs(p.policyStrength - 50)/50 + Math.abs(p.borderControl - 30)/70;
  const confidenceScore = Math.max(65.0, 96.5 - (extremeFactor * 8));
  
  let impactLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
  const rChangeAbs = Math.abs(totalRevenueChangePct);
  if (rChangeAbs > 25) {
    impactLevel = 'CRITICAL';
  } else if (rChangeAbs > 12) {
    impactLevel = 'HIGH';
  } else if (rChangeAbs > 5) {
    impactLevel = 'MEDIUM';
  }
  
  // Dynamic risks generator
  const risks: string[] = [];
  const kuRisks: string[] = [];
  const arRisks: string[] = [];
  
  if (p.tariffRate > 35) {
    risks.push("Excessive tariff rate risks triggering customs declaration spoofing, smuggling, or transit flight.");
    kuRisks.push("بەرزبوونەوەی زۆری تاریفە دەبێتە هۆی زیاتربوونی ساختەکردن لە دۆکۆمێنتەکان یان زۆربوونی قاچاخچێتی.");
    arRisks.push("تجاوز نسبة التعرفة للحد المعقول قد يشجع على عمليات تهريب السلع العابرة للحدود أو التحايل التجاري.");
  }
  if (p.borderControl > 70) {
    risks.push("Hyper-stringent border validation will lead to prolonged container clearance delays and logistics congestion.");
    kuRisks.push("قورسکردنی لەڕادەبەدەری ڕێکارەکانی مەرزەکان دەبێتە هۆی دروستبوونی قەرەباڵغی توند و ڕاگرتنی بارەکان.");
    arRisks.push("تشديد التفتيش البري المفرط يؤدي مباشرة إلى اختناقات مستديمة وارتفاع أجور الانتظار في المنافذ.");
  }
  if (p.fuelCostIndex > 80) {
    risks.push("High fuel surcharge premiums degrade dry canal transit corridor competitiveness for regional multi-modal routes.");
    kuRisks.push("بەرزبوونەوەی تێچووی سووتەمەنی زیانێکی گەورە لە توانای کێبڕکێی گواستنەوەی کەناڵی وشکاند دەدات.");
    arRisks.push("ارتفاع تضخم الوقود يقلل مباشرة من الميزة التنافسية لممر القناة الجافة البري بالمقارنة الإقليمية.");
  }
  if (p.policyStrength < 30) {
    risks.push("Weak digital policy compliance will trigger higher tax leakage and untracked shadow shipments.");
    kuRisks.push("لاوازی چاودێری گومرگی ئەلیکترۆنی دەبێتە هۆی دزەکردنی زیاتری سەرانە و باجی کۆکراوە.");
    arRisks.push("ضعف مستويات الأتمتة يشجع زيادة التهرب الضريبي وشحنات الظل غير الموثقة.");
  }
  
  if (risks.length === 0) {
    risks.push("Market is stable. Small fluctuations fall within standard volatility expectations.");
    kuRisks.push("بازاڕ جێگیرە. گۆڕانکارییە بچووکەکان کێشە دروست ناکەن و لە کۆنتڕۆڵدان.");
    arRisks.push("الاستقرار التجاري مثالي. تقع التقلبات البسيطة ضمن الهوامش الطبيعية المقبولة.");
  }
  
  return {
    predictedRevenue: finalRevenue,
    revenueChangePct: totalRevenueChangePct,
    predictedVolume: finalVolume,
    volumeChangePct: totalVolumeChangePct,
    confidenceScore,
    impactLevel,
    risks,
    kuRisks,
    arRisks
  };
}

// 6. Executive Decision Support template generator
export function generateExecutiveReport(result: ScenarioSimulationResult, originalParams: ScenarioParam): ExecutiveReport {
  const revDiffSymbol = result.revenueChangePct >= 0 ? '+' : '';
  const volDiffSymbol = result.volumeChangePct >= 0 ? '+' : '';
  
  const formatNum = (v: number) => v.toFixed(2);
  
  // Kurdish Version Document
  const kuSummary = `دوای ئەنجامدانی لێکۆڵینەوە بۆ پێشبینی گۆڕانکاری لە سیاسەتی ئابووری بازرگانی نیشتمانی عێراق، دیاریکردنی تاریفە بە ڕێژەی ${originalParams.tariffRate}%، و ئاستی پشکنینی ڕێکارە مەرزییەکان بە ${originalParams.borderControl}%، دەستنیشانکرا کە گۆڕانکارییەکە تێچووی کۆکراوەی گومرگ بە ڕێژەی ${revDiffSymbol}${formatNum(result.revenueChangePct)}% دەگۆڕێت (پێشبینیکراو: $${formatNum(result.predictedRevenue)} ملیۆن دۆلار). کۆی فۆڕمی نوێی جوڵەی بار پێویستی بە سەرپەرشتی دەستبەجێ هەیە بۆ گۆڕینی هاوسەنگی جێگیر.` ;
  
  const kuFindings = [
    `گۆڕانکاری لە داهاتی گومرگی پێشبینیکراو دەگاتە $${formatNum(result.predictedRevenue)} ملیۆن دۆلار لە مانگێکدا (ڕێژە: ${revDiffSymbol}${formatNum(result.revenueChangePct)}%).`,
    `توانای گشتی بار لە بەندەرەکان دەگاتە $${formatNum(result.predictedVolume)} هەزار TEU (ڕێژە: ${volDiffSymbol}${formatNum(result.volumeChangePct)}%).`,
    `پلەی متمانەی مۆدێلی زانیاری پێشبینیکراو بە ڕێژەی ${formatNum(result.confidenceScore)}% دادەنرێت لە ژێر چاودێری ئەلیکترۆنی.`
  ];
  
  const kuRisks = result.kuRisks;
  const kuOpps = [
    originalParams.policyStrength > 60 ? "ئۆتۆماتیککردنی پێشکەوتوو دەبێتە هۆی کەمبوونەوەی دابڕانی بار و زیاتربوونی شەفافیەت بە ڕێژەی ١٥٪." : "بەهێزکردنی خزمەتگوزارییە مەرزییەکان لایەنە زیانەخۆرەکان پڕدەکاتەوە.",
    "هاوچەرخکردنی دەروازە بازرگانییەکان عێراق دەکاتە چەقێکی گرنگی گواستنەوەی ناوچەیی."
  ];
  
  const kuRecs = [
    "ئەنجامدانی پشکنینی چڕ لەلایەن سەرکردایەتی گومرگی فیدراڵی عێراق.",
    "پەسەندکردنی فەرمی پێش جێبەجێکردنی هەر تاریفەیەکی نوێ بۆ پاراستنی هاوسەنگی بازاڕ.",
    "کارکردنی زیاتر لەسەر هاوتاکردنی پێوەرەکان لە سەرجەم فەرمانگە گومرگییەکان بۆ کەمکردنەوەی جیاوازی نرخ."
  ];

  // Arabic Version Document
  const arSummary = `بناءً على النمذجة الرياضية للقرار الاقتصادي والواردات الجمركية لجمهورية العراق، عند تعيين تعرفة بنسبة ${originalParams.tariffRate}% وتشديد الضوابط في المنافذ الحدودية بمعدل ${originalParams.borderControl}%، يُتوقع تغير الإيرادات بنسبة ${revDiffSymbol}${formatNum(result.revenueChangePct)}٪ لتصل إلى قيمة تقديرية $${formatNum(result.predictedRevenue)} مليون دولار شهرياً. يتطلب هذا التوجه موازنة سيادية للتحكم بمستويات التبادل التجاري وتلافي حدوث ركود لوجستي.`;
  
  const arFindings = [
    `الإيرادات الجمركية الشهرية المتوقعة تقدر بقيمة $${formatNum(result.predictedRevenue)} مليون دولار (بنسبة تغير ${revDiffSymbol}${formatNum(result.revenueChangePct)}٪).`,
    `مستويات وحجم حركة التدفق التجاري تقدر بـ $${formatNum(result.predictedVolume)} ألف حاوية مكافئة (بنسبة تغير ${volDiffSymbol}${formatNum(result.volumeChangePct)}٪).`,
    `درجة الموثوقية التوقعية للمحاكاة الرياضية تبلغ ${formatNum(result.confidenceScore)}٪ مع الأخذ بالاعتبار القيود السيادية الحالية.`
  ];
  const arRisks = result.arRisks;
  const arOpps = [
    originalParams.policyStrength > 60 ? "زيادة مستويات الأتمتة ترفع من الشفافية المالية وتحد من تسرب الإيرادات بنسبة ١٥٪." : "توسيع الخدمات الجمركية الموحدة يعوض الخسائر في منافذ المحافظات.",
    "موقع القناة الجافة يؤهل جمهورية العراق ليكون مركز العبور والاتصال والتجارة الرابط لدول الخليج والاتحاد الأوروبي."
  ];
  const arRecs = [
    "رفع التوصيات للجنة العليا للشؤون الاقتصادية في مجلس الوزراء للمصادقة.",
    "تفويض مدراء جمارك البصرة والمنافذ البرية للعمل بنظام النوافذ الجمركية كخيار تسيير مؤقت.",
    "توحيد آليات التخمين والتعرفة الجمركية بين المركز الإتحادي وحكومة إقليم كردستان لدرء تشتت الواردات."
  ];

  return {
    executive_summary: kuSummary, // fallback
    kuExecutive_summary: kuSummary,
    arExecutive_summary: arSummary,
    
    key_findings: kuFindings,
    kuKey_findings: kuFindings,
    arKey_findings: arFindings,
    
    risks: kuRisks,
    kuRisks,
    arRisks,
    
    opportunities: kuOpps,
    kuOpportunities: kuOpps,
    arOpportunities: arOpps,
    
    recommendations: kuRecs,
    kuRecommendations: kuRecs,
    arRecommendations: arRecs,
    
    confidence_level: `${formatNum(result.confidenceScore)}%`
  };
}
