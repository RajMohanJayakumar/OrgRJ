import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MMM_CONFIG } from '../config/mmmConfig'
import { trackMMMAccess } from '../utils/routeDetection'
import MMMFingersGame from '../games/MMMFingersGame'

/**
 * MMM Fingers Module - Main Component
 * Self-contained MMM fingers game system that can be easily decoupled
 */
export default function MMMFingersModule() {
  const [selectedMode, setSelectedMode] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // Track MMM access for analytics
  useEffect(() => {
    trackMMMAccess()
  }, [])

  // Game modes with components
  const gameModes = [
    {
      ...MMM_CONFIG.MODES.CLASSIC,
      component: MMMFingersGame
    },
    {
      ...MMM_CONFIG.MODES.SPEED,
      component: MMMFingersGame
    },
    {
      ...MMM_CONFIG.MODES.MEMORY,
      component: MMMFingersGame
    },
    {
      ...MMM_CONFIG.MODES.CHALLENGE,
      component: MMMFingersGame
    }
  ]

  // Handle mode selection
  const handleModeSelect = (mode) => {
    setIsLoading(true)
    setTimeout(() => {
      setSelectedMode(mode)
      setIsLoading(false)
    }, 500)
  }

  // Return to mode selection
  const handleBackToModes = () => {
    setSelectedMode(null)
  }

  // If a mode is selected, render the game
  if (selectedMode) {
    const GameComponent = selectedMode.component
    return (
      <div className="relative">
        <GameComponent 
          gameMode={selectedMode.id}
          onBack={handleBackToModes}
        />
      </div>
    )
  }

  // Loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-white border-t-transparent rounded-full"
        />
      </div>
    )
  }

  // Mode selection screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-30"
            animate={{
              x: [0, Math.random() * window.innerWidth],
              y: [0, Math.random() * window.innerHeight],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: Math.random() * 15 + 10,
              repeat: Infinity,
              repeatType: 'reverse'
            }}
            style={{
              left: Math.random() * window.innerWidth,
              top: Math.random() * window.innerHeight,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <motion.h1 
            className="text-6xl md:text-8xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent"
            animate={{ 
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              backgroundSize: '200% 200%'
            }}
          >
            MMM Fingers
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-blue-200 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Multi-Modal Memory Training
          </motion.p>
          
          <motion.p 
            className="text-sm md:text-base text-blue-300 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            Train your finger memory with progressive exercises that combine visual, auditory, and tactile feedback. 
            Choose your challenge level and start improving your cognitive abilities!
          </motion.p>
        </motion.div>

        {/* Game modes grid */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full"
        >
          {gameModes.map((mode, index) => (
            <motion.div
              key={mode.id}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1.2 + index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleModeSelect(mode)}
              className={`bg-gradient-to-br ${mode.color} p-6 rounded-2xl cursor-pointer shadow-2xl border border-white/20 backdrop-blur-sm`}
            >
              <div className="text-center text-white">
                <div className="text-4xl mb-4">{mode.icon}</div>
                <h3 className="text-2xl font-bold mb-3">{mode.name}</h3>
                <p className="text-sm opacity-90 mb-4">{mode.description}</p>
                
                <div className="space-y-2">
                  <div className="text-xs opacity-75">
                    <span className="font-semibold">Difficulty:</span> {mode.difficulty}
                  </div>
                  
                  <div className="flex flex-wrap gap-1 justify-center">
                    {mode.features.map((feature, featureIndex) => (
                      <span
                        key={featureIndex}
                        className="text-xs bg-white/20 px-2 py-1 rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
                
                <motion.div
                  className="mt-4 bg-white/20 rounded-lg py-2 px-4 font-semibold"
                  whileHover={{ bg: 'white/30' }}
                >
                  Start Training
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.8 }}
          className="mt-12 text-center text-blue-300 max-w-2xl"
        >
          <h4 className="text-lg font-semibold mb-4">How to Play</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl mb-2">👀</div>
              <div className="font-semibold mb-1">Watch</div>
              <div>Observe the finger pattern sequence carefully</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl mb-2">🧠</div>
              <div className="font-semibold mb-1">Remember</div>
              <div>Memorize the order and timing of each finger</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl mb-2">👆</div>
              <div className="font-semibold mb-1">Repeat</div>
              <div>Tap the fingers in the exact same sequence</div>
            </div>
          </div>
          
          <div className="mt-6 text-xs opacity-75">
            <div className="mb-2">
              <span className="font-semibold">Desktop:</span> Use number keys 1-0 or click finger buttons
            </div>
            <div>
              <span className="font-semibold">Mobile:</span> Tap the virtual hand interface
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 0.8 }}
          className="mt-8 text-center text-blue-400 text-xs"
        >
          <div className="mb-2">
            🧠 Improve your cognitive abilities through targeted finger memory training
          </div>
          <div className="opacity-75">
            Part of the FinClamp wellness suite
          </div>
        </motion.div>
      </div>
    </div>
  )
}
