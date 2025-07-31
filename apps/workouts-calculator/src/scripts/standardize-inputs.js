#!/usr/bin/env node

/**
 * Script to standardize all calculator inputs to use NumberInput component
 * This script helps automate the conversion process for remaining calculators
 */

import fs from 'fs';
import path from 'path';

// List of calculators that have been updated
const UPDATED_CALCULATORS = [
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
  'BudgetPlannerCalculator.jsx',
  'GratuityCalculator.jsx',
  'StockAverageCalculator.jsx',
  'NetWorthCalculator.jsx',
  'CommuteCostCalculator.jsx',
  'DailySpendingCalculator.jsx',
  'FuelCostCalculator.jsx',
  'GroceryBudgetCalculator.jsx',
  'HabitCostCalculator.jsx',
  'MonthlyExpenseCalculator.jsx',
  'SubscriptionCalculator.jsx',
  'WFHSavingsCalculator.jsx'
];

// List of all calculators that need updating
const ALL_CALCULATORS = [
  'BudgetPlannerCalculator.jsx',
  'CAGRCalculator.jsx',
  'CommuteCostCalculator.jsx',
  'DailyInterestCalculator.jsx',
  'DailySpendingCalculator.jsx',
  'DiscountCalculator.jsx',
  'EPFCalculator.jsx',
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
  'RealEstateCalculator.jsx',
  'RentVsBuyCalculator.jsx',
  'SWPCalculator.jsx',
  'SavingsGoalCalculator.jsx',
  'SimpleInterestCalculator.jsx',
  'StockAverageCalculator.jsx',
  'SubscriptionCalculator.jsx',
  'TaxCalculator.jsx',
  'WFHSavingsCalculator.jsx'
];

// Get remaining calculators to update
const REMAINING_CALCULATORS = ALL_CALCULATORS.filter(calc => !UPDATED_CALCULATORS.includes(calc));

console.log('='.repeat(80));
console.log('CALCULATOR INPUT STANDARDIZATION STATUS');
console.log('='.repeat(80));

console.log('\n✅ COMPLETED CALCULATORS (' + UPDATED_CALCULATORS.length + '/34):');
UPDATED_CALCULATORS.forEach(calc => {
  console.log(`  ✓ ${calc.replace('.jsx', '')}`);
});

console.log('\n⏳ REMAINING CALCULATORS (' + REMAINING_CALCULATORS.length + '/34):');
REMAINING_CALCULATORS.forEach(calc => {
  console.log(`  ○ ${calc.replace('.jsx', '')}`);
});

console.log('\n📊 PROGRESS: ' + Math.round((UPDATED_CALCULATORS.length / (UPDATED_CALCULATORS.length + REMAINING_CALCULATORS.length)) * 100) + '% Complete');

console.log('\n' + '='.repeat(80));
console.log('NEXT STEPS FOR REMAINING CALCULATORS');
console.log('='.repeat(80));

console.log(`
For each remaining calculator, follow these steps:

1. UPDATE IMPORTS:
   Replace: import { ModernInputField } from '../components/ModernInputSection'
   Replace: import CurrencyInput from '../components/CurrencyInput'
   Replace: import UnifiedNumberInput from '../components/UnifiedNumberInput'
   With: import { NumberInput } from '../components/common/inputs'

2. CONVERT CURRENCY INPUTS:
   Replace ModernInputField/CurrencyInput with:
   <div>
     <label className="block text-sm font-medium text-gray-700 mb-2">
       {Label Text}
     </label>
     <NumberInput
       value={inputs.fieldName}
       onChange={(value) => handleInputChange('fieldName', value)}
       placeholder="100000"
       prefix={formatCurrency(0).replace(/[\\d.,]/g, '')}
       step="1"
       allowDecimals={true}
       allowNegative={false}
       className="w-full py-3 sm:py-4 text-base sm:text-lg font-semibold border-2 rounded-xl transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-blue-500 focus:border-transparent"
     />
   </div>

3. CONVERT PERCENTAGE INPUTS:
   <div>
     <label className="block text-sm font-medium text-gray-700 mb-2">
       {Label Text}
     </label>
     <NumberInput
       value={inputs.fieldName}
       onChange={(value) => handleInputChange('fieldName', value)}
       placeholder="8.5"
       suffix="%"
       step="0.5"
       allowDecimals={true}
       allowNegative={false}
       className="w-full py-3 sm:py-4 text-base sm:text-lg font-semibold border-2 rounded-xl transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-blue-500 focus:border-transparent"
     />
   </div>

4. CONVERT INTEGER INPUTS:
   <div>
     <label className="block text-sm font-medium text-gray-700 mb-2">
       {Label Text}
     </label>
     <NumberInput
       value={inputs.fieldName}
       onChange={(value) => handleInputChange('fieldName', value)}
       placeholder="10"
       suffix="years"
       step="1"
       allowDecimals={false}
       allowNegative={false}
       className="w-full py-3 sm:py-4 text-base sm:text-lg font-semibold border-2 rounded-xl transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-blue-500 focus:border-transparent"
     />
   </div>

5. UPDATE FOCUS COLORS BY CATEGORY:
   - Financial: focus:ring-blue-500
   - Investment: focus:ring-purple-500  
   - Savings: focus:ring-green-500
   - Tax: focus:ring-red-500
   - Utility: focus:ring-indigo-500

6. USE SHORT PLACEHOLDERS:
   - Currency: "100000" not "Enter amount"
   - Percentage: "8.5" not "Enter rate"
   - Years: "10" not "Enter period"
`);

console.log('\n' + '='.repeat(80));
console.log('PRIORITY ORDER FOR UPDATES');
console.log('='.repeat(80));

const HIGH_PRIORITY = [
  'TaxCalculator.jsx',
  'PPFCalculator.jsx', 
  'EPFCalculator.jsx',
  'SimpleInterestCalculator.jsx',
  'DailyInterestCalculator.jsx'
];

const MEDIUM_PRIORITY = [
  'DiscountCalculator.jsx',
  'PropertyTaxCalculator.jsx',
  'PropertyValuationCalculator.jsx',
  'RealEstateCalculator.jsx',
  'RentVsBuyCalculator.jsx'
];

console.log('\n🔥 HIGH PRIORITY (Financial Core):');
HIGH_PRIORITY.filter(calc => REMAINING_CALCULATORS.includes(calc)).forEach(calc => {
  console.log(`  1. ${calc.replace('.jsx', '')}`);
});

console.log('\n📊 MEDIUM PRIORITY (Property & Investment):');
MEDIUM_PRIORITY.filter(calc => REMAINING_CALCULATORS.includes(calc)).forEach(calc => {
  console.log(`  2. ${calc.replace('.jsx', '')}`);
});

console.log('\n📝 REMAINING (Utility & Lifestyle):');
REMAINING_CALCULATORS.filter(calc => 
  !HIGH_PRIORITY.includes(calc) && !MEDIUM_PRIORITY.includes(calc)
).forEach(calc => {
  console.log(`  3. ${calc.replace('.jsx', '')}`);
});

console.log('\n' + '='.repeat(80));
console.log('ESTIMATED TIME: ~2-3 minutes per calculator');
console.log('TOTAL REMAINING: ~' + Math.ceil(REMAINING_CALCULATORS.length * 2.5) + ' minutes');
console.log('='.repeat(80));
