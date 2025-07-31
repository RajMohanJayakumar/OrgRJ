import React from 'react'
import { motion } from 'framer-motion'

/**
 * Emoji Chains Game - Ellen Style
 * Tell stories using only emojis
 */
export default function EmojiChainsGame({ onBack, roomCode, players, isHost, sendMessage }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-900 via-orange-900 to-red-900 p-4">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h1 
          className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          😄 Emoji Chains
        </motion.h1>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">Coming Soon!</h2>
          <p className="text-orange-200 mb-6">
            Tell hilarious stories using only emojis. This creative game is currently under development.
          </p>
          
          <div className="text-orange-300 space-y-2">
            <p>😊 Express with emojis only</p>
            <p>📚 Build collaborative stories</p>
            <p>🗳️ Vote for the best stories</p>
            <p>👥 Play with 2-10 players</p>
          </div>
        </div>

        <button
          onClick={onBack}
          className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-8 py-3 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
        >
          ← Back to Games
        </button>
      </div>
    </div>
  )
}
