# Reusable Dropdown Components Guide

## Overview
This guide explains how to use the new reusable dropdown components that provide consistent, modern UI across all calculators.

## Components

### 1. CustomDropdown
The base dropdown component with full customization options.

```jsx
import CustomDropdown from '../components/CustomDropdown'

<CustomDropdown
  label="Select Option"
  value={selectedValue}
  onChange={(value) => handleChange(value)}
  options={[
    { value: 'option1', label: 'Option 1', icon: '🎯' },
    { value: 'option2', label: 'Option 2', icon: '⚡' }
  ]}
  icon="🔧"
  placeholder="Choose an option"
  focusColor="#3B82F6"
  disabled={false}
  error={null}
  helperText="Optional helper text"
/>
```

### 2. CalculatorDropdown
Simplified dropdown that uses predefined configurations.

```jsx
import CalculatorDropdown from '../components/CalculatorDropdown'

<CalculatorDropdown
  configKey="CALCULATION_TYPES.FD"
  value={inputs.calculationType}
  onChange={(value) => handleInputChange('calculationType', value)}
  category="savings"
  placeholder="Select calculation type"
/>
```

## Predefined Configurations

### Available Config Keys:
- `CALCULATION_TYPES.FD` - Fixed Deposit calculation types
- `CALCULATION_TYPES.RD` - Recurring Deposit calculation types  
- `CALCULATION_TYPES.CAGR` - CAGR calculation types
- `COMPOUNDING_FREQUENCY` - Standard compounding frequencies
- `COUNTRIES` - Country selection with flags
- `TAX_REGIME` - Indian tax regime options
- `ORGANIZATION_TYPE` - Gratuity organization types
- `SWP_COUNTRIES` - Countries with typical returns for SWP

### Category Colors:
- `loans`: Blue (#3B82F6)
- `savings`: Green (#059669)
- `mutual_funds`: Purple (#8B5CF6)
- `tax`: Red (#EF4444)
- `retirement`: Purple (#8B5CF6)
- `general`: Gray (#6B7280)

## Usage Examples

### Basic Usage
```jsx
// Simple dropdown with predefined config
<CalculatorDropdown
  configKey="COMPOUNDING_FREQUENCY"
  value={frequency}
  onChange={setFrequency}
  category="savings"
/>
```

### Custom Configuration
```jsx
// Custom dropdown options
<CalculatorDropdown
  customConfig={{
    label: "Custom Options",
    icon: "🎨",
    options: [
      { value: 'custom1', label: 'Custom Option 1', icon: '🔥' },
      { value: 'custom2', label: 'Custom Option 2', icon: '⭐' }
    ]
  }}
  value={customValue}
  onChange={setCustomValue}
  category="general"
/>
```

## Features

### ✨ Modern UI Features:
- Smooth animations with Framer Motion
- Hover effects and micro-interactions
- Focus states with category-specific colors
- Selected state indicators
- Responsive design
- Accessibility support

### 🎯 Developer Benefits:
- Consistent styling across all calculators
- Predefined configurations reduce code duplication
- Easy to maintain and update
- Type-safe with proper error handling
- Extensible for new use cases

## Migration Guide

### Before (Old HTML Select):
```jsx
<select
  value={value}
  onChange={(e) => handleChange(e.target.value)}
  className="w-full px-3 py-3 border-2 rounded-xl..."
>
  <option value="option1">Option 1</option>
  <option value="option2">Option 2</option>
</select>
```

### After (New CalculatorDropdown):
```jsx
<CalculatorDropdown
  configKey="PREDEFINED_CONFIG"
  value={value}
  onChange={handleChange}
  category="savings"
/>
```

## Adding New Configurations

To add new dropdown configurations, edit `src/components/DropdownConfigs.js`:

```js
export const DROPDOWN_CONFIGS = {
  // Add new configuration
  NEW_CONFIG: {
    label: "New Dropdown",
    icon: "🆕",
    options: [
      { value: 'new1', label: 'New Option 1', icon: '🎯' },
      { value: 'new2', label: 'New Option 2', icon: '⚡' }
    ]
  }
}
```

## Best Practices

1. **Use CalculatorDropdown** for standard calculator dropdowns
2. **Use CustomDropdown** only when you need full customization
3. **Always specify category** for proper color theming
4. **Add icons** to options for better visual hierarchy
5. **Use meaningful placeholder text**
6. **Test accessibility** with keyboard navigation

## Troubleshooting

### Common Issues:
1. **Config not found**: Check if the configKey exists in DropdownConfigs.js
2. **Wrong colors**: Verify the category name matches FOCUS_COLORS
3. **Missing icons**: Ensure all options have proper icon properties
4. **Animation issues**: Check if Framer Motion is properly imported

This system provides a scalable, maintainable approach to dropdown components across the entire application.
