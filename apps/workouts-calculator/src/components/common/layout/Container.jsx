import React from 'react'
import { useViewMode } from '../../../contexts/ViewModeContext'

/**
 * Universal Container Component for consistent layouts
 */
const Container = ({
  children,
  size = 'md',
  spacing = 'md',
  className = ''
}) => {
  const { isMobile } = useViewMode()

  // Size classes - nearly full width on mobile
  const sizeClasses = {
    sm: isMobile ? 'max-w-full px-1' : 'max-w-2xl mx-auto px-4',
    md: isMobile ? 'max-w-full px-1' : 'max-w-4xl mx-auto px-6',
    lg: isMobile ? 'max-w-full px-1' : 'max-w-6xl mx-auto px-8'
  }

  // Spacing classes
  const spacingClasses = {
    sm: 'space-y-4',
    md: 'space-y-6',
    lg: 'space-y-8'
  }

  // Combine classes
  const containerClasses = [
    sizeClasses[size],
    spacingClasses[spacing],
    className
  ].filter(Boolean).join(' ')
  
  return (
    <div className={containerClasses}>
      {children}
    </div>
  )
}

export default Container
