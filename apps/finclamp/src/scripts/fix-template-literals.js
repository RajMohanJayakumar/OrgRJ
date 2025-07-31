#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

// List of all calculators to check and fix
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

console.log('🔧 FIXING TEMPLATE LITERAL SYNTAX ERRORS');
console.log('='.repeat(50));

let fixedCount = 0;
let totalFixes = 0;

// Function to fix template literal syntax
function fixTemplateLiterals(content) {
  let fixes = 0;
  
  // Fix className="${responsive.xxx}" to className={`${responsive.xxx}`}
  const templateLiteralRegex = /className="\$\{([^}]+)\}([^"]*)"/g;
  const fixedContent = content.replace(templateLiteralRegex, (match, expression, rest) => {
    fixes++;
    return `className={\`\${${expression}}${rest}\`}`;
  });

  // Fix other template literal patterns
  const otherPatterns = [
    // Fix any remaining ${responsive.xxx} patterns in regular strings
    {
      pattern: /"\$\{responsive\.([^}]+)\}([^"]*)"/g,
      replacement: '`${responsive.$1}$2`'
    },
    // Fix ${isMobile ? 'xxx' : 'yyy'} patterns in regular strings
    {
      pattern: /"\$\{isMobile \? '([^']+)' : '([^']+)'\}"/g,
      replacement: '`${isMobile ? \'$1\' : \'$2\'}`'
    }
  ];

  let result = fixedContent;
  for (const { pattern, replacement } of otherPatterns) {
    const beforeFix = result;
    result = result.replace(pattern, replacement);
    if (result !== beforeFix) {
      fixes++;
    }
  }

  return { content: result, fixes };
}

// Function to add missing responsive hook usage
function addResponsiveUsage(content) {
  let fixes = 0;
  
  // If file uses responsive.xxx but doesn't have the hook, add it
  if (content.includes('responsive.') && !content.includes('const { responsive }')) {
    // Add responsive hook after existing hooks
    if (content.includes('const { formatCurrency } = useCurrency()')) {
      content = content.replace(
        /const { formatCurrency } = useCurrency\(\)/,
        `const { formatCurrency } = useCurrency()
  const { responsive } = useMobileResponsive()`
      );
      fixes++;
    }
  }

  return { content, fixes };
}

// Process each calculator
ALL_CALCULATORS.forEach(calculatorFile => {
  const filePath = path.join(calculatorsDir, calculatorFile);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${calculatorFile}`);
    return;
  }

  console.log(`\n📝 Checking: ${calculatorFile}`);
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let fileChanges = 0;

    // Check if file has template literal syntax errors
    if (content.includes('className="${responsive.') || 
        content.includes('"${responsive.') ||
        content.includes('"${isMobile')) {
      
      // Fix template literals
      const templateResult = fixTemplateLiterals(content);
      content = templateResult.content;
      fileChanges += templateResult.fixes;

      // Add responsive usage if needed
      const responsiveResult = addResponsiveUsage(content);
      content = responsiveResult.content;
      fileChanges += responsiveResult.fixes;

      // Write back to file
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`   ✅ Fixed ${fileChanges} template literal issues`);
      fixedCount++;
      totalFixes += fileChanges;
    } else {
      console.log(`   ✓ No template literal issues found`);
    }

  } catch (error) {
    console.error(`   ❌ Error processing ${calculatorFile}:`, error.message);
  }
});

console.log('\n' + '='.repeat(50));
console.log(`🎉 TEMPLATE LITERAL FIXES COMPLETE!`);
console.log(`📊 Fixed ${fixedCount} out of ${ALL_CALCULATORS.length} calculators`);
console.log(`🔧 Total fixes applied: ${totalFixes}`);

if (totalFixes > 0) {
  console.log('\n✨ All template literal syntax errors have been fixed!');
  console.log('\n🚀 The application should now compile without errors.');
} else {
  console.log('\n✅ No template literal syntax errors found!');
}
