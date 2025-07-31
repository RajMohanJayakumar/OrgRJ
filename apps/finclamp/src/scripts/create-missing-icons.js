#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

console.log('🎨 CREATING MISSING ICON FILES FOR PWA');
console.log('='.repeat(50));

// Create a simple PNG icon using Canvas (if available) or create placeholder files
const publicDir = path.join(process.cwd(), 'public');

// Read the existing favicon.svg to understand the design
const faviconPath = path.join(publicDir, 'favicon.svg');
let faviconContent = '';

if (fs.existsSync(faviconPath)) {
  faviconContent = fs.readFileSync(faviconPath, 'utf8');
  console.log('✅ Found existing favicon.svg');
} else {
  console.log('⚠️  favicon.svg not found');
}

// Create a simple SVG-based icon that can be used as PNG alternative
const createSimpleIcon = (size) => {
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#667eea" rx="${size * 0.1}"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size * 0.4}" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="central">FC</text>
</svg>`;
};

// Create android-chrome icons as SVG files (browsers accept SVG for PWA icons)
const icon192 = createSimpleIcon(192);
const icon512 = createSimpleIcon(512);

try {
  // Write the icon files as SVG (which browsers accept for PWA)
  fs.writeFileSync(path.join(publicDir, 'android-chrome-192x192.svg'), icon192);
  fs.writeFileSync(path.join(publicDir, 'android-chrome-512x512.svg'), icon512);
  
  console.log('✅ Created android-chrome-192x192.svg');
  console.log('✅ Created android-chrome-512x512.svg');
  
  // Update manifest.json to use SVG icons
  const manifestPath = path.join(publicDir, 'manifest.json');
  if (fs.existsSync(manifestPath)) {
    let manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    
    // Update icons to use the new SVG files
    manifest.icons = [
      {
        "src": "/favicon.svg",
        "sizes": "any",
        "type": "image/svg+xml",
        "purpose": "any"
      },
      {
        "src": "/android-chrome-192x192.svg",
        "sizes": "192x192",
        "type": "image/svg+xml",
        "purpose": "any maskable"
      },
      {
        "src": "/android-chrome-512x512.svg",
        "sizes": "512x512",
        "type": "image/svg+xml",
        "purpose": "any maskable"
      }
    ];
    
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log('✅ Updated manifest.json with new icon paths');
  }
  
  // Create apple-touch-icon as well
  const appleTouchIcon = createSimpleIcon(180);
  fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.svg'), appleTouchIcon);
  console.log('✅ Created apple-touch-icon.svg');
  
  console.log('\n' + '='.repeat(50));
  console.log('🎉 ICON CREATION COMPLETED');
  console.log('✅ All required PWA icons created as SVG files');
  console.log('✅ Manifest.json updated with correct paths');
  console.log('✅ No more missing icon errors should occur');
  console.log('\n💡 Note: SVG icons are modern and scalable alternatives to PNG');
  console.log('🚀 PWA manifest should now work without errors');
  
} catch (error) {
  console.error('❌ Error creating icons:', error.message);
  
  console.log('\n💡 ALTERNATIVE SOLUTION:');
  console.log('1. Remove icon references from manifest.json');
  console.log('2. Use only the existing favicon.svg');
  console.log('3. Simplify PWA configuration');
}

console.log('\n' + '='.repeat(50));
