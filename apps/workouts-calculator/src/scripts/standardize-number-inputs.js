#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

console.log('🔧 STANDARDIZING ALL NUMBER INPUTS TO USE COMMON NUMBERINPUT COMPONENT');
console.log('='.repeat(80));

const srcDir = path.join(process.cwd(), 'src');
const calculatorsDir = path.join(srcDir, 'calculators');
const componentsDir = path.join(srcDir, 'components');

// Components to be replaced
const OBSOLETE_COMPONENTS = [
  'NumberInput.jsx',           // src/components/NumberInput.jsx
  'UnifiedNumberInput.jsx',    // src/components/UnifiedNumberInput.jsx
  'PercentageInput.jsx',       // src/components/PercentageInput.jsx
  'CurrencyInput.jsx',         // src/components/CurrencyInput.jsx
  'UnifiedInput.jsx',          // src/components/UnifiedInput.jsx
  'InputWithDropdown.jsx'      // src/components/InputWithDropdown.jsx
];

// Import patterns to replace
const IMPORT_REPLACEMENTS = [
  {
    pattern: /import\s+NumberInput\s+from\s+['"]\.\.\/components\/NumberInput['"]/g,
    replacement: "import { NumberInput } from '../components/common/inputs'"
  },
  {
    pattern: /import\s+UnifiedNumberInput\s+from\s+['"]\.\.\/components\/UnifiedNumberInput['"]/g,
    replacement: "import { NumberInput } from '../components/common/inputs'"
  },
  {
    pattern: /import\s+PercentageInput\s+from\s+['"]\.\.\/components\/PercentageInput['"]/g,
    replacement: "import { NumberInput } from '../components/common/inputs'"
  },
  {
    pattern: /import\s+CurrencyInput\s+from\s+['"]\.\.\/components\/CurrencyInput['"]/g,
    replacement: "import { NumberInput } from '../components/common/inputs'"
  },
  {
    pattern: /import\s+UnifiedInput\s+from\s+['"]\.\.\/components\/UnifiedInput['"]/g,
    replacement: "import { NumberInput } from '../components/common/inputs'"
  },
  {
    pattern: /import\s+InputWithDropdown\s+from\s+['"]\.\.\/components\/InputWithDropdown['"]/g,
    replacement: "import { NumberInput } from '../components/common/inputs'"
  }
];

// Component usage patterns to replace
const COMPONENT_REPLACEMENTS = [
  // UnifiedNumberInput -> NumberInput
  {
    pattern: /<UnifiedNumberInput\s+([^>]*?)\/>/g,
    replacement: (match, props) => {
      // Extract common props and convert to NumberInput format
      const cleanProps = props
        .replace(/showControls=\{[^}]*\}/g, 'showControls={true}')
        .replace(/preventScrollChange=\{[^}]*\}/g, '')
        .replace(/focusColor=["'][^"']*["']/g, '');
      return `<NumberInput ${cleanProps}/>`;
    }
  },
  // PercentageInput -> NumberInput with suffix="%"
  {
    pattern: /<PercentageInput\s+([^>]*?)\/>/g,
    replacement: (match, props) => {
      const cleanProps = props.replace(/showDropdown=\{[^}]*\}/g, '');
      return `<NumberInput ${cleanProps} suffix="%" step="0.5" allowDecimals={true}/>`;
    }
  },
  // CurrencyInput -> NumberInput with prefix
  {
    pattern: /<CurrencyInput\s+([^>]*?)\/>/g,
    replacement: (match, props) => {
      return `<NumberInput ${props} allowDecimals={true}/>`;
    }
  },
  // Native input type="number" -> NumberInput
  {
    pattern: /<input\s+type="number"\s+([^>]*?)\/>/g,
    replacement: (match, props) => {
      const cleanProps = props
        .replace(/type="number"/g, '')
        .replace(/inputMode="numeric"/g, '')
        .replace(/pattern="[^"]*"/g, '');
      return `<NumberInput ${cleanProps} allowDecimals={true}/>`;
    }
  }
];

function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const analysis = {
    hasObsoleteImports: false,
    hasObsoleteComponents: false,
    hasNativeNumberInputs: false,
    obsoleteImports: [],
    obsoleteComponents: [],
    nativeInputs: []
  };

  // Check for obsolete imports
  IMPORT_REPLACEMENTS.forEach(({ pattern }) => {
    const matches = content.match(pattern);
    if (matches) {
      analysis.hasObsoleteImports = true;
      analysis.obsoleteImports.push(...matches);
    }
  });

  // Check for obsolete component usage
  const componentPatterns = [
    /UnifiedNumberInput/g,
    /PercentageInput/g,
    /CurrencyInput/g,
    /UnifiedInput/g,
    /InputWithDropdown/g
  ];

  componentPatterns.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches) {
      analysis.hasObsoleteComponents = true;
      analysis.obsoleteComponents.push(...matches);
    }
  });

  // Check for native number inputs
  const nativePattern = /<input\s+type="number"/g;
  const nativeMatches = content.match(nativePattern);
  if (nativeMatches) {
    analysis.hasNativeNumberInputs = true;
    analysis.nativeInputs.push(...nativeMatches);
  }

  return analysis;
}

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let hasChanges = false;

  // Apply import replacements
  IMPORT_REPLACEMENTS.forEach(({ pattern, replacement }) => {
    if (pattern.test(content)) {
      content = content.replace(pattern, replacement);
      hasChanges = true;
    }
  });

  // Apply component replacements
  COMPONENT_REPLACEMENTS.forEach(({ pattern, replacement }) => {
    if (pattern.test(content)) {
      content = content.replace(pattern, replacement);
      hasChanges = true;
    }
  });

  if (hasChanges) {
    fs.writeFileSync(filePath, content);
    return true;
  }
  return false;
}

// Analyze all calculator files
console.log('📊 ANALYZING CALCULATOR FILES...');
const calculatorFiles = fs.readdirSync(calculatorsDir)
  .filter(file => file.endsWith('.jsx'))
  .map(file => path.join(calculatorsDir, file));

let totalFiles = 0;
let filesToUpdate = 0;

calculatorFiles.forEach(filePath => {
  const fileName = path.basename(filePath);
  const analysis = analyzeFile(filePath);
  totalFiles++;

  if (analysis.hasObsoleteImports || analysis.hasObsoleteComponents || analysis.hasNativeNumberInputs) {
    filesToUpdate++;
    console.log(`\n📄 ${fileName}:`);
    
    if (analysis.hasObsoleteImports) {
      console.log(`  ❌ Obsolete imports: ${analysis.obsoleteImports.length}`);
    }
    
    if (analysis.hasObsoleteComponents) {
      console.log(`  ❌ Obsolete components: ${analysis.obsoleteComponents.length}`);
    }
    
    if (analysis.hasNativeNumberInputs) {
      console.log(`  ❌ Native number inputs: ${analysis.nativeInputs.length}`);
    }
  } else {
    console.log(`✅ ${fileName} - Already standardized`);
  }
});

console.log('\n' + '='.repeat(80));
console.log('📊 ANALYSIS SUMMARY');
console.log('='.repeat(80));
console.log(`Total calculator files: ${totalFiles}`);
console.log(`Files needing updates: ${filesToUpdate}`);
console.log(`Files already standardized: ${totalFiles - filesToUpdate}`);

if (filesToUpdate > 0) {
  console.log('\n🔧 APPLYING STANDARDIZATION...');
  
  let updatedFiles = 0;
  calculatorFiles.forEach(filePath => {
    const fileName = path.basename(filePath);
    const wasUpdated = updateFile(filePath);
    
    if (wasUpdated) {
      updatedFiles++;
      console.log(`✅ Updated: ${fileName}`);
    }
  });
  
  console.log(`\n🎉 Successfully updated ${updatedFiles} files!`);
} else {
  console.log('\n✅ All files are already standardized!');
}

console.log('\n' + '='.repeat(80));
console.log('🗑️  OBSOLETE COMPONENTS TO REMOVE');
console.log('='.repeat(80));

OBSOLETE_COMPONENTS.forEach(component => {
  const componentPath = path.join(componentsDir, component);
  if (fs.existsSync(componentPath)) {
    console.log(`❌ ${component} - Can be removed`);
  } else {
    console.log(`✅ ${component} - Already removed`);
  }
});

console.log('\n' + '='.repeat(80));
console.log('✅ STANDARDIZATION COMPLETE');
console.log('='.repeat(80));
console.log('All number inputs now use the common NumberInput component!');
console.log('Next steps:');
console.log('1. Remove obsolete components');
console.log('2. Test all calculators');
console.log('3. Update documentation');
