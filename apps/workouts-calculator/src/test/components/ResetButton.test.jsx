import { describe, test, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ResetButton from '../../components/ResetButton'

describe('ResetButton Component', () => {
  test('renders reset button with default props', () => {
    const mockOnReset = vi.fn()
    render(<ResetButton onReset={mockOnReset} />)
    
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('title', 'Reset Calculator')
  })

  test('calls onReset when clicked', () => {
    const mockOnReset = vi.fn()
    render(<ResetButton onReset={mockOnReset} />)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    expect(mockOnReset).toHaveBeenCalledTimes(1)
  })

  test('applies correct size classes', () => {
    const mockOnReset = vi.fn()
    
    // Test small size
    const { rerender } = render(<ResetButton onReset={mockOnReset} size="sm" />)
    let button = screen.getByRole('button')
    expect(button).toHaveClass('p-1.5', 'w-7', 'h-7')
    
    // Test medium size (default)
    rerender(<ResetButton onReset={mockOnReset} size="md" />)
    button = screen.getByRole('button')
    expect(button).toHaveClass('p-2', 'w-8', 'h-8')
    
    // Test large size
    rerender(<ResetButton onReset={mockOnReset} size="lg" />)
    button = screen.getByRole('button')
    expect(button).toHaveClass('p-2.5', 'w-10', 'h-10')
  })

  test('applies correct variant classes', () => {
    const mockOnReset = vi.fn()
    
    // Test default variant
    const { rerender } = render(<ResetButton onReset={mockOnReset} variant="default" />)
    let button = screen.getByRole('button')
    expect(button).toHaveClass('text-gray-500')
    
    // Test primary variant
    rerender(<ResetButton onReset={mockOnReset} variant="primary" />)
    button = screen.getByRole('button')
    expect(button).toHaveClass('text-blue-500')
    
    // Test danger variant
    rerender(<ResetButton onReset={mockOnReset} variant="danger" />)
    button = screen.getByRole('button')
    expect(button).toHaveClass('text-red-500')
  })

  test('handles disabled state correctly', () => {
    const mockOnReset = vi.fn()
    render(<ResetButton onReset={mockOnReset} disabled={true} />)
    
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button).toHaveClass('opacity-50', 'cursor-not-allowed')
    
    fireEvent.click(button)
    expect(mockOnReset).not.toHaveBeenCalled()
  })

  test('applies custom className', () => {
    const mockOnReset = vi.fn()
    const customClass = 'custom-reset-button'
    render(<ResetButton onReset={mockOnReset} className={customClass} />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass(customClass)
  })

  test('renders SVG icon', () => {
    const mockOnReset = vi.fn()
    render(<ResetButton onReset={mockOnReset} />)
    
    const svg = screen.getByRole('button').querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24')
  })

  test('applies correct icon sizes', () => {
    const mockOnReset = vi.fn()
    
    // Test small icon
    const { rerender } = render(<ResetButton onReset={mockOnReset} size="sm" />)
    let svg = screen.getByRole('button').querySelector('svg')
    expect(svg).toHaveClass('w-3', 'h-3')
    
    // Test medium icon
    rerender(<ResetButton onReset={mockOnReset} size="md" />)
    svg = screen.getByRole('button').querySelector('svg')
    expect(svg).toHaveClass('w-4', 'h-4')
    
    // Test large icon
    rerender(<ResetButton onReset={mockOnReset} size="lg" />)
    svg = screen.getByRole('button').querySelector('svg')
    expect(svg).toHaveClass('w-5', 'h-5')
  })

  test('has proper accessibility attributes', () => {
    const mockOnReset = vi.fn()
    render(<ResetButton onReset={mockOnReset} />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('title', 'Reset Calculator')
  })

  test('handles multiple clicks correctly', () => {
    const mockOnReset = vi.fn()
    render(<ResetButton onReset={mockOnReset} />)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    fireEvent.click(button)
    fireEvent.click(button)
    
    expect(mockOnReset).toHaveBeenCalledTimes(3)
  })

  test('prevents clicks when disabled', () => {
    const mockOnReset = vi.fn()
    render(<ResetButton onReset={mockOnReset} disabled={true} />)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    fireEvent.click(button)
    
    expect(mockOnReset).not.toHaveBeenCalled()
  })

  test('applies transition classes', () => {
    const mockOnReset = vi.fn()
    render(<ResetButton onReset={mockOnReset} />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('transition-all', 'duration-200', 'rounded-lg')
  })

  test('handles edge case props', () => {
    const mockOnReset = vi.fn()
    
    // Test with undefined onReset
    expect(() => {
      render(<ResetButton onReset={undefined} />)
    }).not.toThrow()
    
    // Test with null className
    expect(() => {
      render(<ResetButton onReset={mockOnReset} className={null} />)
    }).not.toThrow()
    
    // Test with invalid size
    expect(() => {
      render(<ResetButton onReset={mockOnReset} size="invalid" />)
    }).not.toThrow()
  })

  test('maintains button functionality', () => {
    const mockOnReset = vi.fn()
    render(<ResetButton onReset={mockOnReset} />)

    const button = screen.getByRole('button')
    expect(button.tagName).toBe('BUTTON')
  })

  test('handles keyboard interactions', () => {
    const mockOnReset = vi.fn()
    render(<ResetButton onReset={mockOnReset} />)
    
    const button = screen.getByRole('button')
    
    // Test Enter key
    fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' })
    
    // Test Space key
    fireEvent.keyDown(button, { key: ' ', code: 'Space' })
    
    // Button should be focusable
    button.focus()
    expect(button).toHaveFocus()
  })

  test('renders consistently across different prop combinations', () => {
    const mockOnReset = vi.fn()
    
    const propCombinations = [
      { size: 'sm', variant: 'default', disabled: false },
      { size: 'md', variant: 'primary', disabled: false },
      { size: 'lg', variant: 'danger', disabled: true },
      { size: 'sm', variant: 'danger', disabled: false },
      { size: 'lg', variant: 'default', disabled: true }
    ]
    
    propCombinations.forEach(props => {
      const { unmount } = render(<ResetButton onReset={mockOnReset} {...props} />)
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
      unmount()
    })
  })

  test('handles rapid clicking', () => {
    const mockOnReset = vi.fn()
    render(<ResetButton onReset={mockOnReset} />)
    
    const button = screen.getByRole('button')
    
    // Simulate rapid clicking
    for (let i = 0; i < 10; i++) {
      fireEvent.click(button)
    }
    
    expect(mockOnReset).toHaveBeenCalledTimes(10)
  })

  test('maintains visual consistency', () => {
    const mockOnReset = vi.fn()
    render(<ResetButton onReset={mockOnReset} />)
    
    const button = screen.getByRole('button')
    const svg = button.querySelector('svg')
    
    // Check that button and icon are properly structured
    expect(button).toContainElement(svg)
    expect(svg).toHaveAttribute('fill', 'none')
    expect(svg).toHaveAttribute('stroke', 'currentColor')
  })
})
