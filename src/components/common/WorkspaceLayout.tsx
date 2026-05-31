import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useSettingsStore } from "@/store/settingsStore";
import { useChatStore } from "@/store/chatStore";
import { Toaster } from "@/shared/ui/toaster";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { motion, AnimatePresence } from "motion/react";

// Icons
import {
  Sparkles,
  Globe,
  Compass,
  Briefcase,
  Database,
  TrendingUp,
  Terminal,
  Lock,
  Settings,
  User,
  Coins,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Search,
  Bell,
  Clock,
  ShieldAlert,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  ExternalLink,
  CheckCircle2
} from "lucide-react";

// Features Import
import { ChatInterface } from "@/features/chat";
import { CustomsModule } from "@modules/customs";
import { CurrencyConverter } from "@/features/currency";
import { ShippingCalculator } from "@/features/sidebar/components/ShippingCalculator";
import { KYCForm } from "@/features/sidebar/components/KYCForm";
import { ProcurementSourcing } from "@/features/sidebar/components/ProcurementSourcing";
import { ShipmentTracker } from "@/features/sidebar/components/ShipmentTracker";
import { LogisticsMap } from "@/features/sidebar/components/LogisticsMap";

import { NationalTradeObservatory } from "@/features/intelligence/components/NationalTradeObservatory";
import { ScenarioSimulationEngine } from "@/features/intelligence/components/ScenarioSimulationEngine";
import { EconomicKnowledgeGraph } from "@/features/intelligence/components/EconomicKnowledgeGraph";
import { EarlyWarningSystem, SecurityGovernancePane } from "@/features/intelligence/components/IntelligenceSupportingElements";
import { StatsSection } from "@/features/dashboard";
import { GovernmentShowcase } from "@/features/dashboard/components/GovernmentShowcase";

// Design Token Imports
import { typography } from "@/design-system/typography";

export default function WorkspaceLayout() {
  const { lang, setLang, t } = useSettingsStore();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Tab state for switching between National Executive Command Center dashboard & Interactive National AI Assistant chat
  const [activeCenterTab, setActiveCenterTab] = useState<"command" | "assistant">("command");
  // Alert filtering state
  const [filterAlertSeverity, setFilterAlertSeverity] = useState<"ALL" | "CRITICAL" | "WARNING" | "INFO">("ALL");

  // Handle sidebar collapse state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    const saved = localStorage.getItem("idg-sidebar-collapsed");
    return saved === "true";
  });

  // Mobile drawer state
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);

  // Notifications state
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: "نوێکردنەوەی تاریفە", desc: "ڕێژەی گومرگی ئامێرە ئەلیکترۆنییەکان بۆ ساڵی ٢٠٢٦ هەموار کرایەوە.", time: "٥ خولەک پێش ئێستا", read: false },
    { id: 2, title: "مەرزى ئوم قەسر", desc: "دۆخی مەرزەکە گۆڕدرا بۆ چالاک و ئاسایی.", time: "٢٥ خولەک پێش ئێستا", read: false },
    { id: 3, title: "هاوتاکردنی دراو", desc: "نرخی ئاڵوگۆڕی دینار بەرامبەر دۆلار بە پێی دوایین ئاماری فەرمی بازاڕ بەرز بووەتەوە.", time: "٣ کاتژمێر پێش ئێستا", read: true }
  ]);

  // Baghdad Real Time Clock
  const [baghdadTime, setBaghdadTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const bgw = new Date(utc + 3600000 * 3);
      const hours = String(bgw.getHours()).padStart(2, "0");
      const minutes = String(bgw.getMinutes()).padStart(2, "0");
      const seconds = String(bgw.getSeconds()).padStart(2, "0");
      setBaghdadTime(`${hours}:${minutes}:${seconds} BGW`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Sovereign Services Status Diagnostic Hook
  const [diagnostics, setDiagnostics] = useState<{gemini: string; maps: string; firebase: string}>({
    gemini: "Connected",
    maps: "Connected",
    firebase: "Connected"
  });

  useEffect(() => {
    fetch("/api/diagnostics")
      .then(res => res.json())
      .then(data => {
        if (data && data.gemini) {
          setDiagnostics(data);
        }
      })
      .catch(err => {
        console.error("Failed to fetch diagnostics:", err);
      });
  }, []);

  // Handle URL query-prompt dispatching
  useEffect(() => {
    const initialPrompt = searchParams.get("prompt");
    if (initialPrompt && !isLoading && handleSend) {
      handleSend(initialPrompt);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, isLoading, handleSend, setSearchParams]);

  const handleSidebarToggle = () => {
    const nextState = !isSidebarCollapsed;
    setIsSidebarCollapsed(nextState);
    localStorage.setItem("idg-sidebar-collapsed", String(nextState));
  };

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

  // Sidebar navigation structure config
  const navigationItems = {
    main: [
      { id: "assistant", labelKu: "یارمەتیدەری زیرەکی نیشتمانی", labelAr: "المساعد الذكي الوطني", path: "/", icon: Sparkles },
      { id: "customs", labelKu: "دەروازەی گومرگ", labelAr: "بوابة الجمارك", path: "/customs", icon: Globe },
      { id: "logistics", labelKu: "لۆجیستیک و چاودێری", labelAr: "التتبع واللوجستيات", path: "/logistics", icon: Compass },
      { id: "banking", labelKu: "دارایی و دراو", labelAr: "الخدمات المصرفية والنقد", path: "/banking", icon: Coins },
      { id: "compliance", labelKu: "پێوەر و سەرپێچی", labelAr: "الامتثال والتحقق", path: "/compliance", icon: Briefcase },
      { id: "knowledge", labelKu: "تۆڕی زانیاری بەستراو", labelAr: "قاعدة المعرفة والربط", path: "/knowledge", icon: Database }
    ],
    operations: [
      { id: "analytics", labelKu: "شیكردنەوە و هەڵسەنگاندن", labelAr: "التحليل والتقييم", path: "/analytics", icon: TrendingUp },
      { id: "command", labelKu: "هاوشێوەسازی و بڕیاردان", labelAr: "العمليات والمحاكاة", path: "/command", icon: Terminal },
      { id: "showcase", labelKu: "نمایشی فەرمی دەوڵەت", labelAr: "العرض الوطني الحكومي", path: "/showcase", icon: Activity }
    ],
    system: [
      { id: "admin", labelKu: "بەڕێوەبردن و چاودێری", labelAr: "الإدارة والنظام", path: "/admin", icon: Lock },
      { id: "settings", labelKu: "ڕێکخستنەکان", labelAr: "الإعدادات", path: "/settings", icon: Settings }
    ],
    user: [
      { id: "profile", labelKu: "پڕۆفایلی بەکارهێنەر", labelAr: "الملف الشخصي", path: "/profile", icon: User }
    ]
  };

  // Check which item is currently selected
  const activeItem = Object.values(navigationItems)
    .flat()
    .find(item => item.path === pathname) || navigationItems.main[0];

  // Helper selector for localization
  const getLabel = (item: { labelKu: string; labelAr: string }) => {
    return lang === "ku" ? item.labelKu : item.labelAr;
  };

  // Pre-filter/Search through navigation elements
  const allNavFlat = Object.values(navigationItems).flat();
  const searchResults = searchQuery.trim() 
    ? allNavFlat.filter(item => 
        getLabel(item).toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Notifications handler
  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  // Chat parameters matching original Home Page
  const {
    messages,
    input,
    isLoading,
    setInput,
    setSelectedMessage,
    handleSend
  } = useChatStore();

  return (
    <div 
      className="flex h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100 overflow-hidden font-sans" 
      dir={dir}
      style={{
        fontFamily: isRtl ? typography.fonts.arabic : typography.fonts.sans
      }}
    >
      <Toaster position="top-center" richColors />

      {/* 1. LEFT SIDEBAR NAVIGATION (Desktop) */}
      <aside 
        className={`hidden md:flex flex-col border-e border-slate-200 dark:border-slate-800 bg-[#071739] text-white shrink-0 transition-all duration-300 relative select-none ${
          isSidebarCollapsed ? "w-[72px]" : "w-64"
        }`}
      >
        {/* State Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/5 shrink-0 overflow-hidden">
          <Link to="/" className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-[#0066FF] flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
              <Globe className="w-4 h-4 text-white" />
            </div>
            {!isSidebarCollapsed && (
              <div className="flex flex-col truncate">
                <span className="text-xs font-black uppercase tracking-wider text-slate-100">
                  {lang === "ku" ? "دەروازەی دیجیتاڵی عێراق" : "بوابة العراق الرقمية"}
                </span>
                <span className="text-[9px] text-[#0066FF] font-bold tracking-widest uppercase">
                  {lang === "ku" ? "سیستەمی فەرمی دەوڵەت" : "النظام الرسمي للدولة"}
                </span>
              </div>
            )}
          </Link>
        </div>

        {/* New Session Action trigger Button */}
        <div className="p-3 shrink-0">
          <Button
            onClick={startNewSession}
            variant="ghost"
            className={`w-full h-10 flex items-center gap-2 rounded-xl text-xs font-bold transition-all border border-dashed border-white/10 hover:border-white/30 hover:bg-white/5 active:scale-97 text-slate-100 ${
              isSidebarCollapsed ? "justify-center px-0" : "justify-start px-3"
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#F59E0B]" />
            {!isSidebarCollapsed && (
              <span>{lang === "ku" ? "سێشنی نوێ" : "جلسة جديدة"}</span>
            )}
          </Button>
        </div>

        {/* Collapsible grouped sidebar items */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-3 py-2 space-y-4">
          
          {/* MAIN GROUP */}
          <div>
            {!isSidebarCollapsed && (
              <p className="text-[10px] font-bold uppercase text-slate-500 tracking-wider mb-1 px-3">
                {lang === "ku" ? "سەرەکی" : "الرئيسية"}
              </p>
            )}
            <ul className="space-y-1">
              {navigationItems.main.map(item => {
                const Icon = item.icon;
                const isItemActive = pathname === item.path || (item.id === "assistant" && pathname === "/");
                return (
                  <li key={item.id}>
                    <Link
                      to={item.path}
                      className={`flex items-center gap-3 py-2 px-3 rounded-xl transition-all ${
                        isSidebarCollapsed ? "justify-center" : "justify-start"
                      } ${
                        isItemActive
                          ? "bg-[#0066FF] text-white font-semibold text-xs shadow-md shadow-blue-500/10"
                          : "text-slate-300 hover:bg-white/5 hover:text-white text-xs"
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {!isSidebarCollapsed && <span className="truncate">{getLabel(item)}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* OPERATIONS GROUP */}
          <div>
            {!isSidebarCollapsed && (
              <p className="text-[10px] font-bold uppercase text-slate-500 tracking-wider mb-1 px-3">
                {lang === "ku" ? "ئۆپەراسیۆنەکان" : "العمليات"}
              </p>
            )}
            <ul className="space-y-1">
              {navigationItems.operations.map(item => {
                const Icon = item.icon;
                const isItemActive = pathname === item.path;
                return (
                  <li key={item.id}>
                    <Link
                      to={item.path}
                      className={`flex items-center gap-3 py-2 px-3 rounded-xl transition-all ${
                        isSidebarCollapsed ? "justify-center" : "justify-start"
                      } ${
                        isItemActive
                          ? "bg-[#0066FF] text-white font-semibold text-xs shadow-md shadow-blue-500/10"
                          : "text-slate-300 hover:bg-white/5 hover:text-white text-xs"
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {!isSidebarCollapsed && <span className="truncate">{getLabel(item)}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* SYSTEM GROUP */}
          <div>
            {!isSidebarCollapsed && (
              <p className="text-[10px] font-bold uppercase text-slate-500 tracking-wider mb-1 px-3">
                {lang === "ku" ? "سەرچاوە و سیستەم" : "النظام"}
              </p>
            )}
            <ul className="space-y-1">
              {navigationItems.system.map(item => {
                const Icon = item.icon;
                const isItemActive = pathname === item.path;
                return (
                  <li key={item.id}>
                    <Link
                      to={item.path}
                      className={`flex items-center gap-3 py-2 px-3 rounded-xl transition-all ${
                        isSidebarCollapsed ? "justify-center" : "justify-start"
                      } ${
                        isItemActive
                          ? "bg-[#0066FF] text-white font-semibold text-xs shadow-md shadow-blue-500/10"
                          : "text-slate-300 hover:bg-white/5 hover:text-white text-xs"
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {!isSidebarCollapsed && <span className="truncate">{getLabel(item)}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* USER GROUP */}
          <div>
            {!isSidebarCollapsed && (
              <p className="text-[10px] font-bold uppercase text-slate-500 tracking-wider mb-1 px-3">
                {lang === "ku" ? "حساب" : "الحساب"}
              </p>
            )}
            <ul className="space-y-1">
              {navigationItems.user.map(item => {
                const Icon = item.icon;
                const isItemActive = pathname === item.path;
                return (
                  <li key={item.id}>
                    <Link
                      to={item.path}
                      className={`flex items-center gap-3 py-2 px-3 rounded-xl transition-all ${
                        isSidebarCollapsed ? "justify-center" : "justify-start"
                      } ${
                        isItemActive
                          ? "bg-[#0066FF] text-white font-semibold text-xs shadow-md shadow-blue-500/10"
                          : "text-slate-300 hover:bg-white/5 hover:text-white text-xs"
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {!isSidebarCollapsed && <span className="truncate">{getLabel(item)}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Collapse side-bar trigger footer switch */}
        <div className="p-3 border-t border-white/5 shrink-0 flex items-center justify-center">
          <Button
            onClick={handleSidebarToggle}
            variant="ghost"
            className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center p-0 text-slate-400 hover:text-white"
          >
            {isSidebarCollapsed ? (
              isRtl ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
            ) : (
              isRtl ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />
            )}
          </Button>
        </div>
      </aside>

      {/* MOBILE COLLAPSIBLE DRAWER SIDEBAR */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileSidebarOpen(false)}
              className="fixed inset-0 bg-black z-40 md:hidden"
            />
            <motion.aside
              initial={{ x: isRtl ? "100%" : "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: isRtl ? "100%" : "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="fixed top-0 bottom-0 z-50 w-72 bg-[#071739] text-white border-r border-[#1E293B] shadow-2xl flex flex-col md:hidden"
              style={{
                right: isRtl ? 0 : "auto",
                left: isRtl ? "auto" : 0
              }}
            >
              <div className="h-16 flex items-center justify-between px-4 border-b border-white/5 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#0066FF] flex items-center justify-center">
                    <Globe className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-xs font-black uppercase tracking-wider">
                      {lang === "ku" ? "دەروازەی دیجیتاڵی عێراق" : "بوابة العراق الرقمية"}
                    </span>
                    <span className="text-[9px] text-[#0066FF] font-bold tracking-widest uppercase">
                      {lang === "ku" ? "سیستەمی فەرمی دەوڵەت" : "النظام الرسمي للدولة"}
                    </span>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="text-white hover:bg-white/5"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="p-3">
                <Button
                  onClick={startNewSession}
                  className="w-full justify-start gap-2 h-10 border border-dashed border-white/10 hover:bg-white/5 text-slate-100"
                >
                  <Sparkles className="w-4 h-4 text-[#F59E0B]" />
                  <span>{lang === "ku" ? "سێشنی نوێ" : "جلسة جديدة"}</span>
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4">
                {/* Main */}
                <div>
                  <p className="text-[10px] font-bold uppercase text-slate-500 tracking-wider mb-1 px-3">
                    {lang === "ku" ? "سەرەکی" : "الرئيسية"}
                  </p>
                  <ul className="space-y-1">
                    {navigationItems.main.map(item => {
                      const Icon = item.icon;
                      const isItemActive = pathname === item.path || (item.id === "assistant" && pathname === "/");
                      return (
                        <li key={item.id}>
                          <Link
                            to={item.path}
                            onClick={() => setIsMobileSidebarOpen(false)}
                            className={`flex items-center gap-3 py-2 px-3 rounded-xl transition-all ${
                              isItemActive
                                ? "bg-[#0066FF] text-white font-semibold text-xs shadow-md shadow-blue-500/10"
                                : "text-slate-300 hover:bg-white/5 hover:text-white text-xs"
                            }`}
                          >
                            <Icon className="w-4 h-4 shrink-0" />
                            <span>{getLabel(item)}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Operations */}
                <div>
                  <p className="text-[10px] font-bold uppercase text-slate-500 tracking-wider mb-1 px-3">
                    {lang === "ku" ? "ئۆپەراسیۆنەکان" : "العمليات"}
                  </p>
                  <ul className="space-y-1">
                    {navigationItems.operations.map(item => {
                      const Icon = item.icon;
                      const isItemActive = pathname === item.path;
                      return (
                        <li key={item.id}>
                          <Link
                            to={item.path}
                            onClick={() => setIsMobileSidebarOpen(false)}
                            className={`flex items-center gap-3 py-2 px-3 rounded-xl transition-all ${
                              isItemActive
                                ? "bg-[#0066FF] text-white font-semibold text-xs shadow-md shadow-blue-500/10"
                                : "text-slate-300 hover:bg-white/5 hover:text-white text-xs"
                            }`}
                          >
                            <Icon className="w-4 h-4 shrink-0" />
                            <span>{getLabel(item)}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* System */}
                <div>
                  <p className="text-[10px] font-bold uppercase text-slate-500 tracking-wider mb-1 px-3">
                    {lang === "ku" ? "ئیدارە و ڕێکخستن" : "النظام"}
                  </p>
                  <ul className="space-y-1">
                    {navigationItems.system.map(item => {
                      const Icon = item.icon;
                      const isItemActive = pathname === item.path;
                      return (
                        <li key={item.id}>
                          <Link
                            to={item.path}
                            onClick={() => setIsMobileSidebarOpen(false)}
                            className={`flex items-center gap-3 py-2 px-3 rounded-xl transition-all ${
                              isItemActive
                                ? "bg-[#0066FF] text-white font-semibold text-xs shadow-md shadow-blue-500/10"
                                : "text-slate-300 hover:bg-white/5 hover:text-white text-xs"
                            }`}
                          >
                            <Icon className="w-4 h-4 shrink-0" />
                            <span>{getLabel(item)}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* User */}
                <div>
                  <p className="text-[10px] font-bold uppercase text-slate-500 tracking-wider mb-1 px-3">
                    {lang === "ku" ? "ئەکاونت" : "الحساب"}
                  </p>
                  <ul className="space-y-1">
                    {navigationItems.user.map(item => {
                      const Icon = item.icon;
                      const isItemActive = pathname === item.path;
                      return (
                        <li key={item.id}>
                          <Link
                            to={item.path}
                            onClick={() => setIsMobileSidebarOpen(false)}
                            className={`flex items-center gap-3 py-2 px-3 rounded-xl transition-all ${
                              isItemActive
                                ? "bg-[#0066FF] text-white font-semibold text-xs shadow-md shadow-blue-500/10"
                                : "text-slate-300 hover:bg-white/5 hover:text-white text-xs"
                            }`}
                          >
                            <Icon className="w-4 h-4 shrink-0" />
                            <span>{getLabel(item)}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* MAIN CONTAINER (Topbar + Content Area) */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* 2. TOP NAVIGATION BAR */}
        <header className="h-16 flex items-center justify-between px-4 md:px-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] shadow-xs select-none z-30 shrink-0">
          
          {/* Mobile hamburger menu button */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="md:hidden text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Menu className="w-5 h-5" />
            </Button>

            {/* Breadcrumb Area within shell */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span className="text-slate-400 select-none">
                {lang === "ku" ? "بۆردی نیشتمانی" : "المجلس الوطني"}
              </span>
              <span>/</span>
              <span className="text-[#0066FF] font-bold flex items-center gap-1.5 capitalize">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0066FF] animate-pulse" />
                {activeItem ? getLabel(activeItem) : (lang === "ku" ? "کابینەی فەرمی" : "مقصورة العمليات")}
              </span>
            </div>
          </div>

          {/* Interactive Core Elements (Search, Notifications, Lang, Health, user) */}
          <div className="flex items-center gap-3">
            
            {/* Global Search Interface */}
            <div className="relative">
              <div className="hidden xs:flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl px-2.5 py-1.5 w-44 md:w-64 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all">
                <Search className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 dark:text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchActive(!!e.target.value);
                  }}
                  placeholder={lang === "ku" ? "گەڕان لە خزمەتگوزاری..." : "البحث في الخدمات..."}
                  className="bg-transparent border-none outline-none text-xs w-full text-slate-800 dark:text-slate-100 focus:ring-0 ps-2"
                />
                {searchQuery && (
                  <button onClick={() => { setSearchQuery(""); setIsSearchActive(false); }} className="text-slate-400 hover:text-slate-600">
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Dynamic search results dropdown */}
              {isSearchActive && searchQuery && (
                <div 
                  className="absolute top-11 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl w-64 max-h-60 overflow-y-auto p-1.5 z-50 text-xs text-slate-800 dark:text-slate-200 font-sans"
                  style={{ left: isRtl ? "auto" : 0, right: isRtl ? 0 : "auto" }}
                >
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold px-2 py-1 select-none">
                    {lang === "ku" ? "ئەنجامەکانی گەڕان" : "نتائج البحث"}
                  </p>
                  {searchResults.length > 0 ? (
                    searchResults.map(item => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.id}
                          to={item.path}
                          onClick={() => { setSearchQuery(""); setIsSearchActive(false); }}
                          className="flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                        >
                          <Icon className="w-3.5 h-3.5 text-blue-500" />
                          <span>{getLabel(item)}</span>
                        </Link>
                      );
                    })
                  ) : (
                    <p className="text-slate-400 py-3 text-center">
                      {lang === "ku" ? "هیچ خزمەتگوزارییەک نەدۆزرایەوە" : "لم يتم العثور على نتائج"}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Notifications trigger */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className={`relative rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 ${
                  notifications.some(n => !n.read) ? "after:absolute after:w-1.5 after:h-1.5 after:bg-red-500 after:rounded-full after:top-2.5 after:right-2.5" : ""
                }`}
              >
                <Bell className="w-4 h-4" />
              </Button>

              {/* Interactive notification card sheet dropdown */}
              {isNotificationsOpen && (
                <div 
                  className="absolute top-11 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-4 z-50 font-sans text-xs"
                  style={{ right: isRtl ? 0 : "auto", left: isRtl ? "auto" : 0 }}
                >
                  <div className="flex items-center justify-between border-b pb-2 mb-2 border-slate-100 dark:border-slate-800 select-none">
                    <span className="font-bold text-slate-800 dark:text-slate-100">
                      {lang === "ku" ? "ئاگادارکردنەوەکان" : "الإشعارات"}
                    </span>
                    <button 
                      onClick={markAllAsRead} 
                      className="text-[10px] font-bold text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      {lang === "ku" ? "هەموو بخوێنەرەوە" : "تحديد الكل كمقروء"}
                    </button>
                  </div>
                  <div className="space-y-2.5 max-h-60 overflow-y-auto custom-scrollbar">
                    {notifications.map(notif => (
                      <div 
                        key={notif.id} 
                        className={`p-2.5 rounded-xl border transition-all ${
                          notif.read 
                            ? "bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800" 
                            : "bg-[#0066FF]/5 border-[#0066FF]/10"
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold mb-1">
                          <span className={notif.read ? "text-slate-700 dark:text-slate-300" : "text-slate-900 dark:text-white"}>
                            {notif.title}
                          </span>
                          <span className="text-[9px] text-slate-400 font-normal">{notif.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                          {notif.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Language Switcher */}
            <div className="bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700 flex">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLang("ku")}
                className={`h-7 px-2.5 text-[10px] font-bold rounded-lg transition-all ${
                  lang === "ku" 
                    ? "bg-[#0066FF] text-white hover:bg-[#0066FF]/90 shadow-sm" 
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-transparent"
                }`}
              >
                Kurdî
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLang("ar")}
                className={`h-7 px-2.5 text-[10px] font-bold rounded-lg transition-all ${
                  lang === "ar" 
                    ? "bg-[#0066FF] text-white hover:bg-[#0066FF]/90 shadow-sm" 
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-transparent"
                }`}
              >
                عربي
              </Button>
            </div>

            {/* Baghdad clock & active health status */}
            <div className="hidden xl:flex items-center gap-2">
              <Badge variant="outline" className="bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/80 py-1 font-mono tracking-wider text-[10px] uppercase font-semibold flex items-center gap-1.5 rounded-lg text-slate-700 dark:text-slate-300">
                <Clock className="w-3 h-3 text-blue-500" />
                <span>{baghdadTime}</span>
              </Badge>
              <Badge variant="outline" className="bg-green-500/5 dark:bg-green-900/10 text-green-600 dark:text-green-400 border-green-500/20 py-1 font-sans text-[10px] font-bold flex items-center gap-1 rounded-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shrink-0" />
                <span>{t.app?.systemActive || "سیستەم چاڵاکە"}</span>
              </Badge>
            </div>

            {/* Minimal High-Contract User Profile Icon */}
            <div className="flex items-center border-s border-slate-200 dark:border-slate-800 ps-2">
              <Link 
                to="/profile"
                className="w-8 h-8 rounded-full bg-[#071739] border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-100 font-bold hover:opacity-90 active:scale-95 transition"
              >
                <User className="w-4 h-4" />
              </Link>
            </div>

          </div>
        </header>

        {/* 3. DYNAMIC WORKSPACE BODY CONTAINER */}
        <div className="flex-1 overflow-hidden flex flex-col">
          
          {/* Header Area in Workspace */}
          <div className="bg-white dark:bg-[#0f172a] border-b border-slate-100 dark:border-slate-800 px-6 py-4 shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base md:text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                  {activeItem ? getLabel(activeItem) : (lang === "ku" ? "داشبۆردی نیشتمانی" : "لوحة القيادة الوطنية")}
                </h2>
                <Badge variant="outline" className="text-[8px] md:text-[9px] uppercase tracking-wide px-1.5 py-0.5 border-slate-200 dark:border-slate-700 font-sans text-slate-500 dark:text-slate-400">
                  {lang === "ku" ? "سیستەمی فەرمی" : "النظام المصدق"}
                </Badge>
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                {pathname === "/" && (lang === "ku" ? "دەروازەی یاریدەدەری ژیری دەستکردی لۆجیستیکی و بازرگانی" : "بوابة المساعد الذكي للأتمتة والذكاء الاصطناعي")}
                {pathname === "/customs" && (lang === "ku" ? "پۆلێنکاری و خەمڵاندنی بارنامە و گۆڕینی گرێبەستی گومرگی" : "إيداع البيانات واحتساب التعرفة الجمركية والضرائب")}
                {pathname === "/logistics" && (lang === "ku" ? "چاودێری دەریایی، مانیفێست، دۆخی بارهەڵگر، و حساباتی ڕووپۆش" : "تتبع الشحنات الملاحية عبر المرافئ والمنافذ الحدودية")}
                {pathname === "/banking" && (lang === "ku" ? "نرخی فەرمی بانکی، ئاڵوگۆڕی هاوتەریب، و پێوەری بازاڕ" : "التحقق والتحويل والتداول النقدي وسعر دينار العقوبات")}
                {pathname === "/compliance" && (lang === "ku" ? "ناسنامەی بازرگان (KYC)، پشکنینی پڕۆفایل، و گرێبەستەکان" : "أمن الحدود والامتثال الجمركي ومكافحة غسيل الأموال")}
                {pathname === "/knowledge" && (lang === "ku" ? "تۆڕی گرێدراوی فەرمی کاڵاکان، بەستەرەکان، و ڕێسا بازرگانییەکان" : "الترابط الهيكلي الاقتصادي ودليل مرجعية السلع")}
                {pathname === "/analytics" && (lang === "ku" ? "شاخص و نەخشەی جووڵەی گشتی کاڵاکانی هاوردە لە عێراق" : "مؤشرات التجارة الخارجية والتدفقات السلعية والمالية")}
                {pathname === "/command" && (lang === "ku" ? "هاوشێوەسازی ڕێچکەی بازرگانی و کاریگەری بڕیار لەسەر بازاڕ" : "محاكاة السياسات الجمركية والإنذار المبكر للأزمات")}
                {pathname === "/showcase" && (lang === "ku" ? "سەکۆی ڕاستەوخۆی نیشاندانی تاقیکاری ژیری دەستکرد بۆ سەرۆکایەتی حکومەت" : "حزمة العرض والتحاكي الوطني الموجهة للمجلس والمستوى الحكومي")}
                {pathname === "/admin" && (lang === "ku" ? "چاودێری یەکپارچەی لۆگەکانی سیستەم و ئۆدێتی چالاکییەکان" : "سجلات الأمان والتحقق من العمليات التشغيلية")}
                {pathname === "/settings" && (lang === "ku" ? "پێوەر و زانیاری ڕێکخستنی سەکۆی نیشتمانی" : "تفضيلات وإعدادات النظام واللغة المستهدفة")}
                {pathname === "/profile" && (lang === "ku" ? "وردەکاری ئاسایشی حساب و مۆڵەتە دەوڵەتییەکان" : "ملف تعريف المستخدم والتحقق التشغيلي الموثوق")}
              </p>
            </div>

            {/* Quick Status Pill / System state indicator representing sovereign clearance */}
            <div className="flex items-center gap-2 select-none self-start md:self-auto font-sans text-[10px]">
              <span className="text-slate-400">{lang === "ku" ? "ئاسایش:" : "الأمن:"}</span>
              <span className="bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded border border-blue-500/20 font-bold uppercase tracking-wider">
                {lang === "ku" ? "ڕێگەپێدانی فەرمی: ئاستی باڵا" : "ترخيص أمني: درجة سيادية"}
              </span>
            </div>
          </div>

          {/* Core Content Area & Action Area inside Workspace */}
          <main className="flex-1 min-h-0 overflow-y-auto px-6 py-6 scrollbar-thin dark:scrollbar-slate-800">
            <div className="max-w-7xl mx-auto w-full h-full flex flex-col gap-6">

              {/* DYNAMIC CONTENT SWITCHER */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={pathname}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="h-full flex flex-col"
                >
                  
                  {/* WORKSPACE 1: AI ASSISTANT & NATIONAL EXECUTIVE COMMAND CENTER */}
                  {(pathname === "/" || pathname === "/assistant") && (
                    <div className="w-full h-full flex-1 flex flex-col gap-6 pb-20">
                      
                      {/* Premium Executive Tab Bar Switcher */}
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 bg-[#0066FF]/10 text-[#0066FF] rounded-xl">
                            <Activity className="w-5 h-5 flex items-center justify-center text-[#0066FF]" />
                          </div>
                          <div>
                            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                              {lang === "ku" ? "بنکەی نیشتمانی بۆ چاودێری و بڕیاردان" : "المركز الوطني للمراقبة واتخاذ القرار"}
                            </h3>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium font-sans">
                              {lang === "ku" ? "سیستەمی فەرمی سەرپەرشتی حکومەتی فیدراڵی عێراق" : "النظام الرسمي الموحد لحكومة جمهورية العراق الفيدرالية"}
                            </p>
                          </div>
                        </div>

                        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border dark:border-slate-700">
                          <button
                            onClick={() => setActiveCenterTab("command")}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              activeCenterTab === "command"
                                ? "bg-white dark:bg-[#071739] text-[#0066FF] dark:text-white shadow-xs"
                                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                            }`}
                          >
                            {lang === "ku" ? "تەلاری بڕیاردان و چاودێری نیشتمانی" : "مجمع العمليات والقيادة الوطني"}
                          </button>
                          <button
                            onClick={() => setActiveCenterTab("assistant")}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              activeCenterTab === "assistant"
                                ? "bg-white dark:bg-[#071739] text-[#0066FF] dark:text-white shadow-xs"
                                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                            }`}
                          >
                            <span className="flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
                              {lang === "ku" ? "یارمەتیدەری زیرەکی نیشتمانی" : "المساعد الذكي التفاعلي الوطني"}
                            </span>
                          </button>
                        </div>
                      </div>

                      {activeCenterTab === "command" ? (
                        /* NATIONAL OPERATIONS CENTER (THE CORE COMMAND CENTER VIEW) */
                        <div className="w-full h-full flex-1 min-h-0 flex flex-col lg:grid lg:grid-cols-12 gap-6">
                          
                          {/* Main Left Side (9 grid columns) */}
                          <div className="lg:col-span-9 flex flex-col gap-6">
                            
                            {/* TOP: National Status Bar with 6 KPI Large Cards */}
                            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
                              
                              {/* Card 1: Active Transactions */}
                              <div className="bg-white dark:bg-[#0f172a] p-4 rounded-2xl border border-slate-200 dark:border-slate-850 shadow-2xs hover:border-blue-500/30 transition flex flex-col justify-between relative overflow-hidden group">
                                <span className="text-[10px] text-slate-400 font-bold select-none truncate">
                                  {lang === "ku" ? "کارامەییە چالاکەکان" : "المعاملات النشطة اليوم"}
                                </span>
                                <div className="mt-2 flex items-baseline justify-between">
                                  <span className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">٤،٢٨٠</span>
                                  <span className="text-[10px] text-green-500 font-bold flex items-center gap-0.5">
                                    <ArrowUpRight className="w-3 h-3" /> +12.4%
                                  </span>
                                </div>
                                <div className="mt-3 text-[9px] text-slate-500 font-medium flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                  <span>{lang === "ku" ? "لە کاتی ڕاستەقینە" : "تحديث مباشر"}</span>
                                </div>
                              </div>

                              {/* Card 2: Customs Clearances Today */}
                              <div className="bg-white dark:bg-[#0f172a] p-4 rounded-2xl border border-slate-200 dark:border-slate-850 shadow-2xs hover:border-blue-500/30 transition flex flex-col justify-between relative overflow-hidden group">
                                <span className="text-[10px] text-slate-400 font-bold select-none truncate">
                                  {lang === "ku" ? "ڕێکارە گومرگییەکانی ئەمڕۆ" : "المخلصات الجمركية اليوم"}
                                </span>
                                <div className="mt-2 flex items-baseline justify-between">
                                  <span className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">٢،١٥٠</span>
                                  <span className="text-[10px] text-green-500 font-bold flex items-center gap-0.5">
                                    <ArrowUpRight className="w-3 h-3" /> +8.2%
                                  </span>
                                </div>
                                <div className="mt-3 text-[9px] text-slate-500 font-medium flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                  <span>{lang === "ku" ? "سەکۆی فیدراڵی" : "المنصة الفيدرالية"}</span>
                                </div>
                              </div>

                              {/* Card 3: National Risk Index */}
                              <div className="bg-white dark:bg-[#0f172a] p-4 rounded-2xl border border-slate-200 dark:border-slate-850 shadow-2xs hover:border-rose-500/30 transition flex flex-col justify-between relative overflow-hidden group">
                                <span className="text-[10px] text-slate-400 font-bold select-none truncate">
                                  {lang === "ku" ? "شاخصی مەترسی نیشتمانی" : "مؤشر المخاطر الوطني"}
                                </span>
                                <div className="mt-2 flex items-baseline justify-between">
                                  <span className="text-xl md:text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">%١٤</span>
                                  <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-0.5">
                                    <ArrowDownRight className="w-3 h-3" /> -3.5%
                                  </span>
                                </div>
                                <div className="mt-3 text-[9px] text-emerald-600 font-medium flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                  <span>{lang === "ku" ? "ئارام و سەقامگیر" : "مستقر ومؤمن"}</span>
                                </div>
                              </div>

                              {/* Card 4: Compliance Rate */}
                              <div className="bg-white dark:bg-[#0f172a] p-4 rounded-2xl border border-slate-200 dark:border-slate-850 shadow-2xs hover:border-blue-500/30 transition flex flex-col justify-between relative overflow-hidden group">
                                <span className="text-[10px] text-slate-400 font-bold select-none truncate">
                                  {lang === "ku" ? "ڕێژەی پابەندبوونی گشتی" : "نسبة الامتثال الكلية"}
                                </span>
                                <div className="mt-2 flex items-baseline justify-between">
                                  <span className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">%٩٧.٤</span>
                                  <span className="text-[10px] text-green-500 font-bold flex items-center gap-0.5">
                                    <ArrowUpRight className="w-3 h-3" /> +1.1%
                                  </span>
                                </div>
                                <div className="mt-3 text-[9px] text-slate-500 font-medium flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#0066FF]" />
                                  <span>{lang === "ku" ? "ئاستی جێبەجێکردن" : "معايير الحوكمة"}</span>
                                </div>
                              </div>

                              {/* Card 5: AI Confidence Score */}
                              <div className="bg-white dark:bg-[#0f172a] p-4 rounded-2xl border border-slate-200 dark:border-slate-850 shadow-2xs hover:border-violet-500/30 transition flex flex-col justify-between relative overflow-hidden group">
                                <span className="text-[10px] text-slate-400 font-bold select-none truncate">
                                  {lang === "ku" ? "ڕادەی متمانەی هۆشمەندی" : "ثقة الذكاء الاصطناعي"}
                                </span>
                                <div className="mt-2 flex items-baseline justify-between">
                                  <span className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">%٩٨.٢</span>
                                  <span className="text-[10px] text-slate-400 font-bold flex items-center gap-0.5">
                                    ✓ {lang === "ku" ? "جێگیر" : "مستقر"}
                                  </span>
                                </div>
                                <div className="mt-3 text-[9px] text-violet-600 font-medium flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
                                  <span>{lang === "ku" ? "شیکاری هۆشەمەند فەعلە" : "توجيه ذكي فعال"}</span>
                                </div>
                              </div>

                              {/* Card 6: System Health Score */}
                              <div className="bg-white dark:bg-[#0f172a] p-4 rounded-2xl border border-slate-200 dark:border-slate-850 shadow-2xs hover:border-emerald-500/30 transition flex flex-col justify-between relative overflow-hidden group">
                                <span className="text-[10px] text-slate-400 font-bold select-none truncate">
                                  {lang === "ku" ? "تەندروستی گشتی سیستەم" : "سلامة وجودة النظام"}
                                </span>
                                <div className="mt-2 flex items-baseline justify-between">
                                  <span className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">%١٠٠</span>
                                  <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-0.5">
                                    ✓ {lang === "ku" ? "بێ کێشە" : "سليم"}
                                  </span>
                                </div>
                                <div className="mt-3 text-[9px] text-emerald-600 font-medium flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                  <span>{lang === "ku" ? "بەردەست بە تەواوی" : "فعال بالكامل"}</span>
                                </div>
                              </div>

                            </div>

                            {/* CENTER: Executive Intelligence Workspace (6 Bento Cards Grid) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              
                              {/* 1. National Trade Overview */}
                              <div className="bg-white dark:bg-[#0f172a] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between">
                                <div>
                                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
                                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                      <span className="w-1.5 h-3 rounded bg-blue-500" />
                                      {lang === "ku" ? "پوختەی بازرگانی نیشتمانی" : "موجز التجارة الخارجية الوطنية"}
                                    </h4>
                                    <Badge variant="outline" className="bg-blue-500/5 text-[#0066FF] border-[#0066FF]/20 text-[9px] py-0">{lang === "ku" ? "ساڵانە" : "سنوي"}</Badge>
                                  </div>
                                  <p className="text-xs text-slate-500 mt-3 leading-relaxed">
                                    {lang === "ku" 
                                      ? "قەبارەی گشتی هاوردەی مانگانە گەیشتووەتە ملیارێک و ٤٥٠ ملیۆن دۆلار. هاوبەشە سەرەکییەکان: چین، تورکیا، دەوڵەتی ئیمارات."
                                      : "إجمالي حجم التجارة الخارجية الشهري المستورد بلغ ١.٤٥ مليار دولار. الشركاء الرئيسيون: الصين، تركيا، الإمارات العربية."}
                                  </p>
                                  <div className="mt-4 space-y-2">
                                    <div className="flex items-center justify-between text-[11px]">
                                      <span className="text-slate-400">{lang === "ku" ? "چین" : "الصين / شحن بحري"}</span>
                                      <span className="font-bold text-slate-700 dark:text-slate-300">%٤٢</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-850 rounded-full overflow-hidden">
                                      <div className="h-full bg-blue-500 rounded-full" style={{ width: "42%" }} />
                                    </div>
                                    <div className="flex items-center justify-between text-[11px]">
                                      <span className="text-slate-400">{lang === "ku" ? "تورکیا" : "تركيا / شحن بري"}</span>
                                      <span className="font-bold text-slate-700 dark:text-slate-300">%٢٨</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-850 rounded-full overflow-hidden">
                                      <div className="h-full bg-amber-500 rounded-full" style={{ width: "28%" }} />
                                    </div>
                                  </div>
                                </div>
                                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                                  <span className="text-[10px] text-slate-400">{lang === "ku" ? "دواین نوێکردنەوە" : "آخر تدقيق تجاري"}</span>
                                  <span className="text-[10px] text-[#0066FF] font-bold flex items-center gap-1 cursor-pointer hover:underline" onClick={() => navigate("/analytics")}>
                                    {lang === "ku" ? "بینینی شیکاری گەشتی" : "تحليل المؤشرات"} <Clock className="w-3 h-3" />
                                  </span>
                                </div>
                              </div>

                              {/* 2. Customs Activity Summary */}
                              <div className="bg-white dark:bg-[#0f172a] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between">
                                <div>
                                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
                                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                      <span className="w-1.5 h-3 rounded bg-emerald-500" />
                                      {lang === "ku" ? "پوختەی کاروڵە گومرگییەکان" : "ملخص العمليات الجمركية"}
                                    </h4>
                                    <Badge variant="outline" className="bg-emerald-500/5 text-emerald-500 border-emerald-500/20 text-[9px] py-0">{lang === "ku" ? "خێرا" : "سريع"}</Badge>
                                  </div>
                                  <p className="text-xs text-slate-500 mt-3 leading-relaxed">
                                    {lang === "ku" 
                                      ? "تێکڕای کاتی پێداچوونەوە و مۆڵەت تەنها ٣٢ خولەکە. ڕێژەی پۆلێنکردنی دروست %٩٩."
                                      : "متوسط وقت تدقيق البيان والإفراج الجمركي بلغ ٣٢ دقيقة فقط. دقة الترميز بالتعرفة الذكية الـ HS بلغت ٩٩٪."}
                                  </p>
                                  <div className="mt-4 grid grid-cols-2 gap-2 text-center">
                                    <div className="bg-slate-50 dark:bg-slate-850 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/80">
                                      <span className="text-[9px] text-slate-400 block">{lang === "ku" ? "کاتی مۆڵەت" : "وقت الإفراج"}</span>
                                      <span className="text-xs font-black text-slate-800 dark:text-white">٣٢ خولەک</span>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-850 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/80">
                                      <span className="text-[9px] text-slate-400 block">{lang === "ku" ? "خۆکاربوون" : "أتمتة الفرز"}</span>
                                      <span className="text-xs font-black text-emerald-600">%٩٥</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                                  <span className="text-[10px] text-slate-400">{lang === "ku" ? "دۆخی رەوتی گشتی" : "المعدل التشغيلي"}</span>
                                  <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 cursor-pointer hover:underline" onClick={() => navigate("/customs")}>
                                    {lang === "ku" ? "دەروازەی گومرگ" : "سجل العمليات"} <CheckCircle2 className="w-3" />
                                  </span>
                                </div>
                              </div>

                              {/* 3. Import/Export Monitoring */}
                              <div className="bg-white dark:bg-[#0f172a] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between">
                                <div>
                                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
                                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                      <span className="w-1.5 h-3 rounded bg-[#0066FF]" />
                                      {lang === "ku" ? "چاودێری هاوردە و هەناردە" : "مراقبة الاستيراد والتصدير"}
                                    </h4>
                                    <Badge variant="outline" className="bg-[#0066FF]/5 text-[#0066FF] border-[#0066FF]/20 text-[9px] py-0">{lang === "ku" ? "فەرمی" : "سيادي"}</Badge>
                                  </div>
                                  <p className="text-xs text-slate-500 mt-3 leading-relaxed">
                                    {lang === "ku" 
                                      ? "دابەشبوونی هاوردە بەپێی جۆری کاڵاکان: ماددە خاوەکان، ئامێرە تەکنەلۆژییەکان، کاڵای خۆراکی، ماتۆڕسات."
                                      : "تصنيف الموارد الواردة حالياً حسب القطاع العراقي: كابلات ومواد أولية، تكنولوجيا الشبكات، الأغذية."}
                                  </p>
                                  <div className="mt-4 space-y-2">
                                    <div className="flex items-center justify-between text-[11px]">
                                      <span className="text-slate-400">{lang === "ku" ? "کەرەستەی خاو" : "المواد الإنشائية والخام"}</span>
                                      <span className="font-bold text-slate-700 dark:text-slate-300">%٤٨</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-850 rounded-full overflow-hidden">
                                      <div className="h-full bg-[#0066FF] rounded-full" style={{ width: "48%" }} />
                                    </div>
                                    <div className="flex items-center justify-between text-[11px]">
                                      <span className="text-slate-400">{lang === "ku" ? "تەکنەلۆژیا و پەیوەندی" : "الإلكترونيات والاتصالات"}</span>
                                      <span className="font-bold text-slate-700 dark:text-slate-300">%٣٢</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-850 rounded-full overflow-hidden">
                                      <div className="h-full bg-purple-500 rounded-full" style={{ width: "32%" }} />
                                    </div>
                                  </div>
                                </div>
                                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                                  <span className="text-[10px] text-slate-400">{lang === "ku" ? "موربەکردن" : "جدول التصنيفات"}</span>
                                  <span className="text-[10px] text-purple-600 font-bold flex items-center gap-1 cursor-pointer hover:underline" onClick={() => navigate("/analytics")}>
                                    {lang === "ku" ? "پشکنینی گشتی" : "السلع والتعرفة"} <ExternalLink className="w-3" />
                                  </span>
                                </div>
                              </div>

                              {/* 4. Strategic Risk Heatmap */}
                              <div className="bg-white dark:bg-[#0f172a] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between">
                                <div>
                                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
                                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                      <span className="w-1.5 h-3 rounded bg-rose-500" />
                                      {lang === "ku" ? "نەخشەی گەرمی مەترسی ستراتیژی" : "خارطة المخاطر الجمركية"}
                                    </h4>
                                    <Badge variant="outline" className="bg-rose-500/5 text-rose-500 border-rose-500/20 text-[9px] py-0">{lang === "ku" ? "ئاسایشی" : "رصد سيادي"}</Badge>
                                  </div>
                                  <p className="text-xs text-slate-500 mt-3 leading-relaxed">
                                    {lang === "ku" 
                                      ? "پێوانی مەترسی لە مەرزی زاخۆ (%١٢ - نزم)، مەرزی ئوم قەسر (%١٨ - مامناوەند)، فڕۆکەخانەی بەغداد (%٨ - زۆر نزم)."
                                      : "مؤشر الرصد: منفذ زاخو الجمركي (١٢٪ - منخفض)، ميناء أم قصر (١٨٪ - متوسط)، مطار بغداد الفيدرالي (٨٪ - ضئيل)."}
                                  </p>
                                  <div className="mt-4 space-y-2 text-[11px] font-sans">
                                    <div className="flex justify-between items-center py-1 border-b border-dashed border-slate-100 dark:border-slate-800">
                                      <span className="text-slate-400">{lang === "ku" ? "مەرزی زاخۆ / سەرەکی" : "منفذ زاخو الحدودي"}</span>
                                      <span className="text-green-500 font-bold">%١٢ ({lang === "ku" ? "پارێزراو" : "آمن"})</span>
                                    </div>
                                    <div className="flex justify-between items-center py-1 border-b border-dashed border-slate-100 dark:border-slate-800">
                                      <span className="text-slate-400">{lang === "ku" ? "بەندەری ئوم قەسر" : "ميناء أم قصر الجنوبي"}</span>
                                      <span className="text-amber-500 font-bold">%١٨ ({lang === "ku" ? "مامناوەند" : "مستقر"})</span>
                                    </div>
                                    <div className="flex justify-between items-center py-1">
                                      <span className="text-slate-400">{lang === "ku" ? "فڕۆکەخانەی نێودەوڵەتی" : "مطار بغداد التجاري"}</span>
                                      <span className="text-green-500 font-bold">%٨ ({lang === "ku" ? "زۆر پارێزراو" : "ضئيل جداً"})</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                                  <span className="text-[10px] text-slate-400">{lang === "ku" ? "بەرێوەبردن" : "نظام الترخيص"}</span>
                                  <span className="text-[10px] text-rose-600 font-bold flex items-center gap-1 cursor-pointer hover:underline" onClick={() => navigate("/compliance")}>
                                    {lang === "ku" ? "پشکنینی دۆسێکان" : "تدقيق المخاطر"} <ShieldAlert className="w-3" />
                                  </span>
                                </div>
                              </div>

                              {/* 5. AI Intelligence Findings & Direct Chat Link */}
                              <div className="bg-white dark:bg-[#0f172a] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between">
                                <div>
                                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
                                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                      <span className="w-1.5 h-3 rounded bg-violet-500 animate-pulse" />
                                      {lang === "ku" ? "دۆزینەوەکانی هۆشمەندی دەستکرد" : "نتائج الاستخبارات الاصطناعية"}
                                    </h4>
                                    <Badge variant="outline" className="bg-violet-500/5 text-violet-500 border-violet-500/20 text-[9px] py-0">{lang === "ku" ? "هۆشمەند" : "فوري"}</Badge>
                                  </div>
                                  <p className="text-xs text-slate-500 mt-3 leading-relaxed">
                                    {lang === "ku" 
                                      ? "سیستەمی هۆشمەندی نیشتمانی توانیویەتی ٣٢ هەوڵی تاریفەی جۆراوجۆر یان نادروست بەبێ فلتەری مرۆیی دەستنیشان بکات."
                                      : "تمكن النظام الذكي الوطني كشف ٣٢ محاولة لتصنيف جمركي غير دقيق بنجاح ودون تدخل بشري."}
                                  </p>
                                  <div className="mt-4 bg-violet-500/5 dark:bg-violet-500/10 rounded-xl border border-violet-500/25 p-3 flex flex-col gap-2">
                                    <div className="flex items-center gap-2">
                                      <div className="w-2 h-2 rounded-full bg-violet-500 animate-ping" />
                                      <span className="text-[10px] text-violet-750 dark:text-violet-400 font-bold">{lang === "ku" ? "یاریدەدەر ئامادەیە بۆ گفتوگۆ" : "المساعد جاهز للاستشارة"}</span>
                                    </div>
                                    <button 
                                      onClick={() => setActiveCenterTab("assistant")}
                                      className="text-right text-[11px] text-violet-600 dark:text-violet-400 font-bold hover:underline self-start cursor-pointer transition"
                                    >
                                      ✉ {lang === "ku" ? "ئێستا ڕاوێژ لەگەڵ ژیری بەدەست بێنە" : "افتح استشارة ذكية سيادية"}
                                    </button>
                                  </div>
                                </div>
                                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                                  <span className="text-[10px] text-slate-400">{lang === "ku" ? "متمانە" : "صلاحية البيانات"}</span>
                                  <span className="text-[10px] text-violet-600 font-bold flex items-center gap-1 cursor-pointer hover:underline" onClick={() => setActiveCenterTab("assistant")}>
                                    {lang === "ku" ? "بینینی پێشنیارەکان" : "موجز القرارات"} <Sparkles className="w-3" />
                                  </span>
                                </div>
                              </div>

                              {/* 6. Logistics Performance Overview */}
                              <div className="bg-white dark:bg-[#0f172a] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between">
                                <div>
                                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
                                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                      <span className="w-1.5 h-3 rounded bg-purple-500" />
                                      {lang === "ku" ? "پوختەی ئەدای لۆجیستیک" : "قياس الأداء اللوجستي"}
                                    </h4>
                                    <Badge variant="outline" className="bg-purple-500/5 text-purple-500 border-purple-500/20 text-[9px] py-0">{lang === "ku" ? "کرداری" : "مؤمن"}</Badge>
                                  </div>
                                  <p className="text-xs text-slate-500 mt-3 leading-relaxed">
                                    {lang === "ku" 
                                      ? "تێکڕای کاتی چاوەڕوانی تانکەرەکان لە مەرزەکان دەگاتە ٢٠ خولەک. گەیشتنی پارێزراوی بارهەڵگرەکان لە %٩٩.٨ دەکات."
                                      : "متوسط انتظار الشاحنات اللوجستية بلغ ٢٠ دقيقة. مؤشر الوصول الآمن والناجح للبضائع سجل ٩٩.٨٪ كفاءة."}
                                  </p>
                                  <div className="mt-4 space-y-2">
                                    <div className="flex items-center justify-between text-[11px]">
                                      <span className="text-slate-400">{lang === "ku" ? "ڕووپۆشەکان" : "شهادات المطابقة"}</span>
                                      <span className="font-bold text-slate-700 dark:text-slate-300">%١٠٠</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-850 rounded-full overflow-hidden">
                                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: "100%" }} />
                                    </div>
                                    <div className="flex items-center justify-between text-[11px]">
                                      <span className="text-slate-400">{lang === "ku" ? "چاوەڕوانی کانکان" : "تراكمات المنافذ"}</span>
                                      <span className="font-bold text-slate-700 dark:text-slate-300">%٢</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-850 rounded-full overflow-hidden">
                                      <div className="h-full bg-violet-500 rounded-full" style={{ width: "2%" }} />
                                    </div>
                                  </div>
                                </div>
                                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                                  <span className="text-[10px] text-slate-400">{lang === "ku" ? "کۆنترۆڵە ئەمنییەکان" : "التأمين اللوجستي"}</span>
                                  <span className="text-[10px] text-purple-600 font-bold flex items-center gap-1 cursor-pointer hover:underline" onClick={() => navigate("/logistics")}>
                                    {lang === "ku" ? "ڕاپۆرتی لۆجیستیک" : "جدول تتبع المنافذ"} <Compass className="w-3" />
                                  </span>
                                </div>
                              </div>

                            </div>

                          </div>
                          
                          {/* Main Right Side (3 grid columns): National Alerts & AI Insights Panel */}
                          <div className="lg:col-span-3 flex flex-col gap-6">
                            <div className="bg-white dark:bg-[#0f172a] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col h-full bg-gradient-to-b from-white to-slate-50/50 dark:from-[#0f172a] dark:to-slate-900/60">
                              
                              <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
                                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                                  <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0" />
                                  {lang === "ku" ? "بنکەی زانیاری و هاوئاگادارییەکان" : "مركز الإنذار والتحليلات السيادية"}
                                </h3>
                                <p className="text-[10px] text-slate-400 mt-1">
                                  {lang === "ku" ? "وردبینیکردنی بەردەوام لەلایەن دۆسیەی ئەمنی گومرگ" : "مراقبة مستمرة تحت إشراف هيئة المنافذ الجمركية"}
                                </p>
                              </div>

                              {/* Alert level filters */}
                              <div className="mt-4 flex flex-wrap gap-1.5 bg-slate-100 dark:bg-slate-850 p-1 rounded-lg">
                                <button
                                  onClick={() => setFilterAlertSeverity("ALL")}
                                  className={`px-2 py-1 rounded text-[9px] font-bold cursor-pointer transition ${
                                    filterAlertSeverity === "ALL" ? "bg-white dark:bg-slate-800 text-slate-800 dark:text-white shadow-xs" : "text-slate-500 hover:text-slate-700"
                                  }`}
                                >
                                  {lang === "ku" ? "هەموو" : "الكل"}
                                </button>
                                <button
                                  onClick={() => setFilterAlertSeverity("CRITICAL")}
                                  className={`px-2 py-1 rounded text-[9px] font-bold cursor-pointer transition ${
                                    filterAlertSeverity === "CRITICAL" ? "bg-rose-500 text-white shadow-xs" : "text-slate-500 hover:text-slate-700"
                                  }`}
                                >
                                  {lang === "ku" ? "مەترسیدار" : "خطير"}
                                </button>
                                <button
                                  onClick={() => setFilterAlertSeverity("WARNING")}
                                  className={`px-2 py-1 rounded text-[9px] font-bold cursor-pointer transition ${
                                    filterAlertSeverity === "WARNING" ? "bg-amber-500 text-white shadow-xs" : "text-slate-500 hover:text-slate-700"
                                  }`}
                                >
                                  {lang === "ku" ? "ئاگاداری" : "تحذير"}
                                </button>
                              </div>

                              {/* Dynamic Alerts List */}
                              <div className="mt-4 flex-1 overflow-y-auto space-y-3.5 select-all pr-1 scrollbar-thin">
                                {[
                                  {
                                    id: "alt_1",
                                    severity: "CRITICAL",
                                    titleKu: "جمرکى زاخۆ: تباینی بەڵگەنامەیی",
                                    descKu: "ئاستی مەترسی بەهۆی تێکچوونی بەڵگەنامە فەرمییەکانی مەرزی زاخۆ بەرز بووەتەوە.",
                                    titleAr: "جمرك زاخو: تباين مستندي هام",
                                    descAr: "ارتفاع مؤشر المخاطر الجمركية في منفذ زاخو بسبب عدم تطابق وثائق الشحن.",
                                    time: "١٠:٤٢ BGW",
                                    recKu: "ڕاسپاردەی فەرمی: ناردنی لێژنەی چاودێری بۆ مەرزی زاخۆ بۆ بەدواداچوونی مانیفێستەکان.",
                                    recAr: "التوصية السيادية: توجيه مفرزة أمنية جمركية للتحقق من المانيفست في المنفذ."
                                  },
                                  {
                                    id: "alt_2",
                                    severity: "CRITICAL",
                                    titleKu: "تاریفەی نادروستی تەکنەلۆژیا",
                                    descKu: "هەڵاوسانی نائاسایی لە بەهای تاریفەی گومرگی ئامێرە تەکنەلۆژییەکان.",
                                    titleAr: "تصنيف خاطئ: سلع تقنية",
                                    descAr: "رصد انحراف جمركي حاد في تصنيف تعرفة الأجهزة التقنية المستوردة.",
                                    time: "٠٩:١٥ BGW",
                                    recKu: "ڕاسپاردەی فەرمی: جێبەجێکردنی کاتیی لێکۆڵینەوەی تاریفەی جۆراوجۆر لە پۆلێنی کاڵاکاندا.",
                                    recAr: "التوصية السيادية: تطبيق مرحلة التدقيق التلقائي المؤقت لرموز الـ HS."
                                  },
                                  {
                                    id: "alt_3",
                                    severity: "WARNING",
                                    titleKu: "قەرەباڵغی بەندەری ئوم قەسر",
                                    descKu: "قەرەباڵغی بەرز لە بەندەری ئوم قەسر تۆمار کراوە کە دەبێتە هۆی دواکەوتنی بارهەڵگرەکان.",
                                    titleAr: "ميناء أم قصر: شحن بحري",
                                    descAr: "ازدحام شديد وتسجيل تأخير في محطة حاويات ميناء أم قصر الجنوبي.",
                                    time: "٠٨:٣٠ BGW",
                                    recKu: "ڕاسپاردەی فەرمی: بەهێزکردنی خشتەی بڵاوکردنەوەی کارمەندانی گومرگ لە هۆڵی پشکنین.",
                                    recAr: "التوصية السيادية: تدوير نوبات المخلصين وتحديث مسارات الشحن الخضراء."
                                  },
                                  {
                                    id: "alt_4",
                                    severity: "WARNING",
                                    titleKu: "متمانەی نووسراوی بازرگانی گەنم",
                                    descKu: "کەمی متمانەی بەڵگەنامەی دڵنیایی بازرگانی لە گرێبەستێکی گەورەی هاوردەی گەنم.",
                                    titleAr: "اعتماد تجاري: شحنة قمح",
                                    descAr: "انخفاض مؤشر الموثوقية في مستندات الاعتماد التجاري لشحنة قمح كبرى.",
                                    time: "٠٧:٥٠ BGW",
                                    recKu: "ڕاسپاردەی فەرمی: هەڵپەساردنی هەمیشەیی تا هەڵسەنگاندنی نوێی KYC.",
                                    recAr: "التوصية السيادية: تعليق براءة الذمة المالية لشركة الاستيراد مؤقتاً."
                                  },
                                  {
                                    id: "alt_5",
                                    severity: "INFO",
                                    titleKu: "سیستەمی هۆشمەندی گومرگی چالاک بوو",
                                    descKu: "سیستەمی هۆشمەندی نیشتمانی نوێترین رێسا و مەرجەکانی هاوردەی نوێکردەوە.",
                                    titleAr: "تحديث النظام: قواعد التعرفة المحدثة",
                                    descAr: "تم تفعيل القواعد الجمركية المستحدثة لسنة ٢٠٢٦ بنجاح عبر النظام الذكي.",
                                    time: "٠٦:٠٠ BGW",
                                    recKu: "ڕاسپاردەی فەرمی: پێداچوونەوە بە شاخصی کارایی بۆ خولەکانی گشتی داهاتوو.",
                                    recAr: "التوصية السيادية: مراجعة لوحة البيانات لاتخاذ قرارات التخصيص المالية."
                                  }
                                ]
                                  .filter(item => filterAlertSeverity === "ALL" || item.severity === filterAlertSeverity)
                                  .map((item) => {
                                    let itemColor = "border-blue-500/10 bg-blue-500/5";
                                    let badgeColor = "bg-blue-100 text-blue-750";
                                    if (item.severity === "CRITICAL") {
                                      itemColor = "border-rose-500/20 bg-rose-500/5";
                                      badgeColor = "bg-rose-100 text-rose-700";
                                    } else if (item.severity === "WARNING") {
                                      itemColor = "border-amber-500/20 bg-amber-500/5";
                                      badgeColor = "bg-amber-100 text-amber-700";
                                    }

                                    return (
                                      <div key={item.id} className={`p-3 border rounded-xl flex flex-col gap-2 relative ${itemColor} transition`}>
                                        <div className="flex items-center justify-between">
                                          <span className="text-[10px] font-black tracking-tight text-slate-800 dark:text-white">
                                            {lang === "ku" ? item.titleKu : item.titleAr}
                                          </span>
                                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${badgeColor}`}>
                                            {item.severity === "CRITICAL" ? (lang === "ku" ? "مەترسیدار" : "خطير") : item.severity === "WARNING" ? (lang === "ku" ? "ئاگاداری" : "تحذير") : (lang === "ku" ? "زانیاری" : "معلومات")}
                                          </span>
                                        </div>
                                        <p className="text-[10px] text-slate-500 leading-relaxed font-sans font-medium">
                                          {lang === "ku" ? item.descKu : item.descAr}
                                        </p>
                                        <div className="bg-slate-100 dark:bg-slate-850 p-2 rounded-lg text-[9px] border dark:border-slate-800 text-slate-600 dark:text-slate-300 font-sans font-semibold">
                                          {lang === "ku" ? item.recKu : item.recAr}
                                        </div>
                                        <span className="text-[8px] text-slate-400 block text-end font-mono mt-0.5">{item.time}</span>
                                      </div>
                                    );
                                  })}
                              </div>

                            </div>
                          </div>

                        </div>
                      ) : (
                        /* NATIONAL AI ASSISTANT CHAT SYSTEM */
                        <div className="w-full h-full flex-1 min-h-0 flex flex-col lg:grid lg:grid-cols-12 gap-6">
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
                          <div className="lg:col-span-4 space-y-4">
                            <div className="bg-[#071739] text-white p-5 rounded-2xl shadow-sm border border-white/5 flex flex-col gap-3">
                              <h4 className="font-bold text-xs uppercase text-slate-400 tracking-wider flex items-center gap-1.5 select-none font-sans">
                                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                                {lang === "ku" ? "پۆرتالی زیرەک" : "البوابة الذكية"}
                              </h4>
                              <h3 className="text-base font-black tracking-tight leading-tight">
                                {lang === "ku" ? "پێشنیارە خیراکان" : "المقترحات السريعة"}
                              </h3>
                              <p className="text-xs text-slate-300 leading-relaxed font-sans mt-1">
                                {lang === "ku" 
                                  ? "دەتوانیت پرسیار بکەیت سەبارەت بە تاریفەکان، یاسا نوێیەکانی باج، کاتەکانی چاوەڕوانی لە مەرزی زاخۆ، یان چۆنیەتی هاوردەکردنی مۆبایل و کۆمپیوتەر."
                                  : "بإمكانك الاستفسار عن تفاصيل التعرفة الجمركية الرسمية، ومحاكي قرارات النفط والإنذار المبكر للسلع."}
                              </p>
                              <div className="mt-2 space-y-1.5 text-slate-100 text-[11px] font-sans">
                                <button onClick={() => setInput(lang === "ku" ? "نرخی تاریفەی کۆمپیوتەری هاوردە چەندە؟" : "كم هي تعرفة استيراد الحاسبات؟")} className="w-full text-right hover:text-blue-200 bg-white/5 p-2 rounded-lg font-semibold transition truncate cursor-pointer">
                                  💡 {lang === "ku" ? "نرخی تاریفەی کۆمپیوتەری هاوردە" : "تعرفة الجمارك للحاسبات المحمولة"}
                                </button>
                                <button onClick={() => setInput(lang === "ku" ? "کاتەکانی چاوەڕوانی مەرزی زاخۆ" : "أوقات الانتظار في منفذ زاخو")} className="w-full text-right hover:text-blue-200 bg-white/5 p-2 rounded-lg font-semibold transition truncate cursor-pointer">
                                  💡 {lang === "ku" ? "کاتەکانی چاوەڕوانی مەرزی زاخۆ" : "حساب أوقات منفذ زاخو الجمركي"}
                                </button>
                              </div>
                            </div>
                            <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 font-sans">
                              <div className="flex items-center gap-1.5">
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
                      )}
                    </div>
                  )}

                  {/* WORKSPACE 2: CUSTOMS */}
                  {pathname === "/customs" && (
                    <div className="w-full flex flex-col gap-6">
                      <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-6 overflow-hidden">
                        <CustomsModule />
                      </div>
                    </div>
                  )}

                  {/* WORKSPACE 3: LOGISTICS (ShipmentTracker + Map + Calculator bento grid) */}
                  {pathname === "/logistics" && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      <div className="lg:col-span-8 flex flex-col gap-6">
                        <div className="bg-white dark:bg-[#0f172a] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col gap-4">
                          <div className="border-b pb-3 border-slate-100 dark:border-slate-800">
                            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                              <Compass className="w-5 h-5 text-blue-500" />
                              {lang === "ku" ? "چاودێری نەخشەی ڕاستەوخۆی ڕێچکەی بارەکان" : "تتبع الشحنات الملاحية الحية"}
                            </h3>
                          </div>
                          <div className="h-[350px] rounded-xl overflow-hidden bg-slate-100 border dark:border-slate-800">
                            <LogisticsMap />
                          </div>
                        </div>

                        <div className="bg-white dark:bg-[#0f172a] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col gap-3">
                          <div className="border-b pb-3 border-slate-100 dark:border-slate-800">
                            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                              {lang === "ku" ? "بەدواداچوونی گۆڕانکاری دۆخی بار" : "نظام تدقيق المانيفست والشحنات"}
                            </h3>
                          </div>
                          <ShipmentTracker />
                        </div>
                      </div>

                      <div className="lg:col-span-4 flex flex-col gap-6">
                        <div className="bg-white dark:bg-[#0f172a] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                          <ShippingCalculator />
                        </div>
                        <div className="bg-white dark:bg-[#0f172a] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                          <ProcurementSourcing />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* WORKSPACE 4: BANKING (Currency values + Official banking controls) */}
                  {pathname === "/banking" && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      <div className="lg:col-span-5">
                        <div className="bg-white dark:bg-[#0f172a] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs h-full">
                          <CurrencyConverter />
                        </div>
                      </div>
                      
                      <div className="lg:col-span-7 flex flex-col gap-6">
                        <div className="bg-white dark:bg-[#0f172a] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col gap-4">
                          <div className="border-b pb-3 border-slate-100 dark:border-slate-800">
                            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                              {lang === "ku" ? "نرخی ئاڵوگۆڕی هاوتەریب و ڕەسمی بانکی ناوەندی عێراق (IQD/USD)" : "منصة تداول الدينار العراقي (منظومة العقوبات)"}
                            </h3>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-green-500/5 rounded-xl border border-green-500/10">
                              <span className="text-xs text-slate-400">{lang === "ku" ? "نرخی فەرمی دەوڵەت" : "سعر الصرف الرسمي"}</span>
                              <div className="text-xl md:text-2xl font-black text-green-600 mt-1">1,310 BGW</div>
                              <span className="text-[10px] text-green-500 font-semibold">✓ {lang === "ku" ? "هاوسەنگکرا لەگەڵ بانکی ناوەندی" : "معتمد لدى البنك المركزي"}</span>
                            </div>
                            <div className="p-4 bg-amber-500/5 rounded-xl border border-amber-500/10">
                              <span className="text-xs text-slate-400">{lang === "ku" ? "نرخی هاوتەریبی بازاڕ" : "سعر السوق الموازي"}</span>
                              <div className="text-xl md:text-2xl font-black text-amber-600 mt-1">1,480 BGW</div>
                              <span className="text-[10px] text-amber-500 font-semibold">{lang === "ku" ? "گۆڕانکاری بەردەوام هەیە" : "تخضع للتحديث المتوازي"}</span>
                            </div>
                          </div>
                          
                          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-3 border border-slate-100 dark:border-slate-800">
                            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                              <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
                              {lang === "ku" ? "ڕامبەرى و بڕیار لەسەر حەواڵەکان" : "ضوابط التحاويل المالية وسیاسة الامتثال"}
                            </h4>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal font-sans">
                              {lang === "ku"
                                ? "بەپێی ڕێنمایی نوێی وەزارەتی دارایی، سەرجەم حەواڵەی بازرگانان بۆ هەناردەکردنی کاڵاکان پێویستە لەڕێگەی سەکۆی ئەلیکترۆنی بانکی ناوەندی عێراقەوە تۆماربکرێت و هاوپێچی بڕوانامەی هاوردەکردن بێت."
                                : "بموجب تعليمات نافذة تمويل التجارة الخارجية، يجب تقديم المستندات الجمركية المرفقة ببيان الـ CIF للتأكد من مشروعية مصادر النقد الصعبة."}
                            </p>
                          </div>
                        </div>

                        <div className="bg-white dark:bg-[#0f172a] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col gap-3">
                          <h4 className="font-bold text-xs uppercase text-[#0066FF] tracking-wider">
                            {lang === "ku" ? "دڵنیایی و پێناسی فەرمی" : "المصارف المعتمدة"}
                          </h4>
                          <span className="text-xs font-semibold leading-relaxed text-slate-500 dark:text-slate-400">
                            {lang === "ku"
                              ? "بانکی ڕافیدەین و ڕەشید پڕۆسەی هاوردەکردنیان خێرا کردووە فەرموو مەکینەی حسابی تێچوون بخوێنەرەوە."
                              : "تم ربط كود الحوالات للجمارك مع مصارف الرافدين والرشيد والمصرف العراقي للتجارة (TBI)."}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* WORKSPACE 5: COMPLIANCE (KYC review details) */}
                  {pathname === "/compliance" && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      <div className="lg:col-span-4 bg-white dark:bg-[#0f172a] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                        <KYCForm />
                      </div>
                      <div className="lg:col-span-8 flex flex-col gap-6">
                        <div className="bg-white dark:bg-[#0f172a] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col gap-4">
                          <div className="border-b pb-3 border-slate-100 dark:border-slate-800">
                            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                              <Briefcase className="w-4 h-4 text-blue-500 shrink-0" />
                              {lang === "ku" ? "یاساکانی هاوردەکردن و ڕوانگەی گومرگی دەوڵەت" : "حالة الامتثال والتراخيص الحكومية"}
                            </h3>
                          </div>
                          <div className="space-y-3.5 text-xs text-slate-600 dark:text-slate-300">
                            <div className="flex justify-between items-center py-2 border-b dark:border-slate-800">
                              <span className="font-medium">{lang === "ku" ? "پشکنینی بە فیشەکە ئەمنییەکان" : "التدقيق الأمني الفيدرالي"}</span>
                              <Badge className="bg-green-500 hover:bg-green-500/90 text-white font-bold">{lang === "ku" ? "تێپەڕیوە" : "مكتمل التدقيق"}</Badge>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b dark:border-slate-800">
                              <span className="font-medium">{lang === "ku" ? "بڕوانامەی گونجاوی بازرگانی" : "شهادة المنشأ والمطابقة النوعية"}</span>
                              <Badge className="bg-green-500 hover:bg-green-500/90 text-white font-bold">{lang === "ku" ? "تەواوکراوە" : "مؤهلة للتعرفة"}</Badge>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b dark:border-slate-800">
                              <span className="font-medium">{lang === "ku" ? "ڕادەی فاکتۆری متمانەکراو" : "تدقيق معايير السعر العادل (COGS)"}</span>
                              <Badge className="bg-[#0066FF] hover:bg-[#0066FF]/90 text-white font-bold">{lang === "ku" ? "لە پێداچوونەوەدایە" : "قيد التدقيق والتقييم"}</Badge>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white dark:bg-[#0f172a] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col gap-3">
                          <h4 className="font-bold text-xs uppercase text-[#F59E0B]">
                            ⚠️ {lang === "ku" ? "لیستی ئاگادارکەرەوە فەرمییەکان" : "تنبيهات مكافحة التهرب والامتثال"}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
                            {lang === "ku" 
                              ? "ئەکاونتی ئەو كۆمپانیایانەی بە هاوردەكردنی ناڕوون تێوەگلاون ڕادەگیرێت و ڕووبەڕووی لێپرسینەوە دەبنەوە بەتایبەت لە مەرزە لۆجیستیکییەکان."
                              : "يرجى مراعاة أن أي تباين في القيمة المصرحة بها بنسبة تزيد عن 10% يعرض الشحنة لغرامة المادة 198 قانون الجمارك العراقي."}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* WORKSPACE 6: KNOWLEDGE BRAIN (Knowledge Graph details) */}
                  {pathname === "/knowledge" && (
                    <div className="w-full h-full min-h-0 flex flex-col bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
                      <div className="border-b pb-4 mb-4 border-slate-100 dark:border-slate-800">
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                          <Database className="w-4 h-4 text-blue-500 shrink-0" />
                          {lang === "ku" ? "تۆڕی زانیاری بەستراوی هەواڵگری بازرگانی" : "خارطة العلاقات الاقتصادية والترابط التجاري"}
                        </h3>
                      </div>
                      <div className="flex-1 min-h-[480px]">
                        <EconomicKnowledgeGraph />
                      </div>
                    </div>
                  )}

                  {/* WORKSPACE 7: ANALYTICS (macro charts + stats section) */}
                  {pathname === "/analytics" && (
                    <div className="flex flex-col gap-6">
                      <StatsSection />
                      <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
                        <div className="border-b pb-4 mb-4 border-slate-100 dark:border-slate-800">
                          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                            <TrendingUp className="w-4 h-4 text-indigo-500 shrink-0" />
                            {lang === "ku" ? "داشبۆردی شیکاری جووڵەی گشتی بازاڕ و بارەکان" : "المرصد الوطني وجداول التدفقات الاقتصادية"}
                          </h3>
                        </div>
                        <NationalTradeObservatory />
                      </div>
                    </div>
                  )}

                  {/* WORKSPACE 8: COMMAND CENTER (Decision simulation support + warnings) */}
                  {pathname === "/command" && (
                    <div className="flex flex-col gap-6">
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        <div className="lg:col-span-8 bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
                          <div className="border-b pb-4 mb-4 border-slate-100 dark:border-slate-800">
                            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                              <Terminal className="w-4 h-4 text-indigo-500 shrink-0" />
                              {lang === "ku" ? "سەکۆی لێکدانەوە گومرگیەکان و هاوشێوەسازی بڕیارەکان" : "غرفة المحاكاة والتحليل السياسي للمخاطر"}
                            </h3>
                          </div>
                          <ScenarioSimulationEngine onReportGenerated={() => {}} />
                        </div>
                        
                        <div className="lg:col-span-4 flex flex-col gap-6">
                          <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex-1">
                            <EarlyWarningSystem />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-6">
                        <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
                          <SecurityGovernancePane />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* WORKSPACE: GOVERNMENT SHOWCASE */}
                  {pathname === "/showcase" && (
                    <div className="w-full">
                      <GovernmentShowcase />
                    </div>
                  )}

                  {/* WORKSPACE 9: ADMINISTRATION (Active system diagnostic syslog console) */}
                  {pathname === "/admin" && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      <div className="lg:col-span-8 flex flex-col gap-6">
                        <div className="bg-slate-900 text-slate-100 p-6 rounded-2xl border border-slate-800 font-mono text-xs shadow-xl flex flex-col gap-4">
                          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-green-500 animate-ping shrink-0" />
                              <span className="font-bold text-slate-300">CORE_SYSTEM_SYSLOG // SECURE TERMINAL</span>
                            </div>
                            <span className="text-[10px] text-slate-500">CLEARANCE_LEVEL_4 // ENCRYPTED</span>
                          </div>
                          
                          <div className="space-y-2 max-h-[350px] overflow-y-auto custom-scrollbar select-text leading-relaxed">
                            <p className="text-slate-400">[2026-05-30 23:44:02 BGW] <span className="text-green-500">INFO</span> Initializing state-authorized kernel routing interface...</p>
                            <p className="text-slate-400">[2026-05-30 23:44:03 BGW] <span className="text-green-500">INFO</span> Connected to Iraq National Customs Authority network database (ASYCUDA API).</p>
                            <p className="text-slate-400">[2026-05-30 23:44:05 BGW] <span className="text-green-500">INFO</span> Synced currency exchange market index with Central Bank.</p>
                            <p className="text-slate-400">[2026-05-30 23:44:11 BGW] <span className="text-green-500">INFO</span> Secure tunnel established over port 3000 to primary server.</p>
                            <p className="text-slate-400">[2026-05-30 23:44:20 BGW] <span className="text-blue-400">AUDIT</span> User MSc. Diplomatic Arbitrator accessed active KYC registry database.</p>
                            <p className="text-slate-400">[2026-05-30 23:44:22 BGW] <span className="text-green-500">INFO</span> Running routine border latency check for zaxho, shalamcheh, um-qasr.</p>
                            <p className="text-slate-400">[2026-05-30 23:44:25 BGW] <span className="text-amber-500">WARN</span> Latency variance detected on Mandali border checkpoint; retrying connection...</p>
                            <p className="text-slate-400">[2026-05-30 23:44:28 BGW] <span className="text-green-500">INFO</span> Mandali checkpoint interface recovered. Operation status: IDEAL.</p>
                          </div>
                        </div>
                      </div>

                      <div className="lg:col-span-4 flex flex-col gap-6 font-sans">
                        <div className="bg-white dark:bg-[#0f172a] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col gap-3">
                          <h4 className="font-bold text-xs uppercase text-slate-500 tracking-wider">
                            {lang === "ku" ? "بەهێزکەرى ئاسایش" : "الحماية الفيدرالية"}
                          </h4>
                          <span className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                            {lang === "ku"
                              ? "دەتوانیت لۆگە نوێیەکان تاقیک بکەیتەوە لەگەڵ هاوتاکانی دەوڵەت، سیستەمی یەکپارچە پارێزراوە."
                              : "سجل الأمان التشغيلي مراقب بالكامل من وزارة الاتصالات وجهاز الأمن الوطني العراقي."}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* WORKSPACE 10: SETTINGS */}
                  {pathname === "/settings" && (
                    <div className="max-w-2xl bg-white dark:bg-[#0f172a] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col gap-6 font-sans">
                      <div className="border-b pb-4 border-slate-100 dark:border-slate-800">
                        <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                          {lang === "ku" ? "ڕێکخستنە سەرەکییەکان" : "إعدادات وتفضيلات النظام"}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">
                          {lang === "ku" ? "ڕێکخستن و گۆڕینی زمان و بڕوانامەی سیستەمەکە لێرەیە." : "تعديل لغة النظام ومطابقة خوادم البيانات والمفاتيح السرية"}
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            {lang === "ku" ? "زمانی بەکاربردن" : "لغة واکجهة المستخدم"}
                          </label>
                          <div className="flex gap-2.5">
                            <Button 
                              onClick={() => setLang("ku")}
                              className={`rounded-xl px-4 py-2.5 text-xs font-bold leading-none ${lang === "ku" ? "bg-[#0066FF] text-white hover:bg-[#0066FF]/90" : "bg-slate-100 hover:bg-slate-200 text-slate-800"}`}
                            >
                              Kurdî (سۆرانی)
                            </Button>
                            <Button 
                              onClick={() => setLang("ar")}
                              className={`rounded-xl px-4 py-2.5 text-xs font-bold leading-none ${lang === "ar" ? "bg-[#0066FF] text-white hover:bg-[#0066FF]/90" : "bg-slate-100 hover:bg-slate-200 text-slate-800"}`}
                            >
                              العربية (عربي)
                            </Button>
                          </div>
                        </div>

                        {/* Sovereign Services Status Dashboard */}
                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            {lang === "ku" ? "بارودۆخی خزمەتگوزارییە حکومییەکان" : "حالة الخدمات السحابية والسيادية"}
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                              <span className="text-[11px] font-semibold text-slate-500">Gemini AI API</span>
                              <Badge className={`text-[9px] font-bold ${diagnostics.gemini === 'Connected' ? 'bg-green-500 text-white' : diagnostics.gemini === 'Missing' ? 'bg-amber-500 text-white' : 'bg-rose-500 text-white'}`}>
                                {diagnostics.gemini === 'Connected' ? (lang === 'ku' ? 'بەستراوە' : 'متصل') : diagnostics.gemini === 'Missing' ? (lang === 'ku' ? 'بونی نییە' : 'مفقود') : (lang === 'ku' ? 'ناتەواو' : 'غير صالح')}
                              </Badge>
                            </div>
                            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                              <span className="text-[11px] font-semibold text-slate-500">Google Maps Platform</span>
                              <Badge className={`text-[9px] font-bold ${diagnostics.maps === 'Connected' ? 'bg-green-500 text-white' : diagnostics.maps === 'Missing' ? 'bg-amber-500 text-white' : 'bg-rose-500 text-white'}`}>
                                {diagnostics.maps === 'Connected' ? (lang === 'ku' ? 'بەستراوە' : 'متصل') : diagnostics.maps === 'Missing' ? (lang === 'ku' ? 'بونی نییە' : 'مفقود') : (lang === 'ku' ? 'ناتەواو' : 'غير صالح')}
                              </Badge>
                            </div>
                            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                              <span className="text-[11px] font-semibold text-slate-500">Firebase Database</span>
                              <Badge className={`text-[9px] font-bold ${diagnostics.firebase === 'Connected' ? 'bg-green-500 text-white' : diagnostics.firebase === 'Missing' ? 'bg-amber-500 text-white' : 'bg-rose-500 text-white'}`}>
                                {diagnostics.firebase === 'Connected' ? (lang === 'ku' ? 'بەستراوە' : 'متصل') : diagnostics.firebase === 'Missing' ? (lang === 'ku' ? 'بونی نییە' : 'مفقود') : (lang === 'ku' ? 'ناتەواو' : 'غير صالح')}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
                          <div>
                            <span className="font-bold text-slate-700 dark:text-slate-300">{lang === "ku" ? "دەرچوون لە ئەکاونت" : "تسجيل الخروج الأمن"}</span>
                            <p className="text-[10px] text-slate-400 mt-0.5">{lang === "ku" ? "سێشنی چالاک پساوە دەکاتەوە" : "إنهاء الجلسة الحالية وتجميد الكود"}</p>
                          </div>
                          <Button variant="destructive" size="sm" className="rounded-xl px-4 text-xs font-bold">
                            {lang === "ku" ? "دەرچوون" : "الخروج"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* WORKSPACE 11: PROFILE */}
                  {pathname === "/profile" && (
                    <div className="max-w-2xl bg-white dark:bg-[#0f172a] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col gap-6 font-sans">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-[#071739] border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-100 font-black text-2xl shadow-md">
                          MA
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                              MSc. Diplomatic Arbitrator
                            </h3>
                            <Badge className="bg-[#0066FF] hover:bg-[#0066FF]/90 text-white font-bold leading-none text-[9px] uppercase tracking-wider py-0.5 px-1.5 rounded-lg">State Admin</Badge>
                          </div>
                          <p className="text-xs text-slate-400 mt-1">diplomaticarbitrator@gmail.com</p>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4 text-xs text-slate-600 dark:text-slate-300">
                        <div className="flex justify-between py-2 border-b dark:border-slate-800">
                          <span className="font-semibold text-slate-400">{lang === "ku" ? "ناسنامەی دیجیتاڵی" : "الرقم التعريفي المميز"}</span>
                          <span className="font-mono font-bold text-slate-800 dark:text-slate-100">IDG-9CB05948-2026</span>
                        </div>
                        <div className="flex justify-between py-2 border-b dark:border-slate-800">
                          <span className="font-semibold text-slate-400">{lang === "ku" ? "ئاستی مەکینە" : "صلاحية المرور والاعتماد"}</span>
                          <span className="font-bold text-green-600 dark:text-green-400">LEVEL_4_FULL_TRUST</span>
                        </div>
                        <div className="flex justify-between py-2 border-b dark:border-slate-800">
                          <span className="font-semibold text-slate-400">{lang === "ku" ? "بەکاربەری دەوڵەت" : "الوزارة التابع لها"}</span>
                          <span className="font-bold text-slate-800 dark:text-slate-100">{lang === "ku" ? "دیوانی وەزیران / چاودێری بازرگانی عێراق" : "ديوان مجلس الوزراء وجهاز الأمن الوطني الفيدرالي"}</span>
                        </div>
                      </div>
                    </div>
                  )}

                </motion.div>
              </AnimatePresence>

            </div>
          </main>

        </div>
      </div>
    </div>
  );
}
