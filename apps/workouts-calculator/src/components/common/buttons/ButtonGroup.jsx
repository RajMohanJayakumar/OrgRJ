import React from 'react'

/**
 * Button Group Component
 * For grouping related buttons together
 */
const ButtonGroup = ({
  children,
  orientation = 'horizontal',
  size = 'md',
  variant = 'outline',
  className = '',
  ...props
}) => {
  const orientationClasses = {
    horizontal: 'flex flex-row',
    vertical: 'flex flex-col'
  }
  
  const groupClasses = [
    orientationClasses[orientation],
    'rounded-lg overflow-hidden border border-gray-200',
    className
  ].filter(Boolean).join(' ')
  
  // Clone children and add appropriate classes
  const enhancedChildren = React.Children.map(children, (child, index) => {
    if (!React.isValidElement(child)) return child
    
    const isFirst = index === 0
    const isLast = index === React.Children.count(children) - 1
    const isMiddle = !isFirst && !isLast
    
    let additionalClasses = ''
    
    if (orientation === 'horizontal') {
      if (isFirst) additionalClasses = 'rounded-r-none border-r-0'
      else if (isLast) additionalClasses = 'rounded-l-none'
      else if (isMiddle) additionalClasses = 'rounded-none border-r-0'
    } else {
      if (isFirst) additionalClasses = 'rounded-b-none border-b-0'
      else if (isLast) additionalClasses = 'rounded-t-none'
      else if (isMiddle) additionalClasses = 'rounded-none border-b-0'
    }
    
    return React.cloneElement(child, {
      className: `${child.props.className || ''} ${additionalClasses}`.trim(),
      variant: child.props.variant || variant,
      size: child.props.size || size
    })
  })
  
  return (
    <div className={groupClasses} {...props}>
      {enhancedChildren}
    </div>
  )
}

export default ButtonGroup
