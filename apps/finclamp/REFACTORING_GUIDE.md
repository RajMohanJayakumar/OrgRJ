# Calculator Refactoring Guide

This guide shows how to systematically refactor all calculator components to use the new common components and design system.

## Overview of Changes

### 1. New Common Components Created

#### Buttons (`src/components/common/buttons/`)
- `Button` - Universal button component with variants (primary, secondary, success, warning, error, outline, ghost)
- `IconButton` - For icon-only buttons
- `ButtonGroup` - For grouping related buttons

#### Inputs (`src/components/common/inputs/`)
- `Input` - Universal input component (text, number, currency, percentage)
- `Select` - Universal select/dropdown component
- `NumberInput` - Number input with increment/decrement controls

#### Cards (`src/components/common/cards/`)
- `Card` - Universal card component with variants
- `ResultCard` - For displaying calculation results
- `SummaryCard` - For grouped results with title and items

#### Layout (`src/components/common/layout/`)
- `Section` - For organizing content with title, icon, and reset button
- `Container` - For consistent page layouts
- `Grid` - For responsive grid layouts

### 2. Design System (`src/styles/common/design-system.css`)
- Predefined CSS classes for buttons, cards, inputs, layouts
- Consistent color system, spacing, shadows, and animations
- Responsive utilities and animation classes

## Refactoring Steps for Each Calculator

### Step 1: Update Imports

**Before:**
```jsx
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { SomeIcon } from 'lucide-react'
import { useCurrency } from '../contexts/CurrencyContext'
import UniversalRelatedCalculators from '../components/UniversalRelatedCalculators'
import ResetButton from '../components/ResetButton'
```

**After:**
```jsx
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { SomeIcon } from 'lucide-react'
import { useCurrency } from '../contexts/CurrencyContext'
import UniversalRelatedCalculators from '../components/UniversalRelatedCalculators'
import { 
  Button, 
  Input, 
  Card, 
  ResultCard, 
  SummaryCard, 
  Section, 
  Container, 
  Grid 
} from '../components/common'
```

### Step 2: Replace Layout Structure

**Before:**
```jsx
return (
  <div className="max-w-4xl mx-auto p-6 space-y-8">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* content */}
    </div>
  </div>
)
```

**After:**
```jsx
return (
  <Container size="lg" spacing="lg">
    <Grid columns={2}>
      {/* content */}
    </Grid>
  </Container>
)
```

### Step 3: Replace Input Sections

**Before:**
```jsx
<motion.div className="bg-white rounded-xl shadow-lg p-6">
  <div className="flex items-center gap-3 mb-6">
    <div className="p-2 bg-blue-100 rounded-lg">
      <Calculator className="w-6 h-6 text-blue-600" />
    </div>
    <h2 className="text-xl font-bold text-gray-900">Input Details</h2>
  </div>
  <div className="space-y-6">
    {/* inputs */}
  </div>
</motion.div>
```

**After:**
```jsx
<Section
  title="Input Details"
  icon={Calculator}
  onReset={resetCalculator}
  color="blue"
>
  {/* inputs */}
</Section>
```

### Step 4: Replace Individual Inputs

**Before:**
```jsx
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Amount
  </label>
  <div className="relative">
    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
      $
    </span>
    <input
      type="number"
      value={inputs.amount}
      onChange={(e) => handleInputChange('amount', e.target.value)}
      className="w-full pl-8 pr-4 py-3 text-base font-semibold border-2 rounded-xl transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      placeholder="100"
    />
  </div>
</div>
```

**After:**
```jsx
<Input
  label="Amount"
  type="currency"
  value={inputs.amount}
  onChange={(value) => handleInputChange('amount', value)}
  prefix="$"
  placeholder="100"
/>
```

### Step 5: Replace Buttons

**Before:**
```jsx
<button
  onClick={() => handleAction()}
  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
>
  Calculate
</button>
```

**After:**
```jsx
<Button
  variant="primary"
  onClick={() => handleAction()}
>
  Calculate
</Button>
```

### Step 6: Replace Result Cards

**Before:**
```jsx
<div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
  <div className="text-sm text-gray-600 mb-1">Total Amount</div>
  <div className="text-2xl font-bold text-blue-700">
    {formatCurrency(results.total)}
  </div>
</div>
```

**After:**
```jsx
<ResultCard
  label="Total Amount"
  value={results.total}
  type="currency"
  color="blue"
  highlight={true}
/>
```

### Step 7: Replace Summary Sections

**Before:**
```jsx
<div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6">
  <h3 className="text-lg font-bold text-blue-800 mb-4">Summary</h3>
  <div className="space-y-3">
    <div className="flex justify-between items-center">
      <span className="text-blue-700">Principal</span>
      <span className="font-semibold text-blue-800">{formatCurrency(principal)}</span>
    </div>
    <div className="flex justify-between items-center">
      <span className="text-blue-700">Interest</span>
      <span className="font-semibold text-blue-800">{formatCurrency(interest)}</span>
    </div>
  </div>
</div>
```

**After:**
```jsx
<SummaryCard
  title="Summary"
  color="blue"
  items={[
    { label: 'Principal', value: principal, type: 'currency' },
    { label: 'Interest', value: interest, type: 'currency' }
  ]}
/>
```

## Example: Complete TipCalculator Refactoring

The TipCalculator has been fully refactored as an example. Key changes:

1. **Imports**: Updated to use common components
2. **Layout**: Uses `Container` and `Grid` for responsive layout
3. **Input Section**: Uses `Section` component with `Input` components
4. **Service Quality**: Uses `Button` components with variants
5. **Results**: Uses `SummaryCard` components for organized display
6. **Actions**: Uses `Button` components with proper variants

## Benefits of Refactoring

1. **Consistency**: All calculators now use the same UI components
2. **Maintainability**: Changes to common components affect all calculators
3. **Performance**: Reduced code duplication and bundle size
4. **Accessibility**: Common components include proper accessibility features
5. **Responsive**: Built-in responsive design across all calculators
6. **Theming**: Easy to change colors and styling across the entire app

## Next Steps

1. Apply this refactoring pattern to all remaining calculators
2. Test each calculator after refactoring
3. Update any custom styling to use design system classes
4. Remove old unused components and CSS
