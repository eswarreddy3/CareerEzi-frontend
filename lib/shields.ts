export interface Shield {
  tier: number
  name: string
  emoji: string
  minPoints: number
  maxPoints: number       // -1 = no cap (top tier)
  gradientFrom: string    // CSS hex color
  gradientTo: string
  glowColor: string       // rgba for box-shadow
  badgeClass: string      // Tailwind classes for badge pill
  labelColor: string      // Tailwind text color
}

export const SHIELDS: Shield[] = [
  {
    tier: 0,
    name: "Unranked",
    emoji: "—",
    minPoints: 0,
    maxPoints: 199,
    gradientFrom: "transparent",
    gradientTo: "transparent",
    glowColor: "transparent",
    badgeClass: "text-muted-foreground border-border bg-secondary/50",
    labelColor: "text-muted-foreground",
  },
  {
    tier: 1,
    name: "Bronze",
    emoji: "🥉",
    minPoints: 200,
    maxPoints: 599,
    gradientFrom: "#CD7F32",
    gradientTo: "#8B4513",
    glowColor: "rgba(205,127,50,0.55)",
    badgeClass: "text-amber-700 border-amber-600/50 bg-amber-600/10 dark:text-amber-500",
    labelColor: "text-amber-600 dark:text-amber-500",
  },
  {
    tier: 2,
    name: "Silver",
    emoji: "🥈",
    minPoints: 600,
    maxPoints: 1499,
    gradientFrom: "#D8D8D8",
    gradientTo: "#909090",
    glowColor: "rgba(192,192,192,0.6)",
    badgeClass: "text-slate-400 border-slate-400/50 bg-slate-400/10",
    labelColor: "text-slate-400",
  },
  {
    tier: 3,
    name: "Gold",
    emoji: "🥇",
    minPoints: 1500,
    maxPoints: 3499,
    gradientFrom: "#FFD700",
    gradientTo: "#FFA500",
    glowColor: "rgba(255,215,0,0.6)",
    badgeClass: "text-yellow-400 border-yellow-400/50 bg-yellow-400/10",
    labelColor: "text-yellow-400",
  },
  {
    tier: 4,
    name: "Platinum",
    emoji: "💠",
    minPoints: 3500,
    maxPoints: 6999,
    gradientFrom: "#B48FDE",
    gradientTo: "#7C3AED",
    glowColor: "rgba(167,139,250,0.6)",
    badgeClass: "text-violet-400 border-violet-400/50 bg-violet-400/10",
    labelColor: "text-violet-400",
  },
  {
    tier: 5,
    name: "Diamond",
    emoji: "💎",
    minPoints: 7000,
    maxPoints: -1,
    gradientFrom: "#67E8F9",
    gradientTo: "#3B82F6",
    glowColor: "rgba(34,211,238,0.65)",
    badgeClass: "text-cyan-400 border-cyan-400/50 bg-cyan-400/10",
    labelColor: "text-cyan-400",
  },
]

export function getShield(points: number): Shield {
  for (let i = SHIELDS.length - 1; i >= 0; i--) {
    if (points >= SHIELDS[i].minPoints) return SHIELDS[i]
  }
  return SHIELDS[0]
}

export function getShieldProgress(points: number): {
  current: Shield
  next: Shield | null
  progressPct: number
  pointsNeeded: number
} {
  const current = getShield(points)
  const next = current.tier < SHIELDS.length - 1 ? SHIELDS[current.tier + 1] : null

  if (!next) {
    return { current, next: null, progressPct: 100, pointsNeeded: 0 }
  }

  const span = next.minPoints - current.minPoints
  const earned = points - current.minPoints
  const progressPct = Math.min(100, Math.round((earned / span) * 100))

  return { current, next, progressPct, pointsNeeded: next.minPoints - points }
}
