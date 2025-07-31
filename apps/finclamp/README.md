# finclamp.com - Financial Calculator Suite

A comprehensive, mobile-first Progressive Web App (PWA) for financial calculations including loans, savings, mutual funds, and tax planning.

## Features

- **Complete Calculator Suite**: EMI, SIP, SWP, FD, Tax, NPS, EPF, Gratuity, and more
- **Mobile-First Design**: Optimized for all devices with responsive UI
- **Progressive Web App**: Installable on mobile and desktop
- **Comparison Tool**: Compare multiple calculations side-by-side
- **PDF Export**: Generate professional calculation reports
- **URL Sharing**: Share calculations with shareable links
- **Offline Support**: Works without internet connection

## Technology Stack

- **React 18** with modern hooks and context
- **Vite** for fast development and optimized builds
- **Tailwind CSS** for responsive styling
- **Framer Motion** for smooth animations
- **Recharts** for interactive charts and graphs

## Getting Started

### Development

```bash
npm install
npm run dev
```

### Production Build

```bash
npm run build
npm run preview
```

### Available Calculators

#### 💰 Loans

- **EMI Calculator**: Calculate loan EMI and repayment schedule
- **Mortgage Calculator**: Home loan calculator with advanced features
- **Personal Loan**: Personal loan EMI calculator

#### 🏦 Savings

- **Fixed Deposit**: Calculate FD maturity amount and returns
- **Recurring Deposit**: RD maturity calculator
- **PPF Calculator**: Public Provident Fund calculator

#### 📈 Mutual Funds

- **SIP Calculator**: Systematic Investment Plan calculator
- **SWP Calculator**: Systematic Withdrawal Plan calculator
- **CAGR Calculator**: Compound Annual Growth Rate calculator

#### 💼 Retirement

- **NPS Calculator**: National Pension System calculator
- **EPF Calculator**: Employee Provident Fund calculator
- **Gratuity Calculator**: Calculate gratuity amount

#### 🧾 Tax

- **Income Tax Calculator**: Calculate tax liability for different regimes
- **Tax Saving Calculator**: Plan tax-saving investments

#### 🧮 General

- **Compound Interest**: Calculate compound interest and growth
- **Simple Interest**: Calculate simple interest
- **Inflation Calculator**: Calculate inflation impact over time

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.jsx      # Main header with branding
│   ├── ComparisonPanel.jsx  # Calculator comparison tool
│   ├── PDFExport.jsx   # PDF generation component
│   └── FloatingComparisonButton.jsx
├── calculators/        # Individual calculator components
│   ├── SIPCalculator.jsx
│   ├── EMICalculator.jsx
│   └── ... other calculators
├── contexts/           # React contexts
│   └── ComparisonContext.jsx
├── hooks/             # Custom React hooks
│   └── useURLState.js
├── styles/            # CSS files
│   └── mobile.css
└── App.jsx           # Main application component
```

## Features in Detail

### Mobile-First Design

- Responsive layout optimized for mobile devices
- Touch-friendly interface with proper touch targets
- iOS-compatible input handling (prevents zoom)
- Progressive enhancement for larger screens

### PWA Capabilities

- Installable on mobile and desktop
- Offline functionality with service workers
- App-like experience with native feel
- Push notifications support (future enhancement)

### Comparison Tool

- Add multiple calculations to comparison
- Side-by-side result comparison
- Export comparison as PDF
- Clear visual differentiation

### PDF Export

- Professional report generation
- Company branding and styling
- Detailed input and result breakdown
- High-quality output optimized for printing

### URL State Management

- Shareable calculation links
- Persistent state across page reloads
- SEO-friendly URLs
- Social media sharing integration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly on mobile and desktop
5. Submit a pull request

## License

This project is licensed under the ISC License.
