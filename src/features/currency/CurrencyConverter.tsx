import { useState, useEffect } from 'react';
import { RefreshCw, ArrowLeftRight, Landmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { useLanguage } from '@/lib/LanguageContext';

interface Rates {
  [key: string]: number;
}

export function CurrencyConverter() {
  const { t } = useLanguage();
  const [amount, setAmount] = useState<string>('1');
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('IQD');
  const [rates, setRates] = useState<Rates>({});
  const [result, setResult] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  const currencies = ['USD', 'IQD', 'EUR', 'GBP', 'TRY', 'CNY', 'AED'];

  const fetchRates = async () => {
    setIsLoading(true);
    try {
      // Using a widely available free endpoint for basic USD rates
      const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
      const data = await response.json();
      setRates(data.rates);
      setLastUpdate(new Date().toLocaleTimeString());
      
      if (data.rates[toCurrency]) {
        setResult(parseFloat(amount) * data.rates[toCurrency]);
      }
    } catch (error) {
      console.error('Error fetching rates:', error);
      // Fallback rates if API fails (approximate 2026 rates)
      const fallbackRates: Rates = {
        'IQD': 1310,
        'USD': 1,
        'EUR': 0.92,
        'TRY': 33,
        'AED': 3.67,
      };
      if (fromCurrency === 'USD') {
         setRates(fallbackRates);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, [fromCurrency]);

  useEffect(() => {
    if (rates[toCurrency] && amount) {
      setResult(parseFloat(amount) * rates[toCurrency]);
    } else {
      setResult(null);
    }
  }, [amount, toCurrency, rates]);

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <Card className="border-none shadow-md bg-white dark:bg-slate-800 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5">
      <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-700">
        <CardTitle className="text-lg flex items-center gap-2 text-primary">
          <Landmark className="w-5 h-5" />
          {t.converter.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="amount" className="text-xs font-bold uppercase tracking-wider text-muted-foreground mr-1">{t.converter.amount}</Label>
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="h-10 text-right"
            dir="ltr"
          />
        </div>

        <div className="grid grid-cols-1 gap-2 items-end">
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mr-1">{t.converter.from}</Label>
            <Select value={fromCurrency} onValueChange={(val) => val && setFromCurrency(val)}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="دراو" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map(c => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-center -my-1">
            <Button variant="ghost" size="icon" onClick={swapCurrencies} className="rounded-full hover:bg-slate-100">
              <ArrowLeftRight className="w-4 h-4 text-primary rotate-90 lg:rotate-0" />
            </Button>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mr-1">{t.converter.to}</Label>
            <Select value={toCurrency} onValueChange={(val) => val && setToCurrency(val)}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="دراو" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map(c => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center space-y-1">
          {isLoading ? (
            <RefreshCw className="w-5 h-5 animate-spin text-primary" />
          ) : result !== null ? (
            <>
              <div className="text-2xl font-black text-primary font-mono tracking-tight">
                {result.toLocaleString(undefined, { maximumFractionDigits: 2 })} {toCurrency}
              </div>
              <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                {t.converter.marketRate} {lastUpdate}
              </div>
            </>
          ) : (
             <div className="text-sm text-muted-foreground">{t.converter.noRate}</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
