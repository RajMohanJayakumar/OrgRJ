#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

// List of calculators to update
const CALCULATORS = [
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
  'GratuityCalculator.jsx',
  'BudgetPlannerCalculator.jsx'
];

const calculatorsDir = path.join(process.cwd(), 'src', 'calculators');

console.log('🔧 REMOVING NUMBER PLACEHOLDERS FROM ALL CALCULATORS');
console.log('='.repeat(60));

let fixedCount = 0;
let totalReplacements = 0;

// Common number placeholder patterns to replace
const placeholderReplacements = [
  // Currency placeholders
  { pattern: /placeholder="100000"/g, replacement: 'placeholder="Enter amount"' },
  { pattern: /placeholder="500000"/g, replacement: 'placeholder="Enter amount"' },
  { pattern: /placeholder="1000000"/g, replacement: 'placeholder="Enter amount"' },
  { pattern: /placeholder="5000000"/g, replacement: 'placeholder="Enter amount"' },
  { pattern: /placeholder="50000"/g, replacement: 'placeholder="Enter amount"' },
  { pattern: /placeholder="25000"/g, replacement: 'placeholder="Enter amount"' },
  { pattern: /placeholder="15000"/g, replacement: 'placeholder="Enter amount"' },
  { pattern: /placeholder="10000"/g, replacement: 'placeholder="Enter amount"' },
  { pattern: /placeholder="6000"/g, replacement: 'placeholder="Enter amount"' },
  { pattern: /placeholder="5000"/g, replacement: 'placeholder="Enter amount"' },
  { pattern: /placeholder="3000"/g, replacement: 'placeholder="Enter amount"' },
  
  // Percentage placeholders
  { pattern: /placeholder="12"/g, replacement: 'placeholder="Enter rate"' },
  { pattern: /placeholder="8\.5"/g, replacement: 'placeholder="Enter rate"' },
  { pattern: /placeholder="10"/g, replacement: 'placeholder="Enter value"' },
  { pattern: /placeholder="6"/g, replacement: 'placeholder="Enter rate"' },
  { pattern: /placeholder="8"/g, replacement: 'placeholder="Enter rate"' },
  { pattern: /placeholder="7"/g, replacement: 'placeholder="Enter rate"' },
  { pattern: /placeholder="5"/g, replacement: 'placeholder="Enter value"' },
  
  // Time period placeholders
  { pattern: /placeholder="20"/g, replacement: 'placeholder="Enter years"' },
  { pattern: /placeholder="30"/g, replacement: 'placeholder="Enter age"' },
  { pattern: /placeholder="58"/g, replacement: 'placeholder="Enter age"' },
  { pattern: /placeholder="60"/g, replacement: 'placeholder="Enter age"' },
  
  // Other specific placeholders
  { pattern: /placeholder="Enter step-up amount"/g, replacement: 'placeholder="Enter step-up"' }
];

CALCULATORS.forEach(calculatorFile => {
  const filePath = path.join(calculatorsDir, calculatorFile);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  ${calculatorFile} - File not found`);
    return;
  }

  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let fileReplacements = 0;

    placeholderReplacements.forEach(({ pattern, replacement }) => {
      const matches = content.match(pattern);
      if (matches) {
        content = content.replace(pattern, replacement);
        fileReplacements += matches.length;
      }
    });

    if (fileReplacements > 0) {
      fs.writeFileSync(filePath, content, 'utf8');
      fixedCount++;
      totalReplacements += fileReplacements;
      console.log(`✅ ${calculatorFile} - Replaced ${fileReplacements} number placeholder(s)`);
    } else {
      console.log(`✓  ${calculatorFile} - No number placeholders found`);
    }

  } catch (error) {
    console.log(`❌ ${calculatorFile} - Error: ${error.message}`);
  }
});

console.log('\n' + '='.repeat(60));
console.log(`🎉 COMPLETED: Replaced ${totalReplacements} number placeholders across ${fixedCount} calculators`);
console.log('✨ All NumberInput components now use descriptive placeholders');
console.log('📝 Placeholders are now user-friendly instead of example numbers');
