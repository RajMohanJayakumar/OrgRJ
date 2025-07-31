// Enhanced Google Analytics 4 tracking for SEO optimization

export const initializeEnhancedAnalytics = () => {
  // Enhanced ecommerce tracking for calculator usage
  if (typeof window !== 'undefined' && window.gtag) {
    // Set up enhanced measurement
    window.gtag('config', 'GA_MEASUREMENT_ID', {
      // Enhanced measurement settings
      enhanced_measurement: {
        scrolls: true,
        outbound_clicks: true,
        site_search: true,
        video_engagement: true,
        file_downloads: true
      },
      // Custom parameters for financial calculators
      custom_map: {
        'calculator_type': 'custom_parameter_1',
        'user_segment': 'custom_parameter_2',
        'calculation_accuracy': 'custom_parameter_3'
      }
    })
  }
}

// Track calculator usage as enhanced ecommerce events
export const trackCalculatorUsage = (calculatorId, inputs = {}, results = {}) => {
  if (typeof window === 'undefined' || !window.gtag) return

  // Track as a "purchase" event for conversion tracking
  window.gtag('event', 'purchase', {
    transaction_id: `calc_${calculatorId}_${Date.now()}`,
    value: 1.0, // Assign value for conversion tracking
    currency: 'USD',
    items: [{
      item_id: calculatorId,
      item_name: `${calculatorId} Calculator`,
      item_category: getCalculatorCategory(calculatorId),
      item_variant: Object.keys(inputs).length > 0 ? 'with_inputs' : 'empty',
      quantity: 1,
      price: 1.0
    }],
    // Custom parameters
    calculator_type: calculatorId,
    input_count: Object.keys(inputs).length,
    has_results: Object.keys(results).length > 0,
    user_segment: getUserSegment(inputs)
  })
}

// Track search queries within the app
export const trackInternalSearch = (searchTerm, calculatorId = null) => {
  if (typeof window === 'undefined' || !window.gtag) return

  window.gtag('event', 'search', {
    search_term: searchTerm,
    content_group1: calculatorId || 'homepage',
    custom_map: {
      calculator_context: calculatorId,
      search_source: 'internal'
    }
  })
}

// Track user engagement with calculator features
export const trackCalculatorFeature = (feature, calculatorId, additionalData = {}) => {
  if (typeof window === 'undefined' || !window.gtag) return

  window.gtag('event', 'select_content', {
    content_type: 'calculator_feature',
    content_id: `${calculatorId}_${feature}`,
    content_group1: calculatorId,
    content_group2: feature,
    ...additionalData
  })
}

// Track PDF exports for conversion measurement
export const trackPDFExport = (calculatorId, inputs = {}, results = {}) => {
  if (typeof window === 'undefined' || !window.gtag) return

  window.gtag('event', 'generate_lead', {
    currency: 'USD',
    value: 2.0, // Higher value for PDF exports
    content_group1: calculatorId,
    method: 'pdf_export',
    calculator_type: calculatorId,
    input_complexity: Object.keys(inputs).length,
    has_results: Object.keys(results).length > 0
  })
}

// Track social sharing for viral coefficient
export const trackSocialShare = (platform, calculatorId, url) => {
  if (typeof window === 'undefined' || !window.gtag) return

  window.gtag('event', 'share', {
    method: platform,
    content_type: 'calculator',
    content_id: calculatorId,
    content_group1: calculatorId,
    custom_map: {
      share_url: url,
      calculator_type: calculatorId
    }
  })
}

// Track calculator comparison usage
export const trackCalculatorComparison = (calculators) => {
  if (!window.gtag) return

  window.gtag('event', 'view_item_list', {
    item_list_id: 'calculator_comparison',
    item_list_name: 'Calculator Comparison',
    items: calculators.map((calc, index) => ({
      item_id: calc.id,
      item_name: calc.name,
      item_category: getCalculatorCategory(calc.id),
      index: index,
      quantity: 1
    })),
    comparison_count: calculators.length
  })
}

// Track user segments for personalization
export const trackUserSegment = (calculatorId, inputs = {}) => {
  if (!window.gtag) return

  const segment = getUserSegment(inputs)
  
  window.gtag('event', 'join_group', {
    group_id: segment,
    content_group1: calculatorId,
    method: 'automatic_segmentation',
    calculator_type: calculatorId,
    user_segment: segment
  })
}

// Track page performance for Core Web Vitals
export const trackPagePerformance = (metric, value, calculatorId = null) => {
  if (!window.gtag) return

  window.gtag('event', 'timing_complete', {
    name: metric,
    value: Math.round(value),
    event_category: 'Core Web Vitals',
    event_label: calculatorId || 'homepage',
    custom_map: {
      calculator_id: calculatorId,
      metric_name: metric,
      metric_value: value,
      is_good_score: isGoodWebVitalScore(metric, value)
    }
  })
}

// Track calculator errors for optimization
export const trackCalculatorError = (errorType, calculatorId, errorDetails = {}) => {
  if (!window.gtag) return

  window.gtag('event', 'exception', {
    description: `${calculatorId}_${errorType}`,
    fatal: false,
    content_group1: calculatorId,
    error_type: errorType,
    calculator_type: calculatorId,
    ...errorDetails
  })
}

// Track form abandonment for optimization
export const trackFormAbandonment = (calculatorId, fieldsCompleted, totalFields) => {
  if (!window.gtag) return

  const completionRate = (fieldsCompleted / totalFields) * 100

  window.gtag('event', 'form_abandon', {
    content_group1: calculatorId,
    value: completionRate,
    calculator_type: calculatorId,
    fields_completed: fieldsCompleted,
    total_fields: totalFields,
    completion_rate: completionRate
  })
}

// Helper functions
const getCalculatorCategory = (calculatorId) => {
  const categoryMap = {
    'emi': 'loans',
    'sip': 'investments', 
    'fd': 'savings',
    'income-tax': 'tax',
    'ppf': 'savings',
    'nps': 'retirement',
    'epf': 'retirement'
  }
  return categoryMap[calculatorId] || 'general'
}

const getUserSegment = (inputs = {}) => {
  // Determine user segment based on input values
  const values = Object.values(inputs).filter(v => v && !isNaN(v)).map(Number)
  
  if (values.length === 0) return 'browser'
  
  const maxValue = Math.max(...values)
  
  if (maxValue >= 10000000) return 'high_net_worth'
  if (maxValue >= 1000000) return 'affluent'
  if (maxValue >= 100000) return 'middle_class'
  return 'entry_level'
}

const isGoodWebVitalScore = (metric, value) => {
  const thresholds = {
    'LCP': 2500,
    'FID': 100,
    'CLS': 0.1,
    'FCP': 1800,
    'TTFB': 800
  }
  
  return value <= (thresholds[metric] || Infinity)
}

// Enhanced conversion tracking
export const trackConversion = (conversionType, calculatorId, value = 1) => {
  if (!window.gtag) return

  window.gtag('event', 'conversion', {
    send_to: 'AW-CONVERSION_ID/CONVERSION_LABEL', // Replace with actual conversion ID
    value: value,
    currency: 'USD',
    transaction_id: `${conversionType}_${calculatorId}_${Date.now()}`,
    content_group1: calculatorId,
    conversion_type: conversionType,
    calculator_type: calculatorId
  })
}

// Track calculator recommendation clicks
export const trackRecommendationClick = (recommendedCalculator, sourceCalculator) => {
  if (!window.gtag) return

  window.gtag('event', 'select_promotion', {
    creative_name: `${sourceCalculator}_to_${recommendedCalculator}`,
    creative_slot: 'related_calculators',
    promotion_id: `rec_${recommendedCalculator}`,
    promotion_name: `${recommendedCalculator} Calculator`,
    content_group1: sourceCalculator,
    content_group2: recommendedCalculator
  })
}

export default {
  initializeEnhancedAnalytics,
  trackCalculatorUsage,
  trackInternalSearch,
  trackCalculatorFeature,
  trackPDFExport,
  trackSocialShare,
  trackCalculatorComparison,
  trackUserSegment,
  trackPagePerformance,
  trackCalculatorError,
  trackFormAbandonment,
  trackConversion,
  trackRecommendationClick
}
