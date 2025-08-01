/**
 * Gateway Configuration
 * 
 * This file defines the routing configuration for the universal gateway.
 * Each route can target:
 * - 'static': Serve static files from a build directory
 * - 'local': Mount a local Express router/app from a module
 * - 'proxy': Forward requests to an external port
 */

export default [
  // Frontend Applications (Static Builds)
  {
    route: '/finclamp',
    target: 'static',
    path: '../apps/finclamp/dist',
    description: 'FinClamp - Financial calculator suite'
  },
  {
    route: '/arcade',
    target: 'static', 
    path: '../apps/arcade-games/dist',
    description: 'Arcade Games - Game collection'
  },
  {
    route: '/engaged',
    target: 'static',
    path: '../apps/engaged/dist', 
    description: 'Engaged - Engagement platform'
  },
  {
    route: '/skips',
    target: 'static',
    path: '../apps/skips/dist',
    description: 'Skips - Skip tracking application'
  },

  // API Backends (Go Services via Proxy)
  {
    route: '/api/finclamp',
    target: 'proxy',
    port: 8001,
    host: 'localhost',
    pathRewrite: { '^/api/finclamp/': '/api/v1/' },
    description: 'FinClamp Go API backend'
  },
  {
    route: '/api/arcade',
    target: 'proxy',
    port: 8002,
    host: 'localhost',
    pathRewrite: { '^/api/arcade/': '/api/v1/' },
    description: 'Arcade Games Go API backend'
  },
  {
    route: '/api/engaged',
    target: 'proxy',
    port: 8003,
    host: 'localhost',
    pathRewrite: { '^/api/engaged/': '/api/v1/' },
    description: 'Engaged Go API backend'
  },
  {
    route: '/api/skips',
    target: 'proxy',
    port: 8004,
    host: 'localhost',
    pathRewrite: { '^/api/skips/': '/api/v1/' },
    description: 'Skips Go API backend'
  },

  // Root route - serve a landing page or redirect
  {
    route: '/',
    target: 'static',
    path: '../gateway/public',
    description: 'Gateway landing page'
  }

  // Future proxy examples (commented out):
  // {
  //   route: '/api/external',
  //   target: 'proxy',
  //   port: 4001,
  //   description: 'External service on port 4001'
  // },
  // {
  //   route: '/microservice',
  //   target: 'proxy', 
  //   port: 5000,
  //   host: 'localhost', // optional, defaults to localhost
  //   pathRewrite: { '^/microservice': '' }, // optional path rewriting
  //   description: 'External microservice'
  // }
];
