import { useSettingsStore } from '@/store/settingsStore';
import ReactMarkdown from "react-markdown";

import { Toaster } from "@/shared/ui/toaster";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog";

import { Sidebar } from "@/features/sidebar";
import { StatsSection } from "@/features/dashboard";
import { ChatInterface } from "@/features/chat";
import { DashboardLayout } from "@/app/layouts/DashboardLayout";
import { useChatStore } from "@/store/chatStore";

export default function DashboardPage() {
  const { t: translations } = useSettingsStore();

  const {
    messages,
    input,
    isLoading,
    selectedMessage,
    setInput,
    setSelectedMessage,
    handleSend
  } = useChatStore();

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
