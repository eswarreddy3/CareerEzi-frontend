"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion"
import {
  Sparkles, ChevronRight, Mail, GraduationCap, Code2, Mic, Briefcase,
  BarChart3, Users, CalendarCheck, ShieldCheck, Award, Route, Eye, Layers,
  Building2, Brain, Trophy, FileText, RotateCw, MapPin, KeyRound, Bell,
} from "lucide-react"
import { TopNav } from "@/components/top-nav"
import { SiteFooter } from "@/components/landing/site-footer"
import { FadeIn, TiltCard, Orb } from "@/components/landing/primitives"
import { LEGAL } from "@/lib/legal"
import { cn } from "@/lib/utils"

// Every feature named on this page must be a shipped route — keep it in step
// with components/landing/capability-grid.tsx.

// ─── Data ───────────────────────────────────────────────────────────────────────
const JOURNEY = [
  { icon: GraduationCap, label: "Learn",     desc: "Roadmap-driven courses",      tone: "text-primary",  bg: "bg-primary/10" },
  { icon: Code2,         label: "Practise",  desc: "MCQs, aptitude & coding",     tone: "text-coding",   bg: "bg-coding/10" },
  { icon: Mic,           label: "Interview", desc: "AI mock interviews",          tone: "text-streak",   bg: "bg-streak/10" },
  { icon: Briefcase,     label: "Get placed", desc: "Drives, jobs & offers",      tone: "text-success",  bg: "bg-success/10" },
]

const PROBLEMS = [
  {
    icon: Route, problem: "No structured roadmap",
    pain: "Students jump between videos, paid courses and coding sites with no plan built around placements.",
    answer: "Domain programs turn each career track into an ordered roadmap of courses, levels and lessons.",
  },
  {
    icon: Eye, problem: "Zero visibility",
    pain: "Colleges find out who is unprepared only when the campus drive arrives — too late to help.",
    answer: "Live analytics show placement cells every student's progress, scores and activity as it happens.",
  },
  {
    icon: Layers, problem: "Fragmented tools",
    pain: "Separate apps for coding, MCQs, resumes and jobs mean no habit ever sticks.",
    answer: "One platform for learning, practice, AI interviews, resumes, jobs and drives — one daily habit.",
  },
]

const AUDIENCES = {
  students: {
    label: "For Students",
    icon: GraduationCap,
    blurb: "Everything between your first lesson and your first offer letter.",
    items: [
      { icon: Route,    title: "Guided roadmaps",       desc: "Course libraries and domain programs for each career track." },
      { icon: Brain,    title: "Practice that sticks",  desc: "MCQ and aptitude banks, timed assignments and instant explanations." },
      { icon: Code2,    title: "Real coding",           desc: "Problems with real test cases, plus a free multi-language Code Lab." },
      { icon: Mic,      title: "Saarthi AI coach",      desc: "Voice or text mock interviews with a feedback report, and study plans." },
      { icon: FileText, title: "Get hired",             desc: "Company guides, a resume builder, a jobs board and drive registration." },
      { icon: Award,    title: "Proof that travels",    desc: "Verifiable certificates and an optional public portfolio." },
    ],
  },
  colleges: {
    label: "For Colleges",
    icon: Building2,
    blurb: "See placement readiness before the drive — not after it.",
    items: [
      { icon: BarChart3,     title: "Live analytics",        desc: "Lesson completion, test scores and coding activity by batch." },
      { icon: Users,         title: "Student management",    desc: "Full roster with search, filters and per-student drill-down." },
      { icon: KeyRound,      title: "Branch admin roles",    desc: "Delegate a department without handing over the whole college." },
      { icon: CalendarCheck, title: "Placement drives",      desc: "Announce drives, set eligibility rules and collect registrations." },
      { icon: Bell,          title: "1-click reminders",     desc: "Nudge inactive students by email straight from the dashboard." },
      { icon: Layers,        title: "Content control",       desc: "Choose which courses and programs your students can access." },
    ],
  },
} as const
type AudienceKey = keyof typeof AUDIENCES

const STEPS = [
  { icon: Building2,     title: "Your college joins",       desc: `The college subscribes and its admins add students — ${LEGAL.product} is free for those students.` },
  { icon: Sparkles,      title: "Students activate",        desc: "A short onboarding sets up the profile, and the roadmap is ready on day one." },
  { icon: Trophy,        title: "Daily practice",           desc: "Lessons, tests, coding and streaks build a habit, while points keep it fun." },
  { icon: BarChart3,     title: "Placement team tracks",    desc: "Admins spot who is falling behind early and step in with reminders." },
  { icon: Briefcase,     title: "Drives and offers",        desc: "Eligible students register for drives in one tap and walk in prepared." },
]

const PRINCIPLES = [
  { icon: Building2,   title: "Built for Indian campuses", desc: "Designed around how placement cells, branches and campus drives actually work.", tone: "text-primary",  bg: "bg-primary/10" },
  { icon: ShieldCheck, title: "Privacy first",             desc: "Student data is used to help students — never sold, never used for ads.",         tone: "text-success",  bg: "bg-success/10" },
  { icon: Brain,       title: "Honest AI",                 desc: "Saarthi is a practice partner that gives feedback. It never makes hiring decisions.", tone: "text-coding",   bg: "bg-coding/10" },
  { icon: Award,       title: "Proof, not promises",       desc: "Every certificate can be verified by anyone, with no login needed.",              tone: "text-warning",  bg: "bg-warning/10" },
]

// ─── Hero visual: auto-cycling journey ─────────────────────────────────────────
function JourneyCard() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    const t = setInterval(() => setActive((i) => (i + 1) % JOURNEY.length), 2200)
    return () => clearInterval(t)
  }, [paused])

  const step = JOURNEY[active]

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="w-full max-w-md mx-auto"
    >
      <TiltCard>
        <div className="glass-card rounded-3xl border border-border p-5 sm:p-7 shadow-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-5">
            The {LEGAL.product} journey
          </p>

          {/* Stepper */}
          <div className="relative flex items-center justify-between mb-7">
            <div className="absolute left-5 right-5 top-1/2 -translate-y-1/2 h-0.5 bg-border" />
            <motion.div
              className="absolute left-5 top-1/2 -translate-y-1/2 h-0.5 bg-primary origin-left"
              animate={{ width: `calc((100% - 2.5rem) * ${active / (JOURNEY.length - 1)})` }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
            />
            {JOURNEY.map((j, i) => (
              <button
                key={j.label}
                onClick={() => setActive(i)}
                aria-label={j.label}
                aria-pressed={i === active}
                className={cn(
                  "relative z-10 w-10 h-10 rounded-full border flex items-center justify-center transition-all",
                  i <= active ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border hover:border-primary/40",
                )}
              >
                <j.icon className="w-4 h-4" />
                {i === active && (
                  <motion.span layoutId="journey-ring" className="absolute -inset-1.5 rounded-full border-2 border-primary/40" />
                )}
              </button>
            ))}
          </div>

          {/* Active step detail */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step.label}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-4 rounded-2xl border border-border bg-secondary/40 p-4"
            >
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0", step.bg)}>
                <step.icon className={cn("w-6 h-6", step.tone)} />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Step {active + 1} of {JOURNEY.length}</p>
                <p className="font-bold font-serif text-lg leading-tight">{step.label}</p>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          <p className="mt-5 text-xs text-muted-foreground text-center">
            {paused ? "Paused — click a step to explore" : "Hover to pause · click any step"}
          </p>
        </div>
      </TiltCard>
    </motion.div>
  )
}

// ─── Problem → answer flip card ────────────────────────────────────────────────
function FlipCard({ item, delay }: { item: (typeof PROBLEMS)[number]; delay: number }) {
  const [flipped, setFlipped] = useState(false)
  return (
    <FadeIn delay={delay} className="h-full">
      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        onMouseEnter={() => setFlipped(true)}
        onMouseLeave={() => setFlipped(false)}
        aria-pressed={flipped}
        className="group relative w-full h-64 text-left [perspective:1200px]"
      >
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 160, damping: 20 }}
          className="relative w-full h-full [transform-style:preserve-3d]"
        >
          {/* Front — the problem */}
          <div className="absolute inset-0 glass-card rounded-2xl border border-danger/25 p-6 flex flex-col [backface-visibility:hidden]">
            <div className="w-11 h-11 rounded-xl bg-danger/10 border border-danger/20 flex items-center justify-center mb-4">
              <item.icon className="w-5 h-5 text-danger" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-widest text-danger mb-1">The problem</p>
            <h3 className="text-lg font-bold font-serif mb-2">{item.problem}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{item.pain}</p>
            <span className="mt-auto inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <RotateCw className="w-3.5 h-3.5" /> Tap or hover to see our answer
            </span>
          </div>
          {/* Back — the answer */}
          <div className="absolute inset-0 glass-card rounded-2xl border border-success/30 p-6 flex flex-col [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <div className="w-11 h-11 rounded-xl bg-success/10 border border-success/20 flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5 text-success" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-widest text-success mb-1">Our answer</p>
            <h3 className="text-lg font-bold font-serif mb-2">{item.problem}, solved</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{item.answer}</p>
          </div>
        </motion.div>
      </button>
    </FadeIn>
  )
}

// ─── Scroll-linked timeline ────────────────────────────────────────────────────
function Timeline() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] })
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 25 })

  return (
    <div ref={ref} className="relative max-w-3xl mx-auto">
      <div className="absolute left-5 sm:left-1/2 sm:-translate-x-1/2 top-0 bottom-0 w-0.5 bg-border" />
      <motion.div
        style={{ scaleY: fill }}
        className="absolute left-5 sm:left-1/2 sm:-translate-x-1/2 top-0 bottom-0 w-0.5 bg-primary origin-top"
      />
      <div className="space-y-10">
        {STEPS.map((s, i) => {
          const right = i % 2 === 1
          return (
            <FadeIn key={s.title} delay={0.05 * i}>
              <div className={cn("relative flex items-start gap-5 sm:gap-0", right ? "sm:flex-row-reverse" : "")}>
                <div className="relative z-10 w-10 h-10 rounded-full bg-background border-2 border-primary flex items-center justify-center flex-shrink-0 sm:absolute sm:left-1/2 sm:-translate-x-1/2">
                  <s.icon className="w-4 h-4 text-primary" />
                </div>
                <div className={cn("flex-1 sm:w-1/2 sm:flex-none", right ? "sm:pl-12" : "sm:pr-12 sm:text-right")}>
                  <motion.div
                    whileHover={{ y: -3 }}
                    className="glass-card rounded-2xl border border-border hover:border-primary/40 transition-colors p-5"
                  >
                    <p className="text-xs font-semibold text-primary mb-1">Step {i + 1}</p>
                    <h3 className="font-bold font-serif text-lg mb-1">{s.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                  </motion.div>
                </div>
              </div>
            </FadeIn>
          )
        })}
      </div>
    </div>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export function AboutContent() {
  const [audience, setAudience] = useState<AudienceKey>("students")
  const a = AUDIENCES[audience]

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <TopNav />

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-28 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-6">
        <Orb className="w-[460px] h-[460px] bg-violet-500/12 -top-32 -left-24" />
        <Orb className="w-[380px] h-[380px] bg-cyan-500/10 top-1/3 right-0" />
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)", backgroundSize: "28px 28px" }}
        />

        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs sm:text-sm mb-5 font-semibold tracking-wide uppercase"
            >
              <Sparkles className="w-3.5 h-3.5" /> About {LEGAL.product}
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold font-serif leading-[1.06] tracking-tight mb-5"
            >
              We turn campus prep into{" "}<span className="gradient-text">career offers.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.7 }}
              className="text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed mb-8"
            >
              {LEGAL.product} is India&apos;s campus placement-preparation platform. Colleges get one place to train
              students — courses, practice, coding, AI mock interviews, company prep and placement drives — and
              placement teams see every student&apos;s readiness live.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link href="/login" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl gradient-bg text-white font-bold text-sm sm:text-base primary-glow hover:brightness-110 transition-all">
                  Get Started <ChevronRight className="w-4 h-4" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link href="/#contact" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border border-border hover:border-primary/40 hover:bg-secondary/40 text-sm sm:text-base font-semibold transition-all">
                  Talk to us <Mail className="w-4 h-4" />
                </Link>
              </motion.div>
            </motion.div>
          </div>

          <JourneyCard />
        </div>
      </section>

      {/* ── Why we exist ─────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 relative">
        <div className="max-w-6xl mx-auto">
          <FadeIn className="text-center mb-10 sm:mb-14">
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-primary mb-3">Why we exist</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif mb-3">
              Placement prep is <span className="gradient-text">broken.</span> We&apos;re fixing it.
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              Three problems we saw on every campus — and how {LEGAL.product} answers each one.
            </p>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PROBLEMS.map((p, i) => <FlipCard key={p.problem} item={p} delay={0.1 * i} />)}
          </div>
        </div>
      </section>

      {/* ── Who it's for (interactive switcher) ──────────────────────────────── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 relative overflow-hidden">
        <Orb className="w-[360px] h-[360px] bg-primary/10 -right-24 top-10" />
        <div className="max-w-6xl mx-auto relative z-10">
          <FadeIn className="text-center mb-8">
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-primary mb-3">Who it&apos;s for</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif mb-6">
              One platform, <span className="gradient-text">two sides</span> of placement.
            </h2>
            <div role="tablist" aria-label="Audience" className="inline-flex p-1 rounded-2xl border border-border bg-secondary/40">
              {(Object.keys(AUDIENCES) as AudienceKey[]).map((key) => {
                const A = AUDIENCES[key]
                const on = key === audience
                return (
                  <button
                    key={key}
                    role="tab"
                    aria-selected={on}
                    onClick={() => setAudience(key)}
                    className={cn("relative px-4 sm:px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors", on ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground")}
                  >
                    {on && <motion.span layoutId="audience-pill" className="absolute inset-0 rounded-xl gradient-bg" transition={{ type: "spring", stiffness: 380, damping: 30 }} />}
                    <span className="relative inline-flex items-center gap-2"><A.icon className="w-4 h-4" />{A.label}</span>
                  </button>
                )
              })}
            </div>
          </FadeIn>

          <AnimatePresence mode="wait">
            <motion.div
              key={audience}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-center text-muted-foreground mb-8">{a.blurb}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {a.items.map((it, i) => (
                  <motion.div
                    key={it.title}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.05 * i }}
                  >
                    <TiltCard>
                      <div className="glass-card rounded-2xl border border-border hover:border-primary/40 transition-colors p-5 h-full">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-3">
                          <it.icon className="w-5 h-5 text-primary" />
                        </div>
                        <h3 className="font-bold mb-1">{it.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{it.desc}</p>
                      </div>
                    </TiltCard>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6">
        <FadeIn className="text-center mb-12">
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-primary mb-3">How it works</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif">
            From <span className="gradient-text">sign-up</span> to <span className="gradient-text">offer letter</span>
          </h2>
        </FadeIn>
        <Timeline />
      </section>

      {/* ── Principles ───────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <FadeIn className="text-center mb-10 sm:mb-14">
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-primary mb-3">What we stand for</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif">Our principles</h2>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PRINCIPLES.map((p, i) => (
              <FadeIn key={p.title} delay={0.08 * i} className="h-full">
                <TiltCard>
                  <div className="glass-card rounded-2xl border border-border p-6 h-full">
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4", p.bg)}>
                      <p.icon className={cn("w-6 h-6", p.tone)} />
                    </div>
                    <h3 className="font-bold font-serif text-lg mb-2">{p.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                  </div>
                </TiltCard>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Who we are + CTA ─────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 relative overflow-hidden">
        <Orb className="w-[420px] h-[420px] bg-violet-500/10 left-1/2 -translate-x-1/2 -top-20" />
        <FadeIn className="relative z-10 max-w-4xl mx-auto">
          <div className="glass-card rounded-3xl border border-primary/25 p-7 sm:p-12 text-center">
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-primary mb-3">Who we are</p>
            <h2 className="text-2xl sm:text-4xl font-bold font-serif mb-4">
              Built in India, <span className="gradient-text">for India&apos;s campuses.</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-2">
              {LEGAL.product} is built and operated by{" "}
              <a href="https://www.fynityinnovations.com/" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline">
                {LEGAL.entity}
              </a>
              . We work with colleges so that every student walks into a placement drive prepared.
            </p>
            <p className="inline-flex items-center gap-1.5 text-sm text-muted-foreground mb-8">
              <MapPin className="w-4 h-4" /> {LEGAL.address}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link href="/#contact" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl gradient-bg text-white font-bold primary-glow hover:brightness-110 transition-all">
                  Bring {LEGAL.product} to your campus <ChevronRight className="w-4 h-4" />
                </Link>
              </motion.div>
              <a href={`mailto:${LEGAL.supportEmail}`} className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-border hover:border-primary/40 hover:bg-secondary/40 font-semibold transition-all">
                <Mail className="w-4 h-4" /> {LEGAL.supportEmail}
              </a>
            </div>
            <p className="mt-8 text-xs text-muted-foreground">
              How we handle student data: <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
              {" · "}<Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>
            </p>
          </div>
        </FadeIn>
      </section>

      <SiteFooter />
    </div>
  )
}
