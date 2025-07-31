import React from 'react'
import { motion } from 'framer-motion'

/**
 * Icon Button Component
 * For buttons that only contain an icon
 */
const IconButton = ({
  icon,
  variant = 'ghost',
  size = 'md',
  disabled = false,
  className = '',
  onClick,
  title,
  ...props
}) => {
  // Base classes
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

  // Variant classes
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    warning: 'bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500',
    error: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    outline: 'border-2 border-blue-600 text-blue-600 bg-transparent hover:bg-blue-50 focus:ring-blue-500',
    ghost: 'bg-transparent hover:bg-gray-100 focus:ring-gray-500'
  }

  // Size classes for icons
  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  // Button size classes
  const buttonSizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3'
  }

  // Combine classes
  const buttonClasses = [
    baseClasses,
    variantClasses[variant],
    buttonSizeClasses[size],
    className
  ].filter(Boolean).join(' ')
  
  return (
    <motion.button
      type="button"
      className={buttonClasses}
      disabled={disabled}
      onClick={onClick}
      title={title}
      whileHover={!disabled ? { scale: 1.1 } : {}}
      whileTap={!disabled ? { scale: 0.9 } : {}}
      transition={{ duration: 0.1 }}
      {...props}
    >
      {React.cloneElement(icon, {
        className: iconSizeClasses[size]
      })}
    </motion.button>
  )
}

export default IconButton
