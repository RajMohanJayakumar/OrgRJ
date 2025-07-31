import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { PieChart, TrendingUp, TrendingDown, Plus, Minus, Calculator } from 'lucide-react'
import { useCurrency } from '../contexts/CurrencyContext'
import { useViewMode } from '../contexts/ViewModeContext'
import useMobileResponsive from '../hooks/useMobileResponsive'
import { NumberInput } from '../components/common/inputs'
import CommonPDFExport from '../components/CommonPDFExport'
import UniversalRelatedCalculators from '../components/UniversalRelatedCalculators'
import MobileLayout, { MobileGrid } from '../components/MobileLayout'

const BudgetPlannerCalculator = ({ categoryColor = 'indigo', currentCalculatorId, calculatorData, onCalculatorSelect }) => {
  const { formatCurrency, currentFormat } = useCurrency()
  const { isMobile } = useViewMode()
  const { responsive } = useMobileResponsive()
  
  const [income, setIncome] = useState([
    { id: 1, source: 'Salary', amount: '' },
    { id: 2, source: 'Freelance', amount: '' }
  ])

  const [expenses, setExpenses] = useState([
    { id: 1, category: 'Rent', amount: '' },
    { id: 2, category: 'Food', amount: '' },
    { id: 3, category: 'Transportation', amount: '' },
    { id: 4, category: 'Utilities', amount: '' },
    { id: 5, category: 'Entertainment', amount: '' }
  ])

  const [results, setResults] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    netIncome: 0,
    savingsRate: 0,
    budgetStatus: 'balanced',
    expenseBreakdown: {},
    incomeBreakdown: {}
  })

  useEffect(() => {
    calculateBudget()
  }, [income, expenses])

  const calculateBudget = () => {
    const totalIncome = income.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0)
    const totalExpenses = expenses.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0)
    const netIncome = totalIncome - totalExpenses
    const savingsRate = totalIncome > 0 ? (netIncome / totalIncome) * 100 : 0

    let budgetStatus = 'balanced'
    if (netIncome > 0) budgetStatus = 'surplus'
    else if (netIncome < 0) budgetStatus = 'deficit'

    // Calculate breakdowns
    const expenseBreakdown = {}
    expenses.forEach(expense => {
      if (expense.amount && parseFloat(expense.amount) > 0) {
        expenseBreakdown[expense.category] = parseFloat(expense.amount)
      }
    })

    const incomeBreakdown = {}
    income.forEach(incomeItem => {
      if (incomeItem.amount && parseFloat(incomeItem.amount) > 0) {
        incomeBreakdown[incomeItem.source] = parseFloat(incomeItem.amount)
      }
    })

    setResults({
      totalIncome,
      totalExpenses,
      netIncome,
      savingsRate,
      budgetStatus,
      expenseBreakdown,
      incomeBreakdown
    })
  }

  const addIncomeSource = () => {
    const newId = Math.max(...income.map(i => i.id)) + 1
    setIncome([...income, { id: newId, source: '', amount: '' }])
  }

  const removeIncomeSource = (id) => {
    if (income.length > 1) {
      setIncome(income.filter(item => item.id !== id))
    }
  }

  const updateIncome = (id, field, value) => {
    setIncome(income.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ))
  }

  const addExpenseCategory = () => {
    const newId = Math.max(...expenses.map(e => e.id)) + 1
    setExpenses([...expenses, { id: newId, category: '', amount: '' }])
  }

  const removeExpenseCategory = (id) => {
    if (expenses.length > 1) {
      setExpenses(expenses.filter(item => item.id !== id))
    }
  }

  const updateExpense = (id, field, value) => {
    setExpenses(expenses.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ))
  }

  const gridClass = responsive.grid(2)

  return (
    <MobileLayout className={'' + (isMobile ? 'space-y-4' : 'space-y-8') + ' calculator-main-container'}>
      {/* Header */}
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className={responsive.typography.title + ' font-bold text-gray-900 mb-4 flex items-center justify-center gap-3'}>
          <PieChart className={responsive.iconSize("lg") + ' text-indigo-600'} />
          Budget Planner Calculator
        </h1>
        <p className={responsive.typography.body + ' text-gray-600 max-w-2xl mx-auto'}>
          Plan and track your monthly budget with detailed income and expense analysis
        </p>
      </motion.div>

      <div className={'grid ' + gridClass}>
        {/* Income Section */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2 className={responsive.typography.heading + ' font-bold text-gray-900 mb-4 flex items-center gap-2'}>
            <TrendingUp className={responsive.iconSize("md") + ' text-green-600'} />
            Income Sources
          </h2>
          
          <div className="space-y-4">
            {income.map((item, index) => (
              <div key={item.id} className="flex gap-3 items-center">
                <input
                  type="text"
                  placeholder="Income source"
                  value={item.source}
                  onChange={(e) => updateIncome(item.id, 'source', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <NumberInput
                  value={item.amount}
                  onChange={(value) => updateIncome(item.id, 'amount', value)}
                  placeholder="Amount"
                  className="w-32"
                />
                {income.length > 1 && (
                  <button
                    onClick={() => removeIncomeSource(item.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            
            <button
              onClick={addIncomeSource}
              className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-indigo-400 hover:text-indigo-600 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Income Source
            </button>
          </div>
        </motion.div>

        {/* Expenses Section */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className={responsive.typography.heading + ' font-bold text-gray-900 mb-4 flex items-center gap-2'}>
            <TrendingDown className={responsive.iconSize("md") + ' text-red-600'} />
            Expense Categories
          </h2>
          
          <div className="space-y-4">
            {expenses.map((item, index) => (
              <div key={item.id} className="flex gap-3 items-center">
                <input
                  type="text"
                  placeholder="Expense category"
                  value={item.category}
                  onChange={(e) => updateExpense(item.id, 'category', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <NumberInput
                  value={item.amount}
                  onChange={(value) => updateExpense(item.id, 'amount', value)}
                  placeholder="Amount"
                  className="w-32"
                />
                {expenses.length > 1 && (
                  <button
                    onClick={() => removeExpenseCategory(item.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            
            <button
              onClick={addExpenseCategory}
              className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-indigo-400 hover:text-indigo-600 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Expense Category
            </button>
          </div>
        </motion.div>
      </div>

      {/* Results Section */}
      {(results.totalIncome > 0 || results.totalExpenses > 0) && (
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className={responsive.typography.heading + ' font-bold text-gray-900 mb-6 flex items-center gap-2'}>
            <Calculator className={responsive.iconSize("md") + ' text-indigo-600'} />
            Budget Summary
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Total Income */}
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-sm font-medium text-gray-600 mb-1">Total Income</div>
              <div className={responsive.typography.heading + ' font-bold text-green-600'}>
                {formatCurrency(results.totalIncome || 0)}
              </div>
            </div>

            {/* Total Expenses */}
            <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="text-sm font-medium text-gray-600 mb-1">Total Expenses</div>
              <div className={responsive.typography.heading + ' font-bold text-red-600'}>
                {formatCurrency(results.totalExpenses || 0)}
              </div>
            </div>

            {/* Net Income */}
            <div className={'p-4 rounded-lg border-2 ' + (
              results.budgetStatus === 'surplus' 
                ? 'bg-green-50 border-green-200' 
                : results.budgetStatus === 'deficit'
                ? 'bg-red-50 border-red-200'
                : 'bg-gray-50 border-gray-200'
            )}>
              <div className="text-center">
                <div className="text-sm font-medium text-gray-600 mb-1">Net Income</div>
                <div className={responsive.typography.heading + ' font-bold ' + (
                  results.budgetStatus === 'surplus'
                    ? 'text-green-600'
                    : results.budgetStatus === 'deficit'
                    ? 'text-red-600'
                    : 'text-gray-600'
                )}>
                  {results.netIncome >= 0 ? '+' : ''}{formatCurrency(results.netIncome || 0)}
                </div>
                <div className={'text-sm ' + (
                  results.budgetStatus === 'surplus' 
                    ? 'text-green-500' 
                    : results.budgetStatus === 'deficit'
                    ? 'text-red-500'
                    : 'text-gray-500'
                )}>
                  {results.budgetStatus === 'surplus' ? 'Budget Surplus' : 
                   results.budgetStatus === 'deficit' ? 'Budget Deficit' : 'Balanced Budget'}
                </div>
              </div>
            </div>
          </div>

          {/* Additional Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm font-medium text-gray-600 mb-1">Savings Rate</div>
              <div className={responsive.typography.body + ' font-bold text-gray-900'}>
                {results.savingsRate.toFixed(1)}%
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm font-medium text-gray-600 mb-1">Expense Ratio</div>
              <div className={responsive.typography.body + ' font-bold text-gray-900'}>
                {results.totalIncome > 0 ? ((results.totalExpenses / results.totalIncome) * 100).toFixed(1) : 0}%
              </div>
            </div>
          </div>

          {/* Breakdown */}
          {Object.keys(results.expenseBreakdown).length > 0 && (
            <div className="mt-6">
              <h3 className={responsive.typography.subheading + ' font-semibold text-gray-900 mb-3'}>
                Expense Breakdown
              </h3>
              <div className="space-y-2">
                {Object.entries(results.expenseBreakdown).map(([category, amount]) => (
                  <div key={category} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm font-medium text-gray-700">{category}</span>
                    <span className="text-sm font-bold text-gray-900">{formatCurrency(amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* PDF Export */}
      {(results.totalIncome > 0 || results.totalExpenses > 0) && (
        <CommonPDFExport
          calculatorName="Budget Planner"
          inputs={{
            'Total Income Sources': income.filter(i => i.amount).length.toString(),
            'Total Expense Categories': expenses.filter(e => e.amount).length.toString(),
            'Planning Period': 'Monthly'
          }}
          results={{
            'Total Income': formatCurrency(results.totalIncome || 0),
            'Total Expenses': formatCurrency(results.totalExpenses || 0),
            'Net Income': formatCurrency(results.netIncome || 0),
            'Savings Rate': results.savingsRate.toFixed(1) + '%',
            'Budget Status': results.budgetStatus === 'surplus' ? 'Surplus' : 
                           results.budgetStatus === 'deficit' ? 'Deficit' : 'Balanced',
            'Expense Ratio': (results.totalIncome > 0 ? ((results.totalExpenses / results.totalIncome) * 100).toFixed(1) : '0') + '%'
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

export default BudgetPlannerCalculator
