import React from 'react'

const LoadingSpinner = ({ size = 'medium', color = 'currentColor' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  }

  return (
    <div className="flex items-center justify-center">
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-gray-300 border-t-2`}
        style={{ borderTopColor: color }}
      />
    </div>
  )
}

export default LoadingSpinner
