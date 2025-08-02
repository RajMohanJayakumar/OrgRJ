/**
 * Gateway Routes Configuration
 * 
 * This file defines all routing rules for the Universal Gateway.
 * Each route maps URL patterns to target ports and includes metadata.
 */

export const GATEWAY_CONFIG = {
  // Gateway server configuration
  server: {
    port: 3000,
    environment: 'development',
    cors: {
      enabled: true,
      origins: ['*']
    },
    websocket: {
      enabled: true,
      description: 'WebSocket support for Vite HMR'
    }
  },

  // Frontend applications (for build configuration only)
  frontend: {
    finclamp: {
      port: 5173,
      name: 'FinClamp',
      description: 'Financial calculators and games',
      buildPath: '/finclamp',
      devUrl: 'http://localhost:5173'
    },
    arcade: {
      port: 5174,
      name: 'Arcade',
      description: 'Retro games collection',
      buildPath: '/arcade',
      devUrl: 'http://localhost:5174'
    },
    engaged: {
      port: 5175,
      name: 'Engaged',
      description: 'Wedding planning application',
      buildPath: '/engaged',
      devUrl: 'http://localhost:5175'
    },
    skips: {
      port: 5176,
      name: 'Skips',
      description: 'Fitness tracking application',
      buildPath: '/skips',
      devUrl: 'http://localhost:5176'
    }
  },

  // API routes
  api: {
    finclamp: {
      port: 8001,
      name: 'FinClamp API',
      description: 'Financial calculations API',
      routes: [
        '/api/finclamp'
      ]
    },
    arcade: {
      port: 8002,
      name: 'Arcade API',
      description: 'Games and scores API',
      routes: [
        '/api/arcade'
      ]
    },
    engaged: {
      port: 8003,
      name: 'Engaged API',
      description: 'Wedding planning API',
      routes: [
        '/api/engaged'
      ]
    },
    skips: {
      port: 8004,
      name: 'Skips API',
      description: 'Fitness tracking API',
      routes: [
        '/api/skips'
      ]
    }
  },



  // Server configuration
  server: {
    port: 3000,
    environment: 'development'
  }
};

/**
 * Helper function to get target port for API URLs only
 */
export function getTargetPort(url) {
  // Check API routes only
  for (const [, config] of Object.entries(GATEWAY_CONFIG.api)) {
    for (const route of config.routes) {
      if (url.startsWith(route)) {
        return config.port;
      }
    }
  }

  // No API route found
  return null;
}

/**
 * Helper function to get API app name from URL
 */
export function getApiAppName(url) {
  for (const [appName, config] of Object.entries(GATEWAY_CONFIG.api)) {
    for (const route of config.routes) {
      if (url.startsWith(route)) {
        return appName;
      }
    }
  }
  return null;
}

export default GATEWAY_CONFIG;
