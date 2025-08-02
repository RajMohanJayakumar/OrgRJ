/**
 * Universal Build Configuration
 * 
 * This configuration handles building and deploying all apps to GitHub Pages
 * with intelligent routing and environment-specific settings.
 */

export const BUILD_CONFIG = {
  // Global build settings
  global: {
    outputDir: 'dist',
    tempDir: '.build-temp',
    githubPages: {
      enabled: true,
      branch: 'gh-pages',
      domain: 'orgrj.github.io',
      baseUrl: '/OrgRJ'
    }
  },

  // Application configurations
  apps: {
    finclamp: {
      name: 'FinClamp',
      description: 'Financial calculators and planning tools',
      sourceDir: 'apps/finclamp',
      buildCommand: 'npm run build',
      outputPath: 'dist/finclamp',
      routes: [
        '/calculators',
        '/calculator', 
        '/finclamp',
        '/finance',
        '/games'
      ],
      githubPages: {
        subdirectory: 'finclamp',
        customDomain: false,
        spa: true
      },
      build: {
        framework: 'vite',
        nodeVersion: '18',
        dependencies: ['react', 'vite', 'tailwindcss'],
        envVars: {
          VITE_APP_NAME: 'FinClamp',
          VITE_BASE_URL: '/OrgRJ/finclamp',
          VITE_API_URL: 'https://orgrj.github.io/OrgRJ/api'
        }
      }
    },
    arcade: {
      name: 'Arcade',
      description: 'Retro games collection',
      sourceDir: 'apps/arcade',
      buildCommand: 'npm run build',
      outputPath: 'dist/arcade',
      routes: [
        '/arcade',
        '/retro-games'
      ],
      githubPages: {
        subdirectory: 'arcade',
        customDomain: false,
        spa: true
      },
      build: {
        framework: 'vite',
        nodeVersion: '18',
        dependencies: ['react', 'vite'],
        envVars: {
          VITE_APP_NAME: 'Arcade',
          VITE_BASE_URL: '/OrgRJ/arcade'
        }
      }
    },
    engaged: {
      name: 'Engaged',
      description: 'Wedding planning application',
      sourceDir: 'apps/engaged',
      buildCommand: 'npm run build',
      outputPath: 'dist/engaged',
      routes: [
        '/engaged',
        '/wedding',
        '/planning'
      ],
      githubPages: {
        subdirectory: 'engaged',
        customDomain: false,
        spa: true
      },
      build: {
        framework: 'vite',
        nodeVersion: '18',
        dependencies: ['react', 'vite'],
        envVars: {
          VITE_APP_NAME: 'Engaged',
          VITE_BASE_URL: '/OrgRJ/engaged'
        }
      }
    },
    skips: {
      name: 'Skips',
      description: 'Fitness tracking application',
      sourceDir: 'apps/skips',
      buildCommand: 'npm run build',
      outputPath: 'dist/skips',
      routes: [
        '/skips',
        '/fitness',
        '/tracker'
      ],
      githubPages: {
        subdirectory: 'skips',
        customDomain: false,
        spa: true
      },
      build: {
        framework: 'vite',
        nodeVersion: '18',
        dependencies: ['react', 'vite'],
        envVars: {
          VITE_APP_NAME: 'Skips',
          VITE_BASE_URL: '/OrgRJ/skips'
        }
      }
    }
  },

  // Build environments
  environments: {
    development: {
      baseUrl: 'http://localhost:3000',
      apiUrl: 'http://localhost:8000',
      debug: true,
      sourceMaps: true
    },
    staging: {
      baseUrl: 'https://orgrj-staging.github.io/OrgRJ',
      apiUrl: 'https://orgrj-staging.github.io/OrgRJ/api',
      debug: false,
      sourceMaps: true
    },
    production: {
      baseUrl: 'https://orgrj.github.io/OrgRJ',
      apiUrl: 'https://orgrj.github.io/OrgRJ/api',
      debug: false,
      sourceMaps: false,
      optimization: {
        minify: true,
        treeshake: true,
        compression: 'gzip'
      }
    }
  },

  // GitHub Pages specific settings
  githubPages: {
    // SPA routing support
    spa: {
      enabled: true,
      fallback: 'index.html',
      generate404: true
    },
    
    // Asset optimization
    assets: {
      publicPath: '/OrgRJ/',
      cdnUrl: null,
      optimization: {
        images: true,
        fonts: true,
        css: true,
        js: true
      }
    },

    // Deployment settings
    deployment: {
      branch: 'gh-pages',
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
    }
  },

  // Build scripts and commands
  scripts: {
    // Individual app builds
    buildApp: 'node scripts/build-app.js',
    buildAll: 'node scripts/build-all.js',
    
    // Deployment
    deploy: 'node scripts/deploy.js',
    deployApp: 'node scripts/deploy-app.js',
    
    // Development
    dev: 'node scripts/dev.js',
    preview: 'node scripts/preview.js',
    
    // Utilities
    clean: 'node scripts/clean.js',
    validate: 'node scripts/validate.js'
  }
};

/**
 * Get build configuration for a specific app
 */
export function getAppConfig(appName, environment = 'production') {
  const app = BUILD_CONFIG.apps[appName];
  const env = BUILD_CONFIG.environments[environment];
  
  if (!app) {
    throw new Error(`App "${appName}" not found in build configuration`);
  }
  
  return {
    ...app,
    environment: env,
    global: BUILD_CONFIG.global,
    githubPages: {
      ...BUILD_CONFIG.githubPages,
      ...app.githubPages
    }
  };
}

/**
 * Get all app names
 */
export function getAllApps() {
  return Object.keys(BUILD_CONFIG.apps);
}

/**
 * Get GitHub Pages deployment configuration
 */
export function getDeploymentConfig(environment = 'production') {
  const env = BUILD_CONFIG.environments[environment];
  
  return {
    ...BUILD_CONFIG.githubPages,
    environment: env,
    global: BUILD_CONFIG.global
  };
}

export default BUILD_CONFIG;
