import React, { useState, lazy, Suspense } from "react";
import { Activity, Sparkles } from "lucide-react";
import { useChatStore } from "@/store/chatStore";
import { ExecutiveCommandCenter } from "./ExecutiveCommandCenter";

// Lazy load Assistant Workspace to optimize bundler output
const AssistantWorkspace = lazy(() => import("./AssistantWorkspace"));

interface AdminDesignProps {
  lang: "ku" | "ar";
  navigate: (path: string) => void;
}

// Elegant spinner that matches local loading interfaces
function AssistantLoadingSkeleton() {
  return (
    <div className="w-full h-96 flex flex-col items-center justify-center p-8 bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-4 border-[#0066FF] border-t-transparent animate-spin" />
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Initializing Intelligence Session...</span>
      </div>
    </div>
  );
}

export default function AdminDesign({ lang, navigate }: AdminDesignProps) {
  // Tab state for switching between National Executive Command Center dashboard & Interactive National AI Assistant chat
  const [activeCenterTab, setActiveCenterTab] = useState<"command" | "assistant">("command");
  
  // Connect to global chat store
  const {
    messages,
    input,
    isLoading,
    setInput,
    setSelectedMessage,
    handleSend
  } = useChatStore();

  return (
    <div className="w-full h-full flex-1 flex flex-col gap-6 pb-20">
      
      {/* Premium Executive Tab Bar Switcher */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-[#0066FF]/10 text-[#0066FF] rounded-xl select-none">
            <Activity className="w-5 h-5 flex items-center justify-center text-[#0066FF]" />
          </div>
          <div className="select-none">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              {lang === "ku" ? "بنکەی نیشتمانی بۆ چاودێری و بڕیاردان" : "المركز الوطني للمراقبة واتخاذ القرار"}
            </h3>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium font-sans">
              {lang === "ku" ? "سیستەمی فەرمی سەرپەرشتی حکومەتی فیدراڵی عێراق" : "النظام الرسمي الموحد لحكومة جمهورية العراق الفيدرالية"}
            </p>
          </div>
        </div>

        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border dark:border-slate-700 select-none">
          <button
            type="button"
            onClick={() => setActiveCenterTab("command")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border-0 ${
              activeCenterTab === "command"
                ? "bg-white dark:bg-[#071739] text-[#0066FF] dark:text-white shadow-xs font-semibold"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-medium"
            }`}
          >
            {lang === "ku" ? "تەلاری بڕیاردان و چاودێری نیشتمانی" : "مجمع العمليات والقيادة الوطني"}
          </button>
          <button
            type="button"
            onClick={() => setActiveCenterTab("assistant")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border-0 ${
              activeCenterTab === "assistant"
                ? "bg-white dark:bg-[#071739] text-[#0066FF] dark:text-white shadow-xs font-semibold"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-medium"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
              {lang === "ku" ? "یارمەتیدەری زیرەکی نیشتمانی" : "المساعد الذكي التفاعلي الوطني"}
            </span>
          </button>
        </div>
      </div>

      {/* Render selected center tab component */}
      {activeCenterTab === "command" ? (
        <ExecutiveCommandCenter 
          lang={lang} 
          navigate={navigate} 
          setActiveCenterTab={setActiveCenterTab} 
        />
      ) : (
        <Suspense fallback={<AssistantLoadingSkeleton />}>
          <AssistantWorkspace
            lang={lang}
            messages={messages}
            input={input}
            setInput={setInput}
            isLoading={isLoading}
            handleSend={handleSend}
            setSelectedMessage={setSelectedMessage}
          />
        </Suspense>
      )}

    </div>
  );
}
export { AdminDesign };
