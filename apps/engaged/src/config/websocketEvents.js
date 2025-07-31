/**
 * WebSocket Events Configuration
 * Defines all event types for real-time communication
 */

export const WEBSOCKET_EVENTS = {
  // Connection Events
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  HEARTBEAT: 'heartbeat',
  ERROR: 'error',

  // Room Management Events
  CREATE_ROOM: 'create_room',
  JOIN_ROOM: 'join_room',
  LEAVE_ROOM: 'leave_room',
  ROOM_CREATED: 'room_created',
  ROOM_JOINED: 'room_joined',
  ROOM_LEFT: 'room_left',
  ROOM_ERROR: 'room_error',
  ROOM_FULL: 'room_full',
  ROOM_NOT_FOUND: 'room_not_found',

  // Player Management Events
  PLAYER_JOINED: 'player_joined',
  PLAYER_LEFT: 'player_left',
  PLAYER_KICKED: 'player_kicked',
  PLAYER_UPDATE: 'player_update',
  PLAYER_READY: 'player_ready',
  PLAYER_NOT_READY: 'player_not_ready',

  // Game State Events
  START_GAME: 'start_game',
  END_GAME: 'end_game',
  PAUSE_GAME: 'pause_game',
  RESUME_GAME: 'resume_game',
  GAME_STARTED: 'game_started',
  GAME_ENDED: 'game_ended',
  GAME_PAUSED: 'game_paused',
  GAME_RESUMED: 'game_resumed',
  GAME_UPDATE: 'game_update',

  // Settings Events
  UPDATE_SETTINGS: 'update_settings',
  SETTINGS_UPDATED: 'settings_updated',

  // Quick Draw Game Events
  QUICK_DRAW_START: 'quick_draw_start',
  QUICK_DRAW_STROKE: 'quick_draw_stroke',
  QUICK_DRAW_GUESS: 'quick_draw_guess',
  QUICK_DRAW_CORRECT: 'quick_draw_correct',
  QUICK_DRAW_TIME_UP: 'quick_draw_time_up',
  QUICK_DRAW_ROUND_END: 'quick_draw_round_end',

  // Word Association Game Events
  WORD_ASSOCIATION_START: 'word_association_start',
  WORD_ASSOCIATION_WORD: 'word_association_word',
  WORD_ASSOCIATION_INVALID: 'word_association_invalid',
  WORD_ASSOCIATION_TIMEOUT: 'word_association_timeout',
  WORD_ASSOCIATION_CHAIN_BREAK: 'word_association_chain_break',

  // Emoji Chains Game Events
  EMOJI_CHAINS_START: 'emoji_chains_start',
  EMOJI_CHAINS_ADD: 'emoji_chains_add',
  EMOJI_CHAINS_STORY: 'emoji_chains_story',
  EMOJI_CHAINS_VOTE: 'emoji_chains_vote',
  EMOJI_CHAINS_WINNER: 'emoji_chains_winner',

  // Rapid Fire Q&A Events
  RAPID_QA_START: 'rapid_qa_start',
  RAPID_QA_QUESTION: 'rapid_qa_question',
  RAPID_QA_ANSWER: 'rapid_qa_answer',
  RAPID_QA_CORRECT: 'rapid_qa_correct',
  RAPID_QA_WRONG: 'rapid_qa_wrong',
  RAPID_QA_TIMEOUT: 'rapid_qa_timeout',

  // Story Building Game Events
  STORY_BUILDING_START: 'story_building_start',
  STORY_BUILDING_WORD: 'story_building_word',
  STORY_BUILDING_SENTENCE: 'story_building_sentence',
  STORY_BUILDING_COMPLETE: 'story_building_complete',
  STORY_BUILDING_READ: 'story_building_read',

  // Voting Poll Events
  VOTING_POLL_START: 'voting_poll_start',
  VOTING_POLL_QUESTION: 'voting_poll_question',
  VOTING_POLL_VOTE: 'voting_poll_vote',
  VOTING_POLL_RESULTS: 'voting_poll_results',
  VOTING_POLL_NEXT: 'voting_poll_next',

  // Chat Events
  CHAT_MESSAGE: 'chat_message',
  CHAT_EMOJI: 'chat_emoji',
  CHAT_REACTION: 'chat_reaction',

  // Audience Interaction Events
  AUDIENCE_CHEER: 'audience_cheer',
  AUDIENCE_BOO: 'audience_boo',
  AUDIENCE_APPLAUSE: 'audience_applause',
  AUDIENCE_LAUGH: 'audience_laugh',
  AUDIENCE_REACTION: 'audience_reaction',

  // Scoring Events
  SCORE_UPDATE: 'score_update',
  LEADERBOARD_UPDATE: 'leaderboard_update',
  ACHIEVEMENT_UNLOCKED: 'achievement_unlocked',

  // Special Effects Events
  CONFETTI: 'confetti',
  FIREWORKS: 'fireworks',
  SPOTLIGHT: 'spotlight',
  SOUND_EFFECT: 'sound_effect'
}

// Event categories for easier management
export const EVENT_CATEGORIES = {
  CONNECTION: [
    WEBSOCKET_EVENTS.CONNECT,
    WEBSOCKET_EVENTS.DISCONNECT,
    WEBSOCKET_EVENTS.HEARTBEAT,
    WEBSOCKET_EVENTS.ERROR
  ],
  
  ROOM: [
    WEBSOCKET_EVENTS.CREATE_ROOM,
    WEBSOCKET_EVENTS.JOIN_ROOM,
    WEBSOCKET_EVENTS.LEAVE_ROOM,
    WEBSOCKET_EVENTS.ROOM_CREATED,
    WEBSOCKET_EVENTS.ROOM_JOINED,
    WEBSOCKET_EVENTS.ROOM_LEFT,
    WEBSOCKET_EVENTS.ROOM_ERROR
  ],
  
  PLAYER: [
    WEBSOCKET_EVENTS.PLAYER_JOINED,
    WEBSOCKET_EVENTS.PLAYER_LEFT,
    WEBSOCKET_EVENTS.PLAYER_KICKED,
    WEBSOCKET_EVENTS.PLAYER_UPDATE,
    WEBSOCKET_EVENTS.PLAYER_READY
  ],
  
  GAME: [
    WEBSOCKET_EVENTS.START_GAME,
    WEBSOCKET_EVENTS.END_GAME,
    WEBSOCKET_EVENTS.PAUSE_GAME,
    WEBSOCKET_EVENTS.RESUME_GAME,
    WEBSOCKET_EVENTS.GAME_UPDATE
  ],
  
  CHAT: [
    WEBSOCKET_EVENTS.CHAT_MESSAGE,
    WEBSOCKET_EVENTS.CHAT_EMOJI,
    WEBSOCKET_EVENTS.CHAT_REACTION
  ],
  
  AUDIENCE: [
    WEBSOCKET_EVENTS.AUDIENCE_CHEER,
    WEBSOCKET_EVENTS.AUDIENCE_BOO,
    WEBSOCKET_EVENTS.AUDIENCE_APPLAUSE,
    WEBSOCKET_EVENTS.AUDIENCE_LAUGH
  ]
}

// Message structure templates
export const MESSAGE_TEMPLATES = {
  ROOM_MESSAGE: {
    type: '',
    data: {
      roomCode: '',
      timestamp: 0,
      payload: {}
    }
  },
  
  PLAYER_MESSAGE: {
    type: '',
    data: {
      playerId: '',
      playerName: '',
      roomCode: '',
      timestamp: 0,
      payload: {}
    }
  },
  
  GAME_MESSAGE: {
    type: '',
    data: {
      gameId: '',
      roomCode: '',
      round: 0,
      timestamp: 0,
      payload: {}
    }
  }
}
