import React from "react";

interface WorkspaceFooterProps {
  lang: "ku" | "ar";
}

export function WorkspaceFooter({ lang }: WorkspaceFooterProps) {
  return (
    <footer className="min-h-10 h-auto sm:h-10 py-2 sm:py-0 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 text-[9px] sm:text-[10px] text-slate-400 select-none shrink-0 font-sans gap-2 text-center sm:text-right">
      <div>
        <span>
          © {new Date().getFullYear()} {lang === "ku" ? "کۆماری عێراق - دەروازەی نیشتمانی خزمەتگوزاری فیدراڵی" : "جمهورية العراق - الهيئة العامة الفيدرالية للمنافذ"}
        </span>
      </div>
      <div className="flex items-center gap-3 justify-center sm:justify-start">
        <span className="font-bold flex items-center gap-1 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
          {lang === "ku" ? "کۆدەکراو بە AES-256" : "تشفير مشدد AES-250"}
        </span>
        <span className="font-mono text-[8px] sm:text-[9px] text-slate-500 shrink-0">v2.6.0-gold</span>
      </div>
    </footer>
  );
}
export default WorkspaceFooter;
