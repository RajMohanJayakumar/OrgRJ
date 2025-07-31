import React, { createContext, useContext, useState, useEffect } from 'react'

const ViewModeContext = createContext()

export const useViewMode = () => {
  const context = useContext(ViewModeContext)
  if (!context) {
    throw new Error('useViewMode must be used within a ViewModeProvider')
  }
  return context
}

export const ViewModeProvider = ({ children }) => {
  // Detect initial view mode based on screen size
  const getInitialViewMode = () => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024 ? 'desktop' : 'mobile'
    }
    return 'desktop'
  }

  const [viewMode, setViewMode] = useState(getInitialViewMode)
  const [isAutoDetect, setIsAutoDetect] = useState(true)

  // Auto-detect screen size changes when auto-detect is enabled
  useEffect(() => {
    if (!isAutoDetect) return

    const handleResize = () => {
      const newViewMode = window.innerWidth >= 1024 ? 'desktop' : 'mobile'
      setViewMode(newViewMode)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isAutoDetect])

  // Manual toggle between desktop and mobile
  const toggleViewMode = () => {
    setIsAutoDetect(false)
    setViewMode(prev => prev === 'desktop' ? 'mobile' : 'desktop')
  }

  // Enable auto-detect mode
  const enableAutoDetect = () => {
    setIsAutoDetect(true)
    setViewMode(getInitialViewMode())
  }

  // Force specific view mode
  const setSpecificViewMode = (mode) => {
    setIsAutoDetect(false)
    setViewMode(mode)
  }

  const value = {
    viewMode,
    isAutoDetect,
    toggleViewMode,
    enableAutoDetect,
    setSpecificViewMode,
    isDesktop: viewMode === 'desktop',
    isMobile: viewMode === 'mobile'
  }

  return (
    <ViewModeContext.Provider value={value}>
      {children}
    </ViewModeContext.Provider>
  )
}
