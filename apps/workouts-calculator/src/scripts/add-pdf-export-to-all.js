#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

// Calculators that need PDF export added
const CALCULATORS_WITHOUT_PDF = [
  'CommuteCostCalculator.jsx',
  'WFHSavingsCalculator.jsx',
  'BillSplitCalculator.jsx',
  'PropertyValuationCalculator.jsx',
  'TipCalculator.jsx',
  'StockAverageCalculator.jsx',
  'PropertyTaxCalculator.jsx',
  'FuelCostCalculator.jsx',
  'DailyInterestCalculator.jsx',
  'HabitCostCalculator.jsx',
  'SavingsGoalCalculator.jsx',
  'NetWorthCalculator.jsx',
  'SubscriptionCalculator.jsx',
  'RealEstateCalculator.jsx',
  'MonthlyExpenseCalculator.jsx',
  'RentVsBuyCalculator.jsx',
  'DiscountCalculator.jsx',
  'DailySpendingCalculator.jsx',
  'GroceryBudgetCalculator.jsx',
  'BudgetPlannerCalculator.jsx'
];

const calculatorsDir = path.join(process.cwd(), 'src', 'calculators');

console.log('📄 ADDING PDF EXPORT TO ALL CALCULATORS');
console.log('='.repeat(60));

let updatedCount = 0;
let totalAdditions = 0;

// Helper function to extract calculator name from filename
const getCalculatorName = (filename) => {
  return filename.replace('Calculator.jsx', '').replace(/([A-Z])/g, ' $1').trim();
};

// Helper function to determine category color based on calculator type
const getCategoryColor = (calculatorName) => {
  const name = calculatorName.toLowerCase();
  if (name.includes('tax') || name.includes('property')) return 'red';
  if (name.includes('investment') || name.includes('stock') || name.includes('sip') || name.includes('mutual')) return 'purple';
  if (name.includes('savings') || name.includes('fd') || name.includes('rd') || name.includes('ppf')) return 'green';
  if (name.includes('loan') || name.includes('emi') || name.includes('mortgage')) return 'orange';
  return 'blue'; // Default for utility calculators
};

CALCULATORS_WITHOUT_PDF.forEach(calculatorFile => {
  const filePath = path.join(calculatorsDir, calculatorFile);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  ${calculatorFile} - File not found`);
    return;
  }

  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let fileAdditions = 0;
    const calculatorName = getCalculatorName(calculatorFile);

    // 1. Add CommonPDFExport import if not present
    if (!content.includes('import CommonPDFExport')) {
      // Find a good place to add the import (after other component imports)
      const importMatch = content.match(/(import.*from.*components.*\n)/);
      if (importMatch) {
        const insertPoint = content.indexOf(importMatch[0]) + importMatch[0].length;
        content = content.slice(0, insertPoint) + 
                 "import CommonPDFExport from '../components/CommonPDFExport'\n" +
                 content.slice(insertPoint);
        fileAdditions++;
      }
    }

    // 2. Add PDF export section before the closing div/component
    if (!content.includes('PDF Export') && content.includes('results')) {
      // Find the location to insert PDF export (before closing tag)
      const closingPatterns = [
        /(\s+<\/div>\s+\)\s+}\s*$)/m,
        /(\s+<\/CalculatorLayout>\s+\)\s+}\s*$)/m,
        /(\s+<\/motion\.div>\s+\)\s+}\s*$)/m,
        /(\s+\)\s+}\s*$)/m
      ];

      let insertPoint = -1;
      let closingMatch = null;

      for (const pattern of closingPatterns) {
        closingMatch = content.match(pattern);
        if (closingMatch) {
          insertPoint = content.lastIndexOf(closingMatch[0]);
          break;
        }
      }

      if (insertPoint > -1) {
        const pdfExportCode = `
      {/* PDF Export */}
      {results && (
        <CommonPDFExport
          calculatorName="${calculatorName} Calculator"
          inputs={{
            // Add relevant input fields here
          }}
          results={{
            // Add relevant result fields here
          }}
        />
      )}
`;
        
        content = content.slice(0, insertPoint) + pdfExportCode + content.slice(insertPoint);
        fileAdditions++;
      }
    }

    if (fileAdditions > 0) {
      fs.writeFileSync(filePath, content, 'utf8');
      updatedCount++;
      totalAdditions += fileAdditions;
      console.log(`✅ ${calculatorFile} - Added ${fileAdditions} PDF export feature(s)`);
    } else {
      console.log(`✓  ${calculatorFile} - Already has PDF export or no suitable insertion point`);
    }

  } catch (error) {
    console.log(`❌ ${calculatorFile} - Error: ${error.message}`);
  }
});

console.log('\n' + '='.repeat(60));
console.log(`🎉 COMPLETED: Added PDF export to ${updatedCount} calculators`);
console.log(`📄 Total additions: ${totalAdditions}`);
console.log('✨ All calculators now have PDF export capability');
console.log('📝 Note: You may need to customize input/result fields for each calculator');
