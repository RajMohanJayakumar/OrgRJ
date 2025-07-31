import { describe, test, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SimpleViewModeToggle from '../../components/SimpleViewModeToggle'
import { ViewModeProvider } from '../../contexts/ViewModeContext'

// Mock the ViewModeContext
const mockToggleViewMode = vi.fn()
const mockViewModeContext = {
  viewMode: 'desktop',
  toggleViewMode: mockToggleViewMode,
  isAutoDetect: false
}

vi.mock('../../contexts/ViewModeContext', async () => {
  const actual = await vi.importActual('../../contexts/ViewModeContext')
  return {
    ...actual,
    useViewMode: () => mockViewModeContext
  }
})

// Mock Lucide React icons
vi.mock('lucide-react', () => ({
  Monitor: ({ className, ...props }) => <div data-testid="monitor-icon" className={className} {...props} />,
  Smartphone: ({ className, ...props }) => <div data-testid="smartphone-icon" className={className} {...props} />
}))

const TestWrapper = ({ children }) => (
  <ViewModeProvider>
    {children}
  </ViewModeProvider>
)

describe('SimpleViewModeToggle', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    vi.clearAllMocks()
    // Reset to default state
    mockViewModeContext.viewMode = 'desktop'
    mockViewModeContext.isAutoDetect = false
  })

  describe('🏗️ Component Rendering', () => {
    test('should render toggle button with desktop view by default', () => {
      render(
        <TestWrapper>
          <SimpleViewModeToggle />
        </TestWrapper>
      )

      const toggleButton = screen.getByRole('button')
      expect(toggleButton).toBeInTheDocument()
      expect(screen.getByTestId('monitor-icon')).toBeInTheDocument()
      expect(screen.getByText('Desktop')).toBeInTheDocument()
    })

    test('should render mobile view when viewMode is mobile', () => {
      mockViewModeContext.viewMode = 'mobile'
      
      render(
        <TestWrapper>
          <SimpleViewModeToggle />
        </TestWrapper>
      )

      expect(screen.getByTestId('smartphone-icon')).toBeInTheDocument()
      expect(screen.getByText('Mobile')).toBeInTheDocument()
    })

    test('should show auto-detect indicator when isAutoDetect is true', () => {
      mockViewModeContext.isAutoDetect = true
      
      render(
        <TestWrapper>
          <SimpleViewModeToggle />
        </TestWrapper>
      )

      const toggleButton = screen.getByRole('button')
      expect(toggleButton).toHaveClass('bg-white/60', 'border-gray-200/50', 'text-gray-700')
      
      // Check for green indicator dot
      const indicator = toggleButton.querySelector('.bg-green-500')
      expect(indicator).toBeInTheDocument()
    })

    test('should show desktop mode styling when in desktop mode', () => {
      mockViewModeContext.viewMode = 'desktop'
      mockViewModeContext.isAutoDetect = false
      
      render(
        <TestWrapper>
          <SimpleViewModeToggle />
        </TestWrapper>
      )

      const toggleButton = screen.getByRole('button')
      expect(toggleButton).toHaveClass('bg-blue-50', 'border-blue-200', 'text-blue-700')
      
      // Check for blue indicator dot
      const indicator = toggleButton.querySelector('.bg-blue-500')
      expect(indicator).toBeInTheDocument()
    })

    test('should show mobile mode styling when in mobile mode', () => {
      mockViewModeContext.viewMode = 'mobile'
      mockViewModeContext.isAutoDetect = false
      
      render(
        <TestWrapper>
          <SimpleViewModeToggle />
        </TestWrapper>
      )

      const toggleButton = screen.getByRole('button')
      expect(toggleButton).toHaveClass('bg-purple-50', 'border-purple-200', 'text-purple-700')
      
      // Check for purple indicator dot
      const indicator = toggleButton.querySelector('.bg-purple-500')
      expect(indicator).toBeInTheDocument()
    })
  })

  describe('🖱️ User Interactions', () => {
    test('should call toggleViewMode when button is clicked', async () => {
      render(
        <TestWrapper>
          <SimpleViewModeToggle />
        </TestWrapper>
      )

      const toggleButton = screen.getByRole('button')
      await user.click(toggleButton)

      expect(mockToggleViewMode).toHaveBeenCalledTimes(1)
    })

    test('should have proper title attribute for desktop mode', () => {
      mockViewModeContext.viewMode = 'desktop'
      mockViewModeContext.isAutoDetect = false
      
      render(
        <TestWrapper>
          <SimpleViewModeToggle />
        </TestWrapper>
      )

      const toggleButton = screen.getByRole('button')
      expect(toggleButton).toHaveAttribute('title', 'Manual mode - Switch to mobile view')
    })

    test('should have proper title attribute for mobile mode', () => {
      mockViewModeContext.viewMode = 'mobile'
      mockViewModeContext.isAutoDetect = false
      
      render(
        <TestWrapper>
          <SimpleViewModeToggle />
        </TestWrapper>
      )

      const toggleButton = screen.getByRole('button')
      expect(toggleButton).toHaveAttribute('title', 'Manual mode - Switch to desktop view')
    })

    test('should have proper title attribute for auto-detect mode', () => {
      mockViewModeContext.isAutoDetect = true
      
      render(
        <TestWrapper>
          <SimpleViewModeToggle />
        </TestWrapper>
      )

      const toggleButton = screen.getByRole('button')
      expect(toggleButton).toHaveAttribute('title', 'Auto-detect mode - Switch to mobile view')
    })

    test('should handle keyboard interactions', async () => {
      render(
        <TestWrapper>
          <SimpleViewModeToggle />
        </TestWrapper>
      )

      const toggleButton = screen.getByRole('button')
      toggleButton.focus()

      await user.keyboard('{Enter}')
      expect(mockToggleViewMode).toHaveBeenCalledTimes(1)

      // Clear previous calls
      mockToggleViewMode.mockClear()

      await user.keyboard(' ')
      expect(mockToggleViewMode).toHaveBeenCalledTimes(1)
    })
  })

  describe('📱 Responsive Behavior', () => {
    test('should hide text on small screens', () => {
      render(
        <TestWrapper>
          <SimpleViewModeToggle />
        </TestWrapper>
      )

      const desktopText = screen.getByText('Desktop')
      expect(desktopText).toHaveClass('hidden', 'sm:inline')
    })

    test('should show icons on all screen sizes', () => {
      render(
        <TestWrapper>
          <SimpleViewModeToggle />
        </TestWrapper>
      )

      const icon = screen.getByTestId('monitor-icon')
      expect(icon).toBeInTheDocument()
      expect(icon).toHaveClass('w-4', 'h-4')
    })
  })

  describe('🎨 Visual States', () => {
    test('should have hover and transition classes', () => {
      render(
        <TestWrapper>
          <SimpleViewModeToggle />
        </TestWrapper>
      )

      const toggleButton = screen.getByRole('button')
      expect(toggleButton).toHaveClass(
        'hover:bg-white/80',
        'transition-all',
        'duration-200'
      )
    })

    test('should have proper backdrop blur and shadow', () => {
      render(
        <TestWrapper>
          <SimpleViewModeToggle />
        </TestWrapper>
      )

      const toggleButton = screen.getByRole('button')
      expect(toggleButton).toHaveClass(
        'backdrop-blur-sm',
        'shadow-sm',
        'rounded-xl'
      )
    })

    test('should have proper spacing and layout classes', () => {
      render(
        <TestWrapper>
          <SimpleViewModeToggle />
        </TestWrapper>
      )

      const toggleButton = screen.getByRole('button')
      expect(toggleButton).toHaveClass(
        'flex',
        'items-center',
        'space-x-2',
        'px-3',
        'py-2'
      )
    })
  })

  describe('🔧 Edge Cases', () => {
    test('should handle undefined viewMode gracefully', () => {
      mockViewModeContext.viewMode = undefined
      
      expect(() => {
        render(
          <TestWrapper>
            <SimpleViewModeToggle />
          </TestWrapper>
        )
      }).not.toThrow()
    })

    test('should handle missing toggleViewMode function', () => {
      mockViewModeContext.toggleViewMode = undefined
      
      render(
        <TestWrapper>
          <SimpleViewModeToggle />
        </TestWrapper>
      )

      const toggleButton = screen.getByRole('button')
      expect(() => fireEvent.click(toggleButton)).not.toThrow()
    })
  })
})
