import React from 'react'
import { motion } from 'framer-motion'

/**
 * Voting Poll Game - Ellen Style
 * Vote on fun questions and see results instantly
 */
export default function VotingPollGame({ onBack, roomCode, players, isHost, sendMessage }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-pink-900 to-purple-900 p-4">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h1 
          className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          🗳️ Live Polls
        </motion.h1>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">Coming Soon!</h2>
          <p className="text-pink-200 mb-6">
            Vote on fun questions and see results instantly. This interactive polling game is currently under development.
          </p>
          
          <div className="text-pink-300 space-y-2">
            <p>🗳️ Real-time voting</p>
            <p>📊 Instant results</p>
            <p>🤔 Thought-provoking questions</p>
            <p>👥 Play with 5-50 players</p>
          </div>
        </div>

        <button
          onClick={onBack}
          className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-8 py-3 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
        >
          ← Back to Games
        </button>
      </div>
    </div>
  )
}
