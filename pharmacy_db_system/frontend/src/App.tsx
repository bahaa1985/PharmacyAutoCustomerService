import { AuthProvider } from './context/AuthProvider'
import { AppRouter } from './app/router'

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  )
}

export default App
