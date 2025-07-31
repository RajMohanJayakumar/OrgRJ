import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Home, BarChart3, DollarSign, Calendar } from 'lucide-react'
import { useCurrency } from '../contexts/CurrencyContext'
import { useViewMode } from '../contexts/ViewModeContext'
import useMobileResponsive from '../hooks/useMobileResponsive'
import UniversalRelatedCalculators from '../components/UniversalRelatedCalculators'
import CommonPDFExport from '../components/CommonPDFExport'
import ResetButton from '../components/ResetButton'
import { NumberInput } from '../components/common/inputs'
import MobileLayout, { MobileGrid } from '../components/MobileLayout'
import {
  SummaryCard,
  Section,
  Container,
  Grid
} from '../components/common'

const PropertyTaxCalculator = ({ currentCalculatorId, calculatorData, onCalculatorSelect }) => {
  const { formatCurrency } = useCurrency()
  const { isMobile } = useViewMode()
  const { responsive } = useMobileResponsive()
  
  const [inputs, setInputs] = useState({
    propertyValue: '',
    propertyType: 'residential',
    propertyAge: '',
    builtUpArea: '',
    location: 'tier1',
    annualRentalValue: '',
    taxRate: '',
    rebatePercentage: '0'
  })

  const [results, setResults] = useState({
    assessedValue: 0,
    annualPropertyTax: 0,
    monthlyPropertyTax: 0,
    rebateAmount: 0,
    netTaxPayable: 0,
    taxPerSqFt: 0
  })

  // Property tax rates by city/location (approximate)
  const taxRates = {
    tier1: { residential: 0.8, commercial: 1.5, industrial: 2.0 }, // Mumbai, Delhi, Bangalore
    tier2: { residential: 0.6, commercial: 1.2, industrial: 1.8 }, // Pune, Chennai, Hyderabad
    tier3: { residential: 0.4, commercial: 1.0, industrial: 1.5 }  // Other cities
  }

  const handleInputChange = (field, value) => {
    setInputs(prev => ({ ...prev, [field]: value }))
  }

  const calculateResults = () => {
    const propertyValue = parseFloat(inputs.propertyValue) || 0
    const propertyAge = parseFloat(inputs.propertyAge) || 0
    const builtUpArea = parseFloat(inputs.builtUpArea) || 0
    const annualRentalValue = parseFloat(inputs.annualRentalValue) || 0
    const customTaxRate = parseFloat(inputs.taxRate) || 0
    const rebatePercentage = parseFloat(inputs.rebatePercentage) || 0

    if (propertyValue > 0) {
      // Calculate assessed value (usually lower than market value)
      let assessedValue = propertyValue
      
      // Age-based depreciation for assessment
      if (propertyAge > 0) {
        const depreciationRate = Math.min(propertyAge * 0.02, 0.3) // Max 30% depreciation
        assessedValue = propertyValue * (1 - depreciationRate)
      }
      
      // Use Annual Rental Value method if provided (common in India)
      if (annualRentalValue > 0) {
        assessedValue = Math.max(assessedValue, annualRentalValue * 10) // 10x annual rent
      }
      
      // Determine tax rate
      let taxRate = customTaxRate
      if (taxRate === 0) {
        taxRate = taxRates[inputs.location][inputs.propertyType]
      }
      
      // Calculate annual property tax
      const annualPropertyTax = (assessedValue * taxRate) / 100
      
      // Calculate rebate
      const rebateAmount = (annualPropertyTax * rebatePercentage) / 100
      
      // Net tax payable
      const netTaxPayable = annualPropertyTax - rebateAmount
      
      // Monthly tax
      const monthlyPropertyTax = netTaxPayable / 12
      
      // Tax per sq ft
      const taxPerSqFt = builtUpArea > 0 ? netTaxPayable / builtUpArea : 0

      setResults({
        assessedValue,
        annualPropertyTax,
        monthlyPropertyTax,
        rebateAmount,
        netTaxPayable,
        taxPerSqFt
      })
    }
  }

  useEffect(() => {
    calculateResults()
  }, [inputs])

  const resetCalculator = () => {
    setInputs({
      propertyValue: '',
      propertyType: 'residential',
      propertyAge: '',
      builtUpArea: '',
      location: 'tier1',
      annualRentalValue: '',
      taxRate: '',
      rebatePercentage: '0'
    })
    setResults({
      assessedValue: 0,
      annualTax: 0,
      monthlyTax: 0,
      quarterlyTax: 0,
      effectiveRate: 0,
      rebateAmount: 0
    })
  }

  return (
    <>
      <Container size="lg">
      <Grid columns={{ base: 1, lg: 2 }} gap="lg">
        {/* Property Information */}
        <Section title="Property Information" icon={Home}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Market Value
              </label>
              <NumberInput
                value={inputs.propertyValue}
                onChange={(value) => handleInputChange('propertyValue', value)}
                placeholder="Enter amount"
                prefix={formatCurrency(0).replace(/[\d.,]/g, '')}
                step="1"
                allowDecimals={true}
                allowNegative={false}
                className="w-full py-2 text-sm font-medium border-2 rounded-xl transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Type
              </label>
              <select
                value={inputs.propertyType}
                onChange={(e) => handleInputChange('propertyType', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="industrial">Industrial</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location Category
              </label>
              <select
                value={inputs.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="tier1">Tier 1 Cities (Mumbai, Delhi, Bangalore)</option>
                <option value="tier2">Tier 2 Cities (Pune, Chennai, Hyderabad)</option>
                <option value="tier3">Tier 3 Cities (Other cities)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Age (Years)
              </label>
              <NumberInput
                value={inputs.propertyAge}
                onChange={(value) => handleInputChange('propertyAge', value)}
                placeholder="Enter value"
                suffix="years"
                step="1"
                allowDecimals={false}
                allowNegative={false}
                className="w-full py-2 text-sm font-medium border-2 rounded-xl transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Built-up Area (sq ft)
              </label>
              <NumberInput
                value={inputs.builtUpArea}
                onChange={(value) => handleInputChange('builtUpArea', value)}
                placeholder="1200"
                suffix="sq ft"
                step="1"
                allowDecimals={false}
                allowNegative={false}
                className="w-full py-2 text-sm font-medium border-2 rounded-xl transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>
        </Section>

        {/* Tax Calculation Parameters */}
        <Section title="Tax Parameters" icon={BarChart3}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Annual Rental Value (Optional)
              </label>
              <NumberInput
                value={inputs.annualRentalValue}
                onChange={(value) => handleInputChange('annualRentalValue', value)}
                placeholder="240000"
                prefix={formatCurrency(0).replace(/[\d.,]/g, '')}
                step="1"
                allowDecimals={true}
                allowNegative={false}
                className="w-full py-2 text-sm font-medium border-2 rounded-xl transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom Tax Rate (%) - Optional
              </label>
              <NumberInput
                value={inputs.taxRate}
                onChange={(value) => handleInputChange('taxRate', value)}
                placeholder="1.2"
                suffix="%"
                step="0.1"
                allowDecimals={true}
                allowNegative={false}
                className="w-full py-2 text-sm font-medium border-2 rounded-xl transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rebate/Discount (%)
              </label>
              <input
                type="range"
                min="0"
                max="50"
                step="5"
                value={inputs.rebatePercentage}
                onChange={(e) => handleInputChange('rebatePercentage', e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0%</span>
                <span>Current: {inputs.rebatePercentage}%</span>
                <span>50%</span>
              </div>
            </div>

            {/* Tax Rate Information */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Current Tax Rates:</h4>
              <div className="text-sm text-blue-700">
                <div>Residential: {taxRates[inputs.location].residential}%</div>
                <div>Commercial: {taxRates[inputs.location].commercial}%</div>
                <div>Industrial: {taxRates[inputs.location].industrial}%</div>
              </div>
            </div>
          </div>
        </Section>

        {/* Tax Calculation Results */}
        <SummaryCard
          title="Tax Calculation"
          icon={DollarSign}
          items={[
            { label: "Assessed Property Value", value: results.assessedValue, type: "currency" },
            { label: "Annual Property Tax", value: results.annualPropertyTax, type: "currency" },
            { label: "Rebate Amount", value: results.rebateAmount, type: "currency" },
            { label: "Net Tax Payable", value: results.netTaxPayable, type: "currency" }
          ]}
          color="red"
        />

        {/* Monthly Breakdown */}
        <div className="space-y-4">
          <SummaryCard
            title="Payment Breakdown"
            icon={Calendar}
            items={[
              { label: "Monthly Property Tax", value: results.monthlyPropertyTax, type: "currency" },
              { label: "Tax per Sq Ft (Annual)", value: results.taxPerSqFt, type: "currency" },
              { label: "Quarterly Payment", value: results.netTaxPayable / 4, type: "currency" },
              { label: "Half-yearly Payment", value: results.netTaxPayable / 2, type: "currency" }
            ]}
            color="blue"
          />

          {/* Reset Button */}
          <ResetButton onReset={resetCalculator} />
        </div>
      </Grid>

      {/* Property Tax Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-8 p-6 bg-yellow-50 rounded-xl"
      >
        <h3 className="text-lg font-semibold text-yellow-800 mb-4">🏛️ Property Tax Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-yellow-700">
          <div>
            <h4 className="font-semibold mb-2">Tax Calculation Methods:</h4>
            <ul className="space-y-1">
              <li>• <strong>Capital Value System:</strong> Based on market value</li>
              <li>• <strong>Annual Rental Value:</strong> Based on rental income</li>
              <li>• <strong>Unit Area Value:</strong> Based on area and location</li>
              <li>• <strong>Composite Method:</strong> Combination of above</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Common Rebates:</h4>
            <ul className="space-y-1">
              <li>• Senior citizen discount: 25-50%</li>
              <li>• Early payment discount: 5-15%</li>
              <li>• Women ownership: 10-30%</li>
              <li>• Green building: 10-25%</li>
            </ul>
          </div>
        </div>
      </motion.div>

    </Container>

    {/* Universal Related Calculators - Full Width */}
    <div className="mt-8 px-4 sm:px-6 lg:px-8">
      <UniversalRelatedCalculators
        currentCalculatorId={currentCalculatorId}
        calculatorData={calculatorData}
        onCalculatorSelect={onCalculatorSelect}
        className=""
      />

      
    </div>
    </>

  )
}

export default PropertyTaxCalculator
