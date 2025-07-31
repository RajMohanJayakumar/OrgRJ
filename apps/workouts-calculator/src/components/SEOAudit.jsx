import { useEffect, useState } from 'react'

const SEOAudit = ({ calculatorId }) => {
  const [auditResults, setAuditResults] = useState({})
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Only show in development mode
    if (process.env.NODE_ENV === 'development') {
      performSEOAudit()
    }
  }, [calculatorId])

  const performSEOAudit = () => {
    const results = {
      title: auditTitle(),
      metaDescription: auditMetaDescription(),
      headings: auditHeadings(),
      images: auditImages(),
      links: auditLinks(),
      structuredData: auditStructuredData(),
      performance: auditPerformance(),
      mobile: auditMobile(),
      accessibility: auditAccessibility(),
      socialMedia: auditSocialMedia()
    }

    setAuditResults(results)
  }

  const auditTitle = () => {
    try {
      const title = document.title || ''
      return {
        exists: !!title,
        length: title.length,
        isOptimal: title.length >= 30 && title.length <= 60,
        content: title,
        issues: title.length < 30 ? ['Title too short'] : title.length > 60 ? ['Title too long'] : []
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('SEOAudit: Error auditing title:', error)
      }
      return {
        exists: false,
        length: 0,
        isOptimal: false,
        content: '',
        issues: ['Error accessing title']
      }
    }
  }

  const auditMetaDescription = () => {
    try {
      const metaDesc = document.querySelector('meta[name="description"]')
      const content = metaDesc?.content || ''
      return {
        exists: !!metaDesc,
        length: content.length,
        isOptimal: content.length >= 120 && content.length <= 160,
        content: content,
        issues: !metaDesc ? ['Meta description missing'] :
                content.length < 120 ? ['Meta description too short'] :
                content.length > 160 ? ['Meta description too long'] : []
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('SEOAudit: Error auditing meta description:', error)
      }
      return {
        exists: false,
        length: 0,
        isOptimal: false,
        content: '',
        issues: ['Error accessing meta description']
      }
    }
  }

  const auditHeadings = () => {
    try {
      const h1s = document.querySelectorAll('h1')
      const h2s = document.querySelectorAll('h2')
      const h3s = document.querySelectorAll('h3')

      return {
        h1Count: h1s.length,
        h2Count: h2s.length,
        h3Count: h3s.length,
        hasH1: h1s.length > 0,
        multipleH1: h1s.length > 1,
        hierarchy: checkHeadingHierarchy(),
        issues: h1s.length === 0 ? ['No H1 tag found'] :
                 h1s.length > 1 ? ['Multiple H1 tags found'] : []
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('SEOAudit: Error auditing headings:', error)
      }
      return {
        h1Count: 0,
        h2Count: 0,
        h3Count: 0,
        hasH1: false,
        multipleH1: false,
        hierarchy: false,
        issues: ['Error accessing headings']
      }
    }
  }

  const auditImages = () => {
    try {
      const images = document.querySelectorAll('img')
      const imagesWithoutAlt = Array.from(images).filter(img => !img.alt)

      return {
        totalImages: images.length,
        imagesWithoutAlt: imagesWithoutAlt.length,
        altTextCoverage: images.length > 0 ? ((images.length - imagesWithoutAlt.length) / images.length * 100).toFixed(1) : 100,
        issues: imagesWithoutAlt.length > 0 ? [`${imagesWithoutAlt.length} images missing alt text`] : []
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('SEOAudit: Error auditing images:', error)
      }
      return {
        totalImages: 0,
        imagesWithoutAlt: 0,
        altTextCoverage: 100,
        issues: ['Error accessing images']
      }
    }
  }

  const auditLinks = () => {
    const links = document.querySelectorAll('a')
    const externalLinks = Array.from(links).filter(link => 
      link.href && (link.href.startsWith('http') && !link.href.includes(window.location.hostname))
    )
    const linksWithoutText = Array.from(links).filter(link => !link.textContent.trim())
    
    return {
      totalLinks: links.length,
      externalLinks: externalLinks.length,
      linksWithoutText: linksWithoutText.length,
      issues: linksWithoutText.length > 0 ? [`${linksWithoutText.length} links without text`] : []
    }
  }

  const auditStructuredData = () => {
    const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]')
    const schemas = Array.from(jsonLdScripts).map(script => {
      try {
        const data = JSON.parse(script.textContent)
        return data['@type'] || 'Unknown'
      } catch (e) {
        return 'Invalid JSON'
      }
    })
    
    return {
      count: jsonLdScripts.length,
      schemas: schemas,
      hasWebApplication: schemas.includes('WebApplication'),
      hasOrganization: schemas.includes('Organization'),
      hasFAQPage: schemas.includes('FAQPage'),
      issues: jsonLdScripts.length === 0 ? ['No structured data found'] : []
    }
  }

  const auditPerformance = () => {
    const navigation = performance.getEntriesByType('navigation')[0]
    const issues = []
    
    if (navigation) {
      const loadTime = navigation.loadEventEnd - navigation.navigationStart
      const domContentLoaded = navigation.domContentLoadedEventEnd - navigation.navigationStart
      
      if (loadTime > 3000) issues.push('Page load time > 3 seconds')
      if (domContentLoaded > 1500) issues.push('DOM content loaded > 1.5 seconds')
      
      return {
        loadTime: Math.round(loadTime),
        domContentLoaded: Math.round(domContentLoaded),
        issues: issues
      }
    }
    
    return { issues: ['Performance data not available'] }
  }

  const auditMobile = () => {
    const viewport = document.querySelector('meta[name="viewport"]')
    const issues = []
    
    if (!viewport) issues.push('Viewport meta tag missing')
    else if (!viewport.content.includes('width=device-width')) {
      issues.push('Viewport not responsive')
    }
    
    return {
      hasViewport: !!viewport,
      viewportContent: viewport?.content || '',
      issues: issues
    }
  }

  const auditAccessibility = () => {
    const issues = []
    const focusableElements = document.querySelectorAll('button, a, input, select, textarea')
    const elementsWithoutTabIndex = Array.from(focusableElements).filter(el => 
      el.tabIndex < 0 && !el.disabled
    )
    
    if (elementsWithoutTabIndex.length > 0) {
      issues.push(`${elementsWithoutTabIndex.length} focusable elements may not be keyboard accessible`)
    }
    
    return {
      focusableElements: focusableElements.length,
      keyboardAccessible: focusableElements.length - elementsWithoutTabIndex.length,
      issues: issues
    }
  }

  const auditSocialMedia = () => {
    const ogTitle = document.querySelector('meta[property="og:title"]')
    const ogDescription = document.querySelector('meta[property="og:description"]')
    const ogImage = document.querySelector('meta[property="og:image"]')
    const twitterCard = document.querySelector('meta[name="twitter:card"]')
    
    const issues = []
    if (!ogTitle) issues.push('Open Graph title missing')
    if (!ogDescription) issues.push('Open Graph description missing')
    if (!ogImage) issues.push('Open Graph image missing')
    if (!twitterCard) issues.push('Twitter Card missing')
    
    return {
      hasOgTitle: !!ogTitle,
      hasOgDescription: !!ogDescription,
      hasOgImage: !!ogImage,
      hasTwitterCard: !!twitterCard,
      issues: issues
    }
  }

  const checkHeadingHierarchy = () => {
    try {
      const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'))
      let isValid = true
      let previousLevel = 0

      headings.forEach(heading => {
        const level = parseInt(heading.tagName.charAt(1))
        if (level > previousLevel + 1) {
          isValid = false
        }
        previousLevel = level
      })

      return isValid
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('SEOAudit: Error checking heading hierarchy:', error)
      }
      return false
    }
  }

  const getTotalIssues = () => {
    return Object.values(auditResults).reduce((total, section) => {
      return total + (section.issues?.length || 0)
    }, 0)
  }

  const getOverallScore = () => {
    const totalChecks = 20 // Approximate number of checks
    const issues = getTotalIssues()
    return Math.max(0, Math.round(((totalChecks - issues) / totalChecks) * 100))
  }

  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
      >
        SEO Audit {Object.keys(auditResults).length > 0 && `(${getOverallScore()}%)`}
      </button>
      
      {isVisible && Object.keys(auditResults).length > 0 && (
        <div className="absolute bottom-12 right-0 w-96 max-h-96 overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-xl p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg">SEO Audit Results</h3>
            <div className={`px-2 py-1 rounded text-sm font-semibold ${
              getOverallScore() >= 90 ? 'bg-green-100 text-green-800' :
              getOverallScore() >= 70 ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {getOverallScore()}%
            </div>
          </div>
          
          <div className="space-y-3 text-sm">
            {Object.entries(auditResults).map(([section, data]) => (
              <div key={section} className="border-b border-gray-200 pb-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium capitalize">{section.replace(/([A-Z])/g, ' $1')}</span>
                  <span className={`w-3 h-3 rounded-full ${
                    data.issues?.length === 0 ? 'bg-green-500' : 'bg-red-500'
                  }`}></span>
                </div>
                {data.issues?.length > 0 && (
                  <ul className="mt-1 text-xs text-red-600">
                    {data.issues.map((issue, index) => (
                      <li key={index}>• {issue}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-xs text-gray-500">
            Total Issues: {getTotalIssues()}
          </div>
        </div>
      )}
    </div>
  )
}

export default SEOAudit
