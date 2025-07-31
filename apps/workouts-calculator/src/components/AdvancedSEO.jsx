import { useEffect } from 'react'
import { getCalculatorDescription } from '../data/calculatorDescriptions'

const AdvancedSEO = ({ calculatorId, inputs = {}, results = {} }) => {
  useEffect(() => {
    if (!calculatorId) return

    const description = getCalculatorDescription(calculatorId)
    if (!description) return

    // Extract URL parameters to enhance SEO with actual user inputs
    const urlParams = new URLSearchParams(window.location.search)
    const urlInputs = {}

    // Extract calculator-specific parameters from URL
    for (const [key, value] of urlParams.entries()) {
      if (key.startsWith(`${calculatorId}_`)) {
        const inputKey = key.replace(`${calculatorId}_`, '')
        urlInputs[inputKey] = value
      }
    }

    // Merge URL inputs with passed inputs (URL takes precedence for SEO)
    const enhancedInputs = { ...inputs, ...urlInputs }

    if (process.env.NODE_ENV === 'development') {
      console.log('🚀 AdvancedSEO: Processing calculator:', calculatorId)
      console.log('📊 AdvancedSEO: Enhanced inputs:', enhancedInputs)
    }

    // Generate dynamic title with enhanced inputs first
    if (Object.keys(enhancedInputs).length > 0) {
      const baseTitle = description.title.split(' - ')[0]
      const inputValues = Object.values(enhancedInputs).filter(val => val && val !== '').slice(0, 2)

      if (inputValues.length > 0) {
        const dynamicTitle = `${baseTitle} - ${inputValues.join(', ')} | FinClamp`
        document.title = dynamicTitle

        if (process.env.NODE_ENV === 'development') {
          console.log('📝 AdvancedSEO: Updated title to:', dynamicTitle)
        }
      }
    }

    // Add advanced meta tags with enhanced inputs from URL
    addAdvancedMetaTags(description, calculatorId, enhancedInputs, results)

    // Add performance hints
    addPerformanceHints()

    // Add security headers
    addSecurityHeaders()

    // Add mobile optimization tags
    addMobileOptimization()

    // Add social media optimization
    addSocialMediaOptimization(description, calculatorId)

    // Add rich snippets for calculator results
    if (Object.keys(results).length > 0) {
      addCalculatorResultsSchema(description, calculatorId, enhancedInputs, results)
    }

  }, [calculatorId, inputs, results])

  const addAdvancedMetaTags = (description, calculatorId, inputs, results) => {
    // Add language and region tags
    updateMetaTag('language', 'en-US')
    updateMetaTag('geo.region', 'US')
    updateMetaTag('geo.placename', 'United States')
    
    // Add content classification
    updateMetaTag('rating', 'general')
    updateMetaTag('distribution', 'global')
    updateMetaTag('revisit-after', '7 days')
    
    // Add mobile-specific tags
    updateMetaTag('format-detection', 'telephone=no')
    updateMetaTag('apple-mobile-web-app-capable', 'yes')
    updateMetaTag('apple-mobile-web-app-status-bar-style', 'default')
    updateMetaTag('apple-mobile-web-app-title', 'FinClamp')
    
    // Add theme color for mobile browsers
    updateMetaTag('theme-color', '#667eea')
    updateMetaTag('msapplication-TileColor', '#667eea')
    
    // Add preconnect hints for performance
    addPreconnectHints()
  }

  const addPreconnectHints = () => {
    const preconnectDomains = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'https://www.google-analytics.com',
      'https://www.googletagmanager.com'
    ]

    preconnectDomains.forEach(domain => {
      if (!document.querySelector(`link[href="${domain}"]`)) {
        const link = document.createElement('link')
        link.rel = 'preconnect'
        link.href = domain
        link.crossOrigin = 'anonymous'
        document.head.appendChild(link)
      }
    })
  }

  const addPerformanceHints = () => {
    // Add DNS prefetch for external resources
    const dnsPrefetchDomains = [
      '//www.google.com',
      '//www.facebook.com',
      '//twitter.com',
      '//linkedin.com'
    ]

    dnsPrefetchDomains.forEach(domain => {
      if (!document.querySelector(`link[href="${domain}"]`)) {
        const link = document.createElement('link')
        link.rel = 'dns-prefetch'
        link.href = domain
        document.head.appendChild(link)
      }
    })

    // Add resource hints for critical assets
    const resourceHints = [
      { rel: 'preload', href: '/favicon.svg', as: 'image', type: 'image/svg+xml' }
    ]

    resourceHints.forEach(hint => {
      if (!document.querySelector(`link[href="${hint.href}"]`)) {
        const link = document.createElement('link')
        Object.keys(hint).forEach(key => {
          link[key] = hint[key]
        })
        document.head.appendChild(link)
      }
    })
  }

  const addSecurityHeaders = () => {
    // Add security-related meta tags
    updateMetaTag('referrer', 'strict-origin-when-cross-origin')
    updateMetaTag('robots', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1')
    
    // Add content security policy meta tag
    const cspContent = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://www.google-analytics.com"
    updateMetaTag('Content-Security-Policy', cspContent)
  }

  const addMobileOptimization = () => {
    // Ensure viewport meta tag is optimized
    let viewportTag = document.querySelector('meta[name="viewport"]')
    if (!viewportTag) {
      viewportTag = document.createElement('meta')
      viewportTag.name = 'viewport'
      document.head.appendChild(viewportTag)
    }
    viewportTag.content = 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes'

    // Add mobile web app manifest link
    if (!document.querySelector('link[rel="manifest"]')) {
      const manifestLink = document.createElement('link')
      manifestLink.rel = 'manifest'
      manifestLink.href = '/manifest.json'
      document.head.appendChild(manifestLink)
    }
  }

  const addSocialMediaOptimization = (description, calculatorId) => {
    // Enhanced Open Graph tags
    updateMetaProperty('og:site_name', 'FinClamp')
    updateMetaProperty('og:locale', 'en_US')
    updateMetaProperty('og:updated_time', new Date().toISOString())
    
    // Enhanced Twitter Card tags
    updateMetaName('twitter:creator', '@finclamp')
    updateMetaName('twitter:site', '@finclamp')
    updateMetaName('twitter:domain', 'finclamp.com')
    
    // Add Facebook App ID if available
    updateMetaProperty('fb:app_id', '123456789') // Replace with actual app ID
    
    // Add structured data for social media
    const socialMediaData = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": description.title,
      "description": description.description,
      "url": `${window.location.origin}/calculators?in=${calculatorId}`,
      "mainEntity": {
        "@type": "SoftwareApplication",
        "name": description.title,
        "applicationCategory": "FinanceApplication"
      },
      "publisher": {
        "@type": "Organization",
        "name": "FinClamp",
        "logo": `${window.location.origin}/favicon.svg`
      }
    }

    const existingScript = document.querySelector('script[data-schema="social-media"]')
    if (existingScript) existingScript.remove()

    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.setAttribute('data-schema', 'social-media')
    script.textContent = JSON.stringify(socialMediaData, null, 2)
    document.head.appendChild(script)
  }

  const addCalculatorResultsSchema = (description, calculatorId, inputs, results) => {
    const resultsData = {
      "@context": "https://schema.org",
      "@type": "CalculatorAction",
      "name": `${description.title} - Results`,
      "description": `Calculated results for ${description.title}`,
      "url": window.location.href,
      "instrument": {
        "@type": "SoftwareApplication",
        "name": description.title,
        "applicationCategory": "FinanceApplication"
      },
      "result": {
        "@type": "QuantitativeValue",
        "description": "Calculator computation results",
        "additionalProperty": Object.keys(results).map(key => ({
          "@type": "PropertyValue",
          "name": key,
          "value": results[key]
        }))
      },
      "object": {
        "@type": "Thing",
        "name": "Financial Calculation",
        "additionalProperty": Object.keys(inputs).map(key => ({
          "@type": "PropertyValue", 
          "name": key,
          "value": inputs[key]
        }))
      }
    }

    const existingScript = document.querySelector('script[data-schema="calculator-results"]')
    if (existingScript) existingScript.remove()

    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.setAttribute('data-schema', 'calculator-results')
    script.textContent = JSON.stringify(resultsData, null, 2)
    document.head.appendChild(script)
  }

  const updateMetaTag = (name, content) => {
    let metaTag = document.querySelector(`meta[name="${name}"]`)
    if (!metaTag) {
      metaTag = document.createElement('meta')
      metaTag.name = name
      document.head.appendChild(metaTag)
    }
    metaTag.content = content
  }

  const updateMetaProperty = (property, content) => {
    let metaTag = document.querySelector(`meta[property="${property}"]`)
    if (!metaTag) {
      metaTag = document.createElement('meta')
      metaTag.setAttribute('property', property)
      document.head.appendChild(metaTag)
    }
    metaTag.content = content
  }

  const updateMetaName = (name, content) => {
    let metaTag = document.querySelector(`meta[name="${name}"]`)
    if (!metaTag) {
      metaTag = document.createElement('meta')
      metaTag.name = name
      document.head.appendChild(metaTag)
    }
    metaTag.content = content
  }

  return null
}

export default AdvancedSEO
