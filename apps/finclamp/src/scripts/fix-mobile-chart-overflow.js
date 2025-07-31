#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

// Calculators that might have chart overflow issues
const CALCULATORS_WITH_CHARTS = [
  'SIPCalculator.jsx',
  'NPSCalculator.jsx',
  'RDCalculator.jsx',
  'PPFCalculator.jsx',
  'FDCalculator.jsx',
  'SWPCalculator.jsx',
  'CompoundInterestCalculator.jsx',
  'CAGRCalculator.jsx',
  'InflationCalculator.jsx',
  'GratuityCalculator.jsx'
];

const calculatorsDir = path.join(process.cwd(), 'src', 'calculators');

console.log('🔧 FIXING MOBILE CHART OVERFLOW ISSUES');
console.log('='.repeat(60));

let updatedCount = 0;
let totalFixes = 0;

CALCULATORS_WITH_CHARTS.forEach(calculatorFile => {
  const filePath = path.join(calculatorsDir, calculatorFile);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  ${calculatorFile} - File not found`);
    return;
  }

  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let fileChanges = 0;

    // Fix 1: Update chart container height and add overflow hidden
    const chartContainerPattern = /className="h-96 w-full"/g;
    if (content.match(chartContainerPattern)) {
      content = content.replace(chartContainerPattern, 'className="h-80 sm:h-96 w-full overflow-hidden"');
      fileChanges++;
    }

    // Fix 2: Reduce chart margins for mobile
    const chartMarginPattern = /margin=\{\s*\{\s*top:\s*20,\s*right:\s*30,\s*left:\s*60,\s*bottom:\s*20\s*\}\s*\}/g;
    if (content.match(chartMarginPattern)) {
      content = content.replace(chartMarginPattern, 'margin={{ top: 20, right: 15, left: 40, bottom: 20 }}');
      fileChanges++;
    }

    // Fix 3: Reduce Y-axis width
    const yAxisWidthPattern = /width=\{50\}/g;
    if (content.match(yAxisWidthPattern)) {
      content = content.replace(yAxisWidthPattern, 'width={35}');
      fileChanges++;
    }

    // Fix 4: Reduce font size for mobile
    const fontSizePattern = /fontSize=\{12\}/g;
    if (content.match(fontSizePattern)) {
      content = content.replace(fontSizePattern, 'fontSize={10}');
      fileChanges++;
    }

    // Fix 5: Add overflow-x-hidden to main containers
    const mainContainerPattern = /className="max-w-7xl mx-auto p-6 space-y-8"/g;
    if (content.match(mainContainerPattern)) {
      content = content.replace(mainContainerPattern, 'className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8 overflow-x-hidden"');
      fileChanges++;
    }

    // Fix 6: Add overflow hidden to chart wrapper divs
    const chartWrapperPattern = /className="bg-gradient-to-r from-\w+-50 to-\w+-100 rounded-xl p-6 shadow-lg border border-\w+-200"/g;
    if (content.match(chartWrapperPattern)) {
      content = content.replace(chartWrapperPattern, (match) => {
        return match.replace('p-6', 'p-4 sm:p-6').replace('rounded-xl', 'rounded-xl overflow-hidden');
      });
      fileChanges++;
    }

    // Fix 7: Update grid gaps for mobile
    const gridGapPattern = /gap-3 mb-6/g;
    if (content.match(gridGapPattern)) {
      content = content.replace(gridGapPattern, 'gap-2 sm:gap-3 mb-6');
      fileChanges++;
    }

    // Fix 8: Update padding for chart stats
    const chartStatsPadding = /p-4 shadow-sm text-center/g;
    if (content.match(chartStatsPadding)) {
      content = content.replace(chartStatsPadding, 'p-3 sm:p-4 shadow-sm text-center');
      fileChanges++;
    }

    // Fix 9: Update text sizes for mobile
    const textSizePattern = /text-sm lg:text-base/g;
    if (content.match(textSizePattern)) {
      content = content.replace(textSizePattern, 'text-xs sm:text-sm lg:text-base');
      fileChanges++;
    }

    if (fileChanges > 0) {
      fs.writeFileSync(filePath, content, 'utf8');
      updatedCount++;
      totalFixes += fileChanges;
      console.log(`✅ ${calculatorFile} - Applied ${fileChanges} mobile chart fix(es)`);
    } else {
      console.log(`✓  ${calculatorFile} - No chart overflow issues found or already fixed`);
    }

  } catch (error) {
    console.log(`❌ ${calculatorFile} - Error: ${error.message}`);
  }
});

console.log('\n' + '='.repeat(60));
console.log(`🎉 COMPLETED: Fixed mobile chart overflow in ${updatedCount} calculators`);
console.log(`🔧 Total fixes applied: ${totalFixes}`);
console.log('📱 All charts should now be mobile-responsive without overflow');
console.log('🧪 Please test on mobile devices to verify the fixes');
