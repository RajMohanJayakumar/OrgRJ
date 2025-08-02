
import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './App.css'
import './styles/mobile.css'
import PWALoader from './components/PWALoader'

// Calculator Components
import SIPCalculator from './calculators/SIPCalculator'
import SWPCalculator from './calculators/SWPCalculator'
import EMICalculator from './calculators/EMICalculator'
import FDCalculator from './calculators/FDCalculator'
import RDCalculator from './calculators/RDCalculator'
import PPFCalculator from './calculators/PPFCalculator'
import TaxCalculator from './calculators/TaxCalculator'
import CAGRCalculator from './calculators/CAGRCalculator'
import NPSCalculator from './calculators/NPSCalculator'
import EPFCalculator from './calculators/EPFCalculator'
import GratuityCalculator from './calculators/GratuityCalculator'
import CompoundInterestCalculator from './calculators/CompoundInterestCalculator'
import SimpleInterestCalculator from './calculators/SimpleInterestCalculator'
import InflationCalculator from './calculators/InflationCalculator'
import RealEstateCalculator from './calculators/RealEstateCalculator'
import PropertyValuationCalculator from './calculators/PropertyValuationCalculator'
import RentVsBuyCalculator from './calculators/RentVsBuyCalculator'
import PropertyTaxCalculator from './calculators/PropertyTaxCalculator'
import NetWorthCalculator from './calculators/NetWorthCalculator'
import DiscountCalculator from './calculators/DiscountCalculator'
import FuelCostCalculator from './calculators/FuelCostCalculator'
import StockAverageCalculator from './calculators/StockAverageCalculator'
import BudgetPlannerCalculator from './calculators/BudgetPlannerCalculator'

import VendorQuotationCalculator from './calculators/VendorQuotationCalculator'
import SavingsGoalCalculator from './calculators/SavingsGoalCalculator'
import BillSplitCalculator from './calculators/BillSplitCalculator'
import TipCalculator from './calculators/TipCalculator'
import SubscriptionCalculator from './calculators/SubscriptionCalculator'
import DailyInterestCalculator from './calculators/DailyInterestCalculator'
import MonthlyExpenseCalculator from './calculators/MonthlyExpenseCalculator'
import DailySpendingCalculator from './calculators/DailySpendingCalculator'
import GroceryBudgetCalculator from './calculators/GroceryBudgetCalculator'
import CommuteCostCalculator from './calculators/CommuteCostCalculator'

import WFHSavingsCalculator from './calculators/WFHSavingsCalculator'
import HabitCostCalculator from './calculators/HabitCostCalculator'
import FinanceGame from './components/FinanceGame'
import BubbleWrap from './components/stress-busters/BubbleWrap'
import GuidedBreathing from './components/stress-busters/BreathingExercise'
import ColorTherapy from './components/stress-busters/ColorTherapy'
import StressSqueezer from './components/stress-busters/StressSqueezer'
import MindfulDoodling from './components/stress-busters/MindfulDoodling'


// Components
import Header from './components/Header'
import ComparisonPanel from './components/ComparisonPanel'
import FloatingComparisonButton from './components/FloatingComparisonButton'
import Breadcrumb from './components/Breadcrumb'
import SEOAnalytics from './components/SEOAnalytics'
import CalculatorDescription from './components/CalculatorDescription'
import SEOEnhancer from './components/SEOEnhancer'
import SEOContent from './components/SEOContent'
import AdvancedSEO from './components/AdvancedSEO'
import SEOPerformanceMonitor from './components/SEOPerformanceMonitor'
import SEOAudit from './components/SEOAudit'
import { BreathingExercise as FloatingBreathingButton } from './components/common/effects'
import DownloadNotification from './components/DownloadNotification'
import PDFContentTest from './components/PDFContentTest'
import PDFDesignSamples from './components/PDFDesignSamples'

// Context
import { ComparisonProvider } from './contexts/ComparisonContext'
import { CurrencyProvider } from './contexts/CurrencyContext'
import { ViewModeProvider } from './contexts/ViewModeContext'

// SEO Hook
import { useSEO } from './hooks/useSEO'

const calculatorData = {
  loans: {
    title: "Loans",
    icon: "💰",
    color: "blue",
    calculators: [
      { id: 'emi', name: 'EMI Calculator', icon: '🏠', component: EMICalculator, description: 'Calculate loan EMI and repayment schedule' },
      { id: 'mortgage', name: 'Mortgage Calculator', icon: '🏡', component: EMICalculator, description: 'Home loan calculator with advanced features' },
      { id: 'personal-loan', name: 'Personal Loan', icon: '💳', component: EMICalculator, description: 'Personal loan EMI calculator' }
    ]
  },
  savings: {
    title: "Savings",
    icon: "🏦",
    color: "green",
    calculators: [
      { id: 'fd', name: 'Fixed Deposit', icon: '🏦', component: FDCalculator, description: 'Calculate FD maturity amount and returns' },
      { id: 'rd', name: 'Recurring Deposit', icon: '💰', component: RDCalculator, description: 'RD maturity calculator' },
      { id: 'ppf', name: 'PPF Calculator', icon: '🛡️', component: PPFCalculator, description: 'Public Provident Fund calculator' }
    ]
  },
  mutual_funds: {
    title: "Mutual Funds",
    icon: "📈",
    color: "purple",
    calculators: [
      { id: 'sip', name: 'SIP Calculator', icon: '📈', component: SIPCalculator, description: 'Systematic Investment Plan calculator' },
      { id: 'swp', name: 'SWP Calculator', icon: '📉', component: SWPCalculator, description: 'Systematic Withdrawal Plan calculator' },
      { id: 'cagr', name: 'CAGR Calculator', icon: '📊', component: CAGRCalculator, description: 'Compound Annual Growth Rate calculator' }
    ]
  },
  tax: {
    title: "Tax",
    icon: "🧾",
    color: "red",
    calculators: [
      { id: 'income-tax', name: 'Income Tax', icon: '🧾', component: TaxCalculator, description: 'Calculate income tax liability' },
      { id: 'capital-gains', name: 'Capital Gains', icon: '💹', component: TaxCalculator, description: 'Calculate capital gains tax' }
    ]
  },
  retirement: {
    title: "Retirement",
    icon: "🏛️",
    color: "purple",
    calculators: [
      { id: 'nps', name: 'NPS Calculator', icon: '🏛️', component: NPSCalculator, description: 'National Pension Scheme calculator' },
      { id: 'epf', name: 'EPF Calculator', icon: '🏢', component: EPFCalculator, description: 'Employee Provident Fund calculator' },
      { id: 'gratuity', name: 'Gratuity Calculator', icon: '🎁', component: GratuityCalculator, description: 'Gratuity calculation for employees' }
    ]
  },
  personal_finance: {
    title: "Personal Finance",
    icon: "💰",
    color: "emerald",
    calculators: [
      { id: 'budget-planner', name: 'Budget Planner', icon: '📊', component: BudgetPlannerCalculator, description: 'Track income vs expenses and plan monthly budget' },
      { id: 'savings-goal', name: 'Savings Goal Tracker', icon: '🎯', component: SavingsGoalCalculator, description: 'Calculate daily/monthly savings to meet goals' },
      { id: 'stock-average', name: 'Stock Average Calculator', icon: '📈', component: StockAverageCalculator, description: 'Calculate average stock price over multiple purchases' },
      { id: 'net-worth', name: 'Net Worth Calculator', icon: '💎', component: NetWorthCalculator, description: 'Calculate your total net worth and financial position' }
    ]
  },
  real_estate: {
    title: "Real Estate",
    icon: "🏠",
    color: "orange",
    calculators: [
      { id: 'real-estate', name: 'Real Estate Calculator', icon: '🏠', component: RealEstateCalculator, description: 'Calculate home loan EMI, total costs, and affordability analysis' },
      { id: 'property-valuation', name: 'Property Valuation', icon: '🏢', component: PropertyValuationCalculator, description: 'Estimate property value based on area, location, and amenities' },
      { id: 'rent-vs-buy', name: 'Rent vs Buy Calculator', icon: '🤔', component: RentVsBuyCalculator, description: 'Compare renting vs buying costs over time to make the best decision' },
      { id: 'property-tax', name: 'Property Tax Calculator', icon: '🏛️', component: PropertyTaxCalculator, description: 'Calculate annual property tax based on value, location, and type' }
    ]
  },
  lifestyle: {
    title: "Lifestyle",
    icon: "🎯",
    color: "pink",
    calculators: [
      { id: 'bill-split', name: 'Bill Split Calculator', icon: '🧾', component: BillSplitCalculator, description: 'Split bills among friends or roommates' },
      { id: 'tip-calculator', name: 'Tip Calculator', icon: '💰', component: TipCalculator, description: 'Calculate tips and split bills with tip per person' },
      { id: 'subscription-tracker', name: 'Subscription Tracker', icon: '📱', component: SubscriptionCalculator, description: 'Track monthly/yearly cost of all subscriptions' },
      { id: 'daily-interest', name: 'Daily Interest Calculator', icon: '📅', component: DailyInterestCalculator, description: 'Calculate daily interest on short-term savings/loans' },
      { id: 'monthly-expense', name: 'Monthly Expense Split', icon: '📊', component: MonthlyExpenseCalculator, description: 'Categorize and analyze monthly expenses' },
      { id: 'daily-spending', name: 'Daily Spending Calculator', icon: '📱', component: DailySpendingCalculator, description: 'Track daily spending habits across all payment methods' },
      { id: 'grocery-budget', name: 'Grocery Budget Calculator', icon: '🛒', component: GroceryBudgetCalculator, description: 'Estimate monthly grocery needs based on family size' },
      { id: 'commute-cost', name: 'Commute Cost Calculator', icon: '🚗', component: CommuteCostCalculator, description: 'Calculate daily/weekly fuel or public transport cost' },

      { id: 'wfh-savings', name: 'WFH Savings Calculator', icon: '🏠', component: WFHSavingsCalculator, description: 'Calculate work-from-home cost savings' },
      { id: 'habit-cost', name: 'Coffee/Smoking Cost Tracker', icon: '☕', component: HabitCostCalculator, description: 'See how small habits affect your wallet over time' }
    ]
  },
  general: {
    title: "General",
    icon: "🧮",
    color: "gray",
    calculators: [
      { id: 'discount', name: 'Discount Calculator', icon: '🏷️', component: DiscountCalculator, description: 'Calculate final price after percentage discounts' },
      { id: 'fuel-cost', name: 'Fuel Cost Calculator', icon: '⛽', component: FuelCostCalculator, description: 'Calculate daily/monthly fuel expenses based on mileage' },
      { id: 'compound-interest', name: 'Compound Interest', icon: '🧮', component: CompoundInterestCalculator, description: 'Calculate compound interest and growth' },
      { id: 'simple-interest', name: 'Simple Interest', icon: '📊', component: SimpleInterestCalculator, description: 'Calculate simple interest' },
      { id: 'inflation', name: 'Inflation Calculator', icon: '📈', component: InflationCalculator, description: 'Calculate inflation impact over time' },

      { id: 'vendor-quotation', name: 'Vendor Quotation', icon: '�', component: VendorQuotationCalculator, description: 'Universal quotation tool for any vendor with tax options and draft mode' }
    ]
  },
  games: {
    title: "Games",
    icon: "🎮",
    color: "purple",
    calculators: [
      { id: 'finance-quest', name: 'Finance Quest', icon: '💰', component: FinanceGame, description: 'Test your financial knowledge in this interactive quiz game' }
    ]
  },
  stress_buster: {
    title: "Stress Buster",
    icon: "🧘",
    color: "teal",
    calculators: [
      { id: 'bubble-wrap', name: 'Bubble Wrap', icon: '🫧', component: BubbleWrap, description: 'Pop bubbles to relax and relieve stress between calculations' },
      { id: 'breathing-exercise', name: 'Guided Breathing', icon: '🌬️', component: GuidedBreathing, description: 'Guided breathing exercises to reduce stress and improve focus' },
      { id: 'color-therapy', name: 'Color Therapy', icon: '🎨', component: ColorTherapy, description: 'Immerse yourself in healing colors to enhance mood and well-being' },
      { id: 'stress-squeezer', name: 'Stress Squeezer', icon: '🤏', component: StressSqueezer, description: 'Squeeze virtual stress balls with satisfying feedback and sounds' },
      { id: 'mindful-doodling', name: 'Mindful Doodling', icon: '✏️', component: MindfulDoodling, description: 'Express yourself through therapeutic drawing and guided prompts' }
    ]
  }
}

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

export default function App() {
  // Function to detect calculator from URL parameters
  const detectCalculatorFromURL = () => {
    try {
      const urlParams = new URLSearchParams(window.location.search)
      const pathname = window.location.pathname

    // First, check for new main menu format: /games?in=finance-quest or /calculators?in=emi or /stress-buster?in=bubble-wrap
    const inParam = urlParams.get('in')
    if (pathname && inParam) {
      const pathSegment = pathname.replace('/', '')
      if (pathSegment === 'games') {
        return { mainTab: 'games', subTab: inParam }
      } else if (pathSegment === 'stress-buster') {
        return { mainTab: 'stress_buster', subTab: inParam }
      } else if (pathSegment === 'calculators') {
        // Map calculator to appropriate category
        const calculatorCategoryMap = {
          'emi': 'loans', 'mortgage': 'loans', 'personal-loan': 'loans',
          'fd': 'savings', 'rd': 'savings', 'ppf': 'savings',
          'sip': 'mutual_funds', 'swp': 'mutual_funds', 'cagr': 'mutual_funds',
          'income-tax': 'tax', 'capital-gains': 'tax',
          'nps': 'retirement', 'epf': 'retirement', 'gratuity': 'retirement',
          'budget-planner': 'personal_finance', 'savings-goal': 'personal_finance', 'stock-average': 'personal_finance', 'net-worth': 'personal_finance',
          'real-estate': 'real_estate', 'property-valuation': 'real_estate', 'rent-vs-buy': 'real_estate', 'property-tax': 'real_estate',
          'bill-split': 'lifestyle', 'tip': 'lifestyle', 'subscription': 'lifestyle', 'daily-interest': 'lifestyle', 'monthly-expense': 'lifestyle', 'daily-spending': 'lifestyle', 'grocery-budget': 'lifestyle', 'commute-cost': 'lifestyle', 'wfh-savings': 'lifestyle', 'habit-cost': 'lifestyle',
          'discount': 'general', 'fuel-cost': 'general', 'compound-interest': 'general', 'simple-interest': 'general', 'inflation': 'general', 'vendor-quotation': 'general',
          'finance-quest': 'games', 'bubble-wrap': 'stress_buster', 'breathing-exercise': 'stress_buster',
          'color-therapy': 'stress_buster', 'stress-squeezer': 'stress_buster', 'mindful-doodling': 'stress_buster'
        }
        const category = calculatorCategoryMap[inParam] || 'general'
        return { mainTab: category, subTab: inParam }
      }
    }

    // Second, check for legacy format: ?category=games&in=finance-quest
    const categoryParam = urlParams.get('category')
    if (categoryParam && inParam) {
      return { mainTab: categoryParam, subTab: inParam }
    }

    // Third, check for explicit calculator parameter (legacy format)
    const calculatorParam = urlParams.get('calculator')
    if (calculatorParam) {
      // Map calculator names to tab info
      const calculatorNameMap = {
        'income-tax': { mainTab: 'tax', subTab: 'income-tax' },
        'capital-gains': { mainTab: 'tax', subTab: 'capital-gains' },
        'sip': { mainTab: 'mutual_funds', subTab: 'sip' },
        'swp': { mainTab: 'mutual_funds', subTab: 'swp' },
        'cagr': { mainTab: 'mutual_funds', subTab: 'cagr' },
        'emi': { mainTab: 'loans', subTab: 'emi' },
        'mortgage': { mainTab: 'loans', subTab: 'mortgage' },
        'personal-loan': { mainTab: 'loans', subTab: 'personal-loan' },
        'ppf': { mainTab: 'savings', subTab: 'ppf' },
        'fd': { mainTab: 'savings', subTab: 'fd' },
        'rd': { mainTab: 'savings', subTab: 'rd' },
        'nps': { mainTab: 'retirement', subTab: 'nps' },
        'epf': { mainTab: 'retirement', subTab: 'epf' },
        'gratuity': { mainTab: 'retirement', subTab: 'gratuity' },
        'budget-planner': { mainTab: 'personal_finance', subTab: 'budget-planner' },
        'savings-goal': { mainTab: 'personal_finance', subTab: 'savings-goal' },
        'stock-average': { mainTab: 'personal_finance', subTab: 'stock-average' },
        'net-worth': { mainTab: 'personal_finance', subTab: 'net-worth' },
        'bill-split': { mainTab: 'lifestyle', subTab: 'bill-split' },
        'tip-calculator': { mainTab: 'lifestyle', subTab: 'tip-calculator' },
        'subscription-tracker': { mainTab: 'lifestyle', subTab: 'subscription-tracker' },
        'daily-interest': { mainTab: 'lifestyle', subTab: 'daily-interest' },
        'monthly-expense': { mainTab: 'lifestyle', subTab: 'monthly-expense' },
        'daily-spending': { mainTab: 'lifestyle', subTab: 'daily-spending' },
        'grocery-budget': { mainTab: 'lifestyle', subTab: 'grocery-budget' },
        'commute-cost': { mainTab: 'lifestyle', subTab: 'commute-cost' },

        'wfh-savings': { mainTab: 'lifestyle', subTab: 'wfh-savings' },
        'habit-cost': { mainTab: 'lifestyle', subTab: 'habit-cost' },
        'discount': { mainTab: 'general', subTab: 'discount' },
        'fuel-cost': { mainTab: 'general', subTab: 'fuel-cost' },
        'compound-interest': { mainTab: 'general', subTab: 'compound-interest' },
        'simple-interest': { mainTab: 'general', subTab: 'simple-interest' },
        'inflation': { mainTab: 'general', subTab: 'inflation' },
        'vendor-quotation': { mainTab: 'general', subTab: 'vendor-quotation' },
        'finance-quest': { mainTab: 'games', subTab: 'finance-quest' },
        'bubble-wrap': { mainTab: 'stress_buster', subTab: 'bubble-wrap' },
        'breathing-exercise': { mainTab: 'stress_buster', subTab: 'breathing-exercise' },
        'color-therapy': { mainTab: 'stress_buster', subTab: 'color-therapy' },
        'stress-squeezer': { mainTab: 'stress_buster', subTab: 'stress-squeezer' },
        'mindful-doodling': { mainTab: 'stress_buster', subTab: 'mindful-doodling' }
      }

      if (calculatorNameMap[calculatorParam]) {
        return calculatorNameMap[calculatorParam]
      }
    }

    // Fallback: Map of parameter prefixes to calculator info (for backward compatibility)
    const calculatorMap = {
      'tax_': { mainTab: 'tax', subTab: 'income-tax' },
      'sip_': { mainTab: 'mutual_funds', subTab: 'sip' },
      'swp_': { mainTab: 'mutual_funds', subTab: 'swp' },
      'emi_': { mainTab: 'loans', subTab: 'emi' },
      'ppf_': { mainTab: 'savings', subTab: 'ppf' },
      'fd_': { mainTab: 'savings', subTab: 'fd' },
      'rd_': { mainTab: 'savings', subTab: 'rd' },
      'nps_': { mainTab: 'retirement', subTab: 'nps' },
      'epf_': { mainTab: 'retirement', subTab: 'epf' },
      'cagr_': { mainTab: 'mutual_funds', subTab: 'cagr' },
      'compound_': { mainTab: 'general', subTab: 'compound-interest' },
      'simple_': { mainTab: 'general', subTab: 'simple-interest' },
      'inflation_': { mainTab: 'general', subTab: 'inflation' },
      'vendor_quotation_': { mainTab: 'general', subTab: 'vendor-quotation' },
      'gratuity_': { mainTab: 'retirement', subTab: 'gratuity' }
    }

    // Find matching calculator by parameter prefix
    const paramKeys = Array.from(urlParams.keys())
    for (const paramKey of paramKeys) {
      for (const [prefix, calculator] of Object.entries(calculatorMap)) {
        if (paramKey.startsWith(prefix)) {
          return calculator
        }
      }
    }

    return null
    } catch (error) {
      console.warn('Error detecting calculator from URL:', error)
      // Fallback to default
      return { mainTab: 'loans', subTab: 'emi' }
    }
  }

  const detectedCalculator = detectCalculatorFromURL()

  const [activeMainTab, setActiveMainTab] = useState(detectedCalculator?.mainTab || 'loans')
  const [activeSubTabs, setActiveSubTabs] = useState({
    loans: detectedCalculator?.mainTab === 'loans' ? detectedCalculator.subTab : 'emi',
    savings: detectedCalculator?.mainTab === 'savings' ? detectedCalculator.subTab : 'fd',
    mutual_funds: detectedCalculator?.mainTab === 'mutual_funds' ? detectedCalculator.subTab : 'sip',
    tax: detectedCalculator?.mainTab === 'tax' ? detectedCalculator.subTab : 'income-tax',
    retirement: detectedCalculator?.mainTab === 'retirement' ? detectedCalculator.subTab : 'nps',
    personal_finance: detectedCalculator?.mainTab === 'personal_finance' ? detectedCalculator.subTab : 'budget-planner',
    real_estate: detectedCalculator?.mainTab === 'real_estate' ? detectedCalculator.subTab : 'real-estate',
    lifestyle: detectedCalculator?.mainTab === 'lifestyle' ? detectedCalculator.subTab : 'bill-split',
    general: detectedCalculator?.mainTab === 'general' ? detectedCalculator.subTab : 'discount',
    games: detectedCalculator?.mainTab === 'games' ? detectedCalculator.subTab : 'finance-quest',
    stress_buster: detectedCalculator?.mainTab === 'stress_buster' ? detectedCalculator.subTab : 'bubble-wrap'
  })
  const [comparisonData, setComparisonData] = useState([])
  const [showPWALoader, setShowPWALoader] = useState(true)

  // Handle route changes for breadcrumb navigation
  useEffect(() => {
    const handlePopState = () => {
      // Force re-detection when user navigates via breadcrumbs or browser back/forward
      const newDetectedCalculator = detectCalculatorFromURL()
      if (newDetectedCalculator) {
        setActiveMainTab(newDetectedCalculator.mainTab)
        setActiveSubTabs(prev => ({
          ...prev,
          [newDetectedCalculator.mainTab]: newDetectedCalculator.subTab
        }))
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  // PWA Loader management
  useEffect(() => {
    // Hide loader after app is ready
    const timer = setTimeout(() => {
      setShowPWALoader(false)
    }, 1500) // Show loader for 1.5 seconds minimum (reduced from 3 seconds)

    // Hide loader when window is fully loaded
    const handleLoad = () => {
      setTimeout(() => setShowPWALoader(false), 500) // Reduced from 1 second to 500ms
    }

    if (document.readyState === 'complete') {
      handleLoad()
    } else {
      window.addEventListener('load', handleLoad)
    }

    return () => {
      clearTimeout(timer)
      window.removeEventListener('load', handleLoad)
    }
  }, [])

  const updateCalculatorInURL = useCallback((calculatorId) => {
    const url = new URL(window.location.href)

    // Clear all existing calculator-specific input parameters
    const keysToRemove = []
    for (const key of url.searchParams.keys()) {
      if (key.includes('_') || key === 'shared' || key === 'calculator' || key === 'category' || key === 'in') {
        keysToRemove.push(key)
      }
    }
    keysToRemove.forEach(key => url.searchParams.delete(key))

    // Map calculator to appropriate category for new URL format
    const calculatorCategoryMap = {
      'emi': 'calculators', 'mortgage': 'calculators', 'personal-loan': 'calculators',
      'fd': 'calculators', 'rd': 'calculators', 'ppf': 'calculators',
      'sip': 'calculators', 'swp': 'calculators', 'cagr': 'calculators',
      'income-tax': 'calculators', 'capital-gains': 'calculators',
      'nps': 'calculators', 'epf': 'calculators', 'gratuity': 'calculators',
      'real-estate': 'calculators', 'property-valuation': 'calculators', 'rent-vs-buy': 'calculators', 'property-tax': 'calculators',
      'compound-interest': 'calculators', 'simple-interest': 'calculators', 'inflation': 'calculators',
      'finance-quest': 'games',
      'bubble-wrap': 'stress-buster', 'breathing-exercise': 'stress-buster',
      'color-therapy': 'stress-buster', 'stress-squeezer': 'stress-buster', 'mindful-doodling': 'stress-buster'
    }

    // Set the URL format to match new structure: /calculators?in=calculator-id or /games?in=finance-quest
    const pathSegment = calculatorCategoryMap[calculatorId] || 'calculators'
    url.pathname = `/${pathSegment}`
    url.searchParams.set('in', calculatorId)

    // Update URL without page reload
    window.history.replaceState({}, '', url.toString())
  }, [])

  // Set calculator parameter in URL on initial load if not present
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const pathname = window.location.pathname
    const inParam = urlParams.get('in')
    const categoryParam = urlParams.get('category')
    const calculatorParam = urlParams.get('calculator') // Legacy support

    // If using legacy calculator parameter, convert to new format
    if (calculatorParam && !inParam) {
      updateCalculatorInURL(calculatorParam)
      return
    }

    // Check if we're on root path without proper routing
    if (pathname === '/' && !inParam && !categoryParam && !calculatorParam) {
      // Set default calculator parameter using new format
      const currentCalculatorId = activeSubTabs[activeMainTab]
      updateCalculatorInURL(currentCalculatorId)
    }
  }, [updateCalculatorInURL, activeMainTab, activeSubTabs])

  // Ensure URL stays synchronized with selected calculator
  useEffect(() => {
    const currentCalculatorId = activeSubTabs[activeMainTab]
    if (currentCalculatorId) {
      // Check if URL parameter matches current calculator
      const urlParams = new URLSearchParams(window.location.search)
      const urlCalculatorParam = urlParams.get('calculator') || urlParams.get('in')

      // If URL doesn't match current calculator, update it
      if (urlCalculatorParam !== currentCalculatorId) {
        updateCalculatorInURL(currentCalculatorId)
      }
    }
  }, [activeMainTab, activeSubTabs, updateCalculatorInURL])
  const [showComparison, setShowComparison] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState(null)

  // PWA Install functionality
  React.useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
  }, [])

  const handlePWAInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      await deferredPrompt.userChoice
      setDeferredPrompt(null)
    }
  }

  const addToComparison = (calculatorData) => {
    const newData = {
      id: Date.now(),
      calculator: calculatorData.calculator,
      inputs: calculatorData.inputs,
      results: calculatorData.results,
      timestamp: new Date().toISOString()
    }
    setComparisonData(prev => [...prev, newData])
    setShowComparison(true)
  }

  const removeFromComparison = (id) => {
    setComparisonData(prev => prev.filter(item => item.id !== id))
    if (comparisonData.length <= 1) {
      setShowComparison(false)
    }
  }

  const shareApp = () => {
    const shareData = {
      title: 'FinClamp - Financial Calculator Suite',
      text: 'Complete financial calculator suite for all your financial planning needs!',
      url: window.location.href
    }

    if (navigator.share) {
      navigator.share(shareData)
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('App link copied to clipboard!')
    }
  }

  const handleSubTabChange = (categoryKey, calculatorId) => {
    setActiveSubTabs(prev => ({ ...prev, [categoryKey]: calculatorId }))
    // Update URL with calculator name
    updateCalculatorInURL(calculatorId)
  }

  const handleMainTabChange = (tabKey) => {
    setActiveMainTab(tabKey)
    // Get the current calculator for this tab (or default to first one)
    const currentCalculatorForTab = activeSubTabs[tabKey] || calculatorData[tabKey]?.calculators[0]?.id
    if (currentCalculatorForTab) {
      // Update the sub tab state to ensure consistency
      setActiveSubTabs(prev => ({ ...prev, [tabKey]: currentCalculatorForTab }))
      // Update URL to reflect the selected calculator
      updateCalculatorInURL(currentCalculatorForTab)
    }
  }

  const handleCalculatorSelect = (calculatorId) => {
    // Find which category this calculator belongs to
    for (const [categoryKey, category] of Object.entries(calculatorData)) {
      const calculator = category.calculators.find(calc => calc.id === calculatorId)
      if (calculator) {
        setActiveMainTab(categoryKey)
        setActiveSubTabs(prev => ({ ...prev, [categoryKey]: calculatorId }))
        // Update URL immediately to ensure synchronization
        updateCalculatorInURL(calculatorId)
        break
      }
    }
  }

  const currentCategory = calculatorData[activeMainTab]
  const currentCalculator = currentCategory?.calculators.find(calc => calc.id === activeSubTabs[activeMainTab])

  // Use SEO hook to update meta tags when calculator changes
  const currentCalculatorId = activeSubTabs[activeMainTab]
  useSEO(currentCalculatorId)

  // Check for special pages
  const urlParams = new URLSearchParams(window.location.search)
  if (urlParams.get('test') === 'pdf') {
    return <PDFContentTest />
  }
  if (urlParams.get('design') === 'pdf') {
    return <PDFDesignSamples />
  }

  return (
    <CurrencyProvider>
      <ComparisonProvider>
        <ViewModeProvider>
          <div className="min-h-screen bg-gray-50 relative">
            {/* Breathing Exercise - Hide when in guided breathing tab */}
            {currentCalculatorId !== 'breathing-exercise' && <FloatingBreathingButton />}

            {/* Download Notifications */}
            <DownloadNotification />

            {/* SEO Components */}
            <SEOEnhancer calculatorId={currentCalculatorId} />
            <SEOAnalytics calculatorId={currentCalculatorId} />
            <AdvancedSEO
              calculatorId={currentCalculatorId}
              inputs={{}}
              results={{}}
            />
            <SEOPerformanceMonitor calculatorId={currentCalculatorId} />
            <SEOAudit calculatorId={currentCalculatorId} />

            <Header />

        <motion.div
          className="w-full px-2 sm:px-4 lg:px-8 py-4 sm:py-8 relative z-10"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          {/* Breadcrumb Navigation */}
          <Breadcrumb
            currentCalculator={currentCalculator}
            currentCategory={currentCategory}
          />

          {/* Main Category Tabs */}
          <motion.div
            className="mb-6 sm:mb-8"
            variants={fadeInUp}
          >
            <div className="flex justify-center">
              <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-200 w-full max-w-5xl mx-2 sm:mx-0">
                <div className="flex flex-wrap justify-center gap-1 sm:gap-2">
                  {Object.entries(calculatorData).map(([key, category]) => (
                    <button
                      key={key}
                      onClick={() => handleMainTabChange(key)}
                      className={`px-4 py-3 sm:px-6 sm:py-3 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2 cursor-pointer text-sm ${
                        activeMainTab === key
                          ? 'bg-indigo-500 text-white shadow-md'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-lg">{category.icon}</span>
                      <span className="hidden sm:inline">{category.title}</span>
                      <span className="sm:hidden text-xs">{category.title.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Sub Category Tabs */}
          <motion.div
            className="mb-6 sm:mb-8"
            variants={fadeInUp}
          >
            <div className="flex justify-center">
              <div className="bg-white rounded-xl p-1.5 shadow-sm border border-gray-200 w-full max-w-4xl mx-2 sm:mx-0">
                <div className="flex flex-wrap justify-center gap-1 sm:gap-2">
                  {currentCategory?.calculators.map((calc) => (
                    <button
                      key={calc.id}
                      onClick={() => handleSubTabChange(activeMainTab, calc.id)}
                      className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 text-xs sm:text-sm cursor-pointer ${
                        activeSubTabs[activeMainTab] === calc.id
                          ? 'bg-emerald-500 text-white shadow-md'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-sm">{calc.icon}</span>
                      <span className="hidden sm:inline">{calc.name}</span>
                      <span className="sm:hidden text-xs">{calc.name.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Calculator Content */}
          <AnimatePresence mode="wait">
            {/* Calculator Content */}
            {currentCalculator && (
              <motion.div
                key={`${activeMainTab}-${activeSubTabs[activeMainTab]}`}
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
              >
                {/* Calculator Header */}
                <div id="calculator-title" className="px-6 py-4 bg-indigo-500 text-white border-b border-indigo-600">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <span className="text-xl">{currentCalculator.icon}</span>
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-white">{currentCalculator.name}</h1>
                      <p className="text-indigo-100 text-sm">{currentCalculator.description}</p>
                    </div>
                  </div>
                </div>

                {/* Calculator Component */}
                <div className="p-6">
                  <currentCalculator.component
                    onAddToComparison={addToComparison}
                    categoryColor={currentCategory.color}
                    currentCalculatorId={currentCalculatorId}
                    calculatorData={calculatorData}
                    onCalculatorSelect={handleCalculatorSelect}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Calculator Description Section */}
          {currentCalculator && (
            <>
              <CalculatorDescription
                calculatorId={currentCalculator.id}
                categoryColor={currentCategory.color}
              />

              {/* SEO Content Section */}
              <SEOContent
                calculatorId={currentCalculator.id}
                categoryColor={currentCategory.color}
              />


            </>
          )}
        </motion.div>
        {/* Floating Action Buttons */}
        <motion.div
          className="fixed bottom-6 right-6 md:bottom-6 md:right-6 flex flex-col space-y-3 z-50 floating-actions-mobile"
          variants={fadeInUp}
        >
          {comparisonData.length > 0 && (
            <motion.button
              onClick={() => setShowComparison(!showComparison)}
              className="relative w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-110 cursor-pointer border-2 border-white/20"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-white text-xl">📊</span>
              <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-md">
                {comparisonData.length}
              </span>
            </motion.button>
          )}

          <motion.button
            onClick={shareApp}
            className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-purple-600 hover:to-indigo-700 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-110 cursor-pointer border-2 border-white/20"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-white text-xl">🔗</span>
          </motion.button>


        </motion.div>

        {/* Comparison Panel */}
        <AnimatePresence>
          {showComparison && (
            <ComparisonPanel
              data={comparisonData}
              onRemove={removeFromComparison}
              onClose={() => setShowComparison(false)}
            />
          )}
        </AnimatePresence>

        {/* Floating Comparison Button */}
        <FloatingComparisonButton />

        {/* PWA Loader */}
        <PWALoader
          isVisible={showPWALoader}
          onComplete={() => setShowPWALoader(false)}
        />
          </div>
        </ViewModeProvider>
      </ComparisonProvider>
    </CurrencyProvider>
  )
}
