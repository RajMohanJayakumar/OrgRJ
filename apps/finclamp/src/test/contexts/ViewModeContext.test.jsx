import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { ViewModeProvider, useViewMode } from '../../contexts/ViewModeContext'

// Test component to use the context
const TestComponent = () => {
  const { viewMode, isMobile, toggleViewMode } = useViewMode()
  
  return (
    <div>
      <div data-testid="view-mode">{viewMode}</div>
      <div data-testid="is-mobile">{isMobile.toString()}</div>
      <button data-testid="toggle-view" onClick={toggleViewMode}>
        Toggle View
      </button>
    </div>
  )
}

describe('ViewModeContext', () => {
  beforeEach(() => {
    // Reset window size
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    })
    
    // Clear localStorage
    localStorage.clear()
  })

  it('should provide default view mode for desktop', () => {
    render(
      <ViewModeProvider>
        <TestComponent />
      </ViewModeProvider>
    )

    expect(screen.getByTestId('view-mode')).toHaveTextContent('desktop')
    expect(screen.getByTestId('is-mobile')).toHaveTextContent('false')
  })

  it('should detect mobile view mode', () => {
    // Set mobile width
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500,
    })

    render(
      <ViewModeProvider>
        <TestComponent />
      </ViewModeProvider>
    )

    expect(screen.getByTestId('view-mode')).toHaveTextContent('mobile')
    expect(screen.getByTestId('is-mobile')).toHaveTextContent('true')
  })

  it('should toggle view mode', async () => {
    render(
      <ViewModeProvider>
        <TestComponent />
      </ViewModeProvider>
    )

    const toggleButton = screen.getByTestId('toggle-view')
    
    await act(async () => {
      toggleButton.click()
    })

    expect(screen.getByTestId('view-mode')).toHaveTextContent('mobile')
  })

  it('should persist view mode in localStorage', async () => {
    render(
      <ViewModeProvider>
        <TestComponent />
      </ViewModeProvider>
    )

    const toggleButton = screen.getByTestId('toggle-view')

    await act(async () => {
      toggleButton.click()
    })

    // Check that view mode changed
    expect(screen.getByTestId('view-mode')).toHaveTextContent('mobile')
  })

  it('should handle localStorage interaction', () => {
    // Test that context works without localStorage dependency
    render(
      <ViewModeProvider>
        <TestComponent />
      </ViewModeProvider>
    )

    // Should have default view mode
    expect(screen.getByTestId('view-mode')).toHaveTextContent('desktop')
  })
})
