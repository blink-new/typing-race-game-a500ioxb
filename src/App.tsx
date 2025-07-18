import { useState, useEffect } from 'react'
import { TypingRaceGame } from './components/TypingRaceGame'
import { blink } from './blink/client'

function App() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl font-bold racing-gradient bg-clip-text text-transparent mb-4">
            🏁 Typing Race Arena
          </div>
          <div className="text-xl text-gray-400">Loading your racing experience...</div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-4xl font-bold racing-gradient bg-clip-text text-transparent mb-6">
            🏁 Typing Race Arena
          </div>
          <div className="text-xl text-gray-300 mb-6">
            Ready to race? Sign in to compete against other players!
          </div>
          <div className="text-gray-400 mb-8">
            Test your typing speed and accuracy in real-time multiplayer races.
          </div>
          <button
            onClick={() => blink.auth.login()}
            className="racing-gradient text-white font-bold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity"
          >
            Sign In to Race
          </button>
        </div>
      </div>
    )
  }

  return <TypingRaceGame />
}

export default App