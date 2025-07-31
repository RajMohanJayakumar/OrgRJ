// Test file for dynamic related calculators system
import { getRelatedCalculators, getCalculatorsByCategory, getCalculatorsByType } from '../relatedCalculators'

// Mock calculator data for testing
const mockCalculatorData = {
  loans: {
    title: "Loans",
    color: "blue",
    calculators: [
      { id: 'emi', name: 'EMI Calculator', icon: '🏠', description: 'Calculate loan EMI' },
      { id: 'mortgage', name: 'Mortgage Calculator', icon: '🏡', description: 'Home loan calculator' }
    ]
  },
  savings: {
    title: "Savings",
    color: "green",
    calculators: [
      { id: 'fd', name: 'Fixed Deposit', icon: '🏦', description: 'FD calculator' },
      { id: 'rd', name: 'Recurring Deposit', icon: '💰', description: 'RD calculator' }
    ]
  },
  mutual_funds: {
    title: "Mutual Funds",
    color: "purple",
    calculators: [
      { id: 'sip', name: 'SIP Calculator', icon: '📈', description: 'SIP calculator' },
      { id: 'xirr', name: 'XIRR Calculator', icon: '💹', description: 'XIRR calculator' }
    ]
  }
}

describe('Dynamic Related Calculators System', () => {
  test('getRelatedCalculators returns relevant calculators', () => {
    const related = getRelatedCalculators('emi', mockCalculatorData, 2)
    
    expect(related).toHaveLength(2)
    expect(related[0]).toHaveProperty('id')
    expect(related[0]).toHaveProperty('name')
    expect(related[0]).toHaveProperty('description')
    expect(related[0]).toHaveProperty('icon')
    
    // Should not include the current calculator
    expect(related.find(calc => calc.id === 'emi')).toBeUndefined()
  })
  
  test('getCalculatorsByCategory returns calculators from specific category', () => {
    const savingsCalculators = getCalculatorsByCategory('savings', mockCalculatorData)
    
    expect(savingsCalculators).toHaveLength(2)
    expect(savingsCalculators[0].category).toBe('Savings')
    expect(savingsCalculators[0].categoryColor).toBe('green')
  })
  
  test('getCalculatorsByType returns calculators of specific type', () => {
    const loanCalculators = getCalculatorsByType('loan-calculator', mockCalculatorData)
    
    expect(loanCalculators.length).toBeGreaterThan(0)
    expect(loanCalculators.every(calc => calc.id !== undefined)).toBe(true)
  })
  
  test('handles invalid calculator ID gracefully', () => {
    const related = getRelatedCalculators('invalid-id', mockCalculatorData)
    
    expect(Array.isArray(related)).toBe(true)
    expect(related.length).toBeGreaterThanOrEqual(0)
  })
  
  test('excludes current calculator from results', () => {
    const related = getRelatedCalculators('sip', mockCalculatorData, 5)
    
    expect(related.find(calc => calc.id === 'sip')).toBeUndefined()
  })
})

// Manual test function for development
export const testRelatedCalculators = () => {
  console.log('Testing Related Calculators System:')
  
  // Test EMI calculator related tools
  const emiRelated = getRelatedCalculators('emi', mockCalculatorData, 3)
  console.log('EMI Related:', emiRelated)
  
  // Test SIP calculator related tools
  const sipRelated = getRelatedCalculators('sip', mockCalculatorData, 3)
  console.log('SIP Related:', sipRelated)
  
  // Test category-based suggestions
  const savingsCalcs = getCalculatorsByCategory('savings', mockCalculatorData)
  console.log('Savings Category:', savingsCalcs)
  
  return {
    emiRelated,
    sipRelated,
    savingsCalcs
  }
}
