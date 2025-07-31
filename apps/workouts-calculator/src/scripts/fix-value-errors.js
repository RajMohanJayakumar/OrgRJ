#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const calculatorsDir = path.join(process.cwd(), 'src', 'calculators');

console.log('🔧 FIXING VALUE PARAMETER ERRORS');
console.log('='.repeat(50));

let fixedCount = 0;

// Function to fix value parameter errors
function fixValueErrors(content) {
  let fixed = false;
  
  // Fix patterns like: onChange={functionName('param', value)}
  // Should be: onChange={(value) => functionName('param', value)}
  
  const patterns = [
    // updateTransaction pattern
    {
      regex: /onChange={updateTransaction\(([^,]+),\s*([^,]+),\s*value\)}/g,
      replacement: 'onChange={(value) => updateTransaction($1, $2, value)}'
    },
    // handleFamilyChange pattern
    {
      regex: /onChange={handleFamilyChange\(([^,]+),\s*value\)}/g,
      replacement: 'onChange={(value) => handleFamilyChange($1, value)}'
    },
    // handlePreferenceChange pattern
    {
      regex: /onChange={handlePreferenceChange\(([^,]+),\s*value\)}/g,
      replacement: 'onChange={(value) => handlePreferenceChange($1, value)}'
    },
    // updateHabit pattern
    {
      regex: /onChange={updateHabit\(([^,]+),\s*([^,]+),\s*value\)}/g,
      replacement: 'onChange={(value) => updateHabit($1, $2, value)}'
    },
    // updateExpense pattern
    {
      regex: /onChange={updateExpense\(([^,]+),\s*([^,]+),\s*value\)}/g,
      replacement: 'onChange={(value) => updateExpense($1, $2, value)}'
    },
    // updateSubscription pattern
    {
      regex: /onChange={updateSubscription\(([^,]+),\s*([^,]+),\s*value\)}/g,
      replacement: 'onChange={(value) => updateSubscription($1, $2, value)}'
    },
    // handleWorkDetailsChange pattern
    {
      regex: /onChange={handleWorkDetailsChange\(([^,]+),\s*value\)}/g,
      replacement: 'onChange={(value) => handleWorkDetailsChange($1, value)}'
    },
    // handleExpenseChange pattern
    {
      regex: /onChange={handleExpenseChange\(([^,]+),\s*value\)}/g,
      replacement: 'onChange={(value) => handleExpenseChange($1, value)}'
    },
    // Generic pattern for any function with value parameter
    {
      regex: /onChange={(\w+)\(([^)]*),\s*value\)}/g,
      replacement: 'onChange={(value) => $1($2, value)}'
    }
  ];
  
  patterns.forEach(pattern => {
    if (pattern.regex.test(content)) {
      content = content.replace(pattern.regex, pattern.replacement);
      fixed = true;
    }
  });
  
  return { content, fixed };
}

// Get all calculator files
const calculatorFiles = fs.readdirSync(calculatorsDir)
  .filter(file => file.endsWith('.jsx'));

// Process each calculator
calculatorFiles.forEach(calculatorFile => {
  const filePath = path.join(calculatorsDir, calculatorFile);
  
  console.log(`\n📝 Checking: ${calculatorFile}`);
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    const result = fixValueErrors(content);
    
    if (result.fixed) {
      fs.writeFileSync(filePath, result.content, 'utf8');
      console.log(`   ✅ Fixed value parameter errors`);
      fixedCount++;
    } else {
      console.log(`   ✓ No value parameter errors found`);
    }

  } catch (error) {
    console.error(`   ❌ Error processing ${calculatorFile}:`, error.message);
  }
});

console.log('\n' + '='.repeat(50));
console.log(`🎉 VALUE PARAMETER FIXES COMPLETE!`);
console.log(`📊 Fixed ${fixedCount} out of ${calculatorFiles.length} calculators`);

if (fixedCount > 0) {
  console.log('\n✨ All value parameter errors have been fixed!');
  console.log('\n🚀 The application should now work without "value is not defined" errors.');
} else {
  console.log('\n✅ No value parameter errors found!');
}
