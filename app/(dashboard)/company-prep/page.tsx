"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { GlassCard } from "@/components/glass-card"
import { FeedbackModal } from "@/components/feedback-modal"
import {
  Building2, FileQuestion, Code, Search,
  ChevronRight, Shield, Lightbulb, Briefcase,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import api from "@/lib/api"
import { SurfaceTexture } from "@/components/admin-stat-card"

const LOCAL_LOGOS: Record<string, string> = {
  tcs:       '/Company_logos/tcs_logo.png',
  wipro:     '/Company_logos/wipro_logo.png',
  accenture: '/Company_logos/accenture_logo.png',
  infosys: '/Company_logos/infosys_logo.png',
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

interface Company {
  id: number
  name: string
  slug: string
  description: string
  industry: string
  logo_color: string
  logo_letter: string
  logo_url: string | null
  website: string | null
  aptitude_count: number
  coding_count: number
  tips_count: number
  rounds_count: number
  packages_count: number
}

// ── Smart logo: local file → DB logo_url → name-based Clearbit → website Clearbit → letter ─

function buildLogoSources(company: Company): string[] {
  const srcs: string[] = []
  if (LOCAL_LOGOS[company.slug]) srcs.push(LOCAL_LOGOS[company.slug])
  if (company.logo_url) srcs.push(company.logo_url)
  // Derive domain from company name (most reliable for well-known brands)
  const nameDomain = company.name.toLowerCase()
    .replace(/\s+(limited|ltd|inc|llc|corp(?:oration)?|plc|pte|pvt)\.?\s*$/i, "")
    .trim().replace(/\s+/g, "").replace(/[^a-z0-9]/g, "")
  if (nameDomain) srcs.push(`https://logo.clearbit.com/${nameDomain}.com`)
  // Also try the website domain (may differ from name, e.g. amazon.jobs → amazon.com)
  if (company.website) {
    try {
      const websiteDomain = new URL(company.website).hostname
        .replace(/^www\./, "").split(".").slice(-2).join(".")
      const websiteUrl = `https://logo.clearbit.com/${websiteDomain}`
      if (!srcs.includes(websiteUrl)) srcs.push(websiteUrl)
    } catch {}
  }
  return srcs
}

function CompanyLogoBox({ company, size = 48 }: { company: Company; size?: number }) {
  const sources = buildLogoSources(company)
  const [srcIndex, setSrcIndex] = useState(0)
  const [allFailed, setAllFailed]  = useState(false)

  const currentSrc = sources[srcIndex]
  const inset = Math.round(size * 0.72) // logo inset is 72% of box — gradient always frames it

  // The gradient outer is ALWAYS visible (never grey), logo floats inside as a smaller white inset
  return (
    <div
      className={cn("rounded-xl bg-gradient-to-br flex-shrink-0 flex items-center justify-center", companyColor(company.slug, company.logo_color))}
      style={{ width: size, height: size }}
    >
      {currentSrc && !allFailed ? (
        <div
          className="rounded-lg bg-white flex items-center justify-center overflow-hidden"
          style={{ width: inset, height: inset }}
        >
          <img
            key={currentSrc}
            src={currentSrc}
            alt={company.name}
            style={{ width: inset * 0.8, height: inset * 0.8, objectFit: "contain" }}
            onError={() => {
              if (srcIndex + 1 < sources.length) setSrcIndex(srcIndex + 1)
              else setAllFailed(true)
            }}
          />
        </div>
      ) : (
        <span className="font-black text-white" style={{ fontSize: size * 0.38 }}>
          {company.logo_letter}
        </span>
      )}
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────

export default function CompanyPrepPage() {
  const router = useRouter()
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState("")
  const [industry, setIndustry]   = useState("All")

  useEffect(() => {
    api.get("/company-prep/companies")
      .then((res) => setCompanies(res.data))
      .catch(() => toast.error("Failed to load companies"))
      .finally(() => setLoading(false))
  }, [])

  const industries = ["All", ...Array.from(new Set(companies.map(c => c.industry).filter(Boolean)))]

  const filtered = companies.filter(c => {
    const q = search.toLowerCase()
    return (c.name.toLowerCase().includes(q) || c.industry.toLowerCase().includes(q))
        && (industry === "All" || c.industry === industry)
  })

  const totalAptitude = companies.reduce((s, c) => s + c.aptitude_count, 0)
  const totalCoding   = companies.reduce((s, c) => s + c.coding_count, 0)
  const totalTips     = companies.reduce((s, c) => s + c.tips_count, 0)

  return (
    <div className="space-y-6">

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <div
        className="relative rounded-2xl overflow-hidden p-8 text-white shadow-lg shadow-black/15 ring-1 ring-inset ring-white/10"
        style={{ background: "linear-gradient(120deg, #312E81 0%, #1E1B4B 55%, #3B2C6B 100%)" }}
      >
        <SurfaceTexture />
        <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row sm:items-start gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-white/15 ring-1 ring-inset ring-white/20 flex items-center justify-center">
                <Building2 className="h-4 w-4 text-white" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-white/70">
                Company Prep Hub
              </span>
            </div>
            <h1 className="text-3xl font-bold font-serif text-white leading-tight">
              Crack Top Company<br className="hidden sm:block" /> Interviews
            </h1>
            <p className="text-sm text-white/75 mt-2 leading-relaxed max-w-md">
              Curated hiring patterns, aptitude questions, coding problems & expert tips — all in one place.
            </p>
            {!loading && (
              <div className="flex flex-wrap gap-5 mt-4">
                {[
                  { icon: Building2,    label: `${companies.length} Companies`   },
                  { icon: FileQuestion, label: `${totalAptitude} Aptitude Qs`    },
                  { icon: Code,         label: `${totalCoding} Coding Problems`  },
                  { icon: Lightbulb,    label: `${totalTips} Interview Tips`     },
                ].map(({ icon: Icon, label }) => (
                  <span key={label} className="flex items-center gap-1.5 text-xs font-semibold text-white/85">
                    <Icon className="h-3.5 w-3.5" /> {label}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <FeedbackModal compact triggerClassName="text-white/80 hover:text-white" />
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search company or industry…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 bg-white/95"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Sidebar + grid ─────────────────────────────────────────────── */}
      <div className="flex gap-5 items-start">

        {/* Desktop sidebar */}
        {!loading && industries.length > 2 && (
          <div className="hidden lg:block w-48 flex-shrink-0 sticky top-4">
            <GlassCard className="p-2 space-y-0.5">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-2 py-1.5">
                Filter by Industry
              </p>
              {industries.map(ind => {
                const count = ind === "All"
                  ? companies.length
                  : companies.filter(c => c.industry === ind).length
                return (
                  <button
                    key={ind}
                    onClick={() => setIndustry(ind)}
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left transition-all border",
                      industry === ind
                        ? "bg-primary/15 text-primary border-primary/25"
                        : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground border-transparent"
                    )}
                  >
                    {ind === "All"
                      ? <Building2 className="h-3.5 w-3.5 flex-shrink-0" />
                      : <Briefcase className="h-3.5 w-3.5 flex-shrink-0" />
                    }
                    <span className="flex-1 truncate text-xs font-medium">{ind}</span>
                    <span className="text-[10px] opacity-50 tabular-nums">{count}</span>
                  </button>
                )
              })}
            </GlassCard>
          </div>
        )}

        {/* Main grid area */}
        <div className="flex-1 min-w-0 space-y-4">

          {/* Mobile filter pills */}
          {!loading && industries.length > 2 && (
            <div className="flex flex-wrap gap-2 lg:hidden">
              {industries.map(ind => (
                <button
                  key={ind}
                  onClick={() => setIndustry(ind)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                    industry === ind
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-secondary/30 text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                  )}
                >
                  {ind}
                </button>
              ))}
            </div>
          )}

          {/* Results header */}
          {!loading && filtered.length > 0 && (
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">
                {industry !== "All" ? industry : "All Companies"}
                <span className="ml-1.5 text-muted-foreground font-normal">({filtered.length})</span>
              </p>
            </div>
          )}

          {/* Cards */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-border overflow-hidden bg-card">
                  <Skeleton className="h-1 w-full rounded-none" />
                  <div className="p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-12 w-12 rounded-xl flex-shrink-0" />
                      <div className="space-y-1.5 flex-1">
                        <Skeleton className="h-2.5 w-20" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </div>
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-3/4" />
                    <div className="flex gap-2 pt-1">
                      <Skeleton className="h-5 w-14 rounded-full" />
                      <Skeleton className="h-5 w-14 rounded-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center">
                <Building2 className="h-8 w-8 text-muted-foreground/40" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">No companies found</h3>
              <p className="text-sm text-muted-foreground text-center">
                {search ? `No results for "${search}"` : "Check back later for company prep resources"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((company, i) => (
                <motion.div
                  key={company.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.28, delay: Math.min(i * 0.04, 0.24) }}
                  className="group cursor-pointer h-full"
                  onClick={() => router.push(`/company-prep/${company.slug}`)}
                >
                  <div className="h-full flex flex-col rounded-2xl border border-border bg-card overflow-hidden transition-all duration-300 group-hover:border-primary/35 group-hover:shadow-lg group-hover:shadow-primary/8 group-hover:-translate-y-0.5">

                    {/* Top gradient accent bar */}
                    <div className={cn("h-1 bg-gradient-to-r", companyColor(company.slug, company.logo_color))} />

                    <div className="flex flex-col flex-1 p-4">

                      {/* Logo + Name + Industry */}
                      <div className="flex items-center gap-3 mb-3">
                        <CompanyLogoBox company={company} size={48} />
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-0.5 truncate">
                            {company.industry}
                          </p>
                          <h3 className="font-bold text-sm font-serif text-foreground leading-tight line-clamp-1">
                            {company.name}
                          </h3>
                        </div>
                      </div>

                      {/* Description */}
                      {company.description && (
                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-3">
                          {company.description}
                        </p>
                      )}

                      {/* Stats chips + CTA */}
                      <div className="mt-auto flex items-center gap-1.5 flex-wrap">
                        {company.aptitude_count > 0 && (
                          <span className="chip chip-primary inline-flex items-center gap-1">
                            <FileQuestion className="h-2.5 w-2.5" />
                            {company.aptitude_count} Apt
                          </span>
                        )}
                        {company.coding_count > 0 && (
                          <span className="chip chip-coding inline-flex items-center gap-1">
                            <Code className="h-2.5 w-2.5" />
                            {company.coding_count} Code
                          </span>
                        )}
                        {company.rounds_count > 0 && (
                          <span className="chip chip-success inline-flex items-center gap-1">
                            <Shield className="h-2.5 w-2.5" />
                            {company.rounds_count} Rounds
                          </span>
                        )}
                        {company.tips_count > 0 && (
                          <span className="chip chip-warning inline-flex items-center gap-1">
                            <Lightbulb className="h-2.5 w-2.5" />
                            {company.tips_count} Tips
                          </span>
                        )}
                        <span className="ml-auto text-xs text-primary font-semibold flex items-center gap-0.5 group-hover:gap-1.5 transition-all">
                          Prep <ChevronRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
