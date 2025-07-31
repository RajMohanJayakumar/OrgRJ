import { useEffect, useRef } from 'react'

const SEOPerformanceMonitor = ({ calculatorId }) => {
  const performanceDataRef = useRef({})

  useEffect(() => {
    // Monitor Core Web Vitals for SEO
    monitorCoreWebVitals()

    // Track page load performance
    trackPageLoadPerformance()

    // Monitor user engagement metrics
    monitorUserEngagement()

    // Track calculator-specific metrics
    if (calculatorId) {
      trackCalculatorMetrics(calculatorId)
    }

    // Set up performance observer
    setupPerformanceObserver()

  }, [calculatorId])

  const monitorCoreWebVitals = () => {
    try {
      // Check if PerformanceObserver is available
      if (typeof PerformanceObserver === 'undefined') {
        if (process.env.NODE_ENV === 'development') {
          console.warn('SEOPerformanceMonitor: PerformanceObserver not available')
        }
        return
      }

      // Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((entryList) => {
        try {
          const entries = entryList.getEntries()
          const lastEntry = entries[entries.length - 1]

          performanceDataRef.current.lcp = lastEntry.startTime

          // Track LCP for SEO analytics
          if (window.gtag) {
            window.gtag('event', 'web_vitals', {
              event_category: 'SEO Performance',
              event_label: 'LCP',
              value: Math.round(lastEntry.startTime),
              custom_map: {
                calculator_id: calculatorId || 'homepage',
                metric_value: lastEntry.startTime,
                is_good: lastEntry.startTime <= 2500
              }
            })
          }
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.warn('SEOPerformanceMonitor: Error processing LCP:', error)
          }
        }
      })

      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('SEOPerformanceMonitor: LCP observer not supported:', error)
      }
    }

    // First Input Delay (FID) - simulated since it requires real user interaction
    try {
      const fidObserver = new PerformanceObserver((entryList) => {
        try {
          const entries = entryList.getEntries()
          entries.forEach(entry => {
            performanceDataRef.current.fid = entry.processingStart - entry.startTime

            if (window.gtag) {
              window.gtag('event', 'web_vitals', {
                event_category: 'SEO Performance',
                event_label: 'FID',
                value: Math.round(entry.processingStart - entry.startTime),
                custom_map: {
                  calculator_id: calculatorId || 'homepage',
                  metric_value: entry.processingStart - entry.startTime,
                  is_good: (entry.processingStart - entry.startTime) <= 100
                }
              })
            }
          })
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.warn('SEOPerformanceMonitor: Error processing FID:', error)
          }
        }
      })

      fidObserver.observe({ entryTypes: ['first-input'] })
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('SEOPerformanceMonitor: FID observer not supported:', error)
      }
    }

    // Cumulative Layout Shift (CLS)
    try {
      let clsValue = 0
      const clsObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      entries.forEach(entry => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value
        }
      })
      
      performanceDataRef.current.cls = clsValue
      
      if (window.gtag) {
        window.gtag('event', 'web_vitals', {
          event_category: 'SEO Performance',
          event_label: 'CLS',
          value: Math.round(clsValue * 1000),
          custom_map: {
            calculator_id: calculatorId || 'homepage',
            metric_value: clsValue,
            is_good: clsValue <= 0.1
          }
        })
      }
    })

      clsObserver.observe({ entryTypes: ['layout-shift'] })
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('SEOPerformanceMonitor: CLS observer not supported:', error)
      }
    }
  }

  const trackPageLoadPerformance = () => {
    // Track navigation timing
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0]
        
        if (navigation) {
          const metrics = {
            dns_lookup: navigation.domainLookupEnd - navigation.domainLookupStart,
            tcp_connect: navigation.connectEnd - navigation.connectStart,
            server_response: navigation.responseStart - navigation.requestStart,
            dom_processing: navigation.domContentLoadedEventStart - navigation.responseEnd,
            page_load: navigation.loadEventStart - navigation.navigationStart
          }

          performanceDataRef.current.navigation = metrics

          // Send to analytics
          if (window.gtag) {
            Object.keys(metrics).forEach(metric => {
              window.gtag('event', 'page_performance', {
                event_category: 'SEO Performance',
                event_label: metric,
                value: Math.round(metrics[metric]),
                custom_map: {
                  calculator_id: calculatorId || 'homepage'
                }
              })
            })
          }
        }
      }, 1000)
    })
  }

  const monitorUserEngagement = () => {
    let startTime = Date.now()
    let isVisible = true
    let scrollDepth = 0
    let maxScrollDepth = 0

    // Track time on page
    const trackTimeOnPage = () => {
      if (isVisible) {
        const timeSpent = Date.now() - startTime
        performanceDataRef.current.timeOnPage = timeSpent

        if (window.gtag && timeSpent > 10000) { // Only track if more than 10 seconds
          window.gtag('event', 'engagement', {
            event_category: 'SEO Engagement',
            event_label: 'time_on_page',
            value: Math.round(timeSpent / 1000),
            custom_map: {
              calculator_id: calculatorId || 'homepage',
              engagement_duration: timeSpent
            }
          })
        }
      }
    }

    // Track scroll depth
    const trackScrollDepth = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      scrollDepth = Math.round((scrollTop / docHeight) * 100)
      
      if (scrollDepth > maxScrollDepth) {
        maxScrollDepth = scrollDepth
        performanceDataRef.current.maxScrollDepth = maxScrollDepth

        // Track significant scroll milestones
        if (maxScrollDepth >= 25 && maxScrollDepth < 50) {
          trackScrollMilestone(25)
        } else if (maxScrollDepth >= 50 && maxScrollDepth < 75) {
          trackScrollMilestone(50)
        } else if (maxScrollDepth >= 75 && maxScrollDepth < 90) {
          trackScrollMilestone(75)
        } else if (maxScrollDepth >= 90) {
          trackScrollMilestone(90)
        }
      }
    }

    const trackScrollMilestone = (milestone) => {
      if (window.gtag) {
        window.gtag('event', 'scroll_depth', {
          event_category: 'SEO Engagement',
          event_label: `${milestone}%`,
          value: milestone,
          custom_map: {
            calculator_id: calculatorId || 'homepage'
          }
        })
      }
    }

    // Track visibility changes
    const handleVisibilityChange = () => {
      if (document.hidden) {
        isVisible = false
        trackTimeOnPage()
      } else {
        isVisible = true
        startTime = Date.now()
      }
    }

    // Set up event listeners
    window.addEventListener('scroll', trackScrollDepth, { passive: true })
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('beforeunload', trackTimeOnPage)

    // Cleanup
    return () => {
      window.removeEventListener('scroll', trackScrollDepth)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('beforeunload', trackTimeOnPage)
    }
  }

  const trackCalculatorMetrics = (calculatorId) => {
    // Track calculator-specific interactions
    const trackCalculatorInteraction = (action, details = {}) => {
      if (window.gtag) {
        window.gtag('event', 'calculator_interaction', {
          event_category: 'Calculator Usage',
          event_label: action,
          custom_map: {
            calculator_id: calculatorId,
            action_type: action,
            ...details
          }
        })
      }
    }

    // Track input changes
    const inputElements = document.querySelectorAll('input, select, textarea')
    inputElements.forEach(element => {
      element.addEventListener('change', () => {
        trackCalculatorInteraction('input_change', {
          field_name: element.name || element.id,
          field_type: element.type
        })
      })
    })

    // Track button clicks
    const buttonElements = document.querySelectorAll('button')
    buttonElements.forEach(button => {
      button.addEventListener('click', () => {
        trackCalculatorInteraction('button_click', {
          button_text: button.textContent?.trim().substring(0, 50)
        })
      })
    })
  }

  const setupPerformanceObserver = () => {
    // Monitor resource loading performance
    const resourceObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      
      entries.forEach(entry => {
        // Track slow resources that might affect SEO
        if (entry.duration > 1000) { // Resources taking more than 1 second
          if (window.gtag) {
            window.gtag('event', 'slow_resource', {
              event_category: 'SEO Performance',
              event_label: 'slow_loading_resource',
              value: Math.round(entry.duration),
              custom_map: {
                resource_name: entry.name,
                resource_type: entry.initiatorType,
                calculator_id: calculatorId || 'homepage'
              }
            })
          }
        }
      })
    })

    try {
      resourceObserver.observe({ entryTypes: ['resource'] })
    } catch (e) {
      console.log('Resource observer not supported')
    }

    // Monitor long tasks that might affect user experience
    const longTaskObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      
      entries.forEach(entry => {
        if (window.gtag) {
          window.gtag('event', 'long_task', {
            event_category: 'SEO Performance',
            event_label: 'javascript_long_task',
            value: Math.round(entry.duration),
            custom_map: {
              task_duration: entry.duration,
              calculator_id: calculatorId || 'homepage'
            }
          })
        }
      })
    })

    try {
      longTaskObserver.observe({ entryTypes: ['longtask'] })
    } catch (e) {
      console.log('Long task observer not supported')
    }
  }

  // Export performance data for debugging
  window.getPerformanceData = () => performanceDataRef.current

  return null
}

export default SEOPerformanceMonitor
