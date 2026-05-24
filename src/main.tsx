import React from 'react'
import ReactDOM from 'react-dom/client'
import { VieiraAnalytics } from '@vieira/analytics/react'
import App from './App.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    <VieiraAnalytics projectKey="serveruler-client" />
  </React.StrictMode>
)
