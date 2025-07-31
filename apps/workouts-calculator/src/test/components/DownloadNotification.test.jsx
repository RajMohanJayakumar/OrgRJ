import { describe, test, expect, beforeEach, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import DownloadNotification, { downloadNotifications } from '../../components/DownloadNotification'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>
  },
  AnimatePresence: ({ children }) => children
}))

describe('DownloadNotification', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('🏗️ Component Rendering', () => {
    test('should render component', () => {
      render(<DownloadNotification />)

      // Component should render without errors
      expect(document.body).toBeInTheDocument()
    })
  })

  describe('📥 Download Start Events', () => {
    test('should show notification when download starts', () => {
      render(<DownloadNotification />)

      act(() => {
        window.dispatchEvent(new CustomEvent('downloadStart', {
          detail: { filename: 'test.pdf', type: 'PDF' }
        }))
      })

      expect(screen.getByText('Generating PDF...')).toBeInTheDocument()
      expect(screen.getByText('test.pdf')).toBeInTheDocument()
    })

    test('should handle custom file types', () => {
      render(<DownloadNotification />)

      act(() => {
        window.dispatchEvent(new CustomEvent('downloadStart', {
          detail: { filename: 'report.xlsx', type: 'Excel' }
        }))
      })

      expect(screen.getByText('Generating Excel...')).toBeInTheDocument()
    })
  })

  describe('✅ Download Complete Events', () => {
    test('should show completion notification', () => {
      render(<DownloadNotification />)

      const id = Date.now()

      // Start download
      act(() => {
        window.dispatchEvent(new CustomEvent('downloadStart', {
          detail: { filename: 'test.pdf', type: 'PDF' }
        }))
      })

      // Complete download
      act(() => {
        window.dispatchEvent(new CustomEvent('downloadComplete', {
          detail: { id, filename: 'test.pdf', type: 'PDF' }
        }))
      })

      expect(screen.getByText('PDF Downloaded!')).toBeInTheDocument()
      expect(screen.getByText('✅')).toBeInTheDocument()
    })
  })

  describe('❌ Download Error Events', () => {
    test('should show error notification', () => {
      render(<DownloadNotification />)

      const id = Date.now()

      // Start download
      act(() => {
        window.dispatchEvent(new CustomEvent('downloadStart', {
          detail: { filename: 'test.pdf', type: 'PDF' }
        }))
      })

      // Error in download
      act(() => {
        window.dispatchEvent(new CustomEvent('downloadError', {
          detail: { id, error: 'Network error' }
        }))
      })

      expect(screen.getByText('Download Failed')).toBeInTheDocument()
      expect(screen.getByText('❌')).toBeInTheDocument()
    })
  })

  describe('📱 Multiple Notifications', () => {
    test('should handle multiple simultaneous downloads', () => {
      render(<DownloadNotification />)

      // Start multiple downloads
      act(() => {
        window.dispatchEvent(new CustomEvent('downloadStart', {
          detail: { filename: 'file1.pdf', type: 'PDF' }
        }))
      })

      act(() => {
        window.dispatchEvent(new CustomEvent('downloadStart', {
          detail: { filename: 'file2.xlsx', type: 'Excel' }
        }))
      })

      expect(screen.getByText('file1.pdf')).toBeInTheDocument()
      expect(screen.getByText('file2.xlsx')).toBeInTheDocument()
      expect(screen.getByText('Generating PDF...')).toBeInTheDocument()
      expect(screen.getByText('Generating Excel...')).toBeInTheDocument()
    })
  })

  describe('🔧 Utility Functions', () => {
    test('downloadNotifications.start should trigger download start event', () => {
      const eventSpy = vi.spyOn(window, 'dispatchEvent')
      
      const id = downloadNotifications.start('test.pdf', 'PDF')
      
      expect(eventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'downloadStart',
          detail: { id, filename: 'test.pdf', type: 'PDF' }
        })
      )
      expect(typeof id).toBe('number')
    })

    test('downloadNotifications.progress should trigger progress event', () => {
      const eventSpy = vi.spyOn(window, 'dispatchEvent')
      
      downloadNotifications.progress(123, 50)
      
      expect(eventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'downloadProgress',
          detail: { id: 123, progress: 50 }
        })
      )
    })

    test('downloadNotifications.complete should trigger complete event', () => {
      const eventSpy = vi.spyOn(window, 'dispatchEvent')
      
      downloadNotifications.complete(123, 'test.pdf', 'PDF')
      
      expect(eventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'downloadComplete',
          detail: { id: 123, filename: 'test.pdf', type: 'PDF' }
        })
      )
    })

    test('downloadNotifications.error should trigger error event', () => {
      const eventSpy = vi.spyOn(window, 'dispatchEvent')
      
      downloadNotifications.error(123, 'Network error')
      
      expect(eventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'downloadError',
          detail: { id: 123, error: 'Network error' }
        })
      )
    })
  })

  describe('🧹 Cleanup', () => {
    test('should cleanup event listeners on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')
      
      const { unmount } = render(<DownloadNotification />)
      unmount()
      
      expect(removeEventListenerSpy).toHaveBeenCalledWith('downloadStart', expect.any(Function))
      expect(removeEventListenerSpy).toHaveBeenCalledWith('downloadProgress', expect.any(Function))
      expect(removeEventListenerSpy).toHaveBeenCalledWith('downloadComplete', expect.any(Function))
      expect(removeEventListenerSpy).toHaveBeenCalledWith('downloadError', expect.any(Function))
    })
  })
})
