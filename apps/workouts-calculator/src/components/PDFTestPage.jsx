import React from 'react'
import CommonPDFExport from './CommonPDFExport'

export default function PDFTestPage() {
  // Sample comprehensive data for testing
  const sampleData = [
    {
      calculator: 'Compound Interest Calculator',
      timestamp: new Date().toISOString(),
      inputs: {
        'Principal Amount': '₹1,00,000',
        'Interest Rate': '12% p.a.',
        'Time Period': '5 years',
        'Compounding Frequency': 'Monthly'
      },
      results: {
        'Final Amount': '₹1,81,669',
        'Compound Interest': '₹81,669',
        'Extra vs Simple Interest': '₹21,669',
        'Effective Annual Rate': '12.68%'
      }
    },
    {
      calculator: 'SIP Calculator',
      timestamp: new Date().toISOString(),
      inputs: {
        'Monthly Investment': '₹10,000',
        'Expected Annual Return': '12%',
        'Investment Period': '10 years',
        'Step Up': '10% annually'
      },
      results: {
        'Maturity Amount': '₹23,23,391',
        'Total Investment': '₹16,50,000',
        'Total Returns': '₹6,73,391',
        'Annualized Return': '12.5%',
        'XIRR': '12.8%'
      }
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Enhanced PDF Export Test
          </h1>
          <p className="text-xl text-gray-600">
            Click the button below to generate a sample PDF with enhanced design
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Sample Data Preview</h2>
          
          {sampleData.map((item, index) => (
            <div key={index} className="mb-8 p-6 bg-gray-50 rounded-xl">
              <h3 className="text-xl font-bold text-gray-800 mb-4">{item.calculator}</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-3">Inputs:</h4>
                  <div className="space-y-2">
                    {Object.entries(item.inputs).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-gray-600">{key}:</span>
                        <span className="font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-700 mb-3">Results:</h4>
                  <div className="space-y-2">
                    {Object.entries(item.results).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-gray-600">{key}:</span>
                        <span className="font-medium text-green-600">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="text-center mt-8">
            <CommonPDFExport
              calculatorName="Multi-Calculator Analysis"
              inputs={{
                'Report Type': 'Comprehensive Analysis',
                'Calculators Included': 'SIP, EMI, Tax',
                'Date Generated': new Date().toLocaleDateString()
              }}
              results={{
                'Total Calculations': '3',
                'Report Status': 'Complete',
                'Analysis Type': 'Multi-Calculator'
              }}
              title="Financial Calculator Analysis Report"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-3 mx-auto"
              buttonText="Generate Enhanced PDF Report"
              icon="📄"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-3xl mb-4">🎨</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Modern Design</h3>
            <p className="text-gray-600">Beautiful gradients, geometric patterns, and professional layouts.</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-3xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Rich Data Display</h3>
            <p className="text-gray-600">Enhanced visualization with highlighted key results and organized sections.</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-3xl mb-4">🔧</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Customizable</h3>
            <p className="text-gray-600">Flexible component that adapts to different calculator types.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
