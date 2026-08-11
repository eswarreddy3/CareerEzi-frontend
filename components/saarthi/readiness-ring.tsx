"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

/**
 * Placement readiness as a ring wrapped around Saarthi.
 *
 * Colour tracks the band rather than a gradient, so the number and the hue
 * always agree — a student at 34 shouldn't see the same colour as one at 79.
 */
export function ReadinessRing({
  score,
  size = 172,
  stroke = 10,
  children,
  className,
}: {
  score: number
  size?: number
  stroke?: number
  children?: React.ReactNode
  className?: string
}) {
  const clamped = Math.max(0, Math.min(100, score))
  const r = (size - stroke) / 2 - 2
  const circumference = 2 * Math.PI * r
  const tone =
    clamped >= 80 ? "var(--success)"
    : clamped >= 60 ? "var(--primary)"
    : clamped >= 35 ? "var(--warning)"
    : "var(--muted-foreground)"

  return (
    <div className={cn("relative grid shrink-0 place-items-center", className)}
         style={{ width: size, height: size }}>
      <svg width={size} height={size} className="absolute inset-0 -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none"
                stroke="var(--border)" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={tone} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - (circumference * clamped) / 100 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={{ filter: `drop-shadow(0 0 5px ${tone})` }}
        />
      </svg>
      {children}
    </div>
  )
}

export function bandTone(score: number) {
  if (score >= 80) return "text-success"
  if (score >= 60) return "text-primary"
  if (score >= 35) return "text-warning"
  return "text-muted-foreground"
}
