import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Fuel, Car, Calculator, TrendingUp } from 'lucide-react'
import { useViewMode } from '../contexts/ViewModeContext'
import useMobileResponsive from '../hooks/useMobileResponsive'
import { useCurrency } from '../contexts/CurrencyContext'
import CompactCurrencyDisplay from '../components/CompactCurrencyDisplay'
import CommonPDFExport from '../components/CommonPDFExport'
import { NumberInput } from '../components/common/inputs'
import ModernInputSection from '../components/ModernInputSection'
import MobileLayout from '../components/MobileLayout'
import UniversalRelatedCalculators from '../components/UniversalRelatedCalculators'

const FuelCostCalculator = ({ categoryColor = 'orange', currentCalculatorId, calculatorData, onCalculatorSelect }) => {
  const { isMobile } = useViewMode()
  const { formatCurrency } = useCurrency()

  const { responsive } = useMobileResponsive()
  
  const [inputs, setInputs] = useState({
    fuelPrice: '',
    mileage: '',
    dailyDistance: '',
    monthlyDistance: '',
    calculationType: 'daily', // 'daily' or 'monthly'
    workingDaysPerWeek: '5' // Default to 5 working days
  })

  const [results, setResults] = useState({
    dailyCost: 0,
    weeklyCost: 0,
    monthlyCost: 0,
    yearlyCost: 0,
    costPerKm: 0,
    fuelPerDay: 0,
    fuelPerMonth: 0,
    fuelPerYear: 0,
    workingDaysPerMonth: 0
  })

  useEffect(() => {
    calculateFuelCost()
  }, [inputs])

  const calculateFuelCost = () => {
    const fuelPrice = parseFloat(inputs.fuelPrice) || 0
    const mileage = parseFloat(inputs.mileage) || 0
    const dailyDistance = parseFloat(inputs.dailyDistance) || 0
    const monthlyDistance = parseFloat(inputs.monthlyDistance) || 0

    if (fuelPrice <= 0 || mileage <= 0) {
      setResults({
        dailyCost: 0,
        weeklyCost: 0,
        monthlyCost: 0,
        yearlyCost: 0,
        costPerKm: 0,
        fuelPerDay: 0,
        fuelPerMonth: 0,
        fuelPerYear: 0,
        workingDaysPerMonth: 0
      })
      return
    }

    // Calculate cost per kilometer
    const costPerKm = fuelPrice / mileage

    // Calculate working days
    const workingDaysPerWeek = parseInt(inputs.workingDaysPerWeek) || 5
    const workingDaysPerMonth = Math.round((workingDaysPerWeek * 30) / 7) // Approximate working days per month

    let dailyCost, monthlyCost

    if (inputs.calculationType === 'daily' && dailyDistance > 0) {
      // Calculate based on daily distance
      dailyCost = dailyDistance * costPerKm
      monthlyCost = dailyCost * workingDaysPerMonth
    } else if (inputs.calculationType === 'monthly' && monthlyDistance > 0) {
      // Calculate based on monthly distance
      monthlyCost = monthlyDistance * costPerKm
      dailyCost = monthlyCost / workingDaysPerMonth
    } else {
      dailyCost = 0
      monthlyCost = 0
    }

    const weeklyCost = dailyCost * workingDaysPerWeek
    const yearlyCost = monthlyCost * 12

    // Calculate fuel consumption
    const fuelPerDay = dailyDistance / mileage
    const fuelPerMonth = monthlyCost / fuelPrice
    const fuelPerYear = yearlyCost / fuelPrice

    setResults({
      dailyCost,
      weeklyCost,
      monthlyCost,
      yearlyCost,
      costPerKm,
      fuelPerDay,
      fuelPerMonth,
      fuelPerYear,
      workingDaysPerMonth
    })
  }

  const handleInputChange = (field, value) => {
    setInputs(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const resetCalculator = () => {
    setInputs({
      fuelPrice: '',
      mileage: '',
      dailyDistance: '',
      monthlyDistance: '',
      calculationType: 'daily',
      workingDaysPerWeek: '5'
    })
    setResults({
      dailyCost: 0,
      weeklyCost: 0,
      monthlyCost: 0,
      yearlyCost: 0,
      costPerKm: 0,
      fuelPerDay: 0,
      fuelPerMonth: 0,
      fuelPerYear: 0,
      workingDaysPerMonth: 0
    })
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  }

  // Layout configuration based on view mode
  const layoutSpacing = isMobile ? 'space-y-4' : 'space-y-8'
  const gridClass = isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8'
  const containerPadding = isMobile ? 'p-4' : 'p-6'

  return (
    <MobileLayout>
      {/* Header */}
      <motion.div className="text-center" {...fadeInUp}>
        <h2 className={(isMobile ? 'text-2xl' : 'text-3xl') + ' font-bold text-gray-900 mb-2 flex items-center justify-center gap-3'}>
          <Fuel className={(isMobile ? responsive.iconSize("md") : responsive.iconSize("lg")) + ' text-orange-600'} />
          Fuel Cost Calculator
        </h2>
        <p className="text-gray-600">Calculate daily, monthly, and yearly fuel costs based on fuel price and mileage</p>
      </motion.div>

      <div className={'grid ' + (gridClass)}>
        {/* Input Section */}
        <ModernInputSection
          title="Vehicle Details"
          icon={Car}
          onReset={resetCalculator}
          categoryColor="orange"
        >
          <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fuel Price per Liter
                    </label>
                    <NumberInput
                      value={inputs.fuelPrice}
                      onChange={(field, value) => handleInputChange('fuelPrice', value)}
                      placeholder="Enter amount"
                      prefix={formatCurrency(0).replace(/[\d.,]/g, '')}
                      step="1"
                      allowDecimals={true}
                      allowNegative={false}
                      className="w-full py-2 text-sm font-medium border-2 rounded-xl transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

          <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vehicle Mileage (km/liter)
                    </label>
                    <NumberInput
                      value={inputs.mileage}
                      onChange={(field, value) => handleInputChange('mileage', value)}
                      placeholder="Enter value"
                      step="1"
                      allowDecimals={false}
                      allowNegative={false}
                      className="w-full py-2 text-sm font-medium border-2 rounded-xl transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

          {/* Calculation Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Calculation Method
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleInputChange('calculationType', 'daily')}
                className={'px-4 py-3 rounded-lg font-medium transition-colors ' + (
                  inputs.calculationType === 'daily'
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                )}
              >
                Daily Distance
              </button>
              <button
                onClick={() => handleInputChange('calculationType', 'monthly')}
                className={'px-4 py-3 rounded-lg font-medium transition-colors ' + (
                  inputs.calculationType === 'monthly'
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                )}
              >
                Monthly Distance
              </button>
            </div>
          </div>

          {/* Working Days Per Week */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Working Days Per Week
            </label>
            <NumberInput
              value={inputs.workingDaysPerWeek}
              onChange={(field, value) => handleInputChange('workingDaysPerWeek', value)}
              placeholder="5"
              min="1"
              max="7"
              step="1"
              allowDecimals={false}
              allowNegative={false}
              className="w-full py-2 text-sm font-medium border-2 rounded-xl transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Distance Input */}
          {inputs.calculationType === 'daily' ? (
            <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Daily Distance (km)
                    </label>
                    <NumberInput
                      value={inputs.dailyDistance}
                      onChange={(field, value) => handleInputChange('dailyDistance', value)}
                      placeholder="Enter value"
                      step="1"
                      allowDecimals={false}
                      allowNegative={false}
                      className="w-full py-2 text-sm font-medium border-2 rounded-xl transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
          ) : (
            <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Monthly Distance (km)
                    </label>
                    <NumberInput
                      value={inputs.monthlyDistance}
                      onChange={(field, value) => handleInputChange('monthlyDistance', value)}
                      placeholder="Enter value"
                      step="1"
                      allowDecimals={false}
                      allowNegative={false}
                      className="w-full py-2 text-sm font-medium border-2 rounded-xl transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
          )}
        </ModernInputSection>

        {/* Results Section */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-100 rounded-lg">
              <Calculator className={(responsive.iconSize("md")) + ' text-green-600'} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Cost Breakdown</h2>
          </div>

          <div className="space-y-4">
            {/* Cost per KM */}
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="font-medium text-blue-700">Cost per KM:</span>
              <span className="font-bold text-blue-600">
                <CompactCurrencyDisplay value={results.costPerKm} />
              </span>
            </div>

            {/* Daily Cost */}
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="font-medium text-green-700">Daily Cost:</span>
              <span className="font-bold text-green-600">
                <CompactCurrencyDisplay value={results.dailyCost} />
              </span>
            </div>

            {/* Weekly Cost */}
            <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
              <span className="font-medium text-yellow-700">
                Weekly Cost ({inputs.workingDaysPerWeek} working days):
              </span>
              <span className="font-bold text-yellow-600">
                <CompactCurrencyDisplay value={results.weeklyCost} />
              </span>
            </div>

            {/* Monthly Cost */}
            <div className="flex justify-between items-center p-4 bg-orange-50 rounded-lg border-2 border-orange-200">
              <div>
                <span className="text-lg font-bold text-orange-700">Monthly Cost:</span>
                <div className="text-xs text-orange-600 mt-1">
                  Based on {Math.round(results.workingDaysPerMonth)} working days/month
                </div>
              </div>
              <span className="text-xl font-bold text-orange-600">
                <CompactCurrencyDisplay value={results.monthlyCost} />
              </span>
            </div>

            {/* Yearly Cost */}
            <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg border-2 border-red-200">
              <span className="text-lg font-bold text-red-700">Yearly Cost:</span>
              <span className="text-xl font-bold text-red-600">
                <CompactCurrencyDisplay value={results.yearlyCost} />
              </span>
            </div>
          </div>

          {/* Fuel Consumption */}
          <div className="mt-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Fuel Consumption</h3>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <span className="font-medium text-purple-700">Daily Fuel:</span>
                <span className="font-bold text-purple-600">
                  {results.fuelPerDay.toFixed(2)} L
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <span className="font-medium text-purple-700">Monthly Fuel:</span>
                <span className="font-bold text-purple-600">
                  {results.fuelPerMonth.toFixed(2)} L
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <span className="font-medium text-purple-700">Yearly Fuel:</span>
                <span className="font-bold text-purple-600">
                  {results.fuelPerYear.toFixed(2)} L
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Universal Related Calculators */}
      <UniversalRelatedCalculators
        currentCalculatorId={currentCalculatorId}
        calculatorData={calculatorData}
        onCalculatorSelect={onCalculatorSelect}
      />
      

    </MobileLayout>
  )
}

export default FuelCostCalculator
