import React, { createContext, useContext, useState } from 'react'

const ComparisonContext = createContext()

export const useComparison = () => {
  const context = useContext(ComparisonContext)
  if (!context) {
    throw new Error('useComparison must be used within a ComparisonProvider')
  }
  return context
}

export const ComparisonProvider = ({ children }) => {
  const [comparisons, setComparisons] = useState([])
  const [isComparisonVisible, setIsComparisonVisible] = useState(false)

  const addToComparison = (calculationData) => {
    const newComparison = {
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      ...calculationData
    }
    setComparisons(prev => [...prev, newComparison])
    setIsComparisonVisible(true)
  }

  const removeFromComparison = (id) => {
    setComparisons(prev => prev.filter(item => item.id !== id))
  }

  const clearComparisons = () => {
    setComparisons([])
    setIsComparisonVisible(false)
  }

  const toggleComparisonVisibility = () => {
    setIsComparisonVisible(prev => !prev)
  }

  const value = {
    comparisons,
    isComparisonVisible,
    addToComparison,
    removeFromComparison,
    clearComparisons,
    toggleComparisonVisibility
  }

  return (
    <ComparisonContext.Provider value={value}>
      {children}
    </ComparisonContext.Provider>
  )
}
