import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { CurrencyProvider, useCurrency } from '../../contexts/CurrencyContext'

// Test component to use the context
const TestComponent = () => {
  const { formatCurrency, currencyFormat, updateCurrencyFormat, currentFormat } = useCurrency()
  
  return (
    <div>
      <div data-testid="current-format">{currencyFormat}</div>
      <div data-testid="symbol">{currentFormat.symbol}</div>
      <div data-testid="formatted-value">{formatCurrency(1000)}</div>
      <button 
        data-testid="change-currency" 
        onClick={() => updateCurrencyFormat('euro')}
      >
        Change to Euro
      </button>
    </div>
  )
}

describe('CurrencyContext', () => {
  beforeEach(() => {
    // Clear URL parameters before each test
    window.history.replaceState({}, '', '/')
  })

  it('should provide default currency format', () => {
    render(
      <CurrencyProvider>
        <TestComponent />
      </CurrencyProvider>
    )

    expect(screen.getByTestId('current-format')).toHaveTextContent('dollar')
    expect(screen.getByTestId('symbol')).toHaveTextContent('$')
  })

  it('should format currency correctly', () => {
    render(
      <CurrencyProvider>
        <TestComponent />
      </CurrencyProvider>
    )

    expect(screen.getByTestId('formatted-value')).toHaveTextContent('$1,000')
  })

  it('should update currency format', async () => {
    render(
      <CurrencyProvider>
        <TestComponent />
      </CurrencyProvider>
    )

    const changeButton = screen.getByTestId('change-currency')
    
    await act(async () => {
      changeButton.click()
    })

    expect(screen.getByTestId('current-format')).toHaveTextContent('euro')
    expect(screen.getByTestId('symbol')).toHaveTextContent('€')
  })

  it('should read currency from URL parameter', () => {
    // Set URL parameter
    // Set URL before rendering to ensure it's read during initialization
    Object.defineProperty(window, 'location', {
      value: {
        ...window.location,
        search: '?currency=rupee'
      },
      writable: true
    })

    render(
      <CurrencyProvider>
        <TestComponent />
      </CurrencyProvider>
    )

    expect(screen.getByTestId('current-format')).toHaveTextContent('rupee')
    expect(screen.getByTestId('symbol')).toHaveTextContent('₹')
  })

  it('should handle invalid currency parameter', () => {
    // Set URL with invalid currency before rendering
    Object.defineProperty(window, 'location', {
      value: {
        ...window.location,
        search: '?currency=invalid'
      },
      writable: true
    })

    render(
      <CurrencyProvider>
        <TestComponent />
      </CurrencyProvider>
    )

    // Should fallback to default
    expect(screen.getByTestId('current-format')).toHaveTextContent('dollar')
  })
})
