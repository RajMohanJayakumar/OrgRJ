import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * Global Download Notification Component
 * Shows download progress and completion notifications, especially useful for PWA
 */
export default function DownloadNotification() {
  const [notifications, setNotifications] = useState([])

  // Listen for custom download events
  useEffect(() => {
    const handleDownloadStart = (event) => {
      const { filename, type = 'PDF' } = event.detail
      const id = Date.now()
      
      setNotifications(prev => [...prev, {
        id,
        filename,
        type,
        status: 'downloading',
        progress: 0,
        timestamp: new Date()
      }])
    }

    const handleDownloadProgress = (event) => {
      const { id, progress } = event.detail
      
      setNotifications(prev => prev.map(notif => 
        notif.id === id ? { ...notif, progress } : notif
      ))
    }

    const handleDownloadComplete = (event) => {
      const { id, filename, type = 'PDF' } = event.detail
      
      setNotifications(prev => prev.map(notif => 
        notif.id === id ? { ...notif, status: 'completed' } : notif
      ))

      // Auto-remove completed notifications after 5 seconds
      setTimeout(() => {
        setNotifications(prev => prev.filter(notif => notif.id !== id))
      }, 5000)
    }

    const handleDownloadError = (event) => {
      const { id, error } = event.detail
      
      setNotifications(prev => prev.map(notif => 
        notif.id === id ? { ...notif, status: 'error', error } : notif
      ))

      // Auto-remove error notifications after 8 seconds
      setTimeout(() => {
        setNotifications(prev => prev.filter(notif => notif.id !== id))
      }, 8000)
    }

    // Add event listeners
    window.addEventListener('downloadStart', handleDownloadStart)
    window.addEventListener('downloadProgress', handleDownloadProgress)
    window.addEventListener('downloadComplete', handleDownloadComplete)
    window.addEventListener('downloadError', handleDownloadError)

    return () => {
      window.removeEventListener('downloadStart', handleDownloadStart)
      window.removeEventListener('downloadProgress', handleDownloadProgress)
      window.removeEventListener('downloadComplete', handleDownloadComplete)
      window.removeEventListener('downloadError', handleDownloadError)
    }
  }, [])

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id))
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            className={`p-4 rounded-xl shadow-lg border backdrop-blur-sm ${
              notification.status === 'downloading' 
                ? 'bg-blue-50/90 border-blue-200 text-blue-800'
                : notification.status === 'completed'
                ? 'bg-green-50/90 border-green-200 text-green-800'
                : 'bg-red-50/90 border-red-200 text-red-800'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3 flex-1">
                <div className="flex-shrink-0">
                  {notification.status === 'downloading' && (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
                  )}
                  {notification.status === 'completed' && (
                    <div className="text-lg">✅</div>
                  )}
                  {notification.status === 'error' && (
                    <div className="text-lg">❌</div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate">
                    {notification.status === 'downloading' && `Generating ${notification.type}...`}
                    {notification.status === 'completed' && `${notification.type} Downloaded!`}
                    {notification.status === 'error' && `Download Failed`}
                  </div>
                  <div className="text-xs opacity-75 truncate">
                    {notification.filename}
                  </div>
                  
                  {notification.status === 'downloading' && (
                    <div className="mt-2">
                      <div className="w-full bg-blue-200 rounded-full h-1.5">
                        <motion.div
                          className="bg-blue-600 h-1.5 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${notification.progress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <button
                onClick={() => removeNotification(notification.id)}
                className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

/**
 * Utility functions to trigger download notifications
 */
export const downloadNotifications = {
  start: (filename, type = 'PDF') => {
    const id = Date.now()
    window.dispatchEvent(new CustomEvent('downloadStart', {
      detail: { id, filename, type }
    }))
    return id
  },
  
  progress: (id, progress) => {
    window.dispatchEvent(new CustomEvent('downloadProgress', {
      detail: { id, progress }
    }))
  },
  
  complete: (id, filename, type = 'PDF') => {
    window.dispatchEvent(new CustomEvent('downloadComplete', {
      detail: { id, filename, type }
    }))
  },
  
  error: (id, error) => {
    window.dispatchEvent(new CustomEvent('downloadError', {
      detail: { id, error }
    }))
  }
}
