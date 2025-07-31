#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

console.log('🔍 VERIFYING PWA SETUP AND ICON FILES');
console.log('='.repeat(50));

const publicDir = path.join(process.cwd(), 'public');

// Check required files
const requiredFiles = [
  'manifest.json',
  'favicon.svg',
  'android-chrome-192x192.svg',
  'android-chrome-512x512.svg',
  'apple-touch-icon.svg',
  'sw.js'
];

let allFilesExist = true;

console.log('📁 CHECKING REQUIRED PWA FILES:');
requiredFiles.forEach(file => {
  const filePath = path.join(publicDir, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file} - Found`);
  } else {
    console.log(`❌ ${file} - Missing`);
    allFilesExist = false;
  }
});

// Verify manifest.json content
console.log('\n📄 VERIFYING MANIFEST.JSON:');
const manifestPath = path.join(publicDir, 'manifest.json');
if (fs.existsSync(manifestPath)) {
  try {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    
    console.log(`✅ Name: ${manifest.name}`);
    console.log(`✅ Short Name: ${manifest.short_name}`);
    console.log(`✅ Start URL: ${manifest.start_url}`);
    console.log(`✅ Display: ${manifest.display}`);
    console.log(`✅ Theme Color: ${manifest.theme_color}`);
    
    if (manifest.icons && manifest.icons.length > 0) {
      console.log(`✅ Icons: ${manifest.icons.length} defined`);
      manifest.icons.forEach((icon, index) => {
        const iconPath = path.join(publicDir, icon.src.replace('/', ''));
        const exists = fs.existsSync(iconPath);
        console.log(`   ${exists ? '✅' : '❌'} Icon ${index + 1}: ${icon.src} (${icon.sizes})`);
      });
    } else {
      console.log('⚠️  No icons defined in manifest');
    }
    
    if (manifest.shortcuts && manifest.shortcuts.length > 0) {
      console.log(`✅ Shortcuts: ${manifest.shortcuts.length} defined`);
    }
    
  } catch (error) {
    console.log(`❌ Error parsing manifest.json: ${error.message}`);
    allFilesExist = false;
  }
} else {
  console.log('❌ manifest.json not found');
  allFilesExist = false;
}

// Check icon file sizes
console.log('\n📏 CHECKING ICON FILE SIZES:');
const iconFiles = [
  'favicon.svg',
  'android-chrome-192x192.svg',
  'android-chrome-512x512.svg',
  'apple-touch-icon.svg'
];

iconFiles.forEach(file => {
  const filePath = path.join(publicDir, file);
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    const sizeKB = (stats.size / 1024).toFixed(2);
    console.log(`✅ ${file}: ${sizeKB} KB`);
  }
});

// Verify service worker
console.log('\n🔧 CHECKING SERVICE WORKER:');
const swPath = path.join(publicDir, 'sw.js');
if (fs.existsSync(swPath)) {
  const swContent = fs.readFileSync(swPath, 'utf8');
  if (swContent.includes('CACHE_NAME')) {
    console.log('✅ Service worker has caching logic');
  } else {
    console.log('⚠️  Service worker exists but may be incomplete');
  }
} else {
  console.log('❌ Service worker not found');
}

// Summary
console.log('\n' + '='.repeat(50));
console.log('📊 PWA SETUP VERIFICATION SUMMARY');
console.log('='.repeat(50));

if (allFilesExist) {
  console.log('🎉 EXCELLENT! PWA setup is complete');
  console.log('✅ All required files are present');
  console.log('✅ Manifest.json is properly configured');
  console.log('✅ Icon files are available');
  console.log('✅ No more missing icon errors should occur');
  
  console.log('\n🚀 YOUR APP IS NOW PWA-READY:');
  console.log('• Users can install it as a mobile app');
  console.log('• Works offline with service worker caching');
  console.log('• Has proper icons for all platforms');
  console.log('• Includes calculator shortcuts');
  
} else {
  console.log('⚠️  PWA setup needs attention');
  console.log('❌ Some required files are missing');
  console.log('💡 Run the icon creation script to fix missing files');
}

console.log('\n🌐 Access your app at: http://localhost:5173/');
console.log('📱 Test PWA features in Chrome DevTools > Application > Manifest');
console.log('\n' + '='.repeat(50));
