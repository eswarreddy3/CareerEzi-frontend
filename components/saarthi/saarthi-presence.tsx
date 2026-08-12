"use client"

/**
 * Saarthi as a presence — the orb plus a speech bubble that reacts to what the
 * student is doing, in real time, for zero tokens.
 *
 * The whole point: when you finish a lesson, something *notices*. That single
 * beat of acknowledgement is most of what separates "an app with an AI feature"
 * from "a tutor sitting next to me", and it doesn't require a model at all.
 */

import { useCallback, useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

import { SaarthiOrb, type SaarthiMood } from "@/components/saarthi/orb"
import {
  DEFAULT_DURATION, EVENT_DURATION, EVENT_MOOD, lineFor, saarthi,
  type SaarthiEvent,
} from "@/lib/saarthi-events"
import { cn } from "@/lib/utils"

const IDLE_MS = 3 * 60 * 1000   // dozes off after 3 minutes of no interaction

export function SaarthiPresence({
  size = 72,
  baseMood = "idle",
  side = "right",
  className,
  onOrbClick,
}: {
  size?: number
  /** Mood to sit at when nothing is happening — e.g. "concerned" if a drive is close */
  baseMood?: SaarthiMood
  side?: "left" | "right"
  className?: string
  onOrbClick?: () => void
}) {
  const [mood, setMood] = useState<SaarthiMood>(baseMood)
  const [line, setLine] = useState<string | null>(null)
  const revert = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const idle = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const settle = useCallback(() => setMood(baseMood), [baseMood])

  // Doze off when the student stops interacting, wake on any input.
  const resetIdle = useCallback(() => {
    clearTimeout(idle.current)
    setMood((m) => (m === "asleep" ? baseMood : m))
    idle.current = setTimeout(() => { setMood("asleep"); setLine(null) }, IDLE_MS)
  }, [baseMood])

  useEffect(() => {
    resetIdle()
    const events: (keyof WindowEventMap)[] = ["pointerdown", "keydown", "scroll"]
    events.forEach((e) => window.addEventListener(e, resetIdle, { passive: true }))
    return () => {
      events.forEach((e) => window.removeEventListener(e, resetIdle))
      clearTimeout(idle.current)
    }
  }, [resetIdle])

  useEffect(() => setMood(baseMood), [baseMood])

  useEffect(() => {
    const off = saarthi.on((event: SaarthiEvent) => {
      const text = lineFor(event)
      const next = EVENT_MOOD[event.name] ?? baseMood
      setMood(next)
      if (text) setLine(text)

      clearTimeout(revert.current)
      revert.current = setTimeout(() => {
        setLine(null)
        settle()
      }, EVENT_DURATION[event.name] ?? DEFAULT_DURATION)
    })
    return () => { off(); clearTimeout(revert.current) }
  }, [baseMood, settle])

  return (
    <div className={cn("relative flex items-center gap-3",
                       side === "left" && "flex-row-reverse", className)}>
      <AnimatePresence>
        {line && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, x: side === "right" ? 8 : -8 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 420, damping: 28 }}
            className={cn(
              "relative max-w-[15rem] rounded-2xl border border-border bg-popover px-3 py-2",
              "text-sm leading-snug shadow-lg",
              side === "right" ? "rounded-br-sm" : "rounded-bl-sm",
            )}
          >
            {line}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={onOrbClick}
        aria-label="Saarthi"
        className={cn("shrink-0 rounded-full transition-transform",
                      onOrbClick && "hover:scale-105 active:scale-95")}
      >
        <SaarthiOrb mood={mood} size={size} />
      </button>
    </div>
  )
}
