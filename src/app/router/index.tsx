import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Unified premium Workspace Layout
const WorkspaceLayout = lazy(() => import("@/components/common/WorkspaceLayout"));

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
          <Route path="/" element={<WorkspaceLayout />} />
          <Route path="/customs" element={<WorkspaceLayout />} />
          <Route path="/logistics" element={<WorkspaceLayout />} />
          <Route path="/banking" element={<WorkspaceLayout />} />
          <Route path="/compliance" element={<WorkspaceLayout />} />
          <Route path="/knowledge" element={<WorkspaceLayout />} />
          <Route path="/analytics" element={<WorkspaceLayout />} />
          <Route path="/command" element={<WorkspaceLayout />} />
          <Route path="/showcase" element={<WorkspaceLayout />} />
          <Route path="/admin" element={<WorkspaceLayout />} />
          <Route path="/settings" element={<WorkspaceLayout />} />
          <Route path="/profile" element={<WorkspaceLayout />} />
          <Route path="/intelligence" element={<Navigate to="/analytics" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
