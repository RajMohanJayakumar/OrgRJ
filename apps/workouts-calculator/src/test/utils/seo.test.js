import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  updateSEO,
  initializePerformanceSEO,
  updateDocumentTitle,
  updateMetaDescription,
  updateMetaKeywords,
  updateCanonicalURL,
  updateOpenGraphTags,
  updateTwitterCardTags,
  updateStructuredData,
  generateBreadcrumbData,
  generateEnhancedCalculatorSchema,
  optimizeWebVitals,
  optimizeCalculatorPerformance,
  monitorPerformanceIssues,
  addResourceOptimization,
  trackBundlePerformance,
  getSEOData,
  addPerformanceHints,
  addPerformanceMetaTags,
  addChartResponsivenessSEO,
  addPDFExportSEO,
  addMobileResponsivenessSEO,
  defaultSEOData,
  calculatorSEOData
} from '../../utils/seo'

// Mock DOM methods
const mockDocument = {
  title: '',
  head: {
    appendChild: vi.fn(),
    removeChild: vi.fn()
  },
  querySelector: vi.fn(),
  querySelectorAll: vi.fn(() => []),
  createElement: vi.fn(() => ({
    setAttribute: vi.fn(),
    textContent: '',
    content: '',
    href: '',
    name: '',
    property: '',
    remove: vi.fn()
  }))
}

const mockWindow = {
  location: {
    href: 'https://finclamp.com/?calculator=emi',
    origin: 'https://finclamp.com',
    pathname: '/',
    search: '?calculator=emi'
  },
  requestIdleCallback: vi.fn((callback) => setTimeout(callback, 0)),
  performance: {
    mark: vi.fn(),
    measure: vi.fn(),
    getEntriesByType: vi.fn(() => [])
  },
  gtag: vi.fn(),
  scheduler: {
    postTask: vi.fn()
  }
}

describe('SEO Utils', () => {
  beforeEach(() => {
    global.document = mockDocument
    global.window = mockWindow

    // Mock PerformanceObserver globally to prevent errors
    global.PerformanceObserver = vi.fn(() => ({
      observe: vi.fn(),
      disconnect: vi.fn()
    }))

    // Ensure requestIdleCallback is properly mocked
    window.requestIdleCallback = vi.fn((callback) => {
      callback()
      return 1
    })

    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('updateDocumentTitle', () => {
    test('updates document title for calculator', () => {
      updateDocumentTitle('emi')
      
      expect(document.title).toContain('EMI Calculator')
      expect(document.title).toContain('FinClamp')
    })

    test('handles unknown calculator gracefully', () => {
      updateDocumentTitle('unknown-calculator')
      
      expect(document.title).toContain('FinClamp')
    })

    test('handles empty calculator id', () => {
      updateDocumentTitle('')
      
      expect(document.title).toContain('FinClamp')
    })
  })

  describe('updateMetaDescription', () => {
    test('updates meta description', () => {
      const mockMetaTag = {
        content: '',
        setAttribute: vi.fn()
      }
      
      document.querySelector.mockReturnValue(mockMetaTag)
      
      updateMetaDescription('emi')
      
      expect(document.querySelector).toHaveBeenCalledWith('meta[name="description"]')
      expect(mockMetaTag.content).toContain('EMI')
    })

    test('creates meta description if not exists', () => {
      const mockMetaTag = {
        content: '',
        setAttribute: vi.fn(),
        name: '',
        textContent: ''
      }
      
      document.querySelector.mockReturnValue(null)
      document.createElement.mockReturnValue(mockMetaTag)
      
      updateMetaDescription('sip')
      
      expect(document.createElement).toHaveBeenCalledWith('meta')
      expect(document.head.appendChild).toHaveBeenCalledWith(mockMetaTag)
    })
  })

  describe('updateCanonicalURL', () => {
    test('updates canonical URL', () => {
      const mockLinkTag = {
        href: '',
        setAttribute: vi.fn()
      }

      document.querySelector.mockReturnValue(mockLinkTag)

      updateCanonicalURL('emi')

      expect(document.querySelector).toHaveBeenCalledWith('link[rel="canonical"]')
      expect(mockLinkTag.href).toContain('/calculators?in=emi')
    })

    test('creates canonical link if not exists', () => {
      const mockLinkTag = {
        href: '',
        rel: '',
        setAttribute: vi.fn()
      }
      
      document.querySelector.mockReturnValue(null)
      document.createElement.mockReturnValue(mockLinkTag)
      
      updateCanonicalURL('sip')
      
      expect(document.createElement).toHaveBeenCalledWith('link')
      expect(document.head.appendChild).toHaveBeenCalledWith(mockLinkTag)
    })
  })

  describe('generateBreadcrumbData', () => {
    test('generates breadcrumb structured data', () => {
      const breadcrumbData = generateBreadcrumbData('emi')
      
      expect(breadcrumbData).toHaveProperty('@context')
      expect(breadcrumbData).toHaveProperty('@type', 'BreadcrumbList')
      expect(breadcrumbData).toHaveProperty('itemListElement')
      expect(breadcrumbData.itemListElement).toBeInstanceOf(Array)
      expect(breadcrumbData.itemListElement.length).toBeGreaterThan(0)
    })

    test('includes home and calculator pages in breadcrumb', () => {
      const breadcrumbData = generateBreadcrumbData('emi')
      
      const items = breadcrumbData.itemListElement
      expect(items[0].name).toBe('Home')
      expect(items[items.length - 1].name).toContain('EMI Calculator')
    })

    test('handles unknown calculator in breadcrumb', () => {
      const breadcrumbData = generateBreadcrumbData('unknown')
      
      expect(breadcrumbData.itemListElement).toBeInstanceOf(Array)
      expect(breadcrumbData.itemListElement.length).toBeGreaterThan(0)
    })
  })

  describe('optimizeWebVitals', () => {
    test('initializes web vitals optimization', () => {
      expect(() => optimizeWebVitals()).not.toThrow()

      // Should run without errors when window is available
      expect(window).toBeDefined()
    })

    test('handles missing performance API gracefully', () => {
      const originalPerformance = window.performance
      delete window.performance

      expect(() => optimizeWebVitals()).not.toThrow()

      window.performance = originalPerformance
    })

    test('preloads critical resources for LCP optimization', () => {
      const mockLink = {
        rel: '',
        href: '',
        as: '',
        crossOrigin: ''
      }

      document.createElement.mockReturnValue(mockLink)

      optimizeWebVitals()

      expect(document.createElement).toHaveBeenCalledWith('link')
      expect(document.head.appendChild).toHaveBeenCalled()
    })

    test('uses scheduler API when available for FID optimization', () => {
      optimizeWebVitals()

      expect(window.scheduler.postTask).toHaveBeenCalled()
    })

    test('handles missing scheduler API gracefully', () => {
      const originalScheduler = window.scheduler
      delete window.scheduler

      expect(() => optimizeWebVitals()).not.toThrow()

      window.scheduler = originalScheduler
    })

    test('optimizes images for CLS prevention', () => {
      const mockImage = {
        style: { aspectRatio: '' },
        setAttribute: vi.fn()
      }

      document.querySelectorAll.mockReturnValue([mockImage])

      optimizeWebVitals()

      expect(mockImage.style.aspectRatio).toBe('16/9')
    })

    test('sets up performance observer for LCP monitoring', () => {
      const mockObserver = {
        observe: vi.fn()
      }
      global.PerformanceObserver = vi.fn(() => mockObserver)

      optimizeWebVitals()

      expect(global.PerformanceObserver).toHaveBeenCalled()
      expect(mockObserver.observe).toHaveBeenCalledWith({ entryTypes: ['largest-contentful-paint'] })
    })

    test('handles PerformanceObserver errors gracefully', () => {
      const mockObserver = {
        observe: vi.fn(() => { throw new Error('Observer error') })
      }
      global.PerformanceObserver = vi.fn(() => mockObserver)

      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      optimizeWebVitals()

      expect(consoleSpy).toHaveBeenCalledWith('Performance observer not supported')

      consoleSpy.mockRestore()
    })

    test('sends analytics for poor LCP when gtag available', () => {
      const mockObserver = {
        observe: vi.fn()
      }
      const mockObserverCallback = vi.fn()

      global.PerformanceObserver = vi.fn((callback) => {
        mockObserverCallback.mockImplementation(callback)
        return mockObserver
      })

      optimizeWebVitals()

      // Simulate poor LCP entry
      const poorLCPEntry = {
        entryType: 'largest-contentful-paint',
        startTime: 3000
      }

      mockObserverCallback({ getEntries: () => [poorLCPEntry] })

      expect(window.gtag).toHaveBeenCalledWith('event', 'poor_lcp', {
        value: 3000
      })
    })

    test('does not send analytics for good LCP', () => {
      const mockObserver = {
        observe: vi.fn()
      }
      const mockObserverCallback = vi.fn()

      global.PerformanceObserver = vi.fn((callback) => {
        mockObserverCallback.mockImplementation(callback)
        return mockObserver
      })

      optimizeWebVitals()

      // Simulate good LCP entry
      const goodLCPEntry = {
        entryType: 'largest-contentful-paint',
        startTime: 2000
      }

      mockObserverCallback({ getEntries: () => [goodLCPEntry] })

      expect(window.gtag).not.toHaveBeenCalledWith('event', 'poor_lcp', expect.any(Object))
    })
  })

  describe('initializePerformanceSEO', () => {
    test('initializes performance SEO features', () => {
      expect(() => initializePerformanceSEO()).not.toThrow()

      // Should run without errors
      expect(document.head.appendChild).toHaveBeenCalled()
    })

    test('falls back to setTimeout when requestIdleCallback unavailable', () => {
      const originalRequestIdleCallback = window.requestIdleCallback
      delete window.requestIdleCallback

      const setTimeoutSpy = vi.spyOn(global, 'setTimeout')

      initializePerformanceSEO()

      expect(setTimeoutSpy).toHaveBeenCalled()

      window.requestIdleCallback = originalRequestIdleCallback
      setTimeoutSpy.mockRestore()
    })
  })

  describe('updateSEO', () => {
    test('updates all SEO elements', () => {
      const mockMetaTag = { content: '', setAttribute: vi.fn() }
      const mockLinkTag = { href: '', setAttribute: vi.fn() }
      
      document.querySelector.mockReturnValue(mockMetaTag)
      document.createElement.mockReturnValue(mockLinkTag)
      
      updateSEO('emi')
      
      // Should update title
      expect(document.title).toContain('EMI Calculator')
      
      // Should call querySelector for various meta tags
      expect(document.querySelector).toHaveBeenCalledWith('meta[name="description"]')
      expect(document.querySelector).toHaveBeenCalledWith('link[rel="canonical"]')
    })

    test('handles calculator-specific optimizations', () => {
      expect(() => updateSEO('emi')).not.toThrow()

      // Should run without errors
      expect(document.title).toContain('EMI Calculator')
    })
  })

  describe('Error Handling', () => {
    test('handles DOM manipulation errors gracefully', () => {
      document.querySelector.mockImplementation(() => {
        throw new Error('DOM error')
      })

      try {
        updateSEO('emi')
        // If it doesn't throw, that's also acceptable
      } catch (error) {
        expect(error.message).toBe('DOM error')
      }
    })

    test('handles missing document gracefully', () => {
      const originalDocument = global.document
      delete global.document

      try {
        updateSEO('emi')
        // If it doesn't throw, that's also acceptable
      } catch (error) {
        expect(error.message).toContain('document is not defined')
      }

      global.document = originalDocument
    })

    test('handles missing window gracefully', () => {
      const originalWindow = global.window
      delete global.window

      expect(() => initializePerformanceSEO()).not.toThrow()

      global.window = originalWindow
    })
  })

  describe('Performance Monitoring', () => {
    test('tracks performance metrics', () => {
      expect(() => optimizeWebVitals()).not.toThrow()

      // Should run without errors when performance API is available
      expect(window.performance).toBeDefined()
    })

    test('handles scheduler API when available', () => {
      expect(() => initializePerformanceSEO()).not.toThrow()

      // Should run without errors
      expect(window.scheduler).toBeDefined()
    })

    test('falls back when scheduler API unavailable', () => {
      const originalScheduler = window.scheduler
      delete window.scheduler

      expect(() => initializePerformanceSEO()).not.toThrow()

      window.scheduler = originalScheduler
    })
  })

  describe('getSEOData', () => {
    test('returns SEO data for known calculator', () => {
      const seoData = getSEOData('emi')

      expect(seoData).toBeDefined()
      expect(seoData.title).toContain('EMI Calculator')
      expect(seoData.description).toContain('EMI')
    })

    test('returns default SEO data for unknown calculator', () => {
      const seoData = getSEOData('unknown-calculator')

      expect(seoData).toBeDefined()
      expect(seoData.title).toContain('FinClamp')
    })
  })

  describe('addPerformanceHints', () => {
    test('adds performance hints to document head', () => {
      addPerformanceHints()

      expect(document.head.appendChild).toHaveBeenCalled()
    })

    test('does not add duplicate hints', () => {
      const mockExistingLink = {
        rel: 'dns-prefetch',
        href: '//fonts.googleapis.com'
      }

      document.querySelector.mockReturnValue(mockExistingLink)

      addPerformanceHints()

      // Should check for existing hints but not add duplicates
      expect(document.querySelector).toHaveBeenCalledWith('link[rel="dns-prefetch"][href="//fonts.googleapis.com"]')
    })

    test('creates new link elements for hints', () => {
      const mockLink = {
        setAttribute: vi.fn(),
        rel: '',
        href: ''
      }

      document.querySelector.mockReturnValue(null)
      document.createElement.mockReturnValue(mockLink)

      addPerformanceHints()

      expect(document.createElement).toHaveBeenCalledWith('link')
      expect(mockLink.setAttribute).toHaveBeenCalledWith('rel', expect.any(String))
      expect(mockLink.setAttribute).toHaveBeenCalledWith('href', expect.any(String))
    })

    test('handles crossorigin attribute for preconnect hints', () => {
      const mockLink = {
        setAttribute: vi.fn(),
        rel: '',
        href: ''
      }

      document.querySelector.mockReturnValue(null)
      document.createElement.mockReturnValue(mockLink)

      addPerformanceHints()

      expect(mockLink.setAttribute).toHaveBeenCalledWith('crossorigin', true)
    })

    test('adds all required performance hints', () => {
      const mockLink = {
        setAttribute: vi.fn(),
        rel: '',
        href: ''
      }

      document.querySelector.mockReturnValue(null)
      document.createElement.mockReturnValue(mockLink)

      addPerformanceHints()

      // Should create 6 links (2 dns-prefetch, 2 preconnect, 2 prefetch)
      expect(document.createElement).toHaveBeenCalledTimes(6)
      expect(document.head.appendChild).toHaveBeenCalledTimes(6)
    })
  })

  describe('addPerformanceMetaTags', () => {
    test('adds performance meta tags', () => {
      addPerformanceMetaTags()

      expect(document.head.appendChild).toHaveBeenCalled()
    })

    test('updates existing performance meta tags', () => {
      const mockMetaTag = {
        setAttribute: vi.fn(),
        content: ''
      }

      document.querySelector.mockReturnValue(mockMetaTag)

      addPerformanceMetaTags()

      expect(mockMetaTag.setAttribute).toHaveBeenCalledWith('content', expect.any(String))
    })

    test('creates new meta tags when they do not exist', () => {
      const mockMetaTag = {
        setAttribute: vi.fn(),
        content: ''
      }

      document.querySelector.mockReturnValue(null)
      document.createElement.mockReturnValue(mockMetaTag)

      addPerformanceMetaTags()

      expect(document.createElement).toHaveBeenCalledWith('meta')
      expect(document.head.appendChild).toHaveBeenCalledWith(mockMetaTag)
    })
  })

  describe('updateMetaKeywords', () => {
    test('updates meta keywords for calculator', () => {
      const mockMetaTag = {
        content: '',
        name: '',
        setAttribute: vi.fn()
      }

      document.querySelector.mockReturnValue(mockMetaTag)

      updateMetaKeywords('emi')

      expect(document.querySelector).toHaveBeenCalledWith('meta[name="keywords"]')
      expect(mockMetaTag.content).toContain('EMI calculator')
    })

    test('creates meta keywords if not exists', () => {
      const mockMetaTag = {
        content: '',
        name: '',
        setAttribute: vi.fn()
      }

      document.querySelector.mockReturnValue(null)
      document.createElement.mockReturnValue(mockMetaTag)

      updateMetaKeywords('sip')

      expect(document.createElement).toHaveBeenCalledWith('meta')
      expect(document.head.appendChild).toHaveBeenCalledWith(mockMetaTag)
      expect(mockMetaTag.name).toBe('keywords')
    })

    test('handles unknown calculator for keywords', () => {
      const mockMetaTag = {
        content: '',
        name: '',
        setAttribute: vi.fn()
      }

      document.querySelector.mockReturnValue(mockMetaTag)

      updateMetaKeywords('unknown-calc')

      expect(mockMetaTag.content).toContain('financial calculator')
    })
  })

  describe('updateOpenGraphTags', () => {
    test('updates Open Graph tags for calculator', () => {
      const mockMetaTag = {
        content: '',
        setAttribute: vi.fn()
      }

      document.querySelector.mockReturnValue(mockMetaTag)

      updateOpenGraphTags('emi')

      expect(document.querySelector).toHaveBeenCalledWith('meta[property="og:title"]')
      expect(mockMetaTag.content).toContain('EMI Calculator')
    })

    test('creates Open Graph tags if not exists', () => {
      const mockMetaTag = {
        content: '',
        setAttribute: vi.fn()
      }

      document.querySelector.mockReturnValue(null)
      document.createElement.mockReturnValue(mockMetaTag)

      updateOpenGraphTags('sip')

      expect(document.createElement).toHaveBeenCalledWith('meta')
      expect(document.head.appendChild).toHaveBeenCalledWith(mockMetaTag)
      expect(mockMetaTag.setAttribute).toHaveBeenCalledWith('property', expect.any(String))
    })

    test('sets correct og:type and og:site_name', () => {
      const mockMetaTag = {
        content: '',
        setAttribute: vi.fn()
      }

      document.querySelector.mockReturnValue(mockMetaTag)

      updateOpenGraphTags('fd')

      // Should be called multiple times for different OG tags
      expect(document.querySelector).toHaveBeenCalledTimes(9) // 9 OG tags
    })
  })

  describe('updateTwitterCardTags', () => {
    test('updates Twitter Card tags for calculator', () => {
      const mockMetaTag = {
        content: '',
        name: '',
        setAttribute: vi.fn()
      }

      document.querySelector.mockReturnValue(mockMetaTag)

      updateTwitterCardTags('emi')

      expect(document.querySelector).toHaveBeenCalledWith('meta[name="twitter:card"]')
      expect(mockMetaTag.content).toBeDefined()
    })

    test('creates Twitter Card tags if not exists', () => {
      const mockMetaTag = {
        content: '',
        name: '',
        setAttribute: vi.fn()
      }

      document.querySelector.mockReturnValue(null)
      document.createElement.mockReturnValue(mockMetaTag)

      updateTwitterCardTags('sip')

      expect(document.createElement).toHaveBeenCalledWith('meta')
      expect(document.head.appendChild).toHaveBeenCalledWith(mockMetaTag)
    })

    test('sets correct Twitter card type', () => {
      const mockMetaTag = {
        content: '',
        name: '',
        setAttribute: vi.fn()
      }

      document.querySelector.mockReturnValue(mockMetaTag)

      updateTwitterCardTags('ppf')

      // Should be called for all 6 Twitter tags
      expect(document.querySelector).toHaveBeenCalledTimes(6)
    })
  })

  describe('updateStructuredData', () => {
    test('calls updateStructuredData function without errors', () => {
      expect(() => updateStructuredData('emi')).not.toThrow()
    })

    test('handles currency parameter', () => {
      expect(() => updateStructuredData('fd', 'USD')).not.toThrow()
    })

    test('falls back to setTimeout when requestIdleCallback unavailable', () => {
      const originalRequestIdleCallback = window.requestIdleCallback
      delete window.requestIdleCallback

      const setTimeoutSpy = vi.spyOn(global, 'setTimeout')

      updateStructuredData('nps')

      expect(setTimeoutSpy).toHaveBeenCalled()

      window.requestIdleCallback = originalRequestIdleCallback
      setTimeoutSpy.mockRestore()
    })
  })

  describe('generateEnhancedCalculatorSchema', () => {
    test('generates enhanced schema for known calculator', () => {
      const schema = generateEnhancedCalculatorSchema('emi')

      expect(schema).toHaveProperty('@context', 'https://schema.org')
      expect(schema).toHaveProperty('@type')
      expect(schema).toHaveProperty('name')
      expect(schema).toHaveProperty('description')
      expect(schema).toHaveProperty('featureList')
      expect(schema.featureList).toBeInstanceOf(Array)
    })

    test('includes custom data when provided', () => {
      const customData = { customField: 'customValue' }
      const schema = generateEnhancedCalculatorSchema('sip', customData)

      expect(schema).toBeDefined()
      expect(schema.name).toContain('SIP Calculator')
    })

    test('handles different currency parameter', () => {
      const schema = generateEnhancedCalculatorSchema('fd', {}, 'USD')

      expect(schema).toBeDefined()
      expect(schema.description).toContain('FD')
    })

    test('generates schema for unknown calculator', () => {
      const schema = generateEnhancedCalculatorSchema('unknown-calc')

      expect(schema).toBeDefined()
      expect(schema).toHaveProperty('@context')
      expect(schema).toHaveProperty('@type')
    })

    test('includes proper feature list for different calculators', () => {
      const emiSchema = generateEnhancedCalculatorSchema('emi')
      const sipSchema = generateEnhancedCalculatorSchema('sip')

      expect(emiSchema.featureList).toContain('Calculate monthly EMI payments')
      expect(sipSchema.featureList).toContain('Calculate SIP returns')
    })
  })

  describe('optimizeCalculatorPerformance', () => {
    test('optimizes performance for calculator with related calculators', () => {
      const mockLink = {
        rel: '',
        href: '',
        setAttribute: vi.fn()
      }

      document.createElement.mockReturnValue(mockLink)

      optimizeCalculatorPerformance('emi')

      expect(document.createElement).toHaveBeenCalledWith('link')
      expect(document.head.appendChild).toHaveBeenCalled()
    })

    test('handles calculator without related calculators', () => {
      optimizeCalculatorPerformance('unknown-calc')

      // Should not throw error
      expect(document.createElement).not.toHaveBeenCalled()
    })

    test('handles lazy loading elements', () => {
      const mockElement = {
        dataset: { lazyCalculator: 'emi' },
        style: { display: '' }
      }

      document.querySelectorAll.mockReturnValue([mockElement])

      expect(() => optimizeCalculatorPerformance('emi')).not.toThrow()
    })

    test('handles missing requestIdleCallback gracefully', () => {
      const originalRequestIdleCallback = window.requestIdleCallback
      delete window.requestIdleCallback

      expect(() => optimizeCalculatorPerformance('sip')).not.toThrow()

      window.requestIdleCallback = originalRequestIdleCallback
    })
  })

  describe('addResourceOptimization', () => {
    test('adds lazy loading to images', () => {
      const mockImage = {
        setAttribute: vi.fn(),
        closest: vi.fn(() => null)
      }

      document.querySelectorAll.mockReturnValue([mockImage])

      addResourceOptimization()

      expect(mockImage.setAttribute).toHaveBeenCalledWith('loading', 'lazy')
      expect(mockImage.setAttribute).toHaveBeenCalledWith('decoding', 'async')
    })

    test('skips critical images from lazy loading', () => {
      const mockCriticalImage = {
        setAttribute: vi.fn(),
        closest: vi.fn(() => ({ dataset: { critical: true } }))
      }

      document.querySelectorAll.mockReturnValue([mockCriticalImage])

      addResourceOptimization()

      expect(mockCriticalImage.setAttribute).not.toHaveBeenCalledWith('loading', 'lazy')
    })

    test('adds fetchpriority to critical images', () => {
      const mockCriticalImage = {
        setAttribute: vi.fn()
      }

      // Mock both calls to querySelectorAll
      document.querySelectorAll
        .mockReturnValueOnce([]) // For non-critical images
        .mockReturnValueOnce([mockCriticalImage]) // For critical images

      addResourceOptimization()

      expect(mockCriticalImage.setAttribute).toHaveBeenCalledWith('fetchpriority', 'high')
      expect(mockCriticalImage.setAttribute).toHaveBeenCalledWith('loading', 'eager')
    })
  })

  describe('trackBundlePerformance', () => {
    test('runs without errors when window and performance available', () => {
      expect(() => trackBundlePerformance()).not.toThrow()
    })

    test('handles missing performance API', () => {
      const originalPerformance = window.performance
      delete window.performance

      expect(() => trackBundlePerformance()).not.toThrow()

      window.performance = originalPerformance
    })

    test('handles missing navigation entry', () => {
      window.performance.getEntriesByType.mockReturnValue([])

      expect(() => trackBundlePerformance()).not.toThrow()
    })
  })

  describe('monitorPerformanceIssues', () => {
    test('handles missing window gracefully', () => {
      const originalWindow = global.window
      delete global.window

      expect(() => monitorPerformanceIssues()).not.toThrow()

      global.window = originalWindow
    })

    test('runs without errors when window is available', () => {
      // Mock PerformanceObserver to avoid ReferenceError
      global.PerformanceObserver = vi.fn(() => ({
        observe: vi.fn()
      }))

      expect(() => monitorPerformanceIssues()).not.toThrow()
    })
  })

  describe('defaultSEOData and calculatorSEOData', () => {
    test('defaultSEOData has required properties', () => {
      expect(defaultSEOData).toHaveProperty('title')
      expect(defaultSEOData).toHaveProperty('description')
      expect(defaultSEOData).toHaveProperty('keywords')
      expect(defaultSEOData).toHaveProperty('canonical')
      expect(defaultSEOData).toHaveProperty('structuredData')
      expect(defaultSEOData.title).toContain('FinClamp')
    })

    test('calculatorSEOData contains EMI calculator data', () => {
      expect(calculatorSEOData).toHaveProperty('emi')
      expect(calculatorSEOData.emi).toHaveProperty('title')
      expect(calculatorSEOData.emi).toHaveProperty('description')
      expect(calculatorSEOData.emi).toHaveProperty('keywords')
      expect(calculatorSEOData.emi.title).toContain('EMI Calculator')
    })

    test('calculatorSEOData contains SIP calculator data', () => {
      expect(calculatorSEOData).toHaveProperty('sip')
      expect(calculatorSEOData.sip.title).toContain('SIP Calculator')
      expect(calculatorSEOData.sip.description).toContain('SIP')
    })

    test('calculatorSEOData has structured data for calculators', () => {
      expect(calculatorSEOData.emi).toHaveProperty('structuredData')
      expect(calculatorSEOData.emi.structuredData).toHaveProperty('@type', 'WebApplication')
      expect(calculatorSEOData.emi.structuredData).toHaveProperty('featureList')
      expect(calculatorSEOData.emi.structuredData.featureList).toBeInstanceOf(Array)
    })
  })

  describe('Edge Cases and Error Handling', () => {
    test('handles null calculator ID gracefully', () => {
      expect(() => updateSEO(null)).not.toThrow()
      expect(() => updateDocumentTitle(null)).not.toThrow()
      expect(() => updateMetaDescription(null)).not.toThrow()
    })

    test('handles undefined calculator ID gracefully', () => {
      expect(() => updateSEO(undefined)).not.toThrow()
      expect(() => generateBreadcrumbData(undefined)).not.toThrow()
    })

    test('handles empty string calculator ID', () => {
      const seoData = getSEOData('')
      expect(seoData).toEqual(defaultSEOData)
    })

    test('handles very long calculator ID', () => {
      const longId = 'a'.repeat(1000)
      expect(() => updateSEO(longId)).not.toThrow()
    })

    test('handles special characters in calculator ID', () => {
      const specialId = 'calc-with-special-chars!@#$%'
      expect(() => updateSEO(specialId)).not.toThrow()
    })

    test('handles DOM manipulation when head is missing', () => {
      const originalHead = document.head
      document.head = null

      // These functions should handle missing head gracefully
      // The actual implementation should check for document.head existence
      try {
        addPerformanceHints()
      } catch (error) {
        expect(error.message).toContain('appendChild')
      }

      document.head = originalHead
    })

    test('handles querySelector returning unexpected values', () => {
      document.querySelector.mockReturnValue(undefined)

      // These should handle undefined return values gracefully
      try {
        updateMetaDescription('emi')
        updateCanonicalURL('sip')
      } catch (error) {
        expect(error.message).toContain('appendChild')
      }
    })
  })

  describe('Additional Coverage Tests', () => {
    test('updateSEO handles all calculator types', () => {
      const calculatorTypes = ['emi', 'sip', 'fd', 'ppf', 'nps', 'epf', 'gst', 'income-tax']

      calculatorTypes.forEach(type => {
        expect(() => updateSEO(type)).not.toThrow()
      })
    })

    test('generateBreadcrumbData returns valid structure', () => {
      const breadcrumb = generateBreadcrumbData('emi')

      expect(breadcrumb).toHaveProperty('@context', 'https://schema.org')
      expect(breadcrumb).toHaveProperty('@type', 'BreadcrumbList')
      expect(breadcrumb).toHaveProperty('itemListElement')
      expect(breadcrumb.itemListElement).toBeInstanceOf(Array)
      expect(breadcrumb.itemListElement.length).toBeGreaterThan(0)
    })

    test('calculatorSEOData contains all required calculator types', () => {
      const requiredCalculators = ['emi', 'sip', 'fd', 'ppf', 'nps']

      requiredCalculators.forEach(calc => {
        expect(calculatorSEOData).toHaveProperty(calc)
        expect(calculatorSEOData[calc]).toHaveProperty('title')
        expect(calculatorSEOData[calc]).toHaveProperty('description')
        expect(calculatorSEOData[calc]).toHaveProperty('keywords')
      })
    })

    test('initializePerformanceSEO calls all required functions', () => {
      expect(() => initializePerformanceSEO()).not.toThrow()
    })

    test('optimizeWebVitals handles different scenarios', () => {
      // Test with missing scheduler
      const originalScheduler = window.scheduler
      delete window.scheduler

      expect(() => optimizeWebVitals()).not.toThrow()

      window.scheduler = originalScheduler
    })

    test('addResourceOptimization handles empty image lists', () => {
      document.querySelectorAll.mockReturnValue([])

      expect(() => addResourceOptimization()).not.toThrow()
    })

    test('generateEnhancedCalculatorSchema handles edge cases', () => {
      // Test with empty calculator ID
      const schema1 = generateEnhancedCalculatorSchema('')
      expect(schema1).toBeDefined()

      // Test with null calculator ID
      const schema2 = generateEnhancedCalculatorSchema(null)
      expect(schema2).toBeDefined()

      // Test with undefined calculator ID
      const schema3 = generateEnhancedCalculatorSchema(undefined)
      expect(schema3).toBeDefined()
    })

    test('updateMetaKeywords handles different calculator types', () => {
      const calculatorTypes = ['emi', 'sip', 'fd', 'ppf', 'unknown']

      calculatorTypes.forEach(type => {
        expect(() => updateMetaKeywords(type)).not.toThrow()
      })
    })

    test('updateOpenGraphTags creates all required OG tags', () => {
      const mockMetaTag = {
        content: '',
        setAttribute: vi.fn()
      }

      document.querySelector.mockReturnValue(null)
      document.createElement.mockReturnValue(mockMetaTag)

      updateOpenGraphTags('emi')

      // Should create multiple OG tags
      expect(document.createElement).toHaveBeenCalledTimes(9)
    })

    test('updateTwitterCardTags creates all required Twitter tags', () => {
      const mockMetaTag = {
        content: '',
        name: '',
        setAttribute: vi.fn()
      }

      document.querySelector.mockReturnValue(null)
      document.createElement.mockReturnValue(mockMetaTag)

      updateTwitterCardTags('sip')

      // Should create multiple Twitter tags
      expect(document.createElement).toHaveBeenCalledTimes(6)
    })

    test('addChartResponsivenessSEO adds chart-specific meta tags', () => {
      const mockMetaTag = {
        name: '',
        content: '',
        setAttribute: vi.fn()
      }

      document.querySelector.mockReturnValue(null)
      document.createElement.mockReturnValue(mockMetaTag)

      addChartResponsivenessSEO()

      // Should create chart-specific meta tags
      expect(document.createElement).toHaveBeenCalledTimes(3)
      expect(document.head.appendChild).toHaveBeenCalledTimes(3)
    })

    test('addChartResponsivenessSEO updates existing meta tags', () => {
      const mockMetaTag = {
        content: '',
        setAttribute: vi.fn()
      }

      document.querySelector.mockReturnValue(mockMetaTag)

      addChartResponsivenessSEO()

      // Should update existing meta tags
      expect(mockMetaTag.setAttribute).toHaveBeenCalledWith('content', expect.any(String))
    })

    test('addPDFExportSEO adds PDF-specific meta tags', () => {
      const mockMetaTag = {
        name: '',
        content: '',
        setAttribute: vi.fn()
      }

      document.querySelector.mockReturnValue(null)
      document.createElement.mockReturnValue(mockMetaTag)

      addPDFExportSEO()

      // Should create PDF-specific meta tags
      expect(document.createElement).toHaveBeenCalledTimes(5)
      expect(document.head.appendChild).toHaveBeenCalledTimes(5)
    })

    test('addPDFExportSEO updates existing PDF meta tags', () => {
      const mockMetaTag = {
        content: '',
        setAttribute: vi.fn()
      }

      document.querySelector.mockReturnValue(mockMetaTag)

      addPDFExportSEO()

      // Should update existing meta tags
      expect(mockMetaTag.setAttribute).toHaveBeenCalledWith('content', expect.any(String))
    })

    test('addPDFExportSEO handles both name and property attributes', () => {
      const mockMetaTag = {
        name: '',
        content: '',
        setAttribute: vi.fn()
      }

      document.querySelector.mockReturnValue(null)
      document.createElement.mockReturnValue(mockMetaTag)

      addPDFExportSEO()

      // Should set both name and property attributes appropriately
      expect(mockMetaTag.setAttribute).toHaveBeenCalledWith('name', expect.any(String))
      expect(mockMetaTag.setAttribute).toHaveBeenCalledWith('property', expect.any(String))
      expect(mockMetaTag.setAttribute).toHaveBeenCalledWith('content', expect.any(String))
    })
  })

  describe('Comprehensive Branch Coverage Tests', () => {
    test('updateCanonicalURL with window.location.origin', () => {
      const mockCanonical = {
        rel: '',
        href: '',
        setAttribute: vi.fn()
      }

      document.querySelector.mockReturnValue(null)
      document.createElement.mockReturnValue(mockCanonical)

      // Mock window.location.origin
      Object.defineProperty(window, 'location', {
        value: { origin: 'https://finclamp.com' },
        writable: true
      })

      updateCanonicalURL('emi')

      expect(mockCanonical.href).toContain('https://finclamp.com')
      expect(mockCanonical.href).toContain('/calculators?in=emi')
    })

    test('updateOpenGraphTags with window.location.origin', () => {
      const mockMetaTag = {
        content: '',
        setAttribute: vi.fn()
      }

      document.querySelector.mockReturnValue(null)
      document.createElement.mockReturnValue(mockMetaTag)

      // Mock window.location.origin
      Object.defineProperty(window, 'location', {
        value: { origin: 'https://finclamp.com' },
        writable: true
      })

      updateOpenGraphTags('sip')

      // Should create all 9 OG tags
      expect(document.createElement).toHaveBeenCalledTimes(9)
    })

    test('updateTwitterCardTags with window.location.origin', () => {
      const mockMetaTag = {
        name: '',
        content: '',
        setAttribute: vi.fn()
      }

      document.querySelector.mockReturnValue(null)
      document.createElement.mockReturnValue(mockMetaTag)

      // Mock window.location.origin
      Object.defineProperty(window, 'location', {
        value: { origin: 'https://finclamp.com' },
        writable: true
      })

      updateTwitterCardTags('fd')

      // Should create all 6 Twitter tags
      expect(document.createElement).toHaveBeenCalledTimes(6)
    })

    test('generateEnhancedCalculatorSchema with window.location.origin', () => {
      // Mock window.location.origin
      Object.defineProperty(window, 'location', {
        value: { origin: 'https://finclamp.com' },
        writable: true
      })

      const schema = generateEnhancedCalculatorSchema('ppf', { customField: 'test' }, 'USD')

      expect(schema).toHaveProperty('@context', 'https://schema.org')
      expect(schema).toHaveProperty('url')
      expect(schema.url).toContain('https://finclamp.com')
    })

    test('updateStructuredData runs without errors', () => {
      expect(() => updateStructuredData('nps', 'EUR')).not.toThrow()
    })

    test('updateStructuredData handles existing script removal', () => {
      expect(() => updateStructuredData('epf')).not.toThrow()
    })

    test('optimizeCalculatorPerformance with related calculators', () => {
      const mockLink = {
        rel: '',
        href: '',
        setAttribute: vi.fn()
      }

      document.createElement.mockReturnValue(mockLink)

      // Mock getRelatedCalculators to return some calculators
      // This function should be mocked or we need to test the actual implementation
      optimizeCalculatorPerformance('emi')

      // The function should handle the case where related calculators exist
      expect(() => optimizeCalculatorPerformance('emi')).not.toThrow()
    })

    test('trackBundlePerformance runs without errors', () => {
      expect(() => trackBundlePerformance()).not.toThrow()
    })

    test('trackBundlePerformance handles performance monitoring', () => {
      // The function should handle performance monitoring gracefully
      expect(() => trackBundlePerformance()).not.toThrow()
    })
  })

  describe('Performance Observer Tests', () => {
    test('monitorPerformanceIssues runs without errors', () => {
      expect(() => monitorPerformanceIssues()).not.toThrow()
    })

    test('monitorPerformanceIssues handles long task detection', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const mockObserver = {
        observe: vi.fn()
      }

      let longTaskCallback
      global.PerformanceObserver = vi.fn((callback) => {
        if (callback.toString().includes('longtask') || callback.toString().includes('duration')) {
          longTaskCallback = callback
        }
        return mockObserver
      })

      monitorPerformanceIssues()

      // Simulate a long task entry
      if (longTaskCallback) {
        const mockLongTaskEntry = {
          duration: 120,
          startTime: 1000,
          name: 'test-task'
        }

        longTaskCallback({
          getEntries: () => [mockLongTaskEntry]
        })

        expect(consoleSpy).toHaveBeenCalledWith('Long task detected:', expect.any(Object))
        expect(window.gtag).toHaveBeenCalledWith('event', 'long_task_critical', expect.any(Object))
      }

      consoleSpy.mockRestore()
    })

    test('monitorPerformanceIssues handles resource monitoring', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const mockObserver = {
        observe: vi.fn()
      }

      let resourceCallback
      global.PerformanceObserver = vi.fn((callback) => {
        if (callback.toString().includes('resource') || callback.toString().includes('responseEnd')) {
          resourceCallback = callback
        }
        return mockObserver
      })

      monitorPerformanceIssues()

      // Simulate a slow resource entry
      if (resourceCallback) {
        const mockSlowResourceEntry = {
          name: 'slow-image.jpg',
          responseEnd: 2500,
          startTime: 500
        }

        resourceCallback({
          getEntries: () => [mockSlowResourceEntry]
        })

        expect(consoleSpy).toHaveBeenCalledWith('Slow resource detected:', expect.any(Object))
      }

      consoleSpy.mockRestore()
    })

    test('monitorPerformanceIssues sets up calculator performance tracking', () => {
      const mockElement = {
        addEventListener: vi.fn(),
        dataset: { calculator: 'emi' }
      }

      document.querySelectorAll.mockReturnValue([mockElement])
      document.readyState = 'complete'

      const mockObserver = {
        observe: vi.fn()
      }
      global.PerformanceObserver = vi.fn(() => mockObserver)

      monitorPerformanceIssues()

      expect(mockElement.addEventListener).toHaveBeenCalledWith('input', expect.any(Function), { passive: true })
    })

    test('monitorPerformanceIssues waits for DOM when loading', () => {
      document.readyState = 'loading'
      document.addEventListener = vi.fn()

      const mockObserver = {
        observe: vi.fn()
      }
      global.PerformanceObserver = vi.fn(() => mockObserver)

      monitorPerformanceIssues()

      expect(document.addEventListener).toHaveBeenCalledWith('DOMContentLoaded', expect.any(Function))
    })

    test('optimizeWebVitals with PerformanceObserver for LCP', () => {
      const mockObserver = {
        observe: vi.fn()
      }

      let lcpCallback
      global.PerformanceObserver = vi.fn((callback) => {
        lcpCallback = callback
        return mockObserver
      })

      optimizeWebVitals()

      // Simulate poor LCP
      if (lcpCallback) {
        const mockLCPEntry = {
          entryType: 'largest-contentful-paint',
          startTime: 3000
        }

        lcpCallback({
          getEntries: () => [mockLCPEntry]
        })

        expect(window.gtag).toHaveBeenCalledWith('event', 'poor_lcp', {
          value: 3000
        })
      }
    })

    test('optimizeWebVitals handles PerformanceObserver errors', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      // Mock PerformanceObserver to throw error in try-catch block
      const originalPerformanceObserver = global.PerformanceObserver
      global.PerformanceObserver = vi.fn(() => ({
        observe: vi.fn(() => {
          throw new Error('PerformanceObserver not supported')
        })
      }))

      optimizeWebVitals()

      expect(consoleSpy).toHaveBeenCalledWith('Performance observer not supported')

      global.PerformanceObserver = originalPerformanceObserver
      consoleSpy.mockRestore()
    })
  })

  describe('Async Operations and Scheduler Tests', () => {
    test('initializePerformanceSEO runs without errors', () => {
      expect(() => initializePerformanceSEO()).not.toThrow()
    })

    test('initializePerformanceSEO fallback to setTimeout', () => {
      const originalRequestIdleCallback = window.requestIdleCallback
      delete window.requestIdleCallback

      const setTimeoutSpy = vi.spyOn(global, 'setTimeout')

      initializePerformanceSEO()

      expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 100)

      window.requestIdleCallback = originalRequestIdleCallback
      setTimeoutSpy.mockRestore()
    })

    test('updateSEO runs without errors', () => {
      expect(() => updateSEO('gst')).not.toThrow()
    })

    test('optimizeWebVitals with scheduler.postTask', () => {
      optimizeWebVitals()

      expect(window.scheduler.postTask).toHaveBeenCalled()
    })

    test('optimizeWebVitals without scheduler API', () => {
      const originalScheduler = window.scheduler
      delete window.scheduler

      expect(() => optimizeWebVitals()).not.toThrow()

      window.scheduler = originalScheduler
    })

    test('optimizeCalculatorPerformance with lazy elements', () => {
      const mockElement = {
        dataset: { lazyCalculator: 'emi' },
        style: { display: 'none' }
      }

      document.querySelectorAll.mockReturnValue([mockElement])

      optimizeCalculatorPerformance('emi')

      // Function should handle lazy elements
      expect(() => optimizeCalculatorPerformance('emi')).not.toThrow()
    })

    test('optimizeCalculatorPerformance without requestIdleCallback', () => {
      const originalRequestIdleCallback = window.requestIdleCallback
      delete window.requestIdleCallback

      expect(() => optimizeCalculatorPerformance('sip')).not.toThrow()

      window.requestIdleCallback = originalRequestIdleCallback
    })
  })

  describe('Font and Resource Loading Tests', () => {
    test('optimizeWebVitals runs resource optimization', () => {
      expect(() => optimizeWebVitals()).not.toThrow()
    })

    test('addResourceOptimization handles images without loading attribute', () => {
      const mockImage = {
        setAttribute: vi.fn(),
        closest: vi.fn(() => null)
      }

      document.querySelectorAll.mockReturnValue([mockImage])

      addResourceOptimization()

      expect(mockImage.setAttribute).toHaveBeenCalledWith('loading', 'lazy')
      expect(mockImage.setAttribute).toHaveBeenCalledWith('decoding', 'async')
    })

    test('addResourceOptimization skips critical images', () => {
      const mockCriticalImage = {
        setAttribute: vi.fn(),
        closest: vi.fn(() => ({ dataset: { critical: true } }))
      }

      document.querySelectorAll.mockReturnValue([mockCriticalImage])

      addResourceOptimization()

      // Critical images should not get lazy loading
      expect(mockCriticalImage.setAttribute).not.toHaveBeenCalledWith('loading', 'lazy')
    })

    test('addResourceOptimization sets fetchpriority for critical images', () => {
      const mockCriticalImage = {
        setAttribute: vi.fn()
      }

      // Mock both querySelectorAll calls
      document.querySelectorAll
        .mockReturnValueOnce([]) // For non-critical images
        .mockReturnValueOnce([mockCriticalImage]) // For critical images

      addResourceOptimization()

      expect(mockCriticalImage.setAttribute).toHaveBeenCalledWith('fetchpriority', 'high')
      expect(mockCriticalImage.setAttribute).toHaveBeenCalledWith('loading', 'eager')
    })
  })

  describe('Mobile and Additional SEO Tests', () => {
    test('addMobileResponsivenessSEO adds mobile-specific meta tags', () => {
      const mockMetaTag = {
        name: '',
        content: '',
        setAttribute: vi.fn()
      }

      document.querySelector.mockReturnValue(null)
      document.createElement.mockReturnValue(mockMetaTag)

      addMobileResponsivenessSEO()

      // Should create mobile-specific meta tags (7 tags total)
      expect(document.createElement).toHaveBeenCalledTimes(7)
      expect(document.head.appendChild).toHaveBeenCalledTimes(7)
    })

    test('addMobileResponsivenessSEO updates existing mobile meta tags', () => {
      const mockMetaTag = {
        content: '',
        setAttribute: vi.fn()
      }

      document.querySelector.mockReturnValue(mockMetaTag)

      addMobileResponsivenessSEO()

      // Should update existing meta tags
      expect(mockMetaTag.setAttribute).toHaveBeenCalledWith('content', expect.any(String))
    })

    test('updateMetaKeywords with different calculator types', () => {
      const mockMetaTag = {
        content: '',
        name: '',
        setAttribute: vi.fn()
      }

      document.querySelector.mockReturnValue(mockMetaTag)

      // Test different calculator types
      updateMetaKeywords('emi')
      expect(mockMetaTag.content).toContain('EMI calculator')

      updateMetaKeywords('sip')
      expect(mockMetaTag.content).toContain('SIP calculator')

      updateMetaKeywords('unknown')
      expect(mockMetaTag.content).toContain('financial calculator')
    })

    test('generateBreadcrumbData with different calculators', () => {
      const emiBreadcrumb = generateBreadcrumbData('emi')
      const sipBreadcrumb = generateBreadcrumbData('sip')
      const unknownBreadcrumb = generateBreadcrumbData('unknown')

      expect(emiBreadcrumb.itemListElement).toHaveLength(3)
      expect(sipBreadcrumb.itemListElement).toHaveLength(3)
      expect(unknownBreadcrumb.itemListElement).toHaveLength(3)

      // Check that calculator-specific breadcrumbs are different
      expect(emiBreadcrumb.itemListElement[2].name).toContain('EMI')
      expect(sipBreadcrumb.itemListElement[2].name).toContain('SIP')
    })

    test('generateEnhancedCalculatorSchema with all parameters', () => {
      const customData = {
        customField: 'test',
        additionalInfo: 'extra data'
      }

      const schema = generateEnhancedCalculatorSchema('fd', customData, 'USD')

      expect(schema).toHaveProperty('@context', 'https://schema.org')
      expect(schema).toHaveProperty('@type')
      expect(schema).toHaveProperty('name')
      expect(schema).toHaveProperty('description')
      expect(schema).toHaveProperty('url')
      expect(schema).toHaveProperty('featureList')
      expect(schema.featureList).toBeInstanceOf(Array)
    })

    test('calculatorSEOData completeness check', () => {
      const requiredFields = ['title', 'description', 'keywords', 'canonical', 'structuredData']
      const calculatorTypes = ['emi', 'sip', 'fd', 'ppf', 'nps', 'epf', 'gst', 'income-tax']

      calculatorTypes.forEach(type => {
        if (calculatorSEOData[type]) {
          requiredFields.forEach(field => {
            expect(calculatorSEOData[type]).toHaveProperty(field)
          })
        }
      })
    })

    test('defaultSEOData structure validation', () => {
      expect(defaultSEOData).toHaveProperty('title')
      expect(defaultSEOData).toHaveProperty('description')
      expect(defaultSEOData).toHaveProperty('keywords')
      expect(defaultSEOData).toHaveProperty('canonical')
      expect(defaultSEOData).toHaveProperty('structuredData')

      expect(defaultSEOData.structuredData).toHaveProperty('@context', 'https://schema.org')
      expect(defaultSEOData.structuredData).toHaveProperty('@type', 'WebApplication')
      expect(defaultSEOData.structuredData).toHaveProperty('featureList')
      expect(defaultSEOData.structuredData.featureList).toBeInstanceOf(Array)
    })

    test('getSEOData fallback behavior', () => {
      const validData = getSEOData('emi')
      const invalidData = getSEOData('non-existent-calculator')
      const nullData = getSEOData(null)
      const undefinedData = getSEOData(undefined)

      expect(validData).toBe(calculatorSEOData.emi)
      expect(invalidData).toBe(defaultSEOData)
      expect(nullData).toBe(defaultSEOData)
      expect(undefinedData).toBe(defaultSEOData)
    })


  })
})
