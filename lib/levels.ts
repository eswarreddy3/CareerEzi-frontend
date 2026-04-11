export interface Level {
  level: number
  name: string
  emoji: string
  minPoints: number
  maxPoints: number        // -1 = no cap (top level)
  color: string            // tailwind text color
  glow: string             // box-shadow style
  barColor: string         // progress bar fill
}

export const LEVELS: Level[] = [
  { level: 1, name: "Rookie",     emoji: "🌱", minPoints: 0,    maxPoints: 200,  color: "text-slate-400",   glow: "0 0 12px rgba(148,163,184,0.4)", barColor: "#94A3B8" },
  { level: 2, name: "Apprentice", emoji: "⚡", minPoints: 201,  maxPoints: 500,  color: "text-blue-400",    glow: "0 0 12px rgba(96,165,250,0.4)",  barColor: "#60A5FA" },
  { level: 3, name: "Coder",      emoji: "💻", minPoints: 501,  maxPoints: 1000, color: "text-cyan-400",    glow: "0 0 14px rgba(34,211,238,0.4)", barColor: "#22D3EE" },
  { level: 4, name: "Builder",    emoji: "🔧", minPoints: 1001, maxPoints: 1700, color: "text-teal-400",    glow: "0 0 14px rgba(45,212,191,0.4)", barColor: "#2DD4BF" },
  { level: 5, name: "Developer",  emoji: "🚀", minPoints: 1701, maxPoints: 2700, color: "text-emerald-400", glow: "0 0 16px rgba(52,211,153,0.5)", barColor: "#34D399" },
  { level: 6, name: "Engineer",   emoji: "⚙️", minPoints: 2701, maxPoints: 4500, color: "text-yellow-400",  glow: "0 0 16px rgba(250,204,21,0.5)", barColor: "#FACC15" },
  { level: 7, name: "Hacker",     emoji: "🎯", minPoints: 4501, maxPoints: 6000, color: "text-orange-400",  glow: "0 0 18px rgba(251,146,60,0.5)", barColor: "#FB923C" },
  { level: 8, name: "Expert",     emoji: "🔥", minPoints: 6001, maxPoints: 7000, color: "text-red-400",     glow: "0 0 20px rgba(248,113,113,0.6)", barColor: "#F87171" },
  { level: 9, name: "Master",     emoji: "💎", minPoints: 7001, maxPoints: -1,   color: "text-violet-400",  glow: "0 0 22px rgba(167,139,250,0.6)", barColor: "#A78BFA" },
]

export function getLevel(points: number): Level {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (points >= LEVELS[i].minPoints) return LEVELS[i]
  }
  return LEVELS[0]
}

export function getLevelProgress(points: number): {
  current: Level
  next: Level | null
  progressPct: number
  pointsInLevel: number
  pointsNeeded: number
} {
  const current = getLevel(points)
  const next = current.level < LEVELS.length ? LEVELS[current.level] : null  // next level (0-indexed offset by 1)

  if (!next) {
    return { current, next: null, progressPct: 100, pointsInLevel: points - current.minPoints, pointsNeeded: 0 }
  }

  const span = next.minPoints - current.minPoints
  const earned = points - current.minPoints
  const progressPct = Math.min(100, Math.round((earned / span) * 100))

  return {
    current,
    next,
    progressPct,
    pointsInLevel: earned,
    pointsNeeded: next.minPoints - points,
  }
}
