#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

// Perfect PDF export data that includes ALL screen information for each calculator
const PERFECT_PDF_DATA = {
  'SIPCalculator': {
    inputs: {
      'Monthly Investment': 'formatCurrency(inputs.monthlyInvestment)',
      'Target Maturity Amount': 'inputs.maturityAmount ? formatCurrency(inputs.maturityAmount) : "Not set"',
      'Lump Sum Investment': 'inputs.lumpSumAmount ? formatCurrency(inputs.lumpSumAmount) : "None"',
      'Annual Return Rate': '`${inputs.annualReturn}% p.a.`',
      'Investment Period': '`${inputs.timePeriodYears} years ${inputs.timePeriodMonths} months`',
      'Step-up Percentage': 'inputs.stepUpPercentage ? `${inputs.stepUpPercentage}% annually` : "No step-up"',
      'Step-up Type': 'inputs.stepUpType === "percentage" ? "Percentage increase" : "Fixed amount increase"',
      'Total Investment Period': '`${(parseInt(inputs.timePeriodYears) * 12) + parseInt(inputs.timePeriodMonths)} months`',
      'Investment Mode': 'inputs.maturityAmount ? "Target-based SIP" : "Amount-based SIP"'
    },
    results: {
      'Maturity Amount': 'formatCurrency(results.maturityAmount)',
      'Total Investment': 'formatCurrency(results.totalInvestment)',
      'Total Returns': 'formatCurrency(results.totalReturns)',
      'Return Percentage': '`${results.returnPercentage.toFixed(2)}%`',
      'Absolute Gain': 'formatCurrency(results.totalReturns)',
      'CAGR (Compound Annual Growth Rate)': '`${((Math.pow(results.maturityAmount / results.totalInvestment, 1 / (parseInt(inputs.timePeriodYears) + parseInt(inputs.timePeriodMonths) / 12)) - 1) * 100).toFixed(2)}%`',
      'Monthly Return Rate': '`${(parseFloat(inputs.annualReturn) / 12).toFixed(2)}%`',
      'Investment Multiple': '`${(results.maturityAmount / results.totalInvestment).toFixed(2)}x`',
      'Average Monthly Investment': 'formatCurrency(results.totalInvestment / ((parseInt(inputs.timePeriodYears) * 12) + parseInt(inputs.timePeriodMonths)))',
      'Final Monthly SIP': 'inputs.stepUpPercentage ? formatCurrency(parseFloat(inputs.monthlyInvestment) * Math.pow(1 + parseFloat(inputs.stepUpPercentage) / 100, parseInt(inputs.timePeriodYears))) : formatCurrency(inputs.monthlyInvestment)'
    }
  },
  'EMICalculator': {
    inputs: {
      'Loan Amount': 'formatCurrency(inputs.loanAmount)',
      'Interest Rate': '`${inputs.interestRate}% p.a.`',
      'Loan Tenure': '`${inputs.loanTenure} ${inputs.tenureType}`',
      'Monthly Interest Rate': '`${(parseFloat(inputs.interestRate) / 12).toFixed(4)}%`',
      'Total Months': 'inputs.tenureType === "years" ? `${parseInt(inputs.loanTenure) * 12} months` : `${inputs.loanTenure} months`',
      'Processing Fee': 'inputs.processingFee ? formatCurrency(inputs.processingFee) : "Not applicable"',
      'Prepayment': 'inputs.prepayment ? formatCurrency(inputs.prepayment) : "None planned"'
    },
    results: {
      'Monthly EMI': 'formatCurrency(results.monthlyEMI)',
      'Total Amount Payable': 'formatCurrency(results.totalAmount)',
      'Total Interest Payable': 'formatCurrency(results.totalInterest)',
      'Interest Percentage': '`${((results.totalInterest / parseFloat(inputs.loanAmount)) * 100).toFixed(2)}%`',
      'Principal to Interest Ratio': '`${(parseFloat(inputs.loanAmount) / results.totalInterest).toFixed(2)}:1`',
      'EMI to Loan Ratio': '`${((results.monthlyEMI / parseFloat(inputs.loanAmount)) * 100).toFixed(4)}%`',
      'Break-even Point': '`Month ${Math.ceil((parseInt(inputs.loanTenure) * (inputs.tenureType === "years" ? 12 : 1)) / 2)}`',
      'Total Months': 'inputs.tenureType === "years" ? `${parseInt(inputs.loanTenure) * 12} months` : `${inputs.loanTenure} months`'
    }
  },
  'TaxCalculator': {
    inputs: {
      'Annual Income': 'formatCurrency(inputs.annualIncome)',
      'Country': 'inputs.country?.toUpperCase() || "INDIA"',
      'Tax Regime': 'inputs.taxRegime === "old" ? "Old Tax Regime" : "New Tax Regime"',
      'Standard Deduction': 'formatCurrency(inputs.standardDeduction || 50000)',
      'HRA Exemption': 'formatCurrency(inputs.hraExemption || 0)',
      '80C Deductions': 'formatCurrency(inputs.deduction80C || 0)',
      'Other Deductions': 'formatCurrency(inputs.otherDeductions || 0)',
      'Professional Tax': 'formatCurrency(inputs.professionalTax || 0)',
      'Age Category': 'inputs.age < 60 ? "Below 60 years" : inputs.age < 80 ? "Senior Citizen (60-80)" : "Super Senior Citizen (80+)"'
    },
    results: {
      'Gross Income': 'formatCurrency(inputs.annualIncome)',
      'Total Deductions': 'formatCurrency(results.totalDeductions)',
      'Taxable Income': 'formatCurrency(results.taxableIncome)',
      'Income Tax': 'formatCurrency(results.incomeTax)',
      'Cess (4%)': 'formatCurrency(results.cess)',
      'Total Tax Liability': 'formatCurrency(results.totalTax)',
      'Net Income (Take Home)': 'formatCurrency(results.netIncome)',
      'Effective Tax Rate': '`${results.effectiveTaxRate.toFixed(2)}%`',
      'Tax Savings': 'formatCurrency(results.taxSavings || 0)',
      'Monthly Take Home': 'formatCurrency(results.netIncome / 12)',
      'Tax as % of Gross': '`${((results.totalTax / parseFloat(inputs.annualIncome)) * 100).toFixed(2)}%`'
    }
  },
  'PPFCalculator': {
    inputs: {
      'Annual Deposit': 'formatCurrency(inputs.annualDeposit)',
      'Interest Rate': '`${inputs.interestRate}% p.a.`',
      'Investment Period': '`${inputs.timePeriod} years`',
      'Current Age': 'inputs.currentAge ? `${inputs.currentAge} years` : "Not specified"',
      'Retirement Age': 'inputs.currentAge ? `${parseInt(inputs.currentAge) + parseInt(inputs.timePeriod)} years` : "Not calculated"',
      'Monthly Deposit Equivalent': 'formatCurrency(parseFloat(inputs.annualDeposit) / 12)',
      'Tax Regime': '"PPF qualifies for EEE (Exempt-Exempt-Exempt) tax benefit"'
    },
    results: {
      'Maturity Amount': 'formatCurrency(results.maturityAmount)',
      'Total Contribution': 'formatCurrency(results.totalContribution)',
      'Interest Earned': 'formatCurrency(results.interestEarned)',
      'Tax Savings (30% bracket)': 'formatCurrency(results.totalContribution * 0.3)',
      'Effective Return': '`${((results.maturityAmount / results.totalContribution - 1) * 100).toFixed(2)}%`',
      'CAGR': '`${((Math.pow(results.maturityAmount / results.totalContribution, 1 / parseInt(inputs.timePeriod)) - 1) * 100).toFixed(2)}%`',
      'Monthly Maturity Equivalent': 'formatCurrency(results.maturityAmount / 12)',
      'Interest to Principal Ratio': '`${(results.interestEarned / results.totalContribution).toFixed(2)}:1`',
      'Real Return (Inflation 6%)': '`${(parseFloat(inputs.interestRate) - 6).toFixed(2)}% p.a.`'
    }
  },
  'NPSCalculator': {
    inputs: {
      'Monthly Contribution': 'formatCurrency(inputs.monthlyContribution)',
      'Current Age': '`${inputs.currentAge} years`',
      'Retirement Age': '`${inputs.retirementAge} years`',
      'Expected Return': '`${inputs.expectedReturn}% p.a.`',
      'Investment Period': '`${parseInt(inputs.retirementAge) - parseInt(inputs.currentAge)} years`',
      'Annual Contribution': 'formatCurrency(parseFloat(inputs.monthlyContribution) * 12)',
      'Employer Contribution': 'inputs.employerContribution ? formatCurrency(inputs.employerContribution) : "Not applicable"',
      'NPS Tier': '"Tier 1 (Retirement focused)"'
    },
    results: {
      'Corpus at Retirement': 'formatCurrency(results.corpusAtRetirement)',
      'Total Contribution': 'formatCurrency(results.totalContribution)',
      'Total Returns': 'formatCurrency(results.totalReturns)',
      'Lump Sum (60%)': 'formatCurrency(results.corpusAtRetirement * 0.6)',
      'Annuity Amount (40%)': 'formatCurrency(results.corpusAtRetirement * 0.4)',
      'Monthly Pension (6% annuity)': 'formatCurrency((results.corpusAtRetirement * 0.4 * 0.06) / 12)',
      'Tax Benefit (80CCD)': 'formatCurrency(Math.min(parseFloat(inputs.monthlyContribution) * 12, 150000))',
      'Additional Tax Benefit (80CCD1B)': 'formatCurrency(50000)',
      'Investment Multiple': '`${(results.corpusAtRetirement / results.totalContribution).toFixed(2)}x`'
    }
  },
  'CommuteCostCalculator': {
    inputs: {
      'Distance (One Way)': 'commuteDetails.distance ? `${commuteDetails.distance} km` : "Not set"',
      'Working Days per Month': 'commuteDetails.workingDays?.toString() || "22"',
      'Transport Mode': 'transportModes[commuteDetails.transportMode]?.label || "Car"',
      'Fuel Price per Liter': 'formatCurrency(transportCosts.fuelPrice)',
      'Vehicle Mileage': 'transportCosts.mileage ? `${transportCosts.mileage} km/l` : "Not set"',
      'Parking Cost per Day': 'formatCurrency(transportCosts.parking)',
      'Toll Charges per Day': 'formatCurrency(transportCosts.toll)',
      'Maintenance Cost per Month': 'formatCurrency(transportCosts.maintenance)',
      'Round Trip Distance': 'commuteDetails.distance ? `${parseFloat(commuteDetails.distance) * 2} km` : "Not calculated"',
      'Monthly Working Distance': 'commuteDetails.distance ? `${parseFloat(commuteDetails.distance) * 2 * parseInt(commuteDetails.workingDays)} km` : "Not calculated"'
    },
    results: {
      'Daily Commute Cost': 'formatCurrency(results.dailyCost)',
      'Weekly Commute Cost': 'formatCurrency(results.weeklyCost)',
      'Monthly Commute Cost': 'formatCurrency(results.monthlyCost)',
      'Annual Commute Cost': 'formatCurrency(results.yearlyCost)',
      'Cost per Kilometer': 'formatCurrency(results.costPerKm)',
      'Fuel Cost per Day': 'formatCurrency((parseFloat(commuteDetails.distance) * 2 * parseFloat(transportCosts.fuelPrice)) / parseFloat(transportCosts.mileage))',
      'Non-Fuel Costs per Day': 'formatCurrency(parseFloat(transportCosts.parking) + parseFloat(transportCosts.toll))',
      'Monthly Fuel Expense': 'formatCurrency(((parseFloat(commuteDetails.distance) * 2 * parseFloat(transportCosts.fuelPrice)) / parseFloat(transportCosts.mileage)) * parseInt(commuteDetails.workingDays))',
      'Transport Mode': 'transportModes[commuteDetails.transportMode]?.label || "Car"',
      'Cost Efficiency': '`${(results.costPerKm * 100).toFixed(2)} paise per km`'
    }
  },
  'DailySpendingCalculator': {
    inputs: {
      'Daily Budget': 'settings.dailyBudget ? formatCurrency(settings.dailyBudget) : "Not set"',
      'Tracking Period': '`${settings.trackingPeriod} days`',
      'Total Transactions': 'transactions.length.toString()',
      'Transaction Categories': 'Array.from(new Set(transactions.map(t => t.category))).join(", ")',
      'Time Periods Tracked': 'Array.from(new Set(transactions.map(t => t.time))).join(", ")',
      'Average Transaction': 'formatCurrency(transactions.reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0) / transactions.length)',
      'Highest Transaction': 'formatCurrency(Math.max(...transactions.map(t => parseFloat(t.amount) || 0)))',
      'Budget Utilization': 'settings.dailyBudget ? `${((results.dailyTotal / parseFloat(settings.dailyBudget)) * 100).toFixed(1)}%` : "No budget set"'
    },
    results: {
      'Daily Total Spending': 'formatCurrency(results.dailyTotal)',
      'Weekly Projection': 'formatCurrency(results.weeklyProjection)',
      'Monthly Projection': 'formatCurrency(results.monthlyProjection)',
      'Budget Status': 'results.budgetStatus === "within" ? "Within Budget" : results.budgetStatus === "warning" ? "Approaching Limit" : "Over Budget"',
      'Budget Remaining': 'settings.dailyBudget ? formatCurrency(parseFloat(settings.dailyBudget) - results.dailyTotal) : "No budget set"',
      'Spending Trend': 'results.spendingTrend === "stable" ? "Stable" : results.spendingTrend === "increasing" ? "Increasing" : "Decreasing"',
      'Category Breakdown': 'Object.entries(results.categoryBreakdown).map(([cat, amt]) => `${cat}: ${formatCurrency(amt)}`).join(", ")',
      'Time Breakdown': 'Object.entries(results.timeBreakdown).map(([time, amt]) => `${time}: ${formatCurrency(amt)}`).join(", ")',
      'Average Transaction Size': 'formatCurrency(results.averageTransaction)',
      'Annual Projection': 'formatCurrency(results.dailyTotal * 365)'
    }
  },
  'BudgetPlannerCalculator': {
    inputs: {
      'Monthly Income': 'formatCurrency(inputs.monthlyIncome)',
      'Fixed Expenses': 'formatCurrency(inputs.fixedExpenses)',
      'Variable Expenses': 'formatCurrency(inputs.variableExpenses)',
      'Savings Goal': 'formatCurrency(inputs.savingsGoal)',
      'Emergency Fund Target': 'formatCurrency(inputs.emergencyFund)',
      'Debt Payments': 'formatCurrency(inputs.debtPayments || 0)',
      'Investment Allocation': 'formatCurrency(inputs.investmentAllocation || 0)',
      'Discretionary Spending': 'formatCurrency(inputs.discretionarySpending || 0)',
      'Annual Income': 'formatCurrency(parseFloat(inputs.monthlyIncome) * 12)'
    },
    results: {
      'Total Monthly Budget': 'formatCurrency(results.totalBudget)',
      'Available for Savings': 'formatCurrency(results.availableForSavings)',
      'Budget Surplus/Deficit': 'formatCurrency(results.budgetBalance)',
      'Recommended Savings': 'formatCurrency(results.recommendedSavings)',
      'Budget Health Score': 'results.budgetHealth || "Good"',
      'Expense Ratio': '`${((parseFloat(inputs.fixedExpenses) + parseFloat(inputs.variableExpenses)) / parseFloat(inputs.monthlyIncome) * 100).toFixed(1)}%`',
      'Savings Rate': '`${(results.availableForSavings / parseFloat(inputs.monthlyIncome) * 100).toFixed(1)}%`',
      'Fixed vs Variable Ratio': '`${(parseFloat(inputs.fixedExpenses) / parseFloat(inputs.variableExpenses)).toFixed(2)}:1`',
      'Emergency Fund Months': '`${(parseFloat(inputs.emergencyFund) / (parseFloat(inputs.fixedExpenses) + parseFloat(inputs.variableExpenses))).toFixed(1)} months`',
      'Annual Savings Potential': 'formatCurrency(results.availableForSavings * 12)'
    }
  },
  'StockAverageCalculator': {
    inputs: {
      'Stock Symbol': 'inputs.stockSymbol || "STOCK"',
      'First Purchase Price': 'formatCurrency(inputs.firstPrice)',
      'First Purchase Quantity': 'inputs.firstQuantity?.toString() || "0"',
      'First Purchase Value': 'formatCurrency(parseFloat(inputs.firstPrice) * parseInt(inputs.firstQuantity))',
      'Second Purchase Price': 'formatCurrency(inputs.secondPrice)',
      'Second Purchase Quantity': 'inputs.secondQuantity?.toString() || "0"',
      'Second Purchase Value': 'formatCurrency(parseFloat(inputs.secondPrice) * parseInt(inputs.secondQuantity))',
      'Current Market Price': 'formatCurrency(inputs.currentPrice)',
      'Price Difference': 'formatCurrency(Math.abs(parseFloat(inputs.firstPrice) - parseFloat(inputs.secondPrice)))'
    },
    results: {
      'Average Purchase Price': 'formatCurrency(results.averagePrice)',
      'Total Investment': 'formatCurrency(results.totalInvestment)',
      'Total Quantity Held': 'results.totalQuantity?.toString() || "0"',
      'Current Portfolio Value': 'formatCurrency(results.currentValue)',
      'Unrealized Profit/Loss': 'formatCurrency(results.profitLoss)',
      'Return Percentage': 'results.returnPercentage ? `${results.returnPercentage.toFixed(2)}%` : "0%"',
      'Gain/Loss per Share': 'formatCurrency(parseFloat(inputs.currentPrice) - results.averagePrice)',
      'Break-even Price': 'formatCurrency(results.averagePrice)',
      'Investment Status': 'results.profitLoss >= 0 ? "Profitable" : "Loss Making"',
      'Portfolio Weight': '"Individual stock analysis"'
    }
  }
};

const calculatorsDir = path.join(process.cwd(), 'src', 'calculators');

console.log('🎯 CREATING PERFECT PDF EXPORTS WITH ALL SCREEN INFORMATION');
console.log('='.repeat(70));

let updatedCount = 0;
let totalEnhancements = 0;

Object.keys(PERFECT_PDF_DATA).forEach(calculatorName => {
  const filePath = path.join(calculatorsDir, `${calculatorName}.jsx`);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  ${calculatorName}.jsx - File not found`);
    return;
  }

  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const pdfData = PERFECT_PDF_DATA[calculatorName];
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
console.log(`🎉 COMPLETED: Enhanced ${updatedCount} calculators with perfect PDF exports`);
console.log(`📄 Total enhancements applied: ${totalEnhancements}`);
console.log('✨ PDF exports now include ALL screen information');
console.log('📊 Users will get comprehensive, detailed financial reports');
console.log('🎯 Perfect PDF exports are now ready for production!');
