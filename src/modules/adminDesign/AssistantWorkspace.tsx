import React from "react";
import { Sparkles, Activity } from "lucide-react";
import { ChatInterface } from "@/features/chat";

interface AssistantWorkspaceProps {
  lang: "ku" | "ar";
  messages: any[];
  input: string;
  setInput: (val: string) => void;
  isLoading: boolean;
  handleSend: (text?: string) => Promise<void>;
  setSelectedMessage: (msg: any) => void;
}

export default function AssistantWorkspace({
  lang,
  messages,
  input,
  setInput,
  isLoading,
  handleSend,
  setSelectedMessage
}: AssistantWorkspaceProps) {
  return (
    <div className="w-full h-full flex-1 min-h-0 flex flex-col lg:grid lg:grid-cols-12 gap-6 pb-20">
      {/* Dialogue area on the left (8 grid columns) */}
      <div className="lg:col-span-8 h-full flex flex-col bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="flex-1 min-h-0 flex flex-col">
          <ChatInterface
            messages={messages}
            input={input}
            setInput={setInput}
            isLoading={isLoading}
            handleSend={handleSend}
            setSelectedMessage={setSelectedMessage}
          />
        </div>
      </div>

      {/* Suggested actions sidebar on the right (4 grid columns) */}
      <div className="lg:col-span-4 space-y-4">
        <div className="bg-[#071739] text-white p-5 rounded-2xl shadow-sm border border-white/5 flex flex-col gap-3">
          <h4 className="font-bold text-xs uppercase text-slate-400 tracking-wider flex items-center gap-1.5 select-none font-sans">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            {lang === "ku" ? "پۆرتالی زیرەک" : "البوابة الذكية"}
          </h4>
          <h3 className="text-base font-black tracking-tight leading-tight select-none">
            {lang === "ku" ? "پێشنیارە خیراکان" : "المقترحات السريعة"}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed font-sans mt-1">
            {lang === "ku" 
              ? "دەتوانیت پرسیار بکەیت سەبارەت بە تاریفەکان، یاسا نوێیەکانی باج، کاتەکانی چاوەڕوانی لە مەرزی زاخۆ، یان چۆنیەتی هاوردەکردنی مۆبایل و کۆمپیوتەر."
              : "بإمكانك الاستفسار عن تفاصيل التعرفة الجمركية الرسمية، ومحاكي قرارات النفط والإنذار المبكر للسلع."}
          </p>
          <div className="mt-2 space-y-1.5 text-slate-100 text-[11px] font-sans">
            <button 
              type="button"
              onClick={() => setInput(lang === "ku" ? "نرخی تاریفەی کۆمپیوتەری هاوردە چەندە؟" : "كم هي تعرفة استيراد الحاسبات؟")} 
              className="w-full text-right hover:text-blue-200 bg-white/5 p-2 rounded-lg font-semibold transition truncate cursor-pointer border-0"
            >
              💡 {lang === "ku" ? "نرخی تاریفەی کۆمپیوتەری هاوردە" : "تعرفة الجمارك للحاسبات المحمولة"}
            </button>
            <button 
              type="button"
              onClick={() => setInput(lang === "ku" ? "کاتەکانی چاوەڕوانی مەرزی زاخۆ" : "أوقات الانتظار في منفذ زاخو")} 
              className="w-full text-right hover:text-blue-200 bg-white/5 p-2 rounded-lg font-semibold transition truncate cursor-pointer border-0"
            >
              💡 {lang === "ku" ? "کاتەکانی چاوەڕوانی مەرزی زاخۆ" : "حساب أوقات منفذ زاخو الجمركي"}
            </button>
          </div>
        </div>
        <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 font-sans">
          <div className="flex items-center gap-1.5 select-none">
            <Activity className="w-4 h-4 text-green-500 shrink-0" />
            <h4 className="font-bold text-xs text-slate-700 dark:text-slate-300">
              {lang === "ku" ? "پەیوەندی ئەمنی" : "الاتصال التشغيلي"}
            </h4>
          </div>
          <p className="text-[11px] text-slate-400 leading-normal">
            {lang === "ku" 
              ? "پەیوەندی لەگەڵ کۆرپەستۆری عێراق بە تەواوی پارێزراوە بە پرۆتۆکۆلی AES-256."
              : "اتصالك مشفر بالكامل ومسجل في سجلات الحوكمة الحكومية."}
          </p>
        </div>
      </div>
    </div>
  );
}
export { AssistantWorkspace };
