"use client"

/**
 * Mock interview setup — track × level × round, then the room opens in a NEW TAB.
 *
 * New tab is deliberate: the room goes fullscreen and drops all app chrome, and
 * a student who accidentally navigates back mid-interview would lose the
 * session. A separate tab means the dashboard is still sitting there when they
 * finish.
 */

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Building2, Camera, CheckCircle2, Clock, Layers, Loader2, Lock, Mic, Sparkles, Wrench,
} from "lucide-react"
import { toast } from "sonner"

import { GlassCard } from "@/components/glass-card"
import { SaarthiOrb } from "@/components/saarthi/orb"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { bandTone } from "@/components/saarthi/readiness-ring"
import {
  fetchInterviewHistory, fetchInterviewOptions, startInterview,
  type InterviewLevel, type InterviewOptions, type InterviewRound,
  type InterviewSession, type InterviewTrack,
} from "@/lib/ai"
import { detectSpeechSupport } from "@/lib/speech"
import { cn } from "@/lib/utils"

const TRACK_META: { key: InterviewTrack; label: string; hint: string; icon: typeof Building2 }[] = [
  { key: "company", label: "Company", hint: "Grounded in their real hiring rounds", icon: Building2 },
  { key: "domain",  label: "Domain",  hint: "Data Science, Web Dev, and more",      icon: Layers },
  { key: "skill",   label: "Skill",   hint: "Python, SQL, Full-stack, DSA",         icon: Wrench },
]

export default function MockInterviewPage() {
  const [options, setOptions] = useState<InterviewOptions | null>(null)
  const [history, setHistory] = useState<InterviewSession[]>([])
  const [loading, setLoading] = useState(true)
  const [denied, setDenied] = useState(false)
  const [starting, setStarting] = useState(false)

  const [track, setTrack] = useState<InterviewTrack>("skill")
  const [trackRef, setTrackRef] = useState<string>("python")
  const [level, setLevel] = useState<InterviewLevel>("fresher")
  const [round, setRound] = useState<InterviewRound>("mixed")

  const [support] = useState(() => detectSpeechSupport())

  const load = useCallback(async () => {
    try {
      const [o, h] = await Promise.all([fetchInterviewOptions(), fetchInterviewHistory()])
      setOptions(o); setHistory(h)
      if (o.tracks.skill.length) setTrackRef(o.tracks.skill[0].ref)
    } catch (e: any) {
      if (e?.response?.status === 403) setDenied(true)
      else toast.error("Could not load interview options")
    } finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  async function begin() {
    setStarting(true)
    try {
      const s = await startInterview({
        track, track_ref: trackRef, level, round,
        input_mode: support.recognition ? "voice" : "text",
      })
      // New tab: the room is fullscreen and chrome-less, and a stray Back
      // would otherwise abandon the session.
      window.open(`/interview/${s.session_uid}`, "_blank", "noopener")
      load()
    } catch (e: any) {
      toast.error(e?.response?.status === 429
        ? e.response.data?.message ?? "No interviews left today"
        : "Could not start the interview")
    } finally { setStarting(false) }
  }

  if (loading) return <div className="space-y-4"><Skeleton className="h-96 w-full rounded-2xl" /></div>

  if (denied || !options) {
    return (
      <GlassCard className="p-10 text-center">
        <Lock className="mx-auto h-8 w-8 text-muted-foreground" />
        <h2 className="mt-3 font-serif text-xl font-semibold">Not available</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Your college doesn&apos;t have mock interviews enabled.
        </p>
      </GlassCard>
    )
  }

  const list = options.tracks[track] ?? []
  const quota = options.quota
  const out = !!quota && quota.limit > 0 && (quota.remaining ?? 0) <= 0

  return (
    <div className="space-y-5">
      <GlassCard className="p-5 md:p-6">
        <div className="flex items-start gap-4">
          <SaarthiOrb mood="idle" size={64} />
          <div className="min-w-0 flex-1">
            <h1 className="font-serif text-2xl font-bold">Mock Interview</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              A real interview, with Saarthi asking. She speaks the questions, you answer out
              loud, and you get a scored report at the end.
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <span className="chip chip-primary inline-flex items-center gap-1">
                <Clock className="h-3 w-3" />~10 minutes
              </span>
              <span className={cn("chip inline-flex items-center gap-1",
                                  support.recognition ? "chip-success" : "chip-warning")}>
                <Mic className="h-3 w-3" />
                {support.recognition ? "Voice ready" : "Voice unsupported — typing works"}
              </span>
              <span className="chip chip-coding inline-flex items-center gap-1">
                <Camera className="h-3 w-3" />Camera stays on your device
              </span>
            </div>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-5">
        <Step n={1} title="What are you interviewing for?" />
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {TRACK_META.map((t) => (
            <button
              key={t.key}
              onClick={() => {
                setTrack(t.key)
                setTrackRef(options.tracks[t.key]?.[0]?.ref ?? "")
              }}
              className={cn("rounded-xl border p-3 text-left transition-colors",
                track === t.key ? "border-primary bg-primary/10" : "border-border hover:border-primary/40")}
            >
              <t.icon className={cn("h-4 w-4", track === t.key ? "text-primary" : "text-muted-foreground")} />
              <p className="mt-1.5 text-sm font-semibold">{t.label}</p>
              <p className="text-[11px] text-muted-foreground">{t.hint}</p>
            </button>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {list.length ? list.map((o) => (
            <button
              key={o.ref}
              onClick={() => setTrackRef(o.ref)}
              className={cn("chip transition-opacity hover:opacity-80",
                            trackRef === o.ref ? "chip-primary" : "")}
            >
              {o.label}
            </button>
          )) : (
            <p className="text-xs text-muted-foreground">
              Nothing set up for this track yet — try another.
            </p>
          )}
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <Step n={2} title="Your experience level" />
            <div className="mt-2 flex flex-wrap gap-1.5">
              {options.levels.map((l) => (
                <button key={l.value} onClick={() => setLevel(l.value)}
                  className={cn("chip transition-opacity hover:opacity-80",
                                level === l.value ? "chip-primary" : "")}>
                  {l.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Step n={3} title="Round type" />
            <div className="mt-2 flex flex-wrap gap-1.5">
              {options.rounds.map((r) => (
                <button key={r.value} onClick={() => setRound(r.value)}
                  className={cn("chip transition-opacity hover:opacity-80",
                                round === r.value ? "chip-primary" : "")}>
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-border pt-4">
          <Button size="lg" onClick={begin} disabled={starting || out || !trackRef}>
            {starting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      : <Sparkles className="mr-2 h-4 w-4" />}
            Start interview
          </Button>
          {quota && quota.limit > 0 && (
            <span className={cn("font-mono text-xs tabular-nums",
                                out ? "text-warning" : "text-muted-foreground")}>
              {out ? "no interviews left today"
                   : `${quota.remaining ?? quota.limit - quota.used} left today`}
            </span>
          )}
          <span className="text-xs text-muted-foreground">Opens in a new tab</span>
        </div>
      </GlassCard>

      {!!history.length && (
        <GlassCard className="p-5">
          <h2 className="font-semibold">Past interviews</h2>
          <div className="mt-3 divide-y divide-border/60">
            {history.map((h) => (
              <motion.div key={h.session_uid} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                          className="flex items-center gap-3 py-2.5">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{h.track_label}</p>
                  <p className="font-mono text-[11px] text-muted-foreground">
                    {h.level_label} · {h.round_label} ·{" "}
                    {new Date(h.started_at).toLocaleDateString()}
                  </p>
                </div>
                {h.status === "completed" && h.overall_score != null ? (
                  <>
                    <span className={cn("font-mono text-sm font-bold tabular-nums",
                                        bandTone(h.overall_score))}>
                      {h.overall_score}
                    </span>
                    <Link href={`/interview/${h.session_uid}`} target="_blank"
                          className="text-xs text-primary hover:underline">
                      View
                    </Link>
                  </>
                ) : h.status === "in_progress" ? (
                  <Link href={`/interview/${h.session_uid}`} target="_blank"
                        className="chip chip-warning">Resume</Link>
                ) : (
                  <span className="chip">Abandoned</span>
                )}
              </motion.div>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  )
}

function Step({ n, title }: { n: number; title: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="grid h-5 w-5 place-items-center rounded-full bg-primary/15 font-mono text-[11px] text-primary">
        {n}
      </span>
      <span className="text-sm font-semibold">{title}</span>
    </div>
  )
}
