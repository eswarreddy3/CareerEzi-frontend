"use client"

/**
 * Saarthi AI showcase — the flagship landing section.
 *
 * Everything mocked here mirrors a real shipped surface:
 *  - the interview room (track × level × round, voice answers, scored report)
 *  - the readiness ring (academic / skills / practice / profile components)
 *  - the study plan (lesson · practice · aptitude · coding · drive items)
 *  - the four SQL-derived insights (peer, rhythm, projection, momentum)
 *
 * Keep the copy honest: if a capability changes in lib/ai.ts, change it here too.
 */

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import {
  Sparkles, Mic, Radio, CheckCircle2, Target, TrendingUp,
  Users2, Clock, Building2, Activity, BookOpen, Brain,
  Code2, Zap,
} from "lucide-react"
import { FadeIn, TiltCard, Orb } from "./primitives"

// ─── Saarthi orb (landing-only cosmetic twin of components/saarthi/orb) ─────────
function Orbit({ size = 56 }: { size?: number }) {
  return (
    <motion.div
      className="relative flex-shrink-0"
      style={{ width: size, height: size }}
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ background: "radial-gradient(circle at 35% 30%, rgba(129,140,248,0.95), rgba(79,70,229,0.55) 55%, rgba(6,182,212,0.35) 100%)" }}
        animate={{ boxShadow: [
          "0 0 0px rgba(99,102,241,0)",
          "0 0 26px rgba(99,102,241,0.65)",
          "0 0 0px rgba(99,102,241,0)",
        ] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-0 rounded-full border border-white/25"
        animate={{ rotate: 360 }}
        transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
        style={{ borderTopColor: "rgba(255,255,255,0.7)" }}
      />
    </motion.div>
  )
}

// ─── Voice waveform ────────────────────────────────────────────────────────────
function Waveform() {
  const bars = [0.4, 0.75, 1, 0.55, 0.85, 0.35, 0.95, 0.6, 0.45, 0.8, 0.5, 0.7]
  return (
    <div className="flex items-center gap-[3px] h-6">
      {bars.map((b, i) => (
        <motion.span
          key={i}
          className="w-[3px] rounded-full bg-primary"
          animate={{ height: [`${b * 30}%`, `${b * 100}%`, `${b * 30}%`] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.07, ease: "easeInOut" }}
        />
      ))}
    </div>
  )
}

// ─── Interview room mockup ─────────────────────────────────────────────────────
function InterviewRoom() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  const scores = [
    { label: "Communication", val: 82, color: "bg-cyan-400",    text: "text-cyan-600 dark:text-cyan-400" },
    { label: "Technical depth", val: 74, color: "bg-violet-400", text: "text-violet-600 dark:text-violet-400" },
    { label: "Structure",     val: 88, color: "bg-emerald-400", text: "text-emerald-600 dark:text-emerald-400" },
  ]

  return (
    <div ref={ref} className="relative h-full rounded-3xl border overflow-hidden"
      style={{ background: "linear-gradient(135deg,rgba(99,102,241,0.10) 0%,rgba(6,182,212,0.06) 100%)", borderColor: "rgba(99,102,241,0.35)" }}>

      <div className="relative z-10 p-5 sm:p-6 flex flex-col h-full gap-4">

        {/* Room header */}
        <div className="flex items-center gap-3">
          <Orbit size={52} />
          <div className="min-w-0">
            <h3 className="font-bold text-base leading-tight">AI Mock Interview</h3>
            <p className="text-xs text-muted-foreground">Saarthi asks · you answer out loud</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-danger/10 border border-danger/25">
            <motion.span animate={{ opacity: [1, 0.25, 1] }} transition={{ duration: 1.4, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-danger" />
            <span className="text-[10px] font-bold text-danger">REC</span>
          </div>
        </div>

        {/* Config chips — track × level × round, exactly as the setup screen offers */}
        <div className="flex flex-wrap gap-1.5">
          {[
            { icon: Building2, label: "Company · Zoho", cls: "bg-amber-500/10 border-amber-500/25 text-amber-600 dark:text-amber-400" },
            { icon: Target,    label: "Fresher",        cls: "bg-primary/10 border-primary/25 text-primary" },
            { icon: Radio,     label: "Mixed round",    cls: "bg-violet-500/10 border-violet-500/25 text-violet-600 dark:text-violet-400" },
          ].map((c) => (
            <span key={c.label} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[10px] font-semibold ${c.cls}`}>
              <c.icon className="w-3 h-3" />{c.label}
            </span>
          ))}
        </div>

        {/* Question bubble */}
        <div className="rounded-2xl bg-secondary/40 border border-border p-3.5">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Sparkles className="w-3 h-3 text-primary" />
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Saarthi · Question 4 of 8</span>
          </div>
          <motion.p
            className="text-xs sm:text-[13px] text-foreground/85 leading-relaxed"
            animate={{ opacity: [0.65, 1, 0.65] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          >
            &ldquo;Walk me through a time your first solution didn&rsquo;t scale. What did you
            change, and how did you know it worked?&rdquo;
          </motion.p>
        </div>

        {/* Live answer capture */}
        <div className="rounded-2xl bg-primary/8 border border-primary/25 p-3.5 flex items-center gap-3">
          <motion.div
            animate={{ boxShadow: [
              "0 0 0px rgba(99,102,241,0)", "0 0 18px rgba(99,102,241,0.5)", "0 0 0px rgba(99,102,241,0)",
            ] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            className="w-9 h-9 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center flex-shrink-0"
          >
            <Mic className="w-4 h-4 text-primary" />
          </motion.div>
          <Waveform />
          <span className="ml-auto text-[10px] font-mono text-muted-foreground">04:12</span>
        </div>

        {/* Answered turns — fills the middle so the card breathes at any height */}
        <div className="flex-1 min-h-0 rounded-2xl border border-border bg-card/40 p-3.5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2.5">
            Earlier in this round
          </p>
          <div className="space-y-2">
            {[
              { q: "Why this role over a service company?", score: 4, note: "Clear motivation, thin on specifics" },
              { q: "Explain a hash collision to a non-engineer.", score: 5, note: "Strong analogy, well paced" },
              { q: "Which project are you proudest of?", score: 3, note: "Rambled — no measurable outcome" },
            ].map((t, i) => (
              <motion.div
                key={t.q}
                initial={{ opacity: 0, y: 6 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.12 }}
                className="flex items-start gap-2.5"
              >
                <span className="text-[9px] font-mono text-muted-foreground/60 mt-0.5 flex-shrink-0">
                  0{i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] text-foreground/75 leading-snug truncate">{t.q}</p>
                  <p className="text-[9px] text-muted-foreground mt-0.5 leading-snug">{t.note}</p>
                </div>
                <div className="flex gap-0.5 flex-shrink-0 mt-0.5">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <span key={s} className={`w-1 h-3 rounded-full ${s < t.score ? "bg-primary" : "bg-secondary"}`} />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Scored report */}
        <div className="rounded-2xl border border-border bg-card/60 p-3.5 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Scored report</span>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-success">
              <CheckCircle2 className="w-3 h-3" />Ready in seconds
            </span>
          </div>
          {scores.map((s, i) => (
            <div key={s.label} className="flex items-center gap-2.5">
              <span className="text-[10px] text-muted-foreground w-24 flex-shrink-0">{s.label}</span>
              <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                <motion.div className={`h-full rounded-full ${s.color}`}
                  initial={{ width: 0 }}
                  animate={inView ? { width: `${s.val}%` } : { width: 0 }}
                  transition={{ duration: 0.9, delay: 0.3 + i * 0.15, ease: "easeOut" }} />
              </div>
              <span className={`text-[10px] font-bold w-6 text-right ${s.text}`}>{s.val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Readiness ring ────────────────────────────────────────────────────────────
const R = 46
const CIRC = 2 * Math.PI * R

function ReadinessCard() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  const score = 72

  const components = [
    { label: "Academic", earned: 22, max: 25, color: "text-primary",       bar: "bg-primary" },
    { label: "Skills",   earned: 19, max: 30, color: "text-violet-600 dark:text-violet-400",    bar: "bg-violet-400" },
    { label: "Practice", earned: 21, max: 30, color: "text-cyan-600 dark:text-cyan-400",      bar: "bg-cyan-400" },
    { label: "Profile",  earned: 10, max: 15, color: "text-emerald-600 dark:text-emerald-400",   bar: "bg-emerald-400" },
  ]

  return (
    <div ref={ref} className="rounded-3xl border p-5 sm:p-6"
      style={{ background: "linear-gradient(135deg,rgba(52,211,153,0.09) 0%,rgba(99,102,241,0.06) 100%)", borderColor: "rgba(52,211,153,0.32)" }}>
      <div className="flex items-center gap-4">
        {/* Ring */}
        <div className="relative flex-shrink-0" style={{ width: 108, height: 108 }}>
          <svg width="108" height="108" viewBox="0 0 108 108" className="-rotate-90">
            <circle cx="54" cy="54" r={R} fill="none" strokeWidth="8"
              className="stroke-secondary" />
            <motion.circle
              cx="54" cy="54" r={R} fill="none" strokeWidth="8" strokeLinecap="round"
              className="stroke-success"
              strokeDasharray={CIRC}
              initial={{ strokeDashoffset: CIRC }}
              animate={inView ? { strokeDashoffset: CIRC * (1 - score / 100) } : { strokeDashoffset: CIRC }}
              transition={{ duration: 1.4, ease: "easeOut", delay: 0.2 }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-success leading-none">{score}</span>
            <span className="text-[9px] text-muted-foreground mt-0.5">/ 100</span>
          </div>
        </div>

        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Placement readiness</p>
          <h3 className="font-bold text-base mt-0.5">On track</h3>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            One score, four components — recalculated from real activity, not a self-rating.
          </p>
        </div>
      </div>

      {/* Component breakdown */}
      <div className="mt-4 space-y-2">
        {components.map((c, i) => (
          <div key={c.label} className="flex items-center gap-2.5">
            <span className="text-[10px] text-muted-foreground w-16 flex-shrink-0">{c.label}</span>
            <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
              <motion.div className={`h-full rounded-full ${c.bar}`}
                initial={{ width: 0 }}
                animate={inView ? { width: `${(c.earned / c.max) * 100}%` } : { width: 0 }}
                transition={{ duration: 0.8, delay: 0.4 + i * 0.1, ease: "easeOut" }} />
            </div>
            <span className={`text-[10px] font-bold w-11 text-right ${c.color}`}>{c.earned}/{c.max}</span>
          </div>
        ))}
      </div>

      {/* Top gap — the "what do I do about it" half */}
      <div className="mt-4 flex items-start gap-2.5 rounded-2xl bg-warning/10 border border-warning/25 p-3">
        <Target className="w-3.5 h-3.5 text-warning flex-shrink-0 mt-0.5" />
        <div className="min-w-0">
          <p className="text-[11px] font-bold text-warning leading-tight">Biggest gap: quantitative aptitude</p>
          <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">
            30 questions at 60%+ closes it — worth <span className="font-bold text-warning">+6</span> readiness.
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── Study plan ────────────────────────────────────────────────────────────────
function StudyPlanCard() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  const items = [
    { icon: BookOpen,  label: "Finish DSA · Hashing lesson", detail: "2 lessons left", pts: 40, done: true,  color: "text-primary",     bg: "bg-primary/10",     border: "border-primary/25" },
    { icon: Brain,     label: "Percentages drill",           detail: "20 questions",   pts: 30, done: true,  color: "text-violet-600 dark:text-violet-400",  bg: "bg-violet-500/10",  border: "border-violet-500/25" },
    { icon: Code2,     label: "Solve 2 array problems",      detail: "Medium tier",    pts: 50, done: false, color: "text-cyan-600 dark:text-cyan-400",    bg: "bg-cyan-500/10",    border: "border-cyan-500/25" },
    { icon: Building2, label: "Register · Zoho drive",       detail: "Closes in 5 days", pts: 20, done: false, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10",   border: "border-amber-500/25" },
  ]
  const doneCount = items.filter((i) => i.done).length

  return (
    <div ref={ref} className="rounded-3xl border p-5 sm:p-6"
      style={{ background: "linear-gradient(135deg,rgba(168,85,247,0.09) 0%,rgba(236,72,153,0.05) 100%)", borderColor: "rgba(168,85,247,0.32)" }}>

      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-violet-600 dark:text-violet-400" />
          <h3 className="font-bold text-base">Today&rsquo;s plan</h3>
        </div>
        <span className="text-[10px] font-bold text-violet-600 dark:text-violet-400 px-2 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/25">
          {doneCount}/{items.length} done
        </span>
      </div>
      <p className="text-xs text-muted-foreground mb-4">
        Built from what this student actually did — switchable to a weekly plan.
      </p>

      <div className="space-y-2">
        {items.map((it, i) => (
          <motion.div key={it.label}
            initial={{ opacity: 0, x: -10 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.45, delay: 0.15 + i * 0.1 }}
            className={`flex items-center gap-2.5 p-2.5 rounded-2xl border ${it.bg} ${it.border}`}
          >
            <div className={`w-7 h-7 rounded-xl ${it.bg} border ${it.border} flex items-center justify-center flex-shrink-0`}>
              <it.icon className={`w-3.5 h-3.5 ${it.color}`} />
            </div>
            <div className="min-w-0 flex-1">
              <p className={`text-[11px] font-semibold leading-tight truncate ${it.done ? "line-through text-muted-foreground" : ""}`}>
                {it.label}
              </p>
              <p className="text-[9px] text-muted-foreground mt-0.5">{it.detail}</p>
            </div>
            {it.done
              ? <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
              : <span className={`text-[9px] font-bold ${it.color} flex-shrink-0`}>+{it.pts}</span>}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ─── Insight strip ─────────────────────────────────────────────────────────────
const insights = [
  {
    icon: Users2, color: "text-cyan-600 dark:text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/25",
    title: "Peer percentile",
    desc: "Where this student sits against their own cohort — strongest and weakest area, not a generic benchmark.",
  },
  {
    icon: Clock, color: "text-violet-600 dark:text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/25",
    title: "Study rhythm",
    desc: "Detects the hours they actually focus in, and schedules the plan around that window.",
  },
  {
    icon: Building2, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/25",
    title: "Drive projection",
    desc: "Names the next drive, whether they're eligible today, and exactly what's blocking them.",
  },
  {
    icon: Activity, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/25",
    title: "Momentum",
    desc: "This week against last week — so a quiet stretch surfaces before it becomes a lost month.",
  },
]

// ─── Section ───────────────────────────────────────────────────────────────────
export function AIShowcase() {
  return (
    <section id="ai" className="scroll-mt-20 py-20 sm:py-28 px-4 sm:px-6 relative overflow-hidden">
      <Orb className="w-[600px] h-[600px] bg-primary/8 -left-40 top-1/4" />
      <Orb className="w-[500px] h-[500px] bg-violet-500/8 -right-32 bottom-0" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Header */}
        <FadeIn className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs sm:text-sm mb-5 font-semibold uppercase tracking-wide">
            <Sparkles className="w-3.5 h-3.5" /> The AI Layer
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif mb-4 leading-tight">
            Meet <span className="gradient-text">Saarthi</span>.
            <br />
            The coach that already knows the student.
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Not a chatbot bolted onto a course catalogue. Saarthi reads every lesson, every
            attempt, and every drive deadline on the platform — then runs the interview and
            writes the plan.
          </p>
        </FadeIn>

        {/* Two-column flagship */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 items-stretch">
          <FadeIn delay={0.05}>
            <TiltCard>
              <InterviewRoom />
            </TiltCard>
          </FadeIn>

          <div className="flex flex-col gap-4 sm:gap-5">
            <FadeIn delay={0.12}><ReadinessCard /></FadeIn>
            <FadeIn delay={0.18}><StudyPlanCard /></FadeIn>
          </div>
        </div>

        {/* Insight strip */}
        <FadeIn delay={0.1} className="mt-10 sm:mt-14">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-muted-foreground mb-5">
            Four things a generic AI can&rsquo;t tell you
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {insights.map((ins, i) => (
              <motion.div key={ins.title}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 280 }}
                className={`glass-card rounded-2xl p-5 border ${ins.border} h-full`}
              >
                <div className={`w-10 h-10 rounded-2xl ${ins.bg} border ${ins.border} flex items-center justify-center mb-3.5`}>
                  <ins.icon className={`w-5 h-5 ${ins.color}`} />
                </div>
                <h4 className={`text-sm font-bold mb-2 ${ins.color}`}>{ins.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{ins.desc}</p>
              </motion.div>
            ))}
          </div>
        </FadeIn>

        {/* Honest footnote — these are per-college packs, not blanket features */}
        <FadeIn delay={0.15}>
          <p className="mt-8 text-center text-xs text-muted-foreground/70 flex items-center justify-center gap-1.5 flex-wrap">
            <TrendingUp className="w-3.5 h-3.5" />
            AI Coach and Mock Interview ship as add-on packs — colleges switch them on per batch, with daily usage limits built in.
          </p>
        </FadeIn>
      </div>
    </section>
  )
}
