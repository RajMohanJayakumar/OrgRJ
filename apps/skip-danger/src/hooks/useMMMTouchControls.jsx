/**
 * MMM Fingers Touch Controls Hook
 * Specialized touch controls for the MMM fingers game with hand visualization
 */

import { useState, useCallback, useRef, useEffect } from 'react'
import { getAllFingers } from '../config/mmmConfig'

const useMMMTouchControls = () => {
  const [isMobile, setIsMobile] = useState(false)
  const [activeFingers, setActiveFingers] = useState(new Set())
  const [handOrientation, setHandOrientation] = useState('horizontal') // horizontal, vertical
  const [handSize, setHandSize] = useState('medium') // small, medium, large
  const [touchFeedback, setTouchFeedback] = useState(true)

  const fingers = getAllFingers()
  const touchStartRef = useRef({})

  // Detect mobile device and screen size
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                           window.innerWidth <= 768 ||
                           ('ontouchstart' in window)
      setIsMobile(isMobileDevice)

      // Auto-adjust hand size based on screen
      if (window.innerWidth < 480) {
        setHandSize('small')
      } else if (window.innerWidth < 768) {
        setHandSize('medium')
      } else {
        setHandSize('large')
      }

      // Auto-adjust orientation based on screen ratio
      if (window.innerHeight > window.innerWidth) {
        setHandOrientation('vertical')
      } else {
        setHandOrientation('horizontal')
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    window.addEventListener('orientationchange', checkMobile)
    
    return () => {
      window.removeEventListener('resize', checkMobile)
      window.removeEventListener('orientationchange', checkMobile)
    }
  }, [])

  // Handle finger press
  const handleFingerPress = useCallback((finger, onFingerPress) => {
    setActiveFingers(prev => new Set([...prev, finger.id]))
    
    if (touchFeedback && navigator.vibrate) {
      navigator.vibrate(50)
    }
    
    onFingerPress && onFingerPress(finger)
  }, [touchFeedback])

  // Handle finger release
  const handleFingerRelease = useCallback((finger, onFingerRelease) => {
    setActiveFingers(prev => {
      const newSet = new Set(prev)
      newSet.delete(finger.id)
      return newSet
    })
    
    onFingerRelease && onFingerRelease(finger)
  }, [])

  // Virtual hand component
  const VirtualHands = useCallback(({ 
    onFingerPress, 
    onFingerRelease, 
    highlightedFingers = [], 
    disabledFingers = [],
    className = '',
    showLabels = false,
    colorMap = {}
  }) => {
    if (!isMobile) return null

    const sizeClasses = {
      small: { 
        container: 'w-80 h-48', 
        finger: 'w-8 h-12', 
        thumb: 'w-10 h-8',
        text: 'text-xs',
        gap: 'gap-1'
      },
      medium: { 
        container: 'w-96 h-56', 
        finger: 'w-10 h-16', 
        thumb: 'w-12 h-10',
        text: 'text-sm',
        gap: 'gap-2'
      },
      large: { 
        container: 'w-112 h-64', 
        finger: 'w-12 h-20', 
        thumb: 'w-14 h-12',
        text: 'text-base',
        gap: 'gap-3'
      }
    }

    const currentSize = sizeClasses[handSize] || sizeClasses.medium
    const isVertical = handOrientation === 'vertical'

    const getFingerStyle = (finger) => {
      const isActive = activeFingers.has(finger.id)
      const isHighlighted = highlightedFingers.includes(finger.id)
      const isDisabled = disabledFingers.includes(finger.id)
      const customColor = colorMap[finger.id]

      let baseClasses = 'rounded-full border-2 flex items-center justify-center font-bold transition-all duration-200 select-none shadow-lg'
      
      if (isDisabled) {
        baseClasses += ' bg-gray-300 border-gray-400 text-gray-500 cursor-not-allowed'
      } else if (isActive) {
        baseClasses += ' bg-blue-500 border-blue-600 text-white scale-95 shadow-inner'
      } else if (isHighlighted) {
        baseClasses += ` ${customColor ? `bg-[${customColor}]` : 'bg-yellow-400'} border-yellow-500 text-white scale-105 animate-pulse`
      } else {
        baseClasses += ' bg-white/90 border-gray-300 text-gray-700 hover:bg-gray-100 active:scale-95'
      }

      return baseClasses
    }

    const renderHand = (handFingers, handLabel, isLeft = true) => (
      <div className={`flex flex-col items-center ${currentSize.gap}`}>
        {showLabels && (
          <div className={`${currentSize.text} font-semibold text-white mb-2`}>
            {handLabel}
          </div>
        )}
        <div className={`relative ${isVertical ? 'flex flex-col' : 'flex flex-row'} ${currentSize.gap}`}>
          {/* Thumb */}
          <button
            className={`${getFingerStyle(handFingers[0])} ${currentSize.thumb} ${isLeft ? 'order-first' : 'order-last'}`}
            onTouchStart={(e) => {
              e.preventDefault()
              handleFingerPress(handFingers[0], onFingerPress)
            }}
            onTouchEnd={(e) => {
              e.preventDefault()
              handleFingerRelease(handFingers[0], onFingerRelease)
            }}
            onMouseDown={() => handleFingerPress(handFingers[0], onFingerPress)}
            onMouseUp={() => handleFingerRelease(handFingers[0], onFingerRelease)}
            onMouseLeave={() => handleFingerRelease(handFingers[0], onFingerRelease)}
            disabled={disabledFingers.includes(handFingers[0].id)}
          >
            👍
          </button>
          
          {/* Other fingers */}
          <div className={`flex ${isVertical ? 'flex-col' : 'flex-row'} ${currentSize.gap}`}>
            {handFingers.slice(1).map((finger, index) => (
              <button
                key={finger.id}
                className={`${getFingerStyle(finger)} ${currentSize.finger}`}
                onTouchStart={(e) => {
                  e.preventDefault()
                  handleFingerPress(finger, onFingerPress)
                }}
                onTouchEnd={(e) => {
                  e.preventDefault()
                  handleFingerRelease(finger, onFingerRelease)
                }}
                onMouseDown={() => handleFingerPress(finger, onFingerPress)}
                onMouseUp={() => handleFingerRelease(finger, onFingerRelease)}
                onMouseLeave={() => handleFingerRelease(finger, onFingerRelease)}
                disabled={disabledFingers.includes(finger.id)}
              >
                {showLabels ? (index + 1) : ''}
              </button>
            ))}
          </div>
        </div>
      </div>
    )

    const leftHandFingers = fingers.slice(0, 5)
    const rightHandFingers = fingers.slice(5, 10)

    return (
      <div className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 ${className}`} style={{ zIndex: 1000 }}>
        <div className={`${currentSize.container} bg-black/20 backdrop-blur-sm rounded-2xl p-4 flex ${isVertical ? 'flex-col' : 'flex-row'} justify-center items-center ${currentSize.gap}`}>
          {renderHand(leftHandFingers, 'Left Hand', true)}
          {renderHand(rightHandFingers, 'Right Hand', false)}
        </div>
      </div>
    )
  }, [isMobile, handSize, handOrientation, activeFingers, handleFingerPress, handleFingerRelease, fingers])

  // Simplified finger buttons for compact layouts
  const FingerButtons = useCallback(({ 
    onFingerPress, 
    layout = 'grid', // grid, row, circle
    size = 'medium',
    className = ''
  }) => {
    if (!isMobile) return null

    const sizeClasses = {
      small: 'w-12 h-12 text-sm',
      medium: 'w-16 h-16 text-base',
      large: 'w-20 h-20 text-lg'
    }

    const layoutClasses = {
      grid: 'grid grid-cols-5 gap-2',
      row: 'flex flex-row gap-2 overflow-x-auto',
      circle: 'flex flex-wrap justify-center gap-2'
    }

    return (
      <div className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 ${className}`} style={{ zIndex: 1000 }}>
        <div className={`bg-black/20 backdrop-blur-sm rounded-2xl p-4 ${layoutClasses[layout]}`}>
          {fingers.map((finger, index) => (
            <button
              key={finger.id}
              className={`${sizeClasses[size]} bg-white/90 border-2 border-gray-300 rounded-full flex items-center justify-center font-bold text-gray-700 active:bg-blue-500 active:text-white active:scale-95 transition-all duration-150 select-none shadow-lg`}
              onTouchStart={(e) => {
                e.preventDefault()
                handleFingerPress(finger, onFingerPress)
              }}
              onTouchEnd={(e) => {
                e.preventDefault()
                handleFingerRelease(finger, onFingerRelease)
              }}
              onMouseDown={() => handleFingerPress(finger, onFingerPress)}
              onMouseUp={() => handleFingerRelease(finger, onFingerRelease)}
              onMouseLeave={() => handleFingerRelease(finger, onFingerRelease)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    )
  }, [isMobile, fingers, handleFingerPress, handleFingerRelease])

  // Settings panel for customization
  const TouchControlSettings = useCallback(({ onClose }) => {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
          <h3 className="text-lg font-bold mb-4">Touch Controls</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Hand Size</label>
              <select 
                value={handSize} 
                onChange={(e) => setHandSize(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Orientation</label>
              <select 
                value={handOrientation} 
                onChange={(e) => setHandOrientation(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="horizontal">Horizontal</option>
                <option value="vertical">Vertical</option>
              </select>
            </div>
            
            <div>
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  checked={touchFeedback} 
                  onChange={(e) => setTouchFeedback(e.target.checked)}
                  className="mr-2"
                />
                Touch Feedback
              </label>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="w-full mt-6 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Done
          </button>
        </div>
      </div>
    )
  }, [handSize, handOrientation, touchFeedback])

  return {
    // State
    isMobile,
    activeFingers,
    handOrientation,
    handSize,
    touchFeedback,

    // Components
    VirtualHands,
    FingerButtons,
    TouchControlSettings,

    // Actions
    handleFingerPress,
    handleFingerRelease,
    setHandOrientation,
    setHandSize,
    setTouchFeedback,

    // Utilities
    fingers
  }
}

export default useMMMTouchControls
