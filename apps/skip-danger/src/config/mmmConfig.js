/**
 * MMM Fingers Game Configuration
 * Central configuration for the Multi-Modal Memory finger training game
 */

export const MMM_CONFIG = {
  // Module metadata
  MODULE: {
    NAME: 'MMM Fingers',
    VERSION: '1.0.0',
    DESCRIPTION: 'Multi-Modal Memory finger training game',
    AUTHOR: 'FinClamp Development Team'
  },
  
  // Game modes
  MODES: {
    CLASSIC: {
      id: 'classic',
      name: 'Classic Mode',
      icon: '🎯',
      description: 'Traditional finger memory training with visual patterns',
      color: 'from-blue-500 to-indigo-600',
      storageKey: 'mmmClassicHighScore',
      difficulty: 'Progressive',
      features: ['Visual patterns', 'Progressive difficulty', 'Memory training']
    },
    SPEED: {
      id: 'speed',
      name: 'Speed Mode',
      icon: '⚡',
      description: 'Fast-paced finger memory challenges with time pressure',
      color: 'from-yellow-500 to-orange-600',
      storageKey: 'mmmSpeedHighScore',
      difficulty: 'Time-based',
      features: ['Time pressure', 'Quick reactions', 'Speed training']
    },
    MEMORY: {
      id: 'memory',
      name: 'Memory Mode',
      icon: '🧠',
      description: 'Complex memory patterns with multiple modalities',
      color: 'from-purple-500 to-pink-600',
      storageKey: 'mmmMemoryHighScore',
      difficulty: 'Complex',
      features: ['Multi-modal', 'Complex patterns', 'Memory enhancement']
    },
    CHALLENGE: {
      id: 'challenge',
      name: 'Challenge Mode',
      icon: '🏆',
      description: 'Ultimate finger memory test with all modalities',
      color: 'from-red-500 to-rose-600',
      storageKey: 'mmmChallengeHighScore',
      difficulty: 'Expert',
      features: ['All modalities', 'Expert level', 'Ultimate challenge']
    }
  },
  
  // Visual settings
  THEME: {
    PRIMARY_GRADIENT: 'from-indigo-900 via-blue-900 to-purple-900',
    ACCENT_COLORS: {
      FINGER_1: '#3b82f6', // Blue
      FINGER_2: '#10b981', // Green
      FINGER_3: '#f59e0b', // Yellow
      FINGER_4: '#ef4444', // Red
      FINGER_5: '#8b5cf6', // Purple
      THUMB: '#06b6d4',    // Cyan
      SUCCESS: '#10b981',
      ERROR: '#ef4444',
      NEUTRAL: '#6b7280'
    },
    ANIMATIONS: {
      FINGER_HIGHLIGHT_DURATION: 800,
      PATTERN_DISPLAY_DURATION: 1500,
      FEEDBACK_DURATION: 500,
      HOVER_SCALE: 1.05,
      TAP_SCALE: 0.95
    }
  },
  
  // Audio settings
  AUDIO: {
    ENABLED_BY_DEFAULT: true,
    VOLUME: 0.3,
    SOUND_TYPES: {
      FINGER_TAP: 'fingerTap',
      PATTERN_START: 'patternStart',
      PATTERN_COMPLETE: 'patternComplete',
      SUCCESS: 'success',
      ERROR: 'error',
      LEVEL_UP: 'levelUp',
      GAME_OVER: 'gameOver',
      BACKGROUND: 'background'
    }
  },
  
  // Performance settings
  PERFORMANCE: {
    TARGET_FPS: 60,
    ANIMATION_FRAME_RATE: 16, // ~60fps
    PATTERN_CLEANUP_DELAY: 1000,
    SOUND_CLEANUP_DELAY: 500,
    MAX_PATTERN_LENGTH: 20,
    MIN_PATTERN_LENGTH: 3
  },
  
  // Accessibility settings
  ACCESSIBILITY: {
    HIGH_CONTRAST_MODE: false,
    REDUCED_MOTION: false,
    SCREEN_READER_SUPPORT: true,
    KEYBOARD_NAVIGATION: true,
    FOCUS_INDICATORS: true,
    COLOR_BLIND_SUPPORT: true
  },
  
  // Mobile settings
  MOBILE: {
    TOUCH_FEEDBACK: true,
    HAPTIC_FEEDBACK: true,
    GESTURE_SUPPORT: true,
    RESPONSIVE_SCALING: true,
    ORIENTATION_LOCK: false
  }
}

// Game-specific configurations
export const GAME_CONFIGS = {
  CLASSIC: {
    INITIAL_PATTERN_LENGTH: 3,
    MAX_PATTERN_LENGTH: 12,
    PATTERN_INCREMENT: 1,
    DISPLAY_TIME_BASE: 1500, // ms per pattern element
    DISPLAY_TIME_MIN: 800,
    RESPONSE_TIME_LIMIT: 10000, // 10 seconds
    LIVES: 3,
    SCORE_MULTIPLIER: 10
  },
  
  SPEED: {
    INITIAL_PATTERN_LENGTH: 3,
    MAX_PATTERN_LENGTH: 8,
    PATTERN_INCREMENT: 1,
    DISPLAY_TIME_BASE: 800, // Faster display
    DISPLAY_TIME_MIN: 400,
    RESPONSE_TIME_LIMIT: 5000, // 5 seconds
    LIVES: 5,
    SCORE_MULTIPLIER: 20,
    TIME_BONUS: true
  },
  
  MEMORY: {
    INITIAL_PATTERN_LENGTH: 4,
    MAX_PATTERN_LENGTH: 15,
    PATTERN_INCREMENT: 1,
    DISPLAY_TIME_BASE: 2000, // Slower for complexity
    DISPLAY_TIME_MIN: 1000,
    RESPONSE_TIME_LIMIT: 15000, // 15 seconds
    LIVES: 2,
    SCORE_MULTIPLIER: 30,
    MULTI_MODAL: true,
    INCLUDE_COLORS: true,
    INCLUDE_SOUNDS: true
  },
  
  CHALLENGE: {
    INITIAL_PATTERN_LENGTH: 5,
    MAX_PATTERN_LENGTH: 20,
    PATTERN_INCREMENT: 2,
    DISPLAY_TIME_BASE: 1200,
    DISPLAY_TIME_MIN: 600,
    RESPONSE_TIME_LIMIT: 8000, // 8 seconds
    LIVES: 1,
    SCORE_MULTIPLIER: 50,
    MULTI_MODAL: true,
    INCLUDE_COLORS: true,
    INCLUDE_SOUNDS: true,
    INCLUDE_VIBRATION: true,
    RANDOM_TIMING: true
  }
}

// Finger mapping for the game
export const FINGER_MAP = {
  LEFT_HAND: {
    THUMB: { id: 'left-thumb', name: 'Left Thumb', position: 0 },
    INDEX: { id: 'left-index', name: 'Left Index', position: 1 },
    MIDDLE: { id: 'left-middle', name: 'Left Middle', position: 2 },
    RING: { id: 'left-ring', name: 'Left Ring', position: 3 },
    PINKY: { id: 'left-pinky', name: 'Left Pinky', position: 4 }
  },
  RIGHT_HAND: {
    THUMB: { id: 'right-thumb', name: 'Right Thumb', position: 5 },
    INDEX: { id: 'right-index', name: 'Right Index', position: 6 },
    MIDDLE: { id: 'right-middle', name: 'Right Middle', position: 7 },
    RING: { id: 'right-ring', name: 'Right Ring', position: 8 },
    PINKY: { id: 'right-pinky', name: 'Right Pinky', position: 9 }
  }
}

// Get all fingers as array
export const getAllFingers = () => {
  return [
    ...Object.values(FINGER_MAP.LEFT_HAND),
    ...Object.values(FINGER_MAP.RIGHT_HAND)
  ]
}
