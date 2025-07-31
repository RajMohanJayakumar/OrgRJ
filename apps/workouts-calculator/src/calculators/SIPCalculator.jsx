import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Calculator, TrendingUp, Target } from 'lucide-react'
import CommonPDFExport from '../components/CommonPDFExport'
import { useComparison } from '../contexts/ComparisonContext'
import { useCurrency } from '../contexts/CurrencyContext'
import { useViewMode } from '../contexts/ViewModeContext'
import { useCalculatorState, generateCalculatorShareURL } from '../hooks/useCalculatorState'
import useMobileResponsive from '../hooks/useMobileResponsive'
import { addMobileResponsivenessSEO, addPDFExportSEO, addChartResponsivenessSEO } from '../utils/seo'
import { NumberInput } from '../components/common/inputs'
import ModernInputSection from '../components/ModernInputSection'
import ModernResultsSection, { ModernResultGrid, ModernSummaryCard } from '../components/ModernResultsSection'
import RelatedCalculators from '../components/RelatedCalculators'
import CompactCurrencyDisplay from '../components/CompactCurrencyDisplay'
import MobileLayout, { MobileGrid } from '../components/MobileLayout'

export default function SIPCalculator({ onAddToComparison, currentCalculatorId, calculatorData, onCalculatorSelect }) {
  const { addToComparison } = useComparison()
  const { formatCurrency } = useCurrency()
  const { isMobile } = useViewMode()
  const { responsive } = useMobileResponsive()


  // Default values
  const defaultInputs = {
    monthlyInvestment: '',
    maturityAmount: '',
    lumpSumAmount: '',
    annualReturn: '12',
    timePeriodYears: '10',
    timePeriodMonths: '0',
    stepUpPercentage: '0',
    stepUpType: 'percentage'
  }

  // State management with URL synchronization
  const {
    inputs,
    results,
    setResults,
    handleInputChange,
    resetCalculator
  } = useCalculatorState('sip_', defaultInputs)

  const [yearlyBreakdown, setYearlyBreakdown] = useState([])
  const [lastUpdatedField, setLastUpdatedField] = useState(null)

  // Handle input changes with field tracking
  const handleFieldChange = (field, value) => {
    // Reset step-up value when switching between percentage and amount
    if (field === 'stepUpType') {
      handleInputChange('stepUpPercentage', '0')
    }

    handleInputChange(field, value)
    setLastUpdatedField(field)
  }

  // Calculate SIP maturity amount from monthly investment
  const calculateMaturityFromMonthly = (monthlyInv, annualRate, totalMonths, stepUpValue, stepUpType) => {
    const monthlyRate = annualRate / 100 / 12

    if (stepUpValue > 0) {
      return calculateStepUpSIPMaturity(monthlyInv, monthlyRate, totalMonths, stepUpValue, stepUpType)
    } else {
      if (monthlyRate > 0) {
        const futureValueFactor = ((1 + monthlyRate) ** totalMonths - 1) / monthlyRate
        return monthlyInv * futureValueFactor
      } else {
        return monthlyInv * totalMonths
      }
    }
  }

  // Calculate required monthly investment for target maturity
  const calculateMonthlyFromMaturity = (maturityAmt, annualRate, totalMonths, stepUpValue, stepUpType) => {
    const monthlyRate = annualRate / 100 / 12

    if (stepUpValue > 0) {
      return calculateRequiredMonthlyForStepUp(maturityAmt, monthlyRate, totalMonths, stepUpValue, stepUpType)
    } else {
      if (monthlyRate > 0) {
        const futureValueFactor = ((1 + monthlyRate) ** totalMonths - 1) / monthlyRate
        return maturityAmt / futureValueFactor
      } else {
        return maturityAmt / totalMonths
      }
    }
  }

  // Share calculation
  const shareCalculation = () => {
    const shareableURL = generateCalculatorShareURL('sip', inputs, results)

    const shareData = {
      title: 'finclamp.com - SIP Calculator Results',
      text: `SIP Calculator Results - Monthly Investment: ${formatCurrency(inputs.monthlyInvestment)}, Maturity: ${formatCurrency(results?.maturityAmount)}`,
      url: shareableURL
    }

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      navigator.share(shareData)
    } else {
      navigator.clipboard.writeText(shareableURL)
      alert('Link copied to clipboard!')
    }
  }

  // Helper function to calculate step-up SIP maturity amount
  const calculateStepUpSIPMaturity = (initialMonthly, monthlyRate, totalMonths, stepUpValue, stepUpType) => {
    let totalAmount = 0
    let currentMonthlyInv = initialMonthly

    for (let month = 1; month <= totalMonths; month++) {
      // Add current month's investment with compound growth
      const monthsToGrow = totalMonths - month + 1
      totalAmount += currentMonthlyInv * ((1 + monthlyRate) ** monthsToGrow)

      // Increase investment annually (at the end of each 12-month period)
      if (month % 12 === 0 && month < totalMonths) {
        if (stepUpType === 'percentage') {
          currentMonthlyInv = currentMonthlyInv * (1 + stepUpValue / 100)
        } else {
          currentMonthlyInv = currentMonthlyInv + stepUpValue
        }
      }
    }

    return totalAmount
  }

  // Helper function to calculate required monthly investment for step-up SIP
  const calculateRequiredMonthlyForStepUp = (targetAmount, monthlyRate, totalMonths, stepUpValue, stepUpType) => {
    // Use binary search to find the required monthly investment
    let low = 1
    let high = targetAmount / 12
    let tolerance = 1

    while (high - low > tolerance) {
      const mid = (low + high) / 2
      const calculatedAmount = calculateStepUpSIPMaturity(mid, monthlyRate, totalMonths, stepUpValue, stepUpType)

      if (calculatedAmount < targetAmount) {
        low = mid
      } else {
        high = mid
      }
    }

    return (low + high) / 2
  }

  // Main SIP calculation function
  const calculateSIP = useCallback(() => {
    const monthlyInv = parseFloat(inputs.monthlyInvestment) || 0
    const maturityAmt = parseFloat(inputs.maturityAmount) || 0
    const lumpSum = parseFloat(inputs.lumpSumAmount) || 0
    const annualRate = parseFloat(inputs.annualReturn) || 0
    const years = parseInt(inputs.timePeriodYears) || 0
    const months = parseInt(inputs.timePeriodMonths) || 0
    const stepUpValue = parseFloat(inputs.stepUpPercentage) || 0
    const stepUpType = inputs.stepUpType || 'percentage'

    // Calculate total months
    const totalMonths = (years * 12) + months

    if (totalMonths <= 0 || annualRate <= 0 || (monthlyInv <= 0 && maturityAmt <= 0)) {
      setResults(null)
      setYearlyBreakdown([])
      return
    }

    const monthlyRate = annualRate / 100 / 12
    let calculatedMonthlyInvestment = monthlyInv
    let calculatedMaturityAmount = maturityAmt

    // Determine which value to calculate based on what user provided
    if (monthlyInv > 0 && maturityAmt <= 0) {
      // Calculate maturity from monthly investment
      calculatedMaturityAmount = calculateMaturityFromMonthly(
        monthlyInv, annualRate, totalMonths, stepUpValue, stepUpType
      )
    } else if (maturityAmt > 0 && monthlyInv <= 0) {
      // Calculate monthly investment from target maturity
      calculatedMonthlyInvestment = calculateMonthlyFromMaturity(
        maturityAmt, annualRate, totalMonths, stepUpValue, stepUpType
      )
    } else if (monthlyInv > 0 && maturityAmt > 0) {
      // Both values provided - use the last updated field to determine calculation direction
      if (lastUpdatedField === 'monthlyInvestment') {
        calculatedMaturityAmount = calculateMaturityFromMonthly(
          monthlyInv, annualRate, totalMonths, stepUpValue, stepUpType
        )
      } else if (lastUpdatedField === 'maturityAmount') {
        calculatedMonthlyInvestment = calculateMonthlyFromMaturity(
          maturityAmt, annualRate, totalMonths, stepUpValue, stepUpType
        )
      }
    }

    // Add lump sum if provided
    if (lumpSum > 0) {
      calculatedMaturityAmount += lumpSum * ((1 + monthlyRate) ** totalMonths)
    }

    // Calculate total investment considering step-up
    let totalInvestment = lumpSum
    if (stepUpValue > 0) {
      let currentMonthlyInv = calculatedMonthlyInvestment
      for (let month = 1; month <= totalMonths; month++) {
        totalInvestment += currentMonthlyInv
        if (month % 12 === 0 && month < totalMonths) {
          if (stepUpType === 'percentage') {
            currentMonthlyInv = currentMonthlyInv * (1 + stepUpValue / 100)
          } else {
            currentMonthlyInv = currentMonthlyInv + stepUpValue
          }
        }
      }
    } else {
      totalInvestment += calculatedMonthlyInvestment * totalMonths
    }

    const totalReturns = Math.max(0, calculatedMaturityAmount - totalInvestment)
    const absoluteReturn = totalReturns
    const annualizedReturn = totalMonths > 0 && totalInvestment > 0 ?
      (Math.pow(Math.max(calculatedMaturityAmount / totalInvestment, 0.01), 12 / totalMonths) - 1) * 100 : 0

    // Generate yearly breakdown for visualization
    const breakdown = []
    let cumulativeInvestment = lumpSum
    let currentMonthlyInv = calculatedMonthlyInvestment

    for (let year = 1; year <= years; year++) {
      // Calculate yearly investment (considering step-up happens at year end)
      let yearlyInvestment = 0
      let tempMonthlyInv = currentMonthlyInv

      for (let month = 1; month <= 12; month++) {
        yearlyInvestment += tempMonthlyInv
        // Step-up happens at the end of the year, not during
      }

      cumulativeInvestment += yearlyInvestment

      // Calculate value at end of year
      const monthsFromStart = year * 12
      let yearEndValue = 0

      // Add lump sum growth
      if (lumpSum > 0) {
        yearEndValue += lumpSum * ((1 + monthlyRate) ** monthsFromStart)
      }

      // Add SIP value with step-up
      if (stepUpValue > 0) {
        yearEndValue += calculateStepUpSIPMaturity(
          calculatedMonthlyInvestment, monthlyRate, monthsFromStart, stepUpValue, stepUpType
        )
      } else {
        if (monthlyRate > 0) {
          const futureValueFactor = ((1 + monthlyRate) ** monthsFromStart - 1) / monthlyRate
          yearEndValue += calculatedMonthlyInvestment * futureValueFactor
        } else {
          yearEndValue += calculatedMonthlyInvestment * monthsFromStart
        }
      }

      breakdown.push({
        year,
        investment: Math.round(yearlyInvestment),
        cumulativeInvestment: Math.round(cumulativeInvestment),
        value: Math.round(yearEndValue),
        returns: Math.round(yearEndValue - cumulativeInvestment)
      })

      // Update monthly investment for next year if step-up
      if (stepUpValue > 0) {
        if (stepUpType === 'percentage') {
          currentMonthlyInv = currentMonthlyInv * (1 + stepUpValue / 100)
        } else {
          currentMonthlyInv = currentMonthlyInv + stepUpValue
        }
      }
    }

    setResults({
      monthlyInvestment: Math.round(calculatedMonthlyInvestment),
      maturityAmount: Math.round(calculatedMaturityAmount),
      totalInvestment: Math.round(totalInvestment),
      totalReturns: Math.round(totalReturns),
      absoluteReturn: Math.round(absoluteReturn),
      annualizedReturn: annualizedReturn.toFixed(2),
      returnPercentage: annualizedReturn.toFixed(2),
      wealthGained: Math.round(totalReturns)
    })

    setYearlyBreakdown(breakdown)
  }, [inputs, setResults, lastUpdatedField])

  // Real-time calculation with bidirectional updates
  useEffect(() => {
    const monthlyInv = parseFloat(inputs.monthlyInvestment) || 0
    const maturityAmt = parseFloat(inputs.maturityAmount) || 0
    const annualRate = parseFloat(inputs.annualReturn) || 0
    const years = parseInt(inputs.timePeriodYears) || 0
    const months = parseInt(inputs.timePeriodMonths) || 0
    const totalMonths = (years * 12) + months

    // Only calculate if we have minimum required inputs
    if (annualRate > 0 && totalMonths > 0 && (monthlyInv > 0 || maturityAmt > 0)) {
      const stepUpValue = parseFloat(inputs.stepUpPercentage) || 0
      const stepUpType = inputs.stepUpType || 'percentage'

      // Real-time bidirectional updates
      if (lastUpdatedField === 'monthlyInvestment' && monthlyInv > 0) {
        const calculatedMaturity = calculateMaturityFromMonthly(
          monthlyInv, annualRate, totalMonths, stepUpValue, stepUpType
        )
        if (Math.abs(calculatedMaturity - maturityAmt) > 1) {
          handleInputChange('maturityAmount', Math.round(calculatedMaturity).toString())
        }
      } else if (lastUpdatedField === 'maturityAmount' && maturityAmt > 0) {
        const calculatedMonthly = calculateMonthlyFromMaturity(
          maturityAmt, annualRate, totalMonths, stepUpValue, stepUpType
        )
        if (Math.abs(calculatedMonthly - monthlyInv) > 1) {
          handleInputChange('monthlyInvestment', Math.round(calculatedMonthly).toString())
        }
      }

      // Always trigger main calculation
      calculateSIP()
    } else {
      setResults(null)
      setYearlyBreakdown([])
    }
  }, [inputs.monthlyInvestment, inputs.maturityAmount, inputs.lumpSumAmount, inputs.annualReturn, inputs.timePeriodYears, inputs.timePeriodMonths, inputs.stepUpPercentage, inputs.stepUpType, lastUpdatedField])

  // Enhanced SEO for mobile responsiveness, PDF export, and charts
  useEffect(() => {
    addMobileResponsivenessSEO();
    addPDFExportSEO();
    addChartResponsivenessSEO();

    // Update page title and meta description
    document.title = 'SIP Calculator - Systematic Investment Plan Calculator | Mobile Optimized';

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Calculate SIP returns with our mobile-optimized calculator. Interactive charts, PDF reports, and real-time calculations for systematic investment planning.');
    }

    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', 'SIP calculator, systematic investment plan, mutual fund calculator, mobile responsive, PDF export');
    }
  }, []);

  // Add to comparison
  const handleAddToComparison = () => {
    if (results) {
      const comparisonData = {
        type: 'SIP',
        inputs: {
          monthlyInvestment: inputs.monthlyInvestment,
          annualReturn: inputs.annualReturn,
          timePeriod: (inputs.timePeriodYears) + ' years ${inputs.timePeriodMonths} months',
          stepUp: inputs.stepUpPercentage > 0 ? parseFloat(inputs.stepUpPercentage).toFixed(inputs.stepUpType === 'percentage' ? 1 : 0) + (inputs.stepUpType === 'percentage' ? '%' : ' ₹') : 'None'
        },
        results: {
          maturityAmount: results.maturityAmount,
          totalInvestment: results.totalInvested,
          totalReturns: results.totalReturns
        }
      }

      addToComparison(comparisonData)
      if (onAddToComparison) {
        onAddToComparison(comparisonData)
      }
    }
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  }

  return (
    <MobileLayout>
      {/* Header */}
      <motion.div className="text-center" {...fadeInUp}>
        <h2 className={(isMobile ? 'text-2xl' : 'text-3xl') + ' font-bold text-gray-900 mb-2 flex items-center justify-center gap-3'}>
          <Target className={(isMobile ? 'w-6 h-6' : 'w-8 h-8') + ' text-purple-600'} />
          SIP Calculator
        </h2>
        <p className="text-gray-600">Calculate your Systematic Investment Plan returns</p>
      </motion.div>

      <MobileGrid columns={2} className={isMobile ? 'mt-6' : 'mt-8'}>
        {/* Input Section */}
        <ModernInputSection
          title="Investment Details"
          icon={Calculator}
          onReset={resetCalculator}
          categoryColor="purple"
        >
          {/* Basic Investment Inputs */}
          <div className="space-y-6">
            {/* Primary Investment Amount */}
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h4 className="text-sm font-semibold text-purple-800 mb-3">💰 Investment Amount</h4>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monthly SIP Amount
                  </label>
                  <NumberInput
                    value={inputs.monthlyInvestment}
                    onChange={(value) => handleFieldChange('monthlyInvestment', value)}
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
                    One-time Lump Sum (Optional)
                  </label>
                  <NumberInput
                    value={inputs.lumpSumAmount}
                    onChange={(value) => handleFieldChange('lumpSumAmount', value)}
                    placeholder="Enter amount"
                    prefix={formatCurrency(0).replace(/[\d.,]/g, '')}
                    step="1"
                    min="0"
                    allowDecimals={true}
                    allowNegative={false}
                    className="w-full py-2 text-sm font-medium border-2 rounded-xl transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Investment Period */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="text-sm font-semibold text-blue-800 mb-3">📅 Investment Period</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Years
                  </label>
                  <NumberInput
                    value={inputs.timePeriodYears}
                    onChange={(value) => handleInputChange('timePeriodYears', value)}
                    placeholder="Enter value"
                    step="1"
                    min="0"
                    max="50"
                    allowDecimals={false}
                    allowNegative={false}
                    className="w-full py-2 text-sm font-medium border-2 rounded-xl transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Months
                  </label>
                  <NumberInput
                    value={inputs.timePeriodMonths}
                    onChange={(value) => handleInputChange('timePeriodMonths', value)}
                    placeholder="0"
                    step="1"
                    min="0"
                    max="11"
                    allowDecimals={false}
                    allowNegative={false}
                    className="w-full py-2 text-sm font-medium border-2 rounded-xl transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Returns & Target */}
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="text-sm font-semibold text-green-800 mb-3">📈 Returns & Target</h4>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expected Annual Return
                  </label>
                  <NumberInput
                    value={inputs.annualReturn}
                    onChange={(value) => handleFieldChange('annualReturn', value)}
                    placeholder="Enter rate"
                    suffix="%"
                    step="0.5"
                    min="0"
                    max="50"
                    allowDecimals={true}
                    allowNegative={false}
                    className="w-full py-2 text-sm font-medium border-2 rounded-xl transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Maturity Amount (Optional)
                  </label>
                  <NumberInput
                    value={inputs.maturityAmount}
                    onChange={(value) => handleFieldChange('maturityAmount', value)}
                    placeholder="Enter amount"
                    prefix={formatCurrency(0).replace(/[\d.,]/g, '')}
                    step="1"
                    min="0"
                    allowDecimals={true}
                    allowNegative={false}
                    className="w-full py-2 text-sm font-medium border-2 rounded-xl transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Annual Step-up
            </label>
            <NumberInput
              value={inputs.stepUpPercentage}
              onChange={(value) => handleFieldChange('stepUpPercentage', value)}
              placeholder="Enter step-up"
              suffix={inputs.stepUpType === 'percentage' ? '%' : ''}
              prefix={inputs.stepUpType === 'amount' ? formatCurrency(0).replace(/[\d.,]/g, '') : ''}
              step={inputs.stepUpType === 'percentage' ? '0.5' : '1'}
              min="0"
              allowDecimals={inputs.stepUpType === 'percentage'}
              allowNegative={false}
              dropdown={{
                value: inputs.stepUpType || 'percentage',
                onChange: (value) => handleFieldChange('stepUpType', value),
                options: [
                  { value: 'percentage', label: '%' },
                  { value: 'amount', label: '₹' }
                ]
              }}
              className="w-full py-2 text-sm font-medium border-2 rounded-xl transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </ModernInputSection>

        {/* Results Section */}
        <ModernResultsSection
          title="Results"
          icon={TrendingUp}
          results={results}
          onShare={shareCalculation}
          onAddToComparison={handleAddToComparison}
          categoryColor="purple"
          emptyStateMessage="Enter investment details to see SIP calculation"
        >
          {/* Main Result */}
          <ModernSummaryCard
            title="Maturity Amount"
            items={[
              { value: results?.maturityAmount, type: 'currency' }
            ]}
            categoryColor="purple"
            size="large"
            centered={true}
            hideLabels={true}
            className="mb-6"
          />

          {/* Key Metrics */}
          <ModernResultGrid
            results={[
              { label: 'Total Investment', value: results?.totalInvestment, type: 'currency' },
              { label: 'Total Returns', value: Math.max(0, results?.totalReturns || 0), type: 'currency', highlight: true },
              { label: 'Monthly Investment', value: results?.monthlyInvestment, type: 'currency' },
              { label: 'Annualized Return', value: Math.max(0, parseFloat(results?.annualizedReturn || 0)).toFixed(2), type: 'percentage' }
            ]}
            categoryColor="purple"
          />


          {/* Chart - Full Width */}
          {results && yearlyBreakdown.length > 0 && (
            <motion.div
              className="w-full mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4 sm:p-6 shadow-lg border border-purple-200 overflow-hidden">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-purple-800">📈 Investment Growth Visualization</h3>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                      <span className="text-purple-700">Total Investment</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-green-700">Portfolio Value</span>
                    </div>
                  </div>
                </div>

                {/* Chart Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-2 sm:gap-3 mb-6">
                  <div className="bg-white rounded-lg p-3 sm:p-3 sm:p-4 shadow-sm text-center">
                    <div className="text-xs text-gray-500 mb-2">Initial Investment</div>
                    <div className="font-semibold text-purple-600 text-xs sm:text-xs sm:text-sm lg:text-base">
                      <CompactCurrencyDisplay value={yearlyBreakdown[0]?.cumulativeInvestment || 0} />
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-3 sm:p-3 sm:p-4 shadow-sm text-center">
                    <div className="text-xs text-gray-500 mb-2">Final Investment</div>
                    <div className="font-semibold text-purple-600 text-xs sm:text-xs sm:text-sm lg:text-base">
                      <CompactCurrencyDisplay value={yearlyBreakdown[yearlyBreakdown.length - 1]?.cumulativeInvestment || 0} />
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-3 sm:p-3 sm:p-4 shadow-sm text-center">
                    <div className="text-xs text-gray-500 mb-2">Final Value</div>
                    <div className="font-semibold text-green-600 text-xs sm:text-xs sm:text-sm lg:text-base">
                      <CompactCurrencyDisplay value={yearlyBreakdown[yearlyBreakdown.length - 1]?.value || 0} />
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-3 sm:p-3 sm:p-4 shadow-sm text-center">
                    <div className="text-xs text-gray-500 mb-2">Total Gain</div>
                    <div className="font-semibold text-green-600 text-xs sm:text-xs sm:text-sm lg:text-base">
                      <CompactCurrencyDisplay value={Math.max(0, (yearlyBreakdown[yearlyBreakdown.length - 1]?.value || 0) - (yearlyBreakdown[yearlyBreakdown.length - 1]?.cumulativeInvestment || 0))} />
                    </div>
                  </div>
                </div>

                <div className="h-80 sm:h-96 w-full overflow-hidden">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={yearlyBreakdown}
                      margin={{ top: 20, right: 15, left: 40, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
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
                        dataKey="cumulativeInvestment"
                        stroke="#8B5CF6"
                        strokeWidth={3}
                        name="Total Investment"
                        dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: '#8B5CF6', strokeWidth: 2 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#10B981"
                        strokeWidth={3}
                        name="Portfolio Value"
                        dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          )}
        </ModernResultsSection>
      </MobileGrid>

      {/* PDF Export */}
      {results && (
        <CommonPDFExport
          calculatorName="SIP Calculator"
          inputs={{
            'Monthly Investment': formatCurrency(inputs.monthlyInvestment),
            'Target Maturity Amount': inputs.maturityAmount ? formatCurrency(inputs.maturityAmount) : "Not set",
            'Lump Sum Investment': inputs.lumpSumAmount ? formatCurrency(inputs.lumpSumAmount) : "None",
            'Annual Return Rate': `${inputs.annualReturn}% p.a.`,
            'Investment Period': (inputs.timePeriodYears) + ' years ${inputs.timePeriodMonths} months',
            'Step-up Percentage': inputs.stepUpPercentage ? `${inputs.stepUpPercentage}% annually` : "No step-up",
            'Step-up Type': inputs.stepUpType === "percentage" ? "Percentage increase" : "Fixed amount increase",
            'Total Investment Period': ((parseInt(inputs.timePeriodYears) * 12) + parseInt(inputs.timePeriodMonths)) + ' months',
            'Investment Mode': inputs.maturityAmount ? "Target-based SIP" : "Amount-based SIP"
          }}
          results={{
            'Maturity Amount': formatCurrency(results.maturityAmount || 0),
            'Total Investment': formatCurrency(results.totalInvested || 0),
            'Total Returns': formatCurrency(results.totalReturns || 0),
            'Return Percentage': (parseFloat(results.returnPercentage || 0).toFixed(2)) + '%',
            'Absolute Gain': formatCurrency(results.totalReturns || 0),
            'CAGR (Compound Annual Growth Rate)': (((Math.pow(results.maturityAmount / results.totalInvested, 1 / (parseInt(inputs.timePeriodYears) + parseInt(inputs.timePeriodMonths) / 12)) - 1) * 100).toFixed(2)) + '%',
            'Monthly Return Rate': ((parseFloat(inputs.annualReturn) / 12).toFixed(2)) + '%',
            'Investment Multiple': `${(results.maturityAmount / results.totalInvested).toFixed(2)}x`,
            'Average Monthly Investment': formatCurrency(results.totalInvested / ((parseInt(inputs.timePeriodYears) * 12) + parseInt(inputs.timePeriodMonths))),
            'Final Monthly SIP': inputs.stepUpPercentage ? formatCurrency(parseFloat(inputs.monthlyInvestment) * Math.pow(1 + parseFloat(inputs.stepUpPercentage) / 100, parseInt(inputs.timePeriodYears))) : formatCurrency(inputs.monthlyInvestment)
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
