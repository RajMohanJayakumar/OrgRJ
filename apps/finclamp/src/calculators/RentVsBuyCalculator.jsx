import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Home, Building2, DollarSign, BarChart3 } from 'lucide-react'
import { useCurrency } from '../contexts/CurrencyContext'
import { useViewMode } from '../contexts/ViewModeContext'
import useMobileResponsive from '../hooks/useMobileResponsive'
import { NumberInput } from '../components/common/inputs'
import CommonPDFExport from '../components/CommonPDFExport'
import UniversalRelatedCalculators from '../components/UniversalRelatedCalculators'
import ResetButton from '../components/ResetButton'
import MobileLayout, { MobileGrid } from '../components/MobileLayout'
import {
  SummaryCard,
  Section,
  Container,
  Grid
} from '../components/common'

const RentVsBuyCalculator = ({ currentCalculatorId, calculatorData, onCalculatorSelect }) => {
  const { formatCurrency } = useCurrency()
  const { isMobile } = useViewMode()
  const { responsive } = useMobileResponsive()
  
  const [inputs, setInputs] = useState({
    // Buying inputs
    propertyPrice: '',
    downPayment: '',
    loanInterestRate: '',
    loanTenure: '',
    propertyTax: '',
    maintenance: '',
    insurance: '',
    
    // Renting inputs
    monthlyRent: '',
    rentIncrease: '5',
    securityDeposit: '',
    brokerageFees: '',
    
    // Common inputs
    timeHorizon: '10',
    propertyAppreciation: '5',
    investmentReturn: '8'
  })

  const [results, setResults] = useState({
    // Buying costs
    monthlyEMI: 0,
    totalBuyingCost: 0,
    propertyValue: 0,
    netBuyingCost: 0,
    
    // Renting costs
    totalRentCost: 0,
    investmentValue: 0,
    netRentingCost: 0,
    
    // Comparison
    savings: 0,
    recommendation: '',
    breakEvenYear: 0
  })

  const handleInputChange = (field, value) => {
    const newInputs = { ...inputs, [field]: value }

    // Auto-adjust based on property price changes
    if (field === 'propertyPrice') {
      const propertyPrice = parseFloat(value) || 0

      if (propertyPrice > 0) {
        // If no down payment is set, default to 20% of property price
        if (!inputs.downPayment || parseFloat(inputs.downPayment) === 0) {
          const defaultDownPayment = Math.round(propertyPrice * 0.2)
          newInputs.downPayment = defaultDownPayment.toString()
        }
      } else {
        // Clear down payment when property price is cleared
        newInputs.downPayment = ''
      }
    }

    setInputs(newInputs)
  }

  const calculateResults = () => {
    const propertyPrice = parseFloat(inputs.propertyPrice) || 0
    const downPayment = parseFloat(inputs.downPayment) || 0
    const loanAmount = propertyPrice - downPayment
    const loanRate = parseFloat(inputs.loanInterestRate) || 0
    const loanTenure = parseFloat(inputs.loanTenure) || 0
    const propertyTax = parseFloat(inputs.propertyTax) || 0
    const maintenance = parseFloat(inputs.maintenance) || 0
    const insurance = parseFloat(inputs.insurance) || 0
    
    const monthlyRent = parseFloat(inputs.monthlyRent) || 0
    const rentIncrease = parseFloat(inputs.rentIncrease) || 5
    const securityDeposit = parseFloat(inputs.securityDeposit) || 0
    const brokerageFees = parseFloat(inputs.brokerageFees) || 0
    
    const timeHorizon = parseFloat(inputs.timeHorizon) || 10
    const propertyAppreciation = parseFloat(inputs.propertyAppreciation) || 5
    const investmentReturn = parseFloat(inputs.investmentReturn) || 8

    if (propertyPrice > 0 && monthlyRent > 0) {
      // Calculate EMI
      let monthlyEMI = 0
      if (loanAmount > 0 && loanRate > 0 && loanTenure > 0) {
        const monthlyRate = loanRate / (12 * 100)
        const totalMonths = loanTenure * 12
        monthlyEMI = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
                    (Math.pow(1 + monthlyRate, totalMonths) - 1)
      }
      
      // Calculate buying costs over time horizon
      const monthlyBuyingCosts = monthlyEMI + propertyTax + maintenance + insurance
      const totalBuyingCost = downPayment + (monthlyBuyingCosts * timeHorizon * 12)
      
      // Calculate property value after appreciation
      const propertyValue = propertyPrice * Math.pow(1 + propertyAppreciation / 100, timeHorizon)
      const netBuyingCost = totalBuyingCost - propertyValue
      
      // Calculate renting costs
      let totalRentCost = securityDeposit + brokerageFees
      let currentRent = monthlyRent
      
      for (let year = 1; year <= timeHorizon; year++) {
        totalRentCost += currentRent * 12
        currentRent = currentRent * (1 + rentIncrease / 100)
      }
      
      // Calculate investment value (investing the down payment + monthly savings)
      const monthlySavings = monthlyBuyingCosts - monthlyRent
      const monthlyInvestmentReturn = investmentReturn / (12 * 100)
      
      // Future value of down payment invested
      const downPaymentInvestment = downPayment * Math.pow(1 + investmentReturn / 100, timeHorizon)
      
      // Future value of monthly savings invested
      let monthlySavingsInvestment = 0
      if (monthlySavings > 0) {
        const months = timeHorizon * 12
        monthlySavingsInvestment = monthlySavings * 
          ((Math.pow(1 + monthlyInvestmentReturn, months) - 1) / monthlyInvestmentReturn)
      }
      
      const investmentValue = downPaymentInvestment + monthlySavingsInvestment
      const netRentingCost = totalRentCost - investmentValue
      
      // Comparison
      const savings = netBuyingCost - netRentingCost
      const recommendation = savings > 0 ? 'Renting is better' : 'Buying is better'
      
      // Calculate break-even year (simplified)
      let breakEvenYear = 0
      for (let year = 1; year <= 20; year++) {
        const yearlyBuyingCost = downPayment + (monthlyBuyingCosts * year * 12)
        const yearlyPropertyValue = propertyPrice * Math.pow(1 + propertyAppreciation / 100, year)
        const yearlyNetBuying = yearlyBuyingCost - yearlyPropertyValue
        
        let yearlyRentCost = securityDeposit + brokerageFees
        let rent = monthlyRent
        for (let y = 1; y <= year; y++) {
          yearlyRentCost += rent * 12
          rent = rent * (1 + rentIncrease / 100)
        }
        
        if (yearlyNetBuying <= yearlyRentCost && breakEvenYear === 0) {
          breakEvenYear = year
        }
      }

      setResults({
        monthlyEMI,
        totalBuyingCost,
        propertyValue,
        netBuyingCost,
        totalRentCost,
        investmentValue,
        netRentingCost,
        savings: Math.abs(savings),
        recommendation,
        breakEvenYear
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
      loanInterestRate: '',
      loanTenure: '',
      propertyTax: '',
      maintenance: '',
      insurance: '',
      monthlyRent: '',
      rentIncrease: '5',
      securityDeposit: '',
      brokerageFees: '',
      timeHorizon: '10',
      propertyAppreciation: '5',
      investmentReturn: '8'
    })
    setResults({
      buyingCosts: {
        totalCost: 0,
        netCost: 0,
        monthlyEMI: 0
      },
      rentingCosts: {
        totalRent: 0,
        investmentReturns: 0,
        netCost: 0
      },
      recommendation: '',
      savings: 0,
      breakEvenYears: 0
    })
  }

  return (
    <>
      <Container size="lg">
      <Grid columns={{ base: 1, lg: 2 }} gap="lg">
        {/* Buying Scenario */}
        <Section title="Buying Scenario" icon={Home}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Price
              </label>
              <NumberInput
                value={inputs.propertyPrice}
                onChange={(value) => handleInputChange('propertyPrice', value)}
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
                onChange={(value) => handleInputChange('downPayment', value)}
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
                Loan Interest Rate (%)
              </label>
              <NumberInput
                value={inputs.loanInterestRate}
                onChange={(value) => handleInputChange('loanInterestRate', value)}
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
                onChange={(value) => handleInputChange('loanTenure', value)}
                placeholder="Enter years"
                suffix="years"
                step="1"
                allowDecimals={false}
                allowNegative={false}
                className="w-full py-2 text-sm font-medium border-2 rounded-xl transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monthly Property Tax
              </label>
              <NumberInput
                value={inputs.propertyTax}
                onChange={(value) => handleInputChange('propertyTax', value)}
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
                Monthly Maintenance
              </label>
              <NumberInput
                value={inputs.maintenance}
                onChange={(value) => handleInputChange('maintenance', value)}
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

        {/* Renting Scenario */}
        <Section title="Renting Scenario" icon={Building2}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monthly Rent
              </label>
              <NumberInput
                value={inputs.monthlyRent}
                onChange={(value) => handleInputChange('monthlyRent', value)}
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
                Annual Rent Increase (%)
              </label>
              <input
                type="range"
                min="0"
                max="15"
                step="0.5"
                value={inputs.rentIncrease}
                onChange={(e) => handleInputChange('rentIncrease', e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0%</span>
                <span>Current: {inputs.rentIncrease}%</span>
                <span>15%</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Security Deposit
              </label>
              <NumberInput
                value={inputs.securityDeposit}
                onChange={(value) => handleInputChange('securityDeposit', value)}
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
                Brokerage Fees
              </label>
              <NumberInput
                value={inputs.brokerageFees}
                onChange={(value) => handleInputChange('brokerageFees', value)}
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

        {/* Buying Results */}
        <SummaryCard
          title="Buying Analysis"
          icon={DollarSign}
          items={[
            { label: "Monthly EMI", value: results.monthlyEMI, type: "currency" },
            { label: "Total Cost", value: results.totalBuyingCost, type: "currency" },
            { label: "Property Value", value: results.propertyValue, type: "currency" },
            { label: "Net Cost", value: results.netBuyingCost, type: "currency" }
          ]}
          color="blue"
        />

        {/* Renting Results */}
        <div className="space-y-4">
          <SummaryCard
            title="Renting Analysis"
            icon={BarChart3}
            items={[
              { label: "Total Rent Cost", value: results.totalRentCost, type: "currency" },
              { label: "Investment Value", value: results.investmentValue, type: "currency" },
              { label: "Net Cost", value: results.netRentingCost, type: "currency" }
            ]}
            color="green"
          />

          <div className={'p-4 rounded-lg ' + (
            results.recommendation === 'Renting is better' ? 'bg-green-50' : 'bg-blue-50'
          )}>
            <div className="text-center">
              <div className={'text-lg font-bold ' + (
                results.recommendation === 'Renting is better' ? 'text-green-800' : 'text-blue-800'
              )}>
                {results.recommendation}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Savings: {formatCurrency(results.savings || 0)}
              </div>
              {results.breakEvenYear > 0 && (
                <div className="text-xs text-gray-500 mt-1">
                  Break-even: {results.breakEvenYear} years
                </div>
              )}
            </div>
          </div>

          {/* Reset Button */}
          <ResetButton onReset={resetCalculator} />
        </div>
      </Grid>

      {/* Decision Factors */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-8 p-6 bg-purple-50 rounded-xl"
      >
        <h3 className="text-lg font-semibold text-purple-800 mb-4">🤔 Decision Factors</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-purple-700">
          <div>
            <h4 className="font-semibold mb-2">Consider Buying If:</h4>
            <ul className="space-y-1">
              <li>• You plan to stay 5+ years</li>
              <li>• You have stable income</li>
              <li>• Property prices are reasonable</li>
              <li>• You want to build equity</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Consider Renting If:</h4>
            <ul className="space-y-1">
              <li>• You need flexibility to move</li>
              <li>• Property prices are very high</li>
              <li>• You can invest savings elsewhere</li>
              <li>• You don't want maintenance hassles</li>
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

export default RentVsBuyCalculator
