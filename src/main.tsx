import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index-orange.css'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './react-query/queryClient.ts'
import { ThemeProvider } from './contexts/theme-provider.tsx'
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/auth-provider.tsx'
import { TooltipProvider } from './components/ui/tooltip.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster
            position="top-center"
            reverseOrder={false}
            toastOptions={{
              duration: 5000,
            }}
          />
          <TooltipProvider>
            <App />
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </AuthProvider>
  </StrictMode>,
)
