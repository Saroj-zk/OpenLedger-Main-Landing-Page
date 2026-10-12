import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { CopyProvider } from '@/content/copy'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CopyProvider>
      <App />
    </CopyProvider>
  </StrictMode>,
)
