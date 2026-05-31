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
  Lock
} from "lucide-react";

// Types for the Presentation Simulator
interface DemoStep {
  phase: "PROBLEM" | "AI_ANALYSIS" | "VALIDATION" | "SUPPORT" | "OUTCOME";
  titleKu: string;
  titleAr: string;
  descKu: string;
  descAr: string;
  badgeKu: string;
  badgeAr: string;
}

interface DemoScenario {
  id: string;
  titleKu: string;
  titleAr: string;
  subtitleKu: string;
  subtitleAr: string;
  steps: DemoStep[];
}

export function GovernmentShowcase() {
  const { lang } = useSettingsStore();
  const [activeScenarioIdx, setActiveScenarioIdx] = useState<number>(0);
  const [activeStepIdx, setActiveStepIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(5);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Government Scenarios Structured according to standard SOP
  const scenarios: DemoScenario[] = [
    {
      id: "scen_1",
      titleKu: "هاوردەکردنی کۆمپیوتەر و تەکنەلۆژیا",
      titleAr: "معاملة استيراد الحواسب والأجهزة التقنية",
      subtitleKu: "چۆنیەتی هەڵسەنگاندن و پۆلێنکردنی دۆسیە گومرگییەکان بە ژیری دەستکرد",
      subtitleAr: "أتمتة الفرز والترميز الذكي للتعرفة الجمركية والضرائب",
      steps: [
        {
          phase: "PROBLEM",
          titleKu: "کێشەی دیاریکراو: دواکەوتنی پۆلێنکردن",
          titleAr: "المشكلة: تراكم البيانات وتأخر التصنيف الجمركي",
          descKu: "هاوردەکار بڕێکی گەورە لە کۆمپیوتەری هەمەجۆر پێشکەش دەکات. ڕێکارە کۆنەکان پێویستیان بە چەند ڕۆژێک دەبێت بۆ پۆلێنکردن بەپێی کۆدی HS و دیاریکردنی تاریفە.",
          descAr: "يقوم المستورد بتقديم بيان شحنة حواسب محمولة هجينة. المعالجة التقليدية تتطلب مراجعة بشرية مطولة لتحديد رمز الـ HS المناسب ونسبة الرسوم الحمائية والتعرفة المعقدة.",
          badgeKu: "بەستانکاری دواکەوتوو",
          badgeAr: "عائق إداري"
        },
        {
          phase: "AI_ANALYSIS",
          titleKu: "شیکردنەوەی هۆشمەند: پۆلێنکردنی خۆکار بە کۆدی HS",
          titleAr: "التحليل الذكي: ترميز تلقائي دقيق بثرواث الذكاء الاصطناعي",
          descKu: "مۆدێلی ژیری دەستکرد شیکردنەوەی تەواوی تایبەتمەندییەکان دەکات و کۆدی فەرمی (8471.30.00) دیاری دەکات. بەمەش ڕێژەی تاریفە بە %٥ و باجی گشتی دیاری دەکرێت بە متمانەی %٩٩.",
          descAr: "يتدخل النموذج الذكي الوطني لتحليل مواصفات الأجهزة وتصنيفها تحت الرمز الدولي الفيدرالي (8471.30.00). يتم تعيين الرسوم بنسبة ٥٪ وضريبة المبيعات المقررة بدقة متناهية وثقة تبلغ ٩٩٪.",
          badgeKu: "شیکردنەوەی هۆشمەند چالاکە",
          badgeAr: "تحليل ذكي فوري"
        },
        {
          phase: "VALIDATION",
          titleKu: "پشتڕاستکردنەوەی حکومی: پشکنینی ڕێساکان بە فلتەری نیشتمانی",
          titleAr: "التدقيق الحكومي: فحص المطابقة والتحقق من التراخيص",
          descKu: "سیستەمەکە بە شێوەیەکی خۆکار پشکنینی مۆڵەتەکانی دەستەی پەیوەندییەکان و مەرجەکانی هاوردە دەکات. هیچ کێشەیەکی ئەمنی یان قەدەغەکراو لە لیستەکانی دەوڵەتدا بەدی ناکرێت.",
          descAr: "تجابه الشحنة مع قواعد بيانات هيئة الإعلام والاتصالات للتأكد من مطابقة الأجهزة لمواصفات البث الفيدرالية ولائحة الاستيراد الرسمية المعاصرة. يتم التحقق من سلامة الأوراق سيادياً.",
          badgeKu: "پەسەندکراوی نیشتمانی",
          badgeAr: "موافق للتعليمات"
        },
        {
          phase: "SUPPORT",
          titleKu: "یارمەتیدانی بڕیاردان: پێشکەشکردنی بڕیاری ئاسان",
          titleAr: "دعم القرار: التوجيه السيادي للمنفذ الجمركي",
          descKu: "ئامادەکردنی مانیفێست بە تەواوی ئۆتۆماتیکی و خەمڵاندنی تێچووی کۆتایی گومرگ (٤،٥٠٠ دۆلاری فیدراڵی) کەمتر لە خولەکێکدا، لەگەڵ ناردنی ئاگادارکردنەوەی ڕاستەوخۆ بۆ بەڕێوەبەری مەرزەکە لە زاخۆ.",
          descAr: "توجيه إلكتروني فوري لإصدار إذن التسليم والرسوم الكلية البالغة (٤،٥٠٠ دولار فيدرالي) وتأكيد المسار الأخضر السريع مع إخطار شاشات اتخاذ القرار لدى المديرية العامة والمنفذ.",
          badgeKu: "شیکاری هۆشمەندی فەرماندە",
          badgeAr: "دعم القرار السيادي"
        },
        {
          phase: "OUTCOME",
          titleKu: "ئەنجامی فەرمی: بارەکەت بە سەلامەتی ڕێگەی پێدرا",
          titleAr: "المخرج والنتيجة: الإفراج الجمركي الآمن والسريع",
          descKu: "ئەنجام: ماوەی پێداچوونەوە کەمکرایەوە لە ٣ ڕۆژەوە بۆ ٣٢ خولەک! گواستنەوەی پارێزراو بۆ شارەکانی ناوخۆ بە چاودێری ڕێچکەی ژیری دەستکردی سیستەم.",
          descAr: "تحقيق الإفراج الجمركي الموثق في غضون ٣٢ دقيقة بدلاً من ٣ أيام! تحصيل الإيرادات المالية مباشرة إلى حساب البنك المركزي العراقي مع تتبع الشحنة لوجستياً لضمان الأمن.",
          badgeKu: "کارەکە جێبەجێبوو",
          badgeAr: "عملية ناجحة ومؤمنة"
        }
      ]
    },
    {
      id: "scen_2",
      titleKu: "وردبینی و پاراستنی پابەندبوونی نیشتمانی",
      titleAr: "مكافحة غسيل الأموال وضبط المعاملات المالية",
      subtitleKu: "چۆنیەتی دەستنیشانکردنی پێشێلکاری تاریفەی گومرگی و گواستنەوەی گوماناوی دراو",
      subtitleAr: "كشف التباينات الفينانسية لحماية الهيكل الاقتصادي العراقي",
      steps: [
        {
          phase: "PROBLEM",
          titleKu: "کێشەی دیاریکراو: مەترسی ساختەکاری هاوردە",
          titleAr: "المشكلة: تقديم فواتير متضخمة لتهريب العملة الصعبة",
          descKu: "بانکی ناوەندی داواکاری پێشکەش دەکات بۆ شیکردنەوەی شێوازی کڕین بە بەهای ١.٢ ملیۆن دۆلار بۆ کەرەستەی بیناسازی بە فاکتۆرێکی زۆر بەرز کە لەگەڵ نرخی سادەی بازاڕ ناگونجێت.",
          descAr: "تلقي معاملة تحويل مالي ضخمة بقيمة ١.٢ مليون دولار مخصصة لاستيراد مواد إنشائية بأسعار مبالغ فيها مقارنة بالمعدل الحقيقي في السوق بهدف تمرير أموال حكومية بطرق ملتوية.",
          badgeKu: "ئاگاداری مەترسی توند",
          badgeAr: "مؤشر خطر حاد"
        },
        {
          phase: "AI_ANALYSIS",
          titleKu: "شیکردنەوەی هۆشمەند: دەستنیشانکردنی ساختەکاری فاکتۆر",
          titleAr: "التحليل الذكي: كشف الانحراف ومقارنة الأسعار التاريخية",
          descKu: "سیستەمی ژیری نیشتمانی فاکتۆرەکە لەگەڵ داتای مێژوویی سەرانسەری عێراق بەراورد دەکات و دەبینێت نرخەکە بە رێژەی %١٨٠ هێندەی نرخی ئاساییە، هەروەها گومان لە گرێبەستەکە دروست دەکات.",
          descAr: "يطابق النظام الذكي أسعار الفواتير مع قاعدة البيانات التاريخية لجميع المنافذ والأسعار الإقليمية. يكشف التحليل انحرافاً سعرياً بنسبة ١٨٠٪، ويضع إشارة تنبيه حول مطابقة المصدر.",
          badgeKu: "ژیری دەستکار هەڵسەنگاندی کرد",
          badgeAr: "تقييم ذكي فوري"
        },
        {
          phase: "VALIDATION",
          titleKu: "پشتڕاستکردنەوەی حکومی: دابینکردنی کۆدی یاسایی پێشێلکاری",
          titleAr: "التدقيق الحكومي: حصر المواد بموجب قانون البنك المركزي",
          descKu: "بە کارهێنانی نەخشەی زانیاری، داتای داواکراو پەیوەست دەکرێت بە پێشێلکردنی یاسای ژمارە (٥٦)ی ساڵی ٢٠٠٤ی بانکی ناوەندی بۆ دیاریکردنی جۆری پارەدارکردنی گوماناوی.",
          descAr: "يقوم محرك البحث التلقائي بالربط الفوري مع المادة القانونية (٥٦) لقانون البنك المركزي العراقي لعام ٢٠٠٤ المعني بغسيل الأموال وتهريب رأس المال الخارجي وتصنيف العقد قانونياً.",
          badgeKu: "یاسای نیشتمانی هاوتاکرا",
          badgeAr: "تكييف قانوني سيادي"
        },
        {
          phase: "SUPPORT",
          titleKu: "یارمەتیدانی بڕیاردان: پێشنیارکردنی بڕیاری بلۆککردن",
          titleAr: "دعم القرار: رصد مسار التحصيل وتوجيه المفتش العام",
          descKu: "ژیری دەستکرد پێشنیار دەکات بۆ بەڕێوەبەرایەتی گشتی وەک بلۆککردنی کاتی بەیاننامەی گومرگی بە شێوەیەکی ئۆتۆماتیکی و ناردنی ڕاپۆرتی پێشێلکاری بۆ فەرمانگەی چاودێری دارایی.",
          descAr: "توليد توصية سيادية آلية تظهر على شاشات البنك المركزي لإيقاف تحويل العملة مؤقتاً، وتوجيه دائرة المفتش العام للمنفذ ومفرزة النزاهة لإخضاع المستورد لتدقيق ميداني حدي.",
          badgeKu: "ڕاسپاردەی بەڕێوەبردنی خێرا",
          badgeAr: "إجراء تصحيحي مباشر"
        },
        {
          phase: "OUTCOME",
          titleKu: "ئەنجامی فەرمی: پاراستنی سەروەت و سامانی نیشتمانی",
          titleAr: "المخرج والنتيجة: حظر التحويل المالي وإفشال التهرب",
          descKu: "ئەنجام: بلۆککردنی ١.٢ ملیۆن دۆلاری ساختە لە ماوەی تەنها ١٢ خولەک بەبێ دواخستنی کات، سەرکەوتن لە پاراستنی ئاسایشی ئابووری و داهاتی گشتی عێراق.",
          descAr: "النتيجة: إيقاف وإفشال تهريب ١.٢ مليون دولار خارج الحسابات الرسمية الوطنية في ١٢ دقيقة فقط! تعزيز الثقة والشفافية في الحوكمة وحماية الاحتياطي المالي السيادي وعملته.",
          badgeKu: "دەستکەوتی نیشتمانی",
          badgeAr: "أمن مالي جمركي تام"
        }
      ]
    },
    {
      id: "scen_3",
      titleKu: "مێشکی نیشتمانی بۆ زانیاری و بەڵگەکان",
      titleAr: "قاعدة المعرفة السيادية والقرارات الحكومية",
      subtitleKu: "ئەرشیفکردنی ڕێساکان و دەرهێنانی چەمکە یاساییەکان لە کاتی گۆڕینی تاریفەکان",
      subtitleAr: "محرك البحث والربط المعرفي بين القوانين ورموز السلع",
      steps: [
        {
          phase: "PROBLEM",
          titleKu: "کێشەی دیاریکراو: ناڕوونی ڕێنمایی گومرگی",
          titleAr: "المشكلة: شائكة وتضارب تفاسير نصوص قوانين التعرفة",
          descKu: "وەزارەتی دارایی پێویستی بە وردبینی یاسایی بەپەلە هەیە لەسەر هاوردەکردنی ئۆتۆمبێلی جۆراوجۆر (هایبرید). ململانێ و لێکدانەوەی نادروست لە نێوان پێناسەی کۆن و نوێی یاساکاندا ڕوودەدات.",
          descAr: "الحاجة العاجلة لوزارة المالية وهيئة الجمارك لتفسير نص جمركي حول إعفاءات السيارات الهجينة الصديقة للبيئة وسط تداخل وتضارب القرارات والتعليمات الوزارية الصادرة.",
          badgeKu: "تێکچوونی ڕێسا یاساییەکان",
          badgeAr: "تضارب نصوص تشريعية"
        },
        {
          phase: "AI_ANALYSIS",
          titleKu: "شیکردنەوەی هۆشمەند: شیکاری دەستە یاساییەکان بێ دواکەوتن",
          titleAr: "التحليل الذكي: استخلاص الأسانيد التشريعية والقرارات",
          descKu: "مێشکی نیشتمانی کورتەیەک ئامادە دەکات لە ڕێنماییە فەرمییەکان، دەبینێت لە ساڵی ٢٠٢٥ بڕیارێکی تایبەت هەڵگری مافی لێخۆشبوونی مۆتۆڕە تەکنەلۆژییەکان دەرچووە بە گەرەنتی ڕوون.",
          descAr: "يتصفح الدماغ المعرفي السياسي الذكي آلاف القوانين والمراسيم السابقة، ويستخلص القرار رقم ١٢ الصادر في مطلع ٢٠٢٥ المؤكد لتخفيض الرسوم بنسبة ٥٠٪ للسيارات بمحرك هجين.",
          badgeKu: "گەڕانی سیستماتیکی تەواوکرا",
          badgeAr: "مستخلص معرفي مكتمل"
        },
        {
          phase: "VALIDATION",
          titleKu: "پشتڕاستکردنەوەی حکومی: بەراوردکردن لەگەڵ گرێبەستی نێودەوڵەتی",
          titleAr: "التدقيق الحكومي: توثيق مصداقية المصادر وأرقام المراسيم",
          descKu: "سیستەمەکە بە خێرایی کۆنووس و ڕێککەوتتنامە فەرمییەکان بەراورد دەکات لەگەڵ بڕیاری نوێ تا گەرەنتییەکی تەواو بدات کە گۆڕانکارییەکە هاوتایە لەگەڵ پێوەرەکانی تەندروستی گشتی و گەشەی نیشتمانی عێراق.",
          descAr: "مطابقة القرار الذكي مع مستند وقصاصة الجريدة الرسمية (الوقائع العراقية) للتأكد من المادة والفقرة القانونية النافذة. يتم إرفاق المستند المعتمد مع الشحنات تلقائياً.",
          badgeKu: "یاسایی و گونجاوە",
          badgeAr: "موثق بالجريدة الرسمية"
        },
        {
          phase: "SUPPORT",
          titleKu: "یارمەتیدانی بڕیاردان: فەرمانی لێخۆشبوون و داڕشتنی گشتی",
          titleAr: "دعم القرار: إتاحة أوزان الثقة التشريعية للمجلس",
          descKu: "سیستەم قەبارەی ڕێژەی متمانە بە ٩٨.٦٪ پێشکەش دەکات و پێشنیاری نووسینی نووسراوێک دەکات لە داراییەوە بۆ ئەنجوومەنی وەزیران بۆ ڕوونکردنەوەی فەرمی لێخۆشبوون لە گومرگی هەمەجۆر.",
          descAr: "إجراء توصية شاملة مجهزة للأمانة العامة لمجلس الوزراء تؤكد نسبة ثقة تدقيق تشريعي بنسبة ٩٨.٦٪ وتصميم مسودة قرار إرشادية موحدة لكافة المنافذ تذلل العقبات للمديرين.",
          badgeKu: "متمانەی شیکاری یاسایی بەرز",
          badgeAr: "أخصائي تشريعي متكامل"
        },
        {
          phase: "OUTCOME",
          titleKu: "ئەنجامی فەرمی: نه‌هێشتنی ناڕوونی و ڕێکاری دادپەروەرانە",
          titleAr: "المخرج والنتيجة: حسم الخلاف وتسهيل المعاملات التجارية",
          descKu: "ئەنجام: چارەسەرکردنی تەواوی ناکۆکییەکان لە کەمتر لە ٥ خولەک بەبێ دەستکاریکردنی مەرزەکان. هاوردەکردنی ئۆتۆمبێلی سەوز بە ئاسانی و دادپەروەری ڕێگەی پێدرا.",
          descAr: "النتيجة: تسوية الأزمة وحسم النزاع خلال دقائق من الاستعلام التشريعي بدلاً من أشهر مكاتبات حكومية وتسهيل دخول السلع الصديقة للبيئة وتوفير ملايين الدنانير من الهدر.",
          badgeKu: "چالاکی سەرکەوتوو بە تەواوی",
          badgeAr: "مخرج جمركي منضبط"
        }
      ]
    },
    {
      id: "scen_4",
      titleKu: "بنکەی فەرماندەیی نیشتمانی جێبەجێکار",
      titleAr: "مركز القيادة الوطني والتحليلات الكبرى",
      subtitleKu: "داڕشتنی دیمەنی گشتی چاودێری بازرگانی، تاریفە نوێکان و پێشاندانی جووڵەی دەروازە گومرگییەکان",
      subtitleAr: "محاكاة السياسات وتدشين المراقبة المستمرة للأمن الاقتصادي",
      steps: [
        {
          phase: "PROBLEM",
          titleKu: "کێشەی دیاریکراو: نەبوونی بینینی سەرانسەری هاوکات",
          titleAr: "المشكلة: غياب شاشات معلومات موحدة لصناع القرار والوزراء",
          descKu: "پیشتر وەزیران یان بەڕێوەبەران داتایەکی یەکگرتوویان بۆ بڕیاردان لەبەردەستدا نەبوو، کێشەکانی مەرزەکان و جووڵەی گشتی ئاڵوگۆڕ بە باشی نەدەبیندرا.",
          descAr: "يعاني المسؤول الرئيسي في الوزارة أو المديرية الجمركية من فجوة رؤية البيانات اللحظية للمنافذ وحجم الصادرات والواردات، ممّا يعطل اتخاذ القرارات في الأزمات وحالات الفوات المخاطر.",
          badgeKu: "نەبوونی داتا خۆماڵییەکان",
          badgeAr: "فجوة بيانات مؤقتة"
        },
        {
          phase: "AI_ANALYSIS",
          titleKu: "شیکردنەوەی هۆشمەند: شیکاری هەموو مەرزەکان بە یەک مێشک",
          titleAr: "التحليل الذكي: نموذج ذكاء سيادي شامل يفوق التشتت",
          descKu: "سیستەمی ژیری بە کۆکردنەوەی خۆکارانەی تێکڕای مانیفێست، داهاتی سەرانسەری عێراق نیشان دەدات. دەروازە گشتییەکان دەخاتە ژێر کۆنترۆڵی ڕێژەی متمانەی گەورە.",
          descAr: "يقوم النموذج الذكي بحساب كل مؤشرات المنافذ، من حركات الملاحة والتحويلات المالية الموازية والسيولة والجمارك، وصياغة خريطة حرارية تفاعلية موحدة تعطي دقة رؤية وافية.",
          badgeKu: "سیستەمی ئەکتیڤ ڕێکخرا",
          badgeAr: "تحصيل معلومات شامل"
        },
        {
          phase: "VALIDATION",
          titleKu: "پشتڕاستکردنەوەی حکومی: چاودێری فەرمی ئاستەکانی پابەندبوون",
          titleAr: "التدقيق الحكومي: الربط اللامركزي وتحديث المؤشرات",
          descKu: "دڵنیابوونەوەی نیشتمانی لە ڕاستی ئامارەکان بەپێی ستانداردەکانی تەکنەلۆژیا و گومرگی عێراقی فیدراڵ، بە دوور لە هەر کێشە و ساختەکارییەک لە داتاکاندا بەڕێکخراوی.",
          descAr: "مطابقة القياس الجمركي مع الأرباح والخزينة الفيدرالية لوزير المالية. يضمن النظام موثوقية الأرقام ومطابقتها للمعايير والاتفاقات السيادية الرسمية بدون أدنى تجاوز أو تغاضي.",
          badgeKu: "دڵنیابوونەوەی ستانداردی دەوڵەت",
          badgeAr: "تكامل الأنظمة السيادية"
        },
        {
          phase: "SUPPORT",
          titleKu: "یارمەتیدانی بڕیاردان: داڕشتنی ڕاپۆرت و بژاردەکانی داهاتوو",
          titleAr: "دعم القرار: تحذيرات مبكرة لتفادي خسائر تجارية",
          descKu: "ژیری دەستکردی نیشتمانی ڕاپۆرتی لێخۆشبوون و پێشنیاری نوێی ڕێچکەی سەوز بنچینە دەکات و ئەگەری دروستبوونی قۆناغی قەرەباڵغی لە بوارەکاندا پێشتر پێشبینی دەکات.",
          descAr: "تثبيت شاشات اتخاذ القرار الفورية لتفادي أزمات المنافذ واقتراح حلول ذكية كالقوافل التبادلية أو تشغيل تتبع الشاحنات الجغرافي بالأقمار الاصطناعية لضمان الإيصال السليم.",
          badgeKu: "پشکنینی ئاستی ژیری دەوڵەت",
          badgeAr: "توجيه سياسي استباقي"
        },
        {
          phase: "OUTCOME",
          titleKu: "ئەنجامی فەرمی: سەقامگیری ئابووری و سەلامەتی گشتی",
          titleAr: "المخرج والنتيجة: حوكمة وطنية رقمية شاملة فائقة الأداء",
          descKu: "ئەنجام: دروستکردنی بنکەی فەرماندەیی فەرمی گومرگی بە توانای گەورە، کە متمانەی تەواو بە حکومەت و بڕیاردەدەران دەبەخشێت بۆ گەشەسەندنی ئابووری عێراقی هاوچەرخ.",
          descAr: "النتيجة: تدشين أول مركز عمليات وطني رقمي سيادي جمركي عراقي يتيح للوزراء السيطرة اللحظية وتوفير الهدر المالي ورفع الثقة بالاقتصاد بمعدلات قياسية في منطقة الشرق الأوسط.",
          badgeKu: "چارەسەری نیشتمانی سەپێنرا",
          badgeAr: "نهضة اقتصادية مستدامة"
        }
      ]
    }
  ];

  // Auto Presentation Play/Pause Chronometer engine
  const currentScenario = scenarios[activeScenarioIdx];
  const currentStep = currentScenario.steps[activeStepIdx];

  const totalScenarios = scenarios.length;
  const totalSteps = currentScenario.steps.length;

  useEffect(() => {
    if (isPlaying && hasStarted) {
      setCountdown(5);
      timerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            // Progression logic
            handleNextProgress();
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
  }, [isPlaying, activeScenarioIdx, activeStepIdx, hasStarted]);

  const handleNextProgress = () => {
    if (activeStepIdx < totalSteps - 1) {
      setActiveStepIdx((prev) => prev + 1);
    } else {
      // Advance scenario
      if (activeScenarioIdx < totalScenarios - 1) {
        setActiveScenarioIdx((prev) => prev + 1);
        setActiveStepIdx(0);
      } else {
        // Wrap around restart
        setActiveScenarioIdx(0);
        setActiveStepIdx(0);
      }
    }
  };

  const handlePrevProgress = () => {
    if (activeStepIdx > 0) {
      setActiveStepIdx((prev) => prev - 1);
    } else {
      if (activeScenarioIdx > 0) {
        setActiveScenarioIdx((prev) => prev - 1);
        setActiveStepIdx(scenarios[activeScenarioIdx - 1].steps.length - 1);
      }
    }
  };

  const startDemo = () => {
    setHasStarted(true);
    setIsPlaying(true);
    setActiveScenarioIdx(0);
    setActiveStepIdx(0);
  };

  const pauseDemo = () => {
    setIsPlaying(false);
  };

  const resumeDemo = () => {
    setIsPlaying(true);
  };

  const nextScenario = () => {
    if (activeScenarioIdx < totalScenarios - 1) {
      setActiveScenarioIdx((prev) => prev + 1);
      setActiveStepIdx(0);
    }
  };

  const prevScenario = () => {
    if (activeScenarioIdx > 0) {
      setActiveScenarioIdx((prev) => prev - 1);
      setActiveStepIdx(0);
    }
  };

  const restartDemo = () => {
    setActiveScenarioIdx(0);
    setActiveStepIdx(0);
    setCountdown(5);
    setIsPlaying(true);
  };

  // Human Readable estimated remaining time for Ministers
  const remainingSteps = 
    (totalScenarios - activeScenarioIdx - 1) * totalSteps + 
    (totalSteps - activeStepIdx - 1);
  const remainingTimeEst = remainingSteps * 5; // 5 seconds per step

  return (
    <div className="w-full h-full flex flex-col gap-6 font-sans text-slate-900 pb-20 select-text">
      
      {/* 1. Sovereign Header Landing & Platform Overview */}
      {!hasStarted ? (
        <div className="bg-gradient-to-br from-[#071739] to-slate-900 text-white rounded-[32px] p-6 md:p-10 border border-white/10 shadow-xl flex flex-col gap-8 relative overflow-hidden">
          
          {/* Subtle design accents */}
          <div className="absolute right-0 top-0 w-80 h-80 bg-[#0066FF]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute left-0 bottom-0 w-60 h-60 bg-violet-600/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10 border-b border-white/10 pb-6">
            <div className="space-y-2">
              <Badge className="bg-[#0066FF] hover:bg-[#0066FF] text-white px-3 py-1 text-[11px] font-bold rounded-xl tracking-wider uppercase select-none font-sans">
                {lang === "ku" ? "سەکۆی نمایشی دەوڵەت" : "المنتدى الوطني لعرض الأنظمة"}
              </Badge>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight leading-tight">
                {lang === "ku" ? "شۆڕومی سەرکردایەتی نیشتمانی عێراق" : "مجمع العرض والقيادة الوطني العراقي"}
              </h1>
              <p className="text-xs text-slate-350 max-w-2xl leading-relaxed">
                {lang === "ku" 
                  ? "بەخێربێن بۆ سەکۆی نمایشی فەرمی عێراقی هاوچەرخ. ئەم سەکۆیە دیزاین کراوە تا لە ماوەی کەمتر لە دە خولەک تەواوی توانای ئۆتۆماتیک پێوانەیی، بڕیاردان و ژیری دەستکردی نیشتمان بۆ بڕیاردەدەرانی باڵا بە شێوەیەکی کەم و کورت تاقی بکاتەوە."
                  : "مرحباً بكم في منصة العرض والتشغيل السيادي لجمهورية العراق الفيدرالية. تم تصميم هذا المعرض المبرمج لإظهار القيمة التشغيلية المحققة من الأتمتة الوطنية ومداولات الذكاء الاصطناعي وصناعة القرار المالي الجمركي خلال دقائق معدودة."}
              </p>
            </div>

            <Button
              onClick={startDemo}
              className="bg-[#0066FF] hover:bg-blue-600 text-white font-black text-xs px-6 py-6 rounded-2xl flex items-center gap-2.5 shadow-lg shadow-blue-500/25 shrink-0 transition cursor-pointer self-start md:self-auto"
            >
              <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
              <span>
                {lang === "ku" ? "دەستپێکردنی نیشاندانی نیشتمانی" : "بدء العرض والتشغيل الوطني"}
              </span>
            </Button>
          </div>

          {/* Core National Operational Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 relative z-10">
            {[
              {
                titleKu: "جووڵە فەعالەکان",
                titleAr: "الصفقات النشطة اليوم",
                val: "٤،٢٨٠",
                progress: "+12.4%",
                statusKu: "کاتی ڕاستەقینە",
                statusAr: "بث حي ومباشر",
                color: "text-blue-400"
              },
              {
                titleKu: "ڕێکارە گومرگییەکان",
                titleAr: "البيانات المنجزة اليوم",
                val: "٢،١٥٠",
                progress: "+8.2%",
                statusKu: "سەکۆی فیدراڵی",
                statusAr: "بوابات الهيئة",
                color: "text-emerald-400"
              },
              {
                titleKu: "شاخصی مەترسی نیشتمانی",
                titleAr: "مؤشر المخاطر للمنافذ",
                val: "%١٤",
                progress: "-3.5%",
                statusKu: "ئارام و سەقامگیر",
                statusAr: "حدود نظامية آمنة",
                color: "text-green-400"
              },
              {
                titleKu: "ڕێژەی پابەندبوون",
                titleAr: "نسبة الامتثال الكلية",
                val: "%٩٧.٤",
                progress: "+1.1%",
                statusKu: "ئاستی جێبەجێکردن",
                statusAr: "حوكمة نزيهة",
                color: "text-teal-400"
              },
              {
                titleKu: "متمانەی ژیری دەستکرد",
                titleAr: "ثقة النموذج الذكي الموحد",
                val: "%٩٨.٢",
                progress: "Stable",
                statusKu: "شیکاری گشتی",
                statusAr: "معالجة فورية سيادية",
                color: "text-violet-400"
              },
              {
                titleKu: "تەندروستی گشتی سیستم",
                titleAr: "سلامة وجودة نواة النظام",
                val: "%١٠٠",
                progress: "Optimal",
                statusKu: "بەردەست بە تەواوی",
                statusAr: "تشغيل آمن كامل",
                color: "text-blue-500"
              }
            ].map((kpi, idx) => (
              <div key={idx} className="bg-white/5 p-4 rounded-2xl border border-white/10 hover:border-white/20 transition flex flex-col justify-between">
                <span className="text-[10px] text-slate-400 font-bold block truncate">
                  {lang === "ku" ? kpi.titleKu : kpi.titleAr}
                </span>
                <div className="flex items-baseline justify-between mt-1.5">
                  <span className={`text-xl md:text-2xl font-black ${kpi.color} tracking-tight`}>
                    {kpi.val}
                  </span>
                  <span className="text-[9px] text-[#0066FF] bg-[#0066FF]/10 px-1 rounded-sm font-sans font-black">
                    {kpi.progress}
                  </span>
                </div>
                <span className="text-[9px] text-slate-350 mt-1 font-medium block">
                  ✓ {lang === "ku" ? kpi.statusKu : kpi.statusAr}
                </span>
              </div>
            ))}
          </div>

          {/* Informational Presentation Value proposition blocks */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 pt-4 border-t border-white/10">
            <div className="bg-white/2 p-4 rounded-2xl border border-white/5 space-y-2">
              <h4 className="text-xs font-bold text-blue-400 flex items-center gap-1.5 select-none">
                <Activity className="w-4 h-4" />
                {lang === "ku" ? "کۆنترۆڵکردنی دەوڵەتی مێژوویی" : "التكامل والسيطرة السيادية"}
              </h4>
              <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                {lang === "ku"
                  ? "سیستەمی فەرمی حکومەتی عێراق، کە پارێزراوی تەواوی دارایی و هاوردەکردنی بازاڕەکانی نیشتمانی نیشان دەدات لە ڕوانگەی داتا فەرمییەکانەوە بێ ساختەکاری."
                  : "أنظمة تدقيقية ومراقبة جغرافية ومعرفية تقدم لصانع القرار رؤية موحدة تدعم صياغة سياسات التعرفة وحفظ الائتمان العراقي."}
              </p>
            </div>
            
            <div className="bg-white/2 p-4 rounded-2xl border border-white/5 space-y-2">
              <h4 className="text-xs font-bold text-violet-400 flex items-center gap-1.5 select-none">
                <Sparkles className="w-4 h-4" />
                {lang === "ku" ? "پشکنینی دۆسیەی ئەمنی گومرگ" : "محركات الذكاء المعزز للجمارك"}
              </h4>
              <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                {lang === "ku"
                  ? "ئۆتۆماتیککردنی مۆڵەتەکان، ناسینەوەی تاریفەی گونجاوی کۆمپیوتەر و کاڵاکان بە کەمتر لە ٣٢ خولەک بە دڵنیایی ژیری دەستکردی سیستەم."
                  : "ترميز وفلترة الأوراق والتحليل التلقائي بتقدير متميز للـ HS Code والرسوم وتحديد الشحنات المتقاطعة جغرافياً في ثوان معدودة."}
              </p>
            </div>

            <div className="bg-white/2 p-4 rounded-2xl border border-white/5 space-y-2">
              <h4 className="text-xs font-bold text-teal-400 flex items-center gap-1.5 select-none">
                <Lock className="w-4 h-4" />
                {lang === "ku" ? "بەرنامەی پێشپێگرتنی گزل و ساختە" : "تأمين تدفق رأس المال الفيدرالي"}
              </h4>
              <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                {lang === "ku"
                  ? "داواکارییە پێناسەییە بلۆککراوەکان بە شێوازی یاسایی، پشکنین و بەراوردکردن لەگەڵ ڕێساکان بە لایەنی متمانە و پاراستنی گشتی داهاتەکان."
                  : "منع الانحرافات والتحويلات المالية المبالغ في تقييمها والتهرب تماشياً مع بنود المفتش التشريعي وقانون البنك المركزي."}
              </p>
            </div>
          </div>
          
        </div>
      ) : (
        /* 2. Interactive Guided Presentation Arena with Scenario Wizard and Presenter Deck */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* LEFT AREA: Presenter Control Deck & Scenario Navigation (4 grid columns) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Action Controller Dashboard (Military/Corporate Styling) */}
            <div className="bg-[#071739] text-white p-5 rounded-[24px] border border-white/10 shadow-lg flex flex-col gap-4">
              
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                  <span className="font-sans font-black text-xs uppercase tracking-wider text-slate-200">
                    {lang === "ku" ? "کۆنترۆڵی پێشکەشکار" : "لوحة تحكم العرض والتقديم"}
                  </span>
                </div>
                <Badge className="bg-[#0066FF] hover:bg-[#0066FF] text-white text-[9px] font-mono px-2 py-0.5">
                  BGW_CHRONO_1.8
                </Badge>
              </div>

              {/* Progress info of Presentation */}
              <div className="space-y-2 bg-white/5 p-3 rounded-xl border border-white/5 font-sans">
                <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold">
                  <span>{lang === "ku" ? "دیمه‌نی چالاک:" : "المشهد الحالي والمرحلة"}</span>
                  <span>{activeScenarioIdx + 1} / {totalScenarios}</span>
                </div>
                <h4 className="text-xs font-black truncate text-slate-100">
                  {lang === "ku" ? currentScenario.titleKu : currentScenario.titleAr}
                </h4>

                <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold mt-2">
                  <span>{lang === "ku" ? "پابەندبوونی هەنگاو:" : "إتمام خطوات السيناريو"}</span>
                  <span>{activeStepIdx + 1} / {totalSteps}</span>
                </div>
                {/* Horizontal Step Indicator bars */}
                <div className="flex gap-1.5 mt-1.5">
                  {currentScenario.steps.map((_, sidx) => (
                    <div
                      key={sidx}
                      className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                        sidx === activeStepIdx
                          ? "bg-[#0066FF] w-4"
                          : sidx < activeStepIdx
                          ? "bg-slate-400"
                          : "bg-white/10"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Precise play/pause next scenario presenter controls */}
              <div className="grid grid-cols-3 gap-2">
                <Button
                  onClick={prevScenario}
                  disabled={activeScenarioIdx === 0}
                  className="bg-white/5 hover:bg-white/10 text-white border border-white/15 text-[10px] py-1.5 rounded-xl cursor-not-allowed transition disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4 shrink-0" />
                  <span>{lang === "ku" ? "سەرەتا" : "السابق"}</span>
                </Button>

                {isPlaying ? (
                  <Button
                    onClick={pauseDemo}
                    className="bg-amber-500 hover:bg-amber-600 text-white text-[10px] py-1.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Pause className="w-4 h-4" />
                    <span>{lang === "ku" ? "ڕاگرتن" : "إيقاف مؤقت"}</span>
                  </Button>
                ) : (
                  <Button
                    onClick={resumeDemo}
                    className="bg-emerald-650 hover:bg-emerald-700 text-white text-[10px] py-1.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-1 border border-emerald-500/20"
                  >
                    <Play className="w-4 h-4" />
                    <span>{lang === "ku" ? "خستنەکار" : "استمرار"}</span>
                  </Button>
                )}

                <Button
                  onClick={nextScenario}
                  disabled={activeScenarioIdx === totalScenarios - 1}
                  className="bg-white/5 hover:bg-white/10 text-white border border-white/15 text-[10px] py-1.5 rounded-xl transition disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <span>{lang === "ku" ? "دواتر" : "التالي"}</span>
                  <ChevronRight className="w-4 h-4 shrink-0" />
                </Button>
              </div>

              {/* Sub step controller (Prev / Next Step inside active Scenario) */}
              <div className="grid grid-cols-3 gap-2 border-t border-white/10 pt-3">
                <Button
                  onClick={handlePrevProgress}
                  disabled={activeScenarioIdx === 0 && activeStepIdx === 0}
                  className="bg-transparent hover:bg-white/5 text-slate-300 text-[9px] py-1 rounded-lg transition disabled:opacity-35"
                >
                  {lang === "ku" ? "هەنگاوی پێشوو" : "خطوة سابقة"}
                </Button>

                <Button
                  onClick={restartDemo}
                  className="bg-transparent hover:bg-white/5 text-slate-300 text-[9px] py-1 rounded-lg transition flex items-center justify-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{lang === "ku" ? "سەرەتا" : "بدء من جديد"}</span>
                </Button>

                <Button
                  onClick={handleNextProgress}
                  className="bg-[#0066FF] hover:bg-blue-600 text-white text-[9px] py-1 rounded-lg transition"
                >
                  {lang === "ku" ? "هەنگاوی دواتر" : "خطوة تالية"}
                </Button>
              </div>

              {/* Auto Presentation Countdown metrics representation */}
              <div className="border-t border-white/10 pt-3 flex items-center justify-between text-[10px] text-slate-400 font-sans">
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{lang === "ku" ? "کات تا هەنگاوی دواتر:" : "الوقت المتبقي للخطوة:"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-100">{countdown} {lang === "ku" ? "چرکە" : "ثانية"}</span>
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping" />
                </div>
              </div>

              {/* Estimated Remaining Duration and system details */}
              <div className="flex justify-between items-center text-[9px] text-slate-400 pt-1">
                <span>{lang === "ku" ? "تەواوبوونی گشتی نزیکەی:" : "الوقت المقدر لإنهاء العرض:"}</span>
                <span className="font-bold text-white bg-slate-800 px-1.5 py-0.5 rounded">
                  {remainingTimeEst} {lang === "ku" ? "چرکە" : "ثانية"}
                </span>
              </div>

            </div>

            {/* Comprehensive Scenario selection sidebar cards */}
            <div className="flex flex-col gap-3 font-sans">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider px-2 block select-none">
                {lang === "ku" ? "سیناریۆ دانراوەکانی پێشاندانی فەرمی" : "قائمة سيناريوهات العرض والتحاكي المبرمجة"}
              </span>

              {scenarios.map((scen, idx) => {
                const isActiveScen = idx === activeScenarioIdx;
                return (
                  <button
                    key={scen.id}
                    onClick={() => {
                      setActiveScenarioIdx(idx);
                      setActiveStepIdx(0);
                    }}
                    className={`w-full text-right p-4 rounded-2xl border text-xs font-semibold select-none flex flex-col gap-1 transition-all cursor-pointer ${
                      isActiveScen
                        ? "bg-white dark:bg-[#1e293b] border-[#0066FF] shadow-xs text-[#0066FF] dark:text-white"
                        : "bg-slate-50 dark:bg-slate-850 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 w-full">
                      <span className="font-black text-[10px] text-slate-400">
                        {lang === "ku" ? `سیناریۆ ${idx + 1}` : `سيناريو ${idx + 1}`}
                      </span>
                      {isActiveScen && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0066FF]" />
                      )}
                    </div>
                    <span className="font-black text-[13px] tracking-tight mt-1 text-slate-900 dark:text-white">
                      {lang === "ku" ? scen.titleKu : scen.titleAr}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-sans font-medium line-clamp-1">
                      {lang === "ku" ? scen.subtitleKu : scen.subtitleAr}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Exit Demo Showroom to Return to Core Platform */}
            <Button
              onClick={() => {
                setHasStarted(false);
                setIsPlaying(false);
              }}
              className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-755 text-slate-700 dark:text-slate-200 border dark:border-slate-700 text-xs py-3 rounded-xl cursor-pointer transition flex items-center justify-center gap-1 font-bold"
            >
              {lang === "ku" ? "گەڕانەوە بۆ چاودێری نیشتمانی" : "الخروج والعودة للقناة الرئيسية"}
            </Button>

          </div>

          {/* RIGHT AREA: Interactive Scenario Briefing Wizard Panel (8 grid columns) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Visualizer Frame with Cinematic State Flow (Problem -> AI Analysis -> Gov Validation -> Decision -> Outcome) */}
            <div className="bg-white dark:bg-[#0f172a] rounded-[28px] border border-slate-200 dark:border-slate-800 shadow-md p-6 flex flex-col justify-between flex-1 relative overflow-hidden h-full max-w-full">
              
              <div className="absolute right-0 top-0 w-60 h-60 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute left-0 bottom-0 w-40 h-40 bg-violet-500/5 rounded-full blur-xl pointer-events-none" />

              <div>
                {/* Meta scenario description and Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div>
                    <span className="text-[10px] text-[#0066FF] font-black uppercase tracking-widest font-sans flex items-center gap-1.5 select-none">
                      <Compass className="w-4 h-4 text-[#0066FF]" />
                      {lang === "ku" ? "نمایشی سەکۆی نیشتمانی فەرمی" : "المشهد الحالي للعرض والتحاكي الوطني"}
                    </span>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1.5 tracking-tight">
                      {lang === "ku" ? currentScenario.titleKu : currentScenario.titleAr}
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      {lang === "ku" ? currentScenario.subtitleKu : currentScenario.subtitleAr}
                    </p>
                  </div>
                  <Badge className="bg-[#0066FF]/10 hover:bg-[#0066FF]/10 text-[#0066FF] border border-[#0066FF]/20 py-1.5 px-3 rounded-xl text-[10px] font-bold shrink-0 self-start sm:self-center">
                    {lang === "ku" ? currentStep.badgeKu : currentStep.badgeAr}
                  </Badge>
                </div>

                {/* State timeline of 5 key SOP components */}
                <div className="grid grid-cols-5 gap-2 mt-6 select-none">
                  {[
                    { phase: "PROBLEM", labelKu: "المشكلة", labelAr: "المشكلة", color: "bg-red-500/10 text-red-600 border-red-500/20" },
                    { phase: "AI_ANALYSIS", labelKu: "التحليل", labelAr: "التحليل الذكي", color: "bg-violet-500/10 text-violet-600 border-violet-500/20" },
                    { phase: "VALIDATION", labelKu: "التدقيق", labelAr: "التدقيق المالي", color: "bg-blue-500/10 text-[#0066FF] border-blue-500/20" },
                    { phase: "SUPPORT", labelKu: "القرار", labelAr: "دعم القرار", color: "bg-amber-500/10 text-amber-655 border-amber-500/20" },
                    { phase: "OUTCOME", labelKu: "النتيجة", labelAr: "النتيجة النهائية", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" }
                  ].map((it, idx) => {
                    const isActive = it.phase === currentStep.phase;
                    const isCompleted = idx < ["PROBLEM", "AI_ANALYSIS", "VALIDATION", "SUPPORT", "OUTCOME"].indexOf(currentStep.phase);
                    
                    return (
                      <div
                        key={it.phase}
                        className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1 ${
                          isActive
                            ? "bg-[#0066FF] text-white border-blue-600 scale-[1.03] shadow-xs"
                            : isCompleted
                            ? "bg-slate-100 dark:bg-slate-850 text-slate-500 border-slate-200 dark:border-slate-800"
                            : "bg-slate-50/50 dark:bg-slate-900/40 text-slate-400 border-dashed border-slate-200 dark:border-slate-850"
                        }`}
                      >
                        <span className="text-[10px] font-black block">
                          {idx + 1}
                        </span>
                        <span className="text-[9px] font-semibold hidden md:block select-none truncate">
                          {lang === "ku"
                            ? ["کێشە", "شیکار", "وردبینی", "بڕیار", "ئەنجام"][idx]
                            : ["المشكلة", "التحليل", "التحقق", "القرار", "المخرج"][idx]}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Main Content Area showing active Step parameters */}
                <div className="mt-8 bg-slate-50 dark:bg-slate-850 p-6 md:p-8 rounded-[24px] border border-slate-200/60 dark:border-slate-800 shadow-3xs">
                  
                  <div className="flex items-center gap-2 pb-3 mb-4 border-b border-dashed border-slate-200 dark:border-slate-750">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0066FF] shrink-0" />
                    <h3 className="text-sm md:text-base font-black text-slate-850 dark:text-slate-100">
                      {lang === "ku" ? currentStep.titleKu : currentStep.titleAr}
                    </h3>
                  </div>

                  <p className="text-xs md:text-sm text-slate-600 dark:text-slate-350 leading-relaxed font-sans font-medium whitespace-pre-line select-text">
                    {lang === "ku" ? currentStep.descKu : currentStep.descAr}
                  </p>

                  {/* Flow chart footer: Problem -> AI -> Gov validation -> Decision -> Outcome */}
                  <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-750 flex flex-wrap justify-between items-center gap-3">
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold select-none">
                      <span>{lang === "ku" ? "ئۆپەراسیۆن:" : "مسيرة الأتمتة:"}</span>
                      <span className="text-slate-900 dark:text-white font-black">
                        {lang === "ku" ? currentStep.phase : currentStep.phase}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[9px] py-0 px-2 select-none">
                        ✓ {lang === "ku" ? "تەواوکراوە" : "مطابق بالكامل"}
                      </Badge>
                      <Badge className="bg-[#0066FF]/10 text-[#0066FF] border-[#0066FF]/25 text-[9px] py-0 px-2 select-none">
                        ✓ {lang === "ku" ? "هاوتا لەگەڵ دەستور" : "معايير النظم"}
                      </Badge>
                    </div>
                  </div>

                </div>

                {/* Additional dynamic graphical insights for Scenario 4 Command Center */}
                {currentScenario.id === "scen_4" && activeStepIdx === 4 && (
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/20 flex flex-col justify-between">
                      <span className="text-[10px] text-emerald-600 font-bold block">{lang === "ku" ? "کاریگەری ئۆتۆماتیککردن" : "معدل الرضا والشفافية"}</span>
                      <span className="text-xl font-black mt-2 text-slate-900 dark:text-white">+95%</span>
                      <p className="text-[10px] text-slate-400 mt-1 leading-normal">{lang === "ku" ? "ماوەی گواستنەوە و بەڕێوەبردن لە چاو پێشتر بە تەواوی ئاسان کراوە." : "نسبة تقليص وقت الانتظار للبضائع في المنافذ الفيدرالية."}</p>
                    </div>
                    <div className="bg-violet-500/5 p-4 rounded-xl border border-violet-500/20 flex flex-col justify-between animate-pulse">
                      <span className="text-[10px] text-violet-600 font-bold block">{lang === "ku" ? "ڕادەی فلتەرکردنی مەترسی" : "توقع الأزمات وتثبيت المخاطر"}</span>
                      <span className="text-xl font-black mt-2 text-slate-900 dark:text-white">99.8%</span>
                      <p className="text-[10px] text-slate-400 mt-1 leading-normal">{lang === "ku" ? "هۆشمەندی نیشتمانی ڕوودانی پێشێلکاری پێشتر دەبینێت." : "مستوى دقة رصد وتحليل الأوراق الجمركية والضرائب."}</p>
                    </div>
                  </div>
                )}

              </div>

              {/* Controls at the bottom card */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-5 mt-6 flex justify-between items-center sm:flex-row flex-col gap-4">
                <Button
                  onClick={handlePrevProgress}
                  disabled={activeScenarioIdx === 0 && activeStepIdx === 0}
                  className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 border dark:border-slate-700 text-xs px-4 py-2.5 rounded-xl cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed w-full sm:w-auto text-center"
                >
                  {lang === "ku" ? "← هەنگاوی پێشوو" : "← خطوة سابقة"}
                </Button>

                <div className="text-[10px] text-slate-450 font-bold text-center">
                  <span>{lang === "ku" ? "نیشاندانی فەرمی سەرپەرشتی دەوڵەتی عێراقی فیدراڵ" : "بوابة العرض الوطني المعتمدة لهيئة جمارك العراق"}</span>
                </div>

                <Button
                  onClick={handleNextProgress}
                  className="bg-[#0066FF] hover:bg-blue-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer transition w-full sm:w-auto text-center"
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
