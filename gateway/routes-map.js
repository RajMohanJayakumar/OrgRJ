/**
 * Universal Gateway Routes Map
 * 
 * This file defines the complete routing structure for the monorepo.
 * It maps clean URLs to their respective frontend and backend services.
 */

// Environment-based configuration
const isDevelopment = process.env.NODE_ENV !== 'production';

// Frontend Apps Routing Map
export const frontendRoutes = {
  // Financial Calculator Suite
  finclamp: {
    route: '/finclamp',
    name: 'FinClamp',
    description: 'Financial Calculator Suite',
    icon: '💰',
    devPort: 5173,
    buildPath: '../apps/finclamp/dist',
    basePath: '/', // Clean base path for development
    aliases: ['/finance', '/calculator'] // Alternative URLs
  },

  // Arcade Games Collection  
  arcade: {
    route: '/arcade',
    name: 'Arcade Games',
    description: 'Retro Game Collection',
    icon: '🎮',
    devPort: 5174,
    buildPath: '../apps/arcade-games/dist',
    basePath: '/',
    aliases: ['/games']
  },

  // Wedding Planning Platform
  engaged: {
    route: '/engaged',
    name: 'Engaged',
    description: 'Wedding Planning Platform',
    icon: '💍',
    devPort: 5175,
    buildPath: '../apps/engaged/dist',
    basePath: '/',
    aliases: ['/wedding', '/planning']
  },

  // Skip Rope Tracking
  skips: {
    route: '/skips',
    name: 'Skips Tracker',
    description: 'Skip Rope Fitness Tracker',
    icon: '⏭️',
    devPort: 5176,
    buildPath: '../apps/skips/dist',
    basePath: '/',
    aliases: ['/fitness', '/tracker']
  }
};

// Backend APIs Routing Map
export const apiRoutes = {
  finclamp: {
    route: '/api/finclamp',
    name: 'FinClamp API',
    description: 'Financial calculations and data',
    port: 8001,
    pathRewrite: { '^/api/finclamp': '/api/v1' },
    endpoints: [
      'GET /health - Health check',
      'POST /calculate/loan - Loan calculations',
      'POST /calculate/savings - Savings calculations', 
      'POST /calculate/investment - Investment calculations'
    ]
  },

  arcade: {
    route: '/api/arcade',
    name: 'Arcade API',
    description: 'Game data and leaderboards',
    port: 8002,
    pathRewrite: { '^/api/arcade': '/api/v1' },
    endpoints: [
      'GET /health - Health check',
      'GET /games - List all games',
      'GET /games/:id - Get specific game',
      'GET /leaderboard - Get leaderboard',
      'POST /score - Submit new score'
    ]
  },

  engaged: {
    route: '/api/engaged',
    name: 'Engaged API', 
    description: 'Wedding planning and management',
    port: 8003,
    pathRewrite: { '^/api/engaged': '/api/v1' },
    endpoints: [
      'GET /health - Health check',
      'GET /engagements - List engagements',
      'POST /engagements - Create engagement',
      'GET /tasks/:id - Get tasks',
      'POST /tasks - Create task'
    ]
  },

  skips: {
    route: '/api/skips',
    name: 'Skips API',
    description: 'Fitness tracking and statistics',
    port: 8004,
    pathRewrite: { '^/api/skips': '/api/v1' },
    endpoints: [
      'GET /health - Health check',
      'GET /sessions - List sessions',
      'POST /sessions - Record session',
      'GET /stats/:user - Get user stats',
      'GET /goals/:user - Get user goals'
    ]
  }
};

// Generate gateway configuration from routes map
export function generateGatewayConfig() {
  const config = [];

  // Add frontend routes
  Object.values(frontendRoutes).forEach(app => {
    // Main route
    config.push({
      route: app.route,
      target: isDevelopment ? 'proxy' : 'static',
      port: isDevelopment ? app.devPort : undefined,
      host: isDevelopment ? 'localhost' : undefined,
      path: isDevelopment ? undefined : app.buildPath,
      description: `${app.name} - ${app.description} (${isDevelopment ? 'Dev Server' : 'Static Build'})`
    });

    // Add aliases
    if (app.aliases) {
      app.aliases.forEach(alias => {
        config.push({
          route: alias,
          target: isDevelopment ? 'proxy' : 'static',
          port: isDevelopment ? app.devPort : undefined,
          host: isDevelopment ? 'localhost' : undefined,
          path: isDevelopment ? undefined : app.buildPath,
          description: `${app.name} alias - ${app.description}`
        });
      });
    }
  });

  // Add API routes
  Object.values(apiRoutes).forEach(api => {
    config.push({
      route: api.route,
      target: 'proxy',
      port: api.port,
      host: 'localhost',
      pathRewrite: api.pathRewrite,
      description: `${api.name} - ${api.description}`
    });
  });

  // Add root route
  config.push({
    route: '/',
    target: 'static',
    path: '../gateway/public',
    description: 'Gateway landing page'
  });

  return config;
}

// Generate navigation data for the landing page
export function generateNavigationData() {
  return {
    apps: Object.values(frontendRoutes).map(app => ({
      name: app.name,
      description: app.description,
      icon: app.icon,
      url: app.route,
      aliases: app.aliases
    })),
    apis: Object.values(apiRoutes).map(api => ({
      name: api.name,
      description: api.description,
      url: api.route,
      endpoints: api.endpoints
    }))
  };
}

// URL mapping utilities
export function getAppByRoute(route) {
  // Check main routes
  for (const [key, app] of Object.entries(frontendRoutes)) {
    if (app.route === route) return { key, ...app };
  }
  
  // Check aliases
  for (const [key, app] of Object.entries(frontendRoutes)) {
    if (app.aliases && app.aliases.includes(route)) {
      return { key, ...app };
    }
  }
  
  return null;
}

export function getApiByRoute(route) {
  for (const [key, api] of Object.entries(apiRoutes)) {
    if (api.route === route || route.startsWith(api.route + '/')) {
      return { key, ...api };
    }
  }
  return null;
}
