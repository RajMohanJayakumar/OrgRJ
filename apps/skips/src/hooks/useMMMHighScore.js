/**
 * MMM Fingers High Score Hook
 * Manages high scores and achievements for the MMM fingers game
 */

import { useState, useEffect, useCallback } from 'react'
import { MMM_CONFIG } from '../config/mmmConfig'

const useMMMHighScore = (gameMode = 'classic') => {
  const [currentScore, setCurrentScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [isNewHighScore, setIsNewHighScore] = useState(false)
  const [achievements, setAchievements] = useState([])
  const [statistics, setStatistics] = useState({
    gamesPlayed: 0,
    totalScore: 0,
    bestStreak: 0,
    averageScore: 0,
    totalPlayTime: 0
  })

  const storageKey = MMM_CONFIG.MODES[gameMode.toUpperCase()]?.storageKey || 'mmmClassicHighScore'
  const achievementsKey = `${storageKey}_achievements`
  const statisticsKey = `${storageKey}_statistics`

  // Load high score from localStorage
  useEffect(() => {
    try {
      const savedHighScore = localStorage.getItem(storageKey)
      if (savedHighScore) {
        setHighScore(parseInt(savedHighScore, 10))
      }

      const savedAchievements = localStorage.getItem(achievementsKey)
      if (savedAchievements) {
        setAchievements(JSON.parse(savedAchievements))
      }

      const savedStatistics = localStorage.getItem(statisticsKey)
      if (savedStatistics) {
        setStatistics(JSON.parse(savedStatistics))
      }
    } catch (error) {
      console.warn('Error loading high score data:', error)
    }
  }, [storageKey, achievementsKey, statisticsKey])

  // Update current score
  const updateScore = useCallback((newScore) => {
    setCurrentScore(newScore)
    
    // Check if it's a new high score
    if (newScore > highScore) {
      setIsNewHighScore(true)
    }
  }, [highScore])

  // Save high score
  const saveHighScore = useCallback((finalScore, gameData = {}) => {
    try {
      if (finalScore > highScore) {
        setHighScore(finalScore)
        localStorage.setItem(storageKey, finalScore.toString())
        setIsNewHighScore(true)
        
        // Unlock high score achievement
        unlockAchievement('HIGH_SCORE', `New high score: ${finalScore}`)
      }

      // Update statistics
      const newStats = {
        gamesPlayed: statistics.gamesPlayed + 1,
        totalScore: statistics.totalScore + finalScore,
        bestStreak: Math.max(statistics.bestStreak, gameData.streak || 0),
        totalPlayTime: statistics.totalPlayTime + (gameData.playTime || 0)
      }
      newStats.averageScore = Math.round(newStats.totalScore / newStats.gamesPlayed)

      setStatistics(newStats)
      localStorage.setItem(statisticsKey, JSON.stringify(newStats))

      // Check for achievements
      checkAchievements(finalScore, gameData, newStats)

    } catch (error) {
      console.warn('Error saving high score:', error)
    }
  }, [highScore, storageKey, statistics, achievementsKey, statisticsKey])

  // Reset current score
  const resetScore = useCallback(() => {
    setCurrentScore(0)
    setIsNewHighScore(false)
  }, [])

  // Achievement definitions
  const ACHIEVEMENT_DEFINITIONS = {
    FIRST_GAME: {
      id: 'FIRST_GAME',
      name: 'First Steps',
      description: 'Complete your first game',
      icon: '🎯',
      condition: (score, gameData, stats) => stats.gamesPlayed === 1
    },
    SCORE_100: {
      id: 'SCORE_100',
      name: 'Century',
      description: 'Score 100 points in a single game',
      icon: '💯',
      condition: (score) => score >= 100
    },
    SCORE_500: {
      id: 'SCORE_500',
      name: 'High Achiever',
      description: 'Score 500 points in a single game',
      icon: '🌟',
      condition: (score) => score >= 500
    },
    SCORE_1000: {
      id: 'SCORE_1000',
      name: 'Master',
      description: 'Score 1000 points in a single game',
      icon: '🏆',
      condition: (score) => score >= 1000
    },
    STREAK_10: {
      id: 'STREAK_10',
      name: 'On Fire',
      description: 'Achieve a 10-pattern streak',
      icon: '🔥',
      condition: (score, gameData) => gameData.streak >= 10
    },
    STREAK_25: {
      id: 'STREAK_25',
      name: 'Unstoppable',
      description: 'Achieve a 25-pattern streak',
      icon: '⚡',
      condition: (score, gameData) => gameData.streak >= 25
    },
    GAMES_10: {
      id: 'GAMES_10',
      name: 'Dedicated',
      description: 'Play 10 games',
      icon: '🎮',
      condition: (score, gameData, stats) => stats.gamesPlayed >= 10
    },
    GAMES_50: {
      id: 'GAMES_50',
      name: 'Enthusiast',
      description: 'Play 50 games',
      icon: '🎯',
      condition: (score, gameData, stats) => stats.gamesPlayed >= 50
    },
    GAMES_100: {
      id: 'GAMES_100',
      name: 'Veteran',
      description: 'Play 100 games',
      icon: '🏅',
      condition: (score, gameData, stats) => stats.gamesPlayed >= 100
    },
    PERFECT_LEVEL: {
      id: 'PERFECT_LEVEL',
      name: 'Perfect Memory',
      description: 'Complete a level without mistakes',
      icon: '🧠',
      condition: (score, gameData) => gameData.perfectLevel === true
    },
    SPEED_DEMON: {
      id: 'SPEED_DEMON',
      name: 'Speed Demon',
      description: 'Complete a pattern in under 2 seconds',
      icon: '💨',
      condition: (score, gameData) => gameData.fastestTime && gameData.fastestTime < 2000
    },
    HIGH_SCORE: {
      id: 'HIGH_SCORE',
      name: 'New Record',
      description: 'Set a new personal high score',
      icon: '🥇',
      condition: () => true // Manually triggered
    }
  }

  // Check for achievements
  const checkAchievements = useCallback((score, gameData, stats) => {
    const newAchievements = []

    Object.values(ACHIEVEMENT_DEFINITIONS).forEach(achievement => {
      // Skip if already unlocked
      if (achievements.find(a => a.id === achievement.id)) return

      // Check condition
      if (achievement.condition(score, gameData, stats)) {
        newAchievements.push({
          ...achievement,
          unlockedAt: new Date().toISOString(),
          score: score
        })
      }
    })

    if (newAchievements.length > 0) {
      const updatedAchievements = [...achievements, ...newAchievements]
      setAchievements(updatedAchievements)
      localStorage.setItem(achievementsKey, JSON.stringify(updatedAchievements))
      
      // Return new achievements for display
      return newAchievements
    }

    return []
  }, [achievements, achievementsKey, ACHIEVEMENT_DEFINITIONS])

  // Manually unlock achievement
  const unlockAchievement = useCallback((achievementId, customMessage = null) => {
    const achievement = ACHIEVEMENT_DEFINITIONS[achievementId]
    if (!achievement) return

    // Check if already unlocked
    if (achievements.find(a => a.id === achievementId)) return

    const newAchievement = {
      ...achievement,
      unlockedAt: new Date().toISOString(),
      score: currentScore,
      customMessage
    }

    const updatedAchievements = [...achievements, newAchievement]
    setAchievements(updatedAchievements)
    localStorage.setItem(achievementsKey, JSON.stringify(updatedAchievements))

    return newAchievement
  }, [achievements, achievementsKey, currentScore, ACHIEVEMENT_DEFINITIONS])

  // Get achievement progress
  const getAchievementProgress = useCallback(() => {
    const total = Object.keys(ACHIEVEMENT_DEFINITIONS).length
    const unlocked = achievements.length
    return {
      unlocked,
      total,
      percentage: Math.round((unlocked / total) * 100)
    }
  }, [achievements, ACHIEVEMENT_DEFINITIONS])

  // Clear all data
  const clearAllData = useCallback(() => {
    try {
      localStorage.removeItem(storageKey)
      localStorage.removeItem(achievementsKey)
      localStorage.removeItem(statisticsKey)
      
      setHighScore(0)
      setCurrentScore(0)
      setIsNewHighScore(false)
      setAchievements([])
      setStatistics({
        gamesPlayed: 0,
        totalScore: 0,
        bestStreak: 0,
        averageScore: 0,
        totalPlayTime: 0
      })
    } catch (error) {
      console.warn('Error clearing data:', error)
    }
  }, [storageKey, achievementsKey, statisticsKey])

  // Export data
  const exportData = useCallback(() => {
    return {
      gameMode,
      highScore,
      achievements,
      statistics,
      exportedAt: new Date().toISOString()
    }
  }, [gameMode, highScore, achievements, statistics])

  return {
    // Scores
    currentScore,
    highScore,
    isNewHighScore,

    // Statistics
    statistics,
    achievements,

    // Actions
    updateScore,
    saveHighScore,
    resetScore,
    unlockAchievement,
    clearAllData,

    // Utilities
    getAchievementProgress,
    exportData,
    checkAchievements,

    // Achievement definitions for reference
    ACHIEVEMENT_DEFINITIONS
  }
}

export default useMMMHighScore
