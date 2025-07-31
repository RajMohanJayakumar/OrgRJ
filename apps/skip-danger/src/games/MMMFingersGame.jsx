import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useMMMGameState from '../hooks/useMMMGameState'
import useMMMSound from '../hooks/useMMMSound'
import useMMMHighScore from '../hooks/useMMMHighScore'
import useMMMTouchControls from '../hooks/useMMMTouchControls.jsx'
import { MMM_CONFIG, FINGER_MAP } from '../config/mmmConfig'

/**
 * MMM Fingers Game - Core Game Component
 * Multi-Modal Memory finger training game
 */
export default function MMMFingersGame({ gameMode = 'classic' }) {
  const [showSettings, setShowSettings] = useState(false)
  const [gameStartTime, setGameStartTime] = useState(null)

  // Game state management
  const {
    gameState,
    currentPattern,
    userPattern,
    currentLevel,
    lives,
    score,
    isShowingPattern,
    isWaitingForInput,
    patternIndex,
    timeRemaining,
    streak,
    feedback,
    patternLength,
    maxLives,
    progressPercent,
    startGame,
    pauseGame,
    resumeGame,
    resetGame,
    handleFingerPress: gameHandleFingerPress,
    isPlaying,
    isPaused,
    isGameOver,
    isInMenu
  } = useMMMGameState(gameMode)

  // Sound management
  const { 
    soundEnabled, 
    playSound, 
    playFingerSound, 
    playPatternSequence, 
    playHaptic, 
    toggleSound 
  } = useMMMSound(true)

  // Score management
  const {
    currentScore,
    highScore,
    isNewHighScore,
    updateScore,
    saveHighScore,
    resetScore,
    achievements,
    statistics
  } = useMMMHighScore(gameMode)

  // Touch controls
  const {
    isMobile,
    VirtualHands,
    TouchControlSettings,
    handleFingerPress,
    handleFingerRelease
  } = useMMMTouchControls()

  // Update score when game score changes
  useEffect(() => {
    updateScore(score)
  }, [score, updateScore])

  // Handle game over
  useEffect(() => {
    if (isGameOver && gameStartTime) {
      const playTime = Date.now() - gameStartTime
      saveHighScore(score, {
        level: currentLevel,
        streak,
        playTime,
        gameMode
      })
      setGameStartTime(null)
    }
  }, [isGameOver, score, currentLevel, streak, gameStartTime, saveHighScore, gameMode])

  // Handle finger press with sound feedback
  const handleFingerPressWithFeedback = useCallback((finger) => {
    if (!isWaitingForInput) return

    // Play finger sound
    playFingerSound(finger.position)
    playHaptic('light')

    // Handle game logic
    gameHandleFingerPress(finger)
  }, [isWaitingForInput, playFingerSound, playHaptic, gameHandleFingerPress])

  // Play pattern sequence when showing pattern
  useEffect(() => {
    if (isShowingPattern && currentPattern.length > 0) {
      playPatternSequence(currentPattern, 600)
    }
  }, [isShowingPattern, currentPattern, playPatternSequence])

  // Play feedback sounds
  useEffect(() => {
    if (feedback) {
      if (feedback.type === 'success') {
        playSound('SUCCESS')
        playHaptic('success')
      } else if (feedback.type === 'error') {
        playSound('ERROR')
        playHaptic('error')
      }
    }
  }, [feedback, playSound, playHaptic])

  // Start game with timer
  const handleStartGame = useCallback(() => {
    setGameStartTime(Date.now())
    resetScore()
    startGame()
    playSound('PATTERN_START')
  }, [startGame, resetScore, playSound])

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (isInMenu) return

      switch (e.key) {
        case ' ':
          e.preventDefault()
          if (isPlaying) {
            pauseGame()
          } else if (isPaused) {
            resumeGame()
          }
          break
        case 'Escape':
          resetGame()
          break
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
        case '0':
          const fingerIndex = parseInt(e.key) - 1
          if (fingerIndex >= 0 && fingerIndex < 10) {
            const finger = Object.values(FINGER_MAP.LEFT_HAND).concat(Object.values(FINGER_MAP.RIGHT_HAND))[fingerIndex]
            if (finger) {
              handleFingerPressWithFeedback(finger)
            }
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isInMenu, isPlaying, isPaused, pauseGame, resumeGame, resetGame, handleFingerPressWithFeedback])

  // Get highlighted fingers for current pattern element
  const getHighlightedFingers = () => {
    if (!isShowingPattern || patternIndex < 0) return []
    
    const currentElement = currentPattern[patternIndex]
    return currentElement ? [currentElement.finger.id] : []
  }

  // Get color map for pattern elements
  const getColorMap = () => {
    const colorMap = {}
    if (isShowingPattern && patternIndex >= 0) {
      const currentElement = currentPattern[patternIndex]
      if (currentElement && currentElement.color) {
        colorMap[currentElement.finger.id] = currentElement.color
      }
    }
    return colorMap
  }

  // Menu Screen
  if (isInMenu) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center text-white max-w-md"
        >
          <motion.h1 
            className="text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            MMM Fingers
          </motion.h1>
          
          <p className="text-xl mb-2 text-blue-200">Multi-Modal Memory Training</p>
          <p className="text-sm mb-8 text-blue-300">
            {MMM_CONFIG.MODES[gameMode.toUpperCase()]?.description || 'Train your finger memory'}
          </p>

          <div className="space-y-4 mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-sm text-blue-200 mb-2">High Score</div>
              <div className="text-2xl font-bold text-yellow-400">{highScore.toLocaleString()}</div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <div className="text-blue-200">Games Played</div>
                <div className="text-lg font-bold">{statistics.gamesPlayed}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <div className="text-blue-200">Best Streak</div>
                <div className="text-lg font-bold">{statistics.bestStreak}</div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <motion.button
              onClick={handleStartGame}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold py-4 px-8 rounded-xl text-lg shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Game
            </motion.button>

            <div className="flex gap-2">
              <motion.button
                onClick={toggleSound}
                className={`flex-1 ${soundEnabled ? 'bg-green-500' : 'bg-gray-500'} text-white font-bold py-3 px-4 rounded-lg`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {soundEnabled ? '🔊' : '🔇'} Sound
              </motion.button>

              {isMobile && (
                <motion.button
                  onClick={() => setShowSettings(true)}
                  className="flex-1 bg-blue-500 text-white font-bold py-3 px-4 rounded-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ⚙️ Controls
                </motion.button>
              )}
            </div>
          </div>

          <div className="mt-8 text-xs text-blue-300">
            {isMobile ? 'Tap fingers on screen' : 'Use number keys 1-0 or click fingers'}
          </div>
        </motion.div>

        {showSettings && (
          <TouchControlSettings onClose={() => setShowSettings(false)} />
        )}
      </div>
    )
  }

  // Game Screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-20"
            animate={{
              x: [0, Math.random() * window.innerWidth],
              y: [0, Math.random() * window.innerHeight],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
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

      {/* Game UI */}
      <div className="relative z-10 p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <motion.button
              onClick={resetGame}
              className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ← Menu
            </motion.button>
            
            <div className="text-white">
              <div className="text-sm text-blue-200">Level {currentLevel}</div>
              <div className="text-lg font-bold">Score: {score.toLocaleString()}</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Lives */}
            <div className="flex gap-1">
              {[...Array(maxLives)].map((_, i) => (
                <div
                  key={i}
                  className={`w-6 h-6 rounded-full ${i < lives ? 'bg-red-500' : 'bg-gray-600'}`}
                />
              ))}
            </div>

            {/* Pause button */}
            {isPlaying && (
              <motion.button
                onClick={pauseGame}
                className="bg-yellow-500 text-white px-4 py-2 rounded-lg font-bold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ⏸️
              </motion.button>
            )}
          </div>
        </div>

        {/* Game Status */}
        <div className="text-center mb-6">
          {isShowingPattern && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-white"
            >
              <div className="text-2xl font-bold mb-2">Watch the Pattern</div>
              <div className="text-lg text-blue-200">
                {patternIndex + 1} of {currentPattern.length}
              </div>
            </motion.div>
          )}

          {isWaitingForInput && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-white"
            >
              <div className="text-2xl font-bold mb-2">Repeat the Pattern</div>
              <div className="text-lg text-blue-200">
                {userPattern.length} of {currentPattern.length}
              </div>
              <div className="text-sm text-yellow-400 mt-2">
                Time: {Math.ceil(timeRemaining / 1000)}s
              </div>
              
              {/* Progress bar */}
              <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                <motion.div
                  className="bg-blue-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>
          )}

          {isPaused && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-white"
            >
              <div className="text-2xl font-bold mb-2">Paused</div>
              <motion.button
                onClick={resumeGame}
                className="bg-green-500 text-white px-6 py-3 rounded-lg font-bold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Resume
              </motion.button>
            </motion.div>
          )}
        </div>

        {/* Feedback */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 p-6 rounded-xl text-white font-bold text-xl ${
                feedback.type === 'success' ? 'bg-green-500' : 'bg-red-500'
              }`}
            >
              {feedback.message}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Streak indicator */}
        {streak > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="fixed top-4 right-4 bg-orange-500 text-white px-4 py-2 rounded-full font-bold"
          >
            🔥 {streak} streak
          </motion.div>
        )}

        {/* Desktop finger visualization */}
        {!isMobile && (
          <div className="flex justify-center mb-8">
            <div className="grid grid-cols-10 gap-2">
              {Object.values(FINGER_MAP.LEFT_HAND).concat(Object.values(FINGER_MAP.RIGHT_HAND)).map((finger) => (
                <motion.button
                  key={finger.id}
                  onClick={() => handleFingerPressWithFeedback(finger)}
                  className={`w-12 h-16 rounded-lg border-2 flex items-center justify-center font-bold transition-all duration-200 ${
                    getHighlightedFingers().includes(finger.id)
                      ? 'bg-yellow-400 border-yellow-500 text-white scale-105 animate-pulse'
                      : 'bg-white/90 border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={!isWaitingForInput}
                >
                  {finger.position + 1}
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Virtual Hands for Mobile */}
      {isMobile && (
        <VirtualHands
          onFingerPress={handleFingerPressWithFeedback}
          highlightedFingers={getHighlightedFingers()}
          colorMap={getColorMap()}
          showLabels={true}
        />
      )}

      {/* Game Over Screen */}
      {isGameOver && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-8 text-center max-w-md mx-4"
          >
            <h2 className="text-3xl font-bold mb-4 text-gray-800">Game Over!</h2>
            
            <div className="space-y-4 mb-6">
              <div className="text-2xl font-bold text-blue-600">
                Score: {score.toLocaleString()}
              </div>
              
              {isNewHighScore && (
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="text-lg font-bold text-yellow-600"
                >
                  🏆 New High Score! 🏆
                </motion.div>
              )}
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-600">Level Reached</div>
                  <div className="text-lg font-bold">{currentLevel}</div>
                </div>
                <div>
                  <div className="text-gray-600">Best Streak</div>
                  <div className="text-lg font-bold">{streak}</div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <motion.button
                onClick={handleStartGame}
                className="w-full bg-blue-500 text-white font-bold py-3 px-6 rounded-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Play Again
              </motion.button>
              
              <motion.button
                onClick={resetGame}
                className="w-full bg-gray-500 text-white font-bold py-3 px-6 rounded-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Main Menu
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
