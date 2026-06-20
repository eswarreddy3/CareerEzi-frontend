"use client"

import { useEffect, useState } from "react"
import { GlassCard } from "@/components/glass-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FeedbackModal } from "@/components/feedback-modal"
import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"
import {
  Briefcase, Building2, Clock, ExternalLink, Calendar,
  Search, Filter, Flame, MapPin, Wifi, ChevronLeft, ChevronRight, ArrowDownUp,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import api from "@/lib/api"
import { AdminHero } from "@/components/admin-stat-card"

interface Job {
  id: number | string
  external_db_id?: number
  title: string
  company: string
  type: "internship" | "full-time" | "part-time" | "contract"
  experience: string | null
  apply_link: string
  deadline: string | null
  description: string | null
  scope: "global" | "college"
  location?: string | null
  is_remote?: boolean
  source?: string          // "admin" | "adzuna" | "jsearch" | ...
  source_label?: string    // "CareerEzi" | "LinkedIn" | "Adzuna" | ...
  created_at: string
}

const typeConfig: Record<string, { label: string; color: string }> = {
  "internship":  { label: "Internship",  color: "chip chip-primary" },
  "full-time":   { label: "Full-Time",   color: "chip chip-success" },
  "part-time":   { label: "Part-Time",   color: "chip chip-warning" },
  "contract":    { label: "Contract",    color: "chip chip-coding" },
}

function daysUntil(isoDate: string): number {
  return Math.ceil((new Date(isoDate).getTime() - Date.now()) / 86400000)
}

function DeadlineBadge({ deadline }: { deadline: string | null }) {
  if (!deadline) return null
  const days = daysUntil(deadline)
  if (days < 0) return <span className="text-xs text-danger">Expired</span>
  if (days === 0) return <span className="text-xs font-semibold text-danger animate-pulse">Closes today!</span>
  if (days <= 3) return <span className="text-xs font-medium text-warning flex items-center gap-1"><Flame className="h-3 w-3" />{days}d left</span>
  return (
    <span className="text-xs text-muted-foreground flex items-center gap-1">
      <Calendar className="h-3 w-3" />
      {new Date(deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
    </span>
  )
}

const ALL_TYPES = ["all", "internship", "full-time", "part-time", "contract"] as const
type Filter = typeof ALL_TYPES[number]

const PAGE_SIZE = 12

function postedAgo(iso: string | null | undefined): string {
  if (!iso) return ""
  const diff = Date.now() - new Date(iso).getTime()
  const days = Math.floor(diff / 86400000)
  if (days <= 0) {
    const hrs = Math.floor(diff / 3600000)
    return hrs <= 1 ? "just now" : `${hrs}h ago`
  }
  if (days === 1) return "1 day ago"
  if (days < 30) return `${days} days ago`
  const months = Math.floor(days / 30)
  return months === 1 ? "1 month ago" : `${months} months ago`
}

// Windowed pager: 1 … (cur-1) cur (cur+1) … last
function getPageWindow(current: number, total: number): (number | "…")[] {
  const out: (number | "…")[] = []
  const range: number[] = []
  for (let i = Math.max(1, current - 1); i <= Math.min(total, current + 1); i++) range.push(i)
  if (range[0] > 1) { out.push(1); if (range[0] > 2) out.push("…") }
  out.push(...range)
  const last = range[range.length - 1]
  if (last < total) { if (last < total - 1) out.push("…"); out.push(total) }
  return out
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<Filter>("all")
  const [sourceFilter, setSourceFilter] = useState<string>("all")
  const [locationFilter, setLocationFilter] = useState<string>("all")
  const [remoteOnly, setRemoteOnly] = useState(false)
  const [sort, setSort] = useState<"newest" | "deadline">("newest")
  const [page, setPage] = useState(1)

  useEffect(() => {
    api.get("/jobs/")
      .then((res) => setJobs(res.data))
      .catch(() => toast.error("Failed to load jobs"))
      .finally(() => setLoading(false))
  }, [])

  // Reset to first page whenever any filter/sort changes.
  useEffect(() => { setPage(1) }, [search, filter, sourceFilter, locationFilter, remoteOnly, sort])

  // Distinct sources + locations present in the feed, for the filter controls.
  const sources = Array.from(new Set(jobs.map((j) => j.source || "admin")))
  const sourceLabelOf = (s: string) =>
    s === "admin" ? "CareerEzi" : (jobs.find((j) => (j.source || "admin") === s)?.source_label || s)
  const locations = Array.from(new Set(jobs.map((j) => j.location).filter(Boolean) as string[])).sort()

  const filtered = jobs
    .filter((j) => {
      const matchType = filter === "all" || j.type === filter
      const matchSource = sourceFilter === "all" || (j.source || "admin") === sourceFilter
      const matchLocation = locationFilter === "all" || j.location === locationFilter
      const matchRemote = !remoteOnly || j.is_remote
      const q = search.toLowerCase()
      const matchSearch = !q
        || j.title.toLowerCase().includes(q)
        || j.company.toLowerCase().includes(q)
        || (j.location || "").toLowerCase().includes(q)
      return matchType && matchSource && matchLocation && matchRemote && matchSearch
    })
    .sort((a, b) => {
      if (sort === "deadline") {
        // jobs with a real deadline first (soonest), then the rest by recency
        const ad = a.deadline ? new Date(a.deadline).getTime() : Infinity
        const bd = b.deadline ? new Date(b.deadline).getTime() : Infinity
        if (ad !== bd) return ad - bd
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const hasActiveFilters = search !== "" || filter !== "all" || sourceFilter !== "all"
    || locationFilter !== "all" || remoteOnly

  return (
    <div className="space-y-8">
      {/* Header */}
      <AdminHero icon={Briefcase} title="Job Postings" subtitle="Opportunities shared by your college — apply before the deadline"
        right={<FeedbackModal compact triggerClassName="text-white/80 hover:text-white flex-shrink-0" />} />

      {/* Filters */}
      <GlassCard className="space-y-3">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search title, company or location…"
              className="pl-9 bg-secondary/50"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {locations.length > 0 && (
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-[170px] bg-secondary/50">
                  <MapPin className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All locations</SelectItem>
                  {locations.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                </SelectContent>
              </Select>
            )}
            <Select value={sort} onValueChange={(v) => setSort(v as "newest" | "deadline")}>
              <SelectTrigger className="w-[160px] bg-secondary/50">
                <ArrowDownUp className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest first</SelectItem>
                <SelectItem value="deadline">Deadline soon</SelectItem>
              </SelectContent>
            </Select>
            <button
              onClick={() => setRemoteOnly((v) => !v)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5",
                remoteOnly
                  ? "bg-success/15 border-success/40 text-success"
                  : "bg-secondary/30 border-white/10 text-muted-foreground hover:border-white/20 hover:text-foreground"
              )}
            >
              <Wifi className="h-3.5 w-3.5" /> Remote
            </button>
          </div>
        </div>

        {/* Type chips */}
        <div className="flex gap-2 flex-wrap">
          {ALL_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all capitalize",
                filter === t
                  ? "bg-primary/20 border-primary/40 text-primary"
                  : "bg-secondary/30 border-white/10 text-muted-foreground hover:border-white/20 hover:text-foreground"
              )}
            >
              {t === "all" ? "All Types" : typeConfig[t].label}
            </button>
          ))}
        </div>

        {/* Source chips — only when aggregated sources are present */}
        {sources.length > 1 && (
          <div className="flex gap-2 flex-wrap">
            {["all", ...sources].map((s) => (
              <button
                key={s}
                onClick={() => setSourceFilter(s)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                  sourceFilter === s
                    ? "bg-coding/15 border-coding/40 text-coding"
                    : "bg-secondary/30 border-white/10 text-muted-foreground hover:border-white/20 hover:text-foreground"
                )}
              >
                {s === "all" ? "All Sources" : sourceLabelOf(s)}
              </button>
            ))}
          </div>
        )}
      </GlassCard>

      {/* Results summary */}
      {!loading && (
        <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            {filtered.length} {filtered.length === 1 ? "job" : "jobs"} found
            {hasActiveFilters && (
              <button
                onClick={() => { setSearch(""); setFilter("all"); setSourceFilter("all"); setLocationFilter("all"); setRemoteOnly(false) }}
                className="text-primary hover:underline text-xs"
              >
                Clear filters
              </button>
            )}
          </span>
          {totalPages > 1 && <span className="text-xs">Page {currentPage} of {totalPages}</span>}
        </div>
      )}

      {/* Job cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
      >
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <GlassCard key={i} className="space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3 w-1/3" />
                <Skeleton className="h-8 w-full rounded-lg mt-2" />
              </GlassCard>
            ))
          : visible.map((job) => {
              const tc = typeConfig[job.type] ?? typeConfig["full-time"]
              return (
                <motion.div
                  key={job.id}
                  variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                >
                  <GlassCard hover className="flex flex-col gap-4 h-full">
                    {/* Top row */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="p-2.5 rounded-xl bg-primary/10 flex-shrink-0">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex items-center gap-2 ml-auto flex-wrap justify-end">
                        {job.scope === "college" && (
                          <Badge variant="outline" className="text-xs border border-primary/40 text-primary bg-primary/10">
                            Your College
                          </Badge>
                        )}
                        {job.source && job.source !== "admin" && (
                          <Badge variant="outline" className="text-xs border border-coding/30 text-coding bg-coding/10">
                            via {job.source_label}
                          </Badge>
                        )}
                        <Badge variant="outline" className={cn("text-xs border", tc.color)}>
                          {tc.label}
                        </Badge>
                      </div>
                    </div>

                    {/* Title & company */}
                    <div>
                      <h3 className="font-semibold text-foreground text-base leading-snug">{job.title}</h3>
                      <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5 flex-shrink-0" />
                        {job.company}
                      </p>
                    </div>

                    {/* Meta row */}
                    <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-xs">
                      {job.location && (
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5" />
                          {job.location}
                        </span>
                      )}
                      {job.is_remote && (
                        <span className="flex items-center gap-1 text-success font-medium">
                          <Wifi className="h-3.5 w-3.5" /> Remote
                        </span>
                      )}
                      {job.experience && (
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Briefcase className="h-3.5 w-3.5" />
                          {job.experience}
                        </span>
                      )}
                    </div>

                    {/* Apply-by / posted line */}
                    <div className="flex items-center gap-1 text-xs">
                      {job.deadline ? (
                        <>
                          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-muted-foreground">Apply by:</span>
                          <DeadlineBadge deadline={job.deadline} />
                        </>
                      ) : (
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          Posted {postedAgo(job.created_at)}
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    {job.description && (
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                        {job.description}
                      </p>
                    )}

                    {/* Apply button */}
                    <div className="mt-auto pt-2">
                      <Button
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                        onClick={() => {
                          if (job.source && job.source !== "admin") {
                            api.post(`/jobs/external/${job.external_db_id}/apply`).catch(() => {})
                          } else {
                            api.post(`/jobs/${job.id}/apply`).catch(() => {})
                          }
                          window.open(job.apply_link, "_blank", "noopener,noreferrer")
                        }}
                      >
                        Apply Now
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </GlassCard>
                </motion.div>
              )
            })}
      </motion.div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-1.5 pt-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="h-9 w-9 flex items-center justify-center rounded-lg border border-white/10 bg-secondary/30 text-muted-foreground hover:text-foreground hover:border-white/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          {getPageWindow(currentPage, totalPages).map((p, i) =>
            p === "…" ? (
              <span key={`e${i}`} className="px-2 text-muted-foreground">…</span>
            ) : (
              <button
                key={p}
                onClick={() => setPage(p as number)}
                className={cn(
                  "h-9 min-w-9 px-3 flex items-center justify-center rounded-lg border text-sm font-medium transition-all",
                  currentPage === p
                    ? "bg-primary/20 border-primary/40 text-primary"
                    : "bg-secondary/30 border-white/10 text-muted-foreground hover:text-foreground hover:border-white/20"
                )}
              >
                {p}
              </button>
            )
          )}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="h-9 w-9 flex items-center justify-center rounded-lg border border-white/10 bg-secondary/30 text-muted-foreground hover:text-foreground hover:border-white/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Briefcase className="h-12 w-12 text-muted-foreground/30 mb-4" />
          <p className="text-lg font-medium text-foreground">No jobs found</p>
          <p className="text-sm text-muted-foreground mt-1">
            {hasActiveFilters ? "Try adjusting your filters" : "No jobs available right now — check back soon"}
          </p>
        </div>
      )}
    </div>
  )
}
