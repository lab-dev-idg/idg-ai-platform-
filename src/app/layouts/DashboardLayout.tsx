import { Header } from "@/components/common/Header";
import { useSettingsStore } from "@/store/settingsStore";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const lang = useSettingsStore(state => state.lang);
  const dir = lang === 'ku' || lang === 'ar' ? 'rtl' : 'ltr';

  return (
    <div className="flex flex-col h-screen bg-soft-bg overflow-hidden" dir={dir}>
      <Header />
      {children}
    </div>
  );
}
