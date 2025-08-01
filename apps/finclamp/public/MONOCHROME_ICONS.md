# FinClamp Monochrome Icons

This directory contains monochrome versions of the FinClamp app icons for various use cases.

## Available Monochrome Icons

### Favicon
- `favicon-monochrome.svg` (32x32) - Monochrome version of the main favicon

### App Icons
- `android-chrome-192x192-monochrome.svg` (192x192) - Monochrome Android icon
- `android-chrome-512x512-monochrome.svg` (512x512) - Monochrome Android icon (large)
- `apple-touch-icon-monochrome.svg` (180x180) - Monochrome Apple touch icon

### Logo
- `finclamp-logo-monochrome.svg` (400x400) - Monochrome version of the main logo

## Design Details

The monochrome icons maintain the same circular gradient design as the original FinClamp logo but use grayscale colors:

- **Top Arc**: Gray gradient from `#6B7280` to `#4B5563`
- **Bottom Arc**: Darker gray gradient from `#374151` to `#1F2937`
- **Center Dot**: `#6B7280`
- **Text**: `#4B5563`
- **Background**: White with rounded corners

## Usage

These monochrome icons are automatically included in:
- PWA manifest.json with `"purpose": "monochrome"`
- HTML head tags for browser compatibility
- Can be used for dark mode themes or when color icons are not appropriate

## Browser Support

The monochrome icons are provided as SVG files for:
- Scalability at any size
- Small file sizes
- Modern browser compatibility
- Crisp rendering on all displays

## Integration

The monochrome icons are integrated into:
1. `manifest.json` - PWA configuration
2. `index.html` - Browser favicon references
3. Available for use in components when monochrome branding is needed
