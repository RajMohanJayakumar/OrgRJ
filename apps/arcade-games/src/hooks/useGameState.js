/**
 * Game State Management Hook
 * Centralized state management for arcade games
 */

import { useState, useCallback, useRef, useEffect } from 'react'

const useGameState = (initialState = 'menu') => {
  const [gameState, setGameState] = useState(initialState)
  const [isPaused, setIsPaused] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const gameLoopRef = useRef(null)
  const lastUpdateTime = useRef(Date.now())
  
  // Game state constants
  const STATES = {
    MENU: 'menu',
    PLAYING: 'playing',
    PAUSED: 'paused',
    GAME_OVER: 'gameOver',
    VICTORY: 'victory',
    LOADING: 'loading'
  }
  
  // State transition functions
  const startGame = useCallback(() => {
    setGameState(STATES.PLAYING)
    setIsPaused(false)
    setIsLoading(false)
    lastUpdateTime.current = Date.now()
  }, [])
  
  const pauseGame = useCallback(() => {
    if (gameState === STATES.PLAYING) {
      setGameState(STATES.PAUSED)
      setIsPaused(true)
    }
  }, [gameState])
  
  const resumeGame = useCallback(() => {
    if (gameState === STATES.PAUSED) {
      setGameState(STATES.PLAYING)
      setIsPaused(false)
      lastUpdateTime.current = Date.now()
    }
  }, [gameState])
  
  const togglePause = useCallback(() => {
    if (gameState === STATES.PLAYING) {
      pauseGame()
    } else if (gameState === STATES.PAUSED) {
      resumeGame()
    }
  }, [gameState, pauseGame, resumeGame])
  
  const endGame = useCallback((victory = false) => {
    setGameState(victory ? STATES.VICTORY : STATES.GAME_OVER)
    setIsPaused(false)
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current)
      gameLoopRef.current = null
    }
  }, [])
  
  const resetGame = useCallback(() => {
    setGameState(STATES.MENU)
    setIsPaused(false)
    setIsLoading(false)
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current)
      gameLoopRef.current = null
    }
  }, [])
  
  const setLoading = useCallback((loading) => {
    setIsLoading(loading)
    if (loading) {
      setGameState(STATES.LOADING)
    }
  }, [])
  
  // Game loop management
  const startGameLoop = useCallback((callback, interval = 16) => {
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current)
    }
    
    gameLoopRef.current = setInterval(() => {
      if (gameState === STATES.PLAYING && !isPaused) {
        const currentTime = Date.now()
        const deltaTime = currentTime - lastUpdateTime.current
        lastUpdateTime.current = currentTime
        
        callback(deltaTime)
      }
    }, interval)
    
    return gameLoopRef.current
  }, [gameState, isPaused])
  
  const stopGameLoop = useCallback(() => {
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current)
      gameLoopRef.current = null
    }
  }, [])
  
  // Keyboard event handlers
  const handleKeyPress = useCallback((event, keyHandlers = {}) => {
    const { key } = event
    
    // Global pause functionality
    if (key === ' ' || key === 'p' || key === 'P') {
      event.preventDefault()
      togglePause()
      return
    }
    
    // Escape to menu
    if (key === 'Escape') {
      event.preventDefault()
      if (gameState === STATES.PLAYING || gameState === STATES.PAUSED) {
        resetGame()
      }
      return
    }
    
    // Game-specific key handlers
    if (keyHandlers[key] && gameState === STATES.PLAYING) {
      keyHandlers[key](event)
    }
  }, [gameState, togglePause, resetGame])
  
  // State checkers
  const isPlaying = gameState === STATES.PLAYING
  const isInMenu = gameState === STATES.MENU
  const isGameOver = gameState === STATES.GAME_OVER
  const isVictory = gameState === STATES.VICTORY
  const canPlay = isInMenu || isGameOver || isVictory
  const canPause = isPlaying
  const canResume = gameState === STATES.PAUSED
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopGameLoop()
    }
  }, [stopGameLoop])
  
  // Auto-pause when window loses focus
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isPlaying) {
        pauseGame()
      }
    }
    
    const handleBlur = () => {
      if (isPlaying) {
        pauseGame()
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('blur', handleBlur)
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('blur', handleBlur)
    }
  }, [isPlaying, pauseGame])
  
  return {
    // Current state
    gameState,
    isPaused,
    isLoading,
    
    // State constants
    STATES,
    
    // State checkers
    isPlaying,
    isInMenu,
    isGameOver,
    isVictory,
    canPlay,
    canPause,
    canResume,
    
    // State transitions
    startGame,
    pauseGame,
    resumeGame,
    togglePause,
    endGame,
    resetGame,
    setLoading,
    
    // Game loop
    startGameLoop,
    stopGameLoop,
    
    // Event handlers
    handleKeyPress,
    
    // Utilities
    lastUpdateTime: lastUpdateTime.current
  }
}

export default useGameState
