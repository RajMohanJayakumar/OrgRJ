#!/usr/bin/env node

/**
 * Build and Serve Strategy
 * 
 * Builds all apps at once and serves them based on routes.
 * Combines API gateway with static file serving for built apps.
 */

import fs from 'fs/promises';
import path from 'path';
import express from 'express';
import { fileURLToPath } from 'url';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { buildAllApps } from './build-all.js';
import { GATEWAY_CONFIG, getTargetPort } from '../gateway/routes.config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

/**
 * Build and serve all applications
 */
async function buildAndServe(environment = 'production', port = 3000, buildFirst = true) {
  console.log(`🚀 Starting build-and-serve for ${environment}...`);
  
  // Build all apps first if requested
  if (buildFirst) {
    console.log(`🔨 Building all applications...`);
    await buildAllApps(environment);
    console.log(`✅ All applications built successfully`);
  }
  
  // Create Express app
  const app = express();
  
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
      mode: 'build-and-serve',
      environment,
      apps: Object.keys(GATEWAY_CONFIG.frontend),
      apis: Object.keys(GATEWAY_CONFIG.api)
    });
  });
  
  // API proxy middleware - handles /api/* routes
  app.use('/api', createProxyMiddleware({
    changeOrigin: true,
    secure: false,
    router: (req) => {
      const fullUrl = '/api' + req.url;
      const targetPort = getTargetPort(fullUrl);
      
      if (!targetPort) {
        return null;
      }
      
      const target = `http://localhost:${targetPort}`;
      console.log(`🔀 API: ${req.method} ${fullUrl} -> ${target}`);
      return target;
    },
    onError: (err, req, res) => {
      console.error(`❌ API Error: ${err.message}`);
      if (res && !res.headersSent) {
        res.status(502).json({
          error: 'API Gateway Error',
          message: err.message
        });
      }
    }
  }));
  
  // Serve built frontend applications
  const distDir = path.resolve(rootDir, 'dist');
  
  // Setup static serving for each app
  Object.entries(GATEWAY_CONFIG.frontend).forEach(([appName, config]) => {
    const appDistPath = path.join(distDir, appName);
    const buildPath = config.buildPath;
    
    console.log(`📁 Setting up static serving: ${buildPath} -> ${appDistPath}`);
    
    // Serve static files for this app
    app.use(buildPath, express.static(appDistPath, {
      index: 'index.html',
      fallthrough: true
    }));
    
    // SPA fallback for this app
    app.get(`${buildPath}/*`, async (req, res, next) => {
      try {
        const indexPath = path.join(appDistPath, 'index.html');
        const indexExists = await fs.access(indexPath).then(() => true).catch(() => false);
        
        if (indexExists) {
          console.log(`📄 SPA fallback: ${req.url} -> ${indexPath}`);
          res.sendFile(indexPath);
        } else {
          next();
        }
      } catch (error) {
        next(error);
      }
    });
  });
  
  // Root route - landing page
  app.get('/', (req, res) => {
    const appLinks = Object.entries(GATEWAY_CONFIG.frontend)
      .map(([appName, config]) => {
        return `
          <div class="app-card">
            <h3>${config.name}</h3>
            <p>${config.description}</p>
            <a href="${config.buildPath}/" class="app-link">Open App</a>
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
        <title>OrgRJ - Built Applications</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 40px 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 100vh;
          }
          .container {
            max-width: 800px;
            margin: 0 auto;
            text-align: center;
          }
          .header {
            margin-bottom: 40px;
          }
          .logo {
            font-size: 3rem;
            margin-bottom: 1rem;
          }
          .title {
            font-size: 2.5rem;
            margin-bottom: 1rem;
            font-weight: 300;
          }
          .subtitle {
            font-size: 1.2rem;
            margin-bottom: 2rem;
            opacity: 0.9;
          }
          .apps {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-top: 2rem;
          }
          .app-card {
            background: rgba(255, 255, 255, 0.1);
            padding: 2rem;
            border-radius: 15px;
            backdrop-filter: blur(10px);
            transition: transform 0.3s ease;
          }
          .app-card:hover {
            transform: translateY(-5px);
            background: rgba(255, 255, 255, 0.2);
          }
          .app-card h3 {
            margin: 0 0 1rem 0;
            font-size: 1.5rem;
          }
          .app-card p {
            margin: 0 0 1.5rem 0;
            opacity: 0.8;
          }
          .app-link {
            display: inline-block;
            padding: 12px 24px;
            background: rgba(255, 255, 255, 0.2);
            color: white;
            text-decoration: none;
            border-radius: 8px;
            border: 1px solid rgba(255, 255, 255, 0.3);
            transition: all 0.3s ease;
          }
          .app-link:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: translateY(-2px);
          }
          .info {
            margin-top: 3rem;
            padding: 2rem;
            background: rgba(0, 0, 0, 0.2);
            border-radius: 10px;
            backdrop-filter: blur(10px);
          }
          .info h3 {
            margin-top: 0;
          }
          .status-link {
            color: #a7f3d0;
            text-decoration: none;
          }
          .status-link:hover {
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🚀</div>
            <h1 class="title">OrgRJ</h1>
            <p class="subtitle">Built Applications - ${environment.toUpperCase()}</p>
          </div>
          
          <div class="apps">
            ${appLinks}
          </div>
          
          <div class="info">
            <h3>📊 System Status</h3>
            <p>
              Environment: <strong>${environment}</strong><br>
              Mode: <strong>Build and Serve</strong><br>
              <a href="/health" class="status-link">Health Check</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `);
  });
  
  // 404 handler
  app.use('*', (req, res) => {
    res.status(404).json({
      error: 'Not Found',
      message: 'Route not found',
      availableApps: Object.entries(GATEWAY_CONFIG.frontend).map(([name, config]) => ({
        name: config.name,
        path: config.buildPath
      })),
      availableApis: Object.values(GATEWAY_CONFIG.api).flatMap(config => config.routes)
    });
  });
  
  // Start server
  const server = app.listen(port, () => {
    console.log('\n🎯 Build-and-Serve Server Started');
    console.log(`📡 Server: http://localhost:${port}`);
    console.log(`⚡ Environment: ${environment}`);
    console.log(`📁 Serving from: ${distDir}`);
    
    console.log('\n📱 Built Applications:');
    Object.entries(GATEWAY_CONFIG.frontend).forEach(([appName, config]) => {
      console.log(`   ${config.name}: http://localhost:${port}${config.buildPath}/`);
    });
    
    console.log('\n🔌 API Endpoints:');
    Object.entries(GATEWAY_CONFIG.api).forEach(([appName, config]) => {
      const routes = config.routes.join(', ');
      console.log(`   ${routes} -> localhost:${config.port} (${config.name})`);
    });
    
    console.log('\n🔍 System endpoints:');
    console.log(`   Landing page: http://localhost:${port}/`);
    console.log(`   Health check: http://localhost:${port}/health`);
    console.log('───────────────────────────────────────────────────\n');
  });
  
  return server;
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const environment = process.argv[2] || 'production';
  const port = parseInt(process.argv[3]) || 3000;
  const skipBuild = process.argv.includes('--skip-build');
  
  buildAndServe(environment, port, !skipBuild)
    .then(() => {
      console.log(`🎉 Build-and-serve started successfully!`);
    })
    .catch((error) => {
      console.error('💥 Failed to start build-and-serve:', error);
      process.exit(1);
    });
}

export { buildAndServe };
