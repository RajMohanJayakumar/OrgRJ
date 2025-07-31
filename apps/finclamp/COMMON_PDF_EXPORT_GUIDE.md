# Common PDF Export Components Guide

## Overview

The Common PDF Export system provides easy-to-use, consistent PDF generation components with the **Corporate theme as default**. These components are designed to be drop-in replacements that work out of the box with minimal configuration.

## 🏢 Why Corporate Theme?

The Corporate theme was chosen as the default because it provides:
- **Professional appearance** suitable for business reports
- **Clean, readable layout** with table-based structure
- **Formal typography** using serif fonts
- **Consistent branding** across all calculators
- **Client-ready output** perfect for presentations

## 📦 Available Components

### 1. CommonPDFExport (Main Component)

The standard PDF export component with corporate styling.

```jsx
import CommonPDFExport from './components/CommonPDFExport'

<CommonPDFExport
  calculatorName="SIP Calculator"
  inputs={{
    'Monthly Investment': '₹10,000',
    'Expected Annual Return': '12%',
    'Investment Period': '10 years'
  }}
  results={{
    'Maturity Amount': '₹23,23,391',
    'Total Investment': '₹16,50,000',
    'Total Returns': '₹6,73,391'
  }}
  title="Custom Report Title" // Optional
  className="custom-button-class" // Optional
  buttonText="Download Report" // Optional
  icon="📊" // Optional
/>
```

### 2. QuickPDFExport

Simplified component for basic use cases.

```jsx
import { QuickPDFExport } from './components/CommonPDFExport'

<QuickPDFExport
  data={{ inputs: inputData, results: resultData }}
  calculatorName="EMI Calculator"
/>
```

### 3. CompactPDFExport

Small button for tight spaces or secondary actions.

```jsx
import { CompactPDFExport } from './components/CommonPDFExport'

<CompactPDFExport
  inputs={inputs}
  results={results}
  calculatorName="Tax Calculator"
/>
```

### 4. PremiumPDFExport

Eye-catching gradient design for featured placement.

```jsx
import { PremiumPDFExport } from './components/CommonPDFExport'

<PremiumPDFExport
  inputs={inputs}
  results={results}
  calculatorName="Investment Calculator"
/>
```

## 🔄 Migration from Old PDFExport

### Before (Old Way):
```jsx
import PDFExport from '../components/PDFExport'

<PDFExport
  data={[{
    calculator: 'Compound Interest Calculator',
    timestamp: new Date().toISOString(),
    inputs: {
      'Principal Amount': formatCurrency(inputs.principal),
      'Interest Rate': `${inputs.interestRate}% p.a.`,
      // ... more inputs
    },
    results: {
      'Final Amount': formatCurrency(results.amount),
      'Compound Interest': formatCurrency(results.compoundInterest),
      // ... more results
    }
  }]}
  title="Compound Interest Calculator Results"
  calculatorType="Compound Interest"
  className="custom-styles"
  buttonContent={<>Custom Button</>}
/>
```

### After (New Way):
```jsx
import CommonPDFExport from '../components/CommonPDFExport'

<CommonPDFExport
  calculatorName="Compound Interest Calculator"
  inputs={{
    'Principal Amount': formatCurrency(inputs.principal),
    'Interest Rate': `${inputs.interestRate}% p.a.`,
    // ... more inputs
  }}
  results={{
    'Final Amount': formatCurrency(results.amount),
    'Compound Interest': formatCurrency(results.compoundInterest),
    // ... more results
  }}
  className="custom-styles"
/>
```

## 🎨 Corporate Theme Features

The corporate theme includes:

### Header Design
- Professional border layout
- Company branding with FINCLAMP logo
- Clean typography with Times New Roman
- Report metadata (date, time, type)

### Content Layout
- Table-based input/output display
- Clear section separation
- Highlighted key results
- Professional color scheme (#34495e, #2c3e50)

### Footer Elements
- Company information
- Feature badges (Accurate, Secure, Reliable)
- Professional disclaimer
- Unique document ID

## 📋 Props Reference

### CommonPDFExport Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `calculatorName` | string | Required | Name of the calculator |
| `inputs` | object | `{}` | Input parameters object |
| `results` | object | `{}` | Results object |
| `title` | string | Auto-generated | Custom report title |
| `className` | string | Default styling | Custom button CSS classes |
| `buttonText` | string | "Export PDF Report" | Button text |
| `icon` | string | "📄" | Button icon |

### QuickPDFExport Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | object | Required | Object with `inputs` and `results` |
| `calculatorName` | string | Required | Name of the calculator |

### CompactPDFExport Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `inputs` | object | Required | Input parameters |
| `results` | object | Required | Results object |
| `calculatorName` | string | Required | Calculator name |

### PremiumPDFExport Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `inputs` | object | Required | Input parameters |
| `results` | object | Required | Results object |
| `calculatorName` | string | Required | Calculator name |

## 🚀 Best Practices

### 1. Use Descriptive Keys
```jsx
// Good
inputs: {
  'Monthly Investment': '₹10,000',
  'Expected Annual Return': '12%',
  'Investment Period': '10 years'
}

// Avoid
inputs: {
  'amount': '₹10,000',
  'rate': '12%',
  'time': '10 years'
}
```

### 2. Format Values Properly
```jsx
// Good
results: {
  'Final Amount': formatCurrency(results.amount),
  'Interest Rate': `${inputs.rate}% p.a.`,
  'Time Period': `${inputs.years} years`
}
```

### 3. Choose the Right Component
- **CommonPDFExport**: Standard use in most calculators
- **QuickPDFExport**: When you have data in `{inputs, results}` format
- **CompactPDFExport**: Secondary actions or space-constrained areas
- **PremiumPDFExport**: Featured calculators or premium sections

## 🔧 Customization

### Custom Button Styling
```jsx
<CommonPDFExport
  // ... other props
  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-bold"
  buttonText="Generate Professional Report"
  icon="⭐"
/>
```

### Custom Report Title
```jsx
<CommonPDFExport
  // ... other props
  title="Quarterly Investment Analysis Report"
/>
```

## 📱 Demo Pages

Visit these demo pages to see the components in action:

1. **Common PDF Components Demo**: `/games?in=common-pdf`
2. **PDF Theme Showcase**: `/games?in=pdf-themes`
3. **PDF Export Demo**: `/games?in=pdf-demo`

## 🎯 Summary

The Common PDF Export components provide:
- ✅ **Consistent corporate branding**
- ✅ **Easy integration** (just 3 required props)
- ✅ **Multiple variants** for different use cases
- ✅ **Professional output** ready for business use
- ✅ **Backward compatibility** with existing code

Start using `CommonPDFExport` in your calculators today for professional, consistent PDF reports! 🏢📄
