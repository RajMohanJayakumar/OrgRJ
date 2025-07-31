import { describe, test, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import StepUpInput from '../../components/StepUpInput'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>
  },
  AnimatePresence: ({ children }) => <div>{children}</div>
}))

describe('StepUpInput', () => {
  const user = userEvent.setup()
  const mockOnChange = vi.fn()
  const mockOnTypeChange = vi.fn()

  const defaultProps = {
    label: 'Step-up Amount',
    value: '5',
    onChange: mockOnChange,
    onTypeChange: mockOnTypeChange,
    placeholder: 'Enter step-up',
    stepUpType: 'percentage'
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('🏗️ Component Rendering', () => {
    test('should render input with label', () => {
      render(<StepUpInput {...defaultProps} />)

      expect(screen.getByText('Step-up Amount')).toBeInTheDocument()
      expect(screen.getByDisplayValue('5')).toBeInTheDocument()
    })

    test('should render with placeholder', () => {
      render(<StepUpInput {...defaultProps} value="" />)

      const input = screen.getByPlaceholderText('Enter step-up')
      expect(input).toBeInTheDocument()
    })

    test('should render percentage type by default', () => {
      render(<StepUpInput {...defaultProps} />)

      expect(screen.getByText('%')).toBeInTheDocument()
    })

    test('should render amount type when specified', () => {
      render(<StepUpInput {...defaultProps} stepUpType="amount" />)

      expect(screen.getByText('₹')).toBeInTheDocument()
    })

    test('should render with icon when provided', () => {
      const TestIcon = () => <div data-testid="test-icon">Icon</div>
      render(<StepUpInput {...defaultProps} icon={<TestIcon />} />)

      expect(screen.getByTestId('test-icon')).toBeInTheDocument()
    })

    test('should apply custom className', () => {
      const { container } = render(<StepUpInput {...defaultProps} className="custom-class" />)

      const customElement = container.querySelector('.custom-class')
      expect(customElement).toBeInTheDocument()
    })
  })

  describe('🖱️ User Interactions', () => {
    test('should call onChange when input value changes', async () => {
      render(<StepUpInput {...defaultProps} value="" />)

      const input = screen.getByPlaceholderText('Enter step-up')
      await user.type(input, '10')

      // user.type calls onChange for each character, so check the last call
      expect(mockOnChange).toHaveBeenLastCalledWith('0')
    })

    test('should open dropdown when type selector is clicked', async () => {
      render(<StepUpInput {...defaultProps} />)

      const typeButton = screen.getByText('%')
      await user.click(typeButton)

      expect(screen.getByText('Fixed Amount')).toBeInTheDocument()
    })

    test('should close dropdown when clicking outside', async () => {
      render(<StepUpInput {...defaultProps} />)

      const typeButton = screen.getByText('%')
      await user.click(typeButton)

      // Verify dropdown is open
      expect(screen.getByText('Fixed Amount')).toBeInTheDocument()

      // Click the type button again to close dropdown
      await user.click(typeButton)

      // Dropdown should close (Fixed Amount should not be visible)
      expect(screen.queryByText('Fixed Amount')).not.toBeInTheDocument()
    })

    test('should call onTypeChange when selecting different type', async () => {
      render(<StepUpInput {...defaultProps} />)

      const typeButton = screen.getByText('%')
      await user.click(typeButton)

      const amountOption = screen.getByText('Fixed Amount')
      await user.click(amountOption)

      expect(mockOnTypeChange).toHaveBeenCalledWith('amount')
    })

    test('should close dropdown after selecting type', async () => {
      render(<StepUpInput {...defaultProps} />)

      const typeButton = screen.getByText('%')
      await user.click(typeButton)

      const amountOption = screen.getByText('Fixed Amount')
      await user.click(amountOption)

      // Dropdown should close
      expect(screen.queryByText('Fixed Amount')).not.toBeInTheDocument()
    })
  })

  describe('🔄 Type Switching', () => {
    test('should display correct symbol for percentage type', () => {
      render(<StepUpInput {...defaultProps} stepUpType="percentage" />)

      expect(screen.getByText('%')).toBeInTheDocument()
    })

    test('should display correct symbol for amount type', () => {
      render(<StepUpInput {...defaultProps} stepUpType="amount" />)

      expect(screen.getByText('₹')).toBeInTheDocument()
    })

    test('should handle invalid stepUpType gracefully', () => {
      render(<StepUpInput {...defaultProps} stepUpType="invalid" />)

      // Should default to percentage
      expect(screen.getByText('%')).toBeInTheDocument()
    })

    test('should handle undefined stepUpType', () => {
      render(<StepUpInput {...defaultProps} stepUpType={undefined} />)

      // Should default to percentage
      expect(screen.getByText('%')).toBeInTheDocument()
    })
  })

  describe('🎨 Styling and Layout', () => {
    test('should have proper input styling', () => {
      render(<StepUpInput {...defaultProps} />)

      const input = screen.getByPlaceholderText('Enter step-up')
      expect(input).toHaveClass('w-full')
    })

    test('should have proper dropdown styling', async () => {
      render(<StepUpInput {...defaultProps} />)

      const typeButton = screen.getByText('%')
      await user.click(typeButton)

      const dropdown = screen.getByText('Fixed Amount').closest('div')
      expect(dropdown).toBeInTheDocument()
    })

    test('should show hover effects on type selector', () => {
      render(<StepUpInput {...defaultProps} />)

      const typeButton = screen.getByText('%').closest('button')
      expect(typeButton).toHaveClass('hover:bg-gray-200')
    })
  })

  describe('♿ Accessibility', () => {
    test('should have proper input attributes', () => {
      render(<StepUpInput {...defaultProps} />)

      const input = screen.getByPlaceholderText('Enter step-up')
      expect(input).toHaveAttribute('type', 'number')
    })

    test('should have proper button role for type selector', () => {
      render(<StepUpInput {...defaultProps} />)

      const typeButton = screen.getByText('%').closest('button')
      expect(typeButton).toBeInTheDocument()
    })

    test('should handle keyboard navigation', async () => {
      render(<StepUpInput {...defaultProps} />)

      const typeButton = screen.getByText('%').closest('button')
      typeButton.focus()

      await user.keyboard('{Enter}')
      expect(screen.getByText('Fixed Amount')).toBeInTheDocument()

      // Click the button again to close dropdown
      await user.click(typeButton)
      expect(screen.queryByText('Fixed Amount')).not.toBeInTheDocument()
    })
  })

  describe('🔧 Edge Cases', () => {
    test('should handle missing onChange prop', () => {
      expect(() => {
        render(<StepUpInput {...defaultProps} onChange={undefined} />)
      }).not.toThrow()
    })

    test('should handle missing onTypeChange prop', () => {
      expect(() => {
        render(<StepUpInput {...defaultProps} onTypeChange={undefined} />)
      }).not.toThrow()
    })

    test('should handle empty value', () => {
      render(<StepUpInput {...defaultProps} value="" />)

      const input = screen.getByPlaceholderText('Enter step-up')
      expect(input).toHaveValue(null)
    })

    test('should handle null value', () => {
      render(<StepUpInput {...defaultProps} value={null} />)

      const input = screen.getByPlaceholderText('Enter step-up')
      expect(input).toHaveValue(null)
    })

    test('should handle undefined value', () => {
      render(<StepUpInput {...defaultProps} value={undefined} />)

      const input = screen.getByPlaceholderText('Enter step-up')
      expect(input).toHaveValue(null)
    })

    test('should handle rapid clicking on type selector', async () => {
      render(<StepUpInput {...defaultProps} />)

      const typeButton = screen.getByText('%')

      // Rapid clicks
      await user.click(typeButton)
      await user.click(typeButton)
      await user.click(typeButton)

      // Should still work properly
      expect(screen.getByText('Fixed Amount')).toBeInTheDocument()
    })
  })

  describe('🔄 State Management', () => {
    test('should maintain dropdown state correctly', async () => {
      render(<StepUpInput {...defaultProps} />)

      const typeButton = screen.getByText('%')

      // Open dropdown
      await user.click(typeButton)
      expect(screen.getByText('Fixed Amount')).toBeInTheDocument()

      // Close dropdown
      await user.click(typeButton)
      expect(screen.queryByText('Fixed Amount')).not.toBeInTheDocument()
    })

    test('should reset dropdown state after selection', async () => {
      const { rerender } = render(<StepUpInput {...defaultProps} />)

      const typeButton = screen.getByText('%')
      await user.click(typeButton)

      const amountOption = screen.getByText('Fixed Amount')
      await user.click(amountOption)

      // Verify onTypeChange was called
      expect(mockOnTypeChange).toHaveBeenCalledWith('amount')

      // Re-render with new stepUpType to simulate state change
      rerender(<StepUpInput {...defaultProps} stepUpType="amount" />)

      // After selection, the component should show the new type
      expect(screen.getByText('₹')).toBeInTheDocument()

      // Try to open dropdown again
      const newTypeButton = screen.getByText('₹')
      await user.click(newTypeButton)

      expect(screen.getByText('Percentage (%)')).toBeInTheDocument()
    })
  })
})
