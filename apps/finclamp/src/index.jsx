
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// Service Worker configuration
const SW_ENABLED = true // Enabled for PWA functionality - trigger deployment

// Handle service worker registration/unregistration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    if (SW_ENABLED) {
      // Register service worker
      navigator.serviceWorker.register('/OrgRJ/sw.js', {
        scope: '/OrgRJ/'
      })
        .then((registration) => {
          console.log('✅ Service Worker registered successfully:', registration.scope)

          // Check for updates
          registration.addEventListener('updatefound', () => {
            console.log('🔄 Service Worker update found')
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('🆕 New content available, please refresh')
                }
              })
            }
          })
        })
        .catch((registrationError) => {
          console.error('❌ Service Worker registration failed:', registrationError)
        })
    } else {
      // Unregister existing service workers
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          registration.unregister().then((success) => {
            if (success) {
              console.log('🧹 Service Worker unregistered successfully')
            }
          })
        })
      })
    }
  })
}

// Add global error handler to prevent SW errors from breaking the app
window.addEventListener('error', (event) => {
  if (event.filename && event.filename.includes('sw.js')) {
    console.log('🔧 Service Worker error caught and handled:', event.error)
    event.preventDefault()
  }
})

window.addEventListener('unhandledrejection', (event) => {
  if (event.reason && event.reason.toString().includes('sw.js')) {
    console.log('🔧 Service Worker promise rejection caught and handled:', event.reason)
    event.preventDefault()
  }
})
