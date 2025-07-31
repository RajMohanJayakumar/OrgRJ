import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useGameState from '../hooks/useGameState'
import useArcadeSound from '../hooks/useArcadeSound'
import useHighScore from '../hooks/useHighScore'
import useMobileControls from '../hooks/useMobileControls'

/**
 * Rhythm Tap Game - Musical Stress Relief
 * Tap to the rhythm for relaxation and flow state
 */
export default function RhythmTapGame() {
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
  } = useHighScore('rhythm-tap')
  
  // Mobile controls
  const { isMobile, SwipeArea, MobileGameLayout, MobileGameArea } = useMobileControls()
  
  // Game state
  const [beats, setBeats] = useState([])
  const [bpm, setBpm] = useState(120)
  const [streak, setStreak] = useState(0)
  const [accuracy, setAccuracy] = useState(100)
  const [timeLeft, setTimeLeft] = useState(60)
  const [currentBeat, setCurrentBeat] = useState(0)
  const [tapZones, setTapZones] = useState([])
  const [perfectHits, setPerfectHits] = useState(0)
  const [goodHits, setGoodHits] = useState(0)
  const [missedHits, setMissedHits] = useState(0)
  
  const beatIntervalRef = useRef()
  const gameAreaRef = useRef()

  // Rhythm patterns for different moods
  const rhythmPatterns = {
    calm: { bpm: 80, pattern: [1, 0, 1, 0, 1, 0, 1, 0] },
    moderate: { bpm: 120, pattern: [1, 0, 1, 1, 0, 1, 0, 1] },
    energetic: { bpm: 160, pattern: [1, 1, 0, 1, 1, 0, 1, 0] }
  }

  const [currentPattern, setCurrentPattern] = useState('calm')

  // Colors for different tap zones
  const tapZoneColors = [
    'from-red-400 to-pink-500',
    'from-blue-400 to-cyan-500',
    'from-green-400 to-emerald-500',
    'from-yellow-400 to-orange-500',
    'from-purple-400 to-violet-500',
    'from-indigo-400 to-blue-500'
  ]

  // Generate beat
  const generateBeat = useCallback(() => {
    if (!gameAreaRef.current) return null

    const rect = gameAreaRef.current.getBoundingClientRect()
    const zoneIndex = Math.floor(Math.random() * 4) // 4 tap zones
    const zoneWidth = rect.width / 4
    
    return {
      id: Date.now() + Math.random(),
      x: zoneIndex * zoneWidth + zoneWidth / 2,
      y: -50,
      zoneIndex,
      speed: 3,
      hit: false,
      perfect: false
    }
  }, [])

  // Handle tap
  const handleTap = useCallback((zoneIndex, tapTime) => {
    setBeats(prevBeats => {
      const updatedBeats = [...prevBeats]
      let hitBeat = null
      let hitIndex = -1

      // Find the closest beat in the tap zone
      for (let i = 0; i < updatedBeats.length; i++) {
        const beat = updatedBeats[i]
        if (beat.zoneIndex === zoneIndex && !beat.hit) {
          const beatY = beat.y
          if (beatY > 200 && beatY < 400) { // Hit zone
            hitBeat = beat
            hitIndex = i
            break
          }
        }
      }

      if (hitBeat) {
        const hitZoneCenter = 300 // Center of hit zone
        const distance = Math.abs(hitBeat.y - hitZoneCenter)
        
        let hitType = 'miss'
        let points = 0
        
        if (distance < 20) {
          hitType = 'perfect'
          points = 100
          setPerfectHits(prev => prev + 1)
          setStreak(prev => prev + 1)
        } else if (distance < 50) {
          hitType = 'good'
          points = 50
          setGoodHits(prev => prev + 1)
          setStreak(prev => prev + 1)
        } else {
          hitType = 'miss'
          setMissedHits(prev => prev + 1)
          setStreak(0)
        }

        // Apply streak multiplier
        const multiplier = Math.min(3, 1 + Math.floor(streak / 10) * 0.5)
        const finalPoints = Math.floor(points * multiplier)
        
        updateScore(currentScore + finalPoints)
        
        // Update accuracy
        const totalHits = perfectHits + goodHits + missedHits + 1
        const successfulHits = perfectHits + goodHits + (hitType !== 'miss' ? 1 : 0)
        setAccuracy(Math.round((successfulHits / totalHits) * 100))

        // Mark beat as hit
        updatedBeats[hitIndex] = { ...hitBeat, hit: true, hitType }
        
        // Play sound
        if (hitType !== 'miss') {
          playSound(SOUNDS.HIT)
        }

        // Show hit effect
        showHitEffect(zoneIndex, hitType)
      }

      return updatedBeats
    })
  }, [streak, perfectHits, goodHits, missedHits, currentScore, updateScore, playSound, SOUNDS])

  // Show hit effect
  const showHitEffect = (zoneIndex, hitType) => {
    // This would create a visual effect - simplified for now
    console.log(`${hitType} hit in zone ${zoneIndex}`)
  }

  // Generate beats based on pattern
  useEffect(() => {
    if (!isPlaying) return

    const pattern = rhythmPatterns[currentPattern]
    const beatInterval = (60 / pattern.bpm) * 1000 // Convert BPM to milliseconds

    beatIntervalRef.current = setInterval(() => {
      const shouldGenerateBeat = pattern.pattern[currentBeat % pattern.pattern.length]
      
      if (shouldGenerateBeat) {
        const newBeat = generateBeat()
        if (newBeat) {
          setBeats(prev => [...prev, newBeat])
        }
      }
      
      setCurrentBeat(prev => prev + 1)
    }, beatInterval)

    return () => clearInterval(beatIntervalRef.current)
  }, [isPlaying, currentPattern, currentBeat, generateBeat])

  // Move beats down
  useEffect(() => {
    if (!isPlaying) return

    const moveInterval = setInterval(() => {
      setBeats(prevBeats => 
        prevBeats
          .map(beat => ({ ...beat, y: beat.y + beat.speed }))
          .filter(beat => {
            // Remove beats that are off screen
            if (beat.y > 500) {
              if (!beat.hit) {
                setMissedHits(prev => prev + 1)
                setStreak(0)
              }
              return false
            }
            return true
          })
      )
    }, 16) // ~60fps

    return () => clearInterval(moveInterval)
  }, [isPlaying])

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
    setBeats([])
    setStreak(0)
    setAccuracy(100)
    setTimeLeft(60)
    setCurrentBeat(0)
    setPerfectHits(0)
    setGoodHits(0)
    setMissedHits(0)
    resetScore()
  }

  // Menu Screen
  if (isInMenu) {
    return (
      <MobileGameLayout className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <div className="flex items-center justify-center min-h-screen">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center text-white max-w-md"
        >
          <motion.h1 
            className="text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-pink-500 bg-clip-text text-transparent"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🎵 Rhythm Tap
          </motion.h1>
          
          <p className="text-purple-200 mb-6">
            Tap to the rhythm for relaxation and flow state. Perfect for stress relief!
          </p>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6">
            <div className="text-sm text-purple-200 mb-2">High Score</div>
            <div className="text-2xl font-bold text-yellow-400">{highScore}</div>
          </div>

          {/* Pattern Selection */}
          <div className="mb-6">
            <div className="text-sm text-purple-200 mb-2">Rhythm Pattern</div>
            <div className="flex gap-2 justify-center">
              {Object.keys(rhythmPatterns).map(pattern => (
                <button
                  key={pattern}
                  onClick={() => setCurrentPattern(pattern)}
                  className={`px-3 py-1 rounded-lg text-sm font-semibold transition-colors ${
                    currentPattern === pattern 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                  }`}
                >
                  {pattern.charAt(0).toUpperCase() + pattern.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startGame}
            className="bg-gradient-to-r from-indigo-500 to-pink-600 text-white px-8 py-3 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 mb-4"
          >
            Start Tapping
          </motion.button>
          
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={toggleSound}
              className={`p-2 rounded-lg transition-colors ${
                soundEnabled ? 'bg-indigo-600 text-white' : 'bg-gray-600 text-gray-300'
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
    return (
      <MobileGameLayout className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <div className={`mx-auto ${isMobile ? 'max-w-full px-2' : 'max-w-4xl'}`}>
          {/* Game HUD */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4 text-white">
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-center">
              <div>
                <div className="text-sm text-purple-200">Score</div>
                <div className="text-xl font-bold text-yellow-400">{currentScore}</div>
              </div>
              <div>
                <div className="text-sm text-purple-200">Streak</div>
                <div className="text-xl font-bold text-orange-400">{streak}</div>
              </div>
              <div>
                <div className="text-sm text-purple-200">Accuracy</div>
                <div className="text-xl font-bold text-green-400">{accuracy}%</div>
              </div>
              <div>
                <div className="text-sm text-purple-200">Perfect</div>
                <div className="text-xl font-bold text-cyan-400">{perfectHits}</div>
              </div>
              <div>
                <div className="text-sm text-purple-200">Good</div>
                <div className="text-xl font-bold text-blue-400">{goodHits}</div>
              </div>
              <div>
                <div className="text-sm text-purple-200">Time</div>
                <div className="text-xl font-bold text-red-400">{timeLeft}s</div>
              </div>
            </div>
          </div>

          {/* Game Area */}
          <MobileGameArea maxHeight="60vh">
            <div
              ref={gameAreaRef}
              className="bg-black/20 backdrop-blur-sm rounded-xl relative overflow-hidden border-2 border-purple-500/30"
              style={{ height: isMobile ? '60vh' : '500px' }}
            >
            {/* Tap Zones */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-white/10 border-t-4 border-purple-400">
              <div className="grid grid-cols-4 h-full">
                {[0, 1, 2, 3].map(zoneIndex => (
                  <button
                    key={zoneIndex}
                    className={`bg-gradient-to-t ${tapZoneColors[zoneIndex]} border-r border-white/20 last:border-r-0 flex items-center justify-center text-white font-bold text-2xl hover:bg-white/20 transition-all active:scale-95`}
                    onClick={() => handleTap(zoneIndex, Date.now())}
                    onTouchStart={(e) => {
                      e.preventDefault()
                      handleTap(zoneIndex, Date.now())
                    }}
                  >
                    {zoneIndex + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Hit Zone Indicator */}
            <div className="absolute left-0 right-0 bg-yellow-400/30 border-y-2 border-yellow-400" style={{ top: '280px', height: '40px' }}>
              <div className="text-center text-yellow-400 font-bold text-sm leading-10">HIT ZONE</div>
            </div>

            {/* Falling Beats */}
            <AnimatePresence>
              {beats.map(beat => (
                <motion.div
                  key={beat.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className={`absolute w-12 h-12 rounded-full bg-gradient-to-br ${tapZoneColors[beat.zoneIndex]} border-2 border-white/50 shadow-lg`}
                  style={{
                    left: beat.x - 24,
                    top: beat.y,
                    opacity: beat.hit ? 0.3 : 1
                  }}
                >
                  <div className="w-full h-full rounded-full bg-white/20 flex items-center justify-center">
                    <div className="w-4 h-4 bg-white/60 rounded-full" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Streak indicator */}
            {streak > 5 && (
              <motion.div
                initial={{ scale: 0, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="absolute top-4 left-1/2 transform -translate-x-1/2 text-yellow-400 font-bold text-2xl"
              >
                STREAK x{streak}!
              </motion.div>
            )}
            </div>
          </MobileGameArea>

          {/* Instructions */}
          <div className={`text-center text-purple-200 mt-4 ${isMobile ? 'text-xs px-2' : 'text-sm'}`}>
            {isMobile ? 'Tap the zones when beats reach the hit zone!' : 'Click the numbered zones when beats reach the hit zone!'}
          </div>
        </div>
      </MobileGameLayout>
    )
  }

  // Game Over Screen
  return (
    <MobileGameLayout className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <div className="flex items-center justify-center min-h-screen">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center text-white max-w-md"
      >
        <motion.h1 
          className="text-4xl font-bold mb-4 text-indigo-400"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          Rhythm Session Complete!
        </motion.h1>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-sm text-purple-200 mb-1">Final Score</div>
              <div className="text-2xl font-bold text-yellow-400">{currentScore}</div>
            </div>
            <div>
              <div className="text-sm text-purple-200 mb-1">Accuracy</div>
              <div className="text-2xl font-bold text-green-400">{accuracy}%</div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2 mb-4 text-sm">
            <div>
              <div className="text-purple-200">Perfect</div>
              <div className="text-cyan-400 font-bold">{perfectHits}</div>
            </div>
            <div>
              <div className="text-purple-200">Good</div>
              <div className="text-blue-400 font-bold">{goodHits}</div>
            </div>
            <div>
              <div className="text-purple-200">Missed</div>
              <div className="text-red-400 font-bold">{missedHits}</div>
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
          <div className="text-xl font-bold text-indigo-400">{highScore}</div>
        </div>
        
        <div className="space-y-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startGame}
            className="w-full bg-gradient-to-r from-indigo-500 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
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
