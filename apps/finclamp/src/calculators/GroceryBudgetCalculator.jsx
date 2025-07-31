import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ShoppingCart, Users, Calculator, TrendingUp } from 'lucide-react'
import { useCurrency } from '../contexts/CurrencyContext'
import { useViewMode } from '../contexts/ViewModeContext'
import useMobileResponsive from '../hooks/useMobileResponsive'
import { NumberInput } from '../components/common/inputs'
import CompactCurrencyDisplay from '../components/CompactCurrencyDisplay'
import CommonPDFExport from '../components/CommonPDFExport'
import UniversalRelatedCalculators from '../components/UniversalRelatedCalculators'
import MobileLayout, { MobileGrid } from '../components/MobileLayout'

const GroceryBudgetCalculator = ({ currentCalculatorId, calculatorData, onCalculatorSelect }) => {
  const { formatCurrency } = useCurrency()
  const { isMobile } = useViewMode()
  const { responsive } = useMobileResponsive()
  
  const [familyDetails, setFamilyDetails] = useState({
    adults: '2',
    children: '0',
    infants: '0',
    dietType: 'mixed',
    location: 'metro'
  })

  const [actualCosts, setActualCosts] = useState({
    currentMonthlySpend: '',
    grainsCereals: '',
    vegetablesFruits: '',
    dairyProducts: '',
    proteinSources: '',
    spicesCondiments: '',
    snacksBeverages: '',
    estimationMethod: 'current' // 'current' or 'category'
  })

  const [preferences, setPreferences] = useState({
    organicPercentage: '20',
    eatingOutFrequency: '4',
    bulkBuying: false,
    brandPreference: 'mixed'
  })

  const [results, setResults] = useState({
    weeklyBudget: 0,
    monthlyBudget: 0,
    yearlyBudget: 0,
    perPersonDaily: 0,
    categoryBreakdown: {},
    savingsTips: []
  })

  const dietTypes = {
    vegetarian: { label: 'Vegetarian', multiplier: 0.85 },
    mixed: { label: 'Mixed (Veg + Non-Veg)', multiplier: 1.0 },
    nonvegetarian: { label: 'Non-Vegetarian', multiplier: 1.15 },
    vegan: { label: 'Vegan', multiplier: 0.9 }
  }

  const locations = {
    metro: { label: 'Metro Cities', multiplier: 1.2 },
    tier1: { label: 'Tier 1 Cities', multiplier: 1.0 },
    tier2: { label: 'Tier 2 Cities', multiplier: 0.85 },
    rural: { label: 'Rural Areas', multiplier: 0.7 }
  }

  const brandPreferences = {
    premium: { label: 'Premium Brands', multiplier: 1.3 },
    mixed: { label: 'Mixed Brands', multiplier: 1.0 },
    budget: { label: 'Budget Brands', multiplier: 0.8 }
  }

  // Base daily cost per person in INR (tier 1 city, mixed diet)
  const baseCosts = {
    adult: 150,
    child: 100,
    infant: 50
  }

  const groceryCategories = {
    grains: { label: 'Grains & Cereals', percentage: 25 },
    vegetables: { label: 'Vegetables & Fruits', percentage: 30 },
    dairy: { label: 'Dairy Products', percentage: 15 },
    protein: { label: 'Protein (Meat/Pulses)', percentage: 20 },
    spices: { label: 'Spices & Condiments', percentage: 5 },
    snacks: { label: 'Snacks & Beverages', percentage: 5 }
  }

  useEffect(() => {
    calculateGroceryBudget()
  }, [familyDetails, preferences, actualCosts])

  const calculateGroceryBudget = () => {
    const adults = parseInt(familyDetails.adults) || 0
    const children = parseInt(familyDetails.children) || 0
    const infants = parseInt(familyDetails.infants) || 0
    const totalPeople = adults + children + infants

    let monthlyBudget = 0
    let categoryBreakdown = {}

    if (actualCosts.estimationMethod === 'current' && actualCosts.currentMonthlySpend) {
      // Use current spending as base
      monthlyBudget = parseFloat(actualCosts.currentMonthlySpend) || 0

      // Apply adjustments based on preferences
      // Apply organic percentage (organic costs 30% more)
      const organicMultiplier = 1 + (parseInt(preferences.organicPercentage) / 100 * 0.3)
      monthlyBudget *= organicMultiplier

      // Apply bulk buying discount (5% savings)
      if (preferences.bulkBuying) {
        monthlyBudget *= 0.95
      }

      // Adjust for eating out frequency (reduces grocery needs)
      const eatingOutReduction = parseInt(preferences.eatingOutFrequency) * 0.02
      monthlyBudget *= (1 - eatingOutReduction)

      // Use standard category breakdown percentages
      Object.entries(groceryCategories).forEach(([key, category]) => {
        categoryBreakdown[key] = {
          label: category.label,
          amount: (monthlyBudget * category.percentage) / 100,
          percentage: category.percentage
        }
      })
    } else if (actualCosts.estimationMethod === 'category') {
      // Calculate from individual category costs
      const grains = parseFloat(actualCosts.grainsCereals) || 0
      const vegetables = parseFloat(actualCosts.vegetablesFruits) || 0
      const dairy = parseFloat(actualCosts.dairyProducts) || 0
      const protein = parseFloat(actualCosts.proteinSources) || 0
      const spices = parseFloat(actualCosts.spicesCondiments) || 0
      const snacks = parseFloat(actualCosts.snacksBeverages) || 0

      monthlyBudget = grains + vegetables + dairy + protein + spices + snacks

      // Create category breakdown from actual inputs
      categoryBreakdown = {
        grains: {
          label: 'Grains & Cereals',
          amount: grains,
          percentage: monthlyBudget > 0 ? (grains / monthlyBudget) * 100 : 0
        },
        vegetables: {
          label: 'Vegetables & Fruits',
          amount: vegetables,
          percentage: monthlyBudget > 0 ? (vegetables / monthlyBudget) * 100 : 0
        },
        dairy: {
          label: 'Dairy Products',
          amount: dairy,
          percentage: monthlyBudget > 0 ? (dairy / monthlyBudget) * 100 : 0
        },
        protein: {
          label: 'Protein Sources',
          amount: protein,
          percentage: monthlyBudget > 0 ? (protein / monthlyBudget) * 100 : 0
        },
        spices: {
          label: 'Spices & Condiments',
          amount: spices,
          percentage: monthlyBudget > 0 ? (spices / monthlyBudget) * 100 : 0
        },
        snacks: {
          label: 'Snacks & Beverages',
          amount: snacks,
          percentage: monthlyBudget > 0 ? (snacks / monthlyBudget) * 100 : 0
        }
      }
    } else {
      // No data provided, return empty results
      setResults({
        weeklyBudget: 0,
        monthlyBudget: 0,
        yearlyBudget: 0,
        perPersonDaily: 0,
        categoryBreakdown: {},
        savingsTips: []
      })
      return
    }

    const weeklyBudget = monthlyBudget / 4.33 // Average weeks per month
    const yearlyBudget = monthlyBudget * 12
    const perPersonDaily = totalPeople > 0 ? monthlyBudget / (totalPeople * 30) : 0

    // Generate savings tips
    const savingsTips = generateSavingsTips()

    setResults({
      weeklyBudget,
      monthlyBudget,
      yearlyBudget,
      perPersonDaily,
      categoryBreakdown,
      savingsTips
    })
  }

  const generateSavingsTips = () => {
    const tips = []
    
    if (parseInt(preferences.organicPercentage) > 50) {
      tips.push("Consider reducing organic purchases to 30-40% to save costs")
    }
    
    if (!preferences.bulkBuying) {
      tips.push("Buy non-perishables in bulk to save 5-10%")
    }
    
    if (parseInt(preferences.eatingOutFrequency) < 2) {
      tips.push("Meal planning can help optimize grocery purchases")
    }
    
    if (preferences.brandPreference === 'premium') {
      tips.push("Mix premium and regular brands to balance quality and cost")
    }
    
    tips.push("Shop seasonal vegetables and fruits for better prices")
    tips.push("Compare prices across different stores and online platforms")
    
    return tips
  }

  const handleFamilyChange = (field, value) => {
    setFamilyDetails(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleActualCostsChange = (field, value) => {
    setActualCosts(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handlePreferenceChange = (field, value) => {
    setPreferences(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const getCategoryColor = (category) => {
    const colors = {
      grains: 'bg-amber-400',
      vegetables: 'bg-green-400',
      dairy: 'bg-blue-400',
      protein: 'bg-red-400',
      spices: 'bg-orange-400',
      snacks: 'bg-purple-400'
    }
    return colors[category] || 'bg-gray-400'
  }

  return (
    <MobileLayout className={'' + (isMobile ? 'space-y-4' : 'space-y-8') + ' calculator-main-container'}>
      {/* Header - Enhanced */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="relative inline-block">
          <motion.div
            initial={{ scale: 0.8, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="absolute -top-2 -left-2 w-12 h-12 bg-green-100 rounded-full opacity-50"
          ></motion.div>
          <h2 className={'' + (responsive.typography.heading) + ' font-bold text-gray-900 mb-2 flex items-center justify-center gap-3 relative z-10'}>
            <motion.div
              initial={{ rotate: -180, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3, type: "spring", stiffness: 200 }}
            >
              <ShoppingCart className={'' + (responsive.iconSize("lg")) + ' text-green-600'} />
            </motion.div>
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Grocery Budget Calculator
            </motion.span>
          </h2>
        </div>
        <motion.p
          className="text-gray-600 max-w-md mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          Estimate monthly grocery needs based on family size and preferences
        </motion.p>
      </motion.div>

      <MobileGrid columns={2} className={isMobile ? 'mt-4' : 'mt-6'}>
        {/* Input Section */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className={(responsive.iconSize("md")) + ' text-green-600'} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Family Details</h2>
          </div>

          <div className="space-y-6">
            {/* Family Size - Responsive Grid */}
            <div className={'grid ' + (isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-3 gap-4') + ''}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200 flex flex-col h-full"
              >
                <label className="block text-sm font-semibold text-blue-800 mb-3 flex items-center gap-2 min-h-[20px]">
                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                  <span className="leading-tight">Adults</span>
                </label>
                <div className="flex-1 flex items-end">
                  <NumberInput
                    value={familyDetails.adults}
                    onChange={(value) => handleFamilyChange('adults', value)}
                    placeholder="0"
                    step="1"
                    allowDecimals={false}
                    allowNegative={false}
                    className="w-full"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200 flex flex-col h-full"
              >
                <label className="block text-sm font-semibold text-green-800 mb-3 flex items-center gap-2 min-h-[20px]">
                  <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                  <span className="leading-tight">Children (3-12 yrs)</span>
                </label>
                <div className="flex-1 flex items-end">
                  <NumberInput
                    value={familyDetails.children}
                    onChange={(value) => handleFamilyChange('children', value)}
                    placeholder="0"
                    step="1"
                    allowDecimals={false}
                    allowNegative={false}
                    className="w-full"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200 flex flex-col h-full"
              >
                <label className="block text-sm font-semibold text-purple-800 mb-3 flex items-center gap-2 min-h-[20px]">
                  <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></div>
                  <span className="leading-tight">Infants (0-3 yrs)</span>
                </label>
                <div className="flex-1 flex items-end">
                  <NumberInput
                    value={familyDetails.infants}
                    onChange={(value) => handleFamilyChange('infants', value)}
                    placeholder="0"
                    step="1"
                    allowDecimals={false}
                    allowNegative={false}
                    className="w-full"
                  />
                </div>
              </motion.div>
            </div>

            {/* Actual Costs Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-xl border border-indigo-200"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Calculator className={(responsive.iconSize("md")) + ' text-indigo-600'} />
                </div>
                <h3 className="text-lg font-bold text-indigo-900">Your Actual Grocery Costs</h3>
              </div>

              <p className="text-sm text-indigo-700 mb-4">
                Choose how you'd like to estimate your grocery budget based on your actual spending patterns:
              </p>

              {/* Estimation Method Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-indigo-800 mb-3">Estimation Method</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <label className="flex items-center p-3 bg-white rounded-lg border-2 border-indigo-200 cursor-pointer hover:bg-indigo-50 transition-colors">
                    <input
                      type="radio"
                      name="estimationMethod"
                      value="current"
                      checked={actualCosts.estimationMethod === 'current'}
                      onChange={(e) => handleActualCostsChange('estimationMethod', e.target.value)}
                      className="mr-3 text-indigo-600"
                    />
                    <div>
                      <div className="font-medium text-gray-800">Current Monthly Spending</div>
                      <div className="text-xs text-gray-600">Enter your total monthly grocery bill</div>
                    </div>
                  </label>
                  <label className="flex items-center p-3 bg-white rounded-lg border-2 border-indigo-200 cursor-pointer hover:bg-indigo-50 transition-colors">
                    <input
                      type="radio"
                      name="estimationMethod"
                      value="category"
                      checked={actualCosts.estimationMethod === 'category'}
                      onChange={(e) => handleActualCostsChange('estimationMethod', e.target.value)}
                      className="mr-3 text-indigo-600"
                    />
                    <div>
                      <div className="font-medium text-gray-800">Category-wise Breakdown</div>
                      <div className="text-xs text-gray-600">Enter spending for each category</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Current Monthly Spending Input */}
              {actualCosts.estimationMethod === 'current' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                  className="bg-white p-4 rounded-xl border border-indigo-200"
                >
                  <label className="block text-sm font-semibold text-indigo-800 mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                    Current Monthly Grocery Spending
                  </label>
                  <NumberInput
                    value={actualCosts.currentMonthlySpend}
                    onChange={(value) => handleActualCostsChange('currentMonthlySpend', value)}
                    placeholder="Enter your monthly grocery bill"
                    prefix={formatCurrency(0).replace('0', '').trim()}
                    step="100"
                    allowDecimals={true}
                    allowNegative={false}
                    className="w-full"
                  />
                  <p className="text-xs text-indigo-600 mt-2">
                    💡 Check your bank statements or receipts for the last 2-3 months to get an accurate average
                  </p>
                </motion.div>
              )}

              {/* Category-wise Breakdown Inputs */}
              {actualCosts.estimationMethod === 'category' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-indigo-200">
                      <label className="block text-sm font-semibold text-indigo-800 mb-3 flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        Grains & Cereals
                      </label>
                      <NumberInput
                        value={actualCosts.grainsCereals}
                        onChange={(value) => handleActualCostsChange('grainsCereals', value)}
                        placeholder="Rice, wheat, oats..."
                        prefix={formatCurrency(0).replace('0', '').trim()}
                        step="50"
                        allowDecimals={true}
                        allowNegative={false}
                        className="w-full"
                      />
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-indigo-200">
                      <label className="block text-sm font-semibold text-indigo-800 mb-3 flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Vegetables & Fruits
                      </label>
                      <NumberInput
                        value={actualCosts.vegetablesFruits}
                        onChange={(value) => handleActualCostsChange('vegetablesFruits', value)}
                        placeholder="Fresh produce..."
                        prefix={formatCurrency(0).replace('0', '').trim()}
                        step="50"
                        allowDecimals={true}
                        allowNegative={false}
                        className="w-full"
                      />
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-indigo-200">
                      <label className="block text-sm font-semibold text-indigo-800 mb-3 flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        Dairy Products
                      </label>
                      <NumberInput
                        value={actualCosts.dairyProducts}
                        onChange={(value) => handleActualCostsChange('dairyProducts', value)}
                        placeholder="Milk, cheese, yogurt..."
                        prefix={formatCurrency(0).replace('0', '').trim()}
                        step="50"
                        allowDecimals={true}
                        allowNegative={false}
                        className="w-full"
                      />
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-indigo-200">
                      <label className="block text-sm font-semibold text-indigo-800 mb-3 flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        Protein Sources
                      </label>
                      <NumberInput
                        value={actualCosts.proteinSources}
                        onChange={(value) => handleActualCostsChange('proteinSources', value)}
                        placeholder="Meat, fish, pulses..."
                        prefix={formatCurrency(0).replace('0', '').trim()}
                        step="50"
                        allowDecimals={true}
                        allowNegative={false}
                        className="w-full"
                      />
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-indigo-200">
                      <label className="block text-sm font-semibold text-indigo-800 mb-3 flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        Spices & Condiments
                      </label>
                      <NumberInput
                        value={actualCosts.spicesCondiments}
                        onChange={(value) => handleActualCostsChange('spicesCondiments', value)}
                        placeholder="Spices, oil, sauces..."
                        prefix={formatCurrency(0).replace('0', '').trim()}
                        step="25"
                        allowDecimals={true}
                        allowNegative={false}
                        className="w-full"
                      />
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-indigo-200">
                      <label className="block text-sm font-semibold text-indigo-800 mb-3 flex items-center gap-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        Snacks & Beverages
                      </label>
                      <NumberInput
                        value={actualCosts.snacksBeverages}
                        onChange={(value) => handleActualCostsChange('snacksBeverages', value)}
                        placeholder="Tea, coffee, snacks..."
                        prefix={formatCurrency(0).replace('0', '').trim()}
                        step="25"
                        allowDecimals={true}
                        allowNegative={false}
                        className="w-full"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-indigo-600 bg-indigo-50 p-3 rounded-lg">
                    💡 Estimate your monthly spending in each category. Don't worry about being exact - rough estimates work fine!
                  </p>
                </motion.div>
              )}
            </motion.div>

            {/* Diet Type & Location - Enhanced Cards */}
            <div className={'grid ' + (isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-2 gap-6') + ''}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200"
              >
                <label className="block text-sm font-semibold text-orange-800 mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  Diet Type
                </label>
                <div className="relative">
                  <select
                    value={familyDetails.dietType}
                    onChange={(e) => handleFamilyChange('dietType', e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 appearance-none cursor-pointer font-medium text-gray-800"
                  >
                    {Object.entries(dietTypes).map(([key, diet]) => (
                      <option key={key} value={key}>{diet.label}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                    <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                className="bg-gradient-to-br from-teal-50 to-teal-100 p-4 rounded-xl border border-teal-200"
              >
                <label className="block text-sm font-semibold text-teal-800 mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                  Location
                </label>
                <div className="relative">
                  <select
                    value={familyDetails.location}
                    onChange={(e) => handleFamilyChange('location', e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-teal-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 appearance-none cursor-pointer font-medium text-gray-800"
                  >
                    {Object.entries(locations).map(([key, location]) => (
                      <option key={key} value={key}>{location.label}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                    <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Preferences - Enhanced Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
              className="border-t-2 border-gray-200 pt-6 mt-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Shopping Preferences</h3>
              </div>

              <div className="space-y-6">
                {/* Organic Percentage - Enhanced Slider */}
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-xl border border-emerald-200">
                  <label className="block text-sm font-semibold text-emerald-800 mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    Organic Products: {preferences.organicPercentage}%
                  </label>
                  <div className="relative">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="10"
                      value={preferences.organicPercentage}
                      onChange={(e) => handlePreferenceChange('organicPercentage', e.target.value)}
                      className="w-full h-2 bg-emerald-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                      style={{
                        background: `linear-gradient(to right, #10b981 0%, #10b981 ${preferences.organicPercentage}%, #d1fae5 ${preferences.organicPercentage}%, #d1fae5 100%)`
                      }}
                    />
                    <div className="flex justify-between text-xs text-emerald-600 mt-1">
                      <span>0%</span>
                      <span>50%</span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>

                {/* Eating Out & Brand Preference */}
                <div className={'grid ' + (isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-2 gap-4') + ''}>
                  <div className="bg-gradient-to-br from-rose-50 to-rose-100 p-4 rounded-xl border border-rose-200 flex flex-col h-full">
                    <label className="block text-sm font-semibold text-rose-800 mb-3 flex items-center gap-2 min-h-[20px]">
                      <div className="w-2 h-2 bg-rose-500 rounded-full flex-shrink-0"></div>
                      <span className="leading-tight">Eating Out (per week)</span>
                    </label>
                    <div className="flex-1 flex items-end">
                      <NumberInput
                        value={preferences.eatingOutFrequency}
                        onChange={(value) => handlePreferenceChange('eatingOutFrequency', value)}
                        placeholder="0"
                        step="1"
                        allowDecimals={false}
                        allowNegative={false}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-xl border border-amber-200 flex flex-col h-full">
                    <label className="block text-sm font-semibold text-amber-800 mb-3 flex items-center gap-2 min-h-[20px]">
                      <div className="w-2 h-2 bg-amber-500 rounded-full flex-shrink-0"></div>
                      <span className="leading-tight">Brand Preference</span>
                    </label>
                    <div className="flex-1 flex items-end">
                      <div className="relative w-full">
                        <select
                          value={preferences.brandPreference}
                          onChange={(e) => handlePreferenceChange('brandPreference', e.target.value)}
                          className="w-full px-4 py-3 bg-white border-2 border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 appearance-none cursor-pointer font-medium text-gray-800"
                        >
                          {Object.entries(brandPreferences).map(([key, brand]) => (
                            <option key={key} value={key}>{brand.label}</option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                          <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bulk Buying - Enhanced Toggle */}
                <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 p-4 rounded-xl border border-cyan-200">
                  <label className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={preferences.bulkBuying}
                        onChange={(e) => handlePreferenceChange('bulkBuying', e.target.checked)}
                        className="sr-only"
                      />
                      <div className={'w-12 h-6 rounded-full transition-colors duration-300 ' + (preferences.bulkBuying ? 'bg-cyan-500' : 'bg-gray-300') + ''}>
                        <div className={'w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ' + (preferences.bulkBuying ? 'translate-x-6' : 'translate-x-0.5') + ' translate-y-0.5'}></div>
                      </div>
                    </div>
                    <div className="ml-4">
                      <span className="text-sm font-semibold text-cyan-800 flex items-center gap-2">
                        <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                        I buy non-perishables in bulk
                      </span>
                      <span className="text-xs text-cyan-600">Save money with bulk purchases</span>
                    </div>
                  </label>
                </div>
              </div>
            </motion.div>
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
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calculator className={(responsive.iconSize("md")) + ' text-blue-600'} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Budget Estimate</h2>
          </div>

          <div className="space-y-6">
            {/* No Data Message */}
            {(!actualCosts.currentMonthlySpend && actualCosts.estimationMethod === 'current') ||
             (actualCosts.estimationMethod === 'category' && !actualCosts.grainsCereals && !actualCosts.vegetablesFruits && !actualCosts.dairyProducts && !actualCosts.proteinSources && !actualCosts.spicesCondiments && !actualCosts.snacksBeverages) ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 text-center"
              >
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Enter Your Grocery Costs</h3>
                <p className="text-gray-600 text-sm">
                  {actualCosts.estimationMethod === 'current'
                    ? 'Please enter your current monthly grocery spending above to see your personalized budget breakdown.'
                    : 'Please enter your spending for each grocery category above to see your personalized budget breakdown.'
                  }
                </p>
              </motion.div>
            ) : (
              <>
                {/* Main Monthly Budget - Hero Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="relative p-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl text-white text-center overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full translate-y-12 -translate-x-12"></div>
              <div className="relative z-10">
                <div className="text-sm opacity-90 mb-2">Monthly Grocery Budget</div>
                <div className={'' + (responsive.typography.heading) + ' font-bold mb-2'}>
                  <CompactCurrencyDisplay value={results.monthlyBudget} />
                </div>
                <div className="text-xs opacity-75">Based on your family size and preferences</div>
              </div>
            </motion.div>

            {/* Budget Summary Grid */}
            <div className={'grid ' + (isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-3 gap-4') + ''}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 text-center"
              >
                <div className="text-sm font-semibold text-green-800 mb-2 flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Weekly
                </div>
                <div className="text-xl font-bold text-green-600">
                  <CompactCurrencyDisplay value={results.weeklyBudget} />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
                className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 text-center"
              >
                <div className="text-sm font-semibold text-blue-800 mb-2 flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Per Person/Day
                </div>
                <div className="text-xl font-bold text-blue-600">
                  <CompactCurrencyDisplay value={results.perPersonDaily} />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.6 }}
                className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 text-center"
              >
                <div className="text-sm font-semibold text-purple-800 mb-2 flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  Yearly
                </div>
                <div className="text-xl font-bold text-purple-600">
                  <CompactCurrencyDisplay value={results.yearlyBudget} />
                </div>
              </motion.div>
            </div>

            {/* Category Breakdown - Enhanced */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.7 }}
              className="mt-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <TrendingUp className="w-4 h-4 text-gray-600" />
                </div>
                <h3 className="font-bold text-gray-900">Monthly Category Breakdown</h3>
              </div>
              <div className="space-y-3">
                {results.categoryBreakdown && Object.entries(results.categoryBreakdown).map(([key, category], index) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
                    className="flex justify-between items-center p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-center gap-3">
                      <div className={'w-3 h-3 rounded-full ' + (getCategoryColor(key)) + ''}></div>
                      <span className="text-sm font-medium text-gray-700">{category?.label || ''}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">{formatCurrency(category?.amount || 0)}</div>
                      <div className="text-xs text-gray-500">{category?.percentage || 0}%</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Tips Section - Enhanced */}
            <div className={'grid ' + (isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-2 gap-4') + ' mt-6'}>
              {/* Savings Tips */}
              {results.savingsTips.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.9 }}
                  className="p-4 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl border border-yellow-200"
                >
                  <h3 className="font-bold text-yellow-800 mb-3 flex items-center gap-2">
                    <span className="text-lg">💡</span>
                    Money Saving Tips
                  </h3>
                  <div className="text-sm text-yellow-700 space-y-2">
                    {results.savingsTips.map((tip, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span>{tip}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Shopping Tips */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 1.0 }}
                className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200"
              >
                <h3 className="font-bold text-green-800 mb-3 flex items-center gap-2">
                  <span className="text-lg">🛒</span>
                  Smart Shopping Tips
                </h3>
                <div className="text-sm text-green-700 space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Make a shopping list and stick to it</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Shop seasonal produce for better prices</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Compare prices across stores and apps</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Buy generic brands for basic items</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Use coupons and cashback offers</span>
                  </div>
                </div>
              </motion.div>
            </div>
            </>
            )}
          </div>
        </motion.div>
      </MobileGrid>

      {/* PDF Export */}
      {results && results.categoryBreakdown && (
        <CommonPDFExport
          calculatorName="Grocery Budget Calculator"
          inputs={{
            'Family Size - Adults': `${familyDetails.adults} adults`,
            'Family Size - Children': `${familyDetails.children} children`,
            'Family Size - Infants': `${familyDetails.infants} infants`,
            'Estimation Method': actualCosts.estimationMethod === 'current' ? 'Current Monthly Spending' : 'Category-wise Breakdown',
            ...(actualCosts.estimationMethod === 'current' && actualCosts.currentMonthlySpend ? {
              'Current Monthly Spending': formatCurrency(actualCosts.currentMonthlySpend)
            } : {}),
            ...(actualCosts.estimationMethod === 'category' ? {
              'Grains & Cereals (Input)': formatCurrency(actualCosts.grainsCereals || 0),
              'Vegetables & Fruits (Input)': formatCurrency(actualCosts.vegetablesFruits || 0),
              'Dairy Products (Input)': formatCurrency(actualCosts.dairyProducts || 0),
              'Protein Sources (Input)': formatCurrency(actualCosts.proteinSources || 0),
              'Spices & Condiments (Input)': formatCurrency(actualCosts.spicesCondiments || 0),
              'Snacks & Beverages (Input)': formatCurrency(actualCosts.snacksBeverages || 0)
            } : {}),
            'Diet Type': dietTypes[familyDetails.dietType]?.label || familyDetails.dietType,
            'Location': locations[familyDetails.location]?.label || familyDetails.location,
            'Organic Preference': `${preferences.organicPercentage}% organic foods`,
            'Eating Out Frequency': `${preferences.eatingOutFrequency} times per week`,
            'Bulk Buying': preferences.bulkBuying ? 'Yes' : 'No',
            'Brand Preference': preferences.brandPreference.charAt(0).toUpperCase() + preferences.brandPreference.slice(1)
          }}
          results={{
            'Weekly Budget': formatCurrency(results.weeklyBudget || 0),
            'Monthly Budget': formatCurrency(results.monthlyBudget || 0),
            'Yearly Budget': formatCurrency(results.yearlyBudget || 0),
            'Per Person Daily': formatCurrency(results.perPersonDaily || 0),
            'Grains & Staples': formatCurrency(results.categoryBreakdown?.grains?.amount || 0),
            'Vegetables & Fruits': formatCurrency(results.categoryBreakdown?.vegetables?.amount || 0),
            'Dairy Products': formatCurrency(results.categoryBreakdown?.dairy?.amount || 0),
            'Protein Sources': formatCurrency(results.categoryBreakdown?.protein?.amount || 0),
            'Spices & Condiments': formatCurrency(results.categoryBreakdown?.spices?.amount || 0),
            'Snacks & Beverages': formatCurrency(results.categoryBreakdown?.snacks?.amount || 0)
          }}
        />
      )}

      {/* Universal Related Calculators */}
      <UniversalRelatedCalculators
        currentCalculatorId={currentCalculatorId}
        calculatorData={calculatorData}
        onCalculatorSelect={onCalculatorSelect}
      />
      

    </MobileLayout>
  )
}

export default GroceryBudgetCalculator
