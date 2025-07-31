/**
 * Arcade Sound Hook
 * Centralized sound management for arcade games
 */

import { useState, useCallback, useRef } from 'react'
import { ARCADE_CONFIG } from '../config/arcadeConfig'

const useArcadeSound = (initialEnabled = true) => {
  const [soundEnabled, setSoundEnabled] = useState(initialEnabled)
  const audioContextRef = useRef(null)
  
  // Initialize audio context
  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
      } catch (error) {
        console.warn('Web Audio API not supported:', error)
        return null
      }
    }
    return audioContextRef.current
  }, [])
  
  // Sound generation configurations
  const soundConfigs = {
    [ARCADE_CONFIG.AUDIO.SOUND_TYPES.SHOOT]: {
      frequency: 800,
      endFrequency: 400,
      duration: 0.1,
      volume: 0.1
    },
    [ARCADE_CONFIG.AUDIO.SOUND_TYPES.HIT]: {
      frequency: 200,
      endFrequency: 100,
      duration: 0.2,
      volume: 0.2
    },
    [ARCADE_CONFIG.AUDIO.SOUND_TYPES.EXPLOSION]: {
      frequency: 150,
      endFrequency: 50,
      duration: 0.3,
      volume: 0.3
    },
    [ARCADE_CONFIG.AUDIO.SOUND_TYPES.PADDLE]: {
      frequency: 800,
      endFrequency: 800,
      duration: 0.1,
      volume: 0.1
    },
    [ARCADE_CONFIG.AUDIO.SOUND_TYPES.WALL]: {
      frequency: 400,
      endFrequency: 400,
      duration: 0.1,
      volume: 0.1
    },
    [ARCADE_CONFIG.AUDIO.SOUND_TYPES.SCORE]: {
      frequency: 600,
      endFrequency: 300,
      duration: 0.3,
      volume: 0.2
    },
    [ARCADE_CONFIG.AUDIO.SOUND_TYPES.EAT]: {
      frequency: 800,
      endFrequency: 1200,
      duration: 0.1,
      volume: 0.1
    },
    [ARCADE_CONFIG.AUDIO.SOUND_TYPES.DROP]: {
      frequency: 200,
      endFrequency: 200,
      duration: 0.1,
      volume: 0.1
    },
    [ARCADE_CONFIG.AUDIO.SOUND_TYPES.LINE]: {
      frequency: 800,
      endFrequency: 1200,
      duration: 0.3,
      volume: 0.2
    },
    [ARCADE_CONFIG.AUDIO.SOUND_TYPES.GAME_OVER]: {
      frequency: 400,
      endFrequency: 200,
      duration: 0.5,
      volume: 0.2
    }
  }
  
  // Play sound function
  const playSound = useCallback((soundType) => {
    if (!soundEnabled) return
    
    const config = soundConfigs[soundType]
    if (!config) {
      console.warn(`Unknown sound type: ${soundType}`)
      return
    }
    
    try {
      const audioContext = getAudioContext()
      if (!audioContext) return
      
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      // Set frequency
      oscillator.frequency.setValueAtTime(config.frequency, audioContext.currentTime)
      if (config.endFrequency !== config.frequency) {
        oscillator.frequency.exponentialRampToValueAtTime(
          config.endFrequency, 
          audioContext.currentTime + config.duration
        )
      }
      
      // Set volume
      gainNode.gain.setValueAtTime(config.volume, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(
        0.01, 
        audioContext.currentTime + config.duration
      )
      
      // Play sound
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + config.duration)
      
      // Cleanup
      setTimeout(() => {
        try {
          oscillator.disconnect()
          gainNode.disconnect()
        } catch (error) {
          // Ignore cleanup errors
        }
      }, config.duration * 1000 + 100)
      
    } catch (error) {
      console.warn('Error playing sound:', error)
    }
  }, [soundEnabled, getAudioContext])
  
  // Toggle sound
  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => !prev)
  }, [])
  
  // Enable/disable sound
  const enableSound = useCallback(() => {
    setSoundEnabled(true)
  }, [])
  
  const disableSound = useCallback(() => {
    setSoundEnabled(false)
  }, [])
  
  // Cleanup audio context
  const cleanup = useCallback(() => {
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close()
        audioContextRef.current = null
      } catch (error) {
        console.warn('Error closing audio context:', error)
      }
    }
  }, [])
  
  // Preload audio context (for better performance)
  const preloadAudio = useCallback(() => {
    getAudioContext()
  }, [getAudioContext])
  
  return {
    soundEnabled,
    playSound,
    toggleSound,
    enableSound,
    disableSound,
    cleanup,
    preloadAudio,
    
    // Sound type constants for easy access
    SOUNDS: ARCADE_CONFIG.AUDIO.SOUND_TYPES
  }
}

export default useArcadeSound
