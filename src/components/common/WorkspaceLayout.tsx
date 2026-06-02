import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useSettingsStore } from "@/store/settingsStore";
import { useChatStore } from "@/store/chatStore";
import { Toaster } from "@/shared/ui/toaster";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";

// Layout components
import { WorkspaceHeader } from "../workspace/WorkspaceHeader";
import { WorkspaceSidebar } from "../workspace/WorkspaceSidebar";
import { WorkspaceContent } from "../workspace/WorkspaceContent";
import { WorkspaceFooter } from "../workspace/WorkspaceFooter";

export default function WorkspaceLayout() {
  const { lang, setLang, t } = useSettingsStore();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Chat parameters matching original Home Page
  const {
    isLoading,
    handleSend
  } = useChatStore();

  // Handle URL query-prompt dispatching
  useEffect(() => {
    const initialPrompt = searchParams.get("prompt");
    if (initialPrompt && !isLoading && handleSend) {
      handleSend(initialPrompt);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, isLoading, handleSend, setSearchParams]);

  // Handle sidebar collapse state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    const saved = localStorage.getItem("idg-sidebar-collapsed");
    return saved === "true";
  });

  // Mobile drawer state
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  const startNewSession = () => {
    // Reset Chat messages
    const { setMessages, setInput } = useChatStore.getState();
    setMessages([
      {
        role: "model",
        text: lang === "ku" 
          ? "سڵاو و ڕێز، من یاریدەدەری زیرەکی لۆجیستیکی و گومرگی عێراقم. سێشنی نوێ دەستی پێکرد. چۆن دەتوانم یارمەتیت بدەم؟"
          : "أهلاً بك، أنا مساعدك اللوجستي والجمركي الذكي في العراق. تم بدء جلسة جديدة. كيف يمكنني مساعدتك اليوم؟",
      }
    ]);
    setInput("");
    navigate("/");
    setIsMobileSidebarOpen(false);
  };

  // Determine current alignment and text direction
  const isRtl = lang === "ku" || lang === "ar";
  const dir = isRtl ? "rtl" : "ltr";

  return (
    <ErrorBoundary>
      <div 
        id="idg-workspace-shell" 
        className="h-screen w-screen flex overflow-hidden bg-slate-50 text-[#071739] font-sans antialiased" 
        dir={dir}
      >
        {/* Drawer and Sidebar triggers */}
        <WorkspaceSidebar 
          lang={lang}
          pathname={pathname}
          isSidebarCollapsed={isSidebarCollapsed}
          setIsSidebarCollapsed={setIsSidebarCollapsed}
          isMobileSidebarOpen={isMobileSidebarOpen}
          setIsMobileSidebarOpen={setIsMobileSidebarOpen}
          startNewSession={startNewSession}
        />

        {/* Primary content view container */}
        <div className="flex-1 flex flex-col min-w-0 h-full relative overflow-hidden">
          <WorkspaceHeader 
            lang={lang}
            setLang={setLang}
            t={t}
            setIsMobileSidebarOpen={setIsMobileSidebarOpen}
          />
          
          {/* Dynamic Inner Router view */}
          <WorkspaceContent 
            lang={lang}
            setLang={setLang}
          />

          <WorkspaceFooter 
            lang={lang}
          />
        </div>

        <Toaster />
      </div>
    </ErrorBoundary>
  );
}
