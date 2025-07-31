import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useCurrency } from '../contexts/CurrencyContext'
import { useViewMode } from '../contexts/ViewModeContext'
import { useCalculatorState } from '../hooks/useCalculatorState'
import useMobileResponsive from '../hooks/useMobileResponsive'
import { NumberInput } from '../components/common/inputs'
import ModernInputSection from '../components/ModernInputSection'
import ModernResultsSection, { ModernResultGrid, ModernSummaryCard } from '../components/ModernResultsSection'
import CommonPDFExport from '../components/CommonPDFExport'
import RelatedCalculators from '../components/RelatedCalculators'
import MobileLayout, { MobileGrid } from '../components/MobileLayout'
import { ChefHat, Plus, Trash2, Calculator, ShoppingCart, Utensils, Download, Edit3 } from 'lucide-react'
import { generateVendorQuotationPDF, printPDF } from '../utils/pdfGenerator'

// Custom PDF Export Component for Vendor Quotation
const VendorPDFExport = ({ quotationDetails, items, results, formatCurrency }) => {
  const generatePDF = () => {
    const htmlContent = generateVendorQuotationPDF(quotationDetails, items, results, formatCurrency)
    printPDF(htmlContent)



  }

  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Download className={(responsive.iconSize("md")) + ' text-orange-600'} />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Export Quotation</h2>
        </div>
      </div>
      
      <div className="text-center">
        <button
          onClick={generatePDF}
          className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
        >
          Generate PDF Quotation
        </button>
        <p className="text-sm text-gray-600 mt-2">
          Creates a professional PDF quotation ready for clients
        </p>
      </div>
    </motion.div>
  )
}

export default function VendorQuotationCalculator({
  onAddToComparison,
  categoryColor = 'orange',
  currentCalculatorId,
  calculatorData,
  onCalculatorSelect
}) {
  const { formatCurrency } = useCurrency()
  const { isMobile } = useViewMode()
  const { responsive } = useMobileResponsive()

  // Default items for any vendor
  const defaultItems = [
    { id: 1, name: 'Product 1', price: '', quantity: '1', unit: 'pieces', category: 'General' },
    { id: 2, name: 'Product 2', price: '', quantity: '1', unit: 'pieces', category: 'General' },
  ]

  const [items, setItems] = useState(defaultItems)
  const [customCategories, setCustomCategories] = useState([])
  const [customUnits, setCustomUnits] = useState([])
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newUnitName, setNewUnitName] = useState('')
  const [showAddCategory, setShowAddCategory] = useState({})
  const [showAddUnit, setShowAddUnit] = useState({})
  const [quotationDetails, setQuotationDetails] = useState({
    vendorName: '',
    customerName: '',
    quotationDate: new Date().toISOString().split('T')[0],
    validUntil: '',
    notes: '',
    isDraft: false,
    taxRate: '0',
    taxInclusive: false,
    // Company Information
    companyDescription: '',
    includeAddress: false,
    address: '',
    email: '',
    phoneNumbers: [''] // Array to support multiple phone numbers
  })

  const [results, setResults] = useState(null)

  // Share calculation function
  const shareCalculation = () => {
    if (!results) return

    const shareData = {
      title: 'Vendor Quotation Calculator Results',
      text: `Quotation Total: ${formatCurrency(results.totalAmount || 0)} (${results.itemCount} items)`,
      url: window.location.href
    }

    if (navigator.share) {
      navigator.share(shareData)
    } else {
      navigator.clipboard.writeText(($1) + ' - (shareData.url) + ')
    }
  }

  // Add to comparison function
  const handleAddToComparison = () => {
    if (onAddToComparison && results) {
      onAddToComparison({
        id: 'vendor-quotation',
        name: 'Vendor Quotation',
        results: {
          'Total Amount': formatCurrency(results.totalAmount || 0),
          'Number of Items': results.itemCount,
          'Subtotal': formatCurrency(results.subtotal || 0),
          'Tax Amount': formatCurrency(results.taxAmount || 0)
        }
      })
    }
  }

  // Calculate totals
  useEffect(() => {
    const validItems = items.filter(item => {
      const price = parseFloat(item.price)
      const quantity = parseFloat(item.quantity)
      return !isNaN(price) && price > 0 && !isNaN(quantity) && quantity > 0
    })

    if (validItems.length === 0) {
      setResults(null)
      return
    }

    const subtotal = validItems.reduce((sum, item) => {
      const price = parseFloat(item.price) || 0
      const quantity = parseFloat(item.quantity) || 0
      return sum + (price * quantity)
    }, 0)

    // Calculate tax
    const taxRate = parseFloat(quotationDetails.taxRate) || 0
    const taxAmount = quotationDetails.taxInclusive
      ? (subtotal * taxRate) / (100 + taxRate)
      : (subtotal * taxRate) / 100

    const totalAmount = quotationDetails.taxInclusive
      ? subtotal
      : subtotal + taxAmount

    const totalQuantity = validItems.reduce((sum, item) => sum + parseFloat(item.quantity), 0)
    const averagePrice = subtotal / validItems.length

    // Group by category
    const categoryTotals = {}
    validItems.forEach(item => {
      const price = parseFloat(item.price) || 0
      const quantity = parseFloat(item.quantity) || 0
      const lineTotal = price * quantity

      if (!categoryTotals[item.category]) {
        categoryTotals[item.category] = { count: 0, total: 0, quantity: 0 }
      }
      categoryTotals[item.category].count += 1
      categoryTotals[item.category].total += lineTotal
      categoryTotals[item.category].quantity += quantity
    })

    setResults({
      subtotal,
      taxAmount,
      totalAmount,
      totalQuantity,
      averagePrice,
      itemCount: validItems.length,
      categoryTotals,
      validItems
    })
  }, [items, quotationDetails.taxRate, quotationDetails.taxInclusive])

  const addItem = () => {
    const newId = Math.max(...items.map(item => item.id), 0) + 1
    setItems([...items, {
      id: newId,
      name: '',
      price: '',
      quantity: '1',
      unit: 'pieces',
      category: 'General'
    }])
  }

  const addCustomCategory = (itemId) => {
    if (newCategoryName.trim()) {
      setCustomCategories([...customCategories, newCategoryName.trim()])
      updateItem(itemId, 'category', newCategoryName.trim())
      setNewCategoryName('')
      setShowAddCategory({})
    }
  }

  const addCustomUnit = (itemId) => {
    if (newUnitName.trim()) {
      setCustomUnits([...customUnits, newUnitName.trim()])
      updateItem(itemId, 'unit', newUnitName.trim())
      setNewUnitName('')
      setShowAddUnit({})
    }
  }

  const updateItem = (id, field, value) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ))
  }

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id))
  }

  const resetCalculator = () => {
    setItems(defaultItems)
    setCustomCategories([])
    setCustomUnits([])
    setNewCategoryName('')
    setNewUnitName('')
    setShowAddCategory({})
    setShowAddUnit({})
    setQuotationDetails({
      vendorName: '',
      customerName: '',
      quotationDate: new Date().toISOString().split('T')[0],
      validUntil: '',
      notes: '',
      isDraft: false,
      taxRate: '0',
      taxInclusive: false,
      // Company Information
      companyDescription: '',
      includeAddress: false,
      address: '',
      email: '',
      phoneNumbers: ['']
    })
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }

  const baseCategories = ['General', 'Products', 'Services', 'Materials', 'Equipment', 'Supplies', 'Other']
  const allCategories = [...baseCategories, ...customCategories]
  const baseUnits = ['pieces', 'units', 'hours', 'kg', 'g', 'L', 'ml', 'dozen', 'packets', 'boxes']
  const allUnits = [...baseUnits, ...customUnits]

  return (
    <MobileLayout className={'' + (isMobile ? 'space-y-4' : 'space-y-8') + ' calculator-main-container'}>
      {/* Header */}
      <motion.div className={'text-center ' + (isMobile ? 'mb-4' : 'mb-6') + ''} {...fadeInUp}>
        <h2 className={(isMobile ? 'text-2xl' : 'text-3xl') + ' font-bold text-gray-900 mb-2 flex items-center justify-center gap-3'}>
          <Calculator className={(isMobile ? 'w-6 h-6' : 'w-8 h-8') + ' text-orange-600'} />
          Vendor Quotation Calculator
        </h2>
        <p className={isMobile ? 'text-sm text-gray-600' : 'text-base text-gray-600'}>Create professional quotations for any products or services</p>
      </motion.div>

      <MobileGrid columns={2} className={isMobile ? 'mt-4' : 'mt-6'}>
        {/* Input Section */}
        <ModernInputSection
          title="Quotation Details"
          icon={Utensils}
          onReset={resetCalculator}
          categoryColor="orange"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vendor Name
              </label>
              <input
                type="text"
                value={quotationDetails.vendorName}
                onChange={(e) => setQuotationDetails(prev => ({ ...prev, vendorName: e.target.value }))}
                className="w-full py-2 px-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Your business name"
              />
            </div>

            {/* Company Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Description (Optional)
              </label>
              <input
                type="text"
                value={quotationDetails.companyDescription}
                onChange={(e) => setQuotationDetails(prev => ({ ...prev, companyDescription: e.target.value }))}
                className="w-full py-2 px-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="e.g., Professional Services"
              />
              <p className="text-xs text-gray-500 mt-1">
                If empty, will show "Professional Services"
              </p>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email (Optional)
              </label>
              <input
                type="email"
                value={quotationDetails.email}
                onChange={(e) => setQuotationDetails(prev => ({ ...prev, email: e.target.value }))}
                className="w-full py-2 px-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="contact@yourcompany.com"
              />
            </div>

            {/* Phone Numbers */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Numbers (Optional)
              </label>
              {quotationDetails.phoneNumbers.map((phone, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      const newPhones = [...quotationDetails.phoneNumbers]
                      newPhones[index] = e.target.value
                      setQuotationDetails(prev => ({ ...prev, phoneNumbers: newPhones }))
                    }}
                    className="flex-1 py-2 px-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder={`Phone ${index + 1}`}
                  />
                  {quotationDetails.phoneNumbers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const newPhones = quotationDetails.phoneNumbers.filter((_, i) => i !== index)
                        setQuotationDetails(prev => ({ ...prev, phoneNumbers: newPhones }))
                      }}
                      className="px-3 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  setQuotationDetails(prev => ({
                    ...prev,
                    phoneNumbers: [...prev.phoneNumbers, '']
                  }))
                }}
                className="text-sm text-orange-600 hover:text-orange-700 font-medium"
              >
                + Add Another Phone Number
              </button>
            </div>

            {/* Include Address Checkbox */}
            <div>
              <div className="flex items-center mb-3">
                <input
                  type="checkbox"
                  id="includeAddress"
                  checked={quotationDetails.includeAddress}
                  onChange={(e) => setQuotationDetails(prev => ({ ...prev, includeAddress: e.target.checked }))}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <label htmlFor="includeAddress" className="ml-2 text-sm font-medium text-gray-700">
                  Include Company Address
                </label>
              </div>

              {quotationDetails.includeAddress && (
                <textarea
                  value={quotationDetails.address}
                  onChange={(e) => setQuotationDetails(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full py-2 px-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter your company address"
                  rows="3"
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer Name
              </label>
              <input
                type="text"
                value={quotationDetails.customerName}
                onChange={(e) => setQuotationDetails(prev => ({ ...prev, customerName: e.target.value }))}
                className="w-full py-2 px-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Customer name"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quotation Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={quotationDetails.quotationDate}
                    onChange={(e) => setQuotationDetails(prev => ({ ...prev, quotationDate: e.target.value }))}
                    className="w-full py-3 px-4 h-12 text-base font-medium border-2 border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-white hover:border-orange-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valid Until
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={quotationDetails.validUntil}
                    onChange={(e) => setQuotationDetails(prev => ({ ...prev, validUntil: e.target.value }))}
                    placeholder="dd/mm/yyyy"
                    className="w-full py-3 px-4 h-12 text-base font-medium border-2 border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-white hover:border-orange-300"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tax Rate (%)
                </label>
                <NumberInput
                  value={quotationDetails.taxRate}
                  onChange={(value) => setQuotationDetails(prev => ({ ...prev, taxRate: value }))}
                  placeholder="0"
                  step="0.1"
                  allowDecimals={true}
                  allowNegative={false}
                  showControls={false}
                  className="w-full py-2 px-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div className="flex flex-col justify-end space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="taxInclusive"
                    checked={quotationDetails.taxInclusive}
                    onChange={(e) => setQuotationDetails(prev => ({ ...prev, taxInclusive: e.target.checked }))}
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                  <label htmlFor="taxInclusive" className="ml-2 text-sm text-gray-700">
                    Tax Inclusive Pricing
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isDraft"
                    checked={quotationDetails.isDraft}
                    onChange={(e) => setQuotationDetails(prev => ({ ...prev, isDraft: e.target.checked }))}
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                  <label htmlFor="isDraft" className="ml-2 text-sm text-gray-700">
                    Draft Quotation (Prices may change)
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={quotationDetails.notes}
                onChange={(e) => setQuotationDetails(prev => ({ ...prev, notes: e.target.value }))}
                className="w-full py-2 px-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Additional notes or terms"
                rows="3"
              />
            </div>
          </div>
        </ModernInputSection>

        {/* Results Section */}
        <ModernResultsSection
          title="Quotation Summary"
          results={results}
          onShare={shareCalculation}
          onAddToComparison={handleAddToComparison}
          categoryColor="orange"
          emptyStateMessage="Add item prices to see quotation summary"
        >
          {/* Main Result */}
          <ModernSummaryCard
            title={quotationDetails.isDraft ? "Draft Total Amount" : "Total Quotation Amount"}
            items={[
              { value: results?.totalAmount, type: 'currency' }
            ]}
            categoryColor="orange"
            size="large"
            centered={true}
            hideLabels={true}
            className="mb-6"
          />

          {/* Key Metrics */}
          <ModernResultGrid
            results={[
              { label: 'Subtotal', value: results?.subtotal, type: 'currency' },
              { label: `Tax (${quotationDetails.taxRate}%)`, value: results?.taxAmount, type: 'currency' },
              { label: 'Number of Items', value: results?.itemCount, type: 'number' },
              { label: 'Total Quantity', value: results?.totalQuantity?.toFixed(2), type: 'text' }
            ]}
            categoryColor="orange"
          />

          {quotationDetails.isDraft && (
            <div className="mt-4 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
              <div className="flex items-center gap-2">
                <span className="text-yellow-600 font-semibold">⚠️ Draft Quotation</span>
              </div>
              <p className="text-sm text-yellow-700 mt-1">
                This is a draft quotation. Final prices may change based on market conditions and availability.
              </p>
            </div>
          )}
        </ModernResultsSection>
      </MobileGrid>

      {/* Items Section */}
      <motion.div
        className="bg-white rounded-xl shadow-lg p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <ShoppingCart className={(responsive.iconSize("md")) + ' text-orange-600'} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Items & Prices</h2>
          </div>
          <button
            onClick={addItem}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Item
          </button>
        </div>

        <div className="space-y-6">
          {items.map((item, index) => (
            <div key={item.id} className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-r from-white to-orange-50 border-2 border-orange-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {/* Header Row with Item Name and Remove */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={(responsive.iconSize("lg")) + ' bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm'}>
                      {index + 1}
                    </div>
                    <div className="flex-1 relative group">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                          className="text-lg font-semibold bg-transparent border-none outline-none focus:bg-white focus:border-2 focus:border-orange-300 rounded-lg px-3 py-2 transition-all w-full cursor-text"
                          placeholder="Enter item name..."
                        />
                        <Edit3 className="w-4 h-4 text-orange-500 opacity-60 group-hover:opacity-100 transition-opacity cursor-pointer" />
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200 hover:border-red-300 font-medium"
                    disabled={items.length <= 1}
                  >
                    Remove
                  </button>
                </div>

                {/* Details Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Quantity */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-orange-700 uppercase tracking-wide">
                      Quantity
                    </label>
                    <NumberInput
                      value={item.quantity}
                      onChange={(value) => updateItem(item.id, 'quantity', value)}
                      placeholder="1"
                      step="1"
                      allowDecimals={false}
                      allowNegative={false}
                      showControls={true}
                      className="border-2 border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-white"
                    />
                  </div>

                  {/* Unit */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-orange-700 uppercase tracking-wide">
                      Unit
                    </label>
                    <select
                      value={item.unit}
                      onChange={(e) => {
                        if (e.target.value === 'ADD_NEW_UNIT') {
                          setShowAddUnit({ ...showAddUnit, [item.id]: true })
                        } else {
                          updateItem(item.id, 'unit', e.target.value)
                        }
                      }}
                      className="w-full py-3 px-4 h-12 border-2 border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-sm bg-white font-medium"
                    >
                      {allUnits.map(unit => (
                        <option key={unit} value={unit}>{unit}</option>
                      ))}
                      <option value="ADD_NEW_UNIT">+ Add Unit</option>
                    </select>
                  </div>

                  {/* Price per Unit */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-orange-700 uppercase tracking-wide">
                      Price per Unit
                    </label>
                    <NumberInput
                      value={item.price}
                      onChange={(value) => updateItem(item.id, 'price', value)}
                      placeholder="0"
                      prefix={formatCurrency(0).replace(/[\d.,]/g, '')}
                      step="10"
                      allowDecimals={true}
                      allowNegative={false}
                      showControls={true}
                      className="border-2 border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-white"
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-orange-700 uppercase tracking-wide">
                      Category
                    </label>
                    <select
                      value={item.category}
                      onChange={(e) => {
                        if (e.target.value === 'ADD_NEW') {
                          setShowAddCategory({ ...showAddCategory, [item.id]: true })
                        } else {
                          updateItem(item.id, 'category', e.target.value)
                        }
                      }}
                      className="w-full py-3 px-4 h-12 border-2 border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-white font-medium"
                    >
                      {allCategories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                      <option value="ADD_NEW">+ Add New Category</option>
                    </select>
                  </div>
                </div>

                {/* Total Amount - Separate row for better visibility */}
                <div className="mt-4 p-4 bg-gradient-to-r from-orange-50 to-orange-100 border-2 border-orange-200 rounded-xl">
                  <div className="text-center">
                    <div className="text-xs font-semibold text-orange-700 uppercase tracking-wide mb-2">
                      Total Amount
                    </div>
                    <div className="text-2xl font-bold text-orange-800">
                      {formatCurrency((parseFloat(item.price) || 0) * (parseFloat(item.quantity) || 0))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Add New Category Input */}
              {showAddCategory[item.id] && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-200 shadow-xl"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                      <Plus className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-blue-800">Create New Category</h4>
                  </div>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="Enter new category name..."
                      className="flex-1 py-4 px-5 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-3 focus:ring-blue-300 focus:border-blue-400 transition-all bg-white shadow-inner text-lg"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          addCustomCategory(item.id)
                        }
                      }}
                    />
                    <button
                      onClick={() => addCustomCategory(item.id)}
                      className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 font-semibold shadow-lg"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => setShowAddCategory({ ...showAddCategory, [item.id]: false })}
                      className="px-6 py-4 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Add New Unit Input */}
              {showAddUnit[item.id] && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-4 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-2xl p-6 border-2 border-green-200 shadow-xl"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                      <Plus className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-green-800">Create New Unit</h4>
                  </div>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={newUnitName}
                      onChange={(e) => setNewUnitName(e.target.value)}
                      placeholder="Enter new unit (e.g., boxes, bags, cartons)..."
                      className="flex-1 py-4 px-5 border-2 border-green-200 rounded-xl focus:outline-none focus:ring-3 focus:ring-green-300 focus:border-green-400 transition-all bg-white shadow-inner text-lg"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          addCustomUnit(item.id)
                        }
                      }}
                    />
                    <button
                      onClick={() => addCustomUnit(item.id)}
                      className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 font-semibold shadow-lg"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => setShowAddUnit({ ...showAddUnit, [item.id]: false })}
                      className="px-6 py-4 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* PDF Export */}
      {results && (
        <VendorPDFExport
          quotationDetails={quotationDetails}
          items={results.validItems}
          results={results}
          formatCurrency={formatCurrency}
        />
      )}

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
