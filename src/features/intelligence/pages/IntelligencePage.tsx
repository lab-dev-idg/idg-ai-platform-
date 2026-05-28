import React, { useState } from 'react';
import { Toaster } from "@/shared/ui/toaster";
import { Sidebar } from "@/features/sidebar";
import { DashboardLayout } from "@/app/layouts/DashboardLayout";
import { useSettingsStore } from '@/store/settingsStore';
import { motion } from 'motion/react';
import { 
  BarChart2, 
  Workflow, 
  Sliders, 
  Siren
} from 'lucide-react';

// Components
import { NationalTradeObservatory } from '../components/NationalTradeObservatory';
import { ScenarioSimulationEngine } from '../components/ScenarioSimulationEngine';
import { EconomicKnowledgeGraph } from '../components/EconomicKnowledgeGraph';
import { 
  EarlyWarningSystem, 
  ExecutiveDecisionSupport, 
  SecurityGovernancePane 
} from '../components/IntelligenceSupportingElements';

// Types
import { ExecutiveReport } from '../types';

export default function IntelligencePage() {
  const { lang } = useSettingsStore();
  const isKurdish = lang === 'ku';

  const [activeTab, setActiveTab] = useState<'observatory' | 'simulation' | 'graph' | 'alerts'>('observatory');
  const [executiveReport, setExecutiveReport] = useState<ExecutiveReport | null>(null);

  const handleReportGenerated = (report: ExecutiveReport) => {
    setExecutiveReport(report);
  };

  return (
    <DashboardLayout>
      <Toaster position="top-center" richColors />
      <main className="flex-1 min-h-0 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6 p-3 md:p-6 overflow-hidden">
        
        {/* Preserving sidebar */}
        <Sidebar />

        {/* Core content area */}
        <div className="lg:col-span-9 h-full min-h-0 overflow-y-auto pb-8 pr-1 custom-scrollbar flex flex-col gap-5">
          
          {/* Professional Breadcrumb */}
          <div className="flex items-center justify-between text-xs bg-white border border-slate-100 px-4 py-2.5 rounded-2xl shadow-xs">
            <div className="flex items-center gap-2 text-slate-500 font-medium">
              <span>Iraq Digital Gateway</span>
              <span>/</span>
              <span className="text-indigo-600 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
                {isKurdish ? 'چاودێری و زیرەکی ئابووری نیشتمانی' : 'المرصد الوطني للذكاء الاقتصادي والنمذجة'}
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono select-none hidden sm:inline-block">
              INTELLIGENCE SECURE // PHASE_12_I_ACTIVE
            </div>
          </div>

          {/* Centralized Navigation Tabs */}
          <div className="flex bg-white p-1 rounded-2xl border border-slate-100 shadow-xs text-xs font-bold gap-1 self-start">
            <button
              onClick={() => setActiveTab('observatory')}
              className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'observatory' 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/10' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <BarChart2 className="w-4 h-4" />
              <span>{isKurdish ? 'داشبۆردی چاودێری ئابووری' : 'المرصد وجداول التدفق'}</span>
            </button>
            <button
              onClick={() => setActiveTab('simulation')}
              className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'simulation' 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/10' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>{isKurdish ? 'سەکۆی لێکدانەوە گومرگیەکان' : 'محاكي السياسات اللوجستية'}</span>
            </button>
            <button
              onClick={() => setActiveTab('graph')}
              className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'graph' 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/10' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <Workflow className="w-4 h-4" />
              <span>{isKurdish ? 'تۆڕی زانیاری بەستراو' : 'خارطة العلاقات والتبعية'}</span>
            </button>
            <button
              onClick={() => setActiveTab('alerts')}
              className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'alerts' 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/10' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <Siren className="w-4 h-4" />
              <span>{isKurdish ? 'هۆشدارییە پێشوەختەکان' : 'الإنذار المبكر'}</span>
            </button>
          </div>

          {/* Interactive views mounting based on active Tab selection */}
          <div className="space-y-6">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'observatory' && <NationalTradeObservatory />}
              {activeTab === 'simulation' && (
                <ScenarioSimulationEngine onReportGenerated={handleReportGenerated} />
              )}
              {activeTab === 'graph' && <EconomicKnowledgeGraph />}
              {activeTab === 'alerts' && <EarlyWarningSystem />}
            </motion.div>

            {/* Always visible at footer boundaries of the dashboard layout: 
                6. Executive Decision support panel for State Directors, Planners etc */}
            <ExecutiveDecisionSupport report={executiveReport} />

            {/* 9. Security Governance auditing panel */}
            <SecurityGovernancePane />
          </div>

        </div>
      </main>
    </DashboardLayout>
  );
}
