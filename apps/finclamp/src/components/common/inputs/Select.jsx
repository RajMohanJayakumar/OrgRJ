import React from 'react'
import { ChevronDown } from 'lucide-react'

/**
 * Universal Select Component
 */
const Select = ({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  icon,
  size = 'md',
  variant = 'default',
  disabled = false,
  error = false,
  errorMessage = '',
  helperText = '',
  hideLabel = false,
  fullWidth = true,
  className = '',
  ...props
}) => {
  // Size classes
  const sizeClasses = {
    sm: 'input-base input-sm',
    md: 'input-base',
    lg: 'input-base input-lg'
  }

  // Variant classes
  const variantClasses = {
    default: '',
    error: 'input-error',
    success: 'input-success'
  }

  // Combine classes
  const selectClasses = [
    sizeClasses[size],
    variantClasses[error ? 'error' : variant],
    'appearance-none cursor-pointer pr-10',
    fullWidth ? 'w-full' : '',
    disabled ? 'opacity-50 cursor-not-allowed' : '',
    className
  ].filter(Boolean).join(' ')

  return (
    <div className={`input-group ${fullWidth ? 'w-full' : ''}`}>
      {/* Label */}
      {!hideLabel && label && (
        <label className="input-label">
          {icon && <span className="mr-2">{icon}</span>}
          {label}
        </label>
      )}

      {/* Select Container */}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={selectClasses}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Dropdown Icon */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </div>
      </div>

      {/* Helper Text */}
      {helperText && !error && (
        <div className="input-helper">{helperText}</div>
      )}

      {/* Error Message */}
      {error && errorMessage && (
        <div className="input-error-text">{errorMessage}</div>
      )}
    </div>
  )
}

export default Select
