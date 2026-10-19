import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/michroma/400.css'
import '@fontsource-variable/manrope/index.css'
import '@fontsource/jetbrains-mono/400.css'
import './index.css'
import App from './App.tsx'
import { MotionPreferences } from './motion/MotionPreferences'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MotionPreferences>
      <App />
    </MotionPreferences>
  </StrictMode>,
)
