import React from "react";
import { GovernmentDashboard } from "./GovernmentDashboard";
import { IntelligenceDashboard } from "./IntelligenceDashboard";

interface ExecutiveCommandCenterProps {
  lang: "ku" | "ar";
  navigate: (path: string) => void;
  setActiveCenterTab: (tab: "command" | "assistant") => void;
}

export default function ExecutiveCommandCenter({ lang, navigate, setActiveCenterTab }: ExecutiveCommandCenterProps) {
  return (
    <div className="w-full h-full flex-1 min-h-0 flex flex-col lg:grid lg:grid-cols-12 gap-6">
      {/* Government Dashboard containing KPIs and grid cards */}
      <div className="lg:col-span-9 flex flex-col gap-6">
        <GovernmentDashboard 
          lang={lang} 
          navigate={navigate} 
          setActiveCenterTab={setActiveCenterTab} 
        />
      </div>
      
      {/* Right Intelligence sidebar side panel */}
      <div className="lg:col-span-3 flex flex-col gap-6">
        <IntelligenceDashboard lang={lang} />
      </div>
    </div>
  );
}
export { ExecutiveCommandCenter };
