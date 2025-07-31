import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Smartphone, Plus, Minus, TrendingUp, Calendar, CreditCard } from 'lucide-react'
import { useCurrency } from '../contexts/CurrencyContext'
import { useViewMode } from '../contexts/ViewModeContext'
import useMobileResponsive from '../hooks/useMobileResponsive'
import { addMobileResponsivenessSEO, addPDFExportSEO, addChartResponsivenessSEO } from '../utils/seo'
import { NumberInput } from '../components/common/inputs'
import UniversalRelatedCalculators from '../components/UniversalRelatedCalculators'
import CommonPDFExport from '../components/CommonPDFExport'
import MobileLayout, { MobileGrid } from '../components/MobileLayout'

const DailySpendingCalculator = ({ categoryColor = 'green', currentCalculatorId, calculatorData, onCalculatorSelect }) => {
  const { formatCurrency, currentFormat } = useCurrency()
  const { isMobile } = useViewMode()
  const { responsive } = useMobileResponsive()
  
  const [transactions, setTransactions] = useState([
    { id: 1, amount: '', category: 'food', description: '', time: 'morning' },
    { id: 2, amount: '', category: 'transport', description: '', time: 'afternoon' }
  ])

  const [settings, setSettings] = useState({
    dailyBudget: '',
    trackingPeriod: '7' // days
  })

  const [results, setResults] = useState({
    dailyTotal: 0,
    weeklyProjection: 0,
    monthlyProjection: 0,
    budgetStatus: 'within',
    categoryBreakdown: {},
    timeBreakdown: {},
    averageTransaction: 0,
    spendingTrend: 'stable'
  })

  const categories = {
    food: { label: 'Food & Dining', icon: '🍽️', color: 'orange' },
    transport: { label: 'Transportation', icon: '🚗', color: 'blue' },
    shopping: { label: 'Shopping', icon: '🛒', color: 'purple' },
    entertainment: { label: 'Entertainment', icon: '🎬', color: 'pink' },
    bills: { label: 'Bills & Utilities', icon: '💡', color: 'yellow' },
    groceries: { label: 'Groceries', icon: '🥬', color: 'green' },
    healthcare: { label: 'Healthcare', icon: '🏥', color: 'red' },
    education: { label: 'Education', icon: '📚', color: 'indigo' },
    other: { label: 'Other', icon: '💳', color: 'gray' }
  }

  const timeSlots = {
    morning: { label: 'Morning (6AM-12PM)', icon: '🌅' },
    afternoon: { label: 'Afternoon (12PM-6PM)', icon: '☀️' },
    evening: { label: 'Evening (6PM-10PM)', icon: '🌆' },
    night: { label: 'Night (10PM-6AM)', icon: '🌙' }
  }

  useEffect(() => {
    calculateSpending()
  }, [transactions, settings])

  // Enhanced SEO for mobile responsiveness, PDF export, and charts
  useEffect(() => {
    addMobileResponsivenessSEO();
    addPDFExportSEO();
    addChartResponsivenessSEO();
    
    // Update page title and meta description
    document.title = 'Daily Spending Calculator - Track Daily Expenses | Mobile App';
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Track daily spending with mobile-optimized calculator. PDF reports and expense analysis for better budget management.');
    }
    
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', 'daily spending calculator, expense tracker, budget calculator, mobile app, PDF export');
    }
  }, []);

  const calculateSpending = () => {
    const dailyTotal = transactions.reduce((sum, transaction) => {
      return sum + (parseFloat(transaction.amount) || 0)
    }, 0)

    const weeklyProjection = dailyTotal * 7
    const monthlyProjection = dailyTotal * 30

    const dailyBudget = parseFloat(settings.dailyBudget) || 0
    let budgetStatus = 'within'
    if (dailyBudget > 0) {
      if (dailyTotal > dailyBudget * 1.2) budgetStatus = 'over'
      else if (dailyTotal > dailyBudget) budgetStatus = 'warning'
    }

    // Category breakdown
    const categoryBreakdown = {}
    transactions.forEach(transaction => {
      const amount = parseFloat(transaction.amount) || 0
      if (amount > 0) {
        if (!categoryBreakdown[transaction.category]) {
          categoryBreakdown[transaction.category] = 0
        }
        categoryBreakdown[transaction.category] += amount
      }
    })

    // Time breakdown
    const timeBreakdown = {}
    transactions.forEach(transaction => {
      const amount = parseFloat(transaction.amount) || 0
      if (amount > 0) {
        if (!timeBreakdown[transaction.time]) {
          timeBreakdown[transaction.time] = 0
        }
        timeBreakdown[transaction.time] += amount
      }
    })

    const averageTransaction = transactions.length > 0 ? dailyTotal / transactions.filter(t => parseFloat(t.amount) > 0).length : 0

    setResults({
      dailyTotal,
      weeklyProjection,
      monthlyProjection,
      budgetStatus,
      categoryBreakdown,
      timeBreakdown,
      averageTransaction: averageTransaction || 0,
      spendingTrend: 'stable' // This could be calculated with historical data
    })
  }

  const addTransaction = () => {
    const newId = Math.max(...transactions.map(t => t.id)) + 1
    setTransactions([...transactions, {
      id: newId,
      amount: '',
      category: 'other',
      description: '',
      time: 'afternoon'
    }])
  }

  const removeTransaction = (id) => {
    if (transactions.length > 1) {
      setTransactions(transactions.filter(t => t.id !== id))
    }
  }

  const updateTransaction = (id, field, value) => {
    setTransactions(transactions.map(t => 
      t.id === id ? { ...t, [field]: value } : t
    ))
  }

  const updateSettings = (field, value) => {
    setSettings(prev => ({
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
          <Smartphone className={(responsive.iconSize("lg")) + ' text-green-600'} />
          Daily Spending Calculator
        </h2>
        <p className="text-gray-600">Track your daily spending habits and expenses across all payment methods</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Settings */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">Settings</h2>
          
          <div className="space-y-4">
            {/* Daily Budget */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Daily Budget (Optional)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  {currentFormat.symbol}
                </span>
                <NumberInput
                      value={settings.dailyBudget}
                      onChange={(value) => updateSettings('dailyBudget', value)}
                      placeholder="Enter value"
                      step="1"
                      allowDecimals={true}
                      allowNegative={false}
                      className="w-full py-2 text-sm font-medium border border-gray-300 rounded-lg transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
              </div>
            </div>

            {/* Quick Add Buttons */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quick Add Common Expenses
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { amount: '50', label: 'Auto/Bus' },
                  { amount: '200', label: 'Lunch' },
                  { amount: '100', label: 'Coffee' },
                  { amount: '300', label: 'Groceries' }
                ].map(quick => (
                  <button
                    key={quick.label}
                    onClick={() => {
                      const newId = Math.max(...transactions.map(t => t.id)) + 1
                      setTransactions([...transactions, {
                        id: newId,
                        amount: quick.amount,
                        category: quick.label.toLowerCase().includes('auto') || quick.label.toLowerCase().includes('bus') ? 'transport' : 
                                 quick.label.toLowerCase().includes('lunch') || quick.label.toLowerCase().includes('coffee') ? 'food' : 'groceries',
                        description: quick.label,
                        time: 'afternoon'
                      }])
                    }}
                    className="p-2 bg-green-100 text-green-700 rounded text-xs font-medium hover:bg-green-200 transition-colors"
                  >
                    +{currentFormat.symbol}{quick.amount} {quick.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Transactions */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Today's Transactions</h2>
            <button
              onClick={addTransaction}
              className="flex items-center gap-2 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="p-3 border border-gray-200 rounded-lg">
                {/* Amount Row */}
                <div className="mb-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">
                      {currentFormat.symbol}
                    </span>
                    <NumberInput
                    value={transaction.amount}
                    onChange={(value) => updateTransaction(transaction.id, 'amount', value)}
                    placeholder="Enter value"
                    step="1"
                    allowDecimals={true}
                    allowNegative={false}
                    className="w-full pl-12 py-2 text-sm font-medium border border-gray-300 rounded-lg transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  </div>
                </div>

                {/* Category Row */}
                <div className="mb-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Category
                  </label>
                  <select
                    value={transaction.category}
                    onChange={(e) => updateTransaction(transaction.id, 'category', e.target.value)}
                    className="w-full px-2 py-2 border border-gray-300 rounded-lg text-xs focus:ring-1 focus:ring-green-500"
                  >
                    {Object.entries(categories).map(([key, category]) => (
                      <option key={key} value={key}>{category.icon} {category.label}</option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div className="mb-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Description (Optional)
                  </label>
                  <input
                    type="text"
                    value={transaction.description}
                    onChange={(e) => updateTransaction(transaction.id, 'description', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-green-500"
                    placeholder="What did you buy?"
                  />
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {/* Time */}
                  <div className="flex items-end gap-1">
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Time
                      </label>
                      <select
                        value={transaction.time}
                        onChange={(e) => updateTransaction(transaction.id, 'time', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-green-500"
                      >
                        {Object.entries(timeSlots).map(([key, slot]) => (
                          <option key={key} value={key}>{slot.icon} {slot.label.split(' ')[0]}</option>
                        ))}
                      </select>
                    </div>
                    {transactions.length > 1 && (
                      <button
                        onClick={() => removeTransaction(transaction.id)}
                        className="p-1 text-red-500 hover:text-red-700"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Daily Total */}
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-green-800">Today's Total:</span>
              <span className="text-lg font-bold text-green-600">
                {formatCurrency(results.dailyTotal || 0)}
              </span>
            </div>
            {settings.dailyBudget && (
              <div className="mt-1 text-xs text-green-600">
                Budget: {formatCurrency(settings.dailyBudget)} 
                <span className={'ml-2 ' + (
                  results.budgetStatus === 'within' ? 'text-green-600' :
                  results.budgetStatus === 'warning' ? 'text-yellow-600' : 'text-red-600'
                )}>
                  ({results.budgetStatus === 'within' ? 'Within budget' :
                    results.budgetStatus === 'warning' ? 'Close to limit' : 'Over budget'})
                </span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Analysis */}
        <motion.div
          className="bg-white rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className={(responsive.iconSize("md")) + ' text-blue-600'} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Spending Analysis</h2>
          </div>

          <div className="space-y-4">
            {/* Projections */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Weekly projection:</span>
                <span className="font-medium">{formatCurrency(results.weeklyProjection || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly projection:</span>
                <span className="font-medium">{formatCurrency(results.monthlyProjection || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Average per transaction:</span>
                <span className="font-medium">{formatCurrency(results.averageTransaction || 0)}</span>
              </div>
            </div>

            {/* Category Breakdown */}
            {Object.keys(results.categoryBreakdown).length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">By Category</h3>
                <div className="space-y-2">
                  {Object.entries(results.categoryBreakdown).map(([category, amount]) => {
                    const categoryInfo = categories[category]
                    const percentage = results.dailyTotal > 0 ? (amount / results.dailyTotal) * 100 : 0
                    return (
                      <div key={category} className="flex justify-between items-center text-sm">
                        <span className="flex items-center gap-1">
                          <span>{categoryInfo.icon}</span>
                          <span>{categoryInfo.label}</span>
                        </span>
                        <div className="text-right">
                          <div className="font-medium">{formatCurrency(amount)}</div>
                          <div className="text-xs text-gray-500">{percentage.toFixed(1)}%</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Time Breakdown */}
            {Object.keys(results.timeBreakdown).length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">By Time</h3>
                <div className="space-y-2">
                  {Object.entries(results.timeBreakdown).map(([time, amount]) => {
                    const timeInfo = timeSlots[time]
                    return (
                      <div key={time} className="flex justify-between items-center text-sm">
                        <span className="flex items-center gap-1">
                          <span>{timeInfo.icon}</span>
                          <span>{timeInfo.label.split(' ')[0]}</span>
                        </span>
                        <span className="font-medium">{formatCurrency(amount)}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Tips */}
            <div className="p-3 bg-yellow-50 rounded-lg">
              <h3 className="font-semibold text-yellow-800 mb-2">💡 Spending Tips</h3>
              <div className="text-xs text-yellow-700 space-y-1">
                <div>• Set daily spending limits</div>
                <div>• Review transactions weekly</div>
                <div>• Use payment apps with spending insights</div>
                <div>• Avoid impulse purchases</div>
                <div>• Track small expenses - they add up!</div>
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
      {/* PDF Export */}
      {results && (
        <CommonPDFExport
          calculatorName="DailySpending Calculator"
          inputs={{
            'Daily Budget': settings.dailyBudget ? formatCurrency(settings.dailyBudget) : "Not set",
            'Tracking Period': (settings.trackingPeriod) + ' days',
            'Total Transactions': transactions.length.toString(),
            'Transaction Categories': Array.from(new Set(transactions.map(t => t.category))).join(", "),
            'Time Periods Tracked': Array.from(new Set(transactions.map(t => t.time))).join(", "),
            'Average Transaction': formatCurrency(transactions.reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0) / transactions.length),
            'Highest Transaction': formatCurrency(Math.max(...transactions.map(t => parseFloat(t.amount) || 0))),
            'Budget Utilization': settings.dailyBudget ? (parseFloat(settings.dailyBudget) > 0 ? ((results.dailyTotal / parseFloat(settings.dailyBudget)) * 100).toFixed(1) + '%' : "No budget set") : "No budget set"
          }}
          results={{
            'Daily Total Spending': formatCurrency(results.dailyTotal || 0),
            'Weekly Projection': formatCurrency(results.weeklyProjection || 0),
            'Monthly Projection': formatCurrency(results.monthlyProjection || 0),
            'Budget Status': results.budgetStatus === "within" ? "Within Budget" : results.budgetStatus === "warning" ? "Approaching Limit" : "Over Budget",
            'Budget Remaining': settings.dailyBudget ? formatCurrency(parseFloat(settings.dailyBudget) - results.dailyTotal) : "No budget set",
            'Spending Trend': results.spendingTrend === "stable" ? "Stable" : results.spendingTrend === "increasing" ? "Increasing" : "Decreasing",
            'Category Breakdown': Object.entries(results.categoryBreakdown).map(([cat, amt]) => cat + ': ' + formatCurrency(amt)).join(", "),
            'Time Breakdown': Object.entries(results.timeBreakdown).map(([time, amt]) => time + ': ' + formatCurrency(amt)).join(", "),
            'Average Transaction Size': formatCurrency(results.averageTransaction || 0),
            'Annual Projection': formatCurrency(results.dailyTotal * 365)
          }}
        />
      )}

    </MobileLayout>
  )
}

export default DailySpendingCalculator
