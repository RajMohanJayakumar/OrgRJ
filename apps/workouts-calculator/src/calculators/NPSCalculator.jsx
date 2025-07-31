import { useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useComparison } from '../contexts/ComparisonContext'
import { useCurrency } from '../contexts/CurrencyContext'
import { useViewMode } from '../contexts/ViewModeContext'
import { useCalculatorState, generateCalculatorShareURL } from '../hooks/useCalculatorState'
import { addMobileResponsivenessSEO, addPDFExportSEO, addChartResponsivenessSEO } from '../utils/seo'
import useMobileResponsive from '../hooks/useMobileResponsive'
import { NumberInput } from '../components/common/inputs'
import CommonPDFExport from '../components/CommonPDFExport'
import ModernResultsSection from '../components/ModernResultsSection'
import ResetButton from '../components/ResetButton'
import CompactCurrencyDisplay from '../components/CompactCurrencyDisplay'
import RelatedCalculators from '../components/RelatedCalculators'
import MobileLayout from '../components/MobileLayout'
import { Building, Calculator } from 'lucide-react'

export default function NPSCalculator({ onAddToComparison, currentCalculatorId, calculatorData, onCalculatorSelect }) {
  const { addToComparison } = useComparison()
  const { formatCurrency } = useCurrency()
  const { responsive } = useMobileResponsive()
  const { isMobile } = useViewMode()

  const defaultInputs = {
    monthlyContribution: '',
    currentAge: '',
    retirementAge: '60',
    expectedReturn: '10',
    annuityReturn: '6'
  }

  const {
    inputs,
    results,
    setResults,
    handleInputChange,
    resetCalculator
  } = useCalculatorState('nps_', defaultInputs)

  // NPS calculation function
  const calculateNPS = useCallback(() => {
    const monthlyContribution = parseFloat(inputs.monthlyContribution) || 0
    const currentAge = parseFloat(inputs.currentAge) || 0
    const retirementAge = parseFloat(inputs.retirementAge) || 60
    const expectedReturn = parseFloat(inputs.expectedReturn) || 10
    const annuityReturn = parseFloat(inputs.annuityReturn) || 6

    if (monthlyContribution <= 0 || currentAge <= 0 || retirementAge <= currentAge) {
      setResults(null)
      return
    }

    const investmentPeriod = retirementAge - currentAge
    const totalMonths = investmentPeriod * 12
    const monthlyRate = expectedReturn / 100 / 12

    // Calculate corpus at retirement using SIP formula
    const corpus = monthlyContribution * 
      (((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate))

    // 60% of corpus goes to annuity (mandatory)
    const annuityAmount = corpus * 0.6
    const lumpSum = corpus * 0.4

    // Calculate monthly pension from annuity
    const annuityMonthlyRate = annuityReturn / 100 / 12
    const pensionYears = 25 // Assuming 25 years of pension
    const pensionMonths = pensionYears * 12
    
    const monthlyPension = (annuityAmount * annuityMonthlyRate) / 
      (1 - Math.pow(1 + annuityMonthlyRate, -pensionMonths))

    const totalInvestment = monthlyContribution * totalMonths

    setResults({
      corpus: Math.round(corpus),
      annuityAmount: Math.round(annuityAmount),
      lumpSum: Math.round(lumpSum),
      monthlyPension: Math.round(monthlyPension),
      totalInvestment: Math.round(totalInvestment),
      totalReturns: Math.round(corpus - totalInvestment),
      investmentPeriod
    })
  }, [inputs, setResults])

  // Trigger calculation when inputs change
  useEffect(() => {
    calculateNPS()
  }, [inputs, calculateNPS])

  // Enhanced SEO for mobile responsiveness, PDF export, and charts
  useEffect(() => {
    addMobileResponsivenessSEO();
    addPDFExportSEO();
    addChartResponsivenessSEO();

    // Update page title and meta description
    document.title = 'NPS Calculator - National Pension Scheme Calculator | Mobile Friendly';

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Calculate NPS returns and pension corpus with mobile-optimized interface. Interactive charts and downloadable PDF reports.');
    }

    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', 'NPS calculator, national pension scheme, retirement planning, mobile calculator, PDF report');
    }
  }, []);

  // Share calculation
  const shareCalculation = () => {
    const shareableURL = generateCalculatorShareURL('nps', inputs, results)

    const shareData = {
      title: 'finclamp.com - NPS Calculator Results',
      text: `NPS Calculation: Monthly Contribution ${formatCurrency(inputs.monthlyContribution)}, Corpus: ${formatCurrency(results?.corpus)}`,
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
        calculator: 'NPS Calculator',
        inputs: {
          monthlyContribution: inputs.monthlyContribution,
          currentAge: inputs.currentAge,
          retirementAge: inputs.retirementAge,
          expectedReturn: (inputs.expectedReturn) + '%',
        },
        results: {
          corpus: results.corpus,
          lumpSum: results.lumpSum,
          monthlyPension: results.monthlyPension
        }
      }

      addToComparison(comparisonData)

      if (onAddToComparison) {
        onAddToComparison(comparisonData)
      }
    }
  }

  // Chart data for growth visualization
  const chartData = results ? (() => {
    const data = []
    const years = results.investmentPeriod
    const monthlyContribution = parseFloat(inputs.monthlyContribution)
    const monthlyRate = parseFloat(inputs.expectedReturn) / 100 / 12
    const currentAge = parseFloat(inputs.currentAge) || 0

    for (let year = 1; year <= years; year++) {
      const months = year * 12
      const invested = monthlyContribution * months
      const corpus = monthlyContribution *
        (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate))

      data.push({
        year: currentAge + year,
        invested,
        corpus: corpus
      })
    }
    return data
  })() : []

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  }

  // Layout configuration based on view mode
  const gridClass = isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8'

  return (
    <MobileLayout>
      {/* Header */}
      <motion.div className="text-center" {...fadeInUp}>
        <h2 className={(isMobile ? 'text-2xl' : 'text-3xl') + ' font-bold text-gray-900 mb-2 flex items-center justify-center gap-3'}>
          <Building className={(isMobile ? responsive.iconSize("md") : responsive.iconSize("lg")) + ' text-purple-600'} />
          NPS Calculator
        </h2>
        <p className="text-gray-600">Calculate your National Pension System corpus and monthly pension</p>
      </motion.div>

      <div className={'grid ' + (gridClass)}>
        {/* Input Section - Enhanced */}
        <motion.div
          className="bg-white rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calculator className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">NPS Details</h2>
            </div>
            <ResetButton onReset={resetCalculator} />
          </div>

          <div className="space-y-6">
            {/* Monthly Contribution */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200"
            >
              <label className="block text-sm font-semibold text-purple-800 mb-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                Monthly Contribution
              </label>
              <NumberInput
                value={inputs.monthlyContribution}
                onChange={(value) => handleInputChange('monthlyContribution', value)}
                placeholder="0"
                prefix={formatCurrency(0).replace(/[\d.,]/g, '')}
                step="1"
                min="0"
                allowDecimals={true}
                allowNegative={false}
                className="w-full"
              />
            </motion.div>

            {/* Age Details */}
            <div className={'grid ' + (isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-2 gap-4') + ''}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200"
              >
                <label className="block text-sm font-semibold text-blue-800 mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Current Age
                </label>
                <NumberInput
                  value={inputs.currentAge}
                  onChange={(value) => handleInputChange('currentAge', value)}
                  placeholder="0"
                  suffix="years"
                  step="1"
                  min="18"
                  max="70"
                  allowDecimals={false}
                  allowNegative={false}
                  className="w-full"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200"
              >
                <label className="block text-sm font-semibold text-green-800 mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Retirement Age
                </label>
                <NumberInput
                  value={inputs.retirementAge}
                  onChange={(value) => handleInputChange('retirementAge', value)}
                  placeholder="60"
                  suffix="years"
                  step="1"
                  min="60"
                  max="75"
                  allowDecimals={false}
                  allowNegative={false}
                  className="w-full"
                />
              </motion.div>
            </div>

            {/* Return Rates */}
            <div className={'grid ' + (isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-2 gap-4') + ''}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.5 }}
                className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200"
              >
                <label className="block text-sm font-semibold text-orange-800 mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  Expected Annual Return
                </label>
                <NumberInput
                  value={inputs.expectedReturn}
                  onChange={(value) => handleInputChange('expectedReturn', value)}
                  placeholder="10"
                  suffix="%"
                  step="0.5"
                  min="0"
                  max="20"
                  allowDecimals={true}
                  allowNegative={false}
                  className="w-full"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.6 }}
                className="bg-gradient-to-br from-teal-50 to-teal-100 p-4 rounded-xl border border-teal-200"
              >
                <label className="block text-sm font-semibold text-teal-800 mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                  Annuity Return Rate
                </label>
                <NumberInput
                  value={inputs.annuityReturn}
                  onChange={(value) => handleInputChange('annuityReturn', value)}
                  placeholder="6"
                  suffix="%"
                  step="0.5"
                  min="0"
                  max="15"
                  allowDecimals={true}
                  allowNegative={false}
                  className="w-full"
                />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Results Section */}
        <ModernResultsSection
          title="NPS Results"
          results={results}
          onShare={shareCalculation}
          onAddToComparison={handleAddToComparison}
          categoryColor="purple"
          emptyStateMessage="Enter NPS details to see calculation"
        >
          {/* Main Result - Enhanced Hero Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="relative p-6 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl text-white text-center overflow-hidden mb-6"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full translate-y-12 -translate-x-12"></div>
            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex items-center justify-center gap-2 mb-2"
              >
                <Building className="w-6 h-6" />
                <span className="text-sm opacity-90">Total NPS Corpus</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4, type: "spring", stiffness: 200 }}
                className={'' + (responsive.typography.heading) + ' font-bold mb-2'}
              >
                <CompactCurrencyDisplay value={results?.corpus || 0} />
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="text-xs opacity-75"
              >
                Your retirement corpus at age {inputs.retirementAge || 60}
              </motion.div>
            </div>
          </motion.div>

          {/* Key Metrics Grid - Enhanced */}
          <div className={'grid ' + (isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-2 gap-4') + ' mb-6'}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.6 }}
              className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 text-center"
            >
              <div className="text-sm font-semibold text-green-800 mb-2 flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Lump Sum (40%)
              </div>
              <div className="text-xl font-bold text-green-600">
                <CompactCurrencyDisplay value={results?.lumpSum || 0} />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.7 }}
              className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 text-center"
            >
              <div className="text-sm font-semibold text-blue-800 mb-2 flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Monthly Pension
              </div>
              <div className="text-xl font-bold text-blue-600">
                <CompactCurrencyDisplay value={results?.monthlyPension || 0} />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.8 }}
              className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200 text-center"
            >
              <div className="text-sm font-semibold text-orange-800 mb-2 flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                Total Investment
              </div>
              <div className="text-xl font-bold text-orange-600">
                <CompactCurrencyDisplay value={results?.totalInvestment || 0} />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.9 }}
              className="p-4 bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl border border-teal-200 text-center"
            >
              <div className="text-sm font-semibold text-teal-800 mb-2 flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                Annuity Amount (60%)
              </div>
              <div className="text-xl font-bold text-teal-600">
                <CompactCurrencyDisplay value={results?.annuityAmount || 0} />
              </div>
            </motion.div>
          </div>

          {/* Growth Chart */}
          {results && chartData.length > 0 && (
            <div className="mt-6">
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl overflow-hidden p-4 sm:p-6 shadow-lg border border-purple-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                  <h3 className="text-xl font-bold text-purple-800 flex items-center gap-2">
                    📈 NPS Growth Visualization
                  </h3>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-gray-500 rounded-full mr-2"></div>
                      <span className="text-gray-700">Total Invested</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                      <span className="text-purple-700">Corpus Value</span>
                    </div>
                  </div>
                </div>

                {/* Chart Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-6">
                  <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm text-center">
                    <div className="text-xs text-gray-500 mb-1">Starting Age</div>
                    <div className="text-lg font-semibold text-purple-600">{chartData[0]?.year || 0}</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm text-center">
                    <div className="text-xs text-gray-500 mb-1">Retirement Age</div>
                    <div className="text-lg font-semibold text-purple-600">{chartData[chartData.length - 1]?.year || 0}</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm text-center">
                    <div className="text-xs text-gray-500 mb-1">Total Invested</div>
                    <div className="text-lg font-semibold text-gray-600">
                      <CompactCurrencyDisplay value={chartData[chartData.length - 1]?.invested || 0} />
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm text-center">
                    <div className="text-xs text-gray-500 mb-1">Final Corpus</div>
                    <div className="text-lg font-semibold text-purple-600">
                      <CompactCurrencyDisplay value={chartData[chartData.length - 1]?.corpus || 0} />
                    </div>
                  </div>
                </div>

              <div className="h-80 sm:h-96 w-full overflow-hidden">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{ top: 20, right: 15, left: 40, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                    <XAxis
                      dataKey="year"
                      stroke="#6b7280"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                      label={{ value: 'Age', position: 'insideBottom', offset: -10 }}
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
                      formatter={(value, name) => [<CompactCurrencyDisplay value={value} showTooltip={false} />, name === 'invested' ? 'Total Invested' : 'Corpus Value']}
                      labelFormatter={(label) => `Age: ${label}`}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="invested"
                      stroke="#6B7280"
                      strokeWidth={3}
                      name="invested"
                      dot={{ fill: '#6B7280', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#6B7280', strokeWidth: 2 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="corpus"
                      stroke="#8B5CF6"
                      strokeWidth={3}
                      name="corpus"
                      dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#8B5CF6', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            </div>
          )}
        </ModernResultsSection>
      </div>

      {/* PDF Export */}
      {results && (
        <CommonPDFExport
          calculatorName="NPS Calculator"
          inputs={{
            'Monthly Contribution': formatCurrency(inputs.monthlyContribution),
            'Current Age': (inputs.currentAge) + ' years',
            'Retirement Age': (inputs.retirementAge) + ' years',
            'Expected Return': `${inputs.expectedReturn}% p.a.`,
            'Investment Period': (parseInt(inputs.retirementAge) - parseInt(inputs.currentAge)) + ' years',
            'Annual Contribution': formatCurrency(parseFloat(inputs.monthlyContribution) * 12),
            'Employer Contribution': inputs.employerContribution ? formatCurrency(inputs.employerContribution) : "Not applicable",
            'NPS Tier': "Tier 1 (Retirement focused)"
          }}
          results={{
            'Corpus at Retirement': formatCurrency(results.corpus || 0),
            'Total Contribution': formatCurrency(results.totalInvestment || 0),
            'Total Returns': formatCurrency(results.totalReturns || 0),
            'Lump Sum (60%)': formatCurrency(results.corpus * 0.6),
            'Annuity Amount (40%)': formatCurrency(results.corpus * 0.4),
            'Monthly Pension (6% annuity)': formatCurrency((results.corpus * 0.4 * 0.06) / 12),
            'Tax Benefit (80CCD)': formatCurrency(Math.min(parseFloat(inputs.monthlyContribution) * 12, 150000)),
            'Additional Tax Benefit (80CCD1B)': formatCurrency(50000),
            'Investment Multiple': `${(results.corpus / results.totalInvestment).toFixed(2)}x`
          }}
        />
      )}

      {/* Related Calculators */}
      <RelatedCalculators
        currentCalculatorId={currentCalculatorId}
        calculatorData={calculatorData}
        onCalculatorSelect={onCalculatorSelect}
      />
    </MobileLayout>
  )
}
