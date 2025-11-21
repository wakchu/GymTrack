import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import { RoutineProvider } from './context/RoutineContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RoutineProvider>
      <App />
    </RoutineProvider>
  </StrictMode>,
)
