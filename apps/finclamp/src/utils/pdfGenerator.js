// PDF Generation Utilities
// Enhanced PDF generation with modern styling and finclamp.com branding

export const generateVendorQuotationPDF = (quotationDetails, items, results, formatCurrency) => {
  const currentDate = new Date().toLocaleDateString()
  const currentTime = new Date().toLocaleTimeString()
  const reportId = `VQ-${Date.now().toString().slice(-6)}`

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Vendor Quotation - ${quotationDetails.vendorName || 'Professional Quotation'}</title>
      <style>
        /* Print-specific styles */
        @media print {
          body {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .document-wrapper {
            box-shadow: none !important;
            border-radius: 0 !important;
          }
          .header, .footer {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
        }

        body {
          font-family: 'Times New Roman', serif;
          margin: 0;
          padding: 0;
          background: #ffffff;
          color: #2c3e50;
          line-height: 1.6;
          -webkit-print-color-adjust: exact;
          color-adjust: exact;
        }
        .document-wrapper {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          min-height: 100vh;
          page-break-inside: avoid;
        }
        .document-content {
          padding: 0;
        }
        /* Corporate Header Styling */
        .header {
          background: #64748b !important;
          color: white !important;
          padding: 0;
          margin: 0;
          position: relative;
          border-bottom: 4px solid #475569 !important;
          -webkit-print-color-adjust: exact;
          color-adjust: exact;
        }
        .header-top {
          background: #64748b !important;
          padding: 20px 40px 10px 40px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          -webkit-print-color-adjust: exact;
          color-adjust: exact;
        }
        .vendor-info {
          flex: 1;
        }
        .vendor-name {
          font-size: 28px;
          font-weight: bold;
          margin: 0;
          color: white;
          letter-spacing: 1px;
        }
        .vendor-tagline {
          font-size: 12px;
          margin: 5px 0 0 0;
          opacity: 0.9;
          font-style: italic;
        }
        .header-meta {
          text-align: right;
          font-size: 11px;
          color: rgba(255,255,255,0.9);
        }
        .header-bottom {
          background: #475569 !important;
          padding: 15px 40px;
          text-align: center;
          -webkit-print-color-adjust: exact;
          color-adjust: exact;
        }
        .quotation-title {
          font-size: 20px;
          font-weight: bold;
          margin: 0;
          letter-spacing: 2px;
          text-transform: uppercase;
        }
        /* Corporate Content Styling */
        .content-wrapper {
          padding: 30px 40px;
        }
        .draft-notice {
          background: #fff3cd;
          border: 2px solid #ffc107;
          border-left: 6px solid #ffc107;
          padding: 15px 20px;
          margin: 0 0 30px 0;
          font-weight: bold;
          color: #856404;
          text-align: center;
        }
        .document-info {
          background: #f8f9fa;
          border: 1px solid #dee2e6;
          padding: 20px;
          margin-bottom: 30px;
        }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .info-section h4 {
          margin: 0 0 15px 0;
          font-size: 14px;
          font-weight: bold;
          color: #34495e;
          text-transform: uppercase;
          letter-spacing: 1px;
          border-bottom: 2px solid #64748b;
          padding-bottom: 5px;
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #e9ecef;
        }
        .detail-label {
          font-weight: 600;
          color: #495057;
          min-width: 120px;
        }
        .detail-value {
          color: #2c3e50;
          font-weight: 500;
        }
        /* Corporate Table Styling */
        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin: 30px 0;
          border: 2px solid #34495e;
          background: white;
        }
        .table-header {
          background: #34495e !important;
          color: white !important;
          -webkit-print-color-adjust: exact;
          color-adjust: exact;
        }
        .table-header th {
          padding: 15px 12px;
          text-align: left;
          font-weight: bold;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 1px;
          border-right: 1px solid #2c3e50;
        }
        .table-header th:last-child {
          border-right: none;
        }
        .table-row td {
          padding: 12px;
          border-bottom: 1px solid #dee2e6;
          border-right: 1px solid #dee2e6;
          font-size: 13px;
          color: #2c3e50;
        }
        .table-row td:last-child {
          border-right: none;
        }
        .table-row:nth-child(even) {
          background: #f8f9fa;
        }
        .table-row:hover {
          background: #e9ecef;
        }
        .text-right {
          text-align: right;
        }
        .text-center {
          text-align: center;
        }
        /* Corporate Summary Styling */
        .summary-section {
          margin-top: 30px;
          background: #f8f9fa;
          border: 2px solid #34495e;
          padding: 0;
        }
        .summary-header {
          background: #34495e !important;
          color: white !important;
          padding: 12px 20px;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-size: 14px;
          -webkit-print-color-adjust: exact;
          color-adjust: exact;
        }
        .summary-content {
          padding: 20px;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #dee2e6;
        }
        .summary-row:last-child {
          border-bottom: none;
        }
        .summary-label {
          font-weight: 600;
          color: #495057;
        }
        .summary-value {
          font-weight: bold;
          color: #2c3e50;
        }
        .total-row {
          background: #e9ecef;
          margin: 15px -20px -20px -20px;
          padding: 15px 20px;
          border-top: 3px solid #64748b;
        }
        .total-row .summary-label,
        .total-row .summary-value {
          font-size: 16px;
          color: #64748b;
          font-weight: bold;
        }
        .notes-section {
          margin-top: 30px;
          padding: 20px;
          background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
          border-radius: 12px;
          border-left: 4px solid #f97316;
        }
        .notes-title {
          font-weight: bold;
          color: #f97316;
          margin-bottom: 10px;
          font-size: 16px;
        }
        /* Corporate Footer Styling */
        .footer {
          background: #34495e !important;
          color: white !important;
          margin-top: 40px;
          padding: 0;
          -webkit-print-color-adjust: exact;
          color-adjust: exact;
        }
        .footer-content {
          padding: 20px 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 4px solid #64748b;
        }
        .footer-left {
          flex: 1;
        }
        .footer-brand {
          font-size: 18px;
          font-weight: bold;
          color: #64748b;
          margin: 0;
        }
        .footer-tagline {
          font-size: 12px;
          color: #bdc3c7;
          margin: 5px 0 0 0;
        }
        .footer-right {
          text-align: right;
          font-size: 11px;
          color: #95a5a6;
        }
        .footer-website {
          color: #64748b !important;
          text-decoration: none;
          font-weight: 600;
          -webkit-print-color-adjust: exact;
          color-adjust: exact;
        }
        .footer-badges {
          background: #2c3e50 !important;
          padding: 15px 40px;
          text-align: center;
          font-size: 11px;
          color: #95a5a6 !important;
          -webkit-print-color-adjust: exact;
          color-adjust: exact;
        }
        .badge {
          display: inline-block;
          margin: 0 15px;
          padding: 5px 10px;
          background: #34495e !important;
          border-radius: 3px;
          color: #ecf0f1 !important;
          -webkit-print-color-adjust: exact;
          color-adjust: exact;
        }
        @media print {
          body { margin: 0; background: white; }
          .no-print { display: none; }
          .document-wrapper { box-shadow: none; border-radius: 0; }
        }
      </style>
    </head>
    <body>
      <div class="document-wrapper">
        <!-- Corporate Header -->
        <div class="header">
          <div class="header-top">
            <div class="vendor-info">
              <div class="vendor-name">${quotationDetails.vendorName || 'Vendor Name'}</div>
              <div class="vendor-tagline">${quotationDetails.companyDescription || 'Professional Services'}</div>
            </div>
            <div class="header-meta">
              Generated on ${currentDate}<br>
              Report ID: ${reportId}<br>
              Powered by <a href="https://finclamp.com" class="footer-website">finclamp.com</a>
            </div>
          </div>
          <div class="header-bottom">
            <div class="quotation-title">${quotationDetails.isDraft ? 'DRAFT ' : ''}VENDOR QUOTATION</div>
          </div>
        </div>

        <div class="content-wrapper">

        ${quotationDetails.isDraft ? `
          <div class="draft-notice">
            <strong>⚠️ DRAFT QUOTATION</strong><br>
            This is a draft quotation. Final prices may change based on market conditions and availability.
          </div>
        ` : ''}

        <!-- Document Information -->
        <div class="document-info">
          <div class="info-grid">
            <div class="info-section">
              <h4>Quotation Details</h4>
              <div class="detail-row">
                <span class="detail-label">Quotation Date:</span>
                <span class="detail-value">${quotationDetails.quotationDate || currentDate}</span>
              </div>
              ${quotationDetails.validUntil ? `
              <div class="detail-row">
                <span class="detail-label">Valid Until:</span>
                <span class="detail-value">${new Date(quotationDetails.validUntil).toLocaleDateString()}</span>
              </div>
              ` : ''}
              <div class="detail-row">
                <span class="detail-label">Tax Rate:</span>
                <span class="detail-value">${quotationDetails.taxRate}%</span>
              </div>
            </div>
            <div class="info-section">
              <h4>Customer Information</h4>
              <div class="detail-row">
                <span class="detail-label">Customer Name:</span>
                <span class="detail-value">${quotationDetails.customerName || 'N/A'}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Quotation #:</span>
                <span class="detail-value">${reportId}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Document Type:</span>
                <span class="detail-value">${quotationDetails.isDraft ? 'Draft Quotation' : 'Final Quotation'}</span>
              </div>
            </div>
          </div>
        </div>

        ${(quotationDetails.email || quotationDetails.phoneNumbers?.some(p => p.trim()) || (quotationDetails.includeAddress && quotationDetails.address)) ? `
        <!-- Contact Information -->
        <div class="document-info">
          <div class="info-section">
            <h4>Contact Information</h4>
            ${quotationDetails.email ? `
            <div class="detail-row">
              <span class="detail-label">Email:</span>
              <span class="detail-value">${quotationDetails.email}</span>
            </div>
            ` : ''}
            ${quotationDetails.phoneNumbers?.filter(p => p.trim()).map((phone, index) => `
            <div class="detail-row">
              <span class="detail-label">${quotationDetails.phoneNumbers.filter(p => p.trim()).length > 1 ? `Phone ${index + 1}:` : 'Phone:'}</span>
              <span class="detail-value">${phone}</span>
            </div>
            `).join('') || ''}
            ${quotationDetails.includeAddress && quotationDetails.address ? `
            <div class="detail-row">
              <span class="detail-label">Address:</span>
              <span class="detail-value" style="white-space: pre-line;">${quotationDetails.address}</span>
            </div>
            ` : ''}
          </div>
        </div>
        ` : ''}

        <table class="items-table">
          <thead class="table-header">
            <tr>
              <th style="width: 8%">S.No</th>
              <th style="width: 35%">Description</th>
              <th style="width: 12%">Quantity</th>
              <th style="width: 10%">Unit</th>
              <th style="width: 15%">Rate</th>
              <th style="width: 20%">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${items.map((item, index) => {
              const quantity = parseFloat(item.quantity) || 0
              const price = parseFloat(item.price) || 0
              const total = quantity * price
              return `
                <tr class="table-row">
                  <td class="text-center">${index + 1}</td>
                  <td>${item.name}</td>
                  <td class="text-center">${quantity}</td>
                  <td class="text-center">${item.unit}</td>
                  <td class="text-right">${formatCurrency(price)}</td>
                  <td class="text-right">${formatCurrency(total)}</td>
                </tr>
              `
            }).join('')}
          </tbody>
        </table>

        <!-- Corporate Summary Section -->
        <div class="summary-section">
          <div class="summary-header">Quotation Summary</div>
          <div class="summary-content">
            <div class="summary-row">
              <span class="summary-label">Subtotal:</span>
              <span class="summary-value">${formatCurrency(results.subtotal)}</span>
            </div>
            ${parseFloat(quotationDetails.taxRate) > 0 ? `
            <div class="summary-row">
              <span class="summary-label">Tax (${quotationDetails.taxRate}%):</span>
              <span class="summary-value">${formatCurrency(results.taxAmount)}</span>
            </div>
            ` : ''}
            <div class="summary-row">
              <span class="summary-label">Total Items:</span>
              <span class="summary-value">${results.itemCount}</span>
            </div>
            <div class="summary-row">
              <span class="summary-label">Total Quantity:</span>
              <span class="summary-value">${results.totalQuantity?.toFixed(2)}</span>
            </div>
          </div>
          <div class="total-row">
            <span class="summary-label">GRAND TOTAL:</span>
            <span class="summary-value">${formatCurrency(results.totalAmount)}</span>
          </div>
        </div>

        ${quotationDetails.notes ? `
          <div class="notes-section">
            <div class="notes-title">Additional Notes:</div>
            <div>${quotationDetails.notes}</div>
          </div>
        ` : ''}

        </div>

        <!-- Corporate Footer -->
        <div class="footer">
          <div class="footer-content">
            <div class="footer-left">
              <div class="footer-brand">FinClamp</div>
              <div class="footer-tagline">Professional Financial Analysis & Quotation Management</div>
            </div>
            <div class="footer-right">
              Generated on ${currentDate} at ${currentTime}<br>
              <a href="https://finclamp.com" class="footer-website">www.finclamp.com</a>
            </div>
          </div>
          <div class="footer-badges">
            <span class="badge">✓ Accurate</span>
            <span class="badge">✓ Secure</span>
            <span class="badge">✓ Reliable</span>
            <span class="badge">✓ Professional</span>
          </div>
        </div>
      </div>
    </body>
    </html>
  `

  return htmlContent
}

export const printPDF = (htmlContent) => {
  const printWindow = window.open('', '_blank')
  printWindow.document.write(htmlContent)
  printWindow.document.close()
  printWindow.focus()
  printWindow.print()
}
