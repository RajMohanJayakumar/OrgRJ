import { useState } from 'react'
import CommonPDFExport from './CommonPDFExport'
import DownloadNotification from './DownloadNotification'

/**
 * PDF Content Test Component
 * This component helps verify the PDF content and props being passed
 */
export default function PDFContentTest() {
  const [showPreview, setShowPreview] = useState(false)

  // Sample comprehensive data for testing
  const testData = {
    calculatorName: "SIP Calculator",
    inputs: {
      'Monthly Investment': '₹10,000',
      'Target Maturity Amount': 'Not set',
      'Lump Sum Investment': 'None',
      'Annual Return Rate': '12% p.a.',
      'Investment Period': '10 years 0 months',
      'Step-up Percentage': '10% annually',
      'Step-up Type': 'Percentage increase',
      'Total Investment Period': '120 months',
      'Investment Mode': 'Amount-based SIP'
    },
    results: {
      'Maturity Amount': '₹23,23,391',
      'Total Investment': '₹16,50,000',
      'Total Returns': '₹6,73,391',
      'Return Percentage': '40.81%',
      'Absolute Gain': '₹6,73,391',
      'CAGR (Compound Annual Growth Rate)': '12.68%',
      'Monthly Return Rate': '1.00%',
      'Investment Multiple': '1.41x',
      'Average Monthly Investment': '₹13,750',
      'Final Monthly SIP': '₹25,937'
    }
  }

  const groceryTestData = {
    calculatorName: "Grocery Budget Calculator",
    inputs: {
      'Family Size - Adults': '2 adults',
      'Family Size - Children': '1 children',
      'Family Size - Infants': '0 infants',
      'Diet Type': 'Mixed (Veg + Non-Veg)',
      'Location': 'Metro Cities',
      'Organic Preference': '30% organic foods',
      'Eating Out Frequency': '3 times per week',
      'Bulk Buying': 'Yes',
      'Brand Preference': 'Mixed'
    },
    results: {
      'Weekly Budget': '₹2,500',
      'Monthly Budget': '₹10,800',
      'Yearly Budget': '₹1,29,600',
      'Per Person Daily': '₹120',
      'Grains & Staples': '₹2,700',
      'Vegetables & Fruits': '₹3,240',
      'Dairy Products': '₹1,620',
      'Protein Sources': '₹2,160',
      'Spices & Condiments': '₹540',
      'Snacks & Beverages': '₹540'
    }
  }

  // Generate preview HTML
  const generatePreviewHTML = (data) => {
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    
    const inputEntries = Object.entries(data.inputs)
    const resultEntries = Object.entries(data.results)
    const keyResults = resultEntries.slice(0, 3)

    return `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 800px; margin: 0 auto; background: white;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0 0 10px 0; font-size: 28px;">${data.calculatorName} Analysis Report</h1>
          <p style="margin: 0; font-size: 16px; opacity: 0.9;">Comprehensive Financial Analysis Report</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-left: 4px solid #667eea; margin: 20px;">
          <strong>Generated:</strong> ${currentDate} | <strong>Calculator:</strong> ${data.calculatorName}
        </div>
        
        ${keyResults.length > 0 ? `
        <div style="background: linear-gradient(135deg, #e8f5e8 0%, #f0f8f0 100%); border: 2px solid #28a745; border-radius: 12px; padding: 25px; margin: 20px;">
          <h3 style="color: #155724; margin: 0 0 15px 0;">⭐ Key Financial Insights</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
            ${keyResults.map(([key, value]) => `
              <div style="background: white; border: 1px solid #e9ecef; border-radius: 8px; padding: 15px; border-left: 4px solid #667eea;">
                <div style="font-weight: 600; color: #495057; font-size: 14px; margin-bottom: 5px;">${key}</div>
                <div style="color: #667eea; font-weight: 600; font-size: 18px;">${value}</div>
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}
        
        <div style="margin: 30px 20px;">
          <div style="background: linear-gradient(90deg, #667eea, #764ba2); color: white; padding: 15px 20px; margin: 0 0 20px 0; border-radius: 8px; font-size: 18px; font-weight: 600;">
            📊 Input Parameters
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">
            ${inputEntries.map(([key, value]) => `
              <div style="background: white; border: 1px solid #e9ecef; border-radius: 8px; padding: 15px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                <div style="font-weight: 600; color: #495057; font-size: 14px; margin-bottom: 5px;">${key}</div>
                <div style="color: #2c3e50; font-size: 16px; font-weight: 500;">${value}</div>
              </div>
            `).join('')}
          </div>
        </div>
        
        <div style="margin: 30px 20px;">
          <div style="background: linear-gradient(90deg, #667eea, #764ba2); color: white; padding: 15px 20px; margin: 0 0 20px 0; border-radius: 8px; font-size: 18px; font-weight: 600;">
            📈 Calculation Results
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">
            ${resultEntries.map(([key, value]) => `
              <div style="background: white; border: 1px solid #e9ecef; border-radius: 8px; padding: 15px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); border-left: 4px solid #667eea;">
                <div style="font-weight: 600; color: #495057; font-size: 14px; margin-bottom: 5px;">${key}</div>
                <div style="color: #667eea; font-weight: 600; font-size: 18px;">${value}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {/* Download Notifications */}
      <DownloadNotification />

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">PDF Content Verification</h1>
          <p className="text-gray-600">Test and verify PDF export content and formatting</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* SIP Calculator Test */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">SIP Calculator PDF Test</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Input Data ({Object.keys(testData.inputs).length} fields):</h3>
                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded max-h-32 overflow-y-auto">
                  {Object.entries(testData.inputs).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-1">
                      <span className="font-medium">{key}:</span>
                      <span>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Result Data ({Object.keys(testData.results).length} fields):</h3>
                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded max-h-32 overflow-y-auto">
                  {Object.entries(testData.results).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-1">
                      <span className="font-medium">{key}:</span>
                      <span>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <CommonPDFExport
                calculatorName={testData.calculatorName}
                inputs={testData.inputs}
                results={testData.results}
                buttonText="Test SIP PDF Export"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300"
              />
            </div>
          </div>

          {/* Grocery Calculator Test */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Grocery Budget Calculator PDF Test</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Input Data ({Object.keys(groceryTestData.inputs).length} fields):</h3>
                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded max-h-32 overflow-y-auto">
                  {Object.entries(groceryTestData.inputs).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-1">
                      <span className="font-medium">{key}:</span>
                      <span>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Result Data ({Object.keys(groceryTestData.results).length} fields):</h3>
                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded max-h-32 overflow-y-auto">
                  {Object.entries(groceryTestData.results).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-1">
                      <span className="font-medium">{key}:</span>
                      <span>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <CommonPDFExport
                calculatorName={groceryTestData.calculatorName}
                inputs={groceryTestData.inputs}
                results={groceryTestData.results}
                buttonText="Test Grocery PDF Export"
                className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300"
              />
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">PDF Content Preview</h2>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300"
            >
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </button>
          </div>
          
          {showPreview && (
            <div className="border rounded-lg overflow-hidden">
              <div 
                className="bg-gray-50 p-4 max-h-96 overflow-y-auto"
                dangerouslySetInnerHTML={{ __html: generatePreviewHTML(testData) }}
              />
            </div>
          )}
        </div>

        {/* Download Notification Demo */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Download Notifications Demo</h2>
          <p className="text-gray-600 mb-6">
            The PDF export now includes enhanced download notifications with spinner and progress tracking.
            Click any PDF export button above to see the notifications in action.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">✨ Features</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Animated spinner during PDF generation</li>
                <li>• Progress tracking with percentage</li>
                <li>• Success/error notifications</li>
                <li>• Auto-dismiss after completion</li>
                <li>• Non-blocking user experience</li>
              </ul>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">🎯 User Experience</h3>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Button shows spinner while processing</li>
                <li>• Toast notifications appear in top-right</li>
                <li>• Clear feedback on download status</li>
                <li>• Professional loading states</li>
                <li>• Prevents multiple simultaneous downloads</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Data Summary */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">PDF Content Summary</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{Object.keys(testData.inputs).length}</div>
              <div className="text-sm text-blue-800">Input Parameters</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{Object.keys(testData.results).length}</div>
              <div className="text-sm text-green-800">Result Fields</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">Professional</div>
              <div className="text-sm text-purple-800">PDF Styling</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
