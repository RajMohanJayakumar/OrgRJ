/**
 * MMM Fingers Game Route Detection Utilities
 * Handles route detection and analytics for the MMM fingers module
 */

import { MMM_ROUTES } from '../config/routes'

/**
 * Main route detection function
 * Returns MMM route information or null if not an MMM route
 */
export const detectMMMRoute = () => {
  try {
    const pathname = window.location.pathname
    const urlParams = new URLSearchParams(window.location.search)
    
    // Check direct path: /mmm-fingers
    if (pathname === '/mmm-fingers') {
      return {
        isMMM: true,
        mode: null,
        method: 'direct_path',
        route: pathname
      }
    }
    
    // Check query parameter: ?mode=mmm-fingers
    if (urlParams.get('mode') === 'mmm-fingers') {
      return {
        isMMM: true,
        mode: null,
        method: 'query_param',
        route: `${pathname}?mode=mmm-fingers`
      }
    }
    
    // Check legacy parameter: ?mmm=true
    if (urlParams.get('mmm') === 'true') {
      return {
        isMMM: true,
        mode: null,
        method: 'legacy_param',
        route: `${pathname}?mmm=true`
      }
    }
    
    // Check individual mode routes
    const modeRoutes = {
      '/mmm-fingers/classic': 'classic',
      '/mmm-fingers/speed': 'speed',
      '/mmm-fingers/memory': 'memory',
      '/mmm-fingers/challenge': 'challenge'
    }
    
    if (modeRoutes[pathname]) {
      return {
        isMMM: true,
        mode: modeRoutes[pathname],
        method: 'direct_mode',
        route: pathname
      }
    }
    
    return null
  } catch (error) {
    console.warn('MMM route detection error:', error)
    return null
  }
}

/**
 * Check if current route is MMM-related
 * Simple boolean check for integration with main app
 */
export const isMMMRoute = () => {
  const detection = detectMMMRoute()
  return detection ? detection.isMMM : false
}

/**
 * Track MMM game access for analytics
 * Stores access method and timestamp in localStorage
 */
export const trackMMMAccess = () => {
  try {
    const detection = detectMMMRoute()
    if (!detection) return null

    const accessEvent = {
      timestamp: new Date().toISOString(),
      method: detection.method,
      route: detection.route,
      mode: detection.mode,
      userAgent: navigator.userAgent,
      referrer: document.referrer,
      sessionId: getOrCreateSessionId()
    }

    // Store in localStorage for analytics
    const existingData = JSON.parse(localStorage.getItem('mmmAccessAnalytics') || '[]')
    existingData.push(accessEvent)
    
    // Keep only last 100 entries
    if (existingData.length > 100) {
      existingData.splice(0, existingData.length - 100)
    }
    
    localStorage.setItem('mmmAccessAnalytics', JSON.stringify(existingData))
    
    return accessEvent
  } catch (error) {
    console.warn('MMM access tracking error:', error)
    return null
  }
}

/**
 * Get or create session ID for analytics
 */
const getOrCreateSessionId = () => {
  let sessionId = sessionStorage.getItem('mmmSessionId')
  if (!sessionId) {
    sessionId = 'mmm_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    sessionStorage.setItem('mmmSessionId', sessionId)
  }
  return sessionId
}

/**
 * URL validation for MMM routes
 */
export const validateMMMURL = (url) => {
  try {
    const testURL = new URL(url, window.location.origin)
    const pathname = testURL.pathname
    const searchParams = testURL.searchParams
    
    // Valid direct paths
    const validPaths = [
      '/mmm-fingers', 
      '/mmm-fingers/classic', 
      '/mmm-fingers/speed', 
      '/mmm-fingers/memory', 
      '/mmm-fingers/challenge'
    ]
    if (validPaths.includes(pathname)) {
      return { valid: true, type: 'direct_path', path: pathname }
    }
    
    // Valid query parameters
    if (searchParams.get('mode') === 'mmm-fingers') {
      return { valid: true, type: 'query_param', path: pathname }
    }
    
    if (searchParams.get('mmm') === 'true') {
      return { valid: true, type: 'legacy_param', path: pathname }
    }
    
    return { valid: false, type: null, path: pathname }
  } catch (error) {
    return { valid: false, type: null, path: null, error: error.message }
  }
}

/**
 * Generate MMM URLs for different access methods
 */
export const generateMMMURLs = (baseURL = window.location.origin) => {
  return {
    direct: `${baseURL}/mmm-fingers`,
    queryParam: `${baseURL}/?mode=mmm-fingers`,
    legacy: `${baseURL}/?mmm=true`,
    modes: {
      classic: `${baseURL}/mmm-fingers/classic`,
      speed: `${baseURL}/mmm-fingers/speed`,
      memory: `${baseURL}/mmm-fingers/memory`,
      challenge: `${baseURL}/mmm-fingers/challenge`
    }
  }
}

/**
 * Get MMM analytics data
 */
export const getMMMAnalytics = () => {
  try {
    const data = JSON.parse(localStorage.getItem('mmmAccessAnalytics') || '[]')
    
    // Calculate basic statistics
    const totalAccesses = data.length
    const methodCounts = data.reduce((acc, event) => {
      acc[event.method] = (acc[event.method] || 0) + 1
      return acc
    }, {})
    
    const modeCounts = data.reduce((acc, event) => {
      if (event.mode) {
        acc[event.mode] = (acc[event.mode] || 0) + 1
      }
      return acc
    }, {})
    
    return {
      totalAccesses,
      methodCounts,
      modeCounts,
      rawData: data
    }
  } catch (error) {
    console.warn('MMM analytics retrieval error:', error)
    return {
      totalAccesses: 0,
      methodCounts: {},
      modeCounts: {},
      rawData: []
    }
  }
}

/**
 * Clear MMM analytics data
 */
export const clearMMMAnalytics = () => {
  try {
    localStorage.removeItem('mmmAccessAnalytics')
    sessionStorage.removeItem('mmmSessionId')
    return true
  } catch (error) {
    console.warn('MMM analytics clear error:', error)
    return false
  }
}
