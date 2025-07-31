import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest'

// Import the actual functions from pdfGenerator
import { generateVendorQuotationPDF, printPDF } from '../../utils/pdfGenerator'

describe('PDF Generator Utils', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    // Mock window.open for printPDF tests
    global.window = {
      open: vi.fn(() => ({
        document: {
          write: vi.fn(),
          close: vi.fn()
        },
        focus: vi.fn(),
        print: vi.fn()
      }))
    }
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('generateVendorQuotationPDF', () => {
    const mockQuotationDetails = {
      vendorName: 'Test Vendor',
      vendorEmail: 'test@vendor.com',
      vendorPhone: '1234567890',
      customerName: 'Test Client',
      customerEmail: 'client@test.com',
      taxRate: 18
    }

    const mockItems = [
      {
        name: 'Test Item 1',
        quantity: 2,
        unit: 'kg',
        price: 100,
        amount: 200
      },
      {
        name: 'Test Item 2',
        quantity: 1,
        unit: 'piece',
        price: 500,
        amount: 500
      }
    ]

    const mockResults = {
      subtotal: 700,
      taxAmount: 126,
      totalAmount: 826,
      itemCount: 2,
      totalQuantity: 3
    }

    const mockFormatCurrency = (amount) => {
      if (amount === undefined || amount === null) return '₹0'
      return `₹${amount.toLocaleString()}`
    }

    test('generates vendor quotation PDF HTML', () => {
      const htmlContent = generateVendorQuotationPDF(
        mockQuotationDetails,
        mockItems,
        mockResults,
        mockFormatCurrency
      )

      expect(htmlContent).toContain('<!DOCTYPE html>')
      expect(htmlContent).toContain('Test Vendor')
      expect(htmlContent).toContain('Test Client')
      expect(htmlContent).toContain('Test Item 1')
      expect(htmlContent).toContain('Test Item 2')
    })

    test('includes vendor details in PDF', () => {
      const htmlContent = generateVendorQuotationPDF(
        mockQuotationDetails,
        mockItems,
        mockResults,
        mockFormatCurrency
      )

      expect(htmlContent).toContain('Test Vendor')
      expect(htmlContent).toContain('Professional Services')
    })

    test('includes client details in PDF', () => {
      const htmlContent = generateVendorQuotationPDF(
        mockQuotationDetails,
        mockItems,
        mockResults,
        mockFormatCurrency
      )

      expect(htmlContent).toContain('Test Client')
    })

    test('includes item details with quantities and rates', () => {
      const htmlContent = generateVendorQuotationPDF(
        mockQuotationDetails,
        mockItems,
        mockResults,
        mockFormatCurrency
      )

      expect(htmlContent).toContain('2')
      expect(htmlContent).toContain('kg')
      expect(htmlContent).toContain('₹100')
      expect(htmlContent).toContain('₹200')
    })

    test('includes financial totals', () => {
      const htmlContent = generateVendorQuotationPDF(
        mockQuotationDetails,
        mockItems,
        mockResults,
        mockFormatCurrency
      )

      expect(htmlContent).toContain('₹700')
      expect(htmlContent).toContain('₹126')
      expect(htmlContent).toContain('₹826')
    })

    test('handles empty items array', () => {
      const htmlContent = generateVendorQuotationPDF(
        mockQuotationDetails,
        [],
        mockResults,
        mockFormatCurrency
      )

      expect(htmlContent).toContain('<!DOCTYPE html>')
      expect(htmlContent).toContain('Test Vendor')
    })

    test('handles missing vendor details gracefully', () => {
      const incompleteDetails = {
        vendorName: 'Test Vendor'
      }

      const htmlContent = generateVendorQuotationPDF(
        incompleteDetails,
        mockItems,
        mockResults,
        mockFormatCurrency
      )

      expect(htmlContent).toContain('Test Vendor')
      expect(htmlContent).toContain('<!DOCTYPE html>')
    })
  })

  describe('printPDF', () => {
    test('opens new window and prints HTML content', () => {
      const mockWindow = {
        document: {
          write: vi.fn(),
          close: vi.fn()
        },
        focus: vi.fn(),
        print: vi.fn()
      }

      global.window.open.mockReturnValue(mockWindow)

      const htmlContent = '<html><body>Test content</body></html>'
      printPDF(htmlContent)

      expect(global.window.open).toHaveBeenCalledWith('', '_blank')
      expect(mockWindow.document.write).toHaveBeenCalledWith(htmlContent)
      expect(mockWindow.document.close).toHaveBeenCalled()
      expect(mockWindow.focus).toHaveBeenCalled()
      expect(mockWindow.print).toHaveBeenCalled()
    })

    test('handles empty HTML content', () => {
      const mockWindow = {
        document: {
          write: vi.fn(),
          close: vi.fn()
        },
        focus: vi.fn(),
        print: vi.fn()
      }

      global.window.open.mockReturnValue(mockWindow)

      printPDF('')

      expect(mockWindow.document.write).toHaveBeenCalledWith('')
      expect(mockWindow.print).toHaveBeenCalled()
    })

    test('handles window.open failure gracefully', () => {
      global.window.open.mockReturnValue(null)

      expect(() => printPDF('<html></html>')).toThrow()
    })
  })

  describe('Edge Cases and Error Handling', () => {
    test('handles very large item lists', () => {
      const largeItemList = Array(100).fill().map((_, i) => ({
        name: `Item ${i + 1}`,
        quantity: 1,
        unit: 'piece',
        rate: 100,
        amount: 100
      }))

      const htmlContent = generateVendorQuotationPDF(
        { vendorName: 'Test Vendor' },
        largeItemList,
        { subtotal: 10000, tax: 1800, total: 11800 },
        (amount) => `₹${amount}`
      )

      expect(htmlContent).toContain('Item 1')
      expect(htmlContent).toContain('Item 100')
    })

    test('handles special characters in vendor/client names', () => {
      const specialCharDetails = {
        vendorName: 'Vendor & Co. Ltd.',
        customerName: 'Client "Special" <Company>'
      }

      const htmlContent = generateVendorQuotationPDF(
        specialCharDetails,
        [],
        { subtotal: 0, taxAmount: 0, totalAmount: 0 },
        (amount) => `₹${amount}`
      )

      expect(htmlContent).toContain('Vendor & Co. Ltd.')
      expect(htmlContent).toContain('Client "Special" <Company>')
    })

    test('handles zero amounts and quantities', () => {
      const zeroItems = [{
        name: 'Free Item',
        quantity: 0,
        unit: 'piece',
        price: 0,
        amount: 0
      }]

      const htmlContent = generateVendorQuotationPDF(
        { vendorName: 'Test Vendor' },
        zeroItems,
        { subtotal: 0, taxAmount: 0, totalAmount: 0 },
        (amount) => `₹${amount}`
      )

      expect(htmlContent).toContain('Free Item')
      expect(htmlContent).toContain('₹0')
    })

    test('handles missing formatCurrency function', () => {
      expect(() => {
        generateVendorQuotationPDF(
          { vendorName: 'Test Vendor' },
          [],
          { subtotal: 100, taxAmount: 18, totalAmount: 118 },
          null
        )
      }).toThrow()
    })

    test('includes current date and report ID', () => {
      const htmlContent = generateVendorQuotationPDF(
        { vendorName: 'Test Vendor' },
        [],
        { subtotal: 0, taxAmount: 0, totalAmount: 0 },
        (amount) => `₹${amount}`
      )

      const currentYear = new Date().getFullYear()
      expect(htmlContent).toContain(currentYear.toString())
      expect(htmlContent).toContain('VQ-')
    })

    test('includes proper HTML structure and styling', () => {
      const htmlContent = generateVendorQuotationPDF(
        { vendorName: 'Test Vendor' },
        [],
        { subtotal: 0, taxAmount: 0, totalAmount: 0 },
        (amount) => `₹${amount}`
      )

      expect(htmlContent).toContain('<html>')
      expect(htmlContent).toContain('<head>')
      expect(htmlContent).toContain('<style>')
      expect(htmlContent).toContain('font-family')
      expect(htmlContent).toContain('</html>')
    })
  })
})
