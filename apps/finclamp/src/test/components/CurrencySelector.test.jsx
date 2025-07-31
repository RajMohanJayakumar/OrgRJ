import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CurrencySelector from '../../components/CurrencySelector'
import { CurrencyProvider, CURRENCY_FORMATS } from '../../contexts/CurrencyContext'

// Test wrapper with CurrencyProvider
const TestWrapper = ({ children, currencyFormat = 'dollar' }) => {
  // Mock window.location for currency context
  Object.defineProperty(window, 'location', {
    value: {
      search: `?currency=${currencyFormat}`,
      href: `http://localhost:3000?currency=${currencyFormat}`
    },
    writable: true
  })

  return (
    <CurrencyProvider>
      {children}
    </CurrencyProvider>
  )
}

describe('CurrencySelector', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('🏗️ Component Rendering', () => {
    test('should render currency selector button', () => {
      render(
        <TestWrapper>
          <CurrencySelector />
        </TestWrapper>
      )
      
      expect(screen.getByRole('button')).toBeInTheDocument()
      expect(screen.getByText('🌍')).toBeInTheDocument()
    })

    test('should display current currency format name on desktop', () => {
      render(
        <TestWrapper currencyFormat="dollar">
          <CurrencySelector />
        </TestWrapper>
      )
      
      expect(screen.getByText('US Dollar')).toBeInTheDocument()
    })

    test('should display currency symbol on mobile', () => {
      render(
        <TestWrapper currencyFormat="dollar">
          <CurrencySelector />
        </TestWrapper>
      )
      
      expect(screen.getByText('$')).toBeInTheDocument()
    })

    test('should show dropdown arrow', () => {
      render(
        <TestWrapper>
          <CurrencySelector />
        </TestWrapper>
      )
      
      const arrow = screen.getByRole('button').querySelector('svg')
      expect(arrow).toBeInTheDocument()
    })
  })

  describe('🎯 Dropdown Functionality', () => {
    test('should open dropdown when button is clicked', async () => {
      const user = userEvent.setup()
      
      render(
        <TestWrapper>
          <CurrencySelector />
        </TestWrapper>
      )
      
      const button = screen.getByRole('button')
      await user.click(button)
      
      expect(screen.getByText('Currency Format')).toBeInTheDocument()
      expect(screen.getByText('Choose how numbers are displayed')).toBeInTheDocument()
    })

    test('should close dropdown when button is clicked again', async () => {
      const user = userEvent.setup()
      
      render(
        <TestWrapper>
          <CurrencySelector />
        </TestWrapper>
      )
      
      const button = screen.getByRole('button')
      await user.click(button)
      expect(screen.getByText('Currency Format')).toBeInTheDocument()
      
      await user.click(button)
      expect(screen.queryByText('Currency Format')).not.toBeInTheDocument()
    })

    test('should close dropdown when backdrop is clicked', async () => {
      const user = userEvent.setup()
      
      render(
        <TestWrapper>
          <CurrencySelector />
        </TestWrapper>
      )
      
      const button = screen.getByRole('button')
      await user.click(button)
      expect(screen.getByText('Currency Format')).toBeInTheDocument()
      
      // Click backdrop
      const backdrop = document.querySelector('.fixed.inset-0')
      await user.click(backdrop)
      
      await waitFor(() => {
        expect(screen.queryByText('Currency Format')).not.toBeInTheDocument()
      })
    })

    test('should rotate arrow when dropdown is open', async () => {
      const user = userEvent.setup()
      
      render(
        <TestWrapper>
          <CurrencySelector />
        </TestWrapper>
      )
      
      const button = screen.getByRole('button')
      const arrow = button.querySelector('svg')
      
      expect(arrow).not.toHaveClass('rotate-180')
      
      await user.click(button)
      expect(arrow).toHaveClass('rotate-180')
    })
  })

  describe('💰 Currency Options', () => {
    test('should display all available currency formats', async () => {
      const user = userEvent.setup()
      
      render(
        <TestWrapper>
          <CurrencySelector />
        </TestWrapper>
      )
      
      const button = screen.getByRole('button')
      await user.click(button)
      
      // Check that all currency formats are displayed
      Object.values(CURRENCY_FORMATS).forEach(format => {
        const formatName = format.name.split('(')[0].trim()
        const elements = screen.getAllByText(formatName)
        expect(elements.length).toBeGreaterThanOrEqual(1)
      })
    })

    test('should show examples for each currency format', async () => {
      const user = userEvent.setup()
      
      render(
        <TestWrapper>
          <CurrencySelector />
        </TestWrapper>
      )
      
      const button = screen.getByRole('button')
      await user.click(button)
      
      // Check for example text
      expect(screen.getAllByText(/Example:/)).toHaveLength(Object.keys(CURRENCY_FORMATS).length)
    })

    test('should highlight current currency format', async () => {
      const user = userEvent.setup()
      
      render(
        <TestWrapper currencyFormat="rupee">
          <CurrencySelector />
        </TestWrapper>
      )
      
      const button = screen.getByRole('button')
      await user.click(button)
      
      const rupeeOptions = screen.getAllByText('Indian Rupee')
      const rupeeOption = rupeeOptions[1].closest('button') // Get the one in dropdown
      expect(rupeeOption).toHaveClass('bg-indigo-50', 'border-r-2', 'border-indigo-500')
    })

    test('should show checkmark for current currency format', async () => {
      const user = userEvent.setup()
      
      render(
        <TestWrapper currencyFormat="rupee">
          <CurrencySelector />
        </TestWrapper>
      )
      
      const button = screen.getByRole('button')
      await user.click(button)
      
      const rupeeOptions = screen.getAllByText('Indian Rupee')
      const rupeeOption = rupeeOptions[1].closest('button') // Get the one in dropdown
      const checkmark = rupeeOption.querySelector('svg')
      expect(checkmark).toBeInTheDocument()
    })
  })

  describe('🔄 Currency Selection', () => {
    test('should change currency format when option is selected', async () => {
      const user = userEvent.setup()
      
      render(
        <TestWrapper currencyFormat="dollar">
          <CurrencySelector />
        </TestWrapper>
      )
      
      const button = screen.getByRole('button')
      await user.click(button)
      
      const rupeeOption = screen.getByText('Indian Rupee')
      await user.click(rupeeOption)
      
      // Dropdown should close
      await waitFor(() => {
        expect(screen.queryByText('Currency Format')).not.toBeInTheDocument()
      })
    })

    test('should close dropdown after selection', async () => {
      const user = userEvent.setup()
      
      render(
        <TestWrapper>
          <CurrencySelector />
        </TestWrapper>
      )
      
      const button = screen.getByRole('button')
      await user.click(button)
      
      const euroOption = screen.getByText('Euro')
      await user.click(euroOption)
      
      await waitFor(() => {
        expect(screen.queryByText('Currency Format')).not.toBeInTheDocument()
      })
    })
  })

  describe('🎨 Styling and Layout', () => {
    test('should have proper button styling', () => {
      render(
        <TestWrapper>
          <CurrencySelector />
        </TestWrapper>
      )
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass(
        'flex',
        'items-center',
        'space-x-1',
        'sm:space-x-2',
        'px-2',
        'sm:px-4',
        'py-1.5',
        'sm:py-2',
        'bg-white/60',
        'backdrop-blur-sm',
        'rounded-xl',
        'border',
        'border-gray-200/50',
        'shadow-sm',
        'hover:bg-white/80',
        'transition-all',
        'duration-200'
      )
    })

    test('should have proper dropdown styling', async () => {
      const user = userEvent.setup()
      
      render(
        <TestWrapper>
          <CurrencySelector />
        </TestWrapper>
      )
      
      const button = screen.getByRole('button')
      await user.click(button)
      
      const dropdown = screen.getByText('Currency Format').closest('div').parentElement
      expect(dropdown).toHaveClass(
        'absolute',
        'top-full',
        'right-0',
        'mt-2',
        'w-56',
        'sm:w-64',
        'bg-white',
        'rounded-xl',
        'shadow-xl',
        'border',
        'border-gray-200',
        'z-50',
        'overflow-hidden'
      )
    })

    test('should have scrollable options area', async () => {
      const user = userEvent.setup()
      
      render(
        <TestWrapper>
          <CurrencySelector />
        </TestWrapper>
      )
      
      const button = screen.getByRole('button')
      await user.click(button)
      
      const optionsArea = screen.getAllByText('US Dollar')[1].closest('.py-2') // Get the one in dropdown
      expect(optionsArea).toHaveClass('max-h-64', 'overflow-y-auto')
    })
  })

  describe('📱 Responsive Design', () => {
    test('should show different content on mobile vs desktop', () => {
      render(
        <TestWrapper currencyFormat="dollar">
          <CurrencySelector />
        </TestWrapper>
      )
      
      // Desktop content (hidden on mobile)
      expect(screen.getByText('US Dollar')).toHaveClass('hidden', 'sm:inline')
      
      // Mobile content (hidden on desktop)
      expect(screen.getByText('$')).toHaveClass('sm:hidden')
    })

    test('should have responsive spacing and sizing', () => {
      render(
        <TestWrapper>
          <CurrencySelector />
        </TestWrapper>
      )
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('space-x-1', 'sm:space-x-2', 'px-2', 'sm:px-4', 'py-1.5', 'sm:py-2')
    })
  })

  describe('💡 Help Text', () => {
    test('should show help text in dropdown footer', async () => {
      const user = userEvent.setup()
      
      render(
        <TestWrapper>
          <CurrencySelector />
        </TestWrapper>
      )
      
      const button = screen.getByRole('button')
      await user.click(button)
      
      expect(screen.getByText('💡 Format applies to all calculators and is saved automatically')).toBeInTheDocument()
    })

    test('should show description text on desktop', async () => {
      const user = userEvent.setup()
      
      render(
        <TestWrapper>
          <CurrencySelector />
        </TestWrapper>
      )
      
      const button = screen.getByRole('button')
      await user.click(button)
      
      expect(screen.getByText('Choose how numbers are displayed')).toBeInTheDocument()
      expect(screen.getByText('Choose how numbers are displayed')).toHaveClass('hidden', 'sm:block')
    })
  })

  describe('♿ Accessibility', () => {
    test('should have proper button role', () => {
      render(
        <TestWrapper>
          <CurrencySelector />
        </TestWrapper>
      )
      
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    test('should have proper heading structure in dropdown', async () => {
      const user = userEvent.setup()
      
      render(
        <TestWrapper>
          <CurrencySelector />
        </TestWrapper>
      )
      
      const button = screen.getByRole('button')
      await user.click(button)
      
      expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument()
    })

    test('should have clickable currency options', async () => {
      const user = userEvent.setup()
      
      render(
        <TestWrapper>
          <CurrencySelector />
        </TestWrapper>
      )
      
      const button = screen.getByRole('button')
      await user.click(button)
      
      const currencyButtons = screen.getAllByRole('button').filter(btn => 
        btn !== button && btn.textContent.includes('Dollar')
      )
      expect(currencyButtons.length).toBeGreaterThan(0)
    })
  })

  describe('🔄 Edge Cases', () => {
    test('should handle unknown currency format gracefully', () => {
      render(
        <TestWrapper currencyFormat="unknown">
          <CurrencySelector />
        </TestWrapper>
      )
      
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    test('should handle rapid clicking', async () => {
      const user = userEvent.setup()

      render(
        <TestWrapper>
          <CurrencySelector />
        </TestWrapper>
      )

      const button = screen.getByRole('button')

      // Rapid clicks - should toggle open/close
      await user.click(button) // Open
      await user.click(button) // Close
      await user.click(button) // Open again

      // Should be open after odd number of clicks
      expect(screen.getByText('Currency Format')).toBeInTheDocument()
    })

    test('should handle keyboard navigation', async () => {
      const user = userEvent.setup()
      
      render(
        <TestWrapper>
          <CurrencySelector />
        </TestWrapper>
      )
      
      const button = screen.getByRole('button')
      button.focus() // Manually focus the button
      expect(button).toHaveFocus()

      await user.keyboard('{Enter}')
      expect(screen.getByText('Currency Format')).toBeInTheDocument()
    })
  })
})
