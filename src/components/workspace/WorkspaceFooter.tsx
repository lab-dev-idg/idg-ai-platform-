import React from "react";

interface WorkspaceFooterProps {
  lang: "ku" | "ar";
}

export function WorkspaceFooter({ lang }: WorkspaceFooterProps) {
  return (
    <footer className="h-10 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] flex items-center justify-between px-6 text-[10px] text-slate-400 select-none shrink-0 font-sans">
      <div>
        <span>
          © {new Date().getFullYear()} {lang === "ku" ? "کۆماری عێراق - دەروازەی نیشتمانی خزمەتگوزاری فیدراڵی" : "جمهورية العراق - الهيئة العامة الفيدرالية للمنافذ"}
        </span>
      </div>
      <div className="flex gap-4">
        <span className="font-bold flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          {lang === "ku" ? "کۆدەکراو بە AES-256" : "تشفير مشدد AES-250"}
        </span>
        <span className="font-mono text-[9px] text-slate-500">v2.6.0-gold</span>
      </div>
    </footer>
  );
}
export default WorkspaceFooter;
