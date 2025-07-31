/**
 * Arcade Games Module - Entry Point
 * 
 * This is a completely decoupled arcade games module that can be easily
 * removed from the codebase without affecting any other functionality.
 * 
 * To remove this module:
 * 1. Delete the entire /src/modules/arcade-games/ directory
 * 2. Remove the import and route check from App.jsx
 * 3. Remove arcade route configurations from deployment files
 */

// Main arcade games component
export { default as ArcadeGamesModule } from './components/ArcadeGamesModule'

// Individual game components (for potential standalone use)
// Classic Games
export { default as SnakeGame } from './games/SnakeGame'
export { default as TetrisGame } from './games/TetrisGame'
export { default as PongGame } from './games/PongGame'
export { default as SpaceShooter } from './games/SpaceShooter'

// Stress-Busting Games
export { default as BubblePopGame } from './games/BubblePopGame'
export { default as ZenGardenGame } from './games/ZenGardenGame'
export { default as ColorMatchGame } from './games/ColorMatchGame'
export { default as RhythmTapGame } from './games/RhythmTapGame'

// Utilities and hooks
export { default as useArcadeSound } from './hooks/useArcadeSound'
export { default as useGameState } from './hooks/useGameState'
export { default as useHighScore } from './hooks/useHighScore'
export { default as useMobileControls } from './hooks/useMobileControls.jsx'

// Constants and configuration
export { ARCADE_CONFIG } from './config/arcadeConfig'
export { GAME_ROUTES } from './config/routes'

// Route detection utility
export { detectArcadeRoute } from './utils/routeDetection'

/**
 * Module Information
 */
export const ARCADE_MODULE_INFO = {
  name: 'Arcade Games Module',
  version: '1.0.0',
  description: 'Self-contained arcade games module for FinClamp',
  author: 'FinClamp Development Team',
  dependencies: ['react', 'framer-motion'],
  routes: ['/arcade', '/?mode=arcade'],
  removable: true,
  standalone: true
}
