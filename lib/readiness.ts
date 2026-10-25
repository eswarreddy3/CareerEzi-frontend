// Placement readiness + admin leaderboard — client for backend app/routes/readiness.py.
// Numbers are computed server-side for the admin's college (or branch, for branch admins).

import api from "@/lib/api"

export type IssueKey = "no_projects" | "weak_ats" | "low_profile" | "few_skills" | "not_public" | "inactive"

export interface ReadinessStudent {
  id: number; name: string; email: string; phone: string; roll_number: string
  branch: string; section: string; passout_year: number | null; avatar: string | null
  points: number; streak: number; longest_streak: number; problems_solved: number; certificates: number
  ats_score: number; ats_template: string; resume_started: boolean; profile_strength: number
  projects: number; experience: number; skills: string[]; verified_skills: string[]
  is_public: boolean; public_url: string | null; last_active: string | null; issues: IssueKey[]
}

export interface ReadinessSummary {
  students: number; avg_ats: number; avg_profile: number; with_two_projects_pct: number; public_pct: number
  ats_bands: { excellent: number; good: number; needs_work: number; weak: number }
  top_skills: { skill: string; count: number }[]
  nudges: { issue: IssueKey; label: string; count: number }[]
}

export interface ScopeFilters {
  branches: string[]; sections: string[]; passout_years: number[]; fixed_branch: string | null
}

export interface ReadinessResponse {
  summary: ReadinessSummary
  students: ReadinessStudent[]
  filters: ScopeFilters & { issues: Record<IssueKey, string> }
}

export interface ReadinessQuery {
  branch?: string; section?: string; passout_year?: string; q?: string
  skills?: string[]; verified?: boolean; min_ats?: string; issue?: string; refresh?: boolean
}

function params(f: ReadinessQuery) {
  const p = new URLSearchParams()
  if (f.branch) p.set("branch", f.branch)
  if (f.section) p.set("section", f.section)
  if (f.passout_year) p.set("passout_year", f.passout_year)
  if (f.q) p.set("q", f.q)
  for (const s of f.skills ?? []) p.append("skill", s)
  if (f.verified) p.set("verified", "1")
  if (f.min_ats) p.set("min_ats", f.min_ats)
  if (f.issue) p.set("issue", f.issue)
  if (f.refresh) p.set("refresh", "1")
  return p
}

export async function fetchReadiness(f: ReadinessQuery): Promise<ReadinessResponse> {
  return (await api.get(`/admin/readiness?${params(f)}`)).data
}

export async function downloadReadinessCsv(f: ReadinessQuery) {
  const res = await api.get(`/admin/readiness/export?${params(f)}`, { responseType: "blob" })
  const url = URL.createObjectURL(res.data as Blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `placement_readiness_${new Date().toISOString().slice(0, 10)}.csv`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export type Metric = "points" | "problems_solved" | "ats_score" | "profile_strength" | "streak" | "certificates"

export interface Leader {
  rank: number; value: number; id: number; name: string; roll_number: string; branch: string; section: string
  passout_year: number | null; avatar: string | null; points: number; problems_solved: number
  ats_score: number; profile_strength: number; streak: number; certificates: number; public_url: string | null
}

export interface LeaderboardResponse {
  metric: Metric; metrics: Record<Metric, string>; total: number; leaders: Leader[]; filters: ScopeFilters
}

export async function fetchAdminLeaderboard(metric: Metric, f: Pick<ReadinessQuery, "branch" | "section" | "passout_year">): Promise<LeaderboardResponse> {
  const p = params(f)
  p.set("metric", metric)
  return (await api.get(`/admin/leaderboard?${p}`)).data
}

/** ATS score → band label + semantic tone (matches the student's ATS panel). */
export function atsBand(score: number) {
  if (score >= 85) return { label: "Excellent", tone: "success" as const }
  if (score >= 70) return { label: "Good", tone: "primary" as const }
  if (score >= 50) return { label: "Needs work", tone: "warning" as const }
  return { label: "Weak", tone: "danger" as const }
}
