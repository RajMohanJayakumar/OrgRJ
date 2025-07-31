import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useComparison } from '../contexts/ComparisonContext'
import { useCurrency } from '../contexts/CurrencyContext'
import { useViewMode } from '../contexts/ViewModeContext'
import useMobileResponsive from '../hooks/useMobileResponsive'
import { useURLStateObject, generateShareableURL } from '../hooks/useURLState'
import CommonPDFExport from '../components/CommonPDFExport'
import { NumberInput } from '../components/common/inputs'
import RelatedCalculators from '../components/RelatedCalculators'
import MobileLayout, { MobileGrid } from '../components/MobileLayout'

export default function EPFCalculator({ onAddToComparison, categoryColor = 'green', currentCalculatorId, calculatorData, onCalculatorSelect }) {
  const { addToComparison } = useComparison()
  const { formatCurrency } = useCurrency()
  const { isMobile } = useViewMode()
  const { responsive } = useMobileResponsive()

  const initialInputs = {
    basicSalary: '',
    currentAge: '',
    retirementAge: '58',
    employeeContribution: '12',
    employeeContributionType: 'percentage', // 'percentage' or 'amount'
    employerContribution: '12',
    employerContributionType: 'percentage', // 'percentage' or 'amount'
    salaryIncrement: '5',
    interestRate: '8.5'
  }

  // Use URL state management for inputs
  const [inputs, setInputs] = useURLStateObject('epf_')
  const [results, setResults] = useState(null)

  // Initialize inputs with defaults if empty
  useEffect(() => {
    if (Object.keys(inputs).length === 0) {
      setInputs(prev => ({ ...initialInputs, ...prev }))
    }
  }, [])

  const handleInputChange = (field, value) => {
    const newInputs = { ...inputs, [field]: value }

    // Reset contribution values when switching between percentage and amount
    if (field === 'employeeContributionType') {
      newInputs.employeeContribution = ''
    }
    if (field === 'employerContributionType') {
      newInputs.employerContribution = ''
    }

    setInputs(newInputs)
  }

  const handleReset = () => {
    setInputs(initialInputs)
    setResults(null)
    // Clear URL parameters
    window.history.replaceState({}, document.title, window.location.pathname + '?calculator=epf')
  }

  const calculateEPF = () => {
    const basicSalary = parseFloat(inputs.basicSalary) || 0
    const currentAge = parseFloat(inputs.currentAge) || 0
    const retirementAge = parseFloat(inputs.retirementAge) || 58
    const employeeContribution = parseFloat(inputs.employeeContribution) || 12
    const employerContribution = parseFloat(inputs.employerContribution) || 12
    const salaryIncrement = parseFloat(inputs.salaryIncrement) || 5
    const interestRate = parseFloat(inputs.interestRate) || 8.5

    if (basicSalary <= 0 || currentAge <= 0 || retirementAge <= currentAge) return

    const yearsToRetirement = retirementAge - currentAge
    let totalEmployeeContribution = 0
    let totalEmployerContribution = 0
    let currentSalary = basicSalary

    // Calculate year-wise contributions with salary increment
    for (let year = 0; year < yearsToRetirement; year++) {
      let yearlyEmployeeContribution, yearlyEmployerContribution

      // Calculate employee contribution based on type
      if (inputs.employeeContributionType === 'percentage') {
        yearlyEmployeeContribution = (currentSalary * 12 * employeeContribution) / 100
      } else {
        yearlyEmployeeContribution = employeeContribution * 12 // Monthly amount * 12
      }

      // Calculate employer contribution based on type
      if (inputs.employerContributionType === 'percentage') {
        yearlyEmployerContribution = (currentSalary * 12 * employerContribution) / 100
      } else {
        yearlyEmployerContribution = employerContribution * 12 // Monthly amount * 12
      }

      totalEmployeeContribution += yearlyEmployeeContribution
      totalEmployerContribution += yearlyEmployerContribution

      // Apply salary increment for next year
      currentSalary = currentSalary * (1 + salaryIncrement / 100)
    }

    const totalContribution = totalEmployeeContribution + totalEmployerContribution
    
    // Calculate maturity amount with compound interest
    const monthlyInterestRate = interestRate / 100 / 12
    const totalMonths = yearsToRetirement * 12
    
    // Using compound interest formula for EPF
    const maturityAmount = totalContribution * Math.pow(1 + interestRate / 100, yearsToRetirement)
    const totalInterest = maturityAmount - totalContribution

    setResults({
      maturityAmount: Math.round(maturityAmount),
      totalEmployeeContribution: Math.round(totalEmployeeContribution),
      totalEmployerContribution: Math.round(totalEmployerContribution),
      totalContribution: Math.round(totalContribution),
      totalInterest: Math.round(totalInterest),
      yearsToRetirement
    })
  }

  const handleAddToComparison = () => {
    if (results) {
      const comparisonData = {
        id: Date.now(),
        calculator: 'EPF Calculator',
        timestamp: new Date().toISOString(),
        inputs: {
          'Basic Salary': `₹${inputs.basicSalary}`,
          'Current Age': (inputs.currentAge) + ' years',
          'Retirement Age': (inputs.retirementAge) + ' years',
          'Employee Contribution': (inputs.employeeContribution) + '%'
        },
        results: {
          'Maturity Amount': `₹${results.maturityAmount?.toLocaleString()}`,
          'Total Contribution': `₹${results.totalContribution?.toLocaleString()}`,
          'Total Interest': `₹${results.totalInterest?.toLocaleString()}`
        }
      }
      addToComparison(comparisonData)
    }
  }

  const shareCalculation = () => {
    const shareData = {
      title: 'finclamp.com - EPF Calculator Results',
      text: `EPF Calculation: Salary ₹${inputs.basicSalary}, Maturity ₹${results?.maturityAmount?.toLocaleString()}`,
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
    { name: 'Employee Contribution', value: results.totalEmployeeContribution, color: '#059669' },
    { name: 'Employer Contribution', value: results.totalEmployerContribution, color: '#34D399' },
    { name: 'Interest Earned', value: results.totalInterest, color: '#6EE7B7' }
  ] : []

  useEffect(() => {
    if (inputs.basicSalary && inputs.currentAge && inputs.retirementAge) {
      calculateEPF()
    }
  }, [inputs])

  return (
    <MobileLayout className={'' + (isMobile ? 'space-y-4' : 'space-y-8') + ' calculator-main-container'}>
      {/* Main Content - Single Row Layout */}
      <MobileGrid columns={2} className={isMobile ? 'mt-4' : 'mt-6'}>

        {/* Left Column - EPF Details */}
        <motion.div
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold" style={{ color: '#1F2937' }}>
              🏢 EPF Details
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
                💰 Basic Salary (Monthly)
              </label>
              <NumberInput
                value={inputs.basicSalary}
                onChange={(value) => handleInputChange('basicSalary', value)}
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
                👤 Current Age
              </label>
              <NumberInput
                value={inputs.currentAge}
                onChange={(value) => handleInputChange('currentAge', value)}
                placeholder="Enter age"
                suffix="years"
                step="1"
                min="18"
                max="65"
                allowDecimals={false}
                allowNegative={false}
                className="w-full py-2 text-sm font-medium border-2 rounded-xl transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🎯 Retirement Age
              </label>
              <NumberInput
                value={inputs.retirementAge}
                onChange={(value) => handleInputChange('retirementAge', value)}
                placeholder="Enter age"
                suffix="years"
                step="1"
                min="50"
                max="65"
                allowDecimals={false}
                allowNegative={false}
                className="w-full py-2 text-sm font-medium border-2 rounded-xl transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                👨‍💼 Employee Contribution
              </label>
              <NumberInput
                value={inputs.employeeContribution}
                onChange={(value) => handleInputChange('employeeContribution', value)}
                placeholder={inputs.employeeContributionType === 'percentage' ? "12" : "6000"}
                suffix={inputs.employeeContributionType === 'percentage' ? "%" : ""}
                prefix={inputs.employeeContributionType === 'amount' ? formatCurrency(0).replace(/[\d.,]/g, '') : ""}
                step={inputs.employeeContributionType === 'percentage' ? "0.5" : "1"}
                min="0"
                max={inputs.employeeContributionType === 'percentage' ? "12" : undefined}
                allowDecimals={true}
                allowNegative={false}
                dropdown={{
                  value: inputs.employeeContributionType || 'percentage',
                  onChange: (value) => handleInputChange('employeeContributionType', value),
                  options: [
                    { value: 'percentage', label: '%' },
                    { value: 'amount', label: '₹' }
                  ]
                }}
                className="w-full border-2 rounded-xl transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🏢 Employer Contribution
              </label>
              <NumberInput
                value={inputs.employerContribution}
                onChange={(value) => handleInputChange('employerContribution', value)}
                placeholder={inputs.employerContributionType === 'percentage' ? "12" : "6000"}
                suffix={inputs.employerContributionType === 'percentage' ? "%" : ""}
                prefix={inputs.employerContributionType === 'amount' ? formatCurrency(0).replace(/[\d.,]/g, '') : ""}
                step={inputs.employerContributionType === 'percentage' ? "0.5" : "1"}
                min="0"
                max={inputs.employerContributionType === 'percentage' ? "12" : undefined}
                allowDecimals={true}
                allowNegative={false}
                dropdown={{
                  value: inputs.employerContributionType || 'percentage',
                  onChange: (value) => handleInputChange('employerContributionType', value),
                  options: [
                    { value: 'percentage', label: '%' },
                    { value: 'amount', label: '₹' }
                  ]
                }}
                className="w-full border-2 rounded-xl transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📈 Interest Rate (% per annum)
              </label>
              <NumberInput
                value={inputs.interestRate}
                onChange={(value) => handleInputChange('interestRate', value)}
                placeholder="8.1"
                suffix="%"
                step="0.5"
                min="0"
                allowDecimals={true}
                allowNegative={false}
                className="w-full py-2 text-sm font-medium border-2 rounded-xl transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Quick Actions */}
            {results && (
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <motion.button
                  onClick={handleAddToComparison}
                  className="w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 cursor-pointer text-sm"
                  style={{ backgroundColor: '#059669' }}
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
            📊 EPF Results
          </h3>

          {results ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <motion.div
                className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">💰</span>
                  <h4 className="font-semibold text-base text-gray-700">Maturity Amount</h4>
                </div>
                <p className={(responsive.typography.heading) + ' font-bold text-green-600 leading-tight'}>
                  {formatCurrency(results.maturityAmount || 0)}
                </p>
              </motion.div>

              <motion.div
                className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">🏦</span>
                  <h4 className="font-semibold text-base text-gray-700">Total Contribution</h4>
                </div>
                <p className={(responsive.typography.heading) + ' font-bold text-blue-600 leading-tight'}>
                  {formatCurrency(results.totalContribution || 0)}
                </p>
              </motion.div>

              <motion.div
                className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-6 border border-purple-100"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">👨‍💼</span>
                  <h4 className="font-semibold text-base text-gray-700">Employee Share</h4>
                </div>
                <p className={(responsive.typography.heading) + ' font-bold text-purple-600 leading-tight'}>
                  {formatCurrency(results.totalEmployeeContribution || 0)}
                </p>
              </motion.div>

              <motion.div
                className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-100"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">🏢</span>
                  <h4 className="font-semibold text-base text-gray-700">Employer Share</h4>
                </div>
                <p className={(responsive.typography.heading) + ' font-bold text-orange-600 leading-tight'}>
                  {formatCurrency(results.totalEmployerContribution || 0)}
                </p>
              </motion.div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-gray-500 text-lg">Enter EPF details to see results</p>
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
              {/* EPF Summary */}
              <motion.div
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h4 className="text-lg font-bold mb-4 text-gray-800">
                  💼 EPF Summary
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 text-sm">Basic Salary</span>
                    <span className="font-semibold text-green-600 text-sm">{formatCurrency(inputs.basicSalary)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 text-sm">Years to Retirement</span>
                    <span className="font-semibold text-sm">{inputs.retirementAge - inputs.currentAge} years</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 text-sm">Total Contribution</span>
                    <span className="font-semibold text-sm">{parseFloat(inputs.employeeContribution) + parseFloat(inputs.employerContribution)}%</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600 text-sm">Growth Multiplier</span>
                    <span className="font-semibold text-green-600 text-sm">
                      {(parseFloat(results.maturityAmount) / parseFloat(results.totalContribution)).toFixed(1)}x
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
                  <p className="text-gray-500 text-sm">EPF growth chart</p>
                </div>
              </motion.div>

            </MobileGrid>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PDF Export */}
      {results && (
        <CommonPDFExport
          calculatorName="EPF Calculator"
          inputs={{
            'Basic Salary': formatCurrency(inputs.basicSalary),
            'Employee Contribution': (inputs.employeeContribution) + '%',
            'Employer Contribution': (inputs.employerContribution) + '%',
            'Years of Service': (inputs.yearsOfService) + ' years',
            'Annual Salary Increment': `${inputs.salaryIncrement || 0}% p.a.`,
            'EPF Interest Rate': `${inputs.epfInterestRate || 8.5}% p.a.`,
            'VPF Contribution': inputs.vpfContribution ? (inputs.vpfContribution) + '%' : "None",
            'Current Age': inputs.currentAge ? (inputs.currentAge) + ' years' : "Not specified"
          }}
          results={{
            'Total EPF Corpus': formatCurrency(results.totalCorpus || 0),
            'Employee Contribution': formatCurrency(results.employeeTotal || 0),
            'Employer Contribution': formatCurrency(results.employerTotal || 0),
            'Interest Earned': formatCurrency(results.interestEarned || 0),
            'Monthly Contribution': formatCurrency(results.monthlyContribution || 0),
            'Annual Contribution': formatCurrency(results.monthlyContribution * 12),
            'Retirement Corpus': formatCurrency(results.totalCorpus || 0),
            'Tax Benefit': formatCurrency(results.employeeTotal || 0),
            'Pension Fund (EPS)': formatCurrency(results.pensionFund || 0)
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
