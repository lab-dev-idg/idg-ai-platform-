import React, { useState } from 'react';
import { 
  INITIAL_TRADE_METRICS, 
  FORECAST_PREDICTIONS 
} from '../data';
import { 
  Sparkles, 
  Calendar,
  AlertCircle,
  BarChart,
  AreaChart
} from 'lucide-react';
import { useSettingsStore } from '@/store/settingsStore';

export function NationalTradeObservatory() {
  const { lang } = useSettingsStore();
  const isKurdish = lang === 'ku';

  const [activeSeries, setActiveSeries] = useState<'customs_rev' | 'logistics_vol'>('customs_rev');
  const [forecastTerm, setForecastTerm] = useState<'short' | 'medium' | 'long'>('short');

  // Filter forecasts by short, medium, long term
  const fullForecastData = FORECAST_PREDICTIONS[activeSeries];
  
  // Filter according to selection
  const getFilteredForecasts = () => {
    if (forecastTerm === 'short') {
      // return up to Jul 26
      return fullForecastData.slice(0, 7);
    } else if (forecastTerm === 'medium') {
      // return up to Sep 26
      return fullForecastData.slice(0, 9);
    } else {
      // return all
      return fullForecastData;
    }
  };

  const currentForecast = getFilteredForecasts();

  // Assumptions & limitations
  const assumptions = [
    isKurdish 
      ? 'پێشبینییەکان لەسەر بنەمای بەردەوامی سەقامگیری ڕێژەی ئاسایی دراوی عێراقی داڕێژراون.' 
      : 'الأداء الفرضي يستند إلى استقرار أسعار الصرف الرسمية للبنك المركزي العراقي.',
    isKurdish
      ? 'سەرنجەکان بە کارهێنانی نەخشەی مێژوویی هێڵی بازرگانی تورکیا-عێراق و بەندەرەکان لێکدراونەتەوە.'
      : 'تفترض دراسة الاستشعار نمو الطلب الموسمي القياسي للبضائع التركية عبر ممر دهوك.',
    isKurdish
      ? 'مۆدێلەکە وادادەنێت کە چاکسازییەکانی ASYCUDA لە بەندەری ئوم قەسر بەبێ دواکەوتن بەردەوام دەبێت.'
      : 'معدل الحسابات يعتمد على نسبة كفاءة تشغيل الأطقم المدربة على برامج البيان أسيكودا.'
  ];

  const limitations = [
    isKurdish
      ? 'نائارامی بەهای تێچووی نێودەوڵەتی بار یان بەفرگرتنی زستانی مەرزی باکوور کاریگەرییان لەسەر وردی پێناسەکە دەبێت.'
      : 'تغيرات المناخ وازدحام الممرات البحرية العالمية (مضيق هرمز) تقع خارج نطاق النبأ التنبؤي.',
    isKurdish
      ? 'ئەم مۆدێلە ڕێژەی قاچاخچێتی کۆنتڕۆڵنەکراو لە پۆرتە گشتییەکان بۆ داهاتە بازرگانییەکان ناخەمڵێنێت.'
      : 'المحاكاة لا تدعم سيناريوهات التهرب التجاري الخارج عن نطاق الرصد الرقمي الفيدرالي.'
  ];

  // Helper to draw a beautiful localized SVG path for the forecast and history chart
  // This uses pure Math to map values to coordinates dynamically
  const drawChartPaths = () => {
    const width = 640;
    const height = 180;
    const paddingLeft = 50;
    const paddingRight = 20;
    const paddingTop = 20;
    const paddingBottom = 30;

    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;

    // Find min and max
    const values = currentForecast.map(d => d.actual || d.forecast);
    const upperLimitValues = currentForecast.map(d => d.upperConfidence);
    const lowerLimitValues = currentForecast.map(d => d.lowerConfidence);
    const allVals = [...values, ...upperLimitValues, ...lowerLimitValues].filter(v => v !== undefined) as number[];
    const maxVal = Math.max(...allVals) * 1.05;
    const minVal = Math.min(...allVals) * 0.95;

    const mapX = (index: number) => {
      return paddingLeft + (index / (currentForecast.length - 1)) * chartWidth;
    };

    const mapY = (val: number) => {
      const scale = (val - minVal) / (maxVal - minVal);
      return height - paddingBottom - scale * chartHeight;
    };

    // Draw lines
    let actualPath = '';
    let forecastPath = '';
    let upperConfidencePath = '';
    let lowerConfidencePath = '';

    currentForecast.forEach((d, i) => {
      const x = mapX(i);
      if (d.actual !== undefined) {
        const y = mapY(d.actual);
        actualPath += (i === 0 ? 'M ' : 'L ') + `${x} ${y}`;
      }
      
      const yForecast = mapY(d.forecast);
      forecastPath += (i === 0 ? 'M ' : 'L ') + `${x} ${yForecast}`;

      const yUpper = mapY(d.upperConfidence);
      upperConfidencePath += (i === 0 ? 'M ' : 'L ') + `${x} ${yUpper}`;

      const yLower = mapY(d.lowerConfidence);
      lowerConfidencePath += (i === 0 ? 'M ' : 'L ') + `${x} ${yLower}`;
    });

    // Make filled confidence zone
    let confidenceZone = '';
    currentForecast.forEach((d, i) => {
      const x = mapX(i);
      const yUpper = mapY(d.upperConfidence);
      confidenceZone += (i === 0 ? 'M ' : 'L ') + `${x} ${yUpper}`;
    });
    // Trace back along lower confidence boundary
    for (let i = currentForecast.length - 1; i >= 0; i--) {
      const d = currentForecast[i];
      const x = mapX(i);
      const yLower = mapY(d.lowerConfidence);
      confidenceZone += `L ${x} ${yLower}`;
    }
    confidenceZone += ' Z';

    return {
      actualPath,
      forecastPath,
      upperConfidencePath,
      lowerConfidencePath,
      confidenceZone,
      mapX,
      mapY,
      minVal,
      maxVal,
      chartWidth,
      chartHeight,
      paddingLeft,
      paddingBottom,
      height
    };
  };

  const chartGeometry = drawChartPaths();

  return (
    <div id="national-trade-observatory" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* 1. National Trade Observatory: Centralized Indicators panel */}
      <div className="lg:col-span-12 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#0066FF]" />
              {isKurdish ? 'چاودێری بازرگانی نیشتمانی (National Trade Observatory)' : 'المرصد الوطني للمؤشرات التجارية والتشخيص'}
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              {isKurdish ? 'داشبۆردی سەرەکی چاودێری ئابووری، داهاتی گومرگی و مەرزی' : 'البوابة المركزية لرصد اتجاهات تدفق السلع والرسوم والواردات'}
            </p>
          </div>
          
          <div className="flex bg-[#071739]/5 p-0.5 rounded-xl border border-[#071739]/10 self-start sm:self-auto text-[10px] font-bold">
            <button 
              onClick={() => setActiveSeries('customs_rev')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${activeSeries === 'customs_rev' ? 'bg-[#071739] text-white' : 'text-slate-500 hover:text-slate-800'}`}
            >
              {isKurdish ? 'داهاتی گومرگی' : 'الإيرادات جمركياً'}
            </button>
            <button 
              onClick={() => setActiveSeries('logistics_vol')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${activeSeries === 'logistics_vol' ? 'bg-[#071739] text-white' : 'text-slate-500 hover:text-slate-800'}`}
            >
              {isKurdish ? 'قەبارەی بار و لۆجیستیک' : 'الطاقة الاستيعابية'}
            </button>
          </div>
        </div>

        {/* 4 core indicator cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {INITIAL_TRADE_METRICS.map((metric, i) => {
            const isSelected = activeSeries === 'customs_rev' ? metric.id.includes('rev') || metric.id.includes('import') : metric.id.includes('vol') || metric.id.includes('export');
            return (
              <div 
                key={i} 
                className={`bg-white border rounded-[20px] p-4 transition-all duration-300 ${isSelected ? 'shadow-md shadow-[#0066FF]/5 border-[#0066FF]/20 ring-1 ring-[#0066FF]/5' : 'border-slate-100 shadow-xs'}`}
              >
                <div className="flex justify-between items-start">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">
                    {isKurdish ? metric.kuName : metric.arName}
                  </span>
                  <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-md font-mono ${metric.change >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                    {metric.change >= 0 ? '+' : ''}{metric.change}%
                  </span>
                </div>
                <div className="text-xl font-bold text-slate-900 mt-2 tracking-tight">
                  {metric.id.includes('rev') || metric.id.includes('val') 
                    ? `$${(metric.value / 1000000000).toFixed(2)}B USD` 
                    : `${(metric.value).toLocaleString()} TEU`
                  }
                </div>
                {/* SVG Micro sparkles chart line inside the card */}
                <div className="mt-3.5 h-6 w-full opacity-60">
                  <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                    <path 
                      d={`M ${metric.history.map((h, idx) => `${(idx / (metric.history.length - 1)) * 140}, ${20 - (h / 1500) * 15}`).join(' L ')}`} 
                      fill="none" 
                      stroke={metric.change >= 0 ? '#10b981' : '#f43f5e'} 
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 8. Economic Forecasting curves dashboard widget */}
      <div className="lg:col-span-8 bg-white border border-slate-100 rounded-[24px] shadow-sm p-5 space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-50 pb-4">
          <div>
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <BarChart className="w-4 h-4 text-[#0066FF]" />
              {isKurdish ? 'مەودای پێشبینیکردن و ئاسۆی داهاتوو' : 'هيكلية التنبؤ والأفق المالي الرقمي'}
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {isKurdish ? 'نەخشەی کاری پێش چاو بۆ کورتخایەن، مامناوەند و درێژخایەن' : 'نماذج التنبؤ القياسية قصيرة، متوسطة، وطويلة المدى'}
            </p>
          </div>

          <div className="flex bg-[#071739]/5 p-0.5 rounded-xl border border-[#071739]/10 text-[10px] font-bold">
            <button 
              onClick={() => setForecastTerm('short')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${forecastTerm === 'short' ? 'bg-[#071739] text-white' : 'text-slate-500 hover:text-slate-800'}`}
            >
              {isKurdish ? 'کورتخایەن' : 'قصيرة المدى'}
            </button>
            <button 
              onClick={() => setForecastTerm('medium')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${forecastTerm === 'medium' ? 'bg-[#071739] text-white' : 'text-slate-500 hover:text-slate-800'}`}
            >
              {isKurdish ? 'مامناوەند' : 'متوسطة المدى'}
            </button>
            <button 
              onClick={() => setForecastTerm('long')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${forecastTerm === 'long' ? 'bg-[#071739] text-white' : 'text-slate-500 hover:text-slate-800'}`}
            >
              {isKurdish ? 'درێژخایەن' : 'طويلة المدى'}
            </button>
          </div>
        </div>

        {/* Premium forecasting SVGs drawing actual forecasts and shaded bounds */}
        <div className="relative pt-3">
          
          <div className="absolute top-2 left-16 flex items-center gap-4 text-[10px] font-semibold text-slate-500 select-none">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-1 bg-amber-500 rounded-sm" />
              {isKurdish ? 'بۆشایی متمانە (Confidence Area)' : 'هوامش الثقة والارتدادات'}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-1 bg-[#0066FF] rounded-sm" />
              {isKurdish ? 'هێڵی مەیلی سەرەکی' : 'المؤشر الفعلي المتوقع'}
            </span>
          </div>

          <div className="overflow-x-auto">
            <svg viewBox="0 0 640 180" className="w-full min-w-[500px] h-auto overflow-visible">
              {/* Grid Lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((p, idx) => {
                const y = chartGeometry.mapY(chartGeometry.minVal + p * (chartGeometry.maxVal - chartGeometry.minVal));
                return (
                  <g key={idx}>
                    <line 
                      x1={chartGeometry.paddingLeft} 
                      y1={y} 
                      x2={640 - 20} 
                      y2={y} 
                      stroke="#f1f5f9" 
                      strokeWidth="1.2"
                    />
                    <text 
                      x={chartGeometry.paddingLeft - 8} 
                      y={y + 3} 
                      textAnchor="end" 
                      className="text-[9px] font-mono fill-slate-400 font-bold"
                    >
                      {activeSeries === 'customs_rev' 
                        ? `$${Math.round(chartGeometry.minVal + p * (chartGeometry.maxVal - chartGeometry.minVal))}M`
                        : `${Math.round(chartGeometry.minVal + p * (chartGeometry.maxVal - chartGeometry.minVal))}k`
                      }
                    </text>
                  </g>
                );
              })}

              {/* Confidence Band Polygon */}
              <polygon 
                points={chartGeometry.confidenceZone} 
                className="fill-amber-500/5 stroke-none"
              />
              <path 
                d={chartGeometry.upperConfidencePath} 
                fill="none" 
                stroke="#f59e0b" 
                strokeDasharray="2 4" 
                strokeWidth="1"
              />
              <path 
                d={chartGeometry.lowerConfidencePath} 
                fill="none" 
                stroke="#f59e0b" 
                strokeDasharray="2 4" 
                strokeWidth="1"
              />

              {/* Forecast path */}
              <path 
                d={chartGeometry.forecastPath} 
                fill="none" 
                stroke="#6366f1" 
                strokeWidth="2.2" 
                strokeDasharray="4 3"
              />

              {/* Actual timeline path */}
              <path 
                d={chartGeometry.actualPath} 
                fill="none" 
                stroke="#0066FF" 
                strokeWidth="3"
              />

              {/* Labels */}
              {currentForecast.map((d, i) => {
                const x = chartGeometry.mapX(i);
                const isFuture = d.actual === undefined;
                return (
                  <g key={i}>
                    <text 
                      x={x} 
                      y={180 - 6} 
                      textAnchor="middle" 
                      className={`text-[9px] font-bold font-mono ${isFuture ? 'fill-indigo-500 font-extrabold' : 'fill-slate-400'}`}
                    >
                      {d.period.split(' ')[0]}
                    </text>
                    <circle 
                      cx={x} 
                      cy={chartGeometry.mapY(d.actual || d.forecast)} 
                      r={isFuture ? "3.5" : "4.5"} 
                      className={isFuture ? "fill-[#6366f1]" : "fill-[#0066FF] stroke-white stroke-2"}
                    />
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Informative Forecast Assumptions and Limitations description */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-50">
          <div className="space-y-1.5 bg-slate-50/50 p-4 rounded-2xl border border-slate-100/40">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 select-none">
              <Calendar className="w-3.5 h-3.5 text-indigo-500" />
              <span>{isKurdish ? 'گریمانەکانی مۆدێلی زانیاری (Assumptions)' : 'الفرضيات والمعايير الأساسية لبناء النماذج'}</span>
            </span>
            <ul className="list-disc pl-4 space-y-1 text-slate-600 text-[11px] leading-relaxed font-medium">
              {assumptions.map((as, i) => <li key={i}>{as}</li>)}
            </ul>
          </div>
          
          <div className="space-y-1.5 bg-slate-50/50 p-4 rounded-2xl border border-slate-100/40">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 select-none">
              <AlertCircle className="w-3.5 h-3.5 text-indigo-500" />
              <span>{isKurdish ? 'مەودا و کەمکوڕییە ئەگەریەکان (Limitations)' : 'القيود ومحددات دلالة المحاكاة الرياضية'}</span>
            </span>
            <ul className="list-disc pl-4 space-y-1 text-slate-600 text-[11px] leading-relaxed font-medium">
              {limitations.map((lim, i) => <li key={i}>{lim}</li>)}
            </ul>
          </div>
        </div>
      </div>

      {/* Side Summary of Strategic metrics */}
      <div className="lg:col-span-4 bg-[#071739] text-white border border-white/5 rounded-[24px] shadow-sm p-5 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-500/10 text-blue-400 rounded-lg border border-white/10">
              <AreaChart className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              {isKurdish ? 'هێماکانی مەیدانی بازرگانی' : 'خلاصة الرصد الاقتصادي'}
            </h4>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center text-xs pb-2 border-b border-white/5">
              <span className="text-slate-400 font-bold">{isKurdish ? 'داهات لەم هەفتەیەدا' : 'تحصيل الأسبوع الحالي'}</span>
              <span className="font-mono text-emerald-400 font-bold">$34.5M USD</span>
            </div>
            <div className="flex justify-between items-center text-xs pb-2 border-b border-white/5">
              <span className="text-slate-400 font-bold">{isKurdish ? 'پلەی متمانەی گومرگ' : 'مؤشر الامتثال الجمركي'}</span>
              <span className="font-mono text-blue-400 font-bold">92.4%</span>
            </div>
            <div className="flex justify-between items-center text-xs pb-2 border-b border-white/5">
              <span className="text-slate-400 font-bold">{isKurdish ? 'خاڵە چالاکەکانی گومرگ' : 'المنافذ الجمركية الفعالة'}</span>
              <span className="font-mono text-slate-200">22 {isKurdish ? 'مەرز' : 'منفذ'}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-bold">{isKurdish ? 'وردەکاری پشکنینەکان' : 'الشحنات قيد المعاينة'}</span>
              <span className="font-mono text-amber-500 font-bold">1,450 {isKurdish ? 'بار' : 'شحنة'}</span>
            </div>
          </div>
        </div>

        <div className="mt-5 border-t border-white/5 pt-4 bg-[#081e4b] p-3 rounded-2xl border border-white/10">
          <span className="text-[10px] text-blue-300 font-bold uppercase tracking-wider block mb-1">
            {isKurdish ? 'چاودێری و پاراستنی سەروەری گومرگی' : 'أمن الحوكمة والتحقق اللوجستي'}
          </span>
          <p className="text-[11px] text-white/75 leading-relaxed font-serif italic">
            {isKurdish 
              ? 'ئامارەکانی چاودێری بازرگانی بە بەردەوامی لەگەڵ وەزارەتەکانی دارایی و بازرگانی عێراقی هاوکات دەکرێن بۆ پشتگیری بڕیارە دروستەکان.' 
              : 'البيانات الجمركية اللحظية تقع تحت الرقابة والمصادقة السيادية الاتحادية بالتكامل مع وزارة التجارة والمالية العراقية.'}
          </p>
        </div>
      </div>
    </div>
  );
}
