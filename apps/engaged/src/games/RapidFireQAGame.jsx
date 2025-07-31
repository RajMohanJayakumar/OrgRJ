import React from 'react'
import { motion } from 'framer-motion'

/**
 * Rapid Fire Q&A Game - Ellen Style
 * Quick questions, quicker answers!
 */
export default function RapidFireQAGame({ onBack, roomCode, players, isHost, sendMessage }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 p-4">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h1 
          className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          ⚡ Rapid Fire Q&A
        </motion.h1>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">Coming Soon!</h2>
          <p className="text-purple-200 mb-6">
            Quick questions, quicker answers! This fast-paced trivia game is currently under development.
          </p>
          
          <div className="text-purple-300 space-y-2">
            <p>⚡ Lightning-fast questions</p>
            <p>🧠 Test your knowledge</p>
            <p>🏃 Speed is everything</p>
            <p>👥 Play with 2-15 players</p>
          </div>
        </div>

        <button
          onClick={onBack}
          className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
        >
          ← Back to Games
        </button>
      </div>
    </div>
  )
}
