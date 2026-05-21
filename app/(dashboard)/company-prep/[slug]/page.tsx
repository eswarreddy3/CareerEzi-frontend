"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  ArrowLeft, Building2, Users, MapPin, Calendar,
  CheckCircle, XCircle, ChevronDown, ChevronUp,
  Globe, Briefcase, Clock, Star, Lightbulb, Tag,
  Shield, BookOpen, MessageSquare, FileText, Code,
  FileQuestion,
} from "lucide-react"
import { cn } from "@/lib/utils"

const LOCAL_LOGOS: Record<string, string> = {
  tcs:       '/Company_logos/tcs_logo.png',
  wipro:     '/Company_logos/wipro_logo.png',
  accenture: '/Company_logos/accenture_logo.png',
  infosys:   '/Company_logos/infosys_logo.png',
  amazon:    '/Company_logos/amazon_logo.png',
}

const COMPANY_COLORS: Record<string, string> = {
  tcs:        'from-blue-700 to-blue-900',
  wipro:      'from-teal-500 to-emerald-600',
  accenture:  'from-purple-600 to-violet-700',
  infosys:    'from-cyan-500 to-blue-500',
  amazon:     'from-orange-400 to-orange-600',
}
const companyColor = (slug: string, fallback: string) => COMPANY_COLORS[slug] ?? fallback
import { toast } from "sonner"
import api from "@/lib/api"

// ─── Types ────────────────────────────────────────────────────────────────────

interface HiringRound {
  id: number; order: number; name: string
  description: string; duration: string; is_eliminatory: boolean
}
interface CompanyPackage {
  id: number; role_name: string; type: "Full Time" | "Internship"
  ctc_min: number | null; ctc_max: number | null
  location: string; eligibility: string
}
interface CompanyDetail {
  id: number; name: string; slug: string; description: string
  about_points: string[]; industry: string; founded_year: number
  headquarters: string; employee_count: string; website: string
  logo_color: string; logo_letter: string; logo_url: string | null
  aptitude_count: number; coding_count: number; tips_count: number
  rounds_count: number; packages_count: number
  hiring_rounds: HiringRound[]; packages: CompanyPackage[]
}
interface AptitudeQuestion {
  id: number; section: "Quantitative" | "Logical" | "Verbal" | "Technical"
  question: string; options: string[]; correct_answer: number
  explanation: string | null; difficulty: "Easy" | "Medium" | "Hard"; year: number | null
}
interface CodingQuestion {
  id: number; title: string; description: string
  difficulty: "Easy" | "Medium" | "Hard"; tags: string[]
  solution_hint: string | null; year: number | null
}
interface Tip {
  id: number; category: "HR" | "Technical" | "GD" | "Resume"
  title: string; content: string; order: number
}
type TipsGrouped = Partial<Record<"HR" | "Technical" | "GD" | "Resume", Tip[]>>

// ─── Helpers ──────────────────────────────────────────────────────────────────

const difficultyColors = {
  Easy:   "bg-success/20 text-success border-success/30",
  Medium: "bg-warning/20 text-warning border-warning/30",
  Hard:   "bg-danger/20 text-danger border-danger/30",
}
const sectionColors: Record<string, string> = {
  Quantitative: "bg-primary/20 text-primary border-primary/30",
  Logical:      "bg-coding/20 text-coding border-coding/30",
  Verbal:       "bg-success/20 text-success border-success/30",
  Technical:    "bg-warning/20 text-warning border-warning/30",
}
const tipCategoryConfig = {
  HR:        { icon: MessageSquare, color: "text-coding",   bg: "bg-coding/10 border-coding/25",   accent: "bg-coding/15"   },
  Technical: { icon: Code,          color: "text-primary",  bg: "bg-primary/10 border-primary/25",  accent: "bg-primary/15"  },
  GD:        { icon: Users,         color: "text-warning",  bg: "bg-warning/10 border-warning/25",  accent: "bg-warning/15"  },
  Resume:    { icon: FileText,      color: "text-success",  bg: "bg-success/10 border-success/25",  accent: "bg-success/15"  },
}

function formatCTC(min: number | null, max: number | null) {
  if (min === null && max === null) return "Confidential"
  if (min !== null && max !== null && min === max) return `₹${min} LPA`
  if (min !== null && max !== null) return `₹${min}–${max} LPA`
  if (min !== null) return `₹${min}+ LPA`
  return `₹${max} LPA`
}

// ─── Hero Banner (with real logo + clearbit fallback) ─────────────────────────

function buildLogoSources(logoUrl: string | null, website: string, name: string, slug: string): string[] {
  const srcs: string[] = []
  if (LOCAL_LOGOS[slug]) srcs.push(LOCAL_LOGOS[slug])
  if (logoUrl) srcs.push(logoUrl)
  const nameDomain = name.toLowerCase()
    .replace(/\s+(limited|ltd|inc|llc|corp(?:oration)?|plc|pte|pvt)\.?\s*$/i, "")
    .trim().replace(/\s+/g, "").replace(/[^a-z0-9]/g, "")
  if (nameDomain) srcs.push(`https://logo.clearbit.com/${nameDomain}.com`)
  if (website) {
    try {
      const websiteDomain = new URL(website).hostname
        .replace(/^www\./, "").split(".").slice(-2).join(".")
      const u = `https://logo.clearbit.com/${websiteDomain}`
      if (!srcs.includes(u)) srcs.push(u)
    } catch {}
  }
  return srcs
}

function HeroBanner({ company, onBack }: { company: CompanyDetail; onBack: () => void }) {
  const sources = buildLogoSources(company.logo_url, company.website, company.name, company.slug)
  const [srcIndex, setSrcIndex] = useState(0)
  const [allFailed, setAllFailed] = useState(false)

  const currentSrc = sources[srcIndex]
  const hasImg = !!currentSrc && !allFailed

  const resourceStats = [
    { icon: Shield,       label: `${company.hiring_rounds.length} Rounds`,              show: company.hiring_rounds.length > 0 },
    { icon: Star,         label: `${company.packages.length} Packages`,                 show: company.packages.length > 0 },
    { icon: FileQuestion, label: `${company.aptitude_count} Aptitude Qs`,               show: company.aptitude_count > 0 },
    { icon: Code,         label: `${company.coding_count} Coding Problems`,             show: company.coding_count > 0 },
    { icon: Lightbulb,   label: `${company.tips_count} Interview Tips`,                show: company.tips_count > 0 },
  ].filter(s => s.show)

  return (
    <div className={cn("relative rounded-3xl overflow-hidden bg-gradient-to-br", companyColor(company.slug, company.logo_color))}>
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/25 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.15),transparent_55%)]" />

      {/* Back button */}
      <button
        onClick={onBack}
        className="absolute top-4 left-4 z-20 w-9 h-9 rounded-xl bg-white/15 border border-white/25 flex items-center justify-center text-white hover:bg-white/25 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
      </button>

      <div className="relative z-10 p-8 pt-14">
        <div className="flex items-end gap-5 flex-wrap">

          {/* Company logo — white/glass outer, real logo inset inside */}
          <div className="w-20 h-20 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center shadow-2xl flex-shrink-0 overflow-hidden">
            {hasImg ? (
              <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center overflow-hidden">
                <img
                  key={currentSrc}
                  src={currentSrc}
                  alt={company.name}
                  className="w-11 h-11 object-contain"
                  onError={() => {
                    if (srcIndex + 1 < sources.length) setSrcIndex(srcIndex + 1)
                    else setAllFailed(true)
                  }}
                />
              </div>
            ) : (
              <span className="text-4xl font-black text-white">{company.logo_letter}</span>
            )}
          </div>

          {/* Meta */}
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-black font-serif text-white leading-tight drop-shadow">
              {company.name}
            </h1>
            <div className="flex items-center gap-3 mt-1.5 flex-wrap">
              <span className="text-sm text-white/80 font-medium">{company.industry}</span>
              {company.headquarters && (
                <span className="text-sm text-white/70 flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />{company.headquarters}
                </span>
              )}
              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  className="text-sm text-white/80 flex items-center gap-1 hover:text-white transition-colors"
                >
                  <Globe className="h-3.5 w-3.5" /> Website
                </a>
              )}
            </div>

            {resourceStats.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {resourceStats.map(({ icon: Icon, label }) => (
                  <span key={label} className="inline-flex items-center gap-1.5 text-xs text-white/85 bg-white/15 border border-white/20 px-2.5 py-1 rounded-full font-medium">
                    <Icon className="h-3 w-3" />{label}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────

function OverviewTab({ company }: { company: CompanyDetail }) {
  return (
    <div className="space-y-6">

      {/* About */}
      <GlassCard className="space-y-4">
        <h2 className="font-bold font-serif text-foreground flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center">
            <Building2 className="h-4 w-4 text-primary" />
          </div>
          About {company.name}
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">{company.description}</p>
        {company.about_points.length > 0 && (
          <div className="grid sm:grid-cols-2 gap-2.5">
            {company.about_points.map((pt, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-2.5 rounded-xl bg-primary/5 border border-primary/15 px-3 py-2.5"
              >
                <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm text-foreground/85 leading-snug">{pt}</span>
              </motion.div>
            ))}
          </div>
        )}
      </GlassCard>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { icon: Calendar,  label: "Founded",   value: company.founded_year?.toString() ?? "—", color: "text-primary",  bg: "bg-primary/10"  },
          { icon: Users,     label: "Employees", value: company.employee_count ?? "—",            color: "text-coding",   bg: "bg-coding/10"   },
          { icon: MapPin,    label: "HQ",        value: company.headquarters?.split(",")[0] ?? "—", color: "text-warning", bg: "bg-warning/10" },
          { icon: Briefcase, label: "Industry",  value: company.industry ?? "—",                  color: "text-success",  bg: "bg-success/10"  },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <GlassCard key={label} className="text-center py-5 space-y-2">
            <div className={cn("w-9 h-9 rounded-xl mx-auto flex items-center justify-center", bg)}>
              <Icon className={cn("h-4.5 w-4.5", color)} />
            </div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">{label}</p>
            <p className="text-sm font-bold text-foreground">{value}</p>
          </GlassCard>
        ))}
      </div>

      {/* Hiring Process */}
      {company.hiring_rounds.length > 0 && (
        <GlassCard className="space-y-5">
          <h2 className="font-bold font-serif text-foreground flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center">
              <Shield className="h-4 w-4 text-primary" />
            </div>
            Hiring Process
          </h2>
          <div className="space-y-0">
            {company.hiring_rounds.map((round, i) => (
              <motion.div
                key={round.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="flex gap-4"
              >
                {/* Step connector */}
                <div className="flex flex-col items-center">
                  <div className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0 border-2 transition-all",
                    round.is_eliminatory
                      ? "border-danger bg-danger/15 text-danger"
                      : "border-primary bg-primary/15 text-primary"
                  )}>
                    {round.order}
                  </div>
                  {i < company.hiring_rounds.length - 1 && (
                    <div className="w-0.5 flex-1 bg-gradient-to-b from-border to-transparent my-1 min-h-[20px]" />
                  )}
                </div>
                {/* Content */}
                <div className={cn("pb-5 flex-1", i === company.hiring_rounds.length - 1 && "pb-0")}>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-semibold text-foreground text-sm">{round.name}</span>
                    {round.duration && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground bg-secondary/60 px-2 py-0.5 rounded-full border border-border">
                        <Clock className="h-2.5 w-2.5" />{round.duration}
                      </span>
                    )}
                    {round.is_eliminatory && (
                      <span className="inline-flex items-center gap-1 text-[10px] bg-danger/15 text-danger px-2 py-0.5 rounded-full border border-danger/30 font-semibold">
                        <XCircle className="h-2.5 w-2.5" />Eliminatory
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{round.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* Packages */}
      {company.packages.length > 0 && (
        <GlassCard className="space-y-4">
          <h2 className="font-bold font-serif text-foreground flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-warning/15 flex items-center justify-center">
              <Star className="h-4 w-4 text-warning" />
            </div>
            Salary & Packages
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {company.packages.map((pkg, i) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="rounded-xl border border-border bg-secondary/20 p-4 space-y-2.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-foreground text-sm">{pkg.role_name}</span>
                      <span className={cn(
                        "text-[10px] font-semibold px-2 py-0.5 rounded-full border",
                        pkg.type === "Internship"
                          ? "bg-coding/15 text-coding border-coding/30"
                          : "bg-success/15 text-success border-success/30"
                      )}>
                        {pkg.type}
                      </span>
                    </div>
                    {pkg.eligibility && <p className="text-xs text-muted-foreground">{pkg.eligibility}</p>}
                    {pkg.location && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />{pkg.location}
                      </p>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xl font-black text-warning leading-none">
                      {formatCTC(pkg.ctc_min, pkg.ctc_max)}
                    </p>
                    <p className="text-[9px] text-muted-foreground mt-0.5">CTC / Stipend</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  )
}

// ─── Aptitude Tab ─────────────────────────────────────────────────────────────

function AptitudeTab({ slug }: { slug: string }) {
  const [questions, setQuestions] = useState<AptitudeQuestion[]>([])
  const [loading, setLoading]     = useState(true)
  const [section, setSection]     = useState("All")
  const [expanded, setExpanded]   = useState<number | null>(null)

  useEffect(() => {
    api.get(`/company-prep/companies/${slug}/aptitude`)
      .then(res => setQuestions(res.data))
      .catch(() => toast.error("Failed to load aptitude questions"))
      .finally(() => setLoading(false))
  }, [slug])

  const sections  = ["All", ...Array.from(new Set(questions.map(q => q.section)))]
  const filtered  = section === "All" ? questions : questions.filter(q => q.section === section)

  if (loading) return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
    </div>
  )

  return (
    <div className="space-y-5">
      {/* Section filter */}
      <div className="flex flex-wrap gap-2">
        {sections.map(s => {
          const count = s === "All" ? questions.length : questions.filter(q => q.section === s).length
          return (
            <button
              key={s}
              onClick={() => { setSection(s); setExpanded(null) }}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm font-medium border transition-all",
                section === s
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-secondary/30 text-muted-foreground border-border hover:border-primary/40"
              )}
            >
              {s} <span className="opacity-60 text-xs">({count})</span>
            </button>
          )
        })}
      </div>

      {/* Questions */}
      <div className="space-y-3">
        {filtered.map((q, i) => {
          const isOpen = expanded === q.id
          return (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.03, 0.2) }}
            >
              <GlassCard
                className="cursor-pointer transition-colors hover:border-primary/25"
                onClick={() => setExpanded(isOpen ? null : q.id)}
              >
                <div className="flex items-start gap-3 justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap gap-1.5 items-center">
                      <Badge className={cn("text-[10px] border", sectionColors[q.section])}>{q.section}</Badge>
                      <Badge className={cn("text-[10px] border", difficultyColors[q.difficulty])}>{q.difficulty}</Badge>
                      {q.year && <span className="text-[10px] text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded-full border border-border">{q.year}</span>}
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">{q.question}</p>
                  </div>
                  <div className="flex-shrink-0 mt-0.5 text-muted-foreground">
                    {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                </div>

                {isOpen && (
                  <div className="mt-4 space-y-4 border-t border-border/50 pt-4">
                    <div className="space-y-2">
                      {q.options.map((opt, idx) => (
                        <div
                          key={idx}
                          className={cn(
                            "flex items-center gap-3 px-4 py-2.5 rounded-xl border text-sm transition-colors",
                            idx === q.correct_answer
                              ? "border-success/50 bg-success/10 text-success"
                              : "border-border bg-secondary/20 text-muted-foreground"
                          )}
                        >
                          <span className={cn(
                            "w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-black flex-shrink-0",
                            idx === q.correct_answer
                              ? "border-success bg-success text-white"
                              : "border-border text-muted-foreground"
                          )}>
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className="flex-1">{opt}</span>
                          {idx === q.correct_answer && <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />}
                        </div>
                      ))}
                    </div>
                    {q.explanation && (
                      <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                        <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1.5">Explanation</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">{q.explanation}</p>
                      </div>
                    )}
                  </div>
                )}
              </GlassCard>
            </motion.div>
          )
        })}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">No questions in this section yet.</div>
        )}
      </div>
    </div>
  )
}

// ─── Coding Tab ───────────────────────────────────────────────────────────────

function CodingTab({ slug }: { slug: string }) {
  const [questions, setQuestions] = useState<CodingQuestion[]>([])
  const [loading, setLoading]     = useState(true)
  const [difficulty, setDifficulty] = useState("All")
  const [expanded, setExpanded]   = useState<number | null>(null)
  const [showHint, setShowHint]   = useState<number | null>(null)

  useEffect(() => {
    api.get(`/company-prep/companies/${slug}/coding`)
      .then(res => setQuestions(res.data))
      .catch(() => toast.error("Failed to load coding questions"))
      .finally(() => setLoading(false))
  }, [slug])

  const difficulties = ["All", "Easy", "Medium", "Hard"]
  const filtered = difficulty === "All" ? questions : questions.filter(q => q.difficulty === difficulty)

  if (loading) return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
    </div>
  )

  return (
    <div className="space-y-5">
      {/* Difficulty filter */}
      <div className="flex flex-wrap gap-2">
        {difficulties.map(d => {
          const count = d === "All" ? questions.length : questions.filter(q => q.difficulty === d).length
          return (
            <button
              key={d}
              onClick={() => { setDifficulty(d); setExpanded(null); setShowHint(null) }}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm font-medium border transition-all",
                difficulty === d
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-secondary/30 text-muted-foreground border-border hover:border-primary/40"
              )}
            >
              {d} <span className="opacity-60 text-xs">({count})</span>
            </button>
          )
        })}
      </div>

      <div className="space-y-3">
        {filtered.map((q, i) => {
          const isOpen = expanded === q.id
          return (
            <motion.div key={q.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.03, 0.2) }}>
              <GlassCard className="cursor-pointer transition-colors hover:border-coding/25" onClick={() => { setExpanded(isOpen ? null : q.id); setShowHint(null) }}>
                <div className="flex items-start gap-3 justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap gap-1.5 items-center">
                      <Badge className={cn("text-[10px] border", difficultyColors[q.difficulty])}>{q.difficulty}</Badge>
                      {q.year && <span className="text-[10px] text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded-full border border-border">{q.year}</span>}
                      {q.tags.map(t => (
                        <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary/60 text-muted-foreground border border-border flex items-center gap-1">
                          <Tag className="h-2.5 w-2.5" />{t}
                        </span>
                      ))}
                    </div>
                    <p className="font-semibold text-foreground text-sm">{q.title}</p>
                  </div>
                  <div className="flex-shrink-0 mt-0.5 text-muted-foreground">
                    {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                </div>

                {isOpen && (
                  <div className="mt-4 border-t border-border/50 pt-4 space-y-4">
                    <pre className="text-sm text-foreground/85 whitespace-pre-wrap font-mono bg-[#0d1117] dark:bg-secondary/30 rounded-xl p-4 border border-border leading-relaxed text-[13px] overflow-x-auto">
                      {q.description}
                    </pre>
                    {q.solution_hint && (
                      showHint !== q.id ? (
                        <Button
                          size="sm" variant="outline"
                          className="gap-2"
                          onClick={e => { e.stopPropagation(); setShowHint(q.id) }}
                        >
                          <Lightbulb className="h-4 w-4 text-warning" /> Show Approach Hint
                        </Button>
                      ) : (
                        <div className="p-4 rounded-xl bg-warning/5 border border-warning/25">
                          <p className="text-[10px] font-bold text-warning uppercase tracking-widest mb-1.5 flex items-center gap-1">
                            <Lightbulb className="h-3.5 w-3.5" /> Approach Hint
                          </p>
                          <p className="text-sm text-muted-foreground leading-relaxed">{q.solution_hint}</p>
                        </div>
                      )
                    )}
                  </div>
                )}
              </GlassCard>
            </motion.div>
          )
        })}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">No coding questions for this difficulty yet.</div>
        )}
      </div>
    </div>
  )
}

// ─── Tips Tab ─────────────────────────────────────────────────────────────────

function TipsTab({ slug }: { slug: string }) {
  const [tips, setTips]     = useState<TipsGrouped>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/company-prep/companies/${slug}/tips`)
      .then(res => setTips(res.data))
      .catch(() => toast.error("Failed to load tips"))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return (
    <div className="space-y-3">
      {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}
    </div>
  )

  const categories = (["HR", "Technical", "GD", "Resume"] as const).filter(c => tips[c]?.length)

  if (categories.length === 0) return (
    <div className="text-center py-12 text-muted-foreground text-sm">No tips available yet.</div>
  )

  return (
    <div className="space-y-8">
      {categories.map(cat => {
        const cfg    = tipCategoryConfig[cat]
        const Icon   = cfg.icon
        const catTips = tips[cat] ?? []
        return (
          <div key={cat} className="space-y-3">
            {/* Category header */}
            <div className={cn("flex items-center gap-3 rounded-xl px-4 py-3 border", cfg.bg)}>
              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0", cfg.accent)}>
                <Icon className={cn("h-4 w-4", cfg.color)} />
              </div>
              <div>
                <p className={cn("text-sm font-bold", cfg.color)}>{cat} Tips</p>
                <p className="text-[10px] text-muted-foreground">{catTips.length} tip{catTips.length !== 1 ? "s" : ""}</p>
              </div>
            </div>

            {/* Tip cards */}
            <div className="grid sm:grid-cols-2 gap-3">
              {catTips.map((tip, i) => (
                <motion.div
                  key={tip.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={cn("rounded-xl border p-4 space-y-2", cfg.bg)}
                >
                  <div className="flex items-start gap-2">
                    <div className={cn("w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5", cfg.accent)}>
                      <span className={cn("text-[9px] font-black", cfg.color)}>{i + 1}</span>
                    </div>
                    <p className="font-semibold text-foreground text-sm leading-snug">{tip.title}</p>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed pl-7">{tip.content}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const TABS = [
  { value: "overview", label: "Overview",        icon: BookOpen      },
  { value: "aptitude", label: "Aptitude",         icon: FileQuestion  },
  { value: "coding",   label: "Coding",           icon: Code          },
  { value: "tips",     label: "Interview Tips",   icon: MessageSquare },
]

export default function CompanyDetailPage() {
  const { slug }   = useParams<{ slug: string }>()
  const router     = useRouter()
  const [company, setCompany] = useState<CompanyDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    api.get(`/company-prep/companies/${slug}`)
      .then(res => setCompany(res.data))
      .catch(() => { toast.error("Company not found"); router.push("/company-prep") })
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return (
    <div className="space-y-6">
      <Skeleton className="h-52 w-full rounded-3xl" />
      <div className="grid grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 rounded-xl" />)}
      </div>
      <Skeleton className="h-64 rounded-xl" />
    </div>
  )

  if (!company) return null

  return (
    <div className="space-y-6">

      {/* ── Hero Banner ─────────────────────────────────────────────────── */}
      <HeroBanner company={company} onBack={() => router.back()} />

      {/* ── Tab bar ─────────────────────────────────────────────────────── */}
      <div className="flex gap-1 p-1 rounded-2xl bg-secondary/40 border border-border w-fit">
        {[
          { value: "overview", label: "Overview",       icon: BookOpen,      count: null                     },
          { value: "aptitude", label: "Aptitude",        icon: FileQuestion,  count: company.aptitude_count   },
          { value: "coding",   label: "Coding",          icon: Code,          count: company.coding_count     },
          { value: "tips",     label: "Interview Tips",  icon: MessageSquare, count: company.tips_count       },
        ].map(({ value, label, icon: Icon, count }) => (
          <button
            key={value}
            onClick={() => setActiveTab(value)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
              activeTab === value
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
            )}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{label}</span>
            {count != null && count > 0 && (
              <span className={cn(
                "hidden sm:inline text-[10px] px-1.5 py-0.5 rounded-full font-bold tabular-nums",
                activeTab === value
                  ? "bg-white/25 text-white"
                  : "bg-secondary text-muted-foreground"
              )}>
                {count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Tab Content ─────────────────────────────────────────────────── */}
      <div>
        {activeTab === "overview" && <OverviewTab company={company} />}
        {activeTab === "aptitude" && <AptitudeTab slug={slug} />}
        {activeTab === "coding"   && <CodingTab   slug={slug} />}
        {activeTab === "tips"     && <TipsTab      slug={slug} />}
      </div>
    </div>
  )
}
