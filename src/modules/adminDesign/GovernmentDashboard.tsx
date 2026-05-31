import React from "react";
import { 
  KPICards, 
  NationalTradeOverviewWidget, 
  CustomsActivitySummaryWidget, 
  ImportExportMonitoringWidget, 
  StrategicRiskHeatmapWidget, 
  AIIntelligenceFindingsWidget, 
  LogisticsPerformanceWidget 
} from "./DashboardWidgets";

interface GovernmentDashboardProps {
  lang: "ku" | "ar";
  navigate: (path: string) => void;
  setActiveCenterTab: (tab: "command" | "assistant") => void;
}

export function GovernmentDashboard({ lang, navigate, setActiveCenterTab }: GovernmentDashboardProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* KPI Cards section */}
      <KPICards lang={lang} />

      {/* Bento Grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <NationalTradeOverviewWidget lang={lang} navigate={navigate} />
        <CustomsActivitySummaryWidget lang={lang} navigate={navigate} />
        <ImportExportMonitoringWidget lang={lang} navigate={navigate} />
        <StrategicRiskHeatmapWidget lang={lang} navigate={navigate} />
        <AIIntelligenceFindingsWidget lang={lang} navigate={navigate} setActiveCenterTab={setActiveCenterTab} />
        <LogisticsPerformanceWidget lang={lang} navigate={navigate} />
      </div>
    </div>
  );
}
