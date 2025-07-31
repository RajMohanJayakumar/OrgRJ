import React from 'react'
import { motion } from 'framer-motion'

/**
 * Story Building Game - Ellen Style
 * Build hilarious stories together, one word at a time
 */
export default function StoryBuildingGame({ onBack, roomCode, players, isHost, sendMessage }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 p-4">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h1 
          className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          📚 Story Building
        </motion.h1>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">Coming Soon!</h2>
          <p className="text-green-200 mb-6">
            Build hilarious stories together, one word at a time. This collaborative game is currently under development.
          </p>
          
          <div className="text-green-300 space-y-2">
            <p>📝 Collaborative storytelling</p>
            <p>😂 Hilarious outcomes</p>
            <p>🎭 Creative expression</p>
            <p>👥 Play with 3-8 players</p>
          </div>
        </div>

        <button
          onClick={onBack}
          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
        >
          ← Back to Games
        </button>
      </div>
    </div>
  )
}
