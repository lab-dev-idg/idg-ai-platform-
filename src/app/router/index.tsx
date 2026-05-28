import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardPage from "@/features/dashboard/pages/DashboardPage";
import CustomsPage from "@/features/customs/pages/CustomsPage";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/customs" element={<CustomsPage />} />
      </Routes>
    </BrowserRouter>
  );
}
