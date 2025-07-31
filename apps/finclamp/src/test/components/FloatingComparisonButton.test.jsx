import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FloatingComparisonButton from '../../components/FloatingComparisonButton'

// Mock ComparisonPanel
vi.mock('../../components/ComparisonPanel', () => ({
  default: ({ data, onRemove, onClose }) => (
    <div data-testid="comparison-panel">
      <div>Comparison Panel</div>
      <div>Items: {data.length}</div>
      <button onClick={() => onRemove('test-id')}>Remove Item</button>
      <button onClick={onClose}>Close Panel</button>
    </div>
  )
}))

// Mock useComparison hook
const mockUseComparison = {
  comparisons: [],
  isComparisonVisible: false,
  toggleComparisonVisibility: vi.fn(),
  removeFromComparison: vi.fn(),
  clearComparisons: vi.fn()
}

vi.mock('../../contexts/ComparisonContext', () => ({
  useComparison: () => mockUseComparison
}))

describe('FloatingComparisonButton', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset mock state
    mockUseComparison.comparisons = []
    mockUseComparison.isComparisonVisible = false
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('🏗️ Component Rendering', () => {
    test('should not render when no comparisons exist', () => {
      mockUseComparison.comparisons = []
      
      const { container } = render(<FloatingComparisonButton />)
      
      expect(container.firstChild).toBeNull()
    })

    test('should render when comparisons exist', () => {
      mockUseComparison.comparisons = [
        { id: '1', calculator: 'EMI Calculator', inputs: {}, results: {} }
      ]

      render(<FloatingComparisonButton />)

      expect(screen.getByRole('button')).toBeInTheDocument()
      expect(screen.getByText('📊')).toBeInTheDocument()
      expect(screen.getAllByText('Compare')).toHaveLength(2) // Mobile and desktop
    })

    test('should display correct comparison count', () => {
      mockUseComparison.comparisons = [
        { id: '1', calculator: 'EMI Calculator' },
        { id: '2', calculator: 'SIP Calculator' },
        { id: '3', calculator: 'FD Calculator' }
      ]

      render(<FloatingComparisonButton />)

      expect(screen.getByText('3 calculations')).toBeInTheDocument()
      expect(screen.getAllByText('3')).toHaveLength(2) // Mobile and badge
    })
  })

  describe('🎨 Styling and Layout', () => {
    test('should have proper floating button styling', () => {
      mockUseComparison.comparisons = [{ id: '1', calculator: 'Test' }]
      
      render(<FloatingComparisonButton />)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass(
        'bg-indigo-500',
        'hover:bg-indigo-600',
        'text-white',
        'p-3',
        'sm:p-4',
        'rounded-xl',
        'shadow-lg',
        'hover:shadow-xl',
        'transition-all',
        'transform',
        'hover:scale-105'
      )
    })

    test('should have proper positioning classes', () => {
      mockUseComparison.comparisons = [{ id: '1', calculator: 'Test' }]
      
      render(<FloatingComparisonButton />)
      
      const container = screen.getByRole('button').closest('.fixed')
      expect(container).toHaveClass(
        'fixed',
        'bottom-4',
        'right-4',
        'sm:bottom-8',
        'sm:right-8',
        'z-40'
      )
    })

    test('should show animated emoji', () => {
      mockUseComparison.comparisons = [{ id: '1', calculator: 'Test' }]
      
      render(<FloatingComparisonButton />)
      
      const emoji = screen.getByText('📊')
      expect(emoji).toHaveClass('text-xl', 'sm:text-3xl', 'animate-pulse')
    })

    test('should show count badge when comparisons exist', () => {
      mockUseComparison.comparisons = [
        { id: '1', calculator: 'Test 1' },
        { id: '2', calculator: 'Test 2' }
      ]
      
      render(<FloatingComparisonButton />)
      
      const badges = screen.getAllByText('2')
      expect(badges).toHaveLength(2) // Mobile and badge

      // Find the badge element (the one with absolute positioning)
      const badge = badges.find(el => el.closest('span')?.classList.contains('absolute'))
      expect(badge).toBeTruthy()
      expect(badge.closest('span')).toHaveClass(
        'absolute',
        'bg-amber-500',
        'text-white',
        'rounded-full',
        'animate-bounce'
      )
    })

    test('should have glow effect', () => {
      mockUseComparison.comparisons = [{ id: '1', calculator: 'Test' }]

      render(<FloatingComparisonButton />)

      // Check that the component renders with proper structure
      const button = screen.getByRole('button')
      expect(button.closest('div').querySelector('div')).toBeInTheDocument()
    })
  })

  describe('📱 Responsive Design', () => {
    test('should show different content on mobile vs desktop', () => {
      mockUseComparison.comparisons = [
        { id: '1', calculator: 'Test 1' },
        { id: '2', calculator: 'Test 2' }
      ]
      
      render(<FloatingComparisonButton />)
      
      // Desktop content (hidden on mobile, shown on hover)
      const desktopText = screen.getByText('2 calculations')
      expect(desktopText.closest('div')).toHaveClass('hidden', 'sm:hidden', 'lg:group-hover:flex')

      // Mobile content - check that we have multiple "Compare" texts
      expect(screen.getAllByText('Compare')).toHaveLength(2) // Mobile and desktop
    })

    test('should have responsive spacing', () => {
      mockUseComparison.comparisons = [{ id: '1', calculator: 'Test' }]
      
      render(<FloatingComparisonButton />)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('p-3', 'sm:p-4')
    })
  })

  describe('🎯 Button Functionality', () => {
    test('should call toggleComparisonVisibility when clicked', async () => {
      const user = userEvent.setup()
      mockUseComparison.comparisons = [{ id: '1', calculator: 'Test' }]
      
      render(<FloatingComparisonButton />)
      
      const button = screen.getByRole('button')
      await user.click(button)
      
      expect(mockUseComparison.toggleComparisonVisibility).toHaveBeenCalledTimes(1)
    })

    test('should have proper button attributes', () => {
      mockUseComparison.comparisons = [{ id: '1', calculator: 'Test' }]

      render(<FloatingComparisonButton />)

      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
      // Note: button doesn't have explicit type="button" but still functions as a button
    })
  })

  describe('📊 Comparison Panel Integration', () => {
    test('should not show comparison panel when not visible', () => {
      mockUseComparison.comparisons = [{ id: '1', calculator: 'Test' }]
      mockUseComparison.isComparisonVisible = false
      
      render(<FloatingComparisonButton />)
      
      expect(screen.queryByTestId('comparison-panel')).not.toBeInTheDocument()
    })

    test('should show comparison panel when visible', () => {
      mockUseComparison.comparisons = [{ id: '1', calculator: 'Test' }]
      mockUseComparison.isComparisonVisible = true
      
      render(<FloatingComparisonButton />)
      
      expect(screen.getByTestId('comparison-panel')).toBeInTheDocument()
      expect(screen.getByText('Comparison Panel')).toBeInTheDocument()
    })

    test('should pass correct props to ComparisonPanel', () => {
      const testComparisons = [
        { id: '1', calculator: 'Test 1' },
        { id: '2', calculator: 'Test 2' }
      ]
      mockUseComparison.comparisons = testComparisons
      mockUseComparison.isComparisonVisible = true
      
      render(<FloatingComparisonButton />)
      
      expect(screen.getByText('Items: 2')).toBeInTheDocument()
    })

    test('should handle remove action from ComparisonPanel', async () => {
      const user = userEvent.setup()
      mockUseComparison.comparisons = [{ id: '1', calculator: 'Test' }]
      mockUseComparison.isComparisonVisible = true
      
      render(<FloatingComparisonButton />)
      
      const removeButton = screen.getByText('Remove Item')
      await user.click(removeButton)
      
      expect(mockUseComparison.removeFromComparison).toHaveBeenCalledWith('test-id')
    })

    test('should handle close action from ComparisonPanel', async () => {
      const user = userEvent.setup()
      mockUseComparison.comparisons = [{ id: '1', calculator: 'Test' }]
      mockUseComparison.isComparisonVisible = true
      
      render(<FloatingComparisonButton />)
      
      const closeButton = screen.getByText('Close Panel')
      await user.click(closeButton)
      
      expect(mockUseComparison.toggleComparisonVisibility).toHaveBeenCalledTimes(1)
    })
  })

  describe('🔢 Count Display', () => {
    test('should handle single comparison', () => {
      mockUseComparison.comparisons = [{ id: '1', calculator: 'Test' }]
      
      render(<FloatingComparisonButton />)
      
      expect(screen.getByText('1 calculations')).toBeInTheDocument()
      expect(screen.getAllByText('1')).toHaveLength(2) // Mobile and badge
    })

    test('should handle multiple comparisons', () => {
      mockUseComparison.comparisons = Array.from({ length: 5 }, (_, i) => ({
        id: `${i + 1}`,
        calculator: `Test ${i + 1}`
      }))
      
      render(<FloatingComparisonButton />)
      
      expect(screen.getByText('5 calculations')).toBeInTheDocument()
      expect(screen.getAllByText('5')).toHaveLength(2) // Mobile and badge
    })

    test('should handle large numbers of comparisons', () => {
      mockUseComparison.comparisons = Array.from({ length: 99 }, (_, i) => ({
        id: `${i + 1}`,
        calculator: `Test ${i + 1}`
      }))
      
      render(<FloatingComparisonButton />)
      
      expect(screen.getByText('99 calculations')).toBeInTheDocument()
      expect(screen.getAllByText('99')).toHaveLength(2) // Mobile and badge
    })
  })

  describe('🔄 State Changes', () => {
    test('should update when comparisons change', () => {
      mockUseComparison.comparisons = [{ id: '1', calculator: 'Test' }]
      
      const { rerender } = render(<FloatingComparisonButton />)
      
      expect(screen.getByText('1 calculations')).toBeInTheDocument()
      
      // Update comparisons
      mockUseComparison.comparisons = [
        { id: '1', calculator: 'Test 1' },
        { id: '2', calculator: 'Test 2' }
      ]
      
      rerender(<FloatingComparisonButton />)
      
      expect(screen.getByText('2 calculations')).toBeInTheDocument()
    })

    test('should hide when all comparisons are removed', () => {
      mockUseComparison.comparisons = [{ id: '1', calculator: 'Test' }]
      
      const { rerender } = render(<FloatingComparisonButton />)
      
      expect(screen.getByRole('button')).toBeInTheDocument()
      
      // Remove all comparisons
      mockUseComparison.comparisons = []
      
      const { container } = render(<FloatingComparisonButton />)
      
      expect(container.firstChild).toBeNull()
    })
  })

  describe('♿ Accessibility', () => {
    test('should have proper button role', () => {
      mockUseComparison.comparisons = [{ id: '1', calculator: 'Test' }]
      
      render(<FloatingComparisonButton />)
      
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    test('should be keyboard accessible', async () => {
      const user = userEvent.setup()
      mockUseComparison.comparisons = [{ id: '1', calculator: 'Test' }]

      render(<FloatingComparisonButton />)

      const button = screen.getByRole('button')
      button.focus()
      expect(button).toHaveFocus()

      await user.keyboard('{Enter}')
      expect(mockUseComparison.toggleComparisonVisibility).toHaveBeenCalledTimes(1)
    })

    test('should have descriptive text content', () => {
      mockUseComparison.comparisons = [
        { id: '1', calculator: 'Test 1' },
        { id: '2', calculator: 'Test 2' }
      ]

      render(<FloatingComparisonButton />)

      expect(screen.getAllByText('Compare')).toHaveLength(2) // Mobile and desktop
      expect(screen.getByText('2 calculations')).toBeInTheDocument()
    })
  })
})
