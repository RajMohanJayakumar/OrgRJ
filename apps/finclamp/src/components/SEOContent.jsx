import React from 'react'
import { motion } from 'framer-motion'
import { Search, TrendingUp, Users, Star } from 'lucide-react'
import { getCalculatorDescription } from '../data/calculatorDescriptions'
import { getRelatedCalculators } from '../utils/relatedCalculators'

const SEOContent = ({ calculatorId, categoryColor = 'indigo', calculatorData }) => {
  const description = getCalculatorDescription(calculatorId)
  const relatedCalculators = getRelatedCalculators(calculatorId, calculatorData, 3)
  
  if (!description || !description.searchQueries) {
    return null
  }

  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-800',
    green: 'bg-green-50 border-green-200 text-green-800',
    purple: 'bg-purple-50 border-purple-200 text-purple-800',
    red: 'bg-red-50 border-red-200 text-red-800',
    gray: 'bg-gray-50 border-gray-200 text-gray-800',
    indigo: 'bg-indigo-50 border-indigo-200 text-indigo-800'
  }

  const colors = colorClasses[categoryColor] || colorClasses.indigo

  return (
    <motion.div
      className={`mt-6 rounded-xl ${colors} border-2 p-6`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      {/* Related Calculators Section - Only show if we have related calculators */}
      {relatedCalculators.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-white shadow-sm">
              <Search className="w-5 h-5 text-gray-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">Related Tools</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {relatedCalculators.map((calc, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.location.href = `?calculator=${calc.id}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{calc.icon}</span>
                  <div>
                    <div className="text-sm font-semibold text-gray-800">{calc.name}</div>
                    <div className="text-xs text-gray-600">{calc.description}</div>
                    {calc.category && (
                      <div className="text-xs text-gray-500 mt-1">
                        {calc.category}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* SEO Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span className="font-bold text-gray-800">50K+</span>
          </div>
          <p className="text-sm text-gray-600">Monthly Users</p>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span className="font-bold text-gray-800">99.9%</span>
          </div>
          <p className="text-sm text-gray-600">Accuracy Rate</p>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Star className="w-5 h-5 text-yellow-600" />
            <span className="font-bold text-gray-800">4.8/5</span>
          </div>
          <p className="text-sm text-gray-600">User Rating</p>
        </div>
      </div>

      {/* SEO Keywords Section */}
      {description.seoKeywords && (
        <div className="mt-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Related Keywords:</h4>
          <div className="flex flex-wrap gap-2">
            {description.seoKeywords.split(', ').slice(0, 8).map((keyword, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-600 border border-gray-200"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Call to Action */}
      <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
        <p className="text-sm text-gray-700 text-center">
          <span className="font-semibold">💡 Pro Tip:</span> Bookmark this calculator for quick access to accurate financial calculations anytime!
        </p>
      </div>
    </motion.div>
  )
}

export default SEOContent
