import { useEffect, useRef } from 'react'

/**
 * Custom hook to prevent scroll increment/decrement on number inputs
 * This prevents accidental value changes when users scroll over input fields
 * while preserving natural page scrolling behavior
 *
 * @param {boolean} disabled - Whether to disable the scroll prevention
 * @returns {object} - Ref to attach to input element and event handlers
 */
export const useScrollPreventInput = (disabled = false) => {
  const inputRef = useRef(null)

  useEffect(() => {
    const inputElement = inputRef.current
    if (!inputElement || disabled) return

    // Store original input type
    const originalType = inputElement.type

    const handleWheel = () => {
      // Only prevent input value changes when the input is focused
      if (document.activeElement === inputElement && originalType === 'number') {
        // Store current value to restore if needed
        const currentValue = inputElement.value
        const currentSelectionStart = inputElement.selectionStart
        const currentSelectionEnd = inputElement.selectionEnd

        // Temporarily blur the input to allow natural scrolling
        inputElement.blur()

        // Use setTimeout to restore focus after the scroll event completes
        setTimeout(() => {
          // Restore focus and cursor position
          inputElement.focus()
          inputElement.value = currentValue
          inputElement.setSelectionRange(currentSelectionStart, currentSelectionEnd)
        }, 0)
      }
    }

    const handleKeyDown = (e) => {
      // Prevent arrow up/down from changing values when input is focused
      // unless user explicitly wants to use them (holding Ctrl/Cmd)
      if ((e.key === 'ArrowUp' || e.key === 'ArrowDown') && !e.ctrlKey && !e.metaKey) {
        // Allow arrow keys for navigation but prevent value change
        if (inputElement.type === 'number') {
          e.preventDefault()
        }
      }
    }

    // Add event listeners
    inputElement.addEventListener('wheel', handleWheel, { passive: true })
    inputElement.addEventListener('keydown', handleKeyDown)

    // Cleanup
    return () => {
      if (inputElement) {
        inputElement.removeEventListener('wheel', handleWheel)
        inputElement.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [disabled])

  return {
    inputRef,
    // Additional props to spread on input element - only prevent keyboard arrows
    onKeyDown: disabled ? undefined : (e) => {
      if ((e.key === 'ArrowUp' || e.key === 'ArrowDown') && !e.ctrlKey && !e.metaKey) {
        e.preventDefault()
      }
    }
  }
}

export default useScrollPreventInput
