import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useWebSocket from '../hooks/useWebSocket'
import { GAME_TYPES } from '../constants/gameConstants'

// Direct imports for debugging (temporary)
import QuickDrawGame from '../games/QuickDrawGame'
import WordAssociationGame from '../games/WordAssociationGame'
import EmojiChainsGame from '../games/EmojiChainsGame'
import RapidFireQAGame from '../games/RapidFireQAGame'
import StoryBuildingGame from '../games/StoryBuildingGame'
import VotingPollGame from '../games/VotingPollGame'

/**
 * Ellen Games Module - Main Component
 * Interactive multiplayer games with WebSocket connectivity
 */
export default function EllenGamesModule() {
  const [selectedGame, setSelectedGame] = useState(null)

  // WebSocket connection
  const {
    isConnected,
    connectionStatus,
    sendMessage
  } = useWebSocket()

  // Game room management (mock for now since no WebSocket server)
  const currentRoom = null
  const players = []
  const isHost = false

  // Handle URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const ellenGame = urlParams.get('ellen-game')

    if (ellenGame && Object.values(GAME_TYPES).includes(ellenGame)) {
      setSelectedGame(ellenGame)
    }
  }, [])

  // Game configurations
  const games = [
    {
      id: 'quick-draw',
      title: '🎨 Quick Draw',
      description: 'Draw and guess in real-time with other players',
      category: 'Creative',
      players: '2-8 players',
      duration: '5-10 min',
      color: 'from-pink-500 to-rose-600'
    },
    {
      id: 'word-association',
      title: '💭 Word Association',
      description: 'Connect words in a chain with lightning speed',
      category: 'Word Games',
      players: '3-12 players',
      duration: '3-7 min',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      id: 'emoji-chains',
      title: '😄 Emoji Chains',
      description: 'Tell stories using only emojis',
      category: 'Creative',
      players: '2-10 players',
      duration: '5-8 min',
      color: 'from-yellow-500 to-orange-600'
    },
    {
      id: 'rapid-fire-qa',
      title: '⚡ Rapid Fire Q&A',
      description: 'Quick questions, quicker answers!',
      category: 'Trivia',
      players: '2-15 players',
      duration: '3-5 min',
      color: 'from-purple-500 to-indigo-600'
    },
    {
      id: 'story-building',
      title: '📚 Story Building',
      description: 'Build hilarious stories together, one word at a time',
      category: 'Collaborative',
      players: '3-8 players',
      duration: '8-12 min',
      color: 'from-green-500 to-emerald-600'
    },
    {
      id: 'voting-poll',
      title: '🗳️ Live Polls',
      description: 'Vote on fun questions and see results instantly',
      category: 'Interactive',
      players: '5-50 players',
      duration: '2-5 min',
      color: 'from-red-500 to-pink-600'
    }
  ]

  // Handle game selection
  const handleGameSelect = (gameId) => {
    setSelectedGame(gameId)
    // Update URL without router
    const url = new URL(window.location)
    url.searchParams.set('ellen-game', gameId) // Use different parameter name
    window.history.pushState({}, '', url)
  }

  // Handle back to menu
  const handleBackToMenu = () => {
    setSelectedGame(null)
    // Clear URL parameters
    const url = new URL(window.location)
    url.searchParams.delete('ellen-game')
    window.history.pushState({}, '', url)
  }

  // Render selected game
  const renderGame = () => {
    if (!selectedGame) return null

    const gameProps = {
      onBack: handleBackToMenu,
      roomCode: currentRoom?.code,
      players,
      isHost,
      sendMessage
    }

    switch (selectedGame) {
      case 'quick-draw':
        return <QuickDrawGame {...gameProps} />
      case 'word-association':
        return <WordAssociationGame {...gameProps} />
      case 'emoji-chains':
        return <EmojiChainsGame {...gameProps} />
      case 'rapid-fire-qa':
        return <RapidFireQAGame {...gameProps} />
      case 'story-building':
        return <StoryBuildingGame {...gameProps} />
      case 'voting-poll':
        return <VotingPollGame {...gameProps} />
      default:
        return null
    }
  }

  // Render selected game
  if (selectedGame) {
    return renderGame()
  }

  // Main menu
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <motion.h1 
            className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            🎪 Ellen Games
          </motion.h1>
          <p className="text-xl text-purple-200 mb-2">
            Interactive multiplayer games for everyone!
          </p>
          <p className="text-purple-300">
            Connect with friends and play together in real-time
          </p>
        </motion.div>

        {/* Connection Status */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
            connectionStatus === 'demo'
              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
              : isConnected
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
          }`}>
            <div className={`w-2 h-2 rounded-full mr-2 ${
              connectionStatus === 'demo'
                ? 'bg-blue-400'
                : isConnected ? 'bg-green-400' : 'bg-yellow-400'
            }`} />
            {connectionStatus === 'demo'
              ? 'Demo Mode - Single Player'
              : isConnected ? 'Connected & Ready' : 'Connecting...'}
          </div>
        </div>

        {/* Games Grid */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          {games.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleGameSelect(game.id)}
              className={`bg-gradient-to-br ${game.color} p-6 rounded-2xl cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 text-white`}
            >
              <h3 className="text-2xl font-bold mb-2">{game.title}</h3>
              <p className="text-white/90 mb-4 text-sm">{game.description}</p>
              
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-white/80">Category:</span>
                  <span className="font-semibold">{game.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/80">Players:</span>
                  <span className="font-semibold">{game.players}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/80">Duration:</span>
                  <span className="font-semibold">{game.duration}</span>
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <span className="inline-block bg-white/20 px-3 py-1 rounded-full text-xs font-semibold">
                  Click to Play
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-md mx-auto">
            <h3 className="text-xl font-bold text-white mb-4">Quick Start</h3>
            <div className="space-y-3">
              <button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200">
                🎮 Create Room
              </button>
              <button className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200">
                🔗 Join Room
              </button>
            </div>
          </div>
        </motion.div>

        {/* Back to Main */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-8"
        >
          <button
            onClick={() => window.location.href = '/'}
            className="text-purple-300 hover:text-white transition-colors duration-200 text-sm"
          >
            ← Back to FinClamp
          </button>
        </motion.div>
      </div>
    </div>
  )
}
