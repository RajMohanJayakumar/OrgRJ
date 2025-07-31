import React, { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RotateCcw, Volume2, VolumeX, Settings, Palette } from 'lucide-react'

/**
 * Interactive Bubble Wrap Component
 * A stress-relief feature for the PWA with customizable bubble grid
 */
export default function BubbleWrap() {
  const [bubbles, setBubbles] = useState([])
  const [poppedCount, setPoppedCount] = useState(0)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [gridSize, setGridSize] = useState({ rows: 12, cols: 8 })
  const [showSettings, setShowSettings] = useState(false)
  const [bubbleSize, setBubbleSize] = useState('medium')
  const [bubbleTheme, setBubbleTheme] = useState('blue')
  const [isDragging, setIsDragging] = useState(false)
  const [draggedBubbles, setDraggedBubbles] = useState(new Set())
  const audioContextRef = useRef(null)
  const gridRef = useRef(null)

  // Initialize bubbles grid
  const initializeBubbles = useCallback(() => {
    const newBubbles = []
    for (let row = 0; row < gridSize.rows; row++) {
      for (let col = 0; col < gridSize.cols; col++) {
        newBubbles.push({
          id: `${row}-${col}`,
          row,
          col,
          popped: false,
          popTime: null
        })
      }
    }
    setBubbles(newBubbles)
    setPoppedCount(0)
  }, [gridSize])

  // Initialize on mount
  useEffect(() => {
    initializeBubbles()
  }, [initializeBubbles])

  // Create pop sound using Web Audio API
  const createPopSound = useCallback(() => {
    if (!soundEnabled) return

    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
      }

      const audioContext = audioContextRef.current
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      // Create a pop sound with frequency sweep
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.1)

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.1)
    } catch (error) {
      console.log('Audio not supported:', error)
    }
  }, [soundEnabled])

  // Pop a bubble
  const popBubble = useCallback((bubbleId) => {
    setBubbles(prev => {
      const newBubbles = prev.map(bubble =>
        bubble.id === bubbleId && !bubble.popped
          ? { ...bubble, popped: true, popTime: Date.now() }
          : bubble
      )
      return newBubbles
    })
    setPoppedCount(prev => prev + 1)
    createPopSound()
  }, [createPopSound])

  // Pop multiple bubbles (for drag functionality)
  const popMultipleBubbles = useCallback((bubbleIds) => {
    const newlyPopped = []
    setBubbles(prev => {
      const newBubbles = prev.map(bubble => {
        if (bubbleIds.includes(bubble.id) && !bubble.popped) {
          newlyPopped.push(bubble.id)
          return { ...bubble, popped: true, popTime: Date.now() }
        }
        return bubble
      })
      return newBubbles
    })

    if (newlyPopped.length > 0) {
      setPoppedCount(prev => prev + newlyPopped.length)
      // Create multiple pop sounds with slight delays
      newlyPopped.forEach((_, index) => {
        setTimeout(() => createPopSound(), index * 50)
      })
    }
  }, [createPopSound])

  // Handle mouse events for drag functionality
  const handleMouseDown = useCallback((e) => {
    setIsDragging(true)
    setDraggedBubbles(new Set())
    e.preventDefault()
  }, [])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    setDraggedBubbles(new Set())
  }, [])

  const handleMouseEnter = useCallback((bubbleId) => {
    if (isDragging && !draggedBubbles.has(bubbleId)) {
      const bubble = bubbles.find(b => b.id === bubbleId)
      if (bubble && !bubble.popped) {
        setDraggedBubbles(prev => new Set([...prev, bubbleId]))
        popBubble(bubbleId)
      }
    }
  }, [isDragging, draggedBubbles, bubbles, popBubble])



  // Add global mouse event listeners
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false)
      setDraggedBubbles(new Set())
    }

    document.addEventListener('mouseup', handleGlobalMouseUp)
    document.addEventListener('mouseleave', handleGlobalMouseUp)

    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp)
      document.removeEventListener('mouseleave', handleGlobalMouseUp)
    }
  }, [])

  // Add touch event listeners to the grid element
  useEffect(() => {
    const gridElement = gridRef.current
    if (!gridElement) return

    const handleTouchStart = (e) => {
      setIsDragging(true)
      setDraggedBubbles(new Set())
      // Prevent scrolling by setting overflow hidden
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
    }

    const handleTouchEnd = () => {
      setIsDragging(false)
      setDraggedBubbles(new Set())
      // Re-enable scrolling
      document.body.style.overflow = 'auto'
      document.documentElement.style.overflow = 'auto'
    }

    const handleTouchMove = (e) => {
      if (isDragging) {
        e.preventDefault()
        const touch = e.touches[0]
        const element = document.elementFromPoint(touch.clientX, touch.clientY)
        if (element && element.dataset.bubbleId) {
          const bubbleId = element.dataset.bubbleId
          if (!draggedBubbles.has(bubbleId)) {
            const bubble = bubbles.find(b => b.id === bubbleId)
            if (bubble && !bubble.popped) {
              setDraggedBubbles(prev => new Set([...prev, bubbleId]))
              popBubble(bubbleId)
            }
          }
        }
      }
    }

    gridElement.addEventListener('touchstart', handleTouchStart, { passive: true })
    gridElement.addEventListener('touchend', handleTouchEnd, { passive: true })
    gridElement.addEventListener('touchmove', handleTouchMove, { passive: false })

    return () => {
      gridElement.removeEventListener('touchstart', handleTouchStart)
      gridElement.removeEventListener('touchend', handleTouchEnd)
      gridElement.removeEventListener('touchmove', handleTouchMove)
      // Ensure overflow is reset on cleanup
      document.body.style.overflow = 'auto'
      document.documentElement.style.overflow = 'auto'
    }
  }, [isDragging, draggedBubbles, bubbles, popBubble])

  // Reset all bubbles
  const resetBubbles = useCallback(() => {
    initializeBubbles()
  }, [initializeBubbles])

  // Bubble size configurations
  const sizeConfigs = {
    small: { size: 'w-8 h-8', gap: 'gap-1' },
    medium: { size: 'w-12 h-12', gap: 'gap-2' },
    large: { size: 'w-16 h-16', gap: 'gap-3' }
  }

  // Bubble theme configurations
  const themeConfigs = {
    blue: {
      gradient: 'from-blue-200 via-blue-300 to-blue-400',
      border: 'border-blue-300',
      name: 'Ocean Blue'
    },
    pink: {
      gradient: 'from-pink-200 via-pink-300 to-pink-400',
      border: 'border-pink-300',
      name: 'Bubblegum Pink'
    },
    green: {
      gradient: 'from-green-200 via-green-300 to-green-400',
      border: 'border-green-300',
      name: 'Mint Green'
    },
    purple: {
      gradient: 'from-purple-200 via-purple-300 to-purple-400',
      border: 'border-purple-300',
      name: 'Lavender Purple'
    },
    rainbow: {
      gradient: 'from-red-200 via-yellow-200 via-green-200 via-blue-200 to-purple-200',
      border: 'border-indigo-300',
      name: 'Rainbow Mix'
    }
  }

  const currentSizeConfig = sizeConfigs[bubbleSize]
  const currentThemeConfig = themeConfigs[bubbleTheme]

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 select-none"
      style={{
        cursor: isDragging ? 'url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIGZpbGw9IiNmZjAwMDAiIGZpbGwtb3BhY2l0eT0iMC44Ii8+CjxwYXRoIGQ9Ik04IDhMMTYgMTZNMTYgOEw4IDE2IiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L3N2Zz4K") 12 12, crosshair' : 'url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIGZpbGw9IiMzYjgyZjYiIGZpbGwtb3BhY2l0eT0iMC44Ii8+CjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjMiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=") 12 12, pointer'
      }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🫧 Bubble Wrap Stress Relief
          </h1>
          <p className="text-gray-600">
            Pop bubbles to relax! Perfect for taking a break from financial calculations.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap justify-center items-center gap-4 mb-6">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
            <span className="text-sm font-medium text-gray-700">Popped:</span>
            <span className="text-lg font-bold text-blue-600">{poppedCount}</span>
            <span className="text-sm text-gray-500">/ {bubbles.length}</span>
          </div>

          <button
            onClick={resetBubbles}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              soundEnabled 
                ? 'bg-green-600 text-white hover:bg-green-700' 
                : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            Sound
          </button>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Settings className="w-4 h-4" />
            Settings
          </button>
        </div>

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-lg shadow-lg p-6 mb-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Bubble Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Grid Rows
                  </label>
                  <input
                    type="range"
                    min="6"
                    max="20"
                    value={gridSize.rows}
                    onChange={(e) => setGridSize(prev => ({ ...prev, rows: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                  <span className="text-sm text-gray-500">{gridSize.rows} rows</span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Grid Columns
                  </label>
                  <input
                    type="range"
                    min="4"
                    max="12"
                    value={gridSize.cols}
                    onChange={(e) => setGridSize(prev => ({ ...prev, cols: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                  <span className="text-sm text-gray-500">{gridSize.cols} columns</span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bubble Size
                  </label>
                  <select
                    value={bubbleSize}
                    onChange={(e) => setBubbleSize(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Palette className="w-4 h-4 inline mr-1" />
                    Bubble Theme
                  </label>
                  <select
                    value={bubbleTheme}
                    onChange={(e) => setBubbleTheme(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.entries(themeConfigs).map(([key, config]) => (
                      <option key={key} value={key}>{config.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress Bar */}
        <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm text-gray-500">
              {Math.round((poppedCount / bubbles.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(poppedCount / bubbles.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg p-4 mb-6 border border-blue-200">
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-700">
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">👆</span>
              <span>Click to pop</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs">🖱️</span>
              <span>Drag to burst multiple</span>
            </div>
          </div>
        </div>

        {/* Bubble Grid */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div
            ref={gridRef}
            className={`grid ${currentSizeConfig.gap} justify-center`}
            style={{
              gridTemplateColumns: `repeat(${gridSize.cols}, minmax(0, 1fr))`,
              maxWidth: 'fit-content',
              margin: '0 auto',
              touchAction: 'none' // Prevent default touch behaviors
            }}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
          >
            {bubbles.map((bubble) => (
              <Bubble
                key={bubble.id}
                bubble={bubble}
                onPop={popBubble}
                onMouseEnter={handleMouseEnter}
                sizeClass={currentSizeConfig.size}
                themeConfig={currentThemeConfig}
                isDragging={isDragging}
              />
            ))}
          </div>
        </div>

        {/* Completion Message */}
        <AnimatePresence>
          {poppedCount === bubbles.length && bubbles.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              onClick={resetBubbles}
            >
              <div className="bg-white rounded-xl p-8 text-center shadow-2xl">
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  All Bubbles Popped!
                </h2>
                <p className="text-gray-600 mb-4">
                  Great job! You popped all {bubbles.length} bubbles.
                </p>
                <button
                  onClick={resetBubbles}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Pop More Bubbles!
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// Individual Bubble Component
function Bubble({ bubble, onPop, onMouseEnter, sizeClass, themeConfig, isDragging }) {
  const handleClick = () => {
    if (!bubble.popped) {
      onPop(bubble.id)
    }
  }

  const handleMouseEnter = () => {
    if (onMouseEnter) {
      onMouseEnter(bubble.id)
    }
  }

  return (
    <motion.button
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      className={`${sizeClass} relative focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full`}
      whileHover={!bubble.popped && !isDragging ? { scale: 1.1 } : {}}
      whileTap={!bubble.popped ? { scale: 0.95 } : {}}
      disabled={bubble.popped}
      data-bubble-id={bubble.id}
      style={{
        cursor: isDragging ? 'crosshair' : 'pointer',
        userSelect: 'none',
        touchAction: 'none'
      }}
    >
      <AnimatePresence>
        {!bubble.popped && (
          <motion.div
            initial={{ scale: 1, opacity: 1 }}
            exit={{
              scale: 0,
              opacity: 0,
              rotate: 180,
              transition: { duration: 0.3, ease: "easeOut" }
            }}
            className={`w-full h-full rounded-full bg-gradient-to-br ${themeConfig.gradient} border-2 ${themeConfig.border} shadow-lg relative overflow-hidden`}
          >
            {/* Bubble highlight */}
            <div className="absolute top-1 left-1 w-2 h-2 bg-white bg-opacity-60 rounded-full" />

            {/* Bubble shine effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white from-10% via-transparent via-30% to-transparent rounded-full opacity-30" />

            {/* Extra sparkle for rainbow theme */}
            {themeConfig.name === 'Rainbow Mix' && (
              <div className="absolute top-2 right-1 w-1 h-1 bg-white bg-opacity-80 rounded-full animate-pulse" />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Popped state with burst effect */}
      {bubble.popped && (
        <motion.div
          initial={{ scale: 0, rotate: 0 }}
          animate={{ scale: 1, rotate: 360 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full h-full rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center"
        >
          <motion.span
            className="text-gray-400 text-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            💥
          </motion.span>
        </motion.div>
      )}
    </motion.button>
  )
}
