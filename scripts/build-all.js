#!/usr/bin/env node

/**
 * Build All Apps Script
 * 
 * Builds all configured apps for GitHub Pages deployment.
 * Usage: node scripts/build-all.js [environment]
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { getAllApps, BUILD_CONFIG } from '../build.config.js';
import { buildApp } from './build-app.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

/**
 * Build all apps
 */
async function buildAllApps(environment = 'production') {
  console.log(`🚀 Building all apps for ${environment}...`);
  
  const apps = getAllApps();
  const results = [];
  
  // Clean global output directory
  const globalOutputDir = path.resolve(rootDir, BUILD_CONFIG.global.outputDir);
  console.log(`🧹 Cleaning output directory: ${globalOutputDir}`);
  await fs.rm(globalOutputDir, { recursive: true, force: true });
  await fs.mkdir(globalOutputDir, { recursive: true });
  
  // Build each app
  for (const appName of apps) {
    try {
      console.log(`\n📦 Building ${appName}...`);
      const result = await buildApp(appName, environment);
      results.push(result);
      console.log(`✅ ${appName} built successfully`);
    } catch (error) {
      console.error(`❌ Failed to build ${appName}:`, error.message);
      results.push({
        appName,
        success: false,
        error: error.message
      });
    }
  }
  
  // Generate global files
  await generateGlobalFiles(environment, globalOutputDir);
  
  // Generate build summary
  const summary = generateBuildSummary(results, environment);
  console.log('\n' + summary);
  
  // Save build manifest
  await saveBuildManifest(results, environment, globalOutputDir);
  
  return results;
}

/**
 * Generate global GitHub Pages files
 */
async function generateGlobalFiles(environment, outputDir) {
  console.log(`\n📄 Generating global GitHub Pages files...`);
  
  // Generate main index.html that redirects to gateway or default app
  const mainIndexContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OrgRJ - Personal Projects</title>
  <meta name="description" content="Collection of personal projects and applications">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 0;
      padding: 40px 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .container {
      text-align: center;
      max-width: 600px;
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
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-top: 2rem;
    }
    .app-card {
      background: rgba(255, 255, 255, 0.1);
      padding: 1.5rem;
      border-radius: 10px;
      text-decoration: none;
      color: white;
      transition: transform 0.3s ease;
      backdrop-filter: blur(10px);
    }
    .app-card:hover {
      transform: translateY(-5px);
      background: rgba(255, 255, 255, 0.2);
    }
    .app-name {
      font-size: 1.3rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }
    .app-desc {
      font-size: 0.9rem;
      opacity: 0.8;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">🚀</div>
    <h1 class="title">OrgRJ</h1>
    <p class="subtitle">Personal Projects & Applications</p>
    
    <div class="apps">
      <a href="/OrgRJ/finclamp/" class="app-card">
        <div class="app-name">FinClamp</div>
        <div class="app-desc">Financial calculators and planning tools</div>
      </a>
      <a href="/OrgRJ/arcade/" class="app-card">
        <div class="app-name">Arcade</div>
        <div class="app-desc">Retro games collection</div>
      </a>
      <a href="/OrgRJ/engaged/" class="app-card">
        <div class="app-name">Engaged</div>
        <div class="app-desc">Wedding planning application</div>
      </a>
      <a href="/OrgRJ/skips/" class="app-card">
        <div class="app-name">Skips</div>
        <div class="app-desc">Fitness tracking application</div>
      </a>
    </div>
  </div>
  
  <script>
    // Auto-redirect to FinClamp if no specific app is requested
    if (window.location.pathname === '/OrgRJ/' || window.location.pathname === '/OrgRJ/index.html') {
      // Show landing page for 3 seconds, then redirect to FinClamp
      setTimeout(() => {
        window.location.href = '/OrgRJ/finclamp/';
      }, 3000);
    }
  </script>
</body>
</html>`;
  
  await fs.writeFile(path.join(outputDir, 'index.html'), mainIndexContent);
  console.log(`📄 Generated main index.html`);
  
  // Generate global 404.html
  const global404Content = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>OrgRJ - Page Not Found</title>
  <script type="text/javascript">
    // GitHub Pages SPA redirect for all apps
    var pathSegmentsToKeep = 1;
    var l = window.location;
    
    // Check if this is a known app route
    var knownApps = ['finclamp', 'arcade', 'engaged', 'skips'];
    var pathParts = l.pathname.split('/').filter(Boolean);
    
    if (pathParts.length > 1 && knownApps.includes(pathParts[1])) {
      // Redirect to specific app with SPA routing
      var appPath = '/' + pathParts.slice(0, 2).join('/') + '/';
      var remainingPath = pathParts.slice(2).join('/');
      
      l.replace(
        l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
        appPath + '?p=/' + remainingPath +
        (l.search ? '&q=' + l.search.slice(1).replace(/&/g, '~and~') : '') +
        l.hash
      );
    } else {
      // Redirect to main page
      l.replace(l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') + '/OrgRJ/');
    }
  </script>
</head>
<body></body>
</html>`;
  
  await fs.writeFile(path.join(outputDir, '404.html'), global404Content);
  console.log(`📄 Generated global 404.html`);
  
  // Generate .nojekyll
  await fs.writeFile(path.join(outputDir, '.nojekyll'), '');
  console.log(`📄 Generated .nojekyll`);
  
  // Generate README.md
  const readmeContent = `# OrgRJ - Personal Projects

This repository contains a collection of personal projects and applications.

## Applications

- **FinClamp** - Financial calculators and planning tools
- **Arcade** - Retro games collection  
- **Engaged** - Wedding planning application
- **Skips** - Fitness tracking application

## Live Demo

Visit: https://orgrj.github.io/OrgRJ/

## Build Information

- Environment: ${environment}
- Built: ${new Date().toISOString()}
- Framework: Vite + React
- Deployment: GitHub Pages

## Development

Each app is built independently and deployed to GitHub Pages with proper SPA routing support.
`;
  
  await fs.writeFile(path.join(outputDir, 'README.md'), readmeContent);
  console.log(`📄 Generated README.md`);
}

/**
 * Generate build summary
 */
function generateBuildSummary(results, environment) {
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  let summary = `\n${'='.repeat(60)}\n`;
  summary += `🎯 BUILD SUMMARY - ${environment.toUpperCase()}\n`;
  summary += `${'='.repeat(60)}\n`;
  summary += `✅ Successful: ${successful.length}\n`;
  summary += `❌ Failed: ${failed.length}\n`;
  summary += `📊 Total: ${results.length}\n\n`;
  
  if (successful.length > 0) {
    summary += `✅ SUCCESSFUL BUILDS:\n`;
    successful.forEach(r => {
      summary += `   • ${r.config.name} (${r.appName})\n`;
    });
    summary += `\n`;
  }
  
  if (failed.length > 0) {
    summary += `❌ FAILED BUILDS:\n`;
    failed.forEach(r => {
      summary += `   • ${r.appName}: ${r.error}\n`;
    });
    summary += `\n`;
  }
  
  summary += `🚀 Ready for deployment to GitHub Pages!\n`;
  summary += `${'='.repeat(60)}`;
  
  return summary;
}

/**
 * Save build manifest
 */
async function saveBuildManifest(results, environment, outputDir) {
  const manifest = {
    buildTime: new Date().toISOString(),
    environment,
    results,
    successful: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length,
    total: results.length
  };
  
  await fs.writeFile(
    path.join(outputDir, 'build-manifest.json'),
    JSON.stringify(manifest, null, 2)
  );
  
  console.log(`📄 Generated build-manifest.json`);
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const environment = process.argv[2] || 'production';
  
  buildAllApps(environment)
    .then((results) => {
      const failed = results.filter(r => !r.success);
      if (failed.length > 0) {
        console.error(`\n💥 ${failed.length} app(s) failed to build`);
        process.exit(1);
      } else {
        console.log(`\n🎉 All apps built successfully!`);
        process.exit(0);
      }
    })
    .catch((error) => {
      console.error('💥 Build process failed:', error);
      process.exit(1);
    });
}

export { buildAllApps };
