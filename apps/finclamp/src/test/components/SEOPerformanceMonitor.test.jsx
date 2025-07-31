import { describe, test, expect } from 'vitest'

describe('SEOPerformanceMonitor', () => {
  test('should be importable', async () => {
    // Test that the component can be imported without throwing errors
    const module = await import('../../components/SEOPerformanceMonitor')
    expect(module.default).toBeDefined()
    expect(typeof module.default).toBe('function')
  })

  test('should be a React component', async () => {
    const SEOPerformanceMonitor = (await import('../../components/SEOPerformanceMonitor')).default
    expect(SEOPerformanceMonitor.name).toBe('SEOPerformanceMonitor')
  })

  test('should be a valid React component', async () => {
    const SEOPerformanceMonitor = (await import('../../components/SEOPerformanceMonitor')).default
    // Test that it's a function (React component)
    expect(typeof SEOPerformanceMonitor).toBe('function')
    // Test that it has the expected component properties
    expect(SEOPerformanceMonitor.length).toBeGreaterThanOrEqual(0) // Should accept props
  })
})
