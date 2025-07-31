import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useGameState from '../hooks/useGameState'
import useArcadeSound from '../hooks/useArcadeSound'
import useHighScore from '../hooks/useHighScore'
import useMobileControls from '../hooks/useMobileControls'
import { GAME_CONFIGS } from '../config/arcadeConfig'

/**
 * Pong Game - Mobile-Enhanced Implementation
 * Classic paddle game with AI opponent and mobile controls
 */
export default function PongGame() {
  const gameConfig = GAME_CONFIGS.PONG

  // Game state management
  const {
    gameState,
    isPlaying,
    isInMenu,
    isGameOver,
    startGame: startGameState,
    endGame,
    resetGame,
    handleKeyPress
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
  } = useHighScore('pong')

  // Mobile controls
  const {
    isMobile,
    VirtualDPad,
    ActionButtons,
    MobileGameLayout,
    MobileGameArea,
    touchControls
  } = useMobileControls('directional')

  // Game state
  const [playerPaddle, setPlayerPaddle] = useState({ y: 160 })
  const [aiPaddle, setAiPaddle] = useState({ y: 160 })
  const [ball, setBall] = useState({
    x: 400,
    y: 200,
    dx: 5,
    dy: 3
  })
  const [playerScore, setPlayerScore] = useState(0)
  const [aiScore, setAiScore] = useState(0)
  const [difficulty, setDifficulty] = useState('medium')
  const gameLoopRef = useRef()

  // Mobile-responsive dimensions
  const canvasWidth = isMobile ? Math.min(350, window.innerWidth - 20) : gameConfig.CANVAS_WIDTH
  const canvasHeight = isMobile ? Math.min(250, window.innerHeight * 0.4) : gameConfig.CANVAS_HEIGHT
  const paddleHeight = isMobile ? canvasHeight * 0.15 : gameConfig.PADDLE_HEIGHT
  const paddleWidth = isMobile ? 8 : gameConfig.PADDLE_WIDTH
  const ballSize = isMobile ? 8 : gameConfig.BALL_SIZE

  // Handle paddle movement
  const movePaddle = useCallback((direction) => {
    setPlayerPaddle(prev => {
      let newY = prev.y
      const speed = gameConfig.PADDLE_SPEED

      if (direction === 'up' && newY > 0) {
        newY -= speed
      } else if (direction === 'down' && newY < canvasHeight - paddleHeight) {
        newY += speed
      }

      return { y: Math.max(0, Math.min(canvasHeight - paddleHeight, newY)) }
    })
  }, [canvasHeight, paddleHeight, gameConfig.PADDLE_SPEED])

  // Handle keyboard input
  const handleGameKeyPress = useCallback((e) => {
    const keyHandlers = {
      'ArrowUp': () => movePaddle('up'),
      'ArrowDown': () => movePaddle('down'),
      'w': () => movePaddle('up'),
      'W': () => movePaddle('up'),
      's': () => movePaddle('down'),
      'S': () => movePaddle('down')
    }

    handleKeyPress(e, keyHandlers)
  }, [movePaddle, handleKeyPress])

  // Handle mobile controls
  useEffect(() => {
    if (touchControls.up) movePaddle('up')
    else if (touchControls.down) movePaddle('down')
  }, [touchControls, movePaddle])

  // Game loop
  const gameLoop = useCallback(() => {
    // Move ball
    setBall(prevBall => {
      let newBall = {
        x: prevBall.x + prevBall.dx,
        y: prevBall.y + prevBall.dy,
        dx: prevBall.dx,
        dy: prevBall.dy
      }

      // Ball collision with top/bottom walls
      if (newBall.y <= 0 || newBall.y >= canvasHeight - ballSize) {
        newBall.dy = -newBall.dy
        playSound(SOUNDS.WALL)
      }

      // Ball collision with player paddle
      if (newBall.x <= paddleWidth &&
          newBall.y >= playerPaddle.y &&
          newBall.y <= playerPaddle.y + paddleHeight) {
        newBall.dx = -newBall.dx
        newBall.x = paddleWidth
        playSound(SOUNDS.PADDLE)
      }

      // Ball collision with AI paddle
      if (newBall.x >= canvasWidth - paddleWidth - ballSize &&
          newBall.y >= aiPaddle.y &&
          newBall.y <= aiPaddle.y + paddleHeight) {
        newBall.dx = -newBall.dx
        newBall.x = canvasWidth - paddleWidth - ballSize
        playSound(SOUNDS.PADDLE)
      }

      // Ball goes off left side (AI scores)
      if (newBall.x < 0) {
        setAiScore(prev => prev + 1)
        playSound(SOUNDS.SCORE)
        return { x: canvasWidth / 2, y: canvasHeight / 2, dx: 5, dy: 3 }
      }

      // Ball goes off right side (Player scores)
      if (newBall.x > canvasWidth) {
        setPlayerScore(prev => {
          const newScore = prev + 1
          updateScore(currentScore + 100)
          return newScore
        })
        playSound(SOUNDS.SCORE)
        return { x: canvasWidth / 2, y: canvasHeight / 2, dx: -5, dy: 3 }
      }

      return newBall
    })

    // AI paddle movement
    setAiPaddle(prev => {
      const difficultySettings = gameConfig.DIFFICULTY_SETTINGS[difficulty]
      const aiSpeed = difficultySettings.aiSpeed
      const ballCenterY = ball.y + ballSize / 2
      const paddleCenterY = prev.y + paddleHeight / 2

      let newY = prev.y

      if (ballCenterY < paddleCenterY - 10) {
        newY -= aiSpeed
      } else if (ballCenterY > paddleCenterY + 10) {
        newY += aiSpeed
      }

      return { y: Math.max(0, Math.min(canvasHeight - paddleHeight, newY)) }
    })

    // Check for game end
    if (playerScore >= gameConfig.WINNING_SCORE) {
      endGame(true)
      saveHighScore(currentScore)
    } else if (aiScore >= gameConfig.WINNING_SCORE) {
      endGame(false)
      saveHighScore(currentScore)
    }
  }, [ball, playerPaddle, aiPaddle, playerScore, aiScore, difficulty, canvasWidth, canvasHeight, paddleHeight, paddleWidth, ballSize, gameConfig, playSound, SOUNDS, updateScore, currentScore, endGame, saveHighScore])

  // Game loop effect
  useEffect(() => {
    if (isPlaying) {
      gameLoopRef.current = setInterval(gameLoop, 16) // ~60fps
    } else {
      clearInterval(gameLoopRef.current)
    }

    return () => clearInterval(gameLoopRef.current)
  }, [isPlaying, gameLoop])

  // Keyboard event listener
  useEffect(() => {
    window.addEventListener('keydown', handleGameKeyPress)
    return () => window.removeEventListener('keydown', handleGameKeyPress)
  }, [handleGameKeyPress])

  // Start game
  const startGame = () => {
    startGameState()
    setPlayerPaddle({ y: canvasHeight / 2 - paddleHeight / 2 })
    setAiPaddle({ y: canvasHeight / 2 - paddleHeight / 2 })
    setBall({ x: canvasWidth / 2, y: canvasHeight / 2, dx: 5, dy: 3 })
    setPlayerScore(0)
    setAiScore(0)
    resetScore()
  }

  // Menu Screen
  if (isInMenu) {
    return (
      <MobileGameLayout className="bg-gradient-to-br from-blue-900 via-cyan-800 to-teal-900">
        <div className="flex items-center justify-center min-h-screen">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center text-white max-w-md mx-auto px-4"
          >
            <motion.h1
              className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🏓 Pong
            </motion.h1>

            <p className="text-blue-200 mb-6">
              Classic paddle game! First to {gameConfig.WINNING_SCORE} points wins. Control your paddle to beat the AI!
            </p>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6">
              <div className="text-sm text-blue-200 mb-2">High Score</div>
              <div className="text-2xl font-bold text-yellow-400">{highScore}</div>
            </div>

            {/* Difficulty Selection */}
            <div className="mb-6">
              <div className="text-sm text-blue-200 mb-2">Difficulty</div>
              <div className="flex gap-2 justify-center">
                {Object.keys(gameConfig.DIFFICULTY_SETTINGS).map(diff => (
                  <button
                    key={diff}
                    onClick={() => setDifficulty(diff)}
                    className={`px-3 py-1 rounded-lg text-sm font-semibold transition-colors ${
                      difficulty === diff
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                    }`}
                  >
                    {diff.charAt(0).toUpperCase() + diff.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startGame}
              className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-8 py-3 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 mb-4"
            >
              Start Game
            </motion.button>

            <div className="flex items-center justify-center gap-2">
              <button
                onClick={toggleSound}
                className={`p-2 rounded-lg transition-colors ${
                  soundEnabled ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-300'
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
      <MobileGameLayout className="bg-gradient-to-br from-blue-900 via-cyan-800 to-teal-900">
        <div className={`mx-auto ${isMobile ? 'max-w-full px-2' : 'max-w-4xl'}`}>
          {/* Game HUD */}
          <div className={`bg-white/10 backdrop-blur-sm rounded-xl p-3 mb-3 text-white ${isMobile ? 'mx-2' : ''}`}>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className={`text-blue-200 ${isMobile ? 'text-xs' : 'text-sm'}`}>You</div>
                <div className={`font-bold text-green-400 ${isMobile ? 'text-xl' : 'text-3xl'}`}>{playerScore}</div>
              </div>
              <div>
                <div className={`text-blue-200 ${isMobile ? 'text-xs' : 'text-sm'}`}>Score</div>
                <div className={`font-bold text-yellow-400 ${isMobile ? 'text-lg' : 'text-xl'}`}>{currentScore}</div>
              </div>
              <div>
                <div className={`text-blue-200 ${isMobile ? 'text-xs' : 'text-sm'}`}>AI</div>
                <div className={`font-bold text-red-400 ${isMobile ? 'text-xl' : 'text-3xl'}`}>{aiScore}</div>
              </div>
            </div>
          </div>

          {/* Game Area */}
          <MobileGameArea className="flex justify-center">
            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-2 border-2 border-cyan-500/30">
              <div
                className="relative bg-black border-2 border-cyan-400 overflow-hidden"
                style={{
                  width: canvasWidth,
                  height: canvasHeight
                }}
              >
                {/* Center line */}
                <div
                  className="absolute bg-white/30"
                  style={{
                    left: '50%',
                    top: 0,
                    width: '2px',
                    height: '100%',
                    transform: 'translateX(-50%)'
                  }}
                />

                {/* Player Paddle */}
                <div
                  className="absolute bg-green-400 rounded-sm"
                  style={{
                    left: 0,
                    top: playerPaddle.y,
                    width: paddleWidth,
                    height: paddleHeight
                  }}
                />

                {/* AI Paddle */}
                <div
                  className="absolute bg-red-400 rounded-sm"
                  style={{
                    right: 0,
                    top: aiPaddle.y,
                    width: paddleWidth,
                    height: paddleHeight
                  }}
                />

                {/* Ball */}
                <motion.div
                  className="absolute bg-white rounded-full shadow-lg"
                  style={{
                    left: ball.x,
                    top: ball.y,
                    width: ballSize,
                    height: ballSize,
                    boxShadow: '0 0 10px rgba(255, 255, 255, 0.8)'
                  }}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.3, repeat: Infinity }}
                />

                {/* Score zones indicators */}
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-red-400 text-xs font-bold opacity-50">
                  AI ZONE
                </div>
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-green-400 text-xs font-bold opacity-50">
                  YOUR ZONE
                </div>
              </div>
            </div>
          </MobileGameArea>

          {/* Controls */}
          <div className={`text-center text-blue-200 mt-3 ${isMobile ? 'text-xs px-2' : 'text-sm'}`}>
            {isMobile ? 'Use controls to move your paddle up and down' : 'Use arrow keys or W/S to move your paddle | Space to pause'}
          </div>
        </div>

        {/* Mobile Controls */}
        {isMobile && (
          <>
            <VirtualDPad
              onDirectionPress={movePaddle}
              size="large"
            />
            <ActionButtons
              buttons={[
                { key: 'pause', label: '⏸', onPress: () => handleKeyPress({ key: ' ' }, {}) }
              ]}
              size="large"
            />
          </>
        )}
      </MobileGameLayout>
    )
  }

  // Game Over Screen
  return (
    <MobileGameLayout className="bg-gradient-to-br from-blue-900 via-cyan-800 to-teal-900">
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center text-white max-w-md mx-auto px-4"
        >
          <motion.h1
            className={`font-bold mb-4 ${playerScore > aiScore ? 'text-green-400' : 'text-red-400'} ${isMobile ? 'text-3xl' : 'text-4xl'}`}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            {playerScore > aiScore ? 'You Win! 🎉' : 'AI Wins! 🤖'}
          </motion.h1>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-sm text-blue-200 mb-1">Final Score</div>
                <div className="text-2xl font-bold text-yellow-400">{currentScore}</div>
              </div>
              <div>
                <div className="text-sm text-blue-200 mb-1">Match Score</div>
                <div className="text-2xl font-bold text-cyan-400">{playerScore} - {aiScore}</div>
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

            <div className="text-sm text-blue-200 mb-1">High Score</div>
            <div className="text-xl font-bold text-blue-400">{highScore}</div>
          </div>

          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startGame}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
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
