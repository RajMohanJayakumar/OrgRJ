import { useState, useCallback } from 'react'
import { PLAYER_STATES } from '../constants/gameConstants'

/**
 * Player State Hook
 * Manages individual player state and actions
 */
export default function usePlayerState(playerId, playerName) {
  const [state, setState] = useState(PLAYER_STATES.CONNECTED)
  const [score, setScore] = useState(0)
  const [isReady, setIsReady] = useState(false)
  const [achievements, setAchievements] = useState([])
  const [stats, setStats] = useState({
    gamesPlayed: 0,
    gamesWon: 0,
    totalScore: 0,
    averageScore: 0
  })

  // Update player state
  const updateState = useCallback((newState) => {
    setState(newState)
  }, [])

  // Add score
  const addScore = useCallback((points) => {
    setScore(prev => prev + points)
    setStats(prev => ({
      ...prev,
      totalScore: prev.totalScore + points
    }))
  }, [])

  // Reset score
  const resetScore = useCallback(() => {
    setScore(0)
  }, [])

  // Toggle ready state
  const toggleReady = useCallback(() => {
    setIsReady(prev => !prev)
  }, [])

  // Add achievement
  const addAchievement = useCallback((achievement) => {
    setAchievements(prev => [...prev, achievement])
  }, [])

  // Update stats
  const updateStats = useCallback((newStats) => {
    setStats(prev => ({ ...prev, ...newStats }))
  }, [])

  return {
    playerId,
    playerName,
    state,
    score,
    isReady,
    achievements,
    stats,
    updateState,
    addScore,
    resetScore,
    toggleReady,
    addAchievement,
    updateStats
  }
}
