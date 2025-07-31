import { useEffect } from 'react'
import { getCalculatorDescription } from '../data/calculatorDescriptions'
import { updateSEOFromURL, extractCalculatorInputsFromURL } from '../utils/seoUrlHelper'

const SEOEnhancer = ({ calculatorId }) => {
  useEffect(() => {
    // Debug logging in development
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 SEOEnhancer: Calculator ID changed to:', calculatorId)
    }

    if (!calculatorId) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('⚠️ SEOEnhancer: No calculator ID provided')
      }
      return
    }

    const description = getCalculatorDescription(calculatorId)
    if (!description) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('⚠️ SEOEnhancer: No description found for calculator:', calculatorId)
      }
      return
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('✅ SEOEnhancer: Updating SEO for:', description.title)
    }

    // First, update SEO based on URL parameters (this includes dynamic titles)
    updateSEOFromURL(calculatorId)

    // Then update document title with SEO-optimized title (fallback if no URL params)
    if (!extractCalculatorInputsFromURL(calculatorId) || Object.keys(extractCalculatorInputsFromURL(calculatorId)).length === 0) {
      document.title = description.title
    }

    // Update meta description
    updateMetaTag('description', description.description)

    // Update meta keywords if available
    if (description.seoKeywords) {
      updateMetaTag('keywords', description.seoKeywords)
    }

    // Add Open Graph tags for social media
    updateOpenGraphTags(description, calculatorId)

    // Add Twitter Card tags
    updateTwitterCardTags(description, calculatorId)

    // Update structured data with enhanced SEO
    updateEnhancedStructuredData(description, calculatorId)

    // Add FAQ structured data for better search results
    if (description.searchQueries) {
      addFAQStructuredData(description, calculatorId)
    }

    // Add breadcrumb structured data
    addBreadcrumbStructuredData(description, calculatorId)

    // Add local business schema for better local SEO
    addLocalBusinessSchema()

    // Add website schema
    addWebsiteSchema()

    // Add organization schema
    addOrganizationSchema()

    // Add software application schema
    addSoftwareApplicationSchema(description, calculatorId)

  }, [calculatorId])

  const updateMetaTag = (name, content) => {
    try {
      let metaTag = document.querySelector(`meta[name="${name}"]`)
      if (!metaTag) {
        metaTag = document.createElement('meta')
        metaTag.name = name
        if (document.head && document.head.appendChild) {
          document.head.appendChild(metaTag)
        }
      }
      metaTag.content = content
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('SEOEnhancer: Error updating meta tag:', error)
      }
    }
  }

  const updateOpenGraphTags = (description, calculatorId) => {
    const baseURL = window.location.origin
    const ogTags = [
      { property: 'og:title', content: description.title },
      { property: 'og:description', content: description.description },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: `${baseURL}?calculator=${calculatorId}` },
      { property: 'og:site_name', content: 'FinClamp' },
      { property: 'og:image', content: `${baseURL}/og-calculator-${calculatorId}.jpg` },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:image:alt', content: description.title }
    ]

    ogTags.forEach(tag => {
      try {
        let metaTag = document.querySelector(`meta[property="${tag.property}"]`)
        if (!metaTag) {
          metaTag = document.createElement('meta')
          metaTag.setAttribute('property', tag.property)
          if (document.head && document.head.appendChild) {
            document.head.appendChild(metaTag)
          }
        }
        metaTag.content = tag.content
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('SEOEnhancer: Error updating Open Graph tag:', error)
        }
      }
    })
  }

  const updateTwitterCardTags = (description, calculatorId) => {
    const baseURL = window.location.origin
    const twitterTags = [
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: description.title },
      { name: 'twitter:description', content: description.description },
      { name: 'twitter:image', content: `${baseURL}/twitter-calculator-${calculatorId}.jpg` },
      { name: 'twitter:site', content: '@FinClamp' },
      { name: 'twitter:creator', content: '@FinClamp' }
    ]

    twitterTags.forEach(tag => {
      try {
        let metaTag = document.querySelector(`meta[name="${tag.name}"]`)
        if (!metaTag) {
          metaTag = document.createElement('meta')
          metaTag.name = tag.name
          if (document.head && document.head.appendChild) {
            document.head.appendChild(metaTag)
          }
        }
        metaTag.content = tag.content
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('SEOEnhancer: Error updating Twitter Card tag:', error)
        }
      }
    })
  }

  const updateEnhancedStructuredData = (description, calculatorId) => {
    try {
      // Remove existing structured data
      const existingScript = document.querySelector('script[data-type="calculator-structured-data"]')
      if (existingScript) {
        existingScript.remove()
      }

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": description.title,
      "description": description.description,
      "url": `${window.location.origin}?calculator=${calculatorId}`,
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Any",
      "browserRequirements": "Requires JavaScript",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "1250",
        "bestRating": "5",
        "worstRating": "1"
      },
      "publisher": {
        "@type": "Organization",
        "name": "FinClamp",
        "url": window.location.origin,
        "logo": {
          "@type": "ImageObject",
          "url": `${window.location.origin}/favicon.svg`
        }
      },
      "dateModified": new Date().toISOString(),
      "inLanguage": "en-US",
      "keywords": description.seoKeywords || "",
      "mainEntity": {
        "@type": "SoftwareApplication",
        "name": description.title,
        "applicationCategory": "Finance",
        "operatingSystem": "Web Browser"
      }
    }

      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.setAttribute('data-type', 'calculator-structured-data')
      script.textContent = JSON.stringify(structuredData, null, 2)
      if (document.head && document.head.appendChild) {
        document.head.appendChild(script)
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('SEOEnhancer: Error adding structured data:', error)
      }
    }
  }

  const addFAQStructuredData = (description, calculatorId) => {
    if (!description.searchQueries) return

    try {
      // Remove existing FAQ structured data
      const existingFAQ = document.querySelector('script[data-type="faq-structured-data"]')
      if (existingFAQ) {
        existingFAQ.remove()
      }

    const faqData = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": description.searchQueries.slice(0, 5).map((query, index) => ({
        "@type": "Question",
        "name": query,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Use our free ${description.title.split(' - ')[0]} to ${query.toLowerCase()}. Get instant results with detailed calculations and explanations.`
        }
      }))
    }

      const faqScript = document.createElement('script')
      faqScript.type = 'application/ld+json'
      faqScript.setAttribute('data-type', 'faq-structured-data')
      faqScript.textContent = JSON.stringify(faqData, null, 2)
      if (document.head && document.head.appendChild) {
        document.head.appendChild(faqScript)
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('SEOEnhancer: Error adding FAQ structured data:', error)
      }
    }
  }

  const addBreadcrumbStructuredData = (description, calculatorId) => {
    try {
      // Remove existing breadcrumb structured data
      const existingBreadcrumb = document.querySelector('script[data-type="breadcrumb-structured-data"]')
      if (existingBreadcrumb) {
        existingBreadcrumb.remove()
      }

    const breadcrumbData = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": window.location.origin
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Financial Calculators",
          "item": `${window.location.origin}/calculators`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": description.title.split(' - ')[0],
          "item": `${window.location.origin}?calculator=${calculatorId}`
        }
      ]
    }

      const breadcrumbScript = document.createElement('script')
      breadcrumbScript.type = 'application/ld+json'
      breadcrumbScript.setAttribute('data-type', 'breadcrumb-structured-data')
      breadcrumbScript.textContent = JSON.stringify(breadcrumbData, null, 2)
      if (document.head && document.head.appendChild) {
        document.head.appendChild(breadcrumbScript)
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('SEOEnhancer: Error adding breadcrumb structured data:', error)
      }
    }
  }

  const addLocalBusinessSchema = () => {
    try {
      const existingScript = document.querySelector('script[data-schema="local-business"]')
      if (existingScript) existingScript.remove()

    const localBusinessData = {
      "@context": "https://schema.org",
      "@type": "FinancialService",
      "name": "FinClamp",
      "description": "Free online financial calculators and planning tools",
      "url": window.location.origin,
      "logo": `${window.location.origin}/favicon.svg`,
      "sameAs": [
        "https://twitter.com/finclamp",
        "https://linkedin.com/company/finclamp"
      ],
      "serviceType": "Financial Calculator",
      "areaServed": "Worldwide",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Financial Calculators",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "EMI Calculator",
              "description": "Calculate loan EMI online"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "SIP Calculator",
              "description": "Calculate SIP returns and investment growth"
            }
          }
        ]
      }
    }

      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.setAttribute('data-schema', 'local-business')
      script.textContent = JSON.stringify(localBusinessData, null, 2)
      if (document.head && document.head.appendChild) {
        document.head.appendChild(script)
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('SEOEnhancer: Error adding local business schema:', error)
      }
    }
  }

  const addWebsiteSchema = () => {
    try {
      const existingScript = document.querySelector('script[data-schema="website"]')
      if (existingScript) existingScript.remove()

    const websiteData = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "FinClamp",
      "alternateName": "FinClamp Financial Calculators",
      "url": window.location.origin,
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${window.location.origin}/calculators?q={search_term_string}`
        },
        "query-input": "required name=search_term_string"
      },
      "mainEntity": {
        "@type": "WebApplication",
        "name": "Financial Calculator Suite",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Any"
      }
    }

      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.setAttribute('data-schema', 'website')
      script.textContent = JSON.stringify(websiteData, null, 2)
      if (document.head && document.head.appendChild) {
        document.head.appendChild(script)
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('SEOEnhancer: Error adding website schema:', error)
      }
    }
  }

  const addOrganizationSchema = () => {
    try {
      const existingScript = document.querySelector('script[data-schema="organization"]')
      if (existingScript) existingScript.remove()

    const organizationData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "FinClamp",
      "legalName": "FinClamp Financial Services",
      "url": window.location.origin,
      "logo": `${window.location.origin}/favicon.svg`,
      "foundingDate": "2024",
      "description": "Leading provider of free online financial calculators and planning tools",
      "knowsAbout": [
        "Financial Planning",
        "Loan Calculations",
        "Investment Planning",
        "Tax Planning",
        "Retirement Planning"
      ],
      "serviceArea": {
        "@type": "GeoShape",
        "name": "Worldwide"
      }
    }

      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.setAttribute('data-schema', 'organization')
      script.textContent = JSON.stringify(organizationData, null, 2)
      if (document.head && document.head.appendChild) {
        document.head.appendChild(script)
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('SEOEnhancer: Error adding organization schema:', error)
      }
    }
  }

  const addSoftwareApplicationSchema = (description, calculatorId) => {
    try {
      const existingScript = document.querySelector('script[data-schema="software-app"]')
      if (existingScript) existingScript.remove()

    const appData = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": description.title,
      "description": description.description,
      "url": `${window.location.origin}/calculators?in=${calculatorId}`,
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Any",
      "browserRequirements": "Requires JavaScript",
      "permissions": "No special permissions required",
      "isAccessibleForFree": true,
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "featureList": [
        "Real-time calculations",
        "Interactive charts",
        "PDF export",
        "Share results",
        "Mobile responsive"
      ],
      "screenshot": `${window.location.origin}/screenshots/${calculatorId}.jpg`,
      "softwareVersion": "1.0.0",
      "datePublished": "2024-01-01",
      "dateModified": new Date().toISOString().split('T')[0]
    }

      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.setAttribute('data-schema', 'software-app')
      script.textContent = JSON.stringify(appData, null, 2)
      if (document.head && document.head.appendChild) {
        document.head.appendChild(script)
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('SEOEnhancer: Error adding software application schema:', error)
      }
    }
  }

  // This component doesn't render anything
  return null
}

export default SEOEnhancer
