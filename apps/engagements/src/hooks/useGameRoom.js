import { useState, useCallback, useEffect } from 'react'
import { WEBSOCKET_EVENTS } from '../config/websocketEvents'
import { ROOM_STATES, PLAYER_ROLES } from '../constants/gameConstants'

/**
 * Game Room Management Hook
 * Handles room creation, joining, leaving, and player management
 */
export default function useGameRoom(webSocketHook) {
  const [currentRoom, setCurrentRoom] = useState(null)
  const [players, setPlayers] = useState([])
  const [isHost, setIsHost] = useState(false)
  const [roomState, setRoomState] = useState(ROOM_STATES.WAITING)
  const [gameSettings, setGameSettings] = useState({})

  const { sendMessage, addEventListener } = webSocketHook || {}

  // Generate room code
  const generateRoomCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase()
  }

  // Create new room
  const createRoom = useCallback((gameType, playerName, settings = {}) => {
    const roomCode = generateRoomCode()
    const room = {
      code: roomCode,
      gameType,
      host: playerName,
      createdAt: Date.now(),
      state: ROOM_STATES.WAITING,
      settings
    }

    setCurrentRoom(room)
    setIsHost(true)
    setGameSettings(settings)
    setRoomState(ROOM_STATES.WAITING)

    // Send room creation message
    if (sendMessage) {
      sendMessage({
        type: WEBSOCKET_EVENTS.CREATE_ROOM,
        data: {
          room,
          player: {
            name: playerName,
            role: PLAYER_ROLES.HOST,
            id: generatePlayerId()
          }
        }
      })
    }

    return roomCode
  }, [sendMessage])

  // Join existing room
  const joinRoom = useCallback((roomCode, playerName) => {
    if (sendMessage) {
      sendMessage({
        type: WEBSOCKET_EVENTS.JOIN_ROOM,
        data: {
          roomCode,
          player: {
            name: playerName,
            role: PLAYER_ROLES.PLAYER,
            id: generatePlayerId()
          }
        }
      })
    }
  }, [sendMessage])

  // Leave room
  const leaveRoom = useCallback(() => {
    if (currentRoom && sendMessage) {
      sendMessage({
        type: WEBSOCKET_EVENTS.LEAVE_ROOM,
        data: {
          roomCode: currentRoom.code
        }
      })
    }

    setCurrentRoom(null)
    setPlayers([])
    setIsHost(false)
    setRoomState(ROOM_STATES.WAITING)
    setGameSettings({})
  }, [currentRoom, sendMessage])

  // Start game (host only)
  const startGame = useCallback(() => {
    if (isHost && currentRoom && sendMessage) {
      sendMessage({
        type: WEBSOCKET_EVENTS.START_GAME,
        data: {
          roomCode: currentRoom.code
        }
      })
    }
  }, [isHost, currentRoom, sendMessage])

  // Update game settings (host only)
  const updateGameSettings = useCallback((newSettings) => {
    if (isHost && currentRoom && sendMessage) {
      const updatedSettings = { ...gameSettings, ...newSettings }
      setGameSettings(updatedSettings)

      sendMessage({
        type: WEBSOCKET_EVENTS.UPDATE_SETTINGS,
        data: {
          roomCode: currentRoom.code,
          settings: updatedSettings
        }
      })
    }
  }, [isHost, currentRoom, gameSettings, sendMessage])

  // Kick player (host only)
  const kickPlayer = useCallback((playerId) => {
    if (isHost && currentRoom && sendMessage) {
      sendMessage({
        type: WEBSOCKET_EVENTS.KICK_PLAYER,
        data: {
          roomCode: currentRoom.code,
          playerId
        }
      })
    }
  }, [isHost, currentRoom, sendMessage])

  // Generate unique player ID
  const generatePlayerId = () => {
    return `player_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  }

  // Handle WebSocket events
  useEffect(() => {
    if (!addEventListener) return

    const cleanupFunctions = []

    // Room created successfully
    cleanupFunctions.push(
      addEventListener(WEBSOCKET_EVENTS.ROOM_CREATED, (data) => {
        setCurrentRoom(data.room)
        setPlayers(data.players || [])
      })
    )

    // Room joined successfully
    cleanupFunctions.push(
      addEventListener(WEBSOCKET_EVENTS.ROOM_JOINED, (data) => {
        setCurrentRoom(data.room)
        setPlayers(data.players || [])
        setIsHost(data.isHost || false)
      })
    )

    // Player joined room
    cleanupFunctions.push(
      addEventListener(WEBSOCKET_EVENTS.PLAYER_JOINED, (data) => {
        setPlayers(prev => [...prev, data.player])
      })
    )

    // Player left room
    cleanupFunctions.push(
      addEventListener(WEBSOCKET_EVENTS.PLAYER_LEFT, (data) => {
        setPlayers(prev => prev.filter(p => p.id !== data.playerId))
      })
    )

    // Game started
    cleanupFunctions.push(
      addEventListener(WEBSOCKET_EVENTS.GAME_STARTED, (data) => {
        setRoomState(ROOM_STATES.PLAYING)
      })
    )

    // Game ended
    cleanupFunctions.push(
      addEventListener(WEBSOCKET_EVENTS.GAME_ENDED, (data) => {
        setRoomState(ROOM_STATES.FINISHED)
      })
    )

    // Room settings updated
    cleanupFunctions.push(
      addEventListener(WEBSOCKET_EVENTS.SETTINGS_UPDATED, (data) => {
        setGameSettings(data.settings)
      })
    )

    // Player kicked
    cleanupFunctions.push(
      addEventListener(WEBSOCKET_EVENTS.PLAYER_KICKED, (data) => {
        if (data.kickedPlayerId === data.currentPlayerId) {
          // Current player was kicked
          leaveRoom()
        } else {
          // Another player was kicked
          setPlayers(prev => prev.filter(p => p.id !== data.kickedPlayerId))
        }
      })
    )

    // Room error
    cleanupFunctions.push(
      addEventListener(WEBSOCKET_EVENTS.ROOM_ERROR, (data) => {
        console.error('Room error:', data.error)
        // Handle room errors (room full, not found, etc.)
      })
    )

    return () => {
      cleanupFunctions.forEach(cleanup => cleanup())
    }
  }, [addEventListener, leaveRoom])

  return {
    currentRoom,
    players,
    isHost,
    roomState,
    gameSettings,
    createRoom,
    joinRoom,
    leaveRoom,
    startGame,
    updateGameSettings,
    kickPlayer
  }
}
