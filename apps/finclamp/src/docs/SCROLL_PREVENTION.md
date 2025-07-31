# Scroll Prevention for Number Inputs

## Overview

This project implements a comprehensive scroll prevention system for number inputs to prevent accidental value changes when users scroll over input fields. This is a common UX issue where users accidentally change input values while scrolling through the page.

## Implementation

### Core Hook: `useScrollPreventInput`

**Location**: `src/hooks/useScrollPreventInput.js`

The `useScrollPreventInput` hook provides a reusable solution for preventing scroll-based value changes in number inputs.

#### Features:

- **Value Change Prevention**: Prevents mouse wheel from changing input values when focused
- **Page Scroll Preservation**: Maintains normal page scrolling even when input is focused
- **Keyboard Arrow Prevention**: Prevents arrow up/down from changing values (unless Ctrl/Cmd is held)
- **Smart Focus Detection**: Only prevents value changes when input is actually focused
- **Manual Scroll Forwarding**: Automatically forwards scroll events to maintain page navigation
- **Configurable**: Can be disabled via parameter

#### Usage:

```javascript
import { useScrollPreventInput } from '../hooks/useScrollPreventInput'

const { inputRef, onKeyDown } = useScrollPreventInput(false) // false = enabled

<input
  ref={inputRef}
  type="number"
  onKeyDown={onKeyDown}
  // ... other props
/>
```

### Updated Components

All number input components have been updated to include scroll prevention:

#### 1. **Input Component** (`src/components/common/inputs/Input.jsx`)

- Added `preventScrollChange` prop (default: `true`)
- Automatically applies to `number` and `currency` input types
- Integrates seamlessly with existing functionality

#### 2. **CurrencyInput Component** (`src/components/CurrencyInput.jsx`)

- Added `preventScrollChange` prop (default: `true`)
- Prevents scroll changes on currency inputs
- Maintains currency formatting functionality

#### 3. **UnifiedNumberInput Component** (`src/components/UnifiedNumberInput.jsx`)

- Added `preventScrollChange` prop (default: `true`)
- Applies to all number inputs in the unified system

#### 4. **ModernInputField Component** (`src/components/ModernInputSection.jsx`)

- Added `preventScrollChange` prop (default: `true`)
- Smart detection for number and currency types
- Maintains modern styling and animations

#### 5. **NumberInput Components**

- **Common NumberInput** (`src/components/common/inputs/NumberInput.jsx`)
- **Legacy NumberInput** (`src/components/NumberInput.jsx`)
- Both updated with scroll prevention and `preventScrollChange` prop

## Usage Examples

### Basic Number Input with Scroll Prevention

```javascript
<Input
  type="number"
  value={amount}
  onChange={setAmount}
  preventScrollChange={true} // Default
/>
```

### Currency Input with Scroll Prevention

```javascript
<CurrencyInput
  value={price}
  onChange={setPrice}
  preventScrollChange={true} // Default
/>
```

### Disabling Scroll Prevention

```javascript
<NumberInput
  value={quantity}
  onChange={setQuantity}
  preventScrollChange={false} // Disabled
/>
```

## Benefits

### User Experience

- **Prevents Accidental Changes**: Input values protected from scroll-induced changes
- **Seamless Page Navigation**: Normal page scrolling works at all times, even with focused inputs
- **Natural User Experience**: Users can scroll freely while maintaining input focus
- **Maintains Accessibility**: Arrow keys still work with Ctrl/Cmd modifier
- **Consistent Behavior**: All number inputs behave the same way across the app

### Developer Experience

- **Easy Integration**: Just add the hook to any input component
- **Configurable**: Can be enabled/disabled per component
- **Backward Compatible**: Existing components work without changes

### Performance

- **Lightweight**: Minimal overhead with efficient event handling
- **Memory Safe**: Proper cleanup of event listeners
- **Non-Blocking**: Doesn't interfere with other input functionality

## Browser Compatibility

- **Chrome**: Full support
- **Firefox**: Full support
- **Safari**: Full support
- **Edge**: Full support
- **Mobile Browsers**: Full support

## Implementation Details

### Event Handling

1. **Wheel Events**: Prevented when input is focused or hovered
2. **Keyboard Events**: Arrow up/down prevented unless Ctrl/Cmd is held
3. **Focus Management**: Smart detection of input focus state

### Performance Optimizations

- Event listeners added only when needed
- Proper cleanup on component unmount
- Passive event listeners where appropriate

## Testing

### Manual Testing

1. Hover over number input and scroll - value should not change
2. Focus number input and use arrow keys - value should not change
3. Hold Ctrl/Cmd and use arrow keys - value should change (if desired)
4. Regular typing and input changes should work normally

### Automated Testing

```javascript
// Example test case
test("prevents scroll changes on number input", () => {
  const { getByRole } = render(
    <NumberInput value={10} onChange={mockOnChange} />
  );
  const input = getByRole("spinbutton");

  fireEvent.wheel(input, { deltaY: 100 });
  expect(mockOnChange).not.toHaveBeenCalled();
});
```

## Migration Guide

### For Existing Components

1. Import the hook: `import { useScrollPreventInput } from '../hooks/useScrollPreventInput'`
2. Use the hook: `const { inputRef, onWheel, onKeyDown } = useScrollPreventInput()`
3. Apply to input: `<input ref={inputRef} onWheel={onWheel} onKeyDown={onKeyDown} />`

### For New Components

- Use the updated common components that already include scroll prevention
- All new number inputs automatically get scroll prevention by default

## Configuration

### Global Settings

Currently, scroll prevention is enabled by default for all number inputs. To change this:

1. Modify the default value in each component
2. Or create a global context for scroll prevention settings

### Per-Component Settings

Use the `preventScrollChange` prop to control behavior per component:

```javascript
<NumberInput preventScrollChange={false} /> // Disabled
<NumberInput preventScrollChange={true} />  // Enabled (default)
```

## Future Enhancements

1. **Global Configuration**: Context-based global settings
2. **Advanced Detection**: More sophisticated hover/focus detection
3. **Touch Support**: Enhanced mobile touch event handling
4. **Analytics**: Track prevented scroll events for UX insights
