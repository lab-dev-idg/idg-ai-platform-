import { useRef } from "react";
import { AnimatePresence } from "motion/react";
import { Loader2, Package, ShieldAlert, FileText, Plane, DollarSign, UserCheck, Wallet, Building2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { useSettingsStore } from '@/store/settingsStore';
import { MessageItem } from "./MessageItem";
import { ChatInputArea } from "./ChatInputArea";

const QUICK_ACTIONS = [
  { label: "تێچووی کۆنتێنەر", icon: Package, prompt: "تێچووی هێنانی کۆنتێنەرێکی ٤٠ پێ لە چینەوە بۆ ئوم قەسر چەندە؟" },
  { label: "ئیبراهیم خەلیل", icon: ShieldAlert, prompt: "ڕێکارەکانی گومرگ لە مەرزە نێودەوڵەتی ئیبراهیم خەلیل چۆنن بۆ باری تورکیا؟" },
  { label: "بەڵگەنامەکان", icon: FileText, prompt: "چ بەڵگەنامەیەک پێویستە بۆ هاوردەکردنی کاڵای خۆراکی؟" },
  { label: "فڕۆکەخانەی هەولێر", icon: Plane, prompt: "خێراترین ڕێگە بۆ تەرخیسکردنی باری ئاسمانی لە فڕۆکەخانەی هەولێر چییە؟" },
  { label: "گۆڕینەوەی دراو", icon: DollarSign, prompt: "Convert 100 USD to IQD" },
  { label: "ئەکاونتی بازرگانی (KYC)", icon: UserCheck, prompt: "دەستپێکردنی پڕۆسەی ناساندنی بازرگان و بارکردنی مۆڵەت" },
  { label: "حەواڵە و دارایی", icon: Wallet, prompt: "پیشاندانی جزدانی ئەلیکترۆنی و وردەکاری پسوڵەکان" },
  { label: "بانکەکان و پارەدان", icon: Building2, prompt: "چۆنیەتی بەستنەوەی ئەکاونت بە بانکەکان و گواستنەوەی پارە" },
];

import { ChatMessage } from "@/store/chatStore";

interface ChatInterfaceProps {
  messages: ChatMessage[];
  input: string;
  setInput: (val: string) => void;
  isLoading: boolean;
  handleSend: (text?: string) => Promise<void>;
  setSelectedMessage: (msg: ChatMessage) => void;
}

export function ChatInterface({ 
  messages, 
  input, 
  setInput, 
  isLoading, 
  handleSend, 
  setSelectedMessage 
}: ChatInterfaceProps) {
  const { t, lang } = useSettingsStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  const isCustomsMode = typeof window !== 'undefined' && window.location.pathname === '/customs';
  const activeQuickActions = isCustomsMode ? [
    { label: lang === 'ku' ? "کۆدی تاریفەی HS" : (lang === 'ar' ? "تصنيف رمز المنسق HS" : "HS Code Classification"), icon: Package, prompt: "Tell me how HS code classification and tariff lookup works for communication equipment and servers under the 2026 customs law." },
    { label: lang === 'ku' ? "یاساکانی گواستنەوەی سنوور" : (lang === 'ar' ? "ضوابط العبور والمنافذ" : "Border Crossing Controls"), icon: ShieldAlert, prompt: "What are the compliance controls and fast pass rules for customs clearers at Iraqi checkpoints?" },
    { label: lang === 'ku' ? "داواکاری مۆڵەتنامە" : (lang === 'ar' ? "متطلبات تراخيص المخلصين" : "Clearing Agent Licenses"), icon: FileText, prompt: "What documentations are required for licensing active customs brokers and freight forwarders?" },
    { label: lang === 'ku' ? "خەمڵاندنی تێچووی گومرگ" : (lang === 'ar' ? "حساب تخليص الشحنات" : "Duty Cost Multipliers"), icon: DollarSign, prompt: "How do you compute the total custom duty using the CIF multiplier with commercial tariff rates?" }
  ] : QUICK_ACTIONS;

  return (
    <Card className="lg:col-span-9 flex flex-col h-full overflow-hidden border-none shadow-2xl bg-white rounded-[32px]">
      {/* AI Operational Status Layer */}
      <div className="flex flex-wrap items-center justify-between px-6 py-2.5 bg-slate-50/50 border-b border-slate-100 select-none text-[10px] font-mono gap-y-2">
        <div className="flex items-center gap-4 text-slate-500">
          <div className="flex items-center gap-1.5 font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981]/30 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981]"></span>
            </span>
            <span>REALTIME CON_SEC // 12ms</span>
          </div>
          <div className="hidden sm:flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            <span>AI CORE: ONLINE (99.8%)</span>
          </div>
          <div className="hidden sm:flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            <span>GATE_HEALTH: OPTIMAL</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-slate-200/50 text-slate-600 px-2 py-0.5 rounded-md font-bold text-[9px]">
            {isCustomsMode ? "MODE: CUSTOMS & TARIFF" : "MODE: GLOBAL LOGISTICS"}
          </span>
          <span className="bg-[#0066FF]/10 text-[#0066FF] px-2 py-0.5 rounded-md font-bold text-[9px]">
            V2.6_CO-PILOT
          </span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden relative">
        <ScrollArea className="h-full w-full">
          <div className="p-4 md:p-6 space-y-6">
            <AnimatePresence initial={false}>
              {messages.map((msg, idx) => (
                <MessageItem 
                  key={idx} 
                  msg={msg} 
                  onClick={() => setSelectedMessage(msg)} 
                />
              ))}
            </AnimatePresence>

            {isLoading && (
              <div className="flex justify-end pr-11">
                <div className="bg-secondary p-3 rounded-full flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-xs">{t.chat.thinking}</span>
                </div>
              </div>
            )}
            <div ref={scrollRef} className="h-4" />
          </div>
        </ScrollArea>
      </div>

      {/* Quick Actions & Input area */}
      <div className="flex-none flex flex-col bg-white">
        <div className="px-4 py-3 flex gap-2 overflow-x-auto border-t bg-slate-50/50 custom-scrollbar">
          {activeQuickActions.map((action) => (
            <Button
              key={action.label}
              variant="outline"
              size="sm"
              className="whitespace-nowrap rounded-full text-[11px]"
              onClick={() => handleSend(action.prompt)}
            >
              <action.icon className="w-3.5 h-3.5" />
              {action.label}
            </Button>
          ))}
        </div>

        {/* Chat Input */}
        <ChatInputArea 
          input={input} 
          setInput={setInput} 
          isLoading={isLoading} 
          handleSend={handleSend} 
          placeholder={t.chat.placeholder} 
        />
      </div>
    </Card>
  );
}
