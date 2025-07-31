import React from 'react'
import { motion } from 'framer-motion'

/**
 * Universal Card Component
 */
const Card = ({
  children,
  variant = 'default',
  size = 'md',
  hover = false,
  className = '',
  ...props
}) => {
  // Base classes
  const baseClasses = 'bg-white rounded-xl shadow-md border border-gray-200'

  // Variant classes
  const variantClasses = {
    default: '',
    gradient: 'bg-gradient-to-br from-white to-gray-50',
    result: 'border-l-4 border-blue-500 bg-gradient-to-r from-blue-50 to-blue-100',
    success: 'border-l-4 border-green-500 bg-gradient-to-r from-green-50 to-green-100',
    warning: 'border-l-4 border-yellow-500 bg-gradient-to-r from-yellow-50 to-yellow-100'
  }

  // Size classes
  const sizeClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }

  // Hover effect
  const hoverClasses = hover ? 'transition-all duration-300 hover:shadow-lg hover:-translate-y-1' : ''

  // Combine classes
  const cardClasses = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    hoverClasses,
    className
  ].filter(Boolean).join(' ')
  
  const MotionCard = motion.div
  
  return (
    <MotionCard
      className={cardClasses}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {children}
    </MotionCard>
  )
}

export default Card
