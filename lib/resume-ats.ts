// ATS check + text PDF — client for CareerEzi-backend/app/routes/resume_tools.py.
// Scores are computed by backend rules (app/services/resume_ats.py); the AI only
// reads job descriptions and suggests rewrites (app/services/resume_ai.py).

import api from "@/lib/api"
import type { ResumeData, TemplateId } from "@/lib/resume"

export type CheckStatus = "pass" | "warn" | "fail"
export interface FixTarget { section?: string; id?: string; action?: "template"; value?: string }
export interface AtsCheck {
  id: string; category: "readability" | "content" | "match"; label: string; status: CheckStatus
  earned: number; max: number; message: string; fix?: string; target?: FixTarget
}
export interface JobAnalysis { role: string; seniority: string; must_have: string[]; nice_to_have: string[] }
export interface KeywordHit { keyword: string; found: boolean }
export interface AtsMatch { role: string; seniority: string; must_have: KeywordHit[]; nice_to_have: KeywordHit[]; percent: number }
export interface AiQuota { used: number; limit: number; remaining: number; resets_at: string }
export interface AtsReport {
  score: number
  categories: { id: string; label: string; earned: number; max: number }[]
  checks: AtsCheck[]
  match: AtsMatch | null
  job?: JobAnalysis
  match_error?: { code: string; message: string }
  stats: { words: number; bullets: number }
  ai: { available: boolean; reason?: string; quota: AiQuota }
}

export async function runAtsCheck(data: ResumeData, template: TemplateId,
  opts: { jobDescription?: string; jobAnalysis?: JobAnalysis | null } = {}): Promise<AtsReport> {
  const body: Record<string, unknown> = { data, template }
  if (opts.jobAnalysis) body.job_analysis = opts.jobAnalysis
  else if (opts.jobDescription) body.job_description = opts.jobDescription
  return (await api.post("/student/resume/ats-check", body)).data
}

export interface Suggestion { suggestions: string[]; note: string; quota: AiQuota }

export async function suggestRewrite(data: ResumeData, kind: "bullets" | "summary",
  opts: { section?: string; itemId?: string; jobAnalysis?: JobAnalysis | null } = {}): Promise<Suggestion> {
  return (await api.post("/student/resume/ats-suggest", {
    data, kind, section: opts.section, item_id: opts.itemId, job_analysis: opts.jobAnalysis ?? undefined,
  })).data
}

/** Download the real-text PDF (ATS template) rendered by the backend. */
export async function downloadTextPdf(data: ResumeData) {
  const res = await api.post("/student/resume/pdf", { data }, { responseType: "blob" })
  const url = URL.createObjectURL(res.data as Blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `${(data.personal.name || "Resume").replace(/[^A-Za-z0-9]+/g, "_")}_Resume.pdf`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
