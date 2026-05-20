import { auth, googleProvider, signInWithPopup } from '@/services/firebase';
import { useAuthStore } from '@/store/authStore';
import { useSettingsStore } from '@/store/settingsStore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { LogOut, User, LogIn } from 'lucide-react';
import { toast } from 'sonner';

export function UserMenu() {
  const { user, loading, loginAsDemo, logout } = useAuthStore();
  const { lang, t } = useSettingsStore();

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success(lang === 'ku' ? 'بە سەرکەوتوویی چوویتە ژوورەوە!' : 'تم تسجيل الدخول بنجاح!');
    } catch (error: unknown) {
      console.warn('Google Auth popup failed or was blocked:', error);
      
      // Notify user of the blocked/closed popup inside iframe
      toast.error(
        lang === 'ku'
          ? 'شکست لە چوونەژوورەوەی گوگڵ (ڕەنگە پەنجەرەی پۆپ-ئەپ داخرابێت). بەردەوام بە وەک میوان!'
          : 'فشل فتح نافذة Google (قد تكون تم حظرها أو إغلاقها). جاري الدخول كزائر!'
      );
      
      // Auto fallback to local / anonymous guest session to preserve user experience
      await loginAsDemo();
    }
  };

  const handleGuestLogin = async () => {
    try {
      await loginAsDemo();
      toast.success(
        lang === 'ku' 
          ? 'بە سەرکەوتوویی وەک میوان چوویتە ژوورەوە!' 
          : 'تم تسجيل الدخول كزائر بنجاح!'
      );
    } catch (e) {
      console.error('Guest login failed:', e);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success(lang === 'ku' ? 'دەرچوویت لە ئەژمارەکەت!' : 'تم تسجيل الخروج!');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 animate-pulse" />;
  }

  if (!user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger
          className="inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background h-8 px-3 text-xs font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
        >
          <LogIn className="w-4 h-4" />
          {lang === 'ku' ? 'چوونەژوورەوە' : 'تسجيل الدخول'}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuItem onClick={handleLogin} className="gap-2 cursor-pointer py-2">
            <LogIn className="w-4 h-4 text-primary" />
            <span className="font-medium text-xs">
              {lang === 'ku' ? 'چوونەژوورەوە بە گوگڵ' : 'الدخول بحساب Google'}
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleGuestLogin} className="gap-2 cursor-pointer py-2">
            <User className="w-4 h-4 text-slate-500" />
            <span className="font-medium text-xs">
              {lang === 'ku' ? 'چوونەژوورەوە وەک میوان' : 'الدخول كزائر (سريع)'}
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Determine fallback initial or display name
  const name = user.displayName || (user.email ? user.email.split('@')[0] : 'Guest');
  const emailLabel = user.email || 'guest@idg-gateway.com';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative h-10 w-10 rounded-full overflow-hidden border shadow-sm hover:opacity-80 transition-opacity cursor-pointer outline-none">
        <Avatar className="h-full w-full">
          <AvatarImage src={user.photoURL || undefined} alt={name} />
          <AvatarFallback><User className="w-5 h-5 text-slate-500" /></AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {emailLabel}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-red-500 gap-2 cursor-pointer">
          <LogOut className="w-4 h-4" />
          <span>{t.profile?.logout || 'دەرچوون'}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
