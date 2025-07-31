
import React, { useState } from 'react'
import html2pdf from 'html2pdf.js'

export default function PDFExport({
  data,
  title = "Financial Calculator Results",
  calculatorType = "General",
  inputs = {},
  results = {},
  calculatorName = "",
  yearlyBreakdown = null,
  chartData = null,
  className = "",
  style = {},
  buttonContent = null,
  theme = "corporate" // Options: "modern", "minimal", "corporate", "creative", "dark"
}) {
  const exportToPDF = () => {
    const element = document.createElement('div')
    element.innerHTML = generatePDFContent()

    const opt = {
      margin: [0.5, 0.5, 0.5, 0.5],
      filename: `financial-calculator-report-${Date.now()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        allowTaint: false,
        backgroundColor: '#ffffff'
      },
      jsPDF: {
        unit: 'in',
        format: 'letter',
        orientation: 'portrait',
        compress: true
      },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    }

    html2pdf().set(opt).from(element).save()
  }

  const generatePDFContent = () => {
    const currentDate = new Date().toLocaleDateString()
    const currentTime = new Date().toLocaleTimeString()

    // Handle both old data format and new direct inputs/results format
    const pdfData = data && Array.isArray(data) ? data : [{
      calculator: calculatorName || calculatorType,
      timestamp: new Date().toISOString(),
      inputs: inputs,
      results: results
    }]

    // Theme configurations
    const themes = {
      modern: generateModernTheme(),
      minimal: generateMinimalTheme(),
      corporate: generateCorporateTheme(),
      creative: generateCreativeTheme(),
      dark: generateDarkTheme()
    }

    return themes[theme] || themes.corporate

  function generateModernTheme() {
    return `
      <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; background: #ffffff; line-height: 1.6; color: #1a202c;">

        <!-- Modern Header with Geometric Patterns -->
        <div style="position: relative; text-align: center; margin-bottom: 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%); color: white; padding: 50px 30px; border-radius: 24px; overflow: hidden; page-break-inside: avoid;">
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
                <h1 style="margin: 0; font-size: 42px; font-weight: 900; text-shadow: 0 4px 20px rgba(0,0,0,0.3); letter-spacing: -1px; background: linear-gradient(45deg, #ffffff, #f0f0f0); -webkit-background-clip: text; background-clip: text;">
                  finclamp.com
                </h1>
                <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9; font-weight: 500; letter-spacing: 1px; text-transform: uppercase;">Financial Intelligence Platform</p>
              </div>
            </div>

            <!-- Report Title Card -->
            <div style="background: rgba(255,255,255,0.15); border-radius: 20px; padding: 25px; margin-top: 30px; backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.2); box-shadow: 0 8px 32px rgba(0,0,0,0.1);">
              <h2 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.3px;">${title}</h2>
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
        <div style="margin-bottom: 40px;">
          ${pdfData.map((item, index) => `
            <div style="margin-bottom: 35px; border: none; border-radius: 28px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.12); background: white; page-break-inside: avoid; ${index > 0 ? 'page-break-before: auto;' : ''}">

              <!-- Calculator Header with Enhanced Design -->
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%); color: white; padding: 35px 30px; position: relative; overflow: hidden;">
                <!-- Decorative Elements -->
                <div style="position: absolute; top: -30px; right: -30px; width: 150px; height: 150px; background: rgba(255,255,255,0.1); border-radius: 50%; transform: rotate(45deg);"></div>
                <div style="position: absolute; bottom: -20px; left: -20px; width: 100px; height: 100px; background: rgba(255,255,255,0.08); border-radius: 50%;"></div>
                <div style="position: absolute; top: 15px; left: 15px; width: 40px; height: 40px; border: 2px solid rgba(255,255,255,0.3); border-radius: 8px; transform: rotate(15deg);"></div>

                <div style="position: relative; z-index: 10;">
                  <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 15px;">
                    <h2 style="margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -0.5px;">${item.calculator}</h2>
                    <div style="background: rgba(255,255,255,0.2); padding: 8px 16px; border-radius: 20px; backdrop-filter: blur(10px);">
                      <span style="font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Analysis</span>
                    </div>
                  </div>
                  <div style="display: flex; align-items: center; gap: 20px; flex-wrap: wrap;">
                    <div style="display: flex; align-items: center; background: rgba(255,255,255,0.15); padding: 6px 12px; border-radius: 12px;">
                      <span style="font-size: 14px; margin-right: 6px;">📅</span>
                      <span style="font-size: 13px; font-weight: 500;">${new Date(item.timestamp).toLocaleDateString()}</span>
                    </div>
                    <div style="display: flex; align-items: center; background: rgba(255,255,255,0.15); padding: 6px 12px; border-radius: 12px;">
                      <span style="font-size: 14px; margin-right: 6px;">⏰</span>
                      <span style="font-size: 13px; font-weight: 500;">${new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div style="padding: 40px 35px;">
                ${item.inputs && Object.keys(item.inputs).length > 0 ? `
                  <!-- Input Parameters Section -->
                  <div style="margin-bottom: 35px;">
                    <div style="display: flex; align-items: center; margin-bottom: 20px;">
                      <div style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-right: 15px; box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);">
                        <span style="font-size: 18px;">📊</span>
                      </div>
                      <h3 style="margin: 0; font-size: 24px; font-weight: 800; color: #2d3748; letter-spacing: -0.3px;">Input Parameters</h3>
                    </div>

                    <div style="background: linear-gradient(135deg, #f8fafc, #f1f5f9); border-radius: 20px; padding: 30px; border: 1px solid #e2e8f0; position: relative; overflow: hidden;">
                      <!-- Decorative corner -->
                      <div style="position: absolute; top: 0; right: 0; width: 60px; height: 60px; background: linear-gradient(135deg, #667eea, #764ba2); opacity: 0.1; border-radius: 0 20px 0 60px;"></div>

                      <div style="display: grid; gap: 18px;">
                        ${Object.entries(item.inputs).map(([key, value], inputIndex) => `
                          <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; background: white; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.06); border: 1px solid #f1f5f9; position: relative; overflow: hidden;">
                            <div style="position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background: linear-gradient(135deg, #667eea, #764ba2);"></div>
                            <span style="color: #475569; font-weight: 700; font-size: 16px; margin-left: 12px;">${key.replace(/([A-Z])/g, ' $1').replace(/^\w/, c => c.toUpperCase())}:</span>
                            <span style="color: #1e293b; font-weight: 900; background: linear-gradient(135deg, #f8fafc, #ffffff); padding: 10px 18px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); font-size: 16px; border: 1px solid #e2e8f0;">${value}</span>
                          </div>
                        `).join('')}
                      </div>
                    </div>
                  </div>
                ` : ''}

                ${item.results && Object.keys(item.results).length > 0 ? `
                  <!-- Results Section -->
                  <div>
                    <div style="display: flex; align-items: center; margin-bottom: 20px;">
                      <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-right: 15px; box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);">
                        <span style="font-size: 18px;">💡</span>
                      </div>
                      <h3 style="margin: 0; font-size: 24px; font-weight: 800; color: #2d3748; letter-spacing: -0.3px;">Calculation Results</h3>
                    </div>

                    <div style="background: linear-gradient(135deg, #f0fdf4, #ecfdf5); border-radius: 20px; padding: 30px; border: 1px solid #d1fae5; position: relative; overflow: hidden;">
                      <!-- Decorative corner -->
                      <div style="position: absolute; top: 0; right: 0; width: 60px; height: 60px; background: linear-gradient(135deg, #10b981, #059669); opacity: 0.1; border-radius: 0 20px 0 60px;"></div>

                      <div style="display: grid; gap: 20px;">
                        ${Object.entries(item.results).map(([key, value], resultIndex) => `
                          <div style="display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; background: white; border-radius: 16px; box-shadow: 0 6px 20px rgba(0,0,0,0.08); ${resultIndex === 0 ? 'border: 2px solid #10b981; background: linear-gradient(135deg, #f0fdf4, #ffffff); transform: scale(1.02);' : 'border: 1px solid #e5e7eb;'} position: relative; overflow: hidden;">
                            <div style="position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background: ${resultIndex === 0 ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #6b7280, #9ca3af)'};"></div>
                            ${resultIndex === 0 ? '<div style="position: absolute; top: 8px; right: 8px; background: #10b981; color: white; padding: 4px 8px; border-radius: 8px; font-size: 10px; font-weight: 700; text-transform: uppercase;">Key Result</div>' : ''}
                            <span style="color: ${resultIndex === 0 ? '#065f46' : '#374151'}; font-weight: 700; font-size: ${resultIndex === 0 ? '18px' : '16px'}; margin-left: 12px;">${key.replace(/([A-Z])/g, ' $1')}:</span>
                            <span style="color: ${resultIndex === 0 ? '#10b981' : '#1f2937'}; font-weight: 900; font-size: ${resultIndex === 0 ? '22px' : '18px'}; ${resultIndex === 0 ? 'text-shadow: 0 2px 4px rgba(16, 185, 129, 0.2);' : ''}">${value}</span>
                          </div>
                        `).join('')}
                      </div>
                    </div>
                  </div>
                ` : ''}
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Enhanced Footer -->
        <div style="text-align: center; background: linear-gradient(135deg, #f8fafc, #f1f5f9); border-radius: 24px; padding: 40px 30px; margin-top: 40px; border: 1px solid #e2e8f0; page-break-inside: avoid; position: relative; overflow: hidden;">
          <!-- Decorative Elements -->
          <div style="position: absolute; top: -20px; left: -20px; width: 100px; height: 100px; background: linear-gradient(135deg, #667eea, #764ba2); opacity: 0.05; border-radius: 50%;"></div>
          <div style="position: absolute; bottom: -30px; right: -30px; width: 120px; height: 120px; background: linear-gradient(135deg, #10b981, #059669); opacity: 0.05; border-radius: 50%;"></div>

          <div style="position: relative; z-index: 10;">
            <!-- Brand Section -->
            <div style="margin-bottom: 25px;">
              <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 15px; flex-wrap: wrap;">
                <div style="width: 50px; height: 50px; margin-right: 15px; display: flex; align-items: center; justify-content: center;">
                  <svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="topGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style="stop-color:#4ADE80;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#06B6D4;stop-opacity:1" />
                      </linearGradient>
                      <linearGradient id="bottomGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style="stop-color:#0EA5E9;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#3B82F6;stop-opacity:1" />
                      </linearGradient>
                    </defs>
                    <path d="M 10 25 A 15 15 0 0 1 40 25" fill="none" stroke="url(#topGradient)" stroke-width="5" stroke-linecap="round"/>
                    <path d="M 40 25 A 15 15 0 0 1 10 25" fill="none" stroke="url(#bottomGradient)" stroke-width="5" stroke-linecap="round"/>
                  </svg>
                </div>
                <div>
                  <h3 style="margin: 0; font-size: 20px; font-weight: 800; color: #2d3748; letter-spacing: -0.3px;">Generated by FinClamp</h3>
                  <p style="margin: 2px 0 0 0; font-size: 13px; color: #6b7280; font-weight: 500;">Your Trusted Financial Intelligence Platform</p>
                </div>
              </div>
              <p style="margin: 0; font-size: 15px; color: #4a5568; font-weight: 500;">Professional financial planning made simple • Trusted by thousands worldwide</p>
            </div>

            <!-- Features Grid -->
            <div style="background: white; border-radius: 20px; padding: 25px; margin: 25px 0; box-shadow: 0 8px 25px rgba(0,0,0,0.08); border: 1px solid #f1f5f9;">
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 20px; align-items: center;">
                <div style="text-align: center; padding: 15px;">
                  <div style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; width: 45px; height: 45px; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin: 0 auto 10px; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);">
                    <span style="font-size: 20px;">📊</span>
                  </div>
                  <div style="font-size: 12px; color: #374151; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Accurate</div>
                  <div style="font-size: 10px; color: #6b7280; margin-top: 2px;">Precise Calculations</div>
                </div>
                <div style="text-align: center; padding: 15px;">
                  <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; width: 45px; height: 45px; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin: 0 auto 10px; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);">
                    <span style="font-size: 20px;">🔒</span>
                  </div>
                  <div style="font-size: 12px; color: #374151; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Secure</div>
                  <div style="font-size: 10px; color: #6b7280; margin-top: 2px;">Data Protection</div>
                </div>
                <div style="text-align: center; padding: 15px;">
                  <div style="background: linear-gradient(135deg, #f59e0b, #d97706); color: white; width: 45px; height: 45px; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin: 0 auto 10px; box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);">
                    <span style="font-size: 20px;">⚡</span>
                  </div>
                  <div style="font-size: 12px; color: #374151; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Instant</div>
                  <div style="font-size: 10px; color: #6b7280; margin-top: 2px;">Real-time Results</div>
                </div>
                <div style="text-align: center; padding: 15px;">
                  <div style="background: linear-gradient(135deg, #8b5cf6, #7c3aed); color: white; width: 45px; height: 45px; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin: 0 auto 10px; box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);">
                    <span style="font-size: 20px;">💎</span>
                  </div>
                  <div style="font-size: 12px; color: #374151; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Premium</div>
                  <div style="font-size: 10px; color: #6b7280; margin-top: 2px;">Quality Service</div>
                </div>
              </div>
            </div>

            <!-- Disclaimer -->
            <div style="background: linear-gradient(135deg, #fef3c7, #fde68a); border-radius: 16px; padding: 20px; margin-top: 25px; border: 1px solid #f59e0b;">
              <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 10px;">
                <span style="font-size: 18px; margin-right: 8px;">⚠️</span>
                <span style="font-size: 14px; font-weight: 700; color: #92400e;">Important Disclaimer</span>
              </div>
              <p style="margin: 0; font-size: 12px; color: #78350f; line-height: 1.5; text-align: center;">This report is generated for informational purposes only. Please consult with a qualified financial advisor for personalized advice. All calculations are based on the inputs provided and current market assumptions. Past performance does not guarantee future results.</p>
            </div>

            <!-- Report ID -->
            <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #e5e7eb;">
              <p style="margin: 0; font-size: 11px; color: #9ca3af; font-family: 'Courier New', monospace;">Report ID: ${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
            </div>
          </div>
        </div>
      </div>
    `
  }

  function generateMinimalTheme() {
    return `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; background: #ffffff; line-height: 1.8; color: #333333;">

        <!-- Minimal Header -->
        <div style="text-align: center; margin-bottom: 60px; padding-bottom: 30px; border-bottom: 3px solid #000000;">
          <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 15px;">
            <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" style="margin-right: 15px;">
              <defs>
                <linearGradient id="topGradientMinimal" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style="stop-color:#4ADE80;stop-opacity:1" />
                  <stop offset="100%" style="stop-color:#06B6D4;stop-opacity:1" />
                </linearGradient>
                <linearGradient id="bottomGradientMinimal" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style="stop-color:#0EA5E9;stop-opacity:1" />
                  <stop offset="100%" style="stop-color:#3B82F6;stop-opacity:1" />
                </linearGradient>
              </defs>
              <path d="M 8 20 A 12 12 0 0 1 32 20" fill="none" stroke="url(#topGradientMinimal)" stroke-width="4" stroke-linecap="round"/>
              <path d="M 32 20 A 12 12 0 0 1 8 20" fill="none" stroke="url(#bottomGradientMinimal)" stroke-width="4" stroke-linecap="round"/>
            </svg>
            <h1 style="margin: 0; font-size: 32px; font-weight: 300; color: #000000; letter-spacing: 2px; text-transform: uppercase;">
              FinClamp
            </h1>
          </div>
          <p style="margin: 10px 0 0 0; font-size: 14px; color: #666666; font-weight: 400; letter-spacing: 1px;">${title}</p>
          <div style="margin-top: 20px; font-size: 12px; color: #999999;">
            <span>${currentDate} • ${currentTime}</span>
          </div>
        </div>

        <!-- Clean Results -->
        <div style="margin-bottom: 60px;">
          ${pdfData.map((item, index) => `
            <div style="margin-bottom: 50px; ${index > 0 ? 'page-break-before: auto;' : ''}">

              <!-- Calculator Title -->
              <div style="margin-bottom: 40px;">
                <h2 style="margin: 0; font-size: 24px; font-weight: 600; color: #000000; padding-bottom: 10px; border-bottom: 1px solid #e0e0e0;">${item.calculator}</h2>
                <p style="margin: 10px 0 0 0; font-size: 12px; color: #666666;">${new Date(item.timestamp).toLocaleDateString()} at ${new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
              </div>

              ${item.inputs && Object.keys(item.inputs).length > 0 ? `
                <!-- Inputs -->
                <div style="margin-bottom: 40px;">
                  <h3 style="margin: 0 0 20px 0; font-size: 16px; font-weight: 600; color: #000000; text-transform: uppercase; letter-spacing: 1px;">Input Parameters</h3>
                  <div style="background: #f8f8f8; padding: 30px; border-left: 4px solid #000000;">
                    ${Object.entries(item.inputs).map(([key, value]) => `
                      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #e0e0e0;">
                        <span style="color: #666666; font-weight: 400; font-size: 14px;">${key.replace(/([A-Z])/g, ' $1').replace(/^\w/, c => c.toUpperCase())}</span>
                        <span style="color: #000000; font-weight: 600; font-size: 14px;">${value}</span>
                      </div>
                    `).join('')}
                  </div>
                </div>
              ` : ''}

              ${item.results && Object.keys(item.results).length > 0 ? `
                <!-- Results -->
                <div>
                  <h3 style="margin: 0 0 20px 0; font-size: 16px; font-weight: 600; color: #000000; text-transform: uppercase; letter-spacing: 1px;">Results</h3>
                  <div style="background: #000000; color: white; padding: 30px;">
                    ${Object.entries(item.results).map(([key, value], resultIndex) => `
                      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: ${resultIndex === Object.entries(item.results).length - 1 ? '0' : '20px'}; ${resultIndex !== Object.entries(item.results).length - 1 ? 'padding-bottom: 20px; border-bottom: 1px solid #333333;' : ''}">
                        <span style="color: #cccccc; font-weight: 400; font-size: ${resultIndex === 0 ? '16px' : '14px'};">${key.replace(/([A-Z])/g, ' $1')}</span>
                        <span style="color: white; font-weight: ${resultIndex === 0 ? '700' : '600'}; font-size: ${resultIndex === 0 ? '20px' : '16px'};">${value}</span>
                      </div>
                    `).join('')}
                  </div>
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>

        <!-- Minimal Footer -->
        <div style="text-align: center; padding-top: 40px; border-top: 1px solid #e0e0e0;">
          <p style="margin: 0; font-size: 12px; color: #999999; font-weight: 300;">
            Generated by finclamp.com • Professional Financial Analysis
          </p>
          <p style="margin: 10px 0 0 0; font-size: 10px; color: #cccccc;">
            Report ID: ${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}
          </p>
        </div>
      </div>
    `
  }

  function generateCorporateTheme() {
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
              <h2 style="margin: 0; font-size: 18px; font-weight: normal;">${title}</h2>
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
              <div style="font-weight: bold; color: #34495e;">SECURE</div>
              <div style="font-size: 10px; color: #7f8c8d;">Data Protection</div>
            </div>
            <div style="text-align: center;">
              <div style="font-weight: bold; color: #34495e;">RELIABLE</div>
              <div style="font-size: 10px; color: #7f8c8d;">Trusted Platform</div>
            </div>
          </div>

          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #bdc3c7;">
            <p style="margin: 0; font-size: 10px; color: #95a5a6; font-style: italic;">
              This report is generated for informational purposes only. Please consult with a qualified financial advisor for personalized advice.
            </p>
            <p style="margin: 10px 0 0 0; font-size: 10px; color: #bdc3c7; font-family: 'Courier New', monospace;">
              Document ID: ${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}
            </p>
          </div>
        </div>
      </div>
    `
  }

  function generateCreativeTheme() {
    return `
      <div style="font-family: 'Comic Sans MS', cursive, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; background: linear-gradient(45deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%); line-height: 1.7; color: #2d3748;">

        <!-- Creative Header -->
        <div style="text-align: center; margin-bottom: 40px; background: white; padding: 40px; border-radius: 30px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); position: relative; overflow: hidden;">
          <div style="position: relative; z-index: 10;">
            <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 15px;">
              <svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" style="margin-right: 20px;">
                <defs>
                  <linearGradient id="topGradientCreative" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style="stop-color:#ff6b6b;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#4ecdc4;stop-opacity:1" />
                  </linearGradient>
                  <linearGradient id="bottomGradientCreative" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style="stop-color:#4ecdc4;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#45b7d1;stop-opacity:1" />
                  </linearGradient>
                </defs>
                <path d="M 12 30 A 18 18 0 0 1 48 30" fill="none" stroke="url(#topGradientCreative)" stroke-width="6" stroke-linecap="round"/>
                <path d="M 48 30 A 18 18 0 0 1 12 30" fill="none" stroke="url(#bottomGradientCreative)" stroke-width="6" stroke-linecap="round"/>
              </svg>
              <h1 style="margin: 0; font-size: 48px; font-weight: bold; background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1); -webkit-background-clip: text; background-clip: text; color: transparent;">
                FinClamp
              </h1>
            </div>
            <p style="margin: 0; font-size: 18px; color: #666; font-weight: bold;">${title}</p>
            <div style="background: linear-gradient(45deg, #ff6b6b, #4ecdc4); color: white; padding: 10px 20px; border-radius: 20px; margin-top: 20px; display: inline-block;">
              <span style="font-size: 14px;">📅 ${currentDate} ⏰ ${currentTime}</span>
            </div>
          </div>
        </div>

        <!-- Creative Results -->
        ${pdfData.map((item, index) => `
          <div style="margin-bottom: 30px; background: white; border-radius: 25px; overflow: hidden; box-shadow: 0 15px 35px rgba(0,0,0,0.1);">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 25px;">
              <h2 style="margin: 0; font-size: 24px; font-weight: bold;">${item.calculator}</h2>
            </div>
            <div style="padding: 30px;">
              ${item.inputs && Object.keys(item.inputs).length > 0 ? `
                <div style="margin-bottom: 30px;">
                  <h3 style="margin: 0 0 20px 0; font-size: 20px; font-weight: bold; color: #ff6b6b;">📝 Inputs</h3>
                  ${Object.entries(item.inputs).map(([key, value]) => `
                    <div style="margin-bottom: 15px; padding: 12px; background: #fff5f5; border-radius: 15px;">
                      <span style="color: #666; font-weight: bold;">${key.replace(/([A-Z])/g, ' $1').replace(/^\w/, c => c.toUpperCase())}: </span>
                      <span style="color: #333; font-weight: bold;">${value}</span>
                    </div>
                  `).join('')}
                </div>
              ` : ''}
              ${item.results && Object.keys(item.results).length > 0 ? `
                <div>
                  <h3 style="margin: 0 0 20px 0; font-size: 20px; font-weight: bold; color: #4ecdc4;">🎯 Results</h3>
                  ${Object.entries(item.results).map(([key, value], resultIndex) => `
                    <div style="margin-bottom: 15px; padding: 15px; background: ${resultIndex === 0 ? '#4ecdc4' : '#f0ffff'}; color: ${resultIndex === 0 ? 'white' : '#333'}; border-radius: 15px;">
                      <span style="font-weight: bold;">${key.replace(/([A-Z])/g, ' $1')}: </span>
                      <span style="font-weight: bold; font-size: ${resultIndex === 0 ? '18px' : '16px'};">${value}</span>
                    </div>
                  `).join('')}
                </div>
              ` : ''}
            </div>
          </div>
        `).join('')}

        <!-- Creative Footer -->
        <div style="text-align: center; background: white; border-radius: 25px; padding: 30px; box-shadow: 0 15px 35px rgba(0,0,0,0.1);">
          <h3 style="margin: 0; font-size: 24px; font-weight: bold; color: #ff6b6b;">Made with ❤️ by finclamp.com</h3>
          <p style="margin: 10px 0 0 0; font-size: 11px; color: #666;">Report ID: ${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
        </div>
      </div>
    `
  }

  function generateDarkTheme() {
    return `
      <div style="font-family: 'Roboto', sans-serif; max-width: 800px; margin: 0 auto; padding: 30px; background: #1a1a1a; line-height: 1.6; color: #e0e0e0;">

        <!-- Dark Header -->
        <div style="text-align: center; margin-bottom: 50px; background: linear-gradient(135deg, #2d3748, #4a5568); color: #e0e0e0; padding: 40px; border-radius: 16px; border: 1px solid #4a5568;">
          <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 15px;">
            <svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg" style="margin-right: 20px;">
              <defs>
                <linearGradient id="topGradientDark" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style="stop-color:#00d4aa;stop-opacity:1" />
                  <stop offset="100%" style="stop-color:#4ecdc4;stop-opacity:1" />
                </linearGradient>
                <linearGradient id="bottomGradientDark" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style="stop-color:#4ecdc4;stop-opacity:1" />
                  <stop offset="100%" style="stop-color:#00d4aa;stop-opacity:1" />
                </linearGradient>
              </defs>
              <path d="M 10 25 A 15 15 0 0 1 40 25" fill="none" stroke="url(#topGradientDark)" stroke-width="5" stroke-linecap="round"/>
              <path d="M 40 25 A 15 15 0 0 1 10 25" fill="none" stroke="url(#bottomGradientDark)" stroke-width="5" stroke-linecap="round"/>
            </svg>
            <h1 style="margin: 0; font-size: 36px; font-weight: 900; color: #00d4aa; text-shadow: 0 0 20px rgba(0, 212, 170, 0.3);">
              FinClamp
            </h1>
          </div>
          <p style="margin: 15px 0 0 0; font-size: 18px; color: #a0aec0;">${title}</p>
          <div style="margin-top: 20px; color: #718096; font-size: 14px;">
            ${currentDate} • ${currentTime}
          </div>
        </div>

        <!-- Dark Results -->
        ${pdfData.map((item, index) => `
          <div style="margin-bottom: 40px; background: #2d3748; border-radius: 16px; border: 1px solid #4a5568; overflow: hidden;">
            <div style="background: linear-gradient(135deg, #00d4aa, #00a085); color: #1a1a1a; padding: 25px;">
              <h2 style="margin: 0; font-size: 24px; font-weight: bold;">${item.calculator}</h2>
              <p style="margin: 5px 0 0 0; font-size: 12px; opacity: 0.8;">${new Date(item.timestamp).toLocaleDateString()}</p>
            </div>
            <div style="padding: 30px;">
              ${item.inputs && Object.keys(item.inputs).length > 0 ? `
                <div style="margin-bottom: 30px;">
                  <h3 style="margin: 0 0 20px 0; font-size: 18px; font-weight: bold; color: #00d4aa;">⚙️ Input Parameters</h3>
                  <div style="background: #1a202c; border-radius: 12px; padding: 20px; border: 1px solid #4a5568;">
                    ${Object.entries(item.inputs).map(([key, value]) => `
                      <div style="display: flex; justify-content: space-between; margin-bottom: 12px; padding: 10px 0; border-bottom: 1px solid #4a5568;">
                        <span style="color: #a0aec0;">${key.replace(/([A-Z])/g, ' $1').replace(/^\w/, c => c.toUpperCase())}</span>
                        <span style="color: #e0e0e0; font-weight: bold;">${value}</span>
                      </div>
                    `).join('')}
                  </div>
                </div>
              ` : ''}
              ${item.results && Object.keys(item.results).length > 0 ? `
                <div>
                  <h3 style="margin: 0 0 20px 0; font-size: 18px; font-weight: bold; color: #00d4aa;">📊 Results</h3>
                  <div style="background: #1a202c; border-radius: 12px; padding: 20px; border: 1px solid #4a5568;">
                    ${Object.entries(item.results).map(([key, value], resultIndex) => `
                      <div style="display: flex; justify-content: space-between; margin-bottom: 15px; padding: 12px; background: ${resultIndex === 0 ? 'linear-gradient(135deg, #00d4aa, #00a085)' : '#2d3748'}; color: ${resultIndex === 0 ? '#1a1a1a' : '#e0e0e0'}; border-radius: 8px; ${resultIndex === 0 ? 'box-shadow: 0 0 20px rgba(0, 212, 170, 0.2);' : ''}">
                        <span style="font-weight: ${resultIndex === 0 ? 'bold' : 'normal'};">${key.replace(/([A-Z])/g, ' $1')}</span>
                        <span style="font-weight: bold; font-size: ${resultIndex === 0 ? '18px' : '16px'};">${value}</span>
                      </div>
                    `).join('')}
                  </div>
                </div>
              ` : ''}
            </div>
          </div>
        `).join('')}

        <!-- Dark Footer -->
        <div style="text-align: center; background: #2d3748; border-radius: 16px; padding: 30px; border: 1px solid #4a5568;">
          <h3 style="margin: 0; font-size: 20px; font-weight: bold; color: #00d4aa;">finclamp.com</h3>
          <p style="margin: 10px 0; font-size: 14px; color: #a0aec0;">Dark Mode Financial Reports</p>
          <p style="margin: 20px 0 0 0; font-size: 10px; color: #718096;">
            Report ID: ${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}
          </p>
        </div>
      </div>
    `
  }
  }

  return (
    <button
      onClick={exportToPDF}
      className={className || "bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 sm:px-6 sm:py-3 rounded-lg font-semibold transition-all flex items-center space-x-2 cursor-pointer text-sm sm:text-base hover:shadow-lg transform hover:scale-105"}
      style={style}
    >
      {buttonContent || (
        <>
          <span className="text-base sm:text-lg">📄</span>
          <span className="hidden sm:inline">Export to PDF</span>
          <span className="sm:hidden">PDF</span>
        </>
      )}
    </button>
  )
}
