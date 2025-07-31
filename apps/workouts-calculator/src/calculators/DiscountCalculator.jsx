import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Tag, ShoppingCart, Calculator } from 'lucide-react'
import { NumberInput } from '../components/common/inputs'
import CommonPDFExport from '../components/CommonPDFExport'
import { useCurrency } from '../contexts/CurrencyContext'
import { useViewMode } from '../contexts/ViewModeContext'
import useMobileResponsive from '../hooks/useMobileResponsive'
import CompactCurrencyDisplay from '../components/CompactCurrencyDisplay'
import UniversalRelatedCalculators from '../components/UniversalRelatedCalculators'
import MobileLayout, { MobileGrid } from '../components/MobileLayout'

const DiscountCalculator = ({ categoryColor = 'blue', currentCalculatorId, calculatorData, onCalculatorSelect }) => {
  const { formatCurrency } = useCurrency()
  const { isMobile } = useViewMode()
  const { responsive } = useMobileResponsive()

  const [inputs, setInputs] = useState({
    originalPrice: '',
    discountPercent: '',
    additionalDiscount: '',
    taxPercent: ''
  })

  const [results, setResults] = useState({
    discountAmount: 0,
    additionalDiscountAmount: 0,
    totalDiscount: 0,
    priceAfterDiscount: 0,
    taxAmount: 0,
    finalPrice: 0,
    totalSavings: 0,
    savingsPercent: 0
  })



  useEffect(() => {
    calculateDiscount()
  }, [inputs])

  const calculateDiscount = () => {
    const originalPrice = parseFloat(inputs.originalPrice) || 0
    const discountPercent = parseFloat(inputs.discountPercent) || 0
    const additionalDiscount = parseFloat(inputs.additionalDiscount) || 0
    const taxPercent = parseFloat(inputs.taxPercent) || 0

    if (originalPrice <= 0) {
      setResults({
        discountAmount: 0,
        additionalDiscountAmount: 0,
        totalDiscount: 0,
        priceAfterDiscount: 0,
        taxAmount: 0,
        finalPrice: 0,
        totalSavings: 0,
        savingsPercent: 0
      })
      return
    }

    // Calculate primary discount
    const discountAmount = (originalPrice * discountPercent) / 100
    const priceAfterFirstDiscount = originalPrice - discountAmount

    // Calculate additional discount (applied on already discounted price)
    const additionalDiscountAmount = (priceAfterFirstDiscount * additionalDiscount) / 100
    const priceAfterAllDiscounts = priceAfterFirstDiscount - additionalDiscountAmount

    // Calculate tax on final discounted price
    const taxAmount = (priceAfterAllDiscounts * taxPercent) / 100
    const finalPrice = priceAfterAllDiscounts + taxAmount

    // Calculate total savings
    const totalDiscount = discountAmount + additionalDiscountAmount
    const totalSavings = originalPrice - priceAfterAllDiscounts
    const savingsPercent = (totalSavings / originalPrice) * 100

    setResults({
      discountAmount,
      additionalDiscountAmount,
      totalDiscount,
      priceAfterDiscount: priceAfterAllDiscounts,
      taxAmount,
      finalPrice,
      totalSavings,
      savingsPercent
    })
  }

  const handleInputChange = (field, value) => {
    setInputs(prev => ({
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
      <motion.div className={'text-center ' + (isMobile ? 'mb-4' : 'mb-6') + ''} {...fadeInUp}>
        <h2 className={(isMobile ? 'text-2xl' : 'text-3xl') + ' font-bold text-gray-900 mb-2 flex items-center justify-center gap-3'}>
          <Tag className={(isMobile ? 'w-6 h-6' : 'w-8 h-8') + ' text-blue-600'} />
          Discount Calculator
        </h2>
        <p className={isMobile ? 'text-sm text-gray-600' : 'text-base text-gray-600'}>Calculate final price after applying percentage discounts and taxes</p>
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
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calculator className={(responsive.iconSize("md")) + ' text-blue-600'} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Price Details</h2>
          </div>

          <div className="space-y-6">
            {/* Original Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Original Price
              </label>
              <NumberInput
                value={inputs.originalPrice}
                onChange={(value) => handleInputChange('originalPrice', value)}
                placeholder="1000"
                prefix={formatCurrency(0).replace(/[\d.,]/g, '')}
                step="1"
                min="0"
                allowDecimals={true}
                allowNegative={false}
                className="w-full py-2 text-sm font-medium border-2 rounded-xl transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Discount Percentage */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount Percentage
              </label>
              <NumberInput
                value={inputs.discountPercent}
                onChange={(value) => handleInputChange('discountPercent', value)}
                placeholder="Enter years"
                suffix="%"
                step="0.5"
                min="0"
                max="100"
                allowDecimals={true}
                allowNegative={false}
                className="w-full py-2 text-sm font-medium border-2 rounded-xl transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Additional Discount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Discount (Optional)
              </label>
              <NumberInput
                value={inputs.additionalDiscount}
                onChange={(value) => handleInputChange('additionalDiscount', value)}
                placeholder="Enter value"
                suffix="%"
                step="0.5"
                min="0"
                max="100"
                allowDecimals={true}
                allowNegative={false}
                className="w-full py-2 text-sm font-medium border-2 rounded-xl transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Tax Percentage */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tax Percentage (Optional)
              </label>
              <NumberInput
                value={inputs.taxPercent}
                onChange={(value) => handleInputChange('taxPercent', value)}
                placeholder="18"
                suffix="%"
                step="0.5"
                min="0"
                max="100"
                allowDecimals={true}
                allowNegative={false}
                className="w-full py-2 text-sm font-medium border-2 rounded-xl transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
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
              <ShoppingCart className={(responsive.iconSize("md")) + ' text-green-600'} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Price Breakdown</h2>
          </div>

          <div className="space-y-4">
            {/* Original Price */}
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">Original Price:</span>
              <span className="font-bold text-gray-900">
                <CompactCurrencyDisplay value={inputs.originalPrice || 0} />
              </span>
            </div>

            {/* Primary Discount */}
            {results.discountAmount > 0 && (
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <span className="font-medium text-red-700">
                  Discount ({inputs.discountPercent}%):
                </span>
                <span className="font-bold text-red-600">
                  -<CompactCurrencyDisplay value={results.discountAmount} />
                </span>
              </div>
            )}

            {/* Additional Discount */}
            {results.additionalDiscountAmount > 0 && (
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <span className="font-medium text-red-700">
                  Additional Discount ({inputs.additionalDiscount}%):
                </span>
                <span className="font-bold text-red-600">
                  -<CompactCurrencyDisplay value={results.additionalDiscountAmount} />
                </span>
              </div>
            )}

            {/* Price After Discounts */}
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="font-medium text-blue-700">Price After Discounts:</span>
              <span className="font-bold text-blue-600">
                <CompactCurrencyDisplay value={results.priceAfterDiscount} />
              </span>
            </div>

            {/* Tax */}
            {results.taxAmount > 0 && (
              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                <span className="font-medium text-yellow-700">
                  Tax ({inputs.taxPercent}%):
                </span>
                <span className="font-bold text-yellow-600">
                  +<CompactCurrencyDisplay value={results.taxAmount} />
                </span>
              </div>
            )}

            {/* Final Price */}
            <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg border-2 border-green-200">
              <span className="text-lg font-bold text-green-700">Final Price:</span>
              <span className="text-xl font-bold text-green-600">
                <CompactCurrencyDisplay value={results.finalPrice} />
              </span>
            </div>

            {/* Total Savings */}
            {results.totalSavings > 0 && (
              <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                <span className="text-lg font-bold text-purple-700">Total Savings:</span>
                <div className="text-right">
                  <div className="text-xl font-bold text-purple-600">
                    <CompactCurrencyDisplay value={results.totalSavings} />
                  </div>
                  <div className="text-sm text-purple-500">
                    ({results.savingsPercent.toFixed(1)}% off)
                  </div>
                </div>
              </div>
            )}
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

export default DiscountCalculator
