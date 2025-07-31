/**
 * Mobile utility functions for responsive design
 * Provides consistent mobile detection and styling utilities
 */

/**
 * Detect if the current device is mobile based on screen width
 * @param {number} breakpoint - The breakpoint width (default: 768px)
 * @returns {boolean} - True if mobile
 */
export const isMobileDevice = (breakpoint = 768) => {
  if (typeof window === 'undefined') return false
  return window.innerWidth < breakpoint
}

/**
 * Detect if the current device is tablet based on screen width
 * @returns {boolean} - True if tablet
 */
export const isTabletDevice = () => {
  if (typeof window === 'undefined') return false
  return window.innerWidth >= 768 && window.innerWidth < 1024
}

/**
 * Detect if the current device is desktop based on screen width
 * @returns {boolean} - True if desktop
 */
export const isDesktopDevice = () => {
  if (typeof window === 'undefined') return false
  return window.innerWidth >= 1024
}

/**
 * Get responsive class names based on mobile state
 * @param {boolean} isMobile - Mobile state
 * @param {object} classes - Object with mobile and desktop class names
 * @returns {string} - Combined class names
 */
export const getResponsiveClasses = (isMobile, classes = {}) => {
  const {
    mobile = '',
    desktop = '',
    base = ''
  } = classes

  return [
    base,
    isMobile ? mobile : desktop
  ].filter(Boolean).join(' ')
}

/**
 * Get responsive padding classes
 * @param {boolean} isMobile - Mobile state
 * @param {string} size - Size variant (sm, md, lg)
 * @returns {string} - Padding classes
 */
export const getResponsivePadding = (isMobile, size = 'md') => {
  const paddingMap = {
    sm: isMobile ? 'p-2' : 'p-3',
    md: isMobile ? 'p-3' : 'p-6',
    lg: isMobile ? 'p-4' : 'p-8'
  }
  return paddingMap[size] || paddingMap.md
}

/**
 * Get responsive spacing classes
 * @param {boolean} isMobile - Mobile state
 * @param {string} size - Size variant (sm, md, lg)
 * @returns {string} - Spacing classes
 */
export const getResponsiveSpacing = (isMobile, size = 'md') => {
  const spacingMap = {
    sm: isMobile ? 'space-y-2' : 'space-y-4',
    md: isMobile ? 'space-y-3' : 'space-y-6',
    lg: isMobile ? 'space-y-4' : 'space-y-8'
  }
  return spacingMap[size] || spacingMap.md
}

/**
 * Get responsive grid classes
 * @param {boolean} isMobile - Mobile state
 * @param {number} columns - Number of columns for desktop
 * @returns {string} - Grid classes
 */
export const getResponsiveGrid = (isMobile, columns = 2) => {
  if (isMobile) return 'grid-cols-1'
  
  const gridMap = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 lg:grid-cols-2',
    3: 'grid-cols-1 lg:grid-cols-3',
    4: 'grid-cols-1 lg:grid-cols-4'
  }
  
  return gridMap[columns] || gridMap[2]
}

/**
 * Get responsive gap classes
 * @param {boolean} isMobile - Mobile state
 * @param {string} size - Size variant (sm, md, lg)
 * @returns {string} - Gap classes
 */
export const getResponsiveGap = (isMobile, size = 'md') => {
  const gapMap = {
    sm: isMobile ? 'gap-2' : 'gap-4',
    md: isMobile ? 'gap-3' : 'gap-6',
    lg: isMobile ? 'gap-4' : 'gap-8'
  }
  return gapMap[size] || gapMap.md
}

/**
 * Get responsive text size classes
 * @param {boolean} isMobile - Mobile state
 * @param {string} variant - Text variant (heading, subheading, body, caption)
 * @returns {string} - Text size classes
 */
export const getResponsiveTextSize = (isMobile, variant = 'body') => {
  const textMap = {
    heading: isMobile ? 'text-2xl' : 'text-3xl',
    subheading: isMobile ? 'text-lg' : 'text-xl',
    body: isMobile ? 'text-base' : 'text-lg',
    caption: isMobile ? 'text-sm' : 'text-base'
  }
  return textMap[variant] || textMap.body
}

/**
 * Get responsive border radius classes
 * @param {boolean} isMobile - Mobile state
 * @param {string} size - Size variant (sm, md, lg)
 * @returns {string} - Border radius classes
 */
export const getResponsiveBorderRadius = (isMobile, size = 'md') => {
  const radiusMap = {
    sm: isMobile ? 'rounded-lg' : 'rounded-lg',
    md: isMobile ? 'rounded-lg' : 'rounded-xl',
    lg: isMobile ? 'rounded-xl' : 'rounded-2xl'
  }
  return radiusMap[size] || radiusMap.md
}

/**
 * Get responsive shadow classes
 * @param {boolean} isMobile - Mobile state
 * @param {string} size - Size variant (sm, md, lg)
 * @returns {string} - Shadow classes
 */
export const getResponsiveShadow = (isMobile, size = 'md') => {
  const shadowMap = {
    sm: isMobile ? 'shadow-sm' : 'shadow',
    md: isMobile ? 'shadow-md' : 'shadow-lg',
    lg: isMobile ? 'shadow-lg' : 'shadow-xl'
  }
  return shadowMap[size] || shadowMap.md
}

/**
 * Get responsive icon size classes
 * @param {boolean} isMobile - Mobile state
 * @param {string} size - Size variant (sm, md, lg)
 * @returns {string} - Icon size classes
 */
export const getResponsiveIconSize = (isMobile, size = 'md') => {
  const iconMap = {
    sm: isMobile ? 'w-4 h-4' : 'w-5 h-5',
    md: isMobile ? 'w-5 h-5' : 'w-6 h-6',
    lg: isMobile ? 'w-6 h-6' : 'w-8 h-8'
  }
  return iconMap[size] || iconMap.md
}

/**
 * Get responsive button classes
 * @param {boolean} isMobile - Mobile state
 * @param {string} variant - Button variant (primary, secondary, outline)
 * @param {string} size - Size variant (sm, md, lg)
 * @returns {string} - Button classes
 */
export const getResponsiveButtonClasses = (isMobile, variant = 'primary', size = 'md') => {
  const baseClasses = 'font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const sizeClasses = {
    sm: isMobile ? 'px-3 py-2 text-sm rounded-lg' : 'px-4 py-2 text-sm rounded-lg',
    md: isMobile ? 'px-4 py-3 text-base rounded-xl' : 'px-6 py-3 text-base rounded-xl',
    lg: isMobile ? 'px-6 py-4 text-lg rounded-xl' : 'px-8 py-4 text-lg rounded-xl'
  }
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500'
  }
  
  const minHeight = isMobile ? 'min-h-[44px]' : ''
  
  return [
    baseClasses,
    sizeClasses[size] || sizeClasses.md,
    variantClasses[variant] || variantClasses.primary,
    minHeight
  ].filter(Boolean).join(' ')
}

/**
 * Get responsive input classes
 * @param {boolean} isMobile - Mobile state
 * @returns {string} - Input classes
 */
export const getResponsiveInputClasses = (isMobile) => {
  const baseClasses = 'w-full font-medium border-2 border-gray-300 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400'
  const mobileClasses = isMobile ? 'px-4 py-3 text-base rounded-xl min-h-[44px]' : 'px-4 py-2 text-sm rounded-xl'
  
  return `${baseClasses} ${mobileClasses}`
}

/**
 * Get responsive container classes
 * @param {boolean} isMobile - Mobile state
 * @returns {string} - Container classes
 */
export const getResponsiveContainer = (isMobile) => {
  return isMobile ? 'max-w-full px-4' : 'max-w-7xl mx-auto px-6'
}

/**
 * Touch-friendly utilities
 */
export const touchUtils = {
  /**
   * Get touch target classes for better mobile interaction
   * @returns {string} - Touch target classes
   */
  getTouchTargetClasses: () => 'min-h-[44px] min-w-[44px] flex items-center justify-center',
  
  /**
   * Get swipe gesture classes
   * @returns {string} - Swipe classes
   */
  getSwipeClasses: () => 'touch-pan-x select-none',
  
  /**
   * Get scroll classes for mobile
   * @returns {string} - Scroll classes
   */
  getScrollClasses: () => '-webkit-overflow-scrolling: touch; scroll-behavior: smooth;'
}
