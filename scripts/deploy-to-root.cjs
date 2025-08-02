#!/usr/bin/env node

/**
 * Deploy FinClamp to Root Directory
 * 
 * This script:
 * 1. Builds the FinClamp app
 * 2. Copies build assets to root directory
 * 3. Does NOT commit build assets to git
 * 4. Build assets are only for deployment/testing
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT_DIR = path.join(__dirname, '..');
const FINCLAMP_DIR = path.join(ROOT_DIR, 'apps', 'finclamp');
const DIST_DIR = path.join(FINCLAMP_DIR, 'dist');

console.log('🚀 Starting FinClamp Root Deployment...\n');

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

// Step 2: Build FinClamp
console.log('\n📦 Building FinClamp...');
try {
  execSync('npm run build', { 
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
try {
  execSync(`cp -r ${DIST_DIR}/* ${ROOT_DIR}/`, { stdio: 'inherit' });
  console.log('✅ Assets copied successfully!');
} catch (error) {
  console.error('❌ Copy failed:', error.message);
  process.exit(1);
}

// Step 4: Create SPA server for testing
console.log('\n🖥️  Creating SPA server for testing...');
const spaServerContent = `#!/usr/bin/env python3
import http.server
import socketserver
import os
import mimetypes
from urllib.parse import urlparse

class SPAHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        if path.startswith('/'):
            path = path[1:]
        
        if not path:
            path = 'index.html'
        
        if os.path.exists(path) and os.path.isfile(path):
            return super().do_GET()
        
        if '.' in os.path.basename(path):
            self.send_error(404, "File not found")
            return
        
        self.path = '/index.html'
        return super().do_GET()

PORT = 8080
Handler = SPAHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"SPA Server running at http://localhost:{PORT}")
    print("All SPA routes will be handled by index.html")
    httpd.serve_forever()`;

fs.writeFileSync(path.join(ROOT_DIR, 'spa_server.py'), spaServerContent);

console.log('\n🎉 Deployment completed successfully!');
console.log('\n📋 Next steps:');
console.log('   • Test locally: python3 spa_server.py');
console.log('   • Deploy to hosting: Upload all files to your web server');
console.log('   • Build assets are NOT committed to git (as intended)');
console.log('\n⚠️  Note: Build assets in root are temporary and ignored by git');
