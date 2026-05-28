import React from "react";
import { Toaster } from "@/shared/ui/toaster";
import { Sidebar } from "@/features/sidebar";
import { DashboardLayout } from "@/app/layouts/DashboardLayout";
import { CustomsModule } from "@modules/customs";

export default function CustomsPage() {
  return (
    <DashboardLayout>
      <Toaster position="top-center" richColors />
      <main className="flex-1 min-h-0 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6 p-3 md:p-6 overflow-hidden">
        <Sidebar />
        <div className="lg:col-span-9 h-full min-h-0 overflow-y-auto pb-8 pr-1 custom-scrollbar flex flex-col gap-4">
          {/* Professional Breadcrumb */}
          <div className="flex items-center justify-between text-xs bg-white border border-slate-100 px-4 py-2.5 rounded-2xl shadow-xs">
            <div className="flex items-center gap-2 text-slate-500 font-medium">
              <span>Iraq Digital Gateway</span>
              <span>/</span>
              <span className="text-[#0066FF] font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0066FF] animate-pulse" />
                دەروازەی گومرگ
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono select-none hidden sm:inline-block">
              OPERATIONAL SECURE // GATEWAY_ACTIVE
            </div>
          </div>

          <CustomsModule />
        </div>
      </main>
    </DashboardLayout>
  );
}
