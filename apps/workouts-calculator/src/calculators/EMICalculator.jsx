import { useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'

import { Calculator, Home, TrendingUp } from 'lucide-react'
import { useComparison } from '../contexts/ComparisonContext'
import { useCurrency } from '../contexts/CurrencyContext'
import { useViewMode } from '../contexts/ViewModeContext'
import { useCalculatorState, generateCalculatorShareURL } from '../hooks/useCalculatorState'
import useMobileResponsive from '../hooks/useMobileResponsive'

import CommonPDFExport from '../components/CommonPDFExport'
import { NumberInput } from '../components/common/inputs'
import ModernInputSection from '../components/ModernInputSection'
import ModernResultsSection, { ModernResultGrid, ModernSummaryCard } from '../components/ModernResultsSection'
import BreakdownSection from '../components/BreakdownSection'
import RelatedCalculators from '../components/RelatedCalculators'
import CalculatorSchema from '../components/CalculatorSchema'
import MobileLayout, { MobileSection, MobileGrid, MobileInputGroup } from '../components/MobileLayout'

export default function EMICalculator({ onAddToComparison, categoryColor = 'blue', currentCalculatorId, calculatorData, onCalculatorSelect }) {
  const { addToComparison } = useComparison()
  const { formatCurrency } = useCurrency()
  const { responsive } = useMobileResponsive()
  const { isMobile } = useViewMode()

  // Default values
  const defaultInputs = {
    loanAmount: '',
    interestRate: '',
    loanTenure: '',
    tenureType: 'years',
    processingFee: '',
    prepayment: ''
  }

  // State management with URL synchronization
  const {
    inputs,
    setInputs,
    results,
    setResults,
    handleInputChange,
    resetCalculator
  } = useCalculatorState('emi_', defaultInputs)

  // EMI calculation function
  const calculateEMI = useCallback(() => {
    const principal = parseFloat(inputs.loanAmount) || 0
    const annualRate = parseFloat(inputs.interestRate) || 0
    const tenure = parseFloat(inputs.loanTenure) || 0
    const tenureType = inputs.tenureType || 'years'

    if (principal <= 0 || annualRate < 0 || tenure <= 0) {
      setResults(null)
      return
    }

    // Convert tenure to months if needed
    const tenureInMonths = tenureType === 'years' ? tenure * 12 : tenure
    const monthlyRate = annualRate / 100 / 12

    let emi, totalAmount, totalInterest

    if (annualRate === 0) {
      // Handle zero interest rate case
      emi = principal / tenureInMonths
      totalAmount = principal
      totalInterest = 0
    } else {
      // Calculate EMI using formula: P * r * (1+r)^n / ((1+r)^n - 1)
      emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureInMonths)) /
                  (Math.pow(1 + monthlyRate, tenureInMonths) - 1)
      totalAmount = emi * tenureInMonths
      totalInterest = totalAmount - principal
    }

    setResults({
      emi,
      totalAmount,
      totalInterest,
      principal,
      tenureInMonths,
      interestRate: annualRate
    })

  }, [inputs, setResults])

  // Trigger calculation when inputs change
  useEffect(() => {
    calculateEMI()
  }, [calculateEMI])

  // Share calculation
  const shareCalculation = () => {
    const shareableURL = generateCalculatorShareURL('emi', inputs, results)

    const shareData = {
      title: 'finclamp.com - EMI Calculator Results',
      text: `EMI Calculation: Loan Amount ${formatCurrency(inputs.loanAmount)}, EMI: ${formatCurrency(results?.emi)}`,
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
        calculator: 'EMI Calculator',
        inputs: {
          loanAmount: inputs.loanAmount,
          interestRate: inputs.interestRate,
          loanTenure: (inputs.loanTenure) + ' ' + (inputs.tenureType),
        },
        results: {
          emi: results.emi,
          totalAmount: results.totalAmount,
          totalInterest: results.totalInterest
        }
      }

      addToComparison(comparisonData)

      if (onAddToComparison) {
        onAddToComparison(comparisonData)
      }
    }
  }

  // Pie chart data - safely handle null results
  const pieData = results ? [
    { name: 'Principal', value: results.principal, color: '#3B82F6' },
    { name: 'Interest', value: results.totalInterest, color: '#EF4444' }
  ] : []

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  }

  // Layout configuration based on view mode - optimized for nearly full width
  const layoutSpacing = isMobile ? 'space-y-3' : responsive.spacing('lg')
  const headerSpacing = isMobile ? 'mt-4 mb-3' : 'mt-8 mb-6'
  const gridSpacing = isMobile ? 'mt-4' : 'mt-8'

  return (
    <MobileLayout className={'' + (layoutSpacing) + ' calculator-main-container'}>
      {/* SEO Schema */}
      <CalculatorSchema
        calculatorId={currentCalculatorId}
        inputs={inputs}
        results={results}
      />

      {/* Header */}
      <motion.div className={'text-center ' + (headerSpacing) + ''} {...fadeInUp}>
        <h2 className={(isMobile ? 'text-2xl' : 'text-3xl') + ' font-bold text-gray-900 mb-2 flex items-center justify-center gap-3'}>
          <Home className={(isMobile ? 'w-6 h-6' : 'w-8 h-8') + ' text-blue-600'} />
          EMI Calculator
        </h2>
        <p className={isMobile ? 'text-sm text-gray-600' : 'text-base text-gray-600'}>Calculate your loan EMI and repayment schedule</p>
      </motion.div>

      <MobileGrid columns={2} className={gridSpacing}>
        {/* Input Section */}
        <ModernInputSection
          title="Loan Details"
          icon={Calculator}
          onReset={resetCalculator}
          categoryColor="blue"
          className="w-full"
        >
          <div className={isMobile ? 'space-y-3' : 'space-y-4'}>
            <div>
              <label className={'block text-sm font-medium text-gray-700 ' + (isMobile ? 'mb-1' : 'mb-2') + ''}>
                Loan Amount
              </label>
              <NumberInput
                value={inputs.loanAmount}
                onChange={(value) => handleInputChange('loanAmount', value)}
                placeholder="Enter amount"
                prefix={formatCurrency(0).replace(/[\d.,]/g, '')}
                step="1"
                min="0"
                allowDecimals={true}
                allowNegative={false}
                className={'w-full ' + (isMobile ? 'py-2.5' : 'py-2') + ' text-sm font-medium border-2 rounded-xl transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-blue-500 focus:border-transparent'}
              />
            </div>

            <div>
              <label className={'block text-sm font-medium text-gray-700 ' + (isMobile ? 'mb-1' : 'mb-2') + ''}>
                Interest Rate
              </label>
              <NumberInput
                value={inputs.interestRate}
                onChange={(value) => handleInputChange('interestRate', value)}
                placeholder="Enter rate"
                suffix="%"
                step="0.5"
                min="0"
                max="50"
                allowDecimals={true}
                allowNegative={false}
                className={'w-full ' + (isMobile ? 'py-2.5' : 'py-2') + ' text-sm font-medium border-2 rounded-xl transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-blue-500 focus:border-transparent'}
              />
            </div>

            <div className={'grid ' + (isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-2 gap-4') + ''}>
              <div>
                <label className={'block text-sm font-medium text-gray-700 ' + (isMobile ? 'mb-1' : 'mb-2') + ''}>
                  Loan Tenure
                </label>
                <NumberInput
                  value={inputs.loanTenure}
                  onChange={(value) => handleInputChange('loanTenure', value)}
                  placeholder="Enter years"
                  step="1"
                  min="1"
                  max="50"
                  allowDecimals={false}
                  allowNegative={false}
                  className={'w-full ' + (isMobile ? 'py-2.5' : 'py-2') + ' text-sm font-medium border-2 rounded-xl transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-blue-500 focus:border-transparent'}
                />
              </div>

              <div>
                <label className={'block text-sm font-medium text-gray-700 ' + (isMobile ? 'mb-1' : 'mb-2') + ''}>
                  Tenure Type
                </label>
                <select
                  value={inputs.tenureType}
                  onChange={(e) => handleInputChange('tenureType', e.target.value)}
                  className={'w-full pl-4 pr-12 ' + (isMobile ? 'py-2.5' : 'py-2') + ' text-sm font-medium border-2 border-gray-300 rounded-xl transition-all duration-300 focus:outline-none cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 appearance-none bg-white'}
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 0.75rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em'
                  }}
                >
                  <option value="years">Years</option>
                  <option value="months">Months</option>
                </select>
              </div>
            </div>

            {/* Quick Tenure Buttons */}
            <div className={'bg-gray-50 rounded-lg ' + (isMobile ? 'p-3' : 'p-4') + ''}>
              <label className={'block text-sm font-medium text-gray-700 ' + (isMobile ? 'mb-2' : 'mb-3') + ''}>
                Quick Select (Years)
              </label>
              <div className={'grid grid-cols-4 ' + (isMobile ? 'gap-1.5' : 'gap-2') + ''}>
                {[5, 10, 15, 20].map((years) => (
                  <button
                    key={years}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()

                      // Update both values at once to avoid race conditions
                      const newInputs = {
                        ...inputs,
                        loanTenure: years.toString(),
                        tenureType: 'years'
                      }

                      // Use setInputs directly to update both at once
                      setInputs(newInputs)

                      // Also update URL
                      const url = new URL(window.location.href)
                      url.searchParams.set('emi_loanTenure', years.toString())
                      url.searchParams.set('emi_tenureType', 'years')
                      window.history.replaceState({}, '', url.toString())
                    }}
                    className={`${isMobile ? 'px-2 py-2' : 'px-3 py-2'} rounded-lg text-sm font-medium transition-colors cursor-pointer ` + (
                      parseInt(inputs.loanTenure) === years && inputs.tenureType === 'years'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-200'
                    )}
                  >
                    {years}Y
                  </button>
                ))}
              </div>
            </div>

            {/* Additional Fees Section */}
            <div className={'bg-gray-50 rounded-lg ' + (isMobile ? 'p-3' : 'p-4') + ''}>
              <label className={'block text-sm font-medium text-gray-700 ' + (isMobile ? 'mb-2' : 'mb-3') + ''}>
                Additional Fees (Optional)
              </label>

              <div className={'grid ' + (isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-2 gap-4') + ''}>
                <div>
                  <label className={'block text-xs font-medium text-gray-600 ' + (isMobile ? 'mb-1' : 'mb-2') + ''}>
                    Processing Fee
                  </label>
                  <NumberInput
                    value={inputs.processingFee}
                    onChange={(value) => handleInputChange('processingFee', value)}
                    placeholder="Enter fee"
                    prefix={formatCurrency(0).replace(/[\d.,]/g, '')}
                    step="1"
                    min="0"
                    allowDecimals={true}
                    allowNegative={false}
                    className={'w-full ' + (isMobile ? 'py-2' : 'py-1.5') + ' text-sm border-2 rounded-lg transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-blue-500 focus:border-transparent'}
                  />
                </div>

                <div>
                  <label className={'block text-xs font-medium text-gray-600 ' + (isMobile ? 'mb-1' : 'mb-2') + ''}>
                    Prepayment Amount
                  </label>
                  <NumberInput
                    value={inputs.prepayment}
                    onChange={(value) => handleInputChange('prepayment', value)}
                    placeholder="Enter amount"
                    prefix={formatCurrency(0).replace(/[\d.,]/g, '')}
                    step="1"
                    min="0"
                    allowDecimals={true}
                    allowNegative={false}
                    className={'w-full ' + (isMobile ? 'py-2' : 'py-1.5') + ' text-sm border-2 rounded-lg transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-blue-500 focus:border-transparent'}
                  />
                </div>
              </div>

              <div className={'text-xs text-gray-500 ' + (isMobile ? 'mt-2' : 'mt-3') + ''}>
                <p>• Processing Fee: One-time fee charged by the lender</p>
                <p>• Prepayment: Additional amount you plan to pay towards principal</p>
              </div>
            </div>
          </div>
        </ModernInputSection>

        {/* Results Section */}
        <ModernResultsSection
          title="Results"
          icon={TrendingUp}
          results={results}
          onShare={shareCalculation}
          onAddToComparison={handleAddToComparison}
          categoryColor="blue"
          emptyStateMessage="Enter loan details to see EMI calculation"
          className="w-full"
        >
          {/* Main Result */}
          <ModernSummaryCard
            title="Monthly EMI"
            items={[
              { value: results?.emi, type: 'currency' }
            ]}
            categoryColor="blue"
            size="large"
            centered={true}
            hideLabels={true}
            className={isMobile ? 'mb-4' : 'mb-6'}
          />

          {/* Key Metrics */}
          <ModernResultGrid
            results={[
              { label: 'Principal Amount', value: results?.principal, type: 'currency' },
              { label: 'Total Interest', value: results?.totalInterest, type: 'currency' },
              { label: 'Total Amount Payable', value: results?.totalAmount, type: 'currency', highlight: true },
              { label: 'Interest Rate', value: results?.interestRate, type: 'percentage' }
            ]}
            categoryColor="blue"
            className={isMobile ? 'grid-cols-1 gap-3' : ''}
          />

          {/* Loan Breakdown Chart */}
          {results && (
            <BreakdownSection
              title="Loan Breakdown"
              data={pieData}
              summaryCards={[]}
              chartType="pie"
              categoryColor="blue"
              className={isMobile ? 'mt-4' : 'mt-6'}
            />
          )}
        </ModernResultsSection>
      </MobileGrid>

      {/* PDF Export */}
      {results && (
        <div className={isMobile ? 'mt-4' : 'mt-6'}>
          <CommonPDFExport
            calculatorName="EMI Calculator"
            inputs={{
              'Loan Amount': formatCurrency(inputs.loanAmount),
              'Interest Rate': `${inputs.interestRate}% p.a.`,
              'Loan Tenure': (inputs.loanTenure) + ' ' + (inputs.tenureType),
              'Monthly Interest Rate': ((parseFloat(inputs.interestRate) / 12).toFixed(4)) + '%',
              'Total Months': inputs.tenureType === "years" ? (parseInt(inputs.loanTenure) * 12) + ' months' : (inputs.loanTenure) + ' months',
              'Processing Fee': inputs.processingFee ? formatCurrency(inputs.processingFee) : "Not applicable",
              'Prepayment': inputs.prepayment ? formatCurrency(inputs.prepayment) : "None planned"
            }}
            results={{
              'Monthly EMI': formatCurrency(results.emi || 0),
              'Total Amount Payable': formatCurrency(results.totalAmount || 0),
              'Total Interest Payable': formatCurrency(results.totalInterest || 0),
              'Interest Percentage': (parseFloat(inputs.loanAmount) > 0 ? (results.totalInterest / parseFloat(inputs.loanAmount) * 100).toFixed(2) : '0.00') + '%',
              'Principal to Interest Ratio': `${(parseFloat(inputs.loanAmount) / results.totalInterest).toFixed(2)}:1`,
              'EMI to Loan Ratio': (parseFloat(inputs.loanAmount) > 0 ? (results.emi / parseFloat(inputs.loanAmount) * 100).toFixed(4) : '0.0000') + '%',
              'Break-even Point': `Month ${Math.ceil((parseInt(inputs.loanTenure) * (inputs.tenureType === "years" ? 12 : 1)) / 2)}`,
              'Total Months': inputs.tenureType === "years" ? (parseInt(inputs.loanTenure) * 12) + ' months' : (inputs.loanTenure) + ' months'
            }}
          />
        </div>
      )}

      {/* Related Calculators */}
      {currentCalculatorId && calculatorData && onCalculatorSelect && (
        <div className={isMobile ? 'mt-4' : 'mt-6'}>
          <RelatedCalculators
            currentCalculatorId={currentCalculatorId}
            calculatorData={calculatorData}
            onCalculatorSelect={onCalculatorSelect}
          />
        </div>
      )}
    </MobileLayout>
  )
}