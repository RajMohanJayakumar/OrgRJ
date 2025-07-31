import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useComparison } from '../contexts/ComparisonContext'
import { useCurrency } from '../contexts/CurrencyContext'
import { useViewMode } from '../contexts/ViewModeContext'
import useMobileResponsive from '../hooks/useMobileResponsive'
import { useURLStateObject, generateShareableURL } from '../hooks/useURLState'
import { NumberInput } from '../components/common/inputs'
import CompactCurrencyDisplay from '../components/CompactCurrencyDisplay'
import CommonPDFExport from '../components/CommonPDFExport'
import RelatedCalculators from '../components/RelatedCalculators'
import CalculatorDropdown from '../components/CalculatorDropdown'
import ResetButton from '../components/ResetButton'
import MobileLayout, { MobileGrid } from '../components/MobileLayout'



function CompoundInterestCalculator({ onAddToComparison, categoryColor = 'blue', currentCalculatorId, calculatorData, onCalculatorSelect }) {
  const { addToComparison } = useComparison()
  const { formatCurrency } = useCurrency()
  const { isMobile } = useViewMode()
  const { responsive } = useMobileResponsive()

  const initialInputs = {
    principal: '',
    interestRate: '',
    timePeriod: '',
    compoundingFrequency: '1' // 1=annually, 2=semi-annually, 4=quarterly, 12=monthly, 365=daily
  }

  // Use URL state management for inputs
  const [inputs, setInputs] = useURLStateObject('compound_')
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
    window.history.replaceState({}, document.title, window.location.pathname + '?calculator=compound-interest')
  }

  const calculateCompoundInterest = () => {
    const principal = parseFloat(inputs.principal) || 0
    const interestRate = parseFloat(inputs.interestRate) || 0
    const timePeriod = parseFloat(inputs.timePeriod) || 0
    const compoundingFrequency = parseFloat(inputs.compoundingFrequency) || 1

    if (principal <= 0 || interestRate <= 0 || timePeriod <= 0) return

    // Compound Interest Formula: A = P(1 + r/n)^(nt)
    const rate = interestRate / 100
    const amount = principal * Math.pow(1 + rate / compoundingFrequency, compoundingFrequency * timePeriod)
    const compoundInterest = amount - principal

    // Calculate simple interest for comparison
    const simpleInterest = principal * rate * timePeriod
    const simpleAmount = principal + simpleInterest

    // Generate year-wise breakdown
    const yearlyBreakdown = []
    for (let year = 1; year <= Math.min(timePeriod, 20); year++) {
      const yearlyAmount = principal * Math.pow(1 + rate / compoundingFrequency, compoundingFrequency * year)
      const yearlySimpleAmount = principal + (principal * rate * year)
      yearlyBreakdown.push({
        year,
        compound: Math.round(yearlyAmount),
        simple: Math.round(yearlySimpleAmount),
        difference: Math.round(yearlyAmount - yearlySimpleAmount)
      })
    }

    setResults({
      amount: Math.round(amount),
      compoundInterest: Math.round(compoundInterest),
      simpleInterest: Math.round(simpleInterest),
      simpleAmount: Math.round(simpleAmount),
      difference: Math.round(compoundInterest - simpleInterest),
      yearlyBreakdown,
      effectiveRate: ((amount / principal) ** (1 / timePeriod) - 1) * 100
    })
  }

  const handleAddToComparison = () => {
    if (results) {
      const comparisonData = {
        id: Date.now(),
        calculator: 'Compound Interest Calculator',
        timestamp: new Date().toISOString(),
        inputs: {
          'Principal Amount': `₹${inputs.principal}`,
          'Interest Rate': (inputs.interestRate) + '%',
          'Time Period': (inputs.timePeriod) + ' years',
          'Compounding': getCompoundingText(inputs.compoundingFrequency)
        },
        results: {
          'Final Amount': `₹${results.amount?.toLocaleString()}`,
          'Compound Interest': `₹${results.compoundInterest?.toLocaleString()}`,
          'Advantage over Simple Interest': `₹${results.difference?.toLocaleString()}`
        }
      }
      addToComparison(comparisonData)
    }
  }

  const shareCalculation = () => {
    const shareData = {
      title: 'finclamp.com - Compound Interest Calculator Results',
      text: `Compound Interest: Principal ₹${inputs.principal}, Final Amount ₹${results?.amount?.toLocaleString()}`,
      url: window.location.href
    }

    if (navigator.share) {
      navigator.share(shareData)
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Calculation link copied to clipboard!')
    }
  }

  const getCompoundingText = (frequency) => {
    switch (frequency) {
      case '1': return 'Annually'
      case '2': return 'Semi-annually'
      case '4': return 'Quarterly'
      case '12': return 'Monthly'
      case '365': return 'Daily'
      default: return 'Annually'
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
    { name: 'Principal', value: parseFloat(inputs.principal), color: '#3B82F6' },
    { name: 'Compound Interest', value: results.compoundInterest, color: '#10B981' }
  ] : []

  useEffect(() => {
    if (inputs.principal && inputs.interestRate && inputs.timePeriod) {
      calculateCompoundInterest()
    }
  }, [inputs])

  return (
    <MobileLayout className={'' + (isMobile ? 'space-y-4' : 'space-y-8') + ' calculator-main-container'}>
      {/* Main Content - Single Row Layout */}
      <MobileGrid columns={2} className={isMobile ? 'mt-4' : 'mt-6'}>

        {/* Left Column - Investment Details */}
        <motion.div
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold" style={{ color: '#1F2937' }}>
              🧮 Investment Details
            </h3>
            <ResetButton onReset={handleReset} />
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                💰 Principal Amount
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

            {/* Compounding Frequency */}
            <CalculatorDropdown
              configKey="COMPOUNDING_FREQUENCY"
              value={inputs.compoundingFrequency}
              onChange={(value) => handleInputChange('compoundingFrequency', value)}
              category="general"
              placeholder="Select compounding frequency"
            />

            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
              <p className="text-sm text-blue-800">
                💡 <strong>Formula:</strong> A = P(1 + r/n)^(nt)
              </p>
            </div>

            {/* Quick Actions */}
            {results && (
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <motion.button
                  onClick={handleAddToComparison}
                  className="w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 cursor-pointer text-sm"
                  style={{ backgroundColor: '#3B82F6' }}
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
            📊 Compound Interest Results
          </h3>

          {results ? (
            <div className="grid grid-cols-2 gap-6">
              <motion.div
                className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">💰</span>
                  <h4 className="font-semibold text-base text-gray-700">Final Amount</h4>
                </div>
                <p className={(responsive.typography.heading) + ' font-bold text-blue-600 leading-tight'}>
                  <CompactCurrencyDisplay value={results.amount} />
                </p>
              </motion.div>

              <motion.div
                className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">📈</span>
                  <h4 className="font-semibold text-base text-gray-700">Compound Interest</h4>
                </div>
                <p className={(responsive.typography.heading) + ' font-bold text-green-600 leading-tight'}>
                  <CompactCurrencyDisplay value={results.compoundInterest} />
                </p>
              </motion.div>

              <motion.div
                className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-6 border border-purple-100"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">🏦</span>
                  <h4 className="font-semibold text-base text-gray-700">Principal</h4>
                </div>
                <p className={(responsive.typography.heading) + ' font-bold text-purple-600 leading-tight'}>
                  {formatCurrency(inputs.principal)}
                </p>
              </motion.div>

              <motion.div
                className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-100"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">⚡</span>
                  <h4 className="font-semibold text-base text-gray-700">Extra vs Simple</h4>
                </div>
                <p className={(responsive.typography.heading) + ' font-bold text-orange-600 leading-tight'}>
                  <CompactCurrencyDisplay value={results.difference} />
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
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
                    <span className="font-semibold text-blue-600 text-sm">{formatCurrency(inputs.principal)}</span>
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
                    <span className="text-gray-600 text-sm">Compounding</span>
                    <span className="font-semibold text-green-600 text-sm">
                      {inputs.compoundingFrequency === '1' ? 'Annually' :
                       inputs.compoundingFrequency === '2' ? 'Semi-annually' :
                       inputs.compoundingFrequency === '4' ? 'Quarterly' :
                       inputs.compoundingFrequency === '12' ? 'Monthly' : 'Daily'}
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
                  📊 Growth Visualization
                </h4>
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">📈</div>
                  <p className="text-gray-500 text-sm">Compound growth chart</p>
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
          calculatorName="CompoundInterest Calculator"
          inputs={{
            'Principal Amount': formatCurrency(inputs.principal),
            'Interest Rate': `${inputs.interestRate}% p.a.`,
            'Time Period': (inputs.timePeriod) + ' years',
            'Compounding Frequency': inputs.compoundingFrequency || "Annually",
            'Additional Investment': inputs.additionalInvestment ? formatCurrency(inputs.additionalInvestment) : "None",
            'Investment Type': "Compound Interest Investment",
            'Effective Rate': ((((1 + parseFloat(inputs.interestRate) / 100 / (inputs.compoundingFrequency === "Monthly" ? 12 : inputs.compoundingFrequency === "Quarterly" ? 4 : 1)) ** (inputs.compoundingFrequency === "Monthly" ? 12 : inputs.compoundingFrequency === "Quarterly" ? 4 : 1) - 1) * 100).toFixed(2)) + '%',
            'Total Compounding Periods': (parseInt(inputs.timePeriod) * (inputs.compoundingFrequency === "Monthly" ? 12 : inputs.compoundingFrequency === "Quarterly" ? 4 : 1)) + ' periods'
          }}
          results={{
            'Final Amount': formatCurrency(results.finalAmount || 0),
            'Interest Earned': formatCurrency(results.interestEarned || 0),
            'Principal Investment': formatCurrency(inputs.principal),
            'Compound Growth': formatCurrency(results.finalAmount - parseFloat(inputs.principal)),
            'Return Multiple': `${(results.finalAmount / parseFloat(inputs.principal)).toFixed(2)}x`,
            'Annualized Return': ((((results.finalAmount / parseFloat(inputs.principal)) ** (1 / parseInt(inputs.timePeriod)) - 1) * 100).toFixed(2)) + '%',
            'Monthly Equivalent': formatCurrency(results.finalAmount / (parseInt(inputs.timePeriod) * 12)),
            'Doubling Time': ((Math.log(2) / Math.log(1 + parseFloat(inputs.interestRate) / 100)).toFixed(1)) + ' years'
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

export default CompoundInterestCalculator
