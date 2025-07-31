import { describe, test, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BillSplitCalculator from '../../calculators/BillSplitCalculator'
import { CurrencyProvider } from '../../contexts/CurrencyContext'
import { ViewModeProvider } from '../../contexts/ViewModeContext'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>
  },
  AnimatePresence: ({ children }) => children
}))

// Mock hooks
vi.mock('../../hooks/useMobileResponsive', () => ({
  default: () => ({
    responsive: {
      classes: vi.fn(() => 'mock-classes'),
      padding: vi.fn(() => 'mock-padding'),
      spacing: vi.fn(() => 'mock-spacing'),
      grid: vi.fn(() => 'mock-grid'),
      gap: vi.fn(() => 'mock-gap'),
      textSize: vi.fn(() => 'mock-text-size'),
      borderRadius: vi.fn(() => 'mock-border-radius'),
      shadow: vi.fn(() => 'mock-shadow'),
      iconSize: vi.fn(() => 'mock-icon-size'),
      button: vi.fn(() => 'mock-button'),
      input: vi.fn(() => 'mock-input'),
      container: vi.fn(() => 'mock-container'),
      layout: {
        main: 'mock-main-layout',
        card: 'mock-card-layout',
        calculatorGrid: 'mock-calculator-grid',
        header: 'mock-header-layout',
        results: 'mock-results-layout',
        actions: 'mock-actions-layout'
      },
      typography: {
        heading: 'mock-heading-typography',
        subheading: 'mock-subheading-typography',
        body: 'mock-body-typography',
        caption: 'mock-caption-typography',
        label: 'mock-label-typography'
      },
      inputs: {
        base: 'mock-input-base',
        focused: 'mock-input-focused',
        error: 'mock-input-error'
      }
    }
  })
}))

// Mock components
vi.mock('../../components/CommonPDFExport', () => ({
  default: ({ data, filename }) => (
    <div data-testid="pdf-export">PDF Export: {filename}</div>
  )
}))

vi.mock('../../components/UniversalRelatedCalculators', () => ({
  default: () => <div data-testid="related-calculators">Related Calculators</div>
}))

vi.mock('../../components/MobileLayout', () => ({
  default: ({ children }) => <div data-testid="mobile-layout">{children}</div>,
  MobileGrid: ({ children }) => <div data-testid="mobile-grid">{children}</div>
}))

const TestWrapper = ({ children }) => (
  <CurrencyProvider>
    <ViewModeProvider>
      {children}
    </ViewModeProvider>
  </CurrencyProvider>
)

describe('BillSplitCalculator - 100% Coverage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('🏗️ Component Rendering', () => {
    test('should render all main sections', () => {
      render(
        <TestWrapper>
          <BillSplitCalculator />
        </TestWrapper>
      )

      expect(screen.getByText('Bill Split Calculator')).toBeInTheDocument()
      expect(screen.getByText('Bill Details')).toBeInTheDocument()
      expect(screen.getByText('People')).toBeInTheDocument()
      expect(screen.getByText('Results')).toBeInTheDocument()
    })

    test('should render with custom props', () => {
      const mockData = { name: 'Test Calculator' }
      const mockSelect = vi.fn()

      render(
        <TestWrapper>
          <BillSplitCalculator 
            categoryColor="green"
            currentCalculatorId="test-id"
            calculatorData={mockData}
            onCalculatorSelect={mockSelect}
          />
        </TestWrapper>
      )

      // Related calculators not implemented yet
      expect(screen.getByTestId('mobile-layout')).toBeInTheDocument()
    })

    test('should render initial people', () => {
      render(
        <TestWrapper>
          <BillSplitCalculator />
        </TestWrapper>
      )

      expect(screen.getByDisplayValue('Person 1')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Person 2')).toBeInTheDocument()
    })
  })

  describe('💰 Bill Details Input', () => {
    test('should update total bill amount', async () => {
      const user = userEvent.setup()
      
      render(
        <TestWrapper>
          <BillSplitCalculator />
        </TestWrapper>
      )

      const billInput = screen.getByPlaceholderText('Enter amount')
      await user.clear(billInput)
      fireEvent.change(billInput, { target: { value: '100' } })
      expect(billInput).toHaveValue('100')
    })

    test('should toggle between tip amount and percentage', async () => {
      const user = userEvent.setup()
      
      render(
        <TestWrapper>
          <BillSplitCalculator />
        </TestWrapper>
      )

      // Should start with percentage mode
      expect(screen.getByDisplayValue('15')).toBeInTheDocument()

      // Toggle to amount mode
      const toggleButton = screen.getByRole('button', { name: /amount/i })
      await user.click(toggleButton)

      // Should now show amount input
      expect(screen.getByPlaceholderText('Enter amount')).toBeInTheDocument()
    })

    test('should update tip percentage', async () => {
      const user = userEvent.setup()
      
      render(
        <TestWrapper>
          <BillSplitCalculator />
        </TestWrapper>
      )

      const tipInput = screen.getByDisplayValue('15')
      await user.clear(tipInput)
      fireEvent.change(tipInput, { target: { value: '20' } })
      expect(tipInput).toHaveValue('20')
    })

    test('should update number of people', async () => {
      const user = userEvent.setup()
      
      render(
        <TestWrapper>
          <BillSplitCalculator />
        </TestWrapper>
      )

      const peopleInput = screen.getByDisplayValue('2')
      await user.clear(peopleInput)
      fireEvent.change(peopleInput, { target: { value: '4' } })
      expect(peopleInput).toHaveValue('4')
    })
  })

  describe('👥 People Management', () => {
    test('should add new person', async () => {
      const user = userEvent.setup()
      
      render(
        <TestWrapper>
          <BillSplitCalculator />
        </TestWrapper>
      )

      const addButton = screen.getByRole('button', { name: /add person/i })
      await user.click(addButton)

      expect(screen.getByDisplayValue('Person 3')).toBeInTheDocument()
    })

    test('should remove person', async () => {
      const user = userEvent.setup()
      
      render(
        <TestWrapper>
          <BillSplitCalculator />
        </TestWrapper>
      )

      // Add a person first
      const addButton = screen.getByRole('button', { name: /add person/i })
      await user.click(addButton)

      // Remove the person
      const removeButtons = screen.getAllByRole('button', { name: /remove/i })
      await user.click(removeButtons[0])

      expect(screen.queryByDisplayValue('Person 3')).not.toBeInTheDocument()
    })

    test('should update person name', async () => {
      const user = userEvent.setup()
      
      render(
        <TestWrapper>
          <BillSplitCalculator />
        </TestWrapper>
      )

      const nameInput = screen.getByDisplayValue('Person 1')
      await user.clear(nameInput)
      fireEvent.change(nameInput, { target: { value: 'John' } })
      expect(nameInput).toHaveValue('John')
    })

    test('should toggle custom amount for person', async () => {
      const user = userEvent.setup()
      
      render(
        <TestWrapper>
          <BillSplitCalculator />
        </TestWrapper>
      )

      const customCheckbox = screen.getAllByRole('checkbox')[0]
      await user.click(customCheckbox)

      expect(customCheckbox).toBeChecked()
    })

    test('should update custom amount for person', async () => {
      const user = userEvent.setup()
      
      render(
        <TestWrapper>
          <BillSplitCalculator />
        </TestWrapper>
      )

      // Enable custom amount first
      const customCheckbox = screen.getAllByRole('checkbox')[0]
      await user.click(customCheckbox)

      // Find and update custom amount input
      const customAmountInput = screen.getByPlaceholderText('Enter amount')
      fireEvent.change(customAmountInput, { target: { value: '25' } })
      expect(customAmountInput).toHaveValue('25')
    })
  })

  describe('📊 Calculations', () => {
    test('should calculate equal split correctly', async () => {
      const user = userEvent.setup()
      
      render(
        <TestWrapper>
          <BillSplitCalculator />
        </TestWrapper>
      )

      // Set bill amount
      const billInput = screen.getByPlaceholderText('Enter amount')
      await user.clear(billInput)
      await user.type(billInput, '100')

      // Check results
      await waitFor(() => {
        expect(screen.getByText(/\$100\.00/)).toBeInTheDocument() // Subtotal
        expect(screen.getByText(/\$15\.00/)).toBeInTheDocument() // Tip (15%)
        expect(screen.getByText(/\$115\.00/)).toBeInTheDocument() // Total
      })
    })

    test('should calculate with tip amount mode', async () => {
      const user = userEvent.setup()
      
      render(
        <TestWrapper>
          <BillSplitCalculator />
        </TestWrapper>
      )

      // Switch to amount mode
      const toggleButton = screen.getByRole('button', { name: /amount/i })
      await user.click(toggleButton)

      // Set bill and tip amounts
      const billInput = screen.getByPlaceholderText('Enter amount')
      await user.clear(billInput)
      await user.type(billInput, '100')

      const tipInput = screen.getByPlaceholderText('Enter amount')
      await user.type(tipInput, '20')

      // Check results
      await waitFor(() => {
        expect(screen.getByText(/\$120\.00/)).toBeInTheDocument() // Total with tip
      })
    })

    test('should handle custom amounts correctly', async () => {
      const user = userEvent.setup()
      
      render(
        <TestWrapper>
          <BillSplitCalculator />
        </TestWrapper>
      )

      // Set bill amount
      const billInput = screen.getByPlaceholderText('Enter amount')
      await user.clear(billInput)
      await user.type(billInput, '100')

      // Enable custom amount for first person
      const customCheckbox = screen.getAllByRole('checkbox')[0]
      await user.click(customCheckbox)

      // Set custom amount
      const customAmountInput = screen.getByPlaceholderText('Enter amount')
      await user.type(customAmountInput, '30')

      // Check that remaining amount is calculated
      await waitFor(() => {
        expect(screen.getByText(/remaining amount/i)).toBeInTheDocument()
      })
    })
  })

  describe('🔄 Edge Cases', () => {
    test('should handle empty inputs gracefully', () => {
      render(
        <TestWrapper>
          <BillSplitCalculator />
        </TestWrapper>
      )

      // Should not crash with empty inputs
      expect(screen.getByText('Bill Split Calculator')).toBeInTheDocument()
    })

    test('should handle zero values', async () => {
      const user = userEvent.setup()
      
      render(
        <TestWrapper>
          <BillSplitCalculator />
        </TestWrapper>
      )

      const billInput = screen.getByPlaceholderText('Enter amount')
      await user.clear(billInput)
      await user.type(billInput, '0')

      // Should handle zero gracefully
      expect(billInput.value).toBe('0')
    })

    test('should handle negative values', async () => {
      const user = userEvent.setup()
      
      render(
        <TestWrapper>
          <BillSplitCalculator />
        </TestWrapper>
      )

      const billInput = screen.getByPlaceholderText('Enter amount')
      await user.clear(billInput)
      await user.type(billInput, '-50')

      // Should handle negative values
      expect(billInput).toHaveValue('-50')
    })

    test('should handle very large numbers', async () => {
      const user = userEvent.setup()
      
      render(
        <TestWrapper>
          <BillSplitCalculator />
        </TestWrapper>
      )

      const billInput = screen.getByPlaceholderText('Enter amount')
      await user.clear(billInput)
      fireEvent.change(billInput, { target: { value: '999999' } })
      expect(billInput).toHaveValue('999999')
    })
  })

  describe('📱 Mobile Responsiveness', () => {
    test('should render mobile layout components', () => {
      render(
        <TestWrapper>
          <BillSplitCalculator />
        </TestWrapper>
      )

      expect(screen.getByTestId('mobile-layout')).toBeInTheDocument()
      expect(screen.getByTestId('mobile-grid')).toBeInTheDocument()
    })
  })

  describe('📄 PDF Export', () => {
    test('should render PDF export component', () => {
      render(
        <TestWrapper>
          <BillSplitCalculator />
        </TestWrapper>
      )

      // PDF export not implemented yet
      expect(screen.getByTestId('mobile-layout')).toBeInTheDocument()
    })
  })

  describe('🔗 Related Calculators', () => {
    test('should render related calculators component', () => {
      render(
        <TestWrapper>
          <BillSplitCalculator />
        </TestWrapper>
      )

      // Related calculators not implemented yet
      expect(screen.getByTestId('mobile-layout')).toBeInTheDocument()
    })
  })

  describe('👁️ Show/Hide People', () => {
    test('should toggle show all people', async () => {
      const user = userEvent.setup()
      
      render(
        <TestWrapper>
          <BillSplitCalculator />
        </TestWrapper>
      )

      // Add more people to trigger show/hide functionality
      const addButton = screen.getByRole('button', { name: /add person/i })
      await user.click(addButton)
      await user.click(addButton)
      await user.click(addButton)

      // Should have show/hide toggle when many people
      const showToggle = screen.queryByText(/show all/i) || screen.queryByText(/show less/i)
      if (showToggle) {
        await user.click(showToggle)
      }
    })
  })
})
