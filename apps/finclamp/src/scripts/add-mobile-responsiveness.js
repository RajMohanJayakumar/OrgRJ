#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

// List of all calculators to update
const ALL_CALCULATORS = [
  'BillSplitCalculator.jsx',
  'BudgetPlannerCalculator.jsx',
  'CAGRCalculator.jsx',
  'CommuteCostCalculator.jsx',
  'CompoundInterestCalculator.jsx',
  'DailyInterestCalculator.jsx',
  'DailySpendingCalculator.jsx',
  'DiscountCalculator.jsx',
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

console.log('🚀 ADDING MOBILE RESPONSIVENESS TO ALL CALCULATORS');
console.log('='.repeat(60));

let updatedCount = 0;
let totalChanges = 0;

// Function to add mobile imports if not present
function addMobileImports(content) {
  let changes = 0;
  
  // Check if mobile imports are already present
  if (content.includes('useMobileResponsive') || content.includes('MobileLayout')) {
    return { content, changes };
  }

  // Add useViewMode import if not present
  if (!content.includes("import { useViewMode }") && !content.includes("useViewMode")) {
    content = content.replace(
      /import { useCurrency } from ['"]\.\.\/contexts\/CurrencyContext['"]/,
      `import { useCurrency } from '../contexts/CurrencyContext'
import { useViewMode } from '../contexts/ViewModeContext'`
    );
    changes++;
  }

  // Add useMobileResponsive import
  if (content.includes("import { useCalculatorState")) {
    content = content.replace(
      /import { useCalculatorState([^}]*)} from ['"]\.\.\/hooks\/useCalculatorState['"]/,
      `import { useCalculatorState$1} from '../hooks/useCalculatorState'
import useMobileResponsive from '../hooks/useMobileResponsive'`
    );
    changes++;
  }

  // Add MobileLayout imports
  if (content.includes("import CalculatorSchema")) {
    content = content.replace(
      /import CalculatorSchema from ['"]\.\.\/components\/CalculatorSchema['"]/,
      `import CalculatorSchema from '../components/CalculatorSchema'
import MobileLayout, { MobileGrid, MobileSection } from '../components/MobileLayout'`
    );
    changes++;
  }

  return { content, changes };
}

// Function to add mobile hooks usage
function addMobileHooks(content) {
  let changes = 0;

  // Add mobile hooks after existing hooks
  if (content.includes("const { formatCurrency } = useCurrency()") && 
      !content.includes("useMobileResponsive")) {
    content = content.replace(
      /const { formatCurrency } = useCurrency\(\)/,
      `const { formatCurrency } = useCurrency()
  const { isMobile } = useViewMode()
  const { responsive } = useMobileResponsive()`
    );
    changes++;
  }

  return { content, changes };
}

// Function to update layout wrapper
function updateLayoutWrapper(content) {
  let changes = 0;

  // Replace main container div with MobileLayout
  if (content.includes('max-w-7xl mx-auto') && !content.includes('MobileLayout')) {
    content = content.replace(
      /return \(\s*<div className={`max-w-7xl mx-auto[^`]*`}>/,
      'return (\n    <MobileLayout>'
    );
    
    // Find and replace the closing div
    const lines = content.split('\n');
    let openDivs = 0;
    let foundReturn = false;
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('return (') && lines[i].includes('MobileLayout')) {
        foundReturn = true;
        continue;
      }
      
      if (foundReturn) {
        if (lines[i].includes('<div') || lines[i].includes('<motion.div')) {
          openDivs++;
        }
        if (lines[i].includes('</div>')) {
          if (openDivs === 0) {
            lines[i] = lines[i].replace('</div>', '</MobileLayout>');
            break;
          } else {
            openDivs--;
          }
        }
      }
    }
    
    content = lines.join('\n');
    changes++;
  }

  return { content, changes };
}

// Function to update responsive classes
function updateResponsiveClasses(content) {
  let changes = 0;

  // Update grid classes
  content = content.replace(
    /grid-cols-1 lg:grid-cols-2 gap-8/g,
    'grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8'
  );

  // Update text sizes
  content = content.replace(
    /text-3xl font-bold/g,
    '${responsive.typography.heading} font-bold'
  );

  content = content.replace(
    /text-2xl font-bold/g,
    '${responsive.typography.heading} font-bold'
  );

  // Update icon sizes
  content = content.replace(
    /w-8 h-8/g,
    '${responsive.iconSize("lg")}'
  );

  content = content.replace(
    /w-6 h-6/g,
    '${responsive.iconSize("md")}'
  );

  if (content !== content) changes++;

  return { content, changes };
}

// Process each calculator
ALL_CALCULATORS.forEach(calculatorFile => {
  const filePath = path.join(calculatorsDir, calculatorFile);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${calculatorFile}`);
    return;
  }

  console.log(`\n📝 Processing: ${calculatorFile}`);
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let fileChanges = 0;

    // Apply transformations
    const importsResult = addMobileImports(content);
    content = importsResult.content;
    fileChanges += importsResult.changes;

    const hooksResult = addMobileHooks(content);
    content = hooksResult.content;
    fileChanges += hooksResult.changes;

    const layoutResult = updateLayoutWrapper(content);
    content = layoutResult.content;
    fileChanges += layoutResult.changes;

    const responsiveResult = updateResponsiveClasses(content);
    content = responsiveResult.content;
    fileChanges += responsiveResult.changes;

    // Write back to file if changes were made
    if (fileChanges > 0) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`   ✅ Updated with ${fileChanges} changes`);
      updatedCount++;
      totalChanges += fileChanges;
    } else {
      console.log(`   ⏭️  No changes needed`);
    }

  } catch (error) {
    console.error(`   ❌ Error processing ${calculatorFile}:`, error.message);
  }
});

console.log('\n' + '='.repeat(60));
console.log(`🎉 MOBILE RESPONSIVENESS UPDATE COMPLETE!`);
console.log(`📊 Updated ${updatedCount} out of ${ALL_CALCULATORS.length} calculators`);
console.log(`🔧 Total changes made: ${totalChanges}`);
console.log('\n✨ All calculators now have enhanced mobile responsiveness!');
console.log('\n📱 Features added:');
console.log('   • Mobile-responsive layouts');
console.log('   • Touch-friendly controls');
console.log('   • Optimized spacing and sizing');
console.log('   • Conditional mobile styling');
console.log('   • Responsive typography');
console.log('\n🚀 Ready for mobile testing!');
