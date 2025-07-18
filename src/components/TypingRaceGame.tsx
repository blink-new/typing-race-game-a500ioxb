import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Play, RotateCcw, Users } from 'lucide-react'
import { Button } from './ui/button'
import { SpeedGauge } from './SpeedGauge'
import { RaceTrack } from './RaceTrack'
import { TypingArea } from './TypingArea'
import { Countdown } from './Countdown'
import { Leaderboard } from './Leaderboard'
import { blink } from '../blink/client'

interface Player {
  id: string
  name: string
  progress: number
  wpm: number
  accuracy: number
  isFinished: boolean
  position?: number
}

const SAMPLE_PHRASES = [
  "The quick brown fox jumps over the lazy dog near the riverbank.",
  "Racing through the digital highways of tomorrow with lightning speed.",
  "Precision and accuracy are the keys to victory in this typing challenge.",
  "Champions are made through practice, dedication, and unwavering focus.",
  "Speed without accuracy is like a car without brakes on a mountain road."
]

export function TypingRaceGame() {
  const [gameState, setGameState] = useState<'waiting' | 'countdown' | 'racing' | 'finished'>('waiting')
  const [currentPhrase, setCurrentPhrase] = useState('')
  const [players, setPlayers] = useState<Player[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [userStats, setUserStats] = useState({ wpm: 0, accuracy: 100, progress: 0 })
  const [raceStartTime, setRaceStartTime] = useState<number | null>(null)

  // Initialize user and demo players
  useEffect(() => {
    const initializeGame = async () => {
      try {
        const user = await blink.auth.me()
        setCurrentUser(user)
        
        // Create demo players for the prototype
        const demoPlayers: Player[] = [
          {
            id: user.id,
            name: user.displayName || user.email?.split('@')[0] || 'You',
            progress: 0,
            wpm: 0,
            accuracy: 100,
            isFinished: false
          },
          {
            id: 'demo1',
            name: 'SpeedRacer',
            progress: 0,
            wpm: 0,
            accuracy: 100,
            isFinished: false
          },
          {
            id: 'demo2', 
            name: 'TypeMaster',
            progress: 0,
            wpm: 0,
            accuracy: 100,
            isFinished: false
          },
          {
            id: 'demo3',
            name: 'KeyboardNinja',
            progress: 0,
            wpm: 0,
            accuracy: 100,
            isFinished: false
          }
        ]
        
        setPlayers(demoPlayers)
        setCurrentPhrase(SAMPLE_PHRASES[Math.floor(Math.random() * SAMPLE_PHRASES.length)])
      } catch (error) {
        console.error('Failed to initialize game:', error)
      }
    }
    
    initializeGame()
  }, [])

  // Simulate other players' progress during race
  useEffect(() => {
    if (gameState !== 'racing' || !raceStartTime) return

    const interval = setInterval(() => {
      setPlayers(prevPlayers => 
        prevPlayers.map(player => {
          if (player.id === currentUser?.id || player.isFinished) return player
          
          // Simulate typing with some randomness
          const baseSpeed = 40 + Math.random() * 40 // 40-80 WPM base
          const timeElapsed = (Date.now() - raceStartTime) / 1000 / 60 // minutes
          const expectedProgress = Math.min((baseSpeed * 5 * timeElapsed / currentPhrase.length) * 100, 100)
          
          // Add some variance and occasional mistakes
          const variance = (Math.random() - 0.5) * 10
          const newProgress = Math.max(0, Math.min(100, expectedProgress + variance))
          
          const newWpm = Math.round(baseSpeed + (Math.random() - 0.5) * 20)
          const newAccuracy = Math.round(92 + Math.random() * 8) // 92-100%
          
          const isFinished = newProgress >= 100
          
          return {
            ...player,
            progress: newProgress,
            wpm: newWpm,
            accuracy: newAccuracy,
            isFinished
          }
        })
      )
    }, 500)

    return () => clearInterval(interval)
  }, [gameState, raceStartTime, currentUser?.id, currentPhrase.length])

  const startRace = () => {
    setGameState('countdown')
  }

  const handleCountdownComplete = () => {
    setGameState('racing')
    setRaceStartTime(Date.now())
  }

  const handleUserProgress = (progress: number, wpm: number, accuracy: number) => {
    setUserStats({ progress, wpm, accuracy })
    
    setPlayers(prevPlayers =>
      prevPlayers.map(player =>
        player.id === currentUser?.id
          ? { ...player, progress, wpm, accuracy }
          : player
      )
    )
  }

  const handleUserComplete = () => {
    setPlayers(prevPlayers =>
      prevPlayers.map(player =>
        player.id === currentUser?.id
          ? { ...player, isFinished: true, progress: 100 }
          : player
      )
    )
    
    // Check if race should end
    setTimeout(() => {
      setGameState('finished')
    }, 2000)
  }

  const resetRace = () => {
    setGameState('waiting')
    setRaceStartTime(null)
    setUserStats({ wpm: 0, accuracy: 100, progress: 0 })
    setCurrentPhrase(SAMPLE_PHRASES[Math.floor(Math.random() * SAMPLE_PHRASES.length)])
    
    setPlayers(prevPlayers =>
      prevPlayers.map(player => ({
        ...player,
        progress: 0,
        wpm: 0,
        accuracy: 100,
        isFinished: false,
        position: undefined
      }))
    )
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-white mb-4">Loading...</div>
          <div className="text-gray-400">Preparing your racing experience</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      {gameState === 'countdown' && (
        <Countdown onComplete={handleCountdownComplete} />
      )}
      
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-6"
        >
          <h1 className="text-4xl font-bold racing-gradient bg-clip-text text-transparent mb-2">
            🏁 Typing Race Arena
          </h1>
          <p className="text-gray-400">
            Race against others to type the fastest with the highest accuracy!
          </p>
        </motion.div>

        {/* Game controls */}
        <div className="flex justify-center space-x-4">
          {gameState === 'waiting' && (
            <Button
              onClick={startRace}
              size="lg"
              className="racing-gradient text-white font-bold px-8 py-3"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Race
            </Button>
          )}
          
          {(gameState === 'finished' || gameState === 'racing') && (
            <Button
              onClick={resetRace}
              variant="outline"
              size="lg"
              className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-8 py-3"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              New Race
            </Button>
          )}
          
          <div className="flex items-center space-x-2 px-4 py-2 bg-gray-800 rounded-lg border border-gray-700">
            <Users className="w-5 h-5 text-gray-400" />
            <span className="text-gray-300">{players.length} Players</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main game area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Speed gauge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-800 rounded-lg p-6 border border-gray-700"
            >
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-white mb-2">Your Speed</h3>
                <SpeedGauge wpm={userStats.wpm} />
                <div className="mt-4 flex justify-center space-x-6 text-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-400">{Math.round(userStats.accuracy)}%</div>
                    <div className="text-gray-400">Accuracy</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">{Math.round(userStats.progress)}%</div>
                    <div className="text-gray-400">Progress</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Race tracks */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800 rounded-lg p-6 border border-gray-700"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Race Track</h3>
              <RaceTrack players={players} currentUserId={currentUser.id} />
            </motion.div>

            {/* Typing area */}
            {currentPhrase && (
              <TypingArea
                phrase={currentPhrase}
                onProgress={handleUserProgress}
                isRaceActive={gameState === 'racing'}
                onComplete={handleUserComplete}
              />
            )}
          </div>

          {/* Leaderboard */}
          <div className="space-y-6">
            <Leaderboard players={players} currentUserId={currentUser.id} />
            
            {/* Game status */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gray-800 rounded-lg p-6 border border-gray-700"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Race Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span className={`font-medium ${
                    gameState === 'waiting' ? 'text-yellow-400' :
                    gameState === 'countdown' ? 'text-orange-400' :
                    gameState === 'racing' ? 'text-green-400' :
                    'text-blue-400'
                  }`}>
                    {gameState === 'waiting' ? 'Waiting' :
                     gameState === 'countdown' ? 'Starting...' :
                     gameState === 'racing' ? 'Racing!' :
                     'Finished'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Phrase Length:</span>
                  <span className="text-white">{currentPhrase.length} chars</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Players Ready:</span>
                  <span className="text-white">{players.length}/4</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}