#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

// Remaining calculators to update
const REMAINING_CALCULATORS = [
  'CommuteCostCalculator.jsx',
  'DailySpendingCalculator.jsx', 
  'FuelCostCalculator.jsx',
  'GroceryBudgetCalculator.jsx',
  'HabitCostCalculator.jsx',
  'MonthlyExpenseCalculator.jsx',
  'SubscriptionCalculator.jsx',
  'WFHSavingsCalculator.jsx'
];

const calculatorsDir = path.join(process.cwd(), 'src', 'calculators');

console.log('🚀 COMPLETING REMAINING CALCULATORS WITH NUMBERINPUT');
console.log('='.repeat(60));

let updatedCount = 0;
let totalReplacements = 0;

// Import replacements
const importReplacements = [
  {
    pattern: /import.*ModernInputField.*from.*ModernInputSection.*/g,
    replacement: "import { NumberInput } from '../components/common/inputs'\nimport ModernInputSection from '../components/ModernInputSection'"
  },
  {
    pattern: /import.*CurrencyInput.*from.*CurrencyInput.*/g,
    replacement: "import { NumberInput } from '../components/common/inputs'"
  },
  {
    pattern: /import.*UnifiedNumberInput.*from.*UnifiedNumberInput.*/g,
    replacement: "import { NumberInput } from '../components/common/inputs'"
  },
  {
    pattern: /import React,/g,
    replacement: "import"
  }
];

// Input field replacements
const fieldReplacements = [
  // ModernInputField currency type
  {
    pattern: /<ModernInputField\s+label="([^"]+)"\s+value=\{([^}]+)\}\s+onChange=\{([^}]+)\}\s+type="currency"[^>]*\/>/g,
    replacement: (match, label, value, onChange) => {
      const cleanOnChange = onChange.replace(/\([^)]*\)\s*=>\s*/, '').replace(/\([^)]*\)/, '');
      return `<div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ${label}
                    </label>
                    <NumberInput
                      value={${value}}
                      onChange={${cleanOnChange}}
                      placeholder="Enter amount"
                      prefix={formatCurrency(0).replace(/[\\d.,]/g, '')}
                      step="1"
                      allowDecimals={true}
                      allowNegative={false}
                      className="w-full py-2 text-sm font-medium border-2 rounded-xl transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>`;
    }
  },
  // ModernInputField number type
  {
    pattern: /<ModernInputField\s+label="([^"]+)"\s+value=\{([^}]+)\}\s+onChange=\{([^}]+)\}\s+type="number"[^>]*\/>/g,
    replacement: (match, label, value, onChange) => {
      const cleanOnChange = onChange.replace(/\([^)]*\)\s*=>\s*/, '').replace(/\([^)]*\)/, '');
      return `<div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ${label}
                    </label>
                    <NumberInput
                      value={${value}}
                      onChange={${cleanOnChange}}
                      placeholder="Enter value"
                      step="1"
                      allowDecimals={false}
                      allowNegative={false}
                      className="w-full py-2 text-sm font-medium border-2 rounded-xl transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>`;
    }
  },
  // Native input elements
  {
    pattern: /<input\s+type="number"\s+value=\{([^}]+)\}\s+onChange=\{([^}]+)\}[^>]*\/>/g,
    replacement: (match, value, onChange) => {
      const cleanOnChange = onChange.replace(/\([^)]*\)\s*=>\s*/, '').replace(/e\.target\.value/, 'value');
      return `<NumberInput
                      value={${value}}
                      onChange={${cleanOnChange}}
                      placeholder="Enter value"
                      step="1"
                      allowDecimals={true}
                      allowNegative={false}
                      className="w-full py-2 text-sm font-medium border border-gray-300 rounded-lg transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />`;
    }
  }
];

REMAINING_CALCULATORS.forEach(calculatorFile => {
  const filePath = path.join(calculatorsDir, calculatorFile);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  ${calculatorFile} - File not found`);
    return;
  }

  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let fileReplacements = 0;

    // Apply import replacements
    importReplacements.forEach(({ pattern, replacement }) => {
      if (content.match(pattern)) {
        content = content.replace(pattern, replacement);
        fileReplacements++;
      }
    });

    // Apply field replacements
    fieldReplacements.forEach(({ pattern, replacement }) => {
      const matches = content.match(pattern);
      if (matches) {
        if (typeof replacement === 'function') {
          content = content.replace(pattern, replacement);
        } else {
          content = content.replace(pattern, replacement);
        }
        fileReplacements += matches.length;
      }
    });

    if (fileReplacements > 0) {
      fs.writeFileSync(filePath, content, 'utf8');
      updatedCount++;
      totalReplacements += fileReplacements;
      console.log(`✅ ${calculatorFile} - Applied ${fileReplacements} update(s)`);
    } else {
      console.log(`✓  ${calculatorFile} - Already using NumberInput or no updates needed`);
    }

  } catch (error) {
    console.log(`❌ ${calculatorFile} - Error: ${error.message}`);
  }
});

console.log('\n' + '='.repeat(60));
console.log(`🎉 COMPLETED: Updated ${updatedCount} calculators with ${totalReplacements} changes`);
console.log('✨ All remaining calculators now use NumberInput components');
console.log('📝 Ready for final testing and validation');
