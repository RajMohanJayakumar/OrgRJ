/**
 * MMM Fingers Game State Hook
 * Manages game state, patterns, and progression for the MMM fingers game
 */

import { useState, useCallback, useRef, useEffect } from 'react'
import { GAME_CONFIGS, getAllFingers } from '../config/mmmConfig'

const useMMMGameState = (gameMode = 'classic') => {
  const [gameState, setGameState] = useState('menu') // menu, playing, paused, gameOver
  const [currentPattern, setCurrentPattern] = useState([])
  const [userPattern, setUserPattern] = useState([])
  const [currentLevel, setCurrentLevel] = useState(1)
  const [lives, setLives] = useState(3)
  const [score, setScore] = useState(0)
  const [isShowingPattern, setIsShowingPattern] = useState(false)
  const [isWaitingForInput, setIsWaitingForInput] = useState(false)
  const [patternIndex, setPatternIndex] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [streak, setStreak] = useState(0)
  const [feedback, setFeedback] = useState(null) // { type: 'success'|'error', message: string }

  const config = GAME_CONFIGS[gameMode.toUpperCase()] || GAME_CONFIGS.CLASSIC
  const fingers = getAllFingers()
  const timeoutRef = useRef(null)
  const intervalRef = useRef(null)

  // Generate a random pattern
  const generatePattern = useCallback((length) => {
    const pattern = []
    for (let i = 0; i < length; i++) {
      const randomFinger = fingers[Math.floor(Math.random() * fingers.length)]
      pattern.push({
        finger: randomFinger,
        color: config.INCLUDE_COLORS ? getRandomColor() : null,
        sound: config.INCLUDE_SOUNDS ? getRandomSound() : null,
        timing: config.RANDOM_TIMING ? Math.random() * 500 + 500 : null
      })
    }
    return pattern
  }, [fingers, config])

  // Get random color for multi-modal mode
  const getRandomColor = () => {
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']
    return colors[Math.floor(Math.random() * colors.length)]
  }

  // Get random sound for multi-modal mode
  const getRandomSound = () => {
    const sounds = ['tone1', 'tone2', 'tone3', 'tone4', 'tone5']
    return sounds[Math.floor(Math.random() * sounds.length)]
  }

  // Calculate pattern length based on level
  const getPatternLength = useCallback(() => {
    const baseLength = config.INITIAL_PATTERN_LENGTH
    const increment = Math.floor((currentLevel - 1) / 2) * config.PATTERN_INCREMENT
    return Math.min(baseLength + increment, config.MAX_PATTERN_LENGTH)
  }, [currentLevel, config])

  // Calculate display time based on level
  const getDisplayTime = useCallback(() => {
    const baseTime = config.DISPLAY_TIME_BASE
    const reduction = (currentLevel - 1) * 50
    return Math.max(baseTime - reduction, config.DISPLAY_TIME_MIN)
  }, [currentLevel, config])

  // Start a new game
  const startGame = useCallback(() => {
    setGameState('playing')
    setCurrentLevel(1)
    setLives(config.LIVES)
    setScore(0)
    setStreak(0)
    setUserPattern([])
    setFeedback(null)
    
    const newPattern = generatePattern(getPatternLength())
    setCurrentPattern(newPattern)
    showPattern(newPattern)
  }, [config, generatePattern, getPatternLength])

  // Show the pattern to the user
  const showPattern = useCallback((pattern) => {
    setIsShowingPattern(true)
    setIsWaitingForInput(false)
    setPatternIndex(0)
    setUserPattern([])

    const displayTime = getDisplayTime()
    let index = 0

    const showNextElement = () => {
      if (index < pattern.length) {
        setPatternIndex(index)
        index++
        timeoutRef.current = setTimeout(showNextElement, displayTime)
      } else {
        // Pattern shown, wait for user input
        setIsShowingPattern(false)
        setIsWaitingForInput(true)
        setPatternIndex(-1)
        startResponseTimer()
      }
    }

    showNextElement()
  }, [getDisplayTime])

  // Start the response timer
  const startResponseTimer = useCallback(() => {
    setTimeRemaining(config.RESPONSE_TIME_LIMIT)
    
    intervalRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1000) {
          // Time's up
          handleTimeUp()
          return 0
        }
        return prev - 100
      })
    }, 100)
  }, [config])

  // Handle time up
  const handleTimeUp = useCallback(() => {
    clearInterval(intervalRef.current)
    setIsWaitingForInput(false)
    setFeedback({ type: 'error', message: 'Time\'s up!' })
    
    setLives(prev => {
      const newLives = prev - 1
      if (newLives <= 0) {
        setGameState('gameOver')
      } else {
        // Continue with next pattern after delay
        setTimeout(() => {
          const newPattern = generatePattern(getPatternLength())
          setCurrentPattern(newPattern)
          showPattern(newPattern)
          setFeedback(null)
        }, 2000)
      }
      return newLives
    })
    
    setStreak(0)
  }, [generatePattern, getPatternLength, showPattern])

  // Handle finger press
  const handleFingerPress = useCallback((finger) => {
    if (!isWaitingForInput || gameState !== 'playing') return

    const newUserPattern = [...userPattern, finger]
    setUserPattern(newUserPattern)

    const currentIndex = newUserPattern.length - 1
    const expectedFinger = currentPattern[currentIndex]?.finger

    // Check if the finger matches
    if (finger.id === expectedFinger.id) {
      // Correct finger
      if (newUserPattern.length === currentPattern.length) {
        // Pattern completed successfully
        handlePatternComplete()
      }
    } else {
      // Wrong finger
      handleWrongFinger()
    }
  }, [isWaitingForInput, gameState, userPattern, currentPattern])

  // Handle pattern completion
  const handlePatternComplete = useCallback(() => {
    clearInterval(intervalRef.current)
    setIsWaitingForInput(false)
    
    // Calculate score
    const timeBonus = config.TIME_BONUS ? Math.floor(timeRemaining / 100) : 0
    const levelBonus = currentLevel * 5
    const streakBonus = streak * 2
    const patternScore = (currentPattern.length * config.SCORE_MULTIPLIER) + timeBonus + levelBonus + streakBonus
    
    setScore(prev => prev + patternScore)
    setStreak(prev => prev + 1)
    setFeedback({ 
      type: 'success', 
      message: `Perfect! +${patternScore} points`,
      details: {
        base: currentPattern.length * config.SCORE_MULTIPLIER,
        timeBonus,
        levelBonus,
        streakBonus
      }
    })

    // Level up
    setTimeout(() => {
      setCurrentLevel(prev => prev + 1)
      const newPattern = generatePattern(getPatternLength())
      setCurrentPattern(newPattern)
      showPattern(newPattern)
      setFeedback(null)
    }, 2000)
  }, [currentPattern, currentLevel, streak, timeRemaining, config, generatePattern, getPatternLength, showPattern])

  // Handle wrong finger
  const handleWrongFinger = useCallback(() => {
    clearInterval(intervalRef.current)
    setIsWaitingForInput(false)
    setFeedback({ type: 'error', message: 'Wrong finger!' })
    
    setLives(prev => {
      const newLives = prev - 1
      if (newLives <= 0) {
        setGameState('gameOver')
      } else {
        // Continue with same pattern after delay
        setTimeout(() => {
          showPattern(currentPattern)
          setFeedback(null)
        }, 2000)
      }
      return newLives
    })
    
    setStreak(0)
  }, [currentPattern, showPattern])

  // Pause game
  const pauseGame = useCallback(() => {
    if (gameState === 'playing') {
      setGameState('paused')
      clearTimeout(timeoutRef.current)
      clearInterval(intervalRef.current)
    }
  }, [gameState])

  // Resume game
  const resumeGame = useCallback(() => {
    if (gameState === 'paused') {
      setGameState('playing')
      if (isWaitingForInput) {
        startResponseTimer()
      }
    }
  }, [gameState, isWaitingForInput, startResponseTimer])

  // Reset game
  const resetGame = useCallback(() => {
    setGameState('menu')
    clearTimeout(timeoutRef.current)
    clearInterval(intervalRef.current)
    setCurrentPattern([])
    setUserPattern([])
    setCurrentLevel(1)
    setLives(config.LIVES)
    setScore(0)
    setIsShowingPattern(false)
    setIsWaitingForInput(false)
    setPatternIndex(0)
    setTimeRemaining(0)
    setStreak(0)
    setFeedback(null)
  }, [config])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current)
      clearInterval(intervalRef.current)
    }
  }, [])

  return {
    // Game state
    gameState,
    currentPattern,
    userPattern,
    currentLevel,
    lives,
    score,
    isShowingPattern,
    isWaitingForInput,
    patternIndex,
    timeRemaining,
    streak,
    feedback,

    // Computed values
    patternLength: getPatternLength(),
    displayTime: getDisplayTime(),
    maxLives: config.LIVES,
    progressPercent: userPattern.length / currentPattern.length * 100,

    // Actions
    startGame,
    pauseGame,
    resumeGame,
    resetGame,
    handleFingerPress,

    // Utilities
    isPlaying: gameState === 'playing',
    isPaused: gameState === 'paused',
    isGameOver: gameState === 'gameOver',
    isInMenu: gameState === 'menu'
  }
}

export default useMMMGameState
