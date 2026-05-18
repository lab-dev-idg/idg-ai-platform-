import { useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { Bot, Loader2, Send, Package, ShieldAlert, FileText, Plane, DollarSign, UserCheck, Wallet, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useLanguage } from "@/lib/LanguageContext";

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

export interface Message {
  role: "user" | "model";
  text: string;
}

interface ChatInterfaceProps {
  messages: Message[];
  input: string;
  setInput: (val: string) => void;
  isLoading: boolean;
  handleSend: (text?: string) => Promise<void>;
  setSelectedMessage: (msg: Message) => void;
}

export function ChatInterface({ 
  messages, 
  input, 
  setInput, 
  isLoading, 
  handleSend, 
  setSelectedMessage 
}: ChatInterfaceProps) {
  const { t } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <Card className="lg:col-span-9 flex flex-col h-full overflow-hidden border-none shadow-2xl bg-white rounded-[32px]">
      {/* Messages Area */}
      <div className="flex-1 overflow-hidden relative">
        <ScrollArea className="h-full w-full">
          <div className="p-4 md:p-6 space-y-6">
            <AnimatePresence initial={false}>
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === "user" ? "justify-start" : "justify-end"}`}
                >
                  <div className="flex gap-3 max-w-[85%]">
                    <Avatar className="w-8 h-8 mt-1 border shadow-sm bg-[#0066ff]">
                      <AvatarFallback className="bg-[#0066ff] text-white">
                        <Bot className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>

                    <div
                      onClick={() => setSelectedMessage(msg)}
                      className={`group relative p-4 rounded-2xl shadow-sm cursor-pointer ${msg.role === 'model' ? 'ai-bubble' : 'bg-slate-100 text-slate-800'}`}
                    >
                      <div className="prose prose-sm max-w-none break-words">
                        <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                          {msg.text}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                </motion.div>
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

        <div className="p-3 md:p-4 border-t">
          <div className="relative flex items-center gap-2 md:gap-3 max-w-4xl mx-auto">
            <Input
              placeholder={t.chat.placeholder}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="h-12 md:h-14 rounded-xl md:rounded-2xl chat-input text-sm md:text-base border-2 focus-visible:ring-0"
            />
            <Button
              onClick={() => handleSend()}
              disabled={isLoading}
              className="h-12 w-12 md:h-14 md:w-14 rounded-xl md:rounded-2xl bg-[#0066FF] shrink-0 shadow-lg shadow-blue-500/30 hover:bg-[#005ce6] transition-all"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
