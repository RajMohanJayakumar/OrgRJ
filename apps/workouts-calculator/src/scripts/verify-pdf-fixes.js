#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

console.log('🔍 VERIFYING PDF EXPORT FIXES');
console.log('='.repeat(50));

const calculatorsDir = path.join(process.cwd(), 'src', 'calculators');

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
    const lines = content.split('\n');
    let fileIssues = [];
    let inPDFExport = false;
    
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
        // Check for remaining template literals
        if (line.includes('`${') && line.includes('}`')) {
          fileIssues.push({
            line: lineNumber,
            issue: 'Template literal still present',
            content: line.trim()
          });
        }
        
        // Check for unbalanced parentheses
        const openParens = (line.match(/\(/g) || []).length;
        const closeParens = (line.match(/\)/g) || []).length;
        if (openParens !== closeParens && (line.includes('toFixed') || line.includes('Math.'))) {
          fileIssues.push({
            line: lineNumber,
            issue: 'Potentially unbalanced parentheses',
            content: line.trim()
          });
        }
        
        // Check for potential string concatenation issues
        if (line.includes("' + '") && line.includes('formatCurrency')) {
          fileIssues.push({
            line: lineNumber,
            issue: 'Potential string concatenation with formatCurrency',
            content: line.trim()
          });
        }
        
        // Check for complex expressions that might not evaluate
        if (line.includes('parseInt(') && line.includes('parseFloat(') && line.includes('toFixed(')) {
          fileIssues.push({
            line: lineNumber,
            issue: 'Complex expression - verify evaluation',
            content: line.trim()
          });
        }
      }
    });
    
    if (fileIssues.length > 0) {
      filesWithIssues++;
      issuesFound.push({
        file: calculatorFile,
        issues: fileIssues
      });
      console.log(`⚠️  ${calculatorFile} - ${fileIssues.length} potential issue(s) found`);
    } else {
      console.log(`✅ ${calculatorFile} - PDF export looks good`);
    }
    
  } catch (error) {
    console.log(`❌ ${calculatorFile} - Error reading file: ${error.message}`);
    filesWithIssues++;
  }
});

console.log('\n' + '='.repeat(50));
console.log('📊 PDF EXPORT VERIFICATION SUMMARY');
console.log('='.repeat(50));

console.log(`📁 Total Calculator Files: ${totalFiles}`);
console.log(`✅ Files with Clean PDF Exports: ${totalFiles - filesWithIssues}`);
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
  console.log('1. Review files with potential issues');
  console.log('2. Test PDF generation for flagged calculators');
  console.log('3. Ensure all expressions evaluate to actual values');
  console.log('4. Check for proper string concatenation');
} else {
  console.log('\n🎉 EXCELLENT! All PDF exports look clean!');
  console.log('✨ No template literal or syntax issues found');
  console.log('🚀 PDF generation should work perfectly');
}

console.log('\n📋 TESTING CHECKLIST:');
console.log('□ Test RD Calculator PDF export');
console.log('□ Verify values show as numbers, not expressions');
console.log('□ Check percentage formatting (e.g., "12%" not "${...}%")');
console.log('□ Confirm currency formatting works');
console.log('□ Test a few other calculators randomly');

console.log('\n🎯 EXPECTED PDF CONTENT:');
console.log('✅ Monthly Deposit: $12,312 (not ${...})');
console.log('✅ Interest Rate: 12% p.a. (not ${...}%)');
console.log('✅ Time Period: 12 years (not ${...} years)');
console.log('✅ All calculations showing actual numbers');

console.log('\n' + '='.repeat(50));
