import { useEffect } from 'react'

const SEOAnalytics = ({ calculatorId, inputs = {} }) => {
  useEffect(() => {
    // Track calculator usage for SEO analytics
    if (calculatorId && window.gtag) {
      try {
        window.gtag('event', 'calculator_view', {
          event_category: 'SEO',
          event_label: calculatorId,
          custom_map: {
            calculator_type: calculatorId,
            has_inputs: inputs && Object.keys(inputs).length > 0
          }
        })
      } catch (error) {
        console.error('SEO Analytics error:', error)
      }
    }
  }, [calculatorId, inputs])

  useEffect(() => {
    // Track page performance metrics
    if ('web-vitals' in window) {
      // Track Core Web Vitals for SEO
      const trackWebVitals = (metric) => {
        if (window.gtag) {
          window.gtag('event', metric.name, {
            event_category: 'Web Vitals',
            value: Math.round(metric.value),
            event_label: calculatorId || 'homepage'
          })
        }
      }

      // This would require web-vitals library, but we'll simulate for now
      // getCLS(trackWebVitals)
      // getFID(trackWebVitals)
      // getFCP(trackWebVitals)
      // getLCP(trackWebVitals)
      // getTTFB(trackWebVitals)
    }
  }, [calculatorId])

  // Track social sharing events
  useEffect(() => {
    const trackSocialShare = (platform) => {
      if (window.gtag) {
        window.gtag('event', 'share', {
          event_category: 'Social',
          event_label: platform,
          custom_map: {
            calculator_type: calculatorId,
            url: window.location.href
          }
        })
      }
    }

    // Listen for share events
    window.addEventListener('share', (e) => {
      trackSocialShare(e.detail?.platform || 'unknown')
    })

    return () => {
      window.removeEventListener('share', trackSocialShare)
    }
  }, [calculatorId])

  // Track search engine referrals for SEO analysis
  useEffect(() => {
    const trackSearchEngineReferrals = () => {
      const referrer = document.referrer
      const searchEngines = {
        'google.com': 'Google',
        'bing.com': 'Bing',
        'yahoo.com': 'Yahoo',
        'duckduckgo.com': 'DuckDuckGo',
        'baidu.com': 'Baidu'
      }

      const searchEngine = Object.keys(searchEngines).find(engine =>
        referrer.includes(engine)
      )

      if (searchEngine && window.gtag) {
        window.gtag('event', 'search_engine_referral', {
          event_category: 'SEO Traffic',
          event_label: searchEngines[searchEngine],
          custom_map: {
            calculator_id: calculatorId || 'homepage',
            referrer_url: referrer,
            search_engine: searchEngines[searchEngine]
          }
        })
      }
    }

    trackSearchEngineReferrals()
  }, [calculatorId])

  // Track page depth and user journey for SEO insights
  useEffect(() => {
    const trackUserJourney = () => {
      let sessionData = []

      try {
        sessionData = JSON.parse(sessionStorage.getItem('userJourney') || '[]')
        const currentPage = {
          calculator: calculatorId || 'homepage',
          timestamp: Date.now(),
          url: window.location.href
        }

        sessionData.push(currentPage)
        sessionStorage.setItem('userJourney', JSON.stringify(sessionData))
      } catch (error) {
        console.error('SEO Analytics session storage error:', error)
        // Fallback: create new session data
        try {
          const currentPage = {
            calculator: calculatorId || 'homepage',
            timestamp: Date.now(),
            url: window.location.href
          }
          sessionData = [currentPage]
          sessionStorage.setItem('userJourney', JSON.stringify(sessionData))
        } catch (fallbackError) {
          console.error('SEO Analytics fallback error:', fallbackError)
          return
        }
      }

      // Track page depth
      if (window.gtag) {
        window.gtag('event', 'page_depth', {
          event_category: 'SEO Engagement',
          event_label: 'user_journey',
          value: sessionData.length,
          custom_map: {
            calculator_id: calculatorId || 'homepage',
            journey_depth: sessionData.length,
            session_calculators: sessionData.map(p => p.calculator).join(',')
          }
        })
      }
    }

    trackUserJourney()
  }, [calculatorId])

  // Track calculator completion rates for SEO optimization
  useEffect(() => {
    if (inputs && Object.keys(inputs).length > 0) {
      const trackCalculatorCompletion = () => {
        const completionData = {
          calculator_id: calculatorId,
          inputs_filled: inputs ? Object.keys(inputs).length : 0,
          has_results: inputs ? Object.keys(inputs).some(key => inputs[key] && inputs[key] !== '') : false,
          timestamp: Date.now()
        }

        if (window.gtag) {
          window.gtag('event', 'calculator_completion', {
            event_category: 'SEO Conversion',
            event_label: 'form_interaction',
            value: completionData.inputs_filled,
            custom_map: completionData
          })
        }
      }

      const debounceTimer = setTimeout(trackCalculatorCompletion, 2000)
      return () => clearTimeout(debounceTimer)
    }
  }, [inputs, calculatorId])

  // This component doesn't render anything
  return null
}

export default SEOAnalytics
