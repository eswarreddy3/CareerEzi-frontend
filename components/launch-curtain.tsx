"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"
import { GraduationCap, Code2, Bot, BadgeCheck, BarChart3, Rocket } from "lucide-react"

/**
 * Inauguration curtain for launch day.
 *
 * This page holds the screen for the whole function before anyone presses
 * anything, so it is built as a poster rather than a splash: it states what
 * CareerEzi is, carries the Fynity endorsement, and animates calmly enough to
 * loop for an hour without wearing on the room.
 *
 * Palette is deliberately LIGHT — the CareerEzi mark is deep teal and coral,
 * drawn for light grounds, and projectors wash out dark backgrounds. It sets
 * its own colours and ignores the app theme.
 *
 * Enabled only when NEXT_PUBLIC_LAUNCH_MODE === "true".
 *   ?launch=1   force the curtain back (rehearsals, second take)
 *   ?launch=0   bypass it entirely (escape hatch)
 *   Enter/Space launch  ·  Esc skips
 */

const ENABLED  = process.env.NEXT_PUBLIC_LAUNCH_MODE === "true"
const EYEBROW  = process.env.NEXT_PUBLIC_LAUNCH_EVENT || "INAUGURAL LAUNCH"
const OCCASION = process.env.NEXT_PUBLIC_LAUNCH_OCCASION || ""
const TAGLINE  = process.env.NEXT_PUBLIC_LAUNCH_TAGLINE || "Every student, placement-ready."
const FYNITY_LOGO = process.env.NEXT_PUBLIC_FYNITY_LOGO || "/fynity.png"
const STORAGE_KEY = "careerezi-launched-v1"

// Straight from the logo: deep teal wordmark, coral "Ezi", gold tassel.
const TEAL  = "#124F5C"
const TEAL2 = "#0E6E7A"
const CORAL = "#F1613E"
const GOLD  = "#F2A93B"
const INK   = "#0B2F38"

// Fynity's own palette, sampled from /fynity.png — the endorsement is set in
// their colours rather than CareerEzi's so the two marks read as two brands.
const FYN_NAVY   = "#1B125F"
const FYN_PURPLE = "#892C9D"
const FYN_BLUE   = "#0096E1"

const CONFETTI_COLORS = [TEAL, TEAL2, CORAL, GOLD, "#1D8A96", "#FFFFFF"]

/**
 * Every size on this page is driven off `vmin` (the smaller viewport edge) so
 * the composition scales itself to whatever it is projected on — 720p, 1080p,
 * a 4K panel or a phone — instead of sitting at fixed pixel sizes. The clamp()
 * floors keep it readable on small screens; the ceilings stop it exploding on
 * very large ones.
 */
const SCALE = {
  "--lc-eyebrow":    "clamp(10px, 1.45vmin, 30px)",
  "--lc-occasion":   "clamp(11px, 1.7vmin, 34px)",
  "--lc-rule":       "clamp(28px, 5vmin, 100px)",
  "--lc-logo":       "clamp(58px, 21.5vmin, 460px)",
  "--lc-tagline":    "clamp(24px, 5.8vmin, 120px)",
  "--lc-brief":      "clamp(13px, 2.3vmin, 46px)",
  "--lc-brief-max":  "clamp(280px, 92vmin, 1700px)",
  "--lc-pill":       "clamp(11px, 1.85vmin, 37px)",
  "--lc-pill-px":    "clamp(14px, 2.4vmin, 48px)",
  "--lc-pill-py":    "clamp(8px, 1.35vmin, 27px)",
  "--lc-pill-gap":   "clamp(6px, 1.15vmin, 23px)",
  "--lc-pill-icon":  "clamp(14px, 2.15vmin, 43px)",
  "--lc-btn":        "clamp(15px, 2.85vmin, 57px)",
  "--lc-btn-px":     "clamp(36px, 6.8vmin, 136px)",
  "--lc-btn-py":     "clamp(14px, 2.5vmin, 50px)",
  "--lc-hint":       "clamp(9px, 1.3vmin, 26px)",
  "--lc-initiative": "clamp(9px, 1.35vmin, 27px)",
  "--lc-fyn-mark":   "clamp(32px, 5.4vmin, 108px)",
  "--lc-fyn-text":   "clamp(15px, 2.6vmin, 52px)",
  // Vertical rhythm
  "--lc-gap-logo":   "clamp(18px, 3.4vmin, 74px)",
  "--lc-gap-tag":    "clamp(16px, 2.8vmin, 64px)",
  "--lc-gap-brief":  "clamp(12px, 2.1vmin, 42px)",
  "--lc-gap-pills":  "clamp(20px, 3.6vmin, 72px)",
  "--lc-gap-btn":    "clamp(22px, 4vmin, 84px)",
  "--lc-gap-hint":   "clamp(16px, 2.9vmin, 58px)",
  "--lc-gap-fyn":    "clamp(8px, 1.5vmin, 30px)",
  // Frame + safe areas
  "--lc-frame":      "clamp(14px, 2.1vmin, 42px)",
  "--lc-frame-bar":  "clamp(4px, 0.5vmin, 10px)",
  "--lc-corner":     "clamp(16px, 2.3vmin, 46px)",
  "--lc-corner-w":   "clamp(2px, 0.22vmin, 5px)",
  "--lc-bottom-pad": "clamp(110px, 17vmin, 320px)",
  "--lc-bottom-fyn": "clamp(22px, 3.6vmin, 72px)",
  "--lc-shock":      "clamp(140px, 20vmin, 420px)",
} as React.CSSProperties

const CAPABILITIES = [
  { icon: GraduationCap, label: "Structured Learning" },
  { icon: Code2,         label: "Live Coding Practice" },
  { icon: Bot,           label: "AI Mock Interviews" },
  { icon: BadgeCheck,    label: "Verified Certificates" },
  { icon: BarChart3,     label: "Placement Analytics" },
]

type Phase = "boot" | "idle" | "igniting" | "done"

/**
 * Footer control that puts the curtain back up — the way to get to the launch
 * screen on the day without typing a URL.
 *
 * Uses a hard navigation rather than the Next router on purpose: the curtain
 * reads `?launch=` once on mount, and a client-side push to the same route
 * would not remount it. A full reload also guarantees a clean slate on stage.
 *
 * Renders nothing unless launch mode is on, so it disappears with the rest of
 * the launch machinery once NEXT_PUBLIC_LAUNCH_MODE is turned off.
 */
export function LaunchModeButton({ className = "" }: { className?: string }) {
  if (!ENABLED) return null
  return (
    <button
      onClick={() => { window.location.href = "/?launch=1" }}
      title="Open the inauguration launch screen"
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold
                  transition-transform duration-200 hover:scale-[1.04] active:scale-[0.98]
                  focus:outline-none focus-visible:ring-2 ${className}`}
      style={{
        borderColor: `${CORAL}59`,
        color: CORAL,
        background: `linear-gradient(135deg, ${TEAL}14, ${CORAL}1A)`,
      }}
    >
      <Rocket className="h-3.5 w-3.5" />
      Launch Mode
    </button>
  )
}

export function LaunchCurtain() {
  const [phase, setPhase] = useState<Phase>(ENABLED ? "boot" : "done")
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  const after = (ms: number, fn: () => void) => { timers.current.push(setTimeout(fn, ms)) }

  useEffect(() => {
    if (!ENABLED) return
    const forced = new URLSearchParams(window.location.search).get("launch")
    if (forced === "0") { setPhase("done"); return }
    if (forced === "1") { localStorage.removeItem(STORAGE_KEY); setPhase("idle"); return }
    setPhase(localStorage.getItem(STORAGE_KEY) === "1" ? "done" : "idle")
  }, [])

  useEffect(() => {
    if (phase === "done") return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = prev }
  }, [phase])

  useEffect(() => () => { timers.current.forEach(clearTimeout) }, [])

  const fire = useCallback((opts: confetti.Options) => {
    confetti({ colors: CONFETTI_COLORS, disableForReducedMotion: true, ...opts })
  }, [])

  /**
   * Ignition runs as a staged sequence rather than one burst, so the reveal
   * says something rather than just ending:
   *
   *   0.00s  button collapses, shockwaves burst
   *   0.12s  corner cannons
   *   0.25s  the five capability pills launch outward at the room — the beat
   *          that actually shows the audience what the platform does
   *   0.55s  supporting copy clears, logo takes the screen alone
   *   0.75s  burst on the logo
   *   1.15s  curtain opens like doors, light pours through the seam
   *   1.35s  wide volley over the opening
   *   2.10s  ribbons fall across the revealed site
   *   3.40s  curtain unmounts
   */
  const launch = useCallback(() => {
    if (phase !== "idle") return
    setPhase("igniting")
    localStorage.setItem(STORAGE_KEY, "1")

    after(120, () => {
      fire({ particleCount: 90, angle: 60, spread: 70, startVelocity: 62, origin: { x: 0, y: 1 } })
      fire({ particleCount: 90, angle: 120, spread: 70, startVelocity: 62, origin: { x: 1, y: 1 } })
    })
    // Rides out with the pills
    after(300, () => {
      fire({ particleCount: 70, spread: 180, startVelocity: 38, scalar: 0.9, origin: { x: 0.5, y: 0.62 } })
    })
    // The logo's moment
    after(750, () => {
      fire({ particleCount: 170, spread: 120, startVelocity: 48, scalar: 1.15, origin: { x: 0.5, y: 0.45 } })
    })
    // Doors opening
    after(1350, () => {
      fire({ particleCount: 140, spread: 160, startVelocity: 58, decay: 0.92, origin: { x: 0.5, y: 0.35 } })
    })
    after(2100, () => {
      fire({ particleCount: 130, spread: 180, startVelocity: 30, gravity: 0.55, scalar: 1.3, ticks: 280, origin: { x: 0.5, y: 0 } })
    })
    after(3400, () => setPhase("done"))
  }, [phase, fire])

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
  const rise = (delay: number) => ({
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
  })

  return (
    <div className="fixed inset-0 z-[200] overflow-hidden" style={SCALE} aria-label="CareerEzi launch">

      {/* ── Curtain halves — split apart on ignition ──────────────────────────── */}
      {(["left", "right"] as const).map((side) => (
        <motion.div
          key={side}
          className="absolute inset-y-0 w-1/2"
          style={{
            [side]: 0,
            background:
              "radial-gradient(115% 90% at 50% 30%, #FFFFFF 0%, #F4F9F9 38%, #E3EDEE 72%, #D2E0E2 100%)",
            boxShadow: "0 0 0px 0px rgba(18,79,92,0)",
          }}
          animate={
            opening
              ? { x: side === "left" ? "-100%" : "100%", boxShadow: `0 0 90px 30px ${TEAL}33` }
              : { x: 0 }
          }
          transition={{ delay: 1.15, duration: 1.35, ease: [0.7, 0, 0.2, 1] }}
        >
          <div
            className={`absolute inset-y-0 w-px ${side === "left" ? "right-0" : "left-0"}`}
            style={{ background: `linear-gradient(to bottom, transparent, ${TEAL}0D, transparent)` }}
          />
        </motion.div>
      ))}

      {/* ── Light through the opening doors ──────────────────────────────────── */}
      <AnimatePresence>
        {opening && (
          <motion.div
            className="pointer-events-none absolute inset-y-0"
            style={{
              left: "50%",
              transform: "translateX(-50%)",
              background: `linear-gradient(90deg, transparent, ${GOLD}99 25%, #FFFFFF 50%, ${GOLD}99 75%, transparent)`,
              filter: "blur(2px)",
            }}
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: ["0vmin", "30vmin", "72vmin"], opacity: [0, 0.95, 0] }}
            transition={{ duration: 1.4, delay: 1.15, times: [0, 0.3, 1], ease: "easeOut" }}
          />
        )}
      </AnimatePresence>

      {/* ── Ambient wash ─────────────────────────────────────────────────────── */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={opening ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.5, delay: opening ? 0.75 : 0 }}
      >
        <motion.div
          className="absolute rounded-full blur-3xl"
          style={{ background: `${TEAL2}1F`, width: "58vmin", height: "58vmin", left: "-18vmin", top: "-18vmin" }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.9, 0.6] }}
          transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute rounded-full blur-3xl"
          style={{ background: `${CORAL}18`, width: "52vmin", height: "52vmin", right: "-14vmin", bottom: "-20vmin" }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <motion.div
          className="absolute left-1/2 top-0 -translate-x-1/2 rounded-full blur-3xl"
          style={{ background: `${GOLD}14`, width: "40vmin", height: "40vmin" }}
          animate={{ opacity: [0.4, 0.75, 0.4] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        {/* Fine dot texture — gives the ground substance without reading as pattern */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(${TEAL}14 1px, transparent 1px)`,
            backgroundSize: "2.6vmin 2.6vmin",
            maskImage: "radial-gradient(70% 60% at 50% 45%, #000 0%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(70% 60% at 50% 45%, #000 0%, transparent 100%)",
          }}
        />
      </motion.div>

      {/* ── Ceremonial frame ─────────────────────────────────────────────────── */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        animate={opening ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.4, delay: opening ? 0.55 : 0 }}
      >
        <motion.div
          className="absolute inset-x-0 top-0 origin-left"
          style={{
            height: "var(--lc-frame-bar)",
            background: `linear-gradient(90deg, ${TEAL} 0%, ${TEAL2} 35%, ${CORAL} 72%, ${GOLD} 100%)`,
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.div
          className="absolute rounded-[2px] border"
          style={{ inset: "var(--lc-frame)", borderColor: `${TEAL}1F` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        />
        {([
          ["top", "left"], ["top", "right"], ["bottom", "left"], ["bottom", "right"],
        ] as const).map(([v, h], i) => (
          <motion.span
            key={i}
            className="absolute"
            style={{
              [v]: "calc(var(--lc-frame) - var(--lc-corner-w))",
              [h]: "calc(var(--lc-frame) - var(--lc-corner-w))",
              width: "var(--lc-corner)",
              height: "var(--lc-corner)",
              [v === "top" ? "borderTop" : "borderBottom"]: `var(--lc-corner-w) solid ${GOLD}`,
              [h === "left" ? "borderLeft" : "borderRight"]: `var(--lc-corner-w) solid ${GOLD}`,
            }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 0.75, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.7 + i * 0.08 }}
          />
        ))}
      </motion.div>

      {/* ── Content ──────────────────────────────────────────────────────────── */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
        style={{ paddingBottom: "var(--lc-bottom-pad)" }}
        animate={opening ? { opacity: 0 } : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, delay: opening ? 1.15 : 0, ease: "easeIn" }}
      >
        {/* Eyebrow */}
        <motion.div
          {...rise(0.05)}
          animate={opening ? { opacity: 0, y: -24 } : { opacity: 1, y: 0 }}
          transition={opening ? { duration: 0.3 } : { duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center"
        >
          <div className="flex items-center" style={{ gap: "var(--lc-gap-brief)" }}>
            <span
              className="h-px"
              style={{ width: "var(--lc-rule)", background: `linear-gradient(to right, transparent, ${GOLD})` }}
            />
            <span
              className="font-semibold tracking-[0.5em] whitespace-nowrap"
              style={{ fontSize: "var(--lc-eyebrow)", color: CORAL }}
            >
              {EYEBROW}
            </span>
            <span
              className="h-px"
              style={{ width: "var(--lc-rule)", background: `linear-gradient(to left, transparent, ${GOLD})` }}
            />
          </div>
          {OCCASION && (
            <p
              className="tracking-[0.2em]"
              style={{ marginTop: "var(--lc-gap-brief)", fontSize: "var(--lc-occasion)", color: `${INK}99` }}
            >
              {OCCASION}
            </p>
          )}
        </motion.div>

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: 22, scale: 0.97 }}
          animate={opening ? { opacity: 1, y: 0, scale: 1.32 } : { opacity: 1, y: 0, scale: 1 }}
          transition={
            opening
              ? { duration: 1.05, delay: 0.5, ease: [0.16, 1, 0.3, 1] }
              : { duration: 0.9, delay: 0.18, ease: [0.22, 1, 0.36, 1] }
          }
          className="relative"
          style={{ marginTop: "var(--lc-gap-logo)" }}
        >
          {/* Bloom behind the mark as it takes over */}
          <AnimatePresence>
            {opening && (
              <motion.span
                className="pointer-events-none absolute -inset-[35%] -z-10 rounded-full blur-3xl"
                style={{ background: `radial-gradient(circle, ${GOLD}5C 0%, ${CORAL}33 45%, transparent 72%)` }}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: [0, 1, 0.85], scale: [0.5, 1.25, 1.5] }}
                transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
              />
            )}
          </AnimatePresence>
          {/* Sized off the scale tokens, so <Logo>'s own inline height is bypassed. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/careerezi_logo.png" alt="CareerEzi"
            className="w-auto object-contain"
            style={{ height: "var(--lc-logo)" }}
          />
        </motion.div>

        {/* Tagline */}
        <motion.h1
          {...rise(0.34)}
          animate={opening ? { opacity: 0, y: 34, filter: "blur(6px)" } : { opacity: 1, y: 0 }}
          transition={opening ? { duration: 0.45, delay: 0.3 } : { duration: 0.6, delay: 0.34, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif font-bold leading-[1.12] tracking-tight"
          style={{ marginTop: "var(--lc-gap-tag)", fontSize: "var(--lc-tagline)", color: INK }}
        >
          {TAGLINE}
        </motion.h1>

        {/* Brief — what the guests are looking at */}
        <motion.p
          {...rise(0.46)}
          animate={opening ? { opacity: 0, y: 30, filter: "blur(6px)" } : { opacity: 1, y: 0 }}
          transition={opening ? { duration: 0.45, delay: 0.38 } : { duration: 0.6, delay: 0.46, ease: [0.22, 1, 0.36, 1] }}
          className="leading-relaxed"
          style={{
            marginTop: "var(--lc-gap-brief)",
            maxWidth: "var(--lc-brief-max)",
            fontSize: "var(--lc-brief)",
            color: `${INK}B3`,
          }}
        >
          A complete placement-preparation platform for colleges — structured learning,
          live coding practice, AI mock interviews and independently verifiable
          certificates, with real-time placement analytics for every institution.
        </motion.p>

        {/* Capability row */}
        <motion.div
          {...rise(0.58)}
          className="flex max-w-3xl flex-wrap items-center justify-center lg:max-w-none lg:flex-nowrap"
          style={{ marginTop: "var(--lc-gap-pills)", gap: "var(--lc-pill-gap)" }}
        >
          {CAPABILITIES.map(({ icon: Icon, label }, i) => {
            // On ignition each capability is thrown outward past the audience —
            // fanned from the centre so all five read as they fly.
            const angle = ((-90 + (i - 2) * 30) * Math.PI) / 180
            const flight = {
              x: `${Math.cos(angle) * 62}vmin`,
              y: `${Math.sin(angle) * 62}vmin`,
              scale: 2.4,
              opacity: 0,
              rotate: (i - 2) * 9,
            }
            return (
              <motion.span
                key={label}
                className="inline-flex items-center whitespace-nowrap rounded-full border bg-white font-semibold"
                style={{
                  gap: "calc(var(--lc-pill-gap) * 0.8)",
                  paddingInline: "var(--lc-pill-px)",
                  paddingBlock: "var(--lc-pill-py)",
                  fontSize: "var(--lc-pill)",
                  borderColor: `${TEAL}2E`,
                  color: TEAL,
                  boxShadow: `0 6px 18px ${TEAL}14, 0 1px 2px ${TEAL}12`,
                }}
                animate={opening ? flight : { y: [0, -4, 0] }}
                transition={
                  opening
                    ? { duration: 1.15, delay: 0.25 + i * 0.055, ease: [0.3, 0, 0.2, 1] }
                    : { duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.45 }
                }
              >
                <Icon style={{ width: "var(--lc-pill-icon)", height: "var(--lc-pill-icon)", color: CORAL }} />
                {label}
              </motion.span>
            )
          })}
        </motion.div>

        {/* Launch button */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={opening ? { opacity: 0, scale: 0.72 } : { opacity: 1, y: 0 }}
          transition={{ duration: opening ? 0.35 : 0.6, delay: opening ? 0 : 0.72, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
          style={{ marginTop: "var(--lc-gap-btn)" }}
        >
          {!opening && [0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="pointer-events-none absolute inset-0 rounded-full border"
              style={{ borderColor: `${CORAL}66` }}
              animate={{ scale: [1, 1.7], opacity: [0.5, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 1, ease: "easeOut" }}
            />
          ))}

          <button
            onClick={launch}
            className="relative rounded-full font-bold tracking-[0.3em] text-white
                       transition-transform duration-200 hover:scale-[1.035] active:scale-[0.98]
                       focus:outline-none focus-visible:ring-4"
            style={{
              paddingInline: "var(--lc-btn-px)",
              paddingBlock: "var(--lc-btn-py)",
              fontSize: "var(--lc-btn)",
              background: `linear-gradient(135deg, ${TEAL} 0%, ${TEAL2} 45%, ${CORAL} 100%)`,
              boxShadow: `0 22px 50px ${TEAL}4D, 0 8px 20px ${CORAL}38`,
            }}
          >
            LAUNCH
          </button>

          <motion.p
            className="absolute inset-x-0 top-full whitespace-nowrap text-center tracking-[0.32em]"
            style={{ marginTop: "var(--lc-gap-hint)", fontSize: "var(--lc-hint)", color: `${INK}59` }}
            initial={{ opacity: 0 }}
            animate={opening ? { opacity: 0 } : { opacity: [0.35, 1, 0.35] }}
            transition={
              opening
                ? { duration: 0.3 }
                : { duration: 3.6, delay: 1.15, repeat: Infinity, ease: "easeInOut" }
            }
          >
            PRESS THE BUTTON TO GO LIVE
          </motion.p>
        </motion.div>

        {/* Shockwaves */}
        <AnimatePresence>
          {opening && [0, 1, 2, 3].map((i) => (
            <motion.span
              key={i}
              className="pointer-events-none absolute rounded-full border-2"
              style={{
                width: "var(--lc-shock)", height: "var(--lc-shock)",
                borderColor: [TEAL, CORAL, GOLD, TEAL2][i],
                top: "50%", left: "50%",
                marginTop: "calc(var(--lc-shock) / -2)",
                marginLeft: "calc(var(--lc-shock) / -2)",
              }}
              initial={{ scale: 0.2, opacity: 0.85 }}
              animate={{ scale: 14, opacity: 0 }}
              transition={{ duration: 1.5, delay: i * 0.13, ease: "easeOut" }}
            />
          ))}
        </AnimatePresence>

        <AnimatePresence>
          {opening && (
            <motion.div
              className="pointer-events-none fixed inset-0 bg-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.55, 0] }}
              transition={{ duration: 0.6, delay: 0.72, times: [0, 0.2, 1] }}
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── Fynity endorsement, pinned bottom ────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={opening ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.7, delay: opening ? 0 : 0.9 }}
        className="absolute inset-x-0 flex flex-col items-center"
        style={{ bottom: "var(--lc-bottom-fyn)", gap: "var(--lc-gap-fyn)" }}
      >
        <span
          className="font-medium tracking-[0.4em]"
          style={{ fontSize: "var(--lc-initiative)", color: `${INK}80` }}
        >
          AN INITIATIVE BY
        </span>
        <motion.div
          className="flex items-center"
          style={{ gap: "calc(var(--lc-gap-fyn) * 1.2)" }}
          animate={{ y: [0, -2.5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.4, rotate: -35 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 1.05, ease: [0.34, 1.56, 0.64, 1] }}
          >
            {/* Soft halo in Fynity's blue/purple, breathing slowly */}
            <motion.span
              className="absolute inset-0 -z-10 rounded-full blur-xl"
              style={{ background: `linear-gradient(135deg, ${FYN_BLUE}59, ${FYN_PURPLE}59)` }}
              animate={{ scale: [1, 1.45, 1], opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={FYNITY_LOGO} alt="Fynity Innovations"
              className="object-contain"
              style={{ width: "var(--lc-fyn-mark)", height: "var(--lc-fyn-mark)" }}
            />
          </motion.div>
          <span
            className="font-semibold tracking-[0.06em]"
            style={{ fontSize: "var(--lc-fyn-text)", color: FYN_NAVY }}
          >
            Fynity Innovations
          </span>
        </motion.div>
      </motion.div>

    </div>
  )
}
