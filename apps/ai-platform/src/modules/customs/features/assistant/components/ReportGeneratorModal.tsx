import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Printer, 
  Download, 
  Lock, 
  Scale
} from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { CustomsScenario, RequiredDocument } from '../types';

interface ReportGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  scenarioState: CustomsScenario;
  activeDocuments: RequiredDocument[];
  activeDutyRate: number;
  activeTaxRate: number;
  calculatedDutyAmt: number;
  calculatedTaxAmt: number;
  calculatedTotal: number;
}

export function ReportGeneratorModal({ 
  isOpen, 
  onClose, 
  scenarioState, 
  activeDocuments,
  activeDutyRate,
  activeTaxRate,
  calculatedDutyAmt,
  calculatedTaxAmt,
  calculatedTotal
}: ReportGeneratorModalProps) {
  const { t, lang } = useTranslation();
  const [reportNum, setReportNum] = useState<string>('');
  const [reportDate, setReportDate] = useState<string>('');
  const [digitalHash, setDigitalHash] = useState<string>('');
  const [notification, setNotification] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      // Generate realistic sovereign audit telemetry
      const rnd = Math.floor(100000 + Math.random() * 900000);
      setReportNum(`IDG-GRN-2026-${rnd}`);
      
      const options: Intl.DateTimeFormatOptions = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short' 
      };
      setReportDate(new Date().toLocaleDateString(lang === 'ku' ? 'ku-IQ' : 'ar-IQ', options));
      
      const chars = '0123456789ABCDEF';
      let hash = 'IDG_SEC_HASH_';
      for (let i = 0; i < 32; i++) {
        hash += chars[Math.floor(Math.random() * chars.length)];
      }
      setDigitalHash(hash);
      setNotification('');
    }
  }, [isOpen, lang]);

  const triggerNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => {
      setNotification('');
    }, 4000);
  };

  const handlePrint = () => {
    triggerNotification(t.notificationPrint);
    setTimeout(() => {
      window.print();
    }, 1200);
  };

  const handleExportPDF = () => {
    triggerNotification(t.notificationPdf);
    // Simulate generation of physical file download for offline sandbox environments
    const element = document.createElement("a");
    const file = new Blob([document.getElementById("sovereign-printable-report")?.innerText || ""], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${reportNum}_CustomsAudit.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleSaveLocally = () => {
    localStorage.setItem(`saved_report_${scenarioState.id}`, JSON.stringify({
      reportNum,
      reportDate,
      digitalHash,
      scenario: scenarioState,
      calculatedTotal
    }));
    triggerNotification(t.notificationSaved);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/80 backdrop-blur-md" id="report-modal-overlay">
        <motion.div 
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.98 }}
          className="relative w-full max-w-4xl h-[92vh] flex flex-col bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
          id="report-modal-inner"
        >
          {/* Action Header Panel */}
          <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white uppercase tracking-tight">
                {t.reportTitle}
              </h3>
              <p className="text-[10px] sm:text-xs text-slate-500 font-medium">Sovereign Audit Document Compiler and Printer</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="p-2 sm:px-3 sm:py-2 text-[11px] font-bold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
                title={t.printBtn}
                id="btn-print-report"
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.printBtn}</span>
              </button>

              <button
                onClick={handleExportPDF}
                className="p-2 sm:px-3 sm:py-2 text-[11px] font-bold rounded-xl bg-amber-600 hover:bg-amber-700 text-white transition-all flex items-center gap-1.5 cursor-pointer"
                title={t.exportPdfBtn}
                id="btn-pdf-report"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.exportPdfBtn}</span>
              </button>

              <button
                onClick={handleSaveLocally}
                className="p-2 sm:px-3 sm:py-2 text-[11px] font-bold rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-850 dark:hover:bg-slate-800 border border-slate-850 dark:border-slate-800 transition-all flex items-center gap-1.5 cursor-pointer"
                title={t.saveLocalBtn}
                id="btn-save-report"
              >
                <Lock className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.saveLocalBtn}</span>
              </button>

              <button 
                onClick={onClose}
                className="p-2 sm:px-3 sm:py-2 text-[11px] font-bold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-all cursor-pointer"
                id="btn-close-report"
              >
                {t.closeBtn}
              </button>
            </div>
          </div>

          {/* Success Notification Bar */}
          <AnimatePresence>
            {notification && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-emerald-500 text-white px-5 py-2.5 text-xs font-black text-center"
                id="report-notification-toast"
              >
                ✓ {notification}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Printable Sovereign Document Viewer Panel */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-100/50 dark:bg-slate-950">
            <div 
              className="w-full max-w-3xl mx-auto bg-white dark:bg-slate-900 p-6 sm:p-12 border border-slate-300 dark:border-slate-800 shadow-xl rounded-2xl text-slate-800 dark:text-slate-100 font-sans print:border-none print:shadow-none print:p-0"
              id="sovereign-printable-report"
            >
              {/* Report Header Block */}
              <div className="flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-4 border-b-2 border-[#071739] pb-6 mb-8">
                {/* Traditional Iraq Crest Placement */}
                <div className="flex flex-col items-center sm:items-start">
                  <span className="text-[10px] font-black tracking-widest text-[#0066FF] uppercase">REPUBLIC OF IRAQ</span>
                  <h1 className="text-sm sm:text-base font-black text-slate-900 dark:text-white mt-1">
                    {t.iraqLogoName}
                  </h1>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {t.idgName}
                  </span>
                </div>

                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-full flex items-center justify-center relative">
                  {/* Embedded Seal Stamp Icon representing Iraq State Seal */}
                  <div className="w-10 h-10 rounded-full bg-[#0066FF]/10 flex items-center justify-center text-[#0066FF] border border-[#0066FF]/20">
                    <Scale className="w-5 h-5" />
                  </div>
                </div>

                <div className="flex flex-col items-center sm:items-end text-center sm:text-right">
                  <span className="px-3 py-1 bg-amber-500/15 border border-amber-500/25 text-amber-600 rounded-lg text-[10px] font-black uppercase tracking-wider">
                    {t.reportMeta}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 uppercase mt-1">IDG-FMC-SECURED</span>
                </div>
              </div>

              {/* General Telemetry Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-850 text-xs mb-8">
                <div>
                  <span className="block text-[10px] text-slate-500 font-bold uppercase mb-0.5">{t.reportNum}</span>
                  <span className="font-mono font-black text-slate-900 dark:text-slate-250">{reportNum}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-500 font-bold uppercase mb-0.5">{t.reportDate}</span>
                  <span className="font-bold text-slate-800 dark:text-slate-300">{reportDate}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-500 font-bold uppercase mb-0.5">{t.confidenceSec}</span>
                  <span className="font-mono font-black text-emerald-600">
                    {scenarioState.analysis.confidenceScore}% (SYSTEM ACCREDITED)
                  </span>
                </div>
              </div>

              {/* SECTION 1: Shipment Summary & Import Details */}
              <div className="mb-8">
                <h3 className="text-xs font-black text-[#0066FF] uppercase tracking-wider mb-3 pb-1 border-b border-slate-100 dark:border-slate-850">
                  {t.executiveSummary}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="block text-[10px] text-slate-500 font-bold mb-0.5">{t.formProdName}</span>
                    <span className="font-bold text-slate-900 dark:text-white">{scenarioState.input.productName}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 font-bold mb-0.5">{t.formProdDesc}</span>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-semibold">{scenarioState.input.productDescription}</p>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 font-bold mb-0.5">{t.formQuantity}</span>
                    <span className="font-bold text-slate-900 dark:text-white">{scenarioState.input.quantity} Units</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 font-bold mb-0.5">{t.formOrigin}</span>
                    <span className="font-bold text-slate-900 dark:text-white">{scenarioState.input.originCountry}</span>
                  </div>
                </div>
              </div>

              {/* SECTION 2: AI Classification Result & HS Codes */}
              <div className="mb-8">
                <h3 className="text-xs font-black text-[#0066FF] uppercase tracking-wider mb-4 pb-1 border-b border-slate-100 dark:border-slate-850">
                  {t.decisionTitle}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-[#0066FF]/5 p-4 rounded-xl border border-[#0066FF]/10">
                  <div>
                    <span className="block text-[10px] text-slate-500 font-bold mb-1">{t.hsSuggested}</span>
                    <span className="font-mono text-sm font-black text-[#0066FF] bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-[#0066FF]/20 shadow-2xs inline-block">
                      {scenarioState.analysis.hsSuggestedCode}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 font-bold mb-1">{t.category}</span>
                    <span className="font-bold text-slate-800 dark:text-slate-300">{scenarioState.analysis.productCategory}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="block text-[10px] text-slate-500 font-bold mb-1">{t.regNotes}</span>
                    <p className="text-[#071739] dark:text-slate-300 leading-relaxed font-semibold">{scenarioState.analysis.regulatoryNotes}</p>
                  </div>
                </div>
              </div>

              {/* SECTION 3: Customs Cost Analysis & Taxes */}
              <div className="mb-8">
                <h3 className="text-xs font-black text-[#0066FF] uppercase tracking-wider mb-3 pb-1 border-b border-slate-100 dark:border-slate-850">
                  {t.taxBreakdown}
                </h3>
                <table className="w-full text-xs text-left" id="report-financials-table">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-850 pb-2">
                      <th className="py-2 text-slate-500 uppercase text-[10px] font-bold text-right">{t.fiscalValidation ? "Component" : ""}</th>
                      <th className="py-2 text-slate-500 uppercase text-[10px] font-bold text-right">Applicable Rate</th>
                      <th className="py-2 text-slate-500 text-right uppercase text-[10px] font-bold">Sum Calculated (USD)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-100 dark:border-slate-850">
                      <td className="py-2.5 font-bold text-slate-800 dark:text-slate-200 text-right">{t.fobValue}</td>
                      <td className="py-2.5 text-slate-500 text-right">-</td>
                      <td className="py-2.5 text-right font-mono font-bold">$ {scenarioState.input.invoiceValue.toLocaleString()}</td>
                    </tr>
                    <tr className="border-b border-slate-100 dark:border-slate-850">
                      <td className="py-2.5 font-bold text-slate-800 dark:text-slate-200 text-right">{t.customsDuty}</td>
                      <td className="py-2.5 text-slate-505 text-right">{activeDutyRate}%</td>
                      <td className="py-2.5 text-right font-mono font-bold">$ {calculatedDutyAmt.toLocaleString()}</td>
                    </tr>
                    <tr className="border-b border-slate-100 dark:border-slate-850">
                      <td className="py-2.5 font-bold text-slate-800 dark:text-slate-200 text-right">{t.importTax}</td>
                      <td className="py-2.5 text-slate-500 text-right">{activeTaxRate}%</td>
                      <td className="py-2.5 text-right font-mono font-bold">$ {calculatedTaxAmt.toLocaleString()}</td>
                    </tr>
                    <tr className="border-b-2 border-slate-200 dark:border-slate-850">
                      <td className="py-2.5 font-bold text-slate-800 dark:text-slate-200 text-right">{t.processingFee}</td>
                      <td className="py-2.5 text-slate-500 text-right">-</td>
                      <td className="py-2.5 text-right font-mono font-bold">$ {scenarioState.tax.processingFee}</td>
                    </tr>
                    <tr className="bg-slate-50 dark:bg-slate-950 font-black">
                      <td className="py-3 px-4 font-black text-slate-900 dark:text-white uppercase tracking-tight text-right">{t.totalEscrow}</td>
                      <td className="py-3 px-4 text-right">-</td>
                      <td className="py-3 px-4 text-right text-base text-amber-600 font-mono">$ {calculatedTotal.toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* SECTION 4: Risk Analysis & Securities */}
              <div className="mb-8">
                <h3 className="text-xs font-black text-[#0066FF] uppercase tracking-wider mb-3 pb-1 border-b border-slate-100 dark:border-slate-850">
                  {t.complianceSummary}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="block text-[10px] text-slate-500 font-bold mb-0.5">{t.riskRating}</span>
                    <span className="font-bold text-[#071739] dark:text-white">
                      {scenarioState.compliance.riskScore}/100 ({scenarioState.compliance.riskLevel === 'LOW' ? t.riskLevelLow : scenarioState.compliance.riskLevel === 'MEDIUM' ? t.riskLevelMedium : t.riskLevelHigh})
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 font-bold mb-0.5">{t.importAllowed}</span>
                    <span className="text-emerald-600 font-bold">{t.allowedStatus}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="block text-[10px] text-slate-500 font-bold mb-1">{t.sovereignLocks}</span>
                    <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400 font-medium font-serif leading-relaxed">
                      {scenarioState.compliance.securityNotes.map((note, idx) => (
                        <li key={idx}>{note}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* SECTION 5: Documents Audit Checklist */}
              <div className="mb-8">
                <h3 className="text-xs font-black text-[#0066FF] uppercase tracking-wider mb-3 pb-1 border-b border-slate-100 dark:border-slate-850">
                  {t.requiredDocsList}
                </h3>
                <div className="grid grid-cols-1 gap-2 text-xs">
                  {activeDocuments.map((doc) => (
                    <div key={doc.id} className="flex justify-between items-center p-2 border-b border-slate-100 dark:border-slate-850">
                      <div>
                        <span className="font-bold text-slate-800 dark:text-slate-250">{doc.name}</span>
                        <p className="text-[10px] text-slate-500">{doc.description}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        doc.status === 'APPROVED' 
                          ? 'bg-emerald-500/10 text-emerald-600' 
                          : doc.status === 'REJECTED'
                          ? 'bg-red-500/10 text-red-600'
                          : 'bg-amber-500/10 text-amber-600'
                      }`}>
                        {doc.status === 'APPROVED' ? t.docApproved : doc.status === 'PENDING' ? t.docPending : t.docUploaded}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 6: Terminal Delivery & ETA */}
              <div className="mb-8">
                <h3 className="text-xs font-black text-[#0066FF] uppercase tracking-wider mb-3 pb-1 border-b border-slate-100 dark:border-slate-850">
                  {t.logisticsTitle}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="block text-[10px] text-slate-500 font-bold mb-0.5">{t.overallRoute}</span>
                    <span className="font-bold text-slate-900 dark:text-white">{scenarioState.logistics.origin} ➔ {scenarioState.logistics.destination}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 font-bold mb-0.5">{t.estimatedETA}</span>
                    <span className="font-bold text-[#0066FF] font-mono">{scenarioState.logistics.etaDays} {t.etaDays} (Confidence {scenarioState.logistics.routeConfidence}%)</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 font-bold mb-0.5">{t.shippingCarrier}</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">{scenarioState.logistics.shippingLine}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 font-bold mb-0.5">{t.containerType}</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">{scenarioState.logistics.containerType}</span>
                  </div>
                </div>
              </div>

              {/* Official Stamp Signature & Fingerprint Verification Block */}
              <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center text-center sm:text-left gap-6">
                <div className="flex flex-col gap-1.5 font-mono text-[9px] text-slate-400 bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-850 max-w-sm">
                  <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-bold mb-1">
                    <Lock className="w-3" />
                    <span>SOVEREIGN DIGITAL CERTIFICATION</span>
                  </div>
                  <span className="break-all tracking-tight leading-3">{digitalHash}</span>
                  <span>TIME STAMP AUDITED: {reportDate}</span>
                </div>

                <div className="text-right flex flex-col items-center sm:items-end">
                  <div className="w-24 h-12 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center justify-center relative mb-2 overflow-hidden">
                    <span className="text-[10px] font-black text-slate-300/40 select-none uppercase tracking-widest leading-3">APPROVED<br />AUTOSIGN</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-teal-500/5 to-slate-505/5 pointer-events-none" />
                    <span className="text-[10px] text-teal-600 font-bold font-serif whitespace-nowrap rotate-6">IDG_APPROVED</span>
                  </div>
                  <span className="block text-[10px] text-slate-900 dark:text-white font-black">{t.approvedBy}</span>
                  <span className="block text-[8px] text-slate-500 font-bold uppercase mt-0.5">{t.approvalStatusLabel}</span>
                </div>
              </div>

              {/* Official Legal Disclaimer in Page Margins */}
              <div className="mt-8 text-center text-[9px] text-slate-400 border-t border-slate-100 dark:border-slate-850 pt-4 leading-relaxed font-semibold">
                {t.officialDisclaimer}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
