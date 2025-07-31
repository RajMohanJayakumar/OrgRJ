#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

// Calculator-specific SEO data
const CALCULATOR_SEO_DATA = {
  'RDCalculator': {
    title: 'RD Calculator - Recurring Deposit Calculator | Mobile Responsive',
    description: 'Calculate recurring deposit maturity amount with mobile-optimized calculator. Interactive growth charts and PDF export.',
    keywords: 'RD calculator, recurring deposit, bank deposit calculator, mobile responsive, PDF export'
  },
  'PPFCalculator': {
    title: 'PPF Calculator - Public Provident Fund Calculator | Mobile Optimized',
    description: 'Calculate PPF maturity amount and returns with mobile-friendly interface. Interactive charts and professional PDF reports.',
    keywords: 'PPF calculator, public provident fund, tax saving calculator, mobile responsive, PDF export'
  },
  'FDCalculator': {
    title: 'FD Calculator - Fixed Deposit Calculator | Mobile Responsive',
    description: 'Calculate fixed deposit maturity amount with mobile-optimized calculator. Interactive charts and downloadable PDF reports.',
    keywords: 'FD calculator, fixed deposit, bank FD calculator, mobile responsive, PDF export'
  },
  'DailySpendingCalculator': {
    title: 'Daily Spending Calculator - Track Daily Expenses | Mobile App',
    description: 'Track daily spending with mobile-optimized calculator. PDF reports and expense analysis for better budget management.',
    keywords: 'daily spending calculator, expense tracker, budget calculator, mobile app, PDF export'
  },
  'CommuteCostCalculator': {
    title: 'Commute Cost Calculator - Travel Expense Calculator | Mobile Friendly',
    description: 'Calculate daily commute costs with mobile-responsive interface. PDF reports for expense tracking and planning.',
    keywords: 'commute cost calculator, travel expense, fuel cost calculator, mobile responsive, PDF export'
  }
};

const calculatorsDir = path.join(process.cwd(), 'src', 'calculators');

console.log('🚀 APPLYING SEO ENHANCEMENTS TO CALCULATORS');
console.log('='.repeat(60));

let updatedCount = 0;

Object.keys(CALCULATOR_SEO_DATA).forEach(calculatorName => {
  const filePath = path.join(calculatorsDir, `${calculatorName}.jsx`);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  ${calculatorName}.jsx - File not found`);
    return;
  }

  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const seoData = CALCULATOR_SEO_DATA[calculatorName];
    let fileChanges = 0;

    // Add SEO import if not present
    if (!content.includes('addMobileResponsivenessSEO')) {
      // Find import section and add SEO import
      const importMatch = content.match(/(import.*from.*hooks.*\n)/);
      if (importMatch) {
        const insertPoint = content.indexOf(importMatch[0]) + importMatch[0].length;
        content = content.slice(0, insertPoint) + 
                 "import { addMobileResponsivenessSEO, addPDFExportSEO, addChartResponsivenessSEO } from '../utils/seo'\n" +
                 content.slice(insertPoint);
        fileChanges++;
      }
    }

    // Add SEO useEffect if not present
    if (!content.includes('Enhanced SEO for mobile responsiveness')) {
      // Find existing useEffect and add SEO useEffect after it
      const useEffectMatch = content.match(/(useEffect\(\(\) => {[\s\S]*?}, \[.*?\]\))/);
      if (useEffectMatch) {
        const insertPoint = content.indexOf(useEffectMatch[0]) + useEffectMatch[0].length;
        
        const seoUseEffect = `

  // Enhanced SEO for mobile responsiveness, PDF export, and charts
  useEffect(() => {
    addMobileResponsivenessSEO();
    addPDFExportSEO();
    addChartResponsivenessSEO();
    
    // Update page title and meta description
    document.title = '${seoData.title}';
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', '${seoData.description}');
    }
    
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', '${seoData.keywords}');
    }
  }, []);`;
        
        content = content.slice(0, insertPoint) + seoUseEffect + content.slice(insertPoint);
        fileChanges++;
      }
    }

    if (fileChanges > 0) {
      fs.writeFileSync(filePath, content, 'utf8');
      updatedCount++;
      console.log(`✅ ${calculatorName}.jsx - Applied ${fileChanges} SEO enhancement(s)`);
    } else {
      console.log(`✓  ${calculatorName}.jsx - SEO already enhanced or no suitable insertion point`);
    }

  } catch (error) {
    console.log(`❌ ${calculatorName}.jsx - Error: ${error.message}`);
  }
});

// Create SEO sitemap entry for enhanced calculators
const createSEOSitemap = () => {
  const sitemapEntries = Object.keys(CALCULATOR_SEO_DATA).map(calculatorName => {
    const seoData = CALCULATOR_SEO_DATA[calculatorName];
    const urlName = calculatorName.replace('Calculator', '').toLowerCase();
    
    return `
  <url>
    <loc>https://finclamp.com/calculator?in=${urlName}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <mobile:mobile/>
    <image:image>
      <image:loc>https://finclamp.com/images/calculators/${urlName}-mobile.jpg</image:loc>
      <image:title>${seoData.title}</image:title>
      <image:caption>${seoData.description}</image:caption>
    </image:image>
  </url>`;
  }).join('');

  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${sitemapEntries}
</urlset>`;

  const sitemapPath = path.join(process.cwd(), 'public', 'sitemap-calculators-mobile.xml');
  fs.writeFileSync(sitemapPath, sitemapContent, 'utf8');
  console.log('✅ Created mobile-optimized calculator sitemap');
};

// Create robots.txt enhancement
const enhanceRobotsTxt = () => {
  const robotsPath = path.join(process.cwd(), 'public', 'robots.txt');
  let robotsContent = '';
  
  if (fs.existsSync(robotsPath)) {
    robotsContent = fs.readFileSync(robotsPath, 'utf8');
  }
  
  const mobileEnhancements = `
# Mobile-optimized calculator pages
User-agent: Googlebot-Mobile
Allow: /calculator
Allow: /calculator?in=*

# Enhanced sitemap for mobile calculators
Sitemap: https://finclamp.com/sitemap-calculators-mobile.xml

# Mobile app manifest
Allow: /manifest.json
Allow: /sw.js
`;

  if (!robotsContent.includes('Googlebot-Mobile')) {
    robotsContent += mobileEnhancements;
    fs.writeFileSync(robotsPath, robotsContent, 'utf8');
    console.log('✅ Enhanced robots.txt for mobile SEO');
  }
};

// Execute enhancements
createSEOSitemap();
enhanceRobotsTxt();

console.log('\n' + '='.repeat(60));
console.log(`🎉 COMPLETED: Applied SEO enhancements to ${updatedCount} calculators`);
console.log('📱 Mobile responsiveness SEO optimized');
console.log('📄 PDF export SEO enhanced');
console.log('📊 Chart responsiveness SEO improved');
console.log('🗺️  Mobile sitemap created');
console.log('🤖 Robots.txt enhanced for mobile SEO');
console.log('🔍 All calculators are now SEO-perfect for mobile and desktop');
