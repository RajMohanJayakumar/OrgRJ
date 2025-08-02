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

  // Frontend application routes
  frontend: {
    finclamp: {
      port: 5173,
      name: 'FinClamp',
      description: 'Financial calculators and games',
      routes: [
        '/calculators',
        '/calculator',
        '/finclamp',
        '/finance',
        '/games'
      ],
      aliases: [
        '/calc',
        '/fin'
      ]
    },
    arcade: {
      port: 5174,
      name: 'Arcade',
      description: 'Retro games collection',
      routes: [
        '/arcade',
        '/retro-games'
      ],
      aliases: [
        '/games-arcade',
        '/retro'
      ]
    },
    engaged: {
      port: 5175,
      name: 'Engaged',
      description: 'Wedding planning application',
      routes: [
        '/engaged',
        '/wedding',
        '/planning'
      ],
      aliases: [
        '/wed',
        '/plan'
      ]
    },
    skips: {
      port: 5176,
      name: 'Skips',
      description: 'Fitness tracking application',
      routes: [
        '/skips',
        '/fitness',
        '/tracker'
      ],
      aliases: [
        '/fit',
        '/track'
      ]
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

  // Vite development server resources
  vite: {
    description: 'Vite development server resources with intelligent routing',
    routes: [
      '/@vite',
      '/@react-refresh',
      '/src',
      '/node_modules',
      '/@fs'
    ],
    routing: {
      strategy: 'referer-based',
      description: 'Routes based on the referer header to determine which app requested the resource',
      fallback: 'finclamp'
    }
  },

  // Special routes
  special: {
    health: {
      path: '/health',
      description: 'Gateway health check endpoint'
    },
    root: {
      path: '/',
      description: 'Gateway landing page with navigation'
    },
    serviceWorker: {
      paths: ['/sw.js', '/OrgRJ/sw.js'],
      description: 'Service worker routes (disabled to prevent conflicts)'
    }
  },

  // Route priority (higher number = higher priority)
  priority: {
    vite: 100,        // Vite resources must be handled first
    api: 90,          // API routes next
    special: 80,      // Special routes
    frontend: 70      // Frontend routes last (catch-all)
  }
};

/**
 * Helper function to get all routes for a specific app
 */
export function getAppRoutes(appName) {
  const app = GATEWAY_CONFIG.frontend[appName];
  if (!app) return [];
  
  return [
    ...app.routes,
    ...(app.aliases || [])
  ];
}

/**
 * Helper function to get target port for a URL
 */
export function getTargetPort(url, referer = '') {
  // Check API routes first
  for (const [appName, config] of Object.entries(GATEWAY_CONFIG.api)) {
    for (const route of config.routes) {
      if (url.startsWith(route)) {
        return config.port;
      }
    }
  }

  // Check Vite resources with referer-based routing
  const isViteResource = GATEWAY_CONFIG.vite.routes.some(route => url.startsWith(route));
  if (isViteResource) {
    // Determine target based on referer
    for (const [appName, config] of Object.entries(GATEWAY_CONFIG.frontend)) {
      const allRoutes = getAppRoutes(appName);
      if (allRoutes.some(route => referer.includes(route))) {
        return config.port;
      }
    }
    // Fallback to FinClamp for Vite resources
    return GATEWAY_CONFIG.frontend.finclamp.port;
  }

  // Check frontend routes
  for (const [appName, config] of Object.entries(GATEWAY_CONFIG.frontend)) {
    const allRoutes = getAppRoutes(appName);
    for (const route of allRoutes) {
      if (url.startsWith(route)) {
        return config.port;
      }
    }
  }

  // Default fallback to FinClamp
  return GATEWAY_CONFIG.frontend.finclamp.port;
}

/**
 * Helper function to get app name from URL
 */
export function getAppName(url, referer = '') {
  // Check Vite resources first
  const isViteResource = GATEWAY_CONFIG.vite.routes.some(route => url.startsWith(route));
  if (isViteResource) {
    for (const [appName, config] of Object.entries(GATEWAY_CONFIG.frontend)) {
      const allRoutes = getAppRoutes(appName);
      if (allRoutes.some(route => referer.includes(route))) {
        return appName;
      }
    }
    return 'finclamp'; // fallback
  }

  // Check frontend routes
  for (const [appName, config] of Object.entries(GATEWAY_CONFIG.frontend)) {
    const allRoutes = getAppRoutes(appName);
    for (const route of allRoutes) {
      if (url.startsWith(route)) {
        return appName;
      }
    }
  }

  return 'finclamp'; // default
}

export default GATEWAY_CONFIG;
