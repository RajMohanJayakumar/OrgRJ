import { useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useComparison } from '../contexts/ComparisonContext'
import { useCurrency } from '../contexts/CurrencyContext'
import { useViewMode } from '../contexts/ViewModeContext'
import { useCalculatorState, generateCalculatorShareURL } from '../hooks/useCalculatorState'
import useMobileResponsive from '../hooks/useMobileResponsive'

import CommonPDFExport from '../components/CommonPDFExport'
import { NumberInput } from '../components/common/inputs'
import ModernInputSection from '../components/ModernInputSection'
import ModernResultsSection, { ModernResultGrid, ModernSummaryCard } from '../components/ModernResultsSection'
import CalculatorDropdown from '../components/CalculatorDropdown'
import CompactCurrencyDisplay from '../components/CompactCurrencyDisplay'
import RelatedCalculators from '../components/RelatedCalculators'
import { Calculator, Receipt } from 'lucide-react'
import MobileLayout, { MobileGrid } from '../components/MobileLayout'

function TaxCalculator({ currentCalculatorId, calculatorData, onCalculatorSelect }) {
  const { addToComparison } = useComparison()
  const { formatCurrency } = useCurrency()
  const { responsive } = useMobileResponsive()
  const { isMobile } = useViewMode()

  // Default values
  const defaultInputs = {
    annualIncome: '',
    country: 'india',
    taxRegime: 'new',
    deductions: '',
    pfContribution: '',
    pfFrequency: 'annual'
  }

  // State management with URL synchronization
  const {
    inputs,
    results,
    setResults,
    handleInputChange,
    resetCalculator
  } = useCalculatorState('tax_', defaultInputs)

  // Handle reset
  const handleReset = () => {
    resetCalculator()
  }

  // Reset tax regime when country changes
  useEffect(() => {
    if (inputs.country) {
      const defaultRegimes = {
        india: 'new',
        usa: 'single',
        uk: 'standard',
        canada: 'ontario',
        australia: 'resident'
      }

      const defaultRegime = defaultRegimes[inputs.country]
      if (defaultRegime && inputs.taxRegime !== defaultRegime) {
        handleInputChange('taxRegime', defaultRegime)
      }
    }
  }, [inputs.country])

  // Tax calculation function
  const calculateTax = (annualIncome, country, taxRegime, deductions, pfContribution, pfFrequency) => {
    // Get tax slabs based on country and regime
    const getTaxSlabs = (country, regime) => {
      switch (country) {
        case 'india':
          return {
            old: [
              { min: 0, max: 250000, rate: 0 },
              { min: 250000, max: 500000, rate: 5 },
              { min: 500000, max: 1000000, rate: 20 },
              { min: 1000000, max: Infinity, rate: 30 }
            ],
            new: [
              { min: 0, max: 300000, rate: 0 },
              { min: 300000, max: 600000, rate: 5 },
              { min: 600000, max: 900000, rate: 10 },
              { min: 900000, max: 1200000, rate: 15 },
              { min: 1200000, max: 1500000, rate: 20 },
              { min: 1500000, max: Infinity, rate: 30 }
            ]
          }[regime]

        case 'usa':
          return {
            single: [
              { min: 0, max: 11000, rate: 10 },
              { min: 11000, max: 44725, rate: 12 },
              { min: 44725, max: 95375, rate: 22 },
              { min: 95375, max: 182050, rate: 24 },
              { min: 182050, max: 231250, rate: 32 },
              { min: 231250, max: 578125, rate: 35 },
              { min: 578125, max: Infinity, rate: 37 }
            ],
            married_joint: [
              { min: 0, max: 22000, rate: 10 },
              { min: 22000, max: 89450, rate: 12 },
              { min: 89450, max: 190750, rate: 22 },
              { min: 190750, max: 364200, rate: 24 },
              { min: 364200, max: 462500, rate: 32 },
              { min: 462500, max: 693750, rate: 35 },
              { min: 693750, max: Infinity, rate: 37 }
            ],
            married_separate: [
              { min: 0, max: 11000, rate: 10 },
              { min: 11000, max: 44725, rate: 12 },
              { min: 44725, max: 95375, rate: 22 },
              { min: 95375, max: 182100, rate: 24 },
              { min: 182100, max: 231250, rate: 32 },
              { min: 231250, max: 346875, rate: 35 },
              { min: 346875, max: Infinity, rate: 37 }
            ],
            head_household: [
              { min: 0, max: 15700, rate: 10 },
              { min: 15700, max: 59850, rate: 12 },
              { min: 59850, max: 95350, rate: 22 },
              { min: 95350, max: 182050, rate: 24 },
              { min: 182050, max: 231250, rate: 32 },
              { min: 231250, max: 578100, rate: 35 },
              { min: 578100, max: Infinity, rate: 37 }
            ]
          }[regime]

        case 'uk':
          return [
            { min: 0, max: 12570, rate: 0 }, // Personal Allowance
            { min: 12570, max: 50270, rate: 20 }, // Basic Rate
            { min: 50270, max: 125140, rate: 40 }, // Higher Rate
            { min: 125140, max: Infinity, rate: 45 } // Additional Rate
          ]

        case 'canada':
          // Federal rates + provincial (using Ontario as example)
          const federalRates = [
            { min: 0, max: 53359, rate: 15 },
            { min: 53359, max: 106717, rate: 20.5 },
            { min: 106717, max: 165430, rate: 26 },
            { min: 165430, max: 235675, rate: 29 },
            { min: 235675, max: Infinity, rate: 33 }
          ]

          if (regime === 'ontario') {
            return [
              { min: 0, max: 49231, rate: 20.05 }, // Combined federal + Ontario
              { min: 49231, max: 53359, rate: 24.15 },
              { min: 53359, max: 98463, rate: 31.48 },
              { min: 98463, max: 106717, rate: 35.39 },
              { min: 106717, max: 165430, rate: 37.91 },
              { min: 165430, max: 220000, rate: 43.41 },
              { min: 220000, max: 235675, rate: 44.97 },
              { min: 235675, max: Infinity, rate: 46.16 }
            ]
          }
          return federalRates

        case 'australia':
          if (regime === 'resident') {
            return [
              { min: 0, max: 18200, rate: 0 }, // Tax-free threshold
              { min: 18200, max: 45000, rate: 19 },
              { min: 45000, max: 120000, rate: 32.5 },
              { min: 120000, max: 180000, rate: 37 },
              { min: 180000, max: Infinity, rate: 45 }
            ]
          } else if (regime === 'non_resident') {
            return [
              { min: 0, max: 120000, rate: 32.5 },
              { min: 120000, max: 180000, rate: 37 },
              { min: 180000, max: Infinity, rate: 45 }
            ]
          } else if (regime === 'working_holiday') {
            return [
              { min: 0, max: 45000, rate: 15 },
              { min: 45000, max: 120000, rate: 32.5 },
              { min: 120000, max: 180000, rate: 37 },
              { min: 180000, max: Infinity, rate: 45 }
            ]
          }
          break

        default:
          return []
      }
    }

    // Get tax slabs for the selected country and regime
    const slabs = getTaxSlabs(country, taxRegime)

    if (!slabs || slabs.length === 0) {
      return {
        grossIncome: annualIncome,
        monthlyIncome: annualIncome / 12,
        totalDeductions: 0,
        taxableIncome: annualIncome,
        taxPayable: 0,
        netIncome: annualIncome,
        effectiveTaxRate: 0,
        taxBreakdown: [],
        pfContribution: 0
      }
    }

    // Calculate deductions based on country
    let totalDeductions = 0
    let annualPfContribution = 0

    if (country === 'india') {
      // Calculate PF contribution (annual)
      annualPfContribution = pfFrequency === 'monthly' ? pfContribution * 12 : pfContribution
      totalDeductions = annualPfContribution

      // Add other deductions only for old regime in India
      if (taxRegime === 'old') {
        totalDeductions += deductions
      }
    } else if (country === 'usa') {
      // Standard deduction for USA (2023)
      const standardDeductions = {
        single: 13850,
        married_joint: 27700,
        married_separate: 13850,
        head_household: 20800
      }
      totalDeductions = standardDeductions[taxRegime] || 0
    } else if (country === 'uk') {
      // UK has personal allowance built into tax slabs
      totalDeductions = 0
    } else if (country === 'canada') {
      // Basic personal amount for Canada (2023)
      totalDeductions = 15000
    } else if (country === 'australia') {
      // Australia has tax-free threshold built into tax slabs
      totalDeductions = 0
    }

    // Calculate taxable income
    const taxableIncome = Math.max(0, annualIncome - totalDeductions)

    // Calculate income tax
    let incomeTax = 0
    const taxBreakdown = []

    for (const slab of slabs) {
      if (taxableIncome > slab.min) {
        const taxableInThisSlab = Math.min(taxableIncome, slab.max) - slab.min
        const taxInThisSlab = taxableInThisSlab * (slab.rate / 100)

        if (taxInThisSlab > 0) {
          incomeTax += taxInThisSlab
          taxBreakdown.push({
            range: formatCurrency(slab.min) + ' - ' + (slab.max === Infinity ? 'Above' : formatCurrency(slab.max)),
            rate: slab.rate,
            taxableAmount: taxableInThisSlab,
            tax: taxInThisSlab
          })
        }
      }
    }

    // Calculate additional taxes/levies based on country
    let additionalTax = 0
    let additionalTaxName = ''

    if (country === 'india') {
      // Health & Education Cess (4% on income tax)
      additionalTax = incomeTax * 0.04
      additionalTaxName = 'Health & Education Cess'
    } else if (country === 'australia' && taxRegime === 'resident') {
      // Medicare Levy (2% for residents)
      if (annualIncome > 23226) { // Medicare levy threshold
        additionalTax = annualIncome * 0.02
        additionalTaxName = 'Medicare Levy'
      }
    }

    // Calculate total tax
    const totalTax = incomeTax + additionalTax

    // Calculate results
    const netIncome = annualIncome - totalTax
    const monthlyIncome = annualIncome / 12
    const effectiveTaxRate = annualIncome > 0 ? (totalTax / annualIncome) * 100 : 0

    return {
      grossIncome: annualIncome,
      monthlyIncome,
      totalDeductions,
      taxableIncome,
      incomeTax,
      cess: additionalTax,
      cessName: additionalTaxName,
      taxPayable: totalTax,
      netIncome,
      effectiveTaxRate: parseFloat(effectiveTaxRate.toFixed(2)),
      taxBreakdown,
      pfContribution: annualPfContribution
    }
  }

  // Share calculation
  const shareCalculation = () => {
    const shareableURL = generateCalculatorShareURL('tax', inputs)

    const shareData = {
      title: 'finclamp.com - Tax Calculator Results',
      text: `Tax Calculator Results - Annual Income: ${formatCurrency(inputs.annualIncome)}, Tax Payable: ${formatCurrency(results?.taxPayable)}`,
      url: shareableURL
    }

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      navigator.share(shareData)
    } else {
      navigator.clipboard.writeText(shareableURL)
      alert('Calculation link copied to clipboard!')
    }
  }

  // Add to comparison
  const handleAddToComparison = () => {
    if (results) {
      const comparisonData = {
        type: 'Tax',
        inputs: {
          annualIncome: inputs.annualIncome,
          country: inputs.country,
          taxRegime: inputs.taxRegime,
          deductions: inputs.deductions || 0
        },
        results: {
          taxPayable: results.taxPayable,
          netIncome: results.netIncome,
          effectiveTaxRate: results.effectiveTaxRate
        }
      }
      addToComparison(comparisonData)
    }
  }

  // Calculate tax when inputs change
  useEffect(() => {
    const annualIncome = parseFloat(inputs.annualIncome) || 0
    const deductions = parseFloat(inputs.deductions) || 0
    const pfContribution = parseFloat(inputs.pfContribution) || 0

    if (annualIncome > 0) {
      const taxResults = calculateTax(
        annualIncome,
        inputs.country,
        inputs.taxRegime,
        deductions,
        pfContribution,
        inputs.pfFrequency
      )
      setResults(taxResults)
    } else {
      setResults(null)
    }
  }, [inputs.annualIncome, inputs.country, inputs.taxRegime, inputs.deductions, inputs.pfContribution, inputs.pfFrequency])

  return (
    <MobileLayout className={'' + (isMobile ? 'space-y-4' : 'space-y-8') + ' calculator-main-container'}>
      {/* Header */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
          <span className="text-3xl sm:text-4xl lg:text-5xl">🧾</span>
          Tax Calculator
        </h2>
        <p className="text-sm sm:text-base text-gray-600 px-4">Calculate your income tax liability with deductions and exemptions</p>
      </motion.div>

      {/* Main Content Grid */}
      <MobileGrid columns={2} className={isMobile ? 'mt-4' : 'mt-6'}>
        {/* Input Section */}
        <ModernInputSection title="Income Details" icon={Calculator} onReset={handleReset} categoryColor="red">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Annual Gross Income
              </label>
              <NumberInput
                value={inputs.annualIncome}
                onChange={(value) => handleInputChange('annualIncome', value)}
                placeholder="Enter amount"
                prefix={formatCurrency(0).replace(/[\d.,]/g, '')}
                step="1"
                min="0"
                allowDecimals={true}
                allowNegative={false}
                className="w-full py-2 text-sm font-medium border-2 rounded-xl transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            {/* Country Selection */}
            <CalculatorDropdown
              configKey="COUNTRIES"
              value={inputs.country}
              onChange={(value) => handleInputChange('country', value)}
              category="tax"
              placeholder="Select country"
            />

            {/* Tax Regime Selection */}
            <CalculatorDropdown
              configKey={`TAX_REGIME_${inputs.country?.toUpperCase() || 'INDIA'}`}
              value={inputs.taxRegime}
              onChange={(value) => handleInputChange('taxRegime', value)}
              category="tax"
              placeholder="Select tax regime"
            />

            {/* India-specific deductions */}
            {inputs.country === 'india' && (
              <>
                {/* PF Contribution - Available for both regimes */}
                <div className="space-y-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      PF Contribution
                    </label>
                    <NumberInput
                      value={inputs.pfContribution}
                      onChange={(value) => handleInputChange('pfContribution', value)}
                      placeholder="12000"
                      prefix={formatCurrency(0).replace(/[\d.,]/g, '')}
                      step="1"
                      min="0"
                      allowDecimals={true}
                      allowNegative={false}
                      className="w-full py-2 text-sm font-medium border-2 rounded-xl transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <label className="text-sm text-gray-600">Frequency:</label>
                    <select
                      value={inputs.pfFrequency}
                      onChange={(e) => handleInputChange('pfFrequency', e.target.value)}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="monthly">Monthly</option>
                      <option value="annual">Annual</option>
                    </select>
                  </div>
                </div>

                {/* Other Deductions - Only for old regime */}
                {inputs.taxRegime === 'old' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Other Deductions (80C, 80D, etc.)
                    </label>
                    <NumberInput
                      value={inputs.deductions}
                      onChange={(value) => handleInputChange('deductions', value)}
                      placeholder="150000"
                      prefix={formatCurrency(0).replace(/[\d.,]/g, '')}
                      step="1"
                      min="0"
                      allowDecimals={true}
                      allowNegative={false}
                      className="w-full py-2 text-sm font-medium border-2 rounded-xl transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                )}
              </>
            )}

            {/* Country-specific information */}
            {inputs.country !== 'india' && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-blue-600">ℹ️</span>
                  <span className="font-medium text-blue-800">Tax Information</span>
                </div>
                <div className="text-sm text-blue-700">
                  {inputs.country === 'usa' && 'Standard deduction is automatically applied based on filing status.'}
                  {inputs.country === 'uk' && 'Personal allowance of £12,570 is built into the tax calculation.'}
                  {inputs.country === 'canada' && 'Basic personal amount of CAD $15,000 is automatically applied.'}
                  {inputs.country === 'australia' && 'Tax-free threshold and Medicare levy are automatically calculated.'}
                </div>
              </div>
            )}
        </ModernInputSection>

        {/* Results Section */}
        <ModernResultsSection
          title="Tax Calculation Results"
          results={results}
          onShare={shareCalculation}
          onAddToComparison={handleAddToComparison}
          emptyStateMessage="Enter your income details to see tax calculation"
        >
          {/* Main Results */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {/* Tax Payable Card with Compact Display */}
            <motion.div
              className="relative overflow-hidden rounded-xl p-6 text-white bg-gradient-to-br from-red-500 to-pink-600 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg">💸</span>
                <div className="text-xs opacity-75">Tax Payable</div>
              </div>
              <div className="text-2xl sm:${responsive.typography.heading} font-bold">
                <CompactCurrencyDisplay
                  value={results?.taxPayable}
                  className="text-white"
                  compactThreshold={10000000}
                />
              </div>
            </motion.div>

            {/* Net Income Card with Compact Display */}
            <motion.div
              className="relative overflow-hidden rounded-xl p-6 text-white bg-gradient-to-br from-green-500 to-blue-600 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg">💰</span>
                <div className="text-xs opacity-75">Net Income</div>
              </div>
              <div className="text-2xl sm:${responsive.typography.heading} font-bold">
                <CompactCurrencyDisplay
                  value={results?.netIncome}
                  className="text-white"
                />
              </div>
            </motion.div>
          </div>

          {/* Additional Details */}
          <ModernResultGrid>
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">💼</span>
                <h3 className="text-lg font-semibold text-gray-900">Gross Income</h3>
              </div>
              <div className={(responsive.typography.heading) + ' font-bold text-blue-600'}>
                <CompactCurrencyDisplay value={results?.grossIncome} />
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">📅</span>
                <h3 className="text-lg font-semibold text-gray-900">Monthly Income</h3>
              </div>
              <div className={(responsive.typography.heading) + ' font-bold text-purple-600'}>
                <CompactCurrencyDisplay value={results?.monthlyIncome} />
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">📋</span>
                <h3 className="text-lg font-semibold text-gray-900">Total Deductions</h3>
              </div>
              <div className={(responsive.typography.heading) + ' font-bold text-green-600'}>
                <CompactCurrencyDisplay value={results?.totalDeductions} />
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">📈</span>
                <h3 className="text-lg font-semibold text-gray-900">Effective Tax Rate</h3>
              </div>
              <div className={(responsive.typography.heading) + ' font-bold text-orange-600'}>
                {results?.effectiveTaxRate ? (results.effectiveTaxRate) + '%' : '0%'}
              </div>
            </div>
          </ModernResultGrid>
        </ModernResultsSection>
      </MobileGrid>

      {/* Detailed Analysis Section - Full Width */}
      <AnimatePresence>
        {results && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Tax Summary */}
              <motion.div
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h4 className="text-lg font-bold mb-4 text-gray-800">
                  💼 Tax Summary
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 text-sm">Gross Income</span>
                    <span className="font-semibold text-blue-600 text-sm">{formatCurrency(results.grossIncome || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 text-sm">Monthly Income</span>
                    <span className="font-semibold text-blue-600 text-sm">{formatCurrency(results.monthlyIncome || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 text-sm">Total Deductions</span>
                    <span className="font-semibold text-sm">{formatCurrency(results.totalDeductions || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 text-sm">Taxable Income</span>
                    <span className="font-semibold text-purple-600 text-sm">
                      <CompactCurrencyDisplay value={results.taxableIncome} />
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 text-sm">Tax Payable</span>
                    <span className="font-semibold text-red-600 text-sm">
                      <CompactCurrencyDisplay value={results.taxPayable} />
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 text-sm">Tax Regime</span>
                    <span className="font-semibold text-sm">{inputs.taxRegime === 'old' ? 'Old' : 'New'}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600 text-sm">Effective Tax Rate</span>
                    <span className="font-semibold text-sm">{results.effectiveTaxRate}%</span>
                  </div>
                </div>
              </motion.div>

              {/* Tax Breakdown Chart */}
              <motion.div
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h4 className="text-lg font-bold mb-4 text-gray-800">
                  📊 Tax Breakdown
                </h4>
                {results.taxBreakdown && results.taxBreakdown.length > 0 ? (
                  <div className="space-y-3">
                    {results.taxBreakdown.map((slab, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-700">{slab.range}</div>
                          <div className="text-xs text-gray-500">Rate: {slab.rate}%</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-gray-800">
                            <CompactCurrencyDisplay value={slab.tax} />
                          </div>
                          <div className="text-xs text-gray-500">
                            on <CompactCurrencyDisplay value={slab.taxableAmount} />
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="border-t pt-3 mt-3">
                      <div className="flex justify-between items-center font-semibold">
                        <span>Total Tax {results.cessName && `(incl. ${results.cessName})`}</span>
                        <span className="text-red-600">
                          <CompactCurrencyDisplay value={results.taxPayable} />
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2">📈</div>
                    <p className="text-gray-500 text-sm">No tax breakdown available</p>
                  </div>
                )}
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
          calculatorName="Tax Calculator"
          inputs={{
            'Annual Income': formatCurrency(inputs.annualIncome),
            'Country': inputs.country?.toUpperCase() || "INDIA",
            'Tax Regime': inputs.taxRegime === "old" ? "Old Tax Regime" : "New Tax Regime",
            'Standard Deduction': formatCurrency(inputs.standardDeduction || 50000),
            'HRA Exemption': formatCurrency(inputs.hraExemption || 0),
            '80C Deductions': formatCurrency(inputs.deduction80C || 0),
            'Other Deductions': formatCurrency(inputs.otherDeductions || 0),
            'Professional Tax': formatCurrency(inputs.professionalTax || 0),
            'Age Category': inputs.age < 60 ? "Below 60 years" : inputs.age < 80 ? "Senior Citizen (60-80)" : "Super Senior Citizen (80+)"
          }}
          results={{
            'Gross Income': formatCurrency(inputs.annualIncome),
            'Total Deductions': formatCurrency(results.totalDeductions || 0),
            'Taxable Income': formatCurrency(results.taxableIncome || 0),
            'Income Tax': formatCurrency(results.incomeTax || 0),
            'Cess (4%)': formatCurrency(results.cess || 0),
            'Total Tax Liability': formatCurrency(results.totalTax || 0),
            'Net Income (Take Home)': formatCurrency(results.netIncome || 0),
            'Effective Tax Rate': (results.effectiveTaxRate.toFixed(2)) + '%',
            'Tax Savings': formatCurrency(results.taxSavings || 0),
            'Monthly Take Home': formatCurrency(results.netIncome / 12),
            'Tax as % of Gross': (parseFloat(inputs.annualIncome) > 0 ? (results.totalTax / parseFloat(inputs.annualIncome) * 100).toFixed(2) : '0.00') + '%'
          }}
        />

                  <div className="text-center pt-2">
                    <p className="text-sm text-gray-500">
                      💡 Tax calculations are approximate and for reference only
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

export default TaxCalculator
