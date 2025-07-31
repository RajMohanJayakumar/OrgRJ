import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useGameState from '../hooks/useGameState'
import useArcadeSound from '../hooks/useArcadeSound'
import useHighScore from '../hooks/useHighScore'
import useMobileControls from '../hooks/useMobileControls'

/**
 * Color Match Game - Relaxing Color Therapy
 * Match colors for stress relief and visual satisfaction
 */
export default function ColorMatchGame() {
  // Game state management
  const {
    gameState,
    isPlaying,
    isInMenu,
    isGameOver,
    startGame: startGameState,
    endGame,
    resetGame
  } = useGameState('menu')
  
  // Sound management
  const { soundEnabled, playSound, toggleSound, SOUNDS } = useArcadeSound(true)
  
  // Score management
  const {
    currentScore,
    highScore,
    isNewHighScore,
    updateScore,
    resetScore,
    saveHighScore
  } = useHighScore('color-match')
  
  // Mobile controls
  const { isMobile, SwipeArea, MobileGameLayout, MobileGameArea } = useMobileControls()
  
  // Game state
  const [targetColor, setTargetColor] = useState({ r: 128, g: 128, b: 128 })
  const [playerColor, setPlayerColor] = useState({ r: 128, g: 128, b: 128 })
  const [level, setLevel] = useState(1)
  const [timeLeft, setTimeLeft] = useState(30)
  const [streak, setStreak] = useState(0)
  const [matches, setMatches] = useState(0)
  const [tolerance, setTolerance] = useState(30)

  // Color palettes for different moods
  const colorPalettes = {
    calm: [
      { r: 135, g: 206, b: 235 }, // Sky blue
      { r: 144, g: 238, b: 144 }, // Light green
      { r: 221, g: 160, b: 221 }, // Plum
      { r: 255, g: 182, b: 193 }, // Light pink
      { r: 176, g: 196, b: 222 }  // Light steel blue
    ],
    energetic: [
      { r: 255, g: 69, b: 0 },   // Red orange
      { r: 255, g: 215, b: 0 },  // Gold
      { r: 50, g: 205, b: 50 },  // Lime green
      { r: 255, g: 20, b: 147 }, // Deep pink
      { r: 138, g: 43, b: 226 }  // Blue violet
    ],
    peaceful: [
      { r: 230, g: 230, b: 250 }, // Lavender
      { r: 240, g: 248, b: 255 }, // Alice blue
      { r: 245, g: 245, b: 220 }, // Beige
      { r: 255, g: 240, b: 245 }, // Lavender blush
      { r: 248, g: 248, b: 255 }  // Ghost white
    ]
  }

  const [currentPalette, setCurrentPalette] = useState('calm')

  // Generate random color from current palette
  const generateTargetColor = useCallback(() => {
    const palette = colorPalettes[currentPalette]
    const baseColor = palette[Math.floor(Math.random() * palette.length)]
    
    // Add some variation
    const variation = 50
    return {
      r: Math.max(0, Math.min(255, baseColor.r + (Math.random() - 0.5) * variation)),
      g: Math.max(0, Math.min(255, baseColor.g + (Math.random() - 0.5) * variation)),
      b: Math.max(0, Math.min(255, baseColor.b + (Math.random() - 0.5) * variation))
    }
  }, [currentPalette, colorPalettes])

  // Calculate color difference
  const calculateColorDifference = useCallback((color1, color2) => {
    const rDiff = Math.abs(color1.r - color2.r)
    const gDiff = Math.abs(color1.g - color2.g)
    const bDiff = Math.abs(color1.b - color2.b)
    return Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff)
  }, [])

  // Check if colors match within tolerance
  const checkMatch = useCallback(() => {
    const difference = calculateColorDifference(targetColor, playerColor)
    const isMatch = difference <= tolerance
    
    if (isMatch) {
      const accuracy = Math.max(0, 100 - (difference / tolerance) * 100)
      const points = Math.floor(accuracy * level)
      
      updateScore(currentScore + points)
      setMatches(prev => prev + 1)
      setStreak(prev => prev + 1)
      
      playSound(SOUNDS.EAT)
      
      // Generate new target color
      setTargetColor(generateTargetColor())
      
      // Increase difficulty
      if (matches > 0 && matches % 5 === 0) {
        setLevel(prev => prev + 1)
        setTolerance(prev => Math.max(10, prev - 2))
      }
      
      return true
    } else {
      setStreak(0)
      return false
    }
  }, [targetColor, playerColor, tolerance, level, currentScore, updateScore, matches, playSound, SOUNDS, calculateColorDifference, generateTargetColor])

  // Handle color slider changes
  const handleColorChange = (component, value) => {
    setPlayerColor(prev => ({
      ...prev,
      [component]: parseInt(value)
    }))
  }

  // Auto-check for matches
  useEffect(() => {
    if (isPlaying) {
      checkMatch()
    }
  }, [playerColor, isPlaying, checkMatch])

  // Timer countdown
  useEffect(() => {
    if (!isPlaying) return

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endGame(false)
          saveHighScore(currentScore)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isPlaying, endGame, currentScore, saveHighScore])

  // Start game
  const startGame = () => {
    startGameState()
    setTargetColor(generateTargetColor())
    setPlayerColor({ r: 128, g: 128, b: 128 })
    setLevel(1)
    setTimeLeft(30)
    setStreak(0)
    setMatches(0)
    setTolerance(30)
    resetScore()
  }

  // Convert color to CSS
  const colorToCSS = (color) => `rgb(${Math.round(color.r)}, ${Math.round(color.g)}, ${Math.round(color.b)})`

  // Get accuracy percentage
  const getAccuracy = () => {
    const difference = calculateColorDifference(targetColor, playerColor)
    return Math.max(0, 100 - (difference / tolerance) * 100)
  }

  // Menu Screen
  if (isInMenu) {
    return (
      <MobileGameLayout className="bg-gradient-to-br from-violet-900 via-purple-900 to-fuchsia-900">
        <div className="flex items-center justify-center min-h-screen">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center text-white max-w-md"
        >
          <motion.h1 
            className="text-5xl font-bold mb-4 bg-gradient-to-r from-violet-400 to-fuchsia-500 bg-clip-text text-transparent"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🎨 Color Match
          </motion.h1>
          
          <p className="text-purple-200 mb-6">
            Match the target color using RGB sliders. Perfect for color therapy and relaxation!
          </p>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6">
            <div className="text-sm text-purple-200 mb-2">High Score</div>
            <div className="text-2xl font-bold text-yellow-400">{highScore}</div>
          </div>

          {/* Palette Selection */}
          <div className="mb-6">
            <div className="text-sm text-purple-200 mb-2">Color Mood</div>
            <div className="flex gap-2 justify-center">
              {Object.keys(colorPalettes).map(palette => (
                <button
                  key={palette}
                  onClick={() => setCurrentPalette(palette)}
                  className={`px-3 py-1 rounded-lg text-sm font-semibold transition-colors ${
                    currentPalette === palette 
                      ? 'bg-violet-600 text-white' 
                      : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                  }`}
                >
                  {palette.charAt(0).toUpperCase() + palette.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startGame}
            className="bg-gradient-to-r from-violet-500 to-fuchsia-600 text-white px-8 py-3 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 mb-4"
          >
            Start Matching
          </motion.button>
          
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={toggleSound}
              className={`p-2 rounded-lg transition-colors ${
                soundEnabled ? 'bg-violet-600 text-white' : 'bg-gray-600 text-gray-300'
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
  if (isPlaying) {
    const accuracy = getAccuracy()
    const isClose = accuracy > 70

    return (
      <MobileGameLayout className="bg-gradient-to-br from-violet-900 via-purple-900 to-fuchsia-900">
        <div className={`mx-auto ${isMobile ? 'max-w-full px-2' : 'max-w-4xl'}`}>
          {/* Game HUD */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4 text-white">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
              <div>
                <div className="text-sm text-purple-200">Score</div>
                <div className="text-xl font-bold text-yellow-400">{currentScore}</div>
              </div>
              <div>
                <div className="text-sm text-purple-200">Matches</div>
                <div className="text-xl font-bold text-green-400">{matches}</div>
              </div>
              <div>
                <div className="text-sm text-purple-200">Streak</div>
                <div className="text-xl font-bold text-orange-400">{streak}</div>
              </div>
              <div>
                <div className="text-sm text-purple-200">Level</div>
                <div className="text-xl font-bold text-cyan-400">{level}</div>
              </div>
              <div>
                <div className="text-sm text-purple-200">Time</div>
                <div className="text-xl font-bold text-red-400">{timeLeft}s</div>
              </div>
            </div>
          </div>

          {/* Color Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Target Color */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-white text-lg font-semibold mb-4 text-center">Target Color</h3>
              <div 
                className="w-full h-32 rounded-xl border-4 border-white/30 shadow-lg"
                style={{ backgroundColor: colorToCSS(targetColor) }}
              />
              <div className="text-center text-white text-sm mt-2">
                RGB({Math.round(targetColor.r)}, {Math.round(targetColor.g)}, {Math.round(targetColor.b)})
              </div>
            </div>

            {/* Player Color */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-white text-lg font-semibold mb-4 text-center">Your Color</h3>
              <div 
                className={`w-full h-32 rounded-xl border-4 shadow-lg transition-all duration-300 ${
                  isClose ? 'border-green-400 shadow-green-400/50' : 'border-white/30'
                }`}
                style={{ backgroundColor: colorToCSS(playerColor) }}
              />
              <div className="text-center text-white text-sm mt-2">
                RGB({Math.round(playerColor.r)}, {Math.round(playerColor.g)}, {Math.round(playerColor.b)})
              </div>
            </div>
          </div>

          {/* Accuracy Meter */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6">
            <div className="text-white text-center mb-2">
              Accuracy: {accuracy.toFixed(1)}%
            </div>
            <div className="w-full bg-gray-700 rounded-full h-4">
              <motion.div
                className={`h-4 rounded-full transition-all duration-300 ${
                  accuracy > 90 ? 'bg-green-500' :
                  accuracy > 70 ? 'bg-yellow-500' :
                  accuracy > 50 ? 'bg-orange-500' : 'bg-red-500'
                }`}
                style={{ width: `${accuracy}%` }}
                animate={{ scale: isClose ? [1, 1.05, 1] : 1 }}
                transition={{ duration: 0.5, repeat: isClose ? Infinity : 0 }}
              />
            </div>
          </div>

          {/* Color Controls */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <h3 className="text-white text-lg font-semibold mb-4 text-center">Color Controls</h3>

            {/* Red Slider */}
            <div className="mb-4">
              <div className="flex justify-between text-white text-sm mb-2">
                <span>Red</span>
                <span>{Math.round(playerColor.r)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="255"
                value={playerColor.r}
                onChange={(e) => handleColorChange('r', e.target.value)}
                className="w-full h-3 bg-red-200 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #000 0%, #ff0000 100%)`
                }}
              />
            </div>

            {/* Green Slider */}
            <div className="mb-4">
              <div className="flex justify-between text-white text-sm mb-2">
                <span>Green</span>
                <span>{Math.round(playerColor.g)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="255"
                value={playerColor.g}
                onChange={(e) => handleColorChange('g', e.target.value)}
                className="w-full h-3 bg-green-200 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #000 0%, #00ff00 100%)`
                }}
              />
            </div>

            {/* Blue Slider */}
            <div className="mb-4">
              <div className="flex justify-between text-white text-sm mb-2">
                <span>Blue</span>
                <span>{Math.round(playerColor.b)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="255"
                value={playerColor.b}
                onChange={(e) => handleColorChange('b', e.target.value)}
                className="w-full h-3 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #000 0%, #0000ff 100%)`
                }}
              />
            </div>
          </div>

          {/* Instructions */}
          <div className={`text-center text-purple-200 mt-4 ${isMobile ? 'text-xs px-2' : 'text-sm'}`}>
            Adjust the RGB sliders to match the target color • Higher accuracy = more points!
          </div>
        </div>
      </MobileGameLayout>
    )
  }

  // Game Over Screen
  return (
    <MobileGameLayout className="bg-gradient-to-br from-violet-900 via-purple-900 to-fuchsia-900">
      <div className="flex items-center justify-center min-h-screen">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center text-white max-w-md"
      >
        <motion.h1 
          className="text-4xl font-bold mb-4 text-violet-400"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          Color Session Complete!
        </motion.h1>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-sm text-purple-200 mb-1">Final Score</div>
              <div className="text-2xl font-bold text-yellow-400">{currentScore}</div>
            </div>
            <div>
              <div className="text-sm text-purple-200 mb-1">Matches</div>
              <div className="text-2xl font-bold text-green-400">{matches}</div>
            </div>
          </div>
          
          {isNewHighScore && currentScore > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-yellow-400 font-semibold mb-2"
            >
              🎉 New High Score! 🎉
            </motion.div>
          )}
          
          <div className="text-sm text-purple-200 mb-1">High Score</div>
          <div className="text-xl font-bold text-violet-400">{highScore}</div>
        </div>
        
        <div className="space-y-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startGame}
            className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Play Again
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetGame}
            className="w-full bg-gray-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-gray-700 transition-colors"
          >
            Back to Menu
          </motion.button>
        </div>
      </motion.div>
      </div>
    </MobileGameLayout>
  )
}
