#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const calculatorsDir = path.join(process.cwd(), 'src', 'calculators');

console.log('🔍 PDF CONTENT QUALITY VERIFICATION');
console.log('='.repeat(60));

// Get all calculator files
const calculatorFiles = fs.readdirSync(calculatorsDir)
  .filter(file => file.endsWith('Calculator.jsx'))
  .sort();

let totalCalculators = 0;
let calculatorsWithPDF = 0;
let calculatorsWithComprehensiveData = 0;
let calculatorsWithBasicData = 0;
let calculatorsWithoutPDF = 0;

const comprehensive = [];
const basic = [];
const missing = [];
const issues = [];

calculatorFiles.forEach(calculatorFile => {
  const filePath = path.join(calculatorsDir, calculatorFile);
  totalCalculators++;
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check if calculator has PDF export
    if (content.includes('CommonPDFExport')) {
      calculatorsWithPDF++;
      
      // Extract PDF export data
      const pdfExportMatch = content.match(/CommonPDFExport[\s\S]*?inputs=\{([\s\S]*?)\}[\s\S]*?results=\{([\s\S]*?)\}/);
      
      if (pdfExportMatch) {
        const inputsSection = pdfExportMatch[1];
        const resultsSection = pdfExportMatch[2];
        
        // Count input and result fields
        const inputFields = (inputsSection.match(/'/g) || []).length / 2;
        const resultFields = (resultsSection.match(/'/g) || []).length / 2;
        
        // Check for comprehensive data (good number of fields and meaningful content)
        const hasFormatCurrency = content.includes('formatCurrency');
        const hasCalculatedFields = resultsSection.includes('toFixed') || resultsSection.includes('Math.');
        const hasConditionalLogic = inputsSection.includes('?') || resultsSection.includes('?');
        
        if (inputFields >= 5 && resultFields >= 5 && hasFormatCurrency && (hasCalculatedFields || hasConditionalLogic)) {
          calculatorsWithComprehensiveData++;
          comprehensive.push({
            file: calculatorFile,
            inputFields,
            resultFields,
            features: {
              formatCurrency: hasFormatCurrency,
              calculatedFields: hasCalculatedFields,
              conditionalLogic: hasConditionalLogic
            }
          });
          console.log(`✅ ${calculatorFile} - Comprehensive (${inputFields} inputs, ${resultFields} results)`);
        } else {
          calculatorsWithBasicData++;
          basic.push({
            file: calculatorFile,
            inputFields,
            resultFields,
            issues: [
              inputFields < 5 ? 'Few input fields' : null,
              resultFields < 5 ? 'Few result fields' : null,
              !hasFormatCurrency ? 'No currency formatting' : null,
              !hasCalculatedFields && !hasConditionalLogic ? 'No dynamic calculations' : null
            ].filter(Boolean)
          });
          console.log(`⚠️  ${calculatorFile} - Basic (${inputFields} inputs, ${resultFields} results)`);
        }
      } else {
        calculatorsWithBasicData++;
        basic.push({
          file: calculatorFile,
          inputFields: 0,
          resultFields: 0,
          issues: ['Could not parse PDF export structure']
        });
        console.log(`⚠️  ${calculatorFile} - Has PDF but structure unclear`);
      }
    } else {
      calculatorsWithoutPDF++;
      missing.push(calculatorFile);
      console.log(`❌ ${calculatorFile} - Missing PDF export`);
    }
    
  } catch (error) {
    issues.push(`${calculatorFile} - Error reading file: ${error.message}`);
    console.log(`💥 ${calculatorFile} - Error: ${error.message}`);
  }
});

console.log('\n' + '='.repeat(60));
console.log('📊 PDF CONTENT QUALITY SUMMARY');
console.log('='.repeat(60));

console.log(`📁 Total Calculators: ${totalCalculators}`);
console.log(`✅ With PDF Export: ${calculatorsWithPDF} (${((calculatorsWithPDF/totalCalculators)*100).toFixed(1)}%)`);
console.log(`🎯 Comprehensive Data: ${calculatorsWithComprehensiveData} (${((calculatorsWithComprehensiveData/totalCalculators)*100).toFixed(1)}%)`);
console.log(`⚠️  Basic Data: ${calculatorsWithBasicData} (${((calculatorsWithBasicData/totalCalculators)*100).toFixed(1)}%)`);
console.log(`❌ Missing PDF: ${calculatorsWithoutPDF} (${((calculatorsWithoutPDF/totalCalculators)*100).toFixed(1)}%)`);

if (comprehensive.length > 0) {
  console.log('\n✅ CALCULATORS WITH COMPREHENSIVE PDF DATA:');
  comprehensive.forEach(calc => {
    console.log(`   • ${calc.file} (${calc.inputFields}/${calc.resultFields} fields)`);
    const features = Object.entries(calc.features)
      .filter(([key, value]) => value)
      .map(([key]) => key);
    if (features.length > 0) {
      console.log(`     Features: ${features.join(', ')}`);
    }
  });
}

if (basic.length > 0) {
  console.log('\n⚠️  CALCULATORS WITH BASIC PDF DATA:');
  basic.forEach(calc => {
    console.log(`   • ${calc.file} (${calc.inputFields}/${calc.resultFields} fields)`);
    if (calc.issues.length > 0) {
      console.log(`     Issues: ${calc.issues.join(', ')}`);
    }
  });
}

if (missing.length > 0) {
  console.log('\n❌ CALCULATORS MISSING PDF EXPORTS:');
  missing.forEach(calc => console.log(`   • ${calc}`));
}

if (issues.length > 0) {
  console.log('\n💥 CALCULATORS WITH ISSUES:');
  issues.forEach(issue => console.log(`   • ${issue}`));
}

// Generate quality score
const qualityScore = ((calculatorsWithComprehensiveData / totalCalculators) * 100).toFixed(1);

console.log('\n' + '='.repeat(60));
console.log('📈 PDF CONTENT QUALITY SCORE');
console.log('='.repeat(60));

console.log(`🎯 Quality Score: ${qualityScore}%`);

if (qualityScore >= 90) {
  console.log('🌟 EXCELLENT! PDF content quality is outstanding');
  console.log('📄 Users will receive detailed, professional reports');
} else if (qualityScore >= 75) {
  console.log('👍 GOOD! PDF content quality is solid');
  console.log('📄 Most users will receive comprehensive reports');
} else if (qualityScore >= 50) {
  console.log('⚠️  FAIR! PDF content quality needs improvement');
  console.log('📄 Some calculators need more detailed data');
} else {
  console.log('❌ POOR! PDF content quality needs significant work');
  console.log('📄 Many calculators lack comprehensive data');
}

// Recommendations
console.log('\n' + '='.repeat(60));
console.log('💡 RECOMMENDATIONS');
console.log('='.repeat(60));

if (calculatorsWithComprehensiveData === totalCalculators) {
  console.log('🎉 PERFECT! All calculators have comprehensive PDF exports!');
  console.log('📄 All PDFs contain detailed, meaningful data');
  console.log('✨ PDF export system is fully optimized');
} else {
  if (basic.length > 0) {
    console.log(`⚠️  ${basic.length} calculators have basic PDF data`);
    console.log('   → Add more input/result fields for comprehensive reports');
    console.log('   → Include calculated fields and conditional logic');
    console.log('   → Ensure proper currency formatting');
  }
  
  if (missing.length > 0) {
    console.log(`❌ ${missing.length} calculators are missing PDF exports entirely`);
    console.log('   → Add CommonPDFExport components to these calculators');
  }
  
  console.log('\n🔧 NEXT STEPS:');
  console.log('1. Enhance basic PDF exports with more detailed data');
  console.log('2. Add missing PDF exports where needed');
  console.log('3. Test PDF generation for all calculators');
  console.log('4. Verify PDF content shows meaningful, formatted data');
}

// Create a detailed report
const reportData = {
  timestamp: new Date().toISOString(),
  summary: {
    totalCalculators,
    calculatorsWithPDF,
    calculatorsWithComprehensiveData,
    calculatorsWithBasicData,
    calculatorsWithoutPDF,
    qualityScore: parseFloat(qualityScore)
  },
  comprehensive,
  basic,
  missing,
  issues
};

const reportPath = path.join(process.cwd(), 'pdf-content-quality-report.json');
fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2), 'utf8');

console.log(`\n📋 Detailed report saved to: pdf-content-quality-report.json`);
console.log('\n' + '='.repeat(60));

// Exit with appropriate code
if (qualityScore >= 90) {
  console.log('🎯 SUCCESS: PDF content quality is excellent!');
  process.exit(0);
} else if (qualityScore >= 75) {
  console.log('👍 SUCCESS: PDF content quality is good!');
  process.exit(0);
} else {
  console.log('⚠️  ATTENTION: PDF content quality needs improvement');
  process.exit(1);
}
