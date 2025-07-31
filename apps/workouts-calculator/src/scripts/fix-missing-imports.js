#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

// List of calculators that need the useMobileResponsive import
const CALCULATORS_TO_FIX = [
  'CAGRCalculator.jsx',
  'CompoundInterestCalculator.jsx',
  'EPFCalculator.jsx',
  'FuelCostCalculator.jsx',
  'GratuityCalculator.jsx',
  'InflationCalculator.jsx',
  'PPFCalculator.jsx',
  'PropertyTaxCalculator.jsx',
  'PropertyValuationCalculator.jsx',
  'RealEstateCalculator.jsx',
  'RentVsBuyCalculator.jsx',
  'SimpleInterestCalculator.jsx',
  'StockAverageCalculator.jsx',
  'SWPCalculator.jsx',
  'CommuteCostCalculator.jsx',
  'DailyInterestCalculator.jsx',
  'DailySpendingCalculator.jsx',
  'GroceryBudgetCalculator.jsx',
  'HabitCostCalculator.jsx',
  'MonthlyExpenseCalculator.jsx',
  'NetWorthCalculator.jsx',
  'SavingsGoalCalculator.jsx',
  'SubscriptionCalculator.jsx',
  'TipCalculator.jsx',
  'WFHSavingsCalculator.jsx'
];

const calculatorsDir = path.join(process.cwd(), 'src', 'calculators');

console.log('🔧 FIXING MISSING useMobileResponsive IMPORTS');
console.log('='.repeat(50));

let fixedCount = 0;

// Function to add missing import and hook usage
function addMissingImport(content) {
  let fixed = false;

  // Check if responsive is used but useMobileResponsive is not imported
  if (content.includes('responsive.') && !content.includes('import useMobileResponsive')) {
    // Find a good place to add the import - after useViewMode import
    if (content.includes("import { useViewMode }")) {
      content = content.replace(
        /(import { useViewMode } from ['"][^'"]*['"])/,
        `$1\nimport useMobileResponsive from '../hooks/useMobileResponsive'`
      );
      fixed = true;
    }
    // If no useViewMode import, add after useCurrency import
    else if (content.includes("import { useCurrency }")) {
      content = content.replace(
        /(import { useCurrency } from ['"][^'"]*['"])/,
        `$1\nimport useMobileResponsive from '../hooks/useMobileResponsive'`
      );
      fixed = true;
    }
    // If neither, add after the last import
    else {
      const lines = content.split('\n');
      let lastImportIndex = -1;

      for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith('import ')) {
          lastImportIndex = i;
        }
      }

      if (lastImportIndex !== -1) {
        lines.splice(lastImportIndex + 1, 0, "import useMobileResponsive from '../hooks/useMobileResponsive'");
        content = lines.join('\n');
        fixed = true;
      }
    }
  }

  // Check if responsive is used but the hook is not called
  if (content.includes('responsive.') && !content.includes('const { responsive } = useMobileResponsive()')) {
    // Find the component function and add the hook after other hooks
    const componentMatch = content.match(/(const \w+Calculator = [^{]*{[^}]*)(const { [^}]* } = useCurrency\(\))/);
    if (componentMatch) {
      content = content.replace(
        /(const { [^}]* } = useCurrency\(\))/,
        `$1\n  const { responsive } = useMobileResponsive()`
      );
      fixed = true;
    }
    // If no useCurrency, try to find any hook and add after it
    else {
      const hookMatch = content.match(/(const { [^}]* } = use\w+\(\))/);
      if (hookMatch) {
        content = content.replace(
          hookMatch[0],
          `${hookMatch[0]}\n  const { responsive } = useMobileResponsive()`
        );
        fixed = true;
      }
    }
  }

  return { content, fixed };
}

// Process each calculator
CALCULATORS_TO_FIX.forEach(calculatorFile => {
  const filePath = path.join(calculatorsDir, calculatorFile);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${calculatorFile}`);
    return;
  }

  console.log(`\n📝 Fixing: ${calculatorFile}`);
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    const result = addMissingImport(content);
    
    if (result.fixed) {
      fs.writeFileSync(filePath, result.content, 'utf8');
      console.log(`   ✅ Added useMobileResponsive import`);
      fixedCount++;
    } else {
      console.log(`   ✓ Import already exists or not needed`);
    }

  } catch (error) {
    console.error(`   ❌ Error processing ${calculatorFile}:`, error.message);
  }
});

console.log('\n' + '='.repeat(50));
console.log(`🎉 MISSING IMPORTS FIX COMPLETE!`);
console.log(`📊 Fixed ${fixedCount} out of ${CALCULATORS_TO_FIX.length} calculators`);

if (fixedCount > 0) {
  console.log('\n✨ All missing useMobileResponsive imports have been added!');
  console.log('\n🚀 The application should now work without import errors.');
} else {
  console.log('\n✅ No missing imports found!');
}
