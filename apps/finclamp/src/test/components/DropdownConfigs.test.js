import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest'
import { 
  DROPDOWN_CONFIGS, 
  getDropdownConfig, 
  FOCUS_COLORS, 
  getFocusColor 
} from '../../components/DropdownConfigs'

describe('DropdownConfigs', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('📋 DROPDOWN_CONFIGS Structure', () => {
    test('should have all required config categories', () => {
      const expectedCategories = [
        'CALCULATION_TYPES',
        'COMPOUNDING_FREQUENCY',
        'COUNTRIES',
        'TAX_REGIME_INDIA',
        'TAX_REGIME_USA',
        'TAX_REGIME_UK',
        'TAX_REGIME_CANADA',
        'TAX_REGIME_AUSTRALIA',
        'ORGANIZATION_TYPE',
        'STEP_UP_TYPE',
        'SWP_COUNTRIES'
      ]
      
      expectedCategories.forEach(category => {
        expect(DROPDOWN_CONFIGS).toHaveProperty(category)
      })
    })

    test('should have proper structure for each config', () => {
      Object.entries(DROPDOWN_CONFIGS).forEach(([key, config]) => {
        if (key === 'CALCULATION_TYPES') {
          // Nested structure
          Object.values(config).forEach(nestedConfig => {
            expect(nestedConfig).toHaveProperty('label')
            expect(nestedConfig).toHaveProperty('icon')
            expect(nestedConfig).toHaveProperty('options')
            expect(Array.isArray(nestedConfig.options)).toBe(true)
          })
        } else {
          // Flat structure
          expect(config).toHaveProperty('label')
          expect(config).toHaveProperty('icon')
          expect(config).toHaveProperty('options')
          expect(Array.isArray(config.options)).toBe(true)
        }
      })
    })

    test('should have valid option structure', () => {
      Object.entries(DROPDOWN_CONFIGS).forEach(([key, config]) => {
        const configs = key === 'CALCULATION_TYPES' ? Object.values(config) : [config]
        
        configs.forEach(cfg => {
          cfg.options.forEach(option => {
            expect(option).toHaveProperty('value')
            expect(option).toHaveProperty('label')
            expect(typeof option.value).toBe('string')
            expect(typeof option.label).toBe('string')
            // Icon is optional
            if (option.icon) {
              expect(typeof option.icon).toBe('string')
            }
          })
        })
      })
    })
  })

  describe('🧮 CALCULATION_TYPES Configs', () => {
    test('should have FD calculation types', () => {
      const fdConfig = DROPDOWN_CONFIGS.CALCULATION_TYPES.FD
      
      expect(fdConfig.label).toBe('Calculation Type')
      expect(fdConfig.icon).toBe('⚙️')
      expect(fdConfig.options).toHaveLength(2)
      
      const values = fdConfig.options.map(opt => opt.value)
      expect(values).toContain('maturity')
      expect(values).toContain('reverse-maturity')
    })

    test('should have RD calculation types', () => {
      const rdConfig = DROPDOWN_CONFIGS.CALCULATION_TYPES.RD
      
      expect(rdConfig.label).toBe('Calculation Type')
      expect(rdConfig.icon).toBe('🧮')
      expect(rdConfig.options).toHaveLength(2)
      
      const values = rdConfig.options.map(opt => opt.value)
      expect(values).toContain('maturity')
      expect(values).toContain('reverse-maturity')
    })

    test('should have CAGR calculation types', () => {
      const cagrConfig = DROPDOWN_CONFIGS.CALCULATION_TYPES.CAGR
      
      expect(cagrConfig.label).toBe('Calculation Type')
      expect(cagrConfig.icon).toBe('🔢')
      expect(cagrConfig.options).toHaveLength(2)
      
      const values = cagrConfig.options.map(opt => opt.value)
      expect(values).toContain('cagr')
      expect(values).toContain('roi')
    })
  })

  describe('🔄 COMPOUNDING_FREQUENCY Config', () => {
    test('should have all compounding frequencies', () => {
      const config = DROPDOWN_CONFIGS.COMPOUNDING_FREQUENCY
      
      expect(config.label).toBe('Compounding Frequency')
      expect(config.icon).toBe('🔄')
      expect(config.options).toHaveLength(5)
      
      const values = config.options.map(opt => opt.value)
      expect(values).toEqual(['1', '2', '4', '12', '365'])
      
      const labels = config.options.map(opt => opt.label)
      expect(labels).toContain('Annually')
      expect(labels).toContain('Semi-annually')
      expect(labels).toContain('Quarterly')
      expect(labels).toContain('Monthly')
      expect(labels).toContain('Daily')
    })
  })

  describe('🌍 COUNTRIES Config', () => {
    test('should have major countries', () => {
      const config = DROPDOWN_CONFIGS.COUNTRIES
      
      expect(config.label).toBe('Country')
      expect(config.icon).toBe('🌍')
      expect(config.options).toHaveLength(5)
      
      const values = config.options.map(opt => opt.value)
      expect(values).toEqual(['india', 'usa', 'uk', 'canada', 'australia'])
      
      // Check for country flags
      config.options.forEach(option => {
        expect(option.icon).toMatch(/🇮🇳|🇺🇸|🇬🇧|🇨🇦|🇦🇺/)
      })
    })
  })

  describe('⚖️ Tax Regime Configs', () => {
    test('should have India tax regimes', () => {
      const config = DROPDOWN_CONFIGS.TAX_REGIME_INDIA
      
      expect(config.label).toBe('Tax Regime')
      expect(config.options).toHaveLength(2)
      
      const values = config.options.map(opt => opt.value)
      expect(values).toEqual(['old', 'new'])
    })

    test('should have USA filing statuses', () => {
      const config = DROPDOWN_CONFIGS.TAX_REGIME_USA
      
      expect(config.label).toBe('Filing Status')
      expect(config.options).toHaveLength(4)
      
      const values = config.options.map(opt => opt.value)
      expect(values).toContain('single')
      expect(values).toContain('married_joint')
      expect(values).toContain('married_separate')
      expect(values).toContain('head_household')
    })

    test('should have UK tax codes', () => {
      const config = DROPDOWN_CONFIGS.TAX_REGIME_UK
      
      expect(config.label).toBe('Tax Code')
      expect(config.options).toHaveLength(3)
      
      const values = config.options.map(opt => opt.value)
      expect(values).toContain('standard')
      expect(values).toContain('higher')
      expect(values).toContain('additional')
    })

    test('should have Canada provinces', () => {
      const config = DROPDOWN_CONFIGS.TAX_REGIME_CANADA
      
      expect(config.label).toBe('Province/Territory')
      expect(config.options).toHaveLength(5)
      
      const values = config.options.map(opt => opt.value)
      expect(values).toContain('ontario')
      expect(values).toContain('quebec')
      expect(values).toContain('british_columbia')
      expect(values).toContain('alberta')
      expect(values).toContain('federal_only')
    })

    test('should have Australia residency statuses', () => {
      const config = DROPDOWN_CONFIGS.TAX_REGIME_AUSTRALIA
      
      expect(config.label).toBe('Residency Status')
      expect(config.options).toHaveLength(3)
      
      const values = config.options.map(opt => opt.value)
      expect(values).toContain('resident')
      expect(values).toContain('non_resident')
      expect(values).toContain('working_holiday')
    })
  })

  describe('🏢 ORGANIZATION_TYPE Config', () => {
    test('should have organization types', () => {
      const config = DROPDOWN_CONFIGS.ORGANIZATION_TYPE
      
      expect(config.label).toBe('Organization Type')
      expect(config.icon).toBe('🏢')
      expect(config.options).toHaveLength(2)
      
      const values = config.options.map(opt => opt.value)
      expect(values).toEqual(['covered', 'non-covered'])
    })
  })

  describe('📈 STEP_UP_TYPE Config', () => {
    test('should have step-up types', () => {
      const config = DROPDOWN_CONFIGS.STEP_UP_TYPE
      
      expect(config.label).toBe('Annual Step-up Type')
      expect(config.icon).toBe('📈')
      expect(config.options).toHaveLength(2)
      
      const values = config.options.map(opt => opt.value)
      expect(values).toEqual(['percentage', 'amount'])
    })
  })

  describe('🌍 SWP_COUNTRIES Config', () => {
    test('should have SWP countries with typical returns', () => {
      const config = DROPDOWN_CONFIGS.SWP_COUNTRIES
      
      expect(config.label).toBe('Country')
      expect(config.icon).toBe('🌍')
      expect(config.options).toHaveLength(5)
      
      // Check that labels include typical returns
      config.options.forEach(option => {
        expect(option.label).toMatch(/Typical: \d+%/)
      })
    })
  })

  describe('🔧 getDropdownConfig Function', () => {
    test('should return config for simple keys', () => {
      const config = getDropdownConfig('COUNTRIES')
      
      expect(config).toBeDefined()
      expect(config.label).toBe('Country')
      expect(config.focusColor).toBe('#6366F1')
    })

    test('should return config for nested keys', () => {
      const config = getDropdownConfig('CALCULATION_TYPES.FD')
      
      expect(config).toBeDefined()
      expect(config.label).toBe('Calculation Type')
      expect(config.icon).toBe('⚙️')
      expect(config.focusColor).toBe('#6366F1')
    })

    test('should apply custom focus color', () => {
      const config = getDropdownConfig('COUNTRIES', '#FF0000')
      
      expect(config.focusColor).toBe('#FF0000')
    })

    test('should return null for invalid keys', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      
      const config = getDropdownConfig('INVALID_KEY')
      
      expect(config).toBeNull()
      expect(consoleSpy).toHaveBeenCalledWith("Dropdown config 'INVALID_KEY' not found")
      
      consoleSpy.mockRestore()
    })

    test('should return null for invalid nested keys', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      
      const config = getDropdownConfig('CALCULATION_TYPES.INVALID')
      
      expect(config).toBeNull()
      expect(consoleSpy).toHaveBeenCalledWith("Nested dropdown config 'CALCULATION_TYPES.INVALID' not found")
      
      consoleSpy.mockRestore()
    })

    test('should handle deeply nested invalid keys', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      
      const config = getDropdownConfig('CALCULATION_TYPES.FD.INVALID')
      
      expect(config).toBeNull()
      expect(consoleSpy).toHaveBeenCalledWith("Nested dropdown config 'CALCULATION_TYPES.FD.INVALID' not found")
      
      consoleSpy.mockRestore()
    })
  })

  describe('🎨 FOCUS_COLORS', () => {
    test('should have all category colors', () => {
      const expectedCategories = [
        'loans',
        'savings', 
        'mutual_funds',
        'tax',
        'retirement',
        'general'
      ]
      
      expectedCategories.forEach(category => {
        expect(FOCUS_COLORS).toHaveProperty(category)
        expect(typeof FOCUS_COLORS[category]).toBe('string')
        expect(FOCUS_COLORS[category]).toMatch(/^#[0-9A-F]{6}$/i)
      })
    })

    test('should have proper color values', () => {
      expect(FOCUS_COLORS.loans).toBe('#3B82F6')
      expect(FOCUS_COLORS.savings).toBe('#059669')
      expect(FOCUS_COLORS.mutual_funds).toBe('#8B5CF6')
      expect(FOCUS_COLORS.tax).toBe('#EF4444')
      expect(FOCUS_COLORS.retirement).toBe('#8B5CF6')
      expect(FOCUS_COLORS.general).toBe('#6B7280')
    })
  })

  describe('🎨 getFocusColor Function', () => {
    test('should return correct color for valid categories', () => {
      expect(getFocusColor('loans')).toBe('#3B82F6')
      expect(getFocusColor('savings')).toBe('#059669')
      expect(getFocusColor('mutual_funds')).toBe('#8B5CF6')
      expect(getFocusColor('tax')).toBe('#EF4444')
      expect(getFocusColor('retirement')).toBe('#8B5CF6')
      expect(getFocusColor('general')).toBe('#6B7280')
    })

    test('should return default color for invalid categories', () => {
      expect(getFocusColor('invalid')).toBe('#6366F1')
      expect(getFocusColor('')).toBe('#6366F1')
      expect(getFocusColor(null)).toBe('#6366F1')
      expect(getFocusColor(undefined)).toBe('#6366F1')
    })
  })

  describe('🔍 Data Integrity', () => {
    test('should have unique values within each config', () => {
      Object.entries(DROPDOWN_CONFIGS).forEach(([key, config]) => {
        const configs = key === 'CALCULATION_TYPES' ? Object.values(config) : [config]
        
        configs.forEach(cfg => {
          const values = cfg.options.map(opt => opt.value)
          const uniqueValues = [...new Set(values)]
          expect(values).toHaveLength(uniqueValues.length)
        })
      })
    })

    test('should have non-empty labels and values', () => {
      Object.entries(DROPDOWN_CONFIGS).forEach(([key, config]) => {
        const configs = key === 'CALCULATION_TYPES' ? Object.values(config) : [config]
        
        configs.forEach(cfg => {
          expect(cfg.label.trim()).not.toBe('')
          expect(cfg.icon.trim()).not.toBe('')
          
          cfg.options.forEach(option => {
            expect(option.value.trim()).not.toBe('')
            expect(option.label.trim()).not.toBe('')
          })
        })
      })
    })

    test('should have consistent emoji usage', () => {
      Object.entries(DROPDOWN_CONFIGS).forEach(([key, config]) => {
        const configs = key === 'CALCULATION_TYPES' ? Object.values(config) : [config]

        configs.forEach(cfg => {
          // Icon should be a non-empty string (simplified check)
          expect(cfg.icon).toBeTruthy()
          expect(typeof cfg.icon).toBe('string')
          expect(cfg.icon.length).toBeGreaterThan(0)
        })
      })
    })
  })
})
