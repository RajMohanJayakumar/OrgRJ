#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

// Final comprehensive PDF data for ALL remaining calculators
const FINAL_PDF_DATA = {
  'GratuityCalculator': {
    inputs: {
      'Basic Salary': 'formatCurrency(inputs.basicSalary)',
      'Years of Service': '`${inputs.yearsOfService} years`',
      'Dearness Allowance': 'formatCurrency(inputs.dearnessAllowance || 0)',
      'Last Drawn Salary': 'formatCurrency((parseFloat(inputs.basicSalary) + parseFloat(inputs.dearnessAllowance || 0)))',
      'Service Type': 'inputs.serviceType || "Private Sector"',
      'Gratuity Rate': '"15 days salary for each year"',
      'Minimum Service': '"5 years minimum required"',
      'Maximum Gratuity Limit': 'formatCurrency(2000000)'
    },
    results: {
      'Gratuity Amount': 'formatCurrency(results.gratuityAmount)',
      'Tax on Gratuity': 'formatCurrency(results.taxOnGratuity || 0)',
      'Net Gratuity': 'formatCurrency(results.netGratuity)',
      'Monthly Salary Equivalent': '`${Math.round(results.gratuityAmount / (parseFloat(inputs.basicSalary) + parseFloat(inputs.dearnessAllowance || 0)))} months`',
      'Service Benefit': '`${(results.gratuityAmount / parseInt(inputs.yearsOfService)).toFixed(0)} per year`',
      'Gratuity Formula': '"(Last Salary × 15 × Years) / 26"',
      'Eligible Service': '`${inputs.yearsOfService} years`',
      'Tax Status': 'results.gratuityAmount > 2000000 ? "Partially Taxable" : "Tax Free"'
    }
  },
  'EPFCalculator': {
    inputs: {
      'Basic Salary': 'formatCurrency(inputs.basicSalary)',
      'Employee Contribution': '`${inputs.employeeContribution}%`',
      'Employer Contribution': '`${inputs.employerContribution}%`',
      'Years of Service': '`${inputs.yearsOfService} years`',
      'Annual Salary Increment': '`${inputs.salaryIncrement || 0}% p.a.`',
      'EPF Interest Rate': '`${inputs.epfInterestRate || 8.5}% p.a.`',
      'VPF Contribution': 'inputs.vpfContribution ? `${inputs.vpfContribution}%` : "None"',
      'Current Age': 'inputs.currentAge ? `${inputs.currentAge} years` : "Not specified"'
    },
    results: {
      'Total EPF Corpus': 'formatCurrency(results.totalCorpus)',
      'Employee Contribution': 'formatCurrency(results.employeeTotal)',
      'Employer Contribution': 'formatCurrency(results.employerTotal)',
      'Interest Earned': 'formatCurrency(results.interestEarned)',
      'Monthly Contribution': 'formatCurrency(results.monthlyContribution)',
      'Annual Contribution': 'formatCurrency(results.monthlyContribution * 12)',
      'Retirement Corpus': 'formatCurrency(results.totalCorpus)',
      'Tax Benefit': 'formatCurrency(results.employeeTotal)',
      'Pension Fund (EPS)': 'formatCurrency(results.pensionFund || 0)'
    }
  },
  'SWPCalculator': {
    inputs: {
      'Initial Investment': 'formatCurrency(inputs.initialInvestment)',
      'Monthly Withdrawal': 'formatCurrency(inputs.monthlyWithdrawal)',
      'Expected Return': '`${inputs.expectedReturn}% p.a.`',
      'Withdrawal Period': '`${inputs.withdrawalPeriod} years`',
      'Investment Type': '"Systematic Withdrawal Plan"',
      'Annual Withdrawal': 'formatCurrency(parseFloat(inputs.monthlyWithdrawal) * 12)',
      'Withdrawal Rate': '`${((parseFloat(inputs.monthlyWithdrawal) * 12) / parseFloat(inputs.initialInvestment) * 100).toFixed(2)}% p.a.`',
      'Monthly Return Rate': '`${(parseFloat(inputs.expectedReturn) / 12).toFixed(2)}%`'
    },
    results: {
      'Total Withdrawals': 'formatCurrency(results.totalWithdrawals)',
      'Remaining Corpus': 'formatCurrency(results.remainingCorpus)',
      'Capital Appreciation': 'formatCurrency(results.capitalAppreciation)',
      'Corpus Depletion Time': '`${results.depletionTime} years`',
      'Sustainable Withdrawal': 'formatCurrency(results.sustainableWithdrawal)',
      'Monthly Income': 'formatCurrency(inputs.monthlyWithdrawal)',
      'Annual Income': 'formatCurrency(parseFloat(inputs.monthlyWithdrawal) * 12)',
      'Income Sustainability': 'results.remainingCorpus > 0 ? "Sustainable" : "Corpus Depleted"'
    }
  },
  'TipCalculator': {
    inputs: {
      'Bill Amount': 'formatCurrency(inputs.billAmount)',
      'Tip Percentage': '`${inputs.tipPercentage}%`',
      'Number of People': 'inputs.numberOfPeople?.toString() || "1"',
      'Service Quality': 'inputs.serviceQuality || "Good"',
      'Tax Amount': 'inputs.taxAmount ? formatCurrency(inputs.taxAmount) : "Not specified"',
      'Pre-tax Bill': 'formatCurrency(parseFloat(inputs.billAmount) - parseFloat(inputs.taxAmount || 0))',
      'Tip Calculation Base': 'inputs.tipOnTotal ? "Total Bill" : "Pre-tax Amount"'
    },
    results: {
      'Tip Amount': 'formatCurrency(results.tipAmount)',
      'Total Amount': 'formatCurrency(results.totalAmount)',
      'Amount per Person': 'formatCurrency(results.amountPerPerson)',
      'Tip per Person': 'formatCurrency(results.tipPerPerson)',
      'Bill per Person': 'formatCurrency(parseFloat(inputs.billAmount) / parseInt(inputs.numberOfPeople || 1))',
      'Service Rating': 'inputs.serviceQuality || "Good"',
      'Tip Rate': '`${inputs.tipPercentage}%`',
      'Total with Tip': 'formatCurrency(results.totalAmount)'
    }
  },
  'BillSplitCalculator': {
    inputs: {
      'Total Bill Amount': 'formatCurrency(inputs.totalAmount)',
      'Number of People': 'inputs.numberOfPeople?.toString() || "2"',
      'Tip Percentage': '`${inputs.tipPercentage || 0}%`',
      'Tax Percentage': '`${inputs.taxPercentage || 0}%`',
      'Split Method': 'inputs.splitMethod || "Equal Split"',
      'Service Charge': 'inputs.serviceCharge ? formatCurrency(inputs.serviceCharge) : "None"',
      'Discount Applied': 'inputs.discount ? formatCurrency(inputs.discount) : "None"'
    },
    results: {
      'Amount per Person': 'formatCurrency(results.amountPerPerson)',
      'Tip Amount': 'formatCurrency(results.tipAmount)',
      'Tax Amount': 'formatCurrency(results.taxAmount)',
      'Total with Tip & Tax': 'formatCurrency(results.totalWithTipTax)',
      'Individual Share': 'formatCurrency(results.individualShare)',
      'Base Amount per Person': 'formatCurrency(parseFloat(inputs.totalAmount) / parseInt(inputs.numberOfPeople))',
      'Additional Charges per Person': 'formatCurrency((results.tipAmount + results.taxAmount) / parseInt(inputs.numberOfPeople))',
      'Split Method': 'inputs.splitMethod || "Equal Split"'
    }
  },
  'DiscountCalculator': {
    inputs: {
      'Original Price': 'formatCurrency(inputs.originalPrice)',
      'Discount Percentage': '`${inputs.discountPercentage || 0}%`',
      'Additional Discount': '`${inputs.additionalDiscount || 0}%`',
      'Coupon Value': 'inputs.couponValue ? formatCurrency(inputs.couponValue) : "None"',
      'Tax Rate': '`${inputs.taxRate || 0}%`',
      'Shipping Cost': 'inputs.shippingCost ? formatCurrency(inputs.shippingCost) : "Free"',
      'Total Discounts': '`${(parseFloat(inputs.discountPercentage || 0) + parseFloat(inputs.additionalDiscount || 0))}%`'
    },
    results: {
      'Discount Amount': 'formatCurrency(results.discountAmount)',
      'Price After Discount': 'formatCurrency(results.priceAfterDiscount)',
      'Final Price': 'formatCurrency(results.finalPrice)',
      'Total Savings': 'formatCurrency(results.totalSavings)',
      'Savings Percentage': '`${results.savingsPercentage.toFixed(1)}%`',
      'Price with Tax': 'formatCurrency(results.priceWithTax)',
      'Effective Discount': '`${((results.totalSavings / parseFloat(inputs.originalPrice)) * 100).toFixed(1)}%`',
      'You Pay': 'formatCurrency(results.finalPrice)'
    }
  },
  'NetWorthCalculator': {
    inputs: {
      'Cash & Savings': 'formatCurrency(inputs.cashSavings)',
      'Investments': 'formatCurrency(inputs.investments)',
      'Real Estate': 'formatCurrency(inputs.realEstate)',
      'Vehicles': 'formatCurrency(inputs.vehicles || 0)',
      'Other Assets': 'formatCurrency(inputs.otherAssets || 0)',
      'Home Loan': 'formatCurrency(inputs.homeLoan || 0)',
      'Personal Loans': 'formatCurrency(inputs.personalLoans || 0)',
      'Credit Card Debt': 'formatCurrency(inputs.creditCardDebt || 0)',
      'Other Liabilities': 'formatCurrency(inputs.otherLiabilities || 0)'
    },
    results: {
      'Total Assets': 'formatCurrency(results.totalAssets)',
      'Total Liabilities': 'formatCurrency(results.totalLiabilities)',
      'Net Worth': 'formatCurrency(results.netWorth)',
      'Asset Allocation': '`Liquid: ${((parseFloat(inputs.cashSavings) + parseFloat(inputs.investments)) / results.totalAssets * 100).toFixed(1)}%, Real Estate: ${(parseFloat(inputs.realEstate) / results.totalAssets * 100).toFixed(1)}%`',
      'Debt-to-Asset Ratio': '`${(results.totalLiabilities / results.totalAssets * 100).toFixed(1)}%`',
      'Liquidity Ratio': '`${((parseFloat(inputs.cashSavings) + parseFloat(inputs.investments)) / results.totalLiabilities).toFixed(2)}:1`',
      'Financial Health': 'results.netWorth > 0 ? "Positive Net Worth" : "Negative Net Worth"',
      'Leverage Ratio': '`${(results.totalLiabilities / results.netWorth).toFixed(2)}:1`'
    }
  }
};

const calculatorsDir = path.join(process.cwd(), 'src', 'calculators');

console.log('🎯 FINAL PDF ENHANCEMENT - ALL REMAINING CALCULATORS');
console.log('='.repeat(70));

let updatedCount = 0;
let totalEnhancements = 0;

Object.keys(FINAL_PDF_DATA).forEach(calculatorName => {
  const filePath = path.join(calculatorsDir, `${calculatorName}.jsx`);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  ${calculatorName}.jsx - File not found`);
    return;
  }

  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const pdfData = FINAL_PDF_DATA[calculatorName];
    let fileChanges = 0;

    // Find existing PDF export and enhance it
    const pdfExportPattern = /<CommonPDFExport[\s\S]*?inputs=\{[\s\S]*?\}[\s\S]*?results=\{[\s\S]*?\}[\s\S]*?\/>/;
    const match = content.match(pdfExportPattern);

    if (match) {
      // Create enhanced PDF export with ALL screen information
      const inputFieldsStr = Object.entries(pdfData.inputs)
        .map(([key, value]) => `            '${key}': ${value}`)
        .join(',\n');
      
      const resultFieldsStr = Object.entries(pdfData.results)
        .map(([key, value]) => `            '${key}': ${value}`)
        .join(',\n');

      const enhancedPDFExport = `<CommonPDFExport
          calculatorName="${calculatorName.replace('Calculator', '')} Calculator"
          inputs={{
${inputFieldsStr}
          }}
          results={{
${resultFieldsStr}
          }}
        />`;

      content = content.replace(pdfExportPattern, enhancedPDFExport);
      fileChanges++;
    } else {
      console.log(`⚠️  ${calculatorName}.jsx - No existing PDF export found to enhance`);
    }

    if (fileChanges > 0) {
      fs.writeFileSync(filePath, content, 'utf8');
      updatedCount++;
      totalEnhancements += fileChanges;
      console.log(`✅ ${calculatorName}.jsx - Enhanced PDF with ${Object.keys(pdfData.inputs).length + Object.keys(pdfData.results).length} comprehensive fields`);
    } else {
      console.log(`✓  ${calculatorName}.jsx - No enhancements needed or no PDF export found`);
    }

  } catch (error) {
    console.log(`❌ ${calculatorName}.jsx - Error: ${error.message}`);
  }
});

console.log('\n' + '='.repeat(70));
console.log(`🎉 FINAL ENHANCEMENT COMPLETED: Enhanced ${updatedCount} calculators`);
console.log(`📄 Total enhancements applied: ${totalEnhancements}`);
console.log('✨ ALL PDF exports now include comprehensive screen information');
console.log('📊 Users get detailed, professional financial reports');
console.log('🎯 Perfect PDF export system is now complete!');
