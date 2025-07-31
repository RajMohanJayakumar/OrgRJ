#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const calculatorsDir = path.join(process.cwd(), 'src', 'calculators');

console.log('🔍 FIXING NaN ISSUES ACROSS ALL CALCULATORS');
console.log('='.repeat(60));

// Common NaN-causing patterns and their fixes
const NAN_PATTERNS = [
  // Division by zero or undefined values
  {
    pattern: /formatCurrency\(([^)]+)\s*\/\s*0\)/g,
    fix: 'formatCurrency(($1) || 0)',
    description: 'Division by zero in formatCurrency'
  },
  
  // Undefined field references in calculations
  {
    pattern: /formatCurrency\(results\.(\w+)\)/g,
    fix: (match, field) => `formatCurrency(results.${field} || 0)`,
    description: 'Undefined results field'
  },
  
  // Percentage calculations with potential division by zero
  {
    pattern: /\(\(\(([^)]+)\s*\/\s*parseFloat\(([^)]+)\)\)\s*\*\s*100\)\.toFixed\((\d+)\)\s*\+\s*'%'/g,
    fix: (match, numerator, denominator, decimals) => {
      return `((parseFloat(${denominator}) > 0 ? (${numerator} / parseFloat(${denominator})) * 100 : 0).toFixed(${decimals})) + '%'`
    },
    description: 'Percentage calculation with potential division by zero'
  },
  
  // Math operations with potential NaN
  {
    pattern: /Math\.pow\(([^,]+),\s*([^)]+)\)\s*-\s*1\)\s*\*\s*100/g,
    fix: (match, base, exponent) => `(Math.pow(${base} || 1, ${exponent} || 1) - 1) * 100`,
    description: 'Math.pow with potential undefined values'
  }
];

// Field mapping issues (common mismatches between calculation and display)
const FIELD_MAPPINGS = {
  'EMICalculator.jsx': {
    'results.monthlyEMI': 'results.emi',
    'results.interestEarned': 'results.totalInterest'
  },
  'FDCalculator.jsx': {
    'results.interestEarned': 'results.totalInterest'
  },
  'NPSCalculator.jsx': {
    'results.corpusAtRetirement': 'results.corpus',
    'results.totalContribution': 'results.totalInvestment'
  },
  'SIPCalculator.jsx': {
    'results.maturityValue': 'results.maturityAmount',
    'results.totalInvestment': 'results.totalInvested'
  }
};

// Get all calculator files
const calculatorFiles = fs.readdirSync(calculatorsDir)
  .filter(file => file.endsWith('Calculator.jsx'))
  .sort();

let totalFiles = 0;
let fixedFiles = 0;
let totalFixes = 0;

calculatorFiles.forEach(calculatorFile => {
  const filePath = path.join(calculatorsDir, calculatorFile);
  totalFiles++;
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    let fileFixes = 0;
    
    // Apply field mapping fixes
    if (FIELD_MAPPINGS[calculatorFile]) {
      Object.entries(FIELD_MAPPINGS[calculatorFile]).forEach(([wrong, correct]) => {
        const regex = new RegExp(wrong.replace('.', '\\.'), 'g');
        if (content.includes(wrong)) {
          content = content.replace(regex, correct);
          fileFixes++;
          console.log(`  📝 Fixed field mapping: ${wrong} → ${correct}`);
        }
      });
    }
    
    // Apply NaN pattern fixes
    NAN_PATTERNS.forEach(pattern => {
      if (pattern.fix instanceof Function) {
        content = content.replace(pattern.pattern, pattern.fix);
      } else {
        const matches = content.match(pattern.pattern);
        if (matches) {
          content = content.replace(pattern.pattern, pattern.fix);
          fileFixes += matches.length;
          console.log(`  🔧 Fixed ${matches.length} instances of: ${pattern.description}`);
        }
      }
    });
    
    // Add null checks for common division operations
    const divisionPatterns = [
      {
        pattern: /formatCurrency\(([^)]+)\s*\/\s*parseFloat\(([^)]+)\)\)/g,
        fix: (match, numerator, denominator) => {
          return `formatCurrency(parseFloat(${denominator}) > 0 ? (${numerator}) / parseFloat(${denominator}) : 0)`;
        }
      },
      {
        pattern: /\(\(([^)]+)\s*\/\s*parseFloat\(([^)]+)\)\)\s*\*\s*100/g,
        fix: (match, numerator, denominator) => {
          return `(parseFloat(${denominator}) > 0 ? (${numerator}) / parseFloat(${denominator}) * 100 : 0)`;
        }
      }
    ];
    
    divisionPatterns.forEach(pattern => {
      const matches = [...content.matchAll(pattern.pattern)];
      if (matches.length > 0) {
        content = content.replace(pattern.pattern, pattern.fix);
        fileFixes += matches.length;
        console.log(`  ➗ Added null checks for ${matches.length} division operations`);
      }
    });
    
    // Add safety checks for results object access
    const resultAccessPattern = /formatCurrency\(results\.(\w+)\)/g;
    const resultMatches = [...content.matchAll(resultAccessPattern)];
    resultMatches.forEach(match => {
      const field = match[1];
      const safeAccess = `formatCurrency(results?.${field} || 0)`;
      content = content.replace(match[0], safeAccess);
      fileFixes++;
    });
    
    if (resultMatches.length > 0) {
      console.log(`  🛡️  Added safety checks for ${resultMatches.length} results field accesses`);
    }
    
    // Write file if changes were made
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      fixedFiles++;
      totalFixes += fileFixes;
      console.log(`✅ ${calculatorFile} - Applied ${fileFixes} fix(es)`);
    } else {
      console.log(`✓  ${calculatorFile} - No NaN issues found`);
    }
    
  } catch (error) {
    console.log(`❌ ${calculatorFile} - Error: ${error.message}`);
  }
});

console.log('\n📊 SUMMARY');
console.log('='.repeat(30));
console.log(`Total Files Checked: ${totalFiles}`);
console.log(`Files Fixed: ${fixedFiles}`);
console.log(`Total Fixes Applied: ${totalFixes}`);

if (fixedFiles > 0) {
  console.log('\n🎯 RECOMMENDATIONS');
  console.log('- Test all calculators to ensure calculations work correctly');
  console.log('- Check PDF exports for proper field display');
  console.log('- Verify no new NaN values appear in results');
  console.log('- Consider adding input validation to prevent invalid calculations');
} else {
  console.log('\n✅ All calculators appear to be free of common NaN issues!');
}
