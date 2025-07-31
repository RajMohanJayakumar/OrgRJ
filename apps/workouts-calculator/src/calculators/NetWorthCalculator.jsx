import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, DollarSign, PieChart } from 'lucide-react'
import { useCurrency } from '../contexts/CurrencyContext'
import { useViewMode } from '../contexts/ViewModeContext'
import useMobileResponsive from '../hooks/useMobileResponsive'
import { NumberInput } from '../components/common/inputs'
import CommonPDFExport from '../components/CommonPDFExport'
import CompactCurrencyDisplay from '../components/CompactCurrencyDisplay'
import UniversalRelatedCalculators from '../components/UniversalRelatedCalculators'
import MobileLayout, { MobileGrid } from '../components/MobileLayout'

const NetWorthCalculator = ({ categoryColor = 'green', currentCalculatorId, calculatorData, onCalculatorSelect }) => {
  const { formatCurrency, currentFormat } = useCurrency()
  const { responsive } = useMobileResponsive()
  
  // Assets
  const [assets, setAssets] = useState({
    cash: '',
    bankAccounts: '',
    investments: '',
    realEstate: '',
    vehicles: '',
    personalProperty: '',
    retirement: '',
    other: ''
  })

  // Liabilities
  const [liabilities, setLiabilities] = useState({
    homeLoan: '',
    carLoan: '',
    personalLoan: '',
    creditCards: '',
    studentLoan: '',
    other: ''
  })

  const [results, setResults] = useState({
    totalAssets: 0,
    totalLiabilities: 0,
    netWorth: 0,
    assetBreakdown: {},
    liabilityBreakdown: {},
    netWorthCategory: ''
  })

  const colorClasses = {
    green: {
      primary: 'bg-green-600',
      secondary: 'bg-green-100',
      text: 'text-green-800',
      border: 'border-green-300'
    },
    blue: {
      primary: 'bg-blue-600',
      secondary: 'bg-blue-100', 
      text: 'text-blue-800',
      border: 'border-blue-300'
    }
  }

  const colors = colorClasses[categoryColor] || colorClasses.green

  useEffect(() => {
    calculateNetWorth()
  }, [assets, liabilities])

  const calculateNetWorth = () => {
    // Calculate total assets
    const totalAssets = Object.values(assets).reduce((sum, value) => {
      return sum + (parseFloat(value) || 0)
    }, 0)

    // Calculate total liabilities
    const totalLiabilities = Object.values(liabilities).reduce((sum, value) => {
      return sum + (parseFloat(value) || 0)
    }, 0)

    // Calculate net worth
    const netWorth = totalAssets - totalLiabilities

    // Asset breakdown
    const assetBreakdown = {
      'Cash & Bank': (parseFloat(assets.cash) || 0) + (parseFloat(assets.bankAccounts) || 0),
      'Investments': parseFloat(assets.investments) || 0,
      'Real Estate': parseFloat(assets.realEstate) || 0,
      'Vehicles': parseFloat(assets.vehicles) || 0,
      'Personal Property': parseFloat(assets.personalProperty) || 0,
      'Retirement': parseFloat(assets.retirement) || 0,
      'Other': parseFloat(assets.other) || 0
    }

    // Liability breakdown
    const liabilityBreakdown = {
      'Home Loan': parseFloat(liabilities.homeLoan) || 0,
      'Car Loan': parseFloat(liabilities.carLoan) || 0,
      'Personal Loan': parseFloat(liabilities.personalLoan) || 0,
      'Credit Cards': parseFloat(liabilities.creditCards) || 0,
      'Student Loan': parseFloat(liabilities.studentLoan) || 0,
      'Other': parseFloat(liabilities.other) || 0
    }

    // Determine net worth category
    let netWorthCategory = ''
    if (netWorth < 0) {
      netWorthCategory = 'Negative Net Worth'
    } else if (netWorth < 100000) {
      netWorthCategory = 'Building Wealth'
    } else if (netWorth < 1000000) {
      netWorthCategory = 'Good Financial Health'
    } else if (netWorth < 10000000) {
      netWorthCategory = 'High Net Worth'
    } else {
      netWorthCategory = 'Ultra High Net Worth'
    }

    setResults({
      totalAssets,
      totalLiabilities,
      netWorth,
      assetBreakdown,
      liabilityBreakdown,
      netWorthCategory
    })
  }

  const handleAssetChange = (field, value) => {
    setAssets(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleLiabilityChange = (field, value) => {
    setLiabilities(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const assetFields = [
    { key: 'cash', label: 'Cash on Hand', icon: '💵' },
    { key: 'bankAccounts', label: 'Bank Accounts', icon: '🏦' },
    { key: 'investments', label: 'Investments (Stocks, Bonds, MF)', icon: '📈' },
    { key: 'realEstate', label: 'Real Estate', icon: '🏠' },
    { key: 'vehicles', label: 'Vehicles', icon: '🚗' },
    { key: 'personalProperty', label: 'Personal Property', icon: '🏺' },
    { key: 'retirement', label: 'Retirement Accounts (EPF, PPF, NPS)', icon: '🏛️' },
    { key: 'other', label: 'Other Assets', icon: '📦' }
  ]

  const liabilityFields = [
    { key: 'homeLoan', label: 'Home Loan', icon: '🏠' },
    { key: 'carLoan', label: 'Car Loan', icon: '🚗' },
    { key: 'personalLoan', label: 'Personal Loan', icon: '💳' },
    { key: 'creditCards', label: 'Credit Card Debt', icon: '💳' },
    { key: 'studentLoan', label: 'Student Loan', icon: '🎓' },
    { key: 'other', label: 'Other Debts', icon: '📋' }
  ]

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
          <PieChart className={(responsive.iconSize("lg")) + ' text-green-600'} />
          Net Worth Calculator
        </h2>
        <p className="text-gray-600">Calculate your total net worth by listing all your assets and liabilities</p>
      </motion.div>

      <MobileGrid columns={2} className={isMobile ? 'mt-4' : 'mt-6'}>
        {/* Assets Section */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className={(responsive.iconSize("md")) + ' text-green-600'} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Assets</h2>
          </div>

          <div className="space-y-4">
            {assetFields.map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <span>{field.icon}</span>
                  {field.label}
                </label>
                <NumberInput
                  value={assets[field.key]}
                  onChange={(value) => handleAssetChange(field.key, value)}
                  placeholder="Enter amount"
                  prefix={currentFormat.symbol}
                  step="1"
                  allowDecimals={true}
                  allowNegative={false}
                  className="w-full py-2 text-sm font-medium border border-gray-300 rounded-lg transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-green-800">Total Assets:</span>
              <span className="text-xl font-bold text-green-600">
                <CompactCurrencyDisplay value={results.totalAssets} />
              </span>
            </div>
          </div>
        </motion.div>

        {/* Liabilities Section */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-red-100 rounded-lg">
              <TrendingDown className={(responsive.iconSize("md")) + ' text-red-600'} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Liabilities</h2>
          </div>

          <div className="space-y-4">
            {liabilityFields.map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <span>{field.icon}</span>
                  {field.label}
                </label>
                <NumberInput
                  value={liabilities[field.key]}
                  onChange={(value) => handleLiabilityChange(field.key, value)}
                  placeholder="Enter amount"
                  prefix={currentFormat.symbol}
                  step="1"
                  allowDecimals={true}
                  allowNegative={false}
                  className="w-full py-2 text-sm font-medium border border-gray-300 rounded-lg transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-red-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-red-800">Total Liabilities:</span>
              <span className="text-xl font-bold text-red-600">
                <CompactCurrencyDisplay value={results.totalLiabilities} />
              </span>
            </div>
          </div>
        </motion.div>
      </MobileGrid>

      {/* Results Section */}
      <motion.div 
        className="bg-white rounded-xl shadow-lg p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="text-center mb-6">
          <h2 className={(responsive.typography.heading) + ' font-bold text-gray-900 mb-2'}>Your Net Worth</h2>
          <div className={'text-4xl font-bold ' + (results.netWorth >= 0 ? 'text-green-600' : 'text-red-600')}>
            <CompactCurrencyDisplay value={results.netWorth} />
          </div>
          <p className="text-gray-600 mt-2">{results.netWorthCategory}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <TrendingUp className={(responsive.iconSize("lg")) + ' text-green-600 mx-auto mb-2'} />
            <div className="text-lg font-semibold text-green-800">Total Assets</div>
            <div className="text-xl font-bold text-green-600"><CompactCurrencyDisplay value={results.totalAssets} /></div>
          </div>

          <div className="text-center p-4 bg-red-50 rounded-lg">
            <TrendingDown className={(responsive.iconSize("lg")) + ' text-red-600 mx-auto mb-2'} />
            <div className="text-lg font-semibold text-red-800">Total Liabilities</div>
            <div className="text-xl font-bold text-red-600"><CompactCurrencyDisplay value={results.totalLiabilities} /></div>
          </div>

          <div className={'text-center p-4 rounded-lg ' + (results.netWorth >= 0 ? 'bg-green-50' : 'bg-red-50')}>
            <DollarSign className={responsive.iconSize("lg") + ' mx-auto mb-2 ' + (results.netWorth >= 0 ? 'text-green-600' : 'text-red-600')} />
            <div className={'text-lg font-semibold ' + (results.netWorth >= 0 ? 'text-green-800' : 'text-red-800')}>Net Worth</div>
            <div className={'text-xl font-bold ' + (results.netWorth >= 0 ? 'text-green-600' : 'text-red-600')}>
              <CompactCurrencyDisplay value={results.netWorth} />
            </div>
          </div>
        </div>


      </motion.div>

      {/* Universal Related Calculators */}
      <UniversalRelatedCalculators
        currentCalculatorId={currentCalculatorId}
        calculatorData={calculatorData}
        onCalculatorSelect={onCalculatorSelect}
      />


    </MobileLayout>
  )
}

export default NetWorthCalculator
