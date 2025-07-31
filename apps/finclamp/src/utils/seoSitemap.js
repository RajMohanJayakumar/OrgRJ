// SEO Sitemap generator for calculator pages
import { calculatorDescriptions } from '../data/calculatorDescriptions'

export const generateSEOSitemap = () => {
  const baseURL = 'https://finclamp.com'
  const currentDate = new Date().toISOString().split('T')[0]
  
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  
  <!-- Homepage -->
  <url>
    <loc>${baseURL}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <image:image>
      <image:loc>${baseURL}/og-image.svg</image:loc>
      <image:title>FinClamp - Financial Calculator Suite</image:title>
    </image:image>
  </url>
  
  <!-- Calculator Pages -->`



  // Generate URLs for each calculator using new main menu format
  Object.entries(calculatorDescriptions).forEach(([calculatorId, data]) => {
    const priority = getPriorityByCalculator(calculatorId)
    const changefreq = getChangeFreqByCalculator(calculatorId)
    const mainMenu = calculatorId === 'finance-quest' ? 'games' : 'calculators'

    sitemap += `
  <url>
    <loc>${baseURL}/${mainMenu}?in=${calculatorId}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
    <image:image>
      <image:loc>${baseURL}/og-calculator-${calculatorId}.jpg</image:loc>
      <image:title>${data.title}</image:title>
    </image:image>
  </url>`

    // Add search query variations for high-traffic calculators
    if (data.searchQueries && isHighTrafficCalculator(calculatorId)) {
      data.searchQueries.slice(0, 3).forEach(query => {
        const encodedQuery = encodeURIComponent(query.replace(/\s+/g, '-').toLowerCase())
        sitemap += `
  <url>
    <loc>${baseURL}/${mainMenu}?in=${calculatorId}&q=${encodedQuery}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${priority - 0.1}</priority>
  </url>`
      })
    }
  })

  sitemap += `
  
  <!-- Category Pages -->
  <url>
    <loc>${baseURL}/loan-calculators</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <url>
    <loc>${baseURL}/investment-calculators</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <url>
    <loc>${baseURL}/tax-calculators</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <url>
    <loc>${baseURL}/retirement-calculators</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  
</urlset>`

  return sitemap
}

const getPriorityByCalculator = (calculatorId) => {
  const highPriorityCalculators = ['emi', 'sip', 'income-tax', 'fd', 'ppf', 'net-worth', 'discount', 'fuel-cost']
  const mediumPriorityCalculators = ['mortgage', 'personal-loan', 'cagr', 'swp', 'nps']

  if (highPriorityCalculators.includes(calculatorId)) return '0.9'
  if (mediumPriorityCalculators.includes(calculatorId)) return '0.8'
  return '0.7'
}

const getChangeFreqByCalculator = (calculatorId) => {
  const frequentlyUpdated = ['income-tax', 'capital-gains', 'nps', 'epf']
  
  if (frequentlyUpdated.includes(calculatorId)) return 'weekly'
  return 'monthly'
}

const isHighTrafficCalculator = (calculatorId) => {
  const highTrafficCalculators = ['emi', 'sip', 'income-tax', 'fd', 'ppf', 'mortgage', 'net-worth', 'discount', 'fuel-cost']
  return highTrafficCalculators.includes(calculatorId)
}

// Generate robots.txt content
export const generateRobotsTxt = () => {
  const baseURL = 'https://finclamp.com'
  
  return `User-agent: *
Allow: /

# Sitemap
Sitemap: ${baseURL}/sitemap.xml

# Allow all calculator pages
Allow: /?calculator=*

# Allow category pages
Allow: /loan-calculators
Allow: /investment-calculators
Allow: /tax-calculators
Allow: /retirement-calculators

# Disallow admin or private pages (if any)
Disallow: /admin/
Disallow: /private/

# Crawl-delay for respectful crawling
Crawl-delay: 1`
}

// Generate meta tags for specific calculator
export const generateCalculatorMetaTags = (calculatorId) => {
  const data = calculatorDescriptions[calculatorId]
  if (!data) return {}

  return {
    title: data.title,
    description: data.description,
    keywords: data.seoKeywords || '',
    canonical: `https://finclamp.com?calculator=${calculatorId}`,
    ogTitle: data.title,
    ogDescription: data.description,
    ogImage: `https://finclamp.com/og-calculator-${calculatorId}.jpg`,
    twitterTitle: data.title,
    twitterDescription: data.description,
    twitterImage: `https://finclamp.com/twitter-calculator-${calculatorId}.jpg`
  }
}

// Generate structured data for calculator
export const generateCalculatorStructuredData = (calculatorId) => {
  const data = calculatorDescriptions[calculatorId]
  if (!data) return null

  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": data.title,
    "description": data.description,
    "url": `https://finclamp.com?calculator=${calculatorId}`,
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "1250"
    },
    "keywords": data.seoKeywords,
    "mainEntity": {
      "@type": "Calculator",
      "name": data.title,
      "description": data.description
    }
  }
}
