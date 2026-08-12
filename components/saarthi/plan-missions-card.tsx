"use client"

/**
 * Saarthi's plan, on the dashboard — the personalised replacement for the
 * static "Weekly Missions" card.
 *
 * WeeklyMissionsCard shows the same five hardcoded goals to every student in
 * every college, forever. This shows the items the rules engine actually chose
 * for THIS student from THEIR data, with real targets and live progress.
 *
 * Both on screen at once would be two contradictory answers to "what should I
 * do this week", so the dashboard renders this one OR that one, never both.
 *
 * Reads the stored plan row — no AI call on mount.
 */

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, CheckSquare, Sparkles } from "lucide-react"

import { GlassCard } from "@/components/glass-card"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchPlan, type PlanItem, type StudyPlan } from "@/lib/ai"
import { cn } from "@/lib/utils"

const KIND_ICON: Record<string, string> = {
  lesson: "📚", practice: "❓", aptitude: "🧮",
  coding: "💻", drive: "🏢", profile: "👤",
}

export function SaarthiPlanMissionsCard() {
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

  if (loading) return <Skeleton className="h-64 w-full rounded-2xl" />
  if (!plan) return null

  const { items, progress, plan_mode } = plan
  const pct = progress.percentage
  const daysLeft = plan_mode === "daily" ? 0 : 7 - new Date().getDay()

  return (
    <GlassCard>
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="flex items-center gap-1.5 font-serif text-sm font-semibold">
          <Sparkles className="h-4 w-4 text-coding" />
          {plan_mode === "daily" ? "Today's plan" : "This week's plan"}
        </h3>
        <span className="rounded-full border border-border bg-secondary/50 px-2 py-0.5 text-xs text-muted-foreground">
          {progress.done} of {progress.total} done
          {plan_mode === "weekly" && daysLeft > 0 && ` · ${daysLeft}d left`}
        </span>
      </div>

      <div className="mb-4 flex items-center gap-3">
        <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-secondary/50">
          <motion.div
            className={cn("h-full rounded-full",
              pct === 100 ? "bg-success" : "bg-gradient-to-r from-primary/70 to-coding")}
            initial={{ width: 0 }} animate={{ width: `${pct}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
        <span className="shrink-0 font-mono text-xs font-bold tabular-nums">{pct}%</span>
      </div>

      <div className="space-y-2">
        {items.map((item, i) => (
          <MissionRow key={`${item.kind}-${item.target_id ?? i}`} item={item} index={i} />
        ))}
      </div>

      <Link
        href="/my-plan"
        className="mt-3 flex items-center justify-center gap-1.5 rounded-lg border border-border py-2 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
      >
        Open full plan <ArrowRight className="h-3 w-3" />
      </Link>
    </GlassCard>
  )
}

function MissionRow({ item, index }: { item: PlanItem; index: number }) {
  const pct = item.target_count
    ? Math.min(100, Math.round((item.progress / item.target_count) * 100))
    : 0

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.05 * index }}
    >
      <Link
        href={item.deep_link}
        className={cn(
          "relative flex items-center gap-2.5 overflow-hidden rounded-lg border p-2.5 transition-colors",
          item.done
            ? "border-success/25 bg-success/10"
            : "border-transparent bg-secondary/20 hover:bg-secondary/40",
        )}
      >
        {!item.done && pct > 0 && (
          <span className="absolute inset-y-0 left-0 bg-primary/10" style={{ width: `${pct}%` }} aria-hidden />
        )}
        <span className="relative shrink-0 text-sm">{KIND_ICON[item.kind] ?? "•"}</span>
        <span className={cn("relative flex-1 text-xs leading-snug",
                            item.done ? "text-muted-foreground line-through" : "text-foreground")}>
          {item.label}
        </span>
        {item.target_count > 1 && !item.done && (
          <span className="relative shrink-0 font-mono text-[10px] tabular-nums text-muted-foreground">
            {item.progress}/{item.target_count}
          </span>
        )}
        {item.done && <CheckSquare className="relative h-4 w-4 shrink-0 text-success" />}
      </Link>
    </motion.div>
  )
}
