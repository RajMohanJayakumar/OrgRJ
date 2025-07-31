import { createContext, useContext, useCallback, useState, useEffect } from 'react'

const CurrencyContext = createContext()

// Currency format configurations
export const CURRENCY_FORMATS = {
  // Major Global Currencies
  dollar: {
    name: 'US Dollar ($123,456)',
    symbol: '$',
    locale: 'en-US',
    separator: ',',
    decimal: '.',
    precision: 0,
    code: 'USD'
  },
  rupee: {
    name: 'Indian Rupee (₹1,23,456)',
    symbol: '₹',
    locale: 'en-IN',
    separator: ',',
    decimal: '.',
    precision: 0,
    code: 'INR'
  },
  euro: {
    name: 'Euro (€123.456)',
    symbol: '€',
    locale: 'de-DE',
    separator: '.',
    decimal: ',',
    precision: 0,
    code: 'EUR'
  },

  // Asian Currencies
  yen: {
    name: 'Japanese Yen (¥123,456)',
    symbol: '¥',
    locale: 'ja-JP',
    separator: ',',
    decimal: '.',
    precision: 0,
    code: 'JPY'
  },
  yuan: {
    name: 'Chinese Yuan (¥123,456)',
    symbol: '¥',
    locale: 'zh-CN',
    separator: ',',
    decimal: '.',
    precision: 0,
    code: 'CNY'
  },
  won: {
    name: 'South Korean Won (₩123,456)',
    symbol: '₩',
    locale: 'ko-KR',
    separator: ',',
    decimal: '.',
    precision: 0,
    code: 'KRW'
  },

  // European Currencies
  pound: {
    name: 'British Pound (£123,456)',
    symbol: '£',
    locale: 'en-GB',
    separator: ',',
    decimal: '.',
    precision: 0,
    code: 'GBP'
  },
  franc: {
    name: 'Swiss Franc (CHF 123\'456)',
    symbol: 'CHF ',
    locale: 'de-CH',
    separator: '\'',
    decimal: '.',
    precision: 0,
    code: 'CHF'
  },

  // Middle East & Africa
  dirham: {
    name: 'UAE Dirham (د.إ123,456)',
    symbol: 'د.إ',
    locale: 'ar-AE',
    separator: ',',
    decimal: '.',
    precision: 0,
    code: 'AED'
  },
  riyal: {
    name: 'Saudi Riyal (﷼123,456)',
    symbol: '﷼',
    locale: 'ar-SA',
    separator: ',',
    decimal: '.',
    precision: 0,
    code: 'SAR'
  },
  rand: {
    name: 'South African Rand (R123,456)',
    symbol: 'R',
    locale: 'en-ZA',
    separator: ',',
    decimal: '.',
    precision: 0,
    code: 'ZAR'
  },

  // Americas
  canadian: {
    name: 'Canadian Dollar (C$123,456)',
    symbol: 'C$',
    locale: 'en-CA',
    separator: ',',
    decimal: '.',
    precision: 0,
    code: 'CAD'
  },
  mexican: {
    name: 'Mexican Peso ($123,456)',
    symbol: '$',
    locale: 'es-MX',
    separator: ',',
    decimal: '.',
    precision: 0,
    code: 'MXN'
  },
  brazilian: {
    name: 'Brazilian Real (R$123.456)',
    symbol: 'R$',
    locale: 'pt-BR',
    separator: '.',
    decimal: ',',
    precision: 0,
    code: 'BRL'
  },

  // Oceania
  australian: {
    name: 'Australian Dollar (A$123,456)',
    symbol: 'A$',
    locale: 'en-AU',
    separator: ',',
    decimal: '.',
    precision: 0,
    code: 'AUD'
  },

  // Other Major Currencies
  ruble: {
    name: 'Russian Ruble (₽123,456)',
    symbol: '₽',
    locale: 'ru-RU',
    separator: ' ',
    decimal: ',',
    precision: 0,
    code: 'RUB'
  },
  turkish: {
    name: 'Turkish Lira (₺123,456)',
    symbol: '₺',
    locale: 'tr-TR',
    separator: '.',
    decimal: ',',
    precision: 0,
    code: 'TRY'
  },

  // Cryptocurrency (for modern appeal)
  bitcoin: {
    name: 'Bitcoin (₿1.23456)',
    symbol: '₿',
    locale: 'en-US',
    separator: ',',
    decimal: '.',
    precision: 5,
    code: 'BTC'
  }
}

// List of fields that should be formatted as currency
const currencyFields = [
  'loanAmount', 'monthlyPayment', 'totalInterest', 'totalPayment',
  'monthlyInvestment', 'lumpSumAmount', 'totalInvestment', 'maturityAmount', 'totalReturns',
  'principal', 'interest', 'amount', 'finalAmount',
  'initialInvestment', 'monthlyWithdrawal', 'remainingBalance', 'totalWithdrawn',
  'beginningValue', 'endingValue', 'netProfit', 'totalReturns',
  'currentValue', 'futureValue', 'presentValue',
  'salary', 'bonus', 'deductions', 'netSalary',
  'income', 'expenses', 'savings', 'investment',
  'annualIncome', 'basicSalary', 'lastDrawnSalary', 'monthlyContribution'
]

// Helper function to format numbers in Indian style (lakhs/crores)
const formatIndianNumber = (num) => {
  if (num >= 10000000) { // 1 crore
    return (num / 10000000).toFixed(2) + ' Cr'
  } else if (num >= 100000) { // 1 lakh
    return (num / 100000).toFixed(2) + ' L'
  } else if (num >= 1000) { // 1 thousand
    return (num / 1000).toFixed(2) + ' K'
  }
  return num.toLocaleString('en-IN')
}

// Helper function to format large numbers
const formatLargeNumber = (num) => {
  if (num >= 1000000000) { // 1 billion
    return (num / 1000000000).toFixed(2) + 'B'
  } else if (num >= 1000000) { // 1 million
    return (num / 1000000).toFixed(2) + 'M'
  } else if (num >= 1000) { // 1 thousand
    return (num / 1000).toFixed(2) + 'K'
  }
  return num.toLocaleString()
}

// Helper function to format large numbers in Indian style
const formatLargeIndianNumber = (num) => {
  if (num >= 10000000) { // 1 crore
    return (num / 10000000).toFixed(1) + ' Cr'
  } else if (num >= 100000) { // 1 lakh
    return (num / 100000).toFixed(1) + ' L'
  } else if (num >= 1000) { // 1 thousand
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toLocaleString('en-IN')
}

export const CurrencyProvider = ({ children }) => {
  // Get initial currency format from URL or default to 'dollar'
  const getInitialCurrencyFormat = () => {
    const urlParams = new URLSearchParams(window.location.search)
    const currencyParam = urlParams.get('currency')
    return CURRENCY_FORMATS[currencyParam] ? currencyParam : 'dollar'
  }

  // Currency format state
  const [currencyFormat, setCurrencyFormat] = useState(getInitialCurrencyFormat)

  // Add currency parameter to URL on initial load if not present
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const currencyParam = urlParams.get('currency')

    if (!currencyParam) {
      const url = new URL(window.location.href)
      url.searchParams.set('currency', currencyFormat)
      window.history.replaceState({}, '', url.toString())

      if (process.env.NODE_ENV === 'development') {
        console.log('💰 Currency: Added default currency to URL:', currencyFormat)
      }
    }
  }, []) // Only run on mount

  // Get current format configuration
  const currentFormat = CURRENCY_FORMATS[currencyFormat] || CURRENCY_FORMATS.dollar

  // Update currency format and URL
  const updateCurrencyFormat = useCallback((format) => {
    if (CURRENCY_FORMATS[format]) {
      setCurrencyFormat(format)

      // Update URL parameter
      const url = new URL(window.location.href)
      url.searchParams.set('currency', format)
      window.history.replaceState({}, '', url)
    }
  }, [])

  // Listen for URL changes to sync currency format
  useEffect(() => {
    const handlePopState = () => {
      const urlParams = new URLSearchParams(window.location.search)
      const currencyParam = urlParams.get('currency')
      if (CURRENCY_FORMATS[currencyParam] && currencyParam !== currencyFormat) {
        setCurrencyFormat(currencyParam)
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [currencyFormat])

  // Format currency with current format
  const formatCurrency = useCallback((value, options = {}) => {
    const {
      noSymbol = false,
      decimals = currentFormat.precision
    } = options

    if (!value || isNaN(value)) return noSymbol ? '0' : `${currentFormat.symbol}0`

    const numValue = parseFloat(value)

    const formatted = numValue.toLocaleString(currentFormat.locale, {
      maximumFractionDigits: decimals
    })

    return noSymbol ? formatted : `${currentFormat.symbol}${formatted}`
  }, [currentFormat])

  // Remove currency formatting and return number
  const unformatCurrency = useCallback((value) => {
    if (!value) return ''

    // Remove currency symbol, commas, and other formatting
    const cleaned = value.toString()
      .replace(/₹/g, '')
      .replace(/,/g, '')
      .replace(/\s/g, '')
      .replace(/[^\d.-]/g, '')

    return cleaned
  }, [])

  // Check if field should be formatted as currency
  const shouldFormatAsCurrency = useCallback((fieldName) => {
    return currencyFields.includes(fieldName)
  }, [])

  // Get display value for inputs
  const getDisplayValue = useCallback((value, fieldName) => {
    if (shouldFormatAsCurrency(fieldName) && value) {
      return formatCurrency(value, { noSymbol: true })
    }
    return value || ''
  }, [formatCurrency, shouldFormatAsCurrency])

  const value = {
    formatCurrency,
    unformatCurrency,
    shouldFormatAsCurrency,
    getDisplayValue,
    currencyFormat,
    updateCurrencyFormat,
    currentFormat
  }

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  )
}

export const useCurrency = () => {
  const context = useContext(CurrencyContext)
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider')
  }
  return context
}