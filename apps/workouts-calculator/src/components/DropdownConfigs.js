// Common dropdown configurations for reuse across calculators

export const DROPDOWN_CONFIGS = {
  // Calculation Types
  CALCULATION_TYPES: {
    FD: {
      label: "Calculation Type",
      icon: "⚙️",
      options: [
        { value: 'maturity', label: 'Calculate Maturity Amount', icon: '💰' },
        { value: 'reverse-maturity', label: 'Calculate Principal Required', icon: '🔄' }
      ]
    },
    RD: {
      label: "Calculation Type", 
      icon: "🧮",
      options: [
        { value: 'maturity', label: 'Calculate Maturity Amount', icon: '💰' },
        { value: 'reverse-maturity', label: 'Calculate Required Monthly Deposit', icon: '🔄' }
      ]
    },
    CAGR: {
      label: "Calculation Type",
      icon: "🔢", 
      options: [
        { value: 'cagr', label: 'CAGR (Compound Annual Growth Rate)', icon: '📈' },
        { value: 'roi', label: 'ROI (Return on Investment)', icon: '💹' }
      ]
    }
  },

  // Compounding Frequencies
  COMPOUNDING_FREQUENCY: {
    label: "Compounding Frequency",
    icon: "🔄",
    options: [
      { value: '1', label: 'Annually', icon: '📅' },
      { value: '2', label: 'Semi-annually', icon: '📆' },
      { value: '4', label: 'Quarterly', icon: '🗓️' },
      { value: '12', label: 'Monthly', icon: '📊' },
      { value: '365', label: 'Daily', icon: '⏰' }
    ]
  },

  // Countries
  COUNTRIES: {
    label: "Country",
    icon: "🌍",
    options: [
      { value: 'india', label: 'India (FY 2023-24)', icon: '🇮🇳' },
      { value: 'usa', label: 'United States (Tax Year 2023)', icon: '🇺🇸' },
      { value: 'uk', label: 'United Kingdom (Tax Year 2023-24)', icon: '🇬🇧' },
      { value: 'canada', label: 'Canada (Tax Year 2023)', icon: '🇨🇦' },
      { value: 'australia', label: 'Australia (FY 2023-24)', icon: '🇦🇺' }
    ]
  },

  // Tax Regimes for India
  TAX_REGIME_INDIA: {
    label: "Tax Regime",
    icon: "⚖️",
    options: [
      { value: 'old', label: 'Old Tax Regime', icon: '📊' },
      { value: 'new', label: 'New Tax Regime', icon: '✨' }
    ]
  },

  // Tax Regimes for USA
  TAX_REGIME_USA: {
    label: "Filing Status",
    icon: "⚖️",
    options: [
      { value: 'single', label: 'Single', icon: '👤' },
      { value: 'married_joint', label: 'Married Filing Jointly', icon: '👫' },
      { value: 'married_separate', label: 'Married Filing Separately', icon: '👥' },
      { value: 'head_household', label: 'Head of Household', icon: '🏠' }
    ]
  },

  // Tax Regimes for UK
  TAX_REGIME_UK: {
    label: "Tax Code",
    icon: "⚖️",
    options: [
      { value: 'standard', label: 'Standard Rate (1257L)', icon: '📊' },
      { value: 'higher', label: 'Higher Rate Taxpayer', icon: '📈' },
      { value: 'additional', label: 'Additional Rate Taxpayer', icon: '📊' }
    ]
  },

  // Tax Regimes for Canada
  TAX_REGIME_CANADA: {
    label: "Province/Territory",
    icon: "⚖️",
    options: [
      { value: 'ontario', label: 'Ontario', icon: '🍁' },
      { value: 'quebec', label: 'Quebec', icon: '🍁' },
      { value: 'british_columbia', label: 'British Columbia', icon: '🍁' },
      { value: 'alberta', label: 'Alberta', icon: '🍁' },
      { value: 'federal_only', label: 'Federal Only', icon: '🇨🇦' }
    ]
  },

  // Tax Regimes for Australia
  TAX_REGIME_AUSTRALIA: {
    label: "Residency Status",
    icon: "⚖️",
    options: [
      { value: 'resident', label: 'Australian Resident', icon: '🇦🇺' },
      { value: 'non_resident', label: 'Non-Resident', icon: '🌏' },
      { value: 'working_holiday', label: 'Working Holiday Maker', icon: '🎒' }
    ]
  },

  // Organization Types
  ORGANIZATION_TYPE: {
    label: "Organization Type",
    icon: "🏢",
    options: [
      { value: 'covered', label: 'Covered under Gratuity Act', icon: '✅' },
      { value: 'non-covered', label: 'Not covered under Gratuity Act', icon: '❌' }
    ]
  },

  // Step-up Types for SIP
  STEP_UP_TYPE: {
    label: "Annual Step-up Type",
    icon: "📈",
    options: [
      { value: 'percentage', label: 'Percentage (%)', icon: '📊' },
      { value: 'amount', label: 'Fixed Amount (₹)', icon: '💰' }
    ]
  },

  // SWP Countries with typical returns
  SWP_COUNTRIES: {
    label: "Country",
    icon: "🌍",
    options: [
      { value: 'india', label: 'India (Typical: 12%)', icon: '🇮🇳' },
      { value: 'usa', label: 'USA (Typical: 10%)', icon: '🇺🇸' },
      { value: 'uk', label: 'UK (Typical: 8%)', icon: '🇬🇧' },
      { value: 'canada', label: 'Canada (Typical: 9%)', icon: '🇨🇦' },
      { value: 'australia', label: 'Australia (Typical: 9%)', icon: '🇦🇺' }
    ]
  }
}

// Helper function to get dropdown config with custom focus color
export const getDropdownConfig = (configKey, focusColor = "#6366F1") => {
  // Handle nested config keys like "CALCULATION_TYPES.FD"
  const keys = configKey.split('.')
  let config = DROPDOWN_CONFIGS[keys[0]]

  if (!config) {
    console.warn(`Dropdown config '${configKey}' not found`)
    return null
  }

  // Navigate to nested config
  for (let i = 1; i < keys.length; i++) {
    config = config[keys[i]]
    if (!config) {
      console.warn(`Nested dropdown config '${configKey}' not found`)
      return null
    }
  }

  return {
    ...config,
    focusColor
  }
}

// Color mappings for different calculator categories
export const FOCUS_COLORS = {
  loans: "#3B82F6",      // Blue
  savings: "#059669",    // Green  
  mutual_funds: "#8B5CF6", // Purple
  tax: "#EF4444",        // Red
  retirement: "#8B5CF6", // Purple
  general: "#6B7280"     // Gray
}

// Helper to get focus color by category
export const getFocusColor = (category) => {
  return FOCUS_COLORS[category] || "#6366F1"
}
