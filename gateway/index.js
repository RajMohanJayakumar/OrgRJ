/**
 * Ultra-Simple Gateway - FIXED FOR VITE
 * 
 * This gateway uses a single proxy with intelligent routing
 * to avoid route conflicts and ensure Vite resources work correctly.
 */

import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();
const PORT = process.env.PORT || 3000;

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

// Function to determine target port based on URL
function getTargetPort(url, referer = '') {
  // API routes
  if (url.startsWith('/api/finclamp')) return 8001;
  if (url.startsWith('/api/arcade')) return 8002;
  if (url.startsWith('/api/engaged')) return 8003;
  if (url.startsWith('/api/skips')) return 8004;
  
  // Frontend routes
  if (url.startsWith('/arcade') || url.startsWith('/retro-games')) return 5174;
  if (url.startsWith('/engaged') || url.startsWith('/wedding') || url.startsWith('/planning')) return 5175;
  if (url.startsWith('/skips') || url.startsWith('/fitness') || url.startsWith('/tracker')) return 5176;
  
  // FinClamp routes (default)
  if (url.startsWith('/finclamp') || 
      url.startsWith('/finance') || 
      url.startsWith('/calculator') || 
      url.startsWith('/calculators') || 
      url.startsWith('/games') ||
      url.startsWith('/@vite') ||
      url.startsWith('/@react-refresh') ||
      url.startsWith('/src') ||
      url.startsWith('/node_modules')) {
    return 5173;
  }
  
  // Check referer for Vite resources
  if (referer.includes('/arcade')) return 5174;
  if (referer.includes('/engaged')) return 5175;
  if (referer.includes('/skips')) return 5176;
  
  // Default to FinClamp
  return 5173;
}

// Single proxy middleware that handles ALL requests
const universalProxy = createProxyMiddleware({
  target: 'http://localhost:5173', // Default target
  changeOrigin: true,
  ws: true, // WebSocket support
  secure: false,
  router: (req) => {
    const targetPort = getTargetPort(req.url, req.get('Referer') || '');
    const target = `http://localhost:${targetPort}`;
    console.log(`🔀 Routing: ${req.method} ${req.url} -> ${target}`);
    return target;
  },
  onError: (err, req, res) => {
    console.error(`❌ Proxy error for ${req.url}:`, err.message);
    if (res && !res.headersSent) {
      res.status(502).json({
        error: 'Bad Gateway',
        message: `Failed to proxy request`,
        url: req.url
      });
    }
  },
  onProxyReq: (proxyReq, req) => {
    console.log(`✅ Proxying: ${req.method} ${req.url} -> ${proxyReq.getHeader('host')}`);
  }
});

// Root route - simple landing page
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Ultra-Simple Gateway</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; text-align: center; }
        .link { display: inline-block; margin: 10px; padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; }
        .link:hover { background: #0056b3; }
      </style>
    </head>
    <body>
      <h1>🚀 Ultra-Simple Gateway</h1>
      <p>Fixed for Vite development server compatibility</p>
      
      <div>
        <a href="/calculators?currency=dollar&in=emi" class="link">FinClamp Calculators</a>
        <a href="/games?in=finance-quest" class="link">FinClamp Games</a>
        <a href="/arcade" class="link">Arcade</a>
        <a href="/engaged" class="link">Engaged</a>
        <a href="/skips" class="link">Skips</a>
      </div>
      
      <div style="margin-top: 30px;">
        <a href="/health" class="link">Health Check</a>
      </div>
    </body>
    </html>
  `);
});

// Apply universal proxy to all other routes
app.use('/', universalProxy);

// Start server
const server = app.listen(PORT, () => {
  console.log('\n🚀 Ultra-Simple Gateway Started');
  console.log(`📡 Server: http://localhost:${PORT}`);
  console.log(`⚡ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('\n📋 Intelligent Routing:');
  console.log('   /calculators, /games, /@vite/* -> localhost:5173 (FinClamp)');
  console.log('   /arcade                        -> localhost:5174 (Arcade)');
  console.log('   /engaged                       -> localhost:5175 (Engaged)');
  console.log('   /skips                         -> localhost:5176 (Skips)');
  console.log('   /api/*                         -> localhost:800x (APIs)');
  console.log('\n🔍 Health check: http://localhost:' + PORT + '/health');
  console.log('🔌 WebSocket support: Enabled for HMR');
  console.log('───────────────────────────────────────────────────\n');
});

// WebSocket support for Vite HMR
server.on('upgrade', (request, socket, head) => {
  const targetPort = getTargetPort(request.url, request.headers.referer);
  console.log(`🔌 WebSocket upgrade: ${request.url} -> localhost:${targetPort}`);
  
  const wsProxy = createProxyMiddleware({
    target: `http://localhost:${targetPort}`,
    changeOrigin: true,
    ws: true,
    onError: (err) => console.error(`❌ WebSocket error:`, err.message)
  });
  
  wsProxy.upgrade(request, socket, head);
});
