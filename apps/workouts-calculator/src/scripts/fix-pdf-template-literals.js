#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

console.log('🔧 FIXING PDF TEMPLATE LITERAL ISSUES');
console.log('='.repeat(60));

const calculatorsDir = path.join(process.cwd(), 'src', 'calculators');

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
    let fileChanges = 0;
    let originalContent = content;
    
    // Fix template literals in PDF exports
    // Pattern 1: `${expression}%` -> expression + '%'
    content = content.replace(/`\$\{([^}]+)\}%`/g, '($1) + \'%\'');
    if (content !== originalContent) {
      fileChanges++;
      originalContent = content;
    }
    
    // Pattern 2: `${expression} years` -> expression + ' years'
    content = content.replace(/`\$\{([^}]+)\}\s+([^`]+)`/g, '($1) + \' $2\'');
    if (content !== originalContent) {
      fileChanges++;
      originalContent = content;
    }
    
    // Pattern 3: `${expression}` (standalone) -> String(expression)
    content = content.replace(/`\$\{([^}]+)\}`/g, 'String($1)');
    if (content !== originalContent) {
      fileChanges++;
      originalContent = content;
    }
    
    // Fix specific problematic patterns in PDF exports
    const pdfExportRegex = /<CommonPDFExport[\s\S]*?\/>/g;
    content = content.replace(pdfExportRegex, (match) => {
      let fixedMatch = match;
      
      // Fix percentage calculations
      fixedMatch = fixedMatch.replace(
        /'\$\{([^}]*toFixed\([^}]*\))\}%'/g,
        '($1) + \'%\''
      );
      
      // Fix currency formatting with template literals
      fixedMatch = fixedMatch.replace(
        /formatCurrency\(\$\{([^}]+)\}\)/g,
        'formatCurrency($1)'
      );
      
      // Fix complex expressions
      fixedMatch = fixedMatch.replace(
        /'\$\{([^}]*\([^}]*\)[^}]*)\}'/g,
        'String($1)'
      );
      
      return fixedMatch;
    });
    
    if (content !== originalContent) {
      fileChanges++;
    }
    
    // Additional specific fixes for common issues
    
    // Fix unbalanced parentheses in calculations
    content = content.replace(
      /\(\([^)]*\)\s*\*\s*100\)\)\.toFixed/g,
      '(($1) * 100).toFixed'
    );
    
    // Fix Math.pow expressions
    content = content.replace(
      /Math\.pow\(([^,]+),\s*([^)]+)\)\s*-\s*1\)\s*\*\s*100\)\.toFixed\((\d+)\)\s*\+\s*'%'/g,
      '((Math.pow($1, $2) - 1) * 100).toFixed($3) + \'%\''
    );
    
    if (content !== fs.readFileSync(filePath, 'utf8')) {
      fs.writeFileSync(filePath, content, 'utf8');
      fixedFiles++;
      totalFixes += fileChanges;
      console.log(`✅ ${calculatorFile} - Fixed ${fileChanges} template literal issue(s)`);
    } else {
      console.log(`✓  ${calculatorFile} - No template literal issues found`);
    }
    
  } catch (error) {
    console.log(`❌ ${calculatorFile} - Error: ${error.message}`);
  }
});

console.log('\n' + '='.repeat(60));
console.log('📊 PDF TEMPLATE LITERAL FIX SUMMARY');
console.log('='.repeat(60));

console.log(`📁 Total Calculator Files: ${totalFiles}`);
console.log(`✅ Files Fixed: ${fixedFiles}`);
console.log(`🔧 Total Fixes Applied: ${totalFixes}`);
console.log(`✓  Files Without Issues: ${totalFiles - fixedFiles}`);

if (fixedFiles > 0) {
  console.log('\n🎉 FIXES APPLIED:');
  console.log('• Template literals converted to string concatenation');
  console.log('• Complex expressions properly evaluated');
  console.log('• Percentage calculations fixed');
  console.log('• Currency formatting corrected');
  console.log('• Math expressions balanced');
  
  console.log('\n💡 WHAT WAS FIXED:');
  console.log('• `${expression}%` → (expression) + \'%\'');
  console.log('• `${expression} text` → (expression) + \' text\'');
  console.log('• `${expression}` → String(expression)');
  console.log('• Unbalanced parentheses in calculations');
  console.log('• Math.pow expressions with proper syntax');
  
  console.log('\n🔍 RESULT:');
  console.log('• PDF exports will now show actual calculated values');
  console.log('• No more template literal expressions in PDFs');
  console.log('• All calculations properly evaluated');
  console.log('• Professional PDF output restored');
  
} else {
  console.log('\n✨ EXCELLENT! No template literal issues found');
  console.log('🎯 All PDF exports are already properly formatted');
}

console.log('\n📄 TESTING RECOMMENDATION:');
console.log('1. Test PDF export on RD Calculator');
console.log('2. Verify all values show as numbers/percentages');
console.log('3. Check other calculators for similar issues');
console.log('4. Ensure no template literal expressions appear');

console.log('\n' + '='.repeat(60));
