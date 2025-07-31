import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Target, Calendar, TrendingUp, Calculator } from 'lucide-react'
import { useCurrency } from '../contexts/CurrencyContext'
import { useViewMode } from '../contexts/ViewModeContext'
import useMobileResponsive from '../hooks/useMobileResponsive'
import { NumberInput } from '../components/common/inputs'
import CommonPDFExport from '../components/CommonPDFExport'
import RelatedCalculators from '../components/RelatedCalculators'
import MobileLayout, { MobileGrid } from '../components/MobileLayout'

const SavingsGoalCalculator = ({ categoryColor = 'emerald', currentCalculatorId, calculatorData, onCalculatorSelect }) => {
  const { formatCurrency, currentFormat } = useCurrency()
  const { responsive } = useMobileResponsive()
  
  const [inputs, setInputs] = useState({
    goalAmount: '',
    currentSavings: '',
    targetDate: '',
    calculationType: 'target-date' // 'target-date' or 'monthly-amount'
  })

  const [results, setResults] = useState({
    remainingAmount: 0,
    monthsRemaining: 0,
    weeksRemaining: 0,
    daysRemaining: 0,
    dailySavingsNeeded: 0,
    weeklySavingsNeeded: 0,
    monthlySavingsNeeded: 0,
    progressPercentage: 0,
    goalAchievable: true
  })

  useEffect(() => {
    calculateSavingsGoal()
  }, [inputs])

  const calculateSavingsGoal = () => {
    const goalAmount = parseFloat(inputs.goalAmount) || 0
    const currentSavings = parseFloat(inputs.currentSavings) || 0
    const remainingAmount = Math.max(0, goalAmount - currentSavings)
    const progressPercentage = goalAmount > 0 ? (currentSavings / goalAmount) * 100 : 0

    if (!inputs.targetDate || goalAmount <= 0) {
      setResults({
        remainingAmount,
        monthsRemaining: 0,
        weeksRemaining: 0,
        daysRemaining: 0,
        dailySavingsNeeded: 0,
        weeklySavingsNeeded: 0,
        monthlySavingsNeeded: 0,
        progressPercentage,
        goalAchievable: true
      })
      return
    }

    const targetDate = new Date(inputs.targetDate)
    const currentDate = new Date()
    const timeDifference = targetDate.getTime() - currentDate.getTime()
    const daysRemaining = Math.max(0, Math.ceil(timeDifference / (1000 * 3600 * 24)))
    const weeksRemaining = daysRemaining / 7
    const monthsRemaining = daysRemaining / 30.44 // Average days per month

    const dailySavingsNeeded = daysRemaining > 0 ? remainingAmount / daysRemaining : 0
    const weeklySavingsNeeded = weeksRemaining > 0 ? remainingAmount / weeksRemaining : 0
    const monthlySavingsNeeded = monthsRemaining > 0 ? remainingAmount / monthsRemaining : 0

    // Check if goal is achievable (assuming reasonable savings limits)
    const goalAchievable = dailySavingsNeeded <= (goalAmount * 0.1) // Max 10% of goal per day seems reasonable

    setResults({
      remainingAmount,
      monthsRemaining,
      weeksRemaining,
      daysRemaining,
      dailySavingsNeeded,
      weeklySavingsNeeded,
      monthlySavingsNeeded,
      progressPercentage,
      goalAchievable
    })
  }

  const handleInputChange = (field, value) => {
    setInputs(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const getMinDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
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
          <Target className={(responsive.iconSize("lg")) + ' text-emerald-600'} />
          Savings Goal Tracker
        </h2>
        <p className="text-gray-600">Calculate how much to save daily/monthly to reach your financial goal</p>
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
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Calendar className={(responsive.iconSize("md")) + ' text-emerald-600'} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Goal Details</h2>
          </div>

          <div className="space-y-6">
            {/* Goal Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Savings Goal Amount
              </label>
              <NumberInput
                value={inputs.goalAmount}
                onChange={(value) => handleInputChange('goalAmount', value)}
                placeholder="Enter amount"
                prefix={currentFormat.symbol}
                step="1"
                allowDecimals={true}
                allowNegative={false}
                className="w-full py-2 text-sm font-medium border-2 rounded-xl transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Current Savings */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Savings (Optional)
              </label>
              <NumberInput
                value={inputs.currentSavings}
                onChange={(value) => handleInputChange('currentSavings', value)}
                placeholder="Enter amount"
                prefix={currentFormat.symbol}
                step="1"
                allowDecimals={true}
                allowNegative={false}
                className="w-full py-2 text-sm font-medium border-2 rounded-xl transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Target Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Date
              </label>
              <input
                type="date"
                value={inputs.targetDate}
                onChange={(e) => handleInputChange('targetDate', e.target.value)}
                min={getMinDate()}
                className="w-full px-4 py-2 text-sm font-medium border-2 rounded-xl transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            {/* Progress Bar */}
            {inputs.goalAmount && (
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Progress</span>
                  <span className="text-sm font-medium text-emerald-600">
                    {results.progressPercentage.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-emerald-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: (Math.min(100, results.progressPercentage)) + '%' }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{formatCurrency(inputs.currentSavings || 0)}</span>
                  <span>{formatCurrency(inputs.goalAmount || 0)}</span>
                </div>
              </div>
            )}
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
            <h2 className="text-xl font-bold text-gray-900">Savings Plan</h2>
          </div>

          <div className="space-y-4">
            {/* Remaining Amount */}
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">Amount Remaining:</span>
              <span className="font-bold text-gray-900">
                {formatCurrency(results.remainingAmount || 0)}
              </span>
            </div>

            {/* Time Remaining */}
            {results.daysRemaining > 0 && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-sm font-medium text-blue-700 mb-2">Time Remaining:</div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-lg font-bold text-blue-600">{Math.floor(results.monthsRemaining)}</div>
                    <div className="text-xs text-blue-500">Months</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-blue-600">{Math.floor(results.weeksRemaining)}</div>
                    <div className="text-xs text-blue-500">Weeks</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-blue-600">{results.daysRemaining}</div>
                    <div className="text-xs text-blue-500">Days</div>
                  </div>
                </div>
              </div>
            )}

            {/* Daily Savings */}
            <div className="flex justify-between items-center p-4 bg-emerald-50 rounded-lg border-2 border-emerald-200">
              <span className="text-lg font-bold text-emerald-700">Daily Savings:</span>
              <span className="text-xl font-bold text-emerald-600">
                {formatCurrency(results.dailySavingsNeeded || 0)}
              </span>
            </div>

            {/* Weekly Savings */}
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="font-medium text-green-700">Weekly Savings:</span>
              <span className="font-bold text-green-600">
                {formatCurrency(results.weeklySavingsNeeded || 0)}
              </span>
            </div>

            {/* Monthly Savings */}
            <div className="flex justify-between items-center p-3 bg-teal-50 rounded-lg">
              <span className="font-medium text-teal-700">Monthly Savings:</span>
              <span className="font-bold text-teal-600">
                {formatCurrency(results.monthlySavingsNeeded || 0)}
              </span>
            </div>

            {/* Goal Status */}
            {inputs.targetDate && inputs.goalAmount && (
              <div className={'p-4 rounded-lg ' + (
                results.goalAchievable 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-yellow-50 border border-yellow-200'
              )}>
                <div className={'font-semibold ' + (
                  results.goalAchievable ? 'text-green-800' : 'text-yellow-800'
                ) + ' mb-2'}>
                  {results.goalAchievable ? '✅ Goal Achievable' : '⚠️ Challenging Goal'}
                </div>
                <div className={'text-sm ' + (
                  results.goalAchievable ? 'text-green-700' : 'text-yellow-700'
                )}>
                  {results.goalAchievable 
                    ? 'Your savings goal is realistic with consistent daily savings.'
                    : 'This goal requires significant daily savings. Consider extending the timeline or reducing the target amount.'
                  }
                </div>
              </div>
            )}

            {/* Tips */}
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-semibold text-purple-800 mb-2">💡 Savings Tips</h3>
              <div className="text-sm text-purple-700 space-y-1">
                <div>• Set up automatic transfers to your savings account</div>
                <div>• Track your progress weekly to stay motivated</div>
                <div>• Cut unnecessary expenses to boost savings</div>
                <div>• Consider high-yield savings accounts for better returns</div>
              </div>
            </div>
          </div>
        </motion.div>
      </MobileGrid>

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

export default SavingsGoalCalculator
