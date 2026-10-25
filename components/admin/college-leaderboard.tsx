"use client"

// Leaderboard for college admins (whole college) and branch admins (their branch):
// rank students by points, problems solved, ATS score, profile strength, streak or certificates.

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Trophy, Medal, ExternalLink } from "lucide-react"
import { AdminHero } from "@/components/admin-stat-card"
import { GlassCard } from "@/components/glass-card"
import { Skeleton } from "@/components/ui/skeleton"
import { UserAvatar } from "@/components/user-avatar"
import { fetchAdminLeaderboard, type LeaderboardResponse, type Metric, type Leader } from "@/lib/readiness"
import { cn } from "@/lib/utils"

const METRIC_ORDER: Metric[] = ["points", "problems_solved", "ats_score", "profile_strength", "streak", "certificates"]
const SUFFIX: Partial<Record<Metric, string>> = { profile_strength: "%", streak: "d" }
const selectClass = "h-9 rounded-md border border-border bg-secondary/50 px-2.5 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
// Podium colours: medal identities (intentionally fixed, like the student leaderboard's podium)
const MEDAL = ["text-amber-500", "text-slate-400", "text-orange-600"]

export function CollegeLeaderboard() {
  const [metric, setMetric] = useState<Metric>("points")
  const [scope, setScope] = useState<{ branch?: string; section?: string; passout_year?: string }>({})
  const [data, setData] = useState<LeaderboardResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetchAdminLeaderboard(metric, scope)
      .then(setData)
      .catch(() => toast.error("Couldn't load the leaderboard"))
      .finally(() => setLoading(false))
  }, [metric, scope])

  const label = data?.metrics?.[metric] ?? "Points"
  const leaders = data?.leaders ?? []
  const filters = data?.filters

  return (
    <div className="space-y-5">
      <AdminHero eyebrow={filters?.fixed_branch ? `${filters.fixed_branch} · Leaderboard` : "Leaderboard"} title="Top students" icon={Trophy}
        subtitle="See who's leading — by practice, resume quality, profile or consistency." />

      <GlassCard className="p-4 space-y-3">
        <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Rank by">
          {METRIC_ORDER.map((m) => (
            <button key={m} type="button" role="tab" aria-selected={metric === m} onClick={() => setMetric(m)}
              className={cn("rounded-lg px-3 py-1.5 text-sm font-medium border transition-colors",
                metric === m ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground")}>
              {data?.metrics?.[m] ?? m}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {!filters?.fixed_branch && (
            <select aria-label="Branch" className={selectClass} value={scope.branch ?? ""} onChange={(e) => setScope((s) => ({ ...s, branch: e.target.value || undefined }))}>
              <option value="">All branches</option>
              {filters?.branches.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          )}
          <select aria-label="Section" className={selectClass} value={scope.section ?? ""} onChange={(e) => setScope((s) => ({ ...s, section: e.target.value || undefined }))}>
            <option value="">All sections</option>
            {filters?.sections.map((x) => <option key={x} value={x}>Section {x}</option>)}
          </select>
          <select aria-label="Passout year" className={selectClass} value={scope.passout_year ?? ""} onChange={(e) => setScope((s) => ({ ...s, passout_year: e.target.value || undefined }))}>
            <option value="">All batches</option>
            {filters?.passout_years.map((y) => <option key={y} value={String(y)}>Batch {y}</option>)}
          </select>
          {data && <span className="self-center text-xs text-muted-foreground ml-auto">{data.total} students · showing top {leaders.length}</span>}
        </div>
      </GlassCard>

      {loading && !data ? <Skeleton className="h-64 rounded-xl" /> : leaders.length === 0 ? (
        <GlassCard className="p-10 text-center text-sm text-muted-foreground">No students in this scope yet.</GlassCard>
      ) : (
        <>
          {/* Podium */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {leaders.slice(0, 3).map((l, i) => (
              <GlassCard key={l.id} className={cn("p-4 flex items-center gap-3", i === 0 && "ring-1 ring-primary/40")}>
                <Medal className={cn("h-7 w-7 flex-shrink-0", MEDAL[l.rank - 1] ?? "text-muted-foreground")} aria-label={`Rank ${l.rank}`} />
                <UserAvatar name={l.name} photoUrl={l.avatar} size="lg" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground truncate">{l.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{[l.branch, l.section && `Sec ${l.section}`].filter(Boolean).join(" · ")}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold font-serif text-foreground tabular-nums">{l.value}{SUFFIX[metric] ?? ""}</p>
                  <p className="text-[11px] text-muted-foreground">{label}</p>
                </div>
              </GlassCard>
            ))}
          </div>

          {/* Ranking */}
          <GlassCard className="p-0 overflow-x-auto">
            <table className="w-full text-sm">
              <caption className="sr-only">Students ranked by {label}</caption>
              <thead>
                <tr className="border-b border-border text-xs text-muted-foreground">
                  <th scope="col" className="text-left font-medium px-4 py-2.5 w-14">Rank</th>
                  <th scope="col" className="text-left font-medium px-2 py-2.5">Student</th>
                  <th scope="col" className="text-right font-medium px-2 py-2.5 text-primary">{label}</th>
                  {METRIC_ORDER.filter((m) => m !== metric).map((m) => (
                    <th key={m} scope="col" className="text-right font-medium px-2 py-2.5 hidden md:table-cell">{data?.metrics?.[m]}</th>
                  ))}
                  <th scope="col" className="px-4 py-2.5"><span className="sr-only">Public profile</span></th>
                </tr>
              </thead>
              <tbody>
                {leaders.map((l) => <Row key={l.id} l={l} metric={metric} />)}
              </tbody>
            </table>
          </GlassCard>
        </>
      )}
    </div>
  )
}

function Row({ l, metric }: { l: Leader; metric: Metric }) {
  return (
    <tr className="border-b border-border/50 last:border-0 hover:bg-secondary/30">
      <td className="px-4 py-2.5">
        <span className={cn("inline-flex w-7 h-7 items-center justify-center rounded-full text-xs font-bold tabular-nums",
          l.rank <= 3 ? "bg-primary/15 text-primary" : "text-muted-foreground")}>{l.rank}</span>
      </td>
      <td className="px-2 py-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <UserAvatar name={l.name} photoUrl={l.avatar} size="sm" />
          <div className="min-w-0">
            <p className="font-medium text-foreground truncate">{l.name}</p>
            <p className="text-xs text-muted-foreground truncate">{[l.roll_number, l.branch, l.passout_year].filter(Boolean).join(" · ")}</p>
          </div>
        </div>
      </td>
      <td className="px-2 py-2.5 text-right font-bold tabular-nums text-foreground">{l.value}{SUFFIX[metric] ?? ""}</td>
      {METRIC_ORDER.filter((m) => m !== metric).map((m) => (
        <td key={m} className="px-2 py-2.5 text-right tabular-nums text-muted-foreground hidden md:table-cell">{l[m]}{SUFFIX[m] ?? ""}</td>
      ))}
      <td className="px-4 py-2.5 text-right">
        {l.public_url && (
          <a href={l.public_url} target="_blank" rel="noopener noreferrer" aria-label={`${l.name}'s public profile`} className="text-primary hover:text-primary/80">
            <ExternalLink className="h-4 w-4 inline" />
          </a>
        )}
      </td>
    </tr>
  )
}
