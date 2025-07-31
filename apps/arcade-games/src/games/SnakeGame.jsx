import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useGameState from '../hooks/useGameState'
import useArcadeSound from '../hooks/useArcadeSound'
import useHighScore from '../hooks/useHighScore'
import useMobileControls from '../hooks/useMobileControls.jsx'
import { GAME_CONFIGS } from '../config/arcadeConfig'

/**
 * Classic Snake Game - Modular Arcade Implementation
 * Navigate the snake to eat food and grow longer
 */
export default function SnakeGame() {
  const gameConfig = GAME_CONFIGS.SNAKE
  
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
  } = useHighScore('snake')

  // Mobile controls
  const {
    isMobile,
    VirtualDPad,
    SwipeArea,
    MobileGameLayout,
    MobileGameArea,
    touchControls
  } = useMobileControls('directional')
  
  // Game state
  const [snake, setSnake] = useState([{ x: 10, y: 10 }])
  const [food, setFood] = useState({ x: 15, y: 15 })
  const [direction, setDirection] = useState({ x: 0, y: 1 })
  const [speed, setSpeed] = useState(gameConfig.INITIAL_SPEED)
  const gameLoopRef = useRef()

  // Generate random food position
  const generateFood = useCallback(() => {
    let newFood
    do {
      newFood = {
        x: Math.floor(Math.random() * gameConfig.BOARD_SIZE),
        y: Math.floor(Math.random() * gameConfig.BOARD_SIZE)
      }
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y))
    return newFood
  }, [snake, gameConfig.BOARD_SIZE])

  // Game loop
  const gameLoop = useCallback(() => {
    setSnake(currentSnake => {
      const newSnake = [...currentSnake]
      const head = { ...newSnake[0] }
      
      head.x += direction.x
      head.y += direction.y
      
      // Check wall collision
      if (head.x < 0 || head.x >= gameConfig.BOARD_SIZE || head.y < 0 || head.y >= gameConfig.BOARD_SIZE) {
        endGame(false)
        playSound(SOUNDS.GAME_OVER)
        return currentSnake
      }
      
      // Check self collision
      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        endGame(false)
        playSound(SOUNDS.GAME_OVER)
        return currentSnake
      }
      
      newSnake.unshift(head)
      
      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        updateScore(currentScore + gameConfig.SCORE_PER_FOOD)
        setFood(generateFood())
        playSound(SOUNDS.EAT)
        // Increase speed slightly
        setSpeed(prev => Math.max(gameConfig.MIN_SPEED, prev - gameConfig.SPEED_INCREMENT))
      } else {
        newSnake.pop()
      }
      
      return newSnake
    })
  }, [direction, food, generateFood, endGame, playSound, SOUNDS, updateScore, currentScore, gameConfig])

  // Handle direction changes (keyboard and mobile)
  const changeDirection = useCallback((newDirection) => {
    switch (newDirection) {
      case 'up':
        if (direction.y === 0) setDirection({ x: 0, y: -1 })
        break
      case 'down':
        if (direction.y === 0) setDirection({ x: 0, y: 1 })
        break
      case 'left':
        if (direction.x === 0) setDirection({ x: -1, y: 0 })
        break
      case 'right':
        if (direction.x === 0) setDirection({ x: 1, y: 0 })
        break
    }
  }, [direction])

  // Handle keyboard input
  const handleGameKeyPress = useCallback((e) => {
    const keyHandlers = {
      'ArrowUp': () => changeDirection('up'),
      'ArrowDown': () => changeDirection('down'),
      'ArrowLeft': () => changeDirection('left'),
      'ArrowRight': () => changeDirection('right'),
      'w': () => changeDirection('up'),
      'W': () => changeDirection('up'),
      's': () => changeDirection('down'),
      'S': () => changeDirection('down'),
      'a': () => changeDirection('left'),
      'A': () => changeDirection('left'),
      'd': () => changeDirection('right'),
      'D': () => changeDirection('right')
    }

    handleKeyPress(e, keyHandlers)
  }, [changeDirection, handleKeyPress])

  // Handle mobile controls
  useEffect(() => {
    if (touchControls.up) changeDirection('up')
    else if (touchControls.down) changeDirection('down')
    else if (touchControls.left) changeDirection('left')
    else if (touchControls.right) changeDirection('right')
  }, [touchControls, changeDirection])

  // Game loop effect
  useEffect(() => {
    if (isPlaying) {
      gameLoopRef.current = setInterval(gameLoop, speed)
    } else {
      clearInterval(gameLoopRef.current)
    }
    
    return () => clearInterval(gameLoopRef.current)
  }, [isPlaying, gameLoop, speed])

  // Keyboard event listener
  useEffect(() => {
    window.addEventListener('keydown', handleGameKeyPress)
    return () => window.removeEventListener('keydown', handleGameKeyPress)
  }, [handleGameKeyPress])

  // Start game
  const startGame = () => {
    startGameState()
    setSnake([{ x: 10, y: 10 }])
    setFood({ x: 15, y: 15 })
    setDirection({ x: 0, y: 1 })
    resetScore()
    setSpeed(gameConfig.INITIAL_SPEED)
  }

  // End game effect
  useEffect(() => {
    if (isGameOver) {
      saveHighScore(currentScore)
    }
  }, [isGameOver, currentScore, saveHighScore])

  // Menu Screen
  if (isInMenu) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-800 to-teal-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center text-white max-w-md"
        >
          <motion.h1 
            className="text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🐍 Snake Game
          </motion.h1>
          
          <p className="text-green-200 mb-6">
            Use arrow keys to control the snake. Eat food to grow and score points!
          </p>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6">
            <div className="text-sm text-green-200 mb-2">High Score</div>
            <div className="text-2xl font-bold text-yellow-400">{highScore}</div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startGame}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Start Game
          </motion.button>
          
          <div className="mt-4 flex items-center justify-center gap-2">
            <button
              onClick={toggleSound}
              className={`p-2 rounded-lg transition-colors ${
                soundEnabled ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'
              }`}
            >
              {soundEnabled ? '🔊' : '🔇'}
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  // Game Screen
  if (isPlaying) {
    return (
      <MobileGameLayout className="bg-gradient-to-br from-green-900 via-emerald-800 to-teal-900">
        <SwipeArea
          onSwipe={changeDirection}
          className="h-full"
        >
          <div className={`mx-auto ${isMobile ? 'max-w-full' : 'max-w-2xl'}`}>
            {/* Game HUD */}
            <div className={`bg-white/10 backdrop-blur-sm rounded-xl p-3 mb-3 text-white text-center ${isMobile ? 'mx-2' : ''}`}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className={`text-green-200 ${isMobile ? 'text-xs' : 'text-sm'}`}>Score</div>
                  <div className={`font-bold text-yellow-400 ${isMobile ? 'text-lg' : 'text-2xl'}`}>{currentScore}</div>
                </div>
                <div>
                  <div className={`text-green-200 ${isMobile ? 'text-xs' : 'text-sm'}`}>Length</div>
                  <div className={`font-bold text-green-400 ${isMobile ? 'text-lg' : 'text-2xl'}`}>{snake.length}</div>
                </div>
              </div>
            </div>

            {/* Game Board */}
            <MobileGameArea className="flex justify-center">
              <div className={`bg-black/20 backdrop-blur-sm rounded-xl p-2 ${isMobile ? 'w-full max-w-sm' : ''}`}>
                <div
                  className="relative bg-gray-900 border-2 border-green-500 mx-auto"
                  style={{
                    width: isMobile ? Math.min(320, window.innerWidth - 40) : gameConfig.BOARD_SIZE * gameConfig.CELL_SIZE,
                    height: isMobile ? Math.min(320, window.innerWidth - 40) : gameConfig.BOARD_SIZE * gameConfig.CELL_SIZE,
                    display: 'grid',
                    gridTemplateColumns: `repeat(${gameConfig.BOARD_SIZE}, 1fr)`,
                    gridTemplateRows: `repeat(${gameConfig.BOARD_SIZE}, 1fr)`
                  }}
                >
              {/* Snake */}
              {snake.map((segment, index) => (
                <div
                  key={index}
                  className={`${index === 0 ? 'bg-green-400' : 'bg-green-600'} border border-green-300`}
                  style={{
                    gridColumn: segment.x + 1,
                    gridRow: segment.y + 1
                  }}
                />
              ))}
              
              {/* Food */}
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="bg-red-500 border border-red-300 rounded-full"
                style={{
                  gridColumn: food.x + 1,
                  gridRow: food.y + 1
                }}
              />
                </div>
              </div>
            </MobileGameArea>

            {/* Controls */}
            <div className={`text-center text-green-200 mt-3 ${isMobile ? 'text-xs px-2' : 'text-sm'}`}>
              {isMobile ? 'Swipe or use controls to move | Tap center to pause' : 'Use arrow keys or WASD to control the snake | Space to pause'}
            </div>
          </div>

          {/* Mobile Controls */}
          {isMobile && (
            <VirtualDPad
              onDirectionPress={changeDirection}
              size="large"
            />
          )}
        </SwipeArea>
      </MobileGameLayout>
    )
  }

  // Game Over Screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-800 to-teal-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center text-white max-w-md"
      >
        <motion.h1 
          className="text-4xl font-bold mb-4 text-red-400"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          Game Over!
        </motion.h1>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
          <div className="text-sm text-green-200 mb-2">Final Score</div>
          <div className="text-3xl font-bold text-yellow-400 mb-4">{currentScore}</div>
          
          {isNewHighScore && currentScore > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-yellow-400 font-semibold mb-2"
            >
              🎉 New High Score! 🎉
            </motion.div>
          )}
          
          <div className="text-sm text-green-200 mb-1">High Score</div>
          <div className="text-xl font-bold text-green-400">{highScore}</div>
        </div>
        
        <div className="space-y-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startGame}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
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
  )
}
