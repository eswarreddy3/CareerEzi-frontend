"use client"

// Placement readiness for college admins (whole college) and branch admins (their branch).
// Summary + nudges + a filterable student list + CSV export for a company drive.

import { useCallback, useEffect, useMemo, useState, type KeyboardEvent, type ReactNode } from "react"
import Link from "next/link"
import { toast } from "sonner"
import {
  Gauge, Download, RefreshCw, Users, IdCard, FolderGit2, Globe, BadgeCheck, X, ExternalLink, Loader2, AlertTriangle, Sparkles,
} from "lucide-react"
import { AdminHero } from "@/components/admin-stat-card"
import { GlassCard } from "@/components/glass-card"
import { DataTable, type Column } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Skeleton } from "@/components/ui/skeleton"
import { UserAvatar } from "@/components/user-avatar"
import {
  fetchReadiness, downloadReadinessCsv, atsBand,
  type ReadinessQuery, type ReadinessResponse, type ReadinessStudent, type IssueKey,
} from "@/lib/readiness"
import { cn } from "@/lib/utils"

const TONE: Record<"success" | "primary" | "warning" | "danger", string> = {
  success: "bg-success/10 text-success border-success/30",
  primary: "bg-primary/10 text-primary border-primary/30",
  warning: "bg-warning/10 text-warning border-warning/30",
  danger: "bg-danger/10 text-danger border-danger/30",
}

const selectClass = "h-9 rounded-md border border-border bg-secondary/50 px-2.5 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"

function timeAgo(iso: string | null) {
  if (!iso) return "Never"
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000)
  return days <= 0 ? "Today" : days === 1 ? "Yesterday" : days < 30 ? `${days}d ago` : `${Math.floor(days / 30)}mo ago`
}

export function ReadinessDashboard({ studentHref }: {
  /** Link for a student row (college admins have a student detail page). */
  studentHref?: (id: number) => string
}) {
  const [f, setF] = useState<ReadinessQuery>({})
  const [skillDraft, setSkillDraft] = useState("")
  const [search, setSearch] = useState("")
  const [data, setData] = useState<ReadinessResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)

  const load = useCallback(async (q: ReadinessQuery) => {
    setLoading(true)
    try { setData(await fetchReadiness(q)) }
    catch { toast.error("Couldn't load placement readiness") }
    finally { setLoading(false) }
  }, [])

  // search is debounced; every other filter applies immediately
  useEffect(() => {
    const t = setTimeout(() => load({ ...f, q: search }), search ? 300 : 0)
    return () => clearTimeout(t)
  }, [f, search, load])

  const set = (patch: Partial<ReadinessQuery>) => setF((cur) => ({ ...cur, ...patch }))
  const addSkill = (s: string) => {
    const v = s.trim()
    if (!v) return
    setF((cur) => (cur.skills?.some((x) => x.toLowerCase() === v.toLowerCase()) || (cur.skills?.length ?? 0) >= 5
      ? cur : { ...cur, skills: [...(cur.skills ?? []), v] }))
    setSkillDraft("")
  }
  const onSkillKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addSkill(skillDraft) }
  }
  const hasFilters = !!(f.branch || f.section || f.passout_year || f.skills?.length || f.verified || f.min_ats || f.issue || search)

  const exportCsv = async () => {
    setExporting(true)
    try { await downloadReadinessCsv({ ...f, q: search }) }
    catch { toast.error("Export failed") }
    finally { setExporting(false) }
  }

  const s = data?.summary
  const filters = data?.filters
  const columns: Column<ReadinessStudent>[] = useMemo(() => [
    {
      key: "name", header: "Student", sortable: true,
      render: (r) => {
        const inner = (
          <div className="flex items-center gap-2.5 min-w-0">
            <UserAvatar name={r.name} photoUrl={r.avatar} size="sm" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{r.name}</p>
              <p className="text-xs text-muted-foreground truncate">{r.roll_number || r.email}</p>
            </div>
          </div>
        )
        return studentHref ? <Link href={studentHref(r.id)} className="hover:underline">{inner}</Link> : inner
      },
    },
    {
      key: "branch", header: "Branch", sortable: true,
      render: (r) => <span className="text-xs text-muted-foreground whitespace-nowrap">{[r.branch, r.section && `Sec ${r.section}`, r.passout_year].filter(Boolean).join(" · ")}</span>,
    },
    {
      key: "ats_score", header: "ATS", sortable: true, firstDir: "desc",
      render: (r) => {
        const b = atsBand(r.ats_score)
        return (
          <span title={`${b.label}${r.resume_started ? "" : " · resume builder not opened yet"}`}
            className={cn("inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold tabular-nums", TONE[b.tone])}>
            {r.ats_score}
          </span>
        )
      },
    },
    {
      key: "profile_strength", header: "Profile", sortable: true, firstDir: "desc",
      render: (r) => (
        <div className="flex items-center gap-2 min-w-[90px]">
          <div className="h-1.5 w-14 rounded-full bg-secondary overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: `${r.profile_strength}%` }} />
          </div>
          <span className="text-xs tabular-nums text-muted-foreground">{r.profile_strength}%</span>
        </div>
      ),
    },
    { key: "projects", header: "Projects", sortable: true, firstDir: "desc", className: "text-center", render: (r) => <span className={cn("tabular-nums", r.projects === 0 && "text-danger")}>{r.projects}</span> },
    {
      key: "skills", header: "Skills", sortable: true, firstDir: "desc", sortValue: (r) => r.skills.length,
      render: (r) => r.skills.length ? (
        <div className="flex flex-wrap gap-1 max-w-[260px]">
          {r.skills.slice(0, 4).map((sk) => {
            const v = r.verified_skills.includes(sk)
            return (
              <span key={sk} title={v ? "Verified by CareerEzi" : undefined}
                className={cn("inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[11px]", v ? "bg-success/10 text-success" : "bg-secondary text-foreground/80")}>
                {v && <BadgeCheck className="h-3 w-3" aria-label="verified" />}{sk}
              </span>
            )
          })}
          {r.skills.length > 4 && <span className="text-[11px] text-muted-foreground">+{r.skills.length - 4}</span>}
        </div>
      ) : <span className="text-xs text-muted-foreground">—</span>,
    },
    { key: "certificates", header: "Certs", sortable: true, firstDir: "desc", className: "text-center", render: (r) => <span className="tabular-nums">{r.certificates}</span> },
    { key: "problems_solved", header: "Solved", sortable: true, firstDir: "desc", className: "text-center", render: (r) => <span className="tabular-nums">{r.problems_solved}</span> },
    {
      key: "public_url", header: "Public",
      render: (r) => r.public_url
        ? <a href={r.public_url} target="_blank" rel="noopener noreferrer" aria-label={`${r.name}'s public profile`} className="text-primary hover:text-primary/80"><ExternalLink className="h-4 w-4" /></a>
        : <span className="text-xs text-muted-foreground">Off</span>,
    },
    { key: "last_active", header: "Active", sortable: true, firstDir: "desc", render: (r) => <span className="text-xs text-muted-foreground whitespace-nowrap">{timeAgo(r.last_active)}</span> },
  ], [studentHref])

  return (
    <div className="space-y-5">
      <AdminHero eyebrow={filters?.fixed_branch ? `${filters.fixed_branch} · Placement Cell` : "Placement Cell"}
        title="Placement Readiness" icon={Gauge}
        subtitle="ATS scores, profiles, projects and verified skills — find and nudge the students who need help."
        right={
          <div className="flex gap-2">
            <Button size="sm" onClick={() => load({ ...f, q: search, refresh: true })} disabled={loading} className="bg-white/15 hover:bg-white/25 text-white border-0 h-8">
              <RefreshCw className={cn("h-4 w-4 mr-1.5", loading && "animate-spin")} /> Refresh
            </Button>
            <Button size="sm" onClick={exportCsv} disabled={exporting || !data?.students.length} className="bg-white/15 hover:bg-white/25 text-white border-0 h-8">
              {exporting ? <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> : <Download className="h-4 w-4 mr-1.5" />} Export CSV
            </Button>
          </div>
        } />

      {/* Summary */}
      {!s ? <Skeleton className="h-24 rounded-xl" /> : (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          <Stat icon={Users} label="Students" value={s.students} />
          <Stat icon={Gauge} label="Average ATS score" value={s.avg_ats} />
          <Stat icon={IdCard} label="Average profile strength" value={`${s.avg_profile}%`} />
          <Stat icon={FolderGit2} label="With 2+ projects" value={`${s.with_two_projects_pct}%`} />
          <Stat icon={Globe} label="Public profile on" value={`${s.public_pct}%`} />
        </div>
      )}

      {s && s.students > 0 && (
        <div className="grid lg:grid-cols-3 gap-3">
          <GlassCard className="p-4 lg:col-span-1">
            <h3 className="text-sm font-semibold text-foreground mb-3">ATS score bands</h3>
            <BandBar bands={s.ats_bands} total={s.students} />
          </GlassCard>
          <GlassCard className="p-4 lg:col-span-2">
            <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-1.5"><AlertTriangle className="h-4 w-4 text-warning" /> Needs attention</h3>
            {s.nudges.length === 0 ? <p className="text-sm text-muted-foreground">Nothing flagged — great work.</p> : (
              <div className="flex flex-wrap gap-2">
                {s.nudges.map((n) => (
                  <button key={n.issue} type="button" aria-pressed={f.issue === n.issue}
                    onClick={() => set({ issue: f.issue === n.issue ? undefined : n.issue })}
                    className={cn("rounded-lg border px-3 py-1.5 text-sm transition-colors",
                      f.issue === n.issue ? "border-primary bg-primary/10 text-foreground" : "border-border hover:border-primary/40 text-foreground")}>
                    <span className="font-semibold tabular-nums">{n.count}</span> <span className="text-muted-foreground">· {n.label}</span>
                  </button>
                ))}
              </div>
            )}
            {s.top_skills.length > 0 && (
              <>
                <h3 className="text-sm font-semibold text-foreground mt-4 mb-2 flex items-center gap-1.5"><Sparkles className="h-4 w-4 text-primary" /> Most common skills</h3>
                <div className="flex flex-wrap gap-1.5">
                  {s.top_skills.slice(0, 14).map((t) => (
                    <button key={t.skill} type="button" onClick={() => addSkill(t.skill)} title={`Show students with ${t.skill}`}
                      className="rounded-full border border-border px-2.5 py-0.5 text-xs text-foreground hover:border-primary/50">
                      {t.skill} <span className="text-muted-foreground tabular-nums">{t.count}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </GlassCard>
        </div>
      )}

      {/* Filters */}
      <GlassCard className="p-4 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, roll no. or email"
            aria-label="Search students" className="h-9 w-full sm:w-64 bg-secondary/50 border-border" />
          {!filters?.fixed_branch && (
            <select aria-label="Branch" className={selectClass} value={f.branch ?? ""} onChange={(e) => set({ branch: e.target.value || undefined })}>
              <option value="">All branches</option>
              {filters?.branches.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          )}
          <select aria-label="Section" className={selectClass} value={f.section ?? ""} onChange={(e) => set({ section: e.target.value || undefined })}>
            <option value="">All sections</option>
            {filters?.sections.map((x) => <option key={x} value={x}>Section {x}</option>)}
          </select>
          <select aria-label="Passout year" className={selectClass} value={f.passout_year ?? ""} onChange={(e) => set({ passout_year: e.target.value || undefined })}>
            <option value="">All batches</option>
            {filters?.passout_years.map((y) => <option key={y} value={String(y)}>Batch {y}</option>)}
          </select>
          <select aria-label="Minimum ATS score" className={selectClass} value={f.min_ats ?? ""} onChange={(e) => set({ min_ats: e.target.value || undefined })}>
            <option value="">Any ATS score</option>
            <option value="50">ATS 50+</option>
            <option value="70">ATS 70+</option>
            <option value="85">ATS 85+</option>
          </select>
          <select aria-label="Needs attention" className={selectClass} value={f.issue ?? ""} onChange={(e) => set({ issue: (e.target.value || undefined) as IssueKey | undefined })}>
            <option value="">All students</option>
            {filters && Object.entries(filters.issues).map(([k, label]) => <option key={k} value={k}>{label}</option>)}
          </select>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Input value={skillDraft} onChange={(e) => setSkillDraft(e.target.value)} onKeyDown={onSkillKey} onBlur={() => addSkill(skillDraft)}
            placeholder="Filter by skill, e.g. React — press Enter" aria-label="Filter by skill" className="h-9 w-full sm:w-72 bg-secondary/50 border-border" />
          {f.skills?.map((sk) => (
            <span key={sk} className="inline-flex items-center gap-1 rounded-full border border-primary/40 bg-primary/10 px-2.5 py-1 text-xs text-foreground">
              {sk}
              <button type="button" aria-label={`Remove ${sk}`} onClick={() => set({ skills: f.skills!.filter((x) => x !== sk) })}><X className="h-3 w-3" /></button>
            </span>
          ))}
          <label className="inline-flex items-center gap-2 text-sm text-foreground ml-1 cursor-pointer">
            <Switch checked={!!f.verified} onCheckedChange={(v) => set({ verified: v || undefined })} aria-label="Verified skills only" />
            Verified skills only
          </label>
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={() => { setF({}); setSearch(""); setSkillDraft("") }} className="ml-auto">Clear filters</Button>
          )}
        </div>
      </GlassCard>

      {/* Students */}
      <GlassCard className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground">
            {data ? `${data.students.length} student${data.students.length === 1 ? "" : "s"}` : "Students"}
            {hasFilters && <span className="text-muted-foreground font-normal"> {data?.students.length === 1 ? "matches" : "match"} these filters</span>}
          </h3>
          <span className="text-xs text-muted-foreground">Sorted by ATS score · export uses these filters</span>
        </div>
        <DataTable key={JSON.stringify({ ...f, search })} columns={columns} data={data?.students ?? []} keyField="id"
          isLoading={loading && !data} pageSize={15} emptyMessage="No students match these filters." emptyIcon={<Users className="h-10 w-10" />} />
      </GlassCard>
    </div>
  )
}

function Stat({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: ReactNode }) {
  return (
    <GlassCard className="p-4">
      <Icon className="h-4 w-4 text-primary mb-2" aria-hidden />
      <p className="text-2xl font-bold font-serif text-foreground tabular-nums">{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
    </GlassCard>
  )
}

function BandBar({ bands, total }: { bands: ReadinessResponse["summary"]["ats_bands"]; total: number }) {
  const parts = [
    { key: "excellent", label: "Excellent (85+)", n: bands.excellent, cls: "bg-success" },
    { key: "good", label: "Good (70–84)", n: bands.good, cls: "bg-primary" },
    { key: "needs_work", label: "Needs work (50–69)", n: bands.needs_work, cls: "bg-warning" },
    { key: "weak", label: "Weak (<50)", n: bands.weak, cls: "bg-danger" },
  ]
  return (
    <div>
      <div className="flex h-3 rounded-full overflow-hidden bg-secondary" role="img"
        aria-label={parts.map((p) => `${p.label}: ${p.n}`).join(", ")}>
        {parts.map((p) => p.n > 0 && <div key={p.key} className={p.cls} style={{ width: `${(100 * p.n) / total}%` }} />)}
      </div>
      <ul className="mt-3 space-y-1.5">
        {parts.map((p) => (
          <li key={p.key} className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-2 text-foreground"><span className={cn("w-2.5 h-2.5 rounded-sm", p.cls)} aria-hidden />{p.label}</span>
            <span className="tabular-nums text-muted-foreground">{p.n} · {total ? Math.round((100 * p.n) / total) : 0}%</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
