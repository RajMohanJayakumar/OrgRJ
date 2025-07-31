import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { PieChart, Plus, Minus, Home, Car, Utensils, Zap, ShoppingBag, Heart, Calculator, DollarSign } from 'lucide-react'
import { useCurrency } from '../contexts/CurrencyContext'
import { useViewMode } from '../contexts/ViewModeContext'
import useMobileResponsive from '../hooks/useMobileResponsive'
import { NumberInput } from '../components/common/inputs'
import CompactCurrencyDisplay from '../components/CompactCurrencyDisplay'
import CommonPDFExport from '../components/CommonPDFExport'
import UniversalRelatedCalculators from '../components/UniversalRelatedCalculators'
import MobileLayout, { MobileGrid } from '../components/MobileLayout'

const MonthlyExpenseCalculator = ({ categoryColor = 'indigo', currentCalculatorId, calculatorData, onCalculatorSelect }) => {
  const { formatCurrency, currentFormat } = useCurrency()
  const { isMobile } = useViewMode()
  const { responsive } = useMobileResponsive()
  
  const [monthlyIncome, setMonthlyIncome] = useState('')

  const [expenses, setExpenses] = useState([
    { id: 1, category: 'rent', name: 'Rent/Mortgage', amount: '', icon: Home },
    { id: 2, category: 'food', name: 'Food & Groceries', amount: '', icon: Utensils },
    { id: 3, category: 'transportation', name: 'Transportation', amount: '', icon: Car },
    { id: 4, category: 'utilities', name: 'Utilities', amount: '', icon: Zap },
    { id: 5, category: 'entertainment', name: 'Entertainment', amount: '', icon: ShoppingBag },
    { id: 6, category: 'healthcare', name: 'Healthcare', amount: '', icon: Heart }
  ])

  const [results, setResults] = useState({
    totalExpenses: 0,
    categoryBreakdown: {},
    percentageBreakdown: {},
    budgetRecommendations: {},
    incomeAnalysis: {
      remainingBudget: 0,
      expenseRatio: 0,
      savingsRecommendation: 0
    }
  })

  const expenseCategories = {
    rent: { label: 'Housing', icon: Home, color: 'blue', recommended: 30 },
    food: { label: 'Food & Groceries', icon: Utensils, color: 'green', recommended: 15 },
    transportation: { label: 'Transportation', icon: Car, color: 'yellow', recommended: 15 },
    utilities: { label: 'Utilities', icon: Zap, color: 'orange', recommended: 10 },
    entertainment: { label: 'Entertainment', icon: ShoppingBag, color: 'purple', recommended: 10 },
    healthcare: { label: 'Healthcare', icon: Heart, color: 'red', recommended: 5 },
    savings: { label: 'Savings', icon: Calculator, color: 'emerald', recommended: 20 },
    other: { label: 'Other', icon: Calculator, color: 'gray', recommended: 5 }
  }

  useEffect(() => {
    calculateExpenses()
  }, [expenses, monthlyIncome])

  const calculateExpenses = () => {
    const totalExpenses = expenses.reduce((sum, expense) => {
      return sum + (parseFloat(expense.amount) || 0)
    }, 0)

    const income = parseFloat(monthlyIncome) || 0
    const categoryBreakdown = {}
    const percentageBreakdown = {}

    expenses.forEach(expense => {
      const amount = parseFloat(expense.amount) || 0
      if (amount > 0) {
        categoryBreakdown[expense.category] = amount
        percentageBreakdown[expense.category] = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0
      }
    })

    // Budget recommendations based on income if available, otherwise use expense percentages
    const budgetRecommendations = {}
    Object.keys(expenseCategories).forEach(category => {
      const recommended = expenseCategories[category].recommended
      const actual = income > 0 && categoryBreakdown[category]
        ? (categoryBreakdown[category] / income) * 100
        : percentageBreakdown[category] || 0

      budgetRecommendations[category] = {
        recommended,
        actual,
        status: actual <= recommended ? 'good' : actual <= recommended * 1.2 ? 'warning' : 'over'
      }
    })

    // Income analysis
    const incomeAnalysis = {
      remainingBudget: income > 0 ? income - totalExpenses : 0,
      expenseRatio: income > 0 ? (totalExpenses / income) * 100 : 0,
      savingsRecommendation: income > 0 ? income * 0.2 : totalExpenses * 0.25
    }

    setResults({
      totalExpenses,
      categoryBreakdown,
      percentageBreakdown,
      budgetRecommendations,
      incomeAnalysis
    })
  }

  const addExpense = () => {
    const newId = Math.max(...expenses.map(e => e.id)) + 1
    setExpenses([...expenses, {
      id: newId,
      category: 'other',
      name: '',
      amount: '',
      icon: Calculator
    }])
  }

  const removeExpense = (id) => {
    if (expenses.length > 1) {
      setExpenses(expenses.filter(e => e.id !== id))
    }
  }

  const updateExpense = (id, field, value) => {
    setExpenses(expenses.map(e => 
      e.id === id ? { ...e, [field]: value } : e
    ))
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
          <PieChart className={(responsive.iconSize("lg")) + ' text-indigo-600'} />
          Monthly Expense Split Calculator
        </h2>
        <p className="text-gray-600">Categorize and analyze your monthly expenses with budget recommendations</p>
      </motion.div>

      <MobileGrid columns={2} className={isMobile ? 'mt-4' : 'mt-6'}>
        {/* Left Column - Income and Expense Input */}
        <div className="space-y-6">
          {/* Income Input Section */}
          <motion.div
            className="bg-white rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <DollarSign className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-bold text-gray-900">Monthly Income</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter your monthly income to get personalized budget recommendations
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    {currentFormat.symbol}
                  </span>
                  <NumberInput
                    value={monthlyIncome}
                    onChange={setMonthlyIncome}
                    placeholder="Enter your monthly income"
                    step="1"
                    allowDecimals={true}
                    allowNegative={false}
                    className="w-full pl-8 py-3 text-lg font-medium border border-gray-300 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    aria-label="Monthly Income"
                  />
                </div>
              </div>

              {monthlyIncome && parseFloat(monthlyIncome) > 0 && (
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="text-sm text-green-700">
                    <div className="font-medium">Income-based budget recommendations:</div>
                    <div className="mt-1 space-y-1">
                      <div>• Housing: {formatCurrency(parseFloat(monthlyIncome) * 0.30)} (30%)</div>
                      <div>• Food: {formatCurrency(parseFloat(monthlyIncome) * 0.15)} (15%)</div>
                      <div>• Savings: {formatCurrency(parseFloat(monthlyIncome) * 0.20)} (20%)</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Expense Input Section */}
          <motion.div
            className={`bg-white rounded-xl shadow-lg p-6 ${!isMobile ? 'min-h-[600px]' : ''}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Monthly Expenses</h2>
            <button
              onClick={addExpense}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Expense
            </button>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {expenses.map((expense) => {
              const categoryInfo = expenseCategories[expense.category]
              const IconComponent = categoryInfo.icon
              
              return (
                <div key={expense.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Category */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Category
                      </label>
                      <select
                        value={expense.category}
                        onChange={(e) => updateExpense(expense.id, 'category', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                      >
                        {Object.entries(expenseCategories).map(([key, cat]) => (
                          <option key={key} value={key}>{cat.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Name */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Expense Name
                      </label>
                      <input
                        type="text"
                        value={expense.name}
                        onChange={(e) => updateExpense(expense.id, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                        placeholder={categoryInfo.label}
                      />
                    </div>

                    {/* Amount */}
                    <div className="flex items-end gap-2">
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Amount
                        </label>
                        <div className="relative">
                          <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">
                            {currentFormat.symbol}
                          </span>
                          <NumberInput
                      value={expense.amount}
                      onChange={(value) => updateExpense(expense.id, 'amount', value)}
                      placeholder="Enter value"
                      step="1"
                      allowDecimals={true}
                      allowNegative={false}
                      className="w-full py-2 text-sm font-medium border border-gray-300 rounded-lg transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                        </div>
                      </div>
                      {expenses.length > 1 && (
                        <button
                          onClick={() => removeExpense(expense.id)}
                          className="p-2 text-red-500 hover:text-red-700"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Category Icon and Info */}
                  <div className="mt-2 flex items-center gap-2">
                    <IconComponent className={'w-4 h-4 text-' + (categoryInfo.color) + '-600'} />
                    <span className="text-xs text-gray-500">
                      Recommended: {categoryInfo.recommended}% of total expenses
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Total */}
          <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-indigo-800">Total Monthly Expenses:</span>
              <span className="text-xl font-bold text-indigo-600">
                <CompactCurrencyDisplay value={results.totalExpenses} />
              </span>
            </div>
          </div>
        </motion.div>
        </div>

        {/* Right Column - Analysis Section */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Expense Analysis</h2>

          <div className="space-y-6">
            {/* Income Analysis */}
            {monthlyIncome && parseFloat(monthlyIncome) > 0 && (
              <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  Income vs Expenses
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      <CompactCurrencyDisplay value={parseFloat(monthlyIncome)} />
                    </div>
                    <div className="text-sm text-gray-600">Monthly Income</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      <CompactCurrencyDisplay value={results.totalExpenses} />
                    </div>
                    <div className="text-sm text-gray-600">Total Expenses</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${results.incomeAnalysis.remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      <CompactCurrencyDisplay value={results.incomeAnalysis.remainingBudget} />
                    </div>
                    <div className="text-sm text-gray-600">Remaining Budget</div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-white rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Expense Ratio:</span>
                    <span className={`font-bold ${results.incomeAnalysis.expenseRatio <= 80 ? 'text-green-600' : results.incomeAnalysis.expenseRatio <= 90 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {results.incomeAnalysis.expenseRatio.toFixed(1)}%
                    </span>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${results.incomeAnalysis.expenseRatio <= 80 ? 'bg-green-500' : results.incomeAnalysis.expenseRatio <= 90 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      style={{ width: `${Math.min(100, results.incomeAnalysis.expenseRatio)}%` }}
                    ></div>
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    {results.incomeAnalysis.expenseRatio <= 80 ? '✅ Healthy expense ratio' :
                     results.incomeAnalysis.expenseRatio <= 90 ? '⚠️ Consider reducing expenses' : '🚨 Expenses exceed recommended limits'}
                  </div>
                </div>
              </div>
            )}

            {/* Category Breakdown */}
            {Object.keys(results.categoryBreakdown).length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Category Breakdown</h3>
                <div className="space-y-3">
                  {Object.entries(results.categoryBreakdown).map(([category, amount]) => {
                    const categoryInfo = expenseCategories[category]
                    const percentage = results.percentageBreakdown[category]
                    const recommendation = results.budgetRecommendations[category]
                    const IconComponent = categoryInfo.icon
                    
                    return (
                      <div key={category} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <IconComponent className={'w-4 h-4 text-' + (categoryInfo.color) + '-600'} />
                            <span className="font-medium text-gray-700">{categoryInfo.label}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-gray-900">{formatCurrency(amount)}</div>
                            <div className="text-sm text-gray-500">{percentage.toFixed(1)}%</div>
                          </div>
                        </div>
                        
                        {/* Budget Status */}
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">
                            Recommended: {recommendation.recommended}%
                          </span>
                          <span className={'font-medium ' + (
                            recommendation.status === 'good' ? 'text-green-600' :
                            recommendation.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
                          )}>
                            {recommendation.status === 'good' ? '✅ Within budget' :
                             recommendation.status === 'warning' ? '⚠️ Slightly over' : '🚨 Over budget'}
                          </span>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={'h-2 rounded-full ' + (
                              recommendation.status === 'good' ? 'bg-green-500' :
                              recommendation.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                            )}
                            style={{ width: (Math.min(100, (percentage / recommendation.recommended) * 100)) + '%' }}
                          ></div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Budget Recommendations */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">💡 Budget Guidelines</h3>
              <div className="text-sm text-blue-700 space-y-1">
                <div><strong>50/30/20 Rule:</strong></div>
                <div>• 50% - Needs (rent, food, utilities)</div>
                <div>• 30% - Wants (entertainment, dining out)</div>
                <div>• 20% - Savings & debt repayment</div>
              </div>
            </div>

            {/* Savings Recommendation */}
            {(results.totalExpenses > 0 || (monthlyIncome && parseFloat(monthlyIncome) > 0)) && (
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">💰 Savings Target</h3>
                <div className="text-sm text-green-700">
                  {monthlyIncome && parseFloat(monthlyIncome) > 0 ? (
                    <>
                      <div>Based on your income of <CompactCurrencyDisplay value={parseFloat(monthlyIncome)} />:</div>
                      <div className="mt-1">
                        <strong>Recommended monthly savings: <CompactCurrencyDisplay value={results.incomeAnalysis.savingsRecommendation} /></strong>
                      </div>
                      <div className="text-xs mt-1">
                        (20% of income for emergency fund & goals)
                      </div>
                    </>
                  ) : (
                    <>
                      <div>Based on your expenses of <CompactCurrencyDisplay value={results.totalExpenses} />:</div>
                      <div className="mt-1">
                        <strong>Recommended monthly savings: <CompactCurrencyDisplay value={results.incomeAnalysis.savingsRecommendation} /></strong>
                      </div>
                      <div className="text-xs mt-1">
                        (25% of expenses for emergency fund & goals)
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Expense Optimization Tips */}
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-semibold text-yellow-800 mb-2">🎯 Optimization Tips</h3>
              <div className="text-sm text-yellow-700 space-y-1">
                <div>• Review subscriptions monthly</div>
                <div>• Cook at home to reduce food costs</div>
                <div>• Use public transport when possible</div>
                <div>• Compare utility providers annually</div>
                <div>• Set entertainment budget limits</div>
              </div>
            </div>
          </div>
        </motion.div>
      </MobileGrid>

      {/* PDF Export */}
      {results.totalExpenses > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <CommonPDFExport
            title="Monthly Expense Analysis Report"
            data={{
              'Monthly Income': monthlyIncome ? formatCurrency(parseFloat(monthlyIncome)) : 'Not specified',
              'Total Monthly Expenses': formatCurrency(results.totalExpenses),
              'Remaining Budget': monthlyIncome ? formatCurrency(results.incomeAnalysis.remainingBudget) : 'N/A',
              'Expense to Income Ratio': monthlyIncome ? `${results.incomeAnalysis.expenseRatio.toFixed(1)}%` : 'N/A',
              'Recommended Savings': formatCurrency(results.incomeAnalysis.savingsRecommendation),
              ...Object.fromEntries(
                Object.entries(results.categoryBreakdown).map(([category, amount]) => [
                  expenseCategories[category].label,
                  `${formatCurrency(amount)} (${results.percentageBreakdown[category].toFixed(1)}%)`
                ])
              )
            }}
            testId="pdf-export"
          />
        </motion.div>
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

export default MonthlyExpenseCalculator
