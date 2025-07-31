import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const CustomDropdown = ({
  label,
  value,
  onChange,
  options,
  icon,
  placeholder = "Select an option",
  focusColor = "#6366F1",
  disabled = false,
  className = "",
  error = null,
  helperText = null
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
        setIsFocused(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedOption = options.find(option => option.value === value)

  const handleSelect = (optionValue) => {
    onChange(optionValue)
    setIsOpen(false)
    setIsFocused(false)
  }

  const dropdownVariants = {
    hidden: {
      opacity: 0,
      y: -10,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: {
        duration: 0.15
      }
    }
  }

  const optionVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.2
      }
    })
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Label */}
      <label className="block text-sm font-semibold mb-2 text-gray-700">
        {icon && <span className="mr-2">{icon}</span>}
        {label}
      </label>

      {/* Dropdown Button */}
      <button
        type="button"
        disabled={disabled}
        className={`w-full px-4 py-3 text-left text-base font-semibold bg-white border rounded-xl transition-all duration-300 focus:outline-none shadow-sm relative ${
          disabled
            ? 'bg-gray-50 text-gray-400 cursor-not-allowed border-gray-200'
            : isFocused || isOpen
            ? `border-2 ring-4 cursor-pointer`
            : 'border border-gray-200 hover:border-gray-300 cursor-pointer'
        } ${error ? 'border-red-300' : ''}`}
        style={{
          borderColor: error ? '#FCA5A5' : (isFocused || isOpen ? focusColor : undefined),
          ringColor: error ? '#FEE2E2' : (isFocused || isOpen ? `${focusColor}20` : undefined)
        }}
        onClick={() => {
          if (!disabled) {
            const newIsOpen = !isOpen
            setIsOpen(newIsOpen)
            setIsFocused(newIsOpen)
          }
        }}
      >
        <div className="flex items-center justify-between">
          <span className={selectedOption ? 'text-gray-900' : 'text-gray-500'}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <motion.svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </motion.svg>
        </div>
      </button>

      {/* Dropdown Options */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden"
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="py-2">
              {options.map((option, index) => (
                <motion.button
                  key={option.value}
                  type="button"
                  className={`w-full px-4 py-3 text-left text-base font-medium transition-all duration-200 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 cursor-pointer ${
                    value === option.value
                      ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-500'
                      : 'text-gray-700'
                  }`}
                  onClick={() => handleSelect(option.value)}
                  variants={optionVariants}
                  initial="hidden"
                  animate="visible"
                  custom={index}
                  whileHover={{ 
                    backgroundColor: value === option.value ? '#dbeafe' : '#f9fafb',
                    x: 4
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center">
                    {option.icon && <span className="mr-3 text-lg">{option.icon}</span>}
                    <span>{option.label}</span>
                    {value === option.value && (
                      <motion.svg
                        className="w-5 h-5 ml-auto text-blue-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </motion.svg>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      {error && (
        <motion.p
          className="mt-2 text-sm text-red-600"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {error}
        </motion.p>
      )}

      {/* Helper Text */}
      {helperText && !error && (
        <p className="mt-2 text-sm text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  )
}

export default CustomDropdown
