import React, { useState } from 'react'
import { NumberInput, SelectInput } from '../common/inputs'
import { Calculator, DollarSign, Percent, Calendar } from 'lucide-react'

/**
 * Example component demonstrating how to use UnifiedInput
 * across different calculator scenarios
 */
export default function UnifiedInputExamples() {
  const [values, setValues] = useState({
    amount: '1000',
    rate: '5',
    years: '10',
    type: 'fixed',
    category: 'investment'
  })

  const handleChange = (field, value) => {
    setValues(prev => ({ ...prev, [field]: value }))
  }

  // Example dropdown options
  const investmentTypes = [
    { value: 'fixed', label: 'Fixed Deposit', icon: '🏦' },
    { value: 'mutual', label: 'Mutual Fund', icon: '📈' },
    { value: 'stocks', label: 'Stocks', icon: '📊' },
    { value: 'bonds', label: 'Bonds', icon: '📋' }
  ]

  const categories = [
    { value: 'investment', label: 'Investment', icon: '💰' },
    { value: 'loan', label: 'Loan', icon: '🏠' },
    { value: 'insurance', label: 'Insurance', icon: '🛡️' },
    { value: 'tax', label: 'Tax Planning', icon: '📊' }
  ]

  // Example with long text to demonstrate truncation
  const longTextOptions = [
    { value: 'short', label: 'Coffee', icon: '☕' },
    { value: 'medium', label: 'Energy Drinks', icon: '⚡' },
    { value: 'long', label: 'Premium Artisanal Coffee Beverages', icon: '☕' },
    { value: 'extra_long', label: 'Expensive Gourmet Restaurant Dining Experiences', icon: '🍽️' }
  ]

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          UnifiedInput Component Examples
        </h1>
        <p className="text-gray-600">
          Consistent styling for all calculator inputs
        </p>
      </div>

      {/* Number Inputs Section */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Calculator className="w-5 h-5" />
          Number Inputs
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Basic Number Input */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <DollarSign className="w-4 h-4" />
              Investment Amount
            </label>
            <NumberInput
              value={values.amount}
              onChange={(value) => handleChange('amount', value)}
              placeholder="0"
              min={0}
              max={10000000}
              step={100}
              allowDecimals={true}
              allowNegative={false}
              prefix="$"
            />
          </div>

          {/* Percentage Input */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Percent className="w-4 h-4" />
              Interest Rate
            </label>
            <NumberInput
              value={values.rate}
              onChange={(value) => handleChange('rate', value)}
              placeholder="0"
              min={0}
              max={50}
              step={0.1}
              allowDecimals={true}
              allowNegative={false}
              suffix="%"
            />
          </div>

          {/* Time Period Input */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Calendar className="w-4 h-4" />
              Time Period
            </label>
            <NumberInput
              value={values.years}
              onChange={(value) => handleChange('years', value)}
              placeholder="0"
              min={1}
              max={50}
              step={1}
              allowDecimals={false}
              allowNegative={false}
              suffix="years"
            />
          </div>
        </div>
      </div>

      {/* Dropdown Inputs Section */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Calculator className="w-5 h-5" />
          Dropdown Inputs
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Investment Type Dropdown */}
          <SelectInput
            label="Investment Type"
            value={values.type}
            onChange={(value) => handleChange('type', value)}
            options={investmentTypes}
            placeholder="Select investment type"
            icon={<DollarSign className="w-4 h-4" />}
          />

          {/* Category Dropdown */}
          <SelectInput
            label="Category"
            value={values.category}
            onChange={(value) => handleChange('category', value)}
            options={categories}
            placeholder="Select category"
            icon={<Calculator className="w-4 h-4" />}
          />
        </div>
      </div>

      {/* Mixed Layout Example */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Mixed Layout Example (Like Habit Calculator)
        </h2>

        <div className="grid grid-cols-3 gap-4">
          <SelectInput
            label="Type"
            value={values.type}
            onChange={(value) => handleChange('type', value)}
            options={investmentTypes}
            placeholder="Select type"
          />

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Daily Quantity</label>
            <NumberInput
              value="2"
              onChange={() => {}}
              placeholder="0"
              min={0}
              max={100}
              step={1}
              allowDecimals={true}
              allowNegative={false}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Cost per Unit</label>
            <NumberInput
              value="150"
              onChange={() => {}}
              placeholder="0"
              min={0}
              max={1000}
              step={1}
              allowDecimals={true}
              allowNegative={false}
              prefix="$"
            />
          </div>
        </div>
      </div>

      {/* Text Truncation Example */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Text Truncation Example
        </h2>
        <p className="text-gray-600 mb-4">
          Long text is automatically truncated with tooltips. Hover over the dropdown to see the full text.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SelectInput
            label="Short Labels (Recommended)"
            value="short"
            onChange={() => {}}
            options={[
              { value: 'short', label: 'Coffee', icon: '☕' },
              { value: 'medium', label: 'Snacks', icon: '🍿' },
              { value: 'fast_food', label: 'Fast Food', icon: '🍔' }
            ]}
          />

          <SelectInput
            label="Long Labels (Auto-truncated)"
            value="long"
            onChange={() => {}}
            options={longTextOptions}
            placeholder="Select a very long placeholder text that will be truncated"
          />
        </div>
      </div>

      {/* Usage Guidelines */}
      <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
        <h2 className="text-xl font-semibold text-blue-900 mb-4">
          Usage Guidelines
        </h2>
        
        <div className="space-y-3 text-blue-800">
          <div>
            <strong>Consistent Styling:</strong> All inputs now use the same border-2, rounded-xl, and focus states
          </div>
          <div>
            <strong>Number Inputs:</strong> Use type="number" with showControls={true} for increment/decrement buttons
          </div>
          <div>
            <strong>Dropdowns:</strong> Use type="select" with options array for consistent dropdown styling
          </div>
          <div>
            <strong>Prefixes/Suffixes:</strong> Use prefix for currency symbols, suffix for units like %, years, etc.
          </div>
          <div>
            <strong>Icons:</strong> Add icons to labels for better visual hierarchy
          </div>
          <div>
            <strong>Text Truncation:</strong> Long text is automatically truncated with tooltips to prevent layout issues
          </div>
          <div>
            <strong>Accessibility:</strong> Proper label associations and keyboard navigation built-in
          </div>
        </div>
      </div>

      {/* Current Values Display */}
      <div className="bg-gray-50 p-6 rounded-xl">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Current Values:</h3>
        <pre className="text-sm text-gray-700 bg-white p-3 rounded border">
          {JSON.stringify(values, null, 2)}
        </pre>
      </div>
    </div>
  )
}
