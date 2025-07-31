import { describe, test, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SEOContent from '../../components/SEOContent'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>
  }
}))

// Mock Lucide React icons
vi.mock('lucide-react', () => ({
  Search: ({ className, ...props }) => <div data-testid="search-icon" className={className} {...props} />,
  TrendingUp: ({ className, ...props }) => <div data-testid="trending-up-icon" className={className} {...props} />,
  Users: ({ className, ...props }) => <div data-testid="users-icon" className={className} {...props} />,
  Star: ({ className, ...props }) => <div data-testid="star-icon" className={className} {...props} />
}))

// Mock calculator descriptions
vi.mock('../../data/calculatorDescriptions', () => ({
  getCalculatorDescription: vi.fn()
}))

// Mock related calculators utility
vi.mock('../../utils/relatedCalculators', () => ({
  getRelatedCalculators: vi.fn()
}))

import { getCalculatorDescription } from '../../data/calculatorDescriptions'
import { getRelatedCalculators } from '../../utils/relatedCalculators'

describe('SEOContent', () => {
  const user = userEvent.setup()

  const mockDescription = {
    title: 'EMI Calculator - Calculate Loan EMI Online',
    description: 'Calculate your loan EMI with our free online calculator',
    seoKeywords: 'emi calculator, loan calculator, monthly payment, interest rate',
    searchQueries: [
      'How to calculate EMI?',
      'What is EMI formula?',
      'Calculate loan payment'
    ]
  }

  const mockRelatedCalculators = [
    {
      id: 'sip',
      name: 'SIP Calculator',
      description: 'Calculate SIP returns',
      icon: '📈',
      category: 'Investment'
    },
    {
      id: 'ppf',
      name: 'PPF Calculator',
      description: 'Calculate PPF maturity',
      icon: '🏦',
      category: 'Tax Saving'
    }
  ]

  const defaultProps = {
    calculatorId: 'emi',
    categoryColor: 'indigo',
    calculatorData: {}
  }

  beforeEach(() => {
    vi.clearAllMocks()
    getCalculatorDescription.mockReturnValue(mockDescription)
    getRelatedCalculators.mockReturnValue(mockRelatedCalculators)
  })

  describe('🏗️ Component Rendering', () => {
    test('should render SEO content with related calculators', () => {
      render(<SEOContent {...defaultProps} />)

      expect(screen.getByText('Related Tools')).toBeInTheDocument()
      expect(screen.getByText('SIP Calculator')).toBeInTheDocument()
      expect(screen.getByText('PPF Calculator')).toBeInTheDocument()
    })

    test('should render SEO stats section', () => {
      render(<SEOContent {...defaultProps} />)

      expect(screen.getByText('50K+')).toBeInTheDocument()
      expect(screen.getByText('Monthly Users')).toBeInTheDocument()
      expect(screen.getByText('99.9%')).toBeInTheDocument()
      expect(screen.getByText('Accuracy Rate')).toBeInTheDocument()
      expect(screen.getByText('4.8/5')).toBeInTheDocument()
      expect(screen.getByText('User Rating')).toBeInTheDocument()
    })

    test('should render SEO keywords section', () => {
      render(<SEOContent {...defaultProps} />)

      expect(screen.getByText('Related Keywords:')).toBeInTheDocument()
      expect(screen.getByText('emi calculator')).toBeInTheDocument()
      expect(screen.getByText('loan calculator')).toBeInTheDocument()
      expect(screen.getByText('monthly payment')).toBeInTheDocument()
    })

    test('should render call to action section', () => {
      render(<SEOContent {...defaultProps} />)

      expect(screen.getByText('💡 Pro Tip:')).toBeInTheDocument()
      expect(screen.getByText(/Bookmark this calculator/)).toBeInTheDocument()
    })

    test('should render with proper icons', () => {
      render(<SEOContent {...defaultProps} />)

      expect(screen.getByTestId('search-icon')).toBeInTheDocument()
      expect(screen.getByTestId('users-icon')).toBeInTheDocument()
      expect(screen.getByTestId('trending-up-icon')).toBeInTheDocument()
      expect(screen.getByTestId('star-icon')).toBeInTheDocument()
    })
  })

  describe('🎨 Color Themes', () => {
    test('should apply blue color theme', () => {
      const { container } = render(<SEOContent {...defaultProps} categoryColor="blue" />)

      const blueElement = container.querySelector('.bg-blue-50')
      expect(blueElement).toBeInTheDocument()
    })

    test('should apply green color theme', () => {
      const { container } = render(<SEOContent {...defaultProps} categoryColor="green" />)

      const greenElement = container.querySelector('.bg-green-50')
      expect(greenElement).toBeInTheDocument()
    })

    test('should apply purple color theme', () => {
      const { container } = render(<SEOContent {...defaultProps} categoryColor="purple" />)

      const purpleElement = container.querySelector('.bg-purple-50')
      expect(purpleElement).toBeInTheDocument()
    })

    test('should default to indigo theme for invalid color', () => {
      const { container } = render(<SEOContent {...defaultProps} categoryColor="invalid" />)

      const indigoElement = container.querySelector('.bg-indigo-50')
      expect(indigoElement).toBeInTheDocument()
    })
  })

  describe('🖱️ User Interactions', () => {
    test('should handle related calculator clicks', async () => {
      // Mock window.location.href
      delete window.location
      window.location = { href: '' }

      render(<SEOContent {...defaultProps} />)

      const sipCalculator = screen.getByText('SIP Calculator').closest('div')
      await user.click(sipCalculator)

      expect(window.location.href).toBe('?calculator=sip')
    })

    test('should handle multiple related calculator clicks', async () => {
      delete window.location
      window.location = { href: '' }

      render(<SEOContent {...defaultProps} />)

      const ppfCalculator = screen.getByText('PPF Calculator').closest('div')
      await user.click(ppfCalculator)

      expect(window.location.href).toBe('?calculator=ppf')
    })
  })

  describe('🔧 Edge Cases', () => {
    test('should return null when no description is provided', () => {
      getCalculatorDescription.mockReturnValue(null)

      const { container } = render(<SEOContent {...defaultProps} />)
      expect(container.firstChild).toBeNull()
    })

    test('should return null when description has no searchQueries', () => {
      getCalculatorDescription.mockReturnValue({
        ...mockDescription,
        searchQueries: null
      })

      const { container } = render(<SEOContent {...defaultProps} />)
      expect(container.firstChild).toBeNull()
    })

    test('should handle empty related calculators', () => {
      getRelatedCalculators.mockReturnValue([])

      render(<SEOContent {...defaultProps} />)

      expect(screen.queryByText('Related Tools')).not.toBeInTheDocument()
      expect(screen.getByText('50K+')).toBeInTheDocument() // Other sections should still render
    })

    test('should handle missing seoKeywords', () => {
      getCalculatorDescription.mockReturnValue({
        ...mockDescription,
        seoKeywords: null
      })

      render(<SEOContent {...defaultProps} />)

      expect(screen.queryByText('Related Keywords:')).not.toBeInTheDocument()
      expect(screen.getByText('50K+')).toBeInTheDocument() // Other sections should still render
    })

    test('should limit keywords to 8 items', () => {
      const longKeywords = 'keyword1, keyword2, keyword3, keyword4, keyword5, keyword6, keyword7, keyword8, keyword9, keyword10'
      getCalculatorDescription.mockReturnValue({
        ...mockDescription,
        seoKeywords: longKeywords
      })

      render(<SEOContent {...defaultProps} />)

      expect(screen.getByText('keyword1')).toBeInTheDocument()
      expect(screen.getByText('keyword8')).toBeInTheDocument()
      expect(screen.queryByText('keyword9')).not.toBeInTheDocument()
    })

    test('should handle calculators without category', () => {
      const calculatorsWithoutCategory = [
        {
          id: 'test',
          name: 'Test Calculator',
          description: 'Test description',
          icon: '🧮'
          // No category
        }
      ]
      getRelatedCalculators.mockReturnValue(calculatorsWithoutCategory)

      render(<SEOContent {...defaultProps} />)

      expect(screen.getByText('Test Calculator')).toBeInTheDocument()
      expect(screen.getByText('Test description')).toBeInTheDocument()
    })
  })

  describe('📱 Responsive Layout', () => {
    test('should have responsive grid classes', () => {
      render(<SEOContent {...defaultProps} />)

      const relatedGrid = screen.getByText('SIP Calculator').closest('.grid')
      expect(relatedGrid).toHaveClass('grid-cols-1', 'md:grid-cols-3')

      const statsGrid = screen.getByText('50K+').closest('.grid')
      expect(statsGrid).toHaveClass('grid-cols-1', 'md:grid-cols-3')
    })

    test('should have proper spacing and padding', () => {
      const { container } = render(<SEOContent {...defaultProps} />)

      const mainContainer = container.querySelector('.rounded-xl')
      expect(mainContainer).toHaveClass('p-6', 'mt-6')
    })
  })

  describe('🔍 SEO Features', () => {
    test('should display proper SEO statistics', () => {
      render(<SEOContent {...defaultProps} />)

      // Check all statistics are displayed
      expect(screen.getByText('50K+')).toBeInTheDocument()
      expect(screen.getByText('99.9%')).toBeInTheDocument()
      expect(screen.getByText('4.8/5')).toBeInTheDocument()
    })

    test('should show keyword tags with proper styling', () => {
      render(<SEOContent {...defaultProps} />)

      const keywordTag = screen.getByText('emi calculator')
      expect(keywordTag).toHaveClass('px-3', 'py-1', 'bg-white', 'rounded-full')
    })

    test('should display pro tip with proper formatting', () => {
      render(<SEOContent {...defaultProps} />)

      const proTip = screen.getByText('💡 Pro Tip:')
      expect(proTip).toHaveClass('font-semibold')
    })
  })
})
