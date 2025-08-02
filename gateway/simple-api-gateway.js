/**
 * Simple API Gateway Server
 * 
 * API-only gateway for backend services.
 * Frontend apps are accessed directly on their development ports.
 */

import express from 'express';
import { GATEWAY_CONFIG, getTargetPort } from './routes.config.js';

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
    gateway: 'simple-api-gateway',
    apis: Object.keys(GATEWAY_CONFIG.api),
    frontendApps: Object.entries(GATEWAY_CONFIG.frontend).map(([name, config]) => ({
      name: config.name,
      devUrl: config.devUrl,
      buildPath: config.buildPath
    }))
  });
});

// API status endpoint
app.get('/api/status', (req, res) => {
  const apiStatus = {};
  
  Object.entries(GATEWAY_CONFIG.api).forEach(([appName, config]) => {
    apiStatus[appName] = {
      name: config.name,
      port: config.port,
      routes: config.routes,
      url: `http://localhost:${config.port}`
    };
  });
  
  res.json({
    gateway: 'simple-api-gateway',
    timestamp: new Date().toISOString(),
    apis: apiStatus
  });
});

// Landing page with development info
app.get('/', (req, res) => {
  const frontendApps = Object.entries(GATEWAY_CONFIG.frontend)
    .map(([appName, config]) => {
      return `
        <div class="app-card">
          <h3>${config.name}</h3>
          <p>${config.description}</p>
          <div class="app-links">
            <a href="${config.devUrl}" target="_blank" class="dev-link">Development (${config.devUrl})</a>
            <span class="build-path">Build Path: ${config.buildPath}</span>
          </div>
        </div>
      `;
    })
    .join('');

  const apiEndpoints = Object.entries(GATEWAY_CONFIG.api)
    .map(([appName, config]) => {
      return `
        <div class="api-card">
          <h3>${config.name}</h3>
          <p>${config.description}</p>
          <div class="api-info">
            <span class="port">Port: ${config.port}</span>
            <span class="routes">Routes: ${config.routes.join(', ')}</span>
          </div>
        </div>
      `;
    })
    .join('');

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Simple API Gateway - Development</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          margin: 0;
          padding: 20px;
          background: #f5f5f5;
          color: #333;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
          background: white;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 40px;
          padding-bottom: 20px;
          border-bottom: 2px solid #eee;
        }
        .section {
          margin: 30px 0;
        }
        .section h2 {
          color: #2563eb;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 10px;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }
        .app-card, .api-card {
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 20px;
          background: #f9fafb;
        }
        .app-card h3, .api-card h3 {
          margin: 0 0 10px 0;
          color: #1f2937;
        }
        .dev-link {
          display: inline-block;
          padding: 8px 16px;
          background: #10b981;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          margin-right: 10px;
        }
        .dev-link:hover {
          background: #059669;
        }
        .build-path {
          color: #6b7280;
          font-size: 0.9em;
        }
        .api-info {
          margin-top: 10px;
        }
        .port, .routes {
          display: block;
          margin: 5px 0;
          font-family: monospace;
          background: #e5e7eb;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.9em;
        }
        .status-links {
          text-align: center;
          margin-top: 30px;
        }
        .status-link {
          display: inline-block;
          margin: 0 10px;
          padding: 10px 20px;
          background: #3b82f6;
          color: white;
          text-decoration: none;
          border-radius: 5px;
        }
        .status-link:hover {
          background: #2563eb;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚀 Simple API Gateway</h1>
          <p>Development environment for OrgRJ applications</p>
        </div>
        
        <div class="section">
          <h2>📱 Frontend Applications</h2>
          <p>Access frontend apps directly on their development ports:</p>
          <div class="grid">
            ${frontendApps}
          </div>
        </div>
        
        <div class="section">
          <h2>🔌 API Endpoints</h2>
          <p>API routes available (backend services must be running separately):</p>
          <div class="grid">
            ${apiEndpoints}
          </div>
        </div>
        
        <div class="status-links">
          <a href="/health" class="status-link">Health Check</a>
          <a href="/api/status" class="status-link">API Status</a>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Simple API forwarding (manual implementation)
app.use('/api', (req, res) => {
  const fullUrl = req.originalUrl;
  const targetPort = getTargetPort(fullUrl);
  
  if (!targetPort) {
    return res.status(404).json({
      error: 'API Not Found',
      message: `No API found for ${fullUrl}`,
      availableApis: Object.keys(GATEWAY_CONFIG.api),
      availableRoutes: Object.values(GATEWAY_CONFIG.api).flatMap(config => config.routes)
    });
  }
  
  const target = `http://localhost:${targetPort}`;
  console.log(`🔀 API Routing: ${req.method} ${fullUrl} -> ${target}`);
  
  // For now, just return info about where the request would be routed
  res.json({
    message: 'API Gateway - Route Information',
    originalUrl: fullUrl,
    targetUrl: target,
    method: req.method,
    note: 'This is a simple gateway. For actual proxying, start the backend services and use a full proxy implementation.',
    timestamp: new Date().toISOString()
  });
});

// 404 handler for non-API routes
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'This gateway only handles API routes. Frontend apps are available on their direct ports.',
    url: req.originalUrl,
    frontendApps: Object.entries(GATEWAY_CONFIG.frontend).map(([name, config]) => ({
      name: config.name,
      url: config.devUrl
    })),
    apiRoutes: Object.values(GATEWAY_CONFIG.api).flatMap(config => config.routes)
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log('\n🚀 Simple API Gateway Started');
  console.log(`📡 Server: http://localhost:${PORT}`);
  console.log(`⚡ Environment: ${GATEWAY_CONFIG.server.environment}`);
  
  console.log('\n🔌 API Endpoints (route information only):');
  Object.entries(GATEWAY_CONFIG.api).forEach(([appName, config]) => {
    const routes = config.routes.join(', ');
    console.log(`   ${routes} -> localhost:${config.port} (${config.name})`);
  });
  
  console.log('\n📱 Frontend Applications (Direct Access):');
  Object.entries(GATEWAY_CONFIG.frontend).forEach(([appName, config]) => {
    console.log(`   ${config.name}: ${config.devUrl}`);
  });
  
  console.log('\n🔍 Gateway endpoints:');
  console.log(`   Health check: http://localhost:${PORT}/health`);
  console.log(`   API status: http://localhost:${PORT}/api/status`);
  console.log(`   Landing page: http://localhost:${PORT}/`);
  console.log('───────────────────────────────────────────────────\n');
});

export default app;
