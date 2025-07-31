import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useComparison } from '../contexts/ComparisonContext'
import { useCurrency } from '../contexts/CurrencyContext'
import { useViewMode } from '../contexts/ViewModeContext'
import useMobileResponsive from '../hooks/useMobileResponsive'
import { useURLStateObject, generateShareableURL } from '../hooks/useURLState'
import CompactCurrencyDisplay from '../components/CompactCurrencyDisplay'
import CommonPDFExport from '../components/CommonPDFExport'
import { NumberInput } from '../components/common/inputs'
import RelatedCalculators from '../components/RelatedCalculators'
import ResetButton from '../components/ResetButton'
import MobileLayout, { MobileGrid } from '../components/MobileLayout'

function SimpleInterestCalculator({ onAddToComparison, categoryColor = 'yellow', currentCalculatorId, calculatorData, onCalculatorSelect }) {
  const { addToComparison } = useComparison()
  const { formatCurrency } = useCurrency()
  const { isMobile } = useViewMode()
  const { responsive } = useMobileResponsive()

  const initialInputs = {
    principal: '',
    interestRate: '',
    timePeriod: '',
    calculationType: 'amount' // amount, principal, rate, time
  }

  // Use URL state management for inputs
  const [inputs, setInputs] = useURLStateObject('simple_')
  const [results, setResults] = useState(null)

  // Initialize inputs with defaults if empty
  useEffect(() => {
    if (Object.keys(inputs).length === 0) {
      setInputs(initialInputs)
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
    window.history.replaceState({}, document.title, window.location.pathname + '?calculator=simple-interest')
  }

  const calculateSimpleInterest = () => {
    const principal = parseFloat(inputs.principal) || 0
    const interestRate = parseFloat(inputs.interestRate) || 0
    const timePeriod = parseFloat(inputs.timePeriod) || 0

    if (inputs.calculationType === 'amount') {
      if (principal <= 0 || interestRate <= 0 || timePeriod <= 0) return
      
      // Calculate Simple Interest: SI = (P × R × T) / 100
      const simpleInterest = (principal * interestRate * timePeriod) / 100
      const amount = principal + simpleInterest
      
      // Generate year-wise breakdown
      const yearlyBreakdown = []
      for (let year = 1; year <= Math.min(timePeriod, 20); year++) {
        const yearlyInterest = (principal * interestRate * year) / 100
        const yearlyAmount = principal + yearlyInterest
        yearlyBreakdown.push({
          year,
          interest: Math.round(yearlyInterest),
          amount: Math.round(yearlyAmount),
          principal: principal
        })
      }

      setResults({
        principal,
        interestRate,
        timePeriod,
        simpleInterest: Math.round(simpleInterest),
        totalAmount: Math.round(amount),
        yearlyBreakdown,
        monthlyInterest: Math.round(simpleInterest / (timePeriod * 12)),
        dailyInterest: Math.round(simpleInterest / (timePeriod * 365))
      })
    }
  }

  const handleAddToComparison = () => {
    if (results) {
      const comparisonData = {
        id: Date.now(),
        calculator: 'Simple Interest Calculator',
        timestamp: new Date().toISOString(),
        inputs: {
          'Principal Amount': `₹${inputs.principal}`,
          'Interest Rate': (inputs.interestRate) + '%',
          'Time Period': (inputs.timePeriod) + ' years'
        },
        results: {
          'Final Amount': `₹${results.totalAmount?.toLocaleString()}`,
          'Simple Interest': `₹${results.simpleInterest?.toLocaleString()}`,
          'Monthly Interest': `₹${results.monthlyInterest?.toLocaleString()}`
        }
      }
      addToComparison(comparisonData)
    }
  }

  const shareCalculation = () => {
    const shareData = {
      title: 'finclamp.com - Simple Interest Calculator Results',
      text: `Simple Interest: Principal ₹${inputs.principal}, Interest ₹${results?.simpleInterest?.toLocaleString()}`,
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
  const pieChartData = results ? [
    { name: 'Principal', value: results.principal, color: '#F59E0B' },
    { name: 'Simple Interest', value: results.simpleInterest, color: '#FCD34D' }
  ] : []

  useEffect(() => {
    if (inputs.principal && inputs.interestRate && inputs.timePeriod) {
      calculateSimpleInterest()
    }
  }, [inputs])

  return (
    <MobileLayout className={'' + (isMobile ? 'space-y-4' : 'space-y-8') + ' calculator-main-container'}>
      {/* Main Content - Single Row Layout */}
      <MobileGrid columns={2} className={isMobile ? 'mt-4' : 'mt-6'}>

        {/* Left Column - Simple Interest Details */}
        <motion.div
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold" style={{ color: '#1F2937' }}>
              📊 Investment Details
            </h3>
            <ResetButton onReset={handleReset} />
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ₹ Principal Amount
              </label>
              <NumberInput
                value={inputs.principal}
                onChange={(value) => handleInputChange('principal', value)}
                placeholder="Enter amount"
                prefix={formatCurrency(0).replace(/[\d.,]/g, '')}
                step="1"
                min="0"
                allowDecimals={true}
                allowNegative={false}
                className="w-full py-2 text-sm font-medium border-2 rounded-xl transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📈 Annual Interest Rate (%)
              </label>
              <NumberInput
                value={inputs.interestRate}
                onChange={(value) => handleInputChange('interestRate', value)}
                placeholder="Enter rate"
                suffix="%"
                step="0.5"
                min="0"
                allowDecimals={true}
                allowNegative={false}
                className="w-full py-2 text-sm font-medium border-2 rounded-xl transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📅 Time Period (Years)
              </label>
              <NumberInput
                value={inputs.timePeriod}
                onChange={(value) => handleInputChange('timePeriod', value)}
                placeholder="Enter value"
                suffix="years"
                step="0.5"
                min="0"
                allowDecimals={true}
                allowNegative={false}
                className="w-full py-2 text-sm font-medium border-2 rounded-xl transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
              <p className="text-sm text-yellow-800">
                💡 <strong>Formula:</strong> SI = (P × R × T) / 100
              </p>
            </div>

            {/* Quick Actions */}
            {results && (
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <motion.button
                  onClick={handleAddToComparison}
                  className="w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 cursor-pointer text-sm"
                  style={{ backgroundColor: '#F59E0B' }}
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
            📊 Simple Interest Results
          </h3>

          {results ? (
            <div className="grid grid-cols-2 gap-6">
              <motion.div
                className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-100"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">💰</span>
                  <h4 className="font-semibold text-base text-gray-700">Simple Interest</h4>
                </div>
                <p className={(responsive.typography.heading) + ' font-bold text-yellow-600 leading-tight'}>
                  <CompactCurrencyDisplay value={results.simpleInterest} />
                </p>
              </motion.div>

              <motion.div
                className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">🏦</span>
                  <h4 className="font-semibold text-base text-gray-700">Principal</h4>
                </div>
                <p className={(responsive.typography.heading) + ' font-bold text-blue-600 leading-tight'}>
                  <CompactCurrencyDisplay value={results.principal} />
                </p>
              </motion.div>

              <motion.div
                className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">📈</span>
                  <h4 className="font-semibold text-base text-gray-700">Total Amount</h4>
                </div>
                <p className={(responsive.typography.heading) + ' font-bold text-green-600 leading-tight'}>
                  <CompactCurrencyDisplay value={results.totalAmount} />
                </p>
              </motion.div>

              <motion.div
                className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-6 border border-purple-100"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">📅</span>
                  <h4 className="font-semibold text-base text-gray-700">Time Period</h4>
                </div>
                <p className={(responsive.typography.heading) + ' font-bold text-purple-600 leading-tight'}>
                  {inputs.timePeriod} Years
                </p>
              </motion.div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-gray-500 text-lg">Enter investment details to see results</p>
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
            <MobileGrid columns={2} className={isMobile ? 'mt-4' : 'mt-6'}>
              {/* Investment Summary */}
              <motion.div
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h4 className="text-lg font-bold mb-4 text-gray-800">
                  💼 Investment Summary
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 text-sm">Principal Amount</span>
                    <span className="font-semibold text-yellow-600 text-sm">
                      <CompactCurrencyDisplay value={results.principal} />
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 text-sm">Interest Rate</span>
                    <span className="font-semibold text-sm">{inputs.interestRate}% p.a.</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 text-sm">Time Period</span>
                    <span className="font-semibold text-sm">{inputs.timePeriod} years</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600 text-sm">Growth Rate</span>
                    <span className="font-semibold text-green-600 text-sm">
                      {((parseFloat(results.totalAmount) / parseFloat(results.principal) - 1) * 100).toFixed(1)}%
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
                  📊 Interest Breakdown
                </h4>

                {/* Principal vs Interest Breakdown */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                      <span className="font-medium text-blue-800">Principal Amount</span>
                    </div>
                    <span className="font-bold text-blue-600">
                      <CompactCurrencyDisplay value={results.principal} />
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                      <span className="font-medium text-yellow-800">Simple Interest</span>
                    </div>
                    <span className="font-bold text-yellow-600">
                      <CompactCurrencyDisplay value={results.simpleInterest} />
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                      <span className="font-medium text-green-800">Total Amount</span>
                    </div>
                    <span className="font-bold text-green-600">
                      <CompactCurrencyDisplay value={results.totalAmount} />
                    </span>
                  </div>
                </div>

                {/* Additional Breakdown */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-600 mb-1">Monthly Interest</p>
                      <p className="font-semibold text-gray-800">
                        <CompactCurrencyDisplay value={results.monthlyInterest} />
                      </p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-600 mb-1">Daily Interest</p>
                      <p className="font-semibold text-gray-800">
                        <CompactCurrencyDisplay value={results.dailyInterest} />
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Year-wise Breakdown Table */}
              {results.yearlyBreakdown && results.yearlyBreakdown.length > 0 && (
                <motion.div
                  className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 col-span-full"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h4 className="text-lg font-bold mb-4 text-gray-800">
                    📈 Year-wise Interest Growth
                  </h4>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-2 font-semibold text-gray-700">Year</th>
                          <th className="text-right py-3 px-2 font-semibold text-gray-700">Interest Earned</th>
                          <th className="text-right py-3 px-2 font-semibold text-gray-700">Total Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {results.yearlyBreakdown.slice(0, 10).map((year, index) => (
                          <tr key={year.year} className={'border-b border-gray-100 ' + (index % 2 === 0 ? 'bg-gray-50' : 'bg-white')}>
                            <td className="py-3 px-2 font-medium text-gray-800">Year {year.year}</td>
                            <td className="py-3 px-2 text-right font-semibold text-yellow-600">
                              <CompactCurrencyDisplay value={year.interest} />
                            </td>
                            <td className="py-3 px-2 text-right font-semibold text-green-600">
                              <CompactCurrencyDisplay value={year.amount} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {results.yearlyBreakdown.length > 10 && (
                      <div className="text-center mt-4 text-sm text-gray-500">
                        Showing first 10 years of {results.yearlyBreakdown.length} total years
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

            </MobileGrid>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PDF Export */}
      {results && (
        <CommonPDFExport
          calculatorName="SimpleInterest Calculator"
          inputs={{
            'Principal Amount': formatCurrency(inputs.principal),
            'Interest Rate': `${inputs.interestRate}% p.a.`,
            'Time Period': (inputs.timePeriod) + ' years',
            'Interest Type': "Simple Interest",
            'Monthly Rate': ((parseFloat(inputs.interestRate) / 12).toFixed(4)) + '%',
            'Daily Rate': ((parseFloat(inputs.interestRate) / 365).toFixed(6)) + '%',
            'Total Days': (parseInt(inputs.timePeriod) * 365) + ' days',
            'Investment Category': "Fixed Return Investment"
          }}
          results={{
            'Simple Interest': formatCurrency(results.simpleInterest || 0),
            'Final Amount': formatCurrency(results.finalAmount || 0),
            'Principal Amount': formatCurrency(inputs.principal),
            'Interest Percentage': (parseFloat(inputs.principal) > 0 ? (results.simpleInterest / parseFloat(inputs.principal) * 100).toFixed(2) : '0.00') + '%',
            'Monthly Interest': formatCurrency(results.simpleInterest / (parseInt(inputs.timePeriod) * 12)),
            'Annual Interest': formatCurrency(results.simpleInterest / parseInt(inputs.timePeriod)),
            'Daily Interest': formatCurrency(results.simpleInterest / (parseInt(inputs.timePeriod) * 365)),
            'Return Multiple': `${(results.finalAmount / parseFloat(inputs.principal)).toFixed(2)}x`
          }}
        />
      )}

      {/* Related Calculators */}
      {currentCalculatorId && calculatorData && onCalculatorSelect && (
        <RelatedCalculators
          currentCalculatorId={currentCalculatorId}
          calculatorData={calculatorData}
          onCalculatorSelect={onCalculatorSelect}
        />
      )}
    </MobileLayout>
  )
}

export default SimpleInterestCalculator
