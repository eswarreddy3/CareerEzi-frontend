"use client"

/**
 * The Saarthi dashboard hero — approach B.
 *
 * Replaces PlacementReadinessCard for AI-licensed colleges, which is how the
 * two-competing-readiness-scores problem gets resolved: one number, one owner,
 * per surface. Unlicensed colleges keep the original card untouched.
 *
 * What makes it feel like a tutor rather than a widget:
 *   - Saarthi greets by name and reacts live to what the student does
 *   - "Insight chips" state facts no generic chatbot could know — batch
 *     standing, their own study hours, days to their next drive
 *   - One clear next action, not a wall of metrics
 *
 * Reads a stored plan row. Makes NO AI call on mount.
 */

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowRight, CalendarClock, Clock, Flame, TrendingDown, TrendingUp, Trophy,
} from "lucide-react"

import { GlassCard } from "@/components/glass-card"
import { SaarthiPresence } from "@/components/saarthi/saarthi-presence"
import { ReadinessRing, bandTone } from "@/components/saarthi/readiness-ring"
import { Skeleton } from "@/components/ui/skeleton"
import { saarthi } from "@/lib/saarthi-events"
import { fetchPlan, type StudyPlan } from "@/lib/ai"
import { cn } from "@/lib/utils"

const AREA_LABEL: Record<string, string> = {
  coding: "coding", aptitude: "aptitude", practice: "practice", points: "overall points",
}

export function SaarthiHero({ firstName }: { firstName?: string }) {
  const [plan, setPlan] = useState<StudyPlan | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    fetchPlan()
      .then((p) => { if (alive) setPlan(p) })
      .catch(() => {})
      .finally(() => { if (alive) setLoading(false) })
    return () => { alive = false }
  }, [])

  // Greet once the plan is in, so the first thing on screen is Saarthi noticing you.
  useEffect(() => {
    if (!plan) return
    const t = setTimeout(() => {
      saarthi.emit("greet", { name: firstName ?? "" },
                   plan.narration?.greeting || undefined)
    }, 650)
    return () => clearTimeout(t)
  }, [plan, firstName])

  const chips = useMemo(() => buildChips(plan), [plan])

  if (loading) return <Skeleton className="h-[15.5rem] w-full rounded-2xl" />
  if (!plan) return null

  const { readiness, narration, progress, highlights } = plan
  const nextItem = plan.items.find((i) => !i.done) ?? null
  const allDone = progress.total > 0 && progress.done === progress.total

  // A drive inside a week with blockers is worth a worried orb.
  const drive = highlights?.next_drive
  const baseMood =
    allDone ? "celebrating"
    : drive && drive.days_away != null && drive.days_away <= 7 && !drive.eligible ? "concerned"
    : "idle"

  return (
    <GlassCard className="relative overflow-hidden p-5 md:p-6">
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative flex flex-col gap-5 md:flex-row md:items-center">
        {/* Readiness — Saarthi owns this number on this surface */}
        <Link href="/my-plan" className="mx-auto shrink-0 md:mx-0">
          <ReadinessRing score={readiness.score} size={150}>
            <div className="grid place-items-center text-center">
              <span className={cn("font-mono text-3xl font-bold tabular-nums",
                                  bandTone(readiness.score))}>
                {readiness.score}
              </span>
              <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                readiness
              </span>
            </div>
          </ReadinessRing>
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-serif text-lg font-bold leading-snug md:text-xl">
                {narration?.greeting ?? `Welcome back, ${firstName ?? "there"}.`}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {narration?.focus ?? "Open your plan to see what's next."}
              </p>
            </div>
            {/* Live reactions land here */}
            <SaarthiPresence size={64} baseMood={baseMood} className="hidden shrink-0 sm:flex" />
          </div>

          {!!chips.length && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {chips.map((c, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.07 }}
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
            className="group mt-4 flex items-center gap-3 rounded-xl border border-primary/25 bg-primary/5 p-3 transition-colors hover:border-primary/50"
          >
            <span className="min-w-0 flex-1">
              <span className="block text-[11px] uppercase tracking-wide text-muted-foreground">
                {allDone ? "Plan complete" : "Do this next"}
              </span>
              <span className="mt-0.5 block truncate text-sm font-semibold">
                {allDone
                  ? "Everything ticked off — rebuild for more"
                  : nextItem?.label ?? narration?.nudge ?? "Open your plan"}
              </span>
            </span>
            <span className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
              {progress.done}/{progress.total}
            </span>
            <ArrowRight className="h-4 w-4 shrink-0 text-primary transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </GlassCard>
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
