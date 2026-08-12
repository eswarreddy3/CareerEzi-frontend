"use client"

/**
 * The floating Saarthi — present on every dashboard page, reacting to whatever
 * the student is doing, for zero tokens.
 *
 * This is the piece that turns "an app with an AI page" into "a tutor sitting
 * next to me". She notices a correct answer on /practice-mcq, an accepted
 * submission on /coding, a finished lesson on /learn — instantly, with no
 * model call and no latency.
 *
 * THE CLIPPY RULE (AI_Intigration.md):
 *   - never interrupts unprompted — she only speaks when the student DID something
 *   - never covers content — small, corner-docked, pointer-events only on herself
 *   - permanently dismissible, remembered per user across sessions
 *   - honours prefers-reduced-motion
 *   - halts all animation when the tab is hidden (low-end Android)
 */

import { useCallback, useEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { X } from "lucide-react"

import { SaarthiOrb, type SaarthiMood } from "@/components/saarthi/orb"
import {
  DEFAULT_DURATION, EVENT_DURATION, EVENT_MOOD, lineFor, saarthi,
} from "@/lib/saarthi-events"
import { cn } from "@/lib/utils"

const DISMISS_KEY = "saarthi:dismissed"
const POS_KEY = "saarthi:corner"
const IDLE_MS = 3 * 60 * 1000

type Corner = "br" | "bl"

const CORNER_CLASS: Record<Corner, string> = {
  br: "bottom-4 right-4 sm:bottom-6 sm:right-6",
  bl: "bottom-4 left-4 sm:bottom-6 sm:left-6",
}

export function SaarthiCompanion() {
  const reduced = useReducedMotion()
  const [dismissed, setDismissed] = useState(true)      // assume hidden until storage says otherwise
  const [hydrated, setHydrated] = useState(false)
  const [corner, setCorner] = useState<Corner>("br")
  const [mood, setMood] = useState<SaarthiMood>("idle")
  const [line, setLine] = useState<string | null>(null)
  const [showClose, setShowClose] = useState(false)

  const revert = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const idle = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  // Read persisted state on mount only — avoids an SSR/client mismatch.
  useEffect(() => {
    try {
      setDismissed(localStorage.getItem(DISMISS_KEY) === "1")
      const saved = localStorage.getItem(POS_KEY)
      if (saved === "bl" || saved === "br") setCorner(saved)
    } catch { /* private mode — just show her */ setDismissed(false) }
    setHydrated(true)
  }, [])

  const resetIdle = useCallback(() => {
    clearTimeout(idle.current)
    setMood((m) => (m === "asleep" ? "idle" : m))
    idle.current = setTimeout(() => { setMood("asleep"); setLine(null) }, IDLE_MS)
  }, [])

  useEffect(() => {
    if (dismissed) return
    resetIdle()
    const evts: (keyof WindowEventMap)[] = ["pointerdown", "keydown", "scroll"]
    evts.forEach((e) => window.addEventListener(e, resetIdle, { passive: true }))
    return () => {
      evts.forEach((e) => window.removeEventListener(e, resetIdle))
      clearTimeout(idle.current)
    }
  }, [dismissed, resetIdle])

  // React to what the student does.
  useEffect(() => {
    if (dismissed) return
    const off = saarthi.on((event) => {
      // "greet" belongs to the dashboard hero — the floating companion piping up
      // on every page load would be exactly the interruption we promised to avoid.
      if (event.name === "greet") return

      const text = lineFor(event)
      setMood(EVENT_MOOD[event.name] ?? "idle")
      if (text) setLine(text)
      clearTimeout(revert.current)
      revert.current = setTimeout(() => {
        setLine(null)
        setMood("idle")
      }, EVENT_DURATION[event.name] ?? DEFAULT_DURATION)
    })
    return () => { off(); clearTimeout(revert.current) }
  }, [dismissed])

  function dismiss() {
    setDismissed(true)
    setLine(null)
    try { localStorage.setItem(DISMISS_KEY, "1") } catch { /* ignore */ }
  }

  function flipCorner() {
    const next: Corner = corner === "br" ? "bl" : "br"
    setCorner(next)
    try { localStorage.setItem(POS_KEY, next) } catch { /* ignore */ }
  }

  if (!hydrated || dismissed) return null

  const onLeft = corner === "bl"

  return (
    <div
      className={cn("pointer-events-none fixed z-40 flex items-end gap-2",
                    CORNER_CLASS[corner], onLeft && "flex-row-reverse")}
      onMouseEnter={() => setShowClose(true)}
      onMouseLeave={() => setShowClose(false)}
    >
      <AnimatePresence>
        {line && (
          <motion.div
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className={cn(
              "pointer-events-auto mb-2 max-w-[14rem] rounded-2xl border border-border",
              "bg-popover px-3 py-2 text-sm leading-snug shadow-xl",
              onLeft ? "rounded-bl-sm" : "rounded-br-sm",
            )}
          >
            {line}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pointer-events-auto relative">
        <AnimatePresence>
          {showClose && (
            <motion.button
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              onClick={dismiss}
              aria-label="Hide Saarthi"
              title="Hide Saarthi"
              className="absolute -right-1 -top-1 z-10 grid h-5 w-5 place-items-center rounded-full border border-border bg-popover text-muted-foreground shadow hover:text-foreground"
            >
              <X className="h-3 w-3" />
            </motion.button>
          )}
        </AnimatePresence>

        <button
          type="button"
          onClick={flipCorner}
          aria-label="Saarthi — tap to move to the other corner"
          title="Move Saarthi"
          className="rounded-full transition-transform hover:scale-105 active:scale-95"
        >
          <SaarthiOrb mood={mood} size={56} />
        </button>
      </div>
    </div>
  )
}

/** Lets a settings screen bring her back after a dismissal. */
export function restoreSaarthi() {
  try { localStorage.removeItem(DISMISS_KEY) } catch { /* ignore */ }
}
