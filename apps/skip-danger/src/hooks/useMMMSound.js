/**
 * MMM Fingers Sound Hook
 * Manages audio feedback and sound effects for the MMM fingers game
 */

import { useState, useCallback, useRef, useEffect } from 'react'
import { MMM_CONFIG } from '../config/mmmConfig'

const useMMMSound = (initialEnabled = true) => {
  const [soundEnabled, setSoundEnabled] = useState(initialEnabled)
  const [volume, setVolume] = useState(MMM_CONFIG.AUDIO.VOLUME)
  const audioContextRef = useRef(null)
  const oscillatorRef = useRef(null)
  const gainNodeRef = useRef(null)

  // Initialize Web Audio API
  useEffect(() => {
    if (typeof window !== 'undefined' && window.AudioContext) {
      try {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
        gainNodeRef.current = audioContextRef.current.createGain()
        gainNodeRef.current.connect(audioContextRef.current.destination)
        gainNodeRef.current.gain.value = volume
      } catch (error) {
        console.warn('Web Audio API not supported:', error)
      }
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  // Update volume when it changes
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = volume
    }
  }, [volume])

  // Generate tone using Web Audio API
  const generateTone = useCallback((frequency, duration = 200, type = 'sine') => {
    if (!soundEnabled || !audioContextRef.current || !gainNodeRef.current) return

    try {
      const oscillator = audioContextRef.current.createOscillator()
      const envelope = audioContextRef.current.createGain()

      oscillator.connect(envelope)
      envelope.connect(gainNodeRef.current)

      oscillator.frequency.value = frequency
      oscillator.type = type

      // Create envelope for smooth sound
      const now = audioContextRef.current.currentTime
      envelope.gain.setValueAtTime(0, now)
      envelope.gain.linearRampToValueAtTime(volume, now + 0.01)
      envelope.gain.exponentialRampToValueAtTime(0.001, now + duration / 1000)

      oscillator.start(now)
      oscillator.stop(now + duration / 1000)
    } catch (error) {
      console.warn('Error generating tone:', error)
    }
  }, [soundEnabled, volume])

  // Predefined sound effects
  const SOUNDS = {
    FINGER_TAP: () => generateTone(800, 100, 'sine'),
    PATTERN_START: () => generateTone(440, 300, 'triangle'),
    PATTERN_COMPLETE: () => {
      // Success chord
      generateTone(523, 200, 'sine') // C
      setTimeout(() => generateTone(659, 200, 'sine'), 100) // E
      setTimeout(() => generateTone(784, 200, 'sine'), 200) // G
    },
    SUCCESS: () => {
      // Rising tone
      generateTone(523, 150, 'sine')
      setTimeout(() => generateTone(659, 150, 'sine'), 150)
      setTimeout(() => generateTone(784, 200, 'sine'), 300)
    },
    ERROR: () => {
      // Descending tone
      generateTone(400, 200, 'sawtooth')
      setTimeout(() => generateTone(300, 200, 'sawtooth'), 100)
    },
    LEVEL_UP: () => {
      // Ascending arpeggio
      const notes = [523, 659, 784, 1047] // C, E, G, C
      notes.forEach((freq, index) => {
        setTimeout(() => generateTone(freq, 200, 'sine'), index * 100)
      })
    },
    GAME_OVER: () => {
      // Dramatic descending sequence
      const notes = [523, 466, 415, 370, 330] // C to E
      notes.forEach((freq, index) => {
        setTimeout(() => generateTone(freq, 300, 'triangle'), index * 200)
      })
    },
    COUNTDOWN: () => generateTone(1000, 100, 'square'),
    TICK: () => generateTone(1200, 50, 'square'),
    
    // Finger-specific tones (for multi-modal mode)
    FINGER_1: () => generateTone(261, 150, 'sine'), // C
    FINGER_2: () => generateTone(294, 150, 'sine'), // D
    FINGER_3: () => generateTone(330, 150, 'sine'), // E
    FINGER_4: () => generateTone(349, 150, 'sine'), // F
    FINGER_5: () => generateTone(392, 150, 'sine'), // G
    FINGER_6: () => generateTone(440, 150, 'sine'), // A
    FINGER_7: () => generateTone(494, 150, 'sine'), // B
    FINGER_8: () => generateTone(523, 150, 'sine'), // C
    FINGER_9: () => generateTone(587, 150, 'sine'), // D
    FINGER_10: () => generateTone(659, 150, 'sine'), // E
  }

  // Play sound by name
  const playSound = useCallback((soundName, options = {}) => {
    if (!soundEnabled) return

    const sound = SOUNDS[soundName.toUpperCase()]
    if (sound) {
      // Add slight delay if specified
      if (options.delay) {
        setTimeout(sound, options.delay)
      } else {
        sound()
      }
    } else {
      console.warn(`Sound '${soundName}' not found`)
    }
  }, [soundEnabled, SOUNDS])

  // Play finger-specific sound
  const playFingerSound = useCallback((fingerIndex) => {
    if (!soundEnabled) return
    
    const soundName = `FINGER_${fingerIndex + 1}`
    playSound(soundName)
  }, [soundEnabled, playSound])

  // Play pattern sequence
  const playPatternSequence = useCallback((pattern, interval = 500) => {
    if (!soundEnabled || !pattern.length) return

    pattern.forEach((element, index) => {
      setTimeout(() => {
        if (element.sound) {
          // Play custom sound if specified
          playSound(element.sound)
        } else if (element.finger) {
          // Play finger-specific sound
          playFingerSound(element.finger.position)
        }
      }, index * interval)
    })
  }, [soundEnabled, playSound, playFingerSound])

  // Toggle sound
  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => !prev)
  }, [])

  // Set volume
  const setVolumeLevel = useCallback((newVolume) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume))
    setVolume(clampedVolume)
  }, [])

  // Play haptic feedback (if supported)
  const playHaptic = useCallback((pattern = 'light') => {
    if (navigator.vibrate && MMM_CONFIG.MOBILE.HAPTIC_FEEDBACK) {
      const patterns = {
        light: [50],
        medium: [100],
        heavy: [200],
        double: [50, 50, 50],
        success: [100, 50, 100],
        error: [200, 100, 200, 100, 200]
      }
      
      const vibrationPattern = patterns[pattern] || patterns.light
      navigator.vibrate(vibrationPattern)
    }
  }, [])

  // Create ambient background tone (optional)
  const createAmbientTone = useCallback((frequency = 220, fadeIn = 2000) => {
    if (!soundEnabled || !audioContextRef.current) return null

    try {
      const oscillator = audioContextRef.current.createOscillator()
      const envelope = audioContextRef.current.createGain()
      const filter = audioContextRef.current.createBiquadFilter()

      oscillator.connect(filter)
      filter.connect(envelope)
      envelope.connect(gainNodeRef.current)

      oscillator.frequency.value = frequency
      oscillator.type = 'sine'
      filter.type = 'lowpass'
      filter.frequency.value = frequency * 2

      const now = audioContextRef.current.currentTime
      envelope.gain.setValueAtTime(0, now)
      envelope.gain.linearRampToValueAtTime(volume * 0.1, now + fadeIn / 1000)

      oscillator.start(now)

      return {
        stop: (fadeOut = 1000) => {
          const stopTime = audioContextRef.current.currentTime
          envelope.gain.linearRampToValueAtTime(0, stopTime + fadeOut / 1000)
          oscillator.stop(stopTime + fadeOut / 1000)
        }
      }
    } catch (error) {
      console.warn('Error creating ambient tone:', error)
      return null
    }
  }, [soundEnabled, volume])

  return {
    // State
    soundEnabled,
    volume,

    // Sound effects
    SOUNDS,
    playSound,
    playFingerSound,
    playPatternSequence,
    playHaptic,

    // Controls
    toggleSound,
    setVolumeLevel,

    // Advanced
    generateTone,
    createAmbientTone,

    // Utilities
    isAudioSupported: !!audioContextRef.current
  }
}

export default useMMMSound
