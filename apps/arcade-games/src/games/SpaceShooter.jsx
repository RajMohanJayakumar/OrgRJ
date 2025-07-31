import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useGameState from '../hooks/useGameState'
import useArcadeSound from '../hooks/useArcadeSound'
import useHighScore from '../hooks/useHighScore'
import useMobileControls from '../hooks/useMobileControls'
import { GAME_CONFIGS } from '../config/arcadeConfig'

/**
 * Space Shooter Game - Mobile-Enhanced Implementation
 * Defend Earth from waves of alien invaders with mobile controls
 */
export default function SpaceShooter() {
  const gameConfig = GAME_CONFIGS.SPACE_SHOOTER

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
  } = useHighScore('space-shooter')

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
  const [player, setPlayer] = useState({ x: 400, y: 500 })
  const [bullets, setBullets] = useState([])
  const [enemies, setEnemies] = useState([])
  const [lives, setLives] = useState(gameConfig.INITIAL_LIVES)
  const [wave, setWave] = useState(1)
  const gameLoopRef = useRef()

  // Mobile-responsive dimensions
  const canvasWidth = isMobile ? Math.min(350, window.innerWidth - 20) : gameConfig.CANVAS_WIDTH
  const canvasHeight = isMobile ? Math.min(400, window.innerHeight * 0.6) : gameConfig.CANVAS_HEIGHT

  // Handle player movement
  const movePlayer = useCallback((direction) => {
    setPlayer(prev => {
      let newX = prev.x
      const speed = gameConfig.PLAYER_SPEED

      if (direction === 'left' && newX > 0) {
        newX -= speed
      } else if (direction === 'right' && newX < canvasWidth - gameConfig.PLAYER_SIZE) {
        newX += speed
      }

      return { ...prev, x: Math.max(0, Math.min(canvasWidth - gameConfig.PLAYER_SIZE, newX)) }
    })
  }, [canvasWidth, gameConfig.PLAYER_SIZE, gameConfig.PLAYER_SPEED])

  // Shoot bullet
  const shoot = useCallback(() => {
    setBullets(prev => [...prev, {
      id: Date.now(),
      x: player.x + gameConfig.PLAYER_SIZE / 2,
      y: player.y,
      speed: gameConfig.BULLET_SPEED
    }])
    playSound(SOUNDS.SHOOT)
  }, [player, gameConfig, playSound, SOUNDS])

  // Handle keyboard input
  const handleGameKeyPress = useCallback((e) => {
    const keyHandlers = {
      'ArrowLeft': () => movePlayer('left'),
      'ArrowRight': () => movePlayer('right'),
      ' ': () => shoot(),
      'a': () => movePlayer('left'),
      'A': () => movePlayer('left'),
      'd': () => movePlayer('right'),
      'D': () => movePlayer('right')
    }

    handleKeyPress(e, keyHandlers)
  }, [movePlayer, shoot, handleKeyPress])

  // Handle mobile controls
  useEffect(() => {
    if (touchControls.left) movePlayer('left')
    else if (touchControls.right) movePlayer('right')
  }, [touchControls, movePlayer])

  // Game loop
  const gameLoop = useCallback(() => {
    // Move bullets
    setBullets(prev => prev
      .map(bullet => ({ ...bullet, y: bullet.y - bullet.speed }))
      .filter(bullet => bullet.y > 0)
    )

    // Move enemies
    setEnemies(prev => prev
      .map(enemy => ({ ...enemy, y: enemy.y + enemy.speed }))
      .filter(enemy => {
        // Check if enemy hits player
        if (enemy.y + gameConfig.ENEMY_SIZE > player.y &&
            enemy.x < player.x + gameConfig.PLAYER_SIZE &&
            enemy.x + gameConfig.ENEMY_SIZE > player.x) {
          setLives(prevLives => {
            const newLives = prevLives - 1
            if (newLives <= 0) {
              endGame(false)
              saveHighScore(currentScore)
            }
            return newLives
          })
          playSound(SOUNDS.EXPLOSION)
          return false
        }
        return enemy.y < canvasHeight
      })
    )

    // Check bullet-enemy collisions
    setBullets(prevBullets => {
      const remainingBullets = []
      const hitEnemies = new Set()

      prevBullets.forEach(bullet => {
        let hit = false
        setEnemies(prevEnemies => {
          return prevEnemies.filter(enemy => {
            if (!hit && !hitEnemies.has(enemy.id) &&
                bullet.x > enemy.x && bullet.x < enemy.x + gameConfig.ENEMY_SIZE &&
                bullet.y > enemy.y && bullet.y < enemy.y + gameConfig.ENEMY_SIZE) {
              hit = true
              hitEnemies.add(enemy.id)
              updateScore(currentScore + gameConfig.SCORE_PER_ENEMY)
              playSound(SOUNDS.HIT)
              return false
            }
            return true
          })
        })

        if (!hit) {
          remainingBullets.push(bullet)
        }
      })

      return remainingBullets
    })

    // Spawn enemies
    if (Math.random() < 0.02 + wave * 0.005) {
      setEnemies(prev => [...prev, {
        id: Date.now() + Math.random(),
        x: Math.random() * (canvasWidth - gameConfig.ENEMY_SIZE),
        y: 0,
        speed: gameConfig.ENEMY_SPEED + wave * 0.5
      }])
    }
  }, [player, wave, canvasWidth, canvasHeight, gameConfig, endGame, saveHighScore, currentScore, updateScore, playSound, SOUNDS])

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
    setPlayer({ x: canvasWidth / 2 - gameConfig.PLAYER_SIZE / 2, y: canvasHeight - 60 })
    setBullets([])
    setEnemies([])
    setLives(gameConfig.INITIAL_LIVES)
    setWave(1)
    resetScore()
  }

  // Menu Screen
  if (isInMenu) {
    return (
      <MobileGameLayout className="bg-gradient-to-br from-purple-900 via-indigo-900 to-black">
        <div className="flex items-center justify-center min-h-screen">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center text-white max-w-md mx-auto px-4"
          >
            <motion.h1
              className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🚀 Space Shooter
            </motion.h1>

            <p className="text-purple-200 mb-6">
              Defend Earth from alien invaders! Use your ship to shoot down enemies and survive the waves.
            </p>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6">
              <div className="text-sm text-purple-200 mb-2">High Score</div>
              <div className="text-2xl font-bold text-yellow-400">{highScore}</div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startGame}
              className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-8 py-3 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 mb-4"
            >
              Start Mission
            </motion.button>

            <div className="flex items-center justify-center gap-2">
              <button
                onClick={toggleSound}
                className={`p-2 rounded-lg transition-colors ${
                  soundEnabled ? 'bg-purple-600 text-white' : 'bg-gray-600 text-gray-300'
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
      <MobileGameLayout className="bg-gradient-to-br from-purple-900 via-indigo-900 to-black">
        <div className={`mx-auto ${isMobile ? 'max-w-full px-2' : 'max-w-4xl'}`}>
          {/* Game HUD */}
          <div className={`bg-white/10 backdrop-blur-sm rounded-xl p-3 mb-3 text-white ${isMobile ? 'mx-2' : ''}`}>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className={`text-purple-200 ${isMobile ? 'text-xs' : 'text-sm'}`}>Score</div>
                <div className={`font-bold text-yellow-400 ${isMobile ? 'text-lg' : 'text-xl'}`}>{currentScore}</div>
              </div>
              <div>
                <div className={`text-purple-200 ${isMobile ? 'text-xs' : 'text-sm'}`}>Lives</div>
                <div className={`font-bold text-red-400 ${isMobile ? 'text-lg' : 'text-xl'}`}>{'❤️'.repeat(Math.max(0, lives))}</div>
              </div>
              <div>
                <div className={`text-purple-200 ${isMobile ? 'text-xs' : 'text-sm'}`}>Wave</div>
                <div className={`font-bold text-cyan-400 ${isMobile ? 'text-lg' : 'text-xl'}`}>{wave}</div>
              </div>
              <div>
                <div className={`text-purple-200 ${isMobile ? 'text-xs' : 'text-sm'}`}>Enemies</div>
                <div className={`font-bold text-green-400 ${isMobile ? 'text-lg' : 'text-xl'}`}>{enemies.length}</div>
              </div>
            </div>
          </div>

          {/* Game Area */}
          <MobileGameArea className="flex justify-center">
            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-2 border-2 border-purple-500/30">
              <div
                className="relative bg-black border-2 border-purple-400 overflow-hidden"
                style={{
                  width: canvasWidth,
                  height: canvasHeight
                }}
              >
                {/* Stars background */}
                <div className="absolute inset-0">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 2}s`
                      }}
                    />
                  ))}
                </div>

                {/* Player Ship */}
                <div
                  className="absolute bg-cyan-400 rounded-t-full"
                  style={{
                    left: player.x,
                    top: player.y,
                    width: gameConfig.PLAYER_SIZE,
                    height: gameConfig.PLAYER_SIZE,
                    clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
                  }}
                />

                {/* Bullets */}
                {bullets.map(bullet => (
                  <div
                    key={bullet.id}
                    className="absolute bg-yellow-400 rounded-full"
                    style={{
                      left: bullet.x,
                      top: bullet.y,
                      width: gameConfig.BULLET_SIZE,
                      height: gameConfig.BULLET_SIZE
                    }}
                  />
                ))}

                {/* Enemies */}
                {enemies.map(enemy => (
                  <motion.div
                    key={enemy.id}
                    className="absolute bg-red-500 rounded"
                    style={{
                      left: enemy.x,
                      top: enemy.y,
                      width: gameConfig.ENEMY_SIZE,
                      height: gameConfig.ENEMY_SIZE,
                      clipPath: 'polygon(50% 100%, 0% 0%, 100% 0%)'
                    }}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  />
                ))}
              </div>
            </div>
          </MobileGameArea>

          {/* Controls */}
          <div className={`text-center text-purple-200 mt-3 ${isMobile ? 'text-xs px-2' : 'text-sm'}`}>
            {isMobile ? 'Use controls to move and shoot' : 'Use arrow keys or A/D to move | Space to shoot'}
          </div>
        </div>

        {/* Mobile Controls */}
        {isMobile && (
          <>
            <VirtualDPad
              onDirectionPress={movePlayer}
              size="large"
            />
            <ActionButtons
              buttons={[
                { key: 'shoot', label: '🔫', onPress: shoot }
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
    <MobileGameLayout className="bg-gradient-to-br from-purple-900 via-indigo-900 to-black">
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center text-white max-w-md mx-auto px-4"
        >
          <motion.h1
            className={`font-bold mb-4 text-red-400 ${isMobile ? 'text-3xl' : 'text-4xl'}`}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            Mission Failed! 💥
          </motion.h1>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-sm text-purple-200 mb-1">Final Score</div>
                <div className="text-2xl font-bold text-yellow-400">{currentScore}</div>
              </div>
              <div>
                <div className="text-sm text-purple-200 mb-1">Wave Reached</div>
                <div className="text-2xl font-bold text-cyan-400">{wave}</div>
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
            <div className="text-xl font-bold text-purple-400">{highScore}</div>
          </div>

          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startGame}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Retry Mission
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
