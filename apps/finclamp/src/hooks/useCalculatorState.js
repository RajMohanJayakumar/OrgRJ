import { useState, useEffect, useCallback } from 'react'

/**
 * Custom hook for calculator state management with URL synchronization
 * Provides consistent state management across all calculators
 */
export const useCalculatorState = (prefix, defaultInputs = {}) => {
  const [inputs, setInputs] = useState(defaultInputs)
  const [results, setResults] = useState(null)

  // URL parameter management
  const updateURL = useCallback((newInputs) => {
    const url = new URL(window.location.href)

    // Preserve 'in' parameter (new format) or 'calculator' parameter (legacy)
    const inParam = url.searchParams.get('in')
    const calculatorParam = url.searchParams.get('calculator')

    // Remove existing parameters with the prefix
    const keysToRemove = []
    for (const key of url.searchParams.keys()) {
      if (key.startsWith(prefix)) {
        keysToRemove.push(key)
      }
    }
    keysToRemove.forEach(key => url.searchParams.delete(key))

    // Restore the appropriate parameter (prefer 'in' over 'calculator')
    if (inParam) {
      url.searchParams.set('in', inParam)
    } else if (calculatorParam) {
      url.searchParams.set('calculator', calculatorParam)
    }

    // Add new parameters (only non-empty values)
    Object.entries(newInputs).forEach(([key, value]) => {
      if (value && value !== '' && value !== '0') {
        url.searchParams.set(`${prefix}${key}`, value)
      }
    })

    window.history.replaceState({}, '', url.toString())
  }, [prefix])

  // Read URL parameters
  const readURLParams = useCallback(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const params = {}
    
    for (const [key, value] of urlParams.entries()) {
      if (key.startsWith(prefix)) {
        const cleanKey = key.replace(prefix, '')
        params[cleanKey] = value
      }
    }
    
    return params
  }, [prefix])

  // Initialize from URL on mount
  useEffect(() => {
    const urlParams = readURLParams()
    if (Object.keys(urlParams).length > 0) {
      const initialInputs = { ...defaultInputs, ...urlParams }
      setInputs(initialInputs)
    } else {
      // Set default inputs if no URL params
      setInputs(defaultInputs)
    }
  }, [readURLParams, prefix])

  // Listen for browser navigation
  useEffect(() => {
    const handlePopState = () => {
      const urlParams = readURLParams()
      if (Object.keys(urlParams).length > 0) {
        const newInputs = { ...defaultInputs, ...urlParams }
        setInputs(newInputs)
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [readURLParams])

  // Handle input changes with URL updates
  const handleInputChange = useCallback((field, value) => {
    const newInputs = { ...inputs, [field]: value }
    setInputs(newInputs)
    updateURL(newInputs)
  }, [inputs, updateURL])

  // Reset function
  const resetCalculator = useCallback(() => {
    setInputs(defaultInputs)
    setResults(null)
    updateURL(defaultInputs)
  }, [updateURL])

  return {
    inputs,
    setInputs,
    results,
    setResults,
    handleInputChange,
    resetCalculator,
    updateURL
  }
}

/**
 * Generate shareable URL for calculator results using new main menu format
 */
export const generateCalculatorShareURL = (calculatorType, inputs, results) => {
  const baseURL = window.location.origin
  const params = new URLSearchParams()

  // Map calculator types to main menu paths
  const calculatorCategoryMap = {
    'emi': 'calculators',
    'mortgage': 'calculators',
    'personal-loan': 'calculators',
    'fd': 'calculators',
    'rd': 'calculators',
    'ppf': 'calculators',
    'sip': 'calculators',
    'swp': 'calculators',
    'cagr': 'calculators',
    'income-tax': 'calculators',
    'capital-gains': 'calculators',
    'nps': 'calculators',
    'epf': 'calculators',
    'gratuity': 'calculators',
    'budget-planner': 'calculators',
    'savings-goal': 'calculators',
    'stock-average': 'calculators',
    'net-worth': 'calculators',
    'bill-split': 'calculators',
    'tip': 'calculators',
    'subscription': 'calculators',
    'daily-interest': 'calculators',
    'monthly-expense': 'calculators',
    'daily-spending': 'calculators',
    'grocery-budget': 'calculators',
    'commute-cost': 'calculators',
    'wfh-savings': 'calculators',
    'habit-cost': 'calculators',
    'discount': 'calculators',
    'fuel-cost': 'calculators',
    'compound-interest': 'calculators',
    'simple-interest': 'calculators',
    'inflation': 'calculators',
    'finance-quest': 'games'
  }

  const mainMenu = calculatorCategoryMap[calculatorType] || 'calculators'

  // Use new main menu format: /games?in=finance-quest or /calculators?in=emi
  params.set('in', calculatorType)

  // Add input parameters
  Object.entries(inputs).forEach(([key, value]) => {
    if (value && value !== '' && value !== '0') {
      params.set(`${calculatorType}_${key}`, value)
    }
  })

  return `${baseURL}/${mainMenu}?${params.toString()}`
}
