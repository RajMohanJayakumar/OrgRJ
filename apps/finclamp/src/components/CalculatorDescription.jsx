import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp, Calculator, BookOpen, TrendingUp, HelpCircle } from 'lucide-react'
import { getCalculatorDescription } from '../data/calculatorDescriptions'

const CalculatorDescription = ({ calculatorId, categoryColor = 'indigo' }) => {
  const [activeSection, setActiveSection] = useState('overview')
  const description = getCalculatorDescription(calculatorId)

  if (!description) {
    return null
  }

  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      accent: 'text-blue-600',
      button: 'bg-blue-500 hover:bg-blue-600',
      tab: 'border-blue-500 text-blue-600',
      iconBg: 'bg-blue-100'
    },
    green: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      accent: 'text-green-600',
      button: 'bg-green-500 hover:bg-green-600',
      tab: 'border-green-500 text-green-600',
      iconBg: 'bg-green-100'
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      text: 'text-purple-800',
      accent: 'text-purple-600',
      button: 'bg-purple-500 hover:bg-purple-600',
      tab: 'border-purple-500 text-purple-600',
      iconBg: 'bg-purple-100'
    },
    red: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      accent: 'text-red-600',
      button: 'bg-red-500 hover:bg-red-600',
      tab: 'border-red-500 text-red-600',
      iconBg: 'bg-red-100'
    },
    gray: {
      bg: 'bg-gray-50',
      border: 'border-gray-200',
      text: 'text-gray-800',
      accent: 'text-gray-600',
      button: 'bg-gray-500 hover:bg-gray-600',
      tab: 'border-gray-500 text-gray-600',
      iconBg: 'bg-gray-100'
    },
    indigo: {
      bg: 'bg-indigo-50',
      border: 'border-indigo-200',
      text: 'text-indigo-800',
      accent: 'text-indigo-600',
      button: 'bg-indigo-500 hover:bg-indigo-600',
      tab: 'border-indigo-500 text-indigo-600',
      iconBg: 'bg-indigo-100'
    }
  }

  const colors = colorClasses[categoryColor] || colorClasses.indigo

  const sections = [
    { id: 'overview', label: 'Overview', icon: BookOpen },
    { id: 'formula', label: 'Formula', icon: Calculator },
    { id: 'features', label: 'Features', icon: TrendingUp },
    { id: 'example', label: 'Example', icon: HelpCircle }
  ]

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  }

  return (
    <motion.div
      className={`mt-8 rounded-2xl ${colors.bg} ${colors.border} border-2 overflow-hidden shadow-lg`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {/* Header */}
      <div className={`px-6 py-5 bg-gradient-to-r from-white to-gray-50 border-b ${colors.border}`}>
        <h2 className={`text-xl font-bold ${colors.text} flex items-center gap-3`}>
          <div className={`p-2 rounded-lg ${colors.iconBg}`}>
            <BookOpen className={`w-5 h-5 ${colors.accent}`} />
          </div>
          About {description.title}
        </h2>
        <p className="text-gray-600 text-sm mt-2">Learn how this calculator works and understand the mathematics behind it</p>
      </div>

      {/* Navigation Tabs */}
      <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
        <div className="flex flex-wrap gap-3">
          {sections.map((section) => {
            const Icon = section.icon
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`px-5 py-3 rounded-xl font-medium text-sm transition-all duration-300 flex items-center gap-2 cursor-pointer transform hover:scale-105 ${
                  activeSection === section.id
                    ? `${colors.button} text-white shadow-lg shadow-${categoryColor}-500/25`
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 hover:border-gray-300 shadow-sm'
                }`}
              >
                <Icon className="w-4 h-4" />
                {section.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Content Container with Fixed Height */}
      <div className="relative">
        <div className="min-h-[500px] max-h-[600px] overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            {activeSection === 'overview' && (
              <motion.div
                key="overview"
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                {/* What is this calculator */}
                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-lg ${colors.iconBg}`}>
                      <HelpCircle className={`w-5 h-5 ${colors.accent}`} />
                    </div>
                    <h3 className={`text-lg font-semibold ${colors.text}`}>What is this calculator?</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-base">{description.description}</p>
                </div>

                {/* How it works */}
                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-lg ${colors.iconBg}`}>
                      <TrendingUp className={`w-5 h-5 ${colors.accent}`} />
                    </div>
                    <h3 className={`text-lg font-semibold ${colors.text}`}>How it works</h3>
                  </div>
                  <div className="space-y-4">
                    {description.howItWorks.map((step, index) => (
                      <div key={index} className="flex items-start gap-4 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                        <span className={`flex-shrink-0 w-8 h-8 rounded-full ${colors.button} text-white text-sm font-bold flex items-center justify-center shadow-md`}>
                          {index + 1}
                        </span>
                        <span className="text-gray-700 font-medium pt-1">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Benefits */}
                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-lg ${colors.iconBg}`}>
                      <BookOpen className={`w-5 h-5 ${colors.accent}`} />
                    </div>
                    <h3 className={`text-lg font-semibold ${colors.text}`}>Key Benefits</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {description.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-green-50 border border-green-100">
                        <span className="text-green-600 text-lg font-bold">✓</span>
                        <span className="text-gray-700 font-medium">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeSection === 'formula' && (
              <motion.div
                key="formula"
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                {/* Formula Display */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`p-3 rounded-lg ${colors.button} shadow-md`}>
                      <Calculator className="w-6 h-6 text-white" />
                    </div>
                    <h3 className={`text-xl font-bold ${colors.text}`}>{description.formula.name}</h3>
                  </div>

                  <div className="bg-white rounded-lg p-6 border-2 border-blue-200 shadow-inner">
                    <div className="text-center">
                      <div className="inline-block bg-gray-900 text-white px-6 py-4 rounded-lg shadow-lg">
                        <code className="text-xl font-mono font-bold tracking-wide">
                          {description.formula.equation}
                        </code>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Variables Explanation */}
                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`p-2 rounded-lg ${colors.iconBg}`}>
                      <BookOpen className={`w-5 h-5 ${colors.accent}`} />
                    </div>
                    <h3 className={`text-lg font-semibold ${colors.text}`}>Variable Definitions</h3>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {Object.entries(description.formula.variables).map(([variable, meaning], index) => (
                      <div key={variable} className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-3">
                          <span className={`w-8 h-8 rounded-full ${colors.button} text-white text-sm font-bold flex items-center justify-center`}>
                            {index + 1}
                          </span>
                          <code className={`font-mono font-bold text-lg ${colors.accent} bg-white px-3 py-2 rounded border`}>
                            {variable}
                          </code>
                        </div>
                        <span className="text-gray-700 font-medium flex-1">{meaning}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeSection === 'features' && (
              <motion.div
                key="features"
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`p-2 rounded-lg ${colors.iconBg}`}>
                      <TrendingUp className={`w-5 h-5 ${colors.accent}`} />
                    </div>
                    <h3 className={`text-xl font-bold ${colors.text}`}>Key Features & Capabilities</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {description.keyFeatures.map((feature, index) => (
                      <motion.div
                        key={index}
                        className={`group p-5 rounded-xl bg-gradient-to-br from-gray-50 to-white border-2 ${colors.border} hover:shadow-lg transition-all duration-300 cursor-pointer`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`p-2 rounded-lg ${colors.button} group-hover:scale-110 transition-transform duration-300`}>
                            <span className="text-white text-lg">🎯</span>
                          </div>
                          <div className="flex-1">
                            <span className="text-gray-800 font-semibold text-base leading-relaxed group-hover:text-gray-900 transition-colors">
                              {feature}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeSection === 'example' && description.example && (
              <motion.div
                key="example"
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`p-2 rounded-lg ${colors.iconBg}`}>
                      <HelpCircle className={`w-5 h-5 ${colors.accent}`} />
                    </div>
                    <h3 className={`text-xl font-bold ${colors.text}`}>{description.example.scenario}</h3>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Input Values */}
                    <div className="space-y-4">
                      <h4 className={`font-bold ${colors.text} text-lg flex items-center gap-2`}>
                        <span className="text-blue-500">📝</span>
                        Input Values
                      </h4>
                      <div className="space-y-3">
                        {Object.entries(description.example.inputs).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between p-3 rounded-lg bg-blue-50 border border-blue-100">
                            <span className="text-gray-700 font-medium">{key}:</span>
                            <span className="font-bold text-blue-800 bg-white px-3 py-1 rounded border">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Result */}
                    <div className="space-y-4">
                      <h4 className={`font-bold ${colors.text} text-lg flex items-center gap-2`}>
                        <span className="text-green-500">🎯</span>
                        Calculated Result
                      </h4>
                      <div className={`p-6 rounded-xl bg-gradient-to-br ${colors.bg} border-2 ${colors.border} shadow-inner`}>
                        <div className="text-center">
                          <div className="bg-white rounded-lg p-4 shadow-md">
                            <span className={`text-2xl font-bold ${colors.text} block`}>
                              {description.example.result}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Call to Action */}
                      <div className="mt-4 p-4 rounded-lg bg-green-50 border border-green-200">
                        <p className="text-green-800 text-sm font-medium text-center">
                          💡 Try the calculator above with your own values to get personalized results!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}

export default CalculatorDescription
