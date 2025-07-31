import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useComparison } from '../contexts/ComparisonContext'
import { useCurrency } from '../contexts/CurrencyContext'
import { useViewMode } from '../contexts/ViewModeContext'
import useMobileResponsive from '../hooks/useMobileResponsive'
import { useURLStateObject, generateShareableURL } from '../hooks/useURLState'
import { NumberInput } from '../components/common/inputs'
import CommonPDFExport from '../components/CommonPDFExport'
import CalculatorDropdown from '../components/CalculatorDropdown'
import RelatedCalculators from '../components/RelatedCalculators'
import MobileLayout, { MobileGrid } from '../components/MobileLayout'

function GratuityCalculator({ onAddToComparison, categoryColor = 'red', currentCalculatorId, calculatorData, onCalculatorSelect }) {
  const { addToComparison } = useComparison()
  const { formatCurrency } = useCurrency()
  const { isMobile } = useViewMode()
  const { responsive } = useMobileResponsive()

  const initialInputs = {
    lastDrawnSalary: '',
    yearsOfService: '',
    monthsOfService: '',
    organizationType: 'covered' // covered or non-covered under Gratuity Act
  }

  // Use URL state management for inputs
  const [inputs, setInputs] = useURLStateObject('gratuity_')
  const [results, setResults] = useState(null)

  // Initialize inputs with defaults if empty
  useEffect(() => {
    if (Object.keys(inputs).length === 0) {
      setInputs(prev => ({ ...initialInputs, ...prev }))
    }
  }, [])

  const handleInputChange = (field, value) => {
    const newInputs = { ...inputs, [field]: value }
    setInputs(newInputs)
  }

  const handleReset = () => {
    setInputs(initialInputs)
    setResults(null)
    // Clear URL parameters
    window.history.replaceState({}, document.title, window.location.pathname + '?calculator=gratuity')
  }

  const calculateGratuity = () => {
    const lastDrawnSalary = parseFloat(inputs.lastDrawnSalary) || 0
    const yearsOfService = parseFloat(inputs.yearsOfService) || 0
    const monthsOfService = parseFloat(inputs.monthsOfService) || 0
    const organizationType = inputs.organizationType

    if (lastDrawnSalary <= 0 || (yearsOfService === 0 && monthsOfService === 0)) return

    // Convert total service to years (including months)
    const totalServiceYears = yearsOfService + (monthsOfService / 12)

    // Minimum service period check
    if (totalServiceYears < 5) {
      setResults({
        gratuityAmount: 0,
        totalServiceYears: totalServiceYears.toFixed(2),
        isEligible: false,
        reason: 'Minimum 5 years of service required for gratuity eligibility'
      })
      return
    }

    let gratuityAmount = 0

    if (organizationType === 'covered') {
      // For organizations covered under Gratuity Act
      // Formula: (Last drawn salary × 15 × Years of service) / 26
      // 15 days salary for each year of service
      gratuityAmount = (lastDrawnSalary * 15 * Math.floor(totalServiceYears)) / 26
      
      // Maximum limit as per Gratuity Act (₹20 lakhs as of 2018)
      const maxGratuity = 2000000 // ₹20 lakhs
      if (gratuityAmount > maxGratuity) {
        gratuityAmount = maxGratuity
      }
    } else {
      // For organizations not covered under Gratuity Act
      // Formula: (Last drawn salary × 15 × Years of service) / 30
      gratuityAmount = (lastDrawnSalary * 15 * Math.floor(totalServiceYears)) / 30
    }

    // Calculate tax implications (gratuity is tax-free up to certain limits)
    const taxFreeLimit = organizationType === 'covered' ? 2000000 : 1000000
    const taxableAmount = Math.max(0, gratuityAmount - taxFreeLimit)

    setResults({
      gratuityAmount: Math.round(gratuityAmount),
      totalServiceYears: totalServiceYears.toFixed(2),
      isEligible: true,
      taxFreeAmount: Math.min(gratuityAmount, taxFreeLimit),
      taxableAmount: Math.round(taxableAmount),
      organizationType
    })
  }

  const handleAddToComparison = () => {
    if (results && results.isEligible) {
      const comparisonData = {
        id: Date.now(),
        calculator: 'Gratuity Calculator',
        timestamp: new Date().toISOString(),
        inputs: {
          'Last Drawn Salary': `₹${inputs.lastDrawnSalary}`,
          'Years of Service': (inputs.yearsOfService) + ' years ${inputs.monthsOfService} months',
          'Organization Type': inputs.organizationType === 'covered' ? 'Covered under Gratuity Act' : 'Not covered under Gratuity Act'
        },
        results: {
          'Gratuity Amount': `₹${results.gratuityAmount?.toLocaleString()}`,
          'Tax Free Amount': `₹${results.taxFreeAmount?.toLocaleString()}`,
          'Taxable Amount': `₹${results.taxableAmount?.toLocaleString()}`
        }
      }
      addToComparison(comparisonData)
    }
  }

  const shareCalculation = () => {
    const shareData = {
      title: 'finclamp.com - Gratuity Calculator Results',
      text: `Gratuity Calculation: Salary ₹${inputs.lastDrawnSalary}, Gratuity ₹${results?.gratuityAmount?.toLocaleString()}`,
      url: window.location.href
    }

    if (navigator.share) {
      navigator.share(shareData)
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Calculation link copied to clipboard!')
    }
  }

  // Animation variants
  const staggerContainer = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
  }

  // Chart data
  const chartData = results && results.isEligible ? [
    { name: 'Tax Free Amount', amount: results.taxFreeAmount, color: '#10B981' },
    { name: 'Taxable Amount', amount: results.taxableAmount, color: '#EF4444' }
  ] : []

  useEffect(() => {
    if (inputs.lastDrawnSalary && (inputs.yearsOfService || inputs.monthsOfService)) {
      calculateGratuity()
    }
  }, [inputs])

  return (
    <>
      <motion.div
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
      {/* Main Content - Single Row Layout */}
      <MobileGrid columns={2} className={isMobile ? 'mt-4' : 'mt-6'}>

        {/* Left Column - Gratuity Details */}
        <motion.div
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold" style={{ color: '#1F2937' }}>
              🎁 Gratuity Details
            </h3>
            <motion.button
              onClick={handleReset}
              className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 cursor-pointer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Reset Calculator"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </motion.button>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                💰 Last Drawn Salary (Monthly)
              </label>
              <NumberInput
                value={inputs.lastDrawnSalary}
                onChange={(value) => handleInputChange('lastDrawnSalary', value)}
                placeholder="Enter amount"
                prefix={formatCurrency(0).replace(/[\d.,]/g, '')}
                step="1"
                min="0"
                allowDecimals={true}
                allowNegative={false}
                className="w-full py-2 text-sm font-medium border-2 rounded-xl transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📅 Years of Service
              </label>
              <NumberInput
                value={inputs.yearsOfService}
                onChange={(value) => handleInputChange('yearsOfService', value)}
                placeholder="Enter value"
                suffix="years"
                step="1"
                min="0"
                max="50"
                allowDecimals={false}
                allowNegative={false}
                className="w-full py-2 text-sm font-medium border-2 rounded-xl transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📆 Additional Months
              </label>
              <NumberInput
                value={inputs.monthsOfService}
                onChange={(value) => handleInputChange('monthsOfService', value)}
                placeholder="Enter rate"
                suffix="months"
                step="1"
                min="0"
                max="11"
                allowDecimals={false}
                allowNegative={false}
                className="w-full py-2 text-sm font-medium border-2 rounded-xl transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            {/* Organization Type */}
            <CalculatorDropdown
              configKey="ORGANIZATION_TYPE"
              value={inputs.organizationType}
              onChange={(value) => handleInputChange('organizationType', value)}
              category="retirement"
              placeholder="Select organization type"
            />

            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
              <p className="text-sm text-blue-800">
                💡 <strong>Gratuity Eligibility:</strong> Minimum 5 years of continuous service required
              </p>
            </div>

            {/* Quick Actions */}
            {results && (
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <motion.button
                  onClick={handleAddToComparison}
                  className="w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 cursor-pointer text-sm"
                  style={{ backgroundColor: '#DC2626' }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  📊 Compare
                </motion.button>

                <motion.button
                  onClick={shareCalculation}
                  className="w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 cursor-pointer text-sm"
                  style={{ backgroundColor: '#6366F1' }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  🔗 Share
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Right Column - Expanded Results */}
        <motion.div
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-xl font-bold mb-6" style={{ color: '#1F2937' }}>
            📊 Gratuity Results
          </h3>

          {results ? (
            <div className="grid grid-cols-2 gap-6">
              <motion.div
                className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-6 border border-red-100"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">💰</span>
                  <h4 className="font-semibold text-base text-gray-700">Gratuity Amount</h4>
                </div>
                <p className={(responsive.typography.heading) + ' font-bold text-red-600 leading-tight'}>
                  {formatCurrency(results.gratuityAmount || 0)}
                </p>
              </motion.div>

              <motion.div
                className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">✅</span>
                  <h4 className="font-semibold text-base text-gray-700">Eligibility</h4>
                </div>
                <p className={(responsive.typography.heading) + ' font-bold text-green-600 leading-tight'}>
                  {results.isEligible ? 'Eligible' : 'Not Eligible'}
                </p>
              </motion.div>

              <motion.div
                className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">📅</span>
                  <h4 className="font-semibold text-base text-gray-700">Service Period</h4>
                </div>
                <p className={(responsive.typography.heading) + ' font-bold text-blue-600 leading-tight'}>
                  {inputs.yearsOfService} Years {inputs.monthsOfService} Months
                </p>
              </motion.div>

              <motion.div
                className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-6 border border-purple-100"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">💼</span>
                  <h4 className="font-semibold text-base text-gray-700">Last Salary</h4>
                </div>
                <p className={(responsive.typography.heading) + ' font-bold text-purple-600 leading-tight'}>
                  {formatCurrency(inputs.lastDrawnSalary)}
                </p>
              </motion.div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-gray-500 text-lg">Enter gratuity details to see results</p>
            </div>
          )}
        </motion.div>
      </MobileGrid>

      {/* Detailed Analysis Section - Below Main Content */}
      <AnimatePresence>
        {results && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="mt-4 space-y-4"
          >
            {/* Detailed Analysis Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Gratuity Summary */}
              <motion.div
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h4 className="text-lg font-bold mb-4 text-gray-800">
                  💼 Gratuity Summary
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 text-sm">Last Salary</span>
                    <span className="font-semibold text-red-600 text-sm">{formatCurrency(inputs.lastDrawnSalary)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 text-sm">Service Period</span>
                    <span className="font-semibold text-sm">{inputs.yearsOfService} years {inputs.monthsOfService} months</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 text-sm">Organization Type</span>
                    <span className="font-semibold text-sm">{inputs.organizationType === 'covered' ? 'Covered' : 'Not Covered'}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600 text-sm">Eligibility</span>
                    <span className={'font-semibold text-sm ' + (results.isEligible ? 'text-green-600' : 'text-red-600')}>
                      {results.isEligible ? 'Eligible' : 'Not Eligible'}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Chart Placeholder */}
              <motion.div
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h4 className="text-lg font-bold mb-4 text-gray-800">
                  📊 Calculation Breakdown
                </h4>
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-blue-800 mb-2">Formula Used:</h5>
                    <p className="text-sm text-blue-700">
                      Gratuity = (Last Salary × 15 × Years of Service) ÷ 26
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Last Salary</p>
                      <p className="font-semibold">{formatCurrency(results?.lastSalary)}</p>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Service Period</p>
                      <p className="font-semibold">{results?.servicePeriod}</p>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Eligibility</p>
                      <p className="font-semibold text-green-600">{results?.eligibility}</p>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Organization Type</p>
                      <p className="font-semibold">{inputs.organizationType === 'covered' ? 'Covered under Gratuity Act' : 'Not Covered'}</p>
                    </div>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-yellow-800 mb-2">Note:</h5>
                    <p className="text-sm text-yellow-700">
                      • Minimum 5 years of continuous service required for gratuity eligibility<br/>
                      • Maximum gratuity amount is capped as per current regulations<br/>
                      • Calculation may vary based on organization type and applicable laws
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Actions & Export */}
              <motion.div
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h4 className="text-lg font-bold mb-4 text-gray-800">
                  🎯 Quick Actions
                </h4>
                <div className="space-y-4">
                  <CommonPDFExport
          calculatorName="Gratuity Calculator"
          inputs={{
            'Basic Salary': formatCurrency(inputs.basicSalary),
            'Years of Service': (inputs.yearsOfService) + ' years',
            'Dearness Allowance': formatCurrency(inputs.dearnessAllowance || 0),
            'Last Drawn Salary': formatCurrency((parseFloat(inputs.basicSalary) + parseFloat(inputs.dearnessAllowance || 0))),
            'Service Type': inputs.serviceType || "Private Sector",
            'Gratuity Rate': "15 days salary for each year",
            'Minimum Service': "5 years minimum required",
            'Maximum Gratuity Limit': formatCurrency(2000000)
          }}
          results={{
            'Gratuity Amount': formatCurrency(results.gratuityAmount || 0),
            'Tax on Gratuity': formatCurrency(results.taxOnGratuity || 0),
            'Net Gratuity': formatCurrency(results.netGratuity || 0),
            'Monthly Salary Equivalent': (Math.round(results.gratuityAmount / (parseFloat(inputs.basicSalary) + parseFloat(inputs.dearnessAllowance || 0)))) + ' months',
            'Service Benefit': ((results.gratuityAmount / parseInt(inputs.yearsOfService)).toFixed(0)) + ' per year',
            'Gratuity Formula': "(Last Salary × 15 × Years) / 26",
            'Eligible Service': (inputs.yearsOfService) + ' years',
            'Tax Status': results.gratuityAmount > 2000000 ? "Partially Taxable" : "Tax Free"
          }}
        />

                  <div className="text-center pt-2">
                    <p className="text-sm text-gray-500">
                      💡 All calculations are approximate and for reference only
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      </motion.div>

      {/* Related Calculators */}
      {currentCalculatorId && calculatorData && onCalculatorSelect && (
        <RelatedCalculators
          currentCalculatorId={currentCalculatorId}
          calculatorData={calculatorData}
          onCalculatorSelect={onCalculatorSelect}
        />
      )}
    </>
  )
}

export default GratuityCalculator
