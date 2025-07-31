import React from 'react'
import { motion } from 'framer-motion'
import { Monitor, Smartphone, RotateCcw } from 'lucide-react'
import { useViewMode } from '../contexts/ViewModeContext'

const ViewModeSwitch = ({ className = "" }) => {
  const { 
    viewMode, 
    isAutoDetect, 
    toggleViewMode, 
    enableAutoDetect,
    setSpecificViewMode 
  } = useViewMode()

  return (
    <motion.div 
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-2 ${className}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-2">
        {/* Auto Detect Button */}
        <button
          onClick={enableAutoDetect}
          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
            isAutoDetect
              ? 'bg-green-100 text-green-700 border border-green-200'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
          }`}
          title="Auto-detect based on screen size"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="hidden sm:inline">Auto</span>
        </button>

        {/* Separator */}
        <div className="w-px h-6 bg-gray-300"></div>

        {/* Desktop Button */}
        <button
          onClick={() => setSpecificViewMode('desktop')}
          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
            viewMode === 'desktop' && !isAutoDetect
              ? 'bg-blue-100 text-blue-700 border border-blue-200'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
          }`}
          title="Desktop view"
        >
          <Monitor className="w-4 h-4" />
          <span className="hidden sm:inline">Desktop</span>
        </button>

        {/* Mobile Button */}
        <button
          onClick={() => setSpecificViewMode('mobile')}
          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
            viewMode === 'mobile' && !isAutoDetect
              ? 'bg-purple-100 text-purple-700 border border-purple-200'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
          }`}
          title="Mobile view"
        >
          <Smartphone className="w-4 h-4" />
          <span className="hidden sm:inline">Mobile</span>
        </button>

        {/* Current Mode Indicator */}
        <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-md">
          <div className={`w-2 h-2 rounded-full ${
            viewMode === 'desktop' ? 'bg-blue-500' : 'bg-purple-500'
          }`}></div>
          <span className="text-xs text-gray-600 hidden md:inline">
            {isAutoDetect ? 'Auto' : 'Manual'} - {viewMode === 'desktop' ? 'Desktop' : 'Mobile'}
          </span>
          <span className="text-xs text-gray-600 md:hidden">
            {viewMode === 'desktop' ? 'D' : 'M'}
          </span>
        </div>
      </div>

      {/* Help Text */}
      <div className="mt-2 px-2">
        <p className="text-xs text-gray-500">
          {isAutoDetect 
            ? 'Layout automatically adjusts to your screen size' 
            : `Viewing in ${viewMode} mode. Click Auto to enable responsive layout.`
          }
        </p>
      </div>
    </motion.div>
  )
}

export default ViewModeSwitch
