import { AuthProvider } from "./context/AuthProvider";
import { AppRouter } from "./app/router";
import { ToastProvider } from "./context/ToastProvider";
import { PharmacyProvider } from "./context/PharmacyProvider";

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <PharmacyProvider>
          <AppRouter />
        </PharmacyProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
