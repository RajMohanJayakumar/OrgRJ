import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Palette, RotateCcw, Download, Lightbulb, Sparkles, Heart } from 'lucide-react'

/**
 * Mindful Doodling - Therapeutic drawing with guided prompts
 * Stress relief through creative expression and mindful drawing
 */
function MindfulDoodling() {
  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [brushSize, setBrushSize] = useState(5)
  const [brushColor, setBrushColor] = useState('#6366f1')
  const [currentPrompt, setCurrentPrompt] = useState(null)
  const [completedPrompts, setCompletedPrompts] = useState([])
  const [sessionTime, setSessionTime] = useState(0)
  const [strokeCount, setStrokeCount] = useState(0)
  const [showPrompts, setShowPrompts] = useState(true)
  const [mood, setMood] = useState('calm')
  const [drawingMode, setDrawingMode] = useState('brush') // 'brush', 'stamp', or 'eraser'
  const [selectedStamp, setSelectedStamp] = useState('heart')
  const [placedStamps, setPlacedStamps] = useState([])
  const [draggedStamp, setDraggedStamp] = useState(null)
  const [stampSize, setStampSize] = useState(30)

  const prompts = {
    emotions: [
      { id: 1, text: "Draw how you're feeling right now", icon: "💭" },
      { id: 2, text: "Sketch your stress as shapes and lines", icon: "⚡" },
      { id: 3, text: "Draw your happy place", icon: "🌈" },
      { id: 4, text: "Create patterns that make you feel calm", icon: "🌊" },
      { id: 5, text: "Draw your worries floating away", icon: "☁️" }
    ],
    nature: [
      { id: 6, text: "Draw a peaceful garden", icon: "🌸" },
      { id: 7, text: "Sketch flowing water", icon: "💧" },
      { id: 8, text: "Create a mandala inspired by flowers", icon: "🌺" },
      { id: 9, text: "Draw the wind as you imagine it", icon: "🍃" },
      { id: 10, text: "Sketch a tree that represents growth", icon: "🌳" }
    ],
    abstract: [
      { id: 11, text: "Draw your energy as colors and shapes", icon: "✨" },
      { id: 12, text: "Create flowing, organic patterns", icon: "🌀" },
      { id: 13, text: "Draw music as visual patterns", icon: "🎵" },
      { id: 14, text: "Sketch your dreams in abstract form", icon: "💫" },
      { id: 15, text: "Create a color symphony", icon: "🎨" }
    ]
  }

  const colors = [
    '#ffffff', '#000000', '#6366f1', '#8b5cf6', '#ec4899',
    '#ef4444', '#f97316', '#eab308', '#22c55e', '#10b981',
    '#06b6d4', '#3b82f6', '#1f2937', '#374151', '#6b7280'
  ]

  const moods = {
    calm: { name: 'Calm', color: '#06b6d4', bg: 'from-cyan-100 to-blue-100' },
    energetic: { name: 'Energetic', color: '#f97316', bg: 'from-orange-100 to-yellow-100' },
    peaceful: { name: 'Peaceful', color: '#22c55e', bg: 'from-green-100 to-emerald-100' },
    creative: { name: 'Creative', color: '#8b5cf6', bg: 'from-purple-100 to-pink-100' }
  }

  const stamps = {
    // Emotions
    heart: { emoji: '❤️', name: 'Heart', category: 'emotions' },
    smile: { emoji: '😊', name: 'Smile', category: 'emotions' },
    star: { emoji: '⭐', name: 'Star', category: 'emotions' },
    peace: { emoji: '☮️', name: 'Peace', category: 'emotions' },

    // Nature
    flower: { emoji: '🌸', name: 'Flower', category: 'nature' },
    tree: { emoji: '🌳', name: 'Tree', category: 'nature' },
    sun: { emoji: '☀️', name: 'Sun', category: 'nature' },
    moon: { emoji: '🌙', name: 'Moon', category: 'nature' },
    butterfly: { emoji: '🦋', name: 'Butterfly', category: 'nature' },

    // Symbols
    infinity: { emoji: '∞', name: 'Infinity', category: 'symbols' },
    diamond: { emoji: '💎', name: 'Diamond', category: 'symbols' },
    spiral: { emoji: '🌀', name: 'Spiral', category: 'symbols' },
    lotus: { emoji: '🪷', name: 'Lotus', category: 'symbols' },

    // Fun
    rainbow: { emoji: '🌈', name: 'Rainbow', category: 'fun' },
    sparkles: { emoji: '✨', name: 'Sparkles', category: 'fun' },
    balloon: { emoji: '🎈', name: 'Balloon', category: 'fun' },
    music: { emoji: '🎵', name: 'Music', category: 'fun' }
  }

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const rect = canvas.getBoundingClientRect()

    // Set canvas size to match display size
    canvas.width = rect.width
    canvas.height = rect.height

    // Set canvas background
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Set drawing properties
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
  }, [])

  // Session timer
  useEffect(() => {
    const interval = setInterval(() => {
      setSessionTime(prev => prev + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const getCoordinates = useCallback((e) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()

    if (e.touches && e.touches.length > 0) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      }
    }

    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }
  }, [])

  const placeStamp = useCallback((x, y) => {
    const stamp = stamps[selectedStamp]
    const newStamp = {
      id: Date.now() + Math.random(),
      emoji: stamp.emoji,
      x: x,
      y: y,
      size: stampSize,
      type: selectedStamp
    }

    setPlacedStamps(prev => [...prev, newStamp])
    setStrokeCount(prev => prev + 1)
  }, [selectedStamp, stampSize])

  const removeStamp = useCallback((stampId) => {
    setPlacedStamps(prev => prev.filter(stamp => stamp.id !== stampId))
  }, [])

  const moveStamp = useCallback((stampId, newX, newY) => {
    setPlacedStamps(prev => prev.map(stamp =>
      stamp.id === stampId ? { ...stamp, x: newX, y: newY } : stamp
    ))
  }, [])

  const startDrawing = useCallback((e) => {
    e.preventDefault()

    const { x, y } = getCoordinates(e)

    if (drawingMode === 'stamp') {
      placeStamp(x, y)
      return
    }

    setIsDrawing(true)
    const ctx = canvasRef.current.getContext('2d')

    if (drawingMode === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out'
    } else {
      ctx.globalCompositeOperation = 'source-over'
    }

    ctx.beginPath()
    ctx.moveTo(x, y)

    setStrokeCount(prev => prev + 1)
  }, [getCoordinates, drawingMode, placeStamp])

  const draw = useCallback((e) => {
    if (!isDrawing || drawingMode === 'stamp') return
    e.preventDefault()

    const { x, y } = getCoordinates(e)
    const ctx = canvasRef.current.getContext('2d')

    ctx.lineWidth = drawingMode === 'eraser' ? brushSize * 2 : brushSize

    if (drawingMode === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out'
    } else {
      ctx.globalCompositeOperation = 'source-over'
      ctx.strokeStyle = brushColor
    }

    ctx.lineTo(x, y)
    ctx.stroke()
  }, [isDrawing, getCoordinates, brushSize, brushColor, drawingMode])

  const stopDrawing = useCallback(() => {
    setIsDrawing(false)
  }, [])

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    setStrokeCount(0)
    setPlacedStamps([])
  }, [])

  const downloadDrawing = useCallback(() => {
    const canvas = canvasRef.current
    const link = document.createElement('a')
    link.download = `mindful-doodle-${Date.now()}.png`
    link.href = canvas.toDataURL()
    link.click()
  }, [])

  const getRandomPrompt = (category) => {
    const categoryPrompts = prompts[category]
    const availablePrompts = categoryPrompts.filter(p => !completedPrompts.includes(p.id))
    
    if (availablePrompts.length === 0) {
      // Reset if all prompts completed
      setCompletedPrompts([])
      return categoryPrompts[Math.floor(Math.random() * categoryPrompts.length)]
    }
    
    return availablePrompts[Math.floor(Math.random() * availablePrompts.length)]
  }

  const selectPrompt = (category) => {
    const prompt = getRandomPrompt(category)
    setCurrentPrompt(prompt)
    setCompletedPrompts(prev => [...prev, prompt.id])
  }

  const completePrompt = () => {
    setCurrentPrompt(null)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const currentMood = moods[mood]

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentMood.bg} p-3 md:p-4`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">
            🎨 Mindful Doodling
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Express yourself through therapeutic drawing and creative mindfulness
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-white rounded-xl p-3 shadow-sm text-center">
            <div className="text-xl font-bold text-purple-600">{strokeCount}</div>
            <div className="text-gray-600 text-xs">Strokes</div>
          </div>
          <div className="bg-white rounded-xl p-3 shadow-sm text-center">
            <div className="text-xl font-bold text-blue-600">{formatTime(sessionTime)}</div>
            <div className="text-gray-600 text-xs">Creating</div>
          </div>
          <div className="bg-white rounded-xl p-3 shadow-sm text-center">
            <div className="text-xl font-bold text-green-600">{completedPrompts.length}</div>
            <div className="text-gray-600 text-xs">Prompts</div>
          </div>
          <div className="bg-white rounded-xl p-3 shadow-sm text-center">
            <div className="text-xl font-bold" style={{ color: currentMood.color }}>
              {currentMood.name}
            </div>
            <div className="text-gray-600 text-xs">Mood</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Drawing Canvas */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl p-4 shadow-lg">
              {/* Current Prompt */}
              <AnimatePresence>
                {currentPrompt && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="mb-4 p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{currentPrompt.icon}</span>
                        <p className="text-gray-800 font-medium">{currentPrompt.text}</p>
                      </div>
                      <button
                        onClick={completePrompt}
                        className="text-sm bg-purple-600 text-white px-3 py-1 rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        Done
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Canvas Container */}
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  className="w-full h-96 md:h-[500px] border-2 border-gray-200 rounded-lg cursor-crosshair"
                  style={{
                    touchAction: 'none',
                    WebkitTouchCallout: 'none',
                    WebkitUserSelect: 'none',
                    userSelect: 'none'
                  }}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                />

                {/* Draggable Stamps Overlay */}
                <div className="absolute inset-0 pointer-events-none">
                  {placedStamps.map((stamp) => (
                    <motion.div
                      key={stamp.id}
                      className="absolute pointer-events-auto cursor-move select-none"
                      style={{
                        left: stamp.x - stamp.size / 2,
                        top: stamp.y - stamp.size / 2,
                        fontSize: `${stamp.size}px`,
                        lineHeight: 1
                      }}
                      drag
                      dragMomentum={false}
                      onDragEnd={(event, info) => {
                        const rect = canvasRef.current.getBoundingClientRect()
                        const newX = stamp.x + info.offset.x
                        const newY = stamp.y + info.offset.y

                        // Keep stamp within canvas bounds
                        const boundedX = Math.max(stamp.size / 2, Math.min(rect.width - stamp.size / 2, newX))
                        const boundedY = Math.max(stamp.size / 2, Math.min(rect.height - stamp.size / 2, newY))

                        moveStamp(stamp.id, boundedX, boundedY)
                      }}
                      onDoubleClick={() => removeStamp(stamp.id)}
                      whileHover={{ scale: 1.1 }}
                      whileDrag={{ scale: 1.2, zIndex: 50 }}
                      title="Drag to move, double-click to remove"
                    >
                      {stamp.emoji}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Canvas Controls */}
              <div className="flex flex-wrap justify-between items-center mt-4 gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Size:</span>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      value={brushSize}
                      onChange={(e) => setBrushSize(parseInt(e.target.value))}
                      className="w-20"
                    />
                    <span className="text-sm text-gray-600">{brushSize}px</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={clearCanvas}
                    className="flex items-center gap-2 bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Clear
                  </button>
                  <button
                    onClick={downloadDrawing}
                    className="flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Controls Panel */}
          <div className="space-y-6">
            {/* Drawing Mode */}
            <div className="bg-white rounded-xl p-4 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Drawing Mode</h3>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setDrawingMode('brush')}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    drawingMode === 'brush'
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-lg mb-1">🖌️</div>
                  <div className="text-sm font-medium">Brush</div>
                </button>
                <button
                  onClick={() => setDrawingMode('stamp')}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    drawingMode === 'stamp'
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-lg mb-1">🎯</div>
                  <div className="text-sm font-medium">Stamps</div>
                </button>
                <button
                  onClick={() => setDrawingMode('eraser')}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    drawingMode === 'eraser'
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-lg mb-1">🧽</div>
                  <div className="text-sm font-medium">Eraser</div>
                </button>
              </div>
            </div>

            {/* Stamps Panel */}
            {drawingMode === 'stamp' && (
              <div className="bg-white rounded-xl p-4 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Choose Stamp</h3>
                <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
                  {Object.entries(stamps).map(([key, stamp]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedStamp(key)}
                      className={`p-2 rounded-lg border-2 transition-colors ${
                        selectedStamp === key
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      title={stamp.name}
                    >
                      <div className="text-xl">{stamp.emoji}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Palette */}
            {drawingMode === 'brush' && (
              <div className="bg-white rounded-xl p-4 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Colors
              </h3>
              <div className="grid grid-cols-5 gap-2">
                {colors.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => setBrushColor(color)}
                    className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                      brushColor === color
                        ? 'border-gray-800 scale-110'
                        : color === '#ffffff'
                          ? 'border-gray-400'
                          : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>

              {/* Size Control */}
              <div className="mt-4">
                {drawingMode === 'stamp' ? (
                  <>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Stamp Size</span>
                      <span className="text-sm text-gray-600">{stampSize}px</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="100"
                      value={stampSize}
                      onChange={(e) => setStampSize(parseInt(e.target.value))}
                      className="w-full"
                    />
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        {drawingMode === 'eraser' ? 'Eraser Size' : 'Brush Size'}
                      </span>
                      <span className="text-sm text-gray-600">{brushSize}px</span>
                    </div>
                    <input
                      type="range"
                      min="2"
                      max="50"
                      value={brushSize}
                      onChange={(e) => setBrushSize(parseInt(e.target.value))}
                      className="w-full"
                    />
                  </>
                )}
              </div>
            </div>
            )}

            {/* Mood Selection */}
            <div className="bg-white rounded-xl p-4 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Mood
              </h3>
              <div className="space-y-2">
                {Object.entries(moods).map(([key, moodData]) => (
                  <button
                    key={key}
                    onClick={() => setMood(key)}
                    className={`w-full p-2 rounded-lg text-left transition-colors ${
                      mood === key 
                        ? 'bg-gray-100 border-2 border-gray-300' 
                        : 'hover:bg-gray-50 border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: moodData.color }}
                      />
                      <span className="text-sm font-medium">{moodData.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt Categories */}
            <div className="bg-white rounded-xl p-4 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Drawing Prompts
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => selectPrompt('emotions')}
                  className="w-full p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors"
                >
                  💭 Emotions
                </button>
                <button
                  onClick={() => selectPrompt('nature')}
                  className="w-full p-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-colors"
                >
                  🌿 Nature
                </button>
                <button
                  onClick={() => selectPrompt('abstract')}
                  className="w-full p-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-colors"
                >
                  ✨ Abstract
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="text-center mt-6">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-gray-600 text-sm mb-2">
              {currentPrompt
                ? "Follow the prompt above or draw freely. Let your creativity flow!"
                : "Choose a prompt category to get started, or begin drawing freely on the canvas."
              }
            </p>
            <div className="text-xs text-gray-500 space-y-1">
              <p><strong>🖌️ Brush:</strong> Draw with colors and adjustable size</p>
              <p><strong>🎯 Stamps:</strong> Place draggable emojis (drag to move, double-click to remove)</p>
              <p><strong>🧽 Eraser:</strong> Remove parts of your drawing</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MindfulDoodling
