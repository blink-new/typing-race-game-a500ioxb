import { motion } from 'framer-motion'

interface SpeedGaugeProps {
  wpm: number
  maxWpm?: number
}

export function SpeedGauge({ wpm, maxWpm = 120 }: SpeedGaugeProps) {
  // Calculate angle for needle (0-180 degrees)
  const angle = Math.min((wpm / maxWpm) * 180, 180)
  
  return (
    <div className="relative w-32 h-16 mx-auto">
      {/* Gauge background */}
      <div className="absolute inset-0">
        <svg viewBox="0 0 200 100" className="w-full h-full">
          {/* Background arc */}
          <path
            d="M 20 80 A 80 80 0 0 1 180 80"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="8"
            className="opacity-30"
          />
          
          {/* Speed zones */}
          <path
            d="M 20 80 A 80 80 0 0 1 100 20"
            fill="none"
            stroke="hsl(var(--racing-success))"
            strokeWidth="8"
            className="opacity-60"
          />
          <path
            d="M 100 20 A 80 80 0 0 1 140 40"
            fill="none"
            stroke="hsl(var(--racing-yellow))"
            strokeWidth="8"
            className="opacity-60"
          />
          <path
            d="M 140 40 A 80 80 0 0 1 180 80"
            fill="none"
            stroke="hsl(var(--racing-orange))"
            strokeWidth="8"
            className="opacity-60"
          />
          
          {/* Speed markers */}
          {[0, 30, 60, 90, 120].map((speed, i) => {
            const markerAngle = (speed / maxWpm) * 180
            const x1 = 100 + 70 * Math.cos((markerAngle - 90) * Math.PI / 180)
            const y1 = 80 + 70 * Math.sin((markerAngle - 90) * Math.PI / 180)
            const x2 = 100 + 60 * Math.cos((markerAngle - 90) * Math.PI / 180)
            const y2 = 80 + 60 * Math.sin((markerAngle - 90) * Math.PI / 180)
            
            return (
              <g key={speed}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="hsl(var(--foreground))"
                  strokeWidth="2"
                  className="opacity-60"
                />
                <text
                  x={100 + 50 * Math.cos((markerAngle - 90) * Math.PI / 180)}
                  y={80 + 50 * Math.sin((markerAngle - 90) * Math.PI / 180)}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-xs fill-current opacity-60"
                >
                  {speed}
                </text>
              </g>
            )
          })}
          
          {/* Needle */}
          <motion.line
            x1="100"
            y1="80"
            x2={100 + 55 * Math.cos((angle - 90) * Math.PI / 180)}
            y2={80 + 55 * Math.sin((angle - 90) * Math.PI / 180)}
            stroke="hsl(var(--racing-orange))"
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ rotate: -90 }}
            animate={{ rotate: angle - 90 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            style={{ transformOrigin: "100px 80px" }}
          />
          
          {/* Center dot */}
          <circle
            cx="100"
            cy="80"
            r="4"
            fill="hsl(var(--racing-orange))"
          />
        </svg>
      </div>
      
      {/* WPM display */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-center">
        <div className="text-2xl font-bold text-orange-400">{Math.round(wpm)}</div>
        <div className="text-xs text-muted-foreground">WPM</div>
      </div>
    </div>
  )
}