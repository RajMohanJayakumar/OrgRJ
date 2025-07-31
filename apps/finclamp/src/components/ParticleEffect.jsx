import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const ParticleEffect = ({ trigger, type = 'success' }) => {
  const [particles, setParticles] = useState([])

  useEffect(() => {
    if (trigger) {
      const newParticles = []
      const particleCount = type === 'success' ? 15 : 8
      
      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          id: Math.random(),
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          emoji: type === 'success' ? ['💰', '💎', '⭐', '🎉', '✨'][Math.floor(Math.random() * 5)] : ['💸', '😅', '🤔'][Math.floor(Math.random() * 3)],
          delay: Math.random() * 0.5
        })
      }
      
      setParticles(newParticles)
      
      // Clear particles after animation
      setTimeout(() => setParticles([]), 2000)
    }
  }, [trigger, type])

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{ 
            x: particle.x, 
            y: particle.y, 
            scale: 0, 
            opacity: 1,
            rotate: 0
          }}
          animate={{ 
            y: particle.y - 200, 
            scale: [0, 1.5, 0], 
            opacity: [1, 1, 0],
            rotate: 360
          }}
          transition={{ 
            duration: 2, 
            delay: particle.delay,
            ease: "easeOut"
          }}
          className="absolute text-2xl"
        >
          {particle.emoji}
        </motion.div>
      ))}
    </div>
  )
}

export default ParticleEffect
