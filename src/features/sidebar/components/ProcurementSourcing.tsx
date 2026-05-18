import { useState } from 'react';
import { ShoppingBag, Send, History, Package, DollarSign, PlusCircle, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';

export function ProcurementSourcing() {
  const { t } = useLanguage();
  const [showHistory, setShowHistory] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    itemName: '',
    qty: '',
    currentPrice: '',
    targetPrice: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.itemName || !formData.qty) return;

    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success(t.procurement.success, {
      icon: <CheckCircle2 className="w-4 h-4 text-green-500" />
    });

    setFormData({
      itemName: '',
      qty: '',
      currentPrice: '',
      targetPrice: '',
      notes: ''
    });
    setIsSubmitting(false);
  };

  return (
    <Card className="border-none shadow-md bg-white dark:bg-slate-800 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5">
      <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-700">
        <CardTitle className="text-lg flex items-center justify-between text-primary">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            {t.procurement.title}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowHistory(!showHistory)}
            className="h-8 px-2 text-xs gap-1"
          >
            {showHistory ? <PlusCircle className="w-4 h-4" /> : <History className="w-4 h-4" />}
            {showHistory ? t.procurement.submit : 'مێژوو'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <AnimatePresence mode="wait">
          {!showHistory ? (
            <motion.form 
              key="form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleSubmit} 
              className="space-y-3"
            >
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-muted-foreground uppercase">{t.procurement.itemName}</Label>
                <Input 
                  required
                  placeholder="بابەتەکە چییە؟"
                  value={formData.itemName}
                  onChange={e => setFormData({...formData, itemName: e.target.value})}
                  className="h-9 text-xs text-right"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-muted-foreground uppercase">{t.procurement.qty}</Label>
                  <Input 
                    required
                    type="number"
                    placeholder="1000"
                    value={formData.qty}
                    onChange={e => setFormData({...formData, qty: e.target.value})}
                    className="h-9 text-xs text-right"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-muted-foreground uppercase">{t.procurement.targetPrice}</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-2 top-2.5 w-3 h-3 text-muted-foreground" />
                    <Input 
                      placeholder="ناچاری نییە"
                      type="number"
                      value={formData.targetPrice}
                      onChange={e => setFormData({...formData, targetPrice: e.target.value})}
                      className="h-9 text-xs text-right pl-7"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-muted-foreground uppercase">{t.procurement.notes}</Label>
                <Textarea 
                  placeholder={t.procurement.notes + "..."}
                  value={formData.notes}
                  onChange={e => setFormData({...formData, notes: e.target.value})}
                  className="min-h-[80px] text-xs text-right resize-none"
                />
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full gap-2 mt-2 h-10 shadow-lg shadow-primary/20">
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {t.procurement.submit}
                    <Send className="w-4 h-4 ml-1" />
                  </>
                )}
              </Button>
            </motion.form>
          ) : (
            <motion.div 
              key="history"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-3 py-2"
            >
              <div className="text-center py-8 opacity-40">
                <Package className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                <p className="text-xs">هیچ داواکارییەک نییە</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
