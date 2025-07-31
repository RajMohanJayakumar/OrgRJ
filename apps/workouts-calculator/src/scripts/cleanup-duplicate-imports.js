#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

// All calculators that might have duplicate imports
const ALL_CALCULATORS = [
  'RDCalculator.jsx',
  'GratuityCalculator.jsx', 
  'SIPCalculator.jsx',
  'PPFCalculator.jsx',
  'EPFCalculator.jsx',
  'EMICalculator.jsx',
  'SWPCalculator.jsx',
  'NPSCalculator.jsx',
  'SimpleInterestCalculator.jsx',
  'TaxCalculator.jsx',
  'InflationCalculator.jsx',
  'CAGRCalculator.jsx',
  'CompoundInterestCalculator.jsx',
  'FDCalculator.jsx'
];

const calculatorsDir = path.join(process.cwd(), 'src', 'calculators');

console.log('🧹 CLEANING UP DUPLICATE PDF EXPORT IMPORTS');
console.log('='.repeat(60));

let cleanedCount = 0;
let totalRemovals = 0;

ALL_CALCULATORS.forEach(calculatorFile => {
  const filePath = path.join(calculatorsDir, calculatorFile);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  ${calculatorFile} - File not found`);
    return;
  }

  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    let fileRemovals = 0;

    // Check if both imports exist
    const hasCommonPDFExport = content.includes('import CommonPDFExport');
    const hasPDFExport = content.includes("import PDFExport from '../components/PDFExport'");

    if (hasCommonPDFExport && hasPDFExport) {
      // Remove the old PDFExport import
      content = content.replace(/import PDFExport from '\.\.\/components\/PDFExport'\n/g, '');
      fileRemovals++;
      
      // Also remove any standalone PDFExport import lines
      content = content.replace(/^import PDFExport from '\.\.\/components\/PDFExport'$/gm, '');
      
      // Clean up any extra empty lines that might be left
      content = content.replace(/\n\n\n+/g, '\n\n');
    }

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      cleanedCount++;
      totalRemovals += fileRemovals;
      console.log(`✅ ${calculatorFile} - Removed ${fileRemovals} duplicate import(s)`);
    } else {
      console.log(`✓  ${calculatorFile} - No duplicate imports found`);
    }

  } catch (error) {
    console.log(`❌ ${calculatorFile} - Error: ${error.message}`);
  }
});

console.log('\n' + '='.repeat(60));
console.log(`🎉 COMPLETED: Cleaned ${cleanedCount} calculators, removed ${totalRemovals} duplicate imports`);
console.log('✨ All calculators now have clean, single CommonPDFExport imports');
console.log('🧹 Codebase is now standardized and optimized');
