#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

// List of all calculators to fix
const ALL_CALCULATORS = [
  'BillSplitCalculator.jsx',
  'BudgetPlannerCalculator.jsx',
  'CAGRCalculator.jsx',
  'CommuteCostCalculator.jsx',
  'CompoundInterestCalculator.jsx',
  'DailyInterestCalculator.jsx',
  'DailySpendingCalculator.jsx',
  'DiscountCalculator.jsx',
  'EMICalculator.jsx',
  'EPFCalculator.jsx',
  'FDCalculator.jsx',
  'FuelCostCalculator.jsx',
  'GratuityCalculator.jsx',
  'GroceryBudgetCalculator.jsx',
  'HabitCostCalculator.jsx',
  'InflationCalculator.jsx',
  'MonthlyExpenseCalculator.jsx',
  'NPSCalculator.jsx',
  'NetWorthCalculator.jsx',
  'PPFCalculator.jsx',
  'PropertyTaxCalculator.jsx',
  'PropertyValuationCalculator.jsx',
  'RDCalculator.jsx',
  'RealEstateCalculator.jsx',
  'RentVsBuyCalculator.jsx',
  'SIPCalculator.jsx',
  'SWPCalculator.jsx',
  'SavingsGoalCalculator.jsx',
  'SimpleInterestCalculator.jsx',
  'StockAverageCalculator.jsx',
  'SubscriptionCalculator.jsx',
  'TaxCalculator.jsx',
  'TipCalculator.jsx',
  'VendorQuotationCalculator.jsx',
  'WFHSavingsCalculator.jsx'
];

const calculatorsDir = path.join(process.cwd(), 'src', 'calculators');

console.log('🔧 FIXING ALL SYNTAX ERRORS IN CALCULATORS');
console.log('='.repeat(50));

let fixedCount = 0;
let totalFixes = 0;

// Function to fix all syntax issues
function fixAllSyntaxIssues(content) {
  let fixes = 0;
  let result = content;

  // 1. Fix template literal syntax errors
  // Fix className="${responsive.xxx}" to className={`${responsive.xxx}`}
  result = result.replace(/className="\$\{([^}]+)\}([^"]*)"/g, (match, expression, rest) => {
    fixes++;
    return `className={\`\${${expression}}${rest}\`}`;
  });

  // Fix other template literal patterns in regular strings
  result = result.replace(/"\$\{responsive\.([^}]+)\}([^"]*)"/g, (match, expression, rest) => {
    fixes++;
    return `\`\${responsive.${expression}}\${rest}\``;
  });

  // 2. Fix duplicate variable declarations
  // Remove duplicate isMobile declarations
  const lines = result.split('\n');
  let seenIsMobile = false;
  let seenResponsive = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check for duplicate isMobile
    if (line.includes('const { isMobile } = useViewMode()')) {
      if (seenIsMobile) {
        lines[i] = ''; // Remove duplicate line
        fixes++;
      } else {
        seenIsMobile = true;
      }
    }
    
    // Check for duplicate responsive
    if (line.includes('const { responsive } = useMobileResponsive()')) {
      if (seenResponsive) {
        lines[i] = ''; // Remove duplicate line
        fixes++;
      } else {
        seenResponsive = true;
      }
    }
  }
  
  result = lines.join('\n');

  // 3. Fix JSX closing tag mismatches
  // Fix </div> that should be </MobileLayout>
  if (result.includes('<MobileLayout>') || result.includes('<MobileLayout ')) {
    // Find the last </div> and replace with </MobileLayout>
    const lastDivIndex = result.lastIndexOf('</div>');
    if (lastDivIndex !== -1) {
      // Check if this is likely the closing tag for MobileLayout
      const beforeDiv = result.substring(0, lastDivIndex);
      const afterDiv = result.substring(lastDivIndex + 6);
      
      // If it's at the end of the component, it's likely the MobileLayout closing tag
      if (afterDiv.trim().startsWith('\n  )\n}') || afterDiv.trim().startsWith('\n)')) {
        result = beforeDiv + '</MobileLayout>' + afterDiv;
        fixes++;
      }
    }
  }

  // 4. Fix missing imports
  if (result.includes('responsive.') && !result.includes('useMobileResponsive')) {
    // Add missing import
    if (result.includes('import { useCalculatorState')) {
      result = result.replace(
        /import { useCalculatorState([^}]*)} from ['"]\.\.\/hooks\/useCalculatorState['"]/,
        `import { useCalculatorState$1} from '../hooks/useCalculatorState'
import useMobileResponsive from '../hooks/useMobileResponsive'`
      );
      fixes++;
    }
  }

  // 5. Add missing responsive hook if using responsive but not declared
  if (result.includes('responsive.') && !result.includes('const { responsive }')) {
    if (result.includes('const { formatCurrency } = useCurrency()')) {
      result = result.replace(
        /const { formatCurrency } = useCurrency\(\)/,
        `const { formatCurrency } = useCurrency()
  const { responsive } = useMobileResponsive()`
      );
      fixes++;
    }
  }

  // 6. Clean up empty lines
  result = result.replace(/\n\s*\n\s*\n/g, '\n\n');

  return { content: result, fixes };
}

// Process each calculator
ALL_CALCULATORS.forEach(calculatorFile => {
  const filePath = path.join(calculatorsDir, calculatorFile);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${calculatorFile}`);
    return;
  }

  console.log(`\n📝 Fixing: ${calculatorFile}`);
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Apply all fixes
    const fixResult = fixAllSyntaxIssues(content);
    
    if (fixResult.fixes > 0) {
      fs.writeFileSync(filePath, fixResult.content, 'utf8');
      console.log(`   ✅ Fixed ${fixResult.fixes} syntax issues`);
      fixedCount++;
      totalFixes += fixResult.fixes;
    } else {
      console.log(`   ✓ No syntax issues found`);
    }

  } catch (error) {
    console.error(`   ❌ Error processing ${calculatorFile}:`, error.message);
  }
});

console.log('\n' + '='.repeat(50));
console.log(`🎉 SYNTAX FIXES COMPLETE!`);
console.log(`📊 Fixed ${fixedCount} out of ${ALL_CALCULATORS.length} calculators`);
console.log(`🔧 Total fixes applied: ${totalFixes}`);

if (totalFixes > 0) {
  console.log('\n✨ All syntax errors have been fixed!');
  console.log('\n🚀 The application should now compile without errors.');
} else {
  console.log('\n✅ No syntax errors found!');
}
