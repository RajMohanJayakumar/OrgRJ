# Standardized Number Input Guide

## Overview

All calculators now use the standardized `NumberInput` component from `src/components/common/inputs` for consistent styling and behavior across the entire project.

## Problem Solved

Previously, different calculators used multiple inconsistent input components:

- `NumberInput` from `src/components/NumberInput.jsx`
- `UnifiedNumberInput` from `src/components/UnifiedNumberInput.jsx`
- `PercentageInput` from `src/components/PercentageInput.jsx`
- `CurrencyInput` from `src/components/CurrencyInput.jsx`
- `UnifiedInput` from `src/components/UnifiedInput.jsx`
- Native `<input type="number">` elements

## Current Solution

### 1. NumberInput (Common Component)

Single component for all number inputs with comprehensive features.

**Props:**

- `value`: Current value
- `onChange`: Change handler function
- `placeholder`: Placeholder text
- `min/max/step`: Number input constraints
- `allowDecimals`: Allow decimal values
- `allowNegative`: Allow negative values
- `prefix/suffix`: Text before/after input
- `disabled`: Disable input
- `className`: Additional CSS classes

### 2. SelectInput

Dedicated component for dropdown/select inputs with consistent styling that matches NumberInput exactly.

**Props:**

- `label`: Input label text
- `value`: Current value
- `onChange`: Change handler function
- `options`: Array of options (format: `{value, label, icon?}`)
- `placeholder`: Placeholder text
- `icon`: Icon for label
- `disabled`: Disable input
- `className`: Additional CSS classes

### 3. HabitInputRow

Specialized component for habit calculator that uses SelectInput for dropdowns and NumberInput for number inputs.

**Props:**

- `habit`: Habit object with id, name, type, dailyQuantity, unitCost
- `onUpdate`: Function to update habit (habitId, field, value)
- `onRemove`: Function to remove habit (habitId)
- `habitTypes`: Object mapping habit types to their configurations
- `showRemove`: Whether to show remove button

## Usage Examples

### Import Statement

```jsx
import { NumberInput } from "../components/common/inputs";
```

### Basic Number Input

```jsx
<NumberInput
  value={amount}
  onChange={setAmount}
  placeholder="0"
  min={0}
  max={1000000}
  step={100}
  allowDecimals={true}
  allowNegative={false}
  prefix="$"
  showControls={true}
/>
```

### Dropdown Input

```jsx
<SelectInput
  label="Investment Type"
  value={type}
  onChange={setType}
  options={[
    { value: "fixed", label: "Fixed Deposit", icon: "🏦" },
    { value: "mutual", label: "Mutual Fund", icon: "📈" },
  ]}
  placeholder="Select type"
  icon={<Calculator className="w-4 h-4" />}
/>
```

### Three-Column Layout (Like Habit Calculator)

```jsx
<div className="grid grid-cols-3 gap-4">
  <SelectInput
    label="Type"
    value={type}
    onChange={setType}
    options={typeOptions}
  />

  <div className="space-y-2">
    <label className="text-sm font-medium text-gray-700">Daily Quantity</label>
    <NumberInput
      value={quantity}
      onChange={setQuantity}
      allowDecimals={true}
      allowNegative={false}
    />
  </div>

  <div className="space-y-2">
    <label className="text-sm font-medium text-gray-700">Cost per Unit</label>
    <NumberInput
      value={cost}
      onChange={setCost}
      prefix="$"
      allowDecimals={true}
      allowNegative={false}
    />
  </div>
</div>
```

### Using HabitInputRow

```jsx
<HabitInputRow
  habit={habit}
  onUpdate={(id, field, value) => updateHabit(id, field, value)}
  onRemove={(id) => removeHabit(id)}
  habitTypes={habitTypes}
  showRemove={habits.length > 1}
/>
```

## Styling Consistency

All inputs now share these consistent styles:

- `border-2 border-gray-200` - 2px gray border
- `rounded-xl` - Large border radius
- `px-3 sm:px-4 py-2.5 sm:py-3` - Consistent padding
- `text-base sm:text-lg font-medium` - Consistent typography
- `focus:border-blue-500 focus:ring-4 focus:ring-blue-100` - Consistent focus states
- `transition-all duration-200` - Smooth transitions

## Migration Guide

### Before (Inconsistent)

```jsx
// Old dropdown
<select className="w-full px-2 py-1 border border-gray-300 rounded text-sm">
  <option>Option 1</option>
</select>

// Old number input
<NumberInput className="w-full py-2 text-sm border border-gray-300 rounded-lg" />
```

### After (Consistent)

```jsx
// New unified dropdown
<UnifiedInput
  type="select"
  label="Select Option"
  value={value}
  onChange={setValue}
  options={options}
/>

// New unified number input
<UnifiedInput
  type="number"
  label="Enter Amount"
  value={value}
  onChange={setValue}
  showControls={true}
/>
```

## Benefits

1. **Visual Consistency**: All inputs look identical across calculators
2. **Better UX**: Consistent focus states and interactions
3. **Maintainability**: Single component to update for styling changes
4. **Accessibility**: Consistent keyboard navigation and screen reader support
5. **Mobile Responsive**: Consistent responsive behavior across all inputs
6. **Text Truncation**: Automatic handling of long text with tooltips
7. **Layout Stability**: Prevents text wrapping that breaks visual alignment

## Text Truncation Features

The UnifiedInput component automatically handles long text to prevent layout issues:

### Automatic Truncation

- Long option labels are truncated with ellipsis (`...`)
- Selected values are truncated in the dropdown button
- Maintains consistent input height regardless of text length

### Tooltips

- Hover over truncated text to see the full content
- Both selected values and dropdown options show tooltips
- Improves accessibility for users with long option names

### Best Practices for Labels

- Keep option labels concise when possible
- Use clear, descriptive but short names
- Examples:
  - ✅ "Snacks" instead of "Snacks/Junk Food"
  - ✅ "Fast Food" instead of "Fast Food Restaurants"
  - ✅ "Streaming" instead of "Streaming Subscriptions"

### Example with Long Text

```jsx
const options = [
  { value: 'short', label: 'Coffee' },
  { value: 'long', label: 'Premium Artisanal Coffee Beverages' } // Will be truncated
]

<UnifiedInput
  type="select"
  label="Beverage Type"
  value={type}
  onChange={setType}
  options={options}
  // Long text automatically truncated with tooltip
/>
```

## Implementation in Other Calculators

To implement in other calculators:

1. Import `UnifiedInput`
2. Replace existing input components
3. Use `type="number"` for numeric inputs
4. Use `type="select"` for dropdowns
5. Ensure consistent grid layouts and spacing

Example for EMI Calculator:

```jsx
import UnifiedInput from '../components/UnifiedInput'

// Replace existing inputs
<UnifiedInput
  type="number"
  label="Loan Amount"
  value={loanAmount}
  onChange={setLoanAmount}
  prefix="₹"
  showControls={true}
/>

<UnifiedInput
  type="select"
  label="Tenure Type"
  value={tenureType}
  onChange={setTenureType}
  options={[
    { value: 'years', label: 'Years' },
    { value: 'months', label: 'Months' }
  ]}
/>
```

This ensures all calculators have the same professional, consistent appearance.
