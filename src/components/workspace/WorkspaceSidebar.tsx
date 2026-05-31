import React from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/shared/ui/button";
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
  X,
  Activity
} from "lucide-react";

// Sidebar navigation structure config shared globally
export const navigationItems = {
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

interface WorkspaceSidebarProps {
  lang: "ku" | "ar";
  pathname: string;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean) => void;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (open: boolean) => void;
  startNewSession: () => void;
}

export function WorkspaceSidebar({
  lang,
  pathname,
  isSidebarCollapsed,
  setIsSidebarCollapsed,
  isMobileSidebarOpen,
  setIsMobileSidebarOpen,
  startNewSession
}: WorkspaceSidebarProps) {
  const isRtl = lang === "ku" || lang === "ar";

  const getLabel = (item: { labelKu: string; labelAr: string }) => {
    return lang === "ku" ? item.labelKu : item.labelAr;
  };

  const handleSidebarToggle = () => {
    const nextState = !isSidebarCollapsed;
    setIsSidebarCollapsed(nextState);
    localStorage.setItem("idg-sidebar-collapsed", String(nextState));
  };

  return (
    <>
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

        {/* New Session Action Button */}
        <div className="p-3 shrink-0">
          <Button
            type="button"
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

        {/* Collapse sidebar controller */}
        <div className="p-3 border-t border-white/5 shrink-0 flex items-center justify-center">
          <Button
            type="button"
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
              className="fixed inset-0 bg-black z-45 md:hidden"
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
                  type="button"
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
                  type="button"
                  onClick={() => {
                    startNewSession();
                    setIsMobileSidebarOpen(false);
                  }}
                  className="w-full justify-start gap-2 h-10 border border-dashed border-white/10 hover:bg-white/5 text-slate-100 bg-transparent hover:text-white"
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
    </>
  );
}
export default WorkspaceSidebar;
