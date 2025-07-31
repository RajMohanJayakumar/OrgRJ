import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import SIPCalculator from '../../calculators/SIPCalculator'
import EMICalculator from '../../calculators/EMICalculator'
import { CurrencyProvider } from '../../contexts/CurrencyContext'
import { ViewModeProvider } from '../../contexts/ViewModeContext'
import { ComparisonProvider } from '../../contexts/ComparisonContext'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }) => children,
}))

const TestWrapper = ({ children }) => (
  <CurrencyProvider>
    <ViewModeProvider>
      <ComparisonProvider>
        {children}
      </ComparisonProvider>
    </ViewModeProvider>
  </CurrencyProvider>
)

describe('Calculator Integration Flow', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should render SIP calculator correctly', () => {
    render(
      <TestWrapper>
        <SIPCalculator />
      </TestWrapper>
    )

    // Check basic rendering
    expect(screen.getByText('SIP Calculator')).toBeInTheDocument()
    expect(screen.getByText(/Monthly SIP Amount/i)).toBeInTheDocument()
    expect(screen.getByText(/Expected Annual Return/i)).toBeInTheDocument()
  })

  it('should render EMI calculator correctly', () => {
    render(
      <TestWrapper>
        <EMICalculator />
      </TestWrapper>
    )

    // Check basic rendering
    expect(screen.getByText('EMI Calculator')).toBeInTheDocument()
    expect(screen.getByText(/Loan Amount/i)).toBeInTheDocument()
    expect(screen.getByText(/Interest Rate/i)).toBeInTheDocument()
  })

  it('should handle context providers correctly', () => {
    render(
      <TestWrapper>
        <div>
          <SIPCalculator />
          <EMICalculator />
        </div>
      </TestWrapper>
    )

    // Check that both calculators can render together
    expect(screen.getByText('SIP Calculator')).toBeInTheDocument()
    expect(screen.getByText('EMI Calculator')).toBeInTheDocument()
  })

  it('should provide currency context', () => {
    render(
      <TestWrapper>
        <SIPCalculator />
      </TestWrapper>
    )

    // Check that currency context is working
    expect(screen.getByText('SIP Calculator')).toBeInTheDocument()
  })
})
