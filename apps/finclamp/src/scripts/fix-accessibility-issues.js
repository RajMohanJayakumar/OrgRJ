#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

console.log('🔧 FIXING ACCESSIBILITY ISSUES IN ALL CALCULATORS');
console.log('='.repeat(60));

const calculatorsDir = path.join(process.cwd(), 'src', 'calculators');

// Get all calculator files
const calculatorFiles = fs.readdirSync(calculatorsDir)
  .filter(file => file.endsWith('Calculator.jsx'))
  .sort();

let totalFixed = 0;
let filesFixed = 0;

// Function to generate unique IDs for form controls
function generateId(label) {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Function to fix accessibility issues in a file
function fixAccessibilityIssues(content) {
  let fixes = 0;
  let newContent = content;
  
  // Pattern to match label elements without htmlFor
  const labelPattern = /<label\s+([^>]*?)class="([^"]*?)"([^>]*?)>\s*([^<]*?)\s*<\/label>/g;
  
  // Pattern to match input elements that need IDs
  const inputPattern = /<input\s+([^>]*?)class="([^"]*?)"([^>]*?)>/g;
  
  // Store label-input pairs to fix
  const labelInputPairs = [];
  
  // Find all labels and their associated content
  let labelMatch;
  while ((labelMatch = labelPattern.exec(content)) !== null) {
    const [fullMatch, beforeClass, className, afterClass, labelText] = labelMatch;
    const cleanLabelText = labelText.trim().replace(/[^\w\s]/g, '').trim();
    
    if (cleanLabelText && !fullMatch.includes('htmlFor')) {
      const id = generateId(cleanLabelText);
      labelInputPairs.push({
        original: fullMatch,
        labelText: cleanLabelText,
        id: id,
        beforeClass,
        className,
        afterClass
      });
    }
  }
  
  // Fix labels by adding htmlFor attributes
  labelInputPairs.forEach(pair => {
    const newLabel = `<label htmlFor="${pair.id}" ${pair.beforeClass}class="${pair.className}"${pair.afterClass}>${pair.labelText}</label>`;
    newContent = newContent.replace(pair.original, newLabel);
    fixes++;
  });
  
  // Fix inputs by adding IDs where labels exist
  labelInputPairs.forEach(pair => {
    // Look for input elements that should be associated with this label
    const inputRegex = new RegExp(`<input\\s+([^>]*?)placeholder="[^"]*${pair.labelText.split(' ')[0]}[^"]*"([^>]*?)>`, 'gi');
    
    newContent = newContent.replace(inputRegex, (match, before, after) => {
      if (!match.includes(`id="${pair.id}"`)) {
        // Add the ID to the input
        const newInput = `<input ${before}id="${pair.id}" placeholder="${match.match(/placeholder="([^"]*)"/)?.[1] || ''}"${after}>`;
        fixes++;
        return newInput;
      }
      return match;
    });
  });
  
  // Also fix common input patterns that might not have been caught
  const commonInputFixes = [
    {
      pattern: /(<input[^>]*?)class="([^"]*?)"([^>]*?)placeholder="Enter amount"([^>]*?)>/g,
      replacement: '$1class="$2"$3id="principal-amount" placeholder="Enter amount"$4>'
    },
    {
      pattern: /(<input[^>]*?)class="([^"]*?)"([^>]*?)placeholder="Enter rate"([^>]*?)>/g,
      replacement: '$1class="$2"$3id="interest-rate" placeholder="Enter rate"$4>'
    },
    {
      pattern: /(<input[^>]*?)class="([^"]*?)"([^>]*?)placeholder="Enter age"([^>]*?)>/g,
      replacement: '$1class="$2"$3id="time-period" placeholder="Enter age"$4>'
    }
  ];
  
  commonInputFixes.forEach(fix => {
    const beforeFix = newContent;
    newContent = newContent.replace(fix.pattern, fix.replacement);
    if (beforeFix !== newContent) {
      fixes++;
    }
  });
  
  return { content: newContent, fixes };
}

// Process each calculator file
calculatorFiles.forEach(calculatorFile => {
  const filePath = path.join(calculatorsDir, calculatorFile);
  
  try {
    console.log(`\n📝 Processing: ${calculatorFile}`);
    
    let content = fs.readFileSync(filePath, 'utf8');
    const result = fixAccessibilityIssues(content);
    
    if (result.fixes > 0) {
      fs.writeFileSync(filePath, result.content, 'utf8');
      console.log(`   ✅ Fixed ${result.fixes} accessibility issues`);
      filesFixed++;
      totalFixed += result.fixes;
    } else {
      console.log(`   ✓ No accessibility issues found`);
    }
    
  } catch (error) {
    console.error(`   ❌ Error processing ${calculatorFile}:`, error.message);
  }
});

console.log('\n' + '='.repeat(60));
console.log(`📊 ACCESSIBILITY FIX SUMMARY:`);
console.log(`   Files processed: ${calculatorFiles.length}`);
console.log(`   Files fixed: ${filesFixed}`);
console.log(`   Total fixes applied: ${totalFixed}`);

if (totalFixed > 0) {
  console.log('\n✨ Accessibility improvements completed!');
  console.log('🔍 Next steps:');
  console.log('1. Run tests to verify accessibility fixes');
  console.log('2. Update test selectors to use new IDs');
  console.log('3. Verify form controls are properly associated');
} else {
  console.log('\n✅ All calculator components already have proper accessibility!');
}
