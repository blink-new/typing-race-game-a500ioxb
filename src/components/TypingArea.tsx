import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface TypingAreaProps {
  phrase: string
  onProgress: (progress: number, wpm: number, accuracy: number) => void
  isRaceActive: boolean
  onComplete: () => void
}

export function TypingArea({ phrase, onProgress, isRaceActive, onComplete }: TypingAreaProps) {
  const [typedText, setTypedText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [errors, setErrors] = useState<number[]>([])
  const [startTime, setStartTime] = useState<number | null>(null)
  const [wpm, setWpm] = useState(0)
  const [accuracy, setAccuracy] = useState(100)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isRaceActive && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isRaceActive])

  useEffect(() => {
    if (typedText.length === phrase.length && typedText === phrase) {
      onComplete()
    }
  }, [typedText, phrase, onComplete])

  const calculateStats = (typed: string, timeElapsed: number) => {
    const wordsTyped = typed.length / 5 // Standard: 5 characters = 1 word
    const minutes = timeElapsed / 60000 // Convert to minutes
    const currentWpm = minutes > 0 ? Math.round(wordsTyped / minutes) : 0
    
    const correctChars = typed.split('').filter((char, i) => char === phrase[i]).length
    const currentAccuracy = typed.length > 0 ? Math.round((correctChars / typed.length) * 100) : 100
    
    return { wpm: currentWpm, accuracy: currentAccuracy }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isRaceActive) return
    
    const value = e.target.value
    const now = Date.now()
    
    if (startTime === null) {
      setStartTime(now)
    }
    
    // Prevent typing beyond phrase length
    if (value.length > phrase.length) return
    
    setTypedText(value)
    setCurrentIndex(value.length)
    
    // Track errors
    const newErrors: number[] = []
    for (let i = 0; i < value.length; i++) {
      if (value[i] !== phrase[i]) {
        newErrors.push(i)
      }
    }
    setErrors(newErrors)
    
    // Calculate stats
    if (startTime) {
      const timeElapsed = now - startTime
      const stats = calculateStats(value, timeElapsed)
      setWpm(stats.wpm)
      setAccuracy(stats.accuracy)
      
      const progress = (value.length / phrase.length) * 100
      onProgress(progress, stats.wpm, stats.accuracy)
    }
  }

  const renderPhrase = () => {
    return phrase.split('').map((char, index) => {
      let className = 'relative '
      
      if (index < typedText.length) {
        // Already typed
        if (errors.includes(index)) {
          className += 'bg-red-500/30 text-red-300' // Error
        } else {
          className += 'bg-green-500/30 text-green-300' // Correct
        }
      } else if (index === currentIndex) {
        // Current character
        className += 'bg-orange-500/50 text-orange-200 typing-cursor'
      } else {
        // Not yet typed
        className += 'text-gray-400'
      }
      
      return (
        <span key={index} className={className}>
          {char === ' ' ? '\u00A0' : char}
        </span>
      )
    })
  }

  return (
    <div className="space-y-6">
      {/* Phrase display */}
      <motion.div 
        className="bg-gray-800 rounded-lg p-6 border border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-2xl font-mono leading-relaxed tracking-wide">
          {renderPhrase()}
        </div>
      </motion.div>
      
      {/* Input area */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={typedText}
          onChange={handleInputChange}
          disabled={!isRaceActive}
          className="w-full p-4 text-xl font-mono bg-gray-900 border border-gray-600 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder={isRaceActive ? "Start typing..." : "Waiting for race to start..."}
          autoComplete="off"
          spellCheck={false}
        />
        
        {/* Stats overlay */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex space-x-4 text-sm">
          <div className="text-orange-400 font-medium">
            {wpm} WPM
          </div>
          <div className={`font-medium ${accuracy >= 95 ? 'text-green-400' : accuracy >= 85 ? 'text-yellow-400' : 'text-red-400'}`}>
            {accuracy}%
          </div>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="w-full bg-gray-700 rounded-full h-2">
        <motion.div
          className="h-2 racing-gradient rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${(typedText.length / phrase.length) * 100}%` }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        />
      </div>
    </div>
  )
}