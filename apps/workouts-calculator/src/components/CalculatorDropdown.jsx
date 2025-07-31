import React from 'react'
import CustomDropdown from './CustomDropdown'
import { getDropdownConfig, getFocusColor } from './DropdownConfigs'

/**
 * Simplified dropdown component for calculators
 * Uses predefined configurations for common dropdown types
 */
const CalculatorDropdown = ({
  configKey,
  value,
  onChange,
  category = "general",
  customConfig = null,
  ...props
}) => {
  // Get predefined config or use custom config
  const config = customConfig || getDropdownConfig(configKey, getFocusColor(category))

  if (!config) {
    console.error(`Invalid dropdown config key: ${configKey}`)
    return null
  }

  return (
    <CustomDropdown
      label={config.label}
      value={value}
      onChange={onChange}
      options={config.options}
      icon={config.icon}
      focusColor={config.focusColor || getFocusColor(category)}
      {...props}
    />
  )
}

export default CalculatorDropdown
