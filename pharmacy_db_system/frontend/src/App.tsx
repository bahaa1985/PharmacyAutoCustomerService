import { AuthProvider } from "./context/AuthProvider";
import { AppRouter } from "./app/router";
import { ToastProvider } from "./context/ToastProvider";
import { PharmacyProvider } from "./context/PharmacyProvider";
import { LanguageProvider } from "./context/LanguageProvider";

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <PharmacyProvider>
          <LanguageProvider>
            <AppRouter />
          </LanguageProvider>
        </PharmacyProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
