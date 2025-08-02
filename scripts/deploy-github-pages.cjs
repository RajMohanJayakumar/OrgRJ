#!/usr/bin/env node

/**
 * Deploy FinClamp to GitHub Pages
 * 
 * This script:
 * 1. Builds the FinClamp app with GitHub Pages base path
 * 2. Copies build assets to root directory
 * 3. Updates asset paths for GitHub Pages
 * 4. Does NOT commit build assets to git
 * 5. Build assets are only for deployment/testing
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT_DIR = path.join(__dirname, '..');
const FINCLAMP_DIR = path.join(ROOT_DIR, 'apps', 'finclamp');
const DIST_DIR = path.join(FINCLAMP_DIR, 'dist');

console.log('🚀 Starting FinClamp GitHub Pages Deployment...\n');

// Step 1: Clean previous build assets from root
console.log('🧹 Cleaning previous build assets from root...');
const buildAssets = [
  'assets',
  'index.html',
  'manifest.json',
  'sw.js',
  '404.html',
  'favicon-32x32.svg',
  'favicon-monochrome.svg',
  'favicon-tab.svg',
  'favicon.svg',
  'finclamp-icon.svg',
  'finclamp-logo-compact.svg',
  'finclamp-logo-monochrome.svg',
  'finclamp-logo.svg',
  'apple-touch-icon-monochrome.svg',
  'apple-touch-icon.svg',
  'android-chrome-192x192-monochrome.svg',
  'android-chrome-192x192.svg',
  'android-chrome-512x512-monochrome.svg',
  'android-chrome-512x512.svg',
  'og-image.svg',
  'twitter-card.svg',
  'robots.txt',
  'sitemap.xml',
  'sitemap-calculators-mobile.xml',
  'ads.txt',
  '_redirects'
];

buildAssets.forEach(asset => {
  const assetPath = path.join(ROOT_DIR, asset);
  if (fs.existsSync(assetPath)) {
    try {
      if (fs.statSync(assetPath).isDirectory()) {
        fs.rmSync(assetPath, { recursive: true, force: true });
      } else {
        fs.unlinkSync(assetPath);
      }
      console.log(`   ✅ Removed: ${asset}`);
    } catch (error) {
      console.log(`   ⚠️  Could not remove: ${asset}`);
    }
  }
});

// Step 2: Build FinClamp for GitHub Pages
console.log('\n📦 Building FinClamp for GitHub Pages...');
try {
  execSync('npm run build:github', { 
    cwd: FINCLAMP_DIR, 
    stdio: 'inherit' 
  });
  console.log('✅ Build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

// Step 3: Copy build assets to root
console.log('\n📋 Copying build assets to root...');
if (!fs.existsSync(DIST_DIR)) {
  console.error('❌ Dist directory not found. Build may have failed.');
  process.exit(1);
}

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    const files = fs.readdirSync(src);
    files.forEach(file => {
      copyRecursive(path.join(src, file), path.join(dest, file));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

try {
  const distFiles = fs.readdirSync(DIST_DIR);
  distFiles.forEach(file => {
    const srcPath = path.join(DIST_DIR, file);
    const destPath = path.join(ROOT_DIR, file);
    copyRecursive(srcPath, destPath);
  });
  console.log('✅ Assets copied successfully!');
} catch (error) {
  console.error('❌ Failed to copy assets:', error.message);
  process.exit(1);
}

// Step 4: Create SPA server for testing
console.log('\n🖥️  Creating SPA server for testing...');
const spaServerContent = `#!/usr/bin/env python3
import http.server
import socketserver
import os
import sys
from urllib.parse import urlparse

class SPAHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Parse the URL
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        # Remove leading slash and decode
        if path.startswith('/'):
            path = path[1:]
        
        # If it's a file request (has extension), serve it normally
        if '.' in path.split('/')[-1]:
            return super().do_GET()
        
        # For all other requests (SPA routes), serve index.html
        self.path = '/index.html'
        return super().do_GET()

if __name__ == "__main__":
    PORT = 8080
    
    with socketserver.TCPServer(("", PORT), SPAHandler) as httpd:
        print(f"SPA Server running at http://localhost:{PORT}")
        print("All SPA routes will be handled by index.html")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\\nServer stopped.")
            sys.exit(0)
`;

fs.writeFileSync(path.join(ROOT_DIR, 'spa_server.py'), spaServerContent);

console.log('\n🎉 GitHub Pages deployment completed successfully!');
console.log('\n📋 Next steps:');
console.log('   • Test locally: python3 spa_server.py');
console.log('   • Deploy to GitHub Pages: Push to main branch');
console.log('   • Build assets are NOT committed to git (as intended)');
console.log('\n⚠️  Note: Build assets in root are temporary and ignored by git');
