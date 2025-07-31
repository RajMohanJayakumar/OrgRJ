import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Home, Car, Coffee, Shirt, Calculator, TrendingUp } from 'lucide-react'
import { useCurrency } from '../contexts/CurrencyContext'
import { useViewMode } from '../contexts/ViewModeContext'
import useMobileResponsive from '../hooks/useMobileResponsive'
import { NumberInput } from '../components/common/inputs'
import CompactCurrencyDisplay from '../components/CompactCurrencyDisplay'
import CommonPDFExport from '../components/CommonPDFExport'
import UniversalRelatedCalculators from '../components/UniversalRelatedCalculators'
import MobileLayout, { MobileGrid } from '../components/MobileLayout'

const WFHSavingsCalculator = ({ categoryColor = 'green', currentCalculatorId, calculatorData, onCalculatorSelect }) => {
  const { formatCurrency, currentFormat } = useCurrency()
  const { isMobile } = useViewMode()
  const { responsive } = useMobileResponsive()
  
  const [workDetails, setWorkDetails] = useState({
    wfhDaysPerWeek: '5',
    workingDaysPerMonth: '22',
    commuteDistance: '25',
    fuelPrice: '100',
    vehicleMileage: '15'
  })

  const [expenses, setExpenses] = useState({
    // Commute costs
    parkingDaily: '100',
    tollDaily: '50',
    publicTransport: '150',
    
    // Food costs
    lunchDaily: '200',
    coffeeDaily: '100',
    snacksDaily: '50',
    
    // Clothing costs
    formalClothes: '5000',
    dryCleaningMonthly: '1000',
    shoesMonthly: '2000',
    
    // Additional costs
    internetUpgrade: '500',
    electricityIncrease: '800',
    homeOfficeSetup: '15000'
  })

  const [results, setResults] = useState({
    dailySavings: 0,
    weeklySavings: 0,
    monthlySavings: 0,
    yearlySavings: 0,
    categoryBreakdown: {},
    additionalCosts: 0,
    netSavings: 0,
    breakdownDetails: {}
  })

  useEffect(() => {
    calculateWFHSavings()
  }, [workDetails, expenses])

  const calculateWFHSavings = () => {
    const wfhDays = parseInt(workDetails.wfhDaysPerWeek) || 0
    const workingDays = parseInt(workDetails.workingDaysPerMonth) || 22
    const distance = parseFloat(workDetails.commuteDistance) || 0
    const fuelPrice = parseFloat(workDetails.fuelPrice) || 0
    const mileage = parseFloat(workDetails.vehicleMileage) || 0

    // Calculate commute savings
    const fuelCostPerKm = mileage > 0 ? fuelPrice / mileage : 0
    const dailyFuelCost = distance * 2 * fuelCostPerKm // Round trip
    const dailyParking = parseFloat(expenses.parkingDaily) || 0
    const dailyToll = parseFloat(expenses.tollDaily) || 0
    const dailyPublicTransport = parseFloat(expenses.publicTransport) || 0
    
    const dailyCommuteCost = Math.max(
      dailyFuelCost + dailyParking + dailyToll,
      dailyPublicTransport
    )

    // Calculate food savings
    const dailyLunch = parseFloat(expenses.lunchDaily) || 0
    const dailyCoffee = parseFloat(expenses.coffeeDaily) || 0
    const dailySnacks = parseFloat(expenses.snacksDaily) || 0
    const dailyFoodCost = dailyLunch + dailyCoffee + dailySnacks

    // Calculate clothing savings (monthly)
    const monthlyFormalClothes = parseFloat(expenses.formalClothes) / 12 || 0
    const monthlyDryCleaning = parseFloat(expenses.dryCleaningMonthly) || 0
    const monthlyShoes = parseFloat(expenses.shoesMonthly) || 0
    const monthlyClothingCost = monthlyFormalClothes + monthlyDryCleaning + monthlyShoes
    const dailyClothingCost = monthlyClothingCost / workingDays

    // Total daily savings
    const dailySavings = (dailyCommuteCost + dailyFoodCost + dailyClothingCost) * (wfhDays / 5)

    // Calculate additional WFH costs
    const monthlyInternet = parseFloat(expenses.internetUpgrade) || 0
    const monthlyElectricity = parseFloat(expenses.electricityIncrease) || 0
    const homeOfficeSetup = parseFloat(expenses.homeOfficeSetup) || 0
    const monthlyHomeOfficeDepreciation = homeOfficeSetup / 24 // Amortize over 2 years

    const monthlyAdditionalCosts = monthlyInternet + monthlyElectricity + monthlyHomeOfficeDepreciation
    const dailyAdditionalCosts = monthlyAdditionalCosts / workingDays

    // Net calculations
    const netDailySavings = dailySavings - dailyAdditionalCosts
    const weeklySavings = netDailySavings * 5
    const monthlySavings = netDailySavings * workingDays
    const yearlySavings = monthlySavings * 12

    // Category breakdown
    const categoryBreakdown = {
      commute: {
        label: 'Commute Costs',
        dailySaving: dailyCommuteCost * (wfhDays / 5),
        monthlySaving: dailyCommuteCost * (wfhDays / 5) * workingDays,
        icon: Car
      },
      food: {
        label: 'Food & Beverages',
        dailySaving: dailyFoodCost * (wfhDays / 5),
        monthlySaving: dailyFoodCost * (wfhDays / 5) * workingDays,
        icon: Coffee
      },
      clothing: {
        label: 'Formal Clothing',
        dailySaving: dailyClothingCost * (wfhDays / 5),
        monthlySaving: dailyClothingCost * (wfhDays / 5) * workingDays,
        icon: Shirt
      }
    }

    const breakdownDetails = {
      commute: {
        fuel: dailyFuelCost,
        parking: dailyParking,
        toll: dailyToll,
        publicTransport: dailyPublicTransport
      },
      food: {
        lunch: dailyLunch,
        coffee: dailyCoffee,
        snacks: dailySnacks
      },
      clothing: {
        formal: monthlyFormalClothes,
        dryCleaning: monthlyDryCleaning,
        shoes: monthlyShoes
      },
      additionalCosts: {
        internet: monthlyInternet,
        electricity: monthlyElectricity,
        homeOffice: monthlyHomeOfficeDepreciation
      }
    }

    setResults({
      dailySavings: netDailySavings,
      weeklySavings,
      monthlySavings,
      yearlySavings,
      categoryBreakdown,
      additionalCosts: monthlyAdditionalCosts,
      netSavings: monthlySavings,
      breakdownDetails
    })
  }

  const handleWorkDetailsChange = (field, value) => {
    setWorkDetails(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleExpenseChange = (field, value) => {
    setExpenses(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  }

  return (
    <MobileLayout className={'' + (isMobile ? 'space-y-4' : 'space-y-8') + ' calculator-main-container'}>
      {/* Header */}
      <motion.div className="text-center" {...fadeInUp}>
        <h2 className={(responsive.typography.heading) + ' font-bold text-gray-900 mb-2 flex items-center justify-center gap-3'}>
          <Home className={(responsive.iconSize("lg")) + ' text-green-600'} />
          Work-from-Home Savings Calculator
        </h2>
        <p className="text-gray-600">Calculate savings on commute, food, and clothing when working from home</p>
      </motion.div>

      <MobileGrid columns={2} className={isMobile ? 'mt-4' : 'mt-6'}>
        {/* Input Section */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Work & Expense Details</h2>

          <div className="space-y-6">
            {/* Work Details */}
            <div className="border-b pb-4">
              <h3 className="font-semibold text-gray-800 mb-3">Work Schedule</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    WFH Days/Week
                  </label>
                  <NumberInput
                      value={workDetails.wfhDaysPerWeek}
                      onChange={(value) => handleWorkDetailsChange('wfhDaysPerWeek', value)}
                      placeholder="Enter value"
                      step="1"
                      allowDecimals={true}
                      allowNegative={false}
                      className="w-full py-2 text-sm font-medium border border-gray-300 rounded-lg transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Working Days/Month
                  </label>
                  <NumberInput
                      value={workDetails.workingDaysPerMonth}
                      onChange={(value) => handleWorkDetailsChange('workingDaysPerMonth', value)}
                      placeholder="Enter value"
                      step="1"
                      allowDecimals={true}
                      allowNegative={false}
                      className="w-full py-2 text-sm font-medium border border-gray-300 rounded-lg transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
              </div>
            </div>

            {/* Commute Details */}
            <div className="border-b pb-4">
              <h3 className="font-semibold text-gray-800 mb-3">Commute Details</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    One-way Distance (km)
                  </label>
                  <NumberInput
                      value={workDetails.commuteDistance}
                      onChange={(value) => handleWorkDetailsChange('commuteDistance', value)}
                      placeholder="Enter value"
                      step="1"
                      allowDecimals={true}
                      allowNegative={false}
                      className="w-full py-2 text-sm font-medium border border-gray-300 rounded-lg transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fuel Price/L
                    </label>
                    <div className="relative">
                      <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">
                        {currentFormat.symbol}
                      </span>
                      <NumberInput
                      value={workDetails.fuelPrice}
                      onChange={(value) => handleWorkDetailsChange('fuelPrice', value)}
                      placeholder="Enter value"
                      step="1"
                      allowDecimals={true}
                      allowNegative={false}
                      className="w-full py-2 text-sm font-medium border border-gray-300 rounded-lg transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mileage (km/L)
                    </label>
                    <NumberInput
                      value={workDetails.vehicleMileage}
                      onChange={(value) => handleWorkDetailsChange('vehicleMileage', value)}
                      placeholder="Enter value"
                      step="1"
                      allowDecimals={true}
                      allowNegative={false}
                      className="w-full py-2 text-sm font-medium border border-gray-300 rounded-lg transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Daily Parking
                    </label>
                    <div className="relative">
                      <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">
                        {currentFormat.symbol}
                      </span>
                      <NumberInput
                      value={expenses.parkingDaily}
                      onChange={(value) => handleExpenseChange('parkingDaily', value)}
                      placeholder="Enter value"
                      step="1"
                      allowDecimals={true}
                      allowNegative={false}
                      className="w-full py-2 text-sm font-medium border border-gray-300 rounded-lg transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Daily Toll
                    </label>
                    <div className="relative">
                      <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">
                        {currentFormat.symbol}
                      </span>
                      <NumberInput
                      value={expenses.tollDaily}
                      onChange={(value) => handleExpenseChange('tollDaily', value)}
                      placeholder="Enter value"
                      step="1"
                      allowDecimals={true}
                      allowNegative={false}
                      className="w-full py-2 text-sm font-medium border border-gray-300 rounded-lg transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Food Expenses */}
            <div className="border-b pb-4">
              <h3 className="font-semibold text-gray-800 mb-3">Daily Food Expenses</h3>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lunch
                  </label>
                  <div className="relative">
                    <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">
                      {currentFormat.symbol}
                    </span>
                    <NumberInput
                      value={expenses.lunchDaily}
                      onChange={(value) => handleExpenseChange('lunchDaily', value)}
                      placeholder="Enter value"
                      step="1"
                      allowDecimals={true}
                      allowNegative={false}
                      className="w-full py-2 text-sm font-medium border border-gray-300 rounded-lg transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Coffee
                  </label>
                  <div className="relative">
                    <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">
                      {currentFormat.symbol}
                    </span>
                    <NumberInput
                      value={expenses.coffeeDaily}
                      onChange={(value) => handleExpenseChange('coffeeDaily', value)}
                      placeholder="Enter value"
                      step="1"
                      allowDecimals={true}
                      allowNegative={false}
                      className="w-full py-2 text-sm font-medium border border-gray-300 rounded-lg transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Snacks
                  </label>
                  <div className="relative">
                    <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">
                      {currentFormat.symbol}
                    </span>
                    <NumberInput
                      value={expenses.snacksDaily}
                      onChange={(value) => handleExpenseChange('snacksDaily', value)}
                      placeholder="Enter value"
                      step="1"
                      allowDecimals={true}
                      allowNegative={false}
                      className="w-full py-2 text-sm font-medium border border-gray-300 rounded-lg transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Clothing Expenses */}
            <div className="border-b pb-4">
              <h3 className="font-semibold text-gray-800 mb-3">Clothing Expenses</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Formal Clothes (Yearly)
                  </label>
                  <div className="relative">
                    <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">
                      {currentFormat.symbol}
                    </span>
                    <NumberInput
                      value={expenses.formalClothes}
                      onChange={(value) => handleExpenseChange('formalClothes', value)}
                      placeholder="Enter value"
                      step="1"
                      allowDecimals={true}
                      allowNegative={false}
                      className="w-full py-2 text-sm font-medium border border-gray-300 rounded-lg transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dry Cleaning/Month
                    </label>
                    <div className="relative">
                      <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">
                        {currentFormat.symbol}
                      </span>
                      <NumberInput
                      value={expenses.dryCleaningMonthly}
                      onChange={(value) => handleExpenseChange('dryCleaningMonthly', value)}
                      placeholder="Enter value"
                      step="1"
                      allowDecimals={true}
                      allowNegative={false}
                      className="w-full py-2 text-sm font-medium border border-gray-300 rounded-lg transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Formal Shoes/Month
                    </label>
                    <div className="relative">
                      <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">
                        {currentFormat.symbol}
                      </span>
                      <NumberInput
                      value={expenses.shoesMonthly}
                      onChange={(value) => handleExpenseChange('shoesMonthly', value)}
                      placeholder="Enter value"
                      step="1"
                      allowDecimals={true}
                      allowNegative={false}
                      className="w-full py-2 text-sm font-medium border border-gray-300 rounded-lg transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional WFH Costs */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Additional WFH Costs</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Internet Upgrade/Month
                    </label>
                    <div className="relative">
                      <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">
                        {currentFormat.symbol}
                      </span>
                      <NumberInput
                      value={expenses.internetUpgrade}
                      onChange={(value) => handleExpenseChange('internetUpgrade', value)}
                      placeholder="Enter value"
                      step="1"
                      allowDecimals={true}
                      allowNegative={false}
                      className="w-full py-2 text-sm font-medium border border-gray-300 rounded-lg transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Electricity Increase/Month
                    </label>
                    <div className="relative">
                      <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">
                        {currentFormat.symbol}
                      </span>
                      <NumberInput
                      value={expenses.electricityIncrease}
                      onChange={(value) => handleExpenseChange('electricityIncrease', value)}
                      placeholder="Enter value"
                      step="1"
                      allowDecimals={true}
                      allowNegative={false}
                      className="w-full py-2 text-sm font-medium border border-gray-300 rounded-lg transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Home Office Setup (One-time)
                  </label>
                  <div className="relative">
                    <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">
                      {currentFormat.symbol}
                    </span>
                    <NumberInput
                      value={expenses.homeOfficeSetup}
                      onChange={(value) => handleExpenseChange('homeOfficeSetup', value)}
                      placeholder="Enter value"
                      step="1"
                      allowDecimals={true}
                      allowNegative={false}
                      className="w-full py-2 text-sm font-medium border border-gray-300 rounded-lg transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Results Section */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className={(responsive.iconSize("md")) + ' text-green-600'} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Savings Breakdown</h2>
          </div>

          <div className="space-y-6">
            {/* Net Savings Summary */}
            <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
              <div className="text-center">
                <div className="text-sm text-green-700 mb-1">Net Monthly Savings</div>
                <div className={(responsive.typography.heading) + ' font-bold text-green-600'}>
                  <CompactCurrencyDisplay value={results.monthlySavings} />
                </div>
                <div className="text-sm text-green-500 mt-1">
                  <CompactCurrencyDisplay value={results.yearlySavings} /> per year
                </div>
              </div>
            </div>

            {/* Time Period Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-700">Daily Savings</div>
                <div className="text-lg font-bold text-blue-600">
                  <CompactCurrencyDisplay value={results.dailySavings} />
                </div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-sm text-purple-700">Weekly Savings</div>
                <div className="text-lg font-bold text-purple-600">
                  <CompactCurrencyDisplay value={results.weeklySavings} />
                </div>
              </div>
            </div>

            {/* Category Breakdown */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Savings by Category</h3>
              <div className="space-y-3">
                {Object.entries(results.categoryBreakdown).map(([key, category]) => {
                  const IconComponent = category.icon
                  return (
                    <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <IconComponent className="w-5 h-5 text-gray-600" />
                        <span className="font-medium text-gray-700">{category.label}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900">
                          {formatCurrency(category.monthlySaving)}
                        </div>
                        <div className="text-sm text-gray-500">per month</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Additional Costs */}
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-semibold text-yellow-800 mb-2">Additional WFH Costs</h3>
              <div className="text-sm text-yellow-700">
                <div className="flex justify-between">
                  <span>Monthly additional costs:</span>
                  <span className="font-medium"><CompactCurrencyDisplay value={results.additionalCosts} /></span>
                </div>
                <div className="text-xs mt-1 text-yellow-600">
                  Includes internet, electricity, and home office setup amortization
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">💡 WFH Money Tips</h3>
              <div className="text-sm text-blue-700 space-y-1">
                <div>• Claim home office expenses for tax deductions</div>
                <div>• Invest savings in SIP or other investments</div>
                <div>• Use saved commute time for skill development</div>
                <div>• Consider hybrid model for optimal savings</div>
                <div>• Track actual vs estimated savings monthly</div>
              </div>
            </div>
          </div>
        </motion.div>
      </MobileGrid>

      {/* Universal Related Calculators */}
      <UniversalRelatedCalculators
        currentCalculatorId={currentCalculatorId}
        calculatorData={calculatorData}
        onCalculatorSelect={onCalculatorSelect}
      />


    </MobileLayout>
  )
}

export default WFHSavingsCalculator
