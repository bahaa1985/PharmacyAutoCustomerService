import { useEffect } from "react";
import { AuthProvider } from "./context/AuthProvider";
import { AppRouter } from "./app/router";
import { ToastProvider } from "./context/ToastProvider";
import { PharmacyProvider } from "./context/PharmacyProvider";
import { LanguageProvider } from "./context/LanguageProvider";
import { ThemeProvider } from "./context/ThemeContext";
import { listenForForegroundMessages } from "./utils/firebase-client";

function App() {
  useEffect(()=>{
    listenForForegroundMessages();
  },[])
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <PharmacyProvider>
            <LanguageProvider>
              <AppRouter />
            </LanguageProvider>
          </PharmacyProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
