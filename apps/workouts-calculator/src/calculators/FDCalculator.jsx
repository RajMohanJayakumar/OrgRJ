
import { useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Calculator, TrendingUp } from 'lucide-react'
import { useComparison } from '../contexts/ComparisonContext'
import { useCurrency } from '../contexts/CurrencyContext'
import { useViewMode } from '../contexts/ViewModeContext'
import { useCalculatorState, generateCalculatorShareURL } from '../hooks/useCalculatorState'
import { addMobileResponsivenessSEO, addPDFExportSEO, addChartResponsivenessSEO } from '../utils/seo'
import useMobileResponsive from '../hooks/useMobileResponsive'

import CommonPDFExport from '../components/CommonPDFExport'
import { NumberInput } from '../components/common/inputs'
import ModernInputSection from '../components/ModernInputSection'
import ModernResultsSection, { ModernResultGrid, ModernSummaryCard } from '../components/ModernResultsSection'
import BreakdownSection from '../components/BreakdownSection'
import RelatedCalculators from '../components/RelatedCalculators'
import MobileLayout, { MobileGrid } from '../components/MobileLayout'

export default function FDCalculator({ onAddToComparison, categoryColor = 'green', currentCalculatorId, calculatorData, onCalculatorSelect }) {
  const { addToComparison } = useComparison()
  const { formatCurrency } = useCurrency()
  const { responsive } = useMobileResponsive()
  const { isMobile } = useViewMode()

  const defaultInputs = {
    principal: '',
    interestRate: '',
    timePeriod: '',
    compoundingFrequency: '4' // Quarterly
  }

  const {
    inputs,
    results,
    setResults,
    handleInputChange,
    resetCalculator
  } = useCalculatorState('fd_', defaultInputs)

  // FD calculation function
  const calculateFD = useCallback(() => {
    const principal = parseFloat(inputs.principal) || 0
    const rate = parseFloat(inputs.interestRate) || 0
    const time = parseFloat(inputs.timePeriod) || 0
    const frequency = parseFloat(inputs.compoundingFrequency) || 4

    if (principal <= 0 || rate <= 0 || time <= 0) {
      setResults(null)
      return
    }

    // Compound Interest Formula: A = P(1 + r/n)^(nt)
    const maturityAmount = principal * Math.pow(1 + (rate / 100) / frequency, frequency * time)
    const totalInterest = maturityAmount - principal
    const effectiveRate = ((maturityAmount / principal) ** (1 / time) - 1) * 100

    setResults({
      maturityAmount,
      totalInterest,
      effectiveRate,
      principal,
      timePeriod: time
    })
  }, [inputs, setResults])

  // Trigger calculation when inputs change
  useEffect(() => {
    calculateFD()
  }, [calculateFD])

  // Enhanced SEO for mobile responsiveness, PDF export, and charts
  useEffect(() => {
    addMobileResponsivenessSEO();
    addPDFExportSEO();
    addChartResponsivenessSEO();
    
    // Update page title and meta description
    document.title = 'FD Calculator - Fixed Deposit Calculator | Mobile Responsive';
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Calculate fixed deposit maturity amount with mobile-optimized calculator. Interactive charts and downloadable PDF reports.');
    }
    
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', 'FD calculator, fixed deposit, bank FD calculator, mobile responsive, PDF export');
    }
  }, []);

  // Share calculation
  const shareCalculation = () => {
    const shareableURL = generateCalculatorShareURL('fd', inputs, results)

    const shareData = {
      title: 'finclamp.com - FD Calculator Results',
      text: `FD Calculation: Principal ${formatCurrency(inputs.principal)}, Maturity: ${formatCurrency(results?.maturityAmount)}`,
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
        calculator: 'FD Calculator',
        inputs: {
          principal: inputs.principal,
          interestRate: (inputs.interestRate) + '%',
          timePeriod: (inputs.timePeriod) + ' years',
          compoundingFrequency: getCompoundingLabel(inputs.compoundingFrequency)
        },
        results: {
          maturityAmount: results.maturityAmount,
          totalInterest: results.totalInterest,
          effectiveRate: results.effectiveRate
        }
      }

      addToComparison(comparisonData)

      if (onAddToComparison) {
        onAddToComparison(comparisonData)
      }
    }
  }

  const getCompoundingLabel = (frequency) => {
    const labels = {
      '1': 'Annually',
      '2': 'Semi-annually',
      '4': 'Quarterly',
      '12': 'Monthly',
      '365': 'Daily'
    }
    return labels[frequency] || 'Quarterly'
  }

  // Chart data for comparison visualization
  const chartData = results ? [
    { name: 'Principal', value: results.principal, color: '#10B981' },
    { name: 'Interest', value: results.totalInterest, color: '#34D399' }
  ] : []

  // Responsive grid class
  const gridClass = isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'

  return (
    <MobileLayout className={'' + (isMobile ? 'space-y-4' : 'space-y-8') + ' calculator-main-container'}>
      {/* Header */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className={(responsive.typography.heading) + ' font-bold text-gray-900 mb-2 flex items-center justify-center gap-3'}>
          <span className="text-4xl">🏦</span>
          FD Calculator
        </h2>
        <p className="text-gray-600">Calculate your Fixed Deposit maturity amount and returns</p>
      </motion.div>

      <MobileGrid columns={2} className={isMobile ? 'mt-4' : 'mt-6'}>
        {/* Input Section */}
        <ModernInputSection
          title="FD Details"
          icon={Calculator}
          onReset={resetCalculator}
          categoryColor="green"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Principal Amount
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
              step="0.5"
              min="0.5"
              max="50"
              allowDecimals={true}
              allowNegative={false}
              className="w-full py-2 text-sm font-medium border-2 rounded-xl transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Compounding Frequency
            </label>
            <select
              value={inputs.compoundingFrequency}
              onChange={(e) => handleInputChange('compoundingFrequency', e.target.value)}
              className="w-full py-2 text-sm font-medium border-2 rounded-xl transition-all duration-300 focus:outline-none cursor-pointer focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="1">Annually</option>
              <option value="2">Semi-annually</option>
              <option value="4">Quarterly</option>
              <option value="12">Monthly</option>
              <option value="365">Daily</option>
            </select>
          </div>
        </ModernInputSection>

        {/* Results Section */}
        <ModernResultsSection
          title="Results"
          icon={TrendingUp}
          results={results}
          onShare={shareCalculation}
          onAddToComparison={handleAddToComparison}
          categoryColor="green"
          emptyStateMessage="Enter FD details to see calculation"
        >
          {/* Main Result */}
          <ModernSummaryCard
            title="Maturity Amount"
            items={[
              { value: results?.maturityAmount, type: 'currency' }
            ]}
            categoryColor="green"
            size="large"
            centered={true}
            hideLabels={true}
            className="mb-6"
          />

          {/* Key Metrics */}
          <ModernResultGrid
            results={[
              { label: 'Principal Amount', value: results?.principal, type: 'currency' },
              { label: 'Total Interest Earned', value: results?.totalInterest, type: 'currency' },
              { label: 'Investment Duration', value: (results?.timePeriod) + ' years', type: 'text' },
              { label: 'Effective Annual Rate', value: results?.effectiveRate?.toFixed(2), type: 'percentage' }
            ]}
            categoryColor="green"
          />

          {/* FD Breakdown Chart */}
          {results && chartData.length > 0 && (
            <BreakdownSection
              title="Principal vs Interest Breakdown"
              data={chartData.map(item => ({
                name: item.name,
                value: item.value,
                color: item.name === 'Principal' ? '#10B981' : '#34D399'
              }))}
              summaryCards={[]}
              chartType="bar"
              categoryColor="green"
            />
          )}
        </ModernResultsSection>
      </MobileGrid>

      {/* PDF Export */}
      {results && (
        <CommonPDFExport
          calculatorName="FD Calculator"
          inputs={{
            'Principal Amount': formatCurrency(inputs.principal),
            'Interest Rate': `${inputs.interestRate}% p.a.`,
            'Time Period': (inputs.timePeriod) + ' ' + (inputs.timePeriodType),
            'Compounding Frequency': inputs.compoundingFrequency || "Quarterly",
            'Deposit Type': "Fixed Deposit",
            'Maturity Period': inputs.timePeriodType === "years" ? (parseInt(inputs.timePeriod) * 12) + ' months' : (inputs.timePeriod) + ' months',
            'Monthly Interest Rate': ((parseFloat(inputs.interestRate) / 12).toFixed(4)) + '%',
            'Effective Annual Rate': `${inputs.interestRate}% (compounded ${inputs.compoundingFrequency?.toLowerCase()})`
          }}
          results={{
            'Maturity Amount': formatCurrency(results.maturityAmount || 0),
            'Interest Earned': formatCurrency(results.totalInterest || 0),
            'Total Investment': formatCurrency(inputs.principal),
            'Return Percentage': (parseFloat(inputs.principal) > 0 ? (results.totalInterest / parseFloat(inputs.principal) * 100).toFixed(2) : '0.00') + '%',
            'Effective Yield': (((results.maturityAmount / parseFloat(inputs.principal)) ** (1 / (parseInt(inputs.timePeriod) / (inputs.timePeriodType === "years" ? 1 : 12))) - 1) * 100).toFixed(2) + '% p.a.',
            'Monthly Interest': formatCurrency(results.totalInterest / (parseInt(inputs.timePeriod) * (inputs.timePeriodType === "years" ? 12 : 1))),
            'Daily Interest': formatCurrency(results.totalInterest / (parseInt(inputs.timePeriod) * (inputs.timePeriodType === "years" ? 365 : 30))),
            'Investment Multiple': (results.maturityAmount / parseFloat(inputs.principal)).toFixed(2) + 'x'
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
