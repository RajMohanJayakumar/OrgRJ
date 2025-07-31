import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Palette, Heart, Zap, Leaf, Sun, Moon, Star } from 'lucide-react'

/**
 * Color Therapy - Immersive color experience for mood enhancement
 * Uses color psychology to help users relax and improve their mood
 */
export default function ColorTherapy() {
  const [currentColor, setCurrentColor] = useState('blue')
  const [isPlaying, setIsPlaying] = useState(false)
  const [sessionTime, setSessionTime] = useState(0)
  const [autoMode, setAutoMode] = useState(false)

  const colorTherapies = {
    blue: {
      name: 'Calm Blue',
      color: 'from-blue-400 via-blue-500 to-blue-600',
      icon: <Moon className="w-8 h-8" />,
      benefits: ['Reduces stress', 'Promotes calm', 'Lowers blood pressure'],
      description: 'Blue is known for its calming and peaceful properties. It helps reduce anxiety and promotes tranquility.',
      affirmation: 'I am calm, peaceful, and in control of my emotions.'
    },
    green: {
      name: 'Healing Green',
      color: 'from-green-400 via-green-500 to-green-600',
      icon: <Leaf className="w-8 h-8" />,
      benefits: ['Promotes healing', 'Balances emotions', 'Refreshes mind'],
      description: 'Green represents nature, growth, and harmony. It helps balance emotions and promotes healing.',
      affirmation: 'I am growing, healing, and finding balance in my life.'
    },
    purple: {
      name: 'Spiritual Purple',
      color: 'from-purple-400 via-purple-500 to-purple-600',
      icon: <Star className="w-8 h-8" />,
      benefits: ['Enhances creativity', 'Spiritual connection', 'Reduces tension'],
      description: 'Purple stimulates creativity and spiritual awareness while helping to reduce mental tension.',
      affirmation: 'I am creative, intuitive, and connected to my higher self.'
    },
    orange: {
      name: 'Energizing Orange',
      color: 'from-orange-400 via-orange-500 to-orange-600',
      icon: <Zap className="w-8 h-8" />,
      benefits: ['Boosts energy', 'Increases confidence', 'Stimulates appetite'],
      description: 'Orange is energizing and uplifting. It helps boost confidence and motivation.',
      affirmation: 'I am energetic, confident, and ready to embrace new opportunities.'
    },
    yellow: {
      name: 'Joyful Yellow',
      color: 'from-yellow-400 via-yellow-500 to-yellow-600',
      icon: <Sun className="w-8 h-8" />,
      benefits: ['Improves mood', 'Enhances focus', 'Stimulates happiness'],
      description: 'Yellow is associated with happiness, optimism, and mental clarity.',
      affirmation: 'I am joyful, optimistic, and my mind is clear and focused.'
    },
    pink: {
      name: 'Loving Pink',
      color: 'from-pink-400 via-pink-500 to-pink-600',
      icon: <Heart className="w-8 h-8" />,
      benefits: ['Promotes love', 'Reduces aggression', 'Calms nerves'],
      description: 'Pink represents love, compassion, and nurturing. It helps calm aggressive feelings.',
      affirmation: 'I am loved, loving, and surrounded by compassion and kindness.'
    }
  }

  // Session timer
  useEffect(() => {
    let interval = null
    if (isPlaying) {
      interval = setInterval(() => {
        setSessionTime(prev => prev + 1)
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isPlaying])

  // Auto mode - cycle through colors
  useEffect(() => {
    let interval = null
    if (autoMode && isPlaying) {
      interval = setInterval(() => {
        const colors = Object.keys(colorTherapies)
        const currentIndex = colors.indexOf(currentColor)
        const nextIndex = (currentIndex + 1) % colors.length
        setCurrentColor(colors[nextIndex])
      }, 30000) // Change color every 30 seconds
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [autoMode, isPlaying, currentColor])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const startSession = () => {
    setIsPlaying(true)
    setSessionTime(0)
  }

  const stopSession = () => {
    setIsPlaying(false)
  }

  const resetSession = () => {
    setIsPlaying(false)
    setSessionTime(0)
  }

  const currentTherapy = colorTherapies[currentColor]

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentTherapy.color} transition-all duration-1000 ease-in-out relative overflow-hidden`}>
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 bg-white bg-opacity-10 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.1, 0.3, 0.1],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 p-3 md:p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4"
            >
              <div className="flex justify-center mb-4">
                {currentTherapy.icon}
              </div>
              <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">
                🎨 Color Therapy
              </h1>
              <p className="text-white/80 text-sm md:text-base">
                Immerse yourself in healing colors to enhance your mood and well-being
              </p>
            </motion.div>
          </div>

          {/* Current Color Info */}
          <motion.div
            key={currentColor}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6 text-center"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {currentTherapy.name}
            </h2>
            <p className="text-white/90 mb-4 text-sm md:text-base">
              {currentTherapy.description}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {currentTherapy.benefits.map((benefit, index) => (
                <div key={index} className="bg-white/20 rounded-lg p-3">
                  <span className="text-white text-sm font-medium">{benefit}</span>
                </div>
              ))}
            </div>

            {isPlaying && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white/20 rounded-lg p-4 mt-4"
              >
                <p className="text-white italic text-sm md:text-base">
                  "{currentTherapy.affirmation}"
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* Controls */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
            <div className="flex flex-wrap justify-center items-center gap-4 mb-6">
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg">
                <span className="text-white text-sm font-medium">Session Time:</span>
                <span className="text-white text-lg font-bold">{formatTime(sessionTime)}</span>
              </div>

              {!isPlaying ? (
                <button
                  onClick={startSession}
                  className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                >
                  Start Session
                </button>
              ) : (
                <button
                  onClick={stopSession}
                  className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                >
                  Pause Session
                </button>
              )}

              <button
                onClick={resetSession}
                className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg transition-colors font-medium"
              >
                Reset
              </button>

              <label className="flex items-center gap-2 text-white">
                <input
                  type="checkbox"
                  checked={autoMode}
                  onChange={(e) => setAutoMode(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Auto Mode</span>
              </label>
            </div>

            {/* Color Selection */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {Object.entries(colorTherapies).map(([key, therapy]) => (
                <motion.button
                  key={key}
                  onClick={() => setCurrentColor(key)}
                  className={`p-3 md:p-4 rounded-xl transition-all ${
                    currentColor === key
                      ? 'bg-white/30 ring-2 ring-white'
                      : 'bg-white/10 hover:bg-white/20 active:bg-white/25'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ touchAction: 'manipulation' }}
                >
                  <div className="flex flex-col items-center gap-1 md:gap-2">
                    <div className="text-lg md:text-xl">
                      {therapy.icon}
                    </div>
                    <span className="text-white text-xs md:text-sm font-medium">
                      {therapy.name.split(' ')[1]}
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div className="text-center">
            <p className="text-white/80 text-sm md:text-base">
              {isPlaying
                ? 'Focus on the color around you. Breathe deeply and let the color energy flow through you.'
                : 'Choose a color that resonates with your current mood or desired feeling, then start your session.'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
