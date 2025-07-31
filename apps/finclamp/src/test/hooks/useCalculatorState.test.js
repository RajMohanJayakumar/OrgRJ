import { describe, test, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCalculatorState, generateCalculatorShareURL } from '../../hooks/useCalculatorState'

// Mock URLSearchParams and window.history
const mockPushState = vi.fn()
const mockReplaceState = vi.fn()

Object.defineProperty(window, 'history', {
  value: {
    pushState: mockPushState,
    replaceState: mockReplaceState,
  },
  writable: true,
})

Object.defineProperty(window, 'location', {
  value: {
    search: '',
    pathname: '/calculator',
    href: 'http://localhost:3000/calculator',
    origin: 'http://localhost:3000',
    protocol: 'http:',
    host: 'localhost:3000',
    hostname: 'localhost',
    port: '3000',
    toString: () => 'http://localhost:3000/calculator'
  },
  writable: true,
})

// Mock URL constructor
global.URL = class URL {
  constructor(url, base) {
    if (typeof url === 'object' && url.href) {
      this.href = url.href
      this.origin = url.origin || 'http://localhost:3000'
      this.pathname = url.pathname || '/calculator'
      this.search = url.search || ''
      this.searchParams = new URLSearchParams(this.search)
    } else if (typeof url === 'object') {
      // Handle window.location object
      this.href = 'http://localhost:3000/calculator'
      this.origin = 'http://localhost:3000'
      this.pathname = '/calculator'
      this.search = window.location.search || ''
      this.searchParams = new URLSearchParams(this.search)
    } else if (typeof url === 'string') {
      // Parse URL string properly
      this.href = url
      const urlParts = url.split('?')
      this.origin = 'http://localhost:3000'
      this.pathname = urlParts[0].replace('http://localhost:3000', '') || '/calculator'
      this.search = urlParts[1] ? '?' + urlParts[1] : ''
      this.searchParams = new URLSearchParams(urlParts[1] || '')
    } else {
      this.href = 'http://localhost:3000/calculator'
      this.origin = 'http://localhost:3000'
      this.pathname = '/calculator'
      this.search = ''
      this.searchParams = new URLSearchParams()
    }
  }

  toString() {
    const searchString = this.searchParams.toString()
    return this.origin + this.pathname + (searchString ? '?' + searchString : '')
  }
}

describe('useCalculatorState Hook', () => {
  const defaultInputs = {
    amount: '',
    rate: '',
    time: ''
  }

  beforeEach(() => {
    vi.clearAllMocks()
    window.location.search = ''
  })

  test('initializes with default inputs', () => {
    const { result } = renderHook(() => 
      useCalculatorState('test_', defaultInputs)
    )

    expect(result.current.inputs).toEqual(defaultInputs)
    expect(result.current.results).toBeNull()
  })

  test('initializes with URL parameters', () => {
    window.location.search = '?test_amount=1000&test_rate=10&test_time=5'
    
    const { result } = renderHook(() => 
      useCalculatorState('test_', defaultInputs)
    )

    expect(result.current.inputs).toEqual({
      amount: '1000',
      rate: '10',
      time: '5'
    })
  })

  test('handles input changes correctly', () => {
    const { result } = renderHook(() => 
      useCalculatorState('test_', defaultInputs)
    )

    act(() => {
      result.current.handleInputChange('amount', '5000')
    })

    expect(result.current.inputs.amount).toBe('5000')
    expect(result.current.inputs.rate).toBe('')
    expect(result.current.inputs.time).toBe('')
  })

  test('handles multiple input changes', () => {
    const { result } = renderHook(() => 
      useCalculatorState('test_', defaultInputs)
    )

    act(() => {
      result.current.handleInputChange('amount', '5000')
    })

    act(() => {
      result.current.handleInputChange('rate', '12')
    })

    act(() => {
      result.current.handleInputChange('time', '10')
    })

    expect(result.current.inputs).toEqual({
      amount: '5000',
      rate: '12',
      time: '10'
    })
  })

  test('updates results correctly', () => {
    const { result } = renderHook(() => 
      useCalculatorState('test_', defaultInputs)
    )

    const testResults = {
      finalAmount: 10000,
      interest: 2000
    }

    act(() => {
      result.current.setResults(testResults)
    })

    expect(result.current.results).toEqual(testResults)
  })

  test('resets calculator state', () => {
    const { result } = renderHook(() => 
      useCalculatorState('test_', defaultInputs)
    )

    // Set some values first
    act(() => {
      result.current.handleInputChange('amount', '5000')
      result.current.setResults({ finalAmount: 10000 })
    })

    // Reset
    act(() => {
      result.current.resetCalculator()
    })

    expect(result.current.inputs).toEqual(defaultInputs)
    expect(result.current.results).toBeNull()
  })

  test('handles empty string inputs', () => {
    const { result } = renderHook(() => 
      useCalculatorState('test_', defaultInputs)
    )

    act(() => {
      result.current.handleInputChange('amount', '')
    })

    expect(result.current.inputs.amount).toBe('')
  })

  test('handles numeric string inputs', () => {
    const { result } = renderHook(() => 
      useCalculatorState('test_', defaultInputs)
    )

    act(() => {
      result.current.handleInputChange('amount', '123.45')
    })

    expect(result.current.inputs.amount).toBe('123.45')
  })

  test('handles special characters in inputs', () => {
    const { result } = renderHook(() => 
      useCalculatorState('test_', defaultInputs)
    )

    act(() => {
      result.current.handleInputChange('amount', '1,000.50')
    })

    expect(result.current.inputs.amount).toBe('1,000.50')
  })

  test('maintains input state consistency', () => {
    const { result } = renderHook(() => 
      useCalculatorState('test_', defaultInputs)
    )

    const inputChanges = [
      ['amount', '1000'],
      ['rate', '10'],
      ['time', '5'],
      ['amount', '2000'],
      ['rate', '12']
    ]

    inputChanges.forEach(([field, value]) => {
      act(() => {
        result.current.handleInputChange(field, value)
      })
    })

    expect(result.current.inputs).toEqual({
      amount: '2000',
      rate: '12',
      time: '5'
    })
  })

  test('handles setInputs function', () => {
    const { result } = renderHook(() => 
      useCalculatorState('test_', defaultInputs)
    )

    const newInputs = {
      amount: '15000',
      rate: '8.5',
      time: '7'
    }

    act(() => {
      result.current.setInputs(newInputs)
    })

    expect(result.current.inputs).toEqual(newInputs)
  })

  test('handles partial input updates', () => {
    const { result } = renderHook(() => 
      useCalculatorState('test_', defaultInputs)
    )

    // Set initial values
    act(() => {
      result.current.setInputs({
        amount: '1000',
        rate: '10',
        time: '5'
      })
    })

    // Update only one field
    act(() => {
      result.current.handleInputChange('amount', '2000')
    })

    expect(result.current.inputs).toEqual({
      amount: '2000',
      rate: '10',
      time: '5'
    })
  })

  test('handles complex results objects', () => {
    const { result } = renderHook(() => 
      useCalculatorState('test_', defaultInputs)
    )

    const complexResults = {
      emi: 2124.70,
      totalAmount: 127482,
      totalInterest: 27482,
      breakdown: [
        { year: 1, principal: 1000, interest: 100 },
        { year: 2, principal: 1100, interest: 110 }
      ],
      metadata: {
        calculationType: 'EMI',
        timestamp: new Date().toISOString()
      }
    }

    act(() => {
      result.current.setResults(complexResults)
    })

    expect(result.current.results).toEqual(complexResults)
    expect(result.current.results.breakdown).toHaveLength(2)
    expect(result.current.results.metadata.calculationType).toBe('EMI')
  })

  test('handles null and undefined results', () => {
    const { result } = renderHook(() => 
      useCalculatorState('test_', defaultInputs)
    )

    act(() => {
      result.current.setResults(null)
    })

    expect(result.current.results).toBeNull()

    act(() => {
      result.current.setResults(undefined)
    })

    expect(result.current.results).toBeUndefined()
  })

  test('maintains state isolation between different prefixes', () => {
    const { result: result1 } = renderHook(() => 
      useCalculatorState('emi_', defaultInputs)
    )

    const { result: result2 } = renderHook(() => 
      useCalculatorState('sip_', defaultInputs)
    )

    act(() => {
      result1.current.handleInputChange('amount', '1000')
      result2.current.handleInputChange('amount', '2000')
    })

    expect(result1.current.inputs.amount).toBe('1000')
    expect(result2.current.inputs.amount).toBe('2000')
  })

  test('handles edge case inputs', () => {
    const { result } = renderHook(() => 
      useCalculatorState('test_', defaultInputs)
    )

    const edgeCases = [
      ['amount', '0'],
      ['rate', '0.01'],
      ['time', '100'],
      ['amount', '999999999'],
      ['rate', '50'],
      ['time', '0.5']
    ]

    edgeCases.forEach(([field, value]) => {
      act(() => {
        result.current.handleInputChange(field, value)
      })
      expect(result.current.inputs[field]).toBe(value)
    })
  })

  test('provides updateURL function', () => {
    const { result } = renderHook(() => 
      useCalculatorState('test_', defaultInputs)
    )

    expect(typeof result.current.updateURL).toBe('function')
  })

  test('handles rapid input changes', () => {
    const { result } = renderHook(() => 
      useCalculatorState('test_', defaultInputs)
    )

    // Simulate rapid typing
    const rapidChanges = ['1', '10', '100', '1000', '10000']

    rapidChanges.forEach(value => {
      act(() => {
        result.current.handleInputChange('amount', value)
      })
    })

    expect(result.current.inputs.amount).toBe('10000')
  })

  test('handles concurrent state updates', () => {
    const { result } = renderHook(() =>
      useCalculatorState('test_', defaultInputs)
    )

    // Handle input changes sequentially to avoid stale closure issues
    act(() => {
      result.current.handleInputChange('amount', '1000')
    })

    act(() => {
      result.current.handleInputChange('rate', '10')
    })

    act(() => {
      result.current.setResults({ total: 1100 })
    })

    expect(result.current.inputs.amount).toBe('1000')
    expect(result.current.inputs.rate).toBe('10')
    expect(result.current.results.total).toBe(1100)
  })

  // Tests for URL parameter handling and edge cases
  test('handles URL parameters with "in" parameter', () => {
    window.location.search = '?in=emi&test_amount=5000&test_rate=8'

    const { result } = renderHook(() =>
      useCalculatorState('test_', defaultInputs)
    )

    expect(result.current.inputs).toEqual({
      amount: '5000',
      rate: '8',
      time: ''
    })
  })

  test('handles URL parameters with legacy "calculator" parameter', () => {
    window.location.search = '?calculator=sip&test_amount=3000&test_rate=12'

    const { result } = renderHook(() =>
      useCalculatorState('test_', defaultInputs)
    )

    expect(result.current.inputs).toEqual({
      amount: '3000',
      rate: '12',
      time: ''
    })
  })

  test('updateURL preserves "in" parameter', () => {
    // Update both search and href to be consistent
    window.location.search = '?in=emi'
    window.location.href = 'http://localhost:3000/calculator?in=emi'

    const { result } = renderHook(() =>
      useCalculatorState('test_', defaultInputs)
    )

    act(() => {
      result.current.handleInputChange('amount', '1000')
    })

    expect(mockReplaceState).toHaveBeenCalled()
    const lastCall = mockReplaceState.mock.calls[mockReplaceState.mock.calls.length - 1]
    expect(lastCall[2]).toContain('in=emi')
    expect(lastCall[2]).toContain('test_amount=1000')
  })

  test('updateURL preserves "calculator" parameter when no "in" parameter', () => {
    // Update both search and href to be consistent
    window.location.search = '?calculator=sip'
    window.location.href = 'http://localhost:3000/calculator?calculator=sip'

    const { result } = renderHook(() =>
      useCalculatorState('test_', defaultInputs)
    )

    act(() => {
      result.current.handleInputChange('amount', '2000')
    })

    expect(mockReplaceState).toHaveBeenCalled()
    const lastCall = mockReplaceState.mock.calls[mockReplaceState.mock.calls.length - 1]
    expect(lastCall[2]).toContain('calculator=sip')
    expect(lastCall[2]).toContain('test_amount=2000')
  })

  test('updateURL filters out empty and zero values', () => {
    const { result } = renderHook(() =>
      useCalculatorState('test_', defaultInputs)
    )

    act(() => {
      result.current.setInputs({
        amount: '1000',
        rate: '',
        time: '0'
      })
    })

    act(() => {
      result.current.updateURL(result.current.inputs)
    })

    expect(mockReplaceState).toHaveBeenCalled()
    const lastCall = mockReplaceState.mock.calls[mockReplaceState.mock.calls.length - 1]
    expect(lastCall[2]).toContain('test_amount=1000')
    expect(lastCall[2]).not.toContain('test_rate')
    expect(lastCall[2]).not.toContain('test_time')
  })

  test('updateURL removes existing parameters with prefix', () => {
    // Update both search and href to be consistent
    window.location.search = '?test_amount=500&test_rate=5&other_param=value'
    window.location.href = 'http://localhost:3000/calculator?test_amount=500&test_rate=5&other_param=value'

    const { result } = renderHook(() =>
      useCalculatorState('test_', defaultInputs)
    )

    act(() => {
      result.current.updateURL({ amount: '1000' })
    })

    expect(mockReplaceState).toHaveBeenCalled()
    const lastCall = mockReplaceState.mock.calls[mockReplaceState.mock.calls.length - 1]
    expect(lastCall[2]).toContain('test_amount=1000')
    expect(lastCall[2]).not.toContain('test_rate=5')
    expect(lastCall[2]).toContain('other_param=value')
  })

  test('handles browser back/forward navigation (popstate)', () => {
    window.location.search = '?test_amount=1000&test_rate=10'

    const { result } = renderHook(() =>
      useCalculatorState('test_', defaultInputs)
    )

    // Simulate browser navigation
    window.location.search = '?test_amount=2000&test_rate=15'

    act(() => {
      window.dispatchEvent(new PopStateEvent('popstate'))
    })

    expect(result.current.inputs).toEqual({
      amount: '2000',
      rate: '15',
      time: ''
    })
  })

  test('handles popstate with no URL parameters', () => {
    window.location.search = '?test_amount=1000'

    const { result } = renderHook(() =>
      useCalculatorState('test_', defaultInputs)
    )

    // Simulate navigation to URL with no parameters
    window.location.search = ''

    act(() => {
      window.dispatchEvent(new PopStateEvent('popstate'))
    })

    // Should maintain current inputs when no URL params
    expect(result.current.inputs.amount).toBe('1000')
  })

  test('cleans up popstate event listener on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')

    const { unmount } = renderHook(() =>
      useCalculatorState('test_', defaultInputs)
    )

    unmount()

    expect(removeEventListenerSpy).toHaveBeenCalledWith('popstate', expect.any(Function))

    removeEventListenerSpy.mockRestore()
  })

  test('resetCalculator updates URL with default inputs', () => {
    const { result } = renderHook(() =>
      useCalculatorState('test_', defaultInputs)
    )

    // Set some values first
    act(() => {
      result.current.handleInputChange('amount', '5000')
    })

    // Reset
    act(() => {
      result.current.resetCalculator()
    })

    expect(mockReplaceState).toHaveBeenCalled()
    // Should call updateURL with default inputs (which are empty, so no parameters added)
    const lastCall = mockReplaceState.mock.calls[mockReplaceState.mock.calls.length - 1]
    expect(lastCall[2]).not.toContain('test_amount')
  })
})

describe('generateCalculatorShareURL Function', () => {
  beforeEach(() => {
    // Mock window.location.origin
    Object.defineProperty(window, 'location', {
      value: {
        origin: 'https://finclamp.com',
        search: '',
        pathname: '/calculator',
        href: 'https://finclamp.com/calculator',
        protocol: 'https:',
        host: 'finclamp.com',
        hostname: 'finclamp.com',
        port: '',
        toString: () => 'https://finclamp.com/calculator'
      },
      writable: true,
    })
  })

  test('generates URL for EMI calculator', () => {
    const inputs = {
      loanAmount: '500000',
      interestRate: '8.5',
      loanTenure: '20'
    }
    const results = { emi: 4238.12 }

    const url = generateCalculatorShareURL('emi', inputs, results)

    expect(url).toBe('https://finclamp.com/calculators?in=emi&emi_loanAmount=500000&emi_interestRate=8.5&emi_loanTenure=20')
  })

  test('generates URL for SIP calculator', () => {
    const inputs = {
      monthlyInvestment: '5000',
      expectedReturn: '12',
      timePeriod: '10'
    }
    const results = { maturityAmount: 1162000 }

    const url = generateCalculatorShareURL('sip', inputs, results)

    expect(url).toBe('https://finclamp.com/calculators?in=sip&sip_monthlyInvestment=5000&sip_expectedReturn=12&sip_timePeriod=10')
  })

  test('generates URL for finance game', () => {
    const inputs = {
      level: '1',
      score: '100'
    }
    const results = { completed: true }

    const url = generateCalculatorShareURL('finance-quest', inputs, results)

    expect(url).toBe('https://finclamp.com/games?in=finance-quest&finance-quest_level=1&finance-quest_score=100')
  })

  test('filters out empty and zero values', () => {
    const inputs = {
      amount: '1000',
      rate: '',
      time: '0',
      valid: '5'
    }
    const results = {}

    const url = generateCalculatorShareURL('compound-interest', inputs, results)

    expect(url).toBe('https://finclamp.com/calculators?in=compound-interest&compound-interest_amount=1000&compound-interest_valid=5')
    expect(url).not.toContain('rate')
    expect(url).not.toContain('time')
  })

  test('handles unknown calculator type', () => {
    const inputs = {
      value1: '100',
      value2: '200'
    }
    const results = {}

    const url = generateCalculatorShareURL('unknown-calculator', inputs, results)

    expect(url).toBe('https://finclamp.com/calculators?in=unknown-calculator&unknown-calculator_value1=100&unknown-calculator_value2=200')
  })

  test('handles empty inputs', () => {
    const inputs = {}
    const results = {}

    const url = generateCalculatorShareURL('simple-interest', inputs, results)

    expect(url).toBe('https://finclamp.com/calculators?in=simple-interest')
  })

  test('handles all calculator types in mapping', () => {
    const calculatorTypes = [
      'emi', 'mortgage', 'personal-loan', 'fd', 'rd', 'ppf', 'sip', 'swp', 'cagr',
      'income-tax', 'capital-gains', 'nps', 'epf', 'gratuity', 'budget-planner',
      'savings-goal', 'stock-average', 'net-worth', 'bill-split', 'tip',
      'subscription', 'daily-interest', 'monthly-expense', 'daily-spending',
      'grocery-budget', 'commute-cost', 'wfh-savings', 'habit-cost', 'discount',
      'fuel-cost', 'compound-interest', 'simple-interest', 'inflation'
    ]

    calculatorTypes.forEach(type => {
      const url = generateCalculatorShareURL(type, { amount: '1000' }, {})
      expect(url).toContain('/calculators?in=' + type)
      expect(url).toContain(type + '_amount=1000')
    })
  })

  test('handles special characters in input values', () => {
    const inputs = {
      amount: '1,000.50',
      description: 'test value'
    }
    const results = {}

    const url = generateCalculatorShareURL('emi', inputs, results)

    expect(url).toContain('emi_amount=1%2C000.50')
    expect(url).toContain('emi_description=test+value') // URLSearchParams uses + for spaces
  })

  test('handles numeric input values', () => {
    const inputs = {
      amount: 1000,
      rate: 8.5,
      time: 20
    }
    const results = {}

    const url = generateCalculatorShareURL('emi', inputs, results)

    expect(url).toBe('https://finclamp.com/calculators?in=emi&emi_amount=1000&emi_rate=8.5&emi_time=20')
  })

  test('handles boolean and other data types', () => {
    const inputs = {
      amount: '1000',
      isActive: true,
      count: 0,
      description: null
    }
    const results = {}

    const url = generateCalculatorShareURL('emi', inputs, results)

    expect(url).toContain('emi_amount=1000')
    expect(url).toContain('emi_isActive=true')
    expect(url).not.toContain('emi_count') // 0 should be filtered out
    expect(url).not.toContain('emi_description') // null should be filtered out
  })

  test('handles edge case with undefined and null inputs', () => {
    const inputs = {
      amount: undefined,
      rate: null,
      time: '5'
    }
    const results = {}

    const url = generateCalculatorShareURL('emi', inputs, results)

    expect(url).toBe('https://finclamp.com/calculators?in=emi&emi_time=5')
    expect(url).not.toContain('emi_amount')
    expect(url).not.toContain('emi_rate')
  })

  test('handles very long input values', () => {
    const inputs = {
      amount: '999999999999999',
      description: 'a'.repeat(100)
    }
    const results = {}

    const url = generateCalculatorShareURL('emi', inputs, results)

    expect(url).toContain('emi_amount=999999999999999')
    expect(url).toContain('emi_description=' + encodeURIComponent('a'.repeat(100)))
  })
})

describe('Additional Edge Cases for useCalculatorState', () => {
  const defaultInputs = {
    amount: '',
    rate: '',
    time: ''
  }

  test('handles initialization with no URL parameters and no default inputs', () => {
    window.location.search = ''

    const { result } = renderHook(() =>
      useCalculatorState('test_', {})
    )

    expect(result.current.inputs).toEqual({})
  })

  test('handles URL parameters that do not match prefix', () => {
    window.location.search = '?other_amount=1000&test_rate=10&different_time=5'

    const { result } = renderHook(() =>
      useCalculatorState('test_', defaultInputs)
    )

    expect(result.current.inputs).toEqual({
      amount: '',
      rate: '10',
      time: ''
    })
  })

  test('handles mixed URL parameters with both matching and non-matching prefixes', () => {
    window.location.search = '?test_amount=1000&other_amount=2000&test_rate=10&different_rate=15'

    const { result } = renderHook(() =>
      useCalculatorState('test_', defaultInputs)
    )

    expect(result.current.inputs).toEqual({
      amount: '1000',
      rate: '10',
      time: ''
    })
  })

  test('handles URL parameters with special characters', () => {
    window.location.search = '?test_amount=1%2C000&test_rate=8.5&test_description=hello%20world'

    const { result } = renderHook(() =>
      useCalculatorState('test_', { ...defaultInputs, description: '' })
    )

    expect(result.current.inputs.amount).toBe('1,000')
    expect(result.current.inputs.rate).toBe('8.5')
    expect(result.current.inputs.description).toBe('hello world')
  })

  test('handles empty prefix', () => {
    window.location.search = '?amount=1000&rate=10'

    const { result } = renderHook(() =>
      useCalculatorState('', defaultInputs)
    )

    expect(result.current.inputs).toEqual({
      amount: '1000',
      rate: '10',
      time: ''
    })
  })

  test('handles setInputs with partial object', () => {
    const { result } = renderHook(() =>
      useCalculatorState('test_', defaultInputs)
    )

    act(() => {
      result.current.setInputs({ amount: '1000' })
    })

    expect(result.current.inputs).toEqual({
      amount: '1000'
    })
  })

  test('handles updateURL being called directly', () => {
    const { result } = renderHook(() =>
      useCalculatorState('test_', defaultInputs)
    )

    act(() => {
      result.current.updateURL({ amount: '5000', rate: '10' })
    })

    expect(mockReplaceState).toHaveBeenCalled()
    const lastCall = mockReplaceState.mock.calls[mockReplaceState.mock.calls.length - 1]
    expect(lastCall[2]).toContain('test_amount=5000')
    expect(lastCall[2]).toContain('test_rate=10')
  })
})
