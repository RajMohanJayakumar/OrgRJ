import { useState, useEffect, useCallback } from 'react'

export const useURLState = (key, defaultValue = '') => {
  // Get initial value from URL
  const getInitialValue = () => {
    const urlParams = new URLSearchParams(window.location.search)
    const value = urlParams.get(key)
    return value !== null ? value : defaultValue
  }

  const [state, setState] = useState(getInitialValue)

  // Update URL when state changes
  const updateURL = useCallback((newValue) => {
    const url = new URL(window.location.href)
    
    if (newValue && newValue !== defaultValue) {
      url.searchParams.set(key, newValue)
    } else {
      url.searchParams.delete(key)
    }
    
    // Update URL without page reload
    window.history.replaceState({}, '', url.toString())
  }, [key, defaultValue])

  // Update state and URL
  const setValue = useCallback((newValue) => {
    setState(newValue)
    updateURL(newValue)
  }, [updateURL])

  // Listen for URL changes (back/forward navigation)
  useEffect(() => {
    const handlePopState = () => {
      setState(getInitialValue())
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [key, defaultValue])

  return [state, setValue]
}

export const useURLStateObject = (prefix = '') => {
  // Get all URL parameters with the given prefix
  const getURLParams = useCallback(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const params = {}

    for (const [key, value] of urlParams.entries()) {
      if (!prefix || key.startsWith(prefix)) {
        const cleanKey = prefix ? key.replace(prefix, '') : key
        params[cleanKey] = value
      }
    }

    return params
  }, [prefix])

  const [state, setState] = useState(() => getURLParams())

  // Update URL with object state
  const updateURL = useCallback((newState) => {
    if (!newState || typeof newState !== 'object') return

    const url = new URL(window.location.href)

    // Preserve calculator parameter
    const calculatorParam = url.searchParams.get('calculator')

    // Remove existing parameters with prefix
    const keysToRemove = []
    for (const key of url.searchParams.keys()) {
      if (!prefix || key.startsWith(prefix)) {
        keysToRemove.push(key)
      }
    }
    keysToRemove.forEach(key => url.searchParams.delete(key))

    // Restore calculator parameter if it existed
    if (calculatorParam) {
      url.searchParams.set('calculator', calculatorParam)
    }

    // Add new parameters
    Object.entries(newState).forEach(([key, value]) => {
      if (value && value !== '') {
        const paramKey = prefix ? `${prefix}${key}` : key
        url.searchParams.set(paramKey, value)
      }
    })

    window.history.replaceState({}, '', url.toString())
  }, [prefix])

  // Update state and URL
  const setStateAndURL = useCallback((newState) => {
    if (!newState || typeof newState !== 'object') return
    setState(newState)
    updateURL(newState)
  }, [updateURL])

  // Update specific key
  const updateKey = useCallback((key, value) => {
    const newState = { ...state, [key]: value }
    setStateAndURL(newState)
  }, [state, setStateAndURL])

  // Listen for URL changes (including programmatic changes)
  useEffect(() => {
    const handleURLChange = () => {
      const newParams = getURLParams()
      setState(newParams)
    }

    // Listen for back/forward navigation
    window.addEventListener('popstate', handleURLChange)

    // Listen for programmatic URL changes
    const originalPushState = window.history.pushState
    const originalReplaceState = window.history.replaceState

    window.history.pushState = function(...args) {
      originalPushState.apply(window.history, args)
      setTimeout(handleURLChange, 0)
    }

    window.history.replaceState = function(...args) {
      originalReplaceState.apply(window.history, args)
      setTimeout(handleURLChange, 0)
    }

    return () => {
      window.removeEventListener('popstate', handleURLChange)
      window.history.pushState = originalPushState
      window.history.replaceState = originalReplaceState
    }
  }, [getURLParams])

  return [state, setStateAndURL, updateKey]
}

// Utility function to generate shareable URL using new main menu format
export const generateShareableURL = (calculatorType, inputs, results) => {
  const url = new URL(window.location.origin)

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
    'freelancer-tax': 'calculators',
    'discount': 'calculators',
    'fuel-cost': 'calculators',
    'compound-interest': 'calculators',
    'simple-interest': 'calculators',
    'inflation': 'calculators',
    'finance-quest': 'games'
  }

  const mainMenu = calculatorCategoryMap[calculatorType] || 'calculators'

  // Use new main menu format: /games?in=finance-quest or /calculators?in=emi
  url.pathname = `/${mainMenu}`
  url.searchParams.set('in', calculatorType)

  // Add inputs with calculator-specific prefix
  if (inputs && typeof inputs === 'object') {
    Object.entries(inputs).forEach(([key, value]) => {
      if (value && value !== '') {
        url.searchParams.set(`${calculatorType}_${key}`, value)
      }
    })
  }

  // Add timestamp for tracking
  url.searchParams.set('shared', Date.now().toString())

  return url.toString()
}
