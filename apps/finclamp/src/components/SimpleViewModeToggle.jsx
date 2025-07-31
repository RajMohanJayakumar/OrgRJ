import React from 'react'
import { Monitor, Smartphone } from 'lucide-react'
import { useViewMode } from '../contexts/ViewModeContext'

const SimpleViewModeToggle = () => {
  const { viewMode, toggleViewMode, isAutoDetect } = useViewMode()

  return (
    <button
      onClick={toggleViewMode}
      className={`flex items-center space-x-2 px-3 py-2 backdrop-blur-sm rounded-xl border shadow-sm hover:bg-white/80 transition-all duration-200 text-sm font-medium cursor-pointer ${
        isAutoDetect
          ? 'bg-white/60 border-gray-200/50 text-gray-700'
          : viewMode === 'desktop'
            ? 'bg-blue-50 border-blue-200 text-blue-700'
            : 'bg-purple-50 border-purple-200 text-purple-700'
      }`}
      title={`${isAutoDetect ? 'Auto-detect mode' : 'Manual mode'} - Switch to ${viewMode === 'desktop' ? 'mobile' : 'desktop'} view`}
    >
      {viewMode === 'desktop' ? (
        <>
          <Monitor className="w-4 h-4" />
          <span className="hidden sm:inline">Desktop</span>
        </>
      ) : (
        <>
          <Smartphone className="w-4 h-4" />
          <span className="hidden sm:inline">Mobile</span>
        </>
      )}

      {/* Mode indicator */}
      <div className={`w-2 h-2 rounded-full ${
        isAutoDetect
          ? 'bg-green-500'
          : viewMode === 'desktop'
            ? 'bg-blue-500'
            : 'bg-purple-500'
      }`} title={isAutoDetect ? "Auto-detect mode" : "Manual mode"} />
    </button>
  )
}

export default SimpleViewModeToggle
