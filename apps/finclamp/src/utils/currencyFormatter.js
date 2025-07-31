// Currency formatting utilities

/**
 * Formats a number with comma separators for display
 * @param {string|number} value - The value to format
 * @returns {string} - Formatted value with commas
 */
export const formatCurrency = (value) => {
  if (!value) return ''
  
  // Remove any existing commas and non-numeric characters except decimal point
  const cleanValue = value.toString().replace(/[^\d.]/g, '')
  
  // If empty after cleaning, return empty string
  if (!cleanValue) return ''
  
  // Split by decimal point
  const parts = cleanValue.split('.')
  
  // Format the integer part with commas
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  
  // Join back with decimal if it exists
  return parts.join('.')
}

/**
 * Removes formatting from a currency string to get the raw number
 * @param {string} formattedValue - The formatted value with commas
 * @returns {string} - Clean numeric value
 */
export const unformatCurrency = (formattedValue) => {
  if (!formattedValue) return ''
  
  // Remove commas and return clean number
  return formattedValue.toString().replace(/,/g, '')
}

/**
 * Checks if a field should have currency formatting
 * @param {string} fieldName - The name of the input field
 * @returns {boolean} - Whether the field should be formatted as currency
 */
export const shouldFormatAsCurrency = (fieldName) => {
  const currencyFields = [
    'principal',
    'monthlyInvestment',
    'lumpSumAmount',
    'maturityAmount',
    'emi',
    'currentAmount',
    'beginningValue',
    'endingValue',
    'monthlyContribution',
    'annualIncome',
    'targetAmount',
    'monthlyDeposit',
    'monthlyWithdrawal',
    'investmentAmount'
  ]
  
  return currencyFields.includes(fieldName)
}

/**
 * Handles currency input change with formatting
 * @param {string} value - The input value
 * @param {function} onChange - The onChange callback
 * @param {string} fieldName - The field name to check if formatting is needed
 */
export const handleCurrencyInputChange = (value, onChange, fieldName) => {
  if (shouldFormatAsCurrency(fieldName)) {
    // Remove formatting for storage
    const cleanValue = unformatCurrency(value)
    onChange(cleanValue)
  } else {
    onChange(value)
  }
}

/**
 * Gets the display value for an input (formatted if currency field)
 * @param {string} value - The stored value
 * @param {string} fieldName - The field name
 * @returns {string} - The value to display in the input
 */
export const getDisplayValue = (value, fieldName) => {
  if (shouldFormatAsCurrency(fieldName) && value) {
    return formatCurrency(value)
  }
  return value || ''
}
