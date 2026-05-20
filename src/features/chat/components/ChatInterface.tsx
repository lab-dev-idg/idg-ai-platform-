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
  const { t } = useSettingsStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <Card className="lg:col-span-9 flex flex-col h-full overflow-hidden border-none shadow-2xl bg-white rounded-[32px]">
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
          {QUICK_ACTIONS.map((action) => (
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
