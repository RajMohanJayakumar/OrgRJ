import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useViewMode } from '../../../contexts/ViewModeContext'

/**
 * Select Input component that matches NumberInput styling exactly
 * Provides consistent height and border styling across the application
 */
const SelectInput = ({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Select option',
  disabled = false,
  className = '',
  icon,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const dropdownRef = useRef(null)
  const { isMobile } = useViewMode()

  // Generate unique ID for accessibility
  const inputId = `select-input-${Math.random().toString(36).substr(2, 9)}`

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
        setIsFocused(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Handle option selection
  const handleSelectOption = (optionValue) => {
    onChange(optionValue)
    setIsOpen(false)
    setIsFocused(false)
  }

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (disabled) return

    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault()
        setIsOpen(!isOpen)
        setIsFocused(!isOpen)
        break
      case 'Escape':
        setIsOpen(false)
        setIsFocused(false)
        break
      case 'ArrowDown':
        e.preventDefault()
        if (!isOpen) {
          setIsOpen(true)
          setIsFocused(true)
        }
        break
      case 'ArrowUp':
        e.preventDefault()
        if (!isOpen) {
          setIsOpen(true)
          setIsFocused(true)
        }
        break
    }
  }

  // Get selected option for display
  const selectedOption = options.find(option => option.value === value)

  // Mobile-responsive styling to match NumberInput exactly
  const mobileInputPadding = isMobile ? 'py-3 px-4' : 'py-2 px-4'
  const mobileFontSize = isMobile ? 'text-base' : 'text-sm'
  const mobileMinHeight = isMobile ? 'min-h-[44px]' : ''
  const mobileBorderRadius = isMobile ? 'rounded-xl' : 'rounded-xl'

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="flex items-center gap-2 text-sm font-medium text-gray-700">
          {icon && <span className="text-lg">{icon}</span>}
          {label}
        </label>
      )}
      
      <div className="relative" ref={dropdownRef}>
        <button
          id={inputId}
          type="button"
          disabled={disabled}
          onKeyDown={handleKeyDown}
          className={`w-full ${mobileInputPadding} ${mobileFontSize} ${mobileMinHeight} font-medium border-2 border-gray-300 ${mobileBorderRadius} transition-all duration-300 focus:outline-none text-left flex items-center justify-between cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 ${
            disabled ? 'cursor-not-allowed bg-gray-50 text-gray-500' : 'bg-white'
          } ${isFocused || isOpen ? 'border-blue-500 ring-2 ring-blue-500' : ''}`}
          onClick={() => {
            if (!disabled) {
              const newIsOpen = !isOpen
              setIsOpen(newIsOpen)
              setIsFocused(newIsOpen)
            }
          }}
          {...props}
        >
          <span
            className={`${selectedOption ? 'text-gray-900' : 'text-gray-500'} truncate pr-2`}
            title={selectedOption ? selectedOption.label : placeholder}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </motion.div>
        </button>

        {/* Dropdown Options */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-lg overflow-hidden"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 ${
                    option.value === value ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
                  }`}
                  onClick={() => handleSelectOption(option.value)}
                >
                  {option.icon && (
                    <span className="text-lg flex-shrink-0">
                      {React.isValidElement(option.icon) ? option.icon : <option.icon />}
                    </span>
                  )}
                  <span className="truncate">{option.label}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default SelectInput
