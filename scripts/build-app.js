#!/usr/bin/env node

/**
 * Build Individual App Script
 * 
 * Builds a specific app for GitHub Pages deployment with proper configuration.
 * Usage: node scripts/build-app.js <appName> [environment]
 */

import fs from 'fs/promises';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { getAppConfig } from '../build.config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

/**
 * Build a specific app
 */
async function buildApp(appName, environment = 'production') {
  console.log(`🚀 Building ${appName} for ${environment}...`);
  
  try {
    // Get app configuration
    const config = getAppConfig(appName, environment);
    console.log(`📋 Configuration loaded for ${config.name}`);
    
    // Validate source directory
    const sourceDir = path.resolve(rootDir, config.sourceDir);
    const sourceDirExists = await fs.access(sourceDir).then(() => true).catch(() => false);
    
    if (!sourceDirExists) {
      throw new Error(`Source directory not found: ${sourceDir}`);
    }
    
    // Create output directory
    const outputDir = path.resolve(rootDir, config.outputPath);
    await fs.mkdir(outputDir, { recursive: true });
    
    // Set environment variables
    const envVars = {
      NODE_ENV: environment,
      ...config.build.envVars,
      ...config.environment
    };
    
    const envString = Object.entries(envVars)
      .map(([key, value]) => `${key}="${value}"`)
      .join(' ');
    
    console.log(`🔧 Environment variables set for ${environment}`);
    
    // Create .env file for the build
    const envContent = Object.entries(envVars)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');
    
    const envFilePath = path.join(sourceDir, '.env.production');
    await fs.writeFile(envFilePath, envContent);
    console.log(`📝 Created .env.production file`);
    
    // Update package.json with correct base URL for GitHub Pages
    const packageJsonPath = path.join(sourceDir, 'package.json');
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'));
    
    // Update build script if needed
    if (config.build.framework === 'vite') {
      packageJson.scripts = packageJson.scripts || {};
      packageJson.scripts.build = `vite build --base=${config.build.envVars.VITE_BASE_URL}/`;
    }
    
    await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log(`📦 Updated package.json for GitHub Pages`);
    
    // Install dependencies if needed
    console.log(`📥 Installing dependencies...`);
    execSync('npm install', { 
      cwd: sourceDir, 
      stdio: 'inherit',
      env: { ...process.env, ...envVars }
    });
    
    // Run build command
    console.log(`🔨 Running build command: ${config.buildCommand}`);
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
    
    console.log(`✅ Successfully built ${config.name}!`);
    console.log(`📂 Output directory: ${outputDir}`);
    
    return {
      appName,
      config,
      outputDir,
      success: true
    };
    
  } catch (error) {
    console.error(`❌ Build failed for ${appName}:`, error.message);
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
  const appName = process.argv[2];
  const environment = process.argv[3] || 'production';
  
  if (!appName) {
    console.error('❌ Please specify an app name');
    console.log('Usage: node scripts/build-app.js <appName> [environment]');
    process.exit(1);
  }
  
  buildApp(appName, environment)
    .then(() => {
      console.log(`🎉 Build completed successfully!`);
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Build failed:', error);
      process.exit(1);
    });
}

export { buildApp };
