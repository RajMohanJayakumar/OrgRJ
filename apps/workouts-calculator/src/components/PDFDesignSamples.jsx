import { useState } from 'react'
import { motion } from 'framer-motion'

/**
 * PDF Design Samples Component
 * Shows different corporate PDF design options for selection
 */
export default function PDFDesignSamples() {
  const [selectedDesign, setSelectedDesign] = useState('original')

  // Sample data for all designs
  const sampleData = {
    calculatorName: "SIP Calculator",
    reportTitle: "SIP Calculator Analysis Report",
    inputs: {
      'Monthly Investment': '₹10,000',
      'Annual Return Rate': '12% p.a.',
      'Investment Period': '10 years',
      'Step-up Percentage': '10% annually'
    },
    results: {
      'Maturity Amount': '₹23,23,391',
      'Total Investment': '₹16,50,000',
      'Total Returns': '₹6,73,391',
      'CAGR': '12.68%'
    }
  }

  const designs = {
    // Premium Designs
    platinum: {
      name: "Platinum Executive",
      description: "Ultra-premium design with platinum accents and luxury typography",
      category: "Premium",
      preview: generatePlatinumDesign(sampleData)
    },
    royal: {
      name: "Royal Professional",
      description: "Sophisticated royal blue with gold foil effects and elegant borders",
      category: "Premium",
      preview: generateRoyalDesign(sampleData)
    },
    diamond: {
      name: "Diamond Elite",
      description: "Crystal-clear design with diamond-inspired geometric patterns",
      category: "Premium",
      preview: generateDiamondDesign(sampleData)
    },
    obsidian: {
      name: "Obsidian Premium",
      description: "Dark luxury theme with metallic accents and premium textures",
      category: "Premium",
      preview: generateObsidianDesign(sampleData)
    },
    emerald: {
      name: "Emerald Financial",
      description: "Sophisticated emerald theme with gold highlights for financial excellence",
      category: "Premium",
      preview: generateEmeraldDesign(sampleData)
    },
    sapphire: {
      name: "Sapphire Corporate",
      description: "Deep sapphire blue with silver accents and executive styling",
      category: "Premium",
      preview: generateSapphireDesign(sampleData)
    },

    // Simple Designs
    clean: {
      name: "Clean Professional",
      description: "Simple, clean design with minimal styling and clear typography",
      category: "Simple",
      preview: generateCleanDesign(sampleData)
    },
    minimal: {
      name: "Minimal Modern",
      description: "Ultra-minimal design with plenty of white space and subtle accents",
      category: "Simple",
      preview: generateMinimalDesign(sampleData)
    },
    classic: {
      name: "Classic Business",
      description: "Traditional business report style with simple borders and clean layout",
      category: "Simple",
      preview: generateClassicDesign(sampleData)
    },
    fresh: {
      name: "Fresh Simple",
      description: "Light and airy design with soft colors and modern typography",
      category: "Simple",
      preview: generateFreshDesign(sampleData)
    },
    basic: {
      name: "Basic Professional",
      description: "Straightforward design focused on readability and simplicity",
      category: "Simple",
      preview: generateBasicDesign(sampleData)
    },
    light: {
      name: "Light Corporate",
      description: "Clean corporate style with light colors and simple structure",
      category: "Simple",
      preview: generateLightDesign(sampleData)
    },

    // Original Design
    original: {
      name: "Original Modern",
      description: "The original sophisticated design with geometric patterns and gradients",
      category: "Original",
      preview: generateOriginalDesign(sampleData)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">PDF Design Collection</h1>
          <p className="text-xl text-gray-600">Choose from premium luxury designs or simple professional styles</p>
        </div>

        {/* Premium Designs Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">💎 Premium Luxury Designs</h2>
          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
            {Object.entries(designs).filter(([, design]) => design.category === 'Premium').map(([designKey, design]) => (
              <motion.div
                key={designKey}
                className={`bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300 ${
                  selectedDesign === designKey ? 'ring-4 ring-purple-500 shadow-2xl' : 'hover:shadow-xl'
                }`}
                onClick={() => setSelectedDesign(designKey)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">{design.name}</h3>
                    {selectedDesign === designKey && (
                      <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-600 mb-4 text-sm">{design.description}</p>

                  {/* Mini Preview */}
                  <div className="border rounded-lg overflow-hidden bg-gray-50">
                    <div
                      className="transform scale-50 origin-top-left w-[200%] h-48 overflow-hidden"
                      dangerouslySetInnerHTML={{ __html: design.preview }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Simple Designs Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">📄 Simple Professional Designs</h2>
          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
            {Object.entries(designs).filter(([, design]) => design.category === 'Simple').map(([designKey, design]) => (
              <motion.div
                key={designKey}
                className={`bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300 ${
                  selectedDesign === designKey ? 'ring-4 ring-blue-500 shadow-2xl' : 'hover:shadow-xl'
                }`}
                onClick={() => setSelectedDesign(designKey)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">{design.name}</h3>
                    {selectedDesign === designKey && (
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-600 mb-4 text-sm">{design.description}</p>

                  {/* Mini Preview */}
                  <div className="border rounded-lg overflow-hidden bg-gray-50">
                    <div
                      className="transform scale-50 origin-top-left w-[200%] h-48 overflow-hidden"
                      dangerouslySetInnerHTML={{ __html: design.preview }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Original Design Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">🎨 Original Design</h2>
          <div className="grid lg:grid-cols-1 xl:grid-cols-1 gap-6 mb-8">
            {Object.entries(designs).filter(([, design]) => design.category === 'Original').map(([designKey, design]) => (
              <motion.div
                key={designKey}
                className={`bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300 ${
                  selectedDesign === designKey ? 'ring-4 ring-green-500 shadow-2xl' : 'hover:shadow-xl'
                }`}
                onClick={() => setSelectedDesign(designKey)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">{design.name}</h3>
                    {selectedDesign === designKey && (
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-600 mb-4 text-sm">{design.description}</p>

                  {/* Mini Preview */}
                  <div className="border rounded-lg overflow-hidden bg-gray-50">
                    <div
                      className="transform scale-50 origin-top-left w-[200%] h-48 overflow-hidden"
                      dangerouslySetInnerHTML={{ __html: design.preview }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Full Preview */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Full Preview: {designs[selectedDesign]?.name || 'Design Preview'}
            </h2>
            <button
              onClick={() => {
                // This would implement the design selection
                alert(`Selected: ${designs[selectedDesign]?.name || selectedDesign}`)
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300"
            >
              Choose This Design
            </button>
          </div>
          
          <div className="border rounded-lg overflow-hidden bg-white max-h-96 overflow-y-auto">
            <div dangerouslySetInnerHTML={{ __html: designs[selectedDesign]?.preview || '<p>Design preview not available</p>' }} />
          </div>
        </div>

        {/* Design Summary */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Design Collection Summary</h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Premium Designs Summary */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-xl border border-purple-200">
              <h3 className="text-xl font-bold text-purple-900 mb-4">💎 Premium Luxury Collection</h3>
              <div className="space-y-3">
                {Object.entries(designs).filter(([, design]) => design.category === 'Premium').map(([designKey, design]) => (
                  <div key={designKey} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                    <span className="font-medium text-gray-900">{design.name}</span>
                    <span className="text-purple-600 text-sm">⭐⭐⭐⭐⭐</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-purple-700 mt-4">Perfect for executive reports, luxury brands, and premium presentations</p>
            </div>

            {/* Simple Designs Summary */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200">
              <h3 className="text-xl font-bold text-blue-900 mb-4">📄 Simple Professional Collection</h3>
              <div className="space-y-3">
                {Object.entries(designs).filter(([, design]) => design.category === 'Simple').map(([designKey, design]) => (
                  <div key={designKey} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                    <span className="font-medium text-gray-900">{design.name}</span>
                    <span className="text-blue-600 text-sm">⭐⭐⭐</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-blue-700 mt-4">Ideal for everyday reports, clean presentations, and professional documentation</p>
            </div>
          </div>

          <div className="mt-8 p-6 bg-gray-50 rounded-xl">
            <h4 className="text-lg font-bold text-gray-900 mb-4">📊 Quick Comparison</h4>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-purple-600">{Object.values(designs).filter(d => d.category === 'Premium').length}</div>
                <div className="text-sm text-gray-600">Premium Designs</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{Object.values(designs).filter(d => d.category === 'Simple').length}</div>
                <div className="text-sm text-gray-600">Simple Designs</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{Object.keys(designs).length}</div>
                <div className="text-sm text-gray-600">Total Options</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Premium Design Generators
function generatePlatinumDesign(data) {
  return `
    <div style="font-family: 'Playfair Display', serif; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); padding: 0; min-height: 700px; position: relative;">
      <!-- Platinum Header with Luxury Styling -->
      <div style="background: linear-gradient(135deg, #434343 0%, #000000 100%); color: #e8e8e8; padding: 50px 40px; position: relative; overflow: hidden;">
        <div style="position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, #c0c0c0, #e8e8e8, #c0c0c0);"></div>
        <div style="position: absolute; top: 20px; right: 40px; background: rgba(192,192,192,0.2); padding: 8px 16px; border-radius: 20px; font-size: 11px; letter-spacing: 1px; border: 1px solid rgba(192,192,192,0.3);">
          PLATINUM EXECUTIVE REPORT
        </div>
        <div style="text-align: center; position: relative; z-index: 2;">
          <h1 style="margin: 0; font-size: 36px; font-weight: 400; letter-spacing: 2px; color: #e8e8e8; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">${data.reportTitle}</h1>
          <div style="width: 120px; height: 2px; background: linear-gradient(90deg, transparent, #c0c0c0, transparent); margin: 20px auto;"></div>
          <p style="margin: 0; font-size: 16px; opacity: 0.9; letter-spacing: 1px; font-family: 'Arial', sans-serif;">PREMIUM FINANCIAL ANALYSIS</p>
        </div>
        <div style="position: absolute; bottom: 15px; left: 40px; font-size: 12px; opacity: 0.7; font-family: 'Arial', sans-serif;">
          Report ID: PL-${Date.now().toString().slice(-6)} | ${new Date().toLocaleDateString()}
        </div>
      </div>

      <!-- Executive Summary Section -->
      <div style="padding: 40px; background: rgba(255,255,255,0.95); margin: 30px 40px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); border: 1px solid rgba(192,192,192,0.2);">
        <div style="text-align: center; margin-bottom: 30px;">
          <h2 style="margin: 0; font-size: 24px; color: #2c3e50; font-weight: 300; letter-spacing: 1px;">EXECUTIVE SUMMARY</h2>
          <div style="width: 80px; height: 1px; background: #c0c0c0; margin: 15px auto;"></div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px;">
          <!-- Investment Parameters -->
          <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); padding: 30px; border-radius: 12px; border: 1px solid #c0c0c0; position: relative;">
            <div style="position: absolute; top: -10px; left: 30px; background: #434343; color: #e8e8e8; padding: 5px 15px; border-radius: 15px; font-size: 12px; letter-spacing: 1px;">
              PARAMETERS
            </div>
            <div style="margin-top: 10px;">
              ${Object.entries(data.inputs).map(([key, value]) => `
                <div style="margin: 15px 0; padding: 15px; background: rgba(255,255,255,0.8); border-radius: 8px; border-left: 3px solid #c0c0c0; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                  <div style="color: #6c757d; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px; font-family: 'Arial', sans-serif;">${key}</div>
                  <div style="color: #2c3e50; font-size: 16px; font-weight: 600; font-family: 'Playfair Display', serif;">${value}</div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Financial Results -->
          <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 30px; border-radius: 12px; border: 1px solid #c0c0c0; position: relative; color: #e8e8e8;">
            <div style="position: absolute; top: -10px; left: 30px; background: #c0c0c0; color: #1a1a1a; padding: 5px 15px; border-radius: 15px; font-size: 12px; letter-spacing: 1px; font-weight: 600;">
              RESULTS
            </div>
            <div style="margin-top: 10px;">
              ${Object.entries(data.results).map(([key, value]) => `
                <div style="margin: 15px 0; padding: 15px; background: rgba(192,192,192,0.1); border-radius: 8px; border-left: 3px solid #c0c0c0; backdrop-filter: blur(10px);">
                  <div style="color: #c0c0c0; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px; font-family: 'Arial', sans-serif;">${key}</div>
                  <div style="color: #e8e8e8; font-size: 18px; font-weight: 700; font-family: 'Playfair Display', serif;">${value}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>

      <!-- Premium Footer -->
      <div style="background: #2c3e50; color: #c0c0c0; padding: 25px 40px; margin-top: 30px; text-align: center; font-family: 'Arial', sans-serif;">
        <div style="font-size: 11px; margin-bottom: 8px; opacity: 0.8;">
          <strong>CONFIDENTIAL FINANCIAL ANALYSIS</strong> | This report contains proprietary financial calculations and projections.
        </div>
        <div style="font-size: 10px; opacity: 0.6; letter-spacing: 0.5px;">
          Generated by FinClamp Platinum Suite | Premium Financial Analytics | www.finclamp.com
        </div>
      </div>
    </div>
  `
}

function generateRoyalDesign(data) {
  return `
    <div style="font-family: 'Times New Roman', serif; background: #0f1419; color: #d4af37; padding: 0; min-height: 700px; position: relative;">
      <!-- Royal Header with Crown Design -->
      <div style="background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #2563eb 100%); color: #d4af37; padding: 60px 40px; position: relative; overflow: hidden;">
        <div style="position: absolute; top: 0; left: 0; right: 0; height: 6px; background: linear-gradient(90deg, #d4af37, #ffd700, #d4af37);"></div>
        <div style="position: absolute; top: 20px; right: 40px; background: rgba(212,175,55,0.2); padding: 10px 20px; border-radius: 25px; font-size: 12px; letter-spacing: 2px; border: 2px solid #d4af37; font-weight: 700;">
          👑 ROYAL EXECUTIVE EDITION
        </div>

        <!-- Decorative Royal Elements -->
        <div style="position: absolute; top: 30px; left: 40px; width: 60px; height: 60px; border: 2px solid #d4af37; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: rgba(212,175,55,0.1);">
          <span style="font-size: 24px;">👑</span>
        </div>

        <div style="text-align: center; position: relative; z-index: 2; margin-top: 20px;">
          <h1 style="margin: 0; font-size: 42px; font-weight: 700; letter-spacing: 3px; color: #d4af37; text-shadow: 0 3px 6px rgba(0,0,0,0.7); font-family: 'Times New Roman', serif;">${data.reportTitle}</h1>
          <div style="display: flex; align-items: center; justify-content: center; margin: 25px 0;">
            <div style="width: 40px; height: 2px; background: #d4af37;"></div>
            <span style="margin: 0 15px; font-size: 20px;">♦</span>
            <div style="width: 40px; height: 2px; background: #d4af37;"></div>
          </div>
          <p style="margin: 0; font-size: 18px; opacity: 0.95; letter-spacing: 2px; font-style: italic;">ROYAL FINANCIAL ANALYSIS</p>
        </div>
      </div>

      <!-- Royal Content Section -->
      <div style="padding: 50px 40px; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);">
        <div style="background: rgba(212,175,55,0.05); border: 2px solid #d4af37; border-radius: 20px; padding: 40px; backdrop-filter: blur(10px);">
          <div style="text-align: center; margin-bottom: 40px;">
            <h2 style="margin: 0; font-size: 28px; color: #d4af37; font-weight: 400; letter-spacing: 2px;">ROYAL PORTFOLIO ANALYSIS</h2>
            <div style="width: 100px; height: 2px; background: #d4af37; margin: 20px auto;"></div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 50px;">
            <!-- Investment Parameters -->
            <div style="background: linear-gradient(135deg, #2d1b69 0%, #1e3a8a 100%); padding: 35px; border-radius: 15px; border: 1px solid #d4af37; position: relative;">
              <div style="position: absolute; top: -15px; left: 35px; background: #d4af37; color: #1e3a8a; padding: 8px 20px; border-radius: 20px; font-size: 14px; letter-spacing: 1px; font-weight: 700;">
                ⚜️ ROYAL PARAMETERS
              </div>
              <div style="margin-top: 20px;">
                ${Object.entries(data.inputs).map(([key, value]) => `
                  <div style="margin: 20px 0; padding: 20px; background: rgba(212,175,55,0.1); border-radius: 10px; border: 1px solid rgba(212,175,55,0.3);">
                    <div style="color: #d4af37; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">${key}</div>
                    <div style="color: #ffffff; font-size: 18px; font-weight: 700;">${value}</div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Royal Results -->
            <div style="background: linear-gradient(135deg, #0f1419 0%, #1a1a2e 100%); padding: 35px; border-radius: 15px; border: 2px solid #d4af37; position: relative;">
              <div style="position: absolute; top: -15px; left: 35px; background: #d4af37; color: #0f1419; padding: 8px 20px; border-radius: 20px; font-size: 14px; letter-spacing: 1px; font-weight: 700;">
                💎 ROYAL RESULTS
              </div>
              <div style="margin-top: 20px;">
                ${Object.entries(data.results).map(([key, value]) => `
                  <div style="margin: 20px 0; padding: 20px; background: linear-gradient(135deg, rgba(212,175,55,0.15), rgba(255,215,0,0.1)); border-radius: 10px; border: 1px solid #d4af37; box-shadow: 0 4px 15px rgba(212,175,55,0.2);">
                    <div style="color: #d4af37; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">${key}</div>
                    <div style="color: #ffd700; font-size: 20px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">${value}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Royal Footer -->
      <div style="background: linear-gradient(135deg, #1e3a8a 0%, #0f1419 100%); color: #d4af37; padding: 30px 40px; text-align: center; border-top: 3px solid #d4af37;">
        <div style="font-size: 12px; margin-bottom: 10px; letter-spacing: 1px;">
          <strong>👑 ROYAL CONFIDENTIAL FINANCIAL ANALYSIS 👑</strong>
        </div>
        <div style="font-size: 11px; opacity: 0.8; letter-spacing: 0.5px;">
          Generated by FinClamp Royal Suite | Exclusively for Distinguished Clients | www.finclamp.com
        </div>
      </div>
    </div>
  `
}

function generateDiamondDesign(data) {
  return `
    <div style="font-family: 'Helvetica Neue', sans-serif; background: linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 100%); padding: 0; min-height: 700px; position: relative;">
      <!-- Diamond Header -->
      <div style="background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%); color: #1e293b; padding: 50px 40px; position: relative; border-bottom: 3px solid #e2e8f0;">
        <div style="position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, transparent, #3b82f6, transparent);"></div>

        <!-- Diamond Pattern Background -->
        <div style="position: absolute; top: 20px; right: 40px; width: 80px; height: 80px; background: linear-gradient(45deg, #e2e8f0 25%, transparent 25%), linear-gradient(-45deg, #e2e8f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e2e8f0 75%), linear-gradient(-45deg, transparent 75%, #e2e8f0 75%); background-size: 20px 20px; opacity: 0.3; border-radius: 50%;"></div>

        <div style="text-align: center; position: relative; z-index: 2;">
          <div style="display: inline-block; padding: 8px 20px; background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; border-radius: 25px; font-size: 12px; letter-spacing: 2px; margin-bottom: 20px; font-weight: 600;">
            💎 DIAMOND ELITE REPORT
          </div>
          <h1 style="margin: 0; font-size: 38px; font-weight: 300; letter-spacing: 1px; color: #1e293b; line-height: 1.2;">${data.reportTitle}</h1>
          <div style="display: flex; align-items: center; justify-content: center; margin: 25px 0;">
            <div style="width: 30px; height: 1px; background: #3b82f6;"></div>
            <div style="margin: 0 15px; width: 8px; height: 8px; background: #3b82f6; transform: rotate(45deg);"></div>
            <div style="width: 30px; height: 1px; background: #3b82f6;"></div>
          </div>
          <p style="margin: 0; font-size: 16px; color: #64748b; letter-spacing: 1px; font-weight: 300;">CRYSTAL CLEAR FINANCIAL ANALYSIS</p>
        </div>
      </div>

      <!-- Diamond Content Grid -->
      <div style="padding: 50px 40px;">
        <div style="background: rgba(255,255,255,0.9); border-radius: 20px; padding: 40px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); backdrop-filter: blur(10px); border: 1px solid rgba(59,130,246,0.1);">

          <!-- Geometric Header -->
          <div style="text-align: center; margin-bottom: 40px;">
            <div style="display: inline-block; position: relative;">
              <h2 style="margin: 0; font-size: 26px; color: #1e293b; font-weight: 300; letter-spacing: 2px;">PORTFOLIO CRYSTALLIZATION</h2>
              <div style="position: absolute; bottom: -10px; left: 50%; transform: translateX(-50%); width: 60px; height: 2px; background: linear-gradient(90deg, transparent, #3b82f6, transparent);"></div>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px;">
            <!-- Input Parameters with Diamond Pattern -->
            <div style="position: relative;">
              <div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); padding: 35px; border-radius: 15px; border: 1px solid #e2e8f0; position: relative; overflow: hidden;">
                <div style="position: absolute; top: -15px; left: 35px; background: #3b82f6; color: white; padding: 8px 20px; border-radius: 20px; font-size: 13px; letter-spacing: 1px; font-weight: 600;">
                  ◆ PARAMETERS
                </div>

                <!-- Geometric Pattern -->
                <div style="position: absolute; top: 20px; right: 20px; width: 40px; height: 40px; background: linear-gradient(45deg, #e2e8f0 25%, transparent 25%), linear-gradient(-45deg, #e2e8f0 25%, transparent 25%); background-size: 8px 8px; opacity: 0.3; border-radius: 8px;"></div>

                <div style="margin-top: 20px;">
                  ${Object.entries(data.inputs).map(([key, value]) => `
                    <div style="margin: 18px 0; padding: 18px; background: rgba(255,255,255,0.8); border-radius: 12px; border-left: 4px solid #3b82f6; box-shadow: 0 4px 12px rgba(0,0,0,0.05); position: relative;">
                      <div style="position: absolute; top: 8px; right: 12px; width: 6px; height: 6px; background: #3b82f6; transform: rotate(45deg); opacity: 0.6;"></div>
                      <div style="color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">${key}</div>
                      <div style="color: #1e293b; font-size: 16px; font-weight: 600;">${value}</div>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>

            <!-- Results with Crystal Effect -->
            <div style="position: relative;">
              <div style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); padding: 35px; border-radius: 15px; border: 1px solid #3b82f6; position: relative; overflow: hidden;">
                <div style="position: absolute; top: -15px; left: 35px; background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 8px 20px; border-radius: 20px; font-size: 13px; letter-spacing: 1px; font-weight: 600;">
                  💎 RESULTS
                </div>

                <!-- Crystal Pattern -->
                <div style="position: absolute; top: 0; right: 0; width: 100px; height: 100px; background: radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%); border-radius: 50%;"></div>

                <div style="margin-top: 20px;">
                  ${Object.entries(data.results).map(([key, value]) => `
                    <div style="margin: 18px 0; padding: 18px; background: rgba(59,130,246,0.1); border-radius: 12px; border-left: 4px solid #3b82f6; backdrop-filter: blur(5px); position: relative;">
                      <div style="position: absolute; top: 8px; right: 12px; width: 8px; height: 8px; background: #3b82f6; clip-path: polygon(50% 0%, 0% 100%, 100% 100%); opacity: 0.8;"></div>
                      <div style="color: #94a3b8; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">${key}</div>
                      <div style="color: #e2e8f0; font-size: 18px; font-weight: 700;">${value}</div>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Diamond Footer -->
      <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); color: #94a3b8; padding: 30px 40px; text-align: center;">
        <div style="font-size: 12px; margin-bottom: 8px; letter-spacing: 1px;">
          <strong>💎 DIAMOND ELITE FINANCIAL ANALYSIS 💎</strong>
        </div>
        <div style="font-size: 10px; opacity: 0.7; letter-spacing: 0.5px;">
          Generated by FinClamp Diamond Suite | Crystal Clear Financial Intelligence | www.finclamp.com
        </div>
      </div>
    </div>
  `
}

function generateObsidianDesign(data) {
  return `
    <div style="font-family: 'SF Pro Display', sans-serif; background: #000000; color: #ffffff; padding: 0; min-height: 700px; position: relative;">
      <!-- Obsidian Header -->
      <div style="background: linear-gradient(135deg, #1a1a1a 0%, #000000 100%); color: #ffffff; padding: 60px 40px; position: relative; overflow: hidden;">
        <div style="position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffeaa7);"></div>

        <!-- Metallic Accent -->
        <div style="position: absolute; top: 20px; right: 40px; background: linear-gradient(135deg, #2c2c2c, #1a1a1a); padding: 12px 24px; border-radius: 30px; font-size: 11px; letter-spacing: 2px; border: 1px solid #333333; color: #cccccc; font-weight: 700;">
          ⚫ OBSIDIAN PREMIUM
        </div>

        <div style="text-align: center; position: relative; z-index: 2;">
          <h1 style="margin: 0; font-size: 44px; font-weight: 700; letter-spacing: 2px; color: #ffffff; text-shadow: 0 4px 8px rgba(0,0,0,0.8); background: linear-gradient(135deg, #ffffff, #cccccc); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${data.reportTitle}</h1>
          <div style="margin: 30px 0; display: flex; align-items: center; justify-content: center;">
            <div style="width: 50px; height: 2px; background: linear-gradient(90deg, transparent, #4ecdc4);"></div>
            <div style="margin: 0 20px; width: 12px; height: 12px; background: #4ecdc4; border-radius: 50%; box-shadow: 0 0 20px #4ecdc4;"></div>
            <div style="width: 50px; height: 2px; background: linear-gradient(90deg, #4ecdc4, transparent);"></div>
          </div>
          <p style="margin: 0; font-size: 18px; color: #cccccc; letter-spacing: 2px; font-weight: 300;">OBSIDIAN LUXURY ANALYTICS</p>
        </div>
      </div>

      <!-- Dark Luxury Content -->
      <div style="padding: 50px 40px; background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);">
        <div style="background: rgba(255,255,255,0.02); border: 1px solid #333333; border-radius: 25px; padding: 45px; backdrop-filter: blur(20px);">

          <div style="text-align: center; margin-bottom: 45px;">
            <h2 style="margin: 0; font-size: 30px; color: #ffffff; font-weight: 300; letter-spacing: 3px;">PREMIUM PORTFOLIO ANALYSIS</h2>
            <div style="width: 120px; height: 2px; background: linear-gradient(90deg, transparent, #4ecdc4, transparent); margin: 25px auto;"></div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 50px;">
            <!-- Obsidian Parameters -->
            <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2c2c2c 100%); padding: 40px; border-radius: 20px; border: 1px solid #4ecdc4; position: relative; box-shadow: 0 10px 30px rgba(78,205,196,0.1);">
              <div style="position: absolute; top: -18px; left: 40px; background: linear-gradient(135deg, #4ecdc4, #45b7d1); color: #000000; padding: 10px 25px; border-radius: 25px; font-size: 14px; letter-spacing: 1px; font-weight: 700;">
                ⚫ PARAMETERS
              </div>

              <div style="margin-top: 25px;">
                ${Object.entries(data.inputs).map(([key, value]) => `
                  <div style="margin: 22px 0; padding: 22px; background: rgba(78,205,196,0.05); border-radius: 15px; border: 1px solid rgba(78,205,196,0.2); position: relative; backdrop-filter: blur(10px);">
                    <div style="position: absolute; top: 10px; right: 15px; width: 8px; height: 8px; background: #4ecdc4; border-radius: 50%; box-shadow: 0 0 10px #4ecdc4;"></div>
                    <div style="color: #4ecdc4; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">${key}</div>
                    <div style="color: #ffffff; font-size: 17px; font-weight: 600;">${value}</div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Obsidian Results -->
            <div style="background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%); padding: 40px; border-radius: 20px; border: 2px solid #ff6b6b; position: relative; box-shadow: 0 10px 30px rgba(255,107,107,0.2);">
              <div style="position: absolute; top: -18px; left: 40px; background: linear-gradient(135deg, #ff6b6b, #ff5252); color: #ffffff; padding: 10px 25px; border-radius: 25px; font-size: 14px; letter-spacing: 1px; font-weight: 700;">
                💎 RESULTS
              </div>

              <div style="margin-top: 25px;">
                ${Object.entries(data.results).map(([key, value]) => `
                  <div style="margin: 22px 0; padding: 22px; background: linear-gradient(135deg, rgba(255,107,107,0.1), rgba(255,82,82,0.05)); border-radius: 15px; border: 1px solid #ff6b6b; box-shadow: 0 5px 20px rgba(255,107,107,0.1); position: relative;">
                    <div style="position: absolute; top: 10px; right: 15px; width: 10px; height: 10px; background: #ff6b6b; clip-path: polygon(50% 0%, 0% 100%, 100% 100%); box-shadow: 0 0 15px #ff6b6b;"></div>
                    <div style="color: #ff6b6b; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">${key}</div>
                    <div style="color: #ffffff; font-size: 19px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">${value}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Obsidian Footer -->
      <div style="background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%); color: #cccccc; padding: 35px 40px; text-align: center; border-top: 2px solid #333333;">
        <div style="font-size: 13px; margin-bottom: 10px; letter-spacing: 1px;">
          <strong>⚫ OBSIDIAN PREMIUM FINANCIAL ANALYSIS ⚫</strong>
        </div>
        <div style="font-size: 11px; opacity: 0.7; letter-spacing: 0.5px;">
          Generated by FinClamp Obsidian Suite | Dark Luxury Financial Intelligence | www.finclamp.com
        </div>
      </div>
    </div>
  `
}

function generateEmeraldDesign(data) {
  return `
    <div style="font-family: 'Georgia', serif; background: linear-gradient(135deg, #064e3b 0%, #065f46 100%); color: #ffffff; padding: 0; min-height: 700px; position: relative;">
      <!-- Emerald Header -->
      <div style="background: linear-gradient(135deg, #059669 0%, #047857 100%); color: #ffffff; padding: 55px 40px; position: relative; overflow: hidden;">
        <div style="position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, #d4af37, #ffd700, #d4af37);"></div>

        <div style="position: absolute; top: 25px; right: 40px; background: rgba(212,175,55,0.2); padding: 10px 20px; border-radius: 25px; font-size: 12px; letter-spacing: 2px; border: 2px solid #d4af37; color: #d4af37; font-weight: 700;">
          💚 EMERALD FINANCIAL
        </div>

        <div style="text-align: center; position: relative; z-index: 2;">
          <h1 style="margin: 0; font-size: 40px; font-weight: 700; letter-spacing: 2px; color: #ffffff; text-shadow: 0 3px 6px rgba(0,0,0,0.5);">${data.reportTitle}</h1>
          <div style="margin: 25px 0; display: flex; align-items: center; justify-content: center;">
            <div style="width: 40px; height: 2px; background: #d4af37;"></div>
            <div style="margin: 0 15px; width: 12px; height: 12px; background: #d4af37; transform: rotate(45deg); box-shadow: 0 0 15px #d4af37;"></div>
            <div style="width: 40px; height: 2px; background: #d4af37;"></div>
          </div>
          <p style="margin: 0; font-size: 18px; color: #d4af37; letter-spacing: 2px; font-weight: 400; font-style: italic;">EMERALD FINANCIAL EXCELLENCE</p>
        </div>
      </div>

      <!-- Emerald Content -->
      <div style="padding: 50px 40px; background: linear-gradient(135deg, #022c22 0%, #064e3b 100%);">
        <div style="background: rgba(5,150,105,0.1); border: 2px solid #059669; border-radius: 20px; padding: 45px; backdrop-filter: blur(15px);">

          <div style="text-align: center; margin-bottom: 40px;">
            <h2 style="margin: 0; font-size: 28px; color: #d4af37; font-weight: 400; letter-spacing: 2px;">EMERALD WEALTH ANALYSIS</h2>
            <div style="width: 100px; height: 2px; background: #d4af37; margin: 20px auto;"></div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 45px;">
            <!-- Emerald Parameters -->
            <div style="background: linear-gradient(135deg, #065f46 0%, #047857 100%); padding: 35px; border-radius: 18px; border: 1px solid #d4af37; position: relative;">
              <div style="position: absolute; top: -15px; left: 35px; background: #d4af37; color: #064e3b; padding: 8px 20px; border-radius: 20px; font-size: 14px; letter-spacing: 1px; font-weight: 700;">
                💚 INVESTMENT PARAMETERS
              </div>

              <div style="margin-top: 20px;">
                ${Object.entries(data.inputs).map(([key, value]) => `
                  <div style="margin: 20px 0; padding: 20px; background: rgba(212,175,55,0.1); border-radius: 12px; border-left: 4px solid #d4af37;">
                    <div style="color: #d4af37; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">${key}</div>
                    <div style="color: #ffffff; font-size: 17px; font-weight: 600;">${value}</div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Emerald Results -->
            <div style="background: linear-gradient(135deg, #022c22 0%, #064e3b 100%); padding: 35px; border-radius: 18px; border: 2px solid #059669; position: relative;">
              <div style="position: absolute; top: -15px; left: 35px; background: linear-gradient(135deg, #059669, #047857); color: #ffffff; padding: 8px 20px; border-radius: 20px; font-size: 14px; letter-spacing: 1px; font-weight: 700;">
                💎 WEALTH RESULTS
              </div>

              <div style="margin-top: 20px;">
                ${Object.entries(data.results).map(([key, value]) => `
                  <div style="margin: 20px 0; padding: 20px; background: linear-gradient(135deg, rgba(5,150,105,0.2), rgba(4,120,87,0.1)); border-radius: 12px; border: 1px solid #059669; box-shadow: 0 4px 15px rgba(5,150,105,0.2);">
                    <div style="color: #059669; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">${key}</div>
                    <div style="color: #d4af37; font-size: 19px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">${value}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Emerald Footer -->
      <div style="background: linear-gradient(135deg, #064e3b 0%, #022c22 100%); color: #d4af37; padding: 30px 40px; text-align: center; border-top: 3px solid #059669;">
        <div style="font-size: 12px; margin-bottom: 10px; letter-spacing: 1px;">
          <strong>💚 EMERALD FINANCIAL EXCELLENCE 💚</strong>
        </div>
        <div style="font-size: 11px; opacity: 0.8; letter-spacing: 0.5px;">
          Generated by FinClamp Emerald Suite | Premium Financial Intelligence | www.finclamp.com
        </div>
      </div>
    </div>
  `
}

function generateSapphireDesign(data) {
  return `
    <div style="font-family: 'Avenir', sans-serif; background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%); color: #ffffff; padding: 0; min-height: 700px; position: relative;">
      <!-- Sapphire Header -->
      <div style="background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%); color: #ffffff; padding: 55px 40px; position: relative; overflow: hidden;">
        <div style="position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, #c0c0c0, #e5e7eb, #c0c0c0);"></div>

        <div style="position: absolute; top: 25px; right: 40px; background: rgba(192,192,192,0.2); padding: 10px 20px; border-radius: 25px; font-size: 12px; letter-spacing: 2px; border: 2px solid #c0c0c0; color: #c0c0c0; font-weight: 700;">
          💙 SAPPHIRE CORPORATE
        </div>

        <div style="text-align: center; position: relative; z-index: 2;">
          <h1 style="margin: 0; font-size: 40px; font-weight: 600; letter-spacing: 2px; color: #ffffff; text-shadow: 0 3px 6px rgba(0,0,0,0.4);">${data.reportTitle}</h1>
          <div style="margin: 25px 0; display: flex; align-items: center; justify-content: center;">
            <div style="width: 40px; height: 2px; background: #c0c0c0;"></div>
            <div style="margin: 0 15px; width: 10px; height: 10px; background: #c0c0c0; border-radius: 50%; box-shadow: 0 0 15px #c0c0c0;"></div>
            <div style="width: 40px; height: 2px; background: #c0c0c0;"></div>
          </div>
          <p style="margin: 0; font-size: 18px; color: #c0c0c0; letter-spacing: 2px; font-weight: 300;">SAPPHIRE CORPORATE EXCELLENCE</p>
        </div>
      </div>

      <!-- Sapphire Content -->
      <div style="padding: 50px 40px; background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);">
        <div style="background: rgba(37,99,235,0.1); border: 2px solid #2563eb; border-radius: 20px; padding: 45px; backdrop-filter: blur(15px);">

          <div style="text-align: center; margin-bottom: 40px;">
            <h2 style="margin: 0; font-size: 28px; color: #c0c0c0; font-weight: 400; letter-spacing: 2px;">SAPPHIRE PORTFOLIO ANALYSIS</h2>
            <div style="width: 100px; height: 2px; background: #c0c0c0; margin: 20px auto;"></div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 45px;">
            <!-- Sapphire Parameters -->
            <div style="background: linear-gradient(135deg, #1e40af 0%, #2563eb 100%); padding: 35px; border-radius: 18px; border: 1px solid #c0c0c0; position: relative;">
              <div style="position: absolute; top: -15px; left: 35px; background: #c0c0c0; color: #1e3a8a; padding: 8px 20px; border-radius: 20px; font-size: 14px; letter-spacing: 1px; font-weight: 700;">
                💙 CORPORATE PARAMETERS
              </div>

              <div style="margin-top: 20px;">
                ${Object.entries(data.inputs).map(([key, value]) => `
                  <div style="margin: 20px 0; padding: 20px; background: rgba(192,192,192,0.1); border-radius: 12px; border-left: 4px solid #c0c0c0;">
                    <div style="color: #c0c0c0; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">${key}</div>
                    <div style="color: #ffffff; font-size: 17px; font-weight: 600;">${value}</div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Sapphire Results -->
            <div style="background: linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%); padding: 35px; border-radius: 18px; border: 2px solid #2563eb; position: relative;">
              <div style="position: absolute; top: -15px; left: 35px; background: linear-gradient(135deg, #2563eb, #1d4ed8); color: #ffffff; padding: 8px 20px; border-radius: 20px; font-size: 14px; letter-spacing: 1px; font-weight: 700;">
                💎 CORPORATE RESULTS
              </div>

              <div style="margin-top: 20px;">
                ${Object.entries(data.results).map(([key, value]) => `
                  <div style="margin: 20px 0; padding: 20px; background: linear-gradient(135deg, rgba(37,99,235,0.2), rgba(29,78,216,0.1)); border-radius: 12px; border: 1px solid #2563eb; box-shadow: 0 4px 15px rgba(37,99,235,0.2);">
                    <div style="color: #2563eb; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">${key}</div>
                    <div style="color: #c0c0c0; font-size: 19px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">${value}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sapphire Footer -->
      <div style="background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%); color: #c0c0c0; padding: 30px 40px; text-align: center; border-top: 3px solid #2563eb;">
        <div style="font-size: 12px; margin-bottom: 10px; letter-spacing: 1px;">
          <strong>💙 SAPPHIRE CORPORATE EXCELLENCE 💙</strong>
        </div>
        <div style="font-size: 11px; opacity: 0.8; letter-spacing: 0.5px;">
          Generated by FinClamp Sapphire Suite | Corporate Financial Intelligence | www.finclamp.com
        </div>
      </div>
    </div>
  `
}

// Simple Design Generators
function generateCleanDesign(data) {
  return `
    <div style="font-family: 'Arial', sans-serif; background: white; padding: 40px; min-height: 600px; color: #333333;">
      <!-- Clean Header -->
      <div style="text-align: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 2px solid #e5e5e5;">
        <h1 style="margin: 0; font-size: 28px; font-weight: 600; color: #2c3e50;">${data.reportTitle}</h1>
        <p style="margin: 10px 0 0 0; color: #7f8c8d; font-size: 16px;">Professional Financial Analysis</p>
        <div style="margin-top: 10px; font-size: 12px; color: #95a5a6;">Generated on ${new Date().toLocaleDateString()}</div>
      </div>

      <!-- Clean Content -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;">
        <!-- Input Parameters -->
        <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; border-left: 4px solid #3498db;">
          <h3 style="margin: 0 0 20px 0; color: #2c3e50; font-size: 18px; font-weight: 600;">Input Parameters</h3>
          ${Object.entries(data.inputs).map(([key, value]) => `
            <div style="margin: 12px 0; padding: 12px; background: white; border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
              <div style="color: #7f8c8d; font-size: 13px; font-weight: 500; margin-bottom: 4px;">${key}</div>
              <div style="color: #2c3e50; font-size: 15px; font-weight: 600;">${value}</div>
            </div>
          `).join('')}
        </div>

        <!-- Results -->
        <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; border-left: 4px solid #27ae60;">
          <h3 style="margin: 0 0 20px 0; color: #2c3e50; font-size: 18px; font-weight: 600;">Results</h3>
          ${Object.entries(data.results).map(([key, value]) => `
            <div style="margin: 12px 0; padding: 12px; background: white; border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
              <div style="color: #7f8c8d; font-size: 13px; font-weight: 500; margin-bottom: 4px;">${key}</div>
              <div style="color: #27ae60; font-size: 16px; font-weight: 700;">${value}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Clean Footer -->
      <div style="text-align: center; padding: 20px; border-top: 1px solid #e5e5e5; color: #7f8c8d; font-size: 12px;">
        Generated by FinClamp Financial Calculator Suite | www.finclamp.com
      </div>
    </div>
  `
}

function generateMinimalDesign(data) {
  return `
    <div style="font-family: 'Helvetica Neue', sans-serif; background: white; padding: 60px; min-height: 600px; color: #333333;">
      <!-- Minimal Header -->
      <div style="text-align: center; margin-bottom: 60px;">
        <h1 style="margin: 0; font-size: 32px; font-weight: 300; color: #2c3e50; letter-spacing: -0.5px;">${data.reportTitle}</h1>
        <div style="width: 40px; height: 1px; background: #3498db; margin: 20px auto;"></div>
        <p style="margin: 0; color: #7f8c8d; font-size: 14px; font-weight: 300;">Financial Analysis Report</p>
      </div>

      <!-- Minimal Content -->
      <div style="max-width: 600px; margin: 0 auto;">
        <!-- Input Parameters -->
        <div style="margin-bottom: 50px;">
          <h2 style="font-size: 16px; font-weight: 400; color: #2c3e50; margin: 0 0 25px 0; text-transform: uppercase; letter-spacing: 1px;">Input Parameters</h2>
          ${Object.entries(data.inputs).map(([key, value]) => `
            <div style="margin: 15px 0; padding: 15px 0; border-bottom: 1px solid #ecf0f1;">
              <div style="color: #95a5a6; font-size: 12px; font-weight: 400; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 0.5px;">${key}</div>
              <div style="color: #2c3e50; font-size: 16px; font-weight: 400;">${value}</div>
            </div>
          `).join('')}
        </div>

        <!-- Results -->
        <div style="margin-bottom: 50px;">
          <h2 style="font-size: 16px; font-weight: 400; color: #2c3e50; margin: 0 0 25px 0; text-transform: uppercase; letter-spacing: 1px;">Results</h2>
          ${Object.entries(data.results).map(([key, value]) => `
            <div style="margin: 15px 0; padding: 15px 0; border-bottom: 1px solid #ecf0f1;">
              <div style="color: #95a5a6; font-size: 12px; font-weight: 400; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 0.5px;">${key}</div>
              <div style="color: #3498db; font-size: 18px; font-weight: 500;">${value}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Minimal Footer -->
      <div style="text-align: center; padding-top: 40px; border-top: 1px solid #ecf0f1; color: #bdc3c7; font-size: 11px; font-weight: 300;">
        FinClamp | www.finclamp.com
      </div>
    </div>
  `
}

function generateClassicDesign(data) {
  return `
    <div style="font-family: 'Times New Roman', serif; background: white; padding: 40px; min-height: 600px; border: 1px solid #cccccc;">
      <!-- Classic Header -->
      <div style="text-align: center; margin-bottom: 30px; padding: 20px; border: 2px solid #333333; background: #f9f9f9;">
        <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #333333;">${data.reportTitle}</h1>
        <p style="margin: 8px 0 0 0; font-size: 14px; color: #666666;">Financial Analysis Report</p>
        <div style="margin-top: 8px; font-size: 12px; color: #888888;">Date: ${new Date().toLocaleDateString()}</div>
      </div>

      <!-- Classic Content -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
        <tr>
          <td style="width: 50%; vertical-align: top; padding-right: 20px;">
            <div style="border: 1px solid #cccccc; padding: 20px;">
              <h3 style="margin: 0 0 15px 0; color: #333333; font-size: 16px; border-bottom: 1px solid #cccccc; padding-bottom: 8px;">INPUT PARAMETERS</h3>
              ${Object.entries(data.inputs).map(([key, value]) => `
                <div style="margin: 10px 0; padding: 8px; background: #f5f5f5;">
                  <div style="font-weight: 600; color: #333333; font-size: 13px;">${key}</div>
                  <div style="color: #555555; font-size: 14px; margin-top: 2px;">${value}</div>
                </div>
              `).join('')}
            </div>
          </td>
          <td style="width: 50%; vertical-align: top; padding-left: 20px;">
            <div style="border: 1px solid #cccccc; padding: 20px;">
              <h3 style="margin: 0 0 15px 0; color: #333333; font-size: 16px; border-bottom: 1px solid #cccccc; padding-bottom: 8px;">RESULTS</h3>
              ${Object.entries(data.results).map(([key, value]) => `
                <div style="margin: 10px 0; padding: 8px; background: #f0f8ff;">
                  <div style="font-weight: 600; color: #333333; font-size: 13px;">${key}</div>
                  <div style="color: #0066cc; font-size: 15px; font-weight: 700; margin-top: 2px;">${value}</div>
                </div>
              `).join('')}
            </div>
          </td>
        </tr>
      </table>

      <!-- Classic Footer -->
      <div style="text-align: center; padding: 15px; border-top: 1px solid #cccccc; color: #666666; font-size: 11px;">
        This report is generated for informational purposes only.<br>
        <strong>Generated by FinClamp Financial Calculator Suite | www.finclamp.com</strong>
      </div>
    </div>
  `
}

function generateFreshDesign(data) {
  return `
    <div style="font-family: 'Segoe UI', sans-serif; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); padding: 40px; min-height: 600px; color: #2c3e50;">
      <!-- Fresh Header -->
      <div style="background: white; padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <h1 style="margin: 0; font-size: 26px; font-weight: 600; color: #2c3e50;">${data.reportTitle}</h1>
        <p style="margin: 10px 0 0 0; color: #7f8c8d; font-size: 15px;">Fresh Financial Analysis</p>
        <div style="margin-top: 8px; font-size: 12px; color: #95a5a6;">${new Date().toLocaleDateString()}</div>
      </div>

      <!-- Fresh Content -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 25px;">
        <!-- Input Parameters -->
        <div style="background: white; padding: 25px; border-radius: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h3 style="margin: 0 0 20px 0; color: #3498db; font-size: 18px; font-weight: 600;">📊 Input Parameters</h3>
          ${Object.entries(data.inputs).map(([key, value]) => `
            <div style="margin: 15px 0; padding: 15px; background: #f8f9fa; border-radius: 8px; border-left: 3px solid #3498db;">
              <div style="color: #7f8c8d; font-size: 13px; font-weight: 500; margin-bottom: 5px;">${key}</div>
              <div style="color: #2c3e50; font-size: 15px; font-weight: 600;">${value}</div>
            </div>
          `).join('')}
        </div>

        <!-- Results -->
        <div style="background: white; padding: 25px; border-radius: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h3 style="margin: 0 0 20px 0; color: #27ae60; font-size: 18px; font-weight: 600;">📈 Results</h3>
          ${Object.entries(data.results).map(([key, value]) => `
            <div style="margin: 15px 0; padding: 15px; background: #f8f9fa; border-radius: 8px; border-left: 3px solid #27ae60;">
              <div style="color: #7f8c8d; font-size: 13px; font-weight: 500; margin-bottom: 5px;">${key}</div>
              <div style="color: #27ae60; font-size: 16px; font-weight: 700;">${value}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Fresh Footer -->
      <div style="background: white; margin-top: 25px; padding: 20px; border-radius: 12px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <div style="color: #7f8c8d; font-size: 12px;">
          Generated by <strong style="color: #3498db;">FinClamp</strong> | www.finclamp.com
        </div>
      </div>
    </div>
  `
}

function generateBasicDesign(data) {
  return `
    <div style="font-family: Arial, sans-serif; background: white; padding: 40px; min-height: 600px; color: #333333;">
      <!-- Basic Header -->
      <div style="margin-bottom: 30px; padding-bottom: 15px; border-bottom: 2px solid #333333;">
        <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #333333;">${data.reportTitle}</h1>
        <p style="margin: 5px 0 0 0; color: #666666; font-size: 14px;">Financial Analysis Report</p>
        <div style="margin-top: 5px; font-size: 12px; color: #888888;">Generated: ${new Date().toLocaleDateString()}</div>
      </div>

      <!-- Basic Content -->
      <div style="margin-bottom: 30px;">
        <!-- Input Parameters -->
        <h2 style="font-size: 18px; font-weight: 600; color: #333333; margin: 0 0 15px 0;">Input Parameters</h2>
        <div style="margin-bottom: 25px;">
          ${Object.entries(data.inputs).map(([key, value]) => `
            <div style="margin: 8px 0; padding: 10px; background: #f5f5f5; border-left: 3px solid #666666;">
              <strong style="color: #333333; font-size: 13px;">${key}:</strong>
              <span style="color: #555555; font-size: 14px; margin-left: 10px;">${value}</span>
            </div>
          `).join('')}
        </div>

        <!-- Results -->
        <h2 style="font-size: 18px; font-weight: 600; color: #333333; margin: 0 0 15px 0;">Results</h2>
        <div>
          ${Object.entries(data.results).map(([key, value]) => `
            <div style="margin: 8px 0; padding: 10px; background: #f0f8ff; border-left: 3px solid #0066cc;">
              <strong style="color: #333333; font-size: 13px;">${key}:</strong>
              <span style="color: #0066cc; font-size: 15px; font-weight: 600; margin-left: 10px;">${value}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Basic Footer -->
      <div style="padding-top: 15px; border-top: 1px solid #cccccc; text-align: center; color: #666666; font-size: 11px;">
        Generated by FinClamp Financial Calculator Suite | www.finclamp.com
      </div>
    </div>
  `
}

function generateLightDesign(data) {
  return `
    <div style="font-family: 'Calibri', sans-serif; background: #fafafa; padding: 40px; min-height: 600px; color: #444444;">
      <!-- Light Header -->
      <div style="background: white; padding: 25px; border-radius: 8px; text-align: center; margin-bottom: 25px; border: 1px solid #e0e0e0;">
        <h1 style="margin: 0; font-size: 26px; font-weight: 500; color: #555555;">${data.reportTitle}</h1>
        <p style="margin: 8px 0 0 0; color: #888888; font-size: 14px;">Corporate Financial Analysis</p>
        <div style="margin-top: 6px; font-size: 11px; color: #aaaaaa;">Report Date: ${new Date().toLocaleDateString()}</div>
      </div>

      <!-- Light Content -->
      <div style="background: white; padding: 30px; border-radius: 8px; border: 1px solid #e0e0e0;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
          <!-- Input Parameters -->
          <div>
            <h3 style="margin: 0 0 20px 0; color: #666666; font-size: 16px; font-weight: 600; padding-bottom: 8px; border-bottom: 1px solid #e0e0e0;">Input Parameters</h3>
            ${Object.entries(data.inputs).map(([key, value]) => `
              <div style="margin: 12px 0; padding: 12px; background: #f9f9f9; border-radius: 4px;">
                <div style="color: #888888; font-size: 12px; font-weight: 500; margin-bottom: 4px;">${key}</div>
                <div style="color: #555555; font-size: 14px; font-weight: 600;">${value}</div>
              </div>
            `).join('')}
          </div>

          <!-- Results -->
          <div>
            <h3 style="margin: 0 0 20px 0; color: #666666; font-size: 16px; font-weight: 600; padding-bottom: 8px; border-bottom: 1px solid #e0e0e0;">Results</h3>
            ${Object.entries(data.results).map(([key, value]) => `
              <div style="margin: 12px 0; padding: 12px; background: #f0f8ff; border-radius: 4px;">
                <div style="color: #888888; font-size: 12px; font-weight: 500; margin-bottom: 4px;">${key}</div>
                <div style="color: #4a90e2; font-size: 15px; font-weight: 700;">${value}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Light Footer -->
      <div style="background: white; margin-top: 20px; padding: 15px; border-radius: 8px; text-align: center; border: 1px solid #e0e0e0;">
        <div style="color: #888888; font-size: 11px;">
          Generated by FinClamp Financial Calculator Suite | www.finclamp.com
        </div>
      </div>
    </div>
  `
}

function generateOriginalDesign(data) {
  const currentDate = new Date().toLocaleDateString()
  const currentTime = new Date().toLocaleTimeString()

  return `
    <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; background: #ffffff; line-height: 1.6; color: #1a202c;">
      <!-- Modern Header with Geometric Patterns -->
      <div style="position: relative; text-align: center; margin-bottom: 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%); color: white; padding: 50px 30px; border-radius: 24px; overflow: hidden;">
        <!-- Geometric Background Elements -->
        <div style="position: absolute; top: -50px; right: -50px; width: 200px; height: 200px; background: rgba(255,255,255,0.1); border-radius: 50%; transform: rotate(45deg);"></div>
        <div style="position: absolute; bottom: -30px; left: -30px; width: 150px; height: 150px; background: rgba(255,255,255,0.08); border-radius: 50%;"></div>
        <div style="position: absolute; top: 20px; left: 20px; width: 80px; height: 80px; border: 3px solid rgba(255,255,255,0.2); border-radius: 16px; transform: rotate(15deg);"></div>
        <div style="position: absolute; bottom: 30px; right: 30px; width: 60px; height: 60px; border: 2px solid rgba(255,255,255,0.15); border-radius: 50%;"></div>

        <!-- Logo and Brand -->
        <div style="position: relative; z-index: 10;">
          <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 25px; flex-wrap: wrap;">
            <div style="width: 70px; height: 70px; background: rgba(255,255,255,0.2); border-radius: 20px; display: flex; align-items: center; justify-content: center; margin-right: 20px; backdrop-filter: blur(20px); border: 2px solid rgba(255,255,255,0.3); box-shadow: 0 8px 32px rgba(0,0,0,0.1);">
              <span style="color: white; font-size: 32px; font-weight: bold;">💰</span>
            </div>
            <div>
              <h1 style="margin: 0; font-size: 42px; font-weight: 900; text-shadow: 0 4px 20px rgba(0,0,0,0.3); letter-spacing: -1px;">
                finclamp.com
              </h1>
              <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9; font-weight: 500; letter-spacing: 1px; text-transform: uppercase;">Financial Intelligence Platform</p>
            </div>
          </div>

          <!-- Report Title Card -->
          <div style="background: rgba(255,255,255,0.15); border-radius: 20px; padding: 25px; margin-top: 30px; backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.2); box-shadow: 0 8px 32px rgba(0,0,0,0.1);">
            <h2 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.3px;">${data.reportTitle}</h2>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px; flex-wrap: wrap; gap: 10px;">
              <div style="display: flex; align-items: center;">
                <span style="font-size: 16px; margin-right: 8px;">📅</span>
                <span style="font-size: 14px; opacity: 0.9; font-weight: 500;">${currentDate}</span>
              </div>
              <div style="display: flex; align-items: center;">
                <span style="font-size: 16px; margin-right: 8px;">⏰</span>
                <span style="font-size: 14px; opacity: 0.9; font-weight: 500;">${currentTime}</span>
              </div>
              <div style="display: flex; align-items: center;">
                <span style="font-size: 16px; margin-right: 8px;">🎯</span>
                <span style="font-size: 14px; opacity: 0.9; font-weight: 500;">Professional Report</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Enhanced Results Section -->
      <div style="margin-bottom: 35px; border: none; border-radius: 28px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.12); background: white;">
        <!-- Calculator Header with Enhanced Design -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%); color: white; padding: 35px 30px; position: relative; overflow: hidden;">
          <!-- Decorative Elements -->
          <div style="position: absolute; top: -30px; right: -30px; width: 150px; height: 150px; background: rgba(255,255,255,0.1); border-radius: 50%; transform: rotate(45deg);"></div>
          <div style="position: absolute; bottom: -20px; left: -20px; width: 100px; height: 100px; background: rgba(255,255,255,0.08); border-radius: 50%;"></div>
          <div style="position: absolute; top: 15px; left: 15px; width: 40px; height: 40px; border: 2px solid rgba(255,255,255,0.3); border-radius: 8px; transform: rotate(15deg);"></div>

          <div style="position: relative; z-index: 10;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 15px;">
              <h2 style="margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -0.5px;">${data.calculatorName}</h2>
              <div style="background: rgba(255,255,255,0.2); padding: 8px 16px; border-radius: 20px; backdrop-filter: blur(10px);">
                <span style="font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Analysis</span>
              </div>
            </div>
          </div>
        </div>

        <div style="padding: 40px 35px;">
          <!-- Input Parameters Section -->
          <div style="margin-bottom: 40px;">
            <div style="display: flex; align-items: center; margin-bottom: 25px;">
              <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 16px; display: flex; align-items: center; justify-content: center; margin-right: 20px; box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);">
                <span style="color: white; font-size: 20px; font-weight: bold;">📊</span>
              </div>
              <h3 style="margin: 0; font-size: 24px; font-weight: 800; color: #2d3748; letter-spacing: -0.3px;">Input Parameters</h3>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
              ${Object.entries(data.inputs).map(([key, value]) => `
                <div style="background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); border-radius: 20px; padding: 25px; border: 1px solid #e2e8f0; box-shadow: 0 4px 20px rgba(0,0,0,0.08); transition: all 0.3s ease;">
                  <div style="display: flex; align-items: center; margin-bottom: 12px;">
                    <div style="width: 8px; height: 8px; background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 50%; margin-right: 12px;"></div>
                    <h4 style="margin: 0; font-size: 14px; font-weight: 700; color: #4a5568; text-transform: uppercase; letter-spacing: 0.5px;">${key}</h4>
                  </div>
                  <p style="margin: 0; font-size: 18px; font-weight: 600; color: #2d3748; line-height: 1.4;">${value}</p>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Results Section -->
          <div style="margin-bottom: 30px;">
            <div style="display: flex; align-items: center; margin-bottom: 25px;">
              <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #48bb78, #38a169); border-radius: 16px; display: flex; align-items: center; justify-content: center; margin-right: 20px; box-shadow: 0 8px 25px rgba(72, 187, 120, 0.3);">
                <span style="color: white; font-size: 20px; font-weight: bold;">📈</span>
              </div>
              <h3 style="margin: 0; font-size: 24px; font-weight: 800; color: #2d3748; letter-spacing: -0.3px;">Calculation Results</h3>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
              ${Object.entries(data.results).map(([key, value]) => `
                <div style="background: linear-gradient(135deg, #f0fff4 0%, #c6f6d5 100%); border-radius: 20px; padding: 25px; border: 1px solid #9ae6b4; box-shadow: 0 4px 20px rgba(72, 187, 120, 0.15); transition: all 0.3s ease;">
                  <div style="display: flex; align-items: center; margin-bottom: 12px;">
                    <div style="width: 8px; height: 8px; background: linear-gradient(135deg, #48bb78, #38a169); border-radius: 50%; margin-right: 12px;"></div>
                    <h4 style="margin: 0; font-size: 14px; font-weight: 700; color: #22543d; text-transform: uppercase; letter-spacing: 0.5px;">${key}</h4>
                  </div>
                  <p style="margin: 0; font-size: 20px; font-weight: 700; color: #22543d; line-height: 1.4;">${value}</p>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div style="text-align: center; padding: 30px; background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); border-radius: 20px; border: 1px solid #e2e8f0;">
        <p style="margin: 0; font-size: 14px; color: #718096; font-weight: 500;">
          Generated by <strong style="color: #667eea;">FinClamp Financial Calculator Suite</strong> |
          <span style="color: #a0aec0;">finclamp.com</span>
        </p>
      </div>
    </div>
  `
}
