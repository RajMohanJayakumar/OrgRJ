import React from 'react'

/**
 * Universal Grid Component for responsive layouts
 */
const Grid = ({
  children,
  columns = 'auto',
  gap = 'md',
  className = ''
}) => {
  // Handle responsive columns object syntax
  const getColumnClasses = (cols) => {
    if (typeof cols === 'object') {
      // Handle responsive object like { base: 1, lg: 2 }
      const baseClass = `grid-cols-${cols.base || 1}`
      const lgClass = cols.lg ? `lg:grid-cols-${cols.lg}` : ''
      const mdClass = cols.md ? `md:grid-cols-${cols.md}` : ''

      return `grid ${baseClass} ${mdClass} ${lgClass}`.trim()
    }

    // Handle simple number or string
    const columnClasses = {
      auto: 'grid grid-cols-1',
      1: 'grid grid-cols-1',
      2: 'grid grid-cols-1 md:grid-cols-2',
      3: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      4: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
    }

    return columnClasses[cols] || columnClasses.auto
  }

  // Gap classes
  const gapClasses = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8'
  }

  // Combine classes
  const gridClasses = [
    getColumnClasses(columns),
    gapClasses[gap],
    className
  ].filter(Boolean).join(' ')

  return (
    <div className={gridClasses}>
      {children}
    </div>
  )
}

export default Grid
