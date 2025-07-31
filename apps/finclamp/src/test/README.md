# Test Suite for FinClamp Financial Calculator

This directory contains comprehensive tests for the FinClamp Financial Calculator application.

## Test Structure

### 📁 **test/**
- `setup.js` - Test configuration and global mocks
- `README.md` - This documentation

### 📁 **test/utils/**
- `currencyFormatter.test.js` - Tests for currency formatting utilities

### 📁 **test/contexts/**
- `CurrencyContext.test.jsx` - Tests for currency context provider
- `ViewModeContext.test.jsx` - Tests for view mode context provider  
- `ComparisonContext.test.jsx` - Tests for comparison context provider

### 📁 **test/components/**
- `ModernInputField.test.jsx` - Tests for NumberInput component
- `CommonPDFExport.test.jsx` - Tests for PDF export functionality

### 📁 **test/calculators/**
- `SIPCalculator.test.jsx` - Tests for SIP Calculator component
- `EMICalculator.test.jsx` - Tests for EMI Calculator component

### 📁 **test/integration/**
- `CalculatorFlow.test.jsx` - End-to-end integration tests

## Test Coverage

### ✅ **Working Tests**
- Currency formatting utilities (8 tests)
- Comparison context functionality (6 tests)
- View mode context (5 tests)
- Basic component rendering
- App initialization

### 🔧 **Partially Working Tests**
- Calculator components (need component structure adjustments)
- PDF export functionality (needs mock improvements)
- Integration tests (need simplified scenarios)

## Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:ui

# Run specific test file
npm run test:run src/test/utils/currencyFormatter.test.js

# Run with coverage
npm run test:coverage
```

## Test Configuration

The test suite uses:
- **Vitest** - Fast test runner
- **@testing-library/react** - React component testing utilities
- **@testing-library/jest-dom** - Custom Jest matchers
- **@testing-library/user-event** - User interaction simulation
- **jsdom** - DOM environment for Node.js

## Mocks and Setup

### Global Mocks
- `window.matchMedia` - For responsive design tests
- `ResizeObserver` - For component resize handling
- `IntersectionObserver` - For visibility detection
- `localStorage/sessionStorage` - For storage tests
- `URL.createObjectURL` - For file handling

### Component Mocks
- `framer-motion` - Simplified animation components
- `jspdf` - PDF generation library
- Console methods - Reduced test noise

## Test Patterns

### Component Testing
```javascript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Wrap components with necessary providers
const TestWrapper = ({ children }) => (
  <CurrencyProvider>
    <ViewModeProvider>
      {children}
    </ViewModeProvider>
  </CurrencyProvider>
)

// Test component rendering and interactions
it('should handle user input', async () => {
  const user = userEvent.setup()
  render(<Component />, { wrapper: TestWrapper })
  
  const input = screen.getByLabelText(/input label/i)
  await user.type(input, 'test value')
  
  expect(input).toHaveValue('test value')
})
```

### Context Testing
```javascript
// Test context providers with custom test components
const TestComponent = () => {
  const { value, setValue } = useContext()
  return (
    <div>
      <span data-testid="value">{value}</span>
      <button onClick={() => setValue('new')}>Change</button>
    </div>
  )
}
```

## Best Practices

1. **Use semantic queries** - Prefer `getByLabelText`, `getByRole` over `getByTestId`
2. **Test user interactions** - Focus on what users actually do
3. **Mock external dependencies** - Keep tests isolated and fast
4. **Use waitFor for async operations** - Handle loading states properly
5. **Test error boundaries** - Ensure graceful error handling

## Future Improvements

- [ ] Add visual regression tests
- [ ] Implement E2E tests with Playwright
- [ ] Add performance testing
- [ ] Increase component test coverage
- [ ] Add accessibility testing
- [ ] Mock API calls for data-dependent tests

## Troubleshooting

### Common Issues

1. **Component not found** - Check if component is properly exported
2. **Context errors** - Ensure components are wrapped with providers
3. **Async timing issues** - Use `waitFor` for dynamic content
4. **Mock not working** - Verify mock is defined before import

### Debug Tips

```bash
# Run tests with debug output
npm run test -- --reporter=verbose

# Run single test with debugging
npm run test -- --run src/test/specific.test.js
```
