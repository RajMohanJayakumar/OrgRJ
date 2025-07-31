import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, RotateCcw, Settings, Volume2, VolumeX } from 'lucide-react'

/**
 * Guided Breathing Exercise Component
 * Helps users relax with visual breathing guides and customizable patterns
 */
export default function BreathingExercise() {
  const [isActive, setIsActive] = useState(false)
  const [currentPhase, setCurrentPhase] = useState('inhale') // 'inhale', 'hold', 'exhale', 'pause'
  const [cycleCount, setCycleCount] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [pattern, setPattern] = useState('4-4-4-4') // inhale-hold-exhale-pause
  const [totalCycles, setTotalCycles] = useState(10)
  const [showSettings, setShowSettings] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [backgroundTheme, setBackgroundTheme] = useState('ocean')
  
  const intervalRef = useRef(null)
  const audioContextRef = useRef(null)

  // Breathing patterns
  const patterns = {
    '4-4-4-4': { name: 'Box Breathing', inhale: 4, hold: 4, exhale: 4, pause: 4 },
    '4-7-8-0': { name: '4-7-8 Relaxation', inhale: 4, hold: 7, exhale: 8, pause: 0 },
    '6-2-6-2': { name: 'Calm Focus', inhale: 6, hold: 2, exhale: 6, pause: 2 },
    '3-3-3-3': { name: 'Quick Relief', inhale: 3, hold: 3, exhale: 3, pause: 3 },
    '5-5-5-5': { name: 'Deep Relaxation', inhale: 5, hold: 5, exhale: 5, pause: 5 }
  }

  const currentPattern = patterns[pattern]

  // Background themes
  const themes = {
    ocean: {
      name: 'Ocean Waves',
      gradient: 'from-blue-400 via-blue-500 to-blue-600',
      circleColor: 'from-cyan-300 to-blue-400'
    },
    forest: {
      name: 'Forest Green',
      gradient: 'from-green-400 via-green-500 to-green-600',
      circleColor: 'from-green-300 to-emerald-400'
    },
    sunset: {
      name: 'Sunset Glow',
      gradient: 'from-orange-400 via-pink-500 to-purple-600',
      circleColor: 'from-yellow-300 to-orange-400'
    },
    lavender: {
      name: 'Lavender Fields',
      gradient: 'from-purple-400 via-purple-500 to-indigo-600',
      circleColor: 'from-purple-300 to-pink-400'
    }
  }

  const currentTheme = themes[backgroundTheme]

  // Create breathing sound
  const createBreathingSound = (phase) => {
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

      if (phase === 'inhale') {
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime)
        oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.5)
      } else if (phase === 'exhale') {
        oscillator.frequency.setValueAtTime(400, audioContext.currentTime)
        oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.5)
      }

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.5)
    } catch (error) {
      console.log('Audio not supported:', error)
    }
  }

  // Start breathing cycle
  const startBreathing = () => {
    setIsActive(true)
    setCycleCount(0)
    setCurrentPhase('inhale')
    setTimeRemaining(currentPattern.inhale)
    createBreathingSound('inhale')
  }

  // Stop breathing cycle
  const stopBreathing = () => {
    setIsActive(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }

  // Reset breathing cycle
  const resetBreathing = () => {
    stopBreathing()
    setCycleCount(0)
    setCurrentPhase('inhale')
    setTimeRemaining(0)
  }

  // Main breathing timer
  useEffect(() => {
    if (isActive && timeRemaining > 0) {
      intervalRef.current = setTimeout(() => {
        setTimeRemaining(prev => prev - 1)
      }, 1000)
    } else if (isActive && timeRemaining === 0) {
      // Move to next phase
      let nextPhase = ''
      let nextTime = 0

      switch (currentPhase) {
        case 'inhale':
          nextPhase = 'hold'
          nextTime = currentPattern.hold
          break
        case 'hold':
          nextPhase = 'exhale'
          nextTime = currentPattern.exhale
          createBreathingSound('exhale')
          break
        case 'exhale':
          nextPhase = 'pause'
          nextTime = currentPattern.pause
          break
        case 'pause':
          nextPhase = 'inhale'
          nextTime = currentPattern.inhale
          setCycleCount(prev => prev + 1)
          createBreathingSound('inhale')
          break
      }

      if (cycleCount >= totalCycles && nextPhase === 'inhale') {
        stopBreathing()
        return
      }

      setCurrentPhase(nextPhase)
      setTimeRemaining(nextTime)
    }

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current)
      }
    }
  }, [isActive, timeRemaining, currentPhase, currentPattern, cycleCount, totalCycles])

  // Calculate circle scale based on phase
  const getCircleScale = () => {
    const baseScale = 0.5
    const maxScale = 1.2

    switch (currentPhase) {
      case 'inhale':
        return maxScale
      case 'hold':
        return maxScale
      case 'exhale':
        return baseScale
      case 'pause':
        return baseScale
      default:
        return baseScale
    }
  }

  // Get phase instruction text
  const getPhaseText = () => {
    switch (currentPhase) {
      case 'inhale':
        return 'Breathe In'
      case 'hold':
        return 'Hold'
      case 'exhale':
        return 'Breathe Out'
      case 'pause':
        return 'Pause'
      default:
        return 'Ready to Begin'
    }
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentTheme.gradient} p-3 md:p-4 flex flex-col items-center justify-center relative overflow-hidden`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white bg-opacity-20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-2xl mx-auto text-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 md:mb-8"
        >
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">
            🧘 Guided Breathing
          </h1>
          <p className="text-white/80 text-sm md:text-base">
            Take a moment to breathe and center yourself
          </p>
        </motion.div>

        {/* Main breathing circle */}
        <div className="relative mb-6 md:mb-8">
          <motion.div
            className={`w-48 h-48 md:w-64 md:h-64 mx-auto rounded-full bg-gradient-to-br ${currentTheme.circleColor} shadow-2xl flex items-center justify-center relative overflow-hidden`}
            animate={{
              scale: getCircleScale(),
            }}
            transition={{
              duration: timeRemaining,
              ease: "easeInOut"
            }}
          >
            {/* Inner glow */}
            <div className="absolute inset-3 md:inset-4 rounded-full bg-white bg-opacity-20 animate-pulse" />

            {/* Center content */}
            <div className="relative z-10 text-center">
              <motion.div
                key={currentPhase}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-white"
              >
                <div className="text-lg md:text-2xl font-bold mb-1 md:mb-2">{getPhaseText()}</div>
                {isActive && (
                  <div className="text-2xl md:text-4xl font-mono">{timeRemaining}</div>
                )}
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Progress and stats */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-6 mb-4 md:mb-6">
          <div className="grid grid-cols-3 gap-2 md:gap-4 text-white text-center">
            <div>
              <div className="text-xl md:text-2xl font-bold">{cycleCount}</div>
              <div className="text-xs md:text-sm opacity-80">Cycles</div>
            </div>
            <div>
              <div className="text-xl md:text-2xl font-bold">{totalCycles}</div>
              <div className="text-xs md:text-sm opacity-80">Goal</div>
            </div>
            <div>
              <div className="text-sm md:text-xl font-bold truncate">{currentPattern.name}</div>
              <div className="text-xs md:text-sm opacity-80">Pattern</div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap justify-center items-center gap-3 md:gap-4 mb-4 md:mb-6">
          {!isActive ? (
            <motion.button
              onClick={startBreathing}
              className="bg-white/20 hover:bg-white/30 text-white px-6 md:px-8 py-3 md:py-4 rounded-full flex items-center space-x-2 transition-colors backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play className="w-5 h-5 md:w-6 md:h-6" />
              <span className="text-sm md:text-base">Start Breathing</span>
            </motion.button>
          ) : (
            <motion.button
              onClick={stopBreathing}
              className="bg-white/20 hover:bg-white/30 text-white px-6 md:px-8 py-3 md:py-4 rounded-full flex items-center space-x-2 transition-colors backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Pause className="w-5 h-5 md:w-6 md:h-6" />
              <span className="text-sm md:text-base">Pause</span>
            </motion.button>
          )}

          <motion.button
            onClick={resetBreathing}
            className="bg-white/20 hover:bg-white/30 text-white px-4 md:px-6 py-3 md:py-4 rounded-full transition-colors backdrop-blur-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RotateCcw className="w-5 h-5 md:w-6 md:h-6" />
          </motion.button>

          <motion.button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`px-4 md:px-6 py-3 md:py-4 rounded-full transition-colors backdrop-blur-sm ${
              soundEnabled ? 'bg-white/20 hover:bg-white/30 text-white' : 'bg-white/10 text-white/50'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5 md:w-6 md:h-6" /> : <VolumeX className="w-5 h-5 md:w-6 md:h-6" />}
          </motion.button>

          <motion.button
            onClick={() => setShowSettings(!showSettings)}
            className="bg-white/20 hover:bg-white/30 text-white px-4 md:px-6 py-3 md:py-4 rounded-full transition-colors backdrop-blur-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Settings className="w-5 h-5 md:w-6 md:h-6" />
          </motion.button>
        </div>

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-6 space-y-4"
            >
              <h3 className="text-lg md:text-xl font-semibold text-white mb-4">Settings</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-white text-xs md:text-sm font-medium mb-2">
                    Breathing Pattern
                  </label>
                  <select
                    value={pattern}
                    onChange={(e) => setPattern(e.target.value)}
                    className="w-full px-3 py-2 bg-white/20 text-white rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
                    disabled={isActive}
                  >
                    {Object.entries(patterns).map(([key, pat]) => (
                      <option key={key} value={key} className="text-gray-900">
                        {pat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white text-xs md:text-sm font-medium mb-2">
                    Total Cycles
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    value={totalCycles}
                    onChange={(e) => setTotalCycles(parseInt(e.target.value))}
                    className="w-full"
                    disabled={isActive}
                  />
                  <span className="text-white text-xs md:text-sm">{totalCycles} cycles</span>
                </div>

                <div>
                  <label className="block text-white text-xs md:text-sm font-medium mb-2">
                    Background Theme
                  </label>
                  <select
                    value={backgroundTheme}
                    onChange={(e) => setBackgroundTheme(e.target.value)}
                    className="w-full px-3 py-2 bg-white/20 text-white rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
                  >
                    {Object.entries(themes).map(([key, theme]) => (
                      <option key={key} value={key} className="text-gray-900">
                        {theme.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Completion message */}
        <AnimatePresence>
          {!isActive && cycleCount >= totalCycles && cycleCount > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="bg-white/20 backdrop-blur-sm rounded-xl p-6 text-white text-center"
            >
              <div className="text-4xl mb-2">🌟</div>
              <h3 className="text-xl font-bold mb-2">Session Complete!</h3>
              <p className="text-white/80">
                You've completed {cycleCount} breathing cycles. Well done!
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
