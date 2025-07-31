import React from 'react'
import { motion } from 'framer-motion'
import { IconButton } from '../buttons'
import { RotateCcw } from 'lucide-react'

/**
 * Universal Section Component for organizing content
 */
const Section = ({
  title,
  icon: IconComponent,
  children,
  onReset,
  color = 'blue',
  spacing = 'md',
  className = ''
}) => {
  // Spacing classes
  const spacingClasses = {
    sm: 'space-y-4',
    md: 'space-y-6',
    lg: 'space-y-8'
  }

  // Color classes for icon background
  const iconColorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
    red: 'bg-red-100 text-red-600',
    gray: 'bg-gray-100 text-gray-600'
  }

  return (
    <motion.div
      className={`bg-white rounded-xl shadow-md border border-gray-200 p-6 ${className}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {IconComponent && (
            <div className={`p-2 rounded-lg ${iconColorClasses[color]}`}>
              <IconComponent className="w-6 h-6" />
            </div>
          )}
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        </div>

        {onReset && (
          <IconButton
            icon={<RotateCcw />}
            onClick={onReset}
            title="Reset"
            variant="ghost"
            size="md"
          />
        )}
      </div>

      {/* Section Content */}
      <div className={spacingClasses[spacing]}>
        {children}
      </div>
    </motion.div>
  )
}

export default Section
