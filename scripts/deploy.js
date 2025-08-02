#!/usr/bin/env node

/**
 * GitHub Pages Deployment Script
 * 
 * Deploys built apps to GitHub Pages with proper configuration.
 * Usage: node scripts/deploy.js [environment]
 */

import fs from 'fs/promises';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { getDeploymentConfig, BUILD_CONFIG } from '../build.config.js';
import { buildAllApps } from './build-all.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

/**
 * Deploy to GitHub Pages
 */
async function deployToGitHubPages(environment = 'production', buildFirst = true) {
  console.log(`🚀 Deploying to GitHub Pages (${environment})...`);
  
  try {
    const config = getDeploymentConfig(environment);
    const outputDir = path.resolve(rootDir, BUILD_CONFIG.global.outputDir);
    
    // Build all apps first if requested
    if (buildFirst) {
      console.log(`🔨 Building all apps first...`);
      await buildAllApps(environment);
    }
    
    // Validate output directory exists
    const outputExists = await fs.access(outputDir).then(() => true).catch(() => false);
    if (!outputExists) {
      throw new Error(`Output directory not found: ${outputDir}. Run build first.`);
    }
    
    // Check if we're in a git repository
    try {
      execSync('git rev-parse --git-dir', { stdio: 'ignore' });
    } catch (error) {
      throw new Error('Not in a git repository. Please run from the project root.');
    }
    
    // Check for uncommitted changes
    try {
      const status = execSync('git status --porcelain', { encoding: 'utf8' });
      if (status.trim() && environment === 'production') {
        console.warn('⚠️  Warning: You have uncommitted changes. Consider committing them first.');
      }
    } catch (error) {
      console.warn('⚠️  Could not check git status');
    }
    
    // Create deployment branch if it doesn't exist
    const deployBranch = config.deployment.branch;
    console.log(`📋 Preparing deployment branch: ${deployBranch}`);
    
    try {
      // Check if branch exists
      execSync(`git show-ref --verify --quiet refs/heads/${deployBranch}`, { stdio: 'ignore' });
      console.log(`✅ Branch ${deployBranch} exists`);
    } catch (error) {
      // Create orphan branch
      console.log(`🌱 Creating new orphan branch: ${deployBranch}`);
      execSync(`git checkout --orphan ${deployBranch}`, { stdio: 'inherit' });
      execSync(`git rm -rf .`, { stdio: 'ignore' });
      execSync(`git commit --allow-empty -m "Initial commit"`, { stdio: 'inherit' });
      execSync(`git checkout main`, { stdio: 'inherit' });
    }
    
    // Switch to deployment branch
    console.log(`🔄 Switching to ${deployBranch} branch...`);
    execSync(`git checkout ${deployBranch}`, { stdio: 'inherit' });
    
    // Clean deployment branch if configured
    if (config.deployment.cleanBeforeDeploy) {
      console.log(`🧹 Cleaning deployment branch...`);
      try {
        // Remove all files except .git
        const files = await fs.readdir('.');
        for (const file of files) {
          if (file !== '.git') {
            await fs.rm(file, { recursive: true, force: true });
          }
        }
      } catch (error) {
        console.warn('⚠️  Could not clean deployment branch:', error.message);
      }
    }
    
    // Copy built files to deployment branch
    console.log(`📁 Copying built files to deployment branch...`);
    await copyDirectory(outputDir, '.');
    
    // Generate deployment-specific files
    await generateDeploymentFiles(config, environment);
    
    // Add all files to git
    console.log(`📝 Adding files to git...`);
    execSync('git add .', { stdio: 'inherit' });
    
    // Check if there are changes to commit
    try {
      execSync('git diff --staged --quiet', { stdio: 'ignore' });
      console.log('ℹ️  No changes to deploy');
      return { success: true, message: 'No changes to deploy' };
    } catch (error) {
      // There are changes to commit
    }
    
    // Commit changes
    const commitMessage = `Deploy ${environment} build - ${new Date().toISOString()}`;
    console.log(`💾 Committing changes: ${commitMessage}`);
    execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });
    
    // Push to GitHub
    console.log(`🚀 Pushing to GitHub...`);
    execSync(`git push origin ${deployBranch}`, { stdio: 'inherit' });
    
    // Switch back to main branch
    console.log(`🔄 Switching back to main branch...`);
    execSync('git checkout main', { stdio: 'inherit' });
    
    console.log(`✅ Successfully deployed to GitHub Pages!`);
    console.log(`🌐 Your site will be available at: ${config.environment.baseUrl}`);
    
    return {
      success: true,
      deploymentUrl: config.environment.baseUrl,
      branch: deployBranch,
      environment
    };
    
  } catch (error) {
    console.error(`❌ Deployment failed:`, error.message);
    
    // Try to switch back to main branch
    try {
      execSync('git checkout main', { stdio: 'ignore' });
    } catch (switchError) {
      console.warn('⚠️  Could not switch back to main branch');
    }
    
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
 * Generate deployment-specific files
 */
async function generateDeploymentFiles(config, environment) {
  console.log(`📄 Generating deployment files...`);
  
  // Generate CNAME if custom domain is specified
  if (config.deployment.customDomain) {
    await fs.writeFile('CNAME', config.deployment.customDomain);
    console.log(`📄 Generated CNAME: ${config.deployment.customDomain}`);
  }
  
  // Ensure .nojekyll exists
  await fs.writeFile('.nojekyll', '');
  console.log(`📄 Generated .nojekyll`);
  
  // Generate deployment info
  const deploymentInfo = {
    deployedAt: new Date().toISOString(),
    environment,
    baseUrl: config.environment.baseUrl,
    branch: config.deployment.branch,
    version: process.env.npm_package_version || '1.0.0'
  };
  
  await fs.writeFile('deployment-info.json', JSON.stringify(deploymentInfo, null, 2));
  console.log(`📄 Generated deployment-info.json`);
}

/**
 * Validate deployment prerequisites
 */
async function validateDeployment() {
  console.log(`🔍 Validating deployment prerequisites...`);
  
  // Check if git is available
  try {
    execSync('git --version', { stdio: 'ignore' });
  } catch (error) {
    throw new Error('Git is not installed or not available in PATH');
  }
  
  // Check if we're in a git repository
  try {
    execSync('git rev-parse --git-dir', { stdio: 'ignore' });
  } catch (error) {
    throw new Error('Not in a git repository');
  }
  
  // Check if remote origin exists
  try {
    execSync('git remote get-url origin', { stdio: 'ignore' });
  } catch (error) {
    throw new Error('No remote origin configured');
  }
  
  console.log(`✅ All prerequisites validated`);
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const environment = process.argv[2] || 'production';
  const skipBuild = process.argv.includes('--skip-build');
  
  console.log(`🎯 Starting deployment process...`);
  
  validateDeployment()
    .then(() => deployToGitHubPages(environment, !skipBuild))
    .then((result) => {
      if (result.success) {
        console.log(`\n🎉 Deployment completed successfully!`);
        console.log(`🌐 Site URL: ${result.deploymentUrl}`);
        console.log(`📋 Environment: ${result.environment}`);
        console.log(`🌿 Branch: ${result.branch}`);
      }
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Deployment failed:', error.message);
      process.exit(1);
    });
}

export { deployToGitHubPages };
