/**
 * Mobile Controls Hook
 * Provides touch-friendly controls for arcade games
 */

import { useState, useCallback, useRef, useEffect } from 'react'

const useMobileControls = (gameType = 'directional') => {
  const [isMobile, setIsMobile] = useState(false)
  const [touchControls, setTouchControls] = useState({
    up: false,
    down: false,
    left: false,
    right: false,
    action: false,
    pause: false
  })
  
  const touchStartRef = useRef({ x: 0, y: 0 })
  const swipeThreshold = 50
  const tapThreshold = 200 // ms for tap vs hold

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                           window.innerWidth <= 768 ||
                           ('ontouchstart' in window)
      setIsMobile(isMobileDevice)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Handle touch start
  const handleTouchStart = useCallback((e) => {
    e.preventDefault()
    const touch = e.touches[0]
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    }
  }, [])

  // Handle touch end with swipe detection
  const handleTouchEnd = useCallback((e, onSwipe, onTap) => {
    e.preventDefault()
    const touch = e.changedTouches[0]
    const deltaX = touch.clientX - touchStartRef.current.x
    const deltaY = touch.clientY - touchStartRef.current.y
    const deltaTime = Date.now() - touchStartRef.current.time
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

    // Tap detection (short touch with minimal movement)
    if (distance < 30 && deltaTime < tapThreshold) {
      onTap && onTap(e)
      return
    }

    // Swipe detection
    if (distance > swipeThreshold) {
      const angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI
      let direction = null

      if (angle >= -45 && angle <= 45) direction = 'right'
      else if (angle >= 45 && angle <= 135) direction = 'down'
      else if (angle >= -135 && angle <= -45) direction = 'up'
      else direction = 'left'

      onSwipe && onSwipe(direction, { deltaX, deltaY, distance, angle })
    }
  }, [swipeThreshold, tapThreshold])

  // Virtual D-Pad component with larger, more comfortable sizing
  const VirtualDPad = useCallback(({ onDirectionPress, onDirectionRelease, className = '', size = 'large' }) => {
    if (!isMobile) return null

    // Responsive sizing based on screen
    const sizes = {
      small: { container: 'w-28 h-28', button: 'w-8 h-8', center: 'w-6 h-6', text: 'text-lg' },
      medium: { container: 'w-36 h-36', button: 'w-12 h-12', center: 'w-8 h-8', text: 'text-xl' },
      large: { container: 'w-44 h-44', button: 'w-14 h-14', center: 'w-10 h-10', text: 'text-2xl' }
    }

    const currentSize = sizes[size] || sizes.large
    const buttonClass = `absolute bg-white/30 backdrop-blur-sm border-2 border-white/50 rounded-xl flex items-center justify-center text-white font-bold active:bg-white/60 transition-all duration-150 select-none shadow-lg ${currentSize.text}`

    const handlePress = (direction) => {
      setTouchControls(prev => ({ ...prev, [direction]: true }))
      onDirectionPress && onDirectionPress(direction)
    }

    const handleRelease = (direction) => {
      setTouchControls(prev => ({ ...prev, [direction]: false }))
      onDirectionRelease && onDirectionRelease(direction)
    }

    return (
      <div className={`fixed bottom-6 left-6 ${currentSize.container} ${className}`} style={{ zIndex: 1000 }}>
        <div className="relative w-full h-full">
          {/* Up */}
          <button
            className={`${buttonClass} ${currentSize.button} top-0 left-1/2 transform -translate-x-1/2`}
            onTouchStart={(e) => { e.preventDefault(); handlePress('up'); }}
            onTouchEnd={(e) => { e.preventDefault(); handleRelease('up'); }}
            onMouseDown={() => handlePress('up')}
            onMouseUp={() => handleRelease('up')}
            onMouseLeave={() => handleRelease('up')}
          >
            ↑
          </button>

          {/* Down */}
          <button
            className={`${buttonClass} ${currentSize.button} bottom-0 left-1/2 transform -translate-x-1/2`}
            onTouchStart={(e) => { e.preventDefault(); handlePress('down'); }}
            onTouchEnd={(e) => { e.preventDefault(); handleRelease('down'); }}
            onMouseDown={() => handlePress('down')}
            onMouseUp={() => handleRelease('down')}
            onMouseLeave={() => handleRelease('down')}
          >
            ↓
          </button>

          {/* Left */}
          <button
            className={`${buttonClass} ${currentSize.button} left-0 top-1/2 transform -translate-y-1/2`}
            onTouchStart={(e) => { e.preventDefault(); handlePress('left'); }}
            onTouchEnd={(e) => { e.preventDefault(); handleRelease('left'); }}
            onMouseDown={() => handlePress('left')}
            onMouseUp={() => handleRelease('left')}
            onMouseLeave={() => handleRelease('left')}
          >
            ←
          </button>

          {/* Right */}
          <button
            className={`${buttonClass} ${currentSize.button} right-0 top-1/2 transform -translate-y-1/2`}
            onTouchStart={(e) => { e.preventDefault(); handlePress('right'); }}
            onTouchEnd={(e) => { e.preventDefault(); handleRelease('right'); }}
            onMouseDown={() => handlePress('right')}
            onMouseUp={() => handleRelease('right')}
            onMouseLeave={() => handleRelease('right')}
          >
            →
          </button>

          {/* Center (for pause/action) */}
          <button
            className={`${buttonClass} ${currentSize.center} top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm`}
            onTouchStart={(e) => { e.preventDefault(); handlePress('action'); }}
            onTouchEnd={(e) => { e.preventDefault(); handleRelease('action'); }}
            onMouseDown={() => handlePress('action')}
            onMouseUp={() => handleRelease('action')}
            onMouseLeave={() => handleRelease('action')}
          >
            ⏸
          </button>
        </div>
      </div>
    )
  }, [isMobile])

  // Action buttons component with better sizing
  const ActionButtons = useCallback(({ buttons = [], className = '', size = 'large' }) => {
    if (!isMobile || !buttons.length) return null

    const sizes = {
      small: 'px-3 py-2 text-sm min-w-12',
      medium: 'px-4 py-3 text-base min-w-16',
      large: 'px-6 py-4 text-lg min-w-20'
    }

    return (
      <div className={`fixed bottom-6 right-6 flex flex-col gap-3 ${className}`} style={{ zIndex: 1000 }}>
        {buttons.map((button, index) => (
          <button
            key={index}
            className={`bg-white/30 backdrop-blur-sm border-2 border-white/50 rounded-xl text-white font-bold active:bg-white/60 transition-all duration-150 select-none shadow-lg ${sizes[size] || sizes.large}`}
            onTouchStart={(e) => {
              e.preventDefault()
              setTouchControls(prev => ({ ...prev, [button.key]: true }))
              button.onPress && button.onPress()
            }}
            onTouchEnd={(e) => {
              e.preventDefault()
              setTouchControls(prev => ({ ...prev, [button.key]: false }))
              button.onRelease && button.onRelease()
            }}
            onMouseDown={() => {
              setTouchControls(prev => ({ ...prev, [button.key]: true }))
              button.onPress && button.onPress()
            }}
            onMouseUp={() => {
              setTouchControls(prev => ({ ...prev, [button.key]: false }))
              button.onRelease && button.onRelease()
            }}
            onMouseLeave={() => {
              setTouchControls(prev => ({ ...prev, [button.key]: false }))
              button.onRelease && button.onRelease()
            }}
          >
            {button.label}
          </button>
        ))}
      </div>
    )
  }, [isMobile])

  // Swipe area component
  const SwipeArea = useCallback(({ onSwipe, onTap, className = '', children }) => {
    return (
      <div
        className={`touch-none ${className}`}
        onTouchStart={handleTouchStart}
        onTouchEnd={(e) => handleTouchEnd(e, onSwipe, onTap)}
      >
        {children}
      </div>
    )
  }, [handleTouchStart, handleTouchEnd])

  // Joystick component for more precise control
  const VirtualJoystick = useCallback(({ onMove, className = '' }) => {
    if (!isMobile) return null

    const [isDragging, setIsDragging] = useState(false)
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const joystickRef = useRef(null)

    const handleStart = (e) => {
      setIsDragging(true)
      e.preventDefault()
    }

    const handleMove = (e) => {
      if (!isDragging || !joystickRef.current) return

      const rect = joystickRef.current.getBoundingClientRect()
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      
      const touch = e.touches ? e.touches[0] : e
      const x = touch.clientX - rect.left - centerX
      const y = touch.clientY - rect.top - centerY
      
      const distance = Math.sqrt(x * x + y * y)
      const maxDistance = centerX - 20
      
      if (distance <= maxDistance) {
        setPosition({ x, y })
        onMove && onMove({
          x: x / maxDistance,
          y: y / maxDistance,
          distance: distance / maxDistance
        })
      }
    }

    const handleEnd = () => {
      setIsDragging(false)
      setPosition({ x: 0, y: 0 })
      onMove && onMove({ x: 0, y: 0, distance: 0 })
    }

    return (
      <div className={`fixed bottom-4 left-4 ${className}`}>
        <div
          ref={joystickRef}
          className="w-24 h-24 bg-white/10 backdrop-blur-sm border border-white/30 rounded-full relative"
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
        >
          <div
            className="w-8 h-8 bg-white/60 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-100"
            style={{
              transform: `translate(${position.x}px, ${position.y}px) translate(-50%, -50%)`
            }}
          />
        </div>
      </div>
    )
  }, [isMobile])

  // Mobile layout wrapper for consistent mobile experience
  const MobileGameLayout = useCallback(({ children, className = '', hasControls = true }) => {
    const baseClasses = isMobile
      ? 'min-h-screen w-full overflow-hidden relative'
      : 'min-h-screen'

    const paddingClasses = isMobile && hasControls
      ? 'pb-32 px-2' // Extra padding for controls
      : 'p-4'

    return (
      <div className={`${baseClasses} ${paddingClasses} ${className}`}>
        {children}
      </div>
    )
  }, [isMobile])

  // Mobile-optimized game area
  const MobileGameArea = useCallback(({ children, className = '', maxHeight = '70vh' }) => {
    const mobileClasses = isMobile
      ? `max-h-[${maxHeight}] w-full overflow-hidden`
      : 'w-full'

    return (
      <div className={`${mobileClasses} ${className}`}>
        {children}
      </div>
    )
  }, [isMobile])

  return {
    isMobile,
    touchControls,
    setTouchControls,

    // Event handlers
    handleTouchStart,
    handleTouchEnd,

    // Components
    VirtualDPad,
    ActionButtons,
    SwipeArea,
    VirtualJoystick,
    MobileGameLayout,
    MobileGameArea,

    // Utilities
    swipeThreshold,
    tapThreshold
  }
}

export default useMobileControls
