import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cpu, 
  CheckCircle2, 
  Clock, 
  Lock, 
  Sparkles
} from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { CustomsScenario } from '../types';

interface IntelligenceAssessmentSimulatorProps {
  isOpen: boolean;
  onClose: () => void;
  scenarioState: CustomsScenario;
}

export function IntelligenceAssessmentSimulator({ isOpen, onClose, scenarioState }: IntelligenceAssessmentSimulatorProps) {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [complete, setComplete] = useState<boolean>(false);
  const [certHash, setCertHash] = useState<string>('');

  const stages = [
    { key: 'classification', name: t.classificationStage, delay: 600 },
    { key: 'hs', name: t.hsDiscoveryStage, delay: 600 },
    { key: 'taxes', name: t.taxCalcStage, delay: 600 },
    { key: 'compliance', name: t.complianceStage, delay: 0 },
    { key: 'risk', name: t.riskStage, delay: 600 },
    { key: 'logistics', name: t.logisticsStage, delay: 400 },
    { key: 'summary', name: t.summaryStage, delay: 400 }
  ];

  // Generate a mock SHA-256 hash for the certification on mount
  useEffect(() => {
    if (isOpen) {
      const chars = '0123456789abcdef';
      let hash = 'idg_sha256_';
      for (let i = 0; i < 48; i++) {
        hash += chars[Math.floor(Math.random() * chars.length)];
      }
      setCertHash(hash);
      setCurrentStep(0);
      setProgress(0);
      setComplete(false);
    }
  }, [isOpen]);

  // Handle the active running state of the automatic audit
  useEffect(() => {
    if (!isOpen || complete) return;

    const runStages = async () => {
      for (let i = 0; i < stages.length; i++) {
        setCurrentStep(i);
        // Animate progression of each sub-segment
        const localProgress = Math.round((i / stages.length) * 100);
        setProgress(localProgress);
        
        await new Promise((resolve) => setTimeout(resolve, stages[i].delay || 400));
      }
      setProgress(100);
      setComplete(true);
    };

    runStages();
  }, [isOpen, complete]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md" id="intelligence-simulator-overlay">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
          id="intelligence-simulator-container"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-[#071739] text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 text-amber-500 rounded-xl border border-amber-500/20">
                <Cpu className="w-5 h-5 animate-spin" />
              </div>
              <div>
                <h3 className="text-base font-black tracking-tight">{t.oneClickTitle}</h3>
                <p className="text-xs text-slate-300 font-medium">Federal System Audit & Security Appraisal</p>
              </div>
            </div>
            {complete && (
              <button 
                onClick={onClose}
                className="px-4 py-1.5 transition-all text-xs font-bold rounded-lg border border-white/20 hover:bg-white/10"
              >
                {t.closeBtn}
              </button>
            )}
          </div>

          {/* Body Content */}
          <div className="p-6">
            {!complete ? (
              <div className="flex flex-col gap-6" id="simulator-running-pane">
                <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping" />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {t.simulationInProcess}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="relative">
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                      key="progress-bar-inner"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ ease: "easeInOut" }}
                      className="h-full bg-gradient-to-r from-[#0066FF] to-amber-600 rounded-full"
                    />
                  </div>
                  <div className="flex justify-between text-[11px] font-bold text-slate-500 mt-2">
                    <span>SECURITY SHIELD ACTIVE</span>
                    <span>{progress}%</span>
                  </div>
                </div>

                {/* Simulated Timeline States */}
                <div className="grid grid-cols-1 gap-2">
                  {stages.map((stage, idx) => {
                    const isPassed = idx < currentStep;
                    const isActive = idx === currentStep;

                    return (
                      <div 
                        key={stage.key}
                        className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                          isActive 
                            ? 'bg-[#0066FF]/5 border-[#0066FF]/30 dark:border-[#0066FF]/20 text-[#0066FF]'
                            : isPassed
                            ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-600'
                            : 'bg-slate-50/50 dark:bg-slate-900/30 border-transparent text-slate-400'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          {isPassed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          ) : isActive ? (
                            <div className="w-4 h-4 rounded-full border-2 border-t-transparent border-[#0066FF] animate-spin" />
                          ) : (
                            <Clock className="w-4 h-4 text-slate-300 dark:text-slate-700" />
                          )}
                          <span className="text-xs font-black">{stage.name}</span>
                        </div>
                        <span className="text-[10px] font-bold uppercase font-mono tracking-widest">
                          {isPassed ? 'OK' : isActive ? 'RUNNING' : 'PENDING'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-5 text-center items-center py-4"
                id="simulator-complete-pane"
              >
                <div className="relative">
                  <div className="w-16 h-16 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center border border-emerald-500/20 shadow-lg">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 p-1 bg-amber-500 text-white rounded-full border-2 border-white dark:border-slate-900">
                    <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  </div>
                </div>

                <div>
                  <h4 className="text-base font-black text-slate-800 dark:text-white uppercase tracking-tight">
                    {t.simulationSuccess}
                  </h4>
                  <p className="text-xs text-slate-500 font-medium">Borders Clearance Validation Completed Sincerely</p>
                </div>

                {/* THE DIGITAL COV CERTIFICATE */}
                <div 
                  className="w-full relative overflow-hidden bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-left flex flex-col gap-4"
                  id="customs-release-certificate"
                >
                  {/* Decorative stamp watermark */}
                  <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full border-8 border-slate-200/50 dark:border-slate-800/50 flex items-center justify-center transform rotate-12 select-none pointer-events-none">
                    <span className="text-[10px] font-black tracking-widest text-slate-300 dark:text-slate-800 uppercase text-center leading-3">
                      IRAQ CUSTOMS<br />VERIFIED<br />* 2026 *
                    </span>
                  </div>

                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-black text-[#0066FF] uppercase tracking-widest font-mono">
                        {t.certficateTitle}
                      </span>
                      <h5 className="text-sm font-bold text-slate-800 dark:text-white mt-1">
                        {scenarioState.title}
                      </h5>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-500/15 border border-emerald-500/20 text-emerald-600 rounded-lg text-[10px] font-black tracking-wider uppercase font-mono">
                      {t.authorizedLabel}
                    </span>
                  </div>

                  <hr className="border-slate-200 dark:border-slate-800" />

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="block text-[10px] text-slate-500 font-bold mb-0.5">{t.formProdName}</span>
                      <span className="font-bold text-slate-800 dark:text-slate-300 line-clamp-1">{scenarioState.input.productName}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-500 font-bold mb-0.5">{t.hsSuggested}</span>
                      <span className="font-mono font-bold text-[#0066FF] bg-[#0066FF]/5 px-2 py-0.5 rounded-md">
                        {scenarioState.analysis.hsSuggestedCode}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-500 font-bold mb-0.5">{t.totalEscrow}</span>
                      <span className="font-mono font-black text-amber-600">
                        ${scenarioState.tax.totalEstimatedCost.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-500 font-bold mb-0.5">{t.riskRating}</span>
                      <span className="font-bold text-slate-800 dark:text-slate-300">
                        {scenarioState.compliance.riskScore}/100 ({scenarioState.compliance.riskLevel})
                      </span>
                    </div>
                  </div>

                  <hr className="border-slate-200 dark:border-slate-800" />

                  <div className="flex flex-col gap-1.5 font-mono text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-900 p-2.5 rounded-xl border border-slate-250 dark:border-slate-850">
                    <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                      <Lock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{t.verificationHash}</span>
                    </div>
                    <span className="break-all tracking-tight leading-3 text-slate-600 dark:text-slate-400">
                      {certHash}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 w-full mt-2">
                  <button
                    onClick={onClose}
                    className="flex-1 py-3 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
                  >
                    {t.closeBtn}
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
