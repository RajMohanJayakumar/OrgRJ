import React, { useState, useEffect } from 'react'
import { useCurrency } from '../../../contexts/CurrencyContext'
import { useScrollPreventInput } from '../../../hooks/useScrollPreventInput'

/**
 * Universal Input Component
 * Handles text, number, currency, and percentage inputs
 */
const Input = ({
  label,
  value,
  onChange,
  type = 'text',
  placeholder = '',
  icon,
  suffix,
  prefix,
  size = 'md',
  variant = 'default',
  disabled = false,
  error = false,
  errorMessage = '',
  helperText = '',
  hideLabel = false,
  fullWidth = true,
  className = '',
  fieldName,
  min,
  max,
  step,
  preventScrollChange = true,
  ...props
}) => {
  const { formatCurrency, unformatCurrency, shouldFormatAsCurrency, getDisplayValue } = useCurrency()
  const [isFocused, setIsFocused] = useState(false)
  const [displayValue, setDisplayValue] = useState('')

  // Use scroll prevention for number and currency inputs
  const shouldPreventScroll = preventScrollChange && (type === 'number' || type === 'currency')
  const { inputRef, onKeyDown: preventKeyDown } = useScrollPreventInput(!shouldPreventScroll)

  // Initialize display value
  useEffect(() => {
    if (type === 'currency' || shouldFormatAsCurrency(fieldName)) {
      setDisplayValue(getDisplayValue(value, fieldName))
    } else {
      setDisplayValue(value || '')
    }
  }, [value, fieldName, type, getDisplayValue, shouldFormatAsCurrency])

  // Handle input changes
  const handleInputChange = (inputValue) => {
    if (type === 'currency' || shouldFormatAsCurrency(fieldName)) {
      // Remove formatting for storage
      const cleanValue = unformatCurrency(inputValue)
      // Update display value with formatting (no symbol in input)
      setDisplayValue(formatCurrency(cleanValue, { noSymbol: true }))
      // Store clean value
      onChange(cleanValue)
    } else {
      setDisplayValue(inputValue)
      onChange(inputValue)
    }
  }

  const handleKeyDown = (e) => {
    // Prevent 'e', 'E', '+', '-' for number inputs to avoid scientific notation
    if ((type === 'number' || type === 'currency' || shouldFormatAsCurrency(fieldName)) && 
        ['e', 'E', '+', '-'].includes(e.key)) {
      e.preventDefault()
    }
  }

  const handleFocus = () => {
    setIsFocused(true)
    // Update display value when focused
    if (type === 'currency' || shouldFormatAsCurrency(fieldName)) {
      setDisplayValue(getDisplayValue(value, fieldName))
    }
  }

  const handleBlur = () => {
    setIsFocused(false)
    // Ensure proper formatting on blur
    if ((type === 'currency' || shouldFormatAsCurrency(fieldName)) && value) {
      setDisplayValue(formatCurrency(value, { noSymbol: true }))
    }
  }

  // Size classes with consistent heights
  const sizeClasses = {
    sm: 'w-full px-3 py-2 h-10 text-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100',
    md: 'w-full px-4 py-3 h-12 text-base border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100',
    lg: 'w-full px-5 py-4 h-14 text-lg border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
  }

  // Variant classes
  const variantClasses = {
    default: '',
    error: 'border-red-500 focus:border-red-500 focus:ring-red-100',
    success: 'border-green-500 focus:border-green-500 focus:ring-green-100'
  }

  // Determine input type
  const inputType = (type === 'currency' || shouldFormatAsCurrency(fieldName)) ? 'text' : type

  // Combine classes
  const inputClasses = [
    sizeClasses[size],
    variantClasses[error ? 'error' : variant],
    fullWidth ? 'w-full' : '',
    disabled ? 'opacity-50 cursor-not-allowed' : '',
    className
  ].filter(Boolean).join(' ')

  return (
    <div className={`relative ${fullWidth ? 'w-full' : ''}`}>
      {/* Label */}
      {!hideLabel && label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {icon && <span className="mr-2">{icon}</span>}
          {label}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Prefix */}
        {prefix && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
            {prefix}
          </div>
        )}

        {/* Input */}
        <input
          ref={inputRef}
          type={inputType}
          value={displayValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={(e) => {
            handleKeyDown(e)
            if (preventKeyDown) preventKeyDown(e)
          }}
          placeholder={placeholder}
          disabled={disabled}
          min={min}
          max={max}
          step={step}
          className={`${inputClasses} ${prefix ? 'pl-10' : ''} ${suffix ? 'pr-10' : ''}`}
          inputMode={type === 'currency' || type === 'number' ? 'numeric' : 'text'}
          {...props}
        />

        {/* Suffix */}
        {suffix && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
            {suffix}
          </div>
        )}
      </div>

      {/* Helper Text */}
      {helperText && !error && (
        <div className="text-sm text-gray-500 mt-1">{helperText}</div>
      )}

      {/* Error Message */}
      {error && errorMessage && (
        <div className="text-sm text-red-600 mt-1">{errorMessage}</div>
      )}
    </div>
  )
}

export default Input
