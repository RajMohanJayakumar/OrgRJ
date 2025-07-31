/**
 * Game Room Manager Utility
 * Manages game rooms, players, and room state
 */

import { ROOM_STATES, PLAYER_ROLES } from '../constants/gameConstants'

class GameRoomManager {
  constructor() {
    this.rooms = new Map()
    this.playerRooms = new Map() // Track which room each player is in
  }

  // Generate unique room code
  generateRoomCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = ''
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  // Create new room
  createRoom(gameType, hostPlayer, settings = {}) {
    const roomCode = this.generateRoomCode()
    
    // Ensure unique room code
    while (this.rooms.has(roomCode)) {
      roomCode = this.generateRoomCode()
    }

    const room = {
      code: roomCode,
      gameType,
      host: hostPlayer.id,
      state: ROOM_STATES.WAITING,
      players: [{ ...hostPlayer, role: PLAYER_ROLES.HOST }],
      spectators: [],
      settings: {
        maxPlayers: 8,
        allowSpectators: true,
        isPrivate: false,
        ...settings
      },
      gameData: {},
      createdAt: Date.now(),
      lastActivity: Date.now()
    }

    this.rooms.set(roomCode, room)
    this.playerRooms.set(hostPlayer.id, roomCode)

    return room
  }

  // Join existing room
  joinRoom(roomCode, player) {
    const room = this.rooms.get(roomCode)
    
    if (!room) {
      throw new Error('Room not found')
    }

    if (room.state !== ROOM_STATES.WAITING) {
      throw new Error('Game already in progress')
    }

    if (room.players.length >= room.settings.maxPlayers) {
      if (room.settings.allowSpectators) {
        // Add as spectator
        room.spectators.push({ ...player, role: PLAYER_ROLES.SPECTATOR })
        this.playerRooms.set(player.id, roomCode)
        return { ...room, joinedAsSpectator: true }
      } else {
        throw new Error('Room is full')
      }
    }

    // Add as player
    room.players.push({ ...player, role: PLAYER_ROLES.PLAYER })
    room.lastActivity = Date.now()
    this.playerRooms.set(player.id, roomCode)

    return room
  }

  // Leave room
  leaveRoom(playerId) {
    const roomCode = this.playerRooms.get(playerId)
    if (!roomCode) return null

    const room = this.rooms.get(roomCode)
    if (!room) return null

    // Remove from players
    room.players = room.players.filter(p => p.id !== playerId)
    
    // Remove from spectators
    room.spectators = room.spectators.filter(p => p.id !== playerId)

    // Remove player room mapping
    this.playerRooms.delete(playerId)

    // If host left, assign new host or close room
    if (room.host === playerId) {
      if (room.players.length > 0) {
        // Assign new host
        room.host = room.players[0].id
        room.players[0].role = PLAYER_ROLES.HOST
      } else {
        // No players left, close room
        this.rooms.delete(roomCode)
        return null
      }
    }

    // If no players left, close room
    if (room.players.length === 0) {
      this.rooms.delete(roomCode)
      return null
    }

    room.lastActivity = Date.now()
    return room
  }

  // Get room by code
  getRoom(roomCode) {
    return this.rooms.get(roomCode)
  }

  // Get room by player ID
  getRoomByPlayer(playerId) {
    const roomCode = this.playerRooms.get(playerId)
    return roomCode ? this.rooms.get(roomCode) : null
  }

  // Update room state
  updateRoomState(roomCode, newState) {
    const room = this.rooms.get(roomCode)
    if (room) {
      room.state = newState
      room.lastActivity = Date.now()
      return room
    }
    return null
  }

  // Update room settings
  updateRoomSettings(roomCode, settings) {
    const room = this.rooms.get(roomCode)
    if (room) {
      room.settings = { ...room.settings, ...settings }
      room.lastActivity = Date.now()
      return room
    }
    return null
  }

  // Update game data
  updateGameData(roomCode, gameData) {
    const room = this.rooms.get(roomCode)
    if (room) {
      room.gameData = { ...room.gameData, ...gameData }
      room.lastActivity = Date.now()
      return room
    }
    return null
  }

  // Kick player (host only)
  kickPlayer(roomCode, hostId, playerId) {
    const room = this.rooms.get(roomCode)
    if (!room || room.host !== hostId) {
      throw new Error('Permission denied')
    }

    // Remove player
    room.players = room.players.filter(p => p.id !== playerId)
    room.spectators = room.spectators.filter(p => p.id !== playerId)
    this.playerRooms.delete(playerId)

    room.lastActivity = Date.now()
    return room
  }

  // Get all rooms (for admin/debugging)
  getAllRooms() {
    return Array.from(this.rooms.values())
  }

  // Clean up inactive rooms
  cleanupInactiveRooms(maxAge = 3600000) { // 1 hour default
    const now = Date.now()
    const roomsToDelete = []

    for (const [roomCode, room] of this.rooms) {
      if (now - room.lastActivity > maxAge) {
        roomsToDelete.push(roomCode)
        
        // Clean up player mappings
        room.players.forEach(player => {
          this.playerRooms.delete(player.id)
        })
        room.spectators.forEach(spectator => {
          this.playerRooms.delete(spectator.id)
        })
      }
    }

    roomsToDelete.forEach(roomCode => {
      this.rooms.delete(roomCode)
    })

    return roomsToDelete.length
  }

  // Get room statistics
  getStats() {
    const rooms = Array.from(this.rooms.values())
    return {
      totalRooms: rooms.length,
      activeRooms: rooms.filter(r => r.state === ROOM_STATES.PLAYING).length,
      waitingRooms: rooms.filter(r => r.state === ROOM_STATES.WAITING).length,
      totalPlayers: rooms.reduce((sum, r) => sum + r.players.length, 0),
      totalSpectators: rooms.reduce((sum, r) => sum + r.spectators.length, 0)
    }
  }
}

export default GameRoomManager
