/**
 * Universal Gateway Server
 * 
 * A single-port gateway that routes requests to:
 * - Static frontend builds
 * - Local backend modules  
 * - External services via proxy
 */

import express from 'express';
import path from 'path';
import fs from 'fs';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { fileURLToPath } from 'url';

// ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load configuration
import config from './config.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for logging requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    gateway: 'universal-gateway',
    routes: config.length
  });
});

// Process each route configuration
config.forEach(({ route, target, path: targetPath, port, host = 'localhost', pathRewrite, description }) => {
  console.log(`Setting up route: ${route} -> ${target} (${description || 'No description'})`);

  try {
    if (target === 'static') {
      const staticPath = path.resolve(__dirname, targetPath);
      
      // Check if static directory exists
      if (!fs.existsSync(staticPath)) {
        console.warn(`⚠️  Static path does not exist: ${staticPath}`);
        console.warn(`   Route ${route} will return 404 until build is created`);
        
        // Create a placeholder handler
        app.use(route, (req, res) => {
          res.status(404).send(`
            <html>
              <head><title>Build Not Found</title></head>
              <body>
                <h1>Build Not Found</h1>
                <p>The build directory for <strong>${route}</strong> does not exist yet.</p>
                <p>Expected path: <code>${staticPath}</code></p>
                <p>Please run the build command for this app first.</p>
                <hr>
                <small>Gateway: ${description || route}</small>
              </body>
            </html>
          `);
        });
      } else {
        // Serve static files with fallback to index.html for SPA routing
        app.use(route, express.static(staticPath));
        
        // SPA fallback - serve index.html for unmatched routes within this path
        if (route !== '/') {
          app.get(`${route}/*`, (req, res) => {
            const indexPath = path.join(staticPath, 'index.html');
            if (fs.existsSync(indexPath)) {
              res.sendFile(indexPath);
            } else {
              res.status(404).send('Index file not found');
            }
          });
        }
      }

    } else if (target === 'local') {
      const modulePath = path.resolve(__dirname, targetPath);
      
      // Check if module exists
      if (!fs.existsSync(modulePath)) {
        console.warn(`⚠️  Local module does not exist: ${modulePath}`);
        
        // Create a placeholder API
        app.use(route, (req, res) => {
          res.status(503).json({
            error: 'Service Unavailable',
            message: `Local module for ${route} not found`,
            expectedPath: modulePath,
            description: description || route
          });
        });
      } else {
        try {
          const service = require(modulePath);
          
          if (typeof service === 'function') {
            // Module exports a function that returns middleware/router
            app.use(route, service());
          } else if (service && typeof service.router === 'function') {
            // Module exports an object with a router function
            app.use(route, service.router());
          } else if (service && service.default && typeof service.default === 'function') {
            // ES module with default export
            app.use(route, service.default());
          } else {
            console.error(`❌ Invalid service export for ${route}. Expected function or {router: function}`);
            
            app.use(route, (req, res) => {
              res.status(500).json({
                error: 'Invalid Service Configuration',
                message: `Module at ${route} does not export a valid Express router`,
                expectedExports: 'function() or {router: function()}'
              });
            });
          }
        } catch (error) {
          console.error(`❌ Failed to load module for ${route}:`, error.message);
          
          app.use(route, (req, res) => {
            res.status(500).json({
              error: 'Module Load Error',
              message: `Failed to load module for ${route}`,
              details: error.message
            });
          });
        }
      }

    } else if (target === 'proxy') {
      const proxyOptions = {
        target: `http://${host}:${port}`,
        changeOrigin: true,
        onError: (err, req, res) => {
          console.error(`Proxy error for ${route}:`, err.message);
          res.status(502).json({
            error: 'Bad Gateway',
            message: `Failed to proxy request to ${host}:${port}`,
            route: route
          });
        },
        onProxyReq: (proxyReq, req, res) => {
          console.log(`Proxying ${req.method} ${req.url} -> ${host}:${port}`);
        }
      };

      // Add path rewriting if specified
      if (pathRewrite) {
        proxyOptions.pathRewrite = pathRewrite;
      }

      app.use(route, createProxyMiddleware(proxyOptions));

    } else {
      console.error(`❌ Unknown target type '${target}' for route ${route}`);
    }

  } catch (error) {
    console.error(`❌ Failed to setup route ${route}:`, error.message);
  }
});

// Catch-all handler for unmapped routes
app.use((req, res) => {
  const availableRoutes = config.map(c => ({
    route: c.route,
    target: c.target,
    description: c.description
  }));

  res.status(404).json({
    error: 'Route Not Found',
    message: `No gateway configuration found for: ${req.path}`,
    availableRoutes: availableRoutes,
    suggestion: 'Check the gateway/config.js file to add this route'
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Gateway error:', error);
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'An unexpected error occurred in the gateway',
    timestamp: new Date().toISOString()
  });
});

// Start the server
app.listen(PORT, () => {
  console.log('\n🚀 Universal Gateway Server Started');
  console.log(`📡 Server running on http://localhost:${PORT}`);
  console.log(`⚡ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('\n📋 Configured Routes:');
  
  config.forEach(({ route, target, description }) => {
    const targetInfo = target === 'static' ? '📁 Static' : 
                      target === 'local' ? '🔧 Local' : 
                      target === 'proxy' ? '🔗 Proxy' : '❓ Unknown';
    console.log(`   ${route.padEnd(20)} -> ${targetInfo} ${description ? `(${description})` : ''}`);
  });
  
  console.log(`\n🔍 Health check: http://localhost:${PORT}/health`);
  console.log('───────────────────────────────────────────────────\n');
});
