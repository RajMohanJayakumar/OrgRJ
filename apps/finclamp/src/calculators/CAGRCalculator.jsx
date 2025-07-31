import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import CommonPDFExport from '../components/CommonPDFExport'
import { useComparison } from '../contexts/ComparisonContext'
import { useCurrency } from '../contexts/CurrencyContext'
import { useViewMode } from '../contexts/ViewModeContext'
import useMobileResponsive from '../hooks/useMobileResponsive'
import { useURLStateObject, generateShareableURL } from '../hooks/useURLState'
import { NumberInput } from '../components/common/inputs'
import CalculatorDropdown from '../components/CalculatorDropdown'
import RelatedCalculators from '../components/RelatedCalculators'
import MobileLayout, { MobileGrid } from '../components/MobileLayout'

export default function CAGRCalculator({ onAddToComparison, categoryColor = 'purple', currentCalculatorId, calculatorData, onCalculatorSelect }) {
  const { addToComparison } = useComparison()
  const { formatCurrency } = useCurrency()
  const { isMobile } = useViewMode()
  const { responsive } = useMobileResponsive()

  const initialInputs = {
    beginningValue: '',
    endingValue: '',
    numberOfYears: '',
    calculationType: 'cagr'
  }

  // Use URL state management for inputs
  const [inputs, setInputs] = useURLStateObject('cagr_')
  const { getShareableURL } = generateShareableURL('cagr_')

  // Initialize inputs with defaults if empty
  useEffect(() => {
    if (Object.keys(inputs).length === 0) {
      setInputs(prev => ({ ...initialInputs, ...prev }))
    }
  }, [])

  // Ensure inputs always have defined values to prevent controlled/uncontrolled warnings
  const safeInputs = {
    beginningValue: inputs.beginningValue || '',
    endingValue: inputs.endingValue || '',
    numberOfYears: inputs.numberOfYears || '',
    calculationType: inputs.calculationType || 'cagr'
  }

  const [results, setResults] = useState(null)

  const handleInputChange = (field, value) => {
    const newInputs = { ...inputs, [field]: value }
    setInputs(newInputs)
  }

  const handleReset = () => {
    setInputs(initialInputs)
    setResults(null)
  }

  const calculate = useCallback(() => {
    const beginningValue = parseFloat(inputs.beginningValue) || 0
    const endingValue = parseFloat(inputs.endingValue) || 0
    const numberOfYears = parseFloat(inputs.numberOfYears) || 0

    if (beginningValue === 0 || endingValue === 0 || numberOfYears === 0) return

    if (safeInputs.calculationType === 'cagr') {
      // CAGR = (Ending Value / Beginning Value)^(1/n) – 1
      const cagr = Math.pow(endingValue / beginningValue, 1 / numberOfYears) - 1
      const totalReturns = endingValue - beginningValue
      const totalReturnPercentage = ((endingValue - beginningValue) / beginningValue) * 100

      setResults({
        cagr: (cagr * 100).toFixed(2),
        totalReturns: Math.round(totalReturns),
        totalReturnPercentage: totalReturnPercentage.toFixed(2),
        beginningValue,
        endingValue,
        numberOfYears
      })
    } else if (safeInputs.calculationType === 'roi') {
      // ROI = (Net Profit / Cost of Investment) × 100
      const roi = ((endingValue - beginningValue) / beginningValue) * 100
      const netProfit = endingValue - beginningValue

      setResults({
        roi: roi.toFixed(2),
        netProfit: Math.round(netProfit),
        investment: beginningValue,
        finalValue: endingValue
      })
    }
  }, [inputs])

  // Auto-calculate when inputs change
  useEffect(() => {
    if (inputs.beginningValue && inputs.endingValue && inputs.numberOfYears) {
      calculate()
    }
  }, [safeInputs.beginningValue, safeInputs.endingValue, safeInputs.numberOfYears, safeInputs.calculationType])

  const handleAddToComparison = () => {
    if (results) {
      const comparisonData = {
        type: safeInputs.calculationType === 'cagr' ? 'CAGR' : 'ROI',
        name: (safeInputs.calculationType.toUpperCase()) + ' - ${formatCurrency(safeInputs.beginningValue)} to (formatCurrency(safeInputs.endingValue)) + ',
        inputs: {
          'Beginning Value': formatCurrency(safeInputs.beginningValue),
          'Ending Value': formatCurrency(safeInputs.endingValue),
          'Number of Years': (safeInputs.numberOfYears) + ' years',
          'Calculation Type': safeInputs.calculationType.toUpperCase()
        },
        results: safeInputs.calculationType === 'cagr' ? {
          'CAGR': (results.cagr) + '%',
          'Total Returns': formatCurrency(results.totalReturns || 0),
          'Total Return %': (results.totalReturnPercentage) + '%'
        } : {
          'ROI': (results.roi) + '%',
          'Net Profit': formatCurrency(results.netProfit || 0),
          'Final Value': formatCurrency(results.finalValue || 0)
        }
      }

      // Use new comparison context
      addToComparison(comparisonData)

      // Also call the legacy prop if provided for backward compatibility
      if (onAddToComparison) {
        onAddToComparison(comparisonData)
      }
    }
  }

  const shareCalculation = () => {
    const shareableURL = getShareableURL()
    const shareData = {
      title: 'finclamp.com - ' + safeInputs.calculationType.toUpperCase() + ' Calculator Results',
      text: safeInputs.calculationType.toUpperCase() + ' Calculation: ' + formatCurrency(safeInputs.beginningValue) + ' to ' + formatCurrency(safeInputs.endingValue) + ' over ' + safeInputs.numberOfYears + ' years. ' + (safeInputs.calculationType === 'cagr' ? 'CAGR: ' + (results?.cagr || 0) + '%' : 'ROI: ' + (results?.roi || 0) + '%'),
      url: shareableURL
    }

    if (navigator.share) {
      navigator.share(shareData)
    } else {
      navigator.clipboard.writeText(shareableURL)
      alert('Shareable link copied to clipboard! Your friend can use this link to see the same calculation.')
    }
  }

  return (
    <MobileLayout className={'' + (isMobile ? 'space-y-4' : 'space-y-8') + ' calculator-main-container'}>
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
              📈 {safeInputs.calculationType === 'cagr' ? 'CAGR' : 'ROI'} Details
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
            {/* Calculation Type */}
            <CalculatorDropdown
              configKey="CALCULATION_TYPES.CAGR"
              value={safeInputs.calculationType}
              onChange={(value) => handleInputChange('calculationType', value)}
              category="mutual_funds"
              placeholder="Select calculation type"
            />

            <div>
              <label htmlFor="beginning-value" className="block text-sm font-medium text-gray-700 mb-2">
                💰 {safeInputs.calculationType === 'cagr' ? 'Beginning Value' : 'Initial Investment'}
              </label>
              <NumberInput
                id="beginning-value"
                value={safeInputs.beginningValue}
                onChange={(value) => handleInputChange('beginningValue', value)}
                placeholder="Enter amount"
                prefix={formatCurrency(0).replace(/[\d.,]/g, '')}
                step="1"
                min="0"
                allowDecimals={true}
                allowNegative={false}
                className="w-full py-2 text-sm font-medium border-2 rounded-xl transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="ending-value" className="block text-sm font-medium text-gray-700 mb-2">
                🎯 {safeInputs.calculationType === 'cagr' ? 'Ending Value' : 'Final Value'}
              </label>
              <NumberInput
                id="ending-value"
                value={safeInputs.endingValue}
                onChange={(value) => handleInputChange('endingValue', value)}
                placeholder="200000"
                prefix={formatCurrency(0).replace(/[\d.,]/g, '')}
                step="1"
                min="0"
                allowDecimals={true}
                allowNegative={false}
                className="w-full py-2 text-sm font-medium border-2 rounded-xl transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {safeInputs.calculationType === 'cagr' && (
              <div>
                <label htmlFor="number-of-years" className="block text-sm font-medium text-gray-700 mb-2">
                  📅 Number of Years
                </label>
                <NumberInput
                  id="number-of-years"
                  value={safeInputs.numberOfYears}
                  onChange={(value) => handleInputChange('numberOfYears', value)}
                  placeholder="Enter value"
                  suffix="years"
                  step="1"
                  min="1"
                  allowDecimals={false}
                  allowNegative={false}
                  className="w-full py-2 text-sm font-medium border-2 rounded-xl transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            )}

            {/* Quick Actions */}
            {results && (
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <motion.button
                  onClick={handleAddToComparison}
                  className="w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 cursor-pointer text-sm"
                  style={{ backgroundColor: '#10B981' }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  📊 Compare
                </motion.button>

                <motion.button
                  onClick={shareCalculation}
                  className="w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 cursor-pointer text-sm"
                  style={{ backgroundColor: '#8B5CF6' }}
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
            📊 {safeInputs.calculationType === 'cagr' ? 'CAGR' : 'ROI'} Results
          </h3>

          {results ? (
            <div className="grid grid-cols-1 gap-6">
              {safeInputs.calculationType === 'cagr' && (
                <>
                  <motion.div
                    className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="text-2xl">📈</span>
                      <h4 className="font-semibold text-base text-gray-700">CAGR</h4>
                    </div>
                    <p className={(responsive.typography.heading) + ' font-bold text-green-600 leading-tight'}>
                      {results.cagr}% per annum
                    </p>
                  </motion.div>

                  <motion.div
                    className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="text-2xl">💰</span>
                      <h4 className="font-semibold text-base text-gray-700">Total Returns</h4>
                    </div>
                    <p className={(responsive.typography.heading) + ' font-bold text-blue-600 leading-tight'}>
                      {formatCurrency(results.totalReturns || 0)}
                    </p>
                  </motion.div>

                  <motion.div
                    className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-6 border border-purple-100"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="text-2xl">📊</span>
                      <h4 className="font-semibold text-base text-gray-700">Total Return %</h4>
                    </div>
                    <p className={(responsive.typography.heading) + ' font-bold text-purple-600 leading-tight'}>
                      {results.totalReturnPercentage}%
                    </p>
                  </motion.div>
                </>
              )}

              {safeInputs.calculationType === 'roi' && (
                <>
                  <motion.div
                    className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="text-2xl">📈</span>
                      <h4 className="font-semibold text-base text-gray-700">ROI</h4>
                    </div>
                    <p className={(responsive.typography.heading) + ' font-bold text-green-600 leading-tight'}>
                      {results.roi}%
                    </p>
                  </motion.div>

                  <motion.div
                    className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="text-2xl">💰</span>
                      <h4 className="font-semibold text-base text-gray-700">Net Profit</h4>
                    </div>
                    <p className={(responsive.typography.heading) + ' font-bold text-blue-600 leading-tight'}>
                      {formatCurrency(results.netProfit || 0)}
                    </p>
                  </motion.div>
                </>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📈</div>
              <h4 className="text-xl font-semibold text-gray-700 mb-2">
                {safeInputs.calculationType === 'cagr' ? 'CAGR Calculator' : 'ROI Calculator'}
              </h4>
              <p className="text-gray-500">Enter your investment details to see the analysis</p>
            </div>
          )}
        </motion.div>
      </MobileGrid>

      {/* PDF Export */}
      {results && (
        <motion.div
          className="mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <CommonPDFExport
          calculatorName="CAGR Calculator"
          inputs={{
            'Initial Investment': formatCurrency(inputs.initialValue),
            'Final Value': formatCurrency(inputs.finalValue),
            'Investment Period': (inputs.timePeriod) + ' years',
            'Investment Type': inputs.investmentType || "General Investment",
            'Total Return': formatCurrency(parseFloat(inputs.finalValue) - parseFloat(inputs.initialValue)),
            'Absolute Return': ((((parseFloat(inputs.finalValue) - parseFloat(inputs.initialValue)) / parseFloat(inputs.initialValue)) * 100).toFixed(2)) + '%',
            'Investment Duration': (parseInt(inputs.timePeriod) * 12) + ' months'
          }}
          results={{
            'CAGR (Compound Annual Growth Rate)': `${results.cagr.toFixed(2)}% p.a.`,
            'Total Return': formatCurrency(parseFloat(inputs.finalValue) - parseFloat(inputs.initialValue)),
            'Return Multiple': `${(parseFloat(inputs.finalValue) / parseFloat(inputs.initialValue)).toFixed(2)}x`,
            'Absolute Return Percentage': ((((parseFloat(inputs.finalValue) - parseFloat(inputs.initialValue)) / parseFloat(inputs.initialValue)) * 100).toFixed(2)) + '%',
            'Annualized Return': (results.cagr.toFixed(2)) + '%',
            'Investment Doubled In': ((Math.log(2) / Math.log(1 + results.cagr / 100)).toFixed(1)) + ' years',
            'Average Annual Growth': formatCurrency((parseFloat(inputs.finalValue) - parseFloat(inputs.initialValue)) / parseInt(inputs.timePeriod)),
            'Monthly Equivalent Return': ((((Math.pow(1 + results.cagr / 100 || 1, 1/12 || 1) - 1) * 100).toFixed(3)) + '%')
          }}
        />
        </motion.div>
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
