import React, { useState, useEffect } from 'react';
import { Button, Badge, GlassCard, Skeleton, cn } from '@idg/ui';
import { CustomsRecord } from '@idg/domain';
import { 
  Calculator, 
  Layers, 
  Receipt, 
  Clock, 
  Plus, 
  Trash2, 
  Sparkles, 
  FileText, 
  TrendingUp, 
  Scale
} from 'lucide-react';

export function CustomsCalculator() {
  const [shipmentId, setShipmentId] = useState('SH-' + Math.floor(1000 + Math.random() * 9000));
  const [hsCode, setHsCode] = useState('8517.13.00');
  const [declaredValue, setDeclaredValue] = useState<number>(12500);
  const [assessedMultiplier, setAssessedMultiplier] = useState<number>(1.1); // Assessed value often higher due to freight/insurance (CIF value)
  const [tariffRate, setTariffRate] = useState<number>(8); // 8% standard
  const [customsStatus, setCustomsStatus] = useState<CustomsRecord['status']>('PENDING');

  const [records, setRecords] = useState<CustomsRecord[]>([
    {
      id: 'CR-101',
      shipmentId: 'SH-8942',
      hsCode: '8517.13.00',
      declaredValue: 15400,
      assessedValue: 16940,
      tariffRate: 8,
      totalDuty: 1355.20,
      status: 'APPROVED',
    },
    {
      id: 'CR-102',
      shipmentId: 'SH-4412',
      hsCode: '8703.23.00',
      declaredValue: 32000,
      assessedValue: 35200,
      tariffRate: 15,
      totalDuty: 5280.00,
      status: 'UNDER_REVIEW',
    }
  ]);

  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingStats(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const assessedValue = Math.round(declaredValue * assessedMultiplier * 100) / 100;
  const totalDuty = Math.round(assessedValue * (tariffRate / 100) * 100) / 100;

  const handleAddRecord = () => {
    if (!shipmentId || !hsCode || declaredValue <= 0) return;

    const newRecord: CustomsRecord = {
      id: 'CR-' + Math.floor(100 + Math.random() * 900),
      shipmentId,
      hsCode,
      declaredValue,
      assessedValue,
      tariffRate,
      totalDuty,
      status: customsStatus,
    };

    setRecords([newRecord, ...records]);
    
    // Regenerate values for consecutive entries
    setShipmentId('SH-' + Math.floor(1000 + Math.random() * 9000));
  };

  const handleDeleteRecord = (id: string) => {
    setRecords(records.filter(r => r.id !== id));
  };

  // Safe status styling getter
  const getStatusBadge = (status: CustomsRecord['status']) => {
    switch (status) {
      case 'APPROVED':
        return <Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600 text-white font-mono text-[10px]">APPROVED</Badge>;
      case 'UNDER_REVIEW':
        return <Badge variant="secondary" className="bg-amber-500 hover:bg-amber-600 text-white font-mono text-[10px]">UNDER REVIEW</Badge>;
      case 'REJECTED':
        return <Badge variant="destructive" className="bg-rose-500 hover:bg-rose-600 text-white font-mono text-[10px]">REJECTED</Badge>;
      default:
        return <Badge variant="outline" className="border-slate-400 dark:border-slate-600 text-slate-500 font-mono text-[10px]">PENDING</Badge>;
    }
  };

  const totalCalculatedDuty = records.reduce((sum, r) => sum + r.totalDuty, 0);
  const totalAssessedValue = records.reduce((sum, r) => sum + r.assessedValue, 0);

  return (
    <div className="space-y-6" id="customs-calculator-feature">
      {/* Feature Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-primary" />
            <h1 className="text-xl font-bold text-foreground tracking-tight">Enterprise Customs & Tariff Calculator</h1>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Compliant with standard import/export regulations, harmonized tariff schedules, and freight valuation.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {loadingStats ? (
            <Skeleton className="h-6 w-32" />
          ) : (
            <Badge variant="outline" className="text-xs font-mono px-2 py-0.5 border-primary/20 bg-primary/5 text-primary">
              Cleared volume: ${totalAssessedValue.toLocaleString()}
            </Badge>
          )}
        </div>
      </div>

      {/* Main Layout containing Input Form and Live Summary Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Input Panel */}
        <div className="lg:col-span-7 space-y-4">
          <GlassCard className="p-6 space-y-4">
            <h2 className="text-sm font-semibold flex items-center gap-1.5 text-foreground leading-none">
              <Layers className="w-4 h-4 text-primary" />
              Declaration Assessment Model
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Shipment ID</label>
                <input
                  type="text"
                  value={shipmentId}
                  onChange={(e) => setShipmentId(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-background text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">HS Code (Tariff classification)</label>
                <input
                  type="text"
                  value={hsCode}
                  onChange={(e) => setHsCode(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-background text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Declared Value (USD)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">$</span>
                  <input
                    type="number"
                    value={declaredValue}
                    onChange={(e) => setDeclaredValue(Number(e.target.value))}
                    className="w-full h-10 pl-7 pr-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-background text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">CIF Multiplier</label>
                <select
                  value={assessedMultiplier}
                  onChange={(e) => setAssessedMultiplier(Number(e.target.value))}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                >
                  <option value={1.0}>1.0x (FOB Only)</option>
                  <option value={1.05}>1.05x (Standard Freight)</option>
                  <option value={1.1}>1.10x (Standard CIF)</option>
                  <option value={1.15}>1.15x (High Insurance CIF)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tariff Rate (%)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={tariffRate}
                    onChange={(e) => setTariffRate(Number(e.target.value))}
                    className="w-full h-10 pl-3 pr-7 rounded-lg border border-slate-200 dark:border-slate-800 bg-background text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">%</span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Assigned Customs Security Status</label>
              <div className="flex flex-wrap gap-2 pt-1">
                {(['PENDING', 'UNDER_REVIEW', 'APPROVED'] as CustomsRecord['status'][]).map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setCustomsStatus(status)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg border text-xs font-mono transition-all",
                      customsStatus === status 
                        ? "bg-primary text-primary-foreground border-primary font-semibold shadow-sm"
                        : "bg-background text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900"
                    )}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <Button 
              onClick={handleAddRecord}
              className="w-full h-10 text-xs font-semibold gap-1.5"
            >
              <Plus className="w-4 h-4" /> Save Declaration calculation
            </Button>
          </GlassCard>
        </div>

        {/* Dynamic Display / Live Estimation */}
        <div className="lg:col-span-5 space-y-4">
          <GlassCard className="p-6 border-primary/20 bg-primary/[0.01] dark:bg-primary/[0.02]/2 shadow-md relative overflow-hidden flex flex-col justify-between min-h-[310px]">
            {/* Background absolute elements for premium aesthetics */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none" />
            
            <div className="space-y-4 relative">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono text-primary uppercase tracking-widest flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
                  Live Assessment
                </span>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full font-mono font-medium">Duty Estimator</span>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">CIF Assessed Value</span>
                  <span className="font-mono font-bold text-foreground">${assessedValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Ad Valorem Duty ({tariffRate}%)</span>
                  <span className="font-mono font-bold text-foreground">${(assessedValue * (tariffRate / 100)).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Clearance Service Fee</span>
                  <span className="font-mono text-slate-400">Waived / standard</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-150 dark:border-slate-800 space-y-4 relative">
              <div className="text-center">
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1">Estimated Duty Payable</p>
                <div className="text-3xl font-black text-primary font-mono tracking-tight">
                  ${totalDuty.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-lg border flex items-center gap-2.5 text-[10px] text-slate-500 dark:text-slate-400">
                <Clock className="w-4 h-4 text-primary shrink-0" />
                <span>
                  Expected clearance time: <strong>24-48 Hours</strong> through key Iraq/KRG ports. Subject to broker inspection.
                </span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Skeletons/Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard className="p-4 flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-xl text-primary">
            <Scale className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-muted-foreground uppercase font-semibold">Saved Entries</p>
            {loadingStats ? (
              <Skeleton className="h-5 w-16 mt-1" />
            ) : (
              <p className="text-base font-bold font-mono mt-0.5 text-foreground">{records.length} Declarations</p>
            )}
          </div>
        </GlassCard>

        <GlassCard className="p-4 flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
            <Receipt className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-muted-foreground uppercase font-semibold">Accumulated Duty</p>
            {loadingStats ? (
              <Skeleton className="h-5 w-24 mt-1" />
            ) : (
              <p className="text-base font-bold font-mono mt-0.5 text-foreground">${totalCalculatedDuty.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
            )}
          </div>
        </GlassCard>

        <GlassCard className="p-4 flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-muted-foreground uppercase font-semibold">Average Tariff Rate</p>
            {loadingStats ? (
              <Skeleton className="h-5 w-12 mt-1" />
            ) : (
              <p className="text-base font-bold font-mono mt-0.5 text-foreground">
                {(records.reduce((sum, r) => sum + r.tariffRate, 0) / (records.length || 1)).toFixed(1)}%
              </p>
            )}
          </div>
        </GlassCard>
      </div>

      {/* Declarations Saved List */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold flex items-center gap-1.5 text-foreground leading-none">
            <FileText className="w-4 h-4 text-primary" />
            Active Customs Records Ledgers
          </h3>
          <span className="text-[10px] font-mono text-muted-foreground">Persisting {records.length} Calculations</span>
        </div>

        <div className="overflow-x-auto border rounded-xl bg-background/50">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b bg-muted/55 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                <th className="p-3 pl-4">Record ID</th>
                <th className="p-3">Shipment Ref</th>
                <th className="p-3">HS Code</th>
                <th className="p-3 text-right">Declared (USD)</th>
                <th className="p-3 text-right">Assessed (USD)</th>
                <th className="p-3 text-center">Tariff</th>
                <th className="p-3 text-right">Duty Owed</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-center pr-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {records.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-xs text-muted-foreground italic">
                    No calculations recorded yet. Use the model above to calculate and save.
                  </td>
                </tr>
              ) : (
                records.map((record) => (
                  <tr key={record.id} className="hover:bg-muted/20 transition-all font-mono">
                    <td className="p-3 pl-4 font-bold text-slate-500 text-[11px]">{record.id}</td>
                    <td className="p-3 font-semibold text-foreground text-[11px]">{record.shipmentId}</td>
                    <td className="p-3 text-[11px]">{record.hsCode}</td>
                    <td className="p-3 text-right text-[11px]">${record.declaredValue.toLocaleString()}</td>
                    <td className="p-3 text-right text-[11px] font-semibold">${record.assessedValue.toLocaleString()}</td>
                    <td className="p-3 text-center text-[11px]">{record.tariffRate}%</td>
                    <td className="p-3 text-right text-[11px] font-bold text-primary">${record.totalDuty.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td className="p-3 text-center">{getStatusBadge(record.status)}</td>
                    <td className="p-3 text-center pr-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-rose-500 hover:text-rose-600 dark:hover:bg-rose-950/20"
                        onClick={() => handleDeleteRecord(record.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
export default CustomsCalculator;
