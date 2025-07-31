import React from 'react'
import ResetButton from '../components/ResetButton'

/**
 * Universal hook for consistent reset button across all calculators
 * Returns a standardized reset button component
 */
export const useResetButton = (onReset, options = {}) => {
  const {
    size = "md",
    variant = "default",
    className = "",
    disabled = false,
    position = "inline" // "inline", "absolute-top-right", "floating"
  } = options

  const getPositionClasses = () => {
    switch (position) {
      case "absolute-top-right":
        return "absolute top-4 right-4 z-10"
      case "floating":
        return "fixed top-20 right-6 z-50"
      case "inline":
      default:
        return ""
    }
  }

  const ResetButtonComponent = () => (
    <div className={getPositionClasses()}>
      <ResetButton
        onReset={onReset}
        size={size}
        variant={variant}
        className={className}
        disabled={disabled}
      />
    </div>
  )

  return ResetButtonComponent
}

export default useResetButton
