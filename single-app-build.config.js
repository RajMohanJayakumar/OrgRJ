/**
 * Single App GitHub Pages Build Configuration
 * 
 * Builds and deploys only one specified app to GitHub Pages.
 * Optimized for CI/CD and selective deployments.
 */

export const SINGLE_APP_BUILD_CONFIG = {
  // Target app configuration
  target: {
    // Change this to build different apps
    appName: 'finclamp', // Options: 'finclamp', 'arcade', 'engaged', 'skips'
    
    // Override app name via environment variable
    // Usage: APP_NAME=arcade npm run build:single
    fromEnv: process.env.APP_NAME || null
  },

  // App definitions
  apps: {
    finclamp: {
      name: 'FinClamp',
      description: 'Financial calculators and planning tools',
      sourceDir: 'apps/finclamp',
      buildCommand: 'npm run build',
      outputPath: '.', // Deploy to root
      routes: ['/calculators', '/calculator', '/finclamp', '/finance', '/games'],
      githubPages: {
        subdirectory: '', // Root deployment
        customDomain: false,
        spa: true,
        baseUrl: '/OrgRJ', // GitHub Pages base URL
        deployToRoot: true // Special flag for root deployment
      },
      build: {
        framework: 'vite',
        nodeVersion: '18',
        dependencies: ['react', 'vite', 'tailwindcss'],
        envVars: {
          VITE_APP_NAME: 'FinClamp',
          VITE_BASE_URL: '/OrgRJ',
          VITE_API_URL: 'https://orgrj.github.io/OrgRJ/api'
        }
      }
    },
    arcade: {
      name: 'Arcade',
      description: 'Retro games collection',
      sourceDir: 'apps/arcade-games',
      buildCommand: 'npm run build',
      outputPath: 'dist',
      routes: ['/arcade', '/retro-games'],
      githubPages: {
        subdirectory: 'arcade',
        customDomain: false,
        spa: true,
        baseUrl: '/OrgRJ'
      },
      build: {
        framework: 'vite',
        nodeVersion: '18',
        dependencies: ['react', 'vite'],
        envVars: {
          VITE_APP_NAME: 'Arcade',
          VITE_BASE_URL: '/OrgRJ'
        }
      }
    },
    engaged: {
      name: 'Engaged',
      description: 'Wedding planning application',
      sourceDir: 'apps/engaged',
      buildCommand: 'npm run build',
      outputPath: 'dist',
      routes: ['/engaged', '/wedding', '/planning'],
      githubPages: {
        subdirectory: 'engaged',
        customDomain: false,
        spa: true,
        baseUrl: '/OrgRJ'
      },
      build: {
        framework: 'vite',
        nodeVersion: '18',
        dependencies: ['react', 'vite'],
        envVars: {
          VITE_APP_NAME: 'Engaged',
          VITE_BASE_URL: '/OrgRJ'
        }
      }
    },
    skips: {
      name: 'Skips',
      description: 'Fitness tracking application',
      sourceDir: 'apps/skips',
      buildCommand: 'npm run build',
      outputPath: 'dist',
      routes: ['/skips', '/fitness', '/tracker'],
      githubPages: {
        subdirectory: 'skips',
        customDomain: false,
        spa: true,
        baseUrl: '/OrgRJ'
      },
      build: {
        framework: 'vite',
        nodeVersion: '18',
        dependencies: ['react', 'vite'],
        envVars: {
          VITE_APP_NAME: 'Skips',
          VITE_BASE_URL: '/OrgRJ'
        }
      }
    }
  },

  // Build environments
  environments: {
    development: {
      baseUrl: 'http://localhost:3000',
      debug: true,
      sourceMaps: true
    },
    staging: {
      baseUrl: 'https://orgrj-staging.github.io/OrgRJ',
      debug: false,
      sourceMaps: true
    },
    production: {
      baseUrl: 'https://orgrj.github.io/OrgRJ',
      debug: false,
      sourceMaps: false,
      optimization: {
        minify: true,
        treeshake: true,
        compression: 'gzip'
      }
    }
  },

  // GitHub Pages deployment settings
  githubPages: {
    enabled: true,
    branch: 'gh-pages',
    domain: 'orgrj.github.io',
    
    // Single app deployment strategy
    deployment: {
      strategy: 'single-app', // 'single-app' or 'multi-app'
      cleanBeforeDeploy: true,
      generateCNAME: false,
      customDomain: null,
      
      // Files to include in deployment
      include: [
        'dist/**/*',
        'CNAME',
        '.nojekyll'
      ],
      
      // Files to exclude from deployment
      exclude: [
        'node_modules/**/*',
        'src/**/*',
        '.git/**/*',
        '*.log'
      ]
    },

    // SPA routing support
    spa: {
      enabled: true,
      fallback: 'index.html',
      generate404: true
    }
  }
};

/**
 * Get configuration for the target app
 */
export function getTargetAppConfig(environment = 'production') {
  const targetAppName = SINGLE_APP_BUILD_CONFIG.target.fromEnv || SINGLE_APP_BUILD_CONFIG.target.appName;
  const app = SINGLE_APP_BUILD_CONFIG.apps[targetAppName];
  const env = SINGLE_APP_BUILD_CONFIG.environments[environment];
  
  if (!app) {
    throw new Error(`App "${targetAppName}" not found in configuration. Available apps: ${Object.keys(SINGLE_APP_BUILD_CONFIG.apps).join(', ')}`);
  }
  
  return {
    ...app,
    appName: targetAppName,
    environment: env,
    githubPages: {
      ...SINGLE_APP_BUILD_CONFIG.githubPages,
      ...app.githubPages
    }
  };
}

/**
 * Get all available app names
 */
export function getAvailableApps() {
  return Object.keys(SINGLE_APP_BUILD_CONFIG.apps);
}

/**
 * Validate app name
 */
export function validateAppName(appName) {
  const availableApps = getAvailableApps();
  if (!availableApps.includes(appName)) {
    throw new Error(`Invalid app name "${appName}". Available apps: ${availableApps.join(', ')}`);
  }
  return true;
}

export default SINGLE_APP_BUILD_CONFIG;
