import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  initializeEnhancedAnalytics,
  trackCalculatorUsage,
  trackInternalSearch,
  trackCalculatorFeature,
  trackPDFExport,
  trackSocialShare
} from '../../utils/enhancedAnalytics'

describe('enhancedAnalytics', () => {
  let mockGtag

  beforeEach(() => {
    // Mock gtag function
    mockGtag = vi.fn()
    global.window = {
      gtag: mockGtag
    }
  })

  afterEach(() => {
    vi.restoreAllMocks()
    delete global.window
  })

  describe('initializeEnhancedAnalytics', () => {
    test('should initialize enhanced analytics when gtag is available', () => {
      initializeEnhancedAnalytics()

      expect(mockGtag).toHaveBeenCalledWith('config', 'GA_MEASUREMENT_ID', {
        enhanced_measurement: {
          scrolls: true,
          outbound_clicks: true,
          site_search: true,
          video_engagement: true,
          file_downloads: true
        },
        custom_map: {
          'calculator_type': 'custom_parameter_1',
          'user_segment': 'custom_parameter_2',
          'calculation_accuracy': 'custom_parameter_3'
        }
      })
    })

    test('should not throw error when gtag is not available', () => {
      delete global.window.gtag
      
      expect(() => initializeEnhancedAnalytics()).not.toThrow()
      expect(mockGtag).not.toHaveBeenCalled()
    })
  })

  describe('trackCalculatorUsage', () => {
    test('should track calculator usage with inputs and results', () => {
      const calculatorId = 'emi'
      const inputs = { amount: 100000, rate: 8.5 }
      const results = { emi: 1234 }

      trackCalculatorUsage(calculatorId, inputs, results)

      expect(mockGtag).toHaveBeenCalledWith('event', 'purchase', expect.objectContaining({
        transaction_id: expect.stringContaining('calc_emi_'),
        value: 1.0,
        currency: 'USD',
        items: [{
          item_id: 'emi',
          item_name: 'emi Calculator',
          item_category: expect.any(String),
          item_variant: 'with_inputs',
          quantity: 1,
          price: 1.0
        }],
        calculator_type: 'emi',
        input_count: 2,
        has_results: true,
        user_segment: expect.any(String)
      }))
    })

    test('should track calculator usage without inputs', () => {
      const calculatorId = 'sip'

      trackCalculatorUsage(calculatorId)

      expect(mockGtag).toHaveBeenCalledWith('event', 'purchase', expect.objectContaining({
        calculator_type: 'sip',
        input_count: 0,
        has_results: false
      }))
    })

    test('should not track when gtag is not available', () => {
      delete global.window.gtag

      trackCalculatorUsage('emi', {}, {})

      expect(mockGtag).not.toHaveBeenCalled()
    })
  })

  describe('trackInternalSearch', () => {
    test('should track internal search with calculator context', () => {
      const searchTerm = 'loan calculator'
      const calculatorId = 'emi'

      trackInternalSearch(searchTerm, calculatorId)

      expect(mockGtag).toHaveBeenCalledWith('event', 'search', {
        search_term: 'loan calculator',
        content_group1: 'emi',
        custom_map: {
          calculator_context: 'emi',
          search_source: 'internal'
        }
      })
    })

    test('should track internal search without calculator context', () => {
      const searchTerm = 'financial planning'

      trackInternalSearch(searchTerm)

      expect(mockGtag).toHaveBeenCalledWith('event', 'search', {
        search_term: 'financial planning',
        content_group1: 'homepage',
        custom_map: {
          calculator_context: null,
          search_source: 'internal'
        }
      })
    })

    test('should not track when gtag is not available', () => {
      delete global.window.gtag

      trackInternalSearch('test search')

      expect(mockGtag).not.toHaveBeenCalled()
    })
  })

  describe('trackCalculatorFeature', () => {
    test('should track calculator feature usage', () => {
      const feature = 'advanced_mode'
      const calculatorId = 'emi'
      const additionalData = { complexity: 'high' }

      trackCalculatorFeature(feature, calculatorId, additionalData)

      expect(mockGtag).toHaveBeenCalledWith('event', 'select_content', {
        content_type: 'calculator_feature',
        content_id: 'emi_advanced_mode',
        content_group1: 'emi',
        content_group2: 'advanced_mode',
        complexity: 'high'
      })
    })

    test('should track calculator feature without additional data', () => {
      const feature = 'reset'
      const calculatorId = 'sip'

      trackCalculatorFeature(feature, calculatorId)

      expect(mockGtag).toHaveBeenCalledWith('event', 'select_content', {
        content_type: 'calculator_feature',
        content_id: 'sip_reset',
        content_group1: 'sip',
        content_group2: 'reset'
      })
    })

    test('should not track when gtag is not available', () => {
      delete global.window.gtag

      trackCalculatorFeature('feature', 'calculator')

      expect(mockGtag).not.toHaveBeenCalled()
    })
  })

  describe('trackPDFExport', () => {
    test('should track PDF export with inputs and results', () => {
      const calculatorId = 'emi'
      const inputs = { amount: 100000, rate: 8.5, tenure: 20 }
      const results = { emi: 1234, totalInterest: 50000 }

      trackPDFExport(calculatorId, inputs, results)

      expect(mockGtag).toHaveBeenCalledWith('event', 'generate_lead', {
        currency: 'USD',
        value: 2.0,
        content_group1: 'emi',
        method: 'pdf_export',
        calculator_type: 'emi',
        input_complexity: 3,
        has_results: true
      })
    })

    test('should track PDF export without inputs', () => {
      const calculatorId = 'sip'

      trackPDFExport(calculatorId)

      expect(mockGtag).toHaveBeenCalledWith('event', 'generate_lead', {
        currency: 'USD',
        value: 2.0,
        content_group1: 'sip',
        method: 'pdf_export',
        calculator_type: 'sip',
        input_complexity: 0,
        has_results: false
      })
    })

    test('should not track when gtag is not available', () => {
      delete global.window.gtag

      trackPDFExport('emi', {}, {})

      expect(mockGtag).not.toHaveBeenCalled()
    })
  })

  describe('trackSocialShare', () => {
    test('should track social sharing', () => {
      const platform = 'twitter'
      const calculatorId = 'emi'
      const url = 'https://example.com/calculator/emi'

      trackSocialShare(platform, calculatorId, url)

      expect(mockGtag).toHaveBeenCalledWith('event', 'share', expect.objectContaining({
        method: 'twitter',
        content_type: 'calculator',
        content_id: 'emi',
        content_group1: 'emi'
      }))
    })

    test('should track social sharing with different platforms', () => {
      trackSocialShare('facebook', 'sip', 'https://example.com/calculator/sip')

      expect(mockGtag).toHaveBeenCalledWith('event', 'share', expect.objectContaining({
        method: 'facebook',
        content_type: 'calculator',
        content_id: 'sip',
        content_group1: 'sip'
      }))
    })

    test('should not track when gtag is not available', () => {
      delete global.window.gtag

      trackSocialShare('twitter', 'emi', 'https://example.com')

      expect(mockGtag).not.toHaveBeenCalled()
    })
  })

  describe('Edge Cases', () => {
    test('should handle undefined window object', () => {
      const originalWindow = global.window
      delete global.window

      // These functions should not throw when window is undefined
      expect(() => initializeEnhancedAnalytics()).not.toThrow()
      expect(() => trackInternalSearch('test')).not.toThrow()
      expect(() => trackCalculatorFeature('feature', 'calc')).not.toThrow()
      expect(() => trackPDFExport('emi')).not.toThrow()
      expect(() => trackSocialShare('twitter', 'emi', 'url')).not.toThrow()

      // Restore window
      global.window = originalWindow
    })

    test('should handle empty objects and null values', () => {
      trackCalculatorUsage('emi', {}, {})
      trackCalculatorFeature('feature', 'calc', {})
      trackPDFExport('emi', {}, {})

      // Should not throw errors and should still call gtag
      expect(mockGtag).toHaveBeenCalled()
    })
  })
})
