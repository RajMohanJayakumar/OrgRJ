import { motion } from 'framer-motion'
import { useCurrency } from '../contexts/CurrencyContext'
import { useViewMode } from '../contexts/ViewModeContext'
import CompactCurrencyDisplay from './CompactCurrencyDisplay'
import RelatedCalculators from './RelatedCalculators'
import ResetButton from './ResetButton'
import CalculatorSchema from './CalculatorSchema'

const CalculatorLayout = ({
  title,
  description,
  icon,
  children,
  results,
  onShare,
  onAddToComparison,
  onReset,
  className = "",
  currentCalculatorId,
  calculatorData,
  onCalculatorSelect,
  inputs = {}
}) => {
  const { formatCurrency } = useCurrency()
  const { isMobile } = useViewMode()

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  }

  // Use nearly full width on mobile, standard max-width on desktop
  const containerClass = isMobile
    ? `max-w-full px-1 py-3 space-y-3 calculator-main-container ${className}`
    : `max-w-7xl mx-auto p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 ${className}`

  return (
    <div className={containerClass}>
      {/* SEO Schema */}
      <CalculatorSchema
        calculatorId={currentCalculatorId}
        inputs={inputs}
        results={results}
      />

      {/* Header */}
      <motion.div
        className="text-center"
        {...fadeInUp}
      >
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
          {icon && <span className="text-3xl sm:text-4xl lg:text-5xl">{icon}</span>}
          {title}
        </h1>
        {description && <p className="text-sm sm:text-base text-gray-600 px-4">{description}</p>}
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {children}
      </div>

      {/* Related Calculators */}
      {currentCalculatorId && calculatorData && onCalculatorSelect && (
        <RelatedCalculators
          currentCalculatorId={currentCalculatorId}
          calculatorData={calculatorData}
          onCalculatorSelect={onCalculatorSelect}
        />
      )}
    </div>
  )
}

// Input Section Component
export const InputSection = ({ title, icon, children, onReset }) => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  }

  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg p-4 sm:p-6"
      {...fadeInUp}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center">
          {icon && <span className="mr-2 text-lg sm:text-xl">{icon}</span>}
          {title}
        </h2>
        {onReset && (
          <ResetButton onReset={onReset} size="md" variant="default" />
        )}
      </div>
      <div className="space-y-3 sm:space-y-4">
        {children}
      </div>
    </motion.div>
  )
}

// Results Section Component
export const ResultsSection = ({ 
  title = "Results", 
  icon = "📈", 
  results, 
  onShare, 
  onAddToComparison,
  children,
  emptyStateMessage = "Enter details to see results"
}) => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  }

  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg p-4 sm:p-6"
      {...fadeInUp}
    >
      <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 flex items-center">
        {icon && <span className="mr-2 text-lg sm:text-xl">{icon}</span>}
        {title}
      </h2>

      {results ? (
        <div className="space-y-3 sm:space-y-4">
          {children}

          {/* Action Buttons */}
          {(onShare || onAddToComparison) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
              {onAddToComparison && (
                <motion.button
                  onClick={onAddToComparison}
                  className="w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 cursor-pointer text-sm"
                  style={{ backgroundColor: '#10B981' }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  📊 Compare
                </motion.button>
              )}

              {onShare && (
                <motion.button
                  onClick={onShare}
                  className="w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 cursor-pointer text-sm"
                  style={{ backgroundColor: '#6366F1' }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  🔗 Share
                </motion.button>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">📊</div>
          <p className="text-gray-500">{emptyStateMessage}</p>
        </div>
      )}
    </motion.div>
  )
}

// Result Card Component
export const ResultCard = ({
  label,
  title, // Support both label and title for backward compatibility
  value,
  icon,
  description,
  color = 'blue',
  size = 'normal',
  className = ""
}) => {
  const { formatCurrency } = useCurrency()

  const displayTitle = title || label

  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
    red: 'bg-red-50 text-red-600 border-red-200',
    gray: 'bg-gray-50 text-gray-600 border-gray-200'
  }

  const textSizes = {
    small: 'text-lg',
    normal: 'text-2xl',
    large: 'text-4xl'
  }

  return (
    <div className={`p-6 rounded-lg border ${colorClasses[color]} ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium opacity-80">{displayTitle}</p>
        {icon && <span className="text-lg">{icon}</span>}
      </div>
      <p className={`font-bold ${textSizes[size]} ${colorClasses[color].split(' ')[1]} mb-2`}>
        {typeof value === 'number' ? <CompactCurrencyDisplay value={value} /> : value}
      </p>
      {description && (
        <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
      )}
    </div>
  )
}

// Gradient Result Card for main results
export const GradientResultCard = ({
  label,
  title, // Support both label and title for backward compatibility
  value,
  icon,
  gradient = "from-green-500 to-blue-600"
}) => {
  const displayTitle = title || label

  return (
    <div className={`bg-gradient-to-r ${gradient} p-6 rounded-lg text-white text-center`}>
      <div className="flex items-center justify-center mb-2">
        {icon && <span className="text-2xl mr-2">{icon}</span>}
        <p className="text-lg font-medium opacity-90">{displayTitle}</p>
      </div>
      <p className="text-4xl font-bold">
        {typeof value === 'number' ? <CompactCurrencyDisplay value={value} /> : value}
      </p>
    </div>
  )
}

export default CalculatorLayout
