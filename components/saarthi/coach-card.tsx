"use client"

/**
 * The Saarthi card on the student dashboard.
 *
 * Reads a stored plan row — it NEVER generates. /dashboard is the busiest
 * authenticated page in the product, and generating per view instead of per
 * period would cost 25-130x more and add a spinner to every login.
 *
 * Renders nothing at all when the college isn't licensed: no teaser, no locked
 * state. Students who don't have it never learn it exists.
 *
 * NOTE: this card shows PLAN PROGRESS, not a readiness score, deliberately.
 * The dashboard already has PlacementReadinessCard, which computes its own
 * score from a different formula (module/mcq/coding/assignment/streak, all
 * client-side). Two contradictory "readiness" numbers on one page would
 * undermine both. Saarthi's richer score — which also weighs CGPA, backlogs,
 * profile completeness and drive eligibility — lives on /my-plan, where it is
 * the only number on the page.
 */

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"

import { GlassCard } from "@/components/glass-card"
import { SaarthiOrb } from "@/components/saarthi/orb"
import { ReadinessRing } from "@/components/saarthi/readiness-ring"
import { Skeleton } from "@/components/ui/skeleton"
import { useAIStore } from "@/store/aiStore"
import { fetchPlan, type StudyPlan } from "@/lib/ai"
import { cn } from "@/lib/utils"

export function SaarthiCoachCard() {
  const { caps, load, has } = useAIStore()
  const [plan, setPlan] = useState<StudyPlan | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [load])

  useEffect(() => {
    if (!caps) return
    if (!has("ai_coach")) { setLoading(false); return }
    let alive = true
    fetchPlan()
      .then((p) => { if (alive) setPlan(p) })
      .catch(() => {})
      .finally(() => { if (alive) setLoading(false) })
    return () => { alive = false }
  }, [caps, has])

  if (!caps || !has("ai_coach")) return null
  if (loading) return <Skeleton className="h-36 w-full rounded-2xl" />
  if (!plan) return null

  const { narration, progress } = plan
  const allDone = progress.total > 0 && progress.done === progress.total

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <Link href="/my-plan" className="block">
        <GlassCard className="group p-4 transition-colors hover:border-primary/40 sm:p-5">
          <div className="flex items-center gap-4">
            {/* Ring tracks plan progress — see the note at the top of this file */}
            <ReadinessRing score={progress.percentage} size={104} stroke={7}>
              <div className="grid place-items-center">
                <SaarthiOrb mood={allDone ? "celebrating" : "idle"} size={52} gaze={false} />
                <span className={cn("-mt-0.5 font-mono text-xs font-bold tabular-nums",
                                    allDone ? "text-success" : "text-muted-foreground")}>
                  {progress.done}/{progress.total}
                </span>
              </div>
            </ReadinessRing>

            <div className="min-w-0 flex-1">
              <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-coding">
                <Sparkles className="h-3 w-3" />Saarthi
              </span>
              <p className="mt-0.5 line-clamp-2 text-sm font-semibold leading-snug">
                {allDone
                  ? `All done ${plan.plan_mode === "daily" ? "today" : "this week"}. Nicely played.`
                  : narration.nudge ?? "Open your plan"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {progress.done} of {progress.total} done ·{" "}
                <span className="capitalize">{plan.plan_mode}</span> plan
              </p>

              <div className="mt-2 h-1.5 w-full max-w-[220px] overflow-hidden rounded-full bg-border">
                <motion.div
                  className={cn("h-full rounded-full", allDone ? "bg-success" : "bg-primary")}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress.percentage}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </div>

            <ArrowRight className="hidden h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 sm:block" />
          </div>
        </GlassCard>
      </Link>
    </motion.div>
  )
}
