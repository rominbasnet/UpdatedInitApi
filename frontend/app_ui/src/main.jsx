import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import AuthWrapper from './auth/AuthWrapper.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
  <AuthWrapper>
    <App />
  </AuthWrapper>
  </React.StrictMode>
)

