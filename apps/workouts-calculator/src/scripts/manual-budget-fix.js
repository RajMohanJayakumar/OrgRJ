#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

console.log('🔧 MANUAL BUDGET PLANNER FIX');
console.log('='.repeat(40));

const budgetPlannerPath = path.join(process.cwd(), 'src', 'calculators', 'BudgetPlannerCalculator.jsx');

try {
  let content = fs.readFileSync(budgetPlannerPath, 'utf8');
  console.log('📄 Reading BudgetPlannerCalculator.jsx...');
  
  // Manual character-by-character replacement
  content = content.replace(/\}\'\'\>/g, ')}>');
  content = content.replace(/\}\'\>/g, ')}>');
  
  // Also handle any Unicode variations
  content = content.replace(/\}'\>/g, ')}>');
  content = content.replace(/\}'\>/g, ')}>');
  
  fs.writeFileSync(budgetPlannerPath, content, 'utf8');
  console.log('✅ Applied manual fix to BudgetPlannerCalculator.jsx');
  
} catch (error) {
  console.log('❌ Error:', error.message);
}

console.log('\n🎯 Manual fix completed');
console.log('='.repeat(40));
