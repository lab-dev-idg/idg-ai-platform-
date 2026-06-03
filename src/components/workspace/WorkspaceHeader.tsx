import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Search, Bell, X, Clock, User } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";

// Import navigation config from sidebar to prevent duplication
import { navigationItems } from "./WorkspaceSidebar";

interface WorkspaceHeaderProps {
  lang: "ku" | "ar";
  setLang: (lang: "ku" | "ar") => void;
  t: any;
  setIsMobileSidebarOpen: (open: boolean) => void;
}

export function WorkspaceHeader({ lang, setLang, t, setIsMobileSidebarOpen }: WorkspaceHeaderProps) {
  const { pathname } = useLocation();

  const isRtl = lang === "ku" || lang === "ar";
  const getLabel = (item: { labelKu: string; labelAr: string }) => {
    return lang === "ku" ? item.labelKu : item.labelAr;
  };

  // Find active item for the breadcrumb
  const activeItem = Object.values(navigationItems)
    .flat()
    .find(item => item.path === pathname) || navigationItems.main[0];

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);

  // Filter/Search through navigation elements
  const allNavFlat = Object.values(navigationItems).flat();
  const searchResults = searchQuery.trim() 
    ? allNavFlat.filter(item => 
        getLabel(item).toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Notifications state
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: "نوێکردنەوەی تاریفە", desc: "ڕێژەی گومرگی ئامێرە ئەلیکترۆنییەکان بۆ ساڵی ٢٠٢٦ هەموار کرایەوە.", time: "٥ خولەک پێش ئێستا", read: false },
    { id: 2, title: "مەرزى ئوم قەسر", desc: "دۆخی مەرزەکە گۆڕدرا بۆ چالاک و ئاسایی.", time: "٢٥ خولەک پێش ئێستا", read: false },
    { id: 3, title: "هاوتاکردنی دراو", desc: "نرخی ئاڵوگۆڕی دینار بەرامبەر دۆلار بە پێی دوایین ئاماری فەرمی بازاڕ بەرز بووەتەوە.", time: "٣ کاتژمێر پێش ئێستا", read: true }
  ]);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

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

  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] shadow-xs select-none z-30 shrink-0">
      
      {/* Mobile hamburger menu button */}
      <div className="flex items-center gap-3">
        <Button
          type="button"
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
              className="bg-transparent border-none outline-none text-xs w-full text-slate-850 dark:text-slate-100 focus:ring-0 ps-2"
            />
            {searchQuery && (
              <button 
                type="button"
                onClick={() => { setSearchQuery(""); setIsSearchActive(false); }} 
                className="text-slate-400 hover:text-slate-650 bg-transparent border-0 p-0 cursor-pointer"
              >
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
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className={`relative rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 ${
              notifications.some(n => !n.read) ? "after:absolute after:w-1.5 after:h-1.5 after:bg-red-500 after:rounded-full after:top-2.5 after:right-2.5" : ""
            }`}
          >
            <Bell className="w-4 h-4" />
          </Button>

          {/* Interactive notification card dropdown */}
          {isNotificationsOpen && (
            <div 
              className="absolute top-11 w-[calc(100vw-32px)] sm:w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-4 z-50 font-sans text-xs intense-shadow"
              style={{ right: isRtl ? 0 : "auto", left: isRtl ? "auto" : 0 }}
            >
              <div className="flex items-center justify-between border-b pb-2 mb-2 border-slate-100 dark:border-slate-800 select-none">
                <span className="font-bold text-slate-800 dark:text-slate-100">
                  {lang === "ku" ? "ئاگادارکردنەوەکان" : "الإشعارات"}
                </span>
                <button 
                  type="button"
                  onClick={markAllAsRead} 
                  className="text-[10px] font-bold text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 bg-transparent border-0 p-0 cursor-pointer"
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
        <div className="bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700 flex select-none">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setLang("ku")}
            className={`h-7 px-2.5 text-[10px] font-bold rounded-lg transition-all ${
              lang === "ku" 
                ? "bg-[#0066FF] text-white hover:bg-[#0066FF]/90 shadow-sm font-semibold" 
                : "text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-transparent font-medium"
            }`}
          >
            Kurdî
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setLang("ar")}
            className={`h-7 px-2.5 text-[10px] font-bold rounded-lg transition-all ${
              lang === "ar" 
                ? "bg-[#0066FF] text-white hover:bg-[#0066FF]/90 shadow-sm font-semibold" 
                : "text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-transparent font-medium"
            }`}
          >
            عربي
          </Button>
        </div>

        {/* Baghdad clock & active health status */}
        <div className="hidden xl:flex items-center gap-2 select-none">
          <Badge variant="outline" className="bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/80 py-1 font-mono tracking-wider text-[10px] uppercase font-semibold flex items-center gap-1.5 rounded-lg text-slate-700 dark:text-slate-300">
            <Clock className="w-3 h-3 text-blue-500" />
            <span>{baghdadTime}</span>
          </Badge>
          <Badge variant="outline" className="bg-green-500/5 dark:bg-green-900/10 text-green-600 dark:text-green-400 border-green-500/20 py-1 font-sans text-[10px] font-bold flex items-center gap-1 rounded-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shrink-0" />
            <span>{t?.app?.systemActive || "سیستەم چاڵاکە"}</span>
          </Badge>
        </div>

        {/* Profile Circle link */}
        <div className="flex items-center border-s border-slate-200 dark:border-slate-800 ps-2 select-none">
          <Link 
            to="/profile"
            className="w-8 h-8 rounded-full bg-[#071739] border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-100 font-bold hover:opacity-90 active:scale-95 transition"
          >
            <User className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </header>
  );
}
