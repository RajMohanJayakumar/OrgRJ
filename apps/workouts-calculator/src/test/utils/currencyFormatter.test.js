import { describe, it, expect, vi } from 'vitest'
import {
  formatCurrency,
  unformatCurrency,
  shouldFormatAsCurrency,
  handleCurrencyInputChange,
  getDisplayValue
} from '../../utils/currencyFormatter'

describe('Currency Formatter Utils', () => {
  describe('formatCurrency', () => {
    it('should format numbers with commas', () => {
      expect(formatCurrency(1000)).toBe('1,000')
      expect(formatCurrency(1000000)).toBe('1,000,000')
      expect(formatCurrency(0)).toBe('')
    })

    it('should handle decimal numbers', () => {
      expect(formatCurrency(1000.50)).toBe('1,000.5')
      expect(formatCurrency(999.99)).toBe('999.99')
    })

    it('should handle string inputs', () => {
      expect(formatCurrency('1000')).toBe('1,000')
      expect(formatCurrency('invalid')).toBe('')
    })

    it('should handle null and undefined', () => {
      expect(formatCurrency(null)).toBe('')
      expect(formatCurrency(undefined)).toBe('')
    })

    it('should handle empty string', () => {
      expect(formatCurrency('')).toBe('')
    })

    it('should handle large numbers', () => {
      expect(formatCurrency(1234567890)).toBe('1,234,567,890')
      expect(formatCurrency(999999999.99)).toBe('999,999,999.99')
    })

    it('should handle numbers with multiple decimal places', () => {
      expect(formatCurrency(1000.123456)).toBe('1,000.123456')
      expect(formatCurrency('1000.00')).toBe('1,000.00')
    })

    it('should clean and format strings with existing commas', () => {
      expect(formatCurrency('1,000')).toBe('1,000')
      expect(formatCurrency('1,000,000')).toBe('1,000,000')
    })

    it('should handle strings with special characters', () => {
      expect(formatCurrency('$1000')).toBe('1,000')
      expect(formatCurrency('1000₹')).toBe('1,000')
      expect(formatCurrency('1,000.50$')).toBe('1,000.50')
    })

    it('should handle negative numbers', () => {
      expect(formatCurrency(-1000)).toBe('1,000')
      expect(formatCurrency('-1000')).toBe('1,000')
    })

    it('should handle very small numbers', () => {
      expect(formatCurrency(0.01)).toBe('0.01')
      expect(formatCurrency(0.001)).toBe('0.001')
    })

    it('should handle edge cases with dots', () => {
      expect(formatCurrency('.')).toBe('.')
      expect(formatCurrency('..')).toBe('..')
      expect(formatCurrency('1.')).toBe('1.')
      expect(formatCurrency('.5')).toBe('.5')
    })
  })

  describe('unformatCurrency', () => {
    it('should remove comma formatting', () => {
      expect(unformatCurrency('1,000')).toBe('1000')
      expect(unformatCurrency('1,000,000')).toBe('1000000')
    })

    it('should handle numbers without formatting', () => {
      expect(unformatCurrency('1000')).toBe('1000')
      expect(unformatCurrency(1000)).toBe('1000')
    })

    it('should handle empty and invalid inputs', () => {
      expect(unformatCurrency('')).toBe('')
      expect(unformatCurrency(null)).toBe('')
      expect(unformatCurrency(undefined)).toBe('')
    })

    it('should handle decimal numbers with commas', () => {
      expect(unformatCurrency('1,000.50')).toBe('1000.50')
      expect(unformatCurrency('999,999.99')).toBe('999999.99')
    })

    it('should handle large formatted numbers', () => {
      expect(unformatCurrency('1,234,567,890')).toBe('1234567890')
      expect(unformatCurrency('999,999,999.99')).toBe('999999999.99')
    })

    it('should handle boolean and other types', () => {
      expect(unformatCurrency(true)).toBe('true')
      expect(unformatCurrency(false)).toBe('')
    })
  })

  describe('shouldFormatAsCurrency', () => {
    it('should return true for currency field names', () => {
      expect(shouldFormatAsCurrency('principal')).toBe(true)
      expect(shouldFormatAsCurrency('monthlyInvestment')).toBe(true)
      expect(shouldFormatAsCurrency('lumpSumAmount')).toBe(true)
      expect(shouldFormatAsCurrency('maturityAmount')).toBe(true)
      expect(shouldFormatAsCurrency('emi')).toBe(true)
      expect(shouldFormatAsCurrency('currentAmount')).toBe(true)
      expect(shouldFormatAsCurrency('beginningValue')).toBe(true)
      expect(shouldFormatAsCurrency('endingValue')).toBe(true)
      expect(shouldFormatAsCurrency('monthlyContribution')).toBe(true)
      expect(shouldFormatAsCurrency('annualIncome')).toBe(true)
      expect(shouldFormatAsCurrency('targetAmount')).toBe(true)
      expect(shouldFormatAsCurrency('monthlyDeposit')).toBe(true)
      expect(shouldFormatAsCurrency('monthlyWithdrawal')).toBe(true)
      expect(shouldFormatAsCurrency('investmentAmount')).toBe(true)
    })

    it('should return false for non-currency field names', () => {
      expect(shouldFormatAsCurrency('interestRate')).toBe(false)
      expect(shouldFormatAsCurrency('tenure')).toBe(false)
      expect(shouldFormatAsCurrency('years')).toBe(false)
      expect(shouldFormatAsCurrency('months')).toBe(false)
      expect(shouldFormatAsCurrency('percentage')).toBe(false)
      expect(shouldFormatAsCurrency('name')).toBe(false)
      expect(shouldFormatAsCurrency('email')).toBe(false)
      expect(shouldFormatAsCurrency('')).toBe(false)
      expect(shouldFormatAsCurrency(null)).toBe(false)
      expect(shouldFormatAsCurrency(undefined)).toBe(false)
    })

    it('should be case sensitive', () => {
      expect(shouldFormatAsCurrency('Principal')).toBe(false)
      expect(shouldFormatAsCurrency('PRINCIPAL')).toBe(false)
      expect(shouldFormatAsCurrency('EMI')).toBe(false)
    })
  })

  describe('handleCurrencyInputChange', () => {
    it('should format currency fields and call onChange with clean value', () => {
      const mockOnChange = vi.fn()

      handleCurrencyInputChange('1,000', mockOnChange, 'principal')
      expect(mockOnChange).toHaveBeenCalledWith('1000')

      handleCurrencyInputChange('1,000,000.50', mockOnChange, 'monthlyInvestment')
      expect(mockOnChange).toHaveBeenCalledWith('1000000.50')
    })

    it('should not format non-currency fields', () => {
      const mockOnChange = vi.fn()

      handleCurrencyInputChange('12.5', mockOnChange, 'interestRate')
      expect(mockOnChange).toHaveBeenCalledWith('12.5')

      handleCurrencyInputChange('24', mockOnChange, 'tenure')
      expect(mockOnChange).toHaveBeenCalledWith('24')
    })

    it('should handle empty values', () => {
      const mockOnChange = vi.fn()

      handleCurrencyInputChange('', mockOnChange, 'principal')
      expect(mockOnChange).toHaveBeenCalledWith('')

      handleCurrencyInputChange('', mockOnChange, 'interestRate')
      expect(mockOnChange).toHaveBeenCalledWith('')
    })

    it('should handle null and undefined field names', () => {
      const mockOnChange = vi.fn()

      handleCurrencyInputChange('1000', mockOnChange, null)
      expect(mockOnChange).toHaveBeenCalledWith('1000')

      handleCurrencyInputChange('1000', mockOnChange, undefined)
      expect(mockOnChange).toHaveBeenCalledWith('1000')
    })
  })

  describe('getDisplayValue', () => {
    it('should format currency fields for display', () => {
      expect(getDisplayValue('1000', 'principal')).toBe('1,000')
      expect(getDisplayValue('1000000', 'monthlyInvestment')).toBe('1,000,000')
      expect(getDisplayValue('1000.50', 'emi')).toBe('1,000.50')
    })

    it('should not format non-currency fields', () => {
      expect(getDisplayValue('12.5', 'interestRate')).toBe('12.5')
      expect(getDisplayValue('24', 'tenure')).toBe('24')
      expect(getDisplayValue('100', 'percentage')).toBe('100')
    })

    it('should handle empty values', () => {
      expect(getDisplayValue('', 'principal')).toBe('')
      expect(getDisplayValue(null, 'principal')).toBe('')
      expect(getDisplayValue(undefined, 'principal')).toBe('')
      expect(getDisplayValue('', 'interestRate')).toBe('')
      expect(getDisplayValue(null, 'interestRate')).toBe('')
      expect(getDisplayValue(undefined, 'interestRate')).toBe('')
    })

    it('should handle zero values', () => {
      expect(getDisplayValue('0', 'principal')).toBe('0')
      expect(getDisplayValue(0, 'principal')).toBe('')
      expect(getDisplayValue('0', 'interestRate')).toBe('0')
      expect(getDisplayValue(0, 'interestRate')).toBe('')
    })

    it('should handle edge cases', () => {
      expect(getDisplayValue('0.01', 'principal')).toBe('0.01')
      expect(getDisplayValue('1000000000', 'principal')).toBe('1,000,000,000')
      expect(getDisplayValue('999.999', 'principal')).toBe('999.999')
    })

    it('should handle non-currency fields with various values', () => {
      expect(getDisplayValue('0', 'interestRate')).toBe('0')
      expect(getDisplayValue('0.0', 'interestRate')).toBe('0.0')
      expect(getDisplayValue('12.345', 'interestRate')).toBe('12.345')
    })
  })
})
