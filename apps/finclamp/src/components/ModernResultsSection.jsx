import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Share2, Plus, Download } from 'lucide-react'
import { useCurrency } from '../contexts/CurrencyContext'
import { useViewMode } from '../contexts/ViewModeContext'
import CompactCurrencyDisplay from './CompactCurrencyDisplay'

const ModernResultsSection = ({ 
  title = "Results", 
  icon: IconComponent = TrendingUp, 
  results,
  onShare,
  onAddToComparison,
  onDownload,
  categoryColor = 'blue',
  emptyStateMessage = "Enter details to see results",
  className = "",
  children
}) => {
  const { formatCurrency } = useCurrency()
  const { isMobile } = useViewMode()

  const fadeInUp = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5, delay: 0.2 }
  }

  // Responsive styling based on view mode
  const responsivePadding = isMobile ? 'p-3' : 'p-6'
  const responsiveRounding = isMobile ? 'rounded-lg' : 'rounded-xl'
  const responsiveShadow = isMobile ? 'shadow-md' : 'shadow-lg'

  const hasResults = results && Object.keys(results).length > 0

  return (
    <motion.div
      className={`bg-white ${responsiveRounding} ${responsiveShadow} ${responsivePadding} ${className}`}
      {...fadeInUp}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 bg-${categoryColor}-100 rounded-lg`}>
            <IconComponent className={`w-6 h-6 text-${categoryColor}-600`} />
          </div>
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        </div>
        
        {hasResults && (
          <div className="flex items-center gap-2">
            {onShare && (
              <button
                onClick={onShare}
                className={`flex items-center gap-2 px-3 py-2 text-sm text-${categoryColor}-600 hover:text-${categoryColor}-700 hover:bg-${categoryColor}-50 rounded-lg transition-colors cursor-pointer`}
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            )}
            {onAddToComparison && (
              <button
                onClick={onAddToComparison}
                className={`flex items-center gap-2 px-3 py-2 text-sm text-${categoryColor}-600 hover:text-${categoryColor}-700 hover:bg-${categoryColor}-50 rounded-lg transition-colors cursor-pointer`}
              >
                <Plus className="w-4 h-4" />
                Compare
              </button>
            )}
            {onDownload && (
              <button
                onClick={onDownload}
                className={`flex items-center gap-2 px-3 py-2 text-sm text-${categoryColor}-600 hover:text-${categoryColor}-700 hover:bg-${categoryColor}-50 rounded-lg transition-colors cursor-pointer`}
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            )}
          </div>
        )}
      </div>

      {hasResults ? (
        <div className="space-y-4">
          {children}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className={`w-16 h-16 bg-${categoryColor}-100 rounded-full flex items-center justify-center mx-auto mb-4`}>
            <IconComponent className={`w-8 h-8 text-${categoryColor}-600`} />
          </div>
          <p className="text-gray-500">{emptyStateMessage}</p>
        </div>
      )}
    </motion.div>
  )
}

// Modern Result Card Component
const ModernResultCard = ({ 
  label, 
  value, 
  type = 'currency',
  categoryColor = 'blue',
  highlight = false,
  className = ""
}) => {
  const formatValue = (val, type) => {
    if (type === 'currency') {
      return <CompactCurrencyDisplay value={val} />
    } else if (type === 'percentage') {
      return `${val}%`
    } else if (type === 'number') {
      return val?.toLocaleString()
    }
    return val
  }

  return (
    <div className={`${highlight ? `bg-${categoryColor}-50 border-2 border-${categoryColor}-200` : 'bg-gray-50'} rounded-lg p-4 ${className}`}>
      <div className="text-sm text-gray-600 mb-1">{label}</div>
      <div className={`text-2xl font-bold ${highlight ? `text-${categoryColor}-700` : 'text-gray-900'}`}>
        {formatValue(value, type)}
      </div>
    </div>
  )
}

// Modern Result Grid Component
const ModernResultGrid = ({ 
  results = [],
  categoryColor = 'blue',
  className = ""
}) => {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${className}`}>
      {results.map((result, index) => (
        <ModernResultCard
          key={index}
          label={result.label}
          value={result.value}
          type={result.type}
          categoryColor={categoryColor}
          highlight={result.highlight}
        />
      ))}
    </div>
  )
}

// Modern Summary Card Component
const ModernSummaryCard = ({
  title,
  items = [],
  categoryColor = 'blue',
  className = "",
  size = "normal", // "normal" or "large"
  centered = false, // New prop for centered display without labels
  hideLabels = false // New prop to hide labels
}) => {
  const isLarge = size === "large"

  return (
    <div className={`bg-gradient-to-r from-${categoryColor}-50 to-${categoryColor}-100 rounded-lg ${isLarge ? 'p-8' : 'p-6'} ${className}`}>
      <h3 className={`${isLarge ? 'text-2xl' : 'text-lg'} font-bold text-${categoryColor}-800 mb-${isLarge ? '6' : '4'} ${centered ? 'text-center' : ''}`}>{title}</h3>
      <div className={`${centered ? 'text-center' : `space-y-${isLarge ? '4' : '3'}`}`}>
        {items.map((item, index) => (
          <div key={index} className={centered ? 'flex flex-col items-center' : 'flex justify-between items-center'}>
            {!hideLabels && !centered && (
              <span className={`${isLarge ? 'text-lg' : 'text-base'} text-${categoryColor}-700`}>{item.label}</span>
            )}
            <span className={`${isLarge && centered ? 'text-4xl' : isLarge ? 'text-2xl' : 'text-base'} font-semibold text-${categoryColor}-800`}>
              {item.type === 'currency' ? (
                <CompactCurrencyDisplay value={item.value} />
              ) : item.type === 'percentage' ? `${item.value}%` : item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Modern Progress Bar Component
const ModernProgressBar = ({ 
  label,
  value,
  max,
  categoryColor = 'blue',
  showPercentage = true,
  className = ""
}) => {
  const percentage = Math.min((value / max) * 100, 100)

  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        {showPercentage && (
          <span className="text-sm text-gray-600">{percentage.toFixed(1)}%</span>
        )}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`bg-${categoryColor}-600 h-2 rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

// Export all components
export default ModernResultsSection
export { 
  ModernResultCard, 
  ModernResultGrid, 
  ModernSummaryCard, 
  ModernProgressBar 
}
