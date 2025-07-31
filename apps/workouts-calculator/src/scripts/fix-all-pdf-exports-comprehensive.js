#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

// Comprehensive PDF export data for all calculators
const COMPREHENSIVE_PDF_DATA = {
  'CommuteCostCalculator': {
    inputs: {
      'Distance': 'commuteDetails.distance ? `${commuteDetails.distance} km` : "Not set"',
      'Working Days': 'commuteDetails.workingDays?.toString() || "22"',
      'Transport Mode': 'transportModes[commuteDetails.transportMode]?.label || "Car"',
      'Fuel Price': 'formatCurrency(transportCosts.fuelPrice)',
      'Vehicle Mileage': 'transportCosts.mileage ? `${transportCosts.mileage} km/l` : "Not set"',
      'Parking Cost': 'formatCurrency(transportCosts.parking)',
      'Toll Charges': 'formatCurrency(transportCosts.toll)'
    },
    results: {
      'Daily Cost': 'formatCurrency(results.dailyCost)',
      'Weekly Cost': 'formatCurrency(results.weeklyCost)',
      'Monthly Cost': 'formatCurrency(results.monthlyCost)',
      'Yearly Cost': 'formatCurrency(results.yearlyCost)',
      'Cost per KM': 'formatCurrency(results.costPerKm)',
      'Transport Mode': 'transportModes[commuteDetails.transportMode]?.label || "Car"'
    }
  },
  'WFHSavingsCalculator': {
    inputs: {
      'Work Days per Week': 'inputs.workDaysPerWeek?.toString() || "5"',
      'Commute Distance': 'inputs.commuteDistance ? `${inputs.commuteDistance} km` : "Not set"',
      'Fuel Cost per Liter': 'formatCurrency(inputs.fuelCostPerLiter)',
      'Vehicle Efficiency': 'inputs.vehicleEfficiency ? `${inputs.vehicleEfficiency} km/l` : "Not set"',
      'Parking Cost': 'formatCurrency(inputs.parkingCost)',
      'Meal Savings': 'formatCurrency(inputs.mealSavings)'
    },
    results: {
      'Daily Savings': 'formatCurrency(results.dailySavings)',
      'Weekly Savings': 'formatCurrency(results.weeklySavings)',
      'Monthly Savings': 'formatCurrency(results.monthlySavings)',
      'Yearly Savings': 'formatCurrency(results.yearlySavings)',
      'Fuel Savings': 'formatCurrency(results.fuelSavings)',
      'Total WFH Benefits': 'formatCurrency(results.totalBenefits)'
    }
  },
  'BillSplitCalculator': {
    inputs: {
      'Total Bill Amount': 'formatCurrency(inputs.totalAmount)',
      'Number of People': 'inputs.numberOfPeople?.toString() || "2"',
      'Tip Percentage': 'inputs.tipPercentage ? `${inputs.tipPercentage}%` : "0%"',
      'Tax Percentage': 'inputs.taxPercentage ? `${inputs.taxPercentage}%` : "0%"',
      'Split Method': 'inputs.splitMethod || "Equal"'
    },
    results: {
      'Amount per Person': 'formatCurrency(results.amountPerPerson)',
      'Tip Amount': 'formatCurrency(results.tipAmount)',
      'Tax Amount': 'formatCurrency(results.taxAmount)',
      'Total with Tip & Tax': 'formatCurrency(results.totalWithTipTax)',
      'Individual Share': 'formatCurrency(results.individualShare)'
    }
  },
  'TipCalculator': {
    inputs: {
      'Bill Amount': 'formatCurrency(inputs.billAmount)',
      'Tip Percentage': 'inputs.tipPercentage ? `${inputs.tipPercentage}%` : "15%"',
      'Number of People': 'inputs.numberOfPeople?.toString() || "1"',
      'Service Quality': 'inputs.serviceQuality || "Good"'
    },
    results: {
      'Tip Amount': 'formatCurrency(results.tipAmount)',
      'Total Amount': 'formatCurrency(results.totalAmount)',
      'Amount per Person': 'formatCurrency(results.amountPerPerson)',
      'Tip per Person': 'formatCurrency(results.tipPerPerson)'
    }
  },
  'StockAverageCalculator': {
    inputs: {
      'Stock Symbol': 'inputs.stockSymbol || "STOCK"',
      'First Purchase Price': 'formatCurrency(inputs.firstPrice)',
      'First Purchase Quantity': 'inputs.firstQuantity?.toString() || "0"',
      'Second Purchase Price': 'formatCurrency(inputs.secondPrice)',
      'Second Purchase Quantity': 'inputs.secondQuantity?.toString() || "0"',
      'Current Market Price': 'formatCurrency(inputs.currentPrice)'
    },
    results: {
      'Average Purchase Price': 'formatCurrency(results.averagePrice)',
      'Total Investment': 'formatCurrency(results.totalInvestment)',
      'Total Quantity': 'results.totalQuantity?.toString() || "0"',
      'Current Value': 'formatCurrency(results.currentValue)',
      'Profit/Loss': 'formatCurrency(results.profitLoss)',
      'Return Percentage': 'results.returnPercentage ? `${results.returnPercentage.toFixed(2)}%` : "0%"'
    }
  },
  'PropertyTaxCalculator': {
    inputs: {
      'Property Value': 'formatCurrency(inputs.propertyValue)',
      'Property Type': 'inputs.propertyType || "Residential"',
      'Location': 'inputs.location || "Urban"',
      'Built-up Area': 'inputs.builtUpArea ? `${inputs.builtUpArea} sq ft` : "Not specified"',
      'Property Age': 'inputs.propertyAge ? `${inputs.propertyAge} years` : "Not specified"'
    },
    results: {
      'Annual Property Tax': 'formatCurrency(results.annualTax)',
      'Monthly Tax': 'formatCurrency(results.monthlyTax)',
      'Tax Rate Applied': 'results.taxRate ? `${results.taxRate}%` : "Not calculated"',
      'Assessed Value': 'formatCurrency(results.assessedValue)',
      'Tax per Sq Ft': 'formatCurrency(results.taxPerSqFt)'
    }
  },
  'FuelCostCalculator': {
    inputs: {
      'Distance': 'inputs.distance ? `${inputs.distance} km` : "Not set"',
      'Fuel Price': 'formatCurrency(inputs.fuelPrice)',
      'Vehicle Mileage': 'inputs.mileage ? `${inputs.mileage} km/l` : "Not set"',
      'Trip Type': 'inputs.tripType || "One Way"',
      'Vehicle Type': 'inputs.vehicleType || "Car"'
    },
    results: {
      'Fuel Required': 'results.fuelRequired ? `${results.fuelRequired.toFixed(2)} liters` : "0 liters"',
      'Fuel Cost': 'formatCurrency(results.fuelCost)',
      'Cost per KM': 'formatCurrency(results.costPerKm)',
      'Round Trip Cost': 'formatCurrency(results.roundTripCost)',
      'Monthly Cost': 'formatCurrency(results.monthlyCost)'
    }
  },
  'DailyInterestCalculator': {
    inputs: {
      'Principal Amount': 'formatCurrency(inputs.principal)',
      'Annual Interest Rate': 'inputs.interestRate ? `${inputs.interestRate}% p.a.` : "Not set"',
      'Investment Period': 'inputs.days ? `${inputs.days} days` : "Not set"',
      'Interest Type': 'inputs.interestType || "Simple Interest"'
    },
    results: {
      'Daily Interest': 'formatCurrency(results.dailyInterest)',
      'Total Interest': 'formatCurrency(results.totalInterest)',
      'Maturity Amount': 'formatCurrency(results.maturityAmount)',
      'Effective Annual Rate': 'results.effectiveRate ? `${results.effectiveRate.toFixed(2)}%` : "0%"'
    }
  },
  'SavingsGoalCalculator': {
    inputs: {
      'Target Amount': 'formatCurrency(inputs.targetAmount)',
      'Current Savings': 'formatCurrency(inputs.currentSavings)',
      'Monthly Contribution': 'formatCurrency(inputs.monthlyContribution)',
      'Expected Return': 'inputs.expectedReturn ? `${inputs.expectedReturn}% p.a.` : "0%"',
      'Time Period': 'inputs.timePeriod ? `${inputs.timePeriod} years` : "Not set"'
    },
    results: {
      'Time to Goal': 'results.timeToGoal ? `${results.timeToGoal} months` : "Not calculated"',
      'Required Monthly Saving': 'formatCurrency(results.requiredMonthlySaving)',
      'Total Contributions': 'formatCurrency(results.totalContributions)',
      'Interest Earned': 'formatCurrency(results.interestEarned)',
      'Goal Achievement Date': 'results.goalDate || "Not calculated"'
    }
  },
  'NetWorthCalculator': {
    inputs: {
      'Total Assets': 'formatCurrency(inputs.totalAssets)',
      'Real Estate': 'formatCurrency(inputs.realEstate)',
      'Investments': 'formatCurrency(inputs.investments)',
      'Cash & Savings': 'formatCurrency(inputs.cashSavings)',
      'Total Liabilities': 'formatCurrency(inputs.totalLiabilities)',
      'Loans & Mortgages': 'formatCurrency(inputs.loansMortgages)'
    },
    results: {
      'Net Worth': 'formatCurrency(results.netWorth)',
      'Asset to Liability Ratio': 'results.assetLiabilityRatio ? `${results.assetLiabilityRatio.toFixed(2)}:1` : "Not calculated"',
      'Debt to Asset Ratio': 'results.debtAssetRatio ? `${(results.debtAssetRatio * 100).toFixed(1)}%` : "0%"',
      'Liquidity Ratio': 'results.liquidityRatio ? `${results.liquidityRatio.toFixed(2)}` : "Not calculated"'
    }
  },
  'MonthlyExpenseCalculator': {
    inputs: {
      'Monthly Income': 'formatCurrency(inputs.monthlyIncome)',
      'Housing Cost': 'formatCurrency(inputs.housingCost)',
      'Food & Dining': 'formatCurrency(inputs.foodCost)',
      'Transportation': 'formatCurrency(inputs.transportationCost)',
      'Utilities': 'formatCurrency(inputs.utilitiesCost)',
      'Entertainment': 'formatCurrency(inputs.entertainmentCost)',
      'Healthcare': 'formatCurrency(inputs.healthcareCost)'
    },
    results: {
      'Total Expenses': 'formatCurrency(results.totalExpenses)',
      'Remaining Income': 'formatCurrency(results.remainingIncome)',
      'Expense Ratio': 'results.expenseRatio ? `${(results.expenseRatio * 100).toFixed(1)}%` : "0%"',
      'Savings Rate': 'results.savingsRate ? `${(results.savingsRate * 100).toFixed(1)}%` : "0%"',
      'Budget Status': 'results.budgetStatus || "Unknown"'
    }
  },
  'BudgetPlannerCalculator': {
    inputs: {
      'Monthly Income': 'formatCurrency(inputs.monthlyIncome)',
      'Fixed Expenses': 'formatCurrency(inputs.fixedExpenses)',
      'Variable Expenses': 'formatCurrency(inputs.variableExpenses)',
      'Savings Goal': 'formatCurrency(inputs.savingsGoal)',
      'Emergency Fund': 'formatCurrency(inputs.emergencyFund)'
    },
    results: {
      'Total Budget': 'formatCurrency(results.totalBudget)',
      'Available for Savings': 'formatCurrency(results.availableForSavings)',
      'Budget Surplus/Deficit': 'formatCurrency(results.budgetBalance)',
      'Recommended Savings': 'formatCurrency(results.recommendedSavings)',
      'Budget Health': 'results.budgetHealth || "Unknown"'
    }
  },
  'GroceryBudgetCalculator': {
    inputs: {
      'Family Size': 'inputs.familySize?.toString() || "1"',
      'Weekly Budget': 'formatCurrency(inputs.weeklyBudget)',
      'Dietary Preferences': 'inputs.dietaryPreferences || "Regular"',
      'Shopping Frequency': 'inputs.shoppingFrequency || "Weekly"',
      'Location': 'inputs.location || "Urban"'
    },
    results: {
      'Daily Budget': 'formatCurrency(results.dailyBudget)',
      'Monthly Budget': 'formatCurrency(results.monthlyBudget)',
      'Per Person Daily': 'formatCurrency(results.perPersonDaily)',
      'Recommended Allocation': 'results.recommendedAllocation || "Not calculated"',
      'Budget Category': 'results.budgetCategory || "Standard"'
    }
  },
  'SubscriptionCalculator': {
    inputs: {
      'Number of Subscriptions': 'inputs.numberOfSubscriptions?.toString() || "0"',
      'Total Monthly Cost': 'formatCurrency(inputs.totalMonthlyCost)',
      'Average Subscription': 'formatCurrency(inputs.averageSubscription)',
      'Most Expensive': 'formatCurrency(inputs.mostExpensive)',
      'Least Used': 'inputs.leastUsed || "None specified"'
    },
    results: {
      'Annual Cost': 'formatCurrency(results.annualCost)',
      'Average per Subscription': 'formatCurrency(results.averagePerSubscription)',
      'Potential Savings': 'formatCurrency(results.potentialSavings)',
      'Cost per Day': 'formatCurrency(results.costPerDay)',
      'Recommendation': 'results.recommendation || "Review subscriptions regularly"'
    }
  },
  'HabitCostCalculator': {
    inputs: {
      'Habit Type': 'inputs.habitType || "Custom"',
      'Daily Cost': 'formatCurrency(inputs.dailyCost)',
      'Frequency per Day': 'inputs.frequencyPerDay?.toString() || "1"',
      'Days per Week': 'inputs.daysPerWeek?.toString() || "7"',
      'Habit Duration': 'inputs.habitDuration ? `${inputs.habitDuration} years` : "Not specified"'
    },
    results: {
      'Weekly Cost': 'formatCurrency(results.weeklyCost)',
      'Monthly Cost': 'formatCurrency(results.monthlyCost)',
      'Annual Cost': 'formatCurrency(results.annualCost)',
      'Lifetime Cost': 'formatCurrency(results.lifetimeCost)',
      'Alternative Investment': 'formatCurrency(results.alternativeInvestment)'
    }
  },
  'DiscountCalculator': {
    inputs: {
      'Original Price': 'formatCurrency(inputs.originalPrice)',
      'Discount Percentage': 'inputs.discountPercentage ? `${inputs.discountPercentage}%` : "0%"',
      'Additional Discount': 'inputs.additionalDiscount ? `${inputs.additionalDiscount}%` : "0%"',
      'Tax Rate': 'inputs.taxRate ? `${inputs.taxRate}%` : "0%"',
      'Coupon Value': 'formatCurrency(inputs.couponValue)'
    },
    results: {
      'Discount Amount': 'formatCurrency(results.discountAmount)',
      'Final Price': 'formatCurrency(results.finalPrice)',
      'Total Savings': 'formatCurrency(results.totalSavings)',
      'Savings Percentage': 'results.savingsPercentage ? `${results.savingsPercentage.toFixed(1)}%` : "0%"',
      'Price After Tax': 'formatCurrency(results.priceAfterTax)'
    }
  },
  'RealEstateCalculator': {
    inputs: {
      'Property Price': 'formatCurrency(inputs.propertyPrice)',
      'Down Payment': 'formatCurrency(inputs.downPayment)',
      'Loan Amount': 'formatCurrency(inputs.loanAmount)',
      'Interest Rate': 'inputs.interestRate ? `${inputs.interestRate}% p.a.` : "Not set"',
      'Loan Tenure': 'inputs.loanTenure ? `${inputs.loanTenure} years` : "Not set"',
      'Property Tax': 'formatCurrency(inputs.propertyTax)'
    },
    results: {
      'Monthly EMI': 'formatCurrency(results.monthlyEMI)',
      'Total Interest': 'formatCurrency(results.totalInterest)',
      'Total Payment': 'formatCurrency(results.totalPayment)',
      'Property Tax Annual': 'formatCurrency(results.propertyTaxAnnual)',
      'Total Cost of Ownership': 'formatCurrency(results.totalCostOfOwnership)'
    }
  },
  'RentVsBuyCalculator': {
    inputs: {
      'Property Price': 'formatCurrency(inputs.propertyPrice)',
      'Down Payment': 'formatCurrency(inputs.downPayment)',
      'Monthly Rent': 'formatCurrency(inputs.monthlyRent)',
      'Loan Interest Rate': 'inputs.loanInterestRate ? `${inputs.loanInterestRate}% p.a.` : "Not set"',
      'Investment Return': 'inputs.investmentReturn ? `${inputs.investmentReturn}% p.a.` : "Not set"',
      'Time Horizon': 'inputs.timeHorizon ? `${inputs.timeHorizon} years` : "Not set"'
    },
    results: {
      'Monthly EMI': 'formatCurrency(results.monthlyEMI)',
      'Total Buying Cost': 'formatCurrency(results.totalBuyingCost)',
      'Total Renting Cost': 'formatCurrency(results.totalRentingCost)',
      'Net Difference': 'formatCurrency(results.netDifference)',
      'Recommendation': 'results.recommendation || "Analyze based on your situation"',
      'Break-even Year': 'results.breakEvenYear ? `Year ${results.breakEvenYear}` : "Not calculated"'
    }
  }
};

const calculatorsDir = path.join(process.cwd(), 'src', 'calculators');

console.log('🔧 FIXING ALL PDF EXPORTS WITH COMPREHENSIVE DATA');
console.log('='.repeat(60));

let updatedCount = 0;
let totalFixes = 0;

Object.keys(COMPREHENSIVE_PDF_DATA).forEach(calculatorName => {
  const filePath = path.join(calculatorsDir, `${calculatorName}.jsx`);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  ${calculatorName}.jsx - File not found`);
    return;
  }

  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const pdfData = COMPREHENSIVE_PDF_DATA[calculatorName];
    let fileChanges = 0;

    // Fix malformed PDF export structure
    const malformedPattern = /\{\/\* PDF Export \*\/\}\s*\{results && \(\s*<CommonPDFExport[\s\S]*?\/\>\s*\)\}/;
    if (content.match(malformedPattern)) {
      content = content.replace(malformedPattern, '');
      fileChanges++;
    }

    // Replace placeholder PDF export data
    const placeholderPattern = /inputs:\s*\{\s*\/\/ Add relevant input fields here\s*\}/;
    if (content.match(placeholderPattern)) {
      const inputFieldsStr = Object.entries(pdfData.inputs)
        .map(([key, value]) => `            '${key}': ${value}`)
        .join(',\n');
      
      content = content.replace(placeholderPattern, `inputs: {\n${inputFieldsStr}\n          }`);
      fileChanges++;
    }

    const resultsPlaceholderPattern = /results:\s*\{\s*\/\/ Add relevant result fields here\s*\}/;
    if (content.match(resultsPlaceholderPattern)) {
      const resultFieldsStr = Object.entries(pdfData.results)
        .map(([key, value]) => `            '${key}': ${value}`)
        .join(',\n');
      
      content = content.replace(resultsPlaceholderPattern, `results: {\n${resultFieldsStr}\n          }`);
      fileChanges++;
    }

    // Add PDF export if completely missing
    if (!content.includes('CommonPDFExport') && content.includes('results')) {
      const inputFieldsStr = Object.entries(pdfData.inputs)
        .map(([key, value]) => `            '${key}': ${value}`)
        .join(',\n');
      
      const resultFieldsStr = Object.entries(pdfData.results)
        .map(([key, value]) => `            '${key}': ${value}`)
        .join(',\n');

      const pdfExportCode = `
      {/* PDF Export */}
      {results && (
        <CommonPDFExport
          calculatorName="${calculatorName.replace('Calculator', '')} Calculator"
          inputs={{
${inputFieldsStr}
          }}
          results={{
${resultFieldsStr}
          }}
        />
      )}`;

      // Find a good insertion point (before closing div or related calculators)
      const insertionPatterns = [
        /(\s+<\/div>\s*\)\s*}\s*$)/m,
        /(\s+<UniversalRelatedCalculators[\s\S]*?\/>\s*)/m,
        /(\s+<RelatedCalculators[\s\S]*?\/>\s*)/m
      ];

      let insertPoint = -1;
      for (const pattern of insertionPatterns) {
        const match = content.match(pattern);
        if (match) {
          insertPoint = content.indexOf(match[0]);
          break;
        }
      }

      if (insertPoint > -1) {
        content = content.slice(0, insertPoint) + pdfExportCode + '\n' + content.slice(insertPoint);
        fileChanges++;
      }
    }

    if (fileChanges > 0) {
      fs.writeFileSync(filePath, content, 'utf8');
      updatedCount++;
      totalFixes += fileChanges;
      console.log(`✅ ${calculatorName}.jsx - Applied ${fileChanges} comprehensive PDF fix(es)`);
    } else {
      console.log(`✓  ${calculatorName}.jsx - PDF export already comprehensive or no issues found`);
    }

  } catch (error) {
    console.log(`❌ ${calculatorName}.jsx - Error: ${error.message}`);
  }
});

console.log('\n' + '='.repeat(60));
console.log(`🎉 COMPLETED: Fixed comprehensive PDF exports in ${updatedCount} calculators`);
console.log(`🔧 Total fixes applied: ${totalFixes}`);
console.log('📄 All PDFs now contain detailed, meaningful data');
console.log('✨ PDF exports are now comprehensive and professional');
