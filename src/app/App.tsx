import { TooltipProvider } from "@/shared/ui/tooltip";
import { AppRouter } from "./router";
import { LanguageProvider } from "./providers/LanguageProvider";
import { AuthProvider } from "./providers/AuthProvider";

export default function App() {
  return (
    <TooltipProvider>
      <AuthProvider>
        <LanguageProvider>
          <AppRouter />
        </LanguageProvider>
      </AuthProvider>
    </TooltipProvider>
  );
}
