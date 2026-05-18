import { Header } from "@/components/common/Header";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen bg-[#F8FAFC] overflow-hidden" dir="rtl">
      <Header />
      {children}
    </div>
  );
}
