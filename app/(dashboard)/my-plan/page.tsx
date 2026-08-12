"use client"

/**
 * My Plan — Saarthi's coach surface.
 *
 * Everything here is computed by the rules engine from the student's own
 * activity. Nothing is generated on page load, so this page costs zero tokens
 * no matter how often it's opened.
 */

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  CalendarDays, CheckCircle2, ChevronRight, Loader2, RefreshCw, Sun,
  Target, TrendingUp, Lightbulb, Lock, GraduationCap,
} from "lucide-react"
import { toast } from "sonner"

import { GlassCard } from "@/components/glass-card"
import { SaarthiOrb, type SaarthiMood } from "@/components/saarthi/orb"
import { ReadinessRing, bandTone } from "@/components/saarthi/readiness-ring"
import { PlanItemRow } from "@/components/saarthi/plan-item"
import { TopicGuideSheet } from "@/components/saarthi/topic-guide-sheet"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useAIStore } from "@/store/aiStore"
import { fetchPlan, refreshPlan, setPlanMode, type StudyPlan } from "@/lib/ai"
import { fireStars } from "@/lib/effects"
import { saarthi } from "@/lib/saarthi-events"
import { cn } from "@/lib/utils"

export default function MyPlanPage() {
  const { caps, load, has } = useAIStore()
  const [plan, setPlan] = useState<StudyPlan | null>(null)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [celebrated, setCelebrated] = useState(false)
  const [denied, setDenied] = useState(false)
  const [guideTopic, setGuideTopic] = useState<string | null>(null)

  useEffect(() => { load() }, [load])

  const loadPlan = useCallback(async () => {
    try {
      setPlan(await fetchPlan())
      setDenied(false)
    } catch (e: any) {
      const status = e?.response?.status
      // The BACKEND is the authority on access, not the capabilities cache.
      // Gating the render on `caps` raced with this fetch: when the plan
      // resolved first, caps was still null and the page wrongly showed
      // "Not available" to a student who genuinely had access.
      if (status === 403) setDenied(true)
      else toast.error(e?.response?.data?.message ?? "Could not load your plan")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadPlan() }, [loadPlan])

  // Celebrate finishing the whole plan — once, not on every re-render.
  useEffect(() => {
    if (plan && plan.progress.total > 0 && plan.progress.done === plan.progress.total && !celebrated) {
      setCelebrated(true)
      fireStars()
      saarthi.emit("plan_complete")
    }
  }, [plan, celebrated])

  // Items tick from live data on each read, so a student returning after doing
  // the work sees Saarthi notice it. Only fires when the count actually rises.
  const prevDone = useRef<number | null>(null)
  useEffect(() => {
    if (!plan) return
    const done = plan.progress.done
    if (prevDone.current !== null && done > prevDone.current && done < plan.progress.total) {
      saarthi.emit("plan_item_done", { left: plan.progress.total - done })
    }
    prevDone.current = done
  }, [plan])

  async function changeMode(mode: "daily" | "weekly") {
    if (!plan || plan.plan_mode === mode || busy) return
    setBusy(true)
    try {
      setPlan(await setPlanMode(mode))
      setCelebrated(false)
    } catch { toast.error("Could not switch plan mode") } finally { setBusy(false) }
  }

  async function doRefresh() {
    setBusy(true)
    try {
      setPlan(await refreshPlan())
      setCelebrated(false)
      toast.success("Plan rebuilt from your latest activity")
    } catch (e: any) {
      if (e?.response?.status === 429) {
        // Backstop: another tab may have spent the last rebuild.
        const q = e.response.data?.quota
        if (q) setPlan((p) => (p ? { ...p, quota: q } : p))
        toast.error(e.response.data?.message ?? "No rebuilds left today")
      } else {
        toast.error("Could not refresh your plan")
      }
    } finally { setBusy(false) }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-60 w-full rounded-2xl" />
        <Skeleton className="h-72 w-full rounded-2xl" />
      </div>
    )
  }

  if (denied) {
    return (
      <GlassCard className="p-10 text-center">
        <Lock className="mx-auto h-8 w-8 text-muted-foreground" />
        <h2 className="mt-3 font-serif text-xl font-semibold">Not available</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Your college doesn&apos;t have this feature enabled.
        </p>
      </GlassCard>
    )
  }

  // Reachable when the request failed for a non-403 reason (server error,
  // network). Offer a retry rather than pretending it's a licensing problem.
  if (!plan) {
    return (
      <GlassCard className="p-10 text-center">
        <h2 className="font-serif text-xl font-semibold">Couldn&apos;t load your plan</h2>
        <p className="mt-1 text-sm text-muted-foreground">Something went wrong on our side.</p>
        <Button className="mt-4" onClick={() => { setLoading(true); loadPlan() }}>
          <RefreshCw className="mr-1.5 h-4 w-4" />Try again
        </Button>
      </GlassCard>
    )
  }

  const { readiness, narration, items, progress, quota } = plan
  // Only Rebuild is rationed. Reading the plan, switching mode and opening a
  // topic guide are all free and must never be blocked by this.
  const outOfRebuilds = !!quota && quota.limit > 0 && (quota.remaining ?? 0) <= 0
  const resetsAtLabel = quota?.resets_at
    ? new Date(quota.resets_at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
    : "midnight"
  const allDone = progress.total > 0 && progress.done === progress.total
  const mood: SaarthiMood = allDone ? "celebrating"
    : readiness.score < 35 ? "concerned" : "idle"

  return (
    <div className="space-y-5">
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <GlassCard className="p-5 md:p-7">
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-center">
          <ReadinessRing score={readiness.score} size={176}>
            <div className="grid place-items-center">
              <SaarthiOrb mood={mood} size={92} />
              <div className="-mt-1 text-center">
                <div className={cn("font-mono text-2xl font-bold tabular-nums", bandTone(readiness.score))}>
                  {readiness.score}
                </div>
                <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
                  readiness
                </div>
              </div>
            </div>
          </ReadinessRing>

          <div className="min-w-0 flex-1 text-center md:text-left">
            <span className={cn("chip", readiness.score >= 60 ? "chip-success" : "chip-warning")}>
              {readiness.band}
            </span>
            <h1 className="mt-2 font-serif text-2xl font-bold leading-tight">
              {narration.greeting}
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">{narration.focus}</p>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 md:justify-start">
              <div className="inline-flex rounded-lg border border-border bg-card/60 p-0.5">
                {(["daily", "weekly"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => changeMode(m)}
                    disabled={busy}
                    className={cn(
                      "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors",
                      plan.plan_mode === m
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {m === "daily" ? <Sun className="h-3.5 w-3.5" /> : <CalendarDays className="h-3.5 w-3.5" />}
                    {m}
                  </button>
                ))}
              </div>
              {/* Rebuild is the ONLY action that costs anything, so it is the
                  only one that carries a daily limit. The button knows its own
                  state from the plan payload — no click needed to find out. */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline" size="sm" onClick={doRefresh}
                  disabled={busy || outOfRebuilds}
                  title={outOfRebuilds
                    ? `No rebuilds left today. Resets at ${resetsAtLabel}.`
                    : "Rebuild your plan from your latest activity"}
                >
                  {busy ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                        : <RefreshCw className="mr-1.5 h-3.5 w-3.5" />}
                  Rebuild
                </Button>
                {quota && quota.limit > 0 && (
                  <span className={cn("font-mono text-[11px] tabular-nums",
                                      outOfRebuilds ? "text-warning" : "text-muted-foreground")}>
                    {outOfRebuilds
                      ? `resets ${resetsAtLabel}`
                      : `${quota.remaining ?? quota.limit - quota.used} left today`}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* ── The plan ──────────────────────────────────────────────────────── */}
      <GlassCard className="p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 font-semibold">
            <Target className="h-4 w-4 text-primary" />
            {plan.plan_mode === "daily" ? "Today" : "This week"}
          </h2>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs tabular-nums text-muted-foreground">
              {progress.done}/{progress.total}
            </span>
            <div className="h-1.5 w-24 overflow-hidden rounded-full bg-border">
              <motion.div
                className={cn("h-full rounded-full", allDone ? "bg-success" : "bg-primary")}
                initial={{ width: 0 }}
                animate={{ width: `${progress.percentage}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>

        {allDone && (
          <div className="mb-3 flex items-center gap-2 rounded-xl border border-success/30 bg-success/10 p-3 text-sm">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
            <span>
              Everything done{plan.plan_mode === "daily" ? " today" : " this week"}. Rebuild for more.
            </span>
          </div>
        )}

        <div className="space-y-2.5">
          {items.map((item, i) => (
            <PlanItemRow key={`${item.kind}-${item.target_id ?? i}`} item={item} index={i} />
          ))}
        </div>
      </GlassCard>

      {/* ── Weakness + readiness breakdown ────────────────────────────────── */}
      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard className="p-5">
          <h2 className="flex items-center gap-2 font-semibold">
            <Lightbulb className="h-4 w-4 text-warning" />Where you&apos;re losing marks
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">{narration.weakness_note}</p>

          {!!plan.highlights?.weak_topics?.length && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {plan.highlights.weak_topics.map((w) => (
                <button
                  key={w.topic}
                  onClick={() => setGuideTopic(w.topic)}
                  className="chip chip-warning inline-flex items-center gap-1 transition-opacity hover:opacity-80"
                >
                  <GraduationCap className="h-3 w-3" />
                  {w.topic} · {w.accuracy}%
                </button>
              ))}
            </div>
          )}
          <p className="mt-1.5 text-[11px] text-muted-foreground">
            Tap a topic and Saarthi will walk you through it.
          </p>

          <div className="mt-4 space-y-2">
            {readiness.gaps.map((gap, i) => (
              <div key={i} className="rounded-lg border border-border bg-card/60 p-3">
                <div className="flex items-start justify-between gap-3">
                  <span className="text-sm font-medium">{gap.label}</span>
                  {gap.worth > 0 && (
                    <span className="chip chip-primary shrink-0 text-[10px]">+{gap.worth}</span>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">{gap.why}</p>
              </div>
            ))}
            {!readiness.gaps.length && (
              <p className="text-sm text-success">No gaps left — you&apos;re in great shape.</p>
            )}
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <h2 className="flex items-center gap-2 font-semibold">
            <TrendingUp className="h-4 w-4 text-primary" />How your score is built
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Four parts, 100 points. Nothing here is guesswork — it&apos;s all from what you&apos;ve done.
          </p>

          <div className="mt-4 space-y-3.5">
            {readiness.components.map((c) => {
              const pct = c.max ? Math.round((c.earned / c.max) * 100) : 0
              return (
                <div key={c.key}>
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-sm font-medium">{c.label}</span>
                    <span className="font-mono text-xs tabular-nums text-muted-foreground">
                      {c.earned}/{c.max}
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-border">
                    <motion.div
                      className={cn("h-full rounded-full",
                        pct >= 70 ? "bg-success" : pct >= 40 ? "bg-primary" : "bg-warning")}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.7, ease: "easeOut" }}
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground">{c.detail}</p>
                </div>
              )
            })}
          </div>
        </GlassCard>
      </div>

      <TopicGuideSheet
        topic={guideTopic}
        open={!!guideTopic}
        onClose={() => setGuideTopic(null)}
      />

      <p className="pb-2 text-center text-[11px] text-muted-foreground">
        Updated {new Date(plan.generated_at).toLocaleString()} · Saarthi builds this from your own activity
      </p>
    </div>
  )
}
