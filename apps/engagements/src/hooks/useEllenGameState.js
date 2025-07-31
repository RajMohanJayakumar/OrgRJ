import { useState, useCallback } from 'react'
import { GAME_STATES } from '../constants/gameConstants'

/**
 * Ellen Game State Hook
 * Manages game state transitions and game flow
 */
export default function useEllenGameState(initialState = GAME_STATES.LOBBY) {
  const [gameState, setGameState] = useState(initialState)
  const [round, setRound] = useState(1)
  const [maxRounds, setMaxRounds] = useState(5)
  const [timeLeft, setTimeLeft] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  // Start game
  const startGame = useCallback(() => {
    setGameState(GAME_STATES.COUNTDOWN)
    setRound(1)
    setIsPaused(false)
  }, [])

  // End game
  const endGame = useCallback(() => {
    setGameState(GAME_STATES.RESULTS)
    setIsPaused(false)
  }, [])

  // Pause game
  const pauseGame = useCallback(() => {
    setIsPaused(true)
  }, [])

  // Resume game
  const resumeGame = useCallback(() => {
    setIsPaused(false)
  }, [])

  // Next round
  const nextRound = useCallback(() => {
    if (round < maxRounds) {
      setRound(prev => prev + 1)
      setGameState(GAME_STATES.ACTIVE)
    } else {
      endGame()
    }
  }, [round, maxRounds, endGame])

  // Reset game
  const resetGame = useCallback(() => {
    setGameState(GAME_STATES.LOBBY)
    setRound(1)
    setTimeLeft(0)
    setIsPaused(false)
  }, [])

  // Set timer
  const setTimer = useCallback((seconds) => {
    setTimeLeft(seconds)
  }, [])

  return {
    gameState,
    round,
    maxRounds,
    timeLeft,
    isPaused,
    setGameState,
    setMaxRounds,
    setTimer,
    startGame,
    endGame,
    pauseGame,
    resumeGame,
    nextRound,
    resetGame
  }
}
