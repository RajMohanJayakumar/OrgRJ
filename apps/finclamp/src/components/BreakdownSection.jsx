import React from 'react'
import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import CompactCurrencyDisplay from './CompactCurrencyDisplay'

const BreakdownSection = ({
  title = "Breakdown",
  data = [],
  summaryCards = [],
  chartType = "pie", // "pie" or "bar"
  categoryColor = "blue",
  className = ""
}) => {

  const colorMap = {
    blue: {
      bg: 'from-blue-50 to-blue-100',
      title: 'text-blue-800',
      card: 'text-blue-600',
      cardValue: 'text-blue-800'
    },
    purple: {
      bg: 'from-purple-50 to-purple-100',
      title: 'text-purple-800',
      card: 'text-purple-600',
      cardValue: 'text-purple-800'
    },
    green: {
      bg: 'from-green-50 to-green-100',
      title: 'text-green-800',
      card: 'text-green-600',
      cardValue: 'text-green-800'
    },
    red: {
      bg: 'from-red-50 to-red-100',
      title: 'text-red-800',
      card: 'text-red-600',
      cardValue: 'text-red-800'
    }
  }

  const colors = colorMap[categoryColor] || colorMap.blue

  const renderPieChart = () => (
    <div className="flex flex-col items-center">
      <div className="h-64 w-full max-w-sm">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => <CompactCurrencyDisplay value={value} showTooltip={false} />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-4 flex-wrap">
        {data.map((entry, index) => (
          <div key={index} className="flex items-center">
            <div
              className="w-4 h-4 rounded mr-2"
              style={{ backgroundColor: entry.color }}
            ></div>
            <span className={`text-sm font-medium ${colors.card}`}>
              {entry.name} (<CompactCurrencyDisplay value={entry.value} />)
            </span>
          </div>
        ))}
      </div>
    </div>
  )

  const renderBarChart = () => (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis tickFormatter={(value) => {
            const compactDisplay = value >= 1000000 ? `${(value/1000000).toFixed(1)}M` :
                                  value >= 1000 ? `${(value/1000).toFixed(1)}K` : value.toString()
            return compactDisplay
          }} />
          <Tooltip formatter={(value) => <CompactCurrencyDisplay value={value} showTooltip={false} />} />
          <Bar dataKey="value" fill={data[0]?.color || '#3B82F6'} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )

  return (
    <motion.div
      className={`bg-gradient-to-r ${colors.bg} rounded-lg p-6 mt-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className={`text-lg font-bold ${colors.title} mb-6 text-center`}>{title}</h3>

      {/* Summary Cards */}
      {summaryCards.length > 0 && (
        <div className={`grid grid-cols-2 ${summaryCards.length > 2 ? 'md:grid-cols-4' : 'md:grid-cols-2'} gap-4 mb-6`}>
          {summaryCards.map((card, index) => (
            <div key={index} className="bg-white rounded-lg p-4 text-center shadow-sm">
              <div className={`text-xs ${colors.card} mb-1`}>{card.label}</div>
              <div className={`font-bold ${colors.cardValue} text-sm`}>
                {card.type === 'currency' ? <CompactCurrencyDisplay value={card.value} /> :
                 card.type === 'percentage' ? `${card.value}%` :
                 card.value}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Chart */}
      {data.length > 0 && (
        chartType === "pie" ? renderPieChart() : renderBarChart()
      )}
    </motion.div>
  )
}

export default BreakdownSection
