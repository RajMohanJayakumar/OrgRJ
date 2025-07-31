import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Smartphone, Plus, Minus, Calendar, TrendingUp } from 'lucide-react'
import { useCurrency } from '../contexts/CurrencyContext'
import { useViewMode } from '../contexts/ViewModeContext'
import useMobileResponsive from '../hooks/useMobileResponsive'
import { NumberInput } from '../components/common/inputs'
import CompactCurrencyDisplay from '../components/CompactCurrencyDisplay'
import CommonPDFExport from '../components/CommonPDFExport'
import UniversalRelatedCalculators from '../components/UniversalRelatedCalculators'
import MobileLayout, { MobileGrid } from '../components/MobileLayout'

const SubscriptionCalculator = ({ categoryColor = 'purple', currentCalculatorId, calculatorData, onCalculatorSelect }) => {
  const { formatCurrency, currentFormat } = useCurrency()
  const { isMobile } = useViewMode()
  const { responsive } = useMobileResponsive()
  
  const [subscriptions, setSubscriptions] = useState([
    { id: 1, name: 'Netflix', cost: '', billing: 'monthly', category: 'streaming' },
    { id: 2, name: 'Spotify', cost: '', billing: 'monthly', category: 'music' }
  ])

  const [results, setResults] = useState({
    totalMonthly: 0,
    totalYearly: 0,
    categoryBreakdown: {},
    billingBreakdown: {},
    averagePerSubscription: 0
  })

  const billingCycles = {
    weekly: { multiplier: 52, label: 'Weekly' },
    monthly: { multiplier: 12, label: 'Monthly' },
    quarterly: { multiplier: 4, label: 'Quarterly' },
    yearly: { multiplier: 1, label: 'Yearly' }
  }

  const categories = {
    streaming: { label: 'Streaming', icon: '📺', color: 'red' },
    music: { label: 'Music', icon: '🎵', color: 'green' },
    productivity: { label: 'Productivity', icon: '💼', color: 'blue' },
    fitness: { label: 'Fitness', icon: '💪', color: 'orange' },
    news: { label: 'News', icon: '📰', color: 'gray' },
    gaming: { label: 'Gaming', icon: '🎮', color: 'purple' },
    cloud: { label: 'Cloud Storage', icon: '☁️', color: 'cyan' },
    other: { label: 'Other', icon: '📱', color: 'indigo' }
  }

  const popularSubscriptions = [
    { name: 'Netflix', category: 'streaming', suggestedCost: '15' },
    { name: 'Amazon Prime', category: 'streaming', suggestedCost: '12' },
    { name: 'Spotify', category: 'music', suggestedCost: '10' },
    { name: 'Apple Music', category: 'music', suggestedCost: '10' },
    { name: 'Disney+', category: 'streaming', suggestedCost: '8' },
    { name: 'YouTube Premium', category: 'streaming', suggestedCost: '12' },
    { name: 'Microsoft 365', category: 'productivity', suggestedCost: '7' },
    { name: 'Adobe Creative', category: 'productivity', suggestedCost: '53' },
    { name: 'iCloud Storage', category: 'cloud', suggestedCost: '3' },
    { name: 'Google Drive', category: 'cloud', suggestedCost: '2' }
  ]

  useEffect(() => {
    calculateSubscriptions()
  }, [subscriptions])

  const calculateSubscriptions = () => {
    let totalYearly = 0
    const categoryBreakdown = {}
    const billingBreakdown = {}

    subscriptions.forEach(sub => {
      const cost = parseFloat(sub.cost) || 0
      const yearlyAmount = cost * billingCycles[sub.billing].multiplier

      totalYearly += yearlyAmount

      // Category breakdown
      if (!categoryBreakdown[sub.category]) {
        categoryBreakdown[sub.category] = 0
      }
      categoryBreakdown[sub.category] += yearlyAmount

      // Billing breakdown
      if (!billingBreakdown[sub.billing]) {
        billingBreakdown[sub.billing] = 0
      }
      billingBreakdown[sub.billing] += yearlyAmount
    })

    const totalMonthly = totalYearly / 12
    const averagePerSubscription = subscriptions.length > 0 ? totalMonthly / subscriptions.length : 0

    setResults({
      totalMonthly,
      totalYearly,
      categoryBreakdown,
      billingBreakdown,
      averagePerSubscription
    })
  }

  const addSubscription = () => {
    const newId = Math.max(...subscriptions.map(s => s.id)) + 1
    setSubscriptions([...subscriptions, {
      id: newId,
      name: '',
      cost: '',
      billing: 'monthly',
      category: 'other'
    }])
  }

  const removeSubscription = (id) => {
    if (subscriptions.length > 1) {
      setSubscriptions(subscriptions.filter(s => s.id !== id))
    }
  }

  const updateSubscription = (id, field, value) => {
    setSubscriptions(subscriptions.map(s => 
      s.id === id ? { ...s, [field]: value } : s
    ))
  }

  const addPopularSubscription = (popular) => {
    const newId = Math.max(...subscriptions.map(s => s.id)) + 1
    setSubscriptions([...subscriptions, {
      id: newId,
      name: popular.name,
      cost: popular.suggestedCost,
      billing: 'monthly',
      category: popular.category
    }])
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
          <Smartphone className={(responsive.iconSize("lg")) + ' text-purple-600'} />
          Subscription Cost Tracker
        </h2>
        <p className="text-gray-600">Track total monthly/yearly cost of all your streaming & app subscriptions</p>
      </motion.div>

      <MobileGrid columns={3} className={isMobile ? 'mt-4' : 'mt-6'}>
        {/* Subscriptions List */}
        <motion.div 
          className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Your Subscriptions</h2>
            <button
              onClick={addSubscription}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Subscription
            </button>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {subscriptions.map((subscription) => (
              <div key={subscription.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Service Name
                    </label>
                    <input
                      type="text"
                      value={subscription.name}
                      onChange={(e) => updateSubscription(subscription.id, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                      placeholder="Netflix"
                    />
                  </div>

                  {/* Cost */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Cost
                    </label>
                    <div className="relative">
                      <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">
                        {currentFormat.symbol}
                      </span>
                      <NumberInput
                      value={subscription.cost}
                      onChange={(value) => updateSubscription(subscription.id, 'cost', value)}
                      placeholder="Enter value"
                      step="1"
                      allowDecimals={true}
                      allowNegative={false}
                      className="w-full py-2 text-sm font-medium border border-gray-300 rounded-lg transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    </div>
                  </div>

                  {/* Billing Cycle */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Billing
                    </label>
                    <select
                      value={subscription.billing}
                      onChange={(e) => updateSubscription(subscription.id, 'billing', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    >
                      {Object.entries(billingCycles).map(([key, cycle]) => (
                        <option key={key} value={key}>{cycle.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Category */}
                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Category
                      </label>
                      <select
                        value={subscription.category}
                        onChange={(e) => updateSubscription(subscription.id, 'category', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                      >
                        {Object.entries(categories).map(([key, cat]) => (
                          <option key={key} value={key}>
                            {cat.icon} {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    {subscriptions.length > 1 && (
                      <button
                        onClick={() => removeSubscription(subscription.id)}
                        className="p-2 text-red-500 hover:text-red-700"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Monthly equivalent display */}
                {subscription.cost && (
                  <div className="mt-2 text-xs text-gray-500">
                    Monthly equivalent: {formatCurrency((parseFloat(subscription.cost) || 0) * billingCycles[subscription.billing].multiplier / 12)}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Popular Subscriptions */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Add Popular Services</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {popularSubscriptions.map((popular, index) => (
                <button
                  key={index}
                  onClick={() => addPopularSubscription(popular)}
                  className="p-2 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-center"
                >
                  <div className="font-medium">{popular.name}</div>
                  <div className="text-gray-500">{formatCurrency(popular.suggestedCost)}/mo</div>
                </button>
              ))}
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
            <h2 className="text-xl font-bold text-gray-900">Cost Summary</h2>
          </div>

          <div className="space-y-4">
            {/* Total Costs */}
            <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
              <div className="text-center">
                <div className="text-sm text-purple-700 mb-1">Monthly Total</div>
                <div className={(responsive.typography.heading) + ' font-bold text-purple-600'}>
                  <CompactCurrencyDisplay value={results.totalMonthly} />
                </div>
              </div>
            </div>

            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="flex justify-between">
                <span className="text-blue-700 font-medium">Yearly Total:</span>
                <span className="font-bold text-blue-600">
                  <CompactCurrencyDisplay value={results.totalYearly} />
                </span>
              </div>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between">
                <span className="text-gray-700">Average per service:</span>
                <span className="font-medium">
                  <CompactCurrencyDisplay value={results.averagePerSubscription} />
                </span>
              </div>
            </div>

            {/* Category Breakdown */}
            {Object.keys(results.categoryBreakdown).length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold text-gray-900 mb-3">By Category</h3>
                <div className="space-y-2">
                  {Object.entries(results.categoryBreakdown).map(([category, amount]) => {
                    const categoryInfo = categories[category]
                    const percentage = results.totalYearly > 0 ? (amount / results.totalYearly) * 100 : 0
                    return (
                      <div key={category} className="flex justify-between items-center p-2 bg-gray-50 rounded text-sm">
                        <span className="flex items-center gap-2">
                          <span>{categoryInfo.icon}</span>
                          <span>{categoryInfo.label}</span>
                        </span>
                        <div className="text-right">
                          <div className="font-medium"><CompactCurrencyDisplay value={amount / 12} />/mo</div>
                          <div className="text-xs text-gray-500">{percentage.toFixed(1)}%</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Billing Breakdown */}
            {Object.keys(results.billingBreakdown).length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold text-gray-900 mb-3">By Billing Cycle</h3>
                <div className="space-y-2">
                  {Object.entries(results.billingBreakdown).map(([billing, amount]) => {
                    const billingInfo = billingCycles[billing]
                    return (
                      <div key={billing} className="flex justify-between items-center p-2 bg-gray-50 rounded text-sm">
                        <span>{billingInfo.label}</span>
                        <span className="font-medium"><CompactCurrencyDisplay value={amount / 12} />/mo</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Savings Tips */}
            <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-semibold text-yellow-800 mb-2">💡 Savings Tips</h3>
              <div className="text-sm text-yellow-700 space-y-1">
                <div>• Review subscriptions monthly</div>
                <div>• Cancel unused services</div>
                <div>• Look for annual discounts</div>
                <div>• Share family plans when possible</div>
                <div>• Use free alternatives for rarely used services</div>
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

export default SubscriptionCalculator
