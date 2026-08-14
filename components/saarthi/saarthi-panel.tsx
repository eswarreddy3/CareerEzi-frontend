"use client"

/**
 * Saarthi's right-edge drawer — the AI's home on every dashboard page.
 *
 * Replaces the old SaarthiHero + SaarthiPlanMissionsCard pair. Two AI cards
 * competing for space in the dashboard grid meant the plan was always half a
 * scroll away from the readiness score that justified it; docked to the edge,
 * both live in one column the student opens on purpose and can shut for good.
 *
 * Two ways in, one way out:
 *   - the edge tab (always visible, carries the readiness number)
 *   - the floating companion orb (hides itself while this is open)
 *   - Esc, the X, or the backdrop closes it
 *
 * Open/closed is remembered per user, except on small screens where the panel
 * covers the page — those always start closed.
 *
 * Reads a stored plan row. Makes NO AI call on mount.
 */

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import {
  ArrowRight, CalendarClock, ChevronRight, Clock, Flame, Sparkles,
  TrendingDown, TrendingUp, Trophy, X,
} from "lucide-react"

import { SaarthiOrb } from "@/components/saarthi/orb"
import { PlanItemRow } from "@/components/saarthi/plan-item"
import { ReadinessRing, bandTone } from "@/components/saarthi/readiness-ring"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchPlan, type StudyPlan } from "@/lib/ai"
import { useUIStore } from "@/store/uiStore"
import { cn } from "@/lib/utils"

const OPEN_KEY = "saarthi:panel"
const SEEN_KEY = "saarthi:seen"
const DESKTOP = 1024

const AREA_LABEL: Record<string, string> = {
  coding: "coding", aptitude: "aptitude", practice: "practice", points: "overall points",
}

export function SaarthiPanel() {
  const open = useUIStore((s) => s.saarthiOpen)
  const setOpen = useUIStore((s) => s.setSaarthiOpen)
  const reduced = useReducedMotion()

  const [plan, setPlan] = useState<StudyPlan | null>(null)
  const [loading, setLoading] = useState(true)
  const [hydrated, setHydrated] = useState(false)
  // Assume the hint has been seen until storage says otherwise, so a returning
  // student never gets a one-frame flash of it.
  const [seen, setSeen] = useState(true)

  // The plan is a stored row, so fetching on mount costs nothing and lets the
  // edge tab show the readiness number before anything is opened.
  useEffect(() => {
    let alive = true
    fetchPlan()
      .then((p) => { if (alive) setPlan(p) })
      .catch(() => {})
      .finally(() => { if (alive) setLoading(false) })
    return () => { alive = false }
  }, [])

  // Restore the remembered state on mount only — avoids an SSR/client mismatch.
  useEffect(() => {
    try {
      setSeen(localStorage.getItem(SEEN_KEY) === "1")
      if (window.innerWidth >= DESKTOP && localStorage.getItem(OPEN_KEY) === "1") {
        setOpen(true)
      }
    } catch { /* private mode — just leave it closed */ }
    setHydrated(true)
  }, [setOpen])

  useEffect(() => {
    if (!hydrated) return
    try { localStorage.setItem(OPEN_KEY, open ? "1" : "0") } catch { /* ignore */ }
    // Opening her once is proof enough that she has been found.
    if (open && !seen) {
      setSeen(true)
      try { localStorage.setItem(SEEN_KEY, "1") } catch { /* ignore */ }
    }
  }, [open, hydrated, seen])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false) }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, setOpen])

  const chips = useMemo(() => buildChips(plan), [plan])

  if (!hydrated || (!loading && !plan)) return null

  const readiness = plan?.readiness
  const narration = plan?.narration
  const progress = plan?.progress
  const nextItem = plan?.items.find((i) => !i.done) ?? null
  const allDone = !!progress && progress.total > 0 && progress.done === progress.total
  const pct = progress?.total ? Math.round((progress.done / progress.total) * 100) : 0

  // A drive inside a week with blockers is worth a worried orb.
  const drive = plan?.highlights?.next_drive
  const mood =
    allDone ? "celebrating"
    : drive && drive.days_away != null && drive.days_away <= 7 && !drive.eligible ? "concerned"
    : "idle"

  const slide = reduced
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : { initial: { x: "100%" }, animate: { x: 0 }, exit: { x: "100%" } }

  return (
    <>
      {/* ── Edge tab ──────────────────────────────────────────────────────
          The only permanently visible trace of the AI, so it is deliberately
          loud: solid brand gradient, a breathing glow and a nudge every few
          seconds. A tab that blends into the page margin is a tab nobody ever
          discovers — and an AI coach nobody opens may as well not be licensed.
          Both animations stop under prefers-reduced-motion. */}
      <AnimatePresence>
        {!open && (
          <motion.div
            initial={reduced ? { opacity: 0 } : { opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, x: 24 }}
            className="fixed right-0 top-1/2 z-30 flex -translate-y-1/2 items-center gap-2"
          >
            {/* First-run hint. Shown until the student opens her once, then
                never again — the tab has to explain itself exactly one time. */}
            <AnimatePresence>
              {!seen && (
                <motion.button
                  type="button"
                  onClick={() => setOpen(true)}
                  initial={reduced ? { opacity: 0 } : { opacity: 0, x: 10, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: 0.6, type: "spring", stiffness: 400, damping: 30 }}
                  className={cn(
                    "hidden max-w-[13rem] rounded-2xl rounded-br-sm border border-primary/30",
                    "bg-popover px-3 py-2 text-left text-xs leading-snug shadow-xl sm:block",
                  )}
                >
                  <span className="block font-semibold text-foreground">
                    Saarthi lives here
                  </span>
                  <span className="mt-0.5 block text-muted-foreground">
                    Your AI coach — readiness, insights and today&apos;s plan.
                  </span>
                </motion.button>
              )}
            </AnimatePresence>

            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open Saarthi"
              title="Open Saarthi"
              className="group relative"
            >
              {/* Breathing halo. A blurred sibling rather than a scaled box,
                  so it can never widen the page or spawn a scrollbar. */}
              {!reduced && (
                <motion.span
                  aria-hidden
                  className="absolute inset-0 rounded-l-2xl bg-primary blur-lg"
                  animate={{ opacity: [0.3, 0.75, 0.3] }}
                  transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                />
              )}

              <motion.span
                animate={reduced ? undefined : { x: [0, -5, 0] }}
                transition={{ duration: 0.9, repeat: Infinity, repeatDelay: 4.5, ease: "easeInOut" }}
                className={cn(
                  "relative flex flex-col items-center gap-1.5 rounded-l-2xl",
                  "bg-gradient-to-b from-primary via-coding to-coral px-2 py-4",
                  "text-primary-foreground shadow-xl ring-1 ring-inset ring-white/20",
                  "transition-[padding] group-hover:pr-3.5",
                )}
              >
                <Sparkles className="h-4 w-4" />
                {readiness && (
                  <span className="font-mono text-base font-bold leading-none tabular-nums">
                    {readiness.score}
                  </span>
                )}
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] [writing-mode:vertical-rl]">
                  Saarthi
                </span>
              </motion.span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop only where the panel actually covers content. On a wide
                screen it overlays the right margin, so dimming the page would
                be theatre for nothing. */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-50 bg-background/70 backdrop-blur-sm lg:hidden"
            />

            <motion.aside
              {...slide}
              transition={{ type: "spring", stiffness: 380, damping: 38 }}
              role="complementary"
              aria-label="Saarthi"
              className={cn(
                "fixed inset-y-0 right-0 z-50 flex w-full flex-col border-l border-border",
                "bg-card shadow-2xl sm:w-[25rem]",
              )}
            >
              {/* ── AI identity header ───────────────────────────────────── */}
              <div className="relative shrink-0 overflow-hidden border-b border-border/60 bg-gradient-to-r from-primary/12 via-coding/10 to-coral/10">
                <div className="relative flex items-center gap-3 px-4 py-3">
                  <SaarthiOrb mood={mood} size={34} className="shrink-0" />
                  <span className="flex min-w-0 flex-col">
                    <span className="font-serif text-sm font-bold leading-none gradient-text">
                      Saarthi
                    </span>
                    <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-coding">
                      <Sparkles className="h-3 w-3" />
                      AI Coach
                    </span>
                  </span>
                  <span className="ml-auto flex items-center gap-2">
                    {plan && (
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {timeAgo(plan.generated_at)}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      aria-label="Hide Saarthi"
                      title="Hide Saarthi (Esc)"
                      className="grid h-7 w-7 place-items-center rounded-lg border border-border bg-card/60 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </span>
                </div>
              </div>

              {/* ── Body ─────────────────────────────────────────────────── */}
              <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-4">
                {loading || !plan || !readiness || !progress ? (
                  <PanelSkeleton />
                ) : (
                  <>
                    {/* Readiness — Saarthi owns this number on this surface */}
                    <div className="flex items-center gap-4">
                      <Link href="/my-plan" className="shrink-0">
                        <ReadinessRing score={readiness.score} size={104} stroke={8}>
                          <div className="grid place-items-center text-center">
                            <span className={cn("font-mono text-2xl font-bold tabular-nums",
                                                bandTone(readiness.score))}>
                              {readiness.score}
                            </span>
                            <span className="text-[9px] uppercase tracking-wide text-muted-foreground">
                              readiness
                            </span>
                          </div>
                        </ReadinessRing>
                      </Link>
                      <div className="min-w-0 flex-1">
                        <p className="font-serif text-base font-bold leading-snug">
                          {narration?.greeting ?? "Welcome back."}
                        </p>
                        {/* Bands come back as lowercase phrases ("placement
                            ready") — only the first letter should rise. */}
                        {readiness.band && (
                          <span className={cn("chip mt-1.5 inline-flex first-letter:uppercase",
                                              bandChip(readiness.score))}>
                            {readiness.band}
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      {narration?.focus ?? "Open your plan to see what's next."}
                    </p>

                    {!!chips.length && (
                      <div className="flex flex-wrap gap-1.5">
                        {chips.map((c, i) => (
                          <motion.span
                            key={i}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + i * 0.06 }}
                            className={cn("chip inline-flex items-center gap-1", c.tone)}
                          >
                            <c.icon className="h-3 w-3" />
                            {c.text}
                          </motion.span>
                        ))}
                      </div>
                    )}

                    {/* One clear next action */}
                    <Link
                      href={nextItem?.deep_link ?? "/my-plan"}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "group flex flex-col gap-2 rounded-xl border p-3.5 transition-colors",
                        allDone
                          ? "border-success/30 bg-success/8 hover:border-success/60"
                          : "border-primary/25 bg-primary/6 hover:border-primary/55",
                      )}
                    >
                      <span className={cn(
                        "text-[11px] font-semibold uppercase tracking-wide",
                        allDone ? "text-success" : "text-primary",
                      )}>
                        {allDone ? "Plan complete" : "Do this next"}
                      </span>
                      <span className="flex items-start gap-2">
                        <span className="min-w-0 flex-1 text-sm font-semibold leading-snug">
                          {allDone
                            ? "Everything ticked off — rebuild for more"
                            : nextItem?.label ?? narration?.nudge ?? "Open your plan"}
                        </span>
                        <ArrowRight className={cn(
                          "mt-0.5 h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5",
                          allDone ? "text-success" : "text-primary",
                        )} />
                      </span>
                    </Link>

                    {/* ── The plan itself ─────────────────────────────────── */}
                    <div>
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <h3 className="font-serif text-sm font-semibold">
                          {plan.plan_mode === "daily" ? "Today's plan" : "This week's plan"}
                        </h3>
                        <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
                          {progress.done}/{progress.total}
                        </span>
                      </div>

                      <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-secondary/50">
                        <motion.div
                          className={cn("h-full rounded-full",
                            pct === 100 ? "bg-success" : "bg-gradient-to-r from-primary/70 to-coding")}
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.9, ease: "easeOut" }}
                        />
                      </div>

                      <div className="space-y-2">
                        {plan.items.map((item, i) => (
                          <div key={`${item.kind}-${item.target_id ?? i}`} onClick={() => setOpen(false)}>
                            <PlanItemRow item={item} index={i} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* ── Footer ───────────────────────────────────────────────── */}
              <div className="shrink-0 border-t border-border/60 p-3">
                <Link
                  href="/my-plan"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-1.5 rounded-lg border border-border py-2 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                >
                  Open full plan <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

function PanelSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Skeleton className="h-[104px] w-[104px] shrink-0 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
      <Skeleton className="h-16 w-full rounded-xl" />
      <Skeleton className="h-14 w-full rounded-xl" />
      <Skeleton className="h-14 w-full rounded-xl" />
    </div>
  )
}

/**
 * Insight chips — the facts a generic chatbot could never know.
 * All computed server-side by SQL, so they cost nothing.
 */
function buildChips(plan: StudyPlan | null) {
  if (!plan) return []
  const out: { icon: typeof Flame; text: string; tone: string }[] = []
  const ins = plan.insights ?? {}
  const hi = plan.highlights ?? {}

  if (hi.streak && hi.streak > 1) {
    out.push({ icon: Flame, text: `${hi.streak}-day streak`, tone: "chip-streak" })
  }

  const peer = ins.peer
  if (peer?.notable) {
    out.push({
      icon: Trophy,
      text: `Top ${100 - peer.strongest.percentile}% at ${AREA_LABEL[peer.strongest.area] ?? peer.strongest.area} in your batch`,
      tone: "chip-success",
    })
  }

  const m = ins.momentum
  if (m?.direction === "up") {
    out.push({ icon: TrendingUp, text: `${Math.abs(m.change_pct)}% busier than last week`, tone: "chip-success" })
  } else if (m?.direction === "down") {
    out.push({ icon: TrendingDown, text: `${Math.abs(m.change_pct)}% quieter than last week`, tone: "chip-warning" })
  }

  const drive = ins.projection
  if (drive) {
    out.push({
      icon: CalendarClock,
      text: `${drive.company} in ${drive.days_away}d${drive.eligible_now ? "" : " · not eligible yet"}`,
      tone: drive.eligible_now ? "chip-primary" : "chip-warning",
    })
  }

  const rhythm = ins.rhythm
  if (rhythm?.confident) {
    out.push({ icon: Clock, text: `You study best in the ${rhythm.window}`, tone: "chip-coding" })
  }

  return out.slice(0, 4)
}

function bandChip(score: number) {
  if (score >= 80) return "chip-success"
  if (score >= 60) return "chip-primary"
  if (score >= 35) return "chip-warning"
  return ""
}

function timeAgo(iso?: string) {
  if (!iso) return ""
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return ""
  const mins = Math.max(0, Math.round((Date.now() - then) / 60000))
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.round(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.round(hrs / 24)}d ago`
}
