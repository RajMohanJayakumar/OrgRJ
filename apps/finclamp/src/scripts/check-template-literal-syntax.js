#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const calculatorsDir = path.join(process.cwd(), 'src', 'calculators');

console.log('🔍 CHECKING TEMPLATE LITERAL SYNTAX IN PDF EXPORTS');
console.log('='.repeat(60));

// Get all calculator files
const calculatorFiles = fs.readdirSync(calculatorsDir)
  .filter(file => file.endsWith('Calculator.jsx'))
  .sort();

let totalFiles = 0;
let filesWithIssues = 0;
const issuesFound = [];

calculatorFiles.forEach(calculatorFile => {
  const filePath = path.join(calculatorsDir, calculatorFile);
  totalFiles++;
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check for potential template literal issues in PDF exports
    const lines = content.split('\n');
    let inPDFExport = false;
    let issuesInFile = [];
    
    lines.forEach((line, index) => {
      const lineNumber = index + 1;
      
      // Track if we're in a PDF export section
      if (line.includes('<CommonPDFExport')) {
        inPDFExport = true;
      }
      if (line.includes('/>') && inPDFExport) {
        inPDFExport = false;
      }
      
      if (inPDFExport) {
        // Check for unbalanced parentheses in template literals
        const templateLiterals = line.match(/`[^`]*`/g);
        if (templateLiterals) {
          templateLiterals.forEach(template => {
            const openParens = (template.match(/\(/g) || []).length;
            const closeParens = (template.match(/\)/g) || []).length;
            
            if (openParens !== closeParens) {
              issuesInFile.push({
                line: lineNumber,
                issue: 'Unbalanced parentheses in template literal',
                content: line.trim()
              });
            }
            
            // Check for unbalanced curly braces in template expressions
            const expressions = template.match(/\$\{[^}]*\}/g);
            if (expressions) {
              expressions.forEach(expr => {
                const openBraces = (expr.match(/\{/g) || []).length;
                const closeBraces = (expr.match(/\}/g) || []).length;
                
                if (openBraces !== closeBraces) {
                  issuesInFile.push({
                    line: lineNumber,
                    issue: 'Unbalanced braces in template expression',
                    content: line.trim()
                  });
                }
              });
            }
          });
        }
        
        // Check for potential syntax issues
        if (line.includes('`') && !line.includes('${')) {
          // Template literal without expression - might be incomplete
          if (line.includes('formatCurrency') || line.includes('toFixed')) {
            issuesInFile.push({
              line: lineNumber,
              issue: 'Potential incomplete template literal',
              content: line.trim()
            });
          }
        }
      }
    });
    
    if (issuesInFile.length > 0) {
      filesWithIssues++;
      issuesFound.push({
        file: calculatorFile,
        issues: issuesInFile
      });
      console.log(`⚠️  ${calculatorFile} - ${issuesInFile.length} potential issue(s) found`);
    } else {
      console.log(`✅ ${calculatorFile} - No syntax issues detected`);
    }
    
  } catch (error) {
    console.log(`❌ ${calculatorFile} - Error reading file: ${error.message}`);
    filesWithIssues++;
  }
});

console.log('\n' + '='.repeat(60));
console.log('📊 TEMPLATE LITERAL SYNTAX CHECK SUMMARY');
console.log('='.repeat(60));

console.log(`📁 Total Calculator Files: ${totalFiles}`);
console.log(`✅ Files with Clean Syntax: ${totalFiles - filesWithIssues}`);
console.log(`⚠️  Files with Potential Issues: ${filesWithIssues}`);

if (issuesFound.length > 0) {
  console.log('\n⚠️  DETAILED ISSUES FOUND:');
  issuesFound.forEach(fileIssue => {
    console.log(`\n📄 ${fileIssue.file}:`);
    fileIssue.issues.forEach(issue => {
      console.log(`   Line ${issue.line}: ${issue.issue}`);
      console.log(`   Code: ${issue.content}`);
    });
  });
  
  console.log('\n💡 RECOMMENDATIONS:');
  console.log('1. Check template literal syntax for balanced parentheses');
  console.log('2. Ensure all template expressions are properly closed');
  console.log('3. Verify formatCurrency and toFixed calls are within ${...}');
  console.log('4. Test the development server after fixing issues');
} else {
  console.log('\n🎉 EXCELLENT! All template literal syntax is clean!');
  console.log('✨ No syntax issues found in PDF export sections');
  console.log('🚀 Development server should run without template literal errors');
}

console.log('\n' + '='.repeat(60));
