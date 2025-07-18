import { motion } from 'framer-motion'
import { Trophy, Medal, Award, Zap } from 'lucide-react'

interface Player {
  id: string
  name: string
  wpm: number
  accuracy: number
  progress: number
  isFinished: boolean
  position?: number
}

interface LeaderboardProps {
  players: Player[]
  currentUserId?: string
}

export function Leaderboard({ players, currentUserId }: LeaderboardProps) {
  // Sort players by progress (for live leaderboard) or position (for final results)
  const sortedPlayers = [...players].sort((a, b) => {
    if (a.isFinished && b.isFinished) {
      return (a.position || 999) - (b.position || 999)
    }
    if (a.isFinished && !b.isFinished) return -1
    if (!a.isFinished && b.isFinished) return 1
    return b.progress - a.progress
  })

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-400" />
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />
      case 3:
        return <Award className="w-5 h-5 text-orange-600" />
      default:
        return <div className="w-5 h-5 flex items-center justify-center text-sm font-bold text-gray-400">{position}</div>
    }
  }

  const getPositionColor = (position: number) => {
    switch (position) {
      case 1:
        return 'border-yellow-400 bg-yellow-400/10'
      case 2:
        return 'border-gray-400 bg-gray-400/10'
      case 3:
        return 'border-orange-600 bg-orange-600/10'
      default:
        return 'border-gray-600 bg-gray-600/10'
    }
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center space-x-2 mb-4">
        <Trophy className="w-6 h-6 text-yellow-400" />
        <h2 className="text-xl font-bold text-white">Live Leaderboard</h2>
      </div>
      
      <div className="space-y-3">
        {sortedPlayers.map((player, index) => {
          const position = index + 1
          const isCurrentUser = player.id === currentUserId
          
          return (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`
                flex items-center space-x-4 p-3 rounded-lg border-2 transition-all
                ${isCurrentUser ? 'border-orange-500 bg-orange-500/10' : getPositionColor(position)}
                ${player.isFinished ? 'opacity-100' : 'opacity-80'}
              `}
            >
              {/* Position */}
              <div className="flex-shrink-0">
                {getPositionIcon(position)}
              </div>
              
              {/* Player info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className={`font-medium truncate ${isCurrentUser ? 'text-orange-400' : 'text-white'}`}>
                    {player.name}
                    {isCurrentUser && ' (You)'}
                  </span>
                  {player.wpm > 100 && (
                    <Zap className="w-4 h-4 text-yellow-400" />
                  )}
                </div>
                
                {/* Progress bar */}
                <div className="w-full bg-gray-700 rounded-full h-1.5 mt-1">
                  <motion.div
                    className={`h-1.5 rounded-full ${
                      player.isFinished ? 'bg-green-400' : 'racing-gradient'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${player.progress}%` }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  />
                </div>
              </div>
              
              {/* Stats */}
              <div className="flex-shrink-0 text-right">
                <div className="text-sm font-medium text-white">
                  {Math.round(player.wpm)} WPM
                </div>
                <div className={`text-xs ${
                  player.accuracy >= 95 ? 'text-green-400' : 
                  player.accuracy >= 85 ? 'text-yellow-400' : 
                  'text-red-400'
                }`}>
                  {Math.round(player.accuracy)}%
                </div>
              </div>
              
              {/* Status */}
              <div className="flex-shrink-0">
                {player.isFinished ? (
                  <div className="text-green-400 text-sm font-medium">
                    Finished
                  </div>
                ) : (
                  <div className="text-gray-400 text-sm">
                    {Math.round(player.progress)}%
                  </div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
      
      {/* Race stats */}
      <div className="mt-4 pt-4 border-t border-gray-700">
        <div className="flex justify-between text-sm text-gray-400">
          <span>Players: {players.length}</span>
          <span>Finished: {players.filter(p => p.isFinished).length}</span>
        </div>
      </div>
    </div>
  )
}