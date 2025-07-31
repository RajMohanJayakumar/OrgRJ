/**
 * MMM Fingers Game Route Configuration
 * Centralized route management for the MMM fingers module
 */

export const MMM_ROUTES = {
  // Main MMM route patterns
  PATTERNS: {
    DIRECT_PATH: '/mmm-fingers',
    QUERY_PARAM: '?mode=mmm-fingers',
    LEGACY_PARAM: '?mmm=true'
  },
  
  // Individual game modes (for future direct access)
  MODES: {
    CLASSIC: '/mmm-fingers/classic',
    SPEED: '/mmm-fingers/speed',
    MEMORY: '/mmm-fingers/memory',
    CHALLENGE: '/mmm-fingers/challenge'
  },
  
  // Route metadata
  META: {
    TITLE: 'MMM Fingers - Multi-Modal Memory Training - FinClamp',
    DESCRIPTION: 'Train your finger memory with progressive multi-modal exercises',
    KEYWORDS: 'memory training, finger exercises, cognitive training, brain games, memory improvement',
    ROBOTS: 'noindex, nofollow' // Keep hidden from search engines initially
  }
}

/**
 * Route detection utility
 * Checks if current URL matches MMM fingers game routes
 */
export const detectMMMRoute = () => {
  try {
    const pathname = window.location.pathname
    const urlParams = new URLSearchParams(window.location.search)
    
    // Check direct path
    if (pathname === MMM_ROUTES.PATTERNS.DIRECT_PATH) {
      return { isMMM: true, mode: null, method: 'direct_path' }
    }
    
    // Check query parameter methods
    if (urlParams.get('mode') === 'mmm-fingers') {
      return { isMMM: true, mode: null, method: 'query_param' }
    }
    
    if (urlParams.get('mmm') === 'true') {
      return { isMMM: true, mode: null, method: 'legacy_param' }
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
