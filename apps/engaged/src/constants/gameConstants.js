/**
 * Game Constants for Ellen Games Module
 * Defines game types, player roles, room states, and other constants
 */

// Game Types
export const GAME_TYPES = {
  QUICK_DRAW: 'quick-draw',
  WORD_ASSOCIATION: 'word-association',
  EMOJI_CHAINS: 'emoji-chains',
  RAPID_FIRE_QA: 'rapid-fire-qa',
  STORY_BUILDING: 'story-building',
  VOTING_POLL: 'voting-poll'
}

// Player Roles
export const PLAYER_ROLES = {
  HOST: 'host',
  PLAYER: 'player',
  SPECTATOR: 'spectator',
  MODERATOR: 'moderator'
}

// Room States
export const ROOM_STATES = {
  WAITING: 'waiting',
  STARTING: 'starting',
  PLAYING: 'playing',
  PAUSED: 'paused',
  FINISHED: 'finished',
  CLOSED: 'closed'
}

// Game States
export const GAME_STATES = {
  LOBBY: 'lobby',
  COUNTDOWN: 'countdown',
  ACTIVE: 'active',
  ROUND_END: 'round_end',
  GAME_END: 'game_end',
  RESULTS: 'results'
}

// Player States
export const PLAYER_STATES = {
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  READY: 'ready',
  NOT_READY: 'not_ready',
  PLAYING: 'playing',
  WAITING: 'waiting',
  ELIMINATED: 'eliminated'
}

// Connection States
export const CONNECTION_STATES = {
  DISCONNECTED: 'disconnected',
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  RECONNECTING: 'reconnecting',
  ERROR: 'error'
}

// Audience Reactions
export const AUDIENCE_REACTIONS = {
  CHEER: 'cheer',
  BOO: 'boo',
  APPLAUSE: 'applause',
  LAUGH: 'laugh',
  GASP: 'gasp',
  AWW: 'aww',
  WOW: 'wow',
  HEART: 'heart',
  FIRE: 'fire',
  THUMBS_UP: 'thumbs_up',
  THUMBS_DOWN: 'thumbs_down'
}

// Game Difficulty Levels
export const DIFFICULTY_LEVELS = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
  EXPERT: 'expert'
}

// Room Limits
export const ROOM_LIMITS = {
  MIN_PLAYERS: {
    [GAME_TYPES.QUICK_DRAW]: 2,
    [GAME_TYPES.WORD_ASSOCIATION]: 3,
    [GAME_TYPES.EMOJI_CHAINS]: 2,
    [GAME_TYPES.RAPID_FIRE_QA]: 2,
    [GAME_TYPES.STORY_BUILDING]: 3,
    [GAME_TYPES.VOTING_POLL]: 5
  },
  MAX_PLAYERS: {
    [GAME_TYPES.QUICK_DRAW]: 8,
    [GAME_TYPES.WORD_ASSOCIATION]: 12,
    [GAME_TYPES.EMOJI_CHAINS]: 10,
    [GAME_TYPES.RAPID_FIRE_QA]: 15,
    [GAME_TYPES.STORY_BUILDING]: 8,
    [GAME_TYPES.VOTING_POLL]: 50
  },
  MAX_SPECTATORS: 100
}

// Game Durations (in seconds)
export const GAME_DURATIONS = {
  [GAME_TYPES.QUICK_DRAW]: 300, // 5 minutes
  [GAME_TYPES.WORD_ASSOCIATION]: 180, // 3 minutes
  [GAME_TYPES.EMOJI_CHAINS]: 240, // 4 minutes
  [GAME_TYPES.RAPID_FIRE_QA]: 120, // 2 minutes
  [GAME_TYPES.STORY_BUILDING]: 480, // 8 minutes
  [GAME_TYPES.VOTING_POLL]: 180 // 3 minutes
}

// Round Durations (in seconds)
export const ROUND_DURATIONS = {
  [GAME_TYPES.QUICK_DRAW]: 60,
  [GAME_TYPES.WORD_ASSOCIATION]: 30,
  [GAME_TYPES.EMOJI_CHAINS]: 45,
  [GAME_TYPES.RAPID_FIRE_QA]: 15,
  [GAME_TYPES.STORY_BUILDING]: 20,
  [GAME_TYPES.VOTING_POLL]: 30
}

// Scoring Systems
export const SCORING = {
  [GAME_TYPES.QUICK_DRAW]: {
    CORRECT_GUESS: 100,
    DRAWING_BONUS: 50,
    SPEED_BONUS: 25,
    FIRST_GUESS: 150
  },
  [GAME_TYPES.WORD_ASSOCIATION]: {
    VALID_WORD: 10,
    CHAIN_BONUS: 5,
    SPEED_BONUS: 3,
    CREATIVITY_BONUS: 15
  },
  [GAME_TYPES.EMOJI_CHAINS]: {
    EMOJI_ADD: 5,
    STORY_VOTE: 20,
    CREATIVITY_BONUS: 30,
    HUMOR_BONUS: 25
  },
  [GAME_TYPES.RAPID_FIRE_QA]: {
    CORRECT_ANSWER: 50,
    SPEED_BONUS: 25,
    STREAK_BONUS: 10,
    PERFECT_ROUND: 100
  },
  [GAME_TYPES.STORY_BUILDING]: {
    WORD_ADD: 5,
    SENTENCE_COMPLETE: 15,
    STORY_VOTE: 25,
    CREATIVITY_BONUS: 40
  },
  [GAME_TYPES.VOTING_POLL]: {
    VOTE_CAST: 5,
    MAJORITY_VOTE: 10,
    UNIQUE_VOTE: 15,
    PARTICIPATION: 20
  }
}

// Error Types
export const ERROR_TYPES = {
  ROOM_NOT_FOUND: 'room_not_found',
  ROOM_FULL: 'room_full',
  INVALID_PLAYER_NAME: 'invalid_player_name',
  GAME_IN_PROGRESS: 'game_in_progress',
  INSUFFICIENT_PLAYERS: 'insufficient_players',
  CONNECTION_LOST: 'connection_lost',
  INVALID_MOVE: 'invalid_move',
  TIMEOUT: 'timeout',
  PERMISSION_DENIED: 'permission_denied'
}

// Special Effects
export const SPECIAL_EFFECTS = {
  CONFETTI: 'confetti',
  FIREWORKS: 'fireworks',
  SPOTLIGHT: 'spotlight',
  RAINBOW: 'rainbow',
  SPARKLES: 'sparkles',
  HEARTS: 'hearts',
  STARS: 'stars'
}

// Sound Effects
export const SOUND_EFFECTS = {
  JOIN: 'join',
  LEAVE: 'leave',
  CORRECT: 'correct',
  WRONG: 'wrong',
  TIMER: 'timer',
  APPLAUSE: 'applause',
  CHEER: 'cheer',
  BOO: 'boo',
  DING: 'ding',
  BUZZ: 'buzz',
  WHOOSH: 'whoosh',
  POP: 'pop'
}

// Chat Message Types
export const CHAT_MESSAGE_TYPES = {
  TEXT: 'text',
  EMOJI: 'emoji',
  REACTION: 'reaction',
  SYSTEM: 'system',
  ANNOUNCEMENT: 'announcement'
}

// Achievement Types
export const ACHIEVEMENT_TYPES = {
  FIRST_WIN: 'first_win',
  STREAK: 'streak',
  PERFECT_GAME: 'perfect_game',
  SPEED_DEMON: 'speed_demon',
  CREATIVE_GENIUS: 'creative_genius',
  SOCIAL_BUTTERFLY: 'social_butterfly',
  COMEBACK_KID: 'comeback_kid',
  CONSISTENT_PLAYER: 'consistent_player'
}

// Default Game Settings
export const DEFAULT_GAME_SETTINGS = {
  [GAME_TYPES.QUICK_DRAW]: {
    rounds: 5,
    drawTime: 60,
    guessTime: 30,
    difficulty: DIFFICULTY_LEVELS.MEDIUM,
    categories: ['animals', 'objects', 'actions', 'food']
  },
  [GAME_TYPES.WORD_ASSOCIATION]: {
    rounds: 3,
    timePerWord: 10,
    chainLength: 20,
    difficulty: DIFFICULTY_LEVELS.MEDIUM,
    allowRepeats: false
  },
  [GAME_TYPES.EMOJI_CHAINS]: {
    rounds: 4,
    emojisPerTurn: 3,
    storyLength: 15,
    votingTime: 30,
    themes: ['adventure', 'comedy', 'romance', 'mystery']
  },
  [GAME_TYPES.RAPID_FIRE_QA]: {
    rounds: 5,
    questionsPerRound: 10,
    timePerQuestion: 15,
    difficulty: DIFFICULTY_LEVELS.MEDIUM,
    categories: ['general', 'pop-culture', 'science', 'history']
  },
  [GAME_TYPES.STORY_BUILDING]: {
    rounds: 3,
    wordsPerTurn: 1,
    timePerTurn: 20,
    storyLength: 50,
    themes: ['funny', 'scary', 'romantic', 'adventure']
  },
  [GAME_TYPES.VOTING_POLL]: {
    rounds: 10,
    timePerPoll: 30,
    showResults: true,
    allowSkip: true,
    categories: ['would-you-rather', 'favorites', 'opinions', 'fun-facts']
  }
}
