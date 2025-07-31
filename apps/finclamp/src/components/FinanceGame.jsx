import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCurrency } from '../contexts/CurrencyContext'
import ParticleEffect from './ParticleEffect'
import { getTotalQuestions, questionCategories } from '../data/financeQuestions'
import { useQuestionLoader } from '../utils/questionLoader'

const FinanceGame = () => {
  const { formatCurrency } = useCurrency()
  const { getRandomQuestions, preloadAllLevels } = useQuestionLoader()
  const [gameState, setGameState] = useState('menu') // menu, playing, gameOver, victory
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [lives, setLives] = useState(3)
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [timeLeft, setTimeLeft] = useState(30)
  const [streak, setStreak] = useState(0)
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('financeGameHighScore') || '0')
  })
  const [showParticles, setShowParticles] = useState(false)
  const [particleType, setParticleType] = useState('success')
  const [usedQuestionIds, setUsedQuestionIds] = useState([])
  const [totalQuestionsAvailable] = useState(getTotalQuestions())

  // Generate random question based on level without repetition
  const generateQuestion = useCallback(async () => {
    try {
      const questions = await getRandomQuestions(Math.min(level, 3), 1, usedQuestionIds)

      if (questions.length === 0) {
        // If no more questions available for this level, reset used questions
        if (usedQuestionIds.length > 0) {
          setUsedQuestionIds([])
          const freshQuestions = await getRandomQuestions(Math.min(level, 3), 1, [])
          if (freshQuestions.length > 0) {
            setCurrentQuestion(freshQuestions[0])
            setUsedQuestionIds([freshQuestions[0].id])
          }
        } else {
          // This shouldn't happen with 100+ questions, but just in case
          endGame()
          return
        }
      } else {
        setCurrentQuestion(questions[0])
        setUsedQuestionIds(prev => [...prev, questions[0].id])
      }

      setSelectedAnswer(null)
    } catch (error) {
      console.error('Error generating question:', error)
      // Fallback to end game if question loading fails
      endGame()
    }
  }, [level, usedQuestionIds, getRandomQuestions])

  // Start game
  const startGame = () => {
    setGameState('playing')
    setScore(0)
    setLevel(1)
    setLives(3)
    setTimeLeft(30)
    setStreak(0)
    setUsedQuestionIds([]) // Reset used questions for new game
    generateQuestion()
  }

  // Handle answer selection
  const handleAnswer = (answerIndex) => {
    setSelectedAnswer(answerIndex)
    
    setTimeout(() => {
      if (answerIndex === currentQuestion.correct) {
        const points = (level * 100) + (streak * 50) + Math.floor(timeLeft * 2)
        setScore(prev => prev + points)
        setStreak(prev => prev + 1)

        // Trigger success particles
        setParticleType('success')
        setShowParticles(Date.now())

        // Level up every 5 correct answers
        if ((score + points) >= level * 500) {
          setLevel(prev => prev + 1)
          setTimeLeft(30) // Reset timer for new level
        }

        generateQuestion()
      } else {
        setLives(prev => prev - 1)
        setStreak(0)

        // Trigger failure particles
        setParticleType('failure')
        setShowParticles(Date.now())

        if (lives <= 1) {
          endGame()
        } else {
          generateQuestion()
        }
      }
      setSelectedAnswer(null)
    }, 1500)
  }

  // End game
  const endGame = () => {
    setGameState('gameOver')
    if (score > highScore) {
      setHighScore(score)
      localStorage.setItem('financeGameHighScore', score.toString())
    }
  }

  // Preload questions on component mount for better performance
  useEffect(() => {
    const preloadQuestions = async () => {
      try {
        await preloadAllLevels()
        console.log('All question levels preloaded successfully')
      } catch (error) {
        console.error('Failed to preload questions:', error)
      }
    }

    preloadQuestions()
  }, []) // Empty dependency array to run only once on mount

  // Timer effect
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && gameState === 'playing') {
      setLives(prev => prev - 1)
      if (lives <= 1) {
        endGame()
      } else {
        setTimeLeft(30)
        generateQuestion()
      }
    }
  }, [timeLeft, gameState, lives, generateQuestion])

  // Floating background elements
  const FloatingElements = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-4xl opacity-10"
          initial={{
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + 100,
            rotate: 0
          }}
          animate={{
            y: -100,
            rotate: 360,
            x: Math.random() * window.innerWidth
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 5
          }}
        >
          {['💰', '📈', '💎', '🏦', '💳', '📊', '💸', '🎯'][Math.floor(Math.random() * 8)]}
        </motion.div>
      ))}
    </div>
  )

  // Menu Screen
  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 relative">
        <FloatingElements />
        <ParticleEffect trigger={showParticles} type={particleType} />
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center text-white max-w-2xl"
        >
          <motion.h1 
            className="text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent"
            animate={{ 
              scale: [1, 1.05, 1],
              rotate: [0, 1, -1, 0]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            💰 Finance Quest
          </motion.h1>
          
          <p className="text-xl mb-8 text-blue-200">
            Test your financial knowledge in this fast-paced quiz game!
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl mb-2">🎯</div>
              <h3 className="font-semibold">Multiple Levels</h3>
              <p className="text-sm text-blue-200">Progress through increasingly difficult financial concepts</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl mb-2">⏱️</div>
              <h3 className="font-semibold">Time Challenge</h3>
              <p className="text-sm text-blue-200">Answer quickly to earn bonus points</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl mb-2">🏆</div>
              <h3 className="font-semibold">High Score</h3>
              <p className="text-sm text-blue-200">Beat your personal best: {formatCurrency(highScore)}</p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-8">
            <div className="text-center">
              <div className="text-2xl mb-2">📚</div>
              <h3 className="font-semibold text-lg">Question Bank</h3>
              <p className="text-blue-200">
                {totalQuestionsAvailable}+ comprehensive financial questions covering:
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-2">
                {Object.values(questionCategories).map((category, index) => (
                  <span key={index} className="bg-blue-500/20 px-2 py-1 rounded text-xs">
                    {category}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <motion.button
            onClick={startGame}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-full text-xl shadow-lg transform transition-all duration-200 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🚀 Start Game
          </motion.button>
        </motion.div>
      </div>
    )
  }

  // Game Screen
  if (gameState === 'playing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 relative">
        <FloatingElements />
        <ParticleEffect trigger={showParticles} type={particleType} />
        {/* Game HUD */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-white text-center">
              <div>
                <div className="text-2xl mb-1">💰</div>
                <div className="text-xs text-blue-200">Score:</div>
                <div className="font-bold text-yellow-400 text-sm">{formatCurrency(score)}</div>
              </div>
              <div>
                <div className="text-2xl mb-1">📈</div>
                <div className="text-xs text-blue-200">Level:</div>
                <div className="font-bold text-green-400 text-lg">{level}</div>
              </div>
              <div>
                <div className="text-2xl mb-1">🔥</div>
                <div className="text-xs text-blue-200">Streak:</div>
                <div className="font-bold text-orange-400 text-lg">{streak}</div>
              </div>
              <div>
                <div className="text-2xl mb-1">📝</div>
                <div className="text-xs text-blue-200">Questions:</div>
                <div className="font-bold text-purple-400 text-lg">{usedQuestionIds.length}</div>
              </div>
            </div>

            <div className="flex justify-center items-center space-x-6 mt-4 pt-4 border-t border-white/20">
              <div className="flex space-x-1">
                {[...Array(3)].map((_, i) => (
                  <span key={i} className={`text-2xl ${i < lives ? 'text-red-500' : 'text-gray-600'}`}>
                    ❤️
                  </span>
                ))}
              </div>
              <div className={`text-xl font-bold ${timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-blue-400'}`}>
                ⏱️ {timeLeft}s
              </div>
            </div>
          </div>

          {/* Question */}
          <AnimatePresence mode="wait">
            {currentQuestion && (
              <motion.div
                key={currentQuestion.question}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-6"
              >
                <h2 className="text-2xl font-bold text-white mb-6 text-center">
                  {currentQuestion.question}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentQuestion.options.map((option, index) => (
                    <motion.button
                      key={index}
                      onClick={() => handleAnswer(index)}
                      disabled={selectedAnswer !== null}
                      className={`p-4 rounded-xl text-lg font-semibold transition-all duration-300 ${
                        selectedAnswer === null
                          ? 'bg-white/20 hover:bg-white/30 text-white hover:scale-105 cursor-pointer'
                          : selectedAnswer === index
                          ? index === currentQuestion.correct
                            ? 'bg-green-500 text-white cursor-default'
                            : 'bg-red-500 text-white cursor-default'
                          : index === currentQuestion.correct
                          ? 'bg-green-500 text-white cursor-default'
                          : 'bg-white/10 text-gray-400 cursor-default'
                      }`}
                      whileHover={selectedAnswer === null ? { scale: 1.02 } : {}}
                      whileTap={selectedAnswer === null ? { scale: 0.98 } : {}}
                    >
                      {option}
                    </motion.button>
                  ))}
                </div>
                
                {selectedAnswer !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-4 bg-blue-500/20 rounded-lg"
                  >
                    <p className="text-blue-200 text-center">
                      {currentQuestion.explanation}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    )
  }

  // Game Over Screen
  if (gameState === 'gameOver') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 relative">
        <FloatingElements />
        <ParticleEffect trigger={showParticles} type={particleType} />
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center text-white max-w-2xl"
        >
          <motion.h1 
            className="text-5xl font-bold mb-4 text-red-400"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            💸 Game Over!
          </motion.h1>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Final Score</h3>
                <p className="text-3xl font-bold text-yellow-400">{formatCurrency(score)}</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Level Reached</h3>
                <p className="text-3xl font-bold text-green-400">{level}</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Best Streak</h3>
                <p className="text-3xl font-bold text-orange-400">{streak}</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">High Score</h3>
                <p className="text-3xl font-bold text-purple-400">{formatCurrency(highScore)}</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              onClick={startGame}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-full cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🔄 Play Again
            </motion.button>
            <motion.button
              onClick={() => setGameState('menu')}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-full cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🏠 Main Menu
            </motion.button>
          </div>
        </motion.div>
      </div>
    )
  }

  return null
}

export default FinanceGame
