import api from "@/lib/api"

// ─── Types ───────────────────────────────────────────────────────────────────
export type PackKey = "ai_coach" | "mock_interview"

export interface PackCapability {
  enabled: boolean
  label: string
  reason?: "disabled" | "unconfigured" | "not_licensed" | "paused"
  quota?: { used: number; limit: number; remaining: number | null; resets_at: string }
}

export interface Capabilities {
  enabled: boolean
  assistant: { name: string }
  features: Record<PackKey, PackCapability>
}

export type ItemKind = "lesson" | "practice" | "aptitude" | "coding" | "drive" | "profile"

export interface PlanItem {
  kind: ItemKind
  label: string
  detail: string
  target_id: string | null
  target_count: number
  deep_link: string
  reason: string
  points: number
  progress: number
  done: boolean
}

export interface ReadinessComponent {
  key: "academic" | "skills" | "practice" | "profile"
  label: string
  max: number
  earned: number
  detail: string
}

export interface ReadinessGap {
  label: string
  action: string
  worth: number
  why: string
  component: string
  target_id?: string
}

/** Free, SQL-derived insights — the things a generic chatbot can't know. */
export interface PlanInsights {
  peer?: {
    scope: string
    cohort_size: number
    areas: Record<string, number>
    strongest: { area: string; percentile: number }
    weakest: { area: string; percentile: number }
    notable: boolean
  } | null
  rhythm?: {
    peak_hour: number; label: string; window: string
    confident: boolean; sessions_30d: number; weekend_share: number
  } | null
  projection?: {
    company: string; days_away: number; eligible_now: boolean
    blockers: string[]; current: number; projected: number
    per_day: number; has_trend: boolean
  } | null
  momentum?: {
    this_week: number; last_week: number
    change_pct: number; direction: "up" | "down" | "steady"
  } | null
}

export interface PlanHighlights {
  name?: string
  streak?: number
  longest_streak?: number
  points?: number
  days_since_active?: number | null
  weak_topics?: { topic: string; kind: string; accuracy: number; attempts: number }[]
  nearly_done?: { course_id: string; title: string; percentage: number }[]
  next_drive?: {
    drive_id: number; company: string; role: string
    days_away: number | null; eligible: boolean; blockers: string[]
  } | null
}

export interface TopicGuide {
  topic: string
  kind: string
  summary: string
  why_it_matters: string
  approach: string[]
  common_mistakes: string[]
  quick_tips: string[]
  status: string
}

export interface StudyPlan {
  period: "daily" | "weekly"
  plan_mode: "daily" | "weekly"
  period_start: string
  period_end: string
  readiness: {
    score: number
    band: string
    components: ReadinessComponent[]
    gaps: ReadinessGap[]
  }
  items: PlanItem[]
  narration: {
    greeting?: string
    focus?: string
    nudge?: string
    weakness_note?: string
    next_best?: string | null
    generated_by?: string
  }
  progress: { done: number; total: number; percentage: number }
  generated_at: string
  source: string
  insights?: PlanInsights
  highlights?: PlanHighlights
  quota?: { used: number; limit: number; remaining: number | null; resets_at: string }
}

// ─── Calls ───────────────────────────────────────────────────────────────────
export async function fetchCapabilities(): Promise<Capabilities> {
  const { data } = await api.get("/ai/capabilities")
  return data
}

export async function fetchPlan(): Promise<StudyPlan> {
  const { data } = await api.get("/ai/coach/plan")
  return data
}

export async function refreshPlan(): Promise<StudyPlan> {
  const { data } = await api.post("/ai/coach/refresh")
  return data
}

export async function setPlanMode(mode: "daily" | "weekly"): Promise<StudyPlan> {
  const { data } = await api.patch("/ai/coach/mode", { mode })
  return data
}

/**
 * A study guide for one topic.
 *
 * Generated ONCE platform-wide, then served from MySQL to every student, so
 * this is free to call after the first student anywhere triggers it.
 */
export async function fetchTopicGuide(topic: string, kind = "aptitude"): Promise<TopicGuide> {
  const { data } = await api.get(`/ai/topic-guide/${encodeURIComponent(topic)}?kind=${kind}`)
  return data
}
