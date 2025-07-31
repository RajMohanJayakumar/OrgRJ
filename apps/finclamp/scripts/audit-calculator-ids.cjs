#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read App.jsx to extract calculator IDs
const appFilePath = path.join(__dirname, '../src/App.jsx');
const appContent = fs.readFileSync(appFilePath, 'utf8');

// Extract calculator IDs from App.jsx
const appCalculatorIds = [];
const appMatches = appContent.match(/{\s*id:\s*['"]([^'"]+)['"]/g);
if (appMatches) {
  appMatches.forEach(match => {
    const id = match.match(/id:\s*['"]([^'"]+)['"]/)[1];
    appCalculatorIds.push(id);
  });
}

// Read SEO file to get existing configurations
const seoFilePath = path.join(__dirname, '../src/utils/seo.js');
const seoContent = fs.readFileSync(seoFilePath, 'utf8');

// Extract calculator IDs from SEO data
const seoCalculatorIds = [];
const seoMatches = seoContent.match(/^\s*["']?([a-z-]+)["']?\s*:\s*{/gm);
if (seoMatches) {
  seoMatches.forEach(match => {
    const id = match.match(/["']?([a-z-]+)["']?\s*:/)[1];
    if (id !== 'calculatorSEOData' && id !== 'defaultSEOData' && 
        id !== 'offers' && id !== 'publisher' && id !== 'logo' && 
        id !== 'creator' && id !== 'author') {
      seoCalculatorIds.push(id);
    }
  });
}

console.log('🔍 Calculator ID Audit\n');

// Find calculators in App.jsx but not in SEO
const missingInSEO = appCalculatorIds.filter(id => !seoCalculatorIds.includes(id));

// Find calculators in SEO but not in App.jsx
const missingInApp = seoCalculatorIds.filter(id => !appCalculatorIds.includes(id));

console.log(`📱 App.jsx Calculator IDs (${appCalculatorIds.length}):`);
appCalculatorIds.forEach(id => {
  const hasSeO = seoCalculatorIds.includes(id);
  const status = hasSeO ? '✅' : '❌';
  console.log(`   ${status} ${id}`);
});

console.log(`\n🔧 SEO Calculator IDs (${seoCalculatorIds.length}):`);
seoCalculatorIds.forEach(id => {
  const hasApp = appCalculatorIds.includes(id);
  const status = hasApp ? '✅' : '❌';
  console.log(`   ${status} ${id}`);
});

if (missingInSEO.length > 0) {
  console.log('\n❌ Calculator IDs in App.jsx but MISSING in SEO:');
  missingInSEO.forEach(id => {
    console.log(`   - ${id}`);
  });
}

if (missingInApp.length > 0) {
  console.log('\n⚠️  Calculator IDs in SEO but NOT USED in App.jsx:');
  missingInApp.forEach(id => {
    console.log(`   - ${id}`);
  });
}

if (missingInSEO.length === 0 && missingInApp.length === 0) {
  console.log('\n✅ Perfect match! All calculator IDs are consistent between App.jsx and SEO configuration.');
} else {
  console.log('\n🔧 Action needed to fix mismatches.');
}

// Check for potential ID mapping issues
console.log('\n🔍 Potential ID Mapping Issues:');
const potentialMappings = [
  { app: 'tip-calculator', seo: 'tip' },
  { app: 'subscription-tracker', seo: 'subscription' }
];

potentialMappings.forEach(mapping => {
  const appHas = appCalculatorIds.includes(mapping.app);
  const seoHas = seoCalculatorIds.includes(mapping.seo);
  if (appHas && seoHas) {
    console.log(`   ⚠️  ${mapping.app} (App) ↔ ${mapping.seo} (SEO) - Potential mismatch`);
  }
});
