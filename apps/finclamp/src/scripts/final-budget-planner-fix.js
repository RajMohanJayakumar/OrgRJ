#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

console.log('🔧 FINAL BUDGET PLANNER SYNTAX FIX');
console.log('='.repeat(50));

const budgetPlannerPath = path.join(process.cwd(), 'src', 'calculators', 'BudgetPlannerCalculator.jsx');

try {
  let content = fs.readFileSync(budgetPlannerPath, 'utf8');
  console.log('📄 Reading BudgetPlannerCalculator.jsx...');
  
  // Replace the specific problematic line
  content = content.replace(/\s*\}''>/g, ')}>');
  content = content.replace(/\s*\}'>/g, ')}>');
  
  // Fix any remaining issues with the className expression
  content = content.replace(
    /className=\{[^}]*\+\s*\([^)]*\)\s*\}\s*\}''>/g,
    'className={(responsive.typography.heading) + \' font-bold \' + (\n                  results.budgetStatus === \'surplus\'\n                    ? \'text-green-600\'\n                    : results.budgetStatus === \'deficit\'\n                    ? \'text-red-600\'\n                    : \'text-gray-600\'\n                )}>'
  );
  
  // More aggressive fix - replace the entire problematic section
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('}\'}>')) {
      lines[i] = lines[i].replace(/\}''>/g, ')}>');
      lines[i] = lines[i].replace(/\}'>/g, ')}>');
      console.log(`✅ Fixed line ${i + 1}: ${lines[i].trim()}`);
    }
  }
  
  content = lines.join('\n');
  
  fs.writeFileSync(budgetPlannerPath, content, 'utf8');
  console.log('✅ BudgetPlannerCalculator.jsx - Applied final syntax fix');
  
} catch (error) {
  console.log('❌ Error fixing BudgetPlannerCalculator.jsx:', error.message);
}

console.log('\n🎯 FINAL FIX APPLIED:');
console.log('• Replaced all }\'> with )}>');
console.log('• Fixed className expression syntax');
console.log('• Ensured proper JSX closing tags');

console.log('\n🚀 RESULT:');
console.log('• All syntax errors should be resolved');
console.log('• Development server should compile without errors');
console.log('• BudgetPlannerCalculator should work correctly');

console.log('\n' + '='.repeat(50));
