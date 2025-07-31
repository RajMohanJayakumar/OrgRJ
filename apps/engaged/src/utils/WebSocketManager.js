/**
 * WebSocket Manager Utility
 * Centralized WebSocket connection management
 */

import { WEBSOCKET_EVENTS } from '../config/websocketEvents'

class WebSocketManager {
  constructor(url, protocols = []) {
    this.url = url
    this.protocols = protocols
    this.ws = null
    this.isConnected = false
    this.listeners = new Map()
    this.messageQueue = []
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 5
    this.reconnectDelay = 3000
    this.heartbeatInterval = null
  }

  // Connect to WebSocket
  connect() {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.url, this.protocols)

        this.ws.onopen = () => {
          console.log('WebSocket connected')
          this.isConnected = true
          this.reconnectAttempts = 0
          this.startHeartbeat()
          this.flushMessageQueue()
          resolve()
        }

        this.ws.onmessage = (event) => {
          this.handleMessage(event)
        }

        this.ws.onclose = (event) => {
          console.log('WebSocket disconnected:', event.code)
          this.isConnected = false
          this.stopHeartbeat()
          this.handleReconnect()
        }

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error)
          reject(error)
        }

      } catch (error) {
        reject(error)
      }
    })
  }

  // Disconnect from WebSocket
  disconnect() {
    if (this.ws) {
      this.ws.close(1000, 'User disconnected')
    }
    this.stopHeartbeat()
    this.isConnected = false
  }

  // Send message
  send(message) {
    if (this.isConnected && this.ws) {
      this.ws.send(JSON.stringify(message))
    } else {
      this.messageQueue.push(message)
    }
  }

  // Add event listener
  on(eventType, callback) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, [])
    }
    this.listeners.get(eventType).push(callback)
  }

  // Remove event listener
  off(eventType, callback) {
    const listeners = this.listeners.get(eventType)
    if (listeners) {
      const index = listeners.indexOf(callback)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }

  // Handle incoming messages
  handleMessage(event) {
    try {
      const data = JSON.parse(event.data)
      
      // Trigger specific listeners
      const listeners = this.listeners.get(data.type) || []
      listeners.forEach(callback => callback(data))
      
      // Trigger global listeners
      const globalListeners = this.listeners.get('*') || []
      globalListeners.forEach(callback => callback(data))
      
    } catch (error) {
      console.error('Error parsing WebSocket message:', error)
    }
  }

  // Handle reconnection
  handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      setTimeout(() => {
        this.reconnectAttempts++
        console.log(`Reconnecting... Attempt ${this.reconnectAttempts}`)
        this.connect().catch(() => {
          // Reconnection failed, will try again
        })
      }, this.reconnectDelay)
    }
  }

  // Start heartbeat
  startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.isConnected) {
        this.send({ type: WEBSOCKET_EVENTS.HEARTBEAT, timestamp: Date.now() })
      }
    }, 30000) // 30 seconds
  }

  // Stop heartbeat
  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
    }
  }

  // Flush message queue
  flushMessageQueue() {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift()
      this.send(message)
    }
  }

  // Get connection status
  getStatus() {
    return {
      isConnected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts,
      queuedMessages: this.messageQueue.length
    }
  }
}

export default WebSocketManager
