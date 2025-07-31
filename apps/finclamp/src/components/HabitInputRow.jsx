import React, { useState, useEffect } from 'react'
import { NumberInput, SelectInput } from './common/inputs'
import { useCurrency } from '../contexts/CurrencyContext'
import { Edit3, Check, X } from 'lucide-react'

/**
 * Specialized component for habit cost calculator input rows
 * Provides consistent styling for Type, Daily Quantity, and Cost per Unit inputs
 */
export default function HabitInputRow({
  habit,
  onUpdate,
  onRemove,
  habitTypes,
  showRemove = true,
  className = ""
}) {
  const { currentFormat } = useCurrency()
  const [isEditingName, setIsEditingName] = useState(false)
  const [tempName, setTempName] = useState(habit.name)

  const handleUpdate = (field, value) => {
    onUpdate(habit.id, field, value)
  }

  // Sync temp name when habit name changes externally
  useEffect(() => {
    setTempName(habit.name)
  }, [habit.name])

  const handleNameEdit = () => {
    setTempName(habit.name)
    setIsEditingName(true)
  }

  const handleNameSave = () => {
    handleUpdate('name', tempName)
    setIsEditingName(false)
  }

  const handleNameCancel = () => {
    setTempName(habit.name)
    setIsEditingName(false)
  }

  const handleNameKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleNameSave()
    } else if (e.key === 'Escape') {
      handleNameCancel()
    }
  }

  // Convert habitTypes object to options array for the dropdown
  const typeOptions = Object.entries(habitTypes).map(([key, type]) => {
    // Handle React component icons by rendering them
    const IconComponent = type.icon
    return {
      value: key,
      label: type.label,
      icon: IconComponent ? <IconComponent className="w-4 h-4" /> : null
    }
  })

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Habit Name and Remove Button */}
      <div className="flex items-center justify-between">
        <div className="flex-1 flex items-center gap-2">
          {isEditingName ? (
            // Edit Mode
            <div className="flex items-center gap-2 flex-1">
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onKeyDown={handleNameKeyDown}
                className="flex-1 font-medium bg-white border-2 border-orange-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 rounded-lg px-3 py-1 text-lg outline-none"
                placeholder="Enter habit name"
                autoFocus
              />
              <button
                onClick={handleNameSave}
                className="p-1 text-green-600 hover:text-green-700 hover:bg-green-50 rounded transition-colors"
                title="Save changes"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={handleNameCancel}
                className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded transition-colors"
                title="Cancel editing"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            // Display Mode
            <div
              className="flex items-center gap-2 flex-1 group cursor-pointer hover:bg-gray-50 rounded-lg px-2 py-1 transition-colors"
              onClick={handleNameEdit}
              title="Click to edit habit name"
            >
              <span className="font-medium text-lg text-gray-900 flex-1">
                {habit.name}
              </span>
              <Edit3 className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
            </div>
          )}
        </div>
        {showRemove && (
          <button
            onClick={() => onRemove(habit.id)}
            className="text-red-500 hover:text-red-700 text-sm font-medium px-3 py-1 rounded-lg hover:bg-red-50 transition-colors ml-2"
          >
            Remove
          </button>
        )}
      </div>

      {/* Input Grid with Consistent Styling */}
      <div className="grid grid-cols-3 gap-4">
        {/* Type Dropdown */}
        <SelectInput
          label="Type"
          value={habit.type}
          onChange={(value) => handleUpdate('type', value)}
          options={typeOptions}
          placeholder="Select type"
          className="w-full"
        />

        {/* Daily Quantity */}
        <div className="space-y-2 w-full">
          <label className="text-sm font-medium text-gray-700">Daily Quantity</label>
          <NumberInput
            value={habit.dailyQuantity}
            onChange={(value) => handleUpdate('dailyQuantity', value)}
            placeholder="0"
            min={0}
            max={1000}
            step={1}
            allowDecimals={true}
            allowNegative={false}
            className="w-full"
          />
        </div>

        {/* Cost per Unit */}
        <div className="space-y-2 w-full">
          <label className="text-sm font-medium text-gray-700">Cost per Unit</label>
          <NumberInput
            value={habit.unitCost}
            onChange={(value) => handleUpdate('unitCost', value)}
            placeholder="0"
            min={0}
            max={10000}
            step={1}
            allowDecimals={true}
            allowNegative={false}
            prefix={currentFormat.symbol}
            className="w-full"
          />
        </div>
      </div>
    </div>
  )
}
