import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Injeta a app React dentro do <div id="root"> do index.html
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
