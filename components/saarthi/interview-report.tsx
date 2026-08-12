"use client"

import { motion } from "framer-motion"
import {
  ArrowLeft, CheckCircle2, Lightbulb, MessageSquare, Target, TrendingUp,
} from "lucide-react"

import { GlassCard } from "@/components/glass-card"
import { SaarthiOrb } from "@/components/saarthi/orb"
import { ReadinessRing, bandTone } from "@/components/saarthi/readiness-ring"
import { Button } from "@/components/ui/button"
import type { InterviewReport, InterviewSession } from "@/lib/ai"
import { cn } from "@/lib/utils"

const VERDICT = (s: number) =>
  s >= 80 ? "Would clear this round"
  : s >= 60 ? "Borderline — could go either way"
  : s >= 40 ? "Not yet, but the gaps are specific"
  : "Needs more preparation first"

export function InterviewReportView({
  report, session, onClose,
}: {
  report: InterviewReport
  session: InterviewSession | null
  onClose: () => void
}) {
  const dims = [
    { label: "Communication", value: report.communication },
    { label: "Technical depth", value: report.technical_depth },
    { label: "Structure", value: report.structure },
    { label: "Confidence", value: report.confidence },
  ]

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <Button variant="ghost" size="sm" onClick={onClose}>
        <ArrowLeft className="mr-1.5 h-4 w-4" />Back to interviews
      </Button>

      {/* Verdict */}
      <GlassCard className="p-6">
        <div className="flex flex-col items-center gap-6 sm:flex-row">
          <ReadinessRing score={report.overall_score} size={150}>
            <div className="grid place-items-center text-center">
              <span className={cn("font-mono text-3xl font-bold tabular-nums",
                                  bandTone(report.overall_score))}>
                {report.overall_score}
              </span>
              <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                out of 100
              </span>
            </div>
          </ReadinessRing>

          <div className="min-w-0 flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center gap-2 sm:justify-start">
              <SaarthiOrb mood={report.overall_score >= 60 ? "celebrating" : "concerned"}
                          size={34} gaze={false} />
              <span className={cn("chip", report.overall_score >= 60 ? "chip-success" : "chip-warning")}>
                {VERDICT(report.overall_score)}
              </span>
            </div>
            <h1 className="mt-2 font-serif text-xl font-bold">
              {session?.track_label} · {session?.round_label}
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">{report.summary}</p>
            {report.measured && (
              <p className="mt-2 font-mono text-[11px] text-muted-foreground">
                {report.measured.answered ?? 0} answered
                {report.measured.total_words != null && ` · ${report.measured.total_words} words`}
                {report.measured.filler_words != null && ` · ${report.measured.filler_words} filler words`}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {dims.map((d, i) => (
            <div key={d.label}>
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-muted-foreground">{d.label}</span>
                <span className="font-mono text-xs font-semibold tabular-nums">{d.value}</span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-border">
                <motion.div
                  className={cn("h-full rounded-full",
                    d.value >= 70 ? "bg-success" : d.value >= 45 ? "bg-primary" : "bg-warning")}
                  initial={{ width: 0 }} animate={{ width: `${d.value}%` }}
                  transition={{ duration: 0.7, delay: i * 0.08 }}
                />
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      <div className="grid gap-4 md:grid-cols-2">
        <GlassCard className="p-5">
          <h2 className="flex items-center gap-2 font-semibold text-success">
            <CheckCircle2 className="h-4 w-4" />What worked
          </h2>
          <ul className="mt-3 space-y-2">
            {report.strengths.map((s, i) => (
              <li key={i} className="flex gap-2 text-sm">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-success" />{s}
              </li>
            ))}
            {!report.strengths.length && (
              <li className="text-sm text-muted-foreground">Nothing stood out this time.</li>
            )}
          </ul>
        </GlassCard>

        <GlassCard className="p-5">
          <h2 className="flex items-center gap-2 font-semibold text-warning">
            <Target className="h-4 w-4" />Fix before the next one
          </h2>
          <ul className="mt-3 space-y-2">
            {report.improvements.map((s, i) => (
              <li key={i} className="flex gap-2 text-sm">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-warning" />{s}
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>

      {!!report.per_question?.length && (
        <GlassCard className="p-5">
          <h2 className="flex items-center gap-2 font-semibold">
            <MessageSquare className="h-4 w-4 text-primary" />Question by question
          </h2>
          <div className="mt-3 divide-y divide-border/60">
            {report.per_question.map((q) => (
              <div key={q.turn} className="flex items-start gap-3 py-2.5">
                <span className="font-mono text-[11px] text-muted-foreground">Q{q.turn}</span>
                <span className="min-w-0 flex-1 text-sm">{q.note}</span>
                <span className={cn("shrink-0 font-mono text-xs font-semibold tabular-nums",
                                    bandTone(q.score))}>
                  {q.score}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {!!report.next_steps?.length && (
        <GlassCard className="p-5">
          <h2 className="flex items-center gap-2 font-semibold">
            <Lightbulb className="h-4 w-4 text-coding" />Do this week
          </h2>
          <ol className="mt-3 space-y-2">
            {report.next_steps.map((s, i) => (
              <li key={i} className="flex gap-2.5 text-sm">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-coding/15 font-mono text-[11px] text-coding">
                  {i + 1}
                </span>
                {s}
              </li>
            ))}
          </ol>
        </GlassCard>
      )}

      <div className="flex justify-center gap-2 pb-6">
        <Button onClick={onClose}>
          <TrendingUp className="mr-1.5 h-4 w-4" />Practise again
        </Button>
      </div>
    </div>
  )
}
