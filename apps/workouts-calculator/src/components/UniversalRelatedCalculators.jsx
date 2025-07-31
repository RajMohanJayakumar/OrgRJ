import React, { memo } from 'react'
import RelatedCalculators from './RelatedCalculators'

/**
 * Universal wrapper for RelatedCalculators that can be easily added to any calculator
 * This component handles the conditional rendering and provides consistent spacing
 * Memoized to prevent re-rendering on input changes - only updates when calculator changes
 */
const UniversalRelatedCalculators = memo(({
  currentCalculatorId,
  calculatorData,
  onCalculatorSelect,
  className = "mt-8"
}) => {
  // Only render if all required props are provided
  if (!currentCalculatorId || !calculatorData || !onCalculatorSelect) {
    return null
  }

  return (
    <div className={className}>
      <RelatedCalculators
        currentCalculatorId={currentCalculatorId}
        calculatorData={calculatorData}
        onCalculatorSelect={onCalculatorSelect}
      />
    </div>
  )
})

UniversalRelatedCalculators.displayName = 'UniversalRelatedCalculators'

export default UniversalRelatedCalculators
