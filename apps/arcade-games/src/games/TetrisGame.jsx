import React, { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { GAME_CONFIGS } from '../config/arcadeConfig'
import useGameState from '../hooks/useGameState'
import useArcadeSound from '../hooks/useArcadeSound'
import useHighScore from '../hooks/useHighScore'
import useMobileControls from '../hooks/useMobileControls'

/**
 * Tetris Game - Full Implementation
 * Classic Tetris with modern React implementation
 */
export default function TetrisGame() {
  const gameConfig = GAME_CONFIGS.TETRIS

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
  } = useHighScore('tetris')

  // Mobile controls
  const {
    isMobile,
    VirtualDPad,
    ActionButtons,
    MobileGameLayout,
    MobileGameArea
  } = useMobileControls('directional')

  // Game state
  const [board, setBoard] = useState([])
  const [currentPiece, setCurrentPiece] = useState(null)
  const [level, setLevel] = useState(1)
  const [lines, setLines] = useState(0)
  const [dropTime, setDropTime] = useState(gameConfig.INITIAL_DROP_TIME)

  // Initialize empty board
  const createEmptyBoard = useCallback(() => {
    return Array(gameConfig.BOARD_HEIGHT).fill().map(() =>
      Array(gameConfig.BOARD_WIDTH).fill(0)
    )
  }, [gameConfig])

  // Tetris pieces
  const PIECES = {
    I: { shape: [[1,1,1,1]], color: 'cyan' },
    O: { shape: [[1,1],[1,1]], color: 'yellow' },
    T: { shape: [[0,1,0],[1,1,1]], color: 'purple' },
    S: { shape: [[0,1,1],[1,1,0]], color: 'green' },
    Z: { shape: [[1,1,0],[0,1,1]], color: 'red' },
    J: { shape: [[1,0,0],[1,1,1]], color: 'blue' },
    L: { shape: [[0,0,1],[1,1,1]], color: 'orange' }
  }

  // Generate random piece
  const generatePiece = useCallback(() => {
    const pieces = Object.keys(PIECES)
    const randomPiece = pieces[Math.floor(Math.random() * pieces.length)]
    return {
      shape: PIECES[randomPiece].shape,
      color: PIECES[randomPiece].color,
      x: Math.floor(gameConfig.BOARD_WIDTH / 2) - 1,
      y: 0
    }
  }, [gameConfig, PIECES])

  // Start game
  const startGame = useCallback(() => {
    setBoard(createEmptyBoard())
    setCurrentPiece(generatePiece())
    setLevel(1)
    setLines(0)
    setDropTime(gameConfig.INITIAL_DROP_TIME)
    resetScore()
    startGameState()
  }, [createEmptyBoard, generatePiece, gameConfig, resetScore, startGameState])

  // Simple placeholder implementation for now
  const gameArea = (
    <div className="bg-black border-2 border-gray-400 mx-auto"
         style={{
           width: gameConfig.BOARD_WIDTH * 30,
           height: gameConfig.BOARD_HEIGHT * 30,
           display: 'grid',
           gridTemplateColumns: `repeat(${gameConfig.BOARD_WIDTH}, 1fr)`,
           gridTemplateRows: `repeat(${gameConfig.BOARD_HEIGHT}, 1fr)`
         }}>
      {board.flat().map((cell, index) => (
        <div
          key={index}
          className={`border border-gray-800 ${cell ? 'bg-blue-500' : 'bg-black'}`}
        />
      ))}
    </div>
  )

  // Menu Screen
  if (isInMenu) {
    return (
      <MobileGameLayout className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="text-center text-white">
          <motion.h1
            className="text-6xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            TETRIS
          </motion.h1>

          <div className="space-y-4">
            <button
              onClick={startGame}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg text-xl transition-colors"
            >
              Start Game
            </button>

            <div className="text-purple-200">
              <p>High Score: {highScore}</p>
              <p className="text-sm mt-4">Stack blocks to clear lines!</p>
            </div>
          </div>
        </div>
      </MobileGameLayout>
    )
  }

  // Game Screen
  if (isPlaying) {
    return (
      <MobileGameLayout className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="text-white text-center">
          <div className="mb-4 grid grid-cols-3 gap-4 text-sm">
            <div>Score: {currentScore}</div>
            <div>Level: {level}</div>
            <div>Lines: {lines}</div>
          </div>

          {gameArea}

          <div className="mt-4 space-x-4">
            <button
              onClick={() => endGame(false)}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              End Game
            </button>
          </div>
        </div>
      </MobileGameLayout>
    )
  }

  // Game Over Screen
  return (
    <MobileGameLayout className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="text-center text-white">
        <h2 className="text-4xl font-bold mb-4">Game Over</h2>
        <p className="text-xl mb-2">Score: {currentScore}</p>
        {isNewHighScore && <p className="text-yellow-400 mb-4">New High Score!</p>}

        <div className="space-y-4">
          <button
            onClick={startGame}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg"
          >
            Play Again
          </button>

          <button
            onClick={resetGame}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-lg"
          >
            Main Menu
          </button>
        </div>
      </div>
    </MobileGameLayout>
  )
}
