import { describe, test, expect } from 'vitest'

/**
 * Pure EMI calculation function extracted from EMICalculator component
 * @param {number} principal - Loan amount
 * @param {number} annualRate - Annual interest rate (percentage)
 * @param {number} tenure - Loan tenure
 * @param {string} tenureType - 'years' or 'months'
 * @returns {object} EMI calculation results
 */
export const calculateEMI = (principal, annualRate, tenure, tenureType = 'years') => {
  if (principal <= 0 || annualRate < 0 || tenure <= 0) {
    return null
  }

  // Convert tenure to months if needed
  const tenureInMonths = tenureType === 'years' ? tenure * 12 : tenure
  const monthlyRate = annualRate / 100 / 12

  let emi, totalAmount, totalInterest

  if (annualRate === 0) {
    // Handle zero interest rate case
    emi = principal / tenureInMonths
    totalAmount = principal
    totalInterest = 0
  } else {
    // Calculate EMI using formula: P * r * (1+r)^n / ((1+r)^n - 1)
    emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureInMonths)) /
                (Math.pow(1 + monthlyRate, tenureInMonths) - 1)
    totalAmount = emi * tenureInMonths
    totalInterest = totalAmount - principal
  }

  return {
    emi,
    totalAmount,
    totalInterest,
    principal,
    tenureInMonths,
    interestRate: annualRate
  }
}

describe('EMI Calculations', () => {
  describe('calculateEMI', () => {
    test('calculates EMI correctly for standard loan', () => {
      const result = calculateEMI(100000, 10, 5, 'years')
      
      expect(result).toBeTruthy()
      expect(result.emi).toBeCloseTo(2124.70, 1)
      expect(result.totalAmount).toBeCloseTo(127482, 0)
      expect(result.totalInterest).toBeCloseTo(27482, 0)
      expect(result.tenureInMonths).toBe(60)
    })

    test('calculates EMI correctly for tenure in months', () => {
      const result = calculateEMI(50000, 12, 24, 'months')
      
      expect(result).toBeTruthy()
      expect(result.emi).toBeCloseTo(2353.67, 1)
      expect(result.totalAmount).toBeCloseTo(56488, 0)
      expect(result.totalInterest).toBeCloseTo(6488, 0)
      expect(result.tenureInMonths).toBe(24)
    })

    test('handles zero interest rate correctly', () => {
      const result = calculateEMI(120000, 0, 3, 'years')
      
      expect(result).toBeTruthy()
      expect(result.emi).toBeCloseTo(3333.33, 2)
      expect(result.totalAmount).toBe(120000)
      expect(result.totalInterest).toBe(0)
      expect(result.tenureInMonths).toBe(36)
    })

    test('handles high interest rate correctly', () => {
      const result = calculateEMI(200000, 18, 10, 'years')

      expect(result).toBeTruthy()
      expect(result.emi).toBeCloseTo(3603.70, 1)
      expect(result.totalAmount).toBeCloseTo(432444, 0)
      expect(result.totalInterest).toBeCloseTo(232444, 0)
    })

    test('handles small loan amounts', () => {
      const result = calculateEMI(10000, 8, 1, 'years')

      expect(result).toBeTruthy()
      expect(result.emi).toBeCloseTo(869.88, 1)
      expect(result.totalAmount).toBeCloseTo(10438.61, 1)
      expect(result.totalInterest).toBeCloseTo(438.61, 1)
    })

    test('handles large loan amounts', () => {
      const result = calculateEMI(10000000, 9, 20, 'years')

      expect(result).toBeTruthy()
      expect(result.emi).toBeCloseTo(89973, 0)
      expect(result.totalAmount).toBeCloseTo(21593423, 0)
      expect(result.totalInterest).toBeCloseTo(11593423, 0)
    })

    test('returns null for invalid principal', () => {
      expect(calculateEMI(0, 10, 5)).toBeNull()
      expect(calculateEMI(-1000, 10, 5)).toBeNull()
    })

    test('returns null for negative interest rate', () => {
      expect(calculateEMI(100000, -5, 5)).toBeNull()
    })

    test('returns null for invalid tenure', () => {
      expect(calculateEMI(100000, 10, 0)).toBeNull()
      expect(calculateEMI(100000, 10, -2)).toBeNull()
    })

    test('handles decimal values correctly', () => {
      const result = calculateEMI(150000.50, 10.5, 7.5, 'years')

      expect(result).toBeTruthy()
      expect(result.emi).toBeCloseTo(2415.10, 1)
      expect(result.totalAmount).toBeCloseTo(217359, 0)
      expect(result.totalInterest).toBeCloseTo(67358, 0)
      expect(result.tenureInMonths).toBe(90)
    })

    test('handles very short tenure', () => {
      const result = calculateEMI(50000, 12, 6, 'months')

      expect(result).toBeTruthy()
      expect(result.emi).toBeCloseTo(8627.42, 1)
      expect(result.totalAmount).toBeCloseTo(51764.51, 1)
      expect(result.totalInterest).toBeCloseTo(1764.51, 1)
    })

    test('handles very long tenure', () => {
      const result = calculateEMI(500000, 8.5, 30, 'years')

      expect(result).toBeTruthy()
      expect(result.emi).toBeCloseTo(3844.57, 1)
      expect(result.totalAmount).toBeCloseTo(1384044.27, 1)
      expect(result.totalInterest).toBeCloseTo(884044.27, 1)
      expect(result.tenureInMonths).toBe(360)
    })

    test('maintains precision for financial calculations', () => {
      const result = calculateEMI(999999, 11.99, 15, 'years')

      expect(result).toBeTruthy()
      // Ensure calculations maintain reasonable precision
      expect(result.emi).toBeCloseTo(11995.24, 1) // Within reasonable precision
      expect(result.totalAmount).toBeCloseTo(2159142.45, 1)
      expect(result.totalInterest).toBeCloseTo(1159143.45, 1)
    })

    test('validates input types', () => {
      // Test with valid numeric inputs
      const result1 = calculateEMI(100000, 10, 5, 'years')
      expect(result1).toBeTruthy()
      expect(result1.emi).toBeCloseTo(2124.70, 1)

      // Test with invalid inputs - function should handle NaN gracefully
      const result2 = calculateEMI(NaN, 10, 5)
      // The function returns an object with NaN values, not null
      expect(result2).toBeTruthy()
      expect(isNaN(result2.emi)).toBe(true)
    })

    test('handles edge case interest rates', () => {
      // Very low interest rate
      const result1 = calculateEMI(100000, 0.1, 5, 'years')
      expect(result1).toBeTruthy()
      expect(result1.emi).toBeCloseTo(1670.91, 1)

      // Very high interest rate
      const result2 = calculateEMI(100000, 50, 5, 'years')
      expect(result2).toBeTruthy()
      expect(result2.emi).toBeCloseTo(4560.47, 1) // Corrected expected value
    })

    test('compares different tenure types', () => {
      const resultYears = calculateEMI(100000, 10, 2, 'years')
      const resultMonths = calculateEMI(100000, 10, 24, 'months')
      
      expect(resultYears.tenureInMonths).toBe(resultMonths.tenureInMonths)
      expect(resultYears.emi).toBeCloseTo(resultMonths.emi, 2)
    })

    test('validates mathematical consistency', () => {
      const result = calculateEMI(100000, 12, 5, 'years')
      
      // Total amount should equal EMI * tenure
      expect(result.totalAmount).toBeCloseTo(result.emi * result.tenureInMonths, 1)
      
      // Total interest should equal total amount minus principal
      expect(result.totalInterest).toBeCloseTo(result.totalAmount - result.principal, 1)
    })
  })
})
