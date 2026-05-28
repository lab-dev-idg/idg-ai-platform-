import React, { useState } from 'react';
import { CustomsCalculator, AdminPanel } from './features';
import { cn } from '@idg/ui';
import { Calculator, ShieldAlert } from 'lucide-react';

export function CustomsModule() {
  const [activeTab, setActiveTab] = useState<'calculator' | 'admin'>('calculator');

  return (
    <div className="p-6 bg-card border rounded-xl shadow-sm space-y-6" id="customs-module">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground tracking-tight">Customs Clearance Platform</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Core customs management with integrated compliance, tariff estimation, and documentation pipelines.
          </p>
        </div>
        
        {/* Module level switcher */}
        <div className="flex border rounded-lg p-0.5 bg-background shadow-xs self-start sm:self-auto" id="customs-module-tabs">
          <button
            onClick={() => setActiveTab('calculator')}
            className={cn(
              "px-3 py-1 text-xs font-semibold whitespace-nowrap rounded-md transition-all flex items-center gap-1.5",
              activeTab === 'calculator' 
                ? "bg-primary text-primary-foreground font-bold shadow-xs" 
                : "text-muted-foreground hover:bg-muted"
            )}
          >
            <Calculator className="w-3.5 h-3.5" /> Calculator
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={cn(
              "px-3 py-1 text-xs font-semibold whitespace-nowrap rounded-md transition-all flex items-center gap-1.5",
              activeTab === 'admin' 
                ? "bg-primary text-primary-foreground font-bold shadow-xs" 
                : "text-muted-foreground hover:bg-muted"
            )}
          >
            <ShieldAlert className="w-3.5 h-3.5" /> Admin & Policy
          </button>
        </div>
      </div>

      {activeTab === 'calculator' ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors" id="customs-compliance-card">
              <h3 className="text-sm font-medium text-foreground">Declaration & Clearance</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Establish cargo declarations, digitize airway bills, and coordinate custom broker workflows.
              </p>
            </div>

            <div className="p-4 border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors" id="customs-tariffs-card">
              <h3 className="text-sm font-medium text-foreground">Tariff Classification & Audits</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Enforce unified HS codes, estimate ad valorem import duties, and identify regulatory restrictions.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <CustomsCalculator />
          </div>
        </>
      ) : (
        <div className="pt-2">
          <AdminPanel />
        </div>
      )}

      <div className="text-[10px] text-muted-foreground font-mono flex justify-between items-center bg-muted/50 p-2 rounded" id="customs-status-footer">
        <span>Compliance Status: Ready</span>
        <span>Gateway ID: AX-4001</span>
      </div>
    </div>
  );
}

