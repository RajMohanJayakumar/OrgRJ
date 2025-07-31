#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

// List of calculators that need height fixes
const CALCULATORS_TO_FIX = [
  'BillSplitCalculator.jsx',
  'RDCalculator.jsx', 
  'EMICalculator.jsx',
  'SIPCalculator.jsx',
  'FDCalculator.jsx',
  'TipCalculator.jsx',
  'CompoundInterestCalculator.jsx',
  'TaxCalculator.jsx',
  'PPFCalculator.jsx',
  'EPFCalculator.jsx',
  'SimpleInterestCalculator.jsx',
  'DiscountCalculator.jsx',
  'CAGRCalculator.jsx',
  'DailyInterestCalculator.jsx',
  'PropertyTaxCalculator.jsx',
  'PropertyValuationCalculator.jsx',
  'RealEstateCalculator.jsx',
  'RentVsBuyCalculator.jsx',
  'InflationCalculator.jsx',
  'SavingsGoalCalculator.jsx',
  'NPSCalculator.jsx',
  'SWPCalculator.jsx',
  'GratuityCalculator.jsx'
];

const calculatorsDir = path.join(process.cwd(), 'src', 'calculators');

console.log('🔧 FIXING NUMBERINPUT HEIGHTS');
console.log('='.repeat(50));

let fixedCount = 0;
let totalReplacements = 0;

CALCULATORS_TO_FIX.forEach(calculatorFile => {
  const filePath = path.join(calculatorsDir, calculatorFile);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  ${calculatorFile} - File not found`);
    return;
  }

  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let replacements = 0;

    // Replace the old large height styling with smaller height
    const oldPattern = /py-3 sm:py-4 text-base sm:text-lg font-semibold/g;
    const newPattern = 'py-2 text-sm font-medium';
    
    const matches = content.match(oldPattern);
    if (matches) {
      content = content.replace(oldPattern, newPattern);
      replacements = matches.length;
      totalReplacements += replacements;
      
      fs.writeFileSync(filePath, content, 'utf8');
      fixedCount++;
      console.log(`✅ ${calculatorFile} - Fixed ${replacements} NumberInput height(s)`);
    } else {
      console.log(`✓  ${calculatorFile} - Already using correct height`);
    }

  } catch (error) {
    console.log(`❌ ${calculatorFile} - Error: ${error.message}`);
  }
});

console.log('\n' + '='.repeat(50));
console.log(`🎉 COMPLETED: Fixed ${totalReplacements} NumberInput heights across ${fixedCount} calculators`);
console.log('✨ All NumberInput components now use consistent smaller height (py-2 text-sm)');
console.log('📏 Input boxes are now properly sized relative to titles');
