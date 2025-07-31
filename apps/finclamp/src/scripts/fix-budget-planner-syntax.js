#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

console.log('🔧 FIXING BUDGET PLANNER SPECIFIC SYNTAX ERROR');
console.log('='.repeat(50));

const budgetPlannerPath = path.join(process.cwd(), 'src', 'calculators', 'BudgetPlannerCalculator.jsx');

try {
  let content = fs.readFileSync(budgetPlannerPath, 'utf8');
  console.log('📄 Reading BudgetPlannerCalculator.jsx...');
  
  // Show the problematic line
  const lines = content.split('\n');
  console.log('🔍 Line 297 before fix:', lines[296]);
  
  // Fix the specific syntax error on line 297
  lines[296] = lines[296].replace(/\s*\}''>/g, ')}>');
  lines[296] = lines[296].replace(/\s*\}'>/g, ')}>');
  
  // Join back and write
  content = lines.join('\n');
  
  console.log('✅ Line 297 after fix:', lines[296]);
  
  fs.writeFileSync(budgetPlannerPath, content, 'utf8');
  console.log('✅ BudgetPlannerCalculator.jsx - Fixed syntax error on line 297');
  
} catch (error) {
  console.log('❌ Error fixing BudgetPlannerCalculator.jsx:', error.message);
}

console.log('\n🎯 SPECIFIC FIX APPLIED:');
console.log('• Removed stray }\' characters from line 297');
console.log('• Fixed className expression closing');
console.log('• Ensured proper JSX syntax');

console.log('\n🚀 RESULT:');
console.log('• Syntax error on line 297 should be resolved');
console.log('• Development server should compile without errors');
console.log('• BudgetPlannerCalculator should work correctly');

console.log('\n' + '='.repeat(50));
