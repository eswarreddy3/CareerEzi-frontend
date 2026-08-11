"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowRight, Brain, Building2, Check, Code2, Calculator, PlayCircle, UserRound,
} from "lucide-react"

import type { PlanItem } from "@/lib/ai"
import { cn } from "@/lib/utils"

// Classes are written out in full: Tailwind's JIT scans source text, so a
// dynamically built name like `border-${tint}/30` would never be generated.
const KIND_META: Record<string, { icon: typeof Brain; tile: string; label: string }> = {
  lesson:   { icon: PlayCircle, tile: "border-primary/30 bg-primary/10 text-primary", label: "Learn" },
  practice: { icon: Brain,      tile: "border-warning/30 bg-warning/10 text-warning", label: "Practice" },
  aptitude: { icon: Calculator, tile: "border-warning/30 bg-warning/10 text-warning", label: "Aptitude" },
  coding:   { icon: Code2,      tile: "border-coding/30 bg-coding/10 text-coding",    label: "Code" },
  drive:    { icon: Building2,  tile: "border-success/30 bg-success/10 text-success", label: "Placement" },
  profile:  { icon: UserRound,  tile: "border-coral/30 bg-coral/10 text-coral",       label: "Profile" },
}

/**
 * One action from the plan.
 *
 * Progress is re-derived from live data on every read, so this reflects what
 * the student has actually done without the plan being regenerated.
 */
export function PlanItemRow({ item, index }: { item: PlanItem; index: number }) {
  const meta = KIND_META[item.kind] ?? KIND_META.lesson
  const Icon = meta.icon
  const pct = item.target_count
    ? Math.min(100, Math.round((item.progress / item.target_count) * 100))
    : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3 }}
    >
      <Link
        href={item.deep_link}
        className={cn(
          "group relative flex items-start gap-3 overflow-hidden rounded-xl border p-3.5 transition-colors",
          item.done
            ? "border-success/30 bg-success/5"
            : "border-border bg-card/60 hover:border-primary/40",
        )}
      >
        {/* Progress fills the row itself — the item IS the progress bar */}
        {!item.done && pct > 0 && (
          <span
            className="absolute inset-y-0 left-0 bg-primary/10 transition-[width] duration-500"
            style={{ width: `${pct}%` }}
            aria-hidden
          />
        )}

        <span
          className={cn(
            "relative grid h-9 w-9 shrink-0 place-items-center rounded-lg border",
            item.done ? "border-success/40 bg-success/15 text-success" : meta.tile,
          )}
        >
          {item.done ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
        </span>

        <span className="relative min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <span className={cn("text-sm font-semibold",
                                item.done && "text-muted-foreground line-through")}>
              {item.label}
            </span>
            {item.target_count > 1 && (
              <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
                {item.progress}/{item.target_count}
              </span>
            )}
            {item.points > 0 && !item.done && (
              <span className="chip chip-streak text-[10px]">+{item.points} pts</span>
            )}
          </span>
          <span className="mt-0.5 block text-xs text-muted-foreground">{item.detail}</span>
        </span>

        <ArrowRight className="relative mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
      </Link>
    </motion.div>
  )
}
