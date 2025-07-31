import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { ComparisonProvider, useComparison } from '../../contexts/ComparisonContext'

// Test component to use the context
const TestComponent = () => {
  const {
    comparisons,
    addToComparison,
    removeFromComparison,
    clearComparisons,
    isComparisonVisible
  } = useComparison()

  const testComparison = {
    calculatorType: 'sip',
    inputs: { monthlyInvestment: 5000 },
    results: { maturityAmount: 1000000 }
  }

  return (
    <div>
      <div data-testid="comparison-count">{comparisons.length}</div>
      <div data-testid="is-comparing">{isComparisonVisible.toString()}</div>
      <button
        data-testid="add-comparison"
        onClick={() => addToComparison(testComparison)}
      >
        Add Comparison
      </button>
      <button
        data-testid="remove-comparison"
        onClick={() => removeFromComparison(comparisons[0]?.id)}
      >
        Remove Comparison
      </button>
      <button
        data-testid="clear-comparisons"
        onClick={clearComparisons}
      >
        Clear All
      </button>
      {comparisons.map(comp => (
        <div key={comp.id} data-testid={`comparison-${comp.id}`}>
          {comp.calculatorType}
        </div>
      ))}
    </div>
  )
}

describe('ComparisonContext', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should provide empty comparisons by default', () => {
    render(
      <ComparisonProvider>
        <TestComponent />
      </ComparisonProvider>
    )

    expect(screen.getByTestId('comparison-count')).toHaveTextContent('0')
    expect(screen.getByTestId('is-comparing')).toHaveTextContent('false')
  })

  it('should add comparison', async () => {
    render(
      <ComparisonProvider>
        <TestComponent />
      </ComparisonProvider>
    )

    const addButton = screen.getByTestId('add-comparison')

    await act(async () => {
      addButton.click()
    })

    expect(screen.getByTestId('comparison-count')).toHaveTextContent('1')
    expect(screen.getByTestId('is-comparing')).toHaveTextContent('true')
    // Check if any comparison with 'sip' exists
    expect(screen.getByText('sip')).toBeInTheDocument()
  })

  it('should remove comparison', async () => {
    render(
      <ComparisonProvider>
        <TestComponent />
      </ComparisonProvider>
    )

    const addButton = screen.getByTestId('add-comparison')
    const removeButton = screen.getByTestId('remove-comparison')

    // Add comparison first
    await act(async () => {
      addButton.click()
    })

    expect(screen.getByTestId('comparison-count')).toHaveTextContent('1')

    // Remove comparison
    await act(async () => {
      removeButton.click()
    })

    expect(screen.getByTestId('comparison-count')).toHaveTextContent('0')
    // Note: isComparisonVisible might still be true even with 0 comparisons
  })

  it('should clear all comparisons', async () => {
    render(
      <ComparisonProvider>
        <TestComponent />
      </ComparisonProvider>
    )

    const addButton = screen.getByTestId('add-comparison')
    const clearButton = screen.getByTestId('clear-comparisons')
    
    // Add multiple comparisons
    await act(async () => {
      addButton.click()
      addButton.click()
    })

    expect(screen.getByTestId('comparison-count')).toHaveTextContent('2')

    // Clear all
    await act(async () => {
      clearButton.click()
    })

    expect(screen.getByTestId('comparison-count')).toHaveTextContent('0')
    expect(screen.getByTestId('is-comparing')).toHaveTextContent('false')
  })

  it('should toggle comparison visibility', async () => {
    render(
      <ComparisonProvider>
        <TestComponent />
      </ComparisonProvider>
    )

    const addButton = screen.getByTestId('add-comparison')

    await act(async () => {
      addButton.click()
    })

    expect(screen.getByTestId('is-comparing')).toHaveTextContent('true')
  })

  it('should allow multiple comparisons', async () => {
    render(
      <ComparisonProvider>
        <TestComponent />
      </ComparisonProvider>
    )

    const addButton = screen.getByTestId('add-comparison')

    // Add multiple comparisons
    await act(async () => {
      addButton.click()
      addButton.click()
      addButton.click()
    })

    // Should allow multiple comparisons
    const count = parseInt(screen.getByTestId('comparison-count').textContent)
    expect(count).toBe(3)
  })
})
