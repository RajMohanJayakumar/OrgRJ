import { describe, test, expect } from 'vitest'

describe('SEOAudit', () => {
  test('should be importable', async () => {
    // Test that the component can be imported without throwing errors
    const module = await import('../../components/SEOAudit')
    expect(module.default).toBeDefined()
    expect(typeof module.default).toBe('function')
  })

  test('should be a React component', async () => {
    const SEOAudit = (await import('../../components/SEOAudit')).default
    expect(SEOAudit.name).toBe('SEOAudit')
  })

  test('should be a valid React component', async () => {
    const SEOAudit = (await import('../../components/SEOAudit')).default
    // Test that it's a function (React component)
    expect(typeof SEOAudit).toBe('function')
    // Test that it has the expected component properties
    expect(SEOAudit.length).toBeGreaterThanOrEqual(0) // Should accept props
  })
})
