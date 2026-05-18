import { useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import ReactMarkdown from "react-markdown";

import { Toaster } from "@/components/ui/toaster";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { Sidebar } from "@/features/sidebar";
import { StatsSection } from "@/features/dashboard";
import { ChatInterface, Message } from "@/features/chat";
import { DashboardLayout } from "@/app/layouts/DashboardLayout";

export default function DashboardPage() {
  const { t: translations } = useLanguage();

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      text: "بەخێربێیت بۆ IDG Gateway",
    },
  ]);

  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const handleSend = async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim() || isLoading) return;

    const userMessage: Message = { role: "user" as const, text: messageText };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const chatHistory = messages.map(msg => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.text }]
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: messageText,
          history: chatHistory
        }),
      });

      if (!response.ok) throw new Error("Failed to get response");
      
      const data = await response.json();
      const modelMessage: Message = { role: "model" as const, text: data.text };
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: "model", text: "ببوورە دووچاری کێشەیەک بووم لە کاتی پەیوەندی کردن بە سێرڤەر." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const t = {
    ...translations,
    app: {
      ...translations.app,
      title: "IDG Gateway",
      subtitle: "IRAQ DIGITAL GATE",
    },
    sidebar: {
      ...translations.sidebar,
      marketSummary: "پوختەی بازاڕ",
      newTariff: "نوێترین گومرگ",
      newTariffDesc: "گۆڕانکاری نوێ لە نرخی گومرگی هاوردەدا زیاد کراوە.",
    },
    chat: {
      ...translations.chat,
      placeholder: "نامەیەک بنووسە...",
      thinking: "AI بیر دەکاتەوە...",
      detailsTitle: "وردەکاری نامە",
    },
  };

  return (
    <DashboardLayout>
      <Toaster position="top-center" richColors />
      <div className="flex-none">
        <StatsSection />
      </div>

      <main className="flex-1 min-h-0 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6 p-3 md:p-6 lg:pt-0">
        <Sidebar />
        <ChatInterface 
          messages={messages}
          input={input}
          setInput={setInput}
          isLoading={isLoading}
          handleSend={handleSend}
          setSelectedMessage={setSelectedMessage}
        />
      </main>

      <Dialog
        open={!!selectedMessage}
        onOpenChange={(open) => !open && setSelectedMessage(null)}
      >
        <DialogContent className="sm:max-w-md bg-white rounded-[24px]">
          <DialogHeader>
            <DialogTitle>
              {t.chat.detailsTitle}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <ReactMarkdown>
              {selectedMessage?.text || ""}
            </ReactMarkdown>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
