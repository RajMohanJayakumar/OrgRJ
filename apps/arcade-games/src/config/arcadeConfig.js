/**
 * Arcade Games Configuration
 * Central configuration for all arcade games
 */

export const ARCADE_CONFIG = {
  // Module settings
  MODULE_NAME: 'Arcade Games',
  MODULE_VERSION: '1.0.0',
  
  // Route configuration
  ROUTES: {
    MAIN: '/arcade',
    QUERY_PARAM: '?mode=arcade'
  },
  
  // Game settings
  GAMES: {
    SNAKE: {
      id: 'snake',
      name: 'Snake',
      icon: '🐍',
      description: 'Classic snake game - eat food and grow longer!',
      color: 'from-green-500 to-emerald-600',
      storageKey: 'snakeGameHighScore',
      controls: ['Arrow Keys', 'WASD'],
      difficulty: 'Progressive'
    },
    TETRIS: {
      id: 'tetris',
      name: 'Tetris',
      icon: '🧩',
      description: 'Stack falling blocks to clear lines and score points!',
      color: 'from-purple-500 to-blue-600',
      storageKey: 'tetrisGameHighScore',
      controls: ['Arrow Keys', 'Space', 'P'],
      difficulty: 'Progressive'
    },
    PONG: {
      id: 'pong',
      name: 'Pong',
      icon: '🏓',
      description: 'Classic paddle game - first to 5 points wins!',
      color: 'from-blue-500 to-cyan-600',
      storageKey: 'pongGameHighScore',
      controls: ['Arrow Keys', 'WS', 'Space'],
      difficulty: 'Selectable'
    },
    SPACE_SHOOTER: {
      id: 'space-shooter',
      name: 'Space Shooter',
      icon: '🚀',
      description: 'Defend Earth from alien invaders!',
      color: 'from-purple-500 to-pink-600',
      storageKey: 'spaceShooterHighScore',
      controls: ['Arrow Keys', 'AD', 'Space'],
      difficulty: 'Wave-based'
    },

    // Stress-Busting Games
    BUBBLE_POP: {
      id: 'bubble-pop',
      name: 'Bubble Pop',
      icon: '🫧',
      description: 'Pop colorful bubbles for stress relief and relaxation!',
      color: 'from-pink-500 to-purple-600',
      storageKey: 'bubblePopHighScore',
      controls: ['Mouse Click', 'Touch'],
      difficulty: 'Relaxing',
      category: 'stress-relief'
    },
    ZEN_GARDEN: {
      id: 'zen-garden',
      name: 'Zen Garden',
      icon: '🏯',
      description: 'Create beautiful sand patterns for meditation!',
      color: 'from-amber-500 to-orange-600',
      storageKey: 'zenGardenScore',
      controls: ['Mouse Drag', 'Touch Drag'],
      difficulty: 'Meditative',
      category: 'stress-relief'
    },
    COLOR_MATCH: {
      id: 'color-match',
      name: 'Color Match',
      icon: '🎨',
      description: 'Match colors for therapeutic relaxation!',
      color: 'from-violet-500 to-fuchsia-600',
      storageKey: 'colorMatchHighScore',
      controls: ['RGB Sliders'],
      difficulty: 'Therapeutic',
      category: 'stress-relief'
    },
    RHYTHM_TAP: {
      id: 'rhythm-tap',
      name: 'Rhythm Tap',
      icon: '🎵',
      description: 'Tap to the rhythm for flow state and stress relief!',
      color: 'from-indigo-500 to-pink-600',
      storageKey: 'rhythmTapHighScore',
      controls: ['Number Keys', 'Touch Zones'],
      difficulty: 'Rhythmic',
      category: 'stress-relief'
    }
  },
  
  // Visual settings
  THEME: {
    PRIMARY_GRADIENT: 'from-indigo-900 via-purple-900 to-pink-900',
    ACCENT_COLORS: {
      YELLOW: '#fbbf24',
      PINK: '#ec4899',
      PURPLE: '#8b5cf6',
      CYAN: '#06b6d4'
    },
    ANIMATIONS: {
      PARTICLE_COUNT: 20,
      TWINKLE_DURATION: '2-5s',
      HOVER_SCALE: 1.02,
      TAP_SCALE: 0.98
    }
  },
  
  // Audio settings
  AUDIO: {
    ENABLED_BY_DEFAULT: true,
    VOLUME: 0.1,
    SOUND_TYPES: {
      SHOOT: 'shoot',
      HIT: 'hit',
      EXPLOSION: 'explosion',
      PADDLE: 'paddle',
      WALL: 'wall',
      SCORE: 'score',
      EAT: 'eat',
      DROP: 'drop',
      LINE: 'line',
      GAME_OVER: 'gameOver'
    }
  },
  
  // Performance settings
  PERFORMANCE: {
    TARGET_FPS: 60,
    GAME_LOOP_INTERVAL: 16, // ~60fps
    PARTICLE_CLEANUP_DELAY: 1000,
    SOUND_CLEANUP_DELAY: 500
  },
  
  // Storage settings
  STORAGE: {
    PREFIX: 'arcade_',
    HIGH_SCORE_SUFFIX: 'HighScore',
    SETTINGS_KEY: 'arcade_settings'
  },
  
  // Feature flags
  FEATURES: {
    SOUND_ENABLED: true,
    HIGH_SCORES: true,
    PARTICLE_EFFECTS: true,
    MOBILE_CONTROLS: true,
    KEYBOARD_SHORTCUTS: true,
    PAUSE_FUNCTIONALITY: true
  }
}

// Game-specific configurations
export const GAME_CONFIGS = {
  SNAKE: {
    BOARD_SIZE: 20,
    CELL_SIZE: 20,
    INITIAL_SPEED: 150,
    SPEED_INCREMENT: 2,
    MIN_SPEED: 80,
    SCORE_PER_FOOD: 10
  },
  
  TETRIS: {
    BOARD_WIDTH: 10,
    BOARD_HEIGHT: 20,
    INITIAL_DROP_TIME: 1000,
    LEVEL_SPEED_DECREASE: 50,
    MIN_DROP_TIME: 50,
    POINTS_PER_LINE: 100
  },
  
  PONG: {
    CANVAS_WIDTH: 800,
    CANVAS_HEIGHT: 400,
    PADDLE_WIDTH: 10,
    PADDLE_HEIGHT: 80,
    BALL_SIZE: 10,
    PADDLE_SPEED: 6,
    WINNING_SCORE: 5,
    DIFFICULTY_SETTINGS: {
      easy: { aiSpeed: 3, ballSpeedMultiplier: 0.8 },
      medium: { aiSpeed: 4, ballSpeedMultiplier: 1 },
      hard: { aiSpeed: 5.5, ballSpeedMultiplier: 1.2 }
    }
  },
  
  SPACE_SHOOTER: {
    CANVAS_WIDTH: 800,
    CANVAS_HEIGHT: 600,
    PLAYER_SIZE: 40,
    BULLET_SIZE: 4,
    ENEMY_SIZE: 30,
    PLAYER_SPEED: 8,
    BULLET_SPEED: 10,
    ENEMY_SPEED: 2,
    INITIAL_LIVES: 3,
    SCORE_PER_ENEMY: 100
  }
}

export default ARCADE_CONFIG
