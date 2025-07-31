import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calculator, TrendingUp, PiggyBank, CreditCard, Fuel, Home, Briefcase, Zap } from 'lucide-react'

/**
 * Interesting PWA Loader Component
 * Features animated financial icons, progress bar, and loading messages
 */
const PWALoader = ({ isVisible, onComplete }) => {
  const [progress, setProgress] = useState(0)
  const [currentMessage, setCurrentMessage] = useState(0)
  const [currentIcon, setCurrentIcon] = useState(0)

  const loadingMessages = [
    'Initializing FinClamp...',
    'Loading financial calculators...',
    'Preparing your workspace...',
    'Setting up PWA features...',
    'Almost ready...',
    'Welcome to FinClamp!'
  ]

  const financialIcons = [
    { Icon: Calculator, color: 'text-blue-500', bg: 'bg-blue-100' },
    { Icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-100' },
    { Icon: PiggyBank, color: 'text-pink-500', bg: 'bg-pink-100' },
    { Icon: CreditCard, color: 'text-purple-500', bg: 'bg-purple-100' },
    { Icon: Fuel, color: 'text-orange-500', bg: 'bg-orange-100' },
    { Icon: Home, color: 'text-indigo-500', bg: 'bg-indigo-100' },
    { Icon: Briefcase, color: 'text-gray-500', bg: 'bg-gray-100' },
    { Icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-100' }
  ]

  useEffect(() => {
    if (!isVisible) return

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 15 + 5
        if (newProgress >= 100) {
          clearInterval(progressInterval)
          setTimeout(() => onComplete?.(), 500)
          return 100
        }
        return newProgress
      })
    }, 300)

    const messageInterval = setInterval(() => {
      setCurrentMessage(prev => (prev + 1) % loadingMessages.length)
    }, 800)

    const iconInterval = setInterval(() => {
      setCurrentIcon(prev => (prev + 1) % financialIcons.length)
    }, 600)

    return () => {
      clearInterval(progressInterval)
      clearInterval(messageInterval)
      clearInterval(iconInterval)
    }
  }, [isVisible, onComplete])

  if (!isVisible) return null

  const currentIconData = financialIcons[currentIcon]

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23667eea' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative z-10 text-center max-w-md mx-auto px-6">
          {/* Logo Area */}
          <motion.div
            className="mb-8"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          >
            {/* Animated Logo */}
            <div className="relative mx-auto w-24 h-24 mb-4">
              {/* Outer Ring */}
              <motion.div
                className="absolute inset-0 border-4 border-blue-200 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
              
              {/* Inner Ring */}
              <motion.div
                className="absolute inset-2 border-4 border-cyan-300 rounded-full"
                animate={{ rotate: -360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
              
              {/* Center Icon */}
              <motion.div
                className={`absolute inset-4 ${currentIconData.bg} rounded-full flex items-center justify-center`}
                key={currentIcon}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <currentIconData.Icon className={`w-8 h-8 ${currentIconData.color}`} />
              </motion.div>
            </div>

            {/* FinClamp Text */}
            <motion.h1
              className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              FinClamp
            </motion.h1>
            <motion.p
              className="text-gray-600 text-sm mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              Financial Intelligence Platform
            </motion.p>
          </motion.div>

          {/* Loading Message */}
          <motion.div
            className="mb-8"
            key={currentMessage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            <p className="text-gray-700 font-medium text-lg">
              {loadingMessages[currentMessage]}
            </p>
          </motion.div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full relative"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {/* Shimmer Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.div>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-gray-500">Loading...</span>
              <span className="text-sm font-semibold text-blue-600">
                {Math.round(progress)}%
              </span>
            </div>
          </div>

          {/* Feature Icons */}
          <motion.div
            className="grid grid-cols-4 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            {financialIcons.slice(0, 4).map((iconData, index) => (
              <motion.div
                key={index}
                className={`p-3 ${iconData.bg} rounded-lg`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1.2 + index * 0.1, duration: 0.4 }}
                whileHover={{ scale: 1.05 }}
              >
                <iconData.Icon className={`w-6 h-6 ${iconData.color} mx-auto`} />
              </motion.div>
            ))}
          </motion.div>

          {/* PWA Badge */}
          <motion.div
            className="mt-6 inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5, duration: 0.4 }}
          >
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
            PWA Ready
          </motion.div>
        </div>

        {/* Floating Particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-300 rounded-full opacity-30"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 2) * 40}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 2 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>
    </AnimatePresence>
  )
}

export default PWALoader
