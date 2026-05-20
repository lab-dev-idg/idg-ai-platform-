import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Sparkles } from 'lucide-react';
import { useSettingsStore } from '@/store/settingsStore';
import { CurrencyConverter } from '@/features/currency';
import { ShippingCalculator } from './ShippingCalculator';
import { KYCForm } from './KYCForm';
import { ProcurementSourcing } from './ProcurementSourcing';
import { ShipmentTracker } from './ShipmentTracker';
import { LogisticsMap } from './LogisticsMap';

export function Sidebar({ isMobile = false }: { isMobile?: boolean }) {
  const { t } = useSettingsStore();

  return (
    <aside className={`${isMobile ? 'flex' : 'hidden lg:flex'} flex-col gap-5 lg:col-span-3 bg-[#071739] sidebar-dark rounded-[32px] p-5 lg:h-full lg:overflow-hidden`}>
      <Card className="flex-none border border-white/10 bg-white/5 text-white rounded-2xl">
        <CardHeader className="py-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Sparkles className="w-5 h-5 text-blue-400" />
            {t.sidebar.marketSummary}
          </CardTitle>
        </CardHeader>

        <CardContent className="pb-3">
          <div className="bg-white/5 p-3 rounded-xl">
            <p className="text-[11px] leading-relaxed">
              {t.sidebar.newTariffDesc}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
        <CurrencyConverter />
        <ShippingCalculator />
        <KYCForm />
        <ProcurementSourcing />
        <ShipmentTracker />
        <LogisticsMap />
      </div>
    </aside>
  );
}
