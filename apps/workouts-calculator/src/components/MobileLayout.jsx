import React from 'react'
import { motion } from 'framer-motion'
import { useViewMode } from '../contexts/ViewModeContext'
import useMobileResponsive from '../hooks/useMobileResponsive'

/**
 * Mobile-responsive layout wrapper component
 * Provides consistent mobile-first layout patterns
 */
const MobileLayout = ({ 
  children, 
  className = '',
  variant = 'default',
  spacing = 'md',
  padding = 'md'
}) => {
  const { isMobile } = useViewMode()
  const { responsive } = useMobileResponsive()

  const layoutVariants = {
    default: responsive.layout.main,
    card: responsive.layout.card,
    calculator: responsive.layout.calculatorGrid,
    results: responsive.layout.results
  }

  const layoutClass = layoutVariants[variant] || layoutVariants.default

  // Add nearly full width class for mobile
  const mobileWidthClass = isMobile ? 'calculator-main-container' : ''

  return (
    <div className={`${layoutClass} ${mobileWidthClass} ${className}`}>
      {children}
    </div>
  )
}

/**
 * Mobile-responsive section component
 */
export const MobileSection = ({ 
  children, 
  title, 
  icon: IconComponent,
  className = '',
  headerClassName = '',
  contentClassName = '',
  categoryColor = 'blue'
}) => {
  const { isMobile } = useViewMode()
  const { responsive } = useMobileResponsive()

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: isMobile ? 0.2 : 0.3 }
  }

  return (
    <motion.section
      className={`${responsive.layout.card} ${className}`}
      {...fadeInUp}
    >
      {(title || IconComponent) && (
        <div className={`flex items-center gap-3 ${isMobile ? 'mb-4' : 'mb-6'} ${headerClassName}`}>
          {IconComponent && (
            <div className={`${isMobile ? 'p-1.5' : 'p-2'} bg-${categoryColor}-100 rounded-lg`}>
              <IconComponent className={`${responsive.iconSize('md')} text-${categoryColor}-600`} />
            </div>
          )}
          {title && (
            <h2 className={`${responsive.typography.subheading} text-gray-900`}>
              {title}
            </h2>
          )}
        </div>
      )}
      <div className={contentClassName}>
        {children}
      </div>
    </motion.section>
  )
}

/**
 * Mobile-responsive grid component
 */
export const MobileGrid = ({ 
  children, 
  columns = 2, 
  gap = 'md',
  className = '' 
}) => {
  const { responsive } = useMobileResponsive()

  return (
    <div className={`grid ${responsive.grid(columns)} ${responsive.gap(gap)} ${className}`}>
      {children}
    </div>
  )
}

/**
 * Mobile-responsive input group component
 */
export const MobileInputGroup = ({ 
  children, 
  className = '',
  spacing = 'md' 
}) => {
  const { responsive } = useMobileResponsive()

  return (
    <div className={`${responsive.spacing(spacing)} ${className}`}>
      {children}
    </div>
  )
}

/**
 * Mobile-responsive button group component
 */
export const MobileButtonGroup = ({ 
  children, 
  direction = 'row',
  gap = 'md',
  className = '' 
}) => {
  const { isMobile } = useViewMode()
  const { responsive } = useMobileResponsive()

  const flexDirection = isMobile ? 'flex-col' : `flex-${direction}`
  
  return (
    <div className={`flex ${flexDirection} ${responsive.gap(gap)} ${className}`}>
      {children}
    </div>
  )
}

/**
 * Mobile-responsive card component
 */
export const MobileCard = ({ 
  children, 
  title,
  icon: IconComponent,
  actions,
  className = '',
  headerClassName = '',
  contentClassName = '',
  footerClassName = '',
  categoryColor = 'blue',
  shadow = 'md'
}) => {
  const { isMobile } = useViewMode()
  const { responsive } = useMobileResponsive()

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: isMobile ? 0.2 : 0.3 }
  }

  return (
    <motion.div
      className={`bg-white ${responsive.borderRadius('md')} ${responsive.shadow(shadow)} ${responsive.padding('md')} ${className}`}
      {...fadeInUp}
    >
      {(title || IconComponent || actions) && (
        <div className={`flex items-center justify-between ${isMobile ? 'mb-4' : 'mb-6'} ${headerClassName}`}>
          <div className="flex items-center gap-3">
            {IconComponent && (
              <div className={`${isMobile ? 'p-1.5' : 'p-2'} bg-${categoryColor}-100 rounded-lg`}>
                <IconComponent className={`${responsive.iconSize('md')} text-${categoryColor}-600`} />
              </div>
            )}
            {title && (
              <h3 className={`${responsive.typography.subheading} text-gray-900`}>
                {title}
              </h3>
            )}
          </div>
          {actions && (
            <div className="flex items-center gap-2">
              {actions}
            </div>
          )}
        </div>
      )}
      
      <div className={contentClassName}>
        {children}
      </div>
    </motion.div>
  )
}

/**
 * Mobile-responsive modal component
 */
export const MobileModal = ({ 
  isOpen, 
  onClose, 
  title, 
  children,
  className = '',
  overlayClassName = '',
  contentClassName = ''
}) => {
  const { isMobile } = useViewMode()
  const { responsive } = useMobileResponsive()

  if (!isOpen) return null

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      y: isMobile ? '100%' : 0,
      scale: isMobile ? 1 : 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { duration: isMobile ? 0.3 : 0.2 }
    }
  }

  return (
    <motion.div
      className={`${responsive.modal.overlay} ${overlayClassName}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className={`${responsive.modal.container} ${className}`}
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`${responsive.modal.content} ${contentClassName}`}>
          {title && (
            <div className={`flex items-center justify-between ${isMobile ? 'mb-4 pb-4' : 'mb-6 pb-6'} border-b border-gray-200`}>
              <h2 className={`${responsive.typography.heading} text-gray-900`}>
                {title}
              </h2>
              <button
                onClick={onClose}
                className={`${responsive.touch.getTouchTargetClasses()} text-gray-400 hover:text-gray-600 transition-colors`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
          {children}
        </div>
      </motion.div>
    </motion.div>
  )
}

/**
 * Mobile-responsive chart container
 */
export const MobileChartContainer = ({ 
  children, 
  title,
  className = '',
  height 
}) => {
  const { isMobile } = useViewMode()
  const { responsive } = useMobileResponsive()

  const chartHeight = height || (isMobile ? 'h-64' : 'h-80')

  return (
    <div className={`${responsive.charts.wrapper} ${className}`}>
      {title && (
        <h3 className={`${responsive.typography.subheading} text-gray-900 mb-4`}>
          {title}
        </h3>
      )}
      <div className={`${chartHeight} w-full`}>
        {children}
      </div>
    </div>
  )
}

/**
 * Mobile-responsive action bar
 */
export const MobileActionBar = ({ 
  children, 
  className = '',
  position = 'bottom',
  sticky = false 
}) => {
  const { isMobile } = useViewMode()
  const { responsive } = useMobileResponsive()

  const positionClasses = {
    top: 'top-0',
    bottom: 'bottom-0'
  }

  const stickyClass = sticky ? `sticky ${positionClasses[position]} z-10` : ''

  return (
    <div className={`${stickyClass} ${responsive.layout.actions} bg-white border-t border-gray-200 ${responsive.padding('md')} ${className}`}>
      {children}
    </div>
  )
}

export default MobileLayout
