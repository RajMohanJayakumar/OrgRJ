import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RotateCcw, Volume2, VolumeX, Zap, Heart, Target } from 'lucide-react'

/**
 * Stress Squeezer - Interactive stress ball simulator
 * Squeeze virtual stress balls with satisfying feedback
 */
function StressSqueezer() {
  const [squeezeCount, setSqueezeCount] = useState(0)
  const [currentBall, setCurrentBall] = useState('classic')
  const [isSqueezing, setIsSqueezing] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [sessionTime, setSessionTime] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [particles, setParticles] = useState([])
  const [isHolding, setIsHolding] = useState(false)
  const intervalRef = useRef(null)
  const holdIntervalRef = useRef(null)

  const stressBalls = {
    classic: {
      name: 'Classic Ball',
      color: 'from-yellow-400 to-orange-500',
      texture: 'Classic rubber texture',
      sound: 'squeak',
      emoji: '🟡'
    },
    spiky: {
      name: 'Spiky Ball',
      color: 'from-red-400 to-pink-500',
      texture: 'Textured spiky surface',
      sound: 'crunch',
      emoji: '🔴'
    },
    gel: {
      name: 'Gel Ball',
      color: 'from-blue-400 to-cyan-500',
      texture: 'Smooth gel-like feel',
      sound: 'squish',
      emoji: '🔵'
    },
    mesh: {
      name: 'Mesh Ball',
      color: 'from-green-400 to-emerald-500',
      texture: 'Mesh with beads inside',
      sound: 'rattle',
      emoji: '🟢'
    },
    foam: {
      name: 'Memory Foam',
      color: 'from-purple-400 to-violet-500',
      texture: 'Slow-recovery foam',
      sound: 'soft',
      emoji: '🟣'
    }
  }

  // Session timer
  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setSessionTime(prev => prev + 1)
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isActive])

  // Auto-start session on first squeeze
  useEffect(() => {
    if (squeezeCount > 0 && !isActive) {
      setIsActive(true)
    }
  }, [squeezeCount, isActive])

  // Cleanup hold interval on unmount
  useEffect(() => {
    return () => {
      if (holdIntervalRef.current) {
        clearTimeout(holdIntervalRef.current)
        clearInterval(holdIntervalRef.current)
      }
    }
  }, [])

  const createParticles = (x, y) => {
    const newParticles = []
    for (let i = 0; i < 8; i++) {
      newParticles.push({
        id: Date.now() + i,
        x: x + (Math.random() - 0.5) * 100,
        y: y + (Math.random() - 0.5) * 100,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        life: 1
      })
    }
    setParticles(prev => [...prev, ...newParticles])

    // Remove particles after animation
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.includes(p)))
    }, 1000)
  }

  const playSqueezeSound = () => {
    if (!soundEnabled) return

    try {
      // Check if AudioContext is supported
      if (!window.AudioContext && !window.webkitAudioContext) {
        return
      }

      const audioContext = new (window.AudioContext || window.webkitAudioContext)()

      // Resume audio context if it's suspended (required for mobile)
      if (audioContext.state === 'suspended') {
        audioContext.resume().catch(() => {
          // Silently fail if resume doesn't work
          return
        })
      }

      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      const ball = stressBalls[currentBall]
      switch (ball.sound) {
        case 'squeak':
          oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
          oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1)
          break
        case 'crunch':
          oscillator.frequency.setValueAtTime(200, audioContext.currentTime)
          oscillator.type = 'sawtooth'
          break
        case 'squish':
          oscillator.frequency.setValueAtTime(150, audioContext.currentTime)
          oscillator.type = 'sine'
          break
        case 'rattle':
          oscillator.frequency.setValueAtTime(600, audioContext.currentTime)
          oscillator.type = 'square'
          break
        case 'soft':
          oscillator.frequency.setValueAtTime(100, audioContext.currentTime)
          oscillator.type = 'triangle'
          break
      }

      gainNode.gain.setValueAtTime(0.05, audioContext.currentTime) // Reduced volume
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.2)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.2)

      // Clean up after sound finishes
      setTimeout(() => {
        try {
          if (audioContext.state !== 'closed') {
            audioContext.close()
          }
        } catch (e) {
          // Ignore cleanup errors
        }
      }, 300)

    } catch (error) {
      // Silently handle audio errors
      if (process.env.NODE_ENV === 'development') {
        console.log('Audio not supported:', error)
      }
    }
  }

  const performSqueeze = (e) => {
    setIsSqueezing(true)
    setSqueezeCount(prev => prev + 1)
    playSqueezeSound()

    // Create particles at click/touch position
    const rect = e?.currentTarget?.getBoundingClientRect()
    if (rect) {
      const clientX = e?.clientX || e?.touches?.[0]?.clientX || rect.width / 2
      const clientY = e?.clientY || e?.touches?.[0]?.clientY || rect.height / 2
      const x = clientX - rect.left
      const y = clientY - rect.top
      createParticles(x, y)
    }

    // Reset squeeze animation
    setTimeout(() => setIsSqueezing(false), 150)

    if (!isActive) {
      setIsActive(true)
    }
  }

  const handleMouseDown = (e) => {
    e.preventDefault()
    setIsHolding(true)
    performSqueeze(e)

    // Start continuous squeezing after 300ms
    holdIntervalRef.current = setTimeout(() => {
      holdIntervalRef.current = setInterval(() => {
        performSqueeze(e)
      }, 200) // Squeeze every 200ms while holding
    }, 300)
  }

  const handleMouseUp = () => {
    setIsHolding(false)
    if (holdIntervalRef.current) {
      clearTimeout(holdIntervalRef.current)
      clearInterval(holdIntervalRef.current)
      holdIntervalRef.current = null
    }
  }

  const handleTouchStart = (e) => {
    e.preventDefault()
    setIsHolding(true)
    performSqueeze(e)

    // Start continuous squeezing after 300ms
    holdIntervalRef.current = setTimeout(() => {
      holdIntervalRef.current = setInterval(() => {
        performSqueeze(e)
      }, 200) // Squeeze every 200ms while holding
    }, 300)
  }

  const handleTouchEnd = () => {
    setIsHolding(false)
    if (holdIntervalRef.current) {
      clearTimeout(holdIntervalRef.current)
      clearInterval(holdIntervalRef.current)
      holdIntervalRef.current = null
    }
  }

  const resetSession = () => {
    setSqueezeCount(0)
    setSessionTime(0)
    setIsActive(false)
    setParticles([])
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getStressLevel = () => {
    if (squeezeCount < 10) return { level: 'High', color: 'text-red-500', icon: <Zap className="w-4 h-4" /> }
    if (squeezeCount < 25) return { level: 'Medium', color: 'text-yellow-500', icon: <Target className="w-4 h-4" /> }
    return { level: 'Low', color: 'text-green-500', icon: <Heart className="w-4 h-4" /> }
  }

  const currentBallData = stressBalls[currentBall]
  const stressLevel = getStressLevel()

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-3 md:p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">
            🤏 Stress Squeezer
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Squeeze away your stress with satisfying virtual stress balls
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <div className="text-2xl font-bold text-blue-600">{squeezeCount}</div>
            <div className="text-sm text-gray-600">Squeezes</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <div className="text-2xl font-bold text-purple-600">{formatTime(sessionTime)}</div>
            <div className="text-sm text-gray-600">Session Time</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <div className={`text-2xl font-bold ${stressLevel.color} flex items-center justify-center gap-1`}>
              {stressLevel.icon}
              {stressLevel.level}
            </div>
            <div className="text-sm text-gray-600">Stress Level</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <div className="text-2xl">{currentBallData.emoji}</div>
            <div className="text-sm text-gray-600">{currentBallData.name}</div>
          </div>
        </div>

        {/* Main Stress Ball */}
        <div className="relative bg-white rounded-xl p-8 shadow-lg mb-6 overflow-hidden">
          {/* Particles */}
          <AnimatePresence>
            {particles.map(particle => (
              <motion.div
                key={particle.id}
                className="absolute w-2 h-2 bg-yellow-400 rounded-full pointer-events-none"
                initial={{ 
                  x: particle.x, 
                  y: particle.y, 
                  scale: 1, 
                  opacity: 1 
                }}
                animate={{ 
                  x: particle.x + particle.vx * 20,
                  y: particle.y + particle.vy * 20,
                  scale: 0,
                  opacity: 0
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            ))}
          </AnimatePresence>

          <div className="text-center">
            <motion.div
              className={`w-48 h-48 md:w-64 md:h-64 mx-auto rounded-full bg-gradient-to-br ${currentBallData.color} shadow-2xl cursor-pointer select-none relative overflow-hidden`}
              animate={{
                scale: isSqueezing ? 0.85 : 1,
                rotate: isSqueezing ? 2 : 0
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20
              }}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              style={{
                touchAction: 'manipulation',
                WebkitTouchCallout: 'none',
                WebkitUserSelect: 'none',
                userSelect: 'none'
              }}
            >
              {/* Texture overlay */}
              <div className="absolute inset-0 opacity-20">
                {currentBall === 'spiky' && (
                  <div className="absolute inset-0 bg-gradient-radial from-transparent via-white to-transparent"></div>
                )}
                {currentBall === 'mesh' && (
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle at 20% 20%, white 2px, transparent 2px)',
                    backgroundSize: '20px 20px'
                  }}></div>
                )}
              </div>

              {/* Highlight */}
              <div className="absolute top-8 left-8 w-16 h-16 bg-white bg-opacity-30 rounded-full blur-xl"></div>
              
              {/* Center text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white text-4xl md:text-6xl font-bold opacity-80">
                  {currentBallData.emoji}
                </span>
              </div>
            </motion.div>

            <p className="mt-4 text-gray-600 text-sm md:text-base">
              {currentBallData.texture}
            </p>
            <p className="mt-2 text-gray-500 text-sm">
              Click or tap to squeeze • Hold for continuous squeezing
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
          <div className="flex flex-wrap justify-center items-center gap-4 mb-6">
            <button
              onClick={resetSession}
              className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset Session
            </button>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                soundEnabled 
                  ? 'bg-green-600 text-white hover:bg-green-700' 
                  : 'bg-gray-300 text-gray-600 hover:bg-gray-400'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              Sound
            </button>
          </div>

          {/* Ball Selection */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {Object.entries(stressBalls).map(([key, ball]) => (
              <motion.button
                key={key}
                onClick={() => setCurrentBall(key)}
                className={`p-4 rounded-xl transition-all ${
                  currentBall === key
                    ? 'bg-indigo-100 ring-2 ring-indigo-500'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">{ball.emoji}</div>
                  <div className="text-sm font-medium text-gray-700">{ball.name}</div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">💡 Stress Relief Tips</h3>
          <p className="text-gray-600 text-sm md:text-base">
            Squeeze rhythmically while taking deep breaths. Focus on the sensation and let your worries melt away.
            Try different balls to find your favorite texture and sound combination.
          </p>
        </div>
      </div>
    </div>
  )
}

export default StressSqueezer
