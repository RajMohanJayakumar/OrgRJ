import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useComparison } from '../contexts/ComparisonContext'
import { useCurrency } from '../contexts/CurrencyContext'
import { useViewMode } from '../contexts/ViewModeContext'
import useMobileResponsive from '../hooks/useMobileResponsive'
import { addMobileResponsivenessSEO, addPDFExportSEO, addChartResponsivenessSEO } from '../utils/seo'
import { useURLStateObject, generateShareableURL } from '../hooks/useURLState'
import CommonPDFExport from '../components/CommonPDFExport'
import CompactCurrencyDisplay from '../components/CompactCurrencyDisplay'
import { NumberInput } from '../components/common/inputs'
import ModernInputSection from '../components/ModernInputSection'
import ModernResultsSection, { ModernResultGrid, ModernSummaryCard } from '../components/ModernResultsSection'
import RelatedCalculators from '../components/RelatedCalculators'
import { PiggyBank, Calculator } from 'lucide-react'
import MobileLayout, { MobileGrid } from '../components/MobileLayout'

function PPFCalculator({ onAddToComparison, currentCalculatorId, calculatorData, onCalculatorSelect }) {
  const { addToComparison } = useComparison()
  const { formatCurrency } = useCurrency()
  const { isMobile } = useViewMode()
  const { responsive } = useMobileResponsive()

  const initialInputs = {
    annualDeposit: '',
    timePeriod: '15', // PPF has 15-year lock-in
    interestRate: '7.1', // Current PPF rate
    calculationType: 'maturity'
  }

  // Use URL state management for inputs
  const [inputs, setInputs] = useURLStateObject('ppf_')
  const [results, setResults] = useState(null)
  const [yearlyBreakdown, setYearlyBreakdown] = useState([])

  // Initialize inputs with defaults if empty
  useEffect(() => {
    if (Object.keys(inputs).length === 0) {
      setInputs(prev => ({ ...initialInputs, ...prev }))
    }
  }, [])

  // Enhanced SEO for mobile responsiveness, PDF export, and charts
  useEffect(() => {
    addMobileResponsivenessSEO();
    addPDFExportSEO();
    addChartResponsivenessSEO();
    
    // Update page title and meta description
    document.title = 'PPF Calculator - Public Provident Fund Calculator | Mobile Optimized';
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Calculate PPF maturity amount and returns with mobile-friendly interface. Interactive charts and professional PDF reports.');
    }
    
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', 'PPF calculator, public provident fund, tax saving calculator, mobile responsive, PDF export');
    }
  }, []);

  const handleInputChange = (field, value) => {
    const newInputs = { ...inputs, [field]: value }
    setInputs(newInputs)
  }

  const handleReset = () => {
    setInputs(initialInputs)
    setResults(null)
    setYearlyBreakdown([])
    // Clear URL parameters
    window.history.replaceState({}, document.title, window.location.pathname)
  }

  const calculatePPF = () => {
    const annualDeposit = parseFloat(inputs.annualDeposit) || 0
    const timePeriod = parseFloat(inputs.timePeriod) || 15
    const annualRate = parseFloat(inputs.interestRate) || 7.1

    if (annualDeposit > 0 && timePeriod > 0 && annualRate > 0) {
      // PPF calculation with compound interest
      const rate = annualRate / 100
      let totalInvestment = annualDeposit * timePeriod
      let breakdown = []
      let cumulativeBalance = 0

      // Calculate year by year with proper compounding
      for (let year = 1; year <= timePeriod; year++) {
        // Add this year's deposit
        cumulativeBalance += annualDeposit

        // Apply interest on the entire balance
        cumulativeBalance = cumulativeBalance * (1 + rate)

        breakdown.push({
          year: year,
          deposit: annualDeposit,
          totalDeposited: annualDeposit * year,
          interestEarned: Math.round(cumulativeBalance - (annualDeposit * year)),
          balance: Math.round(cumulativeBalance)
        })
      }

      const maturityAmount = cumulativeBalance
      const totalInterest = maturityAmount - totalInvestment

      setResults({
        maturityAmount: Math.round(maturityAmount),
        totalInvestment: Math.round(totalInvestment),
        totalInterest: Math.round(totalInterest),
        annualDeposit: annualDeposit
      })

      setYearlyBreakdown(breakdown)
    } else {
      setResults(null)
      setYearlyBreakdown([])
    }
  }

  const shareCalculation = () => {
    const shareableURL = generateShareableURL('ppf', inputs, results)
    const shareData = {
      title: 'finclamp.com - PPF Calculator Results',
      text: `PPF Calculation: Annual Deposit ${formatCurrency(inputs.annualDeposit)}, Maturity ${formatCurrency(results?.maturityAmount)}`,
      url: shareableURL
    }

    if (navigator.share) {
      navigator.share(shareData)
    } else {
      navigator.clipboard.writeText(shareableURL)
      alert('Shareable link copied to clipboard! Your friend can use this link to see the same calculation.')
    }
  }

  const handleAddToComparison = () => {
    if (results) {
      const comparisonData = {
        calculator: 'PPF Calculator',
        inputs: {
          'Annual Deposit': `₹${inputs.annualDeposit}`,
          'Interest Rate': (inputs.interestRate) + '%',
          'Time Period': (inputs.timePeriod) + ' years'
        },
        results: {
          'Maturity Amount': `₹${results.maturityAmount?.toLocaleString()}`,
          'Total Investment': `₹${results.totalInvestment?.toLocaleString()}`,
          'Total Interest': `₹${results.totalInterest?.toLocaleString()}`
        },
        timestamp: new Date().toISOString()
      }

      addToComparison(comparisonData)

      if (onAddToComparison) {
        onAddToComparison(comparisonData)
      }
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

  useEffect(() => {
    if (inputs.annualDeposit && inputs.interestRate && inputs.timePeriod) {
      calculatePPF()
    }
  }, [inputs])

  const pieData = results ? [
    { name: 'Principal', value: results.totalInvestment, fill: '#10B981' },
    { name: 'Interest', value: results.totalInterest, fill: '#3B82F6' }
  ] : []

  return (
    <MobileLayout className={'' + (isMobile ? 'space-y-4' : 'space-y-8') + ' calculator-main-container'}>
      {/* Header */}
      <motion.div className={'text-center ' + (isMobile ? 'mb-4' : 'mb-6') + ''}>
        <h2 className={(isMobile ? 'text-2xl' : 'text-3xl') + ' font-bold text-gray-900 mb-2 flex items-center justify-center gap-3'}>
          🛡️ PPF Calculator
        </h2>
        <p className={isMobile ? 'text-sm text-gray-600' : 'text-base text-gray-600'}>Calculate your Public Provident Fund maturity amount with tax benefits</p>
      </motion.div>

      {/* Main Content - Single Row Layout */}
      <MobileGrid columns={2} className={isMobile ? 'mt-4' : 'mt-6'}>

          {/* Left Column - PPF Details */}
          <motion.div
            className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold" style={{ color: '#1F2937' }}>
                🛡️ PPF Investment Details
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
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                <p className="text-sm text-blue-800">
                  💡 <strong>PPF Benefits:</strong> Tax deduction under 80C, tax-free interest, 15-year lock-in period
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Annual Deposit Amount
                </label>
                <NumberInput
                  value={inputs.annualDeposit}
                  onChange={(value) => handleInputChange('annualDeposit', value)}
                  placeholder="150000"
                  prefix={formatCurrency(0).replace(/[\d.,]/g, '')}
                  step="1"
                  min="500"
                  allowDecimals={true}
                  allowNegative={false}
                  className="w-full py-2 text-sm font-medium border-2 rounded-xl transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interest Rate (% per annum)
                </label>
                <NumberInput
                  value={inputs.interestRate}
                  onChange={(value) => handleInputChange('interestRate', value)}
                  placeholder="7.1"
                  suffix="%"
                  step="0.5"
                  min="0"
                  max="15"
                  allowDecimals={true}
                  allowNegative={false}
                  className="w-full py-2 text-sm font-medium border-2 rounded-xl transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Investment Period (Years)
                </label>
                <NumberInput
                  value={inputs.timePeriod}
                  onChange={(value) => handleInputChange('timePeriod', value)}
                  placeholder="15"
                  suffix="years"
                  step="1"
                  min="15"
                  max="50"
                  allowDecimals={false}
                  allowNegative={false}
                  className="w-full py-2 text-sm font-medium border-2 rounded-xl transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                <p className="text-sm text-amber-800">
                  ⚠️ <strong>Note:</strong> PPF has a mandatory 15-year lock-in period
                </p>
              </div>

              {/* Quick Actions */}
              {results && (
                <div className="pt-4 border-t border-gray-100 space-y-3">
                  <motion.button
                    onClick={handleAddToComparison}
                    className="w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 cursor-pointer text-sm"
                    style={{ backgroundColor: '#7C3AED' }}
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
              📊 PPF Results
            </h3>

            {results ? (
              <>
                {/* Main Result */}
                <div className="mb-8">
                  <motion.div
                    className="bg-gradient-to-r from-purple-500 to-indigo-600 p-6 rounded-lg text-white text-center"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center justify-center mb-2">
                      <span className="text-2xl mr-2">💰</span>
                      <p className="text-lg font-medium opacity-90">Maturity Amount</p>
                    </div>
                    <p className="text-4xl font-bold">
                      <CompactCurrencyDisplay value={results.maturityAmount} />
                    </p>
                  </motion.div>
                </div>

                {/* Key Metrics - 2 per row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div
                    className="p-6 rounded-lg border bg-blue-50 text-blue-600 border-blue-200"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium opacity-80">Total Investment</p>
                      <span className="text-lg">🏦</span>
                    </div>
                    <p className="font-bold text-2xl text-blue-600 mb-2">
                      <CompactCurrencyDisplay value={results.totalInvestment} />
                    </p>
                    <p className="text-xs text-gray-500 leading-relaxed">Total amount deposited over {inputs.timePeriod} years</p>
                  </motion.div>

                  <motion.div
                    className="p-6 rounded-lg border bg-green-50 text-green-600 border-green-200"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium opacity-80">Total Interest Earned</p>
                      <span className="text-lg">📈</span>
                    </div>
                    <p className="font-bold text-2xl text-green-600 mb-2">
                      <CompactCurrencyDisplay value={results.totalInterest} />
                    </p>
                    <p className="text-xs text-gray-500 leading-relaxed">Interest earned through compound growth</p>
                  </motion.div>

                  <motion.div
                    className="p-6 rounded-lg border bg-orange-50 text-orange-600 border-orange-200"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium opacity-80">Annual Deposit</p>
                      <span className="text-lg">💎</span>
                    </div>
                    <p className="font-bold text-2xl text-orange-600 mb-2">
                      {formatCurrency(inputs.annualDeposit)}
                    </p>
                    <p className="text-xs text-gray-500 leading-relaxed">Fixed amount deposited every year</p>
                  </motion.div>

                  <motion.div
                    className="p-6 rounded-lg border bg-purple-50 text-purple-600 border-purple-200"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium opacity-80">Growth Multiplier</p>
                      <span className="text-lg">🚀</span>
                    </div>
                    <p className="font-bold text-2xl text-purple-600 mb-2">
                      {(parseFloat(results.maturityAmount) / parseFloat(results.totalInvestment)).toFixed(1)}x
                    </p>
                    <p className="text-xs text-gray-500 leading-relaxed">How much your money will grow</p>
                  </motion.div>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📊</div>
                <p className="text-gray-500 text-lg">Enter PPF details to see results</p>
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
                {/* PPF Summary */}
                <motion.div
                  className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <h4 className="text-lg font-bold mb-4 text-gray-800">
                    💼 PPF Summary
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600 text-sm">Annual Deposit</span>
                      <span className="font-semibold text-purple-600 text-sm">{formatCurrency(inputs.annualDeposit)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600 text-sm">Interest Rate</span>
                      <span className="font-semibold text-sm">{inputs.interestRate}% p.a.</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600 text-sm">Investment Period</span>
                      <span className="font-semibold text-sm">{inputs.timePeriod} years</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600 text-sm">Growth Multiplier</span>
                      <span className="font-semibold text-green-600 text-sm">
                        {(parseFloat(results.maturityAmount) / parseFloat(results.totalInvestment)).toFixed(1)}x
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Growth Chart - Full Width */}
                {yearlyBreakdown.length > 0 && (
                  <motion.div
                    className="w-full mt-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl overflow-hidden p-4 sm:p-6 shadow-lg border border-green-200">
                      <div className="flex items-center justify-between mb-6">
                        <h4 className="text-xl font-bold text-green-800">📊 PPF Growth Visualization</h4>
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                            <span className="text-purple-700">Total Deposited</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                            <span className="text-green-700">PPF Balance</span>
                          </div>
                        </div>
                      </div>

                      {/* Chart Stats */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-center">
                        <div className="bg-white rounded-lg p-3 shadow-sm">
                          <div className="text-xs text-gray-500 mb-1">Initial Deposit</div>
                          <div className="font-semibold text-green-600">
                            <CompactCurrencyDisplay value={yearlyBreakdown[0]?.totalDeposited || 0} />
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-3 shadow-sm">
                          <div className="text-xs text-gray-500 mb-1">Total Deposited</div>
                          <div className="font-semibold text-purple-600">
                            <CompactCurrencyDisplay value={yearlyBreakdown[yearlyBreakdown.length - 1]?.totalDeposited || 0} />
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-3 shadow-sm">
                          <div className="text-xs text-gray-500 mb-1">Final Balance</div>
                          <div className="font-semibold text-green-600">
                            <CompactCurrencyDisplay value={yearlyBreakdown[yearlyBreakdown.length - 1]?.balance || 0} />
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-3 shadow-sm">
                          <div className="text-xs text-gray-500 mb-1">Interest Earned</div>
                          <div className="font-semibold text-green-600">
                            <CompactCurrencyDisplay value={(yearlyBreakdown[yearlyBreakdown.length - 1]?.balance || 0) - (yearlyBreakdown[yearlyBreakdown.length - 1]?.totalDeposited || 0)} />
                          </div>
                        </div>
                      </div>

                      <div className="h-80 sm:h-96 w-full overflow-hidden">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={yearlyBreakdown}
                            margin={{ top: 20, right: 15, left: 40, bottom: 20 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="#dcfce7" />
                            <XAxis
                              dataKey="year"
                              stroke="#6b7280"
                              fontSize={10}
                              tickLine={false}
                              axisLine={false}
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
                              formatter={(value, name) => [<CompactCurrencyDisplay value={value} showTooltip={false} />, name]}
                              labelFormatter={(label) => `Year ${label}`}
                              contentStyle={{
                                backgroundColor: 'white',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                              }}
                            />
                            <Line
                              type="monotone"
                              dataKey="totalDeposited"
                              stroke="#8B5CF6"
                              strokeWidth={3}
                              name="Total Deposited"
                              dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                              activeDot={{ r: 6, stroke: '#8B5CF6', strokeWidth: 2 }}
                            />
                            <Line
                              type="monotone"
                              dataKey="balance"
                              stroke="#10B981"
                              strokeWidth={3}
                              name="PPF Balance"
                              dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                              activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
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
          calculatorName="PPF Calculator"
          inputs={{
            'Annual Deposit': formatCurrency(inputs.annualDeposit),
            'Interest Rate': `${inputs.interestRate}% p.a.`,
            'Investment Period': (inputs.timePeriod) + ' years',
            'Current Age': inputs.currentAge ? (inputs.currentAge) + ' years' : "Not specified",
            'Retirement Age': inputs.currentAge ? (parseInt(inputs.currentAge) + parseInt(inputs.timePeriod)) + ' years' : "Not calculated",
            'Monthly Deposit Equivalent': formatCurrency(parseFloat(inputs.annualDeposit) / 12),
            'Tax Regime': "PPF qualifies for EEE (Exempt-Exempt-Exempt) tax benefit"
          }}
          results={{
            'Maturity Amount': formatCurrency(results.maturityAmount || 0),
            'Total Contribution': formatCurrency(results.totalContribution || 0),
            'Interest Earned': formatCurrency(results.interestEarned || 0),
            'Tax Savings (30% bracket)': formatCurrency(results.totalContribution * 0.3),
            'Effective Return': (((results.maturityAmount / results.totalContribution - 1) * 100).toFixed(2)) + '%',
            'CAGR': (((Math.pow(results.maturityAmount / results.totalContribution, 1 / parseInt(inputs.timePeriod)) - 1) * 100).toFixed(2)) + '%',
            'Monthly Maturity Equivalent': formatCurrency(results.maturityAmount / 12),
            'Interest to Principal Ratio': `${(results.interestEarned / results.totalContribution).toFixed(2)}:1`,
            'Real Return (Inflation 6%)': `${(parseFloat(inputs.interestRate) - 6).toFixed(2)}% p.a.`
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

export default PPFCalculator
