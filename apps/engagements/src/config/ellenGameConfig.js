/**
 * Ellen Games Configuration
 * Game settings, rules, and configurations for all Ellen-style games
 */

import { GAME_TYPES, DIFFICULTY_LEVELS } from '../constants/gameConstants'

export const ELLEN_GAME_CONFIGS = {
  [GAME_TYPES.QUICK_DRAW]: {
    name: 'Quick Draw',
    description: 'Draw and guess in real-time with other players',
    minPlayers: 2,
    maxPlayers: 8,
    defaultRounds: 5,
    roundDuration: 60, // seconds
    guessingTime: 30,
    categories: [
      'Animals', 'Food', 'Objects', 'Actions', 'Movies', 'Books', 
      'Places', 'Sports', 'Professions', 'Emotions'
    ],
    difficulty: {
      [DIFFICULTY_LEVELS.EASY]: {
        drawTime: 90,
        words: ['cat', 'house', 'car', 'tree', 'sun']
      },
      [DIFFICULTY_LEVELS.MEDIUM]: {
        drawTime: 60,
        words: ['elephant', 'bicycle', 'guitar', 'rainbow', 'castle']
      },
      [DIFFICULTY_LEVELS.HARD]: {
        drawTime: 45,
        words: ['democracy', 'philosophy', 'metamorphosis', 'serendipity']
      }
    },
    scoring: {
      correctGuess: 100,
      drawingBonus: 50,
      speedBonus: 25,
      firstGuess: 150
    }
  },

  [GAME_TYPES.WORD_ASSOCIATION]: {
    name: 'Word Association',
    description: 'Connect words in a chain with lightning speed',
    minPlayers: 3,
    maxPlayers: 12,
    defaultRounds: 3,
    timePerWord: 10,
    chainLength: 20,
    categories: [
      'General', 'Animals', 'Food', 'Technology', 'Nature', 
      'Entertainment', 'Sports', 'Travel'
    ],
    difficulty: {
      [DIFFICULTY_LEVELS.EASY]: {
        timePerWord: 15,
        allowRepeats: true
      },
      [DIFFICULTY_LEVELS.MEDIUM]: {
        timePerWord: 10,
        allowRepeats: false
      },
      [DIFFICULTY_LEVELS.HARD]: {
        timePerWord: 7,
        allowRepeats: false,
        themeRequired: true
      }
    },
    scoring: {
      validWord: 10,
      chainBonus: 5,
      speedBonus: 3,
      creativityBonus: 15
    }
  },

  [GAME_TYPES.EMOJI_CHAINS]: {
    name: 'Emoji Chains',
    description: 'Tell stories using only emojis',
    minPlayers: 2,
    maxPlayers: 10,
    defaultRounds: 4,
    emojisPerTurn: 3,
    storyLength: 15,
    votingTime: 30,
    themes: [
      'Adventure', 'Comedy', 'Romance', 'Mystery', 'Horror', 
      'Sci-Fi', 'Fantasy', 'Drama'
    ],
    scoring: {
      emojiAdd: 5,
      storyVote: 20,
      creativityBonus: 30,
      humorBonus: 25
    }
  },

  [GAME_TYPES.RAPID_FIRE_QA]: {
    name: 'Rapid Fire Q&A',
    description: 'Quick questions, quicker answers!',
    minPlayers: 2,
    maxPlayers: 15,
    defaultRounds: 5,
    questionsPerRound: 10,
    timePerQuestion: 15,
    categories: [
      'General Knowledge', 'Pop Culture', 'Science', 'History', 
      'Geography', 'Sports', 'Movies', 'Music'
    ],
    difficulty: {
      [DIFFICULTY_LEVELS.EASY]: {
        timePerQuestion: 20,
        questionsPerRound: 8
      },
      [DIFFICULTY_LEVELS.MEDIUM]: {
        timePerQuestion: 15,
        questionsPerRound: 10
      },
      [DIFFICULTY_LEVELS.HARD]: {
        timePerQuestion: 10,
        questionsPerRound: 12
      }
    },
    scoring: {
      correctAnswer: 50,
      speedBonus: 25,
      streakBonus: 10,
      perfectRound: 100
    }
  },

  [GAME_TYPES.STORY_BUILDING]: {
    name: 'Story Building',
    description: 'Build hilarious stories together, one word at a time',
    minPlayers: 3,
    maxPlayers: 8,
    defaultRounds: 3,
    wordsPerTurn: 1,
    timePerTurn: 20,
    storyLength: 50,
    themes: [
      'Funny', 'Scary', 'Romantic', 'Adventure', 'Mystery', 
      'Sci-Fi', 'Fantasy', 'Absurd'
    ],
    scoring: {
      wordAdd: 5,
      sentenceComplete: 15,
      storyVote: 25,
      creativityBonus: 40
    }
  },

  [GAME_TYPES.VOTING_POLL]: {
    name: 'Live Polls',
    description: 'Vote on fun questions and see results instantly',
    minPlayers: 5,
    maxPlayers: 50,
    defaultRounds: 10,
    timePerPoll: 30,
    showResults: true,
    allowSkip: true,
    categories: [
      'Would You Rather', 'Favorites', 'Opinions', 'Fun Facts', 
      'Hypothetical', 'Personal', 'Pop Culture', 'Random'
    ],
    pollTypes: [
      'multiple_choice',
      'yes_no',
      'rating_scale',
      'ranking',
      'open_ended'
    ],
    scoring: {
      voteCast: 5,
      majorityVote: 10,
      uniqueVote: 15,
      participation: 20
    }
  }
}

// Common game settings
export const COMMON_SETTINGS = {
  maxSpectators: 100,
  heartbeatInterval: 30000, // 30 seconds
  reconnectAttempts: 5,
  reconnectDelay: 3000, // 3 seconds
  messageTimeout: 10000, // 10 seconds
  roomCodeLength: 6,
  playerNameMaxLength: 20,
  chatMessageMaxLength: 200
}

// WebSocket configuration
export const WEBSOCKET_CONFIG = {
  development: {
    url: 'ws://localhost:8080',
    protocols: ['ellen-games-v1']
  },
  production: {
    url: 'wss://your-production-websocket-url.com',
    protocols: ['ellen-games-v1']
  }
}

// Achievement definitions
export const ACHIEVEMENTS = {
  FIRST_WIN: {
    id: 'first_win',
    name: 'First Victory',
    description: 'Win your first game',
    icon: '🏆',
    points: 100
  },
  SPEED_DEMON: {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Answer 5 questions in under 30 seconds',
    icon: '⚡',
    points: 150
  },
  CREATIVE_GENIUS: {
    id: 'creative_genius',
    name: 'Creative Genius',
    description: 'Get voted most creative 3 times',
    icon: '🎨',
    points: 200
  },
  SOCIAL_BUTTERFLY: {
    id: 'social_butterfly',
    name: 'Social Butterfly',
    description: 'Play with 20 different players',
    icon: '🦋',
    points: 250
  }
}

// Sound effects mapping
export const SOUND_EFFECTS = {
  JOIN: '/sounds/join.mp3',
  LEAVE: '/sounds/leave.mp3',
  CORRECT: '/sounds/correct.mp3',
  WRONG: '/sounds/wrong.mp3',
  TIMER: '/sounds/timer.mp3',
  APPLAUSE: '/sounds/applause.mp3',
  CHEER: '/sounds/cheer.mp3',
  BOO: '/sounds/boo.mp3'
}
