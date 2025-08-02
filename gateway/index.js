/**
 * Universal Gateway Server - Configuration-Driven
 *
 * Uses external configuration file for clean, maintainable routing.
 * Supports intelligent Vite resource routing and multi-app development.
 */

import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { GATEWAY_CONFIG, getTargetPort, getAppName } from './routes.config.js';

const app = express();
const PORT = GATEWAY_CONFIG.server.port;

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Request logging
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} - ${req.method} ${req.url}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    gateway: 'ultra-simple-gateway'
  });
});

// Enhanced logging for Vite resources
function logViteRouting(url, referer, targetPort, appName) {
  const isViteResource = GATEWAY_CONFIG.vite.routes.some(route => url.startsWith(route));
  if (isViteResource) {
    console.log(`🔧 Vite resource: ${url} (referer: ${referer})`);
    console.log(`   → Routing to ${GATEWAY_CONFIG.frontend[appName]?.name || appName} (${targetPort})`);
  }
}

// Single proxy middleware that handles ALL requests
const universalProxy = createProxyMiddleware({
  target: `http://localhost:${GATEWAY_CONFIG.frontend.finclamp.port}`, // Default target
  changeOrigin: true,
  ws: GATEWAY_CONFIG.server.websocket.enabled,
  secure: false,
  router: (req) => {
    const referer = req.get('Referer') || '';
    const targetPort = getTargetPort(req.url, referer);
    const appName = getAppName(req.url, referer);
    const target = `http://localhost:${targetPort}`;

    // Enhanced logging
    logViteRouting(req.url, referer, targetPort, appName);
    console.log(`🔀 Routing: ${req.method} ${req.url} -> ${target}`);

    return target;
  },
  onError: (err, req, res) => {
    console.error(`❌ Proxy error for ${req.url}:`, err.message);
    if (res && !res.headersSent) {
      res.status(502).json({
        error: 'Bad Gateway',
        message: `Failed to proxy request to ${req.url}`,
        url: req.url,
        timestamp: new Date().toISOString()
      });
    }
  },
  onProxyReq: (proxyReq, req) => {
    console.log(`✅ Proxying: ${req.method} ${req.url} -> ${proxyReq.getHeader('host')}`);
  }
});

// Root route - configuration-driven landing page
app.get('/', (req, res) => {
  // Generate app links from configuration
  const appLinks = Object.entries(GATEWAY_CONFIG.frontend)
    .map(([appName, config]) => {
      const primaryRoute = config.routes[0];
      return `<a href="${primaryRoute}" class="link">${config.name}</a>`;
    })
    .join('\n        ');

  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Universal Gateway</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; text-align: center; background: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .link { display: inline-block; margin: 10px; padding: 12px 24px; background: #007bff; color: white; text-decoration: none; border-radius: 6px; transition: all 0.3s; }
        .link:hover { background: #0056b3; transform: translateY(-2px); }
        .health-link { background: #28a745; }
        .health-link:hover { background: #1e7e34; }
        .section { margin: 30px 0; }
        .description { color: #666; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🚀 Universal Gateway</h1>
        <p class="description">Configuration-driven routing with intelligent Vite support</p>

        <div class="section">
          <h3>Applications</h3>
          ${appLinks}
        </div>

        <div class="section">
          <h3>Utilities</h3>
          <a href="/health" class="link health-link">Health Check</a>
        </div>

        <div class="section">
          <small>Server: localhost:${PORT} | Environment: ${GATEWAY_CONFIG.server.environment}</small>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Apply universal proxy to all other routes
app.use('/', universalProxy);

// Start server
const server = app.listen(PORT, () => {
  console.log('\n🚀 Universal Gateway Started');
  console.log(`📡 Server: http://localhost:${PORT}`);
  console.log(`⚡ Environment: ${GATEWAY_CONFIG.server.environment}`);

  console.log('\n📋 Frontend Applications:');
  Object.entries(GATEWAY_CONFIG.frontend).forEach(([appName, config]) => {
    const routes = config.routes.join(', ');
    console.log(`   ${routes} -> localhost:${config.port} (${config.name})`);
  });

  console.log('\n🔌 API Endpoints:');
  Object.entries(GATEWAY_CONFIG.api).forEach(([appName, config]) => {
    const routes = config.routes.join(', ');
    console.log(`   ${routes} -> localhost:${config.port} (${config.name})`);
  });

  console.log('\n🔧 Vite Resources:');
  console.log(`   ${GATEWAY_CONFIG.vite.routes.join(', ')} -> ${GATEWAY_CONFIG.vite.routing.strategy}`);

  console.log('\n🔍 Health check: http://localhost:' + PORT + '/health');
  console.log(`🔌 WebSocket support: ${GATEWAY_CONFIG.server.websocket.enabled ? 'Enabled' : 'Disabled'}`);
  console.log('───────────────────────────────────────────────────\n');
});

// WebSocket support for Vite HMR
if (GATEWAY_CONFIG.server.websocket.enabled) {
  server.on('upgrade', (request, socket, head) => {
    const referer = request.headers.referer || '';
    const targetPort = getTargetPort(request.url, referer);
    const appName = getAppName(request.url, referer);
    const appConfig = GATEWAY_CONFIG.frontend[appName];

    console.log(`🔌 WebSocket upgrade: ${request.url} -> localhost:${targetPort} (${appConfig?.name || appName})`);

    const wsProxy = createProxyMiddleware({
      target: `http://localhost:${targetPort}`,
      changeOrigin: true,
      ws: true,
      onError: (err) => console.error(`❌ WebSocket error for ${appConfig?.name || appName}:`, err.message)
    });

    wsProxy.upgrade(request, socket, head);
  });
}
