import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Home, DollarSign, Calculator, TrendingUp } from 'lucide-react'
import { useCurrency } from '../contexts/CurrencyContext'
import { useViewMode } from '../contexts/ViewModeContext'
import useMobileResponsive from '../hooks/useMobileResponsive'
import { NumberInput } from '../components/common/inputs'
import CommonPDFExport from '../components/CommonPDFExport'
import UniversalRelatedCalculators from '../components/UniversalRelatedCalculators'
import MobileLayout, { MobileGrid } from '../components/MobileLayout'
import {
  SummaryCard,
  Section,
  Container,
  Grid
} from '../components/common'

// Flexible Fee Input Component - memoized to prevent unnecessary re-renders
const FlexibleFeeInput = ({ label, value, onValueChange, type, onTypeChange, placeholder }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <div className="flex gap-2">
      <div className="flex-1">
        <NumberInput
          value={value}
          onChange={onValueChange}
          placeholder={placeholder}
          suffix={type === 'percentage' ? '%' : ''}
          step={type === 'percentage' ? '0.5' : '1'}
          allowDecimals={true}
          allowNegative={false}
          className="w-full py-2 text-sm font-medium border-2 rounded-xl transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>
      <select
        value={type}
        onChange={onTypeChange}
        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
      >
        <option value="amount">₹</option>
        <option value="percentage">%</option>
      </select>
    </div>
  </div>
)

const RealEstateCalculator = ({ currentCalculatorId, calculatorData, onCalculatorSelect }) => {
  const { formatCurrency } = useCurrency()
  const { isMobile } = useViewMode()
  const { responsive } = useMobileResponsive()
  
  const [inputs, setInputs] = useState({
    propertyPrice: '',
    downPayment: '',
    loanAmount: '',
    interestRate: '',
    loanTenure: '',
    registrationFees: '',
    registrationFeesType: 'amount', // 'amount' or 'percentage'
    stampDuty: '',
    stampDutyType: 'amount',
    legalFees: '',
    legalFeesType: 'amount',
    brokerageFees: '',
    brokerageFeesType: 'amount',
    maintenanceCost: '',
    propertyTax: '',
    insurance: ''
  })

  const [results, setResults] = useState({
    monthlyEMI: 0,
    totalInterest: 0,
    totalAmount: 0,
    totalUpfrontCosts: 0,
    monthlyMaintenance: 0,
    totalCostOfOwnership: 0,
    affordabilityRatio: 0
  })

  const [validationError, setValidationError] = useState('')

  const handleInputChange = useCallback((field, value) => {
    const newInputs = { ...inputs, [field]: value }

    // Auto-adjust based on property price changes
    if (field === 'propertyPrice') {
      const propertyPrice = parseFloat(value) || 0

      if (propertyPrice > 0) {
        // If no down payment is set, default to 20% of property price
        if (!inputs.downPayment || parseFloat(inputs.downPayment) === 0) {
          const defaultDownPayment = Math.round(propertyPrice * 0.2)
          newInputs.downPayment = defaultDownPayment.toString()
          newInputs.loanAmount = Math.max(0, propertyPrice - defaultDownPayment).toString()
        } else {
          // Maintain existing down payment, adjust loan amount
          const downPayment = parseFloat(inputs.downPayment) || 0
          newInputs.loanAmount = Math.max(0, propertyPrice - downPayment).toString()
        }
      } else {
        // Clear dependent fields when property price is cleared
        newInputs.downPayment = ''
        newInputs.loanAmount = ''
      }
    }

    // Auto-calculate loan amount when down payment changes
    if (field === 'downPayment') {
      const propertyPrice = parseFloat(inputs.propertyPrice) || 0
      const downPayment = parseFloat(value) || 0

      if (propertyPrice > 0) {
        newInputs.loanAmount = Math.max(0, propertyPrice - downPayment).toString()
      }
    }

    // Auto-calculate down payment when loan amount changes
    if (field === 'loanAmount') {
      const propertyPrice = parseFloat(inputs.propertyPrice) || 0
      const loanAmount = parseFloat(value) || 0

      if (propertyPrice > 0) {
        newInputs.downPayment = Math.max(0, propertyPrice - loanAmount).toString()
      }
    }

    setInputs(newInputs)

    // Clear validation error when user makes changes
    if (validationError) {
      setValidationError('')
    }
  }, [inputs, validationError])



  // Memoized handlers for all input fields to prevent re-renders and maintain focus
  const handlePropertyPriceChange = useCallback((value) => handleInputChange('propertyPrice', value), [handleInputChange])
  const handleDownPaymentChange = useCallback((value) => handleInputChange('downPayment', value), [handleInputChange])
  const handleLoanAmountChange = useCallback((value) => handleInputChange('loanAmount', value), [handleInputChange])
  const handleInterestRateChange = useCallback((value) => handleInputChange('interestRate', value), [handleInputChange])
  const handleLoanTenureChange = useCallback((value) => handleInputChange('loanTenure', value), [handleInputChange])
  const handleMaintenanceCostChange = useCallback((value) => handleInputChange('maintenanceCost', value), [handleInputChange])

  // Memoized handlers for fee inputs
  const handleRegistrationFeesChange = useCallback((value) => handleInputChange('registrationFees', value), [handleInputChange])
  const handleRegistrationFeesTypeChange = useCallback((e) => handleInputChange('registrationFeesType', e.target.value), [handleInputChange])
  const handleStampDutyChange = useCallback((value) => handleInputChange('stampDuty', value), [handleInputChange])
  const handleStampDutyTypeChange = useCallback((e) => handleInputChange('stampDutyType', e.target.value), [handleInputChange])
  const handleLegalFeesChange = useCallback((value) => handleInputChange('legalFees', value), [handleInputChange])
  const handleLegalFeesTypeChange = useCallback((e) => handleInputChange('legalFeesType', e.target.value), [handleInputChange])
  const handleBrokerageFeesChange = useCallback((value) => handleInputChange('brokerageFees', value), [handleInputChange])
  const handleBrokerageFeesTypeChange = useCallback((e) => handleInputChange('brokerageFeesType', e.target.value), [handleInputChange])

  const calculateFeeAmount = (feeValue, feeType, propertyPrice) => {
    const fee = parseFloat(feeValue) || 0
    if (feeType === 'percentage') {
      return (propertyPrice * fee) / 100
    }
    return fee
  }

  const calculateResults = () => {
    const propertyPrice = parseFloat(inputs.propertyPrice) || 0
    const downPayment = parseFloat(inputs.downPayment) || 0
    const loanAmount = parseFloat(inputs.loanAmount) || 0
    const interestRate = parseFloat(inputs.interestRate) || 0
    const loanTenure = parseFloat(inputs.loanTenure) || 0

    // Validation: Property Price should equal Down Payment + Loan Amount
    const expectedTotal = downPayment + loanAmount
    if (propertyPrice > 0 && Math.abs(propertyPrice - expectedTotal) > 1) {
      setValidationError(`Property Price (₹${propertyPrice.toLocaleString()}) should equal Down Payment + Loan Amount (₹${expectedTotal.toLocaleString()})`)
      return
    }

    setValidationError('')

    // Calculate fees based on type (amount or percentage)
    const registrationFees = calculateFeeAmount(inputs.registrationFees, inputs.registrationFeesType, propertyPrice)
    const stampDuty = calculateFeeAmount(inputs.stampDuty, inputs.stampDutyType, propertyPrice)
    const legalFees = calculateFeeAmount(inputs.legalFees, inputs.legalFeesType, propertyPrice)
    const brokerageFees = calculateFeeAmount(inputs.brokerageFees, inputs.brokerageFeesType, propertyPrice)
    const maintenanceCost = parseFloat(inputs.maintenanceCost) || 0
    const propertyTax = parseFloat(inputs.propertyTax) || 0
    const insurance = parseFloat(inputs.insurance) || 0

    if (loanAmount > 0 && interestRate > 0 && loanTenure > 0) {
      const monthlyRate = interestRate / (12 * 100)
      const totalMonths = loanTenure * 12
      
      // EMI calculation
      const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
                  (Math.pow(1 + monthlyRate, totalMonths) - 1)
      
      const totalAmount = emi * totalMonths
      const totalInterest = totalAmount - loanAmount
      
      // Upfront costs
      const totalUpfrontCosts = downPayment + registrationFees + stampDuty + legalFees + brokerageFees
      
      // Monthly maintenance
      const monthlyMaintenance = maintenanceCost + propertyTax + insurance
      
      // Total cost of ownership (10 years)
      const totalCostOfOwnership = totalUpfrontCosts + (emi * 120) + (monthlyMaintenance * 120)
      
      // Affordability ratio (EMI should be max 40% of income)
      const affordabilityRatio = (emi / 50000) * 100 // Assuming 50k income for ratio

      setResults({
        monthlyEMI: emi,
        totalInterest,
        totalAmount,
        totalUpfrontCosts,
        monthlyMaintenance,
        totalCostOfOwnership,
        affordabilityRatio
      })
    }
  }

  useEffect(() => {
    calculateResults()
  }, [inputs])

  const resetCalculator = () => {
    setInputs({
      propertyPrice: '',
      downPayment: '',
      loanAmount: '',
      interestRate: '',
      loanTenure: '',
      registrationFees: '',
      registrationFeesType: 'amount',
      stampDuty: '',
      stampDutyType: 'amount',
      legalFees: '',
      legalFeesType: 'amount',
      brokerageFees: '',
      brokerageFeesType: 'amount',
      maintenanceCost: '',
      propertyTax: '',
      insurance: ''
    })
    setResults({
      monthlyEMI: 0,
      totalInterest: 0,
      totalAmount: 0,
      totalUpfrontCosts: 0,
      monthlyMaintenance: 0,
      totalCostOfOwnership: 0,
      affordabilityRatio: 0
    })
    setValidationError('')
  }

  return (
    <>
      <Container size="lg">
      {/* Validation Error */}
      {validationError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
        >
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">!</span>
            </div>
            <p className="text-red-700 font-medium">{validationError}</p>
          </div>
        </motion.div>
      )}

      <Grid columns={{ base: 1, lg: 2 }} gap="lg">
        {/* Input Section */}
        <Section title="Property Details" icon={Home} onReset={resetCalculator}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Price
              </label>
              <NumberInput
                value={inputs.propertyPrice}
                onChange={handlePropertyPriceChange}
                placeholder="Enter amount"
                prefix={formatCurrency(0).replace(/[\d.,]/g, '')}
                step="1"
                allowDecimals={true}
                allowNegative={false}
                className="w-full py-2 text-sm font-medium border-2 rounded-xl transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Down Payment
              </label>
              <NumberInput
                value={inputs.downPayment}
                onChange={handleDownPaymentChange}
                placeholder="Enter amount"
                prefix={formatCurrency(0).replace(/[\d.,]/g, '')}
                step="1"
                allowDecimals={true}
                allowNegative={false}
                className="w-full py-2 text-sm font-medium border-2 rounded-xl transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loan Amount
              </label>
              <NumberInput
                value={inputs.loanAmount}
                onChange={handleLoanAmountChange}
                placeholder="4000000"
                prefix={formatCurrency(0).replace(/[\d.,]/g, '')}
                step="1"
                allowDecimals={true}
                allowNegative={false}
                className="w-full py-2 text-sm font-medium border-2 rounded-xl transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Interest Rate (%)
              </label>
              <NumberInput
                value={inputs.interestRate}
                onChange={handleInterestRateChange}
                placeholder="Enter rate"
                suffix="%"
                step="0.5"
                allowDecimals={true}
                allowNegative={false}
                className="w-full py-2 text-sm font-medium border-2 rounded-xl transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loan Tenure (Years)
              </label>
              <NumberInput
                value={inputs.loanTenure}
                onChange={handleLoanTenureChange}
                placeholder="Enter years"
                suffix="years"
                step="1"
                allowDecimals={false}
                allowNegative={false}
                className="w-full py-2 text-sm font-medium border-2 rounded-xl transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </Section>

        {/* Additional Costs */}
        <Section title="Additional Costs" icon={DollarSign}>
          <div className="space-y-4">
            <FlexibleFeeInput
              label="Registration Fees"
              value={inputs.registrationFees}
              onValueChange={handleRegistrationFeesChange}
              type={inputs.registrationFeesType}
              onTypeChange={handleRegistrationFeesTypeChange}
              placeholder="Enter registration fees"
            />
            <FlexibleFeeInput
              label="Stamp Duty"
              value={inputs.stampDuty}
              onValueChange={handleStampDutyChange}
              type={inputs.stampDutyType}
              onTypeChange={handleStampDutyTypeChange}
              placeholder="Enter stamp duty"
            />
            <FlexibleFeeInput
              label="Legal Fees"
              value={inputs.legalFees}
              onValueChange={handleLegalFeesChange}
              type={inputs.legalFeesType}
              onTypeChange={handleLegalFeesTypeChange}
              placeholder="Enter legal fees"
            />
            <FlexibleFeeInput
              label="Brokerage Fees"
              value={inputs.brokerageFees}
              onValueChange={handleBrokerageFeesChange}
              type={inputs.brokerageFeesType}
              onTypeChange={handleBrokerageFeesTypeChange}
              placeholder="Enter brokerage fees"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monthly Maintenance
              </label>
              <NumberInput
                value={inputs.maintenanceCost}
                onChange={handleMaintenanceCostChange}
                placeholder="Enter amount"
                prefix={formatCurrency(0).replace(/[\d.,]/g, '')}
                step="1"
                allowDecimals={true}
                allowNegative={false}
                className="w-full py-2 text-sm font-medium border-2 rounded-xl transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </Section>

        {/* Results Section */}
        <SummaryCard
          title="Loan Calculation"
          icon={Calculator}
          items={[
            { label: "Monthly EMI", value: results.monthlyEMI, type: "currency" },
            { label: "Total Interest", value: results.totalInterest, type: "currency" },
            { label: "Total Amount Payable", value: results.totalAmount, type: "currency" }
          ]}
          color="blue"
        />

        {/* Cost Analysis */}
        <div className="space-y-4">
          <SummaryCard
            title="Cost Analysis"
            icon={TrendingUp}
            items={[
              { label: "Total Upfront Costs", value: results.totalUpfrontCosts, type: "currency" },
              { label: "Monthly Maintenance", value: results.monthlyMaintenance, type: "currency" },
              { label: "10-Year Total Cost", value: results.totalCostOfOwnership, type: "currency" }
            ]}
            color="orange"
          />

          {/* Detailed Cost Breakdown */}
          <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
            <h4 className="font-semibold text-orange-800 mb-3">💰 Cost Breakdown</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-orange-700">Down Payment:</span>
                <span className="font-medium">{formatCurrency(parseFloat(inputs.downPayment) || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-orange-700">Registration Fees:</span>
                <span className="font-medium">{formatCurrency(parseFloat(inputs.registrationFees) || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-orange-700">Stamp Duty:</span>
                <span className="font-medium">{formatCurrency(parseFloat(inputs.stampDuty) || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-orange-700">Legal Fees:</span>
                <span className="font-medium">{formatCurrency(parseFloat(inputs.legalFees) || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-orange-700">Brokerage Fees:</span>
                <span className="font-medium">{formatCurrency(parseFloat(inputs.brokerageFees) || 0)}</span>
              </div>
              <hr className="border-orange-300" />
              <div className="flex justify-between font-semibold">
                <span className="text-orange-800">Total Upfront:</span>
                <span className="text-orange-900">{formatCurrency(results.totalUpfrontCosts || 0)}</span>
              </div>
            </div>
          </div>


        </div>
      </Grid>

      {/* Tips Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-8 p-6 bg-blue-50 rounded-xl"
      >
        <h3 className="text-lg font-semibold text-blue-800 mb-4">🏠 Real Estate Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
          <div>
            <h4 className="font-semibold mb-2">Before Buying:</h4>
            <ul className="space-y-1">
              <li>• Check property documents thoroughly</li>
              <li>• Verify builder's reputation and track record</li>
              <li>• Inspect the property for structural issues</li>
              <li>• Research the neighborhood and amenities</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Financial Planning:</h4>
            <ul className="space-y-1">
              <li>• Keep EMI under 40% of monthly income</li>
              <li>• Factor in maintenance and property taxes</li>
              <li>• Consider future resale value</li>
              <li>• Have emergency fund for repairs</li>
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

export default RealEstateCalculator
