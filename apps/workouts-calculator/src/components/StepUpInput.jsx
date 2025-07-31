import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const StepUpInput = ({ 
  label, 
  value, 
  onChange, 
  placeholder = "0", 
  icon,
  className = "",
  stepUpType = "percentage", // "percentage" or "amount"
  onTypeChange
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const stepUpTypes = [
    { value: "percentage", label: "Percentage (%)", symbol: "%" },
    { value: "amount", label: "Fixed Amount", symbol: "₹" }
  ]

  const currentType = stepUpTypes.find(type => type.value === stepUpType) || stepUpTypes[0]

  const handleTypeSelect = (type) => {
    onTypeChange(type.value)
    setIsOpen(false)
  }

  const handleInputChange = (e) => {
    onChange(e.target.value)
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
        {icon && <span className="text-lg">{icon}</span>}
        {label}
      </label>
      
      <div className="relative">
        <input
          type="number"
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          min="0"
          step={stepUpType === "percentage" ? "0.1" : "100"}
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-base sm:text-lg font-medium border-2 border-gray-200 rounded-xl
                   focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none
                   transition-all duration-200 bg-white pr-20 sm:pr-24"
        />
        
        <div className="absolute right-1.5 sm:right-2 top-1/2 transform -translate-y-1/2">
          <motion.button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <span className="font-medium text-gray-700 text-sm sm:text-base">{currentType.symbol}</span>
            <svg
              className={`w-2.5 h-2.5 sm:w-3 sm:h-3 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.button>
        </div>
        
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full right-0 mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-lg z-50 min-w-48"
            >
              {stepUpTypes.map((type, index) => (
                <motion.button
                  key={index}
                  type="button"
                  onClick={() => handleTypeSelect(type)}
                  whileHover={{ backgroundColor: '#f3f4f6' }}
                  className={`
                    w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors 
                    border-b border-gray-100 last:border-b-0
                    ${type.value === stepUpType ? 'bg-blue-50 text-blue-700' : ''}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{type.label}</span>
                    <span className="text-gray-500">{type.symbol}</span>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default StepUpInput
