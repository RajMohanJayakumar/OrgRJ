import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '../App'

// Mock all the calculator components to avoid complex dependencies
vi.mock('../calculators/SIPCalculator', () => ({
  default: () => <div data-testid="sip-calculator">SIP Calculator</div>
}))

vi.mock('../calculators/EMICalculator', () => ({
  default: () => <div data-testid="emi-calculator">EMI Calculator</div>
}))

vi.mock('../calculators/FDCalculator', () => ({
  default: () => <div data-testid="fd-calculator">FD Calculator</div>
}))

// Mock all other calculators with a generic mock
vi.mock('../calculators/SWPCalculator', () => ({
  default: () => <div data-testid="swpcalculator-calculator">SWPCalculator</div>
}))
vi.mock('../calculators/RDCalculator', () => ({
  default: () => <div data-testid="rdcalculator-calculator">RDCalculator</div>
}))
vi.mock('../calculators/PPFCalculator', () => ({
  default: () => <div data-testid="ppfcalculator-calculator">PPFCalculator</div>
}))
vi.mock('../calculators/TaxCalculator', () => ({
  default: () => <div data-testid="taxcalculator-calculator">TaxCalculator</div>
}))
vi.mock('../calculators/CAGRCalculator', () => ({
  default: () => <div data-testid="cagrcalculator-calculator">CAGRCalculator</div>
}))
vi.mock('../calculators/NPSCalculator', () => ({
  default: () => <div data-testid="npscalculator-calculator">NPSCalculator</div>
}))
vi.mock('../calculators/EPFCalculator', () => ({
  default: () => <div data-testid="epfcalculator-calculator">EPFCalculator</div>
}))
vi.mock('../calculators/GratuityCalculator', () => ({
  default: () => <div data-testid="gratuitycalculator-calculator">GratuityCalculator</div>
}))
vi.mock('../calculators/CompoundInterestCalculator', () => ({
  default: () => <div data-testid="compoundinterestcalculator-calculator">CompoundInterestCalculator</div>
}))
vi.mock('../calculators/SimpleInterestCalculator', () => ({
  default: () => <div data-testid="simpleinterestcalculator-calculator">SimpleInterestCalculator</div>
}))
vi.mock('../calculators/InflationCalculator', () => ({
  default: () => <div data-testid="inflationcalculator-calculator">InflationCalculator</div>
}))
vi.mock('../calculators/RealEstateCalculator', () => ({
  default: () => <div data-testid="realestatecalculator-calculator">RealEstateCalculator</div>
}))
vi.mock('../calculators/PropertyValuationCalculator', () => ({
  default: () => <div data-testid="propertyvaluationcalculator-calculator">PropertyValuationCalculator</div>
}))
vi.mock('../calculators/RentVsBuyCalculator', () => ({
  default: () => <div data-testid="rentvsbuycalculator-calculator">RentVsBuyCalculator</div>
}))
vi.mock('../calculators/PropertyTaxCalculator', () => ({
  default: () => <div data-testid="propertytaxcalculator-calculator">PropertyTaxCalculator</div>
}))
vi.mock('../calculators/NetWorthCalculator', () => ({
  default: () => <div data-testid="networthcalculator-calculator">NetWorthCalculator</div>
}))
vi.mock('../calculators/DiscountCalculator', () => ({
  default: () => <div data-testid="discountcalculator-calculator">DiscountCalculator</div>
}))
vi.mock('../calculators/FuelCostCalculator', () => ({
  default: () => <div data-testid="fuelcostcalculator-calculator">FuelCostCalculator</div>
}))
vi.mock('../calculators/StockAverageCalculator', () => ({
  default: () => <div data-testid="stockaveragecalculator-calculator">StockAverageCalculator</div>
}))
vi.mock('../calculators/BudgetPlannerCalculator', () => ({
  default: () => <div data-testid="budgetplannercalculator-calculator">BudgetPlannerCalculator</div>
}))
vi.mock('../calculators/VendorQuotationCalculator', () => ({
  default: () => <div data-testid="vendorquotationcalculator-calculator">VendorQuotationCalculator</div>
}))
vi.mock('../calculators/SavingsGoalCalculator', () => ({
  default: () => <div data-testid="savingsgoalcalculator-calculator">SavingsGoalCalculator</div>
}))
vi.mock('../calculators/BillSplitCalculator', () => ({
  default: () => <div data-testid="billsplitcalculator-calculator">BillSplitCalculator</div>
}))
vi.mock('../calculators/TipCalculator', () => ({
  default: () => <div data-testid="tipcalculator-calculator">TipCalculator</div>
}))
vi.mock('../calculators/SubscriptionCalculator', () => ({
  default: () => <div data-testid="subscriptioncalculator-calculator">SubscriptionCalculator</div>
}))
vi.mock('../calculators/DailyInterestCalculator', () => ({
  default: () => <div data-testid="dailyinterestcalculator-calculator">DailyInterestCalculator</div>
}))
vi.mock('../calculators/MonthlyExpenseCalculator', () => ({
  default: () => <div data-testid="monthlyexpensecalculator-calculator">MonthlyExpenseCalculator</div>
}))
vi.mock('../calculators/DailySpendingCalculator', () => ({
  default: () => <div data-testid="dailyspendingcalculator-calculator">DailySpendingCalculator</div>
}))
vi.mock('../calculators/GroceryBudgetCalculator', () => ({
  default: () => <div data-testid="grocerybudgetcalculator-calculator">GroceryBudgetCalculator</div>
}))
vi.mock('../calculators/CommuteCostCalculator', () => ({
  default: () => <div data-testid="commutecostcalculator-calculator">CommuteCostCalculator</div>
}))
vi.mock('../calculators/WFHSavingsCalculator', () => ({
  default: () => <div data-testid="wfhsavingscalculator-calculator">WFHSavingsCalculator</div>
}))
vi.mock('../calculators/HabitCostCalculator', () => ({
  default: () => <div data-testid="habitcostcalculator-calculator">HabitCostCalculator</div>
}))

// Mock FinanceGame
vi.mock('../components/FinanceGame', () => ({
  default: () => <div data-testid="finance-game">Finance Game</div>
}))

// Mock all components
vi.mock('../components/Header', () => ({
  default: () => <header data-testid="header">Header</header>
}))

vi.mock('../components/ComparisonPanel', () => ({
  default: () => <div data-testid="comparison-panel">Comparison Panel</div>
}))

vi.mock('../components/FloatingComparisonButton', () => ({
  default: () => <button data-testid="floating-comparison-button">Compare</button>
}))

vi.mock('../components/Breadcrumb', () => ({
  default: ({ currentCalculator, currentCategory }) => (
    <nav data-testid="breadcrumb">
      <span>Home</span>
      {currentCategory && <span>{' / '}{currentCategory.title}</span>}
      {currentCalculator && <span>{' / '}{currentCalculator.name}</span>}
    </nav>
  )
}))

// Mock all SEO components
vi.mock('../components/SEOAnalytics', () => ({
  default: () => <div data-testid="seoanalytics">SEOAnalytics</div>
}))
vi.mock('../components/CalculatorDescription', () => ({
  default: () => <div data-testid="calculatordescription">CalculatorDescription</div>
}))
vi.mock('../components/SEOEnhancer', () => ({
  default: () => <div data-testid="seoenhancer">SEOEnhancer</div>
}))
vi.mock('../components/SEOContent', () => ({
  default: () => <div data-testid="seocontent">SEOContent</div>
}))
vi.mock('../components/AdvancedSEO', () => ({
  default: () => <div data-testid="advancedseo">AdvancedSEO</div>
}))
vi.mock('../components/SEOPerformanceMonitor', () => ({
  default: () => <div data-testid="seoperformancemonitor">SEOPerformanceMonitor</div>
}))
vi.mock('../components/SEOAudit', () => ({
  default: () => <div data-testid="seoaudit">SEOAudit</div>
}))

// Mock BreathingExercise
vi.mock('../components/common/effects', () => ({
  BreathingExercise: () => <div data-testid="breathing-exercise">Breathing Exercise</div>
}))

// Mock contexts
vi.mock('../contexts/ComparisonContext', () => ({
  ComparisonProvider: ({ children }) => <div data-testid="comparison-provider">{children}</div>
}))

vi.mock('../contexts/CurrencyContext', () => ({
  CurrencyProvider: ({ children }) => <div data-testid="currency-provider">{children}</div>
}))

vi.mock('../contexts/ViewModeContext', () => ({
  ViewModeProvider: ({ children }) => <div data-testid="viewmode-provider">{children}</div>
}))

// Mock SEO hook
vi.mock('../hooks/useSEO', () => ({
  useSEO: () => {}
}))

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    nav: ({ children, ...props }) => <nav {...props}>{children}</nav>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }) => children,
}))

describe('App', () => {
  beforeEach(() => {
    localStorage.clear()
    // Reset URL
    window.history.replaceState({}, '', '/')
  })

  it('should render without crashing', () => {
    render(<App />)

    // Just check that the app renders without throwing errors
    expect(document.body).toBeInTheDocument()
  })

  it('should render main content', () => {
    render(<App />)

    // Look for the calculator component which indicates the app is working
    const calculatorComponent = screen.getByTestId('emi-calculator')
    expect(calculatorComponent).toBeInTheDocument()
  })

  it('should be responsive', () => {
    // Test mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    })

    render(<App />)

    // Should render without errors on mobile
    expect(document.body).toBeInTheDocument()
  })
})
