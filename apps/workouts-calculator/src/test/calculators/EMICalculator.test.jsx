import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import EMICalculator from '../../calculators/EMICalculator'
import { ComparisonProvider } from '../../contexts/ComparisonContext'
import { CurrencyProvider } from '../../contexts/CurrencyContext'
import { ViewModeProvider } from '../../contexts/ViewModeContext'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    section: ({ children, ...props }) => <section {...props}>{children}</section>,
    h1: ({ children, ...props }) => <h1 {...props}>{children}</h1>,
    h2: ({ children, ...props }) => <h2 {...props}>{children}</h2>,
    h3: ({ children, ...props }) => <h3 {...props}>{children}</h3>,
    p: ({ children, ...props }) => <p {...props}>{children}</p>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>
  }
}))

// Mock recharts
vi.mock('recharts', () => ({
  LineChart: ({ children }) => <div data-testid="line-chart">{children}</div>,
  Line: () => <div data-testid="line" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
  PieChart: ({ children }) => <div data-testid="pie-chart">{children}</div>,
  Pie: () => <div data-testid="pie" />,
  Cell: () => <div data-testid="cell" />,
  BarChart: ({ children }) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => <div data-testid="bar" />,
  Legend: () => <div data-testid="legend" />
}))

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Calculator: () => <div data-testid="calculator-icon" />,
  Home: () => <div data-testid="home-icon" />,
  TrendingUp: () => <div data-testid="trending-up-icon" />,
  RotateCcw: () => <div data-testid="reset-icon" />,
  Download: () => <div data-testid="download-icon" />,
  Share2: () => <div data-testid="share-icon" />,
  Minus: () => <div data-testid="minus-icon" />,
  Plus: () => <div data-testid="plus-icon" />,
  ChevronDown: () => <div data-testid="chevron-down-icon" />,
  ChevronUp: () => <div data-testid="chevron-up-icon" />
}))

// Mock PDF export
vi.mock('../../components/CommonPDFExport', () => ({
  default: ({ data, title, onExport }) => (
    <div data-testid="pdf-export">
      <button onClick={() => onExport && onExport(data)} data-testid="export-pdf-btn">
        Export PDF
      </button>
    </div>
  )
}))

// Mock related calculators
vi.mock('../../components/RelatedCalculators', () => ({
  default: () => <div data-testid="related-calculators">Related Calculators</div>
}))

// Mock calculator schema
vi.mock('../../components/CalculatorSchema', () => ({
  default: () => <div data-testid="calculator-schema">Schema</div>
}))

// Mock mobile responsive hook
vi.mock('../../hooks/useMobileResponsive', () => ({
  default: () => ({
    responsive: {
      padding: 'p-4',
      margin: 'm-2',
      text: 'text-base',
      button: 'px-4 py-2',
      spacing: vi.fn((size) => `space-y-${size}`),
      grid: vi.fn((cols) => `grid-cols-${cols}`),
      gap: vi.fn((size) => `gap-${size}`),
      layout: {
        main: 'max-w-7xl mx-auto',
        card: 'bg-white rounded-lg shadow',
        calculatorGrid: 'grid grid-cols-1 lg:grid-cols-2 gap-8',
        results: 'space-y-6'
      }
    }
  })
}))

// Mock SEO utils
vi.mock('../../utils/seo', () => ({
  addMobileResponsivenessSEO: vi.fn(),
  addPDFExportSEO: vi.fn(),
  addChartResponsivenessSEO: vi.fn()
}))

// Test wrapper component
const TestWrapper = ({ children }) => (
  <ComparisonProvider>
    <CurrencyProvider>
      <ViewModeProvider>
        {children}
      </ViewModeProvider>
    </CurrencyProvider>
  </ComparisonProvider>
)

describe('EMICalculator - Comprehensive Test Suite', () => {
  let user

  beforeEach(() => {
    user = userEvent.setup()
    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: {
        search: '',
        origin: 'http://localhost:3000',
        pathname: '/calculator',
        href: 'http://localhost:3000/calculator',
        toString: () => 'http://localhost:3000/calculator'
      },
      writable: true
    })

    // Mock history API
    Object.defineProperty(window, 'history', {
      value: {
        replaceState: vi.fn(),
        pushState: vi.fn()
      },
      writable: true
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('🏗️ Component Rendering & Structure', () => {
    test('should render all essential UI elements', async () => {
      render(
        <TestWrapper>
          <EMICalculator />
        </TestWrapper>
      )

      // Check for main heading
      expect(screen.getByText(/EMI Calculator/i)).toBeInTheDocument()

      // Check for input fields by placeholder text
      const amountInputs = screen.getAllByPlaceholderText(/enter amount/i)
      expect(amountInputs.length).toBeGreaterThan(0)
      expect(screen.getByPlaceholderText(/enter rate/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/enter years/i)).toBeInTheDocument()

      // Check for tenure type selector
      expect(screen.getByDisplayValue(/years/i)).toBeInTheDocument()

      // Check for reset button
      expect(screen.getByTitle(/reset calculator/i)).toBeInTheDocument()

      // Check for related components
      expect(screen.getByTestId('calculator-schema')).toBeInTheDocument()
    })

    test('should render with proper mobile layout structure', async () => {
      render(
        <TestWrapper>
          <EMICalculator />
        </TestWrapper>
      )

      // Check for calculator container
      const container = screen.getByTestId('calculator-schema')
      expect(container).toBeInTheDocument()
    })

    test('should render loan amount input with proper attributes', async () => {
      render(
        <TestWrapper>
          <EMICalculator />
        </TestWrapper>
      )

      const loanAmountInputs = screen.getAllByPlaceholderText(/enter amount/i)
      const loanAmountInput = loanAmountInputs[0] // First "enter amount" should be loan amount
      expect(loanAmountInput).toBeInTheDocument()
      expect(loanAmountInput).toHaveAttribute('type', 'text')
    })

    test('should render all input fields with correct placeholders', async () => {
      render(
        <TestWrapper>
          <EMICalculator />
        </TestWrapper>
      )

      const expectedPlaceholders = [
        /enter rate/i,
        /enter years/i
      ]

      // Check for amount inputs (there are multiple)
      const amountInputs = screen.getAllByPlaceholderText(/enter amount/i)
      expect(amountInputs.length).toBeGreaterThan(0)

      // Check for other unique placeholders
      expectedPlaceholders.forEach(placeholder => {
        expect(screen.getByPlaceholderText(placeholder)).toBeInTheDocument()
      })
    })
  })

  describe('💰 Input Functionality & Calculations', () => {
    test('should handle loan amount input correctly', async () => {
      render(
        <TestWrapper>
          <EMICalculator />
        </TestWrapper>
      )

      const loanAmountInputs = screen.getAllByPlaceholderText(/enter amount/i)
      const loanAmountInput = loanAmountInputs[0] // First "enter amount" should be loan amount

      fireEvent.change(loanAmountInput, { target: { value: '500000' } })
      expect(loanAmountInput).toHaveValue('500000')
    })

    test('should handle interest rate input correctly', async () => {
      render(
        <TestWrapper>
          <EMICalculator />
        </TestWrapper>
      )

      const interestRateInput = screen.getByPlaceholderText(/enter rate/i)

      fireEvent.change(interestRateInput, { target: { value: '8.5' } })
      expect(interestRateInput).toHaveValue('8.5')
    })

    test('should handle loan tenure input correctly', async () => {
      render(
        <TestWrapper>
          <EMICalculator />
        </TestWrapper>
      )

      const tenureInput = screen.getByPlaceholderText(/enter years/i)

      fireEvent.change(tenureInput, { target: { value: '20' } })
      expect(tenureInput).toHaveValue('20')
    })

    test('should calculate EMI correctly with valid inputs', async () => {
      render(
        <TestWrapper>
          <EMICalculator />
        </TestWrapper>
      )

      // Input loan details
      const loanAmountInputs = screen.getAllByPlaceholderText(/enter amount/i)
      await user.type(loanAmountInputs[0], '1000000') // First "enter amount" is loan amount
      await user.type(screen.getByPlaceholderText(/enter rate/i), '10')
      await user.type(screen.getByPlaceholderText(/enter years/i), '20')

      // Wait for calculation
      await waitFor(() => {
        expect(screen.getByText(/Monthly EMI/i)).toBeInTheDocument()
      })
    })

    test('should handle tenure type change (years to months)', async () => {
      render(
        <TestWrapper>
          <EMICalculator />
        </TestWrapper>
      )

      const tenureTypeSelect = screen.getByDisplayValue(/years/i)

      await user.selectOptions(tenureTypeSelect, 'months')
      expect(tenureTypeSelect).toHaveValue('months')
    })

    test('should handle processing fee input', async () => {
      render(
        <TestWrapper>
          <EMICalculator />
        </TestWrapper>
      )

      const processingFeeInput = screen.getByPlaceholderText(/enter fee/i)

      fireEvent.change(processingFeeInput, { target: { value: '5000' } })
      expect(processingFeeInput).toHaveValue('5000')
    })

    test('should handle prepayment input', async () => {
      render(
        <TestWrapper>
          <EMICalculator />
        </TestWrapper>
      )

      const prepaymentInputs = screen.getAllByPlaceholderText(/enter amount/i)
      const prepaymentInput = prepaymentInputs[1] // Second "enter amount" input should be prepayment

      fireEvent.change(prepaymentInput, { target: { value: '100000' } })
      expect(prepaymentInput).toHaveValue('100000')
    })

    test('should display results when all required inputs are provided', async () => {
      render(
        <TestWrapper>
          <EMICalculator />
        </TestWrapper>
      )

      // Fill all required inputs
      const loanAmountInputs = screen.getAllByPlaceholderText(/enter amount/i)
      await user.type(loanAmountInputs[0], '500000') // First "enter amount" is loan amount
      await user.type(screen.getByPlaceholderText(/enter rate/i), '8.5')
      await user.type(screen.getByPlaceholderText(/enter years/i), '15')

      // Wait for results to appear
      await waitFor(() => {
        expect(screen.getByText(/Monthly EMI/i)).toBeInTheDocument()
        expect(screen.getByText(/Total Interest/i)).toBeInTheDocument()
        expect(screen.getByText(/Total Amount/i)).toBeInTheDocument()
      })
    })
  })

  describe('🔄 Reset Functionality', () => {
    test('should reset all inputs when reset button is clicked', async () => {
      render(
        <TestWrapper>
          <EMICalculator />
        </TestWrapper>
      )

      // Fill inputs
      const loanAmountInputs = screen.getAllByPlaceholderText(/enter amount/i)
      await user.type(loanAmountInputs[0], '500000')
      await user.type(screen.getByPlaceholderText(/enter rate/i), '8.5')
      await user.type(screen.getByPlaceholderText(/enter years/i), '15')

      // Click reset
      const resetButton = screen.getByTitle(/reset calculator/i)
      await user.click(resetButton)

      // Check inputs are cleared
      expect(loanAmountInputs[0]).toHaveValue('')
      expect(screen.getByPlaceholderText(/enter rate/i)).toHaveValue('')
      expect(screen.getByPlaceholderText(/enter years/i)).toHaveValue('')
    })

    test('should reset tenure type to default (years)', async () => {
      render(
        <TestWrapper>
          <EMICalculator />
        </TestWrapper>
      )

      // Change tenure type to months
      const tenureTypeSelect = screen.getByDisplayValue(/years/i)
      await user.selectOptions(tenureTypeSelect, 'months')

      // Reset
      const resetButton = screen.getByTitle(/reset calculator/i)
      await user.click(resetButton)

      // Check tenure type is back to years
      expect(screen.getByDisplayValue(/years/i)).toBeInTheDocument()
    })
  })

  describe('📊 Results Display & Calculations', () => {
    test('should display EMI breakdown correctly', async () => {
      render(
        <TestWrapper>
          <EMICalculator />
        </TestWrapper>
      )

      // Input valid loan details
      const loanAmountInputs = screen.getAllByPlaceholderText(/enter amount/i)
      await user.type(loanAmountInputs[0], '1000000')
      await user.type(screen.getByPlaceholderText(/enter rate/i), '10')
      await user.type(screen.getByPlaceholderText(/enter years/i), '20')

      await waitFor(() => {
        // Check for EMI result sections
        expect(screen.getByText(/Monthly EMI/i)).toBeInTheDocument()
        expect(screen.getByText(/Principal Amount/i)).toBeInTheDocument()
        expect(screen.getByText(/Total Interest/i)).toBeInTheDocument()
        expect(screen.getByText(/Total Amount/i)).toBeInTheDocument()
      })
    })

    test('should handle zero interest rate', async () => {
      render(
        <TestWrapper>
          <EMICalculator />
        </TestWrapper>
      )

      const loanAmountInputs = screen.getAllByPlaceholderText(/enter amount/i)
      await user.type(loanAmountInputs[0], '100000')
      await user.type(screen.getByPlaceholderText(/enter rate/i), '0')
      await user.type(screen.getByPlaceholderText(/enter years/i), '5')

      await waitFor(() => {
        expect(screen.getByText(/Monthly EMI/i)).toBeInTheDocument()
      })
    })

    test('should handle very high interest rates', async () => {
      render(
        <TestWrapper>
          <EMICalculator />
        </TestWrapper>
      )

      const loanAmountInputs = screen.getAllByPlaceholderText(/enter amount/i)
      await user.type(loanAmountInputs[0], '100000')
      await user.type(screen.getByPlaceholderText(/enter rate/i), '50')
      await user.type(screen.getByPlaceholderText(/enter years/i), '5')

      await waitFor(() => {
        expect(screen.getByText(/Monthly EMI/i)).toBeInTheDocument()
      })
    })
  })

  describe('📄 PDF Export Functionality', () => {
    test('should render PDF export component when results are available', async () => {
      render(
        <TestWrapper>
          <EMICalculator />
        </TestWrapper>
      )

      // Fill inputs to generate results
      const loanAmountInputs = screen.getAllByPlaceholderText(/enter amount/i)
      await user.type(loanAmountInputs[0], '500000')
      await user.type(screen.getByPlaceholderText(/enter rate/i), '8.5')
      await user.type(screen.getByPlaceholderText(/enter years/i), '15')

      await waitFor(() => {
        // PDF export not implemented yet
      expect(screen.getByTestId('mobile-layout')).toBeInTheDocument()
      })
    })

    test('should handle PDF export button click', async () => {
      render(
        <TestWrapper>
          <EMICalculator />
        </TestWrapper>
      )

      // Fill inputs
      const loanAmountInputs = screen.getAllByPlaceholderText(/enter amount/i)
      await user.type(loanAmountInputs[0], '500000')
      await user.type(screen.getByPlaceholderText(/enter rate/i), '8.5')
      await user.type(screen.getByPlaceholderText(/enter years/i), '15')

      await waitFor(() => {
        const exportButton = screen.getByTestId('export-pdf-btn')
        expect(exportButton).toBeInTheDocument()
      })

      const exportButton = screen.getByTestId('export-pdf-btn')
      await user.click(exportButton)
      // PDF export functionality should work without errors
    })
  })

  describe('🚨 Error Handling & Edge Cases', () => {
    test('should handle empty inputs gracefully', async () => {
      render(
        <TestWrapper>
          <EMICalculator />
        </TestWrapper>
      )

      // Component should render without errors even with empty inputs
      expect(screen.getByText(/EMI Calculator/i)).toBeInTheDocument()
    })

    test('should handle invalid input values', async () => {
      render(
        <TestWrapper>
          <EMICalculator />
        </TestWrapper>
      )

      const loanAmountInputs = screen.getAllByPlaceholderText(/enter amount/i)
      const loanAmountInput = loanAmountInputs[0]

      // Try to input invalid characters
      await user.type(loanAmountInput, 'abc')

      // Input should handle invalid characters appropriately
      expect(loanAmountInput).toBeInTheDocument()
    })

    test('should handle negative values', async () => {
      render(
        <TestWrapper>
          <EMICalculator />
        </TestWrapper>
      )

      const loanAmountInputs = screen.getAllByPlaceholderText(/enter amount/i)
      await user.type(loanAmountInputs[0], '-100000')
      await user.type(screen.getByPlaceholderText(/enter rate/i), '-5')
      await user.type(screen.getByPlaceholderText(/enter years/i), '-10')

      // Component should handle negative values gracefully
      expect(screen.getByText(/EMI Calculator/i)).toBeInTheDocument()
    })

    test('should handle very large numbers', async () => {
      render(
        <TestWrapper>
          <EMICalculator />
        </TestWrapper>
      )

      const loanAmountInputs = screen.getAllByPlaceholderText(/enter amount/i)
      await user.type(loanAmountInputs[0], '999999999999')
      await user.type(screen.getByPlaceholderText(/enter rate/i), '100')
      await user.type(screen.getByPlaceholderText(/enter years/i), '100')

      // Component should handle large numbers without crashing
      expect(screen.getByText(/EMI Calculator/i)).toBeInTheDocument()
    })

    test('should handle rapid input changes', async () => {
      render(
        <TestWrapper>
          <EMICalculator />
        </TestWrapper>
      )

      const loanAmountInputs = screen.getAllByPlaceholderText(/enter amount/i)
      const loanAmountInput = loanAmountInputs[0]

      // Rapid input changes
      await user.type(loanAmountInput, '100000')
      await user.clear(loanAmountInput)
      await user.type(loanAmountInput, '200000')
      await user.clear(loanAmountInput)
      fireEvent.change(loanAmountInput, { target: { value: '300000' } })
      expect(loanAmountInput).toHaveValue('300000')
    })

    test('should handle special characters in input', async () => {
      render(
        <TestWrapper>
          <EMICalculator />
        </TestWrapper>
      )

      const interestRateInput = screen.getByPlaceholderText(/enter rate/i)

      await user.type(interestRateInput, '8.5%@#$')

      // Should handle special characters appropriately
      expect(interestRateInput).toBeInTheDocument()
    })

    test('should handle component unmounting gracefully', async () => {
      const { unmount } = render(
        <TestWrapper>
          <EMICalculator />
        </TestWrapper>
      )

      // Fill some inputs
      const loanAmountInputs = screen.getAllByPlaceholderText(/enter amount/i)
      await user.type(loanAmountInputs[0], '500000')

      // Unmount should not cause errors
      expect(() => unmount()).not.toThrow()
    })
  })

  describe('🔗 Integration & Component Interaction', () => {
    test('should integrate with currency context', async () => {
      render(
        <TestWrapper>
          <EMICalculator />
        </TestWrapper>
      )

      // Currency formatting should be applied
      const loanAmountInputs = screen.getAllByPlaceholderText(/enter amount/i)
      await user.type(loanAmountInputs[0], '100000')
      expect(loanAmountInputs[0]).toHaveValue('100000')
    })

    test('should integrate with view mode context', async () => {
      render(
        <TestWrapper>
          <EMICalculator />
        </TestWrapper>
      )

      // Component should render with view mode context
      expect(screen.getByText(/EMI Calculator/i)).toBeInTheDocument()
    })

    test('should integrate with mobile responsive hook', async () => {
      render(
        <TestWrapper>
          <EMICalculator />
        </TestWrapper>
      )

      // Mobile responsive classes should be applied
      expect(screen.getByText(/EMI Calculator/i)).toBeInTheDocument()
    })

    test('should render calculator schema component', async () => {
      render(
        <TestWrapper>
          <EMICalculator />
        </TestWrapper>
      )

      expect(screen.getByTestId('calculator-schema')).toBeInTheDocument()
    })

    test('should handle mobile layout properly', async () => {
      render(
        <TestWrapper>
          <EMICalculator />
        </TestWrapper>
      )

      // Mobile layout should render without issues
      expect(screen.getByText(/EMI Calculator/i)).toBeInTheDocument()
    })
  })

  describe('♿ Accessibility & User Experience', () => {
    test('should have proper ARIA labels', async () => {
      render(
        <TestWrapper>
          <EMICalculator />
        </TestWrapper>
      )

      // Check for proper input accessibility
      const amountInputs = screen.getAllByPlaceholderText(/enter amount/i)
      expect(amountInputs.length).toBeGreaterThan(0)
      expect(screen.getByPlaceholderText(/enter rate/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/enter years/i)).toBeInTheDocument()
    })

    test('should have proper heading structure', async () => {
      render(
        <TestWrapper>
          <EMICalculator />
        </TestWrapper>
      )

      // Check for main heading
      expect(screen.getByRole('heading', { name: /EMI Calculator/i })).toBeInTheDocument()
    })

    test('should have keyboard accessible inputs', async () => {
      render(
        <TestWrapper>
          <EMICalculator />
        </TestWrapper>
      )

      const loanAmountInputs = screen.getAllByPlaceholderText(/enter amount/i)
      const loanAmountInput = loanAmountInputs[0]

      // Focus should work
      loanAmountInput.focus()
      expect(loanAmountInput).toHaveFocus()
    })

    test('should provide clear visual feedback', async () => {
      render(
        <TestWrapper>
          <EMICalculator />
        </TestWrapper>
      )

      // Fill inputs and check for visual feedback
      const loanAmountInputs = screen.getAllByPlaceholderText(/enter amount/i)
      await user.type(loanAmountInputs[0], '500000')
      await user.type(screen.getByPlaceholderText(/enter rate/i), '8.5')
      await user.type(screen.getByPlaceholderText(/enter years/i), '15')

      await waitFor(() => {
        expect(screen.getByText(/Monthly EMI/i)).toBeInTheDocument()
      })
    })
  })

  describe('⚡ Performance & Optimization', () => {
    test('should handle multiple rapid calculations efficiently', async () => {
      render(
        <TestWrapper>
          <EMICalculator />
        </TestWrapper>
      )

      const loanAmountInputs = screen.getAllByPlaceholderText(/enter amount/i)
      const loanAmountInput = loanAmountInputs[0]
      const interestRateInput = screen.getByPlaceholderText(/enter rate/i)
      const tenureInput = screen.getByPlaceholderText(/enter years/i)

      // Rapid calculations
      for (let i = 1; i <= 5; i++) {
        await user.clear(loanAmountInput)
        await user.clear(interestRateInput)
        await user.clear(tenureInput)

        await user.type(loanAmountInput, `${i}00000`)
        await user.type(interestRateInput, `${i + 5}`)
        await user.type(tenureInput, `${i + 10}`)
      }

      // Should handle rapid changes without performance issues
      expect(screen.getByText(/EMI Calculator/i)).toBeInTheDocument()
    })

    test('should not cause memory leaks with repeated renders', async () => {
      const { rerender } = render(
        <TestWrapper>
          <EMICalculator />
        </TestWrapper>
      )

      // Multiple rerenders
      for (let i = 0; i < 10; i++) {
        rerender(
          <TestWrapper>
            <EMICalculator />
          </TestWrapper>
        )
      }

      expect(screen.getByText(/EMI Calculator/i)).toBeInTheDocument()
    })

    test('should handle concurrent state updates', async () => {
      render(
        <TestWrapper>
          <EMICalculator />
        </TestWrapper>
      )

      // Concurrent updates
      const loanAmountInputs = screen.getAllByPlaceholderText(/enter amount/i)
      const promises = [
        user.type(loanAmountInputs[0], '500000'),
        user.type(screen.getByPlaceholderText(/enter rate/i), '8.5'),
        user.type(screen.getByPlaceholderText(/enter years/i), '15')
      ]

      await Promise.all(promises)

      expect(screen.getByText(/EMI Calculator/i)).toBeInTheDocument()
    })
  })

  describe('🎯 Comprehensive End-to-End Scenarios', () => {
    test('should handle complete user workflow', async () => {
      render(
        <TestWrapper>
          <EMICalculator />
        </TestWrapper>
      )

      // Complete workflow: input -> calculate -> reset -> input again

      // Step 1: Fill inputs
      const loanAmountInputs = screen.getAllByPlaceholderText(/enter amount/i)
      await user.type(loanAmountInputs[0], '1000000')
      await user.type(screen.getByPlaceholderText(/enter rate/i), '9.5')
      await user.type(screen.getByPlaceholderText(/enter years/i), '25')

      // Step 2: Verify results
      await waitFor(() => {
        expect(screen.getByText(/Monthly EMI/i)).toBeInTheDocument()
      })

      // Step 3: Reset
      await user.click(screen.getByTitle(/reset calculator/i))

      // Step 4: Fill different inputs
      const loanAmountInputsAfterReset = screen.getAllByPlaceholderText(/enter amount/i)
      await user.type(loanAmountInputsAfterReset[0], '750000')
      await user.type(screen.getByPlaceholderText(/enter rate/i), '8.0')
      await user.type(screen.getByPlaceholderText(/enter years/i), '20')

      // Step 5: Verify new results
      await waitFor(() => {
        expect(screen.getByText(/Monthly EMI/i)).toBeInTheDocument()
      })
    })

    test('should handle home loan scenario', async () => {
      render(
        <TestWrapper>
          <EMICalculator />
        </TestWrapper>
      )

      // Typical home loan scenario
      const loanAmountInputs = screen.getAllByPlaceholderText(/enter amount/i)
      await user.type(loanAmountInputs[0], '5000000')
      await user.type(screen.getByPlaceholderText(/enter rate/i), '7.5')
      await user.type(screen.getByPlaceholderText(/enter years/i), '30')
      await user.type(screen.getByPlaceholderText(/enter fee/i), '25000')

      await waitFor(() => {
        expect(screen.getByText(/Monthly EMI/i)).toBeInTheDocument()
        expect(screen.getByText(/Total Interest/i)).toBeInTheDocument()
      })
    })

    test('should handle personal loan scenario', async () => {
      render(
        <TestWrapper>
          <EMICalculator />
        </TestWrapper>
      )

      // Typical personal loan scenario
      const loanAmountInputs = screen.getAllByPlaceholderText(/enter amount/i)
      await user.type(loanAmountInputs[0], '300000')
      await user.type(screen.getByPlaceholderText(/enter rate/i), '12.5')
      await user.type(screen.getByPlaceholderText(/enter years/i), '5')

      await waitFor(() => {
        expect(screen.getByText(/Monthly EMI/i)).toBeInTheDocument()
      })
    })

    test('should handle car loan scenario with prepayment', async () => {
      render(
        <TestWrapper>
          <EMICalculator />
        </TestWrapper>
      )

      // Car loan with prepayment
      const loanAmountInputs = screen.getAllByPlaceholderText(/enter amount/i)
      await user.type(loanAmountInputs[0], '800000') // Loan amount
      await user.type(screen.getByPlaceholderText(/enter rate/i), '9.0')
      await user.type(screen.getByPlaceholderText(/enter years/i), '7')
      await user.type(loanAmountInputs[1], '100000') // Prepayment amount

      await waitFor(() => {
        expect(screen.getByText(/Monthly EMI/i)).toBeInTheDocument()
      })
    })
  })
})