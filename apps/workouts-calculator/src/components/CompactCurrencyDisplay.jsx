import { useState } from 'react'
import { useCurrency } from '../contexts/CurrencyContext'

const CompactCurrencyDisplay = ({
  value,
  className = "",
  showTooltip = true,
  compactThreshold = null // Will be auto-determined based on currency
}) => {
  const { formatCurrency, currentFormat } = useCurrency()
  const [showFullAmount, setShowFullAmount] = useState(false)

  if (!value || value === 0) {
    return <span className={className}>{currentFormat.symbol}0</span>
  }

  const numericValue = typeof value === 'string' ? parseFloat(value) : value

  // Determine threshold based on currency if not provided
  const threshold = compactThreshold || (currentFormat.code === 'INR' ? 1000000000 : 10000000) // 100 crores or 10 million

  // If value is below threshold, show normal format
  if (numericValue < threshold) {
    return <span className={className}>{formatCurrency(numericValue)}</span>
  }

  // Format compact display based on currency format
  const getCompactFormat = (amount) => {
    if (currentFormat.code === 'INR') {
      // Indian format: use Cr for crores, L for lakhs
      if (amount >= 10000000000) { // 1000 crores (10 billion)
        const thousandCrores = amount / 10000000000
        return `₹${thousandCrores.toFixed(thousandCrores >= 100 ? 0 : 1)}KCr`
      } else if (amount >= 10000000) { // 1 crore
        const crores = amount / 10000000
        return `₹${crores.toFixed(crores >= 100 ? 0 : 1)}Cr`
      } else if (amount >= 100000) { // 1 lakh
        const lakhs = amount / 100000
        return `₹${lakhs.toFixed(lakhs >= 100 ? 0 : 1)}L`
      }
    } else {
      // International format: use B for billions, M for millions, K for thousands
      if (amount >= 1000000000) { // 1 billion
        const billions = amount / 1000000000
        return `${currentFormat.symbol}${billions.toFixed(billions >= 100 ? 0 : 1)}B`
      } else if (amount >= 1000000) { // 1 million
        const millions = amount / 1000000
        return `${currentFormat.symbol}${millions.toFixed(millions >= 100 ? 0 : 1)}M`
      } else if (amount >= 1000) { // 1 thousand
        const thousands = amount / 1000
        return `${currentFormat.symbol}${thousands.toFixed(thousands >= 100 ? 0 : 1)}K`
      }
    }
    return formatCurrency(amount)
  }

  const compactDisplay = getCompactFormat(numericValue)
  const fullDisplay = formatCurrency(numericValue)

  if (!showTooltip) {
    return <span className={className}>{compactDisplay}</span>
  }

  return (
    <div className="relative inline-block">
      <span 
        className={`${className} cursor-help`}
        onMouseEnter={() => setShowFullAmount(true)}
        onMouseLeave={() => setShowFullAmount(false)}
      >
        {compactDisplay}
      </span>
      
      {showFullAmount && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg whitespace-nowrap z-50">
          {fullDisplay}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  )
}

export default CompactCurrencyDisplay
