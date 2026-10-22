import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './styles/tokens.css'
import './styles/global.css'
import './styles/accessibility.css'
import './styles/layout.css'
import './styles/auth.css'
import './styles/shell.css'
import './styles/pages.css'
import './styles/dashboard.css'
import './styles/devices.css'
import './styles/users.css'
import './styles/device-detail.css'
import './styles/alerts.css'
import './styles/simulator.css'
import './styles/user-dashboard.css'
import App from './App.jsx'
import { AppProvider } from './context/AppContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AppProvider>
  </StrictMode>,
)
