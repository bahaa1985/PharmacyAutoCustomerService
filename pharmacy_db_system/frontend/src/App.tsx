import { AuthProvider } from './context/AuthProvider'
import { AppRouter } from './app/router'
import { ToastProvider } from './context/ToastProvider'

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </ToastProvider>
  )
}

export default App
