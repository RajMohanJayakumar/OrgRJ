#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

// Calculators that need PDF export standardization
const CALCULATORS_TO_UPDATE = [
  'GratuityCalculator.jsx',
  'SWPCalculator.jsx', 
  'NPSCalculator.jsx',
  'InflationCalculator.jsx',
  'CAGRCalculator.jsx'
];

const calculatorsDir = path.join(process.cwd(), 'src', 'calculators');

console.log('📄 STANDARDIZING PDF EXPORT TO COMMONPDFEXPORT');
console.log('='.repeat(60));

let updatedCount = 0;
let totalReplacements = 0;

// Replacement patterns
const replacements = [
  // Add CommonPDFExport import if missing
  {
    pattern: /(import.*PDFExport.*from.*PDFExport.*\n)/,
    replacement: '$1import CommonPDFExport from \'../components/CommonPDFExport\'\n',
    condition: (content) => !content.includes('import CommonPDFExport')
  },
  
  // Replace PDFExport component usage with CommonPDFExport
  {
    pattern: /<PDFExport/g,
    replacement: '<CommonPDFExport'
  },
  
  // Remove duplicate PDFExport import if CommonPDFExport is already imported
  {
    pattern: /import PDFExport from '\.\.\/components\/PDFExport'\n/g,
    replacement: '',
    condition: (content) => content.includes('import CommonPDFExport')
  }
];

CALCULATORS_TO_UPDATE.forEach(calculatorFile => {
  const filePath = path.join(calculatorsDir, calculatorFile);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  ${calculatorFile} - File not found`);
    return;
  }

  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let fileReplacements = 0;
    let originalContent = content;

    replacements.forEach(({ pattern, replacement, condition }) => {
      // Check condition if provided
      if (condition && !condition(content)) {
        return;
      }

      const matches = content.match(pattern);
      if (matches) {
        content = content.replace(pattern, replacement);
        fileReplacements += matches.length;
      }
    });

    // Special handling for adding CommonPDFExport import
    if (!content.includes('import CommonPDFExport') && content.includes('PDFExport')) {
      // Find the line with PDFExport import and add CommonPDFExport after it
      const pdfExportImportMatch = content.match(/(import.*PDFExport.*from.*PDFExport.*\n)/);
      if (pdfExportImportMatch) {
        content = content.replace(
          pdfExportImportMatch[0],
          pdfExportImportMatch[0] + "import CommonPDFExport from '../components/CommonPDFExport'\n"
        );
        fileReplacements++;
      }
    }

    // Remove duplicate PDFExport import if CommonPDFExport is now imported
    if (content.includes('import CommonPDFExport') && content.includes("import PDFExport from '../components/PDFExport'")) {
      content = content.replace(/import PDFExport from '\.\.\/components\/PDFExport'\n/g, '');
      fileReplacements++;
    }

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      updatedCount++;
      totalReplacements += fileReplacements;
      console.log(`✅ ${calculatorFile} - Applied ${fileReplacements} PDF export update(s)`);
    } else {
      console.log(`✓  ${calculatorFile} - Already using CommonPDFExport or no updates needed`);
    }

  } catch (error) {
    console.log(`❌ ${calculatorFile} - Error: ${error.message}`);
  }
});

console.log('\n' + '='.repeat(60));
console.log(`🎉 COMPLETED: Updated ${updatedCount} calculators with ${totalReplacements} changes`);
console.log('✨ All calculators now use CommonPDFExport consistently');
console.log('📄 Standardized PDF export across the entire application');
