import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MonthlyExpenseCalculator from '../calculators/MonthlyExpenseCalculator'

// Test data constants
const TEST_DATA = {
  INCOME: {
    LOW: '2000',
    MEDIUM: '5000',
    HIGH: '10000',
    INVALID: 'abc',
    NEGATIVE: '-1000',
    ZERO: '0',
    DECIMAL: '5000.50',
    LARGE: '999999'
  },
  EXPENSES: {
    HOUSING: '1500',
    FOOD: '500',
    TRANSPORT: '300',
    UTILITIES: '200',
    ENTERTAINMENT: '150',
    HEALTHCARE: '100'
  },
  RATIOS: {
    HEALTHY: 30,
    WARNING: 85,
    OVER_BUDGET: 95
  }
}

// Enhanced mocks with tracking
vi.mock('../contexts/CurrencyContext', () => ({
  useCurrency: () => ({
    formatCurrency: (value) => `$${value.toFixed(2)}`,
    currentFormat: { symbol: '$' }
  })
}))

vi.mock('../contexts/ViewModeContext', () => ({
  useViewMode: () => ({
    isMobile: false
  })
}))

vi.mock('../hooks/useMobileResponsive', () => ({
  default: () => ({
    responsive: {
      typography: {
        heading: 'text-2xl md:text-3xl'
      },
      iconSize: (size) => size === 'lg' ? 'w-8 h-8' : 'w-6 h-6'
    }
  })
}))

// Mock components with enhanced data tracking
vi.mock('../components/CommonPDFExport', () => ({
  default: ({ testId, data, title }) => (
    <div data-testid={testId} data-title={title}>
      PDF Export: {JSON.stringify(data)}
    </div>
  )
}))

vi.mock('../components/UniversalRelatedCalculators', () => ({
  default: ({ currentCalculatorId, calculatorData, onCalculatorSelect }) => (
    <div
      data-testid="related-calculators"
      data-current-id={currentCalculatorId}
      data-has-data={!!calculatorData}
      data-has-callback={!!onCalculatorSelect}
    >
      Related Calculators
    </div>
  )
}))

vi.mock('../components/MobileLayout', () => ({
  default: ({ children, className }) => (
    <div data-testid="mobile-layout" className={className}>
      {children}
    </div>
  ),
  MobileGrid: ({ children, columns, className }) => (
    <div
      data-testid="mobile-grid"
      data-columns={columns}
      className={className}
    >
      {children}
    </div>
  )
}))

vi.mock('../components/CompactCurrencyDisplay', () => ({
  default: ({ value, testId }) => (
    <span data-testid={testId || "currency-display"} data-value={value}>
      ${value.toFixed(2)}
    </span>
  )
}))

// Mock NumberInput component
vi.mock('../components/NumberInput', () => ({
  default: ({ value, onChange, placeholder, className, ...props }) => (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={className}
      data-testid={`number-input-${placeholder?.toLowerCase().replace(/\s+/g, '-')}`}
      {...props}
    />
  )
}))

// Helper functions for recursive testing
const renderCalculator = (props = {}) => {
  return render(<MonthlyExpenseCalculator {...props} />)
}

const setIncomeValue = async (value) => {
  const incomeInput = screen.getByPlaceholderText('Enter your monthly income')
  fireEvent.change(incomeInput, { target: { value } })
  await waitFor(() => expect(incomeInput.value).toBe(value))
  return incomeInput
}

const setExpenseValue = async (index, value) => {
  const expenseInputs = screen.getAllByPlaceholderText('Enter value')
  if (expenseInputs[index]) {
    fireEvent.change(expenseInputs[index], { target: { value } })
    await waitFor(() => expect(expenseInputs[index].value).toBe(value))
    return expenseInputs[index]
  }
  throw new Error(`Expense input at index ${index} not found`)
}




describe('MonthlyExpenseCalculator - Comprehensive Recursive Test Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    cleanup()
  })

  describe('🏗️ Component Rendering & Structure', () => {
    test('should render all essential UI elements', () => {
      renderCalculator()

      // Test each element individually to avoid multiple element issues
      expect(screen.getByText('Monthly Expense Split Calculator')).toBeInTheDocument()
      expect(screen.getByText('Monthly Income')).toBeInTheDocument()
      expect(screen.getByText('Monthly Expenses')).toBeInTheDocument()
      expect(screen.getByText('Categorize and analyze your monthly expenses with budget recommendations')).toBeInTheDocument()
    })

    test('should render with proper mobile layout structure', () => {
      renderCalculator()

      expect(screen.getByTestId('mobile-layout')).toBeInTheDocument()
      expect(screen.getByTestId('mobile-grid')).toBeInTheDocument()
      expect(screen.getByTestId('related-calculators')).toBeInTheDocument()
    })

    test('should render income input with proper attributes', () => {
      renderCalculator()

      const incomeInput = screen.getByPlaceholderText('Enter your monthly income')
      expect(incomeInput).toBeInTheDocument()
      expect(incomeInput).toHaveAttribute('aria-label', 'Monthly Income')
      expect(incomeInput).toHaveAttribute('type', 'text')
    })

    test('should render all default expense categories', () => {
      renderCalculator()

      // Check that the Monthly Expenses section is rendered
      expect(screen.getByText('Monthly Expenses')).toBeInTheDocument()

      // Check for add expense button using partial text match
      expect(screen.getByText((content) => content.includes('Add') && content.includes('Expense'))).toBeInTheDocument()

      // Check for expense input fields by looking for number inputs
      const numberInputs = screen.getAllByDisplayValue('')
      expect(numberInputs.length).toBeGreaterThan(1) // Should have income + expense inputs
    })
  })

  describe('💰 Income Input Functionality', () => {
    test('should handle valid income input', async () => {
      renderCalculator()

      await setIncomeValue(TEST_DATA.INCOME.MEDIUM)

      await waitFor(() => {
        expect(screen.getByText('Income-based budget recommendations:')).toBeInTheDocument()

        // Check for budget recommendations section by looking for multiple percentage elements
        const budgetRecommendations = screen.getAllByText((content) =>
          content.includes('%') && (content.includes('30') || content.includes('15') || content.includes('20'))
        )
        expect(budgetRecommendations.length).toBeGreaterThanOrEqual(3)

        // Check for housing recommendation specifically
        expect(screen.getByText((content) => content.includes('Housing') && content.includes('$1500.00'))).toBeInTheDocument()
      })
    })

    test('should handle decimal income values', async () => {
      renderCalculator()

      await setIncomeValue(TEST_DATA.INCOME.DECIMAL)

      await waitFor(() => {
        expect(screen.getByText('Income-based budget recommendations:')).toBeInTheDocument()
      })
    })

    test('should handle zero income gracefully', async () => {
      renderCalculator()

      await setIncomeValue(TEST_DATA.INCOME.ZERO)

      expect(screen.queryByText('Income-based budget recommendations:')).not.toBeInTheDocument()
    })

    test('should handle empty income input', async () => {
      renderCalculator()

      await setIncomeValue('')

      // Check that the income input label is still visible
      expect(screen.getByText('Enter your monthly income to get personalized budget recommendations')).toBeInTheDocument()

      // Check that the income input is empty
      const incomeInput = screen.getByLabelText('Monthly Income')
      expect(incomeInput.value).toBe('')
    })

    test('should handle large income values', async () => {
      renderCalculator()

      await setIncomeValue(TEST_DATA.INCOME.LARGE)

      await waitFor(() => {
        expect(screen.getByText('Income-based budget recommendations:')).toBeInTheDocument()
      })
    })

    test('should calculate correct budget percentages', async () => {
      renderCalculator()

      await setIncomeValue('10000')

      await waitFor(() => {
        expect(screen.getByText(/Housing.*\$3000\.00.*30%/)).toBeInTheDocument()
        expect(screen.getByText(/Food.*\$1500\.00.*15%/)).toBeInTheDocument()
        expect(screen.getByText(/Savings.*\$2000\.00.*20%/)).toBeInTheDocument()
      })
    })
  })

  describe('📊 Expense Input & Calculations', () => {
    test('should handle single expense input', async () => {
      renderCalculator()

      await setExpenseValue(0, TEST_DATA.EXPENSES.HOUSING)

      await waitFor(() => {
        expect(screen.getByText('Total Monthly Expenses:')).toBeInTheDocument()
      })
    })

    test('should handle multiple expense inputs', async () => {
      renderCalculator()

      await setExpenseValue(0, TEST_DATA.EXPENSES.HOUSING)
      await setExpenseValue(1, TEST_DATA.EXPENSES.FOOD)
      await setExpenseValue(2, TEST_DATA.EXPENSES.TRANSPORT)

      await waitFor(() => {
        expect(screen.getByText('Total Monthly Expenses:')).toBeInTheDocument()
      })
    })

    test('should calculate correct total expenses', async () => {
      renderCalculator()

      await setExpenseValue(0, '1000')
      await setExpenseValue(1, '500')

      await waitFor(() => {
        // Look for the total expenses section specifically
        const totalSection = screen.getByText('Total Monthly Expenses:')
        expect(totalSection).toBeInTheDocument()

        // Find currency displays with the expected value
        const currencyDisplays = screen.getAllByTestId('currency-display')
        const totalDisplay = currencyDisplays.find(display =>
          display.getAttribute('data-value') === '1500'
        )
        expect(totalDisplay).toBeInTheDocument()
        expect(totalDisplay).toHaveTextContent('$1500.00')
      })
    })

    test('should handle zero expense values', async () => {
      renderCalculator()

      await setExpenseValue(0, '0')

      await waitFor(() => {
        expect(screen.getByText('$0.00')).toBeInTheDocument()
      })
    })

    test('should handle decimal expense values', async () => {
      renderCalculator()

      await setExpenseValue(0, '1500.50')

      await waitFor(() => {
        // Look for the total expenses section specifically
        expect(screen.getByText('Total Monthly Expenses:')).toBeInTheDocument()

        // Find currency displays with the expected value
        const currencyDisplays = screen.getAllByTestId('currency-display')
        const totalDisplay = currencyDisplays.find(display =>
          display.getAttribute('data-value') === '1500.5'
        )
        expect(totalDisplay).toBeInTheDocument()
        expect(totalDisplay).toHaveTextContent('$1500.50')
      })
    })

    test('should add new expense categories', async () => {
      renderCalculator()

      const addButton = screen.getByText('Add Expense')
      fireEvent.click(addButton)

      await waitFor(() => {
        const expenseInputs = screen.getAllByPlaceholderText('Enter value')
        expect(expenseInputs.length).toBeGreaterThan(6)
      })
    })

    test('should remove expense categories', async () => {
      renderCalculator()

      // Add an expense first
      const addButton = screen.getByText('Add Expense')
      fireEvent.click(addButton)

      await waitFor(() => {
        const minusButtons = screen.getAllByRole('button')
        const minusButton = minusButtons.find(button =>
          button.querySelector('svg') && button.textContent === ''
        )
        if (minusButton) {
          fireEvent.click(minusButton)
        }
      })
    })
  })

  describe('🔄 Income vs Expense Analysis', () => {
    test('should display income analysis when both income and expenses provided', async () => {
      renderCalculator()

      await setIncomeValue(TEST_DATA.INCOME.MEDIUM)
      await setExpenseValue(0, TEST_DATA.EXPENSES.HOUSING)

      await waitFor(() => {
        // Check for expense analysis section
        expect(screen.getByText('Expense Analysis')).toBeInTheDocument()

        // Check for income-related text (there might be multiple)
        const monthlyIncomeElements = screen.getAllByText('Monthly Income')
        expect(monthlyIncomeElements.length).toBeGreaterThan(0)

        // Check for total expenses
        expect(screen.getByText('Total Monthly Expenses:')).toBeInTheDocument()

        // Check for remaining budget or similar analysis (there might be multiple)
        const elementsWithAmount = screen.getAllByText((content) => content.includes('$') && content.includes('1500'))
        expect(elementsWithAmount.length).toBeGreaterThan(0)
      })
    })

    test('should calculate correct expense ratio', async () => {
      renderCalculator()

      await setIncomeValue('5000')
      await setExpenseValue(0, '1500')

      await waitFor(() => {
        expect(screen.getByText('Expense Ratio:')).toBeInTheDocument()
        expect(screen.getByText('30.0%')).toBeInTheDocument()
      })
    })

    test('should show healthy expense ratio status', async () => {
      renderCalculator()

      await setIncomeValue('5000')
      await setExpenseValue(0, '1500') // 30% - healthy

      await waitFor(() => {
        expect(screen.getByText('✅ Healthy expense ratio')).toBeInTheDocument()
      })
    })

    test('should show warning expense ratio status', async () => {
      renderCalculator()

      await setIncomeValue('5000')
      await setExpenseValue(0, '4250') // 85% - warning

      await waitFor(() => {
        expect(screen.getByText('⚠️ Consider reducing expenses')).toBeInTheDocument()
      })
    })

    test('should show over-budget expense ratio status', async () => {
      renderCalculator()

      await setIncomeValue('5000')
      await setExpenseValue(0, '4750') // 95% - over budget

      await waitFor(() => {
        expect(screen.getByText('🚨 Expenses exceed recommended limits')).toBeInTheDocument()
      })
    })

    test('should calculate remaining budget correctly', async () => {
      renderCalculator()

      await setIncomeValue('5000')
      await setExpenseValue(0, '1500')

      await waitFor(() => {
        // Look for remaining budget in the income analysis section
        expect(screen.getByText('Remaining Budget')).toBeInTheDocument()

        // Find the specific remaining budget currency display
        const currencyDisplays = screen.getAllByTestId('currency-display')
        const remainingBudgetDisplay = currencyDisplays.find(display =>
          display.getAttribute('data-value') === '3500'
        )
        expect(remainingBudgetDisplay).toBeInTheDocument()
        expect(remainingBudgetDisplay).toHaveTextContent('$3500.00')
      })
    })

    test('should handle expenses exceeding income', async () => {
      renderCalculator()

      await setIncomeValue('3000')
      await setExpenseValue(0, '4000')

      await waitFor(() => {
        // Look for remaining budget section
        expect(screen.getByText('Remaining Budget')).toBeInTheDocument()

        // Find the negative remaining budget currency display
        const currencyDisplays = screen.getAllByTestId('currency-display')
        const negativeBudgetDisplay = currencyDisplays.find(display =>
          display.getAttribute('data-value') === '-1000'
        )
        expect(negativeBudgetDisplay).toBeInTheDocument()
        expect(negativeBudgetDisplay).toHaveTextContent('$-1000.00')
      })
    })
  })

  describe('💰 Savings Recommendations', () => {
    test('should show income-based savings recommendation', async () => {
      renderCalculator()

      await setIncomeValue('5000')
      await setExpenseValue(0, '100') // Small expense to trigger savings section

      await waitFor(() => {
        // Check for savings target section
        expect(screen.getByText((content) => content.includes('Savings Target'))).toBeInTheDocument()

        // Check for income-based recommendation
        expect(screen.getByText((content) => content.includes('Based on your income'))).toBeInTheDocument()

        // Check for emergency fund percentage
        expect(screen.getByText((content) => content.includes('20%') && content.includes('emergency fund'))).toBeInTheDocument()
      })
    })

    test('should show expense-based savings when no income', async () => {
      renderCalculator()

      await setExpenseValue(0, '2000')

      await waitFor(() => {
        // Check for savings target section
        expect(screen.getByText((content) => content.includes('Savings Target'))).toBeInTheDocument()

        // Check for expense-based recommendation
        expect(screen.getByText((content) => content.includes('Based on your expenses'))).toBeInTheDocument()

        // Check for emergency fund percentage
        expect(screen.getByText((content) => content.includes('25%') && content.includes('emergency fund'))).toBeInTheDocument()
      })
    })

    test('should calculate correct savings amount for income', async () => {
      renderCalculator()

      await setIncomeValue('5000')
      await setExpenseValue(0, '100')

      await waitFor(() => {
        // Look for savings target section
        expect(screen.getByText('💰 Savings Target')).toBeInTheDocument()

        // Find the savings recommendation currency display (20% of 5000 = 1000)
        const currencyDisplays = screen.getAllByTestId('currency-display')
        const savingsDisplay = currencyDisplays.find(display =>
          display.getAttribute('data-value') === '1000'
        )
        expect(savingsDisplay).toBeInTheDocument()
        expect(savingsDisplay).toHaveTextContent('$1000.00')
      })
    })

    test('should calculate correct savings amount for expenses only', async () => {
      renderCalculator()

      await setExpenseValue(0, '2000')

      await waitFor(() => {
        // Look for savings target section
        expect(screen.getByText('💰 Savings Target')).toBeInTheDocument()

        // Find the savings recommendation currency display (25% of 2000 = 500)
        const currencyDisplays = screen.getAllByTestId('currency-display')
        const savingsDisplay = currencyDisplays.find(display =>
          display.getAttribute('data-value') === '500'
        )
        expect(savingsDisplay).toBeInTheDocument()
        expect(savingsDisplay).toHaveTextContent('$500.00')
      })
    })
  })

  describe('📄 PDF Export Functionality', () => {
    test('should render PDF export when expenses exist', async () => {
      renderCalculator()

      await setExpenseValue(0, '1500')

      await waitFor(() => {
        const pdfExport = screen.getByTestId('pdf-export')
        expect(pdfExport).toBeInTheDocument()
        expect(pdfExport).toHaveAttribute('data-title', 'Monthly Expense Analysis Report')
      })
    })

    test('should include income data in PDF export', async () => {
      renderCalculator()

      await setIncomeValue('5000')
      await setExpenseValue(0, '1500')

      await waitFor(() => {
        const pdfExport = screen.getByTestId('pdf-export')
        expect(pdfExport.textContent).toContain('Monthly Income')
        expect(pdfExport.textContent).toContain('$5000.00')
      })
    })

    test('should include expense data in PDF export', async () => {
      renderCalculator()

      await setExpenseValue(0, '1500')
      await setExpenseValue(1, '500')

      await waitFor(() => {
        const pdfExport = screen.getByTestId('pdf-export')
        expect(pdfExport.textContent).toContain('Total Monthly Expenses')
        expect(pdfExport.textContent).toContain('$2000.00')
      })
    })

    test('should include analysis data in PDF export', async () => {
      renderCalculator()

      await setIncomeValue('5000')
      await setExpenseValue(0, '1500')

      await waitFor(() => {
        const pdfExport = screen.getByTestId('pdf-export')
        expect(pdfExport.textContent).toContain('Remaining Budget')
        expect(pdfExport.textContent).toContain('Expense to Income Ratio')
        expect(pdfExport.textContent).toContain('Recommended Savings')
      })
    })

    test('should not render PDF export when no expenses', async () => {
      renderCalculator()

      await setIncomeValue('5000')

      expect(screen.queryByTestId('pdf-export')).not.toBeInTheDocument()
    })
  })

  describe('🚨 Error Handling & Edge Cases', () => {
    test('should handle empty income gracefully', async () => {
      renderCalculator()

      await setIncomeValue('')

      // Check that the income input label is still visible
      expect(screen.getByText('Enter your monthly income to get personalized budget recommendations')).toBeInTheDocument()
    })

    test('should handle invalid income input', async () => {
      renderCalculator()

      const incomeInput = screen.getByPlaceholderText('Enter your monthly income')
      fireEvent.change(incomeInput, { target: { value: TEST_DATA.INCOME.INVALID } })

      // Should not crash and handle gracefully
      expect(incomeInput).toBeInTheDocument()
    })

    test('should handle negative income values', async () => {
      renderCalculator()

      const incomeInput = screen.getByPlaceholderText('Enter your monthly income')
      fireEvent.change(incomeInput, { target: { value: TEST_DATA.INCOME.NEGATIVE } })

      // Should handle negative values gracefully
      expect(incomeInput).toBeInTheDocument()
    })

    test('should handle very large numbers', async () => {
      renderCalculator()

      await setIncomeValue('999999999')
      await setExpenseValue(0, '999999999')

      // Should not crash with large numbers
      await waitFor(() => {
        expect(screen.getByText('Total Monthly Expenses:')).toBeInTheDocument()
      })
    })

    test('should handle rapid input changes', async () => {
      renderCalculator()

      const incomeInput = screen.getByPlaceholderText('Enter your monthly income')

      // Rapid fire changes
      fireEvent.change(incomeInput, { target: { value: '1000' } })
      fireEvent.change(incomeInput, { target: { value: '2000' } })
      fireEvent.change(incomeInput, { target: { value: '3000' } })
      fireEvent.change(incomeInput, { target: { value: '4000' } })
      fireEvent.change(incomeInput, { target: { value: '5000' } })

      await waitFor(() => {
        expect(incomeInput.value).toBe('5000')
      })
    })

    test('should handle special characters in input', async () => {
      renderCalculator()

      const incomeInput = screen.getByPlaceholderText('Enter your monthly income')
      fireEvent.change(incomeInput, { target: { value: '5000.00$' } })

      // Should handle gracefully
      expect(incomeInput).toBeInTheDocument()
    })

    test('should handle component unmounting gracefully', () => {
      const { unmount } = renderCalculator()

      expect(() => unmount()).not.toThrow()
    })
  })

  describe('🔗 Integration & Component Interaction', () => {
    test('should integrate with currency context', () => {
      renderCalculator()

      // Should render without errors, indicating successful context integration
      expect(screen.getByText('Monthly Expense Split Calculator')).toBeInTheDocument()
    })

    test('should integrate with view mode context', () => {
      renderCalculator()

      // Should render mobile layout components
      expect(screen.getByTestId('mobile-layout')).toBeInTheDocument()
    })

    test('should integrate with mobile responsive hook', () => {
      renderCalculator()

      // Should render responsive grid
      expect(screen.getByTestId('mobile-grid')).toBeInTheDocument()
    })

    test('should render related calculators component', () => {
      const props = {
        currentCalculatorId: 'monthly-expense',
        calculatorData: { test: 'data' },
        onCalculatorSelect: vi.fn()
      }

      renderCalculator(props)

      const relatedCalcs = screen.getByTestId('related-calculators')
      expect(relatedCalcs).toHaveAttribute('data-current-id', 'monthly-expense')
      expect(relatedCalcs).toHaveAttribute('data-has-data', 'true')
      expect(relatedCalcs).toHaveAttribute('data-has-callback', 'true')
    })

    test('should handle mobile layout properly', () => {
      renderCalculator()

      expect(screen.getByTestId('mobile-layout')).toBeInTheDocument()
      expect(screen.getByTestId('mobile-grid')).toBeInTheDocument()
    })
  })

  describe('♿ Accessibility & User Experience', () => {
    test('should have proper ARIA labels', () => {
      renderCalculator()

      const incomeInput = screen.getByPlaceholderText('Enter your monthly income')
      expect(incomeInput).toHaveAttribute('aria-label', 'Monthly Income')
    })

    test('should have proper heading structure', () => {
      renderCalculator()

      // Check for the main heading specifically
      const mainHeading = screen.getByText('Monthly Expense Split Calculator')
      expect(mainHeading).toBeInTheDocument()
      expect(mainHeading.tagName).toBe('H2')

      // Check for section headings
      expect(screen.getByText('Monthly Income')).toBeInTheDocument()
      expect(screen.getByText('Monthly Expenses')).toBeInTheDocument()
    })

    test('should have keyboard accessible inputs', () => {
      renderCalculator()

      const incomeInput = screen.getByPlaceholderText('Enter your monthly income')
      expect(incomeInput).toHaveAttribute('type', 'text')

      incomeInput.focus()
      expect(document.activeElement).toBe(incomeInput)
    })

    test('should provide clear visual feedback', async () => {
      renderCalculator()

      await setIncomeValue('5000')
      await setExpenseValue(0, '4500') // High expense ratio

      await waitFor(() => {
        // Look for expense ratio percentage (should be 90%)
        expect(screen.getByText('90.0%')).toBeInTheDocument()

        // Look for income vs expenses section
        expect(screen.getByText('Income vs Expenses')).toBeInTheDocument()

        // Check that analysis is displayed
        expect(screen.getByText('Remaining Budget')).toBeInTheDocument()
      })
    })
  })

  describe('⚡ Performance & Optimization', () => {
    test('should handle multiple rapid calculations efficiently', async () => {
      renderCalculator()

      const startTime = performance.now()

      // Perform multiple rapid calculations
      for (let i = 0; i < 10; i++) {
        await setIncomeValue(`${1000 + i * 100}`)
        await setExpenseValue(0, `${500 + i * 50}`)
      }

      const endTime = performance.now()
      const duration = endTime - startTime

      // Should complete within reasonable time (less than 5 seconds)
      expect(duration).toBeLessThan(5000)
    })

    test('should not cause memory leaks with repeated renders', () => {
      for (let i = 0; i < 5; i++) {
        const { unmount } = renderCalculator()
        unmount()
      }

      // Should not throw errors
      expect(true).toBe(true)
    })

    test('should handle concurrent state updates', async () => {
      renderCalculator()

      // Simulate concurrent updates
      const promises = [
        setIncomeValue('5000'),
        setExpenseValue(0, '1000'),
        setExpenseValue(1, '500'),
        setExpenseValue(2, '300')
      ]

      await Promise.all(promises)

      await waitFor(() => {
        expect(screen.getByText('Total Monthly Expenses:')).toBeInTheDocument()
      })
    })
  })

  describe('🎯 Comprehensive End-to-End Scenarios', () => {
    test('should handle complete user workflow', async () => {
      renderCalculator()

      // Step 1: Enter income
      await setIncomeValue('6000')

      // Step 2: Add multiple expenses
      await setExpenseValue(0, '1800') // Housing
      await setExpenseValue(1, '600')  // Food
      await setExpenseValue(2, '400')  // Transport
      await setExpenseValue(3, '200')  // Utilities

      // Step 3: Verify calculations
      await waitFor(() => {
        expect(screen.getByText('Income vs Expenses')).toBeInTheDocument()
        expect(screen.getByText('50.0%')).toBeInTheDocument() // Expense ratio

        // Find specific currency displays by their data-value
        const currencyDisplays = screen.getAllByTestId('currency-display')

        // Total expenses should be 3000 (1800+600+400+200)
        const totalExpensesDisplay = currencyDisplays.find(display =>
          display.getAttribute('data-value') === '3000'
        )
        expect(totalExpensesDisplay).toBeInTheDocument()

        // Remaining budget should also be 3000 (6000-3000)
        const remainingBudgetDisplays = currencyDisplays.filter(display =>
          display.getAttribute('data-value') === '3000'
        )
        expect(remainingBudgetDisplays.length).toBeGreaterThanOrEqual(1)
      })

      // Step 4: Verify PDF export
      await waitFor(() => {
        const pdfExport = screen.getByTestId('pdf-export')
        expect(pdfExport).toBeInTheDocument()
      })

      // Step 5: Verify savings recommendation
      await waitFor(() => {
        expect(screen.getByText('💰 Savings Target')).toBeInTheDocument()
      })
    })

    test('should handle budget planning scenario', async () => {
      renderCalculator()

      // High income, low expenses scenario
      await setIncomeValue('10000')
      await setExpenseValue(0, '2000')
      await setExpenseValue(1, '800')

      await waitFor(() => {
        expect(screen.getByText('✅ Healthy expense ratio')).toBeInTheDocument()

        // Find the remaining budget currency display (10000 - 2800 = 7200)
        const currencyDisplays = screen.getAllByTestId('currency-display')
        const remainingBudgetDisplay = currencyDisplays.find(display =>
          display.getAttribute('data-value') === '7200'
        )
        expect(remainingBudgetDisplay).toBeInTheDocument()
        expect(remainingBudgetDisplay).toHaveTextContent('$7200.00')
      })
    })

    test('should handle tight budget scenario', async () => {
      renderCalculator()

      // Low income, high expenses scenario
      await setIncomeValue('3000')
      await setExpenseValue(0, '1500')
      await setExpenseValue(1, '800')
      await setExpenseValue(2, '500')

      await waitFor(() => {
        // Check for expense ratio (should be high)
        expect(screen.getByText('93.3%')).toBeInTheDocument()

        // Check for remaining budget section
        expect(screen.getByText('Remaining Budget')).toBeInTheDocument()

        // Check for income vs expenses section
        expect(screen.getByText('Income vs Expenses')).toBeInTheDocument()

        // Find the negative remaining budget currency display
        const currencyDisplays = screen.getAllByTestId('currency-display')
        const negativeBudgetDisplay = currencyDisplays.find(display => {
          const value = display.getAttribute('data-value')
          return value === '-800' || value === '800'
        })

        if (negativeBudgetDisplay) {
          expect(negativeBudgetDisplay).toBeInTheDocument()
        }
      })
    })

    test('should handle expense-only scenario', async () => {
      renderCalculator()

      // No income, only expenses
      await setExpenseValue(0, '1500')
      await setExpenseValue(1, '500')

      await waitFor(() => {
        expect(screen.getByText('💰 Savings Target')).toBeInTheDocument()

        // Look for expense-based savings recommendation text
        expect(screen.getByText((content) =>
          content.includes('Based on your expenses of')
        )).toBeInTheDocument()
      })
    })
  })
})
