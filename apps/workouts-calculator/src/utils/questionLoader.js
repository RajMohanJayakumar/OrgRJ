// Question Loader Utility - Optimized loading for large question banks
// Implements lazy loading and caching to prevent performance issues

class QuestionLoader {
  constructor() {
    this.cache = new Map()
    this.loadedLevels = new Set()
    this.isLoading = false
  }

  // Lazy load questions for a specific level
  async loadQuestionsForLevel(level) {
    if (this.loadedLevels.has(level) || this.isLoading) {
      return this.cache.get(`level${level}`) || []
    }

    this.isLoading = true

    try {
      // Dynamic import to load questions only when needed
      const { financeQuestions } = await import('../data/financeQuestions.js')
      
      // Cache the questions for this level
      const levelQuestions = financeQuestions[`level${level}`] || []
      this.cache.set(`level${level}`, levelQuestions)
      this.loadedLevels.add(level)
      
      return levelQuestions
    } catch (error) {
      console.error(`Failed to load questions for level ${level}:`, error)
      return []
    } finally {
      this.isLoading = false
    }
  }

  // Get random questions with performance optimization
  async getRandomQuestions(level, count = 10, excludeIds = []) {
    const questions = await this.loadQuestionsForLevel(level)
    const availableQuestions = questions.filter(q => !excludeIds.includes(q.id))
    
    // Use efficient shuffling for large arrays
    return this.shuffleArray(availableQuestions).slice(0, Math.min(count, availableQuestions.length))
  }

  // Fisher-Yates shuffle algorithm - O(n) time complexity
  shuffleArray(array) {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  // Preload questions for better performance
  async preloadAllLevels() {
    const levels = [1, 2, 3]
    const promises = levels.map(level => this.loadQuestionsForLevel(level))
    await Promise.all(promises)
  }

  // Get cache statistics
  getCacheStats() {
    return {
      loadedLevels: Array.from(this.loadedLevels),
      cacheSize: this.cache.size,
      totalCachedQuestions: Array.from(this.cache.values()).reduce((total, questions) => total + questions.length, 0)
    }
  }

  // Clear cache to free memory
  clearCache() {
    this.cache.clear()
    this.loadedLevels.clear()
  }
}

// Singleton instance for global use
export const questionLoader = new QuestionLoader()

// React hook for using question loader
export const useQuestionLoader = () => {
  return {
    loadQuestionsForLevel: questionLoader.loadQuestionsForLevel.bind(questionLoader),
    getRandomQuestions: questionLoader.getRandomQuestions.bind(questionLoader),
    preloadAllLevels: questionLoader.preloadAllLevels.bind(questionLoader),
    getCacheStats: questionLoader.getCacheStats.bind(questionLoader),
    clearCache: questionLoader.clearCache.bind(questionLoader)
  }
}

// Performance monitoring
export const measureQuestionLoadTime = async (loadFunction) => {
  const startTime = performance.now()
  const result = await loadFunction()
  const endTime = performance.now()
  
  console.log(`Question loading took ${endTime - startTime} milliseconds`)
  return result
}

// Memory usage monitoring
export const getMemoryUsage = () => {
  if (performance.memory) {
    return {
      usedJSHeapSize: performance.memory.usedJSHeapSize,
      totalJSHeapSize: performance.memory.totalJSHeapSize,
      jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
    }
  }
  return null
}
