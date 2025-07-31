import { useState, useCallback } from 'react'
import { AUDIENCE_REACTIONS } from '../constants/gameConstants'

/**
 * Audience Interaction Hook
 * Manages audience reactions and interactions
 */
export default function useAudienceInteraction(sendMessage, roomCode) {
  const [reactions, setReactions] = useState([])
  const [reactionCounts, setReactionCounts] = useState({})

  // Send audience reaction
  const sendReaction = useCallback((reactionType) => {
    if (sendMessage && roomCode) {
      sendMessage({
        type: 'AUDIENCE_REACTION',
        data: {
          roomCode,
          reaction: reactionType,
          timestamp: Date.now()
        }
      })
    }

    // Add to local reactions for immediate feedback
    const newReaction = {
      id: Date.now(),
      type: reactionType,
      timestamp: Date.now()
    }

    setReactions(prev => [...prev, newReaction])
    setReactionCounts(prev => ({
      ...prev,
      [reactionType]: (prev[reactionType] || 0) + 1
    }))

    // Remove reaction after animation
    setTimeout(() => {
      setReactions(prev => prev.filter(r => r.id !== newReaction.id))
    }, 3000)
  }, [sendMessage, roomCode])

  // Clear all reactions
  const clearReactions = useCallback(() => {
    setReactions([])
    setReactionCounts({})
  }, [])

  // Get reaction buttons
  const getReactionButtons = useCallback(() => {
    return [
      { type: AUDIENCE_REACTIONS.CHEER, emoji: '🎉', label: 'Cheer' },
      { type: AUDIENCE_REACTIONS.APPLAUSE, emoji: '👏', label: 'Applause' },
      { type: AUDIENCE_REACTIONS.LAUGH, emoji: '😂', label: 'Laugh' },
      { type: AUDIENCE_REACTIONS.WOW, emoji: '😮', label: 'Wow' },
      { type: AUDIENCE_REACTIONS.HEART, emoji: '❤️', label: 'Love' },
      { type: AUDIENCE_REACTIONS.FIRE, emoji: '🔥', label: 'Fire' }
    ]
  }, [])

  return {
    reactions,
    reactionCounts,
    sendReaction,
    clearReactions,
    getReactionButtons
  }
}
