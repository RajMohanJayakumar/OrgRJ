import { useEffect } from 'react'
import { generateEnhancedCalculatorSchema } from '../utils/seo'
import { useCurrency } from '../contexts/CurrencyContext'

/**
 * CalculatorSchema Component
 * 
 * Adds comprehensive JSON-LD structured data for calculator pages
 * This helps search engines understand the calculator functionality
 * and can trigger rich snippets in search results
 * 
 * @param {string} calculatorId - The unique identifier for the calculator
 * @param {Object} customData - Additional structured data to merge
 * @param {Object} inputs - Current calculator inputs for dynamic schema
 * @param {Object} results - Current calculator results for enhanced schema
 */
const CalculatorSchema = ({
  calculatorId,
  customData = {},
  inputs = {},
  results = {}
}) => {
  const { currentFormat } = useCurrency()

  useEffect(() => {
    if (!calculatorId) return

    // Remove existing calculator schema
    const existingSchema = document.querySelector('script[data-schema="calculator"]')
    if (existingSchema) {
      existingSchema.remove()
    }

    // Generate enhanced schema with custom data and dynamic currency
    const schemaData = generateEnhancedCalculatorSchema(calculatorId, customData, currentFormat.code)

    // Add dynamic data based on inputs and results
    if (Object.keys(inputs).length > 0 || Object.keys(results).length > 0) {
      schemaData.potentialAction = {
        "@type": "UseAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${window.location.origin}${schemaData.url}`,
          "actionPlatform": [
            "http://schema.org/DesktopWebPlatform",
            "http://schema.org/MobileWebPlatform"
          ]
        },
        "object": {
          "@type": "Calculator",
          "name": schemaData.name
        }
      }
    }

    // Add FAQ schema if calculator has common questions
    const faqData = getCalculatorFAQ(calculatorId)
    if (faqData.length > 0) {
      schemaData.mainEntity = [
        schemaData.mainEntity,
        {
          "@type": "FAQPage",
          "mainEntity": faqData
        }
      ]
    }

    // Create and append script tag
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.setAttribute('data-schema', 'calculator')
    script.textContent = JSON.stringify(schemaData, null, 2)
    document.head.appendChild(script)

    // Cleanup function
    return () => {
      const schemaToRemove = document.querySelector('script[data-schema="calculator"]')
      if (schemaToRemove) {
        schemaToRemove.remove()
      }
    }
  }, [calculatorId, customData, inputs, results, currentFormat.code])

  // This component doesn't render anything visible
  return null
}

/**
 * Get FAQ data for specific calculators
 * This helps with SEO and can trigger FAQ rich snippets
 */
const getCalculatorFAQ = (calculatorId) => {
  const faqData = {
    'emi': [
      {
        "@type": "Question",
        "name": "What is EMI and how is it calculated?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "EMI (Equated Monthly Installment) is the fixed amount you pay every month towards your loan. It's calculated using the loan amount, interest rate, and tenure using the formula: EMI = [P x R x (1+R)^N] / [(1+R)^N-1]"
        }
      },
      {
        "@type": "Question",
        "name": "Can I prepay my loan to reduce EMI?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, you can make prepayments to reduce either your EMI amount or loan tenure. Prepayments help save on interest costs over the loan duration."
        }
      }
    ],
    'sip': [
      {
        "@type": "Question",
        "name": "What is SIP and how does it work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "SIP (Systematic Investment Plan) allows you to invest a fixed amount regularly in mutual funds. It helps in rupee cost averaging and building wealth through the power of compounding."
        }
      },
      {
        "@type": "Question",
        "name": "What is the minimum SIP amount?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Most mutual funds allow SIP investments starting from ₹500 per month, though some funds may have higher minimum amounts."
        }
      }
    ],
    'income-tax': [
      {
        "@type": "Question",
        "name": "What is the difference between old and new tax regime?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The old tax regime offers various deductions and exemptions, while the new regime has lower tax rates but limited deductions. Choose based on your deduction eligibility."
        }
      },
      {
        "@type": "Question",
        "name": "What are the tax slabs for the current financial year?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Tax slabs vary between old and new regime. In the new regime: 0-₹3L (0%), ₹3-6L (5%), ₹6-9L (10%), ₹9-12L (15%), ₹12-15L (20%), above ₹15L (30%)."
        }
      }
    ],
    'fd': [
      {
        "@type": "Question",
        "name": "How is FD interest calculated?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "FD interest is calculated using compound interest formula. The frequency of compounding (quarterly, half-yearly, or yearly) affects the final maturity amount."
        }
      },
      {
        "@type": "Question",
        "name": "Is FD interest taxable?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, FD interest is taxable as per your income tax slab. TDS is deducted if interest exceeds ₹40,000 in a financial year (₹50,000 for senior citizens)."
        }
      }
    ]
  }

  return faqData[calculatorId] || []
}

/**
 * Hook to add calculator schema to any component
 */
export const useCalculatorSchema = (calculatorId, customData = {}, inputs = {}, results = {}) => {
  const { currentFormat } = useCurrency()

  useEffect(() => {
    if (!calculatorId) return

    const schemaData = generateEnhancedCalculatorSchema(calculatorId, customData, currentFormat.code)
    
    // Remove existing schema
    const existingSchema = document.querySelector('script[data-schema="calculator"]')
    if (existingSchema) {
      existingSchema.remove()
    }

    // Add new schema
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.setAttribute('data-schema', 'calculator')
    script.textContent = JSON.stringify(schemaData, null, 2)
    document.head.appendChild(script)

    return () => {
      const schemaToRemove = document.querySelector('script[data-schema="calculator"]')
      if (schemaToRemove) {
        schemaToRemove.remove()
      }
    }
  }, [calculatorId, customData, inputs, results, currentFormat.code])
}

export default CalculatorSchema
