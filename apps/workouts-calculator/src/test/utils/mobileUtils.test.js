import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  isMobileDevice,
  isTabletDevice,
  isDesktopDevice,
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
} from '../../utils/mobileUtils'

// Mock window object
const mockWindow = (width) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  })
}

describe('mobileUtils', () => {
  beforeEach(() => {
    // Reset window mock
    delete window.innerWidth
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Device Detection', () => {
    test('isMobileDevice should detect mobile correctly', () => {
      mockWindow(500)
      expect(isMobileDevice()).toBe(true)
      
      mockWindow(800)
      expect(isMobileDevice()).toBe(false)
      
      mockWindow(767)
      expect(isMobileDevice()).toBe(true)
      
      mockWindow(768)
      expect(isMobileDevice()).toBe(false)
    })

    test('isMobileDevice should use custom breakpoint', () => {
      mockWindow(900)
      expect(isMobileDevice(1000)).toBe(true)
      expect(isMobileDevice(800)).toBe(false)
    })

    test('isTabletDevice should detect tablet correctly', () => {
      mockWindow(500)
      expect(isTabletDevice()).toBe(false)
      
      mockWindow(800)
      expect(isTabletDevice()).toBe(true)
      
      mockWindow(1200)
      expect(isTabletDevice()).toBe(false)
    })

    test('isDesktopDevice should detect desktop correctly', () => {
      mockWindow(500)
      expect(isDesktopDevice()).toBe(false)
      
      mockWindow(800)
      expect(isDesktopDevice()).toBe(false)
      
      mockWindow(1200)
      expect(isDesktopDevice()).toBe(true)
    })

    test('should return false when window is undefined', () => {
      // Simulate server-side rendering
      const originalWindow = global.window
      delete global.window
      
      expect(isMobileDevice()).toBe(false)
      expect(isTabletDevice()).toBe(false)
      expect(isDesktopDevice()).toBe(false)
      
      global.window = originalWindow
    })
  })

  describe('Responsive Classes', () => {
    test('getResponsiveClasses should return correct classes', () => {
      const classes = {
        base: 'flex',
        mobile: 'flex-col',
        desktop: 'flex-row'
      }
      
      expect(getResponsiveClasses(true, classes)).toBe('flex flex-col')
      expect(getResponsiveClasses(false, classes)).toBe('flex flex-row')
    })

    test('getResponsiveClasses should handle empty classes', () => {
      expect(getResponsiveClasses(true, {})).toBe('')
      expect(getResponsiveClasses(false, {})).toBe('')
    })

    test('getResponsivePadding should return correct padding', () => {
      expect(getResponsivePadding(true, 'sm')).toBe('p-2')
      expect(getResponsivePadding(false, 'sm')).toBe('p-3')
      expect(getResponsivePadding(true, 'md')).toBe('p-3')
      expect(getResponsivePadding(false, 'md')).toBe('p-6')
      expect(getResponsivePadding(true, 'lg')).toBe('p-4')
      expect(getResponsivePadding(false, 'lg')).toBe('p-8')
    })

    test('getResponsiveSpacing should return correct spacing', () => {
      expect(getResponsiveSpacing(true, 'sm')).toBe('space-y-2')
      expect(getResponsiveSpacing(false, 'sm')).toBe('space-y-4')
      expect(getResponsiveSpacing(true, 'md')).toBe('space-y-3')
      expect(getResponsiveSpacing(false, 'md')).toBe('space-y-6')
    })

    test('getResponsiveGrid should return correct grid classes', () => {
      expect(getResponsiveGrid(true, 2)).toBe('grid-cols-1')
      expect(getResponsiveGrid(false, 2)).toBe('grid-cols-1 lg:grid-cols-2')
      expect(getResponsiveGrid(false, 3)).toBe('grid-cols-1 lg:grid-cols-3')
      expect(getResponsiveGrid(false, 4)).toBe('grid-cols-1 lg:grid-cols-4')
    })

    test('getResponsiveGap should return correct gap classes', () => {
      expect(getResponsiveGap(true, 'sm')).toBe('gap-2')
      expect(getResponsiveGap(false, 'sm')).toBe('gap-4')
      expect(getResponsiveGap(true, 'md')).toBe('gap-3')
      expect(getResponsiveGap(false, 'md')).toBe('gap-6')
    })

    test('getResponsiveTextSize should return correct text sizes', () => {
      expect(getResponsiveTextSize(true, 'heading')).toBe('text-2xl')
      expect(getResponsiveTextSize(false, 'heading')).toBe('text-3xl')
      expect(getResponsiveTextSize(true, 'body')).toBe('text-base')
      expect(getResponsiveTextSize(false, 'body')).toBe('text-lg')
    })

    test('getResponsiveBorderRadius should return correct border radius', () => {
      expect(getResponsiveBorderRadius(true, 'sm')).toBe('rounded-lg')
      expect(getResponsiveBorderRadius(false, 'md')).toBe('rounded-xl')
      expect(getResponsiveBorderRadius(false, 'lg')).toBe('rounded-2xl')
    })

    test('getResponsiveShadow should return correct shadow classes', () => {
      expect(getResponsiveShadow(true, 'sm')).toBe('shadow-sm')
      expect(getResponsiveShadow(false, 'md')).toBe('shadow-lg')
      expect(getResponsiveShadow(false, 'lg')).toBe('shadow-xl')
    })

    test('getResponsiveIconSize should return correct icon sizes', () => {
      expect(getResponsiveIconSize(true, 'sm')).toBe('w-4 h-4')
      expect(getResponsiveIconSize(false, 'sm')).toBe('w-5 h-5')
      expect(getResponsiveIconSize(true, 'md')).toBe('w-5 h-5')
      expect(getResponsiveIconSize(false, 'lg')).toBe('w-8 h-8')
    })
  })

  describe('Button Classes', () => {
    test('getResponsiveButtonClasses should return correct button classes', () => {
      const mobileButton = getResponsiveButtonClasses(true, 'primary', 'md')
      expect(mobileButton).toContain('px-4 py-3')
      expect(mobileButton).toContain('min-h-[44px]')
      expect(mobileButton).toContain('bg-blue-600')
      
      const desktopButton = getResponsiveButtonClasses(false, 'secondary', 'lg')
      expect(desktopButton).toContain('px-8 py-4')
      expect(desktopButton).toContain('bg-gray-100')
      expect(desktopButton).not.toContain('min-h-[44px]')
    })

    test('getResponsiveButtonClasses should handle different variants', () => {
      const outlineButton = getResponsiveButtonClasses(false, 'outline', 'sm')
      expect(outlineButton).toContain('border-2 border-blue-600')
      expect(outlineButton).toContain('text-blue-600')
    })
  })

  describe('Input and Container Classes', () => {
    test('getResponsiveInputClasses should return correct input classes', () => {
      const mobileInput = getResponsiveInputClasses(true)
      expect(mobileInput).toContain('px-4 py-3')
      expect(mobileInput).toContain('min-h-[44px]')
      
      const desktopInput = getResponsiveInputClasses(false)
      expect(desktopInput).toContain('px-4 py-2')
      expect(desktopInput).not.toContain('min-h-[44px]')
    })

    test('getResponsiveContainer should return correct container classes', () => {
      expect(getResponsiveContainer(true)).toBe('max-w-full px-4')
      expect(getResponsiveContainer(false)).toBe('max-w-7xl mx-auto px-6')
    })
  })

  describe('Touch Utils', () => {
    test('touchUtils should provide correct utility classes', () => {
      expect(touchUtils.getTouchTargetClasses()).toBe('min-h-[44px] min-w-[44px] flex items-center justify-center')
      expect(touchUtils.getSwipeClasses()).toBe('touch-pan-x select-none')
      expect(touchUtils.getScrollClasses()).toBe('-webkit-overflow-scrolling: touch; scroll-behavior: smooth;')
    })
  })

  describe('Default Values', () => {
    test('functions should use default values when size not provided', () => {
      expect(getResponsivePadding(true)).toBe('p-3')
      expect(getResponsiveSpacing(false)).toBe('space-y-6')
      expect(getResponsiveGrid(false)).toBe('grid-cols-1 lg:grid-cols-2')
      expect(getResponsiveTextSize(true)).toBe('text-base')
    })

    test('functions should handle invalid size values', () => {
      expect(getResponsivePadding(true, 'invalid')).toBe('p-3')
      expect(getResponsiveSpacing(false, 'invalid')).toBe('space-y-6')
      expect(getResponsiveGrid(false, 999)).toBe('grid-cols-1 lg:grid-cols-2')
    })
  })
})
