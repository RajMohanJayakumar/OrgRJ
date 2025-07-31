import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useGameState from '../hooks/useGameState'
import useArcadeSound from '../hooks/useArcadeSound'
import useMobileControls from '../hooks/useMobileControls'

/**
 * Zen Garden Game - Meditative Stress Relief
 * Create beautiful sand patterns for relaxation
 */
export default function ZenGardenGame() {
  // Game state management
  const {
    gameState,
    isPlaying,
    isInMenu,
    startGame: startGameState,
    resetGame
  } = useGameState('menu')
  
  // Sound management
  const { soundEnabled, playSound, toggleSound } = useArcadeSound(true)
  
  // Mobile controls
  const { isMobile, SwipeArea, MobileGameLayout, MobileGameArea } = useMobileControls()
  
  // Game state
  const [sandPattern, setSandPattern] = useState([])
  const [currentTool, setCurrentTool] = useState('rake')
  const [brushSize, setBrushSize] = useState(3)
  const [isDrawing, setIsDrawing] = useState(false)
  const [zenScore, setZenScore] = useState(0)
  const [sessionTime, setSessionTime] = useState(0)
  const canvasRef = useRef()
  const lastPositionRef = useRef({ x: 0, y: 0 })

  // Tools available
  const tools = [
    { id: 'rake', name: 'Rake', icon: '🔱', description: 'Create flowing lines' },
    { id: 'stone', name: 'Stone', icon: '🪨', description: 'Place decorative stones' },
    { id: 'water', name: 'Water', icon: '💧', description: 'Add water ripples' },
    { id: 'flower', name: 'Flower', icon: '🌸', description: 'Plant beautiful flowers' },
    { id: 'clear', name: 'Clear', icon: '🧹', description: 'Clear the garden' }
  ]

  // Zen patterns for inspiration
  const zenPatterns = [
    'Concentric circles for inner peace',
    'Flowing waves for tranquility',
    'Spiral patterns for meditation',
    'Parallel lines for focus',
    'Random organic shapes for creativity'
  ]

  // Handle drawing on canvas
  const handleDraw = useCallback((x, y, isStart = false) => {
    if (!canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const canvasX = x - rect.left
    const canvasY = y - rect.top

    if (isStart) {
      lastPositionRef.current = { x: canvasX, y: canvasY }
      setIsDrawing(true)
    }

    if (!isDrawing && !isStart) return

    const newElement = {
      id: Date.now() + Math.random(),
      type: currentTool,
      x: canvasX,
      y: canvasY,
      size: brushSize,
      timestamp: Date.now()
    }

    // Create smooth lines for rake tool
    if (currentTool === 'rake' && !isStart) {
      const lastPos = lastPositionRef.current
      const distance = Math.sqrt(
        Math.pow(canvasX - lastPos.x, 2) + Math.pow(canvasY - lastPos.y, 2)
      )
      
      // Interpolate points for smooth lines
      const steps = Math.max(1, Math.floor(distance / 5))
      const newElements = []
      
      for (let i = 0; i <= steps; i++) {
        const t = i / steps
        const interpX = lastPos.x + (canvasX - lastPos.x) * t
        const interpY = lastPos.y + (canvasY - lastPos.y) * t
        
        newElements.push({
          ...newElement,
          id: newElement.id + i,
          x: interpX,
          y: interpY
        })
      }
      
      setSandPattern(prev => [...prev, ...newElements])
    } else {
      setSandPattern(prev => [...prev, newElement])
    }

    lastPositionRef.current = { x: canvasX, y: canvasY }
    
    // Increase zen score
    setZenScore(prev => prev + 1)
    
    // Play gentle sound
    if (Math.random() < 0.1) { // Occasional gentle sounds
      playSound('paddle') // Soft sound
    }
  }, [currentTool, brushSize, isDrawing, playSound])

  // Mouse/touch event handlers
  const handleMouseDown = (e) => {
    e.preventDefault()
    handleDraw(e.clientX, e.clientY, true)
  }

  const handleMouseMove = (e) => {
    e.preventDefault()
    if (isDrawing) {
      handleDraw(e.clientX, e.clientY)
    }
  }

  const handleMouseUp = () => {
    setIsDrawing(false)
  }

  const handleTouchStart = (e) => {
    e.preventDefault()
    const touch = e.touches[0]
    handleDraw(touch.clientX, touch.clientY, true)
  }

  const handleTouchMove = (e) => {
    e.preventDefault()
    if (isDrawing && e.touches[0]) {
      const touch = e.touches[0]
      handleDraw(touch.clientX, touch.clientY)
    }
  }

  const handleTouchEnd = () => {
    setIsDrawing(false)
  }

  // Clear garden
  const clearGarden = () => {
    setSandPattern([])
    setZenScore(0)
  }

  // Session timer
  useEffect(() => {
    if (!isPlaying) return

    const timer = setInterval(() => {
      setSessionTime(prev => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [isPlaying])

  // Start game
  const startGame = () => {
    startGameState()
    setSandPattern([])
    setZenScore(0)
    setSessionTime(0)
    setCurrentTool('rake')
    setBrushSize(3)
  }

  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Get element style based on type
  const getElementStyle = (element) => {
    const baseStyle = {
      position: 'absolute',
      left: element.x - element.size / 2,
      top: element.y - element.size / 2,
      width: element.size,
      height: element.size,
      borderRadius: '50%',
      pointerEvents: 'none'
    }

    switch (element.type) {
      case 'rake':
        return {
          ...baseStyle,
          backgroundColor: '#d4b896',
          opacity: 0.7,
          borderRadius: '50%'
        }
      case 'stone':
        return {
          ...baseStyle,
          backgroundColor: '#6b7280',
          borderRadius: '30%',
          width: element.size * 1.5,
          height: element.size * 1.2
        }
      case 'water':
        return {
          ...baseStyle,
          backgroundColor: '#3b82f6',
          opacity: 0.4,
          animation: 'ripple 2s infinite'
        }
      case 'flower':
        return {
          ...baseStyle,
          backgroundColor: '#ec4899',
          opacity: 0.8,
          borderRadius: '0',
          clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
        }
      default:
        return baseStyle
    }
  }

  // Menu Screen
  if (isInMenu) {
    return (
      <MobileGameLayout className="bg-gradient-to-br from-amber-900 via-orange-900 to-yellow-900">
        <div className="flex items-center justify-center min-h-screen">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center text-white max-w-md"
        >
          <motion.h1 
            className="text-5xl font-bold mb-4 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            🏯 Zen Garden
          </motion.h1>
          
          <p className="text-orange-200 mb-6">
            Create beautiful sand patterns for meditation and stress relief. Find your inner peace.
          </p>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6">
            <div className="text-sm text-orange-200 mb-2">Inspiration</div>
            <div className="text-sm text-yellow-400">
              {zenPatterns[Math.floor(Math.random() * zenPatterns.length)]}
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startGame}
            className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-8 py-3 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 mb-4"
          >
            Enter Garden
          </motion.button>
          
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={toggleSound}
              className={`p-2 rounded-lg transition-colors ${
                soundEnabled ? 'bg-amber-600 text-white' : 'bg-gray-600 text-gray-300'
              }`}
            >
              {soundEnabled ? '🔊' : '🔇'}
            </button>
          </div>
        </motion.div>
        </div>
      </MobileGameLayout>
    )
  }

  // Game Screen
  return (
    <MobileGameLayout className="bg-gradient-to-br from-amber-900 via-orange-900 to-yellow-900">
      <div className={`mx-auto h-full flex flex-col ${isMobile ? 'max-w-full px-2' : 'max-w-6xl'}`}>
        {/* Game HUD */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4 text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-4">
            <div>
              <div className="text-sm text-orange-200">Zen Score</div>
              <div className="text-xl font-bold text-yellow-400">{zenScore}</div>
            </div>
            <div>
              <div className="text-sm text-orange-200">Session Time</div>
              <div className="text-xl font-bold text-amber-400">{formatTime(sessionTime)}</div>
            </div>
            <div>
              <div className="text-sm text-orange-200">Elements</div>
              <div className="text-xl font-bold text-orange-400">{sandPattern.length}</div>
            </div>
            <div>
              <div className="text-sm text-orange-200">Brush Size</div>
              <div className="text-xl font-bold text-yellow-400">{brushSize}</div>
            </div>
          </div>

          {/* Tools */}
          <div className="flex flex-wrap gap-2 justify-center">
            {tools.map(tool => (
              <button
                key={tool.id}
                onClick={() => tool.id === 'clear' ? clearGarden() : setCurrentTool(tool.id)}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                  currentTool === tool.id 
                    ? 'bg-amber-600 text-white shadow-lg' 
                    : 'bg-white/20 text-orange-200 hover:bg-white/30'
                }`}
                title={tool.description}
              >
                {tool.icon} {tool.name}
              </button>
            ))}
          </div>

          {/* Brush Size Control */}
          <div className="flex items-center justify-center gap-4 mt-4">
            <span className="text-orange-200 text-sm">Brush Size:</span>
            <input
              type="range"
              min="1"
              max="10"
              value={brushSize}
              onChange={(e) => setBrushSize(parseInt(e.target.value))}
              className="w-24"
            />
          </div>
        </div>

        {/* Garden Canvas */}
        <MobileGameArea className="flex-1">
          <div
            ref={canvasRef}
            className="h-full bg-gradient-to-br from-amber-100 to-yellow-200 rounded-xl relative overflow-hidden border-4 border-amber-600/50 cursor-crosshair"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Sand texture background */}
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.1) 1px, transparent 0)`,
              backgroundSize: '20px 20px'
            }}
          />

          {/* Rendered elements */}
          <AnimatePresence>
            {sandPattern.map(element => (
              <motion.div
                key={element.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                style={getElementStyle(element)}
              />
            ))}
          </AnimatePresence>

          {/* Zen message overlay */}
          {zenScore > 100 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-amber-800 text-2xl font-bold text-center bg-white/80 rounded-xl p-4"
            >
              🧘‍♀️ Finding Inner Peace 🧘‍♂️
            </motion.div>
          )}
          </div>
        </MobileGameArea>

        {/* Instructions */}
        <div className={`text-center text-orange-200 mt-4 ${isMobile ? 'text-xs px-2' : 'text-sm'}`}>
          {isMobile ? 'Touch and drag to create patterns' : 'Click and drag to create beautiful sand patterns • Use tools to add variety'}
        </div>
      </div>
    </MobileGameLayout>
  )
}
