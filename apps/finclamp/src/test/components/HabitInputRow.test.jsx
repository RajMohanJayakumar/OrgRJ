import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import HabitInputRow from '../HabitInputRow'
import { Coffee, Cigarette } from 'lucide-react'

// Mock the currency context
vi.mock('../../contexts/CurrencyContext', () => ({
  useCurrency: () => ({
    currentFormat: { symbol: '$' }
  })
}))

// Mock the useScrollPreventInput hook
vi.mock('../../hooks/useScrollPreventInput', () => ({
  useScrollPreventInput: () => ({
    inputRef: { current: null },
    onKeyDown: vi.fn()
  })
}))

describe('HabitInputRow', () => {
  const mockHabit = {
    id: 1,
    name: 'Coffee',
    type: 'coffee',
    dailyQuantity: '2',
    unitCost: '5'
  }

  const mockHabitTypes = {
    coffee: {
      label: 'Coffee',
      icon: Coffee,
      color: 'brown'
    },
    cigarette: {
      label: 'Cigarettes', 
      icon: Cigarette,
      color: 'red'
    }
  }

  const mockOnUpdate = vi.fn()
  const mockOnRemove = vi.fn()

  it('renders without crashing with React component icons', () => {
    render(
      <HabitInputRow
        habit={mockHabit}
        onUpdate={mockOnUpdate}
        onRemove={mockOnRemove}
        habitTypes={mockHabitTypes}
        showRemove={true}
      />
    )

    // Check that the component renders the habit name (now as text, not input value)
    expect(screen.getByText('Coffee')).toBeInTheDocument()

    // Check that the Type dropdown is rendered
    expect(screen.getByText('Type')).toBeInTheDocument()

    // Check that Daily Quantity input is rendered
    expect(screen.getByText('Daily Quantity')).toBeInTheDocument()

    // Check that Cost per Unit input is rendered
    expect(screen.getByText('Cost per Unit')).toBeInTheDocument()
  })

  it('handles React component icons correctly in dropdown options', () => {
    render(
      <HabitInputRow
        habit={mockHabit}
        onUpdate={mockOnUpdate}
        onRemove={mockOnRemove}
        habitTypes={mockHabitTypes}
        showRemove={true}
      />
    )

    // The component should render without throwing the "Objects are not valid as a React child" error
    // If this test passes, it means our icon handling fix is working
    expect(screen.getByText('Type')).toBeInTheDocument()
  })

  it('shows remove button when showRemove is true', () => {
    render(
      <HabitInputRow
        habit={mockHabit}
        onUpdate={mockOnUpdate}
        onRemove={mockOnRemove}
        habitTypes={mockHabitTypes}
        showRemove={true}
      />
    )

    expect(screen.getByText('Remove')).toBeInTheDocument()
  })

  it('hides remove button when showRemove is false', () => {
    render(
      <HabitInputRow
        habit={mockHabit}
        onUpdate={mockOnUpdate}
        onRemove={mockOnRemove}
        habitTypes={mockHabitTypes}
        showRemove={false}
      />
    )

    expect(screen.queryByText('Remove')).not.toBeInTheDocument()
  })

  describe('Habit Name Editing', () => {
    it('shows edit icon when hovering over habit name', () => {
      render(
        <HabitInputRow
          habit={mockHabit}
          onUpdate={mockOnUpdate}
          onRemove={mockOnRemove}
          habitTypes={mockHabitTypes}
          showRemove={true}
        />
      )

      // The edit icon should be present (though may be hidden by CSS)
      const editIcon = screen.getByTitle('Click to edit habit name')
      expect(editIcon).toBeInTheDocument()
    })

    it('enters edit mode when habit name is clicked', () => {
      render(
        <HabitInputRow
          habit={mockHabit}
          onUpdate={mockOnUpdate}
          onRemove={mockOnRemove}
          habitTypes={mockHabitTypes}
          showRemove={true}
        />
      )

      const habitNameArea = screen.getByTitle('Click to edit habit name')
      fireEvent.click(habitNameArea)

      // Should show input field and save/cancel buttons
      expect(screen.getByDisplayValue('Coffee')).toBeInTheDocument()
      expect(screen.getByTitle('Save changes')).toBeInTheDocument()
      expect(screen.getByTitle('Cancel editing')).toBeInTheDocument()
    })

    it('saves changes when save button is clicked', () => {
      render(
        <HabitInputRow
          habit={mockHabit}
          onUpdate={mockOnUpdate}
          onRemove={mockOnRemove}
          habitTypes={mockHabitTypes}
          showRemove={true}
        />
      )

      // Enter edit mode
      const habitNameArea = screen.getByTitle('Click to edit habit name')
      fireEvent.click(habitNameArea)

      // Change the name
      const input = screen.getByDisplayValue('Coffee')
      fireEvent.change(input, { target: { value: 'Tea' } })

      // Save changes
      const saveButton = screen.getByTitle('Save changes')
      fireEvent.click(saveButton)

      // Should call onUpdate with new name
      expect(mockOnUpdate).toHaveBeenCalledWith(1, 'name', 'Tea')
    })

    it('cancels changes when cancel button is clicked', () => {
      render(
        <HabitInputRow
          habit={mockHabit}
          onUpdate={mockOnUpdate}
          onRemove={mockOnRemove}
          habitTypes={mockHabitTypes}
          showRemove={true}
        />
      )

      // Enter edit mode
      const habitNameArea = screen.getByTitle('Click to edit habit name')
      fireEvent.click(habitNameArea)

      // Change the name
      const input = screen.getByDisplayValue('Coffee')
      fireEvent.change(input, { target: { value: 'Tea' } })

      // Cancel changes
      const cancelButton = screen.getByTitle('Cancel editing')
      fireEvent.click(cancelButton)

      // Should not call onUpdate and should show original name
      expect(mockOnUpdate).not.toHaveBeenCalledWith(1, 'name', 'Tea')
      expect(screen.getByText('Coffee')).toBeInTheDocument()
    })

    it('saves changes when Enter key is pressed', () => {
      render(
        <HabitInputRow
          habit={mockHabit}
          onUpdate={mockOnUpdate}
          onRemove={mockOnRemove}
          habitTypes={mockHabitTypes}
          showRemove={true}
        />
      )

      // Enter edit mode
      const habitNameArea = screen.getByTitle('Click to edit habit name')
      fireEvent.click(habitNameArea)

      // Change the name and press Enter
      const input = screen.getByDisplayValue('Coffee')
      fireEvent.change(input, { target: { value: 'Tea' } })
      fireEvent.keyDown(input, { key: 'Enter' })

      // Should call onUpdate with new name
      expect(mockOnUpdate).toHaveBeenCalledWith(1, 'name', 'Tea')
    })

    it('cancels changes when Escape key is pressed', () => {
      render(
        <HabitInputRow
          habit={mockHabit}
          onUpdate={mockOnUpdate}
          onRemove={mockOnRemove}
          habitTypes={mockHabitTypes}
          showRemove={true}
        />
      )

      // Enter edit mode
      const habitNameArea = screen.getByTitle('Click to edit habit name')
      fireEvent.click(habitNameArea)

      // Change the name and press Escape
      const input = screen.getByDisplayValue('Coffee')
      fireEvent.change(input, { target: { value: 'Tea' } })
      fireEvent.keyDown(input, { key: 'Escape' })

      // Should not call onUpdate and should show original name
      expect(mockOnUpdate).not.toHaveBeenCalledWith(1, 'name', 'Tea')
      expect(screen.getByText('Coffee')).toBeInTheDocument()
    })
  })
})
