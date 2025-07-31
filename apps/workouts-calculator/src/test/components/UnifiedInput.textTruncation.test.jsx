import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import UnifiedInput from '../UnifiedInput'

// Mock the useScrollPreventInput hook
vi.mock('../../hooks/useScrollPreventInput', () => ({
  useScrollPreventInput: () => ({
    inputRef: { current: null },
    onKeyDown: vi.fn()
  })
}))

describe('UnifiedInput - Text Truncation', () => {
  describe('Long text handling in select dropdown', () => {
    const longTextOptions = [
      { value: 'short', label: 'Short' },
      { value: 'medium', label: 'Medium Length Text' },
      { value: 'long', label: 'This is a very long text that should be truncated' },
      { value: 'extra_long', label: 'This is an extremely long text that definitely needs to be truncated to prevent layout issues' }
    ]

    it('applies truncate class to selected option display', () => {
      render(
        <UnifiedInput
          type="select"
          label="Test Select"
          value="long"
          onChange={vi.fn()}
          options={longTextOptions}
        />
      )

      const button = screen.getByRole('button')
      const selectedText = button.querySelector('span')
      
      expect(selectedText).toHaveClass('truncate')
      expect(selectedText).toHaveClass('pr-2')
    })

    it('shows tooltip with full text for selected option', () => {
      render(
        <UnifiedInput
          type="select"
          label="Test Select"
          value="long"
          onChange={vi.fn()}
          options={longTextOptions}
        />
      )

      const button = screen.getByRole('button')
      const selectedText = button.querySelector('span')
      
      expect(selectedText).toHaveAttribute('title', 'This is a very long text that should be truncated')
    })

    it('applies truncate class to dropdown options', () => {
      render(
        <UnifiedInput
          type="select"
          label="Test Select"
          value=""
          onChange={vi.fn()}
          options={longTextOptions}
        />
      )

      // Open dropdown
      const button = screen.getByRole('button')
      fireEvent.click(button)

      // Check that options have truncate class
      const longOption = screen.getByText('This is a very long text that should be truncated')
      expect(longOption).toHaveClass('truncate')
      expect(longOption).toHaveAttribute('title', 'This is a very long text that should be truncated')
    })

    it('handles icons with long text properly', () => {
      const optionsWithIcons = [
        { value: 'option1', label: 'Short', icon: '🎯' },
        { value: 'option2', label: 'This is a very long option with an icon', icon: '📊' }
      ]

      render(
        <UnifiedInput
          type="select"
          label="Test Select"
          value=""
          onChange={vi.fn()}
          options={optionsWithIcons}
        />
      )

      // Open dropdown
      const button = screen.getByRole('button')
      fireEvent.click(button)

      // Check that the container has proper flex classes
      const longOptionContainer = screen.getByText('This is a very long option with an icon').parentElement
      expect(longOptionContainer).toHaveClass('flex', 'items-center', 'min-w-0')

      // Check that icon has flex-shrink-0
      const icon = screen.getByText('📊')
      expect(icon).toHaveClass('flex-shrink-0')
    })

    it('shows placeholder with tooltip when no option selected', () => {
      const longPlaceholder = 'This is a very long placeholder text that should be truncated'
      
      render(
        <UnifiedInput
          type="select"
          label="Test Select"
          value=""
          onChange={vi.fn()}
          options={longTextOptions}
          placeholder={longPlaceholder}
        />
      )

      const button = screen.getByRole('button')
      const placeholderText = button.querySelector('span')
      
      expect(placeholderText).toHaveAttribute('title', longPlaceholder)
      expect(placeholderText).toHaveClass('truncate')
    })
  })

  describe('Responsive behavior', () => {
    it('maintains consistent height with truncated text', () => {
      const options = [
        { value: 'short', label: 'Short' },
        { value: 'long', label: 'This is a very long text that would normally wrap to multiple lines' }
      ]

      const { rerender } = render(
        <UnifiedInput
          type="select"
          label="Test Select"
          value="short"
          onChange={vi.fn()}
          options={options}
        />
      )

      const shortButton = screen.getByRole('button')
      const shortHeight = shortButton.getBoundingClientRect().height

      rerender(
        <UnifiedInput
          type="select"
          label="Test Select"
          value="long"
          onChange={vi.fn()}
          options={options}
        />
      )

      const longButton = screen.getByRole('button')
      const longHeight = longButton.getBoundingClientRect().height

      // Heights should be the same due to truncation
      expect(Math.abs(shortHeight - longHeight)).toBeLessThan(2) // Allow for small rounding differences
    })
  })
})
