import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useComparison } from '../contexts/ComparisonContext'
import { useCurrency } from '../contexts/CurrencyContext'
import { useViewMode } from '../contexts/ViewModeContext'
import { useCalculatorState, generateCalculatorShareURL } from '../hooks/useCalculatorState'
import { addMobileResponsivenessSEO, addPDFExportSEO, addChartResponsivenessSEO } from '../utils/seo'
import useMobileResponsive from '../hooks/useMobileResponsive'
import CommonPDFExport from '../components/CommonPDFExport'
import { NumberInput } from '../components/common/inputs'
import CompactCurrencyDisplay from '../components/CompactCurrencyDisplay'
import CalculatorLayout, { InputSection, ResultsSection, ResultCard, GradientResultCard } from '../components/CalculatorLayout'
import UniversalRelatedCalculators from '../components/UniversalRelatedCalculators'
import MobileLayout, { MobileGrid } from '../components/MobileLayout'

export default function RDCalculator({ onAddToComparison, categoryColor = 'green', currentCalculatorId, calculatorData, onCalculatorSelect }) {
  const { addToComparison } = useComparison()
  const { formatCurrency } = useCurrency()
  const { isMobile } = useViewMode()

  const defaultInputs = {
    monthlyDeposit: '',
    interestRate: '',
    timePeriod: ''
  }

  const {
    inputs,
    results,
    setResults,
    handleInputChange,
    resetCalculator
  } = useCalculatorState('rd_', defaultInputs)

  const [yearlyBreakdown, setYearlyBreakdown] = useState([])

  // RD calculation function
  const calculateRD = useCallback(() => {
    const monthlyDeposit = parseFloat(inputs.monthlyDeposit) || 0
    const annualRate = parseFloat(inputs.interestRate) || 0
    const timePeriod = parseFloat(inputs.timePeriod) || 0

    if (monthlyDeposit <= 0 || annualRate <= 0 || timePeriod <= 0) {
      setResults(null)
      setYearlyBreakdown([])
      return
    }

    const months = timePeriod * 12
    const monthlyRate = annualRate / 100 / 12

    // RD Formula: M = P * [((1 + r)^n - 1) / r] * (1 + r)
    const maturityAmount = monthlyDeposit *
      (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate))

    const totalDeposits = monthlyDeposit * months
    const totalInterest = maturityAmount - totalDeposits

    // Generate yearly breakdown
    const breakdown = []
    for (let year = 1; year <= timePeriod; year++) {
      const monthsCompleted = year * 12
      const depositsToDate = monthlyDeposit * monthsCompleted

      // Calculate RD value at end of this year
      const rdValue = monthlyDeposit *
        (((Math.pow(1 + monthlyRate, monthsCompleted) - 1) / monthlyRate) * (1 + monthlyRate))

      breakdown.push({
        year,
        deposits: monthlyDeposit * 12,
        totalDeposits: depositsToDate,
        value: Math.round(rdValue),
        interest: Math.round(rdValue - depositsToDate)
      })
    }

    // Calculate effective yield
    const effectiveYield = totalDeposits > 0 ? ((totalInterest / totalDeposits) * 100) : 0

    setResults({
      maturityAmount: Math.round(maturityAmount),
      totalDeposits: Math.round(totalDeposits),
      totalInterest: Math.round(totalInterest),
      interestEarned: Math.round(totalInterest), // Add for PDF export compatibility
      effectiveYield: effectiveYield.toFixed(2), // Add effective yield calculation
      timePeriod,
      months
    })

    setYearlyBreakdown(breakdown)
  }, [inputs, setResults])

  // Trigger calculation when inputs change
  useEffect(() => {
    if (inputs.monthlyDeposit && inputs.interestRate && inputs.timePeriod) {
      const timeoutId = setTimeout(() => {
        calculateRD()
      }, 100)
      return () => clearTimeout(timeoutId)
    }
  }, [
    inputs.monthlyDeposit,
    inputs.interestRate,
    inputs.timePeriod
  ])

  // Share calculation
  const shareCalculation = () => {
    const shareableURL = generateCalculatorShareURL('rd', inputs, results)

    const shareData = {
      title: 'finclamp.com - RD Calculator Results',
      text: `RD Calculation: Monthly Deposit ${formatCurrency(inputs.monthlyDeposit)}, Maturity: ${formatCurrency(results?.maturityAmount)}`,
      url: shareableURL
    }

    if (navigator.share) {
      navigator.share(shareData)
    } else {
      navigator.clipboard.writeText(shareableURL)
      alert('Shareable link copied to clipboard! Your friend can use this link to see the same calculation.')
    }
  }

  // Add to comparison
  const handleAddToComparison = () => {
    if (results && addToComparison) {
      const comparisonData = {
        calculator: 'RD Calculator',
        inputs: {
          monthlyDeposit: inputs.monthlyDeposit,
          interestRate: (inputs.interestRate) + '%',
          timePeriod: (inputs.timePeriod) + ' years'
        },
        results: {
          maturityAmount: results.maturityAmount,
          totalDeposits: results.totalDeposits,
          totalInterest: results.totalInterest
        }
      }

      addToComparison(comparisonData)

      if (onAddToComparison) {
        onAddToComparison(comparisonData)
      }
    }
  }

  // Use yearly breakdown for chart data
  const chartData = yearlyBreakdown

  return (
    <CalculatorLayout
      title="RD Calculator"
      description="Calculate your Recurring Deposit maturity amount and returns"
      icon="🏦"
      currentCalculatorId={currentCalculatorId}
      calculatorData={calculatorData}
      onCalculatorSelect={onCalculatorSelect}
      inputs={inputs}
      results={results}
    >
      {/* Input Section */}
      <InputSection title="RD Details" icon="💰" onReset={resetCalculator}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monthly Deposit
            </label>
            <NumberInput
              value={inputs.monthlyDeposit}
              onChange={(value) => handleInputChange('monthlyDeposit', value)}
              placeholder="Enter amount"
              prefix={formatCurrency(0).replace(/[\d.,]/g, '')}
              step="1"
              min="0"
              allowDecimals={true}
              allowNegative={false}
              className="w-full py-2 text-sm font-medium border-2 rounded-xl transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Interest Rate
            </label>
            <NumberInput
              value={inputs.interestRate}
              onChange={(value) => handleInputChange('interestRate', value)}
              placeholder="7.5"
              suffix="%"
              step="0.5"
              min="0"
              max="50"
              allowDecimals={true}
              allowNegative={false}
              className="w-full py-2 text-sm font-medium border-2 rounded-xl transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time Period
            </label>
            <NumberInput
              value={inputs.timePeriod}
              onChange={(value) => handleInputChange('timePeriod', value)}
              placeholder="Enter value"
              suffix="years"
              step="1"
              min="1"
              max="50"
              allowDecimals={false}
              allowNegative={false}
              className="w-full py-2 text-sm font-medium border-2 rounded-xl transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>
      </InputSection>

      {/* Results Section */}
      <ResultsSection
        title="Results"
        icon="📊"
        results={results}
        onShare={shareCalculation}
        onAddToComparison={handleAddToComparison}
        emptyStateMessage="Enter RD details to see calculation"
      >
        {/* Main Result */}
        <div className="mb-8">
          <GradientResultCard
            title="Maturity Amount"
            value={results?.maturityAmount}
            gradient="from-green-500 to-emerald-500"
            icon="💰"
          />
        </div>

        {/* Key Metrics - 2 per row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <ResultCard
            title="Total Deposits"
            value={results?.totalDeposits}
            description="Total amount you will deposit over the investment period"
            icon="💵"
          />

          <ResultCard
            title="Total Interest Earned"
            value={results?.totalInterest}
            description="Interest earned on your recurring deposits"
            icon="📈"
          />

          <ResultCard
            title="Investment Duration"
            value={(results?.timePeriod) + ' years (' + results?.months + ' months)'}
            description="Total time period for your RD investment"
            icon="⏰"
          />

          <ResultCard
            title="Monthly Deposit"
            value={parseFloat(inputs.monthlyDeposit)}
            description="Fixed amount deposited every month"
            icon="🏦"
          />
        </div>

        {/* Growth Chart */}
        {results && chartData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="w-full mt-8"
          >
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl overflow-hidden p-4 sm:p-6 shadow-lg border border-green-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-green-800">📈 RD Growth Visualization</h3>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-gray-500 rounded-full mr-2"></div>
                    <span className="text-gray-700">Total Deposits</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-green-700">RD Value</span>
                  </div>
                </div>
              </div>

              {/* Chart Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-center">
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="text-xs text-gray-500 mb-1">Initial Deposit</div>
                  <div className="font-semibold text-green-600">
                    <CompactCurrencyDisplay value={chartData[0]?.totalDeposits || 0} />
                  </div>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="text-xs text-gray-500 mb-1">Final Deposits</div>
                  <div className="font-semibold text-gray-600">
                    <CompactCurrencyDisplay value={chartData[chartData.length - 1]?.totalDeposits || 0} />
                  </div>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="text-xs text-gray-500 mb-1">Maturity Value</div>
                  <div className="font-semibold text-green-600">
                    <CompactCurrencyDisplay value={chartData[chartData.length - 1]?.value || 0} />
                  </div>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="text-xs text-gray-500 mb-1">Interest Earned</div>
                  <div className="font-semibold text-green-600">
                    <CompactCurrencyDisplay value={(chartData[chartData.length - 1]?.value || 0) - (chartData[chartData.length - 1]?.totalDeposits || 0)} />
                  </div>
                </div>
              </div>

              <div className="h-80 sm:h-96 w-full overflow-hidden">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{ top: 20, right: 15, left: 40, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#dcfce7" />
                    <XAxis
                      dataKey="year"
                      stroke="#6b7280"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                      label={{ value: 'Years', position: 'insideBottom', offset: -10 }}
                    />
                    <YAxis
                      tickFormatter={(value) => {
                        const compactDisplay = value >= 10000000 ? `₹${(value/10000000).toFixed(1)}Cr` :
                                              value >= 100000 ? `₹${(value/100000).toFixed(1)}L` :
                                              value >= 1000 ? `₹${(value/1000).toFixed(1)}K` : `₹${value}`
                        return compactDisplay
                      }}
                      stroke="#6b7280"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                      width={35}
                    />
                    <Tooltip
                      formatter={(value, name) => [<CompactCurrencyDisplay value={value} showTooltip={false} />, name === 'totalDeposits' ? 'Total Deposits' : 'RD Value']}
                      labelFormatter={(label) => `Year: ${label}`}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="totalDeposits"
                      stroke="#6B7280"
                      strokeWidth={3}
                      name="Total Deposits"
                      dot={{ fill: '#6B7280', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#6B7280', strokeWidth: 2 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#10B981"
                      strokeWidth={3}
                      name="RD Value"
                      dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        )}
      </ResultsSection>

      {/* PDF Export */}
      {results && inputs.monthlyDeposit && inputs.interestRate && inputs.timePeriod && (
        <CommonPDFExport
          calculatorName="RD Calculator"
          inputs={{
            'Monthly Deposit': formatCurrency(inputs.monthlyDeposit),
            'Interest Rate': inputs.interestRate + '% p.a.',
            'Time Period': inputs.timePeriod + ' years',
            'Total Deposits': (parseInt(inputs.timePeriod) * 12) + ' deposits',
            'Annual Deposit': formatCurrency(parseFloat(inputs.monthlyDeposit) * 12),
            'Quarterly Interest Rate': (parseFloat(inputs.interestRate) / 4).toFixed(4) + '%',
            'Compounding': 'Quarterly compounding',
            'Deposit Frequency': 'Monthly'
          }}
          results={{
            'Maturity Amount': formatCurrency(results.maturityAmount || 0),
            'Total Deposits': formatCurrency(results.totalDeposits || 0),
            'Interest Earned': formatCurrency(results.interestEarned || results.totalInterest),
            'Return Percentage': ((results.interestEarned || results.totalInterest) / results.totalDeposits * 100).toFixed(2) + '%',
            'Effective Annual Return': ((Math.pow(results.maturityAmount / results.totalDeposits, 1 / parseInt(inputs.timePeriod)) - 1) * 100).toFixed(2) + '%',
            'Average Monthly Growth': formatCurrency((results.maturityAmount - results.totalDeposits) / (parseInt(inputs.timePeriod) * 12)),
            'Final Month Value': formatCurrency(results.maturityAmount || 0),
            'Investment Multiple': (results.maturityAmount / results.totalDeposits).toFixed(2) + 'x'
          }}
        />
      )}
    </CalculatorLayout>
  )
}
