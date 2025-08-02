/**
 * Universal Gateway Server - SIMPLIFIED & FIXED
 * 
 * Perfect port redirection for monorepo apps:
 * - /calculators -> FinClamp (5173) ✅
 * - /games -> FinClamp (5173) ✅
 * - /arcade -> Arcade (5174) ✅
 * - /engaged -> Engaged (5175) ✅
 * - /skips -> Skips (5176) ✅
 */

import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();
const PORT = process.env.PORT || 3000;

// SIMPLIFIED ROUTE MAPPING - Direct port mapping
const ROUTE_MAP = {
  // FinClamp routes (Port 5173)
  '/finclamp': 5173,
  '/finance': 5173,
  '/calculator': 5173,
  '/calculators': 5173,  // MAIN WORKING ROUTE
  '/games': 5173,        // MAIN WORKING ROUTE
  
  // Arcade routes (Port 5174)
  '/arcade': 5174,
  '/retro-games': 5174,
  
  // Engaged routes (Port 5175)
  '/engaged': 5175,
  '/wedding': 5175,
  '/planning': 5175,
  
  // Skips routes (Port 5176)
  '/skips': 5176,
  '/fitness': 5176,
  '/tracker': 5176
};

// API routes mapping
const API_MAP = {
  '/api/finclamp': 8001,
  '/api/arcade': 8002,
  '/api/engaged': 8003,
  '/api/skips': 8004
};

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

// Request logging with more details
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  const referer = req.get('Referer') ? ` (ref: ${req.get('Referer')})` : '';
  const userAgent = req.get('User-Agent') ? ` (${req.get('User-Agent').split(' ')[0]})` : '';
  console.log(`${timestamp} - ${req.method} ${req.url}${referer}${userAgent}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    gateway: 'simplified-gateway',
    routes: Object.keys(ROUTE_MAP).length + Object.keys(API_MAP).length
  });
});

// Debug endpoint to test routing
app.get('/debug-route', (req, res) => {
  res.json({
    message: 'Gateway routing debug',
    timestamp: new Date().toISOString(),
    requestUrl: req.url,
    requestPath: req.path,
    headers: {
      referer: req.get('Referer'),
      userAgent: req.get('User-Agent'),
      host: req.get('Host')
    },
    routeMap: ROUTE_MAP,
    apiMap: API_MAP
  });
});

// Service worker cleanup endpoint
app.get('/clear-sw', (req, res) => {
  res.set({
    'Content-Type': 'text/html',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  });

  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Clear Service Workers</title>
    </head>
    <body>
      <h1>🔧 Service Worker Cleanup</h1>
      <div id="status">Clearing service workers...</div>

      <script>
        async function clearServiceWorkers() {
          const statusDiv = document.getElementById('status');

          if ('serviceWorker' in navigator) {
            try {
              const registrations = await navigator.serviceWorker.getRegistrations();
              statusDiv.innerHTML = 'Found ' + registrations.length + ' service worker(s)<br>';

              for (let registration of registrations) {
                statusDiv.innerHTML += 'Unregistering: ' + registration.scope + '<br>';
                await registration.unregister();
              }

              // Clear caches
              if ('caches' in window) {
                const cacheNames = await caches.keys();
                statusDiv.innerHTML += 'Found ' + cacheNames.length + ' cache(s)<br>';

                for (let cacheName of cacheNames) {
                  statusDiv.innerHTML += 'Clearing cache: ' + cacheName + '<br>';
                  await caches.delete(cacheName);
                }
              }

              statusDiv.innerHTML += '<br>✅ All service workers and caches cleared!<br>';
              statusDiv.innerHTML += '<a href="/calculators?currency=dollar&in=emi">Test FinClamp</a>';

            } catch (error) {
              statusDiv.innerHTML += '❌ Error: ' + error.message;
            }
          } else {
            statusDiv.innerHTML = 'Service workers not supported';
          }
        }

        clearServiceWorkers();
      </script>
    </body>
    </html>
  `);
});

// Helper function to create proxy middleware
function createProxy(targetPort, description) {
  return createProxyMiddleware({
    target: `http://localhost:${targetPort}`,
    changeOrigin: true,
    ws: true, // WebSocket support for HMR
    secure: false,
    onError: (err, req, res) => {
      console.error(`❌ Proxy error for ${req.url} -> port ${targetPort}:`, err.message);
      if (res && !res.headersSent) {
        res.status(502).json({
          error: 'Bad Gateway',
          message: `Failed to proxy to port ${targetPort}`,
          route: req.url
        });
      }
    },
    onProxyReq: (proxyReq, req) => {
      console.log(`✅ Proxying: ${req.method} ${req.url} -> localhost:${targetPort}`);
    }
  });
}

// Handle ALL Vite development server routes FIRST (before main routes)
const viteRoutes = ['/@vite', '/@react-refresh', '/src', '/node_modules'];
viteRoutes.forEach(viteRoute => {
  app.use(viteRoute, (req, res, next) => {
    // Determine target port based on referer or current path
    const referer = req.get('Referer') || '';
    const originalUrl = req.originalUrl || '';
    let targetPort = 5173; // Default to FinClamp

    // Check referer first
    if (referer.includes('/arcade')) targetPort = 5174;
    else if (referer.includes('/engaged')) targetPort = 5175;
    else if (referer.includes('/skips')) targetPort = 5176;
    // Check original URL as fallback
    else if (originalUrl.includes('/arcade')) targetPort = 5174;
    else if (originalUrl.includes('/engaged')) targetPort = 5175;
    else if (originalUrl.includes('/skips')) targetPort = 5176;

    console.log(`🔧 Vite route: ${req.method} ${req.url} -> localhost:${targetPort}`);

    const viteProxy = createProxy(targetPort, `Vite route ${viteRoute}`);
    viteProxy(req, res, next);
  });
});

// Setup API routes - DIRECT MAPPING
Object.entries(API_MAP).forEach(([route, port]) => {
  console.log(`Setting up API route: ${route} -> localhost:${port}`);
  app.use(route, createProxy(port, `API route ${route}`));
});

// Setup frontend routes - DIRECT MAPPING (after Vite routes)
Object.entries(ROUTE_MAP).forEach(([route, port]) => {
  console.log(`Setting up route: ${route} -> localhost:${port}`);
  app.use(route, createProxy(port, `Frontend route ${route}`));
});

// Handle service worker requests - DISABLE for gateway to prevent conflicts
app.get('/sw.js', (req, res) => {
  console.log('🔧 Service Worker request blocked - preventing gateway conflicts');
  res.set({
    'Content-Type': 'application/javascript',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  });

  // Return a minimal service worker that unregisters itself
  res.send(`
    // Gateway Service Worker - Prevents conflicts with proxy
    console.log('🔧 Gateway: Service Worker disabled to prevent proxy conflicts');

    self.addEventListener('install', () => {
      console.log('🔧 SW: Skipping waiting and unregistering');
      self.skipWaiting();
    });

    self.addEventListener('activate', (event) => {
      console.log('🔧 SW: Clearing caches and unregistering');
      event.waitUntil(
        Promise.all([
          // Clear all caches
          caches.keys().then(cacheNames =>
            Promise.all(cacheNames.map(name => caches.delete(name)))
          ),
          // Claim clients
          self.clients.claim()
        ]).then(() => {
          // Unregister this service worker
          self.registration.unregister();
        })
      );
    });

    // Don't intercept any fetch events - let gateway handle everything
    self.addEventListener('fetch', (event) => {
      // Do nothing - let requests go through gateway proxy
    });
  `);
});

// Handle FinClamp's GitHub Pages service worker path
app.get('/OrgRJ/sw.js', (req, res) => {
  console.log('🔧 FinClamp GitHub Pages SW request blocked - preventing gateway conflicts');
  res.set({
    'Content-Type': 'application/javascript',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  });

  // Return a minimal service worker that unregisters itself
  res.send(`
    // Gateway Service Worker - Prevents conflicts with proxy (GitHub Pages path)
    console.log('🔧 Gateway: FinClamp GitHub Pages Service Worker disabled to prevent proxy conflicts');

    self.addEventListener('install', () => {
      console.log('🔧 SW: Skipping waiting and unregistering');
      self.skipWaiting();
    });

    self.addEventListener('activate', (event) => {
      console.log('🔧 SW: Clearing caches and unregistering');
      event.waitUntil(
        Promise.all([
          // Clear all caches
          caches.keys().then(cacheNames =>
            Promise.all(cacheNames.map(name => caches.delete(name)))
          ),
          // Claim clients
          self.clients.claim()
        ]).then(() => {
          // Unregister this service worker
          self.registration.unregister();
        })
      );
    });

    // Don't intercept any fetch events - let gateway handle everything
    self.addEventListener('fetch', (event) => {
      // Do nothing - let requests go through gateway proxy
    });
  `);
});

// Handle static files (favicon, manifest, etc.)
const staticFiles = ['/favicon.ico', '/manifest.json', '/favicon.svg'];
staticFiles.forEach(file => {
  app.use(file, (req, res, next) => {
    const referer = req.get('Referer') || '';
    let targetPort = 5173; // Default to FinClamp

    if (referer.includes('/arcade')) targetPort = 5174;
    else if (referer.includes('/engaged')) targetPort = 5175;
    else if (referer.includes('/skips')) targetPort = 5176;

    const staticProxy = createProxy(targetPort, `Static file ${file}`);
    staticProxy(req, res, next);
  });
});

// Root route - Gateway landing page
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Universal Gateway</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .app-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 30px 0; }
        .app-card { padding: 20px; border: 1px solid #ddd; border-radius: 8px; text-align: center; transition: transform 0.2s; }
        .app-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
        .app-icon { font-size: 2em; margin-bottom: 10px; }
        .app-name { font-weight: bold; margin-bottom: 5px; }
        .app-desc { font-size: 0.9em; color: #666; margin-bottom: 15px; }
        .app-link { display: inline-block; padding: 8px 16px; background: #007bff; color: white; text-decoration: none; border-radius: 4px; }
        .app-link:hover { background: #0056b3; }
        .status { margin: 20px 0; padding: 15px; background: #e8f5e8; border-radius: 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🚀 Universal Gateway</h1>
        <div class="status">
          <strong>Status:</strong> Running on port ${PORT} | 
          <strong>Routes:</strong> ${Object.keys(ROUTE_MAP).length} frontend + ${Object.keys(API_MAP).length} API
        </div>
        
        <h2>Frontend Applications</h2>
        <div class="app-grid">
          <div class="app-card">
            <div class="app-icon">🧮</div>
            <div class="app-name">FinClamp Calculators</div>
            <div class="app-desc">Financial calculators and tools</div>
            <a href="/calculators" class="app-link">Open Calculators</a>
          </div>
          <div class="app-card">
            <div class="app-icon">🎮</div>
            <div class="app-name">FinClamp Games</div>
            <div class="app-desc">Finance learning games</div>
            <a href="/games" class="app-link">Play Games</a>
          </div>
          <div class="app-card">
            <div class="app-icon">🕹️</div>
            <div class="app-name">Arcade</div>
            <div class="app-desc">Retro game collection</div>
            <a href="/arcade" class="app-link">Play Arcade</a>
          </div>
          <div class="app-card">
            <div class="app-icon">💍</div>
            <div class="app-name">Engaged</div>
            <div class="app-desc">Wedding planning platform</div>
            <a href="/engaged" class="app-link">Plan Wedding</a>
          </div>
          <div class="app-card">
            <div class="app-icon">⏭️</div>
            <div class="app-name">Skips</div>
            <div class="app-desc">Fitness tracking</div>
            <a href="/skips" class="app-link">Track Fitness</a>
          </div>
        </div>
        
        <h2>Quick Test Links</h2>
        <p>
          <a href="/calculators?currency=dollar&in=emi">EMI Calculator</a> |
          <a href="/games?in=finance-quest">Finance Quest</a> |
          <a href="/health">Health Check</a> |
          <a href="/clear-sw">Clear Service Workers</a> |
          <a href="/debug-route">Debug Info</a>
        </p>

        <h2>Troubleshooting</h2>
        <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <strong>If FinClamp shows only a loader:</strong><br>
          1. <a href="/clear-sw">Clear Service Workers</a> first<br>
          2. Open browser DevTools (F12) and check Console for errors<br>
          3. Try <a href="/calculators?currency=dollar&in=emi">EMI Calculator</a> again<br>
          4. If still not working, try direct access: <a href="http://localhost:5173/calculators?currency=dollar&in=emi" target="_blank">localhost:5173</a>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Catch-all for unmapped routes
app.use((req, res) => {
  res.status(404).json({
    error: 'Route Not Found',
    message: `No route configured for: ${req.path}`,
    availableRoutes: {
      frontend: Object.keys(ROUTE_MAP),
      api: Object.keys(API_MAP)
    },
    suggestion: 'Check available routes above'
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Gateway error:', error);
  if (res.headersSent) return next(error);
  
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'Gateway encountered an error',
    timestamp: new Date().toISOString()
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log('\n🚀 Universal Gateway Server Started');
  console.log(`📡 Server: http://localhost:${PORT}`);
  console.log(`⚡ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('\n📋 Route Mapping:');
  
  Object.entries(ROUTE_MAP).forEach(([route, port]) => {
    console.log(`   ${route.padEnd(15)} -> localhost:${port}`);
  });
  
  Object.entries(API_MAP).forEach(([route, port]) => {
    console.log(`   ${route.padEnd(15)} -> localhost:${port}`);
  });
  
  console.log(`\n🔍 Health check: http://localhost:${PORT}/health`);
  console.log('🔌 WebSocket support: Enabled for HMR');
  console.log('───────────────────────────────────────────────────\n');
});

// WebSocket support for Vite HMR
server.on('upgrade', (request, socket, head) => {
  const url = new URL(request.url, `http://${request.headers.host}`);
  let targetPort = 5173; // Default to FinClamp
  
  // Determine target port from URL or referer
  if (url.pathname.includes('/arcade') || request.headers.referer?.includes('/arcade')) {
    targetPort = 5174;
  } else if (url.pathname.includes('/engaged') || request.headers.referer?.includes('/engaged')) {
    targetPort = 5175;
  } else if (url.pathname.includes('/skips') || request.headers.referer?.includes('/skips')) {
    targetPort = 5176;
  }
  
  console.log(`🔌 WebSocket upgrade: ${url.pathname} -> localhost:${targetPort}`);
  
  const wsProxy = createProxyMiddleware({
    target: `http://localhost:${targetPort}`,
    changeOrigin: true,
    ws: true,
    onError: (err) => console.error(`❌ WebSocket error:`, err.message)
  });
  
  wsProxy.upgrade(request, socket, head);
});
