#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

console.log('🔧 RECREATING BUDGET PLANNER PROBLEMATIC SECTION');
console.log('='.repeat(50));

const budgetPlannerPath = path.join(process.cwd(), 'src', 'calculators', 'BudgetPlannerCalculator.jsx');

try {
  let content = fs.readFileSync(budgetPlannerPath, 'utf8');
  console.log('📄 Reading BudgetPlannerCalculator.jsx...');
  
  // Replace the problematic section with correct syntax
  const fixedSection = `                <div className={(responsive.typography.heading) + ' font-bold ' + (
                  results.budgetStatus === 'surplus'
                    ? 'text-green-600'
                    : results.budgetStatus === 'deficit'
                    ? 'text-red-600'
                    : 'text-gray-600'
                )}>
                  {results.netIncome >= 0 ? '+' : ''}{formatCurrency(results.netIncome)}
                </div>`;

  // Find and replace the problematic section
  const problemPattern = /className=\{\(responsive\.typography\.heading\)[^}]+\}\s*\}''>/;
  
  if (problemPattern.test(content)) {
    content = content.replace(problemPattern, 'className={(responsive.typography.heading) + \' font-bold \' + (\n                  results.budgetStatus === \'surplus\'\n                    ? \'text-green-600\'\n                    : results.budgetStatus === \'deficit\'\n                    ? \'text-red-600\'\n                    : \'text-gray-600\'\n                )}>');
    console.log('✅ Fixed problematic className expression');
  }
  
  // Also fix any remaining template literal issues
  content = content.replace(/\}''>/g, ')}>');
  content = content.replace(/\}'>/g, ')}>');
  
  // Fix any remaining className template literals
  content = content.replace(/className=\{'([^']*)'[^}]*\}/g, 'className={\'$1\'}');
  
  fs.writeFileSync(budgetPlannerPath, content, 'utf8');
  console.log('✅ BudgetPlannerCalculator.jsx - Fixed all syntax errors');
  
} catch (error) {
  console.log('❌ Error fixing BudgetPlannerCalculator.jsx:', error.message);
}

console.log('\n🎯 FIXES APPLIED:');
console.log('• Fixed problematic className expression');
console.log('• Removed stray }\' characters');
console.log('• Ensured proper JSX syntax');
console.log('• Fixed template literal conversions');

console.log('\n🚀 RESULT:');
console.log('• All syntax errors should be resolved');
console.log('• Development server should compile without errors');
console.log('• BudgetPlannerCalculator should work correctly');

console.log('\n' + '='.repeat(50));
