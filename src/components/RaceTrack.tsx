import { motion } from 'framer-motion'
import { Car, Trophy, Zap } from 'lucide-react'

interface Player {
  id: string
  name: string
  progress: number
  wpm: number
  accuracy: number
  isFinished: boolean
  position?: number
}

interface RaceTrackProps {
  players: Player[]
  currentUserId?: string
}

export function RaceTrack({ players, currentUserId }: RaceTrackProps) {
  const trackColors = [
    'border-orange-500',
    'border-yellow-500', 
    'border-green-500',
    'border-blue-500',
    'border-purple-500',
    'border-pink-500'
  ]
  
  const carColors = [
    'text-orange-500',
    'text-yellow-500',
    'text-green-500', 
    'text-blue-500',
    'text-purple-500',
    'text-pink-500'
  ]

  return (
    <div className="space-y-4">
      {players.map((player, index) => {
        const isCurrentUser = player.id === currentUserId
        const trackColor = trackColors[index % trackColors.length]
        const carColor = carColors[index % carColors.length]
        
        return (
          <div key={player.id} className="relative">
            {/* Track */}
            <div className={`h-16 bg-gray-800 rounded-lg border-2 ${trackColor} relative overflow-hidden race-track`}>
              {/* Track lanes */}
              <div className="absolute inset-0 opacity-20">
                <div className="h-full border-l-2 border-dashed border-gray-600 ml-4"></div>
                <div className="absolute top-0 right-4 h-full border-r-2 border-dashed border-gray-600"></div>
              </div>
              
              {/* Finish line */}
              <div className="absolute right-0 top-0 w-2 h-full finish-line opacity-60"></div>
              
              {/* Car */}
              <motion.div
                className="absolute top-1/2 transform -translate-y-1/2 flex items-center space-x-2"
                initial={{ left: '8px' }}
                animate={{ 
                  left: `calc(${Math.min(player.progress, 100)}% - 32px)` 
                }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
              >
                <div className={`relative ${carColor}`}>
                  <Car size={24} className="drop-shadow-lg" />
                  {player.isFinished && player.position === 1 && (
                    <Trophy size={16} className="absolute -top-2 -right-2 text-yellow-400" />
                  )}
                  {player.wpm > 80 && (
                    <Zap size={12} className="absolute -top-1 -left-1 text-yellow-400 animate-pulse" />
                  )}
                </div>
              </motion.div>
              
              {/* Player info overlay */}
              <div className="absolute top-1 left-2 text-xs">
                <span className={`font-medium ${isCurrentUser ? 'text-orange-400' : 'text-white'}`}>
                  {player.name}
                  {isCurrentUser && ' (You)'}
                </span>
              </div>
              
              {/* Stats overlay */}
              <div className="absolute top-1 right-2 text-xs text-right">
                <div className="text-white">
                  {Math.round(player.wpm)} WPM
                </div>
                <div className="text-gray-400">
                  {Math.round(player.accuracy)}%
                </div>
              </div>
              
              {/* Position indicator */}
              {player.isFinished && player.position && (
                <div className="absolute bottom-1 right-2">
                  <div className={`
                    w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                    ${player.position === 1 ? 'bg-yellow-500 text-black' : 
                      player.position === 2 ? 'bg-gray-400 text-black' :
                      player.position === 3 ? 'bg-orange-600 text-white' :
                      'bg-gray-600 text-white'}
                  `}>
                    {player.position}
                  </div>
                </div>
              )}
            </div>
            
            {/* Progress percentage */}
            <div className="text-center mt-1">
              <span className="text-sm text-gray-400">
                {Math.round(player.progress)}%
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}