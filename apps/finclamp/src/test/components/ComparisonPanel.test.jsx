import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ComparisonPanel from '../../components/ComparisonPanel'

// Mock PDFExport component
vi.mock('../../components/PDFExport', () => ({
  default: ({ data }) => <div data-testid="pdf-export">PDF Export ({data.length} items)</div>
}))

describe('ComparisonPanel', () => {
  const mockOnRemove = vi.fn()
  const mockOnClose = vi.fn()

  const sampleData = [
    {
      id: '1',
      calculator: 'EMI Calculator',
      timestamp: new Date('2024-01-15T10:30:00Z').getTime(),
      inputs: {
        loanAmount: '₹10,00,000',
        interestRate: '8.5%',
        tenure: '20 years'
      },
      results: {
        monthlyEMI: '₹86,782',
        totalInterest: '₹80,27,680',
        totalAmount: '₹1,90,27,680'
      }
    },
    {
      id: '2',
      calculator: 'SIP Calculator',
      timestamp: new Date('2024-01-15T11:00:00Z').getTime(),
      inputs: {
        monthlyInvestment: '₹5,000',
        expectedReturn: '12%',
        timePeriod: '15 years'
      },
      results: {
        maturityAmount: '₹20,03,821',
        totalInvestment: '₹9,00,000',
        totalGains: '₹11,03,821'
      }
    }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('🏗️ Component Rendering', () => {
    test('should render null when no data provided', () => {
      const { container } = render(<ComparisonPanel data={null} onRemove={mockOnRemove} onClose={mockOnClose} />)
      expect(container.firstChild).toBeNull()
    })

    test('should render null when empty data array provided', () => {
      const { container } = render(<ComparisonPanel data={[]} onRemove={mockOnRemove} onClose={mockOnClose} />)
      expect(container.firstChild).toBeNull()
    })

    test('should render comparison panel with data', () => {
      render(<ComparisonPanel data={sampleData} onRemove={mockOnRemove} onClose={mockOnClose} />)
      
      expect(screen.getByText('finclamp.com - Calculator Comparison')).toBeInTheDocument()
      expect(screen.getByText('Compare your financial calculations side by side')).toBeInTheDocument()
    })

    test('should render mobile-specific text on small screens', () => {
      render(<ComparisonPanel data={sampleData} onRemove={mockOnRemove} onClose={mockOnClose} />)
      
      expect(screen.getByText('Compare calculations')).toBeInTheDocument()
    })
  })

  describe('🎯 Header Functionality', () => {
    test('should display correct title and emoji', () => {
      render(<ComparisonPanel data={sampleData} onRemove={mockOnRemove} onClose={mockOnClose} />)
      
      expect(screen.getByText('📊')).toBeInTheDocument()
      expect(screen.getByText('finclamp.com - Calculator Comparison')).toBeInTheDocument()
    })

    test('should call onClose when close button is clicked', () => {
      render(<ComparisonPanel data={sampleData} onRemove={mockOnRemove} onClose={mockOnClose} />)
      
      // Get the main close button (first one in header)
      const closeButtons = screen.getAllByText('✕')
      const mainCloseButton = closeButtons[0] // Header close button
      fireEvent.click(mainCloseButton)
      
      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })

    test('should have proper close button styling', () => {
      render(<ComparisonPanel data={sampleData} onRemove={mockOnRemove} onClose={mockOnClose} />)
      
      // Get the main close button (first one in header)
      const closeButtons = screen.getAllByText('✕')
      const mainCloseButton = closeButtons[0].closest('button')
      expect(mainCloseButton).toHaveClass('text-white', 'hover:bg-white/20', 'p-2', 'rounded-full')
    })
  })

  describe('📊 Data Display', () => {
    test('should display all calculator items', () => {
      render(<ComparisonPanel data={sampleData} onRemove={mockOnRemove} onClose={mockOnClose} />)
      
      expect(screen.getByText('EMI Calculator')).toBeInTheDocument()
      expect(screen.getByText('SIP Calculator')).toBeInTheDocument()
    })

    test('should display formatted timestamps', () => {
      render(<ComparisonPanel data={sampleData} onRemove={mockOnRemove} onClose={mockOnClose} />)
      
      // Check that timestamp is displayed (format may vary by locale)
      expect(screen.getAllByText(/Added:/)).toHaveLength(2) // One for each calculator
    })

    test('should display inputs section', () => {
      render(<ComparisonPanel data={sampleData} onRemove={mockOnRemove} onClose={mockOnClose} />)
      
      expect(screen.getAllByText('Inputs:')).toHaveLength(2)
      expect(screen.getByText('₹10,00,000')).toBeInTheDocument()
      expect(screen.getByText('8.5%')).toBeInTheDocument()
      expect(screen.getByText('20 years')).toBeInTheDocument()
    })

    test('should display results section', () => {
      render(<ComparisonPanel data={sampleData} onRemove={mockOnRemove} onClose={mockOnClose} />)
      
      expect(screen.getAllByText('Results:')).toHaveLength(2)
      expect(screen.getByText('₹86,782')).toBeInTheDocument()
      expect(screen.getByText('₹20,03,821')).toBeInTheDocument()
    })

    test('should format field names correctly', () => {
      render(<ComparisonPanel data={sampleData} onRemove={mockOnRemove} onClose={mockOnClose} />)
      
      // Check for formatted field names (they are capitalized in the component)
      expect(screen.getByText(/loan Amount:/)).toBeInTheDocument()
      expect(screen.getByText(/interest Rate:/)).toBeInTheDocument()
      expect(screen.getByText(/monthly E M I:/)).toBeInTheDocument()
    })
  })

  describe('🗑️ Remove Functionality', () => {
    test('should call onRemove when remove button is clicked', () => {
      render(<ComparisonPanel data={sampleData} onRemove={mockOnRemove} onClose={mockOnClose} />)
      
      const removeButtons = screen.getAllByText('✕').filter(btn => 
        btn.closest('button')?.className.includes('text-red-500')
      )
      
      fireEvent.click(removeButtons[0])
      expect(mockOnRemove).toHaveBeenCalledWith('1')
      
      fireEvent.click(removeButtons[1])
      expect(mockOnRemove).toHaveBeenCalledWith('2')
    })

    test('should have proper remove button styling', () => {
      render(<ComparisonPanel data={sampleData} onRemove={mockOnRemove} onClose={mockOnClose} />)
      
      const removeButtons = screen.getAllByText('✕').filter(btn => 
        btn.closest('button')?.className.includes('text-red-500')
      )
      
      removeButtons.forEach(button => {
        const buttonElement = button.closest('button')
        expect(buttonElement).toHaveClass('text-red-500', 'hover:bg-red-50', 'p-1', 'rounded-full')
      })
    })
  })

  describe('📄 PDF Export', () => {
    test('should show PDF export when data exists', () => {
      render(<ComparisonPanel data={sampleData} onRemove={mockOnRemove} onClose={mockOnClose} />)
      
      expect(screen.getByTestId('pdf-export')).toBeInTheDocument()
      expect(screen.getByText('PDF Export (2 items)')).toBeInTheDocument()
    })

    test('should not show PDF export when no data', () => {
      render(<ComparisonPanel data={[]} onRemove={mockOnRemove} onClose={mockOnClose} />)
      
      expect(screen.queryByTestId('pdf-export')).not.toBeInTheDocument()
    })
  })

  describe('🎨 Styling and Layout', () => {
    test('should have proper modal overlay styling', () => {
      const { container } = render(<ComparisonPanel data={sampleData} onRemove={mockOnRemove} onClose={mockOnClose} />)
      
      const overlay = container.firstChild
      expect(overlay).toHaveClass('fixed', 'inset-0', 'bg-black/50', 'backdrop-blur-sm', 'z-50')
    })

    test('should have responsive grid layout', () => {
      render(<ComparisonPanel data={sampleData} onRemove={mockOnRemove} onClose={mockOnClose} />)
      
      const gridContainer = screen.getByText('EMI Calculator').closest('.grid')
      expect(gridContainer).toHaveClass('grid-cols-1', 'lg:grid-cols-2', 'xl:grid-cols-3')
    })

    test('should have proper card styling', () => {
      render(<ComparisonPanel data={sampleData} onRemove={mockOnRemove} onClose={mockOnClose} />)
      
      const card = screen.getByText('EMI Calculator').closest('.bg-gray-50')
      expect(card).toHaveClass('bg-gray-50', 'rounded-xl', 'sm:rounded-2xl', 'relative')
    })
  })

  describe('🔄 Edge Cases', () => {
    test('should handle data without inputs', () => {
      const dataWithoutInputs = [{
        id: '1',
        calculator: 'Test Calculator',
        timestamp: Date.now(),
        results: { result: 'test' }
      }]
      
      render(<ComparisonPanel data={dataWithoutInputs} onRemove={mockOnRemove} onClose={mockOnClose} />)
      
      expect(screen.getByText('Test Calculator')).toBeInTheDocument()
      expect(screen.queryByText('Inputs:')).not.toBeInTheDocument()
    })

    test('should handle data without results', () => {
      const dataWithoutResults = [{
        id: '1',
        calculator: 'Test Calculator',
        timestamp: Date.now(),
        inputs: { input: 'test' }
      }]
      
      render(<ComparisonPanel data={dataWithoutResults} onRemove={mockOnRemove} onClose={mockOnClose} />)
      
      expect(screen.getByText('Test Calculator')).toBeInTheDocument()
      expect(screen.queryByText('Results:')).not.toBeInTheDocument()
    })

    test('should handle empty inputs and results objects', () => {
      const dataWithEmptyObjects = [{
        id: '1',
        calculator: 'Test Calculator',
        timestamp: Date.now(),
        inputs: {},
        results: {}
      }]
      
      render(<ComparisonPanel data={dataWithEmptyObjects} onRemove={mockOnRemove} onClose={mockOnClose} />)
      
      expect(screen.getByText('Test Calculator')).toBeInTheDocument()
    })

    test('should handle very long text values', () => {
      const dataWithLongText = [{
        id: '1',
        calculator: 'Very Long Calculator Name That Should Be Truncated Properly',
        timestamp: Date.now(),
        inputs: {
          veryLongFieldName: 'Very long value that should wrap properly and not break the layout'
        }
      }]
      
      render(<ComparisonPanel data={dataWithLongText} onRemove={mockOnRemove} onClose={mockOnClose} />)
      
      expect(screen.getByText(/Very Long Calculator Name/)).toBeInTheDocument()
    })
  })

  describe('♿ Accessibility', () => {
    test('should have proper button roles', () => {
      render(<ComparisonPanel data={sampleData} onRemove={mockOnRemove} onClose={mockOnClose} />)
      
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)
    })

    test('should have proper heading structure', () => {
      render(<ComparisonPanel data={sampleData} onRemove={mockOnRemove} onClose={mockOnClose} />)
      
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
      expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(2)
      expect(screen.getAllByRole('heading', { level: 4 })).toHaveLength(4)
    })
  })
})
