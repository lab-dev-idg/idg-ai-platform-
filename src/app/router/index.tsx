import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Code splitting dynamic imports for optimal route chunking
const DashboardPage = lazy(() => import("@/features/dashboard/pages/DashboardPage"));
const CustomsPage = lazy(() => import("@/features/customs/pages/CustomsPage"));
const IntelligencePage = lazy(() => import("@/features/intelligence/pages/IntelligencePage"));

// Clean elegant fallback spinner matching the IDG digital cockpit design theme
function RouteFallback() {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-slate-50 text-[#071739] font-sans">
      <div className="flex flex-col items-center gap-4 text-center select-none">
        <div className="relative flex h-10 w-10">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0066FF]/20 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-10 w-10 border-4 border-[#0066FF] border-t-transparent animate-spin"></span>
        </div>
        <div>
          <h2 className="text-xs font-black tracking-widest uppercase">Iraq Digital Gateway</h2>
          <p className="text-[10px] text-slate-400 font-mono mt-1">SECURE CORE SESSION // INITIALIZING</p>
        </div>
      </div>
    </div>
  );
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/customs" element={<CustomsPage />} />
          <Route path="/intelligence" element={<IntelligencePage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
