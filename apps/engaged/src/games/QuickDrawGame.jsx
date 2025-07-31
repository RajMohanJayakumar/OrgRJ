import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { WEBSOCKET_EVENTS } from '../config/websocketEvents'
import { GAME_STATES, PLAYER_STATES } from '../constants/gameConstants'

/**
 * Quick Draw Game - Ellen Style
 * Players take turns drawing while others guess in real-time
 */
export default function QuickDrawGame({ onBack, roomCode, players, isHost, sendMessage }) {
  const [gameState, setGameState] = useState(GAME_STATES.LOBBY)
  const [currentDrawer, setCurrentDrawer] = useState(null)
  const [currentWord, setCurrentWord] = useState('')
  const [timeLeft, setTimeLeft] = useState(60)
  const [round, setRound] = useState(1)
  const [scores, setScores] = useState({})
  const [guesses, setGuesses] = useState([])
  const [myGuess, setMyGuess] = useState('')
  const [isDrawing, setIsDrawing] = useState(false)
  const [drawingData, setDrawingData] = useState([])
  
  const canvasRef = useRef(null)
  const isDrawingRef = useRef(false)
  const lastPointRef = useRef({ x: 0, y: 0 })

  // Canvas drawing functions
  const startDrawing = useCallback((e) => {
    if (!isDrawing) return
    
    isDrawingRef.current = true
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    lastPointRef.current = { x, y }
    
    // Send drawing start event
    if (sendMessage) {
      sendMessage({
        type: WEBSOCKET_EVENTS.QUICK_DRAW_STROKE,
        data: {
          roomCode,
          action: 'start',
          x, y,
          timestamp: Date.now()
        }
      })
    }
  }, [isDrawing, roomCode, sendMessage])

  const draw = useCallback((e) => {
    if (!isDrawingRef.current || !isDrawing) return
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    ctx.beginPath()
    ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y)
    ctx.lineTo(x, y)
    ctx.stroke()
    
    // Send drawing data
    if (sendMessage) {
      sendMessage({
        type: WEBSOCKET_EVENTS.QUICK_DRAW_STROKE,
        data: {
          roomCode,
          action: 'draw',
          fromX: lastPointRef.current.x,
          fromY: lastPointRef.current.y,
          toX: x,
          toY: y,
          timestamp: Date.now()
        }
      })
    }
    
    lastPointRef.current = { x, y }
  }, [isDrawing, roomCode, sendMessage])

  const stopDrawing = useCallback(() => {
    isDrawingRef.current = false
    
    if (sendMessage) {
      sendMessage({
        type: WEBSOCKET_EVENTS.QUICK_DRAW_STROKE,
        data: {
          roomCode,
          action: 'end',
          timestamp: Date.now()
        }
      })
    }
  }, [roomCode, sendMessage])

  // Touch events for mobile
  const handleTouchStart = useCallback((e) => {
    e.preventDefault()
    const touch = e.touches[0]
    const mouseEvent = new MouseEvent('mousedown', {
      clientX: touch.clientX,
      clientY: touch.clientY
    })
    startDrawing(mouseEvent)
  }, [startDrawing])

  const handleTouchMove = useCallback((e) => {
    e.preventDefault()
    const touch = e.touches[0]
    const mouseEvent = new MouseEvent('mousemove', {
      clientX: touch.clientX,
      clientY: touch.clientY
    })
    draw(mouseEvent)
  }, [draw])

  const handleTouchEnd = useCallback((e) => {
    e.preventDefault()
    stopDrawing()
  }, [stopDrawing])

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    ctx.strokeStyle = '#000'
    ctx.lineWidth = 3
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    // Set canvas size
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
  }, [])

  // Handle guess submission
  const submitGuess = () => {
    if (!myGuess.trim() || isDrawing) return

    // Add guess to local state for immediate feedback
    setGuesses(prev => [...prev, {
      playerName: 'You',
      text: myGuess.trim(),
      correct: false,
      timestamp: Date.now()
    }])

    if (sendMessage) {
      sendMessage({
        type: WEBSOCKET_EVENTS.QUICK_DRAW_GUESS,
        data: {
          roomCode,
          guess: myGuess.trim(),
          timestamp: Date.now()
        }
      })
    }

    setMyGuess('')
  }

  // Start game (host only)
  const startGame = () => {
    if (isHost && sendMessage) {
      sendMessage({
        type: WEBSOCKET_EVENTS.QUICK_DRAW_START,
        data: { roomCode }
      })
    }
  }

  // Clear canvas
  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }

  // Game lobby
  if (gameState === GAME_STATES.LOBBY) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.h1 
              className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🎨 Quick Draw
            </motion.h1>
            <p className="text-purple-200 text-lg">
              Draw and guess in real-time!
            </p>
            <div className="text-purple-300 text-sm mt-2">
              {roomCode ? (
                <>Room Code: <span className="font-bold text-pink-400">{roomCode}</span></>
              ) : (
                <span className="text-blue-400">🎮 Demo Mode - Single Player Practice</span>
              )}
            </div>
          </div>

          {/* Players List */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6">
            <h3 className="text-xl font-bold text-white mb-4">
              {players.length > 0 ? `Players (${players.length})` : 'Demo Mode'}
            </h3>
            {players.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {players.map((player, index) => (
                  <div
                    key={player.id}
                    className="bg-white/10 rounded-lg p-3 text-center"
                  >
                    <div className="text-white font-semibold">{player.name}</div>
                    <div className="text-purple-300 text-sm">
                      {player.role === 'host' ? '👑 Host' : '🎮 Player'}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-purple-200">
                <div className="text-4xl mb-2">🎨</div>
                <p>Practice your drawing skills in single-player mode!</p>
                <p className="text-sm text-purple-300 mt-2">
                  Connect a WebSocket server for multiplayer functionality
                </p>
              </div>
            )}
          </div>

          {/* Game Rules */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6">
            <h3 className="text-xl font-bold text-white mb-4">How to Play</h3>
            <div className="text-purple-200 space-y-2">
              <p>• Players take turns drawing a secret word</p>
              <p>• Other players guess what's being drawn</p>
              <p>• First correct guess gets the most points</p>
              <p>• Drawer gets points when someone guesses correctly</p>
              <p>• Game lasts 5 rounds with different drawers</p>
            </div>
          </div>

          {/* Controls */}
          <div className="text-center space-y-4">
            {players.length === 0 ? (
              // Demo mode
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startGame}
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
              >
                🎨 Start Drawing Practice
              </motion.button>
            ) : isHost ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startGame}
                disabled={players.length < 2}
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {players.length < 2 ? 'Need at least 2 players' : 'Start Game'}
              </motion.button>
            ) : (
              <div className="text-purple-300">
                Waiting for host to start the game...
              </div>
            )}
            
            <button
              onClick={onBack}
              className="block mx-auto text-purple-300 hover:text-white transition-colors duration-200"
            >
              ← Back to Games
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Game playing screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Game Header */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-4">
          <div className="flex justify-between items-center">
            <div className="text-white">
              <div className="text-lg font-bold">Round {round}/5</div>
              <div className="text-purple-300">
                {currentDrawer ? `${currentDrawer.name} is drawing` : 'Waiting...'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-400">{timeLeft}s</div>
              <div className="text-purple-300 text-sm">Time Left</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-white">
                {isDrawing ? `Draw: ${currentWord}` : 'Guess the drawing!'}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Drawing Canvas */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl p-4 h-96 lg:h-[500px]">
              <canvas
                ref={canvasRef}
                className="w-full h-full border-2 border-gray-200 rounded-lg cursor-crosshair"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              />
              {isDrawing && (
                <div className="mt-2 text-center">
                  <button
                    onClick={clearCanvas}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Clear Canvas
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Guessing Area */}
            {!isDrawing && (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                <h3 className="text-white font-bold mb-3">Your Guess</h3>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={myGuess}
                    onChange={(e) => setMyGuess(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && submitGuess()}
                    placeholder="What is being drawn?"
                    className="w-full px-3 py-2 rounded-lg border-0 focus:ring-2 focus:ring-pink-500"
                  />
                  <button
                    onClick={submitGuess}
                    disabled={!myGuess.trim()}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Submit Guess
                  </button>
                </div>
              </div>
            )}

            {/* Recent Guesses */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <h3 className="text-white font-bold mb-3">Recent Guesses</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {guesses.slice(-10).map((guess, index) => (
                  <div
                    key={index}
                    className={`text-sm p-2 rounded ${
                      guess.correct 
                        ? 'bg-green-500/20 text-green-300' 
                        : 'bg-white/10 text-purple-200'
                    }`}
                  >
                    <span className="font-semibold">{guess.playerName}:</span> {guess.text}
                  </div>
                ))}
              </div>
            </div>

            {/* Scores */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <h3 className="text-white font-bold mb-3">Scores</h3>
              <div className="space-y-2">
                {Object.entries(scores)
                  .sort(([,a], [,b]) => b - a)
                  .map(([playerId, score]) => {
                    const player = players.find(p => p.id === playerId)
                    return (
                      <div key={playerId} className="flex justify-between text-purple-200">
                        <span>{player?.name || 'Unknown'}</span>
                        <span className="font-bold">{score}</span>
                      </div>
                    )
                  })}
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center mt-6">
          <button
            onClick={onBack}
            className="text-purple-300 hover:text-white transition-colors duration-200"
          >
            ← Leave Game
          </button>
        </div>
      </div>
    </div>
  )
}
