import { describe, test, expect } from 'vitest'

/**
 * Pure compound interest calculation function
 * @param {number} principal - Initial principal amount
 * @param {number} interestRate - Annual interest rate (percentage)
 * @param {number} timePeriod - Time period in years
 * @param {number} compoundingFrequency - Compounding frequency per year
 * @returns {object} Compound interest calculation results
 */
export const calculateCompoundInterest = (principal, interestRate, timePeriod, compoundingFrequency = 1) => {
  if (principal <= 0 || interestRate <= 0 || timePeriod <= 0 || compoundingFrequency <= 0) {
    return null
  }

  // Compound Interest Formula: A = P(1 + r/n)^(nt)
  const rate = interestRate / 100
  const amount = principal * Math.pow(1 + rate / compoundingFrequency, compoundingFrequency * timePeriod)
  const compoundInterest = amount - principal

  // Calculate simple interest for comparison
  const simpleInterest = principal * rate * timePeriod
  const simpleAmount = principal + simpleInterest

  return {
    amount,
    compoundInterest,
    simpleInterest,
    simpleAmount,
    principal,
    interestRate,
    timePeriod,
    compoundingFrequency,
    additionalEarnings: compoundInterest - simpleInterest
  }
}

/**
 * Calculate effective annual rate
 * @param {number} nominalRate - Nominal annual interest rate (percentage)
 * @param {number} compoundingFrequency - Compounding frequency per year
 * @returns {number} Effective annual rate (percentage)
 */
export const calculateEffectiveAnnualRate = (nominalRate, compoundingFrequency) => {
  if (nominalRate <= 0 || compoundingFrequency <= 0) {
    return 0
  }

  const rate = nominalRate / 100
  const effectiveRate = Math.pow(1 + rate / compoundingFrequency, compoundingFrequency) - 1
  return effectiveRate * 100
}

/**
 * Calculate time required to reach target amount
 * @param {number} principal - Initial principal amount
 * @param {number} targetAmount - Target amount to reach
 * @param {number} interestRate - Annual interest rate (percentage)
 * @param {number} compoundingFrequency - Compounding frequency per year
 * @returns {number} Time required in years
 */
export const calculateTimeToTarget = (principal, targetAmount, interestRate, compoundingFrequency = 1) => {
  if (principal <= 0 || targetAmount <= principal || interestRate <= 0 || compoundingFrequency <= 0) {
    return 0
  }

  const rate = interestRate / 100
  const timeRequired = Math.log(targetAmount / principal) / 
                      (compoundingFrequency * Math.log(1 + rate / compoundingFrequency))
  
  return timeRequired
}

describe('Compound Interest Calculations', () => {
  describe('calculateCompoundInterest', () => {
    test('calculates compound interest correctly for annual compounding', () => {
      const result = calculateCompoundInterest(10000, 10, 5, 1)
      
      expect(result).toBeTruthy()
      expect(result.amount).toBeCloseTo(16105.10, 2)
      expect(result.compoundInterest).toBeCloseTo(6105.10, 2)
      expect(result.simpleInterest).toBeCloseTo(5000, 2)
      expect(result.additionalEarnings).toBeCloseTo(1105.10, 2)
    })

    test('calculates compound interest for quarterly compounding', () => {
      const result = calculateCompoundInterest(50000, 8, 3, 4)

      expect(result).toBeTruthy()
      expect(result.amount).toBeCloseTo(63412.09, 2)
      expect(result.compoundInterest).toBeCloseTo(13412.09, 2)
      expect(result.simpleInterest).toBeCloseTo(12000, 2)
      expect(result.additionalEarnings).toBeCloseTo(1412.09, 2)
    })

    test('calculates compound interest for monthly compounding', () => {
      const result = calculateCompoundInterest(100000, 12, 2, 12)
      
      expect(result).toBeTruthy()
      expect(result.amount).toBeCloseTo(126973.46, 2)
      expect(result.compoundInterest).toBeCloseTo(26973.46, 2)
      expect(result.simpleInterest).toBeCloseTo(24000, 2)
      expect(result.additionalEarnings).toBeCloseTo(2973.46, 2)
    })

    test('calculates compound interest for daily compounding', () => {
      const result = calculateCompoundInterest(25000, 6, 4, 365)

      expect(result).toBeTruthy()
      expect(result.amount).toBeCloseTo(31780.60, 2)
      expect(result.compoundInterest).toBeCloseTo(6780.60, 2)
      expect(result.simpleInterest).toBeCloseTo(6000, 2)
      expect(result.additionalEarnings).toBeCloseTo(780.60, 2)
    })

    test('handles zero interest rate', () => {
      const result = calculateCompoundInterest(10000, 0, 5, 1)
      
      expect(result).toBeNull()
    })

    test('handles very high interest rates', () => {
      const result = calculateCompoundInterest(10000, 25, 3, 1)
      
      expect(result).toBeTruthy()
      expect(result.amount).toBeCloseTo(19531.25, 2)
      expect(result.compoundInterest).toBeCloseTo(9531.25, 2)
      expect(result.simpleInterest).toBeCloseTo(7500, 2)
    })

    test('handles very low interest rates', () => {
      const result = calculateCompoundInterest(100000, 0.5, 10, 1)
      
      expect(result).toBeTruthy()
      expect(result.amount).toBeCloseTo(105114.01, 2)
      expect(result.compoundInterest).toBeCloseTo(5114.01, 2)
      expect(result.simpleInterest).toBeCloseTo(5000, 2)
    })

    test('handles large principal amounts', () => {
      const result = calculateCompoundInterest(10000000, 8, 10, 4)

      expect(result).toBeTruthy()
      expect(result.amount).toBeCloseTo(22080396.64, 2)
      expect(result.compoundInterest).toBeCloseTo(12080396.64, 2)
      expect(result.simpleInterest).toBeCloseTo(8000000, 2)
    })

    test('handles short time periods', () => {
      const result = calculateCompoundInterest(50000, 10, 0.5, 12) // 6 months

      expect(result).toBeTruthy()
      expect(result.amount).toBeCloseTo(52552.67, 2)
      expect(result.compoundInterest).toBeCloseTo(2552.67, 2)
      expect(result.simpleInterest).toBeCloseTo(2500, 2)
    })

    test('handles long time periods', () => {
      const result = calculateCompoundInterest(10000, 7, 30, 1)
      
      expect(result).toBeTruthy()
      expect(result.amount).toBeCloseTo(76122.55, 2)
      expect(result.compoundInterest).toBeCloseTo(66122.55, 2)
      expect(result.simpleInterest).toBeCloseTo(21000, 2)
    })

    test('returns null for invalid inputs', () => {
      expect(calculateCompoundInterest(0, 10, 5, 1)).toBeNull()
      expect(calculateCompoundInterest(-1000, 10, 5, 1)).toBeNull()
      expect(calculateCompoundInterest(1000, -5, 5, 1)).toBeNull()
      expect(calculateCompoundInterest(1000, 10, 0, 1)).toBeNull()
      expect(calculateCompoundInterest(1000, 10, 5, 0)).toBeNull()
    })

    test('handles decimal values correctly', () => {
      const result = calculateCompoundInterest(15000.50, 8.75, 3.5, 2)

      expect(result).toBeTruthy()
      expect(result.amount).toBeCloseTo(20243.29, 2)
      expect(result.compoundInterest).toBeCloseTo(5242.79, 2)
    })
  })

  describe('calculateEffectiveAnnualRate', () => {
    test('calculates effective rate for quarterly compounding', () => {
      const result = calculateEffectiveAnnualRate(8, 4)
      
      expect(result).toBeCloseTo(8.24, 2)
    })

    test('calculates effective rate for monthly compounding', () => {
      const result = calculateEffectiveAnnualRate(12, 12)
      
      expect(result).toBeCloseTo(12.68, 2)
    })

    test('calculates effective rate for daily compounding', () => {
      const result = calculateEffectiveAnnualRate(6, 365)
      
      expect(result).toBeCloseTo(6.18, 2)
    })

    test('calculates effective rate for annual compounding', () => {
      const result = calculateEffectiveAnnualRate(10, 1)
      
      expect(result).toBeCloseTo(10, 2)
    })

    test('returns 0 for invalid inputs', () => {
      expect(calculateEffectiveAnnualRate(0, 4)).toBe(0)
      expect(calculateEffectiveAnnualRate(-5, 4)).toBe(0)
      expect(calculateEffectiveAnnualRate(8, 0)).toBe(0)
      expect(calculateEffectiveAnnualRate(8, -2)).toBe(0)
    })

    test('handles high frequency compounding', () => {
      const result = calculateEffectiveAnnualRate(10, 8760) // Hourly compounding
      
      expect(result).toBeCloseTo(10.52, 2)
    })
  })

  describe('calculateTimeToTarget', () => {
    test('calculates time to double money', () => {
      const result = calculateTimeToTarget(10000, 20000, 10, 1)
      
      expect(result).toBeCloseTo(7.27, 2) // Rule of 72: 72/10 ≈ 7.2 years
    })

    test('calculates time to reach specific target', () => {
      const result = calculateTimeToTarget(50000, 100000, 8, 4)

      expect(result).toBeCloseTo(8.75, 2)
    })

    test('calculates time for large growth targets', () => {
      const result = calculateTimeToTarget(10000, 100000, 12, 12)

      expect(result).toBeCloseTo(19.28, 2)
    })

    test('handles high interest rates', () => {
      const result = calculateTimeToTarget(1000, 5000, 20, 1)

      expect(result).toBeCloseTo(8.83, 2)
    })

    test('returns 0 for invalid inputs', () => {
      expect(calculateTimeToTarget(0, 20000, 10, 1)).toBe(0)
      expect(calculateTimeToTarget(10000, 5000, 10, 1)).toBe(0) // Target less than principal
      expect(calculateTimeToTarget(10000, 20000, 0, 1)).toBe(0)
      expect(calculateTimeToTarget(10000, 20000, 10, 0)).toBe(0)
    })

    test('handles small growth targets', () => {
      const result = calculateTimeToTarget(100000, 110000, 5, 1)
      
      expect(result).toBeCloseTo(1.95, 2)
    })
  })

  describe('compound interest edge cases', () => {
    test('compares different compounding frequencies', () => {
      const annual = calculateCompoundInterest(10000, 10, 5, 1)
      const quarterly = calculateCompoundInterest(10000, 10, 5, 4)
      const monthly = calculateCompoundInterest(10000, 10, 5, 12)
      const daily = calculateCompoundInterest(10000, 10, 5, 365)
      
      expect(quarterly.amount).toBeGreaterThan(annual.amount)
      expect(monthly.amount).toBeGreaterThan(quarterly.amount)
      expect(daily.amount).toBeGreaterThan(monthly.amount)
    })

    test('maintains precision for financial calculations', () => {
      const result = calculateCompoundInterest(999999.99, 11.99, 15.5, 12)

      expect(result.amount).toBeCloseTo(6354904, 0) // Within reasonable range
      expect(result.compoundInterest).toBeCloseTo(5354904, 0)
    })

    test('handles continuous compounding approximation', () => {
      const veryHighFreq = calculateCompoundInterest(10000, 10, 5, 365000) // Very high frequency
      const continuousApprox = 10000 * Math.exp(0.10 * 5) // e^(rt) formula
      
      expect(veryHighFreq.amount).toBeCloseTo(continuousApprox, 0)
    })

    test('validates mathematical consistency', () => {
      const result = calculateCompoundInterest(10000, 10, 5, 4)
      
      // Compound interest should be greater than simple interest
      expect(result.compoundInterest).toBeGreaterThan(result.simpleInterest)
      
      // Amount should equal principal plus compound interest
      expect(result.amount).toBeCloseTo(result.principal + result.compoundInterest, 2)
      
      // Additional earnings should be positive
      expect(result.additionalEarnings).toBeGreaterThan(0)
    })
  })
})
