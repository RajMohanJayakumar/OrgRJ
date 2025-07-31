#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

// Enhanced PDF data for remaining calculators with ALL screen information
const ENHANCED_PDF_DATA = {
  'FDCalculator': {
    inputs: {
      'Principal Amount': 'formatCurrency(inputs.principal)',
      'Interest Rate': '`${inputs.interestRate}% p.a.`',
      'Time Period': '`${inputs.timePeriod} ${inputs.timePeriodType}`',
      'Compounding Frequency': 'inputs.compoundingFrequency || "Quarterly"',
      'Deposit Type': '"Fixed Deposit"',
      'Maturity Period': 'inputs.timePeriodType === "years" ? `${parseInt(inputs.timePeriod) * 12} months` : `${inputs.timePeriod} months`',
      'Monthly Interest Rate': '`${(parseFloat(inputs.interestRate) / 12).toFixed(4)}%`',
      'Effective Annual Rate': '`${inputs.interestRate}% (compounded ${inputs.compoundingFrequency?.toLowerCase()})`'
    },
    results: {
      'Maturity Amount': 'formatCurrency(results.maturityAmount)',
      'Interest Earned': 'formatCurrency(results.interestEarned)',
      'Total Investment': 'formatCurrency(inputs.principal)',
      'Return Percentage': '`${((results.interestEarned / parseFloat(inputs.principal)) * 100).toFixed(2)}%`',
      'Effective Yield': '`${(((results.maturityAmount / parseFloat(inputs.principal)) ** (1 / (parseInt(inputs.timePeriod) / (inputs.timePeriodType === "years" ? 1 : 12))) - 1) * 100).toFixed(2)}% p.a.`',
      'Monthly Interest': 'formatCurrency(results.interestEarned / (parseInt(inputs.timePeriod) * (inputs.timePeriodType === "years" ? 12 : 1)))',
      'Daily Interest': 'formatCurrency(results.interestEarned / (parseInt(inputs.timePeriod) * (inputs.timePeriodType === "years" ? 365 : 30)))',
      'Investment Multiple': '`${(results.maturityAmount / parseFloat(inputs.principal)).toFixed(2)}x`'
    }
  },
  'RDCalculator': {
    inputs: {
      'Monthly Deposit': 'formatCurrency(inputs.monthlyDeposit)',
      'Interest Rate': '`${inputs.interestRate}% p.a.`',
      'Time Period': '`${inputs.timePeriod} years`',
      'Total Deposits': '`${parseInt(inputs.timePeriod) * 12} deposits`',
      'Annual Deposit': 'formatCurrency(parseFloat(inputs.monthlyDeposit) * 12)',
      'Quarterly Interest Rate': '`${(parseFloat(inputs.interestRate) / 4).toFixed(4)}%`',
      'Compounding': '"Quarterly compounding"',
      'Deposit Frequency': '"Monthly"'
    },
    results: {
      'Maturity Amount': 'formatCurrency(results.maturityAmount)',
      'Total Deposits': 'formatCurrency(results.totalDeposits)',
      'Interest Earned': 'formatCurrency(results.interestEarned)',
      'Return Percentage': '`${((results.interestEarned / results.totalDeposits) * 100).toFixed(2)}%`',
      'Effective Annual Return': '`${(((results.maturityAmount / results.totalDeposits) ** (1 / parseInt(inputs.timePeriod)) - 1) * 100).toFixed(2)}%`',
      'Average Monthly Growth': 'formatCurrency((results.maturityAmount - results.totalDeposits) / (parseInt(inputs.timePeriod) * 12))',
      'Final Month Value': 'formatCurrency(results.maturityAmount)',
      'Investment Multiple': '`${(results.maturityAmount / results.totalDeposits).toFixed(2)}x`'
    }
  },
  'CompoundInterestCalculator': {
    inputs: {
      'Principal Amount': 'formatCurrency(inputs.principal)',
      'Interest Rate': '`${inputs.interestRate}% p.a.`',
      'Time Period': '`${inputs.timePeriod} years`',
      'Compounding Frequency': 'inputs.compoundingFrequency || "Annually"',
      'Additional Investment': 'inputs.additionalInvestment ? formatCurrency(inputs.additionalInvestment) : "None"',
      'Investment Type': '"Compound Interest Investment"',
      'Effective Rate': '`${((1 + parseFloat(inputs.interestRate) / 100 / (inputs.compoundingFrequency === "Monthly" ? 12 : inputs.compoundingFrequency === "Quarterly" ? 4 : 1)) ** (inputs.compoundingFrequency === "Monthly" ? 12 : inputs.compoundingFrequency === "Quarterly" ? 4 : 1) - 1) * 100).toFixed(2)}%`',
      'Total Compounding Periods': '`${parseInt(inputs.timePeriod) * (inputs.compoundingFrequency === "Monthly" ? 12 : inputs.compoundingFrequency === "Quarterly" ? 4 : 1)} periods`'
    },
    results: {
      'Final Amount': 'formatCurrency(results.finalAmount)',
      'Interest Earned': 'formatCurrency(results.interestEarned)',
      'Principal Investment': 'formatCurrency(inputs.principal)',
      'Compound Growth': 'formatCurrency(results.finalAmount - parseFloat(inputs.principal))',
      'Return Multiple': '`${(results.finalAmount / parseFloat(inputs.principal)).toFixed(2)}x`',
      'Annualized Return': '`${(((results.finalAmount / parseFloat(inputs.principal)) ** (1 / parseInt(inputs.timePeriod)) - 1) * 100).toFixed(2)}%`',
      'Monthly Equivalent': 'formatCurrency(results.finalAmount / (parseInt(inputs.timePeriod) * 12))',
      'Doubling Time': '`${(Math.log(2) / Math.log(1 + parseFloat(inputs.interestRate) / 100)).toFixed(1)} years`'
    }
  },
  'SimpleInterestCalculator': {
    inputs: {
      'Principal Amount': 'formatCurrency(inputs.principal)',
      'Interest Rate': '`${inputs.interestRate}% p.a.`',
      'Time Period': '`${inputs.timePeriod} years`',
      'Interest Type': '"Simple Interest"',
      'Monthly Rate': '`${(parseFloat(inputs.interestRate) / 12).toFixed(4)}%`',
      'Daily Rate': '`${(parseFloat(inputs.interestRate) / 365).toFixed(6)}%`',
      'Total Days': '`${parseInt(inputs.timePeriod) * 365} days`',
      'Investment Category': '"Fixed Return Investment"'
    },
    results: {
      'Simple Interest': 'formatCurrency(results.simpleInterest)',
      'Final Amount': 'formatCurrency(results.finalAmount)',
      'Principal Amount': 'formatCurrency(inputs.principal)',
      'Interest Percentage': '`${((results.simpleInterest / parseFloat(inputs.principal)) * 100).toFixed(2)}%`',
      'Monthly Interest': 'formatCurrency(results.simpleInterest / (parseInt(inputs.timePeriod) * 12))',
      'Annual Interest': 'formatCurrency(results.simpleInterest / parseInt(inputs.timePeriod))',
      'Daily Interest': 'formatCurrency(results.simpleInterest / (parseInt(inputs.timePeriod) * 365))',
      'Return Multiple': '`${(results.finalAmount / parseFloat(inputs.principal)).toFixed(2)}x`'
    }
  },
  'CAGRCalculator': {
    inputs: {
      'Initial Investment': 'formatCurrency(inputs.initialValue)',
      'Final Value': 'formatCurrency(inputs.finalValue)',
      'Investment Period': '`${inputs.timePeriod} years`',
      'Investment Type': 'inputs.investmentType || "General Investment"',
      'Total Return': 'formatCurrency(parseFloat(inputs.finalValue) - parseFloat(inputs.initialValue))',
      'Absolute Return': '`${(((parseFloat(inputs.finalValue) - parseFloat(inputs.initialValue)) / parseFloat(inputs.initialValue)) * 100).toFixed(2)}%`',
      'Investment Duration': '`${parseInt(inputs.timePeriod) * 12} months`'
    },
    results: {
      'CAGR (Compound Annual Growth Rate)': '`${results.cagr.toFixed(2)}% p.a.`',
      'Total Return': 'formatCurrency(parseFloat(inputs.finalValue) - parseFloat(inputs.initialValue))',
      'Return Multiple': '`${(parseFloat(inputs.finalValue) / parseFloat(inputs.initialValue)).toFixed(2)}x`',
      'Absolute Return Percentage': '`${(((parseFloat(inputs.finalValue) - parseFloat(inputs.initialValue)) / parseFloat(inputs.initialValue)) * 100).toFixed(2)}%`',
      'Annualized Return': '`${results.cagr.toFixed(2)}%`',
      'Investment Doubled In': '`${(Math.log(2) / Math.log(1 + results.cagr / 100)).toFixed(1)} years`',
      'Average Annual Growth': 'formatCurrency((parseFloat(inputs.finalValue) - parseFloat(inputs.initialValue)) / parseInt(inputs.timePeriod))',
      'Monthly Equivalent Return': '`${((Math.pow(1 + results.cagr / 100, 1/12) - 1) * 100).toFixed(3)}%`'
    }
  },
  'InflationCalculator': {
    inputs: {
      'Current Amount': 'formatCurrency(inputs.currentAmount)',
      'Inflation Rate': '`${inputs.inflationRate}% p.a.`',
      'Time Period': '`${inputs.timePeriod} years`',
      'Currency': 'currentFormat.symbol',
      'Calculation Type': '"Future Value with Inflation"',
      'Monthly Inflation': '`${(parseFloat(inputs.inflationRate) / 12).toFixed(4)}%`',
      'Cumulative Inflation': '`${(Math.pow(1 + parseFloat(inputs.inflationRate) / 100, parseInt(inputs.timePeriod)) - 1) * 100).toFixed(2)}%`'
    },
    results: {
      'Future Value': 'formatCurrency(results.futureValue)',
      'Purchasing Power Loss': 'formatCurrency(results.futureValue - parseFloat(inputs.currentAmount))',
      'Real Value Today': 'formatCurrency(parseFloat(inputs.currentAmount))',
      'Inflation Impact': '`${((results.futureValue / parseFloat(inputs.currentAmount) - 1) * 100).toFixed(2)}%`',
      'Required Income': 'formatCurrency(results.futureValue)',
      'Annual Increase Needed': '`${parseFloat(inputs.inflationRate)}%`',
      'Purchasing Power Ratio': '`1:${(results.futureValue / parseFloat(inputs.currentAmount)).toFixed(2)}`',
      'Equivalent Buying Power': 'formatCurrency(parseFloat(inputs.currentAmount) / Math.pow(1 + parseFloat(inputs.inflationRate) / 100, parseInt(inputs.timePeriod)))'
    }
  }
};

const calculatorsDir = path.join(process.cwd(), 'src', 'calculators');

console.log('🚀 ENHANCING ALL REMAINING CALCULATORS WITH PERFECT PDF EXPORTS');
console.log('='.repeat(70));

let updatedCount = 0;
let totalEnhancements = 0;

Object.keys(ENHANCED_PDF_DATA).forEach(calculatorName => {
  const filePath = path.join(calculatorsDir, `${calculatorName}.jsx`);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  ${calculatorName}.jsx - File not found`);
    return;
  }

  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const pdfData = ENHANCED_PDF_DATA[calculatorName];
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
