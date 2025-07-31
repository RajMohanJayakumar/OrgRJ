import React, { memo, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { getRelatedCalculators } from '../utils/relatedCalculators'

const RelatedCalculators = memo(({ currentCalculatorId, calculatorData, onCalculatorSelect }) => {
  // Memoize the expensive calculation of related calculators
  const relatedCalculators = useMemo(() =>
    getRelatedCalculators(currentCalculatorId, calculatorData),
    [currentCalculatorId, calculatorData]
  )

  // Enhanced calculator select function with auto-scroll - memoized to prevent re-renders
  const handleCalculatorSelectWithScroll = useCallback((calculatorId) => {
    // Call the original calculator select function
    onCalculatorSelect(calculatorId)

    // Auto-scroll to calculator title after a short delay to ensure DOM is updated
    setTimeout(() => {
      const calculatorHeader = document.getElementById('calculator-title')
      if (calculatorHeader) {
        calculatorHeader.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest'
        })
      }
    }, 200)
  }, [onCalculatorSelect])

  // Memoize other tools calculation to prevent re-shuffling on every render
  const otherTools = useMemo(() => {
    const allCalculatorsWithCategory = []

    // Add category information to each calculator
    Object.entries(calculatorData).forEach(([, categoryData]) => {
      categoryData.calculators.forEach(calc => {
        allCalculatorsWithCategory.push({
          ...calc,
          category: categoryData.title,
          categoryColor: categoryData.color
        })
      })
    })

    const excludeIds = [currentCalculatorId, ...relatedCalculators.map(calc => calc.id)]
    const otherCalculators = allCalculatorsWithCategory.filter(calc => !excludeIds.includes(calc.id))

    // Shuffle and take 3 random calculators
    const shuffled = otherCalculators.sort(() => 0.5 - Math.random())
    return shuffled.slice(0, 3)
  }, [currentCalculatorId, calculatorData, relatedCalculators])

  if (!relatedCalculators || relatedCalculators.length === 0) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-800">Related Tools</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
        {relatedCalculators.map((calculator, index) => (
          <motion.div
            key={calculator.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }}
            className="group cursor-pointer"
            onClick={() => handleCalculatorSelectWithScroll(calculator.id)}
          >
            <div className="h-full min-h-[140px] p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 group-hover:border-blue-300">
              <div className="h-full flex flex-col">
                <div className="flex items-start gap-3 flex-1">
                  <div className="text-2xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    {calculator.icon}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col h-full">
                    <h4 className="font-semibold text-gray-800 text-sm mb-1 group-hover:text-blue-600 transition-colors duration-300">
                      {calculator.name}
                    </h4>
                    <div className="relative flex-1 mb-3">
                      <p
                        className="text-xs text-gray-600 leading-relaxed cursor-help"
                        style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                        title={calculator.description}
                      >
                        {calculator.description}...
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                        {calculator.category?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                      <div className="flex items-center text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Other Tools to Explore */}
      {otherTools.length > 0 && (
        <div className="mt-8 pt-6 border-t border-blue-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-1.5 bg-indigo-100 rounded-lg">
              <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-gray-700">Other Tools to Explore</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-stretch">
            {otherTools.map((calculator, index) => (
              <motion.div
                key={calculator.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: (relatedCalculators.length * 0.1) + (index * 0.1) }}
                whileHover={{ scale: 1.02 }}
                className="group cursor-pointer"
                onClick={() => handleCalculatorSelectWithScroll(calculator.id)}
              >
                <div className="h-full min-h-[80px] p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200 hover:border-indigo-300 hover:shadow-sm transition-all duration-300">
                  <div className="h-full flex items-center gap-2">
                    <div className="text-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      {calculator.icon}
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <h5
                        className="font-medium text-gray-700 text-xs mb-1 group-hover:text-indigo-600 transition-colors duration-300 truncate cursor-help"
                        title={calculator.description}
                      >
                        {calculator.name}
                      </h5>
                      <div className="flex items-center justify-between">
                        <span className="text-xs px-1.5 py-0.5 bg-gray-200 text-gray-600 rounded font-medium">
                          {calculator.category?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                        <div className="flex items-center text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500">
          💡 Tip: These calculators work well together for comprehensive financial planning
        </p>
      </div>
    </motion.div>
  )
})

RelatedCalculators.displayName = 'RelatedCalculators'

export default RelatedCalculators
