/**
 * Arcade Games Route Configuration
 * Centralized route management for the arcade module
 */

export const GAME_ROUTES = {
  // Main arcade route patterns
  PATTERNS: {
    DIRECT_PATH: '/arcade',
    QUERY_PARAM: '?mode=arcade',
    LEGACY_PARAM: '?arcade=true'
  },
  
  // Individual game routes (for future direct game access)
  GAMES: {
    SNAKE: '/arcade/snake',
    TETRIS: '/arcade/tetris',
    PONG: '/arcade/pong',
    SPACE_SHOOTER: '/arcade/space-shooter'
  },
  
  // Route metadata
  META: {
    TITLE: 'Arcade Games - FinClamp',
    DESCRIPTION: 'Classic arcade games collection',
    KEYWORDS: 'arcade, games, retro, classic, snake, tetris, pong, space shooter',
    ROBOTS: 'noindex, nofollow' // Keep hidden from search engines
  }
}

/**
 * Route detection utility
 * Checks if current URL matches arcade game routes
 */
export const detectArcadeRoute = () => {
  try {
    const pathname = window.location.pathname
    const urlParams = new URLSearchParams(window.location.search)
    
    // Check direct path
    if (pathname === GAME_ROUTES.PATTERNS.DIRECT_PATH) {
      return { isArcade: true, game: null, method: 'direct_path' }
    }
    
    // Check query parameter methods
    if (urlParams.get('mode') === 'arcade') {
      return { isArcade: true, game: null, method: 'query_param' }
    }
    
    if (urlParams.get('arcade') === 'true') {
      return { isArcade: true, game: null, method: 'legacy_param' }
    }
    
    // Check individual game routes (for future use)
    for (const [gameName, route] of Object.entries(GAME_ROUTES.GAMES)) {
      if (pathname === route) {
        return { 
          isArcade: true, 
          game: gameName.toLowerCase(), 
          method: 'direct_game' 
        }
      }
    }
    
    return { isArcade: false, game: null, method: null }
  } catch (error) {
    console.warn('Error detecting arcade route:', error)
    return { isArcade: false, game: null, method: null }
  }
}

/**
 * URL generation utilities
 */
export const generateArcadeURL = (baseURL = '', method = 'direct_path') => {
  switch (method) {
    case 'direct_path':
      return `${baseURL}${GAME_ROUTES.PATTERNS.DIRECT_PATH}`
    case 'query_param':
      return `${baseURL}/${GAME_ROUTES.PATTERNS.QUERY_PARAM}`
    case 'legacy_param':
      return `${baseURL}/${GAME_ROUTES.PATTERNS.LEGACY_PARAM}`
    default:
      return `${baseURL}${GAME_ROUTES.PATTERNS.DIRECT_PATH}`
  }
}

/**
 * Deployment configuration for different hosting platforms
 */
export const DEPLOYMENT_ROUTES = {
  // Netlify _redirects
  NETLIFY: [
    '# Arcade Games Routes',
    '/arcade /index.html 200',
    '/arcade/* /index.html 200'
  ],
  
  // Vercel vercel.json
  VERCEL: [
    {
      "source": "/arcade",
      "destination": "/index.html"
    },
    {
      "source": "/arcade/(.*)",
      "destination": "/index.html"
    }
  ],
  
  // Apache .htaccess (already covered by catch-all)
  APACHE: [
    '# Arcade routes handled by existing SPA routing'
  ],
  
  // Vite development server
  VITE: [
    '{ from: /^\\/arcade$/, to: \'/index.html\' }',
    '{ from: /^\\/arcade\\/.*$/, to: \'/index.html\' }'
  ]
}

export default GAME_ROUTES
