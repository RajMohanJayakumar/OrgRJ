import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

/**
 * Breathing Exercise Component
 * Guided breathing exercise for stress relief
 */
const BreathingExercise = () => {
  const [isActive, setIsActive] = useState(false)
  const [phase, setPhase] = useState('inhale') // 'inhale', 'hold', 'exhale', 'pause'
  const [cycle, setCycle] = useState(0)
  const [progress, setProgress] = useState(0) // 0 to 1 for smooth progress
  const intervalRef = useRef(null)
  const startTimeRef = useRef(null)
  
  // Breathing pattern: 4-4-4-4 (inhale-hold-exhale-pause)
  const breathingPattern = {
    inhale: { duration: 4, next: 'hold', instruction: 'Breathe In', color: '#3b82f6' },
    hold: { duration: 4, next: 'exhale', instruction: 'Hold', color: '#8b5cf6' },
    exhale: { duration: 4, next: 'pause', instruction: 'Breathe Out', color: '#10b981' },
    pause: { duration: 4, next: 'inhale', instruction: 'Pause', color: '#f59e0b' }
  }

  useEffect(() => {
    if (isActive) {
      startTimeRef.current = Date.now()

      intervalRef.current = setInterval(() => {
        const elapsed = (Date.now() - startTimeRef.current) / 1000
        const currentPattern = breathingPattern[phase]
        const phaseProgress = elapsed / currentPattern.duration

        if (phaseProgress >= 1) {
          // Move to next phase
          const nextPhase = currentPattern.next
          setPhase(nextPhase)
          setProgress(0)
          startTimeRef.current = Date.now()

          if (nextPhase === 'inhale') {
            setCycle(prev => prev + 1)
          }
        } else {
          setProgress(phaseProgress)
        }
      }, 16) // ~60fps for smooth animation
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
  }, [isActive, phase])



  const startExercise = () => {
    setIsActive(true)
    setPhase('inhale')
    setProgress(0)
    setCycle(0)
    startTimeRef.current = Date.now()
  }

  const closeExercise = () => {
    setIsActive(false)
    setPhase('inhale')
    setProgress(0)
    setCycle(0)
  }

  const currentPattern = breathingPattern[phase]
  const timeRemaining = Math.ceil(currentPattern.duration * (1 - progress))

  return (
    <div className="fixed bottom-20 left-4 z-50">
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-6 w-80"
          >
            {/* Header */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {/* Custom Breath Icon */}
                  <div className="relative">
                    <motion.div
                      className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400"
                      animate={{
                        scale: phase === 'inhale' ? [1, 1.3, 1] :
                               phase === 'exhale' ? [1.3, 1, 1.3] : 1,
                        opacity: [0.7, 1, 0.7]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    <motion.div
                      className="absolute inset-0 w-5 h-5 rounded-full bg-gradient-to-r from-blue-300 to-cyan-300"
                      animate={{
                        scale: phase === 'inhale' ? [1.2, 1.5, 1.2] :
                               phase === 'exhale' ? [1.5, 1.2, 1.5] : 1.2,
                        opacity: [0.3, 0.6, 0.3]
                      }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  </div>
                  <h3 className="font-semibold text-gray-800">Breathing Exercise</h3>
                </div>
                <button
                  onClick={closeExercise}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-gray-600">Cycle {cycle + 1} • 4-4-4-4 Pattern</p>
            </div>

            {/* Breathing Circle */}
            <div className="relative flex items-center justify-center mb-6">
              <div className="relative w-32 h-32">
                {/* Background Circle */}
                <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
                
                {/* Progress Circle */}
                <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="60"
                    stroke={currentPattern.color}
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 60}`}
                    strokeDashoffset={`${2 * Math.PI * 60 * (1 - progress)}`}
                    className="transition-all duration-75 ease-linear"
                  />
                </svg>
                
                {/* Breathing Circle */}
                <motion.div
                  className="absolute inset-4 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: currentPattern.color }}
                  animate={{
                    scale: phase === 'inhale' ? [1, 1.2] : 
                           phase === 'exhale' ? [1.2, 1] : 1
                  }}
                  transition={{
                    duration: phase === 'inhale' || phase === 'exhale' ? 4 : 0,
                    ease: "easeInOut"
                  }}
                >
                  <div className="text-center">
                    <div className="text-2xl font-bold">{timeRemaining}</div>
                    <div className="text-xs opacity-90">{currentPattern.instruction}</div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Instructions */}
            <div className="text-center mb-4">
              <motion.p
                key={phase}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-lg font-medium"
                style={{ color: currentPattern.color }}
              >
                {currentPattern.instruction}
              </motion.p>
              <p className="text-sm text-gray-500 mt-1">
                {phase === 'inhale' && "Fill your lungs slowly and deeply"}
                {phase === 'hold' && "Hold the breath gently"}
                {phase === 'exhale' && "Release the air slowly and completely"}
                {phase === 'pause' && "Rest and prepare for the next breath"}
              </p>
            </div>

            {/* Controls */}
            <div className="flex justify-center">
              <motion.button
                onClick={closeExercise}
                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Start Button */}
      {!isActive && (
        <motion.button
          onClick={startExercise}
          className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center relative overflow-hidden"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
        >
          {/* Animated Background */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 opacity-0"
            animate={{ opacity: [0, 0.3, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Custom Breath Icon */}
          <div className="relative z-10 text-center">
            <div className="relative mb-1">
              <motion.div
                className="w-6 h-6 mx-auto rounded-full bg-white/30 backdrop-blur-sm"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.6, 1, 0.6]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="absolute inset-0 w-6 h-6 mx-auto rounded-full bg-white/20"
                animate={{
                  scale: [1.2, 1.6, 1.2],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>
            <div className="text-xs font-medium">Breathe</div>
          </div>
        </motion.button>
      )}
    </div>
  )
}

export default BreathingExercise
