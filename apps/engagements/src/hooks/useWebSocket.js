import { useState, useEffect, useCallback, useRef } from 'react'
import { WEBSOCKET_EVENTS } from '../config/websocketEvents'

/**
 * WebSocket Hook for Real-time Communication
 * Handles connection, reconnection, and message handling
 */
export default function useWebSocket(url = null) {
  const [isConnected, setIsConnected] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState('disconnected')
  const [lastMessage, setLastMessage] = useState(null)
  const [error, setError] = useState(null)
  
  const wsRef = useRef(null)
  const reconnectTimeoutRef = useRef(null)
  const reconnectAttemptsRef = useRef(0)
  const messageQueueRef = useRef([])
  const listenersRef = useRef(new Map())
  
  const maxReconnectAttempts = 5
  const reconnectDelay = 3000

  // Default WebSocket URL (for development)
  const wsUrl = url || (
    process.env.NODE_ENV === 'production'
      ? 'wss://your-production-websocket-url.com'
      : 'ws://localhost:8080'
  )

  // Flag to disable WebSocket in demo mode
  const isDemoMode = !url && process.env.NODE_ENV !== 'production'

  // Connect to WebSocket
  const connect = useCallback(() => {
    // Skip connection in demo mode (no server available)
    if (isDemoMode) {
      console.log('WebSocket demo mode - no server connection')
      setConnectionStatus('demo')
      setError('Demo mode - WebSocket server not available')
      return Promise.resolve()
    }

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return Promise.resolve() // Already connected
    }

    setConnectionStatus('connecting')
    setError(null)

    return new Promise((resolve, reject) => {
      try {
        wsRef.current = new WebSocket(wsUrl)

        wsRef.current.onopen = () => {
          console.log('WebSocket connected')
          setIsConnected(true)
          setConnectionStatus('connected')
          reconnectAttemptsRef.current = 0

          // Send queued messages
          while (messageQueueRef.current.length > 0) {
            const message = messageQueueRef.current.shift()
            wsRef.current.send(JSON.stringify(message))
          }
          resolve()
        }

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          setLastMessage(data)
          
          // Trigger specific listeners
          const listeners = listenersRef.current.get(data.type) || []
          listeners.forEach(callback => callback(data))
          
          // Trigger global listeners
          const globalListeners = listenersRef.current.get('*') || []
          globalListeners.forEach(callback => callback(data))
        } catch (error) {
          console.error('Error parsing WebSocket message:', error)
        }
      }

      wsRef.current.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason)
        setIsConnected(false)
        setConnectionStatus('disconnected')
        
        // Attempt reconnection if not intentional
        if (event.code !== 1000 && reconnectAttemptsRef.current < maxReconnectAttempts) {
          setConnectionStatus('reconnecting')
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current++
            connect()
          }, reconnectDelay)
        }
      }

        wsRef.current.onerror = (error) => {
          console.error('WebSocket error:', error)
          setError('Connection failed')
          setConnectionStatus('error')
          reject(error)
        }

      } catch (error) {
        console.error('Failed to create WebSocket connection:', error)
        setError('Failed to connect')
        setConnectionStatus('error')
        reject(error)
      }
    })
  }, [wsUrl, isDemoMode])

  // Disconnect from WebSocket
  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }
    
    if (wsRef.current) {
      wsRef.current.close(1000, 'User disconnected')
    }
    
    setIsConnected(false)
    setConnectionStatus('disconnected')
    reconnectAttemptsRef.current = 0
  }, [])

  // Send message
  const sendMessage = useCallback((message) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message))
    } else {
      // Queue message for when connection is restored
      messageQueueRef.current.push(message)
      
      // Try to connect if not connected
      if (!isConnected) {
        connect()
      }
    }
  }, [isConnected, connect])

  // Add event listener
  const addEventListener = useCallback((eventType, callback) => {
    if (!listenersRef.current.has(eventType)) {
      listenersRef.current.set(eventType, [])
    }
    listenersRef.current.get(eventType).push(callback)
    
    // Return cleanup function
    return () => {
      const listeners = listenersRef.current.get(eventType) || []
      const index = listeners.indexOf(callback)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [])

  // Remove event listener
  const removeEventListener = useCallback((eventType, callback) => {
    const listeners = listenersRef.current.get(eventType) || []
    const index = listeners.indexOf(callback)
    if (index > -1) {
      listeners.splice(index, 1)
    }
  }, [])

  // Auto-connect on mount (disabled in demo mode)
  useEffect(() => {
    if (!isDemoMode) {
      connect()
    } else {
      // Demo mode - simulate connection status
      setConnectionStatus('demo')
      setError('Demo mode - WebSocket server not available')
    }

    return () => {
      if (!isDemoMode) {
        disconnect()
      }
    }
  }, [connect, disconnect, isDemoMode])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
    }
  }, [])

  // Heartbeat to keep connection alive
  useEffect(() => {
    if (!isConnected) return

    const heartbeatInterval = setInterval(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        sendMessage({ type: WEBSOCKET_EVENTS.HEARTBEAT, timestamp: Date.now() })
      }
    }, 30000) // Send heartbeat every 30 seconds

    return () => clearInterval(heartbeatInterval)
  }, [isConnected, sendMessage])

  return {
    isConnected,
    connectionStatus,
    lastMessage,
    error,
    connect,
    disconnect,
    sendMessage,
    addEventListener,
    removeEventListener
  }
}
