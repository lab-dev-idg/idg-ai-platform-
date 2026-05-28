import { useState, useEffect } from 'react';
import { Globe, Phone, Mail, Menu, Clock } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { UserMenu } from './UserMenu';
import { FeedbackDialog } from './FeedbackDialog';
import { useSettingsStore } from '@/store/settingsStore';
import { Sheet, SheetContent, SheetTrigger } from '@/shared/ui/sheet';
import { Sidebar } from '@/features/sidebar';

export function Header() {
  const { lang, setLang, t } = useSettingsStore();
  const { pathname } = useLocation();

  const [baghdadTime, setBaghdadTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const bgw = new Date(utc + 3600000 * 3);
      const hours = String(bgw.getHours()).padStart(2, '0');
      const minutes = String(bgw.getMinutes()).padStart(2, '0');
      const seconds = String(bgw.getSeconds()).padStart(2, '0');
      setBaghdadTime(`${hours}:${minutes}:${seconds} BGW`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-[#071739] topbar-dark shadow-sm z-50 border-b border-white/10 sticky top-0">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Sheet>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" className="lg:hidden text-white hover:bg-white/10">
                  <Menu className="w-6 h-6" />
                </Button>
              }
            />
            <SheetContent side="right" className="p-0 bg-[#071739] border-white/10 w-[300px] sm:w-[350px]">
              <div className="h-full overflow-y-auto p-4 custom-scrollbar">
                <Sidebar isMobile />
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex items-center gap-3 md:gap-6">
            <Link to="/" className="flex items-center gap-3 hover:opacity-95 transition-opacity">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-[#0066FF] rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Globe className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-base md:text-xl font-bold text-white tracking-tight">
                  {t.app.title}
                </h1>
                <p className="hidden xs:block text-[8px] md:text-xs text-blue-100/80 font-medium uppercase tracking-wider">
                  {t.app.subtitle}
                </p>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1.5 border-s border-white/10 ps-4 md:ps-6">
              <Link 
                to="/" 
                className={`text-xs font-semibold px-3.5 py-2 rounded-xl transition-all ${
                  pathname === '/' 
                    ? 'bg-white/12 text-white shadow-sm' 
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {t.nav?.terminal || 'AI Assistant'}
              </Link>
              <Link 
                to="/customs" 
                className={`text-xs font-semibold px-3.5 py-2 rounded-xl transition-all ${
                  pathname === '/customs' 
                    ? 'bg-white/12 text-white shadow-sm' 
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {t.nav?.customs || 'Customs Gateway'}
              </Link>
            </nav>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4 font-kurdish-body">
          <div className="hidden sm:flex bg-white/5 p-1 rounded-lg border border-white/10">
            <Button 
              variant={lang === 'ku' ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => setLang('ku')}
              className={`h-7 px-3 text-[10px] font-bold rounded-md transition-all ${lang === 'ku' ? 'bg-[#0066FF] text-white hover:bg-[#0066FF]/90' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
            >
              Kurdî
            </Button>
            <Button 
              variant={lang === 'ar' ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => setLang('ar')}
              className={`h-7 px-3 text-[10px] font-bold rounded-md transition-all ${lang === 'ar' ? 'bg-[#0066FF] text-white hover:bg-[#0066FF]/90' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
            >
              عربي
            </Button>
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <Badge variant="outline" className="bg-[#0b245c] text-blue-300 border-white/10 py-1 font-mono tracking-wider text-[10px] uppercase font-semibold flex items-center gap-1.5 rounded-lg">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <span>{baghdadTime}</span>
            </Badge>
            <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20 py-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse mr-1" />
              {t.app.systemActive}
            </Badge>
          </div>

          <div className="flex items-center gap-1 md:gap-2">
            <Button variant="ghost" size="icon" className="hidden sm:inline-flex text-white hover:bg-white/10">
              <Phone className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hidden sm:inline-flex text-white hover:bg-white/10">
              <Mail className="w-5 h-5" />
            </Button>
            <UserMenu />
            <FeedbackDialog />
          </div>
        </div>
      </div>
    </header>
  );
}
