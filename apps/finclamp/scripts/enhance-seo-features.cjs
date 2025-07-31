#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read SEO file to analyze current configurations
const seoFilePath = path.join(__dirname, '../src/utils/seo.js');
const seoContent = fs.readFileSync(seoFilePath, 'utf8');

// Extract all calculator configurations
const calculatorConfigs = {};
const configMatches = seoContent.match(/["']([a-z-]+)["']:\s*{[^}]+}/g);

console.log('🔍 SEO Enhancement Analysis\n');

// Check for missing SEO features
const requiredFeatures = [
  'title',
  'description', 
  'keywords',
  'canonical',
  'structuredData'
];

const advancedFeatures = [
  'applicationCategory',
  'featureList',
  'applicationSubCategory'
];

let totalCalculators = 0;
let missingBasicFeatures = [];
let missingAdvancedFeatures = [];

// Parse each calculator configuration
const calculatorBlocks = seoContent.split(/(?=\s*["'][a-z-]+["']:\s*{)/);

calculatorBlocks.forEach(block => {
  const idMatch = block.match(/["']([a-z-]+)["']:\s*{/);
  if (!idMatch) return;
  
  const calculatorId = idMatch[1];
  if (calculatorId === 'calculatorSEOData' || calculatorId === 'defaultSEOData') return;
  
  totalCalculators++;
  
  // Check for basic features
  const missingBasic = requiredFeatures.filter(feature => !block.includes(feature));
  if (missingBasic.length > 0) {
    missingBasicFeatures.push({ id: calculatorId, missing: missingBasic });
  }
  
  // Check for advanced features
  const missingAdvanced = advancedFeatures.filter(feature => !block.includes(feature));
  if (missingAdvanced.length > 0) {
    missingAdvancedFeatures.push({ id: calculatorId, missing: missingAdvanced });
  }
});

console.log(`📊 Total Calculators Analyzed: ${totalCalculators}`);
console.log(`✅ Basic SEO Complete: ${totalCalculators - missingBasicFeatures.length}`);
console.log(`🚀 Advanced SEO Complete: ${totalCalculators - missingAdvancedFeatures.length}`);

if (missingBasicFeatures.length > 0) {
  console.log('\n❌ Calculators Missing Basic SEO Features:');
  missingBasicFeatures.forEach(calc => {
    console.log(`   - ${calc.id}: Missing ${calc.missing.join(', ')}`);
  });
} else {
  console.log('\n✅ All calculators have complete basic SEO features!');
}

if (missingAdvancedFeatures.length > 0) {
  console.log('\n⚠️  Calculators Missing Advanced SEO Features:');
  missingAdvancedFeatures.forEach(calc => {
    console.log(`   - ${calc.id}: Missing ${calc.missing.join(', ')}`);
  });
} else {
  console.log('\n🚀 All calculators have complete advanced SEO features!');
}

// Check for SEO best practices
console.log('\n🎯 SEO Best Practices Check:');

// Check title length (should be 50-60 characters)
const titleIssues = [];
const descriptionIssues = [];
const keywordIssues = [];

calculatorBlocks.forEach(block => {
  const idMatch = block.match(/["']([a-z-]+)["']:\s*{/);
  if (!idMatch) return;
  
  const calculatorId = idMatch[1];
  if (calculatorId === 'calculatorSEOData' || calculatorId === 'defaultSEOData') return;
  
  // Check title length
  const titleMatch = block.match(/title:\s*["']([^"']+)["']/);
  if (titleMatch) {
    const title = titleMatch[1];
    if (title.length < 30 || title.length > 60) {
      titleIssues.push({ id: calculatorId, length: title.length, title });
    }
  }
  
  // Check description length (should be 150-160 characters)
  const descMatch = block.match(/description:\s*["']([^"']+)["']/);
  if (descMatch) {
    const desc = descMatch[1];
    if (desc.length < 120 || desc.length > 160) {
      descriptionIssues.push({ id: calculatorId, length: desc.length, desc });
    }
  }
  
  // Check keywords (should have 3-5 relevant keywords)
  const keywordMatch = block.match(/keywords:\s*["']([^"']+)["']/);
  if (keywordMatch) {
    const keywords = keywordMatch[1].split(',').map(k => k.trim());
    if (keywords.length < 3 || keywords.length > 8) {
      keywordIssues.push({ id: calculatorId, count: keywords.length, keywords });
    }
  }
});

if (titleIssues.length > 0) {
  console.log('\n📝 Title Length Issues (should be 30-60 chars):');
  titleIssues.forEach(issue => {
    console.log(`   - ${issue.id}: ${issue.length} chars - "${issue.title.substring(0, 50)}..."`);
  });
} else {
  console.log('\n✅ All titles are optimal length!');
}

if (descriptionIssues.length > 0) {
  console.log('\n📄 Description Length Issues (should be 120-160 chars):');
  descriptionIssues.forEach(issue => {
    console.log(`   - ${issue.id}: ${issue.length} chars`);
  });
} else {
  console.log('\n✅ All descriptions are optimal length!');
}

if (keywordIssues.length > 0) {
  console.log('\n🔑 Keyword Count Issues (should be 3-8 keywords):');
  keywordIssues.forEach(issue => {
    console.log(`   - ${issue.id}: ${issue.count} keywords`);
  });
} else {
  console.log('\n✅ All keyword counts are optimal!');
}

// Summary
console.log('\n📈 SEO Enhancement Summary:');
console.log(`✅ Calculators with Perfect SEO: ${totalCalculators - missingBasicFeatures.length - missingAdvancedFeatures.length - titleIssues.length - descriptionIssues.length - keywordIssues.length}`);
console.log(`🔧 Calculators Needing Enhancement: ${missingBasicFeatures.length + missingAdvancedFeatures.length + titleIssues.length + descriptionIssues.length + keywordIssues.length}`);

if (missingBasicFeatures.length === 0 && missingAdvancedFeatures.length === 0 && 
    titleIssues.length === 0 && descriptionIssues.length === 0 && keywordIssues.length === 0) {
  console.log('\n🎉 PERFECT! All calculators have comprehensive, optimized SEO configuration!');
} else {
  console.log('\n🔧 Some calculators could benefit from SEO enhancements.');
}
