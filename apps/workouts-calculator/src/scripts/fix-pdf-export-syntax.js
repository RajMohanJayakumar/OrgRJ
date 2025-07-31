#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

// Calculators with syntax errors that need fixing
const CALCULATORS_TO_FIX = [
  'RealEstateCalculator.jsx',
  'PropertyValuationCalculator.jsx',
  'PropertyTaxCalculator.jsx',
  'RentVsBuyCalculator.jsx'
];

const calculatorsDir = path.join(process.cwd(), 'src', 'calculators');

console.log('🔧 FIXING PDF EXPORT SYNTAX ERRORS');
console.log('='.repeat(60));

let fixedCount = 0;

CALCULATORS_TO_FIX.forEach(calculatorFile => {
  const filePath = path.join(calculatorsDir, calculatorFile);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  ${calculatorFile} - File not found`);
    return;
  }

  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Pattern to find misplaced PDF export sections
    // Look for patterns like:
    // </div>
    // </>
    //   {/* PDF Export */}
    const misplacedPDFPattern = /(.*<\/div>\s*<\/>\s*)([\s\S]*?)(\{\/\* PDF Export \*\/\}[\s\S]*?<\/CommonPDFExport>\s*\}\s*\)\s*\})/;
    
    const match = content.match(misplacedPDFPattern);
    
    if (match) {
      // Extract the PDF export section
      const beforeClosing = match[1];
      const betweenClosingAndPDF = match[2];
      const pdfExportSection = match[3];
      
      // Find the proper insertion point (before the closing tags)
      // Look for the last meaningful content before </div> </>
      const properInsertionPattern = /(\s*)(.*?)(\s*<\/div>\s*<\/>\s*)/;
      const insertionMatch = beforeClosing.match(properInsertionPattern);
      
      if (insertionMatch) {
        const indentation = insertionMatch[1];
        const lastContent = insertionMatch[2];
        const closingTags = insertionMatch[3];
        
        // Reconstruct with PDF export in the right place
        const fixedContent = content.replace(
          misplacedPDFPattern,
          `${indentation}${lastContent}\n\n      ${pdfExportSection}\n${closingTags}${betweenClosingAndPDF}`
        );
        
        fs.writeFileSync(filePath, fixedContent, 'utf8');
        fixedCount++;
        console.log(`✅ ${calculatorFile} - Fixed PDF export placement`);
      } else {
        console.log(`⚠️  ${calculatorFile} - Could not find proper insertion point`);
      }
    } else {
      // Try alternative pattern for different structures
      const alternativePattern = /(.*?)(\s*<\/>\s*)([\s\S]*?)(\{\/\* PDF Export \*\/\}[\s\S]*?<\/CommonPDFExport>\s*\}\s*\)\s*\})/;
      const altMatch = content.match(alternativePattern);
      
      if (altMatch) {
        const beforeClosing = altMatch[1];
        const closingTag = altMatch[2];
        const betweenClosingAndPDF = altMatch[3];
        const pdfExportSection = altMatch[4];
        
        // Move PDF export before the closing tag
        const fixedContent = content.replace(
          alternativePattern,
          `${beforeClosing}\n\n      ${pdfExportSection}\n${closingTag}${betweenClosingAndPDF}`
        );
        
        fs.writeFileSync(filePath, fixedContent, 'utf8');
        fixedCount++;
        console.log(`✅ ${calculatorFile} - Fixed PDF export placement (alternative pattern)`);
      } else {
        console.log(`✓  ${calculatorFile} - No syntax errors found or already fixed`);
      }
    }

  } catch (error) {
    console.log(`❌ ${calculatorFile} - Error: ${error.message}`);
  }
});

console.log('\n' + '='.repeat(60));
console.log(`🎉 COMPLETED: Fixed ${fixedCount} calculators`);
console.log('🔧 All PDF export syntax errors should now be resolved');
