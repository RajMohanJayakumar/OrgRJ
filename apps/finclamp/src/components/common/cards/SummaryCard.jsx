import React from 'react'
import { useCurrency } from '../../../contexts/CurrencyContext'
import CompactCurrencyDisplay from '../../CompactCurrencyDisplay'
import Card from './Card'

/**
 * Summary Card Component for displaying grouped results
 */
const SummaryCard = ({
  title,
  items = [],
  icon,
  color = 'blue',
  className = ''
}) => {
  const { formatCurrency } = useCurrency()
  
  // Format value based on type
  const formatValue = (val, type) => {
    if (!val && val !== 0) return '-'

    switch (type) {
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
    blue: 'from-blue-50 to-blue-100 text-blue-800',
    green: 'from-green-50 to-green-100 text-green-800',
    purple: 'from-purple-50 to-purple-100 text-purple-800',
    orange: 'from-orange-50 to-orange-100 text-orange-800',
    red: 'from-red-50 to-red-100 text-red-800',
    gray: 'from-gray-50 to-gray-100 text-gray-800'
  }
  
  return (
    <Card 
      variant="gradient"
      size="md"
      className={`bg-gradient-to-r ${colorClasses[color]} ${className}`}
    >
      <div className="flex items-center gap-3 mb-4">
        {icon && (
          <div className={`p-2 bg-white/50 rounded-lg`}>
            {React.createElement(icon, { className: "w-5 h-5" })}
          </div>
        )}
        <h3 className="text-lg font-bold">{title}</h3>
      </div>
      
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between items-center">
            <span className={`text-${color}-700`}>{item.label}</span>
            <span className="font-semibold">
              {formatValue(item.value, item.type)}
            </span>
          </div>
        ))}
      </div>
    </Card>
  )
}

export default SummaryCard
