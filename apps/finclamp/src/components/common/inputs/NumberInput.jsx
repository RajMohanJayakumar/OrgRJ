import { motion } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'
import { useCurrency } from '../../../contexts/CurrencyContext'
import { useViewMode } from '../../../contexts/ViewModeContext'

/**
 * Number Input with increment/decrement controls
 * Uses text input with number validation for better control
 */
const NumberInput = ({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  showControls = true,
  disabled = false,
  className = '',
  placeholder = '',
  prefix = '',
  suffix = '',
  allowDecimals = false, // New prop to control decimal increments
  allowNegative = false, // New prop to control negative values
  enforceMinMax = false, // New prop to enforce min/max boundaries
  dropdown = null, // New prop for dropdown options { value, onChange, options: [{value, label}] }
  id, // Add id prop for accessibility
  ...props
}) => {
  // Generate unique ID for accessibility if not provided
  const inputId = id || `number-input-${Math.random().toString(36).substr(2, 9)}`

  // Ensure numeric values for calculations
  const numericStep = parseFloat(step) || 1
  const numericMin = parseFloat(min) || 0
  const numericMax = parseFloat(max) || 100
  const { currentFormat } = useCurrency()
  const { isMobile } = useViewMode()

  // Handle keyboard events for arrow keys
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      handleIncrement()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      handleDecrement()
    }
  }

  // Handle text input with minimal validation (like native number input)
  const handleInputChange = (e) => {
    const inputValue = e.target.value

    // Allow empty string
    if (inputValue === '') {
      onChange('')
      return
    }

    // Remove non-numeric characters based on props
    let allowedChars = '[^0-9'
    if (allowDecimals) allowedChars += '.'
    if (allowNegative) allowedChars += '-'
    allowedChars += ']'

    let numericValue = inputValue.replace(new RegExp(allowedChars, 'g'), '')

    // Handle leading zeros - remove them unless it's just "0" or "0."
    if (numericValue.length > 1 && numericValue.startsWith('0') && !numericValue.startsWith('0.')) {
      numericValue = numericValue.replace(/^0+/, '') || '0'
    }

    // Handle negative leading zeros
    if (allowNegative && numericValue.startsWith('-0') && numericValue.length > 2 && !numericValue.startsWith('-0.')) {
      numericValue = '-' + (numericValue.substring(2).replace(/^0+/, '') || '0')
    }

    if (!allowDecimals) {
      // For integer-only inputs
      let cleanValue = numericValue

      // Handle negative signs if allowed
      if (allowNegative && cleanValue.includes('-')) {
        const negativeCount = (cleanValue.match(/-/g) || []).length
        if (negativeCount > 1 || cleanValue.indexOf('-') !== 0) {
          cleanValue = cleanValue.replace(/-/g, '')
          if (numericValue.startsWith('-')) {
            cleanValue = '-' + cleanValue
          }
        }
      }

      // Enforce min/max if enabled
      if (enforceMinMax && cleanValue !== '' && cleanValue !== '-') {
        const numValue = parseInt(cleanValue) || 0
        if (numValue > numericMax || numValue < numericMin) {
          return // Don't update if outside bounds
        }
      }

      onChange(cleanValue)
      return
    }

    // For decimal inputs - ensure only one decimal point and one negative sign
    let cleanValue = numericValue

    // Handle multiple decimal points
    const parts = numericValue.split('.')
    if (parts.length > 2) {
      cleanValue = parts[0] + '.' + parts.slice(1).join('')
    }

    // Handle multiple negative signs - only allow at the beginning
    if (allowNegative && cleanValue.includes('-')) {
      const negativeCount = (cleanValue.match(/-/g) || []).length
      if (negativeCount > 1 || cleanValue.indexOf('-') !== 0) {
        cleanValue = cleanValue.replace(/-/g, '')
        if (numericValue.startsWith('-')) {
          cleanValue = '-' + cleanValue
        }
      }
    }

    // Enforce min/max if enabled
    if (enforceMinMax && cleanValue !== '' && cleanValue !== '-') {
      const numValue = parseFloat(cleanValue)
      if (!isNaN(numValue) && (numValue > numericMax || numValue < numericMin)) {
        return // Don't update if outside bounds
      }
    }

    onChange(cleanValue)
  }

  const handleIncrement = () => {
    const currentValue = parseFloat(value) || 0
    let newValue = currentValue + numericStep

    // Enforce max if enabled
    if (enforceMinMax) {
      newValue = Math.min(newValue, numericMax)
    }

    // Format based on allowDecimals prop and step value
    let formattedValue
    if (allowDecimals && (numericStep < 1 || newValue % 1 !== 0)) {
      formattedValue = newValue.toFixed(2)
    } else {
      formattedValue = Math.round(newValue).toString()
    }

    onChange(formattedValue)
  }

  const handleDecrement = () => {
    const currentValue = parseFloat(value) || 0
    let newValue = currentValue - numericStep

    // Enforce min if enabled
    if (enforceMinMax) {
      newValue = Math.max(newValue, numericMin)
    }

    // Format based on allowDecimals prop and step value
    let formattedValue
    if (allowDecimals && (numericStep < 1 || newValue % 1 !== 0)) {
      formattedValue = newValue.toFixed(2)
    } else {
      formattedValue = Math.round(newValue).toString()
    }

    onChange(formattedValue)
  }

  // Use currency symbol as prefix if type is currency
  const displayPrefix = prefix || (props.type === 'currency' ? currentFormat.symbol : '')

  // Mobile-responsive styling
  const mobileInputClass = isMobile ? 'mobile-space-y-2' : 'space-y-2'
  const mobileInputPadding = isMobile ? 'py-3 px-4' : 'py-2 px-4'
  const mobileFontSize = isMobile ? 'text-base' : 'text-sm'
  const mobileMinHeight = isMobile ? 'min-h-[44px]' : ''
  const mobileBorderRadius = isMobile ? 'rounded-xl' : 'rounded-xl'

  if (!showControls) {
    return (
      <div className={`input-group ${mobileInputClass}`}>
        {label && (
          <label htmlFor={inputId} className="input-label">{label}</label>
        )}
        <div className="relative">
          {displayPrefix && !isMobile && (
            <span className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none text-sm font-medium`}>
              {displayPrefix}
            </span>
          )}
          <input
            id={inputId}
            type="text"
            inputMode="numeric"
            pattern={allowDecimals ? "[0-9]*\\.?[0-9]*" : "[0-9]*"}
            value={value}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={placeholder}
            className={`w-full ${displayPrefix && !isMobile ? 'pl-10' : 'pl-4'} ${suffix || dropdown ? 'pr-20' : 'pr-4'} ${mobileInputPadding} ${mobileFontSize} ${mobileMinHeight} font-medium border-2 border-gray-300 ${mobileBorderRadius} transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 ${className}`}
            {...props}
          />
          {/* Integrated Right Section for simple input */}
          {(suffix || dropdown) && (
            <div className={`absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center bg-gray-50 rounded-lg border border-gray-200 overflow-hidden z-20 ${isMobile ? 'h-8' : 'h-6'}`}>
              {/* Suffix */}
              {suffix && !dropdown && (
                <span className={`px-2 py-1 ${isMobile ? 'text-sm' : 'text-xs'} text-gray-500 bg-gray-50`}>
                  {suffix}
                </span>
              )}

              {/* Dropdown */}
              {dropdown && (
                <select
                  value={dropdown.value}
                  onChange={(e) => dropdown.onChange(e.target.value)}
                  className={`px-2 py-1 ${isMobile ? 'text-sm' : 'text-xs'} bg-gray-50 border-none outline-none text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors ${isMobile ? 'min-h-[32px]' : ''}`}
                >
                  {dropdown.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={`input-group ${mobileInputClass}`}>
      {label && (
        <label htmlFor={inputId} className="input-label">{label}</label>
      )}

      <div className="relative">
        {/* Prefix (currency symbol, etc.) - Hidden on mobile */}
        {displayPrefix && !isMobile && (
          <span className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none z-10 text-sm font-medium`}>
            {displayPrefix}
          </span>
        )}

        {/* Text input with number validation */}
        <input
          id={inputId}
          type="text"
          inputMode="numeric"
          pattern={allowDecimals ? "[0-9]*\\.?[0-9]*" : "[0-9]*"}
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={placeholder}
          className={`w-full ${displayPrefix && !isMobile ? 'pl-10' : 'pl-4'} ${dropdown ? (isMobile ? 'pr-28' : 'pr-24') : (isMobile ? 'pr-24' : 'pr-20')} ${mobileInputPadding} ${mobileFontSize} ${mobileMinHeight} font-medium border-2 border-gray-300 ${mobileBorderRadius} transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 relative z-10 ${className}`}
          {...props}
        />

        {/* Integrated Right Section - Dropdown + Controls */}
        <div className={`absolute right-1 top-1/2 transform -translate-y-1/2 flex items-center bg-gray-50 rounded-lg border border-gray-200 overflow-hidden z-20 ${isMobile ? 'h-9' : 'h-7'}`}>
          {/* Suffix */}
          {suffix && !dropdown && (
            <span className={`px-2 ${isMobile ? 'text-sm' : 'text-xs'} text-gray-500 bg-gray-50`}>
              {suffix}
            </span>
          )}

          {/* Dropdown */}
          {dropdown && (
            <select
              value={dropdown.value}
              onChange={(e) => dropdown.onChange(e.target.value)}
              className={`px-2 py-1 ${isMobile ? 'text-sm' : 'text-xs'} bg-gray-50 border-none outline-none text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors ${isMobile ? 'min-h-[36px]' : ''}`}
            >
              {dropdown.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}

          {/* Separator */}
          {(suffix || dropdown) && (
            <div className={`w-px ${isMobile ? 'h-5' : 'h-4'} bg-gray-300`}></div>
          )}

          {/* Control Buttons */}
          <motion.button
            type="button"
            onClick={handleDecrement}
            disabled={disabled || (enforceMinMax && parseFloat(value) <= numericMin)}
            whileHover={{ backgroundColor: '#e5e7eb' }}
            whileTap={{ scale: 0.95 }}
            className={`${isMobile ? 'w-9 h-8' : 'w-7 h-6'} bg-gray-50 text-gray-600 flex items-center justify-center ${isMobile ? 'text-sm' : 'text-xs'} hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-r border-gray-300 ${isMobile ? 'touch-target' : ''}`}
          >
            <Minus className={`${isMobile ? 'w-4 h-4' : 'w-3 h-3'}`} />
          </motion.button>
          <motion.button
            type="button"
            onClick={handleIncrement}
            disabled={disabled || (enforceMinMax && parseFloat(value) >= numericMax)}
            whileHover={{ backgroundColor: '#e5e7eb' }}
            whileTap={{ scale: 0.95 }}
            className={`${isMobile ? 'w-9 h-8' : 'w-7 h-6'} bg-gray-50 text-gray-600 flex items-center justify-center ${isMobile ? 'text-sm' : 'text-xs'} hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isMobile ? 'touch-target' : ''}`}
          >
            <Plus className={`${isMobile ? 'w-4 h-4' : 'w-3 h-3'}`} />
          </motion.button>
        </div>
      </div>
    </div>
  )
}

export default NumberInput
