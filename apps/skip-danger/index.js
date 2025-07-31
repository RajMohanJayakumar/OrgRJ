/**
 * MMM Fingers Game Module - Main Exports
 * Multi-Modal Memory finger training game
 * 
 * This module provides a standalone finger memory game that can be easily
 * integrated or removed from the main application.
 */

// Route detection and configuration
export { detectMMMRoute, generateMMMURLs } from './utils/routeDetection'
export { MMM_ROUTES } from './config/routes'
export { MMM_CONFIG } from './config/mmmConfig'

// Main MMM fingers game component
export { default as MMMFingersModule } from './components/MMMFingersModule'

// Individual game components (for potential standalone use)
export { default as MMMFingersGame } from './games/MMMFingersGame'

// Utilities and hooks
export { default as useMMMGameState } from './hooks/useMMMGameState'
export { default as useMMMSound } from './hooks/useMMMSound'
export { default as useMMMHighScore } from './hooks/useMMMHighScore'
export { default as useMMMTouchControls } from './hooks/useMMMTouchControls.jsx'

/**
 * Module Information
 */
export const MMM_MODULE_INFO = {
  name: 'MMM Fingers Game Module',
  version: '1.0.0',
  description: 'Multi-Modal Memory finger training game for FinClamp',
  author: 'FinClamp Development Team',
  dependencies: ['react', 'framer-motion'],
  routes: ['/mmm-fingers', '/?mode=mmm-fingers'],
  removable: true,
  standalone: true,
  gameType: 'memory-training',
  features: [
    'Multi-modal memory training',
    'Progressive difficulty',
    'Mobile-responsive touch controls',
    'Sound feedback',
    'High score tracking',
    'Accessibility support'
  ]
}
