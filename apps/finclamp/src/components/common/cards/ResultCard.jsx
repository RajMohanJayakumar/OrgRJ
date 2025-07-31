import React from 'react'
import { useCurrency } from '../../../contexts/CurrencyContext'
import CompactCurrencyDisplay from '../../CompactCurrencyDisplay'
import Card from './Card'

/**
 * Result Card Component for displaying calculation results
 */
const ResultCard = ({
  label,
  title, // Support both label and title for backward compatibility
  value,
  icon,
  description,
  type = 'text',
  color = 'blue',
  size = 'normal',
  highlight = false,
  className = ''
}) => {
  const { formatCurrency } = useCurrency()
  
  const displayTitle = title || label
  
  // Format value based on type
  const formatValue = (val, valueType) => {
    if (!val && val !== 0) return '-'

    switch (valueType) {
      case 'currency':
        return <CompactCurrencyDisplay value={val} />
      case 'percentage':
        return `${val}%`
      case 'number':
        return typeof val === 'number' ? val.toLocaleString() : val
      default:
        return val
    }
  }
  
  // Color classes
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
    red: 'bg-red-50 text-red-600 border-red-200',
    gray: 'bg-gray-50 text-gray-600 border-gray-200'
  }
  
  // Text sizes
  const textSizes = {
    small: 'text-lg',
    normal: 'text-2xl',
    large: 'text-4xl'
  }
  
  const cardVariant = highlight ? 'result' : 'default'
  const cardClasses = highlight ? colorClasses[color] : 'bg-gray-50'
  
  return (
    <Card 
      variant={cardVariant}
      size="sm"
      className={`${cardClasses} ${className}`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-gray-600">{displayTitle}</div>
        {icon && <span className="text-lg">{icon}</span>}
      </div>
      
      <div className={`${textSizes[size]} font-bold ${highlight ? `text-${color}-700` : 'text-gray-900'}`}>
        {formatValue(value, type)}
      </div>
      
      {description && (
        <div className="text-xs text-gray-500 mt-1">{description}</div>
      )}
    </Card>
  )
}

export default ResultCard
