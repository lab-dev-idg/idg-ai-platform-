import React from "react";
import { Toaster } from "@/shared/ui/toaster";
import { Sidebar } from "@/features/sidebar";
import { StatsSection } from "@/features/dashboard";
import { DashboardLayout } from "@/app/layouts/DashboardLayout";
import { CustomsModule } from "@modules/customs";

export default function CustomsPage() {
  return (
    <DashboardLayout>
      <Toaster position="top-center" richColors />
      <div className="flex-none">
        <StatsSection />
      </div>

      <main className="flex-1 min-h-0 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6 p-3 md:p-6 lg:pt-0 overflow-hidden">
        <Sidebar />
        <div className="lg:col-span-9 h-full min-h-0 overflow-y-auto pb-8 pr-1 custom-scrollbar">
          <CustomsModule />
        </div>
      </main>
    </DashboardLayout>
  );
}
