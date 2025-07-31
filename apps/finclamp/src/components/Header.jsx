import { useState, useEffect } from 'react'
import { useViewMode } from '../contexts/ViewModeContext'
import useMobileResponsive from '../hooks/useMobileResponsive'
import CurrencySelector from './CurrencySelector'
import SimpleViewModeToggle from './SimpleViewModeToggle'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const { isMobile } = useViewMode()
  const { responsive } = useMobileResponsive()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // PWA Install functionality
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
  }, [])

  const handlePWAInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      console.log(`User response to the install prompt: ${outcome}`)
      setDeferredPrompt(null)
    } else {
      // Fallback for browsers that don't support beforeinstallprompt
      if (navigator.share) {
        navigator.share({
          title: 'FinClamp - Financial Calculator Suite',
          text: 'Complete financial calculator suite for all your financial planning needs',
          url: window.location.href,
        })
      } else {
        alert('To install this app:\n\n• On iOS: Tap Share → Add to Home Screen\n• On Android: Tap Menu → Add to Home Screen\n• On Desktop: Look for install icon in address bar')
      }
    }
  }

  return (
    <header className={`sticky top-0 z-50 transition-all duration-500 ${
      isScrolled
        ? 'bg-white/90 backdrop-blur-2xl shadow-xl border-b border-gray-200/50'
        : 'bg-gradient-to-br from-indigo-50/80 via-white/90 to-emerald-50/80 backdrop-blur-xl shadow-lg'
    }`}>
      {/* Animated gradient bar */}
      <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 via-pink-500 to-emerald-500 animate-pulse"></div>

      {/* Full width container for mobile */}
      <div className={`${isMobile ? 'px-2 sm:px-3' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'} relative`}>
        <div className={`flex justify-between items-center ${isMobile ? 'py-2 sm:py-3' : 'py-4 sm:py-6'} min-w-0`}>
          {/* Logo and Brand Section */}
          <div className={`flex items-center ${isMobile ? 'space-x-2' : 'space-x-3'} group flex-shrink-0 min-w-0`}>
            {/* FinClamp Logo */}
            <div className="relative flex-shrink-0">
              <div className={`${isMobile ? 'w-8 h-8 sm:w-10 sm:h-10' : 'w-14 h-14'} flex items-center justify-center transition-all duration-500 transform hover:scale-110 group-hover:animate-pulse`}>
                <img
                  src="/finclamp-logo.svg"
                  alt="FinClamp Logo"
                  className={`${isMobile ? 'w-8 h-8 sm:w-10 sm:h-10' : 'w-14 h-14'} drop-shadow-lg hover:drop-shadow-xl transition-all duration-300`}
                />
              </div>
            </div>

            {/* Brand Text */}
            <div className="space-y-1 min-w-0 flex-shrink">
              <h2 className={`${isMobile ? 'text-lg sm:text-xl' : 'text-3xl sm:text-4xl'} font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent hover:from-purple-600 hover:via-pink-600 hover:to-indigo-600 transition-all duration-500 cursor-default truncate`}>
                FinClamp
              </h2>
              {!isMobile && (
                <div className="flex items-center space-x-2">
                  <p className="text-gray-600 font-semibold text-sm sm:text-base bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text text-transparent">
                    Smart Financial Planning
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Section - Responsive Layout */}
          <div className={`flex items-center ${isMobile ? 'space-x-1 sm:space-x-2' : 'space-x-3'} flex-shrink-0 min-w-0`}>
            {/* View Mode Toggle - Hidden on mobile */}
            {!isMobile && <SimpleViewModeToggle />}

            {/* Currency Selector - Responsive sizing */}
            <div className="flex-shrink-0">
              <CurrencySelector />
            </div>

            {/* Calculator Count - Hidden on mobile */}
            {!isMobile && (
              <div className="hidden lg:flex items-center px-4 py-2 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-sm flex-shrink-0">
                <div className="text-center">
                  <div className="text-xs text-gray-500 font-medium">Calculators</div>
                  <div className="text-sm font-bold text-emerald-600">33+</div>
                </div>
              </div>
            )}

            {/* PWA Install Button - Responsive sizing */}
            {(deferredPrompt || !isMobile) && (
              <button
                onClick={handlePWAInstall}
                className={`group relative flex-shrink-0 ${
                  isMobile
                    ? 'px-2 py-1.5 min-w-0 max-w-[70px] sm:px-3 sm:py-2 sm:max-w-none'
                    : 'px-6 py-3 text-sm'
                } bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-purple-600 hover:to-indigo-500 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden cursor-pointer`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <div className="relative flex items-center justify-center space-x-1 min-w-0">
                  <span className={`${isMobile ? 'text-xs sm:text-sm' : 'text-lg'} flex-shrink-0`}>📱</span>
                  <span className={`install-button-text ${isMobile ? 'hidden xs:inline truncate' : 'hidden sm:inline'}`}>Install</span>
                  <span className={`install-button-text-xs ${isMobile ? 'xs:hidden' : 'sm:hidden'}`}>App</span>
                </div>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bottom glow effect */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>
    </header>
  )
}
