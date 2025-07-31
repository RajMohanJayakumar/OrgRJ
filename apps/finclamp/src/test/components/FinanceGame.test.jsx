import { describe, test, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import FinanceGame from '../../components/FinanceGame'
import { CurrencyProvider } from '../../contexts/CurrencyContext'

// Mock dependencies
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
    h1: ({ children, ...props }) => <h1 {...props}>{children}</h1>,
    h2: ({ children, ...props }) => <h2 {...props}>{children}</h2>,
    h3: ({ children, ...props }) => <h3 {...props}>{children}</h3>,
    p: ({ children, ...props }) => <p {...props}>{children}</p>
  },
  AnimatePresence: ({ children }) => children
}))

vi.mock('../ParticleEffect', () => ({
  default: ({ type }) => <div data-testid="particle-effect" data-type={type}>Particles</div>
}))

vi.mock('../../data/financeQuestions', () => ({
  getTotalQuestions: vi.fn(() => 100),
  questionCategories: {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced'
  }
}))

vi.mock('../../utils/questionLoader', () => ({
  useQuestionLoader: vi.fn(() => ({
    getRandomQuestions: vi.fn(async () => [{
      id: 1,
      question: 'What is compound interest?',
      options: ['A', 'B', 'C', 'D'],
      correct: 0,
      explanation: 'Test explanation',
      category: 'beginner'
    }]),
    preloadAllLevels: vi.fn()
  }))
}))

// Test wrapper with CurrencyProvider
const TestWrapper = ({ children }) => {
  Object.defineProperty(window, 'location', {
    value: {
      search: '?currency=dollar',
      href: 'http://localhost:3000?currency=dollar'
    },
    writable: true
  })

  return (
    <CurrencyProvider>
      {children}
    </CurrencyProvider>
  )
}

describe('FinanceGame', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(() => '0'),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn()
      },
      writable: true
    })
  })

  describe('🏗️ Component Rendering', () => {
    test('should render main menu by default', () => {
      render(
        <TestWrapper>
          <FinanceGame />
        </TestWrapper>
      )

      expect(screen.getByText(/Finance Quest/)).toBeInTheDocument()
      expect(screen.getByText(/Test your financial knowledge/)).toBeInTheDocument()
      expect(screen.getByText(/🚀 Start Game/)).toBeInTheDocument()
    })

    test('should display high score from localStorage', () => {
      window.localStorage.getItem.mockReturnValue('1500')

      render(
        <TestWrapper>
          <FinanceGame />
        </TestWrapper>
      )

      expect(screen.getByText(/Beat your personal best:/)).toBeInTheDocument()
      expect(screen.getByText(/\$1,500/)).toBeInTheDocument()
    })

    test('should display total questions available', () => {
      render(
        <TestWrapper>
          <FinanceGame />
        </TestWrapper>
      )

      expect(screen.getByText(/100\+ comprehensive financial questions covering:/)).toBeInTheDocument()
    })
  })

  describe('♿ Accessibility', () => {
    test('should have proper button roles', () => {
      render(
        <TestWrapper>
          <FinanceGame />
        </TestWrapper>
      )

      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)
    })

    test('should have proper heading structure', () => {
      render(
        <TestWrapper>
          <FinanceGame />
        </TestWrapper>
      )

      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    })
  })
})