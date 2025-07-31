import { useState } from 'react'
import { Loader2 } from 'lucide-react'

/**
 * Common PDF Export Component
 *
 * A simplified wrapper around PDFExport that uses the corporate theme by default
 * and provides a consistent interface for all calculators.
 *
 * Usage:
 * <CommonPDFExport
 *   calculatorName="SIP Calculator"
 *   inputs={{ 'Monthly Investment': '₹10,000', ... }}
 *   results={{ 'Maturity Amount': '₹23,23,391', ... }}
 * />
 */
export default function CommonPDFExport({
  calculatorName,
  inputs = {},
  results = {},
  title,
  className,
  buttonText = "Export PDF Report",
  icon = "📄"
}) {
  const [isDownloading, setIsDownloading] = useState(false)

  // Auto-generate title if not provided
  const reportTitle = title || `${calculatorName} Analysis Report`

  // Enhanced export handler with notifications
  const handleExport = async () => {
    if (isDownloading) return

    setIsDownloading(true)
    const filename = `${calculatorName.replace(/\s+/g, '_')}_Report_${new Date().toISOString().split('T')[0]}.pdf`

    // Dispatch download start event
    window.dispatchEvent(new CustomEvent('downloadStart', {
      detail: { filename, type: 'PDF Report' }
    }))

    try {
      // Simulate progress updates
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('downloadProgress', {
          detail: { filename, progress: 25 }
        }))
      }, 300)

      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('downloadProgress', {
          detail: { filename, progress: 50 }
        }))
      }, 600)

      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('downloadProgress', {
          detail: { filename, progress: 75 }
        }))
      }, 900)

      // Import and execute PDF generation
      const html2pdf = (await import('html2pdf.js')).default

      // Generate PDF content using PDFExport logic
      const element = document.createElement('div')
      element.innerHTML = generatePDFContent()

      const opt = {
        margin: 0.5,
        filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      }

      await html2pdf().set(opt).from(element).save()

      // Dispatch completion event
      window.dispatchEvent(new CustomEvent('downloadComplete', {
        detail: { filename, type: 'PDF Report' }
      }))

    } catch (error) {
      console.error('PDF generation failed:', error)
      window.dispatchEvent(new CustomEvent('downloadError', {
        detail: { filename, error: error.message }
      }))
    } finally {
      setIsDownloading(false)
    }
  }

  // Generate PDF content (simplified version of PDFExport logic)
  const generatePDFContent = () => {
    const currentDate = new Date().toLocaleDateString()
    const currentTime = new Date().toLocaleTimeString()

    // Create data structure for PDF
    const pdfData = [{
      calculator: calculatorName,
      timestamp: new Date().toISOString(),
      inputs,
      results
    }]

    return `
      <div style="font-family: 'Times New Roman', serif; max-width: 800px; margin: 0 auto; padding: 30px; background: #ffffff; line-height: 1.6; color: #2c3e50;">
        <!-- Corporate Header -->
        <div style="text-align: center; margin-bottom: 20px; background: #34495e; color: white; padding: 30px; border-radius: 0; page-break-inside: avoid;">
          <div style="border: 3px solid #ecf0f1; padding: 30px; margin: 0 auto; max-width: 600px;">
            <h1 style="margin: 0; font-size: 36px; font-weight: bold; letter-spacing: 1px; font-family: 'Times New Roman', serif;">
              FINCLAMP
            </h1>
            <div style="width: 100px; height: 2px; background: #ecf0f1; margin: 15px auto;"></div>
            <p style="margin: 0; font-size: 14px; letter-spacing: 2px; text-transform: uppercase;">Financial Intelligence Platform</p>
            <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #7f8c8d;">
              <h2 style="margin: 0; font-size: 18px; font-weight: normal;">${reportTitle}</h2>
              <p style="margin: 10px 0 0 0; font-size: 12px; opacity: 0.9;">Report Generated: ${currentDate} at ${currentTime}</p>
            </div>
          </div>
        </div>

        <!-- Corporate Results -->
        <div style="margin-bottom: 20px;">
          ${pdfData.map((item, index) => `
            <div style="margin-bottom: 20px; border: 2px solid #bdc3c7; page-break-inside: avoid; ${index > 0 ? 'page-break-before: auto;' : ''}">
              <!-- Calculator Header -->
              <div style="background: #ecf0f1; padding: 20px; border-bottom: 2px solid #bdc3c7;">
                <h2 style="margin: 0; font-size: 22px; font-weight: bold; color: #2c3e50; text-transform: uppercase; letter-spacing: 1px;">${item.calculator}</h2>
                <p style="margin: 5px 0 0 0; font-size: 12px; color: #7f8c8d;">Analysis Date: ${new Date(item.timestamp).toLocaleDateString()} | Time: ${new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
              </div>

              <div style="padding: 20px;">
                ${item.inputs && Object.keys(item.inputs).length > 0 ? `
                  <!-- Corporate Inputs -->
                  <div style="margin-bottom: 20px; page-break-inside: avoid;">
                    <h3 style="margin: 0 0 20px 0; font-size: 16px; font-weight: bold; color: #2c3e50; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #34495e; padding-bottom: 10px;">Input Parameters</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                      ${Object.entries(item.inputs).map(([key, value]) => `
                        <tr style="border-bottom: 1px solid #ecf0f1;">
                          <td style="padding: 12px 0; color: #7f8c8d; font-weight: normal; width: 60%;">${key.replace(/([A-Z])/g, ' $1').replace(/^\w/, c => c.toUpperCase())}</td>
                          <td style="padding: 12px 0; color: #2c3e50; font-weight: bold; text-align: right;">${value}</td>
                        </tr>
                      `).join('')}
                    </table>
                  </div>
                ` : ''}

                ${item.results && Object.keys(item.results).length > 0 ? `
                  <!-- Corporate Results -->
                  <div style="page-break-inside: avoid;">
                    <h3 style="margin: 0 0 20px 0; font-size: 16px; font-weight: bold; color: #2c3e50; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #34495e; padding-bottom: 10px;">Calculation Results</h3>
                    <table style="width: 100%; border-collapse: collapse; background: #f8f9fa;">
                      ${Object.entries(item.results).map(([key, value], resultIndex) => `
                        <tr style="border-bottom: 1px solid #dee2e6; ${resultIndex === 0 ? 'background: #34495e; color: white;' : ''}">
                          <td style="padding: 15px; font-weight: ${resultIndex === 0 ? 'bold' : 'normal'}; font-size: ${resultIndex === 0 ? '16px' : '14px'}; width: 60%;">${key.replace(/([A-Z])/g, ' $1')}</td>
                          <td style="padding: 15px; font-weight: bold; font-size: ${resultIndex === 0 ? '18px' : '16px'}; text-align: right;">${value}</td>
                        </tr>
                      `).join('')}
                    </table>
                  </div>
                ` : ''}
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Corporate Footer -->
        <div style="text-align: center; background: #ecf0f1; padding: 30px; border: 2px solid #bdc3c7; page-break-inside: avoid;">
          <div style="margin-bottom: 20px;">
            <h3 style="margin: 0; font-size: 16px; font-weight: bold; color: #2c3e50; text-transform: uppercase; letter-spacing: 1px;">FINCLAMP.COM</h3>
            <p style="margin: 5px 0; font-size: 12px; color: #7f8c8d;">Professional Financial Analysis & Planning Services</p>
          </div>

          <div style="display: flex; justify-content: center; gap: 40px; margin: 20px 0; flex-wrap: wrap;">
            <div style="text-align: center;">
              <div style="font-weight: bold; color: #34495e;">ACCURATE</div>
              <div style="font-size: 10px; color: #7f8c8d;">Precise Calculations</div>
            </div>
            <div style="text-align: center;">
              <div style="font-weight: bold; color: #34495e;">RELIABLE</div>
              <div style="font-size: 10px; color: #7f8c8d;">Trusted Results</div>
            </div>
            <div style="text-align: center;">
              <div style="font-weight: bold; color: #34495e;">PROFESSIONAL</div>
              <div style="font-size: 10px; color: #7f8c8d;">Expert Analysis</div>
            </div>
          </div>

          <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #bdc3c7; font-size: 10px; color: #7f8c8d;">
            <p style="margin: 0;">This report is generated for informational purposes only. Please consult with a financial advisor for personalized advice.</p>
            <p style="margin: 5px 0 0 0;">© ${new Date().getFullYear()} FinClamp.com - All rights reserved</p>
          </div>
        </div>
      </div>
    `
  }

  return (
    <button
      onClick={handleExport}
      disabled={isDownloading}
      className={className || "bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"}
    >
      {isDownloading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Generating PDF...</span>
        </>
      ) : (
        <>
          <span className="text-lg">{icon}</span>
          <span>{buttonText}</span>
        </>
      )}
    </button>
  )
}

/**
 * Quick PDF Export - Even simpler version for basic use cases
 *
 * Usage:
 * <QuickPDFExport data={{ inputs: {...}, results: {...} }} calculatorName="EMI Calculator" />
 */
export function QuickPDFExport({ data, calculatorName }) {
  return (
    <CommonPDFExport
      calculatorName={calculatorName}
      inputs={data.inputs || {}}
      results={data.results || {}}
      buttonText="Download PDF"
      className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 text-sm"
    />
  )
}

/**
 * Compact PDF Export - For use in tight spaces
 *
 * Usage:
 * <CompactPDFExport inputs={inputs} results={results} calculatorName="Tax Calculator" />
 */
export function CompactPDFExport({ inputs, results, calculatorName }) {
  return (
    <CommonPDFExport
      calculatorName={calculatorName}
      inputs={inputs}
      results={results}
      buttonText="PDF"
      icon="📋"
      className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded font-medium transition-all duration-300 flex items-center space-x-1 text-xs"
    />
  )
}

/**
 * Premium PDF Export - For highlighted/featured use
 *
 * Usage:
 * <PremiumPDFExport inputs={inputs} results={results} calculatorName="Investment Calculator" />
 */
export function PremiumPDFExport({ inputs, results, calculatorName }) {
  return (
    <CommonPDFExport
      calculatorName={calculatorName}
      inputs={inputs}
      results={results}
      buttonText="Generate Professional Report"
      icon="⭐"
      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center space-x-3"
    />
  )
}