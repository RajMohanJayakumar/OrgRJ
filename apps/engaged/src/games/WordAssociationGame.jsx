import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

/**
 * Word Association Game - Ellen Style
 * Players connect words in a chain with lightning speed
 */
export default function WordAssociationGame({ onBack, roomCode, players, isHost, sendMessage }) {
  const [gameState, setGameState] = useState('lobby')
  const [currentWord, setCurrentWord] = useState('')
  const [wordChain, setWordChain] = useState([])
  const [myWord, setMyWord] = useState('')
  const [timeLeft, setTimeLeft] = useState(30)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-cyan-900 to-teal-900 p-4">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h1 
          className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          💭 Word Association
        </motion.h1>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">Coming Soon!</h2>
          <p className="text-blue-200 mb-6">
            Connect words in a chain with lightning speed. This exciting game is currently under development.
          </p>
          
          <div className="text-blue-300 space-y-2">
            <p>🔗 Chain words together</p>
            <p>⚡ Think fast under pressure</p>
            <p>🏆 Score points for creativity</p>
            <p>👥 Play with 3-12 players</p>
          </div>
        </div>

        <button
          onClick={onBack}
          className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-8 py-3 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
        >
          ← Back to Games
        </button>
      </div>
    </div>
  )
}
