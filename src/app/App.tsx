import { TooltipProvider } from "@/shared/ui/tooltip";
import { AppRouter } from "./router";
import { LanguageProvider } from "./providers/LanguageProvider";
import { AuthProvider } from "./providers/AuthProvider";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";

export default function App() {
  return (
    <ErrorBoundary>
      <TooltipProvider>
        <AuthProvider>
          <LanguageProvider>
            <AppRouter />
          </LanguageProvider>
        </AuthProvider>
      </TooltipProvider>
    </ErrorBoundary>
  );
}
