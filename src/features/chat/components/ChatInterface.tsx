import { useRef, useEffect } from "react";
import { AnimatePresence } from "motion/react";
import { 
  Loader2, 
  Package, 
  ShieldAlert, 
  FileText, 
  Plane, 
  DollarSign, 
  UserCheck, 
  Wallet, 
  Building2,
  Plus,
  MessageSquare,
  Trash2
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { useSettingsStore } from '@/store/settingsStore';
import { useChatStore, ChatMessage } from "@/store/chatStore";
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

  // Retrieve past sessions from optimized store
  const { chats, activeChatId, loadChats, selectChat, createNewChat, deleteChat } = useChatStore();

  // Load chats on initial component mount
  useEffect(() => {
    loadChats();
  }, [loadChats]);

  // Handle scrolling down to focus on latest message responses
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const isCustomsMode = typeof window !== 'undefined' && window.location.pathname === '/customs';
  const activeQuickActions = isCustomsMode ? [
    { label: lang === 'ku' ? "کۆدی تاریفەی HS" : (lang === 'ar' ? "تصنيف رمز المنسق HS" : "HS Code Classification"), icon: Package, prompt: "Tell me how HS code classification and tariff lookup works for communication equipment and servers under the 2026 customs law." },
    { label: lang === 'ku' ? "یاساکانی گواستنەوەی سنوور" : (lang === 'ar' ? "ضوابط العبور والمنافذ" : "Border Crossing Controls"), icon: ShieldAlert, prompt: "What are the compliance controls and fast pass rules for customs clearers at Iraqi checkpoints?" },
    { label: lang === 'ku' ? "داواکاری مۆڵەتنامە" : (lang === 'ar' ? "متطلبات تراخيص المخلصين" : "Clearing Agent Licenses"), icon: FileText, prompt: "What documentations are required for licensing active customs brokers and freight forwarders?" },
    { label: lang === 'ku' ? "خەمڵاندنی تێچووی گومرگ" : (lang === 'ar' ? "حساب تخليص الشحنات" : "Duty Cost Multipliers"), icon: DollarSign, prompt: "How do you compute the total custom duty using the CIF multiplier with commercial tariff rates?" }
  ] : QUICK_ACTIONS;

  // Localized texts for session management
  const localizedHistoryTitle = lang === 'ku' ? "مێژووی گفتوگۆکان" : (lang === 'ar' ? "سجل المحادثات" : "Inquiry Logs");
  const localizedNewChatBtn = lang === 'ku' ? "گفتوگۆیەکی نوێ" : (lang === 'ar' ? "محادثة جديدة" : "New Consultation");
  const localizedDefaultChatTitle = lang === 'ku' ? "پرسار و وەڵام" : (lang === 'ar' ? "استفسار لوجستي" : "Customs Inquiry");

  return (
    <Card className="lg:col-span-9 grid grid-cols-1 md:grid-cols-12 overflow-hidden border-none shadow-2xl bg-white rounded-[32px] h-[750px]">
      
      {/* LEFT RAIL: Chat History list (visible on desktop) */}
      <div className="hidden md:flex md:col-span-3 flex-col border-r border-slate-100 bg-slate-50/40 h-full overflow-hidden">
        {/* Top Header and action */}
        <div className="p-4 border-b border-slate-100 flex-none">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 block">
            {localizedHistoryTitle}
          </h3>
          <Button 
            onClick={createNewChat}
            className="w-full justify-start gap-2 text-xs font-semibold bg-[#0066FF] hover:bg-[#0052cc] text-white rounded-xl shadow-sm border-none"
            size="sm"
          >
            <Plus className="w-4 h-4" />
            {localizedNewChatBtn}
          </Button>
        </div>

        {/* Sessions list */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {chats.length === 0 ? (
            <div className="text-center py-8 px-4 text-slate-400 text-xs text-pretty">
              {lang === 'ku' ? "هیچ گفتوگۆیەکی پیشوو نییە" : (lang === 'ar' ? "لا توجد محادثات سابقة" : "No past chats yet")}
            </div>
          ) : (
            chats.map((session) => {
              const isActive = session.id === activeChatId;
              return (
                <div 
                  key={session.id}
                  onClick={() => selectChat(session.id)}
                  className={`group flex items-center justify-between p-2.5 rounded-xl cursor-pointer text-xs transition-all ${
                    isActive 
                      ? 'bg-blue-50/70 text-[#0066FF] font-semibold' 
                      : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-950'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0 pr-1">
                    <MessageSquare className={`w-3.5 h-3.5 flex-none ${isActive ? 'text-[#0066FF]' : 'text-slate-400'}`} />
                    <span className="truncate text-right block max-w-[125px]">
                      {session.title || localizedDefaultChatTitle}
                    </span>
                  </div>
                  
                  {/* Delete Button (visible on group hover) */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(lang === 'ku' ? "دڵنیای لە سڕینەوەی ئەم گفتوگۆیە؟" : (lang === 'ar' ? "هل أنت متأكد من حذف هذه المحادثة؟" : "Are you sure you want to delete this chat?"))) {
                        deleteChat(session.id);
                      }
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-50 hover:text-red-600 text-slate-400 transition-all flex-none"
                    title="Delete Chat"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: Active dialogue container */}
      <div className="col-span-1 md:col-span-9 flex flex-col h-full overflow-hidden bg-white">
        {/* AI Operational Status Layer */}
        <div className="flex flex-wrap items-center justify-between px-6 py-2.5 bg-slate-50/50 border-b border-slate-100 select-none text-[10px] font-mono gap-y-2 flex-none">
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
            {/* Direct consultation indicator or new button on mobile */}
            <Button
              onClick={createNewChat}
              variant="outline"
              size="xs"
              className="md:hidden flex items-center gap-1 text-[10px] py-1 px-2.5 rounded-full"
            >
              <Plus className="w-3 h-3" />
              <span>{localizedNewChatBtn}</span>
            </Button>
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
            <div className="p-4 md:p-6 space-y-6 pb-12">
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
                  <div className="bg-slate-100 text-slate-700 px-4 py-2 rounded-full flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-[#0066FF]" />
                    <span className="text-xs font-semibold">{t.chat.thinking}</span>
                  </div>
                </div>
              )}
              <div ref={scrollRef} className="h-4" />
            </div>
          </ScrollArea>
        </div>

        {/* Quick Actions & Input area */}
        <div className="flex-none flex flex-col bg-white border-t border-slate-100">
          <div className="px-4 py-3 flex gap-2 overflow-x-auto bg-slate-50/50 custom-scrollbar">
            {activeQuickActions.map((action) => (
              <Button
                key={action.label}
                variant="outline"
                size="sm"
                className="whitespace-nowrap rounded-full text-[11px] bg-white text-slate-700 border-slate-200 hover:bg-slate-50 transition-all font-semibold"
                onClick={() => handleSend(action.prompt)}
              >
                <action.icon className="w-3.5 h-3.5 text-blue-500" />
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
      </div>
    </Card>
  );
}
