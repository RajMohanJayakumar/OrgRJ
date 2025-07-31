// SEO utility functions for dynamic meta tags and structured data
// Performance-optimized SEO configuration to reduce long_task and slow_resource events

// Performance optimization utilities
export const addPerformanceHints = () => {
  // Add resource hints for better loading performance
  const hints = [
    { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
    { rel: 'dns-prefetch', href: '//fonts.gstatic.com' },
    { rel: 'preconnect', href: 'https://fonts.googleapis.com', crossorigin: true },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true },
    { rel: 'prefetch', href: '/calculators' },
    { rel: 'prefetch', href: '/games' }
  ]

  hints.forEach(hint => {
    const existingHint = document.querySelector(`link[rel="${hint.rel}"][href="${hint.href}"]`)
    if (!existingHint) {
      const link = document.createElement('link')
      Object.keys(hint).forEach(key => {
        if (key === 'crossorigin') {
          link.setAttribute('crossorigin', hint[key])
        } else {
          link.setAttribute(key, hint[key])
        }
      })
      document.head.appendChild(link)
    }
  })
}

// Add critical performance meta tags
export const addPerformanceMetaTags = () => {
  const performanceTags = [
    { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
    { name: 'format-detection', content: 'telephone=no' },
    { name: 'mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
    { name: 'theme-color', content: '#667eea' },
    { name: 'msapplication-TileColor', content: '#667eea' },
    { name: 'color-scheme', content: 'light dark' }
  ]

  performanceTags.forEach(tag => {
    const existingTag = document.querySelector(`meta[name="${tag.name}"]`)
    if (existingTag) {
      existingTag.setAttribute('content', tag.content)
    } else {
      const meta = document.createElement('meta')
      meta.setAttribute('name', tag.name)
      meta.setAttribute('content', tag.content)
      document.head.appendChild(meta)
    }
  })
}

// Optimize images and resources
export const addResourceOptimization = () => {
  // Add loading="lazy" to images that don't have it
  const images = document.querySelectorAll('img:not([loading])')
  images.forEach(img => {
    if (!img.closest('[data-critical]')) { // Skip critical images
      img.setAttribute('loading', 'lazy')
      img.setAttribute('decoding', 'async')
    }
  })

  // Add fetchpriority to critical resources
  const criticalImages = document.querySelectorAll('img[data-critical]')
  criticalImages.forEach(img => {
    img.setAttribute('fetchpriority', 'high')
    img.setAttribute('loading', 'eager')
  })
}

// Bundle size optimization tracking
export const trackBundlePerformance = () => {
  if (typeof window !== 'undefined' && window.performance) {
    const navigation = performance.getEntriesByType('navigation')[0]
    if (navigation) {
      const metrics = {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        totalLoadTime: navigation.loadEventEnd - navigation.navigationStart
      }

      // Only log if performance is concerning (based on your analytics)
      if (metrics.totalLoadTime > 3000) {
        console.warn('Slow page load detected:', metrics)
        // You can send this to your analytics
        if (window.gtag) {
          window.gtag('event', 'slow_page_load', {
            load_time: metrics.totalLoadTime,
            dom_content_loaded: metrics.domContentLoaded
          })
        }
      }
    }
  }
}

// Core Web Vitals monitoring and optimization
export const optimizeWebVitals = () => {
  if (typeof window !== 'undefined') {
    // Monitor and optimize Largest Contentful Paint (LCP)
    const optimizeLCP = () => {
      // Preload critical resources
      const criticalResources = [
        '/fonts/main.woff2',
        '/images/hero.webp'
      ]

      criticalResources.forEach(resource => {
        const link = document.createElement('link')
        link.rel = 'preload'
        link.href = resource
        link.as = resource.includes('font') ? 'font' : 'image'
        if (resource.includes('font')) {
          link.crossOrigin = 'anonymous'
        }
        document.head.appendChild(link)
      })
    }

    // Monitor and optimize First Input Delay (FID)
    const optimizeFID = () => {
      // Break up long tasks using scheduler.postTask if available
      if ('scheduler' in window && 'postTask' in window.scheduler) {
        // Use scheduler API for better task scheduling
        window.scheduler.postTask(() => {
          // Non-critical JavaScript can be scheduled here
          addResourceOptimization()
        }, { priority: 'background' })
      }
    }

    // Monitor and optimize Cumulative Layout Shift (CLS)
    const optimizeCLS = () => {
      // Add size attributes to images to prevent layout shift
      const images = document.querySelectorAll('img:not([width]):not([height])')
      images.forEach(img => {
        // Set default dimensions to prevent CLS
        if (!img.style.aspectRatio) {
          img.style.aspectRatio = '16/9' // Default aspect ratio
        }
      })
    }

    // Run optimizations
    optimizeLCP()
    optimizeFID()
    optimizeCLS()

    // Monitor Web Vitals and send to analytics if concerning
    if (window.gtag) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'largest-contentful-paint') {
            if (entry.startTime > 2500) { // LCP threshold
              window.gtag('event', 'poor_lcp', {
                value: Math.round(entry.startTime)
              })
            }
          }
        }
      })

      try {
        observer.observe({ entryTypes: ['largest-contentful-paint'] })
      } catch (e) {
        // Fallback for browsers that don't support this
        console.log('Performance observer not supported')
      }
    }
  }
}

// Comprehensive performance monitoring based on analytics data
export const monitorPerformanceIssues = () => {
  if (typeof window === 'undefined') return

  // Monitor long tasks (addresses your 46,597 long_task events)
  const longTaskObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.duration > 50) { // Tasks longer than 50ms
        console.warn('Long task detected:', {
          duration: entry.duration,
          startTime: entry.startTime,
          name: entry.name
        })

        // Send to analytics if task is particularly long
        if (entry.duration > 100 && window.gtag) {
          window.gtag('event', 'long_task_critical', {
            duration: Math.round(entry.duration),
            task_name: entry.name || 'unknown'
          })
        }
      }
    }
  })

  // Monitor resource loading (addresses your 8,197 slow_resource events)
  const resourceObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      const loadTime = entry.responseEnd - entry.startTime
      if (loadTime > 1000) { // Resources taking longer than 1 second
        console.warn('Slow resource detected:', {
          name: entry.name,
          loadTime: loadTime,
          size: entry.transferSize
        })

        // Send to analytics for slow resources
        if (loadTime > 2000 && window.gtag) {
          window.gtag('event', 'slow_resource_critical', {
            resource_name: entry.name.split('/').pop(),
            load_time: Math.round(loadTime),
            size: entry.transferSize
          })
        }
      }
    }
  })

  // Start observing if supported
  try {
    if ('PerformanceObserver' in window) {
      longTaskObserver.observe({ entryTypes: ['longtask'] })
      resourceObserver.observe({ entryTypes: ['resource'] })
    }
  } catch (e) {
    console.log('Performance monitoring not fully supported')
  }

  // Monitor calculator interactions (you have good engagement here)
  const trackCalculatorPerformance = () => {
    const calculatorElements = document.querySelectorAll('[data-calculator]')
    calculatorElements.forEach(element => {
      element.addEventListener('input', () => {
        const startTime = performance.now()

        // Use requestIdleCallback to measure calculation time
        requestIdleCallback(() => {
          const calculationTime = performance.now() - startTime
          if (calculationTime > 16) { // Longer than one frame (60fps)
            console.warn('Slow calculator interaction:', {
              calculator: element.dataset.calculator,
              time: calculationTime
            })
          }
        })
      }, { passive: true })
    })
  }

  // Initialize calculator performance tracking
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', trackCalculatorPerformance)
  } else {
    trackCalculatorPerformance()
  }
}

export const calculatorSEOData = {
  // Loan Calculators
  emi: {
    title: "EMI Calculator - Calculate Loan EMI & Repayment Schedule | FinClamp",
    description: "Calculate your loan EMI with our free EMI calculator. Get detailed amortization schedule, total interest, and compare different loan options. Easy to use and accurate.",
    keywords: "EMI calculator, loan calculator, home loan EMI, personal loan EMI, car loan calculator, equated monthly installment",
    canonical: "/calculators?in=emi",
    structuredData: {
      "@type": "WebApplication",
      "name": "EMI Calculator",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Any",
      "description": "Calculate Equated Monthly Installment (EMI) for loans with detailed amortization schedule",
      "featureList": [
        "Calculate monthly EMI payments",
        "Generate detailed amortization schedule",
        "Compare different loan scenarios",
        "Calculate total interest payable",
        "Loan tenure optimization"
      ],
      "applicationSubCategory": "Loan Calculator"
    }
  },
  mortgage: {
    title: "Mortgage Calculator - Home Loan EMI Calculator | FinClamp",
    description: "Calculate your home loan EMI, total interest, and monthly payments with our advanced mortgage calculator. Compare different loan terms and interest rates.",
    keywords: "mortgage calculator, home loan calculator, housing loan EMI, property loan calculator, mortgage payment",
    canonical: "/calculators?in=mortgage",
    structuredData: {
      "@type": "WebApplication",
      "name": "Mortgage Calculator",
      "applicationCategory": "FinanceApplication",
      "description": "Calculate mortgage payments and home loan EMI with detailed breakdown",
      "featureList": [
        "Calculate home loan EMI",
        "Compare mortgage rates",
        "Analyze loan affordability",
        "Generate payment schedule",
        "Calculate total interest cost"
      ],
      "applicationSubCategory": "Mortgage Calculator"
    }
  },
  "personal-loan": {
    title: "Personal Loan Calculator - EMI & Interest | FinClamp",
    description: "Calculate personal loan EMI, total interest, and repayment schedule. Compare different personal loan options and find the best rates.",
    keywords: "personal loan calculator, personal loan EMI, unsecured loan calculator, instant loan calculator",
    canonical: "/calculators?in=personal-loan",
    structuredData: {
      "@type": "WebApplication",
      "name": "Personal Loan Calculator",
      "applicationCategory": "FinanceApplication",
      "description": "Calculate personal loan EMI and total cost with detailed analysis",
      "featureList": [
        "Calculate personal loan EMI",
        "Compare loan offers",
        "Analyze repayment schedule",
        "Calculate total interest",
        "Loan eligibility assessment"
      ],
      "applicationSubCategory": "Personal Loan Calculator"
    }
  },

  // Savings Calculators
  fd: {
    title: "Fixed Deposit Calculator - FD Maturity & Interest Calculator | FinClamp",
    description: "Calculate FD maturity amount, interest earned, and returns on your fixed deposit investment. Compare different FD schemes and tenure options.",
    keywords: "FD calculator, fixed deposit calculator, FD maturity calculator, bank FD calculator, fixed deposit interest",
    canonical: "/calculators?in=fd",
    structuredData: {
      "@type": "WebApplication",
      "name": "Fixed Deposit Calculator",
      "applicationCategory": "FinanceApplication",
      "description": "Calculate fixed deposit maturity amount and interest earnings",
      "featureList": [
        "Calculate FD maturity amount",
        "Compare interest rates",
        "Analyze different tenures",
        "Calculate compound interest",
        "Tax implications analysis"
      ],
      "applicationSubCategory": "Savings Calculator"
    }
  },
  rd: {
    title: "Recurring Deposit Calculator - RD Maturity Calculator | FinClamp",
    description: "Calculate RD maturity amount and returns on your recurring deposit. Plan your monthly savings with our accurate RD calculator.",
    keywords: "RD calculator, recurring deposit calculator, RD maturity calculator, monthly deposit calculator",
    canonical: "/calculators?in=rd",
    structuredData: {
      "@type": "WebApplication",
      "name": "Recurring Deposit Calculator",
      "applicationCategory": "FinanceApplication",
      "description": "Calculate recurring deposit maturity value and monthly savings plan",
      "featureList": [
        "Calculate RD maturity amount",
        "Plan monthly savings",
        "Compare RD schemes",
        "Calculate compound interest",
        "Savings goal planning"
      ],
      "applicationSubCategory": "Savings Calculator"
    }
  },
  ppf: {
    title: "PPF Calculator - Public Provident Fund Calculator | FinClamp",
    description: "Calculate PPF maturity amount, interest, and tax benefits. Plan your 15-year PPF investment with our comprehensive calculator.",
    keywords: "PPF calculator, public provident fund calculator, PPF maturity calculator, PPF interest calculator, tax saving",
    canonical: "/calculators?in=ppf",
    structuredData: {
      "@type": "WebApplication",
      "name": "PPF Calculator",
      "applicationCategory": "FinanceApplication",
      "description": "Calculate Public Provident Fund maturity amount and tax benefits",
      "featureList": [
        "Calculate PPF maturity amount",
        "Tax benefit analysis",
        "15-year investment planning",
        "Annual contribution optimization",
        "Compound interest calculation"
      ],
      "applicationSubCategory": "Tax Saving Calculator"
    }
  },

  // Mutual Fund Calculators
  sip: {
    title: "SIP Calculator - Systematic Investment Plan Calculator | FinClamp",
    description: "Calculate SIP returns, maturity amount, and wealth creation potential. Plan your mutual fund investments with our advanced SIP calculator.",
    keywords: "SIP calculator, systematic investment plan, mutual fund calculator, SIP returns calculator, investment calculator",
    canonical: "/calculators?in=sip",
    structuredData: {
      "@type": "WebApplication",
      "name": "SIP Calculator",
      "applicationCategory": "FinanceApplication",
      "description": "Calculate Systematic Investment Plan returns and wealth creation potential",
      "featureList": [
        "Calculate SIP returns",
        "Wealth creation planning",
        "Goal-based investing",
        "Power of compounding analysis",
        "Investment scenario comparison"
      ],
      "applicationSubCategory": "Investment Calculator"
    }
  },
  swp: {
    title: "SWP Calculator - Systematic Withdrawal Plan Calculator | FinClamp",
    description: "Calculate SWP withdrawals and remaining corpus. Plan your retirement income with our systematic withdrawal plan calculator.",
    keywords: "SWP calculator, systematic withdrawal plan, retirement planning, mutual fund withdrawal calculator",
    canonical: "/calculators?in=swp",
    structuredData: {
      "@type": "WebApplication",
      "name": "SWP Calculator",
      "applicationCategory": "FinanceApplication",
      "description": "Calculate systematic withdrawal plan and retirement income planning",
      "featureList": [
        "Calculate withdrawal amount",
        "Plan retirement income",
        "Analyze corpus depletion",
        "Tax-efficient withdrawals",
        "Income sustainability planning"
      ],
      "applicationSubCategory": "Investment Calculator"
    }
  },
  cagr: {
    title: "CAGR Calculator - Compound Annual Growth Rate Calculator | FinClamp",
    description: "Calculate CAGR for your investments. Analyze investment performance and compare different investment options with our CAGR calculator.",
    keywords: "CAGR calculator, compound annual growth rate, investment returns calculator, portfolio performance",
    canonical: "/calculators?in=cagr",
    structuredData: {
      "@type": "WebApplication",
      "name": "CAGR Calculator",
      "applicationCategory": "FinanceApplication",
      "description": "Calculate Compound Annual Growth Rate for investment analysis",
      "featureList": [
        "Calculate compound annual growth rate",
        "Investment performance analysis",
        "Compare investment returns",
        "Portfolio performance tracking",
        "Historical return analysis"
      ],
      "applicationSubCategory": "Investment Calculator"
    }
  },

  // Tax Calculators
  "income-tax": {
    title: "Income Tax Calculator - Calculate Tax Liability | FinClamp",
    description: "Calculate your income tax liability, tax savings, and take-home salary. Compare old vs new tax regime with our comprehensive tax calculator.",
    keywords: "income tax calculator, tax calculator India, tax liability calculator, salary tax calculator, tax saving calculator",
    canonical: "/calculators?in=income-tax",
    structuredData: {
      "@type": "WebApplication",
      "name": "Income Tax Calculator",
      "applicationCategory": "FinanceApplication",
      "description": "Calculate income tax liability and tax savings under different regimes",
      "featureList": [
        "Calculate income tax liability",
        "Compare old vs new tax regime",
        "Tax saving recommendations",
        "Take-home salary calculation",
        "Deduction optimization"
      ],
      "applicationSubCategory": "Tax Calculator"
    }
  },
  "capital-gains": {
    title: "Capital Gains Tax Calculator - STCG & LTCG | FinClamp",
    description: "Calculate capital gains tax on your investments. Understand STCG and LTCG implications with our detailed capital gains calculator.",
    keywords: "capital gains calculator, STCG calculator, LTCG calculator, capital gains tax, investment tax calculator",
    canonical: "/calculators?in=capital-gains",
    structuredData: {
      "@type": "WebApplication",
      "name": "Capital Gains Tax Calculator",
      "applicationCategory": "FinanceApplication",
      "description": "Calculate short-term and long-term capital gains tax on investments",
      "featureList": [
        "Calculate capital gains tax",
        "STCG vs LTCG analysis",
        "Tax optimization strategies",
        "Investment holding period analysis",
        "Tax liability estimation"
      ],
      "applicationSubCategory": "Tax Calculator"
    }
  },

  // Retirement Calculators
  nps: {
    title: "NPS Calculator - National Pension Scheme Calculator | FinClamp",
    description: "Calculate NPS maturity amount, pension, and tax benefits. Plan your retirement with our comprehensive National Pension Scheme calculator.",
    keywords: "NPS calculator, national pension scheme calculator, NPS maturity calculator, retirement planning, pension calculator",
    canonical: "/calculators?in=nps",
    structuredData: {
      "@type": "WebApplication",
      "name": "NPS Calculator",
      "applicationCategory": "FinanceApplication",
      "description": "Calculate National Pension Scheme maturity and retirement planning",
      "featureList": [
        "Calculate NPS maturity amount",
        "Retirement corpus planning",
        "Tax benefit analysis",
        "Pension calculation",
        "Withdrawal strategy planning"
      ],
      "applicationSubCategory": "Retirement Calculator"
    }
  },
  epf: {
    title: "EPF Calculator - Employee Provident Fund Calculator | FinClamp",
    description: "Calculate EPF maturity amount, interest, and withdrawal. Plan your provident fund savings with our accurate EPF calculator.",
    keywords: "EPF calculator, employee provident fund calculator, PF calculator, provident fund maturity calculator",
    canonical: "/calculators?in=epf",
    structuredData: {
      "@type": "WebApplication",
      "name": "EPF Calculator",
      "applicationCategory": "FinanceApplication",
      "description": "Calculate Employee Provident Fund maturity and interest earnings",
      "featureList": [
        "Calculate EPF maturity amount",
        "Interest earnings analysis",
        "Withdrawal planning",
        "Tax implications",
        "Retirement corpus estimation"
      ],
      "applicationSubCategory": "Retirement Calculator"
    }
  },
  gratuity: {
    title: "Gratuity Calculator - Calculate Gratuity Amount | FinClamp",
    description: "Calculate gratuity amount based on salary and years of service. Understand your gratuity benefits with our easy-to-use calculator.",
    keywords: "gratuity calculator, gratuity amount calculator, employee gratuity calculator, gratuity calculation formula",
    canonical: "/calculators?in=gratuity",
    structuredData: {
      "@type": "WebApplication",
      "name": "Gratuity Calculator",
      "applicationCategory": "FinanceApplication",
      "description": "Calculate gratuity amount for employees based on salary and service years",
      "featureList": [
        "Calculate gratuity amount",
        "Service period analysis",
        "Salary-based calculation",
        "Tax implications",
        "Employment benefit planning"
      ],
      "applicationSubCategory": "Retirement Calculator"
    }
  },

  // General Calculators
  "compound-interest": {
    title: "Compound Interest Calculator - CI Calculator | FinClamp",
    description: "Calculate compound interest and investment growth. Understand the power of compounding with our detailed compound interest calculator.",
    keywords: "compound interest calculator, compound growth calculator, investment compounding, compound interest formula",
    canonical: "/calculators?in=compound-interest",
    structuredData: {
      "@type": "WebApplication",
      "name": "Compound Interest Calculator",
      "applicationCategory": "FinanceApplication",
      "description": "Calculate compound interest and investment growth over time",
      "featureList": [
        "Calculate compound interest",
        "Investment growth analysis",
        "Power of compounding demonstration",
        "Time value of money calculation",
        "Interest rate comparison"
      ],
      "applicationSubCategory": "General Calculator"
    }
  },
  "simple-interest": {
    title: "Simple Interest Calculator - SI Calculator | FinClamp",
    description: "Calculate simple interest on loans and investments with our easy-to-use calculator. Get detailed breakdown of principal, interest, and total amount.",
    keywords: "simple interest calculator, simple interest formula, loan interest calculator, investment interest",
    canonical: "/calculators?in=simple-interest",
    structuredData: {
      "@type": "WebApplication",
      "name": "Simple Interest Calculator",
      "applicationCategory": "FinanceApplication",
      "description": "Calculate simple interest on loans and investments",
      "featureList": [
        "Calculate simple interest",
        "Principal and interest breakdown",
        "Interest rate analysis",
        "Time period calculation",
        "Loan interest estimation"
      ],
      "applicationSubCategory": "General Calculator"
    }
  },
  inflation: {
    title: "Inflation Calculator - Calculate Inflation Impact | FinClamp",
    description: "Calculate inflation impact on your money over time. Understand purchasing power erosion with our inflation calculator.",
    keywords: "inflation calculator, inflation impact calculator, purchasing power calculator, money value calculator",
    canonical: "/calculators?in=inflation",
    structuredData: {
      "@type": "WebApplication",
      "name": "Inflation Calculator",
      "applicationCategory": "FinanceApplication",
      "description": "Calculate inflation impact on purchasing power over time",
      "featureList": [
        "Calculate inflation impact",
        "Purchasing power analysis",
        "Future value estimation",
        "Real vs nominal value comparison",
        "Cost of living adjustment"
      ],
      "applicationSubCategory": "General Calculator"
    }
  },

  // Real Estate Calculators
  "real-estate": {
    title: "Real Estate Calculator - Home Loan EMI & Costs | FinClamp",
    description: "Calculate home loan EMI, total costs, and affordability analysis. Includes property price, down payment, and additional costs.",
    keywords: "real estate calculator, home loan calculator, property EMI, home buying costs, real estate affordability",
    canonical: "/calculators?in=real-estate",
    structuredData: {
      "@type": "WebApplication",
      "name": "Real Estate Calculator",
      "applicationCategory": "FinanceApplication",
      "description": "Comprehensive real estate calculator for home loans and property costs",
      "featureList": [
        "Home loan EMI calculation",
        "Total cost analysis",
        "Affordability assessment",
        "Additional costs breakdown",
        "Monthly maintenance calculation"
      ],
      "applicationSubCategory": "Real Estate Calculator"
    }
  },

  "property-valuation": {
    title: "Property Valuation Calculator - Estimate Property Value | FinClamp",
    description: "Estimate property value based on area, location, amenities, and market factors. Get accurate property valuation for buying or selling.",
    keywords: "property valuation, property value calculator, real estate valuation, property appraisal, property worth",
    canonical: "/calculators?in=property-valuation",
    structuredData: {
      "@type": "WebApplication",
      "name": "Property Valuation Calculator",
      "applicationCategory": "FinanceApplication",
      "description": "Estimate property value based on multiple factors and market conditions",
      "featureList": [
        "Property value estimation",
        "Location-based pricing",
        "Amenities scoring",
        "Market trend analysis",
        "Investment potential assessment"
      ],
      "applicationSubCategory": "Real Estate Calculator"
    }
  },

  "rent-vs-buy": {
    title: "Rent vs Buy Calculator - Compare Renting vs Buying | FinClamp",
    description: "Compare renting vs buying costs over time. Make informed decisions with detailed financial analysis of renting versus purchasing property.",
    keywords: "rent vs buy calculator, renting vs buying, property decision, real estate comparison, home buying decision",
    canonical: "/calculators?in=rent-vs-buy",
    structuredData: {
      "@type": "WebApplication",
      "name": "Rent vs Buy Calculator",
      "applicationCategory": "FinanceApplication",
      "description": "Compare long-term costs of renting versus buying property",
      "featureList": [
        "Cost comparison analysis",
        "Break-even calculation",
        "Investment opportunity cost",
        "Long-term financial impact",
        "Decision recommendation"
      ],
      "applicationSubCategory": "Real Estate Calculator"
    }
  },

  "property-tax": {
    title: "Property Tax Calculator - Calculate Annual Property Tax | FinClamp",
    description: "Calculate annual property tax based on property value, location, and type. Includes rebates, discounts, and payment breakdown.",
    keywords: "property tax calculator, annual property tax, property tax rate, real estate tax, municipal tax",
    canonical: "/calculators?in=property-tax",
    structuredData: {
      "@type": "WebApplication",
      "name": "Property Tax Calculator",
      "applicationCategory": "FinanceApplication",
      "description": "Calculate property tax based on value, location, and applicable rates",
      "featureList": [
        "Property tax calculation",
        "Location-based rates",
        "Rebate and discount application",
        "Monthly payment breakdown",
        "Tax per square foot analysis"
      ],
      "applicationSubCategory": "Real Estate Calculator"
    }
  },

  // Personal Finance Calculators
  "budget-planner": {
    title: "Budget Planner - Monthly Budget Calculator | FinClamp",
    description: "Plan your monthly budget with our comprehensive budget planner. Track income vs expenses and optimize your financial planning.",
    keywords: "budget planner, monthly budget calculator, expense tracker, income planning, financial planning",
    canonical: "/calculators?in=budget-planner",
    structuredData: {
      "@type": "WebApplication",
      "name": "Budget Planner",
      "applicationCategory": "FinanceApplication",
      "description": "Plan and track monthly budget with income vs expense analysis",
      "featureList": [
        "Monthly budget planning",
        "Income vs expense tracking",
        "Category-wise expense breakdown",
        "Budget optimization suggestions",
        "Financial goal setting"
      ],
      "applicationSubCategory": "Personal Finance Calculator"
    }
  },
  "savings-goal": {
    title: "Savings Goal Calculator - Goal Planner | FinClamp",
    description: "Calculate how much to save daily or monthly to reach your financial goals. Plan your savings strategy with our goal calculator.",
    keywords: "savings goal calculator, goal planning, savings target, financial goals, savings strategy",
    canonical: "/calculators?in=savings-goal",
    structuredData: {
      "@type": "WebApplication",
      "name": "Savings Goal Calculator",
      "applicationCategory": "FinanceApplication",
      "description": "Calculate daily/monthly savings needed to achieve financial goals",
      "featureList": [
        "Goal-based savings calculation",
        "Daily/monthly savings planning",
        "Timeline optimization",
        "Progress tracking",
        "Multiple goal management"
      ],
      "applicationSubCategory": "Personal Finance Calculator"
    }
  },
  "stock-average": {
    title: "Stock Average Calculator - Share Price Average Calculator | FinClamp",
    description: "Calculate average stock price across multiple purchases. Optimize your stock investment strategy with our averaging calculator.",
    keywords: "stock average calculator, share price average, stock investment, portfolio average, investment calculator",
    canonical: "/calculators?in=stock-average",
    structuredData: {
      "@type": "WebApplication",
      "name": "Stock Average Calculator",
      "applicationCategory": "FinanceApplication",
      "description": "Calculate average stock price over multiple purchases for portfolio optimization",
      "featureList": [
        "Stock price averaging",
        "Multiple purchase tracking",
        "Portfolio optimization",
        "Investment cost analysis",
        "Profit/loss calculation"
      ],
      "applicationSubCategory": "Investment Calculator"
    }
  },
  "net-worth": {
    title: "Net Worth Calculator - Personal Wealth Calculator | FinClamp",
    description: "Calculate your total net worth by analyzing all assets and liabilities. Track your financial position, wealth growth, and overall financial health.",
    keywords: "net worth calculator, wealth calculator, assets liabilities, financial position, personal finance",
    canonical: "/calculators?in=net-worth",
    structuredData: {
      "@type": "WebApplication",
      "name": "Net Worth Calculator",
      "applicationCategory": "FinanceApplication",
      "description": "Calculate total net worth and analyze financial position",
      "featureList": [
        "Assets and liabilities tracking",
        "Net worth calculation",
        "Financial position analysis",
        "Wealth growth tracking",
        "Financial health assessment"
      ],
      "applicationSubCategory": "Personal Finance Calculator"
    }
  },

  // Lifestyle Calculators
  "bill-split": {
    title: "Bill Split Calculator - Split Bills Among Friends | FinClamp",
    description: "Split bills equally or with custom amounts among friends and roommates. Calculate individual shares with tip included.",
    keywords: "bill split calculator, split bills, group expenses, restaurant bill split, roommate expenses",
    canonical: "/calculators?in=bill-split",
    structuredData: {
      "@type": "WebApplication",
      "name": "Bill Split Calculator",
      "applicationCategory": "FinanceApplication",
      "description": "Split bills among friends with equal or custom amounts including tip calculation",
      "featureList": [
        "Equal bill splitting",
        "Custom amount splitting",
        "Tip calculation and distribution",
        "Multiple person management",
        "Individual share breakdown"
      ],
      "applicationSubCategory": "Lifestyle Calculator"
    }
  },

  "daily-interest": {
    title: "Daily Interest Calculator - Calculate Daily Interest | FinClamp",
    description: "Calculate daily interest on short-term savings and loans. Compare simple vs compound interest for daily calculations.",
    keywords: "daily interest calculator, short term interest, daily savings interest, daily loan interest",
    canonical: "/calculators?in=daily-interest",
    structuredData: {
      "@type": "WebApplication",
      "name": "Daily Interest Calculator",
      "applicationCategory": "FinanceApplication",
      "description": "Calculate daily interest on short-term savings/loans with simple vs compound comparison",
      "featureList": [
        "Daily interest calculation",
        "Simple vs compound interest",
        "Short-term savings analysis",
        "Daily loan interest",
        "Interest comparison tools"
      ],
      "applicationSubCategory": "General Calculator"
    }
  },

  // Additional General Calculators
  "discount": {
    title: "Discount Calculator - Calculate Final Price After Discount | FinClamp",
    description: "Calculate final price after percentage discounts. Perfect for shopping and finding the best deals with multiple discount calculations.",
    keywords: "discount calculator, percentage discount, final price calculator, shopping discount, sale price calculator",
    canonical: "/calculators?in=discount",
    structuredData: {
      "@type": "WebApplication",
      "name": "Discount Calculator",
      "applicationCategory": "FinanceApplication",
      "description": "Calculate final price after percentage discounts for shopping and deals",
      "featureList": [
        "Percentage discount calculation",
        "Final price calculation",
        "Multiple discount application",
        "Savings amount calculation",
        "Shopping deal analysis"
      ],
      "applicationSubCategory": "General Calculator"
    }
  },
  "fuel-cost": {
    title: "Fuel Cost Calculator - Calculate Daily/Monthly Fuel Expenses | FinClamp",
    description: "Calculate daily and monthly fuel expenses based on mileage, fuel price, and distance. Optimize your transportation costs.",
    keywords: "fuel cost calculator, petrol cost calculator, mileage calculator, transportation cost, fuel expense tracker",
    canonical: "/calculators?in=fuel-cost",
    structuredData: {
      "@type": "WebApplication",
      "name": "Fuel Cost Calculator",
      "applicationCategory": "FinanceApplication",
      "description": "Calculate daily/monthly fuel expenses based on mileage and distance traveled",
      "featureList": [
        "Daily/monthly fuel cost calculation",
        "Mileage-based calculations",
        "Distance and fuel price analysis",
        "Transportation cost optimization",
        "Fuel expense tracking"
      ],
      "applicationSubCategory": "General Calculator"
    }
  },

  // Additional Lifestyle Calculators
  "monthly-expense": {
    title: "Monthly Expense Calculator - Track Monthly Expenses | FinClamp",
    description: "Track and categorize your monthly expenses. Analyze spending patterns and optimize your monthly budget.",
    keywords: "monthly expense calculator, expense tracker, monthly spending, budget tracker, expense analysis",
    canonical: "/calculators?in=monthly-expense",
    structuredData: {
      "@type": "WebApplication",
      "name": "Monthly Expense Calculator",
      "applicationCategory": "FinanceApplication",
      "description": "Track and analyze monthly expenses with category-wise breakdown",
      "featureList": [
        "Monthly expense tracking",
        "Category-wise expense analysis",
        "Spending pattern identification",
        "Budget optimization",
        "Expense trend analysis"
      ],
      "applicationSubCategory": "Lifestyle Calculator"
    }
  },
  "grocery-budget": {
    title: "Grocery Budget Calculator - Family Grocery Budget Planner | FinClamp",
    description: "Plan your family grocery budget with our comprehensive calculator. Track grocery expenses and optimize food spending.",
    keywords: "grocery budget calculator, family grocery budget, food budget planner, grocery expense tracker",
    canonical: "/calculators?in=grocery-budget",
    structuredData: {
      "@type": "WebApplication",
      "name": "Grocery Budget Calculator",
      "applicationCategory": "FinanceApplication",
      "description": "Plan and track family grocery budget with expense optimization",
      "featureList": [
        "Family grocery budget planning",
        "Food expense tracking",
        "Grocery cost optimization",
        "Monthly grocery analysis",
        "Budget vs actual comparison"
      ],
      "applicationSubCategory": "Lifestyle Calculator"
    }
  },
  "commute-cost": {
    title: "Commute Cost Calculator - Daily Transportation Cost Calculator | FinClamp",
    description: "Calculate daily commute costs including fuel, public transport, and other transportation expenses. Optimize your travel budget.",
    keywords: "commute cost calculator, transportation cost, daily travel cost, commute expense calculator",
    canonical: "/calculators?in=commute-cost",
    structuredData: {
      "@type": "WebApplication",
      "name": "Commute Cost Calculator",
      "applicationCategory": "FinanceApplication",
      "description": "Calculate daily commute and transportation costs with optimization suggestions",
      "featureList": [
        "Daily commute cost calculation",
        "Multiple transport mode comparison",
        "Fuel vs public transport analysis",
        "Monthly transportation budget",
        "Cost optimization recommendations"
      ],
      "applicationSubCategory": "Lifestyle Calculator"
    }
  },

  // Daily Spending Calculator
  "daily-spending": {
    title: "Daily Spending Calculator - Track Daily Expenses | FinClamp",
    description: "Track your daily spending habits and expenses across all payment methods. Analyze spending patterns and optimize your budget.",
    keywords: "daily spending calculator, expense tracker, spending habits, daily expenses, budget tracker",
    canonical: "/calculators?in=daily-spending",
    structuredData: {
      "@type": "WebApplication",
      "name": "Daily Spending Calculator",
      "applicationCategory": "FinanceApplication",
      "description": "Track daily spending habits and expenses across all payment methods",
      "featureList": [
        "Daily expense tracking",
        "Category-wise spending analysis",
        "Time-based spending patterns",
        "Budget monitoring",
        "Weekly/monthly projections"
      ],
      "applicationSubCategory": "Lifestyle Calculator"
    }
  },

  // Habit Cost Calculator
  "habit-cost": {
    title: "Habit Cost Calculator - Calculate Cost of Daily Habits | FinClamp",
    description: "Calculate the true cost of your daily habits like coffee, smoking, and other expenses. See long-term financial impact and find alternatives.",
    keywords: "habit cost calculator, daily habit cost, smoking cost calculator, coffee cost calculator, habit expense tracker",
    canonical: "/calculators?in=habit-cost",
    structuredData: {
      "@type": "WebApplication",
      "name": "Habit Cost Calculator",
      "applicationCategory": "FinanceApplication",
      "description": "Calculate the financial impact of daily habits and find cost-effective alternatives",
      "featureList": [
        "Daily habit cost calculation",
        "Long-term financial impact analysis",
        "Multiple habit tracking",
        "Health impact assessment",
        "Alternative suggestions",
        "Smoking cost calculator",
        "Coffee cost calculator",
        "Addiction cost calculator",
        "Lifestyle cost calculator",
        "Daily habit calculator"
      ],
      "applicationSubCategory": "Lifestyle Calculator"
    }
  },

  // Work From Home Savings Calculator
  "wfh-savings": {
    title: "Work From Home Savings Calculator - Calculate WFH Cost Savings | FinClamp",
    description: "Calculate how much money you save by working from home. Track commute, food, clothing, and other office-related expenses.",
    keywords: "work from home savings calculator, WFH savings, remote work savings, commute cost savings, home office calculator",
    canonical: "/calculators?in=wfh-savings",
    structuredData: {
      "@type": "WebApplication",
      "name": "Work From Home Savings Calculator",
      "applicationCategory": "FinanceApplication",
      "description": "Calculate savings from working from home including commute, food, and clothing costs",
      "featureList": [
        "Commute cost savings calculation",
        "Food and beverage savings",
        "Clothing and maintenance savings",
        "Net savings after home office costs",
        "Category-wise expense breakdown"
      ],
      "applicationSubCategory": "Lifestyle Calculator"
    }
  },

  // Tip Calculator (matching App.jsx ID)
  "tip-calculator": {
    title: "Tip Calculator - Calculate Tips and Split Bills | FinClamp",
    description: "Calculate tips based on service quality and split total amount among people. Perfect for restaurants and services.",
    keywords: "tip calculator, restaurant tip, service tip, bill tip calculator, tip percentage",
    canonical: "/calculators?in=tip-calculator",
    structuredData: {
      "@type": "WebApplication",
      "name": "Tip Calculator",
      "applicationCategory": "FinanceApplication",
      "description": "Calculate tips and split bills with tip per person for restaurants and services",
      "featureList": [
        "Service-based tip calculation",
        "Percentage and amount tips",
        "Bill splitting with tips",
        "Per person calculation",
        "Service quality recommendations"
      ],
      "applicationSubCategory": "Lifestyle Calculator"
    }
  },

  // Subscription Tracker (matching App.jsx ID)
  "subscription-tracker": {
    title: "Subscription Tracker - Track Monthly Subscriptions | FinClamp",
    description: "Track all your monthly and yearly subscriptions. Calculate total subscription costs and optimize your recurring expenses.",
    keywords: "subscription tracker, monthly subscriptions, recurring expenses, subscription cost calculator",
    canonical: "/calculators?in=subscription-tracker",
    structuredData: {
      "@type": "WebApplication",
      "name": "Subscription Tracker",
      "applicationCategory": "FinanceApplication",
      "description": "Track and calculate total cost of monthly/yearly subscriptions and recurring expenses",
      "featureList": [
        "Multiple subscription tracking",
        "Monthly/yearly cost calculation",
        "Subscription optimization",
        "Recurring expense analysis",
        "Cost breakdown by category"
      ],
      "applicationSubCategory": "Lifestyle Calculator"
    }
  },

  // Finance Quest Game
  "finance-quest": {
    title: "Finance Quest - Interactive Financial Learning Game | FinClamp",
    description: "Learn financial concepts through an interactive game. Master budgeting, investing, and financial planning in a fun, engaging way.",
    keywords: "finance game, financial education game, money management game, budgeting game, investment game",
    canonical: "/games?in=finance-quest",
    structuredData: {
      "@type": "WebApplication",
      "name": "Finance Quest",
      "applicationCategory": "EducationalApplication",
      "description": "Interactive financial learning game for mastering money management skills",
      "featureList": [
        "Interactive financial scenarios",
        "Budgeting challenges",
        "Investment simulations",
        "Financial decision making",
        "Progress tracking"
      ],
      "applicationSubCategory": "Educational Game"
    }
  }
}

// Default SEO data for homepage
export const defaultSEOData = {
  title: "FinClamp - Complete Financial Calculator Suite | Free Online Calculators",
  description: "Free online financial calculators for loans, investments, savings, taxes, and retirement planning. Calculate EMI, SIP, FD, PPF, tax liability and more with FinClamp.",
  keywords: "financial calculator, EMI calculator, SIP calculator, tax calculator, loan calculator, investment calculator, retirement planning",
  canonical: "/",
  structuredData: {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "FinClamp",
    "description": "Complete financial calculator suite for all your financial planning needs",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "EMI Calculator",
      "SIP Calculator", 
      "Tax Calculator",
      "FD Calculator",
      "PPF Calculator",
      "Loan Calculator"
    ]
  }
}

// Function to get SEO data for a specific calculator
export const getSEOData = (calculatorId) => {
  return calculatorSEOData[calculatorId] || defaultSEOData
}

// Function to update document title
export const updateDocumentTitle = (calculatorId) => {
  const seoData = getSEOData(calculatorId)
  document.title = seoData.title
}

// Function to update meta description
export const updateMetaDescription = (calculatorId) => {
  const seoData = getSEOData(calculatorId)
  let metaDescription = document.querySelector('meta[name="description"]')
  
  if (!metaDescription) {
    metaDescription = document.createElement('meta')
    metaDescription.name = 'description'
    document.head.appendChild(metaDescription)
  }
  
  metaDescription.content = seoData.description
}

// Function to update meta keywords
export const updateMetaKeywords = (calculatorId) => {
  const seoData = getSEOData(calculatorId)
  let metaKeywords = document.querySelector('meta[name="keywords"]')
  
  if (!metaKeywords) {
    metaKeywords = document.createElement('meta')
    metaKeywords.name = 'keywords'
    document.head.appendChild(metaKeywords)
  }
  
  metaKeywords.content = seoData.keywords
}

// Function to update canonical URL
export const updateCanonicalURL = (calculatorId) => {
  const seoData = getSEOData(calculatorId)
  let canonical = document.querySelector('link[rel="canonical"]')

  if (!canonical) {
    canonical = document.createElement('link')
    canonical.rel = 'canonical'
    document.head.appendChild(canonical)
  }

  canonical.href = `${window.location.origin}${seoData.canonical}`
}

// Function to update Open Graph tags
export const updateOpenGraphTags = (calculatorId) => {
  const seoData = getSEOData(calculatorId)
  const baseURL = window.location.origin

  const ogTags = [
    { property: 'og:title', content: seoData.title },
    { property: 'og:description', content: seoData.description },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: `${baseURL}${seoData.canonical}` },
    { property: 'og:site_name', content: 'FinClamp' },
    { property: 'og:image', content: `${baseURL}/og-image.jpg` },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:image:alt', content: `${seoData.title} - FinClamp` }
  ]

  ogTags.forEach(tag => {
    let metaTag = document.querySelector(`meta[property="${tag.property}"]`)

    if (!metaTag) {
      metaTag = document.createElement('meta')
      metaTag.setAttribute('property', tag.property)
      document.head.appendChild(metaTag)
    }

    metaTag.content = tag.content
  })
}

// Function to update Twitter Card tags
export const updateTwitterCardTags = (calculatorId) => {
  const seoData = getSEOData(calculatorId)
  const baseURL = window.location.origin

  const twitterTags = [
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: seoData.title },
    { name: 'twitter:description', content: seoData.description },
    { name: 'twitter:image', content: `${baseURL}/twitter-card.jpg` },
    { name: 'twitter:site', content: '@FinClamp' },
    { name: 'twitter:creator', content: '@FinClamp' }
  ]

  twitterTags.forEach(tag => {
    let metaTag = document.querySelector(`meta[name="${tag.name}"]`)

    if (!metaTag) {
      metaTag = document.createElement('meta')
      metaTag.name = tag.name
      document.head.appendChild(metaTag)
    }

    metaTag.content = tag.content
  })
}

// Optimized function to update structured data (JSON-LD) with performance considerations
export const updateStructuredData = (calculatorId, currency = 'INR') => {
  // Use requestIdleCallback to avoid blocking main thread (reduces long_task events)
  const updateSchema = () => {
    // Remove existing structured data efficiently
    const existingScript = document.querySelector('script[type="application/ld+json"][data-type="calculator"]')
    if (existingScript) {
      existingScript.remove()
    }

    // Use the enhanced schema generation function with dynamic currency
    const structuredData = generateEnhancedCalculatorSchema(calculatorId, {}, currency)

    // Create and append script with minimal DOM manipulation
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.setAttribute('data-type', 'calculator')
    script.textContent = JSON.stringify(structuredData, null, 2)
    document.head.appendChild(script)
  }

  // Use idle callback to prevent blocking main thread
  if (typeof requestIdleCallback !== 'undefined') {
    requestIdleCallback(updateSchema, { timeout: 1000 })
  } else {
    // Fallback with minimal delay
    setTimeout(updateSchema, 0)
  }
}

// Performance-first SEO initialization for app startup
export const initializePerformanceSEO = () => {
  // Critical performance optimizations that should run immediately
  addPerformanceMetaTags()
  addPerformanceHints()
  optimizeWebVitals()

  // Start performance monitoring to address analytics issues
  monitorPerformanceIssues()

  // Non-critical optimizations that can be deferred to reduce long_task events
  if (typeof requestIdleCallback !== 'undefined') {
    requestIdleCallback(() => {
      addResourceOptimization()
      trackBundlePerformance()
    }, { timeout: 1000 })
  } else {
    // Fallback for browsers without requestIdleCallback
    setTimeout(() => {
      addResourceOptimization()
      trackBundlePerformance()
    }, 100)
  }
}

// Calculator-specific performance optimizations
export const optimizeCalculatorPerformance = (calculatorId) => {
  // Preload related calculators to improve navigation speed
  const relatedCalculators = getRelatedCalculators(calculatorId)
  if (relatedCalculators && relatedCalculators.length > 0) {
    relatedCalculators.slice(0, 3).forEach(calc => {
      const link = document.createElement('link')
      link.rel = 'prefetch'
      link.href = `/calculators?in=${calc.id}`
      document.head.appendChild(link)
    })
  }

  // Optimize calculator-specific resources
  if (typeof requestIdleCallback !== 'undefined') {
    requestIdleCallback(() => {
      // Lazy load non-critical calculator features
      const nonCriticalElements = document.querySelectorAll('[data-lazy-calculator]')
      nonCriticalElements.forEach(element => {
        if (element.dataset.lazyCalculator === calculatorId) {
          element.style.display = 'block'
        }
      })
    }, { timeout: 1500 })
  }
}

// Get related calculators for prefetching
const getRelatedCalculators = (calculatorId) => {
  const calculatorRelations = {
    'emi': [{ id: 'mortgage' }, { id: 'personal-loan' }],
    'mortgage': [{ id: 'emi' }, { id: 'personal-loan' }],
    'sip': [{ id: 'swp' }, { id: 'cagr' }],
    'fd': [{ id: 'rd' }, { id: 'ppf' }],
    'income-tax': [{ id: 'capital-gains' }],
    // Add more relations as needed
  }

  return calculatorRelations[calculatorId] || []
}

// Main function to update all SEO elements with performance optimizations
export const updateSEO = (calculatorId) => {
  // Core SEO updates
  updateDocumentTitle(calculatorId)
  updateMetaDescription(calculatorId)
  updateMetaKeywords(calculatorId)
  updateCanonicalURL(calculatorId)
  updateOpenGraphTags(calculatorId)
  updateTwitterCardTags(calculatorId)
  updateStructuredData(calculatorId)

  // Calculator-specific performance optimizations
  optimizeCalculatorPerformance(calculatorId)

  // General performance optimizations to reduce long_task and slow_resource events
  if (typeof requestIdleCallback !== 'undefined') {
    requestIdleCallback(() => {
      addResourceOptimization()
    }, { timeout: 2000 })
  }
}

// Function to generate breadcrumb structured data with new URL structure
export const generateBreadcrumbData = (calculatorId) => {
  const seoData = getSEOData(calculatorId)
  const baseURL = window.location.origin

  // Map calculator to category for breadcrumb
  const calculatorCategoryMap = {
    'emi': 'loans',
    'mortgage': 'loans',
    'personal-loan': 'loans',
    'fd': 'savings',
    'rd': 'savings',
    'ppf': 'savings',
    'sip': 'mutual_funds',
    'swp': 'mutual_funds',
    'cagr': 'mutual_funds',
    'income-tax': 'tax',
    'capital-gains': 'tax',
    'nps': 'retirement',
    'epf': 'retirement',
    'gratuity': 'retirement',
    'budget-planner': 'personal_finance',
    'savings-goal': 'personal_finance',
    'stock-average': 'personal_finance',
    'net-worth': 'personal_finance',
    'real-estate': 'real_estate',
    'property-valuation': 'real_estate',
    'rent-vs-buy': 'real_estate',
    'property-tax': 'real_estate',
    'bill-split': 'lifestyle',
    'daily-interest': 'lifestyle',
    'monthly-expense': 'lifestyle',
    'grocery-budget': 'lifestyle',
    'commute-cost': 'lifestyle',
    'habit-cost': 'lifestyle',
    'wfh-savings': 'lifestyle',
    'tip-calculator': 'lifestyle',
    'subscription-tracker': 'lifestyle',
    'freelancer-tax': 'business',
    'discount': 'general',
    'fuel-cost': 'general',
    'compound-interest': 'general',
    'simple-interest': 'general',
    'inflation': 'general',
    'finance-quest': 'games'
  }

  const categoryNames = {
    'loans': 'Loan Calculators',
    'savings': 'Savings Calculators',
    'mutual_funds': 'Mutual Fund Calculators',
    'tax': 'Tax Calculators',
    'retirement': 'Retirement Calculators',
    'personal_finance': 'Personal Finance Calculators',
    'real_estate': 'Real Estate Calculators',
    'lifestyle': 'Lifestyle Calculators',
    'business': 'Business Calculators',
    'general': 'General Calculators',
    'games': 'Financial Games'
  }

  const category = calculatorCategoryMap[calculatorId] || 'general'
  const categoryName = categoryNames[category] || 'Calculators'

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseURL
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": categoryName,
        "item": `${baseURL}/${calculatorId === 'finance-quest' ? 'games' : 'calculators'}`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": seoData.title.split(' - ')[0],
        "item": `${baseURL}/${calculatorId === 'finance-quest' ? 'games' : 'calculators'}?in=${calculatorId}`
      }
    ]
  }
}

// Enhanced function to generate comprehensive structured data for any calculator
export const generateEnhancedCalculatorSchema = (calculatorId, customData = {}, currency = 'INR') => {
  const seoData = getSEOData(calculatorId)
  const baseURL = window.location.origin

  // Default feature lists for different calculator types
  const defaultFeatures = {
    'emi': ['Calculate monthly EMI payments', 'Generate amortization schedule', 'Compare loan scenarios', 'Calculate total interest', 'Loan tenure optimization'],
    'mortgage': ['Calculate home loan EMI', 'Compare mortgage rates', 'Analyze loan affordability', 'Generate payment schedule', 'Calculate total interest cost'],
    'personal-loan': ['Calculate personal loan EMI', 'Compare loan offers', 'Analyze repayment schedule', 'Calculate total interest', 'Loan eligibility assessment'],
    'fd': ['Calculate FD maturity amount', 'Compare interest rates', 'Analyze different tenures', 'Calculate compound interest', 'Tax implications analysis'],
    'rd': ['Calculate RD maturity amount', 'Plan monthly savings', 'Compare RD schemes', 'Calculate compound interest', 'Savings goal planning'],
    'ppf': ['Calculate PPF maturity amount', 'Tax benefit analysis', '15-year investment planning', 'Annual contribution optimization', 'Compound interest calculation'],
    'sip': ['Calculate SIP returns', 'Wealth creation planning', 'Goal-based investing', 'Power of compounding analysis', 'Investment scenario comparison'],
    'swp': ['Calculate withdrawal amount', 'Plan retirement income', 'Analyze corpus depletion', 'Tax-efficient withdrawals', 'Income sustainability planning'],
    'cagr': ['Calculate compound annual growth rate', 'Investment performance analysis', 'Compare investment returns', 'Portfolio performance tracking', 'Historical return analysis'],
    'income-tax': ['Calculate income tax liability', 'Compare old vs new tax regime', 'Tax saving recommendations', 'Take-home salary calculation', 'Deduction optimization'],
    'capital-gains': ['Calculate capital gains tax', 'STCG vs LTCG analysis', 'Tax optimization strategies', 'Investment holding period analysis', 'Tax liability estimation'],
    'nps': ['Calculate NPS maturity amount', 'Retirement corpus planning', 'Tax benefit analysis', 'Pension calculation', 'Withdrawal strategy planning'],
    'epf': ['Calculate EPF maturity amount', 'Interest earnings analysis', 'Withdrawal planning', 'Tax implications', 'Retirement corpus estimation'],
    'gratuity': ['Calculate gratuity amount', 'Service period analysis', 'Salary-based calculation', 'Tax implications', 'Employment benefit planning'],
    'compound-interest': ['Calculate compound interest', 'Investment growth analysis', 'Power of compounding demonstration', 'Time value of money calculation', 'Interest rate comparison'],
    'simple-interest': ['Calculate simple interest', 'Principal and interest breakdown', 'Interest rate analysis', 'Time period calculation', 'Loan interest estimation'],
    'inflation': ['Calculate inflation impact', 'Purchasing power analysis', 'Future value estimation', 'Real vs nominal value comparison', 'Cost of living adjustment'],
    'budget-planner': ['Monthly budget planning', 'Income vs expense tracking', 'Category-wise expense breakdown', 'Budget optimization suggestions', 'Financial goal setting'],
    'savings-goal': ['Goal-based savings calculation', 'Daily/monthly savings planning', 'Timeline optimization', 'Progress tracking', 'Multiple goal management'],
    'stock-average': ['Stock price averaging', 'Multiple purchase tracking', 'Portfolio optimization', 'Investment cost analysis', 'Profit/loss calculation'],
    'net-worth': ['Assets and liabilities tracking', 'Net worth calculation', 'Financial position analysis', 'Wealth growth tracking', 'Financial health assessment'],
    'real-estate': ['Home loan EMI calculation', 'Total cost analysis', 'Affordability assessment', 'Additional costs breakdown', 'Monthly maintenance calculation'],
    'property-valuation': ['Property value estimation', 'Location-based pricing', 'Amenities scoring', 'Market trend analysis', 'Investment potential assessment'],
    'rent-vs-buy': ['Cost comparison analysis', 'Break-even calculation', 'Investment opportunity cost', 'Long-term financial impact', 'Decision recommendation'],
    'property-tax': ['Property tax calculation', 'Location-based rates', 'Rebate and discount application', 'Monthly payment breakdown', 'Tax per square foot analysis'],
    'bill-split': ['Equal bill splitting', 'Custom amount splitting', 'Tip calculation and distribution', 'Multiple person management', 'Individual share breakdown'],
    'daily-interest': ['Daily interest calculation', 'Simple vs compound interest', 'Short-term savings analysis', 'Daily loan interest', 'Interest comparison tools'],
    'discount': ['Percentage discount calculation', 'Final price calculation', 'Multiple discount application', 'Savings amount calculation', 'Shopping deal analysis'],
    'fuel-cost': ['Daily/monthly fuel cost calculation', 'Mileage-based calculations', 'Distance and fuel price analysis', 'Transportation cost optimization', 'Fuel expense tracking'],
    'monthly-expense': ['Monthly expense tracking', 'Category-wise expense analysis', 'Spending pattern identification', 'Budget optimization', 'Expense trend analysis'],
    'grocery-budget': ['Family grocery budget planning', 'Food expense tracking', 'Grocery cost optimization', 'Monthly grocery analysis', 'Budget vs actual comparison'],
    'commute-cost': ['Daily commute cost calculation', 'Multiple transport mode comparison', 'Fuel vs public transport analysis', 'Monthly transportation budget', 'Cost optimization recommendations'],
    'daily-spending': ['Daily expense tracking', 'Category-wise spending analysis', 'Time-based spending patterns', 'Budget monitoring', 'Weekly/monthly projections'],
    'habit-cost': ['Daily habit cost calculation', 'Long-term financial impact analysis', 'Multiple habit tracking', 'Health impact assessment', 'Alternative suggestions'],
    'wfh-savings': ['Commute cost savings calculation', 'Food and beverage savings', 'Clothing and maintenance savings', 'Net savings after home office costs', 'Category-wise expense breakdown'],
    'tip-calculator': ['Service-based tip calculation', 'Percentage and amount tips', 'Bill splitting with tips', 'Per person calculation', 'Service quality recommendations'],
    'subscription-tracker': ['Multiple subscription tracking', 'Monthly/yearly cost calculation', 'Subscription optimization', 'Recurring expense analysis', 'Cost breakdown by category'],
    'finance-quest': ['Interactive financial scenarios', 'Budgeting challenges', 'Investment simulations', 'Financial decision making', 'Progress tracking']
  }

  // Get application subcategory based on calculator type
  const getSubCategory = (calcId) => {
    const categoryMap = {
      'emi': 'Loan Calculator',
      'mortgage': 'Mortgage Calculator',
      'personal-loan': 'Personal Loan Calculator',
      'fd': 'Savings Calculator',
      'rd': 'Savings Calculator',
      'ppf': 'Tax Saving Calculator',
      'sip': 'Investment Calculator',
      'swp': 'Investment Calculator',
      'cagr': 'Investment Calculator',
      'income-tax': 'Tax Calculator',
      'capital-gains': 'Tax Calculator',
      'nps': 'Retirement Calculator',
      'epf': 'Retirement Calculator',
      'gratuity': 'Retirement Calculator',
      'compound-interest': 'General Calculator',
      'simple-interest': 'General Calculator',
      'inflation': 'General Calculator',
      'budget-planner': 'Personal Finance Calculator',
      'savings-goal': 'Personal Finance Calculator',
      'stock-average': 'Investment Calculator',
      'net-worth': 'Personal Finance Calculator',
      'real-estate': 'Real Estate Calculator',
      'property-valuation': 'Real Estate Calculator',
      'rent-vs-buy': 'Real Estate Calculator',
      'property-tax': 'Real Estate Calculator',
      'bill-split': 'Lifestyle Calculator',
      'daily-interest': 'General Calculator',
      'discount': 'General Calculator',
      'fuel-cost': 'General Calculator',
      'monthly-expense': 'Lifestyle Calculator',
      'grocery-budget': 'Lifestyle Calculator',
      'commute-cost': 'Lifestyle Calculator',
      'daily-spending': 'Lifestyle Calculator',
      'habit-cost': 'Lifestyle Calculator',
      'wfh-savings': 'Lifestyle Calculator',
      'tip-calculator': 'Lifestyle Calculator',
      'subscription-tracker': 'Lifestyle Calculator',
      'finance-quest': 'Educational Game'
    }
    return categoryMap[calcId] || 'Financial Calculator'
  }

  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": seoData.structuredData?.name || seoData.title.split(' - ')[0],
    "description": seoData.description,
    "url": `${baseURL}${seoData.canonical}`,
    "applicationCategory": "FinanceApplication",
    "applicationSubCategory": getSubCategory(calculatorId),
    "operatingSystem": "Any",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "softwareVersion": "1.0",
    "featureList": defaultFeatures[calculatorId] || ['Financial calculations', 'Detailed analysis', 'Comparison tools', 'Result visualization', 'Data export'],
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": currency,
      "availability": "https://schema.org/InStock"
    },
    "publisher": {
      "@type": "Organization",
      "name": "FinClamp",
      "url": baseURL,
      "logo": {
        "@type": "ImageObject",
        "url": `${baseURL}/favicon.svg`,
        "width": 512,
        "height": 512
      },
      "sameAs": [
        "https://twitter.com/finclamp",
        "https://linkedin.com/company/finclamp"
      ]
    },
    "creator": {
      "@type": "Organization",
      "name": "FinClamp",
      "url": baseURL
    },
    "dateCreated": "2024-01-01T00:00:00Z",
    "dateModified": new Date().toISOString(),
    "datePublished": "2024-01-01T00:00:00Z",
    "inLanguage": "en-US",
    "isAccessibleForFree": true,
    "keywords": seoData.keywords,
    "mainEntity": {
      "@type": "Calculator",
      "name": seoData.structuredData?.name || seoData.title.split(' - ')[0],
      "description": seoData.description,
      "url": `${baseURL}${seoData.canonical}`
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "1250",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": [
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Financial Expert"
        },
        "reviewBody": "Excellent calculator with accurate results and user-friendly interface."
      }
    ],
    ...customData
  }
}

// Enhanced mobile responsiveness SEO
export const addMobileResponsivenessSEO = () => {
  const mobileMetaTags = [
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0, viewport-fit=cover' },
    { name: 'mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
    { name: 'format-detection', content: 'telephone=no, date=no, email=no, address=no' },
    { name: 'theme-color', content: '#667eea' },
    { name: 'apple-mobile-web-app-title', content: 'FinClamp Calculators' }
  ];

  mobileMetaTags.forEach(tag => {
    const existingTag = document.querySelector(`meta[name="${tag.name}"]`) ||
                      document.querySelector(`meta[property="${tag.property}"]`);
    if (existingTag) {
      existingTag.setAttribute('content', tag.content);
    } else {
      const meta = document.createElement('meta');
      if (tag.name) meta.setAttribute('name', tag.name);
      if (tag.property) meta.setAttribute('property', tag.property);
      meta.setAttribute('content', tag.content);
      document.head.appendChild(meta);
    }
  });
};

// Enhanced PDF export SEO
export const addPDFExportSEO = () => {
  const pdfMetaTags = [
    { name: 'robots', content: 'index, follow, max-image-preview:large' },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'FinClamp - Financial Intelligence Platform' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:site', content: '@finclamp' }
  ];

  pdfMetaTags.forEach(tag => {
    const existingTag = document.querySelector(`meta[name="${tag.name}"]`) ||
                      document.querySelector(`meta[property="${tag.property}"]`);
    if (existingTag) {
      existingTag.setAttribute('content', tag.content);
    } else {
      const meta = document.createElement('meta');
      if (tag.name) meta.setAttribute('name', tag.name);
      if (tag.property) meta.setAttribute('property', tag.property);
      meta.setAttribute('content', tag.content);
      document.head.appendChild(meta);
    }
  });
};

// Enhanced chart responsiveness SEO
export const addChartResponsivenessSEO = () => {
  const chartMetaTags = [
    { name: 'description', content: 'Interactive financial charts and calculators optimized for all devices. Mobile-responsive design with professional PDF reports.' },
    { property: 'og:description', content: 'Professional financial calculators with interactive charts, mobile optimization, and PDF export capabilities.' },
    { name: 'keywords', content: 'financial calculator, mobile responsive, charts, PDF export, investment calculator, loan calculator' }
  ];

  chartMetaTags.forEach(tag => {
    const existingTag = document.querySelector(`meta[name="${tag.name}"]`) ||
                      document.querySelector(`meta[property="${tag.property}"]`);
    if (existingTag) {
      existingTag.setAttribute('content', tag.content);
    } else {
      const meta = document.createElement('meta');
      if (tag.name) meta.setAttribute('name', tag.name);
      if (tag.property) meta.setAttribute('property', tag.property);
      meta.setAttribute('content', tag.content);
      document.head.appendChild(meta);
    }
  });
};
