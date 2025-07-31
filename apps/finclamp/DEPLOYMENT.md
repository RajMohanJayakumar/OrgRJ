# Deployment Guide

This guide explains how to deploy the FinClamp Financial Calculator to various hosting platforms.

## 🚀 Quick Deploy

### Netlify (Recommended)

1. Connect your GitHub repository to Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`
4. The `_redirects` file will automatically handle SPA routing

### Vercel

1. Connect your GitHub repository to Vercel
2. Build command: `npm run build`
3. Output directory: `dist`
4. The `vercel.json` file will handle SPA routing

### GitHub Pages

1. Enable GitHub Pages in repository settings
2. Set source to "GitHub Actions"
3. The existing `.github/workflows/deploy.yml` will handle deployment
4. The `public/404.html` file handles SPA routing for GitHub Pages

**Important for GitHub Pages:**

- Uses a special 404.html redirect technique
- Automatically handles URLs like `/calculators?in=tip-calculator`
- No additional configuration needed

## 🔧 Configuration Files

### For Netlify

- `public/_redirects` - Handles SPA routing
- Automatically included in build

### For Vercel

- `vercel.json` - Handles SPA routing and headers
- Automatically detected

### For Apache Servers

- `public/.htaccess` - Handles SPA routing and caching
- Automatically included in build

## 🌐 URL Structure

The app supports these URL patterns:

- `/calculators?in=emi` - EMI Calculator
- `/calculators?in=sip` - SIP Calculator
- `/games?in=finance-quest` - Finance Game
- Legacy: `/?calculator=emi&category=loans`

## 🐛 Troubleshooting

### "Page Not Found" on Direct URL Access

- Ensure your hosting platform serves `index.html` for all routes
- Check that the appropriate config file is deployed:
  - Netlify: `_redirects`
  - Vercel: `vercel.json`
  - Apache: `.htaccess`
  - GitHub Pages: `404.html` (automatically handled)

### GitHub Pages Specific Issues

- If you see 404 errors, wait 5-10 minutes after deployment
- Ensure GitHub Pages is set to "GitHub Actions" source
- Check that the workflow completed successfully
- Clear browser cache and try again
- The 404.html redirect may take a moment to process

### Infinite URL Loop (Fixed)

- Previous versions had an infinite redirect loop issue
- This has been fixed with a simpler redirect mechanism
- If you still see loops, clear browser cache completely

### Build Errors

- Run `npm ci` to ensure clean dependencies
- Check Node.js version (requires 16+)
- Verify all environment variables are set

### Performance Issues

- The app uses code splitting for better performance
- Static assets are cached for 1 year
- Consider enabling gzip compression on your server

## 📊 Bundle Analysis

The build creates optimized chunks:

- `vendor.js` - React and core dependencies
- `charts.js` - Recharts library
- `motion.js` - Framer Motion animations
- `icons.js` - Lucide React icons
- `index.js` - Main application code

## 🔒 Security Headers

The configuration includes security headers:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`

## 📱 PWA Support

The app includes PWA features:

- Service Worker for offline support
- Web App Manifest for installation
- Optimized for mobile devices
