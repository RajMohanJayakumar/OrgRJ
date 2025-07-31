import React from 'react'
import { motion } from 'framer-motion'

const ResetButton = ({ 
  onReset, 
  className = "", 
  size = "md", 
  variant = "default",
  disabled = false 
}) => {
  const sizeClasses = {
    sm: "p-1.5 w-7 h-7",
    md: "p-2 w-8 h-8", 
    lg: "p-2.5 w-10 h-10"
  }

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5"
  }

  const variantClasses = {
    default: "text-gray-500 hover:text-gray-700 hover:bg-gray-100",
    primary: "text-blue-500 hover:text-blue-700 hover:bg-blue-50",
    danger: "text-red-500 hover:text-red-700 hover:bg-red-50"
  }

  return (
    <motion.button
      onClick={onReset}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.1 }}
      whileTap={{ scale: disabled ? 1 : 0.9 }}
      className={`
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        transition-all duration-200 rounded-lg
        ${className}
      `}
      title="Reset Calculator"
    >
      <svg 
        className={iconSizes[size]} 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
        />
      </svg>
    </motion.button>
  )
}

export default ResetButton
