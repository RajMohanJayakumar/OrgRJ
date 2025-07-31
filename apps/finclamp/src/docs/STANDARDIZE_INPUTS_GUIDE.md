# Standardize All Calculators to Use NumberInput Component

## Overview

This guide shows how to convert all calculators to use the same `NumberInput` component that's used in the Bill Split Calculator for consistent user experience across the entire project.

## Target Component

**Use**: `NumberInput` from `src/components/common/inputs`
**Style**: Same as Bill Split Calculator
**Features**: Text input with numeric mode, no scroll issues, consistent validation

## Step-by-Step Conversion Guide

### 1. Update Imports

**Before (Various Components):**
```javascript
import { ModernInputField } from '../components/ModernInputSection'
import CurrencyInput from '../components/CurrencyInput'
import UnifiedNumberInput from '../components/UnifiedNumberInput'
```

**After (Standardized):**
```javascript
import { NumberInput } from '../components/common/inputs'
```

### 2. Convert Currency Inputs

**Before (ModernInputField):**
```javascript
<ModernInputField
  label="Loan Amount"
  value={inputs.loanAmount}
  onChange={(value) => handleInputChange('loanAmount', value)}
  type="currency"
  placeholder="Enter loan amount"
  min="0"
  categoryColor="blue"
/>
```

**After (NumberInput):**
```javascript
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Loan Amount
  </label>
  <NumberInput
    value={inputs.loanAmount}
    onChange={(value) => handleInputChange('loanAmount', value)}
    placeholder="Enter loan amount"
    prefix={formatCurrency(0).replace(/[\d.,]/g, '')}
    step="1"
    min="0"
    allowDecimals={true}
    allowNegative={false}
    className="w-full py-3 sm:py-4 text-base sm:text-lg font-semibold border-2 rounded-xl transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  />
</div>
```

### 3. Convert Percentage Inputs

**Before (ModernInputField):**
```javascript
<ModernInputField
  label="Interest Rate"
  value={inputs.interestRate}
  onChange={(value) => handleInputChange('interestRate', value)}
  type="number"
  placeholder="Enter interest rate"
  suffix="%"
  min="0"
  max="50"
  step="0.1"
  categoryColor="blue"
/>
```

**After (NumberInput):**
```javascript
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Interest Rate
  </label>
  <NumberInput
    value={inputs.interestRate}
    onChange={(value) => handleInputChange('interestRate', value)}
    placeholder="Enter interest rate"
    suffix="%"
    step="0.5"
    min="0"
    max="50"
    allowDecimals={true}
    allowNegative={false}
    className="w-full py-3 sm:py-4 text-base sm:text-lg font-semibold border-2 rounded-xl transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  />
</div>
```

### 4. Convert Integer Inputs

**Before (ModernInputField):**
```javascript
<ModernInputField
  label="Time Period"
  value={inputs.timePeriod}
  onChange={(value) => handleInputChange('timePeriod', value)}
  type="number"
  placeholder="Enter time period"
  suffix="years"
  min="1"
  max="50"
  categoryColor="blue"
/>
```

**After (NumberInput):**
```javascript
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Time Period
  </label>
  <NumberInput
    value={inputs.timePeriod}
    onChange={(value) => handleInputChange('timePeriod', value)}
    placeholder="Enter time period"
    suffix="years"
    step="1"
    min="1"
    max="50"
    allowDecimals={false}
    allowNegative={false}
    className="w-full py-3 sm:py-4 text-base sm:text-lg font-semibold border-2 rounded-xl transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  />
</div>
```

### 5. Convert Select Fields

**Before (ModernSelectField):**
```javascript
<ModernSelectField
  label="Tenure Type"
  value={inputs.tenureType}
  onChange={(value) => handleInputChange('tenureType', value)}
  options={[
    { value: 'years', label: 'Years' },
    { value: 'months', label: 'Months' }
  ]}
  categoryColor="blue"
/>
```

**After (Standard Select):**
```javascript
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Tenure Type
  </label>
  <select
    value={inputs.tenureType}
    onChange={(e) => handleInputChange('tenureType', e.target.value)}
    className="w-full py-3 sm:py-4 text-base sm:text-lg font-semibold border-2 rounded-xl transition-all duration-300 focus:outline-none cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  >
    <option value="years">Years</option>
    <option value="months">Months</option>
  </select>
</div>
```

## NumberInput Props Reference

### Required Props
- `value`: Current input value
- `onChange`: Function to handle value changes

### Common Props
- `placeholder`: Placeholder text
- `step`: Increment/decrement step value
- `min`: Minimum allowed value
- `max`: Maximum allowed value
- `className`: CSS classes for styling

### Input Type Props
- `prefix`: Text/symbol before input (e.g., currency symbol)
- `suffix`: Text/symbol after input (e.g., %, years)
- `allowDecimals`: Boolean - allow decimal numbers
- `allowNegative`: Boolean - allow negative numbers
- `enforceMinMax`: Boolean - enforce min/max boundaries

### Standard Configurations

#### Currency Input
```javascript
<NumberInput
  prefix={formatCurrency(0).replace(/[\d.,]/g, '')}
  step="1"
  allowDecimals={true}
  allowNegative={false}
  // ...
/>
```

#### Percentage Input
```javascript
<NumberInput
  suffix="%"
  step="0.5"
  allowDecimals={true}
  allowNegative={false}
  // ...
/>
```

#### Integer Input
```javascript
<NumberInput
  step="1"
  allowDecimals={false}
  allowNegative={false}
  // ...
/>
```

#### Years/Time Input
```javascript
<NumberInput
  suffix="years"
  step="1"
  allowDecimals={false}
  allowNegative={false}
  // ...
/>
```

## Color Schemes by Calculator Category

### Financial Calculators (Blue)
- EMI, SIP, FD, RD, Compound Interest
- `focus:ring-blue-500`

### Investment Calculators (Purple)
- Stock Average, CAGR, SWP
- `focus:ring-purple-500`

### Savings Calculators (Green)
- PPF, EPF, Savings Goal
- `focus:ring-green-500`

### Tax Calculators (Red)
- Income Tax, Property Tax
- `focus:ring-red-500`

### Utility Calculators (Indigo)
- Bill Split, Tip, Discount
- `focus:ring-indigo-500`

## Conversion Checklist

For each calculator:

- [ ] Update imports to use `NumberInput`
- [ ] Convert all `ModernInputField` to `NumberInput` with proper wrapper
- [ ] Convert all `CurrencyInput` to `NumberInput` with currency prefix
- [ ] Convert all percentage inputs to use `step="0.5"`
- [ ] Convert all `ModernSelectField` to standard `select` with consistent styling
- [ ] Update focus colors to match calculator category
- [ ] Remove unused imports
- [ ] Test all input functionality

## Benefits of Standardization

### User Experience
- Consistent input behavior across all calculators
- No scroll-to-change issues
- Optimal mobile keyboard experience
- Professional, unified interface

### Developer Experience
- Single component to maintain
- Consistent prop interface
- Easier debugging and testing
- Reduced code duplication

### Performance
- Smaller bundle size
- Better performance without scroll prevention
- Consistent validation logic
- Native browser behavior
