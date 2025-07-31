#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const calculatorsDir = path.join(process.cwd(), 'src', 'calculators');

console.log('🔍 VERIFYING ALL PDF EXPORTS');
console.log('='.repeat(60));

// Get all calculator files
const calculatorFiles = fs.readdirSync(calculatorsDir)
  .filter(file => file.endsWith('Calculator.jsx'))
  .sort();

let totalCalculators = 0;
let calculatorsWithPDF = 0;
let calculatorsWithComprehensivePDF = 0;
let calculatorsWithPlaceholders = 0;
let calculatorsWithoutPDF = 0;

const issues = [];
const comprehensive = [];
const placeholders = [];
const missing = [];

calculatorFiles.forEach(calculatorFile => {
  const filePath = path.join(calculatorsDir, calculatorFile);
  totalCalculators++;
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check if calculator has PDF export
    if (content.includes('CommonPDFExport') || content.includes('PDFExport')) {
      calculatorsWithPDF++;
      
      // Check for placeholder data
      if (content.includes('Add relevant input fields here') || 
          content.includes('Add relevant result fields here') ||
          content.includes('"See calculator for details"')) {
        calculatorsWithPlaceholders++;
        placeholders.push(calculatorFile);
        console.log(`⚠️  ${calculatorFile} - Has PDF but contains placeholder data`);
      } else {
        calculatorsWithComprehensivePDF++;
        comprehensive.push(calculatorFile);
        console.log(`✅ ${calculatorFile} - Has comprehensive PDF export`);
      }
    } else {
      calculatorsWithoutPDF++;
      missing.push(calculatorFile);
      console.log(`❌ ${calculatorFile} - Missing PDF export completely`);
    }
    
  } catch (error) {
    issues.push(`${calculatorFile} - Error reading file: ${error.message}`);
    console.log(`💥 ${calculatorFile} - Error: ${error.message}`);
  }
});

console.log('\n' + '='.repeat(60));
console.log('📊 PDF EXPORT VERIFICATION SUMMARY');
console.log('='.repeat(60));

console.log(`📁 Total Calculators: ${totalCalculators}`);
console.log(`✅ With PDF Export: ${calculatorsWithPDF} (${((calculatorsWithPDF/totalCalculators)*100).toFixed(1)}%)`);
console.log(`🎯 Comprehensive PDF: ${calculatorsWithComprehensivePDF} (${((calculatorsWithComprehensivePDF/totalCalculators)*100).toFixed(1)}%)`);
console.log(`⚠️  With Placeholders: ${calculatorsWithPlaceholders} (${((calculatorsWithPlaceholders/totalCalculators)*100).toFixed(1)}%)`);
console.log(`❌ Missing PDF: ${calculatorsWithoutPDF} (${((calculatorsWithoutPDF/totalCalculators)*100).toFixed(1)}%)`);

if (comprehensive.length > 0) {
  console.log('\n✅ CALCULATORS WITH COMPREHENSIVE PDF EXPORTS:');
  comprehensive.forEach(calc => console.log(`   • ${calc}`));
}

if (placeholders.length > 0) {
  console.log('\n⚠️  CALCULATORS WITH PLACEHOLDER DATA:');
  placeholders.forEach(calc => console.log(`   • ${calc}`));
}

if (missing.length > 0) {
  console.log('\n❌ CALCULATORS MISSING PDF EXPORTS:');
  missing.forEach(calc => console.log(`   • ${calc}`));
}

if (issues.length > 0) {
  console.log('\n💥 CALCULATORS WITH ISSUES:');
  issues.forEach(issue => console.log(`   • ${issue}`));
}

// Generate recommendations
console.log('\n' + '='.repeat(60));
console.log('💡 RECOMMENDATIONS');
console.log('='.repeat(60));

if (calculatorsWithComprehensivePDF === totalCalculators) {
  console.log('🎉 PERFECT! All calculators have comprehensive PDF exports!');
  console.log('📄 All PDFs will show detailed, meaningful data to users');
  console.log('✨ PDF export system is fully optimized');
} else {
  if (placeholders.length > 0) {
    console.log(`⚠️  ${placeholders.length} calculators still have placeholder data`);
    console.log('   → Run the comprehensive PDF fix script to populate them');
  }
  
  if (missing.length > 0) {
    console.log(`❌ ${missing.length} calculators are missing PDF exports entirely`);
    console.log('   → Add CommonPDFExport components to these calculators');
  }
  
  console.log('\n🔧 NEXT STEPS:');
  console.log('1. Fix placeholder data in calculators listed above');
  console.log('2. Add PDF exports to missing calculators');
  console.log('3. Test PDF generation for all calculators');
  console.log('4. Verify PDF content shows meaningful data');
}

// Create a summary report
const reportData = {
  timestamp: new Date().toISOString(),
  summary: {
    totalCalculators,
    calculatorsWithPDF,
    calculatorsWithComprehensivePDF,
    calculatorsWithPlaceholders,
    calculatorsWithoutPDF,
    completionPercentage: ((calculatorsWithComprehensivePDF/totalCalculators)*100).toFixed(1)
  },
  comprehensive,
  placeholders,
  missing,
  issues
};

const reportPath = path.join(process.cwd(), 'pdf-export-verification-report.json');
fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2), 'utf8');

console.log(`\n📋 Detailed report saved to: pdf-export-verification-report.json`);
console.log('\n' + '='.repeat(60));

// Exit with appropriate code
if (calculatorsWithComprehensivePDF === totalCalculators) {
  console.log('🎯 SUCCESS: All PDF exports are comprehensive and ready!');
  process.exit(0);
} else {
  console.log('⚠️  ATTENTION: Some PDF exports need improvement');
  process.exit(1);
}
