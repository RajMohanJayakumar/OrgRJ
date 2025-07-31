import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ARCADE_CONFIG } from '../config/arcadeConfig'
import { trackArcadeAccess } from '../utils/routeDetection'
import useHighScore from '../hooks/useHighScore'

// Import games (using lazy loading for better performance)
import SnakeGame from '../games/SnakeGame'

// Lazy load classic games
const TetrisGame = React.lazy(() => import('../games/TetrisGame'))
const PongGame = React.lazy(() => import('../games/PongGame'))
const SpaceShooter = React.lazy(() => import('../games/SpaceShooter'))

// Lazy load stress-busting games
const BubblePopGame = React.lazy(() => import('../games/BubblePopGame'))
const ZenGardenGame = React.lazy(() => import('../games/ZenGardenGame'))
const ColorMatchGame = React.lazy(() => import('../games/ColorMatchGame'))
const RhythmTapGame = React.lazy(() => import('../games/RhythmTapGame'))

/**
 * Game Card Component
 */
const GameCard = ({ game, index, onSelect, allHighScores }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.8 + index * 0.1 }}
    whileHover={{
      scale: ARCADE_CONFIG.THEME.ANIMATIONS.HOVER_SCALE,
      y: -5
    }}
    whileTap={{ scale: ARCADE_CONFIG.THEME.ANIMATIONS.TAP_SCALE }}
    onClick={() => onSelect(game)}
    className="group cursor-pointer"
  >
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20">
      {/* Game Icon */}
      <div className="text-center mb-4">
        <motion.div
          className="text-6xl mb-3"
          animate={{
            rotate: [0, 5, -5, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: index * 0.5
          }}
        >
          {game.icon}
        </motion.div>

        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">
          {game.name}
        </h3>

        <p className="text-purple-200 text-sm leading-relaxed">
          {game.description}
        </p>

        {/* Category Badge */}
        {game.category === 'stress-relief' && (
          <div className="inline-block bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs font-semibold mt-2">
            Stress Relief
          </div>
        )}
      </div>

      {/* High Score Display */}
      <div className="text-center mb-4">
        <div className="text-xs text-purple-300">High Score</div>
        <div className="text-lg font-bold text-yellow-400">
          {allHighScores[game.id] || 0}
        </div>
      </div>

      {/* Play Button */}
      <motion.div
        className={`bg-gradient-to-r ${game.color} text-white px-6 py-3 rounded-xl font-semibold text-center shadow-lg group-hover:shadow-xl transition-all duration-300`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Play Now
      </motion.div>

      {/* Decorative elements */}
      <div className="absolute top-2 right-2 opacity-20 group-hover:opacity-40 transition-opacity">
        <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-pink-500 rounded-full animate-pulse" />
      </div>
    </div>
  </motion.div>
)

/**
 * Arcade Games Module - Main Component
 * Self-contained arcade games system that can be easily decoupled
 */
export default function ArcadeGamesModule() {
  const [selectedGame, setSelectedGame] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  
  // Track arcade access for analytics
  useEffect(() => {
    trackArcadeAccess()
  }, [])

  // Game configuration with components
  const classicGames = [
    {
      ...ARCADE_CONFIG.GAMES.SNAKE,
      component: SnakeGame
    },
    {
      ...ARCADE_CONFIG.GAMES.TETRIS,
      component: TetrisGame
    },
    {
      ...ARCADE_CONFIG.GAMES.PONG,
      component: PongGame
    },
    {
      ...ARCADE_CONFIG.GAMES.SPACE_SHOOTER,
      component: SpaceShooter
    }
  ]

  const stressBustingGames = [
    {
      ...ARCADE_CONFIG.GAMES.BUBBLE_POP,
      component: BubblePopGame
    },
    {
      ...ARCADE_CONFIG.GAMES.ZEN_GARDEN,
      component: ZenGardenGame
    },
    {
      ...ARCADE_CONFIG.GAMES.COLOR_MATCH,
      component: ColorMatchGame
    },
    {
      ...ARCADE_CONFIG.GAMES.RHYTHM_TAP,
      component: RhythmTapGame
    }
  ]

  const allGames = [...classicGames, ...stressBustingGames]

  // Get all high scores for display
  const { getAllHighScores } = useHighScore('arcade')
  const allHighScores = getAllHighScores()

  // Handle game selection with lazy loading
  const handleGameSelect = async (game) => {
    setIsLoading(true)
    
    try {
      // Small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 300))
      setSelectedGame(game)
    } catch (error) {
      console.error('Failed to load game:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle back to menu
  const handleBackToMenu = () => {
    setSelectedGame(null)
    setIsLoading(false)
  }

  // If a game is selected, render that game component
  if (selectedGame) {
    const GameComponent = selectedGame.component
    
    return (
      <div className="relative">
        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={handleBackToMenu}
          className="fixed top-4 left-4 z-50 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-black/70 transition-colors flex items-center gap-2"
        >
          ← Back to Arcade
        </motion.button>
        
        <React.Suspense 
          fallback={
            <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
              <div className="text-white text-center">
                <div className="text-4xl mb-4">🎮</div>
                <div className="text-xl">Loading {selectedGame.name}...</div>
              </div>
            </div>
          }
        >
          <GameComponent />
        </React.Suspense>
      </div>
    )
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-white text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="text-6xl mb-4"
          >
            🎮
          </motion.div>
          <div className="text-xl">Loading Arcade...</div>
        </motion.div>
      </div>
    )
  }

  // Main arcade menu
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
      {/* Floating particles background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: ARCADE_CONFIG.THEME.ANIMATIONS.PARTICLE_COUNT }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            animate={{
              x: [0, Math.random() * window.innerWidth],
              y: [0, Math.random() * window.innerHeight],
              scale: [0, 1, 0],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
            style={{
              left: Math.random() * window.innerWidth,
              top: Math.random() * window.innerHeight
            }}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.h1 
            className="text-6xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent"
            animate={{ 
              scale: [1, 1.05, 1],
              textShadow: [
                '0 0 20px rgba(255,255,255,0.5)',
                '0 0 30px rgba(255,255,255,0.8)',
                '0 0 20px rgba(255,255,255,0.5)'
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            🕹️ ARCADE ZONE
          </motion.h1>
          
          <motion.p 
            className="text-xl text-purple-200 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Classic games reimagined for the modern web
          </motion.p>
          
          <motion.div
            className="text-sm text-purple-300 bg-black/20 backdrop-blur-sm rounded-lg px-4 py-2 inline-block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            🎮 Hidden Route Activated • Private Access Only
          </motion.div>
        </motion.div>

        {/* Classic Games Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-4 text-center">🕹️ Classic Arcade</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {classicGames.map((game, index) => (
              <GameCard key={game.id} game={game} index={index} onSelect={handleGameSelect} allHighScores={allHighScores} />
            ))}
          </div>
        </motion.div>

        {/* Stress-Busting Games Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-4 text-center">🧘‍♀️ Stress Relief Zone</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {stressBustingGames.map((game, index) => (
              <GameCard key={game.id} game={game} index={index + classicGames.length} onSelect={handleGameSelect} allHighScores={allHighScores} />
            ))}
          </div>
        </motion.div>


        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="bg-black/20 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
        >
          <h3 className="text-xl font-bold text-white mb-4 text-center">🏆 Your High Scores</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {allGames.map(game => (
              <div key={game.id} className="text-center">
                <div className="text-2xl mb-1">{game.icon}</div>
                <div className="text-sm text-purple-200">{game.name}</div>
                <div className="text-lg font-bold text-yellow-400">
                  {allHighScores[game.id] || 0}
                </div>
                {game.category === 'stress-relief' && (
                  <div className="text-xs text-green-400">Zen</div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Module Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="text-center mt-8 text-purple-300 text-sm"
        >
          <p>Built with React & Framer Motion • Retro Gaming Experience</p>
          <p className="mt-2 text-xs opacity-60">
            Use keyboard controls for the best gaming experience
          </p>
          <p className="mt-1 text-xs opacity-40">
            Arcade Module v{ARCADE_CONFIG.MODULE_VERSION} • Decoupled & Removable
          </p>
        </motion.div>
      </div>

      {/* Retro scanlines effect */}
      <div className="fixed inset-0 pointer-events-none opacity-10">
        <div 
          className="w-full h-full"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)'
          }}
        />
      </div>
    </div>
  )
}
