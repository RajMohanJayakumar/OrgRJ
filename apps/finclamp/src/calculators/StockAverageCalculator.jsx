import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Plus, Minus, BarChart3, Calculator } from 'lucide-react'
import { useCurrency } from '../contexts/CurrencyContext'
import { useViewMode } from '../contexts/ViewModeContext'
import useMobileResponsive from '../hooks/useMobileResponsive'
import { NumberInput } from '../components/common/inputs'
import CommonPDFExport from '../components/CommonPDFExport'
import CompactCurrencyDisplay from '../components/CompactCurrencyDisplay'
import ModernInputSection from '../components/ModernInputSection'
import MobileLayout from '../components/MobileLayout'
import UniversalRelatedCalculators from '../components/UniversalRelatedCalculators'

const StockAverageCalculator = ({ categoryColor = 'purple', currentCalculatorId, calculatorData, onCalculatorSelect }) => {
  const { formatCurrency } = useCurrency()
  const { isMobile } = useViewMode()
  const { responsive } = useMobileResponsive()

  const [purchases, setPurchases] = useState([
    { id: 1, quantity: '', price: '' },
    { id: 2, quantity: '', price: '' }
  ])

  const [results, setResults] = useState({
    totalQuantity: 0,
    totalInvestment: 0,
    averagePrice: 0,
    currentPrice: '',
    currentValue: 0,
    profitLoss: 0,
    profitLossPercent: 0
  })

  const [currentPrice, setCurrentPrice] = useState('')

  useEffect(() => {
    calculateAverage()
  }, [purchases, currentPrice])

  const calculateAverage = () => {
    let totalQuantity = 0
    let totalInvestment = 0

    purchases.forEach(purchase => {
      const qty = parseFloat(purchase.quantity) || 0
      const price = parseFloat(purchase.price) || 0
      totalQuantity += qty
      totalInvestment += qty * price
    })

    const averagePrice = totalQuantity > 0 ? totalInvestment / totalQuantity : 0
    const currentPriceValue = parseFloat(currentPrice) || 0
    const currentValue = totalQuantity * currentPriceValue
    const profitLoss = currentValue - totalInvestment
    const profitLossPercent = totalInvestment > 0 ? (profitLoss / totalInvestment) * 100 : 0

    setResults({
      totalQuantity,
      totalInvestment,
      averagePrice,
      currentPrice: currentPriceValue,
      currentValue,
      profitLoss,
      profitLossPercent
    })
  }

  const addPurchase = () => {
    const newId = Math.max(...purchases.map(p => p.id)) + 1
    setPurchases([...purchases, { id: newId, quantity: '', price: '' }])
  }

  const removePurchase = (id) => {
    if (purchases.length > 1) {
      setPurchases(purchases.filter(p => p.id !== id))
    }
  }

  const updatePurchase = (id, field, value) => {
    setPurchases(purchases.map(p =>
      p.id === id ? { ...p, [field]: value } : p
    ))
  }

  const resetCalculator = () => {
    setPurchases([
      { id: 1, quantity: '', price: '' },
      { id: 2, quantity: '', price: '' }
    ])
    setCurrentPrice('')
    setResults({
      totalQuantity: 0,
      totalInvestment: 0,
      averagePrice: 0,
      currentPrice: '',
      currentValue: 0,
      profitLoss: 0,
      profitLossPercent: 0
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
          <TrendingUp className={(isMobile ? responsive.iconSize("md") : responsive.iconSize("lg")) + ' text-purple-600'} />
          Stock Average Calculator
        </h2>
        <p className="text-gray-600">Calculate average stock price over multiple purchases and track profit/loss</p>
      </motion.div>

      <div className={'grid ' + (gridClass)}>
        {/* Input Section */}
        <ModernInputSection
          title="Stock Purchases"
          icon={BarChart3}
          onReset={resetCalculator}
          categoryColor="purple"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Purchase Entries</h3>
            <button
              onClick={addPurchase}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Purchase
            </button>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {purchases.map((purchase, index) => (
              <div key={purchase.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-gray-700">Purchase #{index + 1}</span>
                  {purchases.length > 1 && (
                    <button
                      onClick={() => removePurchase(purchase.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity
                    </label>
                    <NumberInput
                      value={purchase.quantity}
                      onChange={(value) => updatePurchase(purchase.id, 'quantity', value)}
                      placeholder="Enter quantity"
                      step="1"
                      min="0"
                      allowDecimals={false}
                      allowNegative={false}
                      className="w-full py-2 text-sm font-medium border-2 rounded-xl transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price per Share
                    </label>
                    <NumberInput
                      value={purchase.price}
                      onChange={(value) => updatePurchase(purchase.id, 'price', value)}
                      placeholder="Enter price"
                      prefix={formatCurrency(0).replace(/[\d.,]/g, '')}
                      step="0.01"
                      min="0"
                      allowDecimals={true}
                      allowNegative={false}
                      className="w-full py-2 text-sm font-medium border-2 rounded-xl transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                {purchase.quantity && purchase.price && (
                  <div className="mt-2 text-sm text-gray-600">
                    Investment: {formatCurrency((parseFloat(purchase.quantity) || 0) * (parseFloat(purchase.price) || 0))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Current Price */}
          <div className="mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Market Price (Optional)
              </label>
              <NumberInput
                value={currentPrice}
                onChange={setCurrentPrice}
                placeholder="Enter current price"
                prefix={formatCurrency(0).replace(/[\d.,]/g, '')}
                step="0.01"
                min="0"
                allowDecimals={true}
                allowNegative={false}
                className="w-full py-2 text-sm font-medium border-2 rounded-xl transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
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
            <h2 className="text-xl font-bold text-gray-900">Portfolio Summary</h2>
          </div>

          <div className="space-y-4">
            {/* Total Quantity */}
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">Total Shares:</span>
              <span className="font-bold text-gray-900">
                {results.totalQuantity.toLocaleString()}
              </span>
            </div>

            {/* Total Investment */}
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="font-medium text-blue-700">Total Investment:</span>
              <span className="font-bold text-blue-600">
                <CompactCurrencyDisplay value={results.totalInvestment} />
              </span>
            </div>

            {/* Average Price */}
            <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
              <span className="text-lg font-bold text-purple-700">Average Price:</span>
              <span className="text-xl font-bold text-purple-600">
                <CompactCurrencyDisplay value={results.averagePrice} />
              </span>
            </div>

            {/* Current Value & P&L */}
            {currentPrice && (
              <>
                <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                  <span className="font-medium text-yellow-700">Current Value:</span>
                  <span className="font-bold text-yellow-600">
                    <CompactCurrencyDisplay value={results.currentValue} />
                  </span>
                </div>

                <div className={'flex justify-between items-center p-4 rounded-lg border-2 ' + (
                  results.profitLoss >= 0 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
                )}>
                  <span className={'text-lg font-bold ' + (
                    results.profitLoss >= 0 ? 'text-green-700' : 'text-red-700'
                  )}>
                    {results.profitLoss >= 0 ? 'Profit:' : 'Loss:'}
                  </span>
                  <div className="text-right">
                    <div className={'text-xl font-bold ' + (
                      results.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'
                    )}>
                      {results.profitLoss >= 0 ? '+' : ''}
                      <CompactCurrencyDisplay value={Math.abs(results.profitLoss)} />
                    </div>
                    <div className={'text-sm ' + (
                      results.profitLoss >= 0 ? 'text-green-500' : 'text-red-500'
                    )}>
                      ({results.profitLoss >= 0 ? '+' : ''}{results.profitLossPercent.toFixed(2)}%)
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Purchase History */}
          {purchases.some(p => p.quantity && p.price) && (
            <div className="mt-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Purchase History</h3>
              <div className="space-y-2">
                {purchases.map((purchase, index) => {
                  if (!purchase.quantity || !purchase.price) return null
                  const investment = (parseFloat(purchase.quantity) || 0) * (parseFloat(purchase.price) || 0)
                  return (
                    <div key={purchase.id} className="flex justify-between items-center p-2 bg-gray-50 rounded text-sm">
                      <span>#{index + 1}: {purchase.quantity} shares @ {formatCurrency(purchase.price)}</span>
                      <span className="font-medium">{formatCurrency(investment)}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
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

export default StockAverageCalculator
