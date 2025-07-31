/**
 * High Score Management Hook
 * Centralized high score management for arcade games
 */

import { useState, useCallback, useEffect } from 'react'
import { ARCADE_CONFIG } from '../config/arcadeConfig'

const useHighScore = (gameId, initialScore = 0) => {
  const storageKey = `${ARCADE_CONFIG.STORAGE.PREFIX}${gameId}${ARCADE_CONFIG.STORAGE.HIGH_SCORE_SUFFIX}`
  
  const [currentScore, setCurrentScore] = useState(initialScore)
  const [highScore, setHighScore] = useState(() => {
    try {
      const stored = localStorage.getItem(storageKey)
      return stored ? parseInt(stored, 10) : 0
    } catch (error) {
      console.warn('Failed to load high score:', error)
      return 0
    }
  })
  const [isNewHighScore, setIsNewHighScore] = useState(false)
  const [scoreHistory, setScoreHistory] = useState(() => {
    try {
      const historyKey = `${storageKey}_history`
      const stored = localStorage.getItem(historyKey)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.warn('Failed to load score history:', error)
      return []
    }
  })
  
  // Update current score
  const updateScore = useCallback((newScore) => {
    setCurrentScore(newScore)
    
    // Check if it's a new high score
    if (newScore > highScore) {
      setIsNewHighScore(true)
    }
  }, [highScore])
  
  // Add points to current score
  const addScore = useCallback((points) => {
    setCurrentScore(prev => {
      const newScore = prev + points
      if (newScore > highScore) {
        setIsNewHighScore(true)
      }
      return newScore
    })
  }, [highScore])
  
  // Reset current score
  const resetScore = useCallback(() => {
    setCurrentScore(0)
    setIsNewHighScore(false)
  }, [])
  
  // Save high score
  const saveHighScore = useCallback((finalScore = currentScore) => {
    try {
      if (finalScore > highScore) {
        setHighScore(finalScore)
        localStorage.setItem(storageKey, finalScore.toString())

        // Add to score history
        const newEntry = {
          score: finalScore,
          date: new Date().toISOString(),
          gameId
        }

        setScoreHistory(prevHistory => {
          const updatedHistory = [newEntry, ...prevHistory].slice(0, 10) // Keep last 10 scores
          const historyKey = `${storageKey}_history`
          localStorage.setItem(historyKey, JSON.stringify(updatedHistory))
          return updatedHistory
        })

        return true // New high score
      }

      // Still add to history even if not high score
      const newEntry = {
        score: finalScore,
        date: new Date().toISOString(),
        gameId
      }

      setScoreHistory(prevHistory => {
        const updatedHistory = [newEntry, ...prevHistory].slice(0, 10)
        const historyKey = `${storageKey}_history`
        localStorage.setItem(historyKey, JSON.stringify(updatedHistory))
        return updatedHistory
      })

      return false // Not a new high score
    } catch (error) {
      console.warn('Failed to save high score:', error)
      return false
    }
  }, [currentScore, highScore, storageKey, gameId])
  
  // Clear high score
  const clearHighScore = useCallback(() => {
    try {
      setHighScore(0)
      setScoreHistory([])
      localStorage.removeItem(storageKey)
      localStorage.removeItem(`${storageKey}_history`)
    } catch (error) {
      console.warn('Failed to clear high score:', error)
    }
  }, [storageKey])
  
  // Get all high scores for all games
  const getAllHighScores = useCallback(() => {
    const allScores = {}
    
    Object.values(ARCADE_CONFIG.GAMES).forEach(game => {
      const key = `${ARCADE_CONFIG.STORAGE.PREFIX}${game.id}${ARCADE_CONFIG.STORAGE.HIGH_SCORE_SUFFIX}`
      try {
        const score = localStorage.getItem(key)
        allScores[game.id] = score ? parseInt(score, 10) : 0
      } catch (error) {
        allScores[game.id] = 0
      }
    })
    
    return allScores
  }, [])
  
  // Get score statistics
  const getScoreStats = useCallback(() => {
    if (scoreHistory.length === 0) {
      return {
        totalGames: 0,
        averageScore: 0,
        bestScore: highScore,
        worstScore: 0,
        totalScore: 0,
        improvement: 0
      }
    }
    
    const scores = scoreHistory.map(entry => entry.score)
    const totalScore = scores.reduce((sum, score) => sum + score, 0)
    const averageScore = Math.round(totalScore / scores.length)
    const worstScore = Math.min(...scores)
    
    // Calculate improvement (last 3 vs first 3 games)
    let improvement = 0
    if (scoreHistory.length >= 6) {
      const recent = scoreHistory.slice(0, 3).map(e => e.score)
      const early = scoreHistory.slice(-3).map(e => e.score)
      const recentAvg = recent.reduce((sum, s) => sum + s, 0) / 3
      const earlyAvg = early.reduce((sum, s) => sum + s, 0) / 3
      improvement = Math.round(((recentAvg - earlyAvg) / earlyAvg) * 100)
    }
    
    return {
      totalGames: scoreHistory.length,
      averageScore,
      bestScore: highScore,
      worstScore,
      totalScore,
      improvement
    }
  }, [scoreHistory, highScore])
  
  // Format score for display
  const formatScore = useCallback((score) => {
    if (score >= 1000000) {
      return `${(score / 1000000).toFixed(1)}M`
    } else if (score >= 1000) {
      return `${(score / 1000).toFixed(1)}K`
    }
    return score.toString()
  }, [])
  
  // Auto-save when component unmounts (without causing infinite loops)
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Direct save without using the callback to avoid dependency issues
      if (currentScore > 0 && currentScore > highScore) {
        try {
          localStorage.setItem(storageKey, currentScore.toString())
        } catch (error) {
          console.warn('Failed to auto-save high score:', error)
        }
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [currentScore, highScore, storageKey])
  
  return {
    // Current state
    currentScore,
    highScore,
    isNewHighScore,
    scoreHistory,
    
    // Score management
    updateScore,
    addScore,
    resetScore,
    saveHighScore,
    clearHighScore,
    
    // Utilities
    getAllHighScores,
    getScoreStats,
    formatScore,
    
    // Storage key for external use
    storageKey
  }
}

export default useHighScore
