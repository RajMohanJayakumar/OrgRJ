import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest'
import { render } from '@testing-library/react'
import SEOAnalytics from '../../components/SEOAnalytics'

describe('SEOAnalytics', () => {
  let mockGtag
  let mockSessionStorage
  let originalGtag
  let originalSessionStorage

  beforeEach(() => {
    // Mock gtag
    mockGtag = vi.fn()
    originalGtag = window.gtag
    window.gtag = mockGtag

    // Mock sessionStorage
    mockSessionStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn()
    }
    originalSessionStorage = window.sessionStorage
    Object.defineProperty(window, 'sessionStorage', {
      value: mockSessionStorage,
      writable: true
    })

    // Mock document.referrer
    Object.defineProperty(document, 'referrer', {
      value: '',
      writable: true
    })

    // Mock window.location
    delete window.location
    window.location = {
      href: 'https://example.com/calculator?in=emi',
      origin: 'https://example.com'
    }

    vi.clearAllMocks()
  })

  afterEach(() => {
    window.gtag = originalGtag
    window.sessionStorage = originalSessionStorage
    vi.clearAllTimers()
  })

  describe('🏗️ Component Rendering', () => {
    test('should render without crashing', () => {
      expect(() => {
        render(<SEOAnalytics calculatorId="emi" />)
      }).not.toThrow()
    })

    test('should return null (no visual output)', () => {
      const { container } = render(<SEOAnalytics calculatorId="emi" />)
      expect(container.firstChild).toBeNull()
    })
  })

  describe('📊 Calculator Usage Tracking', () => {
    test('should track calculator view when calculatorId is provided', () => {
      render(<SEOAnalytics calculatorId="emi" inputs={{}} />)

      expect(mockGtag).toHaveBeenCalledWith('event', 'calculator_view', {
        event_category: 'SEO',
        event_label: 'emi',
        custom_map: {
          calculator_type: 'emi',
          has_inputs: false
        }
      })
    })

    test('should track calculator view with inputs', () => {
      const inputs = { amount: '100000', rate: '10' }
      render(<SEOAnalytics calculatorId="emi" inputs={inputs} />)

      expect(mockGtag).toHaveBeenCalledWith('event', 'calculator_view', {
        event_category: 'SEO',
        event_label: 'emi',
        custom_map: {
          calculator_type: 'emi',
          has_inputs: true
        }
      })
    })

    test('should not track when calculatorId is missing', () => {
      render(<SEOAnalytics inputs={{}} />)

      expect(mockGtag).not.toHaveBeenCalledWith('event', 'calculator_view', expect.any(Object))
    })

    test('should not track when gtag is not available', () => {
      window.gtag = undefined
      render(<SEOAnalytics calculatorId="emi" inputs={{}} />)

      expect(mockGtag).not.toHaveBeenCalled()
    })
  })

  describe('🔍 Search Engine Referral Tracking', () => {
    test('should track Google referrals', () => {
      Object.defineProperty(document, 'referrer', {
        value: 'https://www.google.com/search?q=emi+calculator',
        writable: true
      })

      render(<SEOAnalytics calculatorId="emi" />)

      expect(mockGtag).toHaveBeenCalledWith('event', 'search_engine_referral', {
        event_category: 'SEO Traffic',
        event_label: 'Google',
        custom_map: {
          calculator_id: 'emi',
          referrer_url: 'https://www.google.com/search?q=emi+calculator',
          search_engine: 'Google'
        }
      })
    })

    test('should track Bing referrals', () => {
      Object.defineProperty(document, 'referrer', {
        value: 'https://www.bing.com/search?q=loan+calculator',
        writable: true
      })

      render(<SEOAnalytics calculatorId="sip" />)

      expect(mockGtag).toHaveBeenCalledWith('event', 'search_engine_referral', {
        event_category: 'SEO Traffic',
        event_label: 'Bing',
        custom_map: {
          calculator_id: 'sip',
          referrer_url: 'https://www.bing.com/search?q=loan+calculator',
          search_engine: 'Bing'
        }
      })
    })

    test('should track Yahoo referrals', () => {
      Object.defineProperty(document, 'referrer', {
        value: 'https://search.yahoo.com/search?p=calculator',
        writable: true
      })

      render(<SEOAnalytics calculatorId="ppf" />)

      expect(mockGtag).toHaveBeenCalledWith('event', 'search_engine_referral', {
        event_category: 'SEO Traffic',
        event_label: 'Yahoo',
        custom_map: {
          calculator_id: 'ppf',
          referrer_url: 'https://search.yahoo.com/search?p=calculator',
          search_engine: 'Yahoo'
        }
      })
    })

    test('should not track non-search engine referrals', () => {
      Object.defineProperty(document, 'referrer', {
        value: 'https://facebook.com',
        writable: true
      })

      render(<SEOAnalytics calculatorId="emi" />)

      expect(mockGtag).not.toHaveBeenCalledWith('event', 'search_engine_referral', expect.any(Object))
    })

    test('should handle homepage when no calculatorId', () => {
      Object.defineProperty(document, 'referrer', {
        value: 'https://www.google.com/search',
        writable: true
      })

      render(<SEOAnalytics />)

      expect(mockGtag).toHaveBeenCalledWith('event', 'search_engine_referral', {
        event_category: 'SEO Traffic',
        event_label: 'Google',
        custom_map: {
          calculator_id: 'homepage',
          referrer_url: 'https://www.google.com/search',
          search_engine: 'Google'
        }
      })
    })
  })

  describe('🛣️ User Journey Tracking', () => {
    test('should track user journey and page depth', () => {
      mockSessionStorage.getItem.mockReturnValue('[]')

      render(<SEOAnalytics calculatorId="emi" />)

      expect(mockSessionStorage.getItem).toHaveBeenCalledWith('userJourney')
      expect(mockSessionStorage.setItem).toHaveBeenCalledWith(
        'userJourney',
        expect.stringContaining('emi')
      )

      expect(mockGtag).toHaveBeenCalledWith('event', 'page_depth', {
        event_category: 'SEO Engagement',
        event_label: 'user_journey',
        value: 1,
        custom_map: {
          calculator_id: 'emi',
          journey_depth: 1,
          session_calculators: 'emi'
        }
      })
    })

    test('should track multiple pages in journey', () => {
      const existingJourney = JSON.stringify([
        { calculator: 'sip', timestamp: Date.now() - 10000, url: 'https://example.com/sip' }
      ])
      mockSessionStorage.getItem.mockReturnValue(existingJourney)

      render(<SEOAnalytics calculatorId="emi" />)

      expect(mockGtag).toHaveBeenCalledWith('event', 'page_depth', {
        event_category: 'SEO Engagement',
        event_label: 'user_journey',
        value: 2,
        custom_map: {
          calculator_id: 'emi',
          journey_depth: 2,
          session_calculators: 'sip,emi'
        }
      })
    })

    test('should handle invalid sessionStorage data', () => {
      // Mock console.error to suppress error output
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      mockSessionStorage.getItem.mockReturnValue('invalid-json')

      // This test verifies the component handles the error gracefully
      // The component should catch the JSON.parse error and continue
      const { container } = render(<SEOAnalytics calculatorId="emi" />)
      expect(container.firstChild).toBeNull()

      consoleSpy.mockRestore()
    })

    test('should handle homepage in journey', () => {
      mockSessionStorage.getItem.mockReturnValue('[]')

      render(<SEOAnalytics />)

      expect(mockGtag).toHaveBeenCalledWith('event', 'page_depth', {
        event_category: 'SEO Engagement',
        event_label: 'user_journey',
        value: 1,
        custom_map: {
          calculator_id: 'homepage',
          journey_depth: 1,
          session_calculators: 'homepage'
        }
      })
    })
  })

  describe('✅ Calculator Completion Tracking', () => {
    test('should track calculator completion with debounce', async () => {
      vi.useFakeTimers()
      
      const inputs = { amount: '100000', rate: '10', tenure: '5' }
      render(<SEOAnalytics calculatorId="emi" inputs={inputs} />)

      // Fast forward past debounce timer
      vi.advanceTimersByTime(2000)

      expect(mockGtag).toHaveBeenCalledWith('event', 'calculator_completion', {
        event_category: 'SEO Conversion',
        event_label: 'form_interaction',
        value: 3,
        custom_map: {
          calculator_id: 'emi',
          inputs_filled: 3,
          has_results: true,
          timestamp: expect.any(Number)
        }
      })

      vi.useRealTimers()
    })

    test('should not track completion when no inputs', () => {
      render(<SEOAnalytics calculatorId="emi" inputs={{}} />)

      expect(mockGtag).not.toHaveBeenCalledWith('event', 'calculator_completion', expect.any(Object))
    })

    test('should track completion with empty values', async () => {
      vi.useFakeTimers()
      
      const inputs = { amount: '', rate: '10', tenure: '' }
      render(<SEOAnalytics calculatorId="emi" inputs={inputs} />)

      vi.advanceTimersByTime(2000)

      expect(mockGtag).toHaveBeenCalledWith('event', 'calculator_completion', {
        event_category: 'SEO Conversion',
        event_label: 'form_interaction',
        value: 3,
        custom_map: {
          calculator_id: 'emi',
          inputs_filled: 3,
          has_results: true, // rate has value
          timestamp: expect.any(Number)
        }
      })

      vi.useRealTimers()
    })

    test('should cleanup debounce timer on unmount', () => {
      vi.useFakeTimers()
      
      const inputs = { amount: '100000' }
      const { unmount } = render(<SEOAnalytics calculatorId="emi" inputs={inputs} />)

      unmount()
      vi.advanceTimersByTime(2000)

      // Should not call gtag after unmount
      expect(mockGtag).not.toHaveBeenCalledWith('event', 'calculator_completion', expect.any(Object))

      vi.useRealTimers()
    })
  })

  describe('🔧 Edge Cases', () => {
    test('should handle missing inputs prop', () => {
      expect(() => {
        render(<SEOAnalytics calculatorId="emi" />)
      }).not.toThrow()
    })

    test('should handle null inputs', () => {
      // Mock console.error to suppress error output
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      // This test verifies the component handles null inputs gracefully
      const { container } = render(<SEOAnalytics calculatorId="emi" inputs={null} />)
      expect(container.firstChild).toBeNull()

      consoleSpy.mockRestore()
    })

    test('should handle undefined calculatorId', () => {
      expect(() => {
        render(<SEOAnalytics inputs={{}} />)
      }).not.toThrow()
    })

    test('should handle sessionStorage errors', () => {
      // Mock console.error to suppress error output
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      mockSessionStorage.getItem.mockImplementation(() => {
        throw new Error('Storage error')
      })

      // This test verifies the component handles storage errors gracefully
      const { container } = render(<SEOAnalytics calculatorId="emi" />)
      expect(container.firstChild).toBeNull()

      consoleSpy.mockRestore()
    })
  })
})
