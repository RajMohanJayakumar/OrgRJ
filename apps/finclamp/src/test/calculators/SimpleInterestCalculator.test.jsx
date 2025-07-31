import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import SimpleInterestCalculator from '../../calculators/SimpleInterestCalculator'

// Mock all the context providers and hooks
vi.mock('../../contexts/ComparisonContext', () => ({
  useComparison: () => ({
    addToComparison: vi.fn()
  })
}))

vi.mock('../../contexts/CurrencyContext', () => ({
  useCurrency: () => ({
    formatCurrency: (amount) => `₹${amount.toLocaleString()}`,
    currentFormat: 'INR'
  })
}))

vi.mock('../../contexts/ViewModeContext', () => ({
  useViewMode: () => ({
    isMobile: false
  })
}))

vi.mock('../../hooks/useMobileResponsive', () => ({
  default: () => ({
    responsive: {
      isMobile: false,
      isTablet: false,
      isDesktop: true
    }
  })
}))

vi.mock('../../hooks/useURLState', () => ({
  useURLStateObject: () => [
    { principal: '', interestRate: '', timePeriod: '', calculationType: 'amount' },
    vi.fn()
  ],
  generateShareableURL: vi.fn()
}))

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }) => children
}))

// Mock components
vi.mock('../../components/CompactCurrencyDisplay', () => ({
  default: ({ amount, label }) => <div data-testid="currency-display">{label}: ₹{amount}</div>
}))

vi.mock('../../components/CommonPDFExport', () => ({
  default: ({ data }) => <button data-testid="pdf-export">Export PDF</button>
}))

vi.mock('../../components/common/inputs', () => ({
  NumberInput: ({ label, value, onChange, placeholder, ...props }) => (
    <div>
      <label>{label || 'Input'}</label>
      <input
        type="text"
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        data-testid={`input-${placeholder ? placeholder.toLowerCase().replace(/\s+/g, '-') : 'input'}`}
        {...props}
      />
    </div>
  )
}))

vi.mock('../../components/RelatedCalculators', () => ({
  default: () => <div data-testid="related-calculators">Related Calculators</div>
}))

vi.mock('../../components/ResetButton', () => ({
  default: ({ onReset }) => (
    <button onClick={onReset} data-testid="reset-button">Reset</button>
  )
}))

vi.mock('../../components/MobileLayout', () => ({
  default: ({ children }) => <div data-testid="mobile-layout">{children}</div>,
  MobileGrid: ({ children }) => <div data-testid="mobile-grid">{children}</div>
}))

describe('SimpleInterestCalculator', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders calculator with all input fields', () => {
    render(<SimpleInterestCalculator />)

    expect(screen.getByTestId('input-enter-amount')).toBeInTheDocument()
    expect(screen.getByTestId('input-enter-rate')).toBeInTheDocument()
    expect(screen.getByTestId('input-enter-value')).toBeInTheDocument()
  })

  test('renders reset button', () => {
    render(<SimpleInterestCalculator />)

    expect(screen.getByTestId('reset-button')).toBeInTheDocument()
  })

  test('renders calculator structure correctly', () => {
    render(<SimpleInterestCalculator />)

    // Check that the calculator renders without errors
    expect(screen.getByText('📊 Investment Details')).toBeInTheDocument()
    expect(screen.getByText('📊 Simple Interest Results')).toBeInTheDocument()
  })

  test('handles input interactions', async () => {
    render(<SimpleInterestCalculator />)

    const principalInput = screen.getByTestId('input-enter-amount')
    const rateInput = screen.getByTestId('input-enter-rate')
    const timeInput = screen.getByTestId('input-enter-value')

    // Test that inputs can be interacted with
    fireEvent.change(principalInput, { target: { value: '10000' } })
    fireEvent.change(rateInput, { target: { value: '10' } })
    fireEvent.change(timeInput, { target: { value: '2' } })

    // Verify inputs exist and can be interacted with
    expect(principalInput).toBeInTheDocument()
    expect(rateInput).toBeInTheDocument()
    expect(timeInput).toBeInTheDocument()
  })

  test('handles various input interactions', () => {
    render(<SimpleInterestCalculator />)

    const principalInput = screen.getByTestId('input-enter-amount')
    const rateInput = screen.getByTestId('input-enter-rate')
    const timeInput = screen.getByTestId('input-enter-value')

    // Test that various inputs don't cause errors
    expect(() => {
      fireEvent.change(principalInput, { target: { value: '0' } })
      fireEvent.change(rateInput, { target: { value: '10' } })
      fireEvent.change(timeInput, { target: { value: '2' } })

      fireEvent.change(principalInput, { target: { value: '15000.50' } })
      fireEvent.change(rateInput, { target: { value: '8.5' } })
      fireEvent.change(timeInput, { target: { value: '3.5' } })

      fireEvent.change(principalInput, { target: { value: '1000000' } })
      fireEvent.change(rateInput, { target: { value: '12' } })
      fireEvent.change(timeInput, { target: { value: '5' } })
    }).not.toThrow()
  })

  test('reset button functionality', () => {
    render(<SimpleInterestCalculator />)

    const resetButton = screen.getByTestId('reset-button')

    // Test that reset button can be clicked without errors
    expect(() => {
      fireEvent.click(resetButton)
    }).not.toThrow()
  })

  test('renders all required elements', () => {
    render(<SimpleInterestCalculator />)

    // Check that all required elements are present
    expect(screen.getByTestId('input-enter-amount')).toBeInTheDocument()
    expect(screen.getByTestId('input-enter-rate')).toBeInTheDocument()
    expect(screen.getByTestId('input-enter-value')).toBeInTheDocument()
    expect(screen.getByTestId('reset-button')).toBeInTheDocument()
    expect(screen.getByText(/Formula:/)).toBeInTheDocument()
  })
})
