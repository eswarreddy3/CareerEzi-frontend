"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"
import { Logo } from "@/components/logo"

/**
 * Inauguration curtain for launch day.
 *
 * Enabled only when NEXT_PUBLIC_LAUNCH_MODE === "true". Visitors land on a
 * full-screen brand cover with a LAUNCH button; pressing it fires the
 * ceremony (shockwaves + confetti + curtain split) and reveals the home page.
 *
 * Controls
 *   ?launch=1   force the curtain back (rehearsals, second take)
 *   ?launch=0   bypass it entirely (escape hatch if anything misbehaves)
 *   Enter/Space trigger the launch  ·  Esc skips it
 * Once launched, localStorage keeps it down so refreshes go straight to the site.
 */

const ENABLED = process.env.NEXT_PUBLIC_LAUNCH_MODE === "true"
const EVENT_LABEL = process.env.NEXT_PUBLIC_LAUNCH_EVENT || "GRAND LAUNCH"
const STORAGE_KEY = "careerezi-launched-v1"

// Logo palette — teal → indigo → coral → amber
const BRAND = ["#00D4C8", "#0891B2", "#6366F1", "#E8825A", "#F59E0B", "#FFFFFF"]

type Phase = "boot" | "idle" | "igniting" | "done"

export function LaunchCurtain() {
  const [phase, setPhase] = useState<Phase>(ENABLED ? "boot" : "done")
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  const after = (ms: number, fn: () => void) => {
    timers.current.push(setTimeout(fn, ms))
  }

  // ── Decide on the client whether the curtain is still owed ──────────────────
  useEffect(() => {
    if (!ENABLED) return
    const forced = new URLSearchParams(window.location.search).get("launch")
    if (forced === "0") { setPhase("done"); return }
    if (forced === "1") { localStorage.removeItem(STORAGE_KEY); setPhase("idle"); return }
    setPhase(localStorage.getItem(STORAGE_KEY) === "1" ? "done" : "idle")
  }, [])

  // ── Lock the page behind the curtain ────────────────────────────────────────
  useEffect(() => {
    if (phase === "done") return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = prev }
  }, [phase])

  useEffect(() => () => { timers.current.forEach(clearTimeout) }, [])

  const fire = useCallback((opts: confetti.Options) => {
    confetti({ colors: BRAND, disableForReducedMotion: true, ...opts })
  }, [])

  const launch = useCallback(() => {
    if (phase !== "idle") return
    setPhase("igniting")
    localStorage.setItem(STORAGE_KEY, "1")

    // Corner cannons
    after(120, () => {
      fire({ particleCount: 90, angle: 60, spread: 70, startVelocity: 62, origin: { x: 0, y: 1 } })
      fire({ particleCount: 90, angle: 120, spread: 70, startVelocity: 62, origin: { x: 1, y: 1 } })
    })
    // Centre burst on the logo
    after(420, () => {
      fire({ particleCount: 160, spread: 110, startVelocity: 45, scalar: 1.1, origin: { x: 0.5, y: 0.52 } })
    })
    // Wide volley as the curtain opens
    after(1050, () => {
      fire({ particleCount: 130, spread: 160, startVelocity: 55, decay: 0.92, origin: { x: 0.5, y: 0.35 } })
    })
    // Falling ribbons over the revealed home page
    after(1700, () => {
      fire({ particleCount: 120, spread: 180, startVelocity: 30, gravity: 0.55, scalar: 1.3, ticks: 260, origin: { x: 0.5, y: 0 } })
    })
    after(2500, () => setPhase("done"))
  }, [phase, fire])

  // ── Keyboard: Enter/Space launches, Esc skips ───────────────────────────────
  useEffect(() => {
    if (phase !== "idle") return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); launch() }
      if (e.key === "Escape") setPhase("done")
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [phase, launch])

  if (!ENABLED || phase === "done") return null

  const opening = phase === "igniting"

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] overflow-hidden" aria-label="CareerEzi launch">

        {/* ── Curtain halves — split apart on ignition ────────────────────────── */}
        {(["left", "right"] as const).map((side) => (
          <motion.div
            key={side}
            className="absolute inset-y-0 w-1/2"
            style={{
              [side]: 0,
              background:
                "radial-gradient(120% 100% at 50% 40%, #16203C 0%, #0A0F1E 55%, #05070F 100%)",
            }}
            animate={opening ? { x: side === "left" ? "-100%" : "100%" } : { x: 0 }}
            transition={{ delay: 1.05, duration: 1.15, ease: [0.76, 0, 0.24, 1] }}
          >
            {/* Seam light */}
            <div
              className={`absolute inset-y-0 w-px ${side === "left" ? "right-0" : "left-0"}`}
              style={{ background: "linear-gradient(to bottom, transparent, rgba(0,212,200,0.45), transparent)" }}
            />
          </motion.div>
        ))}

        {/* ── Ambient orbs ───────────────────────────────────────────────────── */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={opening ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.5, delay: opening ? 0.75 : 0 }}
        >
          <motion.div
            className="absolute w-[560px] h-[560px] rounded-full blur-3xl -top-40 -left-32"
            style={{ background: "rgba(99,102,241,0.20)" }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute w-[520px] h-[520px] rounded-full blur-3xl -bottom-40 -right-24"
            style={{ background: "rgba(0,212,200,0.16)" }}
            animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
        </motion.div>

        {/* ── Centre stage ───────────────────────────────────────────────────── */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
          animate={opening ? { opacity: 0, scale: 1.12 } : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, delay: opening ? 0.62 : 0, ease: "easeIn" }}
        >
          {/* Event eyebrow */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mb-10 text-[11px] sm:text-xs font-semibold tracking-[0.42em] text-white/45"
          >
            {EVENT_LABEL}
          </motion.p>

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 22, scale: 0.94 }}
            animate={
              opening
                ? { opacity: 1, y: 0, scale: 1.14 }
                : { opacity: 1, y: 0, scale: 1 }
            }
            transition={{ duration: opening ? 0.7 : 0.9, delay: opening ? 0 : 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative"
          >
            <div className="absolute inset-0 -z-10 blur-3xl" style={{ background: "rgba(99,102,241,0.30)" }} />
            <Logo size={104} className="h-[68px] sm:h-[92px] lg:h-[104px] drop-shadow-2xl" />
          </motion.div>

          {/* by Fynity Innovations */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.75 }}
            className="mt-7 flex items-center gap-3"
          >
            <span className="h-px w-8 sm:w-12" style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.35))" }} />
            <span className="text-[13px] sm:text-base tracking-[0.16em] text-white/60">
              by{" "}
              <span
                className="font-semibold"
                style={{
                  background: "linear-gradient(135deg, #00D4C8 0%, #6366F1 55%, #E8825A 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                Fynity Innovations
              </span>
            </span>
            <span className="h-px w-8 sm:w-12" style={{ background: "linear-gradient(to left, transparent, rgba(255,255,255,0.35))" }} />
          </motion.div>

          {/* Launch button */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={opening ? { opacity: 0, scale: 0.7 } : { opacity: 1, y: 0 }}
            transition={{ duration: opening ? 0.35 : 0.8, delay: opening ? 0 : 1.15 }}
            className="relative mt-16 sm:mt-20"
          >
            {/* Pulsing halo rings */}
            {!opening && [0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="absolute inset-0 rounded-full border pointer-events-none"
                style={{ borderColor: "rgba(0,212,200,0.5)" }}
                animate={{ scale: [1, 1.75], opacity: [0.55, 0] }}
                transition={{ duration: 2.6, repeat: Infinity, delay: i * 0.85, ease: "easeOut" }}
              />
            ))}

            <button
              onClick={launch}
              className="relative rounded-full px-14 sm:px-20 py-5 sm:py-6 text-base sm:text-xl font-bold tracking-[0.22em] text-white
                         transition-transform duration-200 hover:scale-[1.04] active:scale-[0.98] focus:outline-none
                         focus-visible:ring-4 focus-visible:ring-white/30"
              style={{
                background: "linear-gradient(135deg, #00D4C8 0%, #6366F1 52%, #E8825A 100%)",
                boxShadow: "0 0 60px rgba(99,102,241,0.55), 0 12px 40px rgba(0,0,0,0.45)",
              }}
            >
              LAUNCH
            </button>
          </motion.div>

          {/* Shockwaves on ignition */}
          <AnimatePresence>
            {opening && [0, 1, 2, 3].map((i) => (
              <motion.span
                key={i}
                className="absolute rounded-full border-2 pointer-events-none"
                style={{
                  width: 220, height: 220,
                  borderColor: BRAND[i % 4],
                  top: "50%", left: "50%", marginTop: -110, marginLeft: -110,
                }}
                initial={{ scale: 0.2, opacity: 0.9 }}
                animate={{ scale: 11, opacity: 0 }}
                transition={{ duration: 1.5, delay: i * 0.13, ease: "easeOut" }}
              />
            ))}
          </AnimatePresence>

          {/* Flash */}
          <AnimatePresence>
            {opening && (
              <motion.div
                className="fixed inset-0 bg-white pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.85, 0] }}
                transition={{ duration: 0.7, delay: 0.35, times: [0, 0.25, 1] }}
              />
            )}
          </AnimatePresence>

          {/* Hint */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={opening ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.6, delay: opening ? 0 : 1.9 }}
            className="absolute bottom-10 text-[11px] tracking-[0.28em] text-white/30"
          >
            PRESS THE BUTTON TO GO LIVE
          </motion.p>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
