"use client"

/**
 * The full shipped inventory, grouped by who uses it.
 *
 * The bento grid above sells the nine headline features with mockups; this
 * section is the completeness proof — every surface that actually exists in the
 * app, so an evaluating college can tick boxes instead of guessing. Every entry
 * here maps to a real route.
 */

import { motion } from "framer-motion"
import {
  GraduationCap, Building2, ShieldCheck,
  FileText, Terminal, Briefcase, Trophy, Award, UserSquare2,
  ClipboardCheck, CalendarCheck, BarChart3, Users, Bell, MessageSquare,
  Layers, Upload, Code2, Globe2, FileSpreadsheet, KeyRound,
  BookOpen, Brain, ScrollText, Building, LineChart, QrCode,
} from "lucide-react"
import { FadeIn } from "./primitives"

type Item = { icon: React.ElementType; label: string; desc: string }

const groups: {
  key: string
  icon: React.ElementType
  title: string
  subtitle: string
  accent: string   // text colour
  bg: string       // icon chip bg
  border: string   // card + chip border
  glow: string     // gradient background
  items: Item[]
}[] = [
  {
    key: "learn",
    icon: GraduationCap,
    title: "Learn & Practice",
    subtitle: "The daily loop students actually live in",
    accent: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/25",
    glow: "linear-gradient(160deg,rgba(99,102,241,0.08) 0%,transparent 70%)",
    items: [
      { icon: BookOpen,       label: "Course library & lessons", desc: "Levels, lessons, and rich content with points per completion." },
      { icon: Brain,          label: "MCQ & aptitude practice",  desc: "Per-lesson question banks with instant explanations." },
      { icon: ClipboardCheck, label: "Timed assignments",        desc: "Level-based exams, auto-scored, with full question review." },
      { icon: Code2,          label: "Coding problems",          desc: "Real test cases in an in-browser Monaco editor." },
      { icon: Terminal,       label: "Code Lab playground",      desc: "Free-form multi-language scratchpad with live output." },
      { icon: Globe2,         label: "Domain programs",          desc: "Curated multi-course roadmaps per career track." },
      { icon: Trophy,         label: "Leaderboard & streaks",    desc: "Podium rankings, daily streaks, XP, coins, gems, shields." },
    ],
  },
  {
    key: "hired",
    icon: Briefcase,
    title: "Get Hired",
    subtitle: "The half that turns practice into an offer",
    accent: "text-cyan-600 dark:text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/25",
    glow: "linear-gradient(160deg,rgba(6,182,212,0.08) 0%,transparent 70%)",
    items: [
      { icon: Building,      label: "Company prep guides",  desc: "Round-by-round breakdowns for the companies that visit." },
      { icon: ScrollText,    label: "Resume builder",       desc: "Guided sections with one-click PDF export." },
      { icon: FileText,      label: "Performance report",   desc: "Personal stats — lessons, accuracy, problems solved — as PDF." },
      { icon: Briefcase,     label: "Jobs board",           desc: "Live openings posted platform-wide, open to every college." },
      { icon: CalendarCheck, label: "Drive registration",   desc: "See eligibility for a campus drive and register in one tap." },
      { icon: MessageSquare, label: "College feed",         desc: "Campus-scoped posts, blogs, and placement announcements." },
    ],
  },
  {
    key: "colleges",
    icon: Building2,
    title: "For Colleges",
    subtitle: "Visibility before the campus drive, not after",
    accent: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/25",
    glow: "linear-gradient(160deg,rgba(52,211,153,0.08) 0%,transparent 70%)",
    items: [
      { icon: BarChart3,     label: "Live analytics dashboard", desc: "Lesson completion, MCQ scores, and coding activity as it happens." },
      { icon: Users,         label: "Student management",       desc: "Full roster with search, filters, and per-student drill-down." },
      { icon: KeyRound,      label: "Branch admin roles",       desc: "Delegate a branch or department without handing over the college." },
      { icon: CalendarCheck, label: "Placement drive console",  desc: "Announce drives, set eligibility rules, and collect registrations." },
      { icon: Bell,          label: "1-click reminders",        desc: "Nudge inactive students by email straight from the dashboard." },
      { icon: LineChart,     label: "Batch progress tracking",  desc: "Compare cohorts and spot the students falling behind early." },
      { icon: MessageSquare, label: "Moderated college feed",   desc: "Admins post to the same campus feed students already read." },
    ],
  },
  {
    key: "platform",
    icon: ShieldCheck,
    title: "Platform & Credentials",
    subtitle: "Content control, and proof that survives the campus",
    accent: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/25",
    glow: "linear-gradient(160deg,rgba(245,158,11,0.08) 0%,transparent 70%)",
    items: [
      { icon: Award,       label: "Verified certificates",   desc: "Course and domain certificates issued as downloadable PDFs." },
      { icon: QrCode,      label: "Public verification",     desc: "Every certificate carries a UID any recruiter can check — no login." },
      { icon: UserSquare2, label: "Public portfolio",         desc: "A shareable profile page with certificates linked for verification." },
      { icon: Layers,      label: "Course authoring",         desc: "Build courses, levels, and lessons from the admin UI — no deploys." },
      { icon: Upload,      label: "Bulk content import",      desc: "CSV for aptitude and assignments, JSON for coding problems." },
      { icon: FileSpreadsheet, label: "Domain mapping",       desc: "Map courses into domain roadmaps with drag-free reordering." },
      { icon: Briefcase,   label: "Job & feedback console",   desc: "Post openings platform-wide and read student feedback in one place." },
    ],
  },
]

export function CapabilityGrid() {
  const total = groups.reduce((n, g) => n + g.items.length, 0)

  return (
    <section id="capabilities" className="scroll-mt-20 py-16 sm:py-24 px-4 sm:px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">

        {/* Header */}
        <FadeIn className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-secondary/40 text-muted-foreground text-xs sm:text-sm mb-5 font-semibold uppercase tracking-wide">
            <ShieldCheck className="w-3.5 h-3.5" /> Shipped, not roadmap
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif mb-4 leading-tight">
            {total} capabilities.
            <br />
            <span className="gradient-text">All of them live today.</span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
            The complete list, grouped by who uses it — so you can tick boxes instead of sitting through a demo.
          </p>
        </FadeIn>

        {/* Audience panels — 2×2 on desktop so no column runs away in height */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 items-start">
          {groups.map((g, gi) => (
            <FadeIn key={g.key} delay={gi * 0.1}>
              <div className={`relative rounded-3xl border ${g.border} overflow-hidden h-full`}
                style={{ background: g.glow }}>
                <div className="relative z-10 p-5 sm:p-6">

                  {/* Panel header */}
                  <div className="flex items-center gap-3 pb-4 mb-4 border-b border-border">
                    <div className={`w-11 h-11 rounded-2xl ${g.bg} border ${g.border} flex items-center justify-center flex-shrink-0`}>
                      <g.icon className={`w-5 h-5 ${g.accent}`} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-base leading-tight">{g.title}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{g.subtitle}</p>
                    </div>
                    <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full ${g.bg} border ${g.border} ${g.accent} flex-shrink-0`}>
                      {g.items.length}
                    </span>
                  </div>

                  {/* Items */}
                  <ul className="space-y-1">
                    {g.items.map((it, i) => (
                      <motion.li
                        key={it.label}
                        initial={{ opacity: 0, x: -8 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-40px" }}
                        transition={{ duration: 0.4, delay: Math.min(i * 0.04, 0.4) }}
                        className="group flex items-start gap-3 rounded-2xl p-2.5 transition-colors hover:bg-secondary/40"
                      >
                        <div className={`w-7 h-7 rounded-xl ${g.bg} border ${g.border} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                          <it.icon className={`w-3.5 h-3.5 ${g.accent}`} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[13px] font-semibold leading-snug">{it.label}</p>
                          <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">{it.desc}</p>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
