#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Get all calculator files
const calculatorsDir = path.join(__dirname, '../src/calculators');
const calculatorFiles = fs.readdirSync(calculatorsDir)
  .filter(file => file.endsWith('.jsx'))
  .map(file => file.replace('.jsx', ''));

// Read SEO file to get existing configurations
const seoFilePath = path.join(__dirname, '../src/utils/seo.js');
const seoContent = fs.readFileSync(seoFilePath, 'utf8');

// Extract calculator IDs from SEO data
const seoCalculatorIds = [];
const seoMatches = seoContent.match(/^\s*["']?([a-z-]+)["']?\s*:\s*{/gm);
if (seoMatches) {
  seoMatches.forEach(match => {
    const id = match.match(/["']?([a-z-]+)["']?\s*:/)[1];
    if (id !== 'calculatorSEOData' && id !== 'defaultSEOData') {
      seoCalculatorIds.push(id);
    }
  });
}

// Map calculator files to their expected IDs
const fileToIdMap = {
  'EMICalculator': 'emi',
  'SIPCalculator': 'sip',
  'SWPCalculator': 'swp',
  'FDCalculator': 'fd',
  'RDCalculator': 'rd',
  'PPFCalculator': 'ppf',
  'TaxCalculator': 'income-tax',
  'CAGRCalculator': 'cagr',
  'NPSCalculator': 'nps',
  'EPFCalculator': 'epf',
  'GratuityCalculator': 'gratuity',
  'CompoundInterestCalculator': 'compound-interest',
  'SimpleInterestCalculator': 'simple-interest',
  'InflationCalculator': 'inflation',
  'NetWorthCalculator': 'net-worth',
  'DiscountCalculator': 'discount',
  'FuelCostCalculator': 'fuel-cost',
  'StockAverageCalculator': 'stock-average',
  'BudgetPlannerCalculator': 'budget-planner',
  'SavingsGoalCalculator': 'savings-goal',
  'BillSplitCalculator': 'bill-split',
  'TipCalculator': 'tip',
  'SubscriptionCalculator': 'subscription',
  'DailyInterestCalculator': 'daily-interest',
  'MonthlyExpenseCalculator': 'monthly-expense',
  'DailySpendingCalculator': 'daily-spending',
  'GroceryBudgetCalculator': 'grocery-budget',
  'CommuteCostCalculator': 'commute-cost',
  'WFHSavingsCalculator': 'wfh-savings',
  'HabitCostCalculator': 'habit-cost'
};

// Find missing calculators
const expectedIds = calculatorFiles.map(file => fileToIdMap[file]).filter(Boolean);
const missingIds = expectedIds.filter(id => !seoCalculatorIds.includes(id));

console.log('📊 SEO Configuration Audit\n');
console.log(`Total Calculator Files: ${calculatorFiles.length}`);
console.log(`Configured in SEO: ${seoCalculatorIds.length}`);
console.log(`Missing SEO Config: ${missingIds.length}\n`);

if (missingIds.length > 0) {
  console.log('❌ Missing SEO Configuration:');
  missingIds.forEach(id => {
    const fileName = Object.keys(fileToIdMap).find(key => fileToIdMap[key] === id);
    console.log(`   - ${id} (${fileName}.jsx)`);
  });
} else {
  console.log('✅ All calculators have SEO configuration!');
}

console.log('\n📋 All Calculator Files:');
calculatorFiles.forEach(file => {
  const id = fileToIdMap[file];
  const hasConfig = id && seoCalculatorIds.includes(id);
  const status = hasConfig ? '✅' : '❌';
  console.log(`   ${status} ${file}.jsx → ${id || 'NO_ID_MAPPING'}`);
});

console.log('\n🔍 Configured SEO IDs:');
seoCalculatorIds.forEach(id => {
  console.log(`   ✅ ${id}`);
});
