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


// ─── Mock interview ──────────────────────────────────────────────────────────
export type InterviewTrack = "company" | "domain" | "skill"
export type InterviewLevel = "internship" | "fresher" | "1-2" | "2-5"
export type InterviewRound = "hr" | "technical" | "mixed"

export interface InterviewTurn {
  turn: number
  question: string
  answer: string | null
  words?: number
  filler_words?: number
}

export interface InterviewReport {
  overall_score: number
  summary: string
  communication: number
  technical_depth: number
  structure: number
  confidence: number
  strengths: string[]
  improvements: string[]
  per_question: { turn: number; score: number; note: string }[]
  next_steps: string[]
  measured?: Record<string, number>
  generated_by?: string
}

export interface InterviewSession {
  session_uid: string
  track: InterviewTrack
  track_ref: string | null
  track_label: string
  level: InterviewLevel
  level_label: string
  round_type: InterviewRound
  round_label: string
  input_mode: string
  turn_count: number
  total_turns: number
  status: "in_progress" | "completed" | "abandoned"
  overall_score: number | null
  report: InterviewReport | null
  transcript?: InterviewTurn[]
  started_at: string
  completed_at: string | null
  quota?: { used: number; limit: number; remaining: number | null; resets_at: string }
}

export interface InterviewOptions {
  tracks: {
    company: { ref: string; label: string; logo?: string }[]
    domain: { ref: string; label: string; icon?: string }[]
    skill: { ref: string; label: string }[]
  }
  levels: { value: InterviewLevel; label: string }[]
  rounds: { value: InterviewRound; label: string }[]
  quota?: { used: number; limit: number; remaining: number | null; resets_at: string }
}

export async function fetchInterviewOptions(): Promise<InterviewOptions> {
  const { data } = await api.get("/ai/interview/options")
  return data
}

export async function startInterview(body: {
  track: InterviewTrack; track_ref?: string; level: InterviewLevel
  round: InterviewRound; input_mode: string; total_turns?: number
}): Promise<InterviewSession> {
  const { data } = await api.post("/ai/interview/start", body)
  return data
}

export async function fetchInterview(uid: string): Promise<InterviewSession> {
  const { data } = await api.get(`/ai/interview/${uid}`)
  return data
}

export async function answerInterview(uid: string, answer: string): Promise<{
  done: boolean; question?: string; turn?: number; total_turns?: number
  report?: InterviewReport; session?: InterviewSession
}> {
  const { data } = await api.post(`/ai/interview/${uid}/answer`, { answer })
  return data
}

export async function endInterview(uid: string): Promise<{
  report: InterviewReport | null; session: InterviewSession
}> {
  const { data } = await api.post(`/ai/interview/${uid}/end`)
  return data
}

export async function fetchInterviewHistory(): Promise<InterviewSession[]> {
  const { data } = await api.get("/ai/interview/history")
  return data
}
