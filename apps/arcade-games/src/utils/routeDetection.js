/**
 * Route Detection Utility for Arcade Games Module
 * Centralized route detection logic that can be easily removed
 */

import { GAME_ROUTES } from '../config/routes'

/**
 * Main route detection function
 * Returns arcade route information or null if not an arcade route
 */
export const detectArcadeRoute = () => {
  try {
    const pathname = window.location.pathname
    const urlParams = new URLSearchParams(window.location.search)
    
    // Check direct path: /arcade
    if (pathname === '/arcade') {
      return {
        isArcade: true,
        game: null,
        method: 'direct_path',
        route: pathname
      }
    }
    
    // Check query parameter: ?mode=arcade
    if (urlParams.get('mode') === 'arcade') {
      return {
        isArcade: true,
        game: null,
        method: 'query_param',
        route: `${pathname}?mode=arcade`
      }
    }
    
    // Check legacy parameter: ?arcade=true
    if (urlParams.get('arcade') === 'true') {
      return {
        isArcade: true,
        game: null,
        method: 'legacy_param',
        route: `${pathname}?arcade=true`
      }
    }
    
    // Check individual game routes (for future direct game access)
    const gameRoutes = {
      '/arcade/snake': 'snake',
      '/arcade/tetris': 'tetris',
      '/arcade/pong': 'pong',
      '/arcade/space-shooter': 'space-shooter'
    }
    
    if (gameRoutes[pathname]) {
      return {
        isArcade: true,
        game: gameRoutes[pathname],
        method: 'direct_game',
        route: pathname
      }
    }
    
    return null
  } catch (error) {
    console.warn('Arcade route detection error:', error)
    return null
  }
}

/**
 * Check if current route is arcade-related
 * Simple boolean check for integration with main app
 */
export const isArcadeRoute = () => {
  const detection = detectArcadeRoute()
  return detection ? detection.isArcade : false
}

/**
 * Get current arcade game if on a specific game route
 */
export const getCurrentArcadeGame = () => {
  const detection = detectArcadeRoute()
  return detection ? detection.game : null
}

/**
 * Get arcade route method (how user accessed arcade)
 */
export const getArcadeRouteMethod = () => {
  const detection = detectArcadeRoute()
  return detection ? detection.method : null
}

/**
 * URL validation for arcade routes
 */
export const validateArcadeURL = (url) => {
  try {
    const testURL = new URL(url, window.location.origin)
    const pathname = testURL.pathname
    const searchParams = testURL.searchParams
    
    // Valid direct paths
    const validPaths = ['/arcade', '/arcade/snake', '/arcade/tetris', '/arcade/pong', '/arcade/space-shooter']
    if (validPaths.includes(pathname)) {
      return { valid: true, type: 'direct_path', path: pathname }
    }
    
    // Valid query parameters
    if (searchParams.get('mode') === 'arcade') {
      return { valid: true, type: 'query_param', path: pathname }
    }
    
    if (searchParams.get('arcade') === 'true') {
      return { valid: true, type: 'legacy_param', path: pathname }
    }
    
    return { valid: false, type: null, path: pathname }
  } catch (error) {
    return { valid: false, type: null, path: null, error: error.message }
  }
}

/**
 * Generate arcade URLs for different access methods
 */
export const generateArcadeURLs = (baseURL = window.location.origin) => {
  return {
    direct: `${baseURL}/arcade`,
    queryParam: `${baseURL}/?mode=arcade`,
    legacy: `${baseURL}/?arcade=true`,
    games: {
      snake: `${baseURL}/arcade/snake`,
      tetris: `${baseURL}/arcade/tetris`,
      pong: `${baseURL}/arcade/pong`,
      spaceShooter: `${baseURL}/arcade/space-shooter`
    }
  }
}

/**
 * Analytics helper for tracking arcade access
 */
export const trackArcadeAccess = () => {
  const detection = detectArcadeRoute()
  if (detection && detection.isArcade) {
    // Track arcade access method
    const event = {
      category: 'Arcade Games',
      action: 'Access',
      label: detection.method,
      route: detection.route,
      game: detection.game || 'menu',
      timestamp: new Date().toISOString()
    }
    
    // Store in localStorage for analytics
    try {
      const arcadeAnalytics = JSON.parse(localStorage.getItem('arcade_analytics') || '[]')
      arcadeAnalytics.push(event)
      
      // Keep only last 100 events
      if (arcadeAnalytics.length > 100) {
        arcadeAnalytics.splice(0, arcadeAnalytics.length - 100)
      }
      
      localStorage.setItem('arcade_analytics', JSON.stringify(arcadeAnalytics))
    } catch (error) {
      console.warn('Failed to track arcade access:', error)
    }
    
    return event
  }
  
  return null
}

export default {
  detectArcadeRoute,
  isArcadeRoute,
  getCurrentArcadeGame,
  getArcadeRouteMethod,
  validateArcadeURL,
  generateArcadeURLs,
  trackArcadeAccess
}
