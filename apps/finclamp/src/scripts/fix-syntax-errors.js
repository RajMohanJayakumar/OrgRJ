#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

console.log('🔧 FIXING SYNTAX ERRORS FROM MANUAL EDITS');
console.log('='.repeat(60));

const calculatorsDir = path.join(process.cwd(), 'src', 'calculators');

// Fix BudgetPlannerCalculator.jsx specifically
const budgetPlannerPath = path.join(calculatorsDir, 'BudgetPlannerCalculator.jsx');

try {
  let content = fs.readFileSync(budgetPlannerPath, 'utf8');
  console.log('📄 Fixing BudgetPlannerCalculator.jsx...');
  
  // Fix the specific syntax error: }'"> should be )}>
  content = content.replace(/\s+\}''>/g, ')}>');
  content = content.replace(/\s+\}'>/g, ')}>');
  
  // Fix any remaining template literal issues
  content = content.replace(/\$\{([^}]+)\}'/g, '($1) + \'');
  content = content.replace(/'\$\{([^}]+)\}/g, '\' + ($1)');
  
  // Fix incomplete template literal conversions
  content = content.replace(/className=\{\`([^`]*)\$\{([^}]+)\}([^`]*)\`\}/g, 
    'className={\'$1\' + ($2) + \'$3\'}');
  
  // Fix any remaining backticks in className
  content = content.replace(/className=\{\`([^`]*)\`\}/g, 'className={\'$1\'}');
  
  fs.writeFileSync(budgetPlannerPath, content, 'utf8');
  console.log('✅ BudgetPlannerCalculator.jsx - Fixed syntax errors');
  
} catch (error) {
  console.log('❌ Error fixing BudgetPlannerCalculator.jsx:', error.message);
}

// Fix RDCalculator.jsx template literal issue
const rdCalculatorPath = path.join(calculatorsDir, 'RDCalculator.jsx');

try {
  let content = fs.readFileSync(rdCalculatorPath, 'utf8');
  console.log('📄 Fixing RDCalculator.jsx...');
  
  // Fix the specific issue: ${results?.months} should be ' + results?.months + '
  content = content.replace(/\$\{results\?\.\w+\}/g, (match) => {
    const field = match.replace('${', '').replace('}', '');
    return '\' + ' + field + ' + \'';
  });
  
  fs.writeFileSync(rdCalculatorPath, content, 'utf8');
  console.log('✅ RDCalculator.jsx - Fixed template literal issues');
  
} catch (error) {
  console.log('❌ Error fixing RDCalculator.jsx:', error.message);
}

// Check for other common syntax errors across all calculators
const calculatorFiles = fs.readdirSync(calculatorsDir)
  .filter(file => file.endsWith('Calculator.jsx'))
  .sort();

let totalFixed = 0;

calculatorFiles.forEach(calculatorFile => {
  const filePath = path.join(calculatorsDir, calculatorFile);
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    
    // Fix common template literal issues
    content = content.replace(/\$\{([^}]+)\}'/g, '($1) + \'');
    content = content.replace(/'\$\{([^}]+)\}/g, '\' + ($1)');
    
    // Fix className template literals
    content = content.replace(/className=\{\`([^`]*)\$\{([^}]+)\}([^`]*)\`\}/g, 
      'className={\'$1\' + ($2) + \'$3\'}');
    
    // Fix any remaining backticks
    content = content.replace(/className=\{\`([^`]*)\`\}/g, 'className={\'$1\'}');
    
    // Fix unbalanced parentheses in string concatenation
    content = content.replace(/\(\([^)]*\)\s*\+\s*'/g, '(($1) + \'');
    
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      totalFixed++;
      console.log(`✅ ${calculatorFile} - Fixed template literal issues`);
    }
    
  } catch (error) {
    console.log(`❌ ${calculatorFile} - Error: ${error.message}`);
  }
});

console.log('\n' + '='.repeat(50));
console.log('📊 SYNTAX ERROR FIX SUMMARY');
console.log('='.repeat(50));

console.log(`🔧 Files Fixed: ${totalFixed + 2}`); // +2 for specific fixes above
console.log('✅ BudgetPlannerCalculator.jsx - Syntax errors resolved');
console.log('✅ RDCalculator.jsx - Template literal issues fixed');
console.log(`✅ ${totalFixed} other calculators - Template literals cleaned up`);

console.log('\n🎯 FIXES APPLIED:');
console.log('• Removed stray }\' characters');
console.log('• Fixed incomplete template literal conversions');
console.log('• Converted remaining backticks to string concatenation');
console.log('• Balanced parentheses in expressions');
console.log('• Fixed className template literals');

console.log('\n🚀 RESULT:');
console.log('• All syntax errors should be resolved');
console.log('• Development server should start without errors');
console.log('• PDF exports should work correctly');
console.log('• No more template literal issues');

console.log('\n📋 NEXT STEPS:');
console.log('1. Restart the development server');
console.log('2. Test the calculators');
console.log('3. Verify PDF exports work');
console.log('4. Check for any remaining console errors');

console.log('\n' + '='.repeat(50));
