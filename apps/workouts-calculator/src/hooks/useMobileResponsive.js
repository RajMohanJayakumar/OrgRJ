import { useState, useEffect, useMemo } from 'react'
import { useViewMode } from '../contexts/ViewModeContext'
import {
  getResponsiveClasses,
  getResponsivePadding,
  getResponsiveSpacing,
  getResponsiveGrid,
  getResponsiveGap,
  getResponsiveTextSize,
  getResponsiveBorderRadius,
  getResponsiveShadow,
  getResponsiveIconSize,
  getResponsiveButtonClasses,
  getResponsiveInputClasses,
  getResponsiveContainer,
  touchUtils
} from '../utils/mobileUtils'

/**
 * Custom hook for mobile responsive design
 * Provides utilities and classes for mobile-first responsive design
 */
export const useMobileResponsive = () => {
  const { isMobile, viewMode } = useViewMode()
  const [screenWidth, setScreenWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  )

  // Update screen width on resize
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Memoized responsive utilities
  const responsive = useMemo(() => ({
    // Basic responsive utilities
    classes: (classes) => getResponsiveClasses(isMobile, classes),
    padding: (size) => getResponsivePadding(isMobile, size),
    spacing: (size) => getResponsiveSpacing(isMobile, size),
    grid: (columns) => getResponsiveGrid(isMobile, columns),
    gap: (size) => getResponsiveGap(isMobile, size),
    textSize: (variant) => getResponsiveTextSize(isMobile, variant),
    borderRadius: (size) => getResponsiveBorderRadius(isMobile, size),
    shadow: (size) => getResponsiveShadow(isMobile, size),
    iconSize: (size) => getResponsiveIconSize(isMobile, size),
    
    // Component-specific utilities
    button: (variant, size) => getResponsiveButtonClasses(isMobile, variant, size),
    input: () => getResponsiveInputClasses(isMobile),
    container: () => getResponsiveContainer(isMobile),
    
    // Layout utilities
    layout: {
      // Main container layout - nearly full width on mobile
      main: isMobile
        ? 'max-w-full px-1 py-4 space-y-4 calculator-main-container'
        : 'max-w-7xl mx-auto px-6 py-6 space-y-8',

      // Card layout - reduced padding on mobile
      card: isMobile
        ? 'bg-white rounded-lg shadow-md p-2'
        : 'bg-white rounded-xl shadow-lg p-6',

      // Grid layout for calculator sections
      calculatorGrid: isMobile
        ? 'grid grid-cols-1 gap-3'
        : 'grid grid-cols-1 lg:grid-cols-2 gap-8',

      // Header layout
      header: isMobile
        ? 'text-center mb-3'
        : 'text-center mb-8',

      // Results section layout - reduced padding on mobile
      results: isMobile
        ? 'bg-gray-50 rounded-lg p-2 space-y-2'
        : 'bg-gray-50 rounded-xl p-6 space-y-6',

      // Action buttons layout
      actions: isMobile
        ? 'flex flex-col gap-2 mt-3'
        : 'flex flex-row gap-4 mt-6'
    },
    
    // Typography utilities
    typography: {
      heading: isMobile ? 'text-2xl font-bold' : 'text-3xl font-bold',
      subheading: isMobile ? 'text-lg font-semibold' : 'text-xl font-semibold',
      body: isMobile ? 'text-base' : 'text-lg',
      caption: isMobile ? 'text-sm text-gray-600' : 'text-base text-gray-600',
      label: isMobile ? 'text-sm font-medium text-gray-700' : 'text-sm font-medium text-gray-700'
    },
    
    // Input utilities
    inputs: {
      group: isMobile ? 'space-y-2' : 'space-y-3',
      field: isMobile 
        ? 'w-full px-4 py-3 text-base border-2 border-gray-300 rounded-xl min-h-[44px]'
        : 'w-full px-4 py-2 text-sm border-2 border-gray-300 rounded-xl',
      label: 'block text-sm font-medium text-gray-700 mb-2',
      error: 'text-sm text-red-600 mt-1'
    },
    
    // Button utilities
    buttons: {
      primary: isMobile
        ? 'w-full px-4 py-3 text-base font-medium bg-blue-600 text-white rounded-xl min-h-[44px]'
        : 'px-6 py-3 text-base font-medium bg-blue-600 text-white rounded-xl',
      secondary: isMobile
        ? 'w-full px-4 py-3 text-base font-medium bg-gray-100 text-gray-900 rounded-xl min-h-[44px]'
        : 'px-6 py-3 text-base font-medium bg-gray-100 text-gray-900 rounded-xl',
      outline: isMobile
        ? 'w-full px-4 py-3 text-base font-medium border-2 border-blue-600 text-blue-600 rounded-xl min-h-[44px]'
        : 'px-6 py-3 text-base font-medium border-2 border-blue-600 text-blue-600 rounded-xl'
    },
    
    // Chart utilities
    charts: {
      container: isMobile ? 'h-64 w-full' : 'h-80 w-full',
      wrapper: isMobile ? 'bg-white rounded-lg p-3' : 'bg-white rounded-xl p-6'
    },
    
    // Modal utilities
    modal: {
      overlay: 'fixed inset-0 bg-black bg-opacity-50 z-50',
      container: isMobile
        ? 'fixed inset-x-0 bottom-0 bg-white rounded-t-xl p-4 max-h-[80vh] overflow-y-auto'
        : 'fixed inset-0 flex items-center justify-center p-4',
      content: isMobile
        ? 'w-full'
        : 'bg-white rounded-xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto'
    },
    
    // Touch utilities
    touch: touchUtils
  }), [isMobile])

  // Breakpoint utilities
  const breakpoints = useMemo(() => ({
    isMobile: screenWidth < 768,
    isTablet: screenWidth >= 768 && screenWidth < 1024,
    isDesktop: screenWidth >= 1024,
    isLarge: screenWidth >= 1280,
    isXLarge: screenWidth >= 1536,
    width: screenWidth
  }), [screenWidth])

  // Device detection utilities
  const device = useMemo(() => ({
    isTouchDevice: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
    isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent),
    isAndroid: /Android/.test(navigator.userAgent),
    isSafari: /^((?!chrome|android).)*safari/i.test(navigator.userAgent),
    isChrome: /Chrome/.test(navigator.userAgent),
    isFirefox: /Firefox/.test(navigator.userAgent)
  }), [])

  // Orientation utilities
  const [orientation, setOrientation] = useState(
    typeof window !== 'undefined' && window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
  )

  useEffect(() => {
    const handleOrientationChange = () => {
      setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape')
    }

    window.addEventListener('resize', handleOrientationChange)
    return () => window.removeEventListener('resize', handleOrientationChange)
  }, [])

  return {
    // Basic state
    isMobile,
    viewMode,
    screenWidth,
    orientation,
    
    // Utilities
    responsive,
    breakpoints,
    device,
    
    // Helper functions
    getClasses: (classes) => getResponsiveClasses(isMobile, classes),
    
    // Conditional rendering helpers
    showOnMobile: (component) => isMobile ? component : null,
    showOnDesktop: (component) => !isMobile ? component : null,
    showOnTablet: (component) => breakpoints.isTablet ? component : null,
    
    // Layout helpers
    getLayoutClasses: (mobileClasses, desktopClasses) => 
      isMobile ? mobileClasses : desktopClasses,
    
    // Animation helpers
    getAnimationDuration: () => isMobile ? 200 : 300,
    getAnimationEasing: () => isMobile ? 'ease-out' : 'ease-in-out'
  }
}

export default useMobileResponsive
