#!/usr/bin/env node

/**
 * Deploy FinClamp to Repository Root
 * 
 * Builds FinClamp and deploys it to the root of the repository
 * so GitHub Pages serves it directly from https://username.github.io/repo/
 */

import fs from 'fs/promises';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

/**
 * Deploy FinClamp to root
 */
async function deployFinClampToRoot(environment = 'production') {
  console.log(`🚀 Deploying FinClamp to Repository Root`);
  console.log(`📅 ${new Date().toISOString()}`);
  console.log(`🌍 Environment: ${environment}`);
  
  try {
    const sourceDir = path.resolve(rootDir, 'apps/finclamp');
    
    // Validate source directory exists
    const sourceDirExists = await fs.access(sourceDir).then(() => true).catch(() => false);
    if (!sourceDirExists) {
      throw new Error(`FinClamp source directory not found: ${sourceDir}`);
    }
    
    console.log(`📁 Source: ${sourceDir}`);
    console.log(`📂 Target: ${rootDir} (repository root)`);
    
    // Set environment variables
    const envVars = {
      NODE_ENV: environment,
      VITE_APP_NAME: 'FinClamp',
      VITE_BASE_URL: '/OrgRJ',
      VITE_API_URL: 'https://orgrj.github.io/OrgRJ/api'
    };
    
    console.log(`🔧 Environment variables configured`);
    
    // Create .env file for the build
    const envContent = Object.entries(envVars)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');
    
    const envFilePath = path.join(sourceDir, '.env.production');
    await fs.writeFile(envFilePath, envContent);
    console.log(`📝 Created .env.production file`);
    
    // Install dependencies from root (for shared tools like Vite)
    console.log(`📥 Installing root dependencies...`);
    execSync('npm install', { 
      cwd: rootDir, 
      stdio: 'inherit',
      env: { ...process.env, ...envVars }
    });
    
    // Install app-specific dependencies
    console.log(`📥 Installing FinClamp dependencies...`);
    execSync('npm install', { 
      cwd: sourceDir, 
      stdio: 'inherit',
      env: { ...process.env, ...envVars }
    });
    
    // Build FinClamp using workspace
    console.log(`🔨 Building FinClamp...`);
    execSync(`npm run build --workspace=apps/finclamp`, { 
      cwd: rootDir, 
      stdio: 'inherit',
      env: { ...process.env, ...envVars }
    });
    
    // Clean existing web assets from root (preserve source code)
    console.log(`🧹 Cleaning existing web assets from root...`);
    const webAssets = [
      'index.html', 
      'assets', 
      'vite.svg', 
      '404.html', 
      '.nojekyll', 
      'CNAME',
      'build-info.json'
    ];
    
    for (const asset of webAssets) {
      const assetPath = path.join(rootDir, asset);
      await fs.rm(assetPath, { recursive: true, force: true });
    }
    
    // Copy built files to root
    const builtFilesDir = path.join(sourceDir, 'dist');
    console.log(`📁 Copying built files from ${builtFilesDir} to ${rootDir}`);
    
    await copyDirectory(builtFilesDir, rootDir);
    
    // Generate GitHub Pages specific files
    await generateGitHubPagesFiles(rootDir);
    
    // Generate build info
    const buildInfo = {
      appName: 'finclamp',
      appDisplayName: 'FinClamp',
      environment,
      buildTime: new Date().toISOString(),
      baseUrl: '/OrgRJ',
      deploymentType: 'root',
      version: process.env.npm_package_version || '1.0.0'
    };
    
    await fs.writeFile(
      path.join(rootDir, 'build-info.json'),
      JSON.stringify(buildInfo, null, 2)
    );
    
    // Clean up temporary files
    await fs.unlink(envFilePath).catch(() => {});
    
    console.log(`\n✅ FinClamp Successfully Deployed to Root!`);
    console.log(`🌐 GitHub Pages URL: https://rajmohanjayakumar.github.io/OrgRJ/`);
    console.log(`📂 Files deployed to: ${rootDir}`);
    console.log(`📊 Build Info: ${path.join(rootDir, 'build-info.json')}`);
    
    return {
      success: true,
      buildInfo,
      rootDir
    };
    
  } catch (error) {
    console.error(`❌ Deployment Failed:`, error.message);
    throw error;
  }
}

/**
 * Copy directory recursively
 */
async function copyDirectory(src, dest) {
  const entries = await fs.readdir(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      await fs.mkdir(destPath, { recursive: true });
      await copyDirectory(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

/**
 * Generate GitHub Pages specific files
 */
async function generateGitHubPagesFiles(outputDir) {
  console.log(`📄 Generating GitHub Pages files...`);
  
  // Generate 404.html for SPA routing
  const html404Content = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>FinClamp</title>
  <script type="text/javascript">
    // GitHub Pages SPA redirect for FinClamp
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
  
  // Generate .nojekyll file
  await fs.writeFile(path.join(outputDir, '.nojekyll'), '');
  console.log(`📄 Generated .nojekyll file`);
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const environment = process.argv[2] || process.env.NODE_ENV || 'production';
  
  deployFinClampToRoot(environment)
    .then(() => {
      console.log(`\n🎉 Deployment completed successfully!`);
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Deployment failed:', error);
      process.exit(1);
    });
}

export { deployFinClampToRoot };
