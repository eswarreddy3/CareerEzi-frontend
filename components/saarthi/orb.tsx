"use client"

/**
 * Saarthi — the AI companion's face.
 *
 * सारथी, "the one who steers the chariot": Krishna was Arjuna's saarthi — not
 * the one who fought the battle, but the one who guided the fighter to it.
 *
 * Deliberately an abstract orb rather than a fifth creature. The four course
 * mascots (components/course-mascot/) are a snake, golem, robot and wizard;
 * another animal would read as one more course mascot instead of a
 * platform-wide companion.
 *
 * What makes it feel alive, in order of effect per line of code:
 *   1. Gaze tracking      — pupils follow the cursor
 *   2. Never perfectly still — breathing + randomised blinks
 *   3. Mood, not stage    — reacts to context rather than progress
 *
 * All colour comes from design tokens. Never hardcode hex here.
 */

import { useEffect, useRef, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"

export type SaarthiMood =
  | "idle"
  | "thinking"
  | "speaking"
  | "listening"
  | "celebrating"
  | "concerned"
  | "asleep"

/** Per-mood palette + motion. Colours are token references, resolved by CSS. */
const MOOD: Record<
  SaarthiMood,
  { from: string; to: string; glow: string; breathe: number; glowOpacity: number[] }
> = {
  idle:        { from: "var(--primary)", to: "var(--coding)",  glow: "var(--primary)", breathe: 4.0, glowOpacity: [0.28, 0.45, 0.28] },
  thinking:    { from: "var(--primary)", to: "var(--coding)",  glow: "var(--coding)",  breathe: 1.6, glowOpacity: [0.35, 0.7, 0.35] },
  speaking:    { from: "var(--primary)", to: "var(--coding)",  glow: "var(--primary)", breathe: 2.2, glowOpacity: [0.4, 0.62, 0.4] },
  listening:   { from: "var(--coding)",  to: "var(--primary)", glow: "var(--coding)",  breathe: 2.0, glowOpacity: [0.3, 0.66, 0.3] },
  celebrating: { from: "var(--success)", to: "var(--primary)", glow: "var(--success)", breathe: 0.9, glowOpacity: [0.45, 0.8, 0.45] },
  concerned:   { from: "var(--warning)", to: "var(--streak)",  glow: "var(--warning)", breathe: 3.2, glowOpacity: [0.25, 0.42, 0.25] },
  asleep:      { from: "var(--muted-foreground)", to: "var(--muted-foreground)", glow: "var(--muted-foreground)", breathe: 6.0, glowOpacity: [0.1, 0.18, 0.1] },
}

interface SaarthiOrbProps {
  mood?: SaarthiMood
  size?: number
  /** Pupils follow the cursor. Disable for purely decorative instances. */
  gaze?: boolean
  className?: string
  title?: string
}

export function SaarthiOrb({
  mood = "idle",
  size = 96,
  gaze = true,
  className,
  title = "Saarthi",
}: SaarthiOrbProps) {
  const reduced = useReducedMotion()
  const wrapRef = useRef<HTMLDivElement>(null)
  const [pupil, setPupil] = useState({ x: 0, y: 0 })
  const [blinking, setBlinking] = useState(false)
  const [awake, setAwake] = useState(true)

  const m = MOOD[mood]
  const asleep = mood === "asleep"
  const still = reduced || asleep || !awake

  // Halt every animation loop when the tab is hidden. Students are on low-end
  // Android and the dashboard already runs framer-motion plus a 365-day heatmap.
  useEffect(() => {
    const onVis = () => setAwake(!document.hidden)
    document.addEventListener("visibilitychange", onVis)
    return () => document.removeEventListener("visibilitychange", onVis)
  }, [])

  // Gaze tracking — the single highest-impact detail. Nothing reads as alive
  // like being looked at.
  useEffect(() => {
    if (!gaze || still) return
    let frame = 0
    const onMove = (e: MouseEvent) => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        const el = wrapRef.current
        if (!el) return
        const r = el.getBoundingClientRect()
        const dx = e.clientX - (r.left + r.width / 2)
        const dy = e.clientY - (r.top + r.height / 2)
        const dist = Math.hypot(dx, dy) || 1
        // Ease out so distant movement doesn't peg the pupils to the edge.
        const reach = Math.min(1, dist / 420)
        setPupil({ x: (dx / dist) * reach * 3.2, y: (dy / dist) * reach * 2.6 })
      })
    }
    window.addEventListener("mousemove", onMove, { passive: true })
    return () => {
      window.removeEventListener("mousemove", onMove)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [gaze, still])

  // Randomised blinking. A fixed interval reads as mechanical.
  useEffect(() => {
    if (still) return
    let t: ReturnType<typeof setTimeout>
    const loop = () => {
      t = setTimeout(() => {
        setBlinking(true)
        setTimeout(() => setBlinking(false), 130)
        loop()
      }, 2600 + Math.random() * 4200)
    }
    loop()
    return () => clearTimeout(t)
  }, [still])

  // Thinking makes Saarthi look up and away, as if working it out.
  const px = mood === "thinking" ? 0.9 : pupil.x
  const py = mood === "thinking" ? -2.4 : pupil.y
  const gid = `saarthi-${mood}`

  return (
    <div
      ref={wrapRef}
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${title} — ${mood}`}
    >
      <motion.div
        className="absolute inset-0"
        animate={still ? { scale: 1, y: 0 } : { scale: [1, 1.035, 1], y: [0, -2.5, 0] }}
        transition={{ duration: m.breathe, repeat: still ? 0 : Infinity, ease: "easeInOut" }}
      >
        <svg viewBox="0 0 100 100" width="100%" height="100%" aria-hidden="true">
          <defs>
            <radialGradient id={`${gid}-body`} cx="38%" cy="32%" r="72%">
              <stop offset="0%" stopColor={m.from} stopOpacity="0.95" />
              <stop offset="100%" stopColor={m.to} stopOpacity="0.88" />
            </radialGradient>
            <radialGradient id={`${gid}-halo`} cx="50%" cy="50%" r="50%">
              <stop offset="55%" stopColor={m.glow} stopOpacity="0" />
              <stop offset="100%" stopColor={m.glow} stopOpacity="0.5" />
            </radialGradient>
          </defs>

          {/* Halo */}
          <motion.circle
            cx="50" cy="50" r="48" fill={`url(#${gid}-halo)`}
            animate={still ? { opacity: m.glowOpacity[0] } : { opacity: m.glowOpacity }}
            transition={{ duration: m.breathe, repeat: still ? 0 : Infinity, ease: "easeInOut" }}
          />

          {/* Listening: an expanding ring, like sound reaching it */}
          {mood === "listening" && !still && (
            <motion.circle
              cx="50" cy="50" fill="none" stroke={m.glow} strokeWidth="1.4"
              animate={{ r: [34, 46], opacity: [0.65, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
            />
          )}

          {/* Body */}
          <circle cx="50" cy="50" r="34" fill={`url(#${gid}-body)`} />
          {/* Specular highlight — reads as a surface rather than a flat disc */}
          <ellipse cx="38" cy="34" rx="10" ry="7" fill="#fff" opacity="0.22" />

          {/* Eyes */}
          {asleep ? (
            <>
              <path d="M32 50 q6 5 12 0" fill="none" stroke="#fff" strokeWidth="2.6"
                    strokeLinecap="round" opacity="0.75" />
              <path d="M56 50 q6 5 12 0" fill="none" stroke="#fff" strokeWidth="2.6"
                    strokeLinecap="round" opacity="0.75" />
            </>
          ) : (
            <g style={{ transition: "transform 120ms ease-out" }}>
              {[38, 62].map((cx) => (
                <g key={cx}>
                  <ellipse
                    cx={cx} cy="48" rx="6" ry={blinking ? 0.7 : 7.6}
                    fill="#fff" opacity="0.96"
                    style={{ transition: "ry 90ms ease-in-out" }}
                  />
                  {!blinking && (
                    <circle
                      cx={cx + px} cy={48 + py} r="3.1" fill="var(--foreground)" opacity="0.82"
                      style={{ transition: "cx 140ms ease-out, cy 140ms ease-out" }}
                    />
                  )}
                  {/* Concerned: a lowered lid does more for the emotion than
                      any change of colour */}
                  {mood === "concerned" && !blinking && (
                    <path d={`M${cx - 7} 42 q7 -3.4 14 0`} fill="none" stroke={m.to}
                          strokeWidth="2.4" strokeLinecap="round" />
                  )}
                </g>
              ))}
            </g>
          )}

          {/* Speaking: a mouth that actually moves */}
          {mood === "speaking" && !still && (
            <motion.ellipse
              cx="50" cy="64" rx="7" fill="var(--foreground)" opacity="0.55"
              animate={{ ry: [1.4, 4.6, 2.2, 5.2, 1.6] }}
              transition={{ duration: 0.72, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
          {mood === "celebrating" && (
            <path d="M42 62 q8 7 16 0" fill="none" stroke="var(--foreground)"
                  strokeWidth="2.6" strokeLinecap="round" opacity="0.6" />
          )}

          {/* Thinking: three dots orbiting overhead */}
          {mood === "thinking" && !still && (
            <motion.g
              animate={{ rotate: 360 }}
              transition={{ duration: 3.4, repeat: Infinity, ease: "linear" }}
              style={{ transformOrigin: "50px 50px" }}
            >
              {[0, 120, 240].map((deg, i) => (
                <motion.circle
                  key={deg} cx="50" cy="10" r="2.7" fill={m.glow}
                  style={{ transformOrigin: "50px 50px", transform: `rotate(${deg}deg)` }}
                  animate={{ opacity: [0.25, 1, 0.25] }}
                  transition={{ duration: 1.15, repeat: Infinity, delay: i * 0.28 }}
                />
              ))}
            </motion.g>
          )}
        </svg>
      </motion.div>
    </div>
  )
}

/** Maps AI system health to a mood — used by the super-admin console. */
export function healthMood(opts: {
  killed?: boolean
  enabled?: boolean
  configured?: boolean
  spendPct?: number
}): SaarthiMood {
  if (opts.killed || !opts.enabled || !opts.configured) return "asleep"
  if ((opts.spendPct ?? 0) >= 80) return "concerned"
  return "idle"
}
