import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface CountdownProps {
  onComplete: () => void
  duration?: number
}

export function Countdown({ onComplete, duration = 3 }: CountdownProps) {
  const [count, setCount] = useState(duration)

  useEffect(() => {
    if (count > 0) {
      const timer = setTimeout(() => {
        setCount(count - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else {
      onComplete()
    }
  }, [count, onComplete])

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <AnimatePresence mode="wait">
        {count > 0 ? (
          <motion.div
            key={count}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-center"
          >
            <div className="text-8xl font-bold racing-gradient bg-clip-text text-transparent mb-4">
              {count}
            </div>
            <div className="text-2xl text-gray-300">
              Get ready to race!
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="go"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-center"
          >
            <div className="text-8xl font-bold text-green-400 mb-4">
              GO!
            </div>
            <div className="text-2xl text-gray-300">
              Start typing!
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}