import { Toaster } from 'sonner'
import './App.css'
import { AuthProvider } from './components/auth/AuthProvider'

function App() {

  return (
    <>
     <Toaster richColors />

       <AuthProvider>
          <div></div>
      </AuthProvider>
    </>
  )
}

export default App
