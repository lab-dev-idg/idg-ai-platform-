import { Globe, Phone, Mail, UserCheck, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserMenu } from './UserMenu';
import { FeedbackDialog } from './FeedbackDialog';
import { useLanguage } from '@/lib/LanguageContext';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Sidebar } from '@/features/sidebar';

export function Header() {
  const { lang, setLang, t } = useLanguage();

  return (
    <header className="bg-[#071739] topbar-dark shadow-sm z-50 border-b border-white/10 sticky top-0">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden text-white hover:bg-white/10">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="p-0 bg-[#071739] border-white/10 w-[300px] sm:w-[350px]">
              <div className="h-full overflow-y-auto p-4 custom-scrollbar">
                <Sidebar isMobile />
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex items-center gap-3">
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

          <div className="hidden lg:flex items-center gap-4">
            <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20 py-1">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse ml-2" />
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
