#!/usr/bin/env node

/**
 * Single App Build Script for GitHub Pages
 * 
 * Builds only one specified app, optimized for CI/CD.
 * Usage: 
 *   node scripts/build-single-app.js [appName] [environment]
 *   APP_NAME=finclamp node scripts/build-single-app.js
 */

import fs from 'fs/promises';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { getTargetAppConfig, validateAppName, getAvailableApps } from '../single-app-build.config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

/**
 * Build single app for GitHub Pages
 */
async function buildSingleApp(appName = null, environment = 'production') {
  console.log(`🚀 Single App Build Started`);
  console.log(`📅 ${new Date().toISOString()}`);
  
  try {
    // Get target app configuration
    const config = getTargetAppConfig(environment);
    const targetApp = appName || config.appName;
    
    // Validate app name
    validateAppName(targetApp);
    
    console.log(`🎯 Target App: ${config.name} (${targetApp})`);
    console.log(`🌍 Environment: ${environment}`);
    console.log(`📁 Source: ${config.sourceDir}`);
    
    // Validate source directory exists
    const sourceDir = path.resolve(rootDir, config.sourceDir);
    const sourceDirExists = await fs.access(sourceDir).then(() => true).catch(() => false);
    
    if (!sourceDirExists) {
      throw new Error(`Source directory not found: ${sourceDir}`);
    }
    
    // Create output directory
    const outputDir = path.resolve(rootDir, 'dist');
    await fs.mkdir(outputDir, { recursive: true });
    
    // Set environment variables
    const envVars = {
      NODE_ENV: environment,
      ...config.build.envVars,
      ...config.environment
    };
    
    console.log(`🔧 Environment variables configured`);
    
    // Create .env file for the build
    const envContent = Object.entries(envVars)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');
    
    const envFilePath = path.join(sourceDir, '.env.production');
    await fs.writeFile(envFilePath, envContent);
    console.log(`📝 Created .env.production file`);
    
    // Update package.json with correct base URL for GitHub Pages
    const packageJsonPath = path.join(sourceDir, 'package.json');
    const packageJsonExists = await fs.access(packageJsonPath).then(() => true).catch(() => false);
    
    if (packageJsonExists) {
      const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'));
      
      // Update build script if needed
      if (config.build.framework === 'vite') {
        packageJson.scripts = packageJson.scripts || {};
        packageJson.scripts.build = `vite build --base=${config.githubPages.baseUrl}/`;
      }
      
      await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
      console.log(`📦 Updated package.json for GitHub Pages`);
    }
    
    // Install dependencies
    console.log(`📥 Installing dependencies...`);
    execSync('npm install', { 
      cwd: sourceDir, 
      stdio: 'inherit',
      env: { ...process.env, ...envVars }
    });
    
    // Run build command
    console.log(`🔨 Building app: ${config.buildCommand}`);
    execSync(config.buildCommand, { 
      cwd: sourceDir, 
      stdio: 'inherit',
      env: { ...process.env, ...envVars }
    });
    
    // Copy built files to output directory
    const builtFilesDir = path.join(sourceDir, 'dist');
    console.log(`📁 Copying built files from ${builtFilesDir} to ${outputDir}`);
    
    // Remove existing output directory
    await fs.rm(outputDir, { recursive: true, force: true });
    await fs.mkdir(outputDir, { recursive: true });
    
    // Copy all files from build output
    await copyDirectory(builtFilesDir, outputDir);
    
    // Generate GitHub Pages specific files
    await generateGitHubPagesFiles(config, outputDir);
    
    // Clean up temporary files
    await fs.unlink(envFilePath).catch(() => {});
    
    // Generate build info
    const buildInfo = {
      appName: targetApp,
      appDisplayName: config.name,
      environment,
      buildTime: new Date().toISOString(),
      baseUrl: config.githubPages.baseUrl,
      routes: config.routes,
      version: process.env.npm_package_version || '1.0.0'
    };
    
    await fs.writeFile(
      path.join(outputDir, 'build-info.json'),
      JSON.stringify(buildInfo, null, 2)
    );
    
    console.log(`\n✅ Single App Build Completed Successfully!`);
    console.log(`🎯 App: ${config.name} (${targetApp})`);
    console.log(`📂 Output: ${outputDir}`);
    console.log(`🌐 Base URL: ${config.githubPages.baseUrl}`);
    console.log(`📊 Build Info: ${path.join(outputDir, 'build-info.json')}`);
    
    return {
      appName: targetApp,
      config,
      outputDir,
      buildInfo,
      success: true
    };
    
  } catch (error) {
    console.error(`❌ Single App Build Failed:`, error.message);
    throw error;
  }
}

/**
 * Copy directory recursively
 */
async function copyDirectory(src, dest) {
  const entries = await fs.readdir(src, { withFileTypes: true });
  
  await fs.mkdir(dest, { recursive: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      await copyDirectory(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

/**
 * Generate GitHub Pages specific files
 */
async function generateGitHubPagesFiles(config, outputDir) {
  console.log(`📄 Generating GitHub Pages files...`);
  
  // Generate 404.html for SPA routing
  if (config.githubPages.spa) {
    const html404Content = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${config.name}</title>
  <script type="text/javascript">
    // GitHub Pages SPA redirect
    var pathSegmentsToKeep = 1;
    var l = window.location;
    l.replace(
      l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
      l.pathname.split('/').slice(0, 1 + pathSegmentsToKeep).join('/') + 
      '/?p=/' + l.pathname.slice(1).split('/').slice(pathSegmentsToKeep).join('/').replace(/&/g, '~and~') +
      (l.search ? '&q=' + l.search.slice(1).replace(/&/g, '~and~') : '') +
      l.hash
    );
  </script>
</head>
<body></body>
</html>`;
    
    await fs.writeFile(path.join(outputDir, '404.html'), html404Content);
    console.log(`📄 Generated 404.html for SPA routing`);
  }
  
  // Generate .nojekyll file
  await fs.writeFile(path.join(outputDir, '.nojekyll'), '');
  console.log(`📄 Generated .nojekyll file`);
  
  // Generate CNAME if custom domain is specified
  if (config.githubPages.customDomain) {
    await fs.writeFile(path.join(outputDir, 'CNAME'), config.githubPages.customDomain);
    console.log(`📄 Generated CNAME file`);
  }
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const appName = process.argv[2] || process.env.APP_NAME;
  const environment = process.argv[3] || process.env.NODE_ENV || 'production';
  
  if (!appName) {
    console.log(`\n🎯 Single App Build for GitHub Pages`);
    console.log(`\nUsage:`);
    console.log(`  node scripts/build-single-app.js <appName> [environment]`);
    console.log(`  APP_NAME=<appName> node scripts/build-single-app.js [environment]`);
    console.log(`\nAvailable apps: ${getAvailableApps().join(', ')}`);
    console.log(`\nExamples:`);
    console.log(`  node scripts/build-single-app.js finclamp production`);
    console.log(`  APP_NAME=arcade node scripts/build-single-app.js staging`);
    process.exit(1);
  }
  
  buildSingleApp(appName, environment)
    .then(() => {
      console.log(`\n🎉 Build completed successfully!`);
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Build failed:', error);
      process.exit(1);
    });
}

export { buildSingleApp };
