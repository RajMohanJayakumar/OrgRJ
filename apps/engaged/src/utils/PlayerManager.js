/**
 * Player Manager Utility
 * Manages player data, statistics, and achievements
 */

import { PLAYER_STATES, ACHIEVEMENT_TYPES } from '../constants/gameConstants'

class PlayerManager {
  constructor() {
    this.players = new Map()
    this.playerStats = new Map()
    this.achievements = new Map()
  }

  // Generate unique player ID
  generatePlayerId() {
    return `player_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  }

  // Create new player
  createPlayer(name, additionalData = {}) {
    const playerId = this.generatePlayerId()
    
    const player = {
      id: playerId,
      name: name.trim(),
      state: PLAYER_STATES.CONNECTED,
      joinedAt: Date.now(),
      lastActivity: Date.now(),
      ...additionalData
    }

    this.players.set(playerId, player)
    this.initializePlayerStats(playerId)

    return player
  }

  // Get player by ID
  getPlayer(playerId) {
    return this.players.get(playerId)
  }

  // Update player data
  updatePlayer(playerId, updates) {
    const player = this.players.get(playerId)
    if (player) {
      Object.assign(player, updates)
      player.lastActivity = Date.now()
      return player
    }
    return null
  }

  // Update player state
  updatePlayerState(playerId, newState) {
    const player = this.players.get(playerId)
    if (player) {
      player.state = newState
      player.lastActivity = Date.now()
      return player
    }
    return null
  }

  // Remove player
  removePlayer(playerId) {
    const player = this.players.get(playerId)
    if (player) {
      this.players.delete(playerId)
      return player
    }
    return null
  }

  // Initialize player statistics
  initializePlayerStats(playerId) {
    const stats = {
      gamesPlayed: 0,
      gamesWon: 0,
      totalScore: 0,
      averageScore: 0,
      bestScore: 0,
      totalPlayTime: 0,
      achievements: [],
      gameStats: {}, // Game-specific stats
      createdAt: Date.now(),
      lastUpdated: Date.now()
    }

    this.playerStats.set(playerId, stats)
    return stats
  }

  // Get player statistics
  getPlayerStats(playerId) {
    return this.playerStats.get(playerId)
  }

  // Update player statistics
  updatePlayerStats(playerId, updates) {
    const stats = this.playerStats.get(playerId)
    if (stats) {
      Object.assign(stats, updates)
      stats.lastUpdated = Date.now()
      
      // Recalculate average score
      if (stats.gamesPlayed > 0) {
        stats.averageScore = Math.round(stats.totalScore / stats.gamesPlayed)
      }
      
      return stats
    }
    return null
  }

  // Add game result
  addGameResult(playerId, gameResult) {
    const stats = this.playerStats.get(playerId)
    if (!stats) return null

    stats.gamesPlayed++
    stats.totalScore += gameResult.score || 0
    
    if (gameResult.won) {
      stats.gamesWon++
    }
    
    if (gameResult.score > stats.bestScore) {
      stats.bestScore = gameResult.score
    }
    
    if (gameResult.playTime) {
      stats.totalPlayTime += gameResult.playTime
    }

    // Update game-specific stats
    if (gameResult.gameType) {
      if (!stats.gameStats[gameResult.gameType]) {
        stats.gameStats[gameResult.gameType] = {
          played: 0,
          won: 0,
          totalScore: 0,
          bestScore: 0
        }
      }
      
      const gameStats = stats.gameStats[gameResult.gameType]
      gameStats.played++
      gameStats.totalScore += gameResult.score || 0
      
      if (gameResult.won) {
        gameStats.won++
      }
      
      if (gameResult.score > gameStats.bestScore) {
        gameStats.bestScore = gameResult.score
      }
    }

    stats.lastUpdated = Date.now()
    
    // Check for achievements
    this.checkAchievements(playerId, gameResult)
    
    return stats
  }

  // Check and award achievements
  checkAchievements(playerId, gameResult) {
    const stats = this.playerStats.get(playerId)
    if (!stats) return []

    const newAchievements = []

    // First win achievement
    if (gameResult.won && stats.gamesWon === 1) {
      newAchievements.push(this.awardAchievement(playerId, ACHIEVEMENT_TYPES.FIRST_WIN))
    }

    // Perfect game achievement
    if (gameResult.perfect) {
      newAchievements.push(this.awardAchievement(playerId, ACHIEVEMENT_TYPES.PERFECT_GAME))
    }

    // Speed demon achievement
    if (gameResult.speedBonus && gameResult.speedBonus >= 5) {
      newAchievements.push(this.awardAchievement(playerId, ACHIEVEMENT_TYPES.SPEED_DEMON))
    }

    // Consistent player achievement
    if (stats.gamesPlayed >= 10) {
      newAchievements.push(this.awardAchievement(playerId, ACHIEVEMENT_TYPES.CONSISTENT_PLAYER))
    }

    return newAchievements.filter(Boolean)
  }

  // Award achievement
  awardAchievement(playerId, achievementType) {
    const stats = this.playerStats.get(playerId)
    if (!stats) return null

    // Check if already has this achievement
    if (stats.achievements.includes(achievementType)) {
      return null
    }

    stats.achievements.push(achievementType)
    
    const achievement = {
      type: achievementType,
      playerId,
      awardedAt: Date.now()
    }

    // Store achievement details
    if (!this.achievements.has(playerId)) {
      this.achievements.set(playerId, [])
    }
    this.achievements.get(playerId).push(achievement)

    return achievement
  }

  // Get player achievements
  getPlayerAchievements(playerId) {
    return this.achievements.get(playerId) || []
  }

  // Get leaderboard
  getLeaderboard(gameType = null, limit = 10) {
    const players = Array.from(this.playerStats.entries())
    
    let sortedPlayers
    
    if (gameType) {
      // Game-specific leaderboard
      sortedPlayers = players
        .filter(([_, stats]) => stats.gameStats[gameType])
        .map(([playerId, stats]) => ({
          playerId,
          playerName: this.players.get(playerId)?.name || 'Unknown',
          ...stats.gameStats[gameType]
        }))
        .sort((a, b) => b.bestScore - a.bestScore)
    } else {
      // Overall leaderboard
      sortedPlayers = players
        .map(([playerId, stats]) => ({
          playerId,
          playerName: this.players.get(playerId)?.name || 'Unknown',
          totalScore: stats.totalScore,
          gamesWon: stats.gamesWon,
          gamesPlayed: stats.gamesPlayed,
          averageScore: stats.averageScore,
          bestScore: stats.bestScore
        }))
        .sort((a, b) => b.totalScore - a.totalScore)
    }

    return sortedPlayers.slice(0, limit)
  }

  // Clean up inactive players
  cleanupInactivePlayers(maxAge = 86400000) { // 24 hours default
    const now = Date.now()
    const playersToDelete = []

    for (const [playerId, player] of this.players) {
      if (now - player.lastActivity > maxAge) {
        playersToDelete.push(playerId)
      }
    }

    playersToDelete.forEach(playerId => {
      this.players.delete(playerId)
      this.playerStats.delete(playerId)
      this.achievements.delete(playerId)
    })

    return playersToDelete.length
  }

  // Get player statistics
  getStats() {
    return {
      totalPlayers: this.players.size,
      activePlayers: Array.from(this.players.values())
        .filter(p => p.state === PLAYER_STATES.CONNECTED).length,
      totalGamesPlayed: Array.from(this.playerStats.values())
        .reduce((sum, stats) => sum + stats.gamesPlayed, 0),
      totalAchievements: Array.from(this.achievements.values())
        .reduce((sum, achievements) => sum + achievements.length, 0)
    }
  }
}

export default PlayerManager
