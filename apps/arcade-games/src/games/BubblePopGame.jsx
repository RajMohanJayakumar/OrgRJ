import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useGameState from '../hooks/useGameState'
import useArcadeSound from '../hooks/useArcadeSound'
import useHighScore from '../hooks/useHighScore'
import useMobileControls from '../hooks/useMobileControls'

/**
 * Bubble Pop Game - Stress Busting Arcade Game
 * Pop colorful bubbles for relaxation and stress relief
 */
export default function BubblePopGame() {
  // Game state management
  const {
    gameState,
    isPlaying,
    isInMenu,
    startGame: startGameState,
    resetGame
  } = useGameState('menu')
  
  // Sound management
  const { soundEnabled, playSound, toggleSound, SOUNDS } = useArcadeSound(true)
  
  // Score management
  const {
    currentScore,
    highScore,
    updateScore,
    resetScore,
    saveHighScore
  } = useHighScore('bubble-pop')
  
  // Mobile controls
  const { isMobile, SwipeArea, MobileGameLayout, MobileGameArea } = useMobileControls()
  
  // Game state
  const [bubbles, setBubbles] = useState([])
  const [poppedCount, setPoppedCount] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [multiplier, setMultiplier] = useState(1)
  const [combo, setCombo] = useState(0)
  const gameAreaRef = useRef()
  const comboTimeoutRef = useRef()

  // Bubble colors for stress relief
  const bubbleColors = [
    'from-pink-400 to-rose-500',
    'from-purple-400 to-violet-500',
    'from-blue-400 to-cyan-500',
    'from-green-400 to-emerald-500',
    'from-yellow-400 to-orange-500',
    'from-indigo-400 to-purple-500',
    'from-teal-400 to-cyan-500',
    'from-red-400 to-pink-500'
  ]

  // Generate random bubble
  const generateBubble = useCallback(() => {
    if (!gameAreaRef.current) return null

    const rect = gameAreaRef.current.getBoundingClientRect()
    const size = Math.random() * 40 + 30 // 30-70px
    
    return {
      id: Date.now() + Math.random(),
      x: Math.random() * (rect.width - size),
      y: Math.random() * (rect.height - size),
      size,
      color: bubbleColors[Math.floor(Math.random() * bubbleColors.length)],
      speed: Math.random() * 2 + 1,
      direction: Math.random() * Math.PI * 2,
      life: 100,
      points: Math.floor(size / 10) + 1
    }
  }, [bubbleColors])

  // Pop bubble
  const popBubble = useCallback((bubbleId, points) => {
    setBubbles(prev => prev.filter(b => b.id !== bubbleId))
    setPoppedCount(prev => prev + 1)
    
    // Update combo
    setCombo(prev => prev + 1)
    clearTimeout(comboTimeoutRef.current)
    comboTimeoutRef.current = setTimeout(() => setCombo(0), 1000)
    
    // Calculate score with combo multiplier
    const comboBonus = Math.floor(combo / 5) + 1
    const finalPoints = points * multiplier * comboBonus
    updateScore(currentScore + finalPoints)
    
    // Play pop sound
    playSound(SOUNDS.HIT)
    
    // Update multiplier based on combo
    if (combo > 0 && combo % 10 === 0) {
      setMultiplier(prev => Math.min(prev + 0.5, 5))
    }
  }, [combo, multiplier, currentScore, updateScore, playSound, SOUNDS])

  // Game loop for bubble movement and generation
  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      // Move bubbles
      setBubbles(prev => prev.map(bubble => ({
        ...bubble,
        x: bubble.x + Math.cos(bubble.direction) * bubble.speed,
        y: bubble.y + Math.sin(bubble.direction) * bubble.speed,
        life: bubble.life - 1
      })).filter(bubble => {
        // Remove bubbles that are out of bounds or expired
        if (!gameAreaRef.current) return false
        const rect = gameAreaRef.current.getBoundingClientRect()
        return bubble.life > 0 && 
               bubble.x > -bubble.size && 
               bubble.x < rect.width && 
               bubble.y > -bubble.size && 
               bubble.y < rect.height
      }))

      // Generate new bubbles
      if (Math.random() < 0.3) {
        const newBubble = generateBubble()
        if (newBubble) {
          setBubbles(prev => [...prev, newBubble])
        }
      }
    }, 100)

    return () => clearInterval(interval)
  }, [isPlaying, generateBubble])

  // Timer countdown
  useEffect(() => {
    if (!isPlaying) return

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          saveHighScore(currentScore)
          resetGame()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isPlaying, currentScore, saveHighScore, resetGame])

  // Start game
  const startGame = () => {
    startGameState()
    setBubbles([])
    setPoppedCount(0)
    setTimeLeft(60)
    setMultiplier(1)
    setCombo(0)
    resetScore()
    
    // Generate initial bubbles
    setTimeout(() => {
      const initialBubbles = []
      for (let i = 0; i < 5; i++) {
        const bubble = generateBubble()
        if (bubble) initialBubbles.push(bubble)
      }
      setBubbles(initialBubbles)
    }, 100)
  }

  // Menu Screen
  if (isInMenu) {
    return (
      <MobileGameLayout className="bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900">
        <div className="flex items-center justify-center min-h-screen">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center text-white max-w-md"
        >
          <motion.h1 
            className="text-5xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🫧 Bubble Pop
          </motion.h1>
          
          <p className="text-purple-200 mb-6">
            Pop colorful bubbles to relax and relieve stress! Build combos for higher scores.
          </p>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6">
            <div className="text-sm text-purple-200 mb-2">High Score</div>
            <div className="text-2xl font-bold text-yellow-400">{highScore}</div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startGame}
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 mb-4"
          >
            Start Popping
          </motion.button>
          
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={toggleSound}
              className={`p-2 rounded-lg transition-colors ${
                soundEnabled ? 'bg-purple-600 text-white' : 'bg-gray-600 text-gray-300'
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
    <MobileGameLayout className="bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900">
      <SwipeArea className="h-full">
        <div className={`mx-auto h-full flex flex-col ${isMobile ? 'max-w-full px-2' : 'max-w-4xl'}`}>
        {/* Game HUD */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4 text-white">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            <div>
              <div className="text-sm text-purple-200">Score</div>
              <div className="text-xl font-bold text-yellow-400">{currentScore}</div>
            </div>
            <div>
              <div className="text-sm text-purple-200">Popped</div>
              <div className="text-xl font-bold text-pink-400">{poppedCount}</div>
            </div>
            <div>
              <div className="text-sm text-purple-200">Time</div>
              <div className="text-xl font-bold text-cyan-400">{timeLeft}s</div>
            </div>
            <div>
              <div className="text-sm text-purple-200">Combo</div>
              <div className="text-xl font-bold text-green-400">{combo}</div>
            </div>
            <div>
              <div className="text-sm text-purple-200">Multiplier</div>
              <div className="text-xl font-bold text-orange-400">{multiplier.toFixed(1)}x</div>
            </div>
          </div>
        </div>

          {/* Game Area */}
          <MobileGameArea className="flex-1">
            <div
              ref={gameAreaRef}
              className="h-full bg-black/20 backdrop-blur-sm rounded-xl relative overflow-hidden border-2 border-purple-500/30"
            >
          <AnimatePresence>
            {bubbles.map(bubble => (
              <motion.div
                key={bubble.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.8 }}
                className={`absolute rounded-full bg-gradient-to-br ${bubble.color} cursor-pointer shadow-lg border-2 border-white/30`}
                style={{
                  left: bubble.x,
                  top: bubble.y,
                  width: bubble.size,
                  height: bubble.size
                }}
                onClick={() => popBubble(bubble.id, bubble.points)}
                onTouchStart={(e) => {
                  e.preventDefault()
                  popBubble(bubble.id, bubble.points)
                }}
              >
                <div className="w-full h-full rounded-full bg-white/20 flex items-center justify-center">
                  <div className="w-1/3 h-1/3 bg-white/40 rounded-full" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Floating score indicators */}
          {combo > 5 && (
            <motion.div
              initial={{ scale: 0, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="absolute top-4 left-1/2 transform -translate-x-1/2 text-yellow-400 font-bold text-2xl"
            >
              COMBO x{combo}!
            </motion.div>
          )}
            </div>
          </MobileGameArea>

          {/* Instructions */}
          <div className={`text-center text-purple-200 mt-4 ${isMobile ? 'text-xs px-2' : 'text-sm'}`}>
            {isMobile ? 'Tap bubbles to pop them!' : 'Click bubbles to pop them! Build combos for bonus points!'}
          </div>
        </div>
      </SwipeArea>
    </MobileGameLayout>
  )
}
