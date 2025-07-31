
import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useComparison } from '../contexts/ComparisonContext'
import { useCurrency } from '../contexts/CurrencyContext'
import { useViewMode } from '../contexts/ViewModeContext'
import useMobileResponsive from '../hooks/useMobileResponsive'
import { useURLStateObject, generateShareableURL } from '../hooks/useURLState'
import { NumberInput } from '../components/common/inputs'
import CommonPDFExport from '../components/CommonPDFExport'
import UniversalRelatedCalculators from '../components/UniversalRelatedCalculators'
import ResetButton from '../components/ResetButton'
import MobileLayout, { MobileGrid } from '../components/MobileLayout'


export default function SWPCalculator({ onAddToComparison, categoryColor = 'purple', currentCalculatorId, calculatorData, onCalculatorSelect }) {
  const { addToComparison } = useComparison()
  const { formatCurrency } = useCurrency()
  const { isMobile } = useViewMode()
  const { responsive } = useMobileResponsive()

  const initialInputs = {
    initialInvestment: '',
    monthlyWithdrawal: '',
    annualReturn: '12',
    withdrawalPeriodYears: '20'
  }

  // Use URL state management for inputs
  const [inputs, setInputs] = useURLStateObject('swp_')
  const { getShareableURL } = generateShareableURL('swp_')

  // Initialize inputs with defaults if empty
  useEffect(() => {
    if (Object.keys(inputs).length === 0) {
      setInputs(prev => ({ ...initialInputs, ...prev }))
    }
  }, [])

  const [results, setResults] = useState(null)
  const [yearlyBreakdown, setYearlyBreakdown] = useState([])
  const [deferredPrompt, setDeferredPrompt] = useState(null)

  const handleInputChange = (field, value) => {
    const newInputs = { ...inputs, [field]: value }
    setInputs(newInputs)
  }

  const handleReset = () => {
    setInputs(initialInputs)
    setResults(null)
    setYearlyBreakdown([])
  }

  const calculateSWP = useCallback(() => {
    const principal = parseFloat(inputs.initialInvestment) || 0
    const monthlyWithdrawal = parseFloat(inputs.monthlyWithdrawal) || 0
    const annualReturn = (parseFloat(inputs.annualReturn) || 0) / 100
    const monthlyReturn = annualReturn / 12
    const totalMonths = (parseFloat(inputs.withdrawalPeriodYears) || 0) * 12

    if (principal === 0 || monthlyWithdrawal === 0 || totalMonths === 0) return

    let remainingBalance = principal
    let totalWithdrawn = 0
    let breakdown = []

    for (let year = 1; year <= Math.ceil(totalMonths / 12); year++) {
      const startBalance = remainingBalance
      let yearWithdrawn = 0
      
      for (let month = 1; month <= 12 && ((year - 1) * 12 + month) <= totalMonths; month++) {
        // Apply monthly return
        remainingBalance = remainingBalance * (1 + monthlyReturn)
        
        // Withdraw monthly amount
        if (remainingBalance >= monthlyWithdrawal) {
          remainingBalance -= monthlyWithdrawal
          yearWithdrawn += monthlyWithdrawal
          totalWithdrawn += monthlyWithdrawal
        } else {
          // Partial withdrawal if balance is less than monthly withdrawal
          yearWithdrawn += remainingBalance
          totalWithdrawn += remainingBalance
          remainingBalance = 0
          break
        }
      }

      breakdown.push({
        year,
        startBalance: startBalance,
        yearWithdrawn: yearWithdrawn,
        endBalance: remainingBalance,
        totalWithdrawn: totalWithdrawn
      })

      if (remainingBalance === 0) break
    }

    const balanceExhaustedYear = breakdown.find(year => year.endBalance === 0)?.year || null

    setResults({
      totalWithdrawn: totalWithdrawn.toFixed(0),
      remainingBalance: remainingBalance.toFixed(0),
      balanceExhaustedYear: balanceExhaustedYear,
      monthlyWithdrawal: monthlyWithdrawal.toFixed(0)
    })

    setYearlyBreakdown(breakdown)
  }, [inputs])

  useEffect(() => {
    if (inputs.initialInvestment && inputs.monthlyWithdrawal && inputs.annualReturn && inputs.withdrawalPeriodYears) {
      calculateSWP()
    }
  }, [inputs.initialInvestment, inputs.monthlyWithdrawal, inputs.annualReturn, inputs.withdrawalPeriodYears])

  const handleAddToComparison = () => {
    if (results) {
      const comparisonData = {
        type: 'SWP',
        name: `SWP - ${formatCurrency(inputs.initialInvestment)} Initial`,
        inputs: {
          'Initial Investment': formatCurrency(inputs.initialInvestment),
          'Monthly Withdrawal': formatCurrency(inputs.monthlyWithdrawal),
          'Withdrawal Period': (inputs.withdrawalPeriodYears) + ' years',
          'Expected Annual Return': (inputs.annualReturn) + '%',

        },
        results: {
          'Total Withdrawn': formatCurrency(results.totalWithdrawn || 0),
          'Remaining Balance': formatCurrency(results.remainingBalance || 0),
          'Balance Exhausted': results.balanceExhaustedYear ? `Year ${results.balanceExhaustedYear}` : 'Never'
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
      title: 'finclamp.com - SWP Calculator Results',
      text: `SWP Calculation: Initial Investment ${formatCurrency(inputs.initialInvestment)}, Monthly Withdrawal ${formatCurrency(inputs.monthlyWithdrawal)} for ${inputs.withdrawalPeriodYears} years. Remaining Balance: ${formatCurrency(results?.remainingBalance)}`,
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
              📉 SWP Details
            </h3>
            <ResetButton onReset={handleReset} />
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                💰 Initial Investment
              </label>
              <NumberInput
                value={inputs.initialInvestment}
                onChange={(value) => handleInputChange('initialInvestment', value)}
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📤 Monthly Withdrawal
              </label>
              <NumberInput
                value={inputs.monthlyWithdrawal}
                onChange={(value) => handleInputChange('monthlyWithdrawal', value)}
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📈 Expected Annual Return (%)
              </label>
              <NumberInput
                value={inputs.annualReturn}
                onChange={(value) => handleInputChange('annualReturn', value)}
                placeholder="Enter rate"
                suffix="%"
                step="0.5"
                min="0"
                allowDecimals={true}
                allowNegative={false}
                className="w-full py-2 text-sm font-medium border-2 rounded-xl transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📅 Withdrawal Period (Years)
              </label>
              <NumberInput
                value={inputs.withdrawalPeriodYears}
                onChange={(value) => handleInputChange('withdrawalPeriodYears', value)}
                placeholder="Enter years"
                suffix="years"
                step="1"
                min="1"
                allowDecimals={false}
                allowNegative={false}
                className="w-full py-2 text-sm font-medium border-2 rounded-xl transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

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
                  style={{ backgroundColor: '#EC4899' }}
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
            📊 Results
          </h3>

          {results ? (
            <div className="grid grid-cols-2 gap-6">
              <motion.div
                className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-6 border border-pink-100"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">💰</span>
                  <h4 className="font-semibold text-base text-gray-700">Total Withdrawn</h4>
                </div>
                <p className={(responsive.typography.heading) + ' font-bold text-pink-600 leading-tight'}>
                  {formatCurrency(results.totalWithdrawn || 0)}
                </p>
              </motion.div>

              <motion.div
                className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">💼</span>
                  <h4 className="font-semibold text-base text-gray-700">Remaining Balance</h4>
                </div>
                <p className={(responsive.typography.heading) + ' font-bold text-blue-600 leading-tight'}>
                  {formatCurrency(results.remainingBalance || 0)}
                </p>
              </motion.div>

              <motion.div
                className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-100 col-span-2"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">⏰</span>
                  <h4 className="font-semibold text-base text-gray-700">Balance Status</h4>
                </div>
                <p className="text-lg font-bold text-orange-600 leading-tight">
                  {results.balanceExhaustedYear
                    ? `Balance exhausted in Year ${results.balanceExhaustedYear}`
                    : 'Balance lasts beyond withdrawal period'}
                </p>
              </motion.div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📉</div>
              <h4 className="text-xl font-semibold text-gray-700 mb-2">SWP Calculator</h4>
              <p className="text-gray-500">Enter your investment details to see withdrawal projections</p>
            </div>
          )}
        </motion.div>
      </MobileGrid>

      {/* Yearly Breakdown Table */}
      {yearlyBreakdown.length > 0 && (
        <motion.div
          className="mt-6 bg-white rounded-xl p-6 shadow-lg border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-xl font-bold mb-6" style={{ color: '#1F2937' }}>
            📈 Yearly Breakdown
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-2 font-semibold text-gray-700">Year</th>
                  <th className="text-right py-3 px-2 font-semibold text-gray-700">Start Balance</th>
                  <th className="text-right py-3 px-2 font-semibold text-gray-700">Withdrawn</th>
                  <th className="text-right py-3 px-2 font-semibold text-gray-700">End Balance</th>
                </tr>
              </thead>
              <tbody>
                {yearlyBreakdown.map((year, index) => (
                  <motion.tr
                    key={index}
                    className={'border-b border-gray-100 ' + (year.endBalance === 0 ? 'bg-red-50' : '')}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <td className="py-3 px-2 font-medium">{year.year}</td>
                    <td className="py-3 px-2 text-right">{formatCurrency(year.startBalance)}</td>
                    <td className="py-3 px-2 text-right text-red-600">{formatCurrency(year.yearWithdrawn)}</td>
                    <td className="py-3 px-2 text-right font-semibold">{formatCurrency(year.endBalance)}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* PDF Export */}
      {results && (
        <motion.div
          className="mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <CommonPDFExport
          calculatorName="SWP Calculator"
          inputs={{
            'Initial Investment': formatCurrency(inputs.initialInvestment),
            'Monthly Withdrawal': formatCurrency(inputs.monthlyWithdrawal),
            'Expected Return': `${inputs.expectedReturn}% p.a.`,
            'Withdrawal Period': (inputs.withdrawalPeriod) + ' years',
            'Investment Type': "Systematic Withdrawal Plan",
            'Annual Withdrawal': formatCurrency(parseFloat(inputs.monthlyWithdrawal) * 12),
            'Withdrawal Rate': `${((parseFloat(inputs.monthlyWithdrawal) * 12) / parseFloat(inputs.initialInvestment) * 100).toFixed(2)}% p.a.`,
            'Monthly Return Rate': ((parseFloat(inputs.expectedReturn) / 12).toFixed(2)) + '%'
          }}
          results={{
            'Total Withdrawals': formatCurrency(results.totalWithdrawals || 0),
            'Remaining Corpus': formatCurrency(results.remainingCorpus || 0),
            'Capital Appreciation': formatCurrency(results.capitalAppreciation || 0),
            'Corpus Depletion Time': (results.depletionTime) + ' years',
            'Sustainable Withdrawal': formatCurrency(results.sustainableWithdrawal || 0),
            'Monthly Income': formatCurrency(inputs.monthlyWithdrawal),
            'Annual Income': formatCurrency(parseFloat(inputs.monthlyWithdrawal) * 12),
            'Income Sustainability': results.remainingCorpus > 0 ? "Sustainable" : "Corpus Depleted"
          }}
        />
        </motion.div>
      )}

      {/* Universal Related Calculators */}
      <UniversalRelatedCalculators
        currentCalculatorId={currentCalculatorId}
        calculatorData={calculatorData}
        onCalculatorSelect={onCalculatorSelect}
      />
    </MobileLayout>
  )
}
