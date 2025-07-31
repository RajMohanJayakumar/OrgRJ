// SEO URL Helper - Utilities for working with URL parameters for SEO

/**
 * Extract calculator inputs from URL parameters
 * @param {string} calculatorId - The calculator ID (e.g., 'emi', 'sip')
 * @returns {object} - Object containing calculator inputs from URL
 */
export const extractCalculatorInputsFromURL = (calculatorId) => {
  if (!calculatorId) return {}
  
  const urlParams = new URLSearchParams(window.location.search)
  const inputs = {}
  
  // Extract parameters that start with calculatorId_
  for (const [key, value] of urlParams.entries()) {
    if (key.startsWith(`${calculatorId}_`)) {
      const inputKey = key.replace(`${calculatorId}_`, '')
      inputs[inputKey] = value
    }
  }
  
  return inputs
}

/**
 * Generate SEO-friendly title based on calculator and inputs
 * @param {string} calculatorId - The calculator ID
 * @param {object} inputs - Calculator inputs
 * @returns {string} - SEO-optimized title
 */
export const generateSEOTitle = (calculatorId, inputs = {}) => {
  const calculatorNames = {
    'emi': 'EMI Calculator',
    'sip': 'SIP Calculator', 
    'fd': 'FD Calculator',
    'ppf': 'PPF Calculator',
    'income-tax': 'Income Tax Calculator',
    'rd': 'RD Calculator',
    'nps': 'NPS Calculator',
    'epf': 'EPF Calculator',
    'mortgage': 'Mortgage Calculator',
    'personal-loan': 'Personal Loan Calculator'
  }
  
  const baseName = calculatorNames[calculatorId] || 'Financial Calculator'
  
  // Generate dynamic title based on inputs
  const inputValues = []
  
  if (calculatorId === 'emi') {
    if (inputs.loanAmount) inputValues.push(`₹${formatAmount(inputs.loanAmount)}`)
    if (inputs.interestRate) inputValues.push(`${inputs.interestRate}%`)
    if (inputs.loanTenure) inputValues.push(`${inputs.loanTenure} years`)
  } else if (calculatorId === 'sip') {
    if (inputs.monthlyInvestment) inputValues.push(`₹${formatAmount(inputs.monthlyInvestment)}/month`)
    if (inputs.expectedReturn) inputValues.push(`${inputs.expectedReturn}% return`)
    if (inputs.timePeriod) inputValues.push(`${inputs.timePeriod} years`)
  } else if (calculatorId === 'fd') {
    if (inputs.principal) inputValues.push(`₹${formatAmount(inputs.principal)}`)
    if (inputs.interestRate) inputValues.push(`${inputs.interestRate}%`)
    if (inputs.tenure) inputValues.push(`${inputs.tenure} years`)
  }
  
  if (inputValues.length > 0) {
    return `${baseName} - ${inputValues.join(', ')} | FinClamp`
  }
  
  return `${baseName} - Free Online Calculator | FinClamp`
}

/**
 * Generate SEO-friendly meta description based on calculator and inputs
 * @param {string} calculatorId - The calculator ID
 * @param {object} inputs - Calculator inputs
 * @returns {string} - SEO-optimized meta description
 */
export const generateSEODescription = (calculatorId, inputs = {}) => {
  const baseDescriptions = {
    'emi': 'Calculate EMI for home loans, personal loans, and car loans with our free EMI calculator.',
    'sip': 'Calculate SIP returns and plan your mutual fund investments with our SIP calculator.',
    'fd': 'Calculate fixed deposit maturity amount and interest with our FD calculator.',
    'ppf': 'Calculate PPF maturity amount and plan your retirement with our PPF calculator.',
    'income-tax': 'Calculate income tax liability for old and new tax regime with our tax calculator.'
  }
  
  let description = baseDescriptions[calculatorId] || 'Free online financial calculator for all your planning needs.'
  
  // Add specific details based on inputs
  if (Object.keys(inputs).length > 0) {
    if (calculatorId === 'emi' && inputs.loanAmount) {
      description = `Calculate EMI for ₹${formatAmount(inputs.loanAmount)} loan. ${description}`
    } else if (calculatorId === 'sip' && inputs.monthlyInvestment) {
      description = `Calculate returns for ₹${formatAmount(inputs.monthlyInvestment)} monthly SIP. ${description}`
    }
  }
  
  return description + ' Get instant results with charts and detailed breakdown.'
}

/**
 * Generate structured data for calculator with inputs
 * @param {string} calculatorId - The calculator ID
 * @param {object} inputs - Calculator inputs
 * @param {object} results - Calculator results
 * @returns {object} - Structured data object
 */
export const generateCalculatorStructuredData = (calculatorId, inputs = {}, results = {}) => {
  const baseData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": generateSEOTitle(calculatorId, inputs),
    "description": generateSEODescription(calculatorId, inputs),
    "url": window.location.href,
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Any",
    "isAccessibleForFree": true,
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  }
  
  // Add calculator-specific features
  if (calculatorId === 'emi') {
    baseData.featureList = [
      "EMI calculation",
      "Amortization schedule", 
      "Interest vs principal breakdown",
      "Loan comparison"
    ]
  } else if (calculatorId === 'sip') {
    baseData.featureList = [
      "SIP return calculation",
      "Investment growth chart",
      "Goal-based planning",
      "Tax saving analysis"
    ]
  }
  
  // Add input/output data if available
  if (Object.keys(inputs).length > 0 || Object.keys(results).length > 0) {
    baseData.potentialAction = {
      "@type": "UseAction",
      "object": {
        "@type": "Thing",
        "name": "Financial Calculation",
        "additionalProperty": [
          ...Object.keys(inputs).map(key => ({
            "@type": "PropertyValue",
            "name": key,
            "value": inputs[key]
          })),
          ...Object.keys(results).map(key => ({
            "@type": "PropertyValue", 
            "name": key,
            "value": results[key]
          }))
        ]
      }
    }
  }
  
  return baseData
}

/**
 * Format amount for display (e.g., 5000000 -> "50L")
 * @param {number|string} amount - Amount to format
 * @returns {string} - Formatted amount
 */
const formatAmount = (amount) => {
  const num = parseFloat(amount)
  if (isNaN(num)) return amount
  
  if (num >= 10000000) {
    return `${(num / 10000000).toFixed(1)}Cr`
  } else if (num >= 100000) {
    return `${(num / 100000).toFixed(1)}L`
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`
  }
  
  return num.toString()
}

/**
 * Update page title and meta description based on URL parameters
 * @param {string} calculatorId - The calculator ID
 */
export const updateSEOFromURL = (calculatorId) => {
  if (!calculatorId) return

  const inputs = extractCalculatorInputsFromURL(calculatorId)
  const title = generateSEOTitle(calculatorId, inputs)
  const description = generateSEODescription(calculatorId, inputs)

  // Update document title
  document.title = title

  // Update meta description
  let metaDesc = document.querySelector('meta[name="description"]')
  if (!metaDesc) {
    metaDesc = document.createElement('meta')
    metaDesc.name = 'description'
    document.head.appendChild(metaDesc)
  }
  metaDesc.content = description

  // Update Open Graph tags
  updateOGTag('og:title', title)
  updateOGTag('og:description', description)
  updateOGTag('og:url', window.location.href)

  // Update Twitter Card tags
  updateTwitterTag('twitter:title', title)
  updateTwitterTag('twitter:description', description)

  if (process.env.NODE_ENV === 'development') {
    console.log('🎯 SEO Updated from URL:')
    console.log('📝 Title:', title)
    console.log('📄 Description:', description)
    console.log('📊 Inputs:', inputs)
  }
}

/**
 * Ensure essential URL parameters are present for SEO
 * @param {string} calculatorId - The calculator ID
 */
export const ensureEssentialURLParams = (calculatorId) => {
  const url = new URL(window.location.href)
  let urlUpdated = false

  // Ensure currency parameter is present
  if (!url.searchParams.get('currency')) {
    url.searchParams.set('currency', 'dollar')
    urlUpdated = true
  }

  // Ensure calculator parameter is present in the correct format
  if (!url.searchParams.get('in') && calculatorId) {
    url.searchParams.set('in', calculatorId)
    urlUpdated = true
  }

  // Update URL if any parameters were added
  if (urlUpdated) {
    window.history.replaceState({}, '', url.toString())

    if (process.env.NODE_ENV === 'development') {
      console.log('🔗 URL: Added essential parameters:', url.toString())
    }
  }
}

/**
 * Helper function to update Open Graph meta tags
 */
const updateOGTag = (property, content) => {
  let tag = document.querySelector(`meta[property="${property}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute('property', property)
    document.head.appendChild(tag)
  }
  tag.content = content
}

/**
 * Helper function to update Twitter Card meta tags
 */
const updateTwitterTag = (name, content) => {
  let tag = document.querySelector(`meta[name="${name}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.name = name
    document.head.appendChild(tag)
  }
  tag.content = content
}

export default {
  extractCalculatorInputsFromURL,
  generateSEOTitle,
  generateSEODescription,
  generateCalculatorStructuredData,
  updateSEOFromURL,
  ensureEssentialURLParams
}
