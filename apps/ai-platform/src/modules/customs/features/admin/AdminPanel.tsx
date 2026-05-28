import React, { useState } from 'react';
import { Button, Badge, GlassCard, cn } from '@idg/ui';
import { CustomsRecord } from '@idg/domain';
import { 
  Shield, 
  Settings, 
  Users, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Globe, 
  Sliders, 
  Search, 
  Save, 
  RefreshCw, 
  UserCheck, 
  MapPin, 
  FileCheck2, 
  Database 
} from 'lucide-react';

interface BorderGatewayConfig {
  gatewayId: string;
  portName: string;
  defaultMultiplier: number;
  strictComplianceMode: boolean;
  fastTrackEnabled: boolean;
  activeBrokers: number;
}

interface Broker {
  id: string;
  name: string;
  licenseNumber: string;
  assignedPort: string;
  clearanceRate: string;
  status: 'ACTIVE' | 'SUSPENDED';
}

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState<'audit' | 'brokers' | 'settings'>('audit');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Hardcoded initial list of borders configuration
  const [gateways, setGateways] = useState<BorderGatewayConfig[]>([
    { gatewayId: 'AX-4001', portName: 'Umm Qasr Port (Basra)', defaultMultiplier: 1.10, strictComplianceMode: true, fastTrackEnabled: true, activeBrokers: 12 },
    { gatewayId: 'AX-4002', portName: 'Ibrahim Al-Khalil (Duhok)', defaultMultiplier: 1.05, strictComplianceMode: true, fastTrackEnabled: false, activeBrokers: 8 },
    { gatewayId: 'AX-4003', portName: 'Baghdad Airport Cargo', defaultMultiplier: 1.15, strictComplianceMode: false, fastTrackEnabled: true, activeBrokers: 15 },
    { gatewayId: 'AX-4004', portName: 'Safwan Border (Kuwait)', defaultMultiplier: 1.10, strictComplianceMode: false, fastTrackEnabled: false, activeBrokers: 6 }
  ]);

  // Initial list of Customs Clearers / Brokers
  const [brokers] = useState<Broker[]>([
    { id: 'BR-101', name: 'Al-Khafaji Logistics Co.', licenseNumber: 'IQ-BROKER-8924', assignedPort: 'Umm Qasr Port (Basra)', clearanceRate: '98.4%', status: 'ACTIVE' },
    { id: 'BR-102', name: 'Mesopotamia Border Services', licenseNumber: 'IQ-BROKER-4512', assignedPort: 'Ibrahim Al-Khalil (Duhok)', clearanceRate: '96.2%', status: 'ACTIVE' },
    { id: 'BR-103', name: 'Babylon Rapid Customs Ltd.', licenseNumber: 'IQ-BROKER-3091', assignedPort: 'Baghdad Airport Cargo', clearanceRate: '99.1%', status: 'ACTIVE' },
    { id: 'BR-104', name: 'Shatt Al-Arab Freight agency', licenseNumber: 'IQ-BROKER-1104', assignedPort: 'Safwan Border (Kuwait)', clearanceRate: '85.7%', status: 'SUSPENDED' }
  ]);

  // Active customs records for administrative control
  const [records, setRecords] = useState<CustomsRecord[]>([
    { id: 'CR-101', shipmentId: 'SH-8942', hsCode: '8517.13.00', declaredValue: 15400, assessedValue: 16940, tariffRate: 8, totalDuty: 1355.20, status: 'APPROVED' },
    { id: 'CR-102', shipmentId: 'SH-4412', hsCode: '8703.23.00', declaredValue: 32000, assessedValue: 35200, tariffRate: 15, totalDuty: 5280.00, status: 'UNDER_REVIEW' },
    { id: 'CR-103', shipmentId: 'SH-3091', hsCode: '8471.30.00', declaredValue: 8900, assessedValue: 9790, tariffRate: 5, totalDuty: 489.50, status: 'PENDING' },
    { id: 'CR-104', shipmentId: 'SH-1102', hsCode: '3004.90.00', declaredValue: 24500, assessedValue: 24500, tariffRate: 0, totalDuty: 0, status: 'APPROVED' },
    { id: 'CR-105', shipmentId: 'SH-7756', hsCode: '1006.30.00', declaredValue: 45000, assessedValue: 49500, tariffRate: 2, totalDuty: 990.00, status: 'REJECTED' }
  ]);

  const [savingSettings, setSavingSettings] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Status adjustment action
  const handleUpdateStatus = (id: string, newStatus: CustomsRecord['status']) => {
    setRecords(prev => prev.map(rec => rec.id === id ? { ...rec, status: newStatus } : rec));
  };

  // Border config toggles
  const handleToggleStrict = (id: string) => {
    setGateways(prev => prev.map(g => g.gatewayId === id ? { ...g, strictComplianceMode: !g.strictComplianceMode } : g));
  };

  const handleToggleFastTrack = (id: string) => {
    setGateways(prev => prev.map(g => g.gatewayId === id ? { ...g, fastTrackEnabled: !g.fastTrackEnabled } : g));
  };

  const handleSaveAllSettings = () => {
    setSavingSettings(true);
    setTimeout(() => {
      setSavingSettings(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 800);
  };

  const filteredRecords = records.filter(rec => {
    const matchesSearch = rec.shipmentId.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          rec.hsCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = statusFilter === 'ALL' || rec.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6" id="customs-admin-features">
      {/* Segment Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <h1 className="text-xl font-bold text-foreground tracking-tight">Iraq customs Administration</h1>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Governing compliance policies, cargo screening parameters, authorized clearers registry, and regional gateway configs.
          </p>
        </div>
        
        {/* Navigation Selector */}
        <div className="flex border rounded-lg p-0.5 bg-background shadow-sm" id="admin-tabs">
          <button
            onClick={() => setActiveTab('audit')}
            className={cn(
              "px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5",
              activeTab === 'audit' ? "bg-primary text-primary-foreground font-semibold shadow-sm" : "hover:bg-muted text-muted-foreground"
            )}
          >
            <FileCheck2 className="w-3.5 h-3.5" /> Compliance Audit
          </button>
          <button
            onClick={() => setActiveTab('brokers')}
            className={cn(
              "px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5",
              activeTab === 'brokers' ? "bg-primary text-primary-foreground font-semibold shadow-sm" : "hover:bg-muted text-muted-foreground"
            )}
          >
            <Users className="w-3.5 h-3.5" /> Customs Clearers
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={cn(
              "px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5",
              activeTab === 'settings' ? "bg-primary text-primary-foreground font-semibold shadow-sm" : "hover:bg-muted text-muted-foreground"
            )}
          >
            <Settings className="w-3.5 h-3.5" /> Portal Settings
          </button>
        </div>
      </div>

      {/* Audit Panel View */}
      {activeTab === 'audit' && (
        <div className="space-y-4" id="compliance-audit-panel">
          <GlassCard className="p-4 flex flex-col md:flex-row gap-3 items-center justify-between shadow-sm">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search shipment / HS code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-9 pl-9 pr-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-background text-xs focus:outline-none focus:ring-1 focus:ring-primary font-mono"
              />
            </div>
            
            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto self-stretch md:self-auto">
              {(['ALL', 'PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setStatusFilter(filter)}
                  className={cn(
                    "px-2.5 py-1 rounded-md text-[10px] font-mono border transition-all h-8 break-keep shrink-0",
                    statusFilter === filter 
                      ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 border-slate-900 dark:border-slate-100" 
                      : "bg-background text-slate-500 border-slate-200 dark:border-slate-800 hover:bg-slate-50"
                  )}
                >
                  {filter}
                </button>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Pending Assessment & Clearances</h3>
              </div>
              <Badge variant="outline" className="text-[10px] font-mono">
                {filteredRecords.length} records found
              </Badge>
            </div>

            <div className="overflow-x-auto border rounded-xl bg-background/50">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-medium">
                    <th className="p-3 font-semibold">Record ID</th>
                    <th className="p-3 font-semibold">Shipment</th>
                    <th className="p-3 font-semibold">HS Classification</th>
                    <th className="p-3 font-semibold text-right">Declared (USD)</th>
                    <th className="p-3 font-semibold text-right">Assessed (USD)</th>
                    <th className="p-3 font-semibold text-right">Rate</th>
                    <th className="p-3 font-semibold text-right">Assessed Duty</th>
                    <th className="p-3 font-semibold text-center">Security Status</th>
                    <th className="p-3 font-semibold text-center">Override Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredRecords.map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                      <td className="p-3 font-mono text-slate-500">{rec.id}</td>
                      <td className="p-3 font-mono font-bold text-foreground">{rec.shipmentId}</td>
                      <td className="p-3 font-mono bg-slate-50/50 dark:bg-slate-900/30 rounded px-1.5 py-0.5">{rec.hsCode}</td>
                      <td className="p-3 text-right font-mono">${rec.declaredValue.toLocaleString()}</td>
                      <td className="p-3 text-right font-mono text-slate-900 dark:text-slate-100 font-medium">${rec.assessedValue.toLocaleString()}</td>
                      <td className="p-3 text-right font-mono text-slate-500">{rec.tariffRate}%</td>
                      <td className="p-3 text-right font-mono text-primary font-bold">${rec.totalDuty.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td className="p-3 text-center">
                        {rec.status === 'APPROVED' && (
                          <Badge variant="default" className="bg-emerald-500 text-white hover:bg-emerald-600 font-mono text-[10px]">APPROVED</Badge>
                        )}
                        {rec.status === 'UNDER_REVIEW' && (
                          <Badge variant="secondary" className="bg-amber-500 text-white hover:bg-amber-600 font-mono text-[10px]">UNDER REVIEW</Badge>
                        )}
                        {rec.status === 'PENDING' && (
                          <Badge variant="outline" className="border-slate-400 text-slate-500 dark:border-slate-600 font-mono text-[10px]">PENDING</Badge>
                        )}
                        {rec.status === 'REJECTED' && (
                          <Badge variant="destructive" className="bg-rose-500 text-white hover:bg-rose-600 font-mono text-[10px]">REJECTED</Badge>
                        )}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center justify-center gap-1.5">
                          {rec.status !== 'APPROVED' && (
                            <Button
                              onClick={() => handleUpdateStatus(rec.id, 'APPROVED')}
                              className="h-7 w-7 p-0 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30 rounded-md"
                              id={`approve-${rec.id}`}
                              title="Approve Cargo Declaration"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </Button>
                          )}
                          {rec.status !== 'UNDER_REVIEW' && rec.status !== 'APPROVED' && (
                            <Button
                              onClick={() => handleUpdateStatus(rec.id, 'UNDER_REVIEW')}
                              className="h-7 w-7 p-0 bg-amber-50 hover:bg-amber-100 text-amber-600 border border-amber-200 dark:bg-amber-500/10 dark:hover:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500/30 rounded-md"
                              id={`review-${rec.id}`}
                              title="Set Under Review"
                            >
                              <AlertTriangle className="w-3.5 h-3.5" />
                            </Button>
                          )}
                          {rec.status !== 'REJECTED' && (
                            <Button
                              onClick={() => handleUpdateStatus(rec.id, 'REJECTED')}
                              className="h-7 w-7 p-0 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 dark:text-rose-400 dark:border-rose-500/30 rounded-md"
                              id={`reject-${rec.id}`}
                              title="Reject Verification"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredRecords.length === 0 && (
                    <tr>
                      <td colSpan={9} className="p-8 text-center text-xs text-muted-foreground font-medium">
                        No border declarations match current query parameter filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Authorized Customs Clearers Tab */}
      {activeTab === 'brokers' && (
        <div className="space-y-6" id="customs-brokers-panel">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <GlassCard className="p-6 h-full space-y-4">
                <div className="flex items-center justify-between pb-3 border-b">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-primary" /> Active Clearance Brokers Registry
                  </h3>
                  <Badge variant="outline" className="text-[10px] font-mono">Governed Licenses</Badge>
                </div>

                <div className="overflow-x-auto border rounded-xl bg-background/50">
                  <table className="w-full border-collapse text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                        <th className="p-3 font-semibold">Broker Name</th>
                        <th className="p-3 font-semibold">License Number</th>
                        <th className="p-3 font-semibold">Assigned Border</th>
                        <th className="p-3 font-semibold text-right">Score/Rate</th>
                        <th className="p-3 font-semibold text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {brokers.map(br => (
                        <tr key={br.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                          <td className="p-3 font-bold text-foreground">{br.name}</td>
                          <td className="p-3 font-mono text-slate-500">{br.licenseNumber}</td>
                          <td className="p-3 flex items-center gap-1 text-slate-600 dark:text-slate-300">
                            <MapPin className="w-3 h-3 text-red-500" /> {br.assignedPort}
                          </td>
                          <td className="p-3 text-right font-mono font-bold text-emerald-500">{br.clearanceRate}</td>
                          <td className="p-3 text-center">
                            {br.status === 'ACTIVE' ? (
                              <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30 font-mono text-[9px]">ACTIVE</Badge>
                            ) : (
                              <Badge className="bg-rose-500/10 text-rose-500 border-rose-500/30 font-mono text-[9px]">SUSPENDED</Badge>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </GlassCard>
            </div>

            {/* Verification Notice on right column */}
            <div className="space-y-4">
              <GlassCard className="p-6 border-amber-500/20 bg-amber-500/[0.01] flex flex-col justify-between h-full">
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 tracking-wider uppercase flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 animate-pulse" /> Regulatory Auditing
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Customs clearers and brokerage entities listed in this gateway must hold active, audited mandates from the Iraq Customs Authority. Suspension prevents electronic cargo release submissions in accordance with strict compliance frameworks.
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 font-mono">
                  Framework: IQ-GW-COMP-v2.1
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      )}

      {/* Portal Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6" id="customs-settings-panel">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-4">
              <GlassCard className="p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-primary" /> Joint Regional Gateway Controls
                  </h3>
                  <Badge variant="outline" className="text-[10px] font-mono">Global Parameters</Badge>
                </div>

                <div className="space-y-4">
                  {gateways.map(g => (
                    <div key={g.gatewayId} className="flex flex-col md:flex-row md:items-center justify-between p-3.5 border rounded-xl bg-background/40 gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold font-mono px-1.5 py-0.5 border bg-muted text-foreground rounded">{g.gatewayId}</span>
                          <span className="text-xs font-bold text-foreground">{g.portName}</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground font-mono">
                          Active agents: {g.activeBrokers} | Valuation factor: {g.defaultMultiplier}x CIF
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest cursor-pointer" onClick={() => handleToggleStrict(g.gatewayId)}>Strict Mode</label>
                          <button
                            onClick={() => handleToggleStrict(g.gatewayId)}
                            className={cn(
                              "w-9 h-5 rounded-full p-0.5 transition-colors focus:outline-none",
                              g.strictComplianceMode ? "bg-primary" : "bg-slate-200 dark:bg-slate-800"
                            )}
                          >
                            <div className={cn("bg-background w-4 h-4 rounded-full shadow-sm transition-transform", g.strictComplianceMode ? "translate-x-4" : "translate-x-0")} />
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest cursor-pointer" onClick={() => handleToggleFastTrack(g.gatewayId)}>Fast Pass</label>
                          <button
                            onClick={() => handleToggleFastTrack(g.gatewayId)}
                            className={cn(
                              "w-9 h-5 rounded-full p-0.5 transition-colors focus:outline-none",
                              g.fastTrackEnabled ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-800"
                            )}
                          >
                            <div className={cn("bg-background w-4 h-4 rounded-full shadow-sm transition-transform", g.fastTrackEnabled ? "translate-x-4" : "translate-x-0")} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <Button 
                    onClick={handleSaveAllSettings}
                    disabled={savingSettings}
                    className="text-xs h-9 min-w-[124px] gap-1.5"
                  >
                    {savingSettings ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                    {savingSettings ? "Updating..." : "Save Configs"}
                  </Button>
                </div>

                {saveSuccess && (
                  <div className="p-2 text-center text-[10px] font-bold text-emerald-500 bg-emerald-500/10 rounded-lg animate-pulse">
                    Compliance policy thresholds successfully deployed to regional security gateway terminals!
                  </div>
                )}
              </GlassCard>
            </div>

            {/* Quick stats on the right of settings */}
            <div className="lg:col-span-4 space-y-4">
              <GlassCard className="p-6 space-y-3 bg-primary/5 border-primary/20">
                <blockquote className="text-[10px] uppercase font-bold text-primary tracking-widest flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5" /> Enforcement Rules
                </blockquote>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Fast pass pathways utilize real-time risk classification engine to inspect priority imports at the borders, with automatic ad valorem clearances of low-risk HS codes. Strict mode introduces broker audits and 100% manual validation checklists.
                </p>
              </GlassCard>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
