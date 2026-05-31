import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/card';
import { Badge, GlassCard } from '@idg/ui';
import { MapPin, Anchor, Plane, Cpu, Activity, ArrowRight, ShieldCheck } from 'lucide-react';
import { useSettingsStore } from '@/store/settingsStore';
import { Link, useLocation } from 'react-router-dom';

export function StatsSection() {
  const { lang } = useSettingsStore();
  const { pathname } = useLocation();

  const isCustomsPage = pathname === '/customs';

  const cockpitTranslations = {
    ku: {
      cockpitTitle: "مەیدانی زانیاری و سەرپەرشتی زیرەک (AI Cockpit)",
      cockpitSub: "سیستەمی چاودێری یەکگرتوو بە کاتی ڕاستەقینە بۆ بار، مەرز و ڕێکارەکانی گومرگی",
      systemHealth: "خزمەتگوزاری: بەردەست بە تەواوی",
      customsTitle: "دەروازەی گومرگ و تاریفەی نوێ ٢٠٢٦",
      customsDesc: "سیکشنێکی پسپۆڕ بۆ لێکدانەوەی تێچووی گومرگی و مەرجەکانی هاوردە بەپێی نوێترین تاریفەی گومرگی هۆشەمەند.",
      customsAction: "چوونە ناو دەروازەی گومرگ",
      customsActive: "ئێستا لە ناو دۆخی گومرگدایت",
      bordersTitle: "دۆخی مەرزەکانی عێراق",
    },
    ar: {
      cockpitTitle: "لوحة التحكم اللوجستية الذكية (AI Cockpit)",
      cockpitSub: "نظام المراقبة الموحد بالوقت الحقيقي للشحنات والمنافذ والإجراءات الجمركية",
      systemHealth: "حالة النظام: فعال بالكامل",
      customsTitle: "بوابة الجمارك والتعرفة الجديدة ٢٠٢٦",
      customsDesc: "قسم متخصص لتحليل حساب الرسوم الجمركية وضوابط الاستيراد بالاعتماد على التعرفة الرسمية الذكية.",
      customsAction: "دخول بوابة الجمارك",
      customsActive: "أنت الآن داخل بوابة الجمارك",
      bordersTitle: "حالة المنافذ العراقية",
    }
  };

  const localText = cockpitTranslations[lang === 'ku' ? 'ku' : 'ar'];

  const gates = [
    {
      title: lang === 'ku' ? "دەروازەی ئیبراهیم خەلیل" : "منفذ إبراهيم الخليل الدولي",
      icon: MapPin,
      color: "from-green-400 to-green-600",
      time: lang === 'ku' ? "٣٠ خولەک" : "٣٠ دقيقة",
      status: lang === 'ku' ? "چالاک و خێرا" : "نشط وسريع",
      type: "green"
    },
    {
      title: lang === 'ku' ? "بەندەری ئوم قەسر" : "ميناء أم قصر التجاري",
      icon: Anchor,
      color: "from-yellow-400 to-yellow-600",
      time: lang === 'ku' ? "٤٥ خولەک" : "٤٥ دقيقة",
      status: lang === 'ku' ? "چالاک و خێرا" : "نشط وسريع",
      type: "yellow"
    },
    {
      title: lang === 'ku' ? "فڕۆکەخانەی هەولێر" : "مطار أربيل الدولي",
      icon: Plane,
      color: "from-blue-400 to-blue-600",
      time: lang === 'ku' ? "١٥ خولەک" : "١٥ دقيقة",
      status: lang === 'ku' ? "چالاک و خێرا" : "نشط وسريع",
      type: "blue"
    },
  ];

  return (
    <section className="max-w-7xl mx-auto w-full px-4 md:px-8 py-4 md:py-6 space-y-5">
      {/* Cockpit Top Bar Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 bg-[#071739] text-white rounded-[24px] shadow-xl border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-start gap-3.5 z-10">
          <div className="mt-1 p-2 bg-blue-500/15 text-blue-400 rounded-xl border border-blue-500/20">
            <Cpu className="w-5 h-5 animate-spin-slow text-[#0066FF]" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
              {localText.cockpitTitle}
              <span className="inline-flex w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
            </h2>
            <p className="text-xs text-white/70 font-medium mt-0.5 max-w-2xl leading-relaxed">
              {localText.cockpitSub}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 z-10">
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 py-1.5 px-3 rounded-xl flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[10px] font-bold tracking-wider uppercase font-sans">
              {localText.systemHealth}
            </span>
          </Badge>
          <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20 py-1.5 px-3 rounded-xl flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-[10px] font-bold tracking-wider uppercase font-sans">
              {lang === 'ku' ? "سیستەم: چالاک و پارێزراو" : "النظام: فعال ومؤمن"}
            </span>
          </Badge>
        </div>
      </div>

      {/* Customs Controller Interactive link card & Gate status section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-5">
          <GlassCard className="h-full p-5 bg-gradient-to-br from-[#071739]/95 to-[#0b245c]/95 border border-white/10 rounded-[28px] shadow-lg flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-blue-500/10 transition-colors" />
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge className="bg-blue-600/20 text-[#3385ff] border border-blue-500/20 text-[10px] font-bold px-2 py-0.5 rounded-lg">
                  {lang === 'ku' ? "پۆرتالی نیشتمانی" : "البوابة الرسمية الوطنية"}
                </Badge>
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              </div>
              
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  {localText.customsTitle}
                </h3>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed font-medium">
                  {localText.customsDesc}
                </p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between">
              {isCustomsPage ? (
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {localText.customsActive}
                </div>
              ) : (
                <Link
                  to="/customs"
                  className="w-full flex items-center justify-between px-4 py-2 bg-[#0066FF] hover:bg-[#0066FF]/95 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-blue-500/10 group-hover:translate-x-0.5 cursor-pointer"
                >
                  <span>{localText.customsAction}</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </Link>
              )}
            </div>
          </GlassCard>
        </div>

        {/* 3 Active borders state cards */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {gates.map((gate, i) => (
            <Card
              key={i}
              className={`relative overflow-hidden border rounded-3xl top-stat-card ${gate.type}`}
            >
              <div
                className={`absolute right-0 top-0 bottom-0 w-1.5 bg-gradient-to-b ${gate.color}`}
              />
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold flex items-center gap-2">
                  <gate.icon className="w-3.5 h-3.5" />
                  {gate.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-slate-400">
                      {lang === 'ku' ? "بارودۆخ" : "الحالة"}
                    </span>
                    <Badge className="mt-1 text-[10px] py-0 px-2 font-semibold">
                      {gate.status}
                    </Badge>
                  </div>
                  <div className="text-left">
                    <span className="text-[9px] text-slate-400 block">
                      {lang === 'ku' ? "کاتی چاوەڕوانی" : "انتظار المعاملة"}
                    </span>
                    <span className="font-extrabold text-[#071739] text-base">
                      {gate.time}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

