import { useState, useEffect } from 'react';
import { Calculator, Scale, Maximize, Zap, Info, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/ui/tooltip';
import { useSettingsStore } from '@/store/settingsStore';

export function ShippingCalculator() {
  const { t } = useSettingsStore();
  const [origin, setOrigin] = useState<string>('China');
  const [destination, setDestination] = useState<string>('Baghdad');
  const [weight, setWeight] = useState<string>('');
  const [length, setLength] = useState<string>('');
  const [width, setWidth] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [speed, setSpeed] = useState<string>('standard');
  const [estimatedCost, setEstimatedCost] = useState<number | null>(null);
  const [iqdCost, setIqdCost] = useState<number | null>(null);
  const [iqdRate, setIqdRate] = useState<number>(1310);

  const ORIGINS = ['China', 'Turkey', 'UAE', 'Jordan', 'Europe', 'USA'];
  const DESTINATIONS = ['Baghdad', 'Erbil', 'Basra', 'Sulaymaniyah', 'Duhok', 'Najaf'];

  // Fetch current IQD rate for integration
  useEffect(() => {
    const fetchRate = async () => {
      try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await response.json();
        if (data.rates.IQD) {
          setIqdRate(data.rates.IQD);
        }
      } catch (error) {
        console.error('Error fetching IQD rate for calculator:', error);
      }
    };
    fetchRate();
  }, []);

  const calculateCost = () => {
    const w = parseFloat(weight) || 0;
    const l = parseFloat(length) || 0;
    const wi = parseFloat(width) || 0;
    const h = parseFloat(height) || 0;

    if (w === 0) {
      setEstimatedCost(null);
      return;
    }

    // Volumetric weight (common industry standard: L*W*H / 5000)
    const volWeight = (l * wi * h) / 5000;
    const chargeableWeight = Math.max(w, volWeight);

    // Base mock calculation logic based on origin
    let baseRate = 20; // Default base handling fee in USD
    let perKgRate = 6; // Default $6 per kg

    // Adjust rates based on origin (mock distance factors)
    const originRates: Record<string, { base: number; perKg: number }> = {
      'China': { base: 50, perKg: 8 },
      'Turkey': { base: 25, perKg: 4 },
      'UAE': { base: 30, perKg: 5 },
      'Jordan': { base: 20, perKg: 3.5 },
      'Europe': { base: 45, perKg: 9 },
      'USA': { base: 60, perKg: 12 }
    };

    if (originRates[origin]) {
      baseRate = originRates[origin].base;
      perKgRate = originRates[origin].perKg;
    }

    // Speed modifiers
    if (speed === 'express') {
      baseRate *= 1.5;
      perKgRate *= 1.5;
    } else if (speed === 'urgent') {
      baseRate *= 2.5;
      perKgRate *= 2.2;
    }

    const totalUsd = baseRate + (chargeableWeight * perKgRate);
    setEstimatedCost(totalUsd);
    setIqdCost(totalUsd * iqdRate);
  };

  useEffect(() => {
    calculateCost();
  }, [origin, destination, weight, length, width, height, speed, iqdRate]);

  return (
    <Card className="border-none shadow-md bg-white dark:bg-slate-800 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5">
      <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-700">
        <CardTitle className="text-lg flex items-center justify-between text-primary">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            {t.calculator.title}
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-4 h-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-[200px] text-[10px]">
                {t.calculator.tooltip}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        {/* Origin & Destination */}
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold text-muted-foreground uppercase">{t.calculator.origin}</Label>
            <Select value={origin} onValueChange={(val) => val && setOrigin(val)}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ORIGINS.map(o => <SelectItem key={o} value={o} className="text-xs">{o}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold text-muted-foreground uppercase">{t.calculator.destination}</Label>
            <Select value={destination} onValueChange={(val) => val && setDestination(val)}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DESTINATIONS.map(d => <SelectItem key={d} value={d} className="text-xs">{d}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Weight Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="weight" className="text-xs font-bold text-muted-foreground mr-1">{t.calculator.weight}</Label>
            <Scale className="w-3 h-3 text-primary/60" />
          </div>
          <Input
            id="weight"
            type="number"
            placeholder="0.00"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="h-10 text-right"
            dir="ltr"
          />
        </div>

        {/* Dimensions Grid */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-bold text-muted-foreground mr-1">{t.calculator.dimensions}</Label>
            <Maximize className="w-3 h-3 text-primary/60" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Input
              placeholder="L"
              type="number"
              value={length}
              onChange={(e) => setLength(e.target.value)}
              className="h-9 text-center text-xs"
              dir="ltr"
            />
            <Input
              placeholder="W"
              type="number"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              className="h-9 text-center text-xs"
              dir="ltr"
            />
            <Input
              placeholder="H"
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="h-9 text-center text-xs"
              dir="ltr"
            />
          </div>
        </div>

        {/* Shipping Speed */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-bold text-muted-foreground mr-1">{t.calculator.speed}</Label>
            <Zap className="w-3 h-3 text-primary/60" />
          </div>
          <Select value={speed} onValueChange={(val) => val && setSpeed(val)}>
            <SelectTrigger className="h-10 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard" className="text-xs">{t.calculator.speedStandard}</SelectItem>
              <SelectItem value="express" className="text-xs">{t.calculator.speedExpress}</SelectItem>
              <SelectItem value="urgent" className="text-xs">{t.calculator.speedUrgent}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Result Area */}
        <div className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/10 space-y-3">
          <div className="flex flex-col items-center">
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1">{t.calculator.estimatedCost}</p>
            {estimatedCost !== null ? (
              <div className="text-center">
                <div className="text-xl font-black text-primary font-mono tracking-tight flex items-center justify-center gap-1">
                  <DollarSign className="w-5 h-5 -mt-1" />
                  {estimatedCost.toFixed(2)}
                </div>
                {iqdCost !== null && (
                  <div className="text-xs font-bold text-slate-500 mt-1">
                    ≈ {iqdCost.toLocaleString()} IQD
                  </div>
                )}
              </div>
            ) : (
              <div className="text-xs text-muted-foreground italic py-2">{t.calculator.completeInfo}</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
