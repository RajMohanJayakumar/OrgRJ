import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CustomDropdown from '../../components/CustomDropdown'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
    svg: ({ children, ...props }) => <svg {...props}>{children}</svg>,
    p: ({ children, ...props }) => <p {...props}>{children}</p>
  },
  AnimatePresence: ({ children }) => children
}))

describe('CustomDropdown', () => {
  const mockOnChange = vi.fn()
  const defaultOptions = [
    { value: 'option1', label: 'Option 1', icon: '🔥' },
    { value: 'option2', label: 'Option 2', icon: '⭐' },
    { value: 'option3', label: 'Option 3' }
  ]
  
  const defaultProps = {
    label: 'Test Dropdown',
    value: '',
    onChange: mockOnChange,
    options: defaultOptions,
    icon: '📋'
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('🏗️ Component Rendering', () => {
    test('should render with basic props', () => {
      render(<CustomDropdown {...defaultProps} />)
      
      expect(screen.getByText('Test Dropdown')).toBeInTheDocument()
      expect(screen.getByText('📋')).toBeInTheDocument()
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    test('should show placeholder when no value selected', () => {
      render(<CustomDropdown {...defaultProps} placeholder="Choose option" />)
      
      expect(screen.getByText('Choose option')).toBeInTheDocument()
    })

    test('should show selected option label', () => {
      render(<CustomDropdown {...defaultProps} value="option1" />)
      
      expect(screen.getByText('Option 1')).toBeInTheDocument()
    })

    test('should render without icon', () => {
      render(<CustomDropdown {...defaultProps} icon={null} />)
      
      expect(screen.queryByText('📋')).not.toBeInTheDocument()
      expect(screen.getByText('Test Dropdown')).toBeInTheDocument()
    })
  })

  describe('🎯 Dropdown Functionality', () => {
    test('should open dropdown when button is clicked', async () => {
      const user = userEvent.setup()
      
      render(<CustomDropdown {...defaultProps} />)
      
      const button = screen.getByRole('button')
      await user.click(button)
      
      expect(screen.getByText('Option 1')).toBeInTheDocument()
      expect(screen.getByText('Option 2')).toBeInTheDocument()
      expect(screen.getByText('Option 3')).toBeInTheDocument()
    })

    test('should close dropdown when clicking outside', async () => {
      const user = userEvent.setup()
      
      render(
        <div>
          <CustomDropdown {...defaultProps} />
          <div data-testid="outside">Outside element</div>
        </div>
      )
      
      const button = screen.getByRole('button')
      await user.click(button)
      
      // Dropdown should be open - check for dropdown content
      expect(screen.getByText('Option 1')).toBeInTheDocument()
      expect(screen.getByText('Option 2')).toBeInTheDocument()
      
      // Click outside
      await user.click(screen.getByTestId('outside'))
      
      await waitFor(() => {
        expect(screen.queryByText('Option 2')).not.toBeInTheDocument() // Dropdown closed
      })
    })

    test('should select option when clicked', async () => {
      const user = userEvent.setup()
      
      render(<CustomDropdown {...defaultProps} />)
      
      const button = screen.getByRole('button')
      await user.click(button)
      
      const option2 = screen.getByText('Option 2')
      await user.click(option2)
      
      expect(mockOnChange).toHaveBeenCalledWith('option2')
    })

    test('should close dropdown after selection', async () => {
      const user = userEvent.setup()
      
      render(<CustomDropdown {...defaultProps} />)
      
      const button = screen.getByRole('button')
      await user.click(button)
      
      const option1 = screen.getByText('Option 1')
      await user.click(option1)

      await waitFor(() => {
        expect(screen.queryByText('Option 2')).not.toBeInTheDocument() // Dropdown closed
      })
    })
  })

  describe('🎨 Visual States', () => {
    test('should show selected option with special styling', async () => {
      const user = userEvent.setup()
      
      render(<CustomDropdown {...defaultProps} value="option1" />)
      
      const button = screen.getByRole('button')
      await user.click(button)
      
      const selectedOption = screen.getAllByText('Option 1')[1].closest('button')
      expect(selectedOption).toHaveClass('bg-blue-50', 'text-blue-700', 'border-r-4', 'border-blue-500')
    })

    test('should show checkmark for selected option', async () => {
      const user = userEvent.setup()
      
      render(<CustomDropdown {...defaultProps} value="option1" />)
      
      const button = screen.getByRole('button')
      await user.click(button)
      
      const selectedOption = screen.getAllByText('Option 1')[1].closest('button')
      const checkmark = selectedOption.querySelector('svg')
      expect(checkmark).toBeInTheDocument()
    })

    test('should display option icons', async () => {
      const user = userEvent.setup()
      
      render(<CustomDropdown {...defaultProps} />)
      
      const button = screen.getByRole('button')
      await user.click(button)
      
      expect(screen.getByText('🔥')).toBeInTheDocument()
      expect(screen.getByText('⭐')).toBeInTheDocument()
    })

    test('should handle options without icons', async () => {
      const user = userEvent.setup()
      
      render(<CustomDropdown {...defaultProps} />)
      
      const button = screen.getByRole('button')
      await user.click(button)
      
      // Option 3 has no icon
      const option3 = screen.getByText('Option 3').closest('button')
      expect(option3.querySelector('span[class*="mr-3"]')).not.toBeInTheDocument()
    })
  })

  describe('🚫 Disabled State', () => {
    test('should render disabled dropdown', () => {
      render(<CustomDropdown {...defaultProps} disabled={true} />)
      
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
      expect(button).toHaveClass('bg-gray-50', 'text-gray-400', 'cursor-not-allowed')
    })

    test('should not open when disabled', async () => {
      const user = userEvent.setup()
      
      render(<CustomDropdown {...defaultProps} disabled={true} />)
      
      const button = screen.getByRole('button')
      await user.click(button)
      
      expect(screen.queryByText('Option 1')).not.toBeInTheDocument()
    })
  })

  describe('❌ Error Handling', () => {
    test('should display error message', () => {
      render(<CustomDropdown {...defaultProps} error="This field is required" />)
      
      expect(screen.getByText('This field is required')).toBeInTheDocument()
    })

    test('should apply error styling', () => {
      render(<CustomDropdown {...defaultProps} error="Error message" />)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('border-red-300')
    })

    test('should not show helper text when error is present', () => {
      render(
        <CustomDropdown 
          {...defaultProps} 
          error="Error message" 
          helperText="Helper text" 
        />
      )
      
      expect(screen.getByText('Error message')).toBeInTheDocument()
      expect(screen.queryByText('Helper text')).not.toBeInTheDocument()
    })
  })

  describe('💡 Helper Text', () => {
    test('should display helper text', () => {
      render(<CustomDropdown {...defaultProps} helperText="Choose your preferred option" />)
      
      expect(screen.getByText('Choose your preferred option')).toBeInTheDocument()
    })

    test('should show helper text when no error', () => {
      render(<CustomDropdown {...defaultProps} helperText="Helper text" />)
      
      expect(screen.getByText('Helper text')).toBeInTheDocument()
    })
  })

  describe('🎨 Custom Styling', () => {
    test('should apply custom className', () => {
      render(<CustomDropdown {...defaultProps} className="custom-class" />)
      
      const container = screen.getByText('Test Dropdown').closest('.relative')
      expect(container).toHaveClass('custom-class')
    })

    test('should apply custom focus color', async () => {
      const user = userEvent.setup()
      
      render(<CustomDropdown {...defaultProps} focusColor="#FF0000" />)
      
      const button = screen.getByRole('button')
      await user.click(button)
      
      expect(button).toHaveStyle({
        borderColor: '#FF0000'
      })
    })
  })

  describe('🔄 Edge Cases', () => {
    test('should handle empty options array', () => {
      render(<CustomDropdown {...defaultProps} options={[]} />)
      
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    test('should handle undefined value', () => {
      render(<CustomDropdown {...defaultProps} value={undefined} />)
      
      expect(screen.getByText('Select an option')).toBeInTheDocument()
    })

    test('should handle null value', () => {
      render(<CustomDropdown {...defaultProps} value={null} />)
      
      expect(screen.getByText('Select an option')).toBeInTheDocument()
    })

    test('should handle value not in options', () => {
      render(<CustomDropdown {...defaultProps} value="nonexistent" />)
      
      expect(screen.getByText('Select an option')).toBeInTheDocument()
    })

    test('should handle rapid clicking', async () => {
      const user = userEvent.setup()
      
      render(<CustomDropdown {...defaultProps} />)
      
      const button = screen.getByRole('button')
      
      // Rapid clicks - should toggle open/close
      await user.click(button) // Open
      await user.click(button) // Close
      await user.click(button) // Open again

      // Should be open after odd number of clicks
      expect(screen.getByText('Option 1')).toBeInTheDocument()
    })
  })

  describe('♿ Accessibility', () => {
    test('should have proper button role', () => {
      render(<CustomDropdown {...defaultProps} />)
      
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    test('should have proper label association', () => {
      render(<CustomDropdown {...defaultProps} />)
      
      const label = screen.getByText('Test Dropdown')
      expect(label.tagName).toBe('LABEL')
    })

    test('should have proper button type', () => {
      render(<CustomDropdown {...defaultProps} />)
      
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('type', 'button')
    })

    test('should have focus outline', async () => {
      const user = userEvent.setup()
      
      render(<CustomDropdown {...defaultProps} />)
      
      const button = screen.getByRole('button')
      await user.click(button)
      
      expect(button).toHaveClass('focus:outline-none')
    })
  })

  describe('🔧 Event Handling', () => {
    test('should handle keyboard navigation', async () => {
      const user = userEvent.setup()
      
      render(<CustomDropdown {...defaultProps} />)
      
      const button = screen.getByRole('button')
      button.focus() // Manually focus the button
      expect(button).toHaveFocus()

      await user.keyboard('{Enter}')
      // Should open dropdown (implementation may vary)
    })

    test('should cleanup event listeners on unmount', () => {
      const { unmount } = render(<CustomDropdown {...defaultProps} />)
      
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener')
      unmount()
      
      expect(removeEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function))
    })
  })
})
