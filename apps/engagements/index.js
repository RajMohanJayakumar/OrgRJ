/**
 * Ellen Games Module - Interactive Multiplayer Games
 * 
 * A standalone module for Ellen-style interactive games with WebSocket connectivity.
 * Features real-time multiplayer interactions, audience participation, and social gaming.
 * 
 * @version 1.0.0
 * @author FinClamp Team
 */

// Main Components
export { default as EllenGamesModule } from './components/EllenGamesModule'

// Game Components
export { default as QuickDrawGame } from './games/QuickDrawGame'
export { default as WordAssociationGame } from './games/WordAssociationGame'
export { default as EmojiChainsGame } from './games/EmojiChainsGame'
export { default as RapidFireQAGame } from './games/RapidFireQAGame'
export { default as StoryBuildingGame } from './games/StoryBuildingGame'
export { default as VotingPollGame } from './games/VotingPollGame'

// Hooks
export { default as useWebSocket } from './hooks/useWebSocket'
export { default as useGameRoom } from './hooks/useGameRoom'
export { default as usePlayerState } from './hooks/usePlayerState'
export { default as useEllenGameState } from './hooks/useEllenGameState'
export { default as useAudienceInteraction } from './hooks/useAudienceInteraction'

// Utilities
export { default as WebSocketManager } from './utils/WebSocketManager'
export { default as GameRoomManager } from './utils/GameRoomManager'
export { default as PlayerManager } from './utils/PlayerManager'

// Configuration
export { ELLEN_GAME_CONFIGS } from './config/ellenGameConfig'
export { WEBSOCKET_EVENTS } from './config/websocketEvents'

// Types and Constants
export { GAME_TYPES, PLAYER_ROLES, ROOM_STATES } from './constants/gameConstants'
